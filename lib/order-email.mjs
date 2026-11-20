// Server-only transactional email. Sending is opt-in and never runs for test payments.
import { createHash } from "node:crypto";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));
const isEmail = (value) => typeof value === "string" && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(value);
const RETRY_WINDOW_MS = 23 * 60 * 60 * 1000; // Resend retains idempotency keys for 24 hours.

export function buildOrderEmail(pi, items, { from, replyTo }) {
  const md = pi.metadata;
  const money = (cents) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: pi.currency.toUpperCase(),
  }).format(Number(cents) / 100);
  const reference = `XUVIA-${pi.id.slice(-8)}`;
  const address = [
    `${md.ship_firstName || ""} ${md.ship_lastName || ""}`.trim(),
    md.ship_address1, md.ship_address2,
    [md.ship_city, md.ship_state, md.ship_zip].filter(Boolean).join(", "),
    md.ship_country,
  ].filter(Boolean);
  const greeting = `Hi ${md.ship_firstName || "there"},`;
  const thankYou = "Thank you for your order—and for supporting Xuvia. Every design starts with my love for tarantulas, and I’m glad one found its way to you.";
  const next = "Your payment is confirmed, and your order has been received by our print partner. Each piece is made to order, so printing comes next.";
  const shipping = "You’ll receive a shipping email with tracking once your order ships. Stripe sends your payment receipt separately.";
  const contact = "If you have any questions, just reply to this email. I read and answer every message myself.";
  const description = (item) => `${item.title}${item.variant ? ` · ${item.variant}` : ""}`;
  const totals = [["Subtotal", money(md.subtotal_cents)], ["Shipping", money(md.shipping_cents)], ["Total paid", money(pi.amount_received)]];
  const text = [greeting, thankYou, next, `Your order: ${reference}`,
    items.map((item) => `${item.quantity} × ${description(item)}`).join("\n"),
    totals.map(([label, value]) => `${label}: ${value}`).join("\n"),
    `Shipping to:\n${address.join("\n")}`, shipping, contact, "Thanks again,\nRobert\nXuvia\nhttps://xuvia.co",
  ].join("\n\n");
  const paragraph = (value) => `<p style="margin:0 0 20px;">${escapeHtml(value)}</p>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Thanks for your order</title></head>
<body style="margin:0;padding:24px 12px;background:#0a0a0b;color:#d4cfc8;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" style="width:100%;max-width:580px;margin:auto;border-collapse:collapse;background:#111114;border:1px solid #353139;"><tr><td style="padding:28px 24px;border-bottom:1px solid #353139;">
<a href="https://xuvia.co" style="font-family:Georgia,serif;font-size:28px;letter-spacing:7px;color:#c8a96e;text-decoration:none;">XUVIA</a>
</td></tr><tr><td style="padding:28px 24px;font-size:15px;line-height:1.7;color:#d4cfc8;">
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:25px;line-height:1.3;color:#c8a96e;margin:0 0 24px;">Thanks for your order.</h1>
${[greeting, thankYou, next].map(paragraph).join("")}
<h2 style="font-size:15px;color:#c8a96e;margin:28px 0 12px;">${escapeHtml(reference)}</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px;color:#d4cfc8;">${items.map((item) => `<tr><td style="padding:10px 0;border-bottom:1px solid #353139;">${escapeHtml(description(item))}</td><td style="padding:10px 0 10px 12px;text-align:right;white-space:nowrap;vertical-align:top;">× ${escapeHtml(item.quantity)}</td></tr>`).join("")}
${totals.map(([label, value]) => `<tr><th scope="row" style="text-align:left;padding:8px 0;font-weight:normal;">${escapeHtml(label)}</th><td style="text-align:right;padding:8px 0;white-space:nowrap;">${escapeHtml(value)}</td></tr>`).join("")}</table>
<h2 style="font-size:14px;color:#c8a96e;margin:24px 0 8px;">Shipping to</h2><p style="margin:0 0 24px;">${address.map(escapeHtml).join("<br>")}</p>
${[shipping, contact].map(paragraph).join("")}${paragraph("Thanks again,")}<p style="margin:0;">Robert<br>Xuvia</p>
</td></tr><tr><td style="padding:20px 24px;border-top:1px solid #353139;font-size:12px;color:#b4aaa0;"><a href="https://xuvia.co" style="color:#c8a96e;">xuvia.co</a> · <a href="mailto:${escapeHtml(replyTo)}" style="color:#c8a96e;">${escapeHtml(replyTo)}</a></td></tr></table></body></html>`;
  return { from, to: [pi.receipt_email], reply_to: replyTo, subject: `Thanks for your order — ${reference}`, html, text };
}

// Called only after an order exists. Email failure must never recreate that order.
// Dependencies are injectable so delivery and retry behavior can be tested offline.
export async function sendOrderConfirmation(stripe, pi, loadItems, {
  env = process.env, fetchImpl = fetch, now = Date.now(), log = console.error,
} = {}) {
  if (env.ORDER_EMAIL_ENABLED !== "true") return { emailStatus: "disabled" };
  const md = pi.metadata || {};
  if (pi.livemode !== true || pi.status !== "succeeded" || !md.printify_order_id ||
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
