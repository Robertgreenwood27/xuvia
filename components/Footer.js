import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--void)",
      }}
    >
      {/* Marquee strip */}
      <div
        className="overflow-hidden py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="marquee-inner">
          {Array(8).fill(null).map((_, i) => (
            <span
              key={i}
              className="font-display text-xs px-8"
              style={{ color: "var(--border-bright)", letterSpacing: "0.3em" }}
            >
              XUVIA · WEARABLE ARACHNOLOGY · FULL SUBLIMATION · LIMITED RUN ·
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <p
            className="font-display text-2xl mb-4"
            style={{ color: "var(--ember)", letterSpacing: "0.3em" }}
          >
            XUVIA
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)", maxWidth: "240px" }}
          >
            Apparel for those who understand what lives in the dark.
            Full-wrap sublimation. Small batches. No compromises.
          </p>
        </div>

        {/* Links */}
        <div>
          <p
            className="font-display text-xs mb-5"
            style={{ color: "var(--ember)", letterSpacing: "0.2em" }}
          >
            Navigate
          </p>
          <ul className="space-y-3">
            {[
              { label: "Shop All", href: "/shop" },
              { label: "About Xuvia", href: "#about" },
              { label: "Sizing Guide", href: "#sizing" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm nav-link"
                  style={{ color: "var(--muted)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <p
            className="font-display text-xs mb-5"
            style={{ color: "var(--ember)", letterSpacing: "0.2em" }}
          >
            Info
          </p>
          <ul className="space-y-3 text-sm" style={{ color: "var(--muted)" }}>
            <li>Fulfilled by Printful</li>
            <li>Ships worldwide</li>
            <li>Print-on-demand</li>
            <li>Returns handled case by case</li>
          </ul>
        </div>
      </div>

      <div
        className="border-t px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="font-mono text-xs" style={{ color: "var(--muted)" }}>
          © {year} XUVIA. All rights reserved.
        </p>
        <p className="font-mono text-xs" style={{ color: "var(--border-bright)" }}>
          Built for the patient ones.
        </p>
      </div>
    </footer>
  );
}
