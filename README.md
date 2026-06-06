# XUVIA — Store

Dark, professional spider-apparel store built with Next.js 14 and Tailwind CSS.
Designed for Printful integration. Curated catalog. No bloat.

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

---

## Setup Checklist

### 1. Add your product images
Place images in `/public/images/`. Reference them in `lib/products.js`:
```js
image: "/images/your-shirt.jpg",
```
Or paste Printful mockup URLs directly (already whitelisted in `next.config.js`).

### 2. Add / edit products
Open `lib/products.js`. Each product is a plain JS object:
```js
{
  id: "unique-slug",           // used in the URL: /product/unique-slug
  name: "Product Name",
  subtitle: "Series Name",
  type: "Short Sleeve Tee",
  price: 38,                   // number, USD
  description: "...",
  tags: ["new", "featured"],   // "featured" shows on homepage
  sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  image: "/images/yourimage.jpg",
  imageAlt: "Alt text",
  printfulProductId: null,     // set this when you add to Printful
  inStock: true,
}
```

### 3. Add your logo
Drop `logo.png` into `/public/`. Then in `components/Nav.js`, uncomment the `<Image>` tag and comment out the text fallback.

### 4. Connect Printful
1. In Printful Dashboard → Settings → API Access, generate a private token
2. Copy `.env.example` to `.env.local`
3. Set `PRINTFUL_API_KEY=your_token_here`
4. For each product in Printful, set `printfulProductId` in `lib/products.js` to the Printful product ID

The `/api/products` route will then merge live Printful data (pricing, thumbnails) with your local metadata.

### 5. Stripe (optional, future)
Printful's standard integration doesn't require Stripe on the storefront.
You'd only need Stripe if you want to handle payment yourself before passing orders to Printful.
For a small catalog, using Printful's hosted checkout or a simple "contact to order" flow is perfectly valid to start.

---

## File Map

```
xuvia/
├── app/
│   ├── layout.js          ← fonts, metadata, global wrapper
│   ├── globals.css        ← design system, animations
│   ├── page.js            ← homepage (hero, featured, about)
│   ├── shop/page.js       ← full catalog grid
│   ├── product/[id]/      ← product detail page
│   ├── api/products/      ← Printful API route (falls back to local)
│   └── not-found.js       ← 404 page
├── components/
│   ├── Nav.js             ← sticky header, mobile menu
│   ├── Footer.js          ← links, marquee strip
│   └── ProductCard.js     ← reusable product card
├── lib/
│   └── products.js        ← your product catalog — edit this
├── public/
│   └── images/            ← drop shirt mockups here
├── .env.example           ← copy to .env.local, add API keys
└── next.config.js         ← image domains, etc.
```

---

## Deploy

Easiest path: **Vercel** (free tier works fine for this scale)
1. Push to GitHub
2. Import repo at vercel.com
3. Add your env vars in Vercel's dashboard
4. Deploy

---

## Design System

| Token | Value | Use |
|-------|-------|-----|
| `--obsidian` | `#0a0a0b` | Main background |
| `--void` | `#111114` | Section backgrounds |
| `--ash` | `#1a1a1f` | Card backgrounds |
| `--ember` | `#c8a96e` | Accent, headings, CTAs |
| `--bone` | `#d4cfc8` | Body text |
| `--muted` | `#5a5a64` | Secondary text |

Fonts: **Cinzel** (display/headings) · **Raleway** (body) · **JetBrains Mono** (labels/tags)
