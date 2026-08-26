(() => {
  const root = document.getElementById('reportContent');
  if (!root) return;

  let report = null;
  const num = v => Number(v || 0);
  const fmt = v => num(v).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
  const pct = (actual, plan) => plan > 0 ? (num(actual) / plan * 100).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00';
  const pad2 = v => String(Math.max(0, num(v))).padStart(2, '0');

  function normalizeTodayLabel() {
    if (!report) return;
    root.querySelectorAll('.report-status span').forEach(span => {
      if (/^Nhập học ngày/i.test(span.textContent || '')) {
        span.innerHTML = `Nhập học ngày hôm nay: <b>${fmt(report.summary?.today_count)}</b>`;
      }
    });
  }

  function buildBlock(data) {
    const s = data?.summary || {};
    const ph = s.today_ph || {};
    const extras = Array.isArray(data?.dv_extra) ? data.dv_extra : [];
    const companyNow = extras.reduce((a, r) => a + num(r.current_company), 0);
    const totalWithRetakes = num(s.including_retakes);
    const schoolWithRetakes = Math.max(0, totalWithRetakes - companyNow);
    const campus = [
      ['PHHN', 'PHHN'],
      ['PHCP', 'PHCP'],
      ['PHHC', 'TTHC'],
      ['PHVB', 'PHVB'],
      ['PHHB', 'PHHB'],
      ['PHMC', 'PHMC']
    ];

    const el = document.createElement('section');
    el.className = 'today-summary-block';
    el.dataset.snapshot = String(data?.snapshot_date || '');
    el.innerHTML = `
      <div class="today-summary-title">Nhập học ngày hôm nay: <b>${fmt(s.today_count)}</b> học sinh (Bỏ <b>${pad2(s.today_dropout)}</b> HS)</div>
      <div class="today-summary-scroll">
        <table class="today-campus-table">
          <thead><tr><th>Trong đó nhập tại</th>${campus.map(([,label]) => `<th>${label}</th>`).join('')}<th>Tổng nhập hôm nay</th></tr></thead>
          <tbody><tr><td></td>${campus.map(([code]) => `<td>${num(ph[code]) || ''}</td>`).join('')}<td>${fmt(s.today_count)}</td></tr></tbody>
        </table>
        <div class="today-progress-heading">Lũy kế kết quả thực hiện đến thời điểm báo cáo</div>
        <div class="today-progress-layout">
          <table class="today-progress-table">
            <thead><tr><th>Nội dung</th><th>Kế hoạch 2026</th><th>Kết quả thực hiện</th><th>Tỷ lệ hoàn thành (%)</th></tr></thead>
            <tbody>
              <tr><td>Kế hoạch năm 2026</td><td>4.250</td><td>${fmt(totalWithRetakes)}</td><td>${pct(totalWithRetakes,4250)}</td></tr>
              <tr><td>Trường 80%</td><td>3.400</td><td>${fmt(schoolWithRetakes)}</td><td>${pct(schoolWithRetakes,3400)}</td></tr>
              <tr><td>Doanh nghiệp 20%</td><td>850</td><td>${fmt(companyNow)}</td><td>${pct(companyNow,850)}</td></tr>
            </tbody>
          </table>
          <div class="today-progress-notes"><div>Đã bao gồm HS Tái tuyển</div><div>Đã bao gồm HS Tái tuyển</div><div></div></div>
        </div>
      </div>`;
    return el;
  }

  function inject() {
    if (!report) return;
    normalizeTodayLabel();
    if (!root.classList.contains('report-dv')) return;
    const card = root.querySelector('.dashboard-card');
    if (!card) return;
    const current = card.querySelector('.today-summary-block');
    if (current && current.dataset.snapshot === String(report.snapshot_date || '')) return;
    if (current) current.remove();
    const block = buildBlock(report);
    const source = card.querySelector('.source-note');
    if (source) card.insertBefore(block, source); else card.appendChild(block);
  }

  fetch(`./live-report.json?v=${Date.now()}`, { cache: 'no-store' })
    .then(r => { if (!r.ok) throw new Error(`live-report ${r.status}`); return r.json(); })
    .then(data => { report = data; inject(); })
    .catch(err => console.error('Không tải được báo cáo ngày hôm nay', err));

  new MutationObserver(() => inject()).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => setTimeout(inject, 40)));
})();
