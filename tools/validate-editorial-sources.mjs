import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const ledger = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-sources.json"), "utf8"));
const imageSources = JSON.parse(fs.readFileSync(path.join(root, "assets", "articles", "sources.json"), "utf8"));
const errors = [];
const articleFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name === "index.html") {
      const html = fs.readFileSync(target, "utf8");
      if (/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)) articleFiles.push({target, html});
    }
  }
}
walk(path.join(root, "tin-nganh-than"));
walk(path.join(root, "bai-viet"));

if (!Array.isArray(ledger.articles) || ledger.articles.length !== 66) errors.push(`Sổ nguồn phải có 66 bài, hiện có ${ledger.articles?.length || 0}`);
if (Object.keys(imageSources).length !== 66) errors.push(`Sổ nguồn ảnh phải có 66 bài, hiện có ${Object.keys(imageSources).length}`);
if (articleFiles.length !== 66) errors.push(`Website phải có 66 bài, hiện tìm thấy ${articleFiles.length}`);

const bySlug = new Map(articleFiles.map((item) => {
  const canonical = item.html.match(/<link rel="canonical" href="[^"]+\/([^/]+)\/">/i)?.[1] || "";
  return [canonical, item];
}));

for (const article of ledger.articles || []) {
  const label = article.slug || article.title || "bài không rõ";
  const file = bySlug.get(article.slug);
  if (!file) { errors.push(`${label}: không tìm thấy HTML tương ứng`); continue; }
  if (!Array.isArray(article.sources) || !article.sources.length) errors.push(`${label}: không có nguồn nội dung`);
  for (const source of article.sources || []) {
    if (!String(source.publisher || "").trim()) errors.push(`${label}: nguồn thiếu tên đơn vị`);
    if (!String(source.title || "").trim()) errors.push(`${label}: nguồn thiếu tên tài liệu/bài`);
    if (!/^(?:\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})$/.test(String(source.date || ""))) errors.push(`${label}: nguồn thiếu ngày hợp lệ`);
  }
  const image = imageSources[article.slug];
  if (!image?.provider || !image?.source_url || !image?.album_title) errors.push(`${label}: nguồn ảnh chưa đầy đủ`);
  if (!file.html.includes("<strong>Nguồn:</strong>")) errors.push(`${label}: trang chưa hiển thị dòng nguồn`);
  if (!/article:published_time|"datePublished"/.test(file.html)) errors.push(`${label}: thiếu thời điểm xuất bản`);
  if (!file.html.includes("article-media-credit")) errors.push(`${label}: thiếu ghi nguồn ảnh hiển thị`);
  if (!file.html.includes('/thong-tin-tuyen-tho-mo/')) errors.push(`${label}: chưa tách thông tin tuyển sinh hiện hành khỏi bài sự kiện`);
  if (!file.html.includes('content="Nguyễn Tử Linh"') || !file.html.includes('"publisher":{"@type":"Organization","@id":"https://thaylinhtuyenthomo.vn/#organization"')) {
    errors.push(`${label}: tác giả/nhà xuất bản chưa phân biệt với nguồn TKV`);
  }
}

console.log(JSON.stringify({
  articles: articleFiles.length,
  sourceLedgers: ledger.articles?.length || 0,
  imageLedgers: Object.keys(imageSources).length,
  articlesWithVisibleSource: articleFiles.filter(({html}) => html.includes("<strong>Nguồn:</strong>")).length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 25),
}, null, 2));
if (errors.length) process.exitCode = 1;
