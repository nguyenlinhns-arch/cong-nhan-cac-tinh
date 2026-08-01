import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const feedPath = path.join(siteRoot, "feed.json");
const outputPath = path.resolve(process.env.NEWS_SITEMAP_OUTPUT || path.join(siteRoot, "news-sitemap.xml"));
const now = new Date(process.env.NEWS_SITEMAP_NOW || Date.now());
const windowStart = new Date(now.getTime() - (48 * 60 * 60 * 1000));
const futureTolerance = new Date(now.getTime() + (5 * 60 * 1000));
const base = "https://thaylinhtuyenthomo.vn";

if (Number.isNaN(now.getTime())) throw new Error("NEWS_SITEMAP_NOW must be a valid date when provided");

const xml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const feed = JSON.parse(fs.readFileSync(feedPath, "utf8"));
const items = (feed.items || [])
  .filter((item) => {
    const published = new Date(item.date_published);
    if (Number.isNaN(published.getTime())) return false;
    let url;
    try { url = new URL(item.url); }
    catch { return false; }
    return url.origin === base
      && url.pathname.startsWith("/tin-nganh-than/")
      && published >= windowStart
      && published <= futureTolerance;
  })
  .sort((a, b) => new Date(b.date_published) - new Date(a.date_published))
  .slice(0, 1000);

const urls = items.map((item) => `  <url>
    <loc>${xml(item.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>Thầy Linh – Tuyển Thợ Mỏ</news:name>
        <news:language>vi</news:language>
      </news:publication>
      <news:publication_date>${xml(new Date(item.date_published).toISOString())}</news:publication_date>
      <news:title>${xml(item.title)}</news:title>
    </news:news>
  </url>`).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}${urls ? "\n" : ""}</urlset>
`;

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
fs.writeFileSync(outputPath, sitemap);
console.log(JSON.stringify({output: outputPath, generatedAt: now.toISOString(), articles: items.length}, null, 2));
