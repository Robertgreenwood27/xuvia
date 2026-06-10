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
nickname: "Paraguaná Blue",
group: "New World Tarantula",
family: "Theraphosidae",
genus: "Chromatopelma",
authority: "(Strand, 1907)",
range: "Falcón, Venezuela, especially the Paraguaná Peninsula",
habitat: "Dry scrubland, thorny vegetation, sandy soil, cactus country, and webbed retreats near roots or low cover",
lifestyle: "Terrestrial opportunistic webber",
legSpan: "Up to 6 in / 15 cm",
temperament: "Fast, skittish, and visible. More likely to bolt into silk than stand and fight",
defense: "New World urticating hairs, speed, retreat, and a serious web fortress",
webbing: "Heavy sheet webbing with tunnels, curtains, retreats, and anchor lines",
colors: [
"Metallic blue legs",
"Green-blue carapace",
"Fire-orange abdomen",
"Orange and black juvenile patterning",
"Color shift from sling to adult"
],
fieldNotes: [
"No airbrushing. No filters. The Greenbottle Blue actually looks like this: metallic blue legs, a bottle-green carapace, and an abdomen the color of a struck match. It is one of the only spiders that looks like someone invented the palette first and the animal second.",
"GBBs are architects. Give one dry substrate, airflow, and a few anchor points and it will turn an enclosure into a silk machine: tunnels, curtains, trip-lines, bolt-holes, and white sheet web stretched across anything that holds still long enough.",
"This is not a damp jungle spider. The species is tied to the dry north of Venezuela, especially the Paraguaná region, where heat, wind, scrub, sand, and sparse cover shape the animal's entire strategy. The web is not decoration. It is shade, shelter, warning system, hunting surface, and escape plan.",
"The famous adult color is only part of the story. Young GBBs carry a different look, with stronger orange and dark patterning before maturing into the blue-legged, green-carapaced animal that made the species a hobby icon.",
"For keepers, the GBB sits in a rare sweet spot: dramatic colors, heavy webbing, strong feeding response, and enough attitude to feel alive without the old-world danger curve. It is a display species that actually displays.",
"It is often called beginner-friendly, but that undersells it. This is not a starter spider because it is boring or forgiving. It is a starter spider because it teaches the whole language: space, dryness, airflow, retreat building, prey response, and respect for speed."
],
whyWeLoveIt:
"A color impossible to ignore, a web system impossible to fake, and the rare power to make people see spiders differently after one look.",
},
  {
  slug: "gooty-sapphire-ornamental",
  species: "Poecilotheria metallica",
  commonName: "Gooty Sapphire Ornamental",
  abbr: "P. metallica",
  nickname: "Gooty Sapphire",
  group: "Old World Tarantula",
  family: "Theraphosidae",
  genus: "Poecilotheria",
  authority: "Pocock, 1899",
  conservationStatus: "Critically Endangered",
  range: "Eastern Ghats of Andhra Pradesh, India, with published records extending farther south into Tamil Nadu",
  habitat: "Dry deciduous forest, arboreal, usually in tree hollows, bark crevices, and silk retreats on mature trunks",
  lifestyle: "Arboreal tree-hole specialist",
  legSpan: "Up to 7 in / 18 cm",
  temperament: "Shy, lightning-fast, and happiest when ignored",
  defense: "Speed, concealment, and an old-world bite",
  colors: [
    "Electric sapphire blue",
    "Fractal white leg banding",
    "Geometric patterned abdomen",
    "Cream and yellow ventral warning patches"
  ],
  fieldNotes: [
    "There is no fair way to describe Poecilotheria metallica to someone who has not seen one. It is a large spider in vivid electric blue, wearing a geometric pattern that looks hand-painted. Evolution was not showing off for us, and somehow that makes it better.",
    "Despite the crown-jewel reputation, it behaves like a proper Poecilotheria. This is a hollow-dwelling ghost, built for bark, height, and vanishing vertically before your brain catches up. You do not handle a pokie. You witness one.",
    "Its home is not a rainforest fantasy. It is a dry deciduous forest spider tied to the Eastern Ghats, where mature trees, bark fissures, and trunk hollows matter more than humidity myths. The tree is not scenery. The tree is the whole address.",
    "The species became famous partly because the color feels impossible. Blue on an animal this large does not read as camouflage until you see it against bark and lichen and realize nature knows exactly what it is doing.",
    "It is also one of the hobby's most serious reminders that beauty and vulnerability often travel together. Poecilotheria metallica is listed as Critically Endangered, and habitat loss has always been part of the story.",
    "The old line says it lived in one tiny patch near Gooty and nowhere else. The truth is a little more interesting. Later published records expanded the picture into other parts of the Eastern Ghats, but this is still a narrow-range species, not a spider with room to waste."
  ],
  whyWeLoveIt:
    "A living crown jewel: critically endangered, impossibly blue, and proof that nature's most unreal designs often belong to animals most people never notice.",
},
  {
  slug: "socotra-island-blue-baboon",
  species: "Monocentropus balfouri",
  commonName: "Socotra Island Blue Baboon",
  abbr: "M. balfouri",
  nickname: "Blue Baboon",
  group: "Old World Tarantula",
  family: "Theraphosidae",
  genus: "Monocentropus",
  authority: "Pocock, 1897",
  range: "Socotra Island, Yemen",
  habitat: "Arid rocky slopes, dry scrub, and mountainside burrows on one of Earth's strangest islands",
  lifestyle: "Terrestrial opportunistic burrower and heavy web builder",
  legSpan: "Up to 5 in / 13 cm",
  temperament: "Old World reflexes, communal heart",
  defense: "Speed, retreat, threat posture, and an old-world bite",
  webbing: "Dense silk around burrows, retreats, and shared enclosure structures",
  colors: [
    "Powder-blue legs",
    "Sand-gold carapace",
    "Silvered abdomen",
    "Cream and ash body tones",
    "Blue-gray juvenile sheen"
  ],
  fieldNotes: [
    "Monocentropus balfouri comes from Socotra, an island so isolated that 37% of its plant species, 90% of its reptiles, and 95% of its land snails exist nowhere else. Dragon's blood trees grow there like landed umbrellas. This spider did not come from a normal place.",
    "It is now the kind of animal taxonomy rarely gives you: the type species, the signature species, and possibly the only true species left standing in its genus. Monocentropus balfouri is not just from Socotra. It feels like Socotra condensed into a tarantula.",
    "The look is desert and sky split across one animal: powder-blue legs, pale sand carapace, and a silvered abdomen with that dry, armored old-world texture. It does not look painted. It looks weathered into color.",
    "In the hobby, M. balfouri is the great exception to the tarantula rule. Start sac-mates together and they can build a shared silk system, feed side by side, and tolerate each other with a calm that feels almost wrong if you have kept solitary species for long enough.",
    "That communal reputation should not be mistaken for softness. This is still an Old World tarantula with speed, confidence, and no urticating hairs to spend. It does not need drama. It has exits.",
    "A good balfouri setup does not stay empty for long. Given anchor points, cork, stone, and depth, the spider turns the enclosure into a pale webbed settlement: burrows, surface silk, tunnels, warning lines, and little blue legs appearing where you did not expect them.",
    "The magic of this species is not just that it is beautiful. It is that it breaks the script. A tarantula from a brutal island, dressed in desert colors, famous for cooperation, and carrying an entire genus on its back."
  ],
  whyWeLoveIt:
    "A rule-breaker from a rule-breaking island: blue, communal, desert-born, and carrying the strange logic of Socotra in every movement.",
},
{
  slug: "togo-starburst-baboon",
  species: "Heteroscodra maculata",
  commonName: "Togo Starburst Baboon",
  abbr: "H. mac",
  nickname: "Ornamental Baboon",
  group: "Old World Tarantula",
  family: "Theraphosidae",
  genus: "Heteroscodra",
  authority: "Pocock, 1900",
  range: "West and Central Africa, especially Togo and Ghana in the hobby record",
  habitat: "Tropical forest and woodland, arboreal, using bark, tree holes, cavities, and silk-lined retreats",
  lifestyle: "Arboreal retreat-builder with heavy webbing",
  legSpan: "Up to 5 to 6 in / 13 to 15 cm",
  temperament: "Fast does not cover it. Keepers say it teleports",
  defense: "Speed, retreat, threat posture, and an old-world bite",
  webbing: "Heavy silk inside cork tubes, bark cavities, and hidden chambers",
  colors: [
    "Moonlight white-on-gray mottling",
    "Starburst carapace",
    "Black and charcoal abdominal patterning",
    "Thickened rear legs",
    "Lichen-like bark camouflage"
  ],
  fieldNotes: [
    "Most tarantulas wear earth tones. The Togo Starburst wears moonlight: white, gray, black, and charcoal broken into a pattern that reads as lichen on bark until it moves. Then it reads as nothing at all, because it is already gone.",
    "Heteroscodra maculata is the species keepers tell speed stories about. An arboreal Old World with reflexes that make rehousing day feel like a magic trick performed against you. Catch cups become a philosophy.",
    "The starburst is not just a cool name. The carapace radiates outward in pale lines, while the abdomen breaks into mottled camouflage that looks designed for vanishing against bark, shadow, and old wood.",
    "Look closely at the back legs. They are distinctly thickened, giving the animal one of the strangest silhouettes in the hobby. It looks built wrong until it launches itself correctly.",
    "This is an arboreal spider, but not a decorative branch ornament. It wants cover, cork, cavities, anchor points, and a place to turn vertical space into a private webbed room. The best setups do not show the spider all the time. They show evidence of the spider's decisions.",
    "The common name says baboon, but the animal is not a Harpactirinae baboon spider in the strict subfamily sense. It is an African Old World tarantula with the attitude, speed, and reputation that made keepers give it the name anyway.",
    "H. mac is not the biggest old-world arboreal. It does not need to be. It has pattern, posture, acceleration, and that unsettling trick of making empty space feel occupied."
  ],
  whyWeLoveIt:
     "Pure pattern and pure velocity. A white starburst built for bark, shadow, and disappearance, with one of the most unforgettable silhouettes in the hobby.",
},
{
  slug: "orange-baboon-tarantula",
  species: "Pterinochilus murinus",
  commonName: "Orange Baboon Tarantula",
  abbr: "OBT",
  nickname: "Orange Bitey Thing",
  group: "Old World Tarantula",
  family: "Theraphosidae",
  subfamily: "Harpactirinae",
  genus: "Pterinochilus",
  authority: "Pocock, 1897",
  range: "Central, Eastern, and Southern Africa, including DR Congo, Burundi, Kenya, Tanzania, Angola, Zambia, Mozambique, Zimbabwe, and South Africa",
  habitat: "Savanna, scrubland, dry woodland, and opportunistic silk retreats in burrows, roots, bark, and ground cover",
  lifestyle: "Terrestrial opportunistic burrower with heavy webbing and semi-arboreal tendencies in captivity",
  legSpan: "Up to 6 in / 15 cm",
  temperament: "Legendary. Defensive, fast, and entirely unapologetic",
  defense: "Speed, retreat, threat posture, stridulation, and an old-world bite",
  webbing: "Heavy webbing, tunnels, curtains, anchor lines, and defensive silk architecture",
  colors: [
    "Burnt-orange everything",
    "Starburst carapace pattern",
    "Red, orange, brown, and dark color forms",
    "Black leg striping",
    "Golden abdominal tones"
  ],
  fieldNotes: [
    "Every hobby has its rite of passage. Ours is orange. The OBT's reputation precedes it so thoroughly that its initials have been re-translated by generations of keepers: Orange Bitey Thing.",
    "It earns the legend honestly. This is an Old World baboon spider with no urticating hairs, which means the warning system is direct: front legs raised, fangs presented, body lifted, message delivered in under a second.",
    "But the meme can flatten the animal. Pterinochilus murinus is not just angry orange chaos. It is a wide-ranging African survivor built for dry ground, roots, scrub, bark, burrows, and any structure it can turn into a defensible silk bunker.",
    "Give an OBT anchor points and time and it will redesign the enclosure. Web tunnels, curtains, trip lines, escape tubes, and orange legs appearing through silk like a warning light behind frosted glass.",
    "The orange form gets the fame, but the species is not one color. Across the hobby and across its range, P. murinus appears in red, orange, brown, golden, and dark forms. The legend wears different uniforms.",
    "That starburst carapace is the part people forget to praise. Everyone talks about the attitude, but the design itself is viciously elegant: radial lines, hot color, black accents, and a body plan that looks like it came with a siren.",
    "Keepers learn the real lesson eventually. Respect is not fear. Fear makes you sloppy. Respect makes you prepare the catch cup, plan the route, close the door, and admit that the spider is better at being a spider than you are at controlling space.",
    "The OBT is famous because it refuses to become casual. It does not soften itself for the hobby, and that is exactly why the hobby never stopped talking about it."
  ],
  whyWeLoveIt:
    "A rite of passage in orange. Fast, defensive, iconic, and impossible to reduce to a meme once you understand the animal behind the legend.",
},
];

export function getSpeciesBySlug(slug) {
  return speciesList.find((s) => s.slug === slug) || null;
}

export function getSpeciesByLatinName(latinName) {
  return speciesList.find((s) => s.species === latinName) || null;
}
