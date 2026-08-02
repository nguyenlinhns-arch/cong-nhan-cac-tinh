import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const errors = [];
const legacyRoutes = JSON.parse(fs.readFileSync(path.resolve("operations/legacy-routes.json"), "utf8")).routes || [];
const legacyRouteByFile = new Map(legacyRoutes.map((route) => [
  `${route.from.replace(/^\/+|\/+$/g, "")}/index.html`,
  route,
]));

function collectFiles(directory, predicate, output = []) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(full, predicate, output);
    else if (predicate(full)) output.push(full);
  }
  return output;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([^\s=/>]+)\s*=\s*(["'])(.*?)\2/gis)]
    .map((match) => [match[1].toLowerCase(), match[3]]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => attributes(match[0]));
}

function meta(html, key, value) {
  return tags(html, "meta").find((item) => item[key] === value)?.content || "";
}

function publicUrl(file) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  if (relative === "index.html") return `${base}/`;
  if (relative.endsWith("/index.html")) return `${base}/${relative.slice(0, -"/index.html".length)}/`;
  return `${base}/${relative}`;
}

function localFile(sourceFile, rawUrl) {
  if (!rawUrl || /^(?:#|mailto:|tel:|sms:|javascript:|data:)/i.test(rawUrl)) return null;
  let value = rawUrl;
  if (/^https?:\/\//i.test(value)) {
    if (!value.startsWith(`${base}/`) && value !== base) return null;
    value = value.slice(base.length) || "/";
  } else if (value.startsWith("//")) return null;
  value = value.split("#", 1)[0].split("?", 1)[0];
  if (!value) return null;
  try { value = decodeURIComponent(value); } catch { /* Preserve malformed text for the existence check. */ }
  let target = value.startsWith("/")
    ? path.join(root, value.slice(1))
    : path.resolve(path.dirname(sourceFile), value);
  if (!target.startsWith(root)) return null;
  if (value.endsWith("/") || (fs.existsSync(target) && fs.statSync(target).isDirectory())) target = path.join(target, "index.html");
  return target;
}

function pngDimensions(file) {
  const data = fs.readFileSync(file);
  const signature = "89504e470d0a1a0a";
  if (data.length < 24 || data.subarray(0, 8).toString("hex") !== signature) return null;
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

const cname = fs.readFileSync(path.join(root, "CNAME"), "utf8").trim();
if (cname !== "thaylinhtuyenthomo.vn") errors.push(`CNAME must remain thaylinhtuyenthomo.vn, got ${cname || "empty"}`);

const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${base}/sitemap.xml`)) errors.push("robots.txt does not advertise the canonical sitemap URL");
if (/Disallow:\s*\//i.test(robots)) errors.push("robots.txt blocks the whole website");

const faviconSpecs = new Map([
  ["favicon-48x48.png", [48, 48]],
  ["favicon-192x192.png", [192, 192]],
  ["favicon-512x512.png", [512, 512]],
  ["apple-touch-icon.png", [180, 180]],
]);
for (const [name, expected] of faviconSpecs) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) {
    errors.push(`Missing favicon asset: ${name}`);
    continue;
  }
  const actual = pngDimensions(file);
  if (!actual || actual[0] !== expected[0] || actual[1] !== expected[1]) {
    errors.push(`${name}: expected ${expected.join("x")} PNG, got ${actual ? actual.join("x") : "invalid PNG"}`);
  }
}

const icoFile = path.join(root, "favicon.ico");
if (!fs.existsSync(icoFile)) {
  errors.push("Missing root favicon.ico");
} else {
  const ico = fs.readFileSync(icoFile);
  if (ico.length < 6 || ico.readUInt16LE(0) !== 0 || ico.readUInt16LE(2) !== 1 || ico.readUInt16LE(4) < 1) {
    errors.push("favicon.ico is not a valid multi-size icon container");
  }
}

try {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
  const manifestIcons = new Map((manifest.icons || []).map((item) => [item.src, item]));
  for (const [src, sizes] of [["/favicon-192x192.png", "192x192"], ["/favicon-512x512.png", "512x512"]]) {
    const icon = manifestIcons.get(src);
    if (!icon || icon.sizes !== sizes || icon.type !== "image/png") errors.push(`manifest.webmanifest is missing ${src} (${sizes}, image/png)`);
  }
} catch (error) {
  errors.push(`Invalid manifest.webmanifest: ${error.message}`);
}

const sitemapText = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapUrls);
if (!sitemapUrls.length) errors.push("sitemap.xml has no URLs");
if (sitemapSet.size !== sitemapUrls.length) errors.push("sitemap.xml contains duplicate URLs");
for (const url of sitemapUrls) {
  if (!url.startsWith(`${base}/`)) errors.push(`Non-canonical sitemap URL: ${url}`);
  if (/[?#]/.test(url)) errors.push(`Sitemap URL contains a query or fragment: ${url}`);
}

const htmlFiles = collectFiles(root, (file) => file.endsWith(".html"));
const indexableUrls = new Set();
let jsonLdBlocks = 0;

for (const file of htmlFiles) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  if (/^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  const html = fs.readFileSync(file, "utf8");
  if (/\bNaN\b|NaNmNaN/u.test(html)) errors.push(`${relative}: contains an invalid numeric placeholder`);
  const expected = publicUrl(file);
  const legacyRoute = legacyRouteByFile.get(relative);
  const expectedCanonical = legacyRoute ? `${base}${legacyRoute.to}` : expected;
  const robotsMeta = meta(html, "name", "robots").toLowerCase();
  const indexable = !robotsMeta.includes("noindex");
  const pageTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
  const description = meta(html, "name", "description");
  const canonicalLinks = tags(html, "link").filter((item) => item.rel?.split(/\s+/).includes("canonical"));
  const canonical = canonicalLinks[0]?.href || "";
  const ogTitle = meta(html, "property", "og:title");
  const ogDescription = meta(html, "property", "og:description");
  const ogUrl = meta(html, "property", "og:url");
  const ogImage = meta(html, "property", "og:image");
  const twitterCard = meta(html, "name", "twitter:card");
  const twitterTitle = meta(html, "name", "twitter:title");
  const twitterDescription = meta(html, "name", "twitter:description");
  const twitterImage = meta(html, "name", "twitter:image");
  const jsonScripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const linkTags = tags(html, "link");
  const faviconHrefs = new Set(linkTags.filter((item) => item.rel?.split(/\s+/).includes("icon")).map((item) => item.href));
  const appleIcon = linkTags.find((item) => item.rel === "apple-touch-icon")?.href || "";

  if (!pageTitle) errors.push(`${relative}: missing title`);
  if (!description) errors.push(`${relative}: missing meta description`);
  if (canonicalLinks.length !== 1) errors.push(`${relative}: expected exactly one canonical, got ${canonicalLinks.length}`);
  if (canonical !== expectedCanonical) errors.push(`${relative}: canonical ${canonical || "missing"} must be ${expectedCanonical}`);
  if (!faviconHrefs.has("/favicon.ico")) errors.push(`${relative}: missing stable /favicon.ico declaration`);
  if (!faviconHrefs.has("/favicon-48x48.png")) errors.push(`${relative}: missing 48x48 PNG favicon declaration`);
  if (appleIcon !== "/apple-touch-icon.png") errors.push(`${relative}: missing apple-touch-icon declaration`);
  if ([...faviconHrefs].some((href) => href?.startsWith("//"))) errors.push(`${relative}: protocol-relative favicon URL is not allowed`);

  if (indexable) {
    indexableUrls.add(expected);
    if (!robotsMeta.includes("index") || !robotsMeta.includes("follow")) errors.push(`${relative}: indexable page needs an explicit index,follow directive`);
    if (!ogTitle || !ogDescription || !ogUrl || !ogImage) errors.push(`${relative}: incomplete Open Graph metadata`);
    if (ogUrl !== expected) errors.push(`${relative}: og:url ${ogUrl || "missing"} must be ${expected}`);
    if (!ogImage.startsWith("https://")) errors.push(`${relative}: og:image must use HTTPS`);
    if (twitterCard !== "summary_large_image" || !twitterTitle || !twitterDescription || !twitterImage) errors.push(`${relative}: incomplete Twitter/X metadata`);
    if (!twitterImage.startsWith("https://")) errors.push(`${relative}: twitter:image must use HTTPS`);
    if (!jsonScripts.length) errors.push(`${relative}: missing JSON-LD`);
  }

  if (legacyRoute) {
    const refresh = tags(html, "meta").find((item) => item["http-equiv"]?.toLowerCase() === "refresh")?.content || "";
    if (indexable) errors.push(`${relative}: legacy compatibility page must be noindex`);
    if (!html.includes("data-legacy-redirect")) errors.push(`${relative}: missing legacy redirect marker`);
    if (!refresh.includes(`url=${legacyRoute.to}`)) errors.push(`${relative}: meta refresh must point to ${legacyRoute.to}`);
    if (sitemapSet.has(expected)) errors.push(`${relative}: legacy URL must stay out of sitemap`);
    const targetFile = localFile(file, legacyRoute.to);
    const targetHtml = targetFile && fs.existsSync(targetFile) ? fs.readFileSync(targetFile, "utf8") : "";
    const targetNoindex = meta(targetHtml, "name", "robots").toLowerCase().includes("noindex");
    const targetInSitemap = sitemapSet.has(`${base}${legacyRoute.to}`);
    if (!targetFile || !targetHtml) errors.push(`${relative}: canonical target file is missing`);
    if (legacyRoute.targetIndexable === false) {
      if (targetInSitemap || !targetNoindex) errors.push(`${relative}: target must remain noindex until it has unique local evidence`);
    } else if (!targetInSitemap || targetNoindex) {
      errors.push(`${relative}: canonical target is missing from sitemap or unexpectedly noindex`);
    }
  }

  for (const [index, script] of jsonScripts.entries()) {
    jsonLdBlocks += 1;
    try { JSON.parse(script[1]); } catch (error) { errors.push(`${relative}: invalid JSON-LD block ${index + 1}: ${error.message}`); }
  }

  for (const [tagName, attributeName] of [["a", "href"], ["link", "href"], ["script", "src"], ["img", "src"]]) {
    for (const item of tags(html, tagName)) {
      const target = localFile(file, item[attributeName]);
      if (target && !fs.existsSync(target)) errors.push(`${relative}: broken internal ${tagName} URL ${item[attributeName]}`);
    }
  }
}

for (const url of indexableUrls) if (!sitemapSet.has(url)) errors.push(`Indexable page missing from sitemap: ${url}`);
for (const url of sitemapUrls) if (!indexableUrls.has(url)) errors.push(`Sitemap URL is missing, non-canonical or noindex: ${url}`);

const feedJson = JSON.parse(fs.readFileSync(path.join(root, "feed.json"), "utf8"));
if (feedJson.home_page_url !== `${base}/`) errors.push("JSON Feed has a non-canonical home_page_url");
if (feedJson.feed_url !== `${base}/feed.json`) errors.push("JSON Feed has a non-canonical feed_url");
for (const item of feedJson.items || []) {
  if (!sitemapSet.has(item.url)) errors.push(`JSON Feed item missing from sitemap: ${item.url}`);
  if (item.id !== item.url) errors.push(`JSON Feed item id and URL differ: ${item.url}`);
}

const feedXml = fs.readFileSync(path.join(root, "feed.xml"), "utf8");
const rssUrls = [...feedXml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)].map((match) => match[1]);
for (const url of rssUrls) if (!sitemapSet.has(url)) errors.push(`RSS item missing from sitemap: ${url}`);
if (rssUrls.length !== (feedJson.items || []).length) errors.push(`RSS and JSON Feed item counts differ: ${rssUrls.length} vs ${(feedJson.items || []).length}`);

const textFiles = collectFiles(root, (file) => /\.(?:html?|xml|json|txt|js|css|webmanifest|md)$/i.test(file));
for (const file of textFiles) {
  const text = fs.readFileSync(file, "utf8");
  if (/https?:\/\/nguyenlinhns-arch\.github\.io\/cong-nhan-cac-tinh/i.test(text)) {
    errors.push(`${path.relative(root, file)}: contains an obsolete GitHub Pages URL`);
  }
}

console.log(JSON.stringify({
  htmlPages: htmlFiles.length,
  indexablePages: indexableUrls.size,
  sitemapUrls: sitemapUrls.length,
  jsonLdBlocks,
  rssItems: rssUrls.length,
  jsonFeedItems: feedJson.items?.length || 0,
  errors: errors.length,
}, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
