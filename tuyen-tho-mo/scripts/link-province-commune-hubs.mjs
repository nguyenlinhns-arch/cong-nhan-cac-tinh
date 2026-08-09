import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('tuyen-tho-mo/viec-lam-nganh-than');
const coveragePath = path.resolve('tuyen-tho-mo/local-coverage.json');
const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
const counts = coverage.by_province || {};
let changed = 0;

for (const [slug, count] of Object.entries(counts)) {
  const file = path.join(root, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`Missing province landing page: ${slug}`);
  let html = fs.readFileSync(file, 'utf8');
  const href = `/viec-lam-nganh-than/${slug}/xa-phuong/`;
  if (html.includes(`href="${href}"`)) continue;
  const block = `<section class="section local-directory" aria-label="Tuyển thợ mỏ theo xã phường"><div class="section-heading"><div><p class="eyebrow">THEO XÃ, PHƯỜNG</p><h2>Tra cứu ${count} địa bàn cấp xã</h2></div><p>Chọn đúng xã, phường hoặc đặc khu đang sinh sống để xem thông tin nguồn tuyển và giữ chính xác địa bàn khi đăng ký.</p></div><p><a class="button" href="${href}">Xem toàn bộ xã, phường →</a></p></section>`;
  if (!html.includes('</main>')) throw new Error(`Province page has no </main>: ${slug}`);
  html = html.replace('</main>', `${block}</main>`);
  fs.writeFileSync(file, html);
  changed += 1;
}

console.log(JSON.stringify({province_hubs_linked:Object.keys(counts).length, changed}, null, 2));
