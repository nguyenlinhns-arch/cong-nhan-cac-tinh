import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));

const age = `${facts.candidate.age_min}–${facts.candidate.age_max}`;
const height = `${Math.floor(facts.candidate.height_min_cm / 100)}m${String(facts.candidate.height_min_cm % 100).padStart(2, "0")}`;
const income = facts.after_training.income_commitment;
const support = facts.study_benefits.living_support;
const answers = new Map([
  ["/#dieu-kien", `Nam ${age} tuổi, cao từ ${height}, nặng từ ${facts.candidate.weight_min_kg}kg. ${facts.candidate.health}. Khám tuyển là căn cứ xác nhận cuối cùng.`],
  ["/#thoi-gian-hoc", `Khai thác mỏ và xây dựng mỏ học ${facts.training.khai_thac_mo}; cơ điện mỏ học ${facts.training.co_dien_mo}. Người chưa có kinh nghiệm được đào tạo từ nền tảng.`],
  ["/#ho-tro-hoc-nghe", `${facts.study_benefits.tuition}; ${facts.study_benefits.meals.toLocaleLowerCase("vi")}, ${facts.study_benefits.accommodation.toLocaleLowerCase("vi")} và hỗ trợ ${support}.`],
  ["/#quyen-loi", `Thu nhập ${income}; người lao động được đào tạo nghề trước khi bố trí việc làm.`],
]);

if (income !== master.income_commitment) throw new Error("Search facts: income canonical lệch master");
if (support !== "7,5 triệu đồng/tháng trong thời gian học") throw new Error("Search facts: living support canonical không đúng");

const corePath = path.join(site, "search-core.json");
if (!fs.existsSync(corePath)) throw new Error("Search facts: thiếu search-core.json");
const core = JSON.parse(fs.readFileSync(corePath, "utf8"));
if (!Array.isArray(core.items)) throw new Error("Search facts: search-core.json thiếu items");
let coreUpdated = 0;
for (const item of core.items) {
  const description = answers.get(item.url);
  if (!description) continue;
  item.description = description;
  item.canonicalFactsVersion = facts.version;
  coreUpdated += 1;
}
if (coreUpdated !== answers.size) throw new Error(`Search facts: search-core chỉ cập nhật ${coreUpdated}/${answers.size} câu facts`);
fs.writeFileSync(corePath, `${JSON.stringify(core, null, 2)}\n`);

const manifestPath = path.join(site, "search-index.json");
if (!fs.existsSync(manifestPath)) throw new Error("Search facts: thiếu search-index.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.version !== 4 || manifest.strategy !== "answer-first-tiered") throw new Error("Search facts: search-index manifest không đúng schema v4 phân tầng");
manifest.discovery ||= {};
manifest.discovery.canonicalFacts = "/thong-tin-tuyen-tho-mo/";
manifest.discovery.canonicalFactsJson = "/data/recruitment-facts-2026.json";
manifest.discovery.currentRecruitmentJson = "/recruitment-current.json";
manifest.canonicalFactsVersion = facts.version;
manifest.canonicalFactsConfirmedAt = facts.confirmed_at;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

for (const [url, expected] of answers) {
  const item = core.items.find((entry) => entry.url === url);
  if (!item || item.description !== expected) throw new Error(`Search facts: search-core lệch ${url}`);
  if (item.canonicalFactsVersion !== facts.version) throw new Error(`Search facts: search-core ${url} thiếu facts version ${facts.version}`);
}
const coreText = JSON.stringify(core);
if (/bình quân\s+20[–-]25\s*triệu/iu.test(coreText)) throw new Error("Search facts: search-core còn thu nhập bình quân legacy");
if (/tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/iu.test(coreText)) throw new Error("Search facts: search-core còn điều kiện thu nhập legacy");
if (/7[,.]5\s*triệu(?:\s*đồng)?\s+(?:là\s+)?tổng(?:\s+cả)?\s+khóa/iu.test(coreText)) throw new Error("Search facts: search-core còn cách hiểu 7,5 triệu tổng cả khóa");
if (manifest.canonicalFactsVersion !== facts.version) throw new Error("Search facts: manifest thiếu canonicalFactsVersion");
if (manifest.discovery.canonicalFactsJson !== "/data/recruitment-facts-2026.json") throw new Error("Search facts: manifest thiếu canonicalFactsJson");

console.log(JSON.stringify({
  status: "search-current-facts-v11-ready",
  canonicalFactsVersion: facts.version,
  manifestUpdated: true,
  coreUpdated,
  support,
  income,
}, null, 2));
