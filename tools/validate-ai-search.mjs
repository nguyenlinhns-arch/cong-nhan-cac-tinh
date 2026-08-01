import fs from "node:fs";
import path from "node:path";
import {buildRecruitmentAnswers} from "./recruitment-answers.mjs";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const factsUrl = `${base}/thong-tin-tuyen-tho-mo/`;
const authorId = `${base}/tac-gia/nguyen-tu-linh/#person`;
const organizationId = `${base}/#organization`;
const policyUrl = `${base}/nguyen-tac-bien-tap/`;
const master = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const recruitmentAnswers = buildRecruitmentAnswers(master);
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

function assertQualifiedIncome(text, label) {
  const normalized = text.replace(/\s+/g, " ");
  for (const match of normalized.matchAll(/20\s*[–-]\s*25\s*triệu/giu)) {
    const start = Math.max(0, (match.index || 0) - 160);
    const end = Math.min(normalized.length, (match.index || 0) + match[0].length + 280);
    const context = normalized.slice(start, end);
    if (!/(?:hoàn thành|đủ)\s+định mức(?:\s+lao động)?/iu.test(context)) {
      errors.push(`${label}: mức 20–25 triệu thiếu điều kiện hoàn thành định mức`);
    }
  }
}

function validateIncomeContexts(html, label) {
  assertQualifiedIncome(visibleText(html), `${label} (nội dung)`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "";
  assertQualifiedIncome(title, `${label} (title)`);
  for (const [index, match] of [...html.matchAll(/<meta\b[^>]*(?:name|property)=["'][^"']+["'][^>]*content=["']([^"']*)["'][^>]*>/gi)].entries()) {
    assertQualifiedIncome(match[1], `${label} (meta ${index + 1})`);
  }
  for (const [index, match] of [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
    assertQualifiedIncome(match[1], `${label} (JSON-LD ${index + 1})`);
  }
}

function publicUrlForFile(file) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  return `/${relative.replace(/index\.html$/, "")}`;
}

function localTargetForPathname(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\/+/, "");
  if (!relative || decoded.endsWith("/")) return path.join(root, relative, "index.html");
  const exact = path.join(root, relative);
  if (fs.existsSync(exact)) return exact;
  return path.join(root, relative, "index.html");
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
    ...master.dossier.admission_documents,
    master.dossier.missing_diploma,
    master.dossier.safety,
    master.contact.admission_address,
    master.contact.address,
    "096 304 8585",
  ];
  for (const phrase of requiredFacts) if (!visible.includes(phrase)) errors.push(`Current-facts page is missing: ${phrase}`);
  const nodes = graphNodes(parseJsonLd(html, "current-facts page"));
  const webpage = nodes.find((node) => node?.["@type"] === "WebPage" && node.url === factsUrl);
  const faq = nodes.find((node) => node?.["@type"] === "FAQPage");
  if (!webpage) errors.push("Current-facts page is missing canonical WebPage schema");
  if (webpage?.dateModified !== master.effective_from) errors.push("Current-facts WebPage dateModified does not match the master policy");
  if (webpage?.publishingPrinciples !== policyUrl) errors.push("Current-facts page is not linked to the editorial policy");
  if (webpage?.author?.["@id"] !== authorId || webpage?.publisher?.["@id"] !== organizationId) errors.push("Current-facts page has incomplete author or publisher provenance");
  if ((faq?.mainEntity || []).length !== recruitmentAnswers.length) errors.push(`Current-facts FAQ schema must contain ${recruitmentAnswers.length} direct answers, got ${(faq?.mainEntity || []).length}`);
  for (const answer of recruitmentAnswers) {
    if (!html.includes(`id="${answer.id}"`)) errors.push(`Current-facts page is missing answer anchor: ${answer.id}`);
    if (!visible.includes(answer.question) || !visible.includes(answer.answer)) errors.push(`Current-facts page is missing visible answer: ${answer.question}`);
    if (!html.includes(`href="${answer.href}"`)) errors.push(`Current-facts page is missing supporting link for: ${answer.id}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes(`<loc>${base}/thong-tin-tuyen-tho-mo/</loc>`)) errors.push("Current-facts page is missing from sitemap.xml");
if (!sitemap.includes(`<loc>${policyUrl}</loc>`)) errors.push("Editorial policy is missing from sitemap.xml");
const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
if (!llms.includes(`[Thông tin tuyển đang áp dụng](${base}/thong-tin-tuyen-tho-mo/)`) && !llms.includes(`[Thông tin tuyển thợ mỏ tháng 8/2026](${base}/thong-tin-tuyen-tho-mo/)`)) {
  errors.push("llms.txt does not identify the canonical current-facts page");
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const homeDocuments = parseJsonLd(home, "home page");
const homeNodes = graphNodes(homeDocuments);
const homeSchema = JSON.stringify(homeDocuments);
for (const phrase of ["Hồ sơ dự tuyển gồm 2 bộ", "mỗi bộ có sơ yếu lý lịch", "18–35", "1m56", "48kg"]) {
  if (homeSchema.includes(phrase)) errors.push(`Home structured data contains superseded information: ${phrase}`);
}
for (const phrase of [master.income_commitment, ...master.dossier.admission_documents, master.dossier.missing_diploma, master.contact.address, master.contact.admission_address]) {
  if (!homeSchema.toLocaleLowerCase("vi").includes(phrase.toLocaleLowerCase("vi"))) errors.push(`Home structured data is missing synchronized recruitment information: ${phrase}`);
}
for (const expected of [`${base}/#website`, `${base}/#organization`, `${base}/thong-tin-tuyen-tho-mo/#webpage`, "https://www.tiktok.com/@thaylinhtuyenthomo"]) {
  if (!homeSchema.includes(expected)) errors.push(`Home entity graph is missing: ${expected}`);
}
if (!home.includes('href="thong-tin-tuyen-tho-mo/"')) errors.push("Home page does not link to the canonical current-facts page");
const homeOrganization = homeNodes.find((node) => node?.["@id"] === `${base}/#organization`);
const homeWebPage = homeNodes.find((node) => node?.["@id"] === `${base}/#webpage`);
if (homeOrganization?.publishingPrinciples !== policyUrl) errors.push("Home Organization is not linked to the editorial policy");
if (homeOrganization?.founder?.["@id"] !== authorId) errors.push("Home Organization is not linked to the accountable Person");
if (!homeOrganization?.address?.streetAddress || homeOrganization?.address?.addressRegion !== "Quảng Ninh") errors.push("Home Organization has incomplete contact-address provenance");
if (homeWebPage?.author?.["@id"] !== authorId || homeWebPage?.publisher?.["@id"] !== organizationId || homeWebPage?.publishingPrinciples !== policyUrl) errors.push("Home WebPage has incomplete author, publisher, or editorial-policy provenance");
if (!home.includes('href="nguyen-tac-bien-tap/"')) errors.push("Home page does not visibly link to the editorial policy");

const policyPath = path.join(root, "nguyen-tac-bien-tap", "index.html");
if (!fs.existsSync(policyPath)) errors.push("Missing editorial policy page");
else {
  const html = fs.readFileSync(policyPath, "utf8");
  const visible = visibleText(html);
  const normalizedVisible = visible.toLocaleLowerCase("vi");
  const nodes = graphNodes(parseJsonLd(html, "editorial policy"));
  const webpage = nodes.find((node) => node?.["@type"] === "WebPage" && node.url === policyUrl);
  if (!webpage || webpage.author?.["@id"] !== authorId || webpage.publisher?.["@id"] !== `${base}/#organization`) errors.push("Editorial policy has incomplete authorship schema");
  for (const phrase of ["nguyễn tử linh", "thông tin tuyển sinh hiện hành", "tin ngành than và địa phương", "cập nhật và đính chính", "không tạo bài chỉ để lặp từ khóa tìm kiếm"]) {
    if (!normalizedVisible.includes(phrase)) errors.push(`Editorial policy is missing: ${phrase}`);
  }
}

const authorPath = path.join(root, "tac-gia", "nguyen-tu-linh", "index.html");
if (!fs.existsSync(authorPath)) errors.push("Missing canonical author profile");
else {
  const html = fs.readFileSync(authorPath, "utf8");
  const nodes = graphNodes(parseJsonLd(html, "author profile"));
  const profile = nodes.find((node) => node?.["@type"] === "ProfilePage");
  const person = nodes.find((node) => node?.["@id"] === authorId);
  if (profile?.dateCreated !== "2026-07-25" || profile?.publishingPrinciples !== policyUrl) errors.push("Author ProfilePage dates or publishing principles are incomplete");
  if ((profile?.hasPart || []).length < 6) errors.push("Author ProfilePage must link to recent authored work");
  if (person?.jobTitle !== "Trưởng phòng Tuyển sinh Miền Trung" || !person?.worksFor?.name?.includes("Than - Khoáng sản Việt Nam")) errors.push("Author Person identity is incomplete");
}

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
  if (article.author?.["@id"] !== authorId) errors.push(`${slug}: article author is not linked to the canonical Person entity`);
  if (article.publisher?.["@id"] !== `${base}/#organization`) errors.push(`${slug}: article publisher is not linked to the canonical Organization entity`);
  if (!article.datePublished || !article.dateModified || !article.mainEntityOfPage) errors.push(`${slug}: article dates or mainEntityOfPage are incomplete`);
  if (article.publishingPrinciples !== policyUrl || article.publisher?.publishingPrinciples !== policyUrl) errors.push(`${slug}: article is not linked to publishing principles`);
  if (!webpage?.datePublished || !webpage?.dateModified || webpage?.isPartOf?.["@id"] !== `${base}/#website`) errors.push(`${slug}: WebPage provenance is incomplete`);
  if (webpage?.publisher?.["@id"] !== organizationId || webpage?.mainEntity?.["@id"] !== article?.["@id"]) errors.push(`${slug}: WebPage is not linked to its publisher and Article entity`);
  if (!html.includes('href="/thong-tin-tuyen-tho-mo/"')) errors.push(`${slug}: article does not link to the canonical current-facts page`);
  const expectedUrls = (registry?.sources || []).map((source) => source.url || (["Phòng Tuyển sinh Miền Trung", "Trường Cao đẳng Than - Khoáng sản Việt Nam"].includes(source.publisher) ? factsUrl : "")).filter(Boolean);
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

const provinceFiles = collectFiles(path.join(root, "viec-lam-nganh-than"), (file) => /\/viec-lam-nganh-than\/[^/]+\/index\.html$/.test(file.replaceAll(path.sep, "/")));
let noindexProvinces = 0;
for (const file of provinceFiles) {
  const slug = path.basename(path.dirname(file));
  const html = fs.readFileSync(file, "utf8");
  const nodes = graphNodes(parseJsonLd(html, `province ${slug}`));
  const webpage = nodes.find((node) => node?.["@type"] === "WebPage");
  const noindex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const hasLocalEvidence = html.includes('id="local-story-title"');
  if (noindex) noindexProvinces += 1;
  if (hasLocalEvidence === noindex) errors.push(`${slug}: province indexability does not match unique local evidence`);
  if (webpage?.author?.["@id"] !== authorId || webpage?.publisher?.["@id"] !== `${base}/#organization` || webpage?.publishingPrinciples !== policyUrl) errors.push(`${slug}: province entity provenance is incomplete`);
  if (!html.includes('rel="author" href="/tac-gia/nguyen-tu-linh/"')) errors.push(`${slug}: province page is missing author discovery`);
  if (!/href=["'](?:\.\.\/\.\.\/|\/)thong-tin-tuyen-tho-mo\//i.test(html)) errors.push(`${slug}: province page does not link to the canonical current-facts page`);
  if (html.includes("Sao chép mẫu tin nhắn") || html.includes("data-copy-template")) errors.push(`${slug}: removed copy-message control returned`);
}
if (provinceFiles.length !== 26 || noindexProvinces !== 9) errors.push(`Province quality gate expected 26 pages with 9 noindex templates, got ${provinceFiles.length}/${noindexProvinces}`);

for (const slug of ["ky-thuat-khai-thac-mo-ham-lo-quang-ninh", "ky-thuat-xay-dung-mo-ham-lo-quang-ninh"]) {
  const html = fs.readFileSync(path.join(root, "viec-lam", slug, "index.html"), "utf8");
  const nodes = graphNodes(parseJsonLd(html, `job ${slug}`));
  const job = nodes.find((node) => node?.["@type"] === "JobPosting");
  const webpage = nodes.find((node) => node?.["@type"] === "WebPage");
  if (!job?.["@id"] || job?.mainEntityOfPage?.["@id"] !== webpage?.["@id"] || webpage?.mainEntity?.["@id"] !== job?.["@id"]) errors.push(`${slug}: JobPosting and WebPage are not linked`);
  if (webpage?.author?.["@id"] !== authorId || webpage?.publisher?.["@id"] !== `${base}/#organization` || webpage?.publishingPrinciples !== policyUrl) errors.push(`${slug}: job-page entity provenance is incomplete`);
  if (!/href=["'](?:\.\.\/\.\.\/|\/)thong-tin-tuyen-tho-mo\//i.test(html)) errors.push(`${slug}: job page does not link to the canonical current-facts page`);
}

const campaignJob = fs.readFileSync(path.join(root, "viec-lam", "cong-nhan-mo-ham-lo-quang-ninh", "index.html"), "utf8");
if (!/href=["'](?:\.\.\/\.\.\/|\/)thong-tin-tuyen-tho-mo\//i.test(campaignJob)) errors.push("Campaign job page does not link to the canonical current-facts page");

const analytics = fs.readFileSync(path.join(root, "analytics.js"), "utf8");
for (const marker of ["ai_referral_visit", "chatgpt", "copilot", "perplexity", "gemini", "claude"]) {
  if (!analytics.includes(marker)) errors.push(`AI referral measurement is missing: ${marker}`);
}
const indexNow = fs.readFileSync(path.resolve("tools/submit-indexnow.mjs"), "utf8");
if (indexNow.includes("provinceData.provinces")) errors.push("IndexNow must not repeatedly submit noindex province templates outside the sitemap");

const indexableFiles = collectFiles(root, (file) => file.endsWith(".html") && !/^google/i.test(path.basename(file)));
let internalLinksChecked = 0;
for (const file of indexableFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const robotsMeta = html.match(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)?.[1] || "";
  if (!robotsMeta.includes("noindex") && !robotsMeta.includes("max-snippet:-1")) errors.push(`${relative}: indexable page does not allow full snippets`);
  if (/18(?:–|-|\s+đến\s+)35|1(?:m|,)56|48\s*kg/iu.test(visibleText(html))) errors.push(`${relative}: visible text contains superseded recruitment criteria`);
  validateIncomeContexts(html, relative);
  for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const href = match[1].replaceAll("&amp;", "&");
    let targetUrl;
    try { targetUrl = new URL(href, `${base}${publicUrlForFile(file)}`); }
    catch { continue; }
    if (!['http:', 'https:'].includes(targetUrl.protocol) || targetUrl.origin !== base) continue;
    internalLinksChecked += 1;
    const targetFile = localTargetForPathname(targetUrl.pathname);
    if (!fs.existsSync(targetFile)) {
      errors.push(`${relative}: internal link target is missing: ${targetUrl.pathname}`);
      continue;
    }
    if (targetUrl.hash && targetFile.endsWith(".html")) {
      const fragment = decodeURIComponent(targetUrl.hash.slice(1));
      const targetHtml = fs.readFileSync(targetFile, "utf8");
      if (!targetHtml.includes(`id="${fragment}"`) && !targetHtml.includes(`id='${fragment}'`) && !targetHtml.includes(`name="${fragment}"`) && !targetHtml.includes(`name='${fragment}'`)) {
        errors.push(`${relative}: internal fragment is missing: ${targetUrl.pathname}${targetUrl.hash}`);
      }
    }
  }
}

console.log(JSON.stringify({
  factsPage: fs.existsSync(factsPath),
  articlePages: articleFiles.length,
  sourcedArticles,
  indexableChecks: indexableFiles.length,
  internalLinksChecked,
  oaiSearchBotAllowed: Boolean(robotsGroup(robots, "OAI-SearchBot")),
  errors: errors.length,
}, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
