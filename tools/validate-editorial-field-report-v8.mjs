import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const reports = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-field-reports-v8.json"), "utf8"));
const errors = [];
const stats = {checked: 0, original: 0, sourceReady: 0, videoReady: 0, cleanLanguage: 0};

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

const banned = [
  /theo\s+nguồn/iu,
  /nguồn\s+cho\s+biết/iu,
  /đáng\s+chú\s+ý(?:\s+là)?/iu,
  /có\s+thể\s+thấy\s+rằng/iu,
  /điều\s+này\s+cho\s+thấy/iu,
  /không\s+chỉ[^.!?]{0,100}mà\s+còn/iu,
  /chuẩn\s+seo|tối\s+ưu\s+seo/iu,
  /bài\s+viết\s+này/iu,
];

const requiredFacts = {
  "gia-lai": ["Ia RDeh", "Than Nam Mẫu", "21 công nhân", "trên 30 học sinh", "Kso Sới", "UBND xã"],
  "quang-ngai": ["Quảng Ngãi", "Quảng Ninh", "nhập học", "rời quê"],
};

for (const [slug, report] of Object.entries(reports)) {
  stats.checked += 1;
  const file = path.join(siteRoot, "viec-lam-nganh-than", slug, "index.html");
  if (!fs.existsSync(file)) {
    errors.push(`${slug}: thiếu trang địa phương`);
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const pattern = new RegExp(`<!-- field-report-v8:start:${slug} -->([\\s\\S]*?)<!-- field-report-v8:end:${slug} -->`, "i");
  const section = html.match(pattern)?.[1] || "";
  if (!section || !section.includes('data-editorial-original="field-report-v8"')) {
    errors.push(`${slug}: thiếu phóng sự hiện trường v8`);
    continue;
  }
  stats.original += 1;

  if (!html.includes('/editorial-field-report-v8.css?v=1')) errors.push(`${slug}: thiếu stylesheet phóng sự v8`);
  if (!section.includes(report.videoUrl)) errors.push(`${slug}: thiếu đúng URL video gốc`);
  else stats.videoReady += 1;
  if (!section.includes('<strong>Tư liệu:</strong>')) errors.push(`${slug}: thiếu ghi chú tư liệu`);
  else stats.sourceReady += 1;

  const text = visible(section);
  const paragraphs = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => visible(match[1])).filter(Boolean);
  const headings = [...section.matchAll(/<h3>([\s\S]*?)<\/h3>/gi)].map((match) => visible(match[1])).filter(Boolean);
  if (paragraphs.length < 9 || paragraphs.length > 12) errors.push(`${slug}: số đoạn hiển thị ${paragraphs.length}, cần 9–12 kể cả sapô/kết/tư liệu`);
  if (headings.length < 2 || headings.length > 3) errors.push(`${slug}: cần 2–3 tiêu đề phụ, hiện có ${headings.length}`);

  const lead = visible(section.match(/class="editorial-field-report-v8__lead"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  if (words(lead) < 35 || words(lead) > 90) errors.push(`${slug}: sapô hiện trường dài ${words(lead)} từ`);

  const prose = section.match(/<article\b[^>]*class="[^"]*editorial-field-report-v8__prose[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] || "";
  const proseParagraphs = [...prose.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => visible(match[1])).filter(Boolean);
  if (proseParagraphs.length < 7 || proseParagraphs.length > 8) errors.push(`${slug}: phần văn xuôi có ${proseParagraphs.length} đoạn, cần 7–8`);
  for (const paragraph of proseParagraphs) {
    if (words(paragraph) < 18) errors.push(`${slug}: còn đoạn văn xuôi quá ngắn ${words(paragraph)} từ`);
    if (words(paragraph) > 125) errors.push(`${slug}: còn đoạn văn xuôi quá dài ${words(paragraph)} từ`);
  }

  const triggered = banned.filter((patternItem) => patternItem.test(text));
  if (triggered.length) errors.push(`${slug}: còn văn mẫu/quảng cáo ${triggered.map(String).join(" | ")}`);
  else stats.cleanLanguage += 1;

  for (const fact of requiredFacts[slug] || []) {
    if (!text.includes(fact)) errors.push(`${slug}: thiếu dữ kiện bắt buộc “${fact}”`);
  }

  if (report.dateModified && !html.includes(`"dateModified":"${report.dateModified}"`)) {
    errors.push(`${slug}: dateModified chưa cập nhật ${report.dateModified}`);
  }
}

if (stats.checked !== 2) errors.push(`Cần đúng 2 phóng sự hiện trường v8, hiện có ${stats.checked}`);

console.log(JSON.stringify({...stats, errors: errors.length, sampleErrors: errors.slice(0, 40)}, null, 2));
if (errors.length) process.exitCode = 1;
