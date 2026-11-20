import Stripe from "stripe";
import { fulfillPaymentIntent } from "@/lib/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe calls this after a successful payment, even if the buyer closed the
// tab. Configure it in Stripe → Developers → Webhooks for the
// payment_intent.succeeded event and set STRIPE_WEBHOOK_SECRET.
export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 503 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature"), secret);
  } catch (err) {
    return new Response(`Invalid signature: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    // Re-read so a retry sees an order id saved by an earlier delivery.
    const pi = await stripe.paymentIntents.retrieve(event.data.object.id);
    const result = await fulfillPaymentIntent(stripe, pi);
    // A Printify or email delivery error gets a 500 so Stripe retries later.
    // Existing Printify orders are reused when retrying email. Anything else that
    // failed (bad quote, missing name) is recorded on the payment for manual
    // follow-up — retrying would hit the same problem.
    return Response.json({ received: true, ...result }, { status: result.retryable ? 500 : 200 });
  }

  return Response.json({ received: true });
}
