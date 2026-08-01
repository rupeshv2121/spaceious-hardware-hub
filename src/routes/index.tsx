import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Layers, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, featuredProducts } from "@/lib/catalog";
import hero from "@/assets/hero-hardware.jpg";
import catHandles from "@/assets/cat-handles.jpg";
import catLocks from "@/assets/cat-locks.jpg";
import catAldrops from "@/assets/cat-aldrops.jpg";
import catKits from "@/assets/cat-kits.jpg";
import catHinges from "@/assets/cat-hinges.jpg";
import catCabinet from "@/assets/cat-cabinet.jpg";
import catGlass from "@/assets/cat-glass.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Space-ious — Hardware That Fits Every Space" },
      {
        name: "description",
        content:
          "Locks, door handles, aldrops, hinges and fittings for households, shops and commercial spaces. Explore the Space-ious hardware catalogue and request a quote.",
      },
      { property: "og:title", content: "Space-ious — Hardware That Fits Every Space" },
      {
        property: "og:description",
        content:
          "Locks, door handles, aldrops, hinges and fittings for households, shops and commercial spaces. Explore the Space-ious hardware catalogue and request a quote.",
      },
    ],
  }),
  component: Home,
});

const catImages: Record<string, string> = {
  "handles-knobs": catHandles,
  locks: catLocks,
  "aldrops-bolts": catAldrops,
  "door-kits": catKits,
  "hinges-closers": catHinges,
  "cabinet-hardware": catCabinet,
  "glass-fittings": catGlass,
};

const why = [
  { icon: ShieldCheck, title: "Quality materials", text: "SS 304, solid brass and zinc alloy sourced from audited mills." },
  { icon: Layers, title: "Range & variety", text: "Hundreds of SKUs across sizes, sections and applications." },
  { icon: Truck, title: "Built to last", text: "Cycle-tested mechanisms and load-rated fittings for daily use." },
  { icon: Sparkles, title: "Trusted finishes", text: "PVD and powder coatings that resist tarnish, rust and wear." },
];

function Home() {
  return (
    <>
      <section className="bg-steel text-steel-foreground">
       <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium tracking-wide text-accent-foreground">
              Household · Retail · Commercial
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              Hardware that fits every space
            </h1>
            <div className="mt-6 h-0.5 w-24 bg-gold" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-steel-foreground/75 sm:text-lg">
              Space-ious supplies aldrops, door handles, locks, door kits, hinges and
              fittings across a wide range of materials, sizes and finishes — engineered
              for everyday use and specified for projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">
                  Explore products <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold">
                <Link to="/contact">Get a quote</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
            <img
              src={hero}
              alt="Brass and steel door hardware including handles, hinges, knobs and an aldrop"
              width={1408}
              height={1104}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
       </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <Link to="/products" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
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
              {catImages[c.slug] ? (
                <img
                  src={catImages[c.slug]}
                  alt={c.name}
                  loading="lazy"
                  width={900}
                  height={700}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/10] w-full bg-[radial-gradient(circle_at_35%_30%,var(--color-accent),var(--color-secondary))]" />
              )}
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
              What started as a single hardware counter is now a curated catalogue serving
              builders, interior contractors, retailers and homeowners. Every item we list
              is checked for fit, finish consistency and long-term durability.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/about">Learn more about us</Link>
            </Button>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {[
              ["18+", "Years in hardware"],
              ["700+", "SKUs catalogued"],
              ["6", "Finish families"],
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
              Share your requirement list and we'll respond with availability, finishes and
              a quotation within a working day.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/contact">Send an enquiry</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
