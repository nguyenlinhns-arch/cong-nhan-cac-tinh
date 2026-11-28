import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {oldMiningTrainingCopy, updateMiningTrainingCopy} from "./recruitment-training-copy.mjs";

const site = path.resolve("tuyen-tho-mo");
const source = JSON.parse(fs.readFileSync("content/recruitment-facts-2026.json", "utf8"));
const live = JSON.parse(fs.readFileSync(path.join(site,"data/recruitment-facts-2026.json"), "utf8"));
const training = {khai_thac_mo:"2 tháng", xay_dung_mo:"2 tháng", co_dien_mo:"10 tháng"};
assert.deepEqual(source.training, training);
assert.deepEqual(live.training, training);
assert.equal(source.study_benefits.living_support, "7,5 triệu đồng trong thời gian học");
const stale = new RegExp(oldMiningTrainingCopy.source, "iu");
for (const [before, after] of [
  ["học khoảng 2–3 tháng","học 2 tháng"],
  ["HỌC 2–3 THÁNG","HỌC 2 THÁNG"],
  ["học 2–3/10 tháng","học 2 hoặc 10 tháng"],
  ["học 2/10 tháng","học 2 hoặc 10 tháng"],
  ["học 2–3 hoặc 10 tháng","học 2 hoặc 10 tháng"],
  ["Cơ điện mỏ 10 tháng","Cơ điện mỏ 10 tháng"],
  ["học 2 hoặc 10 tháng","học 2 hoặc 10 tháng"],
  ["/bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/","/bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/"],
]) assert.equal(updateMiningTrainingCopy(before), after);
const excluded = new Set(["nhap-hoc","diaban","congtyai","kenlop9","zalo"]);
const normalizeLocalities = process.argv.includes("--normalize-localities");
let checked=0, updated=0;
const errors=[];
function walk(dir) {
  for (const item of fs.readdirSync(dir,{withFileTypes:true})) {
    const file=path.join(dir,item.name);
    if(item.isDirectory() && !excluded.has(item.name)) walk(file);
    if(!item.isFile() || !/\.(?:html|js|json|xml|txt)$/iu.test(item.name)) continue;
    checked++;
    const rel=path.relative(site,file);
    const before=fs.readFileSync(file,"utf8");
    let after=before;
    if(normalizeLocalities && rel.startsWith("viec-lam-nganh-than/")) {
      after=updateMiningTrainingCopy(before);
      if(after!==before) { fs.writeFileSync(file,after); updated++; }
    }
    const match=after.match(stale);
    if(match) errors.push({file:rel,text:match[0]});
  }
}
walk(site);
console.log(JSON.stringify({checked,updated,errors:errors.length,examples:errors.slice(0,20)},null,2));
if(errors.length) process.exitCode=1;
