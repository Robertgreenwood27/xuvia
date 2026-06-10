import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { speciesList } from "@/lib/species";
import { getSpeciesImage } from "@/lib/species-images";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";

export const metadata = {
  title: "Field Guide — Tarantula Species Behind the Designs",
  description:
    "The species behind every XUVIA design. Real tarantulas — Greenbottle Blue, Orange Baboon Tarantula and more — documented keeper-style: range, habitat, temperament, and why we put them on merch.",
  alternates: { canonical: `${baseUrl}/species` },
  openGraph: {
    title: "The XUVIA Field Guide",
    description:
      "Every design starts with a real animal. Meet the species: taxonomy, range, temperament, and field notes from twenty years of keeping.",
    url: `${baseUrl}/species`,
    type: "website",
    images: [{ url: `${baseUrl}/OGimage.png`, width: 1200, height: 630 }],
  },
};

export default function FieldGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "XUVIA Field Guide",
    url: `${baseUrl}/species`,
    description: "The tarantula species behind XUVIA designs.",
    hasPart: speciesList.map((s) => ({
      "@type": "WebPage",
      name: `${s.commonName} (${s.species})`,
      url: `${baseUrl}/species/${s.slug}`,
    })),
  };

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <div
        className="pt-40 pb-20 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, var(--void), var(--obsidian))",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-28 opacity-40"
          style={{ background: "linear-gradient(to bottom, var(--ember), transparent)" }}
        />
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs mb-4" style={{ color: "var(--ember)", letterSpacing: "0.35em" }}>
            XUVIA / FIELD GUIDE
          </p>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--silk)", letterSpacing: "0.1em" }}
          >
            The Species
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--muted)", maxWidth: "460px", lineHeight: "1.75" }}>
            Every design starts with a real animal. These are the specimens behind the work —
            documented the way keepers actually talk about them.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {speciesList.map((s, i) => {
            const photo = getSpeciesImage(s.slug);
            return (
            <Link
              key={s.slug}
              href={`/species/${s.slug}`}
              className="product-card block p-8 md:p-10 group"
            >
              {photo && (
                <div
                  className="relative overflow-hidden mb-8"
                  style={{ aspectRatio: "16 / 9", border: "1px solid var(--border)" }}
                >
                  <Image
                    src={photo}
                    alt={`${s.commonName} (${s.species})`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="card-image object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between mb-6">
                <span
                  className="font-mono text-xs px-3 py-1"
                  style={{
                    color: "var(--ember)",
                    border: "1px solid var(--border-bright)",
                    letterSpacing: "0.2em",
                  }}
                >
                  {s.abbr}
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
                  SPECIMEN {String(i + 1).padStart(3, "0")}
                </span>
              </div>

              <h2
                className="font-display text-2xl md:text-3xl mb-2"
                style={{ color: "var(--silk)", letterSpacing: "0.08em" }}
              >
                {s.commonName}
              </h2>
              <p className="text-sm italic mb-6" style={{ color: "var(--ember-dim)" }}>
                {s.species}
              </p>

              <div className="space-y-2 mb-8">
                {[
                  ["Group", s.group],
                  ["Range", s.range],
                  ["Temperament", s.temperament],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <span
                      className="font-mono text-xs w-24 shrink-0 pt-0.5"
                      style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
                    >
                      {label.toUpperCase()}
                    </span>
                    <span className="text-sm" style={{ color: "var(--bone)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="flex items-center gap-2 font-display text-xs"
                style={{ color: "var(--ember)", letterSpacing: "0.18em" }}
              >
                <span>Read the entry</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            );
          })}
        </div>

        <p className="mt-16 text-center font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
          MORE SPECIES JOIN THE GUIDE WITH EVERY COLLECTION
        </p>
      </main>

      <Footer />
    </div>
  );
}
