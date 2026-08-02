import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("content", "home-worker-first");
const siteRoot = path.resolve("tuyen-tho-mo");
const target = path.join(siteRoot, "index.html");
const provinceFile = path.join(siteRoot, "data", "provinces-2026.json");
const expectedParts = Array.from({length: 8}, (_, index) => `part-${String(index).padStart(2, "0")}.b64`);
const actualParts = fs.readdirSync(sourceDir)
  .filter((name) => /^part-\d+\.b64$/.test(name))
  .sort();

if (JSON.stringify(actualParts) !== JSON.stringify(expectedParts)) {
  throw new Error(`Worker-first homepage source is incomplete: ${actualParts.join(", ")}`);
}

const encoded = actualParts
  .map((name) => fs.readFileSync(path.join(sourceDir, name), "utf8").replace(/\s+/g, ""))
  .join("");
const sourceHtml = Buffer.from(encoded, "base64").toString("utf8");
const sourceBytes = Buffer.byteLength(sourceHtml);
const sourceSha256 = crypto.createHash("sha256").update(sourceHtml).digest("hex");

if (!sourceHtml.startsWith("<!doctype html>")) throw new Error("Worker-first homepage is not valid HTML");
if (!sourceHtml.includes('id="noi-dung"') || !sourceHtml.includes('id="dieu-kien"') || !sourceHtml.includes('id="dang-ky"')) {
  throw new Error("Worker-first homepage is missing required navigation anchors");
}
if (sourceBytes !== 32653 || sourceSha256 !== "915d085bff4a83c44e1c7bfe6ec8d0962b87fe173493f140af05e0b472cd9f84") {
  throw new Error(`Worker-first homepage source checksum mismatch: ${sourceBytes} bytes, ${sourceSha256}`);
}

const provinceData = JSON.parse(fs.readFileSync(provinceFile, "utf8"));
const provinces = Array.isArray(provinceData.provinces) ? provinceData.provinces : [];
if (provinces.length !== 26) throw new Error(`Worker information finder expected 26 provinces, got ${provinces.length}`);

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const regions = [...new Set(provinces.map((province) => province.region))];
const provinceOptions = [
  '<option value="">Chọn tỉnh đang sinh sống</option>',
  ...regions.flatMap((region) => [
    `<optgroup label="${esc(region)}">`,
    ...provinces.filter((province) => province.region === region).map((province) => {
      const aliases = Array.isArray(province.aliases) && province.aliases.length
        ? ` · gồm ${province.aliases.join(", ")}`
        : "";
      return `<option value="${esc(province.slug)}" data-province-slug="${esc(province.slug)}" data-province-name="${esc(province.name)}">${esc(province.name + aliases)}</option>`;
    }),
    "</optgroup>",
  ]),
].join("");

const trackedApplicationLinks = [
  ["home-header", "header"],
  ["home-hero", "hero"],
  ["home-register", "register"],
  ["home-mobile", "mobile"],
];

const searchIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
const headerSearch = `<button class="worker-header-search" type="button" data-open-site-search data-worker-search data-context="header" aria-haspopup="dialog" aria-label="Tìm thông tin trên website">${searchIcon}<span class="sr-only">Tìm thông tin</span></button>`;
const finder = `      <div class="worker-find" aria-label="Công cụ tìm thông tin nhanh">
        <button class="worker-find__search" type="button" data-open-site-search data-worker-search data-context="quick-finder" aria-haspopup="dialog">
          <span class="worker-find__search-icon">${searchIcon}</span>
          <span><strong>Tìm trong toàn bộ website</strong><small>Nhập “hồ sơ”, “thu nhập”, “sức khỏe”, tên nghề hoặc tên tỉnh…</small></span>
        </button>
        <div class="worker-find__province">
          <label for="worker-province-select">Tìm thông tin theo tỉnh</label>
          <div class="worker-find__province-row">
            <select id="worker-province-select" data-worker-province-select>${provinceOptions}</select>
            <a class="worker-find__province-go" href="/viec-lam-nganh-than/" data-worker-province-go>Xem danh sách tỉnh</a>
          </div>
          <p>Không thấy tỉnh phù hợp? <a href="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=worker_find_2026&amp;utm_content=province_other#dang-ky" data-contact="application" data-context="worker-province-other">Đăng ký theo biểu mẫu chung</a>.</p>
        </div>
      </div>
`;
const selfCheck = `    <section class="worker-self-check" id="tu-kiem-tra" aria-labelledby="worker-self-check-title">
      <div class="container">
        <div class="worker-self-check__head">
          <div><p class="eyebrow">30 giây · không gửi dữ liệu</p><h2 id="worker-self-check-title">Tự kiểm tra điều kiện sơ bộ</h2></div>
          <p>Chọn câu trả lời cho 4 điều kiện dưới đây. Kết quả chỉ giúp định hướng ban đầu; khám tuyển là căn cứ xác nhận cuối cùng.</p>
        </div>
        <form class="worker-check" data-worker-check-form novalidate>
          <div class="worker-check__questions">
            <fieldset><legend><span>01</span><strong>Bạn là nam từ 18 đến 40 tuổi?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="age_range" value="yes"><span>Có</span></label><label><input type="radio" name="age_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
            <fieldset><legend><span>02</span><strong>Chiều cao của bạn từ 1m53 trở lên?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="height_range" value="yes"><span>Có</span></label><label><input type="radio" name="height_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
            <fieldset><legend><span>03</span><strong>Cân nặng của bạn từ 47kg trở lên?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="weight_range" value="yes"><span>Có</span></label><label><input type="radio" name="weight_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
            <fieldset><legend><span>04</span><strong>Bạn có sức khỏe tốt, không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt?</strong></legend><div class="worker-check__choices"><label><input type="radio" name="health_screen" value="yes"><span>Có</span></label><label><input type="radio" name="health_screen" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
          </div>
          <div class="worker-check__footer"><p><strong>Không lưu câu trả lời.</strong> Đăng ký ban đầu vẫn chưa cần nộp hồ sơ.</p><button class="worker-check__submit" type="submit">Xem kết quả sơ bộ</button></div>
          <div class="worker-check__result" data-worker-check-result role="status" aria-live="polite" tabindex="-1" hidden></div>
        </form>
      </div>
    </section>

`;

function replaceOnce(text, marker, replacement, label) {
  const occurrences = text.split(marker).length - 1;
  if (occurrences !== 1) throw new Error(`${label}: expected one marker, got ${occurrences}`);
  return text.replace(marker, replacement);
}

let html = sourceHtml;
html = replaceOnce(html, "</head>", '  <link rel="stylesheet" href="/worker-info-finder.css?v=2">\n</head>', "Worker information finder stylesheet");
html = replaceOnce(html, '<button class="menu-toggle" type="button"', `${headerSearch}\n      <button class="menu-toggle" type="button"`, "Header search button");
html = replaceOnce(html, 'href="#dieu-kien">Tự kiểm tra điều kiện</a>', 'href="#tu-kiem-tra">Tự kiểm tra điều kiện</a>', "Hero self-check link");
html = replaceOnce(html, '<span data-application-resume-label>Đăng ký nhanh</span>', '<span data-application-resume-label>Đăng ký – chưa cần hồ sơ</span>', "Hero application reassurance");
html = replaceOnce(html, 'href="#dieu-kien"><b>01</b>', 'href="#tu-kiem-tra"><b>01</b>', "Quick self-check link");
html = replaceOnce(html, '      <nav class="worker-quick__grid" aria-label="Thông tin nhanh cho người lao động">', `${finder}      <nav class="worker-quick__grid" aria-label="Thông tin nhanh cho người lao động">`, "Worker finder block");
html = replaceOnce(html, '    <section class="worker-summary" id="dieu-kien">', `${selfCheck}    <section class="worker-summary" id="dieu-kien"><span id="che-do-ho-so" aria-hidden="true"></span>`, "Self-check and compatibility anchor");
html = replaceOnce(html, '<section class="worker-more" aria-labelledby="worker-more-title">', '<section class="worker-more" aria-labelledby="worker-more-title"><span id="theo-tinh" aria-hidden="true"></span>', "Province compatibility anchor");
html = replaceOnce(html, 'src="/mobile-ux.js?v=4"', 'src="/mobile-ux.js?v=5"', "Homepage mobile UX version");
html = replaceOnce(html, "</body>", '  <script src="/worker-info-finder.js?v=2" defer></script>\n</body>', "Worker information finder script");

for (const required of ['id="tu-kiem-tra"', "data-open-site-search", "data-worker-province-select", "data-worker-check-form", 'id="che-do-ho-so"', 'id="theo-tinh"']) {
  if (!html.includes(required)) throw new Error(`Worker-first homepage is missing generated feature: ${required}`);
}

for (const [context, content] of trackedApplicationLinks) {
  const marker = `href="viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky" data-contact="application" data-context="${context}"`;
  const trackedHref = `href="viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&amp;utm_medium=internal&amp;utm_campaign=home_to_application_2026&amp;utm_content=home_${content}#dang-ky" data-contact="application" data-context="${context}"`;
  if (!html.includes(marker)) throw new Error(`Worker-first homepage is missing tracked application link: ${context}`);
  html = html.replace(marker, trackedHref);
}

const outputBytes = Buffer.byteLength(html);
const outputSha256 = crypto.createHash("sha256").update(html).digest("hex");
fs.writeFileSync(target, html);
console.log(JSON.stringify({
  target: "tuyen-tho-mo/index.html",
  parts: actualParts.length,
  sourceBytes,
  sourceSha256,
  outputBytes,
  outputSha256,
  compatibilityAnchors: 2,
  searchEntryPoints: 2,
  selfCheckQuestions: 4,
  provinceOptions: provinces.length,
  trackedApplicationLinks: trackedApplicationLinks.length,
}, null, 2));
