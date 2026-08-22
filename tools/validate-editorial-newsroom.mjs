import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const dailyData = JSON.parse(fs.readFileSync(path.resolve(projectRoot, "content", "daily-seo-articles.json"), "utf8"));
const releaseDate = process.env.SEO_DAILY_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const errors = [];
const banned = [
  /Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)/i,
  /Nguồn thông tin tuyển dụng hiện hành/i,
  /Điều cần hiểu trước tiên/i,
  /Giải thích rõ từng ý/i,
  /Kết luận ngắn/i,
  /Nguyễn Tử Linh biên soạn/i,
];

function visible(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

const editorialFiles = [
  ...walk(path.join(siteRoot, "tin-nganh-than")),
  ...walk(path.join(siteRoot, "bai-viet")),
  ...walk(path.join(siteRoot, "chuyen-nguoi-tho")),
].filter((file) => {
  const html = fs.readFileSync(file, "utf8");
  return /"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)
    && /<article\b[^>]*class="[^"]*\barticle-body\b/i.test(html);
});

let newsroomArticles = 0;
for (const file of editorialFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  if (!html.includes('/editorial-newsroom.css?v=1')) errors.push(`${relative}: thiếu stylesheet biên tập`);
  if (!html.includes('article-body--newsroom')) errors.push(`${relative}: thiếu lớp bài viết newsroom`);
  if (!html.includes('article-media-credit')) errors.push(`${relative}: thiếu nguồn ảnh`);
  if (!html.includes('<strong>Nguồn tư liệu:</strong>') && !html.includes('class="article-source-note"')) {
    errors.push(`${relative}: thiếu nguồn tư liệu hiển thị`);
  }
  const text = visible(html);
  for (const pattern of banned) if (pattern.test(text)) errors.push(`${relative}: còn cụm máy móc ${pattern}`);
  newsroomArticles += 1;
}

const released = dailyData.articles.filter((article) => article.publish_on <= releaseDate);
for (const article of released) {
  const file = path.join(siteRoot, "giai-dap-nghe-mo", article.slug, "index.html");
  if (!fs.existsSync(file)) { errors.push(`${article.slug}: thiếu trang`); continue; }
  const html = fs.readFileSync(file, "utf8");
  const text = visible(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  for (const marker of [
    '/editorial-newsroom.css?v=1',
    'daily-seo-article--newsroom',
    `<h1>${article.title}</h1>`,
    article.direct_answer,
    'Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung',
    '<strong>Nguồn tư liệu:</strong>',
    'data-contact="zalo"',
  ]) if (!html.includes(marker)) errors.push(`${article.slug}: thiếu ${marker}`);
  if (words < 650) errors.push(`${article.slug}: bài sau biên tập còn mỏng (${words} từ)`);
  for (const pattern of banned) if (pattern.test(text)) errors.push(`${article.slug}: còn cụm máy móc ${pattern}`);
}

const cssFile = path.join(siteRoot, "editorial-newsroom.css");
if (!fs.existsSync(cssFile) || fs.statSync(cssFile).size < 3000) errors.push("Thiếu editorial-newsroom.css hoặc tệp quá ngắn");

console.log(JSON.stringify({
  releaseDate,
  editorialArticles: editorialFiles.length,
  newsroomArticles,
  dailyArticles: released.length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 40),
}, null, 2));
if (errors.length) process.exitCode = 1;
