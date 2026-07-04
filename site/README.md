# Edge of the Arctic & Beyond — Website

Static site for **edgeofthearctic.travel / Edge of the Arctic & Beyond** (Nik & Sara, Hjalteyri, North Iceland): Iceland & Greenland expeditions, Eyri Restaurant, and the guesthouse.

Built as plain HTML/CSS/JS — no build step — for **Cloudflare Pages**, with **Web3Forms** for enquiries and **Stripe Checkout** (via a Cloudflare Pages Function) for deposits.

## Structure

```
site/
├── index.html              Home — three paths: Journeys / Stay / Eat
├── tours/                  Tour index + individual journey pages
│   └── greenland-by-sea.html   Flagship expedition (2027)
├── stay/                   Guesthouse in Hjalteyri
├── dine/                   Eyri Restaurant
├── explore/                Regional guide (from the 2019 brochure)
├── about/                  Nik & Sara's story
├── contact/                Contact + FAQ
├── book/                   THE conversion page: deposit buttons + enquiry form
│   └── thank-you.html      Stripe success page
├── assets/                 css / js / img
└── functions/api/          Cloudflare Pages Functions (Stripe)
```

## Project accounts (handover bundle)

Everything hangs off one Gmail address (the project email) so the whole stack can be
handed to Nik in one go: **Gmail → GitHub → Cloudflare → Web3Forms** (+ Stripe when
created). Handover = transfer the Gmail password + 2FA.

## Deploy to Cloudflare Pages

1. Push this repo to the project GitHub account (repo is initialised locally — see root).
2. Cloudflare dashboard (project account) → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings: **no framework, no build command**, root directory = `site`, output directory = `/`.
4. Add the custom domain (e.g. `edgeofthearctic.travel`) under **Custom domains**.

The `functions/` directory is picked up automatically by Pages — `/api/create-checkout-session` becomes live on deploy.

## Web3Forms (enquiry forms) — DONE

The access key is already wired into both forms (`book/index.html`, `contact/index.html`).
Submissions arrive at the inbox of the Web3Forms account (registered under the project
Gmail). No server needed. To change the destination later, log in at web3forms.com.

## Stripe setup (deposits & payments)

1. Create a Stripe account → get the **secret key** (`sk_live_…`; use `sk_test_…` first).
2. Cloudflare Pages project → **Settings → Environment variables** → add `STRIPE_SECRET_KEY`.
3. Products & amounts are defined in `functions/api/create-checkout-session.js` (`PRODUCTS` map) — edit there to add tours or change deposit amounts.
4. Until the key is set, deposit buttons gracefully fall back to the enquiry form, so the site works day one without Stripe.

Optional later: add a Stripe webhook function to auto-log bookings to a spreadsheet/CRM.

## Images

Photo slots in `assets/img/` (referenced but not included — export from the old site, the 2019 brochure, or Nik's library):

- `hero-home.jpg` — dramatic North Iceland/fjord hero
- `hero-greenland.jpg` — Amarok / Greenland coast
- `tasermiut.jpg`, `akureyri.jpg`, `dettifoss.jpg`, `asbyrgi.jpg`,
  `arctic-henge.jpg`, `arctic-henge-card.jpg`, `langanes.jpg`, `melrakkasletta.jpg`
- `eyri-restaurant.jpg`, `eyri-food.jpg` — from eyrirestaurant.is
- `hjalteyri.jpg`, `guesthouse.jpg`
- `nik-sara.jpg` — the hosts

Pages render fine before images are added (slots show a deep-blue gradient).

## Editing content

Everything is plain HTML — open the page, edit the text, redeploy. Shared look & feel lives in `assets/css/main.css`; shared behaviour (mobile nav, forms, Stripe buttons) in `assets/js/main.js`.
