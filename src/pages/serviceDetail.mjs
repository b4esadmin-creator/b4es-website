import { SERVICES, byslug, CATEGORIES } from "../data/services.mjs";
import { SITE } from "../data/site.mjs";
import { icon, arrow } from "../icons.mjs";
import {
  hero,
  sectionHead,
  featureCard,
  grid,
  accordion,
  ctaBand,
  callout,
  sec,
  illoSpot,
} from "../components.mjs";

const AUDIENCE_LABEL = {
  practice: "Accountancy practices",
  business: "UK businesses",
};

function boundaryBox(s) {
  const forPractice = s.audience.includes("practice");
  if (!forPractice) {
    return callout({
      tone: "plain",
      ic: "handshake",
      title: "Working directly with us",
      body: "Where we deliver this service to a business directly, B4ES holds the engagement, the relationship and the responsibility for the work. Our delivery partner supports us behind the scenes and has no relationship with you. You deal with one party throughout.",
    });
  }
  return `<div class="rounded-card border border-line bg-white p-7">
    <p class="eyebrow">The boundary</p>
    <p class="mt-3 font-display text-[1.1875rem] leading-snug text-ink">What stays with your firm</p>
    <p class="mt-3 text-[0.9375rem] leading-relaxed text-slate-deep">
      This matters more than the task list. A delivery partner that blurs this line creates
      regulatory exposure for you, so we state it explicitly on every engagement.
    </p>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      <div>
        <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal-dark">Yours, always</p>
        <ul class="dash-list mt-3">
          <li>The client engagement and engagement letter</li>
          <li>Professional judgement and final review</li>
          <li>Sign-off, submission authority and the fee</li>
          <li>Client advice and the client relationship</li>
        </ul>
      </div>
      <div>
        <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Ours</p>
        <ul class="dash-list mt-3">
          <li>Preparation, processing and documentation</li>
          <li>Internal second-person review before release</li>
          <li>Turnaround against the agreed timetable</li>
          <li>Rework at our cost where the error is ours</li>
        </ul>
      </div>
    </div>
  </div>`;
}

function deliverableGroup(g) {
  return `<div class="card">
    <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal-dark">${g.label}</p>
    <ul class="check-list mt-5">
      ${g.items.map((i) => `<li>${i}</li>`).join("")}
    </ul>
  </div>`;
}

export function servicePage(slug) {
  const s = byslug(slug);
  const cat = CATEGORIES.find((c) => c.id === s.category);
  const related = (s.related || []).map(byslug).filter(Boolean);

  const audienceHref = s.audience.includes("practice")
    ? "/for-accountants/"
    : "/for-business/";

  const body = `
${hero({
  eyebrow: cat.label,
  title: s.title,
  lede: s.heroLede,
  primary: { href: "/contact/", label: "Discuss this service" },
  secondary: { href: "/engagement-models/", label: "Engagement models" },
  pills: s.audience.map((a) => AUDIENCE_LABEL[a]),
  aside: illoSpot(s.category, { eager: true, cls: "max-w-sm illo-float" }),
  trail: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: s.nav },
  ],
})}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
    <div>
      ${sectionHead({ eyebrow: "The problem", title: s.problem.title })}
      <p class="lede mt-5">${s.problem.body}</p>
      <ul class="check-list mt-7">
        ${s.problem.points.map((p) => `<li>${p}</li>`).join("")}
      </ul>
    </div>
    <div class="card-quiet">
      <p class="eyebrow">At a glance</p>
      <dl class="mt-5 space-y-5">
        <div>
          <dt class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Service line</dt>
          <dd class="mt-1 font-display text-[1.0625rem] text-ink">${cat.label}</dd>
        </div>
        <div>
          <dt class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Delivered for</dt>
          <dd class="mt-1 text-[0.9375rem] text-slate-deep">${s.audience.map((a) => AUDIENCE_LABEL[a]).join(" and ")}</dd>
        </div>
        <div>
          <dt class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Typical cadence</dt>
          <dd class="mt-2 space-y-2.5">
            ${s.cadence
              .map(
                (c) => `<span class="block text-[0.875rem] leading-snug text-slate-deep">
                  <span class="font-semibold text-ink">${c.k}</span> — ${c.v}
                </span>`
              )
              .join("")}
          </dd>
        </div>
        <div>
          <dt class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Engagement models</dt>
          <dd class="mt-2 text-[0.875rem] leading-relaxed text-slate-deep">
            Available per job, on ad-hoc hours, or through a dedicated resource.
            <a href="/engagement-models/" class="font-semibold text-teal hover:underline">Compare models</a>.
          </dd>
        </div>
      </dl>
    </div>
  </div>`
)}

${sec(
  "section band-bone",
  `
  ${sectionHead({
    eyebrow: "Scope",
    title: s.deliverables.title,
    lede: "Scope is agreed in writing before work starts and reviewed at each service review. Anything outside it is quoted separately rather than absorbed quietly and invoiced later.",
    max: "max-w-3xl",
  })}
  <div class="mt-12 grid gap-5 ${
    { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[
      Math.min(s.deliverables.groups.length, 4)
    ]
  }">
    ${s.deliverables.groups.map(deliverableGroup).join("")}
  </div>`
)}

${sec(
  "section",
  `
  <div class="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Software",
        title: "Platforms we work in for this service",
        lede: "We work inside your existing systems under named user accounts. If your stack is not listed, tell us — we will confirm honestly whether we can support it immediately or need a ramp-up period.",
      })}
      <ul class="mt-7 flex flex-wrap gap-2">
        ${s.software.map((x) => `<li class="pill">${x}</li>`).join("")}
      </ul>
    </div>
    <div>${boundaryBox(s)}</div>
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
    <div>
      ${sectionHead({ eyebrow: "Questions", title: `${s.nav} — what firms ask` })}
      <a href="/faqs/" class="link-arrow mt-6">All FAQs ${arrow("h-4 w-4")}</a>
    </div>
    <div>${accordion(s.faqs)}</div>
  </div>`
)}

${
  related.length
    ? sec(
        "section",
        `
  <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
    ${sectionHead({
      eyebrow: "Related",
      title: "Services that usually move together",
      lede: "Most firms start with one service line. These are the ones that most often follow.",
      max: "max-w-2xl",
    })}
    <a href="${audienceHref}" class="link-arrow shrink-0">See the full picture ${arrow("h-4 w-4")}</a>
  </div>
  <div class="mt-11">
    ${grid(
      related.map((r) =>
        featureCard({ icon: r.icon, title: r.nav, body: r.short, href: `/services/${r.slug}/` })
      ),
      3
    )}
  </div>`
      )
    : ""
}

${ctaBand({
  title: `Talk to us about ${s.nav.toLowerCase()}.`,
  body: "Bring a real example — a live job, a difficult client file, a cycle you are behind on. A concrete case tells you far more about a provider than a capability slide ever will.",
})}
`;

  return {
    path: `/services/${s.slug}/`,
    title: s.title,
    description: s.short,
    body,
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      serviceType: cat.label,
      description: s.short,
      provider: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
      areaServed: { "@type": "Country", name: "United Kingdom" },
      mainEntityOfPage: `${SITE.baseUrl}/services/${s.slug}/`,
    },
  };
}

export function allServicePages() {
  return SERVICES.map((s) => servicePage(s.slug));
}
