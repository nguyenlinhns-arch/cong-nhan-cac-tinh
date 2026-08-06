import {execFileSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname || path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = path.resolve(process.env.SITE_ROOT || path.join(ROOT, "tuyen-tho-mo"));
const CHECK_ONLY = process.argv.includes("--check");
const BASE = "https://thaylinhtuyenthomo.vn";
const MAX_TITLE = 65;
const MIN_DESCRIPTION = 100;
const MAX_DESCRIPTION = 165;
const STOPWORDS = new Set("ai anh ba bai ban bang bao cac cach cho co con cua da dang day de den do duoc gi giua hai hay hon khi khong la lai lam mot nam nay ngay nguoi nhieu nhung o qua ra sau tai the theo thi thang trong tu va ve voi tkv vinacomin viet thay linh cong ty tap doan".split(" "));
const CLUSTERS = {
  "giai-dap": {genre: "Giải đáp nghề mỏ", hub: "/giai-dap-nghe-mo/", label: "Xem toàn bộ giải đáp nghề mỏ", guidance: "Đọc thêm các câu trả lời cùng chủ đề để đối chiếu điều kiện và lộ trình phù hợp."},
  "huong-dan-nhap-nghe": {genre: "Hướng dẫn học nghề và tuyển thợ mỏ", hub: "/thong-tin-tuyen-tho-mo/", label: "Xem thông tin tuyển thợ mỏ đang áp dụng", guidance: "Người lao động nên đối chiếu thêm điều kiện, hồ sơ và lịch tiếp nhận đang áp dụng trước khi đăng ký."},
  "viec-lam-dia-phuong": {genre: "Việc làm ngành Than theo địa phương", hub: "/viec-lam-nganh-than/", label: "Xem việc làm ngành Than theo tỉnh", guidance: "Người lao động tại địa phương nên kiểm tra điều kiện từ xa và xác nhận lịch tiếp nhận trước khi lên đường."},
  "thu-nhap-phuc-loi": {genre: "Thu nhập và phúc lợi thợ mỏ", hub: "/thu-nhap-an-o-ho-tro/", label: "Xem thêm về thu nhập, ăn ở và hỗ trợ", guidance: "Khi so sánh thu nhập, cần đọc cùng điều kiện hoàn thành định mức, ngày công và chính sách của đơn vị."},
  "an-toan-cong-nghe": {genre: "An toàn, công nghệ và môi trường mỏ", hub: "/an-toan-ky-luat-moi-truong/", label: "Xem hướng dẫn về an toàn, kỷ luật và môi trường mỏ", guidance: "Người mới vào nghề cần ưu tiên thể lực, kỷ luật và tuân thủ quy trình an toàn trong từng ca."},
  "chuyen-nguoi-tho": {genre: "Chuyện người thợ mỏ", hub: "/cau-chuyen-cong-nhan/", label: "Xem thêm câu chuyện công nhân mỏ", guidance: "Câu chuyện thực tế giúp hình dung nghề rõ hơn, nhưng lựa chọn cuối cùng vẫn cần dựa trên điều kiện của mỗi người."},
  "tin-nganh-than": {genre: "Tin ngành Than và TKV", hub: "/tin-nganh-than/", label: "Xem thêm tin tức ngành Than và TKV", guidance: "Thông tin trong bài cần được đối chiếu với chính sách và kế hoạch đang áp dụng tại từng đơn vị."},
};
const ARTICLE_PATH = /^(?:bai-viet\/[^/]+|tin-nganh-than\/\d{4}\/\d{2}\/\d{2}\/[^/]+|giai-dap-nghe-mo\/(?!index\.html$)[^/]+)\/index\.html$/u;
const JSON_LD = /<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}
const decode = (value = "") => String(value)
  .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'")
  .replaceAll("&apos;", "'").replaceAll("&nbsp;", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const esc = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const text = (html = "") => decode(String(html)
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ").replace(/<[^>]+>/g, " "))
  .replace(/\s+/gu, " ").trim();
const normalized = (value = "") => decode(value).normalize("NFD").replace(/\p{M}/gu, "")
  .replaceAll("đ", "d").replaceAll("Đ", "D").toLocaleLowerCase("vi")
  .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
const tokens = (value = "") => [...new Set(normalized(value).split(/[\s-]+/).filter((token) => token.length > 1 && !STOPWORDS.has(token)))];
function coverage(keyword, value) {
  const wanted = tokens(keyword);
  if (!wanted.length) return 1;
  const found = new Set(tokens(value));
  return wanted.filter((token) => found.has(token)).length / wanted.length;
}
function compact(value, limit) {
  const original = decode(value).replace(/\s+/gu, " ").trim();
  if (original.length <= limit) return original;
  const available = limit - 1;
  const excerpt = original.slice(0, available + 1);
  const boundary = excerpt.lastIndexOf(" ");
  return `${(boundary >= Math.floor(available * 0.7) ? excerpt.slice(0, boundary) : original.slice(0, available)).replace(/[,:;–—-]+$/u, "").trim()}…`;
}
const capitalize = (value = "") => value ? `${value[0].toLocaleUpperCase("vi")}${value.slice(1)}` : value;
function metaTag(html, attribute, key) {
  const safe = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${safe}["'])[^>]*>`, "i"))?.[0] || "";
}
const tagContent = (tag) => decode(tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2] || "").replace(/\s+/gu, " ").trim();
const meta = (html, attribute, key) => tagContent(metaTag(html, attribute, key));
function replaceMeta(html, attribute, key, value) {
  const tag = metaTag(html, attribute, key);
  if (!tag) return html;
  const next = tag.replace(/\bcontent=(["'])(.*?)\1/i, (_all, quote) => `content=${quote}${esc(value)}${quote}`);
  return html.replace(tag, next);
}
function insertProperties(html, entries) {
  const missing = entries.filter(([key, value]) => value && !metaTag(html, "property", key));
  if (!missing.length) return html;
  const markup = missing.map(([key, value]) => `  <meta property="${esc(key)}" content="${esc(value)}">`).join("\n");
  return html.replace(/(<meta\s+name=["']twitter:card["'][^>]*>)/i, `${markup}\n$1`);
}
const titleOf = (html) => text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
const h1Of = (html) => text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
const canonicalOf = (html) => html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || "";
const graphNodes = (data) => data && typeof data === "object" ? (Array.isArray(data["@graph"]) ? data["@graph"] : [data]) : [];
function jsonDocuments(html) {
  return [...html.matchAll(new RegExp(JSON_LD.source, "gi"))].map((match) => {
    try { return {full: match[0], attrs: match[1], data: JSON.parse(match[2])}; }
    catch { return {full: match[0], attrs: match[1], data: null}; }
  });
}
function articleNode(html) {
  for (const document of jsonDocuments(html)) {
    const node = graphNodes(document.data).find((item) => ["Article", "NewsArticle"].includes(item?.["@type"]));
    if (node) return node;
  }
  return null;
}
function keywordList(html, node, fallback) {
  const values = meta(html, "name", "keywords").split(",").map((value) => value.trim()).filter(Boolean);
  const schemaKeywords = Array.isArray(node?.keywords) ? node.keywords : String(node?.keywords || "").split(",");
  values.push(...schemaKeywords);
  const about = Array.isArray(node?.about) ? node.about : [node?.about];
  values.push(...about.map((item) => typeof item === "string" ? item : item?.name).filter(Boolean), fallback);
  const seen = new Set();
  return values.map((value) => text(value)).filter((value) => {
    const key = normalized(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function articleMarkup(html) {
  return html.match(/<article\b[^>]*class=["'][^"']*\barticle-body\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/i)?.[1]
    || html.match(/<main\b[^>]*id=["']noi-dung["'][^>]*>([\s\S]*)<\/main>/i)?.[1]
    || html.match(/<article\b[^>]*>([\s\S]*)<\/article>/i)?.[1]
    || html;
}
function firstCopy(html) {
  const paragraphs = [];
  for (const match of articleMarkup(html).matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    if (/\b(?:eyebrow|byline|date|source|current-facts|article-topic-hub|article-seo-line)\b/i.test(match[1])) continue;
    const value = text(match[2]);
    if (value.length < 35) continue;
    paragraphs.push(value);
    if (paragraphs.join(" ").split(/\s+/).length >= 180 || paragraphs.length >= 3) break;
  }
  return paragraphs.join(" ");
}
function coreText(html) {
  let markup = articleMarkup(html);
  for (const pattern of [
    /<div\b[^>]*class=["'][^"']*\barticle-source-footer\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
    /<p\b[^>]*class=["'][^"']*\barticle-(?:source-note|topic-hub|seo-line)\b[^"']*["'][^>]*>[\s\S]*?<\/p>/gi,
    /<nav\b[^>]*class=["'][^"']*\barticle-nav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/gi,
    /<section\b[^>]*class=["'][^"']*\barticle-apply\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi,
    /<section\b[^>]*class=["'][^"']*\bdaily-seo-final\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi,
  ]) markup = markup.replace(pattern, " ");
  return text(markup);
}
function clusterFor(relative, section, keywordText) {
  if (relative.startsWith("giai-dap-nghe-mo/")) return "giai-dap";
  const sectionKey = normalized(section);
  const keywords = normalized(keywordText);
  if (sectionKey.includes("ket noi dia phuong")) return "viec-lam-dia-phuong";
  if (sectionKey.includes("chuyen nguoi tho")) return "chuyen-nguoi-tho";
  if (/an toan|cong nghe|mo xanh/.test(sectionKey)) return "an-toan-cong-nghe";
  if (/huong dan|tay nghe|dao tao/.test(sectionKey)) return "huong-dan-nhap-nghe";
  if (/thu nhap|doi song/.test(sectionKey)) return "thu-nhap-phuc-loi";
  if (/luong|thu nhap|phuc loi|nghi duong|an o|ho tro/.test(keywords)) return "thu-nhap-phuc-loi";
  if (/tuyen sinh|hoc nghe|ho so|dieu kien|nhap hoc|dao tao/.test(keywords)) return "huong-dan-nhap-nghe";
  if (/tinh|xa|huyen|dia phuong|cao bang|tuyen quang|lai chau|lao cai|dien bien|son la|quang tri|thanh hoa/.test(keywords)) return "viec-lam-dia-phuong";
  if (/an toan|suc khoe|co gioi|cong nghe|moi truong|thong gio/.test(keywords)) return "an-toan-cong-nghe";
  return "tin-nganh-than";
}
function analyze(file) {
  const relative = path.relative(SITE, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const node = articleNode(html);
  const h1 = h1Of(html);
  const keywords = keywordList(html, node, h1);
  const primary = keywords[0] || h1;
  const canonical = canonicalOf(html);
  const section = meta(html, "property", "article:section") || node?.articleSection || (relative.startsWith("giai-dap") ? "Giải đáp nghề mỏ" : "Tin ngành Than");
  const clusterId = clusterFor(relative, section, `${primary} ${keywords.join(" ")} ${h1}`);
  const body = coreText(html);
  const imageValue = meta(html, "property", "og:image") || (Array.isArray(node?.image) ? node.image[0] : node?.image) || "";
  return {file, relative, html, node, h1, keywords, primary, canonical, section, clusterId, cluster: CLUSTERS[clusterId],
    title: titleOf(html), description: meta(html, "name", "description"), first: firstCopy(html), body,
    wordCount: body.split(/\s+/).filter(Boolean).length,
    internal: canonical.startsWith(BASE) ? new URL(canonical).pathname : `/${relative.replace(/index\.html$/, "")}`,
    published: meta(html, "property", "article:published_time") || node?.datePublished || "",
    modified: meta(html, "property", "article:modified_time") || node?.dateModified || "",
    image: imageValue};
}
function relatedTo(article, articles) {
  const own = new Set(tokens(`${article.primary} ${article.keywords.join(" ")} ${article.h1}`));
  return articles.filter((candidate) => candidate.canonical && candidate.canonical !== article.canonical).map((candidate) => {
    const other = new Set(tokens(`${candidate.primary} ${candidate.keywords.join(" ")} ${candidate.h1}`));
    let score = [...own].filter((token) => other.has(token)).length * 4;
    if (candidate.clusterId === article.clusterId) score += 28;
    if (normalized(candidate.section) === normalized(article.section)) score += 10;
    if (candidate.relative.startsWith("bai-viet/")) score += 3;
    if (candidate.relative.split("/")[0] === article.relative.split("/")[0]) score += 1;
    return {candidate, score};
  }).sort((a, b) => b.score - a.score || a.candidate.h1.localeCompare(b.candidate.h1, "vi")).slice(0, 2).map(({candidate}) => candidate);
}
function optimizedDescription(article) {
  if (coverage(article.primary, article.description) >= 0.45 && article.description.length >= MIN_DESCRIPTION && article.description.length <= MAX_DESCRIPTION) return article.description;
  const keyword = capitalize(article.primary.replace(/[?!.,;:]+$/u, ""));
  let value = coverage(article.primary, article.description) >= 0.45 ? article.description : `${keyword}: ${article.description}`;
  if (value.length < MIN_DESCRIPTION) value = `${value.replace(/\.$/u, "")} — bài viết giải thích rõ nội dung, bối cảnh và thông tin người lao động cần đối chiếu.`;
  return compact(value, 160);
}
function updateFooter(html, article) {
  let next = html.replace(/<p\b([^>]*class=["'][^"']*\barticle-seo-line\b[^"']*["'][^>]*)>[\s\S]*?<\/p>/gi, `<p$1>${esc(article.cluster.guidance)}</p>`)
    .replace(/<p\b[^>]*class=["'][^"']*\barticle-topic-hub\b[^"']*["'][^>]*>[\s\S]*?<\/p>/gi, "");
  const topic = `<p class="article-topic-hub">Xem thêm nội dung cùng chủ đề để đối chiếu thông tin trước khi lựa chọn: <a href="${article.cluster.hub}">${esc(article.cluster.label)} →</a></p>`;
  const footer = /<div\b([^>]*class=["'][^"']*\barticle-source-footer\b[^"']*["'][^>]*)>([\s\S]*?)<\/div>/i;
  if (footer.test(next)) return next.replace(footer, (_all, attrs, content) => `<div${attrs}>${content}${content.includes(`href="${article.cluster.hub}"`) ? "" : topic}</div>`);
  const note = /(<p\b[^>]*class=["'][^"']*\barticle-source-note\b[^"']*["'][^>]*>[\s\S]*?<\/p>)/i;
  return note.test(next) ? next.replace(note, `$1${topic}`) : next;
}
function updateNav(html, related) {
  const labels = ["Cùng chủ đề", "Nên đọc tiếp"];
  const links = related.map((item, index) => `<a href="${esc(item.internal)}"><small>${labels[index]}</small>${esc(item.h1)} →</a>`).join("");
  const nav = `<nav class="article-nav" aria-label="Bài viết liên quan theo chủ đề">${links}</nav>`;
  const pattern = /<nav\b[^>]*class=["'][^"']*\barticle-nav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i;
  if (pattern.test(html)) return html.replace(pattern, nav);
  if (/<section\b[^>]*class=["'][^"']*\barticle-apply\b/i.test(html)) return html.replace(/(<section\b[^>]*class=["'][^"']*\barticle-apply\b)/i, `${nav}$1`);
  return html.replace(/<\/article>/i, `${nav}</article>`);
}
function wrapDate(html, article) {
  const date = String(article.published).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || html.includes(`<time datetime="${date}">`)) return html;
  return html.replace(/(<p\b[^>]*class=["'][^"']*(?:eyebrow|daily-seo-date)[^"']*["'][^>]*>[\s\S]*?)(\d{2}\/\d{2}\/\d{4})([\s\S]*?<\/p>)/i, `$1<time datetime="${date}">$2</time>$3`);
}
function updateSchema(html, article, description) {
  return html.replace(new RegExp(JSON_LD.source, "gi"), (full, attrs, payload) => {
    let data;
    try { data = JSON.parse(payload); } catch { return full; }
    const articleRecord = graphNodes(data).find((item) => ["Article", "NewsArticle"].includes(item?.["@type"]));
    if (!articleRecord) return full;
    Object.assign(articleRecord, {headline: article.h1, description, articleSection: article.section, keywords: article.keywords,
      about: article.keywords.slice(0, 6).map((name) => ({"@type": "Thing", name})), genre: article.cluster.genre,
      wordCount: article.wordCount, isAccessibleForFree: true});
    if (article.image) articleRecord.image = [article.image];
    if (!articleRecord.mainEntityOfPage && article.canonical) articleRecord.mainEntityOfPage = {"@id": `${article.canonical}#webpage`};
    const webpage = graphNodes(data).find((item) => item?.["@type"] === "WebPage");
    if (webpage) Object.assign(webpage, {url: article.canonical || webpage.url, name: article.h1, description});
    return `<script${attrs}>${JSON.stringify(data)}</script>`;
  });
}
function maskGeneratedArticleDiffs(files) {
  if (CHECK_ONLY || process.env.GITHUB_ACTIONS !== "true") return false;
  try {
    const relative = files.map((file) => path.relative(ROOT, file));
    execFileSync("git", ["update-index", "--assume-unchanged", ...relative], {cwd: ROOT, stdio: "ignore"});
    return true;
  } catch (error) {
    console.warn(`Không thể đánh dấu đầu ra bài viết là sản phẩm build: ${error.message}`);
    return false;
  }
}

const files = walk(SITE).filter((file) => file.endsWith(".html") && ARTICLE_PATH.test(path.relative(SITE, file).split(path.sep).join("/")));
const initial = files.map(analyze);
const stats = {descriptions: 0, seoGuidanceRewritten: 0, topicLinks: 0, relatedNavigations: 0, dates: 0, schemas: 0};
const changed = [];
for (const article of initial) {
  let next = article.html;
  const description = optimizedDescription(article);
  if (description !== article.description) { next = replaceMeta(next, "name", "description", description); stats.descriptions += 1; }
  if (!article.relative.startsWith("giai-dap-nghe-mo/")) {
    const oldSeoLine = next.match(/<p\b[^>]*class=["'][^"']*\barticle-seo-line\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";
    next = updateFooter(next, article);
    if (oldSeoLine && text(oldSeoLine) !== article.cluster.guidance) stats.seoGuidanceRewritten += 1;
    if (next.includes("article-topic-hub")) stats.topicLinks += 1;
    const beforeNav = next;
    next = updateNav(next, relatedTo(article, initial));
    if (next !== beforeNav) stats.relatedNavigations += 1;
  }
  const beforeDate = next;
  next = wrapDate(next, article);
  if (next !== beforeDate) stats.dates += 1;
  if (article.relative.startsWith("giai-dap-nghe-mo/")) next = insertProperties(next, [["article:published_time", article.published], ["article:modified_time", article.modified], ["article:author", "Nguyễn Tử Linh"], ["article:section", article.section]]);
  next = updateSchema(next, article, description);
  stats.schemas += 1;
  if (next !== article.html) {
    changed.push(article.relative);
    if (!CHECK_ONLY) fs.writeFileSync(article.file, next);
  }
}

const finalArticles = files.map(analyze);
const errors = [];
const warnings = [];
const titleOwners = new Map();
const descriptionOwners = new Map();
const keywordOwners = new Map();
const feed = JSON.parse(fs.readFileSync(path.join(SITE, "feed.json"), "utf8"));
const daily = JSON.parse(fs.readFileSync(path.join(SITE, "daily-seo-articles.json"), "utf8"));
const expected = (feed.items?.length || 0) + (daily.articles?.length || 0);
if (files.length !== expected) errors.push(`Cần ${expected} bài từ feed, hiện kiểm tra được ${files.length}`);
for (const article of finalArticles) {
  const currentTitle = titleOf(article.html);
  const currentDescription = meta(article.html, "name", "description");
  const node = articleNode(article.html);
  if (!article.primary) errors.push(`${article.relative}: thiếu từ khóa chính`);
  if (CHECK_ONLY && (!currentTitle || currentTitle.length > MAX_TITLE)) errors.push(`${article.relative}: title dài ${currentTitle.length} ký tự`);
  if (currentDescription.length < MIN_DESCRIPTION || currentDescription.length > MAX_DESCRIPTION) errors.push(`${article.relative}: description dài ${currentDescription.length} ký tự`);
  if (coverage(article.primary, currentTitle) < 0.35) warnings.push(`${article.relative}: title bao phủ từ khóa chính ở mức thấp`);
  if (coverage(article.primary, currentDescription) < 0.45) errors.push(`${article.relative}: description chưa bao phủ từ khóa “${article.primary}”`);
  if (coverage(article.primary, article.first) < 0.35) errors.push(`${article.relative}: phần mở đầu chưa làm rõ từ khóa “${article.primary}”`);
  if (!article.canonical.startsWith(`${BASE}/`)) errors.push(`${article.relative}: canonical không hợp lệ`);
  const date = String(article.published).slice(0, 10);
  if (!date || !article.html.includes(`<time datetime="${date}">`)) errors.push(`${article.relative}: ngày xuất bản chưa có thẻ time`);
  if (/Tìm hiểu thêm về[\s\S]*?trên Thầy Linh/iu.test(article.html)) errors.push(`${article.relative}: còn câu SEO lộ liễu`);
  if (!article.relative.startsWith("giai-dap-nghe-mo/")) {
    if (!article.html.includes("article-topic-hub") && !article.html.includes(`href="${article.cluster.hub}"`)) errors.push(`${article.relative}: thiếu liên kết cụm chủ đề`);
    const nav = article.html.match(/<nav\b[^>]*class=["'][^"']*\barticle-nav\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || "";
    const links = [...nav.matchAll(/<a\b[^>]*href=["']([^"']+)/gi)].map((match) => match[1]);
    if (new Set(links).size !== 2) errors.push(`${article.relative}: cần đúng hai bài liên quan`);
    if (links.includes(article.internal)) errors.push(`${article.relative}: bài liên quan tự trỏ về chính bài`);
    const seoLine = article.html.match(/<p\b[^>]*class=["'][^"']*\barticle-seo-line\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1];
    if (seoLine && text(seoLine) !== article.cluster.guidance) errors.push(`${article.relative}: dòng hướng dẫn cuối bài chưa tự nhiên`);
  }
  if (!node) errors.push(`${article.relative}: thiếu Article/NewsArticle JSON-LD`);
  else {
    if (node.wordCount !== article.wordCount || article.wordCount < 120) errors.push(`${article.relative}: wordCount chưa đồng bộ`);
    if (!Array.isArray(node.keywords) || !node.keywords.length) errors.push(`${article.relative}: schema thiếu keywords`);
    if (!Array.isArray(node.about) || !node.about.every((item) => item?.["@type"] === "Thing" && item.name)) errors.push(`${article.relative}: schema about chưa chuẩn`);
    if (!node.image) errors.push(`${article.relative}: schema thiếu ảnh`);
    if (!node.articleSection) errors.push(`${article.relative}: schema thiếu articleSection`);
    if (!node.genre) errors.push(`${article.relative}: schema thiếu genre`);
  }
  for (const [map, key] of [[titleOwners, normalized(currentTitle)], [descriptionOwners, normalized(currentDescription)], [keywordOwners, normalized(article.primary)]]) map.set(key, [...(map.get(key) || []), article.relative]);
  const exact = normalized(article.body).split(normalized(article.primary)).length - 1;
  if (exact > 6) warnings.push(`${article.relative}: từ khóa chính lặp ${exact} lần`);
}
for (const [label, owners] of [["title", titleOwners], ["description", descriptionOwners]]) for (const [key, paths] of owners) if (key && paths.length > 1) errors.push(`Trùng ${label}: ${paths.join(", ")}`);
for (const [key, paths] of keywordOwners) if (key && paths.length > 1) warnings.push(`Từ khóa chính gần trùng: ${paths.join(", ")}`);
if (CHECK_ONLY && changed.length) errors.push(`Còn ${changed.length} bài chưa đồng bộ SEO từ khóa`);
const generatedDiffsMasked = maskGeneratedArticleDiffs(files);

console.log(JSON.stringify({mode: CHECK_ONLY ? "check" : "update", articles: files.length, changed: changed.length, stats,
  clusters: Object.fromEntries(Object.keys(CLUSTERS).map((id) => [id, finalArticles.filter((item) => item.clusterId === id).length])),
  generatedDiffsMasked, warnings: warnings.length, sampleWarnings: warnings.slice(0, 20), errors: errors.length, sampleErrors: errors.slice(0, 30)}, null, 2));
if (warnings.length) console.warn(warnings.join("\n"));
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
