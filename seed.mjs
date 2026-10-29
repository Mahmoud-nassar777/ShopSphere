// seed.mjs  —  حطه في جذر المشروع (جنب package.json)
// تشغيل:  node --env-file=.env.local seed.mjs
// (محتاج Node 20.6+ ومتغير MONGODB_URI في .env.local)
// اختياري: SELLER_ID=xxxx لو عايز تحدد البائع يدوي

import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const SELLER_EMAIL = "nsar88840@gmail.com";

if (!MONGO_URI) {
  console.error("❌ مفيش MONGODB_URI في env. شغل: node --env-file=.env.local seed.mjs");
  process.exit(1);
}

/* ---------------------------------------------------------- */
/* 1) الكاتيجوريز                                             */
/* ---------------------------------------------------------- */
const CATEGORIES = {
  "Men's Fashion": ["Shirts", "T-Shirts", "Jeans", "Jackets"],
  "Women's Fashion": ["Dresses", "Abayas", "Scarves", "Blouses"],
  "Phones & Accessories": ["Smartphones", "Cases", "Chargers", "Audio"],
  "Home Essentials": ["Kitchen", "Cleaning", "Storage"],
  Shoes: ["Sneakers", "Formal", "Sandals"],
  Electronics: ["Smartwatches", "Power Banks", "Speakers", "Accessories"],
};

/* ---------------------------------------------------------- */
/* 2) المنتجات                                                */
/* ---------------------------------------------------------- */
const PRODUCTS = [
  // ---- Men's Fashion
  { name: "Classic Oxford Shirt", main: "Men's Fashion", sub: "Shirts", days: "3", price: 450,
    desc: "Premium cotton oxford shirt, slim fit, button-down collar. Breathable and easy to iron.",
    options: { Size: ["M", "L", "XL", "XXL"], Color: ["White", "Sky Blue", "Navy"] } },
  { name: "Slim Fit Polo T-Shirt", main: "Men's Fashion", sub: "T-Shirts", days: "3", price: 280,
    desc: "Soft pique cotton polo with a modern slim cut and ribbed collar.",
    options: { Size: ["S", "M", "L", "XL"], Color: ["Black", "Olive", "Burgundy"] } },
  { name: "Slim Straight Jeans", main: "Men's Fashion", sub: "Jeans", days: "4", price: 650,
    desc: "Stretch denim jeans with a slim straight leg. Comfortable all-day fit.",
    options: { Size: ["30", "32", "34", "36"], Color: ["Dark Blue", "Black", "Light Blue"] } },
  { name: "Urban Bomber Jacket", main: "Men's Fashion", sub: "Jackets", days: "4", price: 900,
    desc: "Lightweight bomber jacket with ribbed cuffs, zip pockets and a soft lining.",
    options: { Size: ["M", "L", "XL"], Color: ["Black", "Khaki", "Navy"] } },

  // ---- Women's Fashion
  { name: "Floral Midi Dress", main: "Women's Fashion", sub: "Dresses", days: "4", price: 750,
    desc: "Flowy midi dress with a soft floral print and a flattering waistline.",
    options: { Size: ["S", "M", "L"], Color: ["Rose", "Navy", "Green"] } },
  { name: "Classic Open Abaya", main: "Women's Fashion", sub: "Abayas", days: "5", price: 1100,
    desc: "Elegant crepe abaya with wide sleeves and a clean open front.",
    options: { Size: ["52", "54", "56"], Color: ["Black", "Navy", "Beige"] } },
  { name: "Satin Hijab Scarf", main: "Women's Fashion", sub: "Scarves", days: "2", price: 150,
    desc: "Smooth satin scarf with a luxurious drape. Stays in place all day.",
    options: { Color: ["Dusty Pink", "Sand", "Emerald", "Black"] } },
  { name: "Chiffon Blouse", main: "Women's Fashion", sub: "Blouses", days: "3", price: 420,
    desc: "Light chiffon blouse, perfect for work or casual days.",
    options: { Size: ["S", "M", "L"], Color: ["White", "Peach", "Black"] } },

  // ---- Phones & Accessories
  { name: "Nova X Pro 5G Smartphone", main: "Phones & Accessories", sub: "Smartphones", days: "3", price: 12500,
    desc: '6.7" AMOLED display, 5000mAh battery, triple camera system and 5G support.',
    options: { Storage: ["128GB", "256GB"], Color: ["Black", "Blue", "Silver"] } },
  { name: "Shockproof Silicone Case", main: "Phones & Accessories", sub: "Cases", days: "2", price: 120,
    desc: "Soft-touch silicone case with raised camera protection and anti-drop corners.",
    options: { Model: ["iPhone 14", "iPhone 15", "Galaxy S23"], Color: ["Black", "Clear", "Navy"] } },
  { name: "65W Fast Charger Kit", main: "Phones & Accessories", sub: "Chargers", days: "2", price: 350,
    desc: "Compact GaN fast charger with a braided Type-C cable.",
    options: { Color: ["White", "Black"], Cable: ["1m", "2m"] } },
  { name: "Wireless Earbuds Pro", main: "Phones & Accessories", sub: "Audio", days: "3", price: 600,
    desc: "Bluetooth 5.3, noise reduction, touch controls and 24h battery with case.",
    options: { Color: ["Black", "White", "Blue"] } },

  // ---- Home Essentials
  { name: "Granite Cookware Set 7pcs", main: "Home Essentials", sub: "Kitchen", days: "5", price: 1800,
    desc: "Non-stick granite pots and pans, induction compatible, easy to clean.",
    options: { Color: ["Black", "Grey", "Red"] } },
  { name: "Glass Food Containers Set", main: "Home Essentials", sub: "Kitchen", days: "3", price: 380,
    desc: "Airtight borosilicate glass containers, oven and microwave safe.",
    options: { Set: ["3 Pcs", "5 Pcs"], Color: ["Blue", "Grey"] } },
  { name: "Electric Kettle 1.8L", main: "Home Essentials", sub: "Kitchen", days: "3", price: 420,
    desc: "Stainless steel kettle with auto shut-off and boil-dry protection.",
    options: { Color: ["Silver", "Black"] } },
  { name: "Spin Microfiber Mop", main: "Home Essentials", sub: "Cleaning", days: "4", price: 520,
    desc: "360° spin mop with a foot-pedal bucket and washable microfiber heads.",
    options: { Color: ["Blue", "Grey"], Refills: ["1", "3"] } },
  { name: "Foldable Storage Organizer", main: "Home Essentials", sub: "Storage", days: "3", price: 250,
    desc: "Fabric organizer for wardrobe or shelves. Folds flat when not in use.",
    options: { Size: ["Small", "Medium", "Large"], Color: ["Grey", "Beige"] } },

  // ---- Shoes
  { name: "AirRun Sneakers", main: "Shoes", sub: "Sneakers", days: "4", price: 850,
    desc: "Breathable mesh running shoes with a cushioned sole and good grip.",
    options: { Size: ["40", "41", "42", "43", "44"], Color: ["White", "Black", "Grey"] } },
  { name: "Leather Formal Shoes", main: "Shoes", sub: "Formal", days: "5", price: 1100,
    desc: "Genuine leather lace-ups with a classic design and padded insole.",
    options: { Size: ["40", "41", "42", "43", "44"], Color: ["Black", "Brown"] } },
  { name: "Comfort Slides", main: "Shoes", sub: "Sandals", days: "2", price: 200,
    desc: "Anti-slip EVA slides, lightweight and waterproof.",
    options: { Size: ["39", "40", "41", "42", "43", "44"], Color: ["Black", "Navy", "Grey"] } },

  // ---- Electronics
  { name: "Active Smart Watch", main: "Electronics", sub: "Smartwatches", days: "3", price: 1300,
    desc: '1.8" display, heart-rate monitor, sleep tracking and 7-day battery.',
    options: { Color: ["Black", "Silver", "Rose Gold"], Strap: ["Silicone", "Metal"] } },
  { name: "Power Bank 20000mAh", main: "Electronics", sub: "Power Banks", days: "3", price: 650,
    desc: "Dual USB plus Type-C, 22.5W fast charging and an LED level indicator.",
    options: { Color: ["Black", "White"] } },
  { name: "Portable Bluetooth Speaker", main: "Electronics", sub: "Speakers", days: "3", price: 550,
    desc: "Waterproof speaker with deep bass and 12h playtime.",
    options: { Color: ["Black", "Blue", "Red"] } },
  { name: "Wireless Gaming Mouse", main: "Electronics", sub: "Accessories", days: "3", price: 380,
    desc: "Ergonomic wireless mouse with RGB lighting and adjustable DPI.",
    options: { Color: ["Black", "White"] } },
];

// زيادة في السعر لبعض الاختيارات
const PRICE_ADD = {
  "Storage:256GB": 2000,
  "Cable:2m": 50,
  "Set:5 Pcs": 150,
  "Refills:3": 100,
  "Strap:Metal": 200,
  "Size:XXL": 30,
  "Size:36": 30,
};

/* ---------------------------------------------------------- */
/* 3) صور Placeholder (SVG) — بتتحفظ في public/uploads        */
/* ---------------------------------------------------------- */
const COLOR_HEX = {
  white: "#f5f5f5", black: "#1f1f1f", "sky blue": "#8ec5ea", navy: "#1f2f55",
  olive: "#6b7240", burgundy: "#7a1f35", "dark blue": "#25395e", "light blue": "#9cc3e6",
  khaki: "#b4a579", rose: "#e58ba3", green: "#3e8a5a", beige: "#d9c7a6",
  "dusty pink": "#d9a5b0", sand: "#cdb892", emerald: "#1f8f68", peach: "#f3b79a",
  blue: "#3d6fd1", silver: "#b8bcc2", clear: "#dfe9ee", grey: "#8b8f94",
  red: "#c43a3a", brown: "#6b4426", "rose gold": "#d9a08f",
};

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function isDark(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function makeSvg({ title, subtitle, label, hex }) {
  const fg = isDark(hex) ? "#ffffff" : "#222222";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${hex}"/>
      <stop offset="1" stop-color="${hex}" stop-opacity="0.65"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="#f4f4f6"/>
  <rect x="60" y="60" width="680" height="680" rx="36" fill="url(#g)"/>
  <text x="400" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="${fg}">${esc(title)}</text>
  <text x="400" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="${fg}" opacity="0.85">${esc(subtitle)}</text>
  <text x="400" y="680" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" letter-spacing="4" fill="${fg}" opacity="0.7">${esc(label.toUpperCase())}</text>
</svg>`;
}

function writeImage(filename, svgOpts) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), makeSvg(svgOpts));
  return `/uploads/${filename}`;
}

function buildImages(p) {
  const colors = p.options.Color || ["Default"];
  const byColor = {};
  const all = [];

  colors.forEach((c, i) => {
    const hex = COLOR_HEX[c.toLowerCase()] || "#9aa0a6";
    const url = writeImage(`seed-${slug(p.name)}-${slug(c)}.svg`, {
      title: p.name, subtitle: c, label: "front view", hex,
    });
    byColor[c] = url;
    all.push(url);
  });

  const firstHex = COLOR_HEX[colors[0].toLowerCase()] || "#9aa0a6";
  const detail = writeImage(`seed-${slug(p.name)}-detail.svg`, {
    title: p.name, subtitle: "Close-up detail", label: "detail", hex: firstHex,
  });
  const lifestyle = writeImage(`seed-${slug(p.name)}-lifestyle.svg`, {
    title: p.name, subtitle: p.sub, label: "in use", hex: "#6c7a89",
  });
  all.push(detail, lifestyle);

  return { all, byColor, detail };
}

/* ---------------------------------------------------------- */
/* 4) بناء الـ options و الـ variants                          */
/* ---------------------------------------------------------- */
function cartesian(options) {
  const entries = Object.entries(options);
  return entries.reduce(
    (acc, [name, values]) =>
      acc.flatMap((combo) => values.map((v) => ({ ...combo, [name]: v }))),
    [{}],
  );
}

function buildProductDoc(p, sellerId) {
  const images = buildImages(p);

  const options = Object.entries(p.options).map(([name, values]) => ({ name, values }));

  const variants = cartesian(p.options).map((combo) => {
    let price = p.price;
    for (const [k, v] of Object.entries(combo)) price += PRICE_ADD[`${k}:${v}`] || 0;
    const mainImg = combo.Color ? images.byColor[combo.Color] : images.all[0];
    return {
      combination: combo,
      price: String(price),
      stock: String(10 + Math.floor(Math.random() * 40)),
      images: [mainImg, images.detail],
    };
  });

  return {
    sellerId: String(sellerId),
    name: p.name,
    description: p.desc,
    deliveryInDays: p.days,
    category: { main: p.main, sub: p.sub },
    options,
    variants,
    allImages: images.all,
  };
}

/* ---------------------------------------------------------- */
/* 5) التشغيل                                                  */
/* ---------------------------------------------------------- */
async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  console.log("✅ Connected to MongoDB");

  // البائع
  let sellerId = process.env.SELLER_ID;
  if (!sellerId) {
    const user = await db.collection("users").findOne({ email: SELLER_EMAIL });
    if (user) sellerId = String(user._id);
  }
  if (!sellerId) {
    console.error(
      `❌ مش لاقي اليوزر ${SELLER_EMAIL}. هات الـ _id بتاعه من collection اسمه users وشغل:\n   SELLER_ID=xxxx node --env-file=.env.local seed.mjs`,
    );
    process.exit(1);
  }
  console.log("👤 Seller:", sellerId);

  // الكاتيجوريز (نفس شكل Category: main + subs)
  const catCol = db.collection("categories");
  for (const [main, subs] of Object.entries(CATEGORIES)) {
    await catCol.updateOne(
      { main },
      { $addToSet: { subs: { $each: subs } }, $setOnInsert: { main } },
      { upsert: true },
    );
  }
  console.log(`📂 Categories ready: ${Object.keys(CATEGORIES).length} main`);

  // المنتجات
  const prodCol = db.collection("products");
  let added = 0, skipped = 0;
  for (const p of PRODUCTS) {
    const exists = await prodCol.findOne({ sellerId: String(sellerId), name: p.name });
    if (exists) { skipped++; continue; }
    const doc = buildProductDoc(p, sellerId);
    const now = new Date();
    await prodCol.insertOne({ ...doc, createdAt: now, updatedAt: now, __v: 0 });
    added++;
    console.log(`  + ${p.name}  (${doc.variants.length} variants)`);
  }

  console.log(`\n🎉 Done. Added: ${added} | Skipped (already exist): ${skipped}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
