import fs from "node:fs";
import path from "node:path";

const workflowRoot = path.resolve(".github", "workflows");
const siteRoot = path.resolve("tuyen-tho-mo");
const errors = [];
const allowedContentWriters = new Set(["sync-vinacomin-youtube.yml", "refresh-article-seo-temp.yml"]);
const retiredPaths = [
  ".deploy",
  ".publish-v110-fixed-trigger",
  ".github/workflows/archive-integrity.yml",
  ".github/workflows/publish-thay-linh-v110-fixed.yml",
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
  retired_bootstrap_present: retiredPaths.filter(hasFiles),
  public_receipts: publicReceipts,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
