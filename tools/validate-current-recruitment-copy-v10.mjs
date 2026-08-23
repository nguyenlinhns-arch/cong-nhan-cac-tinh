import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const recruitment = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const activeProfiles = recruitment.occupation_profiles.filter((profile) => profile.active_intake);
const errors = [];

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
  [/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu, "hỗ trợ 7,5 triệu đồng/tháng bị ghi thành theo tháng"],
  [/(?:hai|2)\s+nghề\s+(?:đang\s+)?(?:tuyển|tiếp nhận)/iu, "còn mô hình cũ hai nghề"],
  [/thời gian học hai nghề đang tuyển/iu, "còn mô tả thời gian của mô hình hai nghề"],
  [/18\s*[–-]\s*35\s*tuổi/iu, "còn mốc tuổi cũ 18–35"],
  [/special ad category/iu, "còn ghi chú vận hành quảng cáo nội bộ"],
  [/xem đủ\s+\d+\s+tỉnh,\s*thành/iu, "còn CTA gây hiểu nhầm số địa bàn ưu tiên là phạm vi toàn quốc"],
];

function validateIncomeContext(relative, content) {
  for (const match of content.matchAll(/20\s*[–-]\s*25\s*triệu/giu)) {
    const index = match.index || 0;
    const window = content.slice(Math.max(0, index - 220), Math.min(content.length, index + 320));
    if (!/hoàn thành định mức lao động/iu.test(window)) {
      add(relative, `mức 20–25 triệu thiếu điều kiện hoàn thành định mức gần vị trí ${index}`);
      break;
    }
  }
}

for (const relative of corePages) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) {
    add(relative, "thiếu trang lõi");
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const text = normalizeText(html);

  for (const [pattern, message] of forbiddenCurrentCopy) if (pattern.test(text)) add(relative, message);

  if (/cơ điện mỏ[^.!?]{0,110}(?:dài hơn|lâu hơn)/iu.test(text) && !/cơ điện mỏ[^.!?]{0,110}10\s*tháng/iu.test(text)) {
    add(relative, "cơ điện mỏ còn mô tả mơ hồ thay vì ghi rõ 10 tháng");
  }

  validateIncomeContext(relative, html);
}

const facts = fs.readFileSync(path.join(site, "thong-tin-tuyen-tho-mo", "index.html"), "utf8");
for (const profile of activeProfiles) {
  const title = profile.title.toLocaleLowerCase("vi");
  if (!facts.toLocaleLowerCase("vi").includes(title)) add("thong-tin-tuyen-tho-mo/index.html", `thiếu nghề active: ${profile.title}`);
}
if (!facts.includes("cơ điện mỏ học 10 tháng")) add("thong-tin-tuyen-tho-mo/index.html", "FAQ chưa nêu cơ điện mỏ học 10 tháng");

const training = fs.readFileSync(path.join(site, "hoc-nghe-mo-tai-quang-ninh", "index.html"), "utf8");
for (const marker of ["2–3 tháng", "10 tháng"]) if (!training.includes(marker)) add("hoc-nghe-mo-tai-quang-ninh/index.html", `thiếu mốc đào tạo ${marker}`);

const shareTools = fs.readFileSync(path.join(site, "share-tools.js"), "utf8");
for (const marker of ["Ba nghề đang tiếp nhận", "2–3 tháng", "10 tháng", "7,5 triệu đồng trong thời gian học"]) {
  if (!shareTools.includes(marker)) add("share-tools.js", `thiếu nội dung chia sẻ chuẩn: ${marker}`);
}
if (/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(shareTools)) add("share-tools.js", "gói chia sẻ ghi sai hỗ trợ thành theo tháng");

const machineFeeds = ["jobs.json", "jobs.xml", "jooble.xml"];
for (const relative of machineFeeds) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) {
    add(relative, "thiếu feed việc làm máy đọc");
    continue;
  }
  const content = fs.readFileSync(file, "utf8");
  if (/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(content)) add(relative, "feed còn ghi hỗ trợ 7,5 triệu đồng/tháng");
  if (/Thu nhập bình quân 20[–-]25 triệu đồng\/tháng, tùy đơn vị, vị trí, ngày công và năng suất/iu.test(content)) add(relative, "feed còn cách ghi thu nhập cũ");
  validateIncomeContext(relative, content);
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
  if (job.compensation?.condition !== "Hoàn thành định mức lao động") add("jobs.json", `${profile.id} thiếu điều kiện thu nhập`);
  if (!String(job.description || "").includes("7,5 triệu đồng trong thời gian học")) add("jobs.json", `${profile.id} chưa mô tả đúng ý nghĩa hỗ trợ 7,5 triệu`);
}

if (errors.length) {
  console.error(JSON.stringify({
    status: "current-recruitment-copy-v10-invalid",
    checkedPages: corePages.length,
    activeOccupations: activeProfiles.length,
    machineFeeds,
    errors,
  }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "current-recruitment-copy-v10-ready",
    checkedPages: corePages.length,
    activeOccupations: activeProfiles.length,
    machineFeeds,
    supportUnit: "7.5M total during training",
    incomeConditionProtected: true,
    staleTwoRoleCopy: 0,
    errors: 0,
  }, null, 2));
}
