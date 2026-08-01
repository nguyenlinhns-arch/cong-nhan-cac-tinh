import { getGoogleAccessToken } from "./google-service-account-auth.mjs";

const site = process.env.GOOGLE_SEARCH_CONSOLE_SITE || "https://thaylinhtuyenthomo.vn/";
const sitemap = process.env.GOOGLE_SITEMAP_URL || "https://thaylinhtuyenthomo.vn/sitemap.xml";
const token = await getGoogleAccessToken("https://www.googleapis.com/auth/webmasters");
const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(sitemap)}`;
const response = await fetch(endpoint, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
if (!response.ok) {
  const payload = await response.json().catch(() => ({}));
  throw new Error(`Search Console sitemap submission failed (${response.status}): ${payload.error?.message || "unknown error"}`);
}
console.log(JSON.stringify({ submitted: true, site, sitemap, status: response.status }));
