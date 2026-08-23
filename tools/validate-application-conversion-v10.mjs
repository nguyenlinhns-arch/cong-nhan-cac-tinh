import fs from "node:fs";

const config = fs.readFileSync("tuyen-tho-mo/recruitment-config.js", "utf8");
const application = fs.readFileSync("tuyen-tho-mo/job-application.js", "utf8");
const analytics = fs.readFileSync("tuyen-tho-mo/analytics-vendors.js", "utf8");
const landing = fs.readFileSync("tuyen-tho-mo/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html", "utf8");
const errors = [];

const requireMarker = (source, marker, label) => {
  if (!source.includes(marker)) errors.push(`${label}: thiếu ${marker}`);
};

requireMarker(config, "script.google.com/macros/s/", "CRM config");
requireMarker(config, 'phone: "0963048585"', "CRM config");
requireMarker(config, 'zalo: "https://zalo.me/0963048585"', "CRM config");
requireMarker(application, 'const response = await fetch(endpoint', "Application delivery");
requireMarker(application, 'if (!response.ok)', "Application delivery");
requireMarker(application, 'if (!reply?.ok || reply.code !== payload.code)', "Application delivery");
requireMarker(application, 'action: delivery.saved ? "application_saved" : "application_message_created"', "Lead event");
requireMarker(application, 'track("Lead"', "Lead event");
requireMarker(application, 'attempt.leadTracked = true', "Lead dedupe");
requireMarker(application, 'track("ApplicationDeliveryFailure"', "Delivery fallback");
requireMarker(analytics, 'if (item.event === "Lead")', "Vendor analytics");
requireMarker(analytics, 'if (params.action === "application_saved")', "Vendor analytics");
requireMarker(analytics, 'gtagEvent("generate_lead", params)', "GA4 lead");
requireMarker(analytics, 'window.fbq("track", "Lead"', "Meta lead");
requireMarker(analytics, 'gtagEvent("lead_fallback_created", params)', "Fallback analytics");
requireMarker(landing, 'data-application-form', "Landing form");
requireMarker(landing, 'name="consent"', "Landing consent");
requireMarker(landing, 'https://zalo.me/0963048585', "Landing support");
requireMarker(landing, 'https://m.me/thaylinhtuyenthomo', "Landing support");
requireMarker(landing, 'tel:+84963048585', "Landing support");

if (/mode\s*:\s*["']no-cors["']/.test(application)) {
  errors.push("Application delivery: không được dùng no-cors vì không xác minh được CRM đã nhận hồ sơ");
}

if (errors.length) {
  console.error(JSON.stringify({status: "application-conversion-v10-invalid", errors}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "application-conversion-v10-ready",
    crmResponseVerified: true,
    leadDeduped: true,
    canonicalMessenger: "https://m.me/thaylinhtuyenthomo",
    canonicalPhone: "tel:+84963048585",
    ga4Lead: "generate_lead",
    metaLead: "Lead",
    fallbackSeparated: true,
    supportChannels: ["zalo", "messenger", "phone"],
    errors: 0,
  }, null, 2));
}
