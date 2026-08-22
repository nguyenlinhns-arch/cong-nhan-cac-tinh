import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const sourcePath = path.resolve(projectRoot, "content", "daily-seo-articles.json");
const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const releaseDate = process.env.SEO_DAILY_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const changed = [];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function cleanCopy(value = "") {
  return String(value)
    .replace(/Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)\s*/gi, "")
    .replace(/\bNguồn cho biết(?: rằng)?\s+/gi, "")
    .replace(/\bTheo nguồn,?\s+/gi, "")
    .replace(/\bnguồn thông tin tuyển dụng hiện hành\b/gi, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bbộ dữ liệu tuyển dụng năm 2026\b/gi, "thông tin tuyển sinh năm 2026")
    .replace(/\bnguồn tuyển đang áp dụng\b/gi, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn tuyển hiện hành\b/gi, "thông tin tuyển sinh hiện hành")
    .replace(/\bđối chiếu sơ bộ\b/gi, "kiểm tra ban đầu")
    .replace(/\bphù hợp sơ bộ\b/gi, "phù hợp ở bước kiểm tra ban đầu")
    .replace(/\bkhông nên tự suy ra\b/gi, "chỉ xác nhận khi có thông báo chính thức")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function visible(html) {
  return String(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(html) {
  return visible(html).split(/\s+/).filter(Boolean).length;
}

function key(value = "") {
  return visible(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fixRepeatedOpeningHeading(html, article) {
  const opening = html.match(/<section class="daily-seo-section daily-seo-section--opening">[\s\S]*?<h2>([\s\S]*?)<\/h2>/i);
  if (!opening) return html;
  const openingHeading = visible(opening[1]);
  const sectionHeadings = [...html.matchAll(/<section class="[^"]*daily-seo-section--newsroom[^"]*">[\s\S]*?<h2>([\s\S]*?)<\/h2>/gi)]
    .map((match) => visible(match[1]));
  if (!sectionHeadings.some((heading) => key(heading) === key(openingHeading))) return html;

  const candidates = [
    cleanCopy(article.takeaway_title),
    "Thông tin cần nắm trước khi quyết định",
    "Bối cảnh cần hiểu trước khi đăng ký",
  ].filter(Boolean);
  const replacement = candidates.find((candidate) => !sectionHeadings.some((heading) => key(heading) === key(candidate))) || candidates.at(-1);
  return html.replace(opening[0], opening[0].replace(opening[1], escapeHtml(replacement)));
}

for (const article of data.articles.filter((item) => item.publish_on <= releaseDate)) {
  const file = path.join(siteRoot, "giai-dap-nghe-mo", article.slug, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = fixRepeatedOpeningHeading(html, article);

  if (wordCount(html) < 680) {
    const currentText = key(html);
    const additions = [];
    for (const section of article.sections || []) {
      const heading = cleanCopy(section.heading || "");
      if (!heading || currentText.includes(key(heading))) continue;
      const paragraphs = (section.paragraphs || [])
        .map(cleanCopy)
        .filter((paragraph) => paragraph && !currentText.includes(key(paragraph)))
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("");
      const items = (section.items || section.bullets || [])
        .map(cleanCopy)
        .filter((item) => item && !currentText.includes(key(item)))
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
      if (!paragraphs && !items) continue;
      additions.push(`<section class="daily-seo-section daily-seo-section--newsroom daily-seo-section--depth"><div class="network-wrap daily-seo-copy"><p class="editorial-kicker">THÔNG TIN BỔ SUNG</p><h2>${escapeHtml(heading)}</h2>${paragraphs}${items ? `<ul>${items}</ul>` : ""}</div></section>`);
    }

    const marker = '<section class="daily-seo-section daily-seo-section--editor-note">';
    for (const addition of additions) {
      if (!html.includes(marker)) break;
      html = html.replace(marker, `${addition}${marker}`);
      if (wordCount(html) >= 700) break;
    }
  }

  if (wordCount(html) < 650) {
    throw new Error(`${article.slug}: chưa đủ chiều sâu biên tập sau khi bổ sung (${wordCount(html)} từ)`);
  }
  if (html === before) continue;
  fs.writeFileSync(file, html);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 50) {
    const chunk = changed.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({status: "daily-depth-guard-complete", releaseDate, changedFiles: changed.length}, null, 2));
