import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Layers, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, featuredProducts, productImage } from "@/lib/catalog";

const hero = productImage("model-more-gold");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Space-ious — Hardware That Fits Every Space" },
      {
        name: "description",
        content:
          "Door and cabinet handles, knobs, folding handles, rim locks, hooks, curtain brackets and door accessories for households, shops and commercial spaces. Explore the Space-ious hardware catalogue and request a quote.",
      },
      { property: "og:title", content: "Space-ious — Hardware That Fits Every Space" },
      {
        property: "og:description",
        content:
          "Door and cabinet handles, knobs, folding handles, rim locks, hooks, curtain brackets and door accessories for households, shops and commercial spaces. Explore the Space-ious hardware catalogue and request a quote.",
      },
    ],
  }),
  component: Home,
});

const why = [
  {
    icon: ShieldCheck,
    title: "Quality materials",
    text: "SS 304, solid brass and zinc alloy sourced from audited mills.",
  },
  {
    icon: Layers,
    title: "Range & variety",
    text: "Hundreds of SKUs across sizes, sections and applications.",
  },
  {
    icon: Truck,
    title: "Built to last",
    text: "Cycle-tested mechanisms and load-rated fittings for daily use.",
  },
  {
    icon: Sparkles,
    title: "Trusted finishes",
    text: "PVD and powder coatings that resist tarnish, rust and wear.",
  },
];

function Home() {
  return (
    <>
      {/* Cancels the layout's header offset so the dark hero runs to the very
          top of the page and the navbar floats on top of it. */}
      <section className="mt-[calc(var(--header-h)*-1)] bg-steel pt-[var(--header-h)] text-steel-foreground">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="gradient-brand inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary-foreground">
                Household · Retail · Commercial
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
                Hardware that fits every space
              </h1>
              <div className="gradient-brand mt-6 h-1 w-24 rounded-full" />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-steel-foreground/75 sm:text-lg">
                Space-ious supplies door and cabinet handles, knobs, folding handles, rim locks,
                hooks, curtain brackets and door accessories — in chrome, satin, antique brass, gold
                and black finishes, for everyday use and for projects.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/products" search={{ category: undefined, q: undefined }}>
                    Explore products <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Link to="/contact" search={{ product: undefined }}>
                    Get a quote
                  </Link>
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
              <img
                src={hero}
                alt="Space-ious More 100 pull handles in a gold finish, laid out on a timber surface"
                width={1280}
                height={960}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 mt-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {why.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Shop by category</h2>
            <p className="mt-2 text-muted-foreground">Best-selling ranges across our catalogue.</p>
          </div>
          <Link
            to="/products"
            search={{ category: undefined, q: undefined }}
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            View all products
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ category: c.slug, q: undefined }}
              className="card-lift group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]"
            >
              <img
                src={productImage(c.cover)}
                alt={c.name}
                loading="lazy"
                width={1280}
                height={800}
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="p-5">
                <h3 className="text-base font-semibold">{c.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium">
                  Browse range
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">Featured products</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl bg-secondary p-8 md:grid-cols-2 md:items-center lg:p-12">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Built around fitters and buyers</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              What started as a single hardware counter is now a curated catalogue serving builders,
              interior contractors, retailers and homeowners. Every item we list is checked for fit,
              finish consistency and long-term durability.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/about">Learn more about us</Link>
            </Button>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {[
              ["18+", "Years in hardware"],
              ["700+", "SKUs catalogued"],
              ["9", "Finish families"],
              ["24 hr", "Quote turnaround"],
            ].map(([k, v]) => (
              <div key={v} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
                <dt className="font-display text-2xl font-semibold">{k}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-steel px-8 py-10 text-steel-foreground lg:px-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">Need pricing for a project?</h2>
            <p className="mt-2 text-steel-foreground/70">
              Share your requirement list and we'll respond with availability, finishes and a
              quotation within a working day.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/contact" search={{ product: undefined }}>
              Send an enquiry
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
