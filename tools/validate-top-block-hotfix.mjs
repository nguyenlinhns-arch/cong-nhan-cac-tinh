import "./validate-v5-search-compat.mjs";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const cssPath = path.join(root, "top-block-hotfix.css");
const errors = [];
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";
for (const marker of [
  ".v5-intent-hub,.v5-return-prompt{display:none!important}",
  ".site-header .main-nav",
  ".site-header .menu-toggle",
  "height:60px!important",
  "main{margin-top:0!important",
]) if (!css.includes(marker)) errors.push(`Hotfix CSS thiếu ${marker}`);

let checked = 0;
let withHotfix = 0;
function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}
for (const target of walk(root)) {
  const relative = path.relative(root, target).replace(/\\/g, "/");
  const html = fs.readFileSync(target, "utf8");
  if (html.includes("data-legacy-redirect") || /^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  checked += 1;
  if (html.includes('/top-block-hotfix.css?v=1')) withHotfix += 1;
  else errors.push(`${relative} thiếu top-block hotfix`);
}
if (checked < 110) errors.push(`Hotfix kiểm tra quá ít trang: ${checked}`);
if (withHotfix !== checked) errors.push(`Chỉ ${withHotfix}/${checked} trang có hotfix`);

console.log(JSON.stringify({ hotfix: "top-block-clean", html_checked: checked, html_with_hotfix: withHotfix, errors }, null, 2));
if (errors.length) process.exit(1);
