import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const CSS_URL = "/mobile-core.css?v=1";
const JS_URL = "/mobile-core.js?v=1";
const ANALYTICS_URL = "/analytics.js?v=6";
const APPLICATION_URL = "/job-application.js?v=10";
const FINDER_URL = "/worker-info-finder.js?v=4";
const RECRUITMENT_URL = "/recruitment-config.js?v=3";

function collectHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(full, output);
    else if (entry.name.endsWith(".html") && !/^google[a-z0-9_-]+\.html$/i.test(entry.name)) output.push(full);
  }
  return output;
}

let changed = 0;
let viewportFixed = 0;
let assetsFixed = 0;

for (const file of collectHtml(root)) {
  const before = fs.readFileSync(file, "utf8");
  let html = before;

  html = html.replace(/(<meta\s+name=["']viewport["']\s+content=["'])([^"']*)(["'])/i, (_match, open, content, close) => {
    const values = content.split(",").map((value) => value.trim()).filter(Boolean);
    if (!values.includes("width=device-width")) values.unshift("width=device-width");
    if (!values.includes("initial-scale=1")) values.push("initial-scale=1");
    if (!values.includes("viewport-fit=cover")) {
      values.push("viewport-fit=cover");
      viewportFixed += 1;
    }
    return `${open}${values.join(",")}${close}`;
  });

  const next = html
    .replace(/\/?mobile-(?:ux|core)\.css\?v=\d+/g, CSS_URL)
    .replace(/\/?mobile-(?:ux|core)\.js\?v=\d+/g, JS_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)analytics\.js\?v=\d+/g, ANALYTICS_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)job-application\.js\?v=\d+/g, APPLICATION_URL)
    .replace(/\/worker-info-finder\.js\?v=\d+/g, FINDER_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)recruitment-config\.js\?v=\d+/g, RECRUITMENT_URL);
  if (next !== html) assetsFixed += 1;
  html = next;

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(JSON.stringify({
  html_checked: collectHtml(root).length,
  html_changed: changed,
  viewport_fixed: viewportFixed,
  asset_versions_fixed: assetsFixed,
  mobile_css: CSS_URL,
  mobile_js: JS_URL,
  analytics_js: ANALYTICS_URL,
  application_js: APPLICATION_URL,
}, null, 2));
