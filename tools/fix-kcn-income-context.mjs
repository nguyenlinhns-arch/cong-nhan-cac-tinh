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

console.log(JSON.stringify({
  target: "/chon-kcn-hay-lam-mo/",
  status: source === before ? "already-compliant" : "rewritten",
  income_nodes: incomeNodes.length,
  invalid_income_nodes: invalid.length,
}, null, 2));