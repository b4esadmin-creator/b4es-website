// ============================================================================
// Global site configuration.
//
// >>> PLACEHOLDERS <<<
// Values marked TODO still need real content.
//
// Anything not yet known is left EMPTY rather than filled with a plausible
// stand-in, and every template below hides the corresponding element when the
// value is empty. A missing phone number reads as "we haven't listed one";
// an invented one is a false statement on a site selling to accountants.
// Fill a value in and it appears automatically — no template edits needed.
// ============================================================================

export const SITE = {
  name: "B4ES",
  fullName: "Better 4 Enterprise Solutions",
  tagline: "Better 4 Enterprise Solutions",
  domain: "b4es.co.uk", // TODO: confirm live domain
  baseUrl: "https://b4es.co.uk", // TODO: confirm live domain

  email: "info@b4es.co.uk", // TODO: replace with live mailbox
  emailSales: "newbusiness@b4es.co.uk", // TODO
  emailCareers: "careers@b4es.co.uk", // TODO
  // TODO: add the real business number, e.g. "+44 (0)20 1234 5678".
  // Leave both empty until one exists — the header, footer and contact page
  // omit the telephone row entirely while they are blank.
  phone: "",
  phoneHref: "",

  // TODO: registered office. Leave blank until incorporation is complete —
  // the privacy and terms pages drop the sentence rather than print a gap.
  address: {
    line1: "",
    line2: "",
    postcode: "",
    country: "United Kingdom",
  },

  companyNumber: "", // TODO: Companies House number once incorporated
  icoRef: "", // TODO: ICO registration reference once registered

  linkedin: "https://www.linkedin.com/company/b4es", // TODO

  hours: "Monday to Friday, 09:00–17:30 UK time",
};

// The delivery partnership. Facts here are drawn from thebpo.net and must be
// kept accurate — they are the backbone of the site's credibility.
export const PARTNER = {
  name: "theBPO",
  url: "https://thebpo.net",
  founded: 2014,
  hq: "Karachi, Pakistan",
  offices: ["Pakistan", "United Kingdom", "Canada", "Saudi Arabia", "United States"],
  specialisms: [
    "Accounting and financial reporting",
    "Taxation and statutory compliance",
    "Governance, risk and compliance",
    "Transaction advisory and valuation",
    "IT and cyber risk advisory",
    "ESG and sustainability reporting",
    "Actuarial services",
    "HR advisory and training",
  ],
};

export const NAV = [
  {
    label: "Services",
    href: "/services/",
    mega: "services",
  },
  {
    label: "Who we help",
    href: "/for-accountants/",
    mega: "audience",
  },
  { label: "How we work", href: "/how-we-work/" },
  { label: "Engagement models", href: "/engagement-models/" },
  { label: "Security", href: "/security/" },
  { label: "Insights", href: "/insights/" },
  { label: "About", href: "/about/" },
];

export const FOOTER_NAV = [
  {
    title: "For accountancy practices",
    links: [
      { label: "Overview", href: "/for-accountants/" },
      { label: "Bookkeeping", href: "/services/bookkeeping/" },
      { label: "Year-end accounts", href: "/services/year-end-accounts/" },
      { label: "Personal tax", href: "/services/personal-tax/" },
      { label: "Corporation tax", href: "/services/corporation-tax/" },
      { label: "VAT & MTD", href: "/services/vat-mtd/" },
      { label: "Payroll", href: "/services/payroll/" },
      { label: "Audit support", href: "/services/audit-support/" },
      { label: "Company secretarial", href: "/services/company-secretarial/" },
      { label: "Practice support", href: "/services/practice-admin/" },
    ],
  },
  {
    title: "For businesses",
    links: [
      { label: "Overview", href: "/for-business/" },
      { label: "Outsourced finance function", href: "/services/finance-function/" },
      { label: "Management accounts", href: "/services/management-accounts/" },
      { label: "Fractional CFO", href: "/services/cfo-services/" },
      { label: "Risk & advisory", href: "/services/advisory/" },
      { label: "HR & training", href: "/services/hr-people/" },
      { label: "Sectors we serve", href: "/sectors/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About B4ES", href: "/about/" },
      { label: "How we work", href: "/how-we-work/" },
      { label: "Engagement models", href: "/engagement-models/" },
      { label: "Security & compliance", href: "/security/" },
      { label: "Insights", href: "/insights/" },
      { label: "FAQs", href: "/faqs/" },
      { label: "Careers", href: "/careers/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];

export const LEGAL_NAV = [
  { label: "Privacy notice", href: "/privacy/" },
  { label: "Terms of use", href: "/terms/" },
  { label: "Cookie notice", href: "/cookies/" },
];

// Sectors — used on the sectors page and referenced from service pages.
export const SECTORS = [
  {
    slug: "construction",
    name: "Construction & trades",
    icon: "building",
    blurb:
      "CIS verification and monthly returns, domestic reverse charge VAT, retentions, application-for-payment accounting and contract-level margin tracking.",
    points: [
      "CIS subcontractor verification, monthly returns and statements",
      "Domestic reverse charge treatment applied correctly at source",
      "Retention accounting and long-term contract revenue recognition",
      "Project and contract profitability reporting",
    ],
  },
  {
    slug: "professional-services",
    name: "Professional services",
    icon: "scale",
    blurb:
      "Work-in-progress and time-based revenue recognition, partner drawings, lock-up analysis and utilisation reporting for legal, consulting and agency businesses.",
    points: [
      "WIP valuation and revenue recognition on time-based engagements",
      "Lock-up, utilisation and realisation reporting",
      "Partner and LLP member drawings and current accounts",
      "Client money account reconciliation where applicable",
    ],
  },
  {
    slug: "ecommerce-retail",
    name: "E-commerce & retail",
    icon: "receipt",
    blurb:
      "Multi-channel settlement reconciliation, stock and margin analysis, and the VAT complexity that follows cross-border selling.",
    points: [
      "Amazon, Shopify, eBay and marketplace settlement reconciliation",
      "Stripe, PayPal, Klarna and merchant fee treatment",
      "Inventory valuation, stock movements and gross margin by SKU",
      "Cross-border VAT, OSS/IOSS and postponed VAT accounting",
    ],
  },
  {
    slug: "hospitality",
    name: "Hospitality & leisure",
    icon: "clock",
    blurb:
      "High-volume daily takings, tronc and tips handling, wet and dry margin analysis and weekly payroll across variable rotas.",
    points: [
      "Daily till and takings reconciliation across multiple sites",
      "Tronc schemes and tipping legislation compliance",
      "Wet, dry and department-level gross margin reporting",
      "Weekly payroll for variable-hours and seasonal staff",
    ],
  },
  {
    slug: "property",
    name: "Property & real estate",
    icon: "pin",
    blurb:
      "Portfolio landlord reporting, service charge accounts, SPV structures and the finance cost restriction on residential lettings.",
    points: [
      "Property-by-property income and expenditure reporting",
      "Service charge accounts and client account reconciliation",
      "SPV and group structures with intercompany reconciliation",
      "Capital gains, 60-day property reporting and ATED returns",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare & medical",
    icon: "shield",
    blurb:
      "GP practice and dental accounts, NHS pension reporting, locum arrangements and partnership profit allocation.",
    points: [
      "GP, dental and veterinary practice accounts",
      "NHS pension certificates and superannuation reporting",
      "Partnership profit allocation and partner tax reserves",
      "Locum and associate self-employment arrangements",
    ],
  },
  {
    slug: "charities",
    name: "Charities & not-for-profit",
    icon: "leaf",
    blurb:
      "SORP-compliant accounts, restricted and unrestricted fund accounting, grant reporting and independent examination support.",
    points: [
      "Charities SORP accounts preparation",
      "Restricted, unrestricted and designated fund accounting",
      "Grant reporting and funder-specific returns",
      "Gift Aid claims and independent examination support",
    ],
  },
  {
    slug: "technology",
    name: "Technology & SaaS",
    icon: "cpu",
    blurb:
      "Deferred revenue and subscription accounting, R&D claim support, investor reporting and SaaS metric tracking.",
    points: [
      "Subscription revenue recognition and deferred income schedules",
      "ARR, MRR, churn and customer acquisition cost reporting",
      "R&D tax relief claim preparation support",
      "Investor and board reporting packs for funded businesses",
    ],
  },
];

// Software ecosystem — shown as a capability band.
export const SOFTWARE_STACK = [
  { group: "Ledgers", items: ["Xero", "QuickBooks Online", "Sage Business Cloud", "Sage 50", "FreeAgent", "NetSuite"] },
  { group: "Accounts & tax", items: ["IRIS", "CCH", "TaxCalc", "Digita", "VT", "Capium", "Alphatax", "Silverfin"] },
  { group: "Payroll", items: ["BrightPay", "Sage Payroll", "IRIS Payroll", "Xero Payroll", "Moneysoft", "Staffology"] },
  { group: "Data capture", items: ["Dext", "AutoEntry", "Hubdoc", "ApprovalMax", "Lightyear"] },
  { group: "Practice management", items: ["Karbon", "Senta", "BrightManager", "IRIS Elements", "TaxDome", "Pixie"] },
  { group: "Audit & reporting", items: ["CaseWare", "Mercia", "Inflo", "Fathom", "Syft", "Power BI"] },
];
