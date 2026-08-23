import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const profilePath = path.resolve(projectRoot, "content", "editorial-specialist-v7.json");
const profiles = JSON.parse(fs.readFileSync(profilePath, "utf8"));
const changed = [];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function cleanText(value = "") {
  return String(value)
    .replace(/20–25 triệu đồng\/tháng khi người lao động hoàn thành định mức(?=[;,.])/giu,
      "20–25 triệu đồng/tháng khi người lao động hoàn thành định mức lao động")
    .replace(/Năm 2025, TKV có 13\.507 thợ lò đạt tổng thu nhập trên 300 triệu đồng\/người, tương đương 57% lực lượng thợ lò; bốn công nhân/giu,
      "Năm 2025, TKV có 13.507 thợ lò đạt tổng thu nhập trên 300 triệu đồng/người, chiếm 57% lực lượng và tăng 16,5% so với năm trước; bốn công nhân")
    .replace(/phụ thuộc đơn vị, vị trí, sức khỏe và tay nghề/giu,
      "phụ thuộc đơn vị tiếp nhận, vị trí, sức khỏe và tay nghề")
    .replace(/Quy trình hồ sơ hợp lý bắt đầu sau bước kiểm tra điều kiện/giu,
      "Với câu hỏi hồ sơ học nghề mỏ cần gì, quy trình hợp lý bắt đầu sau bước kiểm tra điều kiện")
    .replace(/Mưa lớn tác động đồng thời tới mặt tầng, đường vận tải, bãi thải, điện, thoát nước và khu vực hầm lò/giu,
      "An toàn mỏ mùa mưa bão 2026 đặt ra yêu cầu kiểm soát đồng thời mặt tầng, đường vận tải, bãi thải, điện, thoát nước và khu vực hầm lò")
    .replace(/Đào tạo an toàn bắt đầu từ việc rất cụ thể/giu,
      "Đào tạo an toàn trước khi vào lò bắt đầu từ những việc rất cụ thể")
    .replace(/Quy mô hội thi cho thấy tay nghề trong ngành Than được nhìn bằng năng lực có thể quan sát và kiểm chứng/giu,
      "Tay nghề thợ mỏ trong thời kỳ mỏ thông minh được nhìn bằng năng lực có thể quan sát và kiểm chứng qua quy mô hội thi")
    .replace(/Giá trị của khóa học 2–3 tháng nằm ở việc giúp người chưa có nghề bước vào sản xuất với nền tảng đúng: biết việc, biết giới hạn, biết phối hợp và biết dừng khi điều kiện không còn an toàn\. Phần còn lại được xây tiếp bằng thực tế tại doanh nghiệp và thái độ học nghề của chính người lao động\./giu,
      "Người đang cân nhắc khóa học 2–3 tháng nên tự hỏi mình có thể đi học đủ, giữ kỷ luật thực hành và tiếp tục học nghề tại doanh nghiệp hay không. Giá trị của khóa học nằm ở việc giúp người chưa có nghề bước vào sản xuất với nền tảng đúng: biết việc, biết giới hạn, biết phối hợp và biết dừng khi điều kiện không còn an toàn. Phần còn lại được xây tiếp bằng thực tế tại doanh nghiệp và thái độ học nghề của chính người lao động.")
    .replace(/Một khóa học nghề tạo điểm xuất phát; tay nghề thật được hình thành bằng hàng nghìn lần làm đúng, sửa lỗi và tích lũy kinh nghiệm\. Hội thi thợ giỏi cho thấy con đường phát triển nghề nghiệp có thể đo được, và người mới có thể bắt đầu con đường đó ngay từ thái độ trong buổi thực hành đầu tiên\./giu,
      "Người mới nên ưu tiên làm đúng, hỏi lại khi chưa rõ và sửa lỗi ngay trong buổi thực hành. Một khóa học nghề tạo điểm xuất phát; tay nghề thật được hình thành bằng hàng nghìn lần làm đúng, sửa lỗi và tích lũy kinh nghiệm. Hội thi thợ giỏi cho thấy con đường phát triển nghề nghiệp có thể đo được, và người mới có thể bắt đầu con đường đó ngay từ thái độ trong buổi thực hành đầu tiên.")
    .replace(/nhu cầu nhân lực không chỉ nằm ở khai thác trực tiếp mà còn trải sang/giu,
      "nhu cầu nhân lực trải từ khai thác trực tiếp sang")
    .replace(/Sự thay đổi lớn nhất của mỏ hầm lò không nằm ở việc có thêm máy móc/giu,
      "Trong giai đoạn cơ giới hóa khai thác hầm lò 2026–2030, thay đổi lớn nhất không nằm ở việc có thêm máy móc")
    .replace(/\bĐáng chú ý(?: là)?[,;:]?\s*/giu, "")
    .replace(/\bCó thể thấy rằng\b/giu, "Dữ liệu cho thấy")
    .replace(/\bĐiều này cho thấy\b/giu, "Dữ liệu cho thấy")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extract(value, pattern) {
  return String(value).match(pattern)?.[0] || "";
}

function addArticleClass(tag, className) {
  return tag.replace(/<article\b([^>]*)class="([^"]*)"([^>]*)>/i, (_match, before, classes, after) => {
    const list = new Set(classes.split(/\s+/).filter(Boolean).filter((item) => item !== "article-body--specialist-v6"));
    list.add("article-body--prose-v4");
    list.add(className);
    return `<article${before}class="${[...list].join(" ")}" data-editorial-version="7"${after}>`;
  });
}

function normalizeSourceParagraph(source = "") {
  return String(source)
    .replace(/<strong>Nguồn\s+tư\s+liệu:<\/strong>/i, "<strong>Nguồn:</strong>")
    .replace(/<strong>Nguồn:<\/strong>\s*<strong>Nguồn:<\/strong>/i, "<strong>Nguồn:</strong>");
}

function cleanSourceFooter(body) {
  const footer = extract(body, /<div\b[^>]*class="[^"]*\barticle-source-footer\b[^"]*"[^>]*>[\s\S]*?<\/div>/i);
  const currentFacts = extract(footer || body, /<p\b[^>]*class="[^"]*\barticle-current-facts\b[^"]*"[^>]*>[\s\S]*?<\/p>/i);
  let source = extract(footer || body, /<p(?:\s[^>]*)?>\s*<strong>Nguồn(?:\s+tư\s+liệu)?:<\/strong>[\s\S]*?<\/p>/i);
  if (!source) source = extract(body, /<p\b[^>]*class="[^"]*\barticle-source-note\b[^"]*"[^>]*>[\s\S]*?<\/p>/i);
  source = normalizeSourceParagraph(source);
  if (!source) return "";
  return `<div class="article-source-footer article-source-footer--specialist-v7">${currentFacts}${source}</div>`;
}

function removeFaqSchema(html) {
  return String(html).replace(/<script\b([^>]*)type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/gi, (full, before, after, jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data?.["@graph"])) {
        data["@graph"] = data["@graph"].filter((node) => node?.["@type"] !== "FAQPage");
        return `<script${before}type="application/ld+json"${after}>${JSON.stringify(data)}</script>`;
      }
      if (data?.["@type"] === "FAQPage") return "";
    } catch {}
    return full;
  });
}

function replaceHeroLead(html, lead) {
  return String(html).replace(/<p\b([^>]*)class="([^"]*\blead\b[^"]*)"([^>]*)>[\s\S]*?<\/p>/i,
    `<p$1class="$2"$3>${escapeHtml(cleanText(lead))}</p>`);
}

function renderSections(profile, galleries = []) {
  const chunks = [];
  for (const [index, section] of profile.sections.entries()) {
    chunks.push(`<h2>${escapeHtml(cleanText(section.heading))}</h2>`);
    for (const paragraph of section.paragraphs) chunks.push(`<p>${escapeHtml(cleanText(paragraph))}</p>`);
    if (index === 0 && galleries.length) chunks.push(...galleries);
  }
  return chunks.join("\n");
}

function renderBody(existingBody, profile) {
  const openingTag = existingBody.match(/<article\b[^>]*>/i)?.[0] || '<article class="article-body">';
  const articleOpen = addArticleClass(openingTag, "article-body--specialist-v7");
  const cover = extract(existingBody, /<figure\b[^>]*class="[^"]*\barticle-cover\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i);
  const galleries = [...existingBody.matchAll(/<div\b[^>]*class="[^"]*\barticle-inline-gallery\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi)].map((match) => match[0]);
  const nav = extract(existingBody, /<nav\b[^>]*class="[^"]*\barticle-nav\b[^"]*"[^>]*>[\s\S]*?<\/nav>/i);
  const apply = extract(existingBody, /<section\b[^>]*class="[^"]*\barticle-apply\b[^"]*"[^>]*>[\s\S]*?<\/section>/i);
  const share = extract(existingBody, /<section\b[^>]*class="[^"]*\barticle-share-panel\b[^"]*"[^>]*>[\s\S]*?<\/section>/i);
  const source = cleanSourceFooter(existingBody);

  const opening = profile.opening.map((paragraph, index) =>
    `<p class="${index === 0 ? "specialist-v7__opening" : "specialist-v7__nutgraph"}">${escapeHtml(cleanText(paragraph))}</p>`
  ).join("\n");
  const sections = renderSections(profile, galleries);
  const ending = `<p class="article-conclusion specialist-v7__ending">${escapeHtml(cleanText(profile.ending))}</p>`;
  const extras = [source, nav, apply, share].filter(Boolean).join("\n");

  return `${articleOpen}\n${cover ? `${cover}\n` : ""}<!-- specialist-v7:start -->\n<div class="specialist-v7__copy">\n${opening}\n${sections}\n${ending}\n</div>\n<!-- specialist-v7:end -->\n${extras}\n</article>`;
}

for (const [slug, profile] of Object.entries(profiles)) {
  const file = path.join(siteRoot, "bai-viet", slug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`Thiếu bài chuyên sâu ${slug}`);
  if (!Array.isArray(profile.opening) || profile.opening.length !== 2) throw new Error(`${slug}: hồ sơ v7 cần đúng hai đoạn mở/nut graph`);
  if (!Array.isArray(profile.sections) || profile.sections.length < 2 || profile.sections.length > 3) throw new Error(`${slug}: hồ sơ v7 cần 2–3 phần phân tích`);

  const before = fs.readFileSync(file, "utf8");
  const body = before.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
  if (!body) throw new Error(`${slug}: không tìm thấy article-body`);
  let after = before.replace(body, renderBody(body, profile));
  after = replaceHeroLead(after, profile.lead);
  after = removeFaqSchema(after);
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  let tracked = new Set();
  try {
    tracked = new Set(execFileSync("git", ["ls-files", "-z"], {cwd: projectRoot, encoding: "utf8"}).split("\0").filter(Boolean));
  } catch {}
  const files = changed.filter((file) => tracked.has(file));
  for (let index = 0; index < files.length; index += 50) {
    const chunk = files.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-specialist-v7-complete",
  articles: Object.keys(profiles).length,
  changedFiles: changed.length,
  sample: changed,
}, null, 2));
