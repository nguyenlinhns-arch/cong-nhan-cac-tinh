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
      name: "Tuyển thợ mỏ tháng 8/2026: điều kiện, quyền lợi và hồ sơ",
      description: "Cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động. Căn cước công dân bản gốc; Giấy khai sinh; Bằng THCS hoặc THPT nếu có. Chưa có bằng vẫn có thể đăng ký để được hướng dẫn đối chiếu theo hệ đào tạo. Địa chỉ liên hệ: Số 8 Chu Văn An, phường Hạ Long, Quảng Ninh. Địa điểm nhập học: Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh.",
      dateModified: "2026-08-02",
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

const latestArticle = [...communityArticles].sort((left, right) => new Date(right.published) - new Date(left.published))[0];
if (!latestArticle) throw new Error("Worker-first homepage requires at least one community article");
const latestPublished = new Date(latestArticle.published);
const latestDate = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Bangkok",
}).format(latestPublished);
const latestArticleBlock = `    <section class="worker-latest" aria-labelledby="worker-latest-title">
      <div class="container">
        <a class="worker-latest__card" href="/${esc(latestArticle.urlPath)}/">
          <img src="${esc(latestArticle.image)}" alt="${esc(latestArticle.imageAlt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="800" height="368">
          <span class="worker-latest__body"><small>Bài mới · ${esc(latestDate)}</small><strong id="worker-latest-title">${esc(latestArticle.title)}</strong><span>${esc(latestArticle.lead)}</span><b>Đọc bài viết →</b></span>
        </a>
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
html = replaceOnce(html, "</head>", '  <link rel="stylesheet" href="/worker-info-finder.css?v=2">\n</head>', "Worker information finder stylesheet");
html = replaceOnce(html, '<button class="menu-toggle" type="button"', `${headerSearch}\n      <button class="menu-toggle" type="button"`, "Header search button");
html = replaceOnce(html, 'href="#dieu-kien">Tự kiểm tra điều kiện</a>', 'href="#tu-kiem-tra">Tự kiểm tra điều kiện</a>', "Hero self-check link");
html = replaceOnce(html, '<span data-application-resume-label>Đăng ký nhanh</span>', '<span data-application-resume-label>Đăng ký – chưa cần hồ sơ</span>', "Hero application reassurance");
html = replaceOnce(html, 'href="#dieu-kien"><b>01</b>', 'href="#tu-kiem-tra"><b>01</b>', "Quick self-check link");
const quickNavigation = html.match(/<nav class="worker-quick__grid"[\s\S]*?<\/nav>/i);
if (!quickNavigation || html.match(/<nav class="worker-quick__grid"/gi)?.length !== 1) throw new Error("Worker-first homepage expected one quick navigation block");
html = html.replace(quickNavigation[0], `${quickNavigation[0]}\n${finder.trimEnd()}`);
html = replaceOnce(html, '    <section class="worker-summary" id="dieu-kien">', '    <section class="worker-summary" id="dieu-kien"><span id="che-do-ho-so" aria-hidden="true"></span>', "Summary compatibility anchor");
html = replaceOnce(html, '<article class="worker-fact"><span>03</span><h3>Thời gian học nghề</h3>', '<article class="worker-fact" id="thoi-gian-hoc"><span>03</span><h3>Thời gian học nghề</h3>', "Training duration anchor");
html = replaceOnce(html, '<article class="worker-fact" id="thoi-gian-hoc"><span>03</span><h3>Thời gian học nghề</h3><p>Nghề khai thác mỏ và xây dựng mỏ được đào tạo trong khoảng 2–3 tháng. Người chưa có kinh nghiệm được học từ nền tảng.</p></article>', '<article class="worker-fact" id="thoi-gian-hoc"><span>03</span><h3>Thời gian học nghề</h3><ul><li>Khai thác mỏ và xây dựng mỏ: 2–3 tháng</li><li>Cơ điện mỏ: 10 tháng</li></ul><p>Người chưa có kinh nghiệm được đào tạo từ nền tảng.</p></article>', "Training duration by trade");
html = replaceOnce(html, '<article class="worker-fact"><span>04</span><h3>Hỗ trợ trong thời gian học</h3>', '<article class="worker-fact" id="ho-tro-hoc-nghe"><span>04</span><h3>Hỗ trợ trong thời gian học</h3>', "Training support anchor");
html = replaceOnce(html, '<article class="worker-fact"><span>06</span><h3>Việc làm sau đào tạo</h3>', '<article class="worker-fact" id="noi-lam-viec"><span>06</span><h3>Việc làm sau đào tạo</h3>', "Workplace anchor");
html = replaceOnce(html, '    <section class="section process-section" id="quy-trinh">', `${selfCheck}    <section class="section process-section" id="quy-trinh">`, "Self-check after essential summary");
html = replaceOnce(html, '    <section class="worker-more" aria-labelledby="worker-more-title">', `${latestArticleBlock}    <section class="worker-more" aria-labelledby="worker-more-title">`, "Latest community article");
html = replaceOnce(html, '<section class="worker-more" aria-labelledby="worker-more-title">', '<section class="worker-more" aria-labelledby="worker-more-title"><span id="theo-tinh" aria-hidden="true"></span>', "Province compatibility anchor");
html = replaceOnce(html, 'src="/mobile-ux.js?v=4"', 'src="/mobile-ux.js?v=7"', "Homepage mobile UX version");
html = replaceOnce(html, "</body>", '  <script src="/worker-info-finder.js?v=2" defer></script>\n</body>', "Worker information finder script");

for (const required of ['id="tu-kiem-tra"', "data-open-site-search", "data-worker-province-select", "data-worker-check-form", 'id="che-do-ho-so"', 'id="thoi-gian-hoc"', 'id="ho-tro-hoc-nghe"', 'id="noi-lam-viec"', 'id="theo-tinh"', 'class="worker-latest__card"']) {
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
  latestArticle: latestArticle.slug,
  trackedApplicationLinks: trackedApplicationLinks.length,
}, null, 2));
