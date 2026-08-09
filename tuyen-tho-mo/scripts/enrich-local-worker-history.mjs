import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('tuyen-tho-mo');
const BASE = path.join(ROOT, 'viec-lam-nganh-than');
const DATA_DIR = path.join(ROOT, 'data');
const SHARDS = [1,2,3,4,5].map(n => path.join(DATA_DIR, `historical-workers-by-commune-${n}.json`));
const SOURCE_NAME = 'Dữ liệu HS các năm';
const SOURCE_PERIOD = '2015–2026';

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
const normalize = (s='') => String(s).normalize('NFKC').trim().toLocaleLowerCase('vi-VN').replace(/^(xã|phường|thị trấn|đặc khu)\s+/iu, '').replace(/\s+/g, ' ');
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

function historyDatasetSchema({url, locality, province, total, companies}) {
  return {
    '@context':'https://schema.org',
    '@type':'Dataset',
    '@id':`${url}#historical-admission-evidence`,
    name:`Dữ liệu tuyển sinh nghề mỏ tại ${locality}, ${province} giai đoạn ${SOURCE_PERIOD}`,
    description:`Số liệu tổng hợp ${total} hồ sơ tuyển sinh lịch sử tại ${locality}, ${province}; không công bố thông tin cá nhân và không dùng để xác nhận tình trạng việc làm hiện tại.`,
    temporalCoverage:'2015/2026',
    spatialCoverage:{'@type':'Place',name:`${locality}, ${province}`},
    creator:{'@type':'Organization','@id':'https://thaylinhtuyenthomo.vn/#organization',name:'Thầy Linh – Tuyển Thợ Mỏ'},
    variableMeasured:[
      {'@type':'PropertyValue',name:'Số hồ sơ tuyển sinh lịch sử',value:total,unitText:'hồ sơ'},
      ...companies.map(x => ({'@type':'PropertyValue',name:`Hồ sơ có mã doanh nghiệp ${x.name}`,value:x.count,unitText:'hồ sơ'}))
    ]
  };
}

function workerHistoryBlock({ locality, province, total, companies }) {
  const companyCards = companies.length ? companies.map(item => `<article><h3>${esc(item.name)}</h3><p><strong>${item.count} hồ sơ</strong> trong dữ liệu tuyển sinh lịch sử có mã doanh nghiệp tương ứng.</p><p><a href="${esc(item.url)}">Đối chiếu kho bảng lương ${esc(item.name)} →</a></p></article>`).join('') : '<article><h3>Dữ liệu lịch sử địa phương</h3><p>Đã có hồ sơ tuyển sinh tại địa phương nhưng chưa có mã doanh nghiệp thuộc nhóm bảng lương đang công khai trên website.</p></article>';
  return `<section class="section local-worker-history" data-history-local="1" data-evidence-count="${total}" aria-labelledby="worker-history-title"><p class="eyebrow">DỮ LIỆU THỰC TẾ THEO ĐỊA PHƯƠNG</p><h2 id="worker-history-title">Dấu vết tuyển sinh nghề mỏ từ ${esc(locality)}</h2><p>Trong bộ dữ liệu nhập học giai đoạn <strong>${SOURCE_PERIOD}</strong>, hệ thống ghi nhận <strong>${total} hồ sơ</strong> tại ${esc(locality)}, ${esc(province)} thuộc nhóm dữ liệu đang được đối chiếu. Đây là bằng chứng lịch sử cho thấy hoạt động tuyển sinh nghề mỏ đã phát sinh tại địa phương, giúp trang này có dữ liệu riêng thay vì chỉ thay tên xã/phường.</p><div class="overview-grid">${companyCards}</div><p><a href="/bang-luong/">Xem toàn bộ kho bảng lương công nhân ngành Than →</a></p><p class="local-worker-history__note"><small>Nguồn đối chiếu nội bộ: “${SOURCE_NAME}” ${SOURCE_PERIOD}. Các con số trên là <strong>số liệu tổng hợp hồ sơ tuyển sinh</strong>. Mã doanh nghiệp trong hồ sơ chỉ phản ánh dữ liệu tuyển sinh tại thời điểm ghi nhận, <strong>không phải xác nhận người đó hiện vẫn làm việc tại doanh nghiệp</strong>. Website không đưa họ tên, ngày sinh, địa chỉ chi tiết hoặc mức lương cá nhân vào trang địa phương. Bảng lương được liên kết riêng để người đọc đối chiếu tài liệu thu nhập thực tế của doanh nghiệp.</small></p></section>`;
}

function removeOldBlock(html) {
  return html.replace(/<section class="(?:section )?local-worker-history"[\s\S]*?<\/section>/giu, '').replace(/<script type="application\/ld\+json" data-local-history-schema>[\s\S]*?<\/script>/giu, '');
}

let scanned = 0, matched = 0, written = 0, totalEvidence = 0, withCompanyLinks = 0;
for (const provinceDir of fs.readdirSync(BASE, {withFileTypes:true}).filter(x => x.isDirectory())) {
  const provincePath = path.join(BASE, provinceDir.name);
  for (const type of ['xã','phường','đặc khu']) {
    const typePath = path.join(provincePath, type);
    if (!fs.existsSync(typePath)) continue;
    for (const localityDir of fs.readdirSync(typePath, {withFileTypes:true}).filter(x => x.isDirectory())) {
      const file = path.join(typePath, localityDir.name, 'index.html');
      if (!fs.existsSync(file)) continue;
      scanned++;
      let html = removeOldBlock(fs.readFileSync(file, 'utf8'));
      const province = text(html.match(/<nav class="breadcrumb">[\s\S]*?<a href="\/viec-lam-nganh-than\/[^/]+\/">([^<]+)<\/a>/i)?.[1] || provinceDir.name);
      const rawLocality = text(html.match(/<span>(?:xã|phường|đặc khu)\s+([^<]+)<\/span>/iu)?.[1] || html.match(/<h1[^>]*>[^<]*?tại\s+([^,<]+)[,<]/iu)?.[1] || localityDir.name);
      const locality = rawLocality.replace(/^(xã|phường|đặc khu)\s+/iu,'').trim();
      const key = `${normalize(province)}|${normalize(locality)}`;
      const row = history[key];
      if (!row) { fs.writeFileSync(file, html); continue; }
      matched++;
      const [total, serialized] = row;
      if (!Number.isFinite(Number(total)) || Number(total) < 5) throw new Error(`${key}: bằng chứng dưới ngưỡng riêng tư`);
      const companies = parseCompanyCounts(serialized);
      totalEvidence += Number(total);
      if (companies.length) withCompanyLinks++;
      const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
      if (!canonical) throw new Error(`${key}: thiếu canonical`);
      const block = workerHistoryBlock({ locality, province, total:Number(total), companies });
      const schema = `<script type="application/ld+json" data-local-history-schema>${JSON.stringify(historyDatasetSchema({url:canonical,locality,province,total:Number(total),companies}))}</script>`;
      html = html.replace('</head>', `${schema}</head>`);
      if (html.includes('<p class="local-source">')) html = html.replace('<p class="local-source">', `${block}<p class="local-source">`);
      else if (html.includes('</main>')) html = html.replace('</main>', `${block}</main>`);
      else continue;
      fs.writeFileSync(file, html);
      written++;
    }
  }
}
if (matched === 0 || written === 0) throw new Error('Không ghép được dữ liệu lịch sử vào trang xã/phường nào.');
fs.writeFileSync(path.join(ROOT,'local-evidence-report.json'), JSON.stringify({generated_at:new Date().toISOString(),scanned,matched,written,total_evidence_records:totalEvidence,pages_with_company_payroll_links:withCompanyLinks,privacy_threshold:5,source:SOURCE_NAME,period:SOURCE_PERIOD},null,2));
console.log(JSON.stringify({status:'worker-history-enriched',scanned,matched,written,totalEvidence,withCompanyLinks,source_localities:Object.keys(history).length,privacy:'aggregate_only_min_5'},null,2));