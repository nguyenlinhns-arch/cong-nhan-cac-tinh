import "./build-verification-portal.mjs";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo/chon-kcn-hay-lam-mo/index.html");
const reelUrl = "https://www.facebook.com/reel/1145886217664123";

if (!fs.existsSync(target)) throw new Error(`Missing comparison page: ${target}`);

const escapeAttribute = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const title = "KCN hay làm mỏ? So sánh lương, chi phí, công việc";
const description = "Làm khu công nghiệp hay học nghề mỏ? So sánh tiền còn lại, chi phí ban đầu, điều kiện sức khỏe, lộ trình đào tạo và cơ hội làm việc tại Quảng Ninh.";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Nên làm khu công nghiệp hay học nghề mỏ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Không có một đáp án đúng cho tất cả. Khu công nghiệp phù hợp hơn khi người lao động ưu tiên ở gần nhà và đã xác định rõ nhà máy, thu nhập thực nhận cùng chi phí sinh hoạt. Nghề mỏ phù hợp hơn khi đáp ứng sức khỏe, chấp nhận làm việc tại Quảng Ninh, tuân thủ kỷ luật hầm lò và muốn có lộ trình học nghề trước khi làm việc.",
      },
    },
    {
      "@type": "Question",
      name: "Thu nhập nghề mỏ hiện nay được thông tin như thế nào?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Thông tin tuyển sinh đang áp dụng Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.",
      },
    },
    {
      "@type": "Question",
      name: "Học nghề mỏ có phải đóng học phí và tự lo ăn ở không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Người học thuộc chỉ tiêu được miễn kinh phí đào tạo, ăn 3 bữa mỗi ngày, ở ký túc xá và được hỗ trợ 7,5 triệu đồng/tháng trong thời gian học.",
      },
    },
    {
      "@type": "Question",
      name: "Điều kiện sơ bộ để đăng ký học nghề mỏ là gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nam từ 18 đến 40 tuổi, cao từ 1m53, nặng từ 47kg, sức khỏe tốt, không cận thị và không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng công việc. Khám tuyển là căn cứ cuối cùng.",
      },
    },
    {
      "@type": "Question",
      name: "Thời gian học nghề mỏ bao lâu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Các nghề khai thác và xây dựng mỏ hầm lò thường đào tạo khoảng 2–3 tháng; nghề cơ điện mỏ đào tạo khoảng 10 tháng.",
      },
    },
  ],
};

const heroAndBody = `    <section class="verification-page__hero kcn-hero">
      <div class="container">
        <p class="verification-page__eyebrow">Xem video · so sánh bằng hoàn cảnh thật</p>
        <h1>Chọn KCN hay làm mỏ: đừng chỉ hỏi lương bao nhiêu, hãy hỏi mỗi tháng còn lại bao nhiêu</h1>
        <p class="verification-page__lead">Có người phù hợp với một nhà máy gần nhà. Có người cần học một nghề, có chỗ ăn ở ban đầu và một mức thu nhập đủ để thay đổi cuộc sống. Quyết định đúng phải dựa trên tiền còn lại, sức khỏe, kỷ luật, khoảng cách gia đình và con đường nghề nghiệp — không chỉ một con số lương.</p>
        <div class="verification-page__actions"><a href="#video-so-sanh">Xem video trước</a><a href="/kiem-tra-dieu-kien/" data-verification-action="condition" data-context="kcn-hero">Kiểm tra điều kiện của tôi</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="kcn-hero">Hỏi Thầy Linh qua Zalo</a></div>
      </div>
    </section>

    <section class="verification-page__section kcn-video-section" id="video-so-sanh">
      <div class="container kcn-video-layout">
        <div class="kcn-reel-shell">
          <div class="kcn-reel">
            <iframe title="Video Chọn KCN hay làm mỏ của Thầy Linh" src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1145886217664123%2F&amp;show_text=false&amp;width=360" width="360" height="640" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" loading="lazy"></iframe>
          </div>
          <a class="kcn-reel-link" href="${reelUrl}" target="_blank" rel="noopener noreferrer" data-context="kcn-reel">Mở video trên Facebook →</a>
        </div>
        <div class="kcn-video-copy">
          <p class="verification-page__eyebrow">Điều video muốn người lao động nhìn thấy</p>
          <h2>Hai công việc không thể so bằng một dòng “lương tháng”</h2>
          <p>Điều quyết định chất lượng cuộc sống không phải chỉ là số tiền ghi trên tin tuyển dụng, mà là <strong>số tiền thực sự giữ lại sau một tháng</strong> và khả năng duy trì công việc trong nhiều năm.</p>
          <p>Ở khu công nghiệp, cần hỏi rõ lương cơ bản, phụ cấp, tăng ca, tiền thuê trọ, tiền ăn và chi phí đi lại. Với nghề mỏ, cần nhìn đủ thời gian học nghề, điều kiện sức khỏe, môi trường hầm lò, kỷ luật tổ đội, nơi làm việc tại Quảng Ninh và mức thu nhập sau khi hoàn thành đào tạo.</p>
          <blockquote class="kcn-quote">Đừng chọn nơi nghe có vẻ dễ hơn. Hãy chọn con đường mà sức khỏe của bạn chịu được, gia đình bạn đồng thuận và thu nhập giúp bạn tiến lên.</blockquote>
          <div class="kcn-mini-actions"><a href="/cau-chuyen-cong-nhan/">Xem người thật, việc thật</a><a href="/thu-nhap-an-o-ho-tro/">Xem đầy đủ quyền lợi</a></div>
        </div>
      </div>
    </section>

    <section class="verification-page__section verification-page__section--soft">
      <div class="container">
        <p class="verification-page__eyebrow">Bốn câu hỏi phải trả lời trước khi chọn</p>
        <h2>So sánh một công việc bằng cả cuộc sống đi kèm</h2>
        <div class="kcn-facts">
          <article><span>01</span><h3>Mỗi tháng còn lại bao nhiêu?</h3><p>Lấy thu nhập thực nhận cộng phụ cấp, rồi trừ tiền trọ, ăn uống, đi lại và các khoản phải tự chi. Con số còn lại mới phản ánh khả năng tích lũy.</p></article>
          <article><span>02</span><h3>Bắt đầu có tốn tiền không?</h3><p>Hãy tính cả chi phí học nghề, chỗ ở, bữa ăn và thời gian chờ việc. Với chương trình nghề mỏ đang áp dụng, người học thuộc chỉ tiêu được miễn kinh phí đào tạo, ăn 3 bữa/ngày, ở ký túc xá và hỗ trợ 7,5 triệu đồng/tháng trong thời gian học.</p></article>
          <article><span>03</span><h3>Sức khỏe có theo được không?</h3><p>Nghề mỏ hầm lò cần thể lực, khả năng làm việc theo ca và chấp hành tuyệt đối quy trình an toàn. Đây là điều kiện thật, không thể thay thế bằng mong muốn kiếm thu nhập cao.</p></article>
          <article><span>04</span><h3>Ba năm nữa mình có nghề gì?</h3><p>Một lựa chọn tốt không chỉ giải quyết tháng lương đầu tiên. Hãy nhìn tay nghề, bậc thợ, khả năng làm việc ổn định và cơ hội cải thiện cuộc sống trong vài năm tới.</p></article>
        </div>
      </div>
    </section>

    <section class="verification-page__section" id="bang-so-sanh">
      <div class="container">
        <p class="verification-page__eyebrow">Đặt hai lựa chọn lên cùng một mặt bàn</p>
        <h2>Làm khu công nghiệp và học nghề mỏ khác nhau ở đâu?</h2>
        <p class="verification-page__intro">Thông tin khu công nghiệp thay đổi theo từng doanh nghiệp, địa phương và vị trí. Vì vậy, cột KCN dưới đây là bộ câu hỏi cần kiểm tra với nơi tuyển cụ thể, không đại diện cho mọi nhà máy.</p>
        <div class="verification-comparison kcn-comparison-table"><table><thead><tr><th>Điều cần so</th><th>Làm tại khu công nghiệp</th><th>Học nghề và làm mỏ</th></tr></thead><tbody>
          <tr><td><strong>Nơi làm việc</strong></td><td>Có thể gần quê hoặc tại tỉnh có khu công nghiệp; cần xác định đúng nhà máy và địa chỉ làm việc.</td><td>Học và làm việc tại Quảng Ninh; phải chấp nhận xa nhà và thích nghi với cuộc sống vùng mỏ.</td></tr>
          <tr><td><strong>Cách bắt đầu</strong></td><td>Ứng tuyển trực tiếp vào vị trí; điều kiện, thử việc và kinh nghiệm do từng doanh nghiệp quy định.</td><td>Kiểm tra điều kiện đầu vào, nhập học nghề, hoàn thành đào tạo rồi được bố trí làm việc tại đơn vị ngành Than ở Quảng Ninh.</td></tr>
          <tr><td><strong>Thời gian chuẩn bị</strong></td><td>Tùy lịch tuyển, thời gian thử việc và yêu cầu của nhà máy.</td><td>Khai thác hoặc xây dựng mỏ hầm lò khoảng 2–3 tháng; cơ điện mỏ khoảng 10 tháng.</td></tr>
          <tr><td><strong>Chi phí ban đầu</strong></td><td>Phải hỏi rõ có hỗ trợ nhà ở, bữa ăn, xe đưa đón hay phải tự túc toàn bộ.</td><td>Miễn kinh phí đào tạo theo chỉ tiêu; ăn 3 bữa/ngày, ở ký túc xá và hỗ trợ 7,5 triệu đồng/tháng trong thời gian học.</td></tr>
          <tr><td><strong>Thu nhập</strong></td><td>Cần tách rõ lương cơ bản, phụ cấp, tiền tăng ca và số ngày công; sau đó trừ chi phí sinh hoạt thực tế.</td><td><strong>Cam kết 20–25 triệu đồng/tháng.</strong></td></tr>
          <tr><td><strong>Tính chất công việc</strong></td><td>Thường làm theo ca, dây chuyền, máy móc hoặc công đoạn sản xuất; nhịp độ và mức độ lặp lại tùy vị trí.</td><td>Làm việc trong môi trường mỏ hầm lò theo tổ đội; yêu cầu thể lực, phối hợp, tay nghề và tuân thủ quy trình an toàn.</td></tr>
          <tr><td><strong>Điều kiện sức khỏe</strong></td><td>Do từng doanh nghiệp và vị trí quy định.</td><td>Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg, sức khỏe tốt, không cận thị, không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng công việc; <strong>khám tuyển là căn cứ cuối cùng.</strong></td></tr>
          <tr><td><strong>Con đường dài hạn</strong></td><td>Phụ thuộc nghề đang làm, khả năng học thêm, chuyển vị trí và chính sách của doanh nghiệp.</td><td>Phát triển theo tay nghề, bậc thợ, kinh nghiệm tổ đội và yêu cầu sử dụng lao động của đơn vị.</td></tr>
        </tbody></table></div>
      </div>
    </section>

    <section class="verification-page__section verification-page__section--soft" id="tien-con-lai">
      <div class="container">
        <p class="verification-page__eyebrow">Bài toán 30 ngày</p>
        <h2>Đừng so lương quảng cáo — hãy so khoản tiền có thể gửi về nhà</h2>
        <div class="kcn-money-grid">
          <article><h3>Nếu chọn khu công nghiệp</h3><p class="kcn-formula">Tiền còn lại = lương thực nhận + phụ cấp + tăng ca − tiền trọ − tiền ăn − đi lại − chi phí phát sinh</p><ul><li>Nhà máy có bố trí chỗ ở hay không?</li><li>Thu nhập ghi trên tin tuyển dụng đã gồm tăng ca chưa?</li><li>Mỗi tháng thực tế có bao nhiêu ngày công?</li><li>Sau tất cả chi phí, bạn giữ lại được bao nhiêu?</li></ul></article>
          <article><h3>Nếu chọn học nghề mỏ</h3><p class="kcn-formula">Tiền tích lũy sau khi đi làm = thu nhập thực nhận − chi phí sinh hoạt cá nhân − chi phí đi lại về quê</p><ul><li>Bạn có đủ sức khỏe để theo nghề hầm lò không?</li><li>Bạn có chấp nhận học nghề và làm việc tại Quảng Ninh không?</li><li>Bạn có sẵn sàng làm việc theo ca, theo tổ đội và định mức không?</li><li>Mục tiêu tích lũy của bạn trong 1–3 năm là bao nhiêu?</li></ul></article>
        </div>
        <div class="verification-note kcn-note"><strong>Một mức lương thấp hơn nhưng gần nhà có thể phù hợp với người cần chăm sóc gia đình.</strong> Một nghề xa nhà nhưng có đào tạo, chỗ ăn ở ban đầu và thu nhập cao hơn có thể phù hợp với người đặt mục tiêu tích lũy. Hãy chọn theo hoàn cảnh thật, không chọn theo lời rủ rê.</div>
      </div>
    </section>

    <section class="verification-page__section">
      <div class="container">
        <p class="verification-page__eyebrow">Chọn theo mức độ phù hợp</p>
        <h2>Ai nên chọn KCN, ai nên cân nhắc nghề mỏ?</h2>
        <div class="kcn-choice-grid">
          <article><h3>Khu công nghiệp có thể phù hợp hơn khi…</h3><ul><li>Bạn cần ở gần bố mẹ, vợ con hoặc không thể đi làm xa.</li><li>Bạn đã có một nhà máy cụ thể, hợp đồng rõ ràng và biết chính xác khoản tiền còn lại sau chi phí.</li><li>Bạn không phù hợp với môi trường hầm lò hoặc không đáp ứng điều kiện sức khỏe nghề mỏ.</li><li>Bạn ưu tiên sự thuận tiện địa lý hơn mục tiêu tăng nhanh thu nhập.</li></ul></article>
          <article class="kcn-choice-primary"><h3>Nghề mỏ có thể phù hợp hơn khi…</h3><ul><li>Bạn là nam 18–40 tuổi, đạt điều kiện thể lực sơ bộ và sẵn sàng khám tuyển.</li><li>Bạn chấp nhận học nghề, làm việc tại Quảng Ninh và xa nhà trong từng giai đoạn.</li><li>Bạn muốn có một nghề rõ ràng thay vì chỉ làm một công đoạn ngắn hạn.</li><li>Bạn sẵn sàng tuân thủ kỷ luật ca kíp, an toàn, tổ đội và hoàn thành định mức lao động.</li><li>Bạn đặt mục tiêu thu nhập và tích lũy cao hơn trong những năm tới.</li></ul></article>
        </div>
      </div>
    </section>

    <section class="verification-page__section kcn-reality-section">
      <div class="container kcn-reality">
        <div><p class="verification-page__eyebrow">Nói thẳng trước khi đăng ký</p><h2>Nghề mỏ không dành cho người chỉ nhìn thấy mức 20–25 triệu đồng</h2></div>
        <div><p>Mức thu nhập đi cùng với môi trường hầm lò, yêu cầu thể lực, kỷ luật an toàn, làm việc theo ca và trách nhiệm trong tổ đội. Người lao động phải học nghề nghiêm túc, chấp hành quy trình và hoàn thành định mức lao động.</p><p>Bạn không nên đăng ký chỉ vì nghe người khác nói “lương cao”. Hãy dừng lại nếu không muốn làm xa nhà, ngại môi trường hầm lò, không sẵn sàng tuân thủ kỷ luật hoặc có vấn đề sức khỏe chưa được kiểm tra.</p><p><strong>Website chỉ giúp sàng lọc sơ bộ. Khám tuyển và quy trình tiếp nhận của nhà trường là căn cứ xác nhận cuối cùng.</strong></p></div>
      </div>
    </section>

    <section class="verification-page__section" id="lo-trinh">
      <div class="container">
        <p class="verification-page__eyebrow">Khi đã nghiêng về nghề mỏ</p>
        <h2>Từ lúc tìm hiểu đến khi đi làm gồm 6 bước rõ ràng</h2>
        <ol class="kcn-roadmap">
          <li><span>1</span><div><strong>Tự kiểm tra điều kiện</strong><p>Đối chiếu tuổi, chiều cao, cân nặng và sức khỏe trước khi chuẩn bị giấy tờ.</p></div></li>
          <li><span>2</span><div><strong>Gửi thông tin để được tư vấn</strong><p>Năm sinh, chiều cao/cân nặng, tình trạng sức khỏe và tỉnh đang sinh sống.</p></div></li>
          <li><span>3</span><div><strong>Chuẩn bị hồ sơ</strong><p>CCCD bản gốc, giấy khai sinh, bằng THCS hoặc THPT nếu có.</p></div></li>
          <li><span>4</span><div><strong>Đến nhập học đúng địa chỉ</strong><p>Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh.</p></div></li>
          <li><span>5</span><div><strong>Học nghề và rèn kỷ luật</strong><p>Học chuyên môn, an toàn, tác phong công nghiệp và kỹ năng làm việc theo tổ đội.</p></div></li>
          <li><span>6</span><div><strong>Hoàn thành đào tạo và đi làm</strong><p>Đủ điều kiện sau đào tạo sẽ được bố trí làm việc tại các đơn vị ngành Than ở Quảng Ninh.</p></div></li>
        </ol>
        <div class="verification-page__actions kcn-final-actions"><a href="/kiem-tra-dieu-kien/" data-verification-action="condition" data-context="kcn-roadmap">Kiểm tra điều kiện trong 30 giây</a><a href="/ho-so-nhap-hoc/">Xem hồ sơ và nơi nhập học</a><a href="tel:+84963048585" data-contact="phone" data-context="kcn-roadmap">Gọi Thầy Linh: 096 304 8585</a></div>
      </div>
    </section>

    <section class="verification-page__section verification-page__section--soft" id="cau-hoi-thuong-gap">
      <div class="container">
        <p class="verification-page__eyebrow">Câu hỏi thường gặp</p>
        <h2>Những điều cần rõ trước khi quyết định</h2>
        <div class="kcn-faq">
          <details><summary>Nghề mỏ có Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động. không?</summary><p>Có. Thông tin tuyển sinh đang áp dụng cam kết 20–25 triệu đồng/tháng.</p></details>
          <details><summary>Trong thời gian học có phải tự lo tiền ăn và chỗ ở không?</summary><p>Người học thuộc chỉ tiêu được miễn kinh phí đào tạo, ăn 3 bữa/ngày, ở ký túc xá và hỗ trợ 7,5 triệu đồng/tháng trong thời gian học.</p></details>
          <details><summary>Không có bằng THPT có đăng ký được không?</summary><p>Có thể đăng ký sơ bộ. Hồ sơ cần CCCD bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có; trường hợp chưa có bằng sẽ được hướng dẫn theo hệ đào tạo phù hợp.</p></details>
          <details><summary>Chỉ cần đủ chiều cao, cân nặng là chắc chắn được học?</summary><p>Không. Các chỉ số trên chỉ là điều kiện sàng lọc sơ bộ. Tình trạng sức khỏe và khám tuyển là căn cứ cuối cùng.</p></details>
          <details><summary>Học xong làm việc ở đâu?</summary><p>Người học đủ điều kiện sau đào tạo được bố trí làm việc tại các đơn vị ngành Than ở Quảng Ninh.</p></details>
        </div>
      </div>
    </section>

    <section class="verification-page__section kcn-conclusion">
      <div class="container kcn-conclusion-inner">
        <div><p class="verification-page__eyebrow">Kết luận</p><h2>Không có nghề tốt nhất cho tất cả — chỉ có lựa chọn phù hợp nhất với hoàn cảnh của bạn</h2><p>Chọn khu công nghiệp khi ưu tiên gần nhà và đã kiểm chứng được thu nhập thực nhận. Cân nhắc nghề mỏ khi đủ sức khỏe, chấp nhận kỷ luật và làm việc tại Quảng Ninh, đồng thời muốn học một nghề có lộ trình rõ ràng và mức thu nhập cam kết 20–25 triệu đồng/tháng.</p></div>
        <div class="kcn-conclusion-card"><strong>Chưa cần quyết định ngay.</strong><p>Hãy kiểm tra điều kiện trước, xem các câu chuyện công nhân cùng quê và hỏi đúng trường hợp của mình.</p><a href="/kiem-tra-dieu-kien/" data-verification-action="condition" data-context="kcn-conclusion">Kiểm tra điều kiện</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="kcn-conclusion">Nhắn Zalo cho Thầy Linh</a></div>
      </div>
    </section>`;

let html = fs.readFileSync(target, "utf8");
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(title)} | Thầy Linh</title>`);
html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttribute(description)}">`);
html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttribute(title)}">`);
html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttribute(description)}">`);

if (!html.includes('/kcn-comparison.css?v=1')) {
  const cssMarker = '  <link rel="stylesheet" href="/verification-portal.css?v=1">';
  if (!html.includes(cssMarker)) throw new Error("Missing verification CSS marker on comparison page");
  html = html.replace(cssMarker, `  <link rel="stylesheet" href="/kcn-comparison.css?v=1">\n${cssMarker}`);
}

if (!html.includes('"@type":"FAQPage"')) {
  html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n</head>`);
}

const mainStart = html.indexOf('    <section class="verification-page__hero');
const policyMarker = `    <section class="verification-page__section verification-page__section--soft">\n      <div class="container">\n        <div class="verification-policy">`;
const policyStart = html.indexOf(policyMarker, mainStart);
if (mainStart < 0 || policyStart < 0) throw new Error("Unable to locate comparison page body markers");
html = `${html.slice(0, mainStart)}${heroAndBody}\n${html.slice(policyStart)}`;

for (const marker of [
  reelUrl,
  "khu công nghiệp",
  "20–25 triệu đồng/tháng",
  "khám tuyển là căn cứ cuối cùng",
  "/kcn-comparison.css?v=1",
  "Bài toán 30 ngày",
]) {
  if (!html.toLowerCase().includes(marker.toLowerCase())) throw new Error(`Rewritten comparison page is missing: ${marker}`);
}

fs.writeFileSync(target, html);
console.log(JSON.stringify({ status: "rewritten", page: "/chon-kcn-hay-lam-mo/", reel: reelUrl }, null, 2));
