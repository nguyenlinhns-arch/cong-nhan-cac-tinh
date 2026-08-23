import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const priorityData = JSON.parse(fs.readFileSync(path.join(site, "data", "provinces-2026.json"), "utf8"));
const recruitment = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));

const priorityCount = priorityData.provinces.length;
const activeProfiles = recruitment.occupation_profiles.filter((profile) => profile.active_intake);
const occupationCount = activeProfiles.length;
const packageCount = priorityCount + 1;
const reviewDate = review.reviewed_at;
const displayReviewDate = reviewDate.split("-").reverse().join("/");

if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate)) throw new Error(`site-scope-v10: reviewed_at không hợp lệ: ${reviewDate}`);
if (priorityCount < 1) throw new Error("site-scope-v10: không có địa bàn ưu tiên");
if (occupationCount < 1) throw new Error("site-scope-v10: không có nghề đang tiếp nhận");

const touched = new Set();
function mutate(relative, transform) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) return;
  const before = fs.readFileSync(file, "utf8");
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    touched.add(relative);
  }
}

function setLastReviewed(html) {
  if (/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/.test(html)) {
    return html.replace(/"lastReviewed"\s*:\s*"\d{4}-\d{2}-\d{2}"/g, `"lastReviewed":"${reviewDate}"`);
  }
  return html.replace(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/, `"dateModified":"$1","lastReviewed":"${reviewDate}"`);
}

function setDateModified(html) {
  return html.replace(/"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/, `"dateModified":"${reviewDate}"`);
}

function normalizeProvinceNav(html) {
  return html.replace(/<a([^>]*href=["'][^"']*#theo-tinh["'][^>]*)>34 tỉnh, thành<\/a>/g, "<a$1>Theo tỉnh</a>");
}

mutate("index.html", (html) => normalizeProvinceNav(html)
  .replace(/Xem đủ \d+ tỉnh, thành →/g, `Xem ${priorityCount} địa bàn ưu tiên →`));

mutate("trung-tam-nghe-mo/index.html", (html) => setDateModified(setLastReviewed(html
  .replace(/Thông tin theo \d+ tỉnh/g, `Thông tin theo ${priorityCount} địa bàn ưu tiên`)
  .replace(/\b\d+ trang tỉnh\b/g, `${priorityCount} trang địa phương ưu tiên`)
  .replace(/điều kiện, \d+ tỉnh/g, `điều kiện, ${priorityCount} địa bàn ưu tiên`))));

mutate("viec-lam-nganh-than/index.html", (html) => setDateModified(setLastReviewed(normalizeProvinceNav(html)
  .replace(/\b\d+ trang tư vấn theo tỉnh\b/g, `${priorityCount} trang địa phương ưu tiên`)
  .replace(/\b\d+ trang tỉnh\b/g, `${priorityCount} trang địa phương ưu tiên`)
  .replace(/tại \d+ tỉnh/g, `tại ${priorityCount} địa bàn ưu tiên`)
  .replace(/Chọn một trong \d+ tỉnh, thành/g, `Chọn ${priorityCount} địa bàn ưu tiên`))));

mutate("chia-se-thong-tin/index.html", (html) => setDateModified(setLastReviewed(html
  .replace(/theo \d+ tỉnh và toàn quốc/g, `theo ${priorityCount} địa bàn ưu tiên và toàn quốc`)
  .replace(/>\d+ GÓI NỘI DUNG</g, `>${packageCount} GÓI NỘI DUNG<`))));

mutate("thong-tin-tuyen-tho-mo/index.html", (html) => {
  let next = html.replace(/<time datetime="\d{4}-\d{2}-\d{2}">\d{2}\/\d{2}\/\d{4}<\/time>(; áp dụng cho thông tin tuyển)/g,
    `<time datetime="${reviewDate}">${displayReviewDate}</time>$1`);
  next = setLastReviewed(next);
  return setDateModified(next);
});

mutate("viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html", (html) => {
  let next = normalizeProvinceNav(html)
    .replace("người chưa có kinh nghiệm được đào tạo từ đầu nghề khai thác hoặc xây dựng mỏ hầm lò trước khi nhận việc tại các doanh nghiệp trong TKV.",
      "người chưa có kinh nghiệm được đào tạo từ đầu theo một trong ba nghề khai thác, xây dựng hoặc cơ điện mỏ hầm lò trước khi nhận việc tại các doanh nghiệp trong TKV.");
  next = setLastReviewed(next);
  return setDateModified(next);
});

const reviewOnlyPaths = [
  "hoc-nghe-mo-tai-quang-ninh/index.html",
  "kiem-tra-dieu-kien/index.html",
  "thu-nhap-an-o-ho-tro/index.html",
  "lien-he-di-lam-mo-than-quang-ninh/index.html",
  ...activeProfiles.map((profile) => `viec-lam/${profile.slug}/index.html`),
];
for (const relative of reviewOnlyPaths) mutate(relative, (html) => setLastReviewed(normalizeProvinceNav(html)));

console.log(JSON.stringify({
  status: "site-scope-v10-normalized",
  priorityLocalities: priorityCount,
  candidateScope: recruitment.candidate_scope,
  activeOccupations: occupationCount,
  sharePackages: packageCount,
  reviewedAt: reviewDate,
  touched: [...touched].sort(),
}, null, 2));
