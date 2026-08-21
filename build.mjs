#!/usr/bin/env node
/**
 * B4ES static site builder.
 *
 * Zero runtime dependencies. Composes plain HTML files from the modules in
 * src/ and writes them to the repository root, where any static host
 * (GitHub Pages, Cloudflare Pages, Netlify, S3, nginx) can serve them as-is.
 *
 *   node build.mjs          build HTML
 *   npm run build           build CSS + HTML
 */

import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { page } from "./src/pages/index.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));

// Directories that are source/tooling, never build output.
const PROTECTED = new Set([
  ".git",
  ".github",
  "node_modules",
  "src",
  "assets",
  "build.mjs",
  "package.json",
  "package-lock.json",
  "README.md",
  ".gitignore",
  "CNAME",
]);

async function cleanPreviousBuild() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  for (const e of entries) {
    if (PROTECTED.has(e.name)) continue;
    // Only remove generated HTML pages and their directories.
    if (e.isDirectory() || e.name.endsWith(".html") || e.name.endsWith(".xml") || e.name === "robots.txt") {
      await rm(join(ROOT, e.name), { recursive: true, force: true });
    }
  }
}

async function emit(path, html) {
  const rel =
    path === "/"
      ? "index.html"
      : path.endsWith(".html")
        ? path.replace(/^\//, "")
        : `${path.replace(/^\/|\/$/g, "")}/index.html`;
  const out = join(ROOT, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html, "utf8");
  return rel;
}

function sitemap(paths, baseUrl) {
  const priority = (p) => (p === "/" ? "1.0" : p.split("/").filter(Boolean).length === 1 ? "0.8" : "0.6");
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority(p)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

async function main() {
  const t0 = Date.now();
  const { pages, baseUrl } = await page();

  await cleanPreviousBuild();

  const written = [];
  for (const p of pages) {
    written.push(await emit(p.path, p.html));
  }

  await writeFile(
    join(ROOT, "sitemap.xml"),
    sitemap(
      pages.filter((p) => !p.noindex).map((p) => p.path),
      baseUrl
    ),
    "utf8"
  );

  await writeFile(
    join(ROOT, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`,
    "utf8"
  );

  // GitHub Pages: do not run Jekyll over the output.
  await writeFile(join(ROOT, ".nojekyll"), "", "utf8");

  if (!existsSync(join(ROOT, "assets/css/site.css"))) {
    console.warn("\n  ⚠  assets/css/site.css is missing — run `npm run build:css`.\n");
  }

  console.log(`✓ ${written.length} pages built in ${Date.now() - t0}ms`);
  for (const w of written) console.log(`  ${w}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
