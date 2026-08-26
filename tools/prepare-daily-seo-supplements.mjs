import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(root, "content");
const siteRoot = path.join(root, "tuyen-tho-mo");
const basePath = path.join(contentRoot, "daily-seo-articles.json");
const facts = JSON.parse(fs.readFileSync(path.join(siteRoot, "data", "recruitment-facts-2026.json"), "utf8"));
const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
const supplementFiles = fs.readdirSync(contentRoot)
  .filter((name) => /^daily-seo-supplements-\d{8}\.json$/i.test(name))
  .sort();

const canonicalSupport = facts.study_benefits?.living_support || "";
const canonicalIncome = facts.after_training?.income_commitment
  || `${facts.after_training?.income || ""} ${facts.after_training?.income_condition || ""}`.trim();
const forbiddenLegacy = (facts.forbidden_legacy_phrases || []).map((value) => String(value).toLocaleLowerCase("vi"));
if (canonicalSupport !== "7,5 triệu đồng/tháng trong thời gian học") throw new Error(`Daily SEO: living_support canonical sai: ${canonicalSupport}`);
if (canonicalIncome !== "20–25 triệu đồng/tháng khi hoàn thành định mức lao động") throw new Error(`Daily SEO: income canonical sai: ${canonicalIncome}`);

const supportWithoutMonth = /7[,.]5 triệu(?!\s*(?:đồng\s*)?\/\s*tháng)(?:\s*đồng)?/giu;
const averageIncome = /(?:thu nhập\s+)?bình quân\s+20[–-]25 triệu(?: đồng)?\s*\/\s*tháng(?:\s*,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất)?/giu;
const variableIncome = /20[–-]25 triệu(?: đồng)?\s*\/\s*tháng\s*,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/giu;

function normalizeString(value) {
  return String(value)
    .replace(supportWithoutMonth, "7,5 triệu đồng/tháng")
    .replace(averageIncome, canonicalIncome)
    .replace(variableIncome, canonicalIncome);
}

function normalizeNode(value) {
  if (typeof value === "string") return normalizeString(value);
  if (Array.isArray(value)) return value.map(normalizeNode);
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) value[key] = normalizeNode(item);
  }
  return value;
}

function walkStrings(value, visitor, pointer = "$") {
  if (typeof value === "string") return visitor(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkStrings(item, visitor, `${pointer}[${index}]`));
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) walkStrings(item, visitor, `${pointer}.${key}`);
  }
}

function validatePolicy(article, sourceLabel) {
  walkStrings(article, (value, pointer) => {
    const text = String(value);
    const lowered = text.toLocaleLowerCase("vi");
    for (const phrase of forbiddenLegacy) {
      if (phrase && lowered.includes(phrase)) throw new Error(`${sourceLabel}: ${article.slug} ${pointer} còn legacy phrase "${phrase}"`);
    }
    if (/7[,.]5\s*triệu/iu.test(text) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(text)) {
      throw new Error(`${sourceLabel}: ${article.slug} ${pointer} nhắc 7,5 triệu nhưng thiếu /tháng`);
    }
    if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !/hoàn thành định mức lao động/iu.test(text)) {
      throw new Error(`${sourceLabel}: ${article.slug} ${pointer} nhắc 20–25 triệu nhưng thiếu điều kiện hoàn thành định mức lao động`);
    }
  });
}

// Normalize the current-answer registry itself before adding today's supplement.
// This fixes stale headings, FAQ questions and key-point labels—not only the
// direct answer—so every visible node and JSON-LD string follows the same facts.
let normalizedBaseArticles = 0;
for (const article of base.articles || []) {
  const before = JSON.stringify(article);
  normalizeNode(article);
  validatePolicy(article, "daily-seo-articles.json");
  if (JSON.stringify(article) !== before) normalizedBaseArticles += 1;
}

const bySlug = new Map((base.articles || []).map((article) => [article.slug, article]));
let added = 0;
let policyChecked = (base.articles || []).length;

for (const fileName of supplementFiles) {
  const supplement = JSON.parse(fs.readFileSync(path.join(contentRoot, fileName), "utf8"));
  if (!Array.isArray(supplement.articles)) throw new Error(`${fileName}: thiếu mảng articles`);
  for (const article of supplement.articles) {
    if (!article?.slug || !article?.publish_on || !article?.primary_query || !article?.image?.src) {
      throw new Error(`${fileName}: bài bổ sung thiếu slug, publish_on, primary_query hoặc image.src`);
    }
    normalizeNode(article);
    validatePolicy(article, fileName);
    policyChecked += 1;
    const existing = bySlug.get(article.slug);
    if (existing) {
      if (JSON.stringify(existing) !== JSON.stringify(article)) {
        throw new Error(`${fileName}: slug ${article.slug} xung đột với nguồn chính`);
      }
      continue;
    }
    base.articles.push(article);
    bySlug.set(article.slug, article);
    added += 1;
  }
}

base.articles.sort((a, b) => String(a.publish_on).localeCompare(String(b.publish_on)));

for (const [field, values] of [
  ["publish_on", base.articles.map((article) => article.publish_on)],
  ["primary_query", base.articles.map((article) => String(article.primary_query).toLocaleLowerCase("vi"))],
  ["image.src", base.articles.map((article) => article.image.src)],
]) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`daily SEO sau khi gộp bị trùng ${field}: ${value}`);
    seen.add(value);
  }
}

const latest = base.articles.map((article) => article.publish_on).filter(Boolean).sort().at(-1);
if (latest) base.updated_at = latest;
base.canonical_facts_version = facts.version;
base.canonical_facts_confirmed_at = facts.confirmed_at;
base.canonical_facts_url = "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json";
fs.writeFileSync(basePath, `${JSON.stringify(base, null, 2)}\n`);

if (process.env.GITHUB_ACTIONS === "true") {
  try {
    execFileSync("git", ["update-index", "--assume-unchanged", "--", "content/daily-seo-articles.json"], {
      cwd: root,
      stdio: "ignore",
    });
  } catch {}
}

console.log(JSON.stringify({
  status: "daily-seo-supplements-ready",
  canonicalFactsVersion: facts.version,
  supplementFiles,
  normalizedBaseArticles,
  policyChecked,
  added,
  total: base.articles.length,
  latest,
}, null, 2));
