// Unit tests for the statement derivations. Run: node --test apps/ledger/test/
import { test } from "node:test";
import assert from "node:assert/strict";
import { trialBalance, profitAndLoss, balanceSheet, cashFlow, fyStartFor, dayBefore } from "../src/reports.js";
import { chartTemplate } from "../src/coa.js";

// Accounts from the real LLP template, with ids.
const accounts = chartTemplate("llp").map((a, i) => ({ ...a, id: i + 1 }));
const id = (code) => accounts.find((a) => a.code === code).id;

// A year of B4ES LLP activity, in pence.
const journals = [
  // members pay in capital: 4 x £100
  [["1200", 40000, 0], ["3000", 0, 40000]],
  // invoice a client £1,000 (no VAT yet)
  [["1100", 100000, 0], ["4000", 0, 100000]],
  // client pays £600
  [["1200", 60000, 0], ["1100", 0, 60000]],
  // software subscription £200 paid
  [["6200", 20000, 0], ["1200", 0, 20000]],
  // buy a laptop £300
  [["0020", 30000, 0], ["1200", 0, 30000]],
  // depreciation £50
  [["6900", 5000, 0], ["0021", 0, 5000]],
  // members draw £100
  [["3100", 10000, 0], ["1200", 0, 10000]],
  // accrue £80 accountancy fee not yet paid
  [["6300", 8000, 0], ["2110", 0, 8000]],
];

function netOf(js) {
  const m = new Map();
  for (const lines of js) {
    const dr = lines.reduce((t, l) => t + l[1], 0);
    const cr = lines.reduce((t, l) => t + l[2], 0);
    assert.equal(dr, cr, "fixture journal must balance");
    for (const [code, d, c] of lines) m.set(id(code), (m.get(id(code)) || 0) + d - c);
  }
  return m;
}

const net = netOf(journals);

test("trial balance balances", () => {
  const tb = trialBalance(accounts, net);
  assert.equal(tb.balanced, true);
  assert.equal(tb.debit, tb.credit);
});

test("profit and loss", () => {
  const p = profitAndLoss(accounts, net, { legalForm: "llp" });
  assert.equal(p.sections.turnover.total, 100000);
  assert.equal(p.sections.admin_expenses.total, 20000 + 5000 + 8000);
  assert.equal(p.profit, 100000 - 33000);
  assert.equal(p.reconciles, true);
  assert.match(p.profitLabel, /members' remuneration/);
});

test("balance sheet balances with profit in reserves", () => {
  const profit = profitAndLoss(accounts, net).profit;
  const bs = balanceSheet(accounts, net, { profitCY: profit, profitPrior: 0, legalForm: "llp" });
  assert.equal(bs.balanced, true, `difference ${bs.difference}`);
  // cash: 400 + 600 - 200 - 300 - 100 = 400
  assert.equal(bs.current.find((g) => g.key === "cash").total, 40000);
  assert.equal(bs.current.find((g) => g.key === "debtors").total, 40000);
  assert.equal(bs.fixedTotal, 30000 - 5000);
  assert.equal(bs.crWithin.total, 8000);
  assert.equal(bs.netAssets, 40000 + 40000 + 25000 - 8000);
  assert.equal(bs.equity.capital.total, 40000);
  assert.equal(bs.equityLabel, "Members' other interests");
});

test("balance sheet splits prior and current year profit", () => {
  const bs = balanceSheet(accounts, net, { profitCY: 50000, profitPrior: 17000, legalForm: "llp" });
  assert.equal(bs.balanced, true);
  assert.ok(bs.equity.reserves.lines.some((l) => /brought forward/.test(l.name) && l.amount === 17000));
});

test("cash flow reconciles to the cash movement", () => {
  const profit = profitAndLoss(accounts, net).profit;
  const cf = cashFlow(accounts, net, { profit });
  assert.equal(cf.reconciles, true, `difference ${cf.difference}`);
  assert.equal(cf.cashMovement, 40000);
  // operating: profit 670 + depreciation 50 - debtors increase 400 + accruals 80 = 400
  assert.equal(cf.operatingTotal, 67000 + 5000 - 40000 + 8000);
  assert.equal(cf.investingTotal, -30000);
  assert.equal(cf.financingTotal, 40000 - 10000);
});

test("limited company template has share capital and tax", () => {
  const ltd = chartTemplate("ltd");
  assert.ok(ltd.some((a) => a.fs_line === "share_capital"));
  assert.ok(ltd.some((a) => a.fs_line === "tax"));
  assert.equal(new Set(ltd.map((a) => a.code)).size, ltd.length, "codes are unique");
});

test("financial year start", () => {
  assert.equal(fyStartFor("2026-09-26", 12, 31), "2026-01-01");
  assert.equal(fyStartFor("2026-12-31", 12, 31), "2026-01-01");
  assert.equal(fyStartFor("2027-01-01", 12, 31), "2027-01-01");
  assert.equal(fyStartFor("2026-04-05", 4, 5), "2025-04-06");
  assert.equal(fyStartFor("2026-04-06", 4, 5), "2026-04-06");
  assert.equal(fyStartFor("2025-03-15", 2, 29), "2025-03-01");
  assert.equal(dayBefore("2026-03-01"), "2026-02-28");
});
