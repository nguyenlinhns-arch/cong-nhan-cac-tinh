import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const requireText = (text, marker, label) => { if (!text.includes(marker)) errors.push(`${label}: thiếu ${marker}`); };

const polishCss = read("mobile-polish-20260803.css");
const shell = read("site-shell-20260803.js");
const homeCss = read("home-worker-journey.css");
const richHomeCss = read("home-rich-media.css");
const robots = read("robots.txt");
const llms = read("llms.txt");
const searchManifest = JSON.parse(read("search-index.json"));

try { new vm.Script(shell, {filename: "site-shell-20260803.js"}); }
catch (error) { errors.push(`site-shell-20260803.js: lỗi cú pháp ${error.message}`); }

for (const marker of [
  ".verification-page .site-header .header-inner",
  ".network-header__inner",
  "html.tl-mobile-ux-ready .verification-mobile-contact",
  ".tl-mobile-contact__primary",
  ".verification-comparison td:nth-child(2)::before",
  "Làm tại khu công nghiệp",
  "Học nghề và làm mỏ",
]) requireText(polishCss, marker, "mobile-polish-20260803.css");

for (const marker of [
  "/mobile-polish-20260803.css?v=1",
  "insertNetworkSearchButton",
  "polishVerificationHeader",
  "polishMobileContact",
  "verification-mobile-primary",
  "network-mobile-primary",
  "job-mobile-primary",
  "content-mobile-primary",
  "[data-application-form]",
  "20260803-v3",
]) requireText(shell, marker, "site-shell-20260803.js");

for (const marker of [
  ".home-funnel .hero .button-row .button-brief",
  "color:#fff!important",
  "border-color:rgba(255,255,255,.62)!important",
]) requireText(homeCss, marker, "home-worker-journey.css");

for (const marker of [
  ".home-funnel .worker-check fieldset{padding:12px;border:0",
  ".home-funnel .worker-check legend{float:left;width:100%",
  ".home-funnel .worker-check__choices{clear:both",
]) requireText(richHomeCss, marker, "home-rich-media.css");

for (const agent of [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
]) {
  const block = robots.match(new RegExp(`User-agent: ${agent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+Allow: /`, "i"));
  if (!block) errors.push(`robots.txt: thiếu quyền Allow / rõ ràng cho ${agent}`);
}
for (const marker of [
  "Sitemap: https://thaylinhtuyenthomo.vn/sitemap.xml",
  "Sitemap: https://thaylinhtuyenthomo.vn/news-sitemap.xml",
  "https://thaylinhtuyenthomo.vn/llms.txt",
]) requireText(robots, marker, "robots.txt");

const llmsOpening = llms.slice(0, llms.indexOf("## Trả lời trực tiếp theo câu hỏi"));
for (const marker of [
  "## Các điểm vào trung tâm",
  "## Dữ liệu máy đọc và nguồn cập nhật",
  "## Trang trả lời theo nhu cầu tìm kiếm",
  "[Sitemap chính](https://thaylinhtuyenthomo.vn/sitemap.xml)",
  "[Robots](https://thaylinhtuyenthomo.vn/robots.txt)",
  "[tin tuyển công nhân mỏ](https://thaylinhtuyenthomo.vn/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/)",
  "[lương và quyền lợi](https://thaylinhtuyenthomo.vn/thu-nhap-an-o-ho-tro/)",
  "Thông tin tuyển thợ mỏ đang áp dụng: 15 câu hỏi",
]) requireText(llmsOpening, marker, "llms.txt");
if (llmsOpening.includes("thu nhập tháng 8/2026")) errors.push("llms.txt: phần mở đầu còn khóa nội dung lâu dài vào tháng 8/2026");

const discovery = searchManifest.discovery || {};
for (const [key, expected] of Object.entries({
  canonicalFacts: "/thong-tin-tuyen-tho-mo/",
  llms: "/llms.txt",
  robots: "/robots.txt",
  sitemap: "/sitemap.xml",
  rss: "/feed.xml",
  jobsJson: "/jobs.json",
})) {
  if (discovery[key] !== expected) errors.push(`search-index.json discovery.${key}: dự kiến ${expected}, thực tế ${discovery[key] || "thiếu"}`);
}

const conditionPage = read("kiem-tra-dieu-kien/index.html");
const comparePage = read("chon-kcn-hay-lam-mo/index.html");
const factsPage = read("thong-tin-tuyen-tho-mo/index.html");
const jobPage = read("viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html");
const articlePage = read("tin-nganh-than/index.html");
for (const [html, label] of [[conditionPage, "Trang kiểm tra"], [comparePage, "Trang so sánh"], [factsPage, "Trang thông tin chuẩn"]]) {
  requireText(html, 'name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"', label);
  requireText(html, '/mobile-core.css?v=1', label);
  requireText(html, '/mobile-core.js?v=1', label);
}
requireText(conditionPage, 'class="verification-mobile-contact"', "Trang kiểm tra");
requireText(comparePage, 'class="verification-comparison"', "Trang so sánh");
requireText(factsPage, 'class="network-header"', "Trang thông tin chuẩn");
requireText(jobPage, "data-application-form", "Trang việc làm trung tâm");
requireText(articlePage, 'data-contact="application"', "Trang tin ngành Than");

console.log(JSON.stringify({
  mobilePolishBytes: Buffer.byteLength(polishCss),
  shellBytes: Buffer.byteLength(shell),
  aiAgents: 10,
  discoveryEndpoints: Object.keys(discovery).length,
  mobilePrimaryContexts: 4,
  errors: errors.length,
  sampleErrors: errors.slice(0, 25),
}, null, 2));
if (errors.length) process.exitCode = 1;
