import { cache } from "react";
import { products as localProducts } from "@/lib/products";
import { getProduct as fetchPrintifyProduct, normalizeProduct } from "@/lib/printify";
import { getSpeciesByLatinName } from "@/lib/species";
import ProductClient from "./ProductClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";

// Cached so generateMetadata and ProductPage share one fetch per request
const fetchProduct = cache(async (id) => {
  const local = localProducts.find((p) => p.id === id || p.printifyProductId === id);
  if (process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID) {
    try {
      const raw = await fetchPrintifyProduct(local?.printifyProductId || id);
      return normalizeProduct(raw, local || {});
    } catch {
      // fall through to local
    }
  }
  return local || null;
});

function typeLabel(product) {
  return (product.productType || product.type || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);
  if (!product) return { title: "Not Found" };

  const canonical = `${baseUrl}/product/${product.printifyProductId || params.id}`;
  const label = typeLabel(product);

  // "Greenbottle Blue Tarantula Phone Case — Chromatopelma cyaneopubescens (GBB)"
  const title = product.commonName
    ? `${product.commonName} ${label} — ${product.species}${product.abbr ? ` (${product.abbr})` : ""}`
    : product.name;

  const description = product.commonName
    ? `${product.commonName} (${product.species}) ${label.toLowerCase()} by XUVIA. ${product.description?.replace(/&[a-z]+;|&#\d+;/gi, " ").trim().slice(0, 140) || "Keeper-made, designed from the real animal. Made to order."}`
    : product.description?.replace(/&[a-z]+;|&#\d+;/gi, " ").trim();

  return {
    title,
    description,
    keywords: [
      ...(product.aliases || []),
      ...(product.species ? [product.species, `${product.commonName} merch`] : []),
      "tarantula merch",
      "exotic pet apparel",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${product.commonName || product.name} — XUVIA`,
      description,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.commonName || product.name} — XUVIA`,
      description,
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);
  const speciesEntry = product?.species ? getSpeciesByLatinName(product.species) : null;

  const canonical = product
    ? `${baseUrl}/product/${product.printifyProductId || params.id}`
    : null;

  const jsonLd = product
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.commonName
            ? `${product.commonName} ${typeLabel(product)}`
            : product.name,
          sku: String(product.printifyProductId || product.id),
          category: typeLabel(product),
          description: product.description?.replace(/&[a-z]+;|&#\d+;/gi, " ").trim(),
          image:
            product.images?.length > 0
              ? product.images.slice(0, 6)
              : product.image?.startsWith("http")
                ? product.image
                : `${baseUrl}${product.image}`,
          brand: { "@type": "Brand", name: "XUVIA" },
          ...(product.species && {
            keywords: [product.species, product.commonName, product.abbr]
              .filter(Boolean)
              .join(", "),
          }),
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            itemCondition: "https://schema.org/NewCondition",
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: canonical,
            seller: { "@type": "Organization", name: "XUVIA" },
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
            { "@type": "ListItem", position: 2, name: "Shop", item: `${baseUrl}/shop` },
            {
              "@type": "ListItem",
              position: 3,
              name: product.commonName || product.name,
              item: canonical,
            },
          ],
        },
      ]
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient
        product={product}
        speciesSlug={speciesEntry?.slug || null}
        canonical={canonical}
      />
    </>
  );
}
