import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const today = "2026-08-02";
const cssTag = '<link rel="stylesheet" href="/verification-portal.css?v=1">';
const scriptTag = '<script src="/verification-portal.js?v=1" defer></script>';

if (!fs.existsSync(root)) throw new Error(`Missing website root: ${root}`);

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const portalNav = `
  <nav class="main-nav" aria-label="Điều hướng cổng kiểm chứng nghề mỏ">
    <a href="/chon-kcn-hay-lam-mo/">KCN hay làm mỏ</a>
    <a href="/cau-chuyen-cong-nhan/">Câu chuyện công nhân</a>
    <a href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a>
    <a href="/ho-so-nhap-hoc/">Hồ sơ</a>
    <a href="/thu-nhap-an-o-ho-tro/">Thu nhập &amp; ăn ở</a>
    <a href="/an-toan-ky-luat-moi-truong/">An toàn</a>
  </nav>`;

const footer = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div><a class="brand brand-light" href="/"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><p>Thông tin để người lao động tự kiểm chứng trước khi đăng ký học nghề mỏ.</p></div>
      <div><h2>Kiểm chứng</h2><a href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a><a href="/ho-so-nhap-hoc/">Hồ sơ nhập học</a><a href="/thu-nhap-an-o-ho-tro/">Thu nhập, ăn ở, hỗ trợ</a></div>
      <div><h2>Liên hệ</h2><a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="verification-footer">Zalo: 096 304 8585</a><a href="tel:+84963048585" data-contact="phone" data-context="verification-footer">Gọi: 096 304 8585</a><a href="/quyen-rieng.html">Quyền riêng tư</a></div>
    </div>
    <div class="container footer-bottom">© 2026 Thầy Linh – Tuyển Thợ Mỏ</div>
  </footer>`;

const mobileContact = `
  <nav class="verification-mobile-contact" data-verification-mobile-contact aria-label="Liên hệ nhanh qua Zalo, Messenger hoặc điện thoại">
    <a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="mobile-fixed-verification"><strong>Zalo</strong><span>Nhắn tư vấn</span></a>
    <a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer" data-contact="messenger" data-context="mobile-fixed-verification"><strong>Mess</strong><span>Nhắn tin</span></a>
    <a href="tel:+84963048585" data-contact="phone" data-context="mobile-fixed-verification"><strong>Gọi</strong><span>096 304 8585</span></a>
  </nav>`;

function structuredData(page) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `https://thaylinhtuyenthomo.vn/${page.slug}/`,
    inLanguage: "vi-VN",
    dateModified: today,
    isPartOf: {
      "@type": "WebSite",
      name: "Thầy Linh – Tuyển Thợ Mỏ",
      url: "https://thaylinhtuyenthomo.vn/",
    },
    author: {
      "@type": "Person",
      name: "Nguyễn Tử Linh",
      alternateName: "Thầy Linh – Tuyển Thợ Mỏ",
    },
  });
}

function pageHtml(page) {
  const canonical = `https://thaylinhtuyenthomo.vn/${page.slug}/`;
  return `<!doctype html>
<html lang="vi" data-verification-page="${escapeHtml(page.kind)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#063c46">
  <title>${escapeHtml(page.title)} | Thầy Linh</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg">
  <link rel="stylesheet" href="/landing-recruitment.css?v=17">
  <link rel="stylesheet" href="/publication-polish.css?v=5">
  <link rel="stylesheet" href="/mobile-core.css?v=1">
  <link rel="stylesheet" href="/fonts.css?v=2">
  ${cssTag}
  <script type="application/ld+json">${structuredData(page)}</script>
</head>
<body class="verification-page">
  <a class="skip-link" href="#noi-dung">Bỏ qua menu</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="Trang chủ Thầy Linh"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a>
      ${portalNav}
      <a class="header-cta" href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a>
    </div>
  </header>
  <main id="noi-dung">
    <section class="verification-page__hero">
      <div class="container">
        <p class="verification-page__eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeHtml(page.heading)}</h1>
        <p class="verification-page__lead">${escapeHtml(page.lead)}</p>
        <div class="verification-page__actions"><a href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện trước</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="verification-hero">Hỏi Thầy Linh qua Zalo</a></div>
      </div>
    </section>
    ${page.body}
    <section class="verification-page__section verification-page__section--soft">
      <div class="container">
        <div class="verification-policy"><strong>Nguyên tắc của cổng kiểm chứng</strong>Nội dung giúp người lao động tự đối chiếu trước khi liên hệ. Bộ kiểm tra trên website chỉ là sàng lọc sơ bộ; không lưu câu trả lời sức khỏe và không thay thế khám tuyển. Quảng cáo dẫn về các trang này phải được vận hành theo nhóm việc làm/Special Ad Category khi Meta yêu cầu.</div>
      </div>
    </section>
  </main>
  ${footer}
  ${mobileContact}
  <script src="/analytics.js?v=6" defer></script>
  <script src="/mobile-core.js?v=1" defer></script>
  ${scriptTag}
</body>
</html>`;
}

const pages = [
  {
    slug: "chon-kcn-hay-lam-mo",
    kind: "career-comparison",
    title: "Chọn làm khu công nghiệp hay học nghề mỏ",
    description: "So sánh thẳng thắn công việc khu công nghiệp và nghề mỏ về điều kiện, đào tạo, thu nhập, ăn ở, kỷ luật và mức độ phù hợp.",
    eyebrow: "So sánh trước khi lựa chọn",
    heading: "Chọn KCN hay làm mỏ: đừng quyết định chỉ bằng một con số lương",
    lead: "Hai hướng đi đều có người phù hợp. Trang này giúp bạn nhìn vào tính chất công việc, yêu cầu sức khỏe, lộ trình học nghề, thu nhập, ăn ở và kỷ luật trước khi chọn.",
    body: `
    <section class="verification-page__section">
      <div class="container">
        <h2>So sánh theo điều người lao động thực sự quan tâm</h2>
        <p class="verification-page__intro">Thông tin về khu công nghiệp thay đổi theo nhà máy, địa phương và vị trí. Cột KCN dưới đây mô tả đặc điểm thường gặp, không đại diện cho mọi doanh nghiệp.</p>
        <div class="verification-comparison"><table><thead><tr><th>Tiêu chí</th><th>Làm tại khu công nghiệp</th><th>Học nghề và làm mỏ</th></tr></thead><tbody>
          <tr><td>Cách vào nghề</td><td>Thường tuyển trực tiếp theo vị trí; yêu cầu bằng cấp và kinh nghiệm tùy nhà máy.</td><td>Được kiểm tra điều kiện đầu vào, đào tạo nghề trước khi doanh nghiệp tiếp nhận công việc.</td></tr>
          <tr><td>Tính chất công việc</td><td>Ca kíp, dây chuyền hoặc vận hành máy; mức độ lặp lại và áp lực sản lượng tùy vị trí.</td><td>Làm việc theo tổ đội trong môi trường mỏ hầm lò; yêu cầu thể lực, phối hợp và tuân thủ quy trình an toàn.</td></tr>
          <tr><td>Điều kiện sức khỏe</td><td>Do từng doanh nghiệp quy định.</td><td>Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg và phù hợp yêu cầu sức khỏe; khám tuyển là căn cứ cuối cùng.</td></tr>
          <tr><td>Thu nhập</td><td>Biến động theo địa phương, nhà máy, tăng ca, tay nghề và vị trí; cần đọc đúng hợp đồng của nơi tuyển.</td><td>Thông tin tuyển sinh đang áp dụng nêu cam kết 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</td></tr>
          <tr><td>Học và ăn ở ban đầu</td><td>Tùy chính sách từng doanh nghiệp; có nơi tự túc, có nơi hỗ trợ một phần.</td><td>Miễn kinh phí đào tạo, ăn 3 bữa/ngày, ở ký túc xá và hỗ trợ 7,5 triệu đồng trong thời gian học.</td></tr>
          <tr><td>Kỷ luật</td><td>Tuân thủ giờ ca, nội quy nhà máy và tiêu chuẩn chất lượng.</td><td>Kỷ luật ca kíp, bảo hộ, quy trình kỹ thuật và mệnh lệnh an toàn là yêu cầu bắt buộc.</td></tr>
        </tbody></table></div>
        <div class="verification-decision">
          <article><h3>KCN có thể phù hợp hơn khi…</h3><ul><li>Bạn muốn làm gần nơi ở và đã xác định được nhà máy cụ thể.</li><li>Bạn cần công việc không thuộc môi trường hầm lò.</li><li>Bạn đã kiểm tra rõ lương cơ bản, phụ cấp, tăng ca và chi phí thuê trọ.</li></ul></article>
          <article><h3>Nghề mỏ có thể phù hợp hơn khi…</h3><ul><li>Bạn chấp nhận học nghề, làm việc tại Quảng Ninh và tuân thủ kỷ luật cao.</li><li>Bạn đáp ứng điều kiện sức khỏe sơ bộ.</li><li>Bạn ưu tiên lộ trình đào tạo, ăn ở trong thời gian học và mức thu nhập gắn với định mức.</li></ul></article>
        </div>
        <div class="verification-note"><strong>Không nên chọn nghề mỏ chỉ vì nghe mức lương.</strong> Hãy xem tiếp trang an toàn, môi trường làm việc và tự kiểm tra điều kiện trước khi chuẩn bị hồ sơ.</div>
      </div>
    </section>`,
  },
  {
    slug: "cau-chuyen-cong-nhan",
    kind: "worker-stories",
    title: "Câu chuyện công nhân ngành mỏ theo tỉnh",
    description: "Xem video, câu chuyện và tư liệu công nhân ngành mỏ theo đúng tỉnh để kiểm chứng công việc, thu nhập và hành trình học nghề.",
    eyebrow: "Người thật · hành trình thật",
    heading: "Câu chuyện công nhân theo tỉnh",
    lead: "Mỗi trang tỉnh ưu tiên đúng người, đúng địa phương và đúng tư liệu. Nơi chưa có video hoặc ảnh lương riêng sẽ ghi rõ đang cập nhật, không lấy người tỉnh khác thay thế.",
    body: `
    <section class="verification-page__section">
      <div class="container">
        <h2>Chọn tỉnh để xem câu chuyện gần với mình</h2>
        <p class="verification-page__intro">Video và tư liệu thực tế giúp người lao động hình dung rõ hơn về quá trình đi học, thích nghi với công việc và cuộc sống tại Quảng Ninh.</p>
        <div class="verification-province-grid">
          <a class="verification-province" href="/viec-lam-nganh-than/nghe-an/"><small>Nghệ An</small><strong>Nguyễn Văn Thái – Anh Sơn</strong><span>Câu chuyện công nhân với thu nhập bình quân được công bố khoảng 28 triệu đồng/tháng.</span><b>Xem trang Nghệ An →</b></a>
          <a class="verification-province" href="/viec-lam-nganh-than/ha-tinh/"><small>Hà Tĩnh</small><strong>Nguyễn Trịnh Anh – Hà Tĩnh</strong><span>Video và tư liệu địa phương về hành trình làm việc trong ngành Than.</span><b>Xem trang Hà Tĩnh →</b></a>
          <a class="verification-province" href="/viec-lam-nganh-than/quang-tri/"><small>Quảng Trị</small><strong>Hồ Văn Cương – Hướng Hóa</strong><span>Chia sẻ về công việc, tổ đội và mức thu nhập thực tế được nêu trong video.</span><b>Xem trang Quảng Trị →</b></a>
          <a class="verification-province" href="/viec-lam-nganh-than/quang-ngai/"><small>Quảng Ngãi</small><strong>Đinh Văn Ne – Quảng Ngãi</strong><span>Tư liệu công nhân địa phương đang làm việc tại vùng mỏ Quảng Ninh.</span><b>Xem trang Quảng Ngãi →</b></a>
          <a class="verification-province" href="/viec-lam-nganh-than/gia-lai/"><small>Gia Lai</small><strong>Hành trình từ Tây Nguyên đến vùng mỏ</strong><span>Video công nhân Gia Lai chia sẻ về nghề và thu nhập tại Than Quang Hanh.</span><b>Xem trang Gia Lai →</b></a>
          <a class="verification-province" href="/viec-lam-nganh-than/dak-lak/"><small>Đắk Lắk</small><strong>Tư liệu địa phương đang tiếp tục bổ sung</strong><span>Trang tỉnh chỉ công bố nội dung đã đối chiếu; chưa gắn câu chuyện tỉnh khác để lấp chỗ trống.</span><b>Xem trang Đắk Lắk →</b></a>
        </div>
        <div class="verification-page__actions"><a href="/viec-lam-nganh-than/">Xem toàn bộ trang tỉnh</a><a href="/anh-video-thuc-te/">Xem thư viện ảnh và video</a></div>
      </div>
    </section>`,
  },
  {
    slug: "kiem-tra-dieu-kien",
    kind: "condition-check",
    title: "Kiểm tra điều kiện học nghề mỏ",
    description: "Tự kiểm tra sơ bộ độ tuổi, chiều cao, cân nặng và sức khỏe trước khi đăng ký học nghề mỏ; website không lưu câu trả lời.",
    eyebrow: "30 giây · không lưu dữ liệu",
    heading: "Kiểm tra điều kiện học nghề mỏ trước khi làm hồ sơ",
    lead: "Bốn câu hỏi dưới đây chỉ giúp định hướng ban đầu. Website không lưu câu trả lời; khám tuyển là căn cứ xác nhận cuối cùng.",
    body: `
    <section class="verification-page__section" id="kiem-tra">
      <div class="container">
        <h2>Trả lời đủ 4 câu hỏi</h2>
        <p class="verification-page__intro">Không nhập tên, số điện thoại, bệnh án hoặc giấy tờ cá nhân vào công cụ này.</p>
        <form class="verification-check" id="dang-ky" data-verification-condition-form novalidate>
          <fieldset><legend>1. Bạn là nam từ 18 đến 40 tuổi?</legend><div class="verification-check__choices"><label><input type="radio" name="age_range" value="yes"><span>Có</span></label><label><input type="radio" name="age_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
          <fieldset><legend>2. Chiều cao của bạn từ 1m53 trở lên?</legend><div class="verification-check__choices"><label><input type="radio" name="height_range" value="yes"><span>Có</span></label><label><input type="radio" name="height_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
          <fieldset><legend>3. Cân nặng của bạn từ 47kg trở lên?</legend><div class="verification-check__choices"><label><input type="radio" name="weight_range" value="yes"><span>Có</span></label><label><input type="radio" name="weight_range" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
          <fieldset><legend>4. Bạn có sức khỏe tốt, không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt?</legend><div class="verification-check__choices"><label><input type="radio" name="health_screen" value="yes"><span>Có</span></label><label><input type="radio" name="health_screen" value="review"><span>Chưa / không rõ</span></label></div></fieldset>
          <button class="verification-check__submit" type="submit">Xem kết quả sơ bộ</button>
          <div class="verification-check__result" data-verification-condition-result role="status" aria-live="polite" hidden></div>
        </form>
      </div>
    </section>`,
  },
  {
    slug: "ho-so-nhap-hoc",
    kind: "dossier",
    title: "Hồ sơ nhập học nghề mỏ",
    description: "Danh sách giấy tờ cần mang khi nhập học nghề mỏ, thời điểm chuẩn bị và địa chỉ Khu C – Phân hiệu Đào tạo Cẩm Phả, Quang Hanh.",
    eyebrow: "Chuẩn bị đúng · không đi lại thừa",
    heading: "Hồ sơ nhập học nghề mỏ gồm những gì?",
    lead: "Đăng ký ban đầu chưa cần gửi ảnh giấy tờ. Chỉ chuẩn bị và đến nhập học sau khi được xác nhận điều kiện sơ bộ cùng lịch tiếp nhận.",
    body: `
    <section class="verification-page__section">
      <div class="container">
        <h2>Ba nhóm giấy tờ cần chuẩn bị</h2>
        <div class="verification-card-grid">
          <article class="verification-card"><h3>1. Căn cước công dân</h3><p>Mang bản gốc để đối chiếu và làm thủ tục nhập học.</p></article>
          <article class="verification-card"><h3>2. Giấy khai sinh</h3><p>Chuẩn bị giấy khai sinh theo hướng dẫn khi lịch tiếp nhận đã được xác nhận.</p></article>
          <article class="verification-card"><h3>3. Bằng THCS hoặc THPT nếu có</h3><p>Chưa có bằng vẫn có thể đăng ký trước để được hướng dẫn đối chiếu theo hệ đào tạo phù hợp.</p></article>
        </div>
      </div>
    </section>
    <section class="verification-page__section verification-page__section--soft">
      <div class="container">
        <h2>Quy trình để không chuẩn bị sai</h2>
        <ol class="verification-steps"><li><strong>Gửi thông tin cơ bản</strong><span>Năm sinh, chiều cao/cân nặng, sức khỏe và tỉnh đang sinh sống.</span></li><li><strong>Được kiểm tra điều kiện sơ bộ</strong><span>Chưa phải gửi bệnh án hoặc ảnh giấy tờ lên website.</span></li><li><strong>Nhận lịch tiếp nhận</strong><span>Chỉ sau khi được xác nhận mới chuẩn bị hành trình đến Quảng Ninh.</span></li><li><strong>Đến đúng địa điểm</strong><span>Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh.</span></li></ol>
        <div class="verification-note"><strong>Không gửi CCCD công khai trên Facebook hoặc bình luận.</strong> Trao đổi trực tiếp qua kênh chính thức khi được yêu cầu đối chiếu.</div>
      </div>
    </section>`,
  },
  {
    slug: "thu-nhap-an-o-ho-tro",
    kind: "benefits",
    title: "Lương thợ lò, ăn ở và hỗ trợ học nghề mỏ",
    description: "Lương thợ lò 20–25 triệu đồng/tháng khi hoàn thành định mức lao động; miễn học phí, có ba bữa/ngày, ký túc xá và hỗ trợ 7,5 triệu đồng.",
    eyebrow: "Đọc đủ điều kiện áp dụng",
    heading: "Lương thợ lò, ăn ở và hỗ trợ học nghề mỏ",
    lead: "Xem rõ mức lương thợ lò sau đào tạo, điều kiện hoàn thành định mức lao động, chính sách miễn học phí, ăn ở và hỗ trợ trước khi đăng ký.",
    body: `
    <section class="verification-page__section">
      <div class="container">
        <h2>Những thông tin đang áp dụng</h2>
        <div class="verification-card-grid">
          <article class="verification-card"><h3>Lương thợ lò sau đào tạo</h3><p><strong>20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</strong></p><p>Mức này gắn với yêu cầu công việc và định mức, không phải khoản trả cho người chưa đi làm hoặc chưa hoàn thành nhiệm vụ.</p></article>
          <article class="verification-card"><h3>Miễn học phí</h3><p>Người học không phải đóng kinh phí đào tạo theo chỉ tiêu tuyển sinh đang áp dụng.</p><p>Khai thác mỏ và xây dựng mỏ học khoảng 2–3 tháng; cơ điện mỏ học khoảng 10 tháng.</p></article>
          <article class="verification-card"><h3>Ăn và ở khi học</h3><p>Được phục vụ 3 bữa/ngày và bố trí ở ký túc xá trong thời gian học.</p></article>
          <article class="verification-card"><h3>Hỗ trợ sinh hoạt</h3><p>Được hỗ trợ tổng cộng 7,5 triệu đồng trong thời gian học theo thông tin tuyển sinh đang áp dụng.</p></article>
          <article class="verification-card"><h3>Việc làm sau tốt nghiệp</h3><p>Người đạt yêu cầu được doanh nghiệp thuộc TKV tiếp nhận, ký hợp đồng và bố trí công việc tại Quảng Ninh.</p></article>
          <article class="verification-card"><h3>Điều cần hỏi trước khi đi</h3><p>Lịch nhập học, nghề được tiếp nhận, thời gian học và địa điểm cụ thể phải được xác nhận theo từng trường hợp.</p></article>
        </div>
        <div class="verification-note"><strong>Cách kiểm chứng đúng:</strong> xem câu chuyện công nhân theo tỉnh, đọc thông tin điều kiện và gọi trực tiếp khi có điểm chưa rõ. Không tự suy ra rằng mọi tháng, mọi vị trí đều có mức thu nhập giống nhau.</div>
      </div>
    </section>`,
  },
  {
    slug: "an-toan-ky-luat-moi-truong",
    kind: "safety",
    title: "An toàn, kỷ luật và môi trường làm việc nghề mỏ",
    description: "Tìm hiểu môi trường mỏ hầm lò, đào tạo an toàn, bảo hộ lao động, kỷ luật ca kíp và tinh thần tổ đội trước khi đăng ký.",
    eyebrow: "Hiểu nghề trước khi chọn nghề",
    heading: "An toàn, kỷ luật và môi trường làm việc nghề mỏ",
    lead: "Nghề mỏ không phù hợp với người chỉ nhìn vào thu nhập mà bỏ qua môi trường hầm lò, thể lực, ca kíp, quy trình kỹ thuật và trách nhiệm với tổ đội.",
    body: `
    <section class="verification-page__section">
      <div class="container">
        <h2>Sáu điều cần chấp nhận trước khi đăng ký</h2>
        <div class="verification-card-grid">
          <article class="verification-card"><h3>Đào tạo trước khi làm việc</h3><p>Người chưa có nghề phải học lý thuyết, thực hành và an toàn trước khi được bố trí công việc.</p></article>
          <article class="verification-card"><h3>Bảo hộ là bắt buộc</h3><p>Trang bị bảo hộ, kiểm tra trước ca và sử dụng đúng thiết bị không phải lựa chọn cá nhân.</p></article>
          <article class="verification-card"><h3>Làm việc theo tổ đội</h3><p>Mỗi người phải phối hợp, giữ liên lạc và thực hiện đúng phân công; sai sót của một cá nhân có thể ảnh hưởng cả tổ.</p></article>
          <article class="verification-card"><h3>Kỷ luật ca kíp</h3><p>Đi đúng giờ, bàn giao đúng quy trình, tuân thủ lệnh sản xuất và không tự ý bỏ vị trí.</p></article>
          <article class="verification-card"><h3>Môi trường hầm lò</h3><p>Công việc diễn ra dưới lòng đất, có tiếng ồn, bụi, độ ẩm và yêu cầu thể lực; hệ thống thông gió, quan trắc và quy trình an toàn phải được tuân thủ.</p></article>
          <article class="verification-card"><h3>Khám sức khỏe là căn cứ cuối cùng</h3><p>Bộ kiểm tra online chỉ định hướng. Kết quả khám tuyển quyết định khả năng phù hợp với công việc.</p></article>
        </div>
      </div>
    </section>
    <section class="verification-page__section verification-page__section--soft">
      <div class="container">
        <h2>Người phù hợp thường có những phẩm chất gì?</h2>
        <div class="verification-decision"><article><h3>Có thể phù hợp</h3><ul><li>Chấp nhận học nghề từ đầu và làm việc xa nhà tại Quảng Ninh.</li><li>Có thể lực, tinh thần đồng đội và ý thức kỷ luật.</li><li>Sẵn sàng tuân thủ quy trình thay vì làm theo thói quen cá nhân.</li></ul></article><article><h3>Cần cân nhắc kỹ</h3><ul><li>Sợ không gian hầm lò hoặc không thích làm việc theo ca.</li><li>Không muốn chịu sự kiểm tra an toàn nghiêm ngặt.</li><li>Chỉ quan tâm mức lương mà chưa tìm hiểu công việc thực tế.</li></ul></article></div>
        <div class="verification-page__actions"><a href="/bai-viet/dao-tao-an-toan-truoc-khi-vao-lo/">Đọc về đào tạo an toàn</a><a href="/bai-viet/hoc-thuc-hanh-nghe-mo-ham-lo/">Xem cách học thực hành</a></div>
      </div>
    </section>`,
  },
];

function writePages() {
  for (const page of pages) {
    const dir = path.join(root, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), pageHtml(page));
  }
}

function enhanceHome() {
  const target = path.join(root, "index.html");
  let source = fs.readFileSync(target, "utf8");
  source = source.replace(/\s*<section class="verification-gateway"[\s\S]*?<\/section>\s*/i, "\n\n");
  if (source.includes('id="cong-kiem-chung-nghe-mo"')) {
    throw new Error("Home verification gateway was not removed");
  }
  fs.writeFileSync(target, source);
}

function enhanceMobileUxLoader() {
  const target = path.join(root, "mobile-ux.js");
  let source = fs.readFileSync(target, "utf8");
  const marker = "function loadVerificationPortalAssets()";
  if (source.includes(marker)) return "already-enhanced";
  const closing = source.lastIndexOf("})();");
  if (closing < 0) throw new Error("mobile-ux.js is missing its IIFE closing marker");
  const loader = `\n  function loadVerificationPortalAssets() {\n    if (!document.querySelector('link[href^=\"/verification-portal.css\"]')) {\n      const style = document.createElement(\"link\");\n      style.rel = \"stylesheet\";\n      style.href = \"/verification-portal.css?v=1\";\n      document.head.append(style);\n    }\n    if (!document.querySelector('script[src^=\"/verification-portal.js\"]')) {\n      const script = document.createElement(\"script\");\n      script.src = \"/verification-portal.js?v=1\";\n      script.async = true;\n      document.head.append(script);\n    }\n  }\n\n  loadVerificationPortalAssets();\n`;
  source = `${source.slice(0, closing)}${loader}${source.slice(closing)}`;
  fs.writeFileSync(target, source);
  return "enhanced";
}

const searchItems = pages.map((page, index) => ({
  url: `/${page.slug}/`,
  title: page.title,
  description: page.description,
  keywords: {
    "chon-kcn-hay-lam-mo": ["chọn KCN hay làm mỏ", "khu công nghiệp", "so sánh nghề", "nên làm mỏ không"],
    "cau-chuyen-cong-nhan": ["câu chuyện công nhân", "video công nhân theo tỉnh", "người thật việc thật", "phỏng vấn thợ mỏ"],
    "kiem-tra-dieu-kien": ["kiểm tra điều kiện", "đủ điều kiện làm mỏ", "tuổi chiều cao cân nặng", "sức khỏe thợ mỏ"],
    "ho-so-nhap-hoc": ["hồ sơ nhập học", "CCCD", "giấy khai sinh", "bằng THCS THPT", "địa chỉ nhập học"],
    "thu-nhap-an-o-ho-tro": ["lương thợ lò", "lương thợ lò bao nhiêu", "thu nhập thợ mỏ", "ăn ở khi học", "hỗ trợ 7,5 triệu", "ký túc xá", "miễn học phí"],
    "an-toan-ky-luat-moi-truong": ["an toàn nghề mỏ", "môi trường hầm lò", "kỷ luật thợ mỏ", "bảo hộ lao động", "ca kíp"],
  }[page.slug],
  category: {
    "chon-kcn-hay-lam-mo": "work",
    "cau-chuyen-cong-nhan": "province",
    "kiem-tra-dieu-kien": "entry",
    "ho-so-nhap-hoc": "entry",
    "thu-nhap-an-o-ho-tro": "welfare",
    "an-toan-ky-luat-moi-truong": "technology",
  }[page.slug],
  categoryLabel: {
    work: "Công việc & lương",
    province: "Theo tỉnh",
    entry: "Điều kiện & hồ sơ",
    welfare: "Đời sống & phúc lợi",
    technology: "An toàn & công nghệ",
  }[{
    "chon-kcn-hay-lam-mo": "work",
    "cau-chuyen-cong-nhan": "province",
    "kiem-tra-dieu-kien": "entry",
    "ho-so-nhap-hoc": "entry",
    "thu-nhap-an-o-ho-tro": "welfare",
    "an-toan-ky-luat-moi-truong": "technology",
  }[page.slug]],
  type: "Cổng kiểm chứng nghề mỏ",
  priority: 178 - index,
}));

function enhanceSearchIndex() {
  const target = path.join(root, "search-index.json");
  const data = JSON.parse(fs.readFileSync(target, "utf8"));
  if (data.version !== 3 || !Array.isArray(data.items)) throw new Error("Verification portal requires search index version 3");
  const urls = new Set(searchItems.map(item => item.url));
  data.items = data.items.filter(item => !urls.has(item.url));
  data.items.push(...searchItems);
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
}

writePages();
enhanceHome();
const mobileLoader = "analytics-core";

console.log(JSON.stringify({
  status: "built",
  pages: pages.map(page => `/${page.slug}/`),
  mobile_ux_loader: mobileLoader,
  search_items: searchItems.length,
}, null, 2));
