import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const warnings = [];
const campaign = "article_to_application_2026";
const applicationPath = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/";

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => errors.push(message);
const occurrences = (text, marker) => text.split(marker).length - 1;

const feed = JSON.parse(read("feed.json"));
const articles = Array.isArray(feed.items) ? feed.items : [];
const campaignContents = new Set();
const searchIndex = JSON.parse(read("search-index.json"));
const searchItems = Array.isArray(searchIndex.items) ? searchIndex.items : [];

if (!articles.length) fail("Bài viết: feed không có nội dung");

for (const article of articles) {
  const url = new URL(article.url);
  const slug = url.pathname.split("/").filter(Boolean).at(-1);
  const relative = `${url.pathname.replace(/^\/+|\/+$/g, "")}/index.html`;
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) {
    fail(`${relative}: thiếu tệp bài viết`);
    continue;
  }
  const html = fs.readFileSync(full, "utf8");
  const content = `article_${slug}`;
  const expectedHref = `${applicationPath}?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=${campaign}&amp;utm_content=${content}#dang-ky`;
  const sourceIndex = html.indexOf('class="article-source-footer"');
  const applyIndex = html.indexOf('class="article-apply"');
  const shareIndex = html.indexOf('class="article-share-panel"');

  if (occurrences(html, '<section class="article-apply"') !== 1) fail(`${relative}: cần đúng một khối ứng tuyển trong bài`);
  if (sourceIndex < 0 || applyIndex < 0 || shareIndex < 0 || !(sourceIndex < applyIndex && applyIndex < shareIndex)) {
    fail(`${relative}: thứ tự nguồn → ứng tuyển → chia sẻ chưa đúng`);
  }
  for (const marker of [
    `href="${expectedHref}"`,
    'data-contact="application"',
    'data-context="article-apply"',
    "data-application-resume-label",
    'data-contact="zalo"',
    "Lần đăng ký đầu chưa cần nộp hoặc gửi ảnh giấy tờ",
  ]) {
    if (!html.includes(marker)) fail(`${relative}: thiếu ${marker}`);
  }
  if (campaignContents.has(content)) fail(`${relative}: trùng mã đo ${content}`);
  campaignContents.add(content);

  const searchItem = searchItems.find((item) => item.url === url.pathname);
  if (!searchItem) fail(`${relative}: thiếu trong chỉ mục tìm kiếm`);
  else for (const interfaceHeading of ["Muốn biết mình có phù hợp nghề mỏ?", "Gửi bài này cho người đang tìm hiểu nghề mỏ"]) {
    if (searchItem.keywords?.includes(interfaceHeading)) fail(`${relative}: tiêu đề giao diện lọt vào từ khóa tìm kiếm`);
  }
}

const mobile = read("mobile-ux.js");
const application = read("job-application.js");
const css = read("mobile-ux.css");
const mobileDraftKey = mobile.match(/const DRAFT_KEY = "([^"]+)"/)?.[1];
const applicationDraftKey = application.match(/const DRAFT_KEY = "([^"]+)"/)?.[1];

if (!mobileDraftKey || mobileDraftKey !== applicationDraftKey) fail("Khôi phục hồ sơ: khóa bản nháp không đồng nhất");
for (const marker of [
  "function hasActiveApplicationDraft()",
  "DRAFT_TTL_MS = 24 * 60 * 60 * 1000",
  "data-application-resume-label",
  "Tiếp tục hồ sơ",
  "localStorage.removeItem(DRAFT_KEY)",
]) {
  if (!mobile.includes(marker)) fail(`Khôi phục hồ sơ: thiếu ${marker}`);
}

const draftStart = mobile.indexOf("function hasActiveApplicationDraft()");
const draftEnd = mobile.indexOf("function updateApplicationResumeLabels", draftStart);
const draftReader = mobile.slice(draftStart, draftEnd);
for (const sensitiveField of ["full_name", "phone", "birth_date", "health", "consent"]) {
  if (draftReader.includes(sensitiveField)) fail(`Khôi phục hồ sơ: không được đọc trường nhạy cảm ${sensitiveField}`);
}

const searchStart = mobile.indexOf("function setupSearch()");
const searchCode = mobile.slice(searchStart);
const ensureIndex = searchCode.indexOf("const ensureSearchDialog");
if (searchStart < 0 || ensureIndex < 0) fail("Tìm kiếm: thiếu cơ chế chỉ khởi tạo khi cần");
else {
  const beforeEnsure = searchCode.slice(0, ensureIndex);
  if (beforeEnsure.includes("createSearchDialog(")) fail("Tìm kiếm: hộp thoại vẫn được tạo ở lần tải đầu");
  for (const marker of ["let dialog = null", "const activeDialog = ensureSearchDialog()", "loadSearchIndex(activeDialog)"]) {
    if (!searchCode.includes(marker)) fail(`Tìm kiếm: thiếu ${marker}`);
  }
}

for (const marker of [
  "@supports (content-visibility: auto)",
  "content-visibility: auto",
  "contain-intrinsic-size: auto 480px",
  "contain-intrinsic-size: auto 900px",
  "@media print",
  "content-visibility: visible !important",
]) {
  if (!css.includes(marker)) fail(`Hiệu năng dựng trang: thiếu ${marker}`);
}
if (!css.includes("main > section:not(:first-child):not(#dang-ky)")) fail("Hiệu năng dựng trang: không được trì hoãn biểu mẫu đăng ký");

const home = read("index.html");
const sitemap = read("sitemap.xml");
const homeDescription = home.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "";
for (const currentFact of ["18–40 tuổi", "1m53", "47kg", "20–25 triệu/tháng"]) {
  if (!homeDescription.includes(currentFact)) fail(`Đoạn mô tả trang chủ: thiếu ${currentFact}`);
}
for (const staleFact of ["18–35", "1m56", "48kg", "thu nhập tham khảo"]) {
  if (homeDescription.includes(staleFact)) fail(`Đoạn mô tả trang chủ: còn dữ kiện cũ ${staleFact}`);
}
if (!home.includes('"dateModified":"2026-08-02"')) fail("Trang chủ: ngày sửa đổi chưa phản ánh bản hiện tại");
if (!sitemap.includes("<loc>https://thaylinhtuyenthomo.vn/</loc><lastmod>2026-08-02</lastmod>")) fail("Sitemap: trang chủ chưa có ngày cập nhật mới");

console.log(JSON.stringify({
  articles: articles.length,
  article_application_paths: campaignContents.size,
  draft_resume: Boolean(mobileDraftKey && mobileDraftKey === applicationDraftKey),
  lazy_search: searchStart >= 0 && ensureIndex >= 0,
  content_visibility: css.includes("content-visibility: auto"),
  current_home_snippet: homeDescription.length,
  errors,
  warnings,
}, null, 2));

if (errors.length) process.exit(1);
