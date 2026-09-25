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
  primary = { href: "/contact/", label: "Book a scoping call" },
  secondary = { href: "/how-we-work/", label: "See how we work" },
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
 * The figures are an illustrative model and are labelled as such on the page.
 */

function capSeg({ cls, label, from, to, delay = 0 }) {
  return `<span class="cap-seg ${cls}" style="--from:${from}%;--w:${to}%;--d:${delay}">
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
          <p class="text-[0.8125rem] text-slate-mid">Your team's available hours</p>
        </div>
        <div class="cap-track">
          ${TODAY.map(
            (t) => `<span class="cap-seg ${t.cls}" style="--w:${t.v}%">
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
          <p class="mt-2 flex items-center gap-2 text-[0.8125rem] text-slate-deep">
            <span class="cap-moved h-2.5 w-2.5 shrink-0 rounded-[3px]"></span>
            Delivered by B4ES &mdash; <span class="font-semibold text-ink tabular">46%</span> of the
            original workload, moved off your team's plate
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

      <p class="max-w-3xl text-[0.8125rem] leading-relaxed text-slate-mid" data-reveal="fade">
        Illustrative model, not a measured average — we have no UK client base to average yet and
        will not invent one. The proportions come from how compliance-heavy practice time is
        typically distributed; yours is what we actually measure at the scoping call, and the
        answer is sometimes that the shift available to you is smaller than this.
      </p>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------ time-zone strip */

export function timezoneStrip() {
  // 24-hour strip, expressed in UK time.
  const band = (startH, endH) => ({
    left: (startH / 24) * 100,
    width: ((endH - startH) / 24) * 100,
  });

  const uk = band(9, 17.5);      // 09:00–17:30 UK
  const del = band(4, 12.5);     // 09:00–17:30 local, five hours ahead
  const overlap = band(9, 12.5); // when both desks are staffed

  const ticks = [0, 4, 8, 12, 16, 20, 24]
    .map(
      (h) => `<span class="absolute -translate-x-1/2 text-[0.6875rem] text-slate-mid" style="left:${(h / 24) * 100}%">${String(h % 24).padStart(2, "0")}:00</span>`
    )
    .join("");

  const row = (label, b, cls, delay) => `<div class="mb-3" data-reveal="up" style="--d:${delay}">
    <p class="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-[0.8125rem] font-semibold text-ink">
      <span>${label}</span>
      <span class="font-normal tabular text-slate-mid">09:00 &ndash; 17:30 local</span>
    </p>
    <div class="relative h-8 w-full overflow-hidden rounded-md bg-mist">
      <div class="cap-track absolute inset-0 !h-8 !bg-transparent" data-cap>
        <span class="cap-seg" style="--from:0%;--w:${b.left}%;--d:0"></span>
        <span class="cap-seg ${cls}" style="--from:0%;--w:${b.width}%;--d:${delay}"></span>
      </div>
    </div>
  </div>`;

  return `<section class="section">
  <div class="wrap">
    <div class="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
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
                      border-x border-dashed border-teal/45 bg-teal-wash/70"
               style="left:${overlap.left}%;width:${overlap.width}%" aria-hidden="true"></div>

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
    </div>
  </div>
</section>`;
}
