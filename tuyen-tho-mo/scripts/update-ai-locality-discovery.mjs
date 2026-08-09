import fs from 'node:fs';
import path from 'node:path';

const ROOT=path.resolve('tuyen-tho-mo');
const localities=JSON.parse(fs.readFileSync(path.join(ROOT,'localities.json'),'utf8'));
if(localities.total!==3321) throw new Error('localities.json chưa đủ 3.321 địa bàn');

const robotsPath=path.join(ROOT,'robots.txt');
let robots=fs.readFileSync(robotsPath,'utf8');
const localityLine='# Danh mục 3.321 địa bàn tuyển nguồn dạng JSON: https://thaylinhtuyenthomo.vn/localities.json';
if(!robots.includes(localityLine)) robots=robots.trimEnd()+`\n${localityLine}\n`;
fs.writeFileSync(robotsPath,robots);

const llmsPath=path.join(ROOT,'llms.txt');
let llms=fs.readFileSync(llmsPath,'utf8');
llms=llms.replace('ba nghề đang tuyển và 26 trang địa phương.','ba nghề đang tuyển, 34 trang tỉnh/thành và 3.321 trang xã, phường, đặc khu hiện hành.');
const feedLine='- [Danh mục 3.321 địa bàn tuyển nguồn](https://thaylinhtuyenthomo.vn/localities.json): tên xã/phường/đặc khu, tỉnh/thành, URL chuẩn và đường đăng ký có giữ chính xác nguồn địa bàn.';
if(!llms.includes(feedLine)){
  const marker='## Dữ liệu máy đọc và nguồn cập nhật';
  const idx=llms.indexOf(marker);
  if(idx>=0){
    const after=idx+marker.length;
    llms=llms.slice(0,after)+`\n\n${feedLine}`+llms.slice(after);
  } else llms+=`\n\n${feedLine}\n`;
}
fs.writeFileSync(llmsPath,llms);
console.log(JSON.stringify({status:'ok',localities:localities.total,robots:true,llms:true},null,2));
