import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const errors = [];
const warnings = [];
const feed = JSON.parse(fs.readFileSync(path.join(root,"feed.json"),"utf8"));
const imageSources = JSON.parse(fs.readFileSync(path.join(root,"assets","articles","sources.json"),"utf8"));
const searchIndex = JSON.parse(fs.readFileSync(path.join(root,"search-index.json"),"utf8"));
const articleImages = [];

if (feed.items.length < 50) errors.push(`feed.json must contain at least 50 articles, got ${feed.items.length}`);
const slugs = feed.items.map(item => item.url.split("/").filter(Boolean).at(-1));
if (new Set(slugs).size !== slugs.length) errors.push("Duplicate article slugs");
if (new Set(feed.items.map(x=>x.title)).size !== feed.items.length) errors.push("Duplicate article titles");

const strip = html => html
  .replace(/<script[\s\S]*?<\/script>/gi," ")
  .replace(/<style[\s\S]*?<\/style>/gi," ")
  .replace(/<[^>]+>/g," ")
  .replace(/&[a-z0-9#]+;/gi," ")
  .replace(/\s+/g," ")
  .trim();

function attr(html, pattern, name) {
  return html.match(pattern)?.[1] || (errors.push(`Missing ${name}`),"");
}

function collectHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) collectHtml(full,out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

for (const [index,slug] of slugs.entries()) {
  const item = feed.items[index];
  const relativeUrl = item.url.startsWith(`${base}/`) ? item.url.slice(base.length + 1) : "";
  if (!relativeUrl) { errors.push(`${slug}: URL is outside the website`); continue; }
  const file = path.join(root,relativeUrl,"index.html");
  if (!fs.existsSync(file)) { errors.push(`Missing ${file}`); continue; }
  const html = fs.readFileSync(file,"utf8");
  const prefix = `${slug}: `;
  const title = attr(html,/<title>([^<]+)<\/title>/i,`${prefix}title`);
  const desc = attr(html,/<meta name="description" content="([^"]+)"/i,`${prefix}description`);
  const canonical = attr(html,/<link rel="canonical" href="([^"]+)"/i,`${prefix}canonical`);
  const keyword = attr(html,/<meta name="keywords" content="([^,"]+)/i,`${prefix}keyword`);
  const image = attr(html,/<section class="article-hero">[\s\S]*?<img src="([^"]+)"/i,`${prefix}hero image`);
  const ogImage = attr(html,/<meta property="og:image" content="([^"]+)"/i,`${prefix}Open Graph image`);
  const h1Count = (html.match(/<h1(?:\s|>)/gi)||[]).length;
  const visibleWords = strip(html).split(/\s+/).filter(Boolean).length;
  if (h1Count !== 1) errors.push(`${prefix}expected one H1, got ${h1Count}`);
  if (title.length < 35 || title.length > 90) warnings.push(`${prefix}title length ${title.length}`);
  if (desc.length < 100 || desc.length > 160) errors.push(`${prefix}description length ${desc.length}`);
  if (canonical !== item.url) errors.push(`${prefix}wrong canonical`);
  if (!strip(html).toLocaleLowerCase("vi").includes(keyword.toLocaleLowerCase("vi"))) errors.push(`${prefix}primary keyword absent from body`);
  if (visibleWords < 1000) errors.push(`${prefix}only ${visibleWords} visible words`);
  if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(html) || !/"@type":"FAQPage"/.test(html)) errors.push(`${prefix}missing article or FAQ schema`);
  if (!image.startsWith("https://vinacomin.vn/Share/Media/")) errors.push(`${prefix}image is not from the Vinacomin image library`);
  if (ogImage !== image || item.image !== image) errors.push(`${prefix}hero, Open Graph and feed images must match`);
  if (/class="highlight"|Cách đọc đúng:|Tóm tắt:/.test(html)) errors.push(`${prefix}contains a forbidden highlight summary block`);
  articleImages.push(image);
  const externalAnchors = [...html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)].map(m=>m[1]).filter(url=>!url.startsWith(base) && !url.startsWith("https://zalo.me/") && !url.startsWith("https://m.me/"));
  if (externalAnchors.length) errors.push(`${prefix}unexpected outbound anchors: ${externalAnchors.join(", ")}`);
  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const [j,m] of jsonScripts.entries()) {
    try { JSON.parse(m[1]); } catch (e) { errors.push(`${prefix}invalid JSON-LD ${j+1}: ${e.message}`); }
  }
}

if (new Set(articleImages).size !== articleImages.length) errors.push("Article images must be unique");
const sourceUrls = Object.values(imageSources).map(source => source.source_url);
if (sourceUrls.some(url => !url?.startsWith("https://vinacomin.vn/Share/Media/"))) errors.push("Image source registry contains a non-Vinacomin image");
if (new Set(sourceUrls).size !== sourceUrls.length) errors.push("Image source registry contains duplicate images");

const sitemap = fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
for (const item of feed.items) if (!sitemap.includes(item.url)) errors.push(`${item.url}: absent from sitemap`);
const allHtml = collectHtml(root);
for (const file of allHtml) {
  const html = fs.readFileSync(file,"utf8");
  const rel = path.relative(root,file);
  if (!/<meta\s+name="viewport"\s+content="[^"]*width=device-width/i.test(html)) errors.push(`${rel}: missing responsive viewport`);
  if (!/<link\s+rel="stylesheet"\s+href="\/mobile-ux\.css\?v=1"/i.test(html)) errors.push(`${rel}: missing shared mobile stylesheet`);
  if (!/<script\s+src="\/mobile-ux\.js\?v=1"\s+defer><\/script>/i.test(html)) errors.push(`${rel}: missing shared mobile script`);
}

if (!Array.isArray(searchIndex.items) || searchIndex.items.length < 70) errors.push("Search index must contain at least 70 pages");
else {
  const searchUrls = searchIndex.items.map(item => item.url);
  if (new Set(searchUrls).size !== searchUrls.length) errors.push("Search index contains duplicate URLs");
  for (const item of searchIndex.items) {
    if (!item.url?.startsWith("/") || !item.title || !item.description || !item.category) errors.push(`Invalid search entry: ${JSON.stringify(item)}`);
  }
  for (const item of feed.items) {
    const relative = item.url.startsWith(base) ? item.url.slice(base.length) : item.url;
    if (!searchUrls.includes(relative)) errors.push(`${relative}: absent from search index`);
  }
}

for (const required of ["tin-nganh-than/index.html","index.html","article-insights.css","mobile-ux.css","mobile-ux.js","search-index.json","feed.xml","llms.txt"]) {
  if (!fs.existsSync(path.join(root,required))) errors.push(`Missing ${required}`);
}

console.log(JSON.stringify({
  articles:slugs.length,
  pages:allHtml.length,
  searchPages:searchIndex.items?.length || 0,
  errors:errors.length,
  warnings:warnings.length,
  sampleWarnings:warnings.slice(0,10),
},null,2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
