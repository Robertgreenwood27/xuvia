import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, priority = false }) {
  const kicker = [product.subtitle, product.type].filter(Boolean).join(" · ") || product.type;
  return (
    <Link href={`/product/${product.id}`} className="product-card block group">
      {/* Image container */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1 / 1.1" }}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt || product.name}
            fill
            className="card-image object-cover"
            priority={priority}
          />
        ) : (
          /* Placeholder when no image is set */
          <div className="img-placeholder absolute inset-0 flex items-center justify-center">
            <span
              className="font-display text-4xl"
              style={{ color: "var(--border)", letterSpacing: "0.3em" }}
            >
              XUVIA
            </span>
          </div>
        )}

        {/* Overlay tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.tags?.includes("new") && (
            <span className="tag-badge new">New</span>
          )}
          {product.tags?.includes("featured") && (
            <span className="tag-badge featured">Featured</span>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="font-display text-xs mb-1"
              style={{ color: "var(--muted)", letterSpacing: "0.2em" }}
            >
              {kicker}
            </p>
            <h3
              className="font-display text-lg"
              style={{ color: "var(--bone)", letterSpacing: "0.12em" }}
            >
              {product.name}
            </h3>
          </div>
          <span
            className="font-mono text-sm pt-1 whitespace-nowrap"
            style={{ color: "var(--ember)" }}
          >
            ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
          </span>
        </div>

        {/* CTA */}
        <div
          className="mt-4 flex items-center gap-2 font-display text-xs"
          style={{ color: "var(--ember)", letterSpacing: "0.18em" }}
        >
          <span>View</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
