import fs from "node:fs";

const code = fs.readFileSync("operations/apps-script/Code.gs", "utf8");
const readme = fs.readFileSync("operations/apps-script/README.md", "utf8");
const recruitmentConfig = fs.readFileSync("tuyen-tho-mo/recruitment-config.js", "utf8");
const paidSearchIntent = fs.readFileSync("tuyen-tho-mo/google-search-intent.js", "utf8");
const progressiveForm = fs.readFileSync("tuyen-tho-mo/application-progressive.js", "utf8");
const vendors = fs.readFileSync("tuyen-tho-mo/analytics-vendors.js", "utf8");
const errors = [];

const requiredHeaders = [
  "Hạn phản hồi", "Cảnh báo chăm sóc", "Nhắc 2 giờ đã gửi", "Nhắc 24 giờ đã gửi",
  "Ngày đủ điều kiện", "Ngày nộp hồ sơ", "Ngày nhập học", "Lý do không phù hợp",
  "Tin nhắn gợi ý", "Ngữ cảnh biểu mẫu", "Mã đo lường", "Chiến dịch nội bộ", "Nội dung nội bộ", "Phiên bản dữ liệu",
];
const requiredFunctions = [
  "setupRecruitmentCRM", "upgradeRecruitmentCRMV2", "upgradeRecruitmentCRMV3", "doPost", "handleCandidateEdit", "handleSpendEdit",
  "checkFollowUpReminders", "sendDailyRecruitmentDigest", "setupDashboard_",
  "dashboardFormulaSyntax_", "setupSpendSheet_", "refreshSourcePerformance_", "installAutomationTriggers_", "sendNewLeadAlert_", "suggestedMessage_",
];

for (const header of requiredHeaders) if (!code.includes(`'${header}'`)) errors.push(`Missing CRM header: ${header}`);
for (const name of requiredFunctions) if (!new RegExp(`function\\s+${name}\\s*\\(`).test(code)) errors.push(`Missing CRM function: ${name}`);
for (const interval of ["everyMinutes(15)", "atHour(7)", "24 * 60 * 60 * 1000", "2 * 60 * 60 * 1000"]) {
  if (!code.includes(interval)) errors.push(`Missing automation interval: ${interval}`);
}
for (const property of ["SPREADSHEET_ID", "ALERT_EMAILS", "DEFAULT_OWNER"]) {
  if (!code.includes(property) || !readme.includes(property)) errors.push(`Missing documented Script Property: ${property}`);
}
for (const marker of ["[1, 2, 3, 4].includes(Number(data.schema_version))", "String(data.website || '').trim()", "findCode_", "ensureHeaders_", "MailApp.getRemainingDailyQuota()", "Chi phí / hồ sơ đủ điều kiện", "Chi phí / học sinh nhập học"] ) {
  if (!code.includes(marker)) errors.push(`Missing compatibility or safety marker: ${marker}`);
}
for (const marker of ["getSpreadsheetLocale()", "argumentSeparator", "arrayColumnSeparator", "usesVietnameseSeparators ? ';' : ','"]) {
  if (!code.includes(marker)) errors.push(`Missing locale-safe dashboard formula marker: ${marker}`);
}
for (const marker of ["temporarily_unavailable", "Lỗi email cảnh báo không được phép", "return true;"]) {
  if (!code.includes(marker)) errors.push(`Missing resilient lead-alert marker: ${marker}`);
}
for (const marker of ["last24HourReminder", "repeat24HourReminder", "Quá 72 giờ còn Mới", "ƯU TIÊN CHĂM SÓC"]) {
  if (!code.includes(marker)) errors.push(`Missing overdue lead escalation marker: ${marker}`);
}
for (const marker of [
  "phone_e164", "utm_term", "gclid", "gbraid", "wbraid", "first_source", "first_landing_path",
  "paid_search_intent", "google_ads_import_ready", "thaylinh_measurement_consent_v1", "/application-progressive.js?v=1",
]) {
  if (!recruitmentConfig.includes(marker)) errors.push(`Missing Google Ads CRM attribution marker: ${marker}`);
}
for (const marker of [
  "content: `paid_search_intent_${intent}_${subIntent}`", "utm_term:",
  "google_paid_search_fast_answer_view", "google_paid_search_fast_answer_click",
  "detectSubIntent", '"training:contact"', '"training:benefits"', '"training:location"',
  '"training:duration"', '"job:no_experience"', '"income:salary"',
]) {
  if (!paidSearchIntent.includes(marker)) errors.push(`Missing paid-search relevance marker: ${marker}`);
}
for (const marker of [
  "full_name", "phone", "birth_date", "province", "Tiếp tục kiểm tra điều kiện",
  "application_progressive_step", "step_1_validation_error", "step_2_view", "final_submit_attempt",
]) {
  if (!progressiveForm.includes(marker)) errors.push(`Missing progressive-form marker: ${marker}`);
}
for (const marker of [
  'params.action === "application_saved"', 'gtagEvent("generate_lead", params)',
  'gtagEvent("lead_fallback_created", params)', 'LeadFallbackCreated',
]) {
  if (!vendors.includes(marker)) errors.push(`Missing lead-quality conversion marker: ${marker}`);
}
if (vendors.includes('if (["Lead", "application_message_created"].includes(item.event))')) {
  errors.push("Lead fallback must not share the generate_lead branch");
}
if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(code)) errors.push("Code.gs must not contain a hard-coded email address");
if (/UrlFetchApp|sms|zalo\.me|m\.me/i.test(code)) errors.push("CRM must not send unreviewed automatic applicant messages");

console.log(JSON.stringify({ crmVersion: 3, headers: requiredHeaders.length, functions: requiredFunctions.length, googleAdsAttributionReady: true, paidSearchSubIntentReady: true, progressiveFormReady: true, leadQualityGuardReady: true, errors: errors.length, sampleErrors: errors.slice(0, 20) }, null, 2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
