/**
 * Finish definitions, kept free of any three.js import.
 *
 * Routes and cards need the finish list to render their pickers, but must not
 * drag the ~700 kB three.js bundle into the SSR output or the initial client
 * chunk — `product-3d.ts` (which does import three) reads its material values
 * from here instead of the other way round.
 */

export type FinishSpec = {
  /** sRGB hex of the base metal. */
  color: number;
  metalness: number;
  roughness: number;
};

/** Keyed by the `finish` strings used in `catalog.ts`. */
export const FINISHES: Record<string, FinishSpec> = {
  "Satin Brass": { color: 0xc9a227, metalness: 1, roughness: 0.32 },
  "Antique Brass": { color: 0x8a6a3a, metalness: 1, roughness: 0.52 },
  "Brushed Steel": { color: 0xb6bcc2, metalness: 1, roughness: 0.34 },
  "Matte Black": { color: 0x2b2b2e, metalness: 0.65, roughness: 0.62 },
  Chrome: { color: 0xeef2f6, metalness: 1, roughness: 0.06 },
  "Rose Gold": { color: 0xd39079, metalness: 1, roughness: 0.28 },
  /* Non-catalogue finishes that a few variant lists mention. */
  "Powder Coated": { color: 0x3a3a3d, metalness: 0.4, roughness: 0.75 },
  Galvanised: { color: 0x9aa2a8, metalness: 0.9, roughness: 0.5 },
};

export const DEFAULT_FINISH = "Brushed Steel";

export const finishSpec = (finish: string): FinishSpec =>
  FINISHES[finish] ?? FINISHES[DEFAULT_FINISH]!;

/** CSS swatch colour for a finish, for use outside the 3D viewer. */
export const finishSwatch = (finish: string): string =>
  `#${finishSpec(finish).color.toString(16).padStart(6, "0")}`;

/**
 * Finishes offered for a product: the catalogue finish first, then any variant
 * names that are themselves finishes.
 */
export function finishOptions(product: { finish: string; variants: string[] }) {
  const out = [product.finish];
  for (const v of product.variants) {
    if (v in FINISHES && !out.includes(v)) out.push(v);
  }
  return out;
}
