import fs from "node:fs";
import path from "node:path";
import {curatedArticles, existingNews} from "./curated-articles.mjs";
import {communityArticles} from "./community-articles.mjs";
import {communitySourceImages} from "./community-source-images.mjs";
import {pressStoryArticles} from "./press-story-articles.mjs";
import {articleInlineImages} from "./article-inline-images.mjs";
import {buildRecruitmentAnswers} from "./recruitment-answers.mjs";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const author = "Nguyễn Tử Linh";
const recruitment = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const imageDimensions = JSON.parse(fs.readFileSync(path.resolve("content/article-image-dimensions.json"), "utf8"));
const criteria = recruitment.criteria;
const recruitmentAnswers = buildRecruitmentAnswers(recruitment);
const buildTime = recruitment.updated_at;
const homepageModified = "2026-08-03";
const currentFactsUrl = `${base}/thong-tin-tuyen-tho-mo/`;
const editorialPolicyUrl = `${base}/nguyen-tac-bien-tap/`;
const authorUrl = `${base}/tac-gia/nguyen-tu-linh/`;
const organizationId = `${base}/#organization`;
const websiteId = `${base}/#website`;
const allEditorial = [
  ...curatedArticles.map((article) => ({...article, urlPath: `bai-viet/${article.slug}`})),
  ...existingNews,
  ...communityArticles,
  ...pressStoryArticles,
];
const generatedArticles = [
  ...curatedArticles.map((article) => ({...article, urlPath: `bai-viet/${article.slug}`})),
  ...communityArticles,
  ...pressStoryArticles,
];

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const xml = esc;

function publicPageUrl(file) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return base + "/";
  return base + "/" + relative.replace(/index\.html$/, "");
}

function normalizePageAssets(html, file) {
  const hadRemoteFonts = /https:\/\/fonts\.(?:googleapis|gstatic)\.com/i.test(html);
  let output = html.replace(/\s*<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>/gi, "");
  if (hadRemoteFonts && !output.includes('href="/fonts.css')) {
    output = output.replace(/<\/head>/i, '  <link rel="stylesheet" href="/fonts.css?v=2">\n</head>');
  }
  if (!output.includes('class="source-original-card"')) output = output.replace(/\/mobile-ux\.js\?v=\d+/g, "/mobile-ux.js?v=10");
  return output.replace(/<img\b[^>]*>/gi, (tag) => {
    const source = tag.match(/\bsrc=(["'])(.*?)\1/i)?.[2];
    if (!source) return tag;
    let key;
    try { key = new URL(source.replaceAll("&amp;", "&"), publicPageUrl(file)).href; }
    catch { return tag; }
    const dimensions = imageDimensions[key];
    if (!dimensions) return tag;
    const missing = [];
    if (!/\bwidth=["']\d+["']/i.test(tag)) missing.push('width="' + dimensions[0] + '"');
    if (!/\bheight=["']\d+["']/i.test(tag)) missing.push('height="' + dimensions[1] + '"');
    return missing.length ? tag.replace(/>$/, " " + missing.join(" ") + ">") : tag;
  });
}

const articleBodyPattern = /<article\b[^>]*class=["'][^"']*\barticle-body\b[^"']*["'][^>]*>[\s\S]*?<\/article>/i;

function mergeArticleIntoExistingShell(file, generatedHtml) {
  if (!fs.existsSync(file)) return generatedHtml;
  const existingHtml = fs.readFileSync(file, "utf8");
  const existingArticle = existingHtml.match(articleBodyPattern)?.[0];
  const generatedArticle = generatedHtml.match(articleBodyPattern)?.[0];
  if (!existingArticle || !generatedArticle) return generatedHtml;
  const merged = existingHtml
    .replace(articleBodyPattern, generatedArticle)
    .replace(/article-insights\.css\?v=\d+/g, "article-insights.css?v=14");
  return `${merged.trimEnd()}\n`;
}

function mergeHubIntoExistingShell(file, generatedHtml) {
  if (!fs.existsSync(file)) return generatedHtml;
  const mainPattern = /<main\b[^>]*\bid=["']noi-dung["'][^>]*>[\s\S]*?<\/main>/i;
  const conversionPattern = /<section class="v5-intent-hub"[\s\S]*?<\/section><section class="v4-final-conversion"[\s\S]*?<\/section>/i;
  const existingHtml = fs.readFileSync(file, "utf8");
  const generatedMain = generatedHtml.match(mainPattern)?.[0];
  const existingConversion = existingHtml.match(conversionPattern)?.[0] || "";
  if (!generatedMain || !mainPattern.test(existingHtml)) return generatedHtml;
  let output = existingHtml.replace(mainPattern, generatedMain.replace(/<\/main>$/i, `${existingConversion}</main>`));
  const headPatterns = [
    /<title>[\s\S]*?<\/title>/i,
    /<meta\s+name="description"[^>]*>/i,
    /<meta\s+property="og:title"[^>]*>/i,
    /<meta\s+property="og:description"[^>]*>/i,
    /<meta\s+property="og:image"[^>]*>/i,
    /<meta\s+name="twitter:title"[^>]*>/i,
    /<meta\s+name="twitter:description"[^>]*>/i,
    /<meta\s+name="twitter:image"[^>]*>/i,
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
  ];
  for (const pattern of headPatterns) {
    const generatedTag = generatedHtml.match(pattern)?.[0];
    if (generatedTag && pattern.test(output)) output = output.replace(pattern, generatedTag);
  }
  output = output.replace(/article-insights\.css\?v=\d+/g, "article-insights.css?v=14");
  return `${output.trimEnd()}\n`;
}

const displayDate = (iso) => new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Bangkok",
}).format(new Date(iso));

const actionHeadings = {
  "Hướng dẫn nhập nghề": "Những việc cần chuẩn bị",
  "Thu nhập & việc làm": "Bắt đầu từ tay nghề và kỷ luật",
  "Công nghệ mỏ": "Người mới cần chuẩn bị gì?",
  "Tay nghề & đào tạo": "Từ lớp học đến nơi làm việc",
  "An toàn & sức khỏe": "Chuẩn bị cho một ca làm an toàn",
  "Đời sống thợ mỏ": "Thông tin nên biết trước khi vào nghề",
  "Mỏ xanh & môi trường": "Vai trò của người thợ trong mỏ hiện đại",
  "Việc làm ngành Than": "Thông tin cần kiểm tra trước khi đăng ký",
  "Kết nối địa phương": "Người lao động tại địa phương cần chuẩn bị gì?",
  "An sinh xã hội": "Theo dõi chương trình qua đầu mối chính thức",
  "Chuyện người thợ mỏ": "Những chi tiết làm nên câu chuyện",
};

const conclusionHeadings = {
  "Hướng dẫn nhập nghề": "Chuẩn bị đúng để ngày nhập học thuận lợi",
  "Thu nhập & việc làm": "Thu nhập được xây từ năng lực làm việc",
  "Công nghệ mỏ": "Tay nghề lớn lên cùng công nghệ",
  "Tay nghề & đào tạo": "Thực hành tạo nên người thợ vững nghề",
  "An toàn & sức khỏe": "An toàn bắt đầu từ từng thao tác đúng",
  "Đời sống thợ mỏ": "Sự gắn bó được tạo nên trong và ngoài ca làm",
  "Mỏ xanh & môi trường": "Hiện đại hóa đi cùng trách nhiệm",
  "Việc làm ngành Than": "Một lựa chọn nghề nghiệp cần được cân nhắc kỹ",
  "Kết nối địa phương": "Từ quê nhà đến lớp học và nơi làm việc",
  "An sinh xã hội": "Hiệu quả được nhìn từ thay đổi trong đời sống",
  "Chuyện người thợ mỏ": "Điều còn lại sau câu chuyện",
};

function sourceText(article) {
  const sources = Array.isArray(article.sources) ? article.sources : [];
  if (!sources.length) return "Thầy Linh – Tuyển Thợ Mỏ";
  return sources.map((source) => {
    const sourceTitle = String(source.title || "").trim();
    const displayedTitle = /^["'“”‘’]/u.test(sourceTitle) ? sourceTitle : `“${sourceTitle}”`;
    return [
      source.publisher,
      sourceTitle ? displayedTitle : "",
      source.date || "",
    ].filter(Boolean).join(", ");
  }).join("; ");
}

function isoSourceDate(value = "") {
  const match = String(value).trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : "";
}

function sourceUrl(source) {
  if (source.url) return source.url;
  if (["Phòng Tuyển sinh Miền Trung", "Trường Cao đẳng Than - Khoáng sản Việt Nam"].includes(source.publisher)) return currentFactsUrl;
  return "";
}

function sourceCreativeWork(source) {
  const datePublished = isoSourceDate(source.date);
  const url = sourceUrl(source);
  return {
    "@type": "CreativeWork",
    name: source.title || source.publisher,
    ...(url ? {url} : {}),
    ...(datePublished ? {datePublished} : {}),
    publisher: {"@type": "Organization", name: source.publisher},
  };
}

function seoText(article) {
  if (article.seoLine) return article.seoLine;
  const keywords = (article.keywords || []).slice(0, 4).filter(Boolean);
  if (!keywords.length) return "Tìm hiểu nghề thợ lò, học nghề mỏ và việc làm ngành Than tại Quảng Ninh cùng Thầy Linh.";
  return `Tìm hiểu thêm về ${keywords.join(", ")} trên Thầy Linh – Tuyển Thợ Mỏ.`;
}

function searchTitle(article) {
  if (article.seoTitle) return article.seoTitle;
  return article.title.length > 52 ? article.title : `${article.title} | Thầy Linh`;
}

function renderSourceFooter(article, compact = false) {
  if (compact) {
    return `<div class="article-source-footer article-source-footer--brief"><p><strong>Nguồn:</strong> ${esc(sourceText(article))}</p><p class="article-seo-line">${esc(seoText(article))}</p><p class="article-current-facts"><a href="/thong-tin-tuyen-tho-mo/">Xem thông tin tuyển sinh đang áp dụng →</a></p></div>`;
  }
  return `<div class="article-source-footer"><p class="article-current-facts"><a href="/thong-tin-tuyen-tho-mo/">Đối chiếu 15 câu hỏi về điều kiện, học nghề, hồ sơ và thu nhập đang áp dụng →</a></p><p><strong>Nguồn:</strong> ${esc(sourceText(article))}</p><p class="article-seo-line">${esc(seoText(article))}</p></div>`;
}

function upgradeExistingSchema(html, article) {
  const canonical = `${base}/${article.urlPath}/`;
  return html.replace(/<script\b([^>]*)type=["']application\/ld\+json["']([^>]*)>([\s\S]*?)<\/script>/i, (full, before, after, payload) => {
    const schema = JSON.parse(payload);
    const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
    const articleNode = graph.find((node) => ["Article", "NewsArticle"].includes(node?.["@type"]));
    const webpageNode = graph.find((node) => node?.["@type"] === "WebPage");
    if (!articleNode) return full;
    const sourceWorks = article.hideSourceUrlsInSchema ? [] : (article.sources || []).map(sourceCreativeWork);
    const sourceUrls = article.hideSourceUrlsInSchema ? [] : (article.sources || []).map(sourceUrl).filter(Boolean);
    articleNode.headline = article.title;
    articleNode.description = article.schemaDescription || article.description;
    articleNode.image = [article.image];
    articleNode.author = {"@type": "Person", "@id": `${base}/tac-gia/nguyen-tu-linh/#person`, name: author, alternateName: "Thầy Linh – Tuyển Thợ Mỏ", url: `${base}/tac-gia/nguyen-tu-linh/`};
    articleNode.publisher = {"@type": "Organization", "@id": organizationId, name: "Thầy Linh – Tuyển Thợ Mỏ", url: `${base}/`, logo: {"@type": "ImageObject", "@id": `${base}/#logo`, url: `${base}/favicon-512x512.png`, width: 512, height: 512}, publishingPrinciples: editorialPolicyUrl};
    articleNode.publishingPrinciples = editorialPolicyUrl;
    articleNode.about = (article.keywords || []).map((keyword) => ({"@type": "Thing", name: keyword}));
    if (sourceUrls.length) articleNode.isBasedOn = sourceUrls;
    if (sourceWorks.length) articleNode.citation = sourceWorks;
    if (webpageNode) Object.assign(webpageNode, {url: canonical, name: article.title, datePublished: article.published, dateModified: article.updated, inLanguage: "vi-VN", isPartOf: {"@id": websiteId}, author: {"@id": `${authorUrl}#person`}, publisher: {"@id": organizationId}, publishingPrinciples: editorialPolicyUrl, mainEntity: {"@id": `${canonical}#article`}});
    return `<script${before}type="application/ld+json"${after}>${JSON.stringify(schema)}</script>`;
  });
}

function syncExistingArticleImage(html, article) {
  const dimensions = imageDimensions[article.image] || [];
  const [width, height] = dimensions;
  let output = html
    .replace(/(<meta property="og:image" content=")[^"]*(")/i, `$1${article.image}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*(")/i, `$1${esc(article.imageAlt)}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/i, `$1${article.image}$2`);
  if (width && height) {
    output = output
      .replace(/(<meta property="og:image:width" content=")[^"]*(")/i, `$1${width}$2`)
      .replace(/(<meta property="og:image:height" content=")[^"]*(")/i, `$1${height}$2`);
  }
  const size = width && height ? ` width="${width}" height="${height}"` : "";
  const loading = html.includes("article-body--professional") || html.includes("article-body--journalistic-v2")
    ? ' fetchpriority="high" decoding="async" referrerpolicy="no-referrer"'
    : ' loading="lazy" decoding="async"';
  const figure = `<figure class="article-cover article-cover--editorial"><img src="${article.image}" alt="${esc(article.imageAlt)}"${loading}${size}><figcaption><span>${esc(article.imageAlt)}</span><span class="article-media-credit">${esc(article.imageSource)}</span></figcaption></figure>`;
  return output.replace(/<figure\b[^>]*class="[^"]*\barticle-cover\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i, figure);
}

function renderArticleShare(article) {
  const canonical = `${base}/${article.urlPath}/`;
  const content = `article_${article.slug}`;
  const tracked = `${canonical}?utm_source=website&amp;utm_medium=share&amp;utm_campaign=lan_toa_nghe_mo_2026&amp;utm_content=${content}`;
  return `<section class="article-share-panel" data-article-share data-share-title="${esc(article.title)}" data-share-url="${canonical}" data-share-content="${content}">
          <p class="network-eyebrow">LAN TỎA THÔNG TIN ĐÚNG NGUỒN</p>
          <h2>Gửi bài này cho người đang tìm hiểu nghề mỏ</h2>
          <p>Liên kết chia sẻ có mã đo nguồn nhưng không chứa thông tin cá nhân của người đọc hoặc ứng viên.</p>
          <div class="article-share-panel__actions"><button type="button" data-share-native>Chia sẻ trên thiết bị</button><button type="button" data-share-copy>Sao chép liên kết</button><a href="${tracked}" data-share-link>Mở liên kết có mã nguồn</a><a href="/chia-se-thong-tin/?article=${encodeURIComponent(article.slug)}">Tạo gói theo tỉnh</a></div>
          <p class="share-status" data-share-status role="status" aria-live="polite"></p>
        </section>`;
}

function renderArticleApply(article) {
  const recruitmentArticle = article.slug === "viec-lam-nganh-than-thang-8-2026";
  const content = `article_${article.slug}`;
  const applicationUrl = `/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=article_to_application_2026&amp;utm_content=${content}#dang-ky`;
  const eyebrow = recruitmentArticle ? "ĐĂNG KÝ TUYỂN THỢ MỎ THÁNG 8/2026" : "KIỂM TRA TRƯỚC KHI CHUẨN BỊ HỒ SƠ";
  const title = recruitmentArticle ? "Gửi thông tin để được kiểm tra điều kiện" : "Muốn biết mình có phù hợp nghề mỏ?";
  const text = recruitmentArticle
    ? "Biểu mẫu khoảng một phút giúp đối chiếu tuổi, thể hình và sức khỏe ban đầu. Lần đăng ký đầu chưa cần nộp hoặc gửi ảnh giấy tờ."
    : "Biểu mẫu khoảng một phút giúp đối chiếu điều kiện ban đầu và chuyển thông tin đến Thầy Linh. Lần đăng ký đầu chưa cần nộp hoặc gửi ảnh giấy tờ.";
  const button = recruitmentArticle ? "Kiểm tra điều kiện ngay" : "Kiểm tra điều kiện trong một phút";
  const currentFactsAction = recruitmentArticle
    ? ""
    : '<a class="article-apply__secondary" href="/thong-tin-tuyen-tho-mo/">Xem thông tin tuyển sinh</a>';
  return `<section class="article-apply" aria-labelledby="article-apply-title-${esc(article.slug)}">
          <small>${eyebrow}</small>
          <h2 id="article-apply-title-${esc(article.slug)}">${title}</h2>
          <p>${text}</p>
          <div class="article-apply__actions">
            <a href="${applicationUrl}" data-contact="application" data-context="article-apply" data-application-resume-label>${button}</a>${currentFactsAction ? `
            ${currentFactsAction}` : ""}
            <a class="article-apply__secondary" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="article-apply">Trao đổi qua Zalo</a>
          </div>
        </section>`;
}

function asideApplicationUrl(article) {
  return `/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=article_aside_to_application_2026&amp;utm_content=aside_${article.slug}#dang-ky`;
}

function articleAsideCta(article) {
  const applicationUrl = asideApplicationUrl(article);
  return {
    "Thu nhập & việc làm": {
      title: "Tìm hiểu nghề trước khi tính chuyện đường dài",
      text: "Kiểm tra điều kiện, nội dung đào tạo và công việc sau khóa học để lựa chọn bằng thông tin rõ ràng.",
      button: "Kiểm tra điều kiện học nghề",
      href: applicationUrl,
      contact: "application",
    },
    "Công nghệ mỏ": {
      title: "Nghề mỏ đang thay đổi cùng công nghệ",
      text: "Người mới được học từ nền tảng trước khi làm quen thiết bị, quy trình và nhịp sản xuất hiện đại.",
      button: "Xem lộ trình học nghề",
      href: "/bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/",
    },
    "Tay nghề & đào tạo": {
      title: "Tay nghề bắt đầu từ những buổi học đầu tiên",
      text: "Gửi thông tin ban đầu để kiểm tra sự phù hợp với chương trình học nghề và công việc tại Quảng Ninh.",
      button: "Kiểm tra điều kiện học nghề",
      href: applicationUrl,
      contact: "application",
    },
    "Kết nối địa phương": {
      title: "Kiểm tra thông tin đang áp dụng tại địa phương bạn",
      text: "Nếu bài viết nhắc tới địa bàn của bạn, bước tiếp theo là gửi 3 thông tin để đối chiếu điều kiện trước khi chuẩn bị hồ sơ.",
      button: "Kiểm tra điều kiện theo mẫu chung",
      href: applicationUrl,
      contact: "application",
    },
    "An sinh xã hội": {
      title: "Hiểu thêm về con người ngành Than",
      text: "Những chương trình cộng đồng cho thấy tinh thần đồng tâm của người thợ được gìn giữ cả trong và ngoài sản xuất.",
      button: "Đọc thêm chuyện nghề mỏ",
      href: "/tin-nganh-than/#an-sinh-xa-hoi",
    },
    "Chuyện người thợ mỏ": {
      title: "Hiểu nghề qua những người đang làm nghề",
      text: "Câu chuyện có nguồn giúp người đọc nhìn rõ nhịp ca, tay nghề, an toàn, đồng đội và đời sống phía sau gương than.",
      button: "Xem lộ trình học nghề",
      href: "/bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/",
    },
  }[article.section] || {
    title: "Tìm hiểu nghề mỏ bằng thông tin rõ ràng",
    text: "Gửi năm sinh, chiều cao, cân nặng và tình trạng sức khỏe để được kiểm tra điều kiện trước khi chuẩn bị hồ sơ.",
    button: "Trao đổi với Thầy Linh",
    href: "https://zalo.me/0963048585",
    contact: "zalo",
    external: true,
  };
}

function renderArticleAsideCta(article) {
  const cta = articleAsideCta(article);
  const attrs = [
    `href="${cta.href}"`,
    cta.external ? 'target="_blank" rel="noopener noreferrer"' : "",
    cta.contact ? `data-contact="${cta.contact}"` : "",
    'data-context="article-aside"',
    `data-article-aside-action="${cta.contact || "read"}"`,
  ].filter(Boolean).join(" ");
  return `<div class="aside-card accent"><h2>${esc(cta.title)}</h2><p>${esc(cta.text)}</p><a ${attrs}>${esc(cta.button)}</a></div>`;
}

function renderFacts(facts) {
  return `<div class="fact-grid">${facts.map(([value, label]) => `<div class="fact-card"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join("")}</div>`;
}

function renderFigure(media, className = "article-inline-media", eager = false) {
  const alt = String(media.alt || "").replace(/^Ảnh\s+bài\s+gốc\s*:\s*/iu, "").trim();
  const caption = String(media.caption || media.alt || "").replace(/^Ảnh\s+bài\s+gốc\s*:\s*/iu, "").trim();
  const rawCredit = String(media.credit || "")
    .replace(/^Ảnh\s+bài\s+gốc\s*[·:]\s*/iu, "")
    .replace(/^Ảnh\s+trong\s+bài\s+[^·]+\s*·\s*/iu, "")
    .trim();
  const visibleCredit = media.suppressLabel || /^Ảnh(?:\s|:)/iu.test(rawCredit) ? rawCredit : `Ảnh: ${rawCredit}`;
  const credit = rawCredit ? `<span class="article-media-credit">${esc(visibleCredit)}</span>` : "";
  const referrerPolicy = media.referrerPolicy || "no-referrer";
  return `<figure class="${className}"><img src="${esc(media.src)}" alt="${esc(alt)}" ${eager ? "fetchpriority=\"high\"" : "loading=\"lazy\""} decoding="async" referrerpolicy="${esc(referrerPolicy)}"><figcaption><span>${esc(caption)}</span>${credit}</figcaption></figure>`;
}

function renderArticleCover(article) {
  return renderFigure({
    src: article.image,
    alt: article.imageAlt,
    caption: article.imageCaption || article.imageAlt,
    credit: article.imageCredit || article.imageSource,
    referrerPolicy: article.imageReferrerPolicy,
    suppressLabel: article.suppressImageLabel,
  }, "article-cover article-cover--editorial", true);
}

function renderSections(sections, inlineImages = []) {
  const legacyImages = inlineImages.filter((media) => !Number.isInteger(media.afterSection));
  return sections.map((section, index) => {
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
    const bullets = section.bullets?.length
      ? `\n    <ul class="evidence-list">${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
      : "";
    const sectionImages = [
      ...inlineImages.filter((media) => media.afterSection === index),
      ...(legacyImages[index] ? [legacyImages[index]] : []),
    ];
    const inlineMedia = sectionImages.length
      ? `\n  <div class="article-inline-gallery">${sectionImages.map((media) => renderFigure(media)).join("")}</div>`
      : "";
    return `<section class="editorial-section">
    <h2>${esc(section.title)}</h2>
    ${paragraphs}${bullets}
  </section>${inlineMedia}`;
  }).join("");
}

const defensiveSentencePattern = /(?:\bkhông\s+(?:nên\s+|tự\s+)?(?:suy|hiểu|chia|cộng|biến)\b|\bkhông\s+đồng\s+nghĩa\b|\bkhông\s+phải\b[^.!?]*(?:quảng\s+cáo|tuyển\s+dụng|chính\s+sách|lời\s+mời|cam\s+kết|trợ\s+cấp))/iu;
const emptySourceSentencePattern = /(?:\bbài\s+(?:gốc|nguồn|báo)\s+(?:không|chưa)|\bnguồn(?:\s+chính\s+thức|\s+của\s+[^,.]+)?\s+(?:không|chưa)\s+(?:nêu|cho\s+biết|công\s+bố|làm\s+rõ|đề\s+cập)|\bthông\s+tin\s+nguồn\s+không)/iu;

function stripTags(value = "") {
  return String(value).replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+([,.;:!?])/g, "$1").replace(/\s+/g, " ").trim();
}

function capitalizeSentence(value = "") {
  return value.replace(/^([“"'‘’(]*)(\p{Ll})/u, (_match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("vi")}`);
}

function rewriteEditorialSentence(sentence = "") {
  let text = stripTags(sentence);
  if (!text || defensiveSentencePattern.test(text) || emptySourceSentencePattern.test(text) || /^tư\s+liệu\s+được\s+.+\s+đăng\s+ngày/iu.test(text) || /^bài\s+do\s+.+?\s+đăng\s+ngày/iu.test(text) || /^thông\s+tin\s+có\s+nguồn\s+/iu.test(text)) return "";
  text = text
    .replace(/^bài\s+phóng\s+sự(?:\s+ảnh)?\s+của\s+[^,]+?\s+(?:mở\s+ra\s+bằng|đưa\s+người\s+đọc|khắc\s+họa|ghi\s+lại)\s+/iu, "")
    .replace(/^phóng\s+sự(?:\s+ảnh)?\s+của\s+[^,]+?\s+đưa\s+người\s+đọc\s+/iu, "")
    .replace(/^phóng\s+sự\s+của\s+[^,]+?\s+đi\s+từ\s+/iu, "Câu chuyện đi từ ")
    .replace(/^(?:Báo\s+)?(?:Tiền\s+Phong|Nhân\s+Dân|Dân\s+trí|VOV|VTV|Báo\s+Công\s+Thương)\s+(?:đặt\s+cạnh\s+nhau|mở\s+ra\s+bằng|đưa\s+người\s+đọc|khắc\s+họa|ghi\s+lại)\s+/iu, "")
    .replace(/^theo\s+bài\s+do\s+[^,]+\s+phát\s+hành\s*[,,:-]?\s*/iu, "")
    .replace(/^bài\s+viết\s+về\s+.+?\s+tách\s+rõ\s+[^.!?]+[.!?]?$/iu, "")
    .replace(/^bài\s+viết\s+về\s+.+?\s+(?:cho\s+thấy|làm\s+rõ|thể\s+hiện)\s+/iu, "")
    .replace(/^bài\s+(?:viết|báo)\s+của\s+.+?\s+(?:mở\s+đầu|tập\s+hợp|chọn|khắc\s+họa|kể)\s+/iu, "")
    .replace(/^bài\s+(?:viết|báo|gốc|nguồn)(?:\s+của\s+.+?)?\s+(?:cũng\s+)?(?:cho\s+biết|cho\s+thấy|nêu|ghi(?:\s+nhận)?|công\s+bố|đề\s+cập|đưa\s+ví\s+dụ|làm\s+rõ|mô\s+tả|thể\s+hiện|sử\s+dụng|xác\s+định)\s+(?:rằng\s+)?/iu, "")
    .replace(/^bài\s+(?:viết|nguồn)\s+(?:chỉ\s+)?(?:nói|viết)\s+về\s+/iu, "")
    .replace(/^bài\s+viết\s+(?:giúp\s+người\s+đọc\s+hiểu|giải\s+thích|tổng\s+hợp)\s+/iu, "")
    .replace(/\bbài\s+(?:viết|báo|gốc|nguồn|năm\s+\d{4})(?:\s+về\s+[^,.]+?)?\s+(?:cũng\s+)?(?:cho\s+biết|cho\s+thấy|nêu|ghi(?:\s+nhận)?|đề\s+cập|làm\s+rõ|mô\s+tả|thể\s+hiện|xác\s+định)\s+/giu, "")
    .replace(/^tư\s+liệu\s+(?:cho\s+thấy|thể\s+hiện|ghi\s+nhận|làm\s+rõ)\s+/iu, "")
    .replace(/^nguồn\s+(?:nhắc\s+tới|đề\s+cập)\s+/iu, "")
    .replace(/^nguồn\s+chính\s+thức\s+dùng\s+mốc\s+/iu, "Mốc ")
    .replace(/^nguồn\s+được\s+rà\s+soát\s+nêu\s+/iu, "")
    .replace(/^nguồn(?:\s+chính\s+thức|\s+của\s+[^,.]+)?\s+(?:cho\s+biết|nêu|ghi(?:\s+nhận)?|xác\s+nhận|thống\s+kê|liệt\s+kê|thẳng\s+thắn\s+nêu)\s+(?:rằng\s+)?/iu, "")
    .replace(/^nguồn\s+(?:cho\s+phép|dùng)\s+[^.!?]+[.!?]?$/iu, "")
    .replace(/^(?:theo\s+(?:bài\s+(?:báo|viết|gốc|nguồn)|nguồn(?:\s+chính\s+thức)?)|trong\s+bài\s+(?:gốc|nguồn))\s*[,,:;-]?\s*/iu, "")
    .replace(/\btheo\s+(?:bài\s+(?:báo|viết|gốc|nguồn)|nguồn(?:\s+chính\s+thức)?)\b\s*[,,:;-]?\s*/giu, "")
    .replace(/\b(?:trong\s+)?bài\s+(?:gốc|nguồn)\b\s*[,,:;-]?\s*/giu, "")
    .replace(/\bnguồn(?:\s+chính\s+thức)?\s+(?:cũng\s+)?(?:nêu|cho\s+biết|cho\s+thấy|ghi(?:\s+nhận)?|công\s+bố|đề\s+cập|mô\s+tả|xác\s+định)\s*/giu, "")
    .replace(/\s+được\s+(?:nguồn(?:\s+chính\s+thức)?|bài\s+(?:báo|viết|gốc|nguồn))\s+(?:ghi\s+nhận|nêu|công\s+bố|đề\s+cập|mô\s+tả|sử\s+dụng)\b/giu, "")
    .replace(/,\s*nhưng\s+bài\s+viết\s+chỉ\s+dùng\s+phép\s+tính\s+này[^.!?]*[.!?]?$/iu, "")
    .replace(/\s+được\s+bài\s+báo\s+đặt\s+cạnh\s+câu\s+chuyện\s+sản\s+xuất/iu, " cùng tạo nên điều kiện sinh hoạt quanh ca sản xuất")
    .replace(/\bbài\s+viết\s+giúp\s+hiểu\s+thêm\b/giu, "đây là một lát cắt về")
    .replace(/^tác\s+giả\s+đi\s+bộ\s+từ\s+cửa\s+lò\s+để\s+cảm\s+nhận\s+rõ\s+/iu, "Từ cửa lò, hành trình đi bộ cho thấy rõ ")
    .replace(/^trong\s+lò,\s*phóng\s+viên\s+gặp\s+/iu, "Trong lò có ")
    .replace(/\bphóng\s+viên\s+gặp\s+/giu, "")
    .replace(/^giá\s+trị\s+lớn\s+nhất\s+của\s+phóng\s+sự\s+nằm\s+ở\s+/iu, "Điều đọng lại là ")
    .replace(/\s+/g, " ")
    .trim();
  return capitalizeSentence(text);
}

const professionalFactParagraphs = {
  "bang-thanh-phuc-loc-hoc-nghe-tho-lo-tkv": "Đại diện của 74 thôn thuộc hai xã cùng tham dự, tạo thành mạng lưới đưa thông tin từ hội nghị về từng khu dân cư.",
  "tho-mo-vao-ca-duong-huy": "Ca đầu ngày bắt đầu từ 7 giờ, sau khi công nhân có mặt tại khai trường từ khoảng 5 giờ 30 phút để ăn sáng, nhận trang bị và nghe giao việc. Ba ca nối tiếp nhau, mỗi ca kéo dài tám giờ; hệ thống lò chính và các nhánh lò dài khoảng 26 km, điểm sâu nhất trong hành trình ở mức -100 m.",
  "gia-dinh-ba-the-he-tho-mo-thong-nhat": "Mạch nghề của gia đình bắt đầu năm 1965, khi ông Nguyễn Đức Tông rời Thái Bình tới Quảng Ninh làm thợ lò. Người con Nguyễn Hồng Cẩm đã có gần 25 năm ở mỏ, còn Nguyễn Duy Khánh thuộc thế hệ thứ ba và đã làm việc dưới hầm lò sáu năm khi câu chuyện được ghi lại.",
  "ma-khac-huynh-nguoi-mo-duong-trong-long-dat": "Trước khi đổi nghề, Bùi Văn Tuyên đã làm việc tại quê chín năm; đến thời điểm được nhắc tới, anh có gần năm năm gắn bó với mỏ. Ma Khắc Huỳnh đi theo một lối khác: chọn học nghề từ cuối phổ thông và có hơn tám năm làm công việc đào lò.",
  "mot-ngay-trong-lo-than-duong-huy": "Khoảng 700 công nhân làm việc trong các hầm lò mỗi ngày. Từ chặng xe chở người, họ tiếp tục đi bộ khoảng 20 phút tới khu vực sản xuất ở độ sâu 150–300 m, nơi nhiệt độ có lúc khoảng 30°C và độ ẩm luôn ở mức cao.",
  "nhung-nguoi-tho-lo-gieo-no-luc": "Phan Văn Đạo có 14 năm gắn bó với nghề, Hán Cao Phi đã làm cơ điện lò 17 năm. Lê Văn Biên có hai sáng kiến kỹ thuật được ghi nhận và từng kèm hơn 20 thợ trẻ thi nâng bậc.",
  "khoanh-khac-tho-mo-vang-danh": "Bộ ảnh gồm 27 khoảnh khắc do nhiếp ảnh gia Phạm Cường thực hiện tại Vàng Danh, được VTV giới thiệu ngày 01/12/2017. Chuỗi hình đi từ giao ca, khai thác, vận tải đến những phút nghỉ ngắn của người thợ.",
  "ly-van-di-nguoi-cha-tho-lo": "Sinh năm 1993 trong một gia đình người Nùng ở xã Khánh Xuân, Cao Bằng, Lý Văn Dỉ đã có năm năm làm nghề khi câu chuyện được ghi lại. Sau mỗi ca, điều anh nghĩ tới là ba người con, gồm hai gái và một trai, đang cần cha giữ vững một nguồn thu nhập lâu dài.",
  "ky-luat-dong-tam-tho-mo-ha-lam": "Trịnh Ngọc Toản đã có hơn 20 năm làm lò; Phạm Văn An công tác tại Hà Lầm 26 năm và từng tham gia cứu hộ sự cố thủy điện Đạ Dâng năm 2014. Nguyễn Trọng Thái được nhắc tới với hơn 100 sáng kiến, một con số phản ánh quá trình bám hiện trường bền bỉ.",
  "pham-dinh-duan-to-cuu-ho-vang-danh": "Sau sự cố sụt lò ngày 15/04/2023, lực lượng cứu hộ đã làm việc gần 15 giờ để đưa hai công nhân ra ngoài an toàn. Phạm Đình Duẩn trực tiếp tham gia cuộc cứu nạn ấy; trước đó anh cũng có 12 sáng kiến cấp công ty.",
  "anh-tho-mo-khe-cham-qua-ong-kinh-ttxvn": "Bộ ảnh do TTXVN thực hiện và VietnamPlus công bố ngày 12/11/2019 đi qua khai trường Cọc Sáu, cảng Hòn Nét và hầm lò Khe Chàm. Ba không gian nối khai thác, vận chuyển với chân dung người thợ trong cùng một dây chuyền công nghiệp.",
};

const professionalArticleOverrides = {
  "tai-co-cau-tkv-2026-viec-lam-tho-mo": {
    intro: [
      "Định hướng cơ cấu lại TKV giai đoạn 2026–2030 đặt tuyển dụng, đào tạo và giữ chân thợ lò trong cùng kế hoạch đổi mới công nghệ, nâng chất lượng quản trị và tổ chức sản xuất an toàn. Trong bức tranh ấy, người thợ trực tiếp không đứng ngoài quá trình hiện đại hóa mà là lực lượng quyết định thiết bị và quy trình mới có vận hành hiệu quả hay không.",
      "Sáu tháng đầu năm 2026, TKV sản xuất 19,6 triệu tấn than nguyên khai và cung cấp 22,77 triệu tấn than cho sản xuất điện. Các con số cho thấy quy mô nhiệm vụ vẫn rất lớn, trong khi yêu cầu về an toàn, tiết kiệm tài nguyên, giảm phát thải và hiệu quả ngày càng cao. Áp lực đó buộc doanh nghiệp phải đồng thời đầu tư máy móc và xây dựng đội ngũ có tay nghề.",
    ],
    sections: [
      {
        title: "Hiện đại hóa bắt đầu từ cách tổ chức sản xuất",
        paragraphs: [
          "Mục tiêu giai đoạn mới là hình thành mô hình công nghiệp năng lượng hiện đại, dựa trên khai thác an toàn, tiết kiệm và hiệu quả. Chuyển đổi số, tự động hóa, quản trị dữ liệu và kiểm soát môi trường sẽ đi sâu hơn vào từng khâu, từ chuẩn bị sản xuất đến vận tải, sàng tuyển và tiêu thụ than.",
          "Với các mỏ hầm lò, công nghệ giúp giảm những thao tác cần nhiều sức nhưng đồng thời làm công việc trở nên chặt chẽ hơn. Một tín hiệu bất thường trên thiết bị, sai lệch trong quy trình hoặc sự phối hợp không đồng bộ giữa các vị trí đều có thể ảnh hưởng tới cả dây chuyền. Vì thế, hiện đại hóa gồm cả việc đưa máy móc xuống lò và thay đổi cách giao việc, kiểm tra, bảo dưỡng, xử lý tình huống.",
          "Kế hoạch sản xuất phải đi cùng khả năng chủ động nguồn than và đáp ứng nhu cầu năng lượng. Khi sản lượng được đặt trong yêu cầu dài hạn, doanh nghiệp cần một lực lượng ổn định, hiểu hiện trường và có thể thích nghi với công nghệ mới qua nhiều năm làm việc.",
        ],
      },
      {
        title: "Người thợ chuyển từ làm nặng sang làm chủ thiết bị",
        paragraphs: [
          "Cơ giới hóa thay đổi nội dung tay nghề. Bên cạnh sức khỏe và kỹ thuật cơ bản, người lao động cần biết vận hành, quan sát tín hiệu, kiểm tra tình trạng máy, phối hợp với cơ điện và báo cáo chính xác khi xuất hiện bất thường. Những năng lực này chỉ hình thành khi kiến thức trong trường được tiếp tục rèn trong tổ đội sản xuất.",
          "Vai trò của thợ lò vì vậy không giảm đi. Trái lại, giá trị của một người thợ biết giữ quy trình, hiểu thiết bị và làm việc có trách nhiệm sẽ rõ hơn trong dây chuyền hiện đại. Kinh nghiệm hiện trường giúp họ nhận ra thay đổi nhỏ mà hệ thống giám sát chưa thể tự giải thích, còn kỷ luật giúp mọi thông tin được chuyển đúng người, đúng thời điểm.",
          "Đào tạo và giữ chân lao động trở thành hai phần của cùng một bài toán. Tuyển đủ người mới chỉ giải quyết đầu vào; doanh nghiệp còn phải tạo môi trường để người mới nâng bậc, nhìn thấy đường phát triển và đủ tin tưởng để gắn bó lâu dài với vùng mỏ.",
        ],
      },
      {
        title: "Cơ hội thuộc về người trẻ chịu học và giữ kỷ luật",
        paragraphs: [
          "Giai đoạn 2026–2030 mở ra nhu cầu rõ hơn đối với lao động kỹ thuật trực tiếp. Người trẻ có sức khỏe phù hợp, học nghề bài bản và sẵn sàng làm việc theo quy trình có thể bắt đầu từ vị trí sản xuất, tích lũy kinh nghiệm rồi phát triển theo hướng vận hành thiết bị, cơ điện, an toàn hoặc quản lý tổ đội.",
          "Lựa chọn nghề mỏ vẫn cần được nhìn đầy đủ. Công việc có ca kíp, yêu cầu thể lực và tiêu chuẩn an toàn nghiêm; đổi lại, tay nghề được trả công và có khả năng tăng giá trị khi công nghệ thay đổi. Người học nên tìm hiểu cả chương trình đào tạo, đơn vị tiếp nhận, điều kiện làm việc và lộ trình sau tốt nghiệp trước khi quyết định.",
          "Định hướng cơ cấu lại TKV đặt con người cạnh công nghệ. Một chiến lược hiện đại hóa chỉ thành công khi máy móc được vận hành bởi đội ngũ hiểu nghề, tôn trọng quy trình và biết cùng nhau xử lý những tình huống không có sẵn đáp án.",
        ],
      },
    ],
    takeaway: "Với người thợ trẻ, cơ hội của giai đoạn mới đến từ khả năng học nghề chắc, làm chủ thiết bị, giữ an toàn và trưởng thành cùng quá trình hiện đại hóa ngành Than.",
  },
  "phuc-loi-tho-mo-tkv-2026": {
    intro: [
      "Trong sáu tháng đầu năm 2026, hoạt động chăm lo người lao động ngành Than được triển khai từ nơi ở, khám sức khỏe, bữa ăn đến hỗ trợ khó khăn và đối thoại tại nơi làm việc. Các chương trình giải quyết nhu cầu sau ca sản xuất, đồng thời tạo điều kiện để người thợ gắn bó lâu dài với doanh nghiệp và vùng mỏ.",
      "Phúc lợi trong một ngành sản xuất có cường độ cao không thể được đo bằng một khoản hỗ trợ riêng lẻ. Mái nhà giúp gia đình ổn định; khám sức khỏe phát hiện sớm nguy cơ; bữa ăn duy trì thể lực; còn đối thoại tạo cơ hội để những bất cập ở hiện trường được nói ra và xử lý. Khi các phần này nối với nhau, sự chăm lo mới đi vào đời sống hằng ngày.",
    ],
    sections: [
      {
        title: "Mái nhà ổn định là điểm tựa sau mỗi ca làm",
        paragraphs: [
          "Chương trình Mái ấm Công đoàn đã xét hỗ trợ xây mới hoặc sửa chữa 108 căn nhà, với tổng kinh phí 8,52 tỷ đồng. Với một gia đình công nhân, chỗ ở an toàn vừa là tài sản vừa là nơi người lao động phục hồi sau ca, chăm lo con cái và bớt áp lực khi phải làm việc xa quê.",
          "Công đoàn TKV đồng thời kiểm tra cơ sở vật chất tại 23 khu tập thể của 14 đơn vị ở Quảng Ninh. Việc kiểm tra nơi ở tập trung có ý nghĩa trực tiếp với công nhân mới, bởi chất lượng phòng ở, điện nước, vệ sinh và khoảng cách tới nơi làm việc đều ảnh hưởng tới nhịp sinh hoạt theo ca.",
          "Hơn 700 người lao động được tư vấn về nhà ở xã hội. Đây là bước chuyển từ hỗ trợ trước mắt sang nhu cầu ổn định lâu dài: người thợ có thêm thông tin để cân nhắc khả năng tạo lập chỗ ở và đưa gia đình tới sinh sống tại vùng mỏ.",
        ],
      },
      {
        title: "Sức khỏe và bữa ăn được chăm lo theo từng nhu cầu",
        paragraphs: [
          "Trong nửa đầu năm, 71.869 lượt người lao động được khám sức khỏe định kỳ; 9.577 lượt được khám chuyên khoa và 3.576 người tham gia điều dưỡng hoặc được hỗ trợ điều trị. Hoạt động chăm sóc được chia theo mức độ và nhu cầu của từng nhóm, từ khám chung tới chuyên khoa, điều dưỡng, hỗ trợ điều trị.",
          "Chương trình Bữa cơm Công đoàn phục vụ 41.471 đoàn viên, người lao động. Một bữa ăn có giá trị khi đủ dinh dưỡng, an toàn và phù hợp thời gian ca kíp. Với lao động trực tiếp, chất lượng bữa ăn liên quan ngay tới thể lực, khả năng tập trung và tốc độ phục hồi sau công việc nặng.",
          "Khám định kỳ, điều dưỡng và dinh dưỡng chỉ phát huy đầy đủ khi người lao động chủ động khai báo tình trạng sức khỏe, tuân thủ hướng dẫn chuyên môn và báo sớm các biểu hiện bất thường. Sự chăm lo từ doanh nghiệp cần đi cùng thói quen tự bảo vệ của mỗi người thợ.",
        ],
      },
      {
        title: "Đối thoại biến kiến nghị thành thay đổi tại nơi làm việc",
        paragraphs: [
          "Các đơn vị đã tổ chức 234 cuộc đối thoại với 21.518 lượt người tham gia, tiếp nhận và giải quyết 1.428 ý kiến, kiến nghị. Những cuộc trao đổi trực tiếp đưa vấn đề về điều kiện làm việc, an toàn, thu nhập hoặc đời sống tới đúng đầu mối để xử lý.",
          "Bên cạnh đó, 23.150 lượt người lao động có hoàn cảnh khó khăn được thăm hỏi và hỗ trợ. Con số lớn phản ánh nhu cầu chăm lo rất đa dạng: có trường hợp cần giúp đỡ đột xuất, có gia đình chịu ảnh hưởng bởi bệnh tật, tai nạn hoặc những biến cố ngoài khả năng tự xoay xở.",
          "Thước đo cuối cùng của phúc lợi là những thay đổi người lao động cảm nhận được: chỗ ở an toàn hơn, sức khỏe được theo dõi sớm hơn, bữa ăn tốt hơn và kiến nghị được phản hồi rõ ràng. Đó là những điều quyết định một người thợ có thể yên tâm làm việc qua nhiều năm hay không.",
        ],
      },
    ],
    takeaway: "Đời sống thợ mỏ được tạo nên cả trong và ngoài ca sản xuất. Khi nhà ở, sức khỏe, bữa ăn, hỗ trợ khó khăn và đối thoại cùng vận hành, phúc lợi trở thành một phần của năng lực sản xuất bền vững.",
  },
};

const professionalLeadParagraphs = {
  "bao-lac-cao-bang-tu-van-hoc-nghe-mo": "Ngày 19/04/2025, đoàn công tác xã Hưng Đạo, huyện Bảo Lạc tới Phân hiệu Hoành Bồ làm việc với Trường Cao đẳng Than - Khoáng sản Việt Nam. Cuộc gặp nhìn thẳng vào kết quả ba tháng đầu năm và thống nhất cách đưa tư vấn nghề mỏ trở lại từng xã, từng thôn trong chín tháng còn lại.",
  "tho-mo-vao-ca-duong-huy": "Tại khai trường Than Dương Huy, gần 400 công nhân bắt đầu ca làm bằng một chuỗi chuẩn bị chặt chẽ. Từ bữa ăn, nhà đèn đến quần áo bảo hộ, mũ, đèn lò và bình tự cứu, mỗi bước trên mặt đất đều hướng tới tám giờ làm việc an toàn ở phía dưới.",
  "ky-luat-dong-tam-tho-mo-ha-lam": "Tại Than Hà Lầm, câu chuyện của Trịnh Ngọc Toản, Phạm Văn An và Nguyễn Trọng Thái tạo nên ba lát cắt về người thợ mỏ. Một người học công nghệ mới để chuyển giao cho đồng đội, một người tham gia cứu hộ xa mỏ, người còn lại bám những đường lò sâu bằng kinh nghiệm và sáng kiến.",
  "ma-khac-huynh-nguoi-mo-duong-trong-long-dat": "Ngày làm việc của Bùi Văn Tuyên bắt đầu khi chuông báo thức vang lên từ sáng sớm. Trước lúc rời nơi ở công nhân, anh gọi về nhà, kiểm tra trang bị rồi chuẩn bị vào ca tại Công ty Than Hòn Gai.",
  "mot-ngay-trong-lo-than-duong-huy": "Từ cửa lò, hành trình xuống khu vực khai thác của Than Dương Huy đi qua nhiều lớp không gian khác nhau. Đèn gắn trên mũ, bảo hộ, phương tiện tự cứu, xe chở người và quãng đi bộ dài là những phần không thể tách rời trước khi người thợ tới vị trí sản xuất.",
  "nhung-nguoi-tho-lo-gieo-no-luc": "Ba người thợ ở ba vị trí khác nhau cùng tạo nên nhịp sản xuất dưới lò. Phan Văn Đạo giữ vai trò người anh của phân xưởng khai thác, Hán Cao Phi phụ trách cơ điện, còn Lê Văn Biên vừa làm việc vừa truyền kinh nghiệm cho lớp thợ trẻ.",
};

function rewriteEditorialParagraph(paragraph = "") {
  return String(paragraph)
    .replaceAll("—", ",")
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => rewriteEditorialSentence(sentence))
    .filter(Boolean)
    .join(" ")
    .trim();
}

function normalizeFactValue(value = "") {
  return stripTags(value).toLocaleLowerCase("vi").replace(/[–—−]/g, "-").replace(/\s+/g, " ").trim();
}

function lowerFirst(value = "") {
  return value.replace(/^(\p{Lu})/u, (letter) => letter.toLocaleLowerCase("vi"));
}

function factClause(value, label) {
  const cleanValue = stripTags(value).replace(/[.?!]+$/u, "");
  const cleanLabel = rewriteEditorialParagraph(label).replace(/[.?!]+$/u, "");
  if (!cleanValue || !cleanLabel) return "";

  if (/^(?:tổng|mức|khoản|thời gian|quãng thời gian|giai đoạn|mục tiêu|tỷ lệ|số lượng|năm|ngày)\b/iu.test(cleanLabel)) {
    return `${cleanLabel} là ${cleanValue}`;
  }

  const valueUnit = cleanValue.match(/^\S+(?:\s+(?:người|gia đình|học sinh|suất|xã|thôn|huyện|tỉnh|địa phương|đơn vị|bên|hội nghị|hồ sơ|công trình|cấp học|nhóm nghề|ca|ảnh))\b/iu)?.[0] || "";
  if (valueUnit) {
    const unit = valueUnit.split(/\s+/u).slice(1).join(" ");
    const withoutRepeatedUnit = cleanLabel.replace(new RegExp(`^${unit}\\s*`, "iu"), "");
    if (/^(?:người|công nhân|cán bộ|học sinh|gia đình|xã|thôn|huyện|tỉnh|địa phương|đơn vị|nhà trường)\b/iu.test(cleanLabel)) {
      const numeric = cleanValue.split(/\s+/u)[0];
      const noun = cleanLabel.match(/^(?:người\s+lao\s+động|công\s+nhân|cán\s+bộ|học\s+sinh|gia\s+đình|xã|thôn|huyện|tỉnh|địa\s+phương|đơn\s+vị|nhà\s+trường)/iu)?.[0] || "";
      return `có ${numeric} ${noun ? lowerFirst(cleanLabel) : lowerFirst(cleanLabel)}`;
    }
    return `có ${cleanValue} ${lowerFirst(withoutRepeatedUnit || cleanLabel)}`;
  }

  return `${cleanValue} là con số gắn với ${lowerFirst(cleanLabel)}`;
}

function factAlreadyCovered(value, label, body) {
  const normalizedValue = normalizeFactValue(value);
  if (normalizedValue && body.includes(normalizedValue)) return true;
  const stopWords = new Set(["của", "và", "được", "trong", "tại", "theo", "cho", "với", "khi", "này", "đó", "một", "những", "các", "là"]);
  const labelWords = normalizeFactValue(label)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= 3 && !stopWords.has(word));
  const uniqueWords = [...new Set(labelWords)];
  if (uniqueWords.length < 3) return false;
  const matched = uniqueWords.filter((word) => body.includes(word)).length;
  return matched >= 3 && matched / uniqueWords.length >= 0.6;
}

function missingFactsParagraph(article, editorialParagraphs) {
  const body = editorialParagraphs.map((paragraph) => normalizeFactValue(paragraph)).join(" ");
  const clauses = (article.facts || [])
    .filter(([value, label]) => !factAlreadyCovered(value, label, body))
    .map(([value, label]) => factClause(value, label))
    .filter(Boolean)
    .slice(0, 4);
  if (!clauses.length) return "";
  const [first, ...rest] = clauses;
  const transitions = ["Cùng với đó", "Bên cạnh đó", "Ngoài ra"];
  const sentences = [capitalizeSentence(first), ...rest.map((clause, index) => `${transitions[index] || "Đồng thời"}, ${clause}`)];
  return sentences.map((sentence) => sentence.replace(/[.?!]+$/u, "") + ".").join(" ");
}

function professionalHeadingIndexes(article, sections) {
  if (!sections.length) return new Set();
  if (sections.length <= 2) return new Set();
  if (sections.length === 3) return new Set([1]);
  return new Set([1, Math.ceil(sections.length * 0.65)]);
}

function renderProfessionalSections(article, sections = [], inlineImages = []) {
  const legacyImages = inlineImages.filter((media) => !Number.isInteger(media.afterSection));
  const headingIndexes = professionalHeadingIndexes(article, sections);
  return sections.map((section, index) => {
    const normalizedParagraphs = (section.paragraphs || [])
      .map((paragraph) => rewriteEditorialParagraph(paragraph))
      .filter((paragraph) => paragraph.split(/\s+/u).length >= 8);
    const mergedParagraphs = normalizedParagraphs.reduce((result, paragraph) => {
      if (paragraph.split(/\s+/u).length < 18 && result.length) {
        result[result.length - 1] = `${result[result.length - 1]} ${paragraph}`;
      } else if (result.length && result[result.length - 1].split(/\s+/u).length < 18) {
        result[result.length - 1] = `${result[result.length - 1]} ${paragraph}`;
      } else {
        result.push(paragraph);
      }
      return result;
    }, []);
    const paragraphs = mergedParagraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
    const sectionImages = [
      ...inlineImages.filter((media) => media.afterSection === index),
      ...(legacyImages[index] ? [legacyImages[index]] : []),
    ];
    const inlineMedia = sectionImages.length
      ? `\n  <div class="article-inline-gallery">${sectionImages.map((media) => renderFigure(media)).join("")}</div>`
      : "";
    if (!paragraphs && !inlineMedia) return "";
    const heading = headingIndexes.has(index) ? `<h2>${esc(section.title)}</h2>` : "";
    const sectionBody = [heading, paragraphs]
      .filter(Boolean)
      .map((block) => `    ${block}`)
      .join("\n");
    return `<section class="editorial-section professional-news-section">
${sectionBody}
  </section>${inlineMedia}`;
  }).join("");
}

function renderProfessionalNewsArticle(article, inlineImages) {
  const source = (article.sources || []).find((item) => sourceUrl(item)) || article.sources?.[0] || {};
  const originalUrl = sourceUrl(source);
  const originalTitle = source.title || article.title;
  const sourceLabel = source.publisher || "nguồn bài báo";
  const editorial = professionalArticleOverrides[article.slug] || article;
  const introSource = [...(editorial.intro || [])];
  if (professionalLeadParagraphs[article.slug]) introSource[0] = professionalLeadParagraphs[article.slug];
  const intro = introSource
    .map((paragraph) => rewriteEditorialParagraph(paragraph))
    .filter((paragraph) => paragraph.split(/\s+/u).length >= 8);
  const factParagraph = professionalFactParagraphs[article.slug] || "";
  const takeaway = rewriteEditorialParagraph(editorial.takeaway);
  const professionalBlocks = [
    `<div class="source-story-intro professional-news-intro">${intro.map((paragraph, index) => `<p${index === 0 ? ' class="professional-lede"' : ""}>${esc(paragraph)}</p>`).join("")}</div>`,
    factParagraph ? `<p class="professional-nutgraph">${esc(factParagraph)}</p>` : "",
    renderProfessionalSections(article, editorial.sections, inlineImages),
    takeaway ? `<p class="professional-ending">${esc(takeaway)}</p>` : "",
  ].filter(Boolean).join("\n          ");
  const sourceLine = originalUrl
    ? `<p class="article-source-note">Bài được Nguyễn Tử Linh biên soạn từ <a href="${esc(originalUrl)}" target="_blank" rel="noopener noreferrer external">“${esc(originalTitle)}”</a>, đăng trên ${esc(sourceLabel)}${source.date ? ` ngày ${esc(source.date)}` : ""}.</p>`
    : `<p class="article-source-note">Bài do Nguyễn Tử Linh biên soạn từ thông tin của ${esc(sourceLabel)}${source.date ? ` ngày ${esc(source.date)}` : ""}.</p>`;
  return `${renderArticleCover(article)}
        <p class="article-byline"><strong>Nguyễn Tử Linh</strong><span>Biên tập viên</span></p>
        <div class="professional-news-copy">
          ${professionalBlocks}
        </div>
        ${sourceLine}
        <nav class="article-nav" aria-label="Bài viết liên quan"></nav>`;
}

function renderPressBody(article, inlineImages) {
  return `${renderArticleCover(article)}
        <div class="source-story-intro">${article.intro.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
        ${renderSections(article.sections, inlineImages)}
        <section class="source-story-ending"><h2>${esc(article.conclusionTitle || "Điều đọng lại")}</h2><p>${esc(article.takeaway)}</p></section>
        ${renderSourceFooter(article)}`;
}

function renderChecklist(items) {
  return `<ol class="timeline">${items.map(([title, text], index) => `<li><time>${String(index + 1).padStart(2, "0")}</time><div><strong>${esc(title)}</strong><span>${esc(text)}</span></div></li>`).join("")}</ol>`;
}

function renderArticle(article) {
  const canonical = `${base}/${article.urlPath}/`;
  const inlineImages = article.inlineMedia || articleInlineImages[article.slug] || [];
  const isPressLayout = article.sourceLayout || article.contentMode === "press_digest";
  const isNewsBrief = article.urlPath.startsWith("tin-nganh-than/");
  const sourceWorks = article.hideSourceUrlsInSchema ? [] : (article.sources || []).map(sourceCreativeWork);
  const sourceUrls = article.hideSourceUrlsInSchema ? [] : (article.sources || []).map(sourceUrl).filter(Boolean);
  const faqs = (article.faq || []).map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {"@type": "Answer", text: answer},
  }));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": article.schemaType || "Article",
        "@id": `${canonical}#article`,
        headline: article.title,
        description: article.description,
        datePublished: article.published,
        dateModified: article.updated,
        inLanguage: "vi-VN",
        mainEntityOfPage: {"@id": `${canonical}#webpage`},
        image: [article.image, ...inlineImages.map((media) => media.src)],
        author: {"@type": "Person", "@id": `${authorUrl}#person`, name: author, alternateName: "Thầy Linh – Tuyển Thợ Mỏ", url: authorUrl},
        publisher: {"@type": "Organization", "@id": organizationId, name: "Thầy Linh – Tuyển Thợ Mỏ", url: `${base}/`, logo: {"@type": "ImageObject", "@id": `${base}/#logo`, url: `${base}/favicon-512x512.png`, width: 512, height: 512}, sameAs: ["https://www.facebook.com/thaylinhtuyenthomo/", "https://www.youtube.com/@ThầyLinh-TuyểnThợMỏ", "https://www.tiktok.com/@thaylinhtuyenthomo"], publishingPrinciples: editorialPolicyUrl},
        publishingPrinciples: editorialPolicyUrl,
        articleSection: article.section,
        keywords: article.keywords,
        about: article.keywords.map((keyword) => ({"@type": "Thing", name: keyword})),
        ...(sourceUrls.length ? {isBasedOn: sourceUrls} : {}),
        ...(sourceWorks.length ? {citation: sourceWorks} : {}),
      },
      {"@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: article.title, datePublished: article.published, dateModified: article.updated, inLanguage: "vi-VN", isPartOf: {"@id": websiteId}, author: {"@id": `${authorUrl}#person`}, publisher: {"@id": organizationId}, publishingPrinciples: editorialPolicyUrl, mainEntity: {"@id": `${canonical}#article`}, breadcrumb: {"@id": `${canonical}#breadcrumb`}},
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {"@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/`},
          {"@type": "ListItem", position: 2, name: "Tin ngành Than", item: `${base}/tin-nganh-than/`},
          {"@type": "ListItem", position: 3, name: article.title, item: canonical},
        ],
      },
      ...(!isNewsBrief && !isPressLayout && faqs.length ? [{"@type": "FAQPage", mainEntity: faqs}] : []),
    ],
  };
  const related = (article.related || []).map((slug, index) => {
    const target = curatedArticles.find((item) => item.slug === slug);
    if (!target) return "";
    return `<a href="/bai-viet/${target.slug}/"><small>${index ? "Đọc tiếp" : "Bài liên quan"}</small>${esc(target.title)} →</a>`;
  }).join("");
  const articleContent = isNewsBrief
    ? renderProfessionalNewsArticle(article, inlineImages)
    : isPressLayout
    ? renderPressBody(article, inlineImages)
    : `${renderArticleCover(article)}
        ${article.intro.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <h2>${esc(article.factsTitle || "Các dữ kiện chính")}</h2>
        ${renderFacts(article.facts)}
        ${renderSections(article.sections, inlineImages)}
        <h2>${esc(article.actionTitle || actionHeadings[article.section] || "Bắt đầu từ đâu?")}</h2>
        ${renderChecklist(article.checklist)}
        <h2>${esc(article.conclusionTitle || conclusionHeadings[article.section] || "Điều đọng lại")}</h2>
        <p class="article-conclusion">${esc(article.takeaway)}</p>
        <h2>Câu hỏi thường gặp</h2>
        <div class="faq-list">${article.faq.map(([question, answer]) => `<section class="faq-item"><h3>${esc(question)}</h3><p>${esc(answer)}</p></section>`).join("")}</div>
        ${renderSourceFooter(article)}
        <nav class="article-nav" aria-label="Bài viết liên quan">${related}</nav>`;
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#063c46">
  <title>${esc(searchTitle(article))}</title>
  <meta name="description" content="${esc(article.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="author" content="${author}">
  <meta name="keywords" content="${esc(article.keywords.join(", "))}">
  <link rel="canonical" href="${canonical}">
  <link rel="author" href="/tac-gia/nguyen-tu-linh/">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
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
  <link rel="stylesheet" href="/fonts.css?v=2">
  <link rel="stylesheet" href="/article-insights.css?v=${isNewsBrief ? 14 : 10}">
  <link rel="stylesheet" href="/content-network.css?v=1">
  <link rel="stylesheet" href="/mobile-ux.css?v=8">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <a class="skip-link" href="#noi-dung">Đến nội dung chính</a>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="/"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="/tin-nganh-than/">← Tin ngành Than</a></div></header>
  <main id="noi-dung">
    <section class="article-hero article-hero--text">
      <div class="container hero-inner">
        <nav class="breadcrumbs" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span>/</span><a href="/tin-nganh-than/">Tin ngành Than</a><span>/</span><span>${esc(article.section)}</span></nav>
        <p class="eyebrow">${esc(article.section)} · ${displayDate(article.published)}</p>
        <h1>${esc(article.title)}</h1>
        <p class="lead">${esc(article.lead)}</p>
      </div>
    </section>
    <div class="container article-layout${isPressLayout ? " article-layout--source" : ""}">
      <article class="article-body${isPressLayout || isNewsBrief ? " article-body--source" : ""}${isNewsBrief ? " article-body--professional article-body--journalistic-v2" : ""}">
        ${articleContent}
        ${renderArticleApply(article)}
        ${renderArticleShare(article)}
      </article>${isPressLayout ? "" : `
      <aside class="article-aside">
        ${renderArticleAsideCta(article)}
        <div class="aside-card"><h2>Thông tin cần biết trước khi đăng ký</h2><p>Điều kiện, chính sách học, công việc và đời sống tại Quảng Ninh được trình bày theo từng nhóm nội dung.</p><a class="aside-secondary-link" href="/tin-nganh-than/">Xem tất cả bài viết</a></div>
      </aside>`}
    </div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Câu chuyện nghề nghiệp, đời sống và cơ hội lập nghiệp trong ngành Than.</p></div><a href="/tin-nganh-than/">Đọc thêm chuyện nghề mỏ →</a></div></footer>
  <nav class="article-contact" aria-label="Liên hệ nhanh"><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Zalo · 096 304 8585</a><a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener">Messenger</a></nav>
  <script src="/analytics.js?v=5" defer></script>
  <script src="/mobile-ux.js?v=10" defer></script>
  <script src="/share-tools.js?v=1" defer></script>
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
  "Kết nối địa phương",
  "An sinh xã hội",
  "Chuyện người thợ mỏ",
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
  "Kết nối địa phương": "ket-noi-dia-phuong",
  "An sinh xã hội": "an-sinh-xa-hoi",
  "Chuyện người thợ mỏ": "chuyen-nguoi-tho-mo",
};

const sectionPresentation = {
  "Hướng dẫn nhập nghề": ["Bắt đầu từ điều kiện rõ ràng", "Điều kiện, hồ sơ và khóa học được trình bày theo đúng thứ tự người lao động cần chuẩn bị."],
  "Thu nhập & việc làm": ["Thu nhập được tạo nên từ đâu?", "Số liệu có bối cảnh và câu chuyện người thật giúp người đọc hiểu mối liên hệ giữa tay nghề, ngày công và kết quả lao động."],
  "Công nghệ mỏ": ["Người thợ trong mỏ hiện đại", "Cơ giới hóa, tự động hóa và dữ liệu đang thay đổi thao tác nghề, môi trường làm việc và yêu cầu kỹ năng."],
  "Tay nghề & đào tạo": ["Tay nghề được rèn như thế nào?", "Lớp học, xưởng thực hành và quá trình sửa từng thao tác là nơi một công nhân kỹ thuật bắt đầu trưởng thành."],
  "An toàn & sức khỏe": ["An toàn là một phần của tay nghề", "Bảo hộ, quy trình, phản xạ và tinh thần tổ đội được rèn trước khi người mới bước vào ca sản xuất."],
  "Đời sống thợ mỏ": ["Cuộc sống phía sau mỗi ca làm", "Nhà ở, bữa ăn, sức khỏe và tình đồng đội góp phần giúp người lao động gắn bó với vùng mỏ."],
  "Mỏ xanh & môi trường": ["Công nghệ thay đổi cách làm mỏ", "Nước thải, bụi, đất đá và năng lượng được quản lý bằng công nghệ cùng trách nhiệm với môi trường."],
  "Việc làm ngành Than": ["Việc làm nhìn từ nhịp sản xuất", "Nhu cầu nhân lực, chính sách hiện hành và định hướng phát triển được đặt trong cùng một bức tranh dữ kiện."],
  "Kết nối địa phương": ["Từ quê nhà đến vùng mỏ", "Mỗi bài ghi lại một địa phương, kết quả đã có và cách Nhà trường, doanh nghiệp, chính quyền cùng đưa thông tin nghề đến người lao động."],
  "An sinh xã hội": ["Tinh thần đồng tâm trong cộng đồng", "Công trình, mái nhà, học bổng và nguồn cứu trợ cho thấy trách nhiệm xã hội của ngành Than trong đời sống thường ngày."],
  "Chuyện người thợ mỏ": ["Những cuộc đời làm nên vùng mỏ", "Câu chuyện có nguồn từ báo chí giúp người đọc gặp người thợ trong ca sản xuất, gia đình, tổ đội và những thời điểm thử thách."],
};

function card(article) {
  const href = article.urlPath.startsWith("bai-viet/")
    ? `../${article.urlPath}/`
    : `./${article.urlPath.replace(/^tin-nganh-than\//, "")}/`;
  return `<a class="news-card" href="${href}" data-cluster="${esc(article.section)}"><img src="${article.image}" alt="${esc(article.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><div class="news-card__body"><small>${esc(article.section)}</small><h2>${esc(article.title)}</h2><p>${esc(article.lead)}</p><span>Đọc bài viết →</span></div></a>`;
}

function hubHtml() {
  const feature = existingNews.find((article) => article.slug === "tai-co-cau-tkv-2026-viec-lam-tho-mo");
  const sections = sectionOrder.map((section) => {
    const items = allEditorial.filter((article) => article.section === section && article.slug !== feature.slug);
    if (!items.length) return "";
    const [heading, description] = sectionPresentation[section] || [items.length === 1 ? "Bài viết nên đọc" : "Những bài viết nên đọc", ""];
    const layout = items.length === 1 ? "single" : items.length === 2 ? "pair" : "standard";
    const remainder = items.length % 3;
    return `<section class="library-section" id="${sectionIds[section]}"><div class="library-heading"><div><p class="eyebrow">${esc(section)}</p><h2>${esc(heading)}</h2></div>${description ? `<p>${esc(description)}</p>` : ""}</div><div class="news-grid news-grid--${layout} news-grid--remainder-${remainder}">${items.map(card).join("")}</div></section>`;
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
    name: "Ngành Than & Người thợ – Thầy Linh",
    description: "Các bài báo chọn lọc về ngành Than được biên soạn theo cấu trúc báo chí, ghi nguồn rõ ràng và bổ sung thông tin học nghề, việc làm TKV dành cho người lao động.",
    url: `${base}/tin-nganh-than/`,
    inLanguage: "vi-VN",
    dateModified: buildTime,
    publisher: {"@type": "Organization", "@id": organizationId, name: "Thầy Linh – Tuyển Thợ Mỏ", url: `${base}/`, logo: {"@type": "ImageObject", "@id": `${base}/#logo`, url: `${base}/favicon-512x512.png`, width: 512, height: 512}, publishingPrinciples: editorialPolicyUrl},
    publishingPrinciples: editorialPolicyUrl,
    mainEntity: {"@type": "ItemList", numberOfItems: allEditorial.length, itemListElement: itemList},
  };
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#063c46">
  <title>Tin ngành Than | Bài báo và thông tin việc làm TKV</title>
  <meta name="description" content="Các bài viết chọn lọc về ngành Than được biên soạn lại đầy đủ, ghi nguồn rõ ràng và bổ sung thông tin học nghề, tuyển thợ mỏ, việc làm TKV tại Quảng Ninh.">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="author" content="${author}">
  <link rel="canonical" href="${base}/tin-nganh-than/">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Tin ngành Than – Thầy Linh" href="${base}/feed.xml"><link rel="alternate" type="application/feed+json" title="Tin ngành Than – Thầy Linh" href="${base}/feed.json">
  <meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="Tin ngành Than"><meta property="og:description" content="Bài viết ngành Than được biên soạn lại đầy đủ, ghi nguồn rõ ràng; thông tin học nghề và việc làm TKV được tách riêng ở cuối mỗi trang."><meta property="og:url" content="${base}/tin-nganh-than/"><meta property="og:image" content="${feature.image}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Tin ngành Than"><meta name="twitter:description" content="Bài báo ngành Than và thông tin việc làm TKV tại Quảng Ninh."><meta name="twitter:image" content="${feature.image}">
  <link rel="stylesheet" href="/fonts.css?v=2">
  <link rel="stylesheet" href="../article-insights.css?v=13"><link rel="stylesheet" href="/mobile-ux.css?v=8">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <a class="skip-link" href="#noi-dung">Đến nội dung chính</a>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="../"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="../">← Trang chủ</a></div></header>
  <main id="noi-dung">
    <section class="news-hero"><div class="container"><p class="eyebrow">TIN TỨC VÀ CÂU CHUYỆN NGƯỜI THỢ</p><h1>Tin ngành Than</h1><p class="lead">Những chuyển động của ngành Than, đời sống người lao động và các chương trình kết nối học nghề, việc làm được kể lại bằng nhân vật, sự kiện và số liệu cụ thể.</p><nav class="cluster-nav" aria-label="Nhóm bài viết">${sectionOrder.filter((section) => allEditorial.some((article) => article.section === section && article.slug !== feature.slug)).map((section) => `<a href="#${sectionIds[section]}">${esc(section)}</a>`).join("")}</nav></div></section>
    <div class="container news-main">
      <article class="news-feature"><img src="${feature.image}" alt="${esc(feature.title)}" referrerpolicy="no-referrer"><div class="news-feature__body"><p class="news-kicker">Bài mới · ${displayDate(feature.published)}</p><h2>${esc(feature.title)}</h2><p>${esc(feature.lead)}</p><a class="news-link" href="./${feature.urlPath.replace(/^tin-nganh-than\//, "")}/">Đọc bài viết →</a></div></article>
      ${sections}
    </div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Đưa câu chuyện nghề mỏ đến gần hơn với người lao động trên cả nước.</p></div><a href="../viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=news_to_application_2026&amp;utm_content=news_index_footer#dang-ky" data-contact="application" data-context="news-index-footer">Tìm hiểu cơ hội học nghề →</a></div></footer>
  <nav class="article-contact" aria-label="Liên hệ nhanh"><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Zalo · 096 304 8585</a><a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener">Messenger</a></nav>
  <script src="/analytics.js?v=5" defer></script>
  <script src="/mobile-ux.js?v=10" defer></script>
</body></html>`;
}

for (const article of generatedArticles) {
  const directory = path.join(root, article.urlPath);
  fs.mkdirSync(directory, {recursive: true});
  const file = path.join(directory, "index.html");
  const renderedHtml = renderArticle(article);
  const hasEstablishedRewrite = fs.existsSync(file) && fs.readFileSync(file, "utf8").includes("article-body--journalistic-v2");
  const keepsEstablishedShell = article.urlPath.startsWith("tin-nganh-than/") && (
    hasEstablishedRewrite || (article.sources || []).some((source) => sourceUrl(source))
  );
  fs.writeFileSync(file, keepsEstablishedShell ? mergeArticleIntoExistingShell(file, renderedHtml) : renderedHtml);
}

for (const article of existingNews) {
  const file = path.join(root, article.urlPath, "index.html");
  if (!fs.existsSync(file)) throw new Error(`Missing existing article page: ${article.slug}`);
  let html = fs.readFileSync(file, "utf8");
  const usesSourceLanding = (article.sources || []).some((source) => source.url);
  html = syncExistingArticleImage(html, article);
  if (!html.includes("article-media-credit") && article.imageSource) {
    html = html.replace(/<figcaption>([\s\S]*?)<\/figcaption>/i, (_match, caption) => `<figcaption><span>${caption.trim()}</span><span class="article-media-credit">${esc(article.imageSource)}</span></figcaption>`);
  }
  html = upgradeExistingSchema(html, article);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(searchTitle(article))}</title>`);
  if (usesSourceLanding) {
    const inlineImages = article.inlineMedia || articleInlineImages[article.slug] || [];
    html = html.replace(articleBodyPattern,
      `<article class="article-body article-body--source article-body--professional article-body--journalistic-v2">\n        ${renderProfessionalNewsArticle(article, inlineImages)}\n        ${renderArticleApply(article)}\n        ${renderArticleShare(article)}\n      </article>`);
    html = html.replace(/article-insights\.css\?v=\d+/g, "article-insights.css?v=14");
  } else {
    html = html.replace(/\s*<div class="article-source-footer">[\s\S]*?<\/div>\s*/g, "\n");
    html = html.replace(/\s*<section class="article-apply"[\s\S]*?<\/section>\s*/g, "\n");
    html = html.replace(/\s*<section class="article-share-panel"[\s\S]*?<\/section>\s*/g, "\n");
    if (/^([ \t]*)<nav class="article-nav"/im.test(html)) {
      html = html.replace(/^([ \t]*)<nav class="article-nav"/im, `$1${renderSourceFooter(article)}\n$1<nav class="article-nav"`);
    } else {
      html = html.replace(/^([ \t]*)<\/article>/im, `$1  ${renderSourceFooter(article)}\n$1</article>`);
    }
    html = html.replace(/^([ \t]*)<\/article>/im, `$1  ${renderArticleApply(article)}\n$1  ${renderArticleShare(article)}\n$1</article>`);
  }
  html = html.replace(/<div class="aside-card accent">[\s\S]*?<\/div>/, renderArticleAsideCta(article));
  if (!html.includes('rel="author"')) html = html.replace(/(<link\s+rel="canonical"[^>]*>)/i, `$1\n  <link rel="author" href="/tac-gia/nguyen-tu-linh/">`);
  if (!html.includes('/content-network.css?v=1')) html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="/content-network.css?v=1">\n</head>`);
  html = html.replaceAll(`${base}/#gioi-thieu`, `${base}/tac-gia/nguyen-tu-linh/`);
  if (!/<main\b[^>]*\bid=["']noi-dung["']/i.test(html)) html = html.replace(/<main\b/i, '<main id="noi-dung"');
  if (!/class=["'][^"']*\bskip-link\b/i.test(html)) html = html.replace(/<body>/i, '<body>\n  <a class="skip-link" href="#noi-dung">Đến nội dung chính</a>');
  if (!usesSourceLanding) html = html.replace(/\/analytics\.js\?v=\d+/g, '/analytics.js?v=5').replace(/\/mobile-ux\.js\?v=\d+/g, '/mobile-ux.js?v=10').replace(/\/mobile-ux\.css\?v=\d+/g, '/mobile-ux.css?v=8').replace(/\/job-application\.js\?v=\d+/g, '/job-application.js?v=9');
  if (!html.includes('/share-tools.js?v=1')) html = html.replace(/<\/body>/i, `  <script src="/share-tools.js?v=1" defer></script>\n</body>`);
  fs.writeFileSync(file, html);
}

const newsHubFile = path.join(root, "tin-nganh-than", "index.html");
fs.writeFileSync(newsHubFile, mergeHubIntoExistingShell(newsHubFile, hubHtml()));

function collectIndexHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectIndexHtml(full, output);
    else if (entry.name === "index.html") output.push(full);
  }
  return output;
}

function collectAllHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectAllHtml(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

for (const file of collectAllHtml(root)) {
  const before = fs.readFileSync(file, "utf8");
  const after = normalizePageAssets(before, file);
  if (after !== before) fs.writeFileSync(file, after);
}

const urls = collectIndexHtml(root).filter((file) => {
  const html = fs.readFileSync(file, "utf8");
  return !/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
}).map((file) => {
  const relative = path.relative(root, file).replaceAll(path.sep, "/").replace(/index\.html$/, "");
  return `${base}/${relative}`;
}).sort((left, right) => left === `${base}/` ? -1 : right === `${base}/` ? 1 : left.localeCompare(right, "vi"));

const freshRecruitmentUrls = new Set([`${base}/`, currentFactsUrl, recruitment.landing_url, ...(recruitment.role_urls || [])]);
const editorialLastmods = new Map(allEditorial.map((article) => [
  `${base}/${article.urlPath}/`,
  String(article.updated || article.published).slice(0, 10),
]));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => {
  const priority = url === `${base}/` ? "1.0" : url.endsWith("/tin-nganh-than/") ? "0.9" : url.includes("/bai-viet/") || url.includes("/tin-nganh-than/2026/") ? "0.8" : "0.7";
  const frequency = url.includes("/bai-viet/") || url.includes("/tin-nganh-than/2026/") ? "monthly" : "weekly";
  const lastmod = url === `${base}/` ? homepageModified : freshRecruitmentUrls.has(url) ? recruitment.updated_at : editorialLastmods.get(url) || "2026-08-01";
  return `  <url><loc>${xml(url)}</loc><lastmod>${xml(lastmod)}</lastmod><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`;
}).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const feedItems = [...allEditorial].sort((left, right) => new Date(right.published) - new Date(left.published));
const rssItems = feedItems.map((article) => `  <item><title>${xml(article.title)}</title><link>${base}/${article.urlPath}/</link><guid>${base}/${article.urlPath}/</guid><pubDate>${new Date(article.published).toUTCString()}</pubDate><dc:creator>${xml(author)}</dc:creator><description>${xml(article.lead)}</description></item>`).join("\n");
fs.writeFileSync(path.join(root, "feed.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Ngành Than &amp; Người thợ – Thầy Linh</title><link>${base}/tin-nganh-than/</link><atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/><description>Chuyện nghề mỏ, con người, thu nhập, an toàn, công nghệ, phúc lợi và môi trường.</description><language>vi</language><lastBuildDate>${new Date(buildTime).toUTCString()}</lastBuildDate>\n${rssItems}\n</channel></rss>\n`);
fs.writeFileSync(path.join(root, "feed.json"), `${JSON.stringify({
  version: "https://jsonfeed.org/version/1.1",
  title: "Ngành Than & Người thợ – Thầy Linh",
  home_page_url: `${base}/`,
  feed_url: `${base}/feed.json`,
  language: "vi-VN",
  authors: [{name: author, url: authorUrl, avatar: `${base}/assets/thay-linh-avatar.webp`}],
  items: feedItems.map((article) => ({
    id: `${base}/${article.urlPath}/`,
    url: `${base}/${article.urlPath}/`,
    title: article.title,
    summary: article.lead,
    image: article.image,
    date_published: article.published,
    date_modified: article.updated || article.published,
    authors: [{name: author, url: authorUrl, avatar: `${base}/assets/thay-linh-avatar.webp`}],
    tags: article.keywords,
  })),
}, null, 2)}\n`);

const llms = `# Thầy Linh – Tuyển Thợ Mỏ\n\n> Website viết về ngành Than và tư vấn học nghề mỏ tại Quảng Ninh do Nguyễn Tử Linh biên soạn.\n\n## Thông tin tuyển sinh đang áp dụng\n\n- Căn cứ: ${recruitment.source_notice}.\n- Thời gian học các nghề đang tuyển: ${recruitment.training_duration}.\n- Điều kiện: nam ${criteria.age_min}–${criteria.age_max} tuổi, cao từ 1,53 m, nặng từ ${criteria.weight_min_kg} kg, có sức khỏe tốt và đáp ứng yêu cầu khám tuyển.\n- Sức khỏe: không cận thị; không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng đến công việc.\n- Đăng ký ban đầu chưa cần nộp giấy tờ. Khi có lịch nhập học, mang CCCD gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có. Chưa có bằng vẫn có thể đăng ký để được hướng dẫn đối chiếu theo hệ đào tạo; không gửi giấy tờ gốc qua bưu điện.\n- Địa chỉ liên hệ, tư vấn: ${recruitment.contact.address}.\n- Địa điểm nhập học: ${recruitment.contact.admission_address}; chỉ đến sau khi được xác nhận lịch.\n- Quyền lợi khi học: miễn kinh phí đào tạo, bố trí ba bữa/ngày và ký túc xá; hỗ trợ 7,5 triệu đồng theo chính sách đợt tuyển.\n- Cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.\n- Tin tuyển dụng chuẩn: [Tuyển lao động học nghề mỏ hầm lò năm 2026](${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/).\n- Vị trí 1: [Kỹ thuật khai thác mỏ hầm lò](${base}/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/).\n- Vị trí 2: [Kỹ thuật xây dựng mỏ hầm lò](${base}/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/).\n- Liên hệ tư vấn: Zalo 096 304 8585.\n\n## Mô tả nghề mỏ hầm lò\n\n- Nguồn mô tả nghề: ${recruitment.source_documents[0].title}, số 554/HD-CĐTKV ngày 22/02/2022 của ${recruitment.source_documents[0].issuer}. Nguồn này dùng cho tên nghề, công việc, thiết bị và bối cảnh làm việc; chính sách tuyển sinh và thu nhập dùng thông tin hiện hành năm 2026.\n- [Ba nghề mỏ hầm lò và công việc cụ thể](${base}/nghe-mo-ham-lo/).\n- [Dữ liệu nghề dành cho hệ thống máy đọc](${base}/occupations.json).\n${recruitment.occupation_profiles.map((profile) => `- ${profile.title}: ${profile.summary} Thời gian học hiện hành: ${profile.training_duration_current}.`).join("\n")}\n\n## Nguyên tắc nội dung\n\n- Chỉ giữ bài có nguồn dữ kiện, giá trị thực tế và nội dung nguyên bản.\n- Phân biệt rõ số liệu, nhận định và thông tin cần xác nhận theo từng đợt.\n- Bài biên tập từ tin chính thống ưu tiên đúng ảnh của bài nguồn; nếu máy chủ đã gỡ ảnh, chỉ dùng ảnh tư liệu đúng bối cảnh và ghi rõ nguồn ảnh. Các bài hướng dẫn nguyên bản sử dụng Thư viện ảnh Vinacomin.\n- Không đặt liên kết nguồn ra ngoài trong giao diện bài viết.\n\n## Kho kiến thức ngành mỏ\n\n${feedItems.map((article) => `- [${article.title}](${base}/${article.urlPath}/): ${article.lead}`).join("\n")}\n`;
const llmsRecruitment = llms
  .replace(`- Thời gian học các nghề đang tuyển: ${recruitment.training_duration}.`, "- Thời gian học: khai thác mỏ và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng.")
  .replace("- Liên hệ tư vấn: Zalo 096 304 8585.", `- Vị trí 3: [Kỹ thuật cơ điện mỏ hầm lò](${base}/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/).\n- Liên hệ tư vấn: Zalo 096 304 8585.`);
const llmsCurrent = llmsRecruitment.replace("## Thông tin tuyển sinh đang áp dụng", `## Trang thông tin hiện hành

- [Tuyển thợ mỏ tháng 8/2026: 15 câu hỏi](${currentFactsUrl}): trang chuẩn để đối chiếu điều kiện, thời gian học, chế độ, hồ sơ, địa chỉ và thu nhập đang áp dụng.
- Ngày cập nhật: ${recruitment.effective_from.split("-").reverse().join("/")}.

## Trả lời trực tiếp theo câu hỏi

${recruitmentAnswers.map(({id, question, answer}) => `- [${question}](${currentFactsUrl}#${id}): ${answer}`).join("\n")}

## Thông tin tuyển sinh đang áp dụng`)
const llmsWithHubs = llmsCurrent.replace("## Trang thông tin hiện hành", `## Các điểm vào trung tâm

- [Thông tin tuyển đang áp dụng](${currentFactsUrl}): điều kiện, học nghề, hồ sơ, địa chỉ và thu nhập tháng 8/2026.
- [Nghề mỏ hầm lò và mô tả công việc](${base}/nghe-mo-ham-lo/): khai thác, xây dựng và cơ điện mỏ hầm lò theo nguồn Hướng dẫn 554.
- [Trung tâm nghề mỏ](${base}/trung-tam-nghe-mo/): bản đồ toàn bộ nội dung và đường ứng tuyển.
- [Việc làm ngành Than theo tỉnh](${base}/viec-lam-nganh-than/): ba nghề đang tuyển và 26 trang địa phương.
- [Cẩm nang nghề mỏ](${base}/cam-nang-nghe-mo/): điều kiện, khóa học, hồ sơ, an toàn và đời sống.
- [Chuyện người thợ](${base}/chuyen-nguoi-tho/): câu chuyện có nguồn về ca làm và hành trình nghề nghiệp.
- [Bộ chia sẻ thông tin](${base}/chia-se-thong-tin/): tạo nội dung có mã nguồn cho toàn quốc hoặc từng tỉnh.
- [Người biên soạn Nguyễn Tử Linh](${base}/tac-gia/nguyen-tu-linh/).
- [Nguyên tắc biên tập và kiểm chứng](${editorialPolicyUrl}): người chịu trách nhiệm, thứ tự ưu tiên nguồn, quy tắc cập nhật và đính chính.

## Trang thông tin hiện hành`);
fs.writeFileSync(path.join(root, "llms.txt"), llmsWithHubs);

const imageRegistry = Object.fromEntries(feedItems.map((article) => {
  const sourceImage = communitySourceImages[article.slug];
  return [article.slug, {
    album_id: article.imageAlbumId,
    album_title: article.imageSource,
    source_url: article.image,
    original_source_url: article.imageOriginal,
    provider: article.contentMode === "press_digest" ? article.sources?.[0]?.publisher : sourceImage ? (sourceImage.imagePublisher || article.sources?.[0]?.publisher) : "Thư viện ảnh Vinacomin",
    source_article_url: article.contentMode === "press_digest" ? article.sources?.[0]?.url : sourceImage?.imageSourceUrl || sourceImage?.sourceUrl,
    local_file: article.imageLocalFile,
  }];
}));
fs.writeFileSync(path.join(root, "assets", "articles", "sources.json"), `${JSON.stringify(imageRegistry, null, 2)}\n`);

fs.mkdirSync(path.resolve("content"), {recursive: true});
fs.writeFileSync(path.resolve("content", "editorial-sources.json"), `${JSON.stringify({
  updated_at: buildTime,
  policy: "Mỗi bài công khai ghi một dòng Nguồn bằng chữ và một câu SEO ở cuối bài; URL chỉ dùng cho kiểm chứng nội bộ, không đặt liên kết ra ngoài.",
  articles: allEditorial.map((article) => ({
    slug: article.slug,
    title: article.title,
    sources: article.sources,
    ...(article.hideSourceUrlsInSchema ? {public_source_urls: false} : {}),
  })),
}, null, 2)}\n`);

console.log(`Generated ${generatedArticles.length} article pages, ${allEditorial.length} editorial feed items and ${urls.length} sitemap URLs.`);
