import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const intentMap = JSON.parse(fs.readFileSync(path.resolve("content/search-intent-map.json"), "utf8"));
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
const errors = [];

const decode = (value = "") => String(value)
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#39;", "'")
  .replaceAll("&nbsp;", " ");
const text = (value = "") => decode(value)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const normalize = (value = "") => text(value).normalize("NFC").toLocaleLowerCase("vi");
const capture = (html, expression) => decode(html.match(expression)?.[1] || "").trim();
const pageFile = (landing) => landing === "/"
  ? path.join(root, "index.html")
  : path.join(root, landing.replace(/^\/+|\/+$/g, ""), "index.html");
const expectedCanonical = (landing) => `${base}${landing}`;
const requireTerms = (value, terms, label) => {
  const haystack = normalize(value);
  for (const term of terms || []) {
    if (!haystack.includes(normalize(term))) errors.push(`${label}: thiếu cụm “${term}”`);
  }
};

const owners = new Map();
const landings = new Set();
const titles = new Map();
const descriptions = new Map();

for (const cluster of intentMap.clusters || []) {
  if (landings.has(cluster.landing)) errors.push(`Bản đồ ý định: URL ${cluster.landing} được gán nhiều lần`);
  landings.add(cluster.landing);

  for (const query of [cluster.primary, ...(cluster.variants || [])]) {
    const key = normalize(query);
    if (owners.has(key)) errors.push(`Bản đồ ý định: “${query}” trùng giữa ${owners.get(key)} và ${cluster.id}`);
    owners.set(key, cluster.id);
  }

  const file = pageFile(cluster.landing);
  if (!fs.existsSync(file)) {
    errors.push(`${cluster.id}: thiếu trang ${cluster.landing}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const title = text(capture(html, /<title>([\s\S]*?)<\/title>/i));
  const description = capture(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const h1 = text(capture(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
  const canonical = capture(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const robotsMeta = capture(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  const visible = text(html);

  if (title.length < 25 || title.length > 70) errors.push(`${cluster.id}: title dài ${title.length} ký tự, cần trong khoảng 25–70`);
  if (description.length < 90 || description.length > 165) errors.push(`${cluster.id}: meta description dài ${description.length} ký tự, cần trong khoảng 90–165`);
  if (!h1) errors.push(`${cluster.id}: thiếu H1`);
  if (canonical !== expectedCanonical(cluster.landing)) errors.push(`${cluster.id}: canonical không đúng (${canonical || "thiếu"})`);
  if (/noindex/i.test(robotsMeta) || !/index/i.test(robotsMeta)) errors.push(`${cluster.id}: trang đích không ở trạng thái index,follow`);
  if (!sitemap.includes(`<loc>${expectedCanonical(cluster.landing)}</loc>`)) errors.push(`${cluster.id}: URL không có trong sitemap`);
  requireTerms(title, cluster.titleTerms, `${cluster.id} title`);
  requireTerms(h1, cluster.h1Terms, `${cluster.id} H1`);
  requireTerms(visible, cluster.visibleTerms, `${cluster.id} nội dung`);

  const titleKey = normalize(title);
  const descriptionKey = normalize(description);
  if (titles.has(titleKey)) errors.push(`${cluster.id}: title trùng ${titles.get(titleKey)}`);
  if (descriptions.has(descriptionKey)) errors.push(`${cluster.id}: meta description trùng ${descriptions.get(descriptionKey)}`);
  titles.set(titleKey, cluster.id);
  descriptions.set(descriptionKey, cluster.id);
}

const provinceRoot = path.join(root, "viec-lam-nganh-than");
let indexableProvincePages = 0;
for (const entry of fs.readdirSync(provinceRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(provinceRoot, entry.name, "index.html");
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const robotsMeta = capture(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  if (/noindex/i.test(robotsMeta)) continue;
  indexableProvincePages += 1;
  const title = text(capture(html, /<title>([\s\S]*?)<\/title>/i));
  const h1 = text(capture(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
  const province = title.match(/^Tuyển thợ mỏ tại (.+?) \|/i)?.[1];
  if (!province) {
    errors.push(`Trang tỉnh ${entry.name}: title chưa theo mẫu “Tuyển thợ mỏ tại {tỉnh}”`);
    continue;
  }
  requireTerms(title, intentMap.provincePattern.titleTerms.map((term) => term.replace("{province}", province)), `Trang tỉnh ${province} title`);
  requireTerms(h1, intentMap.provincePattern.h1Terms.map((term) => term.replace("{province}", province)), `Trang tỉnh ${province} H1`);
  const landing = `/viec-lam-nganh-than/${entry.name}/`;
  if (!sitemap.includes(`<loc>${expectedCanonical(landing)}</loc>`)) errors.push(`Trang tỉnh ${province}: thiếu trong sitemap`);
}

if (indexableProvincePages < intentMap.provincePattern.minimumIndexablePages) {
  errors.push(`Trang tỉnh: chỉ có ${indexableProvincePages} trang indexable, cần ít nhất ${intentMap.provincePattern.minimumIndexablePages}`);
}
if (!/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i.test(robots)) errors.push("robots.txt: chưa cho OAI-SearchBot truy cập rõ ràng");
for (const marker of [
  "## Trang trả lời theo nhu cầu tìm kiếm",
  `${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/`,
  `${base}/hoc-nghe-mo-tai-quang-ninh/`,
  `${base}/thu-nhap-an-o-ho-tro/`,
  `${base}/viec-lam-nganh-than/`,
]) {
  if (!llms.includes(marker)) errors.push(`llms.txt: thiếu ${marker}`);
}

console.log(JSON.stringify({
  clusters: intentMap.clusters.length,
  ownedQueries: owners.size,
  indexableProvincePages,
  errors: errors.length,
  sampleErrors: errors.slice(0, 30),
}, null, 2));
if (errors.length) process.exitCode = 1;
