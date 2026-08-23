import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const errors = [];
const socialImage = `${base}/assets/thay-linh-avatar.webp`;
const targets = [
  ["phong-su/index.html", `${base}/phong-su/`],
  ["phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/index.html", `${base}/phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/`],
  ["phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/index.html", `${base}/phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/`],
];

function attributes(tag = "") {
  return Object.fromEntries([...String(tag).matchAll(/([^\s=/>]+)\s*=\s*(["'])(.*?)\2/gis)]
    .map((match) => [match[1].toLowerCase(), match[3]]));
}

function meta(html, kind, key) {
  for (const match of String(html).matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (attrs[kind] === key) return attrs.content || "";
  }
  return "";
}

function canonical(html) {
  for (const match of String(html).matchAll(/<link\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if ((attrs.rel || "").split(/\s+/).includes("canonical")) return attrs.href || "";
  }
  return "";
}

let socialReady = 0;
for (const [relative, expectedUrl] of targets) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    errors.push(`${relative}: thiếu trang`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const actualCanonical = canonical(html);
  const ogUrl = meta(html, "property", "og:url");
  const ogImage = meta(html, "property", "og:image");
  const twitterCard = meta(html, "name", "twitter:card");
  const twitterTitle = meta(html, "name", "twitter:title");
  const twitterDescription = meta(html, "name", "twitter:description");
  const twitterImage = meta(html, "name", "twitter:image");

  if (actualCanonical !== expectedUrl) errors.push(`${relative}: canonical ${actualCanonical || "missing"} phải là ${expectedUrl}`);
  if (ogUrl !== expectedUrl) errors.push(`${relative}: og:url ${ogUrl || "missing"} phải là ${expectedUrl}`);
  if (ogImage !== socialImage) errors.push(`${relative}: og:image chưa dùng ảnh nhận diện nguồn minh bạch`);
  if (twitterCard !== "summary_large_image") errors.push(`${relative}: twitter:card phải là summary_large_image`);
  if (!twitterTitle || !twitterDescription || twitterImage !== socialImage) errors.push(`${relative}: Twitter/X metadata chưa đầy đủ`);
  if (ogUrl === expectedUrl && ogImage === socialImage && twitterCard === "summary_large_image" && twitterTitle && twitterDescription && twitterImage === socialImage) socialReady += 1;
}

const authorityPages = [
  ["tac-gia/nguyen-tu-linh/index.html", [
    "<!-- field-report-authority-v8:start -->",
    "Ba loại nội dung được ghi nguồn theo ba cách khác nhau",
    "Phóng sự và ghi chép nguyên bản",
    "Bài biên tập từ nguồn bên ngoài",
    "Dữ kiện tuyển sinh hiện hành",
    "Không dựng lời nhân vật",
    "/phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/",
    "/phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/",
  ]],
  ["nguyen-tac-bien-tap/index.html", [
    "<!-- field-report-authority-v8:start -->",
    "PHÂN LOẠI NGUỒN TRƯỚC KHI VIẾT",
    "Tư liệu trực tiếp",
    "Nguồn báo chí, đơn vị và cơ quan nhà nước",
    "Nguồn tuyển sinh đang áp dụng",
    "QUY TẮC KHÔNG DỰNG LỜI",
    "Không dựng lời nhân vật",
    "/phong-su/",
  ]],
];

let authorityReady = 0;
for (const [relative, markers] of authorityPages) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    errors.push(`${relative}: thiếu trang minh bạch nguồn`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const missing = markers.filter((marker) => !html.includes(marker));
  if (missing.length) errors.push(`${relative}: thiếu ${missing.join(" | ")}`);
  else authorityReady += 1;
  if (!html.includes('href="/phong-su/">Phóng sự</a>')) errors.push(`${relative}: điều hướng chưa có chuyên mục Phóng sự`);
}

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  socialPages: targets.length,
  socialReady,
  authorityPages: authorityPages.length,
  authorityReady,
  noFabricatedQuotesPolicy: authorityReady === authorityPages.length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 30),
}, null, 2));

if (errors.length) process.exitCode = 1;
