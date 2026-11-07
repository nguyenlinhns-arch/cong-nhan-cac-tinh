import fs from "node:fs";
import path from "node:path";

// v11: the committed homepage is now the canonical authored surface. The old
// base64 renderer is kept as an audit artifact, but it encoded stale literal
// metadata and was no longer safe to run repeatedly. Rebuild only the bundled
// CSS here; downstream enhancers and validators remain authoritative for the
// rendered homepage.
await import("./build-home-css.mjs");

const root = path.resolve(import.meta.dirname, "..");
const file = path.join(root, "tuyen-tho-mo", "index.html");
if (!fs.existsSync(file)) throw new Error("Worker-first homepage v11: thiếu index.html");
let html = fs.readFileSync(file, "utf8");

// Both bundles affect the visible header, typography and responsive layout.
// Keep them parser-discovered and render-blocking, in their existing cascade
// order. A JavaScript-inserted stylesheet allowed the partial layout to paint.
html = html
  .replace(/\/home-critical\.css\?v=\d+/gu, "/home-critical.css?v=3")
  .replace(/\/home-content\.css\?v=\d+/gu, "/home-content.css?v=3")
  .replace(/\s*<script\s+data-home-content-loader>[\s\S]*?<\/script>/giu, "")
  .replace(/\s*<noscript>\s*<link[^>]+home-content\.css[^>]*>\s*<\/noscript>/giu, "")
  .replace(/\s*<link\b[^>]+href=["']\/home-content\.css\?v=3["'][^>]*>/giu, "")
  .replace(/\s*<link\b[^>]+data-home-font-preload[^>]*>/giu, "");
const fontPreloads = [400, 700, 800].flatMap((weight) =>
  ["vietnamese", "latin"].map((subset) =>
    `  <link data-home-font-preload rel="preload" href="/assets/fonts/be-vietnam-pro-${subset}-${weight}-normal.woff2" as="font" type="font/woff2" crossorigin>`,
  ),
).join("\n");
html = html.replace(
  /(<link\s+rel=["']stylesheet["']\s+href=["']\/home-critical\.css\?v=3["']\s*\/?>)/iu,
  `${fontPreloads}\n  $1\n  <link rel="stylesheet" href="/home-content.css?v=3">`,
);
fs.writeFileSync(file, html);

const required = [
  "<!doctype html>",
  'id="noi-dung"',
  'id="dieu-kien"',
  'id="dang-ky"',
  'class="home-funnel"',
  "7,5 triệu đồng/tháng",
  "20–25 triệu",
  "/home-critical.css?v=3",
  "/home-content.css?v=3",
  "home-library__card--payroll",
  "home-library__grid--four",
  'href="/bang-luong/"',
  "Bảng lương các công ty theo quý",
];
const missing = required.filter((marker) => !html.includes(marker));
if (missing.length) {
  console.error(JSON.stringify({status:"worker-first-home-v11-invalid", missing}, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "worker-first-home-v11-current-source-ready",
  legacyBase64Renderer: "retained-for-audit-not-executed",
  homepage: "/index.html",
  homeCriticalCss: "/home-critical.css?v=3",
  homeContentCss: "/home-content.css?v=3",
}, null, 2));
