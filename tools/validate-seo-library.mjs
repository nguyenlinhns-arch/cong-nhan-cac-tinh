import fs from "node:fs";
import path from "node:path";
import { communitySourceImages } from "./community-source-images.mjs";
import { curatedArticles, existingNews } from "./curated-articles.mjs";
import { communityArticles } from "./community-articles.mjs";
import { pressStoryArticles } from "./press-story-articles.mjs";
import { articleInlineImages } from "./article-inline-images.mjs";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const recruitment = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const criteria = recruitment.criteria;
const errors = [];
const warnings = [];

const feed = JSON.parse(fs.readFileSync(path.join(root, "feed.json"), "utf8"));
const imageSources = JSON.parse(fs.readFileSync(path.join(root, "assets", "articles", "sources.json"), "utf8"));
const searchIndex = JSON.parse(fs.readFileSync(path.join(root, "search-index.json"), "utf8"));
const searchCore = JSON.parse(fs.readFileSync(path.join(root, "search-core.json"), "utf8"));
const searchProvinces = JSON.parse(fs.readFileSync(path.join(root, "search-provinces.json"), "utf8"));
const searchContent = JSON.parse(fs.readFileSync(path.join(root, "search-content.json"), "utf8"));
const editorialSources = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-sources.json"), "utf8"));
const jobFeed = JSON.parse(fs.readFileSync(path.join(root, "jobs.json"), "utf8"));
const localCoverage = JSON.parse(fs.readFileSync(path.join(root, "local-coverage.json"), "utf8"));
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

const strip = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z0-9#]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

const removeArticleInterface = (html) => html
  .replace(/<section\b[^>]*class=["'][^"']*\barticle-(?:apply|share-panel)\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, " ")
  .replace(/<section\b[^>]*class=["'][^"']*\bprofessional-news-faq\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, " ")
  .replace(/<section\b[^>]*class=["'][^"']*\b(?:source-original-card|article-seo-info)\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, " ")
  .replace(/<aside\b[^>]*class=["'][^"']*\barticle-aside\b[^"']*["'][^>]*>[\s\S]*?<\/aside>/gi, " ");

const decodeAttribute = (value = "") => value
  .replaceAll("&amp;", "&")
  .replaceAll("&#038;", "&")
  .replaceAll("&#38;", "&")
  .replaceAll("&quot;", '"');

const normalize = (text) => strip(text)
  .toLocaleLowerCase("vi")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/g, "d")
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const editorialArticles = [...curatedArticles, ...communityArticles, ...pressStoryArticles];
const managedSearchTitles = new Map([...curatedArticles, ...existingNews].map((article) => [
  article.slug,
  article.seoTitle || (article.title.length > 52 ? article.title : `${article.title} | Thầy Linh`),
]));
for (const article of [...curatedArticles, ...existingNews]) {
  if (article.seoTitle && article.seoTitle.length > 60) {
    errors.push(`${article.slug}: tiêu đề tìm kiếm riêng dài ${article.seoTitle.length} ký tự; tối đa 60 ký tự`);
  }
}
const pressStoriesBySlug = new Map(pressStoryArticles.map((article) => [article.slug, article]));
const rewrittenNewsSlugs = new Set([
  ...communityArticles,
  ...pressStoryArticles,
  ...existingNews.filter((article) => (article.sources || []).some((source) => source.url)),
].map((article) => article.slug));
const editorialTopicImageOverrides = new Set([...curatedArticles, ...existingNews]
  .filter((article) => article.imagePolicy === "editorial-topic-override")
  .map((article) => article.slug));
const editorialSectionOwners = new Map();
const narrativeShingleOwners = new Map();
const collectTextFragments = (value, fragments = []) => {
  if (typeof value === "string") fragments.push(value);
  else if (Array.isArray(value)) {
    if (value.length === 2 && value.every((item) => typeof item === "string")) fragments.push(value.join(" "));
    for (const item of value) collectTextFragments(item, fragments);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectTextFragments(item, fragments);
  }
  return fragments;
};
const lowIncomeFigure = (value) => {
  const text = strip(value).replaceAll(",", ".");
  if (!/(?:thu nhập|lương|tiền lương|triệu\s*đồng)/iu.test(text)) return false;
  const directAmounts = [...text.matchAll(/\b(\d+(?:\.\d+)?)\s*(?:(?:–|—|-)\s*\d+(?:\.\d+)?|(?:đến|tới)\s*(?:trên\s*)?\d+(?:\.\d+)?)?\s*triệu(?:\s*đồng)?\s*(?:\/\s*(?:người\s*\/\s*)?(tháng|năm)|(?:mỗi|một)\s+(tháng|năm))/giu)];
  for (const amount of directAmounts) {
    const minimum = Number(amount[1]);
    const unit = amount[2] || amount[3];
    if ((unit === "tháng" && minimum < 20) || (unit === "năm" && minimum < 240)) return true;
  }
  if (directAmounts.length) return false;
  const standaloneAmount = text.match(/\b(\d+(?:\.\d+)?)\s*(?:(?:–|—|-)\s*\d+(?:\.\d+)?|(?:đến|tới)\s*(?:trên\s*)?\d+(?:\.\d+)?)?\s*triệu/iu);
  if (!standaloneAmount) return false;
  const minimum = Number(standaloneAmount[1]);
  const monthlyLabel = /(?:thu nhập|lương|tiền lương)[^.!?]{0,40}\btháng\b|\btháng\b[^.!?]{0,40}(?:thu nhập|lương|tiền lương)/iu.test(text);
  const annualLabel = /(?:thu nhập|lương|tiền lương)[^.!?]{0,40}\bnăm\b|\bnăm\b[^.!?]{0,40}(?:thu nhập|lương|tiền lương)/iu.test(text);
  return (monthlyLabel && minimum < 20) || (annualLabel && minimum < 240);
};
const formulaicEditorialPattern = /(?:không chỉ|đáng chú ý|không nằm ở|không dừng ở|thay vì|với từ khóa|người đọc vì thế tìm thấy)/iu;
const genericEditorialHeadingPattern = /^(?:kết quả phối hợp được ghi nhận tại|những con số ghi lại dấu mốc tại|nguồn lực dành cho|người lao động .+ cần chuẩn bị gì\?|từ .+ đến nơi học và nơi làm việc)$/iu;
for (const article of editorialArticles) {
  if (!Array.isArray(article.intro) || article.intro.length < 2) errors.push(`${article.slug}: bài báo cần ít nhất hai đoạn mở bài`);
  if (!Array.isArray(article.sections) || article.sections.length < 3) errors.push(`${article.slug}: bài báo cần ít nhất ba phần nội dung`);
  const fragments = collectTextFragments(article);
  if (fragments.some(lowIncomeFigure)) {
    errors.push(`${article.slug}: bài nguồn có mức thu nhập thấp hơn 20 triệu đồng/tháng; phải bỏ toàn bộ mục và con số thu nhập`);
  }
  if (fragments.some((fragment) => formulaicEditorialPattern.test(strip(fragment)))) {
    errors.push(`${article.slug}: còn cấu trúc văn mẫu; cần viết lại bằng câu chủ động, trực tiếp`);
  }

  const editorialHeadings = [
    ...(article.sections || []).map((section) => section.title),
    article.factsTitle,
    article.actionTitle,
    article.conclusionTitle,
  ].filter(Boolean);
  for (const title of editorialHeadings) {
    const key = normalize(title);
    if (genericEditorialHeadingPattern.test(strip(title))) {
      errors.push(`${article.slug}: tiêu đề mục còn là khung văn mẫu “${strip(title)}”`);
    }
    const owners = editorialSectionOwners.get(key) || [];
    owners.push(article.slug);
    editorialSectionOwners.set(key, owners);
  }

  const narrative = [
    ...(article.intro || []),
    ...(article.sections || []).flatMap((section) => section.paragraphs || []),
  ].map(normalize).join(" ");
  const words = narrative.split(/\s+/).filter(Boolean);
  const localShingles = new Set();
  for (let index = 0; index <= words.length - 14; index += 1) {
    localShingles.add(words.slice(index, index + 14).join(" "));
  }
  for (const shingle of localShingles) {
    const owners = narrativeShingleOwners.get(shingle) || new Set();
    owners.add(article.slug);
    narrativeShingleOwners.set(shingle, owners);
  }
}

for (const [title, owners] of editorialSectionOwners) {
  if (owners.length > 1) errors.push(`Trùng tiêu đề mục “${title}” ở các bài: ${owners.join(", ")}`);
}
for (const [shingle, owners] of narrativeShingleOwners) {
  if (/cam ket thu nhap 20 25 trieu dong thang|20 25 trieu dong thang khi hoan thanh dinh muc/iu.test(shingle)) continue;
  if (owners.size >= 3) errors.push(`Cụm văn mẫu lặp ở ${owners.size} bài: “${shingle}”`);
}

function getAttr(html, pattern, label) {
  const value = html.match(pattern)?.[1] || "";
  if (!value) errors.push(`Missing ${label}`);
  return value;
}

function collectHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".") || /^google[a-z0-9_-]+\.html$/i.test(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

function fileForUrl(url) {
  if (!url.startsWith(`${base}/`)) return null;
  const relative = url.slice(base.length + 1);
  return path.join(root, relative, "index.html");
}

function resolveLocalHref(sourceFile, rawHref) {
  if (!rawHref || rawHref.startsWith("#") || /^(mailto:|tel:|sms:|javascript:|data:)/i.test(rawHref)) return null;
  let href = rawHref;
  if (/^https?:\/\//i.test(href)) {
    if (!href.startsWith(base)) return null;
    href = href.slice(base.length) || "/";
  } else if (href.startsWith("//")) {
    return null;
  }
  href = href.split("#", 1)[0].split("?", 1)[0];
  if (!href) return null;
  try { href = decodeURIComponent(href); } catch { /* keep original path */ }
  let target = href.startsWith("/")
    ? path.join(root, href.slice(1))
    : path.resolve(path.dirname(sourceFile), href);
  if (!target.startsWith(root)) return null;
  if (href.endsWith("/") || (fs.existsSync(target) && fs.statSync(target).isDirectory())) target = path.join(target, "index.html");
  return target;
}

const items = Array.isArray(feed.items) ? feed.items : [];
if (!items.length) errors.push("Editorial feed must contain at least one article");
const slugs = items.map((item) => item.url?.split("/").filter(Boolean).at(-1));
if (slugs.some((slug) => !slug)) errors.push("Feed contains an invalid article URL");
if (new Set(slugs).size !== slugs.length) errors.push("Duplicate article slugs");
if (new Set(items.map((item) => item.title)).size !== items.length) errors.push("Duplicate article titles");
if (new Set(items.map((item) => item.url)).size !== items.length) errors.push("Duplicate article URLs");

const articleImages = [];
const paragraphOwners = new Map();
const articleVocabulary = [];
for (const [index, slug] of slugs.entries()) {
  const item = items[index];
  const prefix = `${slug}: `;
  const file = fileForUrl(item.url);
  if (!file || !fs.existsSync(file)) {
    errors.push(`${prefix}missing article file for ${item.url}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const visible = strip(html);
  const title = getAttr(html, /<title>([^<]+)<\/title>/i, `${prefix}title`);
  const description = getAttr(html, /<meta name="description" content="([^"]+)"/i, `${prefix}description`);
  const canonical = getAttr(html, /<link rel="canonical" href="([^"]+)"/i, `${prefix}canonical`);
  const primaryKeyword = getAttr(html, /<meta name="keywords" content="([^,"]+)/i, `${prefix}primary keyword`);
  const articleBody = html.match(/<article class="article-body(?:\s[^"]*)?">([\s\S]*?)<\/article>/i)?.[1] || "";
  const editorialBody = removeArticleInterface(articleBody);
  const articleHero = html.match(/<section\b[^>]*class="[^"]*\barticle-hero\b[^"]*"[^>]*>([\s\S]*?)<\/section>/i)?.[1] || "";
  const coverFigures = [...articleBody.matchAll(/<figure\b[^>]*class="[^"]*\barticle-cover\b[^"]*"[^>]*>([\s\S]*?)<\/figure>/gi)];
  const image = decodeAttribute(coverFigures[0]?.[1].match(/<img\b[^>]*src="([^"]+)"/i)?.[1]
    || getAttr(html, /<section\b[^>]*class="[^"]*\barticle-hero\b[^"]*"[^>]*>[\s\S]*?<img\b[^>]*src="([^"]+)"/i, `${prefix}article image`));
  const ogImage = decodeAttribute(getAttr(html, /<meta property="og:image" content="([^"]+)"/i, `${prefix}Open Graph image`));
  const sourceImage = communitySourceImages[slug];
  const pressStory = pressStoriesBySlug.get(slug);
  const rewrittenNews = rewrittenNewsSlugs.has(slug);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  const visibleWords = visible.split(/\s+/).filter(Boolean).length;

  if (h1Count !== 1) errors.push(`${prefix}expected one H1, got ${h1Count}`);
  const expectedSearchTitle = managedSearchTitles.get(slug);
  if (expectedSearchTitle && title !== expectedSearchTitle) errors.push(`${prefix}wrong mobile search title`);
  const managedArticle = [...curatedArticles, ...existingNews].find((article) => article.slug === slug);
  const sourcePolicyArticle = [...editorialArticles, ...existingNews].find((article) => article.slug === slug);
  const visibleH1 = html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1] || "";
  if (managedArticle && normalize(visibleH1) !== normalize(managedArticle.title)) {
    errors.push(`${prefix}visible H1 must keep the full editorial title`);
  }
  if (/<img\b/i.test(articleHero)) errors.push(`${prefix}hero must stay text-only; the source image belongs in the article body`);
  if (coverFigures.length !== 1) errors.push(`${prefix}expected one editorial cover inside the article body, got ${coverFigures.length}`);
  if (!/<figcaption>[\s\S]*?\S[\s\S]*?<\/figcaption>/i.test(coverFigures[0]?.[1] || "")) errors.push(`${prefix}editorial cover is missing a caption`);
  if (title.length < 35 || title.length > 90) warnings.push(`${prefix}title length ${title.length}`);
  if (title.length > 64) warnings.push(`${prefix}mobile search title may be truncated at ${title.length} characters`);
  if (description.length < 100 || description.length > 165) errors.push(`${prefix}description length ${description.length}`);
  if (canonical !== item.url) errors.push(`${prefix}wrong canonical`);
  if (!rewrittenNews && !normalize(html).includes(normalize(primaryKeyword))) errors.push(`${prefix}primary keyword absent from visible body`);
  const minimumVisibleWords = rewrittenNews ? 600 : 650;
  if (visibleWords < minimumVisibleWords) errors.push(`${prefix}only ${visibleWords} visible words; expected at least ${minimumVisibleWords}`);
  if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)) errors.push(`${prefix}missing article schema`);
  if (!rewrittenNews && !pressStory && !/"@type":"FAQPage"/.test(html)) errors.push(`${prefix}missing FAQ schema`);
  if (rewrittenNews) {
    if (!/class="[^\"]*\barticle-body--professional\b[^\"]*"/i.test(html)) errors.push(`${prefix}newsroom item is missing the professional article layout`);
    if (!/class="[^\"]*\barticle-body--journalistic-v2\b[^\"]*"/i.test(html)) errors.push(`${prefix}newsroom item is missing the newsroom v2 layout`);
    const rewrittenParagraphCount = (editorialBody.match(/<p(?:\s|>)/gi) || []).length;
    if (rewrittenParagraphCount < 6) errors.push(`${prefix}professional article has only ${rewrittenParagraphCount} paragraphs`);
    const sourceNote = articleBody.match(/<p class="article-source-note">([\s\S]*?)<\/p>/i)?.[1] || "";
    if (!sourceNote) errors.push(`${prefix}newsroom item is missing its concise source note`);
    if (sourcePolicyArticle?.hideSourceUrlsInSchema && /<a\b/i.test(sourceNote)) errors.push(`${prefix}source note must not link to the source website`);
    if (!sourcePolicyArticle?.hideSourceUrlsInSchema && sourceNote && !/<a\b/i.test(sourceNote)) errors.push(`${prefix}newsroom item is missing its concise linked source note`);
    if (/class="(?:source-original-card|article-seo-info|article-source-footer)"/i.test(articleBody)) errors.push(`${prefix}newsroom item still contains a bulky source or SEO block`);
    if (/class="(?:timeline|faq-list|article-summary|rewritten-news-facts|fact-grid|evidence-list)"/i.test(articleBody)) errors.push(`${prefix}professional article contains a list-like or superseded layout`);
    const editorialHeadingCount = (articleBody.match(/class="editorial-section professional-news-section"[\s\S]*?<h2>/gi) || []).length;
    if (editorialHeadingCount > 2) errors.push(`${prefix}professional article is split into ${editorialHeadingCount} small sections`);
    const rewrittenWords = strip(editorialBody).split(/\s+/u).filter(Boolean).length;
    if (rewrittenWords < 300) errors.push(`${prefix}professional article is too short at ${rewrittenWords} words`);
    if (rewrittenWords > 2_000) errors.push(`${prefix}professional article is unexpectedly long at ${rewrittenWords} words`);
    const editorialParagraphs = [...editorialBody.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)]
      .map((match) => strip(match[1]))
      .filter((paragraph) => paragraph && !/^(?:Nguyễn Tử Linh|Bài được Nguyễn Tử Linh|Bài do Nguyễn Tử Linh)/u.test(paragraph));
    const fragmentaryParagraphs = editorialParagraphs.filter((paragraph) => paragraph.split(/\s+/u).length < 18);
    if (fragmentaryParagraphs.length) errors.push(`${prefix}contains ${fragmentaryParagraphs.length} fragmentary paragraph(s): ${fragmentaryParagraphs[0]}`);
    if (/<(?:ul|ol)\b/i.test(editorialBody)) errors.push(`${prefix}uses a list inside the journalistic body`);
    if (editorialBody.includes("—")) errors.push(`${prefix}contains a prohibited em dash`);
    if (/(?:TÓM TẮT NỘI DUNG|Những thông tin chính|Nội dung trên được tóm tắt)/iu.test(articleBody)) errors.push(`${prefix}still presents the article as a short summary`);
    if (/(?:bài\s+(?:gốc|nguồn|báo|phóng\s+sự)\s+(?:không|chưa)|nguồn(?:\s+chính\s+thức|\s+của\s+[^,.]+)?\s+(?:không|chưa)\s+(?:nêu|cho\s+biết|công\s+bố|làm\s+rõ|đề\s+cập))/iu.test(editorialBody)) errors.push(`${prefix}contains source-narration or missing-source commentary`);
    if (/(?:bài\s+(?:viết|báo|gốc|nguồn|phóng\s+sự)[^.!?]{0,80}\b(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|đề\s+cập|mô\s+tả|tách\s+rõ)|phóng\s+sự(?:\s+ảnh)?\s+của|nguồn(?:\s+chính\s+thức|\s+của\s+[^,.]+)?\s+(?:cũng\s+)?(?:nêu|cho\s+biết|ghi\s+nhận|đề\s+cập|xác\s+nhận|thống\s+kê|liệt\s+kê)|\btác\s+giả\s+|\bphóng\s+viên\s+)/iu.test(editorialBody)) errors.push(`${prefix}still narrates what the source article says`);
  }
  if (pressStory) {
    if (image !== pressStory.imageOriginal) errors.push(`${prefix}does not use the original image from its press source`);
    if (!/class="[^"]*\barticle-layout\b[^"]*\barticle-layout--source\b[^"]*"/i.test(html)
      || !/class="[^"]*\barticle-body\b[^"]*\barticle-body--source\b[^"]*"/i.test(html)) {
      errors.push(`${prefix}press story must use the source-style article layout`);
    }
    if (/class="(?:timeline|faq-list|source-facts|article-aside)"/i.test(html)) {
      errors.push(`${prefix}press story contains a timeline, FAQ or sidebar block`);
    }
    if (!/class="article-cover article-cover--editorial"[\s\S]*?class="article-media-credit"/i.test(articleBody)) {
      errors.push(`${prefix}press-story cover is missing its visible photo credit`);
    }
  } else if (sourceImage) {
    if (image !== sourceImage.image) errors.push(`${prefix}does not use the original image from its source article`);
  } else if (!editorialTopicImageOverrides.has(slug)
    && !image.startsWith("https://vinacomin.vn/Share/Media/")
    && !(image.startsWith(`${base}/assets/`) && imageSources[slug]?.source_url?.startsWith("https://vinacomin.vn/Share/Media/"))) {
    errors.push(`${prefix}original editorial image is not from the Vinacomin image library or a verified local copy`);
  }
  if (ogImage !== image || item.image !== image) errors.push(`${prefix}hero, Open Graph and feed images must match`);
  const expectedInlineImages = articleInlineImages[slug] || [];
  const inlineFigures = [...articleBody.matchAll(/<figure\b[^>]*class="[^"]*\barticle-inline-media\b[^"]*"[^>]*>([\s\S]*?)<\/figure>/gi)];
  if (inlineFigures.length !== expectedInlineImages.length) {
    errors.push(`${prefix}expected ${expectedInlineImages.length} inline source images, got ${inlineFigures.length}`);
  }
  const inlineImageUrls = inlineFigures.map((figure) => decodeAttribute(figure[1].match(/<img\b[^>]*src="([^"]+)"/i)?.[1] || ""));
  for (const [mediaIndex, media] of expectedInlineImages.entries()) {
    const figure = inlineFigures[mediaIndex]?.[1] || "";
    const inlineAlt = figure.match(/<img\b[^>]*alt="([^"]*)"/i)?.[1] || "";
    if (inlineImageUrls[mediaIndex] !== media.src) errors.push(`${prefix}inline image ${mediaIndex + 1} does not match the verified source image`);
    if (normalize(inlineAlt) !== normalize(media.alt)) errors.push(`${prefix}inline image ${mediaIndex + 1} has the wrong alt text`);
    if (!/<figcaption>[\s\S]*?\S[\s\S]*?<\/figcaption>/i.test(figure)) errors.push(`${prefix}inline image ${mediaIndex + 1} is missing a caption`);
    if (pressStory && (!media.credit || !/class="article-media-credit"/i.test(figure))) {
      errors.push(`${prefix}inline source image ${mediaIndex + 1} is missing its visible photo credit`);
    }
  }
  const bodyImageUrls = [...articleBody.matchAll(/<img\b[^>]*src="([^"]+)"/gi)].map((match) => decodeAttribute(match[1]));
  if (new Set(bodyImageUrls).size !== bodyImageUrls.length) errors.push(`${prefix}repeats an image inside the article body`);
  if (rewrittenNews) {
    if (!/<p class="article-source-note">[\s\S]*?<\/p>/i.test(html)) errors.push(`${prefix}missing the concise source line`);
  } else {
    if (!/<div class="[^"]*\barticle-source-footer\b[^"]*">[\s\S]*?<strong>Nguồn:<\/strong>/i.test(html)) errors.push(`${prefix}missing the public source line`);
    if (!/<p class="article-seo-line">[^<]+<\/p>/i.test(html)) errors.push(`${prefix}missing the final SEO sentence`);
  }
  if (/editorial-sources|Nguồn dữ kiện đã đối chiếu|Bài viết do Nguyễn Tử Linh phân tích và biên soạn độc lập/iu.test(html)) {
    errors.push(`${prefix}contains a public editorial-source block`);
  }
  if (/class="article-(?:meta|source-credit)"/i.test(html)) errors.push(`${prefix}contains visible author, image or source credits`);
  if (/class="source-note"|<h2[^>]*>\s*Nguồn tham khảo\s*<\/h2>/iu.test(html)) errors.push(`${prefix}contains a visible source block`);
  if (/Bài\s+\d{1,2}\s*\/\s*50|50\+?\s*bài|Cách đọc đúng:|Tóm tắt:/iu.test(visible)) errors.push(`${prefix}contains quota-driven or generic template wording`);
  if (formulaicEditorialPattern.test(visible)) errors.push(`${prefix}contains formulaic editorial wording`);
  if (/Một lộ trình nghề nghiệp có thể nhìn thấy từ ngày đầu|Không đưa người chưa có nghề thẳng vào sản xuất|Muốn trở thành một phần của tập thể ấy/iu.test(visible)) {
    errors.push(`${prefix}contains an outdated stiff or promotional heading`);
  }
  if (visible.split(/(?<=[.!?])\s+/u).some(lowIncomeFigure)) errors.push(`${prefix}publishes an income figure below 20 million VND per month`);

  const managedArticleSources = (sourcePolicyArticle?.sources || []).map((source) => source.url).filter(Boolean);
  const rawExternalAnchors = [...html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)].map((match) => match[1]);
  if (sourcePolicyArticle?.hideSourceUrlsInSchema && rawExternalAnchors.some((url) => managedArticleSources.includes(decodeAttribute(url)))) {
    errors.push(prefix + "contains a clickable source link");
  }
  const externalAnchors = rawExternalAnchors
    .filter((url) => !url.startsWith(base) && !url.startsWith("https://zalo.me/") && !url.startsWith("https://m.me/") && !managedArticleSources.includes(decodeAttribute(url)));
  if (externalAnchors.length) errors.push(`${prefix}unexpected outbound anchors: ${externalAnchors.join(", ")}`);

  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const [jsonIndex, match] of jsonScripts.entries()) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${prefix}invalid JSON-LD ${jsonIndex + 1}: ${error.message}`); }
  }

  const body = editorialBody;
  articleVocabulary.push({slug, words: new Set(normalize(body).split(/\s+/).filter((word) => word.length > 2))});
  for (const match of body.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)) {
    const paragraph = strip(match[1]);
    if (paragraph.split(/\s+/).length < 30 || paragraph.startsWith("Bài viết do Nguyễn Tử Linh")) continue;
    const key = normalize(paragraph);
    const previous = paragraphOwners.get(key);
    if (previous && previous !== slug) errors.push(`${prefix}duplicates a long paragraph from ${previous}`);
    else paragraphOwners.set(key, slug);
  }
  articleImages.push(image);
}

for (let left = 0; left < articleVocabulary.length; left += 1) {
  for (let right = left + 1; right < articleVocabulary.length; right += 1) {
    const first = articleVocabulary[left];
    const second = articleVocabulary[right];
    let shared = 0;
    for (const word of first.words) if (second.words.has(word)) shared += 1;
    const union = first.words.size + second.words.size - shared;
    const similarity = union ? shared / union : 0;
    if (similarity > 0.85) errors.push(`${first.slug} and ${second.slug}: vocabulary similarity ${(similarity * 100).toFixed(1)}% suggests templated writing`);
  }
}

if (new Set(articleImages).size !== articleImages.length) errors.push("Editorial article images must be unique");
for (const slug of Object.keys(articleInlineImages)) {
  if (!slugs.includes(slug)) errors.push(`${slug}: inline image registry points to an article absent from the feed`);
}

const hubFile = path.join(root, "tin-nganh-than", "index.html");
const hubHtml = fs.readFileSync(hubFile, "utf8");
const hubSections = [...hubHtml.matchAll(/<section class="library-section" id="([^"]+)">([\s\S]*?)<\/section>/gi)];
for (const [, sectionId, sectionHtml] of hubSections) {
  const gridClasses = sectionHtml.match(/<div class="(news-grid[^"]*)"/i)?.[1] || "";
  const cardCount = (sectionHtml.match(/class="news-card"/gi) || []).length;
  const expectedLayout = cardCount === 1 ? "news-grid--single" : cardCount === 2 ? "news-grid--pair" : "news-grid--standard";
  const expectedRemainder = `news-grid--remainder-${cardCount % 3}`;
  if (!gridClasses.includes(expectedLayout)) errors.push(`${sectionId}: ${cardCount} bài nhưng thiếu lớp bố cục ${expectedLayout}`);
  if (!gridClasses.includes(expectedRemainder)) errors.push(`${sectionId}: thiếu lớp cân hàng cuối ${expectedRemainder}`);
}
if (!hubSections.length) errors.push("Editorial hub has no article sections");

const registrySlugs = Object.keys(imageSources).sort();
if (registrySlugs.join("|") !== [...slugs].sort().join("|")) errors.push("Image registry must match the editorial feed exactly");
const sourceUrls = Object.values(imageSources).map((source) => source.source_url);
if (new Set(sourceUrls).size !== sourceUrls.length) errors.push("Image registry contains duplicate images");
for (const slug of slugs) {
  const imageRecord = imageSources[slug];
  const sourceImage = communitySourceImages[slug];
  const pressStory = pressStoriesBySlug.get(slug);
  if (pressStory) {
    if (imageRecord?.source_url !== pressStory.imageOriginal) errors.push(`${slug}: image registry does not match the press-source image`);
    if (imageRecord?.source_article_url !== pressStory.sources?.[0]?.url) errors.push(`${slug}: image registry does not match the press-source article URL`);
  } else if (sourceImage) {
    if (imageRecord?.source_url !== sourceImage.image) errors.push(`${slug}: image registry does not match the source article image`);
    if (imageRecord?.source_article_url !== (sourceImage.imageSourceUrl || sourceImage.sourceUrl)) errors.push(`${slug}: image registry does not match the source article URL`);
    if ((imageRecord?.original_source_url || undefined) !== (sourceImage.originalImage || undefined)) errors.push(`${slug}: image registry does not preserve the original image URL`);
  } else if (!editorialTopicImageOverrides.has(slug)
    && !imageRecord?.source_url?.startsWith("https://vinacomin.vn/Share/Media/")) {
    errors.push(`${slug}: original editorial image is not from the Vinacomin image library`);
  }
}

const editorialBySlug = new Map((editorialSources.articles || []).map((article) => [article.slug, article]));
for (const slug of slugs) {
  const record = editorialBySlug.get(slug);
  if (!record || !Array.isArray(record.sources) || !record.sources.length) errors.push(`${slug}: absent from internal editorial source registry`);
  const sourceImage = communitySourceImages[slug];
  if (sourceImage && record?.sources?.[0]?.url !== sourceImage.sourceUrl) errors.push(`${slug}: primary article source and original image source do not match`);
  for (const source of record?.sources || []) {
    if (source.url && !/^https:\/\//.test(source.url)) errors.push(`${slug}: invalid editorial source URL ${source.url}`);
  }
}

for (const item of items) if (!sitemap.includes(`<loc>${item.url}</loc>`)) errors.push(`${item.url}: absent from sitemap`);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("Sitemap contains duplicate URLs");

const campaignUrl = `${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/`;
const campaignFile = path.join(root, "viec-lam", "cong-nhan-mo-ham-lo-quang-ninh", "index.html");
if (!fs.existsSync(campaignFile)) errors.push("Missing recruitment campaign page");
else {
  const campaignHtml = fs.readFileSync(campaignFile, "utf8");
  for (const phrase of ["2–3 tháng", "10 tháng", "7,5 triệu", `${criteria.age_min}–${criteria.age_max}`, "1m53", `${criteria.weight_min_kg}kg`, "ky-thuat-khai-thac-mo-ham-lo-quang-ninh", "ky-thuat-xay-dung-mo-ham-lo-quang-ninh", "ky-thuat-co-dien-mo-ham-lo-quang-ninh"]) {
    if (!campaignHtml.includes(phrase)) errors.push(`Recruitment campaign page is missing ${phrase}`);
  }
}
const roleJobs = recruitment.occupation_profiles
  .filter((profile) => profile.active_intake)
  .map((profile) => ({ slug: profile.slug, title: profile.title, trainingDuration: profile.training_duration_current }));
for (const role of roleJobs) {
  const jobUrl = `${base}/viec-lam/${role.slug}/`;
  const jobFile = path.join(root, "viec-lam", role.slug, "index.html");
  if (!fs.existsSync(jobFile)) {
    errors.push(`Missing job page: ${role.slug}`);
    continue;
  }
  const jobHtml = fs.readFileSync(jobFile, "utf8");
  const scripts = [...jobHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  let jobPosting;
  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1]);
      const nodes = parsed["@graph"] || [parsed];
      jobPosting ||= nodes.find((node) => node["@type"] === "JobPosting");
    } catch (error) {
      errors.push(`${role.slug}: invalid JSON-LD: ${error.message}`);
    }
  }
  if (!jobPosting) errors.push(`${role.slug}: missing JobPosting schema`);
  else {
    for (const property of ["title", "description", "datePosted", "validThrough", "employmentType", "hiringOrganization", "jobLocation"]) {
      if (!jobPosting[property]) errors.push(`${role.slug}: JobPosting is missing ${property}`);
    }
    if (jobPosting.title !== role.title) errors.push(`${role.slug}: JobPosting title must be a single role`);
    if (jobPosting.directApply !== true) errors.push(`${role.slug}: directApply must be true because the application is completed on the job page`);
    if (jobPosting.baseSalary) errors.push(`${role.slug}: baseSalary must be omitted because the 20–25 million figure is a conditional income commitment, not a fixed base salary`);
    if (jobPosting.hiringOrganization?.name !== recruitment.hiring_organization) errors.push(`${role.slug}: hiringOrganization does not match the recruitment master`);
    if (jobPosting.jobLocation?.address?.addressRegion !== recruitment.work_location) errors.push(`${role.slug}: jobLocation must be the actual Quảng Ninh work location`);
    if (jobPosting.jobLocation?.address?.streetAddress) errors.push(`${role.slug}: recruitment office must not be represented as the worksite`);
  }
  for (const phrase of [role.trainingDuration, "7,5 triệu", `${criteria.age_min}–${criteria.age_max}`, "1m53", `${criteria.weight_min_kg} kg`, "data-application-form"]) {
    if (!jobHtml.includes(phrase)) errors.push(`${role.slug}: missing ${phrase}`);
  }
  if (!sitemap.includes(jobUrl)) errors.push(`${role.slug}: absent from sitemap`);
  if (!jobFeed.jobs?.some(job => job.url === jobUrl && job.status === "open" && job.title === role.title)) errors.push(`${role.slug}: absent from jobs.json`);
}
if (!sitemap.includes(`<loc>${campaignUrl}</loc>`)) errors.push("Recruitment campaign page is absent from sitemap");
if (!Array.isArray(jobFeed.jobs) || jobFeed.jobs.length !== roleJobs.length) errors.push(`jobs.json must contain exactly ${roleJobs.length} role-specific jobs`);
const coverageProvinces = Object.keys(localCoverage.by_province || {});
const localityTotal = Object.values(localCoverage.by_province || {}).reduce((total, count) => total + Number(count || 0), 0);
if (coverageProvinces.length !== 34) errors.push(`Expected 34 province pages from the locality registry, got ${coverageProvinces.length}`);
if (localityTotal !== 3321) errors.push(`Expected 3,321 locality pages from the registry, got ${localityTotal}`);
for (const slug of coverageProvinces) {
  const file = path.join(root, "viec-lam-nganh-than", slug, "index.html");
  if (!fs.existsSync(file)) errors.push(`Missing province page: ${slug}`);
}

const allHtml = collectHtml(root);
for (const file of allHtml) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (/^google[a-z0-9]+\.html$/i.test(rel)) continue;
  const isAdsLanding = rel === "tuyen-tho-mo-quang-ninh/index.html";
  const visible = strip(html);
  const viewportTag = html.match(/<meta\b[^>]*\bname=["']viewport["'][^>]*>/i)?.[0] || "";
  if (!/width=device-width/i.test(viewportTag)) errors.push(`${rel}: missing responsive viewport`);
  if (!/<link\s+rel=["']stylesheet["']\s+href=["']\/(?:mobile-core\.css\?v=1|home-critical\.css\?v=2|google-ads-landing\.css\?v=3)["']/i.test(html)) errors.push(`${rel}: missing current shared mobile stylesheet`);
  if (!/<script\s+src=["']\/analytics\.js\?v=6["']\s+defer><\/script>/i.test(html)) errors.push(`${rel}: missing current shared analytics script`);
  if (!isAdsLanding && !/<script\s+src=["']\/mobile-core\.js\?v=1["']\s+defer><\/script>/i.test(html)) errors.push(`${rel}: missing shared mobile-core script v1`);
  if (isAdsLanding && /\/mobile-core\.(?:css|js)/i.test(html)) errors.push(`${rel}: Ads landing must stay independent from mobile-core`);
  if (/Bài\s+\d{1,2}\s*\/\s*50|50\+?\s*bài/iu.test(visible)) errors.push(`${rel}: contains an obsolete article-count claim`);
  if (/18(?:–|-|\s+đến\s+)35|1(?:m|,)56|1,56\s*m?|48\s*kg/iu.test(visible)) errors.push(`${rel}: contains superseded 2026 recruitment criteria`);
  if (/thu nhập tham khảo|thu nhập thực tế phụ thuộc|thu nhập tùy|không cam kết|không phải mức lương cứng|không phải cam kết|mức thu nhập cố định|không lấy trường hợp cao nhất làm mặt bằng chung/iu.test(visible)) {
    errors.push(`${rel}: contains superseded salary disclaimer wording`);
  }
  for (const match of html.matchAll(/<a\b[^>]*href=(["'])(.*?)\1/gi)) {
    const target = resolveLocalHref(file, match[2]);
    if (target && !fs.existsSync(target)) errors.push(`${rel}: broken internal link ${match[2]}`);
  }
}

const guideFiles = collectHtml(path.join(root, "bai-viet")).filter((file) => path.basename(file) === "index.html");
const feedGuideFiles = items.map((item) => fileForUrl(item.url)).filter((file) => file?.includes(`${path.sep}bai-viet${path.sep}`));
if (guideFiles.length !== feedGuideFiles.length) errors.push(`Every guide must be curated: found ${guideFiles.length} guide files but ${feedGuideFiles.length} in feed`);

const searchItems = [searchCore, searchProvinces, searchContent].flatMap((part) => part.items || []);
if (searchIndex.counts?.total !== searchItems.length) errors.push(`Search manifest total ${searchIndex.counts?.total || 0} does not match ${searchItems.length} indexed items`);
if (!searchItems.length) errors.push("Search index must contain indexable pages");
else {
  const searchUrls = searchItems.map((item) => item.url);
  if (new Set(searchUrls).size !== searchUrls.length) errors.push("Search index contains duplicate URLs");
  for (const item of searchItems) {
    if (!item.url?.startsWith("/") || !item.title || !item.description || !item.category) errors.push(`Invalid search entry: ${JSON.stringify(item)}`);
  }
  for (const item of items) {
    const relative = item.url.slice(base.length);
    if (!searchUrls.includes(relative)) errors.push(`${relative}: absent from search index`);
  }
  for (const url of sitemapUrls) {
    const relative = url.slice(base.length);
    if (/^\/viec-lam-nganh-than\/[^/]+\/.+\/$/u.test(relative)) continue;
    if (!searchUrls.includes(relative)) errors.push(`${relative}: sitemap URL absent from search index`);
  }
}

for (const required of ["tin-nganh-than/index.html", "index.html", "analytics.js", "article-insights.css", "mobile-ux.css", "mobile-ux.js", "search-index.json", "feed.xml", "jobs.json", "jobs.xml", "jooble.xml", "llms.txt"]) {
  if (!fs.existsSync(path.join(root, required))) errors.push(`Missing ${required}`);
}

const analytics = fs.readFileSync(path.join(root, "analytics.js"), "utf8");
if (!analytics.includes("G-PZRRY10JNN")) errors.push("GA4 measurement ID is missing from analytics.js");
if (!analytics.includes("1382247304000287")) errors.push("Meta Pixel ID is missing from analytics.js");

console.log(JSON.stringify({
  curatedArticles: slugs.length,
  pages: allHtml.length,
  searchPages: searchItems.length,
  errors: errors.length,
  warnings: warnings.length,
  sampleWarnings: warnings.slice(0, 10),
}, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
