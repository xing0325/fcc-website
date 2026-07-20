/* Post-export rewrite for GitHub Pages: the site uses raw <img>/<a> with
 * absolute paths ("/images/...", href="/about"), which Next's basePath does
 * not rewrite. This prefixes those exact literals in the exported out/ dir —
 * in both the emitted HTML and the hydration JS, so server markup and client
 * props stay consistent.
 * Usage: node scripts/postexport-pages.mjs [outDir] [basePath]
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const out = process.argv[2] || "out";
const base = process.argv[3] || "/fcc-website";

const routes = [
  "/about",
  "/services",
  "/projects",
  "/clients",
  "/culture-and-careers",
  "/blog",
  "/contact",
];

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if ([".html", ".js", ".css", ".txt"].includes(extname(p))) files.push(p);
  }
})(out);

let touched = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  let s = src;

  // brand assets — path is unique to our content, safe to replace globally
  s = s.replaceAll(`"/images/`, `"${base}/images/`);

  // internal links: exact enumerated literals only, never Next's own runtime
  for (const r of routes) {
    // href="/about", href="/about#mentors", href="/about/" (trailingSlash)
    s = s.replace(
      new RegExp(`(href=|href:\\s*)"${r}(?=[/#"])`, "g"),
      `$1"${base}${r}`
    );
  }
  // logo link home
  s = s.replaceAll(`href="/"`, `href="${base}/"`).replaceAll(`href:"/"`, `href:"${base}/"`);

  if (s !== src) {
    writeFileSync(file, s);
    touched++;
  }
}
console.log(`rewrote ${touched}/${files.length} files under ${out} with base ${base}`);
