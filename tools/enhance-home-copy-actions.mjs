import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "index.html");
let html = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(html);
const beforeSha256 = crypto.createHash("sha256").update(html).digest("hex");

if (html.includes("data-worker-copy=")) throw new Error("Simplified homepage must not reintroduce copy-action controls");
if (!html.includes('class="home-funnel"')) throw new Error("Simplified consultation homepage is missing");

const oldScript = '<script src="/worker-info-finder.js?v=2" defer></script>';
const newScript = '<script src="/worker-info-finder.js?v=3" defer></script>';
if (html.includes(newScript)) {
  console.log(JSON.stringify({ target: "tuyen-tho-mo/index.html", status: "already-enhanced", copyButtons: 0, beforeBytes, beforeSha256 }, null, 2));
  process.exit(0);
}
if (!html.includes(oldScript)) throw new Error("Could not locate worker self-check script v2");
html = html.replace(oldScript, newScript);

const afterBytes = Buffer.byteLength(html);
const afterSha256 = crypto.createHash("sha256").update(html).digest("hex");
fs.writeFileSync(target, html);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/index.html",
  status: "enhanced",
  copyButtons: 0,
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
