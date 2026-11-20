import test from "node:test";
import assert from "node:assert/strict";
import { buildOrderEmail, sendOrderConfirmation } from "../lib/order-email.mjs";

const now = Date.parse("2026-11-20T18:00:00Z");
const env = {
  RESEND_API_KEY: "test-only-key", ORDER_EMAIL_ENABLED: "true",
  ORDER_EMAIL_START_AT: "2026-11-20T17:00:00Z",
};
const items = [{ title: "Gooty Sapphire shirt", variant: "Black / M", quantity: 2 }];
function payment() {
  return {
    id: "pi_example12345678", status: "succeeded", livemode: true,
    created: now / 1000, receipt_email: "customer@example.com", currency: "usd",
    amount_received: 6500,
    metadata: {
      store: "xuvia", quoted: "1", printify_order_id: "printify-order-1", total_cents: "6500",
      subtotal_cents: "5800", shipping_cents: "700", ship_firstName: "Alex",
      ship_lastName: "Example", ship_address1: "123 Example Street",
      ship_city: "Denver", ship_state: "CO", ship_zip: "80201", ship_country: "US",
    },
  };
}
function harness(pi = payment()) {
  const requests = [], updates = [];
  let failSave = false;
  const stripe = { paymentIntents: { update: async (id, update) => {
    if (failSave && update.metadata.confirmation_email_id) throw new Error("storage unavailable");
    updates.push(update.metadata);
    Object.assign(pi.metadata, update.metadata);
  } } };
  const fetchImpl = async (url, init) => {
    requests.push({ url, ...init });
    return { ok: true, json: async () => ({ id: "email-1" }) };
  };
  const options = { env, fetchImpl, now, log: () => {} };
  return { pi, stripe, requests, updates, options, failSaving: (value) => { failSave = value; },
    send: (overrides = {}) => sendOrderConfirmation(stripe, pi, async () => items, { ...options, ...overrides }),
  };
}

test("email contains the paid total, item details, address, and accurate next steps", () => {
  const message = buildOrderEmail(payment(), items, { from: "Xuvia <hello@xuvia.co>", replyTo: "hello@xuvia.co" });
  assert.deepEqual(message.to, ["customer@example.com"]);
  assert.equal(message.reply_to, "hello@xuvia.co");
  for (const part of ["$65.00", "$58.00", "$7.00", "Gooty Sapphire shirt", "Black / M", "123 Example Street", "XUVIA-12345678"]) {
    assert.ok(message.text.includes(part), part);
    assert.ok(message.html.includes(part), part);
  }
  assert.ok(message.text.includes("received by our print partner"));
  assert.ok(!message.text.includes("in production"));
  assert.ok(!JSON.stringify(message).includes("printify-order-1"));
});

test("customer and product text cannot introduce HTML or links", () => {
  const pi = payment();
  pi.metadata.ship_firstName = '<img src="https://bad.test">';
  pi.metadata.ship_address1 = "<script>alert(1)</script>";
  const message = buildOrderEmail(pi, [{ title: "<b>Product</b>", quantity: 1, image: "javascript:alert(1)" }], { from: "hello@xuvia.co", replyTo: "hello@xuvia.co" });
  assert.ok(!message.html.includes("<script>"));
  assert.ok(!message.html.includes('<img src="https://bad.test"'));
  assert.ok(message.html.includes("&lt;b&gt;Product&lt;/b&gt;"));
  assert.ok(!message.html.includes("javascript:"));
  const validImage = "https://images.printify.com/mockup/example.png";
  const withImage = buildOrderEmail(payment(), [{ ...items[0], image: validImage }], { from: "hello@xuvia.co", replyTo: "hello@xuvia.co" });
  assert.ok(withImage.html.includes(validImage));
});

test("disabled, test, unpaid, unfulfilled, inconsistent, and historical payments do not send", async () => {
  for (const change of [
    { livemode: false }, { status: "processing" }, { amount_received: 1 },
    { created: now / 1000 - 86400 }, { metadata: { printify_order_id: "" } },
    { metadata: { printify_order_id: "TEST-pi_example" } }, { metadata: { quoted: "0" } },
    { metadata: { store: "another-business" } }, { metadata: { store: "" } },
  ]) {
    const pi = payment();
    if (change.metadata) Object.assign(pi.metadata, change.metadata);
    else Object.assign(pi, change);
    const h = harness(pi);
    await h.send();
    assert.equal(h.requests.length, 0);
    assert.equal(h.updates.length, 0);
  }
  const h = harness();
  await h.send({ env: { ...env, ORDER_EMAIL_ENABLED: "false" } });
  assert.equal(h.requests.length, 0);
});

test("delivery is recorded on the payment and later webhook retries do not send again", async () => {
  const h = harness();
  assert.deepEqual(await h.send(), { emailStatus: "sent" });
  assert.equal(h.pi.metadata.confirmation_email_id, "email-1");
  assert.equal(h.pi.metadata.printify_order_id, "printify-order-1");
  assert.equal(h.updates[0].confirmation_email_requested_at, String(now));
  const request = h.requests[0];
  assert.equal(request.url, "https://api.resend.com/emails");
  assert.equal(request.headers["Idempotency-Key"], `xuvia-order-confirmation/${h.pi.id}`);
  assert.equal(request.headers.Authorization, `Bearer ${env.RESEND_API_KEY}`);
  await h.send();
  assert.equal(h.requests.length, 1);
});

test("a send accepted by Resend but not saved to Stripe retries with the same request and key", async () => {
  const h = harness();
  h.failSaving(true);
  assert.deepEqual(await h.send(), { emailStatus: "delivery_pending", retryable: true });
  assert.equal(h.pi.metadata.printify_order_id, "printify-order-1");
  h.failSaving(false);
  assert.deepEqual(await h.send(), { emailStatus: "sent" });
  assert.equal(h.requests[0].headers["Idempotency-Key"], h.requests[1].headers["Idempotency-Key"]);
  assert.equal(h.requests[0].body, h.requests[1].body);
});

test("uncertain delivery stops before the provider's deduplication window expires", async () => {
  const h = harness();
  h.failSaving(true);
  await h.send();
  assert.deepEqual(await h.send({ now: now + 23 * 3600000 }), { emailStatus: "delivery_needs_review", retryable: false });
  assert.equal(h.requests.length, 1);
});

test("changed payloads are held for review rather than risking a different repeated email", async () => {
  const h = harness();
  h.failSaving(true);
  await h.send();
  h.pi.receipt_email = "changed@example.com";
  assert.deepEqual(await h.send(), { emailStatus: "delivery_needs_review", retryable: false });
  assert.equal(h.requests.length, 1);
});

test("configuration, provider, and storage errors never clear an existing fulfillment", async () => {
  const h = harness();
  assert.equal((await h.send({ env: { ...env, RESEND_API_KEY: "" } })).emailStatus, "configuration_required");
  assert.equal(h.requests.length, 0);
  const failed = await h.send({ fetchImpl: async () => ({ ok: false, status: 429 }) });
  assert.deepEqual(failed, { emailStatus: "provider_error_429", retryable: true });
  assert.equal(h.pi.metadata.printify_order_id, "printify-order-1");
  assert.ok(!h.pi.metadata.confirmation_email_id);
  assert.equal((await h.send()).emailStatus, "sent");
  const h2 = harness();
  h2.stripe.paymentIntents.update = async () => { throw new Error("Stripe unavailable"); };
  assert.equal((await h2.send()).emailStatus, "delivery_pending");
  assert.equal(h2.requests.length, 0);
});

test("invalid recipients never reach the email provider", async () => {
  const h = harness();
  h.pi.receipt_email = "customer@example.com\r\nBcc:other@example.com";
  assert.deepEqual(await h.send(), { emailStatus: "invalid_recipient", retryable: false });
  assert.equal(h.requests.length, 0);
});
