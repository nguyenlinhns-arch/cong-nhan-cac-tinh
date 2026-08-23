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

function validatePolicy(article, sourceLabel) {
  const text = JSON.stringify(article).toLocaleLowerCase("vi");
  for (const phrase of forbiddenLegacy) {
    if (phrase && text.includes(phrase)) throw new Error(`${sourceLabel}: ${article.slug} còn legacy phrase "${phrase}"`);
  }
  if (/7[,.]5\s*triệu/iu.test(text) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(text)) {
    throw new Error(`${sourceLabel}: ${article.slug} nhắc 7,5 triệu nhưng thiếu /tháng`);
  }
  if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !/hoàn thành định mức lao động/iu.test(text)) {
    throw new Error(`${sourceLabel}: ${article.slug} nhắc 20–25 triệu nhưng thiếu điều kiện hoàn thành định mức lao động`);
  }
}

const bySlug = new Map((base.articles || []).map((article) => [article.slug, article]));
let added = 0;
let policyChecked = 0;

for (const fileName of supplementFiles) {
  const supplement = JSON.parse(fs.readFileSync(path.join(contentRoot, fileName), "utf8"));
  if (!Array.isArray(supplement.articles)) throw new Error(`${fileName}: thiếu mảng articles`);
  for (const article of supplement.articles) {
    if (!article?.slug || !article?.publish_on || !article?.primary_query || !article?.image?.src) {
      throw new Error(`${fileName}: bài bổ sung thiếu slug, publish_on, primary_query hoặc image.src`);
    }
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
  policyChecked,
  added,
  total: base.articles.length,
  latest,
}, null, 2));
