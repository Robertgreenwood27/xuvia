import test from "node:test";
import assert from "node:assert/strict";
import { metaPurchaseForPayment } from "../lib/meta-purchase.mjs";

const paid = {
  id: "pi_example",
  status: "succeeded",
  livemode: true,
  amount_received: 5737,
  currency: "usd",
  client_secret: "must-never-leave-the-server",
  receipt_email: "customer@example.com",
  metadata: { quoted: "1", total_cents: "5737", ship_firstName: "Customer" },
};

test("purchase uses the verified charged total and exposes no customer or payment credentials", () => {
  const purchase = metaPurchaseForPayment(paid);
  assert.equal(purchase.value, 57.37);
  assert.equal(purchase.currency, "USD");
  assert.match(purchase.eventId, /^[a-f0-9]{64}$/);
  assert.deepEqual(Object.keys(purchase).sort(), ["currency", "eventId", "value"]);
  const serialized = JSON.stringify(purchase);
  for (const sensitive of [paid.id, paid.client_secret, paid.receipt_email, "Customer"]) {
    assert.ok(!serialized.includes(sensitive));
  }
});

test("purchase event ID stays stable through polling and changes for a different payment", () => {
  assert.equal(metaPurchaseForPayment(paid).eventId, metaPurchaseForPayment(paid).eventId);
  assert.notEqual(metaPurchaseForPayment(paid).eventId,
    metaPurchaseForPayment({ ...paid, id: "pi_second" }).eventId);
});

test("unpaid, processing, test-mode, unquoted and inconsistent payments never count as purchases", () => {
  for (const invalid of [
    { status: "requires_payment_method" },
    { status: "processing" },
    { livemode: false },
    { amount_received: 0 },
    { amount_received: 5737.5 },
    { metadata: { quoted: "0", total_cents: "5737" } },
    { metadata: { quoted: "1", total_cents: "4900" } },
    { currency: "" },
  ]) assert.equal(metaPurchaseForPayment({ ...paid, ...invalid }), null);
});
