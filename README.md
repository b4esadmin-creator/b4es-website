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
  assets/js/site.js   Mobile nav + contact-form fallback
  assets/img/         Favicon
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

`site.css`, `site.js` and the favicon are referenced with a `?v=<content-hash>`
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

### Attaching the custom domain

Once the Worker exists: **Workers & Pages → b4es-website → Settings → Domains &
Routes → Add custom domain.** Cloudflare creates the DNS record and issues the
certificate. Do apex and `www` separately, then add a Redirect Rule on the zone
sending one to the other so the site has a single canonical hostname.

Finally, set `baseUrl` in `src/data/site.mjs` to the live origin — it is what
canonical tags, Open Graph URLs and `sitemap.xml` are built from.

---

## Before this goes live

Search the codebase for `TODO` — everything needing a real value is marked.

**1. Replace placeholders in `src/data/site.mjs`**

| Field | Current | Needed |
|---|---|---|
| `domain` / `baseUrl` | `b4es.co.uk` | The live domain |
| `email`, `emailSales`, `emailCareers` | `@b4es.co.uk` | Live mailboxes |
| `phone` / `phoneHref` | `+44 (0)20 7946 0300` | **Real number.** This is in Ofcom's reserved fictional range, so it dials nobody |
| `address` | `TODO` | Registered office |
| `companyNumber` | `TODO` | Companies House number |
| `icoRef` | `TODO` | ICO registration reference |
| `linkedin` | placeholder | Real profile URL |

**2. Connect the contact form.** `src/pages/support.mjs` has a `TODO` block above
the form. Set its `action` to your handler (Formspree, Netlify Forms, a Worker,
your own API). Until then, `public/assets/js/site.js` composes a pre-filled email
in the visitor's mail client — functional, but nothing is captured or tracked.

If the handler is on another origin, add it to `form-action` in `public/_headers`
or the CSP will block the submission.

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

Defined once in `src/styles.css` under `@theme`.

- **Ink** `#08161f` — near-black petrol, used for dark bands and headings
- **Teal** `#0e9384` — primary accent
- **Gold** `#b8894a` — secondary accent, used sparingly for caution and contrast
- **Bone** `#f8f6f1` — warm alternate section background
- **Display type** Source Serif 4 · **Body type** Inter (both via Google Fonts)

Component classes (`.card`, `.btn-primary`, `.check-list`, `.acc`, …) keep the
generated markup semantic rather than a wall of utilities.
