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

## Printify collection metadata

Add a hidden HTML comment to a Printify product description to assign its
collection, product category, and species without editing the repository:

```html
<!-- xuvia collection:2 type:long-sleeve-shirt species:Latrodectus hesperus -->
```

The marker must be an actual HTML comment in the description HTML, not escaped
text. `collection` is a positive whole number. `type:long-sleeve-shirt` maps to
the existing `long-sleeve` category; existing types such as `poster` and
`phone-case` also work. Species names can contain spaces. Fields are optional.

Explicit local product overrides take priority, followed by marker values,
then `lib/catalog.json` defaults. Products without a marker keep their catalog
metadata. The marker does not appear in the displayed description. Printify
data is cached for five minutes, so description changes may take that long to
appear. A marker does not create a new Field Guide page; those entries remain
in `lib/species.js`.

## Customer order confirmation email

Xuvia can send a thank-you email through Resend after a live payment succeeds
and Printify accepts the order. It includes products, variants, quantities,
the paid total, and delivery address. It says printing comes next, rather than
claiming production has already begun. Stripe receipts and Printify shipping
notifications continue separately.

Sending is **disabled by default**. Use `.env.example` as the settings reference:

1. Add `xuvia.co` in Resend and publish the exact sending DNS records it provides
   in Vercel. Keep receiving/forwarding MX records separate from any sending
   subdomain records Resend supplies.
2. Configure an inbox or forwarding service for `hello@xuvia.co`, then verify
   incoming mail and replies. Vercel hosts DNS, not the mailbox.
3. Add a dedicated, domain-scoped sending key as `RESEND_API_KEY` in the Vercel
   Xuvia project's Production environment. Set `ORDER_EMAIL_FROM` and
   `ORDER_EMAIL_REPLY_TO` as shown in `.env.example`.
4. Ensure Stripe delivers `payment_intent.succeeded` to
   `https://xuvia.co/api/stripe/webhook` with the matching `STRIPE_WEBHOOK_SECRET`.
   This makes email retries independent of the buyer keeping their tab open.
5. Set `ORDER_EMAIL_START_AT` to the UTC launch time and
   `ORDER_EMAIL_ENABLED=true`, then deploy. Payments created before that time
   are skipped, so enabling the feature does not email historical customers.
6. Send an explicitly authorized preview to your own inbox before enabling.
   Verify sender, replies, and mobile layout. After launch, check the first
   real order's email in Resend and its confirmation metadata in Stripe.

Generate an HTML preview without sending anything:

```sh
node scripts/preview-order-email.mjs
```

The customer template uses the storefront's spider emblem, obsidian backgrounds,
ember-gold accents, spaced display lettering, and keeper-focused voice. Product
thumbnails use the ordered variant when available. HTML uses table layouts,
inline styles, narrow-screen adjustments, and system font fallbacks, alongside a
plain-text version. `scripts/order-email-sample.mjs` renders fictional order
details with real catalog images through the exact same customer renderer.

Delivery uses a stable Resend idempotency key and stores the accepted email ID
on the Stripe payment. Email failures cause webhook retries while reusing the
existing Printify order. Resend acceptance does not prove inbox delivery; check
Resend's delivery/bounce status. If a delivery is uncertain for 23 hours, or its
payload changes during a retry, automatic sending stops with
`delivery_needs_review` in server logs to avoid duplicates after Resend's
24-hour idempotency window. Check Resend before any manual resend. Test-mode
payments never send customer emails. No preview/test endpoint is exposed.

Checkout payments carry `metadata.store=xuvia`. The webhook ignores payments
without that tag before looking them up or writing fulfillment metadata, so
other businesses using the same Stripe account are unaffected. The final quote
also adds the tag to checkouts opened before this change.

## Meta advertising measurement

The storefront uses Meta Pixel **1968544077636733**. It initializes once in the
browser and sends the initial `PageView`; Meta's SDK tracks later history
changes automatically. The site sends `ViewContent` on product
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
