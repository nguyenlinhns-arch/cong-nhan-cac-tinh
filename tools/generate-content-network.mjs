import fs from "node:fs";
import path from "node:path";
import {curatedArticles, existingNews} from "./curated-articles.mjs";
import {communityArticles} from "./community-articles.mjs";
import {pressStoryArticles} from "./press-story-articles.mjs";
import {buildRecruitmentAnswers} from "./recruitment-answers.mjs";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const campaign = "lan_toa_nghe_mo_2026";
const provinces = JSON.parse(fs.readFileSync(path.join(root, "data", "provinces-2026.json"), "utf8")).provinces;
const recruitment = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const updatedDate = recruitment.effective_from;
const personId = `${base}/tac-gia/nguyen-tu-linh/#person`;
const organizationId = `${base}/#organization`;
const websiteId = `${base}/#website`;
const editorialPolicyPath = "/nguyen-tac-bien-tap/";
const editorialPolicyUrl = `${base}${editorialPolicyPath}`;
const officialProfiles = [
  "https://www.facebook.com/thaylinhtuyenthomo/",
  "https://www.youtube.com/@ThầyLinh-TuyểnThợMỏ",
  "https://www.tiktok.com/@thaylinhtuyenthomo",
];
const allArticles = [
  ...curatedArticles.map((article) => ({...article, urlPath: `bai-viet/${article.slug}`})),
  ...existingNews,
  ...communityArticles,
  ...pressStoryArticles,
];

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const trackedApply = (content) => `/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=${campaign}&amp;utm_content=${content}#dang-ky`;

function absoluteItemUrl(value = "") {
  const [pathname, fragment] = String(value).split("#", 2);
  const normalized = pathname.replace(/^\/+|\/+$/g, "");
  return `${base}/${normalized ? `${normalized}/` : ""}${fragment ? `#${fragment}` : ""}`;
}

const navItems = [
  ["/thong-tin-tuyen-tho-mo/", "Thông tin chuẩn"],
  ["/viec-lam-nganh-than/", "Việc làm"],
  ["/cam-nang-nghe-mo/", "Cẩm nang"],
  ["/chuyen-nguoi-tho/", "Người thợ"],
  ["/trung-tam-nghe-mo/", "Trung tâm"],
];

function commonSchema({pathName, title, description, type = "CollectionPage", items = []}) {
  const canonical = `${base}${pathName}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: "vi-VN",
        dateModified: updatedDate,
        isPartOf: {"@id": websiteId},
        author: {"@id": personId},
        publisher: {"@id": organizationId},
        publishingPrinciples: editorialPolicyUrl,
        breadcrumb: {"@id": `${canonical}#breadcrumb`},
        ...(items.length ? {mainEntity: {"@id": `${canonical}#items`}} : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {"@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/`},
          {"@type": "ListItem", position: 2, name: title, item: canonical},
        ],
      },
      ...(items.length ? [{
        "@type": "ItemList",
        "@id": `${canonical}#items`,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: absoluteItemUrl(item.urlPath),
        })),
      }] : []),
    ],
  };
}

function header(current) {
  return `<a class="network-skip" href="#noi-dung">Đến nội dung chính</a>
  <header class="network-header"><div class="network-wrap network-header__inner">
    <a class="network-brand" href="/"><img src="/assets/thay-linh-avatar.webp?v=3" alt="" width="44" height="44"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a>
    <nav class="network-nav" aria-label="Trung tâm nghề mỏ">${navItems.map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <a class="network-apply" href="${trackedApply(`header_${current.split("/").filter(Boolean)[0] || "home"}`)}" data-contact="application" data-context="network-header">Ứng tuyển</a>
  </div></header>`;
}

function footer() {
  return `<footer class="network-footer"><div class="network-wrap network-footer__inner">
    <div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Thông tin học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div>
    <div><a href="/thong-tin-tuyen-tho-mo/">Thông tin tuyển đang áp dụng</a><a href="/trung-tam-nghe-mo/">Trung tâm nghề mỏ</a><a href="/viec-lam-nganh-than/">Việc làm theo tỉnh</a><a href="/cam-nang-nghe-mo/">Cẩm nang nhập nghề</a></div>
    <div><a href="/chia-se-thong-tin/">Tạo gói chia sẻ</a><a href="/tac-gia/nguyen-tu-linh/">Người biên soạn</a><a href="/nguyen-tac-bien-tap/">Nguyên tắc biên tập</a><a href="/quyen-rieng.html">Quyền riêng tư</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="network-footer">Zalo 096 304 8585</a></div>
  </div></footer>`;
}

function page({pathName, title, description, eyebrow, heading, lead, body, schema, current = pathName, shareTools = false}) {
  const canonical = `${base}${pathName}`;
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#052f38">
  <title>${esc(title)} | Thầy Linh</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="author" content="Nguyễn Tử Linh">
  <link rel="author" href="/tac-gia/nguyen-tu-linh/">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Tin ngành Than – Thầy Linh" href="${base}/feed.xml">
  <link rel="alternate" type="application/feed+json" title="Tin ngành Than – Thầy Linh" href="${base}/feed.json">
  <meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">
  <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${base}/assets/og-cover-v2.webp"><meta property="og:image:alt" content="Trung tâm thông tin học nghề mỏ và việc làm ngành Than">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${base}/assets/og-cover-v2.webp">
  <link rel="stylesheet" href="/fonts.css?v=1">
  <link rel="stylesheet" href="/content-network.css?v=1"><link rel="stylesheet" href="/mobile-ux.css?v=5">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  ${header(current)}
  <main id="noi-dung">
    <section class="network-hero"><div class="network-wrap network-hero__content"><p class="network-eyebrow">${esc(eyebrow)}</p><h1>${esc(heading)}</h1><p class="network-hero__lead">${esc(lead)}</p><div class="network-actions"><a class="network-button" href="${trackedApply(`hero_${pathName.split("/").filter(Boolean)[0]}`)}" data-contact="application" data-context="network-hero">Kiểm tra điều kiện</a><a class="network-button network-button--secondary" href="/chia-se-thong-tin/">Chia sẻ cơ hội này</a></div></div></section>
    ${body}
  </main>
  ${footer()}
  <script src="/analytics.js?v=5" defer></script><script src="/mobile-ux.js?v=4" defer></script>${shareTools ? '<script src="/share-tools.js?v=1" defer></script>' : ""}
</body>
</html>`;
}

function card(item, label = item.section) {
  return `<article class="network-card"><img src="${esc(item.image || "/assets/og-cover-v2.webp")}" alt="${esc(item.imageAlt || item.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><div class="network-card__body"><small>${esc(label || "Thông tin nghề mỏ")}</small><h2>${esc(item.title)}</h2><p>${esc(item.lead || item.description)}</p><a href="/${item.urlPath}/">Đọc thông tin →</a></div></article>`;
}

function provinceGroups() {
  const groups = Map.groupBy ? Map.groupBy(provinces, (province) => province.region) : provinces.reduce((map, province) => {
    const current = map.get(province.region) || [];
    current.push(province);
    map.set(province.region, current);
    return map;
  }, new Map());
  return [...groups].map(([region, entries]) => `<section class="province-group"><h2>${esc(region)}</h2><div class="province-links">${entries.map((province) => `<a href="/viec-lam-nganh-than/${province.slug}/">${esc(province.name)}</a>`).join("")}</div></section>`).join("");
}

const branchCards = [
  ["Thông tin tuyển đang áp dụng", "Mười lăm câu trả lời trực tiếp về điều kiện, học nghề, hỗ trợ, hồ sơ, địa chỉ và thu nhập tháng 8/2026.", "/thong-tin-tuyen-tho-mo/"],
  ["Việc làm đang tuyển", "Hai nghề mỏ hầm lò, điều kiện và quyền lợi được trình bày theo một nguồn dữ liệu thống nhất.", "/viec-lam-nganh-than/"],
  ["Thông tin theo 26 tỉnh", "Mỗi tỉnh có đường ứng tuyển giữ sẵn địa phương để tư vấn đúng bối cảnh.", "/viec-lam-nganh-than/#theo-tinh"],
  ["Cẩm nang nhập nghề", "Bắt đầu từ điều kiện, sức khỏe, khóa học, hồ sơ và đời sống tại Quảng Ninh.", "/cam-nang-nghe-mo/"],
  ["Chuyện người thợ", "Mười câu chuyện được biên tập từ nguồn báo chí để người lao động nhìn nghề qua trải nghiệm thật.", "/chuyen-nguoi-tho/"],
  ["Kho tin ngành Than", "Sáu mươi mốt bài về nghề, công nghệ, an toàn, phúc lợi và kết nối địa phương.", "/tin-nganh-than/"],
  ["Bộ chia sẻ theo tỉnh", "Tạo sẵn nội dung và liên kết đo nguồn để địa phương, gia đình và người lao động lan tỏa đúng thông tin.", "/chia-se-thong-tin/"],
  ["Nguyên tắc biên tập", "Công khai người chịu trách nhiệm, cách kiểm chứng nguồn, quy tắc cập nhật và cách tiếp nhận đính chính.", editorialPolicyPath],
];

const centralDescription = "Trung tâm thông tin học nghề mỏ, việc làm ngành Than, 26 trang tỉnh, cẩm nang và câu chuyện người thợ; mọi đường dẫn quy về một biểu mẫu ứng tuyển rõ nguồn.";
const centralSchema = commonSchema({
  pathName: "/trung-tam-nghe-mo/",
  title: "Trung tâm nghề mỏ",
  description: centralDescription,
  items: branchCards.map(([title, , url]) => ({title, urlPath: url})),
});
const centralBody = `<div class="network-wrap network-facts"><div><strong>${allArticles.length}</strong><span>bài có nguồn và chủ đề rõ</span></div><div><strong>${provinces.length}</strong><span>điểm vào theo tỉnh</span></div><div><strong>2 nghề</strong><span>đang tiếp nhận năm 2026</span></div><div><strong>1 biểu mẫu</strong><span>giữ tỉnh và nguồn liên hệ</span></div></div>
<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">MỘT TRUNG TÂM, NHIỀU ĐƯỜNG TIẾP CẬN</p><h2>Tìm đúng thông tin theo nhu cầu của từng người lao động</h2></div><p>Mỗi nhánh giải quyết một câu hỏi riêng nhưng dùng chung điều kiện, quyền lợi, đầu mối và hệ đo nguồn.</p></div><div class="network-grid">${branchCards.map(([title, text, href], index) => `<article class="network-card${index === 0 ? " network-card--accent" : ""}"><div class="network-card__body"><small>NHÁNH ${String(index + 1).padStart(2, "0")}</small><h2>${esc(title)}</h2><p>${esc(text)}</p><a href="${href}">Mở nhánh →</a></div></article>`).join("")}</div></div></section>
<section class="network-section network-section--soft"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">THÔNG TIN MỚI</p><h2>Những nội dung nên đọc trước khi đăng ký</h2></div><p>Ưu tiên dữ kiện giúp người lao động tự đối chiếu điều kiện, hiểu quá trình học và hình dung công việc.</p></div><div class="network-grid">${allArticles.slice().sort((a, b) => new Date(b.published) - new Date(a.published)).slice(0, 6).map((article) => card(article)).join("")}</div></div></section>`;
writePage("trung-tam-nghe-mo", page({pathName: "/trung-tam-nghe-mo/", title: "Trung tâm nghề mỏ", description: centralDescription, eyebrow: "TRUNG TÂM THÔNG TIN NGHỀ MỎ", heading: "Từ tìm hiểu nghề đến ứng tuyển trong một mạng thông tin thống nhất", lead: "Tra cứu việc làm, điều kiện, 26 tỉnh, câu chuyện người thợ và nội dung chia sẻ — tất cả dẫn về một đầu mối rõ ràng, có thể đo được nguồn liên hệ.", body: centralBody, schema: centralSchema}));

const currentFactsPath = "/thong-tin-tuyen-tho-mo/";
const currentFactsTitle = "Tuyển thợ mỏ tháng 8/2026: 15 câu hỏi";
const currentFactsDescription = "Thông tin tuyển thợ mỏ tháng 8/2026 đang áp dụng: nam 18–40 tuổi, cao từ 1m53, nặng từ 47 kg, học nghề 2–3 tháng và cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.";
const currentFactsFaq = buildRecruitmentAnswers(recruitment);
const currentFactsCanonical = `${base}${currentFactsPath}`;
const currentFactsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${currentFactsCanonical}#webpage`,
      url: currentFactsCanonical,
      name: currentFactsTitle,
      description: currentFactsDescription,
      inLanguage: "vi-VN",
      datePublished: updatedDate,
      dateModified: updatedDate,
      lastReviewed: updatedDate,
      reviewedBy: {"@id": personId},
      isPartOf: {"@id": websiteId},
      author: {"@id": personId},
      publisher: {"@id": organizationId},
      publishingPrinciples: editorialPolicyUrl,
      citation: {"@type": "CreativeWork", name: recruitment.source_notice},
      mainEntity: {"@id": `${currentFactsCanonical}#faq`},
      breadcrumb: {"@id": `${currentFactsCanonical}#breadcrumb`},
      about: ["Tuyển thợ mỏ", "Học nghề mỏ", "Việc làm ngành Than", "Thợ lò Quảng Ninh"],
    },
    {
      "@type": "FAQPage",
      "@id": `${currentFactsCanonical}#faq`,
      mainEntity: currentFactsFaq.map(({question, answer}) => ({"@type": "Question", name: question, acceptedAnswer: {"@type": "Answer", text: answer}})),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${currentFactsCanonical}#breadcrumb`,
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/`},
        {"@type": "ListItem", position: 2, name: currentFactsTitle, item: currentFactsCanonical},
      ],
    },
  ],
};
const currentFactsBody = `<div class="network-wrap network-facts"><div><strong>${recruitment.criteria.age_min}–${recruitment.criteria.age_max}</strong><span>độ tuổi nam đang tiếp nhận</span></div><div><strong>1m53 · ${recruitment.criteria.weight_min_kg} kg</strong><span>mốc thể lực tối thiểu</span></div><div><strong>${recruitment.training_duration}</strong><span>thời gian học hai nghề</span></div><div><strong class="qualified-income" style="font-size:17px;line-height:1.4">20–25 triệu đồng/tháng khi hoàn thành định mức lao động</strong><span>mức thu nhập được cam kết</span></div></div>
<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">CẬP NHẬT <time datetime="${updatedDate}">${updatedDate.split("-").reverse().join("/")}</time></p><h2>Thông tin đang áp dụng trong tháng 8/2026</h2></div><p>Căn cứ ${esc(recruitment.source_notice)}. Biên soạn và cập nhật bởi <a href="/tac-gia/nguyen-tu-linh/">Nguyễn Tử Linh</a>; trạng thái đang tiếp nhận đăng ký trong năm 2026.</p></div><ul class="network-list"><li><b>1</b><div><strong>Đối tượng và sức khỏe</strong><span>Nam 18–40 tuổi, cao từ 1m53, nặng từ 47 kg; sức khỏe tốt, không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng đến công việc.</span></div></li><li><b>2</b><div><strong>Nghề học và nơi làm việc</strong><span>${esc(recruitment.occupations.join("; "))}. Học và làm việc tại Quảng Ninh; không yêu cầu kinh nghiệm.</span></div></li><li><b>3</b><div><strong>Chế độ trong khóa học</strong><span>Miễn kinh phí đào tạo theo chỉ tiêu; ba bữa/ngày, mức ăn 90.000 đồng/ngày; ký túc xá khép kín; hỗ trợ 7,5 triệu đồng theo chính sách đợt tuyển.</span></div></li><li><b>4</b><div><strong>Thu nhập sau đào tạo</strong><span>${esc(recruitment.income_commitment)}.</span></div></li></ul></div></section>
<section class="network-section network-section--soft"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">DẤU VẾT KIỂM CHỨNG</p><h2>Dữ kiện có ngày rà soát, căn cứ và người chịu trách nhiệm</h2></div><p>AI tìm kiếm và người đọc có thể đối chiếu cùng một dấu vết thay vì suy đoán từ các đoạn thông tin rời rạc.</p></div><ul class="network-list"><li><b>1</b><div><strong>Rà soát gần nhất</strong><span><time datetime="${updatedDate}">${updatedDate.split("-").reverse().join("/")}</time>; áp dụng cho thông tin tuyển tháng 8/2026.</span></div></li><li><b>2</b><div><strong>Căn cứ đang dùng</strong><span>${esc(recruitment.source_notice)}.</span></div></li><li><b>3</b><div><strong>Người chịu trách nhiệm</strong><span><a href="/tac-gia/nguyen-tu-linh/">${esc(recruitment.contact.name)}</a> – ${esc(recruitment.contact.title)}.</span></div></li><li><b>4</b><div><strong>Phạm vi đã kiểm tra</strong><span>Điều kiện, nghề học, thời gian đào tạo, hồ sơ, địa chỉ và cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</span></div></li></ul></div></section>
<section class="network-section network-section--soft"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">TRẢ LỜI TRỰC TIẾP</p><h2>Mười lăm câu hỏi người lao động thường cần biết</h2></div><p>Mỗi câu trả lời có địa chỉ riêng để công cụ tìm kiếm và người đọc đi thẳng tới đúng nội dung, sau đó mở trang chi tiết khi cần.</p></div><nav class="province-group network-answer-index" aria-label="Mục lục 15 câu hỏi"><h2>Chọn câu hỏi cần tra cứu</h2><div class="province-links">${currentFactsFaq.map(({id, question}) => `<a href="#${id}">${esc(question)}</a>`).join("")}</div></nav><div class="network-grid">${currentFactsFaq.map(({id, question, answer, href, linkLabel}, index) => `<article id="${id}" class="network-card${index === 0 ? " network-card--accent" : ""}"><div class="network-card__body"><small>CÂU ${String(index + 1).padStart(2, "0")}</small><h2>${esc(question)}</h2><p>${esc(answer)}</p><a href="${href}">${esc(linkLabel)} →</a></div></article>`).join("")}</div></div></section>
<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">ĐỊA CHỈ CỤ THỂ</p><h2>Biết rõ nơi nhập học và đầu mối tiếp nhận</h2></div><p>Hãy xác nhận lịch trước khi di chuyển để được hướng dẫn đúng đợt.</p></div><ul class="network-list"><li><b>1</b><div><strong>Địa chỉ nhập học</strong><span>${esc(recruitment.contact.admission_address)}.</span></div></li><li><b>2</b><div><strong>Địa chỉ tiếp nhận thông tin</strong><span>${esc(recruitment.contact.address)}.</span></div></li><li><b>3</b><div><strong>Người hướng dẫn</strong><span>${esc(recruitment.contact.name)} – ${esc(recruitment.contact.title)} · Điện thoại/Zalo 096 304 8585.</span></div></li></ul><div class="network-actions"><a class="network-button" href="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/">Xem tin tuyển dụng đầy đủ</a><a class="network-button network-button--outline" href="/bai-viet/ho-so-hoc-nghe-mo-can-gi/">Xem hướng dẫn hồ sơ</a><a class="network-button network-button--outline" href="${editorialPolicyPath}">Cách website kiểm chứng thông tin</a></div></div></section>`;
writePage("thong-tin-tuyen-tho-mo", page({pathName: currentFactsPath, title: currentFactsTitle, description: currentFactsDescription, eyebrow: "THÔNG TIN CHÍNH THỨC ĐANG ÁP DỤNG", heading: "Tuyển thợ mỏ tháng 8/2026: trả lời 15 câu hỏi", lead: "Nam 18–40 tuổi, cao từ 1m53, nặng từ 47 kg; học nghề mỏ 2–3 tháng tại Quảng Ninh và được cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.", body: currentFactsBody, schema: currentFactsSchema}));

const jobsDescription = "Việc làm ngành Than tại Quảng Ninh, hai nghề mỏ hầm lò và 26 trang tư vấn theo tỉnh; nam 18–40 tuổi, cao từ 1m53, nặng từ 47 kg.";
const jobItems = [
  {title: recruitment.occupations[0], urlPath: "viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh"},
  {title: recruitment.occupations[1], urlPath: "viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh"},
  ...provinces.map((province) => ({title: `Việc làm ngành Than cho người ${province.name}`, urlPath: `viec-lam-nganh-than/${province.slug}`})),
];
const jobsBody = `<div class="network-wrap network-facts"><div><strong>18–40</strong><span>độ tuổi nam đang tiếp nhận</span></div><div><strong>1m53</strong><span>chiều cao tối thiểu</span></div><div><strong>47 kg</strong><span>cân nặng tối thiểu</span></div><div><strong>2–3 tháng</strong><span>thời gian học nghề</span></div></div>
<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">VỊ TRÍ ĐANG TIẾP NHẬN</p><h2>Hai hướng nghề mỏ hầm lò tại Quảng Ninh</h2></div><p>Không yêu cầu kinh nghiệm. Người học được đào tạo trước khi doanh nghiệp tiếp nhận nếu tốt nghiệp đạt yêu cầu.</p></div><div class="network-grid"><article class="network-card network-card--accent"><div class="network-card__body"><small>VỊ TRÍ 01</small><h2>${esc(recruitment.occupations[0])}</h2><p>Học quy trình khai thác, thiết bị, phối hợp tổ đội và an toàn trong dây chuyền sản xuất hầm lò.</p><a href="/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/">Xem tin việc làm →</a></div></article><article class="network-card"><div class="network-card__body"><small>VỊ TRÍ 02</small><h2>${esc(recruitment.occupations[1])}</h2><p>Học kỹ thuật đào, chống giữ và củng cố đường lò để phục vụ khai thác an toàn.</p><a href="/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/">Xem tin việc làm →</a></div></article><article class="network-card"><div class="network-card__body"><small>CHÍNH SÁCH</small><h2>Học nghề trước, nhận việc sau</h2><p>Miễn kinh phí đào tạo theo chỉ tiêu; bố trí ăn ở, hỗ trợ 7,5 triệu đồng và cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p><a href="/cam-nang-nghe-mo/">Đọc cẩm nang →</a></div></article></div></div></section>
<section class="network-section network-section--soft" id="theo-tinh"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">THÔNG TIN THEO ĐỊA PHƯƠNG</p><h2>Chọn một trong 26 tỉnh, thành</h2></div><p>Mỗi đường dẫn giữ sẵn tên tỉnh trong biểu mẫu và mã nguồn để đầu mối tư vấn biết người lao động đến từ đâu.</p></div><div class="province-groups">${provinceGroups()}</div></div></section>`;
writePage("viec-lam-nganh-than", page({pathName: "/viec-lam-nganh-than/", title: "Việc làm ngành Than theo tỉnh", description: jobsDescription, eyebrow: "VIỆC LÀM NGÀNH THAN 2026", heading: "Chọn nghề, kiểm tra điều kiện và tìm đầu mối theo địa phương", lead: "Hai nghề mỏ hầm lò đang tiếp nhận; người lao động có thể sàng lọc từ xa trước khi chuẩn bị hồ sơ và di chuyển tới Quảng Ninh.", body: jobsBody, schema: commonSchema({pathName: "/viec-lam-nganh-than/", title: "Việc làm ngành Than theo tỉnh", description: jobsDescription, items: jobItems})}));

const guideDescription = "Cẩm nang học nghề mỏ: điều kiện 18–40 tuổi, sức khỏe, hồ sơ, khóa học 2–3 tháng, an toàn, thu nhập và đời sống tại Quảng Ninh.";
const guideBody = `<div class="network-wrap network-facts"><div><strong>01</strong><span>tự đối chiếu điều kiện</span></div><div><strong>02</strong><span>hiểu khóa học và nghề</span></div><div><strong>03</strong><span>chuẩn bị sức khỏe, hồ sơ</span></div><div><strong>04</strong><span>ứng tuyển qua đầu mối chính thức</span></div></div><section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">MƯỜI BÀI NỀN TẢNG</p><h2>Đọc theo thứ tự để ra quyết định có đủ dữ kiện</h2></div><p>Cẩm nang đi từ điều kiện đầu vào đến tay nghề, công việc, an toàn, phúc lợi và khả năng gắn bó lâu dài.</p></div><div class="network-grid">${curatedArticles.map((article) => card({...article, urlPath: `bai-viet/${article.slug}`})).join("")}</div></div></section>`;
writePage("cam-nang-nghe-mo", page({pathName: "/cam-nang-nghe-mo/", title: "Cẩm nang nghề mỏ", description: guideDescription, eyebrow: "CẨM NANG NHẬP NGHỀ", heading: "Hiểu điều kiện, khóa học và công việc trước khi quyết định", lead: "Mười bài nền tảng giúp người lao động và gia đình kiểm chứng từng bước của hành trình học nghề mỏ, nhận việc và ổn định tại Quảng Ninh.", body: guideBody, schema: commonSchema({pathName: "/cam-nang-nghe-mo/", title: "Cẩm nang nghề mỏ", description: guideDescription, items: curatedArticles.map((article) => ({...article, urlPath: `bai-viet/${article.slug}`}))})}));

const storiesDescription = "Mười câu chuyện người thợ mỏ được biên tập từ nguồn báo chí, phản ánh ca làm, tay nghề, an toàn, đời sống và hành trình trưởng thành trong ngành Than.";
const storiesBody = `<div class="network-wrap network-facts"><div><strong>${pressStoryArticles.length}</strong><span>câu chuyện có nguồn</span></div><div><strong>Ca làm</strong><span>nhịp sống và kỷ luật</span></div><div><strong>Tay nghề</strong><span>con đường trưởng thành</span></div><div><strong>Đồng đội</strong><span>văn hóa người thợ mỏ</span></div></div><section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">NGƯỜI THẬT, VIỆC THẬT</p><h2>Nhìn nghề qua những người đang sống cùng nghề</h2></div><p>Mỗi bài ghi rõ nguồn và tách bạch câu chuyện lịch sử với điều kiện tuyển dụng đang áp dụng.</p></div><div class="network-grid">${pressStoryArticles.map((article) => card(article, "Chuyện người thợ")).join("")}</div></div></section>`;
writePage("chuyen-nguoi-tho", page({pathName: "/chuyen-nguoi-tho/", title: "Chuyện người thợ mỏ", description: storiesDescription, eyebrow: "CHUYỆN NGƯỜI THỢ", heading: "Hiểu nghề mỏ qua ca làm, tay nghề và đời sống thật", lead: "Những câu chuyện có nguồn giúp người lao động hình dung công việc phía sau lời tuyển dụng: có vất vả, có kỷ luật, có đồng đội và có con đường trưởng thành bằng tay nghề.", body: storiesBody, schema: commonSchema({pathName: "/chuyen-nguoi-tho/", title: "Chuyện người thợ mỏ", description: storiesDescription, items: pressStoryArticles})}));

const options = [{slug: "toan-quoc", name: "Toàn quốc"}, ...provinces];
const shareDescription = "Công cụ tạo nội dung tuyển học nghề mỏ theo 26 tỉnh và toàn quốc, kèm liên kết UTM để cộng tác viên chia sẻ đúng thông tin và đo nguồn liên hệ.";
const shareBody = `<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">27 GÓI NỘI DUNG</p><h2>Chọn địa phương, sao chép và gửi đúng thông tin</h2></div><p>Gói chỉ chứa điều kiện, quyền lợi, liên kết và đầu mối công khai; không thu thập hay chèn dữ liệu cá nhân của ứng viên.</p></div><div class="share-builder" data-share-builder><div class="share-builder__controls"><label for="share-province">Địa bàn cần chia sẻ</label><select id="share-province" data-share-province>${options.map((option) => `<option value="${option.slug}" data-name="${esc(option.name)}">${esc(option.name)}</option>`).join("")}</select><p class="share-builder__hint">Nội dung tự thay tên tỉnh, đường dẫn tỉnh và mã chiến dịch <code>${campaign}</code>.</p><a class="network-button network-button--outline" href="/trung-tam-nghe-mo/" data-share-preview>Mở Trung tâm nghề mỏ</a></div><div class="share-builder__output"><label for="share-output">Nội dung sẵn sàng phân phối</label><textarea id="share-output" data-share-output readonly></textarea><div class="share-builder__actions"><button class="network-button" type="button" data-package-copy>Sao chép trọn gói</button><button class="network-button network-button--outline" type="button" data-package-share>Chia sẻ trên thiết bị</button></div><p class="share-status" data-share-status role="status" aria-live="polite"></p></div></div></div></section>
<section class="network-section network-section--soft"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">NGUYÊN TẮC LAN TỎA</p><h2>Đúng thông tin, đúng đối tượng, có thể kiểm chứng</h2></div><p>Không hứa thêm quyền lợi, không đăng số liệu ngoài nguồn đang áp dụng và không đưa giấy tờ cá nhân vào bài chia sẻ.</p></div><ul class="network-list"><li><b>1</b><div><strong>Gửi trang tỉnh cho người cần ngữ cảnh địa phương</strong><span>Người nhận vẫn có thể quay về Trung tâm nghề mỏ để kiểm chứng toàn bộ thông tin.</span></div></li><li><b>2</b><div><strong>Giữ nguyên đường dẫn có mã nguồn</strong><span>UTM giúp đo kênh nào tạo lượt đọc, liên hệ và hồ sơ đủ điều kiện.</span></div></li><li><b>3</b><div><strong>Chỉ gửi hồ sơ qua biểu mẫu chính thức</strong><span>Không yêu cầu ứng viên đăng CCCD, giấy khai sinh hoặc thông tin sức khỏe lên mạng xã hội.</span></div></li></ul></div></section>`;
writePage("chia-se-thong-tin", page({pathName: "/chia-se-thong-tin/", title: "Bộ chia sẻ thông tin nghề mỏ", description: shareDescription, eyebrow: "CÔNG CỤ LAN TỎA THÔNG TIN", heading: "Tạo gói tuyển dụng theo từng tỉnh trong vài giây", lead: "Dành cho cán bộ địa phương, cộng tác viên, gia đình và người lao động muốn gửi thông tin chính xác mà không phải tự viết lại.", body: shareBody, schema: commonSchema({pathName: "/chia-se-thong-tin/", title: "Bộ chia sẻ thông tin nghề mỏ", description: shareDescription, type: "WebPage"}), shareTools: true}));

const policyTitle = "Nguyên tắc biên tập và kiểm chứng thông tin";
const policyDescription = "Cách Thầy Linh – Tuyển Thợ Mỏ xác định nguồn, cập nhật điều kiện tuyển sinh, biên tập bài báo, sử dụng hình ảnh và tiếp nhận đính chính.";
const policyCanonical = editorialPolicyUrl;
const policySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${policyCanonical}#webpage`,
      url: policyCanonical,
      name: policyTitle,
      description: policyDescription,
      inLanguage: "vi-VN",
      datePublished: updatedDate,
      dateModified: updatedDate,
      isPartOf: {"@id": websiteId},
      author: {"@id": personId},
      publisher: {"@id": organizationId},
      breadcrumb: {"@id": `${policyCanonical}#breadcrumb`},
      about: ["Quy trình biên tập", "Kiểm chứng nguồn", "Cập nhật tuyển sinh nghề mỏ", "Đính chính nội dung"],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${policyCanonical}#breadcrumb`,
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/`},
        {"@type": "ListItem", position: 2, name: policyTitle, item: policyCanonical},
      ],
    },
  ],
};
const policyBody = `<div class="network-wrap network-facts"><div><strong>Ai</strong><span>Nguyễn Tử Linh chịu trách nhiệm biên soạn</span></div><div><strong>Nguồn</strong><span>văn bản, đơn vị và báo chí được nêu rõ</span></div><div><strong>Cập nhật</strong><span>dữ kiện tuyển sinh dùng một nguồn thống nhất</span></div><div><strong>Đính chính</strong><span>sửa tại dữ liệu gốc rồi tái kiểm tra toàn site</span></div></div>
<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">NGƯỜI BIÊN SOẠN · CÁCH THỰC HIỆN · MỤC ĐÍCH</p><h2>Người đọc biết rõ ai chịu trách nhiệm cho từng thông tin</h2></div><p>Website do Nguyễn Tử Linh – Trưởng phòng Tuyển sinh Miền Trung – biên soạn và duy trì để người lao động kiểm tra điều kiện, hiểu chương trình học nghề và biết đúng đầu mối trước khi quyết định.</p></div><ul class="network-list"><li><b>1</b><div><strong>Ai chịu trách nhiệm</strong><span>Nguyễn Tử Linh chịu trách nhiệm nội dung tuyển sinh, hồ sơ, địa chỉ tiếp nhận và hướng dẫn liên hệ trên website.</span></div></li><li><b>2</b><div><strong>Nội dung được tạo như thế nào</strong><span>Dữ kiện hiện hành được đối chiếu với hồ sơ chính sách; bài báo được diễn đạt lại theo nguồn, giữ đúng nhân vật, số liệu, ngày tháng và bối cảnh.</span></div></li><li><b>3</b><div><strong>Vì sao nội dung được xuất bản</strong><span>Mục tiêu là giúp người lao động và gia đình ra quyết định bằng thông tin có thể kiểm chứng, không tạo bài chỉ để lặp từ khóa tìm kiếm.</span></div></li></ul></div></section>
<section class="network-section network-section--soft"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">THỨ TỰ ƯU TIÊN NGUỒN</p><h2>Dữ kiện tuyển sinh và câu chuyện báo chí không được trộn lẫn</h2></div><p>Thông tin tuyển đang áp dụng luôn được tách khỏi số liệu lịch sử hoặc trường hợp cá nhân trong các bài báo.</p></div><ul class="network-list"><li><b>1</b><div><strong>Thông tin tuyển sinh hiện hành</strong><span>Ưu tiên thông báo, kế hoạch và dữ liệu vận hành của Trường Cao đẳng Than - Khoáng sản Việt Nam; trang “Thông tin tuyển thợ mỏ” là điểm đối chiếu duy nhất trên website.</span></div></li><li><b>2</b><div><strong>Tin ngành Than và địa phương</strong><span>Ưu tiên nguồn TKV, Nhà trường, cơ quan nhà nước địa phương và cơ quan báo chí; cuối mỗi bài nêu tên nguồn, tên bài và ngày đăng.</span></div></li><li><b>3</b><div><strong>Ảnh trong bài</strong><span>Bài lấy nguồn dùng đúng ảnh trong bài báo tương ứng; ảnh được đặt đúng mạch nội dung và ghi chú thích. Khi ảnh gốc không còn được phục vụ, chỉ dùng ảnh tư liệu đúng bối cảnh và ghi rõ.</span></div></li></ul></div></section>
<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">CẬP NHẬT VÀ ĐÍNH CHÍNH</p><h2>Sửa một dữ kiện phải sửa từ nguồn gốc, không vá riêng từng trang</h2></div><p>Điều kiện, quyền lợi, hồ sơ và địa chỉ được tạo từ một hồ sơ dữ liệu chung; thay đổi chỉ được xuất bản sau khi toàn bộ trang và dữ liệu có cấu trúc vượt qua kiểm tra tự động.</p></div><ul class="network-list"><li><b>1</b><div><strong>Ngày hiệu lực được công khai</strong><span>Trang thông tin hiện hành ghi ngày cập nhật và căn cứ đang dùng. Bài cũ không được tự đổi ngày để tạo cảm giác mới.</span></div></li><li><b>2</b><div><strong>Đính chính có đầu mối</strong><span>Nếu phát hiện sai tên, số liệu, ảnh hoặc điều kiện, liên hệ Nguyễn Tử Linh qua Zalo/điện thoại 096 304 8585 để kiểm tra lại nguồn.</span></div></li><li><b>3</b><div><strong>Giới hạn của website</strong><span>Nội dung hỗ trợ người đọc tìm hiểu và đăng ký ban đầu; kết quả tiếp nhận cuối cùng vẫn căn cứ hồ sơ, khám sức khỏe và kế hoạch của từng đợt.</span></div></li></ul><div class="network-actions"><a class="network-button" href="/thong-tin-tuyen-tho-mo/">Xem thông tin đang áp dụng</a><a class="network-button network-button--outline" href="/tac-gia/nguyen-tu-linh/">Xem người chịu trách nhiệm</a></div></div></section>`;
writePage("nguyen-tac-bien-tap", page({pathName: editorialPolicyPath, title: policyTitle, description: policyDescription, eyebrow: "MINH BẠCH NGUỒN VÀ TRÁCH NHIỆM", heading: "Nội dung được kiểm chứng như thế nào trước khi xuất bản?", lead: "Công khai người biên soạn, thứ tự ưu tiên nguồn, cách cập nhật dữ kiện và quy trình tiếp nhận đính chính để người đọc lẫn công cụ tìm kiếm hiểu đúng website.", body: policyBody, schema: policySchema, current: ""}));

const authorPath = "/tac-gia/nguyen-tu-linh/";
const authorDescription = "Hồ sơ Nguyễn Tử Linh (Thầy Linh), người biên soạn Trung tâm nghề mỏ và đầu mối tư vấn học nghề, việc làm ngành Than tại Quảng Ninh.";
const authorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "ProfilePage", "@id": `${base}${authorPath}#webpage`, url: `${base}${authorPath}`, name: "Nguyễn Tử Linh – Thầy Linh", description: authorDescription, inLanguage: "vi-VN", dateCreated: "2026-07-25", dateModified: updatedDate, isPartOf: {"@id": websiteId}, mainEntity: {"@id": personId}, publishingPrinciples: editorialPolicyUrl, hasPart: allArticles.slice().sort((a, b) => new Date(b.published) - new Date(a.published)).slice(0, 6).map((article) => ({"@type": "Article", name: article.title, url: `${base}/${article.urlPath}/`}))},
    {"@type": "Person", "@id": personId, name: "Nguyễn Tử Linh", alternateName: ["Thầy Linh", "Thầy Linh – Tuyển Thợ Mỏ"], url: `${base}${authorPath}`, image: `${base}/assets/thay-linh-avatar.webp`, jobTitle: "Trưởng phòng Tuyển sinh Miền Trung", worksFor: {"@type": "CollegeOrUniversity", name: "Trường Cao đẳng Than - Khoáng sản Việt Nam", url: "https://caodangtkv.edu.vn/"}, telephone: "+84963048585", sameAs: officialProfiles, knowsAbout: ["Tuyển sinh nghề mỏ", "Học nghề mỏ hầm lò", "Việc làm ngành Than", "Tư vấn người lao động", "Đào tạo nghề tại Quảng Ninh"]},
  ],
};
const authorBody = `<section class="network-section"><div class="network-wrap"><article class="profile"><img src="/assets/thay-linh-avatar.webp?v=3" alt="Nguyễn Tử Linh – Thầy Linh" width="220" height="220"><div><p class="network-eyebrow">NGƯỜI BIÊN SOẠN VÀ ĐẦU MỐI TƯ VẤN</p><h2>Nguyễn Tử Linh</h2><p><strong>Trưởng phòng Tuyển sinh Miền Trung</strong></p><p>Thầy Linh biên soạn và duy trì Trung tâm nghề mỏ để người lao động có một nơi đối chiếu điều kiện, chính sách học nghề, việc làm và câu chuyện ngành Than trước khi liên hệ. Nội dung tuyển sinh dùng chung nguồn dữ liệu vận hành; bài biên tập ghi rõ nguồn và không biến số liệu lịch sử thành cam kết hiện hành.</p><div class="network-actions"><a class="network-button" href="${trackedApply("author_profile")}" data-contact="application" data-context="author-profile">Kiểm tra điều kiện</a><a class="network-button network-button--outline" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="author-profile">Zalo 096 304 8585</a></div></div></article></div></section>
<section class="network-section network-section--soft"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">CAM KẾT BIÊN TẬP</p><h2>Thông tin phải giúp người lao động ra quyết định tốt hơn</h2></div><p>Mọi nội dung đều quay về ba câu hỏi: điều kiện có phù hợp, quyền lợi nào đang áp dụng và bước tiếp theo an toàn là gì.</p></div><ul class="network-list"><li><b>1</b><div><strong>Thống nhất dữ liệu tuyển sinh</strong><span>Tuổi, thể lực, sức khỏe, thời gian học và quyền lợi lấy từ cùng một hồ sơ chính sách.</span></div></li><li><b>2</b><div><strong>Ghi nguồn cho bài biên tập</strong><span>Câu chuyện báo chí được diễn giải nguyên bản, tách rõ dữ kiện nguồn và hướng dẫn của website.</span></div></li><li><b>3</b><div><strong>Bảo vệ dữ liệu ứng viên</strong><span>Đo nguồn liên hệ nhưng không đưa thông tin nhận dạng cá nhân vào GA4, Meta hoặc liên kết chia sẻ.</span></div></li></ul><div class="network-actions"><a class="network-button network-button--outline" href="${editorialPolicyPath}">Đọc đầy đủ nguyên tắc biên tập</a></div></div></section>
<section class="network-section"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">BÀI BIÊN SOẠN GẦN ĐÂY</p><h2>Nội dung mới do Nguyễn Tử Linh chịu trách nhiệm</h2></div><p>Mỗi bài dẫn về hồ sơ tác giả này và dùng chung nguyên tắc kiểm chứng nguồn của website.</p></div><div class="network-grid">${allArticles.slice().sort((a, b) => new Date(b.published) - new Date(a.published)).slice(0, 6).map((article) => card(article)).join("")}</div></div></section>`;
writePage(path.join("tac-gia", "nguyen-tu-linh"), page({pathName: authorPath, title: "Nguyễn Tử Linh – Thầy Linh", description: authorDescription, eyebrow: "HỒ SƠ NGƯỜI BIÊN SOẠN", heading: "Một đầu mối chịu trách nhiệm cho toàn bộ hành trình thông tin", lead: "Từ nội dung trên website tới bước kiểm tra điều kiện, người lao động biết rõ ai biên soạn, ai tư vấn và kênh nào là chính thức.", body: authorBody, schema: authorSchema, current: ""}));

function writePage(relativeDirectory, html) {
  const directory = path.join(root, relativeDirectory);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, "index.html"), `${html}\n`);
}

console.log(JSON.stringify({pages: 8, articles: allArticles.length, provinces: provinces.length, share_packages: options.length, campaign}));
