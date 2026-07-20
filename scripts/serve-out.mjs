/* Serves the static export the way GitHub Pages will: out/ mounted under a
 * basePath prefix. Usage: node scripts/serve-out.mjs [port] [outDir] [basePath]
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const port = Number(process.argv[2] || 8099);
const out = process.argv[3] || "out";
const base = process.argv[4] || "/fcc-website";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!url.startsWith(base + "/") && url !== base) {
    res.writeHead(404).end("outside basePath (Pages would 404 here): " + url);
    return;
  }
  let rel = normalize(url.slice(base.length)).replace(/^\/+/, "");
  let file = join(out, rel);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) file = file + ".html";
  if (!existsSync(file)) {
    res.writeHead(404).end("not found: " + url);
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`serving ${out} at http://localhost:${port}${base}/`));
