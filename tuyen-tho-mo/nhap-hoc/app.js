(() => {
  const DATA_URL = './live-report.json';
  const root = document.getElementById('reportContent');
  const tabs = [...document.querySelectorAll('.tab-btn')];
  const state = { data: null, active: 'dv' };

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
  const n = v => Number(v || 0);
  const fmt = v => n(v).toLocaleString('vi-VN');
  const signed = v => `${n(v) > 0 ? '+' : ''}${fmt(v)}`;

  const tableTitle = {
    dv: ['TỔNG HỢP THEO ĐƠN VỊ TUYỂN SINH', 'Đơn vị tuyển sinh'],
    ph: ['TỔNG HỢP THEO PHÂN HIỆU NHẬP HỌC', 'Phân hiệu / Trung tâm'],
    dn: ['TỔNG HỢP THEO DOANH NGHIỆP', 'Doanh nghiệp']
  };

  function summary() {
    const s = state.data.summary;
    return `<div class="snapshot-summary">
      <div><span>Gốc biểu TH 31/07/2026</span><strong>${fmt(s.base_3107)}</strong></div>
      <div><span>DSHS duy nhất 31/07</span><strong>${fmt(s.dshs_unique_base)}</strong></div>
      <div><span>DSHS duy nhất hiện tại</span><strong>${fmt(s.dshs_unique_current)}</strong></div>
      <div><span>Tăng/giảm ròng</span><strong class="${n(s.net_unique) < 0 ? 'neg' : 'pos'}">${signed(s.net_unique)}</strong></div>
      <div class="current-total"><span>Tổng hiện tại</span><strong>${fmt(s.current_total)}</strong></div>
    </div>`;
  }

  function note() {
    return `<div class="source-note"><b>Nguyên tắc tính:</b> lấy biểu tổng hợp ngày 31/07/2026 làm gốc cố định. Từ 01/08 đến ngày báo cáo, chỉ lấy chênh lệch số học sinh duy nhất giữa DSHS hiện tại và DSHS 31/07 theo đúng nhóm đang xem. Học sinh được khử trùng theo họ tên + ngày sinh; nếu thiếu mới dùng CCCD/điện thoại. Không dùng ngày nhập học hoặc ngày bỏ học lịch sử để cộng/trừ lại quá khứ.<br><b>Lưu ý:</b> 2.536 là số học sinh duy nhất trong DSHS snapshot 31/07 dùng để đo biến động, không thay thế số gốc biểu TH 2.126.</div>`;
  }

  function render() {
    const key = state.active;
    const rows = state.data[key] || [];
    const [title, nameHeader] = tableTitle[key];
    const totalBase = rows.reduce((a, r) => a + n(r.base), 0);
    const totalDelta = rows.reduce((a, r) => a + n(r.delta), 0);
    const totalCurrent = rows.reduce((a, r) => a + n(r.current), 0);

    const body = rows.map((r, i) => `<tr class="${i % 2 ? 'row-alt' : ''}">
      <td>${i + 1}</td>
      <td class="code-cell">${esc(r.code)}</td>
      <td class="name-cell">${esc(r.name)}</td>
      <td>${fmt(r.base)}</td>
      <td class="delta-cell ${n(r.delta) < 0 ? 'neg' : n(r.delta) > 0 ? 'pos' : ''}">${signed(r.delta)}</td>
      <td class="current-cell">${fmt(r.current)}</td>
    </tr>`).join('');

    root.className = `report-sheet report-${key}`;
    root.innerHTML = `<div class="dashboard-card snapshot-card">
      <div class="dashboard-title"><h2>${esc(title)}</h2><p>Số liệu đến ${esc(state.data.snapshot_date)}</p></div>
      ${summary()}
      <div class="native-table-wrap"><table class="native-report snapshot-table">
        <thead><tr><th>TT</th><th>Mã</th><th>${esc(nameHeader)}</th><th>Gốc 31/07</th><th>Chênh DSHS duy nhất</th><th>Hiện tại</th></tr></thead>
        <tbody>${body}<tr class="summary-row"><td></td><td></td><td>TỔNG CỘNG</td><td>${fmt(totalBase)}</td><td class="${totalDelta < 0 ? 'neg' : 'pos'}">${signed(totalDelta)}</td><td>${fmt(totalCurrent)}</td></tr></tbody>
      </table></div>
      ${note()}
    </div>`;
  }

  function validate(data) {
    return data?.schema_version === 2 && data?.summary &&
      Array.isArray(data.dv) && data.dv.length === 18 &&
      Array.isArray(data.ph) && data.ph.length === 6 &&
      Array.isArray(data.dn) && data.dn.length === 15;
  }

  async function load() {
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!validate(data)) throw new Error('Dữ liệu báo cáo không đúng schema v2');
      state.data = data;
      render();
    } catch (err) {
      console.error(err);
      root.innerHTML = '<div class="loading-cell">Chưa tải được dữ liệu tổng hợp hiện tại. Vui lòng tải lại trang.</div>';
    }
  }

  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    state.active = btn.dataset.report;
    if (state.data) render();
  }));

  load();
})();