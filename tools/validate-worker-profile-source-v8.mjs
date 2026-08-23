import fs from "node:fs";
import path from "node:path";

const file = path.resolve("tuyen-tho-mo", "tin-nganh-than", "2026", "08", "01", "ma-khac-huynh-nguoi-mo-duong-trong-long-dat", "index.html");
const errors = [];

if (!fs.existsSync(file)) {
  errors.push("Thiếu bài chân dung Bùi Văn Tuyên – Ma Khắc Huỳnh");
} else {
  const html = fs.readFileSync(file, "utf8");
  const visible = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

  const forbidden = [
    "Qua hai nhân vật, cách người lao động",
    "đào lò,lực lượng",
    "bài viết cho thấy cách người lao động",
  ];
  for (const phrase of forbidden) if (visible.includes(phrase)) errors.push(`HTML cuối còn câu lỗi: ${phrase}`);

  const required = [
    "Hai điểm xuất phát khác nhau gặp nhau ở quá trình học nghề, thích nghi với ca kíp và làm việc trong tổ đội.",
    "tổ đào lò, lực lượng mở đường cho các công đoạn khai thác phía sau",
  ];
  for (const phrase of required) if (!visible.includes(phrase)) errors.push(`HTML cuối thiếu câu source-fix: ${phrase}`);
}

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  article: "/tin-nganh-than/2026/08/01/ma-khac-huynh-nguoi-mo-duong-trong-long-dat/",
  sourceFixVisible: errors.length === 0,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20),
}, null, 2));

if (errors.length) process.exitCode = 1;
