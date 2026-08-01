import {curatedArticles} from "./curated-articles.mjs";
import {communityArticles} from "./community-articles.mjs";
import {pressStoryArticles} from "./press-story-articles.mjs";

const scopes = {
  curated: curatedArticles,
  community: communityArticles,
  press: pressStoryArticles,
  all: [...curatedArticles, ...communityArticles, ...pressStoryArticles],
};
const selectedScope = process.env.INLINE_IMAGE_SCOPE || "all";
if (!scopes[selectedScope]) throw new Error(`Unknown INLINE_IMAGE_SCOPE: ${selectedScope}`);
const articleFilter = new RegExp(process.env.INLINE_IMAGE_FILTER || ".", "i");
const articles = scopes[selectedScope]
  .filter((article) => article.sources?.[0]?.url)
  .filter((article) => articleFilter.test(`${article.slug} ${article.sources[0].url}`));

const decodeHtml = (value = "") => value
  .replaceAll("&amp;", "&")
  .replaceAll("&#038;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#039;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");

const strip = (value = "") => decodeHtml(value)
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

function attr(tag, name) {
  return decodeHtml(tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(1).find(Boolean) || "");
}

function normalizeUrl(raw, sourceUrl) {
  if (!raw || /^(?:data:|blob:|javascript:)/i.test(raw)) return "";
  const candidate = decodeHtml(raw).replaceAll("\\/", "/").trim();
  try {
    const url = new URL(candidate.startsWith("//") ? `https:${candidate}` : candidate, sourceUrl);
    if (!/^https?:$/.test(url.protocol)) return "";
    return url.href;
  } catch {
    return "";
  }
}

function imageKey(url) {
  try {
    return decodeURIComponent(new URL(url).pathname)
      .toLowerCase()
      .replace(/-(?:\d{2,4}x\d{2,4}|scaled)(?=\.[a-z0-9]+$)/, "")
      .replace(/\.(?:avif|webp)$/, "");
  } catch {
    return url.toLowerCase();
  }
}

function scoreImage({url, alt, tag, context, hero}) {
  const haystack = `${url} ${alt} ${tag} ${context}`.toLowerCase();
  const likelyImageUrl = /\.(?:avif|gif|jpe?g|png|webp)(?:$|[?#])/i.test(url)
    || /(?:media\.vov\.vn|cdn-images\.vtv\.vn|image\.vietnamplus\.vn|cdnphoto\.dantri\.com\.vn)/i.test(url);
  if (!likelyImageUrl) return -100;
  if (/(?:logo|icon|avatar|emoji|sprite|banner|quang-cao|advert|tracking|pixel|placeholder|loading|default|favicon|social|zalo|facebook|youtube|tiktok)/i.test(haystack)) return -100;
  if (imageKey(url) === imageKey(hero)) return -100;
  const width = Number(attr(tag, "width"));
  const height = Number(attr(tag, "height"));
  if (width && height && (width < 300 || height < 180)) return -100;

  let score = 0;
  if (alt.length >= 12) score += 6;
  if (/\b(?:article|detail|content|entry|post|figure|photo|image|news)\b/i.test(context)) score += 5;
  if (/<figcaption|<figure/i.test(context)) score += 8;
  if (/(?:wp-content\/uploads|\/uploads\/news|\/data\/images\/news|\/userfiles\/|cdnphoto|static-images|media\.|cdn-images|\/files\/publish)/i.test(url)) score += 7;
  if (/(?:original|large|1920|1200|1024|scaled)/i.test(url)) score += 3;
  if (width >= 600 || height >= 400) score += 3;
  if (/(?:thumb|thumbnail|small|crop|resize)/i.test(url)) score -= 2;
  return score;
}

async function discover(article) {
  const source = article.sources[0];
  const response = await fetch(source.url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; ThayLinhEditorialAudit/1.0)",
      accept: "text/html,application/xhtml+xml",
      "accept-language": "vi-VN,vi;q=0.9,en;q=0.7",
    },
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const found = [];
  const tags = [...html.matchAll(/<img\b[^>]*>/gi)];

  for (const match of tags) {
    const tag = match[0];
    const rawSources = [
      attr(tag, "data-original"),
      attr(tag, "data-src"),
      attr(tag, "data-lazy-src"),
      attr(tag, "data-url"),
      attr(tag, "src"),
    ];
    const srcset = attr(tag, "data-srcset") || attr(tag, "srcset");
    if (srcset) rawSources.unshift(...srcset.split(",").map((item) => item.trim().split(/\s+/, 1)[0]).reverse());
    const url = rawSources.map((raw) => normalizeUrl(raw, source.url)).find(Boolean);
    if (!url) continue;
    const start = Math.max(0, match.index - 500);
    const end = Math.min(html.length, match.index + tag.length + 700);
    const context = html.slice(start, end);
    const alt = strip(attr(tag, "alt") || context.match(/<figcaption\b[^>]*>([\s\S]{0,500}?)<\/figcaption>/i)?.[1] || "");
    const score = scoreImage({url, alt, tag, context, hero: article.imageOriginal || article.image});
    if (score < 0) continue;
    found.push({url, alt, score, position: match.index});
  }

  const unique = [];
  const seen = new Set();
  for (const item of found.sort((a, b) => b.score - a.score)) {
    const key = imageKey(item.url);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique
    .filter((item) => item.score >= Number(process.env.INLINE_IMAGE_MIN_SCORE || 13))
    .slice(0, Number(process.env.INLINE_IMAGE_CANDIDATES || 5))
    .sort((a, b) => a.position - b.position)
    .map(({position, ...item}) => item);
}

const concurrency = 6;
let cursor = 0;
const results = [];

async function worker() {
  while (cursor < articles.length) {
    const article = articles[cursor++];
    try {
      results.push({slug: article.slug, source: article.sources[0], candidates: await discover(article)});
    } catch (error) {
      results.push({slug: article.slug, source: article.sources[0], error: error.message, candidates: []});
    }
  }
}

await Promise.all(Array.from({length: concurrency}, worker));
results.sort((a, b) => articles.findIndex((article) => article.slug === a.slug) - articles.findIndex((article) => article.slug === b.slug));
console.log(JSON.stringify(results, null, 2));
