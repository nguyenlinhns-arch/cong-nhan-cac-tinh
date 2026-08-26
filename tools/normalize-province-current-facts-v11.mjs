import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = path.join(root, "tuyen-tho-mo");
const provinceRoot = path.join(site, "viec-lam-nganh-than");
const sitemapPath = path.join(site, "province-sitemap.xml");
const facts = JSON.parse(fs.readFileSync(path.join(site, "data", "recruitment-facts-2026.json"), "utf8"));
const review = JSON.parse(fs.readFileSync(path.join(root, "content", "recruitment-review-v10.json"), "utf8"));
const income = facts.after_training.income_commitment;
const support = facts.study_benefits.living_support;
const reviewDate = review.reviewed_at;
const modifiedDate = review.verification_content_modified || reviewDate;
const authorId = "https://thaylinhtuyenthomo.vn/tac-gia/nguyen-tu-linh/#person";
const base = "https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/";
const errors = [];
const changed = [];

if (income !== "20–25 triệu đồng/tháng khi hoàn thành định mức lao động") throw new Error(`Province facts: income canonical sai: ${income}`);
if (support !== "7,5 triệu đồng/tháng trong thời gian học") throw new Error(`Province facts: support canonical sai: ${support}`);

function provinceFiles() {
  if (!fs.existsSync(provinceRoot)) throw new Error("Province facts: thiếu thư mục viec-lam-nganh-than");
  return fs.readdirSync(provinceRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({slug: entry.name, file: path.join(provinceRoot, entry.name, "index.html")}))
    .filter((entry) => fs.existsSync(entry.file))
    .sort((a, b) => a.slug.localeCompare(b.slug, "vi"));
}

function cleanLegacy(text) {
  return String(text)
    .replace(/(?:thu nhập\s+)?bình quân\s+20[–-]25 triệu(?: đồng)?\s*\/\s*tháng/giu, income)
    .replace(/được\s+Thu nhập\s+20[–-]25 triệu đồng\/tháng khi hoàn thành định mức lao động/gu, `có mức thu nhập ${income}`)
    .replace(/,?\s*tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/giu, "")
    .replace(/(khi hoàn thành định mức lao động)[\s.,;:]+khi hoàn thành định mức lao động/giu, "$1")
    .replace(/7[,.]5 triệu(?!\s*(?:đồng\s*)?\/\s*tháng)(?:\s*đồng)?/giu, "7,5 triệu đồng/tháng")
    .replace(/Xem đủ\s+\d+\s+tỉnh,\s*thành/giu, "Xem các địa bàn tuyển nguồn")
    .replace(/\.\s*\./g, ".");
}

function normalizeMetadataText(value) {
  let text = cleanLegacy(value);
  text = text
    .replace(/học nghề\s+2[–-]3\s*tháng/giu, "học 2–3/10 tháng theo nghề")
    .replace(/học\s+2[–-]3\s*tháng(?=\s*[,;|–—-])/giu, "học 2–3/10 tháng theo nghề");
  if (/2[–-]3\s*tháng/iu.test(text) && /(?:học|nghề|đào tạo)/iu.test(text) && !/10\s*tháng/iu.test(text)) {
    text = `${text.replace(/[.\s]+$/u, "")}; cơ điện mỏ 10 tháng.`;
  }
  return text;
}

function normalizeJsonString(value) {
  let text = cleanLegacy(value);
  text = text
    .replace(/Nghề khai thác mỏ và xây dựng mỏ (?:có thời gian )?học 2[–-]3 tháng(?: theo kế hoạch từng đợt)?\.?/giu,
      "Khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng theo kế hoạch từng đợt.")
    .replace(/Nghề khai thác mỏ và xây dựng mỏ học 2[–-]3 tháng\. Lịch cụ thể phụ thuộc từng đợt tiếp nhận\./giu,
      "Khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng. Lịch cụ thể phụ thuộc từng đợt tiếp nhận.");
  if (/Tuyển thợ mỏ tại|học nghề 2[–-]3 tháng/iu.test(text)) text = normalizeMetadataText(text);
  return text;
}

function transformJson(value) {
  if (typeof value === "string") return normalizeJsonString(value);
  if (Array.isArray(value)) return value.map(transformJson);
  if (!value || typeof value !== "object") return value;
  for (const [key, item] of Object.entries(value)) value[key] = transformJson(item);
  const type = value["@type"];
  const isWebPage = type === "WebPage" || (Array.isArray(type) && type.includes("WebPage"));
  if (isWebPage) {
    value.dateModified = modifiedDate;
    value.lastReviewed = reviewDate;
    value.reviewedBy = {"@id": authorId};
  }
  return value;
}

function normalizeJsonLd(html, label) {
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (full, open, body, close) => {
    try {
      const data = transformJson(JSON.parse(body));
      return `${open}${JSON.stringify(data)}${close}`;
    } catch (error) {
      errors.push(`${label}: JSON-LD lỗi khi normalize: ${error.message}`);
      return full;
    }
  });
}

function ensureReviewJsonLd(html, slug) {
  if (new RegExp(`"lastReviewed"\\s*:\\s*"${reviewDate}"`).test(html)
      && html.includes(`"reviewedBy":{"@id":"${authorId}"}`)) return html;
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]
    || `${base}${slug}/`;
  const name = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim()
    || `Tuyển thợ mỏ tại ${slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name,
    dateModified: modifiedDate,
    lastReviewed: reviewDate,
    reviewedBy: {"@id": authorId},
    author: {"@id": authorId},
    isPartOf: {"@id": "https://thaylinhtuyenthomo.vn/#website"},
  };
  return html.replace(/<\/head>/i, `  <script type="application/ld+json">${JSON.stringify(data)}</script>\n</head>`);
}

function normalizeMeta(html) {
  let next = html.replace(/(<title>)([\s\S]*?)(<\/title>)/i, (m, a, value, b) => `${a}${normalizeMetadataText(value)}${b}`);
  const metaPatterns = [
    /(<meta\s+name=["']description["']\s+content=["'])([^"']*)(["'][^>]*>)/i,
    /(<meta\s+property=["']og:description["']\s+content=["'])([^"']*)(["'][^>]*>)/i,
    /(<meta\s+name=["']twitter:description["']\s+content=["'])([^"']*)(["'][^>]*>)/i,
    /(<meta\s+property=["']og:title["']\s+content=["'])([^"']*)(["'][^>]*>)/i,
    /(<meta\s+name=["']twitter:title["']\s+content=["'])([^"']*)(["'][^>]*>)/i,
  ];
  for (const pattern of metaPatterns) next = next.replace(pattern, (m, a, value, b) => `${a}${normalizeMetadataText(value)}${b}`);
  return next;
}

function extractProvinceName(html, slug) {
  return html.match(/<title>Tuyển thợ mỏ (?:tại|cho lao động)\s+([^|<–—]+?)(?:\s*[|–—]|<\/title>)/iu)?.[1]?.trim()
    || html.match(/<p class=["']eyebrow["']>(?:TUYỂN THỢ MỎ TẠI|LAO ĐỘNG)\s+([^<]+)<\/p>/iu)?.[1]?.trim()
    || slug;
}

function normalizeApplicationLinks(html, provinceName, slug) {
  const encoded = provinceName.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return html.replace(/<a\b[^>]*href=["'][^"']*\/viec-lam\/cong-nhan-mo-ham-lo-quang-ninh\/(?:\?[^"']*)?#dang-ky["'][^>]*>/gi, (tag) => {
    let next = tag.replace(/href=["'][^"']*\/viec-lam\/cong-nhan-mo-ham-lo-quang-ninh\/(?:\?[^"']*)?#dang-ky["']/i,
      'href="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky"');
    if (!/data-prefill-province=/i.test(next)) next = next.replace(/>$/u, ` data-prefill-province="${encoded}">`);
    if (!/data-contact=/i.test(next)) next = next.replace(/>$/u, ' data-contact="application">');
    if (!/data-context=/i.test(next)) next = next.replace(/>$/u, ` data-context="province-${slug}">`);
    return next;
  });
}

function ensureElectricalTrainingBlock(html) {
  let next = html
    .replace(/<h3>Rèn tay nghề trong 2[–-]3 tháng<\/h3><p>Học kiến thức, an toàn và kỹ năng thực hành của nghề khai thác mỏ hoặc xây dựng mỏ hầm lò\.<\/p>/giu,
      `<h3>Học nghề theo từng nhóm nghề</h3><p>Khai thác và xây dựng mỏ học 2–3 tháng; <strong>Kỹ thuật cơ điện mỏ hầm lò</strong> học 10 tháng, cùng nội dung an toàn và thực hành theo nghề.</p>`)
    .replace(/<summary>Thời gian học bao lâu\?<\/summary><p>Nghề khai thác mỏ và xây dựng mỏ học 2[–-]3 tháng\. Lịch cụ thể phụ thuộc từng đợt tiếp nhận\.<\/p>/giu,
      `<summary>Thời gian học bao lâu?</summary><p>Khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng. Lịch cụ thể phụ thuộc từng đợt tiếp nhận.</p>`)
    .replace(/<h3>Kỹ thuật cơ điện mỏ hầm lò<\/h3><p>Đào tạo nghề cơ điện mỏ theo kế hoạch tuyển sinh\.<\/p>/giu,
      `<h3>Kỹ thuật cơ điện mỏ hầm lò</h3><p>Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.</p>`)
    .replace(/<h3>Kỹ thuật cơ điện mỏ hầm lò<\/h3><p>Đào tạo 10 tháng theo kế hoạch tuyển sinh\.<\/p>/giu,
      `<h3>Kỹ thuật cơ điện mỏ hầm lò</h3><p>Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.</p>`)
    .replace(/<p>Đào tạo nghề cơ điện mỏ theo kế hoạch tuyển sinh\.<\/p>/giu,
      `<p>Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.</p>`)
    .replace(/<p>Đào tạo theo kế hoạch tuyển sinh\.<\/p>/giu,
      `<p>Cơ điện mỏ học 10 tháng theo kế hoạch tuyển sinh.</p>`);

  if (!/Kỹ thuật cơ điện mỏ hầm lò/i.test(next)) {
    const block = `\n    <section class="section local-overview province-training-facts-v11" aria-labelledby="province-training-facts-title">\n      <div class="section-heading"><div><p class="eyebrow">BA NGHỀ ĐANG TIẾP NHẬN</p><h2 id="province-training-facts-title">Thời gian học theo từng nghề</h2></div><p>Khai thác và xây dựng mỏ học 2–3 tháng; <strong>Kỹ thuật cơ điện mỏ hầm lò</strong> học 10 tháng.</p></div>\n    </section>\n`;
    const marker = next.match(/\s*<section class=["'][^"']*section--faq[^"']*["']/i)?.[0];
    if (marker) next = next.replace(marker, `${block}${marker}`);
    else next = next.replace(/\s*<\/main>/i, `${block}\n  </main>`);
  }
  return next;
}

function normalize(html, slug) {
  let next = cleanLegacy(html)
    .replace(/<strong>Cam kết thu nhập<\/strong><p>20[–-]25 triệu đồng\/tháng\.<\/p>/giu,
      `<strong>Thu nhập sau đào tạo</strong><p>${income}.</p>`)
    .replace(/<strong>Hỗ trợ học nghề<\/strong><p>Miễn học phí, bố trí ăn ở và hỗ trợ trong thời gian học\.<\/p>/giu,
      `<strong>Hỗ trợ học nghề</strong><p>Miễn học phí, bố trí ăn ở và hỗ trợ ${support}.</p>`)
    .replace(/Xem thông tin tháng \d{1,2}\/\d{4} →/giu, "Xem thông tin đang áp dụng →")
    .replace(/học nghề trong 2[–-]3 tháng và chuẩn bị cho công việc tại Quảng Ninh/giu,
      "học nghề 2–3 hoặc 10 tháng theo nghề và chuẩn bị cho công việc tại Quảng Ninh");
  next = normalizeMeta(next);
  next = ensureElectricalTrainingBlock(next);
  next = normalizeJsonLd(next, slug);
  next = ensureReviewJsonLd(next, slug);
  next = normalizeApplicationLinks(next, extractProvinceName(next, slug), slug.replace(/\/index\.html$/u, ""));
  return next;
}

const files = provinceFiles();
const sitemapUrls = [];
for (const {slug, file} of files) {
  const relative = path.relative(site, file).split(path.sep).join("/");
  const before = fs.readFileSync(file, "utf8");
  const after = normalize(before, relative);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed.push(relative);
  }

  const html = after;
  if (!/Kỹ thuật cơ điện mỏ hầm lò/i.test(html)) errors.push(`${relative}: thiếu nghề cơ điện mỏ`);
  if (!/(?:cơ điện mỏ[^<\n]{0,100}(?:học|đào tạo)[^<\n]{0,40}10 tháng|Kỹ thuật cơ điện mỏ hầm lò[\s\S]{0,220}10 tháng)/iu.test(html)) errors.push(`${relative}: chưa nêu cơ điện mỏ 10 tháng`);
  if (/7[,.]5\s*triệu/iu.test(html) && !/7[,.]5\s*triệu(?:\s*đồng)?\s*\/\s*tháng/iu.test(html)) errors.push(`${relative}: hỗ trợ 7,5 triệu thiếu /tháng`);
  if (/tùy đơn vị,?\s*vị trí,?\s*ngày công và năng suất/iu.test(html)) errors.push(`${relative}: còn điều kiện thu nhập legacy`);
  if (!new RegExp(`"lastReviewed"\\s*:\\s*"${reviewDate}"`).test(html)) errors.push(`${relative}: lastReviewed chưa là ${reviewDate}`);
  if (!html.includes(`"reviewedBy":{"@id":"${authorId}"}`)) errors.push(`${relative}: thiếu reviewedBy canonical author`);
  if (/href=["'][^"']*cong-nhan-mo-ham-lo-quang-ninh\/\?province=/i.test(html)) errors.push(`${relative}: còn link crawlable ?province=`);
  if (/data-contact=["']application["']/i.test(html) && !/data-prefill-province=/i.test(html)) errors.push(`${relative}: CTA đăng ký thiếu data-prefill-province`);
  for (const match of html.matchAll(/20\s*[–-]\s*25\s*triệu/giu)) {
    const index = match.index || 0;
    const window = html.slice(Math.max(0, index - 220), Math.min(html.length, index + 340));
    if (!/hoàn thành định mức lao động/iu.test(window)) {
      errors.push(`${relative}: mức 20–25 triệu thiếu điều kiện định mức gần vị trí ${index}`);
      break;
    }
  }
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] || "";
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] || "";
  if (canonical.startsWith(base) && /(?:^|,)\s*index(?:,|$)/i.test(robots) && !/noindex/i.test(robots)) sitemapUrls.push(canonical);
}

if (files.length !== 34) errors.push(`Province facts: dự kiến 34 landing tỉnh/thành, thực tế ${files.length}`);
if (!sitemapUrls.length) errors.push("Province sitemap: không có landing tỉnh/thành indexable");

for (const {file} of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const legacy of facts.forbidden_legacy_phrases || []) {
    if (legacy && html.toLocaleLowerCase("vi").includes(String(legacy).toLocaleLowerCase("vi"))) errors.push(`${path.relative(site, file)}: còn legacy phrase ${legacy}`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url><loc>${url}</loc><lastmod>${reviewDate}</lastmod></url>`).join("\n")}\n</urlset>\n`;
if (!errors.length) fs.writeFileSync(sitemapPath, sitemap);

if (errors.length) {
  console.error(JSON.stringify({status:"province-current-facts-v11-invalid", canonicalFactsVersion:facts.version, pages:files.length, changed:changed.length, indexablePages:sitemapUrls.length, errors}, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({status:"province-current-facts-v11-ready", canonicalFactsVersion:facts.version, pages:files.length, changed:changed.length, indexablePages:sitemapUrls.length, sitemapUrls:sitemapUrls.length, support, income}, null, 2));
}
