import fs from "node:fs";
import path from "node:path";

const channelId = "UCPDeXtX7koJW_DJ0Lp_iRyg";
const uploadsPlaylistId = "UUPDeXtX7koJW_DJ0Lp_iRyg";
const channelUrl = "https://www.youtube.com/@tapdoanvinacomin";
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
const siteRoot = path.resolve("tuyen-tho-mo");
const dataFile = path.join(siteRoot, "data", "vinacomin-youtube.json");
const pageFile = path.join(siteRoot, "video-tkv", "index.html");
const sitemapFile = path.join(siteRoot, "sitemap.xml");

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tag(xml, name) {
  return decodeXml(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`))?.[1] || "");
}

function classify(title) {
  const normalized = title.toLocaleLowerCase("vi");
  if (/tuyển sinh|lao động|người lao động|công nhân|thợ lò|nhà ở|tặng quà/.test(normalized)) {
    return "Người lao động & tuyển sinh";
  }
  if (/an toàn|atvslđ|khí metan|nổ bụi/.test(normalized)) return "An toàn lao động";
  return "Hoạt động TKV";
}

function replaceBlock(source, startMarker, endMarker, content) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start < 0 || end < 0 || end < start) throw new Error(`Missing generated block: ${startMarker}`);
  return `${source.slice(0, start + startMarker.length)}\n${content}\n${source.slice(end)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" })
    .format(new Date(value));
}

function makeCards(videos) {
  return videos.map((video, index) => `        <article class="tkv-video-card${index === 0 ? " is-current" : ""}" data-video-card>
          <button type="button" class="tkv-video-card__play" data-tkv-video-id="${video.id}" data-tkv-video-title="${escapeHtml(video.title)}" aria-label="Phát video: ${escapeHtml(video.title)}"${index === 0 ? ' aria-current="true"' : ""}>
            <span class="tkv-video-card__thumb"><img src="${video.thumbnail}" alt="Ảnh đại diện video ${escapeHtml(video.title)}" loading="lazy" decoding="async" width="480" height="360"><i aria-hidden="true">▶</i></span>
            <span class="tkv-video-card__content"><small>${escapeHtml(video.category)}</small><strong>${escapeHtml(video.title)}</strong><span>${formatDate(video.published)} · Kênh YouTube TKV chính thức</span></span>
          </button>
          <a href="${video.url}" target="_blank" rel="noopener noreferrer" data-tkv-source-link>Xem video gốc trên YouTube →</a>
        </article>`).join("\n");
}

function makeSchema(videos, syncedAt) {
  const videoObjects = videos.map((video) => ({
    "@type": "VideoObject",
    name: video.title,
    description: `${video.title}. Video từ kênh YouTube chính thức của Tập đoàn Công nghiệp Than - Khoáng sản Việt Nam.`,
    thumbnailUrl: [video.thumbnail],
    uploadDate: video.published,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
    contentUrl: video.url,
    publisher: { "@id": "https://thaylinhtuyenthomo.vn/video-tkv/#tkv" },
  }));
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://thaylinhtuyenthomo.vn/video-tkv/#page",
        url: "https://thaylinhtuyenthomo.vn/video-tkv/",
        name: "Video TKV mới nhất từ kênh Vinacomin chính thức",
        description: "Thư viện video chính thức về sản xuất, an toàn lao động, tuyển sinh, việc làm và đời sống người lao động TKV.",
        inLanguage: "vi-VN",
        dateModified: syncedAt,
        about: { "@id": "https://thaylinhtuyenthomo.vn/video-tkv/#tkv" },
        mainEntity: { "@type": "ItemList", itemListElement: videoObjects.map((item, index) => ({ "@type": "ListItem", position: index + 1, item })) },
      },
      {
        "@type": "Organization",
        "@id": "https://thaylinhtuyenthomo.vn/video-tkv/#tkv",
        name: "Tập đoàn Công nghiệp Than - Khoáng sản Việt Nam",
        alternateName: "TKV - Vinacomin",
        sameAs: [channelUrl],
      },
    ],
  }, null, 2);
}

const response = await fetch(feedUrl, { headers: { "user-agent": "ThayLinhWebsite/1.0 (+https://thaylinhtuyenthomo.vn/)" } });
if (!response.ok) throw new Error(`YouTube feed returned HTTP ${response.status}`);
const xml = await response.text();
const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
  const entry = match[1];
  const id = tag(entry, "yt:videoId");
  const title = tag(entry, "title");
  const published = tag(entry, "published");
  const alternate = entry.match(/<link\s+rel="alternate"\s+href="([^"]+)"\s*\/?\s*>/)?.[1] || `https://www.youtube.com/watch?v=${id}`;
  return {
    id,
    title,
    published,
    updated: tag(entry, "updated"),
    url: decodeXml(alternate),
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    category: classify(title),
  };
}).filter((video) => video.id && video.title && video.published);

if (!videos.length) throw new Error("YouTube feed did not return any public videos");

let existing = null;
if (fs.existsSync(dataFile)) existing = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const comparable = (items) => JSON.stringify((items || []).map(({ id, title, published, updated, url }) => ({ id, title, published, updated, url })));
if (existing && comparable(existing.videos) === comparable(videos)) {
  console.log(`Vinacomin YouTube feed unchanged (${videos.length} latest videos).`);
  process.exit(0);
}

const syncedAt = new Date().toISOString();
const payload = {
  version: 1,
  channel: {
    id: channelId,
    name: "Tập đoàn Công nghiệp Than - Khoáng sản Việt Nam",
    handle: "@tapdoanvinacomin",
    url: channelUrl,
    uploadsPlaylistId,
    feedUrl,
  },
  syncedAt,
  videos,
};

fs.mkdirSync(path.dirname(dataFile), { recursive: true });
fs.writeFileSync(dataFile, `${JSON.stringify(payload, null, 2)}\n`);

let page = fs.readFileSync(pageFile, "utf8");
page = replaceBlock(page, "<!-- VINACOMIN_VIDEO_SCHEMA_START -->", "<!-- VINACOMIN_VIDEO_SCHEMA_END -->", `  <script type="application/ld+json">\n${makeSchema(videos, syncedAt)}\n  </script>`);
page = replaceBlock(page, "<!-- VINACOMIN_VIDEO_LIST_START -->", "<!-- VINACOMIN_VIDEO_LIST_END -->", makeCards(videos));
page = page.replace(/data-feed-date>[^<]*</, `data-feed-date>${formatDate(syncedAt)}<`);
page = page.replace(/data-featured-title>[^<]*</, `data-featured-title>${escapeHtml(videos[0].title)}<`);
page = page.replace(/(data-featured-video-id=")[^"]*(")/, `$1${videos[0].id}$2`);
page = page.replace(/(data-featured-video-title=")[^"]*(")/, `$1${escapeHtml(videos[0].title)}$2`);
page = page.replace(/(data-featured-facade[^>]*aria-label="Phát video: )[^"]*(")/, `$1${escapeHtml(videos[0].title)}$2`);
page = page.replace(/(<img\b(?=[^>]*\bdata-featured-thumbnail\b)[^>]*\bsrc=")[^"]*(")/, `$1${videos[0].thumbnail}$2`);
page = page.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${videos[0].thumbnail}$2`);
page = page.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${videos[0].thumbnail}$2`);
fs.writeFileSync(pageFile, page);

let sitemap = fs.readFileSync(sitemapFile, "utf8");
const lastmod = syncedAt.slice(0, 10);
const videoUrl = "https://thaylinhtuyenthomo.vn/video-tkv/";
if (sitemap.includes(`<loc>${videoUrl}</loc>`)) {
  sitemap = sitemap.replace(new RegExp(`<url><loc>${videoUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/loc><lastmod>[^<]+`), `<url><loc>${videoUrl}</loc><lastmod>${lastmod}`);
} else {
  sitemap = sitemap.replace("</urlset>", `  <url><loc>${videoUrl}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>\n</urlset>`);
}
fs.writeFileSync(sitemapFile, sitemap);

console.log(`Synced ${videos.length} latest videos from ${channelUrl}.`);
