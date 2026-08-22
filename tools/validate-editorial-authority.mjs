import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const errors = [];
const explainerSlugs = new Set([
  "dieu-kien-tuyen-tho-lo-2026",
  "ho-so-hoc-nghe-mo-can-gi",
  "hoc-nghe-khai-thac-mo-2-3-thang",
  "dao-tao-an-toan-truoc-khi-vao-lo",
  "hoc-thuc-hanh-nghe-mo-ham-lo",
]);
const genres = {
  news: {
    label: "TIN TỨC · DỮ KIỆN VÀ BỐI CẢNH",
    role: "Biên tập và kiểm chứng nguồn",
  },
  feature: {
    label: "CHUYỆN NGƯỜI THỢ · NHÂN VẬT VÀ TRẢI NGHIỆM",
    role: "Biên tập câu chuyện và kiểm chứng nguồn",
  },
  analysis: {
    label: "PHÂN TÍCH · DỮ LIỆU VÀ TÁC ĐỘNG",
    role: "Phân tích và chịu trách nhiệm nội dung",
  },
  explainer: {
    label: "GIẢI THÍCH · QUY TRÌNH VÀ ĐIỀU KIỆN ÁP DỤNG",
    role: "Giải thích và chịu trách nhiệm nội dung",
  },
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

function key(value = "") {
  return visible(value).toLocaleLowerCase("vi").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function expectedGenre(relative) {
  const slug = relative.split("/").filter(Boolean).at(-2) || "";
  if (relative.startsWith("chuyen-nguoi-tho/")) return "feature";
  if (relative.startsWith("bai-viet/") && explainerSlugs.has(slug)) return "explainer";
  if (relative.startsWith("bai-viet/")) return "analysis";
  return "news";
}

const sourceNarration = /(?:bài\s+(?:viết|nguồn|báo|gốc)|nguồn(?:\s+chính\s+thức)?|website|fanpage)[^.!?]{0,100}\b(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|đề\s+cập|mô\s+tả|công\s+bố|đăng\s+tải)\b/iu;
const banned = [
  /Bài\s+nguồn\s+ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)/iu,
  /(?:tìm\s+hiểu\s+thêm\s+về|với\s+từ\s+khóa|bài\s+viết\s+chuẩn\s+seo|tối\s+ưu\s+seo)/iu,
  /Nguyễn\s+Tử\s+Linh\s+biên\s+soạn/iu,
  /(?:Điều\s+cần\s+hiểu\s+trước\s+tiên|Giải\s+thích\s+rõ\s+từng\s+ý|Kết\s+luận\s+ngắn)/iu,
];

const files = [
  ...walk(path.join(siteRoot, "tin-nganh-than")),
  ...walk(path.join(siteRoot, "bai-viet")),
  ...walk(path.join(siteRoot, "chuyen-nguoi-tho")),
].filter((file) => {
  const html = fs.readFileSync(file, "utf8");
  return /"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)
    && /<article\b[^>]*class="[^"]*\barticle-body\b/i.test(html);
});

const genreStats = {news: 0, feature: 0, analysis: 0, explainer: 0};
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  const text = visible(html);
  const genre = expectedGenre(relative);
  genreStats[genre] += 1;
  const config = genres[genre];

  for (const marker of [
    '/editorial-newsroom.css?v=1',
    '/editorial-prose-v4.css?v=1',
    'editorial-authority-page',
    'class="article-byline"',
    'class="article-genre-label"',
    'article-media-credit',
    `article-body--${genre}`,
    config.label,
    config.role,
  ]) if (!html.includes(marker)) errors.push(`${relative}: thiếu ${marker}`);

  if (!/<strong>Nguồn:<\/strong>|class="article-source-note"/i.test(html)) errors.push(`${relative}: thiếu dòng nguồn`);
  if (!html.includes("article-source-responsibility")) errors.push(`${relative}: thiếu trách nhiệm đối chiếu nguồn`);
  if (!html.includes('/tac-gia/nguyen-tu-linh/')) errors.push(`${relative}: thiếu liên kết hồ sơ tác giả`);
  for (const pattern of banned) if (pattern.test(text)) errors.push(`${relative}: còn cụm văn máy ${pattern}`);
  if (/class="[^"]*(?:article-seo-line|keyword-summary|article-editor-note)[^"]*"/i.test(html)) errors.push(`${relative}: còn khối SEO tự sự`);

  const article = html.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] || "";
  const contentParagraphs = [...article.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)]
    .filter((match) => !/lead|byline|source|eyebrow|date|takeaway|share|status|genre|current-facts|topic-hub/i.test(match[1]))
    .map((match) => visible(match[2]))
    .filter((paragraph) => paragraph.split(/\s+/u).length >= 18);
  if (contentParagraphs.length < 5) errors.push(`${relative}: thân bài chỉ có ${contentParagraphs.length} đoạn đủ ý`);
  if (contentParagraphs[0] && sourceNarration.test(contentParagraphs[0])) errors.push(`${relative}: đoạn mở còn kể lại nguồn thay vì đi thẳng vào sự kiện`);
  if (contentParagraphs[0] && contentParagraphs[0].split(/\s+/u).length > 150) errors.push(`${relative}: đoạn mở quá dài`);
  const headline = visible(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  if (headline.length < 20 || headline.length > 130) errors.push(`${relative}: tiêu đề dài ${headline.length} ký tự`);

  const seen = new Set();
  for (const match of article.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    if (/lead|byline|source|eyebrow|date|takeaway|share|status|genre|current-facts|topic-hub/i.test(match[1])) continue;
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
  for (const marker of [
    "editorial-authority-page",
    "/editorial-newsroom.css?v=1",
    "/editorial-prose-v4.css?v=1",
    "Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung",
  ]) if (!html.includes(marker)) errors.push(`${relative}: thiếu ${marker}`);
  if (!/(?:Nguồn\s+tư\s+liệu:|<strong>Nguồn:<\/strong>)/iu.test(html)) errors.push(`${relative}: thiếu nguồn tư liệu`);
  if (/Nguyễn\s+Tử\s+Linh\s+biên\s+soạn/iu.test(visible(html))) errors.push(`${relative}: còn nhãn tác giả cũ`);
}
if (dailyFiles.length < 15) errors.push(`Số bài giải đáp được kiểm định thấp bất thường: ${dailyFiles.length}`);

console.log(JSON.stringify({
  editorialArticles: files.length,
  dailyArticles: dailyFiles.length,
  genreStats,
  errors: errors.length,
  sampleErrors: errors.slice(0, 60),
}, null, 2));
if (errors.length) process.exitCode = 1;
