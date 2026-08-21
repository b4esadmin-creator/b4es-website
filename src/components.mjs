import { icon, arrow } from "./icons.mjs";
import { SITE } from "./data/site.mjs";

/* ------------------------------------------------------------ breadcrumbs */

export function breadcrumbs(trail) {
  return `<nav aria-label="Breadcrumb" class="wrap pt-6">
    <ol class="flex flex-wrap items-center gap-2 text-[0.8125rem] text-slate-mid">
      ${trail
        .map((t, i) =>
          i === trail.length - 1
            ? `<li aria-current="page" class="text-slate-deep">${t.label}</li>`
            : `<li class="flex items-center gap-2"><a href="${t.href}" class="transition-colors hover:text-teal">${t.label}</a><span class="text-slate-soft">/</span></li>`
        )
        .join("")}
    </ol>
  </nav>`;
}

/* ------------------------------------------------------------------ hero */

export function hero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
  pills = [],
  aside = "",
  trail = null,
}) {
  return `<section class="band-dark grain relative overflow-hidden">
  <div class="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-teal/10 blur-3xl"></div>
  <div class="pointer-events-none absolute -bottom-56 -left-32 h-[30rem] w-[30rem] rounded-full bg-gold/[0.07] blur-3xl"></div>
  ${
    trail
      ? `<div class="relative z-10"><nav aria-label="Breadcrumb" class="wrap pt-6"><ol class="flex flex-wrap items-center gap-2 text-[0.8125rem] text-slate-mid">${trail
          .map((t, i) =>
            i === trail.length - 1
              ? `<li aria-current="page" class="text-slate-soft">${t.label}</li>`
              : `<li class="flex items-center gap-2"><a href="${t.href}" class="transition-colors hover:text-teal-light">${t.label}</a><span class="text-white/25">/</span></li>`
          )
          .join("")}</ol></nav></div>`
      : ""
  }
  <div class="wrap relative z-10 py-16 ${aside ? "md:py-24" : "md:py-20"}">
    <div class="grid items-center gap-14 ${aside ? "lg:grid-cols-[1.15fr_1fr]" : ""}">
      <div class="${aside ? "" : "max-w-3xl"}">
        ${eyebrow ? `<p class="eyebrow-light mb-5">${eyebrow}</p>` : ""}
        <h1 class="h-display text-white">${title}</h1>
        ${lede ? `<p class="mt-6 max-w-2xl text-[1.125rem] leading-[1.7] text-slate-soft sm:text-[1.1875rem]">${lede}</p>` : ""}
        ${
          pills.length
            ? `<ul class="mt-7 flex flex-wrap gap-2">${pills
                .map((p) => `<li class="pill-light">${p}</li>`)
                .join("")}</ul>`
            : ""
        }
        <div class="mt-9 flex flex-wrap gap-3">
          ${primary ? `<a href="${primary.href}" class="btn-primary">${primary.label}</a>` : ""}
          ${secondary ? `<a href="${secondary.href}" class="btn-outline-light">${secondary.label}</a>` : ""}
        </div>
      </div>
      ${aside ? `<div>${aside}</div>` : ""}
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------- section head */

export function sectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
  light = false,
  max = "max-w-2xl",
}) {
  const a = align === "center" ? `mx-auto text-center ${max}` : max;
  return `<div class="${a}">
    ${eyebrow ? `<p class="${light ? "eyebrow-light" : "eyebrow"} mb-4">${eyebrow}</p>` : ""}
    <h2 class="h-section ${light ? "text-white" : ""}">${title}</h2>
    ${lede ? `<p class="mt-5 ${light ? "text-[1.0625rem] leading-[1.7] text-slate-soft" : "lede"}">${lede}</p>` : ""}
  </div>`;
}

/* ------------------------------------------------------------ card grids */

export function featureCard({ icon: ic, title, body, href, meta = "" }) {
  const inner = `
    ${ic ? `<div class="icon-tile mb-5">${icon(ic, "h-5 w-5")}</div>` : ""}
    <h3 class="h-card">${title}</h3>
    <p class="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-deep">${body}</p>
    ${meta ? `<p class="mt-4 text-[0.8125rem] text-slate-mid">${meta}</p>` : ""}
    ${href ? `<span class="link-arrow mt-5">Read more ${arrow("h-3.5 w-3.5")}</span>` : ""}`;
  return href
    ? `<a href="${href}" class="card-hover flex flex-col">${inner}</a>`
    : `<div class="card flex flex-col">${inner}</div>`;
}

export function grid(cards, cols = 3, gap = "gap-5") {
  const c =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return `<div class="grid ${gap} ${c}">${cards.join("")}</div>`;
}

/* ----------------------------------------------------------------- stats */

export function statBand(stats, { light = true, note = "" } = {}) {
  return `<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    ${stats
      .map(
        (s) => `<div>
      <p class="${light ? "stat-num-light" : "stat-num"}">${s.value}</p>
      <p class="stat-label ${light ? "text-slate-soft" : ""}">${s.label}</p>
    </div>`
      )
      .join("")}
  </div>
  ${note ? `<p class="mt-9 max-w-3xl text-[0.8125rem] leading-relaxed ${light ? "text-slate-mid" : "text-slate-mid"}">${note}</p>` : ""}`;
}

/* ----------------------------------------------------------------- steps */

export function steps(items, { light = false } = {}) {
  return `<ol class="relative space-y-8">
    ${items
      .map(
        (s, i) => `<li class="relative flex gap-5">
      <div class="flex flex-col items-center">
        <span class="${light ? "num-marker-light" : "num-marker"}">${i + 1}</span>
        ${i < items.length - 1 ? `<span class="mt-2 w-px flex-1 ${light ? "bg-white/12" : "bg-line"}"></span>` : ""}
      </div>
      <div class="pb-2">
        <h3 class="font-display text-[1.1875rem] leading-snug ${light ? "text-white" : "text-ink"}">${s.title}</h3>
        <p class="mt-2 text-[0.9375rem] leading-relaxed ${light ? "text-slate-soft" : "text-slate-deep"}">${s.body}</p>
        ${
          s.detail
            ? `<ul class="check-list ${light ? "check-list-light" : ""} mt-4">${s.detail.map((d) => `<li>${d}</li>`).join("")}</ul>`
            : ""
        }
      </div>
    </li>`
      )
      .join("")}
  </ol>`;
}

/* ------------------------------------------------------------- accordion */

export function accordion(items, { open = 0 } = {}) {
  return `<div class="border-t border-line">
    ${items
      .map(
        (f, i) => `<details class="acc"${i === open ? " open" : ""}>
      <summary>${f.q}${icon("plus", "acc-icon h-5 w-5")}</summary>
      <div class="acc-body">${f.a.startsWith("<") ? f.a : `<p>${f.a}</p>`}</div>
    </details>`
      )
      .join("")}
  </div>`;
}

/* --------------------------------------------------------------- CTA band */

export function ctaBand({
  eyebrow = "Next step",
  title = "Let’s find out where your capacity actually hurts.",
  body = "A 30-minute scoping call, no pitch deck. We look at your service mix, your peak periods and your software, and tell you plainly whether we can help and where we would start.",
  primary = { href: "/contact/", label: "Book a scoping call" },
  secondary = { href: "/how-we-work/", label: "See how we work" },
  points = [
    "No obligation and no minimum commitment to talk",
    "A written proposal within five working days",
    "A paid pilot before any long-term arrangement",
  ],
} = {}) {
  return `<section class="band-dark grain relative overflow-hidden">
  <div class="pointer-events-none absolute -right-32 top-0 h-[26rem] w-[26rem] rounded-full bg-teal/10 blur-3xl"></div>
  <div class="wrap relative z-10 py-18 md:py-24">
    <div class="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <p class="eyebrow-light mb-4">${eyebrow}</p>
        <h2 class="h-section text-white">${title}</h2>
        <p class="mt-5 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-soft">${body}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="${primary.href}" class="btn-primary">${primary.label}</a>
          ${secondary ? `<a href="${secondary.href}" class="btn-outline-light">${secondary.label}</a>` : ""}
        </div>
      </div>
      <div class="card-dark">
        <p class="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-teal-light">What to expect</p>
        <ul class="check-list check-list-light mt-5">
          ${points.map((p) => `<li>${p}</li>`).join("")}
        </ul>
        <div class="mt-6 border-t border-white/10 pt-5 text-[0.875rem] text-slate-soft">
          Prefer email? <a href="mailto:${SITE.email}" class="font-semibold text-teal-light hover:underline">${SITE.email}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------- software band */

export function softwareBand(stack, { light = false } = {}) {
  return `<div class="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
    ${stack
      .map(
        (g) => `<div>
      <p class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ${light ? "text-teal-light" : "text-slate-mid"}">${g.group}</p>
      <ul class="mt-3 flex flex-wrap gap-1.5">
        ${g.items.map((i) => `<li class="${light ? "pill-light" : "pill"}">${i}</li>`).join("")}
      </ul>
    </div>`
      )
      .join("")}
  </div>`;
}

/* --------------------------------------------------------------- callout */

export function callout({ tone = "teal", title, body, ic = "spark" }) {
  const map = {
    teal: "border-teal/25 bg-teal-wash",
    gold: "border-gold/30 bg-gold-wash",
    plain: "border-line bg-bone",
  };
  return `<div class="rounded-card border ${map[tone]} p-6 sm:p-7">
    <div class="flex gap-4">
      <span class="mt-0.5 shrink-0 ${tone === "gold" ? "text-[#8a6430]" : "text-teal-dark"}">${icon(ic, "h-5 w-5")}</span>
      <div>
        <p class="font-display text-[1.0625rem] text-ink">${title}</p>
        <p class="mt-2 text-[0.9375rem] leading-relaxed text-slate-deep">${body}</p>
      </div>
    </div>
  </div>`;
}

/* ------------------------------------------------------------ split panel */

export function splitPanel({ eyebrow, title, body, list = [], side, reverse = false }) {
  return `<div class="grid items-start gap-12 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}">
    <div>
      ${eyebrow ? `<p class="eyebrow mb-4">${eyebrow}</p>` : ""}
      <h2 class="h-section">${title}</h2>
      ${body ? `<div class="prose-body mt-5">${body}</div>` : ""}
      ${list.length ? `<ul class="check-list mt-7">${list.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}
    </div>
    <div>${side}</div>
  </div>`;
}

/* ------------------------------------------------------------------ misc */

export const sec = (cls, inner) => `<section class="${cls}"><div class="wrap">${inner}</div></section>`;
export const secNarrow = (cls, inner) => `<section class="${cls}"><div class="wrap-narrow">${inner}</div></section>`;
