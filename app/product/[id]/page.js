"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getProduct, products } from "@/lib/products";

// Note: This is a client component due to size selector state.
// For SEO, you'd normally split into a server shell + client island.

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }
    // TODO: wire to Printful order API or cart state
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-10">
          <ol className="flex items-center gap-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
            <li><Link href="/" className="hover:text-ember transition-colors">Home</Link></li>
            <li style={{ color: "var(--border-bright)" }}>/</li>
            <li><Link href="/shop" className="hover:text-ember transition-colors">Shop</Link></li>
            <li style={{ color: "var(--border-bright)" }}>/</li>
            <li style={{ color: "var(--ember)" }}>{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          {/* ─── IMAGE ───────────────────────────────────────── */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "1 / 1.1",
              background: "var(--ash)",
              border: "1px solid var(--border)",
            }}
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.imageAlt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="img-placeholder absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display text-5xl"
                  style={{ color: "var(--border)", letterSpacing: "0.3em" }}
                >
                  XUVIA
                </span>
              </div>
            )}

            {/* Tags overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.tags?.includes("new") && (
                <span className="tag-badge new">New</span>
              )}
            </div>
          </div>

          {/* ─── DETAILS ─────────────────────────────────────── */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <p
              className="font-mono text-xs mb-3"
              style={{ color: "var(--ember)", letterSpacing: "0.3em" }}
            >
              {product.subtitle || product.type}
            </p>

            {/* Name */}
            <h1
              className="font-display mb-2"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: "var(--silk)",
                letterSpacing: "0.12em",
                lineHeight: "1.1",
              }}
            >
              {product.name}
            </h1>

            {/* Type */}
            <p className="font-mono text-xs mb-8" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
              {product.type}
            </p>

            <hr className="divider-ember mb-8" />

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-10">
              <span
                className="font-display text-3xl"
                style={{ color: "var(--ember)", letterSpacing: "0.1em" }}
              >
                ${product.price}
              </span>
              <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
                USD · Free shipping on orders $75+
              </span>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-10"
              style={{ color: "var(--muted)", fontWeight: 300, maxWidth: "420px" }}
            >
              {product.description}
            </p>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="font-display text-xs"
                    style={{ color: "var(--bone)", letterSpacing: "0.2em" }}
                  >
                    SIZE
                  </p>
                  <button
                    className="font-mono text-xs"
                    style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.15em" }}
                  >
                    Size guide →
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="btn-primary w-full justify-center mb-4"
              style={{ fontSize: "0.75rem" }}
            >
              {addedToCart ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Added
                </>
              ) : (
                <>
                  Add to Cart
                  {selectedSize && (
                    <span
                      className="ml-2 px-2 py-0.5 font-mono text-xs"
                      style={{ background: "rgba(10,10,11,0.3)", borderRadius: "2px" }}
                    >
                      {selectedSize}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Printful note */}
            <p
              className="font-mono text-xs text-center"
              style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
            >
              Fulfilled & shipped by Printful · 2–7 business days
            </p>

            <hr className="divider-ember mt-10 mb-8" />

            {/* Product details */}
            <div className="space-y-3">
              {[
                ["Print", "All-over full sublimation"],
                ["Material", "100% polyester"],
                ["Care", "Machine wash cold, tumble dry low"],
                ["Ships", "Worldwide via Printful"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-6">
                  <span
                    className="font-mono text-xs w-16 shrink-0"
                    style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
                  >
                    {label}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "var(--bone)" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── MORE PRODUCTS ─────────────────────────────────── */}
        {products.length > 1 && (
          <section className="mt-32">
            <p
              className="font-mono text-xs mb-8"
              style={{ color: "var(--ember)", letterSpacing: "0.3em" }}
            >
              MORE PIECES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.id !== product.id)
                .slice(0, 3)
                .map((p) => {
                  // Inline card to avoid import cycle issues
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      className="product-card block group"
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1.1" }}>
                        {p.image ? (
                          <Image src={p.image} alt={p.imageAlt || p.name} fill className="card-image object-cover" />
                        ) : (
                          <div className="img-placeholder absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-3xl" style={{ color: "var(--border)" }}>XUVIA</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <p className="font-display text-xs mb-1" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>{p.subtitle}</p>
                        <p className="font-display text-lg" style={{ color: "var(--bone)", letterSpacing: "0.12em" }}>{p.name}</p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
