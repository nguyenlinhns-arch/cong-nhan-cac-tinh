import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("content", "home-worker-first");
const target = path.resolve("tuyen-tho-mo", "index.html");
const expectedParts = Array.from({length: 8}, (_, index) => `part-${String(index).padStart(2, "0")}.b64`);
const actualParts = fs.readdirSync(sourceDir)
  .filter((name) => /^part-\d+\.b64$/.test(name))
  .sort();

if (JSON.stringify(actualParts) !== JSON.stringify(expectedParts)) {
  throw new Error(`Worker-first homepage source is incomplete: ${actualParts.join(", ")}`);
}

const encoded = actualParts
  .map((name) => fs.readFileSync(path.join(sourceDir, name), "utf8").replace(/\s+/g, ""))
  .join("");
const sourceHtml = Buffer.from(encoded, "base64").toString("utf8");
const sourceBytes = Buffer.byteLength(sourceHtml);
const sourceSha256 = crypto.createHash("sha256").update(sourceHtml).digest("hex");

if (!sourceHtml.startsWith("<!doctype html>")) throw new Error("Worker-first homepage is not valid HTML");
if (!sourceHtml.includes('id="noi-dung"') || !sourceHtml.includes('id="dieu-kien"') || !sourceHtml.includes('id="dang-ky"')) {
  throw new Error("Worker-first homepage is missing required navigation anchors");
}
if (sourceBytes !== 32653 || sourceSha256 !== "915d085bff4a83c44e1c7bfe6ec8d0962b87fe173493f140af05e0b472cd9f84") {
  throw new Error(`Worker-first homepage source checksum mismatch: ${sourceBytes} bytes, ${sourceSha256}`);
}

const insertions = [
  {
    marker: '<section class="worker-summary" id="dieu-kien">',
    replacement: '<section class="worker-summary" id="dieu-kien"><span id="che-do-ho-so" aria-hidden="true"></span>',
  },
  {
    marker: '<section class="worker-more" aria-labelledby="worker-more-title">',
    replacement: '<section class="worker-more" aria-labelledby="worker-more-title"><span id="theo-tinh" aria-hidden="true"></span>',
  },
];

const trackedApplicationLinks = [
  ["home-header", "header"],
  ["home-hero", "hero"],
  ["home-register", "register"],
  ["home-mobile", "mobile"],
];

let html = sourceHtml;
for (const {marker, replacement} of insertions) {
  if (!html.includes(marker)) throw new Error(`Worker-first homepage is missing compatibility marker: ${marker}`);
  html = html.replace(marker, replacement);
}

for (const [context, content] of trackedApplicationLinks) {
  const marker = `href="viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky" data-contact="application" data-context="${context}"`;
  const trackedHref = `href="viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=home_to_application_2026&amp;utm_content=home_${content}#dang-ky" data-contact="application" data-context="${context}"`;
  if (!html.includes(marker)) throw new Error(`Worker-first homepage is missing tracked application link: ${context}`);
  html = html.replace(marker, trackedHref);
}

const outputBytes = Buffer.byteLength(html);
const outputSha256 = crypto.createHash("sha256").update(html).digest("hex");
fs.writeFileSync(target, html);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/index.html",
  parts: actualParts.length,
  sourceBytes,
  sourceSha256,
  outputBytes,
  outputSha256,
  compatibilityAnchors: insertions.length,
  trackedApplicationLinks: trackedApplicationLinks.length,
}, null, 2));
