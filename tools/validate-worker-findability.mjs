import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve("tuyen-tho-mo");
const errors = [];
const fail = (message) => errors.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const count = (text, marker) => text.split(marker).length - 1;

const home = read("index.html");
const css = read("worker-info-finder.css");
const script = read("worker-info-finder.js");
const mobileUx = read("mobile-ux.js");
const provinceData = JSON.parse(read("data/provinces-2026.json"));
const provinces = Array.isArray(provinceData.provinces) ? provinceData.provinces : [];

if (count(home, 'href="/worker-info-finder.css?v=2"') !== 1) fail("Trang chủ: stylesheet tìm thông tin phải được nạp đúng một lần");
if (count(home, 'src="/worker-info-finder.js?v=2"') !== 1) fail("Trang chủ: script tìm thông tin phải được nạp đúng một lần");
if (count(home, 'src="/mobile-ux.js?v=5"') !== 1) fail("Trang chủ: mobile UX mới phải được nạp đúng một lần");
if (count(home, "data-open-site-search") !== 2) fail("Trang chủ: cần hai điểm mở tìm kiếm rõ ràng");
if (count(home, "data-worker-search") !== 2) fail("Trang chủ: hai điểm tìm kiếm phải có đo lường thống nhất");
if (!home.includes('class="worker-header-search"') || !home.includes('aria-label="Tìm thông tin trên website"')) fail("Header: thiếu nút tìm kiếm có nhãn truy cập");
if (!home.includes('class="worker-find__search"') || !home.includes("Tìm trong toàn bộ website")) fail("Khối tìm nhanh: thiếu ô tìm kiếm hiển thị rõ");
if (!home.includes('href="#tu-kiem-tra">Tự kiểm tra điều kiện</a>')) fail("Hero: nút tự kiểm tra chưa đi đúng công cụ");
if (!home.includes("Đăng ký – chưa cần hồ sơ")) fail("Hero: nút đăng ký chưa nói rõ bước đầu không cần hồ sơ");
if (!home.includes('href="#tu-kiem-tra"><b>01</b>')) fail("Điều hướng nhanh: mục điều kiện chưa đi đúng công cụ");

if (count(home, 'id="tu-kiem-tra"') !== 1 || count(home, "data-worker-check-form") !== 1) fail("Tự kiểm tra: cần đúng một công cụ trên trang chủ");
for (const name of ["age_range", "height_range", "weight_range", "health_screen"]) {
  if (count(home, `name="${name}"`) !== 2) fail(`Tự kiểm tra: ${name} phải có hai lựa chọn`);
}
if (count(home, 'value="yes"') < 4 || count(home, 'value="review"') < 4) fail("Tự kiểm tra: thiếu lựa chọn Có hoặc Chưa/không rõ");
for (const marker of [
  'data-worker-check-result role="status" aria-live="polite" tabindex="-1" hidden',
  "30 giây · không gửi dữ liệu",
  "Không lưu câu trả lời",
  "khám tuyển là căn cứ xác nhận cuối cùng",
]) if (!home.includes(marker)) fail(`Tự kiểm tra: thiếu ${marker}`);

const optionSlugs = [...home.matchAll(/data-province-slug="([^"]+)"/g)].map((match) => match[1]);
const expectedSlugs = provinces.map((province) => province.slug);
if (provinces.length !== 26) fail(`Dữ liệu tỉnh: cần 26, nhận ${provinces.length}`);
if (JSON.stringify(optionSlugs) !== JSON.stringify(expectedSlugs)) fail("Bộ chọn tỉnh: danh sách hoặc thứ tự không đồng bộ với nguồn dữ liệu");
for (const province of provinces) {
  const page = path.join(root, "viec-lam-nganh-than", province.slug, "index.html");
  if (!fs.existsSync(page)) fail(`Bộ chọn tỉnh: thiếu trang ${province.slug}`);
  if (!home.includes(`data-province-name="${province.name.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}"`)) fail(`Bộ chọn tỉnh: thiếu tên ngắn ${province.name}`);
}

for (const marker of [
  "worker_search_open",
  "worker_province_select",
  "worker_province_open",
  "worker_self_check_complete",
  "worker_self_check_incomplete",
  "worker_find_2026",
  "worker_self_check_2026",
  "data-contact=\"application\"",
  "data-contact=\"zalo\"",
]) if (!script.includes(marker)) fail(`Hành vi tìm thông tin: thiếu ${marker}`);
for (const prohibited of ["localStorage", "sessionStorage", "fetch(", "XMLHttpRequest", "sendBeacon", "FormData", "document.cookie"]) {
  if (script.includes(prohibited)) fail(`Tự kiểm tra không được lưu hoặc gửi dữ liệu: ${prohibited}`);
}
for (const marker of ["focus-visible", "@media(max-width:900px)", "@media(max-width:720px)", "worker-check__result", "worker-check__back", "worker-find__province-row", "tl-consent-banner"]) {
  if (!css.includes(marker)) fail(`Giao diện tìm thông tin: thiếu ${marker}`);
}
if (css.includes("scroll-margin-top:82px")) fail("Tự kiểm tra: không được cộng hai lần khoảng tránh header");
if (!mobileUx.includes('header.querySelector(".tl-site-search-button, [data-open-site-search]")')) fail("Header: mobile UX chưa chặn nút tìm kiếm trùng");
if (Buffer.byteLength(css) > 9_000) fail(`worker-info-finder.css vượt ngân sách 9 KB: ${Buffer.byteLength(css)}`);
if (Buffer.byteLength(script) > 8_000) fail(`worker-info-finder.js vượt ngân sách 8 KB: ${Buffer.byteLength(script)}`);
if (Buffer.byteLength(home) > 90_000) fail(`Trang chủ vượt ngân sách 90 KB: ${Buffer.byteLength(home)}`);

try {
  new vm.Script(script, { filename: "worker-info-finder.js" });
} catch (error) {
  fail(`worker-info-finder.js không hợp lệ: ${error.message}`);
}

try {
  const searchButtons = [
    { dataset: {context: "header"}, addEventListener(name, fn) { this[name] = fn; } },
    { dataset: {context: "quick-finder"}, addEventListener(name, fn) { this[name] = fn; } },
  ];
  const provinceOption = { dataset: { provinceSlug: "nghe-an", provinceName: "Nghệ An" }, textContent: "Nghệ An" };
  const provinceSelect = { selectedOptions: [provinceOption], addEventListener(name, fn) { this[name] = fn; } };
  const provinceGo = { href: "", textContent: "", addEventListener(name, fn) { this[name] = fn; } };
  const checkResult = {
    hidden: true,
    dataset: {},
    innerHTML: "",
    focus() {},
    scrollIntoView() {},
  };
  const answers = new Map([
    ["age_range", "yes"],
    ["height_range", "yes"],
    ["weight_range", "yes"],
    ["health_screen", "yes"],
  ]);
  const firstInputs = new Map([...answers.keys()].map((name) => [name, { focus() {} }]));
  const checkForm = {
    addEventListener(name, fn) { this[name] = fn; },
    querySelector(selector) {
      const match = selector.match(/input\[name="([^"]+)"\](?::checked)?/);
      if (!match) return null;
      const name = match[1];
      if (!selector.endsWith(":checked")) return firstInputs.get(name);
      const value = answers.get(name);
      return value ? { value } : null;
    },
  };
  const documentStub = {
    querySelectorAll(selector) { return selector === "[data-worker-search]" ? searchButtons : []; },
    querySelector(selector) {
      return new Map([
        ["[data-worker-province-select]", provinceSelect],
        ["[data-worker-province-go]", provinceGo],
        ["[data-worker-check-form]", checkForm],
        ["[data-worker-check-result]", checkResult],
      ]).get(selector) || null;
    },
  };
  const windowStub = { dataLayer: [] };
  vm.runInNewContext(script, {
    document: documentStub,
    window: windowStub,
    location: { pathname: "/", origin: "https://thaylinhtuyenthomo.vn" },
    URL,
    URLSearchParams,
  }, { filename: "worker-info-finder.js" });

  if (!provinceGo.href.includes("/viec-lam-nganh-than/nghe-an/") || !provinceGo.href.includes("utm_campaign=worker_find_2026") || provinceGo.textContent !== "Xem Nghệ An") {
    fail("Bộ chọn tỉnh: không tạo đúng đường dẫn Nghệ An có đo nguồn");
  }
  checkForm.submit({ preventDefault() {} });
  if (checkResult.dataset.state !== "pass" || !checkResult.innerHTML.includes("Tiếp tục đăng ký") || !checkResult.innerHTML.includes("khám tuyển") || !checkResult.innerHTML.includes("Xem các mục cần biết")) {
    fail("Tự kiểm tra: nhánh phù hợp sơ bộ không trả kết quả an toàn");
  }
  answers.set("health_screen", "review");
  checkForm.submit({ preventDefault() {} });
  if (checkResult.dataset.state !== "review" || !checkResult.innerHTML.includes("Nhắn Zalo để hỏi") || !checkResult.innerHTML.includes("chưa phải kết luận cuối cùng") || !checkResult.innerHTML.includes("Xem các mục cần biết")) {
    fail("Tự kiểm tra: nhánh cần trao đổi không trả hướng dẫn phù hợp");
  }
  answers.set("weight_range", "");
  checkForm.submit({ preventDefault() {} });
  if (checkResult.dataset.state !== "incomplete" || !checkResult.innerHTML.includes("chưa chọn đủ 4 mục")) {
    fail("Tự kiểm tra: không cảnh báo khi thiếu câu trả lời");
  }
} catch (error) {
  fail(`Không chạy được kiểm thử hành vi tìm thông tin: ${error.message}`);
}

console.log(JSON.stringify({
  search_entry_points: count(home, "data-open-site-search"),
  province_options: optionSlugs.length,
  self_check_questions: 4,
  css_bytes: Buffer.byteLength(css),
  js_bytes: Buffer.byteLength(script),
  home_bytes: Buffer.byteLength(home),
  errors,
}, null, 2));

if (errors.length) process.exit(1);
