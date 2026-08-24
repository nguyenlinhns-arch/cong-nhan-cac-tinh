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
  const dashIfZero = v => num(v) === 0 ? '-' : num(v);
  const sum = (rows, key) => rows.reduce((a,r)=>a+num(r[key]),0);

  function status(){
    const d=state.data,s=d.summary;
    return `<div class="report-status"><b>BÁO CÁO NGÀY ${esc(d.snapshot_date)}</b><span>Gốc 31/07: <b>${fmt(s.base_3107)}</b></span><span>Biến động từ 01/08: <b>${s.aug_net>=0?'+':''}${fmt(s.aug_net)}</b></span><span>Hệ A hiện tại: <b>${fmt(s.system_total)}</b></span><span>Nhập học ngày ${esc(d.snapshot_date)}: <b>${fmt(s.today_count)}</b></span></div>`;
  }
  function note(){return `<div class="source-note"><b>Nguồn:</b> Biểu TH KQ Nhập Học Năm 2026. Mốc 31/07/2026 được khóa làm gốc; từ 01/08 hệ thống tự cộng/trừ biến động từ DSHS NHẬP HỌC TỔNG. Website chỉ công khai số liệu tổng hợp, không công khai dữ liệu cá nhân học sinh.</div>`;}
  function table(head,body,cls=''){return `<div class="native-table-wrap"><table class="native-report ${cls}"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;}
  function shell(title,subtitle,html,cls){root.className=`report-sheet report-${cls}`;root.innerHTML=`<div class="dashboard-card"><div class="dashboard-title"><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div>${status()}${html}${note()}</div>`;}

  function validateDvFeed(rows, extras){
    if (!Array.isArray(extras) || extras.length !== rows.length) return false;
    const required=['hsc_aug','lt_aug','xsc_aug','vht_aug','electric_aug','school_aug','company_aug','aug_total','tckt_aug','sckt_aug','db_electric_aug','east_aug','b_aug','current_total','deleted','remaining','retakes','including_retakes'];
    return rows.every((r,i)=>required.every(k=>Object.prototype.hasOwnProperty.call(r,k)) && extras[i] && String(extras[i].name||'').trim()===String(r.name||'').trim());
  }

  function renderDv(){
    const rows=state.data.dv, extras=state.data.dv_extra, s=state.data.summary;
    if (!validateDvFeed(rows,extras)) {
      root.innerHTML='<div class="loading-cell">Dữ liệu theo đơn vị chưa đủ cấu phần để đối chiếu từng cột. Trang sẽ tự thử lại.</div>';
      return;
    }

    const head = `
      <tr>
        ${th('TT','','rowspan="3"')}${th('ĐƠN VỊ TUYỂN SINH','','rowspan="3"')}
        ${th('Quý 3.2026','grp-q3','colspan="13"')}
        ${th(`Tổng nhập đến ${state.data.snapshot_date}`,'grp-current','colspan="7"')}
        ${th('Tổng nhập hệ A đến 31/7/2025','grp-prior','colspan="2"')}
        ${th('So sánh kết quả tuyển HS TKV năm 2026 cùng kỳ năm 2025','grp-compare','rowspan="3"')}
        ${th('Số học sinh tái tuyển 2026','grp-retake','rowspan="3"')}
        ${th('Tổng số nhập bao gồm cả tái tuyển','grp-total','rowspan="3"')}
      </tr>
      <tr>
        ${th('Tháng 8.2026','grp-q3','colspan="13"')}
        ${th('Công hệ A TKV trong đó','grp-current','colspan="2"')}
        ${th('CỘNG HỆ A TKV','grp-current','rowspan="2"')}
        ${th('Học sinh xóa tên','grp-current','rowspan="2"')}
        ${th('Số học sinh còn lại','grp-current','rowspan="2"')}
        ${th('KH điều hành TKV năm 2026','grp-current','rowspan="2"')}
        ${th('TỶ LỆ hoàn thành TKV (%)','grp-current','rowspan="2"')}
        ${th('TKV','grp-prior','rowspan="2"')}${th('Tổng','grp-prior','rowspan="2"')}
      </tr>
      <tr>
        ${th('Sơ cấp khai thác')}${th('TC CĐ liên thông')}${th('SCN XDM')}${th('VHTBĐ')}${th('Cơ điện lò')}${th('Trường tuyển')}${th('DN tuyển')}${th('Cộng Hệ A TKV')}${th('TCKT')}${th('SCKT')}${th('Cơ điện lò')}${th('Cộng Hệ A Đông bắc')}${th('Hệ B - TC + CĐ')}
        ${th('Trường tuyển')}${th('DN tuyển')}
      </tr>`;

    const bodyRows=rows.map((r,i)=>{
      const e=extras[i];
      return `<tr class="${rowClass(i)}">
        ${cell(i+1)}${cell(r.name)}
        ${cell(blankZero(r.hsc_aug))}${cell(blankZero(r.lt_aug))}${cell(blankZero(r.xsc_aug))}${cell(blankZero(r.vht_aug))}${cell(blankZero(r.electric_aug))}
        ${cell(blankZero(r.school_aug))}${cell(blankZero(r.company_aug))}${cell(r.aug_total)}${cell(r.tckt_aug)}${cell(r.sckt_aug)}${cell(r.db_electric_aug)}${cell(r.east_aug)}${cell(r.b_aug)}
        ${cell(e.current_school)}${cell(e.current_company)}${cell(r.current_total)}${cell(r.deleted)}${cell(r.remaining)}${cell(r.plan)}${cell(r.pct == null ? '' : pct(r.pct))}
        ${cell(e.prior_tkv)}${cell(e.prior_total)}${cell(e.yoy_pct == null ? '' : pct(e.yoy_pct))}${cell(r.retakes ? r.retakes : '')}${cell(r.including_retakes ? r.including_retakes : '-')}
      </tr>`;
    }).join('');

    const schoolNow=extras.reduce((a,r)=>a+num(r.current_school),0);
    const companyNow=extras.reduce((a,r)=>a+num(r.current_company),0);
    const priorTkv=extras.reduce((a,r)=>a+(r.prior_tkv==null?0:num(r.prior_tkv)),0);
    const priorTotal=extras.reduce((a,r)=>a+(r.prior_total==null?0:num(r.prior_total)),0);
    const plan=rows.reduce((a,r)=>a+(r.plan==null?0:num(r.plan)),0);
    const totalRow=`<tr class="summary-row">
      ${cell('')}${cell('TỔNG CỘNG NHẬP')}
      ${cell(sum(rows,'hsc_aug'))}${cell(sum(rows,'lt_aug'))}${cell(sum(rows,'xsc_aug'))}${cell(sum(rows,'vht_aug'))}${cell(sum(rows,'electric_aug'))}
      ${cell(sum(rows,'school_aug'))}${cell(sum(rows,'company_aug'))}${cell(s.aug_net)}${cell(sum(rows,'tckt_aug'))}${cell(sum(rows,'sckt_aug'))}${cell(sum(rows,'db_electric_aug'))}${cell(sum(rows,'east_aug'))}${cell(sum(rows,'b_aug'))}
      ${cell(schoolNow)}${cell(companyNow)}${cell(s.system_total)}${cell(s.deleted)}${cell(s.remaining)}${cell(plan)}${cell(pct(plan?s.remaining/plan*100:null))}
      ${cell(priorTkv)}${cell(priorTotal)}${cell(pct(priorTotal?s.system_total/priorTotal*100:null))}${cell(s.retakes)}${cell(s.including_retakes)}
    </tr>`;
    shell('TỔNG HỢP THEO ĐƠN VỊ TUYỂN SINH',`Số liệu đến ${state.data.snapshot_date}`,table(head,bodyRows+totalRow,'dv-exact'),'dv');
  }

  function renderPh(){const rows=state.data.ph;const head=`<tr>${['TT','Phân hiệu / Trung tâm','T8 SC khai thác','T8 liên thông','T8 XDM','T8 cơ điện','T8 hệ A','Hiện tại SC khai thác','Hiện tại liên thông','Hiện tại XDM','Hiện tại cơ điện','Hệ A hiện tại','Hệ B','Tổng A+B'].map(x=>th(x)).join('')}</tr>`;const body=rows.map((r,i)=>`<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${cell(r.month8[1])}${cell(r.month8[2])}${cell(r.month8[3])}${cell(r.month8[5])}${cell(r.month8[9])}${cell(r.current[1])}${cell(r.current[2])}${cell(r.current[3])}${cell(r.current[5])}${cell(r.current[9])}${cell(r.current[11])}${cell(r.current[12])}</tr>`).join('');const sums=(w,i)=>rows.reduce((a,r)=>a+num(r[w][i]),0);const total=`<tr class="summary-row">${cell('')}${cell('TỔNG CỘNG')}${cell(sums('month8',1))}${cell(sums('month8',2))}${cell(sums('month8',3))}${cell(sums('month8',5))}${cell(sums('month8',9))}${cell(sums('current',1))}${cell(sums('current',2))}${cell(sums('current',3))}${cell(sums('current',5))}${cell(sums('current',9))}${cell(sums('current',11))}${cell(sums('current',12))}</tr>`;shell('TỔNG HỢP THEO PHÂN HIỆU / TRUNG TÂM',`Mốc 31/07/2026 + biến động đến ${state.data.snapshot_date}`,table(head,body+total),'ph');}
  function renderDn(){const rows=state.data.dn;const head=`<tr>${['TT','Doanh nghiệp','T8 CĐ - Trường','T8 CĐ - DN','T8 CĐ tổng','T8 SC - Trường','T8 SC - DN','T8 SC tổng','T8 LT - Trường','T8 LT - DN','T8 LT tổng','Cộng T8','Tổng hiện tại'].map(x=>th(x)).join('')}</tr>`;const body=rows.map((r,i)=>`<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${r.month8.map(v=>cell(v)).join('')}${cell(r.aug_total)}${cell(r.current_total)}</tr>`).join('');const m=Array(9).fill(0);rows.forEach(r=>r.month8.forEach((v,i)=>m[i]+=num(v)));const total=`<tr class="summary-row">${cell('')}${cell('TỔNG TKV')}${m.map(v=>cell(v)).join('')}${cell(rows.reduce((a,r)=>a+num(r.aug_total),0))}${cell(rows.reduce((a,r)=>a+num(r.current_total),0))}</tr>`;shell('TỔNG HỢP THEO DOANH NGHIỆP',`Kết quả thực hiện đến ${state.data.snapshot_date}`,table(head,body+total),'dn');}
  function renderTinh(){const rows=state.data.tinh,s=state.data.summary;const head=`<tr>${['TT','Phường/Xã','Địa bàn gộp','T1','T2','T3','T4','T5','T6','T7','T8','Tổng','Ghi chú'].map(x=>th(x)).join('')}</tr>`;const body=rows.map((r,i)=>`<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${cell(r.areas)}${r.months.map(v=>cell(v)).join('')}${cell(r.total)}${cell(r.note)}</tr>`).join('');const monthSums=Array(8).fill(0);rows.forEach(r=>r.months.forEach((v,i)=>monthSums[i]+=num(v)));const total=`<tr class="summary-row">${cell('')}${cell('TỔNG CỘNG')}${cell('')}${monthSums.map((v,i)=>cell(i===7?s.in_province_aug:v)).join('')}${cell(s.in_province_total)}${cell('')}</tr>`;shell('HỌC SINH HỆ A TRONG TỈNH',`Theo địa bàn Quảng Ninh · cập nhật đến ${state.data.snapshot_date}`,table(head,body+total),'tinh');}
  function renderQc(){const rows=state.data.qc,s=state.data.summary;const head=`<tr>${['TT','Địa bàn ký quy chế','Đơn vị','KH/năm','T1','T2','T3','T4','T5','T6','T7','T8','Tổng','Gắn với DN','Ghi chú'].map(x=>th(x)).join('')}</tr>`;const body=rows.map((r,i)=>`<tr class="${rowClass(i)}">${cell(i+1)}${cell(r.name)}${cell(r.unit)}${cell(r.plan)}${r.months.map(v=>cell(v)).join('')}${cell(r.total)}${cell(r.company)}${cell(r.note)}</tr>`).join('');const monthSums=Array(8).fill(0);rows.forEach(r=>r.months.forEach((v,i)=>monthSums[i]+=num(v)));const total=`<tr class="summary-row">${cell('')}${cell('TỔNG CỘNG')}${cell('')}${cell(rows.reduce((a,r)=>a+num(r.plan),0))}${monthSums.map((v,i)=>cell(i===7?s.qc_aug:v)).join('')}${cell(s.qc_total)}${cell('')}${cell('')}</tr>`;shell('ĐƠN VỊ KÝ QUY CHẾ PHỐI HỢP',`Theo địa bàn ký quy chế · cập nhật đến ${state.data.snapshot_date}`,table(head,body+total),'qc');}

  function render(){if(!state.data)return;({dv:renderDv,ph:renderPh,dn:renderDn,tinh:renderTinh,qc:renderQc}[state.active]||renderDv)();}
  async function load({quiet=false}={}){try{const res=await fetch(`${DATA_URL}?v=${Date.now()}`,{cache:'no-store'});if(!res.ok)throw new Error(`HTTP ${res.status}`);const data=await res.json();if(!data?.summary||!Array.isArray(data?.dv))throw new Error('Dữ liệu tổng hợp không hợp lệ');state.data=data;render();}catch(e){if(!quiet||!state.data)root.innerHTML='<div class="loading-cell">Chưa tải được dữ liệu tổng hợp. Trang sẽ tự thử lại.</div>';console.error('Admissions live report:',e);}}
  tabs.forEach(btn=>btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.active=btn.dataset.report||'dv';render();}));
  load();setInterval(()=>load({quiet:true}),60000);
})();
