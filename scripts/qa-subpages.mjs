/* Subpage QA: visits every subpage on the running dev server, waits for the
 * loader + reveals, captures console/page errors and full-page screenshots.
 * Usage:
 *   node scripts/qa-subpages.mjs [baseUrl] [outDir]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://localhost:3002";
const out = process.argv[3] || "docs/design-references/fcc-subpages-qa1";
mkdirSync(out, { recursive: true });

const routes = [
  "about",
  "services",
  "projects",
  "clients",
  "culture-and-careers",
  "blog",
  "contact",
];

const browser = await chromium.launch();
let failures = 0;

for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  const resp = await page.goto(`${base}/${route}`, { waitUntil: "load", timeout: 60000 });
  await page
    .waitForFunction(() => window.__loaderCompleted === true, null, { timeout: 15000 })
    .catch(() => errors.push("loader never completed"));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${route}-top.png` });

  // scroll through the page so scrub/reveal animations fire, then full-page shot
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${route}-full.png`, fullPage: true });

  const status = resp?.status();
  const ok = status === 200 && errors.length === 0;
  if (!ok) failures++;
  console.log(
    `${ok ? "OK " : "FAIL"} /${route} status=${status} errors=${errors.length}` +
      (errors.length ? `\n  ${errors.slice(0, 5).join("\n  ")}` : "")
  );
  await page.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
