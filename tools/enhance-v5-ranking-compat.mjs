import "./enhance-v5-search-compat.mjs";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "search-index.json");
const data = JSON.parse(fs.readFileSync(target, "utf8"));
const priorities = new Map([
  ["/kiem-tra-dieu-kien/", 190],
  ["/hoc-nghe-mo-tai-quang-ninh/", 189],
]);
for (const item of data.items || []) {
  if (priorities.has(item.url)) item.priority = priorities.get(item.url);
}
fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/search-index.json",
  version: data.version,
  information_answers_precede_conversion_pages: true,
  conversion_page_priorities: Object.fromEntries(priorities),
}, null, 2));
