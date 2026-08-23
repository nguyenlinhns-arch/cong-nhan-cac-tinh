import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const facts = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-facts-2026.json"), "utf8"));
const publicFacts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const errors = [];

const canonicalFactsJson = "/data/recruitment-facts-2026.json";
const canonicalFactsUrl = `https://thaylinhtuyenthomo.vn${canonicalFactsJson}`;
const supportNeedle = "7,5 triệu đồng/tháng";
const incomeNeedle = "hoàn thành định mức lao động";

if (facts.version !== publicFacts.version) errors.push("Public facts version lệch source facts");
if (facts.confirmed_at !== publicFacts.confirmed_at) errors.push("Public facts confirmed_at lệch source facts");
if (master.updated_at !== facts.confirmed_at) errors.push(`Master timestamp ${master.updated_at} != facts ${facts.confirmed_at}`);
if (master.income_commitment !== facts.after_training.income_commitment) errors.push("Master income commitment lệch canonical facts");

const jobsPath = path.join(site, "jobs.json");
if (!fs.existsSync(jobsPath)) errors.push("Thiếu jobs.json");
else {
  const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf8"));
  if (jobs.canonical_facts_version !== facts.version) errors.push(`jobs.json canonical_facts_version ${jobs.canonical_facts_version} != ${facts.version}`);
  if (jobs.canonical_facts_confirmed_at !== facts.confirmed_at) errors.push("jobs.json canonical_facts_confirmed_at sai");
  if (jobs.canonical_facts_json !== canonicalFactsJson) errors.push("jobs.json canonical_facts_json sai");
  if (jobs.canonical_facts_url !== canonicalFactsUrl) errors.push("jobs.json canonical_facts_url sai");
  if (jobs.updated_at !== facts.confirmed_at) errors.push("jobs.json updated_at chưa theo facts confirmed_at");
  if ((jobs.jobs || []).length !== 3) errors.push(`jobs.json phải có 3 nghề, hiện có ${(jobs.jobs || []).length}`);
  for (const job of jobs.jobs || []) {
    const text = JSON.stringify(job).toLocaleLowerCase("vi");
    if (!text.includes(supportNeedle.toLocaleLowerCase("vi"))) errors.push(`${job.id}: thiếu hỗ trợ theo tháng`);
    if (!text.includes(incomeNeedle.toLocaleLowerCase("vi"))) errors.push(`${job.id}: thiếu điều kiện định mức`);
  }
}

function validateXml(relative, { generatedAt = false } = {}) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) {
    errors.push(`Thiếu ${relative}`);
    return;
  }
  const text = fs.readFileSync(file, "utf8");
  const rootTag = text.match(/<jobs\b[^>]*>/u)?.[0] || "";
  const requireAttr = (name, value) => {
    const escaped = String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`${name}="${escaped}"`, "u").test(rootTag)) errors.push(`${relative}: ${name} sai hoặc thiếu`);
  };
  if (generatedAt) requireAttr("generatedAt", facts.confirmed_at);
  requireAttr("canonicalFactsVersion", facts.version);
  requireAttr("canonicalFactsConfirmedAt", facts.confirmed_at);
  requireAttr("canonicalFactsJson", canonicalFactsJson);
  requireAttr("canonicalFactsUrl", canonicalFactsUrl);
  const count = (text.match(/<job\s+id=/gu) || []).length;
  if (count !== 3) errors.push(`${relative}: phải có 3 job, hiện có ${count}`);
  const normalized = text.toLocaleLowerCase("vi");
  if (!normalized.includes(supportNeedle.toLocaleLowerCase("vi"))) errors.push(`${relative}: thiếu hỗ trợ 7,5 triệu đồng/tháng`);
  if (!normalized.includes(incomeNeedle.toLocaleLowerCase("vi"))) errors.push(`${relative}: thiếu điều kiện thu nhập định mức`);
}

validateXml("jobs.xml", { generatedAt: true });
validateXml("jooble.xml");

const all = ["jobs.json", "jobs.xml", "jooble.xml"]
  .filter((name) => fs.existsSync(path.join(site, name)))
  .map((name) => fs.readFileSync(path.join(site, name), "utf8"))
  .join("\n")
  .toLocaleLowerCase("vi");
for (const legacy of [
  "bình quân 20–25 triệu",
  "tùy đơn vị, vị trí, ngày công và năng suất",
  "7,5 triệu là tổng cả khóa",
  "hai nghề đang tiếp nhận",
]) {
  if (all.includes(legacy.toLocaleLowerCase("vi"))) errors.push(`Machine feed còn legacy: ${legacy}`);
}

console.log(JSON.stringify({
  status: errors.length ? "machine-feeds-v11-invalid" : "machine-feeds-v11-ready",
  canonicalFactsVersion: facts.version,
  canonicalFactsConfirmedAt: facts.confirmed_at,
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
