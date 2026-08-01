import { communityArticles } from "./community-articles.mjs";
import { communitySourceImages } from "./community-source-images.mjs";

const USER_AGENT = "Mozilla/5.0 (compatible; ThayLinhSourceImageAudit/1.0)";

const decodeHtml = (value = "") => value
  .replaceAll("&amp;", "&")
  .replaceAll("&#038;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#039;", "'");

const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? decodeHtml(match[1]) : "";
};

const isUsableImage = (url) => Boolean(
  url
  && /^https?:\/\//i.test(url)
  && !/(?:logo|banner|favicon|emoji|visitor-counter|218x150|436x300)/i.test(url)
);

export const extractSourceImage = (html) => {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of metaTags) {
    const key = getAttribute(tag, "property") || getAttribute(tag, "name");
    if (!/^(?:og:image|twitter:image)$/i.test(key)) continue;
    const url = getAttribute(tag, "content");
    if (isUsableImage(url)) return url;
  }

  const bodyMarker = html.search(
    /class=["'][^"']*(?:td-post-content|entry-content|post-content)[^"']*["']/i,
  );
  const articleBody = bodyMarker >= 0 ? html.slice(bodyMarker, bodyMarker + 300_000) : html;
  const imageTags = articleBody.match(/<img\b[^>]*>/gi) || [];

  for (const tag of imageTags) {
    const url = getAttribute(tag, "src")
      || getAttribute(tag, "data-src")
      || getAttribute(tag, "data-img-url");
    if (isUsableImage(url)) return url;
  }

  return "";
};

export const auditSourceImages = async () => {
  const results = [];

  for (const article of communityArticles) {
    const source = article.sources?.[0];
    if (!source?.url) {
      results.push({ slug: article.slug, status: "NO_SOURCE_URL", source: "", image: "" });
      continue;
    }

    try {
      const response = await fetch(source.url, {
        headers: { "user-agent": USER_AGENT },
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
      });
      const html = await response.text();
      results.push({
        slug: article.slug,
        status: response.status,
        source: source.url,
        image: extractSourceImage(html),
        expected: communitySourceImages[article.slug]?.image || "",
      });
    } catch (error) {
      results.push({
        slug: article.slug,
        status: "ERROR",
        source: source.url,
        image: "",
        error: error.message,
      });
    }
  }

  return results;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = await auditSourceImages();
  const mismatches = results.filter((item) => item.status !== 200 || !item.image || item.image !== item.expected);
  console.log(JSON.stringify({
    checked: results.length,
    mismatches: mismatches.length,
    results,
  }, null, 2));
  if (process.argv.includes("--check") && mismatches.length) process.exitCode = 1;
}
