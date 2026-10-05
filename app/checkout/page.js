"use client";

import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { CONTACT_EMAIL, PRODUCTION_DAYS } from "@/lib/site";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
];

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
  ["DC","Washington D.C."],
];

const CA_PROVINCES = [
  ["AB","Alberta"],["BC","British Columbia"],["MB","Manitoba"],["NB","New Brunswick"],
  ["NL","Newfoundland"],["NS","Nova Scotia"],["ON","Ontario"],["PE","Prince Edward Island"],
  ["QC","Quebec"],["SK","Saskatchewan"],
];

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function formatZip(value, country) {
  if (country === "US") return value.replace(/\D/g, "").slice(0, 5);
  if (country === "CA") {
    const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
    return clean.length > 3 ? `${clean.slice(0,3)} ${clean.slice(3)}` : clean;
  }
  return value.slice(0, 10);
}

const inputStyle = {
  background: "var(--ash)",
  border: "1px solid var(--border)",
  color: "var(--bone)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  letterSpacing: "0.05em",
  padding: "0.75rem 1rem",
  width: "100%",
  outline: "none",
  borderRadius: 0,
};

const labelStyle = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: "0.65rem",
  letterSpacing: "0.2em",
  color: "var(--muted)",
  marginBottom: "0.4rem",
};

const stripeAppearance = {
  theme: "night",
  variables: {
    colorPrimary: "#c8a96e",
    colorBackground: "#1a1a1b",
    colorText: "#e8e0d0",
    colorDanger: "#ff6b6b",
    fontFamily: "monospace",
    borderRadius: "0px",
  },
  rules: {
    ".Input": { border: "1px solid #2a2a2b", padding: "12px 16px" },
    ".Input:focus": { border: "1px solid #c8a96e", boxShadow: "none" },
    ".Label": { fontSize: "0.65rem", letterSpacing: "0.2em", color: "#888" },
  },
};

async function lockQuote({ intentId, items, address, email }) {
  const res = await fetch("/api/checkout/intent", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intentId,
      email,
      address,
      items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Checkout error");
  return data;
}

function CheckoutForm({ items, intentId, subtotal: initialSubtotal }) {
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address1: "", address2: "", city: "", state: "", zip: "", country: "US",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [subtotal, setSubtotal] = useState(initialSubtotal);

  const addressFields = ["address1","address2","city","state","zip","country"];

  const set = (k) => (e) => {
    let value = e.target.value;
    if (k === "phone") value = formatPhone(value);
    if (k === "zip") value = formatZip(value, form.country);
    if (k === "country") { setForm((f) => ({ ...f, country: value, state: "", zip: "" })); setShipping(null); return; }
    if (addressFields.includes(k)) setShipping(null);
    setForm((f) => ({ ...f, [k]: value }));
  };

  // Shipping only depends on where it's going, so quote it as soon as the
  // address is filled in — before asking for contact or payment details.
  const addressReady = form.address1 && form.city && form.state && form.zip && form.country;
  const quoteSeq = useRef(0);

  useEffect(() => {
    if (!addressReady) return;
    const seq = ++quoteSeq.current;
    const timer = setTimeout(async () => {
      setShippingLoading(true);
      setShippingError("");
      try {
        const data = await lockQuote({ intentId, items, address: form });
        if (seq === quoteSeq.current) {
          setSubtotal(data.subtotal);
          setShipping(data.shipping);
        }
      } catch (err) {
        if (seq === quoteSeq.current) setShippingError(err.message || "Could not calculate shipping. Please check your address.");
      } finally {
        if (seq === quoteSeq.current) setShippingLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressReady, form.address1, form.address2, form.city, form.state, form.zip, form.country, intentId, items]);

  const total = subtotal + (shipping ?? 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || items.length === 0) return;
    setLoading(true);
    setError("");

    // Lock the final name/email/phone onto the payment and make sure the
    // amount the server will charge still matches what the buyer sees.
    try {
      const data = await lockQuote({ intentId, items, address: form, email: form.email });
      if (Math.round(data.total * 100) !== Math.round(total * 100)) {
        setSubtotal(data.subtotal);
        setShipping(data.shipping);
        setError(`Your total was updated to $${data.total.toFixed(2)}. Please review and pay again.`);
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err.message || "Could not confirm your order details. Please try again.");
      setLoading(false);
      return;
    }

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: form.email,
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    }
    // On success Stripe redirects automatically
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* ─── FORM ─────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-8">
          {/* Shipping */}
          <div>
            <p className="font-display text-xs mb-5" style={{ color: "var(--ember)", letterSpacing: "0.25em" }}>SHIPPING ADDRESS</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>FIRST NAME</label>
                  <input required value={form.firstName} onChange={set("firstName")} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>LAST NAME</label>
                  <input required value={form.lastName} onChange={set("lastName")} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>COUNTRY</label>
                <select required value={form.country} onChange={set("country")} style={{ ...inputStyle, cursor: "pointer" }}>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>ADDRESS LINE 1</label>
                <input required value={form.address1} onChange={set("address1")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>ADDRESS LINE 2 (OPTIONAL)</label>
                <input value={form.address2} onChange={set("address2")} style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label style={labelStyle}>CITY</label>
                  <input required value={form.city} onChange={set("city")} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>STATE / REGION</label>
                  {form.country === "US" ? (
                    <select required value={form.state} onChange={set("state")} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select...</option>
                      {US_STATES.map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  ) : form.country === "CA" ? (
                    <select required value={form.state} onChange={set("state")} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select...</option>
                      {CA_PROVINCES.map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    <input required value={form.state} onChange={set("state")} style={inputStyle} />
                  )}
                </div>
                <div>
                  <label style={labelStyle}>
                    {form.country === "US" ? "ZIP CODE" : "POSTAL CODE"}
                  </label>
                  <input
                    required
                    value={form.zip}
                    onChange={set("zip")}
                    placeholder={form.country === "US" ? "12345" : form.country === "CA" ? "A1A 1A1" : ""}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Live shipping quote */}
              <p className="font-mono text-xs" style={{ color: shippingError ? "#ff6b6b" : "var(--muted)" }}>
                {shippingError
                  ? shippingError
                  : shippingLoading
                  ? "Calculating shipping..."
                  : shipping !== null
                  ? `Shipping to ${form.zip}: $${shipping.toFixed(2)} · arrives in ${PRODUCTION_DAYS}`
                  : "Enter your address to see shipping — no payment details needed yet."}
              </p>
            </div>
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* Contact */}
          <div>
            <p className="font-display text-xs mb-5" style={{ color: "var(--ember)", letterSpacing: "0.25em" }}>CONTACT</p>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>For your receipt and tracking. No newsletters unless you ask.</p>
            <div>
              <label style={labelStyle}>EMAIL ADDRESS</label>
              <input required type="email" value={form.email} onChange={set("email")} style={inputStyle} />
            </div>
            <div className="mt-4">
              <label style={labelStyle}>PHONE (ONLY USED IF THERE&apos;S A DELIVERY ISSUE)</label>
              <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="(555) 555-5555" style={inputStyle} />
            </div>
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* Payment */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="font-display text-xs" style={{ color: "var(--ember)", letterSpacing: "0.25em" }}>PAYMENT</p>
              <p className="flex items-center gap-1.5 font-mono text-xs" style={{ color: "var(--muted)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Secured by Stripe
              </p>
            </div>
            <PaymentElement />
            <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
              Your card details go directly to Stripe over an encrypted connection. XUVIA never sees or stores your card number.
            </p>
          </div>

          {error && (
            <p className="font-mono text-xs p-4" style={{ color: "#ff6b6b", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !stripe || shipping === null}
            className="btn-primary w-full justify-center"
            style={{ fontSize: "0.75rem", opacity: (loading || shipping === null) ? 0.6 : 1 }}
          >
            {loading ? "Processing..." : shipping === null ? "Enter address to continue" : `Pay $${total.toFixed(2)}`}
            {!loading && shipping !== null && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>

          <p className="font-mono text-xs text-center" style={{ color: "var(--muted)" }}>
            Printed to order and shipped in {PRODUCTION_DAYS} ·{" "}
            <Link href="/shipping-returns" className="underline">Shipping &amp; returns</Link> ·{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>
          </p>
        </div>

        {/* ─── ORDER SUMMARY ─────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-28" style={{ background: "var(--ash)", border: "1px solid var(--border)", padding: "1.5rem" }}>
            <p className="font-display text-xs mb-5" style={{ color: "var(--ember)", letterSpacing: "0.25em" }}>ORDER SUMMARY</p>
            <ul className="space-y-4 mb-6">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                  <div className="relative shrink-0 overflow-hidden" style={{ width: 56, height: 62, background: "var(--void)", border: "1px solid var(--border)" }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-xs" style={{ color: "var(--border)" }}>X</span>
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center font-mono text-xs rounded-full" style={{ background: "var(--ember)", color: "var(--obsidian)", fontSize: "0.55rem" }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-xs tracking-wider" style={{ color: "var(--bone)" }}>{item.name}</p>
                    <p className="font-mono text-xs" style={{ color: "var(--muted)" }}>{item.size}</p>
                  </div>
                  <p className="font-mono text-xs" style={{ color: "var(--bone)" }}>${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <hr style={{ borderColor: "var(--border)", marginBottom: "1rem" }} />
            <div className="flex justify-between mb-2">
              <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>Subtotal</span>
              <span className="font-mono text-xs" style={{ color: "var(--bone)" }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>Shipping</span>
              <span className="font-mono text-xs" style={{ color: "var(--bone)" }}>
                {shipping === null ? "Enter address" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <hr style={{ borderColor: "var(--border)", marginBottom: "1rem" }} />
            <div className="flex justify-between">
              <span className="font-display text-xs tracking-widest" style={{ color: "var(--bone)" }}>TOTAL</span>
              <span className="font-display text-sm" style={{ color: "var(--ember)" }}>
                {shipping === null ? `$${subtotal.toFixed(2)}+` : `$${total.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { items } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [intentId, setIntentId] = useState(null);
  const [subtotal, setSubtotal] = useState(null);
  const [startError, setStartError] = useState("");

  useEffect(() => {
    if (items.length === 0) return;
    fetch("/api/checkout/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
        setIntentId(data.intentId);
        setSubtotal(data.subtotal);
      })
      .catch((err) => setStartError(err.message || "Checkout is temporarily unavailable."));
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="font-display text-xl tracking-widest" style={{ color: "var(--muted)" }}>Your cart is empty</p>
          <Link href="/shop" className="btn-primary" style={{ fontSize: "0.7rem" }}>Browse Collection</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        <p className="font-mono text-xs mb-2" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>XUVIA / CHECKOUT</p>
        <h1 className="font-display text-3xl md:text-4xl mb-14" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
          Complete Your Order
        </h1>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
            <CheckoutForm items={items} subtotal={subtotal} intentId={intentId} />
          </Elements>
        ) : (
          <div className="py-20 text-center">
            {startError ? (
              <p className="font-mono text-xs" style={{ color: "#ff6b6b" }}>
                {startError} Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>
              </p>
            ) : (
              <p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.3em" }}>Preparing checkout...</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}