import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import {webcrypto} from "node:crypto";
const backend = fs.readFileSync("operations/apps-script/Code.gs","utf8");
const front = fs.readFileSync("tuyen-tho-mo/recruitment-callback.js","utf8");
const html = fs.readFileSync("tuyen-tho-mo/yeu-cau-goi-lai/index.html","utf8");
assert.deepEqual([...html.matchAll(/(?:input|select) [^>]*?name="([^"]+)"/g)].map(m=>m[1]),["full_name","phone","province","trade","consent"]);
assert.match(html,/https:\/\/zalo\.me\//); assert.match(html,/href="tel:/);
const rows = []; let alertCount=0, lock=false, failWrite=false;
const names = ["Mã đăng ký","Họ và tên","Số điện thoại","Tỉnh/thành","Nghề quan tâm","Chiều cao (cm)","Cân nặng (kg)","Trạng thái","Phụ trách","Hạn phản hồi"];
const sheet = {getLastRow:()=>1+rows.length,getLastColumn:()=>names.length,getRange:()=>({setValues(v){assert.ok(lock);if(failWrite) throw Error("test write error");rows.push(v[0]);}})};
const crm=vm.createContext({sheet,rows,names,countAlert:()=>++alertCount,console:{error(){}},
  LockService:{getScriptLock:()=>({waitLock(){assert.ok(!lock);lock=true;},releaseLock(){lock=false;}})},
  SpreadsheetApp:{flush(){assert.ok(lock);}},PropertiesService:{getScriptProperties:()=>({getProperty:k=>k==="DEFAULT_OWNER"?"Người phụ trách thử":""})},
  ContentService:{MimeType:{JSON:"json"},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})}});
vm.runInContext(backend,crm);
vm.runInContext(`getCandidateSheet_=()=>sheet;ensureHeaders_=()=>{};headerMap_=()=>Object.fromEntries(names.map((n,i)=>[n,i+1]));findCode_=(_sheet, code)=>{const i=rows.findIndex(r=>r[0]===code);return i<0?null:{getRow:()=>i+2};};sendNewLeadAlert_=()=>{countAlert();return true;};refreshSourcePerformance_=()=>{throw Error("dashboard unavailable")};`,crm);
const inputs={full_name:"Ứng viên thử",phone:"0900000000",province:"Tỉnh thử",trade:"Cần tư vấn chọn nghề",consent:"on"};
const button={disabled:true}; const status={textContent:""}; const submitted=[]; let loseReply=true, didReset=false, submit;
const form={addEventListener(_,fn){submit=fn;}, querySelector:()=>button,reportValidity:()=>true,elements:{namedItem:()=>({focus(){}})},setAttribute(){},removeAttribute(){},reset(){didReset=true;}};
const fetch=async (_url,init)=>{
  const data=init.body?JSON.parse(init.body):null;
  const reply=data?crm.doPost({postData:{contents:init.body}}):crm.doGet();
  if(data){submitted.push(data);if(loseReply){loseReply=false;throw Error("response lost after save");}}
  return {ok:true,json:async()=>reply};
};
vm.runInNewContext(front,{document:{querySelector:s=>s==="[data-callback-form]"?form:status},window:{THAY_LINH_RECRUITMENT:{endpoint:"https://example.invalid/test"}},fetch,FormData:class{*[Symbol.iterator](){yield*Object.entries(inputs)}},crypto:webcrypto,AbortController,setTimeout,clearTimeout});
await new Promise(resolve=>setImmediate(resolve));assert.equal(button.disabled,false);
await submit({preventDefault(){}});assert.match(status.textContent,/Chưa xác nhận/);assert.equal(rows.length,1);assert.equal(didReset,false);
await submit({preventDefault(){}});assert.match(status.textContent,/đã nhận yêu cầu gọi lại/);assert.equal(rows.length,1);assert.equal(alertCount,1);assert.equal(didReset,true);
assert.equal(submitted[0].code,submitted[1].code);assert.equal(rows[0][5],"");assert.equal(rows[0][6],"");assert.equal(rows[0][7],"Mới");assert.equal(rows[0][8],"Người phụ trách thử");assert.ok(rows[0][9]);
assert.deepEqual(Object.keys(submitted[0]).sort(),["code","consent","full_name","medium","phone","province","request_kind","schema_version","source","trade"]);
const send=p=>crm.doPost({postData:{contents:JSON.stringify({...submitted[0],code:"TL-261127-TEST2",...p})}});
assert.equal(send({consent:false}).ok,false);assert.equal(send({height_cm:153}).ok,false);
failWrite=true;assert.equal(send({}).ok,false);assert.equal(rows.length,1);assert.equal(alertCount,1);assert.equal(lock,false);
console.log("PASS: callback selected fields, fallback links, write failure, lost reply and retry, one stored row and owner, one alert, post-save dashboard failure");
