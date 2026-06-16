import { products as localProducts } from "@/lib/products";
import { getProducts } from "@/lib/printify";
import { speciesList } from "@/lib/species";

// Bump this when content meaningfully changes. Reporting a stable date (rather
// than `new Date()` on every request) stops crawlers from treating the whole
// site as freshly modified and re-crawling — and re-fetching — every page.
const LAST_MODIFIED = "2026-06-16";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.co";

  let productIds = localProducts.map((p) => p.id);

  if (process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID) {
    try {
      const raw = await getProducts();
      const published = raw.filter((p) => p.external?.id);
      if (published.length > 0) productIds = published.map((p) => p.id);
    } catch (err) {
      console.error("Sitemap: Printify fetch failed, using local products", err.message);
    }
  }

  const productPages = productIds.map((id) => ({
    url: `${baseUrl}/product/${id}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const speciesPages = speciesList.map((s) => ({
    url: `${baseUrl}/species/${s.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/species`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    ...productPages,
    ...speciesPages,
  ];
}
