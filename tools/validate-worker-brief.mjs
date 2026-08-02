import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const script = fs.readFileSync(path.join(root, "mobile-ux.js"), "utf8");
const errors = [];
const fail = (message) => errors.push(message);

for (const marker of [
  "const WORKER_BRIEF_FACTS = [",
  "function createWorkerBriefDialog()",
  "function setupWorkerBrief()",
  "data-open-worker-brief",
  "Tóm tắt 30 giây",
  "Tuyển thợ mỏ trong 30 giây",
  "worker_brief_open",
  "worker_brief_click",
  "brief_to_application_2026",
  "setupWorkerBrief();",
]) if (!script.includes(marker)) fail(`JavaScript thiếu ${marker}`);

const compassStart = script.indexOf("function createWorkerCompass()");
const compassEnd = script.indexOf("function createWorkerBriefDialog()", compassStart);
const compassCode = script.slice(compassStart, compassEnd);
if (!compassCode.includes('if (pathname === "/"')) fail("Trang chủ phải bỏ qua thanh chỉ đường và tóm tắt lặp lại");
if ((compassCode.match(/data-open-worker-brief/g) || []).length !== 1) fail("Thanh chỉ đường phải có đúng một nút tóm tắt 30 giây");

const briefStart = script.indexOf("const WORKER_BRIEF_FACTS = [");
const briefEnd = script.indexOf("function hasActiveApplicationDraft()", briefStart);
const briefCode = script.slice(briefStart, briefEnd);
for (const forbidden of ["localStorage", "sessionStorage", "document.cookie", "sendBeacon", "FormData", "fetch("]) {
  if (briefCode.includes(forbidden)) fail(`Tóm tắt 30 giây không được dùng ${forbidden}`);
}

const context = {
  window: {},
  process: { env: { TL_SEARCH_TEST_ONLY: "1" } },
  location: {
    href: "https://thaylinhtuyenthomo.vn/bai-viet/dieu-kien-tuyen-tho-lo-2026/",
    origin: "https://thaylinhtuyenthomo.vn",
    pathname: "/bai-viet/dieu-kien-tuyen-tho-lo-2026/",
  },
  URL,
  URLSearchParams,
};
vm.createContext(context);
vm.runInContext(script, context, { filename: "mobile-ux.js" });
const api = context.window.__TL_SEARCH_INTERNALS__;
if (!api || !Array.isArray(api.workerBriefFacts) || typeof api.createWorkerBriefDialog !== "function") {
  fail("Không tải được lõi kiểm thử tóm tắt 30 giây");
} else {
  const expected = [
    ["conditions", "/#dieu-kien", "Nam 18–40 tuổi"],
    ["training", "/#thoi-gian-hoc", "2–3 tháng"],
    ["support", "/#ho-tro-hoc-nghe", "7,5 triệu đồng"],
    ["work", "/#noi-lam-viec", "20–25 triệu đồng/tháng"],
    ["dossier", "/#ho-so", "chưa có bằng vẫn đăng ký được"],
    ["address", "/#dia-diem", "Quang Hanh"],
  ];
  if (api.workerBriefFacts.length !== expected.length) fail(`Tóm tắt phải có ${expected.length} thông tin, hiện có ${api.workerBriefFacts.length}`);
  for (const [key, href, phrase] of expected) {
    const fact = api.workerBriefFacts.find((item) => item.key === key);
    if (!fact) {
      fail(`Thiếu thông tin ${key}`);
      continue;
    }
    if (fact.href !== href) fail(`${key}: sai đường dẫn ${fact.href}`);
    if (!`${fact.title} ${fact.description}`.includes(phrase)) fail(`${key}: thiếu nội dung ${phrase}`);
  }

  const appended = [];
  context.document = {
    body: { append(node) { appended.push(node); } },
    createElement(tagName) {
      return {
        tagName: String(tagName).toUpperCase(),
        className: "",
        dataset: {},
        attributes: new Map(),
        innerHTML: "",
        setAttribute(name, value) { this.attributes.set(name, String(value)); },
      };
    },
  };
  const dialog = api.createWorkerBriefDialog();
  if (appended[0] !== dialog) fail("Hộp tóm tắt chưa được gắn vào trang");
  if (!dialog.className.includes("tl-search-dialog") || dialog.dataset.workerBrief !== "30-second-summary") fail("Hộp tóm tắt thiếu lớp hoặc dấu nhận diện");
  for (const phrase of [
    "Tuyển thợ mỏ trong 30 giây",
    "6 thông tin quan trọng",
    "Tự kiểm tra điều kiện",
    "Đăng ký ngay",
    "Hỏi qua Zalo",
    "brief_to_application_2026",
  ]) if (!dialog.innerHTML.includes(phrase)) fail(`Hộp tóm tắt thiếu ${phrase}`);
  if ((dialog.innerHTML.match(/class="tl-search-result"/g) || []).length !== 6) fail("Hộp tóm tắt phải hiển thị đúng 6 thẻ thông tin");
}

if (Buffer.byteLength(script) > 42_000) fail(`mobile-ux.js vượt 42 KB: ${Buffer.byteLength(script)}`);

console.log(JSON.stringify({
  facts: api?.workerBriefFacts?.length || 0,
  js_bytes: Buffer.byteLength(script),
  privacy_forbidden_hits: errors.filter((item) => item.includes("không được dùng")).length,
  errors,
}, null, 2));
if (errors.length) process.exit(1);
