import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const CHECK_ONLY = process.argv.includes("--check");
const OLD_SOCIAL_IMAGE = "https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp";
const BLUE_SOCIAL_IMAGE = "https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg";
const RETIRED_IMAGE = ["vinacomin-tho-lo-thao", "a-bang.webp"].join("-");
const REPLACEMENT_IMAGE = "vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp";
const BLUE_WORKER_IMAGES = new Set([
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-ha-lam-tang-qua.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-ha-lam-dong-doi.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-tkv-bat-tay-trong-ham-lo.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-tkv-doan-ket-trong-ham-lo.webp",
]);

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function isSourcedArticle(relativePath) {
  return relativePath.startsWith("tin-nganh-than/2026/") || relativePath.startsWith("bai-viet/");
}

const changed = [];
for (const file of walk(SITE).filter((target) => target.endsWith(".html"))) {
  const relativePath = path.relative(SITE, file).split(path.sep).join("/");
  const current = fs.readFileSync(file, "utf8");
  let next = current.replaceAll(RETIRED_IMAGE, REPLACEMENT_IMAGE);
  if (!isSourcedArticle(relativePath)) next = next.replaceAll(OLD_SOCIAL_IMAGE, BLUE_SOCIAL_IMAGE);
  if (next === current) continue;
  changed.push(relativePath);
  if (!CHECK_ONLY) fs.writeFileSync(file, next);
}

const dailySeo = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "daily-seo-articles.json"), "utf8"));
const invalidDailyImages = dailySeo.articles.filter((article) => !BLUE_WORKER_IMAGES.has(article.image?.src));
if (invalidDailyImages.length) {
  throw new Error(`Bài giải đáp còn ảnh không phải công nhân áo xanh, đội mũ: ${invalidDailyImages.map((article) => article.slug).join(", ")}`);
}

const home = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
for (const required of [
  "/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp",
  "/assets/vinacomin-tho-mo-ha-lam-tang-qua.webp",
  "/assets/vinacomin-tho-mo-ha-lam-dong-doi.webp",
  "/assets/vinacomin-tho-mo-tkv-bat-tay-trong-ham-lo.webp",
  "/assets/vinacomin-tho-mo-tkv-doan-ket-trong-ham-lo.webp",
]) {
  if (!home.includes(required)) throw new Error(`Trang chủ thiếu ảnh công nhân áo xanh, đội mũ: ${required}`);
}
for (const forbidden of [
  `/assets/${RETIRED_IMAGE}`,
  "/assets/vinacomin-hoc-sinh-trai-nghiem-mo.webp",
  "/assets/vinacomin-co-gioi-hoa-ham-lo.webp",
]) {
  if (home.includes(forbidden)) throw new Error(`Trang chủ còn ảnh minh họa cũ: ${forbidden}`);
}

if (CHECK_ONLY && changed.length) {
  throw new Error(`Còn ${changed.length} trang chưa chuyển ảnh chia sẻ mặc định sang công nhân áo xanh: ${changed.join(", ")}`);
}

const retiredAsset = path.join(SITE, "assets", RETIRED_IMAGE);
if (fs.existsSync(retiredAsset)) {
  throw new Error(`Ảnh đã ngừng sử dụng vẫn còn trong kho xuất bản: assets/${RETIRED_IMAGE}`);
}

const referenceFiles = [
  path.join(ROOT, "index.html"),
  ...walk(path.join(ROOT, "content")),
  ...walk(path.join(ROOT, "tools")),
  ...walk(SITE),
].filter((file) => /\.(?:css|html|js|json|md|mjs|txt|xml)$/i.test(file));
const retiredReferences = referenceFiles
  .filter((file) => fs.readFileSync(file, "utf8").includes(RETIRED_IMAGE))
  .map((file) => path.relative(ROOT, file).split(path.sep).join("/"));
if (retiredReferences.length) {
  throw new Error(`Ảnh đã ngừng sử dụng còn được tham chiếu tại: ${retiredReferences.join(", ")}`);
}

console.log(`${CHECK_ONLY ? "Validated" : "Updated"} blue-worker illustration policy; the retired image is absent from assets and references. Updated pages: ${changed.length}.`);
