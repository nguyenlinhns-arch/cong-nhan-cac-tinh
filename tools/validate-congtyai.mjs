import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Script,createContext,runInContext} from 'node:vm';
import assert from 'node:assert/strict';
const dir='tuyen-tho-mo/congtyai/';
const legacy={"app.js":"4e7066611ba8cf4e559d97f8cb1c237a85b81016","handoffs.js":"44f5d3c3ce009083981bc374220d44b6b71a2d30","health.js":"2a1aba5285cacd564e3877d73c485ebead911407","layout3d.js":"c5f4791b779878c666bdd3d5c236de2708f5073b","meeting.js":"a952e8d057cc4b13689e8694c2e6c7fdb726c817","office-fallback.js":"a391be41f23f7e4a07388f7056b2087687643586","office3d.js":"5103318fea51a70afab08803cb3819cc29db439e","portraits.js":"79fe4235bb1efba2057b2c46d30455ec1d176a89","private-snapshot.js":"9f9ae4b64bcebd4150c923443089862d864425cc","quy-trinh-cong-khai.txt":"d42def67278d7d5694610557d2d10076f0648cfa","roles.js":"59773ef03c7bc8f7f5cef3d15295f73e5d5bccbf","rooms.js":"a1787554071d3424a5fe98799dbe872772386b61","status-model.js":"5f092a60d3e3a54cdd8d5c24fef50a6ca14cb095","status-panel.js":"7e7ab022a85dfcee65b185a31dc0a4334303cc21","style.css":"2315c32a52dd899f94379483eaa8083eb8a74714"};
// Owner 15/11 20:1x: "Website công ty AI chỉ cần giữ mô hình 3D thôi" — no subpages; only the 3D office index.html plus retired legacy files.
const subpages=[];
const entries=readdirSync(dir,{withFileTypes:true});
const subdirs=entries.filter(e=>e.isDirectory()).map(e=>e.name).sort();
for(const d of subdirs){assert(subpages.includes(d),'Unexpected folder in congtyai: '+d);assert.deepEqual(readdirSync(dir+d+'/').sort(),['index.html'],'Subpage must contain only index.html: '+d);}
assert.deepEqual(entries.filter(e=>e.isFile()).map(e=>e.name).sort(),[...Object.keys(legacy),'index.html'].sort());
const texts=Object.fromEntries(entries.filter(e=>e.isFile()).map(e=>[e.name,readFileSync(dir+e.name,'utf8')]));
for(const d of subdirs){const page=readFileSync(dir+d+'/index.html','utf8');
 for(const rule of [/branch_link|thread[_-]?id|heartbeat/i,/C:\\|D:\\|\/workspace\/|\/home\//,/sk-[a-zA-Z0-9]{12}|ghp_[a-zA-Z0-9]+/,/mailto:|tel:|\+84[0-9]/,/chatgpt\.site|trycloudflare\.com|127\.0\.0\.1/])assert(!rule.test(page),'Privacy rule ('+d+'): '+rule);
 assert(!/<script[^>]+src=|<iframe|<form\b|fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|serviceWorker/.test(page),'Subpage must not load or call network: '+d);}
// Retired modules stay byte-for-byte unchanged. They are not loaded by this page.
for(const [file,sha] of Object.entries(legacy)){
 const bytes=Buffer.from(texts[file]);
 assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex'),sha,'Legacy file changed: '+file);
 assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket/.test(texts[file]));
}
// /congtyai/ is the 3D office only (owner 15/11). The manual relay chat tool and phong-hop page were removed.
const office=texts['index.html'];
assert(office.includes('Văn phòng 3D'),'Office page missing');
assert(!/<script[^>]+src=|<iframe|<form\b|fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|serviceWorker|indexedDB/.test(office),'Office page must not load or call network');
const all=Object.values(texts).join('\n');
for(const rule of [/branch_link|thread[_-]?id|heartbeat/i,/C:\\|D:\\|\/workspace\/|\/home\//,/sk-[a-zA-Z0-9]{12}|ghp_[a-zA-Z0-9]+/,/mailto:|tel:|\+84[0-9]/,/chatgpt\.site|trycloudflare\.com|127\.0\.0\.1/])assert(!rule.test(all),'Privacy rule: '+rule);
const workflow=readFileSync('.github/workflows/pages.yml','utf8');
assert(workflow.indexOf('mv tuyen-tho-mo/congtyai "$congtyai_tmp"')<workflow.indexOf('node tools/generate-province-pages'));
assert(workflow.includes('mv "$congtyai_tmp" tuyen-tho-mo/congtyai'));
assert(workflow.includes('node tools/validate-congtyai.mjs'));
assert(workflow.includes('path: ./tuyen-tho-mo'));
console.log('PASS: 3D office only, no network calls, privacy rules, retained legacy bytes, Pages isolation.');
