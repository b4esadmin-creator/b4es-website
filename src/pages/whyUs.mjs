import { icon, arrow } from "../icons.mjs";
import { PRESSURES, DIFFERENTIATORS, HOW } from "../data/why.mjs";
import { MODELS, CONTROL_DOMAINS } from "./company.mjs";
import {
  hero,
  sectionHead,
  featureCard,
  grid,
  statBand,
  steps,
  ctaBand,
  callout,
  sec,
  tabs,
  linkCard,
  artShield,
  timezoneStrip,
} from "../components.mjs";

/* ================================================================ why us
 *
 * One page, five tabs. Each tab is a short summary that links to the page
 * holding the full detail, so nothing here needs a long scroll.
 */

const edgeTab = `
  ${sectionHead({
    eyebrow: "Our edge",
    title: "Six commitments we are prepared to put in a contract",
    lede: "Most outsourcing pitches are a list of adjectives. These are the specific structural choices that differ between providers, and the ones worth interrogating when you compare us to anyone else.",
    max: "max-w-3xl",
  })}
  <div class="mt-10">${grid(DIFFERENTIATORS.map((d) => featureCard(d)), 3)}</div>
  <div class="card mt-10">
    ${statBand(
      [
        { value: "2014", count: 2014, label: "Year our delivery partner was established" },
        { value: "5", count: 5, label: "Countries in the partner network" },
        { value: "8", count: 8, label: "Specialist service lines behind the team" },
        { value: "5 hrs", count: 5, suffix: " hrs", label: "Ahead of the UK: work lands before you start" },
      ],
      {
        light: false,
        note: "B4ES is a new UK-facing venture built on an established delivery capability. The figures describe our delivery partner; our own track record starts with your pilot, which is precisely why we offer one.",
      }
    )}
  </div>`;

const marketTab = `
  ${sectionHead({
    eyebrow: "The market as it stands",
    title: "Four pressures hitting UK practices at once",
    lede: "The operating conditions of the UK profession in 2026, and why delivery capacity has become a strategic question rather than an administrative one.",
    max: "max-w-3xl",
  })}
  <div class="mt-10">
    ${grid(PRESSURES.map((p) => featureCard({ icon: p.icon, title: p.title, body: p.body, meta: p.meta })), 2)}
  </div>
  <div class="mt-8">
    ${callout({
      tone: "plain",
      ic: "target",
      title: "The honest version of the outsourcing argument",
      body: "Outsourcing does not fix a pricing, workflow or client-quality problem. It magnifies all three. What it does fix is a capacity problem: predictable, process-driven work that consumes qualified hours without generating proportionate fees. If your constraint is something else, we would rather tell you on the first call.",
    })}
  </div>`;

const howTab = `
  <div class="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
    <div>
      ${sectionHead({
        eyebrow: "How we work",
        title: "From first call to steady state in five defined stages",
        lede: "No indefinite discovery phase and no committing before you have seen the work. Every stage has an output you can evaluate before the next one starts.",
      })}
      <div class="mt-8 max-w-sm">
        ${linkCard({
          href: "/how-we-work/",
          ic: "route",
          title: "The full operating model",
          body: "Transition, quality control, continuity and what happens if you leave.",
          cta: "Read how we work",
        })}
      </div>
    </div>
    <div>${steps(HOW)}</div>
  </div>
  <div class="mt-16 border-t border-line pt-14">${timezoneStrip({ bare: true })}</div>`;

const modelsTab = `
  <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
    ${sectionHead({
      eyebrow: "Engagement models",
      title: "Four ways to buy capacity",
      lede: "Start with one service line and one cycle. Move between models as your volume changes; there is no minimum commitment to talk.",
    })}
    <a href="/engagement-models/" class="link-arrow shrink-0">Compare the models in full ${arrow("h-4 w-4")}</a>
  </div>
  <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    ${MODELS.map(
      (m, i) => `<a href="/engagement-models/" class="card-hover flex flex-col" data-reveal="rise" style="--d:${i}">
      <div class="icon-tile mb-4">${icon(m.icon, "h-5 w-5")}</div>
      <h3 class="h-card">${m.name}</h3>
      <p class="mt-1 text-[0.875rem] font-semibold text-teal-dark">${m.tagline}</p>
      <p class="mt-3 text-[0.9375rem] leading-relaxed text-slate-deep"><span class="font-semibold text-ink">Best for:</span> ${m.best}</p>
    </a>`
    ).join("")}
  </div>`;

const securityTab = `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Security & data protection",
        title: "The objection that should come first",
        lede: "Under UK GDPR your firm remains the data controller. If something goes wrong, “the provider did it” is not a defence available to you, so these are the controls we put in writing.",
      })}
      <ul class="check-list mt-7">
        <li>Written UK GDPR Article 28 data processing agreement on every engagement</li>
        <li>Work performed inside your systems under named logins you create and revoke</li>
        <li>Controlled delivery floor: no personal devices, removable media or printing</li>
        <li>Access logging, role-based permissions and enforced multi-factor authentication</li>
      </ul>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="/security/" class="btn-ink">Our full security position</a>
        <a href="/contact/" class="btn-outline">Request the diligence pack</a>
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      ${CONTROL_DOMAINS.map(
        (c, i) => `<div class="card" data-reveal="rise" style="--d:${i}">
        <div class="icon-tile mb-4">${icon(c.icon, "h-5 w-5")}</div>
        <h3 class="font-display text-[1.125rem] text-ink">${c.title}</h3>
        <p class="mt-2 text-[0.875rem] leading-relaxed text-slate-deep">${c.items[0]}.</p>
      </div>`
      ).join("")}
    </div>
  </div>`;

export function whyUsPage() {
  const body = `
${hero({
  eyebrow: "Why B4ES",
  title: "Established-firm quality. A materially better rate. Your client stays yours.",
  lede:
    "The case for B4ES in five parts: what we commit to, the market we work in, how an engagement runs, how you buy it, and how your clients' data is protected. Pick the part you care about most.",
  primary: { href: "/contact/", label: "Contact us" },
  secondary: { href: "/services/", label: "Our services" },
  aside: `<div class="mx-auto max-w-md">${artShield()}</div>`,
  trail: [{ label: "Home", href: "/" }, { label: "Why Us" }],
})}

${sec(
  "section",
  tabs(
    [
      { id: "our-edge", label: "Our edge", content: edgeTab },
      { id: "the-market", label: "The market", content: marketTab },
      { id: "how-we-work", label: "How we work", content: howTab },
      { id: "engagement-models", label: "Engagement models", content: modelsTab },
      { id: "security", label: "Security", content: securityTab },
    ],
    { label: "Why B4ES" }
  )
)}

${ctaBand({
  title: "Test the claims on a paid pilot.",
  body: "A defined batch of real work, priced as a standalone engagement, with no obligation to continue. You judge us on output rather than references.",
  secondary: { href: "/strategic-partners/", label: "Our delivery partner" },
})}
`;

  return {
    path: "/why-us/",
    title: "Why B4ES",
    description:
      "Why UK accountancy practices and businesses choose B4ES: contracted commitments, second-person review, UK working hours, flexible engagement models and UK GDPR-grade security.",
    body,
  };
}
