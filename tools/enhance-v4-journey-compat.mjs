import "./enhance-v4-conversion.mjs";
import "./fix-kcn-income-context.mjs";
import fs from "node:fs";
import path from "node:path";

const fullInfoTarget = path.resolve("tuyen-tho-mo", "hoc-nghe-mo-tai-quang-ninh", "index.html");
if (!fs.existsSync(fullInfoTarget)) throw new Error("Missing V4 full-information page");
const fullInfoBefore = fs.readFileSync(fullInfoTarget, "utf8");
let fullInfoSource = fullInfoBefore;
if (!fullInfoSource.includes('/favicon-48x48.png')) {
  fullInfoSource = fullInfoSource.replace('<link rel="icon" href="/favicon.ico">', '<link rel="icon" href="/favicon.ico"><link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">');
}
if (!fullInfoSource.includes('name="twitter:card"')) {
  const twitter = '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Học nghề mỏ tại Quảng Ninh"><meta name="twitter:description" content="Điều kiện, nơi học, thời gian, ăn ở, hỗ trợ, hồ sơ và việc làm sau đào tạo nghề mỏ tại Quảng Ninh."><meta name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">';
  fullInfoSource = fullInfoSource.replace('<link rel="stylesheet" href="/landing-recruitment.css?v=17">', `${twitter}<link rel="stylesheet" href="/landing-recruitment.css?v=17">`);
}
if (!fullInfoSource.includes("/journey-optimizer.css?v=1")) fullInfoSource = fullInfoSource.replace("</head>", '<link rel="stylesheet" href="/journey-optimizer.css?v=1"></head>');
if (!fullInfoSource.includes("/journey-optimizer.js?v=1")) fullInfoSource = fullInfoSource.replace("</body>", '<script src="/journey-optimizer.js?v=1" defer></script></body>');
for (const marker of [
  '/favicon-48x48.png',
  'name="twitter:card" content="summary_large_image"',
  'name="twitter:title"',
  'name="twitter:description"',
  'name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp"',
  "/journey-optimizer.css?v=1",
  "/journey-optimizer.js?v=1",
  "/v4-conversion.js?v=1",
]) if (!fullInfoSource.includes(marker)) throw new Error(`V4 full-information page missing ${marker}`);
if (fullInfoSource !== fullInfoBefore) fs.writeFileSync(fullInfoTarget, fullInfoSource);

const conditionTarget = path.resolve("tuyen-tho-mo", "kiem-tra-dieu-kien", "index.html");
if (!fs.existsSync(conditionTarget)) throw new Error("Missing V4 condition page");
const conditionBefore = fs.readFileSync(conditionTarget, "utf8");
const conditionSource = conditionBefore.replace(
  "Kết quả trên website không thay thế khám tuyển và không phải cam kết tiếp nhận cuối cùng.",
  "Kết quả trên website là bước kiểm tra sơ bộ. Khám tuyển và đối chiếu hồ sơ là căn cứ xác nhận cuối cùng.",
);
if (/thu nhập tham khảo|thu nhập thực tế phụ thuộc|thu nhập tùy|không cam kết|không phải mức lương cứng|không phải cam kết|mức thu nhập cố định|không lấy trường hợp cao nhất làm mặt bằng chung/iu.test(conditionSource)) {
  throw new Error("V4 condition page still contains superseded salary or commitment disclaimer wording");
}
if (conditionSource !== conditionBefore) fs.writeFileSync(conditionTarget, conditionSource);

console.log(JSON.stringify({
  full_information_page: fullInfoSource === fullInfoBefore ? "already-compatible" : "enhanced",
  technical_metadata: "complete",
  condition_copy: conditionSource === conditionBefore ? "already-compliant" : "rewritten",
}, null, 2));