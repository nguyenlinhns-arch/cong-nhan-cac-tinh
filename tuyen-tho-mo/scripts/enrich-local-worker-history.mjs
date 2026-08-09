import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('tuyen-tho-mo');
const BASE = path.join(ROOT, 'viec-lam-nganh-than');
const DATA_DIR = path.join(ROOT, 'data');
const SHARDS = [1,2,3,4,5].map(n => path.join(DATA_DIR, `historical-workers-by-commune-${n}.json`));

const COMPANY = {
  'DH': { name: 'Than Dương Huy', url: '/bang-luong/duong-huy/quy-3-2025/' },
  'Hà Lầm': { name: 'Than Hà Lầm', url: '/bang-luong/ha-lam/quy-2-2026/' },
  'Hạ Long': { name: 'Than Hạ Long', url: '/bang-luong/ha-long/9-thang-2025/' },
  'TN': { name: 'Than Thống Nhất', url: '/bang-luong/thong-nhat/quy-3-2025/' },
  'VD': { name: 'Than Vàng Danh', url: '/bang-luong/vang-danh/quy-2-2026/' },
  'XLM': { name: 'Xây lắp mỏ', url: '/bang-luong/xay-lap-mo/9-thang-2025/' },
};

const esc = (s='') => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const text = (s='') => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const normalize = (s='') => String(s)
  .normalize('NFKC')
  .trim()
  .toLocaleLowerCase('vi-VN')
  .replace(/^(xã|phường|thị trấn|đặc khu)\s+/iu, '')
  .replace(/\s+/g, ' ');

const history = Object.assign({}, ...SHARDS.map(file => JSON.parse(fs.readFileSync(file, 'utf8'))));

function parseCompanyCounts(serialized='') {
  return String(serialized).split(',').map(part => part.trim()).filter(Boolean).map(part => {
    const cut = part.lastIndexOf(':');
    if (cut < 1) return null;
    const code = part.slice(0, cut);
    const count = Number(part.slice(cut + 1));
    if (!COMPANY[code] || !Number.isFinite(count) || count < 1) return null;
    return { code, count, ...COMPANY[code] };
  }).filter(Boolean).sort((a,b) => b.count - a.count || a.name.localeCompare(b.name, 'vi'));
}

function workerHistoryBlock({ locality, province, total, serialized }) {
  const companies = parseCompanyCounts(serialized);
  const links = companies.map(item => `<a href="${esc(item.url)}"><strong>${esc(item.name)}</strong><span>${item.count} hồ sơ</span></a>`).join('');
  return `<section class="local-worker-history" data-history-local="1" aria-labelledby="worker-history-title"><h2 id="worker-history-title">Dữ liệu tuyển sinh từ ${esc(locality)}</h2><p>Trong dữ liệu nhập học giai đoạn <strong>2015–2026</strong>, hệ thống ghi nhận <strong>${total} hồ sơ</strong> tại ${esc(locality)}, ${esc(province)} có mã doanh nghiệp thuộc nhóm đơn vị đang có bảng lương thực tế trên website. Số liệu này được dùng theo dạng tổng hợp để người lao động thấy dấu vết tuyển sinh từ chính địa phương mình.</p><div class="local-worker-history__companies">${links}</div><p><a href="/bang-luong/">Xem kho bảng lương các công ty ngành Than →</a></p><p class="local-worker-history__note"><small>Nguồn đối chiếu: “Dữ liệu HS các năm” 2015–2026. Đây là dữ liệu nhập học/tuyển sinh lịch sử theo mã doanh nghiệp, không phải xác nhận rằng từng người hiện vẫn đang làm việc tại doanh nghiệp. Website chỉ công bố số liệu tổng hợp, không đưa họ tên, ngày sinh hay thông tin cá nhân vào trang xã.</small></p></section>`;
}

function removeOldBlock(html) {
  return html.replace(/<section class="local-worker-history"[\s\S]*?<\/section>/giu, '');
}

let scanned = 0;
let matched = 0;
let written = 0;
for (const provinceDir of fs.readdirSync(BASE, {withFileTypes:true}).filter(x => x.isDirectory())) {
  const provincePath = path.join(BASE, provinceDir.name);
  for (const type of ['xã','phường','đặc khu']) {
    const typePath = path.join(provincePath, type);
    if (!fs.existsSync(typePath)) continue;
    for (const localityDir of fs.readdirSync(typePath, {withFileTypes:true}).filter(x => x.isDirectory())) {
      const file = path.join(typePath, localityDir.name, 'index.html');
      if (!fs.existsSync(file)) continue;
      scanned++;
      let html = fs.readFileSync(file, 'utf8');
      html = removeOldBlock(html);
      const province = text(html.match(/<nav class="breadcrumb">[\s\S]*?<a href="\/viec-lam-nganh-than\/[^/]+\/">([^<]+)<\/a>/i)?.[1] || provinceDir.name);
      const rawLocality = text(html.match(/<span>(?:xã|phường|đặc khu)\s+([^<]+)<\/span>/iu)?.[1] || html.match(/<h1[^>]*>[^<]*?tại\s+([^,<]+)[,<]/iu)?.[1] || localityDir.name);
      const locality = rawLocality.replace(/^(xã|phường|đặc khu)\s+/iu,'').trim();
      const key = `${normalize(province)}|${normalize(locality)}`;
      const row = history[key];
      if (!row) {
        fs.writeFileSync(file, html);
        continue;
      }
      matched++;
      const [total, serialized] = row;
      const block = workerHistoryBlock({ locality, province, total, serialized });
      if (html.includes('<p class="local-source">')) {
        html = html.replace('<p class="local-source">', `${block}<p class="local-source">`);
      } else if (html.includes('</main>')) {
        html = html.replace('</main>', `${block}</main>`);
      } else {
        continue;
      }
      fs.writeFileSync(file, html);
      written++;
    }
  }
}

if (matched === 0 || written === 0) throw new Error('Không ghép được dữ liệu lịch sử vào trang xã/phường nào.');
console.log(JSON.stringify({status:'worker-history-enriched',scanned,matched,written,source_localities:Object.keys(history).length,privacy:'aggregate_only'},null,2));
