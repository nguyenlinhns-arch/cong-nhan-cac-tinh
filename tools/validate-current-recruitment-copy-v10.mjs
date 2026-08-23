import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const recruitment = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const canonicalFacts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const activeProfiles = recruitment.occupation_profiles.filter((profile) => profile.active_intake);
const errors = [];

const livingSupport = canonicalFacts.study_benefits?.living_support || "";
const incomeBase = canonicalFacts.after_training?.income || "";
const incomeNote = canonicalFacts.after_training?.income_note || "";
const incomeStatement = `${incomeBase}, ${String(incomeNote).replace(/^./u, (char) => char.toLocaleLowerCase("vi"))}`;
if (livingSupport !== "7,5 triệu đồng/tháng trong thời gian học") errors.push(`Canonical facts: living_support sai: ${livingSupport}`);
if (recruitment.income_commitment !== incomeStatement) errors.push("Master và canonical facts lệch cách ghi thu nhập");

const corePages = [
  "index.html",
  "thong-tin-tuyen-tho-mo/index.html",
  "trung-tam-nghe-mo/index.html",
  "viec-lam-nganh-than/index.html",
  "chia-se-thong-tin/index.html",
  "viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html",
  "hoc-nghe-mo-tai-quang-ninh/index.html",
  "kiem-tra-dieu-kien/index.html",
  "ho-so-nhap-hoc/index.html",
  "thu-nhap-an-o-ho-tro/index.html",
  "an-toan-ky-luat-moi-truong/index.html",
  "chon-kcn-hay-lam-mo/index.html",
  "cau-chuyen-cong-nhan/index.html",
  "lien-he-di-lam-mo-than-quang-ninh/index.html",
  ...activeProfiles.map((profile) => `viec-lam/${profile.slug}/index.html`),
];

const normalizeText = (html) => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/\s+/g, " ")
  .trim();

function add(relative, message) {
  errors.push(`${relative}: ${message}`);
}

const forbiddenCurrentCopy = [
  [/7[,.]5\s*triệu(?:\s*đồng)?\s+(?:là\s+)?tổng(?:\s+cả)?\s+khóa/iu, "còn cách hiểu sai 7,5 triệu đồng/tháng trong thời gian học"],
  [/7[,.]5\s*triệu\s*đồng(?!\s*\/\s*tháng)\s+trong thời gian học/iu, "hỗ trợ 7,5 triệu trong thời gian học nhưng thiếu /tháng"],
  [/(?:cam kết\s+)?(?:thu nhập\s+)?20[–-]25\s*triệu(?:\s*đồng)?\/tháng khi hoàn thành định mức lao động/iu, "còn cách ghi thu nhập cũ theo định mức lao động"],
  [/(?:hai|2)\s+nghề\s+(?:đang\s+)?(?:tuyển|tiếp nhận)/iu, "còn mô hình cũ hai nghề"],
  [/thời gian học hai nghề đang tuyển/iu, "còn mô tả thời gian của mô hình hai nghề"],
  [/18\s*[–-]\s*35\s*tuổi/iu, "còn mốc tuổi cũ 18–35"],
  [/special ad category/iu, "còn ghi chú vận hành quảng cáo nội bộ"],
  [/xem đủ\s+\d+\s+tỉnh,\s*thành/iu, "còn CTA gây hiểu nhầm số địa bàn ưu tiên là phạm vi toàn quốc"],
];

function validateCurrentFacts(relative, content) {
  const text = normalizeText(content);
  for (const [pattern, message] of forbiddenCurrentCopy) if (pattern.test(text)) add(relative, message);
  if (/7[,.]5\s*triệu/iu.test(text) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(text)) {
    add(relative, "có nhắc hỗ trợ 7,5 triệu nhưng thiếu đơn vị /tháng");
  }
  if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !text.includes(incomeBase)) {
    add(relative, "có nhắc 20–25 triệu nhưng thiếu cách ghi thu nhập bình quân hiện hành");
  }
  if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !/(tùy đơn vị|vị trí|ngày công|năng suất)/iu.test(text)) {
    add(relative, "có nhắc 20–25 triệu nhưng thiếu điều kiện biến động theo đơn vị/vị trí/ngày công/năng suất");
  }
}

for (const relative of corePages) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) {
    add(relative, "thiếu trang lõi");
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  validateCurrentFacts(relative, html);

  const text = normalizeText(html);
  if (/cơ điện mỏ[^.!?]{0,110}(?:dài hơn|lâu hơn)/iu.test(text) && !/cơ điện mỏ[^.!?]{0,110}10\s*tháng/iu.test(text)) {
    add(relative, "cơ điện mỏ còn mô tả mơ hồ thay vì ghi rõ 10 tháng");
  }
}

const factsPage = fs.readFileSync(path.join(site, "thong-tin-tuyen-tho-mo", "index.html"), "utf8");
for (const profile of activeProfiles) {
  const title = profile.title.toLocaleLowerCase("vi");
  if (!factsPage.toLocaleLowerCase("vi").includes(title)) add("thong-tin-tuyen-tho-mo/index.html", `thiếu nghề active: ${profile.title}`);
}
if (!factsPage.includes("cơ điện mỏ học 10 tháng")) add("thong-tin-tuyen-tho-mo/index.html", "FAQ chưa nêu cơ điện mỏ học 10 tháng");

const training = fs.readFileSync(path.join(site, "hoc-nghe-mo-tai-quang-ninh", "index.html"), "utf8");
for (const marker of ["2–3 tháng", "10 tháng"]) if (!training.includes(marker)) add("hoc-nghe-mo-tai-quang-ninh/index.html", `thiếu mốc đào tạo ${marker}`);

const shareTools = fs.readFileSync(path.join(site, "share-tools.js"), "utf8");
for (const marker of [
  "Ba nghề đang tiếp nhận",
  "2–3 tháng",
  "10 tháng",
  "7,5 triệu đồng/tháng trong thời gian học",
  "Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.",
]) {
  if (!shareTools.includes(marker)) add("share-tools.js", `thiếu nội dung chia sẻ chuẩn: ${marker}`);
}
if (/7[,.]5\s*triệu(?:\s*đồng)?\s+(?:là\s+)?tổng(?:\s+cả)?\s+khóa/iu.test(shareTools)) add("share-tools.js", "gói chia sẻ còn hiểu sai 7,5 triệu đồng/tháng trong thời gian học");

const machineFeeds = ["jobs.json", "jobs.xml", "jooble.xml"];
for (const relative of machineFeeds) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) {
    add(relative, "thiếu feed việc làm máy đọc");
    continue;
  }
  const content = fs.readFileSync(file, "utf8");
  validateCurrentFacts(relative, content);
}

const jobs = JSON.parse(fs.readFileSync(path.join(site, "jobs.json"), "utf8"));
if (!Array.isArray(jobs.jobs) || jobs.jobs.length !== activeProfiles.length) add("jobs.json", `cần ${activeProfiles.length} vị trí active`);
for (const profile of activeProfiles) {
  const job = jobs.jobs?.find((item) => item.id === profile.id);
  if (!job) {
    add("jobs.json", `thiếu vị trí ${profile.id}`);
    continue;
  }
  if (job.training_duration !== profile.training_duration_current) add("jobs.json", `${profile.id} sai thời gian học`);
  if (!String(job.description || "").includes("7,5 triệu đồng/tháng")) add("jobs.json", `${profile.id} chưa mô tả hỗ trợ 7,5 triệu đồng/tháng`);
  if (!String(job.description || "").includes(incomeBase)) add("jobs.json", `${profile.id} thiếu Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.`);
  if (!String(job.compensation?.note || "").includes(incomeBase)) add("jobs.json", `${profile.id} compensation.note lệch thu nhập canonical`);
}

if (errors.length) {
  console.error(JSON.stringify({
    status: "current-recruitment-copy-v10-invalid",
    canonicalFactsVersion: canonicalFacts.version,
    checkedPages: corePages.length,
    activeOccupations: activeProfiles.length,
    machineFeeds,
    errors,
  }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "current-recruitment-copy-v10-ready",
    canonicalFactsVersion: canonicalFacts.version,
    checkedPages: corePages.length,
    activeOccupations: activeProfiles.length,
    machineFeeds,
    support: livingSupport,
    income: incomeStatement,
    staleTwoRoleCopy: 0,
    errors: 0,
  }, null, 2));
}
