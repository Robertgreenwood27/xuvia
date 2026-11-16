import { createHash } from "node:crypto";

// Accept only verified live Stripe payments for a fully quoted Xuvia order.
// No customer data or payment credentials are returned to the Pixel.
export function metaPurchaseForPayment(pi) {
  if (pi.status !== "succeeded" || pi.livemode !== true ||
      pi.metadata?.quoted !== "1" ||
      !Number.isInteger(pi.amount_received) || pi.amount_received <= 0 ||
      Number(pi.metadata.total_cents) !== pi.amount_received ||
      typeof pi.id !== "string" || !/^[a-z]{3}$/.test(pi.currency)) return null;
  return {
    eventId: createHash("sha256").update(`xuvia-purchase:${pi.id}`).digest("hex"),
    value: pi.amount_received / 100,
    currency: pi.currency.toUpperCase(),
  };
}
