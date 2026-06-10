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

// Product data is cached for 5 minutes — pages render instantly from cache
// instead of waiting on Printify for every visitor.
export async function getProducts() {
  const res = await fetch(
    `${PRINTIFY_API}/shops/${SHOP_ID}/products.json?limit=20`,
    { headers: headers(), next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`Printify error ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

export async function getProduct(productId) {
  const res = await fetch(
    `${PRINTIFY_API}/shops/${SHOP_ID}/products/${productId}.json`,
    { headers: headers(), next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`Printify error ${res.status}`);
  return res.json();
}

export async function calculateShipping(address, lineItems) {
  const res = await fetch(
    `${PRINTIFY_API}/shops/${SHOP_ID}/orders/shipping.json`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        line_items: lineItems,
        address_to: address,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Printify shipping error ${res.status}: ${err}`);
  }
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

import catalog from "./catalog.json";

// Printify descriptions arrive as HTML — strip tags and decode the
// entities that actually show up in their copy.
function cleanDescription(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&rsquo;|&#8217;|&#39;|&apos;/g, "'")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rdquo;|&#8221;|&quot;/g, '"')
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&ndash;|&#8211;/g, "–")
    .replace(/&mdash;|&#8212;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// "long-sleeve" -> "Long Sleeve"
function prettyType(t) {
  if (!t) return "";
  return t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Normalize a Printify product into the shape the site uses
export function normalizeProduct(p, localMeta = {}) {
  // catalog.json is keyed by the external (storefront) id, e.g. "29122136" —
  // fall back to the internal Printify id in case entries use that instead.
  const catalogMeta = catalog[p.external?.id] || catalog[p.id] || {};
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

  return {
    id: localMeta.id || p.id,
    printifyProductId: p.id,
    name: localMeta.name || catalogMeta.species || p.title,
    subtitle: localMeta.subtitle || catalogMeta.commonName || "",
    type: localMeta.type || prettyType(catalogMeta.productType) || "",
    collection: localMeta.collection ?? catalogMeta.collection ?? null,
    productType: localMeta.productType || catalogMeta.productType || "",
    species: catalogMeta.species || "",
    commonName: catalogMeta.commonName || "",
    abbr: catalogMeta.abbr || "",
    nickname: catalogMeta.nickname || "",
    group: catalogMeta.group || "",
    aliases: catalogMeta.aliases || [],
    price: priceInDollars,
    description: localMeta.description || cleanDescription(p.description),
    tags: localMeta.tags || [],
    sizes,
    image: defaultImage?.src || localMeta.image || "",
    images,
    imageAlt: localMeta.imageAlt || catalogMeta.species || p.title,
    inStock: enabledVariants.length > 0,
  };
}
