# B4ES website — working notes for Claude

Several B4ES partners work on this site, each with their own Claude. This file
is the shared memory: read it first, and **update "Project state" and "Open
items" at the end of any session that changes them**, so the next person picks
up where you left off. Never put passwords, tokens or personal data here.

## Deployment: ship changes live directly

The owners have asked that finished changes go live without a separate
confirmation step. Pushing to `main` deploys to https://b4es.co.uk via
`.github/workflows/deploy.yml`.

For every change:

1. Work on the session's feature branch; run `npm run build` and
   `npm run check:links` locally and check the result visually.
2. Open a PR to `main`, wait for the **Build and verify** check to pass,
   then merge it.
3. Confirm the **Deploy to Cloudflare** run succeeds and the live site
   serves the change.

Never merge on a red check, and report back if a deploy fails. Start each
session by syncing your branch with `origin/main`: another partner may have
shipped since you last looked.

## Gotcha: no inline styles

The live CSP (`public/_headers`, `style-src 'self'`) makes browsers ignore
every `style="…"` attribute. Anything visual must come from a class in
`src/styles.css`. The capacity bars and time-zone strip broke this way (empty
bars on phones, fixed 26 Sep 2026; they now use `cap-w-*`, `cap-from-*`,
`cap-d-*`, `tz-*` classes). The local `npm run serve` sends no CSP, so it
will not show this class of bug; test with the CSP header or on the live site.

## Brand

Colours come from the brand-kit logo (Google Drive → B4ES-Brand-Kit) and live
as tokens in `src/styles.css` `@theme`; see the Design system section of
`README.md`. Keep text at WCAG AA contrast.

## Copy style

The site copy was put through the humanizer skill on 26 Sep 2026 so it does
not read as AI-written. Keep new copy the same way: British English, plain
statements, **no em or en dashes** in visible text (use commas, colons,
full stops, or "to" for ranges such as "09:00 to 17:30"), no "not X but Y"
contrasts used only for weight, no one-line closers, and none of "genuinely",
"quietly", "crucial", "robust", "delve", "seamless". Keep the brand line
"Market-leading quality. Materially better pricing. Your client stays yours."
as it is.

## Change requests

Requests come from the Google Sheet "B4ES Website changes" (tab `B4ES Web`,
columns Section / Status / User / Changes required, plus "Claude notes").
Read it with the Google Drive connector. Work the rows whose Status is not
"Launched"; ask the requester (named in User) if a request is ambiguous.

When `B4ES_SHEET_URL` and `B4ES_SHEET_SECRET` are set, update each row's
Status and add a note through `scripts/sheet-bridge.gs` (usage in README,
"Change-tracker sheet") once the change is live; otherwise give the requester
the exact text to paste. The Drive connector can read the sheet but cannot
edit cells.

## Accounts and access

- The partners share the Google account **b4es.admin@gmail.com**. It owns the
  Drive (brand kit, change sheet, LLP agreement) and is the GitHub-linked and
  enquiry-notification inbox.
- GitHub: `b4esadmin-creator/b4es-website`. Hosting: Cloudflare Workers
  static assets, with a small Worker for `/api/enquiry` and D1 database
  `b4es-enquiries` storing contact-form submissions.

## Project state (as of 26 Sep 2026)

- **Branding:** logo, favicon and theme come from the brand kit (PRs #5, #6).
  Palette: navy `#022454`, blue `#05527A`, teal `#087A95` (logo teal
  `#0A8AA3` deepened for AA), gold `#E1B76D`. Primary buttons: blue→teal
  gradient on light, gold on navy. Headings are still a serif; switching to a
  sans to match the logo wordmark has been offered, not decided.
- **Navigation** (PR #9): About Us · Why Us · Services · Strategic Partners ·
  Contact Us. There is no "Book a scoping call" button anywhere; CTAs say
  "Contact us". How we work, Engagement models, Security, Insights, FAQs,
  Careers and Sectors pages still exist, linked from Why Us / Services and
  the footer.
- **Pages keep scroll short:** related sections sit in in-page tabs via
  `tabs()` in `src/components.mjs` (deep links like `/why-us/#security`).
  Brand SVG illustrations `artGrowth`, `artNetwork`, `artShield` with CSS
  motion (About, Why Us, Strategic Partners hero).
- **Illustrations (26 Sep 2026, requested by Yawar):** partners agreed to
  add illustrations, still **no photos**. Made in Canva in the brand
  palette; source design "B4ES navy illustration canvas" in the shared Canva
  account (one page per image). WebP files in
  `public/assets/img/illustrations/` (`<name>-640/1120.webp` for navy
  scenes, `cat-<category>-480/800.webp` for white spots). Use
  `illoScene(name)` / `illoSpot(category)` from `src/components.mjs`.
  Scenes: Home, Services, For accountants, For business, How we work,
  Engagement models, Security, Careers, FAQs, Insights, Sectors and
  Contact heroes, and the Strategic Partners "How our partnerships work"
  section. The For business scene was regenerated with a £ coin. Spots: every service page hero (by category) and the Services
  category tabs. Motion is a slow CSS float, off under reduced motion.
  The home proposition card moved from the hero to a section just below it.
- **Home hero video (26 Sep 2026, Yawar):** the home illustration is replaced
  by Yawar's 46 s video (WhatsApp MP4, its own soundtrack), cropped of 8 px
  side bars to 832×468 and re-encoded: `public/assets/video/b4es-loop.mp4`
  (H.264), `.webm` (VP9) fallback, `b4es-loop-poster.webp`; `heroVideo()`
  in `src/components.mjs`. It uses the London photo and the original line
  "Your fee earners are spending 62%…", both Yawar's explicit choice after
  the photo-licence and advertising-claim risks were flagged. Autoplays
  muted; reduced motion keeps
  it paused with controls. Layout after pwc.com (Yawar's choice): a
  full-width band above the hero (`videoBand()` in `src/components.mjs`),
  nothing overlaid because the video has its own headlines; hero copy and
  buttons follow below. Small Pause (WCAG 2.2.2) and Sound buttons top-right.
  The source is only 832 px wide, so full-width it looks soft on desktop;
  replace the files with a 1920×1080 export when one is available.
- **Strategic Partners:** one partner (theBPO, Karachi, est. 2014), but the
  site must **not name or link to it** (Yawar, 26 Sep 2026). It is described
  as "our delivery partner" / "A specialist accounting, tax and advisory
  firm" (`PARTNER.label`, `PARTNER.descriptor` in `src/data/site.mjs`), with
  its facts (2014, Karachi HQ, 5 countries, service lines) kept. A "Quality
  first" section on `/strategic-partners/#quality` says B4ES takes part
  directly in partners' recruitment, training and quality, and that quality
  is every partner's first priority. Add partners via `PARTNERS`.
- **SEO (26 Sep 2026):** home title is brand-first ("Better 4 Enterprise
  Solutions (B4ES) | …", used as given by `layout.mjs`); titles that already
  contain "B4ES" get no "| B4ES" suffix. Home JSON-LD is one `@graph`:
  ProfessionalService (alternateName B4ES / Better 4 / Better 4 Enterprise
  Solutions LLP, legalName, logo, registered address) plus WebSite (drives
  the site name Google shows). Every page has `og:image`
  (`public/assets/img/og-b4es.png`, 1200×630). Sitemap has `lastmod`.
  At that date Google had not indexed the site at all.
- **Contact details:** site email `info@b4es.co.uk`. Registered office
  41 Woodside Close, Grays, RM16 2DN (from the LLP Members' Agreement,
  25 Sep 2026), shown on Contact and in the privacy notice. Offices live in
  `SITE.offices`; one with no address lines is hidden.
- **Contact form:** every enquiry is saved in D1. Email notifications go to
  `b4es.admin@gmail.com` (`wrangler.jsonc`), but only start sending once
  Cloudflare Email Routing is enabled and that address verified; until then
  rows are stored with `notified = 0`.

## Open items

- **Second office address**: not yet provided. Add it to `SITE.offices`.
- **Registered office is a member's home address**: flagged to the partners
  (agreement clause 2.2 requires that member's informed agreement). Swap in a
  virtual office address if they provide one.
- **Business email (info@b4es.co.uk)**: undecided. Options discussed:
  Cloudflare Email Routing (forward to Gmail) plus Cloudflare Email Sending
  via Gmail "Send mail as"; Purelymail; Zoho Mail EU (a Zoho account hit a
  data-centre restriction); Google Workspace. Recommended: Zoho EU or
  Workspace. Only one provider can own the MX records. If it isn't
  Cloudflare Email Routing, the contact-form notification must be switched
  to that provider's SMTP or Resend. There are currently no MX records.
- **Sheet bridge**: `scripts/sheet-bridge.gs` is written and a copy is in
  Drive ("B4ES sheet bridge script (paste into Apps Script)"). The partners
  are deploying it; afterwards `B4ES_SHEET_URL` and `B4ES_SHEET_SECRET` must
  be added to each Claude environment that should update the sheet.
- **Abacus.AI**: partners may use it via GitHub. Do **not** point
  b4es.co.uk DNS at Abacus (it asked for A records → 66.71.220.1); that
  would take the live site and contact form off Cloudflare. Test on a
  subdomain first if hosting there is ever wanted.
- **Illustrations**: every page now has one except About and Why Us (keep
  their SVGs), insight articles, legal pages and the 404 (plain by choice).
  No stats/counters for now (Yawar).
- **Stagger delays are ignored live**: the many `style="--d:…"` / `--i`
  attributes (reveal and SVG animation staggers) are blocked by the CSP, so
  items animate together rather than one after another. Cosmetic only;
  convert to classes if anyone wants the stagger back.
- **Capacity graphic** (home): the "Illustrative model" footnote was removed
  at Yawar's request (26 Sep 2026); the only caveat left is the
  "Illustrative example" label above the first bar. Keep that label: the
  figures are a model, not client data.
- **Hero video rights**: confirm B4ES may use its music and the London
  photo commercially (neither source is known) before promoting the site.
- **No-photos rule**: the hero video is the one exception (London photo,
  photo-style people on slide 2), at Yawar's request.
- **SEO steps only the partners can do** (b4es.admin@gmail.com):
  1. Google Search Console: add a Domain property for b4es.co.uk, verify with
     the DNS TXT record in Cloudflare DNS, submit
     https://b4es.co.uk/sitemap.xml, and use URL inspection → Request
     indexing on the home page. 2. Bing Webmaster Tools: import from Search
     Console. 3. Cloudflare → SSL/TLS → Edge Certificates → turn on "Always
     Use HTTPS" (http://b4es.co.uk currently serves 200 instead of
     redirecting). 4. Create the LinkedIn company page and Google Business
     Profile (service-area business, address hidden); then add the LinkedIn
     URL to `SITE.linkedin` and as `sameAs` in the home schema. 5. Get a few
     links to the site (Companies House listing once registered, partners'
     own LinkedIn profiles, directories).
- Placeholders still empty in `src/data/site.mjs`: phone, Companies House
  number, ICO reference, LinkedIn URL.
