import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const changed = [];

const bannedOpening = /^(?:bài(?:\s+viết|\s+nguồn|\s+báo)?|nguồn|website|fanpage|thông tin từ)\b[^.!?]{0,180}\b(?:đăng|đăng tải|công bố|cho biết|nêu|ghi nhận|đề cập|thông tin)\b/iu;
const sourceNarration = /(?:bài\s+(?:viết|nguồn|báo|gốc)|nguồn(?:\s+chính\s+thức)?|website|fanpage)[^.!?]{0,100}\b(?:cho biết|cho thấy|nêu|ghi nhận|đề cập|mô tả|công bố|đăng tải)\b/iu;
const seoNarration = /(?:tìm hiểu thêm về|với từ khóa|người đọc vì thế tìm thấy|bài viết chuẩn seo|tối ưu seo)/iu;

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
    .replace(/&amp;/gi, "&")
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
    .replace(/Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)\s*/gi, "")
    .replace(/\bNguồn cho biết(?: rằng)?\s+/gi, "")
    .replace(/\bTheo nguồn,?\s+/gi, "")
    .replace(/\bĐáng chú ý(?: là)?[,;:]?\s*/gi, "")
    .replace(/\bCó thể thấy rằng\b/gi, "Dữ liệu cho thấy")
    .replace(/\bĐiều này cho thấy\b/gi, "Dữ liệu cho thấy")
    .replace(/\bĐiều đó cho thấy\b/gi, "Điều đó phản ánh")
    .replace(/\bTrong bối cảnh đó\b/gi, "Từ thực tế này")
    .replace(/\bĐối với người lao động\b/gi, "Với người lao động")
    .replace(/\bĐiều quan trọng là\b/gi, "Điểm cần lưu ý là")
    .replace(/\bNội dung này cho thấy\b/gi, "Dữ liệu cho thấy")
    .replace(/\bBài viết này nhằm\b/gi, "Bài viết giúp")
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
    .replace(/<p\b[^>]*class="[^"]*(?:article-seo-line|keyword-summary)[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/<p\b[^>]*class="[^"]*article-editor-note[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, body) => {
      const text = visible(body);
      return seoNarration.test(text) ? "" : full;
    });
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

function genreFor(relative, html) {
  const title = key(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  if (/cau chuyen|guong|nguoi tho|hanh trinh|doi tho|thoi tho/.test(title)) return "feature";
  if (relative.startsWith("bai-viet/")) return "analysis";
  return "news";
}

function addClass(html, selector, className) {
  if (selector === "body") {
    if (/<body\b[^>]*class=/i.test(html)) {
      return html.replace(/<body\b([^>]*)class="([^"]*)"([^>]*)>/i, (_match, before, classes, after) => {
        const all = new Set(classes.split(/\s+/).filter(Boolean));
        all.add(className);
        return `<body${before}class="${[...all].join(" ")}"${after}>`;
      });
    }
    return html.replace(/<body\b([^>]*)>/i, `<body class="${className}"$1>`);
  }
  if (selector === "article") {
    return html.replace(/<article\b([^>]*)class="([^"]*\barticle-body\b[^"]*)"([^>]*)>/i, (_match, before, classes, after) => {
      const all = new Set(classes.split(/\s+/).filter(Boolean));
      all.add(className);
      return `<article${before}class="${[...all].join(" ")}"${after}>`;
    });
  }
  return html;
}

function addByline(html, genre) {
  if (html.includes('class="article-byline"')) return html;
  const role = genre === "news" ? "Biên tập và kiểm chứng nguồn" : genre === "feature" ? "Biên tập câu chuyện và kiểm chứng nguồn" : "Phân tích và chịu trách nhiệm nội dung";
  const byline = `<p class="article-byline"><a href="/tac-gia/nguyen-tu-linh/">Nguyễn Tử Linh</a><span>${role}</span></p>`;
  if (/<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>[\s\S]*?<\/p>/i.test(html)) {
    return html.replace(/(<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>[\s\S]*?<\/p>)/i, `$1${byline}`);
  }
  return html;
}

function addGenreLabel(html, genre) {
  if (html.includes('class="article-genre-label"')) return html;
  const label = genre === "news" ? "TIN TỨC · DỮ KIỆN VÀ BỐI CẢNH" : genre === "feature" ? "CHUYỆN NGƯỜI THỢ · NHÂN VẬT VÀ TRẢI NGHIỆM" : "PHÂN TÍCH · THÔNG TIN CHO NGƯỜI LAO ĐỘNG";
  const marker = `<p class="article-genre-label">${label}</p>`;
  return html.replace(/(<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>\s*(?:<figure\b[\s\S]*?<\/figure>\s*)?)/i, `$1${marker}`);
}

function normalizeSource(html) {
  let output = html.replace(/<strong>Nguồn tư liệu:<\/strong>/gi, "<strong>Nguồn:</strong>");
  output = output.replace(/<p class="article-source-note">([\s\S]*?)<\/p>/gi, (full, body) => {
    if (/Nguyễn Tử Linh[^<]{0,100}(?:biên tập|kiểm chứng)/iu.test(visible(body))) return full;
    return `<p class="article-source-note">${body}<span class="article-source-responsibility"> Nguyễn Tử Linh biên tập và kiểm chứng nguồn.</span></p>`;
  });
  output = output.replace(/<p>(\s*<strong>Nguồn:<\/strong>[\s\S]*?)<\/p>/gi, (full, body) => {
    if (/Nguyễn Tử Linh[^<]{0,100}(?:biên tập|kiểm chứng)/iu.test(visible(body))) return full;
    return `<p>${body}<span class="article-source-responsibility"> Nguyễn Tử Linh biên tập và kiểm chứng nguồn.</span></p>`;
  });
  return output;
}

function normalizeCallsToAction(html) {
  return mapOutsideScripts(html, (part) => part
    .replace(/>Ứng tuyển ngay</gi, ">Kiểm tra điều kiện<")
    .replace(/>Đăng ký ngay</gi, ">Gửi thông tin để được hướng dẫn<")
    .replace(/LAN TỎA THÔNG TIN ĐÚNG NGUỒN/gi, "CHIA SẺ BÀI VIẾT")
    .replace(/Tìm hiểu chương trình ngay/gi, "Xem thông tin đang áp dụng"));
}

function addStylesheet(html) {
  if (html.includes('/editorial-newsroom.css?v=1')) return html;
  return html.replace(/<\/head>/i, '  <link rel="stylesheet" href="/editorial-newsroom.css?v=1">\n</head>');
}

function polishArticle(file) {
  const relative = path.relative(siteRoot, file).split(path.sep).join("/");
  const before = fs.readFileSync(file, "utf8");
  if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(before)) return;
  if (!/<article\b[^>]*class="[^"]*\barticle-body\b/i.test(before)) return;
  const genre = genreFor(relative, before);
  let html = before;
  html = addStylesheet(html);
  html = addClass(html, "body", "editorial-authority-page");
  html = addClass(html, "article", `article-body--${genre}`);
  html = polishLanguage(html);
  html = dropSourceNarrationLead(html);
  html = removeSeoResidue(html);
  html = dedupeParagraphs(html);
  html = addByline(html, genre);
  html = addGenreLabel(html, genre);
  html = normalizeSource(html);
  html = normalizeCallsToAction(html);
  if (html === before) return;
  fs.writeFileSync(file, html);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

for (const directory of ["tin-nganh-than", "bai-viet"]) {
  for (const file of walk(path.join(siteRoot, directory))) polishArticle(file);
}

for (const file of walk(path.join(siteRoot, "giai-dap-nghe-mo"))) {
  const before = fs.readFileSync(file, "utf8");
  if (!before.includes("daily-seo-page") || !before.includes('"@type":"Article"')) continue;
  let html = addStylesheet(before);
  html = addClass(html, "body", "editorial-authority-page");
  html = polishLanguage(html);
  html = normalizeCallsToAction(html);
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
  status: "editorial-authority-pass-complete",
  changedFiles: changed.length,
  sample: changed.slice(0, 20),
}, null, 2));
