// The public article page now loads its data from this same-origin endpoint.
// Never treat a missing/invalid API response as a verified source relationship.
export async function resolveVinacominSourceImage(sourceUrl, fetchImpl = fetch) {
  const failed = {image: "", verification: "UNVERIFIED"};
  try {
    const source = new URL(sourceUrl);
    const match = source.pathname.match(/^\/(?:vi\/)?news\/slug\/([a-z0-9-]+)\/?$/);
    if (source.origin !== "https://vinacomin.vn" || source.username || source.password
      || source.search || source.hash || !match) return failed;
    const slug = match[1];
    const endpoint = "https://vinacomin.vn/api/app/news/slug/" + slug;
    const response = await fetchImpl(endpoint, {
      headers: {language: "vi", "user-agent": "Mozilla/5.0 (compatible; ThayLinhDailyImageValidator/1.0)"},
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status !== 200 || !response.headers.get("content-type")?.includes("application/json")) return failed;
    const payload = await response.json();
    if (payload?.code !== 0 || payload.data?.slug !== slug || typeof payload.data?.thumbnail !== "string") return failed;
    const image = new URL(payload.data.thumbnail);
    if (image.origin !== "https://vinacomin.vn" || image.username || image.password || image.search || image.hash
      || !/^\/userfiles\/thumbnail\/[A-Za-z0-9._-]+$/.test(image.pathname)) return failed;
    return {image: image.href, verification: "LIVE_PUBLIC_ARTICLE_DATA", sourceDataUrl: endpoint};
  } catch {
    // Explicit failure result: callers must not turn this into pinned success.
    return failed;
  }
}
