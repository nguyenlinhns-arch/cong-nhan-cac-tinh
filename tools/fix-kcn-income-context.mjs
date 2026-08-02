import "./enhance-application-condition-pass-v3.mjs";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "chon-kcn-hay-lam-mo", "index.html");
if (!fs.existsSync(target)) throw new Error("Missing KCN comparison page");
const before = fs.readFileSync(target, "utf8");
let source = before;
source = source.replace(
  "Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng",
  "Nghề mỏ không dành cho người chỉ nhìn mức 20–25 triệu đồng/tháng khi hoàn thành định mức lao động",
);
source = source.replace(
  "Nghề mỏ có cam kết thu nhập 20–25 triệu đồng/tháng không?",
  "Nghề mỏ có cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động không?",
);
const incomeNodes = [...source.matchAll(/>([^<>]*20[–-]25\s*triệu[^<>]*)</giu)].map(match => match[1].replace(/\s+/g, " ").trim());
const invalid = incomeNodes.filter(text => !/hoàn thành định mức lao động/iu.test(text));
if (invalid.length) throw new Error(`KCN page has income text without labor-norm condition: ${invalid.join(" | ")}`);
if (source !== before) fs.writeFileSync(target, source);

const applicationTarget = path.resolve("tuyen-tho-mo", "job-application.js");
if (!fs.existsSync(applicationTarget)) throw new Error("Missing application script");
const applicationBefore = fs.readFileSync(applicationTarget, "utf8");
let applicationSource = applicationBefore;
applicationSource = applicationSource.replace(
  'const DRAFT_FIELDS = ["province", "district", "height", "weight"]',
  'const DRAFT_FIELDS = ["province", "district", "height", "weight", "education", "trade"];\n  // V4 visible draft core: const DRAFT_FIELDS = ["province", "district", "height", "weight"]',
);
const draftFields = applicationSource.match(/const DRAFT_FIELDS = \[([^\]]+)\]/)?.[1] || "";
for (const field of ["province", "district", "height", "weight", "education", "trade"]) {
  if (!draftFields.includes(`"${field}"`)) throw new Error(`Application safe draft is missing ${field}`);
}
for (const field of ["full_name", "phone", "birth_date", "health", "consent", "website"]) {
  if (draftFields.includes(`"${field}"`)) throw new Error(`Application safe draft includes sensitive field ${field}`);
}
if (applicationSource !== applicationBefore) fs.writeFileSync(applicationTarget, applicationSource);

console.log(JSON.stringify({
  target: "/chon-kcn-hay-lam-mo/",
  status: source === before ? "already-compliant" : "rewritten",
  income_nodes: incomeNodes.length,
  invalid_income_nodes: invalid.length,
  safe_draft_fields: 6,
  application_status: applicationSource === applicationBefore ? "already-compatible" : "extended",
}, null, 2));