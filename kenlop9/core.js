/* Ken revision engine: no network, account or personal data. */
(function (root) {
'use strict';
const STORAGE_KEY='kenlop9.revision.v1';
function validateBank(bank){
 if(!Array.isArray(bank))throw Error('Ngân hàng câu hỏi không hợp lệ.');
 const ids=new Set(),stems=new Set();
 for(const q of bank){
  if(!q||!['id','subject','topic','stem','explanation'].every(k=>typeof q[k]==='string'&&q[k].trim())||!Array.isArray(q.options)||q.options.length!==4||!q.options.every(x=>typeof x==='string'&&x.trim())||new Set(q.options.map(x=>x.trim())).size!==4||!Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>3)throw Error('Câu hỏi không hợp lệ: '+(q?.id||'?'));
  const stem=JSON.stringify([q.subject,q.stem.trim().replace(/\s+/g,' '),q.options.map(x=>x.trim().replace(/\s+/g,' ')).sort()]);
  if(ids.has(q.id)||stems.has(stem))throw Error('Câu hỏi trùng: '+q.id);
  ids.add(q.id);stems.add(stem);
 }
 return bank;
}
function fingerprint(bank){let h=2166136261;for(const c of JSON.stringify(bank)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return 'revision-1-'+(h>>>0).toString(16);}
function shuffle(a,rng=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function makeSession(bank,{mode='practice',shuffleItems=true,limit=0}={},rng=Math.random){
 let qs=shuffleItems?shuffle(bank,rng):bank.slice();if(limit>0)qs=qs.slice(0,limit);
 return {mode,items:qs.map(q=>({id:q.id,order:shuffleItems?shuffle([0,1,2,3],rng):[0,1,2,3]})),answers:{},submitted:false};
}
function score(session,bank){const byId=new Map(bank.map(q=>[q.id,q])),bySubject={};let correct=0,wrong=0,blank=0;const retryIds=[];
 for(const item of session.items){const q=byId.get(item.id);if(!q)throw Error('Câu hỏi đã thay đổi.');const a=session.answers[q.id];let status;
 if(!Number.isInteger(a)){blank++;status='blank';}else if(a===q.answerIndex){correct++;status='correct';}else{wrong++;status='wrong';}
 const s=bySubject[q.subject]||(bySubject[q.subject]={correct:0,wrong:0,blank:0,total:0});s[status]++;s.total++;if(status!=='correct')retryIds.push(q.id);
 }const total=session.items.length;return{correct,wrong,blank,total,points:total?Math.round(correct/total*100)/10:0,bySubject,retryIds};}
function restore(raw,version,bank){try{const data=JSON.parse(raw);if(data.version!==version)return null;const s=data.session;const ids=new Set(bank.map(q=>q.id));if(!s||!['practice','exam'].includes(s.mode)||!Array.isArray(s.items)||!s.items.length||new Set(s.items.map(i=>i.id)).size!==s.items.length||typeof s.submitted!=='boolean'||!s.answers||typeof s.answers!=='object'||Array.isArray(s.answers))return null;
 for(const i of s.items)if(!ids.has(i.id)||!Array.isArray(i.order)||i.order.length!==4||!i.order.every(n=>Number.isInteger(n)&&n>=0&&n<=3)||[...i.order].sort().join()!=='0,1,2,3')return null;
 for(const [id,a]of Object.entries(s.answers))if(!s.items.some(i=>i.id===id)||!Number.isInteger(a)||a<0||a>3)return null;
 return s;
 }catch{return null;}}
function save(storage,version,session){try{storage.setItem(STORAGE_KEY,JSON.stringify({version,session}));return true;}catch{return false;}}
function reset(storage,confirmed){if(!confirmed)return false;try{storage.removeItem(STORAGE_KEY);return true;}catch{return false;}}
const api={STORAGE_KEY,validateBank,fingerprint,shuffle,makeSession,score,restore,save,reset};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KenCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
