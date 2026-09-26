import { SERVICES } from "../data/services.mjs";
import { arrow } from "../icons.mjs";

export function notFoundPage() {
  const picks = [
    { href: "/services/", label: "All services", desc: "Fourteen service lines across accounts, tax, payroll, audit support and advisory." },
    { href: "/for-accountants/", label: "For accountancy practices", desc: "White-label delivery capacity for UK firms." },
    { href: "/for-business/", label: "For businesses", desc: "A complete outsourced finance function." },
    { href: "/contact/", label: "Contact", desc: "Tell us what you need and we will reply within one working day." },
  ];

  const body = `
<section class="band-dark grain relative overflow-hidden">
  <div class="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal/10 blur-3xl"></div>
  <div class="wrap relative z-10 py-20 md:py-28">
    <p class="eyebrow-light mb-5">Error 404</p>
    <h1 class="h-display max-w-3xl text-white">This page does not exist.</h1>
    <p class="mt-6 max-w-xl text-[1.125rem] leading-[1.7] text-slate-soft">
      The link may be out of date, or the address may have been mistyped. Here is where most
      people are heading.
    </p>
    <div class="mt-9 flex flex-wrap gap-3">
      <a href="/" class="btn-primary">Back to the homepage</a>
      <a href="/contact/" class="btn-outline-light">Contact us</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      ${picks
        .map(
          (p) => `<a href="${p.href}" class="card-hover flex flex-col">
        <h2 class="font-display text-[1.125rem] leading-snug text-ink">${p.label}</h2>
        <p class="mt-2 flex-1 text-[0.875rem] leading-relaxed text-slate-mid">${p.desc}</p>
        <span class="link-arrow mt-5">Go ${arrow("h-3.5 w-3.5")}</span>
      </a>`
        )
        .join("")}
    </div>

    <div class="mt-14 border-t border-line pt-10">
      <p class="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-mid">Every service</p>
      <ul class="mt-5 flex flex-wrap gap-2">
        ${SERVICES.map(
          (s) => `<li><a href="/services/${s.slug}/" class="pill transition-colors hover:border-teal hover:text-teal-dark">${s.nav}</a></li>`
        ).join("")}
      </ul>
    </div>
  </div>
</section>
`;

  return {
    path: "/404.html",
    title: "Page not found",
    description: "The page you requested could not be found.",
    body,
  };
}
