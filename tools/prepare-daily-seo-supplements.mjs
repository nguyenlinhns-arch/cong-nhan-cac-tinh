import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(root, "content");
const basePath = path.join(contentRoot, "daily-seo-articles.json");
const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
const supplementFiles = fs.readdirSync(contentRoot)
  .filter((name) => /^daily-seo-supplements-\d{8}\.json$/i.test(name))
  .sort();

const bySlug = new Map((base.articles || []).map((article) => [article.slug, article]));
let added = 0;

for (const fileName of supplementFiles) {
  const supplement = JSON.parse(fs.readFileSync(path.join(contentRoot, fileName), "utf8"));
  if (!Array.isArray(supplement.articles)) throw new Error(`${fileName}: thiếu mảng articles`);
  for (const article of supplement.articles) {
    if (!article?.slug || !article?.publish_on || !article?.primary_query || !article?.image?.src) {
      throw new Error(`${fileName}: bài bổ sung thiếu slug, publish_on, primary_query hoặc image.src`);
    }
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
  supplementFiles,
  added,
  total: base.articles.length,
  latest,
}, null, 2));
