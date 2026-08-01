/**
 * Renders the SVG paint server that the `icon-gradient` utility references.
 *
 * CSS can only fill/stroke an element with a gradient by pointing at an SVG
 * <linearGradient> that exists somewhere in the same document, so this sits
 * once in the root layout. It must stay in the layout (not `display: none`)
 * for the reference to resolve in every browser, hence the 0x0 absolute box.
 */
export function BrandGradientDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <linearGradient id="sx-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-deep)" />
          <stop offset="45%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--gold)" />
        </linearGradient>
        {/* Lifted variant for icons on the dark steel header/footer. */}
        <linearGradient id="sx-brand-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="55%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="oklch(0.865 0.088 86)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
