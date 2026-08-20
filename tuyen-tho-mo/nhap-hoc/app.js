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
  function toneClass(key, col) {
    const maps = {
      dv: { green:[9,17,18,27], yellow:[19], peach:[11,20,21,22,23,24,25,28] },
      ph: { green:[22] },
      dn: { blue:[4], green:[33], peach:[3,7,10,13,16,19,22,25,28,31,32,34] },
      tinh: {},
      qc: {}
    };
    const m=maps[key]||{};
    for (const tone of ['green','yellow','peach','blue']) if ((m[tone]||[]).includes(col)) return 'tone-'+tone;
    return '';
  }
  function mergedHeader(row, width, key) {
    const cells = Array.from({length:width},(_,i)=>row[i]??'');
    const out=[]; let i=0;
    while(i<width){
      let next=i+1;
      while(next<width && String(cells[next]).trim()==='') next++;
      out.push(`<th class="${toneClass(key,i+1)}" colspan="${next-i}">${esc(cells[i])}</th>`);
      i=next;
    }
    return `<tr>${out.join('')}</tr>`;
  }
  function dvHeader() {
    return `<tr>
      <th rowspan="4" class="dv-tt">TT</th><th rowspan="4" class="dv-unit">ĐƠN VỊ TUYỂN SINH</th>
      <th colspan="14">Quý 3.2026</th><th colspan="7" rowspan="2">Tổng nhập đến 31/7/2026</th>
      <th colspan="2" rowspan="2">Tổng nhập hệ A<br>đến 31/7/2025</th>
      <th rowspan="4">So sánh<br>kết quả tuyển HS TKV<br>năm 2026 cùng kỳ<br>năm 2025</th>
      <th rowspan="4" class="head-green red">Số học sinh<br>tái tuyển<br>2026</th>
      <th rowspan="4" class="head-peach red">Tổng số nhập<br>bao gồm cả<br>tái tuyển</th>
    </tr>
    <tr><th colspan="14">Tháng 7/2026</th></tr>
    <tr>
      <th colspan="6">Hệ A - TKV</th><th colspan="2">Công hệ A TKV</th>
      <th rowspan="2" class="head-peach">Cộng hệ A<br>TKV</th><th colspan="3">Tổng ĐB</th>
      <th rowspan="2">Cộng hệ A<br>Đông Bắc</th><th rowspan="2">Hệ B -<br>TC + CĐ</th>
      <th colspan="2" class="head-green">Công hệ A TKV trong đó</th>
      <th rowspan="2" class="head-yellow">CỘNG HỆ A<br>TKV</th>
      <th rowspan="2" class="head-peach">Học sinh<br>xóa tên đến<br>31/7/2026</th>
      <th rowspan="2" class="head-peach">Số học sinh<br>còn lại</th>
      <th rowspan="2" class="head-peach">KH điều hành<br>TKV năm<br>2026</th>
      <th rowspan="2" class="head-peach">Tỷ lệ hoàn<br>thành TKV (%)</th>
      <th rowspan="2" class="head-peach">TKV</th><th rowspan="2" class="head-peach">Tổng</th>
    </tr>
    <tr>
      <th>TCN<br>Khai thác</th><th>Sơ cấp<br>khai thác</th><th>TC CĐ<br>liên thông</th>
      <th>SCN<br>XDM</th><th>VHTBĐ</th><th>Cơ điện<br>lò</th>
      <th class="head-green">Trường<br>tuyển</th><th>DN<br>tuyển</th>
      <th>TCKT</th><th>SCKT</th><th>Cơ điện<br>lò</th>
      <th class="head-green">Trường tuyển</th><th class="head-green">DN tuyển</th>
    </tr>`;
  }
  function renderReport(key) {
    const rows=state.reports[key]||[], cfg=configs[key];
    const width=Math.max(1,...rows.map(r=>r.length));
    const heads=key==='dv' ? dvHeader() : cfg.heads.map(idx=>mergedHeader(rows[idx]||[],width,key)).join('');
    const body=rows.slice(cfg.from,cfg.to+1).filter(r=>r.some(v=>String(v??'').trim()!=='')).map((r,ri)=>{
      const cells=Array.from({length:width},(_,i)=>r[i]??'');
      const first=String(cells[0]).trim().toUpperCase();
      const section=first==='I'||first==='II'||first.includes('TỔNG')||String(cells[1]).toUpperCase().includes('KÝ QC');
      const flagged=key==='dv' && /KT-NV|PHÒNG TSĐB$/.test(String(cells[1]).trim().toUpperCase());
      return `<tr class="${section?'summary-row ':''}${flagged?'flagged-row':''}">${cells.map((v,i)=>`<td class="col-${i+1} ${toneClass(key,i+1)}">${esc(v)}</td>`).join('')}</tr>`;
    }).join('');
    const identityWidths={dv:['w-tt','w-unit'],ph:['w-tt','w-name-ph'],dn:['w-tt','w-name-dn'],tinh:['w-tt','w-name-tinh'],qc:['w-tt','w-name-qc']};
    const widths=identityWidths[key];
    const colgroup='<colgroup><col class="'+widths[0]+'"><col class="'+widths[1]+'">'+Array.from({length:width-2},()=>'<col>').join('')+'</colgroup>';
    const dvExtra=key==='dv' ? `<div class="dv-note">${esc(rows[27]?.[1]||'')}</div>
      <table class="dv-campus"><tr><th rowspan="2">Trong đó nhập tại</th><th>PHHN</th><th>PHCP</th><th>TTHC</th><th>PHVB</th><th>PHHB</th><th>Tổng nhập</th></tr>
      <tr><td>${esc(rows[29]?.[2]||'')}</td><td>${esc(rows[29]?.[4]||'')}</td><td>${esc(rows[29]?.[6]||'')}</td><td>${esc(rows[29]?.[8]||'')}</td><td>${esc(rows[29]?.[10]||'')}</td><td><b>${esc(rows[29]?.[12]||'')}</b></td></tr></table>` : '';
    return `<article class="dashboard-card report-${key}">
      <div class="dashboard-title"><h2>${esc(cfg.title)}</h2><p>${esc(cfg.note)}</p></div>
      <div class="native-table-wrap"><table class="native-report">${colgroup}<thead>${heads}</thead><tbody>${body}</tbody></table></div>${dvExtra}
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