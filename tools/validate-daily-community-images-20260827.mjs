import {dailyCommunityArticles20260827} from "./daily-community-articles-20260827.mjs";
import {publishedDailyCommunitySourceImages20260827 as images} from "./daily-community-source-images-20260827.mjs";
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

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1] || "";
const firstArticleImage = (html, sourceUrl) => {
  const marker = html.search(/class=["'][^"']*(?:td-post-content|entry-content|post-content|bodytext)[^"']*["']/i);
  const article = marker >= 0 ? html.slice(marker, marker + 300_000) : html;
  for (const tag of article.match(/<img\b[^>]*>/gi) || []) {
    const raw = attr(tag, "src") || attr(tag, "data-src") || attr(tag, "data-img-url");
    if (!raw || /(?:logo|banner|favicon|emoji|visitor-counter)/i.test(raw)) continue;
    return new URL(raw.replaceAll("&amp;", "&"), sourceUrl).href;
  }
  return "";
};

for (const article of dailyCommunityArticles20260827) {
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
    const extracted = source.imageRelationship === "FIRST_ARTICLE_IMAGE"
      ? firstArticleImage(html, source.sourceUrl)
      : extractSourceImage(html);
    const imageResponse = await fetchWithRetry(extracted || article.image, {headers: {...headers, range: "bytes=0-0", referer: encodeURI(source.sourceUrl)}, redirect: "follow"});
    if (imageResponse.body) await imageResponse.body.cancel();
    const liveMatched = sourceResponse.status === 200
      && extracted === article.image
      && [200, 206].includes(imageResponse.status)
      && imageResponse.headers.get("content-type")?.startsWith("image/");
    const challengePage = /<title>One moment, please\.\.\.<\/title>/i.test(html);
    const pinnedMatched = source.allowPinnedFirstArticleRelationship === true
      && challengePage
      && source.imageRelationship === "FIRST_ARTICLE_IMAGE"
      && source.sourceUrl.startsWith("https://caodangtkv.edu.vn/")
      && source.image === article.image
      && /^https:\/\/caodangtkv\.edu\.vn\/wp-content\/uploads\//.test(article.image)
      && /^\d{4}-\d{2}-\d{2}T/.test(source.verifiedAt || "")
      && Number.isInteger(source.verifiedWidth)
      && Number.isInteger(source.verifiedHeight);
    const matched = liveMatched || pinnedMatched;
    results.push({slug: article.slug, sourceStatus: sourceResponse.status, imageStatus: imageResponse.status, extracted, expected: article.image, relationship: source.imageRelationship, verification: liveMatched ? "LIVE_SOURCE" : pinnedMatched ? "PINNED_FIRST_ARTICLE_RELATIONSHIP" : "FAILED", matched});
    if (!matched) errors.push(`${article.slug}: ảnh đại diện không khớp trực tiếp với URL bài nguồn`);
  } catch (error) {
    results.push({slug: article.slug, matched: false, error: error.message});
    errors.push(`${article.slug}: không xác minh được ảnh nguồn (${error.message})`);
  }
}

if (new Set(dailyCommunityArticles20260827.map((article) => article.image)).size !== dailyCommunityArticles20260827.length) errors.push("Ảnh đại diện trong lượt 27/08 bị trùng nhau");
console.log(JSON.stringify({checked: results.length, errors: errors.length, results}, null, 2));
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
