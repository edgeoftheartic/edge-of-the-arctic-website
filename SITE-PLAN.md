# Edge of the Arctic & Beyond — Website Strategy & Information Architecture
*Prepared 4 July 2026 · Companion to the new site in `site/`*

---

## 1. What we found (the audit)

### Two different "Edge of the Arctic" websites exist — and neither sells well

**edgeofthearctic.is is not the company's site.** It belongs to *Norðurhjari*, a regional
tourism partnership for Northeast Iceland (their contact: nordurhjari@edgeofthearctic.is,
+354 855 1511). The 2019 brochure PDF is theirs too. The site is an abandoned ~2020
WordPress 5.4 install (unpatched, a security risk) with:
- **no tours, no prices, no booking path, no contact form** — it is a link directory
- 10+ dead outbound links (northeasticeland.com, happycovetravel.is, morunir, etc.)
- placeholder pages ("Information here"), a blank "How to get there" page, a stock Divi logo
- one page showing pottery-course template text over copy-pasted Dettifoss content

**edgeofthearctic.travel is Nik's actual company site** (WordPress + Elementor,
operator: Langanes Ferðamannaþjónusta). It has real products but serious conversion killers:
- **9 of ~23 tour cards in the site-wide "Signature Tours" menu lead to dead WeTravel
  pages** (five Northern Lights winter dates are hard 404s; four more redirect to a 403)
- **FAQ answers are Lorem Ipsum** — on exactly the questions buyers ask before paying
  (cancellation, insurance, installments)
- **Privacy policy contains template placeholders** ("legal entity code 000000000,
  Gatvė str. 0 City") — a trust killer for an $8k product
- Wrong products mapped to destination pages (the Greenland and Bulgaria pages sell an
  Iceland trip; the Greece page sells a Croatia trip)
- Tour cards labelled "May 2026" that actually book May **2027** departures
- Three currencies (£/$/€) mixed with no explanation; three competing accent colours
- Four orphaned test homepages and stale 2024/25 tour pages still live and indexable
- No About/story page (the old "how we started" URL 404s); primary contact on the
  contact page is a Gmail address
- Booking exists only via WeTravel (which is fine — but the path to it is broken ~40%
  of the time)

**eyrirestaurant.is** (Wix) is healthy: Dineout reservations work, hours/contacts are
current. Its "Experiences" page is an empty placeholder. It is not linked to the tour
brand in any meaningful way — a missed cross-selling loop.

### The core strategic problem
Three businesses (tours, restaurant, rooms) with no connecting thread, a catalogue that
sprawls from Greenland to Bulgaria with equal visual weight, and a booking journey that
dead-ends 40% of the time. The customer cannot answer "what does this company actually
sell, and what should *I* buy?"

---

## 2. The fix: one brand, three doors, one checkout

### Positioning
**"Hosts, not operators."** Nik & Sara live in Hjalteyri, own the restaurant, guide the
trips. Every page reinforces this single differentiator. The Arctic is the hero;
Mediterranean trips are explicitly framed as "the Beyond" — a curated sideline, not
brand confusion.

### Information architecture (as built in `site/`)

```
Home ─ "What would you like to do?"
│
├── EXPEDITIONS & TOURS  /tours/          ← primary revenue path
│     ├── Flagship: Greenland by Sea      /tours/greenland-by-sea.html
│     ├── Iceland journeys (Deep Reset, Reset, Northern Lights, Spring)
│     ├── Beyond (Faroes, Croatia & Bosnia)
│     └── Tailor-made → /book/
│
├── STAY   /stay/     ← guesthouse, Hjalteyri
├── EAT    /dine/     ← Eyri Restaurant → Dineout
├── EXPLORE THE REGION  /explore/   ← brochure content, SEO + trust
├── ABOUT US  /about/  ← the Þórshöfn origin story, "hosts not operators"
├── CONTACT & FAQ  /contact/   ← real FAQ answers (no Lorem Ipsum)
│
└── BOOK YOUR JOURNEY  /book/   ← THE single conversion page
      ├── instant deposit (Stripe) for the flagship
      ├── WeTravel links for scheduled trips
      └── enquiry form (Web3Forms) for everything else
```

**Rules the new site follows:**
1. Maximum 2 clicks from any page to a working "pay or enquire" action.
2. Every tour card shows duration + next dates + price + deposit in one glance.
3. "Book Your Journey" is a persistent amber button in the header of every page.
4. Cross-selling loop: Eat → Stay → Tour; every journey ends at Eyri's table.
5. Scarcity is structural, not decorative: flagship = 2 departures × 12 guests, stated
   identically everywhere.
6. No dead links: only verified-live WeTravel URLs are used (all 6 checked, HTTP 200).

### The customer journeys

**Expedition buyer (affluent North American, the $8,495 target):**
Home banner or /tours/ → flagship page (itinerary, dates table, inclusions, trust) →
$1,000 Stripe deposit *or* "talk to Nik & Sara first" enquiry. Deposit is refundable
30 days — lowers commitment anxiety at this price point.

**Iceland tour shopper:** Home → /tours/ → tour card → WeTravel (their proven checkout,
payment plans included). No re-platforming risk; Sarah's WeTravel work plugs straight in.

**Independent traveller in the north:** Google/Explore page → Stay or Eat →
enquiry/Dineout → upsell to day tours.

**Dreamer, not ready:** any page → enquiry form (24h personal reply promise) →
relationship starts by email.

### Team/organisation simplification this enables
- All product/dates/pricing live in **one place: WeTravel** (plus one Stripe product for
  the flagship). The website links out; nothing to keep in sync except the tour cards.
- All enquiries arrive by **email via Web3Forms** with the journey pre-tagged
  (form pre-selects the journey from the link the visitor clicked).
- Static HTML on Cloudflare Pages: no WordPress updates, no plugins, no security patches,
  free hosting, and anyone on the team can edit text in a file and redeploy.

---

## 3. The flagship product (as specified)

**Greenland by Sea & Arctic Iceland** — 14 days, Nuuk (2–3d) → Amarok overnight coastal
voyage → Qaqortoq (3n) → Tasermiut Camp (2n) → flight to Iceland → Akureyri (3n).

| Departure | Dates | Guests | Price |
|---|---|---|---|
| Expedition I | 12–25 Aug 2027 | max 12 | $8,495 pp |
| Expedition II | 19 Aug–1 Sep 2027 | max 12 | $8,495 pp |

Marketed as an annual event: **"Only two departures each summer — 24 places."**
Deposit $1,000 via Stripe (refundable 30 days), balance 120 days out. At target cost
($4,000–4,800/guest) a sold-out year grosses ~$204k with ~$3,200–4,000 margin per guest.

---

## 4. Launch checklist (in order)

**Before go-live**
- [ ] Confirm guesthouse facts on /stay/ (room count, rates approach, breakfast) — written
      conservatively pending Nik's confirmation
- [ ] Confirm flagship inclusions list & deposit/refund terms on the flagship + book pages
- [ ] Get Web3Forms access key (free, 2 min) → replace `YOUR-WEB3FORMS-ACCESS-KEY` in
      /book/ and /contact/ (send to nik@edgeofthearctic.travel)
- [ ] Create Stripe account → add `STRIPE_SECRET_KEY` env var in Cloudflare Pages
      (until then, deposit buttons gracefully fall back to the enquiry form)
- [ ] Drop real photos into `site/assets/img/` (list in site/README.md) — pull from
      eyrirestaurant.is, the .travel media library, and Nik's Greenland shots
- [ ] Deploy to Cloudflare Pages (steps in site/README.md)

**Domain decision (recommendation)**
Point **edgeofthearctic.travel** at the new site (it's the company's established domain,
in WeTravel, business cards, etc.). The **.is** domain belongs to the Norðurhjari
partnership context — clarify ownership with the partnership; if Nik controls it,
301-redirect it to the new site to capture its residual traffic; do NOT leave WP 5.4
running either way.

**On the old .travel WordPress (until DNS switches)**
- [ ] Delete/redirect the 9 dead WeTravel links (worst conversion leak)
- [ ] Replace the Lorem Ipsum FAQ answers and placeholder privacy-policy text

**After go-live**
- [ ] 301 map old .travel URLs → new pages (Cloudflare Bulk Redirects)
- [ ] Set up a Stripe webhook → email/sheet log of deposits (optional function stub ready)
- [ ] Add 2 WeTravel trips for the 2027 flagship departures as an alternative payment
      route (payment plans are a WeTravel strength for a $8.5k product)
- [ ] Google Business Profile: unify "Edge of the Arctic & Beyond" (Hjalteyri) — the only
      current listing is the old Þórshöfn attraction entry
- [ ] Update the eyrirestaurant.is "Experiences" placeholder page to link to the new
      /tours/ (closes the cross-sell loop from the restaurant's existing traffic)

---

## 5. Source material inventory

| Source | What it contributed |
|---|---|
| `~/Downloads/EdgeoftheArcticBrochure2019.pdf` | Norðurhjari regional brochure: brand look (slab wordmark, amber dashes, dark Arctic photography) + all /explore/ destination copy |
| edgeofthearctic.is audit | Confirmed regional-portal status, dead links, no booking path |
| edgeofthearctic.travel audit | Product catalogue, prices, live/dead WeTravel links, contact details, brand issues |
| eyrirestaurant.is | Restaurant facts: Tue–Sun 17:00–21:30, Dineout, +354 888 9604, Hjalteyri location, SCAN Magazine quote |
| WeTravel profile (langanes-ferdamannathjonusta) | Verified live trips, prices, deposits; company phone +354 862 9697; "founded 2014" |
| Your brief | Flagship expedition itinerary, dates, pricing strategy, scarcity positioning |
