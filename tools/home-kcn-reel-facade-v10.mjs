import fs from "node:fs";
import path from "node:path";

const file = path.resolve("tuyen-tho-mo", "index.html");
let html = fs.readFileSync(file, "utf8");
const before = html;
const embed = "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1145886217664123%2F&show_text=false&width=500";

const devicePattern = /(<div class="home-v6-reel__device">)\s*<iframe\b[^>]*src="https:\/\/www\.facebook\.com\/plugins\/video\.php\?href=https%3A%2F%2Fwww\.facebook\.com%2Freel%2F1145886217664123%2F&amp;show_text=false&amp;width=500"[^>]*><\/iframe>\s*(<\/div>)/i;
const alreadyFacade = /<div class="home-v6-reel__device">[\s\S]*?data-facebook-reel-facade/i.test(html);

if (!alreadyFacade) {
  if (!devicePattern.test(html)) throw new Error("KCN reel v10: không tìm thấy iframe Facebook gốc trên trang chủ");
  const facade = `<button class="home-video-facade home-kcn-reel-facade" type="button" style="height:auto;aspect-ratio:9/16" data-facebook-reel-facade data-facebook-embed="${embed.replaceAll("&", "&amp;")}" aria-label="Phát video Làm mỏ hay làm khu công nghiệp của Thầy Linh"><span class="home-video-facade__play" aria-hidden="true">▶</span><span class="home-video-facade__label">Bấm để xem video · Làm mỏ hay KCN?</span></button>`;
  html = html.replace(devicePattern, `$1${facade}$2`);
}

// Earlier homepage builders may already materialize the click-to-play button
// but without the inline 9:16 guard. Repair that state instead of failing the
// whole deploy. Keeping the ratio on the element makes the initial layout
// deterministic even before deferred CSS has loaded.
html = html.replace(/<button\b[^>]*\bdata-facebook-reel-facade\b[^>]*>/i, (tag) => {
  if (/\bstyle="[^"]*"/i.test(tag)) {
    return tag.replace(/\bstyle="([^"]*)"/i, (_match, style) => {
      const cleaned = style
        .replace(/(?:^|;)\s*aspect-ratio\s*:[^;]*/gi, "")
        .replace(/(?:^|;)\s*height\s*:[^;]*/gi, "")
        .replace(/^;+|;+$/g, "")
        .trim();
      const prefix = cleaned ? `${cleaned};` : "";
      return `style="${prefix}height:auto;aspect-ratio:9/16"`;
    });
  }
  return tag.replace(/>$/, ' style="height:auto;aspect-ratio:9/16">');
});

html = html.replace(/<button\b[^>]*\bdata-facebook-reel-facade\b[^>]*>/i, (tag) => {
  const label = "Phát video Làm mỏ hay làm khu công nghiệp của Thầy Linh";
  if (/\baria-label="[^"]*"/i.test(tag)) return tag.replace(/\baria-label="[^"]*"/i, `aria-label="${label}"`);
  return tag.replace(/>$/, ` aria-label="${label}">`);
});

const device = html.match(/<div class="home-v6-reel__device">[\s\S]*?<\/div>/i)?.[0] || "";
if (!device.includes("data-facebook-reel-facade")) throw new Error("KCN reel v10: chưa tạo được facade click-to-play");
if (/<iframe\b/i.test(device)) throw new Error("KCN reel v10: iframe Facebook vẫn tải ngay ở HTML ban đầu");
if (!device.includes("1145886217664123")) throw new Error("KCN reel v10: facade không trỏ đúng Reel Làm mỏ hay KCN");
if (!device.includes("aspect-ratio:9/16")) throw new Error("KCN reel v10: facade chưa khóa tỷ lệ dọc 9:16");

if (html !== before) fs.writeFileSync(file, html);
console.log(JSON.stringify({
  status: "home-kcn-reel-facade-v10-ready",
  changed: html !== before,
  initialFacebookIframesInKcnBlock: 0,
  aspectRatio: "9:16",
  clickToLoad: true,
}, null, 2));
