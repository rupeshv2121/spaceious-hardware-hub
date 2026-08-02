import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Boxes, Factory, Ruler } from "lucide-react";
import { productImage } from "@/lib/catalog";

const hero = productImage("door-knocker-lion");

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Space-ious — Architectural Hardware Suppliers" },
      {
        name: "description",
        content:
          "Space-ious supplies quality-checked locks, handles, aldrops and fittings to homes, shops and commercial projects. Learn about our sourcing and quality assurance.",
      },
      { property: "og:title", content: "About Space-ious" },
      {
        property: "og:description",
        content: "Our story, our range and how we keep hardware quality consistent.",
      },
    ],
  }),
  component: About,
});

const pillars = [
  {
    icon: BadgeCheck,
    title: "Quality first",
    text: "Salt-spray, cycle and load testing on every incoming lot before it reaches the catalogue.",
  },
  {
    icon: Boxes,
    title: "Real variety",
    text: "Multiple sections, sizes and finishes per product so specifications never get compromised.",
  },
  {
    icon: Ruler,
    title: "Fitment accuracy",
    text: "Standardised backsets, cup sizes and hole centres so replacements drop straight in.",
  },
  {
    icon: Factory,
    title: "Reliable sourcing",
    text: "Based in Aligarh — India's lock-making heartland — with partner units in Rajkot and Jamnagar.",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Hardware chosen with the fitter in mind
          </h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Space-ious began as a family hardware counter serving local carpenters and shopkeepers.
            Over eighteen years the questions never changed — will it fit, will the finish hold, and
            can you supply it again next month? Our catalogue is built around answering all three.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Today we supply households, retail fit-outs and commercial projects with door and
            cabinet handles, knobs, folding handles, rim locks, hooks and hangers, curtain brackets
            and door accessories — kept in consistent finish families so a project can be specified
            end to end from one place.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
          <img
            src={hero}
            alt="Space-ious cast lion-head door knocker in an antique brass finish"
            loading="lazy"
            width={848}
            height={1280}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-20 grid gap-5 sm:grid-cols-2">
        {pillars.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)]">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-secondary p-8 lg:p-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Our quality checklist</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Material grade verified per batch (SS 304, solid brass, zinc alloy)",
            "PVD and powder coat adhesion testing on finished samples",
            "Mechanism cycle testing on locks, levers and closers",
            "Dimensional QC against published backsets and hole centres",
            "Packaging with matching screws and fixing templates",
            "Batch traceability for warranty and repeat orders",
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <BadgeCheck className="icon-gradient mt-0.5 h-4 w-4 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-8">
          <Link to="/contact" search={{ product: undefined }}>
            Talk to our team
          </Link>
        </Button>
      </div>
    </div>
  );
}
