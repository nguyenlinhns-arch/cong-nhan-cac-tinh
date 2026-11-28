import {dailyCommunityArticles20260830} from "./daily-community-articles-20260830.mjs";
import {dailyCommunitySourceImages20260830 as images} from "./daily-community-source-images-20260830.mjs";
import {extractSourceImage} from "./audit-source-images.mjs";
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";

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
    let sourceStatus = 0;
    let extracted = "";
    let sampledMetadata = false;
    // The CDN sometimes returns a cached 200 page without its original metadata.
    // Retry the same official URL with a cache-busting query, not a replacement source.
    for (const target of [source.sourceUrl, source.sourceUrl + "?source_image_verify=1"]) {
      const sourceResponse = await fetchWithRetry(target, {headers:{...headers, accept:"text/html"}, redirect:"follow"}, 2);
      const html = await sourceResponse.text();
      if (sourceResponse.status === 200) {
        sourceStatus = 200;
        const found = extractSourceImage(html);
        if (found) { sampledMetadata = true; extracted = found; break; }
      } else if (!sourceStatus) sourceStatus = sourceResponse.status;
    }
    const pinnedRelationship = source.allowPinnedOpenGraphRelationship === true
      && sourceStatus === 200
      && !sampledMetadata
      && source.imageRelationship === "OPEN_GRAPH"
      && source.sourceUrl.startsWith("https://www.thanthongnhat.vn/")
      && source.image === article.image
      && /^https:\/\/www\.thanthongnhat\.vn\/uploads\/news\//.test(article.image)
      && /^\d{4}-\d{2}-\d{2}T/.test(source.verifiedAt || "")
      && Number.isInteger(source.verifiedWidth)
      && Number.isInteger(source.verifiedHeight)
      && /^[a-f0-9]{64}$/.test(source.verifiedSha256 || "");
    let imageStatus = 0;
    let verifiedImageBytes = false;
    if ((sourceStatus === 200 && extracted === article.image) || pinnedRelationship) {
      for (const target of [article.image, article.image + "?source_image_verify=1"]) {
        const image = await fetchWithRetry(target, {headers:{...headers, accept:"image/jpeg,image/*;q=0.9,*/*;q=0.1", referer:encodeURI(source.sourceUrl)}, redirect:"follow"}, 2);
        imageStatus = image.status;
        if (!image.ok) { await image.body?.cancel(); continue; }
        // Some cache edges report the wrong content type. Exact official JPEG bytes
        // (not just an HTTP 200 or an octet-stream header) are the release gate.
        const bytes = Buffer.from(await image.arrayBuffer());
        if (bytes.subarray(0,3).equals(Buffer.from([0xff,0xd8,0xff]))
          && createHash("sha256").update(bytes).digest("hex") === source.verifiedSha256) {
          verifiedImageBytes = true;
          break;
        }
      }
    }
    const liveMatched = sourceStatus === 200 && extracted === article.image && verifiedImageBytes;
    const pinnedMatched = pinnedRelationship && verifiedImageBytes;
    const matched = liveMatched || pinnedMatched;
    results.push({slug: article.slug, sourceStatus, imageStatus, extracted, expected: article.image, relationship: source.imageRelationship, verification: liveMatched ? "LIVE_SOURCE_AND_VERIFIED_IMAGE" : pinnedMatched ? "PINNED_OPEN_GRAPH_AND_VERIFIED_IMAGE" : "FAILED", matched});
    if (!matched) errors.push(`${article.slug}: ảnh đại diện không khớp trực tiếp với URL bài nguồn`);
  } catch (error) {
    results.push({slug: article.slug, matched: false, error: error.message});
    errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}

if (new Set(dailyCommunityArticles20260830.map((article) => article.image)).size !== dailyCommunityArticles20260830.length) errors.push("Ảnh đại diện trong lượt 30/08 bị trùng nhau");
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
