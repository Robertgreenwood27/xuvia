import Stripe from "stripe";
import { fulfillPaymentIntent, webhookMode } from "@/lib/order";
import { metaPurchaseForPayment } from "@/lib/meta-purchase.mjs";

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
    const purchase = metaPurchaseForPayment(pi);
    if (pi.metadata?.printify_order_id) {
      // Without a webhook, this is also the retry path for confirmation email.
      if (!webhookMode()) {
        const result = await fulfillPaymentIntent(stripe, pi);
        return Response.json({ ...result, purchase });
      }
      return Response.json({ status: "placed", orderId: pi.metadata.printify_order_id, purchase });
    }
    if (pi.metadata?.fulfillment_error) return Response.json({ status: "failed", purchase });
    if (webhookMode()) return Response.json({ status: "processing", purchase });

    const result = await fulfillPaymentIntent(stripe, pi);
    return Response.json({ ...result, purchase });
  } catch (err) {
    console.error("Confirm error:", err);
    return Response.json({ status: "failed" }, { status: 500 });
  }
}
