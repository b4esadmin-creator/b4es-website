// Service registry. Each entry drives a full detail page plus nav/index cards.

export const CATEGORIES = [
  { id: "accounts", label: "Accounts & Bookkeeping" },
  { id: "tax", label: "Tax & Compliance" },
  { id: "payroll", label: "Payroll & People" },
  { id: "audit", label: "Audit & Assurance" },
  { id: "advisory", label: "Advisory & CFO" },
  { id: "support", label: "Practice & Business Support" },
];

export const SERVICES = [
  /* ------------------------------------------------------------------ */
  {
    slug: "bookkeeping",
    nav: "Bookkeeping",
    title: "Bookkeeping Outsourcing",
    category: "accounts",
    audience: ["practice", "business"],
    icon: "ledger",
    short:
      "Daily, weekly or monthly bookkeeping kept reconciled and review-ready — so year-end starts from clean data instead of a clean-up.",
    heroLede:
      "Transactional bookkeeping is the largest single consumer of chargeable hours in most UK practices and the hardest work to recruit for. We take the processing, keep the ledgers reconciled to an agreed cut-off, and hand back files that are ready for review rather than ready for repair.",
    problem: {
      title: "Why firms hand this over first",
      body: "Bookkeeping is high-volume, low-margin and relentlessly deadline-driven. It is also the work that most reliably burns out junior staff and the work clients least want to pay a UK charge-out rate for. Left in-house it crowds out advisory capacity; done badly offshore it creates a review burden worse than the original job.",
      points: [
        "Recruitment for AAT-level roles is slow and expensive, and retention at that grade is poor.",
        "Quarterly MTD obligations have turned an annual clean-up into a recurring cycle.",
        "Client record quality varies wildly — the work is unpredictable, so it never fits a hiring plan.",
        "Every hour spent on data entry is an hour not spent on the advisory work that carries the margin.",
      ],
    },
    deliverables: {
      title: "What we take on",
      groups: [
        {
          label: "Transaction processing",
          items: [
            "Purchase and sales invoice processing via Dext, Hubdoc, AutoEntry or direct upload",
            "Bank, credit card, PayPal, Stripe and merchant account reconciliation",
            "Multi-currency transactions and FX revaluation",
            "Petty cash, expense claims and employee reimbursements",
            "Journal preparation, accruals, prepayments and recurring entries",
          ],
        },
        {
          label: "Ledger control",
          items: [
            "Aged debtor and aged creditor reviews with exception reporting",
            "Supplier statement reconciliation and query logs",
            "Fixed asset register maintenance and depreciation runs",
            "Intercompany reconciliation and consolidation support",
            "Control account reconciliation — VAT, PAYE, wages, directors' loan",
          ],
        },
        {
          label: "Handover pack",
          items: [
            "Reconciled trial balance with supporting schedules",
            "Open query list, categorised and evidenced, ready for the client",
            "Cut-off checklist signed off by our reviewer before it reaches you",
            "Notes on anything unusual, one-off or requiring a judgement call",
          ],
        },
      ],
    },
    software: [
      "Xero",
      "QuickBooks Online",
      "Sage Business Cloud",
      "Sage 50",
      "FreeAgent",
      "Dext",
      "AutoEntry",
      "Hubdoc",
      "ApprovalMax",
    ],
    cadence: [
      { k: "Daily", v: "High-volume retail, hospitality and e-commerce ledgers processed every working day." },
      { k: "Weekly", v: "Bank reconciliation and purchase ledger run weekly for clients on rolling management reporting." },
      { k: "Monthly", v: "Full ledger close, reconciliations and query pack delivered to an agreed day of the month." },
      { k: "Quarterly", v: "VAT-cycle bookkeeping aligned to return periods and MTD submission windows." },
    ],
    faqs: [
      {
        q: "Do you work in our software or yours?",
        a: "Yours, always. We work inside your practice's software estate under named user logins that you create, permission and revoke. We do not extract client data into our own systems and we do not ask you to migrate anything.",
      },
      {
        q: "How do you handle client queries?",
        a: "We never contact your clients directly unless you specifically ask us to under your own brand. Queries are logged, evidenced and batched into a single structured list so your team raises them once rather than piecemeal.",
      },
      {
        q: "What happens with poor-quality records?",
        a: "We flag a records-quality issue within the first cycle rather than absorbing it silently. You get an assessment of what is missing, what it will take to fix, and a recommendation on whether to re-scope the client's fee.",
      },
    ],
    related: ["year-end-accounts", "vat-mtd", "management-accounts"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "year-end-accounts",
    nav: "Year-End Accounts",
    title: "Year-End Accounts Preparation",
    category: "accounts",
    audience: ["practice"],
    icon: "book",
    short:
      "Statutory accounts prepared to FRS 102 or FRS 105, with full working papers, ready for your partner review and signature.",
    heroLede:
      "We prepare the file, not just the numbers. Every year-end job comes back with a complete, cross-referenced working paper set so your reviewer can form a judgement in minutes rather than rebuilding the job to understand it.",
    problem: {
      title: "The review burden is the real cost",
      body: "Most firms that have tried outsourcing and stopped did not stop because the accounts were wrong. They stopped because the file was unreviewable — no lead schedules, no cross-references, no explanation of judgements — so the partner ended up doing the job twice. Preparation without a disciplined file is not a saving.",
      points: [
        "Year-end work concentrates into a few brutal months around the 31 December and 31 March filing peaks.",
        "Basis period reform and MTD have compressed the timetable further for unincorporated clients.",
        "Partner time spent unpicking a poorly documented file is the most expensive time in the firm.",
      ],
    },
    deliverables: {
      title: "What you get back",
      groups: [
        {
          label: "The accounts",
          items: [
            "Statutory accounts under FRS 102, FRS 102 Section 1A or FRS 105",
            "Limited company, LLP, partnership and sole trader accounts",
            "Charity accounts under the Charities SORP where relevant",
            "Dormant and micro-entity accounts",
            "Comparative restatement and prior-year adjustments where required",
          ],
        },
        {
          label: "The working paper file",
          items: [
            "Lead schedule for every material balance, cross-referenced to the trial balance",
            "Full supporting schedules — fixed assets, debtors, creditors, accruals, stock, loans",
            "Directors' loan account reconciliation with s455 exposure flagged",
            "Disclosure checklist completed against the applicable standard",
            "Points-forward note listing every open judgement for partner attention",
          ],
        },
        {
          label: "Filing-ready output",
          items: [
            "iXBRL-tagged accounts prepared in your filing software",
            "Companies House and HMRC submission packs assembled for your approval",
            "Draft corporation tax computation prepared alongside, if instructed",
            "Client-facing summary of results and key movements, in your house format",
          ],
        },
      ],
    },
    software: [
      "IRIS",
      "CCH Accounts Production",
      "TaxCalc",
      "Sage Accounts Production",
      "VT Final Accounts",
      "Xero Workpapers",
      "Silverfin",
      "Capium",
    ],
    cadence: [
      { k: "Standard", v: "Typical turnaround of five to seven working days from a complete records pack." },
      { k: "Priority", v: "Two to three working days for jobs flagged urgent, agreed in advance." },
      { k: "Peak season", v: "Capacity reserved ahead of the December and March filing peaks under a forward plan." },
    ],
    faqs: [
      {
        q: "Who signs the accounts?",
        a: "You do. We are a preparation resource working under your instruction and your quality control. The engagement with the client, the review, the judgement and the signature all remain entirely with your firm.",
      },
      {
        q: "How is quality controlled before we see it?",
        a: "Every file passes a second-person review before release. The preparer and the reviewer are always different people, and the reviewer signs a completion checklist that travels with the file so you can see exactly what was checked.",
      },
      {
        q: "What if the file comes back wrong?",
        a: "Rework on our error is not chargeable and does not consume your contracted hours. We also log the root cause and feed it back into the process note for that client so the same issue does not recur next year.",
      },
    ],
    related: ["corporation-tax", "bookkeeping", "audit-support"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "management-accounts",
    nav: "Management Accounts",
    title: "Management Accounts & Reporting",
    category: "accounts",
    audience: ["practice", "business"],
    icon: "chart",
    short:
      "Monthly or quarterly management packs delivered on a fixed timetable — the raw material for the advisory conversations that actually earn fees.",
    heroLede:
      "Management reporting is the bridge between compliance work and advisory revenue. The obstacle is rarely insight; it is the twenty hours of preparation standing between the ledger and the conversation. We do those twenty hours, on time, every month.",
    problem: {
      title: "Advisory ambitions stall at the preparation stage",
      body: "Almost every UK practice says it wants to move up the value chain. Very few have the spare capacity to prepare a monthly pack for eighty clients while also clearing the compliance backlog. The reporting slips, then it becomes quarterly, then it becomes an annual conversation about numbers that are nine months old.",
      points: [
        "Clients increasingly expect timely numbers as standard, not as a premium extra.",
        "Lenders, investors and boards want packs that arrive on a predictable date.",
        "The margin sits in the interpretation, but the interpretation is gated behind the preparation.",
      ],
    },
    deliverables: {
      title: "Inside a standard pack",
      groups: [
        {
          label: "Core statements",
          items: [
            "Profit and loss with prior period, budget and variance columns",
            "Balance sheet with movement analysis on material lines",
            "Cash flow statement and short-horizon cash forecast",
            "Departmental, branch, project or class-level segmentation",
          ],
        },
        {
          label: "Analysis layer",
          items: [
            "KPI dashboard built to the metrics that matter for that sector",
            "Gross margin analysis by product, service line or contract",
            "Debtor days, creditor days and working capital cycle tracking",
            "Budget versus actual with written commentary on material variances",
            "Rolling twelve-month trend and seasonality view",
          ],
        },
        {
          label: "Presentation",
          items: [
            "Branded pack in your practice's template, or the client's",
            "Executive summary written in plain English for a non-financial reader",
            "Talking points prepared for your client meeting, flagging what to probe",
            "Power BI, Fathom, Syft or Excel output depending on your stack",
          ],
        },
      ],
    },
    software: ["Xero", "QuickBooks Online", "Sage", "Fathom", "Syft", "Power BI", "Excel", "Futrli"],
    cadence: [
      { k: "Monthly", v: "Pack delivered by an agreed working day — commonly working day 8 to 12." },
      { k: "Quarterly", v: "Deeper pack aligned to VAT quarters or board cycles." },
      { k: "Ad hoc", v: "One-off packs for lender applications, funding rounds or due diligence." },
    ],
    faqs: [
      {
        q: "Can you write the commentary as well as the numbers?",
        a: "Yes. We draft narrative commentary on variances and trends in your house style. Your team edits and owns the final view — we supply the observation, you supply the advice.",
      },
      {
        q: "Do you build the reporting template?",
        a: "We can. Setting up a standard pack template for your practice is part of onboarding, and it becomes the default for every client rolled onto the service afterwards.",
      },
    ],
    related: ["cfo-services", "bookkeeping", "finance-function"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "vat-mtd",
    nav: "VAT & MTD",
    title: "VAT Returns & Making Tax Digital",
    category: "tax",
    audience: ["practice", "business"],
    icon: "reconcile",
    short:
      "VAT returns prepared and reconciled to the ledger, plus the quarterly MTD for Income Tax cycle that has quadrupled client contact.",
    heroLede:
      "MTD for Income Tax brought roughly 780,000 taxpayers into quarterly reporting from April 2026, with thresholds falling to £30,000 in 2027 and £20,000 in 2028. For an affected client, contact frequency moves from once a year to four times a year. Very few practices hired four times the staff to match.",
    problem: {
      title: "A four-fold increase in cycles, with the same headcount",
      body: "The technical work in a quarterly update is not difficult. The volume is. Each cycle brings a records chase, a bookkeeping catch-up, a reconciliation, a submission and a client communication — repeated across every client in scope, four times a year, against a hard deadline.",
      points: [
        "HMRC brought around 780,000 taxpayers into MTD for Income Tax from April 2026.",
        "The threshold falls to £30,000 from April 2027 and £20,000 from April 2028, widening scope each year.",
        "A third of accountants reported they were not ready for the first deadline.",
        "Quarterly obligations do not replace the annual return — they sit on top of it.",
      ],
    },
    deliverables: {
      title: "What we run",
      groups: [
        {
          label: "VAT compliance",
          items: [
            "Standard, cash accounting, flat rate, annual accounting and margin scheme returns",
            "Partial exemption calculations and annual adjustments",
            "Reverse charge on construction services and imported services",
            "Postponed VAT accounting and import VAT reconciliation",
            "VAT control account reconciliation to the ledger before every submission",
            "Error correction, voluntary disclosure and VAT652 preparation support",
          ],
        },
        {
          label: "MTD for Income Tax",
          items: [
            "Quarterly update preparation and submission through your MTD-compatible software",
            "Digital records maintenance meeting the digital link requirements",
            "End-of-period statement and final declaration preparation",
            "Client-by-client scope assessment against the qualifying income thresholds",
            "Deadline tracker with escalation before each quarterly window closes",
          ],
        },
        {
          label: "Cycle management",
          items: [
            "Records chasing on your behalf, under your brand, on an agreed escalation ladder",
            "Exception reporting on clients at risk of missing a deadline",
            "Submission log with evidence of every filing, retained for your records",
          ],
        },
      ],
    },
    software: ["Xero", "QuickBooks", "Sage", "FreeAgent", "TaxCalc", "IRIS Elements", "Capium", "Bridging software"],
    cadence: [
      { k: "Quarterly", v: "Aligned to VAT stagger and MTD quarterly periods, with an internal buffer before each deadline." },
      { k: "Monthly", v: "For repayment traders and clients on monthly returns." },
      { k: "Annual", v: "End-of-period statements and final declarations at the close of the tax year." },
    ],
    faqs: [
      {
        q: "Do you submit to HMRC directly?",
        a: "Only if you instruct us to, through your agent credentials and your software. Many firms prefer that we prepare and reconcile everything and that final submission stays with a named person in the practice. Both work.",
      },
      {
        q: "Can you handle the records chasing?",
        a: "Yes, and for most firms this is the single biggest saving. We chase under your brand from your mailbox, on an escalation schedule you define, and hand you an exception list of the clients who genuinely need a partner's phone call.",
      },
    ],
    related: ["bookkeeping", "personal-tax", "practice-admin"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "personal-tax",
    nav: "Personal Tax",
    title: "Personal Tax & Self Assessment",
    category: "tax",
    audience: ["practice"],
    icon: "receipt",
    short:
      "Self assessment returns prepared, reconciled and checked — volume capacity for January without a seasonal hiring cycle.",
    heroLede:
      "Self assessment is the clearest case in the profession for flexible capacity. Demand is violently seasonal, the work is standardised, and the deadline is immovable. Hiring for a January peak is expensive; carrying that cost for twelve months is worse.",
    problem: {
      title: "The January problem",
      body: "A tax department sized for January is over-staffed for eight months of the year. A department sized for the average is in crisis by mid-December. Most firms resolve this with overtime, goodwill and a quiet dip in review quality — and pay for it in staff turnover the following spring.",
      points: [
        "Deadline pressure concentrates a year of work into six weeks.",
        "Late-arriving client records compress the window further.",
        "Rushed returns are where enquiry risk and professional indemnity exposure are created.",
      ],
    },
    deliverables: {
      title: "Returns and schedules we prepare",
      groups: [
        {
          label: "Return types",
          items: [
            "SA100 individual returns with all standard supplementary pages",
            "SA800 partnership returns and partner allocations",
            "SA900 trust and estate returns",
            "Non-resident and split-year treatment computations",
            "Residence and domicile schedules, remittance basis calculations",
          ],
        },
        {
          label: "Schedules and computations",
          items: [
            "Employment, self-employment and partnership income",
            "Property income including furnished holiday lettings and finance cost restriction",
            "Capital gains computations, including UK property 60-day reporting",
            "Dividend, interest and investment income schedules",
            "Pension annual allowance, tapering and carry-forward calculations",
            "Gift Aid, EIS, SEIS and VCT relief claims",
            "Foreign income, double taxation relief and foreign tax credit claims",
          ],
        },
        {
          label: "Control",
          items: [
            "Prior-year comparison with variance explanation on every material movement",
            "Second-person review before the return reaches your team",
            "Draft client letter explaining the liability and payment dates",
            "Payments on account calculation and reduction advice where appropriate",
          ],
        },
      ],
    },
    software: ["IRIS", "TaxCalc", "CCH Personal Tax", "Digita", "Taxfiler", "Capium", "BTCSoftware"],
    cadence: [
      { k: "Off-peak", v: "Three to five working days per return from a complete pack." },
      { k: "Peak (Nov–Jan)", v: "Reserved capacity agreed in advance, with a committed daily throughput." },
      { k: "Surge", v: "Additional reviewers added for the final fortnight where volume is booked ahead." },
    ],
    faqs: [
      {
        q: "How do you handle the January volume?",
        a: "By booking it in advance. We agree an expected volume and a daily throughput with you in the autumn and reserve named resource against it. Capacity that is planned in September costs less and performs better than capacity scrambled for in December.",
      },
      {
        q: "Who deals with the client?",
        a: "Your firm, unless you ask otherwise. We prepare, reconcile and draft the covering letter; your team reviews, advises and submits under your agent authorisation.",
      },
    ],
    related: ["vat-mtd", "corporation-tax", "practice-admin"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "corporation-tax",
    nav: "Corporation Tax",
    title: "Corporation Tax & Computations",
    category: "tax",
    audience: ["practice"],
    icon: "stamp",
    short:
      "CT600 returns and computations prepared alongside the accounts, with reliefs identified rather than assumed away.",
    heroLede:
      "Corporation tax preparation done properly is not a mechanical exercise. Marginal relief, associated companies, capital allowances and loss planning all carry judgement — and all are routinely missed when the computation is squeezed in after a late set of accounts.",
    problem: {
      title: "Reliefs left on the table",
      body: "When the computation is the last thing done before a filing deadline, it gets done narrowly. Full expensing goes unclaimed, structures and buildings allowance is overlooked, group relief is not modelled, and the client pays more than they needed to — which is a fee conversation nobody enjoys having a year later.",
      points: [
        "Associated company rules affect the marginal relief limits and are easy to get wrong.",
        "Capital allowance claims need a fixed asset review, not a copy-forward.",
        "Loss relief options need modelling before the return is filed, not after.",
      ],
    },
    deliverables: {
      title: "What we prepare",
      groups: [
        {
          label: "Returns",
          items: [
            "CT600 with all relevant supplementary pages",
            "iXBRL-tagged computations and accounts for HMRC submission",
            "Short and long accounting period apportionment",
            "Amended returns and overpayment relief claims",
          ],
        },
        {
          label: "Computations",
          items: [
            "Full tax computation with adjustments to profit clearly evidenced",
            "Capital allowances — full expensing, annual investment allowance, main and special rate pools",
            "Structures and buildings allowance schedules",
            "Marginal relief with associated company analysis",
            "Loss utilisation: carry-back, carry-forward, group and terminal loss relief",
            "Directors' loan account s455 charges and relief tracking",
            "Transfer pricing and disallowed expenditure schedules",
          ],
        },
        {
          label: "Claims support",
          items: [
            "R&D tax relief claim preparation support, including the additional information form",
            "Patent box computation support",
            "Creative sector relief claims",
            "Quarterly instalment payment calculations for large companies",
          ],
        },
      ],
    },
    software: ["IRIS Business Tax", "TaxCalc", "CCH Corporation Tax", "Alphatax", "Digita", "Capium"],
    cadence: [
      { k: "With accounts", v: "Prepared alongside the year-end file so the two reconcile before either leaves us." },
      { k: "Standalone", v: "Three to five working days where accounts are already finalised." },
    ],
    faqs: [
      {
        q: "Do you prepare R&D claims?",
        a: "We prepare the computational and documentary elements of a claim, including the additional information form. The technical narrative and the professional judgement on whether the work qualifies stay with your firm — that judgement carries risk that only your engagement should hold.",
      },
      {
        q: "Are computations reviewed before they reach us?",
        a: "Always, by a second preparer against a standard checklist covering associated companies, capital allowances, loss position and s455. The completed checklist comes with the file.",
      },
    ],
    related: ["year-end-accounts", "personal-tax", "advisory"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "payroll",
    nav: "Payroll",
    title: "Payroll Bureau Support",
    category: "payroll",
    audience: ["practice", "business"],
    icon: "wallet",
    short:
      "RTI-compliant payroll processing, auto-enrolment, CIS and year-end forms — run to a calendar that never slips.",
    heroLede:
      "Payroll is the least forgiving work in a practice. It runs to a fixed date, it affects people's pay, and an error is visible immediately to everyone. It is also highly systematised, which makes it well suited to a disciplined delivery team with a second checker on every run.",
    problem: {
      title: "Zero tolerance, every single cycle",
      body: "A payroll bureau cannot have a quiet month. Every pay date is a hard deadline with an FPS attached, and the consequences of missing one land on the client's staff. Holding enough in-house capacity to absorb illness, holiday and turnover across every pay cycle is expensive — and single-person dependency is a genuine business risk.",
      points: [
        "RTI penalties apply from the first late submission for most employers.",
        "Auto-enrolment duties, re-enrolment and pension uploads add a second compliance layer.",
        "April brings a hard cliff-edge of year-end forms and new-year rate changes.",
      ],
    },
    deliverables: {
      title: "The payroll cycle we run",
      groups: [
        {
          label: "Processing",
          items: [
            "Weekly, fortnightly, four-weekly, monthly and annual payroll runs",
            "Starters, leavers, P45s and new-starter declarations",
            "Statutory payments — SSP, SMP, SPP, ShPP, SAP and neonatal care pay",
            "Attachment of earnings orders, student and postgraduate loan deductions",
            "Salary sacrifice, benefits in kind and payrolled benefits",
            "Holiday pay, overtime, bonuses, commission and back pay",
          ],
        },
        {
          label: "Submissions and compliance",
          items: [
            "Full Payment Submission and Employer Payment Summary filing under RTI",
            "Auto-enrolment assessment, postponement, opt-outs and triennial re-enrolment",
            "Pension provider uploads — NEST, The People's Pension, Smart Pension, Aviva and others",
            "CIS verification, monthly returns and subcontractor statements",
            "P60, P11D, P11D(b) and Class 1A National Insurance",
            "Employment Allowance and Apprenticeship Levy handling",
          ],
        },
        {
          label: "Outputs",
          items: [
            "Branded payslips distributed by portal or secure email",
            "Payroll journal posted directly to the accounting ledger",
            "BACS payment file prepared for approval — we never hold payment authority",
            "Departmental cost analysis and payroll reconciliation report",
          ],
        },
      ],
    },
    software: ["BrightPay", "Sage Payroll", "IRIS Payroll", "Xero Payroll", "Moneysoft", "Staffology", "Capium Payroll"],
    cadence: [
      { k: "Standard run", v: "Draft reports returned within 24 hours of receiving complete input data." },
      { k: "Approval gate", v: "Nothing is submitted or paid until your named approver signs off the draft." },
      { k: "Year end", v: "April cycle planned from February, with rate changes applied and tested in advance." },
    ],
    faqs: [
      {
        q: "Do you have access to client bank accounts?",
        a: "No. We prepare BACS files and payment schedules for your approval, but payment authority never sits with us. This is a deliberate control boundary and we will not vary it.",
      },
      {
        q: "What if an error reaches an employee?",
        a: "We correct it immediately at our cost, including any additional submission required, and issue a written incident note explaining the cause and the control change made. Payroll errors get a root-cause response, not an apology.",
      },
      {
        q: "Can you run payroll under our bureau brand?",
        a: "Yes. Payslips, reports and employee communications all carry your branding. Employees and clients see your bureau, not us.",
      },
    ],
    related: ["hr-people", "bookkeeping", "practice-admin"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "audit-support",
    nav: "Audit Support",
    title: "Audit Support Services",
    category: "audit",
    audience: ["practice"],
    icon: "magnifier",
    short:
      "Fieldwork, testing and file preparation performed under your methodology — with the opinion, judgement and sign-off staying entirely yours.",
    heroLede:
      "Audit support is the most carefully bounded service we offer. We perform documented, repeatable procedures under your instruction and your methodology. Every element of professional judgement, every conclusion, and the audit opinion itself remain with your firm and your Responsible Individual.",
    problem: {
      title: "Fieldwork volume against a shrinking audit talent pool",
      body: "Audit-qualified staff are among the hardest roles in the profession to fill, and audit remains the most heavily regulated area of practice. Firms need to expand fieldwork capacity without diluting quality — under ISQM 1 the quality management burden has increased, not relaxed.",
      points: [
        "Audit teams face concentrated seasonal peaks around common year ends.",
        "ISQM 1 has raised documentation and monitoring expectations across every engagement.",
        "Junior audit resource is expensive to recruit and slow to become productive.",
      ],
    },
    deliverables: {
      title: "Procedures we perform",
      groups: [
        {
          label: "Planning support",
          items: [
            "Permanent and current file setup in your audit software",
            "Prior-year file roll-forward and lead schedule preparation",
            "Analytical review preparation and ratio analysis",
            "Materiality computation to your methodology",
          ],
        },
        {
          label: "Fieldwork",
          items: [
            "Substantive testing across revenue, purchases, payroll and expenses",
            "Sample selection to your defined methodology and sample sizes",
            "Bank, debtor and creditor circularisation administration and follow-up",
            "Fixed asset, stock and provision testing",
            "Cut-off, existence and completeness testing",
            "Journal entry testing and data extraction analytics",
            "Tests of controls where the audit approach relies on controls",
          ],
        },
        {
          label: "Completion support",
          items: [
            "Draft financial statements and disclosure checklist completion",
            "Working paper referencing and file tidying to review standard",
            "Consolidation schedules and group reporting packs",
            "Points-forward and management letter point drafting",
          ],
        },
      ],
    },
    software: ["CaseWare", "Mercia", "Inflo", "CCH Audit Automation", "MyWorkpapers", "Excel-based methodologies"],
    cadence: [
      { k: "Planned engagements", v: "Resource booked against your audit calendar, typically a quarter ahead." },
      { k: "Peak support", v: "Additional fieldwork capacity for concentrated December and March year ends." },
    ],
    faqs: [
      {
        q: "Where exactly is the line on judgement?",
        a: "We execute procedures; you form conclusions. We do not assess materiality thresholds, evaluate misstatements, conclude on going concern, decide the audit approach, or contribute to the opinion. Anything requiring the exercise of professional judgement is escalated to your team rather than resolved by ours.",
      },
      {
        q: "How does this sit with our regulator and our ISQM 1 responsibilities?",
        a: "As a resource operating under your methodology, your supervision and your review. Your firm remains fully responsible for the engagement and its quality management. We provide the documentation trail — who performed each procedure, when, and against which instruction — that your monitoring and any regulatory review will expect to see.",
      },
      {
        q: "Do you work on listed or PIE audits?",
        a: "We support non-PIE engagements as standard. Public interest entity work carries additional independence and regulatory considerations that need to be assessed case by case before we would accept it.",
      },
    ],
    related: ["year-end-accounts", "advisory", "corporation-tax"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "company-secretarial",
    nav: "Company Secretarial",
    title: "Company Secretarial & Companies House",
    category: "tax",
    audience: ["practice", "business"],
    icon: "building",
    short:
      "Confirmation statements, share transactions and statutory registers kept current — through a period of the deepest Companies House reform in decades.",
    heroLede:
      "The Economic Crime and Corporate Transparency Act has turned company secretarial work from a filing formality into a live compliance obligation. Identity verification, tighter data requirements and the move to software-only accounts filing all landed on practices that had treated this as an afterthought.",
    problem: {
      title: "Reform has made a quiet service noisy",
      body: "Identity verification for directors and persons with significant control began phasing in from November 2025. Companies House has confirmed that accounts filing will move to commercial software with iXBRL tagging, with the removal of abridged accounts and the profit and loss filing exemption for small companies now confirmed for April 2028 after an earlier 2027 target was pushed back.",
      points: [
        "Directors and PSCs must verify their identity, and firms are fielding the questions.",
        "Filing routes that clients used themselves are closing, pushing work back to accountants.",
        "Confirmation statement content has expanded and errors now carry more consequence.",
      ],
    },
    deliverables: {
      title: "What we maintain",
      groups: [
        {
          label: "Ongoing compliance",
          items: [
            "Confirmation statement (CS01) preparation and filing",
            "Statutory register maintenance — members, directors, PSCs, charges",
            "Registered office and business address changes",
            "Director and secretary appointments, resignations and detail changes",
            "SIC code updates and standard industrial classification review",
          ],
        },
        {
          label: "Transactions",
          items: [
            "Share allotments, transfers, subdivisions and consolidations",
            "Share buybacks and reductions of capital",
            "Dividend documentation — board minutes, vouchers and resolutions",
            "Articles amendments and special resolutions",
            "Company formation, restoration and voluntary strike-off",
          ],
        },
        {
          label: "Reform readiness",
          items: [
            "Identity verification tracking across your client base",
            "PSC register review against the current disclosure requirements",
            "Software filing readiness assessment ahead of the accounts filing changes",
            "Deadline calendar with escalation on approaching confirmation statement dates",
          ],
        },
      ],
    },
    software: ["Inform Direct", "IRIS Company Secretarial", "Companies House WebFiling", "Elemental", "Diligent"],
    cadence: [
      { k: "Rolling", v: "Deadline calendar monitored continuously with advance escalation." },
      { k: "Transactional", v: "Two to three working days for share transactions and resolutions." },
    ],
    faqs: [
      {
        q: "Do you file directly with Companies House?",
        a: "Under your authentication and on your instruction, if you want us to. Many firms prefer to keep filing with a named person internally and use us for preparation and register maintenance. Either arrangement is fine, provided it is documented at onboarding.",
      },
    ],
    related: ["corporation-tax", "year-end-accounts", "practice-admin"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "practice-admin",
    nav: "Practice Support",
    title: "Practice Administration & Client Support",
    category: "support",
    audience: ["practice"],
    icon: "inbox",
    short:
      "The unbilled work that consumes your fee earners — records chasing, onboarding, workflow hygiene and deadline tracking.",
    heroLede:
      "Every practice carries a heavy load of work that no client will ever pay for: chasing records, onboarding new clients, keeping the workflow system honest, checking deadlines. It is invisible on the fee ledger and highly visible in your team's week.",
    problem: {
      title: "The work that never appears on a timesheet",
      body: "Administrative drag is the least-examined cost in most practices. A senior on £45,000 spending six hours a week chasing paperwork is roughly £7,000 a year of salary applied to a task that does not require their qualification — and it is precisely the part of the job that makes good people leave.",
      points: [
        "Records chasing is repetitive, unbillable and never finished.",
        "Onboarding and AML checks have grown more demanding, not less.",
        "Workflow systems only deliver value if someone maintains them daily.",
      ],
    },
    deliverables: {
      title: "What we take off your desk",
      groups: [
        {
          label: "Client cycle",
          items: [
            "Records chasing under your brand on a defined escalation ladder",
            "New client onboarding packs, engagement letters and authorisation forms",
            "AML and KYC documentation collection and file assembly for your review",
            "HMRC agent authorisation (64-8) processing and tracking",
            "Professional clearance letters and handover coordination",
          ],
        },
        {
          label: "Workflow and data",
          items: [
            "Practice management system hygiene — job status, deadlines, allocations",
            "Deadline monitoring across accounts, tax, VAT, payroll and confirmation statements",
            "Weekly exception report on jobs at risk of slipping",
            "Client database cleansing and contact record maintenance",
          ],
        },
        {
          label: "Client communication",
          items: [
            "Inbox triage and first-line query handling under your supervision",
            "Standard client correspondence drafted in your house style",
            "Meeting preparation packs assembled ahead of client reviews",
            "Fee note preparation and debtor chasing support",
          ],
        },
      ],
    },
    software: ["Karbon", "Senta", "BrightManager", "IRIS Elements", "TaxDome", "Pixie", "Xero Practice Manager"],
    cadence: [
      { k: "Daily", v: "Inbox triage and chasing runs on every UK working day." },
      { k: "Weekly", v: "Exception and deadline-risk report delivered to your operations lead." },
    ],
    faqs: [
      {
        q: "Will our clients know they are speaking to an outsourced team?",
        a: "That is your decision and we follow it exactly. We can operate entirely invisibly under your brand and your email domain, or be introduced openly as your delivery partner. Whichever you choose, we never contact a client outside the boundaries you set.",
      },
      {
        q: "Can you handle AML checks?",
        a: "We collect and assemble documentation and prepare the file. The risk assessment and the decision to accept a client remain with your Money Laundering Reporting Officer — that responsibility is not delegable.",
      },
    ],
    related: ["vat-mtd", "bookkeeping", "personal-tax"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "finance-function",
    nav: "Outsourced Finance Function",
    title: "Outsourced Finance Function",
    category: "support",
    audience: ["business"],
    icon: "layers",
    short:
      "A complete finance department for a growing UK business — transaction processing through to board reporting, without building the team.",
    heroLede:
      "Between a part-time bookkeeper and a full in-house finance team lies an awkward gap that many growing businesses fall into. You need more than data entry and less than three salaries. We provide the whole function as a service, sized to where you actually are.",
    problem: {
      title: "The finance team you cannot yet justify",
      body: "A capable financial controller, a management accountant and a purchase ledger clerk represent a substantial fixed commitment before employer National Insurance, pension, software, cover and recruitment costs. For a business between £1m and £20m of turnover, that structure is often unaffordable and yet the need is real.",
      points: [
        "Employer National Insurance rose to 15% with the secondary threshold cut to £5,000, making every UK hire materially more expensive.",
        "Key-person risk is acute when one person holds the whole finance function.",
        "Growth exposes the gap fastest — exactly when attention is needed elsewhere.",
      ],
    },
    deliverables: {
      title: "The full stack",
      groups: [
        {
          label: "Transactional",
          items: [
            "Purchase ledger, supplier statement reconciliation and payment run preparation",
            "Sales ledger, invoicing, credit control and debtor chasing",
            "Bank and card reconciliation across all accounts and currencies",
            "Expense processing and employee claims",
            "Payroll processing and pension administration",
          ],
        },
        {
          label: "Controls and reporting",
          items: [
            "Month-end close to a published timetable",
            "Management accounts with commentary and KPI reporting",
            "Cash flow forecasting and working capital monitoring",
            "Budgeting, reforecasting and variance analysis",
            "VAT returns and statutory compliance calendar",
          ],
        },
        {
          label: "Governance",
          items: [
            "Documented finance process manual specific to your business",
            "Segregation of duties designed in from the start",
            "Audit-ready records and year-end pack for your accountant",
            "Board and lender reporting packs",
          ],
        },
      ],
    },
    software: ["Xero", "QuickBooks", "Sage", "NetSuite", "Dext", "ApprovalMax", "Fathom", "Power BI"],
    cadence: [
      { k: "Continuous", v: "Transaction processing runs daily or weekly to your business rhythm." },
      { k: "Month end", v: "Close completed and pack issued to a fixed working day each month." },
    ],
    faqs: [
      {
        q: "Do we still need our accountant?",
        a: "Yes, and we work alongside them. We run the finance function; your accountant handles statutory accounts, tax advice and the independent professional relationship. We prepare the year-end pack so their job is faster and their fee reflects it.",
      },
      {
        q: "What if we grow into wanting our own team?",
        a: "Then we help you build it and hand over cleanly. The process manual, the controls and the documentation are yours throughout. A service you cannot exit is not a service, it is a trap — we do not design engagements that way.",
      },
    ],
    related: ["cfo-services", "management-accounts", "payroll"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "cfo-services",
    nav: "Fractional CFO",
    title: "Fractional CFO & Financial Planning",
    category: "advisory",
    audience: ["business", "practice"],
    icon: "compass",
    short:
      "Senior financial thinking on a fractional basis — planning, modelling, funding preparation and board-level challenge.",
    heroLede:
      "Most businesses need CFO-level judgement long before they can justify a CFO-level salary. Fractional engagement gives you the thinking when decisions demand it, without the fixed cost of carrying it year-round.",
    problem: {
      title: "Good numbers, no interpretation",
      body: "Plenty of businesses have accurate accounts and still make poor decisions, because nobody is turning the reporting into direction. Pricing goes unexamined, working capital tightens unnoticed, and funding conversations start three months too late.",
      points: [
        "Lenders and investors expect modelling and scenario analysis as a baseline.",
        "Pricing and margin decisions are frequently made on intuition rather than analysis.",
        "Cash pressure is almost always visible in the numbers before it is felt in the bank.",
      ],
    },
    deliverables: {
      title: "Where a fractional CFO earns their fee",
      groups: [
        {
          label: "Planning and modelling",
          items: [
            "Three-statement financial model with integrated cash flow",
            "Scenario and sensitivity analysis on the decisions that matter",
            "Annual budget build and quarterly reforecasting",
            "Thirteen-week cash flow for tight liquidity periods",
            "Unit economics, contribution and break-even analysis",
          ],
        },
        {
          label: "Growth and transactions",
          items: [
            "Funding readiness — lender packs, investor decks and data room preparation",
            "Business valuation support and equity modelling",
            "Acquisition appraisal and financial due diligence support",
            "Pricing strategy and margin improvement analysis",
            "Capital structure and debt facility review",
          ],
        },
        {
          label: "Governance",
          items: [
            "Board pack preparation and attendance",
            "KPI framework design and performance reporting",
            "Internal control and process improvement review",
            "Finance team mentoring and capability building",
          ],
        },
      ],
    },
    software: ["Excel", "Power BI", "Fathom", "Futrli", "Syft", "Causal"],
    cadence: [
      { k: "Retained", v: "An agreed number of days each month, with a consistent named lead." },
      { k: "Project", v: "Defined-scope engagements — a funding round, a model build, an acquisition appraisal." },
    ],
    faqs: [
      {
        q: "Can practices white-label this?",
        a: "Yes. Several of the firms we speak to want to offer advisory services but lack the senior bench to deliver them. We supply the modelling and analytical capability behind your brand while your partner owns the client relationship and the advice.",
      },
    ],
    related: ["management-accounts", "finance-function", "advisory"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "advisory",
    nav: "Risk & Advisory",
    title: "Governance, Risk & Specialist Advisory",
    category: "advisory",
    audience: ["business", "practice"],
    icon: "scale",
    short:
      "Governance and risk, transaction and valuation, IT and cyber risk, ESG reporting and actuarial support — specialist benches most firms cannot staff.",
    heroLede:
      "Some capabilities are needed too intermittently to employ and too technical to improvise. Our delivery partner has maintained specialist advisory teams since 2014, including a dedicated actuarial practice, and we bring that bench to UK engagements under our own client relationship.",
    problem: {
      title: "Specialist need, intermittent demand",
      body: "A mid-sized practice might face two valuation engagements, one ESG reporting question and a cyber risk review in a year. Employing for that is impossible; declining the work sends the client to a competitor who will happily take the rest of the relationship too.",
      points: [
        "Sustainability reporting expectations continue to widen down the supply chain.",
        "Cyber and IT risk assurance is increasingly demanded by insurers and lenders.",
        "Valuation and transaction work arrives unpredictably and cannot wait.",
      ],
    },
    deliverables: {
      title: "Specialist areas",
      groups: [
        {
          label: "Governance, risk and compliance",
          items: [
            "Risk assessment and risk register development",
            "Internal control design and effectiveness evaluation",
            "Policy and procedure development",
            "Compliance monitoring programmes",
            "Internal audit support on a co-sourced basis",
          ],
        },
        {
          label: "Transactions and valuation",
          items: [
            "Business and asset valuation for commercial, tax and dispute purposes",
            "Financial due diligence on acquisitions and disposals",
            "Merger, acquisition and restructuring support",
            "Share valuation for EMI schemes and employee equity",
            "Investment appraisal and feasibility analysis",
          ],
        },
        {
          label: "Technology and cyber risk",
          items: [
            "IT general controls review and testing",
            "Cybersecurity framework assessment and gap analysis",
            "Data protection and information security review",
            "System implementation and migration assurance",
          ],
        },
        {
          label: "ESG, sustainability and actuarial",
          items: [
            "Sustainability reporting preparation and framework alignment",
            "ESG strategy development and materiality assessment",
            "Carbon and emissions data collation and reporting support",
            "Actuarial risk modelling and financial forecasting",
            "Employee benefit and defined benefit scheme valuation support",
            "Insurance reserving and technical provision analysis",
          ],
        },
      ],
    },
    software: ["Excel", "Power BI", "Specialist actuarial modelling tools", "GRC platforms"],
    cadence: [
      { k: "Scoped project", v: "Fixed-scope engagement with a written brief, timetable and deliverable set." },
      { k: "Retained advisory", v: "Ongoing access to specialist input for firms with recurring need." },
    ],
    faqs: [
      {
        q: "Is the actuarial capability genuine?",
        a: "Yes. Our delivery partner operates a dedicated actuarial practice, which is unusual for a firm of this type and is one of the reasons we selected them. Scope and qualification requirements for any specific UK engagement are confirmed in writing before we accept it.",
      },
    ],
    related: ["cfo-services", "audit-support", "hr-people"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "hr-people",
    nav: "HR & Training",
    title: "HR Advisory, People Risk & Training",
    category: "payroll",
    audience: ["business", "practice"],
    icon: "people",
    short:
      "Employment policy, people risk and structured technical training — the governance layer around your workforce.",
    heroLede:
      "People risk sits alongside financial risk in any well-run business, and it is usually less well documented. We help build the policy framework, the structure and the training programme that keep it managed rather than discovered.",
    problem: {
      title: "People risk found late is expensive",
      body: "Employment issues rarely announce themselves early. Weak documentation, informal processes and untrained managers turn manageable situations into tribunal exposure, and the cost lands in one lump at the worst possible moment.",
      points: [
        "Employment law obligations continue to expand and change.",
        "Growing teams outgrow informal practices faster than owners expect.",
        "Technical skills in finance teams decay without structured development.",
      ],
    },
    deliverables: {
      title: "What we provide",
      groups: [
        {
          label: "HR advisory and governance",
          items: [
            "Employment policy and staff handbook development",
            "Contract and offer documentation review",
            "Organisational structure and role definition",
            "Performance management framework design",
            "Employee lifecycle process — onboarding through exit",
            "People risk assessment and governance review",
          ],
        },
        {
          label: "Training and capability",
          items: [
            "Technical training on accounting standards and financial reporting",
            "Finance team upskilling programmes with defined outcomes",
            "Software and systems training for finance staff",
            "Soft skills and workplace readiness development",
            "Bespoke programme design against an identified capability gap",
          ],
        },
      ],
    },
    software: ["BrightHR", "Breathe HR", "PeopleHR", "Microsoft 365"],
    cadence: [
      { k: "Project", v: "Policy framework or training programme delivered against a defined scope." },
      { k: "Retained", v: "Ongoing advisory access for businesses without an internal HR function." },
    ],
    faqs: [
      {
        q: "Is this UK employment law advice?",
        a: "We provide HR governance, process and documentation support. Where a matter requires formal UK employment law advice we say so and work alongside a qualified UK employment adviser rather than substituting for one.",
      },
    ],
    related: ["payroll", "advisory", "finance-function"],
  },
];

export const byslug = (s) => SERVICES.find((x) => x.slug === s);
export const forAudience = (a) => SERVICES.filter((s) => s.audience.includes(a));
export const byCategory = (c) => SERVICES.filter((s) => s.category === c);
