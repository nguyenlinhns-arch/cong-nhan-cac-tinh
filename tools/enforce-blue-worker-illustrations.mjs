import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const CHECK_ONLY = process.argv.includes("--check");
const OLD_SOCIAL_IMAGE = "https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp";
const BLUE_SOCIAL_IMAGE = "https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg";
const BLUE_WORKER_IMAGES = new Set([
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-thao-a-bang.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp",
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
  if (isSourcedArticle(relativePath)) continue;
  const current = fs.readFileSync(file, "utf8");
  const next = current.replaceAll(OLD_SOCIAL_IMAGE, BLUE_SOCIAL_IMAGE);
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
  "/assets/vinacomin-tho-lo-thao-a-bang.webp",
  "/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp",
]) {
  if (!home.includes(required)) throw new Error(`Trang chủ thiếu ảnh công nhân áo xanh, đội mũ: ${required}`);
}
for (const forbidden of [
  "/assets/vinacomin-hoc-sinh-trai-nghiem-mo.webp",
  "/assets/vinacomin-co-gioi-hoa-ham-lo.webp",
]) {
  if (home.includes(forbidden)) throw new Error(`Trang chủ còn ảnh minh họa cũ: ${forbidden}`);
}

if (CHECK_ONLY && changed.length) {
  throw new Error(`Còn ${changed.length} trang chưa chuyển ảnh chia sẻ mặc định sang công nhân áo xanh: ${changed.join(", ")}`);
}

console.log(`${CHECK_ONLY ? "Validated" : "Updated"} blue-worker illustration policy; sourced press article images were preserved. Generic social pages changed: ${changed.length}.`);
