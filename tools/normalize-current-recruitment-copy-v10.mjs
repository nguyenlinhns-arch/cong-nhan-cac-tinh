import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const activeProfiles = master.occupation_profiles.filter((profile) => profile.active_intake);
const touched = [];

const wrongIncome = /Thu nhập bình quân 20[–-]25 triệu đồng\/tháng, tùy đơn vị, vị trí, ngày công và năng suất/giu;
const monthlySupport = /7[,.]5 triệu đồng\s*\/\s*tháng/giu;
const shortIncome = /20[–-]25 triệu\/tháng(?! khi hoàn thành định mức lao động)/giu;
const fullIncome = /20[–-]25 triệu đồng\/tháng(?! khi hoàn thành định mức lao động)/giu;

function normalizeString(value) {
  return String(value)
    .replace(monthlySupport, "7,5 triệu đồng trong thời gian học")
    .replace(wrongIncome, master.income_commitment)
    .replace(fullIncome, "20–25 triệu đồng/tháng khi hoàn thành định mức lao động")
    .replace(shortIncome, "20–25 triệu/tháng khi hoàn thành định mức lao động");
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
  if (monthlySupport.test(html)) throw new Error(`${profile.slug}: vẫn còn hỗ trợ 7,5 triệu đồng/tháng`);
  monthlySupport.lastIndex = 0;
  if (wrongIncome.test(html)) throw new Error(`${profile.slug}: vẫn còn cách ghi thu nhập cũ`);
  wrongIncome.lastIndex = 0;
  if (!html.includes(master.income_commitment)) throw new Error(`${profile.slug}: thiếu mức thu nhập hiện hành có điều kiện định mức`);
}

console.log(JSON.stringify({
  status: "current-recruitment-copy-v10-normalized",
  activeOccupations: activeProfiles.length,
  supportMeaning: "7.5M total during training",
  incomeCommitment: master.income_commitment,
  machineFeedsNormalized: ["jobs.json", "jobs.xml", "jooble.xml"],
  touched,
}, null, 2));
