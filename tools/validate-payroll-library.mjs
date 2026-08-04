import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const files = {
  hub: path.join(siteRoot, "bang-luong", "index.html"),
  detail: path.join(siteRoot, "bang-luong", "vang-danh", "quy-2-2026", "index.html"),
  imageOne: path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-bang-luong-01.webp"),
  imageTwo: path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-bang-luong-02.webp"),
  ogImage: path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-og.webp"),
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

const hub = fs.readFileSync(files.hub, "utf8");
const detail = fs.readFileSync(files.detail, "utf8");
const sitemap = fs.readFileSync(files.sitemap, "utf8");
const robots = fs.readFileSync(files.robots, "utf8");
const homeCssSource = fs.readFileSync(files.homeCssSource, "utf8");
const generator = fs.readFileSync(path.resolve("tools", "build-worker-first-home.mjs"), "utf8");
const payrolls = JSON.parse(fs.readFileSync(files.data, "utf8"));

const expectedHubMarkers = [
  "Bảng lương công nhân ngành Than theo công ty, theo quý",
  "https://thaylinhtuyenthomo.vn/bang-luong/",
  "Đã ẩn thông tin cá nhân",
  "vang-danh/quy-2-2026/",
];
for (const marker of expectedHubMarkers) {
  if (!hub.includes(marker)) throw new Error(`Trang kho bảng lương thiếu marker: ${marker}`);
}

const expectedDetailMarkers = [
  "Bảng lương thợ lò Than Vàng Danh quý II/2026",
  "https://thaylinhtuyenthomo.vn/bang-luong/vang-danh/quy-2-2026/",
  "https://drive.google.com/file/d/15J-vCKwY6TcZjVkd_18xIA90x5gJ3n7x/view?usp=drivesdk",
  "Không công khai mã nhân sự, họ tên, ngày sinh và nơi cư trú",
];
for (const marker of expectedDetailMarkers) {
  if (!detail.includes(marker)) throw new Error(`Trang bảng lương Vàng Danh thiếu marker: ${marker}`);
}

if (!Array.isArray(payrolls.items) || payrolls.items.length < 1) throw new Error("Dữ liệu kho bảng lương chưa có hồ sơ.");
if (payrolls.items[0].public_pdf !== "https://drive.google.com/file/d/15J-vCKwY6TcZjVkd_18xIA90x5gJ3n7x/view?usp=drivesdk") {
  throw new Error("Đường dẫn PDF chưa trỏ về đúng file Google Drive.");
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

console.log("Payroll library pages, Google Drive PDF link, discovery files and homepage entry validated.");
