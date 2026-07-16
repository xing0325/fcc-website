// Downloads all remote assets (images, fonts, favicon) from the target site into public/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const research = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/research/sections.json'), 'utf8'));

// Deduplicate prismic images by document id, keep the largest/cleanest variant
const raw = research.imageUrls
  .map(u => u.replace(/&amp;/g, '&'))
  .filter(u => u.startsWith('https://') && !u.includes(' '));
const byId = new Map();
for (const u of raw) {
  const m = u.match(/prismic\.io\/oci-awards\/([A-Za-z0-9_-]+?)_([^?]+)/);
  if (!m) continue;
  const id = m[1];
  const prev = byId.get(id);
  // prefer URLs with explicit width params (rendered variants), highest w
  const w = Number((u.match(/[?&]w=(\d+)/) || [])[1] || 0);
  const pw = prev ? Number((prev.match(/[?&]w=(\d+)/) || [])[1] || 0) : -1;
  if (!prev || w > pw) byId.set(id, u);
}

const jobs = [];
for (const [id, u] of byId) {
  const m = u.match(/prismic\.io\/oci-awards\/[A-Za-z0-9_-]+?_([^?]+)/);
  let name = decodeURIComponent(m[1]).replace(/[^A-Za-z0-9.-]+/g, '-').toLowerCase();
  if (u.includes('.svg')) { jobs.push({ url: u.split('?')[0], dest: `public/images/${name}` }); continue; }
  jobs.push({ url: u, dest: `public/images/${name.replace(/\.(jpeg|png|jpg)$/i, '.jpg')}` });
}

// fonts
for (const f of ['PPNeueMontreal-Regular.woff2', 'PPNeueMontreal-Medium.woff2', 'GTAmericaMono-Regular.woff2']) {
  jobs.push({ url: `https://oci.madebybuzzworthy.com/fonts/${f}`, dest: `public/fonts/${f}` });
}
jobs.push({ url: 'https://oci.madebybuzzworthy.com/favicon.ico', dest: 'public/seo/favicon.ico' });

fs.mkdirSync(path.join(ROOT, 'public/images'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public/fonts'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'public/seo'), { recursive: true });

async function dl({ url, dest }) {
  const out = path.join(ROOT, dest);
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    console.log('OK ', dest, fs.statSync(out).size);
  } catch (e) {
    console.log('FAIL', url, String(e).slice(0, 120));
  }
}

for (let i = 0; i < jobs.length; i += 4) {
  await Promise.all(jobs.slice(i, i + 4).map(dl));
}
console.log('DONE', jobs.length, 'jobs');
