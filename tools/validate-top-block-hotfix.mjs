import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const cssPath = path.join(root, "site-shell-20260803.css");
const jsPath = path.join(root, "site-shell-20260803.js");
const legacyCssPath = path.join(root, "top-block-hotfix.css");
const errors = [];
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";
const js = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, "utf8") : "";
const legacyCss = fs.existsSync(legacyCssPath) ? fs.readFileSync(legacyCssPath, "utf8") : "";

for (const marker of [
  ".v4-primary-nav",
  ".tl-worker-compass",
  ".journey-short-nav",
  ".site-header .main-nav",
  "height:64px!important",
  ".mobile-contact,.tl-mobile-contact",
]) if (!css.includes(marker)) errors.push(`Site shell CSS thiếu ${marker}`);

for (const marker of [
  "removeRowsBetweenHeaderAndMain",
  "cleanArticleHero",
  "header.nextElementSibling",
  "node !== main",
  ".journey-short-nav",
  "document.documentElement.dataset.siteShell = \"20260803-v3\"",
]) if (!js.includes(marker)) errors.push(`Site shell JS thiếu ${marker}`);

for (const forbidden of [
  "[data-consent-banner]",
  "thaylinh_measurement_consent_v1",
  "window.thayLinhAnalytics?.consent?.(\"denied\")",
  "MutationObserver",
]) {
  if (css.includes(forbidden)) errors.push(`Site shell CSS không được chặn consent: ${forbidden}`);
  if (legacyCss.includes(forbidden)) errors.push(`Legacy hotfix CSS không được chặn consent: ${forbidden}`);
  if (js.includes(forbidden)) errors.push(`Site shell JS không được can thiệp consent/quét DOM: ${forbidden}`);
}

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
  if (relative.startsWith("nhap-hoc/")) continue;
  const html = fs.readFileSync(target, "utf8");
  if (relative === "index.html" || relative === "tuyen-tho-mo-quang-ninh/index.html" || html.includes("data-legacy-redirect") || /^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  checked += 1;
  if (html.includes('/site-shell-20260803.css?v=3')) withStyle += 1;
  else errors.push(`${relative} thiếu site shell CSS v3`);
  if (html.includes('/site-shell-20260803.js?v=3')) withScript += 1;
  else errors.push(`${relative} thiếu site shell JS v3`);
  if (html.includes('/top-block-hotfix.css')) oldHotfix += 1;
}

if (checked < 110) errors.push(`Site shell kiểm tra quá ít trang: ${checked}`);
if (withStyle !== checked) errors.push(`Chỉ ${withStyle}/${checked} trang có site shell CSS v3`);
if (withScript !== checked) errors.push(`Chỉ ${withScript}/${checked} trang có site shell JS v3`);
if (oldHotfix) errors.push(`Còn ${oldHotfix} trang dùng hotfix cũ`);

console.log(JSON.stringify({
  shell: "site-shell-20260803-v3",
  html_checked: checked,
  html_with_style: withStyle,
  html_with_script: withScript,
  old_hotfix_pages: oldHotfix,
  navigation_rows: "hidden-and-removed-at-runtime",
  errors,
}, null, 2));
if (errors.length) process.exit(1);
