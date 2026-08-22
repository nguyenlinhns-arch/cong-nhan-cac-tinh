import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const errors = [];

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
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function key(value = "") {
  return visible(value).toLocaleLowerCase("vi").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

const sourceNarration = /(?:bài\s+(?:viết|nguồn|báo|gốc)|nguồn(?:\s+chính\s+thức)?|website|fanpage)[^.!?]{0,100}\b(?:cho biết|cho thấy|nêu|ghi nhận|đề cập|mô tả|công bố|đăng tải)\b/iu;
const banned = [
  /Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)/iu,
  /(?:tìm hiểu thêm về|với từ khóa|bài viết chuẩn seo|tối ưu seo)/iu,
  /Nguyễn Tử Linh biên soạn/iu,
  /(?:Điều cần hiểu trước tiên|Giải thích rõ từng ý|Kết luận ngắn)/iu,
];

const files = [...walk(path.join(siteRoot, "tin-nganh-than")), ...walk(path.join(siteRoot, "bai-viet"))]
  .filter((file) => {
    const html = fs.readFileSync(file, "utf8");
    return /"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)
      && /<article\b[^>]*class="[^"]*\barticle-body\b/i.test(html);
  });

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  const text = visible(html);
  for (const marker of [
    '/editorial-newsroom.css?v=1',
    'editorial-authority-page',
    'class="article-byline"',
    'class="article-genre-label"',
    'article-media-credit',
  ]) if (!html.includes(marker)) errors.push(`${relative}: thiếu ${marker}`);
  if (!/<strong>Nguồn:<\/strong>|class="article-source-note"/i.test(html)) errors.push(`${relative}: thiếu dòng nguồn`);
  for (const pattern of banned) if (pattern.test(text)) errors.push(`${relative}: còn cụm văn máy ${pattern}`);
  if (/class="(?:article-seo-line|keyword-summary|article-editor-note)"/i.test(html)) errors.push(`${relative}: còn khối SEO tự sự`);

  const article = html.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] || "";
  const contentParagraphs = [...article.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)]
    .filter((match) => !/lead|byline|source|eyebrow|date|takeaway|share|status/i.test(match[1]))
    .map((match) => visible(match[2]))
    .filter((paragraph) => paragraph.split(/\s+/u).length >= 18);
  if (contentParagraphs.length < 5) errors.push(`${relative}: thân bài chỉ có ${contentParagraphs.length} đoạn đủ ý`);
  if (contentParagraphs[0] && sourceNarration.test(contentParagraphs[0])) errors.push(`${relative}: đoạn mở còn kể lại nguồn thay vì đi thẳng vào sự kiện`);
  if (contentParagraphs[0] && contentParagraphs[0].split(/\s+/u).length > 180) errors.push(`${relative}: đoạn mở quá dài`);
  const headline = visible(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  if (headline.length < 20 || headline.length > 130) errors.push(`${relative}: tiêu đề dài ${headline.length} ký tự`);

  const seen = new Set();
  for (const match of article.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    if (/lead|byline|source|eyebrow|date|takeaway|share|status/i.test(match[1])) continue;
    const paragraph = visible(match[2]);
    if (paragraph.length < 100) continue;
    const normalized = key(paragraph);
    if (seen.has(normalized)) errors.push(`${relative}: còn đoạn lặp “${paragraph.slice(0, 80)}…”`);
    seen.add(normalized);
  }
}

if (files.length < 90) errors.push(`Số bài được kiểm định thấp bất thường: ${files.length}`);

const dailyFiles = walk(path.join(siteRoot, "giai-dap-nghe-mo")).filter((file) => {
  const html = fs.readFileSync(file, "utf8");
  return html.includes("daily-seo-page") && html.includes('"@type":"Article"');
});
for (const file of dailyFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  if (!html.includes("editorial-authority-page")) errors.push(`${relative}: thiếu lớp biên tập chuyên môn`);
  if (!html.includes("Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung")) errors.push(`${relative}: thiếu trách nhiệm biên tập`);
  if (!html.includes("Nguồn tư liệu:")) errors.push(`${relative}: thiếu nguồn tư liệu`);
}

console.log(JSON.stringify({
  editorialArticles: files.length,
  dailyArticles: dailyFiles.length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 40),
}, null, 2));
if (errors.length) process.exitCode = 1;
