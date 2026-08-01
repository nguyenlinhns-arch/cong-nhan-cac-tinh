import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const campaign = read("viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html");
const application = read("job-application.js");
const config = read("recruitment-config.js");
const master = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));

function requireText(content, expected, label) {
  if (!content.includes(expected)) errors.push(`${label}: missing ${expected}`);
}

for (const hook of [
  "data-application-form",
  "data-application-result",
  "data-application-status",
  "data-application-code",
  "data-sms-application",
  "data-form-context=\"central_application\"",
  "recruitment-config.js?v=2",
  "job-application.js?v=5",
  "analytics.js?v=2",
]) requireText(campaign, hook, "central application page");

for (const field of ["full_name", "phone", "birth_date", "province", "height", "weight", "education", "trade", "health", "website", "consent"]) {
  requireText(campaign, `name=\"${field}\"`, "central application form");
}

for (const text of [
  "Mã đăng ký:",
  "Kết quả tự kiểm tra:",
  "2–3 tháng",
  "7,5 triệu đồng",
  "TL-${date}-${suffix}",
  "thaylinh_last_application",
  "schema_version",
  "form_context",
  "ApplicationStart",
  "ApplicationSubmit",
  "ApplicationDeliveryFailure",
]) requireText(application, text, "application logic");

for (const marker of ["deliverApplication(application)", "Content-Type\": \"text/plain", "application_saved", "values.consent === \"on\"", "String(values.website || \"\")"]) {
  requireText(application, marker, "secure application delivery");
}

for (const [key, value] of [["ageMin", master.criteria.age_min], ["ageMax", master.criteria.age_max], ["heightMinCm", master.criteria.height_min_cm], ["weightMinKg", master.criteria.weight_min_kg]]) {
  requireText(config, `${key}: ${value}`, "recruitment configuration");
}
requireText(config, "schemaVersion: 2", "recruitment configuration");

for (const slug of ["ky-thuat-khai-thac-mo-ham-lo-quang-ninh", "ky-thuat-xay-dung-mo-ham-lo-quang-ninh"]) {
  const role = read(`viec-lam/${slug}/index.html`);
  for (const marker of ["data-application-form", "data-form-context=\"job_", "directApply\":true", "job-application.js?v=5"]) {
    requireText(role, marker, `${slug} direct application`);
  }
}

const trackingPayloads = [...application.matchAll(/track\("[^"]+",\s*\{([\s\S]*?)\}\);/g)].map(match => match[1]).join("\n");
for (const personalField of ["full_name", "phone", "birth_date", "age", "province", "height_cm", "weight_kg", "health_screen", "education"]) {
  if (new RegExp(`\\b${personalField}\\b`).test(trackingPayloads)) {
    errors.push(`application tracking contains personal field ${personalField}`);
  }
}

console.log(JSON.stringify({
  applicationPage: "viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html",
  directPersonalDataTracking: 0,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20),
}, null, 2));

if (errors.length) process.exitCode = 1;
