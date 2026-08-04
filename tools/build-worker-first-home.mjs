import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {dailyCommunityArticles} from "./daily-community-articles-all.mjs";

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
for (const marker of ["home-journey-shortcuts", "tl-mobile-contact__journey", "worker_journey_step_view", ".site-header .brand small"]) {
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

const payrollCard = `          <a class="home-library__card home-library__card--payroll" href="/bang-luong/">
            <img src="/bang-luong/assets/vang-danh-q2-2026-bang-luong-01.webp" alt="Bảng lương công nhân Than Vàng Danh quý II năm 2026 đã ẩn thông tin cá nhân" loading="lazy" decoding="async" width="1450" height="1289">
            <span><small>BẢNG LƯƠNG THỰC TẾ</small><strong>Bảng lương các công ty theo quý</strong><b>Xem bảng lương →</b></span>
          </a>`;
const videoCardMarker = /<a class="home-library__card" href="\/anh-video-thuc-te\/">[\s\S]*?<\/a>/;
if (!videoCardMarker.test(html)) throw new Error("Trang chủ thiếu thẻ kho video để đặt lối vào kho bảng lương.");
html = html.replace(videoCardMarker, (videoCard) => `${videoCard}\n${payrollCard}`);
html = replaceOnce(html, '<div class="home-library__grid">', '<div class="home-library__grid home-library__grid--four">', "Four-card homepage library grid");

html = replaceOnce(html, "<title>Tuyển thợ mỏ tháng 8/2026 | Học nghề, nhận việc</title>", "<title>Tuyển thợ mỏ, thợ lò Quảng Ninh | Học nghề, nhận việc</title>", "SEO title");
html = replaceOnce(html, '<meta name="description" content="Tuyển thợ mỏ tháng 8/2026: nam 18–40 tuổi, từ 1m53 và 47kg; học nghề tại Quang Hanh, cam kết 20–25 triệu/tháng khi hoàn thành định mức lao động.">', '<meta name="description" content="Tuyển thợ mỏ, thợ lò tại Quảng Ninh: nam 18–40 tuổi; học nghề tại Quang Hanh, miễn học phí, có ăn ở và được bố trí việc làm sau đào tạo.">', "SEO description");
html = replaceOnce(html, '<meta name="keywords" content="tuyển thợ mỏ tháng 8 2026, tuyển thợ lò, học nghề mỏ, việc làm TKV Quảng Ninh, hồ sơ học nghề mỏ, lương thợ lò">', '<meta name="keywords" content="tuyển thợ mỏ, tuyển thợ lò Quảng Ninh, học nghề mỏ Quang Hanh, việc làm ngành Than, việc làm TKV, hồ sơ học nghề mỏ">', "SEO keyword map");
html = replaceOnce(html, '<meta property="og:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', '<meta property="og:title" content="Tuyển thợ mỏ, thợ lò tại Quảng Ninh">', "Open Graph title");
html = replaceOnce(html, '<meta property="og:description" content="Một hành trình rõ ràng từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh.">', '<meta property="og:description" content="Kiểm tra điều kiện, xem công việc thực tế, học nghề tại Quang Hanh và đăng ký nhận việc ngành Than ở Quảng Ninh.">', "Open Graph description");
html = replaceOnce(html, '<meta property="og:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">', '<meta property="og:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg">\n  <meta property="og:image:secure_url" content="https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg">', "Open Graph recruitment thumbnail");
html = replaceOnce(html, '<meta property="og:image:type" content="image/webp">', '<meta property="og:image:type" content="image/jpeg">', "Open Graph thumbnail type");
html = replaceOnce(html, '<meta property="og:image:alt" content="Thầy Linh – Học nghề mỏ, làm việc tại Quảng Ninh">', '<meta property="og:image:alt" content="Thầy Linh – Tuyển thợ mỏ, lương 25 triệu mỗi tháng khi hoàn thành định mức lao động">', "Open Graph thumbnail alternative text");
html = replaceOnce(html, '<meta name="twitter:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', '<meta name="twitter:title" content="Tuyển thợ mỏ, thợ lò tại Quảng Ninh">', "Twitter title");
html = replaceOnce(html, '<meta name="twitter:description" content="Xem hành trình học nghề mỏ tại Quang Hanh, quyền lợi, hồ sơ và việc làm ngành Than tại Quảng Ninh.">', '<meta name="twitter:description" content="Xem điều kiện, video công việc thực tế, quyền lợi học nghề và cách đăng ký làm việc ngành Than tại Quảng Ninh.">', "Twitter description");
html = replaceOnce(html, '<meta name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">', '<meta name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg">\n  <meta name="twitter:image:alt" content="Thầy Linh – Tuyển thợ mỏ, lương 25 triệu mỗi tháng khi hoàn thành định mức lao động">', "Twitter recruitment thumbnail");
html = replaceOnce(html, '"name":"Tuyển thợ mỏ tháng 8/2026: hành trình học nghề đến nhận việc"', '"name":"Tuyển thợ mỏ, thợ lò tại Quảng Ninh"', "WebPage structured title");
html = replaceOnce(html, '"description":"Hành trình tuyển thợ mỏ tháng 8/2026 từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh; cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động."', '"description":"Tuyển thợ mỏ, thợ lò tại Quảng Ninh: kiểm tra điều kiện, xem công việc thực tế, học nghề tại Quang Hanh và nhận việc ngành Than; cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động."', "WebPage structured description");
html = replaceOnce(html, '<p class="eyebrow">Thông tin tuyển sinh tháng 8/2026</p>', '<p class="eyebrow">Thông tin tuyển sinh nghề mỏ đang áp dụng</p>', "Homepage status eyebrow");
html = replaceOnce(html, '<h1>Tuyển thợ mỏ.<span>Học nghề, nhận việc tại Quảng Ninh.</span></h1>', '<h1>Tuyển thợ mỏ, thợ lò.<span>Học nghề, nhận việc tại Quảng Ninh.</span></h1>', "Homepage H1");

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

const selfCheckBlock = html.match(/    <section class="worker-self-check"[\s\S]*?\n    <\/section>/)?.[0];
const registerBlock = html.match(/    <section class="worker-register"[\s\S]*?\n    <\/section>/)?.[0];
if (!selfCheckBlock || !registerBlock) throw new Error("Không tìm thấy khối kiểm tra hoặc đăng ký để dựng lại trang chủ.");

const redesignedMain = `  <main id="noi-dung" class="home-funnel">
    <div class="home-v6">
    <section class="home-v6-hero" data-hero aria-labelledby="home-v6-title">
      <div class="container home-v6-hero__grid">
        <div class="home-v6-hero__copy">
          <p class="eyebrow">Thông tin tuyển sinh nghề mỏ đang áp dụng</p>
          <h1 id="home-v6-title">Tuyển thợ mỏ Quảng Ninh.<span>Bắt đầu từ đây.</span></h1>
          <p class="home-v6-hero__lead">Muốn đi làm mỏ than Quảng Ninh? Xem công việc thực tế, chọn nghề phù hợp, kiểm tra điều kiện và được Thầy Linh hướng dẫn từ lúc đăng ký đến khi nhận việc.</p>
          <div class="home-v6-actions">
            <a class="button home-v6-button home-v6-button--primary" href="#tu-kiem-tra">Kiểm tra điều kiện</a>
            <a class="button home-v6-button home-v6-button--video" href="#home-kcn-video">Xem “Làm mỏ hay KCN?”</a>
            <button class="button button-brief home-v6-button home-v6-button--brief" type="button" data-open-worker-brief data-worker-shortcut="brief" aria-haspopup="dialog">Xem nhanh tin tuyển dụng</button>
          </div>
          <div class="home-v6-hero__assist">
            <span>Chưa cần hồ sơ · chưa cần lên Quảng Ninh</span>
          </div>
        </div>
        <figure class="home-v6-hero__visual">
          <img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Công nhân thợ lò mặc bảo hộ xanh, đội mũ chuẩn bị thiết bị trước ca làm việc" loading="eager" fetchpriority="high" decoding="async" width="1200" height="736">
          <figcaption><small>HỌC NGHỀ TẠI QUANG HANH</small><strong>Được đào tạo trước khi nhận việc tại Quảng Ninh</strong></figcaption>
          <div class="home-v6-income"><small>CAM KẾT THU NHẬP</small><strong>20–25 triệu/tháng khi hoàn thành định mức lao động</strong></div>
        </figure>
      </div>
    </section>

    <section class="home-v6-facts" id="quyen-loi" aria-label="Thông tin tuyển sinh chính">
      <div class="container home-v6-facts__grid">
        <article><small>Điều kiện sơ bộ</small><strong>Nam 18–40 tuổi</strong><span>Từ 1m53 · từ 47kg · sức khỏe phù hợp</span></article>
        <article><small>Thời gian học</small><strong>2–3 tháng / 10 tháng</strong><span>Khai thác, xây dựng / cơ điện mỏ</span></article>
        <article><small>Trong thời gian học</small><strong>Miễn học phí · có ăn ở</strong><span>Hỗ trợ sinh hoạt 7,5 triệu đồng</span></article>
        <article><small>Sau đào tạo</small><strong>Được bố trí việc làm</strong><span>Tại các đơn vị ngành Than ở Quảng Ninh</span></article>
      </div>
    </section>

    <section class="home-v6-decision" id="home-kcn-video" aria-labelledby="home-kcn-title">
      <div class="container home-v6-decision__grid">
        <div class="home-v6-reel">
          <div class="home-v6-reel__device">
            <iframe title="Video Làm mỏ hay làm khu công nghiệp của Thầy Linh" src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1145886217664123%2F&amp;show_text=false&amp;width=500" width="500" height="889" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" loading="lazy"></iframe>
          </div>
          <a href="https://www.facebook.com/reel/1145886217664123" target="_blank" rel="noopener noreferrer" data-context="home-kcn-reel">Nếu video chưa phát, mở trên Facebook →</a>
        </div>
        <div class="home-v6-decision__copy">
          <p class="home-step">Video nên xem trước khi quyết định</p>
          <h2 id="home-kcn-title">Làm mỏ hay làm KCN?</h2>
          <p class="home-v6-decision__lead">Không có lựa chọn tốt nhất cho tất cả. Hãy so sánh bằng công việc thực tế, chi phí khi bắt đầu, nơi làm việc và khoản tiền có thể tích lũy sau mỗi tháng.</p>
          <ol class="home-v6-decision__points">
            <li><b>01</b><span><strong>So công việc</strong>Chọn môi trường phù hợp với sức khỏe, hoàn cảnh gia đình và khả năng làm xa nhà.</span></li>
            <li><b>02</b><span><strong>So chi phí ban đầu</strong>Nghề mỏ có lộ trình học nghề, miễn học phí, bố trí ăn ở và hỗ trợ trong thời gian học.</span></li>
            <li><b>03</b><span><strong>So đường dài</strong>Nhìn vào tay nghề, cơ hội nhận việc và khoản tiền còn lại sau chi phí sinh hoạt.</span></li>
          </ol>
          <div class="home-v6-decision__actions"><a href="/chon-kcn-hay-lam-mo/">Xem bài so sánh đầy đủ</a><a href="#tu-kiem-tra">Tôi muốn kiểm tra điều kiện</a></div>
        </div>
      </div>
    </section>

    <section class="home-v6-careers" id="nghe-dang-tuyen" aria-labelledby="home-careers-title">
      <div class="container">
        <div class="home-v6-heading"><div><p class="home-step">Ba nghề đang tuyển</p><h2 id="home-careers-title">Chọn nghề theo công việc bạn muốn học</h2></div><p>Mô tả nghề được chuẩn hóa theo Hướng dẫn số 554/HD-CĐTKV của Trường Cao đẳng Than – Khoáng sản Việt Nam.</p></div>
        <div class="home-v6-careers__grid">
          <figure><img src="/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp" alt="Nhóm công nhân Than Mông Dương mặc bảo hộ xanh, đội mũ và trao đổi công việc trong hầm lò" loading="lazy" decoding="async" width="1600" height="860"><figcaption><small>HỌC TỪ NỀN TẢNG</small><strong>Không yêu cầu kinh nghiệm trước khi đăng ký</strong></figcaption></figure>
          <div class="home-v6-career-list">
            <a href="/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/"><span>01</span><div><small>HỌC 2–3 THÁNG</small><h3>Kỹ thuật khai thác mỏ hầm lò</h3><p>Khai thác than, vận hành thiết bị, vận tải và phối hợp công việc trong dây chuyền sản xuất.</p><b>Xem công việc và đăng ký →</b></div></a>
            <a href="/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/"><span>02</span><div><small>HỌC 2–3 THÁNG</small><h3>Kỹ thuật xây dựng mỏ hầm lò</h3><p>Đào, chống giữ, gia cố và duy trì đường lò phục vụ khai thác than hầm lò.</p><b>Xem công việc và đăng ký →</b></div></a>
            <a href="/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/"><span>03</span><div><small>HỌC 10 THÁNG</small><h3>Kỹ thuật cơ điện mỏ hầm lò</h3><p>Lắp đặt, vận hành, bảo dưỡng và sửa chữa hệ thống cơ khí, điện cùng thiết bị mỏ.</p><b>Xem công việc và đăng ký →</b></div></a>
          </div>
        </div>
      </div>
    </section>

${selfCheckBlock}

    <section class="home-proof home-proof--early" id="thuc-te" data-journey-section="proof" aria-labelledby="home-proof-title"><span id="nguoi-that-viec-that" aria-hidden="true"></span>
      <div class="container">
        <div class="home-section-head home-section-head--light"><p class="home-step">Người thật · việc thật</p><h2 id="home-proof-title">Xem công việc thợ mỏ qua người thật, việc thật</h2></div>
        <div class="home-proof__grid home-proof__grid--simple">
          <article class="home-proof__video">
            <div class="video-frame" data-featured-video-host><button class="home-video-facade" type="button" data-featured-video-facade data-video-id="ts41cqu7r9c" data-video-title="Hành trình lập nghiệp cùng nghề mỏ" aria-label="Phát video hành trình lập nghiệp cùng nghề mỏ"><img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Người thợ mỏ chuẩn bị thiết bị trước ca làm việc" loading="lazy" decoding="async" width="1200" height="736"><span class="home-video-facade__play" aria-hidden="true">▶</span><span class="home-video-facade__label">Bấm để xem phóng sự</span></button></div>
            <div class="home-proof__video-copy"><small>PHÓNG SỰ CÔNG NHÂN</small><h3>Nghe người trong nghề kể về công việc và cuộc sống</h3><a href="/anh-video-thuc-te/">Xem toàn bộ video thực tế →</a></div>
          </article>
          <div class="home-v6-proof-links">
            <a class="home-proof__story" href="/cau-chuyen-cong-nhan/"><img src="/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp" alt="Tổ đội công nhân Than Mông Dương mặc bảo hộ xanh trong hầm lò" loading="lazy" decoding="async" width="1600" height="882"><span><small>CÂU CHUYỆN THEO TỈNH</small><strong>Từ quê nhà đến vùng mỏ</strong><b>Xem người lao động cùng quê →</b></span></a>
            <a class="home-v6-payroll-proof" href="/bang-luong/"><small>BẢNG LƯƠNG THỰC TẾ</small><strong>Xem bảng lương các công ty theo quý</strong><span>Thông tin cá nhân đã được ẩn trước khi công khai.</span><b>Mở kho bảng lương →</b></a>
          </div>
        </div>
      </div>
    </section>

    <section class="home-journey" id="thong-tin" data-journey-section="process" aria-labelledby="home-journey-title"><span id="quy-trinh" class="home-anchor" aria-hidden="true"></span><span id="theo-tinh" class="home-anchor" aria-hidden="true"></span><span id="che-do-ho-so" class="home-anchor" aria-hidden="true"></span>
      <div class="container">
        <div class="home-section-head"><p class="home-step">Từ đăng ký đến nhận việc</p><h2 id="home-journey-title">Hành trình học nghề mỏ và nhận việc tại Quảng Ninh</h2></div>
        <div class="home-journey__layout">
          <figure class="home-journey__visual"><img src="/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp" alt="Tổ đội công nhân Than Mông Dương mặc bảo hộ xanh trao đổi công việc trong hầm lò" loading="lazy" decoding="async" width="1600" height="860"><figcaption><small>MỘT LỘ TRÌNH RÕ RÀNG</small><strong>Tư vấn → nhập học → học nghề → nhận việc</strong></figcaption></figure>
          <ol class="home-journey__steps">
            <li><span>01</span><div><h3>Kiểm tra và tư vấn từ xa</h3><p>Gửi năm sinh, tỉnh đang sống, chiều cao, cân nặng và sức khỏe hiện tại.</p><a class="home-journey__detail" href="/kiem-tra-dieu-kien/">Xem điều kiện tuyển →</a></div></li>
            <li id="ho-so"><span>02</span><div><h3>Nhập học tại Quang Hanh</h3><p id="dia-diem">Mang CCCD, giấy khai sinh và bằng THCS hoặc THPT nếu có.</p><a class="home-journey__detail" href="/ho-so-nhap-hoc/">Xem hồ sơ và địa chỉ →</a></div></li>
            <li id="thoi-gian-hoc"><span>03</span><div><h3>Học nghề và thực hành</h3><p>Khai thác, xây dựng mỏ: 2–3 tháng. Cơ điện mỏ: 10 tháng.</p><p id="ho-tro-hoc-nghe" class="home-journey__support">Miễn học phí · 3 bữa/ngày · KTX · hỗ trợ 7,5 triệu đồng.</p><a class="home-journey__detail" href="/thu-nhap-an-o-ho-tro/">Xem đầy đủ quyền lợi →</a></div></li>
            <li id="noi-lam-viec"><span>04</span><div><h3>Nhận việc tại Quảng Ninh</h3><p>Người hoàn thành đào tạo và đạt yêu cầu được bố trí làm việc tại các đơn vị ngành Than.</p><a class="home-journey__detail" href="/thong-tin-tuyen-tho-mo/">Đối chiếu thông tin đang áp dụng →</a></div></li>
          </ol>
        </div>
      </div>
    </section>

    <nav class="home-content-shortcuts home-journey-shortcuts" aria-label="Ba bước chính dành cho người lao động">
      <div class="container">
        <a href="#tu-kiem-tra" data-journey-shortcut="condition"><b aria-hidden="true">01</b><span><small>30 giây</small><strong>Kiểm tra điều kiện</strong></span></a>
        <a href="#thuc-te" data-journey-shortcut="proof"><b aria-hidden="true">02</b><span><small>Người thật · việc thật</small><strong>Xem công việc thực tế</strong></span></a>
        <a href="#tu-van" data-journey-shortcut="consultation"><b aria-hidden="true">03</b><span><small>Zalo · gọi lại</small><strong>Đăng ký tư vấn</strong></span></a>
      </div>
    </nav>

    <section class="home-library" id="kho-noi-dung" aria-labelledby="home-library-title">
      <div class="container">
        <div class="home-section-head"><p class="home-step">Đọc sâu khi cần kiểm chứng</p><h2 id="home-library-title">Cẩm nang tuyển thợ mỏ, tin ngành Than và video</h2><a href="/cam-nang-nghe-mo/">Mở toàn bộ cẩm nang →</a></div>
        <div class="home-library__grid home-library__grid--four">
          <a class="home-library__card" href="/cam-nang-nghe-mo/"><img src="/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp" alt="Nhóm công nhân Than Mông Dương mặc bảo hộ xanh, đội mũ và trao đổi công việc trong hầm lò" loading="lazy" decoding="async" width="1600" height="860"><span><small>CẨM NANG NGHỀ MỎ</small><strong>Từ điều kiện đến ngày nhận việc</strong><b>Đọc cẩm nang →</b></span></a>
          ${card}
          <a class="home-library__card" href="/anh-video-thuc-te/"><img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Người thợ mỏ chuẩn bị thiết bị trước ca làm việc" loading="lazy" decoding="async" width="1200" height="736"><span><small>VIDEO THỰC TẾ</small><strong>Phóng sự và câu chuyện công nhân</strong><b>Mở kho video →</b></span></a>
${payrollCard}
        </div>
      </div>
    </section>

    <section class="home-province-quick" aria-labelledby="home-province-title">
      <div class="container home-province-quick__inner"><div><p class="home-step">Theo địa phương</p><h2 id="home-province-title">Tìm việc làm ngành Than theo tỉnh đang sống</h2></div><nav class="home-province-quick__links" aria-label="Tỉnh tuyển thợ mỏ được quan tâm"><a href="/viec-lam-nganh-than/thanh-hoa/">Thanh Hóa</a><a href="/viec-lam-nganh-than/nghe-an/">Nghệ An</a><a href="/viec-lam-nganh-than/ha-tinh/">Hà Tĩnh</a><a href="/viec-lam-nganh-than/quang-tri/">Quảng Trị</a><a href="/viec-lam-nganh-than/quang-ngai/">Quảng Ngãi</a><a href="/viec-lam-nganh-than/gia-lai/">Gia Lai</a><a href="/viec-lam-nganh-than/dak-lak/">Đắk Lắk</a><a href="/viec-lam-nganh-than/lai-chau/">Lai Châu</a><a class="home-province-quick__all" href="/viec-lam-nganh-than/">Xem đủ 26 tỉnh, thành →</a></nav></div>
    </section>

${registerBlock}
    </div>
  </main>`;

html = html.replace(/  <main id="noi-dung" class="home-funnel">[\s\S]*?  <\/main>/, redesignedMain);
html = html.replace(
  /<nav class="main-nav" id="main-nav"[\s\S]*?<\/nav>/,
  '<nav class="main-nav" id="main-nav" data-nav aria-label="Điều hướng chính"><a href="#home-kcn-video">KCN hay làm mỏ</a><a href="#nghe-dang-tuyen">Nghề đang tuyển</a><a href="#tu-kiem-tra">Điều kiện</a><a href="#tu-van">Liên hệ</a></nav>',
);
html = html.replace('<a class="header-cta" href="#tu-van">Nhận tư vấn</a>', '<a class="header-cta" href="#tu-kiem-tra">Kiểm tra ngay</a>');
html = html.replace(
  /  <nav class="mobile-contact"[\s\S]*?  <\/nav>/,
  `  <nav class="tl-mobile-contact home-v6-mobile-contact" aria-label="Liên hệ nhanh trên điện thoại">
    <a class="tl-mobile-contact__zalo" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho Thầy Linh" data-contact="zalo" data-context="home-mobile"><b aria-hidden="true">Z</b><span>Zalo</span></a>
    <a class="tl-mobile-contact__call" href="tel:+84963048585" aria-label="Gọi Thầy Linh theo số 096 304 8585" data-contact="phone" data-context="home-mobile"><b aria-hidden="true">☎</b><span>Gọi điện</span></a>
    <a class="tl-mobile-contact__journey" href="#tu-kiem-tra" aria-label="Kiểm tra điều kiện học nghề mỏ" data-worker-journey-action="condition_check" data-context="home-mobile-journey"><b aria-hidden="true">✓</b><span>Kiểm tra</span></a>
  </nav>`,
);

const reelSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": "https://thaylinhtuyenthomo.vn/#lam-mo-hay-kcn-video",
  name: "Làm mỏ hay làm khu công nghiệp?",
  description: "Video của Thầy Linh giúp người lao động so sánh công việc, chi phí ban đầu, nơi làm việc và lộ trình nghề nghiệp trước khi chọn làm khu công nghiệp hoặc học nghề mỏ tại Quảng Ninh.",
  contentUrl: "https://www.facebook.com/reel/1145886217664123",
  embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1145886217664123%2F&show_text=false&width=500",
  thumbnailUrl: "https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg",
  inLanguage: "vi-VN",
  author: {"@id": "https://thaylinhtuyenthomo.vn/tac-gia/nguyen-tu-linh/#person"},
};
html = html.replace("</head>", `  <script type="application/ld+json" data-home-reel-schema>${JSON.stringify(reelSchema)}</script>\n</head>`);
html = html.replace('"dateModified":"2026-08-03"', '"dateModified":"2026-08-04"');

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
  "Tuyển thợ mỏ, thợ lò tại Quảng Ninh",
  "og-cover-luong-25-trieu-v4.jpg",
  "lương 25 triệu mỗi tháng khi hoàn thành định mức lao động",
  "Thông tin tuyển sinh nghề mỏ đang áp dụng",
  "Xem công việc thợ mỏ qua người thật, việc thật",
  "Hành trình học nghề mỏ và nhận việc tại Quảng Ninh",
  "home-library__card--payroll",
  "home-library__grid--four",
  'href="/bang-luong/"',
  "Bảng lương các công ty theo quý",
  'id="home-kcn-video"',
  'facebook.com%2Freel%2F1145886217664123',
  'data-home-reel-schema',
  'id="nghe-dang-tuyen"',
  "Kỹ thuật cơ điện mỏ hầm lò",
  "home-v6-mobile-contact",
]) {
  if (!html.includes(marker)) throw new Error(`Trang chủ sau tối ưu thiếu marker: ${marker}`);
}
for (const staleMarker of [
  "<title>Tuyển thợ mỏ, thợ lò tháng 8/2026",
  '<p class="eyebrow">Thông tin tuyển sinh tháng 8/2026</p>',
  "<h1>Tuyển thợ mỏ tháng 8/2026.",
  "og-cover-v2.webp",
]) {
  if (html.includes(staleMarker)) throw new Error(`Trang chủ còn mốc tháng không phù hợp nội dung lâu dài: ${staleMarker}`);
}

fs.writeFileSync(homepagePath, html);
