import { SERVICES, CATEGORIES } from "../data/services.mjs";
import { SITE, SECTORS, SOFTWARE_STACK } from "../data/site.mjs";
import { icon, arrow } from "../icons.mjs";
import {
  hero,
  sectionHead,
  featureCard,
  grid,
  steps,
  accordion,
  ctaBand,
  softwareBand,
  callout,
  sec,
  tabs,
  illoScene,
  illoSpot,
} from "../components.mjs";

/* ============================================================ services index */

export function servicesIndexPage() {
  // One tab per service category, plus sectors and software, so the whole
  // catalogue fits on one screen height. Each card opens the service's page.
  const categoryTabs = CATEGORIES.map((c) => {
    const items = SERVICES.filter((s) => s.category === c.id);
    if (!items.length) return null;
    return {
      id: c.id,
      label: c.label,
      content: `
      <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-4">
          ${illoSpot(c.id, { cls: "w-16 shrink-0 sm:w-20" })}
          <h2 class="font-display text-[1.625rem] leading-snug text-ink">${c.label}</h2>
        </div>
        <p class="text-[0.875rem] text-slate-mid">${items.length} service${items.length > 1 ? "s" : ""} &middot; select one for the full detail</p>
      </div>
      ${grid(
        items.map((s) => featureCard({ icon: s.icon, title: s.nav, body: s.short, href: `/services/${s.slug}/` })),
        3
      )}`,
    };
  }).filter(Boolean);

  const sectorsTab = {
    id: "sectors",
    label: "Sectors",
    content: `
      <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        ${sectionHead({
          title: "Process mapped to how your clients operate",
          lede: "These are the sectors where we already hold specific process knowledge.",
        })}
        <a href="/sectors/" class="link-arrow shrink-0">All sectors in detail ${arrow("h-4 w-4")}</a>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${SECTORS.map(
          (x, i) => `<a href="/sectors/#${x.slug}" class="card-hover" data-reveal="rise" style="--d:${i % 4}">
          <div class="icon-tile mb-4">${icon(x.icon, "h-5 w-5")}</div>
          <h3 class="font-display text-[1.0625rem] leading-snug text-ink">${x.name}</h3>
        </a>`
        ).join("")}
      </div>`,
  };

  const softwareTab = {
    id: "software",
    label: "Software",
    content: `
      ${sectionHead({
        title: "The platforms our teams are trained on",
        lede: "We work in your existing software, so there is no migration and nothing is moved into a proprietary system of ours. No client is asked to change platforms to suit us.",
        max: "max-w-3xl",
      })}
      <div class="mt-10">${softwareBand(SOFTWARE_STACK)}</div>`,
  };

  const body = `
${hero({
  eyebrow: "Services",
  title: "Fourteen service lines, one agreed scope.",
  lede:
    "Accounts, tax, payroll, audit support, advisory and business support, each delivered under your brand and your review, in your software, to a scope agreed in writing before any work begins. Choose a category, then a service for the full detail.",
  primary: { href: "/contact/", label: "Contact us" },
  secondary: { href: "/why-us/#engagement-models", label: "How engagements work" },
  aside: illoScene("services"),
  trail: [{ label: "Home", href: "/" }, { label: "Services" }],
})}

${sec(
  "section",
  `
  <div class="mb-12 grid gap-4 sm:grid-cols-2">
    <a href="/for-accountants/" class="card-hover flex items-start gap-4 !p-6">
      <span class="icon-tile">${icon("building", "h-5 w-5")}</span>
      <span>
        <span class="block font-display text-[1.1875rem] text-ink">For accountancy practices</span>
        <span class="mt-1 block text-[0.9375rem] leading-relaxed text-slate-deep">White-label delivery. You keep the client, the brand and the fee.</span>
      </span>
    </a>
    <a href="/for-business/" class="card-hover flex items-start gap-4 !p-6">
      <span class="icon-tile">${icon("layers", "h-5 w-5")}</span>
      <span>
        <span class="block font-display text-[1.1875rem] text-ink">For growing UK businesses</span>
        <span class="mt-1 block text-[0.9375rem] leading-relaxed text-slate-deep">A complete finance function, delivered as a service.</span>
      </span>
    </a>
  </div>
  ${tabs([...categoryTabs, sectorsTab, softwareTab], { label: "Service categories" })}`
)}

${ctaBand({
  title: "Not sure which service line to move first?",
  body: "The answer is almost always the work that is highest in volume, lowest in judgement and most consistently late, and it takes about twenty minutes on a call to identify it.",
})}
`;

  return {
    path: "/services/",
    title: "Outsourced Accounting & Back-Office Services",
    description:
      "Fourteen outsourced service lines for UK accountancy practices and businesses: bookkeeping, year-end accounts, personal and corporation tax, VAT and MTD, payroll, audit support, company secretarial, advisory and CFO services.",
    body,
  };
}

/* ========================================================= for accountants */

const PRACTICE_OUTCOMES = [
  {
    icon: "clock",
    title: "Recover partner and senior time",
    body: "Every hour a qualified senior spends on transaction processing is an hour priced at a fraction of its opportunity cost. Moving that work out saves some cost, but the bigger gain is putting your most expensive people on your highest-margin work.",
  },
  {
    icon: "chart",
    title: "Take on clients you currently decline",
    body: "A large majority of UK practices report turning away work because they cannot resource it. With delivery capacity that scales with demand, you can say yes to that work without a hiring commitment you would regret in a quieter year.",
  },
  {
    icon: "people",
    title: "Stop losing staff to the grind",
    body: "What wears junior accountants down is the repetitive volume that fills their week. Taking it out is one of the more reliable ways for a practice to keep them, and it costs less than a counter-offer.",
  },
  {
    icon: "target",
    title: "Make advisory revenue actually happen",
    body: "Firms have talked about moving up the value chain for a decade, and most have the ambition and the capability. What stops them is that compliance work fills every available hour first. Free those hours and there is room for the advisory conversations.",
  },
];

const WHITE_LABEL = [
  "Work performed inside your practice software under named logins you create, permission and revoke",
  "All client-facing output (accounts, packs, payslips and letters) carries your branding, never ours",
  "Where you want client contact handled, it happens from your email domain in your house style",
  "Our team members are introduced by name to your staff, not rotated anonymously between jobs",
  "Contractual non-solicitation: we do not approach, market to or accept engagements from your clients",
  "You decide whether to name us to clients; we follow that decision without exception",
];

export function forAccountantsPage() {
  const services = SERVICES.filter((s) => s.audience.includes("practice"));

  const body = `
${hero({
  eyebrow: "For accountancy practices",
  title: "Extend your team while keeping your clients and your margin.",
  lede:
    "B4ES gives UK practices a white-label delivery bench across bookkeeping, accounts, tax, payroll, audit support and practice administration. You keep the engagement, the brand, the review and the relationship. We supply the hours.",
  primary: { href: "/contact/", label: "Contact us" },
  secondary: { href: "/engagement-models/", label: "Engagement models" },
  pills: ["Fully white-labelled", "Second-person review", "Non-solicitation contracted", "No minimum commitment"],
  aside: illoScene("accountants"),
  trail: [{ label: "Home", href: "/" }, { label: "For accountancy practices" }],
})}

${sec(
  "section",
  `
  ${sectionHead({
    eyebrow: "Why firms move now",
    title: "The capacity problem is not going to resolve itself",
    lede: "UK practices are absorbing a talent shortage, a quadrupling of MTD contact cycles, a higher cost of employment and a rolling programme of Companies House reform all at once, mostly with the same headcount they had three years ago.",
    max: "max-w-3xl",
  })}
  <div class="mt-12">
    ${grid(PRACTICE_OUTCOMES.map((o) => featureCard(o)), 2)}
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "White label",
        title: "Your clients never encounter us",
        lede: "For us, white-labelling means a set of operational controls. These are the ones we run.",
      })}
      <ul class="check-list mt-7">${WHITE_LABEL.map((w) => `<li>${w}</li>`).join("")}</ul>
    </div>
    <div class="space-y-5">
      ${callout({
        tone: "teal",
        ic: "shield",
        title: "Your regulatory position, stated plainly",
        body: "Under UK GDPR your practice is the data controller and B4ES is a processor. That relationship must be governed by a written Article 28 agreement, reflected in your engagement letters and privacy notice, and supported by a transfer risk assessment. We provide the documentation to make that straightforward, but the obligation stays yours. Avoid any provider that suggests otherwise.",
      })}
      ${callout({
        tone: "gold",
        ic: "magnifier",
        title: "Audit work carries a harder line",
        body: "Where we support audit engagements we act solely as a resource under the direction, supervision and review of your Responsible Individual. We perform documented procedures. We do not assess materiality, evaluate misstatements, conclude on going concern or contribute to the opinion. Anything requiring professional judgement is escalated to your team, never resolved by ours.",
      })}
    </div>
  </div>`
)}

${sec(
  "section",
  `
  ${sectionHead({
    eyebrow: "Service lines",
    title: "Ten delivery services for UK practices",
    lede: "Start with one. Most firms begin with a single service line and a single cycle, then widen once the working relationship has proved itself.",
    max: "max-w-3xl",
  })}
  <div class="mt-12">
    ${grid(
      services.map((s) =>
        featureCard({ icon: s.icon, title: s.nav, body: s.short, href: `/services/${s.slug}/` })
      ),
      3
    )}
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid items-start gap-14 lg:grid-cols-[0.95fr_1.15fr]">
    <div class="lg:sticky lg:top-28">
      ${sectionHead({
        eyebrow: "Getting started",
        title: "What the first ninety days look like",
        lede: "We pace it deliberately. Firms that dump three hundred jobs into a new provider in week one create the failure they later blame on outsourcing.",
      })}
      <a href="/how-we-work/" class="btn-ink mt-8">The full process</a>
    </div>
    <div>${steps([
      {
        title: "Weeks 1 to 2: Scope and diligence",
        body: "Scoping call, written proposal, and your review of our documentation.",
        detail: [
          "Service mix, volumes, peak periods and software confirmed",
          "Draft data processing agreement issued for your legal review",
          "Security documentation and transfer risk assessment support provided",
          "Written proposal with scope, model, turnaround and pricing",
        ],
      },
      {
        title: "Weeks 3 to 5: Paid pilot",
        body: "A real batch of real work, priced standalone, with no obligation to continue.",
        detail: [
          "Typically ten to twenty jobs, or one full payroll or VAT cycle",
          "Your file standards and templates applied from the first job",
          "Structured feedback session on output quality and file presentation",
          "Process notes written up for every client in the batch",
        ],
      },
      {
        title: "Weeks 6 to 9: Transition",
        body: "Access, documentation, named team and escalation path established properly.",
        detail: [
          "Named user accounts created by you, with role-based permissions",
          "Process manual documented per client and signed off by your team",
          "Named delivery team introduced, with a single point of escalation",
          "Communication cadence and reporting format agreed",
        ],
      },
      {
        title: "Weeks 10 to 13: Ramp and review",
        body: "Volume increases against a plan, then a formal review before steady state.",
        detail: [
          "Volume stepped up in agreed increments rather than all at once",
          "Weekly exception reporting on anything at risk of slipping",
          "Formal service review covering quality, turnaround and commercials",
          "Forward capacity plan agreed ahead of your next peak period",
        ],
      },
    ])}</div>
  </div>`
)}

${sec(
  "section",
  `
  <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
    <div>
      ${sectionHead({ eyebrow: "Questions", title: "What practice partners ask us" })}
      <a href="/faqs/" class="link-arrow mt-6">All FAQs ${arrow("h-4 w-4")}</a>
    </div>
    <div>${accordion([
      {
        q: "We tried outsourcing before and it did not work. Why would this be different?",
        a: "Most failed outsourcing engagements fail on file quality and review burden rather than technical accuracy. The accounts were right but the file could not be reviewed, so the partner rebuilt the job to understand it. We address that with a second-person review and a completion checklist that travels with every file, and we would rather you tested that on a paid pilot than took our word for it.",
      },
      {
        q: "How do you handle our peak season?",
        a: "By planning it in advance. We agree expected volumes and daily throughput ahead of the December and March peaks and reserve named resource against them. Capacity booked in September costs less and performs better than capacity scrambled for in January. That is true of every provider, though few will tell you before you have signed.",
      },
      {
        q: "What is the minimum commitment?",
        a: "There is not one for the pilot, and we do not require a long tie-in afterwards. We would rather retain firms on performance than on a notice period. Ad-hoc and per-job models exist so you can use us for overflow without restructuring your practice around us.",
      },
      {
        q: "Can you work with our existing outsourcing provider in place?",
        a: "Yes. Several firms deliberately run a second provider, for resilience, for a specific service line or as a benchmark. We are comfortable being the second provider and will not make it awkward.",
      },
      {
        q: "Who do we actually speak to day to day?",
        a: "A named engagement lead on our side, plus the named team members working your files. There is no rotating pool and no ticketing system. If your point of contact changes we tell you in advance and handle the handover ourselves.",
      },
    ])}</div>
  </div>`
)}

${ctaBand({
  title: "Test us on a real batch before you commit to anything.",
  body: "Bring ten jobs, one payroll cycle or one VAT quarter. Priced as a standalone piece of work, delivered to your file standards, with a structured feedback session at the end. If it is not right, you have lost a job batch rather than a year.",
})}
`;

  return {
    path: "/for-accountants/",
    title: "Outsourcing for UK Accountancy Practices",
    description:
      "White-label outsourced delivery for UK accountancy firms: bookkeeping, year-end accounts, personal and corporation tax, VAT and MTD, payroll, audit support and practice administration. You keep the client; we supply the capacity.",
    body,
  };
}

/* ============================================================ for business */

export function forBusinessPage() {
  const services = SERVICES.filter((s) => s.audience.includes("business"));

  const body = `
${hero({
  eyebrow: "For growing UK businesses",
  title: "A finance function that fits where you are now.",
  lede:
    "Most growing businesses reach a stage where a part-time bookkeeper is not enough and a three-person finance team is too much. B4ES covers that gap as a service: transaction processing, month-end close, management reporting and CFO-level input, sized to your business rather than to a standard package.",
  primary: { href: "/contact/", label: "Book a discovery call" },
  secondary: { href: "/services/finance-function/", label: "Outsourced finance function" },
  pills: ["No fixed headcount", "Month-end to a published timetable", "Segregation of duties built in", "Clean exit if you in-source"],
  aside: illoScene("business"),
  trail: [{ label: "Home", href: "/" }, { label: "For businesses" }],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "The problem",
        title: "You have outgrown bookkeeping and cannot yet justify a finance team",
        lede: "It is one of the most common and least discussed stages of growth. The numbers arrive late, nobody owns the forecast, and the founder is still approving purchase invoices at eleven at night.",
      })}
      <div class="prose-body mt-6">
        <p>A financial controller, a management accountant and a purchase ledger clerk is a substantial fixed commitment before employer National Insurance, pension contributions, software, holiday cover and recruitment fees. Employer NI at 15% with a £5,000 secondary threshold has made that arithmetic materially worse.</p>
        <p>Meanwhile the need is real and growing: lenders want forecasts, investors want board packs and suppliers want paying on terms. The person holding it all together is either the founder or a single bookkeeper whose departure would be a crisis.</p>
      </div>
      <ul class="check-list mt-7">
        <li>Management information that arrives weeks after it would have been useful</li>
        <li>No reliable cash forecast beyond what is currently in the bank</li>
        <li>Key-person risk concentrated in one part-time individual</li>
        <li>Controls that were fine at ten staff and are not fine at fifty</li>
        <li>A year-end that turns into a three-month archaeological exercise</li>
      </ul>
    </div>
    <div class="card-quiet">
      <p class="eyebrow">What you get instead</p>
      <ul class="mt-6 space-y-5">
        ${[
          ["reconcile", "Daily and weekly processing", "Purchase ledger, sales ledger, bank reconciliation and expenses handled on a rhythm that matches your business."],
          ["calendar", "Month-end on a fixed date", "A published close timetable. The pack arrives on the same working day every month."],
          ["chart", "Reporting with commentary", "Management accounts, KPIs, cash forecasting and variance analysis, written for a reader who is not an accountant."],
          ["compass", "CFO-level input on demand", "Modelling, funding preparation, pricing analysis and board attendance when a decision warrants it."],
          ["shield", "Controls and documentation", "Segregation of duties, a documented process manual and audit-ready records, all of which remain yours."],
        ]
          .map(
            ([ic, t, d]) => `<li class="flex gap-4">
          <span class="icon-tile">${icon(ic, "h-5 w-5")}</span>
          <span>
            <span class="block font-display text-[1.0625rem] text-ink">${t}</span>
            <span class="mt-1 block text-[0.875rem] leading-relaxed text-slate-deep">${d}</span>
          </span>
        </li>`
          )
          .join("")}
      </ul>
    </div>
  </div>`
)}

${sec(
  "section band-bone",
  `
  ${sectionHead({
    eyebrow: "Services",
    title: "What we deliver for businesses",
    lede: "Take the full function or a defined part of it. Most businesses start with the transactional layer and month-end close, then add reporting and CFO input as decisions get bigger.",
    max: "max-w-3xl",
  })}
  <div class="mt-12">
    ${grid(
      services.map((s) =>
        featureCard({ icon: s.icon, title: s.nav, body: s.short, href: `/services/${s.slug}/` })
      ),
      3
    )}
  </div>`
)}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-2">
    ${callout({
      tone: "teal",
      ic: "handshake",
      title: "We work alongside your accountant, not instead of them",
      body: "Keep your accountant. They hold the statutory accounts, the tax advice and the independent professional relationship, and it is right that an independent party does. We run the finance function underneath and prepare their year-end pack, which normally makes their work faster and their fee smaller. If your accountant would rather deliver this themselves, we are equally happy to sit behind them instead.",
    })}
    ${callout({
      tone: "plain",
      ic: "route",
      title: "Designed so you can leave",
      body: "The process manual, the controls documentation and the data all stay yours throughout. If you grow into wanting an in-house team, we help you recruit into a documented function and hand over cleanly. If you cannot exit a service, the provider holds leverage over you, and sooner or later it gets used.",
    })}
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
    <div>
      ${sectionHead({ eyebrow: "Questions", title: "What business owners ask" })}
    </div>
    <div>${accordion([
      {
        q: "What size of business does this suit?",
        a: "Typically businesses between roughly £1m and £20m of turnover, or anyone with enough transaction volume and reporting need that a single bookkeeper is no longer sufficient. Below that a good bookkeeper and a good accountant is usually the right answer, and we will say so.",
      },
      {
        q: "Where is the work actually done?",
        a: "Delivery is provided from our partner's operation in Pakistan, established in 2014, working to UK hours and UK standards. Your engagement, your contract and your point of contact are with B4ES in the UK. We state this openly because you are entitled to know where your data is processed.",
      },
      {
        q: "Do you have access to our bank accounts?",
        a: "No. We prepare payment runs and BACS files for your approval, but payment authority stays with you. This is a deliberate control boundary and we will not vary it, even if asked.",
      },
      {
        q: "How quickly can you start?",
        a: "For a straightforward business with reasonable records, typically two to four weeks from agreement. That allows time for access setup, process documentation and a proper handover from whoever does the work now. Rushing that stage is where transitions go wrong.",
      },
      {
        q: "What if our records are a mess?",
        a: "Then we say so, scope the clean-up as a separate piece of work, and price it separately. What we will not do is absorb an unknown quantity of remediation into a monthly fee and then renegotiate three months in.",
      },
    ])}</div>
  </div>`
)}

${ctaBand({
  eyebrow: "Next step",
  title: "Start with a conversation about where the pressure is.",
  body: "Thirty minutes on how your finance function runs today, what breaks first when you grow, and what a sensible next step looks like. If the answer is a better bookkeeper rather than us, we will tell you.",
  primary: { href: "/contact/", label: "Book a discovery call" },
  secondary: { href: "/services/finance-function/", label: "See the full service" },
  points: [
    "No obligation and no minimum commitment to talk",
    "A written proposal within five working days",
    "A defined trial period before any ongoing arrangement",
  ],
})}
`;

  return {
    path: "/for-business/",
    title: "Outsourced Finance Function for UK Businesses",
    description:
      "A complete outsourced finance function for growing UK businesses: bookkeeping, purchase and sales ledger, payroll, month-end close, management accounts and fractional CFO support, without building an in-house team.",
    body,
  };
}

/* ================================================================= sectors */

export function sectorsPage() {
  const body = `
${hero({
  eyebrow: "Sector expertise",
  title: "Process mapped to how your industry runs.",
  lede:
    "Bookkeeping without sector knowledge produces a long list of queries. These are the sectors where we hold specific process knowledge: the treatments, schemes and reporting that set each one apart.",
  primary: { href: "/contact/", label: "Discuss your sector" },
  secondary: { href: "/services/", label: "All services" },
  aside: illoScene("sectors"),
  trail: [{ label: "Home", href: "/" }, { label: "Sectors" }],
})}

${sec(
  "section",
  `
  <div class="space-y-5">
    ${SECTORS.map(
      (s) => `<div id="${s.slug}" class="scroll-mt-28 rounded-card border border-line bg-white p-7 sm:p-9">
      <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div class="icon-tile mb-5">${icon(s.icon, "h-5 w-5")}</div>
          <h2 class="font-display text-[1.5rem] leading-snug text-ink">${s.name}</h2>
          <p class="mt-3 text-[0.9688rem] leading-relaxed text-slate-deep">${s.blurb}</p>
        </div>
        <div class="lg:border-l lg:border-line lg:pl-8">
          <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal-dark">Where the specifics matter</p>
          <ul class="check-list mt-4">${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        </div>
      </div>
    </div>`
    ).join("")}
  </div>
  <div class="mt-10">
    ${callout({
      tone: "plain",
      ic: "spark",
      title: "Your sector not listed?",
      body: "If your client base sits somewhere we have not listed, tell us during scoping. We will say plainly whether we already hold the process knowledge or would be learning it on your files, and if it is the latter, the price and the pace should reflect that.",
    })}
  </div>`
)}

${ctaBand({
  title: "Tell us what your client base looks like.",
  body: "Sector mix changes which service lines make sense to move first and which need more process documentation up front. It is one of the first things we ask about.",
})}
`;

  return {
    path: "/sectors/",
    title: "Sector Expertise",
    description:
      "Outsourced accounting process knowledge across construction and CIS, professional services, e-commerce, hospitality, property, healthcare, charities and technology.",
    body,
  };
}
