import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const BASE = "https://thaylinhtuyenthomo.vn";
const CHECK_ONLY = process.argv.includes("--check");
const MAX_TITLE_LENGTH = 65;
const MIN_DESCRIPTION_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 180;

const STOPWORDS = new Set([
  "ai", "anh", "ba", "bai", "ban", "bang", "bao", "cac", "cach", "cho", "co", "con", "cua",
  "da", "dang", "day", "de", "den", "do", "duoc", "gi", "giua", "hai", "hay", "hon", "khi",
  "khong", "la", "lai", "lam", "mot", "nam", "nay", "ngay", "nguoi", "nhieu", "nhung", "o",
  "qua", "ra", "sau", "tai", "the", "theo", "thi", "thang", "trong", "tu", "va", "ve", "voi",
  "tkv", "vinacomin", "viet", "nam", "thay", "linh", "cong", "ty", "tap", "doan",
]);

const CLUSTERS = {
  "giai-dap": {
    genre: "Giải đáp nghề mỏ",
    hub: "/giai-dap-nghe-mo/",
    label: "Xem toàn bộ giải đáp nghề mỏ",
  },
  "huong-dan-nhap-nghe": {
    genre: "Hướng dẫn học nghề và tuyển thợ mỏ",
    hub: "/thong-tin-tuyen-tho-mo/",
    label: "Xem thông tin tuyển thợ mỏ đang áp dụng",
  },
  "viec-lam-dia-phuong": {
    genre: "Việc làm ngành Than theo địa phương",
    hub: "/viec-lam-nganh-than/",
    label: "Xem việc làm ngành Than theo tỉnh",
  },
  "thu-nhap-phuc-loi": {
    genre: "Thu nhập và phúc lợi thợ mỏ",
    hub: "/thu-nhap-an-o-ho-tro/",
    label: "Xem thêm về thu nhập, ăn ở và hỗ trợ",
  },
  "an-toan-cong-nghe": {
    genre: "An toàn, công nghệ và môi trường mỏ",
    hub: "/an-toan-ky-luat-moi-truong/",
    label: "Xem hướng dẫn về an toàn, kỷ luật và môi trường mỏ",
  },
  "chuyen-nguoi-tho": {
    genre: "Chuyện người thợ mỏ",
    hub: "/cau-chuyen-cong-nhan/",
    label: "Xem thêm câu chuyện công nhân mỏ",
  },
  "tin-nganh-than": {
    genre: "Tin ngành Than và TKV",
    hub: "/tin-nganh-than/",
    label: "Xem thêm tin tức ngành Than và TKV",
  },
};

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function isArticlePath(relativePath) {
  return /^bai-viet\/[^/]+\/index\.html$/u.test(relativePath)
    || /^tin-nganh-than\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/index\.html$/u.test(relativePath)
    || /^giai-dap-nghe-mo\/(?!index\.html$)[^/]+\/index\.html$/u.test(relativePath);
}

function decodeHtml(value = "") {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripHtml(value = "") {
  return decodeHtml(String(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/gu, " ")
    .trim();
}

function normalize(value = "") {
  return decodeHtml(value)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replaceAll("đ", "d")
    .replaceAll("Đ", "D")
    .toLocaleLowerCase("vi")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value = "") {
  return [...new Set(normalize(value)
    .split(/[\s-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOPWORDS.has(token)))];
}

function keywordCoverage(keyword, text) {
  const keywordTokens = tokens(keyword);
  if (!keywordTokens.length) return 1;
  const textTokens = new Set(tokens(text));
  return keywordTokens.filter((token) => textTokens.has(token)).length / keywordTokens.length;
}

function compactText(value, limit) {
  const original = decodeHtml(value).replace(/\s+/gu, " ").trim();
  if (original.length <= limit) return original;
  const available = limit - 1;
  const excerpt = original.slice(0, available + 1);
  const boundary = excerpt.lastIndexOf(" ");
  const candidate = (boundary >= Math.floor(available * 0.7) ? excerpt.slice(0, boundary) : original.slice(0, available))
    .replace(/[,:;–—-]+$/u, "")
    .trim();
  return `${candidate}…`;
}

function capitalize(value = "") {
  const text = String(value).trim();
  if (!text) return text;
  return `${text[0].toLocaleUpperCase("vi")}${text.slice(1)}`;
}

function metaTag(html, attribute, key) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escapeRegex(key)}["'])[^>]*>`, "i");
  return html.match(pattern)?.[0] || "";
}

function tagContent(tag) {
  return decodeHtml(tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2] || "").replace(/\s+/gu, " ").trim();
}

function metaContent(html, attribute, key) {
  return tagContent(metaTag(html, attribute, key));
}

function replaceMetaContent(html, attribute, key, value) {
  const tag = metaTag(html, attribute, key);
  if (!tag) return html;
  const nextTag = /\bcontent=(["'])(.*?)\1/i.test(tag)
    ? tag.replace(/\bcontent=(["'])(.*?)\1/i, (_full, quote) => `content=${quote}${escapeHtml(value)}${quote}`)
    : tag.replace(/>$/, ` content="${escapeHtml(value)}">`);
  return html.replace(tag, nextTag);
}

function insertMetaProperties(html, properties) {
  const missing = properties.filter(([key]) => !metaTag(html, "property", key));
  if (!missing.length) return html;
  const markup = missing.map(([key, value]) => `  <meta property="${key}" content="${escapeHtml(value)}">`).join("\n");
  return html.replace(/(<meta\s+name=["']twitter:card["'][^>]*>)/i, `${markup}\n$1`);
}

function titleText(html) {
  return stripHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function h1Text(html) {
  return stripHtml(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
}

function canonicalUrl(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || "";
}

function parseStructuredData(html) {
  const scripts = [];
  const pattern = /<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      scripts.push({full: match[0], attrs: match[1], data: JSON.parse(match[2])});
    } catch (error) {
      scripts.push({full: match[0], attrs: match[1], data: null, error});
    }
  }
  return scripts;
}

function graphNodes(data) {
  if (!data || typeof data !== "object") return [];
  return Array.isArray(data["@graph"]) ? data["@graph"] : [data];
}

function articleNodeFrom(html) {
  for (const script of parseStructuredData(html)) {
    const node = graphNodes(script.data).find((item) => ["Article", "NewsArticle"].includes(item?.["@type"]));
    if (node) return node;
  }
  return null;
}

function keywordList(html, articleNode, fallback) {
  const metaKeywords = metaContent(html, "name", "keywords")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const schemaKeywords = Array.isArray(articleNode?.keywords)
    ? articleNode.keywords
    : String(articleNode?.keywords || "").split(",");
  const aboutKeywords = (Array.isArray(articleNode?.about) ? articleNode.about : [articleNode?.about])
    .map((item) => typeof item === "string" ? item : item?.name)
    .filter(Boolean);
  const all = [...metaKeywords, ...schemaKeywords, ...aboutKeywords, fallback]
    .map((value) => stripHtml(value))
    .filter(Boolean);
  const seen = new Set();
  return all.filter((value) => {
    const key = normalize(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function firstCopyText(html) {
  const articleMarkup = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] || html;
  const paragraphs = [];
  for (const match of articleMarkup.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    const attrs = match[1] || "";
    if (/\b(?:eyebrow|byline|date|source|current-facts|article-topic-hub|article-seo-line)\b/i.test(attrs)) continue;
    const text = stripHtml(match[2]);
    if (text.length < 35) continue;
    paragraphs.push(text);
    if (paragraphs.join(" ").split(/\s+/).length >= 180 || paragraphs.length >= 3) break;
  }
  return paragraphs.join(" ");
}

function visibleArticleText(html) {
  const articleMarkup = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]
    || html.match(/<article\b[^>]*class=["'][^"']*\barticle-body\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/i)?.[1]
    || html;
  return stripHtml(articleMarkup);
}

function chooseCluster(relativePath, section, keywordText) {
  if (relativePath.startsWith("giai-dap-nghe-mo/")) return "giai-dap";
  const normalizedSection = normalize(section);
  const normalizedKeywords = normalize(keywordText);

  if (normalizedSection.includes("ket noi dia phuong")) return "viec-lam-dia-phuong";
  if (normalizedSection.includes("chuyen nguoi tho")) return "chuyen-nguoi-tho";
  if (normalizedSection.includes("an toan") || normalizedSection.includes("cong nghe") || normalizedSection.includes("mo xanh")) return "an-toan-cong-nghe";
  if (normalizedSection.includes("huong dan") || normalizedSection.includes("tay nghe") || normalizedSection.includes("dao tao")) return "huong-dan-nhap-nghe";
  if (normalizedSection.includes("thu nhap") || normalizedSection.includes("doi song")) return "thu-nhap-phuc-loi";
  if (/luong|thu nhap|phuc loi|nghi duong|an o|ho tro/.test(normalizedKeywords)) return "thu-nhap-phuc-loi";
  if (/tuyen sinh|hoc nghe|ho so|dieu kien|nhap hoc|dao tao/.test(normalizedKeywords)) return "huong-dan-nhap-nghe";
  if (/tinh|xa|huyen|dia phuong|cao bang|tuyen quang|lai chau|lao cai|dien bien|son la|quang tri|thanh hoa/.test(normalizedKeywords)) return "viec-lam-dia-phuong";
  if (/an toan|suc khoe|co gioi|cong nghe|moi truong|thong gio/.test(normalizedKeywords)) return "an-toan-cong-nghe";
  return "tin-nganh-than";
}

function analyze(file) {
  const relativePath = path.relative(SITE, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const node = articleNodeFrom(html);
  const h1 = h1Text(html);
  const title = titleText(html);
  const description = metaContent(html, "name", "description");
  const canonical = canonicalUrl(html);
  const section = metaContent(html, "property", "article:section") || node?.articleSection || (relativePath.startsWith("giai-dap-nghe-mo/") ? "Giải đáp nghề mỏ" : "Tin ngành Than");
  const keywords = keywordList(html, node, h1);
  const primaryKeyword = keywords[0] || h1;
  const articleText = visibleArticleText(html);
  const firstCopy = firstCopyText(html);
  const clusterId = chooseCluster(relativePath, section, `${primaryKeyword} ${keywords.join(" ")} ${h1}`);
  return {
    file,
    relativePath,
    html,
    node,
    h1,
    title,
    description,
    canonical,
    section,
    keywords,
    primaryKeyword,
    articleText,
    firstCopy,
    wordCount: articleText ? articleText.split(/\s+/).filter(Boolean).length : 0,
    clusterId,
    cluster: CLUSTERS[clusterId],
    internalPath: canonical.startsWith(BASE) ? new URL(canonical).pathname : `/${relativePath.replace(/index\.html$/, "")}`,
    published: metaContent(html, "property", "article:published_time") || node?.datePublished || "",
    modified: metaContent(html, "property", "article:modified_time") || node?.dateModified || "",
    image: metaContent(html, "property", "og:image") || (Array.isArray(node?.image) ? node.image[0] : node?.image) || "",
  };
}

function relatedArticles(article, articles) {
  const ownTokens = new Set(tokens(`${article.primaryKeyword} ${article.keywords.join(" ")} ${article.h1}`));
  return articles
    .filter((candidate) => candidate.canonical && candidate.canonical !== article.canonical)
    .map((candidate) => {
      const candidateTokens = new Set(tokens(`${candidate.primaryKeyword} ${candidate.keywords.join(" ")} ${candidate.h1}`));
      const shared = [...ownTokens].filter((token) => candidateTokens.has(token)).length;
      let score = shared * 4;
      if (candidate.clusterId === article.clusterId) score += 28;
      if (normalize(candidate.section) === normalize(article.section)) score += 10;
      if (candidate.relativePath.startsWith("bai-viet/")) score += 3;
      if (candidate.relativePath.startsWith(article.relativePath.split("/")[0])) score += 1;
      return {candidate, score};
    })
    .sort((left, right) => right.score - left.score || left.candidate.h1.localeCompare(right.candidate.h1, "vi"))
    .slice(0, 2)
    .map(({candidate}) => candidate);
}

function buildRelatedNav(article, related) {
  const labels = ["Cùng chủ đề", "Nên đọc tiếp"];
  const links = related.map((item, index) => `<a href="${escapeHtml(item.internalPath)}"><small>${labels[index] || "Bài liên quan"}</small>${escapeHtml(item.h1)} →</a>`).join("");
  return `<nav class="article-nav" aria-label="Bài viết liên quan theo chủ đề">${links}</nav>`;
}

function optimizeSearchTitle(article) {
  if (keywordCoverage(article.primaryKeyword, article.title) >= 0.45) return article.title;
  return compactText(`${capitalize(article.primaryKeyword.replace(/[?!.,;:]+$/u, ""))} | Thầy Linh`, MAX_TITLE_LENGTH);
}

function optimizeDescription(article) {
  if (keywordCoverage(article.primaryKeyword, article.description) >= 0.45) return article.description;
  const keyword = capitalize(article.primaryKeyword.replace(/[?!.,;:]+$/u, ""));
  return compactText(`${keyword}: ${article.description}`, 170);
}

function updateStructuredData(html, article, title, description) {
  let changed = false;
  const pattern = /<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;
  const output = html.replace(pattern, (full, attrs, payload) => {
    let data;
    try {
      data = JSON.parse(payload);
    } catch {
      return full;
    }
    const articleNode = graphNodes(data).find((item) => ["Article", "NewsArticle"].includes(item?.["@type"]));
    if (!articleNode) return full;

    articleNode.headline = article.h1;
    articleNode.description = description;
    articleNode.articleSection = article.section;
    articleNode.keywords = article.keywords;
    articleNode.about = article.keywords.slice(0, 6).map((name) => ({"@type": "Thing", name}));
    articleNode.genre = article.cluster.genre;
    articleNode.wordCount = article.wordCount;
    articleNode.isAccessibleForFree = true;
    if (article.image) articleNode.image = [article.image];
    if (!articleNode.mainEntityOfPage && article.canonical) articleNode.mainEntityOfPage = {"@id": `${article.canonical}#webpage`};

    for (const node of graphNodes(data)) {
      if (node?.["@type"] !== "WebPage") continue;
      if (article.canonical) node.url = article.canonical;
      node.name = article.h1;
      node.description = description;
    }

    changed = true;
    return `<script${attrs}>${JSON.stringify(data)}</script>`;
  });
  return {html: output, changed};
}

function wrapVisibleDate(html, article) {
  if (!article.published) return html;
  const date = String(article.published).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || html.includes(`<time datetime="${date}">`)) return html;
  return html.replace(
    /(<p\b[^>]*class=["'][^"']*(?:eyebrow|daily-seo-date)[^"']*["'][^>]*>[\s\S]*?)(\d{2}\/\d{2}\/\d{4})([\s\S]*?<\/p>)/i,
    `$1<time datetime="${date}">$2</time>$3`,
  );
}

function optimizeRegularArticleFooter(html, article) {
  let next = html.replace(/<p\b[^>]*class=["'][^"']*\barticle-seo-line\b[^"']*["'][^>]*>[\s\S]*?<\/p>\s*/gi, "");
  next = next.replace(/<p\b[^>]*class=["'][^"']*\barticle-topic-hub\b[^"']*["'][^>]*>[\s\S]*?<\/p>\s*/gi, "");
  const footerPattern = /<div\b([^>]*class=["'][^"']*\barticle-source-footer\b[^"']*["'][^>]*)>([\s\S]*?)<\/div>/i;
  if (!footerPattern.test(next)) return next;
  return next.replace(footerPattern, (_full, attrs, content) => {
    const topicLink = content.includes(`href="${article.cluster.hub}"`)
      ? ""
      : `<p class="article-topic-hub"><a href="${article.cluster.hub}">${escapeHtml(article.cluster.label)} →</a></p>`;
    return `<div${attrs}>${content}${topicLink}</div>`;
  });
}

function optimizeRegularRelatedNav(html, article, related) {
  if (!related.length) return html;
  const nav = buildRelatedNav(article, related);
  const navPattern = /<nav\b[^>]*class=["'][^"']*\barticle-nav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i;
  if (navPattern.test(html)) return html.replace(navPattern, nav);
  if (/<section\b[^>]*class=["'][^"']*\barticle-apply\b/i.test(html)) {
    return html.replace(/(<section\b[^>]*class=["'][^"']*\barticle-apply\b)/i, `${nav}$1`);
  }
  return html.replace(/<\/article>/i, `${nav}</article>`);
}

const articleFiles = walk(SITE).filter((file) => file.endsWith(".html") && isArticlePath(path.relative(SITE, file).split(path.sep).join("/")));
const initialArticles = articleFiles.map(analyze);
const changedFiles = [];
const changeStats = {
  titles: 0,
  descriptions: 0,
  visibleSeoLinesRemoved: 0,
  topicHubLinks: 0,
  relatedNavigations: 0,
  structuredData: 0,
  visibleDates: 0,
};

for (const article of initialArticles) {
  let next = article.html;
  const nextTitle = optimizeSearchTitle(article);
  const nextDescription = optimizeDescription(article);

  if (nextTitle !== article.title) {
    next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(nextTitle)}</title>`);
    changeStats.titles += 1;
  }
  if (nextDescription !== article.description) {
    next = replaceMetaContent(next, "name", "description", nextDescription);
    changeStats.descriptions += 1;
  }

  const beforeSeoLine = next;
  if (!article.relativePath.startsWith("giai-dap-nghe-mo/")) {
    next = optimizeRegularArticleFooter(next, article);
    if (beforeSeoLine.includes("article-seo-line") && !next.includes("article-seo-line")) changeStats.visibleSeoLinesRemoved += 1;
    if (next.includes("article-topic-hub")) changeStats.topicHubLinks += 1;
    const related = relatedArticles(article, initialArticles);
    const beforeNav = next;
    next = optimizeRegularRelatedNav(next, article, related);
    if (next !== beforeNav) changeStats.relatedNavigations += 1;
  }

  const beforeDate = next;
  next = wrapVisibleDate(next, article);
  if (next !== beforeDate) changeStats.visibleDates += 1;

  const published = article.published;
  const modified = article.modified || published;
  if (article.relativePath.startsWith("giai-dap-nghe-mo/")) {
    next = insertMetaProperties(next, [
      ["article:published_time", published],
      ["article:modified_time", modified],
      ["article:author", "Nguyễn Tử Linh"],
      ["article:section", article.section],
    ].filter(([, value]) => Boolean(value)));
  }

  const schemaUpdate = updateStructuredData(next, {...article, description: nextDescription}, nextTitle, nextDescription);
  next = schemaUpdate.html;
  if (schemaUpdate.changed) changeStats.structuredData += 1;

  if (next === article.html) continue;
  changedFiles.push(article.relativePath);
  if (!CHECK_ONLY) fs.writeFileSync(article.file, next);
}

const finalArticles = articleFiles.map(analyze);
const errors = [];
const warnings = [];
const titleOwners = new Map();
const descriptionOwners = new Map();
const keywordOwners = new Map();

const feed = JSON.parse(fs.readFileSync(path.join(SITE, "feed.json"), "utf8"));
const dailyFeed = JSON.parse(fs.readFileSync(path.join(SITE, "daily-seo-articles.json"), "utf8"));
const expectedArticles = (feed.items?.length || 0) + (dailyFeed.articles?.length || 0);
if (finalArticles.length !== expectedArticles) {
  errors.push(`Cần ${expectedArticles} bài từ feed và giải đáp hằng ngày, hiện kiểm tra được ${finalArticles.length}`);
}

for (const article of finalArticles) {
  const currentTitle = titleText(article.html);
  const currentDescription = metaContent(article.html, "name", "description");
  const currentNode = articleNodeFrom(article.html);
  const titleCoverage = keywordCoverage(article.primaryKeyword, currentTitle);
  const descriptionCoverage = keywordCoverage(article.primaryKeyword, currentDescription);
  const introCoverage = keywordCoverage(article.primaryKeyword, article.firstCopy);

  if (!article.primaryKeyword) errors.push(`${article.relativePath}: thiếu từ khóa chính`);
  if (!currentTitle || currentTitle.length > MAX_TITLE_LENGTH) errors.push(`${article.relativePath}: title dài ${currentTitle.length} ký tự`);
  if (currentDescription.length < MIN_DESCRIPTION_LENGTH || currentDescription.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`${article.relativePath}: meta description dài ${currentDescription.length} ký tự`);
  }
  if (titleCoverage < 0.45) errors.push(`${article.relativePath}: title chưa bao phủ đủ từ khóa “${article.primaryKeyword}”`);
  if (descriptionCoverage < 0.45) errors.push(`${article.relativePath}: description chưa bao phủ đủ từ khóa “${article.primaryKeyword}”`);
  if (introCoverage < 0.35) errors.push(`${article.relativePath}: phần mở đầu chưa làm rõ từ khóa “${article.primaryKeyword}”`);
  if (!article.canonical.startsWith(`${BASE}/`)) errors.push(`${article.relativePath}: canonical không hợp lệ`);
  if (!article.h1) errors.push(`${article.relativePath}: thiếu H1`);
  if (!article.html.includes(`<time datetime="${String(article.published).slice(0, 10)}">`)) {
    errors.push(`${article.relativePath}: ngày xuất bản chưa có thẻ time máy đọc được`);
  }
  if (article.html.includes("article-seo-line")) errors.push(`${article.relativePath}: còn dòng SEO lộ liễu trong nội dung hiển thị`);

  if (!article.relativePath.startsWith("giai-dap-nghe-mo/")) {
    if (!article.html.includes("article-topic-hub")) errors.push(`${article.relativePath}: thiếu liên kết trung tâm chủ đề`);
    const nav = article.html.match(/<nav\b[^>]*class=["'][^"']*\barticle-nav\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || "";
    const relatedLinks = [...nav.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((match) => match[1]);
    if (new Set(relatedLinks).size !== 2) errors.push(`${article.relativePath}: cần đúng hai liên kết bài liên quan khác nhau`);
    if (relatedLinks.includes(article.internalPath)) errors.push(`${article.relativePath}: liên kết bài liên quan tự trỏ về chính bài`);
  }

  if (!currentNode) {
    errors.push(`${article.relativePath}: thiếu Article/NewsArticle JSON-LD`);
  } else {
    if (currentNode.wordCount !== article.wordCount || article.wordCount < 120) errors.push(`${article.relativePath}: wordCount JSON-LD chưa đồng bộ`);
    if (!Array.isArray(currentNode.keywords) || !currentNode.keywords.length) errors.push(`${article.relativePath}: JSON-LD thiếu keywords`);
    if (!Array.isArray(currentNode.about) || !currentNode.about.every((item) => item?.["@type"] === "Thing" && item.name)) {
      errors.push(`${article.relativePath}: JSON-LD about chưa chuẩn hóa thành Thing`);
    }
    if (!currentNode.image || !(Array.isArray(currentNode.image) ? currentNode.image[0] : currentNode.image)) errors.push(`${article.relativePath}: JSON-LD thiếu ảnh bài viết`);
    if (!currentNode.articleSection) errors.push(`${article.relativePath}: JSON-LD thiếu articleSection`);
    if (!currentNode.genre) errors.push(`${article.relativePath}: JSON-LD thiếu genre theo cụm chủ đề`);
  }

  const titleKey = normalize(currentTitle);
  const descKey = normalize(currentDescription);
  const keywordKey = normalize(article.primaryKeyword);
  titleOwners.set(titleKey, [...(titleOwners.get(titleKey) || []), article.relativePath]);
  descriptionOwners.set(descKey, [...(descriptionOwners.get(descKey) || []), article.relativePath]);
  keywordOwners.set(keywordKey, [...(keywordOwners.get(keywordKey) || []), article.relativePath]);

  const exactOccurrences = normalize(article.articleText).split(normalize(article.primaryKeyword)).length - 1;
  if (exactOccurrences > 6) warnings.push(`${article.relativePath}: cụm từ khóa chính xuất hiện ${exactOccurrences} lần, cần đọc lại để tránh lặp`);
}

for (const [title, owners] of titleOwners) if (title && owners.length > 1) errors.push(`Trùng title SEO: ${owners.join(", ")}`);
for (const [description, owners] of descriptionOwners) if (description && owners.length > 1) errors.push(`Trùng meta description: ${owners.join(", ")}`);
for (const [keyword, owners] of keywordOwners) if (keyword && owners.length > 1) warnings.push(`Từ khóa chính gần trùng giữa: ${owners.join(", ")}`);

if (CHECK_ONLY && changedFiles.length) errors.push(`Còn ${changedFiles.length} bài chưa được đồng bộ tối ưu từ khóa: ${changedFiles.join(", ")}`);

console.log(JSON.stringify({
  mode: CHECK_ONLY ? "check" : "update",
  articles: finalArticles.length,
  editorialFeedArticles: feed.items?.length || 0,
  dailyAnswerArticles: dailyFeed.articles?.length || 0,
  clusters: Object.fromEntries(Object.keys(CLUSTERS).map((id) => [id, finalArticles.filter((article) => article.clusterId === id).length])),
  changedFiles: changedFiles.length,
  changes: changeStats,
  uniqueTitles: titleOwners.size,
  uniqueDescriptions: descriptionOwners.size,
  uniquePrimaryKeywords: keywordOwners.size,
  warnings: warnings.length,
  sampleWarnings: warnings.slice(0, 20),
  errors: errors.length,
  sampleErrors: errors.slice(0, 30),
}, null, 2));

if (warnings.length) console.warn(warnings.join("\n"));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
