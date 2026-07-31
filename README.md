# Space-ious Hardware Hub

Build a website for "Space-ious", a hardware products business that sells hardware 

components for households, shops, and commercial spaces — items like aldrops, door 

handles, door locks, door kits, knobs, hinges, and related fittings, across various 

types, sizes, finishes, and materials.

DESIGN DIRECTION

- Light, modern, clean theme — white/off-white base background

- Accent color: a confident neutral-industrial tone (e.g. deep charcoal, brushed 

  steel gray, or a warm brass/gold accent to echo hardware finishes) — pick one 

  accent and use it consistently for CTAs and highlights

- Generous whitespace, soft shadows, rounded-corner cards, minimal borders

- Modern sans-serif typography (e.g. Inter / Poppins), clear hierarchy

- Grid-based product/category layouts with consistent card sizing

- Subtle hover states (scale/shadow lift) on product and category cards

- Fully responsive: mobile, tablet, desktop

TECH STACK

- React + TypeScript

- Tailwind CSS for styling

- Vite as the build tool

- React Router for navigation

- Component-based architecture (reusable Card, Button, Navbar, Footer, ProductGrid components)

PAGES / SECTIONS

1. Home

   - Hero section: brand name "Space-ious", short tagline (e.g. "Hardware that fits 

     every space"), a CTA button ("Explore Products" / "Get a Quote")

   - Featured/best-selling categories as clickable cards

   - "Why choose us" strip (quality materials, variety, durability, trusted finishes)

   - Brief About preview with a "Learn More" link

   - Contact/Enquiry CTA banner

2. Products / Categories

   - Sidebar or top filter bar with categories:

     Locks, Door Handles & Knobs, Aldrops & Tower Bolts, Door Kits/Sets, 

     Hinges & Door Closers, Cabinet & Drawer Hardware, Glass Fittings & Accessories

   - Grid of product cards: image placeholder, name, short spec line 

     (material/finish/size), "View Details" or "Enquire" button

   - Basic filter/sort UI (by category, material, finish) — can be static/non-functional 

     for this basic version

   - Search bar in the header

3. Product Detail (template page)

   - Image gallery placeholder

   - Product name, category, specifications (material, size, finish, variants)

   - Description

   - "Enquire Now" button (opens contact form or mailto)

   - Related products section

4. About Us

   - Brand story / mission

   - What Space-ious offers (quality, variety, reliability)

   - Optional: manufacturing/sourcing/quality-assurance highlights

5. Contact / Enquiry

   - Contact form (name, email, phone, product interest, message)

   - Business address, phone, email, map placeholder

   - WhatsApp/Call CTA button (common in Indian hardware B2B sites)

GLOBAL COMPONENTS

- Sticky header: logo, nav links (Home, Products, About, Contact), search icon, 

  "Get a Quote" button

- Footer: brand blurb, quick links, category links, contact info, social icons, 

  copyright

CONTENT/DATA

- Use realistic placeholder product data (name, category, material, finish, size) 

  for at least 3-4 products per category so the grid doesn't look empty

- Use placeholder images (or a neutral gray/box placeholder) unless real product 

  photos are provided

Keep the initial build simple and clean — no cart/checkout system, no login. 

Focus on a fast, professional-looking catalog/enquiry experience that's easy to 

extend later with real product data and images.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/37241688-31e1-4a75-9f69-ca81657e1a46).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
