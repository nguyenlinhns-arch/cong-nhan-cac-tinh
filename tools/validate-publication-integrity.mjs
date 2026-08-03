import fs from "node:fs";

const checks = [
  ["tools/build-worker-first-home-base.mjs", 20_000, "outputSha256"],
  ["tools/build-worker-first-home.mjs", 900, "home-library__card--latest"],
  ["tools/community-articles-base.mjs", 150_000, "export const communityArticles"],
  ["tools/community-articles.mjs", 200, "dailyCommunityArticles"],
  ["tools/generate-seo-library-base.mjs", 40_000, "Generated ${generatedArticles.length}"],
  ["tools/generate-seo-library.mjs", 200, "generate-seo-library-base.mjs"],
  ["tuyen-tho-mo/index.html", 18_000, "</html>"],
  ["tuyen-tho-mo/search-index.json", 100_000, '"items"'],
  ["tuyen-tho-mo/feed.json", 30_000, '"items"'],
  ["tuyen-tho-mo/llms.txt", 10_000, "## Kho kiến thức ngành mỏ"],
  ["content/editorial-sources.json", 30_000, '"articles"'],
  ["tuyen-tho-mo/assets/articles/sources.json", 20_000, "source_article_url"],
];

const errors = [];
for (const [file, minimumBytes, requiredText] of checks) {
  const content = fs.readFileSync(file, "utf8");
  const bytes = Buffer.byteLength(content);
  if (bytes === 16_384 || bytes < minimumBytes) {
    errors.push(`${file}: ${bytes} byte, có dấu hiệu bị cắt hoặc thiếu dữ liệu`);
  }
  if (!content.includes(requiredText)) errors.push(`${file}: thiếu dấu hoàn chỉnh ${requiredText}`);
}

for (const file of [
  "content/editorial-sources.json",
  "tuyen-tho-mo/assets/articles/sources.json",
  "tuyen-tho-mo/feed.json",
  "tuyen-tho-mo/search-index.json",
]) {
  try { JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { errors.push(`${file}: JSON không hợp lệ (${error.message})`); }
}

const homepage = fs.readFileSync("tuyen-tho-mo/index.html", "utf8");
for (const marker of [
  'href="/cam-nang-nghe-mo/"',
  'href="/tin-nganh-than/"',
  'href="/anh-video-thuc-te/"',
  'id="kho-noi-dung"',
  'class="worker-register"',
  "</body>",
]) if (!homepage.includes(marker)) errors.push(`Trang chủ thiếu ${marker}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Publication integrity: PASS");
