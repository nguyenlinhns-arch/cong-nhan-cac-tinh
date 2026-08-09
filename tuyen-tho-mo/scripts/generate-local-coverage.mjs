import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('tuyen-tho-mo');
const SOURCE = 'https://xaydungchinhsach.chinhphu.vn/danh-sach-3321-don-vi-hanh-chinh-cap-xa-tai-34-tinh-thanh-sau-sap-xep-sap-nhap-119250710102358656.htm';
const PROVINCES = [
['Hà Nội','ha-noi'],['Cao Bằng','cao-bang'],['Tuyên Quang','tuyen-quang'],['Điện Biên','dien-bien'],['Lai Châu','lai-chau'],['Sơn La','son-la'],['Lào Cai','lao-cai'],['Thái Nguyên','thai-nguyen'],['Lạng Sơn','lang-son'],['Quảng Ninh','quang-ninh'],['Bắc Ninh','bac-ninh'],['Phú Thọ','phu-tho'],['Hải Phòng','hai-phong'],['Hưng Yên','hung-yen'],['Ninh Bình','ninh-binh'],['Thanh Hóa','thanh-hoa'],['Nghệ An','nghe-an'],['Hà Tĩnh','ha-tinh'],['Quảng Trị','quang-tri'],['Huế','hue'],['Đà Nẵng','da-nang'],['Quảng Ngãi','quang-ngai'],['Gia Lai','gia-lai'],['Khánh Hòa','khanh-hoa'],['Đắk Lắk','dak-lak'],['Lâm Đồng','lam-dong'],['Đồng Nai','dong-nai'],['TP Hồ Chí Minh','ho-chi-minh'],['Tây Ninh','tay-ninh'],['Đồng Tháp','dong-thap'],['Vĩnh Long','vinh-long'],['An Giang','an-giang'],['Cần Thơ','can-tho'],['Cà Mau','ca-mau']];

const strip=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc=s=>s.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const clean=s=>s.replace(/\s+/g,' ').trim().replace(/[.;:,]+$/,'');
const html=await (await fetch(SOURCE,{headers:{'user-agent':'Mozilla/5.0'}})).text();
const text=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\r/g,'');

const normalizeProvince=n=>n==='TP Hồ Chí Minh'?'Hồ Chí Minh':n;
const sections=[];
for(let i=0;i<PROVINCES.length;i++){
  const [name,slug]=PROVINCES[i]; const needle=normalizeProvince(name);
  const rx=new RegExp(`(?:Danh sách|tỉnh|thành phố)[^\\n]{0,100}${needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[^\\n]{0,100}(?:sau sắp xếp|mới|năm 2025)?`,'i');
  const m=rx.exec(text); if(!m) throw new Error(`Không tìm thấy vùng dữ liệu: ${name}`);
  sections.push({name,slug,start:m.index});
}
sections.sort((a,b)=>a.start-b.start);
for(let i=0;i<sections.length;i++) sections[i].body=text.slice(sections[i].start, sections[i+1]?.start ?? text.length);

const records=[]; const legacy=[];
for(const sec of sections){
  const names=new Map();
  const patterns=[
    /(?:có tên gọi là|thành)\s+(xã|phường|đặc khu)\s+([^\n.]{1,80})/giu,
    /(?:gồm|là)\s+(xã|phường|đặc khu)\s+([^\n.]{1,80})/giu
  ];
  for(const rx of patterns){ for(const m of sec.body.matchAll(rx)){
    const type=m[1].toLowerCase(); let name=clean(m[2]).replace(/\s+(?:sau khi|trong đó|và một phần|hình thành).*$/iu,'');
    if(name.length<2||name.length>60||/\b(xã|phường|đặc khu|huyện|tỉnh|thành phố)\b.*\b(xã|phường|đặc khu)\b/iu.test(name)) continue;
    names.set(`${type}:${name.toLowerCase()}`,{type,name});
  }}
  for(const m of sec.body.matchAll(/\bhuyện\s+([A-ZÀ-ỸĐ][^,).\n]{1,50})/gu)){ const name=clean(m[1]); if(name.length<55) legacy.push({province:sec.name,provinceSlug:sec.slug,name,slug:strip(name)}); }
  for(const v of names.values()) records.push({province:sec.name,provinceSlug:sec.slug,...v,slug:strip(v.name)});
}

const dedupe=new Map(records.map(r=>[`${r.provinceSlug}/${r.type}/${r.slug}`,r]));
const communes=[...dedupe.values()];
if(communes.length<3000||communes.length>3500) throw new Error(`Fail-safe: trích được ${communes.length} đơn vị cấp xã, kỳ vọng xấp xỉ 3321`);
const today=new Date().toISOString().slice(0,10);
const jobLinks='<a href="/viec-lam/ky-thuat-khai-thac-mo-ham-lo-quang-ninh/">Khai thác mỏ hầm lò</a> · <a href="/viec-lam/ky-thuat-xay-dung-mo-ham-lo-quang-ninh/">Xây dựng mỏ hầm lò</a> · <a href="/viec-lam/ky-thuat-co-dien-mo-ham-lo-quang-ninh/">Cơ điện mỏ hầm lò</a>';
function page(r){const title=`Tuyển thợ mỏ cho lao động ${r.type} ${r.name}, ${r.province}`; const url=`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/${r.type}/${r.slug}/`; const apply=`/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?province=${encodeURIComponent(r.province)}&locality=${encodeURIComponent(r.name)}&utm_source=google&utm_medium=organic&utm_campaign=commune_jobs#dang-ky`; return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Thầy Linh</title><meta name="description" content="${esc(title)}: kiểm tra điều kiện từ xa, học nghề và làm việc thực tế tại Quảng Ninh; thông tin theo đơn vị hành chính cấp xã sau sắp xếp 2025."><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${url}"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebPage',url,name:title,inLanguage:'vi-VN',dateModified:today,about:{'@type':'Place',name:`${r.type} ${r.name}, ${r.province}`}})}</script></head><body><main><section class="local-hero"><div class="local-hero__copy"><p class="eyebrow">${esc(r.type.toUpperCase())} ${esc(r.name.toUpperCase())} · ${esc(r.province.toUpperCase())}</p><h1>${esc(title)}</h1><p class="local-hero__lead">Người lao động tại ${esc(r.type)} ${esc(r.name)} có thể đăng ký kiểm tra điều kiện trực tuyến. Đây là địa bàn tuyển nguồn; nơi học nghề và làm việc thực tế là Quảng Ninh.</p><div class="location-clarity"><div><small>NƠI TUYỂN NGUỒN</small><strong>${esc(r.type)} ${esc(r.name)}, ${esc(r.province)}</strong></div><span>→</span><div><small>NƠI HỌC & LÀM VIỆC</small><strong>Quảng Ninh</strong></div></div><p><a class="button" href="${apply}">Kiểm tra điều kiện</a></p></div></section><section class="section"><h2>Ba nghề đang tiếp nhận</h2><p>${jobLinks}</p><h2>Thông tin hành chính</h2><p>${esc(r.type)} ${esc(r.name)} thuộc ${esc(r.province)} trong hệ thống đơn vị hành chính cấp xã sau sắp xếp năm 2025. Nguồn đối chiếu: Cổng Thông tin điện tử Chính phủ.</p><p><a href="/viec-lam-nganh-than/${r.provinceSlug}/">Xem tuyển dụng toàn ${esc(r.province)} →</a></p></section></main></body></html>`;}

const out=path.join(ROOT,'viec-lam-nganh-than');
for(const r of communes){ const dir=path.join(out,r.provinceSlug,r.type,r.slug); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),page(r)); }

const byProvince=new Map(); for(const r of communes){ if(!byProvince.has(r.provinceSlug)) byProvince.set(r.provinceSlug,[]); byProvince.get(r.provinceSlug).push(r); }
for(const [pSlug,list] of byProvince){ const dir=path.join(out,pSlug,'xa-phuong'); fs.mkdirSync(dir,{recursive:true}); const p=list[0].province; const items=list.sort((a,b)=>a.name.localeCompare(b.name,'vi')).map(r=>`<li><a href="../${r.type}/${r.slug}/">${esc(r.type)} ${esc(r.name)}</a></li>`).join(''); fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Danh sách xã, phường ${esc(p)} | Tuyển thợ mỏ</title><meta name="description" content="Tra cứu tuyển thợ mỏ theo từng xã, phường tại ${esc(p)}; nơi học và làm việc thực tế tại Quảng Ninh."><meta name="robots" content="index,follow"><link rel="canonical" href="https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${pSlug}/xa-phuong/"><link rel="stylesheet" href="/styles.css"></head><body><main class="section"><h1>Tuyển thợ mỏ theo xã, phường tại ${esc(p)}</h1><p>Chọn đúng địa bàn đang sinh sống để giữ thông tin nguồn tuyển. Nơi làm việc không phải tại địa phương này mà tại Quảng Ninh.</p><ul>${items}</ul></main></body></html>`); }

const legacyMap=new Map(legacy.map(r=>[`${r.provinceSlug}/${r.slug}`,r]));
for(const r of legacyMap.values()){ const dir=path.join(out,r.provinceSlug,'huyen-cu',r.slug); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tuyển thợ mỏ khu vực huyện ${esc(r.name)} cũ, ${esc(r.province)}</title><meta name="description" content="Trang tra cứu tên huyện ${esc(r.name)} cũ để người lao động tìm đúng trang xã, phường hiện hành sau mô hình chính quyền địa phương 2 cấp."><meta name="robots" content="noindex,follow"><link rel="canonical" href="https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/xa-phuong/"></head><body><main><h1>Huyện ${esc(r.name)} là tên địa bàn cũ</h1><p>Từ mô hình chính quyền địa phương 2 cấp, cấp huyện không còn là cấp hành chính hiện hành. Hãy chọn xã/phường hiện nay để xem thông tin tuyển dụng.</p><p><a href="/viec-lam-nganh-than/${r.provinceSlug}/xa-phuong/">Chọn xã, phường hiện hành →</a></p></main></body></html>`); }

const sitemap=communes.map(r=>`<url><loc>https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${r.provinceSlug}/${r.type}/${r.slug}/</loc><lastmod>${today}</lastmod></url>`).join('');
fs.writeFileSync(path.join(ROOT,'commune-sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`);
fs.writeFileSync(path.join(ROOT,'local-coverage.json'),JSON.stringify({source:SOURCE,generated_at:new Date().toISOString(),communes:communes.length,legacy_district_names:legacyMap.size,by_province:Object.fromEntries([...byProvince].map(([k,v])=>[k,v.length]))},null,2));
console.log(`Generated ${communes.length} current commune/ward/special-zone pages and ${legacyMap.size} legacy district aliases.`);
