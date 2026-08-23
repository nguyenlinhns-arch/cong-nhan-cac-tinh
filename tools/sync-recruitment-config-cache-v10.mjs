import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "tuyen-tho-mo");
const changed = [];

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(root).filter((file) => file.endsWith(".html") && !file.includes(`${path.sep}nhap-hoc${path.sep}`))) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replaceAll("/recruitment-config.js?v=3", "/recruitment-config.js?v=4");
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(path.relative(root, file).split(path.sep).join("/"));
}

console.log(JSON.stringify({
  status: "recruitment-config-cache-v10-ready",
  version: 4,
  changed,
}, null, 2));
