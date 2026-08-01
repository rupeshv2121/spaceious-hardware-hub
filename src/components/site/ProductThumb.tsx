import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  /** Supply all three to render the real 3D model instead of the monogram. */
  productId?: string;
  categorySlug?: string;
  finish?: string;
  /** Shows the "3D" chip once the render lands. */
  badge?: boolean;
  className?: string;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * Product preview tile.
 *
 * Renders the monogram placeholder immediately — on the server, before
 * hydration, and forever if WebGL is unavailable — then swaps in a 3D render of
 * the product once the tile scrolls into view. The render is produced by the
 * shared off-screen renderer in `product-thumbnail.ts`, so a full catalogue
 * page still only uses one WebGL context.
 */
export function ProductThumb({
  name,
  productId,
  categorySlug,
  finish,
  badge = false,
  className = "",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);

  const model3d = productId && categorySlug && finish;

  useEffect(() => {
    if (!model3d) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const start = async () => {
      const { renderProductThumbnail } = await import("@/lib/product-thumbnail");
      const url = await renderProductThumbnail(productId, categorySlug, finish);
      if (!cancelled && url) setImage(url);
    };

    if (typeof IntersectionObserver === "undefined") {
      void start();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void start();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [model3d, productId, categorySlug, finish]);

  return (
    <div
      ref={hostRef}
      className={`relative flex items-center justify-center overflow-hidden bg-secondary ${className}`}
    >
      {/* Same studio sweep the 3D viewer uses, so cards and the detail page
          match. The old backdrop was a hard gold radial tuned for the flat
          monogram — behind a metallic render it reads as a yellow blob. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,var(--color-card),var(--color-secondary)_72%)]" />
      <div className="gradient-brand-soft absolute inset-0" />

      {image ? (
        <img
          src={image}
          alt={`3D render of the ${name}`}
          loading="lazy"
          decoding="async"
          className="relative h-full w-full object-contain transition-opacity duration-500 starting:opacity-0"
        />
      ) : (
        <span
          aria-hidden="true"
          className="relative font-display text-3xl font-semibold text-muted-foreground/50"
        >
          {initials(name)}
        </span>
      )}

      {badge && image && (
        <span className="gradient-brand pointer-events-none absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
          3D
        </span>
      )}
    </div>
  );
}
