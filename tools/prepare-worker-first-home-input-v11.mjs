import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const file = path.join(root, "tuyen-tho-mo", "index.html");
let html = fs.readFileSync(file, "utf8");
const errors = [];

function setOne(pattern, replacement, label) {
  const matches = html.match(new RegExp(pattern.source, `${pattern.flags.includes("i") ? "i" : ""}${pattern.flags.includes("s") ? "s" : ""}g`)) || [];
  if (matches.length !== 1) {
    errors.push(`${label}: expected one match, got ${matches.length}`);
    return;
  }
  html = html.replace(pattern, replacement);
}

// build-worker-first-home-base is a deterministic renderer, but its input
// contract predates the current facts-normalized homepage. Re-establish that
// contract semantically so repeated CI/deploy builds do not depend on stale
// literal metadata from a previous generated state.
setOne(/<title>[\s\S]*?<\/title>/i,
  "<title>Tuyển thợ mỏ tháng 8/2026 | Điều kiện, quyền lợi, hồ sơ</title>", "title");
setOne(/<meta\s+name=["']description["'][^>]*>/i,
  '<meta name="description" content="Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg: xem nhanh điều kiện, hồ sơ, nơi học, chế độ ăn ở và Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.">', "description");
setOne(/<meta\s+property=["']og:title["'][^>]*>/i,
  '<meta property="og:title" content="Tuyển thợ mỏ tháng 8/2026 – xem đủ thông tin trong 2 phút">', "og:title");
setOne(/<meta\s+property=["']og:description["'][^>]*>/i,
  '<meta property="og:description" content="Điều kiện, quyền lợi, hồ sơ, địa điểm nhập học và cách đăng ký được trình bày ngắn gọn cho người lao động.">', "og:description");
setOne(/<meta\s+name=["']twitter:title["'][^>]*>/i,
  '<meta name="twitter:title" content="Tuyển thợ mỏ tháng 8/2026 – thông tin dành cho người lao động">', "twitter:title");
setOne(/<meta\s+name=["']twitter:description["'][^>]*>/i,
  '<meta name="twitter:description" content="Xem nhanh điều kiện, quyền lợi, hồ sơ, địa điểm và cách đăng ký học nghề mỏ tại Quảng Ninh.">', "twitter:description");
setOne(/<link\s+rel=["']preload["'][^>]*vinacomin-tho-lo-tieu-bieu-pham-dinh-duan\.webp[^>]*>/i,
  '<link rel="preload" href="assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" as="image" type="image/webp">', "hero preload");

const mobileLoader = html.match(/src=["']\/(?:mobile-ux|mobile-core)\.js\?v=\d+["']/gi) || [];
if (mobileLoader.length !== 1) errors.push(`mobile loader: expected one match, got ${mobileLoader.length}`);
else html = html.replace(/src=["']\/(?:mobile-ux|mobile-core)\.js\?v=\d+["']/i, 'src="/mobile-ux.js?v=4"');

if (errors.length) {
  console.error(JSON.stringify({status:"worker-first-home-input-v11-invalid", errors}, null, 2));
  process.exit(1);
}
fs.writeFileSync(file, html);
console.log(JSON.stringify({status:"worker-first-home-input-v11-ready"}, null, 2));
