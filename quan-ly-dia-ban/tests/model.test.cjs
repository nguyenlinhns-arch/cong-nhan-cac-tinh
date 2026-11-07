const test=require('node:test'),assert=require('node:assert/strict'),M=require('../src/model.js');
function sample(){return {schemaVersion:1,countUnit:'source-records',dataAsOf:'2026-11-06',workerAsOf:'2026-10-17',provinces:[{id:'p1',name:'Tỉnh thử',priority:true,workers:7,students:12,removed:5,leave:1,graduated:8,missingStatus:2}],rows:[{id:'r1',provinceId:'p1',name:'Xã Thử Nghiệm',unmapped:false,workers:5,students:10,removed:4,leave:1,graduated:8,missingStatus:1},{id:'r2',provinceId:'p1',name:'Chưa xác minh',unmapped:true,workers:2,students:2,removed:1,leave:0,graduated:0,missingStatus:1}],yearly:[{provinceId:'p1',year:2026,students:12,removed:5,leave:1,graduated:8,missingStatus:2}]};}
test('valid aggregate reconciles every count',()=>{const d=M.validate(sample());assert.equal(M.sum(d.rows).students,12);});
test('accent-insensitive commune filter',()=>{assert.equal(M.filter(M.validate(sample()),{search:'xa thu nghiem'}).length,1);});
test('unmapped rows stay distinct',()=>{const d=M.validate(sample());assert.equal(M.sum(M.filter(d,{kind:'unmapped'})).students,2);assert.equal(M.sum(M.filter(d,{kind:'mapped'})).students,10);});
test('contradictory filters return empty',()=>{assert.deepEqual(M.filter(M.validate(sample()),{commune:'r1',kind:'unmapped'}),[]);});
test('input unknown fields not retained',()=>{const d=sample();d.rows[0].phone='private';d.provinces[0].email='private';assert.equal(JSON.stringify(M.validate(d)).includes('private'),false);});
test('blank count rejected not replaced by zero',()=>{const d=sample();d.rows[0].workers=null;assert.throws(()=>M.validate(d));});
test('negative or fractional count rejected',()=>{for(const v of [-1,1.5]){const d=sample();d.rows[0].students=v;assert.throws(()=>M.validate(d));}});
test('province mismatches rejected',()=>{const d=sample();d.provinces[0].workers++;assert.throws(()=>M.validate(d),/khớp/);});
test('year mismatches rejected',()=>{const d=sample();d.yearly[0].removed--;assert.throws(()=>M.validate(d),/khớp/);});
test('independent overlapping events allowed',()=>{assert.ok(M.validate(sample()).rows[0].removed+M.validate(sample()).rows[0].graduated>10);});
test('individual event count cannot exceed student rows',()=>{const d=sample();d.rows[0].removed=11;assert.throws(()=>M.validate(d));});
test('duplicate row and duplicate year rejected',()=>{const d=sample();d.rows[1].id='r1';assert.throws(()=>M.validate(d));const e=sample();e.yearly.push(e.yearly[0]);assert.throws(()=>M.validate(e));});
test('unsafe source URL rejected',()=>{for(const url of ['javascript:alert(1)','https://evil.test/','https://docs.google.com.evil.test/spreadsheets/d/a/edit']){const d=sample();d.provinces[0].sourceUrl=url;assert.throws(()=>M.validate(d));}});
test('CSV quotes and prevents spreadsheet formulas',()=>{const d=M.validate(sample());d.rows[0].name='=HYPERLINK("bad")';const csv=M.csv(d,d.rows);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'));});
test('empty filtered rows sum to zero without changing dataset',()=>{const d=M.validate(sample());assert.equal(M.sum([]).students,0);assert.equal(d.provinces[0].students,12);});
