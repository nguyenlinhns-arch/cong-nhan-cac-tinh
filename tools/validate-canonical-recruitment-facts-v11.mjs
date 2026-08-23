import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const factsPath = path.join(site, "data", "recruitment-facts-2026.json");
const masterPath = path.join(root, "operations", "job-posting-master-2026.json");
const currentPath = path.join(site, "recruitment-current.json");
const reviewPath = path.join(root, "content", "recruitment-review-v10.json");

const facts = JSON.parse(fs.readFileSync(factsPath, "utf8"));
const master = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const current = JSON.parse(fs.readFileSync(currentPath, "utf8"));
const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
const errors = [];

const add = (message) => errors.push(message);
const eq = (actual, expected, label) => {
  if (actual !== expected) add(`${label}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
};

if (Number(facts.version) < 8) add(`recruitment-facts version quá cũ: ${facts.version}`);
if (facts.status !== "confirmed_by_user") add(`recruitment-facts chưa ở trạng thái confirmed_by_user: ${facts.status}`);
if (Number(master.version) < 12) add(`job-posting master version quá cũ: ${master.version}`);
if (!String(facts.confirmed_at || "").startsWith("2026-08-23")) add(`confirmed_at không phải mốc xác nhận hiện hành 23/08/2026: ${facts.confirmed_at}`);
eq(master.updated_at, facts.confirmed_at, "master.updated_at vs facts.confirmed_at");
eq(current.updated_at, String(facts.confirmed_at || "").slice(0, 10), "recruitment-current.updated_at");
eq(review.canonical_facts_version, facts.version, "review canonical_facts_version");
eq(review.canonical_facts_confirmed_at, facts.confirmed_at, "review canonical_facts_confirmed_at");
eq(review.job_master_version, master.version, "review job_master_version");

for (const [key, masterValue] of [
  ["gender", master.criteria.gender],
  ["age_min", master.criteria.age_min],
  ["age_max", master.criteria.age_max],
  ["height_min_cm", master.criteria.height_min_cm],
  ["weight_min_kg", master.criteria.weight_min_kg],
]) eq(facts.candidate?.[key], masterValue, `candidate.${key}`);

const activeProfiles = master.occupation_profiles.filter((profile) => profile.active_intake);
eq(activeProfiles.length, 3, "active occupation count");
const expectedDurations = new Map([
  ["Kỹ thuật khai thác mỏ hầm lò", facts.training?.khai_thac_mo],
  ["Kỹ thuật xây dựng mỏ hầm lò", facts.training?.xay_dung_mo],
  ["Kỹ thuật cơ điện mỏ hầm lò", facts.training?.co_dien_mo],
]);
for (const profile of activeProfiles) {
  if (!expectedDurations.has(profile.title)) add(`master có nghề active ngoài canonical facts: ${profile.title}`);
  else eq(profile.training_duration_current, expectedDurations.get(profile.title), `duration ${profile.title}`);
}

const livingSupport = facts.study_benefits?.living_support || "";
const incomeCommitment = facts.after_training?.income_commitment
  || `${facts.after_training?.income || ""} ${facts.after_training?.income_condition || ""}`.trim();
eq(livingSupport, "7,5 triệu đồng/tháng trong thời gian học", "canonical living support");
eq(incomeCommitment, "20–25 triệu đồng/tháng khi hoàn thành định mức lao động", "canonical income commitment");
eq(master.income_commitment, incomeCommitment, "master income_commitment");
eq(master.income_reference, incomeCommitment, "master income_reference");
if (!master.benefits.some((item) => String(item).includes(livingSupport))) add("master benefits thiếu living_support canonical");

const currentTraining = new Map((current.training || []).map((item) => [item.trade, item.duration]));
for (const [title, duration] of expectedDurations) eq(currentTraining.get(title), duration, `recruitment-current duration ${title}`);
eq(current.benefits_during_training?.living_support, livingSupport, "recruitment-current living_support");
eq(current.after_training?.income_commitment, incomeCommitment, "recruitment-current income_commitment");
eq(current.after_training?.income_reference, incomeCommitment, "recruitment-current income_reference");
eq(current.canonical_facts, "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json", "recruitment-current canonical_facts");
eq(current.contact?.messenger, "https://m.me/thaylinhtuyenthomo", "recruitment-current messenger");
eq(String(current.contact?.phone || "").replace(/\s+/g, ""), "0963048585", "recruitment-current phone");

const forbidden = Array.isArray(facts.forbidden_legacy_phrases) ? facts.forbidden_legacy_phrases : [];
const {usage_note: usageNote, ...currentWithoutUsage} = current;
const currentPolicyText = JSON.stringify(currentWithoutUsage).toLocaleLowerCase("vi");
for (const phrase of forbidden) {
  if (phrase && currentPolicyText.includes(String(phrase).toLocaleLowerCase("vi"))) {
    add(`recruitment-current còn legacy phrase ngoài usage_note: ${phrase}`);
  }
}
if (!String(usageNote || "").includes(livingSupport)) add("recruitment-current usage_note thiếu hỗ trợ canonical");
if (!String(usageNote || "").includes(incomeCommitment)) add("recruitment-current usage_note thiếu thu nhập canonical");
if (!/tổng cả khóa/iu.test(String(usageNote || ""))) add("recruitment-current usage_note chưa cảnh báo cách hiểu 7,5 triệu đồng/tháng trong thời gian học");

const shareTools = fs.readFileSync(path.join(site, "share-tools.js"), "utf8");
for (const marker of [
  livingSupport,
  incomeCommitment,
  "Ba nghề đang tiếp nhận: khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng.",
]) if (!shareTools.includes(marker)) add(`share-tools thiếu canonical marker: ${marker}`);

const answers = fs.readFileSync(path.join(root, "tools", "recruitment-answers.mjs"), "utf8");
for (const marker of [
  "7,5 triệu đồng/tháng trong thời gian học",
  "recruitment.income_commitment",
  "hoàn thành định mức lao động",
]) if (!answers.includes(marker)) add(`recruitment-answers thiếu canonical marker: ${marker}`);
for (const phrase of ["bình quân 20–25 triệu", "tùy đơn vị, vị trí, ngày công và năng suất"]) {
  if (answers.toLocaleLowerCase("vi").includes(phrase)) add(`recruitment-answers còn legacy phrase: ${phrase}`);
}

const supplementPath = path.join(root, "content", "daily-seo-supplements-20260823.json");
if (fs.existsSync(supplementPath)) {
  const supplement = fs.readFileSync(supplementPath, "utf8");
  if (!supplement.includes(livingSupport)) add("SEO 23/08 thiếu hỗ trợ 7,5 triệu đồng/tháng");
  if (!supplement.includes(incomeCommitment)) add("SEO 23/08 thiếu thu nhập canonical");
  for (const phrase of ["bình quân 20–25 triệu", "tùy đơn vị, vị trí, ngày công và năng suất"]) {
    if (supplement.toLocaleLowerCase("vi").includes(phrase)) add(`SEO 23/08 còn legacy phrase: ${phrase}`);
  }
}

if (errors.length) {
  console.error(JSON.stringify({
    status: "canonical-recruitment-facts-v11-invalid",
    factsVersion: facts.version,
    masterVersion: master.version,
    reviewSchemaVersion: review.schema_version,
    errors,
  }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "canonical-recruitment-facts-v11-ready",
    factsVersion: facts.version,
    masterVersion: master.version,
    reviewSchemaVersion: review.schema_version,
    confirmedAt: facts.confirmed_at,
    activeOccupations: activeProfiles.length,
    support: livingSupport,
    income: incomeCommitment,
    errors: 0,
  }, null, 2));
}
