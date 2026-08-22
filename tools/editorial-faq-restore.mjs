import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {existingNews} from "./curated-articles.mjs";
import {communityArticles} from "./community-articles.mjs";
import {pressStoryArticles} from "./press-story-articles.mjs";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const changed = [];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function clean(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function renderFaq(article) {
  const items = (article.faq || [])
    .filter((entry) => Array.isArray(entry) && clean(entry[0]) && clean(entry[1]))
    .slice(0, 4);
  if (!items.length) return "";
  const id = `faq-${article.slug}`;
  return `<!-- editorial-faq-v3:start -->
<section class="professional-news-faq" aria-labelledby="${id}">
  <h2 id="${id}">Câu hỏi thường gặp</h2>
  <div class="professional-news-faq__list">
    ${items.map(([question, answer]) => `<details><summary>${escapeHtml(clean(question))}</summary><p>${escapeHtml(clean(answer))}</p></details>`).join("\n    ")}
  </div>
</section>
<!-- editorial-faq-v3:end -->`;
}

const registry = new Map();
for (const article of [...existingNews, ...communityArticles, ...pressStoryArticles]) {
  if (!article?.urlPath || !article?.slug || !Array.isArray(article.faq) || !article.faq.length) continue;
  registry.set(article.urlPath, article);
}

for (const article of registry.values()) {
  const file = path.join(siteRoot, article.urlPath, "index.html");
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  if (!before.includes("article-body--journalistic-v3")) continue;
  const faq = renderFaq(article);
  if (!faq) continue;

  let after = before.replace(/<!-- editorial-faq-v3:start -->[\s\S]*?<!-- editorial-faq-v3:end -->/i, faq);
  if (after === before && !before.includes("<!-- editorial-faq-v3:start -->")) {
    if (/<nav\b[^>]*class=["'][^"']*\barticle-nav\b/i.test(after)) {
      after = after.replace(/(<nav\b[^>]*class=["'][^"']*\barticle-nav\b)/i, `${faq}\n$1`);
    } else if (/<section\b[^>]*class=["'][^"']*\barticle-apply\b/i.test(after)) {
      after = after.replace(/(<section\b[^>]*class=["'][^"']*\barticle-apply\b)/i, `${faq}\n$1`);
    } else {
      after = after.replace(/<\/article>/i, `${faq}\n</article>`);
    }
  }

  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 50) {
    const chunk = changed.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-faq-v3-restored",
  eligibleArticles: registry.size,
  changedFiles: changed.length,
}, null, 2));
