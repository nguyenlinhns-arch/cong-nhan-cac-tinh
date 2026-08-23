import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo", "phong-su");
const titles = {
  "ia-rdeh-gia-lai-con-duong-den-vung-mo": "Ia RDeh, Gia Lai: con đường đến vùng mỏ | Thầy Linh",
  "quang-ngai-hanh-trinh-den-vung-mo-quang-ninh": "Quảng Ngãi đến Quảng Ninh: hành trình nhập học | Thầy Linh",
};

for (const [slug, title] of Object.entries(titles)) {
  if (title.length > 65) throw new Error(`${slug}: SEO title dài ${title.length} ký tự`);
  const file = path.join(root, slug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`${slug}: thiếu trang phóng sự để đặt SEO title`);
  let html = fs.readFileSync(file, "utf8");
  if (!/<title>[^<]+<\/title>/i.test(html)) throw new Error(`${slug}: thiếu thẻ title`);
  html = html.replace(/<title>[^<]+<\/title>/i, `<title>${title}</title>`);
  fs.writeFileSync(file, html);
}

console.log(JSON.stringify({
  status: "field-report-v8-seo-titles-ready",
  titles,
  fullJournalisticH1Preserved: true,
}, null, 2));
