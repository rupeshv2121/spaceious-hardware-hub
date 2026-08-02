import { productImage, type Product } from "@/lib/catalog";

type Props = {
  product: Product;
  /** Eager-load the handful of tiles above the fold; lazy-load the rest. */
  priority?: boolean | undefined;
  className?: string;
};

/**
 * Product photo tile.
 *
 * The catalogue is shot on a mix of backdrops — fabric, wood, grey leather — so
 * tiles use `object-cover` against a neutral panel rather than `object-contain`,
 * which would letterbox each photo's own backdrop inside a differently-coloured
 * frame.
 */
export function ProductThumb({ product, priority = false, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-secondary ${className}`}>
      <img
        src={productImage(product.id)}
        alt={product.name}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}
