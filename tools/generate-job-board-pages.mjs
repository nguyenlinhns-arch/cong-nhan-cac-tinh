import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const applicationUrl = `${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky`;
const organization = "Trường Cao đẳng Than - Khoáng sản Việt Nam phối hợp với các doanh nghiệp trong TKV";
const roles = [
  {
    id: "10-TB-CDTKV-2026-khai-thac-mo-ham-lo",
    slug: "ky-thuat-khai-thac-mo-ham-lo-quang-ninh",
    title: "Kỹ thuật khai thác mỏ hầm lò",
    short: "khai thác mỏ hầm lò",
    responsibility: "Được đào tạo từ đầu để làm chủ quy trình khai thác, thiết bị và kỹ năng phối hợp trong dây chuyền sản xuất hầm lò; sau tốt nghiệp nhận công việc đúng nghề tại doanh nghiệp tiếp nhận.",
  },
  {
    id: "10-TB-CDTKV-2026-xay-dung-mo-ham-lo",
    slug: "ky-thuat-xay-dung-mo-ham-lo-quang-ninh",
    title: "Kỹ thuật xây dựng mỏ hầm lò",
    short: "xây dựng mỏ hầm lò",
    responsibility: "Được đào tạo từ đầu để tham gia kiến tạo, gia cố và duy trì những đường lò phục vụ sản xuất; sau tốt nghiệp nhận công việc đúng nghề tại doanh nghiệp tiếp nhận.",
  },
];

const benefits = [
  "Miễn toàn bộ kinh phí đào tạo",
  "Hỗ trợ 7,5 triệu đồng trong thời gian học theo chính sách đợt tuyển",
  "Miễn phí 3 bữa/ngày, 7 ngày/tuần với mức ăn 90.000 đồng/ngày",
  "Miễn phí ký túc xá khép kín",
  "Thực tập hưởng 85–100% lương công nhân trong cùng dây chuyền",
  "Sau tốt nghiệp được doanh nghiệp tiếp nhận ký hợp đồng lao động và bố trí việc làm",
  "Bảo hiểm và quyền lợi theo quy định",
];

function plainDescription(role) {
  return `${organization} tổ chức tuyển lao động, cử đi học nghề ${role.short} để làm việc tại Quảng Ninh. Thời gian học 2–3 tháng. Điều kiện: nam 18–35 tuổi, cao từ 1,56 m, nặng từ 48 kg, sức khỏe tốt, đọc và viết thành thạo; không yêu cầu kinh nghiệm. Quyền lợi: miễn kinh phí đào tạo; hỗ trợ 7,5 triệu đồng trong thời gian học theo chính sách đợt tuyển; miễn phí ba bữa mỗi ngày với mức ăn 90.000 đồng/ngày; miễn phí ký túc xá. Thực tập hưởng 85–100% lương công nhân trong cùng dây chuyền. Sau tốt nghiệp được doanh nghiệp tiếp nhận ký hợp đồng lao động, bố trí đúng nghề; thu nhập 20–25 triệu đồng/tháng tùy vị trí, ngày công, năng suất và đơn vị. Tiếp nhận liên tục trong năm 2026.`;
}

function htmlDescription(role) {
  return `<p>${role.responsibility}</p><p><strong>Điều kiện:</strong> nam 18–35 tuổi, cao từ 1,56 m, nặng từ 48 kg, sức khỏe tốt, đọc và viết thành thạo; không yêu cầu kinh nghiệm.</p><p><strong>Đào tạo và quyền lợi:</strong> học nghề 2–3 tháng; miễn kinh phí đào tạo; hỗ trợ 7,5 triệu đồng theo chính sách đợt tuyển; miễn phí ba bữa/ngày với mức ăn 90.000 đồng/ngày; miễn phí ký túc xá; thực tập hưởng 85–100% lương công nhân trong cùng dây chuyền.</p><p><strong>Sau đào tạo:</strong> doanh nghiệp tiếp nhận ký hợp đồng lao động, bố trí đúng nghề tại Quảng Ninh; thu nhập 20–25 triệu đồng/tháng tùy vị trí, ngày công, năng suất và đơn vị.</p>`;
}

function page(role) {
  const url = `${base}/viec-lam/${role.slug}/`;
  const jobPosting = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JobPosting",
        title: role.title,
        description: htmlDescription(role),
        identifier: { "@type": "PropertyValue", name: "Trường Cao đẳng Than - Khoáng sản Việt Nam", value: role.id },
        datePosted: "2026-07-31",
        validThrough: "2026-12-31T23:59:59+07:00",
        employmentType: "FULL_TIME",
        industry: "Khai thác than hầm lò",
        experienceRequirements: "Không yêu cầu kinh nghiệm",
        educationRequirements: "Đọc và viết thành thạo; trình độ cụ thể đối chiếu theo hệ đào tạo",
        hiringOrganization: { "@type": "Organization", name: organization },
        jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: "Số 8 Chu Văn An", addressLocality: "Hạ Long", addressRegion: "Quảng Ninh", addressCountry: "VN" } },
        baseSalary: { "@type": "MonetaryAmount", currency: "VND", value: { "@type": "QuantitativeValue", minValue: 20000000, maxValue: 25000000, unitText: "MONTH" } },
        url,
        directApply: false,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/` },
          { "@type": "ListItem", position: 2, name: "Việc làm ngành mỏ", item: `${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/` },
          { "@type": "ListItem", position: 3, name: role.title, item: url },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${role.title} tại Quảng Ninh | Tuyển dụng 2026</title>
  <meta name="description" content="Tuyển ${role.title.toLocaleLowerCase("vi")}: học nghề 2–3 tháng, hỗ trợ 7,5 triệu, thu nhập sau đào tạo 20–25 triệu/tháng.">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="${role.title} tại Quảng Ninh"><meta property="og:description" content="Học nghề 2–3 tháng; hỗ trợ 7,5 triệu; thu nhập 20–25 triệu/tháng."><meta property="og:url" content="${url}"><meta property="og:image" content="${base}/assets/og-cover-v2.webp"><meta property="og:image:alt" content="Thầy Linh – Học nghề mỏ, làm việc tại Quảng Ninh">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${role.title} tại Quảng Ninh"><meta name="twitter:description" content="Học nghề 2–3 tháng; hỗ trợ 7,5 triệu; thu nhập 20–25 triệu/tháng."><meta name="twitter:image" content="${base}/assets/og-cover-v2.webp">
  <link rel="stylesheet" href="../../styles.css?v=15"><link rel="stylesheet" href="../../jobs.css?v=1"><link rel="stylesheet" href="/mobile-ux.css?v=1">
  <script type="application/ld+json">${JSON.stringify(jobPosting)}</script>
</head>
<body>
  <a class="skip-link" href="#noi-dung">Bỏ qua menu</a>
  <div class="notice-bar"><span>✓</span> Thông báo số <strong>10/TB-CĐTKV ngày 02/04/2026</strong> · Tuyển liên tục trong năm 2026</div>
  <header class="site-header" data-header>
    <a class="brand" href="../../" aria-label="Trang chủ Thầy Linh Tuyển Thợ Mỏ"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span class="brand-copy"><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" data-menu-toggle><span></span><span></span><span></span></button>
    <nav class="main-nav" aria-label="Điều hướng chính" data-menu><a href="#cong-viec">Công việc</a><a href="#dieu-kien">Điều kiện</a><a href="#quyen-loi">Quyền lợi</a><a href="#ho-so">Hồ sơ</a></nav>
    <a class="header-cta" href="${applicationUrl}">Ứng tuyển nhanh</a>
  </header>
  <main id="noi-dung">
    <nav class="breadcrumb" aria-label="Đường dẫn trang"><a href="../../">Trang chủ</a><span>›</span><a href="../cong-nhan-mo-ham-lo-quang-ninh/">Việc làm ngành mỏ</a><span>›</span><strong>${role.title}</strong></nav>
    <section class="job-hero" aria-labelledby="job-title">
      <div class="job-hero__copy"><p class="eyebrow eyebrow--light">TUYỂN DỤNG · QUẢNG NINH · 2026</p><h1 id="job-title">${role.title}</h1><p class="job-hero__lead">Học nghề 2–3 tháng để bước vào một công việc cần tay nghề, kỷ luật và tinh thần đồng đội – với cơ hội thu nhập tham khảo 20–25 triệu đồng/tháng tại Quảng Ninh.</p><div class="job-hero__facts"><span><b>18–35</b> tuổi</span><span><b>1m56</b> trở lên</span><span><b>48kg</b> trở lên</span><span><b>20–25 triệu</b>/tháng</span></div><div class="contact-pair contact-pair--hero"><a class="contact-button contact-button--zalo" href="${applicationUrl}"><span class="contact-icon contact-icon--text">✓</span><span><small>Chưa cần hồ sơ</small><strong>Ứng tuyển nhanh</strong></span></a><a class="contact-button contact-button--messenger" href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer"><span class="contact-icon contact-icon--text">M</span><span><small>Nhắn Fanpage</small><strong>Messenger</strong></span></a></div></div>
      <aside class="job-summary" aria-label="Tóm tắt tin tuyển dụng"><p class="eyebrow">TIN ĐANG NHẬN ĐĂNG KÝ</p><h2>${role.title}</h2><dl><div><dt>Nơi làm việc</dt><dd>Quảng Ninh</dd></div><div><dt>Thời gian học</dt><dd>2–3 tháng</dd></div><div><dt>Hỗ trợ khi học</dt><dd>7,5 triệu đồng</dd></div><div><dt>Thu nhập sau đào tạo</dt><dd>20–25 triệu/tháng</dd></div><div><dt>Hạn tiếp nhận</dt><dd>31/12/2026</dd></div></dl><a class="button job-summary__button" href="${applicationUrl}">Tạo tin nhắn đăng ký</a></aside>
    </section>
    <section class="trust-strip job-trust" aria-label="Quyền lợi chính"><span>✓ Miễn kinh phí đào tạo</span><span>✓ Hỗ trợ 7,5 triệu</span><span>✓ Miễn phí ăn ở</span><span>✓ Có việc sau tốt nghiệp</span></section>
    <section class="section job-section" id="cong-viec"><div class="section-heading"><div><p class="eyebrow">HÀNH TRÌNH VÀO NGHỀ</p><h2>Từ lớp học đến một vị trí trong dây chuyền sản xuất</h2></div><p>${organization}. Người chưa có kinh nghiệm được học từ nền tảng, thực tập có hướng dẫn rồi mới bước vào công việc chính thức.</p></div><div class="condition-grid"><article><span>01</span><h3>Học để hiểu nghề</h3><p>Trong 2–3 tháng, người học làm quen kiến thức, thiết bị, an toàn và kỹ năng của nghề ${role.short}.</p></article><article><span>02</span><h3>Thực hành để vững tay</h3><p>Thực tập trong dây chuyền phù hợp, có người hướng dẫn, bảo hộ lao động, ăn ở và xe đưa đón theo quy định.</p></article><article><span>03</span><h3>Tốt nghiệp để nhận việc</h3><p>Người đạt yêu cầu được doanh nghiệp ký hợp đồng lao động và bố trí công việc đúng nghề đã học.</p></article><article><span>04</span><h3>Gắn bó với vùng mỏ</h3><p>Học, thực tập và làm việc tại Quảng Ninh – trung tâm công nghiệp than lớn nhất cả nước.</p></article></div></section>
    <section class="section job-section" id="dieu-kien"><div class="section-heading"><div><p class="eyebrow">CÁNH CỬA ĐẦU TIÊN</p><h2>Không yêu cầu kinh nghiệm, cần thể lực và quyết tâm</h2></div><p>Nếu phù hợp các điều kiện ban đầu, bạn có thể đăng ký để được hướng dẫn. Kết quả tiếp nhận cuối cùng căn cứ khám sức khỏe và hồ sơ của đợt tuyển.</p></div><div class="condition-grid"><article><span>01</span><h3>Nam 18–35 tuổi</h3><p>Độ tuổi phù hợp để học nghề và phát triển lâu dài trong ngành.</p></article><article><span>02</span><h3>Cao từ 1,56 m</h3><p>Đáp ứng yêu cầu thể lực ban đầu của chương trình.</p></article><article><span>03</span><h3>Nặng từ 48 kg</h3><p>Cùng với sức khỏe tốt để theo học và làm việc.</p></article><article><span>04</span><h3>Sẵn sàng học nghề</h3><p>Đọc, viết thành thạo; không yêu cầu kinh nghiệm trước đó.</p></article></div></section>
    <section class="section section--dark job-section" id="quyen-loi"><div class="section-heading section-heading--light"><div><p class="eyebrow eyebrow--light">YÊN TÂM HỌC, VỮNG BƯỚC LÀM</p><h2>Chính sách hỗ trợ theo suốt hành trình vào nghề</h2></div><p>Từ học phí, ăn ở đến thực tập và việc làm, các quyền lợi được thiết kế để người lao động tập trung rèn kỹ năng và sớm ổn định cuộc sống.</p></div><div class="benefit-grid benefit-grid--four"><article><small>01</small><strong>Miễn kinh phí đào tạo</strong><p>Người học không phải tự đóng học phí chương trình.</p></article><article><small>02</small><strong>Hỗ trợ 7,5 triệu</strong><p>Hỗ trợ sinh hoạt trong thời gian học theo chính sách đợt tuyển.</p></article><article><small>03</small><strong>Ăn, ở miễn phí</strong><p>Ba bữa/ngày, mức ăn 90.000 đồng/ngày; ký túc xá khép kín.</p></article><article><small>04</small><strong>85–100% lương thực tập</strong><p>So với công nhân cùng dây chuyền trong giai đoạn thực hành sản xuất.</p></article><article><small>05</small><strong>20–25 triệu/tháng</strong><p>Thu nhập tham khảo tùy vị trí, ngày công, năng suất và đơn vị.</p></article><article><small>06</small><strong>Hợp đồng lao động</strong><p>Doanh nghiệp tiếp nhận ký với người tốt nghiệp đạt yêu cầu.</p></article><article><small>07</small><strong>Thời gian làm việc rõ ràng</strong><p>8 giờ/ngày, 5 ngày/tuần theo phương án sản xuất của đơn vị.</p></article><article><small>08</small><strong>Chế độ bảo hiểm</strong><p>Được hưởng các quyền lợi theo quy định của pháp luật.</p></article></div></section>
    <section class="section job-section" id="ho-so"><div class="section-heading"><div><p class="eyebrow">HỒ SƠ</p><h2>Chuẩn bị 02 bộ hồ sơ sau khi đủ điều kiện</h2></div><p>Chưa cần gửi giấy tờ ở bước đăng ký nhanh.</p></div><div class="dossier-board"><ol><li><span>01</span><strong>Sơ yếu lý lịch</strong><small>01 bản mỗi bộ</small></li><li><span>02</span><strong>Giấy khai sinh</strong><small>01 bản sao mỗi bộ</small></li><li><span>03</span><strong>Bằng tốt nghiệp văn hóa</strong><small>01 bản công chứng mỗi bộ</small></li><li><span>04</span><strong>Căn cước công dân</strong><small>01 bản công chứng mỗi bộ</small></li></ol><aside><p class="eyebrow">ĐẦU MỐI TIẾP NHẬN</p><h3>Nguyễn Tử Linh</h3><p>Trưởng phòng Tuyển sinh Miền Trung<br>Trường Cao đẳng Than - Khoáng sản Việt Nam</p><address>Số 8 Chu Văn An, phường Hạ Long, Quảng Ninh</address><a href="tel:+84963048585">096 304 8585</a></aside></div></section>
  </main>
  <section class="final-cta"><div><p class="eyebrow eyebrow--light">CHƯA CẦN HỒ SƠ</p><h2>Nếu công việc này khiến bạn quan tâm, hãy bắt đầu bằng một cuộc trò chuyện</h2><p>Nguyễn Tử Linh · 096 304 8585</p></div><div class="contact-pair"><a class="contact-button contact-button--zalo" href="${applicationUrl}"><span class="contact-icon contact-icon--text">✓</span><span><small>Biểu mẫu 1 phút</small><strong>Ứng tuyển nhanh</strong></span></a><a class="contact-button contact-button--messenger" href="tel:+84963048585"><span class="contact-icon contact-icon--text">☎</span><span><small>Gọi trực tiếp</small><strong>096 304 8585</strong></span></a></div></section>
  <footer class="site-footer"><div class="footer-brand"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Thông tin tuyển dụng, học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div></div><div class="footer-links"><a href="../../">Trang chủ</a><a href="../cong-nhan-mo-ham-lo-quang-ninh/">Tin tuyển dụng 2026</a><a href="../../#theo-tinh">26 tỉnh từ Lâm Đồng trở ra</a><a href="../../quyen-rieng.html">Quyền riêng tư</a></div><p class="footer-note">Căn cứ Thông báo 10/TB-CĐTKV ngày 02/04/2026 và chính sách đợt tuyển. Thu nhập thực tế phụ thuộc vị trí, ngày công, năng suất và đơn vị.</p></footer>
  <div class="mobile-contact" aria-label="Liên hệ nhanh"><a class="mobile-contact__zalo" href="${applicationUrl}"><b>✓</b><span>Ứng tuyển</span></a><a class="mobile-contact__messenger" href="tel:+84963048585"><b>☎</b><span>Gọi 096 304 8585</span></a></div>
  <script src="../../app.js?v=2" defer></script><script src="/analytics.js?v=1" defer></script>
  <script src="/mobile-ux.js?v=2" defer></script>
</body>
</html>\n`;
}

const jobs = roles.map((role) => ({
  id: role.id,
  status: "open",
  title: role.title,
  url: `${base}/viec-lam/${role.slug}/`,
  date_posted: "2026-07-31",
  valid_through: "2026-12-31T23:59:59+07:00",
  employment_type: "FULL_TIME",
  hiring_organization: organization,
  recruitment_coordinator: "Trường Cao đẳng Than - Khoáng sản Việt Nam",
  occupation: role.title,
  training_duration: "2–3 tháng",
  location: { locality: "Hạ Long", region: "Quảng Ninh", country: "VN" },
  candidate_sources: "Toàn bộ 34 tỉnh, thành Việt Nam",
  requirements: { gender: "Nam", age_min: 18, age_max: 35, height_min_cm: 156, weight_min_kg: 48, health: "Sức khỏe tốt", education: "Đọc và viết thành thạo; trình độ cụ thể đối chiếu theo hệ đào tạo", experience: "Không yêu cầu" },
  compensation: { currency: "VND", period: "MONTH", min: 20000000, max: 25000000, note: "Thu nhập thực tế phụ thuộc vị trí, ngày công, năng suất và đơn vị" },
  benefits,
  description: plainDescription(role),
  application: { contact_name: "Nguyễn Tử Linh", phone: "0963048585", zalo: "https://zalo.me/0963048585", messenger: "https://m.me/thaylinhtuyenthomo", address: "Số 8 Chu Văn An, phường Hạ Long, Quảng Ninh", apply_url: applicationUrl },
  source_notice: "10/TB-CĐTKV ngày 02/04/2026",
}));

for (const role of roles) {
  const dir = path.join(root, "viec-lam", role.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(role));
}

fs.writeFileSync(path.join(root, "jobs.json"), `${JSON.stringify({ version: "2.0", publisher: { name: "Thầy Linh – Tuyển Thợ Mỏ", contact_name: "Nguyễn Tử Linh", contact_title: "Trưởng phòng Tuyển sinh Miền Trung", phone: "+84963048585", website: `${base}/` }, updated_at: "2026-07-31T17:00:00+07:00", jobs }, null, 2)}\n`);

const xmlEscape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const cdata = (value) => `<![CDATA[${String(value).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
const jobXml = jobs.map((job) => `  <job id="${xmlEscape(job.id)}"><title>${cdata(job.title)}</title><url>${cdata(job.url)}</url><datePosted>${job.date_posted}</datePosted><validThrough>${job.valid_through}</validThrough><employmentType>${job.employment_type}</employmentType><hiringOrganization>${cdata(job.hiring_organization)}</hiringOrganization><recruitmentCoordinator>${cdata(job.recruitment_coordinator)}</recruitmentCoordinator><occupation>${cdata(job.occupation)}</occupation><trainingDuration>${cdata(job.training_duration)}</trainingDuration><location locality="Hạ Long" region="Quảng Ninh" country="VN"/><description>${cdata(job.description)}</description><compensation currency="VND" period="MONTH" min="20000000" max="25000000"/><application><contactName>Nguyễn Tử Linh</contactName><phone>0963048585</phone><applyUrl>${cdata(applicationUrl)}</applyUrl></application></job>`).join("\n");
fs.writeFileSync(path.join(root, "jobs.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<jobs version="2.0" generatedAt="2026-07-31T17:00:00+07:00">\n${jobXml}\n</jobs>\n`);

const joobleJobs = roles.map((role) => `  <job id="${xmlEscape(role.id)}"><link>${cdata(`${base}/viec-lam/${role.slug}/`)}</link><name>${cdata(role.title)}</name><region>${cdata("Hạ Long, Quảng Ninh, Việt Nam")}</region><salary>${cdata("20.000.000–25.000.000 VND/tháng")}</salary><description>${cdata(htmlDescription(role))}</description><company>${cdata(organization)}</company><pubdate>31.07.2026</pubdate><updated>31.07.2026</updated><expire>31.12.2026</expire><jobtype>full-time</jobtype></job>`).join("\n");
fs.writeFileSync(path.join(root, "jooble.xml"), `<?xml version="1.0" encoding="utf-8"?>\n<jobs>\n${joobleJobs}\n</jobs>\n`);

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
const provinces = JSON.parse(fs.readFileSync(path.join(root, "data", "provinces-2026.json"), "utf8")).provinces;
const requiredSitemapUrls = [
  `${base}/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/`,
  ...roles.map((role) => `${base}/viec-lam/${role.slug}/`),
  ...provinces.map((province) => `${base}/viec-lam-nganh-than/${province.slug}/`),
];
for (const url of requiredSitemapUrls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) sitemap = sitemap.replace("</urlset>", `  <url><loc>${url}</loc><lastmod>2026-08-01</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n</urlset>`);
}
fs.writeFileSync(sitemapPath, sitemap);

console.log(JSON.stringify({ pages: roles.length, jobs: jobs.length, feeds: ["jobs.json", "jobs.xml", "jooble.xml"] }));
