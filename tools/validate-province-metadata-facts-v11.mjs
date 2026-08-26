import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const provinceRoot = path.join(site, "viec-lam-nganh-than");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const rolePolicy = JSON.parse(fs.readFileSync(path.join(root, "content", "seo-role-policy-2026.json"), "utf8"));
const errors = [];
const authorId = "https://thaylinhtuyenthomo.vn/tac-gia/nguyen-tu-linh/#person";

function field(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim() || "";
}
function checkPolicy(text, label) {
  if (!text) return;
  if (/(?:hai|2)\s+nghề\s+(?:đang\s+)?(?:tuyển|tiếp nhận)/iu.test(text)) errors.push(`${label}: còn mô hình 2 nghề`);
  if (/2[–-]3\s*tháng/iu.test(text) && /(?:nghề|học|đào tạo)/iu.test(text) && !/10\s*tháng/iu.test(text)) errors.push(`${label}: nhắc 2–3 tháng nhưng bỏ cơ điện 10 tháng`);
  if (/7[,.]5\s*triệu/iu.test(text) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(text)) errors.push(`${label}: 7,5 triệu thiếu /tháng`);
  if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !/hoàn thành định mức lao động/iu.test(text)) errors.push(`${label}: 20–25 triệu thiếu điều kiện định mức`);
  for (const legacy of facts.forbidden_legacy_phrases || []) {
    if (legacy && text.toLocaleLowerCase("vi").includes(String(legacy).toLocaleLowerCase("vi"))) errors.push(`${label}: legacy ${legacy}`);
  }
}
function walkStrings(value, visit, pointer = "$") {
  if (typeof value === "string") return visit(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkStrings(item, visit, `${pointer}[${index}]`));
  if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) walkStrings(item, visit, `${pointer}.${key}`);
}

const dirs = fs.readdirSync(provinceRoot, {withFileTypes: true}).filter((entry) => entry.isDirectory());
let checkedJsonLd = 0;
for (const entry of dirs) {
  const file = path.join(provinceRoot, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const label = `viec-lam-nganh-than/${entry.name}`;
  const canonical = field(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const title = field(html, /<title>([\s\S]*?)<\/title>/i);
  const description = field(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const ogDescription = field(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const twitterDescription = field(html, /<meta\s+name=["']twitter:description["']\s+content=["']([^"']*)["']/i);
  const route = `/viec-lam-nganh-than/${entry.name}/`;
  const policyCanonical = rolePolicy.pages?.[route]?.canonical;
  const expectedCanonical = policyCanonical
    ? `https://thaylinhtuyenthomo.vn${policyCanonical}`
    : `https://thaylinhtuyenthomo.vn${route}`;
  if (canonical !== expectedCanonical) errors.push(`${label}: canonical sai ${canonical}`);
  if (!title) errors.push(`${label}: thiếu title`);
  if (!description) errors.push(`${label}: thiếu meta description`);
  for (const [name, value] of [["title", title], ["description", description], ["og:description", ogDescription], ["twitter:description", twitterDescription]]) checkPolicy(value, `${label} ${name}`);

  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [index, block] of blocks.entries()) {
    try {
      const json = JSON.parse(block[1]);
      checkedJsonLd += 1;
      walkStrings(json, (value, pointer) => checkPolicy(value, `${label} JSON-LD ${index + 1} ${pointer}`));
    } catch (error) {
      errors.push(`${label}: JSON-LD ${index + 1} lỗi ${error.message}`);
    }
  }
  if (!new RegExp(`"lastReviewed"\\s*:\\s*"${review.reviewed_at}"`).test(html)) errors.push(`${label}: lastReviewed chưa là ${review.reviewed_at}`);
  if (!html.includes(`"reviewedBy":{"@id":"${authorId}"}`)) errors.push(`${label}: thiếu reviewedBy canonical author`);
}

if (dirs.length !== 34) errors.push(`Cần 34 thư mục tỉnh/thành, hiện có ${dirs.length}`);

console.log(JSON.stringify({
  status: errors.length ? "province-metadata-facts-v11-invalid" : "province-metadata-facts-v11-ready",
  canonicalFactsVersion: facts.version,
  provincePages: dirs.length,
  jsonLdBlocks: checkedJsonLd,
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
