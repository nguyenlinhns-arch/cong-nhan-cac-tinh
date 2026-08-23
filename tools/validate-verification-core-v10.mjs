import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const priority = JSON.parse(fs.readFileSync(path.join(site, "data", "provinces-2026.json"), "utf8"));
const reviewDate = review.reviewed_at;
const priorityCount = priority.provinces.length;
const errors = [];
const read = (relative) => fs.readFileSync(path.join(site, relative), "utf8");

const portal = read("verification-portal.js");
for (const marker of [
  'const MESSENGER_URL = "https://www.messenger.com/t/thaylinhtuyenthomo.vn"',
  "data-facebook-reel-facade",
  "mountFacebookReel",
  'trackExact("verification_video_play"',
]) if (!portal.includes(marker)) errors.push(`verification-portal.js: thiếu ${marker}`);

const kcn = read("chon-kcn-hay-lam-mo/index.html");
if (!kcn.includes('data-facebook-reel-facade')) errors.push("KCN: video chưa dùng facade click-to-play");
if (!kcn.includes('/kcn-comparison.css?v=2')) errors.push("KCN: CSS chưa bump v2");
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

for (const relative of [
  "ho-so-nhap-hoc/index.html",
  "an-toan-ky-luat-moi-truong/index.html",
  "chon-kcn-hay-lam-mo/index.html",
  "cau-chuyen-cong-nhan/index.html",
]) {
  const html = read(relative);
  if (!new RegExp(`"lastReviewed"\\s*:\\s*"${reviewDate}"`).test(html)) errors.push(`${relative}: lastReviewed chưa là ${reviewDate}`);
  if (html.includes('/verification-portal.js?v=1')) errors.push(`${relative}: còn verification-portal.js v1`);
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
    kcnClickToPlay: true,
    verificationPortalVersion: 2,
    shareToolsVersion: 2,
    reviewedAt: reviewDate,
    errors: 0,
  }, null, 2));
}
