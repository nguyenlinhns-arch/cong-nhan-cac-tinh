import fs from "node:fs";
import path from "node:path";
import {dailyCommunityArticles} from "./daily-community-articles-all.mjs";

const root = path.resolve(import.meta.dirname, "..");
const homepagePath = path.join(root, "tuyen-tho-mo", "index.html");
const bangkokToday = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const released = dailyCommunityArticles
  .filter((article) => String(article.published || "").slice(0, 10) <= bangkokToday)
  .sort((a, b) => new Date(b.updated || b.published) - new Date(a.updated || a.published));

if (!released.length) throw new Error("sync-home-freshness: không tìm thấy bài đã phát hành để xác định độ mới trang chủ");
const latestDate = String(released[0].updated || released[0].published).slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(latestDate)) throw new Error(`sync-home-freshness: ngày không hợp lệ ${latestDate}`);

let html = fs.readFileSync(homepagePath, "utf8");
const freshnessPattern = /"dateModified":"\d{4}-\d{2}-\d{2}","lastReviewed":"\d{4}-\d{2}-\d{2}"/;
const match = html.match(freshnessPattern);
if (!match) throw new Error("sync-home-freshness: không tìm thấy cặp dateModified/lastReviewed trong schema trang chủ");

const replacement = `"dateModified":"${latestDate}","lastReviewed":"${latestDate}"`;
html = html.replace(freshnessPattern, replacement);
fs.writeFileSync(homepagePath, html);

console.log(JSON.stringify({
  status: "home-freshness-synced",
  latestDate,
  source: released[0].urlPath || released[0].slug || released[0].title,
}, null, 2));
