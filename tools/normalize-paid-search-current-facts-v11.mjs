import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const target = path.join(site, "ad-landing-pages.json");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));

const support = facts.study_benefits?.living_support || "";
const income = facts.after_training?.income_commitment
  || `${facts.after_training?.income || ""} ${facts.after_training?.income_condition || ""}`.trim();
if (support !== "7,5 triệu đồng/tháng trong thời gian học") throw new Error(`Paid search facts: support canonical sai: ${support}`);
if (income !== master.income_commitment) throw new Error(`Paid search facts: income canonical lệch master: ${income}`);
if (!fs.existsSync(target)) throw new Error("Paid search facts: thiếu ad-landing-pages.json");

const supportWithoutMonth = /7[,.]5 triệu(?!\s*(?:đồng\s*)?\/\s*tháng)(?:\s*đồng)?/giu;
const averageIncome = /(?:thu nhập\s+)?bình quân\s+20[–-]25 triệu(?: đồng)?\s*\/\s*tháng(?:\s*,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất)?/giu;
const variableIncome = /20[–-]25 triệu(?: đồng)?\s*\/\s*tháng\s*,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/giu;
const twoRoleTraining = /khai thác(?: mỏ)?(?: hầm lò)?\s+(?:hoặc|và)\s+xây dựng(?: mỏ)?(?: hầm lò)?(?:\s+học)?\s+2[–-]3 tháng/giu;

function normalizeString(value) {
  return String(value)
    .replace(supportWithoutMonth, "7,5 triệu đồng/tháng")
    .replace(averageIncome, income)
    .replace(variableIncome, income)
    .replace(twoRoleTraining, "khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng");
}

function normalizeNode(value) {
  if (typeof value === "string") return normalizeString(value);
  if (Array.isArray(value)) return value.map(normalizeNode);
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) value[key] = normalizeNode(item);
  }
  return value;
}

function walkStrings(value, visit, pointer = "$") {
  if (typeof value === "string") return visit(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkStrings(item, visit, `${pointer}[${index}]`));
  if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) walkStrings(item, visit, `${pointer}.${key}`);
}

const data = JSON.parse(fs.readFileSync(target, "utf8"));
normalizeNode(data);
data.canonicalFactsVersion = facts.version;
data.canonicalFactsConfirmedAt = facts.confirmed_at;
data.canonicalFactsJson = "/data/recruitment-facts-2026.json";

const errors = [];
walkStrings(data, (value, pointer) => {
  const text = String(value);
  if (/7[,.]5\s*triệu/iu.test(text) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(text)) errors.push(`${pointer}: 7,5 triệu thiếu /tháng`);
  if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !/hoàn thành định mức lao động/iu.test(text)) errors.push(`${pointer}: 20–25 triệu thiếu điều kiện định mức`);
  if (/\bbình quân\s+20[–-]25\s*triệu/iu.test(text)) errors.push(`${pointer}: còn thu nhập bình quân legacy`);
  if (/tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/iu.test(text)) errors.push(`${pointer}: còn điều kiện thu nhập legacy`);
  if (/hai\s+nghề\s+(?:đang\s+)?(?:tuyển|tiếp nhận)/iu.test(text)) errors.push(`${pointer}: còn mô hình hai nghề`);
});

if (data.canonicalFactsVersion !== facts.version) errors.push("Thiếu canonicalFactsVersion");
if (data.canonicalFactsJson !== "/data/recruitment-facts-2026.json") errors.push("Sai canonicalFactsJson");

if (errors.length) {
  console.error(JSON.stringify({status:"paid-search-current-facts-v11-invalid", canonicalFactsVersion:facts.version, errors}, null, 2));
  process.exitCode = 1;
} else {
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
  console.log(JSON.stringify({status:"paid-search-current-facts-v11-ready", canonicalFactsVersion:facts.version, support, income}, null, 2));
}
