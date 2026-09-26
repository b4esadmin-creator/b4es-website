import { SITE } from "../data/site.mjs";
import { hero, callout } from "../components.mjs";

const REVIEW_NOTE = `<!--
  TEMPLATE — REQUIRES REVIEW BEFORE PUBLICATION.
  These documents are drafted as a starting point and reflect how the site and
  the business are described elsewhere. They are not legal advice. Have them
  reviewed by a UK-qualified adviser, and replace every TODO in src/data/site.mjs
  (company number, registered address, ICO registration reference) before the
  site goes live.
-->`;

function legalShell({ path, title, description, updated, intro, sections }) {
  const body = `
${REVIEW_NOTE}
${hero({
  eyebrow: "Legal",
  title,
  lede: intro,
  trail: [{ label: "Home", href: "/" }, { label: title }],
})}

<div class="wrap-narrow py-14 md:py-20">
  <p class="text-[0.8125rem] text-slate-mid">Last updated: ${updated}</p>
  <div class="article mt-8">
    ${sections
      .map(
        (s) => `<h2>${s.h}</h2>${s.p.map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join("")}`
      )
      .join("")}
  </div>
  <div class="mt-12">
    ${callout({
      tone: "plain",
      ic: "mail",
      title: "Questions about this notice",
      body: `Contact us at <a href="mailto:${SITE.email}" class="font-semibold text-teal hover:underline">${SITE.email}</a>. If you are unhappy with how we have handled your personal data you also have the right to complain to the Information Commissioner's Office at ico.org.uk.`,
    })}
  </div>
</div>
`;
  return { path, title, description, body };
}

/* ================================================================ privacy */

export function privacyPage() {
  return legalShell({
    path: "/privacy/",
    title: "Privacy notice",
    description:
      "How B4ES collects, uses and protects personal data, the lawful bases we rely on, international transfers, retention and your rights under UK GDPR.",
    updated: "August 2026",
    intro:
      "How we handle personal data: what we collect, why, how long we keep it, where it is processed and what rights you have.",
    sections: [
      {
        h: "Who we are",
        p: [
          `${SITE.fullName} (“B4ES”, “we”, “us”) is the data controller for personal data collected through this website and in the course of our own business relationships.${
            SITE.companyNumber
              ? ` Registered in England and Wales, company number ${SITE.companyNumber}.`
              : ""
          }${
            SITE.address.line1
              ? ` Registered office: ${[SITE.address.line1, SITE.address.line2, SITE.address.postcode].filter(Boolean).join(", ")}.`
              : ""
          }`,
          ...(SITE.icoRef ? [`Our ICO registration reference is ${SITE.icoRef}.`] : []),
          `Contact us about anything in this notice at <a href="mailto:${SITE.email}" class="font-semibold text-teal hover:underline">${SITE.email}</a>.`,
        ],
      },
      {
        h: "Two different roles",
        p: [
          "We act in one of two roles, and our obligations differ in each.",
          "<ul><li><strong>As a controller.</strong> When you contact us, enquire about our services, apply for a role or engage us directly as a business client, we decide how and why your personal data is used. This notice describes that processing.</li><li><strong>As a processor.</strong> When we deliver services to an accountancy practice, we process their clients' personal data on their documented instructions. In that situation the practice is the controller and their own privacy notice governs. Our processing is bound by a written agreement meeting the requirements of Article 28 of the UK GDPR.</li></ul>",
        ],
      },
      {
        h: "What we collect",
        p: [
          "<ul><li><strong>Enquiry information</strong>: name, firm or company, email address, telephone number and the content of your message, submitted through the contact form on this site.</li><li><strong>Anti-abuse information</strong>: when you submit the contact form we record a one-way salted hash of your IP address and the country your request came from, solely to rate-limit automated abuse. The hash cannot be reversed to recover your IP address, and we do not use it to identify or track you.</li><li><strong>Engagement information</strong>: the contact, contractual and operational details needed to provide services and manage the relationship.</li><li><strong>Recruitment information</strong>: anything contained in a CV or application you send us.</li><li><strong>Technical information</strong>: limited server log data such as IP address, browser type and pages requested, generated automatically when you visit the site.</li></ul>",
        ],
      },
      {
        h: "Why we use it, and our lawful basis",
        p: [
          "<ul><li><strong>Responding to enquiries</strong>: legitimate interests, in responding to a request you have made of us.</li><li><strong>Providing services and managing engagements</strong>: performance of a contract, or steps taken at your request before entering one.</li><li><strong>Recruitment</strong>: legitimate interests, in assessing candidates for roles.</li><li><strong>Legal and regulatory obligations</strong>: including accounting and anti-money-laundering record-keeping where applicable.</li><li><strong>Site security and integrity</strong>: legitimate interests, in keeping the site available and secure.</li></ul>",
          "We do not use your personal data for automated decision-making or profiling, and we do not sell it.",
        ],
      },
      {
        h: "Who we share it with",
        p: [
          "Contact form submissions are stored in our own database on Cloudflare infrastructure, which also hosts this website and delivers the notification email. No separate third-party form or email provider is involved.",
          "We share personal data only where necessary: with our delivery partner where they are involved in providing services to you, under a written agreement imposing confidentiality and security obligations; with professional advisers such as accountants, insurers and lawyers; with service providers who support our operations, such as email and IT hosting; and with regulators or law enforcement where we are legally required to do so.",
          "We do not share your information with third parties for their own marketing purposes.",
        ],
      },
      {
        h: "International transfers",
        p: [
          "Some processing takes place outside the United Kingdom, principally in Pakistan where our delivery partner operates. Where personal data is transferred outside the UK we put in place an appropriate transfer mechanism, such as the International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual Clauses, supported by a documented transfer risk assessment and technical measures including encryption and access control.",
          `You can request further information about the safeguards applied to a specific transfer by contacting <a href="mailto:${SITE.email}" class="font-semibold text-teal hover:underline">${SITE.email}</a>.`,
        ],
      },
      {
        h: "How long we keep it",
        p: [
          "<ul><li><strong>Enquiries that do not lead to an engagement</strong>: up to 24 months from last contact.</li><li><strong>Client engagement records</strong>: for the duration of the engagement and then for the period required by law and by our professional and insurance obligations, ordinarily at least six years.</li><li><strong>Recruitment applications</strong>: up to 12 months, unless you ask us to keep them longer for future roles.</li><li><strong>Server logs</strong>: a short rolling period for security and diagnostic purposes.</li></ul>",
        ],
      },
      {
        h: "How we protect it",
        p: [
          "We apply organisational and technical measures appropriate to the risk, including access control on least-privilege principles, multi-factor authentication, encryption in transit and at rest, staff confidentiality undertakings, security training, and a documented incident response and breach notification procedure. Our security approach is described in more detail on our <a href=\"/security/\" class=\"font-semibold text-teal hover:underline\">security page</a>.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "Under UK data protection law you have the right to be informed about how your data is used; to request access to it; to have inaccurate data corrected; to request erasure in certain circumstances; to restrict processing; to data portability where applicable; to object to processing based on legitimate interests; and to withdraw consent where consent is the basis relied upon.",
          `To exercise any of these rights, contact <a href="mailto:${SITE.email}" class="font-semibold text-teal hover:underline">${SITE.email}</a>. We will respond within one month. If your request relates to data we process on behalf of an accountancy practice, we will direct you to that practice, as they are the controller for that data.`,
        ],
      },
      {
        h: "Changes to this notice",
        p: [
          "We may update this notice from time to time. The date at the top shows when it was last revised. Material changes will be highlighted on this page.",
        ],
      },
    ],
  });
}

/* ================================================================== terms */

export function termsPage() {
  return legalShell({
    path: "/terms/",
    title: "Terms of use",
    description:
      "Terms governing use of the B4ES website, including intellectual property, acceptable use, disclaimers and governing law.",
    updated: "August 2026",
    intro:
      "The terms on which you may use this website. These govern the website only. Services are provided under a separate written engagement agreement.",
    sections: [
      {
        h: "About these terms",
        p: [
          `This website is operated by ${SITE.fullName}${
            SITE.companyNumber
              ? `, registered in England and Wales, company number ${SITE.companyNumber}`
              : ""
          }. By using the site you accept these terms. If you do not accept them, please do not use the site.`,
        ],
      },
      {
        h: "The website is information, not advice",
        p: [
          "The content of this site is provided for general information about our services. It does not constitute accounting, tax, legal, financial or other professional advice, and it should not be relied upon as such. Regulatory requirements, thresholds and deadlines referred to on this site are stated as at the date of writing and change over time.",
          "You should obtain specific professional advice before taking, or refraining from taking, any action on the basis of anything on this site. Nothing on this site creates a professional relationship between you and B4ES; services are provided only under a separate written engagement agreement.",
        ],
      },
      {
        h: "Scope of our services",
        p: [
          "B4ES is not a firm of registered auditors and does not issue audit opinions. We do not provide regulated investment advice or legal advice. Where we support audit engagements we act solely as a resource under the direction, supervision and review of the appointed registered auditor, who retains full responsibility for the engagement and the audit opinion.",
        ],
      },
      {
        h: "Intellectual property",
        p: [
          "All content on this site, including text, design, graphics and logos, is owned by or licensed to B4ES and is protected by copyright and other intellectual property rights. You may view, download and print content for your own internal business use in evaluating our services. You may not otherwise reproduce, republish, distribute or commercially exploit any part of the site without our written permission.",
          "Third-party product and company names referred to on this site, including accounting and payroll software, are the trade marks of their respective owners. Reference to them indicates the platforms our teams work in and does not imply any endorsement, partnership or affiliation.",
        ],
      },
      {
        h: "Acceptable use",
        p: [
          "You agree not to use this site in any way that is unlawful or fraudulent; to attempt to gain unauthorised access to the site, its server or any connected system; to introduce malicious code; to conduct automated scraping or data extraction without our permission; or to use any contact facility to send unsolicited commercial communications.",
        ],
      },
      {
        h: "Availability",
        p: [
          "We aim to keep the site available but do not guarantee uninterrupted access. We may suspend, withdraw or change any part of the site without notice.",
        ],
      },
      {
        h: "External links",
        p: [
          "Where we link to third-party websites, those links are provided for information only. We have no control over the content of those sites and accept no responsibility for them or for any loss arising from your use of them.",
        ],
      },
      {
        h: "Limitation of liability",
        p: [
          "Nothing in these terms excludes or limits our liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot lawfully be excluded.",
          "Subject to that, we exclude all implied conditions, warranties and representations relating to this site, and we will not be liable for any loss of profit, loss of business, business interruption, or loss of anticipated savings arising from use of, or inability to use, this site or reliance on its content.",
        ],
      },
      {
        h: "Governing law",
        p: [
          "These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction over any dispute arising from them.",
        ],
      },
    ],
  });
}

/* ================================================================ cookies */

export function cookiesPage() {
  return legalShell({
    path: "/cookies/",
    title: "Cookie notice",
    description:
      "How B4ES uses cookies and similar technologies on this website, and how you can control them.",
    updated: "August 2026",
    intro:
      "What this site stores on your device, and how to control it. The short version: as published, this site sets no tracking cookies.",
    sections: [
      {
        h: "Current position",
        p: [
          "This website does not set advertising, analytics or tracking cookies. It does not embed social media tracking pixels and it does not share your browsing behaviour with third parties for marketing purposes.",
          "The site loads a web font stylesheet from Google Fonts. That request results in your IP address being received by Google in order to serve the font files. No cookie is set by that request.",
          "<!-- TODO: If you add analytics (for example Google Analytics, Plausible or Fathom), a chat widget, or embedded video, update this page and implement a consent mechanism that obtains consent BEFORE any non-essential cookie or similar technology is set. Under PECR, consent is required for non-essential storage. -->",
        ],
      },
      {
        h: "What cookies are",
        p: [
          "Cookies are small text files placed on your device by a website. They are widely used to make sites work, to remember preferences, and to gather information about how a site is used. Similar technologies such as local storage and tracking pixels serve comparable purposes.",
        ],
      },
      {
        h: "Categories",
        p: [
          "<ul><li><strong>Strictly necessary</strong>: required for the site to function. These do not require consent.</li><li><strong>Functional</strong>: remember preferences such as a chosen language or region.</li><li><strong>Analytics</strong>: measure how visitors use the site.</li><li><strong>Marketing</strong>: track visitors across sites to build advertising profiles.</li></ul>",
          "If we introduce anything beyond the strictly necessary category, we will update this page and ask for your consent before it is set.",
        ],
      },
      {
        h: "Controlling cookies",
        p: [
          "You can control and delete cookies through your browser settings, and set your browser to notify you when a cookie is being placed. Blocking cookies may affect how some websites function, though it will not affect this one as currently published.",
          "Guidance for the major browsers is available in their own help documentation, and the Information Commissioner's Office publishes general guidance at ico.org.uk.",
        ],
      },
      {
        h: "Server logs",
        p: [
          "Our hosting provider keeps standard server logs, which may include your IP address, browser type and the pages requested. These are used to keep the site secure and available and to diagnose faults. They are not used to build a profile of you and are retained for a short rolling period.",
        ],
      },
    ],
  });
}
