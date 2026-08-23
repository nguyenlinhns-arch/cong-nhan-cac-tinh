import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const llmsPath = path.join(root, "llms.txt");
const reports = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-field-reports-v8.json"), "utf8"));
const base = "https://thaylinhtuyenthomo.vn";
const pages = {
  "gia-lai": {
    slug: "ia-rdeh-gia-lai-con-duong-den-vung-mo",
    description: "Ghi chép hiện trường tại Ia RDeh, Gia Lai: tư vấn nghề mỏ, phối hợp ba bên và câu chuyện gia đình công nhân Kso Sới.",
  },
  "quang-ngai": {
    slug: "quang-ngai-hanh-trinh-den-vung-mo-quang-ninh",
    description: "Ghi chép hành trình từ Quảng Ngãi tới Quảng Ninh: rời quê, đến nơi tiếp nhận, nhập học và kiểm chứng lộ trình học nghề mỏ.",
  },
};

if (!fs.existsSync(llmsPath)) throw new Error("Field report v8: thiếu tuyen-tho-mo/llms.txt");
let llms = fs.readFileSync(llmsPath, "utf8");
const start = "<!-- field-report-v8:start -->";
const end = "<!-- field-report-v8:end -->";

const existingStart = llms.indexOf(start);
if (existingStart >= 0) {
  const existingEnd = llms.indexOf(end, existingStart);
  if (existingEnd < 0) throw new Error("Field report v8: llms.txt có marker mở nhưng thiếu marker đóng");
  llms = `${llms.slice(0, existingStart)}${llms.slice(existingEnd + end.length)}`;
}
llms = llms.replace(/\n{3,}/g, "\n\n").trimEnd();

const entries = Object.entries(reports).filter(([slug]) => pages[slug]);
const lines = entries.map(([slug, report]) => {
  const config = pages[slug];
  const canonical = `${base}/phong-su/${config.slug}/`;
  return `- [${report.title}](${canonical}): ${config.description}`;
});
const block = `${start}\n## Phóng sự hiện trường nguyên bản\n\n- [Chuyên mục phóng sự hiện trường](${base}/phong-su/): ghi chép từ video, chuyến công tác và dữ liệu thực địa do Thầy Linh – Tuyển Thợ Mỏ trực tiếp công bố.\n- [RSS phóng sự](${base}/phong-su/feed.xml) và [JSON Feed phóng sự](${base}/phong-su/feed.json): kênh phân phối riêng cho nội dung nguyên bản, tách khỏi feed bài biên tập từ nguồn ngoài.\n${lines.join("\n")}\n${end}`;
const anchor = "## Dữ liệu máy đọc và nguồn cập nhật";
if (llms.includes(anchor)) llms = llms.replace(anchor, `${block}\n\n${anchor}`);
else llms = `${llms}\n\n${block}`;
llms = `${llms.trimEnd()}\n`;

if (!llms.includes("## Phóng sự hiện trường nguyên bản")) throw new Error("Field report v8: không chèn được heading phóng sự vào llms.txt");
for (const [slug] of entries) {
  const canonical = `${base}/phong-su/${pages[slug].slug}/`;
  if (!llms.includes(canonical)) throw new Error(`Field report v8: llms.txt thiếu ${canonical}`);
}
for (const feedUrl of [`${base}/phong-su/feed.xml`, `${base}/phong-su/feed.json`]) {
  if (!llms.includes(feedUrl)) throw new Error(`Field report v8: llms.txt thiếu feed ${feedUrl}`);
}
fs.writeFileSync(llmsPath, llms);

await import("./generate-editorial-field-report-feed-v8.mjs");
await import("./editorial-field-report-seo-title-v8.mjs");
await import("./editorial-field-report-social-meta-v8.mjs");
await import("./editorial-field-report-authority-v8.mjs");

console.log(JSON.stringify({
  status: "field-report-v8-llms-ready",
  hub: `${base}/phong-su/`,
  rss: `${base}/phong-su/feed.xml`,
  jsonFeed: `${base}/phong-su/feed.json`,
  articles: entries.map(([slug]) => `${base}/phong-su/${pages[slug].slug}/`),
}, null, 2));
