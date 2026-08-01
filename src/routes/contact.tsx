import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, contact as info } from "@/lib/catalog";
import { enquiryMessage, generalEnquiry } from "@/lib/whatsapp";
import { WhatsAppGlyph } from "@/components/site/WhatsAppFab";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    product: typeof search["product"] === "string" ? (search["product"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact & Enquiry — Space-ious Hardware" },
      {
        name: "description",
        content:
          "Send your hardware requirement to Space-ious for a quotation, or reach us by phone, WhatsApp or email. Aligarh, Uttar Pradesh.",
      },
      { property: "og:title", content: "Contact & Enquiry — Space-ious Hardware" },
      {
        property: "og:description",
        content: "Request a quote for locks, handles, aldrops, hinges and fittings.",
      },
    ],
  }),
  component: Contact,
});

/** The Select holds a category slug; the message wants the readable name. */
const interestLabel = (value: string) => categories.find((c) => c.slug === value)?.name ?? value;

/* Google's keyless embed endpoint — no API key or billing account needed. */
const mapQuery = encodeURIComponent(info.address);
const mapEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

function Contact() {
  const { product } = Route.useSearch();
  const [interest, setInterest] = useState(product ?? "");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold sm:text-4xl">Contact & enquiry</h1>
        <p className="mt-3 text-muted-foreground">
          Tell us what you need — quantities, finishes and sizes — and we'll come back with
          availability and pricing within one working day.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <form
          className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            const value = (key: string) => (data.get(key) as string | null)?.trim() ?? "";

            // No backend behind this form — hand the enquiry to WhatsApp so it
            // actually reaches us and the sender keeps a copy in their chat.
            const link = enquiryMessage({
              name: value("name"),
              phone: value("phone"),
              email: value("email"),
              interest: interestLabel(interest),
              message: value("message"),
            });

            const opened = window.open(link, "_blank", "noopener,noreferrer");
            if (opened) {
              toast.success("Opening WhatsApp", {
                description: "Your enquiry is pre-filled — just press send.",
              });
              form.reset();
              setInterest("");
            } else {
              toast.error("Couldn't open WhatsApp", {
                description: `Message or call us on ${info.phone} instead.`,
              });
            }
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required placeholder="+91 " />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@company.com" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="interest">Product interest</Label>
              {product ? (
                <Input
                  id="interest"
                  name="interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />
              ) : (
                <Select name="interest" value={interest} onValueChange={setInterest}>
                  <SelectTrigger id="interest">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={15}
                placeholder="Sizes, finishes, quantities…"
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
            <WhatsAppGlyph className="mr-1.5 h-4 w-4" /> Send enquiry on WhatsApp
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Opens WhatsApp with your details filled in — nothing is sent until you press send there.
          </p>
        </form>

        <div className="space-y-5">
          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-semibold">Visit or call</h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {info.address}
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${info.phoneHref}`} className="hover:text-foreground">
                  {info.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${info.email}`} className="hover:text-foreground">
                  {info.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="h-4 w-4 shrink-0" />
                {info.hours}
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <a href={generalEnquiry()} target="_blank" rel="noreferrer">
                  <WhatsAppGlyph className="mr-1.5 h-4 w-4" /> WhatsApp us
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${info.phoneHref}`}>
                  <Phone className="mr-1.5 h-4 w-4" /> Call now
                </a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
            <iframe
              title={`Map of ${info.city}, ${info.region}`}
              src={mapEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border-0"
            />
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 px-5 py-4 text-sm font-medium hover:text-gold"
            >
              <span className="min-w-0 truncate">
                {info.city}, {info.region}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-muted-foreground">
                Open in Maps <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
