import fs from "node:fs";

const html = fs.readFileSync("tuyen-tho-mo/index.html", "utf8");
const portal = fs.readFileSync("tuyen-tho-mo/portal-official.js", "utf8");
const device = html.match(/<div class="home-v6-reel__device">[\s\S]*?<\/div>/i)?.[0] || "";
const errors = [];

if (!device) errors.push("Thiếu khối video Làm mỏ hay KCN trên trang chủ");
if (!device.includes("data-facebook-reel-facade")) errors.push("Video Làm mỏ hay KCN chưa dùng facade click-to-play");
if (/<iframe\b/i.test(device)) errors.push("Video Làm mỏ hay KCN còn iframe tải ngay trong HTML");
if (!device.includes("1145886217664123")) errors.push("Facade không trỏ đúng Reel 1145886217664123");
if (!device.includes("aspect-ratio:9/16")) errors.push("Facade video KCN chưa giữ tỷ lệ dọc 9:16");
for (const marker of ["data-facebook-reel-facade", "mountFacebookReel", "facebook-reel-1145886217664123"]) {
  if (!portal.includes(marker)) errors.push(`portal-official.js thiếu xử lý ${marker}`);
}

if (errors.length) {
  console.error(JSON.stringify({status: "home-kcn-reel-facade-v10-invalid", errors}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "home-kcn-reel-facade-v10-ready",
    initialFacebookIframes: 0,
    aspectRatio: "9:16",
    clickToLoad: true,
    errors: 0,
  }, null, 2));
}
