import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {communityArticles} from "./community-articles.mjs";

const root = path.resolve("tuyen-tho-mo");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const count = (text, marker) => text.split(marker).length - 1;
const errors = [];
const fail = (message) => errors.push(message);
const home = read("index.html");
const css = read("worker-info-finder.css");
const script = read("worker-info-finder.js");
const mobileUx = read("mobile-ux.js");
const richCss = read("home-rich-media.css");
const journeyScript = read("journey-optimizer.js");
const searchIndex = JSON.parse(read("search-index.json"));
const searchItems = Array.isArray(searchIndex.items) ? searchIndex.items : [];
const latestArticle = [...communityArticles]
  .sort((left, right) => new Date(right.published) - new Date(left.published))[0];

for (const [marker, expected] of [
  ['href="/worker-info-finder.css?v=2"', 1],
  ['src="/worker-info-finder.js?v=3"', 1],
  ['href="/home-rich-media.css?v=9"', 1],
  ['href="/journey-optimizer.css?v=2"', 1],
  ['src="/journey-optimizer.js?v=2"', 1],
  ['href="/mobile-ux.css?v=8"', 1],
  ['src="/mobile-ux.js?v=10"', 1],
  ["data-open-site-search", 1],
  ["data-worker-search", 1],
  ["data-open-worker-brief", 1],
  ["data-worker-check-form", 1],
]) if (count(home, marker) !== expected) fail(`Trang chủ: ${marker} phải xuất hiện ${expected} lần`);
if (home.includes('/journey-optimizer.css?v=1') || home.includes('/journey-optimizer.js?v=1')) fail("Trang chủ còn tải lặp hành trình phiên bản cũ");

for (const marker of [
  'class="home-funnel"',
  'class="home-journey"',
  'id="thong-tin"',
  'id="tu-kiem-tra"',
  'id="thuc-te"',
  'id="kho-noi-dung"',
  'id="quy-trinh"',
  'id="tu-van"',
  'class="home-journey__layout"',
  'class="home-journey__steps"',
  'class="home-journey__detail"',
  'href="/kiem-tra-dieu-kien/"',
  'href="/ho-so-nhap-hoc/"',
  'href="/thu-nhap-an-o-ho-tro/"',
  'class="contact-choice-grid"',
  'data-contact="application"',
  'data-contact="zalo"',
  'data-contact="messenger"',
  'data-contact="phone"',
  "Xem nhanh tin tuyển dụng",
  "Bài viết · Tin tức · Video",
]) if (!home.includes(marker)) fail(`Luồng tư vấn: thiếu ${marker}`);

for (const [href, label] of [
  ['/cam-nang-nghe-mo/', "Bài viết"],
  ['/tin-nganh-than/', "Tin ngành mỏ"],
  ['/anh-video-thuc-te/', "Video"],
]) {
  if (count(home, `href="${href}"`) < 2) fail(`Kho nội dung: liên kết ${label} phải có ở lối vào nhanh và khu nội dung`);
}

for (const removed of [
  'class="worker-quick"',
  'class="worker-recommended"',
  'class="home-gallery"',
  'class="v5-intent-hub"',
  'class="v4-final-conversion"',
  'class="v4-five-paths"',
  "data-worker-province-select",
  "data-province-video-facade",
  "data-worker-copy=",
  'class="hero-card"',
  'class="hero-facts"',
  'class="hero-proof-grid"',
  'class="consultation-path"',
  'class="worker-summary"',
  'class="worker-faq"',
  'class="verification-gateway"',
  'class="section process-section"',
]) if (home.includes(removed)) fail(`Trang chủ còn khối lặp hoặc thao tác phụ: ${removed}`);

const order = [
  ['class="hero"', "mở đầu bằng hình ảnh"],
  ['class="home-content-shortcuts"', "lối vào bài viết, tin và video"],
  ['class="worker-self-check"', "tự kiểm tra"],
  ['class="home-journey"', "lộ trình tư vấn"],
  ['class="home-proof"', "video và câu chuyện thực tế"],
  ['class="home-library"', "kho nội dung nghề mỏ"],
  ['class="worker-register"', "lựa chọn liên hệ"],
];
let previous = -1;
for (const [marker, label] of order) {
  const index = home.indexOf(marker);
  if (index < 0) fail(`Luồng đọc thiếu ${label}`);
  else if (index <= previous) fail(`Luồng đọc sai thứ tự tại ${label}`);
  previous = index;
}

for (const anchor of ["dieu-kien", "quyen-loi", "thoi-gian-hoc", "ho-tro-hoc-nghe", "ho-so", "noi-lam-viec", "dia-diem", "dang-ky"]) {
  if (count(home, `id="${anchor}"`) !== 1) fail(`Thông tin nhanh: neo #${anchor} phải có đúng một lần`);
}
if (!home.includes("Khai thác và xây dựng mỏ: 2–3 tháng") || !home.includes("Cơ điện mỏ: 10 tháng")) fail("Thời gian học chưa tách rõ theo nghề");
if (!home.includes('/assets/vinacomin-hoc-sinh-trai-nghiem-mo.webp')) fail("Thiếu ảnh học viên trải nghiệm thực tế");
if (!home.includes('/assets/vinacomin-tho-lo-tieu-bieu-pham-dinh-duan.webp')) fail("Thiếu ảnh câu chuyện người mới");
if (!home.includes('/assets/vinacomin-tho-mo-mong-duong-ao-xanh.webp')) fail("Thiếu ảnh tổ đội công nhân mặc bảo hộ xanh");
if (!home.includes('/assets/vinacomin-to-doi-mong-duong-ao-xanh.webp')) fail("Thiếu ảnh câu chuyện tổ đội công nhân áo xanh");
if (!home.includes(`href="/${latestArticle.urlPath}/"`)) fail("Thiếu URL bài ngành Than mới nhất trên trang chủ");
if (!home.includes(`src="${latestArticle.image}"`)) fail("Thiếu ảnh nguồn của bài ngành Than mới nhất trên trang chủ");
if (!home.includes(`>${latestArticle.title}</strong>`)) fail("Thiếu tiêu đề bài ngành Than mới nhất trên trang chủ");
const heroBlock = home.match(/<section class="hero"[\s\S]*?<\/section>/i)?.[0] || "";
if (!heroBlock.includes('class="hero-visual"')) fail("Mở đầu chưa có ảnh thực tế độc lập");
if ((heroBlock.match(/<(?:a|button)\b[^>]*class="[^"]*\bbutton\b[^"]*"/g) || []).length > 2) fail("Mở đầu còn quá nhiều nút");
if ((heroBlock.match(/<p\b/g) || []).length > 2) fail("Mở đầu còn quá nhiều đoạn chữ");
if (home.includes('/assets/vinacomin-dao-tao-tho-lo.webp')) fail("Trang chủ còn ảnh cán bộ phát biểu sai ngữ cảnh");
if (count(home, "data-featured-video-facade") !== 1) fail("Trang chủ cần đúng một video mở theo yêu cầu");
if (home.includes('https://i.ytimg.com')) fail("Ảnh đại diện video còn phụ thuộc máy chủ ngoài");

const contactSectionStart = home.indexOf('class="worker-register"');
const contactSectionEnd = home.indexOf("</section>", contactSectionStart);
const contactSection = contactSectionStart >= 0 && contactSectionEnd > contactSectionStart ? home.slice(contactSectionStart, contactSectionEnd) : "";
for (const [channel, label] of [["application", "biểu mẫu"], ["zalo", "Zalo"], ["messenger", "Messenger"], ["phone", "gọi điện"]]) {
  if (count(contactSection, `data-contact="${channel}"`) !== 1) fail(`Cuối hành trình thiếu đúng một lựa chọn ${label}`);
}

try {
  const blocks = [...home.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (blocks.length !== 1) fail(`Dữ liệu cấu trúc trang chủ: cần một khối, nhận ${blocks.length}`);
  else {
    const graph = JSON.parse(blocks[0][1])["@graph"] || [];
    if (graph.filter((node) => node?.["@type"] === "Person").length !== 1) fail("Dữ liệu cấu trúc phải có đúng một người tư vấn");
    if (graph.filter((node) => node?.["@type"] === "Organization").length !== 1) fail("Dữ liệu cấu trúc phải có đúng một đơn vị");
  }
} catch (error) { fail(`Dữ liệu cấu trúc không hợp lệ: ${error.message}`); }

for (const name of ["age_range", "height_range", "weight_range", "health_screen"]) {
  if (count(home, `name="${name}"`) !== 2) fail(`Tự kiểm tra: ${name} phải có hai lựa chọn`);
}
for (const marker of ["4 câu · không lưu dữ liệu", "Chưa cần nộp hồ sơ", "Khám tuyển là căn cứ xác nhận cuối cùng"]) {
  if (!home.includes(marker)) fail(`Tự kiểm tra: thiếu ${marker}`);
}

const directAnswers = ["/#dieu-kien", "/#quyen-loi", "/#thoi-gian-hoc", "/#ho-tro-hoc-nghe", "/#ho-so", "/#dia-diem", "/#noi-lam-viec", "/#quy-trinh", "/#dang-ky"];
if (searchIndex.version !== 3) fail(`Tìm kiếm: cần chỉ mục phiên bản 3, nhận ${searchIndex.version}`);
for (const url of directAnswers) if (!searchItems.some((item) => item.url === url && item.type === "Trả lời nhanh" && Number(item.priority) >= 200)) fail(`Tìm kiếm thiếu câu trả lời ưu tiên ${url}`);

for (const marker of ["worker_search_open", "worker_self_check_complete", "worker_self_check_incomplete", "worker_self_check_2026", 'data-contact="application"', 'data-contact="zalo"']) {
  if (!script.includes(marker)) fail(`Hành vi tự kiểm tra thiếu ${marker}`);
}
for (const prohibited of ["localStorage", "sessionStorage", "fetch(", "XMLHttpRequest", "sendBeacon", "FormData", "document.cookie"]) {
  if (script.includes(prohibited)) fail(`Tự kiểm tra không được lưu hoặc gửi dữ liệu: ${prohibited}`);
}
for (const marker of ["focus-visible", "@media(max-width:900px)", "@media(max-width:720px)", "worker-check__result", "worker-check__back"]) if (!css.includes(marker)) fail(`CSS tự kiểm tra thiếu ${marker}`);
for (const marker of ["hero-visual", "home-content-shortcuts", "home-journey__layout", "home-journey__steps", "home-proof__grid--simple", "home-library__grid", "contact-choice-grid"]) if (!richCss.includes(marker)) fail(`CSS luồng tư vấn thiếu ${marker}`);
for (const marker of ['["home", "article"].includes(currentGroup)', 'currentGroup !== "home" && !actions.querySelector(\'a[href^="tel:"]\')']) if (!journeyScript.includes(marker)) fail(`Trang chủ chưa khóa thành phần chèn thừa: ${marker}`);
for (const marker of ["grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)", ".home-funnel .worker-check{padding:0;border:0;background:transparent;box-shadow:none}", ".contact-choice{min-height:86px", ".home-library__card img{display:block;width:100%;height:clamp(196px,18vw,238px)", ".home-library__grid{grid-template-columns:1fr;gap:12px", ".home-library__card{display:grid;grid-template-columns:116px minmax(0,1fr)", ".site-footer--home .footer-simple", ".mobile-contact{grid-template-columns:repeat(3,minmax(0,1fr))!important}"]) if (!richCss.includes(marker)) fail(`CSS mobile-first thiếu ${marker}`);
if (!mobileUx.includes('const MESSENGER_URL = "https://m.me/thaylinhtuyenthomo"')) fail("Thanh liên hệ di động thiếu Messenger");
if (Buffer.byteLength(script) > 4_000) fail(`worker-info-finder.js vượt ngân sách 4 KB: ${Buffer.byteLength(script)}`);
if (Buffer.byteLength(home) <= 16_384) fail(`Trang chủ có dấu hiệu bị cắt tệp: ${Buffer.byteLength(home)} byte`);
if (Buffer.byteLength(read("search-index.json")) <= 100_000) fail("Chỉ mục tìm kiếm có dấu hiệu bị cắt tệp");
if (Buffer.byteLength(home) > 55_000) fail(`Trang chủ vượt ngân sách 55 KB: ${Buffer.byteLength(home)}`);

try { new vm.Script(script, { filename: "worker-info-finder.js" }); }
catch (error) { fail(`worker-info-finder.js không hợp lệ: ${error.message}`); }

try {
  const searchButton = { dataset: { context: "header" }, addEventListener(name, fn) { this[name] = fn; } };
  const result = { hidden: true, dataset: {}, innerHTML: "", focus() {}, scrollIntoView() {} };
  const answers = new Map([["age_range", "yes"], ["height_range", "yes"], ["weight_range", "yes"], ["health_screen", "yes"]]);
  const inputs = new Map([...answers.keys()].map((name) => [name, { focus() {} }]));
  const form = { addEventListener(name, fn) { this[name] = fn; }, querySelector(selector) {
    const match = selector.match(/input\[name="([^"]+)"\](?::checked)?/);
    if (!match) return null;
    if (!selector.endsWith(":checked")) return inputs.get(match[1]);
    const value = answers.get(match[1]);
    return value ? { value } : null;
  }};
  const documentStub = { querySelectorAll(selector) { return selector === "[data-worker-search]" ? [searchButton] : []; }, querySelector(selector) { return new Map([["[data-worker-check-form]", form], ["[data-worker-check-result]", result]]).get(selector) || null; } };
  vm.runInNewContext(script, { document: documentStub, window: { dataLayer: [] }, location: { pathname: "/" } }, { filename: "worker-info-finder.js" });
  form.submit({ preventDefault() {} });
  if (result.dataset.state !== "pass" || !result.innerHTML.includes("Tiếp tục đăng ký") || !result.innerHTML.includes("khám tuyển")) fail("Tự kiểm tra: nhánh phù hợp không an toàn");
  answers.set("health_screen", "review");
  form.submit({ preventDefault() {} });
  if (result.dataset.state !== "review" || !result.innerHTML.includes("Nhắn Zalo để hỏi") || !result.innerHTML.includes("chưa phải kết luận cuối cùng")) fail("Tự kiểm tra: nhánh cần trao đổi không phù hợp");
  answers.set("weight_range", "");
  form.submit({ preventDefault() {} });
  if (result.dataset.state !== "incomplete" || !result.innerHTML.includes("chưa chọn đủ 4 mục")) fail("Tự kiểm tra: không cảnh báo khi thiếu câu trả lời");
} catch (error) { fail(`Không chạy được kiểm thử tự kiểm tra: ${error.message}`); }

console.log(JSON.stringify({
  consultation_steps: 4,
  visible_video_facades: count(home, "data-featured-video-facade"),
  contact_channels: 4,
  self_check_questions: 4,
  js_bytes: Buffer.byteLength(script),
  home_bytes: Buffer.byteLength(home),
  errors,
}, null, 2));
if (errors.length) process.exit(1);
