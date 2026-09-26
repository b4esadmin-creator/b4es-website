import { SITE } from "../data/site.mjs";
import { arrow } from "../icons.mjs";
import { hero, sectionHead, ctaBand, callout, sec, illoScene } from "../components.mjs";

/* ---------------------------------------------------------------- article data */

export const ARTICLES = [
  {
    slug: "mtd-income-tax-capacity",
    topic: "Capacity planning",
    date: "2026-07-14",
    dateLabel: "14 July 2026",
    readingTime: "9 min read",
    title: "MTD for Income Tax has quadrupled your client contact, but not your team.",
    standfirst:
      "Roughly 780,000 taxpayers entered quarterly reporting in April 2026, and the threshold falls twice more before 2028. The technical work is manageable. The strain comes from the number of reporting cycles set against the size of the team.",
    body: `
<p>A quarterly update is not difficult to prepare, and any competent bookkeeper can do one. What has changed is how often the work comes round, and frequency is what breaks a practice's resourcing model.</p>

<h2>Counting the cycles</h2>

<p>Take an affected client under the old model. Once a year, you chased records, brought the bookkeeping up to date, prepared the return, raised queries, got approval and filed. Call it one full cycle of contact, chasing, processing and communication.</p>

<p>Under Making Tax Digital for Income Tax, that same client now generates four quarterly updates plus an end-of-period statement and a final declaration. The quarterly obligations were added on top of the annual return. Each quarterly cycle has its own records chase, catch-up bookkeeping, reconciliation, submission and client communication.</p>

<p>Each cycle takes less processing time than a full annual job, but the <strong>number of touchpoints</strong> is roughly four times higher. Touchpoints use up a practice's capacity faster than processing minutes do, because each one needs a person to make contact, wait, follow up and escalate.</p>

<blockquote>What has multiplied is the chasing, and chasing is the easiest part of the cycle to move elsewhere and the hardest to automate away.</blockquote>

<h2>The scope keeps widening</h2>

<p>April 2026 brought in taxpayers with qualifying income above £50,000, around 780,000 of them on HMRC's published figures. From April 2027 the threshold falls to £30,000. From April 2028 it falls to £20,000.</p>

<p>Each step down brings in a larger population than the one before, because taxpayer numbers rise as you descend the income scale. The clients arriving in 2027 and 2028 will also, on average, have <em>worse records</em> and <em>less software familiarity</em> than the 2026 cohort, because the earlier cohort skewed towards more established businesses already working with an accountant.</p>

<p>Volume rises, and so does the effort per client. A resourcing plan built around the 2026 cohort will not survive 2027 unchanged.</p>

<h2>Why hiring is the expensive answer</h2>

<p>The instinctive response is to recruit. Three things are working against that.</p>

<ul>
  <li><strong>The pipeline has narrowed.</strong> UK practices have reported severe difficulty resourcing new client work, with a large majority saying talent shortages have constrained their capacity to take on engagements. You are competing for a smaller pool against firms with deeper pockets.</li>
  <li><strong>Employment costs rose.</strong> Employer National Insurance moved to 15% with the secondary threshold cut to £5,000. Every hire costs more than the equivalent hire did two years ago, before you reach pension, software, holiday cover and recruitment fees.</li>
  <li><strong>The demand is uneven.</strong> Quarterly deadlines cluster. Hiring for the peak leaves you over-staffed between peaks; hiring for the average leaves you in crisis four times a year rather than once.</li>
</ul>

<h2>What works</h2>

<p>The practices handling this well are doing three fairly ordinary things.</p>

<h3>1. Separating the chase from the accounting</h3>

<p>You do not need a qualified accountant to chase records. You need persistence, a defined escalation ladder and someone whose week is not already full. Separating that function from the technical work, whether internally or externally, usually recovers more capacity than any other single change, because it takes the highest-volume, lowest-skill activity away from your most expensive people.</p>

<h3>2. Segmenting clients by readiness rather than by fee</h3>

<p>The clients who take disproportionate effort are rarely the largest. They are the ones with paper records, no software and a habit of arriving in the last week. Identify them in advance and decide whether to move them onto software, reprice them or decline them, and make that decision before the quarter starts, not halfway through it.</p>

<h3>3. Making capacity variable</h3>

<p>MTD demand comes in peaks, while employment cost is continuous. Anything that turns part of your capacity from a fixed monthly salary into a cost that scales with cycles deals with that mismatch directly. That may be outsourcing, or it may be a well-run bank of contract staff. Absorbing four times the cycles into a team sized for one does not work.</p>

<h2>Where outsourcing will not help</h2>

<p>If your MTD clients are still on fees set when the obligation was annual, your problem is pricing, and outsourcing will not fix it. Moving the work elsewhere just moves the loss with it.</p>

<p>Reprice first, then resource. Done the other way round, you find the pricing problem after you have already committed to the cost.</p>
`,
  },

  {
    slug: "outsourcing-uk-gdpr-checklist",
    topic: "Compliance",
    date: "2026-06-23",
    dateLabel: "23 June 2026",
    readingTime: "8 min read",
    title: "Outsourcing and UK GDPR: what a practice actually has to do",
    standfirst:
      "Your firm stays the data controller. Most of what follows comes from that fact, and it is why your regulator will not accept “our provider is compliant” as an answer.",
    body: `
<p>Data security is the first objection most practices raise about outsourcing, and it is a fair one to raise first. It is also often answered badly: providers wave a certificate and firms accept it.</p>

<p>Start with who is responsible, because that matters more than the technology. When your practice sends client data to a provider, you remain the <strong>data controller</strong> and the provider becomes a <strong>processor</strong> acting on your documented instructions. Responsibility does not transfer with the data. If personal data is compromised, the obligation to your clients, your regulator and the ICO remains yours.</p>

<h2>The six things that need to exist</h2>

<h3>1. A written Article 28 agreement</h3>

<p>UK GDPR Article 28 requires a written contract between controller and processor. A services agreement with a confidentiality clause does not satisfy it. The contract must cover the subject matter and duration of processing, the nature and purpose, the types of personal data and categories of data subject, and it must impose specific obligations on the processor: to process only on your documented instructions, to ensure confidentiality, to implement appropriate security measures, to engage sub-processors only with authorisation, to assist with data subject rights and breach notification, and to delete or return data at the end of the engagement.</p>

<p>Ask any prospective provider for their draft DPA before you discuss price. How quickly it arrives, and how much of the above it contains, tells you a good deal.</p>

<h3>2. A lawful basis that still holds</h3>

<p>You had a lawful basis for processing your client's data when you took them on. Extending that processing to a third party outside the UK does not automatically invalidate it, but you do need to check that it still holds and that the processing remains within what the client would reasonably expect.</p>

<h3>3. A transfer mechanism and a transfer risk assessment</h3>

<p>Where processing happens outside the UK, you need an appropriate transfer mechanism and a documented transfer risk assessment. This is the step most often skipped. It requires you to assess the legal regime in the destination country, the practical risk to the data, and the supplementary measures in place (encryption, access control, contractual protection) that address the gap.</p>

<p>Accountancy data routinely includes special category data, and your assessment should reflect that. Client records are not ordinary business information.</p>

<h3>4. Engagement letters and privacy notice that reflect reality</h3>

<p>Your engagement letter should contemplate the possibility of work being transferred to a third party, and your privacy notice should describe the categories of recipient and the fact of international transfer. What you must disclose is the <em>arrangement</em>. You do not have to name the provider to clients (that remains a commercial decision), but you must not leave them with an inaccurate picture.</p>

<h3>5. Professional confidentiality, considered separately</h3>

<p>Data protection and professional confidentiality are two distinct obligations that happen to overlap. The ICAEW and ACCA Codes of Ethics impose confidentiality duties on all information acquired through a professional relationship, which is a broader category than personal data. Satisfying UK GDPR does not automatically satisfy your Code, and both bodies publish guidance specific to outsourcing that is worth reading before you sign the contract.</p>

<h3>6. A breach procedure that runs at your speed</h3>

<p>Your notification clock to the ICO starts when <em>you</em> become aware of a breach. If your provider investigates for a week and then sends you a tidy summary, they have used up your notification window. The agreement needs to require notification without undue delay and in a timescale that leaves you able to meet your own obligation, and the procedure should pass you facts as they emerge instead of conclusions at the end.</p>

<h2>Questions that separate providers</h2>

<ul>
  <li>Does client data leave our systems, or do your teams work inside ours under named logins we control?</li>
  <li>Who specifically can see our data, and how are environments segregated between your clients?</li>
  <li>What is on the delivery floor: personal devices, phones, removable media, printers?</li>
  <li>Who are your sub-processors, and how are we notified before that changes?</li>
  <li>What is the breach notification timescale in the contract, in hours?</li>
  <li>What happens to our data when we leave, and is there a charge for its return?</li>
</ul>

<p>A provider who answers these precisely and in writing is showing you that the controls are part of daily practice. A certificate only shows that they passed an audit on a date in the past.</p>

<h2>On certificates</h2>

<p>ISO 27001 certification means something: it confirms an information security management system was independently audited against a standard. It does not confirm that a specific engagement is well run, that your data stays in your systems, or that the contract protects you. Treat it as one input into your due diligence.</p>

<p>A provider without certification is not automatically ruled out, provided it is straightforward about that and can evidence the underlying controls. Rule out a provider that is vague about where data is processed, who can see it, or what happens when something goes wrong.</p>
`,
  },

  {
    slug: "outsourcing-pilot-evaluation",
    topic: "Selection",
    date: "2026-05-19",
    dateLabel: "19 May 2026",
    readingTime: "7 min read",
    title: "How to run an outsourcing pilot that tells you something",
    standfirst:
      "Most pilots are designed to succeed. The practice sends easy jobs, the provider gives them extra attention, both sides call it a success, and the real position shows up in January. A pilot can be designed to give you information you can use.",
    body: `
<p>A pilot exists to reduce uncertainty. One the provider is almost certain to pass only delays the moment you find out, until you are contractually committed and it is January.</p>

<h2>Send the difficult work</h2>

<p>The instinct is to send clean, simple jobs so the provider has a fair chance. You learn little from that, because you already know a clean job will come back fine. What you need to see is how a provider behaves when the records are poor, the treatment is ambiguous or the prior year contains a judgement that is not documented anywhere.</p>

<p>Send a representative mix, weighted towards the awkward end, and include at least one client whose file you know is a mess. Whether the provider flags it early and scopes it, or absorbs it silently and produces something plausible, tells you more than ten clean jobs.</p>

<h2>Measure review burden, not error rate</h2>

<p>Almost every failed outsourcing relationship failed on review burden. The accounts were technically right, but the file had no lead schedules, no cross-references and no explanation of judgements, so the partner rebuilt the job to understand it and the saving disappeared.</p>

<p>So measure review burden:</p>

<ul>
  <li><strong>Time to review.</strong> How long did it take your reviewer to reach a conclusion on this file, compared with an equivalent file prepared in-house?</li>
  <li><strong>Questions generated.</strong> How many times did your reviewer have to ask what something was, where a figure came from, or why a treatment was chosen?</li>
  <li><strong>Rework rate.</strong> How many jobs came back needing substantive correction rather than a partner's stylistic preference?</li>
  <li><strong>Query quality.</strong> Were queries batched, evidenced and specific, or dribbled out one at a time with no supporting documentation?</li>
</ul>

<p>Record these numbers. A vague sense that "it was fine" will not survive contact with a partner who was sceptical from the start.</p>

<h2>Do not tell them which jobs are the test</h2>

<p>Where practical, a pilot should look like normal work. A provider that assigns its best reviewer to a batch it knows is being assessed is showing you a capability that will not be there at volume. Any organisation behaves this way when it knows it is being assessed.</p>

<h2>Test the escalation path deliberately</h2>

<p>At some point in a real engagement something will go wrong: a deadline at risk, an ambiguous instruction, a client who has not responded. The pilot is the time to find out what happens. Introduce an ambiguity deliberately and see whether it is escalated, resolved with an assumption, or ignored.</p>

<p>You want to see it escalated with a recommendation. A silent assumption is what produces a significant problem eighteen months later, on a job nobody remembers.</p>

<h2>Include a real deadline</h2>

<p>A pilot with a comfortable timetable tests technical capability without testing delivery discipline. Give at least one job a real deadline and watch how the provider communicates as it approaches: whether it sends you a status update unprompted, or only when asked.</p>

<h2>Agree the evaluation criteria before you start</h2>

<p>Write down, before the first job is sent, what would count as a pass. Otherwise the evaluation becomes a negotiation with your own sunk cost, particularly if the pilot involved effort from your team.</p>

<p>Reasonable criteria: files reviewable without rebuilding, no more than a defined level of substantive rework, queries batched and evidenced, deadline met, escalation handled as expected. Share the criteria with the provider. A serious one will want to know what it is being measured against, and one that resists is telling you something.</p>

<h2>Pay for it</h2>

<p>A free pilot looks like a good deal. In practice it leaves you feeling obliged, and on the provider's side it justifies exactly the extra attention that makes the pilot unrepresentative. Pay the standard rate for the work. That keeps the relationship and the assessment on a commercial footing, and you can walk away without a conversation about goodwill.</p>

<h2>Then run it again in the peak</h2>

<p>A pilot in a quiet month tells you what a provider can do when it has capacity to spare. What you need to know is what it can do in January, when every client is a priority. If the first pilot passes, treat the first peak period as a second one, with the same measurement discipline, a limited volume and a plan for what you will do if it does not hold.</p>
`,
  },

  {
    slug: "comparing-outsourcing-quotes",
    topic: "Commercial",
    date: "2026-04-28",
    dateLabel: "28 April 2026",
    readingTime: "7 min read",
    title: "Why the cheapest outsourcing quote is usually the most expensive",
    standfirst:
      "Headline rates in this market mean very little without context. This framework compares quotes on what you will end up paying, which is often not the figure you were quoted.",
    body: `
<p>Ask three outsourcing providers for a rate and you will get three numbers that look comparable and are not. The same nominal hourly rate can represent a junior processor or a review-grade qualified accountant; standard turnaround or guaranteed priority; a scope that includes query handling or one that treats it as extra.</p>

<p>Comparing headline rates means comparing different things. The steps below put the quotes on the same basis.</p>

<h2>1. Establish what grade of person does the work</h2>

<p>This is the single largest driver of both price and quality, and the one most often left vague. Ask directly: who prepares the work, what are they qualified in, who reviews it, and what are <em>they</em> qualified in? If a rate looks attractive because someone junior prepares the work and someone equally junior reviews it, you have not saved anything. The review burden has moved onto your partners.</p>

<h2>2. Price the review time as well as the preparation</h2>

<p>The real cost of an outsourced job is the quoted fee <em>plus</em> the time your team spends getting it to a signable state. If Provider A charges less but produces files that take your manager an extra ninety minutes to review, and Provider B charges more but produces review-ready files, the sums are simple once you do them.</p>

<p>Most firms never do them, because review time is absorbed into salaried hours and never appears on an invoice. Estimate it during the pilot and add it to the comparison. It often reverses the ranking.</p>

<h2>3. Find out what triggers an extra charge</h2>

<p>Ask for the list of circumstances in which the quoted price does not apply. Common ones:</p>

<ul>
  <li>Records materially worse than represented at scoping</li>
  <li>Work falling outside a narrowly-drawn scope definition</li>
  <li>Priority or expedited turnaround</li>
  <li>Query handling and client communication</li>
  <li>Software the provider does not already support</li>
  <li>Onboarding, setup or training fees</li>
  <li>Annual uplift clauses in the contract</li>
</ul>

<p>None of these is unreasonable in itself. The question is whether they are disclosed at quote stage or discovered on an invoice. A provider who volunteers this list unprompted is generally a safer bet than one who has to be asked.</p>

<h2>4. Match the engagement model to your volume shape</h2>

<p>Choosing the wrong model is the most common reason outsourcing looks expensive in retrospect.</p>

<ul>
  <li><strong>Lumpy, unpredictable volume</strong> suits per-job or ad-hoc hours. A dedicated resource will sit idle in quiet months and you will pay for it.</li>
  <li><strong>Steady, predictable volume</strong> suits a dedicated resource. Per-job pricing at consistent volume means paying a premium for flexibility you are not using.</li>
  <li><strong>Multiple disciplines at scale</strong> suits a managed team. Running three separate arrangements to cover accounts, tax and payroll creates coordination overhead that lands on you.</li>
</ul>

<p>A provider who asks about the <em>shape</em> of your volume before quoting is doing the right thing. One who quotes a rate without asking is selling a commodity.</p>

<h2>5. Cost the exit before you enter</h2>

<p>Ask what happens if you leave: is process documentation handed over, is there a charge for data return, what notice is required, and what state is the work left in? A low rate with a punitive exit is a higher price paid later, and you will find that out when you have the least leverage.</p>

<h2>6. Compare against the true internal cost, not the salary</h2>

<p>When firms benchmark outsourcing against doing the work in-house, they typically compare to salary. The comparable figure is salary plus employer National Insurance at 15%, plus pension, plus holiday and sickness cover, plus software licences, plus recruitment cost amortised over expected tenure, plus the management time to supervise, all divided by realistic productive hours rather than contracted hours.</p>

<p>Done properly, that calculation usually surprises people in both directions. It makes outsourcing look better than the salary comparison suggested, and it makes the cheapest provider look less compelling than the headline implied.</p>

<h2>When one quote is far below the rest</h2>

<p>If one quote is dramatically below the others, the most likely explanations are that the scope is narrower than you think, the grade of person is lower than you assumed, or the price is an acquisition rate that will move. Occasionally, and it does happen, the price reflects a structural cost advantage: a newer provider with a lower cost base and a reason to win work.</p>

<p>The number on its own will not tell you which it is. A paid pilot on difficult work, with the review burden measured, will. The pilot costs one batch of jobs, and getting the choice wrong costs a filing season.</p>
`,
  },
];

/* ------------------------------------------------------------------ index */

export function insightsIndexPage() {
  const [lead, ...rest] = ARTICLES;

  const body = `
${hero({
  eyebrow: "Insights",
  title: "Practical writing for people making a delivery decision.",
  lede:
    "We do not write thought leadership or listicles. These are the arguments we would make in a scoping call, written out in full, including the parts that argue against using us.",
  primary: { href: "/contact/", label: "Contact us" },
  secondary: { href: "/faqs/", label: "Read the FAQs" },
  aside: illoScene("insights"),
  trail: [{ label: "Home", href: "/" }, { label: "Insights" }],
})}

${sec(
  "section",
  `
  <a href="/insights/${lead.slug}/" class="group block rounded-card border border-line bg-white p-8 transition-all hover:border-teal/40 sm:p-11">
    <div class="flex flex-wrap items-center gap-3">
      <span class="pill-teal">${lead.topic}</span>
      <span class="text-[0.8125rem] text-slate-mid">${lead.dateLabel}</span>
      <span class="text-slate-soft">&middot;</span>
      <span class="text-[0.8125rem] text-slate-mid">${lead.readingTime}</span>
    </div>
    <h2 class="mt-5 max-w-4xl font-display text-[1.75rem] leading-[1.2] text-ink transition-colors group-hover:text-teal-dark sm:text-[2.25rem]">${lead.title}</h2>
    <p class="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-slate-deep">${lead.standfirst}</p>
    <span class="link-arrow mt-7">Read the article ${arrow("h-4 w-4")}</span>
  </a>

  <div class="mt-5 grid gap-5 lg:grid-cols-3">
    ${rest
      .map(
        (a) => `<a href="/insights/${a.slug}/" class="card-hover group flex flex-col">
      <div class="flex flex-wrap items-center gap-2.5">
        <span class="pill-teal">${a.topic}</span>
        <span class="text-[0.8125rem] text-slate-mid">${a.readingTime}</span>
      </div>
      <h2 class="mt-5 font-display text-[1.25rem] leading-snug text-ink transition-colors group-hover:text-teal-dark">${a.title}</h2>
      <p class="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-slate-deep">${a.standfirst}</p>
      <span class="mt-6 flex items-center justify-between border-t border-line pt-4">
        <span class="text-[0.8125rem] text-slate-mid">${a.dateLabel}</span>
        <span class="link-arrow">Read ${arrow("h-3.5 w-3.5")}</span>
      </span>
    </a>`
      )
      .join("")}
  </div>`
)}

${sec(
  "section band-bone",
  `
  <div class="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
    <div>
      ${sectionHead({
        eyebrow: "Why we write these",
        title: "Because the decision is harder than the marketing suggests",
        lede: "Choosing a delivery partner involves regulatory obligations, professional ethics, client confidentiality and a commercial commitment, yet most of what is written about it treats it as a procurement exercise with a rate card. These articles cover the parts we think are hard.",
      })}
    </div>
    <div>
      ${callout({
        tone: "plain",
        ic: "quote",
        title: "Use them against us",
        body: "The evaluation frameworks in these articles are the ones we would want applied to us. If we fail one of our own tests, that is a fair thing to raise on a call and we would rather you did.",
      })}
    </div>
  </div>`
)}

${ctaBand()}
`;

  return {
    path: "/insights/",
    title: "Insights",
    description:
      "Practical writing on outsourced accounting for UK practices: MTD for Income Tax capacity planning, UK GDPR obligations when outsourcing, running an effective pilot, and comparing outsourcing quotes properly.",
    body,
  };
}

/* --------------------------------------------------------------- article */

export function articlePage(slug) {
  const a = ARTICLES.find((x) => x.slug === slug);
  const others = ARTICLES.filter((x) => x.slug !== slug).slice(0, 3);

  const body = `
<article>
<section class="band-dark grain relative overflow-hidden">
  <div class="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-teal/10 blur-3xl"></div>
  <div class="relative z-10">
    <nav aria-label="Breadcrumb" class="wrap pt-6">
      <ol class="flex flex-wrap items-center gap-2 text-[0.8125rem] text-slate-mid">
        <li class="flex items-center gap-2"><a href="/" class="hover:text-teal-light">Home</a><span class="text-white/40">/</span></li>
        <li class="flex items-center gap-2"><a href="/insights/" class="hover:text-teal-light">Insights</a><span class="text-white/40">/</span></li>
        <li class="text-slate-soft">${a.topic}</li>
      </ol>
    </nav>
  </div>
  <div class="wrap-narrow relative z-10 py-14 md:py-20">
    <div class="flex flex-wrap items-center gap-3">
      <span class="pill-light">${a.topic}</span>
      <span class="text-[0.8125rem] text-slate-mid">${a.dateLabel}</span>
      <span class="text-white/25">&middot;</span>
      <span class="text-[0.8125rem] text-slate-mid">${a.readingTime}</span>
    </div>
    <h1 class="mt-6 font-display text-[2.1rem] leading-[1.12] text-white sm:text-[2.75rem]">${a.title}</h1>
    <p class="mt-6 text-[1.125rem] leading-[1.65] text-slate-soft">${a.standfirst}</p>
  </div>
</section>

<div class="wrap-narrow py-14 md:py-20">
  <div class="article">${a.body}</div>

  <div class="mt-14 rounded-card border border-line bg-bone p-7 sm:p-9">
    <p class="eyebrow">Talk it through</p>
    <p class="mt-3 font-display text-[1.375rem] leading-snug text-ink">Bring this to a scoping call</p>
    <p class="mt-3 text-[0.9688rem] leading-relaxed text-slate-deep">
      If any of the above matches a decision you are currently making, a thirty-minute conversation
      will be more useful than another article. We will give you a straight view, including where
      we are not the right answer.
    </p>
    <div class="mt-6 flex flex-wrap gap-3">
      <a href="/contact/" class="btn-primary">Contact us</a>
      <a href="/insights/" class="btn-outline">More insights</a>
    </div>
  </div>
</div>

<section class="section-tight border-t border-line">
  <div class="wrap">
    ${sectionHead({ eyebrow: "Also worth reading", title: "More from B4ES" })}
    <div class="mt-9 grid gap-5 lg:grid-cols-3">
      ${others
        .map(
          (o) => `<a href="/insights/${o.slug}/" class="card-hover group flex flex-col">
        <span class="pill-teal self-start">${o.topic}</span>
        <h3 class="mt-4 font-display text-[1.125rem] leading-snug text-ink transition-colors group-hover:text-teal-dark">${o.title}</h3>
        <p class="mt-3 flex-1 text-[0.875rem] leading-relaxed text-slate-mid">${o.standfirst}</p>
        <span class="link-arrow mt-5">Read ${arrow("h-3.5 w-3.5")}</span>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>
</article>
`;

  return {
    path: `/insights/${a.slug}/`,
    title: a.title,
    description: a.standfirst,
    body,
    ogType: "article",
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.standfirst,
      datePublished: a.date,
      author: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
      mainEntityOfPage: `${SITE.baseUrl}/insights/${a.slug}/`,
    },
  };
}

export function allArticlePages() {
  return ARTICLES.map((a) => articlePage(a.slug));
}
