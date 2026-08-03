import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {communityArticles} from "./community-articles.mjs";

const sourceDir = path.resolve("content", "home-worker-first");
const siteRoot = path.resolve("tuyen-tho-mo");
const target = path.join(siteRoot, "index.html");
const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const latestArticle = [...communityArticles]
  .sort((left, right) => new Date(right.published) - new Date(left.published))[0];
const latestArticleHref = `/${latestArticle.urlPath}/`;
const imageDimensions = JSON.parse(fs.readFileSync(path.resolve("content", "article-image-dimensions.json"), "utf8"));
const [latestImageWidth, latestImageHeight] = imageDimensions[latestArticle.image] || [1200, 675];
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
      description: "Hành trình tuyển thợ mỏ tháng 8/2026 từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh; cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.",
      abstract: "Đăng ký ban đầu chưa cần nộp hoặc gửi ảnh giấy tờ. Khi nhập học mang căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có. Chưa có bằng vẫn có thể đăng ký để được hướng dẫn đối chiếu theo hệ đào tạo. Địa chỉ tư vấn: Số 8 Chu Văn An, phường Hạ Long, Quảng Ninh.",
      dateModified: "2026-08-03",
      lastReviewed: "2026-08-01",
      reviewedBy: {"@id": authorId},
      isPartOf: {"@id": `${base}/#website`},
      author: {"@id": authorId},
      publisher: {"@id": organizationId},
      publishingPrinciples: `${base}/nguyen-tac-bien-tap/`,
      about: {"@id": `${base}/thong-tin-tuyen-tho-mo/#webpage`},
      mainEntity: {"@id": `${base}/#faq`},
    },
    {
      "@type": "FAQPage",
      "@id": `${base}/#faq`,
      mainEntity: [
        ["Điều kiện đăng ký học nghề mỏ là gì?", "Nam từ 18 đến 40 tuổi, cao từ 1,53 m, nặng từ 47 kg và có sức khỏe tốt. Không cận thị, không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt."],
        ["Thu nhập thợ lò là bao nhiêu?", "Cam kết thu nhập 20–25 triệu đồng mỗi tháng khi hoàn thành định mức lao động."],
        ["Hồ sơ nhập học gồm những gì?", "Khi nhập học cần mang căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có. Chưa có bằng vẫn có thể đăng ký để được hướng dẫn."],
        ["Học nghề mỏ và nhập học ở đâu?", "Địa điểm nhập học là Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh. Chỉ đến sau khi được xác nhận lịch tiếp nhận."],
        ["Trong thời gian học được hỗ trợ gì?", "Người học được miễn kinh phí đào tạo, phục vụ 3 bữa mỗi ngày, bố trí ký túc xá và hỗ trợ 7,5 triệu đồng trong thời gian học."],
      ].map(([name, text]) => ({"@type": "Question", name, acceptedAnswer: {"@type": "Answer", text}})),
    },
  ],
};
const structuredDataMarkup = `  <script type="application/ld+json">\n  ${JSON.stringify(structuredData)}\n  </script>`;

const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
const headerSearch = `<button class="worker-header-search" type="button" data-open-site-search data-worker-search data-context="header" aria-haspopup="dialog" aria-label="Tìm thông tin trên website">${searchIcon}<span class="sr-only">Tìm thông tin</span></button>`;
const heroBriefButton = '<button class="button button-brief" type="button" data-open-worker-brief data-worker-shortcut="brief" aria-haspopup="dialog">Xem nhanh 30 giây</button>';
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
          <p class="eyebrow">Tuyển thợ mỏ tháng 8/2026</p>
          <h1>Học nghề mỏ.<span>Nhận việc tại Quảng Ninh.</span></h1>
          <p class="hero-lead">Nam 18–40 · cao từ 1m53 · nặng từ 47kg · đủ sức khỏe</p>
          <div class="button-row">
            <a class="button button-zalo" href="#tu-kiem-tra">Kiểm tra điều kiện</a>
            ${heroBriefButton}
          </div>
          <small class="hero-assurance">Chưa cần hồ sơ · chưa cần lên Quảng Ninh</small>
        </div>
        <figure class="hero-visual">
          <img src="/assets/vinacomin-hoc-sinh-trai-nghiem-mo.webp" alt="Học viên nghề mỏ mặc bảo hộ làm quen thiết bị trong hầm lò" loading="eager" fetchpriority="high" decoding="async" width="1200" height="673">
          <div class="hero-visual__income" id="quyen-loi"><small>THU NHẬP CAM KẾT</small><strong>20–25 triệu/tháng khi hoàn thành định mức lao động</strong></div>
          <figcaption><small>HỌC NGHỀ TẠI QUANG HANH</small><strong>2–3 tháng · miễn học phí · có ăn ở</strong></figcaption>
        </figure>
      </div>
    </section>

${selfCheck}
    <section class="home-journey" id="thong-tin" aria-labelledby="home-journey-title">
      <span id="quy-trinh" class="home-anchor" aria-hidden="true"></span><span id="theo-tinh" class="home-anchor" aria-hidden="true"></span><span id="che-do-ho-so" class="home-anchor" aria-hidden="true"></span>
      <div class="container">
        <div class="home-section-head"><p class="home-step">Bước 2</p><h2 id="home-journey-title">Từ tư vấn đến nhận việc: 4 chặng</h2></div>
        <div class="home-journey__layout">
          <figure class="home-journey__visual">
            <img src="/assets/vinacomin-tho-mo-ham-lo-1200.webp" alt="Tổ đội thợ mỏ trao đổi phương án công việc trong hầm lò" loading="lazy" decoding="async" width="1200" height="800">
            <figcaption><small>TỪ NGƯỜI MỚI</small><strong>Tư vấn → nhập học → học nghề → nhận việc</strong></figcaption>
          </figure>
          <ol class="home-journey__steps">
            <li><span>01</span><div><h3>Tư vấn sơ bộ</h3><p>Gửi năm sinh, cao/nặng, sức khỏe và tỉnh đang sống.</p></div></li>
            <li id="ho-so"><span>02</span><div><h3>Nhập học tại Quang Hanh</h3><p id="dia-diem">Mang CCCD, giấy khai sinh và bằng nếu có.</p></div></li>
            <li id="thoi-gian-hoc"><span>03</span><div><h3>Học nghề</h3><p>Khai thác và xây dựng mỏ: 2–3 tháng · Cơ điện mỏ: 10 tháng.</p><p id="ho-tro-hoc-nghe" class="home-journey__support">Miễn học phí · 3 bữa/ngày · KTX · hỗ trợ 7,5 triệu.</p></div></li>
            <li id="noi-lam-viec"><span>04</span><div><h3>Nhận việc tại Quảng Ninh</h3><p>Làm việc tại các đơn vị ngành Than.</p></div></li>
          </ol>
        </div>
        <a class="home-journey__more" href="/thong-tin-tuyen-tho-mo/">Xem thông tin tuyển đang áp dụng →</a>
      </div>
    </section>

    <section class="home-proof" id="thuc-te" aria-labelledby="home-proof-title"><span id="nguoi-that-viec-that" aria-hidden="true"></span>
      <div class="container">
        <div class="home-section-head home-section-head--light"><p class="home-step">Bước 3</p><h2 id="home-proof-title">Xem người thật, việc thật</h2></div>
        <div class="home-proof__grid home-proof__grid--simple">
          <article class="home-proof__video">
            <div class="video-frame" data-featured-video-host><button class="home-video-facade" type="button" data-featured-video-facade data-video-id="ts41cqu7r9c" data-video-title="Hành trình lập nghiệp cùng nghề mỏ" aria-label="Phát video hành trình lập nghiệp cùng nghề mỏ"><img src="/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp" alt="Người thợ mỏ chuẩn bị thiết bị trước ca làm việc" loading="lazy" decoding="async" width="1200" height="736"><span class="home-video-facade__play" aria-hidden="true">▶</span><span class="home-video-facade__label">Bấm để xem phóng sự</span></button></div>
            <div class="home-proof__video-copy"><small>VIDEO NGƯỜI LAO ĐỘNG</small><h3>Nghe người trong nghề chia sẻ</h3></div>
          </article>
          <a class="home-proof__story" href="${latestArticleHref}">
            <img src="${esc(latestArticle.image)}" alt="${esc(latestArticle.imageAlt)}" loading="lazy" decoding="async" width="${latestImageWidth}" height="${latestImageHeight}">
            <span><small>BÀI MỚI TỪ NGÀNH THAN</small><strong>${esc(latestArticle.title)}</strong><b>Đọc bài mới →</b></span>
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
          <a class="contact-choice contact-choice--messenge