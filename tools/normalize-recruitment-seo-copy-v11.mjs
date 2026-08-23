import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = path.join(ROOT, 'tuyen-tho-mo');
const REVIEW_DATE = '2026-08-23';
const PROVINCE_GENERATOR = path.join(ROOT, 'tools', 'generate-province-pages-2026.mjs');
const DAILY_DATA = path.join(ROOT, 'content', 'daily-seo-articles.json');

const exactReplacements = [
  [
    /Người phù hợp được đào tạo nghề, hỗ trợ ăn ở trong khóa học và được Thu nhập 20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động\./gu,
    'Người phù hợp được đào tạo nghề, hỗ trợ ăn ở trong khóa học và có mức thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.'
  ],
  [
    /<strong>Cam kết thu nhập<\/strong><p>20[–-]25 triệu đồng\/tháng\.<\/p>/gu,
    '<strong>Thu nhập theo định mức</strong><p>20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p>'
  ],
  [
    /Chương trình đang áp dụng (?:cam kết thu nhập|Thu nhập) 20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động\./giu,
    'Mức thu nhập đang áp dụng là 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.'
  ],
  [
    /Mức thu nhập được cam kết theo chính sách đang áp dụng\./giu,
    'Mức thu nhập áp dụng khi hoàn thành định mức lao động.'
  ],
  [
    /Cam kết thu nhập 20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động\./gu,
    'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.'
  ],
  [
    /được cam kết thu nhập 20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động/giu,
    'có mức thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động'
  ],
  [
    /mức thu nhập cam kết khi hoàn thành định mức/giu,
    'mức thu nhập khi hoàn thành định mức'
  ],
  [
    /<strong>CAM KẾT THU NHẬP<\/strong>/gu,
    '<strong>THU NHẬP THEO ĐỊNH MỨC</strong>'
  ],
  [
    /khi hoàn thành định mức lao động\.\s*khi hoàn thành định mức lao động\./giu,
    'khi hoàn thành định mức lao động.'
  ],
  [
    /khi hoàn thành định mức lao động\s+khi hoàn thành định mức lao động/giu,
    'khi hoàn thành định mức lao động'
  ],
];

function normalizeText(text) {
  let next = text;
  for (const [pattern, replacement] of exactReplacements) next = next.replace(pattern, replacement);
  return next;
}

function writeIfChanged(file, next) {
  const current = fs.readFileSync(file, 'utf8');
  if (current === next) return false;
  fs.writeFileSync(file, next);
  console.log(`normalized ${path.relative(ROOT, file)}`);
  return true;
}

function normalizeFile(file) {
  const current = fs.readFileSync(file, 'utf8');
  return writeIfChanged(file, normalizeText(current));
}

function walk(dir, visitor) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path.normalize(file) === path.normalize(path.join(SITE, 'nhap-hoc'))) continue;
      walk(file, visitor);
      continue;
    }
    visitor(file);
  }
}

function normalizeProvinceGenerator() {
  let source = fs.readFileSync(PROVINCE_GENERATOR, 'utf8');
  source = normalizeText(source);

  source = source.replace(
    /const applicationUrl = `\.\.\/\.\.\/viec-lam\/cong-nhan-mo-ham-lo-quang-ninh\/\?province=\$\{encodeURIComponent\(name\)\}&amp;utm_source=website&amp;utm_medium=organic&amp;utm_campaign=tuyen_tho_mo_2026&amp;utm_content=province_\$\{slug\}#dang-ky`;/u,
    'const applicationUrl = `../../viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky`;'
  );

  source = source.replaceAll(
    'href="${applicationUrl}" data-contact="application"',
    'href="${applicationUrl}" data-prefill-province="${name}" data-contact="application"'
  );

  source = source.replace('dateModified: "2026-08-01",', `dateModified: "${REVIEW_DATE}",\n        lastReviewed: "${REVIEW_DATE}",`);
  source = source.replace('updated_at: "2026-08-01",', `updated_at: "${REVIEW_DATE}",`);

  if (!source.includes('class="section local-overview seo-topic-cluster"')) {
    const marker = '    <section class="section section--faq local-faq" aria-labelledby="faq-title">';
    const cluster = '    <section class="section local-overview seo-topic-cluster" aria-labelledby="seo-cluster-title">\n      <div class="section-heading"><div><p class="eyebrow">ĐI TIẾP TỪ ${name.toLocaleUpperCase("vi")}</p><h2 id="seo-cluster-title">Ba trang nên xem trước khi đăng ký</h2></div><p>Đi từ thông tin địa phương đến nội dung trung tâm để hiểu rõ công việc, nơi học và đầu mối tư vấn tại Quảng Ninh.</p></div>\n      <div class="overview-grid"><article><h3>Việc làm công nhân mỏ hầm lò</h3><p>Xem ba nghề đang tuyển, điều kiện, quyền lợi và biểu mẫu đăng ký.</p><a href="../../viec-lam/cong-nhan-mo-ham-lo-quang-ninh/">Xem việc làm tại Quảng Ninh →</a></article><article><h3>Học nghề tại Quang Hanh</h3><p>Xem thời gian học, ăn ở, hỗ trợ trong khóa học và địa điểm nhập học.</p><a href="../../hoc-nghe-mo-tai-quang-ninh/">Xem lộ trình học nghề →</a></article><article><h3>Liên hệ người phụ trách</h3><p>Kiểm tra đúng đầu mối trước khi gửi hồ sơ hoặc lên đường.</p><a href="../../lien-he-di-lam-mo-than-quang-ninh/">Xem thông tin liên hệ →</a></article></div>\n    </section>\n\n';
    if (!source.includes(marker)) throw new Error('Province generator FAQ marker not found');
    source = source.replace(marker, cluster + marker);
  }

  writeIfChanged(PROVINCE_GENERATOR, source);
}

function normalizeDailyData() {
  if (!fs.existsSync(DAILY_DATA)) return;
  let raw = fs.readFileSync(DAILY_DATA, 'utf8');
  raw = normalizeText(raw);
  const data = JSON.parse(raw);
  if (String(data.updated_at || '') < REVIEW_DATE) data.updated_at = REVIEW_DATE;
  writeIfChanged(DAILY_DATA, JSON.stringify(data, null, 2) + '\n');
}

normalizeProvinceGenerator();
normalizeDailyData();

const publishExtensions = new Set(['.html', '.json', '.xml', '.txt']);
walk(SITE, (file) => {
  if (!publishExtensions.has(path.extname(file).toLowerCase())) return;
  normalizeFile(file);
});

const checks = [
  [/được Thu nhập 20[–-]25/iu, 'awkward capitalized income phrase'],
  [/<strong>Cam kết thu nhập<\/strong>/iu, 'legacy income heading'],
  [/Chương trình đang áp dụng (?:cam kết thu nhập|Thu nhập) 20[–-]25/iu, 'legacy daily SEO income phrase'],
  [/Mức thu nhập được cam kết theo chính sách đang áp dụng/iu, 'legacy job income explanation'],
  [/khi hoàn thành định mức lao động\.\s*khi hoàn thành định mức lao động/iu, 'duplicated income condition'],
];

const auditTargets = [PROVINCE_GENERATOR, DAILY_DATA];
walk(SITE, (file) => {
  if (path.extname(file).toLowerCase() === '.html') auditTargets.push(file);
});
for (const file of auditTargets) {
  const text = fs.readFileSync(file, 'utf8');
  for (const [pattern, label] of checks) {
    if (pattern.test(text)) throw new Error(`${label}: ${path.relative(ROOT, file)}`);
  }
}

console.log(JSON.stringify({status: 'ok', review_date: REVIEW_DATE, clean_internal_province_links: true}, null, 2));
