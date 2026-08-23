import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo/chon-kcn-hay-lam-mo/index.html");
if (!fs.existsSync(target)) throw new Error(`Missing comparison page: ${target}`);

let html = fs.readFileSync(target, "utf8");
const replacements = [
  [
    "Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng",
    "Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng/tháng",
  ],
  [
    "Nghề mỏ có Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất không?",
    "Nghề mỏ có Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất không?",
  ],
];

let changed = 0;
for (const [before, after] of replacements) {
  if (html.includes(before)) {
    html = html.replaceAll(before, after);
    changed += 1;
  }
}

for (const marker of [
  "Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng/tháng",
  "Nghề mỏ có Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất không?",
]) {
  if (!html.includes(marker)) throw new Error(`Comparison income wording is missing: ${marker}`);
}

fs.writeFileSync(target, html);
console.log(JSON.stringify({ status: "fixed", target, replacements: changed }, null, 2));
