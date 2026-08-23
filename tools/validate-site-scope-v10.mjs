import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const priority = JSON.parse(fs.readFileSync(path.join(site, "data", "provinces-2026.json"), "utf8"));
const recruitment = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const priorityCount = priority.provinces.length;
const activeProfiles = recruitment.occupation_profiles.filter((profile) => profile.active_intake);
const occupationCount = activeProfiles.length;
const reviewDate = review.reviewed_at;
const displayReviewDate = reviewDate.split("-").reverse().join("/");
const errors = [];

const read = (relative) => fs.readFileSync(path.join(site, relative), "utf8");
const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(`${label}: thiếu ${text}`);
};

const home = read("index.html");
requireText(home, `Xem ${priorityCount} địa bàn ưu tiên →`, "Trang chủ");
if (/Xem đủ \d+ tỉnh, thành/.test(home)) errors.push("Trang chủ: còn nhãn 'Xem đủ ... tỉnh, thành' gây hiểu nhầm phạm vi ưu tiên là toàn quốc");

const jobs = read("viec-lam-nganh-than/index.html");
requireText(jobs, `Chọn ${priorityCount} địa bàn ưu tiên`, "Hub việc làm theo tỉnh");
for (const profile of activeProfiles) requireText(jobs, `/viec-lam/${profile.slug}/`, "Hub việc làm theo tỉnh");
if (/\bHai nghề\b|\bhai nghề\b/.test(jobs)) errors.push("Hub việc làm theo tỉnh: còn mô hình cũ hai nghề");
if (/\b\d+ tỉnh, thành\b/.test(jobs) && !jobs.includes(recruitment.candidate_scope)) {
  errors.push("Hub việc làm theo tỉnh: còn cách ghi số tỉnh/thành không phân biệt phạm vi toàn quốc và địa bàn ưu tiên");
}

const scripts = [...jobs.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
let itemList = null;
for (const source of scripts) {
  try {
    const parsed = JSON.parse(source);
    itemList = parsed?.["@graph"]?.find((node) => node?.["@type"] === "ItemList") || itemList;
  } catch {}
}
const expectedItems = priorityCount + occupationCount;
if (!itemList) errors.push("Hub việc làm theo tỉnh: thiếu ItemList schema");
else if (Number(itemList.numberOfItems) !== expectedItems) errors.push(`Hub việc làm theo tỉnh: ItemList=${itemList.numberOfItems}, cần ${expectedItems}`);

const share = read("chia-se-thong-tin/index.html");
requireText(share, `theo ${priorityCount} địa bàn ưu tiên và toàn quốc`, "Bộ chia sẻ");
requireText(share, `>${priorityCount + 1} GÓI NỘI DUNG<`, "Bộ chia sẻ");

const shareTools = read("share-tools.js");
requireText(shareTools, "Ba nghề đang tiếp nhận: khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng.", "Gói chia sẻ tự động");
requireText(shareTools, "Không yêu cầu kinh nghiệm làm mỏ sẵn có", "Gói chia sẻ tự động");
if (shareTools.includes("Học nghề khai thác mỏ hoặc xây dựng mỏ trong 2–3 tháng.")) errors.push("Gói chia sẻ tự động: còn nội dung cũ chỉ có hai nghề");

const job = read("viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html");
requireText(job, "khai thác, xây dựng hoặc cơ điện mỏ hầm lò", "Tin tuyển dụng chính");
if (job.includes(">34 tỉnh, thành<")) errors.push("Tin tuyển dụng chính: menu còn dùng 34 tỉnh, thành như thể có 34 trang địa phương ưu tiên");

const training = read("hoc-nghe-mo-tai-quang-ninh/index.html");
requireText(training, "Khai thác/xây dựng 2–3 tháng · cơ điện 10 tháng", "Trang học nghề");
requireText(training, "nghề cơ điện mỏ hầm lò học 10 tháng", "Trang học nghề");
if (/cơ điện mỏ có (?:lộ trình|chương trình) dài hơn/i.test(training)) errors.push("Trang học nghề: còn mô tả mơ hồ thay vì thời gian cơ điện 10 tháng");

const facts = read("thong-tin-tuyen-tho-mo/index.html");
requireText(facts, `<time datetime="${reviewDate}">${displayReviewDate}</time>`, "Trang thông tin tuyển đang áp dụng");

const reviewPaths = [
  "thong-tin-tuyen-tho-mo/index.html",
  "viec-lam-nganh-than/index.html",
  "trung-tam-nghe-mo/index.html",
  "chia-se-thong-tin/index.html",
  "viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html",
  "hoc-nghe-mo-tai-quang-ninh/index.html",
  "kiem-tra-dieu-kien/index.html",
  "thu-nhap-an-o-ho-tro/index.html",
  "lien-he-di-lam-mo-than-quang-ninh/index.html",
  ...activeProfiles.map((profile) => `viec-lam/${profile.slug}/index.html`),
];
for (const relative of reviewPaths) {
  const html = read(relative);
  if (!new RegExp(`"lastReviewed"\\s*:\\s*"${reviewDate}"`).test(html)) errors.push(`${relative}: lastReviewed chưa đồng bộ ${reviewDate}`);
}

if (!String(recruitment.candidate_scope || "").includes("34 tỉnh, thành")) {
  errors.push("Nguồn tuyển: candidate_scope không còn ghi phạm vi toàn quốc 34 tỉnh, thành");
}
if (!String(priority.source_scope || "").includes(`${priorityCount} tỉnh, thành`)) {
  errors.push("Nguồn địa bàn ưu tiên: source_scope không khớp số trang ưu tiên");
}

if (errors.length) {
  console.error(JSON.stringify({status: "site-scope-v10-invalid", priorityCount, occupationCount, reviewDate, errors}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "site-scope-v10-ready",
    candidateScope: recruitment.candidate_scope,
    priorityLocalities: priorityCount,
    activeOccupations: occupationCount,
    itemListItems: expectedItems,
    reviewedAt: reviewDate,
    errors: 0,
  }, null, 2));
}

await import("./validate-verification-core-v10.mjs");
