(() => {
  const state = { reports: null, active: 'dv' };
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
  const configs = {
    dv: { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO ĐƠN VỊ NĂM 2026', note:'Quý 3/2026 · Tháng 7/2026 · Mốc số liệu 31/07/2026', heads:[4,5,6,7], from:8, to:26 },
    ph: { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO PHÂN HIỆU/TRUNG TÂM NĂM 2026', note:'Quý 3/2026 · Tháng 7/2026', heads:[6,7,8], from:9, to:15 },
    dn: { title:'TỔNG HỢP KẾT QUẢ TUYỂN SINH THEO DOANH NGHIỆP NĂM 2026', note:'Tháng 07/2026 · Tổng nhập đến 31/07/2026', heads:[3,4,5], from:6, to:29 },
    tinh: { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC SINH HỆ A TRONG TỈNH NĂM 2026', note:'Theo phường/xã và tháng nhập học', heads:[5], from:7, to:59 },
    qc: { title:'TỔNG HỢP KẾT QUẢ TUYỂN SINH HỌC SINH KÝ QUY CHẾ', note:'Các đơn vị ký quy chế phối hợp', heads:[4], from:41, to:69 }
  };
  function mergedHeader(row, width) {
    const cells = Array.from({length:width},(_,i)=>row[i]??'');
    const out=[]; let i=0;
    while(i<width){
      let next=i+1;
      while(next<width && String(cells[next]).trim()==='') next++;
      out.push(`<th colspan="${next-i}">${esc(cells[i])}</th>`);
      i=next;
    }
    return `<tr>${out.join('')}</tr>`;
  }
  function renderReport(key) {
    const rows=state.reports[key]||[], cfg=configs[key];
    const width=Math.max(1,...rows.map(r=>r.length));
    const heads=cfg.heads.map(idx=>mergedHeader(rows[idx]||[],width)).join('');
    const body=rows.slice(cfg.from,cfg.to+1).filter(r=>r.some(v=>String(v??'').trim()!=='')).map((r,ri)=>{
      const cells=Array.from({length:width},(_,i)=>r[i]??'');
      const first=String(cells[0]).trim().toUpperCase();
      const section=first==='I'||first==='II'||first.includes('TỔNG')||String(cells[1]).toUpperCase().includes('KÝ QC');
      return `<tr class="${section?'summary-row':''}">${cells.map((v,i)=>`<td class="col-${i+1}">${esc(v)}</td>`).join('')}</tr>`;
    }).join('');
    return `<article class="dashboard-card report-${key}">
      <div class="dashboard-title"><h2>${esc(cfg.title)}</h2><p>${esc(cfg.note)}</p></div>
      <div class="native-table-wrap"><table class="native-report"><thead>${heads}</thead><tbody>${body}</tbody></table></div>
      <div class="source-note">Nguồn số liệu: DSHS Nhập học tổng năm 2026 · Tự động cộng phát sinh từ 01/08/2026</div>
    </article>`;
  }
  function render(){document.getElementById('reportContent').innerHTML=renderReport(state.active)}
  async function load(){
    try{
      const r=await fetch(`./report-extra.json?v=${Date.now()}`,{cache:'no-store'});
      if(!r.ok) throw new Error(r.status);
      state.reports=await r.json(); render();
    }catch(e){console.error(e);document.getElementById('reportContent').innerHTML='<div class="loading-cell error-cell">Không tải được dữ liệu báo cáo.</div>'}
  }
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b===btn));
    state.active=btn.dataset.report; if(state.reports) render();
  }));
  load(); setInterval(load,5*60*1000);
})();