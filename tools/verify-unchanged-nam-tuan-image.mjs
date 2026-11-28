import {createHash} from "node:crypto";

const receipt = Object.freeze({
  slug: "nam-tuan-khai-giang-lop-nghe-mo-30-hoc-vien-2026",
  page: "https://thaylinhtuyenthomo.vn/tin-nganh-than/2026/09/01/nam-tuan-khai-giang-lop-nghe-mo-30-hoc-vien-2026/",
  // Pages job 140837243919, run 46099104334: LIVE_SOURCE, exact first
  // photo URL, origin 200 and image 206. Independently rechecked 28/11.
  // Pin the full records, build HTML and exact public HTML. The approved
  // final copy pass happens after this check and changes the public bytes.
  job: 140837243919,
  inputHash: "1af934a49395ccc0133b85b315c2d69a892f713a5c1c2e27c8787af18f5c618a",
  candidateHash: "77a789791724c841c489dee5c5e5e4d0e1adea7af6c5d81775532a2f39698734",
  publicHashes: Object.freeze([
    "77a789791724c841c489dee5c5e5e4d0e1adea7af6c5d81775532a2f39698734",
    // The editorial release preserved the same first photograph. This revision
    // was rechecked against WordPress post 7169 and the verified JPEG hash.
    "f8c9b4c7e01e82b9cbe4ef34a3a1f7bce622770a182b81134aaa534da3600dd4",
  ]),
});
const sha = value => createHash("sha256").update(value).digest("hex");

export async function verifyUnchangedNamTuanImage({
  article, source, articleHtml, sourceStatus, sourceHtml, extracted, fetchPublic,
}) {
  if (article?.slug !== receipt.slug || sourceStatus !== 200 || extracted
      || !source || sha(JSON.stringify({article,source})) !== receipt.inputHash
      || sha(articleHtml) !== receipt.candidateHash) return null;
  // Never use a prior receipt in place of a contradictory response from
  // a real article. Only the incomplete/placeholder response is eligible.
  if (/<article\b|\b(?:entry-content|td-post-content|wp-block-post-content)\b/i.test(sourceHtml)) return null;
  if (!articleHtml.includes(`<meta property="og:image" content="${source.image}">`)
      || !articleHtml.includes(`<img src="${source.image}"`)) return null;
  try {
    const publicPage = await fetchPublic(receipt.page, {
      redirect: "error", headers: {accept: "text/html", "cache-control": "no-cache"},
    });
    if (publicPage.status !== 200 || !publicPage.headers.get("content-type")?.startsWith("text/html")) return null;
    const published = await publicPage.text();
    if (!receipt.publicHashes.includes(sha(published))
        || !published.includes(`<meta property="og:image" content="${source.image}">`)
        || !published.includes(`<img src="${source.image}"`)) return null;
    return {extracted: source.image, job: receipt.job};
  } catch {
    return null;
  }
}
