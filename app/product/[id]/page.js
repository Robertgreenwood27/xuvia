import { cache } from "react";
import { products as localProducts } from "@/lib/products";
import { getProduct as fetchPrintifyProduct, normalizeProduct } from "@/lib/printify";
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

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);
  if (!product) return { title: "Not Found" };

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  const description = product.description?.replace(/&[a-z]+;|&#\d+;/gi, " ").trim();

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} — XUVIA`,
      description,
      type: "website",
      url: `${baseUrl}/product/${product.printifyProductId || params.id}`,
      images: [{ url: imageUrl, width: 1200, height: 1200, alt: product.imageAlt || product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — XUVIA`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description?.replace(/&[a-z]+;|&#\d+;/gi, " ").trim(),
        image: product.image?.startsWith("http") ? product.image : `${baseUrl}${product.image}`,
        brand: { "@type": "Brand", name: "XUVIA" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${baseUrl}/product/${product.printifyProductId || params.id}`,
          seller: { "@type": "Organization", name: "XUVIA" },
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient product={product} />
    </>
  );
}
