import Stripe from "stripe";
import { priceItems, quoteOrder, cartMetadata, quoteMetadata, CheckoutError } from "@/lib/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function errorResponse(err) {
  if (err instanceof CheckoutError) return Response.json({ error: err.message }, { status: 400 });
  console.error("Checkout intent error:", err);
  return Response.json({ error: "Checkout is temporarily unavailable. Please try again." }, { status: 500 });
}

// Start a checkout. The amount is priced from Printify, not taken from the browser.
export async function POST(req) {
  try {
    const { items } = await req.json();
    const priced = await priceItems(items);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priced.subtotalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: cartMetadata(priced),
    });
    return Response.json({
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id,
      subtotal: priced.subtotalCents / 100,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

// Quote shipping for an address and lock the cart, address, and total onto
// the PaymentIntent. Called whenever the address changes and once more right
// before payment with the buyer's name, email, and phone.
export async function PATCH(req) {
  try {
    const { intentId, items, address, email } = await req.json();
    if (typeof intentId !== "string" || !intentId.startsWith("pi_")) throw new CheckoutError("Invalid checkout session.");
    const quote = await quoteOrder(items, address);
    const update = { amount: quote.totalCents, metadata: quoteMetadata(quote) };
    if (typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) update.receipt_email = email;
    await stripe.paymentIntents.update(intentId, update);
    return Response.json({
      subtotal: quote.subtotalCents / 100,
      shipping: quote.shippingCents / 100,
      total: quote.totalCents / 100,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
