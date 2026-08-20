(() => {
  let data = null;
  const fmtDate = d => new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
  const isFresh = () => String(data?.snapshot_date || '') === fmtDate(new Date());
  const setCell = (row, idx, value) => {
    const cell = row?.cells?.[idx];
    if (!cell) return;
    const next = String(value ?? 0);
    if (cell.textContent !== next) cell.textContent = next;
  };
  const setNote = (card, text) => {
    if (!card) return;
    let note = card.querySelector('.location-audit-note');
    if (!note) {
      note = document.createElement('div');
      note.className = 'source-note location-audit-note';
      const wrap = card.querySelector('.native-table-wrap');
      if (wrap) wrap.insertAdjacentElement('afterend', note);
      else card.appendChild(note);
    }
    if (note.textContent !== text) note.textContent = text;
  };
  function applyTinh() {
    const card = document.querySelector('.report-tinh');
    const table = card?.querySelector('.native-report');
    if (!table?.tBodies?.[0]) return;
    const rows = [...table.tBodies[0].rows];
    const src = data?.tinh?.rows || [];
    if (!isFresh()) {
      rows.slice(0,53).forEach(row => { for (let i=3;i<=11;i++) setCell(row,i,'…'); });
      setNote(card, 'Đang đồng bộ số đếm DSHS Tổng của ngày hôm nay; không hiển thị số mẫu cũ.');
      return;
    }
    src.forEach((item,i) => {
      const row = rows[i];
      if (!row) return;
      (item.months || []).forEach((v,m) => setCell(row,3+m,v));
      setCell(row,11,item.total);
    });
    const missing = Number(data?.tinh?.unclassified_records || 0);
    if (missing > 0) {
      setNote(card, `Đếm trực tiếp DSHS Tổng: đã phân bổ ${data.tinh.mapped_total}/${data.tinh.direct_total} hồ sơ Hệ A Quảng Ninh vào 53 địa bàn; ${missing} hồ sơ thiếu/không hợp lệ xã-phường nên hệ thống không tự đoán.`);
    } else {
      setNote(card, `Đếm trực tiếp DSHS Tổng: ${data?.tinh?.mapped_total || 0} hồ sơ đã được phân bổ đầy đủ theo địa bàn.`);
    }
  }
  function applyQc() {
    const card = document.querySelector('.report-qc');
    const table = card?.querySelector('.native-report');
    if (!table?.tBodies?.[0]) return;
    const rows = [...table.tBodies[0].rows];
    const src = data?.qc?.rows || [];
    if (!isFresh()) {
      rows.slice(0,29).forEach(row => { for (let i=5;i<=13;i++) setCell(row,i,'…'); });
      setNote(card, 'Đang đồng bộ số đếm DSHS Tổng của ngày hôm nay; không hiển thị số mẫu cũ.');
      return;
    }
    src.forEach((item,i) => {
      const row = rows[i];
      if (!row) return;
      (item.months || []).forEach((v,m) => setCell(row,5+m,v));
      setCell(row,13,item.total);
    });
    setNote(card, `Đếm trực tiếp DSHS Tổng theo 29 địa bàn ký quy chế đang hiển thị: ${data?.qc?.total || 0} lượt nhập học từ tháng 1 đến tháng 8/2026.`);
  }
  function apply() {
    if (!data) return;
    applyTinh();
    applyQc();
  }
  async function load() {
    try {
      const r = await fetch(`./location-counts.json?v=${Date.now()}`, {cache:'no-store'});
      if (!r.ok) throw new Error(String(r.status));
      data = await r.json();
      apply();
    } catch (e) {
      console.error('Không tải được location-counts.json', e);
    }
  }
  const root = document.getElementById('reportContent');
  if (root) new MutationObserver(() => apply()).observe(root,{childList:true,subtree:true});
  load();
  setInterval(load,60*1000);
})();
