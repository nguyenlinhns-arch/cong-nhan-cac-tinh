(() => {
  const nf = new Intl.NumberFormat('vi-VN');
  const TITLES = {
    ph: 'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO PHÂN HIỆU/ TRUNG TÂM NĂM 2026',
    dn: 'TỔNG HỢP KẾT QUẢ TUYỂN SINH THEO DOANH NGHIỆP NĂM 2026',
    dv: 'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO ĐƠN VỊ NĂM 2026'
  };
  const TOTAL_LABELS = { ph: 'TỔNG CỘNG', dn: 'CỘNG TOÀN TRƯỜNG', dv: 'TỔNG CỘNG NHẬP' };
  const QUARTERS = [
    { label: 'QUÝ I/2026', months: [0,1,2], cls: 'q1' },
    { label: 'QUÝ II/2026', months: [3,4,5], cls: 'q2' },
    { label: 'QUÝ III/2026', months: [6,7,8], cls: 'q3' },
    { label: 'QUÝ IV/2026', months: [9,10,11], cls: 'q4' }
  ];
  const state = { data: null, active: 'ph' };

  const nonZero = v => Number(v || 0) !== 0;
  const fmt = v => nonZero(v) ? nf.format(Number(v)) : '';

  function displayTT(kind, index, groupIndex) {
    if (kind === 'ph') return ['1','2','3','4','5','5'][index] || String(index + 1);
    if (kind === 'dn') return String(groupIndex + 1);
    return String(index + 1);
  }

  function orderedRows(kind) {
    const reportRows = (state.data?.reports?.[kind] || []).filter(r => !r.total_row);
    const byCode = new Map(reportRows.map(r => [String(r.code), r]));
    const catalog = state.data?.catalogs?.[kind] || [];
    let tkvIndex = 0;
    let dbIndex = 0;
    return catalog.map((item, index) => {
      const src = byCode.get(String(item.code)) || {};
      const groupIndex = kind === 'dn'
        ? (item.group === 'DONG_BAC' ? dbIndex++ : tkvIndex++)
        : index;
      return {
        code: item.code,
        name: item.name,
        group: item.group,
        tt: displayTT(kind, index, groupIndex),
        months: Array.isArray(src.months) && src.months.length === 12 ? src.months.map(Number) : Array(12).fill(0),
        total: Number(src.total || 0),
        active: Number(src.active || 0),
        inactive: Number(src.inactive || 0)
      };
    });
  }

  function rowHasData(row) {
    return nonZero(row.total) || nonZero(row.active) || nonZero(row.inactive) || row.months.some(nonZero);
  }

  function visibleMonths(rows) {
    const visible = [];
    for (let i = 0; i < 12; i++) {
      if (rows.some(r => nonZero(r.months[i]))) visible.push(i);
    }
    return visible;
  }

  function quarterClass(monthIndex) {
    return monthIndex <= 2 ? 'q1' : monthIndex <= 5 ? 'q2' : monthIndex <= 8 ? 'q3' : 'q4';
  }

  function makeTh(text, className = '', attrs = {}) {
    const th = document.createElement('th');
    th.textContent = text;
    if (className) th.className = className;
    Object.entries(attrs).forEach(([k,v]) => th.setAttribute(k, v));
    return th;
  }

  function buildHeader(months) {
    const head = document.getElementById('reportHead');
    head.innerHTML = '';
    const top = document.createElement('tr');
    top.className = 'quarter-row';
    top.appendChild(makeTh('TT', 'sticky-tt', { rowspan: '2' }));
    top.appendChild(makeTh('ĐƠN VỊ', 'sticky-name', { rowspan: '2' }));

    QUARTERS.forEach(q => {
      const shown = q.months.filter(m => months.includes(m));
      if (!shown.length) return;
      top.appendChild(makeTh(q.label, q.cls, { colspan: String(shown.length) }));
    });

    top.appendChild(makeTh('TỔNG NĂM', 'total-head', { rowspan: '2' }));
    top.appendChild(makeTh('CÒN HOẠT ĐỘNG', 'active-head', { rowspan: '2' }));
    top.appendChild(makeTh('KHÔNG HỌC / BỎ HỌC', 'inactive-head', { rowspan: '2' }));

    const second = document.createElement('tr');
    second.className = 'month-row';
    months.forEach(m => second.appendChild(makeTh(`T${m + 1}`, quarterClass(m))));
    head.append(top, second);
  }

  function makeCell(value, className = '') {
    const td = document.createElement('td');
    td.textContent = value;
    if (className) td.className = className;
    return td;
  }

  function appendRow(body, row, months, totalLabel = null) {
    const tr = document.createElement('tr');
    if (totalLabel) tr.className = 'total-row';
    tr.appendChild(makeCell(totalLabel || row.tt, 'tt-cell'));
    const name = makeCell(totalLabel || row.name, 'entity');
    if (!totalLabel && row.code) {
      const small = document.createElement('small');
      small.textContent = row.code;
      name.appendChild(small);
    }
    tr.appendChild(name);
    months.forEach(m => tr.appendChild(makeCell(fmt(row.months[m]), `month-cell ${quarterClass(m)}`)));
    tr.appendChild(makeCell(fmt(row.total), 'total-year-cell'));
    tr.appendChild(makeCell(fmt(row.active), 'active-cell'));
    tr.appendChild(makeCell(fmt(row.inactive), 'inactive-cell'));
    body.appendChild(tr);
  }

  function appendGroup(body, label, rows, months) {
    if (!rows.length) return;
    const tr = document.createElement('tr');
    tr.className = 'group-row';
    tr.appendChild(makeCell(label.startsWith('I.') ? 'I' : 'II', 'tt-cell'));
    tr.appendChild(makeCell(label.replace(/^I+\.\s*/, ''), 'entity'));
    months.forEach(m => tr.appendChild(makeCell(fmt(rows.reduce((a,r) => a + r.months[m], 0)), `month-cell ${quarterClass(m)}`)));
    tr.appendChild(makeCell(fmt(rows.reduce((a,r) => a + r.total, 0)), 'total-year-cell'));
    tr.appendChild(makeCell(fmt(rows.reduce((a,r) => a + r.active, 0)), 'active-cell'));
    tr.appendChild(makeCell(fmt(rows.reduce((a,r) => a + r.inactive, 0)), 'inactive-cell'));
    body.appendChild(tr);
  }

  function totalRow(rows) {
    const months = Array(12).fill(0);
    rows.forEach(r => r.months.forEach((v,i) => months[i] += v));
    return {
      months,
      total: rows.reduce((a,r) => a + r.total, 0),
      active: rows.reduce((a,r) => a + r.active, 0),
      inactive: rows.reduce((a,r) => a + r.inactive, 0)
    };
  }

  function renderTable(kind) {
    state.active = kind;
    const title = document.getElementById('reportTitle');
    const body = document.getElementById('reportBody');
    title.textContent = TITLES[kind];
    body.innerHTML = '';

    const rows = orderedRows(kind).filter(rowHasData);
    const months = visibleMonths(rows);
    buildHeader(months);

    if (!rows.length) {
      const tr = document.createElement('tr');
      const td = makeCell('Chưa có số liệu.', 'loading-cell');
      td.colSpan = 5 + months.length;
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    if (kind === 'dn') {
      const tkv = rows.filter(r => r.group === 'TKV');
      const db = rows.filter(r => r.group === 'DONG_BAC');
      appendGroup(body, 'I. TỔNG TKV', tkv, months);
      tkv.forEach(r => appendRow(body, r, months));
      if (db.length) {
        appendGroup(body, 'II. ĐÔNG BẮC', db, months);
        db.forEach(r => appendRow(body, r, months));
      }
    } else {
      rows.forEach(r => appendRow(body, r, months));
    }

    appendRow(body, totalRow(rows), months, TOTAL_LABELS[kind]);
  }

  async function loadData() {
    try {
      const res = await fetch(`./data.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data?.reports || !data?.catalogs) throw new Error('Sai cấu trúc data.json');
      state.data = data;
      renderTable(state.active);
    } catch (err) {
      console.error(err);
      const body = document.getElementById('reportBody');
      body.innerHTML = '<tr><td class="loading-cell">Không tải được dữ liệu.</td></tr>';
    }
  }

  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTable(btn.dataset.report);
  }));

  loadData();
  setInterval(loadData, 5 * 60 * 1000);
})();
