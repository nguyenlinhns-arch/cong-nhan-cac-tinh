import {dailyCommunityArticles} from "./daily-community-articles-all.mjs";

const errors = [];
const warnings = [];
const stats = {checked: 0, recent: 0, directLeads: 0, contextReady: 0, v5Overrides: 0};
const recentDate = "2026-08-21";

const banned = [
  [/\bBài\s+(?:nguồn|báo|viết)\s+(?:cho\s+biết|nêu|ghi\s+nhận|đăng|đăng\s+tải)\b/iu, "kể quá trình lấy nguồn thay vì kể sự việc"],
  [/\bNguồn\s+cho\s+biết\b/iu, "dùng nhãn nguồn chung chung"],
  [/\bTheo\s+nguồn\b/iu, "dùng nhãn nguồn chung chung"],
  [/\bCó\s+thể\s+thấy\s+rằng\b/iu, "nhận định mơ hồ"],
  [/\bTrong\s+bối\s+cảnh\s+(?:đó|hiện\s+nay)\b/iu, "mở ý bằng câu khuôn"],
  [/\bnhằm\s+góp\s+phần\b/iu, "văn phong hành chính"],
  [/\bđẩy\s+mạnh\s+công\s+tác\b/iu, "văn phong hành chính"],
  [/\btriển\s+khai\s+thực\s+hiện\b/iu, "văn phong hành chính"],
  [/\bđừng\s+bỏ\s+lỡ\b|\bnhanh\s+tay\b|\bcơ\s+hội\s+đổi\s+đời\b/iu, "ngôn ngữ quảng cáo gây áp lực"],
];

function text(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value = "") {
  return text(value).split(/\s+/u).filter(Boolean).length;
}

function normalized(value = "") {
  return text(value).toLocaleLowerCase("vi").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordCoverage(keyword, value) {
  const stop = new Set(["cong", "ty", "tkv", "nam", "nghe", "mo", "than", "nguoi", "lao", "dong"]);
  const wanted = [...new Set(normalized(keyword).split(" ").filter((token) => token.length > 1 && !stop.has(token)))];
  if (!wanted.length) return 1;
  const found = new Set(normalized(value).split(" "));
  return wanted.filter((token) => found.has(token)).length / wanted.length;
}

for (const article of dailyCommunityArticles) {
  stats.checked += 1;
  const published = String(article.published || "").slice(0, 10);
  if (published < recentDate) continue;
  stats.recent += 1;
  if (article.editorialV5) stats.v5Overrides += 1;

  const slug = article.slug || article.urlPath || "unknown";
  const lead = text(article.lead);
  const intro = (article.intro || []).map(text).filter(Boolean);
  const opening = `${lead} ${intro.slice(0, 2).join(" ")}`.trim();
  const leadWords = words(lead);

  if (leadWords < 18 || leadWords > 72) errors.push(`${slug}: lede dài ${leadWords} từ; cần 18–72 từ`);
  else stats.directLeads += 1;

  if (!intro.length) errors.push(`${slug}: thiếu phần mở rộng sau lede`);
  if (intro.length && words(intro[0]) > 110) warnings.push(`${slug}: đoạn mở đầu dài ${words(intro[0])} từ`);

  for (const [pattern, message] of banned) {
    if (pattern.test(opening)) errors.push(`${slug}: ${message}`);
  }

  const timeSignal = /\b(?:ngày|tháng|quý|năm|giai\s+đoạn)\s+(?:\d|[IVX]+)/iu.test(opening)
    || /\b\d{1,2}\/\d{1,2}\/\d{4}\b/u.test(opening)
    || /\b20\d{2}\b/u.test(opening);
  const consequenceSignal = /\b(?:giúp|để|vì vậy|do đó|quyết định|ảnh hưởng|cần|theo dõi|đối chiếu|phụ thuộc|điểm\s+cần|bước\s+tiếp|giá trị|ý nghĩa|rủi ro|kết quả)\b/iu.test(opening);
  if (timeSignal && consequenceSignal) stats.contextReady += 1;
  else warnings.push(`${slug}: phần mở chưa thể hiện đủ “vì sao bây giờ / vì sao cần quan tâm”`);

  const primary = article.keyword || article.keywords?.[0] || article.title;
  if (keywordCoverage(primary, opening) < 0.45) warnings.push(`${slug}: phần mở bao phủ chủ đề chính còn thấp`);

  for (const paragraph of [...intro, ...(article.sections || []).flatMap((section) => section.paragraphs || [])]) {
    const count = words(paragraph);
    if (count > 125) warnings.push(`${slug}: còn đoạn ${count} từ, nên rút gọn để đọc tốt trên điện thoại`);
  }

  if (!Array.isArray(article.sources) || !article.sources.length) errors.push(`${slug}: thiếu nguồn tư liệu`);
  else {
    for (const source of article.sources) {
      if (!source.publisher || !source.title || !source.date) errors.push(`${slug}: nguồn thiếu tên đơn vị, tiêu đề hoặc ngày`);
    }
  }
}

if (stats.recent < 5) errors.push(`Số bài gần đây được kiểm tra thấp bất thường: ${stats.recent}`);

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  ...stats,
  errors: errors.length,
  warnings: warnings.length,
  sampleErrors: errors.slice(0, 40),
  sampleWarnings: warnings.slice(0, 40),
}, null, 2));

if (warnings.length) console.warn(warnings.join("\n"));
if (errors.length) process.exitCode = 1;
