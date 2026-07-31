import fs from "node:fs";
import path from "node:path";

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

function getAttr(html, pattern, label) {
  const value = html.match(pattern)?.[1] || "";
  if (!value) errors.push(`Missing ${label}`);
  return value;
}

function collectHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
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
  if (!rawHref || rawHref.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(rawHref)) return null;
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
  const image = getAttr(html, /<section class="article-hero">[\s\S]*?<img src="([^"]+)"/i, `${prefix}hero image`);
  const ogImage = getAttr(html, /<meta property="og:image" content="([^"]+)"/i, `${prefix}Open Graph image`);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
  const visibleWords = visible.split(/\s+/).filter(Boolean).length;

  if (h1Count !== 1) errors.push(`${prefix}expected one H1, got ${h1Count}`);
  if (title.length < 35 || title.length > 90) warnings.push(`${prefix}title length ${title.length}`);
  if (description.length < 100 || description.length > 165) errors.push(`${prefix}description length ${description.length}`);
  if (canonical !== item.url) errors.push(`${prefix}wrong canonical`);
  if (!normalize(html).includes(normalize(primaryKeyword))) errors.push(`${prefix}primary keyword absent from visible body`);
  if (visibleWords < 650) errors.push(`${prefix}only ${visibleWords} visible words; expected at least 650`);
  if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html) || !/"@type":"FAQPage"/.test(html)) errors.push(`${prefix}missing article or FAQ schema`);
  if (!image.startsWith("https://vinacomin.vn/Share/Media/")) errors.push(`${prefix}image is not from the Vinacomin image library`);
  if (ogImage !== image || item.image !== image) errors.push(`${prefix}hero, Open Graph and feed images must match`);
  if (/editorial-sources|Nguồn dữ kiện đã đối chiếu|Bài viết do Nguyễn Tử Linh phân tích và biên soạn độc lập/iu.test(html)) {
    errors.push(`${prefix}contains a public editorial-source block`);
  }
  if (/class="article-(?:meta|source-credit)"/i.test(html)) errors.push(`${prefix}contains visible author, image or source credits`);
  if (/Bài\s+\d{1,2}\s*\/\s*50|50\+?\s*bài|Cách đọc đúng:|Tóm tắt:/iu.test(visible)) errors.push(`${prefix}contains quota-driven or generic template wording`);
  if (/10\s*tháng/iu.test(visible)) errors.push(`${prefix}contains obsolete 10-month training information`);

  const externalAnchors = [...html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith(base) && !url.startsWith("https://zalo.me/") && !url.startsWith("https://m.me/"));
  if (externalAnchors.length) errors.push(`${prefix}unexpected outbound anchors: ${externalAnchors.join(", ")}`);

  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const [jsonIndex, match] of jsonScripts.entries()) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${prefix}invalid JSON-LD ${jsonIndex + 1}: ${error.message}`); }
  }

  const body = html.match(/<article class="article-body">([\s\S]*?)<\/article>/i)?.[1] || "";
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

if (new Set(articleImages).size !== articleImages.length) errors.push("Editorial article images must be unique");

const registrySlugs = Object.keys(imageSources).sort();
if (registrySlugs.join("|") !== [...slugs].sort().join("|")) errors.push("Image registry must match the editorial feed exactly");
const sourceUrls = Object.values(imageSources).map((source) => source.source_url);
if (sourceUrls.some((url) => !url?.startsWith("https://vinacomin.vn/Share/Media/"))) errors.push("Image registry contains a non-Vinacomin image");
if (new Set(sourceUrls).size !== sourceUrls.length) errors.push("Image registry contains duplicate images");

const editorialBySlug = new Map((editorialSources.articles || []).map((article) => [article.slug, article]));
for (const slug of slugs) {
  const record = editorialBySlug.get(slug);
  if (!record || !Array.isArray(record.sources) || !record.sources.length) errors.push(`${slug}: absent from internal editorial source registry`);
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
  for (const phrase of ["2–3 tháng", "7,5 triệu", "18–35", "1m56", "48kg", "ky-thuat-khai-thac-mo-ham-lo-quang-ninh", "ky-thuat-xay-dung-mo-ham-lo-quang-ninh"]) {
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
  for (const phrase of ["2–3 tháng", "7,5 triệu", "18–35", "1m56", "48kg", "02 bộ hồ sơ"]) {
    if (!jobHtml.includes(phrase)) errors.push(`${role.slug}: missing ${phrase}`);
  }
  if (!sitemap.includes(jobUrl)) errors.push(`${role.slug}: absent from sitemap`);
  if (!jobFeed.jobs?.some(job => job.url === jobUrl && job.status === "open" && job.title === role.title)) errors.push(`${role.slug}: absent from jobs.json`);
}
if (!sitemap.includes(`<loc>${campaignUrl}</loc>`)) errors.push("Recruitment campaign page is absent from sitemap");
if (!Array.isArray(jobFeed.jobs) || jobFeed.jobs.length !== roleJobs.length) errors.push("jobs.json must contain exactly two role-specific jobs");
if (provinceDirectory.provinces?.length !== 34) errors.push(`Expected 34 current provinces/cities, got ${provinceDirectory.provinces?.length || 0}`);
for (const province of provinceDirectory.provinces || []) {
  const file = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");
  if (!fs.existsSync(file)) errors.push(`Missing province page: ${province.slug}`);
}

const allHtml = collectHtml(root);
for (const file of allHtml) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  const visible = strip(html);
  if (!/<meta\s+name="viewport"\s+content="[^"]*width=device-width/i.test(html)) errors.push(`${rel}: missing responsive viewport`);
  if (!/<link\s+rel="stylesheet"\s+href="\/mobile-ux\.css\?v=1"/i.test(html)) errors.push(`${rel}: missing shared mobile stylesheet`);
  if (!/<script\s+src="\/analytics\.js\?v=1"\s+defer><\/script>/i.test(html)) errors.push(`${rel}: missing shared analytics script`);
  if (!/<script\s+src="\/mobile-ux\.js\?v=2"\s+defer><\/script>/i.test(html)) errors.push(`${rel}: missing shared mobile script`);
  if (/Bài\s+\d{1,2}\s*\/\s*50|50\+?\s*bài/iu.test(visible)) errors.push(`${rel}: contains an obsolete article-count claim`);
  if (/10\s*tháng/iu.test(visible)) errors.push(`${rel}: contains obsolete 10-month training information`);
  if (/18(?:–|-|\s+đến\s+)40|1(?:m|,)53|47\s*kg/iu.test(visible)) errors.push(`${rel}: contains superseded 2026 recruitment criteria`);
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
