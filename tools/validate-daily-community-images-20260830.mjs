import {dailyCommunityArticles20260830} from "./daily-community-articles-20260830.mjs";
import {dailyCommunitySourceImages20260830 as images} from "./daily-community-source-images-20260830.mjs";
import {extractSourceImage} from "./audit-source-images.mjs";
import fs from "node:fs";
import path from "node:path";

const errors = [];
const results = [];
const headers = {"user-agent": "Mozilla/5.0 (compatible; ThayLinhDailyImageValidator/1.0)"};

const fetchWithRetry = async (url, options = {}, attempts = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {...options, signal: AbortSignal.timeout(60_000)});
      if (response.status < 500 || attempt === attempts) return response;
      if (response.body) await response.body.cancel();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
  }
  throw lastError;
};

for (const article of dailyCommunityArticles20260830) {
  const source = images[article.slug];
  const articleFile = path.resolve("tuyen-tho-mo", article.urlPath, "index.html");
  const articleHtml = fs.existsSync(articleFile) ? fs.readFileSync(articleFile, "utf8") : "";
  if (!articleHtml.includes('"@type":"FAQPage"') || !articleHtml.includes("<h2>Câu hỏi thường gặp</h2>")) errors.push(`${article.slug}: thiếu FAQ hiển thị hoặc FAQPage schema`);
  if (!/<p class="article-source-note">[\s\S]*?<\/p>/i.test(articleHtml)) errors.push(`${article.slug}: thiếu dòng trích nguồn bằng chữ`);
  if (!articleHtml.includes('<script src="/analytics.js?v=6" defer></script>')) errors.push(`${article.slug}: thiếu bộ tải GA4 và Meta Pixel`);
  if (articleHtml.includes(`href="${source.sourceUrl}"`) || /"(?:citation|isBasedOn)"/.test(articleHtml)) errors.push(`${article.slug}: còn liên kết hoặc schema URL nguồn công khai`);

  try {
    const sourceResponse = await fetchWithRetry(source.sourceUrl, {headers, redirect: "follow"});
    const html = await sourceResponse.text();
    const extracted = extractSourceImage(html);
    const imageResponse = await fetchWithRetry(extracted || article.image, {headers: {...headers, range: "bytes=0-0", referer: encodeURI(source.sourceUrl)}, redirect: "follow"});
    if (imageResponse.body) await imageResponse.body.cancel();
    const liveMatched = sourceResponse.status === 200
      && extracted === article.image
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    const pinnedMatched = source.allowPinnedOpenGraphRelationship === true
      && sourceResponse.status === 200
      && !extracted
      && source.imageRelationship === "OPEN_GRAPH"
      && source.sourceUrl.startsWith("https://www.thanthongnhat.vn/")
      && source.image === article.image
      && /^https:\/\/www\.thanthongnhat\.vn\/uploads\/news\//.test(article.image)
      && /^\d{4}-\d{2}-\d{2}T/.test(source.verifiedAt || "")
      && Number.isInteger(source.verifiedWidth)
      && Number.isInteger(source.verifiedHeight)
      && /^[a-f0-9]{64}$/.test(source.verifiedSha256 || "")
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    const matched = liveMatched || pinnedMatched;
    results.push({slug: article.slug, sourceStatus: sourceResponse.status, imageStatus: imageResponse.status, extracted, expected: article.image, relationship: source.imageRelationship, verification: liveMatched ? "LIVE_SOURCE" : pinnedMatched ? "PINNED_OPEN_GRAPH_RELATIONSHIP_AND_LIVE_IMAGE" : "FAILED", matched});
    if (!matched) errors.push(`${article.slug}: ảnh đại diện không khớp trực tiếp với URL bài nguồn`);
  } catch (error) {
    results.push({slug: article.slug, matched: false, error: error.message});
    errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}

if (new Set(dailyCommunityArticles20260830.map((article) => article.image)).size !== dailyCommunityArticles20260830.length) errors.push("Ảnh đại diện trong lượt 30/08 bị trùng nhau");
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
