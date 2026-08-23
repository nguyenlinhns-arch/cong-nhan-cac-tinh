import "./rewrite-kcn-comparison.mjs";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo/chon-kcn-hay-lam-mo/index.html");
let html = fs.readFileSync(target, "utf8");

const replacements = [
  [
    "Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng",
    "Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng/tháng",
  ],
  [
    "Nghề mỏ có Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động. không?",
    "Nghề mỏ có Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động. không?",
  ],
];

for (const [before, after] of replacements) {
  if (!html.includes(before)) throw new Error(`Missing KCN income text: ${before}`);
  html = html.replace(before, after);
}

for (const forbidden of [
  ">Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng<",
  ">Nghề mỏ có Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động. không?<",
]) {
  if (html.includes(forbidden)) throw new Error(`Incomplete income context remains: ${forbidden}`);
}

const incomeNodes = [...html.matchAll(/>([^<>]*20[–-]25\s*triệu[^<>]*)</giu)]
  .map(match => match[1].replace(/\s+/g, " ").trim());
const invalidIncomeNodes = incomeNodes.filter(text => !/hoàn thành định mức lao động/iu.test(text));
if (invalidIncomeNodes.length) {
  throw new Error(`KCN page has income text without labor-norm condition: ${invalidIncomeNodes.join(" | ")}`);
}

fs.writeFileSync(target, html);
console.log(JSON.stringify({
  status: "income-context-fixed",
  page: "/chon-kcn-hay-lam-mo/",
  replacements: replacements.length,
  income_nodes: incomeNodes.length,
  invalid_income_nodes: invalidIncomeNodes.length,
}, null, 2));