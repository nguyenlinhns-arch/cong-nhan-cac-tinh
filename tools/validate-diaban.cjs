const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve('tuyen-tho-mo/diaban'),M=require(path.join(root,'model.js'));
require(path.join(root,'demo.js'));
const demo=M.validate(globalThis.DASHBOARD_DEMO);assert.equal(demo.synthetic,true);assert.equal(demo.provinces.length,12);assert.equal(demo.yearly.length,144);
assert.equal(demo.provinces.filter(p=>p.priority).length,2);assert.ok(demo.provinces.every(p=>!p.sourceUrl));
assert.ok(demo.rows.every(r=>r.unmapped||r.name.startsWith('Xã minh họa')));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const m of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(m[1]),'Missing element '+m[1]);
for(const file of ['index.html','styles.css','model.js','demo.js','app.js','icon.svg'])assert.ok(fs.statSync(path.join(root,file)).size>0);
for(const file of ['app.js','model.js','demo.js']){const s=fs.readFileSync(path.join(root,file),'utf8');assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB)\b/.test(s));}
assert.ok(html.includes("connect-src 'none'"));assert.ok(html.includes('DỮ LIỆU MINH HỌA'));assert.ok(app.includes('MINH-HOA-'));
console.log('PASS: 12 synthetic provinces, reconciled totals, explicit demo labels, valid DOM targets, no data network/storage APIs');
