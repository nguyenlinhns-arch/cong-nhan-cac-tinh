import {dailyCommunityArticles20260812} from "./daily-community-articles-20260812.mjs";
import {dailyCommunitySourceImages20260812 as imageReceipts} from "./daily-community-source-images-20260812.mjs";
import {extractSourceImage} from "./audit-source-images.mjs";

const errors = [];
const results = [];
for (const article of dailyCommunityArticles20260812) {
  const sourceUrl = article.sources?.[0]?.url;
  try {
    const response = await fetch(sourceUrl, {headers: {"user-agent": "Mozilla/5.0 (compatible; ThayLinhDailyImageValidator/1.0)"}, redirect: "follow"});
    const html = await response.text();
    const extracted = extractSourceImage(html);
    const articleImages = [...html.matchAll(/<img[^>]+src=["']([^"']+)/gi)]
      .map((match) => new URL(match[1], sourceUrl).href)
      .filter((url) => url.includes("/uploads/news/"));
    const receipt = imageReceipts[article.slug];
    const imageResponse = await fetch(extracted || article.image, {
      headers: {range: "bytes=0-0", referer: sourceUrl},
      redirect: "follow",
      signal: AbortSignal.timeout(45_000),
    });
    if (imageResponse.body) await imageResponse.body.cancel();
    const liveMatched = response.status === 200
      && extracted === article.image
      && articleImages[0] === article.image
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    const archivedMatched = !extracted
      && [403, 429, 520].includes(response.status)
      && receipt?.allowArchivedSourceImage === true
      && receipt.sourceUrl === sourceUrl
      && receipt.image === article.image
      && /^\d{4}-\d{2}-\d{2}T/.test(receipt.verifiedAt || "")
      && Number.isInteger(receipt.verifiedWidth)
      && Number.isInteger(receipt.verifiedHeight)
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    const matched = liveMatched || archivedMatched;
    results.push({
      slug: article.slug,
      sourceStatus: response.status,
      imageStatus: imageResponse.status,
      firstArticleImage: articleImages[0] || "",
      extracted,
      expected: article.image,
      verification: liveMatched ? "LIVE_SOURCE" : archivedMatched ? "PINNED_SOURCE_RECEIPT_AND_LIVE_IMAGE" : "FAILED",
      matched,
    });
    if (!matched) errors.push(`${article.slug}: ảnh đầu bài không khớp trực tiếp với URL nguồn`);
  } catch (error) {
    results.push({slug: article.slug, matched: false, error: error.message});
    errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
