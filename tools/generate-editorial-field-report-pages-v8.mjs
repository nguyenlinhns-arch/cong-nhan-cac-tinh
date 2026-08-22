import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const reports = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-field-reports-v8.json"), "utf8"));
const base = "https://thaylinhtuyenthomo.vn";
const personId = `${base}/tac-gia/nguyen-tu-linh/#person`;
const orgId = `${base}/#organization`;
const siteId = `${base}/#website`;
const hubPath = "/phong-su/";

export const fieldReportPages = {
  "gia-lai": {
    slug: "ia-rdeh-gia-lai-con-duong-den-vung-mo",
    province: "Gia Lai",
    provincePath: "/viec-lam-nganh-than/gia-lai/",
    description: "Ghi chép hiện trường tại Ia RDeh, Gia Lai: tư vấn nghề mỏ, phối hợp ba bên và câu chuyện gia đình công nhân Kso Sới.",
  },
  "quang-ngai": {
    slug: "quang-ngai-hanh-trinh-den-vung-mo-quang-ninh",
    province: "Quảng Ngãi",
    provincePath: "/viec-lam-nganh-than/quang-ngai/",
    description: "Ghi chép hành trình từ Quảng Ngãi tới Quảng Ninh: rời quê, đến nơi tiếp nhận, nhập học và kiểm chứng lộ trình học nghề mỏ.",
  },
};

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const sharedHead = `
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="stylesheet" href="/article-insights.css?v=14">
  <link rel="stylesheet" href="/content-network.css?v=1">
  <link rel="stylesheet" href="/editorial-field-report-v8.css?v=2">
  <link rel="stylesheet" href="/mobile-core.css?v=1">
  <link rel="stylesheet" href="/site-shell-20260803.css?v=3">
  <link rel="stylesheet" href="/fonts.css?v=2">`;

const sharedHeader = (backHref = hubPath, backLabel = "Phóng sự hiện trường") => `<a class="skip-link" href="#noi-dung">Đến nội dung chính</a>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="/"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="${backHref}">← ${escapeHtml(backLabel)}</a></div></header>`;

const sharedFooter = `<footer class="site-footer"><div class="container footer-inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Tư liệu thực địa, nghề mỏ và hành trình người lao động.</p></div><div><a href="/phong-su/">Phóng sự hiện trường</a><a href="/tin-nganh-than/">Tin ngành Than</a><a href="/nguyen-tac-bien-tap/">Nguyên tắc biên tập</a></div></div></footer>
  <script src="/analytics.js?v=6" defer></script><script src="/mobile-core.js?v=1" defer></script><script src="/site-shell-20260803.js?v=3" defer></script>`;

function canonicalFor(config) {
  return `${base}${hubPath}${config.slug}/`;
}

function schemaFor(slug, report, config) {
  const url = canonicalFor(config);
  const videoId = `${url}#video`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: report.title,
        description: config.description,
        datePublished: report.dateModified,
        dateModified: report.dateModified,
        inLanguage: "vi-VN",
        articleSection: "Phóng sự hiện trường",
        author: {"@id": personId},
        publisher: {"@id": orgId},
        mainEntityOfPage: {"@id": `${url}#webpage`},
        isBasedOn: [report.videoUrl],
        associatedMedia: {"@id": videoId},
        about: [
          {"@type": "Place", name: config.province},
          {"@type": "Thing", name: "học nghề mỏ và việc làm ngành Than"},
        ],
      },
      {
        "@type": "VideoObject",
        "@id": videoId,
        name: report.videoLabel,
        description: report.source,
        contentUrl: report.videoUrl,
        uploadDate: report.dateModified,
        inLanguage: "vi-VN",
        author: {"@id": personId},
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: report.title,
        description: config.description,
        datePublished: report.dateModified,
        dateModified: report.dateModified,
        inLanguage: "vi-VN",
        isPartOf: {"@id": siteId},
        author: {"@id": personId},
        publisher: {"@id": orgId},
        mainEntity: {"@id": `${url}#article`},
        breadcrumb: {"@id": `${url}#breadcrumb`},
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {"@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/`},
          {"@type": "ListItem", position: 2, name: "Phóng sự hiện trường", item: `${base}${hubPath}`},
          {"@type": "ListItem", position: 3, name: config.province, item: url},
        ],
      },
    ],
  };
}

function renderArticle(slug, report, config) {
  const url = canonicalFor(config);
  const sections = report.sections.map((section) => `<section class="editorial-section"><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>`).join("\n");
  const schema = JSON.stringify(schemaFor(slug, report, config));
  return `<!doctype html><html lang="vi" data-editorial-original="field-report-v8"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#063c46"><title>${escapeHtml(report.title)} | Thầy Linh</title><meta name="description" content="${escapeHtml(config.description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="author" content="Nguyễn Tử Linh"><meta name="keywords" content="phóng sự nghề mỏ, ${escapeHtml(config.province)}, học nghề mỏ, việc làm ngành Than, người lao động tỉnh xa"><link rel="canonical" href="${url}"><link rel="author" href="/tac-gia/nguyen-tu-linh/"><meta property="og:type" content="article"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="${escapeHtml(report.title)}"><meta property="og:description" content="${escapeHtml(config.description)}"><meta property="og:url" content="${url}"><meta property="article:published_time" content="${report.dateModified}"><meta property="article:modified_time" content="${report.dateModified}"><meta property="article:section" content="Phóng sự hiện trường"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(report.title)}"><meta name="twitter:description" content="${escapeHtml(config.description)}">${sharedHead}<script type="application/ld+json">${schema}</script></head><body>${sharedHeader()}<main id="noi-dung"><section class="article-hero article-hero--text"><div class="container hero-inner"><nav class="breadcrumbs" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span>/</span><a href="${hubPath}">Phóng sự</a><span>/</span><span>${escapeHtml(config.province)}</span></nav><p class="eyebrow">${escapeHtml(report.eyebrow)} · ${escapeHtml(report.dateModified.split("-").reverse().join("/"))}</p><h1>${escapeHtml(report.title)}</h1><p class="lead">${escapeHtml(report.lead)}</p></div></section><div class="container article-layout"><article class="article-body article-body--professional article-body--field-report-v8" data-editorial-original="field-report-v8"><p class="article-byline"><strong>Nguyễn Tử Linh</strong><span> · Ghi chép từ tư liệu thực địa</span></p>${sections}<p class="article-conclusion">${escapeHtml(report.ending)}</p><div class="article-source-footer"><p><strong>Tư liệu:</strong> ${escapeHtml(report.source)}</p><p><a href="${escapeHtml(report.videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(report.videoLabel)} →</a></p></div><nav class="article-nav" aria-label="Đọc tiếp"><a href="${config.provincePath}"><small>Thông tin theo tỉnh</small>${escapeHtml(config.province)} →</a><a href="${hubPath}"><small>Chuyên mục</small>Phóng sự hiện trường →</a></nav><section class="article-apply" aria-label="Bước tiếp theo"><h2>Nếu đang cân nhắc đi học nghề</h2><p>Kiểm tra điều kiện, lịch tiếp nhận và địa chỉ trước khi lên đường. Phần tư vấn được tách khỏi nội dung phóng sự để người đọc có thể tự kiểm chứng thông tin trước.</p><a href="/kiem-tra-dieu-kien/" data-contact="application" data-context="field-report-v8-${slug}">Kiểm tra điều kiện</a></section></article><aside class="article-aside"><section class="aside-card accent"><h2>Tư liệu gốc</h2><p>Đối chiếu bài viết với video hiện trường do Thầy Linh – Tuyển Thợ Mỏ công bố.</p><a href="${escapeHtml(report.videoUrl)}" target="_blank" rel="noopener noreferrer">Mở video gốc</a></section></aside></div></main>${sharedFooter}</body></html>`;
}

function renderHub(entries) {
  const modified = entries.map(([, report]) => report.dateModified).sort().at(-1) || "2026-08-23";
  const url = `${base}${hubPath}`;
  const itemList = entries.map(([slug, report], index) => {
    const config = fieldReportPages[slug];
    return {"@type": "ListItem", position: index + 1, name: report.title, url: canonicalFor(config)};
  });
  const schema = JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"CollectionPage","@id":`${url}#webpage`,url,name:"Phóng sự hiện trường nghề mỏ",description:"Ghi chép và phóng sự nguyên bản từ các chuyến công tác, hành trình nhập học và đời sống người lao động.",dateModified:modified,inLanguage:"vi-VN",isPartOf:{"@id":siteId},author:{"@id":personId},publisher:{"@id":orgId},mainEntity:{"@id":`${url}#items`}},{"@type":"ItemList","@id":`${url}#items`,numberOfItems:itemList.length,itemListElement:itemList}]});
  const cards = entries.map(([slug, report]) => {
    const config = fieldReportPages[slug];
    return `<article class="news-card field-report-hub__card"><div class="news-card__body"><small>${escapeHtml(config.province)} · ${escapeHtml(report.dateModified.split("-").reverse().join("/"))}</small><h2>${escapeHtml(report.title)}</h2><p>${escapeHtml(report.lead)}</p><a class="news-link" href="${hubPath}${config.slug}/">Đọc phóng sự →</a></div></article>`;
  }).join("\n");
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#063c46"><title>Phóng sự hiện trường nghề mỏ | Thầy Linh</title><meta name="description" content="Phóng sự, ghi chép và video thực địa về hành trình học nghề mỏ, nhập học và đời sống người lao động từ các tỉnh tới Quảng Ninh."><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="author" content="Nguyễn Tử Linh"><link rel="canonical" href="${url}"><link rel="author" href="/tac-gia/nguyen-tu-linh/"><meta property="og:type" content="website"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="Phóng sự hiện trường nghề mỏ"><meta property="og:description" content="Ghi chép nguyên bản từ địa phương, chuyến đi nhập học và đời sống người lao động."><meta property="og:url" content="${url}">${sharedHead}<script type="application/ld+json">${schema}</script></head><body>${sharedHeader("/", "Trang chủ")}<main id="noi-dung"><section class="news-hero"><div class="container"><p class="eyebrow">TƯ LIỆU NGUYÊN BẢN · NGƯỜI THẬT · HÀNH TRÌNH THẬT</p><h1>Phóng sự hiện trường nghề mỏ</h1><p class="lead">Những bài viết được dựng từ chuyến công tác, video và dữ liệu thực tế của chính hoạt động tuyển sinh. Mục tiêu là giúp người lao động nhìn thấy đầy đủ bối cảnh trước khi quyết định đi học hoặc đi làm xa.</p></div></section><section class="news-main"><div class="container"><div class="news-grid news-grid--pair field-report-hub">${cards}</div></div></section></main>${sharedFooter}</body></html>`;
}

const entries = Object.entries(reports).filter(([slug]) => fieldReportPages[slug]);
const hubDir = path.join(root, "phong-su");
fs.mkdirSync(hubDir, {recursive: true});
fs.writeFileSync(path.join(hubDir, "index.html"), renderHub(entries));

for (const [slug, report] of entries) {
  const config = fieldReportPages[slug];
  const dir = path.join(hubDir, config.slug);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, "index.html"), renderArticle(slug, report, config));
}

const latest = entries.map(([, report]) => report.dateModified).sort().at(-1) || "2026-08-23";
const sitemapPath = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, "utf8");
  const urls = [
    {url: `${base}${hubPath}`, priority: "0.8"},
    ...entries.map(([slug, report]) => ({url: canonicalFor(fieldReportPages[slug]), lastmod: report.dateModified, priority: "0.8"})),
  ];
  for (const item of urls) {
    if (sitemap.includes(`<loc>${item.url}</loc>`)) continue;
    const lastmod = item.lastmod || latest;
    sitemap = sitemap.replace("</urlset>", `  <url><loc>${item.url}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${item.priority}</priority></url>\n</urlset>`);
  }
  fs.writeFileSync(sitemapPath, sitemap);
}

const llmsPath = path.join(root, "llms.txt");
if (fs.existsSync(llmsPath)) {
  let llms = fs.readFileSync(llmsPath, "utf8");
  const start = "<!-- field-report-v8:start -->";
  const end = "<!-- field-report-v8:end -->";
  llms = llms.replace(new RegExp(`${start}[\\s\\S]*?${end}\\n?`, "g"), "");
  const block = `${start}\n## Phóng sự hiện trường nguyên bản\n\n- [Chuyên mục phóng sự hiện trường](${base}${hubPath}): ghi chép từ video, chuyến công tác và dữ liệu thực địa do Thầy Linh – Tuyển Thợ Mỏ trực tiếp công bố.\n${entries.map(([slug, report]) => `- [${report.title}](${canonicalFor(fieldReportPages[slug])}): ${fieldReportPages[slug].description}`).join("\n")}\n${end}\n\n`;
  llms = llms.replace("## Dữ liệu máy đọc và nguồn cập nhật", `${block}## Dữ liệu máy đọc và nguồn cập nhật`);
  fs.writeFileSync(llmsPath, llms);
}

console.log(JSON.stringify({status:"field-report-pages-v8-generated",hub:hubPath,pages:entries.map(([slug]) => `${hubPath}${fieldReportPages[slug].slug}/`)}, null, 2));
