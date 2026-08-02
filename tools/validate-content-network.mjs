import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const campaign = "lan_toa_nghe_mo_2026";
const errors = [];
const warnings = [];

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => errors.push(message);

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

const hubs = [
  ["thong-tin-tuyen-tho-mo/index.html", "/thong-tin-tuyen-tho-mo/"],
  ["trung-tam-nghe-mo/index.html", "/trung-tam-nghe-mo/"],
  ["viec-lam-nganh-than/index.html", "/viec-lam-nganh-than/"],
  ["cam-nang-nghe-mo/index.html", "/cam-nang-nghe-mo/"],
  ["chuyen-nguoi-tho/index.html", "/chuyen-nguoi-tho/"],
  ["chia-se-thong-tin/index.html", "/chia-se-thong-tin/"],
  ["tac-gia/nguyen-tu-linh/index.html", "/tac-gia/nguyen-tu-linh/"],
  ["nguyen-tac-bien-tap/index.html", "/nguyen-tac-bien-tap/"],
];

for (const [file, url] of hubs) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    fail(`${file}: thiếu trang trung tâm`);
    continue;
  }
  const html = fs.readFileSync(full, "utf8");
  const required = [
    `<link rel="canonical" href="${base}${url}">`,
    'type="application/ld+json"',
    '/content-network.css?v=1',
    '/analytics.js?v=5',
    '/mobile-ux.css?v=5',
    '/mobile-ux.js?v=7',
    '/feed.xml"',
    '/feed.json"',
    'data-contact="application"',
  ];
  for (const marker of required) if (!html.includes(marker)) fail(`${file}: thiếu ${marker}`);
}

const provinceData = JSON.parse(read("data/provinces-2026.json"));
const provinces = provinceData.provinces || [];
if (provinces.length !== 26) fail(`Dữ liệu tỉnh: cần 26, nhận ${provinces.length}`);

const shareHtml = read("chia-se-thong-tin/index.html");
const shareOptions = shareHtml.match(/<option\b/g)?.length || 0;
if (shareOptions !== 27) fail(`Bộ chia sẻ: cần 27 lựa chọn, nhận ${shareOptions}`);
for (const marker of ["data-share-builder", "data-share-province", "data-share-output", "data-package-copy", "data-package-share", "/share-tools.js?v=1", campaign]) {
  if (!shareHtml.includes(marker)) fail(`Bộ chia sẻ: thiếu ${marker}`);
}

let noindexProvinces = 0;
for (const province of provinces) {
  const file = `viec-lam-nganh-than/${province.slug}/index.html`;
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    fail(`${file}: thiếu trang tỉnh`);
    continue;
  }
  const html = fs.readFileSync(full, "utf8");
  if (!html.includes(`utm_content=province_${province.slug}`)) fail(`${file}: thiếu UTM theo tỉnh`);
  if (!html.includes("province=")) fail(`${file}: đường ứng tuyển không giữ tỉnh`);
  if (!html.includes('data-contact="application"')) fail(`${file}: thiếu đánh dấu ứng tuyển`);
  if (!/href=["'](?:\.\.\/\.\.\/|\/)thong-tin-tuyen-tho-mo\//i.test(html)) fail(`${file}: thiếu liên kết tới thông tin tuyển đang áp dụng`);
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const hasLocalEvidence = html.includes('id="local-story-title"');
  if (noindex) noindexProvinces += 1;
  if (hasLocalEvidence === noindex) fail(`${file}: trạng thái lập chỉ mục không khớp bằng chứng địa phương`);
  if (html.includes("Sao chép mẫu tin nhắn") || html.includes("data-copy-template")) fail(`${file}: nút sao chép mẫu tin nhắn đã bị loại bỏ nhưng xuất hiện lại`);
}
if (noindexProvinces !== 9) fail(`Trang tỉnh: cần noindex 9 trang chưa có dữ kiện riêng, nhận ${noindexProvinces}`);

const feed = JSON.parse(read("feed.json"));
const articles = Array.isArray(feed.items) ? feed.items : [];
if (!articles.length) fail("Thư viện: feed không có bài viết");
for (const article of articles) {
  const url = new URL(article.url);
  const relative = `${url.pathname.replace(/^\/+|\/+$/g, "")}/index.html`;
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) {
    fail(`${relative}: thiếu tệp bài viết`);
    continue;
  }
  const html = fs.readFileSync(full, "utf8");
  for (const marker of ["article-share-panel", `utm_campaign=${campaign}`, "/share-tools.js?v=1", "/content-network.css?v=1", 'rel="author" href="/tac-gia/nguyen-tu-linh/"', 'href="/thong-tin-tuyen-tho-mo/"']) {
    if (!html.includes(marker)) fail(`${relative}: thiếu ${marker}`);
  }
}

const htmlFiles = walk(root);
const contentFiles = htmlFiles.filter((file) => !path.basename(file).startsWith("google"));
const legacyRoutes = JSON.parse(fs.readFileSync(path.resolve("operations/legacy-routes.json"), "utf8")).routes || [];
const expectedHtmlFiles = 56 + articles.length;
const expectedContentFiles = 55 + articles.length;
if (htmlFiles.length !== expectedHtmlFiles) fail(`Website: cần ${expectedHtmlFiles} tệp HTML theo số bài trong feed, nhận ${htmlFiles.length}`);
if (contentFiles.length !== expectedContentFiles) fail(`Website: cần ${expectedContentFiles} trang nội dung theo số bài trong feed, nhận ${contentFiles.length}`);
for (const file of contentFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (!html.includes('/analytics.js?v=5')) fail(`${relative}: chưa nạp analytics v5`);
  if (!html.includes('/mobile-ux.css?v=5')) fail(`${relative}: chưa nạp mobile UX CSS v5`);
  const mobileUxVersion = "/mobile-ux.js?v=7";
  if (!html.includes(mobileUxVersion)) fail(`${relative}: chưa nạp ${mobileUxVersion}`);
}

const sitemap = read("sitemap.xml");
const sitemapUrls = sitemap.match(/<loc>/g)?.length || 0;
const indexablePages = contentFiles.filter((file) => !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(fs.readFileSync(file, "utf8"))).length;
if (sitemapUrls !== indexablePages) fail(`Sitemap: cần ${indexablePages} URL indexable, nhận ${sitemapUrls}`);
for (const route of legacyRoutes) {
  const relative = `${route.from.replace(/^\/+|\/+$/g, "")}/index.html`;
  const html = read(relative);
  if (!html.includes('data-legacy-redirect') || !html.includes('content="noindex,follow"')) fail(`${relative}: thiếu dấu chuyển hướng noindex`);
  if (!html.includes(`<link rel="canonical" href="${base}${route.to}">`)) fail(`${relative}: canonical không trỏ tới trang tỉnh hiện hành`);
  if (sitemap.includes(`<loc>${base}${route.from}</loc>`)) fail(`${relative}: URL cũ không được vào sitemap`);
  const targetRelative = `${route.to.replace(/^\/+|\/+$/g, "")}/index.html`;
  const targetHtml = read(targetRelative);
  const targetInSitemap = sitemap.includes(`<loc>${base}${route.to}</loc>`);
  const targetNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(targetHtml);
  if (route.targetIndexable === false) {
    if (targetInSitemap || !targetNoindex) fail(`${relative}: trang đích phải giữ noindex cho tới khi có bằng chứng địa phương`);
  } else if (!targetInSitemap || targetNoindex) {
    fail(`${relative}: trang đích hiện hành phải có trong sitemap`);
  }
}
for (const [, url] of hubs) if (!sitemap.includes(`<loc>${base}${url}</loc>`)) fail(`Sitemap: thiếu ${url}`);

const analytics = read("analytics.js");
const app = read("app.js");
const portal = read("portal-official.js");
const mobile = read("mobile-ux.js");
const shareTools = read("share-tools.js");
if (!analytics.includes('event: "contact_click"') || !analytics.includes('document.addEventListener("click"')) fail("Analytics: thiếu đo liên hệ ủy quyền");
for (const marker of ["ai_referral_visit", "chatgpt", "copilot", "perplexity", "gemini", "claude"]) if (!analytics.includes(marker)) fail(`Analytics: thiếu đo nguồn AI ${marker}`);
if (app.includes("contact_click") || portal.includes("contact_click")) fail("Analytics: contact_click còn bị khai báo lặp ở app/portal");
if (!mobile.includes("tl-mobile-contact__application") || !mobile.includes('data-contact="application"')) fail("Mobile UX: thiếu nút Ứng tuyển");
if (!shareTools.includes(`const CAMPAIGN = "${campaign}"`)) fail("Share tools: sai mã chiến dịch");
for (const field of ["full_name", "birth_date", "height_cm", "weight_kg", "health_screen", "education_level"]) {
  if (shareTools.includes(field)) fail(`Share tools: không được chứa trường ứng viên ${field}`);
}

const output = {
  html: htmlFiles.length,
  content_pages: contentFiles.length,
  sitemap_urls: sitemapUrls,
  hubs: hubs.length,
  provinces: provinces.length,
  share_packages: shareOptions,
  articles: articles.length,
  errors,
  warnings,
};

console.log(JSON.stringify(output, null, 2));
if (errors.length) process.exit(1);
