(() => {
  const CONFIG = {
    ph: {
      title: 'TH THEO PH',
      layout: './template-ph.json',
      cells: [],
      titleRows: [1, 2, 4, 5],
      headerRows: [7, 8, 9],
      totalRows: [16],
      groupRows: [],
      verticalRows: [9]
    },
    dn: {
      title: 'TH THEO DN',
      layout: './dn-layout.json',
      cells: ['./dn-cells-1.json','./dn-cells-2.json','./dn-cells-3.json','./dn-cells-4.json','./dn-cells-5.json'],
      titleRows: [1, 2, 3],
      headerRows: [4, 5, 6],
      totalRows: [30],
      groupRows: [7, 23],
      verticalRows: [6]
    },
    dv: {
      title: 'TH TS THEO ĐV',
      layout: './dv-layout.json',
      cells: ['./dv-cells.json'],
      titleRows: [1, 2, 4],
      headerRows: [5, 6, 7, 8, 29, 30, 32],
      totalRows: [27],
      groupRows: [28, 31],
      verticalRows: [8]
    }
  };

  const cache = new Map();
  const host = document.getElementById('sheetHost');
  const tabs = [...document.querySelectorAll('.sheet-tab')];

  const fetchJson = async url => {
    const res = await fetch(`${url}?v=20260820-2`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.json();
  };

  async function loadTemplate(kind) {
    if (cache.has(kind)) return cache.get(kind);
    const cfg = CONFIG[kind];
    const layoutDoc = await fetchJson(cfg.layout);
    const sheet = layoutDoc.sheet || layoutDoc;
    let cells = Array.isArray(sheet.cells) ? sheet.cells : [];
    if (cfg.cells.length) {
      const chunks = await Promise.all(cfg.cells.map(fetchJson));
      cells = chunks.flat();
    }
    const template = { ...sheet, cells };
    cache.set(kind, template);
    return template;
  }

  function key(r, c) { return `${r}:${c}`; }

  function mergeIndex(merges) {
    const anchors = new Map();
    const covered = new Set();
    for (const m of merges || []) {
      const [r1, c1, r2, c2] = m;
      anchors.set(key(r1, c1), { rowspan: r2 - r1 + 1, colspan: c2 - c1 + 1 });
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          if (r !== r1 || c !== c1) covered.add(key(r, c));
        }
      }
    }
    return { anchors, covered };
  }

  function cellMap(cells) {
    const map = new Map();
    for (const [r, c, v] of cells || []) map.set(key(r, c), v);
    return map;
  }

  function displayValue(kind, row, col, value) {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'number') return String(value);
    if (Number.isInteger(value)) return String(value);

    // Các ô tỷ lệ ở phần lũy kế TH TS THEO ĐV được Excel lưu dưới dạng 0.x.
    if (kind === 'dv' && row >= 33 && [9,23,36,52,66,80,94,108,122,136,150,164].includes(col) && Math.abs(value) <= 1) {
      return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value * 100);
    }
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
  }

  function excelWidthToPx(width) {
    if (!width || width <= 0.2) return 2;
    return Math.max(18, Math.round(width * 6.2));
  }

  function pointToPx(pt) {
    return Math.max(16, Math.round((pt || 15) * 1.333));
  }

  function styleCell(kind, td, row, col, cfg) {
    td.dataset.row = row;
    td.dataset.col = col;
    if (cfg.titleRows.includes(row)) td.classList.add('source-title-row');
    if (cfg.headerRows.includes(row)) td.classList.add('source-header-row');
    if (cfg.totalRows.includes(row)) td.classList.add('source-total-row');
    if (cfg.groupRows.includes(row)) td.classList.add('source-group-row');
    if (cfg.verticalRows.includes(row) && col > 2) td.classList.add('source-vertical');

    if (kind === 'ph') {
      if (col === 168 && row >= 9) td.classList.add('source-green');
      if ([15,28,41,54,67,80,93,106,119,132,145,158,171].includes(col) && row >= 8) td.classList.add('source-total-col');
    }

    if (kind === 'dn') {
      if (col === 7 && row >= 7) td.classList.add('source-plan');
      if ([31,40,49,58,67,76,85,94,103,112,121,130,139,148,157,166,175,184,193,202,211,220,229,238,247,256,265].includes(col) && row >= 6) {
        td.classList.add('source-total-col');
      }
      if (col === 275 && row >= 7) td.classList.add('source-green');
      if (col === 276 && row >= 7) td.classList.add('source-plan');
      if (col === 277 && row >= 7) td.classList.add('source-red-total');
      if (col === 278 && row >= 7) td.classList.add('source-note');
    }

    if (kind === 'dv') {
      if ([174,176].includes(col) && row >= 7 && row <= 27) td.classList.add('source-green');
      if ([177,178,181,182,183,185,186,188,189].includes(col) && row >= 7 && row <= 27) td.classList.add('source-plan');
      if (col >= 190 && col <= 204 && row >= 5 && row <= 27) td.classList.add('source-current');
      if (col === 202 && row >= 5 && row <= 27) td.classList.add('source-green');
      if (col === 204 && row >= 5 && row <= 27) td.classList.add('source-red-total');
      if (row === 28) td.classList.add('source-note-row');
      if (row >= 31) td.classList.add('source-luyke');
    }
  }

  function renderSheet(kind, template) {
    const cfg = CONFIG[kind];
    const values = cellMap(template.cells);
    const { anchors, covered } = mergeIndex(template.merges);
    const table = document.createElement('table');
    table.className = `excel-sheet sheet-${kind}`;
    table.setAttribute('aria-label', template.name || cfg.title);

    const colgroup = document.createElement('colgroup');
    for (let c = 1; c <= template.cols; c++) {
      const col = document.createElement('col');
      col.style.width = `${excelWidthToPx(template.colWidths?.[c - 1])}px`;
      colgroup.appendChild(col);
    }
    table.appendChild(colgroup);

    const tbody = document.createElement('tbody');
    for (let r = 1; r <= template.rows; r++) {
      const tr = document.createElement('tr');
      tr.style.height = `${pointToPx(template.rowHeights?.[r - 1])}px`;
      for (let c = 1; c <= template.cols; c++) {
        const k = key(r, c);
        if (covered.has(k)) continue;
        const td = document.createElement('td');
        const merge = anchors.get(k);
        if (merge) {
          if (merge.rowspan > 1) td.rowSpan = merge.rowspan;
          if (merge.colspan > 1) td.colSpan = merge.colspan;
        }
        const value = values.has(k) ? values.get(k) : '';
        td.textContent = displayValue(kind, r, c, value);
        styleCell(kind, td, r, c, cfg);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    host.replaceChildren(table);
    host.scrollTop = 0;
    host.scrollLeft = 0;
  }

  async function show(kind) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.sheet === kind));
    host.innerHTML = `<div class="loading">Đang tải biểu ${CONFIG[kind].title}…</div>`;
    try {
      renderSheet(kind, await loadTemplate(kind));
    } catch (err) {
      console.error(err);
      host.innerHTML = '<div class="loading error">Không tải được cấu trúc biểu.</div>';
    }
  }

  tabs.forEach(btn => btn.addEventListener('click', () => show(btn.dataset.sheet)));
  show('ph');
})();
