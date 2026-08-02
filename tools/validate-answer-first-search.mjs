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
if (!api || typeof api.buildSearchAnswer !== "function" || typeof api.parseWorkerMeasurements !== "function") {
  throw new Error("Không tải được lõi kiểm thử câu trả lời ngay");
}
if (searchIndex.version !== 3 || !Array.isArray(searchIndex.items)) {
  throw new Error(`Chỉ mục tìm kiếm không đúng phiên bản 3: ${searchIndex.version}`);
}

for (const marker of [
  "function parseWorkerMeasurements(value)",
  "function buildSearchAnswer(value, matches)",
  "function appendSearchAnswer(grid, answer)",
  "panel.dataset.searchAnswer = answer.kind",
  "Câu trả lời ngay và",
  "matches = matches.slice(0, 4)",
]) {
  if (!script.includes(marker)) errors.push(`JavaScript thiếu ${marker}`);
}

const helperStart = script.indexOf("function parseWorkerMeasurements(value)");
const helperEnd = script.indexOf('if (typeof document === "undefined"', helperStart);
const helperCode = script.slice(helperStart, helperEnd);
for (const forbidden of ["localStorage", "sessionStorage", "document.cookie", "sendBeacon", "FormData", "fetch("]) {
  if (helperCode.includes(forbidden)) errors.push(`Câu trả lời ngay không được dùng ${forbidden}`);
}
for (const forbidden of ["query_text", "search_query", "rawQuery:", "input.value,"]) {
  if (script.includes(forbidden)) errors.push(`Không được gửi nguyên nội dung người dùng gõ: ${forbidden}`);
}

function rank(query) {
  return searchIndex.items
    .map((item) => ({ item, score: api.scoreItem(item, query) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title, "vi"))
    .map(({ item }) => item);
}

const cases = [
  {
    query: "39 tuổi",
    expected: { kind: "screening", state: "pass", href: "/#tu-kiem-tra" },
    phrases: ["39 tuổi: đạt mốc 18–40 tuổi", "khám tuyển"],
  },
  {
    query: "41 tuổi",
    expected: { kind: "screening", state: "review", href: "/#dieu-kien" },
    phrases: ["41 tuổi: chưa đạt mốc 18–40 tuổi", "khám tuyển"],
  },
  {
    query: "cao 1m52",
    expected: { kind: "screening", state: "review", href: "/#dieu-kien" },
    phrases: ["1m52: chưa đạt mốc từ 1m53"],
  },
  {
    query: "cao 153cm",
    expected: { kind: "screening", state: "pass", href: "/#tu-kiem-tra" },
    phrases: ["1m53: đạt mốc từ 1m53"],
  },
  {
    query: "nặng 46kg",
    expected: { kind: "screening", state: "review", href: "/#dieu-kien" },
    phrases: ["46kg: chưa đạt mốc từ 47kg"],
  },
  {
    query: "nặng 47 cân",
    expected: { kind: "screening", state: "pass", href: "/#tu-kiem-tra" },
    phrases: ["47kg: đạt mốc từ 47kg"],
  },
  {
    query: "39 tuổi cao 1m54 nặng 50kg",
    expected: { kind: "screening", state: "pass", href: "/#tu-kiem-tra" },
    phrases: ["39 tuổi: đạt", "1m54: đạt", "50kg: đạt"],
  },
];

const results = [];
for (const testCase of cases) {
  const answer = api.buildSearchAnswer(testCase.query, rank(testCase.query));
  results.push({ query: testCase.query, answer });
  if (!answer) {
    errors.push(`${testCase.query}: không tạo được câu trả lời`);
    continue;
  }
  for (const [key, value] of Object.entries(testCase.expected)) {
    if (answer[key] !== value) errors.push(`${testCase.query}: ${key} cần ${value}, nhận ${answer[key]}`);
  }
  for (const phrase of testCase.phrases) {
    if (!answer.text.includes(phrase)) errors.push(`${testCase.query}: thiếu ${phrase}`);
  }
  if (!/sơ bộ/i.test(`${answer.title} ${answer.text}`)) errors.push(`${testCase.query}: thiếu cảnh báo sơ bộ`);
}

const dossierAnswer = api.buildSearchAnswer("không có bằng", rank("không có bằng"));
if (dossierAnswer?.kind !== "direct" || dossierAnswer?.href !== "/#ho-so" || !dossierAnswer.text.includes("Chưa có bằng")) {
  errors.push("Câu hỏi không có bằng chưa được trả lời trực tiếp đúng mục hồ sơ");
}

const provinceAnswer = api.buildSearchAnswer("quê quảng bình", rank("quê quảng bình"));
if (provinceAnswer?.kind !== "province" || provinceAnswer?.href !== "/viec-lam-nganh-than/quang-tri/") {
  errors.push(`Câu hỏi Quảng Bình chưa đi đúng trang Quảng Trị: ${provinceAnswer?.href || "không có"}`);
}

const unknownAnswer = api.buildSearchAnswer("hình xăm trường hợp riêng", []);
if (unknownAnswer !== null) errors.push("Câu hỏi ngoài dữ kiện không được tự suy diễn câu trả lời");

const measurements = api.parseWorkerMeasurements("39 tuổi cao 1m54 nặng 50 cân");
if (measurements.age !== 39 || measurements.heightCm !== 154 || measurements.weightKg !== 50) {
  errors.push(`Đọc sai số đo: ${JSON.stringify(measurements)}`);
}

if (Buffer.byteLength(script) > 42_000) errors.push(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(script)}`);

console.log(JSON.stringify({
  answer_cases: cases.length,
  results,
  dossier_answer: dossierAnswer,
  province_answer: provinceAnswer,
  measurements,
  js_bytes: Buffer.byteLength(script),
  errors,
}, null, 2));

if (errors.length) process.exit(1);
