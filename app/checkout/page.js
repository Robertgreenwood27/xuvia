"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address1: "", address2: "", city: "", state: "", zip: "", country: "US",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          address: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            address1: form.address1,
            address2: form.address2,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(`/checkout/success?order=${data.orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* ─── FORM ─────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-8">
              {/* Contact */}
              <div>
                <p className="font-display text-xs mb-5" style={{ color: "var(--ember)", letterSpacing: "0.25em" }}>
                  CONTACT
                </p>
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
                <div className="mt-4">
                  <label style={labelStyle}>EMAIL ADDRESS</label>
                  <input required type="email" value={form.email} onChange={set("email")} style={inputStyle} />
                </div>
                <div className="mt-4">
                  <label style={labelStyle}>PHONE (OPTIONAL)</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} style={inputStyle} />
                </div>
              </div>

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Shipping address */}
              <div>
                <p className="font-display text-xs mb-5" style={{ color: "var(--ember)", letterSpacing: "0.25em" }}>
                  SHIPPING ADDRESS
                </p>
                <div className="space-y-4">
                  <div>
                    <label style={labelStyle}>COUNTRY</label>
                    <select
                      required
                      value={form.country}
                      onChange={set("country")}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
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
                      <input required value={form.state} onChange={set("state")} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>ZIP / POSTAL</label>
                      <input required value={form.zip} onChange={set("zip")} style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="font-mono text-xs p-4" style={{ color: "#ff6b6b", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
                style={{ fontSize: "0.75rem", opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Placing Order..." : "Place Order"}
                {!loading && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              <p className="font-mono text-xs text-center" style={{ color: "var(--muted)" }}>
                Orders are fulfilled by Printify · Ships in 2–7 business days
              </p>
            </div>

            {/* ─── ORDER SUMMARY ─────────────────────────── */}
            <div className="lg:col-span-2">
              <div
                className="sticky top-28"
                style={{ background: "var(--ash)", border: "1px solid var(--border)", padding: "1.5rem" }}
              >
                <p className="font-display text-xs mb-5" style={{ color: "var(--ember)", letterSpacing: "0.25em" }}>
                  ORDER SUMMARY
                </p>

                <ul className="space-y-4 mb-6">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                      <div
                        className="relative shrink-0 overflow-hidden"
                        style={{ width: 56, height: 62, background: "var(--void)", border: "1px solid var(--border)" }}
                      >
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-xs" style={{ color: "var(--border)" }}>X</span>
                          </div>
                        )}
                        <span
                          className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center font-mono text-xs rounded-full"
                          style={{ background: "var(--ember)", color: "var(--obsidian)", fontSize: "0.55rem" }}
                        >
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-xs tracking-wider" style={{ color: "var(--bone)" }}>{item.name}</p>
                        <p className="font-mono text-xs" style={{ color: "var(--muted)" }}>{item.sizeLabel}</p>
                      </div>
                      <p className="font-mono text-xs" style={{ color: "var(--bone)" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
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
                  <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>Calculated by Printify</span>
                </div>

                <hr style={{ borderColor: "var(--border)", marginBottom: "1rem" }} />

                <div className="flex justify-between">
                  <span className="font-display text-xs tracking-widest" style={{ color: "var(--bone)" }}>TOTAL</span>
                  <span className="font-display text-sm" style={{ color: "var(--ember)" }}>${subtotal.toFixed(2)}+</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
