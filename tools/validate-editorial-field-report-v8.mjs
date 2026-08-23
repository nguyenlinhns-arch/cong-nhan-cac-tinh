import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const reports = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-field-reports-v8.json"), "utf8"));
const errors = [];
const base = "https://thaylinhtuyenthomo.vn";
const pages = {
  "gia-lai": {slug:"ia-rdeh-gia-lai-con-duong-den-vung-mo", province:"Gia Lai", provincePath:"/viec-lam-nganh-than/gia-lai/"},
  "quang-ngai": {slug:"quang-ngai-hanh-trinh-den-vung-mo-quang-ninh", province:"Quảng Ngãi", provincePath:"/viec-lam-nganh-than/quang-ngai/"},
};
const stats = {checked:0, original:0, sourceReady:0, videoReady:0, cleanLanguage:0, standalone:0, schemaReady:0, discoveryReady:0, feedReady:0};

function visible(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value = "") { return visible(value).split(/\s+/u).filter(Boolean).length; }

const banned = [
  /theo\s+nguồn/iu,
  /nguồn\s+cho\s+biết/iu,
  /đáng\s+chú\s+ý(?:\s+là)?/iu,
  /có\s+thể\s+thấy\s+rằng/iu,
  /điều\s+này\s+cho\s+thấy/iu,
  /không\s+chỉ[^.!?]{0,100}mà\s+còn/iu,
  /chuẩn\s+seo|tối\s+ưu\s+seo/iu,
  /bài\s+viết\s+này/iu,
];

const requiredFacts = {
  "gia-lai": ["Ia RDeh", "Than Nam Mẫu", "21 công nhân", "trên 30 học sinh", "Kso Sới", "UBND xã"],
  "quang-ngai": ["Quảng Ngãi", "Quảng Ninh", "nhập học", "rời quê"],
};

const sitemap = fs.existsSync(path.join(siteRoot, "sitemap.xml")) ? fs.readFileSync(path.join(siteRoot, "sitemap.xml"), "utf8") : "";
const llms = fs.existsSync(path.join(siteRoot, "llms.txt")) ? fs.readFileSync(path.join(siteRoot, "llms.txt"), "utf8") : "";
const hubFile = path.join(siteRoot, "phong-su", "index.html");
if (!fs.existsSync(hubFile)) errors.push("Thiếu hub /phong-su/");
else {
  const hub = fs.readFileSync(hubFile, "utf8");
  if (!hub.includes('"@type":"CollectionPage"') || !hub.includes('"@type":"ItemList"')) errors.push("Hub phóng sự thiếu CollectionPage/ItemList schema");
  if (!hub.includes('<strong>Thầy Linh</strong>') || !hub.includes('<small>Tuyển Thợ Mỏ</small>')) errors.push("Hub phóng sự thiếu nhận diện chuẩn");
  if (!hub.includes('/phong-su/feed.xml') || !hub.includes('/phong-su/feed.json')) errors.push("Hub phóng sự thiếu liên kết RSS/JSON Feed");
  for (const config of Object.values(pages)) if (!hub.includes(`/phong-su/${config.slug}/`)) errors.push(`Hub thiếu bài ${config.slug}`);
}

for (const [slug, report] of Object.entries(reports)) {
  stats.checked += 1;
  const config = pages[slug];
  if (!config) { errors.push(`${slug}: chưa khai báo URL phóng sự độc lập`); continue; }

  const provinceFile = path.join(siteRoot, "viec-lam-nganh-than", slug, "index.html");
  if (!fs.existsSync(provinceFile)) { errors.push(`${slug}: thiếu trang địa phương`); continue; }
  const html = fs.readFileSync(provinceFile, "utf8");
  const pattern = new RegExp(`<!-- field-report-v8:start:${slug} -->([\\s\\S]*?)<!-- field-report-v8:end:${slug} -->`, "i");
  const section = html.match(pattern)?.[1] || "";
  if (!section || !section.includes('data-editorial-original="field-report-v8"')) { errors.push(`${slug}: thiếu phóng sự hiện trường v8`); continue; }
  stats.original += 1;

  if (!html.includes('/editorial-field-report-v8.css?v=2')) errors.push(`${slug}: thiếu stylesheet phóng sự v8 bản 2`);
  if (!section.includes(`/phong-su/${config.slug}/`)) errors.push(`${slug}: khối địa phương chưa liên kết tới bài phóng sự độc lập`);
  if (!section.includes(report.videoUrl)) errors.push(`${slug}: thiếu đúng URL video gốc`); else stats.videoReady += 1;
  if (!section.includes('<strong>Tư liệu:</strong>')) errors.push(`${slug}: thiếu ghi chú tư liệu`); else stats.sourceReady += 1;

  const text = visible(section);
  const paragraphs = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => visible(match[1])).filter(Boolean);
  const headings = [...section.matchAll(/<h3>([\s\S]*?)<\/h3>/gi)].map((match) => visible(match[1])).filter(Boolean);
  if (paragraphs.length < 9 || paragraphs.length > 12) errors.push(`${slug}: số đoạn hiển thị ${paragraphs.length}, cần 9–12 kể cả sapô/kết/tư liệu`);
  if (headings.length < 2 || headings.length > 3) errors.push(`${slug}: cần 2–3 tiêu đề phụ, hiện có ${headings.length}`);
  const lead = visible(section.match(/class="editorial-field-report-v8__lead"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  if (words(lead) < 35 || words(lead) > 90) errors.push(`${slug}: sapô hiện trường dài ${words(lead)} từ`);
  const prose = section.match(/<article\b[^>]*class="[^"]*editorial-field-report-v8__prose[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] || "";
  const proseParagraphs = [...prose.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => visible(match[1])).filter(Boolean);
  if (proseParagraphs.length < 7 || proseParagraphs.length > 8) errors.push(`${slug}: phần văn xuôi có ${proseParagraphs.length} đoạn, cần 7–8`);
  for (const paragraph of proseParagraphs) {
    if (words(paragraph) < 18) errors.push(`${slug}: còn đoạn văn xuôi quá ngắn ${words(paragraph)} từ`);
    if (words(paragraph) > 125) errors.push(`${slug}: còn đoạn văn xuôi quá dài ${words(paragraph)} từ`);
  }
  const triggered = banned.filter((patternItem) => patternItem.test(text));
  if (triggered.length) errors.push(`${slug}: còn văn mẫu/quảng cáo ${triggered.map(String).join(" | ")}`); else stats.cleanLanguage += 1;
  for (const fact of requiredFacts[slug] || []) if (!text.includes(fact)) errors.push(`${slug}: thiếu dữ kiện bắt buộc “${fact}”`);
  if (report.dateModified && !html.includes(`"dateModified":"${report.dateModified}"`)) errors.push(`${slug}: dateModified chưa cập nhật ${report.dateModified}`);

  const articlePath = `/phong-su/${config.slug}/`;
  const standaloneFile = path.join(siteRoot, "phong-su", config.slug, "index.html");
  if (!fs.existsSync(standaloneFile)) { errors.push(`${slug}: thiếu trang độc lập ${articlePath}`); continue; }
  const standalone = fs.readFileSync(standaloneFile, "utf8");
  const canonical = `${base}${articlePath}`;
  if (!standalone.includes(`<link rel="canonical" href="${canonical}">`)) errors.push(`${slug}: canonical trang phóng sự chưa đúng`);
  if (!standalone.includes('data-editorial-original="field-report-v8"')) errors.push(`${slug}: trang độc lập thiếu dấu nguồn nguyên bản`);
  if (!standalone.includes(report.videoUrl) || !standalone.includes('<strong>Tư liệu:</strong>')) errors.push(`${slug}: trang độc lập thiếu video/tư liệu gốc`);
  if (!standalone.includes('/phong-su/feed.xml') || !standalone.includes('/phong-su/feed.json')) errors.push(`${slug}: trang độc lập thiếu liên kết feed phóng sự`);
  if (!standalone.includes(config.provincePath)) errors.push(`${slug}: trang độc lập thiếu liên kết về trang tỉnh`);
  if (!standalone.includes('"@type":"Article"') || !standalone.includes('"@type":"VideoObject"') || !standalone.includes('"@type":"WebPage"')) errors.push(`${slug}: trang độc lập thiếu Article/VideoObject/WebPage schema`);
  else stats.schemaReady += 1;
  if (banned.some((patternItem) => patternItem.test(visible(standalone)))) errors.push(`${slug}: trang độc lập còn văn mẫu/quảng cáo`);
  else stats.standalone += 1;
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`${slug}: sitemap chưa có ${articlePath}`);
  if (!llms.includes(`](${canonical})`)) errors.push(`${slug}: llms.txt chưa giới thiệu bài phóng sự`);
  else stats.discoveryReady += 1;
}

const rssPath = path.join(siteRoot, "phong-su", "feed.xml");
const jsonFeedPath = path.join(siteRoot, "phong-su", "feed.json");
if (!fs.existsSync(rssPath) || !fs.existsSync(jsonFeedPath)) errors.push("Thiếu RSS hoặc JSON Feed riêng của phóng sự");
else {
  const rss = fs.readFileSync(rssPath, "utf8");
  let jsonFeed = null;
  try { jsonFeed = JSON.parse(fs.readFileSync(jsonFeedPath, "utf8")); } catch { errors.push("JSON Feed phóng sự không parse được"); }
  const expectedUrls = Object.values(pages).map((config) => `${base}/phong-su/${config.slug}/`);
  const rssItems = [...rss.matchAll(/<item>/g)].length;
  if (rssItems !== expectedUrls.length) errors.push(`RSS phóng sự có ${rssItems}/${expectedUrls.length} item`);
  if (!rss.includes(`<atom:link href="${base}/phong-su/feed.xml" rel="self" type="application/rss+xml" />`)) errors.push("RSS phóng sự thiếu atom self link");
  for (const url of expectedUrls) if (!rss.includes(`<link>${url}</link>`)) errors.push(`RSS phóng sự thiếu ${url}`);
  if (jsonFeed) {
    if (jsonFeed.version !== "https://jsonfeed.org/version/1.1") errors.push("JSON Feed phóng sự chưa dùng version 1.1");
    if (jsonFeed.feed_url !== `${base}/phong-su/feed.json`) errors.push("JSON Feed phóng sự có feed_url sai");
    if (!Array.isArray(jsonFeed.items) || jsonFeed.items.length !== expectedUrls.length) errors.push(`JSON Feed phóng sự có ${jsonFeed.items?.length || 0}/${expectedUrls.length} item`);
    for (const url of expectedUrls) if (!jsonFeed.items?.some((item) => item.url === url && item.id === url)) errors.push(`JSON Feed phóng sự thiếu ${url}`);
    if (jsonFeed.items?.some((item) => !item.external_url?.startsWith("https://www.facebook.com/reel/"))) errors.push("JSON Feed phóng sự có item thiếu video gốc Facebook Reel");
  }
  for (const feedUrl of [`${base}/phong-su/feed.xml`, `${base}/phong-su/feed.json`]) if (!llms.includes(feedUrl)) errors.push(`llms.txt thiếu feed phóng sự ${feedUrl}`);
  if (!errors.some((error) => /Feed|RSS/.test(error))) stats.feedReady = 2;
}

if (!sitemap.includes(`<loc>${base}/phong-su/</loc>`)) errors.push("Sitemap chưa có hub /phong-su/");
if (!llms.includes("## Phóng sự hiện trường nguyên bản")) errors.push("llms.txt thiếu mục phóng sự hiện trường nguyên bản");
if (stats.checked !== 2) errors.push(`Cần đúng 2 phóng sự hiện trường v8, hiện có ${stats.checked}`);

console.log(JSON.stringify({...stats, errors:errors.length, sampleErrors:errors.slice(0,50)}, null, 2));
if (errors.length) process.exitCode = 1;
