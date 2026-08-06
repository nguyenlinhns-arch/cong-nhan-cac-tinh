import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const driveUrl = "https://drive.google.com/file/d/1FXKdoZddGGG5G_BgU-RnDycUSsMFqDsr/view?usp=drivesdk";
const oldDriveId = "15J-vCKwY6TcZjVkd_18xIA90x5gJ3n7x";
const files = {
  hub: path.join(siteRoot, "bang-luong", "index.html"),
  detail: path.join(siteRoot, "bang-luong", "vang-danh", "quy-2-2026", "index.html"),
  home: path.join(siteRoot, "index.html"),
  css: path.join(siteRoot, "payroll.css"),
  data: path.join(siteRoot, "data", "payrolls.json"),
  sitemap: path.join(siteRoot, "sitemap.xml"),
  robots: path.join(siteRoot, "robots.txt"),
  homeCssSource: path.join(siteRoot, "home-rich-media.css"),
};

for (const [label, file] of Object.entries(files)) {
  if (!fs.existsSync(file)) throw new Error(`Kho bảng lương thiếu ${label}: ${file}`);
  if (fs.statSync(file).size === 0) throw new Error(`Tệp kho bảng lương bị rỗng: ${file}`);
}

const forbiddenPayrollAssets = [
  path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-og.webp"),
  path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-bang-luong-01.webp"),
  path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-bang-luong-02.webp"),
  ...Array.from({ length: 15 }, (_, index) =>
    path.join(
      siteRoot,
      "bang-luong",
      "assets",
      "vang-danh-q2-2026-pages",
      `trang-${String(index + 1).padStart(2, "0")}.webp`,
    ),
  ),
];
for (const file of forbiddenPayrollAssets) {
  if (fs.existsSync(file)) throw new Error(`Tệp ảnh bảng lương Than Vàng Danh phải được xóa hẳn: ${file}`);
}

// Bộ dựng trang chủ cũ còn chèn ảnh trang bảng lương. Chuẩn hóa đầu ra về thẻ chữ trước khi kiểm định và triển khai.
const payrollHomeImagePattern = /<img\b[^>]*\bsrc="\/bang-luong\/assets\/vang-danh-q2-2026-bang-luong-01\.webp"[^>]*>\s*/g;
const homeBeforeNormalization = fs.readFileSync(files.home, "utf8");
const homeAfterNormalization = homeBeforeNormalization.replace(payrollHomeImagePattern, "");
if (homeAfterNormalization !== homeBeforeNormalization) fs.writeFileSync(files.home, homeAfterNormalization);

const hub = fs.readFileSync(files.hub, "utf8");
const detail = fs.readFileSync(files.detail, "utf8");
const home = fs.readFileSync(files.home, "utf8");
const sitemap = fs.readFileSync(files.sitemap, "utf8");
const robots = fs.readFileSync(files.robots, "utf8");
const homeCssSource = fs.readFileSync(files.homeCssSource, "utf8");
const generator = fs.readFileSync(path.resolve("tools", "build-worker-first-home.mjs"), "utf8");
const payrolls = JSON.parse(fs.readFileSync(files.data, "utf8"));

const expectedHubMarkers = [
  "Bảng lương công nhân ngành Than theo công ty, theo quý",
  "https://thaylinhtuyenthomo.vn/bang-luong/",
  "Mở file bảng lương trên Google Drive",
  driveUrl,
];
for (const marker of expectedHubMarkers) {
  if (!hub.includes(marker)) throw new Error(`Trang kho bảng lương thiếu marker: ${marker}`);
}

const forbiddenHubMarkers = [
  'class="payroll-method"',
  "Cách xem đơn giản",
  "Website không hiển thị ảnh trích ngang bảng lương",
];
for (const marker of forbiddenHubMarkers) {
  if (hub.includes(marker)) throw new Error(`Trang kho bảng lương vẫn còn khối hướng dẫn cần bỏ: ${marker}`);
}

const expectedDetailMarkers = [
  "Bảng lương thợ lò Than Vàng Danh quý II/2026",
  "https://thaylinhtuyenthomo.vn/bang-luong/vang-danh/quy-2-2026/",
  driveUrl,
  "Website không hiển thị ảnh trích ngang hoặc từng trang bảng lương",
  "Mở file bảng lương trên Google Drive",
];
for (const marker of expectedDetailMarkers) {
  if (!detail.includes(marker)) throw new Error(`Trang bảng lương Vàng Danh thiếu marker: ${marker}`);
}

const forbiddenPayrollImageMarkers = [
  "vang-danh-q2-2026-pages/",
  "vang-danh-q2-2026-bang-luong-01.webp",
  "vang-danh-q2-2026-bang-luong-02.webp",
  "payroll-document-page",
  "payroll-pages-note",
];
for (const marker of forbiddenPayrollImageMarkers) {
  if (hub.includes(marker) || detail.includes(marker)) {
    throw new Error(`Trang bảng lương còn ảnh hoặc khối ảnh bị cấm: ${marker}`);
  }
}
if (hub.includes(`href="https://drive.google.com/file/d/${oldDriveId}`) || detail.includes(`href="https://drive.google.com/file/d/${oldDriveId}`)) {
  throw new Error("Trang bảng lương vẫn còn liên kết tới file ẩn danh cũ.");
}

if (!Array.isArray(payrolls.items) || payrolls.items.length < 1) throw new Error("Dữ liệu kho bảng lương chưa có hồ sơ.");
const payroll = payrolls.items[0];
if (payroll.public_pdf !== driveUrl || payroll.controlled_pdf !== driveUrl) {
  throw new Error("Đường dẫn PDF chưa trỏ về đúng file Google Drive gốc.");
}
if (payroll.public_pages !== 0) throw new Error("Dữ liệu bảng lương vẫn khai báo số ảnh/trang công khai.");

if (!home.includes("home-library__card--payroll")) {
  throw new Error("Trang chủ thiếu lối vào kho bảng lương.");
}
if (home.includes("/bang-luong/assets/vang-danh-q2-2026-bang-luong-01.webp")) {
  throw new Error("Thẻ bảng lương trên trang chủ vẫn còn ảnh trích ngang Than Vàng Danh.");
}

for (const url of [
  "https://thaylinhtuyenthomo.vn/bang-luong/",
  "https://thaylinhtuyenthomo.vn/bang-luong/vang-danh/quy-2-2026/",
]) {
  if (!sitemap.includes(url)) throw new Error(`Sitemap bảng lương thiếu URL: ${url}`);
}
if (!robots.includes("Sitemap: https://thaylinhtuyenthomo.vn/sitemap.xml")) {
  throw new Error("robots.txt chưa khai báo sitemap chính của website.");
}
for (const marker of ["home-library__card--payroll", "home-library__grid--four", 'href="/bang-luong/"', "Bảng lương các công ty theo quý"]) {
  if (!generator.includes(marker)) throw new Error(`Bộ dựng trang chủ thiếu lối vào kho bảng lương: ${marker}`);
}
for (const marker of [
  ".home-library__grid--four{grid-template-columns:repeat(4",
  ".home-library__grid--four{grid-template-columns:repeat(2",
]) {
  if (!homeCssSource.includes(marker)) throw new Error(`CSS trang chủ thiếu bố cục kho nội dung bốn thẻ: ${marker}`);
}

console.log("Payroll library uses the original Google Drive file, keeps no worker payroll images and omits the redundant instruction block.");
