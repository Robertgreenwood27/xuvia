import Stripe from "stripe";
import { createOrder } from "@/lib/printify";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { paymentIntentId, address, email, items } = await req.json();

  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (pi.status !== "succeeded") {
    return Response.json({ error: "Payment not completed" }, { status: 400 });
  }

  // In test mode, skip Printify order creation
  if (process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
    return Response.json({
      success: true,
      orderId: `TEST-${Date.now()}`,
    });
  }

  try {
    const order = await createOrder({
      label: `XUVIA-${Date.now()}`,
      line_items: items.map((i) => ({
        product_id: i.productId,
        variant_id: i.variantId,
        quantity: i.quantity,
      })),
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: {
        first_name: address.firstName,
        last_name: address.lastName,
        email,
        phone: address.phone || "",
        country: address.country,
        region: address.state,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        zip: address.zip,
      },
    });

    return Response.json({ success: true, orderId: order.id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}