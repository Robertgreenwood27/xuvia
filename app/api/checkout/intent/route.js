import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { amount } = await req.json();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });
  return Response.json({ clientSecret: paymentIntent.client_secret, intentId: paymentIntent.id });
}

export async function PATCH(req) {
  const { intentId, amount } = await req.json();
  await stripe.paymentIntents.update(intentId, { amount: Math.round(amount * 100) });
  return Response.json({ ok: true });
}