import { products as localProducts } from "@/lib/products";
import { getProducts } from "@/lib/printify";

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
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...productPages,
  ];
}
