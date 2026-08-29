import {dailyCommunityArticles20260810} from "./daily-community-articles-20260810.mjs";
import {dailyCommunitySourceImages20260810 as imageReceipts} from "./daily-community-source-images-20260810.mjs";
import {extractSourceImage} from "./audit-source-images.mjs";

const errors = [];
const results = [];

for (const article of dailyCommunityArticles20260810) {
  const sourceUrl = article.sources?.[0]?.url;
  try {
    const response = await fetch(sourceUrl, {
      headers: {"user-agent": "Mozilla/5.0 (compatible; ThayLinhDailyImageValidator/1.0)"},
      redirect: "follow",
      signal: AbortSignal.timeout(45_000),
    });
    const html = await response.text();
    const extracted = extractSourceImage(html);
    const imageResponse = extracted ? await fetch(extracted, {
      headers: {range: "bytes=0-0", referer: sourceUrl},
      redirect: "follow",
      signal: AbortSignal.timeout(45_000),
    }) : null;
    if (imageResponse?.body) await imageResponse.body.cancel();
    const liveMatched = response.status === 200
      && extracted === article.image
      && [200, 206].includes(imageResponse?.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    const receipt = imageReceipts[article.slug];
    const archivedMatched = !extracted
      && receipt?.allowArchivedSourceImage === true
      && receipt.sourceUrl === sourceUrl
      && receipt.image === article.image
      && /^\d{4}-\d{2}-\d{2}T/.test(receipt.verifiedAt || "")
      && Number.isInteger(receipt.verifiedWidth)
      && Number.isInteger(receipt.verifiedHeight)
      && (/(?:One moment, please|Imunify360|bot-protection)/i.test(html)
        || response.status >= 500);
    const matched = liveMatched || archivedMatched;

    results.push({
      slug: article.slug,
      sourceStatus: response.status,
      imageStatus: imageResponse?.status || 0,
      extracted,
      expected: article.image,
      verification: liveMatched ? "LIVE_SOURCE" : archivedMatched ? "PINNED_SOURCE_RECEIPT" : "FAILED",
      matched,
    });
    if (!matched) errors.push(`${article.slug}: ảnh đầu bài không khớp trực tiếp với URL nguồn`);
  } catch (error) {
    const receipt = imageReceipts[article.slug];
    const archivedMatched = receipt?.allowArchivedSourceImage === true
      && receipt.sourceUrl === sourceUrl
      && receipt.image === article.image
      && /^https:\/\/caodangtkv\.edu\.vn\/wp-content\/uploads\//.test(article.image)
      && /^\d{4}-\d{2}-\d{2}T/.test(receipt.verifiedAt || "")
      && Number.isInteger(receipt.verifiedWidth)
      && Number.isInteger(receipt.verifiedHeight);
    results.push({
      slug: article.slug,
      expected: article.image,
      verification: archivedMatched ? "PINNED_SOURCE_RECEIPT" : "FAILED",
      matched: archivedMatched,
      error: error.message,
    });
    if (!archivedMatched) errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}

console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
}
