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
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    product: typeof search.product === "string" ? search.product : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact & Enquiry — Space-ious Hardware" },
      {
        name: "description",
        content:
          "Send your hardware requirement to Space-ious for a quotation, or reach us by phone, WhatsApp or email. Ahmedabad, Gujarat.",
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
            toast.success("Enquiry sent", {
              description: "Our team will get back to you within one working day.",
            });
            (e.target as HTMLFormElement).reset();
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
                <Input id="interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} />
              ) : (
                <Select>
                  <SelectTrigger id="interest"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} placeholder="Sizes, finishes, quantities…" />
            </div>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
            Send enquiry
          </Button>
        </form>

        <div className="space-y-5">
          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-semibold">Visit or call</h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{info.address}</li>
              <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0" /><a href={`tel:${info.phoneHref}`} className="hover:text-foreground">{info.phone}</a></li>
              <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0" /><a href={`mailto:${info.email}`} className="hover:text-foreground">{info.email}</a></li>
              <li className="flex gap-3"><Clock className="h-4 w-4 shrink-0" />{info.hours}</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`https://wa.me/${info.whatsapp}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp us
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${info.phoneHref}`}><Phone className="mr-1.5 h-4 w-4" /> Call now</a>
              </Button>
            </div>
          </div>

          <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-[radial-gradient(circle_at_40%_35%,var(--color-accent),var(--color-secondary))] text-sm text-muted-foreground">
            Map placeholder — Ahmedabad showroom
          </div>
        </div>
      </div>
    </div>
  );
}
