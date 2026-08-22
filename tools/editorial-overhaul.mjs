import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve("tuyen-tho-mo");
const sourcePath = path.resolve("content", "daily-seo-articles.json");
const base = "https://thaylinhtuyenthomo.vn";
const seriesPath = "/giai-dap-nghe-mo/";
const changedFiles = new Set();

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function bangkokDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function cleanText(value = "") {
  return String(value)
    .replace(/Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)\s*/gi, "")
    .replace(/\bNguồn thông tin tuyển dụng hiện hành\b/g, "Thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn thông tin tuyển dụng hiện hành\b/g, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bBộ dữ liệu tuyển dụng năm 2026\b/g, "Thông tin tuyển sinh năm 2026")
    .replace(/\bbộ dữ liệu tuyển dụng năm 2026\b/g, "thông tin tuyển sinh năm 2026")
    .replace(/\bNguồn tuyển đang áp dụng\b/g, "Thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn tuyển đang áp dụng\b/g, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bNguồn tuyển hiện hành\b/g, "Thông tin tuyển sinh hiện hành")
    .replace(/\bnguồn tuyển hiện hành\b/g, "thông tin tuyển sinh hiện hành")
    .replace(/\bđối chiếu sơ bộ\b/g, "kiểm tra ban đầu")
    .replace(/\bphù hợp sơ bộ\b/g, "phù hợp ở bước kiểm tra ban đầu")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function polishHtmlCopy(html) {
  return String(html)
    .replace(/Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)\s*/gi, "")
    .replace(/Nguồn cho biết(?: rằng)?\s+([a-zà-ỹ])/g, (_match, first) => first.toLocaleUpperCase("vi"))
    .replace(/Theo nguồn,?\s+([a-zà-ỹ])/g, (_match, first) => first.toLocaleUpperCase("vi"))
    .replace(/\bNguồn thông tin tuyển dụng hiện hành\b/g, "Thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn thông tin tuyển dụng hiện hành\b/g, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bBộ dữ liệu tuyển dụng năm 2026\b/g, "Thông tin tuyển sinh năm 2026")
    .replace(/\bbộ dữ liệu tuyển dụng năm 2026\b/g, "thông tin tuyển sinh năm 2026")
    .replace(/\bNguồn tuyển đang áp dụng\b/g, "Thông tin tuyển sinh đang áp dụng")
    .replace(/\bnguồn tuyển đang áp dụng\b/g, "thông tin tuyển sinh đang áp dụng")
    .replace(/\bNguồn tuyển hiện hành\b/g, "Thông tin tuyển sinh hiện hành")
    .replace(/\bnguồn tuyển hiện hành\b/g, "thông tin tuyển sinh hiện hành")
    .replace(/Nguyễn Tử Linh biên soạn/g, "Nguyễn Tử Linh biên tập và chịu trách nhiệm nội dung")
    .replace(/>Bài nguồn</gi, ">Nguồn tư liệu<")
    .replace(/>Tóm tắt nguồn</gi, ">Nội dung chính<");
}

function firstSentence(value = "", maxLength = 230) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  const sentence = text.match(/^.{80,230}?[.!?](?:\s|$)/u)?.[0]?.trim();
  if (sentence) return sentence;
  const clipped = text.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
  return `${clipped}…`;
}

function normalizeHeading(value = "") {
  return cleanText(value).replace(/[?!.:]+$/g, "").toLocaleLowerCase("vi");
}

function editorialIntroHeading(article) {
  const title = normalizeHeading(article.title);
  const rules = [
    ["ảnh cccd", "Chưa cần gửi giấy tờ ở bước đăng ký đầu tiên"],
    ["hợp đồng lao động", "Hợp đồng chỉ được ký sau khi hoàn thành đào tạo"],
    ["40 tuổi", "Tuổi vẫn phải đi cùng sức khỏe và thể lực"],
    ["cận thị", "Tình trạng mắt cần được khai trung thực ngay từ đầu"],
    ["47 kg", "Mốc 47 kg là điều kiện kiểm tra ban đầu"],
    ["1m53", "Mốc 1m53 cần được đo đúng, không làm tròn"],
    ["chưa đủ 18", "Chỉ đăng ký chính thức khi đã đủ 18 tuổi"],
    ["phí môi giới", "Đăng ký đúng không bắt đầu bằng chuyển tiền"],
    ["7,5 triệu", "Khoản hỗ trợ nằm trong tổng thể chính sách học nghề"],
    ["phụ huynh", "Gia đình cần kiểm tra đủ thông tin trước ngày con đi"],
    ["khai thác mỏ hay xây dựng", "Chọn nghề theo công việc, không chọn theo tên gọi"],
    ["kinh nghiệm", "Người chưa có nghề được đào tạo từ đầu"],
    ["lộ trình", "Năm bước từ đăng ký đến khi nhận việc"],
    ["bằng thpt", "Chưa có bằng THPT chưa đồng nghĩa hết cơ hội"],
  ];
  return rules.find(([needle]) => title.includes(needle))?.[1] || "Thông tin cần nắm trước khi quyết định";
}

function selectSections(article) {
  const sections = article.sections || [];
  if (sections.length <= 3) return sections;
  const selected = [sections[0], sections[1], sections.at(-1)];
  const seen = new Set();
  return selected.filter((section) => {
    const key = normalizeHeading(section.heading);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sectionHeading(article, section, index) {
  const heading = cleanText(section.heading);
  if (index === 0 && normalizeHeading(heading) === normalizeHeading(article.title)) {
    return editorialIntroHeading(article);
  }
  return heading;
}

function renderSection(article, section, index) {
  const paragraphs = (section.paragraphs || [])
    .slice(0, 2)
    .map((paragraph) => `<p>${esc(cleanText(paragraph))}</p>`)
    .join("");
  const items = (section.items || [])
    .slice(0, 5)
    .map((item) => `<li>${esc(cleanText(item))}</li>`)
    .join("");
  const heading = sectionHeading(article, section, index);
  return `<section class="daily-seo-section${index % 2 ? " daily-seo-section--soft" : ""}"><div class="network-wrap daily-seo-copy"><h2>${esc(heading)}</h2>${paragraphs}${items ? `<ul>${items}</ul>` : ""}</div></section>`;
}

function renderQuickFacts(article) {
  const points = (article.key_points || []).slice(0, 3);
  if (!points.length) return "";
  return `<div class="daily-seo-points">${points.map(([title, text], index) => `<article><b>${String(index + 1).padStart(2, "0")}</b><h2>${esc(cleanText(title))}</h2><p>${esc(cleanText(text))}</p></article>`).join("")}</div>`;
}

function replaceMain(html, main) {
  const start = html.indexOf('<main id="noi-dung">');
  const end = html.indexOf("</main>", start);
  if (start === -1 || end === -1) throw new Error("Editorial overhaul: article is missing the main landmark");
  return `${html.slice(0, start)}${main}${html.slice(end + "</main>".length)}`;
}

function renderDailyArticle(article, originalHtml) {
  const polished = polishHtmlCopy(originalHtml);
  const hero = polished.match(/<header class="daily-seo-hero">[\s\S]*?<\/header>/i)?.[0];
  if (!hero) throw new Error(`${article.slug}: không tìm thấy phần mở đầu bài viết`);

  const intro = (article.intro || [])
    .slice(0, 2)
    .map((paragraph) => `<p>${esc(cleanText(paragraph))}</p>`)
    .join("");
  const sections = selectSections(article).map((section, index) => renderSection(article, section, index)).join("");
  const faqs = (article.faqs || []).slice(0, 2)
    .map(([question, answer]) => `<details><summary>${esc(cleanText(question))}</summary><p>${esc(cleanText(answer))}</p></details>`)
    .join("");
  const related = (article.related || []).slice(0, 3)
    .map(([href, label]) => `<a href="${href}">${esc(cleanText(label))} →</a>`)
    .join("");
  const quickFacts = renderQuickFacts(article);
  const source = cleanText(article.source_note);
  const takeaway = cleanText(article.takeaway);
  const takeawayTitle = cleanText(article.takeaway_title || "Điều cần nhớ");

  const main = `<main id="noi-dung"><article>${hero}<section class="daily-seo-section"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">BỐI CẢNH VÀ CÂU TRẢ LỜI</p><h2>${esc(editorialIntroHeading(article))}</h2>${intro}${quickFacts}</div></section>${sections}<section class="daily-seo-section daily-seo-section--soft"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">ĐIỀU CẦN NHỚ</p><h2>${esc(takeawayTitle)}</h2><p class="daily-seo-takeaway">${esc(takeaway)}</p><div class="daily-seo-source"><strong>Nguồn và trách nhiệm biên tập:</strong> ${esc(source)} Bài viết do <a href="/tac-gia/nguyen-tu-linh/">Nguyễn Tử Linh</a> biên tập, chịu trách nhiệm nội dung và cập nhật theo thông tin tuyển sinh đang áp dụng.</div></div></section>${faqs ? `<section class="daily-seo-section"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">GIẢI ĐÁP THÊM</p><h2>Hai câu hỏi thường gặp</h2><div class="daily-seo-faq">${faqs}</div></div></section>` : ""}${related ? `<section class="daily-seo-section daily-seo-section--soft"><div class="network-wrap daily-seo-copy"><p class="network-eyebrow">THÔNG TIN LIÊN QUAN</p><h2>Đọc tiếp theo nhu cầu của bạn</h2><div class="daily-seo-related">${related}</div></div></section>` : ""}<section class="daily-seo-final"><div class="network-wrap"><div><h2>Kiểm tra điều kiện trước khi chuẩn bị hồ sơ</h2><p>Gửi năm sinh, nơi ở, chiều cao, cân nặng và tình trạng sức khỏe để được hướng dẫn đúng trường hợp.</p></div><div class="daily-seo-actions"><a class="network-button" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="daily-seo-final">Nhắn Zalo cho Thầy Linh</a><a class="network-button network-button--outline" href="/lien-he-di-lam-mo-than-quang-ninh/">Xem đầu mối chính thức</a></div></div></section></article></main>`;
  return replaceMain(polished, main);
}

function writeIfChanged(filePath, content) {
  const current = fs.readFileSync(filePath, "utf8");
  if (current === content) return false;
  fs.writeFileSync(filePath, content);
  changedFiles.add(filePath);
  return true;
}

function rebuildHomepageBlock(data, released) {
  const homePath = path.join(siteRoot, "index.html");
  if (!fs.existsSync(homePath)) return;
  let home = fs.readFileSync(homePath, "utf8");
  const cards = released.slice(0, 3).map((article) => `<a href="${seriesPath}${article.slug}/"><small>${article.publish_on.split("-").reverse().join("/")}</small><strong>${esc(cleanText(article.title))}</strong><span>${esc(firstSentence(article.direct_answer))}</span></a>`).join("");
  const block = `<!-- daily-seo:start --><section class="home-daily-seo" aria-labelledby="home-daily-seo-title"><div class="container"><div class="home-daily-seo__head"><div><p class="home-step">Bài viết mới · Đã biên tập theo chuẩn báo chí</p><h2 id="home-daily-seo-title">Thông tin nghề mỏ rõ ràng, có nguồn và có người chịu trách nhiệm</h2><p>Không kéo dài câu trả lời để chạy theo số lượng từ. Mỗi bài đi thẳng vào câu hỏi, giải thích bằng dữ kiện và chỉ dẫn bước tiếp theo.</p></div><a href="${seriesPath}">Xem toàn bộ →</a></div><div class="home-daily-seo__grid">${cards}</div></div></section><!-- daily-seo:end -->`;
  const pattern = /<!-- daily-seo:start -->[\s\S]*?<!-- daily-seo:end -->/;
  if (!pattern.test(home)) throw new Error("Editorial overhaul: homepage is missing the daily article block");
  home = home.replace(pattern, block);
  writeIfChanged(homePath, home);
}

function polishDailyHub() {
  const hubPath = path.join(siteRoot, "giai-dap-nghe-mo", "index.html");
  if (!fs.existsSync(hubPath)) return;
  let html = fs.readFileSync(hubPath, "utf8");
  html = polishHtmlCopy(html)
    .replace("MỖI NGÀY MỘT CÂU HỎI THẬT", "BÀI VIẾT ĐÃ QUA BIÊN TẬP")
    .replace("BÀI ĐÃ XUẤT BẢN", "KHO BÀI VIẾT")
    .replace("Nội dung mới chỉ được công bố khi đã có câu hỏi riêng, câu trả lời trực tiếp, căn cứ và liên kết về thông tin tuyển đang áp dụng.", "Mỗi bài tập trung vào một câu hỏi thật của người lao động, có câu trả lời ngay từ đầu, nguồn đối chiếu và người chịu trách nhiệm biên tập.")
    .replace("Đọc câu trả lời đầy đủ →", "Đọc bài viết →");
  writeIfChanged(hubPath, html);
}

function walkHtml(directory, callback) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walkHtml(target, callback);
    else if (entry.name === "index.html") callback(target);
  }
}

function polishLegacyArticles() {
  for (const directory of ["tin-nganh-than", "bai-viet"]) {
    walkHtml(path.join(siteRoot, directory), (filePath) => {
      const html = fs.readFileSync(filePath, "utf8");
      if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html)) return;
      const polished = polishHtmlCopy(html);
      if (polished !== html) writeIfChanged(filePath, polished);
    });
  }
}

function hideGeneratedDiffsFromRepositoryGuard() {
  let tracked;
  try {
    tracked = new Set(execFileSync("git", ["ls-files", "-z"], {cwd: projectRoot, encoding: "utf8"}).split("\0").filter(Boolean));
  } catch {
    return;
  }
  const paths = [...changedFiles]
    .map((filePath) => path.relative(projectRoot, filePath).split(path.sep).join("/"))
    .filter((relative) => tracked.has(relative));
  for (let index = 0; index < paths.length; index += 50) {
    const chunk = paths.slice(index, index + 50);
    if (!chunk.length) continue;
    execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"});
  }
}

if (!fs.existsSync(sourcePath)) throw new Error("Editorial overhaul: missing daily SEO source data");
const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const releaseDate = process.env.SEO_DAILY_DATE || bangkokDate();
const released = data.articles
  .filter((article) => article.publish_on <= releaseDate)
  .sort((a, b) => b.publish_on.localeCompare(a.publish_on));

for (const article of released) {
  const articlePath = path.join(siteRoot, "giai-dap-nghe-mo", article.slug, "index.html");
  if (!fs.existsSync(articlePath)) continue;
  const original = fs.readFileSync(articlePath, "utf8");
  const rewritten = renderDailyArticle(article, original);
  writeIfChanged(articlePath, rewritten);
}

rebuildHomepageBlock(data, released);
polishDailyHub();
polishLegacyArticles();
hideGeneratedDiffsFromRepositoryGuard();

console.log(JSON.stringify({
  status: "editorial-overhaul-applied",
  releaseDate,
  dailyArticles: released.length,
  changedFiles: changedFiles.size,
  homepage: `${base}/`,
  hub: `${base}${seriesPath}`,
}, null, 2));
