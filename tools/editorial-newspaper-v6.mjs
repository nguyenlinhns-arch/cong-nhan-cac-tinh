import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const stylesheet = "/editorial-newspaper-v6.css?v=1";
const changed = [];
const stats = {
  checked: 0,
  changed: 0,
  newsArticles: 0,
  removedFaqBlocks: 0,
  duplicateSentencesRemoved: 0,
  excessHeadingsRemoved: 0,
};

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function visible(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizedWords(value = "") {
  return visible(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function similarity(left, right) {
  const a = new Set(normalizedWords(left));
  const b = new Set(normalizedWords(right));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const word of a) if (b.has(word)) common += 1;
  return common / Math.min(a.size, b.size);
}

function dateTokens(value = "") {
  return new Set(visible(value).match(/\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{4})\b/g) || []);
}

function sharesDate(left, right) {
  const a = dateTokens(left);
  const b = dateTokens(right);
  for (const item of a) if (b.has(item)) return true;
  return false;
}

function wordCount(value = "") {
  return visible(value).split(/\s+/u).filter(Boolean).length;
}

function addStylesheet(html) {
  if (html.includes(stylesheet)) return html;
  return html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${stylesheet}">\n</head>`);
}

function addClassToTag(html, tag, className, requiredClass = "") {
  const pattern = requiredClass
    ? new RegExp(`<${tag}\\b([^>]*)class="([^"]*\\b${requiredClass}\\b[^"]*)"([^>]*)>`, "i")
    : new RegExp(`<${tag}\\b([^>]*)>`, "i");
  if (requiredClass) {
    return html.replace(pattern, (_match, before, classes, after) => {
      const list = new Set(classes.split(/\s+/).filter(Boolean));
      list.add(className);
      return `<${tag}${before}class="${[...list].join(" ")}"${after}>`;
    });
  }
  if (new RegExp(`<${tag}\\b[^>]*class="[^"]*\\b${className}\\b`, "i").test(html)) return html;
  if (new RegExp(`<${tag}\\b[^>]*class=`, "i").test(html)) {
    return html.replace(new RegExp(`<${tag}\\b([^>]*)class="([^"]*)"([^>]*)>`, "i"), (_match, before, classes, after) => {
      const list = new Set(classes.split(/\s+/).filter(Boolean));
      list.add(className);
      return `<${tag}${before}class="${[...list].join(" ")}"${after}>`;
    });
  }
  return html.replace(pattern, `<${tag} class="${className}"$1>`);
}

function cleanProfessionalCopy(copy) {
  let output = String(copy);
  output = output.replace(/<section\b[^>]*class="[^"]*\bprofessional-news-faq\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi, () => {
    stats.removedFaqBlocks += 1;
    return "";
  });

  const seenSentences = [];
  output = output.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, body) => {
    if (/professional-ending|article-source-note/i.test(attrs)) return full;
    const text = visible(body);
    if (!text) return "";
    const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean);
    const kept = [];
    for (const sentence of sentences) {
      const duplicate = seenSentences.some((previous) => {
        const score = similarity(previous, sentence);
        return score >= 0.82 || (sharesDate(previous, sentence) && score >= 0.48);
      });
      if (duplicate && wordCount(sentence) >= 8) {
        stats.duplicateSentencesRemoved += 1;
        continue;
      }
      kept.push(sentence);
      if (wordCount(sentence) >= 8) seenSentences.push(sentence);
    }
    if (!kept.length) return "";
    return `<p${attrs}>${escapeHtml(kept.join(" "))}</p>`;
  });

  let headingCount = 0;
  output = output.replace(/<h2>([\s\S]*?)<\/h2>/gi, (full) => {
    headingCount += 1;
    if (headingCount <= 3) return full;
    stats.excessHeadingsRemoved += 1;
    return "";
  });

  output = output
    .replace(/<section\b([^>]*)>\s*<\/section>/gi, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n");
  return output;
}

function rewriteProfessionalCopy(html) {
  const pattern = /(<!-- newsroom-copy-v3:start -->\s*<div class="professional-news-copy[^"]*">)([\s\S]*?)(<\/div>\s*<!-- newsroom-copy-v3:end -->)/i;
  if (!pattern.test(html)) return html;
  stats.newsArticles += 1;
  return html.replace(pattern, (_match, start, copy, end) => `${start}${cleanProfessionalCopy(copy)}${end}`);
}

function normalizeSourceNote(html) {
  let output = html
    .replace(/<strong>Nguồn tư liệu:<\/strong>/gi, "<strong>Nguồn:</strong>")
    .replace(/<p class="article-source-note">\s*Bài được Nguyễn Tử Linh biên soạn từ\s+([\s\S]*?),\s*đăng trên\s+([\s\S]*?)\.\s*<\/p>/gi,
      '<p class="article-source-note"><strong>Nguồn:</strong> $1, $2. <span class="article-source-responsibility">Biên tập và đối chiếu: Nguyễn Tử Linh.</span></p>')
    .replace(/<p class="article-source-note">\s*Bài do Nguyễn Tử Linh biên tập từ\s+([\s\S]*?)\.\s*<\/p>/gi,
      '<p class="article-source-note"><strong>Nguồn:</strong> $1. <span class="article-source-responsibility">Biên tập và đối chiếu: Nguyễn Tử Linh.</span></p>');

  output = output.replace(/<p class="article-source-note">([\s\S]*?)<\/p>/gi, (full, body) => {
    let next = body;
    if (!/<strong>Nguồn:<\/strong>/i.test(next)) next = `<strong>Nguồn:</strong> ${next}`;
    if (!/Nguyễn Tử Linh/i.test(visible(next))) {
      next += ' <span class="article-source-responsibility">Biên tập và đối chiếu: Nguyễn Tử Linh.</span>';
    }
    return `<p class="article-source-note">${next}</p>`;
  });
  return output;
}

function normalizeByline(html) {
  return html
    .replace(/(<p\b[^>]*class="[^"]*\barticle-byline\b[^"]*"[^>]*>[\s\S]*?<span>)(?:Biên tập viên|Biên tập và chịu trách nhiệm nội dung|Biên tập, đối chiếu nguồn)(<\/span>)/i,
      "$1Biên tập, đối chiếu nguồn$2");
}

function markArticle(html) {
  let output = addStylesheet(html);
  output = addClassToTag(output, "body", "editorial-newspaper-v6-page");
  output = addClassToTag(output, "section", "article-hero--newspaper-v6", "article-hero");
  output = addClassToTag(output, "div", "article-layout--newspaper-v6", "article-layout");
  output = addClassToTag(output, "article", "article-body--newspaper-v6", "article-body");
  output = normalizeByline(output);
  output = rewriteProfessionalCopy(output);
  output = normalizeSourceNote(output);
  return output;
}

for (const directory of ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"]) {
  for (const file of walk(path.join(siteRoot, directory))) {
    const before = fs.readFileSync(file, "utf8");
    if (!/"@type"\s*:\s*"(?:NewsArticle|Article|BlogPosting)"/.test(before)) continue;
    if (!/<article\b[^>]*class="[^"]*\barticle-body\b/i.test(before)) continue;
    stats.checked += 1;
    const after = markArticle(before);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
  }
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

stats.changed = changed.length;
console.log(JSON.stringify({
  status: "editorial-newspaper-v6-complete",
  ...stats,
  sample: changed.slice(0, 20),
}, null, 2));
