import "./validate-verification-portal.mjs";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const warnings = [];

function read(relative) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) {
    errors.push(`Thiếu tệp ${relative}`);
    return "";
  }
  return fs.readFileSync(target, "utf8");
}

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

const journey = read("journey-optimizer.js");
const styles = read("journey-optimizer.css");
const analytics = read("analytics.js");
const application = read("job-application.js");
const privacy = read("quyen-rieng.html");

try {
  new vm.Script(journey, { filename: "journey-optimizer.js" });
} catch (error) {
  errors.push(`journey-optimizer.js lỗi cú pháp: ${error.message}`);
}

for (const marker of [
  'const STORAGE_KEY = "thaylinh_worker_journey_v3"',
  "30 * 24 * 60 * 60 * 1000",
  "function entryIntent()",
  "function crmContext()",
  "window.ThayLinhJourney = Object.freeze",
  'track("journey_view"',
  'track("journey_action"',
  'track("form_start"',
  'track("three_info_complete"',
  'item.event === "condition_pass"',
  "seconds_to_action",
  "journey_score_bucket",
  "journey-fast-facts",
  "journey-assurance",
  "journey-short-nav",
  "journey-inline-cta",
  "journey-form-progress",
  'typeof RadioNodeList !== "undefined"',
]) if (!journey.includes(marker)) errors.push(`Hành trình V3 thiếu ${marker}`);

for (const marker of [
  "state.full_name", "state.phone", "state.birth_date", "state.health", "state.height", "state.weight",
  "localStorage.setItem(STORAGE_KEY, JSON.stringify(values))",
  "sessionStorage.setItem",
]) if (journey.includes(marker)) errors.push(`Hành trình V3 có dấu hiệu lưu dữ liệu cá nhân: ${marker}`);

for (const marker of [
  ".journey-fast-facts", ".journey-assurance", ".journey-third-action", ".journey-short-nav",
  ".journey-inline-cta", ".journey-form-progress", ".journey-desktop-nudge",
]) if (!styles.includes(marker)) errors.push(`Giao diện hành trình thiếu ${marker}`);

for (const marker of [
  '"entry_intent"', '"entry_page"', '"journey_stage"', '"journey_score_bucket"',
  '"journey_score"', '"page_count"', '"seconds_to_action"', '"scroll_depth"',
  'item.event === "form_start"', 'window.gtag("event", "form_start"', 'window.fbq("trackCustom", "form_start"',
]) if (!analytics.includes(marker)) errors.push(`Analytics hành trình thiếu ${marker}`);

for (const marker of [
  "function readJourneyContext()", "const journey = readJourneyContext();",
  "Math.max(3, Number(recruitment.schemaVersion)",
  "journey.crm_context", "entry_page: journey.entry_page", "entry_intent: journey.entry_intent",
  "journey_pages: journey.journey_pages", "journey_page_count: journey.journey_page_count",
  "last_web_action: journey.last_web_action", "seconds_to_action: journey.seconds_to_action",
  "journey_score: journey.journey_score", "journey_score_bucket: journey.journey_score_bucket",
  "three_info_complete: journey.three_info_complete",
]) if (!application.includes(marker)) errors.push(`Biểu mẫu chưa giữ hành trình: ${marker}`);

for (const marker of [
  "Tóm tắt hành trình ẩn danh trên thiết bị",
  "tối đa 30 ngày",
  "không chứa họ tên, số điện thoại",
  "mã ngữ cảnh rút gọn cùng UTM",
]) if (!privacy.includes(marker)) errors.push(`Quyền riêng tư thiếu ${marker}`);

let htmlChecked = 0;
let htmlWithAssets = 0;
for (const file of walk(root)) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  if (/^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  const html = fs.readFileSync(file, "utf8");
  if (html.includes("data-legacy-redirect")) continue;
  htmlChecked += 1;
  const hasStyle = html.includes("/journey-optimizer.css?v=1");
  const hasScript = html.includes("/journey-optimizer.js?v=1");
  if (hasStyle && hasScript) htmlWithAssets += 1;
  else errors.push(`${relative}: thiếu lớp hành trình V3`);
}

const journeyBytes = Buffer.byteLength(journey);
const cssBytes = Buffer.byteLength(styles);
const analyticsBytes = Buffer.byteLength(analytics);
const applicationBytes = Buffer.byteLength(application);
if (journeyBytes > 30_000) errors.push(`journey-optimizer.js vượt 30 KB: ${journeyBytes}`);
if (cssBytes > 16_000) errors.push(`journey-optimizer.css vượt 16 KB: ${cssBytes}`);
if (analyticsBytes > 24_000) errors.push(`analytics.js vượt 24 KB sau tối ưu hành trình: ${analyticsBytes}`);
if (applicationBytes > 32_000) errors.push(`job-application.js vượt 32 KB: ${applicationBytes}`);
if (htmlChecked < 100) warnings.push(`Chỉ kiểm tra ${htmlChecked} trang HTML; cần xem lại nếu mạng nội dung đã thay đổi lớn`);

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  html_checked: htmlChecked,
  html_with_journey_assets: htmlWithAssets,
  journey_js_bytes: journeyBytes,
  journey_css_bytes: cssBytes,
  analytics_js_bytes: analyticsBytes,
  application_js_bytes: applicationBytes,
  errors,
  warnings,
}, null, 2));

if (errors.length) process.exit(1);
