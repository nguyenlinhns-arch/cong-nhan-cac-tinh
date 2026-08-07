import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const baseUrl = "https://thaylinhtuyenthomo.vn";
const oldDriveId = "15J-vCKwY6TcZjVkd_18xIA90x5gJ3n7x";
const files = {
  hub: path.join(siteRoot, "bang-luong", "index.html"),
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

const payrolls = JSON.parse(fs.readFileSync(files.data, "utf8"));
if (payrolls.version !== "2.0") throw new Error(`Dữ liệu kho bảng lương phải dùng phiên bản 2.0, hiện là ${payrolls.version}`);
if (!Array.isArray(payrolls.items) || payrolls.items.length !== 8) {
  throw new Error(`Kho bảng lương phải có đúng 8 bộ dữ liệu đã xác minh, hiện có ${payrolls.items?.length || 0}`);
}
if (!Array.isArray(payrolls.pending_sources) || payrolls.pending_sources.length !== 1) {
  throw new Error("Kho bảng lương phải ghi nhận đúng một nguồn đang chờ tài liệu.");
}
const pendingKheCham = payrolls.pending_sources[0];
if (pendingKheCham.company !== "Công ty Than Khe Chàm - TKV" || pendingKheCham.status !== "empty_folder") {
  throw new Error("Nguồn Khe Chàm phải được giữ ở trạng thái chờ vì thư mục Google Drive đang trống.");
}

const forbiddenPayrollAssets = [
  path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-og.webp"),
  path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-bang-luong-01.webp"),
  path.join(siteRoot, "bang-luong", "assets", "vang-danh-q2-2026-bang-luong-02.webp"),
  ...Array.from({length: 15}, (_, index) => path.join(
    siteRoot,
    "bang-luong",
    "assets",
    "vang-danh-q2-2026-pages",
    `trang-${String(index + 1).padStart(2, "0")}.webp`,
  )),
];
for (const file of forbiddenPayrollAssets) {
  if (fs.existsSync(file)) throw new Error(`Tệp ảnh bảng lương phải được xóa hẳn: ${file}`);
}

const payrollHomeImagePattern = /<img\b[^>]*\bsrc="\/bang-luong\/assets\/vang-danh-q2-2026-bang-luong-01\.webp"[^>]*>\s*/g;
const homeBeforeNormalization = fs.readFileSync(files.home, "utf8");
const homeAfterNormalization = homeBeforeNormalization.replace(payrollHomeImagePattern, "");
if (homeAfterNormalization !== homeBeforeNormalization) fs.writeFileSync(files.home, homeAfterNormalization);

const hub = fs.readFileSync(files.hub, "utf8");
const home = fs.readFileSync(files.home, "utf8");
const sitemap = fs.readFileSync(files.sitemap, "utf8");
const robots = fs.readFileSync(files.robots, "utf8");
const homeCssSource = fs.readFileSync(files.homeCssSource, "utf8");
const generator = fs.readFileSync(path.resolve("tools", "build-worker-first-home.mjs"), "utf8");

const expectedHubMarkers = [
  "Bảng lương công nhân ngành Than theo công ty, theo kỳ",
  `${baseUrl}/bang-luong/`,
  "8 bộ dữ liệu",
  "6 doanh nghiệp",
  "Google Drive",
  "/bang-luong/ha-lam/quy-2-2026/",
];
for (const marker of expectedHubMarkers) {
  if (!hub.includes(marker)) throw new Error(`Trang kho bảng lương thiếu marker: ${marker}`);
}

for (const marker of [
  'class="payroll-method"',
  "Cách xem đơn giản",
  "Website không hiển thị ảnh trích ngang bảng lương",
  "Công ty Than Khe Chàm - TKV",
]) {
  if (hub.includes(marker)) throw new Error(`Trang kho bảng lương còn nội dung không được xuất bản: ${marker}`);
}

const detailPages = [];
const seenIds = new Set();
const seenUrls = new Set();
for (const item of payrolls.items) {
  if (!item.id || seenIds.has(item.id)) throw new Error(`Mã bộ dữ liệu bảng lương bị thiếu hoặc trùng: ${item.id}`);
  if (!item.url || seenUrls.has(item.url)) throw new Error(`URL bộ dữ liệu bảng lương bị thiếu hoặc trùng: ${item.url}`);
  seenIds.add(item.id);
  seenUrls.add(item.url);

  if (!item.url.startsWith(`${baseUrl}/bang-luong/`)) throw new Error(`${item.id}: URL trang chi tiết không thuộc kho bảng lương`);
  if (!item.drive_url?.startsWith("https://drive.google.com/")) throw new Error(`${item.id}: thiếu liên kết Google Drive hợp lệ`);
  if (!Number.isInteger(item.source_count) || item.source_count < 1) throw new Error(`${item.id}: số tài liệu nguồn không hợp lệ`);
  if (item.public_pages !== 0) throw new Error(`${item.id}: không được khai báo ảnh/trang bảng lương công khai trên website`);
  if (!String(item.privacy || "").includes("không hiển thị ảnh trích ngang")) {
    throw new Error(`${item.id}: thiếu chính sách chỉ liên kết Google Drive, không hiển thị ảnh trích ngang`);
  }

  const pathname = new URL(item.url).pathname;
  const relative = pathname.replace(/^\/+|\/+$/g, "");
  const detailFile = path.join(siteRoot, relative, "index.html");
  if (!fs.existsSync(detailFile) || fs.statSync(detailFile).size === 0) {
    throw new Error(`${item.id}: thiếu trang chi tiết ${detailFile}`);
  }
  const detail = fs.readFileSync(detailFile, "utf8");
  detailPages.push({item, pathname, detailFile, detail});

  for (const marker of [item.company_short, item.period, item.url, item.drive_url, "Google Drive"]) {
    if (!detail.includes(marker)) throw new Error(`${item.id}: trang chi tiết thiếu marker ${marker}`);
  }
  if (!hub.includes(`href="${pathname}"`)) throw new Error(`${item.id}: trang kho chưa liên kết tới ${pathname}`);
}

const forbiddenPayrollImageMarkers = [
  "vang-danh-q2-2026-pages/",
  "vang-danh-q2-2026-bang-luong-01.webp",
  "vang-danh-q2-2026-bang-luong-02.webp",
  "payroll-document-page",
  "payroll-pages-note",
  "/bang-luong/assets/",
];
for (const [label, html] of [
  ["trang kho", hub],
  ...detailPages.map(({item, detail}) => [item.id, detail]),
]) {
  for (const marker of forbiddenPayrollImageMarkers) {
    if (html.includes(marker)) throw new Error(`${label}: còn ảnh hoặc khối ảnh bảng lương bị cấm: ${marker}`);
  }
  if (/<img\b[^>]*\bsrc=["']https:\/\/drive\.google\.com\//i.test(html)) {
    throw new Error(`${label}: không được nhúng ảnh trực tiếp từ Google Drive`);
  }
  if (html.includes(`href="https://drive.google.com/file/d/${oldDriveId}`)) {
    throw new Error(`${label}: vẫn còn liên kết tới file ẩn danh cũ`);
  }
}

if (!home.includes("home-library__card--payroll")) throw new Error("Trang chủ thiếu lối vào kho bảng lương.");
if (home.includes("/bang-luong/assets/vang-danh-q2-2026-bang-luong-01.webp")) {
  throw new Error("Thẻ bảng lương trên trang chủ vẫn còn ảnh trích ngang Than Vàng Danh.");
}

for (const url of [`${baseUrl}/bang-luong/`, ...payrolls.items.map((item) => item.url)]) {
  if (!sitemap.includes(url)) throw new Error(`Sitemap bảng lương thiếu URL: ${url}`);
}
if (!robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`)) throw new Error("robots.txt chưa khai báo sitemap chính của website.");

for (const marker of ["home-library__card--payroll", "home-library__grid--four", 'href="/bang-luong/"', "Bảng lương các công ty theo quý"]) {
  if (!generator.includes(marker)) throw new Error(`Bộ dựng trang chủ thiếu lối vào kho bảng lương: ${marker}`);
}
for (const marker of [
  ".home-library__grid--four{grid-template-columns:repeat(4",
  ".home-library__grid--four{grid-template-columns:repeat(2",
]) {
  if (!homeCssSource.includes(marker)) throw new Error(`CSS trang chủ thiếu bố cục kho nội dung bốn thẻ: ${marker}`);
}

console.log(JSON.stringify({
  payrollDataSets: payrolls.items.length,
  companies: new Set(payrolls.items.map((item) => item.company)).size,
  detailPages: detailPages.length,
  driveFolders: payrolls.items.filter((item) => item.source_type === "folder").length,
  driveFiles: payrolls.items.filter((item) => item.source_type === "file").length,
  pendingEmptyFolders: payrolls.pending_sources.filter((item) => item.status === "empty_folder").length,
  payrollImagesPublished: 0,
  errors: 0,
}, null, 2));
