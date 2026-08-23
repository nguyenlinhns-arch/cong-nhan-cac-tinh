import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('tuyen-tho-mo');
const BASE = path.join(ROOT, 'viec-lam-nganh-than');
const SITE = 'https://thaylinhtuyenthomo.vn';
const COVERAGE = JSON.parse(fs.readFileSync(path.join(ROOT, 'local-coverage.json'), 'utf8'));
const LASTMOD = new Date().toISOString().slice(0, 10);

function setRobots(html, indexable) {
  const value = indexable
    ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    : 'noindex,follow,max-image-preview:large,max-snippet:-1';
  const tag = `<meta name="robots" content="${value}">`;
  const pattern = /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?\s*>/i;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}</head>`);
}

function currentLocalities(provinceSlug) {
  const hub = path.join(BASE, provinceSlug, 'xa-phuong', 'index.html');
  if (!fs.existsSync(hub)) throw new Error(`${provinceSlug}: thiếu hub xã/phường`);
  const html = fs.readFileSync(hub, 'utf8');
  return [...html.matchAll(/href="\.\.\/(xã|phường|đặc khu)\/([^/]+)\//giu)]
    .map(match => ({ type: match[1], slug: match[2] }));
}

let total = 0;
let indexable = 0;
let noindex = 0;
const sitemapUrls = [];
const seenCanonicals = new Set();

for (const provinceSlug of Object.keys(COVERAGE.by_province || {})) {
  const localities = currentLocalities(provinceSlug);
  for (const locality of localities) {
    const file = path.join(BASE, provinceSlug, locality.type, locality.slug, 'index.html');
    if (!fs.existsSync(file)) throw new Error(`${provinceSlug}/${locality.type}/${locality.slug}: thiếu trang`);
    let html = fs.readFileSync(file, 'utf8');
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    if (!canonical) throw new Error(`${provinceSlug}/${locality.type}/${locality.slug}: thiếu canonical`);
    if (seenCanonicals.has(canonical)) throw new Error(`${provinceSlug}/${locality.type}/${locality.slug}: canonical trùng`);
    seenCanonicals.add(canonical);

    const evidenceCount = Number(html.match(/data-evidence-count="(\d+)"/i)?.[1] || 0);
    const hasEvidence = html.includes('data-history-local="1"') && evidenceCount >= 5;
    html = setRobots(html, hasEvidence);
    fs.writeFileSync(file, html);

    total += 1;
    if (hasEvidence) {
      indexable += 1;
      sitemapUrls.push(canonical);
    } else {
      noindex += 1;
    }
  }
}

if (total !== Number(COVERAGE.communes || 0)) {
  throw new Error(`Đã xử lý ${total}/${COVERAGE.communes} trang địa bàn hiện hành`);
}
if (indexable < 1) throw new Error('Không có trang địa bàn nào đủ bằng chứng để index');

sitemapUrls.sort((a, b) => a.localeCompare(b, 'vi'));
const sitemap = sitemapUrls
  .map(url => `<url><loc>${url}</loc><lastmod>${LASTMOD}</lastmod></url>`)
  .join('');
fs.writeFileSync(
  path.join(ROOT, 'commune-sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap}</urlset>`
);

const report = {
  generated_at: new Date().toISOString(),
  policy: 'Chỉ index trang xã/phường có bằng chứng tuyển sinh lịch sử tổng hợp, tối thiểu 5 hồ sơ; các trang còn lại noindex,follow.',
  current_localities: total,
  indexable_localities: indexable,
  noindex_localities: noindex,
  sitemap_urls: sitemapUrls.length,
  privacy_threshold: 5,
};
fs.writeFileSync(path.join(ROOT, 'local-indexing-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: 'local-indexing-guard-applied', ...report }, null, 2));
