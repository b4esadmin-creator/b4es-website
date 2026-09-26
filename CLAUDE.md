# B4ES website — working notes for Claude

## Deployment: ship changes live directly

The owner has asked that finished changes go live without a separate
confirmation step. Pushing to `main` deploys to https://b4es.co.uk via
`.github/workflows/deploy.yml`.

For every change:

1. Work on the session's feature branch; run `npm run build` and
   `npm run check:links` locally and check the result visually.
2. Open a PR to `main`, wait for the **Build and verify** check to pass,
   then merge it.
3. Confirm the **Deploy to Cloudflare** run succeeds and the live site
   serves the change.

Never merge on a red check, and report back if a deploy fails.

## Brand

Colours come from the brand-kit logo (Google Drive → B4ES-Brand-Kit) and live
as tokens in `src/styles.css` `@theme`; see the Design system section of
`README.md`. Keep text at WCAG AA contrast.

## Change requests

Requests come from the Google Sheet "B4ES Website changes" (tab `B4ES Web`).
Read it with the Google Drive connector. When `B4ES_SHEET_URL` and
`B4ES_SHEET_SECRET` are set, update each row's Status and add a note through
`scripts/sheet-bridge.gs` (usage in README, "Change-tracker sheet") once the
change is live; otherwise give the owner the exact text to paste.
