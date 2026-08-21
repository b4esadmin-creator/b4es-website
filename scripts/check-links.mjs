#!/usr/bin/env node
/**
 * Verifies that every root-relative link in the built site resolves to a file
 * that actually exists. Run after `npm run build`.
 *
 *   npm run check:links
 *
 * Exits non-zero if anything is broken, so CI fails on a dead link.
 */

import { readdir, readFile, access } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

try {
  await access(DIST);
} catch {
  console.error("✗ dist/ not found — run `npm run build` first.");
  process.exit(1);
}

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) await walk(f, out);
    else out.push(f);
  }
  return out;
}

const all = await walk(DIST);
const htmlFiles = all.filter((f) => f.endsWith(".html"));

// Every path the deployed site can serve.
const known = new Set(all.map((f) => "/" + relative(DIST, f).replace(/\\/g, "/")));
for (const f of htmlFiles) {
  known.add("/" + relative(DIST, f).replace(/index\.html$/, "").replace(/\\/g, "/"));
}

const broken = new Map();
let checked = 0;

for (const f of htmlFiles) {
  const html = await readFile(f, "utf8");
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (!raw.startsWith("/")) continue; // external, mailto:, tel:, in-page anchors
    checked++;
    const path = raw.split("#")[0].split("?")[0];
    if (known.has(path)) continue;
    if (!broken.has(path)) broken.set(path, new Set());
    broken.get(path).add("/" + relative(DIST, f));
  }
}

console.log(`Checked ${checked} internal links across ${htmlFiles.length} pages.`);

if (broken.size === 0) {
  console.log("✓ No broken internal links.");
  process.exit(0);
}

console.error(`\n✗ ${broken.size} broken link target(s):\n`);
for (const [target, sources] of broken) {
  console.error(`  ${target}`);
  for (const s of [...sources].slice(0, 5)) console.error(`      linked from ${s}`);
}
process.exit(1);
