(() => {
  const nf = new Intl.NumberFormat('vi-VN');
  const TITLES = {
    ph: 'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH NĂM 2026 THEO PHÂN HIỆU / TRUNG TÂM',
    dn: 'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH NĂM 2026 THEO DOANH NGHIỆP',
    dv: 'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH NĂM 2026 THEO ĐƠN VỊ TUYỂN SINH'
  };
  const numericKeys = new Set([
    'total_records','inactive_records','active_records','new_since_cutoff','new_active_since_cutoff',
    'today_count','duplicate_new','incomplete_new','source_mismatch_count','missing_campus_total',
    'valid_date_total','missing_date_total','missing_company_total','missing_recruit_unit_total'
  ]);
  const state = { data: null, active: 'ph' };

  function fmt(v) {
    return v === '' || v == null || Number.isNaN(Number(v)) ? (v ?? '') : nf.format(Number(v));
  }

  function renderSummary() {
    const s = state.data?.summary || {};
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.dataset.key;
      if (!(key in s)) return;
      el.textContent = numericKeys.has(key) ? fmt(s[key]) : s[key];
    });

    const ok = String(s.source_system_status || '').includes('OK') && Number(s.source_mismatch_count || 0) === 0;
    const master = document.getElementById('masterStatus');
    const source = document.getElementById('sourceStatus');
    const notice = document.getElementById('dataNotice');
    const updated = document.getElementById('updatedText');
    if (master) {
      master.textContent = 'DSHS TỔNG · ĐÃ ĐỒNG BỘ';
      master.className = 'source-chip live';
    }
    if (source) {
      source.textContent = s.source_system_status || 'CHƯA XÁC ĐỊNH NGUỒN';
      source.className = `source-health ${ok ? 'ok' : 'warn'}`;
    }
    if (notice) notice.className = `status-line ${ok ? 'live' : 'warning'}`;
    if (updated) {
      const stamp = state.data?.generated_at || s.data_version || '';
      updated.textContent = `Dữ liệu tổng hợp: ${stamp}`;
    }
  }

  function currentMonth() {
    const d = new Date();
    return d.getFullYear() === 2026 ? d.getMonth() + 1 : 0;
  }

  function markMonthHeader() {
    const m = currentMonth();
    document.querySelectorAll('.month-head').forEach(el => {
      el.classList.toggle('current-month', Number(el.dataset.month) === m);
    });
  }

  function renderTable(kind) {
    state.active = kind;
    const body = document.getElementById('reportBody');
    const title = document.getElementById('reportTitle');
    const note = document.getElementById('tableQualityNote');
    if (!body) return;
    if (title) title.textContent = TITLES[kind];
    body.innerHTML = '';

    const rows = state.data?.reports?.[kind] || [];
    const mNow = currentMonth();
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="17" class="loading-cell">Chưa có dữ liệu báo cáo.</td></tr>';
      return;
    }

    rows.forEach(row => {
      const tr = document.createElement('tr');
      if (row.total_row) tr.classList.add('total-row');
      if (!row.total_row && (row.mapped === false || (row.code && row.name === row.code))) tr.classList.add('unmapped-row');

      const tt = document.createElement('td');
      tt.textContent = row.total_row ? 'TỔNG CỘNG' : row.tt;
      tr.appendChild(tt);

      const entity = document.createElement('td');
      entity.className = 'entity';
      entity.textContent = row.total_row ? 'TỔNG CỘNG' : (row.name || row.code || '');
      if (!row.total_row && row.code) {
        const small = document.createElement('small');
        small.textContent = row.code;
        entity.appendChild(small);
      }
      tr.appendChild(entity);

      (row.months || []).forEach((v, i) => {
        const td = document.createElement('td');
        td.textContent = fmt(v);
        if (i + 1 === mNow) td.classList.add('current-month');
        tr.appendChild(td);
      });

      [row.total, row.active, row.inactive].forEach(v => {
        const td = document.createElement('td');
        td.textContent = fmt(v);
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    const totalRow = rows.find(r => r.total_row);
    const s = state.data?.summary || {};
    if (note && totalRow) {
      const diff = Number(s.total_records || 0) - Number(totalRow.total || 0);
      let reason = '';
      if (kind === 'ph' && diff) reason = ` · ${fmt(diff)} hồ sơ chưa có mã phân hiệu`;
      if (kind === 'dn' && diff) reason = ` · ${fmt(diff)} hồ sơ chưa có mã doanh nghiệp`;
      if (kind === 'dv' && diff) reason = ` · lệch Master ${fmt(diff)} hồ sơ`;
      note.textContent = `Tổng biểu: ${fmt(totalRow.total)} / Master: ${fmt(s.total_records)}${reason}`;
      note.className = diff ? 'warning' : '';
    }
  }

  function renderAll() {
    renderSummary();
    markMonthHeader();
    renderTable(state.active);
  }

  async function loadData(initial = false) {
    try {
      const response = await fetch(`./data.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data?.summary || !data?.reports) throw new Error('Sai cấu trúc data.json');
      const changed = state.data?.summary?.data_version !== data.summary?.data_version;
      state.data = data;
      if (initial || changed) renderAll();
    } catch (err) {
      const master = document.getElementById('masterStatus');
      const source = document.getElementById('sourceStatus');
      const updated = document.getElementById('updatedText');
      const notice = document.getElementById('dataNotice');
      if (master) { master.textContent = 'DỮ LIỆU · CHƯA TẢI ĐƯỢC'; master.className = 'source-chip error'; }
      if (source) { source.textContent = 'CẦN KIỂM TRA data.json'; source.className = 'source-health warn'; }
      if (updated) updated.textContent = 'Không tải được dữ liệu tổng hợp';
      if (notice) notice.className = 'status-line warning';
      console.error(err);
    }
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTable(btn.dataset.report);
    });
  });

  loadData(true);
  setInterval(() => loadData(false), 5 * 60 * 1000);
})();
