import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { categories, contact } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-steel font-display text-sm font-bold text-steel-foreground">
              S
            </span>
            <span className="font-display text-lg font-semibold">Space-ious</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Architectural hardware for households, shops and commercial spaces — locks,
            handles, aldrops and fittings in a finish for every space.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
              <span
                key={i}
                className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Quick links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/products" className="hover:text-foreground">Products</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact & enquiry</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Categories</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/products"
                  search={{ category: c.slug, q: undefined }}
                  className="hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{contact.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${contact.phoneHref}`} className="hover:text-foreground">{contact.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${contact.email}`} className="hover:text-foreground">{contact.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Space-ious Hardware. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
