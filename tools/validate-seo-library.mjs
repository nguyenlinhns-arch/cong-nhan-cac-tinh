import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve("tuyen-tho-mo");
const base = "https://nguyenlinhns-arch.github.io/cong-nhan-cac-tinh/tuyen-tho-mo";
const errors = [];
const warnings = [];
const feed = JSON.parse(fs.readFileSync(path.join(root,"feed.json"),"utf8"));

if (feed.items.length !== 50) errors.push(`feed.json must contain 50 articles, got ${feed.items.length}`);
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

for (const [index,slug] of slugs.entries()) {
  const file = path.join(root,"bai-viet",slug,"index.html");
  if (!fs.existsSync(file)) { errors.push(`Missing ${file}`); continue; }
  const html = fs.readFileSync(file,"utf8");
  const prefix = `${slug}: `;
  const title = attr(html,/<title>([^<]+)<\/title>/i,`${prefix}title`);
  const desc = attr(html,/<meta name="description" content="([^"]+)"/i,`${prefix}description`);
  const canonical = attr(html,/<link rel="canonical" href="([^"]+)"/i,`${prefix}canonical`);
  const keyword = attr(html,/<meta name="keywords" content="([^,"]+)/i,`${prefix}keyword`);
  const image = attr(html,/<section class="article-hero">[\s\S]*?<img src="([^"]+)"/i,`${prefix}hero image`);
  const h1Count = (html.match(/<h1(?:\s|>)/gi)||[]).length;
  const visibleWords = strip(html).split(/\s+/).filter(Boolean).length;
  if (h1Count !== 1) errors.push(`${prefix}expected one H1, got ${h1Count}`);
  if (title.length < 35 || title.length > 90) warnings.push(`${prefix}title length ${title.length}`);
  if (desc.length < 100 || desc.length > 160) errors.push(`${prefix}description length ${desc.length}`);
  if (canonical !== `${base}/bai-viet/${slug}/`) errors.push(`${prefix}wrong canonical`);
  if (!strip(html).toLocaleLowerCase("vi").includes(keyword.toLocaleLowerCase("vi"))) errors.push(`${prefix}primary keyword absent from body`);
  if (visibleWords < 1000) errors.push(`${prefix}only ${visibleWords} visible words`);
  if (!/"@type":"Article"/.test(html) || !/"@type":"FAQPage"/.test(html)) errors.push(`${prefix}missing Article or FAQ schema`);
  const imageFile = path.resolve(path.dirname(file),image);
  if (!fs.existsSync(imageFile)) errors.push(`${prefix}missing image ${image}`);
  const externalAnchors = [...html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)].map(m=>m[1]).filter(url=>!url.startsWith(base) && !url.startsWith("https://zalo.me/") && !url.startsWith("https://m.me/"));
  if (externalAnchors.length) errors.push(`${prefix}unexpected outbound anchors: ${externalAnchors.join(", ")}`);
  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const [j,m] of jsonScripts.entries()) {
    try { JSON.parse(m[1]); } catch (e) { errors.push(`${prefix}invalid JSON-LD ${j+1}: ${e.message}`); }
  }
}

const sitemap = fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
for (const slug of slugs) if (!sitemap.includes(`${base}/bai-viet/${slug}/`)) errors.push(`${slug}: absent from sitemap`);
for (const required of ["tin-nganh-than/index.html","index.html","article-insights.css","feed.xml","llms.txt"]) {
  if (!fs.existsSync(path.join(root,required))) errors.push(`Missing ${required}`);
}

console.log(JSON.stringify({
  articles:slugs.length,
  errors:errors.length,
  warnings:warnings.length,
  sampleWarnings:warnings.slice(0,10),
},null,2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
