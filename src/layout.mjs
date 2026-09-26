import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { SITE, NAV, FOOTER_NAV, LEGAL_NAV } from "./data/site.mjs";
import { SERVICES, CATEGORIES } from "./data/services.mjs";
import { icon, arrow } from "./icons.mjs";

/* ------------------------------------------------------------ asset hash */

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

/**
 * Short content hash for a built asset, appended as ?v= so the file can be
 * cached immutably at the edge and still update the moment its bytes change.
 * Falls back to no query string if the file is not built yet.
 */
export function v(relPath) {
  try {
    const buf = readFileSync(join(DIST, relPath));
    return `${relPath}?v=${createHash("sha256").update(buf).digest("hex").slice(0, 10)}`;
  } catch {
    return relPath;
  }
}

const CSS_HREF = "/" + v("assets/css/site.css");
const JS_SRC = "/" + v("assets/js/site.js");
const JS_HEAD = "/" + v("assets/js/head.js");
const ICON_HREF = "/" + v("assets/img/favicon.svg");
const TOUCH_ICON_HREF = "/" + v("assets/img/apple-touch-icon.png");

/* ---------------------------------------------------------------- logo */

// Horizontal lockup from the B4ES brand kit. The white variant is for dark
// surfaces (footer). Intrinsic size is 827x272; CSS sets the rendered height.
const LOGO_SRC = "/" + v("assets/img/b4es-logo.svg");
const LOGO_WHITE_SRC = "/" + v("assets/img/b4es-logo-white.svg");

export function logo({ light = false, cls = "h-11 sm:h-12 lg:h-10 xl:h-11" } = {}) {
  return `<a href="/" class="inline-flex shrink-0 items-center" aria-label="${SITE.name} (${SITE.fullName}) home">
    <img src="${light ? LOGO_WHITE_SRC : LOGO_SRC}" alt="${SITE.name}" width="827" height="272" class="${cls} w-auto">
  </a>`;
}

/* ---------------------------------------------------------------- nav */

function megaServices() {
  const cols = CATEGORIES.map((cat) => {
    const items = SERVICES.filter((s) => s.category === cat.id);
    if (!items.length) return "";
    return `<div>
      <p class="mb-2 px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-slate-mid">${cat.label}</p>
      <ul>
        ${items
          .map(
            (s) => `<li><a class="mega-item" href="/services/${s.slug}/">
              <span class="mega-item-title">${s.nav}</span>
            </a></li>`
          )
          .join("")}
      </ul>
    </div>`;
  }).join("");

  return `<div class="mega">
    <div class="mega-inner grid grid-cols-[1fr_auto]">
      <div class="grid grid-cols-3 gap-x-2 gap-y-6 p-6">${cols}</div>
      <div class="w-[16.5rem] border-l border-line bg-bone p-6">
        <p class="eyebrow">Who we help</p>
        <ul class="mt-3 space-y-1">
          <li><a class="mega-item -mx-4" href="/for-accountants/"><span class="mega-item-title">Accountancy practices</span><span class="mega-item-desc block">White-label delivery capacity</span></a></li>
          <li><a class="mega-item -mx-4" href="/for-business/"><span class="mega-item-title">Growing UK businesses</span><span class="mega-item-desc block">An outsourced finance function</span></a></li>
          <li><a class="mega-item -mx-4" href="/sectors/"><span class="mega-item-title">Sectors</span><span class="mega-item-desc block">Process mapped to your industry</span></a></li>
        </ul>
        <div class="rule my-4"></div>
        <a href="/services/" class="link-arrow">All services ${arrow("h-3.5 w-3.5")}</a>
        <a href="/contact/" class="btn-primary btn-sm mt-4 w-full">Contact us</a>
      </div>
    </div>
  </div>`;
}

function header(current) {
  const items = NAV.map((n) => {
    const active = current && current.startsWith(n.href) && n.href !== "/";
    const cls = `nav-link${active ? " text-teal" : ""}`;
    if (n.mega) {
      const mega = megaServices();
      return `<li class="has-mega static">
        <a href="${n.href}" class="${cls}">${n.label}${icon("chevronDown", "h-3.5 w-3.5 text-slate-soft")}</a>
        ${mega}
      </li>`;
    }
    return `<li><a href="${n.href}" class="${cls}">${n.label}</a></li>`;
  }).join("");

  const mobileLinks = [
    ...NAV.map((n) => ({ label: n.label, href: n.href })),
    { label: "For accountancy practices", href: "/for-accountants/", sub: true },
    { label: "For businesses", href: "/for-business/", sub: true },
    { label: "How we work", href: "/how-we-work/", sub: true },
    { label: "Security", href: "/security/", sub: true },
    { label: "Insights", href: "/insights/", sub: true },
  ]
    .map(
      (n) =>
        `<li><a href="${n.href}" class="block border-b border-line ${n.sub ? "py-3 text-[0.9375rem] text-slate-deep" : "py-3.5 text-[1.0625rem] font-medium text-ink"}">${n.label}</a></li>`
    )
    .join("");

  return `
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

<div class="no-print border-b border-line-dark bg-ink">
  <div class="wrap flex flex-wrap items-center justify-between gap-2 py-2 text-[0.8125rem] text-slate-soft">
    <p class="flex items-start gap-2">${icon("globe", "mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-teal-light")} UK-facing delivery, aligned to UK working hours and UK filing deadlines</p>
    <p class="hidden items-center gap-4 sm:flex">
      <a href="mailto:${SITE.email}" class="transition-colors hover:text-white">${SITE.email}</a>
      ${
        SITE.phone
          ? `<span class="text-white/20">|</span>
      <a href="tel:${SITE.phoneHref}" class="transition-colors hover:text-white">${SITE.phone}</a>`
          : ""
      }
    </p>
  </div>
</div>

<header class="no-print sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
  <div class="wrap relative flex items-center justify-between gap-4 py-3.5">
    ${logo()}
    <nav aria-label="Primary" class="hidden lg:block">
      <ul class="flex items-center gap-0.5">${items}</ul>
    </nav>
    <div class="flex items-center gap-2">
      <button type="button" id="navToggle" aria-expanded="false" aria-controls="mobileNav"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden">
        <span class="sr-only">Open menu</span>
        ${icon("menu", "h-5 w-5")}
      </button>
    </div>
  </div>
  <div class="progress-rail" data-progress aria-hidden="true"><span></span></div>
  <div id="mobileNav" hidden class="border-t border-line bg-white lg:hidden">
    <div class="wrap py-2">
      <ul>${mobileLinks}</ul>
      <a href="/contact/" class="btn-primary mt-5 mb-4 w-full">Contact us</a>
    </div>
  </div>
</header>`;
}

/* ---------------------------------------------------------------- footer */

function footer() {
  const cols = FOOTER_NAV.map(
    (c) => `<div>
    <p class="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-teal-light">${c.title}</p>
    <ul class="space-y-2.5">
      ${c.links
        .map(
          (l) =>
            `<li><a href="${l.href}" class="text-[0.9375rem] text-slate-soft transition-colors hover:text-white">${l.label}</a></li>`
        )
        .join("")}
    </ul>
  </div>`
  ).join("");

  return `
<footer class="no-print band-dark grain">
  <div class="wrap relative z-10 py-16 md:py-20">
    <div class="grid gap-12 lg:grid-cols-[1.15fr_2.4fr]">
      <div>
        ${logo({ light: true, cls: "h-14" })}
        <p class="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-slate-soft">
          ${SITE.fullName}. Outsourced finance, accounting and back-office delivery for
          UK accountancy practices and growing UK businesses.
        </p>
        <div class="mt-7 space-y-3 text-[0.9375rem]">
          <p class="flex items-start gap-3 text-slate-soft">${icon("mail", "mt-0.5 h-4 w-4 shrink-0 text-teal-light")}<a href="mailto:${SITE.email}" class="transition-colors hover:text-white">${SITE.email}</a></p>
          ${
            SITE.phone
              ? `<p class="flex items-start gap-3 text-slate-soft">${icon("phone", "mt-0.5 h-4 w-4 shrink-0 text-teal-light")}<a href="tel:${SITE.phoneHref}" class="transition-colors hover:text-white">${SITE.phone}</a></p>`
              : ""
          }
          <p class="flex items-start gap-3 text-slate-soft">${icon("clock", "mt-0.5 h-4 w-4 shrink-0 text-teal-light")}${SITE.hours}</p>
        </div>
      </div>
      <div class="grid gap-10 sm:grid-cols-3">${cols}</div>
    </div>

    <div class="mt-14 border-t border-white/10 pt-8">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p class="text-[0.8125rem] text-slate-soft/85">
          &copy; ${new Date().getFullYear()} ${SITE.name} (${SITE.fullName}). All rights reserved.
        </p>
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          ${LEGAL_NAV.map(
            (l) =>
              `<li><a href="${l.href}" class="text-[0.8125rem] text-slate-soft/85 transition-colors hover:text-white">${l.label}</a></li>`
          ).join("")}
        </ul>
      </div>
      <p class="mt-6 max-w-4xl text-[0.75rem] leading-relaxed text-slate-soft/75">
        B4ES provides finance, accounting and business process delivery services. We are not a
        firm of registered auditors and we do not provide regulated audit opinions, regulated
        investment advice or legal advice. Where we support audit engagements we act solely as a
        resource under the direction, supervision and review of the appointed registered auditor,
        who retains full responsibility for the engagement and the audit opinion.
      </p>
    </div>
  </div>
</footer>`;
}

/* ---------------------------------------------------------------- page */

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet">`;

/**
 * Strips HTML comments from the rendered output.
 *
 * Source files carry developer notes (TODOs, review warnings, guidance on
 * wiring the contact form). Those are useful in the repo and actively
 * unhelpful in view-source on a live commercial site, so they are removed at
 * build time. JSON-LD blocks contain no comments, so a global strip is safe.
 */
function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

export function page({
  title,
  description,
  path,
  body,
  schema = null,
  ogType = "website",
  noindex = false,
}) {
  const fullTitle =
    path === "/" ? `${SITE.name} — ${title}` : `${title} | ${SITE.name}`;
  const canonical = `${SITE.baseUrl}${path}`;

  const jsonLd = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    : "";

  return stripComments(`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">${
  noindex ? '\n<meta name="robots" content="noindex, follow">' : ""
}
<meta name="theme-color" content="#022454">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${fullTitle}">
<meta name="twitter:description" content="${description}">
<link rel="icon" href="${ICON_HREF}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${TOUCH_ICON_HREF}">
${FONTS}
<link rel="stylesheet" href="${CSS_HREF}">
<script src="${JS_HEAD}"></script>
${jsonLd}
</head>
<body>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="${JS_SRC}" defer></script>
</body>
</html>`);
}
