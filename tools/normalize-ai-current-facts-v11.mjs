import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const target = path.join(site, "llms.txt");
if (!fs.existsSync(target)) throw new Error("AI facts: thiếu llms.txt");

const support = facts.study_benefits.living_support;
const income = facts.after_training.income_commitment;
const factsUrl = "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json";
const currentUrl = "https://thaylinhtuyenthomo.vn/recruitment-current.json";
const policyDate = String(review.policy_effective_from || "").split("-").reverse().join("/");
const reviewDate = String(review.reviewed_at || "").split("-").reverse().join("/");

if (support !== "7,5 triệu đồng/tháng trong thời gian học") throw new Error(`AI facts: support canonical sai: ${support}`);
if (income !== "20–25 triệu đồng/tháng khi hoàn thành định mức lao động") throw new Error(`AI facts: income canonical sai: ${income}`);

let text = fs.readFileSync(target, "utf8");
text = text
  .replace(/(?:Thu nhập\s+)?bình quân\s+20[–-]25\s*triệu(?:\s*đồng)?\/tháng(?:,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất)?/giu, income)
  .replace(/20[–-]25\s*triệu(?:\s*đồng)?\/tháng,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/giu, income)
  .replace(/7[,.]5\s*triệu(?:\s*đồng)?(?!\s*\/\s*tháng)\s+trong thời gian học/giu, support)
  .replace(/Hai hướng đang tuyển là khai thác mỏ hầm lò và xây dựng mỏ hầm lò\./g,
    "Ba nghề đang tiếp nhận là kỹ thuật khai thác mỏ hầm lò, kỹ thuật xây dựng mỏ hầm lò và kỹ thuật cơ điện mỏ hầm lò.");

const machineHeading = "## Dữ liệu máy đọc và nguồn cập nhật\n\n";
if (!text.includes(machineHeading)) throw new Error("AI facts: llms.txt thiếu mục dữ liệu máy đọc");
text = text
  .replace(/^- \[Facts tuyển sinh canonical[^\n]*\n/gm, "")
  .replace(/^- \[Thông tin tuyển hiện hành dạng JSON[^\n]*\n/gm, "")
  .replace(machineHeading, `${machineHeading}- [Facts tuyển sinh canonical v${facts.version}](${factsUrl}): nguồn máy đọc ưu tiên số 1 cho điều kiện, ba nghề, thời gian học, quyền lợi và thu nhập đang áp dụng; xác nhận ${reviewDate}.\n- [Thông tin tuyển hiện hành dạng JSON](${currentUrl}): bản tóm tắt dẫn xuất để đối chiếu nhanh; không được ghi đè facts canonical.\n`);

const currentSection = `## Trang thông tin hiện hành\n\n- [Thông tin tuyển thợ mỏ đang áp dụng: 15 câu hỏi](https://thaylinhtuyenthomo.vn/thong-tin-tuyen-tho-mo/): trang chuẩn cho người đọc để đối chiếu điều kiện, thời gian học, chế độ, hồ sơ, địa chỉ và thu nhập.\n- Hiệu lực chính sách hiện hành: ${policyDate}.\n- Rà soát facts gần nhất: ${reviewDate}, facts v${facts.version}.\n- Hỗ trợ trong thời gian học: ${support}.\n- Thu nhập sau đào tạo: ${income}.\n\n`;
const currentStart = text.indexOf("## Trang thông tin hiện hành");
if (currentStart === -1) throw new Error("AI facts: llms.txt thiếu mục thông tin hiện hành");
const nextHeading = text.indexOf("\n## ", currentStart + 4);
text = nextHeading === -1
  ? `${text.slice(0, currentStart)}${currentSection}`
  : `${text.slice(0, currentStart)}${currentSection}${text.slice(nextHeading + 1)}`;

for (const legacy of ["bình quân 20–25 triệu", "tùy đơn vị, vị trí, ngày công và năng suất", "7,5 triệu đồng/tháng trong thời gian học"]) {
  if (text.toLocaleLowerCase("vi").includes(legacy)) throw new Error(`AI facts: llms.txt còn legacy phrase ${legacy}`);
}
for (const marker of [factsUrl, currentUrl, support, income, `facts v${facts.version}`]) {
  if (!text.includes(marker)) throw new Error(`AI facts: llms.txt thiếu ${marker}`);
}

fs.writeFileSync(target, text);
console.log(JSON.stringify({
  status: "ai-current-facts-v11-ready",
  canonicalFactsVersion: facts.version,
  support,
  income,
  policyEffective: review.policy_effective_from,
  reviewedAt: review.reviewed_at,
}, null, 2));
