import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const config = JSON.parse(fs.readFileSync(path.resolve("operations/legacy-routes.json"), "utf8"));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function render(route) {
  const targetUrl = `${base}${route.to}`;
  const isQuestion = route.kind === "duplicate-question";
  const isQuangNinhProvinceConsolidation = route.from === "/viec-lam-nganh-than/quang-ninh/";
  const title = isQuestion
    ? `${route.label} Nội dung đã được hợp nhất`
    : `Thông tin việc làm ngành Than tại ${route.label} đã chuyển địa chỉ`;
  const description = isQuestion
    ? `Câu trả lời về “${route.label}” đã được hợp nhất tại trang thông tin chính để người lao động không gặp nội dung trùng lặp.`
    : `Đường dẫn cũ được chuyển tới trang thông tin việc làm ngành Than tại ${route.label} trên Thầy Linh Tuyển Thợ Mỏ.`;
  const localityContinuity = isQuangNinhProvinceConsolidation
    ? `<p class="legacy-locality-continuity"><strong>Thầy Linh</strong> <small>Tuyển Thợ Mỏ</small> · <a href="/viec-lam-nganh-than/quang-ninh/xa-phuong/">Tra cứu tuyển nguồn theo xã/phường Quảng Ninh</a></p>`
    : "";
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#0b222b">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="noindex,follow">
  <link rel="canonical" href="${targetUrl}">
  <meta http-equiv="refresh" content="0; url=${route.to}">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="stylesheet" href="/styles.css?v=16">
  <link rel="stylesheet" href="/mobile-ux.css?v=8">
</head>
<body data-legacy-redirect>
  <a class="skip-link" href="#noi-dung">Bỏ qua đến nội dung</a>
  <main id="noi-dung" class="legal-page">
    <article class="legal-card">
      <p class="eyebrow">${isQuestion ? "CÂU TRẢ LỜI ĐÃ HỢP NHẤT" : "ĐƯỜNG DẪN ĐÃ CẬP NHẬT"}</p>
      <h1>${isQuestion ? escapeHtml(route.label) : `Thông tin tại ${escapeHtml(route.label)} đã chuyển sang địa chỉ mới`}</h1>
      <p>${isQuestion ? "Website đang chuyển bạn tới câu trả lời chính để tránh hai trang cùng giải thích một vấn đề." : "Website đang chuyển bạn tới trang thông tin việc làm ngành Than hiện hành."}</p>
      <a class="button" href="${route.to}">${isQuestion ? "Mở câu trả lời chính" : "Mở trang mới"}</a>
      ${localityContinuity}
    </article>
  </main>
  <script>location.replace(${JSON.stringify(route.to)} + location.search + location.hash);</script>
  <script src="/analytics.js?v=5" defer></script>
  <script src="/mobile-ux.js?v=10" defer></script>
</body>
</html>
`;
}

for (const route of config.routes) {
  const directory = path.join(root, route.from.replace(/^\/+|\/+$/g, ""));
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, "index.html"), render(route));
}

console.log(JSON.stringify({legacyRedirects: config.routes.length}, null, 2));
