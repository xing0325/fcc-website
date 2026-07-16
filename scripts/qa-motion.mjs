/* Motion QA: frame-captures the loader entrance, scroll reveals and the
 * mouse trail against the running dev server. Usage:
 *   node scripts/qa-motion.mjs [baseUrl] [outDir]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3001";
const out = process.argv[3] || "docs/design-references/qa4";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const shot = (name) => page.screenshot({ path: `${out}/${name}.png` });

// --- 1. loader entrance, frame by frame ---
await page.goto(base, { waitUntil: "commit" });
const t0 = Date.now();
const frameTimes = [200, 500, 800, 1100, 1400, 1700, 2000, 2400, 2900, 3400, 3900, 4400, 5000, 5600];
for (const t of frameTimes) {
  const wait = t - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await shot(`entrance-${String(t).padStart(4, "0")}ms`);
}

// wait for loader completion (up to 12s)
await page
  .waitForFunction(() => window.__loaderCompleted === true, null, { timeout: 12000 })
  .catch(() => console.log("WARN: loader never completed"));
await page.waitForTimeout(800);
await shot("hero-settled");

const state = await page.evaluate(() => ({
  steps: window.__loaderSteps,
  dbg: window.__animDebug,
  completed: !!window.__loaderCompleted,
}));
console.log("loader:", JSON.stringify(state));

// --- 2. mouse trail on the hero ---
for (let i = 0; i <= 30; i++) {
  await page.mouse.move(200 + i * 30, 450 + Math.sin(i / 4) * 120);
  await page.waitForTimeout(16);
}
await shot("trail-hero");

// --- 3. scroll reveals, section by section ---
const stops = [
  ["intro", 900],
  ["intro-stairs", 1500],
  ["services", 2200],
  ["services-accordion", 2900],
  ["process-start", 3700],
  ["process-mid", 4300],
  ["process-end", 4900],
  ["projects-title", 5600],
  ["projects-cards", 6300],
  ["testimonials", 7300],
  ["news", 8300],
  ["footer", 9900],
];
for (const [name, y] of stops) {
  await page.evaluate((yy) => window.__lenis?.scrollTo(yy, { duration: 0.8 }), y);
  await page.waitForTimeout(1600);
  await shot(`scroll-${name}`);
}

// --- 4. hover states: project card (dither -> original) ---
await page.evaluate(() => window.__lenis?.scrollTo(6300, { immediate: true }));
await page.waitForTimeout(1200);
const card = await page.$('[data-project-index="0"] .group');
if (card) {
  await card.hover();
  await page.waitForTimeout(900);
  await shot("project-hover");
}

console.log("done ->", out);
await browser.close();
