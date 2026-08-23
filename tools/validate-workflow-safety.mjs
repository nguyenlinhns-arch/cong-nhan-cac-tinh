import fs from "node:fs";
import path from "node:path";

const workflowRoot = path.resolve(".github", "workflows");
const siteRoot = path.resolve("tuyen-tho-mo");
const errors = [];
// Only workflows that generate audited first-party site content may write back.
// recruitment-facts-normalize is a special source-only writer and is validated
// below against an exact five-file allowlist plus a forbidden-path guard.
const allowedContentWriters = new Set([
  "sync-vinacomin-youtube.yml",
  "generate-local-coverage.yml",
  "recruitment-facts-normalize.yml",
  "recruitment-seo-copy-v11.yml",
  "seo-role-policy.yml",
]);
const retiredPaths = [
  ".deploy",
  ".publish-v110-fixed-trigger",
  ".github/workflows/archive-integrity.yml",
  ".github/workflows/publish-thay-linh-v110-fixed.yml",
];
const factsSyncAllowedPaths = [
  "content/recruitment-facts-2026.json",
  "content/recruitment-review-v10.json",
  "operations/job-posting-master-2026.json",
  "tuyen-tho-mo/data/recruitment-facts-2026.json",
  "tuyen-tho-mo/recruitment-current.json",
];

function hasFiles(target) {
  const absolute = path.resolve(target);
  if (!fs.existsSync(absolute)) return false;
  if (!fs.statSync(absolute).isDirectory()) return true;
  return fs.readdirSync(absolute).some((name) => hasFiles(path.join(absolute, name)));
}

for (const relative of retiredPaths) {
  if (hasFiles(relative)) errors.push(`Hạng mục triển khai cũ đã quay lại: ${relative}`);
}

const workflows = fs.readdirSync(workflowRoot)
  .filter((name) => /\.ya?ml$/i.test(name))
  .sort();
for (const name of workflows) {
  const text = fs.readFileSync(path.join(workflowRoot, name), "utf8");
  if (/^\s*contents:\s*write\s*$/mi.test(text) && !allowedContentWriters.has(name)) {
    errors.push(`${name}: quyền contents: write không nằm trong danh sách cho phép`);
  }
  if (/git\s+push\s+origin\s+HEAD:main/i.test(text) && !allowedContentWriters.has(name)) {
    errors.push(`${name}: không được tự đẩy trực tiếp vào main`);
  }
  if (allowedContentWriters.has(name) && /git\s+add\s+(?:\.|-A)(?:\s|$)/mi.test(text)) {
    errors.push(`${name}: writer được phép nhưng không được git add toàn bộ repository`);
  }
}

const factsSyncPath = path.join(workflowRoot, "recruitment-facts-normalize.yml");
if (!fs.existsSync(factsSyncPath)) {
  errors.push("Thiếu workflow recruitment-facts-normalize.yml");
} else {
  const text = fs.readFileSync(factsSyncPath, "utf8");
  for (const marker of [
    "Sync only canonical recruitment sources",
    "Verify canonical source agreement",
    "Ensure facts-sync never edits code or published HTML",
    "facts-sync attempted to modify forbidden path",
    "[facts-sync]",
  ]) {
    if (!text.includes(marker)) errors.push(`recruitment-facts-normalize.yml: thiếu guard ${marker}`);
  }
  for (const relative of factsSyncAllowedPaths) {
    if (!text.includes(relative)) errors.push(`recruitment-facts-normalize.yml: thiếu nguồn allowlist ${relative}`);
  }
  for (const forbiddenPattern of [
    /readdirSync\([^\n]*rootDir/,
    /function\s+walk\s*\([^)]*\)[\s\S]{0,500}tools/,
    /git\s+add\s+\./,
    /git\s+add\s+-A/,
    /git\s+add[^\n]*(?:tools\/|\.github\/workflows\/pages\.yml|tuyen-tho-mo\/[^\s]*\.html)/,
  ]) {
    if (forbiddenPattern.test(text)) errors.push(`recruitment-facts-normalize.yml: phát hiện cơ chế ghi rộng bị cấm: ${forbiddenPattern}`);
  }
  const allowedCase = factsSyncAllowedPaths.join("|");
  if (!text.includes(`case \"$file\" in`)) errors.push("recruitment-facts-normalize.yml: thiếu case allowlist cho git diff");
  if (!text.includes("git diff --name-only")) errors.push("recruitment-facts-normalize.yml: thiếu kiểm tra danh sách file thay đổi");
  if (!/^\s*contents:\s*write\s*$/mi.test(text)) errors.push("recruitment-facts-normalize.yml: cần contents: write để đồng bộ đúng 5 nguồn");
  if (!text.includes("git push")) errors.push("recruitment-facts-normalize.yml: thiếu bước push source-sync đã audit");
  void allowedCase;
}

const liveVerifyPath = path.join(workflowRoot, "verify-live-recruitment-facts.yml");
if (!fs.existsSync(liveVerifyPath)) {
  errors.push("Thiếu workflow verify-live-recruitment-facts.yml");
} else {
  const text = fs.readFileSync(liveVerifyPath, "utf8");
  if (!/workflow_run:[\s\S]*Deploy GitHub Pages/.test(text)) errors.push("verify-live-recruitment-facts.yml: chưa chạy sau Deploy GitHub Pages");
  if (!/^\s*contents:\s*read\s*$/mi.test(text)) errors.push("verify-live-recruitment-facts.yml: chỉ được contents: read");
  if (/git\s+(?:commit|push)/i.test(text)) errors.push("verify-live-recruitment-facts.yml: hậu kiểm live không được ghi repository");
  for (const marker of [
    "/data/recruitment-facts-2026.json",
    "7,5 triệu đồng/tháng",
    "hoàn thành định mức lao động",
    'href="/viec-lam-nganh-than/"',
    "data-facebook-reel-facade",
    "canonical_facts_version",
  ]) {
    if (!text.includes(marker)) errors.push(`verify-live-recruitment-facts.yml: thiếu kiểm tra live ${marker}`);
  }
  if (!text.includes("Xem đủ 26 tỉnh, thành")) errors.push("verify-live-recruitment-facts.yml: thiếu guard loại bỏ nhãn phạm vi tỉnh cũ");
}

const distributionPrPath = path.join(workflowRoot, "recruitment-distribution-v11-pr.yml");
if (!fs.existsSync(distributionPrPath)) {
  errors.push("Thiếu workflow recruitment-distribution-v11-pr.yml");
} else {
  const text = fs.readFileSync(distributionPrPath, "utf8");
  if (!/pull_request:/u.test(text)) errors.push("recruitment-distribution-v11-pr.yml: thiếu pull_request gate");
  if (!/^\s*contents:\s*read\s*$/mi.test(text)) errors.push("recruitment-distribution-v11-pr.yml: phải chỉ contents: read");
  if (/git\s+(?:commit|push)/i.test(text)) errors.push("recruitment-distribution-v11-pr.yml: PR gate không được ghi repository");
  for (const marker of [
    "generate-job-board-pages.mjs",
    "normalize-machine-feeds-current-facts-v11.mjs",
    "validate-workflow-safety.mjs",
    "validate-job-postings.mjs",
  ]) {
    if (!text.includes(marker)) errors.push(`recruitment-distribution-v11-pr.yml: thiếu bước ${marker}`);
  }
}

const publicReceipts = fs.readdirSync(siteRoot)
  .filter((name) => /(?:RECEIPT|PUBLISH_V110|ACTIONS_HEALTH).*\.md$/i.test(name));
for (const name of publicReceipts) errors.push(`Tệp vận hành cũ đang bị xuất bản công khai: tuyen-tho-mo/${name}`);

console.log(JSON.stringify({
  workflows,
  content_write_workflows: workflows.filter((name) => {
    const text = fs.readFileSync(path.join(workflowRoot, name), "utf8");
    return /^\s*contents:\s*write\s*$/mi.test(text);
  }),
  facts_sync_allowlist: factsSyncAllowedPaths,
  live_recruitment_verifier: fs.existsSync(liveVerifyPath),
  distribution_pr_gate: fs.existsSync(distributionPrPath),
  retired_bootstrap_present: retiredPaths.filter(hasFiles),
  public_receipts: publicReceipts,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
await import("./validate-recruitment-distribution-v11.mjs");