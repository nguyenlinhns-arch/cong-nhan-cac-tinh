import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const home = fs.readFileSync(path.resolve("tuyen-tho-mo", "index.html"), "utf8");
const script = fs.readFileSync(path.resolve("tuyen-tho-mo", "worker-info-finder.js"), "utf8");
const errors = [];

if (!home.includes('class="home-funnel"')) errors.push("Trang chủ thiếu luồng tư vấn đơn giản");
if (!home.includes('/worker-info-finder.js?v=3')) errors.push("Trang chủ thiếu script tự kiểm tra phiên bản 3");
if (home.includes("data-worker-copy=")) errors.push("Trang chủ đơn giản không được hiển thị nút sao chép phụ");
if (!home.includes('class="contact-choice-grid"')) errors.push("Trang chủ thiếu cụm lựa chọn liên hệ cuối hành trình");

const scriptBytes = Buffer.byteLength(script);
if (scriptBytes > 8_000) errors.push(`worker-info-finder.js vượt 8 KB: ${scriptBytes}`);
try { new vm.Script(script, { filename: "worker-info-finder.js" }); }
catch (error) { errors.push(`worker-info-finder.js lỗi cú pháp: ${error.message}`); }

console.log(JSON.stringify({
  copy_buttons: (home.match(/data-worker-copy=/g) || []).length,
  consultation_choices: (home.match(/class="contact-choice/g) || []).length,
  script_bytes: scriptBytes,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
