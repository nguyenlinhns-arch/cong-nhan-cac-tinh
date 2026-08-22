import fs from "node:fs";
import path from "node:path";
import {dailyCommunityArticles} from "./daily-community-articles-all.mjs";

await import("./validate-editorial-source-v5.mjs");
await import("./generate-seo-library-base.mjs");

const root = path.resolve("tuyen-tho-mo");
const latest = dailyCommunityArticles.reduce((value, article) => {
  const candidate = article.updated || article.published;
  return new Date(candidate) > new Date(value) ? candidate : value;
}, "1970-01-01T00:00:00Z");
const date = latest.slice(0, 10);

const categoryPath = path.join(root, "tin-nganh-than", "index.html");
let category = fs.readFileSync(categoryPath, "utf8");
category = category.replace(/("dateModified":")[^"]+("[^]*?"mainEntity")/, `$1${latest}$2`);
fs.writeFileSync(categoryPath, category);

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
sitemap = sitemap.replace(/(<loc>https:\/\/thaylinhtuyenthomo\.vn\/tin-nganh-than\/<\/loc><lastmod>)[^<]+/, `$1${date}`);
fs.writeFileSync(sitemapPath, sitemap);

const feedPath = path.join(root, "feed.xml");
let feed = fs.readFileSync(feedPath, "utf8");
feed = feed.replace(/<lastBuildDate>[^<]+<\/lastBuildDate>/, `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>`);
fs.writeFileSync(feedPath, feed);

const ledgerPath = path.resolve("content", "editorial-sources.json");
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
ledger.updated_at = latest;
fs.writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
