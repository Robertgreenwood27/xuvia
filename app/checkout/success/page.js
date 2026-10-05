"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/site";
import { useCart } from "@/lib/cart";

function SuccessContent() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const paymentIntent = params.get("payment_intent");
    if (!paymentIntent) { setStatus("unknown"); return; }

    // The order may be placed by the Stripe webhook a moment after we land
    // here, so check a few times before calling it "still processing".
    let cancelled = false;
    const check = async (attempt) => {
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "placed") {
          setOrderId(data.orderId);
          setStatus("placed");
          clearCart();
        } else if (data.status === "processing" && attempt < 6) {
          setTimeout(() => check(attempt + 1), 2000);
        } else {
          setStatus(data.status || "failed");
          if (data.status === "processing") clearCart();
        }
      } catch {
        if (!cancelled) setStatus("failed");
      }
    };
    check(0);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {status === "checking" ? (
          <p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.3em" }}>Confirming your order...</p>
        ) : status === "placed" || status === "processing" ? (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8" style={{ border: "1px solid var(--ember)", background: "rgba(200,169,110,0.06)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--ember)" }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="font-mono text-xs mb-4" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>
              {status === "placed" ? "ORDER CONFIRMED" : "PAYMENT RECEIVED"}
            </p>
            <h1 className="font-display text-3xl md:text-4xl mb-4" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
              {status === "placed" ? "It's on its way." : "Thank you."}
            </h1>
            <p className="text-sm leading-relaxed mb-3 max-w-md" style={{ color: "var(--bone)", fontWeight: 300 }}>
              {status === "placed"
                ? "Your order is in and headed to print. You'll get a shipping confirmation email with tracking once it leaves the print facility."
                : "Your payment went through and your order is being sent to print. You'll get a shipping confirmation email with tracking once it ships."}{" "}
              Questions? Email {CONTACT_EMAIL}.
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
        ) : (
          <>
            <p className="font-mono text-xs mb-4" style={{ color: "#ff6b6b", letterSpacing: "0.35em" }}>
              {status === "unpaid" ? "PAYMENT NOT COMPLETED" : "SOMETHING WENT WRONG"}
            </p>
            <h1 className="font-display text-3xl md:text-4xl mb-4" style={{ color: "var(--silk)", letterSpacing: "0.1em" }}>
              {status === "unpaid" ? "No charge was made." : "We hit a snag."}
            </h1>
            <p className="text-sm leading-relaxed mb-10 max-w-md" style={{ color: "var(--bone)", fontWeight: 300 }}>
              {status === "unpaid"
                ? "Your payment didn't go through, so your card wasn't charged. Your cart is still saved — you can try again."
                : <>Your payment may have gone through but we couldn&apos;t confirm your order automatically. Don&apos;t worry — it&apos;s recorded on our side. Please email <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "var(--ember)" }}>{CONTACT_EMAIL}</a> and I&apos;ll sort it out personally.</>}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href={status === "unpaid" ? "/checkout" : "/shop"} className="btn-primary" style={{ fontSize: "0.7rem" }}>
                {status === "unpaid" ? "Back to Checkout" : "Back to Shop"}
              </Link>
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