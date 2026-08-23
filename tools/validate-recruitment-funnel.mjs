import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const campaign = read("viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html");
const application = read("job-application.js");
const config = read("recruitment-config.js");
const analyticsVendors = read("analytics-vendors.js");
const privacy = read("quyen-rieng.html");
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
  "application-result-title",
  "application-birth-help",
  "data-application-draft-status",
  "autocomplete=\"address-level1\"",
  "<noscript>",
  "recruitment-config.js?v=3",
  "job-application.js?v=10",
  "analytics.js?v=6",
]) requireText(campaign, hook, "central application page");

for (const supportMarker of [
  "https://zalo.me/0963048585",
  "https://m.me/thaylinhtuyenthomo",
  "tel:+84963048585",
]) requireText(campaign, supportMarker, "central application support");

if (campaign.includes("data-copy-application") || campaign.includes("Sao chép lại tin nhắn")) {
  errors.push("central application page: removed copy-message control returned");
}

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
  "ApplicationProgress",
  "ApplicationValidationError",
  "ApplicationSubmit",
  "ApplicationDeliveryFailure",
  "submissionFingerprint",
  "application_retry",
  "Thử gửi lại cùng mã",
  "thaylinh_application_draft_v1",
  "ApplicationDraftRestore",
  "DRAFT_TTL_MS",
  "clearDraft",
  "measurement_client_id",
  "internal_campaign",
  "pageUrlWithoutQuery",
  "lead_key: applicationCode",
  '"co_dien"',
]) requireText(application, text, "application logic");

for (const attributionField of [
  "utm_term", "gclid", "gbraid", "wbraid", "gad_source", "gad_campaignid",
  "tl_campaign", "tl_adgroup", "tl_creative", "tl_matchtype", "tl_device", "tl_network", "tl_intent",
]) requireText(application, `${attributionField}: source.${attributionField}`, "application attribution payload");

for (const marker of [
  "deliverApplication(application)",
  "Content-Type\": \"text/plain",
  "application_saved",
  "values.consent === \"on\"",
  "String(values.website || \"\")",
  "const response = await fetch(endpoint",
  "if (!response.ok)",
  "reply?.ok",
  "reply.code !== payload.code",
  'track("Lead"',
  "attempt.leadTracked = true",
]) requireText(application, marker, "secure application delivery");

if (/mode\s*:\s*["']no-cors["']/.test(application)) {
  errors.push("secure application delivery: no-cors must not be used because CRM acknowledgement cannot be verified");
}

for (const marker of [
  'if (item.event === "Lead")',
  'if (params.action === "application_saved")',
  'gtagEvent("generate_lead", params)',
  'window.fbq("track", "Lead"',
  'gtagEvent("lead_fallback_created", params)',
  'window.fbq("trackCustom", "LeadFallbackCreated"',
]) requireText(analyticsVendors, marker, "verified lead analytics");

for (const marker of [
  "script.google.com/macros/s/",
  'phone: "0963048585"',
  'zalo: "https://zalo.me/0963048585"',
]) requireText(config, marker, "recruitment configuration");

const draftFields = application.match(/const DRAFT_FIELDS = \[([^\]]+)\]/)?.[1] || "";
for (const safeField of ["province", "height", "weight", "education", "trade"]) {
  if (!draftFields.includes(`"${safeField}"`)) errors.push(`application draft: missing safe field ${safeField}`);
}
for (const excludedField of ["full_name", "phone", "birth_date", "health", "consent", "website"]) {
  if (draftFields.includes(`"${excludedField}"`)) errors.push(`application draft stores excluded field ${excludedField}`);
}
if (/navigator\.clipboard|document\.execCommand\(\"copy\"\)|ApplicationCopy/.test(application)) {
  errors.push("application logic: clipboard behavior must not run after form submission");
}

for (const [key, value] of [["ageMin", master.criteria.age_min], ["ageMax", master.criteria.age_max], ["heightMinCm", master.criteria.height_min_cm], ["weightMinKg", master.criteria.weight_min_kg]]) {
  requireText(config, `${key}: ${value}`, "recruitment configuration");
}
requireText(config, "schemaVersion: 2", "recruitment configuration");
for (const marker of ["Bản nháp trên thiết bị", "tối đa 24 giờ", "không chứa họ tên, số điện thoại, ngày sinh, lựa chọn sức khỏe hoặc ô đồng ý"]) {
  requireText(privacy, marker, "privacy notice");
}

for (const slug of master.occupation_profiles.filter((profile) => profile.active_intake).map((profile) => profile.slug)) {
  const role = read(`viec-lam/${slug}/index.html`);
  for (const marker of ["data-application-form", "data-form-context=\"job_", "directApply\":true", "job-application.js?v=10", "data-application-draft-status", "application-result-title", "<noscript>"]) {
    requireText(role, marker, `${slug} direct application`);
  }
  if (role.includes("data-copy-application") || role.includes("Sao chép lại tin nhắn")) errors.push(`${slug}: removed copy-message control returned`);
}

const trackingPayloads = [...application.matchAll(/track\("[^"]+",\s*\{([\s\S]*?)\}\);/g)].map(match => match[1]).join("\n");
for (const personalField of ["full_name", "phone", "birth_date", "age", "province", "height_cm", "weight_kg", "health_screen", "education"]) {
  if (new RegExp(`\\b${personalField}\\b`).test(trackingPayloads)) {
    errors.push(`application tracking contains personal field ${personalField}`);
  }
}

const htmlFiles = [];
function collectHtmlFiles(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(absolute);
    else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
}
collectHtmlFiles(root);

let attributedCrossPageApplications = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']*#dang-ky)["'][^>]*>/gi)) {
    const [, rawHref] = match;
    if (rawHref.startsWith("#")) continue;
    const href = rawHref.replaceAll("&amp;", "&");
    const url = new URL(href, "https://thaylinhtuyenthomo.vn/");
    const relative = path.relative(root, file);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      if (!url.searchParams.get(key)) errors.push(`${relative}: cross-page application link is missing ${key}`);
    }
    attributedCrossPageApplications += 1;
  }
}

console.log(JSON.stringify({
  applicationPage: "viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html",
  crmAcknowledgementRequired: true,
  directPersonalDataTracking: 0,
  canonicalMessenger: "https://m.me/thaylinhtuyenthomo",
  verifiedLeadAnalytics: ["ga4:generate_lead", "meta:Lead"],
  fallbackLeadSeparated: true,
  attributedCrossPageApplications,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20),
}, null, 2));

if (errors.length) process.exitCode = 1;
