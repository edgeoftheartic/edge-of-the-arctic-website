# New website — technical handover & FAQ
*For Philip · updated 5 July 2026 · answers to your questions + current status*

Live preview (blocked from Google until launch):
**https://edge-of-the-arctic-website.edgeoftheartic.workers.dev**

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
| Payments | WeTravel (group trips) + Stripe (optional, see below) | $0 fixed — per-transaction fees only, same as today |
| Domain | stays registered at GoDaddy — only the **nameservers** change to Cloudflare | unchanged |

Versus the current WordPress/GoDaddy setup the recurring cost drops to
essentially **zero**, and there is nothing to maintain: no WP core/plugin/theme
updates, no security patching, no hosting renewals.

## "In which program do I work on the website?"

There is no admin panel — the website **is** the files in the GitHub repo.
Three ways to edit:

1. **GitHub's web editor (easiest):** open the repo on github.com and press
   `.` — a full editor (github.dev) opens in the browser. Change the text,
   commit. **Every commit to `main` auto-deploys to Cloudflare in ~1 minute.**
2. **Any code editor locally** (VS Code etc.): clone, edit, push.
3. **AI-assisted:** the repo is small, clean and commented — tools like
   Claude Code handle "add a menu item on every page" in one prompt.

Routine tasks are template-driven — copy a file, fill in the marked blanks:
- **New tour page:** copy `site/tours/_template.html` (numbered instructions
  in its header comment; SEO tags + structured data built in). ~10 minutes.
- **New blog post:** copy `site/journal/_template.html`. ~5 minutes.
- **Change text/price/date:** edit the page's HTML file directly.
- **Menu change:** the same `<nav>` block sits at the top of each page —
  find-and-replace across the files (or one AI prompt).

Cloudflare is **not** where you edit — it only hosts and auto-deploys
whatever is in GitHub. You never touch the Cloudflare dashboard for content.

## "Can WeTravel integrate as seamlessly as FareHarbor?"

First, to clear up a confusion on our side: **FareHarbor isn't used anywhere
on the current sites** — we checked; the old site is 100% WeTravel (161
references, 13 embedded checkouts). So this is purely about making WeTravel
feel FareHarbor-smooth, and the answer is yes, in stages:

1. **Now (live):** booking buttons deep-link to WeTravel trip pages. Two
   clicks from homepage to checkout, every link verified working (the old
   site has 9 dead ones).
2. **Seamless (small upgrade, ~an afternoon):** WeTravel's **embedded
   checkout** (`checkout_embed` — the old site already used these URLs) opens
   payment in a modal so guests never appear to leave the site.
3. **Stripe (optional):** currently wired for the flagship expedition's
   $1,000 deposits only, because the 2027 Greenland departures don't exist in
   WeTravel yet. If/when Nik creates them as WeTravel trips (recommended —
   payment plans help sell an $8,495 product), the deposit buttons become
   WeTravel links (two-line edit) and Stripe sits dormant. It costs nothing
   while unused and remains handy for bespoke invoices or vouchers. End
   state can simply be: **"all tour payments through WeTravel."**

## "What are the steps? Is Nik setting everything up?"

Setup is **done** — hosting, deploys, forms, payments, SEO plumbing all work
on the preview URL. Remaining before launch:

1. **Content review** — read the site, correct facts, improve copy. This is
   where your knowledge matters most (see "still to migrate" below).
2. **Two placeholder photos** — a real guesthouse room and a Nik & Sarah
   portrait (`site/assets/img/guesthouse.jpg`, `nik-sara.jpg`).
3. **FAQ answers** — 28 questions are with Sarah & Nik (`FAQ-QUESTIONS.md`);
   answers get plugged into the contact page with FAQ rich-result markup.
4. **Confirm** guesthouse details (/stay/) and flagship terms.
5. **Stripe (optional):** finish verification and swap test → live key, or
   decide to run everything through WeTravel instead.
6. **Launch:** point the domain's nameservers to Cloudflare, attach the
   domain to the Worker (minutes; old site runs until that moment; the
   robots.txt/sitemap flip to "index me" automatically on the real domain).
7. **301 redirects** old URLs → new pages (Cloudflare Bulk Redirects) so
   existing Google rankings transfer.

## Current site inventory (26 indexed pages)

- Home · Tours index · **Greenland by Sea flagship** · **Reset Croatia**
- **Destinations:** index + Iceland, Greenland, Faroe Islands, Croatia,
  Slovenia, Bosnia, Greece, Bulgaria — each linked to its correct live
  products (12 WeTravel trips catalogued + 2 on-site journeys)
- **Journal:** index + all 6 blog posts migrated from the old site (edited,
  with related-journey CTAs replacing the old broken internal links)
- Stay · Eat (Eyri) · North Iceland regional guide (/explore/) · About ·
  Contact & FAQ · Book (the single conversion page)
- Guest **testimonials** from the old homepage: 3 on home, 1 on the
  flagship, 1 on the Iceland destination page
- Company **globe logo** in the header (extracted from the brochure)
- Every page: unique title/description, canonical, Open Graph share cards,
  and schema.org markup (TravelAgency, Restaurant, FAQPage, TouristTrip,
  TouristDestination, Article)

## Still worth migrating from the old site

1. **Niche landing pages** — Women-only adventures, LGBTQ-friendly travel,
   Off-road/Land Rover highlands, Food & Wine tours, Tailor-made. Each maps
   onto the tour-page template; the women-only page can link the live
   "Savor the Adriatic" departure.
2. **How We Travel / Responsible Travel policy** — partially covered on
   About; the full policy text is worth keeping as its own page.
3. **Legal pages** — privacy policy & terms. Note: the old privacy page
   contains template placeholder text ("legal entity code 000000000"), so it
   needs rewriting, not copying.
4. **Ferðamálastofa licence badge** (Authorized Day Tour Provider 2026-048)
   — image already extracted, ready to add to the footer.
5. **A few tour cards** on /tours/ for trips currently only linked from
   destination pages (Northern Lights Escapes, winter-season departures,
   Easter Croatia, Savor the Adriatic, Heaven on Earth).

## Working together

The repo is the single source of truth — nothing is locked to one person.
The most useful division right now: content and destination knowledge
(Philip) flowing into the template-driven pages, with structure, booking and
SEO plumbing already in place. Access is a GitHub collaborator invite away
(from the edgeoftheartic account).
