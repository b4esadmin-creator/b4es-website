import { SITE, NAV, FOOTER_NAV, LEGAL_NAV } from "./data/site.mjs";
import { SERVICES, CATEGORIES } from "./data/services.mjs";
import { icon, arrow } from "./icons.mjs";

/* ---------------------------------------------------------------- logo */

export function logoMark(size = 30) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" aria-hidden="true" class="shrink-0">
    <rect width="32" height="32" rx="8" fill="#08161f"/>
    <rect x="7.5" y="17" width="4" height="6" rx="1" fill="#0e9384"/>
    <rect x="14" y="12.5" width="4" height="10.5" rx="1" fill="#35b5a5"/>
    <rect x="20.5" y="8" width="4" height="15" rx="1" fill="#b8894a"/>
  </svg>`;
}

export function logo({ light = false, size = 30 } = {}) {
  const tone = light ? "text-white" : "text-ink";
  return `<a href="/" class="group inline-flex items-center gap-2.5" aria-label="${SITE.name} — ${SITE.fullName}, home">
    ${logoMark(size)}
    <span class="logo-mark ${tone} leading-none">B4<span class="text-teal">ES</span></span>
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
        <p class="eyebrow">Start here</p>
        <p class="mt-3 font-display text-[1.125rem] leading-snug text-ink">Not sure which services to move first?</p>
        <p class="mt-2 text-[0.875rem] leading-relaxed text-slate-mid">Most firms begin with one service line and one cycle. We will tell you which one, based on where your capacity actually hurts.</p>
        <a href="/services/" class="link-arrow mt-4">All services ${arrow("h-3.5 w-3.5")}</a>
        <div class="rule my-5"></div>
        <a href="/contact/" class="btn-primary btn-sm w-full">Book a scoping call</a>
      </div>
    </div>
  </div>`;
}

function megaAudience() {
  const card = (href, title, desc, points) => `<a href="${href}" class="block rounded-xl border border-line bg-white p-6 transition-all hover:border-teal/40 hover:bg-bone">
    <p class="font-display text-[1.1875rem] text-ink">${title}</p>
    <p class="mt-2 text-[0.875rem] leading-relaxed text-slate-mid">${desc}</p>
    <ul class="mt-4 space-y-1.5">
      ${points.map((p) => `<li class="text-[0.8125rem] text-slate-deep">— ${p}</li>`).join("")}
    </ul>
    <span class="link-arrow mt-4">Explore ${arrow("h-3.5 w-3.5")}</span>
  </a>`;

  return `<div class="mega w-[min(50rem,calc(100vw-3rem))]">
    <div class="mega-inner p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        ${card(
          "/for-accountants/",
          "Accountancy practices",
          "White-label delivery capacity that extends your team without adding fixed headcount. You keep the client, the brand and the relationship.",
          ["Compliance and tax delivery", "Peak-season surge capacity", "Fully white-labelled"]
        )}
        ${card(
          "/for-business/",
          "Growing UK businesses",
          "A complete outsourced finance function for businesses that have outgrown a bookkeeper but cannot yet justify a finance team.",
          ["Day-to-day finance operations", "Management reporting", "Fractional CFO input"]
        )}
      </div>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-bone px-5 py-4">
        <p class="text-[0.875rem] text-slate-deep">Working in a specific sector? We map our process to how your industry actually runs.</p>
        <a href="/sectors/" class="link-arrow">Sector expertise ${arrow("h-3.5 w-3.5")}</a>
      </div>
    </div>
  </div>`;
}

function header(current) {
  const items = NAV.map((n) => {
    const active = current && current.startsWith(n.href) && n.href !== "/";
    const cls = `nav-link${active ? " text-teal" : ""}`;
    if (n.mega) {
      const mega = n.mega === "services" ? megaServices() : megaAudience();
      return `<li class="has-mega static">
        <a href="${n.href}" class="${cls}">${n.label}${icon("chevronDown", "h-3.5 w-3.5 text-slate-soft")}</a>
        ${mega}
      </li>`;
    }
    return `<li><a href="${n.href}" class="${cls}">${n.label}</a></li>`;
  }).join("");

  const mobileLinks = [
    ...NAV.map((n) => ({ label: n.label, href: n.href })),
    { label: "For accountancy practices", href: "/for-accountants/" },
    { label: "For businesses", href: "/for-business/" },
    { label: "Sectors", href: "/sectors/" },
    { label: "FAQs", href: "/faqs/" },
    { label: "Careers", href: "/careers/" },
  ]
    .map(
      (n) =>
        `<li><a href="${n.href}" class="block border-b border-line py-3.5 text-[1.0625rem] font-medium text-ink">${n.label}</a></li>`
    )
    .join("");

  return `
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

<div class="no-print border-b border-line-dark bg-ink">
  <div class="wrap flex flex-wrap items-center justify-between gap-2 py-2 text-[0.8125rem] text-slate-soft">
    <p class="flex items-start gap-2">${icon("globe", "mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-teal-light")} UK-facing delivery, aligned to UK working hours and UK filing deadlines</p>
    <p class="hidden items-center gap-4 sm:flex">
      <a href="mailto:${SITE.email}" class="transition-colors hover:text-white">${SITE.email}</a>
      <span class="text-white/20">|</span>
      <a href="tel:${SITE.phoneHref}" class="transition-colors hover:text-white">${SITE.phone}</a>
    </p>
  </div>
</div>

<header class="no-print sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
  <div class="wrap relative flex items-center justify-between gap-6 py-3.5">
    ${logo()}
    <nav aria-label="Primary" class="hidden lg:block">
      <ul class="flex items-center gap-0.5">${items}</ul>
    </nav>
    <div class="flex items-center gap-2">
      <a href="/contact/" class="btn-primary btn-sm hidden sm:inline-flex">Book a scoping call</a>
      <button type="button" id="navToggle" aria-expanded="false" aria-controls="mobileNav"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden">
        <span class="sr-only">Open menu</span>
        ${icon("menu", "h-5 w-5")}
      </button>
    </div>
  </div>
  <div id="mobileNav" hidden class="border-t border-line bg-white lg:hidden">
    <div class="wrap py-2">
      <ul>${mobileLinks}</ul>
      <a href="/contact/" class="btn-primary mt-5 mb-4 w-full">Book a scoping call</a>
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
        ${logo({ light: true, size: 34 })}
        <p class="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-slate-soft">
          ${SITE.fullName}. Outsourced finance, accounting and back-office delivery for
          UK accountancy practices and growing UK businesses.
        </p>
        <div class="mt-7 space-y-3 text-[0.9375rem]">
          <p class="flex items-start gap-3 text-slate-soft">${icon("mail", "mt-0.5 h-4 w-4 shrink-0 text-teal-light")}<a href="mailto:${SITE.email}" class="transition-colors hover:text-white">${SITE.email}</a></p>
          <p class="flex items-start gap-3 text-slate-soft">${icon("phone", "mt-0.5 h-4 w-4 shrink-0 text-teal-light")}<a href="tel:${SITE.phoneHref}" class="transition-colors hover:text-white">${SITE.phone}</a></p>
          <p class="flex items-start gap-3 text-slate-soft">${icon("clock", "mt-0.5 h-4 w-4 shrink-0 text-teal-light")}${SITE.hours}</p>
        </div>
      </div>
      <div class="grid gap-10 sm:grid-cols-3">${cols}</div>
    </div>

    <div class="mt-14 border-t border-white/10 pt-8">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p class="text-[0.8125rem] text-slate-mid">
          &copy; ${new Date().getFullYear()} ${SITE.name} &mdash; ${SITE.fullName}. All rights reserved.
        </p>
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          ${LEGAL_NAV.map(
            (l) =>
              `<li><a href="${l.href}" class="text-[0.8125rem] text-slate-mid transition-colors hover:text-white">${l.label}</a></li>`
          ).join("")}
        </ul>
      </div>
      <p class="mt-6 max-w-4xl text-[0.75rem] leading-relaxed text-slate-mid/80">
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

export function page({
  title,
  description,
  path,
  body,
  schema = null,
  ogType = "website",
}) {
  const fullTitle =
    path === "/" ? `${SITE.name} — ${title}` : `${title} | ${SITE.name}`;
  const canonical = `${SITE.baseUrl}${path}`;

  const jsonLd = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    : "";

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#08161f">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${fullTitle}">
<meta name="twitter:description" content="${description}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/favicon.svg">
${FONTS}
<link rel="stylesheet" href="/assets/css/site.css">
${jsonLd}
</head>
<body>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script>
(function () {
  var btn = document.getElementById('navToggle');
  var nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
  });
})();
</script>
</body>
</html>`;
}
