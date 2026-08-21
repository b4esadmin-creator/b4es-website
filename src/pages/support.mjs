import { SITE } from "../data/site.mjs";
import { SERVICES } from "../data/services.mjs";
import { icon, arrow } from "../icons.mjs";
import { hero, sectionHead, accordion, ctaBand, callout, sec } from "../components.mjs";

/* ================================================================ contact */

const CONTACT_REASONS = [
  ["I run an accountancy practice", "practice"],
  ["I run a business and need finance support", "business"],
  ["Security or data protection diligence", "diligence"],
  ["Careers", "careers"],
  ["Something else", "other"],
];

export function contactPage() {
  const serviceOptions = SERVICES.map(
    (s) => `<option value="${s.nav}">${s.nav}</option>`
  ).join("");

  const body = `
${hero({
  eyebrow: "Contact",
  title: "Start with a thirty-minute call and no deck.",
  lede:
    "We would rather spend the first conversation understanding where your capacity actually hurts than presenting capability slides. If it turns out outsourcing is not the right answer for your firm, we will say so on that call.",
  primary: { href: "#form", label: "Send an enquiry" },
  secondary: { href: "/security/", label: "Security position" },
  trail: [{ label: "Home", href: "/" }, { label: "Contact" }],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
    <div id="form" class="scroll-mt-28">
      ${sectionHead({
        eyebrow: "Enquiry",
        title: "Tell us what you are dealing with",
        lede: "The more specific you are, the more useful our first reply will be. A real example beats a general enquiry every time.",
      })}

      <!-- ================================================================
           TODO — CONNECT THIS FORM TO A HANDLER.
           Set the action attribute to your form endpoint (Formspree,
           Netlify Forms, Cloudflare Pages Functions, your own API) and
           remove the mailto fallback script at the bottom of this page.
           Until then the form composes a pre-filled email in the visitor's
           mail client, so it is functional but not tracked.
           ================================================================ -->
      <form id="enquiryForm" class="mt-9 space-y-5" method="post" action=""
        data-fallback-email="${SITE.email}">
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="name">Your name</label>
            <input class="field" type="text" id="name" name="name" required autocomplete="name">
          </div>
          <div>
            <label class="field-label" for="company">Firm or company</label>
            <input class="field" type="text" id="company" name="company" autocomplete="organization">
          </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="email">Email</label>
            <input class="field" type="email" id="email" name="email" required autocomplete="email">
          </div>
          <div>
            <label class="field-label" for="phone">Phone <span class="font-normal text-slate-mid">(optional)</span></label>
            <input class="field" type="tel" id="phone" name="phone" autocomplete="tel">
          </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="field-label" for="reason">What brings you here?</label>
            <select class="field" id="reason" name="reason">
              ${CONTACT_REASONS.map(([label, v]) => `<option value="${v}">${label}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="field-label" for="service">Service of most interest</label>
            <select class="field" id="service" name="service">
              <option value="">Not sure yet</option>
              ${serviceOptions}
            </select>
          </div>
        </div>
        <div>
          <label class="field-label" for="message">What are you dealing with?</label>
          <textarea class="field" id="message" name="message" rows="6" required
            placeholder="For example: roughly 180 self assessment clients, January is unmanageable, we are on IRIS and Xero, and we tried an outsourcing provider two years ago that produced files we had to rebuild."></textarea>
        </div>
        <div class="flex items-start gap-3">
          <input type="checkbox" id="consent" name="consent" required
            class="mt-1 h-4 w-4 shrink-0 rounded border-line text-teal focus:ring-teal">
          <label for="consent" class="text-[0.8125rem] leading-relaxed text-slate-deep">
            I am happy for B4ES to contact me about this enquiry. See our
            <a href="/privacy/" class="font-semibold text-teal hover:underline">privacy notice</a>
            for how we handle your information.
          </label>
        </div>
        <button type="submit" class="btn-primary w-full sm:w-auto">Send enquiry</button>
        <p class="text-[0.8125rem] text-slate-mid">
          We reply to every enquiry within one working day.
        </p>
      </form>
    </div>

    <div class="space-y-5">
      <div class="card">
        <p class="eyebrow">Direct</p>
        <ul class="mt-5 space-y-5">
          <li class="flex gap-4">
            <span class="icon-tile">${icon("mail", "h-5 w-5")}</span>
            <span>
              <span class="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">General</span>
              <a href="mailto:${SITE.email}" class="mt-0.5 block font-display text-[1.0625rem] text-ink hover:text-teal">${SITE.email}</a>
            </span>
          </li>
          <li class="flex gap-4">
            <span class="icon-tile">${icon("handshake", "h-5 w-5")}</span>
            <span>
              <span class="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">New business</span>
              <a href="mailto:${SITE.emailSales}" class="mt-0.5 block font-display text-[1.0625rem] text-ink hover:text-teal">${SITE.emailSales}</a>
            </span>
          </li>
          ${
            SITE.phone
              ? `<li class="flex gap-4">
            <span class="icon-tile">${icon("phone", "h-5 w-5")}</span>
            <span>
              <span class="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Telephone</span>
              <a href="tel:${SITE.phoneHref}" class="mt-0.5 block font-display text-[1.0625rem] text-ink hover:text-teal">${SITE.phone}</a>
            </span>
          </li>`
              : ""
          }
          <li class="flex gap-4">
            <span class="icon-tile">${icon("clock", "h-5 w-5")}</span>
            <span>
              <span class="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Hours</span>
              <span class="mt-0.5 block text-[0.9375rem] text-slate-deep">${SITE.hours}</span>
            </span>
          </li>
        </ul>
      </div>

      ${callout({
        tone: "teal",
        ic: "shield",
        title: "Doing supplier diligence?",
        body: "Say so in the message and we will send the draft data processing agreement, the control framework summary and the incident procedure before any commercial conversation. It is a faster route to a decision for both of us.",
      })}

      ${callout({
        tone: "plain",
        ic: "target",
        title: "What happens next",
        body: "A reply within one working day, then a thirty-minute scoping call at a time that suits you. If it goes well, a written proposal within five working days of that call. No pursuit sequence, no drip campaign, and no calls you did not agree to.",
      })}
    </div>
  </div>`
)}

`;

  return {
    path: "/contact/",
    title: "Contact B4ES",
    description:
      "Talk to B4ES about outsourced accounting, tax, payroll and back-office delivery for UK accountancy practices and businesses. Book a thirty-minute scoping call or request our security diligence pack.",
    body,
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact B4ES",
      url: `${SITE.baseUrl}/contact/`,
    },
  };
}

/* =================================================================== FAQs */

const FAQ_GROUPS = [
  {
    title: "The relationship",
    items: [
      {
        q: "Who owns the client relationship?",
        a: "Where we work with an accountancy practice, you do — entirely. Your firm holds the engagement letter, the review responsibility, the advice and the fee. B4ES is contracted to you as a delivery resource and is bound by written non-solicitation. Where we work directly with a business, B4ES holds that engagement and our delivery partner has no relationship with you at all.",
      },
      {
        q: "Will you ever approach our clients?",
        a: "No, and it is a contractual term rather than a courtesy. We do not approach, market to or accept engagements from the client base of a practice we work for. If a practice client approached us directly we would decline and tell you.",
      },
      {
        q: "Do our clients know about you?",
        a: "Only if you choose to tell them. Operationally we can be entirely invisible — your branding, your templates, your email domain. Separately, your UK GDPR obligations require your engagement letters and privacy notice to reflect that data may be processed by a third party outside the UK. That is a disclosure obligation about the arrangement, not a requirement to name us.",
      },
      {
        q: "Can we work with you alongside an existing provider?",
        a: "Yes, and several firms deliberately run two — for resilience, for a specific service line, or to benchmark on quality and price. We are comfortable being the second provider and will not make it awkward.",
      },
    ],
  },
  {
    title: "Quality and control",
    items: [
      {
        q: "How is quality actually controlled?",
        a: "Preparer and reviewer are always different people. Every file passes a second-person review against a standard checklist before it reaches you, and the completed checklist travels with the file naming who prepared it, who reviewed it and what was checked. Each client also has a documented process note covering treatments, preferences and prior-year judgements, so consistency survives staff changes on both sides.",
      },
      {
        q: "We tried outsourcing before and the files were unreviewable. Why is this different?",
        a: "That is the most common failure mode in this market, and it is a file discipline problem rather than a technical one. The accounts were probably right; the file had no lead schedules, no cross-references and no explanation of judgements, so the partner rebuilt it. Our answer is the working paper standard and the completion checklist described above — and we would much rather you tested that on a paid pilot than accepted the claim.",
      },
      {
        q: "What happens when you make a mistake?",
        a: "Rework on our error is not chargeable and does not consume your contracted hours. Every material error also produces a written root-cause note and a documented change to the process for that client, issued to you. An error that does not change a process will recur.",
      },
      {
        q: "Do we get the same people each time?",
        a: "Yes. You get named individuals introduced at transition, not an anonymous pool. If someone changes we tell you in advance and run the handover ourselves against the documented process notes.",
      },
    ],
  },
  {
    title: "Security and compliance",
    items: [
      {
        q: "Where is our data processed?",
        a: "Delivery is provided from our partner's operation in Pakistan, established in 2014, working to UK hours and UK standards. We state this openly on every engagement because you have obligations under UK GDPR that depend on knowing it — and because a provider who is vague about delivery location is telling you something.",
      },
      {
        q: "Does client data leave our systems?",
        a: "No. Our teams work inside your software under named logins you create, permission and revoke. We do not export client data into a B4ES environment. Where a file must be transferred it goes through an encrypted channel you have approved, never as an unencrypted email attachment.",
      },
      {
        q: "What documentation do you provide for our diligence?",
        a: "A draft UK GDPR Article 28 data processing agreement, an information security control framework summary, support for your international transfer risk assessment, sub-processor disclosure, a business continuity outline, the incident and breach notification procedure, and a sample working paper file. All available before any commercial discussion.",
      },
      {
        q: "Are you ISO 27001 certified?",
        a: "Not yet, and we will not say otherwise. Our controls are built to align with the ISO 27001 Annex A control set, and independent certification is on our roadmap — we will publish it here when it is genuinely held. If certification is a hard requirement in your supplier policy, we are not yet the right provider and we would rather establish that in week one.",
      },
      {
        q: "How does this affect our professional indemnity cover?",
        a: "Check with your insurer before contracting. Most policies contemplate subcontracted work provided the practice reviews it and retains responsibility, which is precisely how our engagements are structured — but your policy wording governs.",
      },
    ],
  },
  {
    title: "Commercial",
    items: [
      {
        q: "Why is there no pricing on the website?",
        a: "Because a published rate without context compares nothing useful. The same nominal hourly rate can mean a junior processor or a review-grade qualified accountant, standard or priority turnaround, clean records or a reconstruction. What we commit to is that the figure is written down before you decide and does not move afterwards, and that we are positioned meaningfully below the established UK outsourcing firms.",
      },
      {
        q: "Is there a minimum commitment?",
        a: "Not on the pilot, and no long tie-in afterwards. Ongoing engagements carry a notice period appropriate to the model — shorter for per-job and ad-hoc, longer for a dedicated resource where we have made an employment commitment on your behalf. It is stated in the proposal.",
      },
      {
        q: "Are there hidden costs?",
        a: "No onboarding fee, no software surcharge, no minimum-hours clause and no annual uplift written into the small print. Work outside agreed scope, remediation of records materially worse than represented, and priority turnaround where standard was agreed are all quoted before the work happens.",
      },
      {
        q: "What is the paid pilot?",
        a: "A defined batch of real work — commonly ten to twenty jobs, or one full payroll or VAT cycle — priced as a standalone engagement with no obligation to continue. It exists because we are a new venture with no UK case studies, and asking you to take quality on trust would be unreasonable.",
      },
    ],
  },
  {
    title: "Practicalities",
    items: [
      {
        q: "What software do you work in?",
        a: "Yours. Xero, QuickBooks, Sage, FreeAgent and NetSuite on ledgers; IRIS, CCH, TaxCalc, Digita, VT, Capium and Alphatax on production and tax; BrightPay, Sage, IRIS and Staffology on payroll; Karbon, Senta, BrightManager and TaxDome on practice management; CaseWare, Mercia and Inflo on audit. If yours is not listed, tell us and we will confirm honestly whether we support it now or need a ramp.",
      },
      {
        q: "What are your working hours?",
        a: "Teams work UK hours against UK deadlines. The delivery location is four to five hours ahead of the UK, which in practice means work completed in their afternoon is on your desk at the start of your day.",
      },
      {
        q: "How fast can you turn work around?",
        a: "Typically five to seven working days for year-end accounts from a complete pack, three to five for tax returns and computations, and 24 hours for a draft payroll from complete input data. Priority turnaround is available where agreed in advance, because it means reserving capacity.",
      },
      {
        q: "How quickly can we start?",
        a: "A single service line for a small practice can be live in three to four weeks. A multi-service transition for a larger firm typically runs eight to twelve weeks. We will not compress that to win the work — a rushed transition costs more than a slow one, and usually costs it in your review time.",
      },
      {
        q: "What if we want to stop?",
        a: "You receive a handover pack containing all process documentation, current work-in-progress status, file locations and outstanding queries. Access is revoked by you and anything held on our side is returned or securely deleted with written confirmation. There is no exit fee and no charge for data return.",
      },
    ],
  },
];

export function faqsPage() {
  const body = `
${hero({
  eyebrow: "FAQs",
  title: "The questions worth asking any outsourcing provider.",
  lede:
    "Including the awkward ones. If our answer to any of these differs from a competitor's, that difference is worth interrogating rather than accepting — in either direction.",
  primary: { href: "/contact/", label: "Ask us something else" },
  secondary: { href: "/security/", label: "Security position" },
  trail: [{ label: "Home", href: "/" }, { label: "FAQs" }],
})}

${sec(
  "section",
  `
  <div class="space-y-16">
    ${FAQ_GROUPS.map(
      (g) => `<div class="grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
      <div class="lg:sticky lg:top-28 lg:self-start">
        <h2 class="font-display text-[1.5rem] leading-snug text-ink">${g.title}</h2>
        <p class="mt-2 text-[0.875rem] text-slate-mid">${g.items.length} questions</p>
      </div>
      <div>${accordion(g.items, { open: -1 })}</div>
    </div>`
    ).join("")}
  </div>`
)}

${ctaBand({
  title: "Not answered here?",
  body: "Send the question directly. We would rather deal with a hard question early than discover it was the real objection three meetings in.",
})}
`;

  return {
    path: "/faqs/",
    title: "Frequently Asked Questions",
    description:
      "Answers on client ownership, quality control, UK GDPR and data security, pricing approach, turnaround times and transition for outsourced accounting with B4ES.",
    body,
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_GROUPS.flatMap((g) =>
        g.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        }))
      ),
    },
  };
}
