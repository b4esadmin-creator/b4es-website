# B4ES — Better 4 Enterprise Solutions

Marketing website for B4ES: UK-facing outsourced accounting, tax, payroll, audit
support and back-office delivery for accountancy practices and growing businesses.

**35 static pages.** No framework, no runtime dependencies, no database. Plain HTML
and one CSS file that any static host will serve.

---

## Quick start

```bash
npm install        # installs Tailwind CLI only (build-time)
npm run build      # builds CSS + all 35 HTML pages
npm run serve      # preview at http://localhost:4173
```

Working on styles? `npm run watch:css` in one terminal, `node build.mjs` when you
change content.

---

## How it is built

Content lives in JavaScript modules under `src/`. A ~100-line zero-dependency
builder composes them into static HTML at the repository root.

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
build.mjs             The builder
```

Generated output (root-level `index.html`, `services/`, `about/`, …, plus
`sitemap.xml`, `robots.txt`, `404.html`) is committed so the site can be deployed
with no build step.

### Adding a service

Append an entry to `SERVICES` in `src/data/services.mjs` and run `npm run build`.
The service page, navigation entry, category grouping, services index card and
sitemap entry are all generated from that one object.

### Adding an article

Append to `ARTICLES` in `src/pages/insights.mjs`. Same deal.

---

## Before this goes live

Search the codebase for `TODO` — everything needing a real value is marked.

**1. Replace placeholders in `src/data/site.mjs`**

| Field | Current | Needed |
|---|---|---|
| `domain` / `baseUrl` | `b4es.co.uk` | Confirm the live domain |
| `email`, `emailSales`, `emailCareers` | `@b4es.co.uk` | Live mailboxes |
| `phone` / `phoneHref` | `+44 (0)20 7946 0300` | **Real number.** This is in Ofcom's reserved fictional range, so it dials nobody |
| `address` | `TODO` | Registered office |
| `companyNumber` | `TODO` | Companies House number |
| `icoRef` | `TODO` | ICO registration reference |
| `linkedin` | placeholder | Real profile URL |

**2. Connect the contact form.** `src/pages/support.mjs` contains the form with a
`TODO` block above it. Set the `action` attribute to your handler (Formspree,
Netlify Forms, a Cloudflare Pages Function, your own API) and delete the mailto
fallback script at the bottom of that file. Until then the form opens a
pre-filled email in the visitor's mail client — functional, but nothing is tracked.

**3. Confirm the security page claims.** `/security/` contains a status table
listing certifications as roadmap items rather than as held. That is deliberate
and honest for a new venture. Update each row as status changes — and do not list
anything there before it is actually held.

**4. Have the legal pages reviewed.** `/privacy/`, `/terms/` and `/cookies/` are
drafted as a starting point, not as legal advice. A UK-qualified adviser should
review them. The cookie notice states that no tracking cookies are set — if you
add analytics or a chat widget, that page must be updated and a consent mechanism
implemented before any non-essential cookie is set (PECR requires consent first).

**5. Add leadership.** `src/pages/company.mjs` exports an empty `LEADERSHIP`
array. Populate it with `{ name, role, bio }` objects and the About page renders
a leadership grid automatically; while it is empty, an editorial paragraph shows
instead.

**6. Testimonials and case studies.** There are none, deliberately — B4ES has no
UK track record to point at yet, and inventing one would be both dishonest and
easy to catch. The site argues from the paid pilot instead. Add real ones as they
arrive.

---

## Deployment

The site is plain static files. Any of these work with no configuration:

- **GitHub Pages** — serve from the repository root. `.nojekyll` is generated so
  Pages does not run Jekyll over the output. Add a `CNAME` file for a custom domain.
- **Cloudflare Pages / Netlify / Vercel** — build command `npm run build`, output
  directory `.` (root).
- **Any web server** — copy the repository (minus `node_modules/` and `src/`) to
  the document root.

Set `404.html` as the error page where your host supports it.

---

## Content and factual claims

Market claims on the site are drawn from public sources and are accurate as at
August 2026. They will age — review them annually:

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
- **Gold** `#b8894a` — secondary accent, used sparingly for caution/contrast
- **Bone** `#f8f6f1` — warm alternate section background
- **Display type** Source Serif 4 · **Body type** Inter (both via Google Fonts)

Component classes (`.card`, `.btn-primary`, `.check-list`, `.acc`, …) keep the
generated markup semantic rather than a wall of utilities.
