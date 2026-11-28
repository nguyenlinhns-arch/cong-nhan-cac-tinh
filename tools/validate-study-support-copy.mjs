import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {legacyMonthlySupport} from "./study-support-copy.mjs";

const site = path.resolve(import.meta.dirname, "../tuyen-tho-mo");
const publicFacts = JSON.parse(fs.readFileSync(path.join(site, "data/recruitment-facts-2026.json"), "utf8"));
const sourceFacts = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "../content/recruitment-facts-2026.json"), "utf8"));
const exact = "7,5 triệu đồng trong thời gian học";
const stale = new RegExp(legacyMonthlySupport.source, "iu");
assert.deepEqual(publicFacts.study_benefits, sourceFacts.study_benefits);
assert.equal(publicFacts.study_benefits.living_support, exact);
assert.match(fs.readFileSync(path.join(site, "index.html"), "utf8"), /Hỗ trợ 7,5 triệu đồng trong thời gian học/u);
for (const fixture of [
  "7,5 triệu đồng/tháng", "7.5 triệu/tháng", "7,5 triệu đồng mỗi tháng",
  "7,5 triệu đồng/tháng mỗi tháng trong thời gian học",
]) assert.equal(fixture.replace(legacyMonthlySupport, exact), exact);
for (const fixture of [exact, "20–25 triệu đồng/tháng", "7,5 triệu người", "học 2–3 tháng"]) {
  assert.equal(fixture.replace(legacyMonthlySupport, exact), fixture);
}
const report = {checked:0, errors:[]};
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !["nhap-hoc","diaban","congtyai","kenlop9"].includes(e.name)) walk(p);
    else if (e.isFile() && /\.(html|json|js|xml|txt)$/iu.test(e.name)) {
      report.checked++;
      const m=fs.readFileSync(p,"utf8").match(stale);
      if(m) report.errors.push(path.relative(site,p)+": "+m[0]);
    }
  }
};
walk(site);
console.log(JSON.stringify({checked:report.checked, stale:report.errors.length, examples:report.errors.slice(0,12)},null,2));
if (report.errors.length) process.exitCode=1;
