// Server-only checkout logic. Prices, shipping, and the order contents all
// come from Printify and are stored on the Stripe PaymentIntent — the browser
// never decides what gets charged or what gets printed.
import { getProduct, calculateShipping, createOrder } from "@/lib/printify";

const MAX_LINES = 30;
const MAX_QTY = 20;
const ITEM_CHUNKS = 4; // Stripe metadata values cap at 500 chars
const ADDRESS_FIELDS = ["firstName", "lastName", "phone", "address1", "address2", "city", "state", "zip", "country"];

export class CheckoutError extends Error {}

// Validate cart lines and price them from Printify. Returns integer cents.
export async function priceItems(items) {
  if (!Array.isArray(items) || items.length === 0) throw new CheckoutError("Your cart is empty.");
  if (items.length > MAX_LINES) throw new CheckoutError("Too many items in cart.");

  const products = new Map();
  const lines = [];
  for (const i of items) {
    const productId = String(i.productId || "");
    const variantId = Number(i.variantId);
    const quantity = Number(i.quantity);
    if (!/^[a-f0-9]{24}$/i.test(productId) || !Number.isInteger(variantId) ||
        !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      throw new CheckoutError("Invalid item in cart.");
    }
    if (!products.has(productId)) products.set(productId, await getProduct(productId));
    const variant = products.get(productId).variants?.find((v) => v.id === variantId && v.is_enabled);
    if (!variant) throw new CheckoutError("An item in your cart is no longer available.");
    lines.push({ productId, variantId, quantity, unitCents: variant.price });
  }

  const subtotalCents = lines.reduce((s, l) => s + l.unitCents * l.quantity, 0);
  return { lines, subtotalCents };
}

function printifyAddress(address, email = "") {
  return {
    first_name: address.firstName || "Customer",
    last_name: address.lastName || "Customer",
    email,
    phone: address.phone || "",
    country: address.country,
    region: address.state,
    address1: address.address1,
    address2: address.address2 || "",
    city: address.city,
    zip: address.zip,
  };
}

function cleanAddress(address) {
  if (!address || typeof address !== "object") throw new CheckoutError("Missing shipping address.");
  const out = {};
  for (const f of ADDRESS_FIELDS) {
    const v = String(address[f] ?? "").trim();
    if (v.length > 200) throw new CheckoutError("Address is too long.");
    out[f] = v;
  }
  if (!out.address1 || !out.city || !out.state || !out.zip || !out.country) {
    throw new CheckoutError("Please complete your shipping address.");
  }
  return out;
}

// Full server-side quote for a cart going to an address.
export async function quoteOrder(items, rawAddress) {
  const address = cleanAddress(rawAddress);
  const { lines, subtotalCents } = await priceItems(items);
  const result = await calculateShipping(
    printifyAddress(address),
    lines.map((l) => ({ product_id: l.productId, variant_id: l.variantId, quantity: l.quantity }))
  );
  const shippingCents = result.standard ?? result.economy;
  if (!Number.isInteger(shippingCents)) throw new CheckoutError("Could not calculate shipping for this address.");
  return { address, lines, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}

// ─── PaymentIntent metadata encoding ─────────────────────────────────────

function encodeLines(lines) {
  const joined = lines.map((l) => `${l.productId}:${l.variantId}:${l.quantity}`).join(",");
  const chunks = {};
  for (let n = 0; n < ITEM_CHUNKS; n++) chunks[`items_${n}`] = joined.slice(n * 500, (n + 1) * 500);
  if (joined.length > ITEM_CHUNKS * 500) throw new CheckoutError("Too many items in cart.");
  return chunks;
}

function decodeLines(md) {
  let joined = "";
  for (let n = 0; n < ITEM_CHUNKS; n++) joined += md[`items_${n}`] || "";
  if (!joined) return [];
  return joined.split(",").map((s) => {
    const [productId, variantId, quantity] = s.split(":");
    return { product_id: productId, variant_id: Number(variantId), quantity: Number(quantity) };
  });
}

export function cartMetadata({ lines, subtotalCents }) {
  // Starting a checkout: no address or shipping yet, so not payable as an order.
  return { ...encodeLines(lines), subtotal_cents: String(subtotalCents), quoted: "0" };
}

export function quoteMetadata(quote) {
  const md = {
    ...encodeLines(quote.lines),
    subtotal_cents: String(quote.subtotalCents),
    shipping_cents: String(quote.shippingCents),
    total_cents: String(quote.totalCents),
    quoted: "1",
  };
  for (const f of ADDRESS_FIELDS) md[`ship_${f}`] = quote.address[f];
  return md;
}

// ─── Fulfillment ────────────────────────────────────────────────────────

// Create the Printify order for a paid PaymentIntent, exactly once.
// Returns { status: "placed" | "unpaid" | "failed", orderId?, retryable? }.
export async function fulfillPaymentIntent(stripe, pi) {
  if (pi.status !== "succeeded") return { status: "unpaid" };

  const md = pi.metadata || {};
  if (md.printify_order_id) return { status: "placed", orderId: md.printify_order_id };

  const fail = async (reason) => {
    console.error(`Fulfillment failed for ${pi.id}: ${reason}`);
    await stripe.paymentIntents.update(pi.id, { metadata: { fulfillment_error: reason.slice(0, 500) } });
    return { status: "failed" };
  };

  if (md.quoted !== "1") return fail("Paid without a shipping quote");
  if (Number(md.total_cents) !== pi.amount_received) {
    return fail(`Amount mismatch: paid ${pi.amount_received}, quoted ${md.total_cents}`);
  }
  const lineItems = decodeLines(md);
  if (lineItems.length === 0) return fail("No items on payment");
  const address = {};
  for (const f of ADDRESS_FIELDS) address[f] = md[`ship_${f}`] || "";
  if (!address.firstName || !address.lastName) return fail("Missing recipient name");

  // Test-mode payments never create real Printify orders.
  if (process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
    const orderId = `TEST-${pi.id}`;
    await stripe.paymentIntents.update(pi.id, { metadata: { printify_order_id: orderId } });
    return { status: "placed", orderId };
  }

  let order;
  try {
    order = await createOrder({
      external_id: pi.id,
      label: `XUVIA-${pi.id.slice(-8)}`,
      line_items: lineItems,
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: printifyAddress(address, pi.receipt_email || ""),
    });
  } catch (err) {
    // Printify errors are often temporary — the webhook asks Stripe to retry.
    return { ...(await fail(err.message)), retryable: true };
  }

  const orderId = String(order.id);
  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: { printify_order_id: orderId, fulfillment_error: "" },
    });
  } catch (err) {
    // The order exists; never report failure here or a retry would duplicate it.
    console.error(`Order ${orderId} placed for ${pi.id} but saving it to Stripe failed: ${err.message}`);
  }
  return { status: "placed", orderId };
}

export function webhookMode() {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}
