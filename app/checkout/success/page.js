"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";

function SuccessContent() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const paymentIntent = params.get("payment_intent");
    if (!paymentIntent) { setStatus("done"); return; }

    const pending = sessionStorage.getItem("xuvia-pending-order");
    if (!pending) { setStatus("done"); return; }

    const { email, address, items } = JSON.parse(pending);

    fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId: paymentIntent, email, address, items }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.orderId) {
          setOrderId(data.orderId);
          sessionStorage.removeItem("xuvia-pending-order");
          clearCart();
        }
        setStatus("done");
      })
      .catch(() => setStatus("done"));
  }, []);

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {status === "processing" ? (
          <p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.3em" }}>Confirming your order...</p>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8" style={{ border: "1px solid var(--ember)", background: "rgba(200,169,110,0.06)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--ember)" }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="font-mono text-xs mb-4" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>ORDER CONFIRMED</p>
            <h1 className="font-display text-3xl md:text-4xl mb-4" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
              It&apos;s on its way.
            </h1>
            <p className="text-sm leading-relaxed mb-3 max-w-md" style={{ color: "var(--muted)", fontWeight: 300 }}>
              Your order has been placed with Printify. You&apos;ll receive a shipping confirmation email once it leaves the print facility.
            </p>
            {orderId && (
              <p className="font-mono text-xs mb-10" style={{ color: "var(--border-bright)", letterSpacing: "0.15em" }}>
                Order ID: {orderId}
              </p>
            )}
            <hr className="divider-ember mb-10" style={{ maxWidth: "120px" }} />
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/shop" className="btn-primary" style={{ fontSize: "0.7rem" }}>Continue Shopping</Link>
              <Link href="/" className="btn-ghost" style={{ fontSize: "0.7rem" }}>Back to Home</Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}