import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(`tuyen-tho-mo/${p}`,'utf8');
const scripts=['worker-info-finder.js','home-worker-journey.js','journey-optimizer.js'];
for(const p of scripts)new vm.Script(read(p),{filename:p});
function harness({old=true,blocked=false,search="",attribution=""}={}){
 const events={},listeners={},values={},local=new Map(),session=new Map();
 const storage=map=>({getItem:k=>{if(blocked)throw Error('storage denied');return map.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('storage denied');map.set(k,v);},removeItem:k=>{if(blocked)throw Error('storage denied');map.delete(k);}});
 if(old){session.set('thaylinh_home_condition_state','pass');local.set('thaylinh_worker_journey_v3',JSON.stringify({version:3,last_seen_at:new Date().toISOString(),condition_pass:true,score:10,stage:'condition_pass',last_action:'condition_pass',paths:['/'],groups:['home'],page_count:1}));}
 if(attribution)local.set("thaylinh_attribution",JSON.stringify({utm_content:attribution,first_utm_content:attribution,utm_source:'google',utm_campaign:'keep'}));
 let observed;
 const result={dataset:{},hidden:true,focus(){this.focused=true},scrollIntoView(o){this.scroll=o}};
 const button={dataset:{},setAttribute(){},removeAttribute(){}};
 const form={addEventListener:(k,v)=>events[k]=v,querySelector:s=>{const n=s.match(/name="([^"]+)"/)?.[1];return s.includes(':checked')?(values[n]?{value:values[n]}:null):{focus(){form.focused=n}}}};
 const document={readyState:'complete',documentElement:{dataset:{}},head:{append(){}},querySelector:s=>s==='[data-worker-check-form]'?form:s==='[data-worker-check-result]'?result:s==='.home-funnel'?{}:s.includes('.tl-mobile-contact__journey')?button:null,querySelectorAll:()=>[],createElement:()=>({dataset:{}}),addEventListener:(k,f)=>{(listeners[k]??=[]).push(f)}};
 const window={dataLayer:[],setTimeout(){},addEventListener(){},matchMedia:()=>({matches:true})};
 const context={window,document,location:{pathname:'/',search,origin:'https://example.test'},localStorage:storage(local),sessionStorage:storage(session),URL,URLSearchParams,Date,console,requestAnimationFrame:f=>f(),MutationObserver:class{constructor(f){observed=f}observe(){}},setTimeout(){}};
 vm.createContext(context);for(const p of ['journey-optimizer.js','worker-info-finder.js','home-worker-journey.js'])vm.runInContext(read(p),context);
 return {window,values,result,button,form,local,session,submit(){events.submit({preventDefault(){}});observed?.();}};
}
for(const blocked of [false,true]){
 const h=harness({blocked});
 h.submit();assert.equal(h.result.dataset.state,'incomplete');assert.equal(h.form.focused,'age_range');
 for(const key of ['age_range','height_range','weight_range','health_screen'])h.values[key]='yes';
 h.submit();assert.equal(h.result.dataset.state,'pass');assert.match(h.result.innerHTML,/Tiếp tục đăng ký/);assert.match(h.button.href,/#dang-ky/);assert.equal(h.result.scroll.behavior,'auto');
 h.values.health_screen='review';h.submit();assert.equal(h.result.dataset.state,'review');assert.equal(h.button.href,'https://zalo.me/0963048585');assert.match(h.result.innerHTML,/chưa phải kết luận cuối cùng/);
 h.values.health_screen='yes';h.submit();assert.equal(h.result.dataset.state,'pass');
 delete h.values.weight_range;h.submit();assert.equal(h.button.href,'#tu-kiem-tra');
 assert(!h.window.dataLayer.some(e=>e.result||e.eligibility||e.condition_state||e.event==='condition_pass'||['condition_pass','condition_review'].includes(e.stage)));
 if(!blocked){assert.equal(h.session.get('thaylinh_home_condition_state'),undefined);const state=JSON.parse(h.local.get('thaylinh_worker_journey_v3'));assert(!('condition_pass' in state));assert.equal(state.stage,'view');assert.equal(state.score,0);}
 // A legacy event cannot recreate eligibility state; actual submission tracking remains.
 h.window.dataLayer.push({event:'condition_pass'});
 if(!blocked)assert(!('condition_pass' in JSON.parse(h.local.get('thaylinh_worker_journey_v3'))));
 h.window.dataLayer.push({event:'ApplicationSubmit'});
 if(!blocked)assert.equal(JSON.parse(h.local.get('thaylinh_worker_journey_v3')).stage,'form_submit');
}
for(const content of ['pass','condition_pass','condition_review']){
 for(const mode of ['query','saved']){const h=harness({old:false,search:mode==='query'?`?utm_content=${content}`:'',attribution:mode==='saved'?content:''});assert.equal(JSON.parse(h.local.get('thaylinh_worker_journey_v3')).content,'');if(mode==='saved'){const saved=JSON.parse(h.local.get('thaylinh_attribution'));assert.equal(saved.utm_content,undefined);assert.equal(saved.first_utm_content,undefined);assert.equal(saved.utm_source,'google');assert.equal(saved.utm_campaign,'keep');}}
}
assert(read('v4-conversion.js').includes('Gửi thông tin để Thầy Linh tư vấn'));
const home=read('index.html');assert(!/data-home-content-loader>addEventListener\("load"/.test(home));assert(home.includes('<noscript><link rel="stylesheet" href="/home-content.css?v=3">'));
const load=home.match(/<script data-home-content-loader>([\s\S]*?)<\/script>/)[1];let appended;vm.runInNewContext(load,{document:{createElement:()=>({}),head:{append:n=>appended=n}}});assert.equal(appended.href,'/home-content.css?v=3');
assert(home.includes('TIN NGÀNH THAN CHỌN LỌC'));assert(read('kiem-tra-dieu-kien/index.html').includes('Gửi thông tin để Thầy Linh tư vấn'));
assert(read('homepage-redesign-critical.css').includes('.home-v6-facts span{font-size:13px;'));
console.log(JSON.stringify({status:'passed',checks:['incomplete focus','pass CTA','review Zalo','repeat answers','pass-to-incomplete resets CTA','fresh-state legacy URL/attribution sanitized','reduced-motion result scroll','storage denied','legacy screening cleanup','no outcome analytics','legacy event ignored','actual submission event preserved','CSS starts immediately','noscript fallback','accurate CTA/news labels','mobile explanatory font source']},null,2));
