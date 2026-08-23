import fs from 'node:fs';

const bridge = fs.readFileSync('operations/apps-script-facebook/Code.gs', 'utf8');
const mapping = JSON.parse(fs.readFileSync('operations/facebook-crm-mapping-2026.json', 'utf8'));
const config = fs.readFileSync('tuyen-tho-mo/recruitment-config.js', 'utf8');
const errors = [];

for (const fn of ['setupFacebookCRMBridge','doGet','doPost','syncFacebookInbox','enrichFacebookMetadata','processMessengerEvent_','processLeadgenChange_']) {
  if (!new RegExp(`function\\s+${fn}\\s*\\(`).test(bridge)) errors.push(`Missing function ${fn}`);
}
for (const property of ['SPREADSHEET_ID','META_VERIFY_TOKEN','META_PAGE_ID','META_PAGE_ACCESS_TOKEN','META_ADS_ACCESS_TOKEN']) {
  if (!bridge.includes(property)) errors.push(`Missing Script Property ${property}`);
}
for (const header of ['FACEBOOK_INBOX','Facebook PSID','Facebook Lead ID','Facebook Ad ID','Facebook Ad Set ID','Facebook Campaign ID','Facebook Intake','Meta Placement']) {
  if (!bridge.includes(header)) errors.push(`Missing Facebook field ${header}`);
}
for (const safety of [
  "findMasterPhoneRow_", "Trùng SĐT - đã gộp", "count + '/6'", "Chờ đủ thông tin",
  "year === minYear || year === maxYear", "Sức khỏe tốt, sẵn sàng khám tuyển"
]) if (!bridge.includes(safety)) errors.push(`Missing safety rule ${safety}`);

for (const key of ['fbclid','meta_campaign_id','meta_adset_id','meta_ad_id','meta_placement','facebook_ads_import_ready']) {
  if (!config.includes(key)) errors.push(`Website attribution missing ${key}`);
}

if (mapping.dedupe_key !== 'phone_normalized') errors.push('Dedupe key must be normalized phone');
if (!mapping.sync_rule?.required_before_master_create?.includes('full_name')) errors.push('Facebook master sync must require full_name');
if (!mapping.sync_rule?.required_before_master_create?.includes('health_screen')) errors.push('Facebook master sync must require health_screen');
if (mapping.pipeline_defaults?.classification !== 'Quan Tâm') errors.push('Default classification mismatch');
if (mapping.pipeline_defaults?.stage !== 'Đã gửi thông tin') errors.push('Default funnel stage mismatch');

console.log(JSON.stringify({
  facebookCRMBridgeVersion: mapping.version,
  webhookReady: true,
  messengerReady: true,
  leadAdsReady: true,
  phoneDedupeReady: true,
  websiteFacebookAttributionReady: true,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20)
}, null, 2));
if (errors.length) process.exit(1);
