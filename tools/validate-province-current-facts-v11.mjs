import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const provinceRoot = path.join(site, "viec-lam-nganh-than");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const authorId = "https://thaylinhtuyenthomo.vn/tac-gia/nguyen-tu-linh/#person";
const errors = [];
let indexablePages = 0;

const files = fs.readdirSync(provinceRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({slug: entry.name, file: path.join(provinceRoot, entry.name, "index.html")}))
  .filter((entry) => fs.existsSync(entry.file));

for (const {slug, file} of files) {
  const html = fs.readFileSync(file, "utf8");
  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) continue;
  indexablePages += 1;
  const label = `viec-lam-nganh-than/${slug}/`;
  if (!/Kỹ thuật cơ điện mỏ hầm lò/i.test(html)) errors.push(`${label}: thiếu nghề cơ điện mỏ`);
  if (!/(?:cơ điện mỏ[^<\n]{0,100}(?:học|đào tạo)[^<\n]{0,40}10 tháng|Kỹ thuật cơ điện mỏ hầm lò[\s\S]{0,180}10 tháng)/iu.test(html)) {
    errors.push(`${label}: thiếu thời gian cơ điện 10 tháng`);
  }
  if (/7[,.]5\s*triệu/iu.test(html) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(html)) errors.push(`${label}: 7,5 triệu thiếu /tháng`);
  for (const match of html.matchAll(/20\s*[–-]\s*25\s*triệu/giu)) {
    const index = match.index || 0;
    const window = html.slice(Math.max(0, index - 220), Math.min(html.length, index + 340));
    if (!/hoàn thành định mức lao động/iu.test(window)) {
      errors.push(`${label}: 20–25 triệu thiếu điều kiện định mức gần vị trí ${index}`);
      break;
    }
  }
  if (!new RegExp(`"lastReviewed"\\s*:\\s*"${review.reviewed_at}"`).test(html)) errors.push(`${label}: lastReviewed chưa là ${review.reviewed_at}`);
  if (!html.includes(`"reviewedBy":{"@id":"${authorId}"}`)) errors.push(`${label}: thiếu reviewedBy canonical author`);
  if (/Xem đủ\s+\d+\s+tỉnh,\s*thành/iu.test(html)) errors.push(`${label}: còn CTA phạm vi địa phương gây hiểu nhầm`);
  for (const legacy of facts.forbidden_legacy_phrases || []) {
    if (!legacy) continue;
    const lower = html.toLocaleLowerCase("vi");
    if (lower.includes(String(legacy).toLocaleLowerCase("vi"))) errors.push(`${label}: còn legacy phrase ${legacy}`);
  }
}

if (files.length !== 34) errors.push(`Cần đúng 34 landing tỉnh/thành, hiện có ${files.length}`);

console.log(JSON.stringify({
  status: errors.length ? "province-current-facts-v11-invalid" : "province-current-facts-v11-ready",
  canonicalFactsVersion: facts.version,
  reviewedAt: review.reviewed_at,
  pages: files.length,
  indexablePages,
  support: facts.study_benefits.living_support,
  income: facts.after_training.income_commitment,
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
