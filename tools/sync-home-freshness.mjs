import fs from "node:fs";
import path from "node:path";
import {dailyCommunityArticles} from "./daily-community-articles-all.mjs";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const homepagePath = path.join(site, "index.html");
const dailyFeedPath = path.join(site, "daily-seo-articles.json");
const dailyHubPath = path.join(site, "giai-dap-nghe-mo", "index.html");
const sitemapPath = path.join(site, "sitemap.xml");
const recruitmentPath = path.join(site, "recruitment-current.json");
const canonicalFactsPath = path.join(site, "data", "recruitment-facts-2026.json");
const fieldReportsPath = path.join(root, "content", "editorial-field-reports-v8.json");
const reviewPath = path.join(root, "content", "recruitment-review-v10.json");
const bangkokToday = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
const maxDate = (values) => values.filter(validDate).sort().at(-1) || "";

const releasedCommunity = dailyCommunityArticles
  .filter((article) => String(article.published || "").slice(0, 10) <= bangkokToday)
  .sort((a, b) => new Date(b.updated || b.published) - new Date(a.updated || a.published));
if (!releasedCommunity.length) throw new Error("sync-home-freshness: không tìm thấy bài ngành Than đã phát hành");
const communityDate = String(releasedCommunity[0].updated || releasedCommunity[0].published).slice(0, 10);

if (!fs.existsSync(dailyFeedPath)) throw new Error("sync-home-freshness: thiếu daily-seo-articles.json sau bước build");
const dailyFeed = JSON.parse(fs.readFileSync(dailyFeedPath, "utf8"));
const dailyDate = maxDate((dailyFeed.articles || []).map((article) => article.date_published));
if (!dailyDate) throw new Error("sync-home-freshness: registry giải đáp đã phát hành không có ngày hợp lệ");

if (!fs.existsSync(recruitmentPath)) throw new Error("sync-home-freshness: thiếu recruitment-current.json");
const recruitment = JSON.parse(fs.readFileSync(recruitmentPath, "utf8"));
const recruitmentDate = validDate(recruitment.updated_at) ? recruitment.updated_at : "";

if (!fs.existsSync(canonicalFactsPath)) throw new Error("sync-home-freshness: thiếu recruitment-facts-2026.json");
const canonicalFacts = JSON.parse(fs.readFileSync(canonicalFactsPath, "utf8"));
if (!Number.isInteger(Number(canonicalFacts.version)) || Number(canonicalFacts.version) < 8) {
  throw new Error(`sync-home-freshness: canonical facts version không hợp lệ: ${canonicalFacts.version}`);
}
if (recruitment.canonical_facts !== "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json") {
  throw new Error("sync-home-freshness: recruitment-current chưa trỏ tới canonical facts public");
}

if (!fs.existsSync(fieldReportsPath)) throw new Error("sync-home-freshness: thiếu editorial-field-reports-v8.json");
const fieldReports = JSON.parse(fs.readFileSync(fieldReportsPath, "utf8"));
const fieldReportDate = maxDate(Object.values(fieldReports).map((report) => report?.dateModified));

if (!fs.existsSync(reviewPath)) throw new Error("sync-home-freshness: thiếu recruitment-review-v10.json");
const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
const recruitmentReviewDate = validDate(review.reviewed_at) ? review.reviewed_at : "";
const verificationModifiedDate = validDate(review.verification_content_modified) ? review.verification_content_modified : "";
if (!recruitmentReviewDate) throw new Error("sync-home-freshness: reviewed_at tuyển sinh không hợp lệ");
if (!verificationModifiedDate) throw new Error("sync-home-freshness: verification_content_modified không hợp lệ");
if (review.canonical_facts_version !== canonicalFacts.version) throw new Error("sync-home-freshness: review facts version không khớp canonical facts");
if (review.canonical_facts_confirmed_at !== canonicalFacts.confirmed_at) throw new Error("sync-home-freshness: review facts timestamp không khớp canonical facts");

// dateModified follows content that is actually surfaced on the homepage.
// lastReviewed follows the most recent verification pass. This prevents a pure
// re-check from pretending that the reader-facing homepage content was edited.
const homepageModifiedDate = maxDate([communityDate, dailyDate, verificationModifiedDate, fieldReportDate]);
const homepageReviewDate = maxDate([homepageModifiedDate, recruitmentReviewDate]);
if (!homepageModifiedDate || !homepageReviewDate) throw new Error("sync-home-freshness: không xác định được độ mới trang chủ");

let html = fs.readFileSync(homepagePath, "utf8");
const freshnessPattern = /"dateModified":"\d{4}-\d{2}-\d{2}","lastReviewed":"\d{4}-\d{2}-\d{2}"/;
if (!freshnessPattern.test(html)) throw new Error("sync-home-freshness: không tìm thấy cặp dateModified/lastReviewed trong schema trang chủ");
html = html.replace(freshnessPattern, `"dateModified":"${homepageModifiedDate}","lastReviewed":"${homepageReviewDate}"`);
fs.writeFileSync(homepagePath, html);

// The daily-answer hub and machine feed must describe the newest published
// answer and explicitly declare the facts version used to normalize policy copy.
dailyFeed.updated_at = dailyDate;
dailyFeed.canonical_facts_version = canonicalFacts.version;
dailyFeed.canonical_facts_confirmed_at = canonicalFacts.confirmed_at;
dailyFeed.canonical_facts_url = "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json";
fs.writeFileSync(dailyFeedPath, `${JSON.stringify(dailyFeed, null, 2)}\n`);

let dailyHub = fs.readFileSync(dailyHubPath, "utf8");
const hubModifiedPattern = /"dateModified":"\d{4}-\d{2}-\d{2}"/;
if (!hubModifiedPattern.test(dailyHub)) throw new Error("sync-home-freshness: hub giải đáp thiếu dateModified");
dailyHub = dailyHub.replace(hubModifiedPattern, `"dateModified":"${dailyDate}"`);
fs.writeFileSync(dailyHubPath, dailyHub);

let sitemap = fs.readFileSync(sitemapPath, "utf8");
const homepageSitemapPattern = /(<loc>https:\/\/thaylinhtuyenthomo\.vn\/<\/loc><lastmod>)\d{4}-\d{2}-\d{2}(?:T[^<]+)?(<\/lastmod>)/;
if (!homepageSitemapPattern.test(sitemap)) throw new Error("sync-home-freshness: sitemap thiếu lastmod của trang chủ");
sitemap = sitemap.replace(homepageSitemapPattern, `$1${homepageModifiedDate}$2`);
const dailyHubSitemapPattern = /(<loc>https:\/\/thaylinhtuyenthomo\.vn\/giai-dap-nghe-mo\/<\/loc><lastmod>)\d{4}-\d{2}-\d{2}(<\/lastmod>)/;
if (!dailyHubSitemapPattern.test(sitemap)) throw new Error("sync-home-freshness: sitemap thiếu lastmod của hub giải đáp");
sitemap = sitemap.replace(dailyHubSitemapPattern, `$1${dailyDate}$2`);
fs.writeFileSync(sitemapPath, sitemap);

console.log(JSON.stringify({
  status: "site-freshness-synced",
  canonicalFactsVersion: canonicalFacts.version,
  homepageModifiedDate,
  homepageReviewDate,
  homepageSitemapLastmod: homepageModifiedDate,
  communityDate,
  dailyAnswerDate: dailyDate,
  recruitmentDate: recruitmentDate || null,
  recruitmentReviewDate,
  verificationModifiedDate,
  fieldReportDate: fieldReportDate || null,
  dailySource: dailyFeed.articles?.[0]?.canonical_url || null,
}, null, 2));
