import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const landingPath=path.join(ROOT,'tuyen-tho-mo-quang-ninh','index.html');
const jsPath=path.join(ROOT,'ads-attribution.js');
const mapPath=path.join(ROOT,'ads','search-campaign-map.json');

for(const file of [landingPath,jsPath,mapPath]) if(!fs.existsSync(file)) throw new Error(`Thiếu file bắt buộc: ${file}`);
const html=fs.readFileSync(landingPath,'utf8');
const js=fs.readFileSync(jsPath,'utf8');
const campaign=JSON.parse(fs.readFileSync(mapPath,'utf8'));

const requiredLanding=[
  '<link rel="canonical" href="https://thaylinhtuyenthomo.vn/tuyen-tho-mo-quang-ninh/">',
  '<h1>Tuyển thợ mỏ Quảng Ninh:',
  'Tuyển thợ lò Quảng Ninh cho người chưa có kinh nghiệm',
  'Việc làm ngành Than tại Quảng Ninh',
  '/ads-attribution.js?v=1',
  'data-track="eligibility_click"',
  'data-track="messenger_click"',
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

const requiredAttribution=['gclid','gbraid','wbraid','utm_source','utm_campaign','dataLayer','ads_landing_view','localStorage'];
for(const marker of requiredAttribution) if(!js.includes(marker)) throw new Error(`Attribution thiếu: ${marker}`);
for(const forbidden of ['hoten','birth_year','phone_number','email_address']) if(js.includes(forbidden)) throw new Error(`Attribution không được xử lý PII: ${forbidden}`);

if(!Array.isArray(campaign.ad_groups)||campaign.ad_groups.length<5) throw new Error('Bản đồ Search Ads phải có ít nhất 5 nhóm ý định');
if(!Array.isArray(campaign.negative_keyword_seeds)||campaign.negative_keyword_seeds.length<10) throw new Error('Thiếu negative keyword seeds');
const eventSet=new Set(campaign.conversion_events_ready_for_gtm||[]);
for(const event of ['ads_landing_view','eligibility_click','messenger_click','phone_click','payroll_proof_click','job_detail_click']) if(!eventSet.has(event)) throw new Error(`Campaign map thiếu event ${event}`);

const titles=[...html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/giu)].map(m=>m[1].replace(/<[^>]+>/g,'').trim());
console.log(JSON.stringify({
  status:'ok',
  landing:'/tuyen-tho-mo-quang-ninh/',
  intent_sections:titles.length,
  ad_groups:campaign.ad_groups.length,
  negative_keyword_seeds:campaign.negative_keyword_seeds.length,
  tracking_events:eventSet.size,
  pii_in_url:false,
  aggregate_jobposting:false
},null,2));
