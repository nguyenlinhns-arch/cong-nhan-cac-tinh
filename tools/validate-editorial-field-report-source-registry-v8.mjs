import fs from "node:fs";
import path from "node:path";

const reportsPath = path.resolve("content", "editorial-field-reports-v8.json");
const registryPath = path.resolve("content", "editorial-field-report-source-registry-v8.json");
if (!fs.existsSync(reportsPath) || !fs.existsSync(registryPath)) {
  throw new Error("Field report source registry v8: thiếu dữ liệu bài hoặc hồ sơ nguồn");
}

const reports = JSON.parse(fs.readFileSync(reportsPath, "utf8"));
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const errors = [];
const reportSlugs = Object.keys(reports).sort();
const sourceSlugs = Object.keys(registry).sort();

if (JSON.stringify(reportSlugs) !== JSON.stringify(sourceSlugs)) {
  errors.push(`Hồ sơ nguồn phải khớp 1:1 bài phóng sự: reports=${reportSlugs.join(",")}; registry=${sourceSlugs.join(",")}`);
}

for (const slug of reportSlugs) {
  const report = reports[slug];
  const source = registry[slug];
  if (!source) continue;
  if (source.editorialClass !== "original_reporting") errors.push(`${slug}: editorialClass phải là original_reporting`);
  if (source.sourceType !== "first_party_field_material") errors.push(`${slug}: sourceType phải là first_party_field_material`);
  if (source.sourceOwner !== "Thầy Linh – Tuyển Thợ Mỏ") errors.push(`${slug}: sourceOwner chưa đúng nguồn sở hữu tư liệu`);
  if (source.evidenceUrl !== report.videoUrl) errors.push(`${slug}: evidenceUrl phải trùng videoUrl gốc của bài`);
  if (!/^https:\/\/www\.facebook\.com\/reel\/\d+\/?$/u.test(source.evidenceUrl || "")) errors.push(`${slug}: evidenceUrl không phải Facebook Reel hợp lệ`);
  if (!Array.isArray(source.evidenceScope) || source.evidenceScope.length < 2 || source.evidenceScope.some((item) => String(item).trim().length < 12)) {
    errors.push(`${slug}: evidenceScope cần ít nhất hai phạm vi bằng chứng có ý nghĩa`);
  }
  if (!Array.isArray(source.allowedClaims) || source.allowedClaims.length < 2 || source.allowedClaims.some((item) => String(item).trim().length < 12)) {
    errors.push(`${slug}: allowedClaims cần ít nhất hai giới hạn phát biểu`);
  }
  if (source.quotePolicy !== "no_unverified_direct_quotes") errors.push(`${slug}: phải cấm trích dẫn trực tiếp chưa kiểm chứng`);
  if (source.inferencePolicy !== "label_as_analysis_not_character_quote") errors.push(`${slug}: suy luận phải được ghi là phân tích, không biến thành lời nhân vật`);
  if (!String(report.source || "").trim()) errors.push(`${slug}: bài phóng sự thiếu ghi chú tư liệu hiển thị`);
}

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  reports: reportSlugs.length,
  registeredSources: sourceSlugs.length,
  originalReporting: sourceSlugs.filter((slug) => registry[slug]?.editorialClass === "original_reporting").length,
  firstPartyEvidence: sourceSlugs.filter((slug) => registry[slug]?.sourceType === "first_party_field_material").length,
  noUnverifiedQuotes: sourceSlugs.filter((slug) => registry[slug]?.quotePolicy === "no_unverified_direct_quotes").length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 30),
}, null, 2));

if (errors.length) throw new Error(`Field report source registry v8 không đạt: ${errors.slice(0, 5).join(" | ")}`);
