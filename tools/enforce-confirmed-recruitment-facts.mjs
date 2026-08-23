import fs from 'node:fs';
import path from 'node:path';

const INCOME = '20–25 triệu đồng/tháng khi hoàn thành định mức lao động';
const SUPPORT = '7,5 triệu đồng/tháng trong thời gian học';
const UPDATED_AT = '2026-08-23T11:08:00+07:00';
const SELF = path.normalize('tools/enforce-confirmed-recruitment-facts.mjs');
const canonicalFactsPath = path.normalize('content/recruitment-facts-2026.json');
const publicFactsPath = path.normalize(path.join('tuyen-tho-mo', 'data', 'recruitment-facts-2026.json'));

const facts = {
  version: 6,
  confirmed_at: UPDATED_AT,
  status: 'confirmed',
  candidate: {
    gender: 'Nam',
    age_min: 18,
    age_max: 40,
    height_min_cm: 153,
    weight_min_kg: 47,
    health: 'Sức khỏe tốt; kiểm tra mắt, huyết áp, tim mạch và các bệnh ảnh hưởng công việc hầm lò'
  },
  training: {
    khai_thac_mo: '2–3 tháng',
    xay_dung_mo: '2–3 tháng',
    co_dien_mo: '10 tháng'
  },
  study_benefits: {
    tuition: 'Miễn học phí theo chỉ tiêu',
    meals: 'Ăn 3 bữa/ngày',
    accommodation: 'Ở ký túc xá',
    living_support: SUPPORT
  },
  after_training: {
    work_location: 'Các đơn vị ngành Than thuộc TKV tại Quảng Ninh',
    income: INCOME,
    income_note: 'Điều kiện áp dụng: hoàn thành định mức lao động.',
    employment: 'Có hợp đồng lao động, bảo hiểm, thưởng, xe đưa đón và chế độ theo từng đơn vị'
  },
  contact: {
    brand: 'Thầy Linh – Tuyển Thợ Mỏ',
    phone: '096 304 8585',
    cta: 'Gửi năm sinh – chiều cao/cân nặng – tình trạng sức khỏe để Thầy Linh kiểm tra điều kiện.'
  },
  forbidden_legacy_phrases: [
    '6 triệu',
    '18–25 triệu',
    '7,5 triệu là tổng cả khóa',
    'THU NHẬP SAU ĐÀO TẠO',
    'THU NHẬP SAU ĐÀO TẠO',
    'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động'
  ]
};

const exactReplacements = [
  ['<div class="home-v6-income"><small>THU NHẬP BÌNH QUÂN</small><strong>20–25 triệu/tháng</strong></div>', '<div class="home-v6-income"><small>HOÀN THÀNH ĐỊNH MỨC LAO ĐỘNG</small><strong>20–25 triệu/tháng</strong></div>'],
  ['<div class="home-v6-income"><small>THU NHẬP SAU ĐÀO TẠO</small><strong>20–25 triệu đồng/tháng khi hoàn thành định mức lao động</strong></div>', '<div class="home-v6-income"><small>HOÀN THÀNH ĐỊNH MỨC LAO ĐỘNG</small><strong>20–25 triệu/tháng</strong></div>'],
  ['7,5 triệu đồng/tháng là mức hỗ trợ sinh hoạt trong thời gian học theo thông tin chuẩn hiện hành; không phải tiền lương sau khi đi làm.', '7,5 triệu đồng/tháng là mức hỗ trợ sinh hoạt trong thời gian học theo thông tin chuẩn hiện hành; không phải tiền lương sau khi đi làm.'],
  ['7,5 triệu đồng/tháng là hỗ trợ sinh hoạt trong thời gian học theo thông tin chuẩn hiện hành, không phải tiền lương sau khi đi làm.', '7,5 triệu đồng/tháng là hỗ trợ sinh hoạt trong thời gian học theo thông tin chuẩn hiện hành, không phải tiền lương sau khi đi làm.'],
  ['<div><dt>Hỗ trợ trong thời gian học</dt><dd>7,5 triệu đồng/tháng</dd></div>', '<div><dt>Hỗ trợ trong thời gian học</dt><dd>7,5 triệu đồng/tháng</dd></div>'],
  ['<strong>7,5 triệu/tháng</strong>Hỗ trợ trong thời gian học', '<strong>7,5 triệu/tháng</strong>Hỗ trợ trong thời gian học'],
  ['Mức thu nhập 20–25 triệu đồng/tháng áp dụng khi hoàn thành định mức lao động.', 'Mức thu nhập 20–25 triệu đồng/tháng áp dụng khi hoàn thành định mức lao động.'],
  ['Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.', 'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.'],
  ['Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động', 'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động'],
  ['20–25 triệu đồng/tháng khi hoàn thành định mức lao động', INCOME],
  ['Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động', 'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động'],
  ['<article><small>01</small><strong>Miễn học phí</strong><p>Miễn học phí theo chỉ tiêu.</p></article>', '<article><small>01</small><strong>Miễn học phí</strong><p>Miễn học phí theo chỉ tiêu.</p></article>'],
  ['<article><small>02</small><strong>Ăn 3 bữa · ở KTX</strong><p>Được bố trí ăn 3 bữa/ngày và ở ký túc xá trong thời gian học.</p></article>', '<article><small>02</small><strong>Ăn 3 bữa · ở KTX</strong><p>Được bố trí ăn 3 bữa/ngày và ở ký túc xá trong thời gian học.</p></article>'],
  ['<article class="benefit-grid__accent"><small>04</small><strong>Thực tập sản xuất</strong><p>Được bố trí thực tập theo chương trình; chế độ thực tế theo đơn vị và đợt tiếp nhận.</p></article>', '<article class="benefit-grid__accent"><small>04</small><strong>Thực tập sản xuất</strong><p>Được bố trí thực tập theo chương trình; chế độ thực tế theo đơn vị và đợt tiếp nhận.</p></article>'],
  ['<article><small>07</small><strong>Hợp đồng & phúc lợi</strong><p>Có hợp đồng lao động, thưởng, xe đưa đón và chế độ theo từng đơn vị.</p></article>', '<article><small>07</small><strong>Hợp đồng & phúc lợi</strong><p>Có hợp đồng lao động, thưởng, xe đưa đón và chế độ theo từng đơn vị.</p></article>']
];

const regexReplacements = [
  [/THU NHẬP SAU ĐÀO TẠO/gu, 'THU NHẬP SAU ĐÀO TẠO'],
  [/THU NHẬP SAU ĐÀO TẠO/gu, 'THU NHẬP SAU ĐÀO TẠO'],
  [/THU NHẬP BÌNH QUÂN/gu, 'THU NHẬP SAU ĐÀO TẠO'],
  [/Cam kết thu nhập\s+20[–-]25 triệu(?: đồng)?\/tháng(?: khi hoàn thành định mức lao động)?/giu, 'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động'],
  [/Thu nhập bình quân\s+20[–-]25 triệu(?: đồng)?\/tháng(?:,?\s*tùy đơn vị, vị trí, ngày công và năng suất)?/giu, 'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động'],
  [/Bình quân\s+20[–-]25 triệu(?: đồng)?\/tháng/giu, '20–25 triệu đồng/tháng khi hoàn thành định mức lao động'],
  [/Thu nhập\s+20[–-]25 triệu(?: đồng)?\/tháng khi hoàn thành định mức lao động/giu, 'Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động'],
  [/20[–-]25 triệu\/tháng khi hoàn thành định mức lao động/giu, '20–25 triệu đồng/tháng khi hoàn thành định mức lao động'],
  [/7,5 triệu đồng\/tháng(?:\/tháng)+/giu, '7,5 triệu đồng/tháng'],
  [/7,5 triệu đồng\/tháng\s+đồng/giu, '7,5 triệu đồng/tháng'],
  [/Hỗ trợ 7,5 triệu đồng/tháng(?!\/tháng)/gu, 'Hỗ trợ 7,5 triệu đồng/tháng'],
  [/hỗ trợ 7,5 triệu đồng/tháng(?!\/tháng)/gu, 'hỗ trợ 7,5 triệu đồng/tháng'],
  [/Hỗ trợ 7,5 triệu đồng/tháng(?!\/tháng)/gu, 'Hỗ trợ 7,5 triệu đồng/tháng'],
  [/hỗ trợ 7,5 triệu đồng/tháng(?!\/tháng)/gu, 'hỗ trợ 7,5 triệu đồng/tháng'],
  [/7,5 triệu đồng/tháng hỗ trợ sinh hoạt/giu, '7,5 triệu đồng/tháng hỗ trợ sinh hoạt']
];

const roots = ['content', 'tools', 'operations', 'tuyen-tho-mo'];
const allowed = new Set(['.html', '.js', '.mjs', '.json', '.md', '.txt', '.xml']);
let changedFiles = 0;

function normalizeText(text) {
  let next = text;
  for (const [from, to] of exactReplacements) next = next.split(from).join(to);
  for (const [pattern, to] of regexReplacements) next = next.replace(pattern, to);
  return next;
}

function normalizeFile(file) {
  const normalized = path.normalize(file);
  if ([SELF, canonicalFactsPath, publicFactsPath].includes(normalized)) return;
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { return; }
  const next = normalizeText(text);
  if (next !== text) {
    fs.writeFileSync(file, next);
    changedFiles += 1;
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (allowed.has(path.extname(entry.name).toLowerCase())) normalizeFile(p);
  }
}

for (const root of roots) walk(root);

const currentPath = 'tuyen-tho-mo/recruitment-current.json';
if (fs.existsSync(currentPath)) {
  const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
  current.updated_at = UPDATED_AT;
  current.benefits_during_training = current.benefits_during_training || {};
  current.benefits_during_training.living_support = SUPPORT;
  current.after_training = current.after_training || {};
  current.after_training.income_reference = INCOME;
  current.after_training.income_commitment = INCOME;
  fs.writeFileSync(currentPath, JSON.stringify(current, null, 2) + '\n');
}

const masterPath = 'operations/job-posting-master-2026.json';
if (fs.existsSync(masterPath)) {
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  master.version = Math.max(Number(master.version || 0), 10);
  master.updated_at = UPDATED_AT;
  master.income_commitment = INCOME;
  master.income_reference = INCOME;
  if (Array.isArray(master.benefits)) {
    master.benefits = master.benefits.map(item => /Hỗ trợ\s+7,5\s+triệu/i.test(item)
      ? 'Hỗ trợ 7,5 triệu đồng/tháng trong thời gian học theo chính sách đợt tuyển'
      : item);
  }
  master.canonical_facts = 'content/recruitment-facts-2026.json';
  fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n');
}

fs.mkdirSync('content', {recursive: true});
fs.writeFileSync(canonicalFactsPath, JSON.stringify(facts, null, 2) + '\n');
fs.mkdirSync(path.join('tuyen-tho-mo', 'data'), {recursive: true});
fs.writeFileSync(publicFactsPath, JSON.stringify(facts, null, 2) + '\n');

const home = fs.readFileSync('tuyen-tho-mo/index.html','utf8');
const job = fs.readFileSync('tuyen-tho-mo/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html','utf8');
const paid = fs.readFileSync('tuyen-tho-mo/tuyen-tho-mo-quang-ninh/index.html','utf8');
const critical = [home, job, paid].join('\n');
if (/THU NHẬP SAU ĐÀO TẠO|THU NHẬP SAU ĐÀO TẠO|THU NHẬP BÌNH QUÂN|Cam kết thu nhập/iu.test(critical)) {
  throw new Error('Critical recruitment pages still contain a legacy income label.');
}
if (/Thu nhập bình quân\s+20[–-]25 triệu/iu.test(critical)) {
  throw new Error('Critical recruitment pages still contain the old average-income wording.');
}
if (/7,5 triệu đồng\/tháng(?:\/tháng|\s+đồng)/iu.test(critical)) {
  throw new Error('Malformed 7.5m/month wording detected.');
}
if (!critical.includes('20–25 triệu đồng/tháng khi hoàn thành định mức lao động')) {
  throw new Error('Confirmed income condition missing from critical pages.');
}
if (!home.includes('HOÀN THÀNH ĐỊNH MỨC LAO ĐỘNG')) {
  throw new Error('Homepage income condition is not explicit in the hero.');
}

console.log(JSON.stringify({status: 'ok', changedFiles, income: INCOME, support: SUPPORT}, null, 2));
