"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) notFound();
        setProduct(data.product);
        if (data.product?.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
      });
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setAllProducts(data.products || []));
  }, [params.id]);

  const handleAddToCart = () => {
    if (!selectedSize) { alert("Please select a size."); return; }
    setAdding(true);
    addToCart({
      productId: product.printifyProductId || product.id,
      variantId: selectedSize.variantId || selectedSize.label,
      name: product.name,
      sizeLabel: selectedSize.label,
      price: selectedSize.price || product.price,
      image: product.image,
    });
    setAdded(true);
    setAdding(false);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!product) {
    return (
      <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
        <Nav />
        <div className="flex items-center justify-center min-h-screen">
          <p className="font-mono text-xs tracking-widest" style={{ color: "var(--muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 1 ? product.images : [product.image].filter(Boolean);
  const displayImage = images[activeImage] || product.image;
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

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
          <div>
            <div
              className="relative overflow-hidden mb-3"
              style={{
                aspectRatio: "1 / 1.1",
                background: "var(--ash)",
                border: "1px solid var(--border)",
              }}
            >
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={product.imageAlt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="img-placeholder absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl" style={{ color: "var(--border)", letterSpacing: "0.3em" }}>
                    XUVIA
                  </span>
                </div>
              )}

              {product.tags?.includes("new") && (
                <div className="absolute top-4 left-4">
                  <span className="tag-badge new">New</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="relative shrink-0 overflow-hidden transition-opacity"
                    style={{
                      width: 64,
                      height: 72,
                      background: "var(--ash)",
                      border: `1px solid ${i === activeImage ? "var(--ember)" : "var(--border)"}`,
                      opacity: i === activeImage ? 1 : 0.6,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <Image src={src} alt={`View ${i + 1}`} fill className="object-cover" />
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

            <p className="font-mono text-xs mb-8" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
              {product.type}
            </p>

            <hr className="divider-ember mb-8" />

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-10">
              <span className="font-display text-3xl" style={{ color: "var(--ember)", letterSpacing: "0.1em" }}>
                ${(selectedSize?.price || product.price).toFixed(2)}
              </span>
              <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
                USD · Free shipping on orders $75+
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-10" style={{ color: "var(--muted)", fontWeight: 300, maxWidth: "420px" }}>
              {product.description}
            </p>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display text-xs" style={{ color: "var(--bone)", letterSpacing: "0.2em" }}>
                    SIZE
                    {selectedSize && (
                      <span className="ml-3 font-mono" style={{ color: "var(--ember)" }}>
                        {selectedSize.label}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.variantId || size.label}
                      className={`size-btn ${selectedSize?.label === size.label ? "selected" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="btn-primary w-full justify-center mb-4"
              style={{ fontSize: "0.75rem" }}
            >
              {added ? (
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
                    <span
                      className="ml-2 px-2 py-0.5 font-mono text-xs"
                      style={{ background: "rgba(10,10,11,0.3)", borderRadius: "2px" }}
                    >
                      {selectedSize.label}
                    </span>
                  )}
                </>
              )}
            </button>

            <p className="font-mono text-xs text-center" style={{ color: "var(--muted)", letterSpacing: "0.15em" }}>
              Fulfilled & shipped by Printify · 2–7 business days
            </p>

            <hr className="divider-ember mt-10 mb-8" />

            {/* Specs */}
            <div className="space-y-3">
              {[
                ["Print", "All-over full sublimation"],
                ["Material", "100% polyester"],
                ["Care", "Machine wash cold, tumble dry low"],
                ["Ships", "Worldwide via Printify"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-6">
                  <span className="font-mono text-xs w-16 shrink-0" style={{ color: "var(--muted)", letterSpacing: "0.15em" }}>
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

        {/* ─── RELATED ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-32">
            <p className="font-mono text-xs mb-8" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
              MORE PIECES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="product-card block group">
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
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
