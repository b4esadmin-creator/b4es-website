// Default UK chart of accounts, laid out for FRS 102 Section 1A style
// statements. fs_line drives where an account appears on the P&L or balance
// sheet; cf_class drives the indirect cash flow for balance sheet accounts.
//
// Members' capital is treated as equity ("members' other interests"), as the
// B4ES partners decided on 26 Sep 2026. For a limited company the same
// template swaps the members' accounts for share capital and dividends.

const A = (code, name, type, subtype, fs_line, cf_class = null, is_bank = 0) => ({
  code, name, type, subtype, fs_line, cf_class, is_bank,
});

const COMMON = [
  // Fixed assets
  A("0010", "Office equipment", "asset", "fixed_asset", "tangible_assets", "investing"),
  A("0011", "Office equipment: accumulated depreciation", "asset", "fixed_asset", "tangible_assets", "non_cash"),
  A("0020", "Computer equipment", "asset", "fixed_asset", "tangible_assets", "investing"),
  A("0021", "Computer equipment: accumulated depreciation", "asset", "fixed_asset", "tangible_assets", "non_cash"),
  A("0030", "Software and website development", "asset", "fixed_asset", "intangible_assets", "investing"),
  A("0031", "Software and website: accumulated amortisation", "asset", "fixed_asset", "intangible_assets", "non_cash"),

  // Current assets
  A("1100", "Trade debtors", "asset", "current_asset", "debtors", "working_capital"),
  A("1110", "Other debtors", "asset", "current_asset", "debtors", "working_capital"),
  A("1120", "Prepayments and accrued income", "asset", "current_asset", "debtors", "working_capital"),
  A("1200", "Business current account", "asset", "cash", "cash", "cash", 1),
  A("1210", "Business savings account", "asset", "cash", "cash", "cash", 1),
  A("1230", "Petty cash", "asset", "cash", "cash", "cash", 1),

  // Creditors: amounts falling due within one year
  A("2100", "Trade creditors", "liability", "current_liability", "creditors_within_one_year", "working_capital"),
  A("2110", "Accruals and deferred income", "liability", "current_liability", "creditors_within_one_year", "working_capital"),
  A("2200", "VAT control", "liability", "current_liability", "creditors_within_one_year", "working_capital"),
  A("2210", "PAYE and NIC payable", "liability", "current_liability", "creditors_within_one_year", "working_capital"),
  A("2300", "Other creditors", "liability", "current_liability", "creditors_within_one_year", "working_capital"),
  A("2310", "Bank overdraft and short-term loans", "liability", "current_liability", "creditors_within_one_year", "financing"),

  // Creditors: amounts falling due after more than one year
  A("2400", "Loans due after one year", "liability", "non_current_liability", "creditors_after_one_year", "financing"),

  // Income
  A("4000", "Accounting and bookkeeping fees", "income", "turnover", "turnover"),
  A("4010", "Tax compliance fees", "income", "turnover", "turnover"),
  A("4020", "Payroll services", "income", "turnover", "turnover"),
  A("4030", "Advisory and consulting fees", "income", "turnover", "turnover"),
  A("4040", "IT and software services", "income", "turnover", "turnover"),
  A("4090", "Other operating income", "income", "other_income", "other_operating_income"),
  A("4900", "Bank interest received", "income", "interest", "interest_receivable"),

  // Direct costs
  A("5000", "Delivery partner and subcontractor costs", "expense", "cost_of_sales", "cost_of_sales"),
  A("5010", "Client delivery software", "expense", "cost_of_sales", "cost_of_sales"),

  // Administrative expenses
  A("6000", "Salaries and wages", "expense", "staff_costs", "admin_expenses"),
  A("6010", "Employer's National Insurance", "expense", "staff_costs", "admin_expenses"),
  A("6020", "Pension contributions", "expense", "staff_costs", "admin_expenses"),
  A("6100", "Rent and rates", "expense", "premises", "admin_expenses"),
  A("6110", "Use of home as office", "expense", "premises", "admin_expenses"),
  A("6200", "Software and subscriptions", "expense", "overheads", "admin_expenses"),
  A("6210", "Telephone and internet", "expense", "overheads", "admin_expenses"),
  A("6300", "Accountancy and legal fees", "expense", "overheads", "admin_expenses"),
  A("6310", "Insurance", "expense", "overheads", "admin_expenses"),
  A("6320", "Professional subscriptions and AML supervision", "expense", "overheads", "admin_expenses"),
  A("6330", "Company formation and filing fees", "expense", "overheads", "admin_expenses"),
  A("6400", "Marketing and website", "expense", "overheads", "admin_expenses"),
  A("6500", "Travel", "expense", "overheads", "admin_expenses"),
  A("6510", "Subsistence", "expense", "overheads", "admin_expenses"),
  A("6600", "Bank charges", "expense", "overheads", "admin_expenses"),
  A("6610", "Foreign exchange gains and losses", "expense", "overheads", "admin_expenses"),
  A("6700", "Office costs and stationery", "expense", "overheads", "admin_expenses"),
  A("6800", "Training", "expense", "overheads", "admin_expenses"),
  A("6900", "Depreciation", "expense", "depreciation", "admin_expenses"),
  A("6910", "Amortisation", "expense", "depreciation", "admin_expenses"),
  A("7000", "Interest payable", "expense", "interest", "interest_payable"),

  // Suspense: anything unclear goes here and must be cleared
  A("9998", "Suspense", "asset", "current_asset", "debtors", "working_capital"),
];

const LLP_EQUITY = [
  A("3000", "Members' capital", "equity", "members_capital", "members_capital", "financing"),
  A("3100", "Members' drawings", "equity", "members_drawings", "other_reserves", "financing"),
  A("3200", "Other reserves", "equity", "reserves", "other_reserves", "financing"),
];

const LTD_EQUITY = [
  A("3000", "Called up share capital", "equity", "share_capital", "share_capital", "financing"),
  A("3100", "Dividends paid", "equity", "dividends", "other_reserves", "financing"),
  A("3200", "Other reserves", "equity", "reserves", "other_reserves", "financing"),
];

const LTD_TAX = [
  A("2220", "Corporation tax payable", "liability", "current_liability", "creditors_within_one_year", "working_capital"),
  A("8000", "Corporation tax", "expense", "tax", "tax"),
];

export function chartTemplate(legalForm) {
  if (legalForm === "ltd") return [...COMMON, ...LTD_EQUITY, ...LTD_TAX];
  return [...COMMON, ...LLP_EQUITY];
}
