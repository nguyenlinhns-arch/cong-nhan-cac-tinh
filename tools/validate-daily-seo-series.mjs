import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const data = JSON.parse(fs.readFileSync(path.join(root, "content", "daily-seo-articles.json"), "utf8"));
const releaseDate = process.env.SEO_DAILY_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const released = data.articles.filter((article) => article.publish_on <= releaseDate);
const future = data.articles.filter((article) => article.publish_on > releaseDate);
const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
const llms = fs.readFileSync(path.join(site, "llms.txt"), "utf8");
const hub = fs.readFileSync(path.join(site, "giai-dap-nghe-mo", "index.html"), "utf8");
const errors = [];
const occupationTerms = ["khai thác mỏ", "xây dựng mỏ", "cơ điện mỏ"];
const allowedBlueWorkerImages = new Set([
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp",
]);
const isOccupationArticle = (article) => occupationTerms.some((term) =>
  `${article.title} ${article.primary_query}`.toLocaleLowerCase("vi").includes(term),
);
const unique = (items, label) => {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item)) errors.push(`${label} bị trùng: ${item}`);
    seen.add(item);
  }
};

unique(data.articles.map((article) => article.slug), "Slug");
unique(data.articles.map((article) => article.publish_on), "Ngày xuất bản");
unique(data.articles.map((article) => article.primary_query.toLocaleLowerCase("vi")), "Từ khóa chính");

for (const article of data.articles) {
  if (!allowedBlueWorkerImages.has(article.image.src)) errors.push(`${article.slug}: ảnh không phải công nhân Vinacomin mặc áo xanh, đội mũ`);
  if (article.meta.length < 100 || article.meta.length > 165) errors.push(`${article.slug}: meta description dài ${article.meta.length} ký tự`);
  if (article.direct_answer.length < 90 || article.direct_answer.length > 330) errors.push(`${article.slug}: câu trả lời trực tiếp cần 90–330 ký tự`);
  if ((article.sections || []).length < 3) errors.push(`${article.slug}: cần ít nhất 3 mục giải thích`);
  if ((article.faqs || []).length < 3) errors.push(`${article.slug}: cần ít nhất 3 FAQ`);
}

for (const article of released) {
  const relative = `giai-dap-nghe-mo/${article.slug}/index.html`;
  const target = path.join(site, relative);
  const canonical = `https://thaylinhtuyenthomo.vn/giai-dap-nghe-mo/${article.slug}/`;
  if (!fs.existsSync(target)) {
    errors.push(`${article.slug}: thiếu trang đã đến ngày xuất bản`);
    continue;
  }
  const html = fs.readFileSync(target, "utf8");
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const words = visible.split(/\s+/).filter(Boolean).length;
  if (words < 650) errors.push(`${article.slug}: nội dung còn mỏng (${words} từ)`);
  for (const marker of [
    `<link rel="canonical" href="${canonical}">`,
    `<h1>${article.title}</h1>`,
    article.direct_answer,
    '"@type":"Article"',
    '"@type":"FAQPage"',
    'data-contact="zalo"',
    "/lien-he-di-lam-mo-than-quang-ninh/",
  ]) if (!html.includes(marker)) errors.push(`${article.slug}: thiếu ${marker}`);
  if (isOccupationArticle(article)) {
    const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || "";
    if (!html.includes('class="daily-seo-page occupation-text-only"')) errors.push(`${article.slug}: chưa bật chế độ bài nghề chỉ dùng nội dung chữ`);
    if (/<(?:img|picture|figure)\b/i.test(main)) errors.push(`${article.slug}: bài nghề còn ảnh minh họa trong nội dung chính`);
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`${article.slug}: thiếu trong sitemap`);
  if (!llms.includes(canonical)) errors.push(`${article.slug}: thiếu trong llms.txt`);
  if (!hub.includes(`/giai-dap-nghe-mo/${article.slug}/`)) errors.push(`${article.slug}: thiếu trên trang trung tâm`);
}

for (const article of future) {
  const canonical = `https://thaylinhtuyenthomo.vn/giai-dap-nghe-mo/${article.slug}/`;
  if (fs.existsSync(path.join(site, "giai-dap-nghe-mo", article.slug, "index.html"))) errors.push(`${article.slug}: tệp tương lai được tạo sớm`);
  if (sitemap.includes(canonical)) errors.push(`${article.slug}: URL tương lai xuất hiện sớm trong sitemap`);
  if (hub.includes(`/${article.slug}/`)) errors.push(`${article.slug}: bài tương lai xuất hiện sớm trên hub`);
}

const machineFeed = JSON.parse(fs.readFileSync(path.join(site, "daily-seo-articles.json"), "utf8"));
if (machineFeed.articles.length !== released.length) errors.push("Dữ liệu máy đọc không khớp số bài đã xuất bản");
if (!fs.readFileSync(path.join(site, "index.html"), "utf8").includes("home-daily-seo")) errors.push("Trang chủ thiếu khối giải đáp mới mỗi ngày");
if (!fs.readFileSync(path.join(site, "cam-nang-nghe-mo", "index.html"), "utf8").includes("daily-seo-guide:start")) errors.push("Cẩm nang thiếu liên kết tới chuỗi SEO hằng ngày");

console.log(JSON.stringify({releaseDate, planned: data.articles.length, released: released.length, future: future.length, errors: errors.length, sampleErrors: errors.slice(0, 30)}, null, 2));
if (errors.length) process.exitCode = 1;
