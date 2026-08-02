import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "index.html");
let html = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(html);
const beforeSha256 = crypto.createHash("sha256").update(html).digest("hex");
const markers = [
  'data-worker-copy="admission_address"',
  'data-worker-copy="application_message"',
  '/worker-info-finder.js?v=3',
];

if (markers.every((marker) => html.includes(marker))) {
  const copyButtons = (html.match(/data-worker-copy=/g) || []).length;
  if (copyButtons !== 2) throw new Error(`Homepage copy actions expected 2 buttons, got ${copyButtons}`);
  console.log(JSON.stringify({ target: "tuyen-tho-mo/index.html", status: "already-enhanced", copyButtons, beforeBytes, beforeSha256 }, null, 2));
  process.exit(0);
}
if (markers.some((marker) => html.includes(marker))) throw new Error("Homepage copy actions are only partially present");

const addressPattern = /(<article class="worker-address__card"><small>Nơi học và nhập học<\/small>[\s\S]*?<div class="worker-address__note">[^<]*<\/div>)(<\/article>)/;
if (!addressPattern.test(html)) throw new Error("Could not locate the admission address card");
html = html.replace(
  addressPattern,
  '$1<div class="button-row"><button class="button button-outline" type="button" data-worker-copy="admission_address">Sao chép địa chỉ nhập học</button></div>$2',
);

const registerPattern = /(<div class="worker-register__actions">)/;
if ((html.match(new RegExp(registerPattern.source, "g")) || []).length !== 1) throw new Error("Could not locate one registration action row");
html = html.replace(
  registerPattern,
  '$1<button class="button button-outline" type="button" data-worker-copy="application_message">Sao chép mẫu tin</button>',
);

const oldScript = '<script src="/worker-info-finder.js?v=2" defer></script>';
if (!html.includes(oldScript)) throw new Error("Could not locate worker information finder v2");
html = html.replace(oldScript, '<script src="/worker-info-finder.js?v=3" defer></script>');

for (const marker of markers) if (!html.includes(marker)) throw new Error(`Homepage copy action is missing ${marker}`);
const copyButtons = (html.match(/data-worker-copy=/g) || []).length;
if (copyButtons !== 2) throw new Error(`Homepage copy actions expected 2 buttons, got ${copyButtons}`);
const afterBytes = Buffer.byteLength(html);
const afterSha256 = crypto.createHash("sha256").update(html).digest("hex");
fs.writeFileSync(target, html);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/index.html",
  status: "enhanced",
  copyButtons,
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
