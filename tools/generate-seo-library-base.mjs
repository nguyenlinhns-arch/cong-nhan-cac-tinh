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
    output = output.replace(/<\/head>/i, '  <link rel="stylesheet" href="/fonts.css?v=1">\n</head>');
  }
  output = output.replace(/\/mobile-ux\.js\?v=\d+/g, "/mobile-ux.js?v=10");
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

function renderSourceFooter(article) {
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
  return `<section class="article-apply" aria-labelledby="article-apply-title-${esc(article.slug)}">
          <small>${eyebrow}</small>
          <h2 id="article-apply-title-${esc(article.slug)}">${title}</h2>
          <p>${text}</p>
          <div class="article-apply__actions">
            <a href="${applicationUrl}" data-contact="application" data-context="article-apply" data-application-resume-label>${button}</a>
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
  const rawCredit = String(media.credit || "").trim();
  const visibleCredit = media.suppressLabel || /^Ảnh(?:\s|:)/iu.test(rawCredit) ? rawCredit : `Ảnh: ${rawCredit}`;
  const credit = rawCredit ? `<span class="article-media-credit">${esc(visibleCredit)}</span>` : "";
  const referrerPolicy = media.referrerPolicy || "no-referrer";
  return `<figure class="${className}"><img src="${esc(media.src)}" alt="${esc(media.alt)}" ${eager ? "fetchpriority=\"high\"" : "loading=\"lazy\""} decoding="async" referrerpolicy="${esc(referrerPolicy)}"><figcaption><span>${esc(media.caption || media.alt)}</span>${credit}</figcaption></figure>`;
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
      ...(!isPressLayout && faqs.length ? [{"@type": "FAQPage", mainEntity: faqs}] : []),
    ],
  };
  const related = (article.related || []).map((slug, index) => {
    const target = curatedArticles.find((item) => item.slug === slug);
    if (!target) return "";
    return `<a href="/bai-viet/${target.slug}/"><small>${index ? "Đọc tiếp" : "Bài liên quan"}</small>${esc(target.title)} →</a>`;
  }).join("");
  const articleContent = isPressLayout
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
  <title>${esc(article.title)} | Thầy Linh</title>
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
  <link rel="stylesheet" href="/fonts.css?v=1">
  <link rel="stylesheet" href="/article-insights.css?v=10">
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
      <article class="article-body${isPressLayout ? " article-body--source" : ""}">
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
    description: "Những bài viết chuyên sâu về nghề thợ mỏ, thu nhập, đời sống, tay nghề, công nghệ và cơ hội việc làm tại Quảng Ninh.",
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
  <title>Ngành Than & Người thợ | Chuyện nghề mỏ tại Quảng Ninh</title>
  <meta name="description" content="Bài viết chuyên sâu về nghề thợ mỏ, thu nhập, đời sống, tay nghề, công nghệ và cơ hội lập nghiệp trong ngành Than tại Quảng Ninh.">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="author" content="${author}">
  <link rel="canonical" href="${base}/tin-nganh-than/">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Tin ngành Than – Thầy Linh" href="${base}/feed.xml"><link rel="alternate" type="application/feed+json" title="Tin ngành Than – Thầy Linh" href="${base}/feed.json">
  <meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="Ngành Than & Người thợ"><meta property="og:description" content="Những câu chuyện có thật, số liệu đáng tin cậy và góc nhìn nghề nghiệp dành cho người đang muốn vào ngành mỏ."><meta property="og:url" content="${base}/tin-nganh-than/"><meta property="og:image" content="${feature.image}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Ngành Than & Người thợ"><meta name="twitter:description" content="Chuyện nghề mỏ và cơ hội lập nghiệp tại Quảng Ninh."><meta name="twitter:image" content="${feature.image}">
  <link rel="stylesheet" href="/fonts.css?v=1">
  <link rel="stylesheet" href="../article-insights.css?v=10"><link rel="stylesheet" href="/mobile-ux.css?v=8">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <a class="skip-link" href="#noi-dung">Đến nội dung chính</a>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="../"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="../">← Trang chủ</a></div></header>
  <main id="noi-dung">
    <section class="news-hero"><div class="container"><p class="eyebrow">Người thật · Việc thật · Dữ kiện thật</p><h1>Ngành Than & Người thợ</h1><p class="lead">Những câu chuyện từ hầm lò, lớp học nghề và khu tập thể công nhân giúp người đọc hiểu nghề qua con người, công nghệ, thu nhập và nhịp sống vùng mỏ.</p><nav class="cluster-nav" aria-label="Nhóm bài viết">${sectionOrder.filter((section) => allEditorial.some((article) => article.section === section && article.slug !== feature.slug)).map((section) => `<a href="#${sectionIds[section]}">${esc(section)}</a>`).join("")}</nav></div></section>
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
  fs.writeFileSync(path.join(directory, "index.html"), renderArticle(article));
}

for (const article of existingNews) {
  const file = path.join(root, article.urlPath, "index.html");
  if (!fs.existsSync(file)) throw new Error(`Missing existing article page: ${article.slug}`);
  let html = fs.readFileSync(file, "utf8");
  html = upgradeExistingSchema(html, article);
  if (article.seoTitle) html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(article.seoTitle)}</title>`);
  html = html.replace(/\s*<div class="article-source-footer">[\s\S]*?<\/div>\s*/g, "\n");
  html = html.replace(/\s*<section class="article-apply"[\s\S]*?<\/section>\s*/g, "\n");
  html = html.replace(/\s*<section class="article-share-panel"[\s\S]*?<\/section>\s*/g, "\n");
  if (/^([ \t]*)<nav class="article-nav"/im.test(html)) {
    html = html.replace(/^([ \t]*)<nav class="article-nav"/im, `$1${renderSourceFooter(article)}\n$1<nav class="article-nav"`);
  } else {
    html = html.replace(/^([ \t]*)<\/article>/im, `$1  ${renderSourceFooter(article)}\n$1</article>`);
  }
  html = html.replace(/^([ \t]*)<\/article>/im, `$1  ${renderArticleApply(article)}\n$1  ${renderArticleShare(article)}\n$1</article>`);
  html = html.replace(/<div class="aside-card accent">[\s\S]*?<\/div>/, renderArticleAsideCta(article));
  if (!html.includes('rel="author"')) html = html.replace(/(<link\s+rel="canonical"[^>]*>)/i, `$1\n  <link rel="author" href="/tac-gia/nguyen-tu-linh/">`);
  if (!html.includes('/content-network.css?v=1')) html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="/content-network.css?v=1">\n</head>`);
  html = html.replaceAll(`${base}/#gioi-thieu`, `${base}/tac-gia/nguyen-tu-linh/`);
  if (!/<main\b[^>]*\bid=["']noi-dung["']/i.test(html)) html = html.replace(/<main\b/i, '<main id="noi-dung"');
  if (!/class=["'][^"']*\bskip-link\b/i.test(html)) html = html.replace(/<body>/i, '<body>\n  <a class="skip-link" href="#noi-dung">Đến nội dung chính</a>');
  html = html.replace(/\/analytics\.js\?v=\d+/g, '/analytics.js?v=5').replace(/\/mobile-ux\.js\?v=\d+/g, '/mobile-ux.js?v=10').replace(/\/mobile-ux\.css\?v=\d+/g, '/mobile-ux.css?v=8').replace(/\/job-application\.js\?v=\d+/g, '/job-application.js?v=9');
  if (!html.includes('/share-tools.js?v=1')) html = html.replace(/<\/body>/i, `  <script src="/share-tools.js?v=1" defer></script>\n</body>`);
  fs.writeFileSync(file, html);
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

const llms = `# Thầy Linh – Tuyển Thợ Mỏ\n\n> Website viết về ngành Than và tư vấn học nghề mỏ tại Quảng Ninh do Nguyễn Tử Linh biên soạn.\n\n## Thông tin tuyển sinh đang áp dụng\n\n- Căn cứ: ${recruitment.source_notice}.\n- Thời gian học các nghề đang tuyển: ${recruitment.training_duration}.\n- Điều kiện: nam ${criteria.age_min}–${criteria.age_max} tuổi, cao từ 1,53 m, nặng từ ${criteria.weight_min_kg} kg, có sức khỏe tốt và đáp ứng yêu cầu khám tuyển.\n- Sức khỏe: không cận thị; không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng đến công việc.\n- Đăng ký ban đầu chưa cần nộp giấy tờ. Khi có lịch nhập học, mang CCCD gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có. Chưa có bằng vẫn có thể đăng ký để được hướng dẫn đối chiếu theo hệ đào tạo; không gửi giấy tờ gốc qua bưu điện.\n- Địa chỉ liên hệ, tư vấn: ${recruitment.contact.address}.\n- Địa điểm nhập học: ${recruitment.contact.admission_address}; chỉ đến sau khi được xác nhận lịch.\n- Quyền lợi khi học: miễn kinh phí đào tạo, bố trí ba bữa/ngày và ký túc xá; hỗ trợ 7,5 triệu đồng theo chính sách đợt tuyển.\n- Cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.\n- Tin tuyển dụng chuẩn: [Tuyển lao động học nghề mỏ hầm lò năm 2026](${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/).\n- Vị trí 1: [Kỹ thuật khai thác mỏ hầm lò](${base}/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/).\n- Vị trí 2: [Kỹ thuật xây dựng mỏ hầm lò](${base}/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/).\n- Liên hệ tư vấn: Zalo 096 304 8585.\n\n## Nguyên tắc nội dung\n\n- Chỉ giữ bài có nguồn dữ kiện, giá trị thực tế và nội dung nguyên bản.\n- Phân biệt rõ số liệu, nhận định và thông tin cần xác nhận theo từng đợt.\n- Bài biên tập từ tin chính thống ưu tiên đúng ảnh của bài nguồn; nếu máy chủ đã gỡ ảnh, chỉ dùng ảnh tư liệu đúng bối cảnh và ghi rõ nguồn ảnh. Các bài hướng dẫn nguyên bản sử dụng Thư viện ảnh Vinacomin.\n- Không đặt liên kết nguồn ra ngoài trong giao diện bài viết.\n\n## Kho kiến thức ngành mỏ\n\n${feedItems.map((article) => `- [${article.title}](${base}/${article.urlPath}/): ${article.lead}`).join("\n")}\n`;
const llmsCurrent = llms.replace("## Thông tin tuyển sinh đang áp dụng", `## Trang thông tin hiện hành

- [Tuyển thợ mỏ tháng 8/2026: 15 câu hỏi](${currentFactsUrl}): trang chuẩn để đối chiếu điều kiện, thời gian học, chế độ, hồ sơ, địa chỉ và thu nhập đang áp dụng.
- Ngày cập nhật: ${recruitment.effective_from.split("-").reverse().join("/")}.

## Trả lời trực tiếp theo câu hỏi

${recruitmentAnswers.map(({id, question, answer}) => `- [${question}](${currentFactsUrl}#${id}): ${answer}`).join("\n")}

## Thông tin tuyển sinh đang áp dụng`)
const llmsWithHubs = llmsCurrent.replace("## Trang thông tin hiện hành", `## Các điểm vào trung tâm

- [Thông tin tuyển đang áp dụng](${currentFactsUrl}): điều kiện, học nghề, hồ sơ, địa chỉ và thu nhập tháng 8/2026.
- [Trung tâm nghề mỏ](${base}/trung-tam-nghe-mo/): bản đồ toàn bộ nội dung và đường ứng tuyển.
- [Việc làm ngành Than theo tỉnh](${base}/viec-lam-nganh-than/): hai nghề đang tuyển và 26 trang địa phương.
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
