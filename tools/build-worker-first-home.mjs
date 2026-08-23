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
const html = fs.readFileSync(file, "utf8");
const required = [
  "<!doctype html>",
  'id="noi-dung"',
  'id="dieu-kien"',
  'id="dang-ky"',
  'class="home-funnel"',
  "7,5 triệu đồng/tháng",
  "20–25 triệu",
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
}, null, 2));
