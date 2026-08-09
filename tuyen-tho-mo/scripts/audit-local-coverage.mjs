import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const report=JSON.parse(fs.readFileSync(path.join(ROOT,'local-coverage.json'),'utf8'));
if(report.communes!==3321) throw new Error(`Sai tổng số địa bàn: ${report.communes}`);
const provinces=Object.entries(report.by_province||{});
if(provinces.length!==34) throw new Error(`Sai số tỉnh thành: ${provinces.length}`);
let files=0;
for(const [slug,count] of provinces){
  const hub=path.join(ROOT,'viec-lam-nganh-than',slug,'xa-phuong','index.html');
  if(!fs.existsSync(hub)) throw new Error(`${slug}: thiếu hub xã/phường`);
  const hubHtml=fs.readFileSync(hub,'utf8');
  const links=[...hubHtml.matchAll(/href="\.\.\/(xã|phường|đặc khu)\/([^/]+)\//giu)];
  if(links.length!==count) throw new Error(`${slug}: hub có ${links.length}/${count} liên kết địa bàn`);
  const unique=new Set(links.map(m=>`${m[1]}/${m[2]}`));
  if(unique.size!==count) throw new Error(`${slug}: có liên kết địa bàn trùng`);
  for(const key of unique){
    const [type,localSlug]=key.split('/');
    const file=path.join(ROOT,'viec-lam-nganh-than',slug,type,localSlug,'index.html');
    if(!fs.existsSync(file)) throw new Error(`${slug}/${key}: thiếu trang`);
    const html=fs.readFileSync(file,'utf8');
    for(const marker of ['<h1>','rel="canonical"','utm_campaign=commune_jobs','NƠI HỌC &amp; LÀM VIỆC']) if(!html.includes(marker)) throw new Error(`${slug}/${key}: thiếu ${marker}`);
    if(/"@type"\s*:\s*"JobPosting"/u.test(html)) throw new Error(`${slug}/${key}: không được khai JobPosting giả tại địa phương`);
    files++;
  }
  const provincePage=path.join(ROOT,'viec-lam-nganh-than',slug,'index.html');
  if(!fs.existsSync(provincePage)||!fs.readFileSync(provincePage,'utf8').includes(`/${slug}/xa-phuong/`)) throw new Error(`${slug}: trang tỉnh chưa liên kết xuống xã/phường`);
}
if(files!==3321) throw new Error(`Chỉ kiểm được ${files}/3321 trang`);
const sitemap=fs.readFileSync(path.join(ROOT,'commune-sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(urls.length!==3321||new Set(urls).size!==3321) throw new Error(`Sitemap có ${urls.length} URL, unique ${new Set(urls).size}`);
console.log(JSON.stringify({status:'ok',communes:files,provinces:provinces.length,sitemap_urls:urls.length},null,2));
