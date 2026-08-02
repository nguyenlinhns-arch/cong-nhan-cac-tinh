import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "job-application.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const markers = [
  "const prefilledContext = []",
  'draftStatus.dataset.contextPrefilled = "true"',
  'track("ApplicationContextPrefill"',
];

if (markers.every((marker) => source.includes(marker))) {
  console.log(JSON.stringify({target: "tuyen-tho-mo/job-application.js", status: "already-enhanced", beforeBytes, beforeSha256}, null, 2));
  process.exit(0);
}
if (markers.some((marker) => source.includes(marker))) throw new Error("Application prefill notice is only partially present");

const insertionPoint = `  form.addEventListener("input", event => {`;
const enhancement = `  const prefilledContext = [];
  for (const [name, label] of [["province", "tỉnh/thành"], ["trade", "nghề"]]) {
    const requested = params.get(name);
    const field = form.elements.namedItem(name);
    if (requested && field?.value) prefilledContext.push(\`\${label} \${field.value}\`);
  }
  if (prefilledContext.length && draftStatus) {
    draftStatus.dataset.contextPrefilled = "true";
    draftStatus.textContent = \`Đã chọn sẵn \${prefilledContext.join(" và ")} từ trang bạn vừa xem. Bạn có thể đổi nếu cần. \${draftStatus.textContent}\`;
    track("ApplicationContextPrefill", { action: "context_prefilled", context: formContext, fields: prefilledContext.length });
  }

`;

if (!source.includes(insertionPoint)) throw new Error("Could not locate application input listener");
source = source.replace(insertionPoint, enhancement + insertionPoint);
for (const marker of markers) if (!source.includes(marker)) throw new Error(`Application prefill notice is missing ${marker}`);
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 32_000) throw new Error(`Province-aware job-application.js exceeds 32 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/job-application.js",
  status: "enhanced",
  supportedFields: ["province", "trade"],
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
