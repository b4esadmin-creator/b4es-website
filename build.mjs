#!/usr/bin/env node
/**
 * B4ES static site builder.
 *
 * Produces a complete, self-contained static site in ./dist:
 *
 *   1. clears dist/
 *   2. copies public/ (static assets, _headers, _redirects) into dist/
 *   3. compiles Tailwind into dist/assets/css/site.css
 *   4. renders every page from src/pages/ into dist/
 *   5. writes sitemap.xml and robots.txt
 *
 * dist/ is disposable and is not committed — CI rebuilds it on every deploy.
 *
 *   npm run build     build everything
 *   npm run serve     preview at http://localhost:4173
 */

import { mkdir, writeFile, rm, cp } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");

async function emit(path, html) {
  const rel =
    path === "/"
      ? "index.html"
      : path.endsWith(".html")
        ? path.replace(/^\//, "")
        : `${path.replace(/^\/|\/$/g, "")}/index.html`;
  const out = join(DIST, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html, "utf8");
  return rel;
}

function sitemap(paths, baseUrl) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const priority = (p) =>
    p === "/" ? "1.0" : p.split("/").filter(Boolean).length === 1 ? "0.8" : "0.6";
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority(p)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

async function main() {
  const t0 = Date.now();

  // 1. Clean
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  // 2. Static assets, _headers and _redirects
  await cp(PUBLIC, DIST, { recursive: true });

  // 3. Stylesheet. Built before the pages so the HTML can reference it by
  //    content hash (see src/layout.mjs).
  execFileSync(
    process.execPath,
    [
      join(ROOT, "node_modules", "@tailwindcss", "cli", "dist", "index.mjs"),
      "-i",
      join(ROOT, "src", "styles.css"),
      "-o",
      join(DIST, "assets", "css", "site.css"),
      "--minify",
    ],
    { stdio: "inherit" }
  );

  // 4. Pages. Imported after the CSS exists so asset hashes resolve.
  const { page } = await import("./src/pages/index.mjs");
  const { pages, baseUrl } = await page();

  const written = [];
  for (const p of pages) written.push(await emit(p.path, p.html));

  // 5. Crawler files
  await writeFile(
    join(DIST, "sitemap.xml"),
    sitemap(pages.filter((p) => !p.noindex).map((p) => p.path), baseUrl),
    "utf8"
  );
  await writeFile(
    join(DIST, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`,
    "utf8"
  );

  console.log(`\n✓ ${written.length} pages built into dist/ in ${Date.now() - t0}ms`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
