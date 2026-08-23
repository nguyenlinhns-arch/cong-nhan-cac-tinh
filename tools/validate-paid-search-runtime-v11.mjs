import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const errors = [];
const support = facts.study_benefits.living_support;
const income = facts.after_training.income_commitment;

if (support !== "7,5 triệu đồng/tháng trong thời gian học") errors.push(`Canonical support sai: ${support}`);
if (income !== master.income_commitment) errors.push(`Canonical income lệch master: ${income}`);

function walkStrings(value, visitor, pointer = "$") {
  if (typeof value === "string") return visitor(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkStrings(item, visitor, `${pointer}[${index}]`));
  if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) walkStrings(item, visitor, `${pointer}.${key}`);
}

function checkPolicyString(value, label) {
  const text = String(value);
  if (/7[,.]5\s*triệu/iu.test(text) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(text)) errors.push(`${label}: 7,5 triệu thiếu /tháng`);
  if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !/hoàn thành định mức lao động/iu.test(text)) errors.push(`${label}: 20–25 triệu thiếu điều kiện định mức`);
  if (/\bbình quân\s+20[–-]25\s*triệu/iu.test(text)) errors.push(`${label}: còn thu nhập bình quân legacy`);
  if (/tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/iu.test(text)) errors.push(`${label}: còn điều kiện thu nhập legacy`);
  if (/7[,.]5\s*triệu(?:\s*đồng)?(?:\s*\/\s*tháng)?\s+(?:là\s+)?tổng(?:\s+cả)?\s+khóa/iu.test(text)) errors.push(`${label}: còn cách hiểu 7,5 triệu tổng cả khóa`);
  if (/(?:hai|2)\s+nghề\s+(?:đang\s+)?(?:tuyển|tiếp nhận)/iu.test(text)) errors.push(`${label}: còn mô hình hai nghề`);
}

const intentPath = path.join(site, "ad-landing-pages.json");
if (!fs.existsSync(intentPath)) errors.push("Thiếu ad-landing-pages.json");
else {
  const intent = JSON.parse(fs.readFileSync(intentPath, "utf8"));
  walkStrings(intent, (value, pointer) => checkPolicyString(value, `ad-landing-pages.json ${pointer}`));
  if (intent.canonicalFactsVersion !== undefined && intent.canonicalFactsVersion !== facts.version) errors.push(`ad-landing-pages.json facts version ${intent.canonicalFactsVersion} != ${facts.version}`);
  if (intent.canonicalFactsJson !== undefined && intent.canonicalFactsJson !== "/data/recruitment-facts-2026.json") errors.push("ad-landing-pages.json canonicalFactsJson sai");
}

const runtimePath = path.join(site, "google-search-intent.js");
if (!fs.existsSync(runtimePath)) errors.push("Thiếu google-search-intent.js");
else {
  const runtime = fs.readFileSync(runtimePath, "utf8");
  try { new vm.Script(runtime, {filename: "google-search-intent.js"}); }
  catch (error) { errors.push(`google-search-intent.js lỗi cú pháp: ${error.message}`); }
  checkPolicyString(runtime, "google-search-intent.js");
  for (const forbidden of ["18–35", "1m56", "48kg"]) if (runtime.includes(forbidden)) errors.push(`google-search-intent.js còn điều kiện cũ ${forbidden}`);
}

const landingPath = path.join(site, "viec-lam", "cong-nhan-mo-ham-lo-quang-ninh", "index.html");
if (!fs.existsSync(landingPath)) errors.push("Thiếu landing tuyển dụng chính");
else {
  const landing = fs.readFileSync(landingPath, "utf8");
  if (!landing.includes("google-search-intent.css?v=1") && !fs.readFileSync(path.join(site, "analytics.js"), "utf8").includes("google-search-intent.js?v=1")) {
    errors.push("Paid-search runtime không còn được nạp trên landing Google Ads");
  }
  checkPolicyString(landing.replace(/<script[\s\S]*?<\/script>/gi, " "), "paid landing visible copy");
}

console.log(JSON.stringify({
  status: errors.length ? "paid-search-runtime-v11-invalid" : "paid-search-runtime-v11-ready",
  canonicalFactsVersion: facts.version,
  support,
  income,
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
