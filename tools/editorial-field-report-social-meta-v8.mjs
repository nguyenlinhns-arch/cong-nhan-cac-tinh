import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const socialImage = `${base}/assets/thay-linh-avatar.webp`;
const socialImageAlt = "Thầy Linh – Tuyển Thợ Mỏ, nguồn phóng sự hiện trường";
const targets = [
  "phong-su/index.html",
  "phong-su/ia-rdeh-gia-lai-con-duong-den-vung-mo/index.html",
  "phong-su/quang-ngai-hanh-trinh-den-vung-mo-quang-ninh/index.html",
];

function attrEscape(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function attributes(tag = "") {
  return Object.fromEntries([...String(tag).matchAll(/([^\s=/>]+)\s*=\s*(["'])(.*?)\2/gis)]
    .map((match) => [match[1].toLowerCase(), match[3]]));
}

function getMeta(html, kind, key) {
  for (const match of String(html).matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (attrs[kind] === key) return attrs.content || "";
  }
  return "";
}

function ensureMeta(html, kind, key, value) {
  const tags = [...String(html).matchAll(/<meta\b[^>]*>/gi)];
  const target = tags.find((match) => attributes(match[0])[kind] === key);
  const tag = `<meta ${kind}="${key}" content="${attrEscape(value)}">`;
  if (target) return html.slice(0, target.index) + tag + html.slice(target.index + target[0].length);
  return html.replace("</head>", `${tag}</head>`);
}

function canonicalFor(relative) {
  if (relative === "phong-su/index.html") return `${base}/phong-su/`;
  if (!relative.endsWith("/index.html")) throw new Error(`${relative}: đường dẫn phóng sự không kết thúc bằng /index.html`);
  return `${base}/${relative.slice(0, -"index.html".length)}`;
}

for (const relative of targets) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) throw new Error(`Field report social meta v8: thiếu ${relative}`);
  let html = fs.readFileSync(file, "utf8");
  const title = getMeta(html, "property", "og:title") || html.match(/<title>([^<]+)<\/title>/i)?.[1] || "Phóng sự hiện trường nghề mỏ";
  const description = getMeta(html, "property", "og:description") || getMeta(html, "name", "description") || "Ghi chép nguyên bản từ tư liệu thực địa về hành trình học nghề mỏ và việc làm ngành Than.";
  const canonical = canonicalFor(relative);
  const declaredCanonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]
    || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)?.[1]
    || "";
  if (declaredCanonical !== canonical) throw new Error(`${relative}: canonical ${declaredCanonical || "missing"} phải là ${canonical}`);
  const type = relative === "phong-su/index.html" ? "website" : "article";

  html = ensureMeta(html, "property", "og:type", type);
  html = ensureMeta(html, "property", "og:locale", "vi_VN");
  html = ensureMeta(html, "property", "og:site_name", "Thầy Linh – Tuyển Thợ Mỏ");
  html = ensureMeta(html, "property", "og:title", title);
  html = ensureMeta(html, "property", "og:description", description);
  html = ensureMeta(html, "property", "og:url", canonical);
  html = ensureMeta(html, "property", "og:image", socialImage);
  html = ensureMeta(html, "property", "og:image:alt", socialImageAlt);
  html = ensureMeta(html, "name", "twitter:card", "summary_large_image");
  html = ensureMeta(html, "name", "twitter:title", title);
  html = ensureMeta(html, "name", "twitter:description", description);
  html = ensureMeta(html, "name", "twitter:image", socialImage);
  html = ensureMeta(html, "name", "twitter:image:alt", socialImageAlt);

  for (const required of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!getMeta(html, "property", required)) throw new Error(`${relative}: thiếu ${required}`);
  }
  if (getMeta(html, "property", "og:url") !== canonical) throw new Error(`${relative}: og:url chưa khớp canonical`);
  for (const required of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!getMeta(html, "name", required)) throw new Error(`${relative}: thiếu ${required}`);
  }
  if (getMeta(html, "name", "twitter:card") !== "summary_large_image") throw new Error(`${relative}: twitter:card phải là summary_large_image`);
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
  twitterCard: "summary_large_image",
}, null, 2));
