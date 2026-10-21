# Maison Aurelle — Designer Jewelry Showcase

A clean, contemporary four-page showcase for three product lines — **rings, bespoke watches and bespoke leather watch straps** — with **no on-site payments**: every “Buy Now” button sends the visitor to your external checkout (Shopify, Stripe Payment Links, Square, Gumroad…).

**Live demo:** https://akrazalive.github.io/maison-aurelle/

| Page | What it does |
|---|---|
| **Home** (`index.html`) | Full-screen hero with an autoplaying, slow-zoom image loop · value statement · one call-to-action → gallery |
| **Collections** (`collections.html`) | Three clearly separated sections (Rings · Bespoke Watches · Leather Straps), sticky section tabs, lightbox with click-to-zoom, keyboard & swipe navigation, **Buy Now** on every item |
| **About** (`about.html`) | Brand story, studio photo mosaic, autoplaying **craftsmanship highlight reel**, brand values |
| **Contact** (`contact.html`) | Embedded enquiry form (validation + thank-you state), studio details, social links |

## Design

- **Palette:** Onyx `#0F0E0D` · Ivory `#F6F2EB` · Sand `#EBE3D6` · Champagne gold `#B8976A`
- **Type:** *Cormorant Garamond* (display, italic accents) + *Jost* (text, spaced small caps)
- Minimal, editorial layout that lets the photography lead; fully responsive from 360 px phones to wide desktops; respects “reduce motion”.

## Performance & SEO

- All images optimised to **WebP** in two sizes (720 px for grids, 1600 px for the lightbox) with `srcset`, lazy-loading and explicit dimensions — the whole image set is ~2.7 MB.
- Unique `<title>` and meta description on every page, Open Graph tags, descriptive `alt` text on every product, JSON-LD (`JewelryStore`), `sitemap.xml` and `robots.txt`.
- No frameworks — one small CSS file and one small JS file.

## How to update the site (no coding)

### Products
All products live in **`data/products.json`**. Each item looks like this:

```json
{ "name": "Nocturne Halo", "material": "18k white gold · 1.2 ct diamond", "price": "$4,850",
  "tag": "Signature", "image": "ring-nocturne", "alt": "Diamond halo ring on black velvet",
  "buyUrl": "https://your-store.myshopify.com/products/nocturne-halo" }
```

- **Add a product:** copy an item block, change the text, save.
- **Buy Now link:** paste your checkout URL into `buyUrl`.
- **Badge:** `tag` can be `"New"`, `"Limited"`, `"Signature"` — or `""` for none.
- **Images:** put two files in `assets/img/` — `name.webp` (≈1600 px) and `name-sm.webp` (≈720 px) — and set `"image": "name"`.

### Text
Page text is plain HTML in `index.html`, `about.html` and `contact.html` — edit the words between the tags.

### Contact form
Create a free form at [formspree.io](https://formspree.io) and replace `YOUR_FORM_ID` in `contact.html`. Messages then arrive in your inbox.

### Prefer WordPress / Webflow?
The design is built from simple, reusable sections (hero, tiles, product grid, lightbox, reel, form), so it maps one-to-one onto a WordPress block theme or a Webflow CMS collection (“Products” with name, material, price, image, buy URL, category).

## Run locally

```bash
python -m http.server 8000   # then open http://localhost:8000
```

---
*Photography: Unsplash (free licence), used as placeholders for the brand’s own imagery. Brand name, copy and prices are illustrative.*
