/* Typography + entrance diff between the original site and the clone.
 * Captures both at 1440x900: entrance frames at matching timestamps,
 * computed styles for matched key elements, and per-section screenshots.
 * Usage: node scripts/qa-typography.mjs [cloneUrl] [outDir]
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const cloneUrl = process.argv[2] || "http://localhost:3001";
const origUrl = "https://oci.madebybuzzworthy.com/";
const out = process.argv[3] || "docs/design-references/qa5";
mkdirSync(out, { recursive: true });

// [label, orig selector, clone selector]
const PROBES = [
  ["pill-text", "header .logo-text, header .js-header-home-text", '[data-loader-target="text"]'],
  ["nav-link", 'header a[href*="about" i]', 'header a[href="/about"]'],
  ["hero-title", ".hero .title", ".hero .title:not(.lg\\:hidden)"],
  ["hero-tagline", ".hero p", ".hero p"],
  ["intro-main", 'section[data-slice-type="home_intro"] .my-title p, section.bg-blue p', "section.bg-blue p"],
  ["intro-highlight", 'section[data-slice-type="home_intro"] li p, section.bg-blue li p', "section.bg-blue li p"],
  ["services-word", 'section[data-slice-type="our_services"] .line-split, section[data-slice-type="our_services"] h2 ~ div div', "section h2.sr-only ~ div div"],
  ["accordion-btn", 'section[data-slice-type="our_services"] button span', ".accordion button span"],
  ["process-h2", 'section[data-slice-type="home_process"] h2', "section.overflow-hidden h2"],
  ["process-card-h3", ".js-card h3", ".js-card h3"],
  ["process-card-p", ".js-card p", ".js-card p"],
  ["projects-h2", 'section[data-slice-type="projects"] h2, .my-title.text-center h2', ".my-title.text-center h2"],
  ["project-h3", 'section[data-slice-type="projects"] h3', "[data-project-index] h3"],
  ["news-card-h3", 'section[data-slice-type="latest_news"] article h3, article h3', "article h3"],
  ["testimonial-quote", 'section[data-slice-type="testimonials"] blockquote', "blockquote"],
  ["footer-link", "footer a", "footer a"],
];

const STYLE_KEYS = [
  "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing",
  "textTransform", "color",
];

async function capture(url, tag, page) {
  await page.goto(url, { waitUntil: "commit" });
  const t0 = Date.now();
  for (const t of [400, 900, 1400, 1900, 2400, 2900, 3400, 4100, 4800]) {
    const wait = t - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({ path: `${out}/${tag}-entrance-${String(t).padStart(4, "0")}.png` });
  }
  await page.waitForTimeout(3500);

  const styles = {};
  for (const [label, origSel, cloneSel] of PROBES) {
    const sel = tag === "orig" ? origSel : cloneSel;
    styles[label] = await page.evaluate(
      ({ sel, keys }) => {
        for (const s of sel.split(",")) {
          const el = document.querySelector(s.trim());
          if (el) {
            const cs = getComputedStyle(el);
            const o = { _text: (el.textContent || "").trim().slice(0, 24) };
            keys.forEach((k) => (o[k] = cs[k]));
            return o;
          }
        }
        return null;
      },
      { sel, keys: STYLE_KEYS },
    );
  }
  return styles;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const orig = await capture(origUrl, "orig", page);
const clone = await capture(cloneUrl, "clone", page);
await browser.close();

const report = {};
for (const [label] of PROBES) {
  const o = orig[label];
  const c = clone[label];
  if (!o || !c) {
    report[label] = { missing: { orig: !o, clone: !c } };
    continue;
  }
  const diff = {};
  for (const k of STYLE_KEYS) {
    if (o[k] !== c[k]) diff[k] = { orig: o[k], clone: c[k] };
  }
  report[label] = Object.keys(diff).length
    ? { text: { orig: o._text, clone: c._text }, diff }
    : "MATCH";
}
writeFileSync(`${out}/style-diff.json`, JSON.stringify({ orig, clone, report }, null, 2));
console.log(JSON.stringify(report, null, 1));
