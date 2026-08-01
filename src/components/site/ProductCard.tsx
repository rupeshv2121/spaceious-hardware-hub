import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductThumb } from "./ProductThumb";
import { getCategory, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="block"
        aria-label={product.name}
      >
        <ProductThumb
          name={product.name}
          productId={product.id}
          categorySlug={product.category}
          finish={product.finish}
          badge
          className="aspect-[4/3] w-full"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-steel">
            {getCategory(product.category)?.name}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-snug">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-gold">
            {product.material} · {product.finish} · {product.size}
          </p>
        </div>
        <div className="mt-auto flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link to="/products/$productId" params={{ productId: product.id }}>
              View details
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/contact" search={{ product: product.name }}>
              Enquire
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
