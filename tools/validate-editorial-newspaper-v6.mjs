import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const errors = [];
const stats = {checked: 0, news: 0, sourceNotes: 0};

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
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value = "") {
  return visible(value).toLocaleLowerCase("vi").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((item) => item.length > 2);
}

function similarity(left, right) {
  const a = new Set(tokens(left));
  const b = new Set(tokens(right));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const item of a) if (b.has(item)) common += 1;
  return common / Math.min(a.size, b.size);
}

const files = [
  ...walk(path.join(siteRoot, "tin-nganh-than")),
  ...walk(path.join(siteRoot, "bai-viet")),
  ...walk(path.join(siteRoot, "chuyen-nguoi-tho")),
].filter((file) => {
  const html = fs.readFileSync(file, "utf8");
  return /"@type"\s*:\s*"(?:NewsArticle|Article|BlogPosting)"/.test(html)
    && /<article\b[^>]*class="[^"]*\barticle-body\b/i.test(html);
});

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  stats.checked += 1;
  for (const marker of [
    '/editorial-newspaper-v6.css?v=1',
    'editorial-newspaper-v6-page',
    'article-hero--newspaper-v6',
    'article-layout--newspaper-v6',
    'article-body--newspaper-v6',
  ]) if (!html.includes(marker)) errors.push(`${relative}: thiếu ${marker}`);

  if (html.includes('class="professional-news-copy')) {
    stats.news += 1;
    const copy = html.match(/<div class="professional-news-copy[^"]*">([\s\S]*?)<\/div>\s*<p class="article-source-note"/i)?.[1] || "";
    const paragraphs = [...copy.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => visible(match[1])).filter(Boolean);
    if (paragraphs.length < 5) errors.push(`${relative}: thân bài báo chỉ có ${paragraphs.length} đoạn`);
    const headings = [...copy.matchAll(/<h2>[\s\S]*?<\/h2>/gi)].length;
    if (headings > 3) errors.push(`${relative}: còn ${headings} tiêu đề phụ; tối đa 3`);
    if (/professional-news-faq/i.test(copy)) errors.push(`${relative}: FAQ còn nằm trong thân bài báo`);
    let duplicate = false;
    for (let left = 0; left < paragraphs.length && !duplicate; left += 1) {
      for (let right = left + 1; right < paragraphs.length; right += 1) {
        if (paragraphs[left].split(/\s+/).length < 18 || paragraphs[right].split(/\s+/).length < 18) continue;
        if (similarity(paragraphs[left], paragraphs[right]) >= 0.88) {
          errors.push(`${relative}: còn hai đoạn gần trùng nhau`);
          duplicate = true;
          break;
        }
      }
    }
  }

  const sourceNote = html.match(/<p class="article-source-note">([\s\S]*?)<\/p>/i)?.[1] || "";
  if (sourceNote) {
    stats.sourceNotes += 1;
    if (!sourceNote.includes("Nguồn tư liệu:")) errors.push(`${relative}: nguồn chưa dùng nhãn Nguồn tư liệu`);
    if (!visible(sourceNote).includes("Nguyễn Tử Linh")) errors.push(`${relative}: thiếu trách nhiệm biên tập ở cuối bài`);
  }
  if (/Bài được Nguyễn Tử Linh biên soạn từ/iu.test(visible(html))) errors.push(`${relative}: còn câu kể quy trình biên soạn`);
}

if (stats.checked < 90) errors.push(`Số bài kiểm tra thấp bất thường: ${stats.checked}`);
if (stats.news < 80) errors.push(`Số bài newsroom thấp bất thường: ${stats.news}`);

console.log(JSON.stringify({...stats, errors: errors.length, sampleErrors: errors.slice(0, 60)}, null, 2));
if (errors.length) process.exitCode = 1;
