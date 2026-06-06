/**
 * /api/products
 *
 * If PRINTFUL_API_KEY is set, fetches live store products from Printful.
 * Otherwise falls back to the local catalog in lib/products.js.
 */

import { products } from "@/lib/products";

export async function GET() {
  const apiKey = process.env.PRINTFUL_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.printful.com/store/products", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!res.ok) {
        throw new Error(`Printful API error: ${res.status}`);
      }

      const data = await res.json();

      // Merge Printful data with local catalog metadata
      const merged = (data.result || []).map((pf) => {
        const local = products.find(
          (p) => p.printfulProductId === pf.id
        );
        return {
          id: local?.id || String(pf.id),
          name: pf.name,
          type: local?.type || "",
          subtitle: local?.subtitle || "",
          price: pf.retail_price ? parseFloat(pf.retail_price) : local?.price,
          description: local?.description || pf.name,
          tags: local?.tags || [],
          sizes: local?.sizes || [],
          image: pf.thumbnail_url || local?.image || "",
          imageAlt: pf.name,
          printfulProductId: pf.id,
          inStock: true,
        };
      });

      return Response.json({ source: "printful", products: merged });
    } catch (err) {
      console.error("Printful API failed, falling back to local catalog:", err);
    }
  }

  // Fallback: local catalog
  return Response.json({ source: "local", products });
}
