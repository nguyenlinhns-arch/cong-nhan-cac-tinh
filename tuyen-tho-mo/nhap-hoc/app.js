(() => {
  const nf = new Intl.NumberFormat('vi-VN');
  const state = { data: null, details: null, extra: null, active: 'dv' };
  const MASTER_URL = 'https://docs.google.com/spreadsheets/d/1QPJ0ZUYJZNB1GpUyKa04uOMkRPzUR_vwG-fizIxn7Ac/edit';

  const esc = (v) => String(v ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  function n(v) {
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    if (v === null || v === undefined || v === '') return 0;
    const s = String(v).trim().replaceAll('.', '').replace(',', '.');
    const out = Number(s);
    return Number.isFinite(out) ? out : 0;
  }
  function fmt(v, zero = true) {
    const num = n(v);
    if (!num && !zero) return '';
    if (Math.abs(num % 1) > 1e-9) return num.toLocaleString('vi-VN', { maximumFractionDigits: 1 });
    return nf.format(num);
  }
  function pct(v) {
    const num = n(v);
    return `${num.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  }
  const nz = v => Math.abs(n(v)) > 1e-9;

  function reportTitle(title, sub = '') {
    return `<div class="report-title">${esc(title)}</div>${sub ? `<div class="report-subtitle">${esc(sub)}</div>` : ''}`;
  }

  function renderOverview() {
    const s = state.data.summary;
    const cards = [
      ['TỔNG HỒ SƠ', s.total_records, 'metric-total'],
      ['CÒN HOẠT ĐỘNG', s.active_records, 'metric-active'],
      ['KHÔNG HỌC / BỎ HỌC', s.inactive_records, 'metric-inactive'],
      [`PHÁT SINH SAU ${s.cutoff_date || '29/07'}`, s.new_since_cutoff, 'metric-new'],
      ['NGÀY HỢP LỆ NĂM 2026', s.valid_date_total, 'metric-valid']
    ];
    return `
      <section class="summary-form">
        <div class="metric-grid">
          ${cards.map(([label,value,cls]) => `<div class="metric ${cls}"><div>${esc(label)}</div><strong>${fmt(value)}</strong></div>`).join('')}
        </div>
        <div class="source-strip">
          <span><b>Nguồn số liệu duy nhất:</b> DSHS NHẬP HỌC TỔNG NĂM 2026</span>
          <span><b>Hôm nay:</b> ${fmt(s.today_count)}</span>
          <span><b>CCCD trùng:</b> ${fmt(s.duplicate_new)}</span>
          <span><b>HS mới thiếu trường khóa:</b> ${fmt(s.incomplete_new)}</span>
          <a href="${MASTER_URL}" target="_blank" rel="noopener">Mở DSHS Tổng ↗</a>
        </div>
      </section>`;
  }

  function renderQuality() {
    const s = state.data.summary;
    const fixedTotal = Math.max(0, n(s.total_records) - n(s.unknown_recruit_catalog));
    const statusBad = n(s.source_mismatch_count) > 0;
    const pairs = [
      ['5 nguồn → Master', s.source_system_status || '', 'Số nguồn lệch Master', s.source_mismatch_count, 'Thiếu/sai ngày nhập học 2026', s.missing_date_total],
      ['Thiếu mã phân hiệu', s.missing_campus_total, 'Thiếu mã doanh nghiệp', s.missing_company_total, 'Thiếu đơn vị tuyển', s.missing_recruit_unit_total],
      ['Ngoài danh mục phân hiệu cố định', s.unknown_campus_catalog, 'Ngoài danh mục doanh nghiệp cố định', s.unknown_company_catalog, 'Ngoài danh mục đơn vị tuyển cố định', s.unknown_recruit_catalog]
    ];
    return `
      <section class="quality-form">
        <div class="quality-topline">
          <span>Tổng danh mục cố định: <b>${fmt(fixedTotal)}</b> / DSHS Tổng: <b>${fmt(s.total_records)}</b> · <b class="warn-text">${fmt(s.unknown_recruit_catalog)} hồ sơ ngoài danh mục đơn vị tuyển sinh</b> đang được cảnh báo riêng.</span>
          <span>Phiên bản dữ liệu: <b>${esc(s.data_version || '')}</b></span>
        </div>
        <div class="quality-title">KIỂM SOÁT CHẤT LƯỢNG DỮ LIỆU</div>
        <div class="table-scroll compact-scroll">
          <table class="quality-table">
            <tbody>
              ${pairs.map((r,ri) => `<tr>${r.map((v,i) => {
                const isValue = i % 2 === 1;
                const bad = (ri === 0 && i === 1 && statusBad) || (isValue && (typeof v === 'number' || /^\d/.test(String(v))) && n(v) > 0);
                return `<td class="${isValue ? 'quality-value' : 'quality-label'} ${bad ? 'quality-bad' : ''}">${isValue && typeof v === 'number' ? fmt(v) : esc(v)}</td>`;
              }).join('')}</tr>`).join('')}
              <tr><td colspan="6" class="quality-rule"><b>Nguyên tắc:</b> 5 phân hiệu → DSHS Tổng → Dashboard. TH KQ Nhập Học chỉ là mẫu bố cục. Tên và thứ tự Phân hiệu, Doanh nghiệp, Đơn vị tuyển sinh được cố định theo biểu tổng hợp; mã lạ không tự tạo thêm dòng.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="quality-footer"><span>Dashboard Nhập học hàng ngày · CĐ TKV</span><span>thaylinhtuyenthomo.vn/nhap-hoc/</span></div>
      </section>`;
  }

  function visibleIndexes(rows, total, key, labels) {
    return labels.map((_,i) => i).filter(i => nz(total[key]?.[i]) || rows.some(r => nz(r[key]?.[i])));
  }

  function renderPH() {
    const d = state.details.ph;
    const mi = visibleIndexes(d.rows, d.total, 'month', d.month_labels);
    const ci = visibleIndexes(d.rows, d.total, 'current', d.current_labels);
    const makeRow = (r,total=false) => `
      <tr class="${total ? 'total-row' : ''}">
        <td class="sticky-tt">${esc(r.tt)}</td>
        <td class="sticky-name">${esc(r.name || (total ? 'TỔNG CỘNG' : ''))}</td>
        ${mi.map(i => `<td class="month-cell ${i === 9 ? 'sum-col' : ''}">${fmt(r.month[i])}</td>`).join('')}
        ${ci.map(i => `<td class="current-cell ${i === 9 ? 'highlight-green' : ''}">${fmt(r.current[i])}</td>`).join('')}
      </tr>`;
    return `${reportTitle(d.title, 'Biểu 3/5 · Hiển thị đúng nhóm cột có số liệu theo mẫu')}
      <div class="unit-line">Đơn vị tính: học sinh</div>
      <div class="table-scroll"><table class="report-table report-ph">
        <thead>
          <tr class="top-head"><th rowspan="2" class="sticky-tt">TT</th><th rowspan="2" class="sticky-name">Học sinh nhập học về các phân hiệu</th><th colspan="${mi.length}" class="month-group">THÁNG 8/2026</th><th colspan="${ci.length}" class="current-group">TỔNG ĐẾN THỜI ĐIỂM HIỆN TẠI</th></tr>
          <tr>${mi.map(i => `<th>${esc(d.month_labels[i])}</th>`).join('')}${ci.map(i => `<th class="${i===9?'highlight-green':''}">${esc(d.current_labels[i])}</th>`).join('')}</tr>
        </thead>
        <tbody>${d.rows.map(r => makeRow(r)).join('')}${makeRow(d.total,true)}</tbody>
      </table></div>`;
  }

  function groupHeaders(groups) {
    return groups.map(g => `<th colspan="3">${esc(g)}</th>`).join('');
  }
  function tripleHeaders(groups) {
    return groups.map(() => '<th>TRƯỜNG TUYỂN</th><th>DN TUYỂN</th><th>TỔNG SỐ</th>').join('');
  }
  function triples(vals) {
    return vals.map((v,i) => `<td class="${i%3===2?'sum-col':''}">${fmt(v)}</td>`).join('');
  }

  function renderDN() {
    const d = state.details.dn;
    const row = (r,total=false) => `
      <tr class="${total?'total-row':''}">
        <td class="sticky-tt">${esc(r.tt)}</td><td class="sticky-name">${esc(r.name || (total?'CỘNG TOÀN TRƯỜNG':''))}</td>
        <td class="contract-col">${fmt(r.contract)}</td><td class="target-col">${fmt(r.target)}</td>
        ${triples(r.aug)}${triples(r.current)}${triples(r.overall)}
        <td class="same-col">${fmt(r.same2025)}</td><td class="retuyen-col">${fmt(r.retuyen)}</td><td class="grand-col">${fmt(r.grand)}</td>
      </tr>`;
    return `${reportTitle(d.title, 'Biểu 4/5 · Kết quả tháng 08/2026 và lũy kế theo doanh nghiệp')}
      <div class="unit-line">Đơn vị tính: học sinh</div>
      <div class="table-scroll"><table class="report-table report-dn">
        <thead>
          <tr class="top-head">
            <th rowspan="3" class="sticky-tt">TT</th><th rowspan="3" class="sticky-name">TÊN DN</th>
            <th rowspan="3" class="contract-col">Tổng cộng<br>Hợp đồng 2026</th><th rowspan="3" class="target-col">TKV giao<br>năm 2026</th>
            <th colspan="${d.aug_groups.length*3}" class="month-group">KẾT QUẢ THỰC HIỆN THÁNG 08/2026</th>
            <th colspan="${d.current_groups.length*3}" class="current-group">TỔNG NHẬP HỆ A ĐẾN 18/8/2026</th>
            <th colspan="3" class="sum-group">TỔNG NHẬP CÁC NGHỀ ĐẾN 18/8/2026</th>
            <th rowspan="3" class="same-col">Cùng kỳ năm 2025<br>(31/7/2025)</th>
            <th rowspan="3" class="retuyen-col">Số học sinh<br>tái tuyển 2026</th>
            <th rowspan="3" class="grand-col">Tổng số gồm cả<br>HS tái tuyển</th>
          </tr>
          <tr>${groupHeaders(d.aug_groups)}${groupHeaders(d.current_groups)}<th colspan="3">TỔNG SỐ</th></tr>
          <tr>${tripleHeaders(d.aug_groups)}${tripleHeaders(d.current_groups)}<th>TRƯỜNG TUYỂN</th><th>DN TUYỂN</th><th>TỔNG SỐ</th></tr>
        </thead>
        <tbody>${d.rows.map(r=>row(r)).join('')}${row(d.total,true)}</tbody>
      </table></div>`;
  }

  function renderDV() {
    const d = state.details.dv;
    const ai = d.aug_labels.map((_,i)=>i).filter(i => nz(d.total.aug[i]) || d.rows.some(r=>nz(r.aug[i])));
    const row = (r,total=false) => {
      const cv = r.current;
      return `<tr class="${total?'total-row':''}">
        <td class="sticky-tt">${esc(r.tt)}</td><td class="sticky-name">${esc(r.name || (total?'TỔNG CỘNG NHẬP':''))}</td>
        ${ai.map(i=>`<td class="${i===7?'sum-col':''}">${fmt(r.aug[i])}</td>`).join('')}
        ${cv.slice(0,7).map((v,i)=>`<td class="${i===2?'highlight-yellow':i===1?'current-dn':'current-school'}">${i===6?pct(v):fmt(v)}</td>`).join('')}
        <td class="same-col">${fmt(cv[7])}</td><td class="same-col">${fmt(cv[8])}</td><td class="same-col">${pct(cv[9])}</td>
        <td class="retuyen-col">${fmt(cv[10])}</td><td class="grand-col">${fmt(cv[11])}</td>
      </tr>`;
    };
    return `${reportTitle(d.title, 'Biểu 5/5 · Quý 3/2026 – Tháng 8/2026')}
      <div class="unit-line">Đơn vị tính: học sinh</div>
      <div class="table-scroll"><table class="report-table report-dv">
        <thead>
          <tr class="top-head">
            <th rowspan="2" class="sticky-tt">TT</th><th rowspan="2" class="sticky-name">ĐƠN VỊ TUYỂN SINH</th>
            <th colspan="${ai.length}" class="month-group">QUÝ 3.2026 · THÁNG 8/2026</th>
            <th colspan="7" class="current-group">TỔNG NHẬP ĐẾN 19/8/2026</th>
            <th colspan="3" class="same-group">TỔNG NHẬP HỆ A ĐẾN 29/8/2025</th>
            <th rowspan="2" class="retuyen-col">Số học sinh<br>tái tuyển 2026</th>
            <th rowspan="2" class="grand-col">Tổng số nhập<br>bao gồm cả tái tuyển</th>
          </tr>
          <tr>
            ${ai.map(i=>`<th>${esc(d.aug_labels[i])}</th>`).join('')}
            ${d.current_labels.slice(0,7).map((v,i)=>`<th class="${i===2?'highlight-yellow':''}">${esc(v)}</th>`).join('')}
            <th>TKV</th><th>Tổng</th><th>So sánh cùng kỳ (%)</th>
          </tr>
        </thead>
        <tbody>${d.rows.map(r=>row(r)).join('')}${row(d.total,true)}</tbody>
      </table></div>
      <div class="dv-note">${esc(d.note || '')}</div>
      <div class="dv-extras">
        <table class="mini-table"><thead><tr><th>Trong đó nhập tại</th>${d.today_by_campus.map(x=>`<th>${esc(x.campus)}</th>`).join('')}<th>Tổng nhập</th></tr></thead><tbody><tr><td></td>${d.today_by_campus.map(x=>`<td>${fmt(x.count)}</td>`).join('')}<td><b>${fmt(d.today_total)}</b></td></tr></tbody></table>
        <div>
          <div class="mini-title">Lũy kế kết quả thực hiện đến thời điểm báo cáo</div>
          <table class="mini-table progress-table"><thead><tr><th>Nội dung</th><th>Kế hoạch 2026</th><th>Kết quả thực hiện</th><th>Tỷ lệ hoàn thành (%)</th></tr></thead><tbody>${d.progress.map(x=>`<tr><td>${esc(x.label)}</td><td>${fmt(x.plan)}</td><td>${fmt(x.actual)}</td><td>${pct(x.pct)}</td></tr>`).join('')}</tbody></table>
        </div>
      </div>`;
  }


  function renderRaw(key) {
    const rows = state.extra[key] || [];
    const width = Math.max(1, ...rows.map(r => r.length));
    const body = rows.map((r, ri) => {
      const cells = Array.from({length: width}, (_, i) => r[i] ?? '');
      const nonEmpty = cells.filter(v => String(v).trim() !== '').length;
      const cls = nonEmpty === 1 ? 'raw-title-row' : (ri === 5 || (key === 'qc' && ri === 4) ? 'raw-header-row' : '');
      return `<tr class="${cls}">${cells.map((v, i) => `<td class="${i === 0 ? 'raw-first' : ''}">${esc(v)}</td>`).join('')}</tr>`;
    }).join('');
    return `<div class="table-scroll raw-scroll"><table class="report-table raw-report"><tbody>${body}</tbody></table></div>`;
  }

  function render() {
    const root = document.getElementById('reportContent');
    if (!state.data || !state.details || !state.extra) return;
    const map = { ph: renderPH, dn: renderDN, dv: renderDV, tinh: () => renderRaw('tinh'), qc: () => renderRaw('qc') };
    root.innerHTML = (map[state.active] || renderDV)();
  }

  async function load() {
    try {
      const [r1,r2,r3] = await Promise.all([
        fetch(`./data.json?v=${Date.now()}`, {cache:'no-store'}),
        fetch(`./report-details.json?v=${Date.now()}`, {cache:'no-store'}),
        fetch(`./report-extra.json?v=${Date.now()}`, {cache:'no-store'})
      ]);
      if (!r1.ok || !r2.ok || !r3.ok) throw new Error(`HTTP ${r1.status}/${r2.status}/${r3.status}`);
      state.data = await r1.json();
      state.details = await r2.json();
      state.extra = await r3.json();
      render();
    } catch (err) {
      console.error(err);
      document.getElementById('reportContent').innerHTML = '<div class="loading-cell error-cell">Không tải được dữ liệu 5 biểu tổng hợp.</div>';
    }
  }

  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    state.active = btn.dataset.report;
    render();
  }));

  load();
  setInterval(load, 5 * 60 * 1000);
})();
