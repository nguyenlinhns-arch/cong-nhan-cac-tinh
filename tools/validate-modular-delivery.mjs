import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const bytes = (name) => fs.statSync(path.join(root, name)).size;
const requireText = (text, marker, label) => { if (!text.includes(marker)) errors.push(`${label}: thiếu ${marker}`); };
const requireBudget = (name, limit) => { if (bytes(name) > limit) errors.push(`${name}: ${bytes(name)} byte vượt ${limit}`); };

const budgets = {
  "mobile-core.js": 30_000,
  "mobile-core.css": 12_000,
  "analytics.js": 15_000,
  "analytics-vendors.js": 12_000,
  "site-search.js": 26_000,
  "worker-brief.js": 8_000,
  "voice-assist.js": 15_000,
  "search-core.json": 40_000,
  "search-provinces.json": 60_000,
  "search-content.json": 160_000,
};
for (const [name, limit] of Object.entries(budgets)) requireBudget(name, limit);
for (const name of ["mobile-core.js", "site-search.js", "worker-brief.js", "voice-assist.js", "analytics.js", "analytics-vendors.js", "consent-analytics.js", "job-application.js", "worker-info-finder.js"]) {
  try { new vm.Script(read(name), {filename: name}); } catch (error) { errors.push(`${name}: lỗi cú pháp ${error.message}`); }
}

const core = read("mobile-core.js");
const search = read("site-search.js");
const brief = read("worker-brief.js");
const analytics = read("analytics.js");
const vendors = read("analytics-vendors.js");
const application = read("job-application.js");
const finder = read("worker-info-finder.js");
const landingCss = read("landing-recruitment.css");
const finderCss = read("worker-info-finder.css");
const richMediaCss = read("home-rich-media.css");
for (const marker of ["/site-search.js?v=1", "/worker-brief.js?v=1", "/voice-assist.js?v=3", "data-open-site-search", "data-open-worker-brief", "tl-mobile-contact__messenger"]) requireText(core, marker, "mobile-core.js");
for (const marker of ["search-core.json?v=1", "search-provinces.json?v=1", "search-content.json?v=1", "loadTier(\"content\")", "mobile.activateVoice"]) requireText(search, marker, "site-search.js");
for (const marker of ["mobile.activateVoice", "data-worker-brief-action=\"phone\"", "data-contact=\"application\""]) requireText(brief, marker, "worker-brief.js");
for (const marker of ["analytics-vendors.js?v=1", "consent-analytics.js?v=1", "measurementId", "captureFirstAttribution", "contact_click"]) requireText(analytics, marker, "analytics.js");
for (const marker of ["gtagEvent(`click_${channel}`", '"zalo", "messenger", "phone", "application"', "condition_check_start", "condition_check_complete", "generate_lead", "WebVital"]) requireText(vendors, marker, "analytics-vendors.js");
for (const marker of ["internal_campaign", "measurement_client_id", "lead_key: applicationCode", "schema_version: Number(recruitment.schemaVersion) || 2"]) requireText(application, marker, "job-application.js");
for (const marker of ["condition_check_start", "condition_check_complete", "condition_pass"]) requireText(finder, marker, "worker-info-finder.js");
for (const marker of ["--zalo:#0565b6", ".header-cta"]) requireText(landingCss, marker, "landing-recruitment.css");
requireText(finderCss, "background:#f18724;color:#102a30", "worker-info-finder.css");
for (const marker of ["button-zalo{background:#f18724;color:#102a30", "color:#b54708"]) requireText(richMediaCss, marker, "home-rich-media.css");

const manifest = JSON.parse(read("search-index.json"));
const coreIndex = JSON.parse(read("search-core.json"));
const provinceIndex = JSON.parse(read("search-provinces.json"));
const contentIndex = JSON.parse(read("search-content.json"));
if (manifest.version !== 4 || manifest.strategy !== "answer-first-tiered") errors.push("search-index.json: manifest phân tầng không hợp lệ");
if (coreIndex.items.length < 20) errors.push("search-core.json: thiếu câu trả lời trực tiếp");
if (provinceIndex.items.filter((item) => item.category === "province").length !== 26) errors.push("search-provinces.json: chưa đủ 26 tỉnh/thành");
if (contentIndex.items.length < 60) errors.push("search-content.json: thiếu kho bài chuyên sâu");

const fontCss = read("fonts.css");
const weights = [...fontCss.matchAll(/font-weight:\s*(\d+)/g)].map((match) => Number(match[1]));
for (const weight of weights) if (![400, 700, 800].includes(weight)) errors.push(`fonts.css: còn độ đậm ${weight}`);
const fontFiles = fs.readdirSync(path.join(root, "assets", "fonts")).filter((name) => name.endsWith(".woff2"));
if (fontFiles.length !== 6) errors.push(`Font: cần đúng 6 tệp WOFF2, hiện có ${fontFiles.length}`);

const home = read("index.html");
for (const marker of ["/home-critical.css?v=1", "/home-content.css?v=2", "/mobile-core.js?v=1", ">Kiểm tra điều kiện</a>", "button button-brief"]) requireText(home, marker, "Trang chủ");
for (const oldAsset of ["/landing-recruitment.css", "/publication-polish.css", "/mobile-ux.css", "/mobile-ux.js", "/site-shell-20260803.css"]) {
  if (home.includes(oldAsset)) errors.push(`Trang chủ: còn tải lớp CSS/JS riêng ${oldAsset}`);
}

let htmlCount = 0;
let modularPages = 0;
function walk(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith(".html")) {
      htmlCount += 1;
      const html = fs.readFileSync(target, "utf8");
      if (html.includes("data-legacy-redirect") || /^google[a-z0-9_-]+\.html$/i.test(entry.name)) continue;
      if (html.includes('/mobile-core.js?v=1')) modularPages += 1;
      if (html.includes("/mobile-ux.js") || html.includes("/mobile-ux.css")) errors.push(`${path.relative(root, target)}: còn tài nguyên mobile cũ`);
      if (html.includes("/voice-assist.js")) errors.push(`${path.relative(root, target)}: voice-assist không được tải trực tiếp`);
    }
  }
}
walk(root);
if (modularPages < 110) errors.push(`Chỉ ${modularPages} trang dùng mobile-core`);

console.log(JSON.stringify({
  html: htmlCount,
  modularPages,
  budgets: Object.fromEntries(Object.keys(budgets).map((name) => [name, bytes(name)])),
  searchItems: {core: coreIndex.items.length, provinces: provinceIndex.items.length, content: contentIndex.items.length},
  fontFiles: fontFiles.length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 25),
}, null, 2));
if (errors.length) process.exitCode = 1;
