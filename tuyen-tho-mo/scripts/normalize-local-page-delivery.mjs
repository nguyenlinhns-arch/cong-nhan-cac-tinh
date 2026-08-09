import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const coverage=JSON.parse(fs.readFileSync(path.join(ROOT,'local-coverage.json'),'utf8'));
const BASE=path.join(ROOT,'viec-lam-nganh-than');
const OG_IMAGE='https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg';
const esc=s=>String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const text=s=>String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

function ensureHead(html){
  const title=text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const description=html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]||'';
  const canonical=html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]||'';
  html=html.replace(/<meta\s+name=["']viewport["'][^>]*>/i,'<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">');
  if(!/name=["']viewport["']/i.test(html)) html=html.replace(/<meta\s+charset=[^>]+>/i,m=>`${m}<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`);
  const additions=[];
  if(!html.includes('href="/favicon.ico"')) additions.push('<link rel="icon" href="/favicon.ico">');
  if(!html.includes('href="/favicon-48x48.png"')) additions.push('<link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">');
  if(!html.includes('rel="apple-touch-icon"')) additions.push('<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">');
  if(!html.includes('href="/fonts.css?v=2"')) additions.push('<link rel="stylesheet" href="/fonts.css?v=2">');
  if(!html.includes('href="/mobile-core.css?v=1"')) additions.push('<link rel="stylesheet" href="/mobile-core.css?v=1">');
  if(!html.includes('property="og:title"')) additions.push(`<meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:alt" content="Thầy Linh – Tuyển Thợ Mỏ">`);
  if(!html.includes('name="twitter:card"')) additions.push(`<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${OG_IMAGE}">`);
  if(additions.length) html=html.replace('</head>',`${additions.join('')}</head>`);
  return html;
}
function ensureScripts(html){
  const additions=[];
  if(!html.includes('/analytics.js?v=6')) additions.push('<script src="/analytics.js?v=6" defer></script>');
  if(!html.includes('/mobile-core.js?v=1')) additions.push('<script src="/mobile-core.js?v=1" defer></script>');
  if(additions.length) html=html.replace('</body>',`${additions.join('')}</body>`);
  return html;
}
function ensureAccessibility(html){
  const mainMatch=html.match(/<main\b([^>]*)>/i);
  if(!mainMatch) throw new Error('Trang địa phương thiếu main landmark');
  let mainId=mainMatch[1].match(/\bid=["']([^"']+)["']/i)?.[1]||'';
  if(!mainId){
    mainId='main-content';
    html=html.replace(/<main\b([^>]*)>/i,(_m,attrs)=>`<main${attrs} id="${mainId}">`);
  }
  if(!/<a\b[^>]*class=["'][^"']*(?:skip-link|network-skip)[^"']*["']/i.test(html)){
    html=html.replace(/<body([^>]*)>/i,`<body$1><a class="skip-link" href="#${esc(mainId)}">Bỏ qua điều hướng</a>`);
  }
  return html;
}
function normalize(file){let html=fs.readFileSync(file,'utf8');html=ensureHead(html);html=ensureAccessibility(html);html=ensureScripts(html);fs.writeFileSync(file,html);}

let localities=0,hubs=0,provinceRoots=0;
for(const [slug,count] of Object.entries(coverage.by_province||{})){
  const hub=path.join(BASE,slug,'xa-phuong','index.html');
  normalize(hub); hubs++;
  const hubHtml=fs.readFileSync(hub,'utf8');
  const links=[...hubHtml.matchAll(/href="\.\.\/(xã|phường|đặc khu)\/([^/]+)\//giu)];
  if(links.length!==count) throw new Error(`${slug}: hub có ${links.length}/${count} địa bàn`);
  for(const m of links){normalize(path.join(BASE,slug,m[1],m[2],'index.html'));localities++;}
  const root=path.join(BASE,slug,'index.html');
  if(!fs.existsSync(root)) throw new Error(`${slug}: thiếu trang tỉnh`);
  normalize(root); provinceRoots++;
}
if(localities!==3321||hubs!==34||provinceRoots!==34) throw new Error(`Chuẩn hóa sai số lượng: ${localities}/${hubs}/${provinceRoots}`);
console.log(JSON.stringify({status:'ok',localities,hubs,province_roots:provinceRoots,accessibility:true},null,2));
