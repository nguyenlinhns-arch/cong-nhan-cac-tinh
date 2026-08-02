import "./validate-v4-conversion.mjs";
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

const condition = read("kiem-tra-dieu-kien/index.html");
const fullInfo = read("hoc-nghe-mo-tai-quang-ninh/index.html");
const runtime = read("v5-growth.js");
const styles = read("v5-growth.css");
const privacy = read("quyen-rieng.html");
const sitemap = read("sitemap.xml");
const searchRaw = read("search-index.json");

for (const marker of [
  "Kiểm tra điều kiện & đăng ký học nghề mỏ 2026",
  'data-v5-page="condition"',
  "data-v5-condition-schema",
  '"@type":"HowTo"',
  '"@type":"FAQPage"',
  "v5-condition-seo",
  "Hai bước để được tư vấn đúng trường hợp",
  "Chưa cần gửi giấy tờ",
  "/v5-growth.css?v=1",
  "/v5-growth.js?v=1",
]) if (!condition.includes(marker)) errors.push(`Trang kiểm tra điều kiện thiếu ${marker}`);

for (const marker of [
  "Học nghề mỏ tại Quảng Ninh 2026",
  'data-v5-page="full-information"',
  "v5-longtail-faq",
  "data-v5-question-schema",
  "Điều kiện, học phí, ăn ở, hồ sơ và thu nhập nghề mỏ",
  'id="do-tuoi"',
  'id="chieu-cao-can-nang"',
  'id="can-thi"',
  'id="khong-co-bang"',
  'id="hoc-bao-lau"',
  'id="hoc-phi-an-o"',
  'id="dia-diem-hoc"',
  'id="ho-so-nhap-hoc"',
  'id="noi-lam-viec"',
  'id="thu-nhap"',
]) if (!fullInfo.includes(marker)) errors.push(`Trang thông tin đầy đủ thiếu ${marker}`);

const faqCards = (fullInfo.match(/class="v5-faq-card"/g) || []).length;
if (faqCards !== 10) errors.push(`Trang thông tin đầy đủ phải có đúng 10 câu hỏi SEO, nhận ${faqCards}`);

for (const marker of [
  "setupProgressiveForm",
  "v5-wizard-progress",
  "v5-condition-field",
  "v5-contact-field",
  "eligibility_preview",
  "v5_step_complete",
  "v5_form_abandon",
  "cta_impression",
  "v5_cta_click",
  "v5_return_prompt",
  "v5_content_depth",
  "thaylinh_v5_journey",
  "JSON.stringify(allowed)",
]) if (!runtime.includes(marker)) errors.push(`v5-growth.js thiếu ${marker}`);

const trackingBlocks = [...runtime.matchAll(/track\([^;]+\);/gs)].map(match => match[0]).join("\n");
for (const forbidden of ["full_name", "phone:", "birth_date", "height:", "weight:", "health:"]) {
  if (trackingBlocks.includes(forbidden)) errors.push(`Theo dõi V5 không được chứa dữ liệu biểu mẫu ${forbidden}`);
}
const storageBlock = runtime.match(/function writeJourney\([\s\S]*?\n  \}/)?.[0] || "";
for (const forbidden of ["full_name", "phone", "birth_date", "height", "weight", "health"]) {
  if (storageBlock.includes(forbidden)) errors.push(`Bộ nhớ hành trình V5 không được lưu ${forbidden}`);
}
for (const allowed of ["stage", "last_path", "last_action", "eligibility", "submitted", "first_seen_at", "last_seen_at", "return_count"]) {
  if (!storageBlock.includes(allowed)) errors.push(`Bộ nhớ hành trình V5 thiếu trường an toàn ${allowed}`);
}
if (/window\.open\(|location\.href\s*=\s*ZALO_URL|location\.href\s*=\s*PHONE_URL/.test(runtime)) errors.push("V5 không được tự động mở Zalo hoặc gọi điện");

for (const marker of [
  ".v5-wizard-progress",
  '[data-v5-step="condition"] .v5-contact-field',
  '[data-v5-step="contact"] .v5-condition-field',
  ".v5-return-prompt",
  ".v5-intent-hub",
  ".v5-longtail-faq",
]) if (!styles.includes(marker)) errors.push(`v5-growth.css thiếu ${marker}`);

if (!privacy.includes("Đo lường hành trình V5") || !privacy.includes("không chứa dữ liệu cá nhân trong biểu mẫu")) errors.push("Trang quyền riêng tư chưa mô tả V5");

try {
  const search = JSON.parse(searchRaw);
  if (Number(search.version) < 5) errors.push("Search index chưa nâng phiên bản V5");
  const conditionItem = search.items?.find(item => item.url === "/kiem-tra-dieu-kien/");
  const fullInfoItem = search.items?.find(item => item.url === "/hoc-nghe-mo-tai-quang-ninh/");
  if (!conditionItem || Number(conditionItem.priority) < 230 || !conditionItem.keywords?.includes("đăng ký học nghề mỏ")) errors.push("Search index chưa ưu tiên trang kiểm tra điều kiện V5");
  if (!fullInfoItem || Number(fullInfoItem.priority) < 225 || !fullInfoItem.keywords?.includes("học nghề mỏ tại Quảng Ninh")) errors.push("Search index chưa ưu tiên trang thông tin đầy đủ V5");
} catch (error) {
  errors.push(`search-index.json không hợp lệ: ${error.message}`);
}

for (const url of [
  "https://thaylinhtuyenthomo.vn/kiem-tra-dieu-kien/",
  "https://thaylinhtuyenthomo.vn/hoc-nghe-mo-tai-quang-ninh/",
]) {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = sitemap.match(new RegExp(`<loc>${escaped}<\\/loc>\\s*<lastmod>([^<]+)`, "i"));
  if (!match || match[1] !== "2026-08-02") errors.push(`Sitemap V5 chưa cập nhật ${url}`);
}

let htmlChecked = 0;
let htmlWithAssets = 0;
let intentHubs = 0;
for (const target of walk(root)) {
  const relative = path.relative(root, target).split(path.sep).join("/");
  if (/^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  const html = fs.readFileSync(target, "utf8");
  if (html.includes("data-legacy-redirect")) continue;
  htmlChecked += 1;
  if (html.includes('/v5-growth.css?v=1') && html.includes('/v5-growth.js?v=1') && html.includes('data-growth-version="v5"')) htmlWithAssets += 1;
  else errors.push(`${relative} chưa được gắn đầy đủ V5`);
  if (html.includes("data-v5-intent-hub")) intentHubs += 1;
}
if (htmlChecked < 110) errors.push(`Số trang V5 kiểm tra quá thấp: ${htmlChecked}`);
if (htmlWithAssets !== htmlChecked) errors.push(`Chỉ ${htmlWithAssets}/${htmlChecked} trang có V5 đầy đủ`);
if (intentHubs < 100) warnings.push(`Chỉ có ${intentHubs} trang có cụm liên kết ý định tìm kiếm`);

try { new vm.Script(runtime, { filename: "v5-growth.js" }); }
catch (error) { errors.push(`v5-growth.js lỗi cú pháp: ${error.message}`); }

const jsBytes = Buffer.byteLength(runtime);
const cssBytes = Buffer.byteLength(styles);
if (jsBytes > 24_000) errors.push(`v5-growth.js vượt 24 KB: ${jsBytes}`);
if (cssBytes > 14_000) errors.push(`v5-growth.css vượt 14 KB: ${cssBytes}`);

console.log(JSON.stringify({
  growth_version: "v5",
  html_checked: htmlChecked,
  html_with_v5: htmlWithAssets,
  intent_hubs: intentHubs,
  faq_questions: faqCards,
  progressive_form: runtime.includes("setupProgressiveForm"),
  return_prompt: runtime.includes("showReturnPrompt"),
  cta_impressions: runtime.includes("cta_impression"),
  js_bytes: jsBytes,
  css_bytes: cssBytes,
  errors,
  warnings,
}, null, 2));

if (errors.length) process.exit(1);
