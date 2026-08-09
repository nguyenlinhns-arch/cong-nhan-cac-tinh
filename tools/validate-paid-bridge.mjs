import fs from "node:fs";

const landing = fs.readFileSync("tuyen-tho-mo/tuyen-tho-mo-quang-ninh/index.html", "utf8");
const bridge = fs.readFileSync("tuyen-tho-mo/google-ads-bridge.js", "utf8");
const map = JSON.parse(fs.readFileSync("tuyen-tho-mo/ad-landing-pages.json", "utf8"));
const errors = [];
const canonical = "https://thaylinhtuyenthomo.vn/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/";

for (const marker of [
  'content="noindex,follow',
  `rel="canonical" href="${canonical}"`,
  'data-ads-continue',
  '/google-ads-bridge.js?v=1',
  'Tiếp tục kiểm tra điều kiện'
]) if (!landing.includes(marker)) errors.push(`Paid bridge thiếu marker: ${marker}`);

if (landing.includes('action="/cam-on/"')) errors.push("Paid bridge không được dùng form GET /cam-on/");
if (/<form\b/i.test(landing)) errors.push("Paid bridge không được chứa form riêng; phải dùng form CRM chính thức");
if (/"@type"\s*:\s*"JobPosting"/.test(landing)) errors.push("Paid bridge không được khai JobPosting riêng");

for (const marker of [
  'gclid', 'gbraid', 'wbraid', 'utm_term', 'campaignid', 'adgroupid', 'creative', 'keyword', 'matchtype', 'device', 'network',
  'google_ads_bridge_view', 'google_ads_bridge_click', '/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/'
]) if (!bridge.includes(marker)) errors.push(`Bridge attribution thiếu marker: ${marker}`);

if (map.primary_landing_url !== canonical) errors.push("Primary landing không phải URL CRM canonical");
if (map.paid_bridge?.index_policy !== "noindex_follow") errors.push("Paid bridge map phải noindex_follow");
if (map.paid_bridge?.canonical_target !== canonical) errors.push("Paid bridge canonical target sai");
if (!Array.isArray(map.paid_bridge?.attribution_passthrough) || !map.paid_bridge.attribution_passthrough.includes("gclid")) errors.push("Paid bridge map thiếu click-ID passthrough");

console.log(JSON.stringify({
  paidBridge: "/tuyen-tho-mo-quang-ninh/",
  canonicalTarget: canonical,
  attributionKeys: map.paid_bridge?.attribution_passthrough?.length || 0,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20)
}, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
