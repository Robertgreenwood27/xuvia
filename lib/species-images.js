// Server-only helper: resolves the photo for a Field Guide species.
//
// Drop an image into public/species/ named after the species slug, e.g.
//   public/species/greenbottle-blue-tarantula.jpg
// and it automatically appears on the Field Guide index card, the species
// page (as a framed plate), and the species share card. No code changes.
//
// Prefer .jpg or .png — .webp works on the site but not on share cards.

import fs from "fs";
import path from "path";

const SPECIES_DIR = path.join(process.cwd(), "public", "species");
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export function getSpeciesImage(slug) {
  for (const ext of EXTENSIONS) {
    try {
      if (fs.existsSync(path.join(SPECIES_DIR, `${slug}.${ext}`))) {
        return `/species/${slug}.${ext}`;
      }
    } catch {
      // fs unavailable — treat as no image
    }
  }
  return null;
}
