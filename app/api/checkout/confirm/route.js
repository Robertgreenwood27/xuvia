import Stripe from "stripe";
import { fulfillPaymentIntent, webhookMode } from "@/lib/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Called by the success page to learn what happened to a payment. When the
// Stripe webhook is configured it owns order creation and this only reports
// status; otherwise this places the order (still exactly once per payment).
export async function POST(req) {
  try {
    const { paymentIntentId } = await req.json();
    if (typeof paymentIntentId !== "string" || !paymentIntentId.startsWith("pi_")) {
      return Response.json({ status: "unknown" }, { status: 400 });
    }
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== "succeeded") {
      return Response.json({ status: pi.status === "processing" ? "processing" : "unpaid" });
    }
    if (pi.metadata?.printify_order_id) {
      return Response.json({ status: "placed", orderId: pi.metadata.printify_order_id });
    }
    if (pi.metadata?.fulfillment_error) return Response.json({ status: "failed" });
    if (webhookMode()) return Response.json({ status: "processing" });

    const result = await fulfillPaymentIntent(stripe, pi);
    return Response.json(result);
  } catch (err) {
    console.error("Confirm error:", err);
    return Response.json({ status: "failed" }, { status: 500 });
  }
}
