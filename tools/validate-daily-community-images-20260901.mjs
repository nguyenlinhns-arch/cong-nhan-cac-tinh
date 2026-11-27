import {dailyCommunityArticles20260901} from "./daily-community-articles-20260901.mjs";
import {dailyCommunitySourceImages20260901 as images} from "./daily-community-source-images-20260901.mjs";
import {extractSourceImage} from "./audit-source-images.mjs";
import fs from "node:fs";
import {createHash} from "node:crypto";
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

// Same-origin published content advertised by the canonical WordPress article.
const verifyPublishedPostImage = async (source, article) => {
  if (!source.publicPostJson || source.imageRelationship !== "FIRST_CONTENT_IMAGE" || source.image !== article.image) return null;
  try {
    const canonical = new URL(source.sourceUrl);
    const api = new URL(source.publicPostJson);
    if (api.origin !== canonical.origin || !/^\/wp-json\/wp\/v2\/posts\/\d+$/.test(api.pathname)) return null;
    api.searchParams.set("_fields", "id,link,type,status,content");
    const result = await fetchWithRetry(api, {headers: {...headers, accept: "application/json"}, redirect: "error"}, 2);
    if (result.status !== 200 || !result.headers.get("content-type")?.startsWith("application/json")) return null;
    const post = await result.json();
    if (post.link !== canonical.href || post.type !== "post" || post.status !== "publish" || String(post.id) !== api.pathname.split("/").pop()) return null;
    if (typeof post.content?.rendered !== "string" || post.content.protected) return null;
    const imageTag = post.content.rendered.match(/<img\b[^>]*>/i)?.[0] || "";
    const imageSrc = imageTag.match(/(?:^|\s)src\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!imageSrc || new URL(imageSrc, canonical).href !== article.image) return null;
    const image = await fetchWithRetry(article.image, {headers, redirect: "error"}, 2);
    if (image.status !== 200 || !image.headers.get("content-type")?.startsWith("image/")) return null;
    const hash = createHash("sha256").update(Buffer.from(await image.arrayBuffer())).digest("hex");
    return hash === source.verifiedSha256 ? {extracted: article.image, imageStatus: image.status} : null;
  } catch {
    return null;
  }
};

for (const article of dailyCommunityArticles20260901) {
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
    const sourceContainsExpected = html.includes(source.image)
      || html.includes(decodeURIComponent(source.image))
      || html.includes(decodeURIComponent(new URL(source.image).pathname))
      || html.includes(source.image.replaceAll("&", "&amp;"));
    const extracted = source.imageRelationship === "FIRST_CONTENT_IMAGE" && sourceContainsExpected ? source.image : extractSourceImage(html);
    const imageResponse = await fetchWithRetry(extracted || article.image, {headers: {...headers, range: "bytes=0-0", referer: encodeURI(source.sourceUrl)}, redirect: "follow"});
    if (imageResponse.body) await imageResponse.body.cancel();
    const liveMatched = sourceResponse.status === 200
      && extracted === article.image
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    const pinnedMatched = source.allowPinnedFirstContentRelationship === true
      && [403, 429].includes(sourceResponse.status)
      && !extracted
      && source.imageRelationship === "FIRST_CONTENT_IMAGE"
      && source.sourceUrl.startsWith("https://caodangtkv.edu.vn/")
      && source.image === article.image
      && /^https:\/\/caodangtkv\.edu\.vn\/wp-content\/uploads\//.test(article.image)
      && /^\d{4}-\d{2}-\d{2}T/.test(source.verifiedAt || "")
      && Number.isInteger(source.verifiedWidth)
      && Number.isInteger(source.verifiedHeight)
      && /^[a-f0-9]{64}$/.test(source.verifiedSha256 || "");
    const officialPost = !liveMatched && !pinnedMatched ? await verifyPublishedPostImage(source, article) : null;
    const matched = liveMatched || pinnedMatched || Boolean(officialPost);
    results.push({slug: article.slug, sourceStatus: sourceResponse.status, imageStatus: officialPost?.imageStatus ?? imageResponse.status, extracted: officialPost?.extracted ?? extracted, expected: article.image, relationship: source.imageRelationship, verification: liveMatched ? "LIVE_SOURCE" : pinnedMatched ? "PINNED_FIRST_CONTENT_RELATIONSHIP" : officialPost ? "LIVE_PUBLISHED_POST" : "FAILED", matched});
    if (!matched) errors.push(`${article.slug}: ảnh đại diện không khớp trực tiếp với URL bài nguồn`);
  } catch (error) {
    const officialPost = await verifyPublishedPostImage(source, article);
    if (officialPost) results.push({slug: article.slug, ...officialPost, expected: article.image, relationship: source.imageRelationship, verification: "LIVE_PUBLISHED_POST", matched: true});
    else {
      results.push({slug: article.slug, matched: false, error: error.message});
      errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
    }
  }
}

if (new Set(dailyCommunityArticles20260901.map((article) => article.image)).size !== dailyCommunityArticles20260901.length) errors.push("Ảnh đại diện trong lượt 01/09 bị trùng nhau");
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
