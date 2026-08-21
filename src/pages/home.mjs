import { SITE, SOFTWARE_STACK, SECTORS } from "../data/site.mjs";
import { SERVICES } from "../data/services.mjs";
import { icon, arrow } from "../icons.mjs";
import {
  hero,
  sectionHead,
  featureCard,
  grid,
  statBand,
  steps,
  accordion,
  ctaBand,
  softwareBand,
  callout,
  sec,
} from "../components.mjs";

const heroAside = `
<div class="rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm">
  <p class="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-teal-light">The proposition</p>
  <p class="mt-4 font-display text-[1.375rem] leading-snug text-white">
    Market-leading quality. Materially better pricing. Your client stays yours.
  </p>
  <ul class="check-list check-list-light mt-6">
    <li>Delivery capacity for UK accountancy practices, fully white-labelled</li>
    <li>A complete outsourced finance function for growing UK businesses</li>
    <li>Backed by a specialist finance and advisory firm operating since 2014</li>
    <li>Structured, staffed and managed around UK deadlines and UK working hours</li>
  </ul>
  <div class="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
    <span class="text-teal-light">${icon("shield", "h-5 w-5")}</span>
    <p class="text-[0.8125rem] leading-snug text-slate-soft">
      UK GDPR Article 28 data processing agreement on every engagement. No client data leaves your systems.
    </p>
  </div>
</div>`;

const PRESSURES = [
  {
    icon: "people",
    title: "The talent gap is structural",
    body: "Severe shortages have left a large majority of UK practices unable to take on new client work. This is not a cyclical dip that better job adverts will fix — the pipeline into the profession has narrowed and the firms competing for that pipeline have deeper pockets.",
    meta: "Source: Accountancy Today, UK Accountancy Sector Q2 2026 analysis",
  },
  {
    icon: "calendar",
    title: "MTD turned one deadline into four",
    body: "Around 780,000 taxpayers entered Making Tax Digital for Income Tax in April 2026, with the threshold falling to £30,000 in 2027 and £20,000 in 2028. Client contact frequency quadrupled. Headcount did not.",
    meta: "Source: HMRC published figures; 34% of accountants reported not being ready",
  },
  {
    icon: "wallet",
    title: "Every UK hire costs more",
    body: "Employer National Insurance rose to 15% with the secondary threshold cut to £5,000. The arithmetic of solving a capacity problem by hiring has changed, and it has not changed in your favour.",
    meta: "Effective from April 2025",
  },
  {
    icon: "building",
    title: "Companies House reform keeps landing",
    body: "Identity verification, expanded confirmation statement content and the coming move to software-only accounts filing are pushing work back onto accountants from clients who used to self-file.",
    meta: "ECCTA 2023, phased through to April 2028",
  },
];

const DIFFERENTIATORS = [
  {
    icon: "handshake",
    title: "The client relationship never leaves you",
    body: "We are a delivery resource, not a competitor in waiting. We do not hold your client engagement, we do not market to your client base, and our contract with you says so in writing. Non-solicitation is a clause, not a promise.",
  },
  {
    icon: "scale",
    title: "Better pricing without a quality trade",
    body: "We are structured deliberately to undercut the established UK outsourcing firms on rate while matching them on review discipline. A lower price that produces rework is not a saving, and we do not pretend otherwise.",
  },
  {
    icon: "shield",
    title: "Second-person review on everything",
    body: "Preparer and reviewer are always different people. Every file leaves us with a completed checklist naming who did the work and who checked it. You review a finished job, not a draft.",
  },
  {
    icon: "globe",
    title: "Built around the UK working day",
    body: "Teams work UK hours against UK deadlines, using UK terminology and UK standards. Pakistan is four to five hours ahead of the UK, which means work completed overnight is on your desk when you arrive.",
  },
  {
    icon: "lock",
    title: "Your systems, your data, your control",
    body: "We work inside your software under named logins you create and revoke. No client data is copied into our environment, no personal devices touch the work, and access is logged.",
  },
  {
    icon: "route",
    title: "An exit you could actually use",
    body: "Documented processes, no proprietary lock-in and a defined handover pack from day one. A partnership you cannot leave is not a partnership — it is a dependency, and it prices accordingly.",
  },
];

const HOW = [
  {
    title: "Scoping call",
    body: "Thirty minutes on your service mix, your peak periods, your software and where the capacity actually hurts. We will tell you honestly if outsourcing is not the answer to your problem.",
  },
  {
    title: "Written proposal",
    body: "Within five working days: recommended scope, engagement model, resourcing, turnaround commitments and pricing. No verbal quotes and no figures that change once you have committed.",
  },
  {
    title: "Paid pilot",
    body: "A defined batch of real work — commonly ten to twenty jobs, or one payroll or VAT cycle — priced as a standalone engagement. You judge us on output, not references.",
  },
  {
    title: "Structured transition",
    body: "Process documentation, software access, security sign-off, named team introductions and an agreed escalation path. Volume ramps deliberately rather than all at once.",
  },
  {
    title: "Steady state and review",
    body: "Agreed cadence, exception reporting and a scheduled service review. Where volume grows, we plan the resourcing ahead of the peak rather than reacting to it.",
  },
];

const HOME_FAQS = [
  {
    q: "Who actually holds the client relationship?",
    a: "You do, completely. Where we work with an accountancy practice, your firm holds the engagement letter, the client relationship, the review responsibility and the fee. We are contracted to you as a delivery resource and are bound by non-solicitation. Where we work directly with a business, that engagement is ours and our delivery partner has no client relationship with you at all.",
  },
  {
    q: "Where is the work performed?",
    a: "Delivery is provided from our partner's operation in Pakistan, established in 2014, working to UK hours and UK standards. We are explicit about this because you have obligations under UK GDPR that require you to know where your clients' data is processed, and because a provider vague about its delivery location is telling you something.",
  },
  {
    q: "How is this different from the established UK outsourcing firms?",
    a: "Three ways. Pricing is set deliberately below the incumbent rate card because our cost base allows it. Engagements are scoped by people who will still be involved when the work starts. And we do not run a minimum-commitment model — you can start with one service line and one cycle.",
  },
  {
    q: "What if the quality is not there?",
    a: "That is exactly what the paid pilot is for. It is a real batch of real work, priced as a standalone engagement, with no obligation to continue. If the output does not meet your standard you have lost one job batch rather than a year of contracted commitment.",
  },
  {
    q: "Do we have to tell our clients?",
    a: "Under UK GDPR your practice is the data controller and we are a processor, which means the arrangement needs to be reflected in your engagement letters and privacy notice, and covered by a written Article 28 agreement. We provide the documentation to support that. Whether you name us to clients is your commercial decision and we follow it exactly.",
  },
];

export function homePage() {
  const practiceServices = SERVICES.filter((s) => s.audience.includes("practice")).slice(0, 6);
  const businessServices = SERVICES.filter((s) => s.audience.includes("business")).slice(0, 3);

  const body = `
${hero({
  eyebrow: "Better 4 Enterprise Solutions",
  title: "Delivery capacity for UK accountancy practices — and the businesses they serve.",
  lede:
    "B4ES provides outsourced accounting, tax, payroll and back-office delivery for UK firms and growing UK businesses. Same technical standard as the established outsourcing names, at a materially better rate, with the client relationship staying exactly where it belongs — with you.",
  primary: { href: "/contact/", label: "Book a scoping call" },
  secondary: { href: "/how-we-work/", label: "How we work" },
  aside: heroAside,
})}

<section class="border-b border-line bg-bone py-6">
  <div class="wrap flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-center">
    ${[
      ["shield", "UK GDPR Article 28 DPA"],
      ["lock", "ISO 27001-aligned controls"],
      ["handshake", "Contractual non-solicitation"],
      ["clock", "UK working hours"],
      ["magnifier", "Second-person review"],
    ]
      .map(
        ([ic, label]) =>
          `<span class="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-slate-deep">
            <span class="text-teal">${icon(ic, "h-4 w-4")}</span>${label}
          </span>`
      )
      .join("")}
  </div>
</section>

${sec(
  "section",
  `
  ${sectionHead({
    eyebrow: "The market as it stands",
    title: "Four pressures hitting UK practices at once",
    lede: "None of these are opinions. They are the operating conditions of the UK profession in 2026, and together they explain why delivery capacity has become a strategic question rather than an administrative one.",
    max: "max-w-3xl",
  })}
  <div class="mt-12">
    ${grid(
      PRESSURES.map((p) =>
        featureCard({ icon: p.icon, title: p.title, body: p.body, meta: p.meta })
      ),
      2
    )}
  </div>
  <div class="mt-8">
    ${callout({
      tone: "plain",
      ic: "target",
      title: "The honest version of the outsourcing argument",
      body: "Outsourcing does not fix a firm with a pricing problem, a workflow problem or a client-quality problem — it magnifies all three. What it does fix is a capacity problem: predictable, process-driven work that consumes qualified hours without generating proportionate fees. If your constraint is genuinely capacity, this works. If it is something else, we would rather tell you at the scoping call than three months into an engagement.",
    })}
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
    ${sectionHead({
      eyebrow: "For accountancy practices",
      title: "White-label delivery across the compliance cycle",
      lede: "Every service below is delivered under your brand, in your software, to your file standards. Your clients see your firm.",
      max: "max-w-2xl",
    })}
    <a href="/for-accountants/" class="link-arrow shrink-0">Practice overview ${arrow("h-4 w-4")}</a>
  </div>
  <div class="mt-12">
    ${grid(
      practiceServices.map((s) =>
        featureCard({
          icon: s.icon,
          title: s.nav,
          body: s.short,
          href: `/services/${s.slug}/`,
        })
      ),
      3
    )}
  </div>
  <div class="mt-6 flex justify-center">
    <a href="/services/" class="btn-outline">View all services</a>
  </div>`
)}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
    <div>
      ${sectionHead({
        eyebrow: "For growing UK businesses",
        title: "The finance department you cannot yet justify hiring",
        lede: "Between a part-time bookkeeper and a three-person finance team lies a gap most growing businesses fall into. We fill it as a service — transaction processing through to board reporting — and scale it to where you actually are.",
      })}
      <ul class="check-list mt-7">
        <li>Day-to-day finance operations run to a published month-end timetable</li>
        <li>Management accounts with commentary, not just a set of numbers</li>
        <li>Fractional CFO input for funding, modelling and pricing decisions</li>
        <li>Segregation of duties designed in from the start, not retro-fitted</li>
        <li>A documented process manual that stays yours if you ever bring it in-house</li>
      </ul>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="/for-business/" class="btn-ink">For businesses</a>
        <a href="/services/finance-function/" class="btn-outline">Outsourced finance function</a>
      </div>
    </div>
    <div class="grid gap-5 sm:grid-cols-2">
      ${businessServices
        .map((s) =>
          featureCard({
            icon: s.icon,
            title: s.nav,
            body: s.short,
            href: `/services/${s.slug}/`,
          })
        )
        .join("")}
      <div class="card-quiet flex flex-col justify-center sm:col-span-2">
        <p class="font-display text-[1.0625rem] text-ink">Already have an accountant?</p>
        <p class="mt-2 text-[0.9375rem] leading-relaxed text-slate-deep">
          Good — keep them. We run the finance function; they keep the statutory accounts, the tax
          advice and the independent professional relationship. We prepare their year-end pack, which
          usually makes their job faster and their fee smaller.
        </p>
      </div>
    </div>
  </div>`
)}

<section class="band-dark grain relative overflow-hidden">
  <div class="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-teal/10 blur-3xl"></div>
  <div class="wrap relative z-10 section">
    ${sectionHead({
      eyebrow: "Why B4ES",
      title: "Six commitments we are prepared to put in a contract",
      lede: "Most outsourcing pitches are a list of adjectives. These are the specific structural choices that differ between providers, and the ones worth interrogating when you compare us to anyone else.",
      light: true,
      max: "max-w-3xl",
    })}
    <div class="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      ${DIFFERENTIATORS.map(
        (d) => `<div>
        <div class="icon-tile-dark mb-5">${icon(d.icon, "h-5 w-5")}</div>
        <h3 class="font-display text-[1.1875rem] leading-snug text-white">${d.title}</h3>
        <p class="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-soft">${d.body}</p>
      </div>`
      ).join("")}
    </div>
    <div class="mt-16 border-t border-white/10 pt-12">
      ${statBand(
        [
          { value: "2014", label: "Year our delivery partner was established" },
          { value: "5", label: "Countries in the partner network — UK, Pakistan, Canada, Saudi Arabia, USA" },
          { value: "8", label: "Specialist service lines, including a dedicated actuarial practice" },
          { value: "4–5 hrs", label: "Delivery team time zone ahead of the UK — work lands before you start" },
        ],
        {
          light: true,
          note: "B4ES is a new UK-facing venture built on an established delivery capability. We would rather state that plainly than borrow someone else's client count. The figures above describe our delivery partner, a specialist finance and business consulting firm operating since 2014 across five countries. Our own track record starts with your pilot — which is precisely why we offer one.",
        }
      )}
    </div>
  </div>
</section>

${sec(
  "section",
  `
  <div class="grid items-start gap-14 lg:grid-cols-[0.95fr_1.15fr]">
    <div class="lg:sticky lg:top-28">
      ${sectionHead({
        eyebrow: "How it works",
        title: "From first call to steady state in five defined stages",
        lede: "No indefinite discovery phase and no committing before you have seen the work. Every stage has an output you can evaluate before the next one starts.",
      })}
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="/how-we-work/" class="btn-ink">The full process</a>
        <a href="/engagement-models/" class="btn-outline">Engagement models</a>
      </div>
    </div>
    <div>${steps(HOW)}</div>
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Security & data protection",
        title: "The objection that should come first",
        lede: "Data security is the first thing a well-run practice asks about, and rightly so. Under UK GDPR your firm remains the data controller — if something goes wrong, “the provider did it” is not a defence available to you.",
      })}
      <ul class="check-list mt-7">
        <li>Written UK GDPR Article 28 data processing agreement on every engagement</li>
        <li>Work performed inside your systems under named logins you create and revoke</li>
        <li>Controlled delivery floor — no personal devices, no removable media, no printing</li>
        <li>Access logging, role-based permissions and enforced multi-factor authentication</li>
        <li>Individual confidentiality undertakings from every team member on your work</li>
        <li>Documented breach notification procedure with defined timescales</li>
      </ul>
      <a href="/security/" class="link-arrow mt-7">Read our full security position ${arrow("h-4 w-4")}</a>
    </div>
    <div class="card">
      <p class="eyebrow">Diligence pack</p>
      <p class="mt-3 font-display text-[1.25rem] leading-snug text-ink">Ask us for the documents before you ask us for a quote</p>
      <p class="mt-3 text-[0.9375rem] leading-relaxed text-slate-deep">
        We would rather be assessed properly than sold to. On request, and before any commercial
        discussion, we will provide:
      </p>
      <ul class="dash-list mt-5">
        <li>Draft data processing agreement for your legal review</li>
        <li>Information security policy summary and control overview</li>
        <li>Transfer risk assessment support for your international transfer documentation</li>
        <li>Business continuity and disaster recovery outline</li>
        <li>Sample working paper file and completed quality checklist</li>
        <li>Draft services agreement including the non-solicitation clause</li>
      </ul>
      <a href="/contact/" class="btn-outline mt-7 w-full">Request the diligence pack</a>
    </div>
  </div>`
)}

${sec(
  "section",
  `
  ${sectionHead({
    eyebrow: "Software",
    title: "We work in your stack, not ours",
    lede: "No migrations, no data extraction into a proprietary platform, no asking your clients to change software. Our teams are trained on the tools UK practices actually run.",
    max: "max-w-3xl",
  })}
  <div class="mt-11">${softwareBand(SOFTWARE_STACK)}</div>
  <p class="mt-9 text-[0.875rem] text-slate-mid">
    Running something not listed? Most platforms are learnable within the transition period — tell us
    what you use and we will confirm honestly whether we can support it from day one or need a ramp.
  </p>`
)}

${sec(
  "section band-bone",
  `
  <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
    ${sectionHead({
      eyebrow: "Sector knowledge",
      title: "Process mapped to how your clients actually operate",
      lede: "Generic bookkeeping produces generic results. These are the sectors where we hold specific process knowledge.",
      max: "max-w-2xl",
    })}
    <a href="/sectors/" class="link-arrow shrink-0">All sectors ${arrow("h-4 w-4")}</a>
  </div>
  <div class="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    ${SECTORS.map(
      (s) => `<a href="/sectors/#${s.slug}" class="card-hover">
      <div class="icon-tile mb-4">${icon(s.icon, "h-5 w-5")}</div>
      <h3 class="font-display text-[1.0625rem] leading-snug text-ink">${s.name}</h3>
      <p class="mt-2 text-[0.875rem] leading-relaxed text-slate-mid">${s.blurb}</p>
    </a>`
    ).join("")}
  </div>`
)}

${sec(
  "section",
  `
  <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
    <div>
      ${sectionHead({
        eyebrow: "Common questions",
        title: "The things firms ask before they ask about price",
      })}
      <a href="/faqs/" class="link-arrow mt-6">All frequently asked questions ${arrow("h-4 w-4")}</a>
    </div>
    <div>${accordion(HOME_FAQS)}</div>
  </div>`
)}

${ctaBand()}
`;

  return {
    path: "/",
    title: "Outsourced Accounting, Tax & Payroll for UK Practices and Businesses",
    description:
      "B4ES provides white-label outsourced accounting, tax, payroll, audit support and back-office delivery for UK accountancy practices, plus a complete outsourced finance function for growing UK businesses.",
    body,
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: SITE.name,
      legalName: SITE.fullName,
      url: SITE.baseUrl,
      description:
        "Outsourced accounting, tax, payroll and back-office delivery for UK accountancy practices and growing UK businesses.",
      email: SITE.email,
      ...(SITE.phone ? { telephone: SITE.phone } : {}),
      areaServed: { "@type": "Country", name: "United Kingdom" },
      knowsAbout: [
        "Outsourced bookkeeping",
        "Year-end accounts preparation",
        "Self assessment tax returns",
        "Corporation tax",
        "VAT and Making Tax Digital",
        "Payroll bureau services",
        "Audit support",
        "Management accounts",
      ],
    },
  };
}
