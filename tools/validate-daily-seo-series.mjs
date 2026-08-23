import fs from "node:fs";
import path from "node:path";

// Final Pages SEO gate: freshness may update generated/excluded delivery files,
// while province integrity is read-only. Source normalization is committed by
// recruitment-seo-copy-v11 before a clean deployment is accepted.
await import("./sync-home-freshness.mjs");
await import("./validate-province-indexing-integrity-v11.mjs");

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const data = JSON.parse(fs.readFileSync(path.join(root, "content", "daily-seo-articles.json"), "utf8"));
const canonicalFacts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const approvedWorkerImages = JSON.parse(fs.readFileSync(path.join(root, "content", "approved-worker-images.json"), "utf8"));
const releaseDate = process.env.SEO_DAILY_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const released = data.articles.filter((article) => article.publish_on <= releaseDate);
const future = data.articles.filter((article) => article.publish_on > releaseDate);
const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
const llms = fs.readFileSync(path.join(site, "llms.txt"), "utf8");
const hub = fs.readFileSync(path.join(site, "giai-dap-nghe-mo", "index.html"), "utf8");
const errors = [];
const occupationTerms = ["khai thác mỏ", "xây dựng mỏ", "cơ điện mỏ"];
const newsroomBannedPhrases = [
  /bài nguồn(?: ngày)?/iu,
  /nguồn cho biết/iu,
  /nguồn nêu/iu,
  /theo nguồn(?: tin)?/iu,
  /bài báo cho biết/iu,
  /bài viết nguồn/iu,
  /nội dung nguồn/iu,
];
const allowedBlueWorkerImages = new Set([
  ...approvedWorkerImages.images.map((image) => `https://thaylinhtuyenthomo.vn/assets/${image.asset}`),
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp",
  "https://thaylinhtuyenthomo.vn/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp",
]);
const isOccupationArticle = (article) => occupationTerms.some((term) =>
  `${article.title} ${article.primary_query}`.toLocaleLowerCase("vi").includes(term),
);
const unique = (items, label) => {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item)) errors.push(`${label} bị trùng: ${item}`);
    seen.add(item);
  }
};
const proseText = (article) => [
  article.direct_answer,
  ...(article.intro || []),
  ...(article.key_points || []).flat(),
  ...(article.sections || []).flatMap((section) => [section.heading, ...(section.paragraphs || []), ...(section.items || [])]),
  article.takeaway_title,
  article.takeaway,
  ...(article.faqs || []).flat(),
].filter(Boolean).join(" ");

function walkStrings(value, visitor, pointer = "$") {
  if (typeof value === "string") return visitor(value, pointer);
  if (Array.isArray(value)) return value.forEach((item, index) => walkStrings(item, visitor, `${pointer}[${index}]`));
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) walkStrings(item, visitor, `${pointer}.${key}`);
  }
}

function validateFactsStrings(article) {
  walkStrings(article, (value, pointer) => {
    const text = String(value);
    if (/7[,.]5\s*triệu/iu.test(text) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(text)) {
      errors.push(`${article.slug} ${pointer}: nhắc 7,5 triệu nhưng thiếu /tháng`);
    }
    if (/20\s*[–-]\s*25\s*triệu/iu.test(text) && !/hoàn thành định mức lao động/iu.test(text)) {
      errors.push(`${article.slug} ${pointer}: nhắc 20–25 triệu nhưng thiếu điều kiện hoàn thành định mức lao động`);
    }
    for (const legacy of canonicalFacts.forbidden_legacy_phrases || []) {
      if (legacy && text.toLocaleLowerCase("vi").includes(String(legacy).toLocaleLowerCase("vi"))) {
        errors.push(`${article.slug} ${pointer}: còn legacy phrase ${legacy}`);
      }
    }
  });
}

// Source registry metadata was introduced after the article registry already existed.
// Treat a completely absent metadata triplet as a backward-compatible source format;
// if any field is present, all three must agree with canonical facts. The published
// machine feed is still validated strictly below on every deployment.
const sourceFactsMetadataPresent = [
  data.canonical_facts_version,
  data.canonical_facts_confirmed_at,
  data.canonical_facts_url,
].some((value) => value !== undefined && value !== null && value !== "");
if (sourceFactsMetadataPresent) {
  if (data.canonical_facts_version !== canonicalFacts.version) errors.push(`Registry daily SEO facts version lệch canonical v${canonicalFacts.version}`);
  if (data.canonical_facts_confirmed_at !== canonicalFacts.confirmed_at) errors.push("Registry daily SEO facts timestamp không khớp canonical facts");
  if (data.canonical_facts_url !== "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json") errors.push("Registry daily SEO sai canonical_facts_url");
}

unique(data.articles.map((article) => article.slug), "Slug");
unique(data.articles.map((article) => article.publish_on), "Ngày xuất bản");
unique(data.articles.map((article) => article.primary_query.toLocaleLowerCase("vi")), "Từ khóa chính");
unique(data.articles.map((article) => article.image.src), "Ảnh chuỗi giải đáp");

for (const article of data.articles) {
  validateFactsStrings(article);
  if (!allowedBlueWorkerImages.has(article.image.src)) errors.push(`${article.slug}: ảnh không phải công nhân Vinacomin mặc áo xanh, đội mũ`);
  if (article.meta.length < 100 || article.meta.length > 165) errors.push(`${article.slug}: meta description dài ${article.meta.length} ký tự`);
  if (article.direct_answer.length < 90 || article.direct_answer.length > 330) errors.push(`${article.slug}: câu trả lời trực tiếp cần 90–330 ký tự`);
  if ((article.intro || []).length < 2) errors.push(`${article.slug}: mở bài cần ít nhất 2 đoạn để đặt bối cảnh và trả lời nhu cầu người đọc`);
  if ((article.key_points || []).length < 4) errors.push(`${article.slug}: cần ít nhất 4 ý chính có giải thích`);
  if ((article.sections || []).length < 3) errors.push(`${article.slug}: cần ít nhất 3 mục giải thích`);
  for (const [index, section] of (article.sections || []).entries()) {
    if ((section.paragraphs || []).length < 2 && (section.items || []).length < 3) {
      errors.push(`${article.slug}: mục ${index + 1} còn quá vụn, cần ít nhất 2 đoạn văn hoặc 3 ý có diễn giải`);
    }
    for (const paragraph of section.paragraphs || []) {
      if (String(paragraph).trim().length < 120) errors.push(`${article.slug}: mục ${index + 1} có đoạn văn quá ngắn, dễ thành nội dung liệt kê`);
    }
  }
  if ((article.faqs || []).length < 3) errors.push(`${article.slug}: cần ít nhất 3 FAQ`);
  if ((article.related || []).length < 3) errors.push(`${article.slug}: cần ít nhất 3 liên kết đọc tiếp để tạo cụm chủ đề`);
  if (!article.source_note || String(article.source_note).trim().length < 40) errors.push(`${article.slug}: thiếu căn cứ biên soạn đủ rõ`);
  if (!article.takeaway || String(article.takeaway).trim().length < 150) errors.push(`${article.slug}: kết luận còn quá ngắn, chưa đủ giá trị quyết định`);
  const prose = proseText(article);
  for (const banned of newsroomBannedPhrases) {
    if (banned.test(prose)) errors.push(`${article.slug}: văn phong máy móc bị cấm (${banned})`);
  }
  if (/cam kết thu nhập/iu.test(prose)) errors.push(`${article.slug}: không dùng nhãn marketing “cam kết thu nhập” trong bài biên tập`);
  if (/được Thu nhập 20[–-]25/iu.test(prose)) errors.push(`${article.slug}: lỗi viết hoa/văn phạm ở câu thu nhập`);
  if (/khi hoàn thành định mức lao động\.\s*khi hoàn thành định mức lao động/iu.test(prose)) errors.push(`${article.slug}: lặp điều kiện thu nhập`);
}

for (const article of released) {
  const relative = `giai-dap-nghe-mo/${article.slug}/index.html`;
  const target = path.join(site, relative);
  const canonical = `https://thaylinhtuyenthomo.vn/giai-dap-nghe-mo/${article.slug}/`;
  if (!fs.existsSync(target)) {
    errors.push(`${article.slug}: thiếu trang đã đến ngày xuất bản`);
    continue;
  }
  const html = fs.readFileSync(target, "utf8");
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const words = visible.split(/\s+/).filter(Boolean).length;
  if (words < 650) errors.push(`${article.slug}: nội dung còn mỏng (${words} từ)`);
  for (const marker of [
    `<link rel="canonical" href="${canonical}">`,
    `<h1>${article.title}</h1>`,
    article.direct_answer,
    '"@type":"Article"',
    '"@type":"FAQPage"',
    'data-contact="zalo"',
    "/lien-he-di-lam-mo-than-quang-ninh/",
  ]) if (!html.includes(marker)) errors.push(`${article.slug}: thiếu ${marker}`);
  if (isOccupationArticle(article)) {
    const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || "";
    if (!/<body\b[^>]*class="[^"]*\bdaily-seo-page\b[^"]*\boccupation-text-only\b[^"]*"/i.test(html)) errors.push(`${article.slug}: chưa bật chế độ bài nghề chỉ dùng nội dung chữ`);
    if (/<(?:img|picture|figure)\b/i.test(main)) errors.push(`${article.slug}: bài nghề còn ảnh minh họa trong nội dung chính`);
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`${article.slug}: thiếu trong sitemap`);
  if (!llms.includes(canonical)) errors.push(`${article.slug}: thiếu trong llms.txt`);
  if (!hub.includes(`/giai-dap-nghe-mo/${article.slug}/`)) errors.push(`${article.slug}: thiếu trên trang trung tâm`);
}

for (const article of future) {
  const canonical = `https://thaylinhtuyenthomo.vn/giai-dap-nghe-mo/${article.slug}/`;
  if (fs.existsSync(path.join(site, "giai-dap-nghe-mo", article.slug, "index.html"))) errors.push(`${article.slug}: tệp tương lai được tạo sớm`);
  if (sitemap.includes(canonical)) errors.push(`${article.slug}: URL tương lai xuất hiện sớm trong sitemap`);
  if (hub.includes(`/${article.slug}/`)) errors.push(`${article.slug}: bài tương lai xuất hiện sớm trên hub`);
}

const machineFeed = JSON.parse(fs.readFileSync(path.join(site, "daily-seo-articles.json"), "utf8"));
if (machineFeed.articles.length !== released.length) errors.push("Dữ liệu máy đọc không khớp số bài đã xuất bản");
if (machineFeed.canonical_facts_version !== canonicalFacts.version) errors.push(`daily-seo-articles.json chưa gắn facts v${canonicalFacts.version}`);
if (machineFeed.canonical_facts_confirmed_at !== canonicalFacts.confirmed_at) errors.push("daily-seo-articles.json facts timestamp không khớp");
if (machineFeed.canonical_facts_url !== "https://thaylinhtuyenthomo.vn/data/recruitment-facts-2026.json") errors.push("daily-seo-articles.json sai canonical facts URL");
if (!fs.readFileSync(path.join(site, "index.html"), "utf8").includes("home-daily-seo")) errors.push("Trang chủ thiếu khối giải đáp mới mỗi ngày");
if (!fs.readFileSync(path.join(site, "cam-nang-nghe-mo", "index.html"), "utf8").includes("daily-seo-guide:start")) errors.push("Cẩm nang thiếu liên kết tới chuỗi SEO hằng ngày");

console.log(JSON.stringify({releaseDate, canonicalFactsVersion: canonicalFacts.version, sourceRegistryFactsMode: sourceFactsMetadataPresent ? "strict" : "legacy-compatible", planned: data.articles.length, released: released.length, future: future.length, errors: errors.length, sampleErrors: errors.slice(0, 30), editorialGuard: "newsroom-v2-facts-v8", finalSeoGate: "freshness+province-integrity"}, null, 2));
if (errors.length) process.exitCode = 1;
