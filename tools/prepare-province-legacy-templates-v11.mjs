import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const provinceRoot = path.join(root, "tuyen-tho-mo", "viec-lam-nganh-than");
let changedFiles = 0;
let trainingFixes = 0;
let navigationFixes = 0;

for (const entry of fs.readdirSync(provinceRoot, {withFileTypes: true})) {
  if (!entry.isDirectory()) continue;
  const file = path.join(provinceRoot, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  let after = before;

  const trainingBefore = after;
  after = after
    .replace(/Đào tạo nghề cơ điện mỏ theo kế hoạch tuyển sinh\./giu, "Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.")
    .replace(/Đào tạo theo kế hoạch tuyển sinh\./giu, "Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.");
  if (after !== trainingBefore) trainingFixes += 1;

  const navBefore = after;
  after = after.replace(/href=(['"])(?:\/|\.\.\/\.\.\/)?#theo-tinh\1/giu, 'href="/viec-lam-nganh-than/"');
  if (after !== navBefore) navigationFixes += 1;

  if (after !== before) {
    fs.writeFileSync(file, after);
    changedFiles += 1;
  }
}

console.log(JSON.stringify({
  status: "province-legacy-templates-v11-ready",
  changedFiles,
  trainingFixes,
  navigationFixes,
}, null, 2));
