import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const errors = [];
const fail = (message) => errors.push(message);
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

function requireMarkers(file, markers) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { fail(`${file}: thiếu tệp`); return; }
  const html = fs.readFileSync(full, "utf8");
  for (const marker of markers) if (!html.includes(marker)) fail(`${file}: thiếu ${marker}`);
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
for (const [file,url] of hubs) requireMarkers(file,[`<link rel="canonical" href="${base}${url}">`,'type="application/ld+json"','/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1']);

const verificationPages = ["chon-kcn-hay-lam-mo","cau-chuyen-cong-nhan","kiem-tra-dieu-kien","ho-so-nhap-hoc","thu-nhap-an-o-ho-tro","an-toan-ky-luat-moi-truong"];
for (const slug of verificationPages) requireMarkers(`${slug}/index.html`,['/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1']);
requireMarkers("hoc-nghe-mo-tai-quang-ninh/index.html",['"@type":"FAQPage"','/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1']);
requireMarkers("lien-he-di-lam-mo-than-quang-ninh/index.html",['Nguyễn Tử Linh (Thầy Linh)','Trưởng phòng Tuyển sinh Miền Trung','data-contact="zalo"','data-contact="phone"']);
requireMarkers("nghe-mo-ham-lo/index.html",['Kỹ thuật khai thác mỏ hầm lò','Kỹ thuật xây dựng mỏ hầm lò','Kỹ thuật cơ điện mỏ hầm lò']);
requireMarkers("tuyen-tho-mo-quang-ninh/index.html",['Tuyển thợ lò Quảng Ninh','Việc làm ngành Than tại Quảng Ninh','/ads-attribution.js?v=1','/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1','/quyen-rieng.html']);

const coverage = JSON.parse(read("local-coverage.json"));
const localityFeed = JSON.parse(read("localities.json"));
if (coverage.communes !== 3321) fail(`Phủ địa bàn: cần 3.321, nhận ${coverage.communes}`);
const provinceEntries = Object.entries(coverage.by_province || {});
if (provinceEntries.length !== 34) fail(`Phủ tỉnh/thành: cần 34, nhận ${provinceEntries.length}`);
if (localityFeed.total !== 3321 || localityFeed.localities?.length !== 3321) fail("localities.json chưa đủ 3.321 địa bàn");
if (new Set((localityFeed.localities || []).map(x => x.url)).size !== 3321) fail("localities.json có URL địa bàn trùng");

let localityPages = 0;
let localityHubs = 0;
for (const [provinceSlug, expectedCount] of provinceEntries) {
  const provinceFile = `viec-lam-nganh-than/${provinceSlug}/index.html`;
  requireMarkers(provinceFile,[`/viec-lam-nganh-than/${provinceSlug}/xa-phuong/`,'/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1','<strong>Thầy Linh</strong>','<small>Tuyển Thợ Mỏ</small>']);
  const hubFile = `viec-lam-nganh-than/${provinceSlug}/xa-phuong/index.html`;
  requireMarkers(hubFile,['/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1','<strong>Thầy Linh</strong>','<small>Tuyển Thợ Mỏ</small>']);
  const hubPath = path.join(root, hubFile);
  if (!fs.existsSync(hubPath)) continue;
  localityHubs++;
  const hub = fs.readFileSync(hubPath,"utf8");
  const links = [...hub.matchAll(/href="\.\.\/(xã|phường|đặc khu)\/([^/]+)\//giu)];
  if (links.length !== expectedCount) fail(`${provinceSlug}: hub có ${links.length}/${expectedCount} địa bàn`);
  for (const m of links) {
    const rel = `viec-lam-nganh-than/${provinceSlug}/${m[1]}/${m[2]}/index.html`;
    requireMarkers(rel,['data-local-quality="2"','utm_campaign=commune_jobs','NƠI HỌC & LÀM VIỆC','Cổng Thông tin điện tử Chính phủ','"@type":"FAQPage"','/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1','<strong>Thầy Linh</strong>','<small>Tuyển Thợ Mỏ</small>']);
    const html = fs.existsSync(path.join(root,rel)) ? fs.readFileSync(path.join(root,rel),"utf8") : "";
    if (/"@type"\s*:\s*"JobPosting"/u.test(html)) fail(`${rel}: không được khai JobPosting tại địa bàn tuyển nguồn`);
    localityPages++;
  }
}
if (localityPages !== 3321) fail(`Trang địa bàn: kiểm được ${localityPages}/3321`);
if (localityHubs !== 34) fail(`Hub xã/phường: có ${localityHubs}/34`);

const feed = JSON.parse(read("feed.json"));
const articles = Array.isArray(feed.items) ? feed.items : [];
if (!articles.length) fail("feed.json không có bài viết");
for (const article of articles) {
  const url = new URL(article.url);
  const rel = `${url.pathname.replace(/^\/+|\/+$/g,"")}/index.html`;
  requireMarkers(rel,['/analytics.js?v=6','/mobile-core.css?v=1','/mobile-core.js?v=1','rel="author" href="/tac-gia/nguyen-tu-linh/"']);
}

const communeSitemap = read("commune-sitemap.xml");
const communeUrls = [...communeSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if (communeUrls.length !== 3321 || new Set(communeUrls).size !== 3321) fail(`commune-sitemap.xml: ${communeUrls.length} URL, unique ${new Set(communeUrls).size}`);
const robots = read("robots.txt");
for (const marker of ["commune-sitemap.xml","province-sitemap.xml","jobs-sitemap.xml","localities.json"]) if (!robots.includes(marker)) fail(`robots.txt: thiếu ${marker}`);
const llms = read("llms.txt");
if (!llms.includes("localities.json")) fail("llms.txt: thiếu localities.json");

const htmlFiles = walk(root);
const contentFiles = htmlFiles.filter(file => !path.basename(file).startsWith("google"));
const materializedDelta = 3321 + 34 + Math.max(0, provinceEntries.length - 26);
const dailySeoFeed = JSON.parse(read("daily-seo-articles.json"));
const dailySeoPages = 1 + (Array.isArray(dailySeoFeed.articles) ? dailySeoFeed.articles.length : 0);
const permanentContentBaseline = 177 + dailySeoPages;
const expectedHtmlFiles = (permanentContentBaseline + 1) + materializedDelta;
const expectedContentFiles = permanentContentBaseline + materializedDelta;
if (htmlFiles.length !== expectedHtmlFiles) fail(`Website: cần ${expectedHtmlFiles} tệp HTML sau khi materialize 3.321 địa bàn, nhận ${htmlFiles.length}`);
if (contentFiles.length !== expectedContentFiles) fail(`Website: cần ${expectedContentFiles} trang nội dung sau khi materialize 3.321 địa bàn, nhận ${contentFiles.length}`);
for (const file of contentFiles) {
  const html = fs.readFileSync(file,"utf8");
  const relative = path.relative(root,file).split(path.sep).join("/");
  if (!html.includes('/analytics.js?v=6')) fail(`${relative}: chưa nạp analytics v6`);
  const css = relative === "index.html" ? "/home-critical.css?v=1" : "/mobile-core.css?v=1";
  if (!html.includes(css)) fail(`${relative}: chưa nạp ${css}`);
  if (!html.includes('/mobile-core.js?v=1')) fail(`${relative}: chưa nạp /mobile-core.js?v=1`);
}

console.log(JSON.stringify({html:htmlFiles.length,content_pages:contentFiles.length,hubs:hubs.length,verification_pages:verificationPages.length,daily_seo_pages:dailySeoPages,provinces:provinceEntries.length,locality_hubs:localityHubs,locality_pages:localityPages,articles:articles.length,errors:errors.length,sampleErrors:errors.slice(0,40)},null,2));
if (errors.length) process.exitCode = 1;
