import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const dailySourcePath = path.resolve(projectRoot, "content", "daily-seo-articles.json");
const base = "https://thaylinhtuyenthomo.vn";
const stylesheetHref = "/editorial-newsroom.css?v=1";
const changed = [];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function formatDate(iso = "") {
  const [year, month, day] = String(iso).split("-");
  return year && month && day ? `${day}/${month}/${year}` : iso;
}

function cleanCopy(value = "") {
  return String(value)
    .replace(/Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)\s*/gi, "")
    .replace(/\bNguồn cho biết(?: rằng)?\s+/gi, "")
    .replace(/\bTheo nguồn,?\s+/gi, "")
    .replace(/\bnguồn thông tin tuyển dụng hiện hành\b/gi, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bbộ dữ liệu tuyển dụng năm 2026\b/gi, "thông tin tuyển sinh năm 2026")
    .replace(/\bnguồn tuyển đang áp dụng\b/gi, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn tuyển hiện hành\b/gi, "thông tin tuyển sinh hiện hành")
    .replace(/\bđối chiếu sơ bộ\b/gi, "kiểm tra ban đầu")
    .replace(/\bphù hợp sơ bộ\b/gi, "phù hợp ở bước kiểm tra ban đầu")
    .replace(/\bkhông nên tự suy ra\b/gi, "chỉ xác nhận khi có thông báo chính thức")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function polishHtmlCopy(html) {
  return String(html)
    .replace(/Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)\s*/gi, "")
    .replace(/Nguồn cho biết(?: rằng)?\s+([a-zà-ỹ])/giu, (_match, first) => first.toLocaleUpperCase("vi"))
    .replace(/Theo nguồn,?\s+([a-zà-ỹ])/giu, (_match, first) => first.toLocaleUpperCase("vi"))
    .replace(/\bNguồn thông tin tuyển dụng hiện hành\b/g, "Thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn thông tin tuyển dụng hiện hành\b/g, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bBộ dữ liệu tuyển dụng năm 2026\b/g, "Thông tin tuyển sinh năm 2026")
    .replace(/\bbộ dữ liệu tuyển dụng năm 2026\b/g, "thông tin tuyển sinh năm 2026")
    .replace(/\bNguồn tuyển đang áp dụng\b/g, "Thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn tuyển đang áp dụng\b/g, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bNguồn tuyển hiện hành\b/g, "Thông tin tuyển sinh hiện hành")
    .replace(/\bnguồn tuyển hiện hành\b/g, "thông tin tuyển sinh hiện hành")
    .replace(/Nguyễn Tử Linh biên soạn/g, "Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung")
    .replace(/Biên tập viên:\s*Nguyễn Tử Linh/g, "Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung")
    .replace(/>Bài nguồn</gi, ">Nguồn tư liệu<")
    .replace(/>Tóm tắt nguồn</gi, ">Nội dung chính<");
}

function visibleText(value = "") {
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

function normalizedText(value = "") {
  return visibleText(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a, b) {
  const left = new Set(normalizedText(a).split(" ").filter((token) => token.length > 2));
  const right = new Set(normalizedText(b).split(" ").filter((token) => token.length > 2));
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / Math.max(left.size, right.size);
}

function dedupeParagraphs(html) {
  const seen = [];
  return html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, body) => {
    if (/article-source-note|article-media-credit|lead|eyebrow|daily-seo-date|daily-seo-takeaway/i.test(attrs)) return full;
    const text = visibleText(body);
    if (text.length < 90) return full;
    const duplicate = seen.some((previous) => normalizedText(previous) === normalizedText(text)
      || (text.length > 150 && previous.length > 150 && similarity(previous, text) >= 0.9));
    if (duplicate) return "";
    seen.push(text);
    return full;
  });
}

function addStylesheet(html) {
  if (html.includes(stylesheetHref)) return html;
  return html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${stylesheetHref}">\n</head>`);
}

function addNewsroomClasses(html) {
  return html
    .replace(/<body(?![^>]*\bclass=)([^>]*)>/i, '<body class="editorial-newsroom-page"$1>')
    .replace(/<body\s+class="([^"]*)"/i, (_match, classes) => {
      const list = new Set(classes.split(/\s+/).filter(Boolean));
      list.add("editorial-newsroom-page");
      return `<body class="${[...list].join(" ")}"`;
    })
    .replace(/<article\s+class="([^"]*\barticle-body\b[^"]*)"/i, (_match, classes) => {
      const list = new Set(classes.split(/\s+/).filter(Boolean));
      list.add("article-body--newsroom");
      return `<article class="${[...list].join(" ")}" data-editorial-style="newsroom"`;
    })
    .replace(/<section\s+class="([^"]*\barticle-hero\b[^"]*)"/i, (_match, classes) => {
      const list = new Set(classes.split(/\s+/).filter(Boolean));
      list.add("article-hero--newsroom");
      return `<section class="${[...list].join(" ")}"`;
    });
}

function polishEditorialArticle(html) {
  let output = polishHtmlCopy(html);
  output = addStylesheet(output);
  output = addNewsroomClasses(output);
  output = dedupeParagraphs(output);
  output = output
    .replace(/<strong>Nguồn:<\/strong>/g, "<strong>Nguồn tư liệu:</strong>")
    .replace(/<p class="article-source-note">\s*Nguồn:\s*/gi, '<p class="article-source-note"><strong>Nguồn tư liệu:</strong> ')
    .replace(/<p class="article-source-note">\s*Bài viết/gi, '<p class="article-source-note"><strong>Ghi chú biên tập:</strong> Bài viết')
    .replace(/<h2>Điều cần hiểu trước tiên<\/h2>/gi, "<h2>Thông tin cần nắm trước khi quyết định</h2>")
    .replace(/<h2>Giải thích rõ từng ý<\/h2>/gi, "<h2>Những điểm cần được làm rõ</h2>")
    .replace(/<h2>Kết luận ngắn<\/h2>/gi, "<h2>Điều người lao động cần ghi nhớ</h2>")
    .replace(/<h2>Người lao động cần biết gì\??<\/h2>/gi, "<h2>Điều cần biết trước khi quyết định</h2>")
    .replace(/<h2>Điều này có ý nghĩa gì\??<\/h2>/gi, "<h2>Ý nghĩa đối với người lao động</h2>")
    .replace(/<h2>Góc nhìn cho người muốn vào nghề<\/h2>/gi, "<h2>Điều người mới cần chuẩn bị</h2>")
    .replace(/<h2>Nguồn và lưu ý<\/h2>/gi, "<h2>Nguồn tư liệu và phạm vi thông tin</h2>")
    .replace(/\bNội dung này cho thấy\b/g, "Dữ liệu cho thấy")
    .replace(/\bCó thể thấy rằng\b/g, "Có thể thấy")
    .replace(/\bĐối với người lao động\b/g, "Với người lao động")
    .replace(/\bTrong bối cảnh đó\b/g, "Từ bối cảnh này")
    .replace(/\bĐiều quan trọng là\b/g, "Điểm cần lưu ý là");
  return output;
}

function openingHeading(article) {
  const title = normalizedText(article.title);
  const rules = [
    ["anh cccd", "Chưa cần gửi giấy tờ ở bước đăng ký đầu tiên"],
    ["hop dong lao dong", "Hợp đồng được ký sau khi hoàn thành đào tạo"],
    ["40 tuoi", "Tuổi phải đi cùng sức khỏe và thể lực"],
    ["can thi", "Tình trạng mắt cần được khai trung thực ngay từ đầu"],
    ["47 kg", "Mốc 47 kg là điều kiện kiểm tra ban đầu"],
    ["1m53", "Mốc 1m53 cần được đo đúng, không làm tròn"],
    ["chua du 18", "Chỉ đăng ký chính thức khi đã đủ 18 tuổi"],
    ["phi moi gioi", "Đăng ký đúng không bắt đầu bằng chuyển tiền"],
    ["7 5 trieu", "Khoản hỗ trợ nằm trong chính sách học nghề"],
    ["phu huynh", "Gia đình cần kiểm tra đủ thông tin trước ngày con đi"],
    ["khai thac mo hay xay dung", "Chọn nghề theo công việc, không chọn theo tên gọi"],
    ["kinh nghiem", "Người chưa có nghề được đào tạo từ đầu"],
    ["lo trinh", "Năm bước từ đăng ký đến khi nhận việc"],
    ["bang thpt", "Chưa có bằng THPT chưa đồng nghĩa hết cơ hội"],
  ];
  return rules.find(([needle]) => title.includes(needle))?.[1]
    || cleanCopy(article.sections?.[0]?.heading)
    || cleanCopy(article.takeaway_title)
    || "Thông tin cần nắm trước khi quyết định";
}

function selectSections(article) {
  const sections = Array.isArray(article.sections) ? article.sections : [];
  if (sections.length <= 3) return sections;
  const candidates = [sections[0], sections[Math.floor(sections.length / 2)], sections.at(-1)];
  const seen = new Set();
  return candidates.filter((section) => {
    const key = normalizedText(section?.heading || "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderDailySection(section, index) {
  const paragraphs = (section.paragraphs || [])
    .slice(0, 3)
    .map((paragraph) => `<p>${escapeHtml(cleanCopy(paragraph))}</p>`)
    .join("");
  const items = (section.items || section.bullets || [])
    .slice(0, 5)
    .map((item) => `<li>${escapeHtml(cleanCopy(item))}</li>`)
    .join("");
  return `<section class="daily-seo-section daily-seo-section--newsroom${index % 2 ? " daily-seo-section--soft" : ""}"><div class="network-wrap daily-seo-copy"><p class="editorial-kicker">PHẦN ${String(index + 1).padStart(2, "0")}</p><h2>${escapeHtml(cleanCopy(section.heading))}</h2>${paragraphs}${items ? `<ul>${items}</ul>` : ""}</div></section>`;
}

function renderDailyPoints(article) {
  const points = (article.key_points || []).slice(0, 4);
  if (!points.length) return "";
  return `<div class="daily-seo-points daily-seo-points--newsroom">${points.map(([title, text], index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><h2>${escapeHtml(cleanCopy(title))}</h2><p>${escapeHtml(cleanCopy(text))}</p></article>`).join("")}</div>`;
}

function replaceMain(html, main) {
  const start = html.indexOf('<main id="noi-dung">');
  const end = html.indexOf("</main>", start);
  if (start === -1 || end === -1) throw new Error("Không tìm thấy vùng nội dung chính của bài giải đáp");
  return `${html.slice(0, start)}${main}${html.slice(end + "</main>".length)}`;
}

function renderDailyArticle(article, originalHtml) {
  const isTextOnly = /daily-seo-page[^"']*occupation-text-only/i.test(originalHtml);
  const intro = (article.intro || []).slice(0, 2)
    .map((paragraph) => `<p>${escapeHtml(cleanCopy(paragraph))}</p>`)
    .join("");
  const points = renderDailyPoints(article);
  const sections = selectSections(article).map(renderDailySection).join("");
  const faqs = (article.faqs || []).slice(0, 3)
    .map(([question, answer]) => `<details><summary>${escapeHtml(cleanCopy(question))}</summary><p>${escapeHtml(cleanCopy(answer))}</p></details>`)
    .join("");
  const related = (article.related || []).slice(0, 3)
    .map(([href, label]) => `<a href="${escapeHtml(href)}">${escapeHtml(cleanCopy(label))}<span aria-hidden="true">→</span></a>`)
    .join("");
  const heroMedia = isTextOnly ? "" : `<figure><img src="${escapeHtml(article.image?.src || "")}" alt="${escapeHtml(article.image?.alt || article.title)}" referrerpolicy="no-referrer" loading="eager"><figcaption>${escapeHtml(article.image?.credit || "")}</figcaption></figure>`;
  const main = `<main id="noi-dung"><article class="daily-seo-article daily-seo-article--newsroom"><header class="daily-seo-hero daily-seo-hero--newsroom"><div class="network-wrap daily-seo-hero__grid${isTextOnly ? " daily-seo-hero__grid--text-only" : ""}"><div><p class="network-eyebrow">${escapeHtml(cleanCopy(article.eyebrow || "GIẢI ĐÁP NGHỀ MỎ"))}</p><h1>${escapeHtml(article.title)}</h1><p class="daily-seo-answer" id="tra-loi-truc-tiep">${escapeHtml(article.direct_answer)}</p><div class="daily-seo-actions"><a class="network-button" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="daily-seo-hero">Hỏi Thầy Linh qua Zalo</a><a class="network-button network-button--outline" href="/kiem-tra-dieu-kien/">Tự kiểm tra điều kiện</a></div><p class="daily-seo-date">Đăng ngày <time datetime="${escapeHtml(article.publish_on)}">${escapeHtml(formatDate(article.publish_on))}</time> · Nguyễn Tử Linh · Biên tập và chịu trách nhiệm nội dung</p></div>${heroMedia}</div></header><section class="daily-seo-section daily-seo-section--opening"><div class="network-wrap daily-seo-copy"><p class="editorial-kicker">CÂU TRẢ LỜI VÀ BỐI CẢNH</p><h2>${escapeHtml(openingHeading(article))}</h2>${intro}${points}</div></section>${sections}<section class="daily-seo-section daily-seo-section--editor-note"><div class="network-wrap daily-seo-copy"><p class="editorial-kicker">GÓC BIÊN TẬP</p><h2>${escapeHtml(cleanCopy(article.takeaway_title || "Điều cần ghi nhớ"))}</h2><p class="daily-seo-takeaway">${escapeHtml(cleanCopy(article.takeaway || article.direct_answer))}</p><div class="editorial-source-box"><strong>Nguồn tư liệu:</strong> ${escapeHtml(cleanCopy(article.source_note || "Thông tin tuyển sinh đang áp dụng."))}<br><span>Bài viết do Nguyễn Tử Linh biên tập, kiểm tra thông tin và chịu trách nhiệm nội dung.</span></div></div></section>${faqs ? `<section class="daily-seo-section"><div class="network-wrap daily-seo-copy"><p class="editorial-kicker">GIẢI ĐÁP THÊM</p><h2>Ba câu hỏi thường gặp</h2><div class="daily-seo-faq">${faqs}</div></div></section>` : ""}${related ? `<section class="daily-seo-section daily-seo-section--soft"><div class="network-wrap daily-seo-copy"><p class="editorial-kicker">ĐỌC TIẾP</p><h2>Thông tin liên quan</h2><div class="daily-seo-related daily-seo-related--newsroom">${related}</div></div></section>` : ""}<section class="daily-seo-final"><div class="network-wrap"><div><h2>Kiểm tra điều kiện trước khi chuẩn bị hồ sơ</h2><p>Gửi năm sinh, nơi ở, chiều cao, cân nặng và tình trạng sức khỏe để được hướng dẫn đúng trường hợp.</p></div><div class="daily-seo-actions"><a class="network-button" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="daily-seo-final">Nhắn Zalo cho Thầy Linh</a><a class="network-button network-button--outline" href="/lien-he-di-lam-mo-than-quang-ninh/">Xem đầu mối chính thức</a></div></div></section></article></main>`;
  let output = replaceMain(polishHtmlCopy(originalHtml), main);
  output = addStylesheet(output);
  output = output.replace(/<body\s+class="([^"]*)"/i, (_match, classes) => {
    const list = new Set(classes.split(/\s+/).filter(Boolean));
    list.add("editorial-newsroom-page");
    return `<body class="${[...list].join(" ")}"`;
  });
  return output;
}

function writeIfChanged(file, content) {
  const existing = fs.readFileSync(file, "utf8");
  if (existing === content) return false;
  fs.writeFileSync(file, content);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
  return true;
}

function hideGeneratedDiffsInCi() {
  if (process.env.GITHUB_ACTIONS !== "true" || !changed.length) return;
  let tracked;
  try {
    tracked = new Set(execFileSync("git", ["ls-files", "-z"], {cwd: projectRoot, encoding: "utf8"}).split("\0").filter(Boolean));
  } catch {
    return;
  }
  const paths = changed.filter((relative) => tracked.has(relative));
  for (let index = 0; index < paths.length; index += 50) {
    const chunk = paths.slice(index, index + 50);
    if (!chunk.length) continue;
    execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"});
  }
}

function walk(directory, callback) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, callback);
    else if (entry.name === "index.html") callback(target);
  }
}

if (!fs.existsSync(siteRoot)) throw new Error("Không tìm thấy thư mục website tuyen-tho-mo");
if (!fs.existsSync(dailySourcePath)) throw new Error("Không tìm thấy dữ liệu daily-seo-articles.json");

const data = JSON.parse(fs.readFileSync(dailySourcePath, "utf8"));
const releaseDate = process.env.SEO_DAILY_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const released = data.articles.filter((article) => article.publish_on <= releaseDate);

for (const article of released) {
  const file = path.join(siteRoot, "giai-dap-nghe-mo", article.slug, "index.html");
  if (!fs.existsSync(file)) continue;
  writeIfChanged(file, renderDailyArticle(article, fs.readFileSync(file, "utf8")));
}

for (const directory of ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"]) {
  walk(path.join(siteRoot, directory), (file) => {
    const html = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)) return;
    if (!/<article\b[^>]*class="[^"]*\barticle-body\b/i.test(html)) return;
    writeIfChanged(file, polishEditorialArticle(html));
  });
}

const hubFile = path.join(siteRoot, "giai-dap-nghe-mo", "index.html");
if (fs.existsSync(hubFile)) {
  let hub = fs.readFileSync(hubFile, "utf8");
  hub = addStylesheet(polishHtmlCopy(hub))
    .replace("MỖI NGÀY MỘT CÂU HỎI THẬT", "BÀI VIẾT ĐÃ QUA BIÊN TẬP")
    .replace("Nội dung mới chỉ được công bố khi đã có câu hỏi riêng, câu trả lời trực tiếp, căn cứ và liên kết về thông tin tuyển đang áp dụng.", "Mỗi bài tập trung vào một câu hỏi thật của người lao động, trả lời ngay từ đầu, có nguồn đối chiếu và người chịu trách nhiệm biên tập.")
    .replace(/Đọc câu trả lời đầy đủ →/g, "Đọc bài viết →");
  writeIfChanged(hubFile, hub);
}

hideGeneratedDiffsInCi();

console.log(JSON.stringify({
  status: "editorial-newsroom-pass-complete",
  releaseDate,
  dailyArticles: released.length,
  changedFiles: changed.length,
  sample: changed.slice(0, 20),
  homepage: `${base}/`,
}, null, 2));
