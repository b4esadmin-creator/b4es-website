// Financial statements derived purely from posted journal lines. Nothing here
// is stored; every figure can be traced back to journals.
//
// Inputs are plain objects so these functions can be unit tested:
//   accounts: [{ id, code, name, type, subtype, fs_line, cf_class, is_bank }]
//   net:      Map(account_id -> debit_p - credit_p)  (for a period or as at a date)

export const PNL_LINES = [
  { key: "turnover", label: "Turnover", sign: -1 },
  { key: "cost_of_sales", label: "Cost of sales", sign: 1 },
  { key: "other_operating_income", label: "Other operating income", sign: -1 },
  { key: "admin_expenses", label: "Administrative expenses", sign: 1 },
  { key: "interest_receivable", label: "Interest receivable and similar income", sign: -1 },
  { key: "interest_payable", label: "Interest payable and similar expenses", sign: 1 },
  { key: "tax", label: "Tax on profit", sign: 1 },
];

export const BS_LINES = {
  intangible_assets: "Intangible assets",
  tangible_assets: "Tangible assets",
  stock: "Stocks",
  debtors: "Debtors",
  cash: "Cash at bank and in hand",
  creditors_within_one_year: "Creditors: amounts falling due within one year",
  creditors_after_one_year: "Creditors: amounts falling due after more than one year",
  members_capital: "Members' capital",
  share_capital: "Called up share capital",
  other_reserves: "Other reserves",
};

const isPnl = (a) => a.type === "income" || a.type === "expense";

function linesFor(accounts, net, filter, sign) {
  // sign: +1 shows debit balances positive, -1 shows credit balances positive
  return accounts
    .filter(filter)
    .map((a) => ({ id: a.id, code: a.code, name: a.name, amount: sign * (net.get(a.id) || 0) }))
    .filter((l) => l.amount !== 0);
}

function sum(lines) {
  return lines.reduce((t, l) => t + l.amount, 0);
}

/** Trial balance as at a date. */
export function trialBalance(accounts, net) {
  const rows = accounts
    .map((a) => {
      const n = net.get(a.id) || 0;
      return { id: a.id, code: a.code, name: a.name, type: a.type, debit: n > 0 ? n : 0, credit: n < 0 ? -n : 0 };
    })
    .filter((r) => r.debit || r.credit)
    .sort((x, y) => x.code.localeCompare(y.code));
  const debit = rows.reduce((t, r) => t + r.debit, 0);
  const credit = rows.reduce((t, r) => t + r.credit, 0);
  return { rows, debit, credit, balanced: debit === credit };
}

/** Profit and loss for a period. Amounts are presented positive. */
export function profitAndLoss(accounts, net, { legalForm = "llp" } = {}) {
  const pnlAccounts = accounts.filter(isPnl);
  const section = (key) => {
    const def = PNL_LINES.find((l) => l.key === key);
    const lines = linesFor(pnlAccounts, net, (a) => (a.fs_line || defaultPnlLine(a)) === key, def.sign);
    return { key, label: def.label, lines, total: sum(lines) };
  };
  const s = Object.fromEntries(PNL_LINES.map((l) => [l.key, section(l.key)]));
  const grossProfit = s.turnover.total - s.cost_of_sales.total;
  const operatingProfit = grossProfit + s.other_operating_income.total - s.admin_expenses.total;
  const profitBeforeTax = operatingProfit + s.interest_receivable.total - s.interest_payable.total;
  const profitAfterTax = profitBeforeTax - s.tax.total;
  // Cross-check: profit equals total income less total expenses.
  const direct = -pnlAccounts.reduce((t, a) => t + (net.get(a.id) || 0), 0);
  return {
    sections: s,
    grossProfit,
    operatingProfit,
    profitBeforeTax,
    profitAfterTax,
    profit: profitAfterTax,
    profitLabel:
      legalForm === "llp"
        ? "Profit for the financial year before members' remuneration and profit shares"
        : "Profit for the financial year",
    reconciles: direct === profitAfterTax,
  };
}

function defaultPnlLine(a) {
  return a.type === "income" ? "turnover" : "admin_expenses";
}

/**
 * Balance sheet as at a date.
 *   net:          balances as at the date (all history)
 *   profitCY:     profit for the current financial year to date
 *   profitPrior:  cumulative profit of all earlier years (retained, not yet
 *                 allocated to members or cleared by journals)
 */
export function balanceSheet(accounts, net, { profitCY = 0, profitPrior = 0, legalForm = "llp" } = {}) {
  const bs = accounts.filter((a) => !isPnl(a));
  const grp = (key, sign, types) => {
    const lines = linesFor(bs, net, (a) => types.includes(a.type) && (a.fs_line || defaultBsLine(a)) === key, sign);
    return { key, label: BS_LINES[key] || key, lines, total: sum(lines) };
  };
  const fixed = [grp("intangible_assets", 1, ["asset"]), grp("tangible_assets", 1, ["asset"])];
  const current = [grp("stock", 1, ["asset"]), grp("debtors", 1, ["asset"]), grp("cash", 1, ["asset"])];
  const crWithin = grp("creditors_within_one_year", -1, ["liability"]);
  const crAfter = grp("creditors_after_one_year", -1, ["liability"]);

  // Anything with an unknown line still has to show somewhere.
  const known = new Set(Object.keys(BS_LINES));
  const other = linesFor(bs, net, (a) => !known.has(a.fs_line || defaultBsLine(a)), 1);

  const fixedTotal = fixed.reduce((t, g) => t + g.total, 0);
  const currentTotal = current.reduce((t, g) => t + g.total, 0) + sum(other);
  const netCurrent = currentTotal - crWithin.total;
  const totalLessCurrent = fixedTotal + netCurrent;
  const netAssets = totalLessCurrent - crAfter.total;

  const capKey = legalForm === "ltd" ? "share_capital" : "members_capital";
  const capital = grp(capKey, -1, ["equity"]);
  const reservesAccounts = grp("other_reserves", -1, ["equity"]);
  const otherEquity = linesFor(
    bs,
    net,
    (a) => a.type === "equity" && ![capKey, "other_reserves"].includes(a.fs_line || "other_reserves"),
    -1
  );
  const retained = [
    { code: "", name: "Profit brought forward from earlier years", amount: profitPrior },
    { code: "", name: "Profit for the current year to date", amount: profitCY },
  ].filter((l) => l.amount !== 0);
  const reserves = {
    key: "other_reserves",
    label: legalForm === "ltd" ? "Profit and loss reserve and other reserves" : "Other reserves",
    lines: [...reservesAccounts.lines, ...otherEquity, ...retained],
  };
  reserves.total = sum(reserves.lines);
  const equityTotal = capital.total + reserves.total;

  return {
    fixed,
    fixedTotal,
    current,
    otherCurrent: other,
    currentTotal,
    crWithin,
    netCurrent,
    totalLessCurrent,
    crAfter,
    netAssets,
    equity: { capital, reserves, total: equityTotal },
    equityLabel: legalForm === "ltd" ? "Capital and reserves" : "Members' other interests",
    netAssetsLabel: legalForm === "ltd" ? "Net assets" : "Net assets attributable to members",
    balanced: netAssets === equityTotal,
    difference: netAssets - equityTotal,
  };
}

function defaultBsLine(a) {
  if (a.type === "asset") return a.subtype === "cash" || a.is_bank ? "cash" : a.subtype === "fixed_asset" ? "tangible_assets" : "debtors";
  if (a.type === "liability") return a.subtype === "non_current_liability" ? "creditors_after_one_year" : "creditors_within_one_year";
  return "other_reserves";
}

/**
 * Cash flow for a period, indirect method (management view).
 *   movement: Map(account_id -> debit_p - credit_p) over the period
 *
 * Built so it always reconciles: cash movement = profit minus the movement on
 * every non-cash balance sheet account, grouped by cf_class.
 */
export function cashFlow(accounts, movement, { profit }) {
  const bs = accounts.filter((a) => !isPnl(a));
  const cls = (a) => a.cf_class || (a.is_bank || a.subtype === "cash" ? "cash" : defaultCfClass(a));
  const effect = (a) => -(movement.get(a.id) || 0); // cash effect of a non-cash account

  const group = (c) =>
    bs
      .filter((a) => cls(a) === c)
      .map((a) => ({ id: a.id, code: a.code, name: a.name, amount: effect(a) }))
      .filter((l) => l.amount !== 0);

  const nonCash = group("non_cash");
  const workingCapital = group("working_capital");
  const investing = group("investing");
  const financing = group("financing");

  const operatingTotal = profit + sum(nonCash) + sum(workingCapital);
  const investingTotal = sum(investing);
  const financingTotal = sum(financing);
  const netChange = operatingTotal + investingTotal + financingTotal;

  const cashAccounts = bs.filter((a) => cls(a) === "cash");
  const cashMovement = cashAccounts.reduce((t, a) => t + (movement.get(a.id) || 0), 0);

  return {
    profit,
    nonCash,
    workingCapital,
    operatingTotal,
    investing,
    investingTotal,
    financing,
    financingTotal,
    netChange,
    cashMovement,
    reconciles: netChange === cashMovement,
    difference: cashMovement - netChange,
  };
}

function defaultCfClass(a) {
  if (a.type === "equity") return "financing";
  if (a.subtype === "fixed_asset") return "investing";
  if (a.subtype === "non_current_liability") return "financing";
  return "working_capital";
}

/** The start date of the financial year containing `date`. */
export function fyStartFor(date, fyEndMonth, fyEndDay) {
  const [y, m, d] = date.split("-").map(Number);
  const mmdd = (mm, dd) => mm * 100 + dd;
  const endThisYear = mmdd(fyEndMonth, fyEndDay);
  const startYear = mmdd(m, d) > endThisYear ? y : y - 1; // year of the previous FY end
  const end = clampDate(startYear, fyEndMonth, fyEndDay);
  const next = new Date(Date.UTC(end.y, end.m - 1, end.d + 1));
  return next.toISOString().slice(0, 10);
}

function clampDate(y, m, d) {
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { y, m, d: Math.min(d, last) };
}

/** Day before an ISO date. */
export function dayBefore(date) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
}
