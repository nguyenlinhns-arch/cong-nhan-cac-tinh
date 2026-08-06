import fs from "node:fs";
import path from "node:path";

await import("./optimize-article-keywords.mjs");

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const CHECK_ONLY = process.argv.includes("--check");
const MAX_TITLE_LENGTH = 65;
const MIN_DESCRIPTION_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 180;

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function decodeHtml(value = "") {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function compactText(value, limit) {
  const original = decodeHtml(value).replace(/\s+/gu, " ").trim();
  if (original.length <= limit) return original;
  const available = limit - 1;
  const excerpt = original.slice(0, available + 1);
  const boundary = excerpt.lastIndexOf(" ");
  const candidate = (boundary >= Math.floor(available * 0.68) ? excerpt.slice(0, boundary) : original.slice(0, available))
    .replace(/[,:;–—-]+$/u, "")
    .trim();
  return `${candidate}…`;
}

function compactSearchTitle(value) {
  const original = decodeHtml(value).replace(/\s+/gu, " ").trim();
  if (original.length <= MAX_TITLE_LENGTH) return original;
  const withoutBrand = original.replace(/\s*(?:\||–|—|-)\s*Thầy Linh(?:\s*(?:–|—|-)\s*Tuyển Thợ Mỏ)?\s*$/u, "").trim();
  return withoutBrand.length <= MAX_TITLE_LENGTH ? withoutBrand : compactText(withoutBrand, MAX_TITLE_LENGTH);
}

function compactMetaDescription(tag) {
  const match = tag.match(/\bcontent=(["'])(.*?)\1/i);
  if (!match) return tag;
  const original = decodeHtml(match[2]).replace(/\s+/gu, " ").trim();
  const compact = compactText(original, MAX_DESCRIPTION_LENGTH);
  if (compact === original) return tag;
  return tag.replace(match[0], `content=${match[1]}${escapeHtml(compact)}${match[1]}`);
}

function metaContent(html, name) {
  const tag = html.match(new RegExp(`<meta\\b[^>]*\\bname=["']${name}["'][^>]*>`, "i"))?.[0] || "";
  return decodeHtml(tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2] || "").replace(/\s+/gu, " ").trim();
}

function strengthenProvinceLinks(html) {
  return html
    .replaceAll("https://thaylinhtuyenthomo.vn/#theo-tinh", "https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/")
    .replace(/href="\.\.\/\.\.\/#theo-tinh"([^>]*)>Xem câu chuyện người thật/gu, 'href="/cau-chuyen-cong-nhan/"$1>Xem câu chuyện người thật')
    .replaceAll('href="../../#theo-tinh"', 'href="/viec-lam-nganh-than/"');
}

function addVisiblePublicationTime(html, relativePath) {
  if (!relativePath.startsWith("tin-nganh-than/2026/")) return html;
  const published = html.match(/<meta\s+property=["']article:published_time["']\s+content=["']([^"']+)["']/i)?.[1];
  if (!published) return html;
  const date = published.slice(0, 10);
  return html.replace(
    /(<p\s+class=["'][^"']*\beyebrow\b[^"']*["'][^>]*>[^<]*?)(\d{2}\/\d{2}\/\d{4})([^<]*<\/p>)/iu,
    `$1<time datetime="${date}">$2</time>$3`,
  );
}

function isIndexable(html) {
  return !/\bnoindex\b/i.test(metaContent(html, "robots"));
}

const changed = [];
const htmlFiles = walk(SITE).filter((file) => file.endsWith(".html") && !/^google[a-z0-9_-]+\.html$/i.test(path.basename(file)));
for (const file of htmlFiles) {
  const relativePath = path.relative(SITE, file).split(path.sep).join("/");
  const current = fs.readFileSync(file, "utf8");
  let next = current;

  if (relativePath.startsWith("viec-lam-nganh-than/")) next = strengthenProvinceLinks(next);
  next = addVisiblePublicationTime(next, relativePath);
  next = next.replace(/<title>([\s\S]*?)<\/title>/i, (full, title) => {
    const compact = compactSearchTitle(title);
    return compact === decodeHtml(title).replace(/\s+/gu, " ").trim() ? full : `<title>${escapeHtml(compact)}</title>`;
  });
  next = next.replace(/<meta\b[^>]*\bname=["']description["'][^>]*>/i, compactMetaDescription);

  if (next === current) continue;
  changed.push(relativePath);
  if (!CHECK_ONLY) fs.writeFileSync(file, next);
}

const errors = [];
const titleOwners = new Map();
const canonicalOwners = new Map();
let indexablePages = 0;
let newsPages = 0;
let provincePages = 0;

for (const file of htmlFiles) {
  const relativePath = path.relative(SITE, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  if (!isIndexable(html)) continue;
  indexablePages += 1;

  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/gu, " ").trim();
  const description = metaContent(html, "description");
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || "";
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  if (!title) errors.push(`${relativePath}: thiếu title`);
  else if (title.length > MAX_TITLE_LENGTH) errors.push(`${relativePath}: title dài ${title.length} ký tự`);
  if (!description) errors.push(`${relativePath}: thiếu meta description`);
  else if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`${relativePath}: meta description dài ${description.length} ký tự; cần ${MIN_DESCRIPTION_LENGTH}–${MAX_DESCRIPTION_LENGTH}`);
  }
  if (!canonical.startsWith("https://thaylinhtuyenthomo.vn/")) errors.push(`${relativePath}: canonical không hợp lệ`);
  if (h1Count !== 1) errors.push(`${relativePath}: cần đúng một H1, hiện có ${h1Count}`);

  if (title) {
    const owners = titleOwners.get(title) || [];
    owners.push(relativePath);
    titleOwners.set(title, owners);
  }
  if (canonical) {
    const owners = canonicalOwners.get(canonical) || [];
    owners.push(relativePath);
    canonicalOwners.set(canonical, owners);
  }

  if (relativePath.startsWith("tin-nganh-than/2026/")) {
    newsPages += 1;
    const published = html.match(/<meta\s+property=["']article:published_time["']\s+content=["']([^"']+)["']/i)?.[1];
    if (published && !html.includes(`<time datetime="${published.slice(0, 10)}">`)) {
      errors.push(`${relativePath}: ngày xuất bản chưa được đánh dấu bằng thẻ time`);
    }
  }

  if (/^viec-lam-nganh-than\/[^/]+\/index\.html$/u.test(relativePath)) {
    provincePages += 1;
    if (html.includes("#theo-tinh")) errors.push(`${relativePath}: còn liên kết neo trang chủ thay vì thư mục tỉnh`);
    const hasEvidence = html.includes("/cau-chuyen-cong-nhan/")
      || /\/tin-nganh-than\/2026\//u.test(html)
      || /\/bai-viet\//u.test(html);
    if (!hasEvidence) errors.push(`${relativePath}: thiếu liên kết tới câu chuyện hoặc nguồn địa phương`);
  }
}

for (const [title, owners] of titleOwners) {
  if (owners.length > 1) errors.push(`Trùng title “${title}”: ${owners.join(", ")}`);
}
for (const [canonical, owners] of canonicalOwners) {
  if (owners.length > 1) errors.push(`Trùng canonical ${canonical}: ${owners.join(", ")}`);
}

if (CHECK_ONLY && changed.length) {
  errors.push(`Còn ${changed.length} trang chưa được chuẩn hóa SEO: ${changed.join(", ")}`);
}
if (errors.length) throw new Error(errors.join("\n"));

console.log(JSON.stringify({
  mode: CHECK_ONLY ? "check" : "update",
  changed: changed.length,
  indexablePages,
  newsPages,
  provincePages,
  maxTitleLength: MAX_TITLE_LENGTH,
  maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
  errors: 0,
}, null, 2));
