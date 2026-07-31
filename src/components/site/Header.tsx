import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearch(false);
    setOpen(false);
    navigate({ to: "/products", search: { q: q || undefined, category: undefined } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-steel font-display text-sm font-bold text-steel-foreground">
            S
          </span>
          <span className="truncate font-display text-lg font-semibold tracking-tight">
            Space-ious
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search products"
            onClick={() => setShowSearch((s) => !s)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/contact">Get a quote</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {showSearch && (
        <div className="border-t border-border/70 bg-card">
          <form onSubmit={submit} className="mx-auto flex max-w-7xl gap-2 px-4 py-3 sm:px-6 lg:px-8">
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search aldrops, handles, hinges…"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      )}

      {open && (
        <nav className="border-t border-border/70 bg-card px-4 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-2 w-full">
            <Link to="/contact" onClick={() => setOpen(false)}>
              Get a quote
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
