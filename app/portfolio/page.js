"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import portfolio from "@/lib/portfolio.json";

export default function PortfolioPage() {
  const [active, setActive] = useState(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "3rem 2.5rem 2.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p className="font-mono" style={{ fontSize: "0.65rem", color: "var(--ember)", letterSpacing: "0.4em", marginBottom: "1rem" }}>
            XUVIA / PORTFOLIO
          </p>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--silk)", lineHeight: 1.1 }}>
            Poster Collection
          </h1>
          <p style={{ marginTop: "1.25rem", color: "var(--muted)", fontSize: "0.875rem", fontWeight: 300, maxWidth: "600px", lineHeight: 1.85 }}>
            XUVIA poster collection is a dark exotic pet series focused on species-specific exotic pet art, and high-contrast metal-print-ready compositions. The collection is built around real species and designed as a cohesive wall-art series for keepers, collectors, and darker interior spaces.
          </p>
        </div>
      </header>

      {/* Grid */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 2.5rem 6rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5px",
          }}
        >
          {portfolio.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              style={{
                position: "relative",
                aspectRatio: "5 / 7",
                background: "var(--ash)",
                border: "none",
                cursor: "pointer",
                overflow: "hidden",
                display: "block",
                width: "100%",
              }}
              className="portfolio-item"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover portfolio-img"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="portfolio-overlay">
                <span className="font-display" style={{ fontSize: "0.75rem", color: "var(--silk)", letterSpacing: "0.2em" }}>
                  {item.title}
                </span>
                {item.description && (
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.4rem", fontWeight: 300, fontFamily: "var(--font-mono)" }}>
                    {item.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {portfolio.length === 0 && (
          <p className="font-mono" style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.2em", textAlign: "center", paddingTop: "6rem" }}>
            No pieces yet.
          </p>
        )}
      </main>

      {/* Lightbox */}
      {active && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,10,11,0.95)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: "860px", cursor: "default" }}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "5 / 7" }}>
              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-contain"
                sizes="860px"
                priority
              />
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "2rem" }}>
              <div>
                <p className="font-display" style={{ fontSize: "0.85rem", color: "var(--silk)", letterSpacing: "0.2em" }}>
                  {active.title}
                </p>
                {active.description && (
                  <p style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "var(--muted)", fontWeight: 300, lineHeight: 1.6 }}>
                    {active.description}
                  </p>
                )}
              </div>
              <button
                onClick={close}
                className="font-mono"
                style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.2em", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                ESC / CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .portfolio-item { transition: transform 0.4s ease; }
        .portfolio-item:hover { z-index: 1; transform: scale(1.015); }
        .portfolio-img { transition: filter 0.4s ease; }
        .portfolio-item:hover .portfolio-img { filter: brightness(0.45); }
        .portfolio-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 1.5rem;
          opacity: 0; transition: opacity 0.4s ease;
        }
        .portfolio-item:hover .portfolio-overlay { opacity: 1; }
      `}</style>
    </div>
  );
}
