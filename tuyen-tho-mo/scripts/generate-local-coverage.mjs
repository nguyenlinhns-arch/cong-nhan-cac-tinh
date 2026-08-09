import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const OFFICIAL_SOURCE='https://xaydungchinhsach.chinhphu.vn/danh-sach-3321-don-vi-hanh-chinh-cap-xa-tai-34-tinh-thanh-sau-sap-xep-sap-nhap-119250710102358656.htm';
const PROVINCE_DATA='https://raw.githubusercontent.com/vietmap-company/vietnam_administrative_address/refs/heads/main/admin_new/province.json';
const WARD_DATA='https://raw.githubusercontent.com/vietmap-company/vietnam_administrative_address/refs/heads/main/admin_new/ward.json';

const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const strip=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function getJson(url){const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (compatible; ThayLinhRecruitmentBot/2.0)'}});if(!r.ok) throw new Error(`Không tải được ${url}: HTTP ${r.status}`);return r.json();}

const [provinceData,wardData]=await Promise.all([getJson(PROVINCE_DATA),getJson(WARD_DATA)]);
const provinces=Object.values(provinceData);
const wards=Object.values(wardData);
if(provinces.length!==34) throw new Error(`Nguồn có ${provinces.length}/34 tỉnh thành`);
if(wards.length!==3321) throw new Error(`Nguồn có ${wards.length}/3321 đơn vị cấp xã`);

const provinceByCode=new Map(provinces.map(p=>[String(p.code),p]));
function displayProvince(p){return p.name==='Hồ Chí Minh'?'TP Hồ Chí Minh':p.name;}
function typeLabel(w){const n=String(w.name_with_type||'');if(/^Đặc khu\b/iu.test(n)) return 'đặc khu';if(/^Phường\b/iu.test(n)) return 'phường';return 'xã';}

const records=wards.map(w=>{const p=provinceByCode.get(String(w.parent_code));if(!p) throw new Error(`Không tìm thấy tỉnh cho mã xã ${w.code}`);const type=typeLabel(w);const name=String(w.name||'').trim();if(!name) throw new Error(`Đơn vị ${w.code} thiếu tên`);return {code:String(w.code),province:displayProvince(p),provinceSlug:p.slug||strip(p.name),provinceCode:String(p.code),type,name,slug:w.slug||strip(name),path:w.path_with_type||w.path||`${type} ${name}, ${displayProvince(p)}`};});
const uniqueKeys=new Set(records.map(r=>`${r.provinceSlug}/${r.type}/${r.slug}`));
if(uniqueKeys.size!==3321) throw new Error(`Chỉ có ${uniqueKeys.size}/3321 URL địa bàn duy nhất`);

const today=new Date().toISOString().slice(0,10);
const out=path.join(ROOT,'viec-lam-nganh-than');
const jobLinks='<a href="/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/">Khai thác mỏ hầm lò</a> · <a href="/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/">Xây dựng mỏ hầm lò</a> · <a href="/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/">Cơ điện mỏ hầm lò</a>';

function localityPage(r){
  const place=`${r.type} ${r.name}, ${r.province}`;
  const title=`Tuyển thợ mỏ cho lao động ${place}`;
  const url=`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/${r.type}/${r.slug}/`;
  const apply=`/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?province=${encodeURIComponent(r.province)}&locality=${encodeURIComponent(r.name)}&utm_source=google&utm_medium=organic&utm_campaign=commune_jobs#dang-ky`;
  const schema={'@context':'https://schema.org','@graph':[{'@type':'WebPage','@id':`${url}#webpage`,url,name:title,inLanguage:'vi-VN',dateModified:today,about:{'@type':'Place',name:place,identifier:r.code}},{'@type':'BreadcrumbList','@id':`${url}#breadcrumb`,itemListElement:[{'@type':'ListItem',position:1,name:'Việc làm ngành Than',item:'https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/'},{'@type':'ListItem',position:2,name:r.province,item:`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/`},{'@type':'ListItem',position:3,name:place,item:url}]}]};
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Thầy Linh</title><meta name="description" content="${esc(title)}: kiểm tra điều kiện từ xa, học nghề và làm việc thực tế tại Quảng Ninh; tra cứu đúng địa bàn cấp xã hiện hành."><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${url}"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><main><nav class="breadcrumb"><a href="/viec-lam-nganh-than/">Việc làm</a> › <a href="/viec-lam-nganh-than/${r.provinceSlug}/">${esc(r.province)}</a> › <span>${esc(r.type)} ${esc(r.name)}</span></nav><section class="local-hero"><div class="local-hero__copy"><p class="eyebrow">${esc(place.toUpperCase())}</p><h1>${esc(title)}</h1><p class="local-hero__lead">Người lao động tại ${esc(r.type)} ${esc(r.name)} có thể đăng ký kiểm tra điều kiện trực tuyến. Đây là địa bàn tuyển nguồn; nơi học nghề và làm việc thực tế là Quảng Ninh.</p><div class="location-clarity"><div><small>NƠI TUYỂN NGUỒN</small><strong>${esc(place)}</strong></div><span>→</span><div><small>NƠI HỌC & LÀM VIỆC</small><strong>Quảng Ninh</strong></div></div><p><a class="button" href="${apply}">Kiểm tra điều kiện</a></p></div></section><section class="section"><h2>Việc làm ngành Than đang tiếp nhận</h2><p>${jobLinks}</p><h2>Thông tin dành cho người ở ${esc(r.name)}</h2><p>Đăng ký ban đầu thực hiện từ xa để kiểm tra điều kiện trước khi chuẩn bị hồ sơ và di chuyển. Mã địa bàn hành chính dùng để đối chiếu là ${esc(r.code)}.</p><p><a href="/viec-lam-nganh-than/${r.provinceSlug}/xa-phuong/">Xem tất cả xã, phường tại ${esc(r.province)} →</a></p></section></main></body></html>`;
}

for(const r of records){const dir=path.join(out,r.provinceSlug,r.type,r.slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),localityPage(r));}

const byProvince=new Map();
for(const r of records){if(!byProvince.has(r.provinceSlug)) byProvince.set(r.provinceSlug,[]);byProvince.get(r.provinceSlug).push(r);}
if(byProvince.size!==34) throw new Error(`Chỉ tạo được ${byProvince.size}/34 tỉnh thành`);
for(const [pSlug,list] of byProvince){
  list.sort((a,b)=>a.name.localeCompare(b.name,'vi'));
  const p=list[0].province;
  const dir=path.join(out,pSlug,'xa-phuong');fs.mkdirSync(dir,{recursive:true});
  const items=list.map(r=>`<li><a href="../${r.type}/${r.slug}/">${esc(r.type)} ${esc(r.name)}</a></li>`).join('');
  const schema={'@context':'https://schema.org','@type':'ItemList',numberOfItems:list.length,itemListElement:list.map((r,i)=>({'@type':'ListItem',position:i+1,name:`${r.type} ${r.name}`,url:`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${pSlug}/${r.type}/${r.slug}/`}))};
  fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tuyển thợ mỏ theo xã, phường ${esc(p)} | Thầy Linh</title><meta name="description" content="Tra cứu tuyển thợ mỏ theo toàn bộ ${list.length} xã, phường, đặc khu tại ${esc(p)}; đăng ký từ địa phương, học nghề và làm việc thực tế tại Quảng Ninh."><meta name="robots" content="index,follow"><link rel="canonical" href="https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${pSlug}/xa-phuong/"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><main class="section"><p><a href="/viec-lam-nganh-than/${pSlug}/">← Tuyển dụng ${esc(p)}</a></p><h1>Tuyển thợ mỏ theo xã, phường tại ${esc(p)}</h1><p>Đã phủ đủ ${list.length} đơn vị cấp xã hiện hành của ${esc(p)}. Chọn đúng địa bàn đang sinh sống để giữ nguồn tuyển; nơi học và làm việc thực tế là Quảng Ninh.</p><ul>${items}</ul></main></body></html>`);
  const provincePage=path.join(out,pSlug,'index.html');
  if(fs.existsSync(provincePage)){let source=fs.readFileSync(provincePage,'utf8');if(!source.includes(`/${pSlug}/xa-phuong/`)){source=source.replace('</main>',`<section class="section"><h2>Tuyển thợ mỏ theo từng xã, phường</h2><p><a href="/viec-lam-nganh-than/${pSlug}/xa-phuong/">Xem toàn bộ ${list.length} xã, phường, đặc khu của ${esc(p)} →</a></p></section></main>`);fs.writeFileSync(provincePage,source);}}
}

const sitemap=records.map(r=>`<url><loc>https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/${r.type}/${r.slug}/</loc><lastmod>${today}</lastmod></url>`).join('');
fs.writeFileSync(path.join(ROOT,'commune-sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`);
const counts=Object.fromEntries([...byProvince].map(([k,v])=>[k,v.length]));
fs.writeFileSync(path.join(ROOT,'local-coverage.json'),JSON.stringify({official_source:OFFICIAL_SOURCE,data_source:{province:PROVINCE_DATA,locality:WARD_DATA},generated_at:new Date().toISOString(),communes:records.length,legacy_district_names:0,by_province:counts},null,2));
console.log(JSON.stringify({status:'ok',communes:records.length,provinces:byProvince.size,by_province:counts},null,2));
