import {createHash} from "node:crypto";

const expected = Object.freeze({
  slug: "than-thong-nhat-cap-ao-bao-ho-mua-dong-2026",
  // Pages job 140864402921 confirmed LIVE_SOURCE, including the first image.
  // Independently checked against the original article and its 800×449 JPEG.
  previousJob: 140864402921,
  page: "https://thaylinhtuyenthomo.vn/tin-nganh-than/2026/08/12/than-thong-nhat-cap-ao-bao-ho-mua-dong-2026/",
  inputHash: "f843b80f0613a036659e5af1ad4fb611ff1b071db02896d2f17e2c55d6a27255",
  htmlHash: "7bf00ea5136c20a3f4ab8d05e43acc745c07e26f41429570d738d11402f70bab",
});
const sha = value => createHash("sha256").update(value).digest("hex");

export async function verifyUnchangedThongNhatImage({
  article, receipt, candidate, sourceChallenge, extracted, firstImage, fetchPublic = fetch,
}) {
  // Only reconfirm the exact already-published article during the recognized
  // reload challenge. An actual conflicting source image always fails closed.
  if (article?.slug !== expected.slug || sourceChallenge !== true || extracted || firstImage
      || sha(JSON.stringify({article,receipt})) !== expected.inputHash
      || typeof candidate !== "string" || sha(candidate) !== expected.htmlHash) return null;
  try {
    const live = await fetchPublic(expected.page, {
      redirect: "error", headers: {accept:"text/html", "cache-control":"no-cache"},
      signal: AbortSignal.timeout(10_000),
    });
    if (live.status !== 200 || !live.headers.get("content-type")?.startsWith("text/html")) return null;
    if (sha(await live.text()) !== expected.htmlHash) return null;
    return expected.previousJob;
  } catch {
    return null;
  }
}
