export type Category = {
  slug: string;
  name: string;
  blurb: string;
  /** Product id whose photo represents the category on listing pages. */
  cover: string;
};

export type Product = {
  /** URL segment, React key, and the filename of the photo in assets/products. */
  id: string;
  name: string;
  /** Catalogue reference quoted in enquiries. */
  code: string;
  /** Category slug. */
  category: string;
  finish: string;
  /** Finishes or sizes visible in the product photo. */
  variants: string[];
  description: string;
  /** Optional: only set where the material is known, never inferred from a photo. */
  material?: string;
  /** Optional: only set where the size is confirmed, never inferred from a photo. */
  size?: string;
  featured?: boolean;
};

/**
 * Product photography, keyed by product id.
 *
 * Globbed rather than imported one-by-one so adding a product means dropping a
 * `<id>.jpg` into assets/products and adding the catalogue entry — there is no
 * third place to update. `assertImages` below turns a mismatch into a build
 * failure instead of a silently broken tile.
 */
const files = import.meta.glob("../assets/products/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const images: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace(/^.*\/(.+)\.jpg$/, "$1"), url]),
);

export const productImage = (id: string): string => images[id]!;

export const categories: Category[] = [
  {
    slug: "door-handles",
    name: "Door & Cabinet Handles",
    blurb: "The Model range of pull handles — straight, curved and ornate, in several lengths.",
    cover: "model-110-cp-tt",
  },
  {
    slug: "knobs",
    name: "Knobs & Cup Pulls",
    blurb: "Mushroom, square and cup-shaped pulls for wardrobes, drawers and shutters.",
    cover: "cup-handle",
  },
  {
    slug: "folding-handles",
    name: "Folding Handles",
    blurb: "Flush-fitting handles that fold flat — for sliding shutters and tight-clearance doors.",
    cover: "folding-vita",
  },
  {
    slug: "locks",
    name: "Locks & Keyholes",
    blurb: "Rim locks supplied with keys, striking plates and matching escutcheons.",
    cover: "titan-lock",
  },
  {
    slug: "hooks-hangers",
    name: "Hooks & Hangers",
    blurb: "Coat hooks, hanger rails and gate hooks in single, double and multi-prong patterns.",
    cover: "coat-hanger-regular-vtype",
  },
  {
    slug: "curtain-brackets",
    name: "Curtain Brackets",
    blurb: "Decorative finials and brackets to finish a curtain rod neatly.",
    cover: "curtain-bracket-classic",
  },
  {
    slug: "door-accessories",
    name: "Door Accessories",
    blurb: "Knockers, magnetic catches and chest handles that round out a fit-out.",
    cover: "gate-hook",
  },
];

/** Finish families used across the catalogue — drives the products page filter. */
export const finishes = [
  "Chrome (CP)",
  "Chrome Two-Tone",
  "Satin",
  "Matt",
  "Antique Brass",
  "Gold",
  "Black",
  "Stainless Steel",
  "Brass",
];

export const products: Product[] = [
  // ── Door & cabinet handles ────────────────────────────────────────────────
  {
    id: "model-pari-cp-gloss",
    name: "Pari Pull Handle",
    code: "PARI-CP",
    category: "door-handles",
    finish: "Chrome (CP)",
    variants: ["Three lengths"],
    description:
      "A sculpted handle with a twisted, tapering body that catches light along its whole length. Gloss chrome plated, supplied in three lengths.",
    featured: true,
  },
  {
    id: "model-036-cp",
    name: "036 Pull Handle",
    code: "036-CP",
    category: "door-handles",
    finish: "Chrome (CP)",
    variants: ["Two lengths"],
    description:
      "A gently arched pull with a broad centre section and compact fixing bosses — an easy fit for main doors and wardrobe shutters alike.",
  },
  {
    id: "model-110-cp-tt",
    name: "110 Pull Handle",
    code: "110-CP-TT",
    category: "door-handles",
    finish: "Chrome Two-Tone",
    variants: ["Four lengths"],
    description:
      "Straight square-section pull in a two-tone chrome finish, offered from short cabinet sizes up to a full-length door pull.",
  },
  {
    id: "model-350-cp",
    name: "350 Pull Handle",
    code: "350-CP",
    category: "door-handles",
    finish: "Chrome (CP)",
    variants: ["Three lengths"],
    description:
      "A slim swept handle with flared, stepped ends. Mirror chrome plated and available in three lengths for doors and drawer fronts.",
  },
  {
    id: "model-400-antique",
    name: "400 Pull Handle",
    code: "400-ANT",
    category: "door-handles",
    finish: "Antique Brass",
    variants: ["Three lengths", "Cranked short pull"],
    description:
      "Square-section pull in an antique brass finish, with a right-angled short version for cabinet doors. Suits heritage and rustic interiors.",
  },
  {
    id: "model-cadbury-cp-tt",
    name: "Cadbury Pull Handle",
    code: "CADBURY-CP-TT",
    category: "door-handles",
    finish: "Chrome Two-Tone",
    variants: ["Two lengths"],
    description:
      "Flat-bar handle with a stepped return at each end, finished in two-tone chrome. A clean, contemporary profile for wardrobe and kitchen shutters.",
  },
  {
    id: "model-grip",
    name: "Grip Pull Handle",
    code: "GRIP-SS-CP",
    category: "door-handles",
    finish: "Stainless Steel",
    variants: ["Stainless Steel", "Chrome (CP)"],
    description:
      "A rounded pull with a comfortable grip section and beaded ends, offered in stainless steel and chrome-plated finishes.",
  },
  {
    id: "model-jockey-cp",
    name: "Jockey Pull Handle — Chrome",
    code: "JOCKEY-CP",
    category: "door-handles",
    finish: "Chrome (CP)",
    variants: ["Three lengths"],
    description:
      "A tapered handle that narrows towards the centre and flattens into wide fixing pads. Bright chrome plated, in three lengths.",
  },
  {
    id: "model-jockey-matt",
    name: "Jockey Pull Handle — Matt",
    code: "JOCKEY-MATT",
    category: "door-handles",
    finish: "Matt",
    variants: ["Three lengths"],
    description:
      "The Jockey profile in a matt finish — the same tapered body, with a soft non-reflective surface that hides fingerprints.",
  },
  {
    id: "model-luxe-cp-glossy",
    name: "Luxe Pull Handle",
    code: "LUXE-CP",
    category: "door-handles",
    finish: "Chrome (CP)",
    variants: ["Two lengths"],
    description:
      "An angular handle with a flat blade body and square returns, in gloss chrome. Built for modern, hard-edged joinery.",
  },
  {
    id: "model-more-antique",
    name: "More 100 Pull Handle — Antique",
    code: "MORE-100-ANT",
    category: "door-handles",
    finish: "Antique Brass",
    variants: ["Three lengths"],
    description:
      "An ornate cast handle with an engraved body and scalloped rose plates, finished in antique brass with a green-toned patina.",
  },
  {
    id: "model-more-gold",
    name: "More 100 Pull Handle — Gold",
    code: "MORE-100-GLD",
    category: "door-handles",
    finish: "Gold",
    variants: ["Three lengths"],
    description:
      "The More 100 casting in a bright gold finish — a decorative pull for pooja room doors, wardrobes and traditional interiors.",
  },
  {
    id: "model-oval-d-cp",
    name: "Oval D Pull Handle",
    code: "OVALD-SS-CP",
    category: "door-handles",
    finish: "Stainless Steel",
    variants: ["Stainless Steel", "Chrome (CP)"],
    description:
      "A plain oval-section D handle, supplied in stainless steel and chrome. The workhorse pull for cabinets and everyday doors.",
  },
  {
    id: "model-oval-d-dot",
    name: "Oval D Dot Pull Handle",
    code: "OVALD-DOT",
    category: "door-handles",
    finish: "Chrome (CP)",
    variants: ["Three lengths"],
    description:
      "The Oval D profile with a row of punched detailing along the face, in chrome. Available in three lengths.",
  },

  // ── Knobs & cup pulls ─────────────────────────────────────────────────────
  {
    id: "d2-knob",
    name: "D-2 Knob",
    code: "D2",
    category: "knobs",
    finish: "Chrome (CP)",
    variants: ["Chrome (CP)", "Antique Brass", "Black"],
    description:
      "A domed mushroom knob on a short neck — the standard pull for wardrobe shutters and drawers. Stocked in chrome, antique brass and black.",
    featured: true,
  },
  {
    id: "d2-knob-satin",
    name: "D-2 Knob — Satin",
    code: "D2-SAT",
    category: "knobs",
    finish: "Satin",
    variants: ["Satin"],
    description:
      "The D-2 knob in a brushed satin finish, for joinery where a bright plated knob would look out of place.",
  },
  {
    id: "cup-handle",
    name: "Cup Handle",
    code: "CUP",
    category: "knobs",
    finish: "Antique Brass",
    variants: ["Antique Brass", "Gold", "Chrome (CP)"],
    description:
      "A shell-shaped recessed pull that sits flush against the drawer front, with engraved border detailing. Supplied in antique, gold and chrome finishes.",
  },
  {
    id: "brass-knob",
    name: "Brass Knob",
    code: "BRASS-KNOB",
    category: "knobs",
    material: "Brass",
    finish: "Brass",
    variants: ["With rose plate", "Fixing screw included"],
    description:
      "A turned solid brass knob supplied with a matching rose plate and fixing screw. Polished to a warm, even shine.",
  },
  {
    id: "ss-solid-knob",
    name: "SS Solid Knob",
    code: "SS-SOLID",
    category: "knobs",
    material: "Stainless Steel",
    finish: "Stainless Steel",
    variants: ["Plain face", "Cut-diamond face"],
    description:
      "A solid stainless steel knob on a turned stem, offered with a plain mirror face or a cut-diamond faceted face.",
  },
  {
    id: "ss-hollow-knob",
    name: "SS Hollow Knob",
    code: "SS-HOLLOW",
    category: "knobs",
    material: "Stainless Steel",
    finish: "Stainless Steel",
    variants: ["Plain face", "Cut-diamond face"],
    description:
      "The hollow-formed version of the stainless knob — the same profile at a lighter weight, supplied with its rose and fixing bolt.",
  },
  {
    id: "square-antique-knob",
    name: "Square Knob — Antique",
    code: "SQ-ANT",
    category: "knobs",
    finish: "Antique Brass",
    variants: ["Antique Brass"],
    description:
      "A flat-topped square knob with softened corners in an antique brass finish — a quiet, geometric alternative to a round pull.",
  },
  {
    id: "cstar-antique-handle",
    name: "C-Star Handle — Antique",
    code: "CSTAR-ANT",
    category: "knobs",
    finish: "Antique Brass",
    variants: ["Antique Brass"],
    description:
      "A squared D-shaped handle with banded detailing at the neck, cast and finished in antique brass for cabinets and chest fronts.",
  },

  // ── Folding handles ───────────────────────────────────────────────────────
  {
    id: "folding-vita",
    name: "Vita Folding Handle",
    code: "VITA-FOLD",
    category: "folding-handles",
    finish: "Antique Brass",
    variants: ["Antique Brass"],
    description:
      "An oval folding handle that lies flat in its recessed backplate when not in use — ideal for sliding shutters and doors with no clearance.",
    featured: true,
  },
  {
    id: "folding-nexa-satin-cp",
    name: "Nexa Folding Handle — Satin",
    code: "NEXA-SAT",
    category: "folding-handles",
    finish: "Satin",
    variants: ["Satin"],
    description:
      "A rounded-rectangle folding handle with a satin body and chrome surround, sitting flush with the shutter face when folded.",
  },
  {
    id: "folding-nexa-black-cp",
    name: "Nexa Folding Handle — Black",
    code: "NEXA-BLK",
    category: "folding-handles",
    finish: "Black",
    variants: ["Black with chrome trim"],
    description:
      "The Nexa folding handle in black with a bright chrome outer edge — a strong contrast against light-coloured laminate.",
  },
  {
    id: "folding-nexa-antique",
    name: "Nexa Folding Handle — Antique",
    code: "NEXA-ANT",
    category: "folding-handles",
    finish: "Antique Brass",
    variants: ["Antique Brass"],
    description:
      "The Nexa folding handle in a matt antique brass finish, for wardrobes and sliding units in warmer timber tones.",
  },
  {
    id: "folding-star",
    name: "Star Folding Handle",
    code: "STAR-FOLD",
    category: "folding-handles",
    finish: "Satin",
    variants: ["Satin with chrome insert"],
    description:
      "A hexagonal folding handle with a faceted chrome insert set into a satin backplate — a decorative take on the flush pull.",
  },

  // ── Locks & keyholes ──────────────────────────────────────────────────────
  {
    id: "titan-lock",
    name: "Titan Rim Lock",
    code: "TITAN",
    category: "locks",
    finish: "Stainless Steel",
    variants: ["Keys included", "Striking plate", "Escutcheon"],
    description:
      "A surface-mounted rim lock in a stainless finish, supplied as a complete set with keys, striking plate and keyhole escutcheon.",
    featured: true,
  },
  {
    id: "bullet-lock",
    name: "Bullet Rim Lock",
    code: "BULLET",
    category: "locks",
    finish: "Antique Brass",
    variants: ["Two keys", "Striking plate", "Escutcheon"],
    description:
      "A compact rim lock with a drilled body plate, finished in antique brass and supplied with two lever keys and its keyhole plate.",
  },
  {
    id: "door-lock-3",
    name: "Door Lock 3",
    code: "DL-3",
    category: "locks",
    finish: "Antique Brass",
    variants: ["Two keys", "Escutcheon"],
    description:
      "A traditional rim lock body with a brass-toned finish and slotted front plate, supplied with two keys and a matching keyhole cover.",
  },
  {
    id: "door-lock-3-special",
    name: "Door Lock 3 Special",
    code: "DL-3-SPL",
    category: "locks",
    finish: "Satin",
    variants: ["Two keys", "Striking plate"],
    description:
      "The heavier-bodied version of Door Lock 3 in a satin finish, with a deeper case and reinforced striking plate.",
  },
  {
    id: "jupiter-lock",
    name: "Jupiter Rim Lock",
    code: "JUPITER",
    category: "locks",
    finish: "Antique Brass",
    variants: ["Keys included", "Striking plate", "Escutcheon"],
    description:
      "A rim lock set finished in antique brass, packed with its keys, striking plate, round escutcheon and full fixing kit.",
  },
  {
    id: "keyhole-eco",
    name: "Keyhole Plate — Eco",
    code: "KH-ECO",
    category: "locks",
    finish: "Antique Brass",
    variants: ["Antique Brass", "Satin"],
    description:
      "A slim rectangular escutcheon that covers and dresses the keyhole cut-out. Sold separately so an existing lock can be refreshed.",
  },

  // ── Hooks & hangers ───────────────────────────────────────────────────────
  {
    id: "coat-hanger-regular-vtype",
    name: "Coat Hanger Rail — Regular & V-Type",
    code: "CH-RAIL",
    category: "hooks-hangers",
    finish: "Chrome (CP)",
    variants: ["Regular hooks", "V-type hooks"],
    description:
      "A wall-mounted hanger rail carrying four chrome hooks, offered with straight regular hooks or angled V-type hooks.",
    featured: true,
  },
  {
    id: "coat-hook-single-double",
    name: "Coat Hook — Single & Double",
    code: "CH-SD",
    category: "hooks-hangers",
    finish: "Chrome (CP)",
    variants: ["Single hook", "Double hook"],
    description:
      "A compact wall hook on a small backplate, in single-prong and double-prong versions for doors, bathrooms and utility walls.",
  },
  {
    id: "coat-hanger-kite-pan",
    name: "Coat Hook — Kite & Pan Plate",
    code: "CH-KP",
    category: "hooks-hangers",
    finish: "Chrome (CP)",
    variants: ["Kite plate", "Pan plate"],
    description:
      "A twin-prong hook supplied on two backplate shapes — a square kite plate and a rounded pan plate — so it can match existing fittings.",
  },
  {
    id: "coat-hanger-butterfly",
    name: "Butterfly Coat Hanger",
    code: "CH-BFLY",
    category: "hooks-hangers",
    finish: "Chrome (CP)",
    variants: ["Four arms"],
    description:
      "A four-arm hanger on a domed circular base, with arms that swing out from the centre. Takes several coats in the space of one hook.",
  },
  {
    id: "gate-hook",
    name: "Gate Hook",
    code: "GATE-HOOK",
    category: "hooks-hangers",
    finish: "Chrome (CP)",
    variants: ["Chrome (CP)", "Antique Brass", "Powder coated"],
    description:
      "A hook-and-eye door stay that holds a door or gate open against the wall. Available in several sizes and finishes.",
  },

  // ── Curtain brackets ──────────────────────────────────────────────────────
  {
    id: "curtain-bracket-classic",
    name: "Classic Curtain Bracket",
    code: "CB-CLASSIC",
    category: "curtain-brackets",
    finish: "Antique Brass",
    variants: ["Wood-tone finial"],
    description:
      "A turned finial with stacked mouldings and a wood-tone lacquer, seated on a steel collar that clamps to the rod.",
    featured: true,
  },
  {
    id: "curtain-bracket-onyx",
    name: "Onyx Curtain Bracket",
    code: "CB-ONYX",
    category: "curtain-brackets",
    finish: "Black",
    variants: ["Crystal-set border"],
    description:
      "A teardrop finial in deep gloss black, edged with a row of set crystals and finished with a polished steel collar.",
  },

  // ── Door accessories ──────────────────────────────────────────────────────
  {
    id: "door-knocker-lion",
    name: "Lion Door Knocker",
    code: "DK-LION",
    category: "door-accessories",
    finish: "Antique Brass",
    variants: ["Antique Brass"],
    description:
      "A cast lion-head knocker with a weighted ring striker, finished in antique brass. A statement piece for a main entrance door.",
    featured: true,
  },
  {
    id: "chest-handle",
    name: "Chest Handle",
    code: "CHEST",
    category: "door-accessories",
    finish: "Chrome (CP)",
    variants: ["Drop-down handle"],
    description:
      "A drop-down carry handle on a long mounting plate that folds flat against the face. Made for trunks, storage boxes and chest lids.",
  },
  {
    id: "magnet-m7",
    name: "Magnet Catch M-7",
    code: "M-7",
    category: "door-accessories",
    finish: "Satin",
    variants: ["With strike plate and screws"],
    description:
      "A magnetic catch that holds a cabinet shutter closed without a latch. Supplied with its strike plate and fixing screws.",
  },
];

/** Every product must have a matching photo — fail the build, not the page. */
const missing = products.filter((p) => !images[p.id]).map((p) => p.id);
if (missing.length > 0) {
  throw new Error(`Missing product photos in assets/products: ${missing.join(", ")}`);
}

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const featuredProducts = products.filter((p) => p.featured);

export const contact = {
  phone: "+91 89236 46841",
  phoneHref: "+918923646841",
  /** wa.me format: country code + number, no "+" and no separators. */
  whatsapp: "918923646841",
  email: "sales@space-ious.in",
  city: "Aligarh",
  region: "Uttar Pradesh",
  country: "India",
  address: "Hardware Market, Aligarh, Uttar Pradesh 202001, India",
  hours: "Mon – Sat, 9:30 AM – 7:00 PM",
};
