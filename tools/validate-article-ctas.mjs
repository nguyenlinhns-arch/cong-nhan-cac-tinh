import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const errors = [];

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name === "index.html") output.push(full);
  }
  return output;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] || "";
}

const articleFiles = walk(path.join(root, "tin-nganh-than"));
let asideCount = 0;
let applicationAsideCount = 0;
let readAsideCount = 0;
let zaloAsideCount = 0;

for (const file of articleFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  for (const match of html.matchAll(/<div class="aside-card accent">[\s\S]*?<a\b([^>]*)>([\s\S]*?)<\/a>[\s\S]*?<\/div>/g)) {
    asideCount += 1;
    const attrs = match[1];
    const href = attr(attrs, "href");
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    const action = attr(attrs, "data-article-aside-action");
    const contact = attr(attrs, "data-contact");
    if (!action) errors.push(`${relative}: aside CTA thiếu data-article-aside-action`);
    if (!attr(attrs, "data-context")) errors.push(`${relative}: aside CTA thiếu data-context`);
    if (/Đọc thêm|Xem lộ trình|Tìm hiểu chương trình/.test(text) && /^https:\/\/zalo\.me\//.test(href)) {
      errors.push(`${relative}: CTA "${text}" không được trỏ sang Zalo`);
    }
    if (text.includes("Đọc thêm chuyện nghề mỏ") && !href.startsWith("/tin-nganh-than/")) {
      errors.push(`${relative}: CTA đọc thêm phải mở chuyên mục Tin ngành Than`);
    }
    if (text.includes("Xem lộ trình học nghề") && href !== "/bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/") {
      errors.push(`${relative}: CTA lộ trình học nghề phải mở bài học 2-3 tháng`);
    }
    if (contact === "application") {
      applicationAsideCount += 1;
      for (const key of ["utm_source=website", "utm_medium=internal", "utm_campaign=article_aside_to_application_2026", "utm_content=aside_"]) {
        if (!href.includes(key)) errors.push(`${relative}: CTA ứng tuyển thiếu ${key}`);
      }
      if (!href.endsWith("#dang-ky")) errors.push(`${relative}: CTA ứng tuyển phải trỏ tới biểu mẫu`);
    } else if (contact === "zalo") {
      zaloAsideCount += 1;
      if (href !== "https://zalo.me/0963048585") errors.push(`${relative}: CTA Zalo sai đường dẫn`);
      if (!attrs.includes('target="_blank"') || !attrs.includes('rel="noopener noreferrer"')) {
        errors.push(`${relative}: CTA Zalo thiếu target/rel an toàn`);
      }
    } else if (action === "read") {
      readAsideCount += 1;
      if (!href.startsWith("/")) errors.push(`${relative}: CTA đọc thêm phải là liên kết nội bộ`);
    }
  }
}

if (asideCount < 30) errors.push(`Số CTA cạnh bài thấp bất thường: ${asideCount}`);
if (!applicationAsideCount) errors.push("Chưa có CTA cạnh bài nào trỏ về biểu mẫu ứng tuyển");
if (!readAsideCount) errors.push("Chưa có CTA cạnh bài nào trỏ về nội dung đọc thêm");
if (!zaloAsideCount) errors.push("Chưa có CTA cạnh bài nào trỏ Zalo đúng ngữ cảnh hỏi trực tiếp");

console.log(JSON.stringify({
  article_files: articleFiles.length,
  aside_ctas: asideCount,
  application_aside_ctas: applicationAsideCount,
  read_aside_ctas: readAsideCount,
  zalo_aside_ctas: zaloAsideCount,
  errors,
}, null, 2));

if (errors.length) process.exitCode = 1;
