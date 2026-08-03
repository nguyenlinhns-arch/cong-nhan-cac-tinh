import fs from "node:fs";
import path from "node:path";
import {dailyCommunityArticles} from "./daily-community-articles.mjs";

await import("./build-worker-first-home-base.mjs");

const article = [...dailyCommunityArticles].sort((a, b) => new Date(b.published) - new Date(a.published))[0];
const homepagePath = path.resolve("tuyen-tho-mo", "index.html");
const dimensions = JSON.parse(fs.readFileSync(path.resolve("content", "article-image-dimensions.json"), "utf8"));
const [width, height] = dimensions[article.image] || [1200, 675];
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
let html = fs.readFileSync(homepagePath, "utf8");
const card = `<a class="home-library__card home-library__card--latest" href="/${article.urlPath}/">
            <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="${width}" height="${height}">
            <span><small>TIN NGÀNH MỎ MỚI NHẤT</small><strong>${escapeHtml(article.title)}</strong><b>Đọc bài mới →</b></span>
          </a>`;
const marker = /<a class="home-library__card home-library__card--latest"[\s\S]*?<\/a>/;
if (!marker.test(html)) throw new Error("Trang chủ thiếu vị trí bài ngành Than mới nhất.");
html = html.replace(marker, card);
fs.writeFileSync(homepagePath, html);
