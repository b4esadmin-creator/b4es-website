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
} from "../components.mjs";

/* ================================================================== about */

// Populate this array to render the leadership section. Each entry:
// { name, role, bio, focus }
export const LEADERSHIP = [];

const VALUES = [
  {
    icon: "target",
    title: "Say the difficult thing early",
    body: "If records are poor, if a deadline is not achievable, if outsourcing is not the answer to your problem — you hear it at the point we know it, not when it becomes unavoidable. Bad news delivered late is the most expensive thing a supplier can do to a client.",
  },
  {
    icon: "scale",
    title: "Price it once",
    body: "The figure in the proposal is the figure on the invoice. Scope changes are quoted before the work happens, not discovered afterwards. Nothing about our commercial model depends on you failing to read carefully.",
  },
  {
    icon: "shield",
    title: "Own the error",
    body: "Rework on our mistake is not chargeable and does not consume your hours. It also generates a written root-cause note and a control change, because an apology that does not change a process is just politeness.",
  },
  {
    icon: "route",
    title: "Build an exit you could use",
    body: "Documented processes, no proprietary lock-in, a defined handover pack. We would rather be kept because we are good than because leaving is painful.",
  },
];

const NOT_US = [
  "We are not a firm of registered auditors and we do not issue audit opinions.",
  "We do not provide regulated investment advice or legal advice.",
  "We do not hold client money or payment authority, and we will not accept it if offered.",
  "We do not sign statutory accounts or tax returns — that authority stays with the appointed adviser.",
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
        <p>B4ES is led from the UK by the people who will be in your scoping call and still involved when the work is running. That is a deliberate structural choice: in this market it is common to be sold to by one team and delivered to by another you never meet, and it is one of the more reliable predictors of a disappointing engagement.</p>
        <p>Delivery is led by our partner's senior finance and advisory management, who have been running this discipline since 2014. Named individuals on both sides are introduced during transition, and you are told in advance if any of them change.</p>
      </div>`;

  const storyTab = `
  <div class="grid items-start gap-14 lg:grid-cols-[1.15fr_1fr]">
    <div>
      ${sectionHead({ eyebrow: "The name", title: "What “Better 4 Enterprise Solutions” actually means" })}
      <div class="prose-body mt-6">
        <p>Outsourced delivery is where we start, because it is where the need is most acute and most measurable. UK accountancy practices cannot recruit fast enough to meet their compliance obligations, and growing UK businesses are stuck between a bookkeeper and a finance team they cannot yet afford. Both problems are solvable now, with capability that already exists.</p>
        <p>But the ambition behind the name is wider than outsourcing. Small and mid-sized enterprises rarely suffer from a single, tidy problem. The finance function is late, the reporting is thin, the people processes are informal, the systems do not talk to each other, and nobody has modelled what happens if the largest customer leaves. Those are not five separate suppliers' problems. They are one business's problem, arriving in five different forms.</p>
        <p>The direction of travel for B4ES is to be the partner that addresses more of that surface — finance first, then the adjacent capability an enterprise needs and cannot justify employing. We are explicit that this is a direction rather than a completed position. We would rather describe the vision honestly than dress the starting point up as something it is not.</p>
      </div>
    </div>
    <div class="card-quiet">
      <p class="eyebrow">Position, stated plainly</p>
      <ul class="mt-6 space-y-5">
        ${[
          ["spark", "New venture, established capability", "B4ES is a new UK-facing business built on a delivery operation that has run since 2014. We do not borrow our partner's client list and present it as our track record."],
          ["handshake", "Independent of the delivery partner", "Your contract, your engagement and your point of contact are with B4ES. The delivery partnership sits behind us and is governed by written agreement."],
          ["globe", "UK-facing by design", "UK working hours, UK standards, UK terminology, UK filing calendar. Not a global service with a UK page bolted onto it."],
          ["magnifier", "Judged on a pilot, not on claims", "We offer a paid pilot on every engagement precisely because we have no UK case studies to point at yet. Test the work."],
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
        title: "Who actually does the work",
        lede: `Our delivery partner, ${PARTNER.name}, is a specialist accounting, tax, advisory and HR consulting firm headquartered in ${PARTNER.hq}, operating since ${PARTNER.founded} across ${PARTNER.offices.length} countries.`,
      })}
      <div class="prose-body mt-6">
        <p>B4ES owns the client relationship entirely. Our partner provides delivery under a written agreement with defined confidentiality, security and data protection obligations. You contract with one party and deal with one party.</p>
      </div>
    </div>
    ${linkCard({
      href: "/strategic-partners/",
      ic: "handshake",
      title: "Our strategic partners",
      body: `${PARTNER.name}'s capability, offices and how the partnership is governed.`,
      cta: "Meet our partners",
    })}
  </div>`;

  const valuesTab = `
  ${sectionHead({
    eyebrow: "How we operate",
    title: "Four commitments for the days something goes wrong",
    lede: "Any supplier looks the same when everything runs smoothly. These describe what we do on the days it does not.",
    max: "max-w-3xl",
  })}
  <div class="mt-10">${grid(VALUES.map((v) => featureCard(v)), 2)}</div>`;

  const peopleTab = `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Boundaries",
        title: "What we are not",
        lede: "Being precise about the limits of a service is more useful to a professional buyer than another paragraph about excellence.",
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
  body: "Bring the objections: data security, quality, control, previous bad experiences, whether the price is too good to be true. Those are more productive first conversations than a capability overview.",
})}
`;

  return {
    path: "/about/",
    title: "About B4ES",
    description:
      "B4ES — Better 4 Enterprise Solutions — is a UK-facing outsourcing and business solutions venture delivering accounting, tax, payroll and advisory support through an established specialist delivery partner operating since 2014.",
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
    body: "Each client gets a process note covering treatments, quirks, preferences and prior-year judgements. It survives staff changes on both sides — which is the point.",
  },
  {
    icon: "inbox",
    title: "Queries batched, evidenced and single-threaded",
    body: "Structured query lists with evidence attached, raised once per cycle rather than dribbled out. Your team answers a list, not a stream of interruptions.",
  },
  {
    icon: "clock",
    title: "Exceptions reported before deadlines, not after",
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
        lede: "Nothing is committed before you have seen work. Every stage ends with something concrete — a document, a batch of files, a signed-off process — rather than a status update.",
      })}
      <div class="mt-8">
        ${callout({
          tone: "plain",
          ic: "clock",
          title: "How long does it take?",
          body: "A single service line for a small practice can be live within three to four weeks. A multi-service transition for a larger firm typically runs eight to twelve weeks. We will not compress that to win the work — a rushed transition costs more than a slow one.",
        })}
      </div>
    </div>
    <div>${steps([
      {
        title: "Scoping call",
        body: "Thirty minutes, no deck. We are trying to establish whether your constraint is genuinely capacity, and if so, where it bites hardest.",
        detail: [
          "Service mix, client base and sector profile",
          "Peak periods and where deadlines currently slip",
          "Software estate across ledgers, production, tax and practice management",
          "Previous outsourcing experience and specifically what went wrong",
          "An honest view on whether we are the right answer",
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
        body: "The stage most providers rush. Access, documentation, people and escalation established properly.",
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
        body: "Delivery to an agreed rhythm, with capacity planned ahead of peaks rather than reacted to.",
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
    lede: "These are the mechanics behind the promise. They are also the questions worth putting to any provider you are comparing us against.",
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
        <p>A job that is technically correct but undocumented still costs your partner an hour to understand. Multiply that across a year and the saving disappears entirely — which is why review burden, not error rate, is the metric we hold ourselves to.</p>
      </div>
      <ul class="check-list mt-7">
        <li>Lead schedule for every material balance, cross-referenced to the trial balance</li>
        <li>Supporting schedules for every figure a reviewer would reasonably challenge</li>
        <li>Judgements written up and flagged rather than buried in a workbook</li>
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
        body: "Rework on our error is not chargeable and does not consume your contracted hours. Beyond that, every material error produces a written root-cause note and a documented change to the process for that client, issued to you. An error that does not change a process will happen again next cycle.",
      })}
      ${callout({
        tone: "gold",
        ic: "people",
        title: "Continuity of people",
        body: "You get named individuals, not an anonymous pool. Where a team member changes we tell you in advance and run the handover ourselves using the documented process notes. Staff turnover is a supplier problem and should never present as a client problem.",
      })}
      ${callout({
        tone: "plain",
        ic: "route",
        title: "If you leave",
        body: "You receive a handover pack: all process documentation, current work-in-progress status, file locations and outstanding queries. Access is revoked by you. Nothing is held hostage and there is no data extraction fee — we would rather you left cleanly and came back than left badly and told people about it.",
      })}
    </div>
  </div>`
)}

${ctaBand()}
`;

  return {
    path: "/how-we-work/",
    title: "How We Work — Process, Quality & Transition",
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
    how: "A named team member works exclusively on your work for an agreed portion of their time — full-time or part-time — at a fixed monthly cost. They learn your clients, your templates and your preferences.",
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
    how: "A small team spanning bookkeeping, accounts, tax and payroll, led by a supervisor who owns workflow, quality and reporting. You deal with the supervisor rather than allocating work individually.",
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
  ["Complexity of the work", "A micro-entity set of accounts and a consolidated group with foreign subsidiaries are not the same job, and should not carry the same price."],
  ["Quality of incoming records", "Clean, reconciled data processes quickly. Records requiring reconstruction take longer, and we scope that separately rather than absorbing it."],
  ["Volume and predictability", "Steady, forecastable volume is cheaper to resource than sporadic peaks, and the pricing reflects that."],
  ["Turnaround required", "Standard turnaround is priced as standard. Guaranteed priority turnaround reserves capacity and is priced accordingly."],
  ["Seniority required", "Straightforward processing and a review-grade qualified accountant sit at different rates. We assign the level the work actually needs."],
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
  trail: [{ label: "Home", href: "/" }, { label: "Engagement models" }],
})}

${sec(
  "section",
  `
  ${sectionHead({
    eyebrow: "The four models",
    title: "Each with its honest downside",
    lede: "Every model below has a set of circumstances where it is the wrong choice. We have listed those too, because you will find them out eventually and it is better that it is now.",
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
        lede: "Because a rate card that means anything requires knowing what you are actually buying — and one that does not require that is a headline rate you will not end up paying.",
      })}
      <div class="prose-body mt-6">
        <p>Published hourly rates in this market are close to meaningless without context. The same nominal rate can represent a junior processor or a review-grade qualified accountant, standard or priority turnaround, clean records or a reconstruction job. Comparing headline numbers across providers usually compares different things.</p>
        <p>What we commit to instead is that the number is fixed before you decide, and fixed afterwards. Our proposal states the price, what is included, what is excluded, and what would trigger a re-quote. Scope changes are quoted before the work happens. There is no onboarding fee, no software surcharge, no minimum-hours clause and no annual uplift written into the small print.</p>
        <p>On positioning: we are structured to sit meaningfully below the established UK outsourcing firms on rate while matching them on review discipline. That is our commercial reason for existing. We will put the number in writing at proposal stage and we are happy for you to benchmark it against anyone.</p>
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
        a: "No minimum commitment on the pilot, and no long tie-in afterwards. Ongoing engagements run on a notice period appropriate to the model — shorter for per-job and ad-hoc, longer for a dedicated resource or managed team, because we have made an employment commitment on your behalf. That period is stated in the proposal, not discovered later.",
      },
      {
        q: "What is not included in the price?",
        a: "Work outside the agreed scope, remediation of records materially worse than represented at scoping, and guaranteed priority turnaround where standard was agreed. All three are quoted before the work happens. Nothing is added to an invoice that you have not approved in advance.",
      },
      {
        q: "Are there setup or onboarding fees?",
        a: "No. Transition, process documentation and training on your systems are part of establishing the engagement and are not separately charged. If a genuinely unusual system requires a substantial ramp, we tell you at proposal stage rather than invoicing for it afterwards.",
      },
      {
        q: "How does rework get handled commercially?",
        a: "Rework arising from our error is not chargeable and does not consume contracted hours. Rework arising from changed instructions or information provided late is chargeable, quoted before it starts. We keep that distinction clear in both directions.",
      },
      {
        q: "Can we change model as we grow?",
        a: "Yes, and most firms do. The common path is per-job or ad-hoc to establish the relationship, then a dedicated resource once volume proves steady. We will usually raise it before you do, because a firm on the wrong model concludes that outsourcing is expensive rather than that the model is wrong.",
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
  body: "Roughly how many jobs, how predictable, and when the peaks land. That is usually enough to identify the right model in a single conversation — including the case where the answer is that you do not need us yet.",
  primary: { href: "/contact/", label: "Get a written proposal" },
  secondary: { href: "/services/", label: "Browse services" },
})}
`;

  return {
    path: "/engagement-models/",
    title: "Engagement Models & Pricing Approach",
    description:
      "Four outsourcing engagement models — per job, ad-hoc hours, dedicated resource and managed team — with the trade-offs of each, plus how B4ES prices work and what is never added to an invoice.",
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
      "Secure file transfer only — no client data sent by unencrypted email attachment",
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
    "Under UK GDPR your practice remains the data controller. If client data is compromised, “the provider did it” is not a defence available to you, to your regulator or to your professional indemnity insurer. So this page is written for the person doing the diligence, not for the person reading the brochure.",
  primary: { href: "/contact/", label: "Request the diligence pack" },
  secondary: { href: "/how-we-work/", label: "How we work" },
  pills: ["UK GDPR Article 28 DPA", "ISO 27001-aligned controls", "Named-login working", "Documented breach procedure"],
  trail: [{ label: "Home", href: "/" }, { label: "Security" }],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Your legal position",
        title: "Controller, processor, and what that actually obliges you to do",
        lede: "Worth being precise, because the consequences of getting this wrong land on your firm rather than on ours.",
      })}
      <div class="prose-body mt-6">
        <p>Where we work for an accountancy practice, your firm is the <strong>data controller</strong> and B4ES is a <strong>processor</strong> acting only on your documented instructions. That relationship must be governed by a written agreement meeting the requirements of Article 28 of the UK GDPR — covering subject matter, duration, purpose, categories of data, confidentiality, security measures, sub-processing, assistance, deletion and audit rights.</p>
        <p>Because processing takes place outside the UK, you also need an appropriate transfer mechanism and a transfer risk assessment on file. And because accountancy work routinely involves special category data, the risk assessment needs to reflect that rather than treat it as ordinary business data.</p>
        <p>Separately, your engagement letters and privacy notice need to reflect that client data may be processed by a third party outside the UK. ICAEW and ACCA guidance both address this, and your professional obligations of confidentiality under the relevant Code of Ethics sit alongside — not instead of — your data protection obligations.</p>
        <p>We provide the documentation to make all of that straightforward. We cannot discharge the obligation for you, and any provider implying otherwise is one to be careful with.</p>
      </div>
    </div>
    <div class="card-quiet">
      <p class="eyebrow">Diligence pack</p>
      <p class="mt-3 font-display text-[1.1875rem] leading-snug text-ink">Available before any commercial discussion</p>
      <p class="mt-3 text-[0.9375rem] leading-relaxed text-slate-deep">
        We would rather be assessed properly than sold to. Ask and we will send:
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
        lede: "B4ES is a new venture. We will not claim certifications we have not earned, and we would encourage you to verify every certification claim made by any provider you are assessing — including the well-established ones.",
      })}
      <div class="prose-body mt-6">
        <p>Our operating controls are built to align with the ISO 27001 Annex A control set and with UK GDPR requirements. Alignment is not certification, and we are explicit about the difference. Independent certification is on our roadmap and we will publish it here when it is genuinely held, dated and verifiable.</p>
        <p>In the meantime, what we can offer a diligence process is documentation, contractual commitment and access: the draft DPA, the control framework, the incident procedure, and the ability to put questions directly to the people responsible rather than to a sales team.</p>
      </div>
      ${callout({
        tone: "gold",
        ic: "magnifier",
        title: "A fair question to ask us",
        body: "“Why should we accept controls that are aligned rather than certified?” The honest answer: you may reasonably decide not to, and if certification is a hard requirement in your firm's supplier policy then we are not yet the right provider. What we would ask is that the assessment is applied consistently — a certificate confirms a management system was audited on a date, not that a specific engagement is well run.",
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
          <tr><td>ICO registration</td><td>Roadmap — on UK incorporation</td></tr>
          <tr><td>Cyber Essentials</td><td>Roadmap — targeted in first year</td></tr>
          <tr><td>ISO 27001 certification</td><td>Roadmap — under assessment</td></tr>
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
        a: "No. Our teams work inside your software under named logins that you create, permission and revoke. We do not export client data into a B4ES environment and we do not hold copies of your clients' records. Where a file genuinely must be transferred, it goes through an encrypted channel you have approved — never as an email attachment.",
      },
      {
        q: "Who exactly can see our clients' data?",
        a: "Only the named individuals assigned to your engagement, and only for as long as they are assigned. Environments are segregated so one client's work is not visible to another client's team. You receive the list of named individuals at transition and are notified before it changes.",
      },
      {
        q: "What happens if there is a breach?",
        a: "We notify you without undue delay under a documented procedure with defined timescales, and provide the information you need to meet your own obligations — including any 72-hour notification you may owe the ICO. You receive the facts as we establish them rather than a summary after the investigation concludes, because your clock starts when you become aware.",
      },
      {
        q: "Do you use sub-processors?",
        a: "Delivery is provided through our named partner operation, disclosed to you at contract. Any change to sub-processing is notified in advance with a right to object, as Article 28 requires. We do not add sub-processors quietly.",
      },
      {
        q: "Can we audit you?",
        a: "Yes. The draft agreement includes audit and inspection rights. In practice most firms are satisfied by documentation review and a call with the people responsible, but the right is contractual rather than discretionary.",
      },
      {
        q: "What happens to data when we leave?",
        a: "Access is revoked by you. Any working papers or files held on our side are returned or securely deleted to your instruction, with written confirmation of deletion. There is no charge for this — an exit fee on data return is a practice we regard as indefensible.",
      },
      {
        q: "Is our professional indemnity position affected?",
        a: "You should check with your insurer, and we would encourage you to do so before contracting rather than after. Most policies contemplate the use of subcontractors provided the work is reviewed by the practice and the practice retains responsibility, which is exactly how our engagements are structured — but your policy wording governs, not our description of it.",
      },
    ])}</div>
  </div>`
)}

${ctaBand({
  eyebrow: "Diligence",
  title: "Ask for the documents before you ask for a price.",
  body: "We would rather your first request was the draft DPA and the control framework than a quote. If our security position does not satisfy your firm's supplier policy, both of us find that out in week one instead of week twelve.",
  primary: { href: "/contact/", label: "Request the diligence pack" },
  secondary: { href: "/engagement-models/", label: "Engagement models" },
  points: [
    "Draft DPA and control documentation issued before commercial discussion",
    "Direct access to the people responsible, not a sales team",
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
  title: "Build the delivery standard, not just the delivery volume.",
  lede:
    "B4ES is early. That means the people joining now shape how this operates rather than inheriting someone else's process — and it means we are honest that this is a build, not a finished machine.",
  primary: { href: `mailto:${SITE.emailCareers}`, label: "Send us your CV" },
  secondary: { href: "/about/", label: "About B4ES" },
  trail: [{ label: "Home", href: "/" }, { label: "Careers" }],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
    <div>
      ${sectionHead({ eyebrow: "Who we are looking for", title: "Two sides, two very different roles" })}
      <div class="prose-body mt-6">
        <p><strong>In the UK</strong>, we need people who can hold a professional conversation with a practice partner — scoping engagements, running client relationships, and being the person accountable when something needs fixing. Practice experience matters here far more than sales experience.</p>
        <p><strong>On the delivery side</strong>, we need qualified and part-qualified accountants who want serious UK technical work rather than repetitive processing: UK GAAP, FRS 102 and 105, UK tax, and the file discipline that makes work genuinely review-ready first time.</p>
      </div>
      <div class="mt-9 grid gap-5 sm:grid-cols-2">
        ${[
          ["handshake", "Client-facing UK roles", "Engagement leads and relationship managers with UK practice experience — ACA, ACCA, CTA or equivalent, and the judgement to scope work realistically."],
          ["ledger", "Delivery roles", "Qualified and part-qualified accountants across bookkeeping, accounts production, personal and corporate tax, payroll and audit support."],
          ["magnifier", "Reviewers", "Senior reviewers who can hold a quality line under deadline pressure and explain a correction rather than just make it."],
          ["cpu", "Operations", "Process, workflow and information security people who make a delivery operation repeatable rather than heroic."],
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
      <p class="eyebrow">Honestly, though</p>
      <p class="mt-3 font-display text-[1.1875rem] leading-snug text-ink">What working here is and is not</p>
      <ul class="check-list mt-6">
        <li>Real UK technical work under UK standards, not offshore data entry</li>
        <li>Structured training and a named reviewer who is accountable for your development</li>
        <li>Direct influence on process while it is still being written</li>
        <li>Clear progression tied to technical capability rather than tenure</li>
      </ul>
      <p class="mt-7 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">And to be clear</p>
      <ul class="dash-list mt-3">
        <li>It is an early-stage business, with the ambiguity that implies</li>
        <li>Deadline periods are genuinely demanding — January is January</li>
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
  body: "We would rather read a short, specific note about the work you want than a generic covering letter. Include what you are qualified in, what you have actually delivered, and what you would want from a first year here.",
  primary: { href: `mailto:${SITE.emailCareers}`, label: "Email us your CV" },
  secondary: { href: "/about/", label: "About B4ES" },
  points: [
    "Every application receives a reply",
    "Technical assessment relevant to the role, not a puzzle test",
    "Honest conversation about what the role actually involves",
  ],
})}
`;

  return {
    path: "/careers/",
    title: "Careers at B4ES",
    description:
      "Careers at B4ES — UK client-facing roles and qualified delivery roles in outsourced accounting, tax, payroll and audit support for the UK market.",
    body,
  };
}
