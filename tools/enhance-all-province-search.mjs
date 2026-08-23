import fs from "node:fs";
import path from "node:path";

// Pages always calls this step after province generation. Normalize both province
// template families, re-apply the canonical page-role policy, then rebuild the
// province sitemap so noindex/redirect roles and sitemap membership cannot drift.
await import("./normalize-province-current-facts-v11.mjs");
await import("./apply-seo-role-policy.mjs");
await import("../tuyen-tho-mo/scripts/update-ai-locality-discovery.mjs");

const root = path.resolve("tuyen-tho-mo");
const indexPath = path.join(root, "search-provinces.json");
const manifestPath = path.join(root, "search-index.json");
const provincePath = path.join(root, "data", "provinces-2026.json");
const coveragePath = path.join(root, "local-coverage.json");
const searchIndex = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const provinceData = JSON.parse(fs.readFileSync(provincePath, "utf8"));
const prioritized = Array.isArray(provinceData.provinces) ? provinceData.provinces : [];
const coverage = fs.existsSync(coveragePath) ? JSON.parse(fs.readFileSync(coveragePath, "utf8")) : {by_province:{}};
const ALL_NAMES = Object.freeze({
  "ha-noi":"Hà Nội","ho-chi-minh":"TP Hồ Chí Minh","da-nang":"Đà Nẵng","hai-phong":"Hải Phòng","can-tho":"Cần Thơ","hue":"Huế",
  "an-giang":"An Giang","bac-ninh":"Bắc Ninh","ca-mau":"Cà Mau","cao-bang":"Cao Bằng","dak-lak":"Đắk Lắk","dien-bien":"Điện Biên",
  "dong-nai":"Đồng Nai","dong-thap":"Đồng Tháp","gia-lai":"Gia Lai","ha-tinh":"Hà Tĩnh","hai-phong":"Hải Phòng","hung-yen":"Hưng Yên","khanh-hoa":"Khánh Hòa",
  "lai-chau":"Lai Châu","lam-dong":"Lâm Đồng","lang-son":"Lạng Sơn","lao-cai":"Lào Cai","nghe-an":"Nghệ An","ninh-binh":"Ninh Bình",
  "phu-tho":"Phú Thọ","quang-ngai":"Quảng Ngãi","quang-ninh":"Quảng Ninh","quang-tri":"Quảng Trị","son-la":"Sơn La","tay-ninh":"Tây Ninh",
  "thai-nguyen":"Thái Nguyên","thanh-hoa":"Thanh Hóa","tuyen-quang":"Tuyên Quang","vinh-long":"Vĩnh Long"
});
const prioritizedBySlug = new Map(prioritized.map(p=>[p.slug,p]));
const coverageSlugs = Object.keys(coverage.by_province || {});
const provinces = coverageSlugs.map(slug => ({slug,name:ALL_NAMES[slug]||slug,aliases:[],...(prioritizedBySlug.get(slug)||{})}));
const localityAliasesByProvince = Object.freeze({
  "thanh-hoa": ["Mường Lát", "Lang Chánh"], "nghe-an": ["Anh Sơn"], "quang-tri": ["Hướng Hóa"],
  "gia-lai": ["K'Bang", "K’Bang", "KBang"], "quang-ninh": ["Bình Liêu"], "thai-nguyen": ["Bằng Thành", "Phúc Lộc"],
  "lao-cai": ["Bát Xát"], "cao-bang": ["Bảo Lạc"], "son-la": ["Sông Mã"], "dien-bien": ["Tủa Chùa"],
});

if (searchIndex.version !== 4 || searchIndex.tier !== "provinces" || !Array.isArray(searchIndex.items)) throw new Error(`All-province search expected province tier version 4, got ${searchIndex.version}`);
if (provinces.length !== 34) throw new Error(`All-province search expected 34 provinces, got ${provinces.length}`);

function decode(value = "") { return String(value).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function strip(value = "") { return decode(String(value).replace(/<[^>]*>/g, " ")); }
function match(html, pattern) { return decode(html.match(pattern)?.[1] || ""); }
function localEvidencePhrases(html, province) {
  const phrases = [];
  const storyBlock = html.match(/<div\b[^>]*class=["'][^"']*\blocal-story-list\b[^"']*["'][^>]*>([\s\S]*?)<\/section>/i)?.[1] || "";
  for (const result of storyBlock.matchAll(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi)) { const phrase = strip(result[1]); if (phrase) phrases.push(phrase); }
  if (province.reportage?.title) phrases.push(String(province.reportage.title));
  if (province.reportage?.summary) phrases.push(String(province.reportage.summary));
  return [...new Set(phrases.map(decode).filter(Boolean))];
}
function provinceItem(province) {
  const file = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`All-province search is missing ${province.slug}`);
  const html = fs.readFileSync(file, "utf8");
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const title = match(html, /<title>([\s\S]*?)<\/title>/i).replace(/\s*[|–-]\s*Thầy Linh.*$/i, "");
  const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const metaKeywords = match(html, /<meta\s+name="keywords"\s+content="([^"]+)"/i).split(",").map((item) => item.trim()).filter(Boolean);
  const aliases = Array.isArray(province.aliases) ? province.aliases : [];
  const localityAliases = localityAliasesByProvince[province.slug] || [];
  const localEvidence = localEvidencePhrases(html, province);
  const keywords = [...new Set([...metaKeywords,province.name,...aliases,...localityAliases,...localEvidence,`tuyển thợ mỏ ${province.name}`,`việc làm ngành than ${province.name}`,...aliases.flatMap((alias) => [`tuyển thợ mỏ ${alias}`, `việc làm ngành than ${alias}`]),...localityAliases.flatMap((alias) => [`tuyển thợ mỏ ${alias}`, `việc làm ngành than ${alias}`])])];
  return {url:`/viec-lam-nganh-than/${province.slug}/`,title:title||`Tuyển thợ mỏ tại ${province.name}`,description:description||`Thông tin học nghề mỏ dành cho lao động tại ${province.name}; nơi học và làm việc tại Quảng Ninh.`,keywords:keywords.slice(0,24),aliases:[...new Set([province.name,...aliases,...localityAliases])],category:"province",categoryLabel:"Việc làm theo tỉnh",type:"Việc làm theo tỉnh",priority:45,searchScope:noindex?"internal":"public",localityEvidenceCount:localEvidence.length,localityAliasCount:localityAliases.length};
}
function ensureLocalityDirectoryLink(province) {
  const file = path.join(root,"viec-lam-nganh-than",province.slug,"index.html");
  if(!fs.existsSync(file)) throw new Error(`Missing province page ${province.slug}`);
  let html=fs.readFileSync(file,"utf8");
  const href=`/viec-lam-nganh-than/${province.slug}/xa-phuong/`;
  if(!html.includes(href)) {
    const count=Number(coverage.by_province?.[province.slug]||0);
    const block=`<section class="section local-directory-entry"><h2>Tuyển thợ mỏ theo từng xã, phường</h2><p><a href="${href}">Xem toàn bộ ${count} xã, phường, đặc khu của ${province.name} →</a></p></section>`;
    html=html.replace('</main>',`${block}</main>`);
    fs.writeFileSync(file,html);
  }
}

searchIndex.items = searchIndex.items.filter(item => item.category !== "province" || /^\/viec-lam-nganh-than\/[^/]+\/$/u.test(item.url || ""));
let added=0,refreshed=0,expectedInternal=0,localityEvidencePhrases=0,localityAliases=0;
for (const province of provinces) {
  ensureLocalityDirectoryLink(province);
  const item=provinceItem(province);
  if(item.searchScope==="internal") expectedInternal++;
  localityEvidencePhrases+=Number(item.localityEvidenceCount||0); localityAliases+=Number(item.localityAliasCount||0);
  const index=searchIndex.items.findIndex(candidate=>candidate.url===item.url);
  if(index<0){searchIndex.items.push(item);added++;} else {const existing=searchIndex.items[index];searchIndex.items[index]={...existing,...item,keywords:[...new Set([...(Array.isArray(existing.keywords)?existing.keywords:[]),...item.keywords])],};refreshed++;}
}
searchIndex.items=searchIndex.items.filter((item,index,all)=>all.findIndex(candidate=>candidate.url===item.url)===index).sort((left,right)=>Number(right.priority||0)-Number(left.priority||0)||left.title.localeCompare(right.title,"vi"));
const provinceItems=searchIndex.items.filter(item=>item.category==="province");
const internalItems=provinceItems.filter(item=>item.searchScope==="internal");
if(provinceItems.length!==34) throw new Error(`All-province search produced ${provinceItems.length}/34 province items`);
if(internalItems.length!==expectedInternal) throw new Error(`All-province search expected ${expectedInternal} internal-only province pages, got ${internalItems.length}`);
fs.writeFileSync(indexPath,`${JSON.stringify(searchIndex,null,2)}\n`);
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
manifest.counts.provinces=provinceItems.length;
manifest.counts.total=Number(manifest.counts.core||0)+provinceItems.length+Number(manifest.counts.content||0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);
console.log(JSON.stringify({target:"tuyen-tho-mo/search-provinces.json",provinces:provinceItems.length,public_provinces:provinceItems.length-internalItems.length,internal_provinces:internalItems.length,locality_evidence_phrases:localityEvidencePhrases,locality_aliases:localityAliases,province_directory_links:provinces.length,added,refreshed,provinceFactsNormalized:true,seoRolePolicyApplied:true,provinceSitemapRebuilt:true},null,2));
