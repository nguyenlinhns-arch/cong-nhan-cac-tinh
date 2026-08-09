import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const FONT_URL = "/fonts.css?v=2";
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

function dedupeStylesheet(html, href) {
  let seen = false;
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`\\s*<link\\s+rel=["']stylesheet["']\\s+href=["']${escaped}["']\\s*\\/?>`, "gi"), (tag) => {
    if (seen) return "";
    seen = true;
    return tag;
  });
}

function shortenDescription(html, max = 160) {
  return html.replace(/(<meta\s+name=["']description["']\s+content=["'])([^"']*)(["'])/i, (_match, open, content, close) => {
    if ([...content].length <= max) return `${open}${content}${close}`;
    const clipped = [...content].slice(0, max - 1).join("");
    const clean = clipped.replace(/\s+\S*$/u, "").replace(/[,:;\s]+$/u, "");
    return `${open}${clean}.${close}`;
  });
}

let changed = 0;
let viewportFixed = 0;
let assetsFixed = 0;
let fontLinksFixed = 0;
let duplicateMobileCssRemoved = 0;
let provinceDescriptionsShortened = 0;

// A second pass closes the small window where another build step has just
// materialized late province pages before validation starts.
for (let pass = 0; pass < 2; pass += 1) {
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
    .replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/?fonts\.css\?v=\d+["']\s*\/?>/gi, "")
    .replace(/\/?mobile-(?:ux|core)\.css\?v=\d+/g, CSS_URL)
    .replace(/\/?mobile-(?:ux|core)\.js\?v=\d+/g, JS_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)analytics\.js\?v=\d+/g, ANALYTICS_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)job-application\.js\?v=\d+/g, APPLICATION_URL)
    .replace(/\/worker-info-finder\.js\?v=\d+/g, FINDER_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)recruitment-config\.js\?v=\d+/g, RECRUITMENT_URL);
  if (next !== html) assetsFixed += 1;
  html = next;

  const mobileCountBefore = (html.match(/<link\s+rel=["']stylesheet["']\s+href=["']\/mobile-core\.css\?v=1["']/gi) || []).length;
  html = dedupeStylesheet(html, CSS_URL);
  if (mobileCountBefore > 1) duplicateMobileCssRemoved += mobileCountBefore - 1;

  const relative = path.relative(root, file).split(path.sep).join("/");
  if (relative === "viec-lam-nganh-than/can-tho/index.html" || relative === "viec-lam-nganh-than/vinh-long/index.html") {
    const old = html;
    html = shortenDescription(html, 160);
    if (html !== old) provinceDescriptionsShortened += 1;
  }

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${FONT_URL}">\n</head>`);
    if (!before.includes(FONT_URL) || before.lastIndexOf(FONT_URL) < before.lastIndexOf('rel="stylesheet"')) fontLinksFixed += 1;
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}
}

console.log(JSON.stringify({
  html_checked: collectHtml(root).length,
  html_changed: changed,
  viewport_fixed: viewportFixed,
  asset_versions_fixed: assetsFixed,
  font_links_fixed: fontLinksFixed,
  duplicate_mobile_css_removed: duplicateMobileCssRemoved,
  province_descriptions_shortened: provinceDescriptionsShortened,
  font_css: FONT_URL,
  mobile_css: CSS_URL,
  mobile_js: JS_URL,
  analytics_js: ANALYTICS_URL,
  application_js: APPLICATION_URL,
}, null, 2));
