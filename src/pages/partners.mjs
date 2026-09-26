import { PARTNERS } from "../data/site.mjs";
import { icon, arrow } from "../icons.mjs";
import { hero, sectionHead, featureCard, grid, ctaBand, callout, sec, artNetwork, illoScene } from "../components.mjs";

/* ===================================================== strategic partners */

const HOW_IT_WORKS = [
  {
    icon: "handshake",
    title: "One contract, one point of contact",
    body: "Your engagement, your contract and your relationship are with B4ES. Partners sit behind us under written agreements; you never manage two suppliers.",
  },
  {
    icon: "shield",
    title: "Obligations written down",
    body: "Every partnership carries defined confidentiality, information security and UK GDPR data protection terms that flow down from our agreement with you.",
  },
  {
    icon: "people",
    title: "Named people, introduced in advance",
    body: "The individuals working on your files are introduced by name during transition, and you are told before any of them change.",
  },
];

function partnerProfile(p) {
  return `<div class="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
    <div>
      <p class="eyebrow mb-4">${p.role}</p>
      <h2 class="h-section">${p.name}</h2>
      <p class="lede mt-5">${p.summary}</p>
      <div class="prose-body mt-6">
        <p>What made them the right partner was the breadth of the technical bench rather than the price. That range means we can support specialist requests a pure processing operation would have to decline.</p>
      </div>
      <ul class="mt-7 flex flex-wrap gap-2">
        ${p.offices.map((o) => `<li class="pill">${icon("pin", "h-3.5 w-3.5 text-teal")} ${o}</li>`).join("")}
      </ul>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="${p.url}" target="_blank" rel="noopener" class="btn-primary">Visit ${p.name} ${icon("arrowUpRight", "h-4 w-4")}</a>
        <a href="/why-us/#security" class="btn-outline">How data is protected</a>
      </div>
    </div>
    <div class="card">
      <p class="eyebrow">At a glance</p>
      <dl class="mt-5 grid grid-cols-2 gap-5">
        <div><dt class="stat-label mt-0">Established</dt><dd class="stat-num mt-1 tabular" data-count="${p.founded}">${p.founded}</dd></div>
        <div><dt class="stat-label mt-0">Countries</dt><dd class="stat-num mt-1 tabular" data-count="${p.offices.length}">${p.offices.length}</dd></div>
      </dl>
      <p class="mt-5 text-[0.875rem] text-slate-mid">Headquartered in ${p.hq}</p>
      <div class="rule my-6"></div>
      <p class="font-display text-[1.0625rem] text-ink">Specialist service lines</p>
      <ul class="check-list mt-4">${p.specialisms.map((x) => `<li>${x}</li>`).join("")}</ul>
    </div>
  </div>`;
}

export function partnersPage() {
  const body = `
${hero({
  eyebrow: "Strategic Partners",
  title: "Established capability behind a UK-facing team.",
  lede:
    "B4ES owns the client relationship. Our strategic partners provide specialist delivery capacity behind it, under written agreements, so you get the depth of an established firm through a single UK point of contact.",
  primary: { href: PARTNERS[0].url, label: `Visit ${PARTNERS[0].name}` },
  secondary: { href: "/contact/", label: "Contact us" },
  aside: `<div class="mx-auto max-w-md">${artNetwork("", { left: "B4ES · UK", right: `${PARTNERS[0].name} · ${PARTNERS[0].region}` })}</div>`,
  trail: [{ label: "Home", href: "/" }, { label: "Strategic Partners" }],
})}

${PARTNERS.map((p, i) => sec(`section${i % 2 ? " band-bone" : ""}`, partnerProfile(p))).join("")}

${sec(
  "section band-bone",
  `
  <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
    ${sectionHead({
      eyebrow: "How our partnerships work",
      title: "You deal with one party. The structure behind it is in writing.",
      max: "max-w-3xl",
    })}
    <div data-reveal="right">${illoScene("partners", { eager: false })}</div>
  </div>
  <div class="mt-10">${grid(HOW_IT_WORKS.map((h) => featureCard(h)), 3)}</div>
  <div class="mt-8">
    ${callout({
      tone: "gold",
      ic: "handshake",
      title: "Interested in partnering with B4ES?",
      body: `We are building a small network of specialist firms that complement our finance and back-office delivery. <a href="/contact/" class="font-semibold text-teal-dark hover:underline">Get in touch</a> and tell us what you do.`,
    })}
  </div>`
)}

${ctaBand({
  title: "See the partnership in action on a paid pilot.",
  body: "Meet the people who would work on your files, then judge a real batch of work before any longer arrangement.",
  secondary: { href: "/about/", label: "About B4ES" },
})}
`;

  return {
    path: "/strategic-partners/",
    title: "Strategic Partners",
    description:
      "B4ES strategic partners: theBPO, a specialist accounting, tax and advisory firm established in 2014, delivers B4ES engagements from Pakistan under written confidentiality and UK GDPR terms.",
    body,
  };
}
