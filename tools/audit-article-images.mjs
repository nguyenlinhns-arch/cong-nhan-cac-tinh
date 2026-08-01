import fs from "node:fs";
import path from "node:path";
import {curatedArticles, existingNews} from "./curated-articles.mjs";
import {communityArticles} from "./community-articles.mjs";
import {pressStoryArticles} from "./press-story-articles.mjs";
import {articleInlineImages} from "./article-inline-images.mjs";

const articles = [
  ...curatedArticles,
  ...existingNews,
  ...communityArticles,
  ...pressStoryArticles,
];
const siteBase = "https://thaylinhtuyenthomo.vn";
const siteRoot = path.resolve("tuyen-tho-mo");

const imageUses = [];
for (const article of articles) {
  imageUses.push({
    slug: article.slug,
    role: "cover",
    url: article.image,
    referrerPolicy: article.imageReferrerPolicy,
  });
  for (const [index, media] of (article.inlineMedia || articleInlineImages[article.slug] || []).entries()) {
    imageUses.push({
      slug: article.slug,
      role: `inline-${index + 1}`,
      url: media.src,
      referrerPolicy: media.referrerPolicy,
    });
  }
}

const errors = [];
const usesByUrl = new Map();
for (const use of imageUses) {
  if (!/^https:\/\//i.test(use.url || "")) {
    errors.push(`${use.slug} ${use.role}: image URL must use HTTPS`);
    continue;
  }
  const uses = usesByUrl.get(use.url) || [];
  uses.push(use);
  usesByUrl.set(use.url, uses);
}

for (const [url, uses] of usesByUrl) {
  const slugs = new Set(uses.map((use) => use.slug));
  if (slugs.size > 1) {
    errors.push(`Image repeated across articles (${[...slugs].join(", ")}): ${url}`);
  }
  if (uses.length > slugs.size) {
    errors.push(`Image repeated within ${uses[0].slug}: ${url}`);
  }
}

const uniqueUrls = [...usesByUrl.keys()];
const results = [];

async function checkImage(use) {
  if (use.url.startsWith(`${siteBase}/`)) {
    const pathname = decodeURIComponent(new URL(use.url).pathname).replace(/^\/+/, "");
    const localPath = path.resolve(siteRoot, pathname);
    const extension = path.extname(localPath).toLowerCase();
    const contentTypes = {
      ".avif": "image/avif",
      ".gif": "image/gif",
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
    };
    const insideSite = localPath === siteRoot || localPath.startsWith(`${siteRoot}${path.sep}`);
    const exists = insideSite && fs.existsSync(localPath);
    return {
      url: use.url,
      status: exists ? 200 : 404,
      contentType: exists ? (contentTypes[extension] || "application/octet-stream") : "",
    };
  }
  const headers = {
    "user-agent": "Mozilla/5.0 (compatible; ThayLinhArticleImageAudit/1.0)",
    accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  };
  if (use.referrerPolicy && use.referrerPolicy !== "no-referrer") {
    headers.referer = "https://thaylinhtuyenthomo.vn/";
  }
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(use.url, {
        redirect: "follow",
        headers,
        signal: AbortSignal.timeout(25_000),
      });
      const contentType = response.headers.get("content-type") || "";
      await response.body?.cancel();
      if (response.status === 200 || attempt === 2 || response.status < 500) {
        return {url: use.url, status: response.status, contentType};
      }
    } catch (error) {
      if (attempt === 2) return {url: use.url, status: "ERROR", contentType: "", error: error.message};
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  return {url: use.url, status: "ERROR", contentType: "", error: "Unknown image audit error"};
}

const urlsByOrigin = new Map();
for (const url of uniqueUrls) {
  const origin = new URL(url).origin;
  const urls = urlsByOrigin.get(origin) || [];
  urls.push(url);
  urlsByOrigin.set(origin, urls);
}

async function auditOrigin(urls) {
  for (const url of urls) {
    results.push(await checkImage(usesByUrl.get(url)[0]));
  }
}

await Promise.all([...urlsByOrigin.values()].map(auditOrigin));
results.sort((left, right) => uniqueUrls.indexOf(left.url) - uniqueUrls.indexOf(right.url));

for (const result of results) {
  if (result.status !== 200 || !/^image\//i.test(result.contentType)) {
    errors.push(`${result.status} ${result.contentType || "no content type"}: ${result.url}${result.error ? ` (${result.error})` : ""}`);
  }
}

console.log(JSON.stringify({
  articles: articles.length,
  imageUses: imageUses.length,
  uniqueImages: uniqueUrls.length,
  inlineImages: imageUses.filter((use) => use.role !== "cover").length,
  articlesWithInlineImages: new Set(imageUses.filter((use) => use.role !== "cover").map((use) => use.slug)).size,
  reachableImages: results.filter((result) => result.status === 200 && /^image\//i.test(result.contentType)).length,
  errors: errors.length,
  sampleErrors: errors.slice(0, 20),
}, null, 2));

if (process.argv.includes("--check") && errors.length) process.exitCode = 1;
