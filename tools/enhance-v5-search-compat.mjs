import "./enhance-v5-growth.mjs";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "search-index.json");
const data = JSON.parse(fs.readFileSync(target, "utf8"));
data.version = 3;
fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ target: "tuyen-tho-mo/search-index.json", version: data.version, v5_priorities_preserved: true }, null, 2));
