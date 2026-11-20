// The Stripe account can serve other businesses; only tagged Xuvia checkouts belong here.
export const CHECKOUT_STORE = "xuvia";
export const isXuviaPaymentIntent = (pi) => pi?.metadata?.store === CHECKOUT_STORE;
