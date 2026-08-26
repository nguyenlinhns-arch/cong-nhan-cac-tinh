import fs from "node:fs";
import path from "node:path";

const file = path.resolve("tuyen-tho-mo", "index.html");
let html = fs.readFileSync(file, "utf8");
const before = html;

const proofLink = /(<div class="home-proof__video-copy"><small>PHÓNG SỰ CÔNG NHÂN<\/small><h3>Nghe người trong nghề kể về công việc và cuộc sống<\/h3>)<a href="\/anh-video-thuc-te\/">Xem toàn bộ video thực tế →<\/a>(<\/div>)/i;
const currentProofLink = /<div class="home-proof__video-copy"><small>PHÓNG SỰ CÔNG NHÂN<\/small><h3>Nghe người trong nghề kể về công việc và cuộc sống<\/h3><a href="\/phong-su\/">Đọc phóng sự hiện trường →<\/a><\/div>/i;
if (proofLink.test(html)) {
  html = html.replace(proofLink, '$1<a href="/phong-su/">Đọc phóng sự hiện trường →</a>$2');
} else if (!currentProofLink.test(html)) {
  throw new Error("Homepage field-report v9: thiếu lối ra từ khối Người thật · việc thật");
}

html = html.replace(/<script\b([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, payload) => {
  let data;
  try { data = JSON.parse(payload); } catch { return full; }
  const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [data];
  const page = graph.find((item) => item?.["@type"] === "WebPage" && Array.isArray(item?.hasPart));
  if (!page) return full;
  if (!page.hasPart.some((item) => item?.url === "https://thaylinhtuyenthomo.vn/phong-su/")) {
    page.hasPart.push({
      "@type": "CollectionPage",
      name: "Phóng sự hiện trường nghề mỏ",
      url: "https://thaylinhtuyenthomo.vn/phong-su/",
    });
  }
  return `<script${attrs}>${JSON.stringify(data)}</script>`;
});

if (!html.includes('href="/phong-su/">Đọc phóng sự hiện trường →</a>')) throw new Error("Homepage field-report v9: chưa tạo được link phóng sự");
if (!html.includes('"url":"https://thaylinhtuyenthomo.vn/phong-su/"')) throw new Error("Homepage field-report v9: schema chưa có chuyên mục phóng sự");

if (html !== before) fs.writeFileSync(file, html);
console.log(JSON.stringify({
  status: "home-field-report-entry-v9-ready",
  changed: html !== before,
  link: "/phong-su/",
  schemaHasPart: true,
}, null, 2));
