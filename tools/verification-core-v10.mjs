import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const priority = JSON.parse(fs.readFileSync(path.join(site, "data", "provinces-2026.json"), "utf8"));
const reviewDate = review.reviewed_at;
const priorityCount = priority.provinces.length;
const touched = new Set();

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function setLastReviewed(html) {
  if (/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/.test(html)) {
    return html.replace(/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/g, `"lastReviewed":"${reviewDate}"`);
  }
  return html.replace(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/, `"dateModified":"$1","lastReviewed":"${reviewDate}"`);
}

function mutate(relative, transform) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) throw new Error(`verification-core-v10: thiếu ${relative}`);
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    touched.add(relative);
  }
}

for (const relative of [
  "ho-so-nhap-hoc/index.html",
  "an-toan-ky-luat-moi-truong/index.html",
  "chon-kcn-hay-lam-mo/index.html",
  "cau-chuyen-cong-nhan/index.html",
]) mutate(relative, setLastReviewed);

mutate("cau-chuyen-cong-nhan/index.html", (html) => html
  .replace("Xem toàn bộ trang tỉnh", `Xem ${priorityCount} địa bàn ưu tiên`));

const facebookEmbed = "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1145886217664123%2F&show_text=false&width=360";
mutate("chon-kcn-hay-lam-mo/index.html", (html) => {
  let next = html.replace("/kcn-comparison.css?v=1", "/kcn-comparison.css?v=2");
  const reelPattern = /<iframe\b[^>]*src="https:\/\/www\.facebook\.com\/plugins\/video\.php\?href=https%3A%2F%2Fwww\.facebook\.com%2Freel%2F1145886217664123%2F&amp;show_text=false&amp;width=360"[^>]*><\/iframe>/i;
  if (reelPattern.test(next)) {
    next = next.replace(reelPattern,
      `<button class="kcn-reel-facade" type="button" data-facebook-reel-facade data-facebook-embed="${facebookEmbed.replaceAll("&", "&amp;")}" data-context="kcn-comparison-reel" aria-label="Phát video Chọn KCN hay làm mỏ của Thầy Linh"><span class="kcn-reel-facade__play" aria-hidden="true">▶</span><span class="kcn-reel-facade__label">Bấm để xem video · KCN hay làm mỏ?</span></button>`);
  }
  return next;
});

// Bust the shared verification script everywhere it is used so mobile visitors
// immediately receive the Messenger fix and click-to-play handler.
for (const file of walk(site).filter((file) => file.endsWith(".html") && !file.includes(`${path.sep}nhap-hoc${path.sep}`))) {
  const before = fs.readFileSync(file, "utf8");
  let after = before.replaceAll("/verification-portal.js?v=1", "/verification-portal.js?v=2");
  if (file.endsWith(`${path.sep}chia-se-thong-tin${path.sep}index.html`)) {
    after = after.replaceAll("/share-tools.js?v=1", "/share-tools.js?v=2");
  }
  if (after !== before) {
    fs.writeFileSync(file, after);
    touched.add(path.relative(site, file).split(path.sep).join("/"));
  }
}

console.log(JSON.stringify({
  status: "verification-core-v10-ready",
  reviewedAt: reviewDate,
  priorityLocalities: priorityCount,
  verificationPortalVersion: 2,
  shareToolsVersion: 2,
  kcnVideoClickToPlay: true,
  touched: [...touched].sort(),
}, null, 2));
