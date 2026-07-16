import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const base = process.argv[2] || "http://localhost:3002";
const out = "docs/design-references/fcc-qa3";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

// 1. menu overlay (desktop)
const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base, { waitUntil: "commit" });
await p.waitForFunction(() => window.__loaderCompleted === true, null, { timeout: 15000 }).catch(() => {});
await p.waitForTimeout(500);
await p.evaluate(() => window.__lenis?.scrollTo(300, { immediate: true }));
await p.waitForTimeout(800);
await p.click('button[aria-label="open menu"]');
await p.waitForTimeout(1000);
await p.screenshot({ path: `${out}/menu-open.png` });
await p.close();

// 2. mobile 390
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(base, { waitUntil: "commit" });
await m.waitForFunction(() => window.__loaderCompleted === true, null, { timeout: 15000 }).catch(() => {});
await m.waitForTimeout(1000);
await m.screenshot({ path: `${out}/mobile-hero.png` });
for (const [name, y] of [["intro", 900], ["process", 3400], ["cases", 5200], ["footer", 99999]]) {
  await m.evaluate((yy) => window.__lenis?.scrollTo(yy, { immediate: true }));
  await m.waitForTimeout(1400);
  await m.screenshot({ path: `${out}/mobile-${name}.png` });
}
await m.close();
await browser.close();
console.log("done");
