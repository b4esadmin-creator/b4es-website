import { SITE } from "../data/site.mjs";
import { page as shell } from "../layout.mjs";

import { homePage } from "./home.mjs";
import { allServicePages } from "./serviceDetail.mjs";
import { servicesIndexPage, forAccountantsPage, forBusinessPage, sectorsPage } from "./catalogue.mjs";
import { aboutPage, howWeWorkPage, engagementModelsPage, securityPage, careersPage } from "./company.mjs";
import { contactPage, faqsPage } from "./support.mjs";
import { insightsIndexPage, allArticlePages } from "./insights.mjs";
import { privacyPage, termsPage, cookiesPage } from "./legal.mjs";
import { notFoundPage } from "./notFound.mjs";

/**
 * Assembles every page definition and renders it through the shared layout.
 * Returns { pages: [{ path, html }], baseUrl }.
 */
export async function page() {
  const defs = [
    homePage(),
    servicesIndexPage(),
    ...allServicePages(),
    forAccountantsPage(),
    forBusinessPage(),
    sectorsPage(),
    howWeWorkPage(),
    engagementModelsPage(),
    securityPage(),
    aboutPage(),
    insightsIndexPage(),
    ...allArticlePages(),
    faqsPage(),
    contactPage(),
    careersPage(),
    privacyPage(),
    termsPage(),
    cookiesPage(),
  ];

  const pages = defs.map((d) => ({ path: d.path, html: shell(d) }));

  // 404 is emitted as a file but kept out of the sitemap.
  const nf = notFoundPage();
  pages.push({ path: nf.path, html: shell(nf), noindex: true });

  return { pages, baseUrl: SITE.baseUrl };
}
