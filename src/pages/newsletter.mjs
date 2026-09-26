import { SITE } from "../data/site.mjs";
import { hero } from "../components.mjs";

/* Steps of the double opt-in newsletter sign-up (see worker/index.js). All
   noindex; reached from the sign-up dialog, the confirmation email and the
   Worker's redirects. */

const trail = (label) => [{ label: "Home", href: "/" }, { label }];

function simple({ path, title, eyebrow, heading, lede, extra = "" }) {
  return {
    path,
    title,
    description: lede,
    noindex: true,
    body: `${hero({
      eyebrow,
      title: heading,
      lede,
      primary: { href: "/", label: "Back to the homepage" },
      secondary: { href: "/insights/", label: "Read our insights" },
      trail: trail(title),
    })}${extra}`,
  };
}

export function newsletterPages() {
  return [
    simple({
      path: "/newsletter/check-your-email/",
      title: "Check your email",
      eyebrow: "Newsletter",
      heading: "Check your inbox to confirm",
      lede:
        "We have sent you an email with a link. Open it and press Confirm subscription to start receiving B4ES insights. If it has not arrived in a few minutes, check your spam folder.",
    }),
    {
      path: "/newsletter/confirm/",
      title: "Confirm your subscription",
      description: "Confirm your subscription to B4ES insights.",
      noindex: true,
      body: `<section class="section">
  <div class="wrap-narrow">
    <p class="eyebrow">Newsletter</p>
    <h1 class="mt-3 font-display text-[2.25rem] leading-tight text-ink">Confirm your subscription</h1>
    <p class="mt-4 text-[1.0625rem] leading-relaxed text-slate-deep">
      Press the button to start receiving B4ES insights by email. You can unsubscribe at any time from any email we send.
    </p>
    <form id="nlConfirmForm" class="mt-8" method="post" action="/api/subscribe/confirm">
      <input type="hidden" id="nlToken" name="token" value="">
      <button type="submit" class="btn-primary">Confirm subscription</button>
    </form>
    <noscript>
      <p class="mt-6 text-[0.9375rem] text-slate-deep">This step needs JavaScript. If you cannot turn it on, email
      <a href="mailto:${SITE.email}" class="font-semibold text-teal hover:underline">${SITE.email}</a> and we will add you.</p>
    </noscript>
  </div>
</section>`,
    },
    simple({
      path: "/newsletter/confirmed/",
      title: "Subscribed",
      eyebrow: "Newsletter",
      heading: "You are subscribed",
      lede: "Thank you. B4ES insights will now come to your inbox. Every email has a link to unsubscribe.",
    }),
    simple({
      path: "/newsletter/link-expired/",
      title: "Link expired",
      eyebrow: "Newsletter",
      heading: "That link has expired or was already used",
      lede: `Confirmation links work once, for seven days. If you are not subscribed yet, sign up again from the homepage, or email ${SITE.email}.`,
    }),
  ];
}
