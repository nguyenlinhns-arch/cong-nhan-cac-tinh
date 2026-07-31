import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const outputRoot = path.join(root, "viec-lam-nganh-than");

export const provinces = [
  { slug: "lam-dong", name: "Lâm Đồng", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Đắk Nông", "Bình Thuận"], create: true },
  { slug: "khanh-hoa", name: "Khánh Hòa", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Ninh Thuận"], create: true },
  { slug: "dak-lak", name: "Đắk Lắk", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Phú Yên"] },
  { slug: "gia-lai", name: "Gia Lai", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Bình Định"] },
  { slug: "quang-ngai", name: "Quảng Ngãi", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Kon Tum"] },
  { slug: "da-nang", name: "Đà Nẵng", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Quảng Nam"], create: true },
  { slug: "hue", name: "Huế", region: "Bắc Trung Bộ", aliases: [], create: true },
  { slug: "quang-tri", name: "Quảng Trị", region: "Bắc Trung Bộ", aliases: ["Quảng Bình"] },
  { slug: "ha-tinh", name: "Hà Tĩnh", region: "Bắc Trung Bộ", aliases: [] },
  { slug: "nghe-an", name: "Nghệ An", region: "Bắc Trung Bộ", aliases: [] },
  { slug: "thanh-hoa", name: "Thanh Hóa", region: "Bắc Trung Bộ", aliases: [] },
  { slug: "ninh-binh", name: "Ninh Bình", region: "Đồng bằng & Đông Bắc", aliases: ["Nam Định", "Hà Nam"], create: true },
  { slug: "hung-yen", name: "Hưng Yên", region: "Đồng bằng & Đông Bắc", aliases: ["Thái Bình"], create: true },
  { slug: "hai-phong", name: "Hải Phòng", region: "Đồng bằng & Đông Bắc", aliases: ["Hải Dương"], create: true },
  { slug: "bac-ninh", name: "Bắc Ninh", region: "Đồng bằng & Đông Bắc", aliases: ["Bắc Giang"], create: true },
  { slug: "ha-noi", name: "Hà Nội", region: "Đồng bằng & Đông Bắc", aliases: [], create: true },
  { slug: "quang-ninh", name: "Quảng Ninh", region: "Đồng bằng & Đông Bắc", aliases: [], create: true },
  { slug: "phu-tho", name: "Phú Thọ", region: "Trung du & miền núi phía Bắc", aliases: ["Vĩnh Phúc", "Hòa Bình"], create: true },
  { slug: "thai-nguyen", name: "Thái Nguyên", region: "Trung du & miền núi phía Bắc", aliases: ["Bắc Kạn"], create: true },
  { slug: "tuyen-quang", name: "Tuyên Quang", region: "Trung du & miền núi phía Bắc", aliases: ["Hà Giang"], create: true },
  { slug: "lao-cai", name: "Lào Cai", region: "Trung du & miền núi phía Bắc", aliases: ["Yên Bái"] },
  { slug: "cao-bang", name: "Cao Bằng", region: "Trung du & miền núi phía Bắc", aliases: [], create: true },
  { slug: "lang-son", name: "Lạng Sơn", region: "Trung du & miền núi phía Bắc", aliases: [], create: true },
  { slug: "son-la", name: "Sơn La", region: "Trung du & miền núi phía Bắc", aliases: [] },
  { slug: "dien-bien", name: "Điện Biên", region: "Trung du & miền núi phía Bắc", aliases: [] },
  { slug: "lai-chau", name: "Lai Châu", region: "Trung du & miền núi phía Bắc", aliases: [], create: true },
  { slug: "ho-chi-minh", name: "Thành phố Hồ Chí Minh", region: "Đông Nam Bộ", aliases: ["Bình Dương", "Bà Rịa - Vũng Tàu"], create: true },
  { slug: "dong-nai", name: "Đồng Nai", region: "Đông Nam Bộ", aliases: ["Bình Phước"], create: true },
  { slug: "tay-ninh", name: "Tây Ninh", region: "Đông Nam Bộ", aliases: ["Long An"], create: true },
  { slug: "can-tho", name: "Cần Thơ", region: "Đồng bằng sông Cửu Long", aliases: ["Hậu Giang", "Sóc Trăng"], create: true },
  { slug: "vinh-long", name: "Vĩnh Long", region: "Đồng bằng sông Cửu Long", aliases: ["Bến Tre", "Trà Vinh"], create: true },
  { slug: "dong-thap", name: "Đồng Tháp", region: "Đồng bằng sông Cửu Long", aliases: ["Tiền Giang"], create: true },
  { slug: "ca-mau", name: "Cà Mau", region: "Đồng bằng sông Cửu Long", aliases: ["Bạc Liêu"], create: true },
  { slug: "an-giang", name: "An Giang", region: "Đồng bằng sông Cửu Long", aliases: ["Kiên Giang"], create: true },
];

function provincePage(province) {
  const { slug, name, region, aliases } = province;
  const canonical = `https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${slug}/`;
  const aliasNames = aliases.join(", ");
  const aliasPhrase = aliases.length
    ? `, bao gồm khu vực ${aliasNames} trước sắp xếp đơn vị hành chính năm 2025`
    : "";
  const localContext = aliases.length
    ? `Trang tư vấn này dành cho người lao động trên địa bàn ${name} hiện nay, đồng thời giúp người tìm kiếm theo tên địa phương quen thuộc như ${aliasNames} tiếp cận đúng thông tin.`
    : `Trang tư vấn này dành riêng cho người lao động đang sinh sống tại ${name} và muốn kiểm tra điều kiện trước khi đi học nghề ở Quảng Ninh.`;
  const description = `Tuyển thợ mỏ tại ${name}${aliasPhrase}: kiểm tra điều kiện, học nghề 2–3 tháng, chế độ ăn ở và cơ hội làm việc tại Quảng Ninh.`;
  const keywords = [
    `tuyển thợ mỏ ${name}`,
    `tuyển dụng ngành than ${name}`,
    `học nghề mỏ ${name}`,
    `việc làm thợ lò ${name}`,
    ...aliases.flatMap((alias) => [`tuyển thợ mỏ ${alias}`, `việc làm ngành than ${alias}`]),
  ].join(", ");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `Tuyển thợ mỏ tại ${name} – học nghề 2–3 tháng`,
        description,
        inLanguage: "vi-VN",
        dateModified: "2026-07-31",
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://thaylinhtuyenthomo.vn/" },
          { "@type": "ListItem", position: 2, name: "Tuyển thợ mỏ theo tỉnh", item: "https://thaylinhtuyenthomo.vn/#theo-tinh" },
          { "@type": "ListItem", position: 3, name, item: canonical },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Người ở ${name} có thể đăng ký học nghề mỏ không?`,
            acceptedAnswer: { "@type": "Answer", text: `Lao động nam tại ${name} có thể gửi năm sinh, chiều cao, cân nặng và sức khỏe để được kiểm tra điều kiện ban đầu. Nơi học và làm việc là Quảng Ninh.` },
          },
          {
            "@type": "Question",
            name: "Thời gian học nghề mỏ bao lâu?",
            acceptedAnswer: { "@type": "Answer", text: "Nghề khai thác mỏ và xây dựng mỏ có thời gian học 2–3 tháng theo kế hoạch từng đợt." },
          },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi" data-province="${slug}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#0b222b">
  <title>Tuyển thợ mỏ tại ${name} | Học nghề 2–3 tháng – Thầy Linh</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="../../assets/favicon.svg?v=2" type="image/svg+xml">
  <link rel="manifest" href="../../manifest.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">
  <meta property="og:title" content="Tuyển thợ mỏ tại ${name} – học nghề 2–3 tháng">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tuyển thợ mỏ tại ${name} – học nghề 2–3 tháng">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">
  <link rel="stylesheet" href="../../styles.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <link rel="stylesheet" href="/mobile-ux.css?v=1">
</head>
<body>
  <a class="skip-link" href="#noi-dung">Bỏ qua menu</a>
  <div class="notice-bar"><span>✓</span> Kênh tư vấn của <strong>Thầy Linh – Tuyển Thợ Mỏ</strong> · Kiểm tra điều kiện trước khi hướng dẫn hồ sơ</div>
  <header class="site-header" data-header>
    <a class="brand" href="../../" aria-label="Trang chủ Thầy Linh Tuyển Thợ Mỏ"><span class="brand-mark">TL</span><span class="brand-copy"><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" data-menu-toggle><span></span><span></span><span></span></button>
    <nav class="main-nav" aria-label="Điều hướng chính" data-menu><a href="../../#dieu-kien">Điều kiện</a><a href="../../#che-do-ho-so">Chế độ & hồ sơ</a><a href="../../#theo-tinh">Theo tỉnh</a><a href="../../tin-nganh-than/">Cẩm nang</a></nav>
    <a class="header-cta" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo">Nhắn Zalo</a>
  </header>

  <main id="noi-dung">
    <nav class="breadcrumb" aria-label="Đường dẫn trang"><a href="../../">Trang chủ</a><span>›</span><a href="../../#theo-tinh">Tuyển thợ mỏ theo tỉnh</a><span>›</span><strong>${name}</strong></nav>
    <section class="local-hero" aria-labelledby="local-title">
      <div class="local-hero__copy">
        <p class="eyebrow">TUYỂN THỢ MỎ TẠI ${name.toLocaleUpperCase("vi")}</p>
        <h1 id="local-title">Học nghề 2–3 tháng<br><em>làm việc tại Quảng Ninh</em></h1>
        <p class="local-hero__lead">Thông tin dành cho lao động nam tại ${name}${aliasPhrase} đang tìm hiểu nghề mỏ, chế độ học và cơ hội làm việc lâu dài.</p>
        <div class="location-clarity"><div><small>NƠI TUYỂN NGUỒN</small><strong>${name}</strong></div><span>→</span><div><small>NƠI HỌC & LÀM VIỆC</small><strong>Quảng Ninh</strong></div></div>
        <div class="contact-pair">
          <a class="contact-button contact-button--zalo" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="province-${slug}"><span class="contact-icon contact-icon--text">Z</span><span><small>Nhắn trực tiếp</small><strong>Zalo 096 304 8585</strong></span></a>
          <a class="contact-button contact-button--messenger" href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer" data-contact="messenger" data-context="province-${slug}"><span class="contact-icon contact-icon--text">M</span><span><small>Nhắn Fanpage</small><strong>Messenger</strong></span></a>
        </div>
      </div>
      <aside class="local-check"><p class="eyebrow">KIỂM TRA NHANH</p><h2>Gửi 3 thông tin</h2><ol><li><b>1</b><span>Năm sinh</span></li><li><b>2</b><span>Chiều cao – cân nặng</span></li><li><b>3</b><span>Tình trạng sức khỏe</span></li></ol><button class="copy-button copy-button--full" type="button" data-copy-template>Sao chép mẫu tin nhắn</button><p>Chỉ chuẩn bị hồ sơ và di chuyển sau khi được kiểm tra điều kiện, xác nhận lịch tiếp nhận.</p></aside>
    </section>

    <section class="trust-strip trust-strip--local" aria-label="Thông tin chính"><span>✓ Nam 18–35 tuổi</span><span>✓ Cao từ 1m56</span><span>✓ Nặng từ 48kg</span><span>✓ Sức khỏe tốt</span></section>

    <section class="section local-overview" aria-labelledby="overview-title">
      <div class="section-heading"><div><p class="eyebrow">THÔNG TIN DÀNH CHO ${name.toLocaleUpperCase("vi")}</p><h2 id="overview-title">Tuyển thợ mỏ tại ${name}: cần biết gì trước?</h2></div><p>${localContext}</p></div>
      <div class="overview-grid">
        <article><span>01</span><h3>Kiểm tra điều kiện</h3><p>Nam 18–35 tuổi, cao từ 1m56, nặng từ 48kg và có sức khỏe tốt.</p></article>
        <article><span>02</span><h3>Xác nhận chế độ</h3><p>Đối chiếu học phí, ăn ở, hỗ trợ 7,5 triệu và kế hoạch tiếp nhận của từng đợt.</p></article>
        <article><span>03</span><h3>Học nghề 2–3 tháng</h3><p>Áp dụng với nghề khai thác mỏ và xây dựng mỏ; lịch cụ thể được xác nhận trước.</p></article>
        <article><span>04</span><h3>Nhận việc tại Quảng Ninh</h3><p>Người đạt yêu cầu được bố trí công việc theo nghề đào tạo và nhu cầu doanh nghiệp.</p></article>
      </div>
    </section>

    <section class="section section--dark local-benefits" aria-labelledby="benefits-title">
      <div class="section-heading section-heading--light"><div><p class="eyebrow eyebrow--light">LỘ TRÌNH RÕ RÀNG</p><h2 id="benefits-title">Từ ${name} đến nghề mỏ tại Quảng Ninh</h2></div><p>Không cần đi xa để hỏi thông tin ban đầu. Mọi trường hợp đều được kiểm tra từ xa trước.</p></div>
      <div class="benefit-grid benefit-grid--four"><article><small>01</small><strong>Tư vấn trực tiếp</strong><p>Trao đổi đúng nhu cầu và hoàn cảnh cá nhân.</p></article><article><small>02</small><strong>Hướng dẫn hồ sơ</strong><p>Chỉ chuẩn bị giấy tờ sau khi đủ điều kiện.</p></article><article><small>03</small><strong>Ăn ở trong khóa học</strong><p>Ba bữa mỗi ngày và ký túc xá theo bố trí.</p></article><article class="benefit-grid__accent"><small>04</small><strong>Cơ hội thu nhập ổn định</strong><p>Phụ thuộc vị trí, ngày công, năng suất và đơn vị.</p></article></div>
    </section>

    <section class="section local-overview" aria-labelledby="read-more-title">
      <div class="section-heading"><div><p class="eyebrow">ĐỌC TRƯỚC KHI ĐĂNG KÝ</p><h2 id="read-more-title">Bốn nội dung quan trọng</h2></div><p>Tìm hiểu đầy đủ giúp người lao động và gia đình chủ động hơn trước khi quyết định.</p></div>
      <div class="overview-grid"><article><h3>Điều kiện tuyển thợ lò</h3><p>Tuổi, chiều cao, cân nặng và yêu cầu sức khỏe.</p><a href="../../bai-viet/dieu-kien-tuyen-tho-lo-2026/">Đọc điều kiện →</a></article><article><h3>Hồ sơ dự tuyển</h3><p>Sơ yếu lý lịch, giấy khai sinh, bằng văn hóa và căn cước công dân.</p><a href="../../bai-viet/ho-so-hoc-nghe-mo-can-gi/">Xem hồ sơ →</a></article><article><h3>Khóa học 2–3 tháng</h3><p>Nội dung học nghề khai thác mỏ trước khi nhận việc.</p><a href="../../bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/">Xem khóa học →</a></article><article><h3>Tin tuyển dụng 2026</h3><p>Xem đầy đủ quyền lợi, thu nhập và tạo tin nhắn đăng ký.</p><a href="../../viec-lam/cong-nhan-mo-ham-lo-quang-ninh/">Ứng tuyển ngay →</a></article></div>
    </section>

    <section class="section section--faq local-faq" aria-labelledby="faq-title">
      <div class="faq-intro"><p class="eyebrow">HỎI ĐÁP TẠI ${name.toLocaleUpperCase("vi")}</p><h2 id="faq-title">Trước khi chuẩn bị đi học</h2><p>Câu trả lời dùng để sàng lọc ban đầu; lịch và chính sách cụ thể được xác nhận theo từng đợt.</p></div>
      <div class="faq-list"><details open><summary>Người ở ${name} có đăng ký được không?</summary><p>Có thể gửi thông tin để kiểm tra điều kiện. Nơi tuyển nguồn là ${name}; nơi học và làm việc thực tế là Quảng Ninh.</p></details><details><summary>Có cần đến Quảng Ninh để hỏi trước không?</summary><p>Không. Bước đầu có thể trao đổi qua Zalo hoặc Messenger; chỉ di chuyển sau khi có lịch và hướng dẫn rõ ràng.</p></details><details><summary>Thời gian học bao lâu?</summary><p>Nghề khai thác mỏ và xây dựng mỏ học 2–3 tháng. Lịch cụ thể phụ thuộc từng đợt tiếp nhận.</p></details><details><summary>Cần chuẩn bị hồ sơ ngay không?</summary><p>Chưa cần. Hãy gửi năm sinh, chiều cao/cân nặng và sức khỏe trước; hồ sơ được hướng dẫn sau khi phù hợp điều kiện.</p></details></div>
    </section>
  </main>

  <section class="final-cta" aria-labelledby="final-title"><div><p class="eyebrow eyebrow--light">TƯ VẤN TUYỂN THỢ MỎ TẠI ${name.toLocaleUpperCase("vi")}</p><h2 id="final-title">Gửi 3 thông tin để kiểm tra điều kiện</h2><p>Năm sinh · Chiều cao/cân nặng · Tình trạng sức khỏe hiện tại.</p></div><div class="contact-pair"><a class="contact-button contact-button--zalo" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo"><span class="contact-icon contact-icon--text">Z</span><span><small>Nhắn trực tiếp</small><strong>Zalo 096 304 8585</strong></span></a><a class="contact-button contact-button--messenger" href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer" data-contact="messenger"><span class="contact-icon contact-icon--text">M</span><span><small>Nhắn Fanpage</small><strong>Messenger</strong></span></a></div></section>
  <footer class="site-footer"><div class="footer-brand"><span class="brand-mark">TL</span><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Tư vấn học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div></div><div class="footer-links"><a href="../../#theo-tinh">Tất cả tỉnh, thành</a><a href="../../#dieu-kien">Điều kiện tuyển</a><a href="../../tin-nganh-than/">Cẩm nang nghề mỏ</a><a href="../../quyen-rieng.html">Quyền riêng tư</a></div><p class="footer-note">Thông tin được xác nhận theo từng đợt tiếp nhận. Thu nhập thực tế phụ thuộc vị trí, ngày công, năng suất và đơn vị.</p></footer>
  <div class="mobile-contact" aria-label="Liên hệ nhanh"><a class="mobile-contact__zalo" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo"><b>Z</b><span>Nhắn Zalo</span></a><a class="mobile-contact__messenger" href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer" data-contact="messenger"><b>M</b><span>Messenger</span></a></div>
  <div class="toast" role="status" aria-live="polite" data-toast hidden></div>
  <script src="../../app.js?v=2" defer></script>
  <script src="/mobile-ux.js?v=1" defer></script>
</body>
</html>
`;
}

for (const province of provinces.filter((item) => item.create)) {
  const dir = path.join(outputRoot, province.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), provincePage(province));
}

const data = {
  updated_at: "2026-07-31",
  source_scope: "Toàn bộ 34 tỉnh, thành theo hệ thống đơn vị hành chính cấp tỉnh hiện hành năm 2026",
  provinces: provinces.map(({ create, ...province }) => province),
};
fs.writeFileSync(path.join(root, "data", "provinces-2026.json"), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Generated ${provinces.filter((item) => item.create).length} new province pages; directory contains ${provinces.length} provinces/cities.`);
