import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = path.join(ROOT, 'tuyen-tho-mo');
const PROVINCE_ROOT = path.join(SITE, 'viec-lam-nganh-than');
const SITEMAP_PATH = path.join(SITE, 'province-sitemap.xml');
const BASE = 'https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/';
const errors = [];

const pageState = new Map();
for (const entry of fs.readdirSync(PROVINCE_ROOT, {withFileTypes: true})) {
  if (!entry.isDirectory()) continue;
  const file = path.join(PROVINCE_ROOT, entry.name, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] || '';
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || '';
  const indexable = /(?:^|,)\s*index(?:,|$)/i.test(robots) && !/noindex/i.test(robots);
  if (!canonical) errors.push(`${entry.name}: thiếu canonical`);
  if (/href=["'][^"']*cong-nhan-mo-ham-lo-quang-ninh\/\?province=/i.test(html)) {
    errors.push(`${entry.name}: còn link nội bộ crawlable ?province=`);
  }
  if (/data-contact=["']application["']/i.test(html) && !/data-prefill-province=/i.test(html)) {
    errors.push(`${entry.name}: CTA đăng ký thiếu data-prefill-province`);
  }
  if (/<strong>Cam kết thu nhập<\/strong>|được Thu nhập 20[–-]25|Mức thu nhập được cam kết theo chính sách đang áp dụng/iu.test(html)) {
    errors.push(`${entry.name}: còn thông điệp thu nhập cũ`);
  }
  pageState.set(canonical, {slug: entry.name, indexable, robots});
}

if (!fs.existsSync(SITEMAP_PATH)) throw new Error('Thiếu province-sitemap.xml');
const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/thaylinhtuyenthomo\.vn\/viec-lam-nganh-than\/[^<]+\/)<\/loc>/g)].map((m) => m[1]);
const sitemapSet = new Set(sitemapUrls);
if (sitemapUrls.length !== sitemapSet.size) errors.push('province-sitemap.xml có URL trùng');

for (const url of sitemapSet) {
  if (!url.startsWith(BASE)) errors.push(`Sitemap URL ngoài phạm vi tỉnh: ${url}`);
  const page = pageState.get(url);
  if (!page) errors.push(`Sitemap URL không có trang tương ứng: ${url}`);
  else if (!page.indexable) errors.push(`${page.slug}: noindex nhưng vẫn nằm trong province-sitemap.xml`);
  const block = sitemap.match(new RegExp(`<url><loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/loc>([\\s\\S]*?)<\\/url>`))?.[1] || '';
  if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(block)) errors.push(`${page?.slug || url}: sitemap thiếu lastmod hợp lệ`);
}

for (const [canonical, page] of pageState) {
  if (!canonical?.startsWith(BASE)) continue;
  if (page.indexable && !sitemapSet.has(canonical)) errors.push(`${page.slug}: indexable nhưng thiếu trong province-sitemap.xml`);
  if (!page.indexable && sitemapSet.has(canonical)) errors.push(`${page.slug}: noindex nhưng có trong province-sitemap.xml`);
}

console.log(JSON.stringify({
  status: errors.length ? 'failed' : 'ok',
  provincePages: pageState.size,
  indexablePages: [...pageState.values()].filter((page) => page.indexable).length,
  sitemapUrls: sitemapSet.size,
  errors: errors.length,
  sampleErrors: errors.slice(0, 30),
}, null, 2));
if (errors.length) process.exitCode = 1;
