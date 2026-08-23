import fs from "node:fs";
import path from "node:path";

// Converge the outward-facing paid-search and province surfaces first. These
// normalizers are deterministic build steps; validators remain read-only.
await import("./normalize-paid-search-current-facts-v11.mjs");
if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode);
await import("./prepare-province-legacy-templates-v11.mjs");
if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode);
await import("./normalize-province-current-facts-v11.mjs");
if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode);
await import("./normalize-province-internal-links-v11.mjs");
if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode);

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const facts = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-facts-2026.json"), "utf8"));
const publicFacts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));

const canonicalFactsJson = "/data/recruitment-facts-2026.json";
const canonicalFactsUrl = `https://thaylinhtuyenthomo.vn${canonicalFactsJson}`;
const canonicalIncome = facts.after_training.income_commitment;
const errors = [];

if (facts.version !== publicFacts.version) errors.push(`Facts version lệch public copy: ${facts.version} != ${publicFacts.version}`);
if (facts.confirmed_at !== publicFacts.confirmed_at) errors.push(`Facts confirmed_at lệch public copy: ${facts.confirmed_at} != ${publicFacts.confirmed_at}`);
if (master.updated_at !== facts.confirmed_at) errors.push(`job-posting-master.updated_at ${master.updated_at} != facts.confirmed_at ${facts.confirmed_at}`);
if (master.income_commitment !== canonicalIncome) errors.push("Income commitment trong master lệch facts canonical");
if (!String(master.benefits || []).includes("7,5 triệu đồng/tháng")) errors.push("Master không còn hỗ trợ 7,5 triệu đồng/tháng");

if (errors.length) {
  console.error(JSON.stringify({ status: "machine-feed-normalize-blocked", errors }, null, 2));
  process.exit(1);
}

function normalizeVisibleIncome(html) {
  return html.replace(/>([^<>]*20[–-]25\s*triệu[^<>]*)</giu, (full, nodeText) => {
    if (/hoàn thành định mức lao động/iu.test(nodeText)) return full;
    let normalized = nodeText
      .replace(/20[–-]25\s*triệu\s*đồng\s*\/\s*tháng/giu, canonicalIncome)
      .replace(/20[–-]25\s*triệu\s*\/\s*tháng/giu, canonicalIncome)
      .replace(/20[–-]25\s*triệu\s*đồng(?!\s*\/\s*tháng)/giu, canonicalIncome)
      .replace(/20[–-]25\s*triệu(?!\s*(?:đồng|\/))/giu, canonicalIncome);
    if (!/hoàn thành định mức lao động/iu.test(normalized)) {
      normalized = `${normalized.replace(/[.\s]+$/u, "")} khi hoàn thành định mức lao động.`;
    }
    return `>${normalized}<`;
  });
}

// The job-board generator owns structural HTML. Normalize policy copy and load
// the paid-search intent adapter on the canonical campaign landing after every
// rebuild so Google Ads traffic cannot silently lose its fast-answer layer.
const paidLanding = path.join(site, "viec-lam", "cong-nhan-mo-ham-lo-quang-ninh", "index.html");
const jobPagePaths = [
  paidLanding,
  ...master.occupation_profiles.filter((profile) => profile.active_intake).map((profile) => path.join(site, "viec-lam", profile.slug, "index.html")),
];
for (const file of jobPagePaths) {
  if (!fs.existsSync(file)) continue;
  let text = fs.readFileSync(file, "utf8");
  text = text
    .replace(/7[,.]5 triệu đồng(?!\s*\/\s*tháng)/giu, "7,5 triệu đồng/tháng")
    .replace(/7[,.]5 triệu đồng\/tháng theo chính sách/giu, "7,5 triệu đồng/tháng trong thời gian học")
    .replace(/(20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động)\.\s*;/giu, "$1;")
    .replace(/\.\s*;/g, ";");
  text = normalizeVisibleIncome(text)
    .replace(/(khi hoàn thành định mức lao động)(?:[\s.,;:]+khi hoàn thành định mức lao động)+/giu, "$1")
    .replace(/định mức lao động\.\s*;/giu, "định mức lao động;");
  if (file === paidLanding && !text.includes("google-search-intent.js")) {
    const closeBody = text.match(/\s*<\/body>/i)?.[0];
    if (!closeBody) throw new Error("Paid-search landing thiếu </body> để gắn intent runtime");
    text = text.replace(closeBody, `\n  <script src="/google-search-intent.js?v=11" defer></script>${closeBody}`);
  }
  fs.writeFileSync(file, text);
}

const jobsPath = path.join(site, "jobs.json");
const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf8"));
jobs.canonical_facts_version = facts.version;
jobs.canonical_facts_confirmed_at = facts.confirmed_at;
jobs.canonical_facts_json = canonicalFactsJson;
jobs.canonical_facts_url = canonicalFactsUrl;
jobs.updated_at = facts.confirmed_at;
fs.writeFileSync(jobsPath, `${JSON.stringify(jobs, null, 2)}\n`);

function stampXml(relative, { generatedAt = false } = {}) {
  const file = path.join(site, relative);
  let text = fs.readFileSync(file, "utf8");
  const match = text.match(/<jobs\b[^>]*>/u);
  if (!match) throw new Error(`${relative}: thiếu thẻ <jobs>`);
  let tag = match[0];
  const setAttr = (name, value) => {
    const encoded = String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
    const re = new RegExp(`\\s${name}="[^"]*"`, "u");
    if (re.test(tag)) tag = tag.replace(re, ` ${name}="${encoded}"`);
    else tag = tag.replace(/>$/u, ` ${name}="${encoded}">`);
  };
  if (generatedAt) setAttr("generatedAt", facts.confirmed_at);
  setAttr("canonicalFactsVersion", facts.version);
  setAttr("canonicalFactsConfirmedAt", facts.confirmed_at);
  setAttr("canonicalFactsJson", canonicalFactsJson);
  setAttr("canonicalFactsUrl", canonicalFactsUrl);
  text = text.replace(match[0], tag);
  fs.writeFileSync(file, text);
}

stampXml("jobs.xml", { generatedAt: true });
stampXml("jooble.xml");

console.log(JSON.stringify({
  status: "machine-feeds-normalized-v11",
  canonicalFactsVersion: facts.version,
  canonicalFactsConfirmedAt: facts.confirmed_at,
  provincePages: 34,
  jobPagesNormalized: jobPagePaths.length,
  paidSearchRuntime: "/google-search-intent.js?v=11",
  feeds: ["jobs.json", "jobs.xml", "jooble.xml"],
}, null, 2));
