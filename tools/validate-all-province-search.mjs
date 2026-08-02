import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const searchIndex = JSON.parse(fs.readFileSync(path.join(root, "search-index.json"), "utf8"));
const provinceData = JSON.parse(fs.readFileSync(path.join(root, "data", "provinces-2026.json"), "utf8"));
const provinces = Array.isArray(provinceData.provinces) ? provinceData.provinces : [];
const script = fs.readFileSync(path.join(root, "mobile-ux.js"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const errors = [];
const window = {};

vm.runInNewContext(script, {
  window,
  process: { env: { TL_SEARCH_TEST_ONLY: "1" } },
  location: {
    href: "https://thaylinhtuyenthomo.vn/",
    origin: "https://thaylinhtuyenthomo.vn",
    pathname: "/",
  },
  URL,
  URLSearchParams,
}, { filename: "mobile-ux.js" });

const api = window.__TL_SEARCH_INTERNALS__;
if (!api || typeof api.scoreItem !== "function") throw new Error("Không tải được lõi xếp hạng tìm kiếm theo tỉnh");
if (searchIndex.version !== 3 || !Array.isArray(searchIndex.items)) throw new Error("Chỉ mục tìm kiếm theo tỉnh không hợp lệ");
if (provinces.length !== 26) errors.push(`Dữ liệu nguồn cần 26 tỉnh, nhận ${provinces.length}`);

function rank(query) {
  return searchIndex.items
    .map((item) => ({ item, score: api.scoreItem(item, query) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title, "vi"));
}

let publicProvinces = 0;
let internalProvinces = 0;
let locationQueries = 0;
const queryResults = [];

for (const province of provinces) {
  const url = `/viec-lam-nganh-than/${province.slug}/`;
  const matches = searchIndex.items.filter((item) => item.url === url);
  if (matches.length !== 1) {
    errors.push(`${province.name}: cần đúng một mục tìm kiếm, nhận ${matches.length}`);
    continue;
  }
  const item = matches[0];
  if (item.category !== "province" || item.categoryLabel !== "Việc làm theo tỉnh") {
    errors.push(`${province.name}: phân loại tìm kiếm chưa đúng`);
  }

  const pagePath = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");
  if (!fs.existsSync(pagePath)) {
    errors.push(`${province.name}: thiếu trang địa phương`);
    continue;
  }
  const html = fs.readFileSync(pagePath, "utf8");
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const expectedScope = noindex ? "internal" : "public";
  if (item.searchScope !== expectedScope) {
    errors.push(`${province.name}: searchScope cần ${expectedScope}, nhận ${item.searchScope || "trống"}`);
  }
  if (noindex) {
    internalProvinces += 1;
    const canonical = `https://thaylinhtuyenthomo.vn${url}`;
    if (sitemap.includes(canonical)) errors.push(`${province.name}: trang noindex không được xuất hiện trong sitemap`);
  } else {
    publicProvinces += 1;
  }

  const locations = [province.name, ...(Array.isArray(province.aliases) ? province.aliases : [])];
  for (const location of locations) {
    const query = `ở ${location} có tuyển không`;
    const ranked = rank(query);
    const actual = ranked[0]?.item?.url || null;
    queryResults.push({ query, expected_url: url, actual_url: actual });
    locationQueries += 1;
    if (actual !== url) errors.push(`${query}: cần ${url}, nhận ${actual || "không có kết quả"}`);
  }
}

const localityCases = [
  ["Mường Lát", "thanh-hoa"],
  ["Lang Chánh", "thanh-hoa"],
  ["Anh Sơn", "nghe-an"],
  ["Hướng Hóa", "quang-tri"],
  ["K'Bang", "gia-lai"],
  ["Bình Liêu", "quang-ninh"],
  ["Bằng Thành", "thai-nguyen"],
  ["Phúc Lộc", "thai-nguyen"],
  ["Bát Xát", "lao-cai"],
  ["Bảo Lạc", "cao-bang"],
  ["Sông Mã", "son-la"],
  ["Tủa Chùa", "dien-bien"],
];
const localityResults = [];
for (const [locality, slug] of localityCases) {
  const expectedUrl = `/viec-lam-nganh-than/${slug}/`;
  const query = `tôi ở ${locality}`;
  const actualUrl = rank(query)[0]?.item?.url || null;
  localityResults.push({ query, expected_url: expectedUrl, actual_url: actualUrl });
  if (actualUrl !== expectedUrl) errors.push(`${query}: cần ${expectedUrl}, nhận ${actualUrl || "không có kết quả"}`);
  const item = searchIndex.items.find((candidate) => candidate.url === expectedUrl);
  if (!item || Number(item.localityEvidenceCount || 0) < 1) errors.push(`${locality}: trang ${slug} chưa có dấu vết địa phương trong chỉ mục`);
}

const provinceItems = searchIndex.items.filter((item) => item.category === "province");
if (provinceItems.length !== provinces.length) errors.push(`Chỉ mục cần ${provinces.length} trang tỉnh, nhận ${provinceItems.length}`);
if (publicProvinces + internalProvinces !== provinces.length) {
  errors.push(`Tổng phạm vi tìm kiếm tỉnh không khớp: public ${publicProvinces}, internal ${internalProvinces}`);
}
if (!internalProvinces) errors.push("Cần có trang tỉnh noindex chỉ xuất hiện trong tìm kiếm nội bộ");
if (Buffer.byteLength(JSON.stringify(searchIndex)) > 300_000) errors.push("search-index.json vượt ngân sách 300 KB");
if (Buffer.byteLength(script) > 42_000) errors.push(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(script)}`);

for (const forbidden of ["full_name", "birth_date", "health_screen", "consent", "phone_number"]) {
  if (JSON.stringify(provinceItems).includes(forbidden)) errors.push(`Chỉ mục tỉnh không được chứa trường cá nhân ${forbidden}`);
}

console.log(JSON.stringify({
  provinces_checked: provinces.length,
  province_items: provinceItems.length,
  public_provinces: publicProvinces,
  internal_provinces: internalProvinces,
  province_and_alias_queries: locationQueries,
  locality_queries: localityCases.length,
  locality_evidence_phrases: provinceItems.reduce((total, item) => total + Number(item.localityEvidenceCount || 0), 0),
  sample_province_queries: queryResults.filter((_, index) => index < 8),
  locality_results: localityResults,
  search_index_bytes: Buffer.byteLength(JSON.stringify(searchIndex)),
  errors,
}, null, 2));

if (errors.length) process.exit(1);
