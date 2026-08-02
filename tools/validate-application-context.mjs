import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const mobile = fs.readFileSync(path.join(root, "mobile-ux.js"), "utf8");
const application = fs.readFileSync(path.join(root, "job-application.js"), "utf8");
const provinceData = JSON.parse(fs.readFileSync(path.join(root, "data", "provinces-2026.json"), "utf8"));
const provinces = Array.isArray(provinceData.provinces) ? provinceData.provinces : [];
const errors = [];

for (const marker of [
  "function applicationContext()",
  'for (const key of ["province", "trade"])',
  "Object.entries(applicationContext())",
  'document.querySelectorAll?.(`a[href*="${path}"]`)',
]) if (!mobile.includes(marker)) errors.push(`mobile-ux.js thiếu ${marker}`);

const contextStart = mobile.indexOf("function applicationContext()");
const contextEnd = mobile.indexOf("function trackedApplicationUrl", contextStart);
const contextBlock = contextStart >= 0 && contextEnd > contextStart ? mobile.slice(contextStart, contextEnd) : "";
for (const forbidden of ["full_name", "phone", "birth_date", "height", "weight", "health", "consent"]) {
  if (contextBlock.includes(forbidden)) errors.push(`Ngữ cảnh ứng tuyển không được mang theo ${forbidden}`);
}

for (const marker of [
  "const prefilledContext = []",
  '[["province", "tỉnh/thành"], ["trade", "nghề"]]',
  'draftStatus.dataset.contextPrefilled = "true"',
  "Đã chọn sẵn ${prefilledContext.join(\" và \")}",
  'track("ApplicationContextPrefill", { action: "context_prefilled", context: formContext, fields: prefilledContext.length })',
]) if (!application.includes(marker)) errors.push(`job-application.js thiếu ${marker}`);

if (/ApplicationContextPrefill[\s\S]{0,180}(province|trade)\s*:/.test(application)) {
  errors.push("Đo lường xác nhận điền sẵn không được gửi tên tỉnh hoặc tên nghề");
}

let provinceLinks = 0;
for (const province of provinces) {
  const file = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");
  if (!fs.existsSync(file)) {
    errors.push(`Thiếu trang tỉnh ${province.slug}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const hrefs = [...html.matchAll(/href="([^"]*cong-nhan-mo-ham-lo-quang-ninh[^\"]*)"/g)].map((match) => match[1].replaceAll("&amp;", "&"));
  const matched = hrefs.some((href) => {
    try { return new URL(href, "https://thaylinhtuyenthomo.vn").searchParams.get("province") === province.name; }
    catch { return false; }
  });
  if (!matched) errors.push(`Trang ${province.slug} chưa truyền tỉnh ${province.name} sang biểu mẫu`);
  else provinceLinks += 1;
}

if (Buffer.byteLength(mobile) > 42_000) errors.push(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(mobile)}`);
if (Buffer.byteLength(application) > 32_000) errors.push(`job-application.js vượt 32 KB: ${Buffer.byteLength(application)}`);
try { new vm.Script(mobile, {filename: "mobile-ux.js"}); }
catch (error) { errors.push(`mobile-ux.js lỗi cú pháp: ${error.message}`); }
try { new vm.Script(application, {filename: "job-application.js"}); }
catch (error) { errors.push(`job-application.js lỗi cú pháp: ${error.message}`); }

console.log(JSON.stringify({
  provinces_checked: provinces.length,
  province_links_preserved: provinceLinks,
  preserved_fields: ["province", "trade"],
  sensitive_url_fields: 0,
  mobile_js_bytes: Buffer.byteLength(mobile),
  application_js_bytes: Buffer.byteLength(application),
  errors,
}, null, 2));

if (errors.length) process.exit(1);
