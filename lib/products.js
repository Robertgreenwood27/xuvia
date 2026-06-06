/**
 * XUVIA Product Catalog
 *
 * Add your products here. Each product links to a Printful sync product ID.
 * Images: place in /public/images/ or use Printful mockup URLs directly.
 *
 * To connect live Printful data, add PRINTFUL_API_KEY to .env.local and
 * the /api/products route will hydrate pricing/variants automatically.
 */

export const products = [
  {
    id: "poecilotheria-tee",
    name: "Poecilotheria",
    subtitle: "Ornamental Series",
    type: "Short Sleeve Tee",
    price: 38,
    description:
      "Full-wrap sublimation print featuring a Poecilotheria metallica against blue webbing on dark bark. Electric. Heavy. Yours.",
    tags: ["new", "featured"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    // Replace with your Printful mockup image or upload to /public/images/
    image: "/images/pmetallicaimage.png",
    imageAlt: "Poecilotheria metallica sublimation t-shirt",
    printfulProductId: null, // set when live in Printful
    inStock: true,
  },
  {
    id: "obt-longsleeve",
    name: "OBT",
    subtitle: "Orange Baboon Threat",
    type: "Long Sleeve",
    price: 44,
    description:
      "Death metal lettering. An orange baboon tarantula mid-threat display. Sewn in silk and shadow. For those who understand the warning.",
    tags: ["featured"],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    image: "/images/obtimage.png",
    imageAlt: "OBT Orange Baboon Tarantula long sleeve shirt",
    printfulProductId: null,
    inStock: true,
  },
];

/**
 * Helper: get product by ID
 */
export function getProduct(id) {
  return products.find((p) => p.id === id) || null;
}

/**
 * Helper: get featured products
 */
export function getFeatured() {
  return products.filter((p) => p.tags?.includes("featured"));
}
