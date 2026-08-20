(() => {
  const state = { reports: null, meta: null, details: null, active: 'dv' };
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
  const configs = {
    dv: { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO ĐƠN VỊ NĂM 2026', note:'Quý 3/2026 · Tháng 8/2026 · Số nền đến 31/07/2026', heads:[4,5,6,7], from:8, to:26 },
    ph: { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO PHÂN HIỆU/TRUNG TÂM NĂM 2026', note:'Quý 3/2026 · Tháng 8/2026', heads:[6,7,8], from:9, to:15 },
    dn: { title:'TỔNG HỢP KẾT QUẢ TUYỂN SINH THEO DOANH NGHIỆP NĂM 2026', note:'Tháng 08/2026 · Cộng trên số nền đến 31/07/2026', heads:[3,4,5], from:6, to:29 },
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
    <tr><th colspan="14">Tháng 8/2026</th></tr>
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
  const norm = v => String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/\s+/g,' ').trim().toLowerCase();
  const findByName = (rows,name) => (rows||[]).find(r=>norm(r.name)===norm(name));
  function overlayLive(base, details, meta) {
    const out=JSON.parse(JSON.stringify(base));
    if (!details) return out;
    const dv=out.dv||[], ph=out.ph||[], dn=out.dn||[];
    dv.slice(8,26).forEach(row=>{const x=findByName(details.dv?.rows,row[1]);if(x){x.aug.forEach((v,i)=>row[2+i]=v);x.current.forEach((v,i)=>row[16+i]=v)}});
    if(details.dv?.total){details.dv.total.aug.forEach((v,i)=>dv[26][2+i]=v);details.dv.total.current.forEach((v,i)=>dv[26][16+i]=v)}
    if(ph[7]) ph[7][2]='Tháng 8/2026';
    ph.slice(9,15).forEach(row=>{const x=findByName(details.ph?.rows,row[1]);if(x){x.month.forEach((v,i)=>row[2+i]=v);row[14]=(x.month[9]||0)+(x.month[10]||0)+(x.month[11]||0);[0,1,2,3,4,5,9,10,11].forEach((src,i)=>row[15+i]=x.current[src]||0)}});
    if(details.ph?.total){const x=details.ph.total;x.month.forEach((v,i)=>ph[15][2+i]=v);ph[15][14]=(x.month[9]||0)+(x.month[10]||0)+(x.month[11]||0);[0,1,2,3,4,5,9,10,11].forEach((src,i)=>ph[15][15+i]=x.current[src]||0)}
    if(dn[3]) dn[3][4]='Tháng 08/2026';
    const putDn=(row,x)=>{row[2]=x.contract??row[2];row[3]=x.target??row[3];x.aug.forEach((v,i)=>row[4+i]=v);x.current.slice(0,3).forEach((v,i)=>row[13+i]=v);[0,0,0].forEach((v,i)=>row[16+i]=v);x.current.slice(3).forEach((v,i)=>row[19+i]=v);x.overall.forEach((v,i)=>row[28+i]=v);row[31]=x.same2025??'';row[32]=x.retuyen??0;row[33]=x.grand??0};
    dn.slice(6,29).forEach(row=>{const x=findByName(details.dn?.rows,row[1]);if(x)putDn(row,x)});
    if(details.dn?.total)putDn(dn[29],details.dn.total);
    return out;
  }
  function reportStatus() {
    const s=state.meta?.summary||{};
    const today=new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date());
    const latest=s.latest_admission_date||state.details?.snapshot_date||'--/--/----';
    const generated=state.meta?.generated_at||'';
    return `<div class="report-status"><b>BÁO CÁO NGÀY HÔM NAY: ${esc(today)}</b><span>Số liệu cập nhật đến: <b>${esc(latest)}</b></span><span>Nhập học hôm nay: <b>${esc(s.today_count??0)}</b></span><span>Còn học: <b>${esc(s.active_records??'—')}</b></span><span>Bỏ học: <b>${esc(s.inactive_records??'—')}</b></span>${generated?`<small>Đồng bộ: ${esc(generated)}</small>`:''}</div>`;
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
    const liveDv=state.details?.dv;
    const campusMap=Object.fromEntries((liveDv?.today_by_campus||[]).map(x=>[x.campus,x.count]));
    const progressRows=liveDv?.progress||[];
    const dvExtra=key==='dv' ? `<div class="dv-note">${esc(liveDv?.note||rows[27]?.[1]||'')}</div>
      <table class="dv-campus"><tr><th rowspan="2">Trong đó nhập tại</th><th>PHHN</th><th>PHCP</th><th>TTHC</th><th>PHVB</th><th>PHHB</th><th>Tổng nhập</th></tr>
      <tr><td>${esc(campusMap.PHHN??0)}</td><td>${esc(campusMap.PHCP??0)}</td><td>${esc(campusMap.TTHC??0)}</td><td>${esc(campusMap.PHVB??0)}</td><td>${esc(campusMap.PHHB??0)}</td><td><b>${esc(liveDv?.today_total??0)}</b></td></tr></table>
      <div class="progress-title">Lũy kế kết quả thực hiện đến thời điểm báo cáo</div>
      <div class="progress-wrap"><table class="dv-progress"><thead><tr><th>Nội dung</th><th>Kế hoạch 2026</th><th>Kết quả thực hiện</th><th>Tỷ lệ hoàn thành (%)</th></tr></thead><tbody>
      ${progressRows.map(x=>`<tr><td>${esc(x.label)}</td><td>${esc(x.plan)}</td><td>${esc(x.actual)}</td><td>${esc(Number(x.pct).toLocaleString('vi-VN',{maximumFractionDigits:2}))}</td></tr>`).join('')}</tbody></table>
      <div class="progress-notes"><div>Đã bao gồm HS Tái tuyển</div><div>Đã bao gồm HS Tái tuyển</div></div></div>` : '';
    return `<article class="dashboard-card report-${key}">
      <div class="dashboard-title"><h2>${esc(cfg.title)}</h2><p>${esc(cfg.note)}</p></div>${reportStatus()}
      <div class="native-table-wrap"><table class="native-report">${colgroup}<thead>${heads}</thead><tbody>${body}</tbody></table></div>${dvExtra}
      <div class="source-note">Nguồn số liệu: DSHS Nhập học tổng năm 2026 · Tự động cộng phát sinh từ 01/08/2026</div>
    </article>`;
  }
  function render(){document.getElementById('reportContent').innerHTML=renderReport(state.active)}
  async function load(){
    try{
      const stamp=Date.now();
      const [rBase,rMeta,rDetails]=await Promise.all([
        fetch(`./report-extra.json?v=${stamp}`,{cache:'no-store'}),
        fetch(`./data.json?v=${stamp}`,{cache:'no-store'}),
        fetch(`./report-details.json?v=${stamp}`,{cache:'no-store'})
      ]);
      if(!rBase.ok||!rMeta.ok||!rDetails.ok) throw new Error(`${rBase.status}/${rMeta.status}/${rDetails.status}`);
      const [base,meta,details]=await Promise.all([rBase.json(),rMeta.json(),rDetails.json()]);
      state.meta=meta;state.details=details;state.reports=overlayLive(base,details,meta);render();
    }catch(e){console.error(e);document.getElementById('reportContent').innerHTML='<div class="loading-cell error-cell">Không tải được dữ liệu báo cáo.</div>'}
  }
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b===btn));
    state.active=btn.dataset.report; if(state.reports) render();
  }));
  load(); setInterval(load,5*60*1000);
})();