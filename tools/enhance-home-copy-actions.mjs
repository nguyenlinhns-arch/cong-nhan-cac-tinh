import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "index.html");
let html = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(html);
const beforeSha256 = crypto.createHash("sha256").update(html).digest("hex");

if (html.includes("data-worker-copy=")) throw new Error("Simplified homepage must not reintroduce copy-action controls");
if (!html.includes('class="home-funnel"')) throw new Error("Simplified consultation homepage is missing");

const payrollImagePattern = /<img\b[^>]*\bsrc="\/bang-luong\/assets\/vang-danh-q2-2026-bang-luong-01\.webp"[^>]*>\s*/g;
const payrollImagesRemoved = (html.match(payrollImagePattern) || []).length;
html = html.replace(payrollImagePattern, "");

const finderPattern = /<script\s+src="\/worker-info-finder\.js\?v=(\d+)"\s+defer><\/script>/i;
const finderMatch = html.match(finderPattern);
if (!finderMatch) throw new Error("Could not locate worker self-check script");
const finderVersion = Number(finderMatch[1]);
if (!Number.isFinite(finderVersion) || finderVersion < 2) throw new Error(`Unsupported worker self-check script version: ${finderMatch[1]}`);
let status = "already-enhanced";
let effectiveFinderVersion = finderVersion;
if (finderVersion === 2) {
  html = html.replace(finderPattern, '<script src="/worker-info-finder.js?v=3" defer></script>');
  status = "enhanced";
  effectiveFinderVersion = 3;
}
if (effectiveFinderVersion < 3) throw new Error(`Worker self-check script must be v3 or newer, got v${effectiveFinderVersion}`);

const afterBytes = Buffer.byteLength(html);
const afterSha256 = crypto.createHash("sha256").update(html).digest("hex");
fs.writeFileSync(target, html);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/index.html",
  status,
  workerInfoFinderVersion: effectiveFinderVersion,
  copyButtons: 0,
  payrollImagesRemoved,
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
