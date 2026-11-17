import test from "node:test";
import assert from "node:assert/strict";
import { getProductMetadata, parseProductMetadata } from "../lib/product-metadata.mjs";

test("the Black Widow description marker supplies Collection 2 and the existing long-sleeve category", () => {
  const description = `<!-- xuvia collection:2 type:long-sleeve-shirt species:Latrodectus hesperus -->
<p data-pm-slice="1 3 []">Inspired by the <strong>Black Widow</strong>.</p>`;
  assert.deepEqual(getProductMetadata(description), {
    collection: 2,
    productType: "long-sleeve",
    species: "Latrodectus hesperus",
  });
});

test("products without a marker keep all catalog metadata", () => {
  const catalog = { collection: 1, productType: "poster", species: "Pterinochilus murinus", abbr: "OBT", aliases: ["OBT poster"] };
  for (const description of [undefined, null, "", "<p>collection:2 species:Something else</p>", "<!-- another collection:2 -->"]) {
    assert.deepEqual(getProductMetadata(description, catalog), catalog);
  }
});

test("explicit marker values override catalog fields without losing other catalog metadata", () => {
  assert.deepEqual(getProductMetadata("<!-- xuvia collection:2 -->", {
    collection: 1, productType: "phone-case", species: "Pterinochilus murinus", abbr: "OBT",
  }), { collection: 2, productType: "phone-case", species: "Pterinochilus murinus", abbr: "OBT" });
});

test("marker fields support different order, capitalization and multiline whitespace", () => {
  assert.deepEqual(parseProductMetadata(`<!-- XUVIA
    species: Latrodectus   hesperus
    TYPE: Long-Sleeve-Shirt
    collection: 2
  -->`), { species: "Latrodectus hesperus", productType: "long-sleeve", collection: 2 });
});

test("invalid collection and type values do not replace usable catalog values", () => {
  for (const collection of ["0", "-2", "2.5", "NaN", "2junk", "9007199254740992", ""]) {
    assert.deepEqual(getProductMetadata(`<!-- xuvia collection:${collection} type:<script> species: -->`, {
      collection: 1, productType: "poster", species: "Pterinochilus murinus",
    }), { collection: 1, productType: "poster", species: "Pterinochilus murinus" });
  }
});

test("unknown fields and ordinary descriptions cannot become metadata", () => {
  assert.deepEqual(parseProductMetadata("<!-- xuvia collection:2 note:internal species:Latrodectus hesperus --> <p>type:poster</p>"), {
    collection: 2, species: "Latrodectus hesperus",
  });
  assert.deepEqual(parseProductMetadata("<!-- xuviastore collection:2 -->"), {});
  assert.deepEqual(parseProductMetadata("<!-- xuvia collection:2"), {});
});
