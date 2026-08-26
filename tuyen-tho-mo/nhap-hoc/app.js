(() => {
  const DATA_URL = './live-report.json';
  const state = { data: null, active: 'dv' };
  const root = document.getElementById('reportContent');
  const tabs = [...document.querySelectorAll('.tab-btn')];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const num = v => Number(v || 0);
  const fmt = v => Number(v).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
  const pct = v => v == null || v === '' ? '' : `${Number(v).toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1})}%`;
  const display = v => v == null || v === '' ? '' : (typeof v === 'number' ? fmt(v) : v);
  const cell = (v, cls='') => `<td class="${cls}">${esc(display(v))}</td>`;
  const th = (v, cls='', attrs='') => `<th class="${cls}" ${attrs}>${esc(v)}</th>`;
  const rowClass = i => i % 2 ? 'row-alt' : '';
  const blankZero = v => num(v) === 0 ? '' : num(v);
  const sum = (rows, key) => rows.reduce((a,r)=>a+num(r[key]),0);
  const reportMonth = () => Math.max(8, Math.min(12, Number(String(state.data?.snapshot_date||'').split('/')[1]) || 8));
  const netSinceBase = s => ['aug_net','sep_net','oct_net','nov_net','dec_net'].reduce((a,k)=>a+num(s?.[k]),0);

  function status(){
    const d=state.data,s=d.summary,net=netSinceBase(s);
    return `<div class="report-status"><b>BÁO CÁO NGÀY ${esc(d.snapshot_date)}</b><span>Gốc 31/07: <b>${fmt(s.base_3107)}</b></span><span>Biến động từ 01/08: <b>${net>=0?'+':''}${fmt(net)}</b></span><span>Hệ A hiện tại: <b>${fmt(s.system_total)}</b></span><span>Nhập học ngày ${esc(d.snapshot_date)}: <b>${fmt(s.today_count)}</b></span></div>`;
  }
  function note(){
    const gap=Math.max(0,num(state.data?.summary?.detail_gap));
    const reconciliation=gap?` <b>Đối soát:</b> ${fmt(gap)} HS TSĐB đã có trong biểu TH chuẩn nhưng chưa có dòng DSHS chi tiết; website hiển thị riêng phần chờ đồng bộ, không tự gán vào doanh nghiệp.`:'';
    return `<div class="source-note"><b>Nguồn:</b> Biểu TH KQ Nhập Học Năm 2026. Mốc 31/07/2026 được khóa làm gốc; từ 01/08 hệ thống tự cộng/trừ từng tháng từ DSHS NHẬP HỌC TỔNG. Website chỉ công khai số liệu tổng hợp, không công khai dữ liệu cá nhân học sinh.${reconciliation}</div>`;
  }
  function table(head,body,cls=''){return `<div class="native-table-wrap"><table class="native-report ${cls}"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;}
  function shell(title,subtitle,html,cls){root.className=`report-sheet report-${cls}`;root.innerHTML=`<div class="dashboard-card"><div class="dashboard-title"><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div>${status()}${html}${note()}</div>`;}

  function validateDvFeed(rows, extras){
    if (!Array.isArray(rows) || rows.length!==18 || !Array.isArray(extras) || extras.length !== rows.length) return false;
    const required=['hsc_aug','lt_aug','xsc_aug','vht_aug','electric_aug','school_aug','company_aug','aug_total','current_total','deleted','remaining','retakes','including_retakes'];
    return rows.every((r,i)=>required.every(k=>Object.prototype.hasOwnProperty.call(r,k)) && extras[i] && String(extras[i].name||'').trim()===String(r.name||'').trim());
  }

  function renderDv(){
    const rows=state.data.dv, extras=state.data.dv_extra, s=state.data.summary;
    if (!validateDvFeed(rows,extras)) { root.innerHTML='<div class="loading-cell">Dữ liệu theo đơn vị chưa đủ cấu phần để đối chiếu từng cột. Trang sẽ tự thử lại.</div>'; return; }
    const head = `<tr>${th('TT','','rowspan="3"')}${th('ĐƠN VỊ TUYỂN SINH','','rowspan="3"')}${th('Quý 3.2026','grp-q3','colspan="8"')}${th(`Tổng nhập đến ${state.data.snapshot_date}`,'grp-current','colspan="7"')}${th('Tổng nhập hệ A đến 31/7/2025','grp-prior','colspan="2"')}${th('So sánh kết quả tuyển HS TKV năm 2026 cùng kỳ năm 2025','grp-compare','rowspan="3"')}${th('Số học sinh tái tuyển 2026','grp-retake','rowspan="3"')}${th('Tổng số nhập bao gồm cả tái tuyển','grp-total','rowspan="3"')}</tr>
      <tr>${th('Tháng 8.2026','grp-q3','colspan="8"')}${th('Công hệ A TKV trong đó','grp-current','colspan="2"')}${th('CỘNG HỆ A TKV','grp-current','rowspan="2"')}${th('Học sinh xóa tên','grp-current','rowspan="2"')}${th('Số học sinh còn lại','grp-current','rowspan="2"')}${th('KH điều hành TKV năm 2026','grp-current','rowspan="2"')}${th('TỶ LỆ hoàn thành TKV (%)','grp-current','rowspan="2"')}${th('TKV','grp-prior','rowspan="2"')}${th('Tổng','grp-prior','rowspan="2"')}</tr>
      <tr>${['Sơ cấp khai thác','TC CĐ liên thông','SCN XDM','VHTBĐ','Cơ điện lò','Trường tuyển','DN tuyển','Cộng Hệ A TKV','Trường tuyển','DN tuyển'].map(x=>th(x)).join('')}</tr>`;
    const bodyRows=rows.map((r,i)=>{const e=extras[i];return `<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${cell(blankZero(r.hsc_aug))}${cell(blankZero(r.lt_aug))}${cell(blankZero(r.xsc_aug))}${cell(blankZero(r.vht_aug))}${cell(blankZero(r.electric_aug))}${cell(blankZero(r.school_aug))}${cell(blankZero(r.company_aug))}${cell(r.aug_total)}${cell(e.current_school)}${cell(e.current_company)}${cell(r.current_total)}${cell(r.deleted)}${cell(r.remaining)}${cell(r.plan)}${cell(r.pct == null ? '' : pct(r.pct))}${cell(e.prior_tkv)}${cell(e.prior_total)}${cell(e.yoy_pct == null ? '' : pct(e.yoy_pct))}${cell(r.retakes || '')}${cell(r.including_retakes || '-')}</tr>`;}).join('');
    const schoolNow=sum(extras,'current_school'),companyNow=sum(extras,'current_company'),priorTkv=extras.reduce((a,r)=>a+num(r.prior_tkv),0),priorTotal=extras.reduce((a,r)=>a+num(r.prior_total),0),plan=rows.reduce((a,r)=>a+num(r.plan),0);
    const totalRow=`<tr class="summary-row">${cell('')}${cell('TỔNG CỘNG NHẬP')}${cell(sum(rows,'hsc_aug'))}${cell(sum(rows,'lt_aug'))}${cell(sum(rows,'xsc_aug'))}${cell(sum(rows,'vht_aug'))}${cell(sum(rows,'electric_aug'))}${cell(sum(rows,'school_aug'))}${cell(sum(rows,'company_aug'))}${cell(s.aug_net)}${cell(schoolNow)}${cell(companyNow)}${cell(s.system_total)}${cell(s.deleted)}${cell(s.remaining)}${cell(plan)}${cell(pct(plan?s.remaining/plan*100:null))}${cell(priorTkv)}${cell(priorTotal)}${cell(pct(priorTotal?s.system_total/priorTotal*100:null))}${cell(s.retakes)}${cell(s.including_retakes)}</tr>`;
    shell('TỔNG HỢP THEO ĐƠN VỊ TUYỂN SINH',`Số liệu đến ${state.data.snapshot_date}`,table(head,bodyRows+totalRow,'dv-exact'),'dv');
  }

  function renderPh(){
    const sourceRows=state.data.ph, s=state.data.summary, rm=reportMonth();
    const detailGap=Math.max(0,num(s.detail_gap));
    const gapAug=Math.max(0,num(s.detail_gap_aug||detailGap));
    const gapHsc=Math.max(0,num(s.detail_gap_hsc||gapAug));
    const pending=detailGap?{
      name:'Chờ đồng bộ chi tiết (TSĐB)',
      month8:[0,gapHsc,0,0,0,0,0,0,0,gapAug,0,0],
      current:[0,gapHsc,0,0,0,0,0,0,0,detailGap,0,0,detailGap]
    }:null;
    const rows=pending?[...sourceRows,pending]:sourceRows;
    const future=Array.from({length:Math.max(0,rm-8)},(_,i)=>i+9);
    const headers=['TT','Phân hiệu / Trung tâm','T8 SC khai thác','T8 liên thông','T8 XDM','T8 cơ điện','T8 hệ A',...future.map(m=>`T${m} hệ A`),'Hiện tại SC khai thác','Hiện tại liên thông','Hiện tại XDM','Hiện tại cơ điện','Hệ A hiện tại','Hệ B','Tổng A+B'];
    const head=`<tr>${headers.map(x=>th(x)).join('')}</tr>`;
    const monthA=(r,m)=>num((r[`month${m}`]||[])[9]);
    const body=rows.map((r,i)=>`<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${cell(r.month8[1])}${cell(r.month8[2])}${cell(r.month8[3])}${cell(r.month8[5])}${cell(r.month8[9])}${future.map(m=>cell(monthA(r,m))).join('')}${cell(r.current[1])}${cell(r.current[2])}${cell(r.current[3])}${cell(r.current[5])}${cell(r.current[9])}${cell(r.current[11])}${cell(r.current[12])}</tr>`).join('');
    const sums=(key,i)=>rows.reduce((a,r)=>a+num((r[key]||[])[i]),0);
    const total=`<tr class="summary-row">${cell('')}${cell('TỔNG CỘNG')}${cell(sums('month8',1))}${cell(sums('month8',2))}${cell(sums('month8',3))}${cell(sums('month8',5))}${cell(sums('month8',9))}${future.map(m=>cell(sums(`month${m}`,9))).join('')}${cell(sums('current',1))}${cell(sums('current',2))}${cell(sums('current',3))}${cell(sums('current',5))}${cell(sums('current',9))}${cell(sums('current',11))}${cell(sums('current',12))}</tr>`;
    shell('TỔNG HỢP THEO PHÂN HIỆU / TRUNG TÂM',`Mốc 31/07/2026 + biến động đến ${state.data.snapshot_date}`,table(head,body+total),'ph');
  }

  function dnSubtotal(rows,label){const m=Array(9).fill(0);rows.forEach(r=>(r.month8||[]).forEach((v,i)=>m[i]+=num(v)));return `<tr class="summary-row">${cell('')}${cell(label)}${m.map(v=>cell(v)).join('')}${cell(rows.reduce((a,r)=>a+num(r.aug_total),0))}${cell(rows.reduce((a,r)=>a+num(r.current_total),0))}</tr>`;}
  function renderDn(){
    const sourceRows=state.data.dn||[], s=state.data.summary;
    const detailGap=Math.max(0,num(s.detail_gap));
    const gapAug=Math.max(0,num(s.detail_gap_aug||detailGap));
    const gapHsc=Math.max(0,num(s.detail_gap_hsc||gapAug));
    const pending=detailGap?{name:'Chưa phân doanh nghiệp (TSĐB)',group:'TKV',month8:[0,0,0,gapHsc,0,gapAug,0,0,0],aug_total:gapAug,current_total:detailGap}:null;
    const rows=pending?[...sourceRows,pending]:sourceRows, tkv=rows.filter(r=>r.group==='TKV'), db=rows.filter(r=>r.group==='DONG_BAC');
    const head=`<tr>${['TT','Doanh nghiệp','T8 CĐ - Trường','T8 CĐ - DN','T8 CĐ tổng','T8 SC - Trường','T8 SC - DN','T8 SC tổng','T8 LT - Trường','T8 LT - DN','T8 LT tổng','Cộng T8','Tổng hiện tại'].map(x=>th(x)).join('')}</tr>`;
    const makeRows=(arr,start=0)=>arr.map((r,i)=>`<tr class="${rowClass(i)}">${cell(start+i+1)}${cell(r.name)}${(r.month8||Array(9).fill(0)).map(v=>cell(v)).join('')}${cell(r.aug_total)}${cell(r.current_total)}</tr>`).join('');
    const body=makeRows(tkv)+dnSubtotal(tkv,'I / TỔNG TKV')+makeRows(db,tkv.length)+dnSubtotal(db,'II / ĐÔNG BẮC')+dnSubtotal(rows,'CỘNG TOÀN TRƯỜNG');
    shell('TỔNG HỢP THEO DOANH NGHIỆP',`Kết quả thực hiện đến ${state.data.snapshot_date}`,table(head,body),'dn');
  }

  function renderTinh(){
    const rows=state.data.tinh,s=state.data.summary,rm=reportMonth(),labels=Array.from({length:rm},(_,i)=>`T${i+1}`);
    const head=`<tr>${['TT','Phường/Xã','Địa bàn gộp',...labels,'Tổng','Ghi chú'].map(x=>th(x)).join('')}</tr>`;
    const body=rows.map((r,i)=>`<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${cell(r.areas)}${(r.months||[]).slice(0,rm).map(v=>cell(v)).join('')}${cell(r.total)}${cell(r.note)}</tr>`).join('');
    const ms=Array(rm).fill(0);rows.forEach(r=>(r.months||[]).slice(0,rm).forEach((v,i)=>ms[i]+=num(v)));
    const total=`<tr class="summary-row">${cell('')}${cell('TỔNG CỘNG')}${cell('')}${ms.map((v,i)=>cell(i===7?s.in_province_aug:v)).join('')}${cell(s.in_province_total)}${cell('')}</tr>`;
    shell('HỌC SINH HỆ A TRONG TỈNH',`Theo địa bàn Quảng Ninh · cập nhật đến ${state.data.snapshot_date}`,table(head,body+total),'tinh');
  }

  function renderQc(){
    const rows=state.data.qc,s=state.data.summary,rm=reportMonth(),labels=Array.from({length:rm},(_,i)=>`T${i+1}`);
    const head=`<tr>${['TT','Địa bàn ký quy chế','Đơn vị','KH/năm',...labels,'Tổng','Gắn với DN','Ghi chú'].map(x=>th(x)).join('')}</tr>`;
    const body=rows.map((r,i)=>`<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${cell(r.unit)}${cell(r.plan)}${(r.months||[]).slice(0,rm).map(v=>cell(v)).join('')}${cell(r.total)}${cell(r.company)}${cell(r.note)}</tr>`).join('');
    const ms=Array(rm).fill(0);rows.forEach(r=>(r.months||[]).slice(0,rm).forEach((v,i)=>ms[i]+=num(v)));
    const total=`<tr class="summary-row">${cell('')}${cell('TỔNG CỘNG')}${cell('')}${cell(rows.reduce((a,r)=>a+num(r.plan),0))}${ms.map((v,i)=>cell(i===7?s.qc_aug:v)).join('')}${cell(s.qc_total)}${cell('')}${cell('')}</tr>`;
    shell('ĐƠN VỊ KÝ QUY CHẾ PHỐI HỢP',`Theo địa bàn ký quy chế · cập nhật đến ${state.data.snapshot_date}`,table(head,body+total),'qc');
  }

  function validData(d){return !!d?.summary && Array.isArray(d.dv) && d.dv.length===18 && Array.isArray(d.ph) && d.ph.length===6 && Array.isArray(d.dn) && d.dn.length===21 && Array.isArray(d.tinh) && Array.isArray(d.qc);}
  function render(){if(!state.data)return;({dv:renderDv,ph:renderPh,dn:renderDn,tinh:renderTinh,qc:renderQc}[state.active]||renderDv)();}
  async function load({quiet=false}={}){try{const res=await fetch(`${DATA_URL}?v=${Date.now()}`,{cache:'no-store'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const data=await res.json();if(!validData(data))throw new Error('Dữ liệu tổng hợp không hợp lệ');state.data=data;render();}catch(e){if(!quiet||!state.data)root.innerHTML='<div class="loading-cell">Chưa tải được dữ liệu tổng hợp. Trang sẽ tự thử lại.</div>';console.error('Admissions live report:',e);}}
  tabs.forEach(btn=>btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.active=btn.dataset.report||'dv';render();}));
  load(); setInterval(()=>load({quiet:true}),60000);
})();