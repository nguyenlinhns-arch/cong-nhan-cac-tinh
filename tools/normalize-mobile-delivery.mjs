import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const FONT_URL = "/fonts.css?v=2";
const CSS_URL = "/mobile-core.css?v=1";
const JS_URL = "/mobile-core.js?v=1";
const ANALYTICS_URL = "/analytics.js?v=6";
const APPLICATION_URL = "/job-application.js?v=10";
const FINDER_URL = "/worker-info-finder.js?v=4";
const RECRUITMENT_URL = "/recruitment-config.js?v=4";
const HOME_URL = "https://thaylinhtuyenthomo.vn/";
const PRIMARY_QN_PATH = "/tuyen-tho-mo-quang-ninh/";
const PRIMARY_QN_URL = `https://thaylinhtuyenthomo.vn${PRIMARY_QN_PATH}`;
const RETIRED_QN_PATH = "/viec-lam-nganh-than/quang-ninh/";
const RETIRED_QN_URL = `https://thaylinhtuyenthomo.vn${RETIRED_QN_PATH}`;

function collectHtml(directory, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(full, output);
    else if (entry.name.endsWith(".html") && !/^google[a-z0-9_-]+\.html$/i.test(entry.name)) output.push(full);
  }
  return output;
}

function dedupeStylesheet(html, href) {
  let seen = false;
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`\\s*<link\\s+rel=["']stylesheet["']\\s+href=["']${escaped}["']\\s*\\/?>`, "gi"), (tag) => {
    if (seen) return "";
    seen = true;
    return tag;
  });
}

function shortenDescription(html, max = 160) {
  return html.replace(/(<meta\s+name=["']description["']\s+content=["'])([^"']*)(["'])/i, (_match, open, content, close) => {
    if ([...content].length <= max) return `${open}${content}${close}`;
    const clipped = [...content].slice(0, max - 1).join("");
    const clean = clipped.replace(/\s+\S*$/u, "").replace(/[,:;\s]+$/u, "");
    return `${open}${clean}.${close}`;
  });
}

function normalizeIncomeWording(value) {
  return String(value)
    .replaceAll("THU NHẬP BÌNH QUÂN", "THU NHẬP")
    .replace(/mức thu nhập được cam kết/giu, "mức thu nhập")
    .replace(/được cam kết mức thu nhập/giu, "có mức thu nhập")
    .replace(/được cam kết thu nhập/giu, "có mức thu nhập")
    .replace(/cam kết mức thu nhập/giu, "mức thu nhập")
    .replace(/cam kết thu nhập/giu, "thu nhập")
    .replace(/cam kết\s+20[–-]25\s+triệu(?:\s+đồng)?\/tháng/giu, "thu nhập 20–25 triệu đồng/tháng");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function consolidateQuangNinhReferences(value) {
  const boundary = `(?=$|[?#\"'\\s<>()])`;
  return String(value)
    .replace(new RegExp(`${escapeRegExp(RETIRED_QN_URL)}${boundary}`, "g"), PRIMARY_QN_URL)
    .replace(new RegExp(`${escapeRegExp(RETIRED_QN_PATH)}${boundary}`, "g"), PRIMARY_QN_PATH);
}

function ensureProvincePrimaryLink(html) {
  if (html.includes(`href="${PRIMARY_QN_PATH}"`) || html.includes(`href='${PRIMARY_QN_PATH}'`)) return html;
  const bridge = `<p class="local-primary-link">Nơi học và làm việc là Quảng Ninh. <a href="${PRIMARY_QN_PATH}">Xem thông tin tuyển thợ mỏ Quảng Ninh 2026</a> trước khi đăng ký.</p>`;
  return html.replace(/(<p class=["']local-hero__lead["']>[\s\S]*?<\/p>)/i, `$1\n        ${bridge}`);
}

function normalizeHomepageSeo(html) {
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "<title>Học nghề mỏ &amp; việc làm ngành Than 2026 | Thầy Linh</title>");
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*>/i, '<meta name="description" content="Hướng dẫn học nghề mỏ, điều kiện, hồ sơ, quyền lợi và việc làm ngành Than năm 2026. Chọn thông tin theo nhu cầu và địa phương để đăng ký đúng lộ trình.">');
  html = html.replace(/<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*>/i, '<meta name="keywords" content="học nghề mỏ, việc làm ngành Than, hồ sơ học nghề mỏ, điều kiện thợ lò, tuyển thợ mỏ theo tỉnh">');
  html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*>/i, '<meta property="og:title" content="Học nghề mỏ &amp; việc làm ngành Than – Thầy Linh">');
  html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*>/i, '<meta property="og:description" content="Tìm hiểu nghề mỏ, điều kiện, hồ sơ, quyền lợi và lộ trình từ học nghề đến việc làm ngành Than.">');
  html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*>/i, '<meta name="twitter:title" content="Học nghề mỏ &amp; việc làm ngành Than – Thầy Linh">');
  html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*>/i, '<meta name="twitter:description" content="Tìm hiểu nghề mỏ, điều kiện, hồ sơ, quyền lợi và lộ trình từ học nghề đến việc làm ngành Than.">');

  const preferredH1 = '<h1 id="home-v6-title">Học nghề mỏ và việc làm ngành Than.<span>Bắt đầu từ đây.</span></h1>';
  if (/<h1\b[^>]*id=["']home-v6-title["'][^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    html = html.replace(/<h1\b[^>]*id=["']home-v6-title["'][^>]*>[\s\S]*?<\/h1>/i, preferredH1);
  } else {
    html = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, preferredH1);
  }

  html = html.replace(/<p class=["']home-v6-hero__lead["']>[\s\S]*?<\/p>/i, '<p class="home-v6-hero__lead">Tìm hiểu nghề mỏ, chọn nghề phù hợp, kiểm tra điều kiện và hồ sơ trước khi đăng ký. Nếu mục tiêu là làm việc tại Quảng Ninh, xem <a href="/tuyen-tho-mo-quang-ninh/">trang tuyển thợ mỏ Quảng Ninh 2026</a>.</p>');

  html = html.replace(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, (full, body) => {
    try {
      const data = JSON.parse(body);
      const visit = (node) => {
        if (Array.isArray(node)) {
          node.forEach(visit);
          return;
        }
        if (!node || typeof node !== "object") return;
        if (node["@type"] === "WebSite" && node.url === HOME_URL) {
          node.description = "Thông tin học nghề mỏ, việc làm ngành Than và tuyển thợ mỏ theo tỉnh.";
        }
        if (node["@type"] === "WebPage" && node.url === HOME_URL) {
          node.name = "Học nghề mỏ và việc làm ngành Than – Thầy Linh";
          node.description = "Hướng dẫn học nghề mỏ, điều kiện, hồ sơ, quyền lợi và lộ trình từ học nghề đến việc làm ngành Than năm 2026.";
        }
        Object.values(node).forEach(visit);
      };
      visit(data);
      return full.replace(body, JSON.stringify(data));
    } catch (_) {
      return full;
    }
  });

  return html;
}

function normalizeJsonStrings(node) {
  if (Array.isArray(node)) return node.map(normalizeJsonStrings);
  if (!node || typeof node !== "object") {
    return typeof node === "string"
      ? consolidateQuangNinhReferences(normalizeIncomeWording(node))
      : node;
  }
  for (const [key, value] of Object.entries(node)) node[key] = normalizeJsonStrings(value);
  return node;
}

function normalizeSearchJson(file, {redirectRetiredProvince = false} = {}) {
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (redirectRetiredProvince && Array.isArray(data.items)) {
    for (const item of data.items) {
      if (item?.url === RETIRED_QN_PATH) item.url = PRIMARY_QN_PATH;
    }
  }
  normalizeJsonStrings(data);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return Array.isArray(data.items) ? data.items.length : null;
}

function removeRetiredSitemapUrl(xml) {
  const escaped = RETIRED_QN_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return xml.replace(new RegExp(`<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>\\s*`, "g"), "");
}

function ensurePrimarySitemapUrl(xml) {
  if (xml.includes(`<loc>${PRIMARY_QN_URL}</loc>`)) return xml;
  const entry = `  <url><loc>${PRIMARY_QN_URL}</loc><lastmod>2026-08-23</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
  return xml.replace(/<\/urlset>\s*$/i, `${entry}</urlset>\n`);
}

let changed = 0;
let viewportFixed = 0;
let assetsFixed = 0;
let fontLinksFixed = 0;
let duplicateMobileCssRemoved = 0;
let provinceDescriptionsShortened = 0;
let incomeWordingNormalized = 0;
let quangNinhReferencesConsolidated = 0;
let homepageSeoNormalized = 0;
let provincePrimaryLinksAdded = 0;

// A second pass closes the small window where another build step has just
// materialized late province pages before validation starts.
for (let pass = 0; pass < 2; pass += 1) {
for (const file of collectHtml(root)) {
  const before = fs.readFileSync(file, "utf8");
  let html = before;

  html = html.replace(/(<meta\s+name=["']viewport["']\s+content=["'])([^"']*)(["'])/i, (_match, open, content, close) => {
    const values = content.split(",").map((value) => value.trim()).filter(Boolean);
    if (!values.includes("width=device-width")) values.unshift("width=device-width");
    if (!values.includes("initial-scale=1")) values.push("initial-scale=1");
    if (!values.includes("viewport-fit=cover")) {
      values.push("viewport-fit=cover");
      viewportFixed += 1;
    }
    return `${open}${values.join(",")}${close}`;
  });

  const next = html
    .replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/?fonts\.css\?v=\d+["']\s*\/?>/gi, "")
    .replace(/\/?mobile-(?:ux|core)\.css\?v=\d+/g, CSS_URL)
    .replace(/\/?mobile-(?:ux|core)\.js\?v=\d+/g, JS_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)analytics\.js\?v=\d+/g, ANALYTICS_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)job-application\.js\?v=\d+/g, APPLICATION_URL)
    .replace(/\/worker-info-finder\.js\?v=\d+/g, FINDER_URL)
    .replace(/(?:\/|\.\.\/\.\.\/)recruitment-config\.js\?v=\d+/g, RECRUITMENT_URL);
  if (next !== html) assetsFixed += 1;
  html = next;

  const mobileCountBefore = (html.match(/<link\s+rel=["']stylesheet["']\s+href=["']\/mobile-core\.css\?v=1["']/gi) || []).length;
  html = dedupeStylesheet(html, CSS_URL);
  if (mobileCountBefore > 1) duplicateMobileCssRemoved += mobileCountBefore - 1;

  const relative = path.relative(root, file).split(path.sep).join("/");
  if (/^viec-lam-nganh-than\/[^/]+\/index\.html$/.test(relative) && relative !== "viec-lam-nganh-than/quang-ninh/index.html") {
    const old = html;
    html = ensureProvincePrimaryLink(html);
    if (html !== old) provincePrimaryLinksAdded += 1;
  }
  if (relative === "viec-lam-nganh-than/can-tho/index.html" || relative === "viec-lam-nganh-than/vinh-long/index.html") {
    const old = html;
    html = shortenDescription(html, 160);
    if (html !== old) provinceDescriptionsShortened += 1;
  }

  if (relative === "index.html") {
    const old = html;
    html = normalizeHomepageSeo(html);
    if (html !== old) homepageSeoNormalized += 1;
  }

  const beforeIncome = html;
  html = normalizeIncomeWording(html);
  if (html !== beforeIncome) incomeWordingNormalized += 1;

  const beforeReferences = html;
  html = consolidateQuangNinhReferences(html);
  if (html !== beforeReferences) quangNinhReferencesConsolidated += 1;

  const skipStandaloneFonts = relative === "index.html" || relative === "tuyen-tho-mo-quang-ninh/index.html";
  if (/<\/head>/i.test(html) && !skipStandaloneFonts) {
    html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${FONT_URL}">\n</head>`);
    if (!before.includes(FONT_URL) || before.lastIndexOf(FONT_URL) < before.lastIndexOf('rel="stylesheet"')) fontLinksFixed += 1;
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}
}

let sitemapRedirectRemoved = false;
let primaryQuangNinhAddedToSitemap = false;
const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const before = fs.readFileSync(sitemapPath, "utf8");
  const after = ensurePrimarySitemapUrl(removeRetiredSitemapUrl(before));
  if (after !== before) {
    fs.writeFileSync(sitemapPath, after);
    sitemapRedirectRemoved = before.includes(`<loc>${RETIRED_QN_URL}</loc>`) && !after.includes(`<loc>${RETIRED_QN_URL}</loc>`);
    primaryQuangNinhAddedToSitemap = !before.includes(`<loc>${PRIMARY_QN_URL}</loc>`) && after.includes(`<loc>${PRIMARY_QN_URL}</loc>`);
  }
}

let llmsNormalized = false;
const llmsPath = path.join(root, "llms.txt");
if (fs.existsSync(llmsPath)) {
  const before = fs.readFileSync(llmsPath, "utf8");
  const after = consolidateQuangNinhReferences(normalizeIncomeWording(before));
  if (after !== before) {
    fs.writeFileSync(llmsPath, after);
    llmsNormalized = true;
  }
}

const coreCount = normalizeSearchJson(path.join(root, "search-core.json"));
const provinceCount = normalizeSearchJson(path.join(root, "search-provinces.json"), {redirectRetiredProvince: true});
const contentCount = normalizeSearchJson(path.join(root, "search-content.json"));
const searchIndexPath = path.join(root, "search-index.json");
let searchIndexNormalized = false;
if (fs.existsSync(searchIndexPath)) {
  const index = JSON.parse(fs.readFileSync(searchIndexPath, "utf8"));
  normalizeJsonStrings(index);
  if (index.counts && [coreCount, provinceCount, contentCount].every(Number.isInteger)) {
    index.counts.core = coreCount;
    index.counts.provinces = provinceCount;
    index.counts.content = contentCount;
    index.counts.total = coreCount + provinceCount + contentCount;
  }
  fs.writeFileSync(searchIndexPath, `${JSON.stringify(index, null, 2)}\n`);
  searchIndexNormalized = true;
}

console.log(JSON.stringify({
  html_checked: collectHtml(root).length,
  html_changed: changed,
  viewport_fixed: viewportFixed,
  asset_versions_fixed: assetsFixed,
  font_links_fixed: fontLinksFixed,
  duplicate_mobile_css_removed: duplicateMobileCssRemoved,
  province_descriptions_shortened: provinceDescriptionsShortened,
  homepage_seo_normalized: homepageSeoNormalized,
  province_primary_links_added: provincePrimaryLinksAdded,
  income_wording_normalized_pages: incomeWordingNormalized,
  quang_ninh_references_consolidated_pages: quangNinhReferencesConsolidated,
  retired_quang_ninh_removed_from_sitemap: sitemapRedirectRemoved,
  primary_quang_ninh_added_to_sitemap: primaryQuangNinhAddedToSitemap,
  llms_normalized: llmsNormalized,
  search_index_normalized: searchIndexNormalized,
  search_counts: {core: coreCount, provinces: provinceCount, content: contentCount},
  font_css: FONT_URL,
  mobile_css: CSS_URL,
  mobile_js: JS_URL,
  analytics_js: ANALYTICS_URL,
  application_js: APPLICATION_URL,
  recruitment_js: RECRUITMENT_URL,
}, null, 2));
