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
    sizes: [],
    image: "/images/pmetallicaimage.png",
    imageAlt: "Poecilotheria metallica sublimation t-shirt",
    printifyProductId: null, // set to your Printify product ID
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
    sizes: [],
    image: "/images/obtimage.png",
    imageAlt: "OBT Orange Baboon Tarantula long sleeve shirt",
    printifyProductId: null, // set to your Printify product ID
    inStock: true,
  },
];

export function getProduct(id) {
  return products.find((p) => p.id === id) || null;
}

export function getFeatured() {
  return products.filter((p) => p.tags?.includes("featured"));
}
