// Server-only transactional email. Sending is opt-in and never runs for test payments.
import { createHash } from "node:crypto";
import { isXuviaPaymentIntent } from "./checkout-identity.mjs";

import { buildOrderEmail } from "./order-email-template.mjs";
export { buildOrderEmail };

const isEmail = (value) => typeof value === "string" && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(value);
const RETRY_WINDOW_MS = 23 * 60 * 60 * 1000; // Resend retains idempotency keys for 24 hours.

// Called only after an order exists. Email failure must never recreate that order.
// Dependencies are injectable so delivery and retry behavior can be tested offline.
export async function sendOrderConfirmation(stripe, pi, loadItems, {
  env = process.env, fetchImpl = fetch, now = Date.now(), log = console.error,
} = {}) {
  if (env.ORDER_EMAIL_ENABLED !== "true") return { emailStatus: "disabled" };
  const md = pi.metadata || {};
  if (!isXuviaPaymentIntent(pi) || pi.livemode !== true || pi.status !== "succeeded" || !md.printify_order_id ||
      md.printify_order_id.startsWith("TEST-") || md.quoted !== "1" ||
      !Number.isInteger(pi.amount_received) || pi.amount_received <= 0 ||
      Number(md.total_cents) !== pi.amount_received) return { emailStatus: "skipped" };
  if (md.confirmation_email_id) return { emailStatus: "sent" };

  const failed = (code, retryable = true) => {
    // Avoid logging API responses, addresses, HTML, credentials, or customer names.
    log(`Order confirmation ${pi.id}: ${code}`);
    return { emailStatus: code, retryable };
  };
  const startAt = Date.parse(env.ORDER_EMAIL_START_AT || "");
  const from = env.ORDER_EMAIL_FROM || "Robert at Xuvia <hello@xuvia.co>";
  const replyTo = env.ORDER_EMAIL_REPLY_TO || "hello@xuvia.co";
  const sender = from.match(/<([^<>]+)>$/)?.[1] || from;
  if (!env.RESEND_API_KEY || !Number.isFinite(startAt) || !isEmail(sender) || !isEmail(replyTo)) {
    return failed("configuration_required");
  }
  // Never backfill historical purchases when the feature is first enabled.
  if (!Number.isFinite(pi.created) || pi.created * 1000 < startAt) return { emailStatus: "before_launch" };
  if (!isEmail(pi.receipt_email)) return failed("invalid_recipient", false);

  const requestedAt = md.confirmation_email_requested_at;
  if (requestedAt && (!Number.isFinite(Number(requestedAt)) || now - Number(requestedAt) >= RETRY_WINDOW_MS)) {
    // An earlier send might have succeeded even if saving its result failed.
    // Stop automatic retries before Resend forgets the original idempotency key.
    return failed("delivery_needs_review", false);
  }
  try {
    const payload = buildOrderEmail(pi, await loadItems(), { from, replyTo });
    const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    if (requestedAt && md.confirmation_email_payload_hash !== hash) {
      return failed("delivery_needs_review", false);
    }
    if (!requestedAt) {
      // Persist intent before contacting Resend, including a hash to keep retries identical.
      await stripe.paymentIntents.update(pi.id, { metadata: {
        confirmation_email_requested_at: String(now), confirmation_email_payload_hash: hash,
      } });
    }
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST", headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json",
        "Idempotency-Key": `xuvia-order-confirmation/${pi.id}`,
      },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return failed(`provider_error_${response.status}`);
    const result = await response.json();
    if (typeof result.id !== "string" || !result.id) return failed("invalid_provider_response");
    await stripe.paymentIntents.update(pi.id, { metadata: { confirmation_email_id: result.id } });
    return { emailStatus: "sent" };
  } catch {
    return failed("delivery_pending");
  }
}
