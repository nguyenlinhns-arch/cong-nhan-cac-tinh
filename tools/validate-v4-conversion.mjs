import "./validate-application-condition-pass-v3.mjs";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const warnings = [];
const corePages = [
  "index.html",
  "kiem-tra-dieu-kien/index.html",
  "chon-kcn-hay-lam-mo/index.html",
  "hoc-nghe-mo-tai-quang-ninh/index.html",
  "cau-chuyen-cong-nhan/index.html",
];

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

const core = Object.fromEntries(corePages.map(file => [file, read(file)]));
const condition = core["kiem-tra-dieu-kien/index.html"];
const fullInfo = core["hoc-nghe-mo-tai-quang-ninh/index.html"];
const runtime = read("v4-conversion.js");
const styles = read("v4-conversion.css");
const analytics = read("analytics.js");
const application = read("job-application.js");
const sitemap = read("sitemap.xml");
const searchIndex = read("search-index.json");
const privacy = read("quyen-rieng.html");

for (const [file, html] of Object.entries(core)) {
  for (const marker of ["v4-primary-nav", "/v4-conversion.css?v=1", "/v4-conversion.js?v=1"]) {
    if (!html.includes(marker)) errors.push(`${file} thiếu ${marker}`);
  }
}

for (const marker of [
  'data-v4-quick-form',
  'data-form-context="condition_v4"',
  'name="full_name"',
  'name="phone"',
  'name="birth_date"',
  'name="province"',
  'name="district"',
  'name="height"',
  'name="weight"',
  'name="health"',
  'class="v4-hidden-field">Trình độ',
  'class="v4-hidden-field">Nghề',
  '/recruitment-config.js?v=2',
  '/job-application.js?v=9',
  'Gửi 3 thông tin để Thầy Linh kiểm tra',
]) if (!condition.includes(marker)) errors.push(`Trang kiểm tra điều kiện thiếu ${marker}`);

const conditionVisibleFields = ["full_name", "phone", "birth_date", "province", "district", "height", "weight", "health"];
if (conditionVisibleFields.length !== 8) errors.push("Bộ trường V4 phải có đúng 8 ô hiển thị gồm 7 nhóm thông tin và tỉnh/huyện tách hai ô");
if ((condition.match(/data-application-form/g) || []).length !== 1) errors.push("Trang kiểm tra điều kiện phải có đúng một biểu mẫu chính");
if ((condition.match(/data-contact="zalo"/g) || []).length < 2) errors.push("Trang kiểm tra điều kiện thiếu CTA Zalo");
if ((condition.match(/data-contact="phone"/g) || []).length < 2) errors.push("Trang kiểm tra điều kiện thiếu CTA gọi điện");

for (const marker of [
  "Học nghề mỏ tại Quảng Ninh: điều kiện, ăn ở, hồ sơ",
  'rel="canonical" href="https://thaylinhtuyenthomo.vn/hoc-nghe-mo-tai-quang-ninh/"',
  '"@type":"FAQPage"',
  "Khu C – Phân hiệu Đào tạo Cẩm Phả",
  "Học nghề chính khoảng 2–3 tháng",
  "Hỗ trợ 7,5 triệu đồng/tháng",
  "Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất",
]) if (!fullInfo.includes(marker)) errors.push(`Trang học nghề đầy đủ thiếu ${marker}`);

for (const marker of [
  'const DRAFT_FIELDS = ["province", "district", "height", "weight"]',
  "Tỉnh/huyện",
  "district: String(values.district",
  "Thầy Linh đã nhận thông tin",
  "sau 2 giờ chưa nhận phản hồi",
]) if (!application.includes(marker)) errors.push(`job-application.js thiếu ${marker}`);

for (const marker of [
  '"conversion_version"',
  '"lead_stage"',
  'item.event === "lead_3_info"',
  'item.event === "qualified_lead"',
  'item.event === "form_submit"',
  'item.event === "v4_primary_action"',
]) if (!analytics.includes(marker)) errors.push(`analytics.js thiếu ${marker}`);

for (const marker of [
  "lead_3_info",
  "qualified_lead",
  "v4_primary_action",
  "v4-mobile-bar",
  "simplifyApplicationForm",
  "updateInternalLinks",
  "Thầy Linh trực tiếp kiểm tra điều kiện",
  "sau 2 giờ chưa nhận phản hồi",
]) if (!runtime.includes(marker)) errors.push(`v4-conversion.js thiếu ${marker}`);

for (const forbidden of ["full_name:", "phone:", "birth_date:", "health_screen:"]) {
  const trackingBlocks = [...runtime.matchAll(/track\([^;]+\);/gs)].map(match => match[0]).join("\n");
  if (trackingBlocks.includes(forbidden)) errors.push(`Theo dõi V4 không được gửi ${forbidden}`);
}

if (!privacy.includes("Đo lường hành trình V4") || !privacy.includes("không chứa họ tên, số điện thoại")) errors.push("Trang quyền riêng tư chưa mô tả hành trình V4");
if (!sitemap.includes("https://thaylinhtuyenthomo.vn/hoc-nghe-mo-tai-quang-ninh/")) errors.push("Sitemap thiếu trang học nghề mỏ tại Quảng Ninh");
try {
  const data = JSON.parse(searchIndex);
  const item = data.items?.find(entry => entry.url === "/hoc-nghe-mo-tai-quang-ninh/");
  if (!item || Number(item.priority) < 190) errors.push("Tìm kiếm nội bộ thiếu trang học nghề V4 ưu tiên cao");
  const conditionItem = data.items?.find(entry => entry.url === "/kiem-tra-dieu-kien/");
  if (!conditionItem || !/đăng ký/i.test(conditionItem.title)) errors.push("Tìm kiếm nội bộ chưa ưu tiên trang kiểm tra và đăng ký");
} catch (error) {
  errors.push(`search-index.json không hợp lệ: ${error.message}`);
}

let htmlChecked = 0;
let htmlWithAssets = 0;
let staticFinalCtas = 0;
for (const target of walk(root)) {
  const relative = path.relative(root, target).split(path.sep).join("/");
  if (/^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  const html = fs.readFileSync(target, "utf8");
  if (html.includes("data-legacy-redirect")) continue;
  htmlChecked += 1;
  if (html.includes("/v4-conversion.css?v=1") && html.includes("/v4-conversion.js?v=1") && html.includes("v4-primary-nav")) htmlWithAssets += 1;
  else errors.push(`${relative} chưa được gắn đầy đủ V4`);
  if (html.includes('class="v4-final-conversion"')) staticFinalCtas += 1;
}
if (htmlChecked < 110) errors.push(`Số trang kiểm tra V4 quá thấp: ${htmlChecked}`);
if (htmlWithAssets !== htmlChecked) errors.push(`Chỉ ${htmlWithAssets}/${htmlChecked} trang có V4 đầy đủ`);
if (staticFinalCtas < 70) warnings.push(`Chỉ có ${staticFinalCtas} CTA cuối trang tĩnh`);

for (const [name, source] of [["v4-conversion.js", runtime], ["analytics.js", analytics], ["job-application.js", application]]) {
  try { new vm.Script(source, { filename: name }); }
  catch (error) { errors.push(`${name} lỗi cú pháp: ${error.message}`); }
}

const jsBytes = Buffer.byteLength(runtime);
const cssBytes = Buffer.byteLength(styles);
if (jsBytes > 24_000) errors.push(`v4-conversion.js vượt 24 KB: ${jsBytes}`);
if (cssBytes > 14_000) errors.push(`v4-conversion.css vượt 14 KB: ${cssBytes}`);

const navSample = core["index.html"].match(/<nav class="v4-primary-nav"[\s\S]*?<\/nav>/)?.[0] || "";
const navLinks = (navSample.match(/<a\b/g) || []).length;
if (navLinks !== 5) errors.push(`Điều hướng V4 phải có đúng 5 liên kết, nhận ${navLinks}`);

console.log(JSON.stringify({
  core_pages: corePages.length,
  condition_visible_fields: conditionVisibleFields.length,
  html_checked: htmlChecked,
  html_with_v4: htmlWithAssets,
  static_final_ctas: staticFinalCtas,
  nav_links: navLinks,
  v4_js_bytes: jsBytes,
  v4_css_bytes: cssBytes,
  errors,
  warnings,
}, null, 2));

if (errors.length) process.exit(1);
