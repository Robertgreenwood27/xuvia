import { products as localProducts } from "@/lib/products";
import { getProduct, normalizeProduct } from "@/lib/printify";

export async function GET(_, { params }) {
  const { id } = params;
  const local = localProducts.find((p) => p.id === id);

  if (process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID && local?.printifyProductId) {
    try {
      const raw = await getProduct(local.printifyProductId);
      return Response.json({ source: "printify", product: normalizeProduct(raw, local) });
    } catch (err) {
      console.error("Printify product fetch failed:", err.message);
    }
  }

  if (local) return Response.json({ source: "local", product: local });
  return Response.json({ error: "Not found" }, { status: 404 });
}
