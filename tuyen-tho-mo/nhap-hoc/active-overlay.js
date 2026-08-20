(() => {
  let activeData = null;
  const norm = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/\s+/g,' ').trim().toLowerCase();
  const dnCodes = new Set(['TSDN1','TSDN2','TSDN3']);
  const byName = () => new Map((activeData?.rows || []).map(x => [norm(x.name), x]));
  function setCell(row, idx, value) {
    if (row?.cells?.[idx]) row.cells[idx].textContent = String(value ?? 0);
  }
  function apply() {
    if (!activeData) return;
    const table = document.querySelector('.report-dv .native-report');
    if (!table?.tBodies?.[0]) return;
    const nameMap = byName();
    [...table.tBodies[0].rows].forEach(row => {
      const first = String(row.cells[0]?.textContent || '').trim().toUpperCase();
      const name = String(row.cells[1]?.textContent || '').trim();
      const item = first.includes('TỔNG') ? activeData.total : nameMap.get(norm(name));
      if (!item) return;
      const code = item.code || '';
      const groups = [0, item.hsc, item.lt, item.xsc, item.vhtbd, item.electric];
      groups.forEach((v,i) => setCell(row, 2+i, v));
      const monthTotal = Number(item.total || 0);
      const dnRecruit = dnCodes.has(code);
      setCell(row, 8, dnRecruit ? 0 : monthTotal);
      setCell(row, 9, dnRecruit ? monthTotal : 0);
      setCell(row, 10, Number(item.q3_active_total || 0));
    });
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
  if (root) new MutationObserver(() => apply()).observe(root, {childList:true, subtree:true});
  load();
  setInterval(load, 60 * 1000);
})();
