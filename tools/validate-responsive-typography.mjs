import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.name.startsWith(".")) return [];
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const htmlFiles = walk(root)
  .filter((file) => file.endsWith(".html"))
  .filter((file) => !/^google[a-z0-9_-]+\.html$/i.test(path.basename(file)));

for (const file of htmlFiles) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  if (!/<meta\s+charset=["']utf-8["']/i.test(html)) errors.push(`${relative}: thiếu UTF-8`);
  if (!/<meta[^>]+name=["']viewport["'][^>]+width=device-width/i.test(html)) errors.push(`${relative}: thiếu viewport responsive`);
  if (html.includes("\uFFFD") || /(?:Ã|Â|Æ)[\u0080-\u00BF]|á[\u00BA\u00BB][\u0080-\u00BF]/.test(html)) errors.push(`${relative}: có dấu hiệu lỗi mã hóa tiếng Việt`);
  if (html !== html.normalize("NFC")) errors.push(`${relative}: văn bản chưa được chuẩn hóa Unicode NFC`);

  const fontLinks = [...html.matchAll(/<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["'][^>]*>/gi)];
  const fontLink = fontLinks.find((match) => match[1] === "/fonts.css?v=2");
  if (!fontLink) errors.push(`${relative}: thiếu /fonts.css?v=2`);
  else if (fontLink !== fontLinks.at(-1)) errors.push(`${relative}: fonts.css phải là stylesheet cuối để chặn CSS cũ ghi đè`);
}

const fontCss = fs.readFileSync(path.join(root, "fonts.css"), "utf8");
for (const marker of [
  '--site-font-sans:"Be Vietnam Pro",Arial,"Segoe UI",Tahoma,sans-serif',
  "body{font-family:var(--site-font-sans)",
  ":where(h1,h2,h3,h4,h5,h6){line-height:1.25",
  "input,select,textarea{font-size:16px}",
]) {
  if (!fontCss.includes(marker)) errors.push(`fonts.css: thiếu ${marker}`);
}

const articleCss = fs.readFileSync(path.join(root, "article-insights.css"), "utf8");
const articleParagraphRule = articleCss.match(/\.article-body--journalistic-v2 \.professional-news-copy p\{([^}]*)\}/)?.[1] || "";
if (!articleParagraphRule.includes("font-family:inherit")) errors.push("article-insights.css: thân bài chưa kế thừa font tiếng Việt dùng chung");
if (/Georgia|Times New Roman|serif/i.test(articleParagraphRule)) errors.push("article-insights.css: thân bài vẫn còn font serif gây tách dấu");

console.log(JSON.stringify({
  html: htmlFiles.length,
  font_links: htmlFiles.length - errors.filter((error) => error.includes("thiếu /fonts.css")).length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 30),
}, null, 2));

if (errors.length) process.exitCode = 1;
