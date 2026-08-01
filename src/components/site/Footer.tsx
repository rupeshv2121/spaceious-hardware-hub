import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { categories, contact } from "@/lib/catalog";
import { generalEnquiry } from "@/lib/whatsapp";
import { WhatsAppGlyph } from "./WhatsAppFab";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-gold bg-steel text-steel-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-card font-display text-sm font-bold">
              <span className="text-gradient-brand">S</span>
            </span>
            <span className="text-gradient-brand-light font-display text-lg font-semibold">
              Space-ious
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel-foreground/70">
            Architectural hardware for households, shops and commercial spaces — locks, handles,
            aldrops and fittings in a finish for every space.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
              <span
                key={i}
                className="grid h-9 w-9 place-items-center rounded-lg bg-steel-foreground/10"
              >
                <Icon className="icon-gradient-light h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold">Quick links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-steel-foreground/70">
            <li>
              <Link to="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                search={{ category: undefined, q: undefined }}
                className="hover:text-gold"
              >
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gold">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" search={{ product: undefined }} className="hover:text-gold">
                Contact & enquiry
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold">Categories</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-steel-foreground/70">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/products"
                  search={{ category: c.slug, q: undefined }}
                  className="hover:text-gold"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gold">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-steel-foreground/70">
            <li className="flex gap-2.5">
              <MapPin className="icon-gradient-light mt-0.5 h-4 w-4 shrink-0" />
              <span>{contact.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="icon-gradient-light h-4 w-4 shrink-0" />
              <a href={`tel:${contact.phoneHref}`} className="hover:text-gold">
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="icon-gradient-light h-4 w-4 shrink-0" />
              <a href={`mailto:${contact.email}`} className="hover:text-gold">
                {contact.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <WhatsAppGlyph className="h-4 w-4 shrink-0 text-[#25D366]" />
              <a
                href={generalEnquiry()}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/40">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-steel-foreground/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Space-ious Hardware. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
