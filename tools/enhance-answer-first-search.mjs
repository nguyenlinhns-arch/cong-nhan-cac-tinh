import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "mobile-ux.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const markers = [
  "function parseWorkerMeasurements(value)",
  "function buildSearchAnswer(value, matches)",
  "function appendSearchAnswer(grid, answer)",
  "panel.dataset.searchAnswer = answer.kind",
  "Câu trả lời ngay và",
];

if (markers.every((marker) => source.includes(marker))) {
  console.log(JSON.stringify({
    target: "tuyen-tho-mo/mobile-ux.js",
    status: "already-enhanced",
    beforeBytes,
    beforeSha256,
  }, null, 2));
  process.exit(0);
}
if (markers.some((marker) => source.includes(marker))) {
  throw new Error("Answer-first search is only partially present");
}
for (const required of [
  "function meaningfulQueryTerms(value)",
  "function scoreItem(item, rawQuery)",
  "function renderResults(dialog)",
  "TL_SEARCH_TEST_ONLY",
]) {
  if (!source.includes(required)) throw new Error(`Natural-language search prerequisite is missing: ${required}`);
}

const helperBlock = String.raw`
  function parseWorkerMeasurements(value) {
    const query = normalize(value);
    const ageMatch = query.match(/\b(1[5-9]|[2-6]\d)\s*tuoi\b/);
    const heightMMatch = query.match(/\b1m(\d{1,2})\b/);
    const heightCmMatch = query.match(/\b(1[3-9]\d|2[0-2]\d)\s*cm\b/);
    const weightMatch = query.match(/\b(\d{2,3})\s*(?:kg|can)\b/);
    const heightSuffix = heightMMatch ? Number(heightMMatch[1]) : null;
    const heightCm = heightCmMatch
      ? Number(heightCmMatch[1])
      : heightSuffix !== null
        ? 100 + (heightSuffix < 10 ? heightSuffix * 10 : heightSuffix)
        : null;
    const weightKg = weightMatch ? Number(weightMatch[1]) : null;
    return {
      age: ageMatch ? Number(ageMatch[1]) : null,
      heightCm: Number.isFinite(heightCm) && heightCm >= 130 && heightCm <= 220 ? heightCm : null,
      weightKg: Number.isFinite(weightKg) && weightKg >= 30 && weightKg <= 200 ? weightKg : null,
    };
  }

  function buildSearchAnswer(value, matches) {
    const measurements = parseWorkerMeasurements(value);
    const checks = [];
    if (measurements.age !== null) checks.push({
      label: measurements.age + " tuổi",
      requirement: "18–40 tuổi",
      pass: measurements.age >= 18 && measurements.age <= 40,
    });
    if (measurements.heightCm !== null) checks.push({
      label: Math.floor(measurements.heightCm / 100) + "m" + String(measurements.heightCm % 100).padStart(2, "0"),
      requirement: "từ 1m53",
      pass: measurements.heightCm >= 153,
    });
    if (measurements.weightKg !== null) checks.push({
      label: measurements.weightKg + "kg",
      requirement: "từ 47kg",
      pass: measurements.weightKg >= 47,
    });

    if (checks.length) {
      const failed = checks.filter((check) => !check.pass);
      const text = checks.map((check) => check.label + ": " + (check.pass ? "đạt" : "chưa đạt") + " mốc " + check.requirement).join("; ")
        + ". Đây là kiểm tra sơ bộ theo thông tin bạn nhập; sức khỏe và kết quả khám tuyển là căn cứ xác nhận cuối cùng.";
      return {
        kind: "screening",
        state: failed.length ? "review" : "pass",
        title: failed.length ? "Kết quả sơ bộ: có mốc cần kiểm tra lại" : "Kết quả sơ bộ: các mốc đã nhập đều đạt",
        text,
        href: failed.length ? "/#dieu-kien" : "/#tu-kiem-tra",
        actionLabel: failed.length ? "Xem điều kiện đầy đủ" : "Kiểm tra đủ 4 điều kiện",
        secondaryHref: ZALO_URL,
        secondaryLabel: "Hỏi trường hợp của tôi",
      };
    }

    const top = Array.isArray(matches) ? matches[0] : null;
    if (!top) return null;
    if (top.type === "Trả lời nhanh" || Number(top.priority || 0) >= 200) {
      return {
        kind: "direct",
        state: "info",
        title: top.title,
        text: top.description || "Mở đúng mục để xem thông tin đang áp dụng.",
        href: top.url,
        actionLabel: "Mở đúng mục",
      };
    }
    if (top.category === "province") {
      return {
        kind: "province",
        state: "info",
        title: "Đã tìm thấy thông tin theo địa phương",
        text: top.title + (top.description ? ". " + top.description : ""),
        href: top.url,
        actionLabel: "Mở trang địa phương",
      };
    }
    return null;
  }

  function appendSearchAnswer(grid, answer) {
    const panel = document.createElement("section");
    panel.className = "tl-search-empty";
    panel.style.gridColumn = "1 / -1";
    panel.setAttribute("aria-label", "Câu trả lời nhanh");
    panel.dataset.searchAnswer = answer.kind;
    panel.dataset.state = answer.state || "info";

    const title = document.createElement("strong");
    title.textContent = answer.title;
    const text = document.createElement("span");
    text.textContent = answer.text;
    const actions = document.createElement("div");
    actions.className = "tl-search-empty__actions";
    const primary = document.createElement("a");
    primary.href = safeUrl(answer.href);
    primary.textContent = answer.actionLabel;
    primary.dataset.workerShortcut = "answer_" + answer.kind;
    actions.append(primary);

    if (answer.secondaryHref) {
      const secondary = document.createElement("a");
      secondary.href = answer.secondaryHref;
      secondary.target = "_blank";
      secondary.rel = "noopener";
      secondary.textContent = answer.secondaryLabel || "Hỏi qua Zalo";
      secondary.dataset.contact = "zalo";
      secondary.dataset.context = "search-answer";
      secondary.dataset.workerShortcut = "answer_" + answer.kind + "_zalo";
      actions.append(secondary);
    }

    panel.append(title, text, actions);
    grid.append(panel);
  }
`;

const testBlockIndex = source.indexOf('  if (typeof document === "undefined" && typeof process !== "undefined" && process?.env?.TL_SEARCH_TEST_ONLY === "1") {');
if (testBlockIndex < 0) throw new Error("Could not locate answer-first helper insertion point");
source = source.slice(0, testBlockIndex) + helperBlock + "\n" + source.slice(testBlockIndex);

const oldTestApi = "window.__TL_SEARCH_INTERNALS__ = { normalize, meaningfulQueryTerms, queryIntentScores, provinceAliases, oneEditApart, scoreItem };";
const newTestApi = "window.__TL_SEARCH_INTERNALS__ = { normalize, meaningfulQueryTerms, queryIntentScores, provinceAliases, oneEditApart, scoreItem, parseWorkerMeasurements, buildSearchAnswer };";
if (!source.includes(oldTestApi)) throw new Error("Could not locate natural-language test API");
source = source.replace(oldTestApi, newTestApi);

const fallbackMarker = "    if (showingFallback) {\n";
const answerRender = "    const answer = showingFallback ? null : buildSearchAnswer(rawQuery, matches);\n"
  + "    if (answer) {\n"
  + "      appendSearchAnswer(grid, answer);\n"
  + "      matches = matches.slice(0, 4);\n"
  + "    }\n\n"
  + fallbackMarker;
if (!source.includes(fallbackMarker)) throw new Error("Could not locate search fallback block");
source = source.replace(fallbackMarker, answerRender);

const statusMarker = '        : "Các nội dung được xem nhiều";\n  }\n\n  async function loadSearchIndex(dialog) {';
const statusReplacement = '        : "Các nội dung được xem nhiều";\n    if (answer) status.textContent = `Câu trả lời ngay và ${matches.length} nội dung liên quan`;\n  }\n\n  async function loadSearchIndex(dialog) {';
if (!source.includes(statusMarker)) throw new Error("Could not locate search status tail");
source = source.replace(statusMarker, statusReplacement);

for (const marker of markers) if (!source.includes(marker)) throw new Error(`Answer-first search is missing ${marker}`);
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 42_000) throw new Error(`Answer-first mobile-ux.js exceeds 42 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/mobile-ux.js",
  status: "enhanced",
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
