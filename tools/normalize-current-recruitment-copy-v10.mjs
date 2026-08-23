import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const activeProfiles = master.occupation_profiles.filter((profile) => profile.active_intake);
const touched = [];

const livingSupport = facts.study_benefits?.living_support || "";
const incomeStatement = `${facts.after_training?.income || ""}, ${String(facts.after_training?.income_note || "").replace(/^./u, (char) => char.toLocaleLowerCase("vi"))}`;
if (livingSupport !== "7,5 triệu đồng/tháng trong thời gian học") {
  throw new Error(`normalize-current-recruitment-copy-v10: living_support canonical không hợp lệ: ${livingSupport}`);
}
if (master.income_commitment !== incomeStatement) {
  throw new Error(`normalize-current-recruitment-copy-v10: master income lệch canonical facts: ${master.income_commitment} <> ${incomeStatement}`);
}
if (!master.benefits.some((item) => String(item).includes(livingSupport))) {
  throw new Error("normalize-current-recruitment-copy-v10: master benefits chưa chứa hỗ trợ 7,5 triệu đồng/tháng");
}

const totalOnlySupport = /7[,.]5 triệu đồng(?!\s*\/\s*tháng)\s+trong thời gian học/giu;
const totalCourseSupport = /7[,.]5 triệu(?: đồng)?\s+(?:là\s+)?tổng(?:\s+cả)?\s+khóa/giu;
const legacyIncomeNorm = /(?:Cam kết\s+)?(?:thu nhập\s+)?20[–-]25 triệu(?: đồng)?\/tháng khi hoàn thành định mức lao động/giu;

function normalizeString(value) {
  return String(value)
    .replace(totalOnlySupport, livingSupport)
    .replace(totalCourseSupport, livingSupport)
    .replace(legacyIncomeNorm, incomeStatement);
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

for (const profile of activeProfiles) mutateText(`viec-lam/${profile.slug}/index.html`);
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

for (const profile of activeProfiles) {
  const html = fs.readFileSync(path.join(site, "viec-lam", profile.slug, "index.html"), "utf8");
  if (totalOnlySupport.test(html) || totalCourseSupport.test(html)) throw new Error(`${profile.slug}: còn cách hiểu 7,5 triệu là tổng cả khóa`);
  totalOnlySupport.lastIndex = 0;
  totalCourseSupport.lastIndex = 0;
  if (legacyIncomeNorm.test(html)) throw new Error(`${profile.slug}: còn điều kiện thu nhập cũ theo định mức`);
  legacyIncomeNorm.lastIndex = 0;
  if (!html.includes("7,5 triệu đồng/tháng")) throw new Error(`${profile.slug}: thiếu hỗ trợ 7,5 triệu đồng/tháng`);
  if (!html.includes(facts.after_training.income)) throw new Error(`${profile.slug}: thiếu thu nhập bình quân 20–25 triệu đồng/tháng`);
}

console.log(JSON.stringify({
  status: "current-recruitment-copy-v10-normalized",
  canonicalFactsVersion: facts.version,
  activeOccupations: activeProfiles.length,
  supportMeaning: livingSupport,
  income: incomeStatement,
  machineFeedsNormalized: ["jobs.json", "jobs.xml", "jooble.xml"],
  touched,
}, null, 2));
