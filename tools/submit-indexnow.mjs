import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const host = "thaylinhtuyenthomo.vn";
const base = `https://${host}`;
const key = "bf1717c52d36ed87c6b5f5cd57ffcb81";
const keyLocation = `${base}/${key}.txt`;

const jobs = JSON.parse(fs.readFileSync(path.join(siteRoot, "jobs.json"), "utf8"));
const sitemap = fs.readFileSync(path.join(siteRoot, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map(match => match[1]);
const urls = new Set([
  `${base}/`,
  `${base}/jobs.json`,
  `${base}/jobs.xml`,
  `${base}/jooble.xml`,
  `${base}/sitemap.xml`,
  ...jobs.jobs.filter(job => job.status === "open").map(job => job.url),
  ...sitemapUrls,
]);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: [...urls] }),
});

const responseBody = await response.text();
console.log(JSON.stringify({ status: response.status, submitted: urls.size, response: responseBody || null }));
if (![200, 202].includes(response.status)) process.exit(1);
