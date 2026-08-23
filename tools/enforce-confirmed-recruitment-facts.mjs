import fs from 'node:fs';
import path from 'node:path';

const SUPPORT = '7,5 triệu đồng/tháng trong thời gian học';
const INCOME = 'Bình quân 20–25 triệu đồng/tháng';
const INCOME_NOTE = 'Tùy đơn vị, vị trí, ngày công và năng suất';
const UPDATED_AT = '2026-08-23T10:38:00+07:00';
const SELF = path.normalize('tools/enforce-confirmed-recruitment-facts.mjs');
const CANONICAL = path.normalize('content/recruitment-facts-2026.json');
const PUBLIC = path.normalize('tuyen-tho-mo/data/recruitment-facts-2026.json');

const facts = {
  version: 7,
  confirmed_at: UPDATED_AT,
  status: 'confirmed_by_user',
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
    income_note: INCOME_NOTE,
    employment: 'Có hợp đồng lao động, bảo hiểm, thưởng, xe đưa đón và chế độ theo từng đơn vị'
  },
  contact: {
    brand: 'Thầy Linh – Tuyển Thợ Mỏ',
    phone: '096 304 8585',
    cta: 'Gửi năm sinh – chiều cao/cân nặng – tình trạng sức khỏe để Thầy Linh kiểm tra điều kiện.'
  },
  forbidden_legacy_phrases: ['6 triệu', '18–25 triệu', '7,5 triệu là tổng cả khóa']
};

const regexReplacements = [
  [/CAM KẾT THU NHẬP/gu, 'THU NHẬP BÌNH QUÂN'],
  [/THU NHẬP CAM KẾT/gu, 'THU NHẬP BÌNH QUÂN'],
  [/HOÀN THÀNH ĐỊNH MỨC LAO ĐỘNG/gu, 'THU NHẬP BÌNH QUÂN'],
  [/Thu nhập\s+20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động/giu, 'Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất'],
  [/Mức thu nhập\s+20[–-]25 triệu đồng\/tháng áp dụng khi hoàn thành định mức lao động\.?/giu, 'Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất.'],
  [/20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động/giu, '20–25 triệu đồng/tháng'],
  [/20[–-]25 triệu\/tháng khi hoàn thành định mức lao động/giu, '20–25 triệu/tháng'],
  [/Điều kiện áp dụng:\s*hoàn thành định mức lao động\.?/giu, INCOME_NOTE + '.'],
  [/7,5 triệu là tổng (?:mức hỗ trợ )?cả khóa/giu, SUPPORT],
  [/7,5 triệu đồng\/tháng(?:\/tháng|\s+đồng)+/giu, '7,5 triệu đồng/tháng'],
  [/Hỗ trợ 7,5 triệu đồng(?!\/tháng)/gu, 'Hỗ trợ 7,5 triệu đồng/tháng'],
  [/hỗ trợ 7,5 triệu đồng(?!\/tháng)/gu, 'hỗ trợ 7,5 triệu đồng/tháng']
];

const exactReplacements = [
  ['<div class="home-v6-income"><small>THU NHẬP SAU ĐÀO TẠO</small><strong>20–25 triệu/tháng</strong></div>', '<div class="home-v6-income"><small>THU NHẬP BÌNH QUÂN</small><strong>20–25 triệu/tháng</strong></div>'],
  ['<div class="home-v6-income"><small>HOÀN THÀNH ĐỊNH MỨC LAO ĐỘNG</small><strong>20–25 triệu/tháng</strong></div>', '<div class="home-v6-income"><small>THU NHẬP BÌNH QUÂN</small><strong>20–25 triệu/tháng</strong></div>'],
  ['<div><dt>Hỗ trợ trong thời gian học</dt><dd>7,5 triệu đồng</dd></div>', '<div><dt>Hỗ trợ trong thời gian học</dt><dd>7,5 triệu đồng/tháng</dd></div>'],
  ['<strong>7,5 triệu</strong>Hỗ trợ trong thời gian học', '<strong>7,5 triệu/tháng</strong>Hỗ trợ trong thời gian học'],
  ['Mức thu nhập được cam kết theo chính sách đang áp dụng.', 'Thu nhập bình quân; tùy đơn vị, vị trí, ngày công và năng suất.'],
  ['Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.', 'Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất.'],
  ['<article><small>01</small><strong>Miễn học phí</strong><p>Được miễn toàn bộ kinh phí đào tạo theo chương trình.</p></article>', '<article><small>01</small><strong>Miễn học phí</strong><p>Miễn học phí theo chỉ tiêu.</p></article>'],
  ['<article><small>02</small><strong>Ăn, ở miễn phí</strong><p>Ba bữa/ngày, 7 ngày/tuần, mức ăn 90.000 đồng/ngày; ký túc xá khép kín.</p></article>', '<article><small>02</small><strong>Ăn 3 bữa · ở KTX</strong><p>Được bố trí ăn 3 bữa/ngày và ở ký túc xá trong thời gian học.</p></article>'],
  ['<article class="benefit-grid__accent"><small>04</small><strong>85–100% lương khi thực tập</strong><p>So với công nhân trong cùng dây chuyền sản xuất, kèm chế độ theo quy định.</p></article>', '<article class="benefit-grid__accent"><small>04</small><strong>Thực tập sản xuất</strong><p>Được bố trí thực tập theo chương trình; chế độ thực tế theo đơn vị và đợt tiếp nhận.</p></article>'],
  ['<article><small>07</small><strong>8 giờ/ngày, 5 ngày/tuần</strong><p>Lịch làm việc theo phương án sản xuất của doanh nghiệp tiếp nhận.</p></article>', '<article><small>07</small><strong>Hợp đồng & phúc lợi</strong><p>Có hợp đồng lao động, thưởng, xe đưa đón và chế độ theo từng đơn vị.</p></article>']
];

function normalizeText(text) {
  let next = text;
  for (const [from, to] of exactReplacements) next = next.split(from).join(to);
  for (const [re, to] of regexReplacements) next = next.replace(re, to);
  return next;
}

const roots = ['content', 'tools', 'operations', 'tuyen-tho-mo'];
const allowed = new Set(['.html', '.js', '.mjs', '.json', '.md', '.txt', '.xml']);
let changedFiles = 0;
function normalizeFile(file) {
  const normalized = path.normalize(file);
  if ([SELF, CANONICAL, PUBLIC].includes(normalized)) return;
  let text; try { text = fs.readFileSync(file, 'utf8'); } catch { return; }
  const next = normalizeText(text);
  if (next !== text) { fs.writeFileSync(file, next); changedFiles += 1; }
}
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (allowed.has(path.extname(entry.name).toLowerCase())) normalizeFile(p);
  }
}
roots.forEach(walk);

const currentPath = 'tuyen-tho-mo/recruitment-current.json';
if (fs.existsSync(currentPath)) {
  const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
  current.updated_at = '2026-08-23';
  current.benefits_during_training ||= {};
  current.benefits_during_training.living_support = SUPPORT;
  current.after_training ||= {};
  current.after_training.income_reference = `${INCOME}, tùy đơn vị, vị trí, ngày công và năng suất`;
  current.after_training.income_commitment = current.after_training.income_reference;
  current.usage_note = 'Dùng bộ dữ liệu này để đối chiếu thông tin tuyển đang áp dụng. Hai mốc người dùng đã xác nhận: hỗ trợ 7,5 triệu đồng/tháng trong thời gian học; thu nhập 20–25 triệu đồng/tháng.';
  fs.writeFileSync(currentPath, JSON.stringify(current, null, 2) + '\n');
}

const masterPath = 'operations/job-posting-master-2026.json';
if (fs.existsSync(masterPath)) {
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  master.version = Math.max(Number(master.version || 0), 11);
  master.updated_at = UPDATED_AT;
  master.income_commitment = `${INCOME}, tùy đơn vị, vị trí, ngày công và năng suất`;
  master.income_reference = master.income_commitment;
  master.canonical_facts = 'content/recruitment-facts-2026.json';
  if (Array.isArray(master.benefits)) master.benefits = master.benefits.map(item => /7,5\s*triệu/i.test(item) ? `Hỗ trợ ${SUPPORT}` : item);
  fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n');
}

fs.mkdirSync(path.dirname(CANONICAL), {recursive:true});
fs.mkdirSync(path.dirname(PUBLIC), {recursive:true});
fs.writeFileSync(CANONICAL, JSON.stringify(facts, null, 2) + '\n');
fs.writeFileSync(PUBLIC, JSON.stringify(facts, null, 2) + '\n');

const criticalFiles = [
  'tuyen-tho-mo/index.html',
  'tuyen-tho-mo/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/index.html',
  'tuyen-tho-mo/tuyen-tho-mo-quang-ninh/index.html'
].filter(fs.existsSync);
const critical = criticalFiles.map(x => fs.readFileSync(x, 'utf8')).join('\n');
if (/7,5 triệu là tổng cả khóa|18[–-]25 triệu|6 triệu/iu.test(critical)) throw new Error('Legacy recruitment fact remains on a critical public page');

console.log(JSON.stringify({status:'ok', changedFiles, income:INCOME, income_note:INCOME_NOTE, support:SUPPORT}, null, 2));
