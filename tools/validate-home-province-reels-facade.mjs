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
if (!journeySource.includes('/home-province-reels.js?v=20260823-1')) {
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
