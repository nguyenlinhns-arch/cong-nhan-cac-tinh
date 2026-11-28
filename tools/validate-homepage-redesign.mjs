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
  'portal-official.js?v=11',
  'id="home-kcn-video"',
  'facebook.com%2Freel%2F1145886217664123',
  'data-home-reel-schema',
  'id="nghe-dang-tuyen"',
  'class="button button-brief home-v6-button home-v6-button--brief"',
  '/assets/vinacomin-tho-lo-ha-lam-giao-ca.webp',
  'Nhóm thợ lò Than Hà Lầm mặc bảo hộ xanh, đội mũ',
  '/assets/vinacomin-hoc-vien-quang-hanh-ao-xanh-doi-mu.webp',
  '/assets/vinacomin-tho-lo-lo-van-ky-mu-bao-ho.webp',
  '/assets/vinacomin-tho-lo-guong-sang-mu-bao-ho.webp',
  '/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/',
  '/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/',
  '/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/',
  'class="tl-mobile-contact home-v6-mobile-contact"',
  'class="tl-mobile-contact__zalo"',
  'class="tl-mobile-contact__call"',
  'class="tl-mobile-contact__journey"',
  'href="/bang-luong/"',
  'href="/phong-su/"',
  'id="doc-truoc-khi-dang-ky"',
  'data-tkv-current-title',
  'data-context="home-watch"',
  'href="/hoi-dap-di-lam-mo-than-quang-ninh/"',
  'href="/tuyen-tho-mo-quang-ninh/"',
]) requireText(home, marker, "Trang chủ mới");

requireText(home, '<a class="header-cta" href="#dang-ky" data-contact="application" data-context="home-header">Đăng ký ngay</a>', "Nút đăng ký thanh đầu trang");

const heroActions = home.match(/<div class="home-v6-actions">([\s\S]*?)<\/div>/)?.[1] || "";
for (const marker of ["home-v6-button--primary", "home-v6-button--secondary", 'href="#hanh-trinh-tu-que"']) {
  if (!heroActions.includes(marker)) errors.push(`Cụm nút đầu trang: thiếu ${marker}`);
}

if (!heroActions.includes('href="#dang-ky"')) errors.push("Nút đăng ký đầu trang phải dẫn đến form thật");
if (!(home.indexOf('data-recruitment-entry') < home.indexOf('id="tkv-video-title"'))) errors.push("Trang chủ phải mở đầu bằng tuyển dụng thay vì video");
const order = ["hanh-trinh-tu-que", "home-kcn-video", "tuyen-sinh-tai-cac-tinh", "don-hoc-sinh-nhap-hoc", "thuc-te", "tkv-video-title", "doc-truoc-khi-dang-ky", "tu-van", "nghe-dang-tuyen", "tu-kiem-tra", "thong-tin", "kho-noi-dung"];
let previous = -1;
for (const id of order) {
  const current = home.indexOf(`id="${id}"`);
  if (current < 0 || current <= previous) errors.push(`Trang chủ mới: sai thứ tự tại ${id}`);
  previous = current;
}

const field = home.match(/<section class="home-field"[\s\S]*?<\/section>/)?.[0] || "";
for (const marker of [
  'href="/chon-kcn-hay-lam-mo/"', 'href="/ho-so-nhap-hoc/"',
  'href="https://www.facebook.com/reel/988978737487363"',
  'href="https://www.facebook.com/reel/1015675787556708"',
]) requireText(field, marker, "Ba chủ đề nổi bật");
if (/<iframe\b/i.test(field)) errors.push("Video chỉ nạp iframe sau khi bấm");
if ((field.match(/data-home-pin=/g) || []).length !== 3) errors.push("Cần đúng ba Reel ghim");
if ((home.match(/id="hanh-trinh-tu-que"/g) || []).length !== 1) errors.push("Chỉ có một mục hành trình tuyển sinh");

const realReads = home.match(/<div class="home-real-reads">([\s\S]*?)<\/div>/)?.[1] || "";
const realReadPaths = [...realReads.matchAll(/href="(\/tin-nganh-than\/[^"]+\/)"/g)].map(m => m[1]);
if (realReadPaths.length !== 3 || realReadPaths.some(href => !fs.existsSync(path.join(root, href, "index.html")))) {
  errors.push("Ba bài thực tế phải có đường dẫn hợp lệ");
}

const worksheet = home.match(/<form class="worker-check"[\s\S]*?<\/form>/)?.[0] || "";
if (!/type="button" data-worker-check-trigger/.test(worksheet) || /type="submit"/.test(worksheet) || !worksheet.includes("<noscript>")) {
  errors.push("Tự kiểm tra chỉ xử lý cục bộ, kể cả khi JavaScript không tải");
}

const h1s = [...home.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
if (h1s.length !== 1) errors.push(`Trang chủ mới: cần đúng 1 H1, hiện có ${h1s.length}`);
const homepageH1 = h1s[0]?.[1] || "";
if (!/Học nghề mỏ/i.test(homepageH1) || !/việc làm ngành Than/i.test(homepageH1)) {
  errors.push("Trang chủ mới: H1 phải thể hiện vai trò hub học nghề mỏ và việc làm ngành Than");
}
if (/Tuyển thợ mỏ Quảng Ninh/i.test(homepageH1)) {
  errors.push("Trang chủ mới: không được tranh H1 tuyển thợ mỏ Quảng Ninh với landing chuyên dụng");
}

const reelFacade = home.match(/<button\b[^>]+data-facebook-reel-facade[^>]*>/i)?.[0] || "";
if (!reelFacade) errors.push("Video Reel: thiếu lớp xem trước bấm-để-phát");
for (const marker of ['data-facebook-embed="https://www.facebook.com/plugins/video.php', 'aria-label="Phát video Làm mỏ hay làm khu công nghiệp của Thầy Linh"']) {
  if (!reelFacade.includes(marker)) errors.push(`Video Reel: thiếu ${marker}`);
}
if (/<iframe\b[^>]+facebook\.com\/plugins\/video\.php/i.test(home)) errors.push("Video Reel: không được tạo iframe Facebook trước khi người dùng bấm phát");

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
for (const marker of ["@media(max-width:767px)", ".home-facebook-facade", ".home-v6-career-list", ".home-v6-mobile-contact", "grid-template-columns:repeat(3,minmax(0,1fr))"]) requireText(content, marker, "CSS trang chủ");

if (home.includes('id="home-daily-seo-title"') || home.includes('class="home-content-shortcuts home-journey-shortcuts"')) {
  errors.push("Trang chủ không được chèn lại khối giải đáp mới hoặc ba ô lối tắt đã bỏ");
}

const homepageImageSources = [...home.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)]
  .map((match) => match[1])
  .filter((source) => !source.includes("thay-linh-avatar.webp"));
// Separate thumbnails of the same player selection are intentional.
const duplicateHomepageImages = [...new Set(homepageImageSources.filter((source, index) => homepageImageSources.indexOf(source) !== index))];
if (duplicateHomepageImages.length) errors.push(`Ảnh minh họa trang chủ bị lặp: ${duplicateHomepageImages.join(", ")}`);

console.log(JSON.stringify({
  sections: order.length,
  careers: (home.match(/\/viec-lam\/ky-thuat-[^\"]+\/"/g) || []).length,
  facebookReelFacades: reelFacade ? 1 : 0,
  mobileActions: mobileOrder.length,
  homepageImages: homepageImageSources.length,
  duplicateHomepageImages,
  seoRole: "learning-and-career-hub",
  primaryRecruitmentLanding: "/tuyen-tho-mo-quang-ninh/",
  errors: errors.length,
  sampleErrors: errors.slice(0, 20),
}, null, 2));
if (errors.length) process.exitCode = 1;
