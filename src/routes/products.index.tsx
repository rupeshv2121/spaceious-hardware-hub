import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, finishes, products } from "@/lib/catalog";
import { useMemo, useState } from "react";

type Search = { category: string | undefined; q: string | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Products & Categories — Space-ious Hardware" },
      {
        name: "description",
        content:
          "Browse Space-ious door and cabinet handles, knobs, folding handles, rim locks, hooks, curtain brackets and door accessories by category and finish.",
      },
      { property: "og:title", content: "Products & Categories — Space-ious Hardware" },
      {
        property: "og:description",
        content: "The full Space-ious hardware catalogue, filterable by category and finish.",
      },
    ],
  }),
  component: Products,
});

function Products() {
  const { category, q } = Route.useSearch();
  const navigate = useNavigate();
  const [finish, setFinish] = useState("all");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState(q ?? "");

  const setCategory = (slug?: string) =>
    navigate({ to: "/products", search: { category: slug, q: q || undefined } });

  const list = useMemo(() => {
    const term = (q ?? "").toLowerCase().trim();
    let out = products.filter((p) => {
      if (category && p.category !== category) return false;
      // A finish listed under `variants` still counts as available in it, so
      // filtering by "Black" surfaces the D-2 knob even though its headline
      // finish is chrome.
      if (finish !== "all" && p.finish !== finish && !p.variants.includes(finish)) return false;
      if (term && !`${p.name} ${p.code} ${p.finish}`.toLowerCase().includes(term)) return false;
      return true;
    });
    if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured")
      out = [...out].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return out;
  }, [category, finish, sort, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-12 lg:px-8">
      <header>
        <h1 className="text-3xl font-semibold sm:text-4xl">Products</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Hardware for households, shops and commercial spaces — filter by category or finish, then
          send an enquiry for pricing.
        </p>
      </header>

      {/* grid-cols-1 is load-bearing, not decoration. Without it the implicit
          mobile column is an `auto` track, which sizes to max-content — and the
          max-content of the horizontally-scrolling category strip below is its
          *content* width (~1000px of chips), not its visible width. The track
          then overflows the viewport and the browser scales the whole page down
          to fit. minmax(0,1fr) bounds the track; min-w-0 lets the item shrink
          into it. */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        {/* Offset by the overlaying header so the sticky column doesn't tuck
            underneath it. */}
        <aside className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Categories
          </h2>
          {/* Below lg this is a single swipeable row rather than a wrapped
              block: seven chips of uneven width wrap into a ragged stack that
              eats most of a phone screen before any product is visible. The
              negative margin lets it bleed to the screen edge so the row reads
              as scrollable. */}
          <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            <button
              onClick={() => setCategory(undefined)}
              aria-pressed={!category}
              className={`shrink-0 snap-start whitespace-nowrap rounded-xl px-3.5 py-2 text-left text-sm font-medium transition-colors lg:w-full lg:whitespace-normal ${
                !category
                  ? "bg-steel text-steel-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              All products
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                aria-pressed={category === c.slug}
                className={`shrink-0 snap-start whitespace-nowrap rounded-xl px-3.5 py-2 text-left text-sm font-medium transition-colors lg:w-full lg:whitespace-normal ${
                  category === c.slug
                    ? "bg-steel text-steel-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          {/* Stacked on phones, inline from md. The selects were fixed-width,
              which overflowed a 375px screen and forced ragged wrapping. */}
          <div className="rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)] sm:p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/products", search: { category, q: query || undefined } });
              }}
            >
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
              />
              <Button type="submit" variant="outline" className="shrink-0">
                Search
              </Button>
            </form>

            <div className="mt-2.5 grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
              <Select value={finish} onValueChange={setFinish}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Finish" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All finishes</SelectItem>
                  {finishes.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured first</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground sm:mt-5">
            Showing {list.length} product{list.length === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
          </p>

          {list.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-card p-10 text-center shadow-[var(--shadow-soft)]">
              <p className="text-muted-foreground">No products match these filters.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/products" search={{ category: undefined, q: undefined }}>
                  Clear filters
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
