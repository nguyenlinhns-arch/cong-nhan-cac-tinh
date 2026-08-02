import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const indexPath = path.join(root, "search-index.json");
const provincePath = path.join(root, "data", "provinces-2026.json");
const searchIndex = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const provinceData = JSON.parse(fs.readFileSync(provincePath, "utf8"));
const provinces = Array.isArray(provinceData.provinces) ? provinceData.provinces : [];

if (searchIndex.version !== 3 || !Array.isArray(searchIndex.items)) {
  throw new Error(`All-province search expected index version 3, got ${searchIndex.version}`);
}
if (provinces.length !== 26) throw new Error(`All-province search expected 26 provinces, got ${provinces.length}`);

function decode(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function match(html, pattern) {
  return decode(html.match(pattern)?.[1] || "");
}

function provinceItem(province) {
  const file = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`All-province search is missing ${province.slug}`);
  const html = fs.readFileSync(file, "utf8");
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const title = match(html, /<title>([\s\S]*?)<\/title>/i).replace(/\s*[|–-]\s*Thầy Linh.*$/i, "");
  const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const metaKeywords = match(html, /<meta\s+name="keywords"\s+content="([^"]+)"/i)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const aliases = Array.isArray(province.aliases) ? province.aliases : [];
  const keywords = [...new Set([
    ...metaKeywords,
    province.name,
    ...aliases,
    `tuyển thợ mỏ ${province.name}`,
    `việc làm ngành than ${province.name}`,
    ...aliases.flatMap((alias) => [`tuyển thợ mỏ ${alias}`, `việc làm ngành than ${alias}`]),
  ])];
  return {
    url: `/viec-lam-nganh-than/${province.slug}/`,
    title: title || `Tuyển thợ mỏ tại ${province.name}`,
    description: description || `Thông tin học nghề mỏ dành cho lao động tại ${province.name}; nơi học và làm việc tại Quảng Ninh.`,
    keywords,
    category: "province",
    categoryLabel: "Việc làm theo tỉnh",
    type: "Việc làm theo tỉnh",
    priority: 45,
    searchScope: noindex ? "internal" : "public",
  };
}

let added = 0;
let refreshed = 0;
let expectedInternal = 0;
for (const province of provinces) {
  const item = provinceItem(province);
  if (item.searchScope === "internal") expectedInternal += 1;
  const index = searchIndex.items.findIndex((candidate) => candidate.url === item.url);
  if (index < 0) {
    searchIndex.items.push(item);
    added += 1;
    continue;
  }
  const existing = searchIndex.items[index];
  searchIndex.items[index] = {
    ...existing,
    ...item,
    keywords: [...new Set([...(Array.isArray(existing.keywords) ? existing.keywords : []), ...item.keywords])],
  };
  refreshed += 1;
}

searchIndex.items = searchIndex.items
  .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index)
  .sort((left, right) => Number(right.priority || 0) - Number(left.priority || 0) || left.title.localeCompare(right.title, "vi"));

const provinceItems = searchIndex.items.filter((item) => item.category === "province");
const internalItems = provinceItems.filter((item) => item.searchScope === "internal");
if (provinceItems.length !== provinces.length) {
  throw new Error(`All-province search produced ${provinceItems.length}/${provinces.length} province items`);
}
if (internalItems.length !== expectedInternal) {
  throw new Error(`All-province search expected ${expectedInternal} internal-only province pages, got ${internalItems.length}`);
}

fs.writeFileSync(indexPath, `${JSON.stringify(searchIndex, null, 2)}\n`);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/search-index.json",
  provinces: provinceItems.length,
  public_provinces: provinceItems.length - internalItems.length,
  internal_provinces: internalItems.length,
  added,
  refreshed,
}, null, 2));
