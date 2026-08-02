import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, MessageCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generalEnquiry } from "@/lib/whatsapp";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

/**
 * Floating pill navbar.
 *
 * Deliberately not full-bleed: the bar is inset from the viewport edges and
 * capped below the content width, so it reads as a card hovering over the page
 * rather than as browser chrome.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const closePanels = () => {
    setOpen(false);
    setShowSearch(false);
  };

  // Dismiss on outside press or Escape. Bound only while a panel is open so we
  // aren't holding document listeners for the whole session.
  useEffect(() => {
    if (!open && !showSearch) return;

    const onPointerDown = (event: PointerEvent) => {
      if (barRef.current?.contains(event.target as Node)) return;
      closePanels();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanels();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, showSearch]);

  // Any navigation closes the panels, including links that don't go through the
  // menu itself (the logo, "Get a quote").
  useEffect(closePanels, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearch(false);
    setOpen(false);
    navigate({ to: "/products", search: { q: q || undefined, category: undefined } });
  };

  return (
    /* Zero-height on purpose: the bar overlays whatever section is beneath it
       rather than sitting in a band of its own, so a full-bleed hero runs right
       up to the top of the page. Page content is cleared by --header-h instead.
       The wrapper ignores pointer events so the transparent gutter around the
       pill doesn't swallow clicks meant for the section underneath. */
    <header className="sticky top-0 z-50 h-0">
      {/* Nothing here reacts to scroll position. An earlier version tightened
          the offset and swapped in a heavier shadow once the page moved, and
          both read as the bar resizing as you passed the hero. */}
      <div className="pointer-events-none px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8">
        <div
          ref={barRef}
          /* The gold ring carries real weight here: the bar and the home hero
             are both --steel, so without a clearly lit edge the pill blends
             into the hero and only "appears" to narrow once you scroll past it
             onto the cream background. */
          className="gradient-steel pointer-events-auto mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 text-steel-foreground shadow-[var(--shadow-lift)] ring-1 ring-gold/45"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:px-4">
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card font-display text-sm font-bold shadow-sm">
                <span className="text-gradient-brand">S</span>
              </span>
              <span className="text-gradient-brand-light truncate font-display text-lg font-semibold tracking-tight">
                Space-ious
              </span>
            </Link>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <nav className="mr-1 hidden items-center gap-0.5 md:flex">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "bg-white/12 text-gold" }}
                    inactiveProps={{ className: "text-steel-foreground/80" }}
                    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-steel-foreground hover:bg-white/10 hover:text-gold"
                aria-label="Search products"
                aria-expanded={showSearch}
                onClick={() => setShowSearch((s) => !s)}
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hidden rounded-lg text-steel-foreground hover:bg-white/10 hover:text-gold sm:inline-flex"
              >
                <a
                  href={generalEnquiry()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat with us on WhatsApp"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>

              <Button asChild size="sm" className="hidden rounded-lg sm:inline-flex">
                <Link to="/contact" search={{ product: undefined }}>
                  Get a quote
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-steel-foreground hover:bg-white/10 hover:text-gold md:hidden"
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {showSearch && (
            <div className="border-t border-white/10 px-3 py-3 sm:px-4">
              <form onSubmit={submit} className="flex gap-2">
                <Input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search handles, knobs, locks…"
                  className="border-white/15 bg-white/10 text-steel-foreground placeholder:text-steel-foreground/50"
                />
                <Button type="submit" size="sm">
                  Search
                </Button>
              </form>
            </div>
          )}

          {open && (
            <nav className="border-t border-white/10 px-3 py-3 md:hidden">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-steel-foreground/80 transition-colors hover:bg-white/10 hover:text-gold"
                  activeProps={{ className: "bg-white/12 text-gold" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid gap-2">
                <Button asChild size="sm">
                  <Link
                    to="/contact"
                    search={{ product: undefined }}
                    onClick={() => setOpen(false)}
                  >
                    Get a quote
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="text-steel-foreground hover:bg-white/10 hover:text-gold"
                >
                  <a href={generalEnquiry()} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp us
                  </a>
                </Button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
