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

function normalizeFile(relative) {
  const file = path.join(site, relative);
  if (!fs.existsSync(file)) throw new Error(`Search facts: thiếu ${relative}`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data.items)) throw new Error(`Search facts: ${relative} thiếu items`);
  let updated = 0;
  for (const item of data.items) {
    const description = answers.get(item.url);
    if (!description) continue;
    item.description = description;
    item.canonicalFactsVersion = facts.version;
    updated += 1;
  }
  if (updated !== answers.size) throw new Error(`Search facts: ${relative} chỉ cập nhật ${updated}/${answers.size} câu facts`);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return updated;
}

const manifestUpdated = normalizeFile("search-index.json");
const coreUpdated = normalizeFile("search-core.json");

for (const relative of ["search-index.json", "search-core.json"]) {
  const data = JSON.parse(fs.readFileSync(path.join(site, relative), "utf8"));
  for (const [url, expected] of answers) {
    const item = data.items.find((entry) => entry.url === url);
    if (!item || item.description !== expected) throw new Error(`Search facts: ${relative} lệch ${url}`);
    if (item.canonicalFactsVersion !== facts.version) throw new Error(`Search facts: ${relative} ${url} thiếu facts version ${facts.version}`);
  }
  const text = JSON.stringify(data);
  if (/bình quân\s+20[–-]25\s*triệu/iu.test(text)) throw new Error(`Search facts: ${relative} còn thu nhập bình quân legacy`);
  if (/tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/iu.test(text)) throw new Error(`Search facts: ${relative} còn điều kiện thu nhập legacy`);
  if (/7[,.]5\s*triệu(?:\s*đồng)?\s+(?:là\s+)?tổng(?:\s+cả)?\s+khóa/iu.test(text)) throw new Error(`Search facts: ${relative} còn cách hiểu 7,5 triệu tổng cả khóa`);
}

console.log(JSON.stringify({
  status: "search-current-facts-v11-ready",
  canonicalFactsVersion: facts.version,
  manifestUpdated,
  coreUpdated,
  support,
  income,
}, null, 2));
