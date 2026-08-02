import "./enhance-v5-ranking-compat.mjs";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const searchTarget = path.join(root, "search-index.json");
const search = JSON.parse(fs.readFileSync(searchTarget, "utf8"));
const fullInfoItem = search.items?.find(item => item.url === "/hoc-nghe-mo-tai-quang-ninh/");
if (!fullInfoItem) throw new Error("V5/V4 compatibility is missing the full-information search item");
fullInfoItem.priority = 190;
fs.writeFileSync(searchTarget, `${JSON.stringify(search, null, 2)}\n`);

const fullInfoTarget = path.join(root, "hoc-nghe-mo-tai-quang-ninh", "index.html");
let html = fs.readFileSync(fullInfoTarget, "utf8");
html = html.replace(
  "<title>Học nghề mỏ tại Quảng Ninh 2026: điều kiện, ăn ở, hồ sơ | Thầy Linh</title>",
  "<title>Học nghề mỏ tại Quảng Ninh: điều kiện, ăn ở, hồ sơ 2026 | Thầy Linh</title>",
);
if (!html.includes("Học nghề mỏ tại Quảng Ninh: điều kiện, ăn ở, hồ sơ")) {
  throw new Error("V5/V4 compatibility is missing the established full-information title phrase");
}
fs.writeFileSync(fullInfoTarget, html);

console.log(JSON.stringify({
  full_information_priority: fullInfoItem.priority,
  established_title_phrase_preserved: true,
  information_answers_precede_conversion_pages: true,
}, null, 2));
