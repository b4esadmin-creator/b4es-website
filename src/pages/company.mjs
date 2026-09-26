import { SITE, PARTNER } from "../data/site.mjs";
import { icon, arrow } from "../icons.mjs";
import {
  hero,
  sectionHead,
  featureCard,
  grid,
  steps,
  accordion,
  ctaBand,
  callout,
  sec,
  secNarrow,
  tabs,
  linkCard,
  artGrowth,
  illoScene,
} from "../components.mjs";

/* ================================================================== about */

// Populate this array to render the leadership section. Each entry:
// { name, role, bio, focus }
export const LEADERSHIP = [];

const VALUES = [
  {
    icon: "target",
    title: "Say the difficult thing early",
    body: "If records are poor, a deadline cannot be met or outsourcing will not solve your problem, you hear it as soon as we know. Bad news delivered late is the most expensive mistake a supplier can make.",
  },
  {
    icon: "scale",
    title: "Price it once",
    body: "The figure in the proposal is the figure on the invoice. We quote scope changes before the work happens. Nothing in our commercial model relies on you missing the small print.",
  },
  {
    icon: "shield",
    title: "Own the error",
    body: "We do not charge for rework on our mistakes, and it does not use up your hours. Each one also produces a written root-cause note and a control change, because an apology alone leaves the process as it was.",
  },
  {
    icon: "route",
    title: "Build an exit you could use",
    body: "Processes are documented, nothing ties you to proprietary tools, and there is a defined handover pack. We want clients to stay because the work is good, and leaving should be easy.",
  },
];

const NOT_US = [
  "We are not a firm of registered auditors and we do not issue audit opinions.",
  "We do not provide regulated investment advice or legal advice.",
  "We do not hold client money or payment authority, and we will not accept it if offered.",
  "We do not sign statutory accounts or tax returns. That authority stays with the appointed adviser.",
  "We do not approach, market to or accept engagements from a practice client's client base.",
  "We do not claim certifications, client counts or case studies we have not earned.",
];

export function aboutPage() {
  const leadershipBlock = LEADERSHIP.length
    ? `<div class="mt-12">${grid(
        LEADERSHIP.map(
          (p) => `<div class="card">
        <h3 class="h-card">${p.name}</h3>
        <p class="mt-1 text-[0.875rem] font-semibold text-teal-dark">${p.role}</p>
        <p class="mt-3 text-[0.9375rem] leading-relaxed text-slate-deep">${p.bio}</p>
      </div>`
        ),
        3
      )}</div>`
    : `<div class="mt-8 prose-body max-w-3xl">
        <p>B4ES is led from the UK by the people who will be in your scoping call, and they stay involved once the work is running. We set it up that way on purpose. In this market it is common to be sold to by one team and served by another you never meet, and that is one of the more reliable signs an engagement will disappoint.</p>
        <p>Delivery is led by our partner's senior finance and advisory management, who have been running this discipline since 2014. Named individuals on both sides are introduced during transition, and you are told in advance if any of them change.</p>
      </div>`;

  const storyTab = `
  <div class="grid items-start gap-14 lg:grid-cols-[1.15fr_1fr]">
    <div>
      ${sectionHead({ eyebrow: "The name", title: "What “Better 4 Enterprise Solutions” means" })}
      <div class="prose-body mt-6">
        <p>We start with outsourced delivery because that is where the need is greatest and easiest to measure. UK accountancy practices cannot recruit fast enough to meet their compliance obligations, and growing UK businesses are stuck between a bookkeeper and a finance team they cannot yet afford. Both problems can be solved now with capability that already exists.</p>
        <p>The name reaches further than outsourcing. Small and mid-sized enterprises rarely have a single, tidy problem. The finance function is late, the reporting is thin, the people processes are informal, the systems do not talk to each other, and nobody has modelled what happens if the largest customer leaves. That is one business's problem showing up in five forms, and it is better handled together than by five separate suppliers.</p>
        <p>Over time B4ES aims to cover more of that ground: finance first, then the adjacent capability an enterprise needs but cannot justify employing. That is a direction, and we are at the start of it.</p>
      </div>
    </div>
    <div class="card-quiet">
      <p class="eyebrow">Position, stated plainly</p>
      <ul class="mt-6 space-y-5">
        ${[
          ["spark", "New venture, established capability", "B4ES is a new UK-facing business built on a delivery operation that has run since 2014. We do not borrow our partner's client list and present it as our track record."],
          ["handshake", "Independent of the delivery partner", "Your contract, your engagement and your point of contact are with B4ES. The delivery partnership sits behind us and is governed by written agreement."],
          ["globe", "UK-facing by design", "We work to UK hours, UK standards, UK terminology and the UK filing calendar. The service was designed for the UK from the start."],
          ["magnifier", "Judged on a pilot", "We offer a paid pilot on every engagement because we have no UK case studies to point to yet, so you can test the work first."],
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
  </div>`;

  const partnerTab = `
  <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
    <div>
      ${sectionHead({
        eyebrow: "The delivery partnership",
        title: "Who does the work",
        lede: `Our delivery partner is a specialist accounting, tax, advisory and HR consulting firm headquartered in ${PARTNER.hq}, operating since ${PARTNER.founded} across ${PARTNER.offices.length} countries. We take part directly in its recruitment, training and quality.`,
      })}
      <div class="prose-body mt-6">
        <p>B4ES owns the client relationship entirely. Our partner provides delivery under a written agreement with defined confidentiality, security and data protection obligations. You contract with one party and deal with one party.</p>
      </div>
    </div>
    ${linkCard({
      href: "/strategic-partners/",
      ic: "handshake",
      title: "Our strategic partners",
      body: "Our partner's capability, how we take part in its recruitment, training and quality, and how the partnership is governed.",
      cta: "Meet our partners",
    })}
  </div>`;

  const valuesTab = `
  ${sectionHead({
    eyebrow: "How we operate",
    title: "Four commitments for the days something goes wrong",
    lede: "Most suppliers look alike when everything runs smoothly. These four describe what we do when it does not.",
    max: "max-w-3xl",
  })}
  <div class="mt-10">${grid(VALUES.map((v) => featureCard(v)), 2)}</div>`;

  const peopleTab = `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Boundaries",
        title: "What we are not",
        lede: "A professional buyer needs to know where a service stops. These are our limits.",
      })}
      <ul class="dash-list mt-7">${NOT_US.map((n) => `<li>${n}</li>`).join("")}</ul>
    </div>
    <div>
      ${sectionHead({ eyebrow: "Leadership", title: "Who you will be dealing with" })}
      ${leadershipBlock}
    </div>
  </div>`;

  const body = `
${hero({
  eyebrow: "About Us",
  title: "Better 4 Enterprise Solutions.",
  lede:
    "UK firms and UK businesses are paying established outsourcing rates for work that can be delivered to the same standard for materially less. B4ES exists to close that gap, and over time to become a broader solutions partner to the enterprises we serve.",
  primary: { href: "/contact/", label: "Contact us" },
  secondary: { href: "/why-us/", label: "Why B4ES" },
  aside: `<div class="mx-auto max-w-md">${artGrowth()}</div>`,
  trail: [{ label: "Home", href: "/" }, { label: "About Us" }],
})}

${sec(
  "section",
  tabs(
    [
      { id: "our-story", label: "Our story", content: storyTab },
      { id: "our-partner", label: "Our partner", content: partnerTab },
      { id: "our-values", label: "Our values", content: valuesTab },
      { id: "boundaries", label: "Boundaries & leadership", content: peopleTab },
    ],
    { label: "About B4ES" }
  )
)}

${ctaBand({
  title: "Have the sceptical conversation with us.",
  body: "Bring your objections: data security, quality, control, previous bad experiences, whether the price is too good to be true. A first conversation about those gets further than a capability overview.",
})}
`;

  return {
    path: "/about/",
    title: "About B4ES",
    description:
      "B4ES (Better 4 Enterprise Solutions) is a UK-facing outsourcing and business solutions venture delivering accounting, tax, payroll and advisory support through an established specialist delivery partner operating since 2014.",
    body,
  };
}

/* =========================================================== how we work */

const PRINCIPLES = [
  {
    icon: "layers",
    title: "Scope in writing before work starts",
    body: "Every engagement begins with a written scope: services, volumes, cadence, turnaround, escalation and exclusions. Anything outside it is quoted before it happens.",
  },
  {
    icon: "magnifier",
    title: "Preparer and reviewer are never the same person",
    body: "Second-person review on every file, with a completion checklist naming who prepared, who reviewed and what was checked. The checklist travels with the file.",
  },
  {
    icon: "book",
    title: "Process documented per client",
    body: "Each client gets a process note covering treatments, quirks, preferences and prior-year judgements. It is written to survive staff changes on either side.",
  },
  {
    icon: "inbox",
    title: "Queries batched, evidenced and single-threaded",
    body: "We raise queries once per cycle as a structured list with evidence attached, so your team deals with one list instead of a stream of interruptions.",
  },
  {
    icon: "clock",
    title: "Exceptions reported before deadlines",
    body: "A weekly exception report on anything at risk. You should never learn about a slipped job from the client or from HMRC.",
  },
  {
    icon: "reconcile",
    title: "Service reviews on a schedule",
    body: "A formal review at the end of transition and at agreed intervals afterwards, covering quality, turnaround, volumes, commercials and forward capacity.",
  },
];

export function howWeWorkPage() {
  const body = `
${hero({
  eyebrow: "How we work",
  title: "The operating model, in enough detail to be assessed.",
  lede:
    "Most outsourcing goes wrong in transition rather than in delivery. Access is rushed, process is undocumented, volume ramps too fast and nobody agrees what “finished” looks like. This is how we avoid that, stage by stage.",
  primary: { href: "/contact/", label: "Contact us" },
  secondary: { href: "/engagement-models/", label: "Engagement models" },
  aside: illoScene("how-we-work"),
  trail: [{ label: "Home", href: "/" }, { label: "How we work" }],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-14 lg:grid-cols-[0.9fr_1.2fr]">
    <div class="lg:sticky lg:top-28">
      ${sectionHead({
        eyebrow: "The process",
        title: "Five stages, each with an output you can evaluate",
        lede: "Nothing is committed before you have seen work. Every stage ends with something concrete: a document, a batch of files or a signed-off process.",
      })}
      <div class="mt-8">
        ${callout({
          tone: "plain",
          ic: "clock",
          title: "How long does it take?",
          body: "A single service line for a small practice can be live within three to four weeks. A multi-service transition for a larger firm typically runs eight to twelve weeks. We will not compress that to win the work, because a rushed transition costs more than a slow one.",
        })}
      </div>
    </div>
    <div>${steps([
      {
        title: "Scoping call",
        body: "Thirty minutes, no deck. We want to find out whether your constraint really is capacity and, if so, where it bites hardest.",
        detail: [
          "Service mix, client base and sector profile",
          "Peak periods and where deadlines currently slip",
          "Software estate across ledgers, production, tax and practice management",
          "Previous outsourcing experience, and what went wrong",
          "Our view on whether we are the right answer",
        ],
      },
      {
        title: "Written proposal",
        body: "Within five working days. Everything commercial in writing before you decide anything.",
        detail: [
          "Recommended scope and the reasoning behind the sequence",
          "Engagement model, resourcing profile and turnaround commitments",
          "Pricing, with what is included and what is explicitly excluded",
          "Draft data processing agreement and security documentation",
          "Proposed pilot batch and how it will be evaluated",
        ],
      },
      {
        title: "Paid pilot",
        body: "Real work, priced standalone, with no obligation to continue. This is where you form a view.",
        detail: [
          "Typically ten to twenty jobs, or one full payroll or VAT cycle",
          "Delivered to your file standards and templates from the first job",
          "Full working paper file and completion checklist on every job",
          "Structured feedback session covering accuracy, presentation and review burden",
          "Written process notes produced for every client in the batch",
        ],
      },
      {
        title: "Transition",
        body: "Most providers rush this stage. We set up access, documentation, people and escalation properly.",
        detail: [
          "Named user accounts created by you, with role-based permissions and MFA",
          "Security sign-off completed before any live client data is touched",
          "Per-client process notes documented and signed off by your team",
          "Named delivery team introduced, with a single escalation point",
          "Communication cadence, reporting format and SLA agreed in writing",
        ],
      },
      {
        title: "Steady state and review",
        body: "Delivery to an agreed rhythm, with capacity planned before each peak arrives.",
        detail: [
          "Delivery against agreed turnaround, tracked and reported",
          "Weekly exception report on anything at risk of slipping",
          "Formal service review at agreed intervals",
          "Forward capacity planning before each peak period",
          "Scope reviewed and re-quoted openly when volumes change",
        ],
      },
    ])}</div>
  </div>`
)}

${sec(
  "section band-bone",
  `
  ${sectionHead({
    eyebrow: "Operating principles",
    title: "Six things that hold whether it is a quiet month or January",
    lede: "This is how we keep our commitments, and each one is a fair question to put to any provider you compare us with.",
    max: "max-w-3xl",
  })}
  <div class="mt-12">${grid(PRINCIPLES.map((p) => featureCard(p)), 3)}</div>`
)}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Quality",
        title: "What “review-ready” means in practice",
        lede: "The single most common reason firms abandon outsourcing is not inaccuracy. It is that the file cannot be reviewed without being rebuilt.",
      })}
      <div class="prose-body mt-6">
        <p>A job that is technically correct but undocumented still costs your partner an hour to understand. Across a year, that wipes out the saving, which is why we measure ourselves on review burden rather than error rate.</p>
      </div>
      <ul class="check-list mt-7">
        <li>Lead schedule for every material balance, cross-referenced to the trial balance</li>
        <li>Supporting schedules for every figure a reviewer would reasonably challenge</li>
        <li>Judgements written up and flagged where a reviewer will see them</li>
        <li>Points-forward note listing everything needing partner attention</li>
        <li>Prior-year comparison with variance explanation on material movements</li>
        <li>Completion checklist naming the preparer, the reviewer and what was checked</li>
      </ul>
    </div>
    <div class="space-y-5">
      ${callout({
        tone: "teal",
        ic: "shield",
        title: "When we get it wrong",
        body: "Rework on our error is not chargeable and does not use your contracted hours. Every material error also produces a written root-cause note and a documented change to that client's process, both issued to you, because an error that leaves the process unchanged will happen again next cycle.",
      })}
      ${callout({
        tone: "gold",
        ic: "people",
        title: "Continuity of people",
        body: "Your work is done by named individuals. If a team member changes, we tell you in advance and run the handover ourselves from the documented process notes. Staff turnover is ours to manage and should never become your problem.",
      })}
      ${callout({
        tone: "plain",
        ic: "route",
        title: "If you leave",
        body: "You receive a handover pack: all process documentation, current work-in-progress status, file locations and outstanding queries. Access is revoked by you. Nothing is held back and there is no data extraction fee. We want any exit to be clean enough that you would consider coming back.",
      })}
    </div>
  </div>`
)}

${ctaBand()}
`;

  return {
    path: "/how-we-work/",
    title: "How We Work: Process, Quality & Transition",
    description:
      "The B4ES operating model: scoping, written proposal, paid pilot, structured transition and steady-state delivery, with second-person review and documented process on every engagement.",
    body,
  };
}

/* ======================================================= engagement models */

export const MODELS = [
  {
    icon: "receipt",
    name: "Per job",
    tagline: "Fixed price per completed output",
    best: "Variable, unpredictable volumes and firms testing the relationship",
    how: "You send a job, we quote or apply an agreed rate card for that job type, and you pay for the completed output. No commitment between jobs and no idle cost when volume drops.",
    good: [
      "Costs scale exactly with the work you send",
      "Nothing to pay in a quiet month",
      "Simplest model to start with and to stop",
      "Easy to recharge to a client fee",
    ],
    watch: [
      "Unit rate is higher than a dedicated resource at volume",
      "Turnaround depends on queue position rather than reserved capacity",
      "Less efficient once volumes become predictable",
    ],
  },
  {
    icon: "clock",
    name: "Ad-hoc hours",
    tagline: "A drawn-down block of hours",
    best: "Overflow, peak-season surge and mixed work that does not fit a job definition",
    how: "You buy a block of hours and draw against it as needed across any service line. Usage is reported so you can see where the time went, and unused hours roll within an agreed window.",
    good: [
      "Flexible across service lines without renegotiating",
      "Well suited to peak-season surge",
      "Transparent usage reporting",
      "No commitment to a fixed monthly cost",
    ],
    watch: [
      "Needs your team to brief work clearly to be efficient",
      "Harder to forecast than a fixed monthly cost",
      "Blocks expire within an agreed period",
    ],
  },
  {
    icon: "user",
    name: "Dedicated resource",
    tagline: "A named individual working only on your files",
    best: "Steady, predictable volume and firms wanting a consistent relationship",
    how: "A named team member works exclusively on your work for an agreed portion of their time (full-time or part-time) at a fixed monthly cost. They learn your clients, your templates and your preferences.",
    good: [
      "Lowest effective unit cost at consistent volume",
      "Deep familiarity with your clients and standards",
      "Predictable fixed monthly cost for budgeting",
      "Direct working relationship with a named person",
    ],
    watch: [
      "You carry the cost whether or not volume arrives",
      "Requires enough steady work to justify the commitment",
      "Cover for absence needs planning into the arrangement",
    ],
  },
  {
    icon: "people",
    name: "Managed team",
    tagline: "A multi-disciplinary pod with a supervisor",
    best: "Larger practices and full finance functions needing several disciplines at once",
    how: "A small team spanning bookkeeping, accounts, tax and payroll, led by a supervisor who owns workflow, quality and reporting. You deal with the supervisor, who allocates the work.",
    good: [
      "Covers several disciplines without separate arrangements",
      "Supervisor absorbs allocation and quality management",
      "Absence cover built into the team",
      "Scales up and down within the team structure",
    ],
    watch: [
      "Highest absolute commitment of the four models",
      "Needs volume across multiple service lines to make sense",
      "Longer transition period to establish properly",
    ],
  },
];

const PRICE_DRIVERS = [
  ["Complexity of the work", "A micro-entity set of accounts is a much smaller job than a consolidated group with foreign subsidiaries, and is priced accordingly."],
  ["Quality of incoming records", "Clean, reconciled data processes quickly. Records requiring reconstruction take longer, and we scope that work separately."],
  ["Volume and predictability", "Steady, forecastable volume is cheaper to resource than sporadic peaks, and the pricing reflects that."],
  ["Turnaround required", "Standard turnaround is priced as standard. Guaranteed priority turnaround reserves capacity and is priced accordingly."],
  ["Seniority required", "Straightforward processing and a review-grade qualified accountant sit at different rates. We assign the level the work needs."],
  ["Software and setup", "Familiar platforms need no ramp. An unusual or legacy system may need a short training period, which we tell you about up front."],
];

export function engagementModelsPage() {
  const body = `
${hero({
  eyebrow: "Engagement models",
  title: "Four ways to buy capacity, and how to tell which one you need.",
  lede:
    "Choosing the wrong model is the most common reason outsourcing looks expensive. A firm with lumpy overflow does not need a dedicated resource; a firm with steady volume is overpaying for per-job. This page explains the trade-offs, including where each model works against you.",
  primary: { href: "/contact/", label: "Get a written proposal" },
  secondary: { href: "/how-we-work/", label: "How we work" },
  aside: illoScene("engagement-models"),
  trail: [{ label: "Home", href: "/" }, { label: "Engagement models" }],
})}

${sec(
  "section",
  `
  ${sectionHead({
    eyebrow: "The four models",
    title: "Each with its downsides",
    lede: "Each model below is the wrong choice in some circumstances. We list those too, since you are better off knowing now than finding out later.",
    max: "max-w-3xl",
  })}
  <div class="mt-12 space-y-5">
    ${MODELS.map(
      (m) => `<div class="rounded-card border border-line bg-white p-7 sm:p-9">
      <div class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div class="icon-tile mb-5">${icon(m.icon, "h-5 w-5")}</div>
          <h2 class="font-display text-[1.5rem] leading-snug text-ink">${m.name}</h2>
          <p class="mt-1.5 text-[0.9375rem] font-semibold text-teal-dark">${m.tagline}</p>
          <p class="mt-4 text-[0.9375rem] leading-relaxed text-slate-deep">${m.how}</p>
          <p class="mt-5 text-[0.8125rem] leading-relaxed text-slate-mid">
            <span class="font-semibold uppercase tracking-[0.1em] text-slate-mid">Best for</span><br>${m.best}
          </p>
        </div>
        <div class="grid gap-7 sm:grid-cols-2 lg:border-l lg:border-line lg:pl-8">
          <div>
            <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal-dark">Where it works</p>
            <ul class="check-list mt-4">${m.good.map((g) => `<li>${g}</li>`).join("")}</ul>
          </div>
          <div>
            <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">Where it does not</p>
            <ul class="dash-list mt-4">${m.watch.map((w) => `<li>${w}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </div>`
    ).join("")}
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Pricing approach",
        title: "Why there is no rate card on this page",
        lede: "A rate card only means something once we know what you are buying. Without that, it is a headline rate you will not end up paying.",
      })}
      <div class="prose-body mt-6">
        <p>Published hourly rates in this market are close to meaningless without context. The same nominal rate can represent a junior processor or a review-grade qualified accountant, standard or priority turnaround, clean records or a reconstruction job. Comparing headline numbers across providers usually compares different things.</p>
        <p>Instead, we fix the number before you decide and keep it fixed afterwards. Our proposal states the price, what is included, what is excluded, and what would trigger a re-quote. Scope changes are quoted before the work happens. There is no onboarding fee, no software surcharge, no minimum-hours clause and no annual uplift written into the small print.</p>
        <p>We are set up to charge meaningfully less than the established UK outsourcing firms while matching their review discipline, which is the commercial reason B4ES exists. We put the number in writing at proposal stage, and you are welcome to benchmark it against anyone.</p>
      </div>
      <a href="/contact/" class="btn-ink mt-8">Request a written proposal</a>
    </div>
    <div class="card">
      <p class="eyebrow">What moves the number</p>
      <p class="mt-3 font-display text-[1.1875rem] leading-snug text-ink">Six factors we assess at scoping</p>
      <dl class="mt-6 space-y-5">
        ${PRICE_DRIVERS.map(
          ([k, v]) => `<div class="border-b border-line pb-5 last:border-0 last:pb-0">
          <dt class="font-display text-[1.0625rem] text-ink">${k}</dt>
          <dd class="mt-1.5 text-[0.9375rem] leading-relaxed text-slate-deep">${v}</dd>
        </div>`
        ).join("")}
      </dl>
    </div>
  </div>`
)}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
    <div>
      ${sectionHead({ eyebrow: "Commercial terms", title: "The things buried in other people's small print" })}
      <a href="/contact/" class="link-arrow mt-6">Ask for the draft agreement ${arrow("h-4 w-4")}</a>
    </div>
    <div>${accordion([
      {
        q: "Is there a minimum commitment or tie-in?",
        a: "No minimum commitment on the pilot, and no long tie-in afterwards. Ongoing engagements run on a notice period that suits the model: shorter for per-job and ad-hoc, longer for a dedicated resource or managed team, because we have made an employment commitment on your behalf. The proposal states that period.",
      },
      {
        q: "What is not included in the price?",
        a: "Work outside the agreed scope, remediation of records materially worse than represented at scoping, and guaranteed priority turnaround where standard was agreed. All three are quoted before the work happens. Nothing is added to an invoice that you have not approved in advance.",
      },
      {
        q: "Are there setup or onboarding fees?",
        a: "No. Transition, process documentation and training on your systems are part of establishing the engagement and are not separately charged. If an unusual system requires a substantial ramp, we tell you at proposal stage rather than invoicing for it afterwards.",
      },
      {
        q: "How does rework get handled commercially?",
        a: "Rework arising from our error is not chargeable and does not consume contracted hours. Rework arising from changed instructions or information provided late is chargeable, quoted before it starts. We keep that distinction clear in both directions.",
      },
      {
        q: "Can we change model as we grow?",
        a: "Yes, and most firms do. The common path is per-job or ad-hoc to establish the relationship, then a dedicated resource once volume proves steady. We will usually raise it before you do, because a firm on the wrong model tends to blame outsourcing for the cost when the model is the problem.",
      },
      {
        q: "How and when do you invoice?",
        a: "Monthly in arrears for ad-hoc and per-job work, monthly in advance for dedicated resources and managed teams. Invoices are itemised against the agreed scope so you can see what you paid for. Payment terms are agreed at contract.",
      },
    ])}</div>
  </div>`
)}

${ctaBand({
  title: "Tell us the shape of your volume and we will tell you the model.",
  body: "Roughly how many jobs, how predictable, and when the peaks land. That is usually enough to identify the right model in a single conversation, and sometimes the answer is that you do not need us yet.",
  primary: { href: "/contact/", label: "Get a written proposal" },
  secondary: { href: "/services/", label: "Browse services" },
})}
`;

  return {
    path: "/engagement-models/",
    title: "Engagement Models & Pricing Approach",
    description:
      "Four outsourcing engagement models (per job, ad-hoc hours, dedicated resource and managed team), with the trade-offs of each, plus how B4ES prices work and what is never added to an invoice.",
    body,
  };
}

/* =============================================================== security */

export const CONTROL_DOMAINS = [
  {
    icon: "lock",
    title: "Access control",
    items: [
      "Work performed inside your systems under named user accounts you create and revoke",
      "Role-based permissions granted on least-privilege principles",
      "Multi-factor authentication enforced on every account and system",
      "Access reviewed at defined intervals and revoked immediately on team change",
      "Session and access logging retained and available for your review",
    ],
  },
  {
    icon: "building",
    title: "Physical and endpoint",
    items: [
      "Controlled delivery floor with access restricted to authorised personnel",
      "No personal devices, mobile phones or removable media on the processing floor",
      "Printing disabled by default and permitted only by documented exception",
      "Company-managed endpoints with full-disk encryption and centralised patching",
      "Clear desk and clear screen policy enforced and monitored",
    ],
  },
  {
    icon: "shield",
    title: "Technical",
    items: [
      "Encryption in transit and at rest across all systems handling client data",
      "Secure file transfer only, with no client data sent as an unencrypted email attachment",
      "Endpoint protection, centralised logging and vulnerability management",
      "Segregated environments so one client's data is never visible to another's team",
      "Backup and recovery tested against defined recovery objectives",
    ],
  },
  {
    icon: "people",
    title: "People",
    items: [
      "Background verification appropriate to the role before access is granted",
      "Individual confidentiality undertakings signed by every team member",
      "Information security and data protection training at induction and annually",
      "Documented joiner, mover and leaver process tied to access revocation",
      "Disciplinary consequences for security breach set out in employment terms",
    ],
  },
];

export const DILIGENCE = [
  "Draft UK GDPR Article 28 data processing agreement for your legal review",
  "Information security policy summary and control framework overview",
  "Support for your international transfer risk assessment and transfer mechanism",
  "Sub-processor disclosure and the notification process for any change",
  "Business continuity and disaster recovery outline with recovery objectives",
  "Incident response and breach notification procedure with defined timescales",
  "Confidentiality and non-solicitation terms in the draft services agreement",
  "Sample working paper file and a completed quality control checklist",
];

export function securityPage() {
  const body = `
${hero({
  eyebrow: "Security & data protection",
  title: "The objection that should come first.",
  lede:
    "Under UK GDPR your practice remains the data controller. If client data is compromised, “the provider did it” is not a defence available to you, to your regulator or to your professional indemnity insurer. This page is written for whoever is doing the diligence.",
  primary: { href: "/contact/", label: "Request the diligence pack" },
  secondary: { href: "/how-we-work/", label: "How we work" },
  pills: ["UK GDPR Article 28 DPA", "ISO 27001-aligned controls", "Named-login working", "Documented breach procedure"],
  aside: illoScene("security"),
  trail: [{ label: "Home", href: "/" }, { label: "Security" }],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Your legal position",
        title: "Controller, processor, and what that obliges you to do",
        lede: "It is worth being precise, because mistakes here land on your firm.",
      })}
      <div class="prose-body mt-6">
        <p>Where we work for an accountancy practice, your firm is the <strong>data controller</strong> and B4ES is a <strong>processor</strong> acting only on your documented instructions. That relationship must be governed by a written agreement meeting the requirements of Article 28 of the UK GDPR, which covers subject matter, duration, purpose, categories of data, confidentiality, security measures, sub-processing, assistance, deletion and audit rights.</p>
        <p>Because processing takes place outside the UK, you also need an appropriate transfer mechanism and a transfer risk assessment on file. Accountancy work routinely involves special category data, and the risk assessment needs to reflect that.</p>
        <p>Separately, your engagement letters and privacy notice need to reflect that client data may be processed by a third party outside the UK. ICAEW and ACCA guidance both address this, and your professional obligations of confidentiality under the relevant Code of Ethics apply in addition to your data protection obligations.</p>
        <p>We provide the documentation to make that straightforward, but the obligation stays with you. Be wary of any provider that implies otherwise.</p>
      </div>
    </div>
    <div class="card-quiet">
      <p class="eyebrow">Diligence pack</p>
      <p class="mt-3 font-display text-[1.1875rem] leading-snug text-ink">Available before any commercial discussion</p>
      <p class="mt-3 text-[0.9375rem] leading-relaxed text-slate-deep">
        We expect to be assessed properly. Ask and we will send:
      </p>
      <ul class="check-list mt-5">${DILIGENCE.map((d) => `<li>${d}</li>`).join("")}</ul>
      <a href="/contact/" class="btn-primary mt-7 w-full">Request the pack</a>
    </div>
  </div>`
)}

${sec(
  "section band-bone",
  `
  ${sectionHead({
    eyebrow: "Controls",
    title: "Four control domains, described specifically",
    lede: "The typical failure points in offshore processing are well documented: weak access management, uncontrolled data export, personal devices on the floor, insecure file transfer and limited monitoring. Each domain below addresses one of them directly.",
    max: "max-w-3xl",
  })}
  <div class="mt-12 grid gap-5 lg:grid-cols-2">
    ${CONTROL_DOMAINS.map(
      (d) => `<div class="card">
      <div class="icon-tile mb-5">${icon(d.icon, "h-5 w-5")}</div>
      <h3 class="h-card">${d.title}</h3>
      <ul class="check-list mt-5">${d.items.map((i) => `<li>${i}</li>`).join("")}</ul>
    </div>`
    ).join("")}
  </div>`
)}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Certification",
        title: "What we hold, and what we do not",
        lede: "B4ES is a new venture. We will not claim certifications we have not earned, and we encourage you to verify every certification claim made by any provider you assess, including the well-established ones.",
      })}
      <div class="prose-body mt-6">
        <p>Our operating controls are built to align with the ISO 27001 Annex A control set and with UK GDPR requirements. Alignment is not the same as certification. Independent certification is on our roadmap and we will publish it here when it is held, dated and verifiable.</p>
        <p>In the meantime, what we can offer a diligence process is documentation, contractual commitment and access: the draft DPA, the control framework, the incident procedure, and direct access to the people responsible, so you can put your questions to them.</p>
      </div>
      ${callout({
        tone: "gold",
        ic: "magnifier",
        title: "A fair question to ask us",
        body: "“Why should we accept controls that are aligned rather than certified?” You may reasonably decide not to. If your firm's supplier policy requires certification, we are not yet the right provider. We would ask only that the assessment is applied consistently: a certificate confirms that a management system was audited on a certain date. It does not show that a specific engagement is well run.",
      })}
    </div>
    <div class="card">
      <p class="eyebrow">Position and roadmap</p>
      <p class="mt-4 text-[0.8125rem] leading-relaxed text-slate-mid">
        Update this table as each item is achieved. Do not list anything here before it is held.
      </p>
      <table class="tbl mt-6">
        <thead><tr><th>Item</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>UK GDPR Article 28 DPA</td><td>Provided on every engagement</td></tr>
          <tr><td>Transfer risk assessment support</td><td>Provided on request</td></tr>
          <tr><td>Confidentiality undertakings</td><td>Signed by all delivery personnel</td></tr>
          <tr><td>ISO 27001 control alignment</td><td>Operating framework aligned</td></tr>
          <tr><td>ICO registration</td><td>Roadmap: on UK incorporation</td></tr>
          <tr><td>Cyber Essentials</td><td>Roadmap: targeted in first year</td></tr>
          <tr><td>ISO 27001 certification</td><td>Roadmap: under assessment</td></tr>
          <tr><td>ISO 9001 certification</td><td>Under consideration</td></tr>
        </tbody>
      </table>
      <p class="mt-6 text-[0.8125rem] leading-relaxed text-slate-mid">
        Current status is confirmed in writing at proposal stage and updated here as it changes.
      </p>
    </div>
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
    <div>
      ${sectionHead({ eyebrow: "Questions", title: "What your diligence process will want to know" })}
    </div>
    <div>${accordion([
      {
        q: "Does client data leave our systems?",
        a: "No. Our teams work inside your software under named logins that you create, permission and revoke. We do not export client data into a B4ES environment and we do not hold copies of your clients' records. Where a file has to be transferred, it goes through an encrypted channel you have approved, never as an email attachment.",
      },
      {
        q: "Who exactly can see our clients' data?",
        a: "Only the named individuals assigned to your engagement, and only for as long as they are assigned. Environments are segregated so one client's work is not visible to another client's team. You receive the list of named individuals at transition and are notified before it changes.",
      },
      {
        q: "What happens if there is a breach?",
        a: "We notify you without undue delay under a documented procedure with defined timescales, and provide the information you need to meet your own obligations, including any 72-hour notification you may owe the ICO. We pass on the facts as we establish them, without waiting for the investigation to finish, because your clock starts when you become aware.",
      },
      {
        q: "Do you use sub-processors?",
        a: "Delivery is provided through our named partner operation, disclosed to you at contract. Any change to sub-processing is notified in advance with a right to object, as Article 28 requires.",
      },
      {
        q: "Can we audit you?",
        a: "Yes. The draft agreement includes audit and inspection rights. In practice most firms are satisfied by documentation review and a call with the people responsible, but the right is contractual rather than discretionary.",
      },
      {
        q: "What happens to data when we leave?",
        a: "Access is revoked by you. Any working papers or files held on our side are returned or securely deleted to your instruction, with written confirmation of deletion. There is no charge for this. We see no justification for an exit fee on data return.",
      },
      {
        q: "Is our professional indemnity position affected?",
        a: "You should check with your insurer, and we would encourage you to do so before contracting rather than after. Most policies contemplate the use of subcontractors provided the work is reviewed by the practice and the practice retains responsibility, which is how our engagements are structured. Even so, your policy wording governs, not our description of it.",
      },
    ])}</div>
  </div>`
)}

${ctaBand({
  eyebrow: "Diligence",
  title: "Ask for the documents before you ask for a price.",
  body: "Start by asking for the draft DPA and the control framework. If our security position does not meet your firm's supplier policy, we both find out in week one instead of week twelve.",
  primary: { href: "/contact/", label: "Request the diligence pack" },
  secondary: { href: "/engagement-models/", label: "Engagement models" },
  points: [
    "Draft DPA and control documentation issued before commercial discussion",
    "Direct access to the people responsible",
    "Written confirmation of certification status at proposal stage",
  ],
})}
`;

  return {
    path: "/security/",
    title: "Security, Data Protection & UK GDPR Compliance",
    description:
      "How B4ES protects client data: UK GDPR Article 28 data processing agreements, ISO 27001-aligned controls, named-login working inside your systems, controlled delivery floor and a documented breach notification procedure.",
    body,
  };
}

/* ================================================================ careers */

export function careersPage() {
  const body = `
${hero({
  eyebrow: "Careers",
  title: "Help set the delivery standard.",
  lede:
    "B4ES is at an early stage, so the people who join now will shape how it operates. It also means much of the business is still being built.",
  primary: { href: `mailto:${SITE.emailCareers}`, label: "Send us your CV" },
  secondary: { href: "/about/", label: "About B4ES" },
  aside: illoScene("careers"),
  trail: [{ label: "Home", href: "/" }, { label: "Careers" }],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
    <div>
      ${sectionHead({ eyebrow: "Who we are looking for", title: "Two sides, two very different roles" })}
      <div class="prose-body mt-6">
        <p><strong>In the UK</strong>, we need people who can hold a professional conversation with a practice partner: scoping engagements, running client relationships and taking responsibility when something needs fixing. Practice experience matters here far more than sales experience.</p>
        <p><strong>On the delivery side</strong>, we need qualified and part-qualified accountants who want serious UK technical work: UK GAAP, FRS 102 and 105, UK tax, and the file discipline that makes work review-ready first time.</p>
      </div>
      <div class="mt-9 grid gap-5 sm:grid-cols-2">
        ${[
          ["handshake", "Client-facing UK roles", "Engagement leads and relationship managers with UK practice experience, an ACA, ACCA, CTA or equivalent qualification, and the judgement to scope work realistically."],
          ["ledger", "Delivery roles", "Qualified and part-qualified accountants across bookkeeping, accounts production, personal and corporate tax, payroll and audit support."],
          ["magnifier", "Reviewers", "Senior reviewers who can hold a quality line under deadline pressure and explain each correction they make."],
          ["cpu", "Operations", "Process, workflow and information security people who make the delivery operation repeatable, so it does not depend on individual heroics."],
        ]
          .map(
            ([ic, t, d]) => `<div class="card">
          <div class="icon-tile mb-4">${icon(ic, "h-5 w-5")}</div>
          <h3 class="font-display text-[1.0625rem] leading-snug text-ink">${t}</h3>
          <p class="mt-2 text-[0.875rem] leading-relaxed text-slate-deep">${d}</p>
        </div>`
          )
          .join("")}
      </div>
    </div>
    <div class="card-quiet">
      <p class="eyebrow">Before you apply</p>
      <p class="mt-3 font-display text-[1.1875rem] leading-snug text-ink">What working here is and is not</p>
      <ul class="check-list mt-6">
        <li>Real UK technical work under UK standards, not offshore data entry</li>
        <li>Structured training and a named reviewer who is accountable for your development</li>
        <li>Direct influence on process while it is still being written</li>
        <li>Clear progression tied to technical capability rather than tenure</li>
      </ul>
      <p class="mt-7 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">The trade-offs</p>
      <ul class="dash-list mt-3">
        <li>It is an early-stage business, with the ambiguity that implies</li>
        <li>Deadline periods are demanding, January most of all</li>
        <li>Quality standards are strict and reviewed, and we do not relax them under pressure</li>
      </ul>
      <div class="mt-7 border-t border-line pt-5">
        <p class="text-[0.875rem] leading-relaxed text-slate-deep">
          No suitable role listed? Send a CV and a short note about the work you want to be doing.
        </p>
        <a href="mailto:${SITE.emailCareers}" class="link-arrow mt-3">${SITE.emailCareers} ${arrow("h-3.5 w-3.5")}</a>
      </div>
    </div>
  </div>`
)}

${ctaBand({
  eyebrow: "Get in touch",
  title: "Tell us what you want to be working on.",
  body: "Skip the generic covering letter and send a short, specific note about the work you want. Include what you are qualified in, what you have delivered, and what you would want from a first year here.",
  primary: { href: `mailto:${SITE.emailCareers}`, label: "Email us your CV" },
  secondary: { href: "/about/", label: "About B4ES" },
  points: [
    "Every application receives a reply",
    "A technical assessment based on the role itself",
    "A frank conversation about what the role involves",
  ],
})}
`;

  return {
    path: "/careers/",
    title: "Careers at B4ES",
    description:
      "Careers at B4ES: UK client-facing roles and qualified delivery roles in outsourced accounting, tax, payroll and audit support for the UK market.",
    body,
  };
}
