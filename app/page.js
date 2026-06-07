"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

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
    const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const all = data.products || [];
                setFeatured(all.slice(0, 3));
      });
  }, []);

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
    {/* Logo */}
    <img
  src="/logo.png"
  alt="XUVIA logo"
  className="mx-auto mb-6 animate-fade-up"
  style={{
    width: "clamp(120px, 13vw, 190px)",
    height: "auto",
    opacity: 0.94,
    filter: "drop-shadow(0 0 24px rgba(200, 169, 110, 0.18))",
  }}
/>

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

    <hr
      className="divider-ember my-10 mx-auto animate-fade-up delay-300"
      style={{ maxWidth: "200px" }}
    />

    {/* Sub */}
    <p
      className="font-body text-base md:text-lg animate-fade-up delay-400 max-w-lg mx-auto leading-relaxed"
      style={{ color: "var(--muted)", fontWeight: 300 }}
    >
      For Keepers
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
              My Story
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
      I made these because I couldn&apos;t find what I was looking for.
    </h2>

    <div
      className="space-y-6"
      style={{ color: "var(--muted)", fontWeight: 300, lineHeight: "1.85" }}
    >
      <p>
        Most tarantula shirts felt like they were designed by people who loved
        the idea of spiders, not the animals themselves. Stock photos.
        Halloween graphics. Cheesy slogans. And worst of all, tarantulas
        perched on orb webs like they&apos;re common garden spiders.
      </p>

      <p>So I started making my own.</p>

      <p>XUVIA is built for the keepers.</p>

      <p>
        I know that feeling — the quiet buzz you get just watching your
        critters. That moment when you&apos;re trying to catch them in exactly
        the right light, even though it never quite happens. Twenty years in,
        my heart still pounds when I feed them.
      </p>

      <p>I wanted to celebrate that feeling.</p>

      <p>
        I love the funny cartoon spooder shirts as much as anyone, but I wanted
        the real deal. The fine details. The posture. The color. The patterns.
        The breathtaking little things that show how stunning these creatures
        actually are.
      </p>

      <p>
        I wanted to carry that buzz with me and share it with others.
      </p>

      <p>
        I&apos;ll keep expanding the collections and putting more of our
        favorites on stage. More species. More styles. Different clothing types.
        Maybe even pieces beyond clothing down the line.
      </p>

      <p>
        The promise is simple: respect for the animals, devotion to the
        details, and work that comes straight from the heart.
      </p>

      <p>That&apos;s what XUVIA is.</p>

      <p>And it always will be.</p>
    </div>

    <hr className="divider-ember mt-12 mb-0" />
  </div>
</section>

     
      {/* ─── CONTACT ─────────────────────────────────────────── 
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
*/}
      <Footer />
    </div>
  );
}
