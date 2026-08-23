import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

await import("./build-home-css.mjs");

const sourceDir = path.resolve("content", "home-worker-first");
const siteRoot = path.resolve("tuyen-tho-mo");
const target = path.join(siteRoot, "index.html");
const expectedParts = Array.from({length: 8}, (_, index) => `part-${String(index).padStart(2, "0")}.b64`);
const actualParts = fs.readdirSync(sourceDir)
  .filter((name) => /^part-\d+\.b64$/.test(name))
  .sort();

if (JSON.stringify(actualParts) !== JSON.stringify(expectedParts)) {
  throw new Error(`Worker-first homepage source is incomplete: ${actualParts.join(", ")}`);
}

const encoded = actualParts
  .map((name) => fs.readFileSync(path.join(sourceDir, name), "utf8").replace(/\s+/g, ""))
  .join("");
const sourceHtml = Buffer.from(encoded, "base64").toString("utf8");
const sourceBytes = Buffer.byteLength(sourceHtml);
const sourceSha256 = crypto.createHash("sha256").update(sourceHtml).digest("hex");

// Ảnh hành trình nghề: Vinacomin, Than Mông Dương đẩy nhanh tiến độ ra than dưới mức -400.
// https://vinacomin.vn/vi/video-category/than-mong-duong-day-nhanh-tien-do-ra-than-duoi-muc-400
// Ảnh câu chuyện người thợ: Vinacomin, Than Mông Dương tiếp tục khai thông mở vỉa xuống sâu.
// https://vinacomin.vn/vi/video-category/than-mong-duong-tiep-tuc-khai-thong-mo-via-xuong-sau

if (!sourceHtml.startsWith("<!doctype html>")) throw new Error("Worker-first homepage is not valid HTML");
if (!sourceHtml.includes('id="noi-dung"') || !sourceHtml.includes('id="dieu-kien"') || !sourceHtml.includes('id="dang-ky"')) {
  throw new Error("Worker-first homepage is missing required navigation anchors");
}
if (sourceBytes !== 32653 || sourceSha256 !== "915d085bff4a83c44e1c7bfe6ec8d0962b87fe173493f140af05e0b472cd9f84") {
  throw new Error(`Worker-first homepage source checksum mismatch: ${sourceBytes} bytes, ${sourceSha256}`);
}

const base = "https://thaylinhtuyenthomo.vn";
const authorId = `${base}/tac-gia/nguyen-tu-linh/#person`;
const organizationId = `${base}/#organization`;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: `${base}/`,
      name: "Thầy Linh – Tuyển Thợ Mỏ",
      inLanguage: "vi-VN",
      description: "Thông tin tuyển thợ mỏ, học nghề mỏ và việc làm ngành Than tại Quảng Ninh.",
      publisher: {"@id": organizationId},
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Thầy Linh – Tuyển Thợ Mỏ",
      url: `${base}/`,
      logo: {"@type": "ImageObject", url: `${base}/favicon-512x512.png`, width: 512, height: 512},
      founder: {"@id": authorId},
      publishingPrinciples: `${base}/nguyen-tac-bien-tap/`,
      sameAs: [
        "https://www.facebook.com/thaylinhtuyenthomo/",
        "https://www.youtube.com/@ThầyLinh-TuyểnThợMỏ",
        "https://www.tiktok.com/@thaylinhtuyenthomo",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Số 8 Chu Văn An",
        addressLocality: "phường Hạ Long",
        addressRegion: "Quảng Ninh",
        addressCountry: "VN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+84963048585",
        contactType: "Tư vấn tuyển sinh nghề mỏ",
        areaServed: "VN",
        availableLanguage: "vi",
      },
    },
    {
      "@type": "Person",
      "@id": authorId,
      name: "Nguyễn Tử Linh",
      alternateName: ["Thầy Linh", "Thầy Linh – Tuyển Thợ Mỏ"],
      url: `${base}/tac-gia/nguyen-tu-linh/`,
      image: `${base}/assets/thay-linh-avatar.webp`,
      telephone: "+84963048585",
      jobTitle: "Trưởng phòng Tuyển sinh Miền Trung",
      worksFor: {"@type": "CollegeOrUniversity", name: "Trường Cao đẳng Than - Khoáng sản Việt Nam"},
      sameAs: [
        "https://www.facebook.com/thaylinhtuyenthomo/",
        "https://www.youtube.com/@ThầyLinh-TuyểnThợMỏ",
        "https://www.tiktok.com/@thaylinhtuyenthomo",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${base}/#webpage`,
      url: `${base}/`,
      name: "Tuyển thợ mỏ tháng 8/2026: hành trình học nghề đến nhận việc",
      description: "Hành trình tuyển thợ mỏ tháng 8/2026 từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh; thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất.",
      abstract: "Đăng ký ban đầu chưa cần nộp hoặc gửi ảnh giấy tờ. Khi nhập học mang căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có. Chưa có bằng vẫn có thể đăng ký để được hướng dẫn đối chiếu theo hệ đào tạo. Địa chỉ tư vấn: Số 8 Chu Văn An, phường Hạ Long, Quảng Ninh. Địa điểm nhập học: Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh.",
      dateModified: "2026-08-03",
      lastReviewed: "2026-08-01",
      reviewedBy: {"@id": authorId},
      isPartOf: {"@id": `${base}/#website`},
      author: {"@id": authorId},
      publisher: {"@id": organizationId},
      publishingPrinciples: `${base}/nguyen-tac-bien-tap/`,
      about: {"@id": `${base}/thong-tin-tuyen-tho-mo/#webpage`},
      hasPart: [
        {"@type": "CollectionPage", name: "Cẩm nang nghề mỏ", url: `${base}/cam-nang-nghe-mo/`},
        {"@type": "CollectionPage", name: "Tin tức ngành Than", url: `${base}/tin-nganh-than/`},
        {"@type": "CollectionPage", name: "Ảnh và video thực tế", url: `${base}/anh-video-thuc-te/`},
        {"@type": "CollectionPage", name: "Việc làm ngành Than theo tỉnh", url: `${base}/viec-lam-nganh-than/`},
      ],
    },
  ],
};
const structuredDataMarkup = `  <script type="application/ld+json">\n  ${JSON.stringify(structuredData)}\n  </script>`;

const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
const headerSearch = `<button class="worker-header-search" type="button" data-open-site-search data-worker-search data-context="header" aria-haspopup="dialog" aria-label="Tìm thông tin trên website">${searchIcon}<span class="sr-only">Tìm thông tin</span></button>`;
const heroBriefButton = '<button class="button button-brief" type="button" data-open-worker-brief data-worker-shortcut="brief" aria-haspopup="dialog">Xem nhanh tin tuyển dụng</button>';
const selfCheck = `    <section class="worker-self-check" id="tu-kiem-tra" aria-labelledby="worker-self-check-title">
      <span id="dieu-kien" class="home-anchor" aria-hidden="true"></span>
      <div class="container">
        <div class="worker-self-check__head">
          <div><p class="home-step">Bước 1</p><h2 id="worker-self-check-title">Kiểm tra điều kiện trong 30 giây</h2></div>
          <p>4 câu · không lưu dữ liệu. Khám tuyển là căn cứ xác nhận cuối cùng.</p>
        </div>
        <form class="worker-check" data-worker-check-form novalidate>
          <div class="worker-check__questions">
            <fieldset><legend><span>01</span><strong>Nam, 18–40 tuổi?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="age_range" value="yes"><span>Có</span></label><label><input type="radio" name="age_range" value="review"><span>Không / chưa rõ</span></label></div></fieldset>
            <fieldset><legend><span>02</span><strong>Cao từ 1m53?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="height_range" value="yes"><span>Có</span></label><label><input type="radio" name="height_range" value="review"><span>Không / chưa rõ</span></label></div></fieldset>
            <fieldset><legend><span>03</span><strong>Nặng từ 47kg?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="weight_range" value="yes"><span>Có</span></label><label><input type="radio" name="weight_range" value="review"><span>Không / chưa rõ</span></label></div></fieldset>
            <fieldset><legend><span>04</span><strong>Sức khỏe tốt, không cận thị hoặc bệnh ảnh hưởng công việc?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="health_screen" value="yes"><span>Có</span></label><label><input type="radio" name="health_screen" value="review"><span>Không / chưa rõ</span></label></div></fieldset>
          </div>
          <div class="worker-check__footer"><p>Chưa cần nộp hồ sơ.</p><button class="worker-check__submit" type="submit">Xem kết quả</button></div>
          <div class="worker-check__result" data-worker-check-result role="status" aria-live="polite" tabindex="-1" hidden></div>
        </form>
      </div>
    </section>

`;
const applicationHref = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=home_consultation_2026&amp;utm_content=home_form#dang-ky";
const zaloHref = "https://zalo.me/0963048585";
const messengerHref = "https://m.me/thaylinhtuyenthomo";

const simpleMain = `  <main id="noi-dung" class="home-funnel">
    <section class="hero" data-hero>
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Thông tin tuyển sinh tháng 8/2026</p>
          <h1>Tuyển thợ mỏ.<span>Học nghề, nhận việc tại Quảng Ninh.</span></h1>
          <p class="hero-lead">Nam 18–40 · cao từ 1m53 · nặng từ 47kg · đủ sức khỏe</p>
          <div class="button-row">
            <a class="button button-zalo" href="#tu-kiem-tra">Kiểm tra điều kiện</a>
            ${heroBriefButton}
          </div>
          <small class="hero-assurance">Chưa cần hồ sơ · chưa cần lên Quảng Ninh</small>
        </div>
        <figure class="hero-visual">
          <img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Công nhân thợ lò mặc bảo hộ xanh, đội mũ chuẩn bị thiết bị trước ca làm việc" loading="eager" fetchpriority="high" decoding="async" width="1200" height="736">
          <div class="hero-visual__income" id="quyen-loi"><small>THU NHẬP BÌNH QUÂN</small><strong>20–25 triệu/tháng</strong></div>
          <figcaption><small>HỌC NGHỀ TẠI QUANG HANH</small><strong>2–3 tháng · miễn học phí · có ăn ở</strong></figcaption>
        </figure>
      </div>
    </section>

    <nav class="home-content-shortcuts" aria-label="Bài viết, tin ngành mỏ và video">
      <div class="container">
        <a href="/cam-nang-nghe-mo/"><span aria-hidden="true">▤</span><strong>Cẩm nang</strong></a>
        <a href="/tin-nganh-than/"><span aria-hidden="true">●</span><strong>Tin ngành Than</strong></a>
        <a href="/anh-video-thuc-te/"><span aria-hidden="true">▶</span><strong>Video thực tế</strong></a>
      </div>
    </nav>

${selfCheck}
    <section class="home-journey" id="thong-tin" aria-labelledby="home-journey-title">
      <span id="quy-trinh" class="home-anchor" aria-hidden="true"></span><span id="theo-tinh" class="home-anchor" aria-hidden="true"></span><span id="che-do-ho-so" class="home-anchor" aria-hidden="true"></span>
      <div class="container">
        <div class="home-section-head"><p class="home-step">Bước 2</p><h2 id="home-journey-title">Từ tư vấn đến nhận việc: 4 chặng</h2></div>
        <div class="home-journey__layout">
          <figure class="home-journey__visual">
            <img src="/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp" alt="Tổ đội công nhân Than Mông Dương mặc bảo hộ xanh trao đổi bản vẽ trong hầm lò" loading="lazy" decoding="async" width="1600" height="860">
            <figcaption><small>TỪ NGƯỜI MỚI</small><strong>Tư vấn → nhập học → học nghề → nhận việc</strong></figcaption>
          </figure>
          <ol class="home-journey__steps">
            <li><span>01</span><div><h3>Tư vấn sơ bộ</h3><p>Gửi năm sinh, cao/nặng, sức khỏe và tỉnh đang sống.</p><a class="home-journey__detail" href="/kiem-tra-dieu-kien/">Xem điều kiện tuyển →</a></div></li>
            <li id="ho-so"><span>02</span><div><h3>Nhập học tại Quang Hanh</h3><p id="dia-diem">Mang CCCD, giấy khai sinh và bằng nếu có.</p><a class="home-journey__detail" href="/ho-so-nhap-hoc/">Xem hồ sơ cần mang →</a></div></li>
            <li id="thoi-gian-hoc"><span>03</span><div><h3>Học nghề</h3><p>Khai thác và xây dựng mỏ: 2–3 tháng · Cơ điện mỏ: 10 tháng.</p><p id="ho-tro-hoc-nghe" class="home-journey__support">Miễn học phí · 3 bữa/ngày · KTX · hỗ trợ 7,5 triệu đồng/tháng.</p><a class="home-journey__detail" href="/thu-nhap-an-o-ho-tro/">Xem quyền lợi khi học →</a></div></li>
            <li id="noi-lam-viec"><span>04</span><div><h3>Nhận việc tại Quảng Ninh</h3><p>Làm việc tại các đơn vị ngành Than.</p><a class="home-journey__detail" href="/thong-tin-tuyen-tho-mo/">Xem thông tin tuyển đang áp dụng →</a></div></li>
          </ol>
        </div>
      </div>
    </section>

    <section class="home-province-quick" aria-labelledby="home-province-title">
      <div class="container home-province-quick__inner">
        <div><p class="home-step">Theo địa phương</p><h2 id="home-province-title">Tìm thông tin tại tỉnh đang sống</h2></div>
        <nav class="home-province-quick__links" aria-label="Tỉnh tuyển thợ mỏ được quan tâm">
          <a href="/viec-lam-nganh-than/thanh-hoa/">Thanh Hóa</a>
          <a href="/viec-lam-nganh-than/nghe-an/">Nghệ An</a>
          <a href="/viec-lam-nganh-than/ha-tinh/">Hà Tĩnh</a>
          <a href="/viec-lam-nganh-than/quang-tri/">Quảng Trị</a>
          <a href="/viec-lam-nganh-than/quang-ngai/">Quảng Ngãi</a>
          <a href="/viec-lam-nganh-than/gia-lai/">Gia Lai</a>
          <a href="/viec-lam-nganh-than/dak-lak/">Đắk Lắk</a>
          <a href="/viec-lam-nganh-than/lai-chau/">Lai Châu</a>
          <a class="home-province-quick__all" href="/viec-lam-nganh-than/">Xem đủ 26 tỉnh, thành →</a>
        </nav>
      </div>
    </section>

    <section class="home-proof" id="thuc-te" aria-labelledby="home-proof-title"><span id="nguoi-that-viec-that" aria-hidden="true"></span>
      <div class="container">
        <div class="home-section-head home-section-head--light"><p class="home-step">Bước 3</p><h2 id="home-proof-title">Xem người thật, việc thật</h2></div>
        <div class="home-proof__grid home-proof__grid--simple">
          <article class="home-proof__video">
            <div class="video-frame" data-featured-video-host><button class="home-video-facade" type="button" data-featured-video-facade data-video-id="ts41cqu7r9c" data-video-title="Hành trình lập nghiệp cùng nghề mỏ" aria-label="Phát video hành trình lập nghiệp cùng nghề mỏ"><img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Người thợ mỏ chuẩn bị thiết bị trước ca làm việc" loading="lazy" decoding="async" width="1200" height="736"><span class="home-video-facade__play" aria-hidden="true">▶</span><span class="home-video-facade__label">Bấm để xem phóng sự</span></button></div>
            <div class="home-proof__video-copy"><small>VIDEO NGƯỜI LAO ĐỘNG</small><h3>Nghe người trong nghề chia sẻ</h3><a href="/anh-video-thuc-te/">Xem toàn bộ video thực tế →</a></div>
          </article>
          <a class="home-proof__story" href="/cau-chuyen-cong-nhan/">
            <img src="/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp" alt="Tổ đội công nhân Than Mông Dương mặc bảo hộ xanh trong hầm lò" loading="lazy" decoding="async" width="1600" height="882">
            <span><small>CÂU CHUYỆN THEO TỈNH</small><strong>Từ quê nhà đến vùng mỏ</strong><b>Xem người lao động cùng quê →</b></span>
          </a>
        </div>
      </div>
    </section>

    <section class="home-library" id="kho-noi-dung" aria-labelledby="home-library-title">
      <div class="container">
        <div class="home-section-head"><p class="home-step">Bài viết · Tin tức · Video</p><h2 id="home-library-title">Kho nội dung nghề mỏ</h2><a href="/tin-nganh-than/">Xem tất cả bài mới →</a></div>
        <div class="home-library__grid">
          <a class="home-library__card" href="/cam-nang-nghe-mo/">
            <img src="/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp" alt="Nhóm công nhân Than Mông Dương mặc bảo hộ xanh, đội mũ và trao đổi công việc trong hầm lò" loading="lazy" decoding="async" width="1600" height="860">
            <span><small>BÀI VIẾT HƯỚNG DẪN</small><strong>Cẩm nang nghề mỏ từ điều kiện đến nhận việc</strong><b>Đọc cẩm nang →</b></span>
          </a>
          <a class="home-library__card home-library__card--latest" href="/tin-nganh-than/">
            <img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Tin tức mới nhất từ ngành Than" loading="lazy" decoding="async" width="1200" height="736">
            <span><small>TIN NGÀNH MỎ MỚI NHẤT</small><strong>Đọc tin mới từ các đơn vị ngành Than</strong><b>Đọc bài mới →</b></span>
          </a>
          <a class="home-library__card" href="/anh-video-thuc-te/">
            <img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Người thợ mỏ chuẩn bị thiết bị trước ca làm việc" loading="lazy" decoding="async" width="1200" height="736">
            <span><small>VIDEO NGƯỜI THẬT, VIỆC THẬT</small><strong>Xem phóng sự, tư vấn và câu chuyện công nhân</strong><b>Mở kho video →</b></span>
          </a>
        </div>
      </div>
    </section>

    <section class="worker-register" id="tu-van" aria-labelledby="consult-title"><span id="dang-ky" aria-hidden="true"></span>
      <div class="container worker-register__grid">
        <div><p class="home-step">Bước 4</p><h2 id="consult-title">Chọn cách liên hệ thuận tiện</h2><p class="worker-register__lead">Chỉ cần gửi: năm sinh · cao/nặng · sức khỏe · tỉnh đang sống.</p></div>
        <div class="contact-choice-grid" aria-label="Bốn cách đăng ký và liên hệ">
          <a class="contact-choice contact-choice--form" href="${applicationHref}" data-contact="application" data-context="home-register"><small>ĐƯỢC GỌI LẠI</small><strong data-application-resume-label>Để lại thông tin</strong></a>
          <a class="contact-choice contact-choice--zalo" href="${zaloHref}" target="_blank" rel="noopener" data-contact="zalo" data-context="home-register"><small>NHẮN TIN</small><strong>Zalo 096 304 8585</strong></a>
          <a class="contact-choice contact-choice--messenger" href="${messengerHref}" target="_blank" rel="noopener" data-contact="messenger" data-context="home-register"><small>NHẮN TIN</small><strong>Messenger Thầy Linh</strong></a>
          <a class="contact-choice contact-choice--phone" href="tel:+84963048585" data-contact="phone" data-context="home-register"><small>GỌI TRỰC TIẾP</small><strong>096 304 8585</strong></a>
        </div>
      </div>
    </section>
  </main>`;

function replaceOnce(text, marker, replacement, label) {
  const occurrences = text.split(marker).length - 1;
  if (occurrences !== 1) throw new Error(`${label}: expected one marker, got ${occurrences}`);
  return text.replace(marker, replacement);
}

let html = sourceHtml;
html = html.replace(/\s*<link rel="preconnect" href="https:\/\/i\.ytimg\.com">\s*/i, "\n");
html = html.replace(/\s*<style>\s*\.worker-quick[\s\S]*?<\/style>\s*/i, "\n");
const structuredDataBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi)];
if (structuredDataBlocks.length !== 1) throw new Error(`Worker-first homepage expected one JSON-LD block, got ${structuredDataBlocks.length}`);
html = html.replace(structuredDataBlocks[0][0], structuredDataMarkup);
html = replaceOnce(html, "<title>Tuyển thợ mỏ tháng 8/2026 | Điều kiện, quyền lợi, hồ sơ</title>", "<title>Tuyển thợ mỏ tháng 8/2026 | Học nghề, nhận việc</title>", "Homepage title");
html = replaceOnce(html, '<meta name="description" content="Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg: xem nhanh điều kiện, hồ sơ, nơi học, chế độ ăn ở và thu nhập bình quân 20–25 triệu/tháng.">', '<meta name="description" content="Tuyển thợ mỏ tháng 8/2026: nam 18–40 tuổi, từ 1m53 và 47kg; học nghề tại Quang Hanh, thu nhập bình quân 20–25 triệu/tháng.">', "Homepage description");
html = replaceOnce(html, '<meta property="og:title" content="Tuyển thợ mỏ tháng 8/2026 – xem đủ thông tin trong 2 phút">', '<meta property="og:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', "Homepage Open Graph title");
html = replaceOnce(html, '<meta property="og:description" content="Điều kiện, quyền lợi, hồ sơ, địa điểm nhập học và cách đăng ký được trình bày ngắn gọn cho người lao động.">', '<meta property="og:description" content="Một hành trình rõ ràng từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh.">', "Homepage Open Graph description");
html = replaceOnce(html, '<meta name="twitter:title" content="Tuyển thợ mỏ tháng 8/2026 – thông tin dành cho người lao động">', '<meta name="twitter:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', "Homepage Twitter title");
html = replaceOnce(html, '<meta name="twitter:description" content="Xem nhanh điều kiện, quyền lợi, hồ sơ, địa điểm và cách đăng ký học nghề mỏ tại Quảng Ninh.">', '<meta name="twitter:description" content="Xem hành trình học nghề mỏ tại Quang Hanh, quyền lợi, hồ sơ và việc làm ngành Than tại Quảng Ninh.">', "Homepage Twitter description");
html = replaceOnce(html, '<link rel="preload" href="assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" as="image" type="image/webp">', '<link rel="preload" href="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" as="image" type="image/webp" fetchpriority="high">', "Homepage hero image preload");
html = replaceOnce(html, "</head>", '  <link rel="stylesheet" href="/worker-info-finder.css?v=2">\n  <link rel="stylesheet" href="/home-rich-media.css?v=10">\n  <link rel="stylesheet" href="/journey-optimizer.css?v=2">\n</head>', "Worker self-check and visual consultation funnel stylesheets");
html = replaceOnce(html, '<button class="menu-toggle" type="button"', `${headerSearch}\n      <button class="menu-toggle" type="button"`, "Header search button");
html = replaceOnce(html, 'src="/mobile-ux.js?v=4"', 'src="/mobile-core.js?v=1"', "Homepage mobile core version");
html = html.replace(/<nav class="v4-primary-nav"[\s\S]*?<\/nav>\s*/i, "");
const mainBlocks = html.match(/<main id="noi-dung"[\s\S]*?<\/main>/gi) || [];
if (mainBlocks.length !== 1) throw new Error(`Worker-first homepage expected one main block, got ${mainBlocks.length}`);
html = html.replace(mainBlocks[0], simpleMain);

const mainNav = `<nav class="main-nav" id="main-nav" data-nav aria-label="Điều hướng chính">
        <a href="#tu-kiem-tra">Kiểm tra</a><a href="#quy-trinh">Lộ trình</a><a href="#kho-noi-dung">Bài &amp; video</a><a href="#tu-van">Đăng ký</a>
      </nav>`;
const mainNavBlocks = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/gi) || [];
if (mainNavBlocks.length !== 1) throw new Error(`Worker-first homepage expected one main navigation, got ${mainNavBlocks.length}`);
html = html.replace(mainNavBlocks[0], mainNav);
html = html.replace(/<a class="header-cta"[\s\S]*?<\/a>/i, '<a class="header-cta" href="#tu-van">Nhận tư vấn</a>');
const simpleFooter = `<footer class="site-footer site-footer--home">
    <div class="container footer-simple">
      <a class="brand brand-light" href="./"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a>
      <p>Tư vấn học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p>
      <nav class="footer-simple__links" aria-label="Thông tin cuối trang"><a href="thong-tin-tuyen-tho-mo/">Tin tuyển dụng</a><a href="/cam-nang-nghe-mo/">Cẩm nang</a><a href="/tin-nganh-than/">Tin ngành Than</a><a href="/anh-video-thuc-te/">Video</a><a href="nguyen-tac-bien-tap/">Biên tập</a><a href="/quyen-rieng.html">Quyền riêng tư</a></nav>
    </div>
    <div class="container footer-bottom">© <span data-year></span> Thầy Linh – Tuyển Thợ Mỏ</div>
  </footer>`;
const footerBlocks = html.match(/<footer class="site-footer"[\s\S]*?<\/footer>/gi) || [];
if (footerBlocks.length !== 1) throw new Error(`Worker-first homepage expected one footer, got ${footerBlocks.length}`);
html = html.replace(footerBlocks[0], simpleFooter);

const staticMobile = `<nav class="mobile-contact" aria-label="Liên hệ nhanh trên điện thoại">
    <a href="${zaloHref}" target="_blank" rel="noopener" data-contact="zalo" data-context="home-mobile"><strong>Zalo</strong><span>Nhắn tin</span></a>
    <a href="${messengerHref}" target="_blank" rel="noopener" data-contact="messenger" data-context="home-mobile"><strong>Mess</strong><span>Nhắn tin</span></a>
    <a href="tel:+84963048585" data-contact="phone" data-context="home-mobile"><strong>Gọi</strong><span>096 304 8585</span></a>
  </nav>`;
const mobileBlocks = html.match(/<nav class="mobile-contact"[\s\S]*?<\/nav>/gi) || [];
if (mobileBlocks.length !== 1) throw new Error(`Worker-first homepage expected one static mobile contact bar, got ${mobileBlocks.length}`);
html = html.replace(mobileBlocks[0], staticMobile);
html = replaceOnce(html, "</body>", '  <script src="/worker-info-finder.js?v=2" defer></script>\n  <script src="/journey-optimizer.js?v=2" defer></script>\n</body>', "Worker self-check and consultation journey scripts");

const bundledStyles = [
  "landing-recruitment.css", "publication-polish.css", "mobile-ux.css", "mobile-core.css", "fonts.css",
  "worker-info-finder.css", "home-rich-media.css", "journey-optimizer.css", "v5-growth.css", "site-shell-20260803.css",
];
for (const stylesheet of bundledStyles) {
  html = html.replace(new RegExp(`\\s*<link\\b[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*${stylesheet.replaceAll(".", "\\.")}[^"']*["'][^>]*>`, "gi"), "");
}
html = replaceOnce(html, "</head>", '  <link rel="stylesheet" href="/home-critical.css?v=2">\n  <script data-home-content-loader>addEventListener("load",()=>{const link=document.createElement("link");link.rel="stylesheet";link.href="/home-content.css?v=3";document.head.append(link)},{once:true})</script>\n  <noscript><link rel="stylesheet" href="/home-content.css?v=3"></noscript>\n</head>', "Bundled homepage styles");

for (const required of ['class="home-funnel"', 'class="hero-visual"', 'class="home-journey"', 'class="home-province-quick"', 'id="home-province-title"', 'href="/viec-lam-nganh-than/"', 'id="thong-tin"', 'id="tu-kiem-tra"', 'id="thuc-te"', 'id="quy-trinh"', 'id="tu-van"', 'id="kho-noi-dung"', 'class="home-content-shortcuts"', 'class="home-library__grid"', 'href="/cam-nang-nghe-mo/"', 'href="/tin-nganh-than/"', 'href="/anh-video-thuc-te/"', 'href="/kiem-tra-dieu-kien/"', 'href="/ho-so-nhap-hoc/"', 'href="/thu-nhap-an-o-ho-tro/"', 'class="home-journey__layout"', 'class="home-journey__steps"', 'class="home-journey__detail"', 'class="home-proof"', 'data-featured-video-facade', '/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp', '/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp', '/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp', "data-open-site-search", "data-worker-check-form", "data-open-worker-brief", 'id="che-do-ho-so"', 'id="thoi-gian-hoc"', 'id="ho-tro-hoc-nghe"', 'id="noi-lam-viec"', 'class="worker-register__lead"', 'class="contact-choice-grid"', 'data-contact="application"', 'data-contact="zalo"', 'data-contact="messenger"', 'data-contact="phone"']) {
  if (!html.includes(required)) throw new Error(`Worker-first homepage is missing generated feature: ${required}`);
}
const rejectedPodiumImage = ["vinacomin", "dao", "tao", "tho", "lo.webp"].join("-");
if (html.includes(`/assets/${rejectedPodiumImage}`)) throw new Error("Worker-first homepage still contains the rejected podium image");
for (const removed of ['class="worker-quick"', 'class="worker-recommended"', 'class="home-gallery"', 'class="hero-card"', 'class="hero-facts"', 'class="hero-proof-grid"', 'class="consultation-path"', 'class="worker-summary"', 'class="worker-faq"', 'class="verification-gateway"', 'class="section process-section"', 'class="v5-intent-hub"', 'class="v4-final-conversion"', 'class="v4-five-paths"', 'data-worker-province-select', 'data-province-video-facade']) {
  if (html.includes(removed)) throw new Error(`Worker-first homepage still contains removed complexity: ${removed}`);
}

const outputBytes = Buffer.byteLength(html);
const outputSha256 = crypto.createHash("sha256").update(html).digest("hex");
fs.writeFileSync(target, html);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/index.html",
  publicUrl: "/",
  parts: actualParts.length,
  sourceBytes,
  sourceSha256,
  outputBytes,
  outputSha256,
  compatibilityAnchors: 2,
  consultationSteps: 4,
  selfCheckQuestions: 4,
  visibleMediaItems: 6,
  contactChannels: ["form", "zalo", "messenger", "phone"],
}, null, 2));
