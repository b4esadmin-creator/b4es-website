import { icon, arrow } from "./icons.mjs";
import { SITE } from "./data/site.mjs";
import { v } from "./layout.mjs";

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
  <div class="drift pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-teal/10 blur-3xl" data-drift="34"></div>
  <div class="drift pointer-events-none absolute -bottom-56 -left-32 h-[30rem] w-[30rem] rounded-full bg-gold/[0.07] blur-3xl" data-drift="-26"></div>
  ${
    trail
      ? `<div class="relative z-10"><nav aria-label="Breadcrumb" class="wrap pt-6"><ol class="flex flex-wrap items-center gap-2 text-[0.8125rem] text-slate-mid">${trail
          .map((t, i) =>
            i === trail.length - 1
              ? `<li aria-current="page" class="text-slate-soft">${t.label}</li>`
              : `<li class="flex items-center gap-2"><a href="${t.href}" class="transition-colors hover:text-teal-light">${t.label}</a><span class="text-white/40">/</span></li>`
          )
          .join("")}</ol></nav></div>`
      : ""
  }
  <div class="wrap relative z-10 py-16 ${aside ? "md:py-24" : "md:py-20"}">
    <div class="grid items-center gap-14 ${aside ? "lg:grid-cols-[1.15fr_1fr]" : ""}">
      <div class="${aside ? "" : "max-w-3xl"}">
        ${eyebrow ? `<p class="eyebrow-light mb-5" data-reveal="up" style="--d:0">${eyebrow}</p>` : ""}
        <h1 class="h-display text-white" data-reveal="rise" style="--d:1">${title}</h1>
        ${lede ? `<p class="mt-6 max-w-2xl text-[1.125rem] leading-[1.7] text-slate-soft sm:text-[1.1875rem]" data-reveal="up" style="--d:2">${lede}</p>` : ""}
        ${
          pills.length
            ? `<ul class="mt-7 flex flex-wrap gap-2">${pills
                .map((p, i) => `<li class="pill-light" data-reveal="scale" style="--d:${3 + i}">${p}</li>`)
                .join("")}</ul>`
            : ""
        }
        <div class="mt-9 flex flex-wrap gap-3" data-reveal="up" style="--d:3">
          ${primary ? `<a href="${primary.href}" class="btn-primary">${primary.label}</a>` : ""}
          ${secondary ? `<a href="${secondary.href}" class="btn-outline-light">${secondary.label}</a>` : ""}
        </div>
      </div>
      ${aside ? `<div data-reveal="right" style="--d:2">${aside}</div>` : ""}
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
    ${eyebrow ? `<p class="${light ? "eyebrow-light" : "eyebrow"} mb-4" data-reveal="up" style="--d:0">${eyebrow}</p>` : ""}
    <h2 class="h-section ${light ? "text-white" : ""}" data-reveal="up" style="--d:1">${title}</h2>
    ${lede ? `<p class="mt-5 ${light ? "text-[1.0625rem] leading-[1.7] text-slate-soft" : "lede"}" data-reveal="up" style="--d:2">${lede}</p>` : ""}
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
  return `<div class="grid ${gap} ${c}">${cards
    .map((card, i) => card.replace(/^(\s*<(?:a|div)\b)/, `$1 data-reveal="rise" style="--d:${i % 4}"`))
    .join("")}</div>`;
}

/* ----------------------------------------------------------------- stats */

export function statBand(stats, { light = true, note = "" } = {}) {
  return `<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    ${stats
      .map(
        (s, i) => `<div data-reveal="up" style="--d:${i}">
      <p class="${light ? "stat-num-light" : "stat-num"} tabular"${
        s.count
          ? ` data-count="${s.count}"${s.prefix ? ` data-count-prefix="${s.prefix}"` : ""}${
              s.suffix ? ` data-count-suffix="${s.suffix}"` : ""
            }`
          : ""
      }>${s.value}</p>
      <p class="stat-label ${light ? "text-slate-soft" : ""}">${s.label}</p>
    </div>`
      )
      .join("")}
  </div>
  ${note ? `<p class="mt-9 max-w-3xl text-[0.8125rem] leading-relaxed ${light ? "text-slate-mid" : "text-slate-mid"}">${note}</p>` : ""}`;
}

/* ----------------------------------------------------------------- steps */

export function steps(items, { light = false } = {}) {
  return `<ol class="relative space-y-8" data-draw>
    <span class="draw-line pointer-events-none absolute left-4 top-8 bottom-8 h-auto" aria-hidden="true"></span>
    ${items
      .map(
        (s, i) => `<li class="relative flex gap-5" data-reveal="up" style="--d:${i % 3}">
      <div class="flex flex-col items-center">
        <span class="step-dot ${light ? "num-marker-light" : "num-marker"}">${i + 1}</span>
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
  primary = { href: "/contact/", label: "Contact us" },
  secondary = { href: "/why-us/", label: "Why B4ES" },
  points = [
    "No obligation and no minimum commitment to talk",
    "A written proposal within five working days",
    "A paid pilot before any long-term arrangement",
  ],
} = {}) {
  return `<section class="band-dark grain relative overflow-hidden">
  <div class="drift pointer-events-none absolute -right-32 top-0 h-[26rem] w-[26rem] rounded-full bg-teal/10 blur-3xl" data-drift="30"></div>
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
      <div class="card-dark" data-reveal="right" style="--d:1">
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
        (g, gi) => `<div data-reveal="up" style="--d:${gi % 3}">
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
  return `<div class="rounded-card border ${map[tone]} p-6 sm:p-7" data-reveal="up">
    <div class="flex gap-4">
      <span class="mt-0.5 shrink-0 ${tone === "gold" ? "text-gold-deep" : "text-teal-dark"}">${icon(ic, "h-5 w-5")}</span>
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

/* ------------------------------------------------------------------ tabs
 *
 * Keeps a page short: related sections sit side by side as tabs instead of
 * stacking into a long scroll. Progressive enhancement: without JavaScript
 * the tab bar is not shown and every panel renders in sequence, so no content
 * is ever unreachable. Each panel's id doubles as a deep link, so
 * /why-us/#security opens that tab directly.
 *
 * items: [{ id, label, content }]
 */

export function tabs(items, { label = "Sections", light = false } = {}) {
  return `<div class="tabs${light ? " tabs-light" : ""}" data-tabs>
    <div class="tab-list" role="tablist" aria-label="${label}">
      ${items
        .map(
          (t, i) => `<button type="button" role="tab" class="tab" id="tab-${t.id}" aria-controls="${t.id}"
        aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t.label}</button>`
        )
        .join("")}
    </div>
    ${items
      .map(
        (t) => `<div class="tab-panel scroll-mt-32" role="tabpanel" id="${t.id}" aria-labelledby="tab-${t.id}" tabindex="0">
      ${t.content}
    </div>`
      )
      .join("")}
  </div>`;
}

/* ---------------------------------------------------------- page links
 *
 * Compact "go deeper" cards used at the foot of a section or tab, so the
 * summary stays short and the detail lives on its own page.
 */

export function linkCard({ href, title, body, ic = "arrowRight", cta = "Read more", external = false }) {
  const ext = external ? ` target="_blank" rel="noopener"` : "";
  return `<a href="${href}"${ext} class="card-hover flex flex-col">
    <div class="icon-tile mb-4">${icon(ic, "h-5 w-5")}</div>
    <h3 class="h-card">${title}</h3>
    ${body ? `<p class="mt-2 text-[0.9375rem] leading-relaxed text-slate-deep">${body}</p>` : ""}
    <span class="link-arrow mt-auto pt-5">${cta} ${arrow("h-3.5 w-3.5")}</span>
  </a>`;
}

/* ---------------------------------------------------------- illustrations
 *
 * Inline SVG in the brand palette. Motion is CSS-only (see "illustrations"
 * in styles.css) and switched off under prefers-reduced-motion. All are
 * decorative: aria-hidden, with the meaning carried by the surrounding copy.
 */

// Rising bars and the logo's arrow: capacity growing.
export function artGrowth(cls = "") {
  const bars = [
    [40, 150, 44],
    [96, 118, 76],
    [152, 84, 110],
    [208, 52, 142],
  ];
  return `<svg viewBox="0 0 300 220" class="art ${cls}" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="artArrow" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#05527a"/><stop offset="1" stop-color="#2bb3c9"/>
      </linearGradient>
    </defs>
    <line x1="24" y1="196" x2="276" y2="196" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>
    ${bars
      .map(
        ([x, y, h], i) =>
          `<rect class="art-bar" style="--i:${i}" x="${x}" y="${y}" width="36" height="${h}" rx="5" fill="${
            i === 3 ? "#2bb3c9" : i === 2 ? "#0a8aa3" : i === 1 ? "#05527a" : "#1b4a82"
          }"/>`
      )
      .join("")}
    <path class="art-draw" d="M30 170 C 90 150, 140 120, 176 88 S 238 40, 262 30" fill="none"
      stroke="url(#artArrow)" stroke-width="5" stroke-linecap="round"/>
    <path class="art-pop" d="M248 22 L270 26 L264 48" fill="none" stroke="#2bb3c9" stroke-width="5"
      stroke-linecap="round" stroke-linejoin="round"/>
    <rect class="art-pop art-float" x="252" y="-4" width="18" height="18" rx="2" fill="#e1b76d"/>
  </svg>`;
}

// Two hubs joined by a live connection: UK client side and the delivery team.
export function artNetwork(cls = "", { left = "United Kingdom", right = "Pakistan" } = {}) {
  return `<svg viewBox="0 0 340 220" class="art ${cls}" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="artLink" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#2bb3c9"/><stop offset="1" stop-color="#e1b76d"/>
      </linearGradient>
    </defs>
    <path d="M70 110 C 130 40, 210 40, 270 110" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="2"/>
    <path class="art-flow" d="M70 110 C 130 40, 210 40, 270 110" fill="none" stroke="url(#artLink)"
      stroke-width="3" stroke-linecap="round" stroke-dasharray="6 10"/>
    <path d="M70 130 C 130 190, 210 190, 270 130" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="2"/>
    <path class="art-flow art-flow-rev" d="M70 130 C 130 190, 210 190, 270 130" fill="none" stroke="#2bb3c9"
      stroke-width="3" stroke-linecap="round" stroke-dasharray="6 10" opacity=".7"/>
    ${[
      [70, left, "#2bb3c9"],
      [270, right, "#e1b76d"],
    ]
      .map(
        ([cx, name, c], i) => `<g class="art-pop" style="--i:${i}">
      <circle class="art-pulse" cx="${cx}" cy="120" r="34" fill="${c}" opacity=".16"/>
      <circle cx="${cx}" cy="120" r="22" fill="#022454" stroke="${c}" stroke-width="3"/>
      <circle cx="${cx}" cy="120" r="7" fill="${c}"/>
      <text x="${cx}" y="178" text-anchor="middle" fill="#a3b4c8" font-size="12" font-family="Inter, sans-serif" font-weight="600">${name}</text>
    </g>`
      )
      .join("")}
    <circle class="art-dot" r="5" fill="#fff"><animateMotion dur="3.6s" repeatCount="indefinite"
      path="M70 110 C 130 40, 210 40, 270 110"/></circle>
  </svg>`;
}

// A shield assembling around a document: controls around client data.
export function artShield(cls = "") {
  return `<svg viewBox="0 0 260 220" class="art ${cls}" aria-hidden="true" focusable="false">
    <path class="art-draw" d="M130 22 L206 50 V110 C206 156 172 188 130 202 C88 188 54 156 54 110 V50 Z"
      fill="rgba(43,179,201,.08)" stroke="#2bb3c9" stroke-width="4" stroke-linejoin="round"/>
    <rect class="art-pop" style="--i:1" x="100" y="72" width="60" height="76" rx="6" fill="#022454" stroke="#a3b4c8" stroke-width="2"/>
    ${[88, 102, 116, 130]
      .map((y, i) => `<rect class="art-bar" style="--i:${i + 1}" x="110" y="${y}" width="${i === 3 ? 24 : 40}" height="4" rx="2" fill="#a3b4c8"/>`)
      .join("")}
    <circle class="art-pop" style="--i:3" cx="170" cy="150" r="20" fill="#e1b76d"/>
    <path class="art-draw" style="--i:4" d="M161 150 l6 6 l12 -13" fill="none" stroke="#022454" stroke-width="4"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

/* ---------------------------------------------------- canva illustrations
 *
 * Raster illustrations made in Canva in the brand palette (source design
 * "B4ES navy illustration canvas" in the partners' Canva account). Each is
 * a WebP in two widths under public/assets/img/illustrations/. Scenes sit on
 * navy for dark heroes; "cat-*" spots sit on white, one per service category.
 * All are decorative, so alt is empty and the copy carries the meaning.
 */

const SCENE = { w: 1120, h: 837, sizes: [640, 1120], srcSizes: "(min-width: 1024px) 34rem, 92vw" };
const SPOT = { w: 800, h: 800, sizes: [480, 800], srcSizes: "(min-width: 1024px) 22rem, 70vw" };

function illoImg(name, kind, { eager = false, cls = "" } = {}) {
  const src = (w) => "/" + v(`assets/img/illustrations/${name}-${w}.webp`);
  const [sm, lg] = kind.sizes;
  return `<img src="${src(lg)}" srcset="${src(sm)} ${sm}w, ${src(lg)} ${lg}w" sizes="${kind.srcSizes}"
    width="${kind.w}" height="${kind.h}" alt="" ${eager ? `fetchpriority="high"` : `loading="lazy"`} decoding="async" class="illo-img ${cls}">`;
}

// Navy scene framed for a dark hero or band. `name` is the file stem, e.g. "services".
export function illoScene(name, { eager = true } = {}) {
  return `<div class="illo-frame illo-float" aria-hidden="true">${illoImg(name, SCENE, { eager })}</div>`;
}

// White-background spot on a rounded card; reads on dark and light surfaces.
export function illoSpot(category, { eager = false, cls = "" } = {}) {
  return `<div class="illo-spot ${cls}" aria-hidden="true">${illoImg(`cat-${category}`, SPOT, { eager })}</div>`;
}

/* ---------------------------------------------------------- video band
 *
 * Full-width band at the top of the home page (layout after pwc.com): the
 * partners' 46-second B4ES video edge to edge, nothing laid over it because
 * the video carries its own headlines, with the hero copy directly below.
 * Browsers only autoplay muted video, so it starts silent; small Pause and
 * Sound buttons sit top-right (site.js). Pause is required for motion that
 * autoplays for more than five seconds (WCAG 2.2.2). Under reduced motion it
 * stays paused with native controls. The slide text is repeated for screen
 * readers.
 */

export function videoBand() {
  const mp4 = "/" + v("assets/video/b4es-loop.mp4");
  const webm = "/" + v("assets/video/b4es-loop.webm");
  const poster = "/" + v("assets/video/b4es-loop-poster.webp");
  return `<section class="video-band" aria-label="B4ES introduction video">
  <figure class="video-band-inner">
    <video class="video-band-media" poster="${poster}" width="832" height="468"
      autoplay muted loop playsinline preload="metadata" aria-describedby="heroVideoText" data-hero-video>
      <source src="${mp4}" type="video/mp4">
      <source src="${webm}" type="video/webm">
    </video>
    <div class="video-band-controls" data-hero-controls>
      <button type="button" class="video-band-btn" data-hero-pause aria-pressed="false">
        ${icon("pause", "h-3.5 w-3.5")}<span data-hero-pause-label>Pause</span>
      </button>
      <button type="button" class="video-band-btn" data-hero-sound aria-pressed="false">
        ${icon("volume", "h-3.5 w-3.5")}<span data-hero-sound-label>Sound on</span>
      </button>
    </div>
    <figcaption id="heroVideoText" class="sr-only">
      A short animated introduction to B4ES. Your fee earners are spending 62% of their week on
      compliance processing; it does not have to be that way. B4ES delivers the processing and you
      keep the relationships. Services include bookkeeping and year-end accounts; VAT, MTD and
      corporation tax; payroll and HR; and management accounts and CFO advisory: 14 service lines,
      one agreed scope, your brand and your software. Market-leading quality, materially better
      pricing, and the client relationship stays with you, in writing. b4es.co.uk, info@b4es.co.uk.
    </figcaption>
  </figure>
</section>`;
}

/* ------------------------------------------------------------------ misc */

export const sec = (cls, inner) => `<section class="${cls}"><div class="wrap">${inner}</div></section>`;
export const secNarrow = (cls, inner) => `<section class="${cls}"><div class="wrap-narrow">${inner}</div></section>`;

/* --------------------------------------------------- capacity transfer
 *
 * The signature scroll piece. Two bars show the same team's week before and
 * after the processing moves out; a third lane shows what B4ES absorbed.
 * Segment widths animate from the "today" values to the "with B4ES" values
 * when the block enters view, so the reader literally watches capacity move.
 *
 * The figures are an illustrative model, flagged by the "Illustrative
 * example" label above the first bar.
 */

// Widths and delays are classes (cap-w-*, cap-from-*, cap-d-* in styles.css),
// not style attributes: the CSP's style-src blocks inline styles, which left
// every segment at zero width on phones. Add a class there for any new value.
function capSeg({ cls, label, from, to, delay = 0 }) {
  return `<span class="cap-seg ${cls} cap-from-${from} cap-w-${to} cap-d-${delay}">
    <span class="cap-seg-label">${label}</span>
  </span>`;
}

/**
 * Narrow segments cannot hold a legible label, so below `md` the labels are
 * hidden and this legend carries them instead. Percentages appear here at
 * every width — they are the point of the graphic.
 */
function capLegend(items) {
  return `<ul class="mt-3 flex flex-wrap gap-x-5 gap-y-2 lg:mt-2">
    ${items
      .map(
        (i) => `<li class="flex items-center gap-2 text-[0.8125rem] text-slate-deep">
      <span class="h-2.5 w-2.5 shrink-0 rounded-[3px] ${i.cls}"></span>
      <span><span class="lg:hidden">${i.label} </span><span class="font-semibold text-ink tabular">${i.pct}%</span></span>
    </li>`
      )
      .join("")}
  </ul>`;
}

export function capacityTransfer() {
  const TODAY = [
    { cls: "cap-compliance", label: "Compliance processing", v: 62 },
    { cls: "cap-review", label: "Review", v: 22 },
    { cls: "cap-advisory", label: "Advisory", v: 16 },
  ];

  const AFTER = [
    { cls: "cap-compliance", label: "Processing retained", from: 62, to: 16 },
    { cls: "cap-review", label: "Review & oversight", from: 22, to: 26 },
    { cls: "cap-advisory", label: "Advisory & client work", from: 16, to: 58 },
  ];

  return `<section class="section band-bone">
  <div class="wrap">
    ${sectionHead({
      eyebrow: "The core idea",
      title: "Watch where your fee earners' week actually goes",
      lede: "Outsourcing is not really about cost per hour. It is about which hours your most expensive people spend on work that only they can do. This is the same team, the same headcount, in both rows.",
      max: "max-w-3xl",
    })}

    <div class="mt-12 space-y-9">

      <div data-reveal="up">
        <div class="mb-3 flex items-baseline justify-between gap-4">
          <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-mid">Today</p>
          <p class="text-[0.8125rem] text-slate-mid">Illustrative example: your team's hours</p>
        </div>
        <div class="cap-track">
          ${TODAY.map(
            (t) => `<span class="cap-seg ${t.cls} cap-w-${t.v}">
            <span class="cap-seg-label">${t.label}</span>
          </span>`
          ).join("")}
        </div>
        ${capLegend(TODAY.map((t) => ({ cls: t.cls, label: t.label, pct: t.v })))}
      </div>

      <div data-reveal="up" style="--d:1">
        <div class="mb-3 flex items-baseline justify-between gap-4">
          <p class="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal-dark">With B4ES delivering the processing</p>
          <p class="text-[0.8125rem] text-slate-mid">Same team, same headcount</p>
        </div>
        <div class="cap-track" data-cap>
          ${AFTER.map((a, i) => capSeg({ ...a, delay: i })).join("")}
        </div>
        ${capLegend(AFTER.map((a) => ({ cls: a.cls, label: a.label, pct: a.to })))}

        <div class="mt-5">
          <div class="cap-track h-9" data-cap>
            ${capSeg({ cls: "cap-moved", label: "Delivered by B4ES", from: 0, to: 46, delay: 3 })}
          </div>
          <p class="mt-2 flex items-start gap-2 text-[0.8125rem] text-slate-deep">
            <span class="cap-moved mt-1 h-2.5 w-2.5 shrink-0 rounded-[3px]"></span>
            <span>Delivered by B4ES &mdash; <span class="font-semibold text-ink tabular">46%</span> of the
            original workload, moved off your team's plate</span>
          </p>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-3">
        ${[
          ["Advisory & client work", 58, "%", "up from 16%"],
          ["Processing still in-house", 16, "%", "down from 62%"],
          ["Headcount added", 0, "", "no recruitment, no fixed cost"],
        ]
          .map(
            ([label, n, suffix, note], i) => `<div class="card" data-reveal="rise" style="--d:${i}">
          <p class="stat-num tabular" data-count="${n}"${suffix ? ` data-count-suffix="${suffix}"` : ""}>${n}${suffix}</p>
          <p class="mt-2 font-display text-[1.0625rem] leading-snug text-ink">${label}</p>
          <p class="mt-1 text-[0.875rem] text-slate-mid">${note}</p>
        </div>`
          )
          .join("")}
      </div>

    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------ time-zone strip */

export function timezoneStrip({ bare = false } = {}) {
  // 24-hour strip, expressed in UK time. Positions are classes keyed by
  // hour (tz-at-*, tz-w-* in styles.css) because the CSP blocks inline styles.
  const hr = (h) => String(h).replace(".", "_");
  const band = (startH, endH) => ({ left: hr(startH), width: hr(endH - startH) });

  const uk = band(9, 17.5);      // 09:00–17:30 UK
  const del = band(4, 12.5);     // 09:00–17:30 local, five hours ahead
  const overlap = band(9, 12.5); // when both desks are staffed

  const ticks = [0, 4, 8, 12, 16, 20, 24]
    .map(
      (h) => `<span class="absolute -translate-x-1/2 text-[0.6875rem] text-slate-mid tz-at-${h}">${String(h % 24).padStart(2, "0")}:00</span>`
    )
    .join("");

  const row = (label, b, cls, delay) => `<div class="mb-3" data-reveal="up" style="--d:${delay}">
    <p class="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-[0.8125rem] font-semibold text-ink">
      <span>${label}</span>
      <span class="font-normal tabular text-slate-mid">09:00 &ndash; 17:30 local</span>
    </p>
    <div class="relative h-8 w-full overflow-hidden rounded-md bg-mist">
      <div class="cap-track absolute inset-0 !h-8 !bg-transparent" data-cap>
        <span class="cap-seg cap-from-0 tz-w-${b.left} cap-d-0"></span>
        <span class="cap-seg ${cls} cap-from-0 tz-w-${b.width} cap-d-${delay}"></span>
      </div>
    </div>
  </div>`;

  const inner = `<div class="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        ${sectionHead({
          eyebrow: "The overnight advantage",
          title: "Work lands before your day starts",
          lede: "The delivery floor runs four to five hours ahead of the UK. Their afternoon is your morning, so a job sent at the end of your day is on your desk when you open your laptop.",
        })}
        <ul class="check-list mt-7">
          <li data-reveal="up" style="--d:0">A full delivery shift completes before your office opens</li>
          <li data-reveal="up" style="--d:1">Three and a half hours of live overlap for queries and escalation every working day</li>
          <li data-reveal="up" style="--d:2">Deadline days effectively gain a shift rather than losing an evening</li>
        </ul>
      </div>

      <div class="card" data-tz>
        <p class="eyebrow">A working day, in UK time</p>

        <div class="relative mt-6">
          <!-- Overlap column, drawn through both rows so the shared hours read
               as one continuous band rather than a detached tag. -->
          <div class="pointer-events-none absolute top-6 bottom-0 z-0 rounded
                      border-x border-dashed border-teal/45 bg-teal-wash/70
                      tz-at-${overlap.left} tz-span-${overlap.width}" aria-hidden="true"></div>

          <div class="relative z-10">
            ${row("Your office", uk, "cap-advisory", 0)}
            ${row("B4ES delivery floor", del, "cap-compliance", 1)}
          </div>
        </div>

        <div class="relative mt-1 h-4">${ticks}</div>

        <div class="mt-5 flex items-start gap-3 border-t border-line pt-4" data-reveal="fade" style="--d:3">
          <span class="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-dashed border-teal/60 bg-teal-wash"></span>
          <p class="text-[0.875rem] leading-relaxed text-slate-deep">
            <span class="font-semibold text-ink">09:00 &ndash; 12:30</span> &mdash; both desks staffed.
            Work completed on the delivery floor after that lands overnight, ready for review when
            your office opens.
          </p>
        </div>
      </div>
    </div>`;

  return bare ? inner : `<section class="section"><div class="wrap">${inner}</div></section>`;
}
