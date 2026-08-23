import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const dataPath = path.resolve(projectRoot, "content", "editorial-field-reports-v8.json");
const reports = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const cssHref = "/editorial-field-report-v8.css?v=2";
const changed = [];
const standalonePaths = {
  "gia-lai": "/phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/",
  "quang-ngai": "/phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/",
};

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function renderReport(slug, report) {
  const headingId = `field-report-v8-${slug}`;
  const sections = report.sections.map((section) => `
        <h3>${escapeHtml(section.heading)}</h3>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n        ")}`).join("");
  const standalone = standalonePaths[slug] || "/phong-su/";

  return `<!-- field-report-v8:start:${slug} -->
    <section class="section editorial-field-report-v8" aria-labelledby="${headingId}" data-editorial-original="field-report-v8">
      <div class="editorial-field-report-v8__header">
        <p class="eyebrow">${escapeHtml(report.eyebrow)}</p>
        <h2 id="${headingId}">${escapeHtml(report.title)}</h2>
        <p class="editorial-field-report-v8__lead">${escapeHtml(report.lead)}</p>
      </div>
      <div class="editorial-field-report-v8__layout">
        <article class="editorial-field-report-v8__prose" aria-label="Nội dung ghi chép hiện trường">
          ${sections}
          <p class="editorial-field-report-v8__ending">${escapeHtml(report.ending)}</p>
        </article>
        <aside class="editorial-field-report-v8__aside" aria-label="Tư liệu kiểm chứng">
          <span class="editorial-field-report-v8__badge">● Tư liệu gốc</span>
          <small>Video hiện trường</small>
          <p>Đọc bài trước, sau đó đối chiếu với video gốc để tự kiểm chứng hành trình và bối cảnh được nhắc tới.</p>
          <a class="editorial-field-report-v8__article-link" href="${standalone}">Đọc bản phóng sự đầy đủ →</a>
          <a class="button button--outline-dark" href="${escapeHtml(report.videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(report.videoLabel)} →</a>
          <p class="editorial-field-report-v8__source"><strong>Tư liệu:</strong> ${escapeHtml(report.source)}</p>
        </aside>
      </div>
    </section>
<!-- field-report-v8:end:${slug} -->`;
}

function stripExisting(html, slug) {
  const pattern = new RegExp(`\\s*<!-- field-report-v8:start:${slug} -->[\\s\\S]*?<!-- field-report-v8:end:${slug} -->\\s*`, "i");
  return html.replace(pattern, "\n");
}

for (const [slug, report] of Object.entries(reports)) {
  const file = path.join(siteRoot, "viec-lam-nganh-than", slug, "index.html");
  if (!fs.existsSync(file)) throw new Error(`${slug}: thiếu trang tỉnh để gắn phóng sự v8`);

  const before = fs.readFileSync(file, "utf8");
  let after = stripExisting(before, slug);
  after = after.replace(/<link rel="stylesheet" href="\/editorial-field-report-v8\.css\?v=\d+">\s*/g, "");
  after = after.replace("</head>", `  <link rel="stylesheet" href="${cssHref}">\n</head>`);

  const insertBefore = after.match(/\n\s*<section class="section section--dark local-benefits"/i)?.[0];
  if (!insertBefore) throw new Error(`${slug}: không tìm thấy vị trí chèn trước local-benefits`);
  after = after.replace(insertBefore, `\n\n${renderReport(slug, report)}${insertBefore}`);

  if (report.dateModified) {
    after = after.replace(/"dateModified":"\d{4}-\d{2}-\d{2}"/, `"dateModified":"${report.dateModified}"`);
  }

  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

await import("./generate-editorial-field-report-pages-v8.mjs");
await import("./editorial-field-report-llms-v8.mjs");

console.log(JSON.stringify({
  status: "editorial-field-report-v8-complete",
  reports: Object.keys(reports).length,
  changedFiles: changed.length,
  changed,
  standalone: standalonePaths,
}, null, 2));
