import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { speciesList, getSpeciesBySlug } from "@/lib/species";
import { getSpeciesImage } from "@/lib/species-images";
import { products as localProducts } from "@/lib/products";
import { getProducts, normalizeProduct } from "@/lib/printify";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";

export function generateStaticParams() {
  return speciesList.map((s) => ({ slug: s.slug }));
}

async function fetchSpeciesProducts(latinName) {
  if (process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID) {
    try {
      const raw = await getProducts();
      return raw
        .filter((p) => p.external?.id)
        .map((p) => {
          const local = localProducts.find((lp) => lp.printifyProductId === p.id);
          return normalizeProduct(p, local || {});
        })
        .filter((p) => p.species === latinName);
    } catch (err) {
      console.error("Species page: Printify fetch failed", err.message);
    }
  }
  return [];
}

export async function generateMetadata({ params }) {
  const s = getSpeciesBySlug(params.slug);
  if (!s) return { title: "Not Found" };

  const title = `${s.commonName} Tarantula (${s.species}) — Merch & Field Guide`;
  const description = `${s.commonName} (${s.species}${s.nickname ? `, aka "${s.nickname}"` : ""}) — ${s.group.toLowerCase()} from ${s.range}. Field notes from a real keeper, plus apparel, phone cases and merch featuring the species.`;

  return {
    title,
    description,
    keywords: [
      s.commonName,
      s.species,
      `${s.abbr} tarantula`,
      `${s.commonName} merch`,
      `${s.commonName} shirt`,
      `${s.commonName} phone case`,
      s.group.toLowerCase(),
      ...(s.nickname ? [s.nickname] : []),
    ],
    alternates: { canonical: `${baseUrl}/species/${s.slug}` },
    openGraph: {
      title: `${s.commonName} — XUVIA Field Guide`,
      description,
      url: `${baseUrl}/species/${s.slug}`,
      type: "article",
    },
  };
}

export default async function SpeciesPage({ params }) {
  const s = getSpeciesBySlug(params.slug);
  if (!s) notFound();

  const products = await fetchSpeciesProducts(s.species);
  const index = speciesList.findIndex((x) => x.slug === s.slug);
  const photo = getSpeciesImage(s.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${s.commonName} (${s.species}) — XUVIA Field Guide`,
      description: `Keeper field notes on ${s.species}: range, habitat, temperament.`,
      ...(photo && { image: `${baseUrl}${photo}` }),
      author: { "@type": "Organization", name: "XUVIA" },
      publisher: { "@type": "Organization", name: "XUVIA", url: baseUrl },
      mainEntityOfPage: `${baseUrl}/species/${s.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Field Guide", item: `${baseUrl}/species` },
        { "@type": "ListItem", position: 3, name: s.commonName, item: `${baseUrl}/species/${s.slug}` },
      ],
    },
    ...(products.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${s.commonName} merch`,
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${baseUrl}/product/${p.id}`,
              name: p.name,
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="noise" style={{ background: "var(--obsidian)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <main className="pt-36 pb-24">
        {/* ─── SPECIMEN HEADER ─────────────────────────────── */}
        <header
          className="px-6 pb-16 relative overflow-hidden"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="max-w-4xl mx-auto">
            <nav className="mb-12">
              <ol className="flex items-center gap-2 font-mono text-xs" style={{ color: "var(--muted)" }}>
                <li><Link href="/" className="hover:text-ember transition-colors">Home</Link></li>
                <li style={{ color: "var(--border-bright)" }}>/</li>
                <li><Link href="/species" className="hover:text-ember transition-colors">Field Guide</Link></li>
                <li style={{ color: "var(--border-bright)" }}>/</li>
                <li style={{ color: "var(--ember)" }}>{s.abbr}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-4 mb-8">
              <span
                className="font-mono text-xs px-3 py-1"
                style={{ color: "var(--ember)", border: "1px solid var(--border-bright)", letterSpacing: "0.2em" }}
              >
                SPECIMEN {String(index + 1).padStart(3, "0")}
              </span>
              <span className="font-mono text-xs" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
                {s.group.toUpperCase()}
              </span>
            </div>

            <h1
              className="font-display mb-3"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "var(--silk)", letterSpacing: "0.08em", lineHeight: 1 }}
            >
              {s.commonName}
            </h1>
            <p className="text-lg md:text-xl italic" style={{ color: "var(--ember-dim)" }}>
              {s.species}
              {s.nickname && (
                <span className="not-italic font-mono text-sm ml-4" style={{ color: "var(--muted)" }}>
                  a.k.a. &ldquo;{s.nickname}&rdquo;
                </span>
              )}
            </p>
          </div>
        </header>

        {/* ─── SPECIMEN LABEL ──────────────────────────────── */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">

            {photo && (
              <figure
                className="mb-12 p-3"
                style={{ background: "var(--ash)", border: "1px solid var(--border)" }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
                  <Image
                    src={photo}
                    alt={`${s.commonName} (${s.species})`}
                    fill
                    sizes="(min-width: 896px) 868px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <figcaption
                  className="font-mono text-xs pt-3 text-center"
                  style={{ color: "var(--muted)", letterSpacing: "0.2em" }}
                >
                  PLATE {String(index + 1).padStart(3, "0")} · <span className="italic">{s.species}</span>
                </figcaption>
              </figure>
            )}

          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2 self-start">
              <div
                className="p-8"
                style={{ background: "var(--ash)", border: "1px solid var(--border)" }}
              >
              <p className="font-mono text-xs mb-6" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
                SPECIMEN LABEL
              </p>
              <dl className="space-y-4">
                {[
                  ["Family", s.family],
                  ["Range", s.range],
                  ["Habitat", s.habitat],
                  ["Leg span", s.legSpan],
                  ["Temperament", s.temperament],
                  ["Coloration", s.colors.join(" · ")],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-xs mb-1" style={{ color: "var(--muted)", letterSpacing: "0.2em" }}>
                      {label.toUpperCase()}
                    </dt>
                    <dd className="text-sm" style={{ color: "var(--bone)", lineHeight: 1.6 }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              </div>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono text-xs mb-6" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
                FIELD NOTES
              </p>
              <div className="space-y-6" style={{ color: "var(--bone)", fontWeight: 300, lineHeight: 1.85 }}>
                {s.fieldNotes.map((note, i) => (
                  <p key={i}>{note}</p>
                ))}
              </div>

              <hr className="divider-ember my-10" />

              <p className="font-mono text-xs mb-4" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
                WHY IT&apos;S IN THE COLLECTION
              </p>
              <p className="text-sm italic" style={{ color: "var(--muted)", lineHeight: 1.85 }}>
                {s.whyWeLoveIt}
              </p>
            </div>
          </div>
        </section>

        {/* ─── PRODUCTS FEATURING THIS SPECIES ─────────────── */}
        <section className="px-6 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <p className="font-mono text-xs" style={{ color: "var(--ember)", letterSpacing: "0.3em" }}>
                WEARING THE {s.abbr}
              </p>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="font-display text-xl mb-6" style={{ color: "var(--muted)", letterSpacing: "0.15em" }}>
                  Pieces featuring this species are on the way.
                </p>
                <Link href="/shop" className="btn-ghost">Browse the Collection</Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
