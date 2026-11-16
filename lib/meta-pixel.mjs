// The Pixel ID is public. Preview deployments and localhost stay quiet unless
// explicitly enabled for testing (with Meta requests intercepted).
export const META_PIXEL_ID = "1968544077636733";
const STRIPE_PARAMS = ["payment_intent", "payment_intent_client_secret", "redirect_status"];
let initialized = false;
let lastPage = null;
let lastProduct = null;
const sentOnce = new Set();

function initialize() {
  if (typeof window === "undefined") return false;
  if (!["xuvia.co", "www.xuvia.co"].includes(window.location.hostname) &&
      process.env.NEXT_PUBLIC_META_PIXEL_DEBUG !== "true") return false;
  // Never load the SDK or send an event with Stripe redirect credentials in
  // the URL. The success page captures and removes them before tracking.
  const url = new URL(window.location.href);
  if (STRIPE_PARAMS.some((key) => url.searchParams.has(key))) return false;
  if (initialized) return true;

  if (!window.fbq) {
    const fbq = function (...args) {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
      else fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  // Send only the explicit events below; do not collect form fields or
  // infer purchases from button clicks. Advanced matching is not enabled.
  window.fbq("set", "autoConfig", false, META_PIXEL_ID);
  window.fbq("init", META_PIXEL_ID);
  initialized = true;
  return true;
}

function track(event, data = {}, options = {}) {
  try {
    if (!initialize()) return false;
    window.fbq("trackSingle", META_PIXEL_ID, event, data, options);
    return true;
  } catch {
    // Analytics must never interrupt adding to cart or completing checkout.
    return false;
  }
}

function trackOnce(key, event, data, options) {
  if (sentOnce.has(key)) return;
  try {
    if (window.sessionStorage.getItem(key)) return;
  } catch {}
  if (!track(event, data, options)) return;
  sentOnce.add(key);
  try { window.sessionStorage.setItem(key, "1"); } catch {}
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  const page = window.location.pathname;
  if (lastPage === page) return;
  if (track("PageView")) {
    lastPage = page;
    lastProduct = null;
  }
}

export function trackProductView(product) {
  if (!product?.printifyProductId) return;
  trackPageView();
  if (lastProduct === product.printifyProductId) return;
  if (track("ViewContent", {
    content_ids: [product.printifyProductId],
    content_type: "product",
    content_name: product.name,
    value: product.price,
    currency: "USD",
  })) lastProduct = product.printifyProductId;
}

export function trackCartAddition(item) {
  track("AddToCart", {
    content_ids: [item.productId],
    content_type: "product",
    contents: [{ id: item.productId, quantity: 1, item_price: item.price }],
    value: item.price,
    currency: "USD",
  });
}

export function trackCheckoutStart(intentId, items, subtotal) {
  trackOnce(`xuvia-checkout-${intentId}`, "InitiateCheckout", {
    content_ids: [...new Set(items.map((item) => item.productId))],
    contents: items.map((item) => ({ id: item.productId, quantity: item.quantity })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    value: subtotal,
    currency: "USD",
  });
}

export function trackPurchase(purchase) {
  if (!purchase || typeof purchase.eventId !== "string" ||
      !Number.isFinite(purchase.value) || purchase.value <= 0 ||
      !/^[A-Z]{3}$/.test(purchase.currency)) return;
  // The server supplies this only after verifying a successful live payment.
  trackOnce(`xuvia-purchase-${purchase.eventId}`, "Purchase", {
    value: purchase.value,
    currency: purchase.currency,
  }, { eventID: purchase.eventId });
}

export function preparePaymentReturn() {
  const url = new URL(window.location.href);
  const paymentIntent = url.searchParams.get("payment_intent") ||
    window.history.state?.xuviaPaymentIntent;
  if (STRIPE_PARAMS.some((key) => url.searchParams.has(key))) {
    for (const key of STRIPE_PARAMS) url.searchParams.delete(key);
    // History state survives refresh, so confirming an order still works
    // after removing Stripe credentials from the address bar.
    try {
      window.history.replaceState(
        { ...window.history.state, xuviaPaymentIntent: paymentIntent },
        "", `${url.pathname}${url.search}${url.hash}`
      );
    } catch {
      // Keep order confirmation working even if history changes are blocked.
      // initialize() refuses tracking while redirect credentials remain.
    }
  }
  return paymentIntent;
}
