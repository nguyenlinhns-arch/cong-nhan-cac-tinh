import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "tuyen-tho-mo", "viec-lam-nganh-than");
let changed = 0;
for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
  if (!entry.isDirectory()) continue;
  const file = path.join(root, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = before
    .replace(/Đào tạo nghề cơ điện mỏ theo kế hoạch tuyển sinh\./giu, "Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.")
    .replace(/Đào tạo theo kế hoạch tuyển sinh\./giu, "Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.");
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}
console.log(JSON.stringify({status:"province-legacy-templates-v11-ready", changed}, null, 2));
