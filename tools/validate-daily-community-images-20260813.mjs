import {dailyCommunityArticles20260813} from "./daily-community-articles-20260813.mjs";
import {extractSourceImage} from "./audit-source-images.mjs";

const errors = [];
const results = [];
for (const article of dailyCommunityArticles20260813) {
  const sourceUrl = article.sources?.[0]?.url;
  try {
    const response = await fetch(sourceUrl, {headers: {"user-agent": "Mozilla/5.0 (compatible; ThayLinhDailyImageValidator/1.0)"}, redirect: "follow", signal: AbortSignal.timeout(45_000)});
    const html = await response.text();
    const extracted = extractSourceImage(html);
    const imageResponse = await fetch(extracted || article.image, {headers: {range: "bytes=0-0", referer: encodeURI(sourceUrl)}, redirect: "follow", signal: AbortSignal.timeout(45_000)});
    if (imageResponse.body) await imageResponse.body.cancel();
    const matched = response.status === 200
      && extracted === article.image
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    results.push({slug: article.slug, sourceStatus: response.status, imageStatus: imageResponse.status, extracted, expected: article.image, verification: matched ? "LIVE_FEATURED_IMAGE" : "FAILED", matched});
    if (!matched) errors.push(`${article.slug}: ảnh đại diện không khớp trực tiếp với URL nguồn`);
  } catch (error) {
    results.push({slug: article.slug, matched: false, error: error.message});
    errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}
if (new Set(dailyCommunityArticles20260813.map((article) => article.image)).size !== dailyCommunityArticles20260813.length) errors.push("Ảnh đại diện trong lượt 13/08 bị trùng nhau");
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
