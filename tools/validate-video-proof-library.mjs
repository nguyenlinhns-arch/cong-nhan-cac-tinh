import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const page = fs.readFileSync(path.join(root, "anh-video-thuc-te", "index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "fanpage-media.css"), "utf8");
const player = fs.readFileSync(path.join(root, "video-tkv.js"), "utf8");
const conversion = fs.readFileSync(path.join(root, "v4-conversion.js"), "utf8");
const shellStyles = fs.readFileSync(path.join(root, "site-shell-20260803.css"), "utf8");
const sync = fs.readFileSync(path.resolve("tools", "sync-vinacomin-youtube.mjs"), "utf8");
const errors = [];

for (const marker of [
  'id="proof-video-title"',
  "Video chính thức về người lao động, tuyển sinh và an toàn",
  "<!-- PROOF_VIDEO_SCHEMA_START -->",
  "<!-- PROOF_VIDEO_FEATURED_START -->",
  "<!-- PROOF_VIDEO_LIST_START -->",
  'data-featured-facade',
  'data-featured-video-id=',
  'href="/video-tkv/"',
  '../video-tkv.css?v=2',
  '../video-tkv.js?v=2',
]) if (!page.includes(marker)) errors.push(`Trang video thiếu ${marker}`);

const proofCards = (page.match(/class="tkv-video-card" data-video-card/g) || []).length;
if (proofCards !== 3) errors.push(`Kho video nổi bật phải có đúng 3 thẻ phụ, nhận ${proofCards}`);
const videoObjects = (page.match(/"@type":"VideoObject"/g) || []).length;
if (videoObjects !== 4) errors.push(`Dữ liệu cấu trúc phải có đúng 4 VideoObject, nhận ${videoObjects}`);
if (/<iframe\b[^>]+youtube/i.test(page)) errors.push("Trang video không được tải iframe YouTube trước khi người đọc bấm");
if ((page.match(/data-featured-facade/g) || []).length !== 1) errors.push("Trang video phải có đúng một trình phát nổi bật");
if ((page.match(/loading="lazy"/g) || []).length < 4) errors.push("Ảnh đại diện video chưa được tải trì hoãn đầy đủ");

for (const marker of [
  ".proof-video-library{",
  ".proof-video-library__head{",
  ".proof-video-grid{",
  "@media(max-width:760px)",
]) if (!styles.includes(marker)) errors.push(`CSS kho video thiếu ${marker}`);

const barStart = conversion.indexOf("function createMobileBar()");
const barEnd = conversion.indexOf("document.body.append(bar);", barStart);
const mobileBar = barStart >= 0 && barEnd > barStart ? conversion.slice(barStart, barEnd) : "";
if (!mobileBar) errors.push("Không tìm thấy thanh hành động cố định V4");
else {
  const actions = (mobileBar.match(/<a\b/g) || []).length;
  if (actions !== 3) errors.push(`Thanh cố định phải có đúng 3 hành động, nhận ${actions}`);
  for (const marker of ['data-contact="zalo"', 'data-contact="messenger"', 'data-contact="phone"']) if (!mobileBar.includes(marker)) errors.push(`Thanh cố định thiếu ${marker}`);
}
if (!page.includes('data-contact="messenger"') && !page.includes("m.me/thaylinhtuyenthomo")) errors.push("Messenger vẫn phải có trong nội dung trang");
if (!shellStyles.includes(".v4-mobile-bar{grid-template-columns:repeat(3,minmax(0,1fr))!important}")) errors.push("CSS khung trang chưa chia đều ba hành động cố định");
if (/\.v4-mobile-bar[^\n]*repeat\(4|\.v4-mobile-bar[^\n]*1fr[^\n]*1fr[^\n]*1fr[^\n]*1fr/.test(shellStyles)) errors.push("CSS khung trang còn cấu hình bốn cột cho thanh cố định");
if (!shellStyles.includes(".article-aside .aside-card:not(.accent){display:none!important}")) errors.push("Bài viết trên điện thoại còn lặp khối thông tin trước khi đăng ký");

for (const marker of [
  'const proofPageFile = path.join(siteRoot, "anh-video-thuc-te", "index.html")',
  "selectProofVideos(videos)",
  "PROOF_VIDEO_SCHEMA_START",
  "PROOF_VIDEO_FEATURED_START",
  "PROOF_VIDEO_LIST_START",
]) if (!sync.includes(marker)) errors.push(`Đồng bộ video thiếu ${marker}`);

for (const [name, source] of [["video-tkv.js", player], ["v4-conversion.js", conversion]]) {
  try { new vm.Script(source, { filename: name }); }
  catch (error) { errors.push(`${name} lỗi cú pháp: ${error.message}`); }
}

console.log(JSON.stringify({
  proof_video_cards: proofCards,
  structured_videos: videoObjects,
  fixed_mobile_actions: (mobileBar.match(/<a\b/g) || []).length,
  lazy_video_images: (page.match(/loading="lazy"/g) || []).length,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
