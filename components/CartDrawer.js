"use client";

import { useCart } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, count, subtotal, open, setOpen, removeFromCart, setQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300"
        style={{
          width: "min(420px, 100vw)",
          background: "var(--void)",
          borderLeft: "1px solid var(--border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <p className="font-display text-xs tracking-widest" style={{ color: "var(--ember)" }}>
            YOUR CART {count > 0 && `(${count})`}
          </p>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="font-mono text-xs tracking-widest" style={{ color: "var(--muted)" }}>
                Your cart is empty
              </p>
              <button
                onClick={() => setOpen(false)}
                className="btn-ghost"
                style={{ fontSize: "0.65rem" }}
              >
                <Link href="/shop">Browse Collection</Link>
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4"
                  style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem" }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative shrink-0 overflow-hidden"
                    style={{ width: 72, height: 80, background: "var(--ash)", border: "1px solid var(--border)" }}
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-xs" style={{ color: "var(--border)" }}>X</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-xs tracking-wider mb-0.5 truncate" style={{ color: "var(--bone)" }}>
                      {item.name}
                    </p>
                    <p className="font-mono text-xs mb-2" style={{ color: "var(--muted)" }}>
                      {item.sizeLabel} · ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-3">
                      {/* Qty */}
                      <div className="flex items-center" style={{ border: "1px solid var(--border)" }}>
                        <button
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center font-mono text-xs transition-colors"
                          style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-mono text-xs" style={{ color: "var(--bone)" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center font-mono text-xs transition-colors"
                          style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="font-mono text-xs"
                        style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <p className="font-mono text-xs shrink-0" style={{ color: "var(--ember)" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex justify-between mb-5">
              <span className="font-mono text-xs tracking-widest" style={{ color: "var(--muted)" }}>
                SUBTOTAL
              </span>
              <span className="font-display text-sm" style={{ color: "var(--ember)" }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="font-mono text-xs mb-5 text-center" style={{ color: "var(--muted)" }}>
              Shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              className="btn-primary w-full justify-center"
              onClick={() => setOpen(false)}
              style={{ fontSize: "0.7rem" }}
            >
              Proceed to Checkout
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
