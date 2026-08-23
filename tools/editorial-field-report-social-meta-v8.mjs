import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const socialImage = "https://thaylinhtuyenthomo.vn/assets/thay-linh-avatar.webp";
const socialImageAlt = "Thầy Linh – Tuyển Thợ Mỏ, nguồn phóng sự hiện trường";
const targets = [
  "phong-su/index.html",
  "phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/index.html",
  "phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/index.html",
];

function attrEscape(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function getMeta(html, kind, key) {
  const pattern = new RegExp(`<meta\\b[^>]*${kind}=["']${key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  const reverse = new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*${kind}=["']${key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["'][^>]*>`, "i");
  return html.match(pattern)?.[1] || html.match(reverse)?.[1] || "";
}

function ensureMeta(html, kind, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
  const existing = new RegExp(`<meta\\b(?=[^>]*${kind}=["']${escapedKey}["'])[^>]*>`, "i");
  const tag = `<meta ${kind}="${key}" content="${attrEscape(value)}">`;
  if (existing.test(html)) return html.replace(existing, tag);
  return html.replace("</head>", `${tag}</head>`);
}

for (const relative of targets) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) throw new Error(`Field report social meta v8: thiếu ${relative}`);
  let html = fs.readFileSync(file, "utf8");
  const title = getMeta(html, "property", "og:title") || html.match(/<title>([^<]+)<\/title>/i)?.[1] || "Phóng sự hiện trường nghề mỏ";
  const description = getMeta(html, "property", "og:description") || html.match(/<meta\\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || "Ghi chép nguyên bản từ tư liệu thực địa về hành trình học nghề mỏ và việc làm ngành Than.";
  const canonical = html.match(/<link\\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || "https://thaylinhtuyenthomo.vn/phong-su/";
  const type = relative === "phong-su/index.html" ? "website" : "article";

  html = ensureMeta(html, "property", "og:type", type);
  html = ensureMeta(html, "property", "og:locale", "vi_VN");
  html = ensureMeta(html, "property", "og:site_name", "Thầy Linh – Tuyển Thợ Mỏ");
  html = ensureMeta(html, "property", "og:title", title);
  html = ensureMeta(html, "property", "og:description", description);
  html = ensureMeta(html, "property", "og:url", canonical);
  html = ensureMeta(html, "property", "og:image", socialImage);
  html = ensureMeta(html, "property", "og:image:alt", socialImageAlt);
  html = ensureMeta(html, "name", "twitter:card", "summary");
  html = ensureMeta(html, "name", "twitter:title", title);
  html = ensureMeta(html, "name", "twitter:description", description);
  html = ensureMeta(html, "name", "twitter:image", socialImage);
  html = ensureMeta(html, "name", "twitter:image:alt", socialImageAlt);

  for (const required of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!getMeta(html, "property", required)) throw new Error(`${relative}: thiếu ${required}`);
  }
  for (const required of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!getMeta(html, "name", required)) throw new Error(`${relative}: thiếu ${required}`);
  }
  if (!getMeta(html, "property", "og:image").startsWith("https://") || !getMeta(html, "name", "twitter:image").startsWith("https://")) {
    throw new Error(`${relative}: ảnh chia sẻ phải dùng HTTPS`);
  }
  fs.writeFileSync(file, html);
}

console.log(JSON.stringify({
  status: "field-report-v8-social-meta-ready",
  pages: targets.length,
  socialImage,
  exactVideoThumbnailClaimed: false,
}, null, 2));
