import { products } from "@/lib/products";

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://xuvia.com";

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
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
