import fs from "node:fs";

const reelsSource = fs.readFileSync("tuyen-tho-mo/home-province-reels.js", "utf8");
const journeySource = fs.readFileSync("tuyen-tho-mo/home-worker-journey.js", "utf8");
const cssSource = fs.readFileSync("tuyen-tho-mo/home-province-reels.css", "utf8");
const errors = [];

for (const marker of [
  "data-province-reel-play",
  "home_province_reel_play",
  'document.createElement("iframe")',
  "host.replaceChildren(frame)",
]) {
  if (!reelsSource.includes(marker)) errors.push(`Thiếu marker click-to-play: ${marker}`);
}

if (reelsSource.includes('<iframe title="${reel.title}"')) {
  errors.push("Hai Reel tỉnh vẫn được dựng iframe ngay trong HTML ban đầu");
}
const home = fs.readFileSync("tuyen-tho-mo/index.html", "utf8");
const extras = home.match(/<details class="home-watch-extra"[\s\S]*?<\/details>/)?.[0];
if (extras) {
  for (const id of ["988978737487363", "1015675787556708"]) {
    for (const marker of [`data-home-reel="${id}"`, `href="https://www.facebook.com/reel/${id}"`]) {
      if (!extras.includes(marker)) errors.push(`Thiếu lựa chọn hoặc liên kết dự phòng: ${marker}`);
    }
  }
  if (/<iframe\b/i.test(extras)) errors.push("Không được tải Reel trước khi bấm phát");
  for (const marker of ['"[data-home-reel]"', 'document.createElement("iframe")', 'host.replaceChildren(frame)']) {
    if (!journeySource.includes(marker)) errors.push(`Thiếu hành vi phát Reel: ${marker}`);
  }
} else if (!journeySource.includes('/home-province-reels.js?v=20261107-1')) {
  errors.push("Loader trang chủ chưa bump cache cho home-province-reels.js");
}
for (const marker of [".home-province-reel__facade", ".home-province-reel__play", ".home-province-reel__watch"]) {
  if (!cssSource.includes(marker)) errors.push(`CSS thiếu facade video tỉnh: ${marker}`);
}

if (errors.length) {
  console.error(JSON.stringify({status: "home-province-reels-facade-invalid", errors}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "home-province-reels-facade-ready",
    initialFacebookIframes: 0,
    videos: 2,
    clickToLoad: true,
    errors: 0,
  }, null, 2));
}
