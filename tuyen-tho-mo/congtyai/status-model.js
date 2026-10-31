// Public synthetic projection only. Authentication and private collection are NOT implemented.
export const STATES = Object.freeze(['ALLOCATED','ACTIVE','BLOCKED','UNKNOWN','COMPLETE']);
const labels = {ALLOCATED:'Đã phân công · chưa hoạt động',ACTIVE:'Có bước làm được ghi nhận',BLOCKED:'Đang vướng điều kiện',UNKNOWN:'Chưa đủ bằng chứng',COMPLETE:'Đạt mốc đã xác minh'};
export function projectStatus(snapshot, now=Date.now()) {
  const empty = {mode:'DISCONNECTED', label:'CHƯA KẾT NỐI', rows:[], connected:false};
  // A public client cannot promote a payload to trusted live telemetry.
  if (!snapshot || snapshot.mode !== 'SYNTHETIC' || !Array.isArray(snapshot.records) || !Number.isFinite(now)) return empty;
  const rows = snapshot.records.slice(0,50).map((r,i)=>{
    const at = key => typeof r[key]==='string' ? Date.parse(r[key]) : NaN;
    const event=at('eventAt'), observed=at('observedAt'), reported=at('reportedAt');
    const chronology=Number.isFinite(event)&&Number.isFinite(observed)&&Number.isFinite(reported)&&event<=observed&&observed<=reported&&reported<=now;
    const evidence=chronology && r.evidenceVerified===true && typeof r.evidenceRef==='string' && /^DEMO-[A-Z0-9-]+$/.test(r.evidenceRef);
    const ttl=Number.isFinite(r.freshnessWindowMs)&&r.freshnessWindowMs>0 ? r.freshnessWindowMs : null;
    const stale=evidence && ttl!==null && now-observed>ttl;
    let state=STATES.includes(r.state)?r.state:'UNKNOWN';
    if (state!=='ALLOCATED' && !evidence) state='UNKNOWN';
    if (state==='ACTIVE' && r.workerAcknowledged!==true) state='UNKNOWN';
    if (state==='COMPLETE' && !(r.qa==='PASS' && r.outputVerified===true)) state='UNKNOWN';
    const text=(v,fallback)=>typeof v==='string'?v.slice(0,180):fallback;
    return {id:'synthetic-'+i, scope:['PC','CLOUD','DOCUMENTS'].includes(r.scope)?r.scope:'UNKNOWN', owner:text(r.owner,'Chưa xác định'), stage:text(r.stage,'Chưa có công đoạn'), state, label:labels[state], freshness:!evidence?'UNKNOWN':stale?'STALE':ttl===null?'UNSPECIFIED':'FRESH', ageMs:evidence?now-observed:null, eventAt:evidence?r.eventAt:null, observedAt:evidence?r.observedAt:null, reportedAt:evidence?r.reportedAt:null, evidenceRef:evidence?r.evidenceRef:null, next:text(r.next,'Chưa có bước tiếp theo'), qa:text(r.qa,'UNKNOWN')};
  });
  return {mode:'SYNTHETIC',label:'DỮ LIỆU MINH HỌA · KHÔNG PHẢI HOẠT ĐỘNG THẬT',rows,connected:false};
}
export function exampleStatus(now=Date.now()) {
  const t=delta=>new Date(now-delta).toISOString();
  const base={evidenceVerified:true,evidenceRef:'DEMO-RECEIPT-01',eventAt:t(180000),observedAt:t(120000),reportedAt:t(60000),freshnessWindowMs:600000,qa:'UNKNOWN'};
  return {mode:'SYNTHETIC',records:[
    {...base,scope:'PC',owner:'Vai thực thi PC mẫu',stage:'Kiểm tra bản sửa',state:'ACTIVE',workerAcknowledged:true,next:'Chuyển kết quả kiểm thử cho QA'},
    {...base,scope:'CLOUD',owner:'Vai triển khai Cloud mẫu',stage:'Chờ điều kiện host',state:'BLOCKED',next:'Xác minh cơ chế lưu trữ bền vững'},
    {scope:'DOCUMENTS',owner:'Vai giám sát văn bản mẫu',stage:'Chuẩn bị nhận việc',state:'ALLOCATED',next:'Đọc hướng dẫn và nhận đúng phiên bản hồ sơ'},
    {...base,scope:'PC',owner:'Vai giám sát PC mẫu',stage:'Biên nhận cũ',state:'ACTIVE',workerAcknowledged:true,eventAt:t(1500000),observedAt:t(1400000),reportedAt:t(1300000),next:'Đối soát biên nhận mới; không tự phát lại lệnh'},
    {...base,scope:'CLOUD',owner:'Vai kiểm thử nguồn mẫu',stage:'Đạt mốc kiểm thử nguồn',state:'COMPLETE',qa:'PASS',outputVerified:true,next:'Còn cổng triển khai; không đồng nghĩa đã vận hành'}
  ]};
}
