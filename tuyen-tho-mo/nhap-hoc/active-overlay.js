(() => {
  let activeData = null;
  const norm = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/\s+/g,' ').trim().toLowerCase();
  const fmtDate = d => new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
  const fresh = () => String(activeData?.snapshot_date || '') === fmtDate(new Date());
  const dnCodes = new Set(['TSDN1','TSDN2','TSDN3']);
  const byName = () => new Map((activeData?.rows || []).map(x => [norm(x.name), x]));
  function setCell(row, idx, value) {
    const cell = row?.cells?.[idx];
    if (!cell) return;
    const next = String(value ?? 0);
    if (cell.textContent !== next) cell.textContent = next;
  }
  function setStatus(text) {
    const card = document.querySelector('.report-dv');
    if (!card) return;
    let el = card.querySelector('.active-aug-status');
    if (!el) {
      el = document.createElement('div');
      el.className = 'source-note active-aug-status';
      const wrap = card.querySelector('.native-table-wrap');
      if (wrap) wrap.insertAdjacentElement('afterend', el);
    }
    if (el && el.textContent !== text) el.textContent = text;
  }
  function apply() {
    if (!activeData) return;
    const table = document.querySelector('.report-dv .native-report');
    if (!table?.tBodies?.[0]) return;
    const rows = [...table.tBodies[0].rows];
    if (!fresh()) {
      rows.forEach(row => { for (let i=2;i<=10;i++) setCell(row,i,'…'); });
      setStatus('Đang đồng bộ số học sinh còn học từ DSHS Tổng của ngày hôm nay; không hiển thị số tháng/quý cũ.');
      return;
    }
    const nameMap = byName();
    rows.forEach(row => {
      const first = String(row.cells[0]?.textContent || '').trim().toUpperCase();
      const name = String(row.cells[1]?.textContent || '').trim();
      const item = first.includes('TỔNG') ? activeData.total : nameMap.get(norm(name));
      if (!item) return;
      const code = item.code || '';
      const groups = [0, item.hsc, item.lt, item.xsc, item.vhtbd, item.electric];
      groups.forEach((v,i) => setCell(row,2+i,v));
      const monthTotal = Number(item.total || 0);
      const dnRecruit = dnCodes.has(code);
      setCell(row,8,dnRecruit ? 0 : monthTotal);
      setCell(row,9,dnRecruit ? monthTotal : 0);
      setCell(row,10,Number(item.q3_active_total || 0));
    });
    const total = Number(activeData?.total?.total || 0);
    setStatus(`Tháng 8/2026 chỉ tính học sinh hiện còn học từ DSHS Tổng: ${total} học sinh.`);
  }
  async function load() {
    try {
      const r = await fetch(`./active-aug.json?v=${Date.now()}`, {cache:'no-store'});
      if (!r.ok) throw new Error(String(r.status));
      activeData = await r.json();
      apply();
    } catch (e) {
      console.error('Không tải được active-aug.json', e);
    }
  }
  const root = document.getElementById('reportContent');
  if (root) new MutationObserver(() => apply()).observe(root,{childList:true,subtree:true});
  load();
  setInterval(load,60*1000);
})();
