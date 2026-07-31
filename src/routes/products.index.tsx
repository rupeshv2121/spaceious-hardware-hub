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
import { categories, finishes, materials, products } from "@/lib/catalog";
import { useMemo, useState } from "react";

type Search = { category?: string; q?: string };

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search.category === "string" ? search.category : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Products & Categories — Space-ious Hardware" },
      {
        name: "description",
        content:
          "Browse locks, door handles, aldrops, door kits, hinges, cabinet hardware and glass fittings by material, finish and size.",
      },
      { property: "og:title", content: "Products & Categories — Space-ious Hardware" },
      {
        property: "og:description",
        content: "The full Space-ious hardware catalogue, filterable by category, material and finish.",
      },
    ],
  }),
  component: Products,
});

function Products() {
  const { category, q } = Route.useSearch();
  const navigate = useNavigate();
  const [material, setMaterial] = useState("all");
  const [finish, setFinish] = useState("all");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState(q ?? "");

  const setCategory = (slug?: string) =>
    navigate({ to: "/products", search: { category: slug, q: q || undefined } });

  const list = useMemo(() => {
    const term = (q ?? "").toLowerCase().trim();
    let out = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (material !== "all" && p.material !== material) return false;
      if (finish !== "all" && p.finish !== finish) return false;
      if (term && !`${p.name} ${p.material} ${p.finish}`.toLowerCase().includes(term)) return false;
      return true;
    });
    if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") out = [...out].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return out;
  }, [category, material, finish, sort, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-semibold sm:text-4xl">Products</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Hardware for households, shops and commercial spaces — filter by category,
          material or finish, then send an enquiry for pricing.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Categories
          </h2>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
            <button
              onClick={() => setCategory(undefined)}
              className={`rounded-xl px-3.5 py-2 text-left text-sm font-medium transition-colors ${
                !category ? "bg-steel text-steel-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              All products
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={`rounded-xl px-3.5 py-2 text-left text-sm font-medium transition-colors ${
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

        <div>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <form
              className="flex min-w-[220px] flex-1 gap-2"
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
              <Button type="submit" variant="outline">Search</Button>
            </form>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger className="w-[170px]"><SelectValue placeholder="Material" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All materials</SelectItem>
                {materials.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={finish} onValueChange={setFinish}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Finish" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All finishes</SelectItem>
                {finishes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured first</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Showing {list.length} product{list.length === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
          </p>

          {list.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-card p-10 text-center shadow-[var(--shadow-soft)]">
              <p className="text-muted-foreground">No products match these filters.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/products" search={{ category: undefined, q: undefined }}>Clear filters</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
