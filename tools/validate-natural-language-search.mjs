import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const script = fs.readFileSync(path.join(root, "mobile-ux.js"), "utf8");
const searchIndex = JSON.parse(fs.readFileSync(path.join(root, "search-index.json"), "utf8"));
const window = {};
const errors = [];

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
if (!api || typeof api.scoreItem !== "function" || typeof api.oneEditApart !== "function") {
  throw new Error("Không tải được lõi kiểm thử tìm kiếm tự nhiên");
}
if (searchIndex.version !== 3 || !Array.isArray(searchIndex.items)) {
  throw new Error(`Chỉ mục tìm kiếm không đúng phiên bản 3: ${searchIndex.version}`);
}

for (const marker of [
  "const SEARCH_STOP_WORDS = new Set([",
  "const SEARCH_INTENTS = [",
  "function meaningfulQueryTerms(value)",
  "function queryIntentScores(value)",
  "function provinceAliases(item)",
  "function oneEditApart(left, right)",
  "function scoreItem(item, rawQuery)",
  "Gõ cả câu, ví dụ: lương bao nhiêu?",
]) {
  if (!script.includes(marker)) errors.push(`JavaScript thiếu ${marker}`);
}

for (const forbidden of [
  "search-test=1",
  "window.thayLinhSearchTest",
  "search_query:",
  "query_text:",
  "track(\"worker_search_query\"",
  "track('worker_search_query'",
]) {
  if (script.includes(forbidden)) errors.push(`Không được lộ hoặc gửi nội dung người dùng gõ: ${forbidden}`);
}

const directUrls = [
  "/#dieu-kien",
  "/#quyen-loi",
  "/#thoi-gian-hoc",
  "/#ho-tro-hoc-nghe",
  "/#ho-so",
  "/#dia-diem",
  "/#noi-lam-viec",
  "/#quy-trinh",
  "/#dang-ky",
];
for (const url of directUrls) {
  if (!searchIndex.items.some((item) => item.url === url && item.priority >= 200)) {
    errors.push(`Thiếu câu trả lời nhanh ${url}`);
  }
}

function rank(query) {
  return searchIndex.items
    .map((item) => ({ item, score: api.scoreItem(item, query) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title, "vi"));
}

const cases = [
  ["39 tuổi có đi được không", "/#dieu-kien"],
  ["toi 39 tuoi co di duoc ko", "/#dieu-kien"],
  ["40 tuổi có đi được không", "/#dieu-kien"],
  ["1m52 có được không", "/#dieu-kien"],
  ["47 cân", "/#dieu-kien"],
  ["bị cận có đi được không", "/#dieu-kien"],
  ["nữ có đăng ký được không", "/#dieu-kien"],
  ["không có bằng có đi được không", "/#ho-so"],
  ["không có bằng cấp 2", "/#ho-so"],
  ["không có bằng tiểu học", "/#ho-so"],
  ["cần giấy tờ gì", "/#ho-so"],
  ["hso can gi", "/#ho-so"],
  ["ho so gom gi", "/#ho-so"],
  ["lương bao nhiêu", "/#quyen-loi"],
  ["luong bn", "/#quyen-loi"],
  ["luongg", "/#quyen-loi"],
  ["học mấy tháng", "/#thoi-gian-hoc"],
  ["hoc may thag", "/#thoi-gian-hoc"],
  ["co dien mo hoc bao lau", "/#thoi-gian-hoc"],
  ["có mất tiền học không", "/#ho-tro-hoc-nghe"],
  ["có phải đóng học phí không", "/#ho-tro-hoc-nghe"],
  ["an o the nao", "/#ho-tro-hoc-nghe"],
  ["học ở đâu", "/#dia-diem"],
  ["làm ở đâu", "/#noi-lam-viec"],
  ["đăng ký như nào", "/#quy-trinh"],
  ["bao giờ đi học", "/#quy-trinh"],
  ["sđt thầy linh", "/#dang-ky"],
  ["số điện thoại zalo", "/#dang-ky"],
  ["ở Nghệ An", "/viec-lam-nganh-than/nghe-an/"],
  ["Thanh Hóa có tuyển không", "/viec-lam-nganh-than/thanh-hoa/"],
  ["việc làm quảng trị", "/viec-lam-nganh-than/quang-tri/"],
  ["quê quảng bình", "/viec-lam-nganh-than/quang-tri/"],
  ["cao bằng có tuyển không", "/viec-lam-nganh-than/cao-bang/"],
];

const results = [];
for (const [query, expectedUrl] of cases) {
  const ranked = rank(query);
  const actualUrl = ranked[0]?.item?.url || null;
  results.push({ query, expected_url: expectedUrl, actual_url: actualUrl, matches: ranked.length });
  if (actualUrl !== expectedUrl) errors.push(`${query}: cần ${expectedUrl}, nhận ${actualUrl || "không có kết quả"}`);
}

const unknown = rank("hình xăm trường hợp riêng");
const unknownDirectAnswers = unknown.filter(({ item }) => item.type === "Trả lời nhanh").length;
if (unknownDirectAnswers) errors.push("Câu hỏi ngoài dữ kiện không được tự suy diễn thành câu trả lời nhanh");

const searchableProvinces = searchIndex.items.filter((item) => item.category === "province").length;
if (searchableProvinces < 17) errors.push(`Chỉ mục chỉ có ${searchableProvinces}/17 trang tỉnh có đủ nguồn`);
if (Buffer.byteLength(script) > 42_000) errors.push(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(script)}`);

console.log(JSON.stringify({
  queries_tested: cases.length,
  cases: results,
  searchable_provinces: searchableProvinces,
  unknown_direct_answers: unknownDirectAnswers,
  js_bytes: Buffer.byteLength(script),
  errors,
}, null, 2));

if (errors.length) process.exit(1);
