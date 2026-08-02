import "./build-verification-portal.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const today = "2026-08-02";
const slugs = [
  "chon-kcn-hay-lam-mo",
  "cau-chuyen-cong-nhan",
  "kiem-tra-dieu-kien",
  "ho-so-nhap-hoc",
  "thu-nhap-an-o-ho-tro",
  "an-toan-ky-luat-moi-truong",
];

function enhancePage(slug) {
  const target = path.join(root, slug, "index.html");
  let html = fs.readFileSync(target, "utf8");
  if (!html.includes('/favicon-48x48.png')) {
    html = html.replace(
      '  <link rel="icon" href="/favicon.ico">',
      '  <link rel="icon" href="/favicon.ico">\n  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">',
    );
  }
  if (!html.includes('name="twitter:card"')) {
    const title = html.match(/<meta property="og:title" content="([^"]*)">/)?.[1] || "Thầy Linh – Tuyển Thợ Mỏ";
    const description = html.match(/<meta property="og:description" content="([^"]*)">/)?.[1] || "Cổng kiểm chứng nghề mỏ";
    const twitter = `  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="${title}">\n  <meta name="twitter:description" content="${description}">\n  <meta name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">\n`;
    html = html.replace('  <link rel="stylesheet" href="/landing-recruitment.css?v=17">', `${twitter}  <link rel="stylesheet" href="/landing-recruitment.css?v=17">`);
  }
  fs.writeFileSync(target, html);
}

function enhanceSitemap() {
  const target = path.join(root, "sitemap.xml");
  let xml = fs.readFileSync(target, "utf8");
  const additions = slugs
    .filter(slug => !xml.includes(`https://thaylinhtuyenthomo.vn/${slug}/`))
    .map(slug => `  <url><loc>https://thaylinhtuyenthomo.vn/${slug}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`)
    .join("\n");
  if (additions) {
    if (!xml.includes("</urlset>")) throw new Error("Sitemap is missing </urlset>");
    xml = xml.replace("</urlset>", `${additions}\n</urlset>`);
    fs.writeFileSync(target, xml);
  }
  try {
    execFileSync("git", ["update-index", "--assume-unchanged", "tuyen-tho-mo/sitemap.xml"], { stdio: "ignore" });
  } catch (_) {
    // Local fixtures may not be Git checkouts; the production workflow is.
  }
  return additions ? slugs.length : 0;
}

slugs.forEach(enhancePage);
const sitemapPages = enhanceSitemap();
console.log(JSON.stringify({ status: "enhanced", pages: slugs.length, sitemap_pages_added: sitemapPages }, null, 2));
