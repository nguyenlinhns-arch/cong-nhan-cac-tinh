(() => {
  const nf = new Intl.NumberFormat('vi-VN');
  const TITLES = {
    ph: 'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO PHÂN HIỆU / TRUNG TÂM NĂM 2026',
    dn: 'TỔNG HỢP KẾT QUẢ TUYỂN SINH THEO DOANH NGHIỆP NĂM 2026',
    dv: 'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO ĐƠN VỊ NĂM 2026'
  };
  const numericKeys = new Set([
    'total_records','inactive_records','active_records','new_since_cutoff','new_active_since_cutoff',
    'today_count','duplicate_new','incomplete_new','source_mismatch_count','missing_campus_total',
    'valid_date_total','missing_date_total','missing_company_total','missing_recruit_unit_total',
    'unknown_campus_catalog','unknown_company_catalog','unknown_recruit_catalog'
  ]);
  const state = { data: null, active: 'ph' };

  const sum = arr => (arr || []).reduce((a, b) => a + Number(b || 0), 0);
  const quarterValues = months => [
    sum(months.slice(0, 3)),
    sum(months.slice(3, 6)),
    sum(months.slice(6, 9)),
    sum(months.slice(9, 12))
  ];
  const fmt = v => v === '' || v == null || Number.isNaN(Number(v)) ? (v ?? '') : nf.format(Number(v));

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
    const updated = document.getElementById('updatedText');
    const notice = document.getElementById('dataNotice');
    if (master) {
      master.textContent = 'DSHS TỔNG · ĐÃ ĐỒNG BỘ';
      master.className = 'source-chip live';
    }
    if (source) {
      source.textContent = s.source_system_status || 'CHƯA XÁC ĐỊNH';
      source.className = `source-health ${ok ? 'ok' : 'warn'}`;
    }
    if (updated) updated.textContent = `Cập nhật dữ liệu: ${state.data?.generated_at || s.data_version || ''}`;
    if (notice) notice.className = `status-line ${ok ? 'live' : 'warning'}`;

    const cat = document.getElementById('catalogWarning');
    if (cat) {
      cat.innerHTML = `<b>Danh mục cố định:</b> ngoài danh mục hiện có ` +
        `<strong>${fmt(s.unknown_campus_catalog || 0)}</strong> hồ sơ phân hiệu · ` +
        `<strong>${fmt(s.unknown_company_catalog || 0)}</strong> hồ sơ doanh nghiệp · ` +
        `<strong>${fmt(s.unknown_recruit_catalog || 0)}</strong> hồ sơ đơn vị tuyển. ` +
        `Các mã này chỉ được cảnh báo, không tự sinh thêm dòng báo cáo.`;
    }
  }

  function currentMonth() {
    const d = new Date();
    return d.getFullYear() === 2026 ? d.getMonth() + 1 : 0;
  }

  function markMonthHeader() {
    const m = currentMonth();
    document.querySelectorAll('[data-month]').forEach(el => {
      el.classList.toggle('current-month', Number(el.dataset.month) === m);
    });
  }

  function makeCell(value, className = '') {
    const td = document.createElement('td');
    td.textContent = value;
    if (className) td.className = className;
    return td;
  }

  function appendDataRow(body, row, mNow) {
    const tr = document.createElement('tr');
    if (row.total_row) tr.classList.add('total-row');
    tr.appendChild(makeCell(row.total_row ? 'TỔNG CỘNG' : row.tt, 'tt-cell'));

    const entity = makeCell(row.total_row ? 'TỔNG CỘNG' : (row.name || ''), 'entity');
    if (!row.total_row && row.code) {
      const code = document.createElement('small');
      code.textContent = row.code;
      entity.appendChild(code);
    }
    tr.appendChild(entity);

    const months = row.months || Array(12).fill(0);
    const quarters = quarterValues(months);
    months.forEach((v, i) => {
      tr.appendChild(makeCell(fmt(v), `month-cell ${i + 1 === mNow ? 'current-month' : ''}`));
      if ([2,5,8,11].includes(i)) {
        const q = Math.floor(i / 3);
        tr.appendChild(makeCell(fmt(quarters[q]), 'quarter-total-cell'));
      }
    });
    tr.appendChild(makeCell(fmt(row.total), 'total-year-cell'));
    tr.appendChild(makeCell(fmt(row.active), 'active-cell'));
    tr.appendChild(makeCell(fmt(row.inactive), 'inactive-cell'));
    body.appendChild(tr);
  }

  function appendGroupRow(body, label, rows) {
    const months = Array(12).fill(0);
    rows.forEach(r => (r.months || []).forEach((v, i) => months[i] += Number(v || 0)));
    const total = rows.reduce((a, r) => a + Number(r.total || 0), 0);
    const active = rows.reduce((a, r) => a + Number(r.active || 0), 0);
    const inactive = rows.reduce((a, r) => a + Number(r.inactive || 0), 0);
    const quarters = quarterValues(months);
    const tr = document.createElement('tr');
    tr.className = 'group-row';
    tr.appendChild(makeCell('', 'tt-cell'));
    tr.appendChild(makeCell(label, 'entity'));
    months.forEach((v, i) => {
      tr.appendChild(makeCell(fmt(v), 'month-cell'));
      if ([2,5,8,11].includes(i)) tr.appendChild(makeCell(fmt(quarters[Math.floor(i / 3)]), 'quarter-total-cell'));
    });
    tr.appendChild(makeCell(fmt(total), 'total-year-cell'));
    tr.appendChild(makeCell(fmt(active), 'active-cell'));
    tr.appendChild(makeCell(fmt(inactive), 'inactive-cell'));
    body.appendChild(tr);
  }

  function qualityFor(kind, totalRow) {
    const s = state.data?.summary || {};
    const masterTotal = Number(s.total_records || 0);
    const fixedTotal = Number(totalRow?.total || 0);
    const unknownKey = kind === 'ph' ? 'unknown_campus_catalog' : kind === 'dn' ? 'unknown_company_catalog' : 'unknown_recruit_catalog';
    const unknown = Number(s[unknownKey] || Math.max(masterTotal - fixedTotal, 0));
    const label = kind === 'ph' ? 'phân hiệu/trung tâm' : kind === 'dn' ? 'doanh nghiệp' : 'đơn vị tuyển sinh';
    return { fixedTotal, masterTotal, unknown, label };
  }

  function renderTable(kind) {
    state.active = kind;
    const body = document.getElementById('reportBody');
    const title = document.getElementById('reportTitle');
    const note = document.getElementById('tableQualityNote');
    const rows = state.data?.reports?.[kind] || [];
    if (!body) return;
    if (title) title.textContent = TITLES[kind];
    body.innerHTML = '';
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="21" class="loading-cell">Chưa có dữ liệu báo cáo.</td></tr>';
      return;
    }

    const mNow = currentMonth();
    const dataRows = rows.filter(r => !r.total_row);
    const totalRow = rows.find(r => r.total_row);

    if (kind === 'dn') {
      const tkv = dataRows.filter(r => r.group === 'TKV');
      const db = dataRows.filter(r => r.group === 'DONG_BAC');
      appendGroupRow(body, 'I. TỔNG TKV', tkv);
      tkv.forEach(r => appendDataRow(body, r, mNow));
      appendGroupRow(body, 'II. ĐÔNG BẮC', db);
      db.forEach(r => appendDataRow(body, r, mNow));
    } else {
      dataRows.forEach(r => appendDataRow(body, r, mNow));
    }
    if (totalRow) appendDataRow(body, totalRow, mNow);

    if (note && totalRow) {
      const q = qualityFor(kind, totalRow);
      note.innerHTML = q.unknown
        ? `Tổng danh mục cố định: <b>${fmt(q.fixedTotal)}</b> / DSHS Tổng: <b>${fmt(q.masterTotal)}</b> · ` +
          `<span class="warning">${fmt(q.unknown)} hồ sơ ngoài danh mục ${q.label} đang được cảnh báo riêng.</span>`
        : `Tổng danh mục cố định khớp DSHS Tổng: <b>${fmt(q.masterTotal)}</b> hồ sơ.`;
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
      if (!data?.summary || !data?.reports || data.summary.catalog_mode !== 'FIXED') {
        throw new Error('Sai cấu trúc hoặc danh mục chưa cố định');
      }
      const changed = state.data?.summary?.data_version !== data.summary?.data_version ||
        state.data?.summary?.catalog_version !== data.summary?.catalog_version;
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

  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTable(btn.dataset.report);
  }));

  loadData(true);
  setInterval(() => loadData(false), 5 * 60 * 1000);
})();
