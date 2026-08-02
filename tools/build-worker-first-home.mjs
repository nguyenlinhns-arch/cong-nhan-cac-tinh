import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

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
const heroBriefButton = '<button class="button button-brief" type="button" data-open-worker-brief data-worker-shortcut="brief" aria-haspopup="dialog">Tóm tắt 30 giây</button>';
const selfCheck = `    <section class="worker-self-check" id="tu-kiem-tra" aria-labelledby="worker-self-check-title">
      <div class="container">
        <div class="worker-self-check__head">
          <div><p class="eyebrow">30 giây · không gửi dữ liệu</p><h2 id="worker-self-check-title">Tự kiểm tra điều kiện sơ bộ</h2></div>
          <p>Chọn câu trả lời cho 4 điều kiện dưới đây. Kết quả chỉ giúp định hướng ban đầu; khám tuyển là căn cứ xác nhận cuối cùng.</p>
        </div>
        <form class="worker-check" data-worker-check-form novalidate>
          <div class="worker-check__questions">
            <fieldset><legend><span>01</span><strong>Bạn là nam từ 18 đến 40 tuổi?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="age_range" value="yes"><span>Có</span></label><label><input type="radio" name="age_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
            <fieldset><legend><span>02</span><strong>Chiều cao của bạn từ 1m53 trở lên?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="height_range" value="yes"><span>Có</span></label><label><input type="radio" name="height_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
            <fieldset><legend><span>03</span><strong>Cân nặng của bạn từ 47kg trở lên?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="weight_range" value="yes"><span>Có</span></label><label><input type="radio" name="weight_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
            <fieldset><legend><span>04</span><strong>Bạn có sức khỏe tốt, không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="health_screen" value="yes"><span>Có</span></label><label><input type="radio" name="health_screen" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
          </div>
          <div class="worker-check__footer"><p><strong>Không lưu câu trả lời.</strong> Đăng ký ban đầu vẫn chưa cần nộp hồ sơ.</p><button class="worker-check__submit" type="submit">Xem kết quả sơ bộ</button></div>
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
          <p class="eyebrow">Tuyển thợ mỏ tháng 8/2026 · Học và làm việc tại Quảng Ninh</p>
          <h1>Xem rõ điều kiện, quyền lợi và hành trình trước khi đăng ký nghề mỏ</h1>
          <p class="hero-lead">Thông tin dành cho người lao động được sắp theo từng bước: xem nhanh, tự kiểm tra, hiểu công việc thực tế rồi mới để lại thông tin hoặc liên hệ tư vấn.</p>
          <div class="salary-highlight"><strong>Cam kết 20–25 triệu/tháng khi hoàn thành định mức lao động</strong></div>
          <div class="button-row">
            <a class="button button-zalo" href="#tu-kiem-tra">Kiểm tra tôi có phù hợp</a>
            <a class="button button-messenger" href="#tu-van">Tôi muốn được tư vấn</a>
            ${heroBriefButton}
          </div>
          <div class="hero-facts"><span>Học 2–3 tháng</span><span>Miễn học phí</span><span>Ăn 3 bữa/ngày</span><span>Ở ký túc xá</span><span>Hỗ trợ 7,5 triệu đồng</span></div>
        </div>
        <aside class="hero-card">
          <p class="eyebrow">Chưa cần hồ sơ</p><h2>Trước tiên chỉ cần 4 thông tin</h2>
          <ul><li>Năm sinh</li><li>Chiều cao / cân nặng</li><li>Tình trạng sức khỏe</li><li>Tỉnh đang sinh sống</li></ul>
          <a class="button button-zalo button-full" href="#tu-van">Chọn cách nhận tư vấn</a>
        </aside>
      </div>
    </section>

    <nav class="consultation-path" aria-label="Bốn bước tìm hiểu và đăng ký"><span id="theo-tinh" aria-hidden="true"></span>
      <div class="container consultation-path__grid">
        <a href="#thong-tin"><small>01</small><strong>Xem thông tin</strong><span>Điều kiện, học, ăn ở, thu nhập</span></a>
        <a href="#tu-kiem-tra"><small>02</small><strong>Tự kiểm tra</strong><span>Biết sơ bộ mình có phù hợp</span></a>
        <a href="#thuc-te"><small>03</small><strong>Xem thực tế</strong><span>Hình ảnh, video và câu chuyện</span></a>
        <a href="#tu-van"><small>04</small><strong>Nhận tư vấn</strong><span>Biểu mẫu, Zalo, Messenger, gọi</span></a>
      </div>
    </nav>

    <section class="worker-summary" id="thong-tin" aria-labelledby="essential-title"><span id="dieu-kien" aria-hidden="true"></span><span id="che-do-ho-so" aria-hidden="true"></span>
      <div class="container">
        <div class="worker-summary__intro"><p class="eyebrow">Thông tin đang áp dụng</p><h2 id="essential-title">6 điều cần biết là đủ để cân nhắc</h2><p>Không cần đọc nhiều bài. Nếu cần chi tiết hơn, bấm vào nội dung liên quan hoặc hỏi trực tiếp Thầy Linh.</p></div>
        <div class="worker-summary__grid">
          <article class="worker-fact"><span>01</span><h3>Điều kiện cơ bản</h3><ul><li>Nam từ 18 đến 40 tuổi</li><li>Cao từ 1m53, nặng từ 47kg</li><li>Sức khỏe tốt; không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt</li></ul></article>
          <article class="worker-fact worker-fact--income" id="quyen-loi"><span>02</span><h3>Thu nhập sau đào tạo</h3><strong>20–25 triệu đồng/tháng khi hoàn thành định mức lao động</strong></article>
          <article class="worker-fact" id="thoi-gian-hoc"><span>03</span><h3>Thời gian học</h3><ul><li>Khai thác và xây dựng mỏ: 2–3 tháng</li><li>Cơ điện mỏ: 10 tháng</li></ul></article>
          <article class="worker-fact" id="ho-tro-hoc-nghe"><span>04</span><h3>Hỗ trợ khi học</h3><ul><li>Miễn kinh phí đào tạo</li><li>Ăn 3 bữa/ngày, ở ký túc xá</li><li>Hỗ trợ 7,5 triệu đồng trong thời gian học</li></ul></article>
          <article class="worker-fact" id="ho-so"><span>05</span><h3>Hồ sơ nhập học</h3><ul><li>CCCD bản gốc và giấy khai sinh</li><li>Bằng THCS hoặc THPT nếu có</li><li>Chỉ chuẩn bị sau khi được xác nhận lịch</li></ul></article>
          <article class="worker-fact" id="noi-lam-viec"><span>06</span><h3>Nơi học và làm việc</h3><p>Học tại Quang Hanh; sau đào tạo, người đạt yêu cầu được doanh nghiệp ngành Than tiếp nhận làm việc tại Quảng Ninh.</p></article>
        </div>
      </div>
    </section>

    <section class="learning-story section" aria-labelledby="learning-story-title">
      <div class="container learning-story__grid">
        <figure class="learning-story__media">
          <img src="/assets/vinacomin-hoc-sinh-trai-nghiem-mo.webp" alt="Học viên nghề mỏ mặc bảo hộ quan sát thiết bị trong hầm lò dưới sự hướng dẫn" loading="lazy" decoding="async" width="1200" height="673">
          <figcaption>Học viên được làm quen thiết bị và điều kiện làm việc thực tế trước khi vào sản xuất.</figcaption>
        </figure>
        <div class="learning-story__copy">
          <p class="eyebrow">Hành trình của người mới</p><h2 id="learning-story-title">Chưa biết nghề vẫn có người hướng dẫn từng bước</h2>
          <p>Người lao động không tự lên đường ngay sau khi đọc tin. Trước hết là kiểm tra điều kiện, nhận tư vấn, được xác nhận lịch rồi mới chuẩn bị hồ sơ và nhập học.</p>
          <ol class="learning-story__steps">
            <li><span>01</span><div><strong>Được tư vấn trước khi đi</strong><small>Biết rõ điều kiện, nghề học, chế độ và lịch tiếp nhận.</small></div></li>
            <li><span>02</span><div><strong>Học nghề, thực hành và an toàn</strong><small>Người mới được đào tạo nền tảng trước khi vào sản xuất.</small></div></li>
            <li><span>03</span><div><strong>Nhận việc bằng tay nghề</strong><small>Doanh nghiệp tiếp nhận người tốt nghiệp đạt yêu cầu.</small></div></li>
          </ol>
          <a class="story-next" href="#tu-kiem-tra"><span>↓</span>Tự kiểm tra điều kiện trong 30 giây</a>
        </div>
      </div>
    </section>

${selfCheck}
    <section class="home-proof" id="thuc-te" aria-labelledby="home-proof-title"><span id="nguoi-that-viec-that" aria-hidden="true"></span>
      <div class="container">
        <div class="home-proof__head"><div><p class="eyebrow">Xem thực tế trước khi quyết định</p><h2 id="home-proof-title">Một video và một câu chuyện để hình dung rõ nghề</h2></div><p>Phần này giúp người lao động hiểu môi trường, nhịp sống và tinh thần tổ đội mà không phải đọc thêm nhiều đoạn giới thiệu.</p></div>
        <div class="home-proof__grid home-proof__grid--simple">
          <article class="home-proof__video">
            <div class="video-frame" data-featured-video-host><button class="home-video-facade" type="button" data-featured-video-facade data-video-id="ts41cqu7r9c" data-video-title="Hành trình lập nghiệp cùng nghề mỏ" aria-label="Phát video hành trình lập nghiệp cùng nghề mỏ"><img src="https://i.ytimg.com/vi/ts41cqu7r9c/hqdefault.jpg" alt="Hình xem trước video câu chuyện công nhân ngành Than" loading="lazy" decoding="async" width="480" height="360"><span class="home-video-facade__play" aria-hidden="true">▶</span><span class="home-video-facade__label">Bấm để xem phóng sự</span></button></div>
            <div class="home-proof__video-copy"><small>VIDEO NGƯỜI LAO ĐỘNG</small><h3>Hành trình lập nghiệp cùng nghề mỏ</h3><p>Nghe người lao động chia sẻ về công việc và cuộc sống tại vùng mỏ Quảng Ninh.</p></div>
          </article>
          <a class="home-proof__story" href="/cau-chuyen-cong-nhan/">
            <img src="/assets/vinacomin-tho-mo-ham-lo-1200.webp" alt="Nhóm thợ mỏ TKV trao đổi phương án công việc trong hầm lò" loading="lazy" decoding="async" width="1200" height="800">
            <span><small>CÂU CHUYỆN NGƯỜI THỢ</small><strong>Làm nghề bằng kỹ năng và tinh thần tổ đội</strong><em>Mỗi ca làm có phân công, phối hợp và yêu cầu an toàn rõ ràng; người mới được học trước khi làm.</em><b>Xem câu chuyện công nhân →</b></span>
          </a>
        </div>
      </div>
    </section>

    <section class="section process-section" id="quy-trinh" aria-labelledby="process-title">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow">Hành trình tư vấn</p><h2 id="process-title">Từ quan tâm đến ngày nhập học</h2></div><p>Mỗi bước chỉ làm khi bước trước đã rõ. Đăng ký ban đầu chưa cần gửi ảnh CCCD hay hồ sơ.</p></div>
        <ol class="process-grid process-grid--four">
          <li><span>1</span><h3>Gửi thông tin</h3><p>Năm sinh, chiều cao/cân nặng, sức khỏe và tỉnh đang sống.</p></li>
          <li><span>2</span><h3>Nhận tư vấn</h3><p>Đối chiếu điều kiện, nghề học, chế độ và công việc.</p></li>
          <li><span>3</span><h3>Chuẩn bị hồ sơ</h3><p>Chỉ chuẩn bị giấy tờ sau khi đã được hướng dẫn.</p></li>
          <li><span>4</span><h3>Xác nhận nhập học</h3><p>Đến Quang Hanh đúng lịch tiếp nhận đã xác nhận.</p></li>
        </ol>
      </div>
    </section>

    <section class="worker-address" id="dia-diem">
      <div class="container worker-address__grid">
        <article class="worker-address__card"><small>Nơi học và nhập học</small><h2>Khu C – Phân hiệu Đào tạo Cẩm Phả</h2><p>Phường Quang Hanh, tỉnh Quảng Ninh.</p><div class="worker-address__note">Chỉ đến sau khi được xác nhận lịch tiếp nhận cụ thể.</div></article>
        <article class="worker-address__card"><small>Đầu mối tư vấn</small><h3>Thầy Linh · 096 304 8585</h3><p>Số 8 Chu Văn An, phường Hạ Long, tỉnh Quảng Ninh.</p><div class="button-row"><a class="button button-outline" href="${zaloHref}" target="_blank" rel="noopener" data-contact="zalo" data-context="home-address">Nhắn Zalo</a><a class="button button-outline" href="tel:+84963048585" data-contact="phone" data-context="home-address">Gọi điện</a></div></article>
      </div>
    </section>

    <section class="worker-faq" id="faq">
      <div class="container worker-faq__grid">
        <div><p class="eyebrow">Giải đáp ngắn gọn</p><h2>Câu hỏi thường gặp</h2></div>
        <div>
          <details open><summary>Chưa từng làm mỏ có đăng ký được không?</summary><p>Có. Người chưa có nghề được đào tạo trước khi doanh nghiệp tiếp nhận.</p></details>
          <details><summary>Đăng ký ban đầu có phải nộp hồ sơ không?</summary><p>Không. Trước hết chỉ cần gửi thông tin cơ bản để kiểm tra điều kiện.</p></details>
          <details><summary>Chưa có bằng cấp 2 hoặc cấp 3 thì sao?</summary><p>Vẫn có thể đăng ký để được hướng dẫn đối chiếu theo hệ đào tạo.</p></details>
          <details><summary>Khi nào tôi mới cần lên Quảng Ninh?</summary><p>Chỉ lên đường sau khi đã được tư vấn, xác nhận phù hợp và có lịch tiếp nhận cụ thể.</p></details>
        </div>
      </div>
    </section>

    <section class="worker-register" id="tu-van" aria-labelledby="consult-title"><span id="dang-ky" aria-hidden="true"></span>
      <div class="container worker-register__grid">
        <div><p class="eyebrow">Bước tiếp theo</p><h2 id="consult-title">Chọn cách thuận tiện nhất để được tư vấn</h2><p>Chưa cần hồ sơ. Nếu chưa chắc mình phù hợp, cứ gửi thông tin để được kiểm tra trước.</p><div class="worker-register__promise">Cần chuẩn bị: năm sinh · chiều cao/cân nặng · sức khỏe · tỉnh đang sinh sống</div></div>
        <div class="contact-choice-grid" aria-label="Bốn cách đăng ký và liên hệ">
          <a class="contact-choice contact-choice--form" href="${applicationHref}" data-contact="application" data-context="home-register"><small>ĐỂ LẠI THÔNG TIN</small><strong data-application-resume-label>Điền biểu mẫu 1 phút</strong><span>Chủ động gửi khi thuận tiện</span></a>
          <a class="contact-choice contact-choice--zalo" href="${zaloHref}" target="_blank" rel="noopener" data-contact="zalo" data-context="home-register"><small>NHẮN TIN</small><strong>Zalo 096 304 8585</strong><span>Gửi thông tin để kiểm tra</span></a>
          <a class="contact-choice contact-choice--messenger" href="${messengerHref}" target="_blank" rel="noopener" data-contact="messenger" data-context="home-register"><small>NHẮN TIN</small><strong>Messenger Thầy Linh</strong><span>Hỏi trực tiếp trường hợp của mình</span></a>
          <a class="contact-choice contact-choice--phone" href="tel:+84963048585" data-contact="phone" data-context="home-register"><small>GỌI TRỰC TIẾP</small><strong>096 304 8585</strong><span>Trao đổi nhanh với Thầy Linh</span></a>
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
const structuredDataBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi)];
if (structuredDataBlocks.length !== 1) throw new Error(`Worker-first homepage expected one JSON-LD block, got ${structuredDataBlocks.length}`);
html = html.replace(structuredDataBlocks[0][0], structuredDataMarkup);
html = replaceOnce(html, "<title>Tuyển thợ mỏ tháng 8/2026 | Điều kiện, quyền lợi, hồ sơ</title>", "<title>Tuyển thợ mỏ tháng 8/2026: học nghề đến nhận việc | Thầy Linh</title>", "Homepage title");
html = replaceOnce(html, '<meta name="description" content="Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg: xem nhanh điều kiện, hồ sơ, nơi học, chế độ ăn ở và cam kết 20–25 triệu/tháng khi hoàn thành định mức lao động.">', '<meta name="description" content="Tuyển thợ mỏ tháng 8/2026: nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg; học nghề tại Quảng Ninh, nhận việc, thu nhập 20–25 triệu/tháng khi hoàn thành định mức lao động.">', "Homepage description");
html = replaceOnce(html, '<meta property="og:title" content="Tuyển thợ mỏ tháng 8/2026 – xem đủ thông tin trong 2 phút">', '<meta property="og:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', "Homepage Open Graph title");
html = replaceOnce(html, '<meta property="og:description" content="Điều kiện, quyền lợi, hồ sơ, địa điểm nhập học và cách đăng ký được trình bày ngắn gọn cho người lao động.">', '<meta property="og:description" content="Một hành trình rõ ràng từ kiểm tra điều kiện, học nghề tại Quang Hanh đến nhận việc ngành Than ở Quảng Ninh.">', "Homepage Open Graph description");
html = replaceOnce(html, '<meta name="twitter:title" content="Tuyển thợ mỏ tháng 8/2026 – thông tin dành cho người lao động">', '<meta name="twitter:title" content="Tuyển thợ mỏ tháng 8/2026 – từ học nghề đến nhận việc">', "Homepage Twitter title");
html = replaceOnce(html, '<meta name="twitter:description" content="Xem nhanh điều kiện, quyền lợi, hồ sơ, địa điểm và cách đăng ký học nghề mỏ tại Quảng Ninh.">', '<meta name="twitter:description" content="Xem hành trình học nghề mỏ tại Quang Hanh, quyền lợi, hồ sơ và việc làm ngành Than tại Quảng Ninh.">', "Homepage Twitter description");
html = replaceOnce(html, "</head>", '  <link rel="stylesheet" href="/worker-info-finder.css?v=2">\n  <link rel="stylesheet" href="/home-rich-media.css?v=2">\n</head>', "Worker self-check and consultation funnel stylesheets");
html = replaceOnce(html, '<button class="menu-toggle" type="button"', `${headerSearch}\n      <button class="menu-toggle" type="button"`, "Header search button");
html = replaceOnce(html, 'href="/mobile-ux.css?v=5"', 'href="/mobile-ux.css?v=6"', "Homepage mobile UX stylesheet version");
html = replaceOnce(html, 'src="/mobile-ux.js?v=4"', 'src="/mobile-ux.js?v=8"', "Homepage mobile UX version");
html = html.replace(/<nav class="v4-primary-nav"[\s\S]*?<\/nav>\s*/i, "");
const mainBlocks = html.match(/<main id="noi-dung"[\s\S]*?<\/main>/gi) || [];
if (mainBlocks.length !== 1) throw new Error(`Worker-first homepage expected one main block, got ${mainBlocks.length}`);
html = html.replace(mainBlocks[0], simpleMain);

const mainNav = `<nav class="main-nav" id="main-nav" data-nav aria-label="Điều hướng chính">
        <a href="#thong-tin">Thông tin</a><a href="#tu-kiem-tra">Tự kiểm tra</a><a href="#thuc-te">Xem thực tế</a><a href="#quy-trinh">Hành trình</a><a href="#tu-van">Tư vấn</a>
      </nav>`;
const mainNavBlocks = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/gi) || [];
if (mainNavBlocks.length !== 1) throw new Error(`Worker-first homepage expected one main navigation, got ${mainNavBlocks.length}`);
html = html.replace(mainNavBlocks[0], mainNav);
html = html.replace(/<a class="header-cta"[\s\S]*?<\/a>/i, '<a class="header-cta" href="#tu-van">Nhận tư vấn</a>');

const staticMobile = `<nav class="mobile-contact" aria-label="Liên hệ nhanh trên điện thoại">
    <a href="${applicationHref}" data-contact="application" data-context="home-mobile"><strong>Đăng ký</strong><span data-application-resume-label>Biểu mẫu</span></a>
    <a href="${zaloHref}" target="_blank" rel="noopener" data-contact="zalo" data-context="home-mobile"><strong>Zalo</strong><span>Nhắn tin</span></a>
    <a href="${messengerHref}" target="_blank" rel="noopener" data-contact="messenger" data-context="home-mobile"><strong>Messenger</strong><span>Nhắn tin</span></a>
    <a href="tel:+84963048585" data-contact="phone" data-context="home-mobile"><strong>Gọi</strong><span>096 304 8585</span></a>
  </nav>`;
const mobileBlocks = html.match(/<nav class="mobile-contact"[\s\S]*?<\/nav>/gi) || [];
if (mobileBlocks.length !== 1) throw new Error(`Worker-first homepage expected one static mobile contact bar, got ${mobileBlocks.length}`);
html = html.replace(mobileBlocks[0], staticMobile);
html = replaceOnce(html, "</body>", '  <script src="/worker-info-finder.js?v=2" defer></script>\n</body>', "Worker self-check script");

for (const required of ['class="home-funnel"', 'class="consultation-path"', 'id="thong-tin"', 'id="tu-kiem-tra"', 'id="thuc-te"', 'id="quy-trinh"', 'id="tu-van"', 'class="home-proof"', 'data-featured-video-facade', 'id="learning-story-title"', '/assets/vinacomin-hoc-sinh-trai-nghiem-mo.webp', "data-open-site-search", "data-worker-check-form", "data-open-worker-brief", 'id="che-do-ho-so"', 'id="thoi-gian-hoc"', 'id="ho-tro-hoc-nghe"', 'id="noi-lam-viec"', 'class="contact-choice-grid"', 'data-contact="application"', 'data-contact="zalo"', 'data-contact="messenger"', 'data-contact="phone"']) {
  if (!html.includes(required)) throw new Error(`Worker-first homepage is missing generated feature: ${required}`);
}
if (html.includes('/assets/vinacomin-dao-tao-tho-lo.webp')) throw new Error("Worker-first homepage still contains the rejected podium image");
for (const removed of ['class="worker-quick"', 'class="worker-recommended"', 'class="home-gallery"', 'class="v5-intent-hub"', 'class="v4-final-conversion"', 'class="v4-five-paths"', 'data-worker-province-select', 'data-province-video-facade']) {
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
  visibleMediaItems: 3,
  contactChannels: ["form", "zalo", "messenger", "phone"],
}, null, 2));
