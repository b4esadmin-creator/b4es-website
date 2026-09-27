# B4ES Ledger

Private double-entry bookkeeping for the B4ES partners, served at
https://ledger.b4es.co.uk behind Cloudflare Access. Decisions and roadmap are
in the "Ledger app" section of the root `CLAUDE.md`.

## Layout

| Path | What it is |
| --- | --- |
| `wrangler.jsonc` | Worker `b4es-ledger`, D1 binding `DB`, custom domain, Access settings |
| `migrations/` | D1 schema and the integrity triggers (balanced entries, immutable posted entries, four-eyes approval, locked years, append-only audit) |
| `src/index.js` | Worker: Access check, JSON API under `/api`, security headers |
| `src/auth.js` | Verifies the `Cf-Access-Jwt-Assertion` token against the team's keys |
| `src/coa.js` | UK chart of accounts templates (LLP and limited company) |
| `src/reports.js` | Trial balance, P&L, balance sheet, cash flow (pure functions) |
| `public/` | The app: `index.html`, `app.js` (no framework, CSP-safe), `app.css`, PWA manifest, service worker, icons |
| `cli/ledger.mjs` | Command line used by Claude Code: read accounts and entries, send proposals |
| `test/` | `reports.test.mjs` (node:test) and `triggers.sh` (database rules on a local D1) |

Money is always integer pence. Posted entries are corrected by reversal,
never edited.

## Claude proposals

Claude reads the books and sends entries for approval through
`cli/ledger.mjs`, following `.claude/skills/ledger-entries/SKILL.md`. It signs
in with a Cloudflare Access service token:

1. Zero Trust, Access controls, Service credentials: create a service token
   "B4ES Ledger - Claude". Copy the Client ID and Client Secret (the secret is
   shown once).
2. On the ledger's Access application add a policy with action **Service
   Auth**, including that service token.
3. Put the Client ID in `AGENT_CLIENT_IDS` in `wrangler.jsonc` (PR).
4. Each partner who wants Claude to propose entries adds `LEDGER_CLIENT_ID` and
   `LEDGER_CLIENT_SECRET` as environment variables in their Claude
   environment. Check with `node apps/ledger/cli/ledger.mjs check`.

Locally, `--var DEV_AGENT:test.access --var AGENT_CLIENT_IDS:test.access`
makes every localhost request act as Claude (with any values for the two
environment variables and `LEDGER_URL=http://127.0.0.1:8799`).

## Run it locally

From the repository root:

```sh
S=.ledger-state   # any scratch folder, not committed
npx wrangler d1 migrations apply b4es-ledger --local --persist-to $S -c apps/ledger/wrangler.jsonc
npx wrangler dev -c apps/ledger/wrangler.jsonc --local --persist-to $S \
  --ip 127.0.0.1 --port 8799 --local-upstream 127.0.0.1:8799 \
  --var DEV_EMAIL:you@example.com
```

Open http://127.0.0.1:8799. `DEV_EMAIL` signs you in without Access, but only
on localhost; `--local-upstream` keeps the host as localhost (otherwise
wrangler uses the production hostname and the ledger shows "set-up pending").
Restart with a different `DEV_EMAIL` to act as a second partner and test
approvals.

## Tests

```sh
node --test apps/ledger/test/reports.test.mjs
bash apps/ledger/test/triggers.sh
```

## Deploy

Merging to `main` runs `.github/workflows/ledger-deploy.yml`: tests, remote
migrations, then `wrangler deploy`. Never deploy by hand. Until the real
database id is in `wrangler.jsonc` the workflow skips the deploy.

Going live needs, once, in the Cloudflare dashboard: a Zero Trust
self-hosted Access application for `ledger.b4es.co.uk` (One-time PIN, each
partner's email in the Allow policy). Put its team domain
(`https://<team>.cloudflareaccess.com`) and AUD tag into `TEAM_DOMAIN` and
`POLICY_AUD` in `wrangler.jsonc`. These are identifiers, not secrets.
