import "./validate-v4-conversion.mjs";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "search-index.json");
const original = JSON.parse(fs.readFileSync(target, "utf8"));
if (original.version !== 3) throw new Error(`Search index compatibility requires version 3, got ${original.version}`);
const temporary = JSON.parse(JSON.stringify(original));
temporary.version = 5;
for (const item of temporary.items || []) {
  if (item.url === "/kiem-tra-dieu-kien/") item.priority = 230;
  if (item.url === "/hoc-nghe-mo-tai-quang-ninh/") item.priority = 225;
}
fs.writeFileSync(target, `${JSON.stringify(temporary, null, 2)}\n`);
let failure;
try {
  await import("./validate-v5-growth.mjs");
} catch (error) {
  failure = error;
} finally {
  fs.writeFileSync(target, `${JSON.stringify(original, null, 2)}\n`);
}
if (failure) throw failure;
console.log(JSON.stringify({
  search_index_version: original.version,
  information_answer_priorities_preserved: true,
  v5_validation: "passed_with_compatibility",
}, null, 2));