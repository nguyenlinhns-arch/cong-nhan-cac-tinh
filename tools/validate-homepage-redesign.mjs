import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const critical = fs.readFileSync(path.join(root, "homepage-redesign-critical.css"), "utf8");
const content = fs.readFileSync(path.join(root, "homepage-redesign.css"), "utf8");
const errors = [];
const requireText = (source, marker, label) => { if (!source.includes(marker)) errors.push(`${label}: thiếu ${marker}`); };

for (const marker of [
  'class="home-v6"',
  'id="home-kcn-video"',
  'facebook.com%2Freel%2F1145886217664123',
  'data-home-reel-schema',
  'id="nghe-dang-tuyen"',
  'class="button button-brief home-v6-button home-v6-button--brief"',
  '/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp',
  'Nhóm công nhân Than Mông Dương mặc bảo hộ xanh, đội mũ',
  '/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp',
  '/assets/vinacomin-tho-mo-ha-lam-tang-qua.webp',
  '/assets/vinacomin-tho-mo-ha-lam-dong-doi.webp',
  '/assets/vinacomin-tho-mo-tkv-bat-tay-trong-ham-lo.webp',
  '/assets/vinacomin-tho-mo-duong-huy-trong-ham-lo.webp',
  '/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/',
  '/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/',
  '/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/',
  'class="tl-mobile-contact home-v6-mobile-contact"',
  'class="tl-mobile-contact__zalo"',
  'class="tl-mobile-contact__call"',
  'class="tl-mobile-contact__journey"',
  'href="/bang-luong/"',
  'href="/cau-chuyen-cong-nhan/"',
  'href="/hoi-dap-di-lam-mo-than-quang-ninh/"',
]) requireText(home, marker, "Trang chủ mới");

const heroActions = home.match(/<div class="home-v6-actions">([\s\S]*?)<\/div>/)?.[1] || "";
for (const marker of ["home-v6-button--primary", "home-v6-button--video", "home-v6-button--brief"]) {
  if (!heroActions.includes(marker)) errors.push(`Cụm nút đầu trang: thiếu ${marker}`);
}

const order = ["home-kcn-video", "nghe-dang-tuyen", "tu-kiem-tra", "thuc-te", "thong-tin", "tu-van"];
let previous = -1;
for (const id of order) {
  const current = home.indexOf(`id="${id}"`);
  if (current < 0 || current <= previous) errors.push(`Trang chủ mới: sai thứ tự tại ${id}`);
  previous = current;
}

const h1s = [...home.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
if (h1s.length !== 1) errors.push(`Trang chủ mới: cần đúng 1 H1, hiện có ${h1s.length}`);
if (!/Tuyển thợ mỏ Quảng Ninh/.test(h1s[0]?.[1] || "")) errors.push("Trang chủ mới: H1 thiếu từ khóa tuyển thợ mỏ Quảng Ninh");

const reel = home.match(/<iframe\b[^>]+facebook\.com\/plugins\/video\.php[^>]*>/i)?.[0] || "";
for (const marker of ['loading="lazy"', 'allowfullscreen="true"', 'title="Video Làm mỏ hay làm khu công nghiệp của Thầy Linh"']) {
  if (!reel.includes(marker)) errors.push(`Video Reel: thiếu ${marker}`);
}

const mobileNav = home.match(/<nav class="tl-mobile-contact home-v6-mobile-contact"[\s\S]*?<\/nav>/)?.[0] || "";
const mobileOrder = ["tl-mobile-contact__zalo", "tl-mobile-contact__call", "tl-mobile-contact__journey"];
let mobilePrevious = -1;
for (const marker of mobileOrder) {
  const current = mobileNav.indexOf(marker);
  if (current < 0 || current <= mobilePrevious) errors.push(`Thanh mobile: sai thứ tự tại ${marker}`);
  mobilePrevious = current;
}

for (const banned of ["nặng nhọc", "độc hại", "nguy hiểm"]) {
  if (home.toLocaleLowerCase("vi").includes(banned)) errors.push(`Trang chủ mới: còn cụm từ cần loại bỏ “${banned}”`);
}
for (const marker of ["@media(max-width:767px)", ".home-v6-hero__grid", ".home-v6-actions", ".home-v6-facts__grid"]) requireText(critical, marker, "CSS đầu trang");
for (const marker of ["@media(max-width:767px)", ".home-v6-reel__device iframe", ".home-v6-career-list", ".home-v6-mobile-contact", "grid-template-columns:repeat(3,minmax(0,1fr))"]) requireText(content, marker, "CSS trang chủ");

const dailyAnswerGrid = home.match(/<div class="home-daily-seo__grid">([\s\S]*?)<\/div><\/div><\/section>/)?.[1] || "";
const dailyAnswerCards = (dailyAnswerGrid.match(/<a\b/g) || []).length;
if (dailyAnswerCards !== 3) errors.push(`Khối giải đáp trang chủ: cần đúng 3 thẻ, hiện có ${dailyAnswerCards}`);

const homepageImageSources = [...home.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)]
  .map((match) => match[1])
  .filter((source) => !source.includes("thay-linh-avatar.webp"));
const duplicateHomepageImages = [...new Set(homepageImageSources.filter((source, index) => homepageImageSources.indexOf(source) !== index))];
if (duplicateHomepageImages.length) errors.push(`Ảnh minh họa trang chủ bị lặp: ${duplicateHomepageImages.join(", ")}`);

console.log(JSON.stringify({
  sections: order.length,
  careers: (home.match(/\/viec-lam\/ky-thuat-[^\"]+\/"/g) || []).length,
  facebookReels: reel ? 1 : 0,
  mobileActions: mobileOrder.length,
  dailyAnswerCards,
  homepageImages: homepageImageSources.length,
  duplicateHomepageImages,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20),
}, null, 2));
if (errors.length) process.exitCode = 1;
