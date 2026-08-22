import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const errors = [];
const stats = {
  checked: 0,
  manualProfiles: 0,
  explainerPages: 0,
  analysisPages: 0,
  featurePages: 0,
};

const manualRequirements = {
  "dieu-kien-tuyen-tho-lo-2026": ["18–40 tuổi", "1,53 m", "47 kg", "khám sức khỏe trực tiếp"],
  "ho-so-hoc-nghe-mo-can-gi": ["chưa cần nộp hồ sơ", "CCCD gốc", "giấy khai sinh", "tự giữ"],
  "hoc-nghe-khai-thac-mo-2-3-thang": ["2–3 tháng", "thực hành", "an toàn", "tổ đội"],
  "nghe-tho-lo-co-on-dinh-khong": ["19,7 triệu tấn", "22,77 triệu tấn", "đơn vị tiếp nhận", "tay nghề"],
  "13500-tho-lo-thu-nhap-tren-300-trieu-2025": ["13.507", "57%", "16,5%", "700 triệu đồng"],
  "an-toan-mua-mua-bao-2026": ["2,712 triệu tấn", "7,75 triệu m³", "24.445 m", "trạng thái kiểm soát"],
  "co-gioi-hoa-khai-thac-ham-lo": ["4,6 triệu tấn", "11,08 triệu tấn", "15 lò chợ", "tự động hóa"],
  "dao-tao-an-toan-truoc-khi-vao-lo": ["không được đưa thẳng", "bảo hộ", "báo cáo bất thường", "tổ đội"],
  "hoc-thuc-hanh-nghe-mo-ham-lo": ["501 thí sinh", "29 đơn vị", "27 nghề", "2.500"],
  "san-xuat-sach-hon-nganh-than": ["92,9%", "18,9%", "120–150 triệu m³", "môi trường"],
};

const explainerSlugs = new Set([
  "dieu-kien-tuyen-tho-lo-2026",
  "ho-so-hoc-nghe-mo-can-gi",
  "hoc-nghe-khai-thac-mo-2-3-thang",
  "dao-tao-an-toan-truoc-khi-vao-lo",
  "hoc-thuc-hanh-nghe-mo-ham-lo",
]);

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

function words(value = "") {
  return visible(value).split(/\s+/u).filter(Boolean).length;
}

function slugFromFile(file) {
  return path.basename(path.dirname(file));
}

const files = [...walk(path.join(siteRoot, "bai-viet")), ...walk(path.join(siteRoot, "chuyen-nguoi-tho"))]
  .filter((file) => {
    const html = fs.readFileSync(file, "utf8");
    return /"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)
      && /<article\b[^>]*class="[^"]*\barticle-body\b/i.test(html);
  });

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  const slug = slugFromFile(file);
  stats.checked += 1;

  if (!html.includes("article-body--prose-v4")) errors.push(`${relative}: thiếu lớp văn xuôi biên tập v4`);
  if (/class="[^"]*\bevidence-list\b/i.test(html)) errors.push(`${relative}: còn danh sách bằng chứng chia vụn mạch văn`);
  if (/class="[^"]*\btimeline\b/i.test(html)) errors.push(`${relative}: còn timeline thay cho phần giải thích bằng văn xuôi`);
  if (/class="[^"]*(?:article-seo-line|keyword-summary|article-editor-note)[^"]*"/i.test(html)) errors.push(`${relative}: còn dòng SEO hoặc ghi chú biên tập tự sự`);
  if (/^(?:bai-viet)\//.test(relative) && !html.includes("article-genre-label")) errors.push(`${relative}: thiếu nhãn thể loại`);
  if (!html.includes('class="article-byline"')) errors.push(`${relative}: thiếu tên và vai trò người chịu trách nhiệm`);
  if (!html.includes('/tac-gia/nguyen-tu-linh/')) errors.push(`${relative}: thiếu liên kết hồ sơ tác giả`);

  const article = html.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] || "";
  const opening = [...article.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)]
    .filter((match) => !/genre|byline|source|seo|share|status|conclusion/i.test(match[1]))
    .map((match) => visible(match[2]))
    .find((paragraph) => words(paragraph) >= 18) || "";
  if (!opening) errors.push(`${relative}: thiếu đoạn mở đủ ý`);
  else {
    const openingWords = words(opening);
    if (openingWords < 24 || openingWords > 115) errors.push(`${relative}: đoạn mở dài ${openingWords} từ, cần 24–115`);
    if (/^(?:Ở nhiều vùng quê|Cánh cửa vào nghề|Một hành trình|Trong bối cảnh đó|Có thể thấy rằng|Điều này cho thấy)/iu.test(opening)) {
      errors.push(`${relative}: đoạn mở còn văn dẫn chung chung “${opening.slice(0, 80)}”`);
    }
  }

  const listLikeBlocks = (article.match(/class="[^"]*\b(?:fact-grid|facts-grid|checklist|steps-list)\b/gi) || []).length;
  if (listLikeBlocks > 1) errors.push(`${relative}: còn ${listLikeBlocks} khối liệt kê; tối đa một khối dữ kiện hỗ trợ`);

  const text = visible(article);
  for (const pattern of [
    /(?:nhằm góp phần|qua đó góp phần|đẩy mạnh công tác|triển khai thực hiện|thực hiện tốt công tác)/iu,
    /(?:cam kết 100%|chắc chắn đủ điều kiện|chắc chắn được nhận|chắc chắn có việc|công việc nhẹ|không có rủi ro)/iu,
    /(?:Tìm hiểu thêm về|với từ khóa|bài viết chuẩn SEO|tối ưu SEO)/iu,
  ]) if (pattern.test(text)) errors.push(`${relative}: còn cụm hành chính, tuyệt đối hóa hoặc SEO tự sự ${pattern}`);

  if (manualRequirements[slug]) {
    stats.manualProfiles += 1;
    const lead = visible(html.match(/<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
    for (const phrase of manualRequirements[slug]) {
      if (!lead.includes(phrase) && !opening.includes(phrase)) errors.push(`${relative}: thiếu dữ kiện trọng tâm “${phrase}” trong sapô hoặc đoạn mở`);
    }
  }

  if (explainerSlugs.has(slug)) {
    stats.explainerPages += 1;
    if (!html.includes("article-body--explainer")) errors.push(`${relative}: bài hướng dẫn chưa được phân loại explainer`);
  } else if (relative.startsWith("chuyen-nguoi-tho/")) {
    stats.featurePages += 1;
    if (!html.includes("article-body--feature")) errors.push(`${relative}: bài nhân vật chưa được phân loại feature`);
  } else {
    stats.analysisPages += 1;
    if (!html.includes("article-body--analysis")) errors.push(`${relative}: bài phân tích chưa được phân loại analysis`);
  }
}

if (stats.checked < 10) errors.push(`Số bài văn xuôi được kiểm định thấp bất thường: ${stats.checked}`);
if (stats.manualProfiles !== Object.keys(manualRequirements).length) errors.push(`Chỉ tìm thấy ${stats.manualProfiles}/${Object.keys(manualRequirements).length} bài trọng điểm`);

console.log(JSON.stringify({
  ...stats,
  errors: errors.length,
  sampleErrors: errors.slice(0, 60),
}, null, 2));
if (errors.length) process.exitCode = 1;
