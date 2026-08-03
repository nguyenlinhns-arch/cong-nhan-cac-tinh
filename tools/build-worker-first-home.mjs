import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {dailyCommunityArticles} from "./daily-community-articles.mjs";

await import("./build-worker-first-home-base.mjs");

const article = [...dailyCommunityArticles].sort((a, b) => new Date(b.published) - new Date(a.published))[0];
const homepagePath = path.resolve("tuyen-tho-mo", "index.html");
const journeyCssPath = path.resolve("tuyen-tho-mo", "home-worker-journey.css");
const journeyScriptPath = path.resolve("tuyen-tho-mo", "home-worker-journey.js");
const dimensions = JSON.parse(fs.readFileSync(path.resolve("content", "article-image-dimensions.json"), "utf8"));
const [width, height] = dimensions[article.image] || [1200, 675];
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function replaceOnce(text, marker, replacement, label) {
  const occurrences = text.split(marker).length - 1;
  if (occurrences !== 1) throw new Error(`${label}: expected one marker, got ${occurrences}`);
  return text.replace(marker, replacement);
}

for (const file of [journeyCssPath, journeyScriptPath]) {
  if (!fs.existsSync(file)) throw new Error(`Thiếu tài nguyên hành trình người lao động: ${path.basename(file)}`);
}
const journeyCss = fs.readFileSync(journeyCssPath, "utf8").trim();
const journeyScript = fs.readFileSync(journeyScriptPath, "utf8");
if (Buffer.byteLength(journeyCss) > 9_000) throw new Error("CSS hành trình trang chủ vượt 9 KB");
if (Buffer.byteLength(journeyScript) > 9_000) throw new Error("JS hành trình trang chủ vượt 9 KB");
new vm.Script(journeyScript, {filename: "home-worker-journey.js"});
for (const marker of ["home-journey-shortcuts", "tl-mobile-contact__journey", "worker_journey_step_view"]) {
  if (!`${journeyCss}\n${journeyScript}`.includes(marker)) throw new Error(`Tài nguyên hành trình thiếu marker: ${marker}`);
}

let html = fs.readFileSync(homepagePath, "utf8");
const card = `<a class="home-library__card home-library__card--latest" href="/${article.urlPath}/">
            <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="${width}" height="${height}">
            <span><small>TIN NGÀNH MỎ MỚI NHẤT</small><strong>${escapeHtml(article.title)}</strong><b>Đọc bài mới →</b></span>
          </a>`;
const latestArticleMarker = /<a class="home-library__card home-library__card--latest"[\s\S]*?<\/a>/;
if (!latestArticleMarker.test(html)) throw new Error("Trang chủ thiếu vị trí bài ngành Than mới nhất.");
html = html.replace(latestArticleMarker, card);

html = replaceOnce(html, "<title>Tuyển thợ mỏ tháng 8/2026 | Học nghề, nhận việc</title>", "<title>Tuyển thợ mỏ, thợ lò tháng 8/2026 | Quảng Ninh</title>", "SEO title");
html = replaceOnce(html, '<meta name="description" content="Tuyển thợ mỏ tháng 8/2026: nam 18–40 tuổi, từ 1m53 và 47kg; học nghề tại Quang Hanh, cam kết 20–25 triệu/tháng khi hoàn thành định mức lao động.">', '<meta name="description" content="Tuyển thợ mỏ, thợ lò tháng 8/2026: nam 18–40 tuổi; học nghề tại Quang Hanh, miễn học phí, có ăn ở và nhận việc tại Quảng Ninh.">', "SEO description");
html = replaceOnce(html, '<meta name="keywords" content="tuyển thợ mỏ tháng 8 2026, tuyển thợ lò, học nghề mỏ, việc làm TKV Quảng Ninh, hồ sơ học nghề mỏ, lương thợ lò">', '<meta name="keywords" content="tuyển thợ mỏ tháng 8 2026, tuyển thợ lò Quảng Ninh, học nghề mỏ Quang Hanh, việc làm ngành Than, việc làm TKV, hồ sơ học nghề mỏ">', "SEO keyword map");
html = replaceOnce(html, '<meta property="og:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', '<meta property="og:title" content="Tuyển thợ mỏ, thợ lò tháng 8/2026 tại Quảng Ninh">', "Open Graph title");
html = replaceOnce(html, '<meta property="og:description" content="Một hành trình rõ ràng từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh.">', '<meta property="og:description" content="Kiểm tra điều kiện, xem công việc thực tế, học nghề tại Quang Hanh và đăng ký nhận việc ngành Than ở Quảng Ninh.">', "Open Graph description");
html = replaceOnce(html, '<meta name="twitter:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', '<meta name="twitter:title" content="Tuyển thợ mỏ, thợ lò tháng 8/2026 tại Quảng Ninh">', "Twitter title");
html = replaceOnce(html, '<meta name="twitter:description" content="Xem hành trình học nghề mỏ tại Quang Hanh, quyền lợi, hồ sơ và việc làm ngành Than tại Quảng Ninh.">', '<meta name="twitter:description" content="Xem điều kiện, video công việc thực tế, quyền lợi học nghề và cách đăng ký làm việc ngành Than tại Quảng Ninh.">', "Twitter description");
html = replaceOnce(html, '"name":"Tuyển thợ mỏ tháng 8/2026: hành trình học nghề đến nhận việc"', '"name":"Tuyển thợ mỏ, thợ lò tháng 8/2026 tại Quảng Ninh"', "WebPage structured title");
html = replaceOnce(html, '"description":"Hành trình tuyển thợ mỏ tháng 8/2026 từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh; cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động."', '"description":"Tuyển thợ mỏ, thợ lò tháng 8/2026: kiểm tra điều kiện, xem công việc thực tế, học nghề tại Quang Hanh và nhận việc ngành Than tại Quảng Ninh; cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động."', "WebPage structured description");
html = replaceOnce(html, '<h1>Tuyển thợ mỏ.<span>Học nghề, nhận việc tại Quảng Ninh.</span></h1>', '<h1>Tuyển thợ mỏ tháng 8/2026.<span>Học nghề, nhận việc tại Quảng Ninh.</span></h1>', "Homepage H1");

const journeyShortcuts = `    <nav class="home-content-shortcuts home-journey-shortcuts" aria-label="Ba bước chính dành cho người lao động">
      <div class="container">
        <a href="#tu-kiem-tra" data-journey-shortcut="condition"><b aria-hidden="true">01</b><span><small>30 giây</small><strong>Kiểm tra điều kiện</strong></span></a>
        <a href="#thuc-te" data-journey-shortcut="proof"><b aria-hidden="true">02</b><span><small>Người thật · việc thật</small><strong>Xem công việc thực tế</strong></span></a>
        <a href="#tu-van" data-journey-shortcut="consultation"><b aria-hidden="true">03</b><span><small>Zalo · gọi lại</small><strong>Đăng ký tư vấn</strong></span></a>
      </div>
    </nav>`;
const shortcutMarker = /    <nav class="home-content-shortcuts"[\s\S]*?    <\/nav>/;
if (!shortcutMarker.test(html)) throw new Error("Trang chủ thiếu thanh lối đi nhanh.");
html = html.replace(shortcutMarker, journeyShortcuts);

html = replaceOnce(html, '<section class="worker-self-check" id="tu-kiem-tra" aria-labelledby="worker-self-check-title">', '<section class="worker-self-check" id="tu-kiem-tra" data-journey-section="condition" aria-labelledby="worker-self-check-title">', "Condition journey section");
html = replaceOnce(html, '<section class="home-proof" id="thuc-te" aria-labelledby="home-proof-title">', '<section class="home-proof home-proof--early" id="thuc-te" data-journey-section="proof" aria-labelledby="home-proof-title">', "Proof journey section");
html = replaceOnce(html, '<section class="home-journey" id="thong-tin" aria-labelledby="home-journey-title">', '<section class="home-journey" id="thong-tin" data-journey-section="process" aria-labelledby="home-journey-title">', "Process journey section");
html = replaceOnce(html, '<section class="worker-register" id="tu-van" aria-labelledby="consult-title">', '<section class="worker-register" id="tu-van" data-journey-section="consultation" aria-labelledby="consult-title">', "Consultation journey section");

html = replaceOnce(html, '<div class="home-section-head home-section-head--light"><p class="home-step">Bước 3</p><h2 id="home-proof-title">Xem người thật, việc thật</h2></div>', '<div class="home-section-head home-section-head--light"><p class="home-step">Bước 2</p><h2 id="home-proof-title">Xem công việc thợ mỏ qua người thật, việc thật</h2></div>', "Proof heading");
html = replaceOnce(html, '<div class="home-section-head"><p class="home-step">Bước 2</p><h2 id="home-journey-title">Từ tư vấn đến nhận việc: 4 chặng</h2></div>', '<div class="home-section-head"><p class="home-step">Bước 3</p><h2 id="home-journey-title">Hành trình học nghề mỏ và nhận việc tại Quảng Ninh</h2></div>', "Journey heading");
html = replaceOnce(html, '<h2 id="home-province-title">Tìm thông tin tại tỉnh đang sống</h2>', '<h2 id="home-province-title">Tìm việc làm ngành Than theo tỉnh đang sống</h2>', "Province SEO heading");
html = replaceOnce(html, '<h2 id="home-library-title">Kho nội dung nghề mỏ</h2>', '<h2 id="home-library-title">Cẩm nang tuyển thợ mỏ, tin ngành Than và video</h2>', "Content SEO heading");
html = replaceOnce(html, '<h2 id="consult-title">Chọn cách liên hệ thuận tiện</h2>', '<h2 id="consult-title">Đăng ký tư vấn theo cách thuận tiện</h2>', "Consultation heading");

const proofBlock = html.match(/    <section class="home-proof home-proof--early"[\s\S]*?\n    <\/section>\n/)?.[0];
if (!proofBlock) throw new Error("Không tìm thấy khối bằng chứng thực tế để sắp xếp hành trình.");
html = html.replace(proofBlock, "");
const journeyMarker = '    <section class="home-journey" id="thong-tin" data-journey-section="process" aria-labelledby="home-journey-title">';
html = replaceOnce(html, journeyMarker, `${proofBlock}\n${journeyMarker}`, "Move real-work proof before process details");

html = replaceOnce(html, "</head>", `  <style data-home-worker-journey>\n${journeyCss}\n  </style>\n</head>`, "Inline worker journey styles");
html = replaceOnce(html, "</body>", '  <script src="/home-worker-journey.js?v=1" defer></script>\n</body>', "Worker journey behavior");

const expectedOrder = [
  ['id="tu-kiem-tra"', "condition"],
  ['id="thuc-te"', "proof"],
  ['id="thong-tin"', "process"],
  ['id="tu-van"', "consultation"],
];
let previousIndex = -1;
for (const [marker, label] of expectedOrder) {
  const index = html.indexOf(marker);
  if (index < 0 || index <= previousIndex) throw new Error(`Sai thứ tự hành trình người lao động tại bước ${label}`);
  previousIndex = index;
}
for (const marker of [
  "home-journey-shortcuts",
  'data-journey-shortcut="condition"',
  'data-journey-shortcut="proof"',
  'data-journey-shortcut="consultation"',
  'data-home-worker-journey',
  '/home-worker-journey.js?v=1',
  "Tuyển thợ mỏ, thợ lò tháng 8/2026",
  "Xem công việc thợ mỏ qua người thật, việc thật",
  "Hành trình học nghề mỏ và nhận việc tại Quảng Ninh",
]) {
  if (!html.includes(marker)) throw new Error(`Trang chủ sau tối ưu thiếu marker: ${marker}`);
}

fs.writeFileSync(homepagePath, html);
