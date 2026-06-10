// XUVIA Field Guide — species data.
//
// Each entry powers a /species/[slug] page, the specimen panel on product
// pages, and structured data for search engines. The `species` field must
// exactly match the `species` value in lib/catalog.json so products link up.
//
// To add a species: add an entry here, then tag its products in catalog.json.
//
// Photos: drop public/species/<slug>.jpg (or .png) and it automatically
// appears on the Field Guide index, the species page plate, and the
// species share card. See public/species/README.txt.

export const speciesList = [
  {
    slug: "greenbottle-blue-tarantula",
    species: "Chromatopelma cyaneopubescens",
    commonName: "Greenbottle Blue",
    abbr: "GBB",
    nickname: null,
    group: "New World Tarantula",
    family: "Theraphosidae",
    range: "Paraguaná Peninsula, Venezuela",
    habitat: "Semi-arid desert scrubland",
    legSpan: "Up to 6 in / 15 cm",
    temperament: "Skittish but bold — a webber, not a fighter",
    colors: ["Metallic blue legs", "Green-blue carapace", "Fire-orange abdomen"],
    fieldNotes: [
      "No airbrushing. No filters. The Greenbottle Blue actually looks like this — metallic blue legs, a bottle-green carapace, and an abdomen the color of a struck match. It is one of the only animals on Earth wearing all three at once.",
      "GBBs are architects. Given dry substrate and a few anchor points, they will carpet an entire enclosure in dense sheet web within weeks — tunnels, curtains, bolt-holes, the works. Keepers don't decorate a GBB enclosure. The GBB does.",
      "They come from one of the harshest tarantula habitats known: the wind-scoured Paraguaná Peninsula, where the web isn't decoration — it's armor against sand and sun.",
    ],
    whyWeLoveIt:
      "It's the species that converts people. Show a non-keeper a GBB in good light and watch the word 'spider' stop meaning what it used to mean.",
  },
  {
    slug: "gooty-sapphire-ornamental",
    species: "Poecilotheria metallica",
    commonName: "Gooty Sapphire Ornamental",
    abbr: "P. metallica",
    nickname: "Gooty Sapphire",
    group: "Old World Tarantula",
    family: "Theraphosidae",
    range: "A single forest reserve near Gooty, Andhra Pradesh, India",
    habitat: "Tall deciduous forest — arboreal, lives in tree hollows",
    legSpan: "Up to 7 in / 18 cm",
    temperament: "Shy, lightning-fast, and allergic to attention",
    colors: ["Electric sapphire blue", "Fractal white leg banding", "Geometric folk-art abdomen"],
    fieldNotes: [
      "There is no fair way to describe Poecilotheria metallica to someone who hasn't seen one. It is a large spider, in vivid electric blue, wearing a geometric pattern that looks hand-painted. Evolution wasn't showing off for us — and somehow that makes it better.",
      "It is also one of the most threatened tarantulas on Earth. The entire wild population lives in a single degraded patch of forest in Andhra Pradesh, India, and the species is listed as Critically Endangered. The captive-bred hobby population may matter more for this animal than almost any other we keep.",
      "Despite the crown-jewel status, it behaves like every Poecilotheria: a hollow-dwelling ghost that would rather vanish vertically than be perceived. You don't handle a pokie. You witness one.",
    ],
    whyWeLoveIt:
      "The hobby's crown jewel — and a reminder that the most unbelievable colors in nature belong to animals most people will never look at twice.",
  },
  {
    slug: "socotra-island-blue-baboon",
    species: "Monocentropus balfouri",
    commonName: "Socotra Island Blue Baboon",
    abbr: "M. balfouri",
    nickname: null,
    group: "Old World Tarantula",
    family: "Theraphosidae",
    range: "Socotra Island, Yemen",
    habitat: "Arid mountainside burrows on one of Earth's strangest islands",
    legSpan: "Up to 5 in / 13 cm",
    temperament: "Old World reflexes, communal heart",
    colors: ["Powder-blue legs", "Sand-gold carapace", "Silvered abdomen"],
    fieldNotes: [
      "Monocentropus balfouri comes from Socotra — an island so isolated that a third of its plant life exists nowhere else, where dragon's blood trees grow like landed umbrellas. An alien animal from an alien place.",
      "It is the great exception to the tarantula rule: genuinely communal. Sac-mates can share a burrow network for life — hunting together, feeding side by side, even tolerating each other across molts. A species from one of the harshest places on Earth, surviving by cooperation.",
      "And the look: powder-blue legs against a sand-gold carapace, like the desert and the sky split the animal between them.",
    ],
    whyWeLoveIt:
      "A tarantula that breaks the loner stereotype, from an island that breaks every other rule. The keepers' keeper species.",
  },
  {
    slug: "togo-starburst-baboon",
    species: "Heteroscodra maculata",
    commonName: "Togo Starburst Baboon",
    abbr: "H. mac",
    nickname: null,
    group: "Old World Tarantula",
    family: "Theraphosidae",
    range: "West Africa — Togo, Ghana, Côte d'Ivoire",
    habitat: "Tropical forest — arboreal, webs into bark and cavities",
    legSpan: "Up to 5 in / 13 cm",
    temperament: "Fast doesn't cover it. Keepers say it teleports",
    colors: ["Moonlight white-on-grey mottling", "Starburst carapace", "Thickened back legs"],
    fieldNotes: [
      "Most tarantulas wear earth tones. The Togo Starburst wears moonlight — a white-and-grey mottled pattern that reads as lichen on bark until it moves, and then reads as nothing at all, because it's already gone.",
      "H. mac is the species keepers tell speed stories about. An arboreal Old World with reflexes that make rehousing day feel like a magic trick performed against you. Catch cups become a philosophy.",
      "Look closely at the back legs: distinctly thickened, like the animal skipped leg day for six legs and doubled it for two. One of the strangest silhouettes in the hobby, and one of the most beautiful.",
    ],
    whyWeLoveIt:
      "Pure pattern. That white starburst is one of the finest designs nature ever shipped, and it deserved better than stock Halloween clip art.",
  },
  {
    slug: "orange-baboon-tarantula",
    species: "Pterinochilus murinus",
    commonName: "Orange Baboon Tarantula",
    abbr: "OBT",
    nickname: "Orange Bitey Thing",
    group: "Old World Tarantula",
    family: "Theraphosidae",
    range: "Central, Eastern & Southern Africa",
    habitat: "Savanna and scrubland — opportunistic burrower",
    legSpan: "Up to 6 in / 15 cm",
    temperament: "Legendary. Defensive, fast, and entirely unapologetic",
    colors: ["Burnt-orange everything", "Starburst carapace pattern"],
    fieldNotes: [
      "Every hobby has its rite of passage. Ours is orange. The OBT's reputation precedes it so thoroughly that its initials have been re-translated by generations of keepers: Orange Bitey Thing.",
      "It earns the legend honestly — an Old World species with no urticating hairs, which means its first language is the threat posture: front legs raised, fangs presented, an unambiguous message delivered in under a second.",
      "But the keepers who look past the reputation find one of the most stunning spiders in the hobby. That burnt-orange suit and starburst carapace aren't a warning label. They're the whole reason we're here.",
    ],
    whyWeLoveIt:
      "Respect, not fear. The OBT is what happens when an animal refuses to be casual about its own existence — and we think that deserves a shirt.",
  },
];

export function getSpeciesBySlug(slug) {
  return speciesList.find((s) => s.slug === slug) || null;
}

export function getSpeciesByLatinName(latinName) {
  return speciesList.find((s) => s.species === latinName) || null;
}
