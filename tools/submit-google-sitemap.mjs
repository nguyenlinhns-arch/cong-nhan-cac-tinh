import { getGoogleAccessToken } from "./google-service-account-auth.mjs";

const site = process.env.GOOGLE_SEARCH_CONSOLE_SITE || "https://thaylinhtuyenthomo.vn/";
const sitemaps = (process.env.GOOGLE_SITEMAP_URLS || [
  "https://thaylinhtuyenthomo.vn/sitemap.xml",
  "https://thaylinhtuyenthomo.vn/news-sitemap.xml",
  "https://thaylinhtuyenthomo.vn/jobs-sitemap.xml",
  "https://thaylinhtuyenthomo.vn/province-sitemap.xml",
  "https://thaylinhtuyenthomo.vn/commune-sitemap.xml",
].join(",")).split(",").map((value) => value.trim()).filter(Boolean);

const token = await getGoogleAccessToken("https://www.googleapis.com/auth/webmasters");
const results = [];
for (const sitemap of sitemaps) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(sitemap)}`;
  const response = await fetch(endpoint, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(`Search Console sitemap submission failed for ${sitemap} (${response.status}): ${payload.error?.message || "unknown error"}`);
  }
  results.push({sitemap, status: response.status});
}
console.log(JSON.stringify({submitted: results.length, site, results}, null, 2));
