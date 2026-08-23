import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const priority = JSON.parse(fs.readFileSync(path.join(site, "data", "provinces-2026.json"), "utf8"));
const reviewDate = review.reviewed_at;
const contentModified = review.verification_content_modified || reviewDate;
const priorityCount = priority.provinces.length;
const errors = [];
const read = (relative) => fs.readFileSync(path.join(site, relative), "utf8");

const portal = read("verification-portal.js");
for (const marker of [
  'const MESSENGER_URL = "https://m.me/thaylinhtuyenthomo"',
  "data-facebook-reel-facade",
  "mountFacebookReel",
  'trackExact("verification_video_play"',
]) if (!portal.includes(marker)) errors.push(`verification-portal.js: thiếu ${marker}`);

const kcn = read("chon-kcn-hay-lam-mo/index.html");
for (const marker of [
  "đừng chỉ hỏi lương bao nhiêu, hãy hỏi mỗi tháng còn lại bao nhiêu",
  "Bài toán 30 ngày",
  "1145886217664123",
  "data-facebook-reel-facade",
  "/kcn-comparison.css?v=2",
]) if (!kcn.includes(marker)) errors.push(`KCN chuyên sâu: thiếu ${marker}`);
const reelBlock = kcn.match(/<div class="kcn-reel">([\s\S]*?)<\/div>/i)?.[1] || "";
if (!reelBlock) errors.push("KCN: thiếu khối kcn-reel");
if (/<iframe\b/i.test(reelBlock)) errors.push("KCN: iframe Facebook vẫn tải ngay trong HTML ban đầu");

const kcnCss = read("kcn-comparison.css");
for (const marker of [".kcn-reel-facade{", ".kcn-reel-facade__play{", ".kcn-reel-facade:focus-visible{"]) {
  if (!kcnCss.includes(marker)) errors.push(`kcn-comparison.css: thiếu ${marker}`);
}

const stories = read("cau-chuyen-cong-nhan/index.html");
if (!stories.includes(`Xem ${priorityCount} địa bàn ưu tiên`)) errors.push("Câu chuyện công nhân: CTA chưa ghi đúng phạm vi địa bàn ưu tiên");
if (stories.includes("Xem toàn bộ trang tỉnh")) errors.push("Câu chuyện công nhân: còn CTA gây hiểu nhầm toàn bộ tỉnh");

const verificationPages = [
  "chon-kcn-hay-lam-mo/index.html",
  "cau-chuyen-cong-nhan/index.html",
  "kiem-tra-dieu-kien/index.html",
  "ho-so-nhap-hoc/index.html",
  "thu-nhap-an-o-ho-tro/index.html",
  "an-toan-ky-luat-moi-truong/index.html",
];
for (const relative of verificationPages) {
  const html = read(relative);
  if (!new RegExp(`"dateModified"\\s*:\\s*"${contentModified}"`).test(html)) errors.push(`${relative}: dateModified chưa là ${contentModified}`);
  if (!new RegExp(`"lastReviewed"\\s*:\\s*"${reviewDate}"`).test(html)) errors.push(`${relative}: lastReviewed chưa là ${reviewDate}`);
  if (html.includes('/verification-portal.js?v=1')) errors.push(`${relative}: còn verification-portal.js v1`);
  if (!html.includes('/verification-portal.js?v=2')) errors.push(`${relative}: thiếu verification-portal.js v2`);
  if (html.includes("Special Ad Category")) errors.push(`${relative}: còn ghi chú vận hành quảng cáo nội bộ`);
  if (!html.includes("công khai ngày rà soát")) errors.push(`${relative}: thiếu chính sách kiểm chứng công khai mới`);
}

const share = read("chia-se-thong-tin/index.html");
if (!share.includes('/share-tools.js?v=2')) errors.push("Bộ chia sẻ: chưa bump share-tools.js v2");
if (share.includes('/share-tools.js?v=1')) errors.push("Bộ chia sẻ: còn share-tools.js v1");

if (errors.length) {
  console.error(JSON.stringify({status: "verification-core-v10-invalid", errors}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "verification-core-v10-ready",
    messengerMobileFixed: true,
    messengerUrl: "https://m.me/thaylinhtuyenthomo",
    kcnSpecialistRewriteRestored: true,
    kcnClickToPlay: true,
    publicPolicyClean: true,
    verificationPortalVersion: 2,
    shareToolsVersion: 2,
    reviewedAt: reviewDate,
    contentModified,
    pagesWithCurrentDates: verificationPages.length,
    errors: 0,
  }, null, 2));
}

await import("./validate-current-recruitment-copy-v10.mjs");
await import("./validate-canonical-recruitment-facts-v11.mjs");
