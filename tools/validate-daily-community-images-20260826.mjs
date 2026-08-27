import {dailyCommunityArticles20260826} from "./daily-community-articles-20260826.mjs";
import {dailyCommunitySourceImages20260826 as images} from "./daily-community-source-images-20260826.mjs";
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

for (const article of dailyCommunityArticles20260826) {
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
    let extracted = extractSourceImage(html);
    let relationship = "OPEN_GRAPH";

    if (source.sourcePostId && source.sourceMediaId) {
      const postResponse = await fetchWithRetry(`https://caodangtkv.edu.vn/wp-json/wp/v2/posts/${source.sourcePostId}?_fields=id,featured_media,link,title`, {headers, redirect: "follow"});
      const post = await postResponse.json();
      const mediaResponse = await fetchWithRetry(`https://caodangtkv.edu.vn/wp-json/wp/v2/media/${source.sourceMediaId}?_fields=id,source_url,media_details`, {headers, redirect: "follow"});
      const media = await mediaResponse.json();
      extracted = media.source_url || "";
      relationship = "WORDPRESS_FEATURED_MEDIA";
      if (post.id !== source.sourcePostId || post.featured_media !== source.sourceMediaId || post.link !== source.sourceUrl || media.id !== source.sourceMediaId) {
        errors.push(`${article.slug}: quan hệ bài nguồn và ảnh đại diện WordPress không khớp`);
      }
    }

    const imageResponse = await fetchWithRetry(extracted || article.image, {headers: {...headers, range: "bytes=0-0", referer: encodeURI(source.sourceUrl)}, redirect: "follow"});
    if (imageResponse.body) await imageResponse.body.cancel();
    const matched = sourceResponse.status === 200
      && extracted === article.image
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    results.push({slug: article.slug, sourceStatus: sourceResponse.status, imageStatus: imageResponse.status, extracted, expected: article.image, relationship, matched});
    if (!matched) errors.push(`${article.slug}: ảnh đại diện không khớp trực tiếp với URL bài nguồn`);
  } catch (error) {
    const pinnedMatched = source.allowPinnedWordPressRelationship === true
      && Number.isInteger(source.sourcePostId)
      && Number.isInteger(source.sourceMediaId)
      && source.sourceUrl.startsWith("https://caodangtkv.edu.vn/")
      && source.image === article.image
      && /^\d{4}-\d{2}-\d{2}T/.test(source.verifiedAt || "")
      && Number.isInteger(source.verifiedWidth)
      && Number.isInteger(source.verifiedHeight);
    results.push({
      slug: article.slug,
      expected: article.image,
      verification: pinnedMatched ? "PINNED_WORDPRESS_RELATIONSHIP" : "FAILED",
      matched: pinnedMatched,
      error: error.message,
    });
    if (!pinnedMatched) errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}

if (new Set(dailyCommunityArticles20260826.map((article) => article.image)).size !== dailyCommunityArticles20260826.length) errors.push("Ảnh đại diện trong lượt 26/08 bị trùng nhau");
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
