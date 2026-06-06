"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setNotFound(true); return; }
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
        <Nav />
        <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
          <p className="font-display text-2xl mb-4" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>Product not found</p>
          <Link href="/shop" className="btn-ghost">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
        <Nav />
        <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
          <p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.3em" }}>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }
    addToCart(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const images = product.images?.length > 0 ? product.images : [product.image].filter(Boolean);

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
          {/* ─── IMAGES ──────────────────────────────────────── */}
          <div>
            <div
              className="relative overflow-hidden mb-3"
              style={{
                aspectRatio: "1 / 1.1",
                background: "var(--ash)",
                border: "1px solid var(--border)",
              }}
            >
              {images[activeImage] ? (
                <Image
                  src={images[activeImage]}
                  alt={product.imageAlt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="img-placeholder absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl" style={{ color: "var(--border)", letterSpacing: "0.3em" }}>XUVIA</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="relative shrink-0 overflow-hidden"
                    style={{
                      width: "64px",
                      height: "72px",
                      border: i === activeImage ? "1px solid var(--ember)" : "1px solid var(--border)",
                      background: "var(--ash)",
                    }}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── DETAILS ─────────────────────────────────────── */}
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs mb-3" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
              {product.subtitle || product.type}
            </p>

            <h1
              className="font-display mb-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--silk)", letterSpacing: "0.12em", lineHeight: "1.1" }}
            >
              {product.name}
            </h1>

            <p className="font-mono text-xs mb-8" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>{product.type}</p>

            <hr className="divider-ember mb-8" />

            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-display text-3xl" style={{ color: "var(--ember)", letterSpacing: "0.1em" }}>
                ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
              </span>
              <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>USD · Free shipping on orders $75+</span>
            </div>

            <p className="text-sm leading-relaxed mb-10" style={{ color: "var(--muted)", fontWeight: 300, maxWidth: "420px" }}>
              {product.description}
            </p>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display text-xs" style={{ color: "var(--bone)", letterSpacing: "0.2em" }}>SIZE</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const label = typeof size === "object" ? size.label : size;
                    return (
                      <button
                        key={label}
                        className={`size-btn ${selectedSize?.label === label || selectedSize === label ? "selected" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                  Added to Cart
                </>
              ) : (
                <>
                  Add to Cart
                  {selectedSize && (
                    <span className="ml-2 px-2 py-0.5 font-mono text-xs" style={{ background: "rgba(10,10,11,0.3)", borderRadius: "2px" }}>
                      {typeof selectedSize === "object" ? selectedSize.label : selectedSize}
                    </span>
                  )}
                </>
              )}
            </button>

            <p className="font-mono text-xs text-center" style={{ color: "var(--muted)", letterSpacing: "0.15em" }}>
              Fulfilled & shipped by Printify · 2–7 business days
            </p>

            <hr className="divider-ember mt-10 mb-8" />

            <div className="space-y-3">
              {[
                ["Print", "All-over full sublimation"],
                ["Material", "100% polyester"],
                ["Care", "Machine wash cold, tumble dry low"],
                ["Ships", "Worldwide via Printify"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-6">
                  <span className="font-mono text-xs w-16 shrink-0" style={{ color: "var(--muted)", letterSpacing: "0.15em" }}>{label}</span>
                  <span className="font-mono text-xs" style={{ color: "var(--bone)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}