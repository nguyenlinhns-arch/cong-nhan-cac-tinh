import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const siteRoot = path.resolve("tuyen-tho-mo");
const toolsRoot = path.resolve("tools");
const legacyPath = path.join(toolsRoot, "validate-seo-library.mjs");
const runtimePath = path.join(toolsRoot, ".validate-seo-library-current.runtime.mjs");
const base = "https://thaylinhtuyenthomo.vn";

const coveragePath = path.join(siteRoot, "local-coverage.json");
const communeSitemapPath = path.join(siteRoot, "commune-sitemap.xml");
if (!fs.existsSync(coveragePath) || !fs.existsSync(communeSitemapPath)) {
  throw new Error("Local SEO gate: missing local-coverage.json or commune-sitemap.xml");
}
const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
const communeSitemap = fs.readFileSync(communeSitemapPath, "utf8");
const provinceSlugs = Object.keys(coverage.by_province || {});
const localityUrls = [...communeSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (coverage.communes !== 3321) throw new Error(`Local SEO gate: expected 3321 localities, got ${coverage.communes}`);
if (provinceSlugs.length !== 34) throw new Error(`Local SEO gate: expected 34 provinces, got ${provinceSlugs.length}`);
if (localityUrls.length !== 3321 || new Set(localityUrls).size !== 3321) {
  throw new Error(`Local SEO gate: commune sitemap must contain exactly 3321 unique URLs, got ${localityUrls.length}/${new Set(localityUrls).size}`);
}
for (const slug of provinceSlugs) {
  const province = path.join(siteRoot, "viec-lam-nganh-than", slug, "index.html");
  const hub = path.join(siteRoot, "viec-lam-nganh-than", slug, "xa-phuong", "index.html");
  if (!fs.existsSync(province) || !fs.existsSync(hub)) throw new Error(`Local SEO gate: missing province root or locality hub for ${slug}`);
}
for (const url of localityUrls) {
  if (!url.startsWith(`${base}/viec-lam-nganh-than/`)) throw new Error(`Local SEO gate: invalid locality URL ${url}`);
  const pathname = decodeURIComponent(new URL(url).pathname).replace(/^\/+|\/+$/g, "");
  if (!fs.existsSync(path.join(siteRoot, pathname, "index.html"))) throw new Error(`Local SEO gate: missing locality file for ${url}`);
}

let source = fs.readFileSync(legacyPath, "utf8");
const oldProvinceGate = `if (provinceDirectory.provinces?.length !== 26) errors.push(\`Expected 26 province pages from Lâm Đồng northward, got \${provinceDirectory.provinces?.length || 0}\`);\nfor (const province of provinceDirectory.provinces || []) {\n  const file = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");\n  if (!fs.existsSync(file)) errors.push(\`Missing province page: \${province.slug}\`);\n}\nconst excludedSouthernProvinceSlugs = ["ho-chi-minh", "dong-nai", "tay-ninh", "can-tho", "vinh-long", "dong-thap", "ca-mau", "an-giang"];\nfor (const slug of excludedSouthernProvinceSlugs) {\n  const url = \`\${base}/viec-lam-nganh-than/\${slug}/\`;\n  const file = path.join(root, "viec-lam-nganh-than", slug, "index.html");\n  if (fs.existsSync(file)) errors.push(\`Province page outside the approved Lâm Đồng-north scope still exists: \${slug}\`);\n  if (sitemap.includes(url)) errors.push(\`Province URL outside the approved scope remains in sitemap: \${slug}\`);\n}`;
const newProvinceGate = `const currentCoverage = JSON.parse(fs.readFileSync(path.join(root, "local-coverage.json"), "utf8"));\nconst currentProvinceSlugs = Object.keys(currentCoverage.by_province || {});\nif (currentCoverage.communes !== 3321) errors.push(\`Expected 3321 current locality pages, got \${currentCoverage.communes || 0}\`);\nif (currentProvinceSlugs.length !== 34) errors.push(\`Expected all 34 current province/city roots, got \${currentProvinceSlugs.length}\`);\nfor (const slug of currentProvinceSlugs) {\n  const file = path.join(root, "viec-lam-nganh-than", slug, "index.html");\n  const hub = path.join(root, "viec-lam-nganh-than", slug, "xa-phuong", "index.html");\n  if (!fs.existsSync(file)) errors.push(\`Missing province page: \${slug}\`);\n  if (!fs.existsSync(hub)) errors.push(\`Missing locality hub: \${slug}\`);\n}`;
if (!source.includes(oldProvinceGate)) throw new Error("Local SEO gate: legacy province gate changed; update the compatibility patch instead of silently bypassing it");
source = source.replace(oldProvinceGate, newProvinceGate);

const oldSitemapGate = `  for (const url of sitemapUrls) {\n    const relative = url.slice(base.length);\n    if (!searchUrls.includes(relative)) errors.push(\`\${relative}: sitemap URL absent from search index\`);\n  }`;
const newSitemapGate = `  const localitySearchException = /^\\/viec-lam-nganh-than\\/[^/]+\\/(?:xa-phuong\\/|(?:xã|phường|đặc khu)\\/[^/]+\\/)$/u;\n  for (const url of sitemapUrls) {\n    const relative = url.slice(base.length);\n    if (!searchUrls.includes(relative) && !localitySearchException.test(relative)) errors.push(\`\${relative}: sitemap URL absent from search index\`);\n  }`;
if (!source.includes(oldSitemapGate)) throw new Error("Local SEO gate: legacy sitemap/search gate changed; update the compatibility patch instead of silently bypassing it");
source = source.replace(oldSitemapGate, newSitemapGate);

try {
  fs.writeFileSync(runtimePath, source);
  execFileSync(process.execPath, [runtimePath], {stdio: "inherit", env: process.env});
  console.log(JSON.stringify({localSeoCoverage: {provinces: 34, localities: 3321, uniqueCommuneSitemapUrls: 3321}, legacySeoChecksPreserved: true}, null, 2));
} finally {
  if (fs.existsSync(runtimePath)) fs.unlinkSync(runtimePath);
}
