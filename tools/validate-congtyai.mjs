import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const dir='tuyen-tho-mo/congtyai/';
const allowed=['app.js','handoffs.js','health.js','index.html','meeting.js','office3d.js','portraits.js','quy-trinh-cong-khai.txt','roles.js','rooms.js','style.css'];
assert.deepEqual(readdirSync(dir).sort(),allowed);
const texts=Object.fromEntries(allowed.map(f=>[f,readFileSync(dir+f,'utf8')]));
const all=Object.values(texts).join('\n');
for(const rule of [/localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket/,/branch_link|thread[_-]?id|heartbeat|snapshot|telemetry/i,/C:\\|D:\\|\/workspace\/|\/home\//,/sk-[a-zA-Z0-9]{12}|ghp_[a-zA-Z0-9]+/,/mailto:|tel:|\+84[0-9]/,/chatgpt\.site|trycloudflare\.com|127\.0\.0\.1/]) assert(!rule.test(all),`Privacy/side-effect rule: ${rule}`);
const roles=JSON.parse(texts['roles.js'].replace(/^export const roles = /,'').replace(/;\s*$/,''));
assert.equal(roles.length,19);assert.equal(new Set(roles.map(r=>r.name)).size,19);
for(const n of ['Đào','Quyên','Kiên','Sơn Hà','Tuệ','Khuê','Trúc','Châu','Ngân','Diệu','Khôi','An'])assert(roles.some(r=>r.name===n));
for(const r of roles){assert.deepEqual(Object.keys(r),['name','title','group','task','standard']);assert(r.task&&r.standard)}
const moduleFrom=text=>import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'));
const {rooms}=await moduleFrom(texts['rooms.js']),{personas,portrait}=await moduleFrom(texts['portraits.js']);
assert.equal(rooms.length,11);assert.equal(Object.keys(personas).length,19);
assert.equal(personas['Đào'].presentation,'female');assert.equal(personas['Đào'].room,'ceo');assert.equal(personas['Quyên'].room,'vp-process');assert.equal(personas['Khôi'].room,'vp-repair');assert.equal(Object.values(personas).filter(p=>p.room==='ceo').length,1);assert.equal(personas['Khôi'].presentation,'male');
for(const r of roles){assert(personas[r.name]);assert(rooms.some(room=>room.id===personas[r.name].room));assert(portrait(r.name).includes('<svg'));}
assert.equal(new Set(roles.map(r=>portrait(r.name))).size,19);
const html=texts['index.html'];assert(html.includes('<h1>Công ty Nguyễn Linh AI</h1>'));
for(const title of ['Đã làm hôm nay','Đang lỗi','Nhân viên cần sửa'])assert(html.includes(title));
assert(html.indexOf('id="office"')<html.indexOf('id="boards"'));assert(html.includes('UNKNOWN · không tính hoàn thành'));assert(html.includes('Dữ liệu thật: chưa kết nối'));
assert(html.includes('108 mã công đoạn'));assert(html.includes('không suy đoán từ tên'));
for(const m of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g))assert(allowed.includes(m[1]),`Missing asset ${m[1]}`);
for(const m of texts['app.js'].matchAll(/from '\.\/([^']+)'/g))assert(allowed.includes(m[1]));
assert(texts['style.css'].includes('prefers-reduced-motion'));assert(texts['style.css'].includes('repeat(3,minmax(0,1fr))'));
assert(texts['app.js'].includes("$('#startDemo').onclick"));assert(!texts['app.js'].includes('setInterval'));
const {demoRoute,createDemoLedger,makeDemoEvent}=await moduleFrom(texts['handoffs.js']);
assert.deepEqual(demoRoute,['Đào','Quyên','Kiên','Ngọc Lan','Khuê','Quyên','Đào']);
const ledger=createDemoLedger('qa-demo');
for(let i=0;i<6;i++){const e=makeDemoEvent('qa-demo',i);assert.equal(ledger.append(e),true);assert.equal(ledger.append(e),false);}
assert.equal(ledger.events.length,6);assert(Object.isFrozen(ledger.events[0]));
for(const invalid of [null,{},makeDemoEvent('other',0),makeDemoEvent('qa-test',1),{...makeDemoEvent('qa-test',0),mode:'LIVE'},{...makeDemoEvent('qa-test',0),evidence:'not-a-fixture'},{...makeDemoEvent('qa-test',0),to:'Kiên'}])assert.throws(()=>createDemoLedger('qa-test').append(invalid));
assert(html.includes('Chưa kết nối hội thoại công việc'));assert(html.includes('Trao đổi không phải lệnh thực thi hoặc cấp quyền'));assert(html.includes('id="tabDiscussion"'));
const workflow=readFileSync('.github/workflows/pages.yml','utf8');
assert(workflow.indexOf('mv tuyen-tho-mo/congtyai "$congtyai_tmp"')<workflow.indexOf('node tools/generate-province-pages'));
assert(workflow.includes('mv "$congtyai_tmp" tuyen-tho-mo/congtyai'));assert(workflow.includes('trap restore_dashboard EXIT'));assert(workflow.includes('node tools/validate-congtyai.mjs'));
console.log('PASS: 19 public roles/portraits, 11 rooms, exact brand/3 disconnected boards, privacy/no connections, source-driven demo ordering/dedup/fixture integrity/reduced-motion hooks, asset imports and Pages isolation');

assert(texts['office3d.js'].includes("canvas.getContext('webgl'"));assert(texts['office3d.js'].includes('document.hidden'));assert(texts['office3d.js'].includes('requestAnimationFrame'));assert(texts['office3d.js'].includes('moving.elapsed'));

const {officeHealth}=await moduleFrom(texts['health.js']);assert.equal(officeHealth().state,'UNKNOWN');assert.equal(officeHealth().allowOperationalAnimation,false);const h=(source,status)=>officeHealth({verified:true,source,status,observedAt:1000},2000);assert.equal(h('pc-agent','POWER_OFF_CONFIRMED').label,'Văn phòng mất điện');assert.equal(h('network-monitor','DEGRADED_CONFIRMED').label,'Văn phòng mất mạng');assert.equal(h('auth-gateway','DENIED').state,'CONTROL_BLOCKED');assert.equal(h('pc-agent','TIMEOUT').state,'UNKNOWN');assert.equal(officeHealth({verified:true,source:'pc-agent',status:'READY_CONFIRMED',observedAt:0},90000).state,'UNKNOWN');

assert.equal(officeHealth().label,'Chưa kết nối dữ liệu PC');assert.equal(h('auth-gateway',403).state,'CONTROL_BLOCKED');assert.equal(officeHealth({verified:true,source:'pc-agent',status:'READY_CONFIRMED',observedAt:0,previouslyConnected:true},90000).label,'Văn phòng mất kết nối, đang xác minh');assert.equal(officeHealth({verified:true,source:'pc-agent',status:'READY_CONFIRMED',observedAt:0},90000).label,'Chưa kết nối dữ liệu PC');

assert(html.includes('Phòng Họp'));assert(html.includes('<fieldset disabled>'));assert(html.includes('Không có tin nhắn thật hoặc lịch sử riêng'));

const {meetingGate}=await moduleFrom(texts['meeting.js']);assert.equal(meetingGate().state,'HOLD');const opinion=person=>({id:'sample-'+person,jobId:'sample',revision:2,person,verified:true,sourceRef:'sample-only',comment:'Fixture opinion'});const mg=opinions=>meetingGate({jobId:'sample',revision:2,participantSetVerified:true,required:['An'],opinions});assert.equal(mg([opinion('Quyên'),opinion('Khôi')]).state,'HOLD');assert.equal(mg([opinion('Quyên'),opinion('Khôi'),{...opinion('An'),revision:1}]).state,'HOLD');assert.equal(mg([opinion('Quyên'),opinion('Quyên'),opinion('Khôi')]).state,'HOLD');assert.equal(mg([opinion('Quyên'),opinion('Khôi'),opinion('An')]).state,'READY_FOR_QUYEN');assert.equal(mg([opinion('Quyên'),opinion('Khôi'),opinion('An')]).mayExecute,false);

assert.equal(mg([{...opinion('Quyên'),id:'duplicate'}, {...opinion('Khôi'),id:'duplicate'},opinion('An')]).state,'HOLD');

assert.equal(meetingGate({jobId:'sample',revision:2,participantSetVerified:true,opinions:[opinion('Quyên'),opinion('Khôi')]}).state,'HOLD');assert.equal(meetingGate({jobId:'sample',revision:2,required:['An'],opinions:[opinion('Quyên'),opinion('Khôi'),opinion('An')]}).state,'HOLD');
