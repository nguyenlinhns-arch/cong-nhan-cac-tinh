import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const landingPath=path.join(ROOT,'tuyen-tho-mo-quang-ninh','index.html');
const jsPath=path.join(ROOT,'ads-attribution.js');
const mapPath=path.join(ROOT,'ads','search-campaign-map.json');
const offlineSchemaPath=path.join(ROOT,'ads','offline-conversion-schema.json');

for(const file of [landingPath,jsPath,mapPath,offlineSchemaPath]) if(!fs.existsSync(file)) throw new Error(`Thiếu file bắt buộc: ${file}`);
const html=fs.readFileSync(landingPath,'utf8');
const js=fs.readFileSync(jsPath,'utf8');
const campaign=JSON.parse(fs.readFileSync(mapPath,'utf8'));
const offlineSchema=JSON.parse(fs.readFileSync(offlineSchemaPath,'utf8'));

const requiredLanding=[
  '<link rel="canonical" href="https://thaylinhtuyenthomo.vn/tuyen-tho-mo-quang-ninh/">',
  '<h1>Tuyển thợ mỏ Quảng Ninh:',
  'Tuyển thợ lò Quảng Ninh cho người chưa có kinh nghiệm',
  'Việc làm ngành Than tại Quảng Ninh',
  '/ads-attribution.js?v=1',
  'data-track="eligibility_click"',
  'data-contact="zalo"',
  'data-track="phone_click"',
  'data-track="payroll_proof_click"',
  '/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/',
  '/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/',
  '/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/',
  '/quyen-rieng.html'
];
for(const marker of requiredLanding) if(!html.includes(marker)) throw new Error(`Landing thiếu: ${marker}`);
if(/"@type"\s*:\s*"JobPosting"/u.test(html)) throw new Error('Landing tổng hợp không được khai JobPosting');
if(/<form\b[^>]*method=["']get["'][^>]*>[\s\S]*?(name=["'](?:name|phone|email)["'])/iu.test(html)) throw new Error('Không được đưa dữ liệu cá nhân vào GET URL');
if(/name=["'](?:phone|email|name)["']/iu.test(html)) throw new Error('Landing Ads không thu PII trực tiếp; phải chuyển sang luồng kiểm tra điều kiện');

const requiredAttribution=['gclid','gbraid','wbraid','gad_source','gad_campaignid','utm_source','utm_campaign','tl_adgroup','tl_matchtype','tl_intent','INTENTS','applyIntent','Object.hasOwn','dataLayer','ads_landing_view','CONSENT_KEY','consentGranted','localStorage'];
for(const marker of requiredAttribution) if(!js.includes(marker)) throw new Error(`Attribution thiếu: ${marker}`);
if(!/if\(consentGranted\(\)\)\s*\{[\s\S]*localStorage\.setItem\(STORAGE_KEY/u.test(js)) throw new Error('Click identifiers chỉ được persist sau measurement consent');
if(/sessionStorage\.setItem\(STORAGE_KEY/u.test(js)) throw new Error('Không persist click identifiers vào sessionStorage trước consent');
for(const forbidden of ['hoten','birth_year','phone_number','email_address','full_name']) if(js.includes(forbidden)) throw new Error(`Attribution không được xử lý PII: ${forbidden}`);

if(Number(campaign.version)<3) throw new Error('Campaign map phải dùng schema v3 trở lên');
if(!Array.isArray(campaign.ad_groups)||campaign.ad_groups.length<5) throw new Error('Bản đồ Search Ads phải có ít nhất 5 nhóm ý định');
if(!Array.isArray(campaign.negative_keyword_seeds)||campaign.negative_keyword_seeds.length<15) throw new Error('Thiếu negative keyword seeds');
if(campaign.tracking?.auto_tagging_required!==true) throw new Error('Campaign map phải bắt buộc auto-tagging');
for(const marker of ['{campaignid}','{adgroupid}','{creative}','{keyword}','{matchtype}','{device}','{network}','{_intent}']) if(!String(campaign.tracking?.final_url_suffix_recommended||'').includes(marker)) throw new Error(`Final URL suffix thiếu ValueTrack/custom parameter ${marker}`);
if(campaign.tracking?.custom_parameter_required_per_ad_group!=='_intent') throw new Error('Phải dùng custom parameter _intent ở ad group để message match');
if(campaign.tracking?.pii_in_url!==false) throw new Error('Tracking contract phải cấm PII trong URL');
const allowedIntent=new Set(campaign.tracking?.allowed_intent_values||[]);
if(allowedIntent.size!==5) throw new Error('Phải có đúng 5 intent landing được whitelist');
const mappedIntent=new Set();
for(const group of campaign.ad_groups){
  const value=group.custom_parameters?._intent;
  if(!allowedIntent.has(value)) throw new Error(`Ad group ${group.name} có _intent không hợp lệ: ${value||'thiếu'}`);
  if(!group.landing_message) throw new Error(`Ad group ${group.name} thiếu landing_message`);
  mappedIntent.add(value);
}
if(mappedIntent.size!==allowedIntent.size) throw new Error('Mỗi intent phải được map ít nhất một ad group');
const eventSet=new Set(campaign.conversion_events_ready_for_gtm||[]);
for(const event of ['ads_landing_view','eligibility_click','contact_click','phone_click','payroll_proof_click','job_detail_click']) if(!eventSet.has(event)) throw new Error(`Campaign map thiếu event ${event}`);
const primaryStages=new Set(campaign.conversion_hierarchy?.primary_when_connected||[]);
for(const stage of ['qualified_lead','enrolled_student','started_employment']) if(!primaryStages.has(stage)) throw new Error(`Thiếu conversion chất lượng ${stage}`);
if(campaign.offline_measurement?.repository_contains_real_customer_data!==false) throw new Error('Repository không được chứa dữ liệu khách hàng thật');

if(Number(offlineSchema.version)<1||!Array.isArray(offlineSchema.export_fields)) throw new Error('Offline conversion schema không hợp lệ');
const offlineFields=new Set(offlineSchema.export_fields.map(field=>field.name));
for(const field of ['lead_key','conversion_stage','conversion_time','gclid','normalized_phone_hash']) if(!offlineFields.has(field)) throw new Error(`Offline schema thiếu ${field}`);
if(!Array.isArray(offlineSchema.privacy_rules)||offlineSchema.privacy_rules.length<4) throw new Error('Offline schema thiếu privacy rules');

const titles=[...html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/giu)].map(m=>m[1].replace(/<[^>]+>/g,'').trim());
console.log(JSON.stringify({
  status:'ok',
  landing:'/tuyen-tho-mo-quang-ninh/',
  intent_sections:titles.length,
  message_match_intents:mappedIntent.size,
  ad_groups:campaign.ad_groups.length,
  negative_keyword_seeds:campaign.negative_keyword_seeds.length,
  tracking_events:eventSet.size,
  primary_conversion_stages:primaryStages.size,
  auto_tagging:campaign.tracking.auto_tagging_required,
  consent_safe_click_id_persistence:true,
  offline_schema:true,
  pii_in_url:false,
  aggregate_jobposting:false
},null,2));
