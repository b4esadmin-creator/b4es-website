import { SITE } from "../data/site.mjs";
import { SERVICES } from "../data/services.mjs";
import { icon, arrow } from "../icons.mjs";
import {
  hero,
  sectionHead,
  featureCard,
  grid,
  ctaBand,
  sec,
  tabs,
  linkCard,
  capacityTransfer,
  videoBand,
} from "../components.mjs";
import { DIFFERENTIATORS } from "../data/why.mjs";

// The proposition, set just under the hero so the hero can carry the
// illustration. Wording unchanged from when it sat in the hero aside.
const proposition = `
<section class="section-tight">
  <div class="wrap grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
    <div data-reveal="up">
      <p class="eyebrow mb-4">The proposition</p>
      <p class="font-display text-[1.625rem] leading-snug text-ink sm:text-[1.875rem]">
        Market-leading quality. Materially better pricing. Your client stays yours.
      </p>
      <div class="mt-7 flex items-start gap-3 border-t border-line pt-5">
        <span class="mt-0.5 text-teal">${icon("shield", "h-5 w-5")}</span>
        <p class="text-[0.9375rem] leading-snug text-slate-deep">
          UK GDPR Article 28 data processing agreement on every engagement. No client data leaves your systems.
        </p>
      </div>
    </div>
    <ul class="check-list" data-reveal="up" style="--d:1">
      <li>Delivery capacity for UK accountancy practices, fully white-labelled</li>
      <li>A complete outsourced finance function for growing UK businesses</li>
      <li>Backed by a specialist finance and advisory firm operating since 2014</li>
      <li>Structured, staffed and managed around UK deadlines and UK working hours</li>
    </ul>
  </div>
</section>`;

export function homePage() {
  const practiceServices = SERVICES.filter((s) => s.audience.includes("practice")).slice(0, 6);
  const businessServices = SERVICES.filter((s) => s.audience.includes("business")).slice(0, 3);

  const body = `
${videoBand()}

${hero({
  eyebrow: "Better 4 Enterprise Solutions",
  title: "Delivery capacity for UK accountancy practices and the businesses they serve.",
  lede:
    "Outsourced accounting, tax, payroll and back-office delivery for UK firms and growing UK businesses. The technical standard of the established outsourcing names, at a materially better rate, with the client relationship staying with you.",
  primary: { href: "/contact/", label: "Contact us" },
  secondary: { href: "/why-us/", label: "Why B4ES" },
})}

<section class="border-b border-line bg-bone py-6">
  <div class="wrap flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-center">
    ${[
      ["shield", "UK GDPR Article 28 DPA"],
      ["lock", "ISO 27001-aligned controls"],
      ["handshake", "Contractual non-solicitation"],
      ["clock", "UK working hours"],
      ["magnifier", "Second-person review"],
    ]
      .map(
        ([ic, label], i) =>
          `<span class="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-slate-deep" data-reveal="up" style="--d:${i}">
            <span class="text-teal">${icon(ic, "h-4 w-4")}</span>${label}
          </span>`
      )
      .join("")}
  </div>
</section>

${proposition}

${sec(
  "section",
  `
  ${sectionHead({
    eyebrow: "Explore B4ES",
    title: "Everything you need to decide, in four places",
    lede: "Each page is short and gets to the point. Start wherever your question is.",
    max: "max-w-2xl",
  })}
  <div class="mt-10">
    ${grid(
      [
        linkCard({ href: "/about/", ic: "compass", title: "About Us", body: "Who we are, what the name means, and the commitments we work to.", cta: "About B4ES" }),
        linkCard({ href: "/why-us/", ic: "target", title: "Why Us", body: "Our edge, how an engagement runs, how you buy it and how data is protected.", cta: "Why B4ES" }),
        linkCard({ href: "/services/", ic: "layers", title: "Services", body: "Fourteen service lines across accounts, tax, payroll, audit and advisory.", cta: "All services" }),
        linkCard({ href: "/strategic-partners/", ic: "handshake", title: "Strategic Partners", body: "The established delivery firm behind our UK-facing team.", cta: "Our partners" }),
      ],
      4
    )}
  </div>`
)}

${capacityTransfer()}

${sec(
  "section",
  `
  <div class="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
    ${sectionHead({
      eyebrow: "Services",
      title: "Who we help, and how",
      lede: "Choose your situation. Every card opens the full detail for that service.",
      max: "max-w-2xl",
    })}
    <a href="/services/" class="link-arrow shrink-0">All fourteen services ${arrow("h-4 w-4")}</a>
  </div>
  ${tabs(
    [
      {
        id: "practices",
        label: "For accountancy practices",
        content: grid(
          practiceServices.map((s) => featureCard({ icon: s.icon, title: s.nav, body: s.short, href: `/services/${s.slug}/` })),
          3
        ),
      },
      {
        id: "businesses",
        label: "For growing businesses",
        content: `${grid(
          businessServices.map((s) => featureCard({ icon: s.icon, title: s.nav, body: s.short, href: `/services/${s.slug}/` })),
          3
        )}
        <div class="card-quiet mt-5">
          <p class="font-display text-[1.0625rem] text-ink">Already have an accountant?</p>
          <p class="mt-2 text-[0.9375rem] leading-relaxed text-slate-deep">Good, keep them. We run the finance function; they keep the statutory accounts and the tax advice. <a href="/for-business/" class="font-semibold text-teal hover:underline">How it works for businesses</a></p>
        </div>`,
      },
    ],
    { label: "Who we help" }
  )}`
)}

<section class="band-dark grain relative overflow-hidden">
  <div class="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-teal/10 blur-3xl"></div>
  <div class="wrap relative z-10 section">
    <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      ${sectionHead({
        eyebrow: "Why B4ES",
        title: "Commitments we are prepared to put in a contract",
        light: true,
        max: "max-w-2xl",
      })}
      <a href="/why-us/" class="btn-outline-light shrink-0">See all six ${arrow("h-4 w-4")}</a>
    </div>
    <div class="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-3">
      ${DIFFERENTIATORS.slice(0, 3)
        .map(
          (d, i) => `<div data-reveal="rise" style="--d:${i}">
        <div class="icon-tile-dark mb-5">${icon(d.icon, "h-5 w-5")}</div>
        <h3 class="font-display text-[1.1875rem] leading-snug text-white">${d.title}</h3>
        <p class="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-soft">${d.body}</p>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>

${ctaBand()}
`;

  return {
    path: "/",
    // Brand-first so searches for "B4ES", "Better 4" or "Better 4 Enterprise
    // Solutions" match the title; layout.mjs uses the home title as given.
    title: "Better 4 Enterprise Solutions (B4ES) | Outsourced Accounting, Tax & Payroll UK",
    description:
      "Better 4 Enterprise Solutions LLP (B4ES) provides white-label outsourced accounting, tax, payroll, audit support and back-office delivery for UK accountancy practices, plus a complete outsourced finance function for growing UK businesses.",
    body,
    // One graph: the business (with every name people search for) and the
    // WebSite, which Google uses to choose the site name shown in results.
    schema: {
      "@context": "https://schema.org",
      "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE.baseUrl}/#organization`,
      name: SITE.name,
      alternateName: [SITE.fullName, `${SITE.fullName} LLP`, "Better 4"],
      legalName: `${SITE.fullName} LLP`,
      url: SITE.baseUrl,
      logo: `${SITE.baseUrl}/assets/img/b4es-logo.svg`,
      image: `${SITE.baseUrl}/assets/img/og-b4es.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "41 Woodside Close",
        addressLocality: "Grays",
        postalCode: "RM16 2DN",
        addressCountry: "GB",
      },
      description:
        "Outsourced accounting, tax, payroll and back-office delivery for UK accountancy practices and growing UK businesses.",
      email: SITE.email,
      ...(SITE.phone ? { telephone: SITE.phone } : {}),
      areaServed: { "@type": "Country", name: "United Kingdom" },
      knowsAbout: [
        "Outsourced bookkeeping",
        "Year-end accounts preparation",
        "Self assessment tax returns",
        "Corporation tax",
        "VAT and Making Tax Digital",
        "Payroll bureau services",
        "Audit support",
        "Management accounts",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.baseUrl}/#website`,
      name: SITE.name,
      alternateName: [SITE.fullName, `${SITE.fullName} LLP`],
      url: `${SITE.baseUrl}/`,
      publisher: { "@id": `${SITE.baseUrl}/#organization` },
    },
      ],
    },
  };
}
