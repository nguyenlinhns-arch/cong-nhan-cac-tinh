import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const target = path.join(root, "tin-nganh-than", "2026", "08", "01", "vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv", "index.html");
const from = "Gia đình ở Vị Xuyên nên ghi lại từng mốc của đợt tuyển — thời gian, nơi tiếp nhận, chế độ trong lúc học và đầu mối liên hệ — để tránh phụ thuộc vào thông tin truyền miệng.";
const to = "Gia đình ở Vị Xuyên nên ghi lại bốn nhóm thông tin của đợt tuyển: thời gian, nơi tiếp nhận, chế độ trong lúc học và đầu mối liên hệ. Cách này giúp gia đình bớt phụ thuộc vào thông tin truyền miệng.";

if (!fs.existsSync(target)) throw new Error("editorial-uniqueness-punctuation-v9: thiếu bài Vị Xuyên");
const before = fs.readFileSync(target, "utf8");
let after = before;
let changed = false;
if (after.includes(from)) {
  after = after.replaceAll(from, to);
  changed = true;
}

const article = after.match(/<article\b[^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
const visible = article
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
if (visible.includes("—")) throw new Error("editorial-uniqueness-punctuation-v9: bài Vị Xuyên còn gạch ngang dài trong thân bài");
if (!after.includes(to)) throw new Error("editorial-uniqueness-punctuation-v9: chưa tạo được câu Vị Xuyên mới");

if (changed) fs.writeFileSync(target, after);
console.log(JSON.stringify({
  status: "editorial-uniqueness-punctuation-v9-ready",
  changed,
  target: "vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv",
  longDashInBody: false,
}, null, 2));
