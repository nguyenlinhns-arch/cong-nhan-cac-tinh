// Local JSON data only; no network, persistence, executable content or trust promotion.
export const MAX_SNAPSHOT_BYTES=256*1024;
const states=['ALLOCATED','ACTIVE','BLOCKED','UNKNOWN','COMPLETE','CANCELLED'];
const labels={CANCELLED:'Đã hủy theo khai báo',ALLOCATED:'Khai báo đã phân công',ACTIVE:'Khai báo có bước làm',BLOCKED:'Khai báo đang vướng',UNKNOWN:'Chưa đủ bằng chứng',COMPLETE:'Khai báo đạt mốc · chưa xác thực'};
const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const clean=(v,n=180)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,n).trim():null;
function time(v,now){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v))return null;const t=Date.parse(v);if(!Number.isFinite(t)||t>now)return null;const canonical=new Date(t).toISOString();return canonical.slice(0,19)===v.slice(0,19)?t:null;}
export function parsePrivateSnapshot(text,now=Date.now()){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_SNAPSHOT_BYTES||!Number.isFinite(now))throw Error('SNAPSHOT_SIZE_OR_TIME_INVALID');
 const data=JSON.parse(text,(k,v)=>{if(['__proto__','constructor','prototype'].includes(k))throw Error('UNSAFE_KEY');return v;});
 if(!isObject(data)||data.schemaVersion!==1||data.mode!=='PRIVATE_LOCAL_SNAPSHOT'||!isObject(data.source)||data.source.kind!=='USER_SUPPLIED_RECEIPT_SUMMARY'||!clean(data.source.label)||!Array.isArray(data.records)||data.records.length>100)throw Error('SNAPSHOT_SCHEMA_INVALID');
 const generated=time(data.generatedAt,now);if(generated===null)throw Error('SNAPSHOT_TIMESTAMP_INVALID');
 const taskIds=new Set();
 for(const r of data.records){const id=isObject(r)?clean(r.taskId,100):null;if(id){if(taskIds.has(id))throw Error('SNAPSHOT_DUPLICATE_TASK_ID');taskIds.add(id);}}
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
  return {id:'private-'+i,taskId:clean(r.taskId,100)||'Chưa có task ID',environment:clean(r.environment,100)||r.scope,progress:projectMilestones({...r,state},now,data.generatedAt),scope:['PC','CLOUD','DOCUMENTS'].includes(r.scope)?r.scope:'UNKNOWN',owner:clean(r.owner)||'Chưa xác định',stage:clean(r.stage)||'Chưa có công đoạn',state,label:labels[state],next:clean(r.next)||'Chưa có bước tiếp',qa:['PASS','FAIL','HOLD','UNKNOWN'].includes(r.qa)?r.qa:'UNKNOWN',freshnessWindowMs:ttl,freshness:!evidence?'UNKNOWN':ttl===null?'UNSPECIFIED':now-observed>ttl?'STALE':'RECENT_SELF_DECLARED',eventAt:evidence?r.eventAt:null,observedAt:evidence?r.observedAt:null,reportedAt:evidence?r.reportedAt:null,evidenceRef:evidence?ref:null};
 });
 return {mode:'PRIVATE_LOCAL_SNAPSHOT',label:'SNAPSHOT RIÊNG TRÊN MÁY · KHÔNG LIVE',connected:false,authenticated:false,generatedAt:data.generatedAt,sourceLabel:clean(data.source.label),rows};
}

export function refreshPrivateSnapshotAge(projection,now=Date.now()){
 if(projection?.mode!=='PRIVATE_LOCAL_SNAPSHOT')return projection;
 return {...projection,rows:projection.rows.map(r=>{
  if(!r.observedAt||!r.evidenceRef)return r;
  const generated=time(projection.generatedAt,now),event=time(r.eventAt,now),observed=time(r.observedAt,now),reported=time(r.reportedAt,now);
  const chronology=Number.isFinite(now)&&generated!==null&&event!==null&&observed!==null&&reported!==null&&event<=observed&&observed<=reported&&reported<=generated;
  if(!chronology)return {...r,state:'UNKNOWN',label:labels.UNKNOWN,freshness:'UNKNOWN',progress:projectMilestones({...r,state:'UNKNOWN'},now,projection.generatedAt)};
  return {...r,progress:projectMilestones(r,now,projection.generatedAt),freshness:r.freshnessWindowMs===null?'UNSPECIFIED':now-observed>r.freshnessWindowMs?'STALE':'RECENT_SELF_DECLARED'};
 })};
}
// Equal-weight acceptance milestones, not elapsed time or authenticated telemetry.
export function projectMilestones(record,now=Date.now(),generatedAt=record.reportedAt){
 const p=record.progress;
 const empty=reason=>({percent:null,completed:0,total:0,milestones:[],reason,category:'unfinished',target:null,planId:null});
 if(!isObject(p))return {...empty('Chưa có kế hoạch mốc'),category:record.state==='CANCELLED'?'cancelled':'unfinished'};
 const target=clean(p.target),planId=clean(p.planId,100),taskId=clean(record.taskId,100);
 if(!taskId||!target||!planId||!/^[-A-Za-z0-9._]+@v[1-9][0-9]*$/.test(planId)||!['OPEN','CANCELLED','REOPENED'].includes(p.lifecycle)||!Array.isArray(p.milestones)||p.milestones.length<3||p.milestones.length>20)return empty('Kế hoạch mốc không hợp lệ');
 const ids=new Set();let invalid=false;
 const milestones=p.milestones.map(m=>{
  if(!isObject(m)){invalid=true;return {};}
  const id=clean(m.id,80),label=clean(m.label,120),state=m.state;
  if(!id||!label||ids.has(id)||!['PENDING','DONE','UNKNOWN'].includes(state))invalid=true;
  ids.add(id);
  const completedAt=typeof m.completedAt==='string'?m.completedAt:null,evidenceRef=clean(m.evidenceRef,120);
  const at=time(completedAt,now),reported=time(record.reportedAt,now),generated=time(generatedAt,now);
  const proof=state==='DONE'&&at!==null&&reported!==null&&generated!==null&&at<=reported&&reported<=generated&&!!evidenceRef;
  if(state==='DONE'&&!proof)invalid=true;
  return {id,label,state,completedAt,evidenceRef,proof};
 });
 if(!ids.has('ACCEPTED')||!ids.has('DELIVERED'))invalid=true;
 const accepted=milestones.find(m=>m.id==='ACCEPTED'),delivered=milestones.find(m=>m.id==='DELIVERED');
 if(delivered?.state==='DONE'&&!(accepted?.proof&&delivered.proof&&Date.parse(delivered.completedAt)>=Date.parse(accepted.completedAt)))invalid=true;
 const cancelConflict=(record.state==='CANCELLED')!==(p.lifecycle==='CANCELLED');
 if(cancelConflict)invalid=true;
 const reopened=p.lifecycle==='REOPENED';
 if(reopened&&(!/^[-A-Za-z0-9._]+@v[1-9][0-9]*$/.test(p.priorPlanId||'')||p.priorPlanId===planId||accepted?.state!=='PENDING'||delivered?.state!=='PENDING'))invalid=true;
 const completed=milestones.filter(m=>m.proof).length,total=milestones.length;
 const unknown=record.state==='UNKNOWN'||milestones.some(m=>m.state==='UNKNOWN');
 const chronological=time(record.eventAt,now)!==null&&time(record.observedAt,now)!==null&&time(record.reportedAt,now)!==null&&time(generatedAt,now)!==null&&Date.parse(record.eventAt)<=Date.parse(record.observedAt)&&Date.parse(record.observedAt)<=Date.parse(record.reportedAt)&&Date.parse(record.reportedAt)<=Date.parse(generatedAt);
 if(!Number.isFinite(now)||!chronological)invalid=true;
 const cancelled=p.lifecycle==='CANCELLED'&&!cancelConflict;
 const percent=invalid||unknown||cancelled?null:Math.floor(completed*100/total);
 return {planId,target,lifecycle:p.lifecycle,priorPlanId:clean(p.priorPlanId,100),milestones,completed,total,percent,category:cancelled?'cancelled':percent===100?'completed':'unfinished',reason:cancelConflict?'Mâu thuẫn trạng thái hủy':invalid?'Mốc hoặc bằng chứng chưa hợp lệ':cancelled?'Đã hủy · không tính tỷ lệ':unknown?'Chưa đủ bằng chứng':reopened?'Mở lại · kế hoạch mới':'Tỷ lệ mốc nghiệm thu',acceptedAt:accepted?.proof?accepted.completedAt:null,deliveredAt:delivered?.proof?delivered.completedAt:null};
}
export function orderTaskRows(rows){
 return rows.map((row,index)=>({row,index})).sort((a,b)=>{
  const category=r=>r.progress?.category==='completed'?1:r.progress?.category==='cancelled'?2:0;
  const c=category(a.row)-category(b.row);if(c)return c;
  if(category(a.row)===0){
   const x=a.row.progress?.percent,y=b.row.progress?.percent;
   const knownX=Number.isFinite(x),knownY=Number.isFinite(y);
   if(knownX!==knownY)return knownX?-1:1;
   if(knownX&&x!==y)return y-x;
  }
  const stamp=r=>Number.isFinite(Date.parse(r.reportedAt))?Date.parse(r.reportedAt):-Infinity;
  const ta=stamp(a.row),tb=stamp(b.row);if(ta!==tb)return ta>tb?-1:1;
  const cmp=(x,y)=>x<y?-1:x>y?1:0;
  return cmp(a.row.stage||'',b.row.stage||'')||cmp(a.row.taskId||'',b.row.taskId||'')||a.index-b.index;
 }).map(x=>x.row);
}
