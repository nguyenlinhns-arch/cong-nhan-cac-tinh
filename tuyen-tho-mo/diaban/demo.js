/* Artificial counts only. No source spreadsheet or real record is included. */
(function(){
const names=['Ninh Bình','Thanh Hóa','Nghệ An','Hà Tĩnh','Quảng Trị','Huế','Đà Nẵng','Quảng Ngãi','Gia Lai','Đắk Lắk','Khánh Hòa','Lâm Đồng'];
const keys=['workers','students','removed','leave','graduated','missingStatus'];
const provinces=[],rows=[],yearly=[];
names.forEach((name,i)=>{
 const p={id:'p'+String(i+1).padStart(2,'0'),name,priority:name==='Nghệ An'||name==='Quảng Ngãi',sourceUrl:''};keys.forEach(k=>p[k]=0);
 for(let j=0;j<7;j++){
  const students=12+(i*11+j*17)%96,workers=8+(i*7+j*13)%65;
  const r={id:p.id+'-'+j,provinceId:p.id,name:j===6?'Chưa xác minh xã/phường':'Xã minh họa '+String(j+1).padStart(2,'0'),unmapped:j===6,workers,students,removed:Math.floor(students*.27),leave:Math.floor(students*.04),graduated:Math.floor(students*.51),missingStatus:Math.floor(students*.16)};
  rows.push(r);keys.forEach(k=>p[k]+=r[k]);
 }
 for(let y=2015;y<=2026;y++){const r={provinceId:p.id,year:y};keys.slice(1).forEach(k=>r[k]=Math.floor(p[k]/12)+(y-2015<p[k]%12?1:0));yearly.push(r);}
 provinces.push(p);
});
globalThis.DASHBOARD_DEMO={schemaVersion:1,countUnit:'source-records',synthetic:true,label:'Dữ liệu minh họa thiết kế',dataAsOf:'Minh họa',workerAsOf:'Minh họa',unassignedProvinceWorkers:0,provinces,rows,yearly};
})();
