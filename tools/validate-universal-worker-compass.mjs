import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const js = fs.readFileSync(path.join(root, "mobile-ux.js"), "utf8");
const css = fs.readFileSync(path.join(root, "mobile-ux.css"), "utf8");
const errors = [];
const fail = (message) => errors.push(message);

for (const marker of [
  "const WORKER_SHORTCUTS = [",
  "function createWorkerCompass()",
  "worker_compass_2026",
  "worker_compass_click",
  "tl-search-shortcuts",
  "tl-search-empty__actions",
  "search_to_application_2026",
  "createWorkerCompass();",
]) if (!js.includes(marker)) fail(`JavaScript thiếu ${marker}`);

for (const marker of [
  ".tl-worker-compass{",
  ".tl-worker-compass__inner",
  ".tl-worker-compass__apply",
  ".tl-search-shortcuts{",
  ".tl-search-empty__actions{",
  "@media print{.tl-worker-compass",
]) if (!css.includes(marker)) fail(`CSS thiếu ${marker}`);

const shortcutBlock = js.slice(js.indexOf("const WORKER_SHORTCUTS"), js.indexOf("const categories"));
for (const [key, href] of [
  ["conditions", "/#dieu-kien"],
  ["benefits", "/#quyen-loi"],
  ["dossier", "/#ho-so"],
  ["address", "/#dia-diem"],
  ["province", "/viec-lam-nganh-than/"],
]) {
  if (!shortcutBlock.includes(`key: "${key}"`) || !shortcutBlock.includes(`href: "${href}"`)) fail(`Thiếu lối tắt ${key}`);
}

const compassStart = js.indexOf("function createWorkerCompass()");
const compassEnd = js.indexOf("function hasActiveApplicationDraft()", compassStart);
const compassCode = js.slice(compassStart, compassEnd);
for (const forbidden of ["localStorage", "sessionStorage", "fetch(", "document.cookie", "sendBeacon", "FormData"]) {
  if (compassCode.includes(forbidden)) fail(`Thanh chỉ đường không được dùng ${forbidden}`);
}
for (const parameter of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
  if (!js.includes(`url.searchParams.set("${parameter}"`)) fail(`Đường ứng tuyển thiếu ${parameter}`);
}
if (Buffer.byteLength(js) > 42_000) fail(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(js)}`);
if (Buffer.byteLength(css) > 16_200) fail(`mobile-ux.css vượt 16,2 KB: ${Buffer.byteLength(css)}`);

function makeElement(tagName = "div", inserted = []) {
  return {
    tagName: tagName.toUpperCase(),
    className: "",
    innerHTML: "",
    dataset: {},
    attributes: new Map(),
    listeners: new Map(),
    children: [],
    parentNode: null,
    setAttribute(name, value) {
      this.attributes.set(name, String(value));
      if (name.startsWith("data-")) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, character) => character.toUpperCase())] = String(value);
    },
    getAttribute(name) { return this.attributes.get(name) || null; },
    addEventListener(name, listener) { this.listeners.set(name, listener); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    insertBefore(child) { this.children.push(child); child.parentNode = this; },
    insertAdjacentElement(position, child) { inserted.push({ position, child }); child.parentNode = this.parentNode; },
    append(...children) { this.children.push(...children); },
    matches() { return false; },
  };
}

function execute(pathname) {
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
  const location = { pathname, href: `https://thaylinhtuyenthomo.vn${pathname}`, origin: "https://thaylinhtuyenthomo.vn" };
  const window = { dataLayer: [] };
  vm.runInNewContext(js, {
    window,
    document: documentStub,
    location,
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: key => storage.delete(key),
    },
    URL,
    Date,
    JSON,
    Number,
    String,
    Array,
    Object,
    HTMLElement: class HTMLElement {},
    requestAnimationFrame() { return 1; },
  }, { filename: "mobile-ux.js" });
  return { inserted, appended, window };
}

try {
  const deep = execute("/bai-viet/dieu-kien-tuyen-tho-lo-2026/");
  const compass = deep.inserted.find(({ child }) => child.className === "tl-worker-compass")?.child;
  if (!compass) fail("Trang sâu không được gắn thanh chỉ đường");
  else {
    for (const marker of ["Điều kiện", "Quyền lợi", "Hồ sơ", "Nơi học", "Theo tỉnh", "Tìm kiếm", "Ứng tuyển", "worker_compass_2026", "compass_article"]) {
      if (!compass.innerHTML.includes(marker)) fail(`Thanh chỉ đường thiếu ${marker}`);
    }
  }
  const home = execute("/");
  if (home.inserted.some(({ child }) => child.className === "tl-worker-compass")) fail("Trang chủ không được lặp thanh chỉ đường");
} catch (error) {
  fail(`Không chạy được kiểm thử thanh chỉ đường: ${error.message}`);
}

console.log(JSON.stringify({
  shortcuts: 5,
  js_bytes: Buffer.byteLength(js),
  css_bytes: Buffer.byteLength(css),
  errors,
}, null, 2));
if (errors.length) process.exit(1);
