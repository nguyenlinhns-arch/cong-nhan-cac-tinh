import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('tuyen-tho-mo');
const SOURCE = 'https://xaydungchinhsach.chinhphu.vn/danh-sach-3321-don-vi-hanh-chinh-cap-xa-tai-34-tinh-thanh-sau-sap-xep-sap-nhap-119250710102358656.htm';
const PROVINCES = [
['Hà Nội','ha-noi'],['Cao Bằng','cao-bang'],['Tuyên Quang','tuyen-quang'],['Điện Biên','dien-bien'],['Lai Châu','lai-chau'],['Sơn La','son-la'],['Lào Cai','lao-cai'],['Thái Nguyên','thai-nguyen'],['Lạng Sơn','lang-son'],['Quảng Ninh','quang-ninh'],['Bắc Ninh','bac-ninh'],['Phú Thọ','phu-tho'],['Hải Phòng','hai-phong'],['Hưng Yên','hung-yen'],['Ninh Bình','ninh-binh'],['Thanh Hóa','thanh-hoa'],['Nghệ An','nghe-an'],['Hà Tĩnh','ha-tinh'],['Quảng Trị','quang-tri'],['Huế','hue'],['Đà Nẵng','da-nang'],['Quảng Ngãi','quang-ngai'],['Gia Lai','gia-lai'],['Khánh Hòa','khanh-hoa'],['Đắk Lắk','dak-lak'],['Lâm Đồng','lam-dong'],['Đồng Nai','dong-nai'],['TP Hồ Chí Minh','ho-chi-minh'],['Tây Ninh','tay-ninh'],['Đồng Tháp','dong-thap'],['Vĩnh Long','vinh-long'],['An Giang','an-giang'],['Cần Thơ','can-tho'],['Cà Mau','ca-mau']];

const strip=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc=s=>s.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const clean=s=>s.normalize('NFC').replace(/\s+/g,' ').trim().replace(/[.;:,]+$/,'');
const escapeRx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const response=await fetch(SOURCE,{headers:{'user-agent':'Mozilla/5.0 (compatible; ThayLinhRecruitmentBot/1.0)'}});
if(!response.ok) throw new Error(`Không tải được nguồn Chính phủ: HTTP ${response.status}`);
const html=await response.text();
const text=html.normalize('NFC').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\r/g,'');

function provinceNeedles(name){
  if(name==='TP Hồ Chí Minh') return ['Thành phố Hồ Chí Minh','TP Hồ Chí Minh','Hồ Chí Minh'];
  if(['Hà Nội','Hải Phòng','Huế','Đà Nẵng','Cần Thơ'].includes(name)) return [`thành phố ${name}`,name];
  return [`tỉnh ${name}`,name];
}
function findDetailedHeading(name){
  const candidates=[];
  for(const needle of provinceNeedles(name)){
    const rx=new RegExp(`Danh sách\\s+(\\d+)\\s+[^\\n]{0,80}${escapeRx(needle)}[^\\n]{0,100}`,'giu');
    for(const m of text.matchAll(rx)){
      const tail=text.slice(m.index,m.index+900);
      if(/Nghị quyết số|Ủy ban Thường vụ Quốc hội/iu.test(tail)) candidates.push({start:m.index,expected:Number(m[1]),heading:m[0]});
    }
  }
  candidates.sort((a,b)=>a.start-b.start);
  if(!candidates.length) throw new Error(`Không tìm thấy tiêu đề chi tiết cho ${name}`);
  return candidates[0];
}

const sections=PROVINCES.map(([name,slug])=>({name,slug,...findDetailedHeading(name)})).sort((a,b)=>a.start-b.start);
if(new Set(sections.map(s=>s.start)).size!==34) throw new Error('Có tiêu đề tỉnh bị nhận diện trùng nhau');
for(let i=0;i<sections.length;i++) sections[i].body=text.slice(sections[i].start,sections[i+1]?.start ?? text.length);

function addName(map,type,name){
  name=clean(name).replace(/^mới\s+/iu,'').replace(/^(?:xã|phường|đặc khu)\s+/iu,'').replace(/\s+(?:sau khi|trong đó|hình thành).*$/iu,'').replace(/\s*\([^)]*\)\s*/gu,' ').trim();
  if(name.length<1||name.length>80) return;
  if(/\b(?:tỉnh|thành phố|huyện)\b/iu.test(name)) return;
  map.set(`${type}:${name.toLocaleLowerCase('vi')}`,{type,name});
}
function parseUnchanged(body,names){
  for(const m of body.matchAll(/không thực hiện sắp xếp là\s+([^\n.]{1,500})/giu)){
    let tail=clean(m[1]).replace(/^các\s+/iu,'');
    const explicit=[...tail.matchAll(/(?:^|,|;|\bvà\b)\s*(xã|phường|đặc khu)\s+([^,;]+?)(?=\s*(?:,|;|\bvà\b|$))/giu)];
    if(explicit.length){ for(const e of explicit) addName(names,e[1].toLowerCase(),e[2]); continue; }
    const lead=tail.match(/^(xã|phường|đặc khu)\s+(.+)$/iu);
    if(!lead) continue;
    const type=lead[1].toLowerCase(); tail=lead[2];
    for(const part of tail.split(/\s*,\s*|\s+và\s+/iu)) addName(names,type,part);
  }
}

const records=[]; const legacy=[]; const diagnostics={};
for(const sec of sections){
  const names=new Map();
  const formed=/(?:thành|thành)\s+(xã|phường|đặc khu)\s+(?:mới\s+)?(?:có|có)\s+(?:tên\s+)?(?:gọi|gọi)\s+(?:là|là)\s+(?:(?:xã|phường|đặc khu)\s+)?([^\n.]{1,100})/giu;
  for(const m of sec.body.matchAll(formed)) addName(names,m[1].toLowerCase(),m[2]);
  parseUnchanged(sec.body,names);
  diagnostics[sec.slug]={expected:sec.expected,parsed:names.size,heading:clean(sec.heading)};
  if(names.size!==sec.expected) throw new Error(`${sec.name}: trích được ${names.size}/${sec.expected} đơn vị. Dừng để tránh xuất bản thiếu hoặc sai.`);
  for(const m of sec.body.matchAll(/\bhuyện\s+([A-ZÀ-ỸĐ][^,).\n]{1,50})/gu)){ const name=clean(m[1]); if(name.length<55) legacy.push({province:sec.name,provinceSlug:sec.slug,name,slug:strip(name)}); }
  for(const v of names.values()) records.push({province:sec.name,provinceSlug:sec.slug,...v,slug:strip(v.name)});
}

const dedupe=new Map(records.map(r=>[`${r.provinceSlug}/${r.type}/${r.slug}`,r]));
const communes=[...dedupe.values()];
if(records.length!==3321||communes.length!==3321) throw new Error(`Fail-safe: tổng nguồn ${records.length}, URL duy nhất ${communes.length}; yêu cầu đúng 3321`);
const today=new Date().toISOString().slice(0,10);
const jobLinks='<a href="/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/">Khai thác mỏ hầm lò</a> · <a href="/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/">Xây dựng mỏ hầm lò</a> · <a href="/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/">Cơ điện mỏ hầm lò</a>';
function page(r){
  const place=`${r.type} ${r.name}, ${r.province}`; const title=`Tuyển thợ mỏ cho lao động ${place}`; const url=`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/${r.type}/${r.slug}/`; const apply=`/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?province=${encodeURIComponent(r.province)}&locality=${encodeURIComponent(r.name)}&utm_source=google&utm_medium=organic&utm_campaign=commune_jobs#dang-ky`;
  const schema={'@context':'https://schema.org','@graph':[{'@type':'WebPage',url,name:title,inLanguage:'vi-VN',dateModified:today,about:{'@type':'Place',name:place}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Việc làm ngành Than',item:'https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/'},{'@type':'ListItem',position:2,name:r.province,item:`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/`},{'@type':'ListItem',position:3,name:place,item:url}]}]};
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Thầy Linh</title><meta name="description" content="${esc(title)}: kiểm tra điều kiện từ xa, học nghề và làm việc thực tế tại Quảng Ninh; tra cứu đúng địa bàn cấp xã hiện hành."><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${url}"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><main><nav class="breadcrumb"><a href="/viec-lam-nganh-than/">Việc làm</a> › <a href="/viec-lam-nganh-than/${r.provinceSlug}/">${esc(r.province)}</a> › <span>${esc(r.type)} ${esc(r.name)}</span></nav><section class="local-hero"><div class="local-hero__copy"><p class="eyebrow">${esc(place.toUpperCase())}</p><h1>${esc(title)}</h1><p class="local-hero__lead">Người lao động tại ${esc(r.type)} ${esc(r.name)} có thể đăng ký kiểm tra điều kiện trực tuyến. Đây là địa bàn tuyển nguồn; nơi học nghề và làm việc thực tế là Quảng Ninh.</p><div class="location-clarity"><div><small>NƠI TUYỂN NGUỒN</small><strong>${esc(place)}</strong></div><span>→</span><div><small>NƠI HỌC & LÀM VIỆC</small><strong>Quảng Ninh</strong></div></div><p><a class="button" href="${apply}">Kiểm tra điều kiện</a></p></div></section><section class="section"><h2>Việc làm ngành Than đang tiếp nhận</h2><p>${jobLinks}</p><h2>Thông tin dành cho người ở ${esc(r.name)}</h2><p>Đăng ký ban đầu thực hiện từ xa để kiểm tra điều kiện trước khi chuẩn bị hồ sơ và di chuyển. Tên ${esc(r.type)} ${esc(r.name)} được dùng để giữ chính xác nguồn địa bàn khi tư vấn.</p><p><a href="/viec-lam-nganh-than/${r.provinceSlug}/xa-phuong/">Xem tất cả xã, phường tại ${esc(r.province)} →</a></p></section></main></body></html>`;
}

const out=path.join(ROOT,'viec-lam-nganh-than');
for(const r of communes){ const dir=path.join(out,r.provinceSlug,r.type,r.slug); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),page(r)); }

const byProvince=new Map(); for(const r of communes){ if(!byProvince.has(r.provinceSlug)) byProvince.set(r.provinceSlug,[]); byProvince.get(r.provinceSlug).push(r); }
for(const [pSlug,list] of byProvince){
  const dir=path.join(out,pSlug,'xa-phuong'); fs.mkdirSync(dir,{recursive:true}); const p=list[0].province;
  const items=list.sort((a,b)=>a.name.localeCompare(b.name,'vi')).map(r=>`<li><a href="../${r.type}/${r.slug}/">${esc(r.type)} ${esc(r.name)}</a></li>`).join('');
  fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tuyển thợ mỏ theo xã, phường ${esc(p)} | Thầy Linh</title><meta name="description" content="Tra cứu tuyển thợ mỏ theo toàn bộ xã, phường, đặc khu tại ${esc(p)}; đăng ký từ địa phương, học nghề và làm việc thực tế tại Quảng Ninh."><meta name="robots" content="index,follow"><link rel="canonical" href="https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${pSlug}/xa-phuong/"><link rel="stylesheet" href="/styles.css"></head><body><main class="section"><p><a href="/viec-lam-nganh-than/${pSlug}/">← Tuyển dụng ${esc(p)}</a></p><h1>Tuyển thợ mỏ theo xã, phường tại ${esc(p)}</h1><p>Đã phủ đủ ${list.length} đơn vị cấp xã hiện hành của ${esc(p)}. Chọn đúng địa bàn đang sinh sống để giữ nguồn tuyển; nơi học và làm việc thực tế là Quảng Ninh.</p><ul>${items}</ul></main></body></html>`);
  const provincePage=path.join(out,pSlug,'index.html');
  if(fs.existsSync(provincePage)){ let source=fs.readFileSync(provincePage,'utf8'); if(!source.includes(`/${pSlug}/xa-phuong/`)){ source=source.replace('</main>',`<section class="section"><h2>Tuyển thợ mỏ theo từng xã, phường</h2><p><a href="/viec-lam-nganh-than/${pSlug}/xa-phuong/">Xem toàn bộ ${list.length} xã, phường, đặc khu của ${esc(p)} →</a></p></section></main>`); fs.writeFileSync(provincePage,source); } }
}
if(byProvince.size!==34) throw new Error(`Chỉ tạo được ${byProvince.size}/34 tỉnh thành`);

const legacyMap=new Map(legacy.map(r=>[`${r.provinceSlug}/${r.slug}`,r]));
for(const r of legacyMap.values()){ const dir=path.join(out,r.provinceSlug,'huyen-cu',r.slug); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tuyển thợ mỏ khu vực huyện ${esc(r.name)} cũ, ${esc(r.province)}</title><meta name="description" content="Trang tra cứu tên huyện ${esc(r.name)} cũ để tìm xã, phường hiện hành sau mô hình chính quyền địa phương 2 cấp."><meta name="robots" content="noindex,follow"><link rel="canonical" href="https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/xa-phuong/"></head><body><main><h1>Huyện ${esc(r.name)} là tên địa bàn cũ</h1><p>Hãy chọn xã/phường hiện hành để xem thông tin tuyển dụng.</p><p><a href="/viec-lam-nganh-than/${r.provinceSlug}/xa-phuong/">Chọn xã, phường hiện hành →</a></p></main></body></html>`); }

const sitemap=communes.map(r=>`<url><loc>https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/${r.type}/${r.slug}/</loc><lastmod>${today}</lastmod></url>`).join('');
fs.writeFileSync(path.join(ROOT,'commune-sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`);
fs.writeFileSync(path.join(ROOT,'local-coverage.json'),JSON.stringify({source:SOURCE,generated_at:new Date().toISOString(),communes:communes.length,legacy_district_names:legacyMap.size,by_province:Object.fromEntries([...byProvince].map(([k,v])=>[k,v.length])),diagnostics},null,2));
console.log(`Generated exactly ${communes.length} current commune/ward/special-zone pages across ${byProvince.size} provinces and ${legacyMap.size} legacy district aliases.`);
