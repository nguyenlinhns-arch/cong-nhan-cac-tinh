import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const imageDimensions = JSON.parse(fs.readFileSync(path.resolve("content/article-image-dimensions.json"), "utf8"));
const errors = [];
const warnings = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function fail(message) {
  errors.push(message);
}

function pageUrl(file) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return base + "/";
  return base + "/" + relative.replace(/index\.html$/, "");
}

function knownImage(tag, file) {
  const source = tag.match(/\bsrc=(["'])(.*?)\1/i)?.[2];
  if (!source) return "";
  try { return new URL(source.replaceAll("&amp;", "&"), pageUrl(file)).href; }
  catch { return ""; }
}

const analytics = read("analytics.js");
const analyticsVendors = read("analytics-vendors.js");
const consentAnalytics = read("consent-analytics.js");
for (const marker of ["scheduleVendors", "requestIdleCallback", "CONSENT_KEY", "analytics-vendors.js?v=1", "consent-analytics.js?v=1", "measurementId"]) {
  if (!analytics.includes(marker)) fail(`Analytics core: thiếu ${marker}`);
}
for (const marker of ["installMetaQueue", "WEB_VITALS_VERSION", "reportWebVital", "metric_value", "googletagmanager.com/gtag/js", "connect.facebook.net/en_US/fbevents.js"]) {
  if (!analyticsVendors.includes(marker)) fail(`Analytics vendors: thiếu ${marker}`);
}
for (const marker of ["data-consent-banner", "Chỉ cần thiết", "Đồng ý đo lường"]) {
  if (!consentAnalytics.includes(marker)) fail(`Consent UI: thiếu ${marker}`);
}
for (const [name, source] of [["analytics.js", analytics], ["analytics-vendors.js", analyticsVendors], ["consent-analytics.js", consentAnalytics]]) {
  try { new vm.Script(source, {filename: name}); } catch (error) { fail(`${name}: lỗi cú pháp ${error.message}`); }
}
const privacy = read("quyen-rieng.html");
for (const marker of ["data-open-consent", "LCP, INP, CLS", "Mặc định Google Analytics 4 và Meta Pixel chưa được nạp", "Chỉ cần thiết"]) {
  if (!privacy.includes(marker)) fail(`Quyền riêng tư: thiếu cam kết ${marker}`);
}

const home = read("index.html");
const homeScript = read("portal-official.js");
const homeStyles = read("landing-recruitment.css");
const homeVideoFacades = (home.match(/data-featured-video-facade/g) || []).length;
if (homeVideoFacades !== 1) fail(`Trang chủ đơn giản: dự kiến 1 lớp xem trước video, thực tế ${homeVideoFacades}`);
if (/<iframe\b[^>]+youtube/i.test(home)) fail("Trang chủ: còn tạo trình phát YouTube trước khi người dùng bấm xem");
const facebookReelFrames = home.match(/<iframe\b[^>]+facebook\.com\/plugins\/video\.php[^>]*>/gi) || [];
if (facebookReelFrames.length !== 1) fail(`Trang chủ: dự kiến 1 video Facebook Reel, thực tế ${facebookReelFrames.length}`);
else if (!facebookReelFrames[0].includes('loading="lazy"') || !facebookReelFrames[0].includes('title="Video Làm mỏ hay làm khu công nghiệp của Thầy Linh"')) {
  fail("Trang chủ: video Facebook Reel phải nạp chậm và có tiêu đề hỗ trợ truy cập");
}
if (/rel=["']preconnect["'][^>]+youtube-nocookie\.com/i.test(home)) fail("Trang chủ: còn mở sớm kết nối trình phát YouTube");
for (const marker of ["mountYouTubePlayer", "renderVideoFacade", "activateFacade", "host.replaceChildren(frame)"]) {
  if (!homeScript.includes(marker)) fail(`Trang chủ: thiếu hành vi video ${marker}`);
}
for (const marker of ["home-video-facade", "home-video-facade__play", "focus-visible"]) {
  if (!homeStyles.includes(marker)) fail(`Trang chủ: thiếu kiểu lớp xem trước ${marker}`);
}
const optimizedHomeImages = [
  ["/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp", "1200", "736", "eager"],
  ["/assets/vinacomin-tho-lo-ha-lam-giao-ca.webp", "1055", "593", "lazy"],
  ["/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp", "1600", "860", "lazy"],
  ["/assets/vinacomin-tho-lo-than-thong-nhat-ngoai-khai-truong.webp", "789", "895", "lazy"],
  ["/assets/vinacomin-hoc-vien-quang-hanh-ao-xanh-doi-mu.webp", "1280", "802", "lazy"],
  ["/assets/vinacomin-tho-lo-lo-van-ky-mu-bao-ho.webp", "794", "1000", "lazy"],
  ["/assets/vinacomin-tho-lo-guong-sang-mu-bao-ho.webp", "1280", "718", "lazy"],
];
for (const [source, width, height, delivery] of optimizedHomeImages) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tags = [...home.matchAll(new RegExp(`<img\\b[^>]*src=["']${escaped}["'][^>]*>`, "gi"))].map((match) => match[0]);
  if (!tags.length) fail(`Trang chủ: thiếu ảnh Vinacomin ${source}`);
  else {
    const deliveryMarker = delivery === "eager" ? 'fetchpriority="high"' : 'loading="lazy"';
    const markers = [deliveryMarker, "decoding=\"async\"", `width=\"${width}\"`, `height=\"${height}\"`];
    if (!tags.some((tag) => markers.every((marker) => tag.includes(marker)))) fail(`Trang chủ: ảnh ${source} chưa đủ thuộc tính tải và chống dịch chuyển bố cục`);
  }
}

const videoPage = read("video-tkv/index.html");
const videoScript = read("video-tkv.js");
const videoStyles = read("video-tkv.css");
const videoSync = fs.readFileSync(path.resolve("tools/sync-vinacomin-youtube.mjs"), "utf8");
if (!videoPage.includes("data-featured-facade") || !videoPage.includes("data-featured-thumbnail")) fail("Video TKV: thiếu lớp xem trước trước khi phát");
if (/<iframe\b[^>]*data-featured-frame/i.test(videoPage)) fail("Video TKV: còn nhúng trình phát YouTube ngay khi mở trang");
for (const marker of ["mountPlayer", "frameHost.replaceChildren", "tkv_video_play"]) {
  if (!videoScript.includes(marker)) fail(`Video TKV: thiếu hành vi ${marker}`);
}
for (const marker of ["tkv-video-facade", "tkv-video-facade__play", "focus-visible"]) {
  if (!videoStyles.includes(marker)) fail(`Video TKV: thiếu kiểu hiển thị ${marker}`);
}
for (const marker of ["data-featured-video-id", "data-featured-video-title", "data-featured-thumbnail"]) {
  if (!videoSync.includes(marker)) fail(`Đồng bộ video TKV: thiếu cập nhật ${marker}`);
}

const fontCss = read("fonts.css");
const fontWeights = [400, 700, 800];
let localFontFiles = 0;
for (const weight of fontWeights) {
  for (const subset of ["latin", "vietnamese"]) {
    const name = `be-vietnam-pro-${subset}-${weight}-normal.woff2`;
    const file = path.join(root, "assets", "fonts", name);
    if (!fs.existsSync(file)) {
      fail(`Font: thiếu ${name}`);
      continue;
    }
    localFontFiles += 1;
    const bytes = fs.statSync(file).size;
    if (bytes < 8_000 || bytes > 30_000) fail(`Font: ${name} có kích thước bất thường ${bytes} byte`);
    if (!fontCss.includes("/assets/fonts/" + name)) fail(`Font: fonts.css chưa khai báo ${name}`);
  }
}
if ((fontCss.match(/font-display:swap/g) || []).length !== 6) fail("Font: 6 tập con phải dùng font-display:swap");
if (!fs.existsSync(path.join(root, "assets", "fonts", "OFL-1.1.txt"))) fail("Font: thiếu giấy phép SIL OFL 1.1");

const htmlFiles = walk(root).filter((file) => file.endsWith(".html") && !path.basename(file).startsWith("google"));
let blockingScripts = 0;
let eagerThirdPartyFrames = 0;
let externalStylesheets = 0;
let localFontPages = 0;
let knownImageTags = 0;
let knownImagesMissingDimensions = 0;
let articleCovers = 0;
let articleCoversMissingDimensions = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (html.includes('href="/fonts.css?v=2"')) localFontPages += 1;
  if (/fonts\.(?:googleapis|gstatic)\.com/i.test(html)) fail(`${relative}: còn gọi Google Fonts bên ngoài`);
  for (const match of html.matchAll(/<link\b[^>]*rel=["'][^"']*stylesheet[^"']*["'][^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/gi)) {
    externalStylesheets += 1;
    fail(`${relative}: stylesheet bên ngoài chặn hiển thị ${match[1]}`);
  }
  for (const match of html.matchAll(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>/gi)) {
    if (!/\b(?:defer|async)\b/i.test(match[0]) && !/\btype=["']module["']/i.test(match[0])) {
      blockingScripts += 1;
      fail(`${relative}: script có src nhưng không defer/async`);
    }
  }
  for (const match of html.matchAll(/<iframe\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*>/gi)) {
    if (!/\bloading=["']lazy["']/i.test(match[0])) {
      eagerThirdPartyFrames += 1;
      fail(`${relative}: iframe bên thứ ba chưa nạp chậm`);
    }
  }
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const key = knownImage(match[0], file);
    if (!imageDimensions[key]) continue;
    knownImageTags += 1;
    if (!/\bwidth=["']\d+["']/i.test(match[0]) || !/\bheight=["']\d+["']/i.test(match[0])) {
      knownImagesMissingDimensions += 1;
      fail(`${relative}: ảnh bài viết chưa có width/height ${key}`);
    }
  }
  for (const match of html.matchAll(/<figure\b[^>]*class=["'][^"']*\barticle-cover\b[^"']*["'][^>]*>[\s\S]*?<img\b[^>]*>/gi)) {
    articleCovers += 1;
    const tag = match[0].match(/<img\b[^>]*>/i)?.[0] || "";
    if (!/\bwidth=["']\d+["']/i.test(tag) || !/\bheight=["']\d+["']/i.test(tag)) {
      articleCoversMissingDimensions += 1;
      fail(`${relative}: ảnh bìa bài viết chưa giữ chỗ bố cục`);
    }
  }
  if (/googletagmanager\.com|connect\.facebook\.net/i.test(html)) fail(`${relative}: nhúng trực tiếp nhà cung cấp đo lường trong HTML`);
}

if (!localFontPages) fail("Font: không có trang nào dùng fonts.css cục bộ");
const feedArticleCount = JSON.parse(fs.readFileSync(path.join(root, "feed.json"), "utf8")).items?.length || 0;
if (articleCovers !== feedArticleCount) fail(`Ảnh bìa: dự kiến ${feedArticleCount} bài theo feed, thực tế ${articleCovers}`);
if (knownImagesMissingDimensions || articleCoversMissingDimensions) fail("Ảnh bài viết: còn ảnh có nguy cơ xô lệch bố cục");

const budgets = {
  "analytics.js": 15_000,
  "analytics-vendors.js": 12_000,
  "fonts.css": 9_000,
  "mobile-core.css": 12_000,
  "mobile-core.js": 30_000,
  "site-search.js": 26_000,
  "worker-brief.js": 8_000,
  "voice-assist.js": 15_000,
  "job-application.js": 32_000,
  "portal-official.js": 20_000,
  "landing-recruitment.css": 36_000,
  "assets/vendor/web-vitals-6.0.1.iife.js": 10_000,
  "index.html": 90_000,
};
for (const [relative, limit] of Object.entries(budgets)) {
  const bytes = fs.statSync(path.join(root, relative)).size;
  if (bytes > limit) fail(`${relative}: ${bytes} byte vượt ngân sách ${limit} byte`);
}

const optimizedSourceImage = path.join(root, "assets", "articles", "mu-cang-chai-quy-che-2024.webp");
if (!fs.existsSync(optimizedSourceImage)) fail("Ảnh nguồn Mù Cang Chải: thiếu bản WebP lossless");
else if (fs.statSync(optimizedSourceImage).size > 700_000) fail("Ảnh nguồn Mù Cang Chải: bản WebP vượt 700 KB");
if (fs.readFileSync(path.resolve("tools/historical-source-images.mjs"), "utf8").includes("mu-cang-chai-quy-che-2024.png")) {
  fail("Ảnh nguồn Mù Cang Chải: bộ sinh trang vẫn dùng PNG 1,57 MB");
}
const webVitalsBundle = path.join(root, "assets", "vendor", "web-vitals-6.0.1.iife.js");
const webVitalsLicense = path.join(root, "assets", "vendor", "web-vitals-LICENSE.txt");
if (!fs.existsSync(webVitalsBundle) || !fs.readFileSync(webVitalsBundle, "utf8").startsWith("/*! web-vitals v6.0.1")) fail("Web Vitals: thiếu bundle cục bộ có phiên bản");
if (!fs.existsSync(webVitalsLicense) || !fs.readFileSync(webVitalsLicense, "utf8").includes("Apache License")) fail("Web Vitals: thiếu giấy phép Apache 2.0");

console.log(JSON.stringify({
  html: htmlFiles.length,
  deferred_scripts: 0,
  web_vitals_version: "6.0.1",
  optimized_home_images: optimizedHomeImages.length,
  home_video_facades: homeVideoFacades,
  facebook_reel_frames: facebookReelFrames.length,
  blocking_scripts: blockingScripts,
  eager_third_party_frames: eagerThirdPartyFrames,
  external_stylesheets: externalStylesheets,
  local_font_pages: localFontPages,
  local_font_files: localFontFiles,
  known_image_tags: knownImageTags,
  known_images_missing_dimensions: knownImagesMissingDimensions,
  article_covers: articleCovers,
  article_covers_missing_dimensions: articleCoversMissingDimensions,
  errors,
  warnings,
}, null, 2));
if (errors.length) process.exit(1);
