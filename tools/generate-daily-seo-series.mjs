import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const BASE = "https://thaylinhtuyenthomo.vn";
const SERIES_PATH = "/giai-dap-nghe-mo/";
const DATA_PATH = path.join(ROOT, "content", "daily-seo-articles.json");
const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const imageDimensions = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "article-image-dimensions.json"), "utf8"));

function bangkokDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

const releaseDate = process.env.SEO_DAILY_DATE || bangkokDate();
if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) throw new Error("SEO_DAILY_DATE must use YYYY-MM-DD");
const released = data.articles
  .filter((article) => article.publish_on <= releaseDate)
  .sort((a, b) => b.publish_on.localeCompare(a.publish_on));
const occupationTerms = ["khai thác mỏ", "xây dựng mỏ", "cơ điện mỏ"];
const isOccupationArticle = (article) => occupationTerms.some((term) =>
  `${article.title} ${article.primary_query}`.toLocaleLowerCase("vi").includes(term),
);

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function write(relativePath, value) {
  const target = path.join(SITE, relativePath);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, value);
}

function imageSize(source) {
  const size = imageDimensions[source];
  if (!size) throw new Error(`Thiếu kích thước ảnh: ${source}`);
  return ` width="${size[0]}" height="${size[1]}"`;
}

function read(relativePath) {
  return fs.readFileSync(path.join(SITE, relativePath), "utf8");
}

const seriesDirectory = path.join(SITE, "giai-dap-nghe-mo");
if (fs.existsSync(seriesDirectory)) {
  for (const entry of fs.readdirSync(seriesDirectory, {withFileTypes: true})) {
    if (entry.isDirectory()) fs.rmSync(path.join(seriesDirectory, entry.name), {recursive: true});
  }
}

function graphFor(article) {
  const url = `${BASE}${SERIES_PATH}${article.slug}/`;
  const hubUrl = `${BASE}${SERIES_PATH}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.meta,
        inLanguage: "vi-VN",
        datePublished: `${article.publish_on}T07:20:00+07:00`,
        dateModified: `${article.publish_on}T07:20:00+07:00`,
        mainEntityOfPage: {"@id": `${url}#webpage`},
        author: {"@id": `${BASE}/tac-gia/nguyen-tu-linh/#person`},
        publisher: {"@id": `${BASE}/#organization`},
        ...(isOccupationArticle(article) ? {} : {image: [article.image.src]}),
        about: [article.primary_query, ...(article.query_variants || [])],
        isPartOf: {"@id": `${hubUrl}#webpage`},
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: article.title,
        description: article.meta,
        inLanguage: "vi-VN",
        datePublished: article.publish_on,
        dateModified: article.publish_on,
        mainEntity: {"@id": `${url}#faq`},
        breadcrumb: {"@id": `${url}#breadcrumb`},
        speakable: {"@type": "SpeakableSpecification", cssSelector: ["#tra-loi-truc-tiep", ".daily-seo-takeaway"]},
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: article.faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {"@type": "Answer", text: answer},
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {"@type": "ListItem", position: 1, name: "Trang chủ", item: `${BASE}/`},
          {"@type": "ListItem", position: 2, name: "Giải đáp nghề mỏ", item: hubUrl},
          {"@type": "ListItem", position: 3, name: article.short_title, item: url},
        ],
      },
    ],
  };
}

function head({title, meta, canonical, graph, image, type = "article"}) {
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#063c46">
  <title>${esc(title)} | Thầy Linh</title>
  <meta name="description" content="${esc(meta)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="author" content="Nguyễn Tử Linh">
  <link rel="author" href="/tac-gia/nguyen-tu-linh/">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="alternate" type="application/json" title="Dữ liệu giải đáp nghề mỏ" href="${BASE}/daily-seo-articles.json">
  <meta property="og:type" content="${type}"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">
  <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(meta)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${esc(image)}"><meta property="og:image:alt" content="${esc(title)}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(meta)}"><meta name="twitter:image" content="${esc(image)}">
  <link rel="stylesheet" href="/fonts.css?v=1"><link rel="stylesheet" href="/content-network.css?v=1"><link rel="stylesheet" href="/daily-seo.css?v=1"><link rel="stylesheet" href="/mobile-core.css?v=1">
  <style>.daily-seo-hero__grid--text-only{grid-template-columns:minmax(0,900px)}</style>
  <script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>`;
}

function header() {
  return `<a class="network-skip" href="#noi-dung">Đến nội dung chính</a><header class="network-header"><div class="network-wrap network-header__inner"><a class="network-brand" href="/"><img src="/assets/thay-linh-avatar.webp?v=3" alt="" width="44" height="44"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><nav class="network-nav" aria-label="Giải đáp nghề mỏ"><a href="${SERIES_PATH}" aria-current="page">Bài mới mỗi ngày</a><a href="/hoi-dap-di-lam-mo-than-quang-ninh/">20 câu hỏi</a><a href="/viec-lam-nganh-than/">Theo tỉnh</a><a href="/cam-nang-nghe-mo/">Cẩm nang</a></nav><a class="network-apply" href="/kiem-tra-dieu-kien/" data-contact="condition" data-context="daily-seo-header">Kiểm tra điều kiện</a></div></header>`;
}

function footer() {
  return `<footer class="network-footer"><div class="network-wrap network-footer__inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Giải đáp trực tiếp câu hỏi của người lao động trước khi học nghề và làm mỏ tại Quảng Ninh.</p></div><div><a href="${SERIES_PATH}">Bài giải đáp mới</a><a href="/thong-tin-tuyen-tho-mo/">Thông tin đang áp dụng</a><a href="/nguyen-tac-bien-tap/">Nguyên tắc biên tập</a></div><div><a href="/tac-gia/nguyen-tu-linh/">Người phụ trách</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="daily-seo-footer">Zalo 096 304 8585</a><a href="tel:+84963048585" data-contact="phone" data-context="daily-seo-footer">Gọi 096 304 8585</a></div></div></footer>`;
}

function sectionMarkup(section, index) {
  const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
  const items = (section.items || []).map((item) => `<li>${esc(item)}</li>`).join("");
  return `<section class="daily-seo-section${index % 2 ? " daily-seo-section--soft" : ""}"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">GIẢI THÍCH RÕ TỪNG Ý</p><h2>${esc(section.heading)}</h2>${paragraphs}${items ? `<ul>${items}</ul>` : ""}</div></section>`;
}

function articlePage(article) {
  const canonical = `${BASE}${SERIES_PATH}${article.slug}/`;
  const points = article.key_points.map(([title, text], index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><h2>${esc(title)}</h2><p>${esc(text)}</p></article>`).join("");
  const faqs = article.faqs.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("");
  const related = article.related.map(([href, label]) => `<a href="${href}">${esc(label)} →</a>`).join("");
  return `<!doctype html><html lang="vi">${head({title: article.title, meta: article.meta, canonical, graph: graphFor(article), image: article.image.src})}<body class="daily-seo-page">${header()}<main id="noi-dung"><article><header class="daily-seo-hero"><div class="network-wrap daily-seo-hero__grid"><div><p class="network-eyebrow">${esc(article.eyebrow)}</p><h1>${esc(article.title)}</h1><p class="daily-seo-answer" id="tra-loi-truc-tiep">${esc(article.direct_answer)}</p><div class="daily-seo-actions"><a class="network-button" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="daily-seo-hero">Hỏi Thầy Linh qua Zalo</a><a class="network-button network-button--outline" href="/kiem-tra-dieu-kien/">Tự kiểm tra điều kiện</a></div><p class="daily-seo-date">Đăng ngày <time datetime="${article.publish_on}">${article.publish_on.split("-").reverse().join("/")}</time> · Nguyễn Tử Linh biên soạn</p></div><figure><img src="${esc(article.image.src)}" alt="${esc(article.image.alt)}" referrerpolicy="no-referrer" loading="eager"${imageSize(article.image.src)}><figcaption>${esc(article.image.credit)}</figcaption></figure></div></header><section class="daily-seo-section"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">TRẢ LỜI TRỰC TIẾP</p><h2>Điều cần hiểu trước tiên</h2>${article.intro.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}<div class="daily-seo-points">${points}</div></div></section>${article.sections.map(sectionMarkup).join("")}<section class="daily-seo-section daily-seo-section--soft"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">KẾT LUẬN NGẮN</p><h2>${esc(article.takeaway_title)}</h2><p class="daily-seo-takeaway">${esc(article.takeaway)}</p><div class="daily-seo-source"><strong>Căn cứ biên soạn:</strong> ${esc(article.source_note)} <a href="/thong-tin-tuyen-tho-mo/">Đối chiếu thông tin đang áp dụng →</a></div></div></section><section class="daily-seo-section"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">NGƯỜI LAO ĐỘNG CŨNG HỎI</p><h2>Câu hỏi liên quan</h2><div class="daily-seo-faq">${faqs}</div></div></section><section class="daily-seo-section daily-seo-section--soft"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">ĐỌC TIẾP</p><h2>Ba trang nên xem cùng</h2><div class="daily-seo-related">${related}</div></div></section><section class="daily-seo-final"><div class="network-wrap"><div><h2>Chưa cần lên Quảng Ninh ngay</h2><p>Gửi năm sinh, nơi ở, chiều cao, cân nặng và sức khỏe để được kiểm tra sơ bộ trước khi chuẩn bị hồ sơ.</p></div><div class="daily-seo-actions"><a class="network-button" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="daily-seo-final">Nhắn Zalo</a><a class="network-button network-button--outline" href="/lien-he-di-lam-mo-than-quang-ninh/">Xem đầu mối chính thức</a></div></div></section></article></main>${footer()}<script src="/analytics.js?v=6" defer></script><script src="/mobile-core.js?v=1" defer></script><script src="/site-shell-20260803.js?v=3" defer></script></body></html>\n`;
}

function hubGraph() {
  const url = `${BASE}${SERIES_PATH}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["CollectionPage", "WebPage"],
        "@id": `${url}#webpage`,
        url,
        name: data.hub.title,
        description: data.hub.meta,
        inLanguage: "vi-VN",
        dateModified: releaseDate,
        author: {"@id": `${BASE}/tac-gia/nguyen-tu-linh/#person`},
        mainEntity: {"@id": `${url}#items`},
      },
      {
        "@type": "ItemList",
        "@id": `${url}#items`,
        numberOfItems: released.length,
        itemListElement: released.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: article.title,
          url: `${BASE}${SERIES_PATH}${article.slug}/`,
        })),
      },
    ],
  };
}

function hubPage() {
  const canonical = `${BASE}${SERIES_PATH}`;
  const cards = released.map((article) => `<article class="daily-seo-card"><img src="${esc(article.image.src)}" alt="${esc(article.image.alt)}" loading="lazy" referrerpolicy="no-referrer"${imageSize(article.image.src)}><div><small>${article.publish_on.split("-").reverse().join("/")}</small><h2>${esc(article.title)}</h2><p>${esc(article.direct_answer)}</p><a href="${SERIES_PATH}${article.slug}/">Đọc câu trả lời đầy đủ →</a></div></article>`).join("");
  return `<!doctype html><html lang="vi">${head({title: data.hub.title, meta: data.hub.meta, canonical, graph: hubGraph(), image: `${BASE}/assets/og-cover-luong-25-trieu-v4.jpg`, type: "website"})}<body class="daily-seo-page">${header()}<main id="noi-dung"><section class="daily-seo-hub-hero"><div class="network-wrap"><p class="network-eyebrow">MỖI NGÀY MỘT CÂU HỎI THẬT</p><h1>${esc(data.hub.title)}</h1><p>${esc(data.hub.lead)}</p><div class="daily-seo-actions"><a class="network-button" href="/hoi-dap-di-lam-mo-than-quang-ninh/">Xem 20 câu hỏi nền tảng</a><a class="network-button network-button--outline" href="/lien-he-di-lam-mo-than-quang-ninh/">Liên hệ người phụ trách</a></div></div></section><section class="daily-seo-section daily-seo-section--soft"><div class="network-wrap"><div class="daily-seo-heading"><div><p class="network-eyebrow">BÀI ĐÃ XUẤT BẢN</p><h2>${released.length} câu trả lời có thể tra cứu</h2></div><p>Nội dung mới chỉ được công bố khi đã có câu hỏi riêng, câu trả lời trực tiếp, căn cứ và liên kết về thông tin tuyển đang áp dụng.</p></div><div class="daily-seo-card-grid">${cards}</div></div></section></main>${footer()}<script src="/analytics.js?v=6" defer></script><script src="/mobile-core.js?v=1" defer></script></body></html>\n`;
}

for (const article of released) {
  let articleHtml = articlePage(article);
  if (isOccupationArticle(article)) {
    articleHtml = articleHtml
      .replace('<body class="daily-seo-page">', '<body class="daily-seo-page occupation-text-only">')
      .replace('class="network-wrap daily-seo-hero__grid"', 'class="network-wrap daily-seo-hero__grid daily-seo-hero__grid--text-only"')
      .replace(/<figure><img\b[^>]*><figcaption>[\s\S]*?<\/figcaption><\/figure>/i, "");
  }
  write(`giai-dap-nghe-mo/${article.slug}/index.html`, articleHtml);
}
write("giai-dap-nghe-mo/index.html", hubPage());

const machineFeed = {
  version: data.version,
  updated_at: releaseDate,
  canonical_hub: `${BASE}${SERIES_PATH}`,
  publisher: "Thầy Linh – Tuyển Thợ Mỏ",
  articles: released.map((article) => ({
    title: article.title,
    primary_query: article.primary_query,
    direct_answer: article.direct_answer,
    date_published: article.publish_on,
    canonical_url: `${BASE}${SERIES_PATH}${article.slug}/`,
    source_note: article.source_note,
  })),
};
write("daily-seo-articles.json", `${JSON.stringify(machineFeed, null, 2)}\n`);

let sitemap = read("sitemap.xml");
sitemap = sitemap.replace(/\s*<url><loc>https:\/\/thaylinhtuyenthomo\.vn\/giai-dap-nghe-mo\/[\s\S]*?<\/url>/g, "");
const sitemapEntries = [
  `  <url><loc>${BASE}${SERIES_PATH}</loc><lastmod>${releaseDate}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
  ...released.map((article) => `  <url><loc>${BASE}${SERIES_PATH}${article.slug}/</loc><lastmod>${article.publish_on}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
].join("\n");
sitemap = sitemap.replace("</urlset>", `${sitemapEntries}\n</urlset>`);
write("sitemap.xml", sitemap);

let llms = read("llms.txt");
llms = llms.replace(/\n## Giải đáp nghề mỏ hằng ngày[\s\S]*?(?=\n## )/, "");
const llmsSection = [
  "",
  "## Giải đáp nghề mỏ hằng ngày",
  "",
  `- Trang trung tâm: [${data.hub.title}](${BASE}${SERIES_PATH}).`,
  `- Dữ liệu máy đọc: [daily-seo-articles.json](${BASE}/daily-seo-articles.json).`,
  ...released.map((article) => `- [${article.title}](${BASE}${SERIES_PATH}${article.slug}/): ${article.direct_answer}`),
  "",
].join("\n");
const llmsAnchor = llms.includes("\n## Dữ liệu máy đọc và nguồn cập nhật")
  ? "\n## Dữ liệu máy đọc và nguồn cập nhật"
  : llms.includes("\n## Trang trả lời theo nhu cầu tìm kiếm")
    ? "\n## Trang trả lời theo nhu cầu tìm kiếm"
    : "\n## Trang thông tin hiện hành";
if (!llms.includes(llmsAnchor)) throw new Error("Không tìm thấy vị trí chèn dữ liệu SEO hằng ngày trong llms.txt");
llms = llms.replace(llmsAnchor, `${llmsSection}${llmsAnchor}`);
write("llms.txt", llms);

let home = read("index.html");
if (!home.includes("/daily-seo.css?v=1")) home = home.replace("</head>", "  <link rel=\"stylesheet\" href=\"/daily-seo.css?v=1\">\n</head>");
home = home.replace(/<!-- daily-seo:start -->[\s\S]*?<!-- daily-seo:end -->/g, "");
const homeCards = released.slice(0, 3).map((article) => ({
  href: `${SERIES_PATH}${article.slug}/`,
  kicker: article.publish_on.split("-").reverse().join("/"),
  title: article.title,
  answer: article.direct_answer,
  query: article.primary_query,
}));
const evergreenHomeAnswers = [
  {
    href: "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/",
    kicker: "GIẢI ĐÁP CƠ BẢN",
    title: "Đi làm mỏ than có cần kinh nghiệm không?",
    answer: "Không yêu cầu kinh nghiệm làm mỏ sẵn có. Người đủ điều kiện được đào tạo từ đầu, học nghề và thực hành trước khi doanh nghiệp tiếp nhận, bố trí việc làm.",
    query: "đi làm mỏ than có cần kinh nghiệm không",
  },
  {
    href: "/nghe-mo-ham-lo/",
    kicker: "CHỌN NGHỀ PHÙ HỢP",
    title: "Nên chọn khai thác, xây dựng hay cơ điện mỏ?",
    answer: "Khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng. Hãy chọn theo nội dung công việc, khả năng học và nhu cầu tiếp nhận của đợt tuyển.",
    query: "nên học khai thác mỏ hay xây dựng mỏ hầm lò",
  },
];
for (const answer of evergreenHomeAnswers) {
  if (homeCards.length >= 3) break;
  if (homeCards.some((card) => card.query === answer.query)) continue;
  homeCards.push(answer);
}
const homeLinks = homeCards.map((card) => `<a href="${card.href}"><small>${esc(card.kicker)}</small><strong>${esc(card.title)}</strong><span>${esc(card.answer)}</span></a>`).join("");
const homeBlock = `\n    <!-- daily-seo:start --><section class="home-daily-seo" aria-labelledby="home-daily-seo-title"><div class="container"><div class="home-daily-seo__head"><div><p class="home-step">Giải đáp mới mỗi ngày</p><h2 id="home-daily-seo-title">Người lao động hỏi gì, website trả lời thẳng câu đó</h2></div><a href="${SERIES_PATH}">Xem toàn bộ →</a></div><div class="home-daily-seo__grid">${homeLinks}</div></div></section><!-- daily-seo:end -->\n`;
const homeAnchor = "    <nav class=\"home-content-shortcuts";
if (!home.includes(homeAnchor)) throw new Error("Không tìm thấy vị trí chèn bài SEO hằng ngày trên trang chủ");
home = home.replace(homeAnchor, `${homeBlock}${homeAnchor}`);
write("index.html", home);

let guide = read("cam-nang-nghe-mo/index.html");
guide = guide.replace(/\n\s*<!-- daily-seo-guide:start -->[\s\S]*?<!-- daily-seo-guide:end -->\s*/g, "\n");
const guideBlock = `\n<!-- daily-seo-guide:start --><section class="network-section network-section--soft"><div class="network-wrap"><div class="network-heading"><div><p class="network-eyebrow">CÂU HỎI MỚI MỖI NGÀY</p><h2>Giải đáp theo đúng cách người lao động tìm kiếm</h2></div><p>Mỗi bài chỉ trả lời một nhu cầu riêng, có câu trả lời ngắn, nội dung kiểm chứng và đường liên hệ rõ ràng.</p></div><div class="network-grid">${released.slice(0, 3).map((article) => `<article class="network-card"><div class="network-card__body"><small>${article.publish_on.split("-").reverse().join("/")}</small><h2>${esc(article.title)}</h2><p>${esc(article.direct_answer)}</p><a href="${SERIES_PATH}${article.slug}/">Đọc câu trả lời →</a></div></article>`).join("")}</div><div class="network-actions"><a class="network-button network-button--outline" href="${SERIES_PATH}">Mở kho giải đáp hằng ngày</a></div></div></section><!-- daily-seo-guide:end -->\n`;
if (!guide.includes("</main>")) throw new Error("Trang cẩm nang thiếu </main>");
guide = guide.replace("</main>", `${guideBlock}</main>`);
write("cam-nang-nghe-mo/index.html", guide);

console.log(JSON.stringify({releaseDate, released: released.length, latest: released[0]?.slug || null, hub: SERIES_PATH}, null, 2));
