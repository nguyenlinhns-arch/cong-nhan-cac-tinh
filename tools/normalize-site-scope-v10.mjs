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
const contentModifiedDate = review.verification_content_modified || reviewDate;
const policyEffectiveDate = review.policy_effective_from || recruitment.effective_from;
const displayReviewDate = reviewDate.split("-").reverse().join("/");
const displayPolicyDate = policyEffectiveDate.split("-").reverse().join("/");
const currentFactsEvergreenTitle = "Thông tin tuyển thợ mỏ đang áp dụng: 15 câu hỏi";
const currentFactsEvergreenHeading = "Thông tin tuyển thợ mỏ đang áp dụng: trả lời 15 câu hỏi";

if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate)) throw new Error(`site-scope-v10: reviewed_at không hợp lệ: ${reviewDate}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(contentModifiedDate)) throw new Error(`site-scope-v10: verification_content_modified không hợp lệ: ${contentModifiedDate}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(policyEffectiveDate)) throw new Error(`site-scope-v10: policy_effective_from không hợp lệ: ${policyEffectiveDate}`);
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
  return html.replace(/"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/, `"dateModified":"${contentModifiedDate}"`);
}

function normalizeProvinceNav(html) {
  return html.replace(/<a([^>]*href=["'][^"']*#theo-tinh["'][^>]*)>34 tỉnh, thành<\/a>/g, "<a$1>Theo tỉnh</a>");
}

mutate("index.html", (html) => normalizeProvinceNav(html)
  .replace(/Xem đủ \d+ tỉnh, thành →/g, `Xem ${priorityCount} địa bàn ưu tiên →`));

mutate("trung-tam-nghe-mo/index.html", (html) => setDateModified(setLastReviewed(html
  .replace(/Thông tin theo \d+ tỉnh/g, `Thông tin theo ${priorityCount} địa bàn ưu tiên`)
  .replace(/\b\d+ trang tỉnh\b/g, `${priorityCount} trang địa phương ưu tiên`)
  .replace(/điều kiện, \d+ tỉnh/g, `điều kiện, ${priorityCount} địa bàn ưu tiên`)
  .replace(/thu nhập tháng \d{1,2}\/\d{4}/g, "thu nhập đang áp dụng"))));

mutate("viec-lam-nganh-than/index.html", (html) => setDateModified(setLastReviewed(normalizeProvinceNav(html)
  .replace(/\b\d+ trang tư vấn theo tỉnh\b/g, `${priorityCount} trang địa phương ưu tiên`)
  .replace(/\b\d+ trang tỉnh\b/g, `${priorityCount} trang địa phương ưu tiên`)
  .replace(/tại \d+ tỉnh/g, `tại ${priorityCount} địa bàn ưu tiên`)
  .replace(/Chọn một trong \d+ tỉnh, thành/g, `Chọn ${priorityCount} địa bàn ưu tiên`))));

mutate("chia-se-thong-tin/index.html", (html) => setDateModified(setLastReviewed(html
  .replace(/theo \d+ tỉnh và toàn quốc/g, `theo ${priorityCount} địa bàn ưu tiên và toàn quốc`)
  .replace(/>\d+ GÓI NỘI DUNG</g, `>${packageCount} GÓI NỘI DUNG<`))));

mutate("thong-tin-tuyen-tho-mo/index.html", (html) => {
  let next = html
    .replace(/Tuyển thợ mỏ tháng \d{1,2}\/\d{4}: 15 câu hỏi/g, currentFactsEvergreenTitle)
    .replace(/Tuyển thợ mỏ tháng \d{1,2}\/\d{4}: trả lời 15 câu hỏi/g, currentFactsEvergreenHeading)
    .replace(/Thông tin đang áp dụng trong tháng \d{1,2}\/\d{4}/g, "Thông tin tuyển đang áp dụng")
    .replace(/CẬP NHẬT\s*<time datetime="\d{4}-\d{2}-\d{2}">\d{2}\/\d{2}\/\d{4}<\/time>/g,
      `HIỆU LỰC <time datetime="${policyEffectiveDate}">${displayPolicyDate}</time>`)
    .replace(/(<strong>Rà soát gần nhất<\/strong><span>)<time datetime="\d{4}-\d{2}-\d{2}">\d{2}\/\d{2}\/\d{4}<\/time>;\s*áp dụng cho thông tin tuyển tháng \d{1,2}\/\d{4}\./g,
      `$1<time datetime="${reviewDate}">${displayReviewDate}</time>; đối chiếu thông tin tuyển đang áp dụng.`)
    .replace(/(<strong>Rà soát gần nhất<\/strong><span>)<time datetime="\d{4}-\d{2}-\d{2}">\d{2}\/\d{2}\/\d{4}<\/time>;\s*đối chiếu thông tin tuyển đang áp dụng\./g,
      `$1<time datetime="${reviewDate}">${displayReviewDate}</time>; đối chiếu thông tin tuyển đang áp dụng.`);
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

mutate("hoc-nghe-mo-tai-quang-ninh/index.html", (html) => {
  const oldDescription = "Thông tin học nghề mỏ tại Quảng Ninh năm 2026: điều kiện, thời gian 2–3 tháng, miễn kinh phí đào tạo, ăn ở, hỗ trợ, hồ sơ và thu nhập.";
  const newDescription = "Thông tin học nghề mỏ tại Quảng Ninh năm 2026: khai thác/xây dựng 2–3 tháng, cơ điện 10 tháng; có hỗ trợ ăn ở và hồ sơ rõ ràng.";
  let next = normalizeProvinceNav(html)
    .replaceAll(oldDescription, newDescription)
    .replace("Học nghề chính khoảng 2–3 tháng tại Quang Hanh", "Khai thác/xây dựng 2–3 tháng · cơ điện 10 tháng")
    .replace("Nghề khai thác và xây dựng mỏ hầm lò có thời gian đào tạo khoảng 2–3 tháng; nghề cơ điện mỏ có lộ trình dài hơn theo chương trình.",
      "Nghề khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng; nghề cơ điện mỏ hầm lò học 10 tháng.")
    .replace("Kỹ thuật khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng. Nghề cơ điện mỏ có chương trình dài hơn.",
      "Kỹ thuật khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng. Kỹ thuật cơ điện mỏ hầm lò học 10 tháng.");
  next = setLastReviewed(next);
  return setDateModified(next);
});

const reviewOnlyPaths = [
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
  contentModifiedDate,
  policyEffectiveDate,
  currentFactsEvergreen: true,
  touched: [...touched].sort(),
}, null, 2));

// Worker-question pages are generated earlier in the workflow. Normalize their
// AI-facing JSON and visible answers now, before search-index generation.
await import("./normalize-worker-question-facts-v11.mjs");

// Keep the verification pages, shared mobile contact bar and high-cost embeds
// aligned with this scope pass so the main pipeline only needs one entry point.
await import("./verification-core-v10.mjs");
