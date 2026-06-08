"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || "other";
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

function CollectionGroups({ products }) {
  const byCollection = groupBy(products, "collection");

  const collectionKeys = Object.keys(byCollection).sort((a, b) => {
    if (a === "null" || a === "undefined") return 1;
    if (b === "null" || b === "undefined") return -1;
    return Number(a) - Number(b);
  });

  return (
    <div className="space-y-24">
      {collectionKeys.map((colKey) => {
        const byType = groupBy(byCollection[colKey], "productType");
        const typeKeys = Object.keys(byType).sort();

        return (
          <section key={colKey}>
            <div className="flex items-center gap-4 mb-12">
              <p className="font-mono text-xs" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
                {colKey === "null" || colKey === "undefined" ? "UNCATEGORIZED" : `COLLECTION ${colKey}`}
              </p>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            <div className="space-y-16">
              {typeKeys.map((typeKey) => (
                <div key={typeKey}>
                  <p className="font-mono text-xs mb-6" style={{ color: "var(--muted)", letterSpacing: "0.25em" }}>
                    {typeKey.replace(/-/g, " ").toUpperCase()}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {byType[typeKey].map((product, i) => (
                      <ProductCard key={product.id} product={product} priority={i < 2} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />
      <div className="pt-40 pb-20 px-6 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--void), var(--obsidian))", borderBottom: "1px solid var(--border)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-28 opacity-40" style={{ background: "linear-gradient(to bottom, var(--ember), transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs mb-4" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>XUVIA / SHOP</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--silk)", letterSpacing: "0.1em" }}>The Collection</h1>
          <p className="mt-4 text-sm" style={{ color: "var(--muted)", maxWidth: "400px", lineHeight: "1.75" }}>Every piece is made to order.</p>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
            {loading ? "Loading..." : `${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.15em" }}>Sort:</span>
            <span className="font-mono text-xs" style={{ color: "var(--ember)", letterSpacing: "0.15em" }}>Featured</span>
          </div>
        </div>
        {loading ? (
          <div className="py-40 text-center"><p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.3em" }}>Loading collection...</p></div>
        ) : products.length > 0 ? (
          <CollectionGroups products={products} />
        ) : (
          <div className="py-40 text-center">
            <p className="font-display text-2xl mb-4" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>Spinning the web...</p>
            <p className="font-mono text-xs" style={{ color: "var(--border-bright)" }}>Products coming soon.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}