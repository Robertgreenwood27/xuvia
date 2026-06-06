import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = {
  title: "Shop — XUVIA",
  description: "Full catalog. All pieces. Limited by design.",
};

export default function ShopPage() {
  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <Nav />

      {/* Page header */}
      <div
        className="pt-40 pb-20 px-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--void), var(--obsidian))",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Ambient line from top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-28 opacity-40"
          style={{
            background: "linear-gradient(to bottom, var(--ember), transparent)",
          }}
        />

        <div className="max-w-7xl mx-auto">
          <p
            className="font-mono text-xs mb-4"
            style={{ color: "var(--ember)", letterSpacing: "0.35em" }}
          >
            XUVIA / SHOP
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "var(--silk)",
              letterSpacing: "0.1em",
            }}
          >
            The Collection
          </h1>
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--muted)", maxWidth: "400px", lineHeight: "1.75" }}
          >
            Every piece is made to order. Full sublimation. Ships via Printify.
          </p>
        </div>
      </div>

      {/* Product grid */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Filter bar (stub — wire up later) */}
        <div className="flex items-center justify-between mb-12">
          <p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          {/* Sort stub */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.15em" }}>
              Sort:
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--ember)", letterSpacing: "0.15em" }}>
              Featured
            </span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <p
              className="font-display text-2xl mb-4"
              style={{ color: "var(--muted)", letterSpacing: "0.2em" }}
            >
              Spinning the web...
            </p>
            <p className="font-mono text-xs" style={{ color: "var(--border-bright)" }}>
              Products coming soon.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
