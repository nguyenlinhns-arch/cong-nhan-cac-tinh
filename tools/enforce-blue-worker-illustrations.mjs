import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const CHECK_ONLY = process.argv.includes("--check");
const assetName = (...parts) => parts.join("-");
const OLD_SOCIAL_IMAGE = `https://thaylinhtuyenthomo.vn/assets/${assetName("og", "cover", "v2.webp")}`;
const BLUE_SOCIAL_IMAGE = "https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg";
const OLD_RETIRED_IMAGE = ["vinacomin-tho-lo-thao", "a-bang.webp"].join("-");
const BANNED_GROUP_IMAGE = ["vinacomin-tho-mo-tkv", "doan-ket-trong-ham-lo.webp"].join("-");
const retiredLocalImages = new Map([
  [OLD_RETIRED_IMAGE, "vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp"],
  [BANNED_GROUP_IMAGE, "vinacomin-cong-nhan-dia-chat-mo-an-toan.webp"],
  [assetName("og", "cover", "v2.webp"), "og-cover-luong-25-trieu-v4.jpg"],
  [assetName("vinacomin", "co", "gioi", "hoa", "ham", "lo.webp"), "vinacomin-cong-nhan-co-gioi-hoa-trong-ham-lo.webp"],
  [assetName("vinacomin", "dao", "tao", "tho", "lo.webp"), "vinacomin-tho-lo-ha-lam-giao-ca.webp"],
  [assetName("vinacomin", "hoc", "sinh", "trai", "nghiem", "mo.webp"), "vinacomin-tho-lo-ha-lam-giao-ca.webp"],
  [assetName("vinacomin", "tho", "mo", "duong", "huy", "trong", "ham", "lo.webp"), "vinacomin-cong-nhan-dia-chat-mo-an-toan.webp"],
  [assetName("vinacomin", "tho", "mo", "ha", "lam", "dong", "doi.webp"), "vinacomin-tho-lo-guong-sang-mu-bao-ho.webp"],
  [assetName("vinacomin", "tho", "mo", "ha", "lam", "tang", "qua.webp"), "vinacomin-tho-lo-than-thong-nhat-ngoai-khai-truong.webp"],
  [assetName("vinacomin", "tho", "mo", "tkv", "bat", "tay", "trong", "ham", "lo.webp"), "vinacomin-tho-lo-pham-dinh-duan-van-hanh-thiet-bi.webp"],
  [assetName("vinacomin", "tho", "mo", "ham", "lo", "1200.webp"), "vinacomin-tho-lo-do-van-do-trong-ham-lo.webp"],
]);
const retiredRemoteImages = new Map([
  [["https://vinacomin.vn/Share/Media/2018/07/IMG", "4207.jpg"].join("_"), "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-than-thong-nhat-ngoai-khai-truong.webp"],
  [["https://vinacomin.vn/Share/Media/2018/07/IMG", "4062.jpg"].join("_"), "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-ha-lam-giao-ca.webp"],
  [["https://vinacomin.vn/Share/Media/2018/07/IMG", "4075.jpg"].join("_"), "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-guong-sang-mu-bao-ho.webp"],
  [["https://vinacomin.vn/Share/Media/2018/07/IMG", "4110.jpg"].join("_"), "https://thaylinhtuyenthomo.vn/assets/vinacomin-cong-nhan-dia-chat-mo-an-toan.webp"],
  [["https://vinacomin.vn/Share/Media/2018/07/IMG", "8544.jpg"].join("_"), "https://thaylinhtuyenthomo.vn/assets/vinacomin-cong-nhan-co-gioi-hoa-trong-ham-lo.webp"],
  [["https://vinacomin.vn/Share/Media/2018/07/IMG", "8765.jpg"].join("_"), "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-lo-van-ky-mu-bao-ho.webp"],
  [["https://cdn.nhandan.vn/images/8d4dd6dbc1e2d72e66f1426728ddf64a9c543cfa89aa05eddc9bd24a3c117488549f3160fee712492c82da51b8dc701bebc551424f1bb2281b5b25c9aa5adfc4/cn-than-ha-long", "5014.jpg.avif"].join("-"), "https://thaylinhtuyenthomo.vn/assets/vinacomin-cong-nhan-co-gioi-hoa-trong-ham-lo.webp"],
]);
const RETIRED_REFERENCES = new Map([...retiredLocalImages, ...retiredRemoteImages]);
const BLUE_WORKER_IMAGES = new Set([
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-than-thong-nhat-ngoai-khai-truong.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-guong-sang-mu-bao-ho.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-ha-lam-giao-ca.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-pham-dinh-duan-van-hanh-thiet-bi.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-cong-nhan-dia-chat-mo-an-toan.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-do-van-do-trong-ham-lo.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-cong-nhan-co-gioi-hoa-trong-ham-lo.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-lo-van-ky-mu-bao-ho.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-hoc-vien-quang-hanh-ao-xanh-doi-mu.webp",
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
  let next = current;
  for (const [retiredImage, replacementImage] of RETIRED_REFERENCES) {
    next = next.replaceAll(retiredImage, replacementImage);
  }
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

const approvedWorkerImages = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "approved-worker-images.json"), "utf8"));
for (const image of approvedWorkerImages.images) {
  if (!/^https:\/\/(?:www\.)?(?:web\.)?vinacomin\.vn\//.test(image.source_article_url)) {
    throw new Error(`Nguồn ảnh minh họa không thuộc Vinacomin: ${image.asset}`);
  }
  if (!fs.existsSync(path.join(SITE, "assets", image.asset))) {
    throw new Error(`Thiếu ảnh minh họa đã duyệt: assets/${image.asset}`);
  }
}

const home = fs.readFileSync(path.join(SITE, "index.html"), "utf8");
for (const required of [
  "/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "/assets/vinacomin-tho-lo-ha-lam-giao-ca.webp",
  "/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "/assets/vinacomin-tho-lo-than-thong-nhat-ngoai-khai-truong.webp",
  "/assets/vinacomin-hoc-vien-quang-hanh-ao-xanh-doi-mu.webp",
  "/assets/vinacomin-tho-lo-lo-van-ky-mu-bao-ho.webp",
  "/assets/vinacomin-tho-lo-guong-sang-mu-bao-ho.webp",
]) {
  if (!home.includes(required)) throw new Error(`Trang chủ thiếu ảnh công nhân áo xanh, đội mũ: ${required}`);
}
for (const forbidden of [
  ...[...retiredLocalImages.keys()].map((retiredImage) => `/assets/${retiredImage}`),
]) {
  if (home.includes(forbidden)) throw new Error(`Trang chủ còn ảnh minh họa cũ: ${forbidden}`);
}

if (CHECK_ONLY && changed.length) {
  throw new Error(`Còn ${changed.length} trang chưa chuyển ảnh chia sẻ mặc định sang công nhân áo xanh: ${changed.join(", ")}`);
}

for (const retiredImage of retiredLocalImages.keys()) {
  const retiredAsset = path.join(SITE, "assets", retiredImage);
  if (fs.existsSync(retiredAsset)) {
    throw new Error(`Ảnh đã ngừng sử dụng vẫn còn trong kho xuất bản: assets/${retiredImage}`);
  }
}

const referenceFiles = [
  path.join(ROOT, "index.html"),
  ...walk(path.join(ROOT, "content")),
  ...walk(path.join(ROOT, "tools")),
  ...walk(SITE),
].filter((file) => /\.(?:css|html|js|json|md|mjs|txt|xml)$/i.test(file));
const retiredReferences = referenceFiles.flatMap((file) => {
  const source = fs.readFileSync(file, "utf8");
  return [...RETIRED_REFERENCES.keys()]
    .filter((retiredReference) => source.includes(retiredReference))
    .map((retiredReference) => `${path.relative(ROOT, file).split(path.sep).join("/")} (${retiredReference})`);
});
if (retiredReferences.length) {
  throw new Error(`Ảnh đã ngừng sử dụng còn được tham chiếu tại: ${retiredReferences.join(", ")}`);
}

console.log(`${CHECK_ONLY ? "Validated" : "Updated"} blue-worker illustration policy; the retired image is absent from assets and references. Updated pages: ${changed.length}.`);
