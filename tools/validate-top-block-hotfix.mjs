import "./validate-v5-search-compat.mjs";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const cssPath = path.join(root, "site-shell-20260803.css");
const jsPath = path.join(root, "site-shell-20260803.js");
const errors = [];
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";
const js = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, "utf8") : "";

for (const marker of [
  "[data-consent-banner]",
  ".v4-primary-nav",
  ".tl-worker-compass",
  ".site-header .main-nav",
  "height:64px!important",
  ".mobile-contact,.tl-mobile-contact",
]) if (!css.includes(marker)) errors.push(`Site shell CSS thiếu ${marker}`);

for (const marker of [
  "removeRowsBetweenHeaderAndMain",
  "header.nextElementSibling",
  "node !== main",
  "window.thayLinhAnalytics?.consent?.(\"denied\")",
  "MutationObserver",
  "document.documentElement.dataset.siteShell = \"20260803\"",
]) if (!js.includes(marker)) errors.push(`Site shell JS thiếu ${marker}`);

let checked = 0;
let withStyle = 0;
let withScript = 0;
let oldHotfix = 0;

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
  if (html.includes('/site-shell-20260803.css?v=1')) withStyle += 1;
  else errors.push(`${relative} thiếu site shell CSS`);
  if (html.includes('/site-shell-20260803.js?v=1')) withScript += 1;
  else errors.push(`${relative} thiếu site shell JS`);
  if (html.includes('/top-block-hotfix.css')) oldHotfix += 1;
}

if (checked < 110) errors.push(`Site shell kiểm tra quá ít trang: ${checked}`);
if (withStyle !== checked) errors.push(`Chỉ ${withStyle}/${checked} trang có site shell CSS`);
if (withScript !== checked) errors.push(`Chỉ ${withScript}/${checked} trang có site shell JS`);
if (oldHotfix) errors.push(`Còn ${oldHotfix} trang dùng hotfix cũ`);

console.log(JSON.stringify({
  shell: "site-shell-20260803",
  html_checked: checked,
  html_with_style: withStyle,
  html_with_script: withScript,
  old_hotfix_pages: oldHotfix,
  navigation_rows: "hidden-and-removed-at-runtime",
  errors,
}, null, 2));
if (errors.length) process.exit(1);
