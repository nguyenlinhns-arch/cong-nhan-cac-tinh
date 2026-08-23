import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const SITE='https://thaylinhtuyenthomo.vn';
const localities=JSON.parse(fs.readFileSync(path.join(ROOT,'localities.json'),'utf8'));
if(localities.total!==3321) throw new Error('localities.json chưa đủ 3.321 địa bàn');

const robotsPath=path.join(ROOT,'robots.txt');
let robots=fs.readFileSync(robotsPath,'utf8');
const localityLine='# Danh mục 3.321 địa bàn tuyển nguồn dạng JSON: https://thaylinhtuyenthomo.vn/localities.json';
if(!robots.includes(localityLine)) robots=robots.trimEnd()+`\n${localityLine}\n`;
fs.writeFileSync(robotsPath,robots);

const llmsPath=path.join(ROOT,'llms.txt');
let llms=fs.readFileSync(llmsPath,'utf8');
llms=llms.replace('ba nghề đang tuyển và 26 trang địa phương.','ba nghề đang tuyển, 34 trang tỉnh/thành và 3.321 trang xã, phường, đặc khu hiện hành.');
const feedLine='- [Danh mục 3.321 địa bàn tuyển nguồn](https://thaylinhtuyenthomo.vn/localities.json): tên xã/phường/đặc khu, tỉnh/thành, URL chuẩn và đường đăng ký có giữ chính xác nguồn địa bàn.';
if(!llms.includes(feedLine)){
  const marker='## Dữ liệu máy đọc và nguồn cập nhật';
  const idx=llms.indexOf(marker);
  if(idx>=0){
    const after=idx+marker.length;
    llms=llms.slice(0,after)+`\n\n${feedLine}`+llms.slice(after);
  } else llms+=`\n\n${feedLine}\n`;
}
fs.writeFileSync(llmsPath,llms);

// Province sitemap must contain only canonical pages that are actually indexable.
// This keeps Google from receiving contradictory sitemap + noindex signals.
const provinceRoot=path.join(ROOT,'viec-lam-nganh-than');
const provinceUrls=[];
for(const entry of fs.readdirSync(provinceRoot,{withFileTypes:true})){
  if(!entry.isDirectory()) continue;
  const file=path.join(provinceRoot,entry.name,'index.html');
  if(!fs.existsSync(file)) continue;
  const html=fs.readFileSync(file,'utf8');
  const robotsMeta=html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1]||'';
  if(/noindex/i.test(robotsMeta)||!/index/i.test(robotsMeta)) continue;
  const canonical=html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  if(!canonical||!canonical.startsWith(`${SITE}/viec-lam-nganh-than/`)) continue;
  const modified=html.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})/i)?.[1]
    || html.match(/dateModified:\s*["'](\d{4}-\d{2}-\d{2})["']/i)?.[1]
    || new Date().toISOString().slice(0,10);
  provinceUrls.push({canonical,modified});
}
provinceUrls.sort((a,b)=>a.canonical.localeCompare(b.canonical,'vi'));
const provinceSitemap=provinceUrls.map(({canonical,modified})=>`<url><loc>${canonical}</loc><lastmod>${modified}</lastmod></url>`).join('');
fs.writeFileSync(path.join(ROOT,'province-sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${provinceSitemap}</urlset>`);
if(!provinceUrls.length) throw new Error('province-sitemap.xml không còn URL indexable');

console.log(JSON.stringify({status:'ok',localities:localities.total,robots:true,llms:true,province_sitemap_urls:provinceUrls.length},null,2));
