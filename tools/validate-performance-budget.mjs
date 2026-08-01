import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
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

const analytics = read("analytics.js");
for (const marker of ["installMetaQueue", "ensureVendors", "scheduleVendors", "requestIdleCallback", "timeout: 2500"]) {
  if (!analytics.includes(marker)) fail(`Analytics: thiếu cơ chế nạp chậm ${marker}`);
}

const appendedScripts = [];
const idleCallbacks = [];
const interactionListeners = new Map();
const localStore = new Map();
const documentStub = {
  referrer: "",
  documentElement: { dataset: {} },
  head: { append: (node) => appendedScripts.push(node) },
  querySelector: () => null,
  createElement: () => ({ async: false, src: "", dataset: {} }),
  addEventListener: () => {},
};
const windowStub = {
  dataLayer: [],
  requestIdleCallback: (callback, options) => {
    idleCallbacks.push({ callback, options });
    return 1;
  },
  setTimeout: () => 1,
  clearTimeout: () => {},
  addEventListener: (name, callback) => interactionListeners.set(name, callback),
};
windowStub.window = windowStub;
const sandbox = {
  window: windowStub,
  document: documentStub,
  location: { search: "", pathname: "/", href: "https://thaylinhtuyenthomo.vn/" },
  localStorage: {
    getItem: (key) => localStore.get(key) || null,
    setItem: (key, value) => localStore.set(key, String(value)),
  },
  URL,
  URLSearchParams,
  Date,
  Object,
  Array,
  String,
  Number,
  RegExp,
};

try {
  vm.runInNewContext(analytics, sandbox, { filename: "analytics.js" });
  if (appendedScripts.length) fail("Analytics: tải nhà cung cấp bên thứ ba trước thời điểm nhàn rỗi hoặc tương tác");
  if (idleCallbacks.length !== 1 || idleCallbacks[0].options?.timeout !== 2500) fail("Analytics: lịch nạp nhàn rỗi không đúng ngân sách 2,5 giây");
  for (const eventName of ["pointerdown", "touchstart", "keydown"]) {
    if (!interactionListeners.has(eventName)) fail(`Analytics: thiếu kích hoạt sớm khi có ${eventName}`);
  }
  idleCallbacks[0]?.callback();
  const vendorSources = appendedScripts.map((script) => script.src).sort();
  if (vendorSources.length !== 2 || !vendorSources.some((src) => src.includes("googletagmanager.com/gtag/js")) || !vendorSources.some((src) => src.includes("connect.facebook.net/en_US/fbevents.js"))) {
    fail("Analytics: GA4 và Meta Pixel không được nạp đúng sau thời điểm nhàn rỗi");
  }
  if (!windowStub.fbq?.queue?.some((entry) => entry[0] === "track" && entry[1] === "PageView")) fail("Analytics: Meta PageView không được giữ trong hàng đợi");
} catch (error) {
  fail(`Analytics: không chạy được kiểm thử nạp chậm (${error.message})`);
}

const home = read("index.html");
const optimizedHomeImages = [
  ["https://vinacomin.vn/Share/Media/2017/09/images1311883_KEN_6710.jpg", "960", "640"],
  ["https://vinacomin.vn/Share/Media/2018/07/IMG_4207.jpg", "1200", "675"],
  ["https://vinacomin.vn/Share/Media/2018/07/IMG_4075.jpg", "1200", "675"],
  ["https://vinacomin.vn/Share/Media/2017/09/U39A0357.jpg", "1200", "675"],
  ["https://vinacomin.vn/Share/Media/2017/09/IMG_8117.jpg", "1200", "675"],
  ["https://vinacomin.vn/Share/Media/2018/07/IMG_2357.jpg", "1200", "675"],
  ["https://vinacomin.vn/Share/Media/2017/09/DSC01675.jpg", "1200", "675"],
];
for (const [source, width, height] of optimizedHomeImages) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = home.match(new RegExp(`<img\\b[^>]*src=["']${escaped}["'][^>]*>`, "i"))?.[0] || "";
  if (!tag) fail(`Trang chủ: thiếu ảnh Vinacomin ${source}`);
  else if (!["loading=\"lazy\"", "decoding=\"async\"", `width=\"${width}\"`, `height=\"${height}\"`, "referrerpolicy=\"no-referrer\""].every((marker) => tag.includes(marker))) fail(`Trang chủ: ảnh ${source} chưa đủ thuộc tính chống dịch chuyển bố cục`);
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

const htmlFiles = walk(root).filter((file) => file.endsWith(".html") && !path.basename(file).startsWith("google"));
let blockingScripts = 0;
let eagerThirdPartyFrames = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
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
  if (/googletagmanager\.com|connect\.facebook\.net/i.test(html)) fail(`${relative}: nhúng trực tiếp nhà cung cấp đo lường trong HTML`);
}

const budgets = {
  "analytics.js": 16_000,
  "mobile-ux.js": 42_000,
  "job-application.js": 32_000,
  "index.html": 90_000,
};
for (const [relative, limit] of Object.entries(budgets)) {
  const bytes = fs.statSync(path.join(root, relative)).size;
  if (bytes > limit) fail(`${relative}: ${bytes} byte vượt ngân sách ${limit} byte`);
}

console.log(JSON.stringify({
  html: htmlFiles.length,
  deferred_vendors: appendedScripts.length,
  optimized_home_images: optimizedHomeImages.length,
  blocking_scripts: blockingScripts,
  eager_third_party_frames: eagerThirdPartyFrames,
  errors,
  warnings,
}, null, 2));
if (errors.length) process.exit(1);
