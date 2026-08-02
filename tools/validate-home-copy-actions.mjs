import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const homePath = path.resolve("tuyen-tho-mo", "index.html");
const scriptPath = path.resolve("tuyen-tho-mo", "worker-info-finder.js");
const home = fs.readFileSync(homePath, "utf8");
const script = fs.readFileSync(scriptPath, "utf8");
const errors = [];

for (const marker of [
  'data-worker-copy="admission_address"',
  'data-worker-copy="application_message"',
  'Sao chép địa chỉ nhập học',
  'Sao chép mẫu tin',
  '/worker-info-finder.js?v=3',
]) if (!home.includes(marker)) errors.push(`Trang chủ thiếu ${marker}`);

const copyButtons = (home.match(/data-worker-copy=/g) || []).length;
if (copyButtons !== 2) errors.push(`Trang chủ phải có đúng 2 nút sao chép, nhận ${copyButtons}`);
for (const key of ["admission_address", "application_message"]) {
  const buttonPattern = new RegExp(`<button[^>]+type="button"[^>]+data-worker-copy="${key}"|<button[^>]+data-worker-copy="${key}"[^>]+type="button"`);
  if (!buttonPattern.test(home)) errors.push(`Nút ${key} phải là button type=button`);
}

for (const marker of [
  "const COPY_VALUES = Object.freeze({",
  'admission_address: "Khu C – Phân hiệu Đào tạo Cẩm Phả, Trường Cao đẳng Than – Khoáng sản Việt Nam, phường Quang Hanh, tỉnh Quảng Ninh."',
  'application_message: [',
  '"Tôi muốn đăng ký học nghề mỏ."',
  'navigator.clipboard.writeText(value)',
  'document.execCommand("copy")',
  'document.querySelectorAll("[data-worker-copy]")',
  'track("worker_copy", { item: key, result: copied ? "success" : "failure" })',
  'button.textContent = copied ? "Đã sao chép ✓" : "Chưa sao chép được"',
]) if (!script.includes(marker)) errors.push(`worker-info-finder.js thiếu ${marker}`);

for (const forbidden of [
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "navigator.sendBeacon",
  "FormData",
  "XMLHttpRequest",
  "fetch(",
]) if (script.includes(forbidden)) errors.push(`Tính năng sao chép không được dùng ${forbidden}`);

if (/worker_copy[\s\S]{0,180}(?:value|text|address|message):/i.test(script)) {
  errors.push("Sự kiện sao chép không được gửi nội dung đã sao chép");
}

const scriptBytes = Buffer.byteLength(script);
if (scriptBytes > 8_000) errors.push(`worker-info-finder.js vượt 8 KB: ${scriptBytes}`);
try {
  new vm.Script(script, { filename: "worker-info-finder.js" });
} catch (error) {
  errors.push(`worker-info-finder.js lỗi cú pháp: ${error.message}`);
}

console.log(JSON.stringify({
  copy_buttons: copyButtons,
  admission_address_copy: home.includes('data-worker-copy="admission_address"'),
  application_message_copy: home.includes('data-worker-copy="application_message"'),
  clipboard_api: script.includes("navigator.clipboard.writeText(value)"),
  fallback_copy: script.includes('document.execCommand("copy")'),
  script_bytes: scriptBytes,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
