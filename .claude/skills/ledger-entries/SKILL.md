---
name: ledger-entries
description: Turn plain-English descriptions of B4ES transactions (expenses, invoices, receipts, payments, capital, drawings, transfers) into double-entry proposals and send them to the B4ES Ledger approval queue. Use when a partner asks to record, book, enter, log or post a transaction in the ledger or the books, or asks what is in the ledger.
---

# B4ES Ledger: proposing entries from plain English

Claude can **read** the ledger and **send entries for approval**. It can never
post, approve, reject, edit or delete; the ledger enforces this for Claude's
service token, in the Worker and in the database. A partner approves each
proposal in the app at https://ledger.b4es.co.uk (Approvals tab).

Tool: `node apps/ledger/cli/ledger.mjs <command>` from the repository root.
Commands: `check`, `entities`, `accounts`, `contacts`, `journals`, `show ID`,
`propose FILE.json [--dry-run]`. Details are at the top of that file.

## Setup check (first, every session)

Run `node apps/ledger/cli/ledger.mjs check`.

- "LEDGER_CLIENT_ID and LEDGER_CLIENT_SECRET must be set": the partner has to
  add them as environment variables in their Claude environment settings
  (Claude Code on the web: the environment's settings; locally: their shell
  profile). The values come from the Cloudflare Access service token "B4ES
  Ledger - Claude". Never ask them to paste the secret into the chat, and
  never write it to a file or commit.
- "Access refused the service token": the ID or secret is wrong, or the
  ledger's Access application lacks the Service Auth policy for the token.
- "This service token is not allowed": its Client ID is not in
  `AGENT_CLIENT_IDS` in `apps/ledger/wrangler.jsonc`. Adding it is a normal
  PR (the Client ID is not a secret).

## Workflow

1. `accounts` to load the **live** chart of accounts. Use its codes; partners
   may have added or renamed accounts. Run `contacts` if the transaction names
   a customer or supplier.
2. For each transaction, work out: date, amount in GBP, what it was for, how
   it was paid (which bank or cash account, or not yet paid), and who with.
   If something that changes the entry is missing or ambiguous, ask **one**
   short question rather than guess. "Today" and "yesterday" mean real dates;
   write them out.
3. Check consistency: `journals --q <supplier or keyword>` finds earlier
   entries of the same kind. Use the same accounts as before unless the
   partner says otherwise, and mention if an amount is well out of line with
   earlier ones.
4. Show the partner the proposed entry before sending:

   | Date | Description | Debit | Credit | Amount |
   | --- | --- | --- | --- | --- |
   | 2026-09-26 | Xero subscription, September | 6200 Software and subscriptions | 1200 Business current account | £30.00 |

   Add one line on any assumption (for example "treated as paid from the
   current account").
5. Run the checklist below, write the proposal JSON to a scratch file (not
   in the repo) and run `propose FILE --dry-run`. If it lists possible duplicates, show them and
   ask before sending.
6. Send it with `propose FILE` once the partner confirms (or straight away if
   they already said to go ahead). Put the requesting partner's name in
   `requested_by`, for example "Faisal via Claude Code". Add `approver` only if
   the partner names someone.
7. Report back with the link it prints and say it is **awaiting approval**.
   Never say an entry is posted, booked or in the accounts until a partner has
   approved it (`show ID` tells you its status).

### Checklist before sending

- Debits equal credits (the CLI refuses otherwise).
- The date is the date of the transaction and not in a locked financial year.
- Every account code exists in the live chart and suits the transaction.
- The description says what, who with and which period, specifically enough
  for an accountant to understand it a year later ("Xero subscription,
  September 2026", not "software"). Put the invoice or receipt number in
  `reference`, and any calculation (for example "£1,200 annual policy / 12")
  in the line description.
- Treatment matches earlier entries of the same kind.
- Unusual amounts, round-sum estimates and anything touching members'
  capital or drawings are called out to the partner before sending.

One proposal per real-world transaction. For a batch (for example a list of
receipts), confirm the table for all of them once, then send each.

## Bookkeeping rules for B4ES LLP

Adapted in part from Anthropic's Finance plugin (journal-entry skill),
reworked for UK FRS 102 and B4ES.

B4ES is a UK LLP (FRS 102 section 1A), **not VAT registered** yet, year end
31 December. Amounts are in pounds and pence; the CLI converts them.

- **No VAT lines.** Record the gross amount paid. Do not use 2200 VAT control
  until the partners say B4ES is VAT registered (check `entities`: VAT yes/no).
- **Foreign currency:** use the sterling amount that left or reached the bank.
  If only a foreign amount is known, ask for the sterling figure.

Common entries (debit first):

| Transaction | Debit | Credit |
| --- | --- | --- |
| Member pays in capital | 1200 bank | 3000 Members' capital |
| Member takes money out (drawings, profit on account) | 3100 Members' drawings | 1200 bank |
| Expense paid from the bank or card | expense account | 1200 bank |
| Supplier bill received, not yet paid | expense account | 2100 Trade creditors |
| That bill paid | 2100 Trade creditors | 1200 bank |
| B4ES cost paid personally by a member, to be repaid | expense account | 2300 Other creditors |
| Same, but the member agrees it counts as capital | expense account | 3000 Members' capital |
| Invoice issued to a client, not yet paid | 1100 Trade debtors | 4000 to 4040 income |
| Client pays that invoice | 1200 bank | 1100 Trade debtors |
| Client pays with no invoice raised first | 1200 bank | income account |
| Money moved between B4ES accounts | receiving account | paying account |
| Bank interest received | 1200 bank | 4900 Bank interest received |

Choosing the account:

- LLP members are not employees. Payments to members are **drawings (3100)**,
  never salaries (6000). Profit shares are allocated at the year end, not
  booked as expenses.
- Income: 4000 accounting and bookkeeping, 4010 tax compliance, 4020 payroll,
  4030 advisory and consulting, 4040 IT and software services, 4090 other.
- Delivery partner and subcontractor work (for example theBPO) is 5000; software
  used to deliver client work is 5010. Internal software is 6200.
- Formation, Companies House and filing fees: 6330. Accountant and solicitor
  fees: 6300. Insurance: 6310. AML supervision and professional bodies: 6320.
  Website and marketing: 6400. Bank charges: 6600.
- Equipment the business will use for more than a year and that is not
  trivial in cost (as a guide over £500, or if the partner says so) is a fixed
  asset (0010 office equipment, 0020 computer equipment), not an expense. Ask
  if unsure. Depreciation is a year-end journal; do not propose it unless
  asked.
- Use **9998 Suspense** only when the partner cannot say what a payment was
  for, and say clearly that it needs sorting before the year is locked.

### Year-end and period-end adjustments

Propose these only when a partner asks (usually when closing the year). Show
the calculation in the line descriptions.

| Adjustment | Debit | Credit | Reverse? |
| --- | --- | --- | --- |
| Cost incurred, no invoice yet (accrual) | expense account | 2110 Accruals and deferred income | Yes, on the first day of the next year |
| Cost paid in advance for a later period (prepayment) | 1120 Prepayments and accrued income | expense account | Yes, on the first day of the next year |
| Work done, not yet invoiced (accrued income) | 1120 Prepayments and accrued income | income account | Yes, on the first day of the next year |
| Invoiced or paid for work not yet done (deferred income) | income account | 2110 Accruals and deferred income | Yes, on the first day of the next year |
| Depreciation, straight line (cost / useful life, time-apportioned) | 6900 Depreciation | 0011 or 0021 accumulated depreciation | No |
| Amortisation of software and website | 6910 Amortisation | 0031 accumulated amortisation | No |

The ledger has no automatic reversal. For each adjustment marked "Yes",
propose the reversal as a separate entry dated the first day of the next
year (same lines, debits and credits swapped, description starting
"Reversal of year-end accrual: ..."), and tell the partner both are in the
queue. Small items (as a guide under £100) can be left unadjusted; say so
rather than propose them.

If a request would reverse or correct a posted entry, explain that partners do
that in the app with "Reverse this entry" followed by a corrected entry.
Claude can propose the corrected entry.

## Reading the books

`journals --status pending` lists what is waiting for approval; `journals
--q text` searches; `accounts` shows balances. For reports (P&L, balance
sheet, cash flow) point the partner to the Reports tab, or summarise from
`accounts` balances and say they are unaudited management figures.
