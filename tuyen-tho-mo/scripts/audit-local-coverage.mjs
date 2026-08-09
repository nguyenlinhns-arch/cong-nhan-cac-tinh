import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const report=JSON.parse(fs.readFileSync(path.join(ROOT,'local-coverage.json'),'utf8'));
if(report.communes!==3321) throw new Error(`Sai tổng số địa bàn: ${report.communes}`);
const provinces=Object.entries(report.by_province||{});
if(provinces.length!==34) throw new Error(`Sai số tỉnh thành: ${provinces.length}`);
let files=0,evidencePages=0,evidenceRecords=0;
const canonicals=new Set(),titles=new Set();
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
    for(const marker of ['<h1>','rel="canonical"','utm_campaign=commune_jobs','NƠI HỌC & LÀM VIỆC','data-local-quality="2"','property="og:title"','"@type":"FAQPage"','Cổng Thông tin điện tử Chính phủ','Điều kiện cơ bản','Học nghề trước khi nhận việc']) if(!html.includes(marker)) throw new Error(`${slug}/${key}: thiếu ${marker}`);
    if(/"@type"\s*:\s*"JobPosting"/u.test(html)) throw new Error(`${slug}/${key}: không được khai JobPosting giả tại địa phương`);
    const canonical=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    const title=html.match(/<title>([^<]+)<\/title>/i)?.[1];
    if(!canonical||canonicals.has(canonical)) throw new Error(`${slug}/${key}: canonical thiếu hoặc trùng`);
    if(!title||titles.has(title)) throw new Error(`${slug}/${key}: title thiếu hoặc trùng`);
    canonicals.add(canonical); titles.add(title);
    if(html.includes('data-history-local="1"')){
      evidencePages++;
      const n=Number(html.match(/data-evidence-count="(\d+)"/i)?.[1]||0);
      if(n<5) throw new Error(`${slug}/${key}: dữ liệu lịch sử dưới ngưỡng 5 hồ sơ`);
      evidenceRecords+=n;
      for(const marker of ['số liệu tổng hợp hồ sơ tuyển sinh','không phải xác nhận người đó hiện vẫn làm việc','không đưa họ tên','data-local-history-schema','"@type":"Dataset"']) if(!html.includes(marker)) throw new Error(`${slug}/${key}: bằng chứng địa phương thiếu bảo vệ ${marker}`);
      const block=html.match(/<section class="section local-worker-history"[\s\S]*?<\/section>/iu)?.[0]||'';
      if(/\b(ngày sinh|cccd|căn cước|số điện thoại)\s*[:：]/iu.test(block)) throw new Error(`${slug}/${key}: có dấu hiệu PII trong khối dữ liệu địa phương`);
      if(/\bđang\s+làm\s+(việc\s+)?tại\b/iu.test(block)) throw new Error(`${slug}/${key}: khẳng định việc làm hiện tại không có căn cứ`);
    }
    files++;
  }
  const provincePage=path.join(ROOT,'viec-lam-nganh-than',slug,'index.html');
  if(!fs.existsSync(provincePage)||!fs.readFileSync(provincePage,'utf8').includes(`/${slug}/xa-phuong/`)) throw new Error(`${slug}: trang tỉnh chưa liên kết xuống xã/phường`);
}
if(files!==3321) throw new Error(`Chỉ kiểm được ${files}/3321 trang`);
const sitemap=fs.readFileSync(path.join(ROOT,'commune-sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(urls.length!==3321||new Set(urls).size!==3321) throw new Error(`Sitemap có ${urls.length} URL, unique ${new Set(urls).size}`);
const feed=JSON.parse(fs.readFileSync(path.join(ROOT,'localities.json'),'utf8'));
if(feed.total!==3321||feed.localities?.length!==3321) throw new Error(`Feed địa bàn sai tổng số: ${feed.total}/${feed.localities?.length}`);
if(new Set(feed.localities.map(x=>x.url)).size!==3321) throw new Error('Feed địa bàn có URL trùng');
if(evidencePages<1) throw new Error('Không còn trang nào có bằng chứng dữ liệu địa phương');
const evidenceReportPath=path.join(ROOT,'local-evidence-report.json');
if(fs.existsSync(evidenceReportPath)){
  const ev=JSON.parse(fs.readFileSync(evidenceReportPath,'utf8'));
  if(ev.written!==evidencePages) throw new Error(`Báo cáo bằng chứng lệch: ${ev.written}/${evidencePages}`);
  if(ev.privacy_threshold!==5) throw new Error('Ngưỡng riêng tư dữ liệu địa phương không đúng');
}
console.log(JSON.stringify({status:'ok',communes:files,provinces:provinces.length,sitemap_urls:urls.length,locality_feed:feed.total,unique_titles:titles.size,unique_canonicals:canonicals.size,evidence_pages:evidencePages,evidence_records:evidenceRecords,privacy_threshold:5},null,2));