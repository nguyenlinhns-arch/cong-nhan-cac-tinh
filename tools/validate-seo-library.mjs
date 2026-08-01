import fs from "node:fs";
import path from "node:path";
import { communitySourceImages } from "./community-source-images.mjs";
import { curatedArticles, existingNews } from "./curated-articles.mjs";
import { communityArticles } from "./community-articles.mjs";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const errors = [];
const warnings = [];

const feed = JSON.parse(fs.readFileSync(path.join(root, "feed.json"), "utf8"));
const imageSources = JSON.parse(fs.readFileSync(path.join(root, "assets", "articles", "sources.json"), "utf8"));
const searchIndex = JSON.parse(fs.readFileSync(path.join(root, "search-index.json"), "utf8"));
const editorialSources = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-sources.json"), "utf8"));
const jobFeed = JSON.parse(fs.readFileSync(path.join(root, "jobs.json"), "utf8"));
const provinceDirectory = JSON.parse(fs.readFileSync(path.join(root, "data", "provinces-2026.json"), "utf8"));
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

const strip = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z0-9#]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

const normalize = (text) => strip(text)
  .toLocaleLowerCase("vi")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/g, "d")
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const editorialArticles = [...curatedArticles, ...communityArticles];
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
for (const article of editorialArticles) {
  if (!Array.isArray(article.intro) || article.intro.length < 2) errors.push(`${article.slug}: bài báo cần ít nhất hai đoạn mở bài`);
  if (!Array.isArray(article.sections) || article.sections.length < 3) errors.push(`${article.slug}: bài báo cần ít nhất ba phần nội dung`);
  if (collectTextFragments(article).some(lowIncomeFigure)) {
    errors.push(`${article.slug}: bài nguồn có mức thu nhập thấp hơn 20 triệu đồng/tháng; phải bỏ toàn bộ mục và con số thu nhập`);
  }

  for (const section of article.sections || []) {
    const key = normalize(section.title);
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
  const image = getAttr(html, /(?:<section class="[^"]*\barticle-hero\b[^"]*">|<figure class="article-cover">)[\s\S]*?<img src="([^"]+)"/i, `${prefix}hero image`);
  const ogImage = getAttr(html, /<meta property="og:image" content="([^"]+)"/i, `${prefix}Open Graph image`);
  const sourceImage = communitySourceImages[slug];
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  const visibleWords = visible.split(/\s+/).filter(Boolean).length;

  if (h1Count !== 1) errors.push(`${prefix}expected one H1, got ${h1Count}`);
  if (title.length < 35 || title.length > 90) warnings.push(`${prefix}title length ${title.length}`);
  if (description.length < 100 || description.length > 165) errors.push(`${prefix}description length ${description.length}`);
  if (canonical !== item.url) errors.push(`${prefix}wrong canonical`);
  if (!normalize(html).includes(normalize(primaryKeyword))) errors.push(`${prefix}primary keyword absent from visible body`);
  if (visibleWords < 650) errors.push(`${prefix}only ${visibleWords} visible words; expected at least 650`);
  if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html) || !/"@type":"FAQPage"/.test(html)) errors.push(`${prefix}missing article or FAQ schema`);
  if (sourceImage) {
    if (image !== sourceImage.image) errors.push(`${prefix}does not use the original image from its source article`);
  } else if (!editorialTopicImageOverrides.has(slug)
    && !image.startsWith("https://vinacomin.vn/Share/Media/")
    && !(image.startsWith(`${base}/assets/`) && imageSources[slug]?.source_url?.startsWith("https://vinacomin.vn/Share/Media/"))) {
    errors.push(`${prefix}original editorial image is not from the Vinacomin image library or a verified local copy`);
  }
  if (ogImage !== image || item.image !== image) errors.push(`${prefix}hero, Open Graph and feed images must match`);
  if (/editorial-sources|Nguồn dữ kiện đã đối chiếu|Bài viết do Nguyễn Tử Linh phân tích và biên soạn độc lập/iu.test(html)) {
    errors.push(`${prefix}contains a public editorial-source block`);
  }
  if (/class="article-(?:meta|source-credit)"/i.test(html)) errors.push(`${prefix}contains visible author, image or source credits`);
  if (/class="source-note"|<h2[^>]*>\s*Nguồn tham khảo\s*<\/h2>/iu.test(html)) errors.push(`${prefix}contains a visible source block`);
  if (/Bài\s+\d{1,2}\s*\/\s*50|50\+?\s*bài|Cách đọc đúng:|Tóm tắt:/iu.test(visible)) errors.push(`${prefix}contains quota-driven or generic template wording`);
  if (visible.split(/(?<=[.!?])\s+/u).some(lowIncomeFigure)) errors.push(`${prefix}publishes an income figure below 20 million VND per month`);

  const externalAnchors = [...html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith(base) && !url.startsWith("https://zalo.me/") && !url.startsWith("https://m.me/"));
  if (externalAnchors.length) errors.push(`${prefix}unexpected outbound anchors: ${externalAnchors.join(", ")}`);

  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const [jsonIndex, match] of jsonScripts.entries()) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${prefix}invalid JSON-LD ${jsonIndex + 1}: ${error.message}`); }
  }

  const body = html.match(/<article class="article-body">([\s\S]*?)<\/article>/i)?.[1] || "";
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
  if (sourceImage) {
    if (imageRecord?.source_url !== sourceImage.image) errors.push(`${slug}: image registry does not match the source article image`);
    if (imageRecord?.source_article_url !== sourceImage.sourceUrl) errors.push(`${slug}: image registry does not match the source article URL`);
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
  for (const phrase of ["2–3 tháng", "7,5 triệu", "18–40", "1m53", "47kg", "ky-thuat-khai-thac-mo-ham-lo-quang-ninh", "ky-thuat-xay-dung-mo-ham-lo-quang-ninh"]) {
    if (!campaignHtml.includes(phrase)) errors.push(`Recruitment campaign page is missing ${phrase}`);
  }
}
const roleJobs = [
  { slug: "ky-thuat-khai-thac-mo-ham-lo-quang-ninh", title: "Kỹ thuật khai thác mỏ hầm lò" },
  { slug: "ky-thuat-xay-dung-mo-ham-lo-quang-ninh", title: "Kỹ thuật xây dựng mỏ hầm lò" },
];
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
    for (const property of ["title", "description", "datePosted", "validThrough", "employmentType", "hiringOrganization", "jobLocation", "baseSalary"]) {
      if (!jobPosting[property]) errors.push(`${role.slug}: JobPosting is missing ${property}`);
    }
    if (jobPosting.title !== role.title) errors.push(`${role.slug}: JobPosting title must be a single role`);
  }
  for (const phrase of ["2–3 tháng", "7,5 triệu", "18–40", "1m53", "47kg", "02 bộ hồ sơ"]) {
    if (!jobHtml.includes(phrase)) errors.push(`${role.slug}: missing ${phrase}`);
  }
  if (!sitemap.includes(jobUrl)) errors.push(`${role.slug}: absent from sitemap`);
  if (!jobFeed.jobs?.some(job => job.url === jobUrl && job.status === "open" && job.title === role.title)) errors.push(`${role.slug}: absent from jobs.json`);
}
if (!sitemap.includes(`<loc>${campaignUrl}</loc>`)) errors.push("Recruitment campaign page is absent from sitemap");
if (!Array.isArray(jobFeed.jobs) || jobFeed.jobs.length !== roleJobs.length) errors.push("jobs.json must contain exactly two role-specific jobs");
if (provinceDirectory.provinces?.length !== 26) errors.push(`Expected 26 province pages from Lâm Đồng northward, got ${provinceDirectory.provinces?.length || 0}`);
for (const province of provinceDirectory.provinces || []) {
  const file = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");
  if (!fs.existsSync(file)) errors.push(`Missing province page: ${province.slug}`);
}
const excludedSouthernProvinceSlugs = ["ho-chi-minh", "dong-nai", "tay-ninh", "can-tho", "vinh-long", "dong-thap", "ca-mau", "an-giang"];
for (const slug of excludedSouthernProvinceSlugs) {
  const url = `${base}/viec-lam-nganh-than/${slug}/`;
  const file = path.join(root, "viec-lam-nganh-than", slug, "index.html");
  if (fs.existsSync(file)) errors.push(`Province page outside the approved Lâm Đồng-north scope still exists: ${slug}`);
  if (sitemap.includes(url)) errors.push(`Province URL outside the approved scope remains in sitemap: ${slug}`);
}

const allHtml = collectHtml(root);
for (const file of allHtml) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (/^google[a-z0-9]+\.html$/i.test(rel)) continue;
  const visible = strip(html);
  if (!/<meta\s+name="viewport"\s+content="[^"]*width=device-width/i.test(html)) errors.push(`${rel}: missing responsive viewport`);
  if (!/<link\s+rel="stylesheet"\s+href="\/mobile-ux\.css\?v=1"/i.test(html)) errors.push(`${rel}: missing shared mobile stylesheet`);
  if (!/<script\s+src="\/analytics\.js\?v=1"\s+defer><\/script>/i.test(html)) errors.push(`${rel}: missing shared analytics script`);
  if (!/<script\s+src="\/mobile-ux\.js\?v=2"\s+defer><\/script>/i.test(html)) errors.push(`${rel}: missing shared mobile script`);
  if (/Bài\s+\d{1,2}\s*\/\s*50|50\+?\s*bài/iu.test(visible)) errors.push(`${rel}: contains an obsolete article-count claim`);
  if (/18(?:–|-|\s+đến\s+)35|1(?:m|,)56|48\s*kg/iu.test(visible)) errors.push(`${rel}: contains superseded 2026 recruitment criteria`);
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

if (!Array.isArray(searchIndex.items) || !searchIndex.items.length) errors.push("Search index must contain indexable pages");
else {
  const searchUrls = searchIndex.items.map((item) => item.url);
  if (new Set(searchUrls).size !== searchUrls.length) errors.push("Search index contains duplicate URLs");
  for (const item of searchIndex.items) {
    if (!item.url?.startsWith("/") || !item.title || !item.description || !item.category) errors.push(`Invalid search entry: ${JSON.stringify(item)}`);
  }
  for (const item of items) {
    const relative = item.url.slice(base.length);
    if (!searchUrls.includes(relative)) errors.push(`${relative}: absent from search index`);
  }
  for (const url of sitemapUrls) {
    const relative = url.slice(base.length);
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
  searchPages: searchIndex.items?.length || 0,
  errors: errors.length,
  warnings: warnings.length,
  sampleWarnings: warnings.slice(0, 10),
}, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
