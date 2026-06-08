const PRINTIFY_API = "https://api.printify.com/v1";
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const TOKEN = process.env.PRINTIFY_API_KEY;

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "XuviaWebsite/1.0",
  };
}

export async function getProducts() {
  const res = await fetch(
    `${PRINTIFY_API}/shops/${SHOP_ID}/products.json?limit=20`,
        { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Printify error ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

export async function getProduct(productId) {
  const res = await fetch(
    `${PRINTIFY_API}/shops/${SHOP_ID}/products/${productId}.json`,
        { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Printify error ${res.status}`);
  return res.json();
}

export async function createOrder(payload) {
  const res = await fetch(
    `${PRINTIFY_API}/shops/${SHOP_ID}/orders.json`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Printify order error ${res.status}: ${err}`);
  }
  return res.json();
}

function parseDescriptionMeta(html = "") {
  const match = html.match(/<!--\s*xuvia\s+collection:(\d+)\s+type:([\w-]+)\s+species:([^-->]+?)\s*-->/i);
  if (!match) return {};
  return {
    collection: parseInt(match[1], 10),
    productType: match[2].trim(),
    name: match[3].trim(),
  };
}

// Normalize a Printify product into the shape the site uses
export function normalizeProduct(p, localMeta = {}) {
  const enabledVariants = p.variants.filter((v) => v.is_enabled);
  const defaultVariant = enabledVariants.find((v) => v.is_default) || enabledVariants[0];
  const priceInDollars = defaultVariant ? defaultVariant.price / 100 : localMeta.price || 0;

  // Build size options from the Size option group
  const sizeOption = p.options?.find((o) => o.type === "size" || o.name?.toLowerCase() === "size");
  const sizes = sizeOption
    ? sizeOption.values.filter((val) =>
        enabledVariants.some((v) => v.options?.includes(val.id))
      ).map((val) => ({
        label: val.title,
        variantId: enabledVariants.find((v) => v.options?.includes(val.id))?.id,
        price: (enabledVariants.find((v) => v.options?.includes(val.id))?.price || 0) / 100,
      }))
    : enabledVariants.map((v) => ({
        label: v.title,
        variantId: v.id,
        price: v.price / 100,
      }));

  const defaultImage = p.images?.find((i) => i.is_default) || p.images?.[0];
  const images = p.images?.map((i) => i.src) || [];
  const descMeta = parseDescriptionMeta(p.description || "");

  return {
    id: localMeta.id || p.id,
    printifyProductId: p.id,
    name: localMeta.name || descMeta.name || p.title,
    subtitle: localMeta.subtitle || "",
    type: localMeta.type || "",
    collection: localMeta.collection ?? descMeta.collection ?? null,
    productType: localMeta.productType || descMeta.productType || "",
    price: priceInDollars,
    description: localMeta.description || p.description?.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "").trim() || "",
    tags: localMeta.tags || [],
    sizes,
    image: defaultImage?.src || localMeta.image || "",
    images,
    imageAlt: localMeta.imageAlt || p.title,
    inStock: enabledVariants.length > 0,
  };
}
