import { products as localProducts } from "@/lib/products";
import { getProducts, normalizeProduct } from "@/lib/printify";

function sortProducts(a, b) {
  const colA = a.collection ?? Infinity;
  const colB = b.collection ?? Infinity;
  if (colA !== colB) return colA - colB;
  if (a.productType !== b.productType) return a.productType.localeCompare(b.productType);
  return a.name.localeCompare(b.name);
}

export async function GET() {
  if (process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID) {
    try {
      const raw = await getProducts();
      const merged = raw
        .filter((p) => p.external?.id)
        .map((p) => {
          const local = localProducts.find((lp) => lp.printifyProductId === p.id);
          return normalizeProduct(p, local || {});
        })
        .sort(sortProducts);
      return Response.json({ source: "printify", products: merged });
    } catch (err) {
      console.error("Printify API failed, using local catalog:", err.message);
    }
  }
  return Response.json({ source: "local", products: localProducts });
}