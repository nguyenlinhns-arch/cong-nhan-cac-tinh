import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const master = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const editorial = JSON.parse(fs.readFileSync(path.resolve("content/editorial-sources.json"), "utf8"));
const errors = [];

function collectFiles(directory, predicate, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(full, predicate, output);
    else if (predicate(full)) output.push(full);
  }
  return output;
}

function parseJsonLd(html, label) {
  const values = [];
  for (const [index, match] of [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
    try { values.push(JSON.parse(match[1])); }
    catch (error) { errors.push(`${label}: invalid JSON-LD block ${index + 1}: ${error.message}`); }
  }
  return values;
}

function graphNodes(documents) {
  return documents.flatMap((document) => Array.isArray(document?.["@graph"]) ? document["@graph"] : [document]);
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function robotsGroup(text, agent) {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/#.*$/, "").trim()).filter(Boolean);
  const groups = [];
  let current = null;
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      if (!current || current.directives.length) {
        current = {agents: [], directives: []};
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (current && ["allow", "disallow"].includes(key)) {
      current.directives.push([key, value]);
    }
  }
  return groups.find((group) => group.agents.includes(agent.toLowerCase()));
}

const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
for (const agent of ["OAI-SearchBot", "ChatGPT-User"]) {
  const group = robotsGroup(robots, agent);
  if (!group) errors.push(`robots.txt: missing explicit ${agent} group`);
  else if (!group.directives.some(([directive, value]) => directive === "allow" && value === "/")) errors.push(`robots.txt: ${agent} is not explicitly allowed at /`);
  if (group?.directives.some(([directive, value]) => directive === "disallow" && value === "/")) errors.push(`robots.txt: ${agent} is blocked at /`);
}
if (!robots.includes(`Sitemap: ${base}/sitemap.xml`)) errors.push("robots.txt: canonical sitemap is missing");

const factsPath = path.join(root, "thong-tin-tuyen-tho-mo", "index.html");
if (!fs.existsSync(factsPath)) errors.push("Missing canonical current-facts page");
else {
  const html = fs.readFileSync(factsPath, "utf8");
  const visible = visibleText(html);
  const requiredFacts = [
    "Nam 18–40 tuổi",
    "1m53",
    "47 kg",
    "2–3 tháng",
    "20–25 triệu đồng/tháng",
    "hoàn thành định mức lao động",
    master.contact.admission_address,
    master.contact.address,
    "096 304 8585",
  ];
  for (const phrase of requiredFacts) if (!visible.includes(phrase)) errors.push(`Current-facts page is missing: ${phrase}`);
  const nodes = graphNodes(parseJsonLd(html, "current-facts page"));
  const webpage = nodes.find((node) => node?.["@type"] === "WebPage" && node.url === `${base}/thong-tin-tuyen-tho-mo/`);
  const faq = nodes.find((node) => node?.["@type"] === "FAQPage");
  if (!webpage) errors.push("Current-facts page is missing canonical WebPage schema");
  if (webpage?.dateModified !== master.effective_from) errors.push("Current-facts WebPage dateModified does not match the master policy");
  if ((faq?.mainEntity || []).length !== 8) errors.push(`Current-facts FAQ schema must contain 8 direct answers, got ${(faq?.mainEntity || []).length}`);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes(`<loc>${base}/thong-tin-tuyen-tho-mo/</loc>`)) errors.push("Current-facts page is missing from sitemap.xml");
const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
if (!llms.includes(`[Thông tin tuyển đang áp dụng](${base}/thong-tin-tuyen-tho-mo/)`) && !llms.includes(`[Thông tin tuyển thợ mỏ tháng 8/2026](${base}/thong-tin-tuyen-tho-mo/)`)) {
  errors.push("llms.txt does not identify the canonical current-facts page");
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const homeSchema = JSON.stringify(parseJsonLd(home, "home page"));
for (const phrase of ["Hồ sơ dự tuyển gồm 2 bộ", "mỗi bộ có sơ yếu lý lịch", "18–35", "1m56", "48kg"]) {
  if (homeSchema.includes(phrase)) errors.push(`Home structured data contains superseded information: ${phrase}`);
}
for (const expected of [`${base}/#website`, `${base}/#organization`, `${base}/thong-tin-tuyen-tho-mo/#webpage`, "https://www.tiktok.com/@thaylinhtuyenthomo"]) {
  if (!homeSchema.includes(expected)) errors.push(`Home entity graph is missing: ${expected}`);
}
if (!home.includes('href="thong-tin-tuyen-tho-mo/"')) errors.push("Home page does not link to the canonical current-facts page");

const articleRegistry = new Map((editorial.articles || []).map((article) => [article.slug, article]));
const articleFiles = collectFiles(root, (file) => /\/(?:bai-viet\/[^/]+|tin-nganh-than\/\d{4}\/\d{2}\/\d{2}\/[^/]+)\/index\.html$/.test(file.replaceAll(path.sep, "/")));
let sourcedArticles = 0;
for (const file of articleFiles) {
  const slug = path.basename(path.dirname(file));
  const registry = articleRegistry.get(slug);
  const html = fs.readFileSync(file, "utf8");
  const nodes = graphNodes(parseJsonLd(html, slug));
  const article = nodes.find((node) => ["Article", "NewsArticle"].includes(node?.["@type"]));
  const webpage = nodes.find((node) => node?.["@type"] === "WebPage");
  if (!article) {
    errors.push(`${slug}: missing Article or NewsArticle schema`);
    continue;
  }
  if (article.author?.["@id"] !== `${base}/tac-gia/nguyen-tu-linh/#person`) errors.push(`${slug}: article author is not linked to the canonical Person entity`);
  if (article.publisher?.["@id"] !== `${base}/#organization`) errors.push(`${slug}: article publisher is not linked to the canonical Organization entity`);
  if (!article.datePublished || !article.dateModified || !article.mainEntityOfPage) errors.push(`${slug}: article dates or mainEntityOfPage are incomplete`);
  if (!webpage?.datePublished || !webpage?.dateModified || webpage?.isPartOf?.["@id"] !== `${base}/#website`) errors.push(`${slug}: WebPage provenance is incomplete`);
  const expectedUrls = (registry?.sources || []).map((source) => source.url).filter(Boolean);
  if (expectedUrls.length) {
    sourcedArticles += 1;
    const basedOn = Array.isArray(article.isBasedOn) ? article.isBasedOn : article.isBasedOn ? [article.isBasedOn] : [];
    const citationUrls = (Array.isArray(article.citation) ? article.citation : article.citation ? [article.citation] : []).map((citation) => citation?.url).filter(Boolean);
    for (const url of expectedUrls) {
      if (!basedOn.includes(url)) errors.push(`${slug}: isBasedOn is missing ${url}`);
      if (!citationUrls.includes(url)) errors.push(`${slug}: machine-readable citation is missing ${url}`);
    }
  }
}

const indexableFiles = collectFiles(root, (file) => file.endsWith(".html") && !/^google/i.test(path.basename(file)));
for (const file of indexableFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const robotsMeta = html.match(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
  if (!robotsMeta.includes("noindex") && !robotsMeta.includes("max-snippet:-1")) errors.push(`${relative}: indexable page does not allow full snippets`);
  if (/18(?:–|-|\s+đến\s+)35|1(?:m|,)56|48\s*kg/iu.test(visibleText(html))) errors.push(`${relative}: visible text contains superseded recruitment criteria`);
}

console.log(JSON.stringify({
  factsPage: fs.existsSync(factsPath),
  articlePages: articleFiles.length,
  sourcedArticles,
  indexableChecks: indexableFiles.length,
  oaiSearchBotAllowed: Boolean(robotsGroup(robots, "OAI-SearchBot")),
  errors: errors.length,
}, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
