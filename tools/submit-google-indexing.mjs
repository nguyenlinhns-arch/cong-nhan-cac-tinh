import fs from "node:fs";
import { getGoogleAccessToken } from "./google-service-account-auth.mjs";

const feed = JSON.parse(fs.readFileSync("tuyen-tho-mo/jobs.json", "utf8"));
const urls = (feed.jobs || []).filter(job => job.status === "open").map(job => job.url);
if (!urls.length) throw new Error("No open JobPosting URLs found in jobs.json");

const token = await getGoogleAccessToken("https://www.googleapis.com/auth/indexing");
const results = [];
for (const url of urls) {
  const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  const payload = await response.json().catch(() => ({}));
  results.push({ url, status: response.status, ok: response.ok });
  if (!response.ok) throw new Error(`Indexing API rejected ${url} (${response.status}): ${payload.error?.message || "unknown error"}`);
}

console.log(JSON.stringify({ submitted: results.length, results }, null, 2));
