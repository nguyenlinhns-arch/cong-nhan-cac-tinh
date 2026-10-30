import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const dir='tuyen-tho-mo/congtyai/';
const allowed=['app.js','handoffs.js','index.html','portraits.js','quy-trinh-cong-khai.txt','roles.js','rooms.js','style.css'];
assert.deepEqual(readdirSync(dir).sort(),allowed);
const texts=Object.fromEntries(allowed.map(f=>[f,readFileSync(dir+f,'utf8')]));
const all=Object.values(texts).join('\n');
for(const rule of [/localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket/,/branch_link|thread[_-]?id|heartbeat|snapshot|telemetry/i,/C:\\|D:\\|\/workspace\/|\/home\//,/sk-[a-zA-Z0-9]{12}|ghp_[a-zA-Z0-9]+/,/mailto:|tel:|\+84[0-9]/,/chatgpt\.site|trycloudflare\.com|127\.0\.0\.1/]) assert(!rule.test(all),`Privacy/side-effect rule: ${rule}`);
const roles=JSON.parse(texts['roles.js'].replace(/^export const roles = /,'').replace(/;\s*$/,''));
assert.equal(roles.length,18);assert.equal(new Set(roles.map(r=>r.name)).size,18);
for(const n of ['Đào','Quyên','Kiên','Sơn Hà','Tuệ','Khuê','Trúc','Châu','Ngân','Diệu','Khôi'])assert(roles.some(r=>r.name===n));
for(const r of roles){assert.deepEqual(Object.keys(r),['name','title','group','task','standard']);assert(r.task&&r.standard)}
const moduleFrom=text=>import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'));
const {rooms}=await moduleFrom(texts['rooms.js']),{personas,portrait}=await moduleFrom(texts['portraits.js']);
assert.equal(rooms.length,9);assert.equal(Object.keys(personas).length,18);
assert.equal(personas['Đào'].presentation,'female');assert.equal(personas['Khôi'].presentation,'male');
for(const r of roles){assert(personas[r.name]);assert(rooms.some(room=>room.id===personas[r.name].room));assert(portrait(r.name).includes('<svg'));}
assert.equal(new Set(roles.map(r=>portrait(r.name))).size,18);
const html=texts['index.html'];assert(html.includes('<h1>Công ty Nguyễn Linh AI</h1>'));
for(const title of ['Đã làm hôm nay','Đang lỗi','Nhân viên cần sửa'])assert(html.includes(title));
assert(html.indexOf('id="office"')<html.indexOf('id="boards"'));assert(html.includes('UNKNOWN · không tính hoàn thành'));assert(html.includes('Dữ liệu thật: chưa kết nối'));
assert(html.includes('100 mã công đoạn'));assert(html.includes('không suy đoán từ tên'));
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
const workflow=readFileSync('.github/workflows/pages.yml','utf8');
assert(workflow.indexOf('mv tuyen-tho-mo/congtyai "$congtyai_tmp"')<workflow.indexOf('node tools/generate-province-pages'));
assert(workflow.includes('mv "$congtyai_tmp" tuyen-tho-mo/congtyai'));assert(workflow.includes('trap restore_dashboard EXIT'));assert(workflow.includes('node tools/validate-congtyai.mjs'));
console.log('PASS: 18 public roles/portraits, 9 rooms, exact brand/3 disconnected boards, privacy/no connections, source-driven demo ordering/dedup/fixture integrity/reduced-motion hooks, asset imports and Pages isolation');
