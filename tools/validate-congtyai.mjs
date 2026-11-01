import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const dir='tuyen-tho-mo/congtyai/';
const allowed=['app.js','handoffs.js','health.js','index.html','layout3d.js','meeting.js','office-fallback.js','office3d.js','portraits.js','private-snapshot.js','quy-trinh-cong-khai.txt','roles.js','rooms.js','status-model.js','status-panel.js','style.css'];
assert.deepEqual(readdirSync(dir).sort(),allowed);
const texts=Object.fromEntries(allowed.map(f=>[f,readFileSync(dir+f,'utf8')]));
const all=Object.values(texts).join('\n');
for(const rule of [/localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket/,/branch_link|thread[_-]?id|heartbeat/i,/C:\\|D:\\|\/workspace\/|\/home\//,/sk-[a-zA-Z0-9]{12}|ghp_[a-zA-Z0-9]+/,/mailto:|tel:|\+84[0-9]/,/chatgpt\.site|trycloudflare\.com|127\.0\.0\.1/]) assert(!rule.test(all),`Privacy/side-effect rule: ${rule}`);
const moduleFrom=text=>import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'));
const {roles}=await moduleFrom(texts['roles.js']);
assert.equal(roles.length,37);assert.equal(new Set(roles.map(r=>r.name)).size,37);
const stableIds=roles.filter(r=>r.roleId!==undefined).map(r=>r.roleId);
assert(stableIds.every(id=>typeof id==='string'&&id.length>0));assert.equal(new Set(stableIds).size,stableIds.length);
for(const id of ['cloud-operations/van-anh','progress-pc-01','progress-cloud-01','progress-documents-01','agy-integration/ket-minh','resource-credit/ngan-ha'])assert(stableIds.includes(id));
for(const n of ['Đào','Quyên','Kiên','Sơn Hà','Tuệ','Khuê','Trúc','Châu','Ngân','Diệu','Khôi','An'])assert(roles.some(r=>r.name===n));
for(const r of roles){assert(Object.keys(r).every(k=>['name','title','group','task','standard','roleId'].includes(k)));assert(['name','title','group','task','standard'].every(k=>typeof r[k]==='string'&&r[k]));assert(r.task&&r.standard)}
const {rooms}=await moduleFrom(texts['rooms.js']),{personas,portrait}=await moduleFrom(texts['portraits.js']);
assert.equal(rooms.length,11);assert.equal(Object.keys(personas).length,37);
assert.equal(personas['Đào'].presentation,'female');assert.equal(personas['Đào'].room,'ceo');assert.equal(personas['Quyên'].room,'vp-process');assert.equal(personas['Khôi'].room,'vp-repair');assert.equal(Object.values(personas).filter(p=>p.room==='ceo').length,1);assert.equal(personas['Khôi'].presentation,'male');
for(const r of roles){assert(personas[r.name]);assert([...rooms.map(room=>room.id),'planning','cloud','agy','data'].includes(personas[r.name].room));assert(portrait(r.name).includes('<svg'));}
assert.equal(new Set(roles.map(r=>portrait(r.name))).size,37);
const html=texts['index.html'];// Retired active-office UI assertion.

// Retired active office-board labels; replacement taskboard assertions below.
// Retired active-office UI assertion.
// Retired active-office UI assertion.
// Retired active-office UI assertion.

assert(texts['quy-trinh-cong-khai.txt'].includes('108')); // role metadata retained, not profile UI
const releaseQuery='?v=20261031-taskboard-r4';
function approvedAsset(spec){
 const parts=spec.split('?');assert(parts.length<=2,'Multiple query delimiters');
 assert(parts.length===1||'?'+parts[1]===releaseQuery,'Unapproved release query');
 assert(!spec.includes('#'),'Asset fragment forbidden');assert(allowed.includes(parts[0]),`Missing asset ${spec}`);return parts[0];
}
for(const m of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))approvedAsset(m[1]);
for(const m of texts['app.js'].matchAll(/from '\.\/([^']+)'/g))approvedAsset(m[1]);
for(const [file,dependencies] of Object.entries({'app.js':['status-panel.js'],'status-panel.js':['private-snapshot.js','status-model.js'],'status-model.js':['private-snapshot.js']})){
 const actual=[...texts[file].matchAll(/from '([^']+)'/g)].map(m=>m[1]);
 assert.deepEqual(actual,dependencies.map(name=>'./'+name+releaseQuery),'Release graph mismatch: '+file);
 for(const spec of actual)approvedAsset(spec.slice(2));
}
assert(html.includes('src="./app.js'+releaseQuery+'"'));assert(html.includes('href="./style.css'+releaseQuery+'"'));
assert(texts['style.css'].includes('prefers-reduced-motion'));assert(texts['style.css'].includes('repeat(3,minmax(0,1fr))'));
// Retired active demo entry assertion; legacy demo unit gates remain.
assert(!texts['app.js'].includes('setInterval'));
const {demoRoute,createDemoLedger,makeDemoEvent}=await moduleFrom(texts['handoffs.js']);
assert.deepEqual(demoRoute,['Đào','Quyên','Kiên','Ngọc Lan','Khuê','Quyên','Đào']);
const ledger=createDemoLedger('qa-demo');
for(let i=0;i<6;i++){const e=makeDemoEvent('qa-demo',i);assert.equal(ledger.append(e),true);assert.equal(ledger.append(e),false);}
assert.equal(ledger.events.length,6);assert(Object.isFrozen(ledger.events[0]));
for(const invalid of [null,{},makeDemoEvent('other',0),makeDemoEvent('qa-test',1),{...makeDemoEvent('qa-test',0),mode:'LIVE'},{...makeDemoEvent('qa-test',0),evidence:'not-a-fixture'},{...makeDemoEvent('qa-test',0),to:'Kiên'}])assert.throws(()=>createDemoLedger('qa-test').append(invalid));
// Retired active-office UI assertion.
// Retired active-office UI assertion.
// Retired active-office UI assertion.

const workflow=readFileSync('.github/workflows/pages.yml','utf8');
assert(workflow.indexOf('mv tuyen-tho-mo/congtyai "$congtyai_tmp"')<workflow.indexOf('node tools/generate-province-pages'));
assert(workflow.includes('mv "$congtyai_tmp" tuyen-tho-mo/congtyai'));assert(workflow.includes('trap restore_dashboard EXIT'));assert(workflow.includes('node tools/validate-congtyai.mjs'));
// Original meeting, health, demo and isolation assertions retained below.

assert(texts['office3d.js'].includes("canvas.getContext('webgl'"));assert(texts['office3d.js'].includes('document.hidden'));assert(texts['office3d.js'].includes('requestAnimationFrame'));assert(texts['office3d.js'].includes('moving.elapsed'));

const {officeHealth}=await moduleFrom(texts['health.js']);assert.equal(officeHealth().state,'UNKNOWN');assert.equal(officeHealth().allowOperationalAnimation,false);const h=(source,status)=>officeHealth({verified:true,source,status,observedAt:1000},2000);assert.equal(h('pc-agent','POWER_OFF_CONFIRMED').label,'Văn phòng mất điện');assert.equal(h('network-monitor','DEGRADED_CONFIRMED').label,'Văn phòng mất mạng');assert.equal(h('auth-gateway','DENIED').state,'CONTROL_BLOCKED');assert.equal(h('pc-agent','TIMEOUT').state,'UNKNOWN');assert.equal(officeHealth({verified:true,source:'pc-agent',status:'READY_CONFIRMED',observedAt:0},90000).state,'UNKNOWN');

assert.equal(officeHealth().label,'Chưa kết nối dữ liệu PC');assert.equal(h('auth-gateway',403).state,'CONTROL_BLOCKED');assert.equal(officeHealth({verified:true,source:'pc-agent',status:'READY_CONFIRMED',observedAt:0,previouslyConnected:true},90000).label,'Văn phòng mất kết nối, đang xác minh');assert.equal(officeHealth({verified:true,source:'pc-agent',status:'READY_CONFIRMED',observedAt:0},90000).label,'Chưa kết nối dữ liệu PC');

// Retired active-office UI assertion.
// Retired active-office UI assertion.
// Retired active-office UI assertion.


const {meetingGate}=await moduleFrom(texts['meeting.js']);assert.equal(meetingGate().state,'HOLD');const opinion=person=>({id:'sample-'+person,jobId:'sample',revision:2,person,verified:true,sourceRef:'sample-only',comment:'Fixture opinion'});const mg=opinions=>meetingGate({jobId:'sample',revision:2,participantSetVerified:true,required:['An'],opinions});assert.equal(mg([opinion('Quyên'),opinion('Khôi')]).state,'HOLD');assert.equal(mg([opinion('Quyên'),opinion('Khôi'),{...opinion('An'),revision:1}]).state,'HOLD');assert.equal(mg([opinion('Quyên'),opinion('Quyên'),opinion('Khôi')]).state,'HOLD');assert.equal(mg([opinion('Quyên'),opinion('Khôi'),opinion('An')]).state,'READY_FOR_QUYEN');assert.equal(mg([opinion('Quyên'),opinion('Khôi'),opinion('An')]).mayExecute,false);

assert.equal(mg([{...opinion('Quyên'),id:'duplicate'}, {...opinion('Khôi'),id:'duplicate'},opinion('An')]).state,'HOLD');

assert.equal(meetingGate({jobId:'sample',revision:2,participantSetVerified:true,opinions:[opinion('Quyên'),opinion('Khôi')]}).state,'HOLD');assert.equal(meetingGate({jobId:'sample',revision:2,required:['An'],opinions:[opinion('Quyên'),opinion('Khôi'),opinion('An')]}).state,'HOLD');

// Retired active-office UI assertion.
// Retired active-office UI assertion.
assert(!html.includes('id="directory"'));assert(!html.includes('id="detail"'));assert(!html.includes('inspectPerson'));assert(!texts['app.js'].includes('openRole'));// Retired active-office UI assertion.
// Retired active-office UI assertion.
// Retired active-office UI assertion.
assert(!html.includes('Xem sơ đồ 2D'));assert(texts['office3d.js'].includes('b.textContent=p.rank.symbol'));assert(!texts['office3d.js'].includes('b.textContent=p.name'));assert(texts['office3d.js'].includes('project(p.homeX,.9,p.homeZ+1.8)'));assert(!texts['office3d.js'].includes('project(x,3.4,z)'));assert(texts['office3d.js'].includes("b.setAttribute('aria-label','Xem vai trò '+p.name"));assert(!texts['app.js'].includes("c.innerHTML=portrait(e.from"));

// Retired active-office UI assertion.
// Retired active demo entry assertion; legacy demo unit gates remain.
assert(texts['office3d.js'].includes("origin:'synthetic-ui'"));assert(texts['office3d.js'].includes('onVisualEvent(Object.freeze(visualEvent))'));assert(texts['office3d.js'].includes('gesture.elapsed>=8000'));

// Retired active-office UI assertion.


// Approved client-only import contract; snapshot is no longer a forbidden word.
for(const directive of ["default-src 'none'","script-src 'self'","connect-src 'none'","form-action 'none'","object-src 'none'","worker-src 'none'"])assert(html.includes(directive));
assert(!html.includes('unsafe-eval'));
for(const f of ['private-snapshot.js','status-panel.js']){
 const source=texts[f];
 assert(!/fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|serviceWorker/.test(source));
 assert(!/innerHTML|insertAdjacentHTML|\.href\s*=|\.src\s*=/.test(source));
}
assert(texts['private-snapshot.js'].includes('PRIVATE_LOCAL_SNAPSHOT'));
assert(texts['private-snapshot.js'].includes('refreshPrivateSnapshotAge'));
assert(texts['status-panel.js'].includes('textContent'));
// Retired active-office UI assertion.


// Approved taskboard-only active contract; historical modules remain unit-tested above.
assert(html.includes('<h1>BẢNG CÔNG VIỆC</h1>'));
assert(!/id="(?:office|boards|commonRoom|operations|sceneStage)"|<canvas|Phòng Họp|Bàn giao mẫu/.test(html));
for(const target of ['PC','CLOUD','DOCUMENTS','RESULTS'])assert(html.includes(`data-board-nav="${target}"`));
assert(html.includes('data-status-scope aria-label="Lọc phạm vi công việc"'));
assert(html.includes('data-status-import'));assert(html.includes('data-status-clear'));
assert(html.includes('không LIVE'));assert(html.includes('Tỷ lệ mốc nghiệm thu'));
assert.deepEqual([...texts['app.js'].matchAll(/from '\.\/([^']+)'/g)].map(m=>m[1]),['status-panel.js'+releaseQuery]);
assert(!/office3d|createOffice|scene3d|startDemo|runIllustration|requestAnimationFrame/.test(texts['app.js']));
assert(texts['status-panel.js'].includes("category==='unfinished'&&Number.isFinite(progress?.percent)"));
assert(texts['status-panel.js'].includes('Kết quả đã làm'));
const {projectMilestones,parsePrivateSnapshot,orderTaskRows,refreshPrivateSnapshotAge}=await moduleFrom(texts['private-snapshot.js']);
const t='2026-10-31T11:00:00Z',now=Date.parse('2026-10-31T12:00:00Z');
const fixture=()=>({taskId:'fixture-only',scope:'PC',state:'BLOCKED',eventAt:t,observedAt:t,reportedAt:t,evidenceRef:'TEST',progress:{planId:'fixture@v1',target:'Synthetic bounded artifact',lifecycle:'OPEN',milestones:['SOURCE','ACCEPTED','DELIVERED'].map((id,i)=>({id,label:id,state:i===0?'DONE':'PENDING',...(i===0?{completedAt:t,evidenceRef:'TEST-SOURCE'}:{})}))}});
assert.equal(projectMilestones(fixture(),now,t).percent,33);
let f=fixture();f.state='UNKNOWN';assert.equal(projectMilestones(f,now,t).percent,null);
f=fixture();for(const m of f.progress.milestones)Object.assign(m,{state:'DONE',completedAt:t,evidenceRef:'TEST'});assert.equal(projectMilestones(f,now,t).percent,100);
f.progress.milestones[2].completedAt='2026-10-31T10:59:00Z';assert.equal(projectMilestones(f,now,t).percent,null);
f=fixture();f.state='CANCELLED';assert.equal(projectMilestones(f,now,t).percent,null);f.progress.lifecycle='CANCELLED';assert.equal(projectMilestones(f,now,t).category,'cancelled');
const snap={schemaVersion:1,mode:'PRIVATE_LOCAL_SNAPSHOT',generatedAt:t,source:{kind:'USER_SUPPLIED_RECEIPT_SUMMARY',label:'Synthetic'},records:[fixture()]};
const projection=parsePrivateSnapshot(JSON.stringify(snap),now);assert.equal(refreshPrivateSnapshotAge(projection,Date.parse('2026-10-31T10:59:00Z')).rows[0].progress.percent,null);
assert.throws(()=>parsePrivateSnapshot(JSON.stringify({...snap,records:[fixture(),fixture()]}),now),/SNAPSHOT_DUPLICATE_TASK_ID/);
const tie=[{taskId:'b',stage:'same',reportedAt:t,progress:{percent:50}},{taskId:'a',stage:'same',reportedAt:t,progress:{percent:50}},{taskId:'unknown',progress:{percent:null}}];
assert.deepEqual(orderTaskRows(tie).map(r=>r.taskId),['a','b','unknown']);assert.deepEqual(orderTaskRows([...tie].reverse()).map(r=>r.taskId),['a','b','unknown']);
console.log('PASS: taskboard-only UI, milestone semantics, exact public files, local-only import/CSP, retained legacy module gates and Pages isolation');
