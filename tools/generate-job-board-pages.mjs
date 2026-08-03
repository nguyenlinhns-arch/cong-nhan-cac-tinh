import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const personId = `${base}/tac-gia/nguyen-tu-linh/#person`;
const organizationId = `${base}/#organization`;
const websiteId = `${base}/#website`;
const editorialPolicyUrl = `${base}/nguyen-tac-bien-tap/`;
const master = JSON.parse(fs.readFileSync(path.resolve("operations", "job-posting-master-2026.json"), "utf8"));
const criteria = master.criteria;
const contact = master.contact;
const dossier = master.dossier;
const jobLocation = master.job_location;
const ageLabel = `${criteria.age_min}–${criteria.age_max}`;
const heightLabel = `${Math.floor(criteria.height_min_cm / 100)}m${String(criteria.height_min_cm % 100).padStart(2, "0")}`;
const incomeShort = "20–25 triệu/tháng khi hoàn thành định mức lao động";
const roles = [
  {
    id: "TKV-2026-khai-thac-mo-ham-lo",
    slug: "ky-thuat-khai-thac-mo-ham-lo-quang-ninh",
    title: "Kỹ thuật khai thác mỏ hầm lò",
    short: "khai thác mỏ hầm lò",
    responsibility: "Vận hành theo quy trình khai thác, phối hợp thiết bị và tổ đội trong dây chuyền sản xuất hầm lò sau khi hoàn thành chương trình đào tạo.",
  },
  {
    id: "TKV-2026-xay-dung-mo-ham-lo",
    slug: "ky-thuat-xay-dung-mo-ham-lo-quang-ninh",
    title: "Kỹ thuật xây dựng mỏ hầm lò",
    short: "xây dựng mỏ hầm lò",
    responsibility: "Tham gia đào, chống giữ, gia cố và duy trì đường lò phục vụ sản xuất sau khi hoàn thành chương trình đào tạo.",
  },
];

const provinceNames = ["An Giang", "Bắc Ninh", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Nội", "Hà Tĩnh", "Hải Phòng", "Hồ Chí Minh", "Huế", "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Tuyên Quang", "Vĩnh Long"];
const xmlEscape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const cdata = (value) => `<![CDATA[${String(value).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;

function plainDescription(role) {
  return `${master.recruitment_coordinator} phối hợp tuyển lao động nam học nghề ${role.short} để làm việc tại các doanh nghiệp thuộc TKV ở Quảng Ninh. ${role.responsibility} Thời gian học ${master.training_duration}. Điều kiện: nam ${ageLabel} tuổi, cao từ ${heightLabel}, nặng từ ${criteria.weight_min_kg} kg, sức khỏe tốt, không cận thị và không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng đến công việc; không yêu cầu kinh nghiệm. Người học thuộc chỉ tiêu được miễn kinh phí đào tạo, bố trí ba bữa/ngày với mức ăn 90.000 đồng/ngày, ký túc xá và hỗ trợ 7,5 triệu đồng theo chính sách đợt tuyển. Sau tốt nghiệp đạt yêu cầu, người lao động được doanh nghiệp tiếp nhận ký hợp đồng và bố trí việc làm. ${master.income_commitment}. ${dossier.initial_application}. Khi có lịch nhập học, mang ${dossier.admission_documents.join(", ").toLocaleLowerCase("vi")}. ${dossier.missing_diploma}. Địa điểm nhập học: ${contact.admission_address}. Địa chỉ liên hệ, tư vấn: ${contact.address}.`;
}

function htmlDescription(role) {
  return `<p>${role.responsibility}</p><p>Điều kiện: nam ${ageLabel} tuổi, cao từ ${heightLabel}, nặng từ ${criteria.weight_min_kg} kg; sức khỏe tốt, không cận thị và không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng đến công việc.</p><p>Không yêu cầu kinh nghiệm. Người đăng ký cần đọc và viết thành thạo; trình độ cụ thể được đối chiếu theo hệ đào tạo.</p><p>Thời gian học ${master.training_duration}. Người học thuộc chỉ tiêu được miễn kinh phí đào tạo, bố trí ba bữa/ngày với mức ăn 90.000 đồng/ngày, ký túc xá và hỗ trợ 7,5 triệu đồng theo chính sách đợt tuyển.</p><p>Sau tốt nghiệp đạt yêu cầu, doanh nghiệp tiếp nhận ký hợp đồng lao động và bố trí việc làm tại Quảng Ninh; cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p><p>${dossier.initial_application}. Khi có lịch nhập học, mang ${dossier.admission_documents.join(", ").toLocaleLowerCase("vi")}. ${dossier.missing_diploma}. Địa điểm nhập học: ${contact.admission_address}. Địa chỉ liên hệ, tư vấn: ${contact.address}.</p>`;
}

function applicationForm(role) {
  const tradeOptions = roles.map((item) => `<option${item.title === role.title ? " selected" : ""}>${item.title}</option>`).join("");
  return `<section class="section job-apply" id="dang-ky" aria-labelledby="apply-title">
    <div class="job-apply__intro"><p class="eyebrow">ỨNG TUYỂN TRỰC TIẾP · CHƯA CẦN HỒ SƠ</p><h2 id="apply-title">Kiểm tra điều kiện trong khoảng một phút</h2><p>Thông tin được chuyển thẳng vào danh sách tư vấn. Kết quả trên website là sơ bộ; kết quả tiếp nhận cuối cùng căn cứ khám sức khỏe và hồ sơ.</p><div class="apply-steps"><span><b>1</b>Điền thông tin</span><span><b>2</b>Nhận kết quả sơ bộ</span><span><b>3</b>Tạo mã đăng ký</span><span><b>4</b>Được liên hệ tư vấn</span></div></div>
    <noscript><p class="application-nojs">Biểu mẫu trực tuyến cần JavaScript. Bạn vẫn có thể <a href="tel:+84963048585">gọi 096 304 8585</a> hoặc <a href="${contact.zalo}" target="_blank" rel="noopener noreferrer">nhắn Zalo cho Thầy Linh</a>.</p></noscript>
    <form class="application-form" data-application-form data-form-context="job_${role.slug}" data-default-trade="${role.title}" novalidate>
      <div class="form-honeypot" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="form-grid">
        <label>Họ và tên <input type="text" name="full_name" autocomplete="name" required maxlength="80" placeholder="Nguyễn Văn A"></label>
        <label>Số điện thoại <input type="tel" name="phone" autocomplete="tel" inputmode="tel" required maxlength="18" placeholder="09xxxxxxxx" aria-describedby="application-form-error"></label>
        <label>Ngày sinh <input type="date" name="birth_date" autocomplete="bday" required data-birth-date aria-describedby="application-birth-help"><small id="application-birth-help">Từ đủ ${criteria.age_min} đến ${criteria.age_max} tuổi tại ngày đăng ký</small></label>
        <label>Tỉnh/thành đang sống <select name="province" autocomplete="address-level1" required><option value="">Chọn tỉnh/thành</option>${provinceNames.map((name) => `<option>${name}</option>`).join("")}</select></label>
        <label>Chiều cao (cm) <input type="number" name="height" inputmode="numeric" autocomplete="off" required min="130" max="220" placeholder="165" aria-describedby="application-height-help"><small id="application-height-help">Đối chiếu mốc ${criteria.height_min_cm} cm</small></label>
        <label>Cân nặng (kg) <input type="number" name="weight" inputmode="numeric" autocomplete="off" required min="30" max="200" placeholder="58" aria-describedby="application-weight-help"><small id="application-weight-help">Đối chiếu mốc ${criteria.weight_min_kg} kg</small></label>
        <label>Trình độ văn hóa <select name="education" autocomplete="off" required><option value="">Chọn trình độ</option><option>Đọc và viết thành thạo</option><option>Tốt nghiệp THCS</option><option>Tốt nghiệp THPT</option><option>Trình độ khác</option></select></label>
        <label>Nghề quan tâm <select name="trade" autocomplete="off" required>${tradeOptions}<option>Cần được tư vấn chọn nghề</option></select></label>
        <label class="form-grid__wide">Tự đánh giá sức khỏe ban đầu <select name="health" autocomplete="off" required aria-describedby="application-health-help"><option value="">Chọn một phương án</option><option>Sức khỏe tốt, sẵn sàng khám tuyển</option><option>Cần trao đổi thêm trước khi khám</option></select><small id="application-health-help">Không nhập tên bệnh hoặc thông tin y tế chi tiết trên website.</small></label>
      </div>
      <p class="application-draft-note" data-application-draft-status><strong>Tự lưu an toàn:</strong> chỉ lưu tạm 24 giờ tỉnh/thành, chiều cao, cân nặng, trình độ và nghề quan tâm trên thiết bị này; không lưu họ tên, số điện thoại, ngày sinh, sức khỏe hoặc ô đồng ý.</p>
      <label class="consent"><input type="checkbox" name="consent" required><span>Tôi xác nhận thông tin trên là đúng, hiểu đây là kết quả sơ bộ và đồng ý để Nguyễn Tử Linh tiếp nhận, lưu và liên hệ tư vấn về chương trình học nghề mỏ. Xem <a href="../../quyen-rieng.html" target="_blank" rel="noopener">quyền riêng tư</a>.</span></label>
      <p class="form-error" id="application-form-error" data-form-error role="alert" hidden></p><button class="button application-submit" type="submit" data-application-submit>Gửi đăng ký và kiểm tra điều kiện</button>
    </form>
    <div class="application-result" data-application-result hidden role="region" aria-labelledby="application-result-title" tabindex="-1"><p class="eyebrow" id="application-result-title">KẾT QUẢ SƠ BỘ</p><div class="application-result__summary"><strong data-application-status></strong><span>Mã đăng ký: <b data-application-code></b></span></div><p class="application-delivery" data-application-delivery role="status" aria-live="polite" aria-atomic="true"></p><h3>Liên hệ ngay nếu cần hỗ trợ thêm</h3><textarea readonly rows="12" data-application-message aria-label="Nội dung tin nhắn đăng ký"></textarea><div class="contact-pair"><a class="contact-button contact-button--zalo" href="${contact.zalo}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="application-result"><span class="contact-icon contact-icon--text">Z</span><span><small>Mở cuộc trò chuyện</small><strong>Zalo 096 304 8585</strong></span></a><a class="contact-button contact-button--messenger" href="${contact.messenger}" target="_blank" rel="noopener noreferrer" data-contact="messenger" data-context="application-result"><span class="contact-icon contact-icon--text">M</span><span><small>Mở Fanpage</small><strong>Messenger</strong></span></a><a class="contact-button contact-button--sms" href="sms:+84963048585" data-sms-application data-contact="sms" data-context="application-result"><span class="contact-icon contact-icon--text">SMS</span><span><small>Điền sẵn nội dung</small><strong>Gửi SMS</strong></span></a></div></div>
  </section>`;
}

function dossierSection() {
  const documentItems = dossier.admission_documents.map((document, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${document}</strong><small>${index === 0 ? "Tự bảo quản và mang theo để đối chiếu" : index === 2 ? dossier.missing_diploma : "Mang theo khi đến làm thủ tục nhập học"}</small></li>`).join("") + `<li><span>04</span><strong>Giấy tờ bổ sung theo từng đợt</strong><small>${dossier.safety}</small></li>`;
  return `<section class="section job-section" id="ho-so" aria-labelledby="dossier-title"><div class="section-heading"><div><p class="eyebrow">HỒ SƠ VÀ ĐỊA ĐIỂM NHẬP HỌC</p><h2 id="dossier-title">Đăng ký trước, chuẩn bị giấy tờ sau</h2></div><p>${dossier.initial_application}. ${dossier.safety}.</p></div><div class="dossier-board"><ol>${documentItems}</ol><aside><div class="dossier-address-block"><p class="eyebrow">ĐỊA CHỈ LIÊN HỆ, TƯ VẤN</p><h3>${contact.name}</h3><p>${contact.title}<br>${master.recruitment_coordinator}</p><address>${contact.address}</address></div><div class="dossier-address-block"><p class="eyebrow">ĐỊA ĐIỂM NHẬP HỌC</p><address><strong>${contact.admission_address}</strong></address><small>Chỉ đến sau khi được xác nhận lịch tiếp nhận.</small></div><a href="tel:+84963048585">096 304 8585</a></aside></div></section>`;
}

function page(role) {
  const url = `${base}/viec-lam/${role.slug}/`;
  const jobPosting = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JobPosting",
        "@id": `${url}#job`,
        title: role.title,
        description: htmlDescription(role),
        identifier: { "@type": "PropertyValue", name: master.hiring_organization, value: role.id },
        datePosted: master.effective_from,
        validThrough: master.valid_through,
        employmentType: "FULL_TIME",
        industry: "Khai thác than hầm lò",
        // Search Console currently rejects the textual enum on this property.
        // An explicit zero-month requirement is equivalent and type-safe.
        experienceRequirements: {
          "@type": "OccupationalExperienceRequirements",
          monthsOfExperience: 0,
        },
        // There is no compulsory diploma. Omit educationRequirements instead of
        // publishing an unsupported `no requirements` enum; literacy remains in
        // the visible description and qualifications.
        responsibilities: role.responsibility,
        qualifications: master.requirements.join("; "),
        skills: "Kỷ luật, tinh thần đồng đội, tuân thủ quy trình an toàn và sẵn sàng học nghề",
        jobBenefits: master.benefits.join("; "),
        hiringOrganization: { "@type": "Organization", name: master.hiring_organization, sameAs: "https://vinacomin.vn/" },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: jobLocation.locality,
            addressRegion: jobLocation.region,
            postalCode: jobLocation.postal_code,
            addressCountry: jobLocation.country,
          },
        },
        url,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        directApply: true,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${role.title} tại Quảng Ninh`,
        description: plainDescription(role),
        inLanguage: "vi-VN",
        datePublished: master.effective_from,
        dateModified: master.effective_from,
        lastReviewed: master.effective_from,
        reviewedBy: { "@id": personId },
        isPartOf: { "@id": websiteId },
        author: { "@id": personId },
        publisher: { "@id": organizationId },
        publishingPrinciples: editorialPolicyUrl,
        mainEntity: { "@id": `${url}#job` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Việc làm ngành mỏ", item: `${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/` },
        { "@type": "ListItem", position: 3, name: role.title, item: url },
      ] },
    ],
  };
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b222b"><title>${role.title} tại Quảng Ninh | Tuyển dụng 2026</title><meta name="description" content="Tuyển ${role.title.toLocaleLowerCase("vi")}: nam ${ageLabel} tuổi, học 2–3 tháng, hỗ trợ 7,5 triệu và làm việc tại Quảng Ninh."><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><meta name="author" content="Nguyễn Tử Linh"><link rel="author" href="/tac-gia/nguyen-tu-linh/"><link rel="canonical" href="${url}"><link rel="icon" href="/favicon.ico"><link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"><link rel="manifest" href="/manifest.webmanifest"><link rel="alternate" type="application/rss+xml" title="Bài mới – Thầy Linh Tuyển Thợ Mỏ" href="/feed.xml"><link rel="alternate" type="application/feed+json" title="Bài mới – Thầy Linh Tuyển Thợ Mỏ" href="/feed.json"><meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="${role.title} tại Quảng Ninh"><meta property="og:description" content="Học nghề 2–3 tháng; hỗ trợ 7,5 triệu; cam kết thu nhập 20–25 triệu/tháng khi hoàn thành định mức lao động."><meta property="og:url" content="${url}"><meta property="og:image" content="${base}/assets/og-cover-v2.webp"><meta property="og:image:alt" content="Học nghề mỏ và làm việc tại Quảng Ninh"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${role.title} tại Quảng Ninh"><meta name="twitter:description" content="Học nghề 2–3 tháng; hỗ trợ ăn ở và 7,5 triệu đồng theo chính sách đợt tuyển."><meta name="twitter:image" content="${base}/assets/og-cover-v2.webp"><link rel="stylesheet" href="../../styles.css?v=16"><link rel="stylesheet" href="../../jobs.css?v=6"><link rel="stylesheet" href="/mobile-ux.css?v=8"><script type="application/ld+json">${JSON.stringify(jobPosting)}</script></head>
<body><a class="skip-link" href="#noi-dung">Bỏ qua menu</a><div class="notice-bar"><span>✓</span> Cập nhật điều kiện <time datetime="${master.effective_from}">tháng 8/2026</time> · Tiếp nhận liên tục trong năm 2026</div><header class="site-header" data-header><a class="brand" href="../../" aria-label="Trang chủ Thầy Linh Tuyển Thợ Mỏ"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span class="brand-copy"><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" data-menu-toggle><span></span><span></span><span></span></button><nav class="main-nav" aria-label="Điều hướng chính" data-menu><a href="#cong-viec">Công việc</a><a href="#dieu-kien">Điều kiện</a><a href="#quyen-loi">Quyền lợi</a><a href="#ho-so">Hồ sơ</a><a href="#dang-ky">Ứng tuyển</a></nav><a class="header-cta" href="#dang-ky" data-contact="application" data-context="job-header">Ứng tuyển nhanh</a></header>
<main id="noi-dung"><nav class="breadcrumb" aria-label="Đường dẫn trang"><a href="../../">Trang chủ</a><span>›</span><a href="../cong-nhan-mo-ham-lo-quang-ninh/">Việc làm ngành mỏ</a><span>›</span><strong>${role.title}</strong></nav><section class="job-hero" aria-labelledby="job-title"><div class="job-hero__copy"><p class="eyebrow eyebrow--light">TUYỂN DỤNG · QUẢNG NINH · 2026</p><h1 id="job-title">${role.title}</h1><p class="job-hero__lead">Học nghề từ đầu trong 2–3 tháng, rèn kỹ năng và an toàn trước khi nhận việc tại doanh nghiệp ngành Than ở Quảng Ninh; cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p><div class="job-hero__facts"><span><b>${ageLabel}</b> tuổi</span><span><b>${heightLabel}</b> trở lên</span><span><b>${criteria.weight_min_kg}kg</b> trở lên</span><span class="income-qualified"><b style="font-size:13px;line-height:1.35">${incomeShort}</b></span></div><div class="contact-pair contact-pair--hero"><a class="contact-button contact-button--zalo" href="#dang-ky"><span class="contact-icon contact-icon--text">✓</span><span><small>Chưa cần hồ sơ</small><strong>Kiểm tra điều kiện</strong></span></a><a class="contact-button contact-button--messenger" href="${contact.messenger}" target="_blank" rel="noopener noreferrer" data-contact="messenger" data-context="job-hero"><span class="contact-icon contact-icon--text">M</span><span><small>Nhắn Fanpage</small><strong>Messenger</strong></span></a></div></div><aside class="job-summary"><p class="eyebrow">TIN ĐANG NHẬN ĐĂNG KÝ</p><h2>${role.title}</h2><dl><div><dt>Nơi làm việc</dt><dd>Quảng Ninh</dd></div><div><dt>Thời gian học</dt><dd>2–3 tháng</dd></div><div><dt>Hỗ trợ khi học</dt><dd>7,5 triệu đồng</dd></div><div><dt>Thu nhập cam kết</dt><dd>${incomeShort}</dd></div><div><dt>Hạn tiếp nhận</dt><dd>31/12/2026</dd></div></dl><a class="button job-summary__button" href="#dang-ky">Ứng tuyển trực tiếp</a></aside></section>
<section class="trust-strip job-trust"><span>✓ Miễn kinh phí đào tạo</span><span>✓ Hỗ trợ 7,5 triệu</span><span>✓ Bố trí ăn ở</span><span>✓ Có việc sau tốt nghiệp</span></section><section class="section job-section" id="cong-viec"><div class="section-heading"><div><p class="eyebrow">CÔNG VIỆC SAU ĐÀO TẠO</p><h2>Một nghề kỹ thuật trong dây chuyền sản xuất hầm lò</h2></div><p>${role.responsibility}</p></div><div class="condition-grid"><article><span>01</span><h3>Học từ nền tảng</h3><p>Người chưa có kinh nghiệm được học kiến thức nghề, thiết bị, quy trình và an toàn.</p></article><article><span>02</span><h3>Thực hành có hướng dẫn</h3><p>Rèn thao tác và phối hợp tổ đội trước khi đảm nhận công việc chính thức.</p></article><article><span>03</span><h3>Nhận việc đúng nghề</h3><p>Người tốt nghiệp đạt yêu cầu được doanh nghiệp tiếp nhận ký hợp đồng và bố trí việc làm.</p></article><article><span>04</span><h3>Phát triển bằng tay nghề</h3><p>Thu nhập và cơ hội nâng bậc gắn với ngày công, năng suất, kỹ năng và kỷ luật an toàn.</p></article></div></section>
<section class="section job-section" id="dieu-kien"><div class="section-heading"><div><p class="eyebrow">ĐIỀU KIỆN THÁNG 8/2026</p><h2>Không yêu cầu kinh nghiệm, cần sức khỏe và quyết tâm</h2></div><p>Ứng viên được kiểm tra sơ bộ từ xa trước khi chuẩn bị hồ sơ và di chuyển.</p></div><div class="condition-grid"><article><span>01</span><h3>Nam ${ageLabel} tuổi</h3><p>Độ tuổi tiếp nhận hiện hành của chương trình.</p></article><article><span>02</span><h3>Cao từ ${heightLabel}</h3><p>Đáp ứng mốc thể lực ban đầu.</p></article><article><span>03</span><h3>Nặng từ ${criteria.weight_min_kg} kg</h3><p>Kết hợp với kết quả khám sức khỏe tuyển dụng.</p></article><article><span>04</span><h3>Sức khỏe phù hợp</h3><p>Không cận thị; không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng công việc.</p></article></div></section>
<section class="section section--dark job-section" id="quyen-loi"><div class="section-heading section-heading--light"><div><p class="eyebrow eyebrow--light">YÊN TÂM HỌC, VỮNG BƯỚC LÀM</p><h2>Giảm áp lực chi phí để tập trung học nghề</h2></div><p>Chính sách được xác nhận theo từng đợt và áp dụng cho người học thuộc chỉ tiêu.</p></div><div class="benefit-grid benefit-grid--four"><article><small>01</small><strong>Miễn kinh phí đào tạo</strong><p>Kinh phí đào tạo được miễn theo chỉ tiêu của chương trình.</p></article><article><small>02</small><strong>Hỗ trợ 7,5 triệu</strong><p>Trong thời gian học theo chính sách đợt tuyển.</p></article><article><small>03</small><strong>Bố trí ăn, ở</strong><p>Ba bữa mỗi ngày và ký túc xá khép kín.</p></article><article><small>04</small><strong>85–100% lương thực tập</strong><p>So với công nhân cùng dây chuyền theo quy định.</p></article><article><small>05</small><strong class="qualified-income" style="font-size:19px;line-height:1.35">${incomeShort}</strong><p>Mức thu nhập được cam kết theo chính sách đang áp dụng.</p></article><article><small>06</small><strong>Hợp đồng lao động</strong><p>Doanh nghiệp tiếp nhận người tốt nghiệp đạt yêu cầu.</p></article><article><small>07</small><strong>Bảo hiểm</strong><p>Thực hiện theo pháp luật và quy định của đơn vị.</p></article><article><small>08</small><strong>Lộ trình rõ ràng</strong><p>Kiểm tra điều kiện, học nghề, thực tập rồi nhận việc.</p></article></div></section>${dossierSection()}${applicationForm(role)}</main>
<section class="final-cta"><div><p class="eyebrow eyebrow--light">CHƯA CẦN HỒ SƠ</p><h2>Điền thông tin để biết mình có phù hợp</h2><p>Nguyễn Tử Linh · Trưởng phòng Tuyển sinh Miền Trung · 096 304 8585</p></div><div class="contact-pair"><a class="contact-button contact-button--zalo" href="#dang-ky" data-contact="application" data-context="job-final"><span class="contact-icon contact-icon--text">✓</span><span><small>Biểu mẫu một phút</small><strong>Ứng tuyển nhanh</strong></span></a><a class="contact-button contact-button--messenger" href="tel:+84963048585" data-contact="phone"><span class="contact-icon contact-icon--text">☎</span><span><small>Gọi trực tiếp</small><strong>096 304 8585</strong></span></a></div></section><footer class="site-footer"><div class="footer-brand"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Tư vấn học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div></div><div class="footer-links"><a href="../../">Trang chủ</a><a href="../cong-nhan-mo-ham-lo-quang-ninh/">Tin tuyển dụng 2026</a><a href="../../thong-tin-tuyen-tho-mo/">15 câu hỏi tuyển thợ mỏ</a><a href="../../#theo-tinh">Theo tỉnh, thành</a><a href="../../nguyen-tac-bien-tap/">Nguyên tắc biên tập</a><a href="../../quyen-rieng.html">Quyền riêng tư</a></div><p class="footer-note">Điều kiện cập nhật tháng 8/2026. Cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p></footer><div class="mobile-contact"><a class="mobile-contact__zalo" href="#dang-ky" data-contact="application" data-context="job-mobile"><b>✓</b><span>Ứng tuyển</span></a><a class="mobile-contact__messenger" href="tel:+84963048585" data-contact="phone"><b>☎</b><span>Gọi 096 304 8585</span></a></div><div class="toast" role="status" aria-live="polite" data-toast hidden></div><script src="/app.js?v=4" defer></script><script src="/recruitment-config.js?v=2" defer></script><script src="/job-application.js?v=9" defer></script><script src="/analytics.js?v=5" defer></script><script src="/mobile-ux.js?v=4" defer></script></body></html>\n`;
}

const jobs = roles.map((role) => ({
  id: role.id,
  status: master.status,
  title: role.title,
  url: `${base}/viec-lam/${role.slug}/`,
  date_posted: master.effective_from,
  valid_through: master.valid_through,
  employment_type: "FULL_TIME",
  hiring_organization: master.hiring_organization,
  recruitment_coordinator: master.recruitment_coordinator,
  occupation: role.title,
  training_duration: master.training_duration,
  location: { locality: jobLocation.locality, region: jobLocation.region, postal_code: jobLocation.postal_code, country: jobLocation.country },
  candidate_sources: master.candidate_scope,
  requirements: { gender: criteria.gender, age_min: criteria.age_min, age_max: criteria.age_max, height_min_cm: criteria.height_min_cm, weight_min_kg: criteria.weight_min_kg, health: criteria.health, education: criteria.education, experience: criteria.experience },
  compensation: { currency: "VND", period: "MONTH", min: 20000000, max: 25000000, condition: "Hoàn thành định mức lao động", note: master.income_commitment },
  benefits: master.benefits,
  description: plainDescription(role),
  application: { contact_name: contact.name, phone: contact.phone, zalo: contact.zalo, messenger: contact.messenger, contact_address: contact.address, admission_address: contact.admission_address, apply_url: `${base}/viec-lam/${role.slug}/#dang-ky`, direct_apply: true },
  dossier,
  source_notice: master.source_notice,
}));

for (const role of roles) {
  const directory = path.join(root, "viec-lam", role.slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), page(role).replace("/mobile-ux.js?v=4", "/mobile-ux.js?v=10"));
}

fs.writeFileSync(path.join(root, "jobs.json"), `${JSON.stringify({ version: "4.0", publisher: { name: "Thầy Linh – Tuyển Thợ Mỏ", contact_name: contact.name, contact_title: contact.title, phone: "+84963048585", website: `${base}/` }, updated_at: master.updated_at, jobs }, null, 2)}\n`);
const jobXml = jobs.map((job) => `  <job id="${xmlEscape(job.id)}"><title>${cdata(job.title)}</title><url>${cdata(job.url)}</url><datePosted>${job.date_posted}</datePosted><validThrough>${job.valid_through}</validThrough><employmentType>${job.employment_type}</employmentType><hiringOrganization>${cdata(job.hiring_organization)}</hiringOrganization><recruitmentCoordinator>${cdata(job.recruitment_coordinator)}</recruitmentCoordinator><occupation>${cdata(job.occupation)}</occupation><trainingDuration>${cdata(job.training_duration)}</trainingDuration><location locality="${xmlEscape(jobLocation.locality)}" region="${xmlEscape(jobLocation.region)}" postalCode="${xmlEscape(jobLocation.postal_code)}" country="${xmlEscape(jobLocation.country)}"/><description>${cdata(job.description)}</description><compensation currency="VND" period="MONTH" min="20000000" max="25000000" condition="Hoàn thành định mức lao động"/><application directApply="true"><contactName>${contact.name}</contactName><phone>${contact.phone}</phone><contactAddress>${cdata(contact.address)}</contactAddress><admissionAddress>${cdata(contact.admission_address)}</admissionAddress><documents>${cdata(dossier.admission_documents.join("; "))}</documents><applyUrl>${cdata(job.application.apply_url)}</applyUrl></application></job>`).join("\n");
fs.writeFileSync(path.join(root, "jobs.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<jobs version="4.0" generatedAt="${master.updated_at}">\n${jobXml}\n</jobs>\n`);
const joobleJobs = jobs.map((job) => `  <job id="${xmlEscape(job.id)}"><link>${cdata(job.url)}</link><name>${cdata(job.title)}</name><region>${cdata("Quảng Ninh, Việt Nam")}</region><salary>${cdata("Cam kết thu nhập 20.000.000–25.000.000 VND/tháng khi hoàn thành định mức lao động")}</salary><description>${cdata(htmlDescription(roles.find((role) => role.id === job.id)))}</description><company>${cdata(job.hiring_organization)}</company><pubdate>01.08.2026</pubdate><updated>01.08.2026</updated><expire>31.12.2026</expire><jobtype>full-time</jobtype></job>`).join("\n");
fs.writeFileSync(path.join(root, "jooble.xml"), `<?xml version="1.0" encoding="utf-8"?>\n<jobs>\n${joobleJobs}\n</jobs>\n`);

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
for (const role of roles) {
  const url = `${base}/viec-lam/${role.slug}/`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) sitemap = sitemap.replace("</urlset>", `  <url><loc>${url}</loc><lastmod>2026-08-01</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n</urlset>`);
}
fs.writeFileSync(sitemapPath, sitemap);
console.log(JSON.stringify({ pages: roles.length, jobs: jobs.length, feeds: ["jobs.json", "jobs.xml", "jooble.xml"], policy_version: master.version }));
