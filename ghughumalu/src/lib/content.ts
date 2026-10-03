/**
 * Every word on the site lives here. Components only read from this file.
 * Prices, address and hours are placeholders to edit before launch.
 */

export const SITE = {
  name: "Ghughumalu",
  tagline: "A royal thali, taken apart and put back together with intent.",
  description:
    "Ghughumalu is an editorial Indian dining room in Bristol. Royal thalis, hand-folded samosas, slow-ground spices and chutneys poured to order.",
  url: "https://aruchamp20.github.io/Arun-Portfolio/ghughumalu/",
  city: "Bristol",
  address: ["14 Corn Street", "Bristol BS1 1HQ"],
  phone: "+44 117 000 0000",
  email: "table@ghughumalu.co.uk",
  hours: [
    { days: "Tue to Thu", time: "17:30 to 22:30" },
    { days: "Fri and Sat", time: "12:00 to 23:00" },
    { days: "Sunday", time: "12:00 to 21:00" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Maps", href: "https://maps.google.com" },
  ],
} as const;

export const MEDIA = {
  video: (n: 1 | 2 | 3 | 4 | 5 | 6) => `media/video-${n}.mp4`,
  image: (n: 1 | 2 | 3 | 4) => `media/image-${n}.webp`,
} as const;

export const IMAGE_ALT = {
  1: "A complete Indian royal thali exploded into hundreds of floating elements in a bright daylight studio.",
  2: "A golden samosa exploded into suspended pastry layers with potato filling, peas and coriander floating.",
  3: "Turmeric, cardamom, cinnamon, black pepper, cloves, star anise and chilli suspended in a geometric composition.",
  4: "A handcrafted dining table set with a luxury thali, ceramic bowls, linen and floating herbs.",
} as const;

export const NAV = [
  { label: "Story", href: "#story" },
  { label: "Craft", href: "#craft" },
  { label: "Menu", href: "#menu" },
  { label: "Reserve", href: "#reserve" },
] as const;

export const HERO = {
  eyebrow: "Bristol, est. 2026",
  title: ["The thali,", "taken apart."],
  lede: "Twelve small bowls. One quiet table. An Indian dining room that moves at the speed of a slow pour.",
  primary: { label: "Reserve a table", href: "#reserve" },
  secondary: { label: "Explore the menu", href: "#menu" },
  scrollHint: "Scroll to open the thali",
};

export const STORY = {
  index: "01",
  eyebrow: "The story",
  title: "Ghughumalu is the Telugu word for the smell that reaches you before the plate does.",
  paragraphs: [
    "We grew up in kitchens where the first course was a scent in the stairwell. Mustard seed cracking in ghee, curry leaf, a lid lifted off rice. The food arrived minutes later. The feeling arrived first.",
    "This dining room is built for that minute. Every dish is plated as a composition rather than a pile, so you can see what you are about to taste. Nothing is hidden under a sauce.",
    "The thali is our thesis. Twelve elements, each one made separately, each one allowed to be itself, and then brought together on one tray.",
  ],
  quote: "Nothing hidden under a sauce.",
  caption: "The royal thali, photographed in our studio before service.",
};

export type ExplodedLabel = {
  text: string;
  note: string;
  x: number; // % from left of the 16:9 frame
  y: number; // % from top
  side: "left" | "right";
  from: number; // scroll progress where it starts appearing
  to: number; // progress where it is fully gone
};

export const EXPLODED = {
  index: "02",
  eyebrow: "Anatomy of a samosa",
  title: "Nine things happen inside a four-centimetre pastry.",
  labels: [
    { text: "Hand-folded pastry", note: "Fourteen laminations, fried at 165°", x: 36, y: 26, side: "left", from: 0.08, to: 0.42 },
    { text: "Pahadi potato", note: "Crushed, never mashed", x: 62, y: 38, side: "right", from: 0.2, to: 0.56 },
    { text: "Green peas", note: "Blanched at the last minute", x: 34, y: 54, side: "left", from: 0.34, to: 0.7 },
    { text: "Cumin and mustard seed", note: "Tempered in ghee", x: 66, y: 62, side: "right", from: 0.48, to: 0.84 },
    { text: "Coriander, chilli, amchur", note: "Folded through cold", x: 40, y: 78, side: "left", from: 0.62, to: 0.96 },
  ] as ExplodedLabel[],
  mobileHint: "Scroll to open the samosa",
};

export type Ingredient = {
  id: string;
  name: string;
  origin: string;
  note: string;
  x: number;
  y: number;
  size: number; // relative node size
  hue: string; // dot colour
};

export const INGREDIENTS = {
  index: "03",
  eyebrow: "The pantry",
  title: "Spices we grind in the hour before you sit down.",
  lede: "Hover a constellation point. Each one is sourced from a single farm, and ground in small stone batches on the day it is served.",
  items: [
    { id: "turmeric", name: "Lakadong turmeric", origin: "Meghalaya", note: "Nine percent curcumin. It stains everything, including our aprons.", x: 18, y: 32, size: 1.2, hue: "#D9A441" },
    { id: "chilli", name: "Guntur chilli", origin: "Andhra Pradesh", note: "Sun-dried on terraces. Heat that arrives late and leaves politely.", x: 38, y: 18, size: 1, hue: "#B5412E" },
    { id: "cardamom", name: "Green cardamom", origin: "Idukki, Kerala", note: "Cracked by hand, never pre-ground. The seeds go in, the husks go in the chai.", x: 58, y: 30, size: 0.9, hue: "#6E7F4B" },
    { id: "pepper", name: "Tellicherry pepper", origin: "Malabar coast", note: "Left on the vine longer. Bigger, rounder, more floral.", x: 78, y: 22, size: 0.8, hue: "#3A2F2A" },
    { id: "anise", name: "Star anise", origin: "Arunachal Pradesh", note: "One point is enough for a whole pot of biryani.", x: 28, y: 64, size: 1.1, hue: "#8A5A3A" },
    { id: "cinnamon", name: "Ceylon cinnamon", origin: "Sri Lanka", note: "The soft, papery kind. Rolled quills, not bark.", x: 50, y: 72, size: 1, hue: "#A8673E" },
    { id: "clove", name: "Clove", origin: "Zanzibar", note: "Four per kilo of meat. We count.", x: 68, y: 58, size: 0.75, hue: "#4A3328" },
    { id: "coriander", name: "Coriander seed", origin: "Rajasthan", note: "Toasted until it smells like orange peel, then cracked.", x: 84, y: 70, size: 0.95, hue: "#B99A5B" },
  ] as Ingredient[],
};

export const CRAFT = {
  index: "04",
  eyebrow: "The craft",
  title: "Four hours before service, in order.",
  steps: [
    { time: "14:00", title: "Tempering", body: "Whole spices go into hot ghee one at a time, in a fixed order, and are pulled the second they bloom. This is the base of everything that follows." },
    { time: "15:00", title: "Grinding", body: "Tomatoes, onion, garlic and ginger are cooked down separately and only then ground together. Separate cooking keeps each flavour legible." },
    { time: "16:30", title: "Resting", body: "Paneer is pressed in linen for ninety minutes. Dal is finished with a second tempering. Nothing is rushed into a pot to save time." },
    { time: "17:30", title: "Plating", body: "The thali is assembled bowl by bowl, in a set order, and photographed on the pass before it leaves. Every tray looks like the first." },
  ],
};

export const SAUCES = {
  index: "05",
  eyebrow: "Signature chutneys",
  title: "Poured at the table, never from a bottle.",
  cards: [
    { name: "Pudina", body: "Mint, green chilli, raw mango and a little yoghurt. Bright, cold, sharp.", pair: "With the samosa", colour: "#5E7B4A", speed: 0.6 },
    { name: "Imli", body: "Tamarind reduced with jaggery and black salt. Dark, slow, sweet at the end.", pair: "With the papdi", colour: "#7A4A2E", speed: 1 },
    { name: "Gongura", body: "Sorrel leaves from Guntur, cooked until they collapse. Sour the way only Andhra does it.", pair: "With the rice", colour: "#8E3B3B", speed: 1.4 },
  ],
};

export const DINING = {
  index: "06",
  eyebrow: "The room",
  lines: ["Come hungry.", "Leave slowly."],
  body: "Thirty-two seats. Linen, stoneware and one long table under a skylight. The music stays low and the lights stay warm.",
  gallery: [
    { image: 2 as const, caption: "The samosa, before it is folded." },
    { image: 3 as const, caption: "The morning spice board." },
    { image: 4 as const, caption: "The long table, set for eight." },
  ],
};

export type MenuItem = { name: string; desc: string; price: string; tag?: string };
export type MenuGroup = { title: string; note?: string; items: MenuItem[] };

export const MENU: { index: string; eyebrow: string; title: string; groups: MenuGroup[] } = {
  index: "07",
  eyebrow: "The menu",
  title: "Small plates, the thali, and what to pour over them.",
  groups: [
    {
      title: "To begin",
      items: [
        { name: "Samosa, two ways", desc: "Pahadi potato and pea, and a lamb keema fold. Pudina and imli.", price: "9" },
        { name: "Papdi chaat", desc: "Crisp wheat, chickpea, yoghurt, pomegranate, sev.", price: "8" },
        { name: "Gunpowder idli", desc: "Steamed rice cakes rolled in podi, ghee, coconut chutney.", price: "8" },
        { name: "Chilli paneer", desc: "Pressed paneer, Guntur chilli, spring onion.", price: "11" },
      ],
    },
    {
      title: "The thali",
      note: "Served on a brass tray with twelve bowls. Vegetarian by default.",
      items: [
        { name: "Royal thali", desc: "Dal makhani, paneer butter masala, seasonal sabzi, raita, pickle, papad, rice, butter naan, dessert.", price: "32", tag: "Signature" },
        { name: "Coastal thali", desc: "Prawn curry, fish fry, moilee, lemon rice, appam, coconut chutney.", price: "36" },
        { name: "Andhra thali", desc: "Gongura mutton, pappu, avakai, curd rice, ghee podi, ragi roti.", price: "34" },
      ],
    },
    {
      title: "Breads and rice",
      items: [
        { name: "Butter naan", desc: "Tandoor, clarified butter, nigella.", price: "4" },
        { name: "Laccha paratha", desc: "Sixteen layers, pulled by hand.", price: "4.5" },
        { name: "Jeera rice", desc: "Basmati, cumin, ghee.", price: "5" },
      ],
    },
    {
      title: "To finish",
      items: [
        { name: "Gulab jamun", desc: "Warm, cardamom syrup, pistachio cream.", price: "7" },
        { name: "Kulfi", desc: "Saffron and malai, set overnight.", price: "7" },
        { name: "Masala chai", desc: "Brewed to order, ginger, cardamom, black pepper.", price: "4" },
      ],
    },
  ],
};

export const RESERVE = {
  index: "08",
  eyebrow: "Reserve",
  title: ["Keep an", "evening free."],
  body: "Tables are released six weeks ahead. Parties of more than eight are seated at the long table under the skylight.",
  fields: {
    name: "Your name",
    email: "Email",
    date: "Date",
    time: "Time",
    guests: "Guests",
  },
  submit: "Request a table",
  success: "Thank you. We confirm every table by email within a day.",
  aside: ["No deposit for tables of four or fewer.", "Dietary notes are welcome in the confirmation reply."],
};

export const LOADER = {
  word: "Ghughumalu",
  lines: ["Grinding the spices.", "Warming the ghee.", "Setting the table."],
};
