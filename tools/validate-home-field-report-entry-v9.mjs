import fs from "node:fs";
import path from "node:path";

const html = fs.readFileSync(path.resolve("tuyen-tho-mo", "index.html"), "utf8");
const errors = [];
const proofSection = html.match(/<section\b[^>]*class=["'][^"']*\bhome-proof\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i)?.[0] || "";

if (!proofSection) errors.push("Trang chủ thiếu khối Người thật · việc thật");
const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i)?.[0] || "";
if (!footer.includes('href="/phong-su/">Phóng sự</a>')) errors.push("Cuối trang cần giữ liên kết tới kho phóng sự.");
if (proofSection.includes('href="/phong-su/"><strong>')) errors.push("Không đưa lại nhóm bài viết vào mục video.");
if ((html.match(/href="\/phong-su\/"/g) || []).length < 1) errors.push("Trang chủ thiếu liên kết phóng sự hiện trường");
if (!html.includes('"@type":"CollectionPage","name":"Phóng sự hiện trường nghề mỏ","url":"https://thaylinhtuyenthomo.vn/phong-su/"')) errors.push("WebPage schema chưa khai báo Phóng sự hiện trường trong hasPart");
if (!html.includes('href="/anh-video-thuc-te/"')) errors.push("Trang chủ phải giữ lối vào kho ảnh/video thực tế ở thư viện nội dung");
if ((html.match(/<section\b[^>]*class=["'][^"']*\bhome-proof\b/gi) || []).length !== 1) errors.push("Trang chủ phải giữ đúng một khối home-proof, không tạo section phóng sự lặp");

console.log(JSON.stringify({
  fieldReportEntry: footer.includes('href="/phong-su/"'),
  videoLibraryPreserved: html.includes('href="/anh-video-thuc-te/"'),
  schemaHasPart: html.includes('"url":"https://thaylinhtuyenthomo.vn/phong-su/"'),
  errors: errors.length,
  sampleErrors: errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
