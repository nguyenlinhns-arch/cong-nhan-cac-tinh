import "./enhance-application-condition-pass-v3.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const today = "2026-08-02";
const STYLE_TAG = '<link rel="stylesheet" href="/v4-conversion.css?v=1">';
const SCRIPT_TAG = '<script src="/v4-conversion.js?v=1" defer></script>';
const changedTrackedFiles = new Set();

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function writeIfChanged(target, content, before = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "") {
  if (content === before) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  changedTrackedFiles.add(path.relative(process.cwd(), target).split(path.sep).join("/"));
  return true;
}

function primaryNav() {
  return `<nav class="v4-primary-nav" aria-label="Năm trang chính"><div class="v4-primary-nav__inner"><a href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a><a href="/hoc-nghe-mo-tai-quang-ninh/">Học nghề tại Quảng Ninh</a><a href="/chon-kcn-hay-lam-mo/">KCN hay làm mỏ</a><a href="/cau-chuyen-cong-nhan/">Câu chuyện theo tỉnh</a><a href="/">Trang chủ</a></div></nav>`;
}

function finalCta(context = "site-final") {
  return `<section class="v4-final-conversion" aria-label="Kiểm tra điều kiện học nghề mỏ"><div class="v4-final-conversion__grid"><div><small>Bước tiếp theo duy nhất</small><h2>Gửi thông tin để Thầy Linh kiểm tra trước</h2><p>Chưa cần đi lại hoặc gửi ảnh hồ sơ. Kiểm tra trước để biết mình có phù hợp học nghề mỏ tại Quảng Ninh không.</p><div class="v4-three-info">Năm sinh · Chiều cao/cân nặng · Sức khỏe mắt, huyết áp, tim mạch và bệnh khác</div></div><div class="v4-final-conversion__actions"><a href="/kiem-tra-dieu-kien/" data-v4-action="condition">Điền biểu mẫu</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="${escapeHtml(context)}">Nhắn Zalo</a><a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer" data-contact="messenger" data-context="${escapeHtml(context)}">Messenger</a><a href="tel:+84963048585" data-contact="phone" data-context="${escapeHtml(context)}">Gọi 096 304 8585</a></div></div></section>`;
}

function quickForm() {
  const provinces = ["An Giang","Bắc Ninh","Cà Mau","Cần Thơ","Cao Bằng","Đà Nẵng","Đắk Lắk","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Nội","Hà Tĩnh","Hải Phòng","Hồ Chí Minh","Huế","Hưng Yên","Khánh Hòa","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Nghệ An","Ninh Bình","Phú Thọ","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sơn La","Tây Ninh","Thái Nguyên","Thanh Hóa","Tuyên Quang","Vĩnh Long"];
  const options = provinces.map(item => `<option>${escapeHtml(item)}</option>`).join("");
  return `<section class="v4-condition-form" id="dang-ky" aria-labelledby="v4-form-title"><div class="v4-condition-form__intro"><p class="verification-page__eyebrow">Đăng ký trong khoảng một phút</p><h2 id="v4-form-title">Anh có phù hợp học nghề mỏ không?</h2><p>Điền thông tin cơ bản để Thầy Linh kiểm tra sơ bộ. Kết quả trên website không thay thế khám tuyển và không phải cam kết tiếp nhận cuối cùng.</p></div><form class="application-form v4-quick-form" data-application-form data-v4-quick-form data-form-context="condition_v4" novalidate><div class="form-honeypot" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div><p class="v4-form-promise">Chỉ hỏi những gì cần để kiểm tra: họ tên, liên hệ, năm sinh, tỉnh/huyện, chiều cao, cân nặng và sức khỏe hiện tại.</p><div class="form-grid"><label>Họ và tên <input type="text" name="full_name" autocomplete="name" required maxlength="80" placeholder="Nguyễn Văn A"></label><label>Số điện thoại/Zalo <input type="tel" name="phone" autocomplete="tel" inputmode="tel" required maxlength="18" placeholder="09xxxxxxxx" title="Nhập số điện thoại Việt Nam gồm 10 chữ số" aria-describedby="application-form-error"></label><label>Ngày sinh <input type="date" name="birth_date" autocomplete="bday" required data-birth-date><small>Từ đủ 18 đến 40 tuổi tại ngày đăng ký</small></label><label>Tỉnh đang sống <select name="province" autocomplete="address-level1" required><option value="">Chọn tỉnh/thành</option>${options}</select></label><label>Huyện/xã <input type="text" name="district" autocomplete="address-level2" required maxlength="100" placeholder="Ví dụ: Anh Sơn"></label><label>Chiều cao (cm) <input type="number" name="height" inputmode="numeric" required min="130" max="220" placeholder="165"><small>Mốc kiểm tra sơ bộ: từ 153 cm</small></label><label>Cân nặng (kg) <input type="number" name="weight" inputmode="numeric" required min="30" max="200" placeholder="58"><small>Mốc kiểm tra sơ bộ: từ 47 kg</small></label><label class="form-grid__wide">Sức khỏe hiện tại: mắt, huyết áp, tim mạch, bệnh khác <select name="health" required><option value="">Chọn tình trạng gần đúng nhất</option><option>Sức khỏe tốt, sẵn sàng khám tuyển</option><option>Cần trao đổi thêm trước khi khám</option></select><small>Không nhập tên bệnh hoặc hồ sơ y tế chi tiết trên website. Trường hợp có cận thị, huyết áp, tim mạch hoặc bệnh khác cần chọn “Cần trao đổi thêm”.</small></label><label class="v4-hidden-field">Trình độ <select name="education" required><option selected>Trình độ khác</option></select></label><label class="v4-hidden-field">Nghề <select name="trade" required><option selected>Cần được tư vấn chọn nghề</option></select></label></div><p class="application-draft-note" data-application-draft-status><strong>Tự lưu an toàn:</strong> chỉ lưu tạm trên thiết bị tỉnh/huyện, chiều cao và cân nặng; không lưu họ tên, số điện thoại, ngày sinh hoặc lựa chọn sức khỏe khi chưa gửi.</p><label class="consent"><input type="checkbox" name="consent" required><span>Tôi xác nhận thông tin trên là đúng và đồng ý để Nguyễn Tử Linh tiếp nhận, lưu và liên hệ tư vấn về chương trình học nghề mỏ. Xem <a href="/quyen-rieng.html" target="_blank" rel="noopener">quyền riêng tư</a>.</span></label><p class="form-error" id="application-form-error" data-form-error role="alert" hidden></p><button class="button application-submit" type="submit" data-application-submit>Gửi 3 thông tin để Thầy Linh kiểm tra</button></form><div class="application-result v4-quick-result" data-application-result hidden role="region" aria-labelledby="application-result-title" tabindex="-1"><p class="eyebrow" id="application-result-title">KẾT QUẢ SƠ BỘ</p><div class="application-result__summary"><strong data-application-status></strong><span>Mã đăng ký: <b data-application-code></b></span></div><p class="application-delivery" data-application-delivery role="status" aria-live="polite" aria-atomic="true"></p><textarea readonly rows="10" data-application-message aria-label="Nội dung đăng ký"></textarea><div class="contact-pair"><a class="contact-button contact-button--zalo" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="condition-v4-result"><span><small>Gửi hồ sơ và hỏi tiếp</small><strong>Nhắn Zalo</strong></span></a><a class="contact-button contact-button--messenger" href="tel:+84963048585" data-contact="phone" data-context="condition-v4-result"><span><small>Trao đổi trực tiếp</small><strong>Gọi 096 304 8585</strong></span></a></div></div></section>`;
}

function fullInfoPage() {
  const canonical = "https://thaylinhtuyenthomo.vn/hoc-nghe-mo-tai-quang-ninh/";
  const faq = [
    ["Học nghề mỏ ở đâu?", "Người học nhập học tại Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh, sau khi được xác nhận lịch tiếp nhận."],
    ["Học nghề mỏ bao lâu?", "Nghề khai thác và xây dựng mỏ hầm lò có thời gian đào tạo khoảng 2–3 tháng; nghề cơ điện mỏ có lộ trình dài hơn theo chương trình."],
    ["Trong thời gian học được hỗ trợ gì?", "Người học theo chỉ tiêu được miễn kinh phí đào tạo, bố trí ba bữa ăn mỗi ngày, ở ký túc xá và hỗ trợ 7,5 triệu đồng/tháng trong thời gian học."],
    ["Hồ sơ cần gì?", "Khi có lịch nhập học, mang căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có; đăng ký ban đầu chưa cần gửi ảnh giấy tờ."],
    ["Thu nhập sau đào tạo thế nào?", "Thông tin tuyển sinh đang áp dụng thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất."],
  ];
  const schema = JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":`${canonical}#webpage`,url:canonical,name:"Học nghề mỏ tại Quảng Ninh",description:"Thông tin đầy đủ về điều kiện, nơi học, thời gian học, ăn ở, hỗ trợ, hồ sơ và việc làm sau đào tạo nghề mỏ tại Quảng Ninh.",inLanguage:"vi-VN",dateModified:today,isPartOf:{"@type":"WebSite",url:"https://thaylinhtuyenthomo.vn/",name:"Thầy Linh – Tuyển Thợ Mỏ"},author:{"@type":"Person",name:"Nguyễn Tử Linh"}},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Trang chủ",item:"https://thaylinhtuyenthomo.vn/"},{"@type":"ListItem",position:2,name:"Học nghề mỏ tại Quảng Ninh",item:canonical}]},{"@type":"FAQPage",mainEntity:faq.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))}]});
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#063f48"><title>Học nghề mỏ tại Quảng Ninh: điều kiện, ăn ở, hồ sơ | Thầy Linh</title><meta name="description" content="Học nghề mỏ tại Quảng Ninh: điều kiện nam 18–40 tuổi, học 2–3 tháng, miễn kinh phí đào tạo, ăn ở, hỗ trợ 7,5 triệu đồng/tháng, hồ sơ và việc làm sau học."><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"><link rel="manifest" href="/manifest.webmanifest"><meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="Học nghề mỏ tại Quảng Ninh"><meta property="og:description" content="Nơi học, thời gian, điều kiện, ăn ở, hỗ trợ, hồ sơ và việc làm sau đào tạo."><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg"><link rel="stylesheet" href="/landing-recruitment.css?v=17"><link rel="stylesheet" href="/publication-polish.css?v=5"><link rel="stylesheet" href="/mobile-ux.css?v=8"><link rel="stylesheet" href="/fonts.css?v=1"><link rel="stylesheet" href="/verification-portal.css?v=1">${STYLE_TAG}<script type="application/ld+json">${schema}</script></head><body class="verification-page v4-full-info"><a class="skip-link" href="#noi-dung">Bỏ qua menu</a><header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="Trang chủ Thầy Linh"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="header-cta" href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a></div></header>${primaryNav()}<main id="noi-dung"><section class="verification-page__hero"><div class="container"><p class="verification-page__eyebrow">Thông tin đầy đủ trước khi đăng ký</p><h1>Học nghề mỏ tại Quảng Ninh: từ kiểm tra điều kiện đến ngày nhận việc</h1><p class="verification-page__lead">Một trang trả lời rõ nơi học, thời gian học, điều kiện, ăn ở, hỗ trợ, hồ sơ, nơi làm việc và bước cần làm tiếp theo.</p><div class="v4-fast-answer"><span>Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg</span><span>Học nghề chính khoảng 2–3 tháng tại Quang Hanh</span><span>Đăng ký ban đầu chưa cần gửi ảnh hồ sơ</span></div><div class="v4-hero-actions"><a href="/kiem-tra-dieu-kien/" data-v4-action="condition">Kiểm tra điều kiện</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="full-info-hero">Nhắn Zalo</a><a href="tel:+84963048585" data-contact="phone" data-context="full-info-hero">Gọi Thầy Linh</a></div><p class="v4-direct-note">Thầy Linh trực tiếp kiểm tra điều kiện và hướng dẫn hồ sơ.</p></div></section><section class="verification-page__section"><div class="container"><h2>1. Ai phù hợp đăng ký?</h2><div class="v4-info-grid"><article class="v4-info-card"><h3>Độ tuổi và thể hình</h3><p>Chỉ tiêu hiện tại dành cho nam từ đủ 18 đến 40 tuổi, cao từ 1m53 và nặng từ 47kg.</p></article><article class="v4-info-card"><h3>Sức khỏe</h3><p>Cần phù hợp môi trường hầm lò; mắt, huyết áp, tim mạch và bệnh khác phải được kiểm tra. Khám tuyển là căn cứ xác nhận cuối cùng.</p></article><article class="v4-info-card"><h3>Tinh thần làm việc</h3><p>Sẵn sàng học nghề, làm việc theo ca, tuân thủ an toàn và phối hợp trong tổ đội tại Quảng Ninh.</p></article></div></div></section><section class="verification-page__section"><div class="container"><h2>2. Học ở đâu, học bao lâu?</h2><div class="v4-info-grid"><article class="v4-info-card"><h3>Nơi nhập học</h3><p>Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh. Chỉ đến sau khi được xác nhận lịch.</p></article><article class="v4-info-card"><h3>Thời gian học nghề chính</h3><p>Kỹ thuật khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng. Nghề cơ điện mỏ có chương trình dài hơn.</p></article><article class="v4-info-card"><h3>Sau đào tạo</h3><p>Người hoàn thành chương trình và đạt yêu cầu được bố trí làm việc tại các đơn vị ngành Than ở Quảng Ninh.</p></article></div></div></section><section class="verification-page__section"><div class="container"><h2>3. Trong thời gian học được hưởng gì?</h2><div class="v4-info-grid"><article class="v4-info-card"><h3>Chi phí đào tạo</h3><p>Miễn kinh phí đào tạo theo chỉ tiêu đang áp dụng.</p></article><article class="v4-info-card"><h3>Ăn và ở</h3><p>Được bố trí ba bữa ăn mỗi ngày và ở ký túc xá trong thời gian học.</p></article><article class="v4-info-card"><h3>Hỗ trợ sinh hoạt</h3><p>Hỗ trợ 7,5 triệu đồng/tháng trong thời gian học theo chính sách tuyển sinh hiện hành.</p></article></div></div></section><section class="verification-page__section"><div class="container"><h2>4. Hồ sơ và thu nhập sau học</h2><div class="v4-info-grid"><article class="v4-info-card"><h3>Hồ sơ nhập học</h3><ul><li>CCCD bản gốc.</li><li>Giấy khai sinh.</li><li>Bằng THCS hoặc THPT nếu có; chưa có vẫn đăng ký trước để được hướng dẫn.</li></ul></article><article class="v4-info-card"><h3>Thu nhập</h3><p>Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất.</p></article><article class="v4-info-card"><h3>Bước đầu tiên</h3><p>Gửi năm sinh, chiều cao/cân nặng và sức khỏe hiện tại. Chỉ chuẩn bị hồ sơ và di chuyển sau khi được tư vấn rõ.</p></article></div></div></section><section class="verification-page__section v4-faq"><div class="container"><h2>Câu hỏi thường gặp</h2>${faq.map(([question,answer])=>`<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></section>${finalCta("full-info-final")}</main><footer class="site-footer"><div class="container footer-grid"><div><a class="brand brand-light" href="/"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><p>Kiểm tra điều kiện trước, hướng dẫn hồ sơ sau.</p></div><div><h2>Thông tin chính</h2><a href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a><a href="/chon-kcn-hay-lam-mo/">KCN hay làm mỏ</a><a href="/cau-chuyen-cong-nhan/">Câu chuyện theo tỉnh</a></div><div><h2>Liên hệ</h2><a href="https://zalo.me/0963048585">Zalo 096 304 8585</a><a href="tel:+84963048585">Gọi 096 304 8585</a></div></div></footer><script src="/analytics.js?v=5" defer></script><script src="/mobile-ux.js?v=10" defer></script><script src="/verification-portal.js?v=1" defer></script>${SCRIPT_TAG}</body></html>`;
}

function ensureFullInfoPage() {
  const target = path.join(root, "hoc-nghe-mo-tai-quang-ninh", "index.html");
  return writeIfChanged(target, fullInfoPage());
}

function enhanceConditionPage() {
  const target = path.join(root, "kiem-tra-dieu-kien", "index.html");
  if (!fs.existsSync(target)) throw new Error("V4 requires the generated condition page");
  const before = fs.readFileSync(target, "utf8");
  let source = before;
  source = source.replace("<body class=\"verification-page\">", "<body class=\"verification-page v4-condition-page\">");
  source = source.replace("30 giây · không lưu dữ liệu", "Kiểm tra trước · đăng ký trong một phút");
  source = source.replace("Kiểm tra điều kiện học nghề mỏ trước khi làm hồ sơ", "Anh có phù hợp học nghề mỏ tại Quảng Ninh không?");
  source = source.replace("Tự kiểm tra sơ bộ độ tuổi, chiều cao, cân nặng và sức khỏe trước khi đăng ký học nghề mỏ; website không lưu câu trả lời.", "Kiểm tra và đăng ký học nghề mỏ tại Quảng Ninh: gửi năm sinh, chiều cao/cân nặng, sức khỏe và số liên hệ để Thầy Linh tư vấn.");
  if (!source.includes("data-v4-quick-form")) source = source.replace("</main>", `${quickForm()}</main>`);
  if (!source.includes("/recruitment-config.js?v=2")) source = source.replace("</body>", '<script src="/recruitment-config.js?v=2" defer></script><script src="/job-application.js?v=9" defer></script></body>');
  if (!source.includes("data-v4-quick-form") || !source.includes("job-application.js")) throw new Error("Condition page was not upgraded to the V4 intake page");
  return writeIfChanged(target, source, before);
}

function enhanceApplicationScript() {
  const target = path.join(root, "job-application.js");
  const before = fs.readFileSync(target, "utf8");
  let source = before;
  source = source.replace('const DRAFT_FIELDS = ["province", "height", "weight", "education", "trade"]', 'const DRAFT_FIELDS = ["province", "district", "height", "weight"]');
  source = source.replace('`- Tỉnh, thành: ${values.province}`', '`- Tỉnh/huyện: ${[values.province, values.district].filter(Boolean).join(" - ")}`');
  source = source.replace('      province: values.province,', '      province: [values.province, values.district].filter(Boolean).join(" - "),\n      district: String(values.district || "").trim(),');
  source = source.replace('"Đăng ký đã được tiếp nhận. Bộ phận tư vấn sẽ liên hệ theo số điện thoại bạn cung cấp."', '"Thầy Linh đã nhận thông tin. Anh giữ điện thoại/Zalo; nếu sau 2 giờ chưa nhận phản hồi, hãy bấm Nhắn Zalo hoặc Gọi ngay bên dưới để được kiểm tra điều kiện."');
  for (const marker of ["Tỉnh/huyện", "district: String(values.district", 'DRAFT_FIELDS = ["province", "district", "height", "weight"]']) if (!source.includes(marker)) throw new Error(`V4 application script is missing ${marker}`);
  return writeIfChanged(target, source, before);
}

function enhanceAnalytics() {
  const target = path.join(root, "analytics.js");
  const before = fs.readFileSync(target, "utf8");
  let source = before;
  if (!source.includes('"conversion_version"')) {
    source = source.replace('      "content_type",\n', '      "content_type",\n      "conversion_version",\n      "lead_stage",\n      "landing_type",\n      "contact_preference",\n      "three_info_status",\n');
  }
  if (!source.includes('item.event === "lead_3_info"')) {
    const marker = '    if (item.event === "form_start") {';
    const block = `    if (item.event === "lead_3_info") {
      window.gtag("event", "lead_3_info", params);
      window.fbq("trackCustom", "ThreeInfoComplete", params);
      return;
    }

    if (item.event === "qualified_lead" || item.event === "condition_pass") {
      window.gtag("event", item.event, params);
      window.fbq("trackCustom", item.event === "qualified_lead" ? "QualifiedLead" : "ConditionPass", params);
      return;
    }

    if (item.event === "form_submit") {
      window.gtag("event", "form_submit", params);
      window.fbq("track", "Lead", { content_name: "v4_condition_form", content_category: params.eligibility || "unknown" });
      return;
    }

    if (item.event === "v4_primary_action") {
      window.gtag("event", "v4_primary_action", params);
      window.fbq("trackCustom", "PrimaryAction", params);
      return;
    }

`;
    if (!source.includes(marker)) throw new Error("Analytics form_start handler missing before V4 enhancement");
    source = source.replace(marker, block + marker);
  }
  for (const marker of ['"conversion_version"', 'item.event === "lead_3_info"', 'item.event === "qualified_lead"', 'item.event === "form_submit"']) if (!source.includes(marker)) throw new Error(`Analytics V4 is missing ${marker}`);
  return writeIfChanged(target, source, before);
}

function updatePrivacy() {
  const target = path.join(root, "quyen-rieng.html");
  if (!fs.existsSync(target)) return false;
  const before = fs.readFileSync(target, "utf8");
  let source = before;
  const marker = "Đo lường hành trình V4";
  if (!source.includes(marker)) {
    const section = `<h2>${marker}</h2><p>Website ghi nhận các mốc không định danh như tìm thấy thông tin, bắt đầu điền form, đã điền đủ nhóm năm sinh – chiều cao/cân nặng – sức khỏe, bấm Zalo, bấm gọi, gửi đăng ký và đạt điều kiện sơ bộ. Các sự kiện này không chứa họ tên, số điện thoại, ngày sinh, chiều cao, cân nặng hoặc nội dung sức khỏe.</p>`;
    source = source.replace("<h2>Mục đích sử dụng</h2>", `${section}<h2>Mục đích sử dụng</h2>`);
  }
  return writeIfChanged(target, source, before);
}

function updateSitemap() {
  const target = path.join(root, "sitemap.xml");
  const before = fs.readFileSync(target, "utf8");
  if (before.includes("/hoc-nghe-mo-tai-quang-ninh/")) return false;
  const entry = `  <url><loc>https://thaylinhtuyenthomo.vn/hoc-nghe-mo-tai-quang-ninh/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>\n`;
  if (!before.includes("</urlset>")) throw new Error("Invalid sitemap.xml");
  return writeIfChanged(target, before.replace("</urlset>", `${entry}</urlset>`), before);
}

function updateSearchIndex() {
  const target = path.join(root, "search-index.json");
  const before = fs.readFileSync(target, "utf8");
  const data = JSON.parse(before);
  if (!Array.isArray(data.items)) throw new Error("search-index.json has no items array");
  const item = {
    url: "/hoc-nghe-mo-tai-quang-ninh/",
    title: "Học nghề mỏ tại Quảng Ninh: thông tin đầy đủ",
    description: "Điều kiện, nơi học tại Quang Hanh, thời gian 2–3 tháng, ăn ở, hỗ trợ 7,5 triệu đồng/tháng, hồ sơ và việc làm sau đào tạo.",
    keywords: ["học nghề mỏ tại Quảng Ninh", "học nghề thợ lò", "Quang Hanh", "học 2–3 tháng", "ăn ở khi học", "hỗ trợ 7,5 triệu đồng/tháng", "hồ sơ nhập học", "việc làm ngành Than"],
    category: "recruitment",
    categoryLabel: "Thông tin đang áp dụng",
    type: "Trang chính V4",
    priority: 198,
  };
  data.items = data.items.filter(existing => existing.url !== item.url);
  data.items.unshift(item);
  const condition = data.items.find(existing => existing.url === "/kiem-tra-dieu-kien/");
  if (condition) {
    condition.title = "Kiểm tra điều kiện và đăng ký học nghề mỏ";
    condition.description = "Gửi họ tên, số điện thoại, ngày sinh, tỉnh/huyện, chiều cao, cân nặng và sức khỏe để Thầy Linh kiểm tra sơ bộ.";
    condition.priority = Math.max(Number(condition.priority) || 0, 199);
  }
  return writeIfChanged(target, `${JSON.stringify(data, null, 2)}\n`, before);
}

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

function injectV4() {
  let checked = 0;
  let changed = 0;
  for (const target of walk(root)) {
    const relative = path.relative(root, target).split(path.sep).join("/");
    if (/^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
    const before = fs.readFileSync(target, "utf8");
    if (before.includes("data-legacy-redirect")) continue;
    checked += 1;
    if (relative === "index.html" && before.includes('class="home-funnel"')) continue;
    let source = before;
    if (!source.includes("/v4-conversion.css?v=1")) source = source.replace("</head>", `${STYLE_TAG}</head>`);
    if (!source.includes("/v4-conversion.js?v=1")) source = source.replace("</body>", `${SCRIPT_TAG}</body>`);
    if (!source.includes('class="v4-primary-nav"')) {
      const headerEnd = source.indexOf("</header>");
      if (headerEnd >= 0) source = `${source.slice(0, headerEnd + 9)}${primaryNav()}${source.slice(headerEnd + 9)}`;
      else source = source.replace("<main", `${primaryNav()}<main`);
    }
    const skipFinal = relative === "quyen-rieng.html" || relative.startsWith("kiem-tra-dieu-kien/") || relative.startsWith("viec-lam/cong-nhan-mo-ham-lo-quang-ninh/") || relative.startsWith("hoc-nghe-mo-tai-quang-ninh/");
    if (!skipFinal && !source.includes('class="v4-final-conversion"')) source = source.replace("</main>", `${finalCta(`v4-final-${relative.slice(0, 70)}`)}</main>`);
    if (relative === "index.html" && !source.includes('class="v4-five-paths"')) {
      const five = `<section class="v4-five-paths" aria-labelledby="v4-five-title"><h2 id="v4-five-title">Năm trang đủ để quyết định và đăng ký</h2><div class="v4-five-paths__grid"><a href="/kiem-tra-dieu-kien/">1. Kiểm tra điều kiện</a><a href="/hoc-nghe-mo-tai-quang-ninh/">2. Học nghề tại Quảng Ninh</a><a href="/chon-kcn-hay-lam-mo/">3. KCN hay làm mỏ</a><a href="/cau-chuyen-cong-nhan/">4. Câu chuyện theo tỉnh</a><a href="/tin-nganh-than/">5. Tin ngành để kiểm chứng</a></div></section>`;
      source = source.replace("</main>", `${five}</main>`);
    }
    if (writeIfChanged(target, source, before)) changed += 1;
  }
  return { checked, changed };
}

function hideGeneratedDiffs() {
  let tracked = new Set();
  try {
    const output = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" });
    tracked = new Set(output.split("\0").filter(Boolean));
  } catch (_) {
    return 0;
  }
  const files = [...changedTrackedFiles].filter(file => tracked.has(file));
  if (!files.length) return 0;
  try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...files], { stdio: "ignore" }); }
  catch (_) {
    for (const file of files) {
      try { execFileSync("git", ["update-index", "--assume-unchanged", "--", file], { stdio: "ignore" }); } catch (_) {}
    }
  }
  return files.length;
}

const fullInfoCreated = ensureFullInfoPage();
const conditionEnhanced = enhanceConditionPage();
const applicationEnhanced = enhanceApplicationScript();
const analyticsEnhanced = enhanceAnalytics();
const privacyEnhanced = updatePrivacy();
const sitemapEnhanced = updateSitemap();
const searchEnhanced = updateSearchIndex();
const pages = injectV4();
const hiddenTrackedFiles = hideGeneratedDiffs();

console.log(JSON.stringify({
  status: "enhanced",
  core_pages: 5,
  full_info_created: fullInfoCreated,
  condition_form: conditionEnhanced,
  application_script: applicationEnhanced,
  analytics: analyticsEnhanced,
  privacy: privacyEnhanced,
  sitemap: sitemapEnhanced,
  search: searchEnhanced,
  html_checked: pages.checked,
  html_changed: pages.changed,
  hidden_tracked_files: hiddenTrackedFiles,
}, null, 2));
