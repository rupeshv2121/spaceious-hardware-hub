import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { contact, getCategory, getProduct, productImage, products } from "@/lib/catalog";
import { productEnquiry } from "@/lib/whatsapp";
import { WhatsAppGlyph } from "@/components/site/WhatsAppFab";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product unavailable — Space-ious" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const specs = [product.material, product.finish, product.size].filter(Boolean).join(", ");
    const desc = `${product.name} — ${specs}. Enquire with Space-ious for pricing and availability.`;
    return {
      meta: [
        { title: `${product.name} — Space-ious Hardware` },
        { name: "description", content: desc },
        { property: "og:title", content: `${product.name} — Space-ious Hardware` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const category = getCategory(product.category);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  // Only the specs we can actually confirm are listed — material and size stay
  // out of the table until they are filled in on the catalogue entry.
  const specs = [
    ["Material", product.material],
    ["Finish", product.finish],
    ["Size", product.size],
    ["Available in", product.variants.join(", ")],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="text-sm text-muted-foreground">
        <Link
          to="/products"
          search={{ category: undefined, q: undefined }}
          className="hover:text-foreground"
        >
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/products"
          search={{ category: product.category, q: undefined }}
          className="hover:text-foreground"
        >
          {category?.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-secondary shadow-[var(--shadow-soft)]">
            <img
              src={productImage(product.id)}
              alt={product.name}
              width={1280}
              height={960}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Product photography of the actual item. Finish tones can vary slightly between batches.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {category?.name}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Product code: {product.code}</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

          <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2">
            {specs.map(([k, v]) => (
              <div key={k} className="bg-card p-4">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/contact" search={{ product: product.name }}>
                Enquire now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${contact.phoneHref}`}>
                <Phone className="mr-1.5 h-4 w-4" /> Call us
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={productEnquiry(product)} target="_blank" rel="noreferrer">
                <WhatsAppGlyph className="mr-1.5 h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
