import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const profiles = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-specialist-v7.json"), "utf8"));
const errors = [];
const structures = new Set();
const stats = {checked: 0, specialist: 0, proseOnly: 0, cleanLanguage: 0, faqSchemasRemoved: 0, sourceReady: 0};

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

function words(value = "") {
  return visible(value).split(/\s+/u).filter(Boolean).length;
}

function normalize(value = "") {
  return visible(value).toLocaleLowerCase("vi").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function similarity(left, right) {
  const a = new Set(normalize(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalize(right).split(" ").filter((token) => token.length > 2));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) if (b.has(token)) common += 1;
  return common / Math.max(a.size, b.size);
}

const banned = [
  /không\s+chỉ[^.!?]{0,100}mà\s+còn/iu,
  /đáng\s+chú\s+ý(?:\s+là)?/iu,
  /có\s+thể\s+thấy\s+rằng/iu,
  /điều\s+này\s+cho\s+thấy/iu,
  /theo\s+nguồn/iu,
  /nguồn\s+cho\s+biết/iu,
  /với\s+từ\s+khóa/iu,
  /tìm\s+hiểu\s+thêm\s+về/iu,
  /bài\s+viết\s+chuẩn\s+seo|tối\s+ưu\s+seo/iu,
];

for (const [slug, profile] of Object.entries(profiles)) {
  stats.checked += 1;
  const file = path.join(siteRoot, "bai-viet", slug, "index.html");
  if (!fs.existsSync(file)) {
    errors.push(`${slug}: thiếu tệp HTML`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const article = html.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
  const copy = article.match(/<!-- specialist-v7:start -->([\s\S]*?)<!-- specialist-v7:end -->/i)?.[1] || "";
  if (!article.includes("article-body--specialist-v7") || !article.includes('data-editorial-version="7"')) {
    errors.push(`${slug}: chưa dùng specialist v7`);
  } else stats.specialist += 1;
  if (!copy.includes('class="specialist-v7__copy"')) errors.push(`${slug}: thiếu specialist-v7__copy`);

  const paragraphs = [...copy.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => visible(match[1])).filter(Boolean);
  const headings = [...copy.matchAll(/<h2>([\s\S]*?)<\/h2>/gi)].map((match) => visible(match[1])).filter(Boolean);
  const expectedParagraphs = 2 + profile.sections.reduce((sum, section) => sum + section.paragraphs.length, 0) + 1;
  if (paragraphs.length !== expectedParagraphs) errors.push(`${slug}: có ${paragraphs.length}/${expectedParagraphs} đoạn theo hồ sơ v7`);
  if (paragraphs.length < 7 || paragraphs.length > 9) errors.push(`${slug}: thân bài cần 7–9 đoạn, hiện có ${paragraphs.length}`);
  if (headings.length < 2 || headings.length > 3) errors.push(`${slug}: cần 2–3 tiêu đề phụ, hiện có ${headings.length}`);
  if (headings.length !== profile.sections.length) errors.push(`${slug}: số tiêu đề phụ không khớp hồ sơ v7`);
  structures.add(`${paragraphs.length}p-${headings.length}h`);

  const lead = visible(html.match(/<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  if (words(lead) < 24 || words(lead) > 70) errors.push(`${slug}: sapô dài ${words(lead)} từ, cần 24–70`);
  if (paragraphs[0] && (words(paragraphs[0]) < 32 || words(paragraphs[0]) > 105)) errors.push(`${slug}: đoạn mở dài ${words(paragraphs[0])} từ`);
  if (paragraphs[1] && (words(paragraphs[1]) < 32 || words(paragraphs[1]) > 115)) errors.push(`${slug}: nut graph dài ${words(paragraphs[1])} từ`);
  for (const paragraph of paragraphs.slice(2)) {
    if (words(paragraph) < 24) errors.push(`${slug}: còn đoạn cụt ${words(paragraph)} từ: ${paragraph.slice(0, 90)}`);
    if (words(paragraph) > 130) errors.push(`${slug}: còn đoạn quá dài ${words(paragraph)} từ`);
  }

  const bannedBlocks = ["fact-grid", "fact-card", "evidence-list", "timeline", "faq-list", "faq-item", "article-seo-line", "keyword-summary", "article-prose-points", "article-prose-sequence"];
  const residue = bannedBlocks.filter((marker) => new RegExp(`class="[^"]*\\b${marker}\\b`, "i").test(article));
  if (residue.length) errors.push(`${slug}: còn cấu trúc dashboard/SEO: ${residue.join(", ")}`);
  else stats.proseOnly += 1;

  const text = visible(copy);
  const triggered = banned.filter((pattern) => pattern.test(text));
  if (triggered.length) errors.push(`${slug}: còn văn mẫu ${triggered.map(String).join(" | ")}`);
  else stats.cleanLanguage += 1;
  if (/"@type"\s*:\s*"FAQPage"/.test(html)) errors.push(`${slug}: còn FAQPage schema dù FAQ không hiển thị`);
  else stats.faqSchemasRemoved += 1;

  if (!article.includes('<strong>Nguồn:</strong>')) errors.push(`${slug}: thiếu nguồn cuối bài`);
  else stats.sourceReady += 1;
  if (!article.includes('class="article-nav"')) errors.push(`${slug}: thiếu điều hướng bài liên quan`);
  if (!article.includes('class="article-apply"')) errors.push(`${slug}: thiếu CTA sau phần báo chí`);
  if (!article.includes('class="article-share-panel"')) errors.push(`${slug}: thiếu khối chia sẻ sau phần báo chí`);

  const normalizedHeadings = headings.map(normalize);
  if (new Set(normalizedHeadings).size !== normalizedHeadings.length) errors.push(`${slug}: tiêu đề phụ bị lặp`);
  for (let left = 0; left < paragraphs.length; left += 1) {
    for (let right = left + 1; right < paragraphs.length; right += 1) {
      if (similarity(paragraphs[left], paragraphs[right]) >= 0.86) {
        errors.push(`${slug}: hai đoạn gần như lặp nhau`);
        left = paragraphs.length;
        break;
      }
    }
  }
}

if (stats.checked !== 10) errors.push(`Số hồ sơ chuyên sâu phải là 10, hiện có ${stats.checked}`);
if (structures.size < 2) errors.push("10 bài chuyên sâu vẫn bị ép vào một cấu trúc đoạn/tiêu đề duy nhất");

console.log(JSON.stringify({...stats, structures: [...structures], errors: errors.length, sampleErrors: errors.slice(0, 50)}, null, 2));
if (errors.length) process.exitCode = 1;
