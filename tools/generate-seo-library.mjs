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
const editorialBuildTime = allEditorial.reduce((latest, article) => {
  const candidate = article.updated || article.published;
  return new Date(candidate) > new Date(latest) ? candidate : latest;
}, recruitment.updated_at);
const editorialBuildDate = editorialBuildTime.slice(0, 10);

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
  output = output.replace(/\/mobile-ux\.js\?v=\d+/g, "/mobile-ux.js?v=8");
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
  return `<div class=