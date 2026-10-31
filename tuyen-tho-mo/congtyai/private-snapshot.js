// Local JSON data only; no network, persistence, executable content or trust promotion.
export const MAX_SNAPSHOT_BYTES=256*1024;
const states=['ALLOCATED','ACTIVE','BLOCKED','UNKNOWN','COMPLETE'];
const labels={ALLOCATED:'Khai báo đã phân công',ACTIVE:'Khai báo có bước làm',BLOCKED:'Khai báo đang vướng',UNKNOWN:'Chưa đủ bằng chứng',COMPLETE:'Khai báo đạt mốc · chưa xác thực'};
const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const clean=(v,n=180)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,n).trim():null;
function time(v,now){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v))return null;const t=Date.parse(v);if(!Number.isFinite(t)||t>now)return null;const canonical=new Date(t).toISOString();return canonical.slice(0,19)===v.slice(0,19)?t:null;}
export function parsePrivateSnapshot(text,now=Date.now()){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_SNAPSHOT_BYTES||!Number.isFinite(now))throw Error('SNAPSHOT_SIZE_OR_TIME_INVALID');
 const data=JSON.parse(text,(k,v)=>{if(['__proto__','constructor','prototype'].includes(k))throw Error('UNSAFE_KEY');return v;});
 if(!isObject(data)||data.schemaVersion!==1||data.mode!=='PRIVATE_LOCAL_SNAPSHOT'||!isObject(data.source)||data.source.kind!=='USER_SUPPLIED_RECEIPT_SUMMARY'||!clean(data.source.label)||!Array.isArray(data.records)||data.records.length>100)throw Error('SNAPSHOT_SCHEMA_INVALID');
 const generated=time(data.generatedAt,now);if(generated===null)throw Error('SNAPSHOT_TIMESTAMP_INVALID');
 const rows=data.records.map((r,i)=>{
  if(!isObject(r))throw Error('SNAPSHOT_ROW_INVALID');
  const event=time(r.eventAt,now),observed=time(r.observedAt,now),reported=time(r.reportedAt,now);
  const chronology=event!==null&&observed!==null&&reported!==null&&event<=observed&&observed<=reported&&reported<=generated;
  const ref=clean(r.evidenceRef,120);const evidence=chronology&&!!ref;
  let state=states.includes(r.state)?r.state:'UNKNOWN';
  if(!evidence||!['PC','CLOUD','DOCUMENTS'].includes(r.scope))state='UNKNOWN';
  if(state==='ACTIVE'&&r.workerAcknowledged!==true)state='UNKNOWN';
  if(state==='COMPLETE'&&!(r.qa==='PASS'&&r.outputVerified===true))state='UNKNOWN';
  const ttl=Number.isSafeInteger(r.freshnessWindowMs)&&r.freshnessWindowMs>0&&r.freshnessWindowMs<=86400000?r.freshnessWindowMs:null;
  return {id:'private-'+i,scope:['PC','CLOUD','DOCUMENTS'].includes(r.scope)?r.scope:'UNKNOWN',owner:clean(r.owner)||'Chưa xác định',stage:clean(r.stage)||'Chưa có công đoạn',state,label:labels[state],next:clean(r.next)||'Chưa có bước tiếp',qa:['PASS','FAIL','HOLD','UNKNOWN'].includes(r.qa)?r.qa:'UNKNOWN',freshnessWindowMs:ttl,freshness:!evidence?'UNKNOWN':ttl===null?'UNSPECIFIED':now-observed>ttl?'STALE':'RECENT_SELF_DECLARED',eventAt:evidence?r.eventAt:null,observedAt:evidence?r.observedAt:null,reportedAt:evidence?r.reportedAt:null,evidenceRef:evidence?ref:null};
 });
 return {mode:'PRIVATE_LOCAL_SNAPSHOT',label:'SNAPSHOT RIÊNG TRÊN MÁY · KHÔNG LIVE',connected:false,authenticated:false,generatedAt:data.generatedAt,sourceLabel:clean(data.source.label),rows};
}

export function refreshPrivateSnapshotAge(projection,now=Date.now()){
 if(projection?.mode!=='PRIVATE_LOCAL_SNAPSHOT')return projection;
 return {...projection,rows:projection.rows.map(r=>{
  if(!r.observedAt||!r.evidenceRef)return r;
  const generated=time(projection.generatedAt,now),event=time(r.eventAt,now),observed=time(r.observedAt,now),reported=time(r.reportedAt,now);
  const chronology=Number.isFinite(now)&&generated!==null&&event!==null&&observed!==null&&reported!==null&&event<=observed&&observed<=reported&&reported<=generated;
  if(!chronology)return {...r,state:'UNKNOWN',label:labels.UNKNOWN,freshness:'UNKNOWN'};
  return {...r,freshness:r.freshnessWindowMs===null?'UNSPECIFIED':now-observed>r.freshnessWindowMs?'STALE':'RECENT_SELF_DECLARED'};
 })};
}
