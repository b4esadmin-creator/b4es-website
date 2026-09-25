# B4ES — Better 4 Enterprise Solutions

Marketing website for B4ES: UK-facing outsourced accounting, tax, payroll, audit
support and back-office delivery for accountancy practices and growing businesses.

**35 static pages.** No framework, no client-side routing, no database. Plain HTML
and one stylesheet, deployed to Cloudflare Workers static assets.

---

## Quick start

```bash
npm install
npm run build      # builds the whole site into dist/
npm run serve      # preview dist/ at http://localhost:4173
npm run dev        # build + serve
```

Other scripts:

```bash
npm run check:links   # verifies every internal link in dist/ resolves
npm run deploy        # build + wrangler deploy (needs Cloudflare credentials)
```

---

## How it is built

Content lives in JavaScript modules under `src/`. A zero-dependency Node builder
composes them into static HTML in `dist/`.

```
src/
  data/
    site.mjs          Global config: contact details, nav, footer, sectors, software
    services.mjs      All 14 service definitions — the bulk of the site's content
  pages/
    index.mjs         Page registry — add new pages here
    home.mjs          Homepage
    serviceDetail.mjs Template that generates all 14 service pages
    catalogue.mjs     Services index, for-accountants, for-business, sectors
    company.mjs       About, how we work, engagement models, security, careers
    support.mjs       Contact, FAQs
    insights.mjs      Insights hub + 4 articles
    legal.mjs         Privacy, terms, cookies
    notFound.mjs      404
  layout.mjs          Page shell: <head>, nav with mega menus, footer
  components.mjs      Reusable sections: hero, cards, steps, accordion, CTA bands
  icons.mjs           Inline SVG icon set
  styles.css          Tailwind v4 source + design tokens + component classes

public/               Copied verbatim into dist/
  assets/js/head.js   Sets .js-ready before paint (render-blocking, ~600 bytes)
  assets/js/site.js   Mobile nav, scroll motion engine, contact form
  assets/img/         Brand-kit logo (colour + white), favicon, apple-touch-icon
  _headers            Security headers and caching rules
  _redirects          URL redirects

scripts/
  check-links.mjs     Internal link checker (runs in CI)

build.mjs             The builder
dist/                 Build output — generated, git-ignored, never edited by hand
```

`build.mjs` clears `dist/`, copies `public/`, compiles Tailwind, renders every
page, then writes `sitemap.xml` and `robots.txt`. It touches nothing outside
`dist/`.

The build is **deterministic** — building twice produces byte-identical output.

### Adding a service

Append an entry to `SERVICES` in `src/data/services.mjs` and run `npm run build`.
The service page, navigation entry, category grouping, index card and sitemap
entry are all generated from that one object.

### Adding an article

Append to `ARTICLES` in `src/pages/insights.mjs`. Same deal.

### Asset caching

`site.css`, `site.js`, the logos and the favicon are referenced with a `?v=<content-hash>`
query string computed at build time. That lets `_headers` cache everything under
`/assets/*` as `immutable` for a year while still updating the instant the bytes
change. Do not remove the hashing without also relaxing that cache rule.

---

## Deployment (Cloudflare)

The site deploys to **Cloudflare Workers static assets** (`wrangler.jsonc`).
There is no Worker script — it is assets only.

### Option A — GitHub Actions (recommended)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

Add two repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → right-hand sidebar |

Scope the token to the minimum: Account → *Workers Scripts: Edit*, and
Zone → *Workers Routes: Edit* on the site's zone only.

### Option B — Workers Builds (no secrets)

Cloudflare dashboard → **Workers & Pages → Create → Connect to Git**, pick this
repository, then set:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

Cloudflare builds and deploys on push. If you use this, delete
`.github/workflows/deploy.yml` so the two do not deploy over each other.

### The custom domain

`b4es.co.uk` and `www.b4es.co.uk` are already declared as custom domains in
`wrangler.jsonc`. Cloudflare creates the DNS records and issues certificates on
the first successful deploy, provided the zone is in the same Cloudflare account
as the API token.

The apex is canonical — `baseUrl` in `src/data/site.mjs` drives canonical tags,
Open Graph URLs and `sitemap.xml`. Add a zone **Redirect Rule** sending
`www` → apex so only one hostname actually serves content; it runs at the edge,
before the Worker.

If the zone is not yet in the account, delete the `routes` block from
`wrangler.jsonc`, deploy to the `*.workers.dev` subdomain, and attach the domain
afterwards from Workers & Pages → b4es-website → Settings → Domains & Routes.

---

## Before this goes live

Search the codebase for `TODO` — everything needing a real value is marked.

**1. Replace placeholders in `src/data/site.mjs`**

Unknown values are left **empty**, never filled with a plausible stand-in, and
every template hides the corresponding element while a value is blank. Fill one
in and it appears automatically — no template edits required.

| Field | Current | Effect while empty |
|---|---|---|
| `domain` / `baseUrl` | `b4es.co.uk` ✅ | — |
| `email`, `emailSales`, `emailCareers` | `@b4es.co.uk` | Verify these mailboxes exist and are monitored |
| `phone` / `phoneHref` | *empty* | Telephone row hidden in header, footer, contact page and JSON-LD |
| `address` | *empty* | "Registered office" sentence omitted from the privacy notice |
| `companyNumber` | *empty* | "Registered in England and Wales" omitted from privacy and terms |
| `icoRef` | *empty* | ICO registration paragraph omitted from the privacy notice |
| `linkedin` | placeholder | Footer link points nowhere useful — update or remove |

The phone number was deliberately emptied rather than left as a placeholder: an
invented number is a false statement on a site whose whole pitch is candour.

**2. Enable Email Routing so enquiry notifications send.** The contact form is
live and every submission is already stored in D1 — see **Contact form** below —
but the notification email needs a one-time setup:

1. Cloudflare dashboard → **Compute → Email Service → Email Routing** → enable it
   on `b4es.co.uk`.
2. Add and verify `b4es.admin@gmail.com` as a **destination address**, and route
   `info@b4es.co.uk` to it.
3. That address must match `send_email[0].destination_address` and
   `vars.ENQUIRY_TO` in `wrangler.jsonc` (both `b4es.admin@gmail.com` today). A
   routed `@b4es.co.uk` address cannot be a verified destination.

Until that is done the Worker stores each enquiry and records `notified = 0`
against the row, so nothing is lost. Sending to a verified destination address is
free on every Cloudflare plan.

**3. Confirm the security page claims.** `/security/` lists ISO 27001, Cyber
Essentials and ICO registration as roadmap items rather than as held. That is
deliberate and honest for a new venture. Update each row as status changes — and
do not list anything there before it is actually true.

**4. Have the legal pages reviewed.** `/privacy/`, `/terms/` and `/cookies/` are
drafted as a starting point, not as legal advice. A UK-qualified adviser should
review them. The cookie notice states that no tracking cookies are set — if you
add analytics or a chat widget, update that page and implement a consent
mechanism *before* any non-essential cookie is set (PECR requires consent first).

**5. Add leadership.** `src/pages/company.mjs` exports an empty `LEADERSHIP`
array. Populate it with `{ name, role, bio }` objects and the About page renders
a leadership grid; while it is empty, an editorial paragraph shows instead.

**6. Testimonials and case studies.** There are none, deliberately — B4ES has no
UK track record to point at yet, and inventing one would be both dishonest and
easy to catch. The site argues from the paid pilot instead. Add real ones as they
arrive.

---

## Build-time output cleaning

HTML comments are stripped from `dist/`. Source files carry developer notes —
TODOs, review warnings, guidance on wiring the contact form — which are useful
in the repo and actively unhelpful in view-source on a live commercial site.
Write notes freely in `src/`; they never reach production.

---

## Contact form

`POST /api/enquiry`, handled by `worker/index.js`. The Worker runs **only** for
`/api/*` (`run_worker_first` in `wrangler.jsonc`) — all 36 pages are still served
straight from the asset store without invoking Worker code.

**D1 is the source of truth.** The row is written *before* any notification is
attempted, so an email outage cannot lose an enquiry — it just leaves
`notified = 0`, which is queryable and replayable.

Protections, all verified end to end:

| Concern | Handling |
|---|---|
| Spam bots | Off-screen honeypot field, plus rejection of submissions completed in under 3s. Both return success so a bot gets no signal to adapt. |
| Flooding | 5 submissions per IP per hour, counted from the same table — no extra store to provision |
| Privacy | IP is stored only as a salted SHA-256 hash, never raw |
| Header injection | Control characters stripped from every field; `Reply-To` uses the bare address, never an attacker-controlled display name |
| Cross-site posting | Cross-origin submissions rejected |
| No JavaScript | Plain form POST works and redirects to `/thank-you/` |

Reading enquiries:

```bash
npx wrangler d1 execute b4es-enquiries --remote \
  --command "SELECT id, created_at, name, company, email, service, notified FROM enquiries ORDER BY id DESC LIMIT 20"
```

Anything with `notified = 0` reached the database but not the inbox — check
`notify_error` on the row.

Set a real `IP_SALT` secret before relying on the hash being unguessable:

```bash
npx wrangler secret put IP_SALT
```

---

## Motion

Scroll animations are in `src/styles.css` (the Motion layer) and the motion
engine in `public/assets/js/site.js`. The vocabulary is deliberate rather than
decorative — it mirrors what B4ES does:

- **Capacity transfer** (`capacityTransfer()`) — the signature piece on the
  homepage. Two bars show the same team's week before and after processing moves
  out, with segment widths animating between the two states, plus a hatched lane
  showing what B4ES absorbed. Figures are an illustrative model and are labelled
  as such on the page.
- **Overnight advantage** (`timezoneStrip()`) — a 24-hour band showing the two
  working days offset by five hours, with the live overlap highlighted.
- **The process draws as you scroll** — the connector line on the five-stage
  list fills with scroll position and each step marker lights as you reach it.
- **Scroll progress rail** in the sticky header, and slow parallax drift on the
  ambient gradients in dark bands.

Three rules hold it together:

1. **Visible by default.** Every hidden start state is scoped under `.js-ready`,
   set by `head.js` before first paint. If JavaScript fails, nothing is hidden.
2. **Reduced motion is honoured twice** — `head.js` never adds `.js-ready`, and
   the stylesheet force-resets every animated property under the media query. No
   reader who asked for less motion gets any.
3. **Reveals use a drain-list sweep, not IntersectionObserver.** IO only reports
   elements intersecting when it samples, so a fast flick or an anchor jump can
   carry an element past the viewport with no callback — leaving it invisible
   permanently. A sweep over a shrinking pending list is correct at any scroll
   speed and costs nothing once drained. **Do not "optimise" this back to IO.**

Counters keep their true value in `aria-label` before the visible text is zeroed,
so assistive tech never announces a count-up as 0.

---

## Security headers

`public/_headers` ships a strict Content-Security-Policy. The site has **no
inline scripts and no inline styles**, so `script-src` and `style-src` stay
strict — worth preserving. If a third-party snippet demands `'unsafe-inline'`,
use its nonce or hash option, or proxy it first-party, rather than weakening the
policy.

HSTS is set with `includeSubDomains` but deliberately without `preload`, which is
very hard to reverse. Only add `preload` once every subdomain is confirmed
HTTPS-only.

---

## Content and factual claims

Market claims are drawn from public sources and are accurate as at August 2026.
They will age — review annually:

- ~780,000 taxpayers entered MTD for Income Tax from April 2026 (HMRC figures);
  threshold falls to £30,000 in 2027 and £20,000 in 2028
- Employer National Insurance at 15%, secondary threshold £5,000 (from April 2025)
- Companies House software-only accounts filing and removal of abridged accounts
  confirmed for April 2028 after the earlier 2027 target was deferred
- UK practice capacity constraints per Accountancy Today Q2 2026 sector analysis

The service catalogue mirrors the capability of the delivery partner
(thebpo.net, established 2014) mapped onto UK terminology, standards and
compliance obligations.

---

## Design system

Defined once in `src/styles.css` under `@theme`. The palette is taken from the
brand-kit logo (navy `#022454`, blue `#05527A`, teal `#0A8AA3`, gold `#E1B76D`).

- **Ink** `#022454` — logo navy, used for dark bands and headings
- **Teal** `#087A95` — primary accent; the logo teal deepened a touch so text
  and white-on-teal buttons pass WCAG AA. Exact logo teal is `brand-teal`.
- **Teal dark** `#05527A` — logo blue; hovers, icon tiles, gradient start
- **Gold** `#E1B76D` — logo gold; the primary button on navy bands, progress
  rail and callouts. Use `gold-deep` `#86621F` for gold text on light surfaces.
- **Bone** `#f5f7fa` — cool alternate section background
- Primary buttons use the logo's arrow gradient (blue → teal) on light
  surfaces and solid gold on navy. Inside `.band-dark` the `slate-mid` token is
  lifted so secondary text stays AA on navy.
- **Display type** Source Serif 4 · **Body type** Inter (both via Google Fonts)

Component classes (`.card`, `.btn-primary`, `.check-list`, `.acc`, …) keep the
generated markup semantic rather than a wall of utilities.
