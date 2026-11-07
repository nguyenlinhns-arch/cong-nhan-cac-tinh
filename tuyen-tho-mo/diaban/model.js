/* Pure aggregate-data logic. No individual records or network access. */
(function(root){
  'use strict';
  const KEYS=['workers','students','removed','leave','graduated','missingStatus'];
  const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().trim();
  const sum=rows=>Object.fromEntries(KEYS.map(k=>[k,rows.reduce((n,r)=>n+r[k],0)]));
  function validate(d){
    if(!d||d.schemaVersion!==1||d.countUnit!=='source-records'||!Array.isArray(d.rows)||!Array.isArray(d.provinces)||!Array.isArray(d.yearly))throw Error('Tệp không đúng cấu trúc tổng hợp phiên bản 1.');
    if(d.rows.length>20000||d.provinces.length>100||!d.rows.length)throw Error('Số địa bàn trong tệp không hợp lệ.');
    const ids=new Set(),pids=new Set();
    const string=(s,max=200)=>typeof s==='string'&&s.length>0&&s.length<=max;
    const counts=r=>KEYS.forEach(k=>{if(!Number.isSafeInteger(r[k])||r[k]<0)throw Error('Số đếm thiếu, âm hoặc không hợp lệ: '+k);});
    for(const p of d.provinces){if(!string(p.id)||!string(p.name)||pids.has(p.id))throw Error('Tỉnh bị trùng hoặc thiếu thông tin.');pids.add(p.id);counts(p);if(p.sourceUrl&&!/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]+\/edit(?:#gid=\d+)?$/.test(p.sourceUrl))throw Error('Liên kết nguồn không hợp lệ.');}
    for(const r of d.rows){if(!string(r.id)||!string(r.name)||!pids.has(r.provinceId)||ids.has(r.id)||typeof r.unmapped!=='boolean')throw Error('Địa bàn thiếu thông tin hoặc bị trùng.');ids.add(r.id);counts(r);if(r.removed>r.students||r.leave>r.students||r.graduated>r.students||r.missingStatus>r.students)throw Error('Số sự kiện vượt số hồ sơ nhập học.');}
    for(const p of d.provinces){const rows=d.rows.filter(r=>r.provinceId===p.id),s=sum(rows);for(const k of KEYS)if(s[k]!==p[k])throw Error('Tổng địa bàn không khớp tỉnh '+p.name);if(rows.filter(r=>r.unmapped).length!==1)throw Error('Mỗi tỉnh phải có một nhóm chưa xác minh.');}
    const yearids=new Set();for(const r of d.yearly){if(!pids.has(r.provinceId)||!Number.isInteger(r.year)||r.year<1900||r.year>2100||yearids.has(r.provinceId+':'+r.year))throw Error('Dòng năm không hợp lệ.');yearids.add(r.provinceId+':'+r.year);for(const k of KEYS.slice(1))if(!Number.isSafeInteger(r[k])||r[k]<0)throw Error('Số liệu năm không hợp lệ.');}
    for(const p of d.provinces)for(const k of KEYS.slice(1))if(d.yearly.filter(r=>r.provinceId===p.id).reduce((n,r)=>n+r[k],0)!==p[k])throw Error('Tổng theo năm không khớp tỉnh '+p.name);
    // Whitelist output: unknown input fields are never retained/rendered/exported.
    return {schemaVersion:1,countUnit:'source-records',synthetic:d.synthetic===true,label:String(d.label||'Bản tổng hợp').slice(0,200),dataAsOf:String(d.dataAsOf||'Chưa ghi').slice(0,30),workerAsOf:String(d.workerAsOf||'Chưa ghi').slice(0,30),unassignedProvinceWorkers:Number.isSafeInteger(d.unassignedProvinceWorkers)&&d.unassignedProvinceWorkers>=0?d.unassignedProvinceWorkers:null,
      provinces:d.provinces.map(p=>({id:p.id,name:p.name,priority:p.priority===true,sourceUrl:p.sourceUrl||'',...Object.fromEntries(KEYS.map(k=>[k,p[k]]))})),
      rows:d.rows.map(r=>({id:r.id,provinceId:r.provinceId,name:r.name,unmapped:r.unmapped,sourceRow:Number.isInteger(r.sourceRow)?r.sourceRow:null,...Object.fromEntries(KEYS.map(k=>[k,r[k]]))})),
      yearly:d.yearly.map(r=>({provinceId:r.provinceId,year:r.year,...Object.fromEntries(KEYS.slice(1).map(k=>[k,r[k]]))}))};
  }
  function filter(d,f={}){return d.rows.filter(r=>(!f.province||f.province==='all'||r.provinceId===f.province)&&(!f.commune||f.commune==='all'||r.id===f.commune)&&(!f.search||norm(r.name+' '+d.provinces.find(p=>p.id===r.provinceId).name).includes(norm(f.search)))&&(!f.kind||f.kind==='all'||(f.kind==='unmapped'?r.unmapped:f.kind==='mapped'?!r.unmapped:r[f.kind]>0)));}
  function csv(d,rows){const cell=v=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};const header=['Loại dữ liệu','Tỉnh','Xã/phường','Công nhân','Hồ sơ nhập học','Có xóa tên','Bảo lưu','Tốt nghiệp','Thiếu trạng thái','Địa bàn','Mốc dữ liệu'];return '\uFEFF'+[header,...rows.map(r=>[d.synthetic?'MINH HỌA - KHÔNG DÙNG BÁO CÁO':'Tổng hợp nội bộ',d.provinces.find(p=>p.id===r.provinceId).name,r.name,...KEYS.map(k=>r[k]),r.unmapped?'Chưa xác minh':'Đã ghép theo nguồn',d.dataAsOf])].map(r=>r.map(cell).join(',')).join('\r\n');}
  const api={KEYS,norm,sum,validate,filter,csv};root.DashboardModel=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
