import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const policyFile = path.join(root, "nguyen-tac-bien-tap", "index.html");
const authorFile = path.join(root, "tac-gia", "nguyen-tu-linh", "index.html");
const errors = [];

for (const file of [policyFile, authorFile]) if (!fs.existsSync(file)) errors.push(`Thiếu ${path.relative(root, file)}`);
const policy = fs.existsSync(policyFile) ? fs.readFileSync(policyFile, "utf8") : "";
const author = fs.existsSync(authorFile) ? fs.readFileSync(authorFile, "utf8") : "";

for (const marker of [
  'id="phan-loai-nguon"',
  "PHÂN LOẠI NGUỒN TRƯỚC KHI VIẾT",
  "Tư liệu trực tiếp",
  "Nguồn báo chí, đơn vị và cơ quan nhà nước",
  "Nguồn tuyển sinh đang áp dụng",
  "Không dựng lời nhân vật",
  "/phong-su/",
]) if (!policy.includes(marker)) errors.push(`Nguyên tắc biên tập thiếu ${marker}`);

for (const marker of [
  'id="tu-lieu-nguyen-ban"',
  "Ba loại nội dung được ghi nguồn theo ba cách khác nhau",
  "Phóng sự và ghi chép nguyên bản",
  "Bài biên tập từ nguồn bên ngoài",
  "Dữ kiện tuyển sinh hiện hành",
  "Không dựng lời nhân vật",
  "/phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/",
  "/phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/",
]) if (!author.includes(marker)) errors.push(`Hồ sơ tác giả thiếu ${marker}`);

console.log(JSON.stringify({
  policyAnchor: policy.includes('id="phan-loai-nguon"'),
  authorOriginalReporting: author.includes('id="tu-lieu-nguyen-ban"'),
  noFabricatedQuotes: policy.includes("Không dựng lời nhân vật") && author.includes("Không dựng lời nhân vật"),
  errors: errors.length,
  sampleErrors: errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
