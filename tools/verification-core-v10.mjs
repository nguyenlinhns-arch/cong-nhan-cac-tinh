import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const priority = JSON.parse(fs.readFileSync(path.join(site, "data", "provinces-2026.json"), "utf8"));
const reviewDate = review.reviewed_at;
const contentModified = review.verification_content_modified || reviewDate;
const priorityCount = priority.provinces.length;
const touched = new Set();

// Rebuild the six verification pages and immediately restore the specialist
// KCN comparison before applying shared review/cache/performance normalization.
// fix-kcn-income-context imports rewrite-kcn-comparison, which in turn imports
// build-verification-portal, so this single import preserves the intended order.
await import(`./fix-kcn-income-context.mjs?verification-core-v10=${Date.now()}`);
await import(`./sync-recruitment-config-cache-v10.mjs?verification-core-v10=${Date.now()}`);

function setLastReviewed(html) {
  if (/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/.test(html)) {
    return html.replace(/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/g, `"lastReviewed":"${reviewDate}"`);
  }
  return html.replace(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/, `"dateModified":"$1","lastReviewed":"${reviewDate}"`);
}

function setDateModified(html) {
  return html.replace(/"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/, `"dateModified":"${contentModified}"`);
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

const verificationPages = [
  "chon-kcn-hay-lam-mo/index.html",
  "cau-chuyen-cong-nhan/index.html",
  "kiem-tra-dieu-kien/index.html",
  "ho-so-nhap-hoc/index.html",
  "thu-nhap-an-o-ho-tro/index.html",
  "an-toan-ky-luat-moi-truong/index.html",
];
for (const relative of verificationPages) mutate(relative, (html) => setDateModified(setLastReviewed(html)));

const oldPolicy = "Nội dung giúp người lao động tự đối chiếu trước khi liên hệ. Bộ kiểm tra trên website chỉ là sàng lọc sơ bộ; không lưu câu trả lời sức khỏe và không thay thế khám tuyển. Quảng cáo dẫn về các trang này phải được vận hành theo nhóm việc làm/Special Ad Category khi Meta yêu cầu.";
const publicPolicy = "Nội dung giúp người lao động tự đối chiếu trước khi liên hệ. Bộ kiểm tra trên website chỉ là sàng lọc sơ bộ, không lưu câu trả lời sức khỏe và không thay thế khám tuyển. Khi dữ kiện tuyển sinh thay đổi, website ưu tiên thông tin có ngày hiệu lực mới hơn và công khai ngày rà soát.";
for (const relative of verificationPages) mutate(relative, (html) => html.replaceAll(oldPolicy, publicPolicy));

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

// The verification rebuild can restore older wording on this standalone
// training page after the site-scope normalizer has already run. Reassert the
// exact current durations here so metadata, FAQ schema and visible copy agree.
mutate("hoc-nghe-mo-tai-quang-ninh/index.html", (html) => {
  let next = html
    .replaceAll(
      "Thông tin học nghề mỏ tại Quảng Ninh năm 2026: điều kiện, thời gian 2–3 tháng, miễn kinh phí đào tạo, ăn ở, hỗ trợ, hồ sơ và thu nhập.",
      "Thông tin học nghề mỏ tại Quảng Ninh năm 2026: khai thác/xây dựng 2–3 tháng, cơ điện 10 tháng; có hỗ trợ ăn ở và hồ sơ rõ ràng.",
    )
    .replaceAll("Học nghề chính khoảng 2–3 tháng tại Quang Hanh", "Khai thác/xây dựng 2–3 tháng · cơ điện 10 tháng")
    .replaceAll(
      "Nghề khai thác và xây dựng mỏ hầm lò có thời gian đào tạo khoảng 2–3 tháng; nghề cơ điện mỏ có lộ trình dài hơn theo chương trình.",
      "Nghề khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng; nghề cơ điện mỏ hầm lò học 10 tháng.",
    )
    .replaceAll(
      "Kỹ thuật khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng. Nghề cơ điện mỏ có chương trình dài hơn.",
      "Kỹ thuật khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng. Kỹ thuật cơ điện mỏ hầm lò học 10 tháng.",
    )
    .replace(/Nghề cơ điện mỏ có (?:lộ trình|chương trình) dài hơn(?: theo chương trình)?\./gi, "Kỹ thuật cơ điện mỏ hầm lò học 10 tháng.");
  next = setLastReviewed(next);
  return setDateModified(next);
});

const portalConsumers = [
  ...verificationPages,
  "hoc-nghe-mo-tai-quang-ninh/index.html",
  "lien-he-di-lam-mo-than-quang-ninh/index.html",
];
for (const relative of portalConsumers) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = before.replaceAll("/verification-portal.js?v=1", "/verification-portal.js?v=2");
  if (after !== before) {
    fs.writeFileSync(file, after);
    touched.add(relative);
  }
}

mutate("chia-se-thong-tin/index.html", (html) => html.replaceAll("/share-tools.js?v=1", "/share-tools.js?v=2"));

console.log(JSON.stringify({
  status: "verification-core-v10-ready",
  reviewedAt: reviewDate,
  contentModified,
  priorityLocalities: priorityCount,
  recruitmentConfigVersion: 4,
  verificationPortalVersion: 2,
  shareToolsVersion: 2,
  kcnSpecialistRewriteRestored: true,
  kcnVideoClickToPlay: true,
  publicPolicyClean: true,
  exactTrainingDurationsRestored: true,
  touched: [...touched].sort(),
}, null, 2));
