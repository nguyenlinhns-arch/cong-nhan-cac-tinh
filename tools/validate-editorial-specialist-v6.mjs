import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const profiles = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-specialist-v6.json"), "utf8"));
const errors = [];
const stats = {checked: 0, specialist: 0, faqSchemasRemoved: 0, proseOnly: 0, cleanLanguage: 0};
const formulaicPattern = /(?:không\s+chỉ[^.!?]{0,100}mà\s+còn|đáng\s+chú\s+ý(?:\s+là)?|đây\s+không\s+chỉ\s+là|trọng\s+tâm\s+không\s+chỉ\s+là|với\s+từ\s+khóa|người\s+đọc\s+vì\s+thế\s+tìm\s+thấy|có\s+thể\s+thấy\s+rằng)/iu;

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

function words(value = "") {
  return visible(value).split(/\s+/u).filter(Boolean).length;
}

for (const [slug, profile] of Object.entries(profiles)) {
  const file = path.join(siteRoot, "bai-viet", slug, "index.html");
  stats.checked += 1;
  if (!fs.existsSync(file)) {
    errors.push(`${slug}: thiếu tệp HTML`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const article = html.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
  const copy = article.match(/<!-- specialist-v6:start -->([\s\S]*?)<!-- specialist-v6:end -->/i)?.[1] || "";
  const heroLead = html.match(/<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "";

  if (!article.includes("article-body--specialist-v6")) errors.push(`${slug}: thiếu lớp article-body--specialist-v6`);
  else stats.specialist += 1;
  if (!copy.includes('class="specialist-v6__copy"')) errors.push(`${slug}: thiếu vùng specialist-v6__copy`);

  const paragraphs = [...copy.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => visible(match[1])).filter(Boolean);
  const headings = [...copy.matchAll(/<h2>([\s\S]*?)<\/h2>/gi)].map((match) => visible(match[1])).filter(Boolean);
  if (paragraphs.length !== 6) errors.push(`${slug}: thân bài cần đúng 6 đoạn, hiện có ${paragraphs.length}`);
  if (headings.length !== 2) errors.push(`${slug}: thân bài cần đúng 2 tiêu đề phụ, hiện có ${headings.length}`);
  if (!headings.includes(profile.heading1) || !headings.includes(profile.heading2)) errors.push(`${slug}: tiêu đề phụ không khớp hồ sơ chuyên sâu v6`);
  const tooShort = paragraphs.find((paragraph) => words(paragraph) < 24);
  if (tooShort) errors.push(`${slug}: còn đoạn quá ngắn (${words(tooShort)} từ): ${tooShort.slice(0, 90)}`);
  const tooLong = paragraphs.find((paragraph) => words(paragraph) > 125);
  if (tooLong) errors.push(`${slug}: còn đoạn quá dài (${words(tooLong)} từ)`);

  const bannedBlocks = ["fact-grid", "fact-card", "evidence-list", "timeline", "faq-list", "faq-item", "article-seo-line", "keyword-summary"];
  const residue = bannedBlocks.filter((marker) => new RegExp(`class="[^"]*\\b${marker}\\b`, "i").test(article));
  if (residue.length) errors.push(`${slug}: còn cấu trúc dashboard/SEO: ${residue.join(", ")}`);
  else stats.proseOnly += 1;

  const readerCopy = `${visible(heroLead)} ${visible(copy)}`.trim();
  if (formulaicPattern.test(readerCopy)) errors.push(`${slug}: phần người đọc thấy còn văn mẫu cần viết lại`);
  else stats.cleanLanguage += 1;

  if (/"@type"\s*:\s*"FAQPage"/.test(html)) errors.push(`${slug}: còn FAQPage schema dù FAQ đã rời thân bài`);
  else stats.faqSchemasRemoved += 1;
  if (!article.includes('<strong>Nguồn:</strong>')) errors.push(`${slug}: thiếu nguồn cuối bài`);
  if (!article.includes('class="article-nav"')) errors.push(`${slug}: thiếu điều hướng bài liên quan`);
  if (!article.includes('class="article-apply"')) errors.push(`${slug}: thiếu CTA sau phần báo chí`);
  if (!article.includes('class="article-share-panel"')) errors.push(`${slug}: thiếu khối chia sẻ sau phần báo chí`);
  if (!html.includes(profile.heading1) || !html.includes(profile.heading2)) errors.push(`${slug}: nội dung chuyên gia chưa được áp dụng`);
}

if (stats.checked !== 10) errors.push(`Số hồ sơ chuyên sâu phải là 10, hiện có ${stats.checked}`);

console.log(JSON.stringify({...stats, errors: errors.length, sampleErrors: errors.slice(0, 40)}, null, 2));
if (errors.length) process.exitCode = 1;
