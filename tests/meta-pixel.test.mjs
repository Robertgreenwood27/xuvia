import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

let moduleId = 0;
const loadPixel = () => import(`../lib/meta-pixel.mjs?test=${++moduleId}`);

function browser(href = "https://xuvia.co/", { storage = new Map(), existingSdk = true } = {}) {
  const calls = [];
  const scripts = [];
  globalThis.window = {
    location: new URL(href),
    sessionStorage: {
      getItem: (key) => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
    },
    history: {
      state: { __NA: true },
      replaceState(state, unused, url) {
        this.state = state;
        window.location = new URL(url, window.location.href);
      },
    },
  };
  if (existingSdk) window.fbq = (...args) => calls.push(args);
  globalThis.document = {
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
  };
  return { calls, scripts, storage };
}

afterEach(() => { delete globalThis.window; delete globalThis.document; });

test("sends one initial PageView, leaves navigation to the SDK, and records product revisits", async () => {
  const { calls } = browser();
  const pixel = await loadPixel();
  pixel.trackPageView();
  pixel.trackPageView();
  window.location = new URL("https://xuvia.co/product/blue");
  const product = { printifyProductId: "blue", name: "P. metallica", price: 49.38 };
  pixel.trackProductView(product);
  pixel.trackPageView();
  pixel.trackProductView(product);
  window.location = new URL("https://xuvia.co/shop");
  pixel.trackPageView();
  window.location = new URL("https://xuvia.co/product/blue");
  pixel.trackProductView(product);
  assert.equal(calls.filter((call) => call[0] === "init").length, 1);
  assert.equal(calls.filter((call) => call[2] === "PageView").length, 1);
  assert.equal(calls.filter((call) => call[2] === "ViewContent").length, 2);
  assert.deepEqual(calls[0], ["set", "autoConfig", false, pixel.META_PIXEL_ID]);
  // History tracking must stay enabled, or subsequent navigations are lost.
  assert.notEqual(window.fbq.disablePushState, true);
});

test("queues events while the async SDK loads without adding duplicate scripts", async () => {
  const { scripts } = browser("https://xuvia.co/", { existingSdk: false });
  const pixel = await loadPixel();
  pixel.trackPageView();
  pixel.trackCartAddition({ productId: "blue", price: 49.38 });
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].async, true);
  assert.equal(scripts[0].src, "https://connect.facebook.net/en_US/fbevents.js");
  assert.deepEqual(window.fbq.queue.map((call) => call[0]), ["set", "init", "trackSingle", "trackSingle"]);
});

test("checkout and Purchase are deduplicated across polling, remounts and refreshes", async () => {
  const { calls, storage } = browser();
  let pixel = await loadPixel();
  const items = [{ productId: "blue", quantity: 2 }];
  const purchase = { eventId: "opaque-event-id", value: 107.13, currency: "USD" };
  pixel.trackCheckoutStart("pi_one", items, 98.76);
  pixel.trackCheckoutStart("pi_one", items, 98.76);
  pixel.trackPurchase(purchase);
  pixel.trackPurchase(purchase);
  assert.equal(calls.filter((call) => call[2] === "InitiateCheckout").length, 1);
  assert.equal(calls.filter((call) => call[2] === "Purchase").length, 1);
  assert.deepEqual(calls.find((call) => call[2] === "Purchase").slice(3), [
    { value: 107.13, currency: "USD" }, { eventID: "opaque-event-id" },
  ]);
  const refreshed = browser("https://xuvia.co/checkout/success", { storage });
  pixel = await loadPixel();
  pixel.trackPurchase(purchase);
  assert.equal(refreshed.calls.length, 0);
  pixel.trackPurchase({ ...purchase, eventId: "second-purchase" });
  assert.equal(refreshed.calls.filter((call) => call[2] === "Purchase").length, 1);
});

test("Stripe params block tracking until removed, and confirmation survives a refresh", async () => {
  const { calls } = browser("https://xuvia.co/checkout/success?payment_intent=pi_paid&payment_intent_client_secret=secret&redirect_status=succeeded&utm_source=facebook");
  const pixel = await loadPixel();
  pixel.trackPageView();
  assert.equal(calls.length, 0);
  assert.equal(pixel.preparePaymentReturn(), "pi_paid");
  assert.equal(window.location.href, "https://xuvia.co/checkout/success?utm_source=facebook");
  assert.equal(window.history.state.__NA, true);
  assert.equal(pixel.preparePaymentReturn(), "pi_paid");
  pixel.trackPageView();
  assert.equal(calls.filter((call) => call[2] === "PageView").length, 1);
});

test("tracking and denied storage never interrupt checkout", async () => {
  browser();
  window.sessionStorage.getItem = () => { throw Error("blocked"); };
  window.sessionStorage.setItem = () => { throw Error("blocked"); };
  const pixel = await loadPixel();
  const purchase = { eventId: "paid", value: 49.38, currency: "USD" };
  assert.doesNotThrow(() => pixel.trackPurchase(purchase));
  window.fbq = () => { throw Error("blocked SDK"); };
  assert.doesNotThrow(() => pixel.trackCartAddition({ productId: "blue", price: 49.38 }));
});

test("localhost, previews, empty purchase responses and server rendering produce no events", async () => {
  const { calls, scripts } = browser("https://xuvia-preview.vercel.app/");
  const pixel = await loadPixel();
  pixel.trackPageView();
  pixel.trackPurchase(null);
  pixel.trackPurchase({ eventId: "bad", value: 0, currency: "USD" });
  assert.deepEqual(calls, []);
  assert.deepEqual(scripts, []);
  delete globalThis.window;
  assert.doesNotThrow(() => pixel.trackPageView());
  assert.doesNotThrow(() => pixel.trackCartAddition({ productId: "blue", price: 49.38 }));
});
