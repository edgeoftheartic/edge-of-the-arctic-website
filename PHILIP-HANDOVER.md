# New website — technical handover & FAQ
*For Philip · 5 July 2026 · answers to your questions, plus a content gap list*

## What the new site is built with

**No framework — deliberately.** It's hand-written static HTML5/CSS/JavaScript
(not Next.js, not WordPress). There is no build step, no CMS, no database, no
plugins to update. One small JavaScript "Worker" script runs on Cloudflare's
edge for the Stripe checkout endpoint, robots.txt and sitemap.xml. That's the
entire stack:

| Layer | Technology | Monthly cost |
|---|---|---|
| Hosting + CDN + SSL | Cloudflare Workers (static assets) | **$0** (free tier: 100k requests/day — far above this site's needs) |
| Code & change history | GitHub repo `edgeoftheartic/edge-of-the-arctic-website` | $0 |
| Enquiry forms | Web3Forms (posts go straight to email) | $0 (free tier) |
| Deposits/payments | Stripe (flagship deposits) + WeTravel (group trips) | $0 fixed — per-transaction fees only, same as today |
| Domain | stays registered wherever it is now (GoDaddy) — only the **nameservers** change to Cloudflare | unchanged |

So versus the current WordPress/GoDaddy setup the recurring cost drops to
essentially **zero**, and — just as important — there is nothing to maintain:
no WP core/plugin/theme updates, no security patching (the current site runs
outdated WordPress), no hosting renewals.

## "In which program do I work on the website?"

There is no admin panel — the website **is** the files in the GitHub repo.
Three ways to edit, pick whichever suits:

1. **GitHub's web editor (easiest):** open the repo on github.com, press `.`
   (or Edit on any file), change the text, commit. **Every commit to `main`
   auto-deploys to Cloudflare in about a minute.** Nothing else to do.
2. **Any code editor locally** (VS Code etc.): clone the repo, edit, push.
3. **AI-assisted:** the repo is clean, commented and small — tools like
   Claude Code / Cursor handle "add a menu item on every page" in one prompt.

Concrete examples:
- **Change text:** edit the HTML file for that page (`site/dine/index.html` etc.).
- **Add a menu item:** it's the same `<nav>` block at the top of each page —
  a find-and-replace across ~12 files (or one AI prompt).
- **Add a new tour:** copy `site/tours/_template.html`, follow the numbered
  instructions in its header comment (10 minutes; SEO tags and structured
  data are built in).
- **Change a price/date:** edit the tour card in `site/tours/index.html` and
  the tour page. WeTravel remains the source of truth for checkout prices.

Cloudflare is **not** where you edit — it only hosts and auto-deploys what's
in GitHub. You never need to touch the Cloudflare dashboard for content.

## "Can WeTravel integrate as seamlessly as FareHarbor?"

Close to it, yes — three levels, all already supported by the site:

1. **Now (live):** "Dates & Booking" buttons deep-link to the WeTravel trip
   page. Two clicks from homepage to checkout, all links verified working
   (the old site had 9 dead ones).
2. **Seamless (small upgrade):** WeTravel's **embedded checkout**
   (`checkout_embed` — the old site already had these URLs) opens the payment
   flow in a modal so guests never appear to leave the site. FareHarbor-like
   experience, ~an afternoon of work to wire into the existing buttons.
3. **Fully in-house (Stripe):** already live for the flagship expedition
   deposits. WeTravel stays for scheduled group trips because it does payment
   plans, balance collection and manifests — things Stripe alone doesn't.

## "What are the steps? Is Nik setting everything up?"

Setup is **done** — the site is live on a temporary URL:
https://edge-of-the-arctic-website.edgeoftheartic.workers.dev
(deliberately blocked from Google until launch). Remaining steps:

1. **Content review** — this is where your knowledge is most valuable (see gap
   list below: your destination guides and blog posts are worth migrating).
2. Replace two placeholder photos (guesthouse room, Nik & Sarah portrait) and
   confirm guesthouse details + flagship terms.
3. Stripe: finish business verification, swap test key → live key (one
   dashboard field).
4. **Launch:** point the domain's nameservers to Cloudflare and attach the
   domain to the Worker (minutes; the old site keeps running until that
   moment, and robots/sitemap flip automatically).
5. 301-redirect map from old URLs → new pages (Cloudflare Bulk Redirects) so
   existing Google rankings transfer.

## What the old site has that the new one doesn't (yet)

The new site deliberately launched focused (clear journeys, working booking,
flagship). Worth migrating from your work on the old site, roughly in order
of value:

1. **Destination guide pages** — Discover Iceland / Greenland / Faroe Islands
   / Croatia / Slovenia / Bosnia / Greece / Bulgaria. Good SEO content; on the
   new site these would become guide pages in the /explore/ pattern (and this
   time each one linked to the *right* products — on the old site the
   Greenland, Greece and Bulgaria pages sell the wrong country's trip).
2. **Blog (6 posts)** — fly-fishing Greenland, Greece local tours, hidden
   Bulgaria, Inuit culture, truffle hunting, spring in Iceland. Straight
   migration into a /journal/ section.
3. **Niche landing pages** — Women-only adventures, LGBTQ-friendly travel,
   Off-road/Land Rover highlands, Food & Wine tours, Tailor-made. Each maps
   cleanly onto the tour-page template.
4. **Tours not yet carded on the new site** — Northern Lights Escapes 4d/3n
   (£1,180 ex-UK package), Nov 7–13 2026 Northern Lights departure (own card),
   Easter Break Croatian Wine (Mar 2027), Heaven on Earth Croatia & Slovenia
   (Apr 2027), Savor the Adriatic women-only (Apr 2027), 7-day Bosnia-only
   option, Croatia Reset 1.0 ($3,600 scheduled version alongside the premium
   private one).
5. **Testimonials** — the old site has guest quotes; the new site has none
   yet. A short reviews strip on the homepage + tour pages would help the
   $8k flagship in particular.
6. **How We Travel / Responsible Travel policy** — partially covered on the
   new About page; the full policy text is worth keeping.
7. **Legal pages** — privacy policy & terms. The old privacy page has
   template placeholder text ("legal entity code 000000000") so it needs
   rewriting, not copying.
8. **Trust badge** — the Ferðamálastofa "Authorized Day Tour Provider
   2026-048" badge (already extracted from the site media, ready to add to
   the footer).

What the new site has that the old one doesn't: verified booking links
(9 were dead), real FAQ answers (old ones are Lorem Ipsum), the flagship
Greenland expedition with online deposits, restaurant + guesthouse + region
sections, structured data (TravelAgency/Restaurant/FAQ/TouristTrip), Open
Graph share cards, correct product-to-destination mapping, a street address,
and per-tour SEO pages generated from a template.

## Working together

The repo is the single source of truth — nothing is locked to one person.
The most useful division right now: content and destination knowledge
(Philip) flowing into the template-driven pages, with the structure, booking
and SEO plumbing already in place. Access is a GitHub collaborator invite
away.
