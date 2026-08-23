import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const master = JSON.parse(fs.readFileSync(path.join(root, "operations", "job-posting-master-2026.json"), "utf8"));
const outputPath = path.join(site, "worker-questions.json");

const income = facts.after_training.income_commitment;
const support = facts.study_benefits.living_support;
const durationAnswer = `Khai thác mỏ hầm lò và xây dựng mỏ hầm lò học ${facts.training.khai_thac_mo}; kỹ thuật cơ điện mỏ hầm lò học ${facts.training.co_dien_mo}. Lịch cụ thể được xác nhận theo từng đợt.`;
const workAnswer = "Ba nghề đang tiếp nhận là kỹ thuật khai thác mỏ hầm lò, kỹ thuật xây dựng mỏ hầm lò và kỹ thuật cơ điện mỏ hầm lò. Người học được đào tạo thao tác, thiết bị, an toàn và phối hợp tổ đội trước khi nhận việc.";
const incomeAnswer = `Thu nhập đang áp dụng là ${income}.`;

if (income !== master.income_commitment) throw new Error("Worker questions: income facts lệch master");
if (support !== "7,5 triệu đồng/tháng trong thời gian học") throw new Error("Worker questions: support facts không đúng");
if (!fs.existsSync(outputPath)) throw new Error("Worker questions: thiếu worker-questions.json sau bước build");

const data = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const overrides = new Map([
  ["Học nghề mỏ mất bao lâu?", durationAnswer],
  ["Công việc thợ mỏ hầm lò là làm gì?", workAnswer],
  ["Lương thợ lò được tính thế nào?", incomeAnswer],
  ["Trong thời gian học có được ăn ở và hỗ trợ không?", `Người học thuộc chỉ tiêu được bố trí 3 bữa/ngày, ký túc xá khép kín và hỗ trợ ${support} theo chính sách đợt tuyển.`],
]);
let updatedQuestions = 0;
for (const item of data.questions || []) {
  const answer = overrides.get(item.question);
  if (!answer) continue;
  item.direct_answer = answer;
  item.canonical_facts_version = facts.version;
  updatedQuestions += 1;
}
if (updatedQuestions !== overrides.size) throw new Error(`Worker questions: chỉ cập nhật ${updatedQuestions}/${overrides.size} câu canonical`);
data.version = "1.1";
data.updated_at = String(facts.confirmed_at || "").slice(0, 10);
data.canonical_facts_version = facts.version;
data.canonical_facts_url = "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json";
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);

const replacements = [
  ["Khai thác mỏ hầm lò và xây dựng mỏ hầm lò thường học 2–3 tháng theo chương trình đang tuyển; lịch cụ thể được xác nhận theo từng đợt.", durationAnswer],
  ["Hai hướng đang tuyển là khai thác mỏ hầm lò và xây dựng mỏ hầm lò. Người học được đào tạo thao tác, thiết bị, an toàn và phối hợp tổ đội trước khi nhận việc.", workAnswer],
  ["Chương trình đang áp dụng Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.", incomeAnswer],
];
let htmlUpdated = 0;
function walk(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name === "index.html") {
      let html = fs.readFileSync(target, "utf8");
      const before = html;
      for (const [from, to] of replacements) html = html.replaceAll(from, to);
      if (html !== before) {
        fs.writeFileSync(target, html);
        htmlUpdated += 1;
      }
    }
  }
}
walk(site);

const outputText = fs.readFileSync(outputPath, "utf8");
for (const marker of [durationAnswer, workAnswer, incomeAnswer, support]) {
  if (!outputText.includes(marker)) throw new Error(`Worker questions: output thiếu ${marker}`);
}
for (const legacy of [
  "Hai hướng đang tuyển là khai thác mỏ hầm lò và xây dựng mỏ hầm lò",
  "bình quân 20–25 triệu",
  "tùy đơn vị, vị trí, ngày công và năng suất",
  "7,5 triệu đồng/tháng trong thời gian học",
]) if (outputText.toLocaleLowerCase("vi").includes(legacy.toLocaleLowerCase("vi"))) throw new Error(`Worker questions còn legacy: ${legacy}`);

if (process.env.GITHUB_ACTIONS === "true") {
  try {
    execFileSync("git", ["update-index", "--assume-unchanged", "--", "tuyen-tho-mo/worker-questions.json"], {cwd: root, stdio: "ignore"});
  } catch {}
}

console.log(JSON.stringify({
  status: "worker-question-facts-v11-ready",
  canonicalFactsVersion: facts.version,
  updatedQuestions,
  htmlUpdated,
  support,
  income,
}, null, 2));
