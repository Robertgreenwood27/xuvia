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

## Meta advertising measurement

The storefront uses Meta Pixel **1968544077636733**. It initializes once in the
browser and tracks `PageView` on pathname changes, `ViewContent` on product
pages, `AddToCart` on successful cart additions, and `InitiateCheckout` when the
server creates a checkout. Automatic event detection is disabled; no advanced
matching fields are configured.

`Purchase` is sent only after `/api/checkout/confirm` verifies a **live**, succeeded
Stripe PaymentIntent with a matching server quote. Its value is the actual
amount received, including shipping, in the payment currency. It is independent
of fulfillment status: a paid order still counts while Printify is processing.
Test-mode and unpaid payments never emit `Purchase`. A stable opaque event ID,
session storage, and an in-memory fallback prevent repeat events from polling,
React remounts, or refreshing within the same browser session. Browser blocking
or closing the tab before returning from payment can prevent measurement;
Stripe remains the source of truth for sales.

Stripe redirect parameters are removed before initializing or sending to Meta.
The PaymentIntent ID is retained in history state so confirmation survives a
refresh. Do not add a separate Pixel snippet, automatic purchase rule, or
noscript tracking image to the checkout success page.

Tracking is enabled on `xuvia.co` and `www.xuvia.co` only. To exercise it locally
or on a preview, set `NEXT_PUBLIC_META_PIXEL_DEBUG=true` **at build time** and
intercept Meta requests so synthetic traffic never reaches the live dataset.

After deployment, open Meta Events Manager → Xuvia → Test events and visit the
store. Verify `PageView`, a product's `ViewContent`, and one `AddToCart`. A
completed live order should produce one `Purchase`; refreshing its confirmation
must not produce another in the same session. Keep Automatic Advanced Matching
and automatic event detection off to match this manual installation.

Run `npm test` for the tracking checks and `npm run build` to validate the app.
The build needs the existing Stripe environment variables and access to Google
Fonts; no new production secrets or environment variables are required.

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
