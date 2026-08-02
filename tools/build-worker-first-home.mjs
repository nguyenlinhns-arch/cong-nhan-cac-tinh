import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { communityArticles } from "./community-articles.mjs";

const sourceDir = path.resolve("content", "home-worker-first");
const siteRoot = path.resolve("tuyen-tho-mo");
const target = path.join(siteRoot, "index.html");
const provinceFile = path.join(siteRoot, "data", "provinces-2026.json");
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

const provinceData = JSON.parse(fs.readFileSync(provinceFile, "utf8"));
const provinces = Array.isArray(provinceData.provinces) ? provinceData.provinces : [];
if (provinces.length !== 26) throw new Error(`Worker information finder expected 26 provinces, got ${provinces.length}`);

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

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

const regions = [...new Set(provinces.map((province) => province.region))];
const provinceOptions = [
  '<option value="">Chọn tỉnh đang sinh sống</option>',
  ...regions.flatMap((region) => [
    `<optgroup label="${esc(region)}">`,
    ...provinces.filter((province) => province.region === region).map((province) => {
      const aliases = Array.isArray(province.aliases) && province.aliases.length
        ? ` · gồm ${province.aliases.join(", ")}`
        : "";
      return `<option value="${esc(province.slug)}" data-province-slug="${esc(province.slug)}" data-province-name="${esc(province.name)}">${esc(province.name + aliases)}</option>`;
    }),
    "</optgroup>",
  ]),
].join("");

const trackedApplicationLinks = [
  ["home-header", "header"],
  ["home-hero", "hero"],
  ["home-register", "register"],
  ["home-mobile", "mobile"],
];

const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
const headerSearch = `<button class="worker-header-search" type="button" data-open-site-search data-worker-search data-context="header" aria-haspopup="dialog" aria-label="Tìm thông tin trên website">${searchIcon}<span class="sr-only">Tìm thông tin</span></button>`;
const heroBriefButton = '<button class="button button-brief" type="button" data-open-worker-brief data-worker-shortcut="brief" aria-haspopup="dialog">Tóm tắt 30 giây</button>';
const finder = `      <div class="worker-find" aria-label="Công cụ tìm thông tin nhanh">
        <button class="worker-find__search" type="button" data-open-site-search data-worker-search data-context="quick-finder" aria-haspopup="dialog">
          <span class="worker-find__search-icon">${searchIcon}</span>
          <span><strong>Tìm trong toàn bộ website</strong><small>Nhập “hồ sơ”, “thu nhập”, “sức khỏe”, tên nghề hoặc tên tỉnh…</small></span>
        </button>
        <div class="worker-find__province">
          <label for="worker-province-select">Tìm thông tin theo tỉnh</label>
          <div class="worker-find__province-row">
            <select id="worker-province-select" data-worker-province-select>${provinceOptions}</select>
            <a class="worker-find__province-go" href="/viec-lam-nganh-than/" data-worker-province-go>Xem danh sách tỉnh</a>
          </div>
          <p>Không thấy tỉnh phù hợp? <a href="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=worker_find_2026&amp;utm_content=province_other#dang-ky" data-contact="application" data-context="worker-province-other">Đăng ký theo biểu mẫu chung</a>.</p>
        </div>
      </div>
`;
const journeyRoadmap = `    <section class="journey-intro" aria-labelledby="home-journey-title">
      <div class="container">
        <div class="journey-intro__head">
          <div><p class="eyebrow">Hành trình của người lao động</p><h2 id="home-journey-title">Từ một cuộc gọi ở quê nhà đến ngày nhận việc tại Quảng Ninh</h2></div>
          <p>Mỗi chặng đều có thông tin để kiểm chứng và người hướng dẫn. Bấm vào chặng mình đang quan tâm để xem ngay, không phải tự tìm giữa hàng chục bài viết.</p>
        </div>
        <nav class="journey-list" aria-label="Năm chặng từ đăng ký đến nhận việc">
          <a href="#tu-kiem-tra"><small>CHẶNG 01</small><strong>Kiểm tra mình có phù hợp</strong><span>Tuổi, chiều cao, cân nặng và sức khỏe.</span></a>
          <a href="/hoc-nghe-mo-tai-quang-ninh/"><small>CHẶNG 02</small><strong>Chọn nghề và hiểu nơi học</strong><span>Khai thác mỏ, xây dựng mỏ hoặc cơ điện mỏ.</span></a>
          <a href="/ho-so-nhap-hoc/"><small>CHẶNG 03</small><strong>Chuẩn bị hồ sơ, lịch nhập học</strong><span>Chỉ lên đường sau khi đã được xác nhận lịch.</span></a>
          <a href="/thu-nhap-an-o-ho-tro/"><small>CHẶNG 04</small><strong>Học nghề và ổn định ăn ở</strong><span>Miễn kinh phí đào tạo, ăn ở và hỗ trợ trong thời gian học.</span></a>
          <a href="/cau-chuyen-cong-nhan/"><small>CHẶNG 05</small><strong>Nhận việc, sống bằng tay nghề</strong><span>Xem người thật, công việc thật và con đường phát triển trong ngành Than.</span></a>
        </nav>
      </div>
    </section>

`;
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
const learningStory = `    <section class="learning-story section" aria-labelledby="learning-story-title">
      <div class="container learning-story__grid">
        <figure class="learning-story__media">
          <img src="/assets/vinacomin-dao-tao-tho-lo.webp" alt="Học viên nghề mỏ thực hành kỹ năng trước khi vào làm việc" loading="lazy" decoding="async" width="960" height="640">
          <figcaption>Học nghề gắn với thực hành và kỷ luật an toàn trước khi vào sản xuất.</figcaption>
        </figure>
        <div class="learning-story__copy">
          <p class="eyebrow">Không phải tự xoay xở khi rời quê</p>
          <h2 id="learning-story-title">Có một lộ trình để người mới từng bước trở thành thợ mỏ</h2>
          <p>Người chưa biết nghề được đào tạo từ nền tảng. Từ ngày nhập học đến khi doanh nghiệp tiếp nhận, từng bước đều có quy trình và đầu mối hướng dẫn rõ ràng.</p>
          <ol class="learning-story__steps">
            <li><span>01</span><div><strong>Đến đúng lịch, đúng nơi tiếp nhận</strong><small>Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh.</small></div></li>
            <li><span>02</span><div><strong>Học lý thuyết, thực hành và an toàn</strong><small>Người mới được chuẩn bị kỹ năng trước khi vào môi trường sản xuất.</small></div></li>
            <li><span>03</span><div><strong>Ổn định ăn ở trong thời gian học</strong><small>Ba bữa mỗi ngày, ký túc xá và hỗ trợ 7,5 triệu đồng theo chính sách.</small></div></li>
            <li><span>04</span><div><strong>Tốt nghiệp, được tiếp nhận vào làm việc</strong><small>Làm việc tại doanh nghiệp ngành Than ở Quảng Ninh và phát triển bằng tay nghề.</small></div></li>
          </ol>
          <a class="story-next" href="#quy-trinh"><span>↓</span>Xem 5 bước đăng ký và nhập học</a>
        </div>
      </div>
    </section>

`;

const homeRecommendedSlugs = [
  "than-thong-nhat-tuyen-sinh-nghe-mo-lai-chau-2026",
  "hai-lang-phoi-hop-dao-tao-viec-lam-nganh-than",
  "dam-ha-than-thong-nhat-dao-tao-viec-lam-2026",
];
const homeRecommendedArticles = homeRecommendedSlugs.map((slug) => communityArticles.find((article) => article.slug === slug));
const missingRecommended = homeRecommendedSlugs.filter((slug, index) => !homeRecommendedArticles[index]);
if (missingRecommended.length) throw new Error(`Worker-first homepage is missing recommended articles: ${missingRecommended.join(", ")}`);

const displayDate = (published) => new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Bangkok",
}).format(new Date(published));
const recommendedCards = homeRecommendedArticles.map((article, index) => {
  const primary = index === 0;
  return `          <a class="worker-recommended__card${primary ? " worker-recommended__card--lead" : ""}" href="/${esc(article.urlPath)}/" data-home-recommended="${esc(article.slug)}">
            <img src="${esc(article.image)}" alt="${esc(article.imageAlt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="${primary ? 800 : 320}" height="${primary ? 450 : 210}">
            <span class="worker-recommended__body"><small>${primary ? "Nên đọc trước" : `Tư liệu · ${esc(displayDate(article.published))}`}</small><strong>${esc(article.title)}</strong><span>${esc(article.lead)}</span><b>Đọc bài viết →</b></span>
          </a>`;
}).join("\n");
const recommendedArticleBlock = `    <section class="worker-recommended" aria-labelledby="worker-recommended-title">
      <div class="container">
        <div class="worker-recommended__head">
          <div><p class="eyebrow">Đọc thêm để tin nghề hơn</p><h2 id="worker-recommended-title">Ba bài nên xem trước khi quyết định đi học nghề mỏ</h2></div>
          <p>Ưu tiên các bài có liên quan trực tiếp tới tư vấn tuyển sinh, đào tạo và việc làm; tin an sinh mới vẫn nằm trong chuyên mục Tin ngành Than.</p>
        </div>
        <div class="worker-recommended__grid">
${recommendedCards}
        </div>
      </div>
    </section>

`;

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
html = replaceOnce(html, '<p class="eyebrow">Tuyển thợ mỏ tháng 8/2026 · Quảng Ninh</p>', '<p class="eyebrow">Tuyển thợ mỏ tháng 8/2026 · Học và làm việc tại Quảng Ninh</p>', "Homepage hero eyebrow");
html = replaceOnce(html, '<h1>Xem đủ thông tin để đăng ký trong 2 phút</h1>', '<h1>Học nghề mỏ, nhận việc tại Quảng Ninh: xem trọn hành trình trước khi đăng ký</h1>', "Homepage hero heading");
html = replaceOnce(html, '<p class="hero-lead">Nam từ 18–40 tuổi, cao từ 1m53, nặng từ 47kg và có sức khỏe tốt. Người chưa có nghề được đào tạo trước khi vào làm việc.</p>', '<p class="hero-lead">Từ kiểm tra điều kiện, học nghề tại Quang Hanh đến ngày doanh nghiệp tiếp nhận: mọi thông tin quan trọng được trình bày theo đúng bước người lao động sẽ trải qua.</p>', "Homepage hero lead");
html = replaceOnce(html, "</head>", '  <link rel="stylesheet" href="/worker-info-finder.css?v=2">\n</head>', "Worker information finder stylesheet");
html = replaceOnce(html, '<button class="menu-toggle" type="button"', `${headerSearch}\n      <button class="menu-toggle" type="button"`, "Header search button");
html = replaceOnce(html, 'href="#dieu-kien">Tự kiểm tra điều kiện</a>', 'href="#tu-kiem-tra">Tự kiểm tra điều kiện</a>', "Hero self-check link");
html = replaceOnce(html, '<a class="button button-zalo" href="#tu-kiem-tra">Tự kiểm tra điều kiện</a>', `<a class="button button-zalo" href="#tu-kiem-tra">Tự kiểm tra điều kiện</a>\n            ${heroBriefButton}`, "Hero 30-second brief button");
html = replaceOnce(html, '<span data-application-resume-label>Đăng ký nhanh</span>', '<span data-application-resume-label>Đăng ký – chưa cần hồ sơ</span>', "Hero application reassurance");
html = replaceOnce(html, 'href="#dieu-kien"><b>01</b>', 'href="#tu-kiem-tra"><b>01</b>', "Quick self-check link");
html = replaceOnce(html, '    <section class="worker-quick" aria-labelledby="worker-quick-title">', `${journeyRoadmap}    <section class="worker-quick" aria-labelledby="worker-quick-title">`, "Worker journey roadmap");
const quickNavigation = html.match(/<nav class="worker-quick__grid"[\s\S]*?<\/nav>/i);
if (!quickNavigation || html.match(/<nav class="worker-quick__grid"/gi)?.length !== 1) throw new Error("Worker-first homepage expected one quick navigation block");
html = html.replace(quickNavigation[0], `${quickNavigation[0]}\n${finder.trimEnd()}`);
html = replaceOnce(html, '    <section class="worker-summary" id="dieu-kien">', '    <section class="worker-summary" id="dieu-kien"><span id="che-do-ho-so" aria-hidden="true"></span>', "Summary compatibility anchor");
html = replaceOnce(html, '<article class="worker-fact"><span>03</span><h3>Thời gian học nghề</h3>', '<article class="worker-fact" id="thoi-gian-hoc"><span>03</span><h3>Thời gian học nghề</h3>', "Training duration anchor");
html = replaceOnce(html, '<article class="worker-fact" id="thoi-gian-hoc"><span>03</span><h3>Thời gian học nghề</h3><p>Nghề khai thác mỏ và xây dựng mỏ được đào tạo trong khoảng 2–3 tháng. Người chưa có kinh nghiệm được học từ nền tảng.</p></article>', '<article class="worker-fact" id="thoi-gian-hoc"><span>03</span><h3>Thời gian học nghề</h3><ul><li>Khai thác mỏ và xây dựng mỏ: 2–3 tháng</li><li>Cơ điện mỏ: 10 tháng</li></ul><p>Người chưa có kinh nghiệm được đào tạo từ nền tảng.</p></article>', "Training duration by trade");
html = replaceOnce(html, '<article class="worker-fact"><span>04</span><h3>Hỗ trợ trong thời gian học</h3>', '<article class="worker-fact" id="ho-tro-hoc-nghe"><span>04</span><h3>Hỗ trợ trong thời gian học</h3>', "Training support anchor");
html = replaceOnce(html, '<article class="worker-fact"><span>06</span><h3>Việc làm sau đào tạo</h3>', '<article class="worker-fact" id="noi-lam-viec"><span>06</span><h3>Việc làm sau đào tạo</h3>', "Workplace anchor");
html = replaceOnce(html, '    <section class="section process-section" id="quy-trinh">', `${selfCheck}${learningStory}    <section class="section process-section" id="quy-trinh">`, "Self-check and learning journey after essential summary");
html = replaceOnce(html, '    <section class="worker-more" aria-labelledby="worker-more-title">', `${recommendedArticleBlock}    <section class="worker-more" aria-labelledby="worker-more-title">`, "Recommended worker-read articles");
html = replaceOnce(html, '<section class="worker-more" aria-labelledby="worker-more-title">', '<section class="worker-more" aria-labelledby="worker-more-title"><span id="theo-tinh" aria-hidden="true"></span>', "Province compatibility anchor");
html = replaceOnce(html, 'href="/mobile-ux.css?v=5"', 'href="/mobile-ux.css?v=6"', "Homepage mobile UX stylesheet version");
html = replaceOnce(html, 'src="/mobile-ux.js?v=4"', 'src="/mobile-ux.js?v=8"', "Homepage mobile UX version");
html = replaceOnce(html, "</body>", '  <script src="/worker-info-finder.js?v=2" defer></script>\n</body>', "Worker information finder script");

for (const required of ['id="home-journey-title"', 'class="journey-list"', 'id="learning-story-title"', 'id="tu-kiem-tra"', "data-open-site-search", "data-worker-province-select", "data-worker-check-form", "data-open-worker-brief", 'id="che-do-ho-so"', 'id="thoi-gian-hoc"', 'id="ho-tro-hoc-nghe"', 'id="noi-lam-viec"', 'id="theo-tinh"', 'class="worker-recommended__grid"', 'data-home-recommended="than-thong-nhat-tuyen-sinh-nghe-mo-lai-chau-2026"']) {
  if (!html.includes(required)) throw new Error(`Worker-first homepage is missing generated feature: ${required}`);
}

for (const [context, content] of trackedApplicationLinks) {
  const marker = `href="viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky" data-contact="application" data-context="${context}"`;
  const trackedHref = `href="viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=home_to_application_2026&amp;utm_content=home_${content}#dang-ky" data-contact="application" data-context="${context}"`;
  if (!html.includes(marker)) throw new Error(`Worker-first homepage is missing tracked application link: ${context}`);
  html = html.replace(marker, trackedHref);
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
  searchEntryPoints: 2,
  selfCheckQuestions: 4,
  provinceOptions: provinces.length,
  recommendedArticles: homeRecommendedArticles.map((article) => article.slug),
  trackedApplicationLinks: trackedApplicationLinks.length,
}, null, 2));
