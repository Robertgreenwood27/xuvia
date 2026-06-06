import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getFeatured } from "@/lib/products";

// Web thread SVG decorations
function WebThreads() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g opacity="0.07" stroke="#c8a96e" strokeWidth="0.5" fill="none">
        {/* Corner web threads */}
        <line x1="0" y1="0" x2="300" y2="200" strokeDasharray="4 8" />
        <line x1="0" y1="0" x2="400" y2="150" strokeDasharray="4 8" />
        <line x1="0" y1="0" x2="200" y2="300" strokeDasharray="4 8" />
        <line x1="1200" y1="0" x2="900" y2="200" strokeDasharray="4 8" />
        <line x1="1200" y1="0" x2="850" y2="150" strokeDasharray="4 8" />
        <line x1="1200" y1="0" x2="1000" y2="280" strokeDasharray="4 8" />
        <line x1="0" y1="800" x2="250" y2="600" strokeDasharray="4 8" />
        <line x1="1200" y1="800" x2="950" y2="600" strokeDasharray="4 8" />
        {/* Connecting arcs */}
        <path d="M 0 0 Q 600 300 1200 0" strokeDasharray="6 12" />
        <path d="M 300 200 Q 600 350 900 200" strokeDasharray="3 9" />
        <path d="M 400 150 Q 600 280 850 150" strokeDasharray="3 9" />
        <path d="M 200 300 Q 600 450 1000 280" strokeDasharray="3 9" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  const featured = getFeatured();

  return (
    <div className="noise" style={{ minHeight: "100vh", background: "var(--obsidian)" }}>
      <Nav />

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,0,0,0.07) 0%, transparent 70%)",
        }}
      >
        <WebThreads />

        {/* Ambient ember glow top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px"
          style={{
            height: "200px",
            background:
              "linear-gradient(to bottom, rgba(200,169,110,0.3), transparent)",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <p
            className="font-mono text-xs mb-8 animate-fade-up"
            style={{ color: "var(--ember)", letterSpacing: "0.4em" }}
          >
            WEARABLE ARACHNOLOGY
          </p>

          {/* Main heading */}
          <h1
            className="font-display animate-fade-up delay-200 ember-glow"
            style={{
              fontSize: "clamp(4rem, 14vw, 12rem)",
              lineHeight: "0.9",
              color: "var(--silk)",
              letterSpacing: "0.15em",
            }}
          >
            XUVIA
          </h1>

          <hr className="divider-ember my-10 mx-auto animate-fade-up delay-300" style={{ maxWidth: "200px" }} />

          {/* Sub */}
          <p
            className="font-body text-base md:text-lg animate-fade-up delay-400 max-w-lg mx-auto leading-relaxed"
            style={{ color: "var(--muted)", fontWeight: 300 }}
          >
            Full-wrap sublimation apparel. Small batches. For those who understand
            what lives in the dark.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-up delay-500">
            <Link href="/shop" className="btn-primary">
              Shop Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="#about" className="btn-ghost">
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-800"
        >
          <p className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.3em" }}>
            SCROLL
          </p>
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(to bottom, var(--ember-dim), transparent)",
            }}
          />
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ──────────────────────────────── */}
      <section className="relative py-24 px-6" style={{ background: "var(--void)" }}>
        {/* Section header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p
                className="font-mono text-xs mb-3"
                style={{ color: "var(--ember)", letterSpacing: "0.3em" }}
              >
                THE COLLECTION
              </p>
              <h2
                className="font-display text-3xl md:text-4xl"
                style={{ color: "var(--silk)", letterSpacing: "0.1em" }}
              >
                Featured Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="btn-ghost hidden md:inline-flex"
              style={{ fontSize: "0.6rem" }}
            >
              View All
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.length > 0 ? (
              featured.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i === 0} />
              ))
            ) : (
              <p className="col-span-3 text-center py-20" style={{ color: "var(--muted)" }}>
                Products coming soon.
              </p>
            )}
          </div>

          <div className="mt-10 md:hidden text-center">
            <Link href="/shop" className="btn-ghost">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ABOUT / BRAND STATEMENT ─────────────────────────── */}
      <section
        id="about"
        className="relative py-32 px-6 overflow-hidden"
        style={{ background: "var(--obsidian)" }}
      >
        {/* Decorative line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full opacity-5"
          style={{ background: "var(--ember)" }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <p
            className="font-mono text-xs mb-8"
            style={{ color: "var(--ember)", letterSpacing: "0.35em" }}
          >
            ABOUT XUVIA
          </p>

          <h2
            className="font-display text-3xl md:text-5xl mb-10 leading-tight"
            style={{ color: "var(--silk)", letterSpacing: "0.1em" }}
          >
            Not everyone sees beauty in eight legs.
          </h2>

          <div className="space-y-6" style={{ color: "var(--muted)", fontWeight: 300, lineHeight: "1.85" }}>
            <p>
              XUVIA was built for the keepers. The ones with enclosures instead of
              shelves. The ones who know the difference between a <em>Poecilotheria</em>{" "}
              and a <em>Pterinochilus</em> — and have opinions about it.
            </p>
            <p>
              Every design starts with a real specimen. Full-wrap sublimation on quality
              blanks, fulfilled through Printify so you get consistent prints, reliable
              shipping, and no warehouse drama.
            </p>
            <p>
              Small catalog. Intentional additions. Never mass-market.
            </p>
          </div>

          <hr className="divider-ember mt-12 mb-0" />
        </div>
      </section>

      {/* ─── PROCESS / SPECS STRIP ───────────────────────────── */}
      <section
        style={{ background: "var(--ash)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        className="py-16 px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Print Method", value: "Full Sublimation" },
            { label: "Fulfillment", value: "Printify" },
            { label: "Ships To", value: "Worldwide" },
            { label: "Run Size", value: "Made to Order" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="font-mono text-xs mb-2"
                style={{ color: "var(--muted)", letterSpacing: "0.2em" }}
              >
                {stat.label}
              </p>
              <p
                className="font-display text-sm"
                style={{ color: "var(--ember)", letterSpacing: "0.15em" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTACT ─────────────────────────────────────────── */}
      <section id="contact" className="py-32 px-6" style={{ background: "var(--void)" }}>
        <div className="max-w-xl mx-auto text-center">
          <p
            className="font-mono text-xs mb-6"
            style={{ color: "var(--ember)", letterSpacing: "0.35em" }}
          >
            GET IN TOUCH
          </p>
          <h2
            className="font-display text-2xl md:text-3xl mb-6"
            style={{ color: "var(--silk)", letterSpacing: "0.12em" }}
          >
            Questions? Commissions?
          </h2>
          <p className="mb-10 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Have a species in mind? Want to know about upcoming drops? Reach out.
          </p>
          <a
            href="mailto:hello@xuvia.com"
            className="btn-primary"
          >
            hello@xuvia.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
