import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const report=JSON.parse(fs.readFileSync(path.join(ROOT,'local-coverage.json'),'utf8'));
const items=[];
for(const provinceSlug of Object.keys(report.by_province||{})){
  const hub=path.join(ROOT,'viec-lam-nganh-than',provinceSlug,'xa-phuong','index.html');
  const hubHtml=fs.readFileSync(hub,'utf8');
  const province=hubHtml.match(/<h1[^>]*>[^<]*tại\s+([^<]+)<\/h1>/iu)?.[1]?.trim() || provinceSlug;
  for(const m of hubHtml.matchAll(/href="\.\.\/(xã|phường|đặc khu)\/([^/]+)\/">([^<]+)<\/a>/giu)){
    const type=m[1]; const slug=m[2]; const label=m[3].replace(/<[^>]+>/g,'').trim();
    const locality=label.replace(/^(xã|phường|đặc khu)\s+/iu,'');
    const url=`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${provinceSlug}/${type}/${slug}/`;
    items.push({name:label,locality,type,province,province_slug:provinceSlug,url,parent:`https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${provinceSlug}/`,application_url:`https://thaylinhtuyenthomo.vn/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?province=${encodeURIComponent(province)}&locality=${encodeURIComponent(locality)}&utm_source=locality_feed&utm_medium=referral&utm_campaign=commune_jobs#dang-ky`});
  }
}
if(items.length!==3321) throw new Error(`Feed chỉ có ${items.length}/3321 địa bàn`);
const urls=new Set(items.map(x=>x.url));
if(urls.size!==3321) throw new Error(`Feed có URL trùng: ${urls.size}/3321 unique`);
const feed={schema_version:1,generated_at:new Date().toISOString(),source:report.source,total:items.length,provinces:Object.keys(report.by_province||{}).length,work_location:'Quảng Ninh',localities:items};
fs.writeFileSync(path.join(ROOT,'localities.json'),JSON.stringify(feed,null,2));
console.log(JSON.stringify({status:'ok',localities:items.length,provinces:feed.provinces},null,2));
