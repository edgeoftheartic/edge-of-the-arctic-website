# Website handover & getting-started guide
*For Philip · updated 6 July 2026*

## The short version

There are now **two websites**, deliberately split so each does one job well and
they feed traffic to each other:

| Site | What it's for | GitHub repo | Live preview (pre-launch) |
|---|---|---|---|
| **edgeofthearctic.travel** | Tours & expeditions (Iceland, Greenland & beyond) | `edge-of-the-arctic-website` | `edge-of-the-arctic-website.edgeoftheartic.workers.dev` |
| **edgeofthearctic.is** | Local hub: Eyri Restaurant, the guesthouse, North Iceland | `edge-of-the-arctic-info` | `edge-of-the-arctic-info.edgeoftheartic.workers.dev` |

Both are blocked from Google until launch. Both run on the **same free stack** and
the **same single Gmail login**. Nothing here costs more than a few pounds a month
(only the domains and per-transaction payment fees).

---

## 1. Why two sites, and how they feed each other

The old setup had two half-working sites pulling in different directions:
`edgeofthearctic.travel` (a cluttered tours site) and `edgeofthearctic.is` (an
abandoned regional-info portal full of dead links). We split the jobs cleanly and
rebuilt both:

- **edgeofthearctic.travel** is now a focused **tour-selling** site — someone
  planning a trip lands here, browses journeys, and books. No restaurant/room
  clutter to distract from that.
- **edgeofthearctic.is** is a brand-new **local hub** — someone searching "restaurant
  near Akureyri" or "where to stay in North Iceland" lands here, finds Eyri
  Restaurant (with a push to leave a **Google review**), the guesthouse, and a guide
  to the area. It replaces the old dead `.is` portal with something that actually
  works and drives bookings to the restaurant and rooms.

**They point at each other on purpose:**
- `.travel` → `.is`: a "Visit us in North Iceland" section sends tour visitors to the
  restaurant, rooms and area guide.
- `.is` → `.travel`: an "Our Expeditions ↗" link and a "We also run tours" section
  send local visitors to the journeys.
- Same brand, same logo, same design — they read as one company, two front doors.
- Enquiry forms on both land in the **same Gmail inbox**.

The result: whichever door a visitor comes through (planning a big trip, or just
looking for dinner near Akureyri), they can find everything else the business offers.

---

## 2. One login runs everything

Everything hangs off **a single Google (Gmail) account**, so there are no passwords
to juggle:

| Service | For | Sign in with |
|---|---|---|
| **Gmail** — `edgeoftheartic@gmail.com` | The hub; all enquiry emails land here | The password (sent separately) |
| **GitHub** (`github.com/edgeoftheartic`) | Both websites' code — two repos | "Sign in with Google" |
| **Cloudflare** | Hosting + auto-deploy — two Workers, one per site | "Sign in with Google" |
| **Web3Forms** | Delivers both sites' forms to Gmail | Same Gmail |

> The account spelling is `edgeoftheartic@gmail.com` — "artic" without the second
> **c**. Everything lives under that exact spelling (GitHub `edgeoftheartic`, the
> Worker URLs `…edgeoftheartic.workers.dev`). If a login ever looks off, that's the
> source of truth.

The handover documents (this guide, the strategy plan, the FAQ draft) are in the
**Google Drive → My Drive** of that same account.

---

## 3. What the sites are built with

**No framework, deliberately.** Both are hand-written static HTML/CSS/JavaScript
(not Next.js, not WordPress). No build step, no CMS, no database, no plugins. Each
site has one small Cloudflare "Worker" script for its robots.txt/sitemap (and, on
`.travel`, the Stripe checkout). That's the whole stack:

| Layer | Technology | Cost |
|---|---|---|
| Hosting + CDN + SSL | Cloudflare Workers (one per site) | **$0** (free tier) |
| Code & history | GitHub (two repos) | $0 |
| Enquiry forms | Web3Forms → Gmail | $0 |
| Payments (.travel) | WeTravel (group trips) + Stripe (optional) | per-transaction only |
| Domains | GoDaddy — nameservers move to Cloudflare at launch | unchanged |

Versus the old WordPress/GoDaddy setup, recurring cost drops to ~zero and there's
nothing to maintain: no updates, no security patching, no hosting renewals.

---

## 4. How editing works (the mental model)

Each site = the files in its GitHub repo. When you save ("commit") a change to a
repo, **Cloudflare notices and redeploys that site within about a minute.** You
never log into Cloudflare to publish — it just happens. So the only skill needed is:
**edit a file in the right repo → it goes live.**

Three ways to edit, easiest first (all work on either repo):

1. **GitHub in the browser (zero setup):** open the repo on github.com, press `.` —
   a full editor opens. Change the text → Commit & Push → live in ~1 minute.
2. **Copy a template:** on `.travel`, a new tour = copy `site/tours/_template.html`;
   a new blog post = copy `site/journal/_template.html` (numbered instructions inside
   each).
3. **Let Claude do it** (for anything bigger) — see the cheat sheet in section 8.

**Golden rule:** after any change, wait ~1 minute and check the site's preview URL.
Nothing you do can break a site permanently — GitHub keeps every previous version,
so anything can be undone.

---

## 4a. SEO & Google indexing at launch (Philip's question)

**"Do the addresses stay the same, or do we need to do the Google indexing again?"**

**The domains stay exactly the same** — `edgeofthearctic.travel` and
`edgeofthearctic.is`. Google's authority and history attach to the *domain*, and the
domain isn't changing — so you **keep** what those domains have earned. You are **not**
starting indexing from scratch. This is a platform/content refresh on the same
address, not a move to a new one (which is the risky kind).

**What *does* change is the individual page paths** — the old WordPress URLs
(`/discover-iceland/`, `/upcoming-tours/`, blog slugs, the old `.is` portal's
`/where-to-dine/`, etc.) differ from the new structure. If those old URLs simply
404'd after launch, you'd lose the ranking they'd built. So two things protect it:

1. **301 redirects — already built in.** Each site's Worker now permanently
   redirects every known old URL to its closest new page (e.g.
   `/discover-iceland/` → `/destinations/iceland.html`, `/where-to-dine/` →
   `/eat/`). A 301 passes the old page's ranking signal to the new page. These live
   in `worker/index.js` in each repo (the `REDIRECTS` map) — add any stragglers
   Google Search Console reports after launch.
2. **Sitemaps — already built in.** Each site serves a fresh `sitemap.xml` that
   auto-activates on the real domain.

**At launch, do this in Google Search Console (per domain):**
- Confirm/keep the existing Search Console property for the domain (same domain =
  same property).
- Submit the new `sitemap.xml` (`https://edgeofthearctic.travel/sitemap.xml`, and
  the same on `.is`).
- Use **URL Inspection → Request Indexing** on the key pages (home, tours, top
  destinations; the restaurant page on `.is`) to nudge Google to recrawl sooner.
- Over the next 1–3 weeks, watch the **Pages/Coverage** report and add redirects for
  any old URLs it flags as 404.

**Net effect:** because the new sites are *more* SEO-complete than the old ones
(working links, unique titles/descriptions, structured data, no dead/duplicate pages,
correct product mapping), rankings should **hold and then improve** — not drop —
provided the redirects and sitemap steps above are done. Expect a brief settle of a
few days to a couple of weeks while Google recrawls the same domain.

**One extra for the restaurant:** the biggest driver of "restaurant near Akureyri"
searches and star ratings is the **Google Business Profile** (the Maps listing), which
is separate from the website and unaffected by this change. Make sure that profile
lists `edgeofthearctic.is` as the website, and use the review link on the new `/eat/`
page to funnel happy diners into reviews.

---

## 5. Payments & booking (.travel)

- **WeTravel** runs the scheduled group-trip bookings (card, bank transfer, payment
  plans). To clear up an earlier question: **FareHarbor isn't used anywhere** — when
  you asked "can WeTravel be as seamless as FareHarbor," the answer is yes; WeTravel's
  embedded checkout can open payment in a pop-up so guests never appear to leave the
  site (a small future upgrade).
- **Stripe** is wired only for the flagship Greenland deposit for now (those 2027
  departures don't exist in WeTravel yet). If Nik adds them to WeTravel, the deposit
  button becomes a WeTravel link and Stripe sits dormant. End state can simply be
  "all payments through WeTravel."

---

## 6. Steps to launch (per site)

Both sites are **built, deployed to their preview URLs, and working.** Remaining
before each domain goes public:

**Shared / content**
- Review the copy on both sites; correct any facts.
- Answer the FAQ draft (in Google Drive) → plugged into `.travel`'s contact page.
- Two real photos still needed: the guesthouse room (`.is` `site/assets/img/
  guesthouse.jpg`) and a Nik & Sarah portrait (`.travel` `site/assets/img/
  nik-sara.jpg`).

**edgeofthearctic.is specifically**
- **Google review link:** the restaurant page's "Write a Google Review" button uses a
  working Google-Maps fallback; for a true one-click review, paste the restaurant's
  `g.page/r/…` short link (Google Business Profile → "Ask for reviews") — there's a
  `TODO` comment in `site/eat/index.html`.
- Decide whether to retire the old Wix `eyrirestaurant.is` in favour of the new,
  richer `/eat/` page here.

**edgeofthearctic.travel specifically**
- Confirm the deposit/cancellation specifics flagged in `/terms/`.
- Stripe: finish verification and swap test → live key (or route everything via
  WeTravel).
- Optional: confirm the WhatsApp number (+354 862 9697) is WhatsApp-enabled — the
  WhatsApp/Call buttons are tagged `data-prelaunch` so they're easy to pull if not.

**Launch (each domain)**
- Point the domain's nameservers to Cloudflare and attach it to that site's Worker.
  The old sites keep running until that moment; each site's robots.txt/sitemap flip
  to "index me" automatically on the real domain.
- Add 301 redirects from old URLs → new pages so Google rankings transfer.

---

## 7. Site inventory

**edgeofthearctic.travel** (~30 pages): Home · Tours (with instant filter chips &
deep-links) · flagship Greenland by Sea · Reset Croatia · Destinations (8 country
pages) · Ways to Travel (5 style pages) · Journal (6 posts) · About · Contact & FAQ ·
Book · Privacy · Terms. Every tour links to a live WeTravel booking page.

**edgeofthearctic.is** (5 pages): Home · Eat (Eyri Restaurant + Google-reviews push) ·
Stay (guesthouse + enquiry form) · Explore (North Iceland area guide) · Contact.

Both: unique titles/descriptions, canonical URLs, Open Graph share cards, schema.org
markup, the company logo, and the Ferðamálastofa licence badge — SEO-ready.

---

## 8. Cheat sheet — running the sites with Claude

**Goal:** say, in plain English, "change X on the [tours / restaurant] site," and have
it done and live — without hand-writing code.

**Step 1 — Get Claude.** Go to claude.ai, **sign in with Google** (same Gmail). For
editing, use **Claude Code** (the Claude desktop app or claude.ai/code). A paid plan
(Pro is plenty) is needed for real coding use.

**Step 2 — Connect the repo (one-time, per site).** In Claude Code, open / connect a
GitHub repository and pick the right one:
- **edge-of-the-arctic-website** for the tours site
- **edge-of-the-arctic-info** for the restaurant/local site
(Because GitHub uses the same Google login, authorising is a couple of clicks.)

**Step 3 — Ask.** Describe the change; Claude edits the files and commits, which
auto-publishes. Examples:
- *"On the restaurant site, change the opening hours to 18:00–22:00 everywhere."*
- *"Add a new tour on the tours site for a 5-day Faroe photography trip — copy the
  tour template, here are the details…"*
- *"Add three new guest reviews to the restaurant page."*

**Step 4 — Check.** Wait ~1 minute, refresh the site's preview URL. Not right? Tell
Claude "undo that" — every version is saved.

**Handy:** point Claude at a repo's `README.md` — it documents the structure and how
deploys work. You'll almost never touch Cloudflare (only for the launch domain switch
and the one Stripe key) or the `worker/` code.

---

## 9. Working together

Two clean repos, one login, one design system. Content and local knowledge (you)
flow into the template-driven pages; the structure, booking and SEO plumbing is done.
Each repo's `README.md` is the technical reference. A GitHub collaborator invite (from
the `edgeoftheartic` account, on each repo) is all you need to start.
