import fs from "node:fs";
import path from "node:path";
import {existingNews} from "./curated-articles.mjs";
import {communityArticles} from "./community-articles.mjs";
import {pressStoryArticles} from "./press-story-articles.mjs";

const siteRoot = path.resolve(process.cwd(), "tuyen-tho-mo");
const errors = [];
const stats = {
  registered: 0,
  checked: 0,
  newsroomV3: 0,
  plainTextSources: 0,
  linkedSources: 0,
};

function stripTags(value = "") {
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

function normalize(value = "") {
  return stripTags(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value = "") {
  return stripTags(value).split(/\s+/u).filter(Boolean).length;
}

function similarity(left, right) {
  const a = new Set(normalize(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalize(right).split(" ").filter((token) => token.length > 2));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) if (b.has(token)) common += 1;
  return common / Math.max(a.size, b.size);
}

const registry = new Map();
for (const article of [...existingNews, ...communityArticles, ...pressStoryArticles]) {
  if (!article?.urlPath || !article?.slug || !Array.isArray(article.sources) || !article.sources.length) continue;
  registry.set(article.urlPath, article);
}
stats.registered = registry.size;

const bannedPatterns = [
  /Bài\s+nguồn\s+ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)/iu,
  /Nguồn\s+cho\s+biết/iu,
  /Theo\s+nguồn/iu,
  /Điều\s+cần\s+hiểu\s+trước\s+tiên/iu,
  /Giải\s+thích\s+rõ\s+từng\s+ý/iu,
  /Kết\s+luận\s+ngắn/iu,
  /Tìm\s+hiểu\s+thêm\s+về[^.]+trên\s+Thầy\s+Linh/iu,
  /LAN\s+TỎA\s+THÔNG\s+TIN\s+ĐÚNG\s+NGUỒN/iu,
];

for (const [urlPath, article] of registry) {
  const file = path.join(siteRoot, urlPath, "index.html");
  if (!fs.existsSync(file)) {
    errors.push(`${article.slug}: thiếu tệp HTML`);
    continue;
  }
  stats.checked += 1;
  const html = fs.readFileSync(file, "utf8");
  const body = html.match(/<article\b[^>]*class=["'][^"']*\barticle-body\b[^"']*["'][^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
  const markedCopy = body.match(/<!-- newsroom-copy-v3:start -->([\s\S]*?)<!-- newsroom-copy-v3:end -->/i)?.[1] || "";
  const copy = markedCopy.match(/<div class="professional-news-copy newsroom-copy-v3">([\s\S]*)<\/div>\s*$/i)?.[1] || markedCopy;
  if (!body) {
    errors.push(`${article.slug}: không tìm thấy article-body`);
    continue;
  }
  if (!body.includes("article-body--journalistic-v3")) errors.push(`${article.slug}: chưa dùng cấu trúc newsroom v3`);
  else stats.newsroomV3 += 1;
  if (!html.includes('/editorial-newsroom.css?v=1')) errors.push(`${article.slug}: thiếu CSS newsroom`);
  if (!markedCopy || !body.includes('professional-news-copy newsroom-copy-v3')) errors.push(`${article.slug}: thiếu vùng professional-news-copy newsroom-copy-v3`);

  const lede = copy.match(/<p class="professional-lede">([\s\S]*?)<\/p>/i)?.[1] || "";
  const nutgraph = copy.match(/<p class="professional-nutgraph">([\s\S]*?)<\/p>/i)?.[1] || "";
  const ledeWords = wordCount(lede);
  const nutWords = wordCount(nutgraph);
  if (ledeWords < 18 || ledeWords > 72) errors.push(`${article.slug}: lede dài ${ledeWords} từ, cần 18–72`);
  if (nutWords < 18 || nutWords > 90) errors.push(`${article.slug}: nut graph dài ${nutWords} từ, cần 18–90`);
  if (lede && nutgraph && similarity(lede, nutgraph) >= 0.78) errors.push(`${article.slug}: lede và nut graph lặp ý`);

  const paragraphs = [...copy.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((match) => stripTags(match[1])).filter(Boolean);
  if (paragraphs.length < 6 || paragraphs.length > 22) errors.push(`${article.slug}: có ${paragraphs.length} đoạn, cần 6–22`);
  const copyWords = wordCount(copy);
  if (copyWords < 300 || copyWords > 1900) errors.push(`${article.slug}: thân bài ${copyWords} từ, cần 300–1.900`);
  const longParagraph = paragraphs.find((paragraph) => wordCount(paragraph) > 125);
  if (longParagraph) errors.push(`${article.slug}: còn đoạn dài ${wordCount(longParagraph)} từ`);
  const fragment = paragraphs.find((paragraph) => wordCount(paragraph) < 18 && !/^Nguồn:/u.test(paragraph));
  if (fragment) errors.push(`${article.slug}: còn đoạn cụt ${wordCount(fragment)} từ: ${fragment.slice(0, 90)}`);

  const headings = [...copy.matchAll(/<h2>([\s\S]*?)<\/h2>/gi)].map((match) => stripTags(match[1]));
  if (headings.length < 1 || headings.length > 2) errors.push(`${article.slug}: có ${headings.length} tiêu đề phụ, cần 1–2`);
  if (new Set(headings.map(normalize)).size !== headings.length) errors.push(`${article.slug}: tiêu đề phụ bị lặp`);
  if (/<(?:ul|ol)\b/i.test(copy)) errors.push(`${article.slug}: thân bài newsroom còn danh sách thay cho mạch văn`);
  if (copy.includes("—")) errors.push(`${article.slug}: thân bài còn gạch ngang dài`);

  const visible = stripTags(copy);
  for (const pattern of bannedPatterns) if (pattern.test(visible)) errors.push(`${article.slug}: còn cụm máy móc ${pattern}`);
  let duplicateFound = false;
  for (let left = 0; left < paragraphs.length && !duplicateFound; left += 1) {
    for (let right = left + 1; right < paragraphs.length; right += 1) {
      if (wordCount(paragraphs[left]) >= 25 && wordCount(paragraphs[right]) >= 25 && similarity(paragraphs[left], paragraphs[right]) >= 0.9) {
        errors.push(`${article.slug}: hai đoạn gần như trùng nhau`);
        duplicateFound = true;
        break;
      }
    }
  }

  const sourceNote = copy.match(/<p class="article-source-note">([\s\S]*?)<\/p>/i)?.[1] || "";
  if (!sourceNote || !sourceNote.includes("<strong>Nguồn:</strong>")) errors.push(`${article.slug}: thiếu dòng nguồn chuẩn`);
  const hasLink = /<a\b/i.test(sourceNote);
  if (hasLink) {
    stats.linkedSources += 1;
    errors.push(`${article.slug}: dòng nguồn phải là văn bản thuần, không liên kết ra website ngoài`);
  } else {
    stats.plainTextSources += 1;
  }
  for (const source of article.sources || []) {
    if (!stripTags(sourceNote).includes(String(source.publisher || "").trim())) errors.push(`${article.slug}: dòng nguồn thiếu tên đơn vị ${source.publisher}`);
  }
  if (!stripTags(sourceNote).includes("Nguyễn Tử Linh")) errors.push(`${article.slug}: thiếu người chịu trách nhiệm biên tập`);

  const applyCount = (body.match(/class="[^"]*\barticle-apply\b/g) || []).length;
  const shareCount = (body.match(/class="[^"]*\barticle-share-panel\b/g) || []).length;
  if (applyCount > 1) errors.push(`${article.slug}: lặp khối đăng ký ${applyCount} lần`);
  if (shareCount > 1) errors.push(`${article.slug}: lặp khối chia sẻ ${shareCount} lần`);
}

if (stats.registered < 60) errors.push(`Số bài nguồn thấp bất thường: ${stats.registered}`);
if (stats.newsroomV3 !== stats.checked) errors.push(`Chỉ ${stats.newsroomV3}/${stats.checked} bài nguồn dùng newsroom v3`);
if (stats.linkedSources) errors.push(`Còn ${stats.linkedSources} dòng nguồn liên kết ra website ngoài`);

console.log(JSON.stringify({
  ...stats,
  errors: errors.length,
  sampleErrors: errors.slice(0, 60),
}, null, 2));
if (errors.length) process.exitCode = 1;
