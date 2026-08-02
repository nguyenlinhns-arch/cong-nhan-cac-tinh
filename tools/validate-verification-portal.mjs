import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const slugs = [
  "chon-kcn-hay-lam-mo",
  "cau-chuyen-cong-nhan",
  "kiem-tra-dieu-kien",
  "ho-so-nhap-hoc",
  "thu-nhap-an-o-ho-tro",
  "an-toan-ky-luat-moi-truong",
];

function read(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) {
    errors.push(`Thiếu tệp ${file}`);
    return "";
  }
  return fs.readFileSync(target, "utf8");
}

const css = read("verification-portal.css");
const js = read("verification-portal.js");
const home = read("index.html");
const searchRaw = read("search-index.json");

try {
  new vm.Script(js, { filename: "verification-portal.js" });
} catch (error) {
  errors.push(`verification-portal.js lỗi cú pháp: ${error.message}`);
}

for (const marker of [
  'queueMeta("track", "ViewContent"',
  'zalo: "click_zalo"',
  'phone: "click_call"',
  'messenger: "click_messenger"',
  'trackExact("form_submit"',
  'trackExact("condition_pass"',
  'data-verification-action="condition"',
  'data-contact="zalo"',
  'data-contact="phone"',
  "requiredConditionFields",
  "formSubmitTracked",
]) if (!js.includes(marker)) errors.push(`JS thiếu marker ${marker}`);

for (const unsafe of ["health_screen: values", "age_range: values", "localStorage.setItem", "sessionStorage.setItem"]) {
  if (js.includes(unsafe)) errors.push(`JS có dấu hiệu lưu/gửi dữ liệu kiểm tra: ${unsafe}`);
}

if (Buffer.byteLength(js) > 18_000) errors.push(`verification-portal.js quá lớn: ${Buffer.byteLength(js)} bytes`);
if (Buffer.byteLength(css) > 16_000) errors.push(`verification-portal.css quá lớn: ${Buffer.byteLength(css)} bytes`);
if (!css.includes("grid-template-columns:repeat(3")) errors.push("CSS chưa khóa thanh mobile thành 3 nút");
if (!home.includes('id="cong-kiem-chung-nghe-mo"')) errors.push("Trang chủ thiếu cổng kiểm chứng nghề mỏ");
const mobileUx = read("mobile-ux.js");
for (const marker of ["function loadVerificationPortalAssets()", "/verification-portal.css?v=1", "/verification-portal.js?v=1"]) {
  if (!mobileUx.includes(marker)) errors.push(`mobile-ux.js thiếu ${marker}`);
}

const pageResults = [];
for (const slug of slugs) {
  const file = `${slug}/index.html`;
  const html = read(file);
  const result = {
    slug,
    canonical: html.includes(`https://thaylinhtuyenthomo.vn/${slug}/`),
    css: html.includes("/verification-portal.css?v=1"),
    js: html.includes("/verification-portal.js?v=1"),
    analytics: html.includes("/analytics.js?v=5"),
    mobile: html.includes("data-verification-mobile-contact"),
  };
  pageResults.push(result);
  for (const [key, value] of Object.entries(result)) {
    if (key !== "slug" && !value) errors.push(`${file} thiếu ${key}`);
  }
  for (const label of [">Zalo<", ">Gọi điện<", ">Kiểm tra<"]) {
    if (!html.includes(label)) errors.push(`${file} thiếu nút ${label}`);
  }
}

const conditionPage = read("kiem-tra-dieu-kien/index.html");
for (const marker of [
  "data-verification-condition-form",
  'name="age_range"',
  'name="height_range"',
  'name="weight_range"',
  'name="health_screen"',
  "không lưu câu trả lời",
]) if (!conditionPage.toLowerCase().includes(marker.toLowerCase())) errors.push(`Trang kiểm tra thiếu ${marker}`);

const comparisonPage = read("chon-kcn-hay-lam-mo/index.html");
for (const marker of ["khu công nghiệp", "20–25 triệu đồng/tháng khi hoàn thành định mức lao động", "khám tuyển là căn cứ cuối cùng"]) {
  if (!comparisonPage.toLowerCase().includes(marker.toLowerCase())) errors.push(`Trang so sánh thiếu ${marker}`);
}

let searchIndex = null;
try {
  searchIndex = JSON.parse(searchRaw);
} catch (error) {
  errors.push(`search-index.json lỗi JSON: ${error.message}`);
}
if (searchIndex) {
  if (searchIndex.version !== 3) errors.push(`Search index cần version 3, nhận ${searchIndex.version}`);
  for (const slug of slugs) {
    if (!searchIndex.items?.some(item => item.url === `/${slug}/`)) errors.push(`Search index thiếu /${slug}/`);
  }
}

const policyPath = path.resolve("docs", "EMPLOYMENT_ADS_POLICY.md");
if (!fs.existsSync(policyPath)) errors.push("Thiếu docs/EMPLOYMENT_ADS_POLICY.md");
else {
  const policy = fs.readFileSync(policyPath, "utf8");
  for (const marker of ["Employment/Special Ad Category", "ViewContent", "click_zalo", "condition_pass", "Không gửi tên, số điện thoại"]) {
    if (!policy.includes(marker)) errors.push(`Kỷ luật quảng cáo thiếu ${marker}`);
  }
}

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  pages: pageResults,
  js_bytes: Buffer.byteLength(js),
  css_bytes: Buffer.byteLength(css),
  errors,
}, null, 2));

if (errors.length) process.exit(1);
