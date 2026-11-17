// Optional metadata stored in a Printify product's HTML description:
// <!-- xuvia collection:2 type:long-sleeve-shirt species:Latrodectus hesperus -->
export function parseProductMetadata(description) {
  if (typeof description !== "string") return {};
  const marker = description.match(/<!--\s*xuvia\b([\s\S]*?)-->/i);
  if (!marker) return {};

  const metadata = {};
  const fields = marker[1].matchAll(
    /(?:^|\s)(collection|type|species)\s*:\s*([\s\S]*?)(?=\s+[a-z][a-z0-9_-]*\s*:|$)/gi
  );
  for (const [, rawKey, rawValue] of fields) {
    const key = rawKey.toLowerCase();
    const value = rawValue.trim();
    if (key === "collection" && /^\d+$/.test(value)) {
      const collection = Number(value);
      if (Number.isSafeInteger(collection) && collection > 0) {
        metadata.collection = collection;
      }
    } else if (key === "type" && /^[a-z]+(?:-[a-z]+)*$/i.test(value)) {
      const type = value.toLowerCase();
      metadata.productType = type === "long-sleeve-shirt" ? "long-sleeve" : type;
    } else if (key === "species" && value) {
      metadata.species = value.replace(/\s+/g, " ");
    }
  }
  return metadata;
}

// The editable Printify marker overrides catalog fields when supplied.
// Missing or invalid fields retain their existing catalog values.
export function getProductMetadata(description, catalogMetadata = {}) {
  return { ...catalogMetadata, ...parseProductMetadata(description) };
}
