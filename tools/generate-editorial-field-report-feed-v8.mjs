import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const reports = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-field-reports-v8.json"), "utf8"));
const base = "https://thaylinhtuyenthomo.vn";
const hub = `${base}/phong-su/`;
const pages = {
  "gia-lai": {
    slug: "ia-rdeh-gia-lai-con-duong-den-vung-mo",
    description: "Ghi chép hiện trường tại Ia RDeh, Gia Lai: tư vấn nghề mỏ, phối hợp ba bên và câu chuyện gia đình công nhân Kso Sới.",
  },
  "quang-ngai": {
    slug: "quang-ngai-hanh-trinh-den-vung-mo-quang-ninh",
    description: "Ghi chép hành trình từ Quảng Ngãi tới Quảng Ninh: rời quê, đến nơi tiếp nhận, nhập học và kiểm chứng lộ trình học nghề mỏ.",
  },
};

const entries = Object.entries(reports).filter(([slug]) => pages[slug]);
if (!entries.length) throw new Error("Field report feed v8: không có phóng sự để xuất feed");

const xmlEscape = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const articleUrl = (slug) => `${hub}${pages[slug].slug}/`;
const isoDate = (value) => `${value}T00:00:00+07:00`;
const rfcDate = (value) => new Date(`${value}T00:00:00+07:00`).toUTCString();
const latest = entries.map(([, report]) => report.dateModified).sort().at(-1);

const rssItems = entries.map(([slug, report]) => `    <item>
      <title>${xmlEscape(report.title)}</title>
      <link>${xmlEscape(articleUrl(slug))}</link>
      <guid isPermaLink="true">${xmlEscape(articleUrl(slug))}</guid>
      <description>${xmlEscape(pages[slug].description)}</description>
      <pubDate>${xmlEscape(rfcDate(report.dateModified))}</pubDate>
      <category>Phóng sự hiện trường</category>
      <author>Nguyễn Tử Linh</author>
    </item>`).join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Phóng sự hiện trường – Thầy Linh Tuyển Thợ Mỏ</title>
    <link>${hub}</link>
    <description>Ghi chép nguyên bản từ chuyến công tác, video thực địa và hành trình người lao động tới vùng mỏ Quảng Ninh.</description>
    <language>vi-VN</language>
    <lastBuildDate>${rfcDate(latest)}</lastBuildDate>
    <atom:link href="${hub}feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;

const jsonFeed = {
  version: "https://jsonfeed.org/version/1.1",
  title: "Phóng sự hiện trường – Thầy Linh Tuyển Thợ Mỏ",
  home_page_url: hub,
  feed_url: `${hub}feed.json`,
  description: "Ghi chép nguyên bản từ chuyến công tác, video thực địa và hành trình người lao động tới vùng mỏ Quảng Ninh.",
  language: "vi-VN",
  authors: [{name: "Nguyễn Tử Linh", url: `${base}/tac-gia/nguyen-tu-linh/`}],
  items: entries.map(([slug, report]) => ({
    id: articleUrl(slug),
    url: articleUrl(slug),
    title: report.title,
    summary: pages[slug].description,
    date_published: isoDate(report.dateModified),
    date_modified: isoDate(report.dateModified),
    authors: [{name: "Nguyễn Tử Linh", url: `${base}/tac-gia/nguyen-tu-linh/`}],
    tags: ["Phóng sự hiện trường", pages[slug].slug.includes("gia-lai") ? "Gia Lai" : "Quảng Ngãi", "nghề mỏ", "tư liệu nguyên bản"],
    external_url: report.videoUrl,
  })),
};

const feedDir = path.join(root, "phong-su");
fs.mkdirSync(feedDir, {recursive: true});
fs.writeFileSync(path.join(feedDir, "feed.xml"), rss);
fs.writeFileSync(path.join(feedDir, "feed.json"), `${JSON.stringify(jsonFeed, null, 2)}\n`);

const targetPages = [
  path.join(feedDir, "index.html"),
  ...entries.map(([slug]) => path.join(feedDir, pages[slug].slug, "index.html")),
];
for (const file of targetPages) {
  if (!fs.existsSync(file)) throw new Error(`Field report feed v8: thiếu HTML ${path.relative(root, file)}`);
  let html = fs.readFileSync(file, "utf8");
  html = html
    .replace(/<link\b[^>]*data-field-report-feed-v8[^>]*>\s*/gi, "")
    .replace("</head>", `<link data-field-report-feed-v8 rel="alternate" type="application/rss+xml" title="Phóng sự hiện trường – RSS" href="/phong-su/feed.xml"><link data-field-report-feed-v8 rel="alternate" type="application/feed+json" title="Phóng sự hiện trường – JSON Feed" href="/phong-su/feed.json"></head>`);
  fs.writeFileSync(file, html);
}

console.log(JSON.stringify({
  status: "field-report-v8-feeds-ready",
  items: entries.length,
  rss: "/phong-su/feed.xml",
  jsonFeed: "/phong-su/feed.json",
  pagesLinked: targetPages.length,
}, null, 2));
