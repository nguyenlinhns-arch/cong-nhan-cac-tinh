import fs from "node:fs";
import path from "node:path";
import {curatedArticles, existingNews} from "./curated-articles.mjs";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const author = "Nguyễn Tử Linh";
const allEditorial = [
  ...curatedArticles.map((article) => ({...article, urlPath: `bai-viet/${article.slug}`})),
  ...existingNews,
];

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const xml = esc;
const displayDate = (iso) => new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Bangkok",
}).format(new Date(iso));

const sourceLabel = (source) => `${source.publisher} · ${source.title} · ${source.date}`;

function renderFacts(facts) {
  return `<div class="fact-grid">${facts.map(([value, label]) => `<div class="fact-card"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("")}</div>`;
}

function renderSections(sections) {
  return sections.map((section) => {
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
    const bullets = section.bullets?.length
      ? `\n    <ul class="evidence-list">${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
      : "";
    return `<section class="editorial-section">
    <h2>${esc(section.title)}</h2>
    ${paragraphs}${bullets}
  </section>`;
  }).join("");
}

function renderChecklist(items) {
  return `<ol class="timeline">${items.map(([title, text], index) => `<li><time>${String(index + 1).padStart(2, "0")}</time><div><strong>${esc(title)}</strong><span>${esc(text)}</span></div></li>`).join("")}</ol>`;
}

function renderSources(sources) {
  return `<section class="editorial-sources" data-editorial-source-count="${sources.length}">
    <h2>Nguồn dữ kiện đã đối chiếu</h2>
    <ul>${sources.map((source) => `<li>${esc(sourceLabel(source))}</li>`).join("")}</ul>
    <p>Bài viết do Nguyễn Tử Linh phân tích và biên soạn độc lập từ các dữ kiện công khai; không sao chép nguyên văn bài nguồn. Website không đặt liên kết dẫn người đọc ra ngoài.</p>
  </section>`;
}

function renderArticle(article) {
  const canonical = `${base}/bai-viet/${article.slug}/`;
  const faqs = article.faq.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {"@type": "Answer", text: answer},
  }));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.published,
        dateModified: article.updated,
        inLanguage: "vi-VN",
        mainEntityOfPage: {"@id": `${canonical}#webpage`},
        image: [article.image],
        author: {"@type": "Person", name: author, alternateName: "Thầy Linh – Tuyển Thợ Mỏ", url: `${base}/#gioi-thieu`},
        publisher: {"@type": "Organization", name: "Thầy Linh – Tuyển Thợ Mỏ", url: `${base}/`},
        articleSection: article.section,
        keywords: article.keywords,
      },
      {"@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: article.title, breadcrumb: {"@id": `${canonical}#breadcrumb`}},
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {"@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/`},
          {"@type": "ListItem", position: 2, name: "Tin ngành Than", item: `${base}/tin-nganh-than/`},
          {"@type": "ListItem", position: 3, name: article.title, item: canonical},
        ],
      },
      {"@type": "FAQPage", mainEntity: faqs},
    ],
  };
  const related = article.related.map((slug, index) => {
    const target = curatedArticles.find((item) => item.slug === slug);
    if (!target) return "";
    return `<a href="../${target.slug}/"><small>${index ? "Đọc tiếp" : "Bài liên quan"}</small>${esc(target.title)} →</a>`;
  }).join("");

  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#063c46">
  <title>${esc(article.title)} | Thầy Linh</title>
  <meta name="description" content="${esc(article.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="author" content="${author}">
  <meta name="keywords" content="${esc(article.keywords.join(", "))}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="../../assets/favicon.svg?v=2" type="image/svg+xml">
  <link rel="manifest" href="../../manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Tin ngành Than – Thầy Linh" href="${base}/feed.xml">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">
  <meta property="og:title" content="${esc(article.title)}">
  <meta property="og:description" content="${esc(article.lead)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${article.image}">
  <meta property="og:image:alt" content="${esc(article.imageAlt)}">
  <meta property="article:published_time" content="${article.published}">
  <meta property="article:modified_time" content="${article.updated}">
  <meta property="article:author" content="${author}">
  <meta property="article:section" content="${esc(article.section)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(article.title)}">
  <meta name="twitter:description" content="${esc(article.lead)}">
  <meta name="twitter:image" content="${article.image}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../article-insights.css?v=7">
  <link rel="stylesheet" href="/mobile-ux.css?v=1">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="../../"><span class="brand-mark">TL</span><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="../../tin-nganh-than/">← Tin ngành Than</a></div></header>
  <main>
    <section class="article-hero">
      <img src="${article.image}" alt="${esc(article.imageAlt)}" fetchpriority="high" referrerpolicy="no-referrer">
      <div class="container hero-inner">
        <nav class="breadcrumbs" aria-label="Đường dẫn"><a href="../../">Trang chủ</a><span>/</span><a href="../../tin-nganh-than/">Tin ngành Than</a><span>/</span><span>${esc(article.section)}</span></nav>
        <p class="eyebrow">${esc(article.section)} · ${displayDate(article.published)}</p>
        <h1>${esc(article.title)}</h1>
        <p class="lead">${esc(article.lead)}</p>
      </div>
    </section>
    <div class="container article-layout">
      <article class="article-body">
        <p class="article-meta"><time datetime="${article.updated}">Cập nhật ${displayDate(article.updated)}</time> · Phân tích và biên soạn: <a rel="author" href="../../#gioi-thieu">${author}</a> · Ảnh: ${esc(article.imageSource)}</p>
        ${article.intro.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <h2>Dữ kiện chính</h2>
        ${renderFacts(article.facts)}
        ${renderSections(article.sections)}
        <h2>Cách áp dụng vào trường hợp của bạn</h2>
        ${renderChecklist(article.checklist)}
        <div class="expert-takeaway"><strong>Góc nhìn chuyên gia</strong><p>${esc(article.takeaway)}</p></div>
        <h2>Câu hỏi thường gặp</h2>
        <div class="faq-list">${article.faq.map(([question, answer]) => `<section class="faq-item"><h3>${esc(question)}</h3><p>${esc(answer)}</p></section>`).join("")}</div>
        ${renderSources(article.sources)}
        <nav class="article-nav" aria-label="Bài viết liên quan">${related}</nav>
      </article>
      <aside class="article-aside">
        <div class="aside-card accent"><h2>Muốn kiểm tra điều kiện?</h2><p>Gửi năm sinh, chiều cao/cân nặng và tình trạng sức khỏe để được hướng dẫn trước khi chuẩn bị đi xa.</p><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Nhắn Zalo 096 304 8585</a></div>
        <div class="aside-card"><h2>Chủ đề chính</h2><ul>${article.keywords.slice(0, 4).map((keyword) => `<li>${esc(keyword)}</li>`).join("")}</ul></div>
        <div class="aside-card"><h2>Nguyên tắc biên tập</h2><p>Dữ kiện được đối chiếu nhiều nguồn. Phần nhận định được tách khỏi số liệu; không biến mức bình quân hoặc trường hợp cao nhất thành lời hứa cho từng người.</p></div>
      </aside>
    </div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Thông tin ngành Than được tuyển chọn, kiểm chứng và giải thích cho người lao động.</p></div><a href="../../tin-nganh-than/">Xem kho kiến thức ngành mỏ →</a></div></footer>
  <nav class="article-contact" aria-label="Liên hệ nhanh"><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Zalo · 096 304 8585</a><a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener">Messenger</a></nav>
  <script src="/mobile-ux.js?v=1" defer></script>
</body>
</html>`;
}

const sectionOrder = [
  "Hướng dẫn nhập nghề",
  "Thu nhập & việc làm",
  "Công nghệ mỏ",
  "Tay nghề & đào tạo",
  "An toàn & sức khỏe",
  "Đời sống thợ mỏ",
  "Mỏ xanh & môi trường",
  "Việc làm ngành Than",
];

const sectionIds = {
  "Hướng dẫn nhập nghề": "huong-dan-nhap-nghe",
  "Thu nhập & việc làm": "thu-nhap-viec-lam",
  "Công nghệ mỏ": "cong-nghe-mo",
  "Tay nghề & đào tạo": "tay-nghe-dao-tao",
  "An toàn & sức khỏe": "an-toan-suc-khoe",
  "Đời sống thợ mỏ": "doi-song-tho-mo",
  "Mỏ xanh & môi trường": "mo-xanh-moi-truong",
  "Việc làm ngành Than": "viec-lam-nganh-than",
};

function card(article) {
  const href = article.urlPath.startsWith("bai-viet/")
    ? `../${article.urlPath}/`
    : `./${article.urlPath.replace(/^tin-nganh-than\//, "")}/`;
  return `<a class="news-card" href="${href}" data-cluster="${esc(article.section)}"><img src="${article.image}" alt="${esc(article.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><div class="news-card__body"><small>${esc(article.section)}</small><h2>${esc(article.title)}</h2><p>${esc(article.lead)}</p><span>Đọc phân tích →</span></div></a>`;
}

function hubHtml() {
  const feature = existingNews.find((article) => article.slug === "tai-co-cau-tkv-2026-viec-lam-tho-mo");
  const sections = sectionOrder.map((section) => {
    const items = allEditorial.filter((article) => article.section === section && article.slug !== feature.slug);
    if (!items.length) return "";
    return `<section class="library-section" id="${sectionIds[section]}"><div class="library-heading"><div><p class="eyebrow">${esc(section)}</p><h2>${items.length === 1 ? "Bài phân tích nên đọc" : "Các bài phân tích nên đọc"}</h2></div></div><div class="news-grid">${items.map(card).join("")}</div></section>`;
  }).join("");
  const itemList = allEditorial.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${base}/${article.urlPath}/`,
    name: article.title,
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kho kiến thức ngành mỏ – Thầy Linh",
    description: "Các bài phân tích chọn lọc về ngành Than, nghề thợ mỏ, thu nhập, an toàn, công nghệ, đào tạo và môi trường.",
    url: `${base}/tin-nganh-than/`,
    inLanguage: "vi-VN",
    dateModified: "2026-07-31T10:30:00+07:00",
    publisher: {"@type": "Organization", name: "Thầy Linh – Tuyển Thợ Mỏ", url: `${base}/`},
    mainEntity: {"@type": "ItemList", numberOfItems: allEditorial.length, itemListElement: itemList},
  };
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#063c46">
  <title>Kho kiến thức ngành mỏ: tin chọn lọc và phân tích chuyên sâu</title>
  <meta name="description" content="Kho bài viết chọn lọc về ngành Than, nghề thợ mỏ, thu nhập, an toàn, công nghệ, tay nghề, phúc lợi và môi trường khai thác.">
  <meta name="robots" content="index,follow,max-image-preview:large"><meta name="author" content="${author}">
  <link rel="canonical" href="${base}/tin-nganh-than/"><link rel="icon" href="../assets/favicon.svg?v=2" type="image/svg+xml"><link rel="manifest" href="../manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Tin ngành Than – Thầy Linh" href="${base}/feed.xml"><link rel="alternate" type="application/feed+json" title="Tin ngành Than – Thầy Linh" href="${base}/feed.json">
  <meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="Kho kiến thức ngành mỏ"><meta property="og:description" content="Tin có giá trị được chọn lọc, đối chiếu và viết lại thành phân tích dành cho người lao động."><meta property="og:image" content="${feature.image}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Kho kiến thức ngành mỏ"><meta name="twitter:description" content="Phân tích ngành Than dành cho người lao động."><meta name="twitter:image" content="${feature.image}">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../article-insights.css?v=7"><link rel="stylesheet" href="/mobile-ux.css?v=1">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="../"><span class="brand-mark">TL</span><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="../">← Trang chủ</a></div></header>
  <main>
    <section class="news-hero"><div class="container"><p class="eyebrow">Tin có giá trị · Phân tích có kiểm chứng</p><h1>Kho kiến thức ngành mỏ</h1><p class="lead">Không chạy theo số lượng. Mỗi bài phải có dữ kiện, góc nhìn chuyên môn và phần giải thích người lao động có thể dùng để ra quyết định.</p><nav class="cluster-nav" aria-label="Nhóm bài viết">${sectionOrder.filter((section) => allEditorial.some((article) => article.section === section && article.slug !== feature.slug)).map((section) => `<a href="#${sectionIds[section]}">${esc(section)}</a>`).join("")}</nav></div></section>
    <div class="container news-main">
      <article class="news-feature"><img src="${feature.image}" alt="${esc(feature.title)}" referrerpolicy="no-referrer"><div class="news-feature__body"><p class="news-kicker">Phân tích mới · ${displayDate(feature.published)}</p><h2>${esc(feature.title)}</h2><p>${esc(feature.lead)}</p><a class="news-link" href="./${feature.urlPath.replace(/^tin-nganh-than\//, "")}/">Đọc bài phân tích →</a></div></article>
      ${sections}
    </div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Nội dung ngành mỏ được chọn lọc theo giá trị, không theo chỉ tiêu số lượng.</p></div><a href="../#dang-ky">Kiểm tra điều kiện →</a></div></footer>
  <nav class="article-contact" aria-label="Liên hệ nhanh"><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Zalo · 096 304 8585</a><a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener">Messenger</a></nav>
  <script src="/mobile-ux.js?v=1" defer></script>
</body></html>`;
}

for (const article of curatedArticles) {
  const directory = path.join(root, "bai-viet", article.slug);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, "index.html"), renderArticle(article));
}

fs.writeFileSync(path.join(root, "tin-nganh-than", "index.html"), hubHtml());

function collectIndexHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectIndexHtml(full, output);
    else if (entry.name === "index.html") output.push(full);
  }
  return output;
}

const urls = collectIndexHtml(root).map((file) => {
  const relative = path.relative(root, file).replaceAll(path.sep, "/").replace(/index\.html$/, "");
  return `${base}/${relative}`;
}).sort((left, right) => left === `${base}/` ? -1 : right === `${base}/` ? 1 : left.localeCompare(right, "vi"));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => {
  const priority = url === `${base}/` ? "1.0" : url.endsWith("/tin-nganh-than/") ? "0.9" : url.includes("/bai-viet/") || url.includes("/tin-nganh-than/2026/") ? "0.8" : "0.7";
  const frequency = url.includes("/bai-viet/") || url.includes("/tin-nganh-than/2026/") ? "monthly" : "weekly";
  return `  <url><loc>${xml(url)}</loc><lastmod>2026-07-31</lastmod><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`;
}).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const feedItems = [...allEditorial].sort((left, right) => new Date(right.published) - new Date(left.published));
const rssItems = feedItems.map((article) => `  <item><title>${xml(article.title)}</title><link>${base}/${article.urlPath}/</link><guid>${base}/${article.urlPath}/</guid><pubDate>${new Date(article.published).toUTCString()}</pubDate><description>${xml(article.lead)}</description></item>`).join("\n");
fs.writeFileSync(path.join(root, "feed.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Thầy Linh – Tin ngành Than có kiểm chứng</title><link>${base}/tin-nganh-than/</link><description>Bài phân tích chọn lọc về nghề mỏ, thu nhập, an toàn, công nghệ, phúc lợi và môi trường.</description><language>vi</language><lastBuildDate>${new Date("2026-07-31T10:30:00+07:00").toUTCString()}</lastBuildDate>\n${rssItems}\n</channel></rss>\n`);
fs.writeFileSync(path.join(root, "feed.json"), `${JSON.stringify({
  version: "https://jsonfeed.org/version/1.1",
  title: "Thầy Linh – Tin ngành Than có kiểm chứng",
  home_page_url: `${base}/`,
  feed_url: `${base}/feed.json`,
  language: "vi-VN",
  items: feedItems.map((article) => ({
    id: `${base}/${article.urlPath}/`,
    url: `${base}/${article.urlPath}/`,
    title: article.title,
    summary: article.lead,
    image: article.image,
    date_published: article.published,
    tags: article.keywords,
  })),
}, null, 2)}\n`);

const llms = `# Thầy Linh – Tuyển Thợ Mỏ\n\n> Website phân tích ngành Than và tư vấn học nghề mỏ tại Quảng Ninh do Nguyễn Tử Linh biên soạn.\n\n## Thông tin tuyển sinh đang áp dụng\n\n- Căn cứ: Thông báo số 10/TB-CĐTKV ngày 02/04/2026.\n- Thời gian học các nghề đang tuyển: 2–3 tháng.\n- Điều kiện: nam 18–35 tuổi, cao từ 1,56 m, nặng từ 48 kg và có sức khỏe tốt.\n- Hồ sơ dự tuyển gồm 02 bộ; mỗi bộ có sơ yếu lý lịch, bản sao giấy khai sinh, bản công chứng bằng tốt nghiệp văn hóa và bản công chứng căn cước công dân.\n- Thu nhập phải được hiểu theo vị trí, ngày công, năng suất và đơn vị; website không cam kết một mức cố định cho mọi người.\n- Tin tuyển dụng chuẩn: [Tuyển lao động học nghề mỏ hầm lò năm 2026](${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/).\n- Liên hệ tư vấn: Zalo 096 304 8585.\n\n## Nguyên tắc nội dung\n\n- Chỉ giữ bài có nguồn dữ kiện, giá trị thực tế và nội dung nguyên bản.\n- Phân biệt rõ số liệu, nhận định và thông tin cần xác nhận theo từng đợt.\n- Ảnh bài viết lấy từ Thư viện ảnh Vinacomin và không lặp giữa các bài trong kho biên tập.\n- Không đặt liên kết nguồn ra ngoài trong giao diện bài viết.\n\n## Kho kiến thức ngành mỏ\n\n${feedItems.map((article) => `- [${article.title}](${base}/${article.urlPath}/): ${article.lead}`).join("\n")}\n`;
fs.writeFileSync(path.join(root, "llms.txt"), llms);

const imageRegistry = Object.fromEntries(feedItems.map((article) => [article.slug, {
  album_title: article.imageSource,
  source_url: article.image,
  provider: "Thư viện ảnh Vinacomin",
}]));
fs.writeFileSync(path.join(root, "assets", "articles", "sources.json"), `${JSON.stringify(imageRegistry, null, 2)}\n`);

fs.mkdirSync(path.resolve("content"), {recursive: true});
fs.writeFileSync(path.resolve("content", "editorial-sources.json"), `${JSON.stringify({
  updated_at: "2026-07-31T10:30:00+07:00",
  policy: "Nguồn URL chỉ dùng cho kiểm chứng nội bộ; bài công khai ghi tên nguồn bằng chữ và không đặt liên kết ra ngoài.",
  articles: allEditorial.map((article) => ({slug: article.slug, title: article.title, sources: article.sources})),
}, null, 2)}\n`);

console.log(`Generated ${curatedArticles.length} rewritten guides, ${allEditorial.length} editorial feed items and ${urls.length} sitemap URLs.`);
