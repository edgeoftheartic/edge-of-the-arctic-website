# New website — handover & getting-started guide
*For Philip · updated 6 July 2026*

Live preview (blocked from Google until launch):
**https://edge-of-the-arctic-website.edgeoftheartic.workers.dev**

---

## 1. One login runs everything

The whole project is built around **a single Google (Gmail) account**, so you
don't juggle passwords. That one login gets you into all four services:

| Service | What it's for | How you sign in |
|---|---|---|
| **Gmail** — `edgeoftheartic@gmail.com` | The hub. Enquiry-form emails land here. | The password (sent to you separately) |
| **GitHub** | The website's code & change history | "Sign in with Google" → the same Gmail |
| **Cloudflare** | Hosting + auto-deploy | "Sign in with Google" → the same Gmail |
| **Web3Forms** | Delivers the contact forms to Gmail | Already set up; log in with the same Gmail if needed |

> **Note on the spelling:** the account is `edgeoftheartic@gmail.com` —
> "artic" without the second **c** (it was the address that was free). Everything
> lives under that exact spelling: the GitHub account is **github.com/edgeoftheartic**
> and the site's temporary address is **edgeoftheartic.workers.dev**. If any login
> ever looks off, that spelling is the source of truth.

**The handover files** (this document, the strategy plan, and the FAQ draft for
Sarah & Nik) are in the **Google Drive → My Drive** of that same account.

**That's the whole handover:** sign into the Gmail account and you have the code,
the hosting, the forms and the files. Nothing else to transfer.

---

## 2. What the site is built with

**No framework — deliberately.** It's hand-written static HTML5/CSS/JavaScript
(not Next.js, not WordPress). No build step, no CMS, no database, no plugins to
update. One small JavaScript "Worker" script runs on Cloudflare's edge for the
Stripe checkout, robots.txt and sitemap. That's the entire stack:

| Layer | Technology | Monthly cost |
|---|---|---|
| Hosting + CDN + SSL | Cloudflare Workers (static assets) | **$0** (free tier, far above this site's needs) |
| Code & change history | GitHub repo `edgeoftheartic/edge-of-the-arctic-website` | $0 |
| Enquiry forms | Web3Forms (posts straight to Gmail) | $0 (free tier) |
| Payments | WeTravel (group trips) + Stripe (optional) | $0 fixed — per-transaction fees only |
| Domain | stays at GoDaddy — only the **nameservers** move to Cloudflare | unchanged |

Versus the old WordPress/GoDaddy setup, recurring cost drops to essentially
**zero** and there's nothing to maintain: no WP/plugin/theme updates, no
security patching, no hosting renewals.

---

## 3. How the site works (the mental model)

Three things, and they chain together automatically:

1. **GitHub** holds every file of the website.
2. When a change is saved ("committed") to GitHub, **Cloudflare notices and
   redeploys the live site within about a minute.** You never log into
   Cloudflare to publish — it just happens.
3. The site is plain files, so a change is literally editing text in a file.

So the only skill you need is: **change a file in GitHub → it goes live.**
Section 6 shows you the easiest ways to do that, including using Claude.

---

## 4. WeTravel, FareHarbor & Stripe

To clear up one thing: **FareHarbor isn't used anywhere** — the old site is 100%
WeTravel. When you asked "can WeTravel be as seamless as FareHarbor," the answer
is yes, in stages:

1. **Now (live):** booking buttons deep-link to WeTravel trip pages — two clicks
   to checkout, every link verified working (the old site has 9 dead ones).
2. **Seamless (small upgrade):** WeTravel's **embedded checkout** opens payment
   in a pop-up so guests never appear to leave the site (~an afternoon's work).
3. **Stripe (optional):** wired for the flagship Greenland deposit only, because
   the 2027 departures don't exist in WeTravel yet. If Nik creates them there,
   the deposit button becomes a WeTravel link and Stripe sits dormant. End state
   can simply be **"all payments through WeTravel."**

---

## 5. Steps to launch

Setup is **done** — hosting, deploys, forms and payments all work on the preview
URL. Remaining:

1. **Content review** — read the site, correct facts, improve copy (your area).
2. **Two placeholder photos** — a real guesthouse room and a Nik & Sarah
   portrait (`site/assets/img/guesthouse.jpg`, `nik-sara.jpg`).
3. **FAQ answers** — the FAQ draft (in Google Drive) goes to Sarah & Nik;
   answers get plugged into the contact page.
4. **Terms specifics** — deposit/cancellation numbers to confirm (flagged in
   `/terms/`).
5. **Stripe (optional):** finish verification and swap test → live key, or run
   everything through WeTravel.
6. **Launch:** point the domain's nameservers to Cloudflare and attach the
   domain. The old site keeps running until that moment; the site's
   robots.txt/sitemap flip to "index me" automatically on the real domain.
7. **301 redirects** old URLs → new pages so Google rankings transfer.

---

## 6. How to edit the site — three ways, easiest first

You do **not** need to be a coder for the first two.

### A) Quick text tweak — GitHub in the browser (zero setup)
1. Go to **github.com/edgeoftheartic/edge-of-the-arctic-website** (signed in with
   the Gmail).
2. Press the **`.`** key. A full editor opens in your browser (this is
   "github.dev").
3. Open the page's file (e.g. `site/dine/index.html`), change the words.
4. Click the **Source Control** icon on the left → write a short message →
   **Commit & Push**. The site updates in ~1 minute.

### B) New tour or blog post — copy a template
Every routine job is a copy-the-template job:
- **New tour page:** copy `site/tours/_template.html`, follow the numbered
  instructions at the top of the file (~10 min; SEO built in).
- **New blog post:** copy `site/journal/_template.html` (~5 min).

### C) Anything bigger — let Claude do it
For real changes ("add a testimonials section to every destination page",
"restyle the buttons", "build a new page for X"), use Claude — see the cheat
sheet below. You describe what you want in plain English; Claude edits the files,
commits, and the site deploys itself.

**The golden rule for all three:** after any change, wait ~1 minute and check the
live preview URL to see it. Nothing you do can break the site permanently —
GitHub keeps every previous version, so anything can be undone.

---

## 7. Cheat sheet — getting up and running with Claude

**Goal:** be able to say, in plain English, "change X on the website," and have
it done and live — without hand-writing code.

### Step 1 — Get Claude (5 minutes)
- Go to **claude.ai** and **sign in with Google**, using the same
  `edgeoftheartic@gmail.com` account. (One login, still.)
- For editing the website, use **Claude Code** — Anthropic's coding tool. Easiest
  option: the **Claude desktop app** (Mac/Windows) or **claude.ai/code** in the
  browser. Both let Claude work directly with the GitHub repo.
- A paid Claude plan is needed for meaningful coding use — the Pro plan is plenty
  to manage this site.

### Step 2 — Connect Claude to the website's code (one-time)
You're connecting Claude to the **GitHub repo** so it can see and change the site:
- In Claude Code, choose to **open / connect a GitHub repository** and pick
  **edgeoftheartic/edge-of-the-arctic-website**. (Because GitHub uses the same
  Google login, authorising it is a couple of clicks.)
- If you prefer working on your own computer: install the free **GitHub Desktop**
  app, "Clone" that repo to a folder, then point the Claude desktop app at that
  folder. Claude edits the files; GitHub Desktop's **Push** button sends them
  live.

*Either way, the important part is that Claude can see the repo. Once it can,
you're ready.*

### Step 3 — Ask for what you want (in plain English)
Open the project in Claude and just describe the change. Real examples that work:
- *"On the Eat page, change the opening hours to 18:00–22:00 and update it
  everywhere it appears."*
- *"Add a new tour page for a 5-day Faroe Islands photography trip — copy the
  tour template, here are the details… then add a card for it on the tours page."*
- *"Add three guest reviews to the homepage testimonials section — here's the
  text."*
- *"The booking button colour is too pale — make it a bit bolder."*

Claude will make the changes, explain what it did, and (if you ask, or in Claude
Code by default) commit them to GitHub — which auto-publishes them.

### Step 4 — Check it went live
Wait ~1 minute, then refresh the site (the preview URL now, the real domain after
launch). If something's not right, just tell Claude "undo that" or "change it
so…" — every version is saved, nothing is lost.

### Handy things to tell Claude
- **"Show me the change before publishing"** if you want to review first.
- **"Where is the file for the [X] page?"** if you're hunting for something.
- **"Explain how the booking buttons work"** — it'll read the code and tell you.
- Point it at this repo's **`site/README.md`** — it documents the structure,
  the templates, and how deploys work, so Claude has the full picture.

### What you'll almost never need to touch
- **Cloudflare** — only for the domain switch at launch and (once) the Stripe
  key. Not for content.
- **The Worker code** (`worker/index.js`) — handles robots/sitemap/Stripe;
  leave it unless changing payment behaviour.

---

## 8. Current site inventory (35 indexed pages)

- Home · Tours index · **Greenland by Sea flagship** · **Reset Croatia**
- **Destinations:** index + Iceland, Greenland, Faroe Islands, Croatia, Slovenia,
  Bosnia, Greece, Bulgaria — each linked to its correct live products
- **Ways to Travel:** hub + Women-Only, Food & Wine, Private & Tailor-Made,
  Off-Road & Highlands, LGBTQ+ Friendly
- **Journal:** index + all 6 blog posts migrated from the old site
- **How We Travel** (responsible-travel policy) · Stay · Eat (Eyri) · North
  Iceland guide · About · Contact & FAQ · Book · Privacy · Terms
- Guest **testimonials**, the company **globe logo**, and the **Ferðamálastofa
  licence badge** in every footer
- Every page: unique title/description, canonical, Open Graph share cards, and
  schema.org markup (rich-result ready)

---

## 9. Working together

The GitHub repo is the single source of truth — nothing is locked to one person.
Content and destination knowledge (you) flows into the template-driven pages;
the structure, booking and SEO plumbing is already in place. The `site/README.md`
in the repo is the technical reference for anything not covered here.
