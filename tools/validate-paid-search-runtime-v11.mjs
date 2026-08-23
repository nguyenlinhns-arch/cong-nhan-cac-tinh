import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const errors = [];
const support = facts.study_benefits.living_support;
const income = facts.after_training.income_commitment;
const canonicalFactsJson = "/data/recruitment-facts-2026.json";
const canonicalFactsUrl = `https://thaylinhtuyenthomo.vn${canonicalFactsJson}`;

if (support !== "7,5 triệu đồng/tháng trong thời gian học") errors.push(`Canonical support sai: ${support}`);
if (income !== master.income_commitment) errors.push(`Canonical income lệch master: ${income}`);

function walkStrings(value, visitor, pointer = "$") {
  if (typeof value === "string") return visitor(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkStrings(item, visitor, `${pointer}[${index}]`));
  if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) walkStrings(item, visitor, `${pointer}.${key}`);
}

const intentPath = path.join(site, "ad-landing-pages.json");
if (!fs.existsSync(intentPath)) errors.push("Thiếu ad-landing-pages.json");
else {
  const intent = JSON.parse(fs.readFileSync(intentPath, "utf8"));
  if (intent.schema_version !== 4) errors.push(`ad-landing-pages schema_version ${intent.schema_version} != 4`);
  if (intent.canonical_facts_version !== facts.version) errors.push(`ad-landing-pages canonical_facts_version ${intent.canonical_facts_version} != ${facts.version}`);
  if (intent.canonical_facts_confirmed_at !== facts.confirmed_at) errors.push("ad-landing-pages canonical_facts_confirmed_at sai");
  if (intent.canonical_facts_json !== canonicalFactsJson) errors.push("ad-landing-pages canonical_facts_json sai hoặc thiếu");
  if (intent.canonical_facts_url !== canonicalFactsUrl) errors.push("ad-landing-pages canonical_facts_url sai hoặc thiếu");
  for (const retired of ["canonicalFactsVersion", "canonicalFactsConfirmedAt", "canonicalFactsJson", "canonicalFactsUrl"]) {
    if (Object.hasOwn(intent, retired)) errors.push(`ad-landing-pages còn alias camelCase: ${retired}`);
  }
  if (JSON.stringify(intent.current_policy?.training) !== JSON.stringify(facts.training)) errors.push("ad-landing-pages training policy lệch facts");
  if (intent.current_policy?.living_support !== support) errors.push("ad-landing-pages living_support lệch facts");
  if (intent.current_policy?.income_commitment !== income) errors.push("ad-landing-pages income_commitment lệch facts");

  walkStrings(intent, (value, pointer) => {
    if (/7[,.]5\s*triệu/iu.test(value) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(value)) errors.push(`${pointer}: 7,5 triệu thiếu /tháng`);
    if (/20\s*[–-]\s*25\s*triệu/iu.test(value) && !/hoàn thành định mức lao động/iu.test(value)) errors.push(`${pointer}: 20–25 triệu thiếu điều kiện định mức`);
    if (/\bbình quân\s+20[–-]25\s*triệu/iu.test(value)) errors.push(`${pointer}: còn thu nhập bình quân legacy`);
    if (/tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/iu.test(value)) errors.push(`${pointer}: còn điều kiện thu nhập legacy`);
    if (/hai\s+nghề\s+(?:đang\s+)?(?:tuyển|tiếp nhận)/iu.test(value)) errors.push(`${pointer}: còn mô hình hai nghề`);
  });
}

const runtimePath = path.join(site, "google-search-intent.js");
if (!fs.existsSync(runtimePath)) errors.push("Thiếu google-search-intent.js");
else {
  const runtime = fs.readFileSync(runtimePath, "utf8");
  for (const marker of [
    `CANONICAL_FACTS_VERSION = ${facts.version}`,
    "7,5 triệu đồng/tháng",
    "20–25 triệu đồng/tháng khi hoàn thành định mức lao động",
  ]) {
    if (!runtime.includes(marker)) errors.push(`google-search-intent.js thiếu marker: ${marker}`);
  }
  const trainingPattern = /(?:Khai thác\s+(?:và|,)\s*xây dựng mỏ|Khai thác,\s*xây dựng mỏ)\s*:\s*2[–-]3 tháng\s*[.;]\s*Cơ điện mỏ\s*:\s*10 tháng/iu;
  if (!trainingPattern.test(runtime)) errors.push("google-search-intent.js chưa thể hiện đủ khai thác/xây dựng 2–3 tháng và cơ điện 10 tháng trong cùng facts block");
  if (/Cam kết 20[–-]25 triệu\/tháng/iu.test(runtime)) errors.push("google-search-intent.js còn câu Cam kết 20–25 triệu/tháng thiếu điều kiện");
  if (/20[–-]25 triệu\/tháng\.;/u.test(runtime)) errors.push("google-search-intent.js còn lỗi dấu câu .;");
}

const landingPath = path.join(site, "viec-lam", "cong-nhan-mo-ham-lo-quang-ninh", "index.html");
if (!fs.existsSync(landingPath)) errors.push("Thiếu landing paid-search canonical");
else {
  const html = fs.readFileSync(landingPath, "utf8");
  if (!/<script\b[^>]*src=["']\/google-search-intent\.js\?v=11["'][^>]*defer[^>]*><\/script>/iu.test(html)) errors.push("Landing chưa tải google-search-intent.js?v=11 bằng defer");
  if (/7[,.]5\s*triệu/iu.test(html) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(html)) errors.push("Landing có 7,5 triệu nhưng thiếu /tháng");
  if (/20\s*[–-]\s*25\s*triệu/iu.test(html) && !/hoàn thành định mức lao động/iu.test(html)) errors.push("Landing có 20–25 triệu nhưng thiếu điều kiện định mức");
  if (/\bbình quân\s+20[–-]25\s*triệu/iu.test(html)) errors.push("Landing còn thu nhập bình quân legacy");
}

console.log(JSON.stringify({
  status: errors.length ? "paid-search-runtime-v11-invalid" : "paid-search-runtime-v11-ready",
  canonicalFactsVersion: facts.version,
  canonicalFactsConfirmedAt: facts.confirmed_at,
  support,
  income,
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
