export type Category = {
  slug: string;
  name: string;
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  category: string; // category slug
  material: string;
  finish: string;
  size: string;
  variants: string[];
  description: string;
  featured?: boolean;
};

export const categories: Category[] = [
  { slug: "locks", name: "Locks", blurb: "Mortise, cylindrical and rim locks for homes, shops and offices." },
  { slug: "handles-knobs", name: "Door Handles & Knobs", blurb: "Lever handles, pull handles and knobs in premium finishes." },
  { slug: "aldrops-bolts", name: "Aldrops & Tower Bolts", blurb: "Heavy-duty aldrops, tower bolts and latches built to last." },
  { slug: "door-kits", name: "Door Kits & Sets", blurb: "Complete coordinated hardware sets for every door type." },
  { slug: "hinges-closers", name: "Hinges & Door Closers", blurb: "Butt hinges, concealed hinges and hydraulic door closers." },
  { slug: "cabinet-hardware", name: "Cabinet & Drawer Hardware", blurb: "Handles, channels, hinges and organisers for modular units." },
  { slug: "glass-fittings", name: "Glass Fittings & Accessories", blurb: "Patch fittings, spider fittings and shower hardware." },
];

export const materials = ["Stainless Steel 304", "Brass", "Zinc Alloy", "Aluminium", "Iron"];
export const finishes = ["Satin Brass", "Antique Brass", "Brushed Steel", "Matte Black", "Chrome", "Rose Gold"];

export const products: Product[] = [
  // Locks
  { id: "sx-l-101", name: "Vault Pro Mortise Lock", category: "locks", material: "Stainless Steel 304", finish: "Brushed Steel", size: "200 x 22 mm", variants: ["Key-Key", "Key-Knob", "Baby Latch"], description: "A precision-engineered mortise lock body with a 6-lever mechanism and hardened anti-drill plate. Suited to main doors of homes, shops and commercial entrances.", featured: true },
  { id: "sx-l-102", name: "Orbit Cylindrical Lock", category: "locks", material: "Zinc Alloy", finish: "Satin Brass", size: "60 mm backset", variants: ["Bedroom", "Bathroom", "Passage"], description: "Compact cylindrical lockset with smooth key rotation and a corrosion-resistant coating for interior doors." },
  { id: "sx-l-103", name: "Fortis Rim Night Latch", category: "locks", material: "Brass", finish: "Antique Brass", size: "75 mm", variants: ["Single Cylinder", "Double Cylinder"], description: "Surface-mounted rim latch with deadlocking action — a classic choice for shutters and secondary doors." },
  { id: "sx-l-104", name: "Cabinet Cam Lock", category: "locks", material: "Zinc Alloy", finish: "Chrome", size: "16 / 20 / 25 mm", variants: ["Keyed Alike", "Keyed Different"], description: "Small-format cam lock for drawers, lockers and display counters with three cam length options." },
  // Handles & knobs
  { id: "sx-h-201", name: "Linea Lever Handle", category: "handles-knobs", material: "Brass", finish: "Satin Brass", size: "125 mm rose", variants: ["Satin Brass", "Matte Black", "Chrome"], description: "A slim, architectural lever on a low-profile round rose. Solid brass core with a durable PVD finish.", featured: true },
  { id: "sx-h-202", name: "Arc Pull Handle", category: "handles-knobs", material: "Stainless Steel 304", finish: "Brushed Steel", size: "300 / 450 / 600 mm", variants: ["Round", "Square", "D-shape"], description: "Back-to-back pull handle for glass and wooden entrance doors in retail and office spaces." },
  { id: "sx-h-203", name: "Heritage Round Knob", category: "handles-knobs", material: "Brass", finish: "Antique Brass", size: "55 mm dia", variants: ["Antique Brass", "Rose Gold"], description: "Turned solid brass knob with a hand-finished antique patina for period-style interiors." },
  { id: "sx-h-204", name: "Nord Square Lever", category: "handles-knobs", material: "Zinc Alloy", finish: "Matte Black", size: "135 mm", variants: ["Matte Black", "Brushed Steel"], description: "Minimal square-section lever with a soft-return spring cassette rated for 200,000 cycles." },
  // Aldrops & bolts
  { id: "sx-a-301", name: "Titan Heavy Aldrop", category: "aldrops-bolts", material: "Stainless Steel 304", finish: "Brushed Steel", size: "10 / 12 / 14 inch", variants: ["Round Section", "Square Section"], description: "Heavy-gauge aldrop with a machined baton and reinforced brackets for main doors and gates.", featured: true },
  { id: "sx-a-302", name: "Guard Tower Bolt", category: "aldrops-bolts", material: "Brass", finish: "Satin Brass", size: "4 / 6 / 8 / 10 inch", variants: ["Round", "Square"], description: "Solid brass tower bolt with a smooth-glide shaft, supplied with matching screws." },
  { id: "sx-a-303", name: "Clip Baby Latch", category: "aldrops-bolts", material: "Zinc Alloy", finish: "Chrome", size: "100 mm", variants: ["Chrome", "Matte Black"], description: "Compact spring latch for internal doors, wardrobes and shutters." },
  { id: "sx-a-304", name: "Shopfront Sliding Bolt", category: "aldrops-bolts", material: "Iron", finish: "Matte Black", size: "12 inch", variants: ["Powder Coated", "Galvanised"], description: "Robust sliding bolt designed for shop shutters and warehouse doors." },
  // Door kits
  { id: "sx-k-401", name: "Space-ious Essential Door Kit", category: "door-kits", material: "Stainless Steel 304", finish: "Brushed Steel", size: "Standard 35–45 mm door", variants: ["Main Door", "Bedroom", "Bathroom"], description: "A complete set: mortise lock, lever handles, hinges, tower bolt, door stopper and screws — coordinated in one finish.", featured: true },
  { id: "sx-k-402", name: "Brass Signature Door Set", category: "door-kits", material: "Brass", finish: "Satin Brass", size: "Standard 35–45 mm door", variants: ["3-Piece", "5-Piece"], description: "Premium brass set for main entrances where finish consistency matters." },
  { id: "sx-k-403", name: "Retail Shutter Kit", category: "door-kits", material: "Iron", finish: "Matte Black", size: "Shutter width up to 12 ft", variants: ["Standard", "Heavy Duty"], description: "Bolt, aldrop and locking hardware bundle assembled for shopfront shutters." },
  { id: "sx-k-404", name: "Bathroom Fit-Out Kit", category: "door-kits", material: "Aluminium", finish: "Chrome", size: "25–35 mm door", variants: ["Standard", "Frameless"], description: "Rust-resistant handles, latch and hinges packaged for wet-area doors." },
  // Hinges & closers
  { id: "sx-g-501", name: "Pivot Butt Hinge", category: "hinges-closers", material: "Stainless Steel 304", finish: "Brushed Steel", size: "4 x 3 x 3 mm", variants: ["Ball Bearing", "Plain"], description: "Precision-stamped butt hinge with ball-bearing knuckles for silent, sag-free operation.", featured: true },
  { id: "sx-g-502", name: "Silent Hydraulic Door Closer", category: "hinges-closers", material: "Aluminium", finish: "Brushed Steel", size: "Doors up to 85 kg", variants: ["Size 3", "Size 4"], description: "Adjustable two-speed hydraulic closer with backcheck, ideal for offices and clinics." },
  { id: "sx-g-503", name: "Concealed Soft-Close Hinge", category: "hinges-closers", material: "Zinc Alloy", finish: "Chrome", size: "35 mm cup", variants: ["Full Overlay", "Half Overlay", "Inset"], description: "European-style concealed hinge with integrated soft-close damper." },
  { id: "sx-g-504", name: "Floor Spring Unit", category: "hinges-closers", material: "Stainless Steel 304", finish: "Brushed Steel", size: "Doors up to 120 kg", variants: ["Hold Open", "Non Hold Open"], description: "Heavy-duty floor spring for glass and timber entrance doors in commercial spaces." },
  // Cabinet hardware
  { id: "sx-c-601", name: "Slimline Cabinet Pull", category: "cabinet-hardware", material: "Aluminium", finish: "Matte Black", size: "96 / 128 / 160 mm", variants: ["Matte Black", "Brushed Steel", "Rose Gold"], description: "Extruded aluminium pull with softened edges for modular kitchens and wardrobes.", featured: true },
  { id: "sx-c-602", name: "Telescopic Drawer Channel", category: "cabinet-hardware", material: "Stainless Steel 304", finish: "Chrome", size: "300–550 mm", variants: ["Soft Close", "Standard"], description: "Full-extension ball-bearing channel rated to 45 kg dynamic load." },
  { id: "sx-c-603", name: "Brass Wardrobe Knob", category: "cabinet-hardware", material: "Brass", finish: "Antique Brass", size: "32 mm dia", variants: ["Antique Brass", "Satin Brass"], description: "Turned brass knob that pairs neatly with heritage-style shutters." },
  { id: "sx-c-604", name: "Lift-Up Flap Stay", category: "cabinet-hardware", material: "Zinc Alloy", finish: "Chrome", size: "Doors 5–12 kg", variants: ["Soft Close", "Free Stop"], description: "Gas-assisted stay for overhead cabinet shutters with adjustable stopping force." },
  // Glass fittings
  { id: "sx-gf-701", name: "Patch Fitting Set", category: "glass-fittings", material: "Stainless Steel 304", finish: "Brushed Steel", size: "10–12 mm glass", variants: ["Top", "Bottom", "Corner"], description: "Machined patch fittings for frameless glass doors in showrooms and offices.", featured: true },
  { id: "sx-gf-702", name: "Spider Fitting 4-Arm", category: "glass-fittings", material: "Stainless Steel 304", finish: "Brushed Steel", size: "4-way, 12 mm glass", variants: ["2-Arm", "3-Arm", "4-Arm"], description: "Structural glazing spider for facades and canopies, mirror-polished and weather-tested." },
  { id: "sx-gf-703", name: "Shower Hinge & Clamp", category: "glass-fittings", material: "Brass", finish: "Chrome", size: "8–10 mm glass", variants: ["Glass-to-Wall", "Glass-to-Glass"], description: "Solid brass shower enclosure hinge with a fully sealed gasket set." },
  { id: "sx-gf-704", name: "Sliding Glass Door Track", category: "glass-fittings", material: "Aluminium", finish: "Brushed Steel", size: "2 / 3 m track", variants: ["Single", "Double"], description: "Top-hung sliding track kit with soft-close stoppers for glass partitions." },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const featuredProducts = products.filter((p) => p.featured);

export const contact = {
  phone: "+91 98250 41200",
  phoneHref: "+919825041200",
  whatsapp: "919825041200",
  email: "sales@space-ious.in",
  address: "Unit 14, Hardware Market Complex, Ring Road, Ahmedabad, Gujarat 380009",
  hours: "Mon – Sat, 9:30 AM – 7:00 PM",
};
