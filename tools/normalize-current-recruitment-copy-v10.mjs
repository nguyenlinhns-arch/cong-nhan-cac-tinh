import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const activeProfiles = master.occupation_profiles.filter((profile) => profile.active_intake);
const touched = [];

const livingSupport = facts.study_benefits?.living_support || "";
const incomeStatement = facts.after_training?.income_commitment
  || `${facts.after_training?.income || ""} ${facts.after_training?.income_condition || ""}`.trim();
if (livingSupport !== "7,5 triệu đồng/tháng trong thời gian học") {
  throw new Error(`normalize-current-recruitment-copy-v10: living_support canonical không hợp lệ: ${livingSupport}`);
}
if (incomeStatement !== "20–25 triệu đồng/tháng khi hoàn thành định mức lao động") {
  throw new Error(`normalize-current-recruitment-copy-v10: income canonical không hợp lệ: ${incomeStatement}`);
}
if (master.income_commitment !== incomeStatement) {
  throw new Error(`normalize-current-recruitment-copy-v10: master income lệch canonical facts: ${master.income_commitment} <> ${incomeStatement}`);
}
if (!master.benefits.some((item) => String(item).includes(livingSupport))) {
  throw new Error("normalize-current-recruitment-copy-v10: master benefits chưa chứa hỗ trợ 7,5 triệu đồng/tháng");
}

const totalCourseSupport = /7[,.]5 triệu(?: đồng)?(?:\s*\/\s*tháng)?\s*(?:là\s+)?tổng(?:\s+cả)?\s+khóa/giu;
// Put the negative look-ahead immediately after "triệu" so the optional
// "đồng" token cannot backtrack and accidentally turn an already-correct
// "7,5 triệu đồng/tháng" into a duplicated "/tháng" string.
const supportWithoutMonth = /7[,.]5 triệu(?!\s*(?:đồng\s*)?\/\s*tháng)(?: đồng)?/giu;
const averageIncome = /(?:thu nhập\s+)?bình quân\s+20[–-]25 triệu(?: đồng)?\s*\/\s*tháng(?:\s*,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất)?/giu;
const variableIncomeSuffix = /20[–-]25 triệu(?: đồng)?\s*\/\s*tháng\s*,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/giu;

function normalizeString(value) {
  return String(value)
    .replace(totalCourseSupport, livingSupport)
    .replace(supportWithoutMonth, "7,5 triệu đồng/tháng")
    .replace(averageIncome, incomeStatement)
    .replace(variableIncomeSuffix, incomeStatement);
}

function normalizeNode(node) {
  if (Array.isArray(node)) return node.map(normalizeNode);
  if (!node || typeof node !== "object") return typeof node === "string" ? normalizeString(node) : node;
  for (const [key, value] of Object.entries(node)) node[key] = normalizeNode(value);
  return node;
}

function mutateText(relative) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) throw new Error(`normalize-current-recruitment-copy-v10: thiếu ${relative}`);
  const before = fs.readFileSync(file, "utf8");
  const after = normalizeString(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    touched.push(relative);
  }
}

const currentPages = [
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
for (const relative of currentPages) mutateText(relative);
for (const relative of ["jobs.xml", "jooble.xml"]) mutateText(relative);

const jobsPath = path.join(site, "jobs.json");
if (!fs.existsSync(jobsPath)) throw new Error("normalize-current-recruitment-copy-v10: thiếu jobs.json");
const jobsBefore = fs.readFileSync(jobsPath, "utf8");
const jobs = normalizeNode(JSON.parse(jobsBefore));
const jobsAfter = `${JSON.stringify(jobs, null, 2)}\n`;
if (jobsAfter !== jobsBefore) {
  fs.writeFileSync(jobsPath, jobsAfter);
  touched.push("jobs.json");
}

for (const relative of currentPages) {
  const html = fs.readFileSync(path.join(site, relative), "utf8");
  totalCourseSupport.lastIndex = 0;
  if (totalCourseSupport.test(html)) throw new Error(`${relative}: còn cách hiểu sai 7,5 triệu là tổng cả khóa`);
  totalCourseSupport.lastIndex = 0;
  averageIncome.lastIndex = 0;
  if (averageIncome.test(html)) throw new Error(`${relative}: còn cách ghi thu nhập bình quân cũ`);
  averageIncome.lastIndex = 0;
  variableIncomeSuffix.lastIndex = 0;
  if (variableIncomeSuffix.test(html)) throw new Error(`${relative}: còn cách ghi thu nhập tùy đơn vị/vị trí/ngày công/năng suất`);
  variableIncomeSuffix.lastIndex = 0;
  if (/7[,.]5 triệu/iu.test(html) && !/7[,.]5 triệu(?: đồng)?\s*\/\s*tháng/iu.test(html)) {
    throw new Error(`${relative}: có nhắc 7,5 triệu nhưng thiếu đơn vị /tháng`);
  }
  if (/20[–-]25 triệu/iu.test(html) && !/hoàn thành định mức lao động/iu.test(html)) {
    throw new Error(`${relative}: có nhắc 20–25 triệu nhưng thiếu điều kiện hoàn thành định mức lao động`);
  }
}

console.log(JSON.stringify({
  status: "current-recruitment-copy-v10-normalized",
  canonicalFactsVersion: facts.version,
  activeOccupations: activeProfiles.length,
  currentPages: currentPages.length,
  supportMeaning: livingSupport,
  income: incomeStatement,
  forbiddenLegacyPhrases: facts.forbidden_legacy_phrases || [],
  machineFeedsNormalized: ["jobs.json", "jobs.xml", "jooble.xml"],
  idempotentMonthlySupport: true,
  touched,
}, null, 2));
