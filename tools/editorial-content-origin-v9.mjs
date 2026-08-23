import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const cssHref = "/editorial-content-origin-v9.css?v=1";
const policyHref = "/nguyen-tac-bien-tap/#phan-loai-nguon";
const changed = [];
const stats = {
  firstHand: 0,
  sourcedEditorial: 0,
  expertExplainer: 0,
  currentExplainer: 0,
  currentPolicyMeta: 0,
  navLinked: 0,
};

const notes = {
  firsthand: {
    label: "Tư liệu trực tiếp",
    text: "Bài viết được dựng từ video, hình ảnh, ghi chép chuyến công tác hoặc dữ liệu thực địa do Thầy Linh – Tuyển Thợ Mỏ trực tiếp ghi nhận. Không dựng lời nhân vật và không thêm chi tiết ngoài tư liệu có thể đối chiếu.",
  },
  "sourced-editorial": {
    label: "Biên tập từ nguồn",
    text: "Dữ kiện, nhân vật và bối cảnh được đối chiếu với nguồn công khai nêu cuối bài. Phần diễn giải được viết lại để dễ đọc nhưng không biến dữ kiện lịch sử thành chính sách tuyển sinh hiện hành.",
  },
  "expert-explainer": {
    label: "Giải thích chuyên môn",
    text: "Bài phân tích hoặc giải thích nghề mỏ được xây dựng từ tài liệu chuyên môn, dữ kiện ngành và nguồn tuyển sinh liên quan; kết luận chỉ có giá trị trong phạm vi điều kiện nêu trong bài.",
  },
  "current-explainer": {
    label: "Giải đáp hiện hành",
    text: "Câu trả lời ưu tiên dữ kiện tuyển sinh đang áp dụng. Khi chuẩn bị hồ sơ hoặc di chuyển, người đọc nên đối chiếu ngày cập nhật và lịch tiếp nhận mới nhất.",
  },
};

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function indexable(html) {
  return !/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
    && !/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html);
}

function ensureMeta(html, name, value) {
  const pattern = new RegExp(`<meta\\b[^>]*name=["']${name}["'][^>]*>`, "i");
  const tag = `<meta name="${name}" content="${value}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `${tag}\n</head>`);
}

function ensureCss(html) {
  if (html.includes(cssHref)) return html;
  return html.replace("</head>", `<link rel="stylesheet" href="${cssHref}">\n</head>`);
}

function setHtmlOrigin(html, origin) {
  if (/data-content-origin=["'][^"']+["']/i.test(html)) {
    return html.replace(/data-content-origin=["'][^"']+["']/i, `data-content-origin="${origin}"`);
  }
  return html.replace(/<html\b/i, `<html data-content-origin="${origin}"`);
}

function stripManaged(html) {
  return html.replace(/\s*<!-- editorial-origin-v9:start -->[\s\S]*?<!-- editorial-origin-v9:end -->\s*/gi, "\n");
}

function renderNote(origin) {
  const note = notes[origin];
  if (!note) return "";
  return `<!-- editorial-origin-v9:start -->\n<div class="article-origin-v9 article-origin-v9--${origin}" role="note" data-content-origin-note="${origin}"><strong>${note.label}</strong><span>${note.text}</span><a href="${policyHref}">Cách kiểm chứng →</a></div>\n<!-- editorial-origin-v9:end -->`;
}

function insertNote(html, origin) {
  const note = renderNote(origin);
  if (!note) return html;
  let next = stripManaged(html);
  const byline = next.match(/<p\b[^>]*class=["'][^"']*\barticle-byline\b[^"']*["'][^>]*>[\s\S]*?<\/p>/i);
  if (byline?.[0]) return next.replace(byline[0], `${byline[0]}\n${note}`);
  const meta = next.match(/<p\b[^>]*class=["'][^"']*\barticle-meta\b[^"']*["'][^>]*>[\s\S]*?<\/p>/i);
  if (meta?.[0]) return next.replace(meta[0], `${meta[0]}\n${note}`);
  const articleOpen = next.match(/<article\b[^>]*class=["'][^"']*(?:article-body|daily-seo-article)[^"']*["'][^>]*>/i);
  if (articleOpen?.[0]) return next.replace(articleOpen[0], `${articleOpen[0]}\n${note}`);
  return next;
}

function classifyArticle(rel, html) {
  if (/^phong-su\/[^/]+\/index\.html$/i.test(rel)) return "firsthand";
  if (/^tin-nganh-than\/20\d{2}\//i.test(rel)) return "sourced-editorial";
  if (/^bai-viet\/[^/]+\/index\.html$/i.test(rel)) return "expert-explainer";
  if (/^giai-dap-nghe-mo\/[^/]+\/index\.html$/i.test(rel) && rel !== "giai-dap-nghe-mo/index.html") return "current-explainer";
  if (html.includes('data-editorial-original="field-report-v8"') && rel.startsWith("phong-su/")) return "firsthand";
  return "";
}

function classifyCore(rel) {
  if ([
    "index.html",
    "thong-tin-tuyen-tho-mo/index.html",
    "kiem-tra-dieu-kien/index.html",
    "hoc-nghe-mo-tai-quang-ninh/index.html",
    "ho-so-nhap-hoc/index.html",
    "thu-nhap-an-o-ho-tro/index.html",
    "nghe-mo-ham-lo/index.html",
    "viec-lam-nganh-than/index.html",
  ].includes(rel)) return "current-recruitment-policy";
  if (/^viec-lam\/[^/]+\/index\.html$/i.test(rel)) return "current-recruitment-policy";
  if (/^viec-lam-nganh-than\/[^/]+\/index\.html$/i.test(rel)) return "current-recruitment-context";
  return "";
}

function addFieldReportNav(html) {
  if (!html.includes("network-nav") || html.includes('href="/phong-su/">Phóng sự</a>')) return html;
  if (html.includes('<a href="/chuyen-nguoi-tho/">Người thợ</a>')) {
    stats.navLinked += 1;
    return html.replace('<a href="/chuyen-nguoi-tho/">Người thợ</a>', '<a href="/chuyen-nguoi-tho/">Người thợ</a><a href="/phong-su/">Phóng sự</a>');
  }
  return html;
}

for (const file of walk(root)) {
  const rel = relative(file);
  if (rel.startsWith("nhap-hoc/") || /^google[^/]*\.html$/i.test(rel)) continue;
  const before = fs.readFileSync(file, "utf8");
  if (!indexable(before)) continue;
  let after = addFieldReportNav(before);
  const articleOrigin = classifyArticle(rel, after);
  const coreOrigin = classifyCore(rel);
  const origin = articleOrigin || coreOrigin;
  if (!origin) {
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed.push(rel);
    }
    continue;
  }

  after = ensureMeta(after, "content-origin", origin);
  after = setHtmlOrigin(after, origin);
  if (articleOrigin) {
    after = ensureCss(after);
    after = insertNote(after, articleOrigin);
    if (articleOrigin === "firsthand") stats.firstHand += 1;
    if (articleOrigin === "sourced-editorial") stats.sourcedEditorial += 1;
    if (articleOrigin === "expert-explainer") stats.expertExplainer += 1;
    if (articleOrigin === "current-explainer") stats.currentExplainer += 1;
  } else {
    stats.currentPolicyMeta += 1;
  }

  if (after !== before) {
    fs.writeFileSync(file, after);
    changed.push(rel);
  }
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 150) {
    const batch = changed.slice(index, index + 150).map((item) => `tuyen-tho-mo/${item}`);
    try {
      execFileSync("git", ["update-index", "--assume-unchanged", "--", ...batch], {cwd: process.cwd(), stdio: "ignore"});
    } catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-content-origin-v9-ready",
  changedFiles: changed.length,
  ...stats,
  policy: policyHref,
}, null, 2));
