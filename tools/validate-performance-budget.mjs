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
for (const marker of ["installMetaQueue", "ensureVendors", "scheduleVendors", "requestIdleCallback", "timeout: 2500", "CONSENT_KEY", "createConsentBanner", "WEB_VITALS_VERSION", "registerWebVitals", "metric_value"]) {
  if (!analytics.includes(marker)) fail(`Analytics: thiếu cơ chế nạp chậm ${marker}`);
}
const privacy = read("quyen-rieng.html");
for (const marker of ["data-open-consent", "LCP, INP, CLS", "Mặc định Google Analytics 4 và Meta Pixel chưa được nạp", "Chỉ cần thiết"]) {
  if (!privacy.includes(marker)) fail(`Quyền riêng tư: thiếu cam kết ${marker}`);
}

const appendedScripts = [];
const idleCallbacks = [];
const interactionListeners = new Map();
const localStore = new Map([["thaylinh_measurement_consent_v1", "granted"]]);
const documentStub = {
  referrer: "",
  cookie: "",
  documentElement: { dataset: {} },
  head: { append: (node) => appendedScripts.push(node) },
  querySelector: () => null,
  querySelectorAll: () => [],
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
    removeItem: (key) => localStore.delete(key),
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
  if (vendorSources.length !== 3 || !vendorSources.some((src) => src === "/assets/vendor/web-vitals-6.0.1.iife.js") || !vendorSources.some((src) => src.includes("googletagmanager.com/gtag/js")) || !vendorSources.some((src) => src.includes("connect.facebook.net/en_US/fbevents.js"))) {
    fail("Analytics: Web Vitals, GA4 và Meta Pixel không được nạp đúng sau thời điểm nhàn rỗi");
  }
  if (!windowStub.fbq?.queue?.some((entry) => entry[0] === "track" && entry[1] === "PageView")) fail("Analytics: Meta PageView không được giữ trong hàng đợi");
  const vitalCallbacks = {};
  windowStub.webVitals = {
    onCLS: callback => { vitalCallbacks.CLS = callback; },
    onINP: callback => { vitalCallbacks.INP = callback; },
    onLCP: callback => { vitalCallbacks.LCP = callback; },
  };
  appendedScripts.find((script) => script.src === "/assets/vendor/web-vitals-6.0.1.iife.js")?.onload?.();
  vitalCallbacks.LCP?.({ name: "LCP", id: "v6-test", value: 1234.5, delta: 1234.5, rating: "good", navigationType: "navigate", navigationURL: "https://thaylinhtuyenthomo.vn/", entries: [{ startTime: 1234.5 }] });
  const commands = windowStub.dataLayer.filter(item => Object.prototype.toString.call(item) === "[object Arguments]").map(item => Array.from(item));
  const lcpEvent = commands.find(item => item[0] === "event" && item[1] === "LCP");
  if (!lcpEvent || lcpEvent[2]?.metric_id !== "v6-test" || lcpEvent[2]?.metric_value !== 1234.5 || lcpEvent[2]?.page_group !== "home") {
    fail("Analytics: dữ liệu LCP ẩn danh không được chuyển đúng sang GA4");
  }
  if (windowStub.fbq?.queue?.some((entry) => entry[1] === "LCP")) fail("Analytics: Web Vitals không được gửi sang Meta Pixel");
} catch (error) {
  fail(`Analytics: không chạy được kiểm thử nạp chậm (${error.message})`);
}

try {
  const blockedScripts = [];
  const consentBanners = [];
  const choiceStore = new Map();
  const blockedWindow = {
    dataLayer: [],
    requestIdleCallback: () => { throw new Error("Không được lên lịch nhà cung cấp trước khi đồng ý"); },
    setTimeout: () => 1,
    clearTimeout: () => {},
    addEventListener: () => {},
  };
  blockedWindow.window = blockedWindow;
  const blockedDocument = {
    referrer: "",
    cookie: "",
    documentElement: { dataset: {} },
    head: { append: node => blockedScripts.push(node) },
    body: { append: node => consentBanners.push(node) },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
      dataset: {},
      setAttribute() {},
      removeAttribute() {},
      querySelectorAll: () => [],
    }),
    addEventListener: () => {},
  };
  vm.runInNewContext(analytics, {
    window: blockedWindow,
    document: blockedDocument,
    location: { search: "", pathname: "/", href: "https://thaylinhtuyenthomo.vn/" },
    localStorage: {
      getItem: key => choiceStore.get(key) || null,
      setItem: (key, value) => choiceStore.set(key, String(value)),
      removeItem: key => choiceStore.delete(key),
    },
    URL,
    URLSearchParams,
    Date,
    Object,
    Array,
    String,
    Number,
    RegExp,
  }, { filename: "analytics-consent.js" });
  if (blockedScripts.length) fail("Consent: nạp script đo lường trước khi có lựa chọn");
  if (consentBanners.length !== 1) fail("Consent: lần truy cập đầu không hiển thị lựa chọn đo lường");
  blockedWindow.thayLinhAnalytics.track({ event: "contact_click", channel: "zalo" });
  blockedWindow.thayLinhAnalytics.consent("denied");
  if (blockedScripts.length || blockedWindow.thayLinhAnalytics.consentState() !== "denied" || choiceStore.get("thaylinh_measurement_consent_v1") !== "denied") {
    fail("Consent: lựa chọn Chỉ cần thiết vẫn kích hoạt đo lường hoặc không được lưu");
  }
} catch (error) {
  fail(`Consent: không chạy được kiểm thử mặc định từ chối (${error.message})`);
}

const home = read("index.html");
const homeScript = read("portal-official.js");
const homeStyles = read("landing-recruitment.css");
const homeVideoFacades = (home.match(/data-featured-video-facade/g) || []).length;
if (homeVideoFacades !== 1) fail(`Trang chủ đơn giản: dự kiến 1 lớp xem trước video, thực tế ${homeVideoFacades}`);
if (/<iframe\b/i.test(home)) fail("Trang chủ: còn tạo trình phát YouTube trước khi người dùng bấm xem");
if (/rel=["']preconnect["'][^>]+youtube-nocookie\.com/i.test(home)) fail("Trang chủ: còn mở sớm kết nối trình phát YouTube");
for (const marker of ["mountYouTubePlayer", "renderVideoFacade", "activateFacade", "host.replaceChildren(frame)"]) {
  if (!homeScript.includes(marker)) fail(`Trang chủ: thiếu hành vi video ${marker}`);
}
for (const marker of ["home-video-facade", "home-video-facade__play", "focus-visible"]) {
  if (!homeStyles.includes(marker)) fail(`Trang chủ: thiếu kiểu lớp xem trước ${marker}`);
}
const optimizedHomeImages = [
  ["/assets/vinacomin-hoc-sinh-trai-nghiem-mo.webp", "1200", "673", "eager"],
  ["/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp", "1200", "736", "lazy"],
  ["/assets/vinacomin-tho-mo-ham-lo-1200.webp", "1200", "800", "lazy"],
];
for (const [source, width, height, delivery] of optimizedHomeImages) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = home.match(new RegExp(`<img\\b[^>]*src=["']${escaped}["'][^>]*>`, "i"))?.[0] || "";
  if (!tag) fail(`Trang chủ: thiếu ảnh Vinacomin ${source}`);
  else {
    const deliveryMarker = delivery === "eager" ? 'fetchpriority="high"' : 'loading="lazy"';
    if (![deliveryMarker, "decoding=\"async\"", `width=\"${width}\"`, `height=\"${height}\"`].every((marker) => tag.includes(marker))) fail(`Trang chủ: ảnh ${source} chưa đủ thuộc tính tải và chống dịch chuyển bố cục`);
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
const fontWeights = [400, 500, 600, 700, 800, 900];
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
if ((fontCss.match(/font-display:swap/g) || []).length !== 12) fail("Font: 12 tập con phải dùng font-display:swap");
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
  if (html.includes('href="/fonts.css?v=1"')) localFontPages += 1;
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
  "analytics.js": 19_000,
  "fonts.css": 9_000,
  "mobile-ux.css": 16_000,
  "mobile-ux.js": 42_000,
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
  deferred_scripts: appendedScripts.length,
  web_vitals_version: "6.0.1",
  optimized_home_images: optimizedHomeImages.length,
  home_video_facades: homeVideoFacades,
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
