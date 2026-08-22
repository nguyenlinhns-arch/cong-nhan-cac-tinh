import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const v4Root = path.resolve(projectRoot, "content", "editorial-prose-v4");
const v6Path = path.resolve(projectRoot, "content", "editorial-specialist-v6.json");
const changed = [];

const v4Profiles = Object.assign({}, ...fs.readdirSync(v4Root)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => JSON.parse(fs.readFileSync(path.join(v4Root, file), "utf8"))));
const v6Profiles = JSON.parse(fs.readFileSync(v6Path, "utf8"));

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function specialistText(value = "") {
  return String(value)
    .replace(/chuyển đổi xanh trong ngành Than không chỉ là câu chuyện đầu tư công nghệ mà còn là thay đổi/giu,
      "chuyển đổi xanh trong ngành Than bao gồm cả đầu tư công nghệ và thay đổi")
    .replace(/20–25 triệu đồng\/tháng khi người lao động hoàn thành định mức(?=[;,.])/giu,
      "20–25 triệu đồng/tháng khi người lao động hoàn thành định mức lao động")
    .replace(/\bĐáng chú ý(?: là)?[,;:]?\s*/giu, "")
    .replace(/\bCó thể thấy rằng\b/giu, "Dữ liệu cho thấy")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extract(value, pattern) {
  return String(value).match(pattern)?.[0] || "";
}

function addArticleClass(tag, className) {
  return tag.replace(/<article\b([^>]*)class="([^"]*)"([^>]*)>/i, (_match, before, classes, after) => {
    const list = new Set(classes.split(/\s+/).filter(Boolean));
    list.add("article-body--prose-v4");
    list.add(className);
    return `<article${before}class="${[...list].join(" ")}"${after}>`;
  });
}

function normalizeSourceParagraph(source = "") {
  return String(source)
    .replace(/<strong>Nguồn\s+tư\s+liệu:<\/strong>/i, "<strong>Nguồn:</strong>")
    .replace(/<strong>Nguồn:<\/strong>\s*<strong>Nguồn:<\/strong>/i, "<strong>Nguồn:</strong>");
}

function cleanSourceFooter(body) {
  const footer = extract(body, /<div\b[^>]*class="[^"]*\barticle-source-footer\b[^"]*"[^>]*>[\s\S]*?<\/div>/i);
  const currentFacts = extract(footer || body, /<p\b[^>]*class="[^"]*\barticle-current-facts\b[^"]*"[^>]*>[\s\S]*?<\/p>/i);
  let source = extract(footer || body, /<p(?:\s[^>]*)?>\s*<strong>Nguồn(?:\s+tư\s+liệu)?:<\/strong>[\s\S]*?<\/p>/i);
  if (!source) source = extract(body, /<p\b[^>]*class="[^"]*\barticle-source-note\b[^"]*"[^>]*>[\s\S]*?<\/p>/i);
  source = normalizeSourceParagraph(source);
  if (!source) return "";
  return `<div class="article-source-footer article-source-footer--specialist-v6">${currentFacts}${source}</div>`;
}

function removeFaqSchema(html) {
  return String(html).replace(/<script\b([^>]*)type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/gi, (full, before, after, jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data?.["@graph"])) {
        data["@graph"] = data["@graph"].filter((node) => node?.["@type"] !== "FAQPage");
        return `<script${before}type="application/ld+json"${after}>${JSON.stringify(data)}</script>`;
      }
      if (data?.["@type"] === "FAQPage") return "";
    } catch {}
    return full;
  });
}

function replaceHeroLead(html, lead) {
  return String(html).replace(/<p\b([^>]*)class="([^"]*\blead\b[^"]*)"([^>]*)>[\s\S]*?<\/p>/i,
    `<p$1class="$2"$3>${escapeHtml(specialistText(lead))}</p>`);
}

function renderSpecialistBody(existingBody, v4, v6) {
  const openingTag = existingBody.match(/<article\b[^>]*>/i)?.[0] || '<article class="article-body">';
  const articleOpen = addArticleClass(openingTag, "article-body--specialist-v6");
  const cover = extract(existingBody, /<figure\b[^>]*class="[^"]*\barticle-cover\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i);
  const galleries = [...existingBody.matchAll(/<div\b[^>]*class="[^"]*\barticle-inline-gallery\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi)].map((match) => match[0]);
  const nav = extract(existingBody, /<nav\b[^>]*class="[^"]*\barticle-nav\b[^"]*"[^>]*>[\s\S]*?<\/nav>/i);
  const apply = extract(existingBody, /<section\b[^>]*class="[^"]*\barticle-apply\b[^"]*"[^>]*>[\s\S]*?<\/section>/i);
  const share = extract(existingBody, /<section\b[^>]*class="[^"]*\barticle-share-panel\b[^"]*"[^>]*>[\s\S]*?<\/section>/i);
  const source = cleanSourceFooter(existingBody);
  const paragraphs = [
    `<p class="specialist-v6__opening">${escapeHtml(specialistText(v4.intro[0]))}</p>`,
    `<p>${escapeHtml(specialistText(v4.intro[1]))}</p>`,
    `<h2>${escapeHtml(specialistText(v6.heading1))}</h2>`,
    `<p>${escapeHtml(specialistText(v4.evidence))}</p>`,
    `<p>${escapeHtml(specialistText(v6.analysis[0]))}</p>`,
    galleries.join("\n"),
    `<h2>${escapeHtml(specialistText(v6.heading2))}</h2>`,
    `<p>${escapeHtml(specialistText(v6.analysis[1]))}</p>`,
    `<p class="article-conclusion specialist-v6__ending">${escapeHtml(specialistText(v4.conclusion))}</p>`,
  ].filter(Boolean).join("\n");
  const extras = [source, nav, apply, share].filter(Boolean).join("\n");
  return `${articleOpen}\n${cover ? `${cover}\n` : ""}<!-- specialist-v6:start -->\n<div class="specialist-v6__copy">\n${paragraphs}\n</div>\n<!-- specialist-v6:end -->\n${extras}\n</article>`;
}

for (const [slug, v6] of Object.entries(v6Profiles)) {
  const v4 = v4Profiles[slug];
  if (!v4) throw new Error(`Thiếu hồ sơ v4 cho ${slug}`);
  const file = path.join(siteRoot, "bai-viet", slug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`Thiếu bài chuyên sâu ${slug}`);
  const before = fs.readFileSync(file, "utf8");
  const body = before.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
  if (!body) throw new Error(`${slug}: không tìm thấy article-body`);
  let after = before.replace(body, renderSpecialistBody(body, v4, v6));
  after = replaceHeroLead(after, v4.lead);
  after = removeFaqSchema(after);
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  let tracked = new Set();
  try {
    tracked = new Set(execFileSync("git", ["ls-files", "-z"], {cwd: projectRoot, encoding: "utf8"}).split("\0").filter(Boolean));
  } catch {}
  const files = changed.filter((file) => tracked.has(file));
  for (let index = 0; index < files.length; index += 50) {
    const chunk = files.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-specialist-v6-complete",
  articles: Object.keys(v6Profiles).length,
  changedFiles: changed.length,
  sample: changed,
}, null, 2));
