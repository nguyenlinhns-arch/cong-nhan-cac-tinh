(() => {
  const state = { reports:null, meta:null, details:null, active:'dv' };
  const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
  const configs = {
    dv:   { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO ĐƠN VỊ NĂM 2026', note:'Quý 3/2026 · Tháng 8/2026 · Mốc nền 31/07/2026', heads:[4,5,6,7], from:8,  to:26 },
    ph:   { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH HỆ A THEO PHÂN HIỆU/TRUNG TÂM NĂM 2026', note:'Quý 3/2026 · Tháng 8/2026', heads:[6,7,8], from:9,  to:15 },
    dn:   { title:'TỔNG HỢP KẾT QUẢ TUYỂN SINH THEO DOANH NGHIỆP NĂM 2026', note:'Tháng 08/2026 · Đếm trực tiếp từ DSHS Tổng', heads:[3,4,5], from:6,  to:29 },
    tinh: { title:'TỔNG HỢP KẾT QUẢ NHẬP HỌC SINH HỆ A TRONG TỈNH NĂM 2026', note:'Theo phường/xã · Tự động cộng DSHS đến ngày mới nhất', heads:[5], from:7, to:59 },
    qc:   { title:'TỔNG HỢP KẾT QUẢ TUYỂN SINH HỌC SINH KÝ QUY CHẾ', note:'Đối chiếu địa bàn ký quy chế từ DSHS đến ngày mới nhất', heads:[4], from:41, to:69 }
  };
  function toneClass(key,col) {
    const maps = {
      dv:{ green:[9,17,18,27], yellow:[19], peach:[11,20,21,22,23,24,25,28] },
      ph:{ green:[22] },
      dn:{ blue:[4], green:[33], peach:[3,7,10,13,16,19,22,25,28,31,32,34] },
      tinh:{}, qc:{}
    };
    const m=maps[key]||{};
    for (const tone of ['green','yellow','peach','blue']) if ((m[tone]||[]).includes(col)) return 'tone-'+tone;
    return '';
  }
  function mergedHeader(row,width,key) {
    const cells=Array.from({length:width},(_,i)=>row[i]??'');
    const out=[]; let i=0;
    while(i<width) {
      let next=i+1;
      while(next<width && String(cells[next]).trim()==='') next++;
      out.push(`<th class="${toneClass(key,i+1)}" colspan="${next-i}">${esc(cells[i])}</th>`);
      i=next;
    }
    return `<tr>${out.join('')}</tr>`;
  }
  const fmtDate = d => new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
  const todayLabel = () => fmtDate(new Date());
  const DV_HIDDEN_COLUMNS = new Set([11,12,13,14,15]);
  const visibleColumns = (key,width) => Array.from({length:width},(_,i)=>i).filter(i=>key!=='dv'||!DV_HIDDEN_COLUMNS.has(i));
  function dvHeader() {
    const now=new Date();
    const prior=new Date(now); prior.setFullYear(now.getFullYear()-1);
    const today=todayLabel(), priorLabel=fmtDate(prior);
    return `<tr>
      <th rowspan="4" class="dv-tt">TT</th><th rowspan="4" class="dv-unit">ĐƠN VỊ TUYỂN SINH</th>
      <th colspan="9">Quý 3.2026</th><th colspan="7" rowspan="2">Tổng nhập đến ngày hôm nay<br>${today}</th>
      <th colspan="2" rowspan="2">Tổng nhập hệ A cùng kỳ<br>đến ${priorLabel}</th>
      <th rowspan="4">So sánh<br>kết quả tuyển HS TKV<br>năm 2026 với cùng ngày<br>năm 2025</th>
      <th rowspan="4" class="head-green red">Số học sinh<br>tái tuyển<br>2026</th>
      <th rowspan="4" class="head-peach red">Tổng số nhập<br>bao gồm cả<br>tái tuyển</th>
    </tr>
    <tr><th colspan="9">Tháng 8/2026</th></tr>
    <tr>
      <th colspan="6">Hệ A - TKV</th><th colspan="2">Cộng hệ A TKV</th>
      <th rowspan="2" class="head-peach">Cộng hệ A TKV<br>- Quý</th>
      <th colspan="2" class="head-green">Số HS còn lại trong đó</th>
      <th rowspan="2" class="head-yellow">CỘNG HỆ A<br>TKV</th>
      <th rowspan="2" class="head-peach">Học sinh<br>xóa tên đến<br>${today}</th>
      <th rowspan="2" class="head-peach">Số học sinh<br>còn lại</th>
      <th rowspan="2" class="head-peach">KH điều hành<br>TKV năm<br>2026</th>
      <th rowspan="2" class="head-peach">Tỷ lệ hoàn<br>thành TKV (%)</th>
      <th rowspan="2" class="head-peach">TKV</th><th rowspan="2" class="head-peach">Tổng</th>
    </tr>
    <tr>
      <th>TCN<br>Khai thác</th><th>Sơ cấp<br>khai thác</th><th>TC CĐ<br>liên thông</th>
      <th>SCN<br>XDM</th><th>VHTBĐ</th><th>Cơ điện<br>lò</th>
      <th class="head-green">Trường<br>tuyển</th><th>DN<br>tuyển</th>
      <th class="head-green">Trường tuyển</th><th class="head-green">DN tuyển</th>
    </tr>`;
  }
  const norm = v => String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/\s+/g,' ').trim().toLowerCase();
  const findByName = (rows,name) => (rows||[]).find(r=>norm(r.name)===norm(name));
  const nval = v => { if (typeof v==='number') return Number.isFinite(v)?v:0; const s=String(v??'').trim().replace(/\s/g,'').replace(/\./g,'').replace(',','.'); const n=Number(s); return Number.isFinite(n)?n:0; };
  const isDnRecruitUnit = name => /^phong tsdn[123](?:\s|$)/.test(norm(name));
  function overlayDvRow(row,x) {
    if (!x) return;
    const aug=x.aug||[];
    const dnRecruit=isDnRecruitUnit(row[1]);
    const monthTotal=nval(aug[7]);
    const quarterBase=nval(row[10]);
    row[2]=0; row[3]=nval(aug[0]); row[4]=nval(aug[1]); row[5]=nval(aug[2]); row[6]=nval(aug[3]); row[7]=nval(aug[4]);
    row[8]=dnRecruit?0:monthTotal; row[9]=dnRecruit?monthTotal:0; row[10]=quarterBase+monthTotal;
    const currentTotal=nval(x.current_a_total), inactive=nval(x.current_a_inactive), active=nval(x.current_a_active);
    row[16]=dnRecruit?0:active; row[17]=dnRecruit?active:0; row[18]=currentTotal; row[19]=inactive; row[20]=active;
    const plan=nval(row[21]); if (plan>0) row[22]=active/plan*100;
    const prior=nval(row[23]); if (prior>0) row[25]=active/prior*100;
    row[27]=active+nval(row[26]);
  }
  function overlayDv(baseRows,details) {
    const rows=baseRows||[], body=rows.slice(8,26);
    body.forEach(row=>overlayDvRow(row,findByName(details?.rows,row[1])));
    if (rows[26] && details?.total) {
      const x=details.total, aug=x.aug||[], quarterBase=nval(rows[26][10]);
      rows[26][2]=0; rows[26][3]=nval(aug[0]); rows[26][4]=nval(aug[1]); rows[26][5]=nval(aug[2]); rows[26][6]=nval(aug[3]); rows[26][7]=nval(aug[4]);
      rows[26][8]=body.reduce((s,r)=>s+nval(r[8]),0); rows[26][9]=body.reduce((s,r)=>s+nval(r[9]),0); rows[26][10]=quarterBase+nval(aug[7]);
      rows[26][16]=body.reduce((s,r)=>s+nval(r[16]),0); rows[26][17]=body.reduce((s,r)=>s+nval(r[17]),0);
      rows[26][18]=nval(x.current_a_total); rows[26][19]=nval(x.current_a_inactive); rows[26][20]=nval(x.current_a_active);
      const plan=nval(rows[26][21]); if (plan>0) rows[26][22]=rows[26][20]/plan*100;
      const prior=nval(rows[26][23]); if (prior>0) rows[26][25]=rows[26][20]/prior*100;
      rows[26][27]=rows[26][20]+nval(rows[26][26]);
    }
  }
  function overlayPh(rows,details) {
    if (!rows?.length || !details) return;
    if (rows[7]) rows[7][2]='Tháng 8/2026';
    rows.slice(9,15).forEach(row=>{ const x=findByName(details.rows,row[1]); if (!x) return; (x.month||[]).forEach((v,i)=>row[2+i]=v); (x.current||[]).forEach((v,i)=>{ if (v!==null && v!==undefined) row[15+i]=v; }); });
    if (rows[15] && details.total) { (details.total.month||[]).forEach((v,i)=>rows[15][2+i]=v); (details.total.current||[]).forEach((v,i)=>{ if (v!==null && v!==undefined) rows[15][15+i]=v; }); }
  }
  function overlayDn(rows,details,meta) {
    if (!rows?.length || !details) return;
    if (rows[3]) { rows[3][4]='Tháng 08/2026'; const latest=meta?.summary?.latest_admission_date||''; rows[3]=rows[3].map(v=>typeof v==='string'?v.replace(/31\s*tháng\s*7\s*năm\s*2026/gi,latest).replace(/31\/7\/2026/g,latest):v); }
    const apply=(row,x)=>{ if (!row||!x) return; (x.aug||[]).forEach((v,i)=>row[4+i]=v); (x.current||[]).forEach((v,i)=>row[13+i]=v); row[28]=[13,16,19,22,25].reduce((s,i)=>s+nval(row[i]),0); row[29]=[14,17,20,23,26].reduce((s,i)=>s+nval(row[i]),0); row[30]=[15,18,21,24,27].reduce((s,i)=>s+nval(row[i]),0); row[33]=row[30]+nval(row[32]); };
    rows.slice(6,29).forEach(row=>apply(row,findByName(details.rows,row[1]))); if (rows[29] && details.total) apply(rows[29],details.total);
  }
  function overlayLive(base,details,meta) { const out=JSON.parse(JSON.stringify(base||{})); if (!details) return out; overlayDv(out.dv,details.dv); overlayPh(out.ph,details.ph); overlayDn(out.dn,details.dn,meta); return out; }
  function reportStatus() {
    const s=state.meta?.summary||{}, latest=s.latest_admission_date||state.details?.snapshot_date||'--/--/----', generated=state.meta?.generated_at||'';
    return `<div class="report-status"><b>BÁO CÁO NGÀY HÔM NAY: ${esc(todayLabel())}</b><span>Số liệu cập nhật đến: <b>${esc(latest)}</b></span><span>Nhập học hôm nay: <b>${esc(s.today_count??0)}</b></span><span>Còn học: <b>${esc(s.active_records??'—')}</b></span><span>Bỏ học: <b>${esc(s.inactive_records??'—')}</b></span>${generated?`<small>Đồng bộ DSHS: ${esc(generated)}</small>`:''}</div>`;
  }
  function displayValue(key,col,value) { if (key==='dv' && [23,26].includes(col)) { const n=Number(value); return Number.isFinite(n)?n.toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1}):value; } return value; }
  const pad2=n=>String(Math.max(0,nval(n))).padStart(2,'0');
  function renderReport(key) {
    const rows=state.reports?.[key]||[], cfg=configs[key], rawWidth=Math.max(1,...rows.map(r=>r.length)), visible=visibleColumns(key,rawWidth);
    const heads=key==='dv'?dvHeader():cfg.heads.map(idx=>mergedHeader(rows[idx]||[],rawWidth,key)).join('');
    const body=rows.slice(cfg.from,cfg.to+1).filter(r=>r.some(v=>String(v??'').trim()!=='')).map(r=>{
      const first=String(r[0]??'').trim().toUpperCase();
      const section=first==='I'||first==='II'||first.includes('TỔNG')||String(r[1]??'').toUpperCase().includes('KÝ QC');
      const flagged=key==='dv' && /KT-NV|PHÒNG TSĐB$/.test(String(r[1]??'').trim().toUpperCase());
      const cells=visible.map(i=>({value:r[i]??'',sourceIndex:i}));
      return `<tr class="${section?'summary-row ':''}${flagged?'flagged-row':''}">${cells.map(c=>`<td class="col-${c.sourceIndex+1} ${toneClass(key,c.sourceIndex+1)}">${esc(displayValue(key,c.sourceIndex+1,c.value))}</td>`).join('')}</tr>`;
    }).join('');
    const identityWidths={dv:['w-tt','w-unit'],ph:['w-tt','w-name-ph'],dn:['w-tt','w-name-dn'],tinh:['w-tt','w-name-tinh'],qc:['w-tt','w-name-qc']}, widths=identityWidths[key];
    const colgroup='<colgroup><col class="'+widths[0]+'"><col class="'+widths[1]+'">'+Array.from({length:Math.max(0,visible.length-2)},()=>'<col>').join('')+'</colgroup>';
    const s=state.meta?.summary||{}, liveDv=state.details?.dv||{}, detailsFresh=String(state.details?.snapshot_date||'')===todayLabel();
    const campusMap=detailsFresh?Object.fromEntries((liveDv.today_by_campus||[]).map(x=>[x.campus,nval(x.count)])):{}, dropoutMap=detailsFresh?Object.fromEntries((liveDv.dropout_today_by_campus||[]).map(x=>[x.campus,nval(x.count)])):{};
    const todayTotal=nval(s.today_count??liveDv.today_total??0), dropoutToday=detailsFresh?nval(liveDv.dropout_today_total??0):0, dropoutMonth=detailsFresh?nval(liveDv.dropout_month_total??0):0;
    const summaryNote=`Nhập học ngày ${todayLabel()}: ${pad2(todayTotal)} học sinh. Bỏ học trong ngày: ${pad2(dropoutToday)} học sinh. Bỏ học lũy kế tháng 8: ${pad2(dropoutMonth)} học sinh`, progressRows=detailsFresh?(liveDv.progress||[]):[], cell=(map,k)=>detailsFresh?esc(map[k]??0):'…';
    const dvExtra=key==='dv'?`<div class="dv-note">${esc(summaryNote)}</div><table class="dv-campus"><tr><th>Nội dung</th><th>PHHN</th><th>PHCP</th><th>TTHC</th><th>PHVB</th><th>PHHB</th><th>Tổng</th></tr><tr><th>Nhập học trong ngày</th><td>${cell(campusMap,'PHHN')}</td><td>${cell(campusMap,'PHCP')}</td><td>${cell(campusMap,'TTHC')}</td><td>${cell(campusMap,'PHVB')}</td><td>${cell(campusMap,'PHHB')}</td><td><b>${esc(todayTotal)}</b></td></tr><tr><th>Bỏ học trong ngày</th><td>${cell(dropoutMap,'PHHN')}</td><td>${cell(dropoutMap,'PHCP')}</td><td>${cell(dropoutMap,'TTHC')}</td><td>${cell(dropoutMap,'PHVB')}</td><td>${cell(dropoutMap,'PHHB')}</td><td><b>${esc(dropoutToday)}</b></td></tr></table>${detailsFresh?`<div class="progress-title">Lũy kế kết quả thực hiện đến thời điểm báo cáo</div><div class="progress-wrap"><table class="dv-progress"><thead><tr><th>Nội dung</th><th>Kế hoạch 2026</th><th>Kết quả thực hiện</th><th>Tỷ lệ hoàn thành (%)</th></tr></thead><tbody>${progressRows.map(x=>`<tr><td>${esc(x.label)}</td><td>${esc(x.plan)}</td><td>${esc(x.actual)}</td><td>${esc(Number(x.pct).toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1}))}</td></tr>`).join('')}</tbody></table>${liveDv.progress_note?`<div class="progress-notes"><div>${esc(liveDv.progress_note)}</div></div>`:''}</div>`:`<div class="dv-sync-wait">Đang đồng bộ dữ liệu chi tiết DSHS mới nhất; không hiển thị snapshot cũ.</div>`}`:'';
    const dnWarn=key==='dn' && nval(state.details?.dn?.unclassified_company_records)>0?`<div class="source-note">Có <b>${esc(state.details.dn.unclassified_company_records)}</b> hồ sơ Master chưa có mã doanh nghiệp chuẩn nên chưa phân bổ vào dòng doanh nghiệp; hệ thống không tự đoán.</div>`:'';
    return `<article class="dashboard-card report-${key}"><div class="dashboard-title"><h2>${esc(cfg.title)}</h2><p>${esc(cfg.note)}</p></div>${reportStatus()}<div class="native-table-wrap"><table class="native-report">${colgroup}<thead>${heads}</thead><tbody>${body}</tbody></table></div>${dvExtra}${dnWarn}<div class="source-note">Nguồn số liệu: DSHS Nhập học tổng năm 2026 · Đếm trực tiếp từ nguồn chuẩn · Mốc nền 31/07/2026</div></article>`;
  }
  function render(){ document.getElementById('reportContent').innerHTML=renderReport(state.active); }
  async function load() {
    try { const stamp=Date.now(); const [rBase,rMeta,rDetails]=await Promise.all([fetch(`./report-extra.json?v=${stamp}`,{cache:'no-store'}),fetch(`./data.json?v=${stamp}`,{cache:'no-store'}),fetch(`./report-details.json?v=${stamp}`,{cache:'no-store'})]); if (!rBase.ok||!rMeta.ok||!rDetails.ok) throw new Error(`${rBase.status}/${rMeta.status}/${rDetails.status}`); const [base,meta,details]=await Promise.all([rBase.json(),rMeta.json(),rDetails.json()]); state.meta=meta; state.details=details; state.reports=overlayLive(base,details,meta); render(); }
    catch(e) { console.error(e); document.getElementById('reportContent').innerHTML='<div class="loading-cell error-cell">Không tải được dữ liệu báo cáo.</div>'; }
  }
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b===btn)); state.active=btn.dataset.report; if (state.reports) render(); }));
  load(); setInterval(load,60*1000);
})();
