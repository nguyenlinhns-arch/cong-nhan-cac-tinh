import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {Script,createContext,runInContext} from 'node:vm';
import assert from 'node:assert/strict';
const dir='tuyen-tho-mo/congtyai/';
const legacy={"app.js":"4e7066611ba8cf4e559d97f8cb1c237a85b81016","handoffs.js":"44f5d3c3ce009083981bc374220d44b6b71a2d30","health.js":"2a1aba5285cacd564e3877d73c485ebead911407","layout3d.js":"c5f4791b779878c666bdd3d5c236de2708f5073b","meeting.js":"a952e8d057cc4b13689e8694c2e6c7fdb726c817","office-fallback.js":"a391be41f23f7e4a07388f7056b2087687643586","office3d.js":"5103318fea51a70afab08803cb3819cc29db439e","portraits.js":"79fe4235bb1efba2057b2c46d30455ec1d176a89","private-snapshot.js":"9f9ae4b64bcebd4150c923443089862d864425cc","quy-trinh-cong-khai.txt":"d42def67278d7d5694610557d2d10076f0648cfa","roles.js":"59773ef03c7bc8f7f5cef3d15295f73e5d5bccbf","rooms.js":"a1787554071d3424a5fe98799dbe872772386b61","status-model.js":"5f092a60d3e3a54cdd8d5c24fef50a6ca14cb095","status-panel.js":"7e7ab022a85dfcee65b185a31dc0a4334303cc21","style.css":"2315c32a52dd899f94379483eaa8083eb8a74714"};
assert.deepEqual(readdirSync(dir).sort(),[...Object.keys(legacy),'index.html','phong-hop'].sort());
assert.deepEqual(readdirSync(dir+'phong-hop/').sort(),['index.html']);
const texts=Object.fromEntries([...Object.keys(legacy),'index.html'].map(f=>[f,readFileSync(dir+f,'utf8')]));
const meetingPage=readFileSync(dir+'phong-hop/index.html','utf8');
assert(meetingPage.startsWith('<!doctype html>'));
assert(meetingPage.includes('<h1>Công ty AI — Phòng họp trực tiếp</h1>'));
assert(meetingPage.includes("default-src 'none'"));
assert(!/<script\b|<iframe\b|<form\b|<img\b/i.test(meetingPage));
// Retired modules stay byte-for-byte unchanged. They are not loaded by this page.
for(const [file,sha] of Object.entries(legacy)){
 const bytes=Buffer.from(texts[file]);
 assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex'),sha,'Legacy file changed: '+file);
 assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|WebSocket/.test(texts[file]));
}
const html=texts['index.html'],all=[...Object.values(texts),meetingPage].join('\n');
for(const rule of [/branch_link|thread[_-]?id|heartbeat/i,/C:\\|D:\\|\/workspace\/|\/home\//,/sk-[a-zA-Z0-9]{12}|ghp_[a-zA-Z0-9]+/,/mailto:|tel:|\+84[0-9]/,/chatgpt\.site|trycloudflare\.com|127\.0\.0\.1/])assert(!rule.test(all),'Privacy rule: '+rule);
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length,1);const js=scripts[0][1];
assert(!/<script[^>]+src=|<iframe|<form\b|<img\b/.test(html));
assert(!/fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|indexedDB|serviceWorker|innerHTML|insertAdjacentHTML|eval\s*\(|new Function/.test(js));
new Script(js);
const digest=createHash('sha256').update(js).digest('base64');
for(const directive of ["default-src 'none'","script-src 'sha256-"+digest+"'","connect-src 'none'","form-action 'none'","object-src 'none'","worker-src 'none'","base-uri 'none'"])assert(html.includes(directive));
assert(!html.includes('unsafe-eval'));assert(html.includes('<h1>Phòng chat AI</h1>'));
for(const text of ['Chuyển tin thủ công','chưa xác minh nguồn','chỉ lưu trong trình duyệt này','14 ý kiến gần nhất','aria-live="polite"'])assert(html.includes(text));
assert(html.includes('https://thaylinhtuyenthomo.vn/congtyai/'));
assert(html.includes('rel="noopener noreferrer"'));
const workflow=readFileSync('.github/workflows/pages.yml','utf8');
assert(workflow.indexOf('mv tuyen-tho-mo/congtyai "$congtyai_tmp"')<workflow.indexOf('node tools/generate-province-pages'));
assert(workflow.includes('mv "$congtyai_tmp" tuyen-tho-mo/congtyai'));
assert(workflow.includes('node tools/validate-congtyai.mjs'));
assert(workflow.includes('path: ./tuyen-tho-mo'));
// Run production inline code in a minimal DOM. Browser integration is additionally
// exercised during release QA; no user data or private fixtures belong here.
function harness(saved=null,failSave=false,clipboardFail=false){
 const elements=new Map();
 function elem(){
  return {value:'',textContent:'',dataset:{},style:{},children:[],attributes:{},
   append(...x){this.children.push(...x)},appendChild(x){this.children.push(x)},
   setAttribute(k,v){this.attributes[k]=String(v)},focus(){},select(){},remove(){}};
 }
 const document={getElementById(id){if(!elements.has(id))elements.set(id,elem());return elements.get(id)},
  createElement:elem,body:elem(),execCommand:()=>false};
 let stored=saved;
 const ctx=createContext({document,localStorage:{getItem:()=>stored,setItem:(k,v)=>{if(failSave)throw Error('full');stored=v}},
  navigator:{clipboard:{writeText:async()=>{if(clipboardFail)throw Error('denied')}}},
  setTimeout:()=>0,console});
 runInContext(js,ctx);
 return {ctx,e:id=>document.getElementById(id),get stored(){return stored},run:code=>runInContext(code,ctx)};
}
const h=harness();
assert.equal(h.run('S.log.length'),0);assert.equal(h.run('S.task'),'');assert.equal(h.run('S.cur'),0);
assert.deepEqual(Array.from(h.run('BASE.map(b=>b[1])')),['https://chatgpt.com','https://gemini.google.com','https://grok.com','https://claude.ai']);
assert(h.run('Object.isFrozen(BASE)&&BASE.every(Object.isFrozen)'));
h.e('task').oninput({target:{value:'Synthetic test task'}});assert(h.e('out').value.includes('Synthetic test task'));
h.e('reply').value='Synthetic reply';h.e('saveReply').onclick();assert.equal(h.run('S.log.length'),1);assert.equal(h.run('S.cur'),1);
h.e('note').value='<img src=x onerror=alert(1)>';h.e('addNote').onclick();assert.equal(h.run('S.log[1].text'),'<img src=x onerror=alert(1)>');
assert(h.e('out').value.includes('dán thủ công, chưa xác minh'));
const valid=JSON.parse(h.stored),poison=structuredClone(valid);poison.agents[0].url='javascript:alert(1)';
const safe=harness(JSON.stringify(poison));assert.equal(safe.run('S.agents[0].url'),'https://chatgpt.com');
for(const bad of [null,[],{}, {...valid,agents:[]},{...valid,cur:-1},{...valid,cur:4},{...valid,log:[null]},{...valid,keep:0},{...valid,preset:'__proto__'},{...valid,task:123}]){
 const broken=harness(JSON.stringify(bad));assert.equal(broken.run('S.log.length'),0);assert(broken.e('storageStatus').textContent.includes('Không đọc được'));
}
const quota=harness(null,true);quota.e('task').oninput({target:{value:'Synthetic'}});assert(quota.e('storageStatus').textContent.includes('Chưa lưu được'));
const failed=harness(null,false,true);assert.equal(await failed.run('copy("Synthetic", $("copyOut"))'),false);assert(failed.e('actionStatus').textContent.includes('Không sao chép được'));assert.equal(failed.e('out').value,'Synthetic');
assert.equal(await h.run('copy("Synthetic", $("copyOut"))'),true);assert.equal(h.e('copyOut').textContent,'Đã sao chép');
h.e('reset').onclick({target:h.e('reset')});assert.equal(h.run('S.log.length'),2);
h.e('reset').onclick({target:h.e('reset')});assert.equal(h.run('S.log.length'),0);assert.equal(h.run('S.task'),'');
assert(h.run('finalPrompt()').includes('CHỈ 14 Ý KIẾN'));
console.log('PASS: manual relay, empty public state, text-only rendering, strict saved-state schema, fixed AI URLs, clipboard/storage errors, reset confirmation, CSP hash, no networking, retained legacy bytes, Pages isolation.');
