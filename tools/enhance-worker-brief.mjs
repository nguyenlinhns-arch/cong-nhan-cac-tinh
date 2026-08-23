import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "mobile-ux.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const markers = [
  "const WORKER_BRIEF_FACTS = [",
  "function createWorkerBriefDialog()",
  "function setupWorkerBrief()",
  "data-open-worker-brief",
  "Tóm tắt 30 giây",
  "worker_brief_open",
];

if (markers.every((marker) => source.includes(marker))) {
  console.log(JSON.stringify({ target: "tuyen-tho-mo/mobile-ux.js", status: "already-enhanced", beforeBytes, beforeSha256 }, null, 2));
  process.exit(0);
}
if (markers.some((marker) => source.includes(marker))) throw new Error("Worker 30-second brief is only partially present");
for (const required of [
  "const WORKER_SHORTCUTS = [",
  "function createWorkerCompass()",
  "function hasActiveApplicationDraft()",
  "function trackedApplicationUrl(campaign, content)",
  "function trackUi(event, payload = {})",
  "createWorkerCompass();",
  "setupSearch();",
]) if (!source.includes(required)) throw new Error(`Worker brief prerequisite is missing: ${required}`);

const factsBlock = "\n  const WORKER_BRIEF_FACTS = [\n    {\n      key: \"conditions\",\n      type: \"Điều kiện\",\n      title: \"Nam 18–40 tuổi\",\n      description: \"Cao từ 1m53, nặng từ 47kg; sức khỏe tốt, không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng công việc.\",\n      href: \"/#dieu-kien\",\n    },\n    {\n      key: \"training\",\n      type: \"Thời gian học\",\n      title: \"Nghề chính học 2–3 tháng\",\n      description: \"Khai thác mỏ và xây dựng mỏ học khoảng 2–3 tháng; cơ điện mỏ học 10 tháng.\",\n      href: \"/#thoi-gian-hoc\",\n    },\n    {\n      key: \"support\",\n      type: \"Hỗ trợ khi học\",\n      title: \"Miễn kinh phí đào tạo, có ăn ở\",\n      description: \"Ăn 3 bữa/ngày, ở ký túc xá và được hỗ trợ 7,5 triệu đồng/tháng trong thời gian học.\",\n      href: \"/#ho-tro-hoc-nghe\",\n    },\n    {\n      key: \"work\",\n      type: \"Việc làm và thu nhập\",\n      title: \"Làm việc tại Quảng Ninh\",\n      description: \"Được bố trí việc làm sau đào tạo; Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất.\",\n      href: \"/#noi-lam-viec\",\n    },\n    {\n      key: \"dossier\",\n      type: \"Hồ sơ\",\n      title: \"Chuẩn bị 3 nhóm giấy tờ\",\n      description: \"Căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có; chưa có bằng vẫn đăng ký được.\",\n      href: \"/#ho-so\",\n    },\n    {\n      key: \"address\",\n      type: \"Nơi nhập học\",\n      title: \"Khu C – Quang Hanh, Quảng Ninh\",\n      description: \"Phân hiệu Đào tạo Cẩm Phả; chỉ đến sau khi được xác nhận lịch tiếp nhận.\",\n      href: \"/#dia-diem\",\n    },\n  ];\n";
const categoryMarker = "  const categories = [";
if (!source.includes(categoryMarker)) throw new Error("Could not locate worker brief facts insertion point");
source = source.replace(categoryMarker, factsBlock + "\n" + categoryMarker);

const oldCompass = '    nav.innerHTML = `<div class="tl-worker-compass__inner"><strong>Cần xem:</strong><div>${WORKER_SHORTCUTS.map(({ key, label, href }) => `<a href="${href}" data-worker-shortcut="${key}">${label}</a>`).join("")}<button type="button" data-open-site-search data-worker-shortcut="search" aria-haspopup="dialog">${SEARCH_ICON}<span>Tìm kiếm</span></button><a class="tl-worker-compass__apply" href="${trackedApplicationUrl("worker_compass_2026", `compass_${group}`)}" data-contact="application" data-context="worker-compass" data-worker-shortcut="application">Ứng tuyển</a></div></div>`;';
const newCompass = '    nav.innerHTML = `<div class="tl-worker-compass__inner"><strong>Cần xem:</strong><div><button type="button" data-open-worker-brief data-worker-shortcut="brief" aria-haspopup="dialog">Tóm tắt 30 giây</button>${WORKER_SHORTCUTS.map(({ key, label, href }) => `<a href="${href}" data-worker-shortcut="${key}">${label}</a>`).join("")}<button type="button" data-open-site-search data-worker-shortcut="search" aria-haspopup="dialog">${SEARCH_ICON}<span>Tìm kiếm</span></button><a class="tl-worker-compass__apply" href="${trackedApplicationUrl("worker_compass_2026", `compass_${group}`)}" data-contact="application" data-context="worker-compass" data-worker-shortcut="application">Ứng tuyển</a></div></div>`;';
if (!source.includes(oldCompass)) throw new Error("Could not locate worker compass markup");
source = source.replace(oldCompass, newCompass);

const briefFunctions = "\n  function createWorkerBriefDialog() {\n    const dialog = document.createElement(\"dialog\");\n    dialog.className = \"tl-search-dialog tl-worker-brief-dialog\";\n    dialog.dataset.workerBrief = \"30-second-summary\";\n    dialog.setAttribute(\"aria-labelledby\", \"tl-worker-brief-title\");\n    const facts = WORKER_BRIEF_FACTS.map((fact) => `\n      <a class=\"tl-search-result\" href=\"${fact.href}\" data-worker-brief-action=\"${fact.key}\">\n        <small>${fact.type}</small>\n        <strong>${fact.title}</strong>\n        <span>${fact.description}</span>\n      </a>`).join(\"\");\n    dialog.innerHTML = `\n      <div class=\"tl-search-dialog__header\">\n        <div><span class=\"tl-search-dialog__eyebrow\">Thông tin đang áp dụng</span><h2 id=\"tl-worker-brief-title\">Tuyển thợ mỏ trong 30 giây</h2></div>\n        <button class=\"tl-search-dialog__close\" type=\"button\" aria-label=\"Đóng tóm tắt\">×</button>\n      </div>\n      <p class=\"tl-search-status\">6 thông tin quan trọng — không cần đọc hết bài hiện tại.</p>\n      <div class=\"tl-search-results\" tabindex=\"-1\">\n        <div class=\"tl-search-results__grid\">${facts}</div>\n        <div class=\"tl-search-empty\">\n          <strong>Bước tiếp theo</strong>\n          <span>Tự kiểm tra trước, đăng ký khi phù hợp hoặc hỏi trực tiếp trường hợp của bạn.</span>\n          <div class=\"tl-search-empty__actions\">\n            <a href=\"/#tu-kiem-tra\" data-worker-brief-action=\"self_check\">Tự kiểm tra điều kiện</a>\n            <a href=\"${trackedApplicationUrl(\"brief_to_application_2026\", `brief_${pageGroup()}`)}\" data-contact=\"application\" data-context=\"worker-brief\" data-worker-brief-action=\"application\">Đăng ký ngay</a>\n            <a href=\"${ZALO_URL}\" target=\"_blank\" rel=\"noopener noreferrer\" data-contact=\"zalo\" data-context=\"worker-brief\" data-worker-brief-action=\"zalo\">Hỏi qua Zalo</a>\n          </div>\n        </div>\n      </div>`;\n    document.body.append(dialog);\n    return dialog;\n  }\n\n  function setupWorkerBrief() {\n    const triggers = document.querySelectorAll(\"[data-open-worker-brief]\");\n    if (!triggers.length) return;\n    let dialog = null;\n    let lastBriefFocus = null;\n\n    const closeBrief = () => {\n      if (!dialog) return;\n      if (typeof dialog.close === \"function\" && dialog.open) dialog.close();\n      else dialog.removeAttribute(\"open\");\n      document.documentElement.classList.remove(\"tl-search-open\");\n      if (lastBriefFocus instanceof HTMLElement) lastBriefFocus.focus({ preventScroll: true });\n    };\n\n    const ensureBrief = () => {\n      if (dialog) return dialog;\n      dialog = createWorkerBriefDialog();\n      dialog.querySelector(\".tl-search-dialog__close\").addEventListener(\"click\", closeBrief);\n      dialog.addEventListener(\"cancel\", (event) => {\n        event.preventDefault();\n        closeBrief();\n      });\n      dialog.addEventListener(\"click\", (event) => {\n        const action = event.target.closest?.(\"[data-worker-brief-action]\");\n        if (action) trackUi(\"worker_brief_click\", { destination: action.dataset.workerBriefAction || \"unknown\", page_group: pageGroup() });\n        const rect = dialog.getBoundingClientRect();\n        const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;\n        if (outside) closeBrief();\n      });\n      return dialog;\n    };\n\n    const openBrief = (event) => {\n      const activeDialog = ensureBrief();\n      lastBriefFocus = event?.currentTarget instanceof HTMLElement ? event.currentTarget : document.activeElement;\n      document.querySelectorAll(\"dialog.tl-search-dialog[open]\").forEach((openDialog) => {\n        if (openDialog !== activeDialog && typeof openDialog.close === \"function\") openDialog.close();\n      });\n      if (typeof activeDialog.showModal === \"function\") activeDialog.showModal();\n      else activeDialog.setAttribute(\"open\", \"\");\n      document.documentElement.classList.add(\"tl-search-open\");\n      trackUi(\"worker_brief_open\", { page_group: pageGroup() });\n      requestAnimationFrame(() => activeDialog.querySelector(\".tl-search-dialog__close\")?.focus({ preventScroll: true }));\n    };\n\n    triggers.forEach((button) => button.addEventListener(\"click\", openBrief));\n  }\n";
const draftMarker = "  function hasActiveApplicationDraft() {";
if (!source.includes(draftMarker)) throw new Error("Could not locate worker brief function insertion point");
source = source.replace(draftMarker, briefFunctions + "\n" + draftMarker);

const oldTestApi = "window.__TL_SEARCH_INTERNALS__ = { normalize, meaningfulQueryTerms, queryIntentScores, provinceAliases, oneEditApart, scoreItem, parseWorkerMeasurements, buildSearchAnswer };";
const newTestApi = "window.__TL_SEARCH_INTERNALS__ = { normalize, meaningfulQueryTerms, queryIntentScores, provinceAliases, oneEditApart, scoreItem, parseWorkerMeasurements, buildSearchAnswer, workerBriefFacts: WORKER_BRIEF_FACTS, createWorkerBriefDialog };";
if (!source.includes(oldTestApi)) throw new Error("Could not locate worker brief test API");
source = source.replace(oldTestApi, newTestApi);

const startMarker = "  createWorkerCompass();\n  createContactButtons();";
const startReplacement = "  createWorkerCompass();\n  setupWorkerBrief();\n  createContactButtons();";
if (!source.includes(startMarker)) throw new Error("Could not locate worker brief setup point");
source = source.replace(startMarker, startReplacement);

for (const marker of markers) if (!source.includes(marker)) throw new Error(`Worker brief is missing ${marker}`);
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 42_000) throw new Error(`Worker brief mobile-ux.js exceeds 42 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/mobile-ux.js",
  status: "enhanced",
  facts: 6,
  beforeBytes,
  afterBytes,
  beforeSha256,
  afterSha256,
}, null, 2));
