import {dailyCommunityArticles20260812} from "./daily-community-articles-20260812.mjs";
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
    const imageResponse = extracted ? await fetch(extracted, {headers: {referer: sourceUrl}, redirect: "follow"}) : null;
    if (imageResponse) await imageResponse.arrayBuffer();
    const matched = response.status === 200
      && extracted === article.image
      && articleImages[0] === article.image
      && imageResponse?.status === 200
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    results.push({slug: article.slug, sourceStatus: response.status, imageStatus: imageResponse?.status || 0, firstArticleImage: articleImages[0] || "", extracted, expected: article.image, matched});
    if (!matched) errors.push(`${article.slug}: ảnh đầu bài không khớp trực tiếp với URL nguồn`);
  } catch (error) {
    results.push({slug: article.slug, matched: false, error: error.message});
    errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
