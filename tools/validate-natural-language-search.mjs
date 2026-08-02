import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const js = fs.readFileSync(path.join(root, "mobile-ux.js"), "utf8");
const payload = JSON.parse(fs.readFileSync(path.join(root, "search-index.json"), "utf8"));
const items = Array.isArray(payload) ? payload : payload.items;
const errors = [];
const fail = (message) => errors.push(message);

for (const marker of [
  "const SEARCH_STOP_WORDS = new Set([",
  "const SEARCH_INTENTS = [",
  "function normalizeSearchQuery(value)",
  "function provinceAliases(item)",
  "function resolveSearchIntent(value, source = [])",
  "function oneEditApart(left, right)",
  "function rankSearchItems(value, source, category = \"all\")",
  "Câu trả lời phù hợp nhất được đưa lên đầu",
  "Ví dụ: Tôi 39 tuổi có đăng ký được không?",
  "window.thayLinhSearchTest",
]) if (!js.includes(marker)) fail(`JavaScript thiếu ${marker}`);

if (!Array.isArray(items) || !items.length) fail("Chỉ mục tìm kiếm không có dữ liệu");
for (const url of ["/#dieu-kien", "/#quyen-loi", "/#thoi-gian-hoc", "/#ho-tro-hoc-nghe", "/#ho-so", "/#dia-diem", "/#quy-trinh", "/#dang-ky"]) {
  if (!items.some((item) => item.url === url && item.priority >= 200)) fail(`Thiếu câu trả lời nhanh ${url}`);
}
if (items.filter((item) => item.category === "province").length < 17) fail("Chỉ mục thiếu các trang tỉnh có thể tìm kiếm");

const helperStart = js.indexOf("const SEARCH_STOP_WORDS");
const helperEnd = js.indexOf("function pageGroup()", helperStart);
const helperCode = js.slice(helperStart, helperEnd);
for (const forbidden of ["localStorage", "sessionStorage", "fetch(", "document.cookie", "sendBeacon", "FormData", "trackUi("]) {
  if (helperCode.includes(forbidden)) fail(`Bộ hiểu câu hỏi không được dùng ${forbidden}`);
}
if (Buffer.byteLength(js) > 42_000) fail(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(js)}`);

function makeElement(tagName = "div", inserted = []) {
  return {
    tagName: tagName.toUpperCase(), className: "", innerHTML: "", dataset: {}, attributes: new Map(), listeners: new Map(), children: [], parentNode: null,
    setAttribute(name, value) {
      this.attributes.set(name, String(value));
      if (name.startsWith("data-")) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, character) => character.toUpperCase())] = String(value);
    },
    getAttribute(name) { return this.attributes.get(name) || null; },
    addEventListener(name, listener) { this.listeners.set(name, listener); },
    querySelector() { return null; }, querySelectorAll() { return []; },
    insertBefore(child) { this.children.push(child); child.parentNode = this; },
    insertAdjacentElement(position, child) { inserted.push({ position, child }); child.parentNode = this.parentNode; },
    append(...children) { this.children.push(...children); }, matches() { return false; },
  };
}

function loadSearchApi() {
  const inserted = [];
  const appended = [];
  const header = makeElement("header", inserted);
  const headerInner = makeElement("div", inserted);
  const main = makeElement("main", inserted);
  main.parentNode = { insertBefore(child) { inserted.push({ position: "before-main", child }); } };
  const documentStub = {
    body: { append(node) { appended.push(node); } },
    documentElement: { classList: { add() {}, remove() {} } },
    activeElement: null,
    querySelector(selector) {
      if (selector === ".tl-worker-compass") return null;
      if (selector === "header") return header;
      if (selector === "main") return main;
      if (selector === ".tl-mobile-contact") return null;
      if (selector === ".site-header .header-inner") return headerInner;
      if (selector === ".site-header") return header;
      return null;
    },
    querySelectorAll() { return []; },
    createElement(tag) { return makeElement(tag, inserted); },
  };
  const storage = new Map();
  const location = {
    pathname: "/bai-viet/dieu-kien-tuyen-tho-lo-2026/",
    href: "https://thaylinhtuyenthomo.vn/bai-viet/dieu-kien-tuyen-tho-lo-2026/?search-test=1",
    origin: "https://thaylinhtuyenthomo.vn",
    search: "?search-test=1",
  };
  const window = { dataLayer: [] };
  vm.runInNewContext(js, {
    window, document: documentStub, location,
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: key => storage.delete(key),
    },
    URL, Date, JSON, Number, String, Array, Object, Set, RegExp, Math,
    HTMLElement: class HTMLElement {},
    requestAnimationFrame() { return 1; },
    fetch() { throw new Error("Search index must not load during the pure ranking test"); },
  }, { filename: "mobile-ux.js" });
  return window.thayLinhSearchTest;
}

try {
  const api = loadSearchApi();
  if (!api) throw new Error("Không tạo được search test hook");
  const tests = [
    ["39 tuổi có đi được không", "/#dieu-kien"],
    ["tôi 39 tuổi có đi được không", "/#dieu-kien"],
    ["toi 39 tuoi co di duoc ko", "/#dieu-kien"],
    ["bị cận có đi được không", "/#dieu-kien"],
    ["cao 1m52 có đi được không", "/#dieu-kien"],
    ["47 cân", "/#dieu-kien"],
    ["không có bằng có đi được không", "/#ho-so"],
    ["cần giấy tờ gì", "/#ho-so"],
    ["hso can gi", "/#ho-so"],
    ["học bao nhiêu tháng", "/#thoi-gian-hoc"],
    ["hoc may thag", "/#thoi-gian-hoc"],
    ["có phải đóng học phí không", "/#ho-tro-hoc-nghe"],
    ["lương bao nhiêu", "/#quyen-loi"],
    ["luongg", "/#quyen-loi"],
    ["học ở đâu", "/#dia-diem"],
    ["đăng ký như nào", "/#quy-trinh"],
    ["sđt thầy linh", "/#dang-ky"],
    ["việc làm quảng trị", "/viec-lam-nganh-than/quang-tri/"],
    ["đi từ nghệ an", "/viec-lam-nganh-than/nghe-an/"],
    ["quê quảng bình", "/viec-lam-nganh-than/quang-tri/"],
    ["cao bằng có tuyển không", "/viec-lam-nganh-than/cao-bang/"],
  ];
  for (const [query, expected] of tests) {
    const result = api.rankSearchItems(query, items, "all");
    const actual = result.matches[0]?.url || "";
    if (actual !== expected) fail(`“${query}”: cần ${expected}, nhận ${actual || "không có kết quả"}`);
  }
  if (api.normalizeSearchQuery("tôi muốn hỏi hồ sơ cần giấy tờ gì") !== "ho so") fail("Lọc từ đệm tiếng Việt chưa đúng");
} catch (error) {
  fail(`Không chạy được kiểm thử câu hỏi tự nhiên: ${error.message}`);
}

console.log(JSON.stringify({
  queries_tested: 21,
  searchable_provinces: Array.isArray(items) ? items.filter((item) => item.category === "province").length : 0,
  js_bytes: Buffer.byteLength(js),
  errors,
}, null, 2));
if (errors.length) process.exit(1);
