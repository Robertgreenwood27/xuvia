import { getProduct } from "@/lib/products";
import ProductClient from "./ProductClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";

export async function generateMetadata({ params }) {
  const product = getProduct(params.id);
  if (!product) return { title: "Not Found" };

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — XUVIA`,
      description: product.description,
      type: "website",
      url: `${baseUrl}/product/${product.id}`,
      images: [{ url: imageUrl, width: 1200, height: 1200, alt: product.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — XUVIA`,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`,
        brand: { "@type": "Brand", name: "XUVIA" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${baseUrl}/product/${product.id}`,
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
      <ProductClient />
    </>
  );
}
