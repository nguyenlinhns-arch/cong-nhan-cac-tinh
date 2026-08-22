import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const changed = [];

const bannedOpening = /^(?:bài(?:\s+viết|\s+nguồn|\s+báo)?|nguồn|website|fanpage|thông\s+tin\s+từ)\b[^.!?]{0,180}\b(?:đăng|đăng\s+tải|công\s+bố|cho\s+biết|nêu|ghi\s+nhận|đề\s+cập|thông\s+tin)\b/iu;
const sourceNarration = /(?:bài\s+(?:viết|nguồn|báo|gốc)|nguồn(?:\s+chính\s+thức)?|website|fanpage)[^.!?]{0,100}\b(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|đề\s+cập|mô\s+tả|công\s+bố|đăng\s+tải)\b/iu;
const seoNarration = /(?:tìm\s+hiểu\s+thêm\s+về|với\s+từ\s+khóa|người\s+đọc\s+vì\s+thế\s+tìm\s+thấy|bài\s+viết\s+chuẩn\s+seo|tối\s+ưu\s+seo)/iu;
const explainerSlugs = new Set([
  "dieu-kien-tuyen-tho-lo-2026",
  "ho-so-hoc-nghe-mo-can-gi",
  "hoc-nghe-khai-thac-mo-2-3-thang",
  "dao-tao-an-toan-truoc-khi-vao-lo",
  "hoc-thuc-hanh-nghe-mo-ham-lo",
]);

const genreConfig = {
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
  return visible(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapOutsideScripts(html, transform) {
  return String(html).split(/(<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>)/gi)
    .map((part) => /^<(?:script|style)\b/i.test(part) ? part : transform(part))
    .join("");
}

function polishLanguage(html) {
  return mapOutsideScripts(html, (part) => part
    .replace(/Bài\s+nguồn\s+ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)\s*/gi, "")
    .replace(/\bNguồn\s+cho\s+biết(?:\s+rằng)?\s+/gi, "")
    .replace(/\bTheo\s+nguồn,?\s+/gi, "")
    .replace(/\bĐáng\s+chú\s+ý(?:\s+là)?[,;:]?\s*/gi, "")
    .replace(/\bCó\s+thể\s+thấy\s+rằng\b/gi, "Dữ liệu cho thấy")
    .replace(/\bĐiều\s+này\s+cho\s+thấy\b/gi, "Dữ liệu cho thấy")
    .replace(/\bĐiều\s+đó\s+cho\s+thấy\b/gi, "Điều đó phản ánh")
    .replace(/\bTrong\s+bối\s+cảnh\s+đó\b/gi, "Từ thực tế này")
    .replace(/\bĐối\s+với\s+người\s+lao\s+động\b/gi, "Với người lao động")
    .replace(/\bĐiều\s+quan\s+trọng\s+là\b/gi, "Điểm cần lưu ý là")
    .replace(/\bNội\s+dung\s+này\s+cho\s+thấy\b/gi, "Dữ liệu cho thấy")
    .replace(/\bBài\s+viết\s+này\s+nhằm\b/gi, "Bài viết giúp")
    .replace(/\s{2,}/g, " "));
}

function dropSourceNarrationLead(html) {
  return html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, body) => {
    if (/lead|article-source|byline|eyebrow|editor-note|seo-line|keyword-summary/i.test(attrs)) return full;
    const text = visible(body);
    if (text.length < 120 || !sourceNarration.test(text)) return full;
    const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean);
    if (sentences.length < 2 || !bannedOpening.test(sentences[0])) return full;
    const remaining = sentences.slice(1).join(" ").trim();
    if (remaining.split(/\s+/u).length < 18) return full;
    return `<p${attrs}>${remaining}</p>`;
  });
}

function removeSeoResidue(html) {
  return html
    .replace(/<p\b[^>]*class="[^"]*(?:article-seo-line|keyword-summary|article-editor-note)[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, _attrs, body) => seoNarration.test(visible(body)) ? "" : full);
}

function dedupeParagraphs(html) {
  const seen = new Set();
  return html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, body) => {
    if (/lead|byline|source|eyebrow|date|takeaway|share|status/i.test(attrs)) return full;
    const text = visible(body);
    if (text.length < 100) return full;
    const normalized = key(text);
    if (!normalized || seen.has(normalized)) return "";
    seen.add(normalized);
    return full;
  });
}

function genreFor(relative) {
  const slug = relative.split("/").filter(Boolean).at(-2) || "";
  if (relative.startsWith("chuyen-nguoi-tho/")) return "feature";
  if (relative.startsWith("bai-viet/") && explainerSlugs.has(slug)) return "explainer";
  if (relative.startsWith("bai-viet/")) return "analysis";
  return "news";
}

function addBodyClass(html, className) {
  if (/<body\b[^>]*class=/i.test(html)) {
    return html.replace(/<body\b([^>]*)class="([^"]*)"([^>]*)>/i, (_match, before, classes, after) => {
      const all = new Set(classes.split(/\s+/).filter(Boolean));
      all.add(className);
      return `<body${before}class="${[...all].join(" ")}"${after}>`;
    });
  }
  return html.replace(/<body\b([^>]*)>/i, `<body class="${className}"$1>`);
}

function setArticleGenreClass(html, genre) {
  return html.replace(/<article\b([^>]*)class="([^"]*\barticle-body\b[^"]*)"([^>]*)>/i, (_match, before, classes, after) => {
    const kept = classes.split(/\s+/).filter((className) => className && !/^article-body--(?:news|analysis|feature|explainer)$/u.test(className));
    kept.push(`article-body--${genre}`);
    return `<article${before}class="${[...new Set(kept)].join(" ")}"${after}>`;
  });
}

function upsertByline(html, genre) {
  const role = genreConfig[genre].role;
  const byline = `<p class="article-byline"><a href="/tac-gia/nguyen-tu-linh/">Nguyễn Tử Linh</a><span>${role}</span></p>`;
  if (/<p\b[^>]*class="[^"]*\barticle-byline\b[^"]*"[^>]*>[\s\S]*?<\/p>/i.test(html)) {
    return html.replace(/<p\b[^>]*class="[^"]*\barticle-byline\b[^"]*"[^>]*>[\s\S]*?<\/p>/i, byline);
  }
  if (/<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>[\s\S]*?<\/p>/i.test(html)) {
    return html.replace(/(<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>[\s\S]*?<\/p>)/i, `$1${byline}`);
  }
  return html;
}

function upsertGenreLabel(html, genre) {
  const marker = `<p class="article-genre-label">${genreConfig[genre].label}</p>`;
  if (/<p\b[^>]*class="[^"]*\barticle-genre-label\b[^"]*"[^>]*>[\s\S]*?<\/p>/i.test(html)) {
    return html.replace(/<p\b[^>]*class="[^"]*\barticle-genre-label\b[^"]*"[^>]*>[\s\S]*?<\/p>/i, marker);
  }
  return html.replace(/(<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>\s*(?:<figure\b[\s\S]*?<\/figure>\s*)?)/i, `$1${marker}`);
}

function normalizeSource(html) {
  const responsibility = "Nguyễn Tử Linh biên tập, đối chiếu và chịu trách nhiệm nội dung.";
  let output = html.replace(/<strong>Nguồn\s+tư\s+liệu:<\/strong>/gi, "<strong>Nguồn:</strong>");
  output = output.replace(/<span\b[^>]*class="[^"]*\barticle-source-responsibility\b[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
    `<span class="article-source-responsibility"> ${responsibility}</span>`);
  output = output.replace(/<p class="article-source-note">([\s\S]*?)<\/p>/gi, (full, body) => {
    if (/article-source-responsibility/i.test(body)) return full;
    return `<p class="article-source-note">${body}<span class="article-source-responsibility"> ${responsibility}</span></p>`;
  });
  output = output.replace(/<p>(\s*<strong>Nguồn:<\/strong>[\s\S]*?)<\/p>/gi, (full, body) => {
    if (/article-source-responsibility/i.test(body)) return full;
    return `<p>${body}<span class="article-source-responsibility"> ${responsibility}</span></p>`;
  });
  return output;
}

function normalizeCallsToAction(html) {
  return mapOutsideScripts(html, (part) => part
    .replace(/>Ứng\s+tuyển\s+ngay</gi, ">Kiểm tra điều kiện<")
    .replace(/>Đăng\s+ký\s+ngay</gi, ">Gửi thông tin để được hướng dẫn<")
    .replace(/LAN\s+TỎA\s+THÔNG\s+TIN\s+ĐÚNG\s+NGUỒN/gi, "CHIA SẺ BÀI VIẾT")
    .replace(/Tìm\s+hiểu\s+chương\s+trình\s+ngay/gi, "Xem thông tin đang áp dụng"));
}

function addStylesheet(html, href) {
  if (html.includes(href)) return html;
  return html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${href}">\n</head>`);
}

function normalizeDailyResponsibility(html) {
  return html
    .replace(/Nguyễn\s+Tử\s+Linh\s+biên\s+soạn/giu, "Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung")
    .replace(/Nguyễn\s+Tử\s+Linh\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung(?:\s*·\s*Biên\s+tập\s+và\s+chịu\s+trách\s+nhiệm\s+nội\s+dung)+/giu,
      "Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung");
}

function polishArticle(file) {
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  const before = fs.readFileSync(file, "utf8");
  if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(before)) return;
  if (!/<article\b[^>]*class="[^"]*\barticle-body\b/i.test(before)) return;
  const genre = genreFor(relative);
  let html = before;
  html = addStylesheet(html, "/editorial-newsroom.css?v=1");
  html = addStylesheet(html, "/editorial-prose-v4.css?v=1");
  html = addBodyClass(html, "editorial-authority-page");
  html = setArticleGenreClass(html, genre);
  html = polishLanguage(html);
  html = dropSourceNarrationLead(html);
  html = removeSeoResidue(html);
  html = dedupeParagraphs(html);
  html = upsertByline(html, genre);
  html = upsertGenreLabel(html, genre);
  html = normalizeSource(html);
  html = normalizeCallsToAction(html);
  if (html === before) return;
  fs.writeFileSync(file, html);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

for (const directory of ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"]) {
  for (const file of walk(path.join(siteRoot, directory))) polishArticle(file);
}

for (const file of walk(path.join(siteRoot, "giai-dap-nghe-mo"))) {
  const before = fs.readFileSync(file, "utf8");
  if (!before.includes("daily-seo-page") || !before.includes('"@type":"Article"')) continue;
  let html = addStylesheet(before, "/editorial-newsroom.css?v=1");
  html = addStylesheet(html, "/editorial-prose-v4.css?v=1");
  html = addBodyClass(html, "editorial-authority-page");
  html = polishLanguage(html);
  html = removeSeoResidue(html);
  html = normalizeCallsToAction(html);
  html = normalizeDailyResponsibility(html);
  if (html === before) continue;
  fs.writeFileSync(file, html);
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
  status: "editorial-authority-pass-v4-complete",
  changedFiles: changed.length,
  sample: changed.slice(0, 20),
}, null, 2));
