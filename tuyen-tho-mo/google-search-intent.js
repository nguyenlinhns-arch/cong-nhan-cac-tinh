(() => {
  "use strict";

  const JOB_PATH = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/";
  const params = new URLSearchParams(location.search);
  const hasGoogleClickId = Boolean(params.get("gclid") || params.get("gbraid") || params.get("wbraid"));
  const source = String(params.get("utm_source") || "").toLowerCase();
  const medium = String(params.get("utm_medium") || "").toLowerCase();
  const isPaidGoogle = hasGoogleClickId || (source === "google" && /^(cpc|paid|paid_search|search)$/i.test(medium));

  if (location.pathname !== JOB_PATH || !isPaidGoogle) return;

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const signal = normalize([
    params.get("utm_term"),
    params.get("utm_content"),
    params.get("utm_campaign"),
  ].filter(Boolean).join(" "));

  function detectIntent() {
    if (/(hoc nghe|mien phi|hoc phi|an o|ky tuc|7 5|dao tao|hoc tho lo|hoc tho mo)/.test(signal)) return "training";
    if (/(luong|thu nhap|20 25|25 trieu|bang luong|luong cao)/.test(signal)) return "income";
    return "job";
  }

  function detectSubIntent(intent) {
    if (intent === "training") {
      if (/(lien he ai|lien he|tu van ai|dang ky voi ai)/.test(signal)) return "contact";
      if (/(mien phi|mat tien|hoc phi|an o|ky tuc|ho tro|7 5)/.test(signal)) return "benefits";
      if (/(o dau|dia chi|quang ninh|nhap hoc o dau)/.test(signal)) return "location";
      if (/(bao lau|may thang|thoi gian hoc)/.test(signal)) return "duration";
      return "general";
    }
    if (intent === "income") {
      if (/(bao nhieu|luong tho lo|luong cong nhan mo)/.test(signal)) return "salary";
      return "general";
    }
    if (/(kinh nghiem|chua co nghe|chua tung lam)/.test(signal)) return "no_experience";
    return "general";
  }

  const intent = detectIntent();
  const subIntent = detectSubIntent(intent);
  const configs = {
    job: {
      eyebrow: "THÔNG TIN TUYỂN ĐANG ÁP DỤNG",
      title: "Anh đang tìm việc mỏ tại Quảng Ninh? Xem 5 thông tin này trước",
      lead: "Thầy Linh trực tiếp kiểm tra điều kiện và hướng dẫn hồ sơ.",
      primary: "Kiểm tra điều kiện",
      facts: [
        ["Điều kiện cơ bản", "Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg; sức khỏe phù hợp công việc hầm lò."],
        ["Thời gian học", "Khai thác và xây dựng mỏ: 2–3 tháng. Cơ điện mỏ: 10 tháng."],
        ["Trong thời gian học", "Miễn học phí theo chỉ tiêu, bố trí 3 bữa/ngày, ký túc xá và hỗ trợ 7,5 triệu đồng."],
        ["Sau đào tạo", "Làm việc tại các đơn vị ngành Than thuộc TKV ở Quảng Ninh."],
        ["Thu nhập", "Cam kết 20–25 triệu đồng/tháng khi hoàn thành định mức lao động."],
      ],
      proof: [
        ["/cau-chuyen-cong-nhan/", "Xem công nhân thật theo tỉnh"],
        ["/thu-nhap-an-o-ho-tro/", "Xem thu nhập và quyền lợi"],
        ["/thong-tin-tuyen-tho-mo/", "Đối chiếu thông tin tuyển hiện hành"],
      ],
    },
    training: {
      eyebrow: "HỌC NGHỀ MỎ · QUẢNG NINH",
      title: "Anh đang tìm học nghề mỏ miễn học phí? Xem 5 thông tin này trước",
      lead: "Người chưa có kinh nghiệm được đào tạo từ đầu; kiểm tra điều kiện trước, chưa cần chuẩn bị hồ sơ ngay.",
      primary: "Kiểm tra điều kiện học",
      facts: [
        ["Học phí", "Miễn học phí theo chỉ tiêu tuyển đang áp dụng."],
        ["Ăn và ở", "Bố trí 3 bữa/ngày và ký túc xá trong thời gian học."],
        ["Hỗ trợ sinh hoạt", "Hỗ trợ 7,5 triệu đồng trong thời gian học theo chính sách đợt tuyển."],
        ["Thời gian học", "Khai thác, xây dựng mỏ: 2–3 tháng. Cơ điện mỏ: 10 tháng."],
        ["Sau đào tạo", "Hoàn thành chương trình và đạt yêu cầu thì được bố trí việc tại các đơn vị ngành Than thuộc TKV ở Quảng Ninh."],
      ],
      proof: [
        ["/hoc-nghe-mo-tai-quang-ninh/", "Xem đầy đủ lộ trình học nghề"],
        ["/ho-so-nhap-hoc/", "Xem hồ sơ nhập học"],
        ["/thong-tin-tuyen-tho-mo/", "Đối chiếu chính sách đang áp dụng"],
      ],
    },
    income: {
      eyebrow: "VIỆC LÀM THỢ LÒ · THU NHẬP",
      title: "Anh đang tìm việc thợ lò 20–25 triệu? Xem điều kiện và bằng chứng trước",
      lead: "Website công khai thông tin thu nhập, quyền lợi và bảng lương để người lao động đối chiếu trước khi đăng ký.",
      primary: "Kiểm tra điều kiện & đăng ký",
      facts: [
        ["Thu nhập", "Cam kết 20–25 triệu đồng/tháng khi hoàn thành định mức lao động."],
        ["Bằng chứng", "Có kho bảng lương công khai theo từng doanh nghiệp để người lao động đối chiếu."],
        ["Chưa có nghề", "Được đào tạo từ đầu trước khi nhận việc nếu hoàn thành chương trình và đạt yêu cầu."],
        ["Trong thời gian học", "Miễn học phí theo chỉ tiêu, bố trí ăn ở và hỗ trợ 7,5 triệu đồng."],
        ["Điều kiện cơ bản", "Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg; kết quả cuối cùng căn cứ khám tuyển."],
      ],
      proof: [
        ["/bang-luong/", "Xem bảng lương các công ty"],
        ["/thu-nhap-an-o-ho-tro/", "Xem thu nhập và quyền lợi"],
        ["/thong-tin-tuyen-tho-mo/", "Đối chiếu thông tin tuyển hiện hành"],
      ],
    },
  };

  const variants = {
    "training:contact": {
      eyebrow: "HỌC THỢ LÒ · LIÊN HỆ TRỰC TIẾP",
      title: "Học thợ lò, thợ mỏ liên hệ ai?",
      lead: "Liên hệ Thầy Linh qua 096 304 8585 để kiểm tra điều kiện, chọn nghề và nhận lịch tiếp nhận trước khi đi Quảng Ninh.",
      primary: "Đăng ký để Thầy Linh tư vấn",
      proof: [["/hoc-tho-lo-lien-he-ai/", "Xem hướng dẫn liên hệ"], ["/kiem-tra-dieu-kien/", "Tự kiểm tra điều kiện"], ["/ho-so-nhap-hoc/", "Xem hồ sơ cần chuẩn bị"]],
    },
    "training:benefits": {
      eyebrow: "HỌC NGHỀ MỎ · HỌC PHÍ VÀ HỖ TRỢ",
      title: "Học thợ lò có miễn phí không?",
      lead: "Người học thuộc chỉ tiêu được miễn học phí, bố trí ăn ở và hỗ trợ 7,5 triệu đồng trong thời gian học theo chính sách đang áp dụng.",
      primary: "Kiểm tra điều kiện học miễn phí",
      proof: [["/hoc-tho-lo-co-mien-phi-khong/", "Xem giải thích học phí"], ["/thu-nhap-an-o-ho-tro/", "Xem ăn ở và hỗ trợ"], ["/thong-tin-tuyen-tho-mo/", "Đối chiếu chính sách hiện hành"]],
    },
    "training:location": {
      eyebrow: "HỌC THỢ LÒ · QUẢNG NINH",
      title: "Học thợ lò ở đâu tại Quảng Ninh?",
      lead: "Địa điểm làm thủ tục theo thông tin đang áp dụng là Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh; chỉ nên đến sau khi được xác nhận lịch.",
      primary: "Kiểm tra điều kiện trước khi đi",
      proof: [["/hoc-tho-lo-o-dau-quang-ninh/", "Xem địa điểm học"], ["/hoc-nghe-mo-tai-quang-ninh/", "Xem lộ trình học nghề"], ["/ho-so-nhap-hoc/", "Xem hồ sơ nhập học"]],
    },
    "training:duration": {
      eyebrow: "HỌC NGHỀ MỎ · THỜI GIAN ĐÀO TẠO",
      title: "Học thợ lò bao lâu thì đi làm?",
      lead: "Khai thác và xây dựng mỏ hầm lò học khoảng 2–3 tháng; cơ điện mỏ khoảng 10 tháng. Người học phải đạt yêu cầu trước khi được tiếp nhận làm việc.",
      primary: "Kiểm tra điều kiện học nghề",
      proof: [["/hoc-tho-lo-bao-lau/", "Xem thời gian học"], ["/hoc-nghe-mo-tai-quang-ninh/", "Xem từng nghề đào tạo"], ["/thong-tin-tuyen-tho-mo/", "Xem thông tin tuyển hiện hành"]],
    },
    "job:no_experience": {
      eyebrow: "VIỆC LÀM MỎ · KHÔNG CẦN KINH NGHIỆM SẴN CÓ",
      title: "Chưa từng làm mỏ có đăng ký được không?",
      lead: "Có thể đăng ký kiểm tra điều kiện. Người phù hợp được đào tạo nghề từ đầu trước khi đi làm; không yêu cầu kinh nghiệm làm mỏ sẵn có.",
      primary: "Kiểm tra điều kiện của anh",
      proof: [["/giai-dap-nghe-mo/di-lam-mo-than-co-can-kinh-nghiem-khong/", "Xem giải đáp kinh nghiệm"], ["/hoc-nghe-mo-tai-quang-ninh/", "Xem chương trình đào tạo"], ["/kiem-tra-dieu-kien/", "Tự kiểm tra điều kiện"]],
    },
    "income:salary": {
      eyebrow: "LƯƠNG THỢ LÒ · QUẢNG NINH",
      title: "Lương thợ lò bao nhiêu một tháng?",
      lead: "Chương trình đang áp dụng cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động; website có bảng lương để đối chiếu.",
      primary: "Kiểm tra điều kiện & đăng ký",
      proof: [["/luong-tho-lo-bao-nhieu/", "Xem giải thích mức lương"], ["/bang-luong/", "Xem bảng lương thực tế"], ["/thu-nhap-an-o-ho-tro/", "Xem quyền lợi đầy đủ"]],
    },
  };

  const baseConfig = configs[intent] || configs.job;
  const variant = variants[`${intent}:${subIntent}`] || {};
  const config = { ...baseConfig, ...variant };

  function track(name, payload = {}) {
    try {
      window.tlTrack?.(name, {
        page_path: location.pathname,
        landing_type: "google_paid_search",
        content: `paid_search_intent_${intent}_${subIntent}`,
        utm_term: String(params.get("utm_term") || "").slice(0, 100),
        ...payload,
      });
    } catch (_) {}
  }

  function init() {
    if (document.querySelector("[data-google-search-intent]")) return;
    document.documentElement.dataset.googlePaidSearch = "true";
    document.documentElement.dataset.googlePaidIntent = intent;
    document.documentElement.dataset.googlePaidSubIntent = subIntent;

    const hero = document.querySelector(".job-hero");
    if (!hero) return;

    const facts = config.facts.map((fact, index) => `
      <article role="listitem"><b>${String(index + 1).padStart(2, "0")}</b><strong>${fact[0]}</strong><span>${fact[1]}</span></article>`).join("");
    const proof = config.proof.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");

    const section = document.createElement("section");
    section.className = "google-search-intent";
    section.dataset.googleSearchIntent = intent;
    section.dataset.googleSearchSubIntent = subIntent;
    section.setAttribute("aria-labelledby", "google-search-intent-title");
    section.innerHTML = `
      <div class="google-search-intent__inner">
        <div class="google-search-intent__head">
          <p>${config.eyebrow}</p>
          <h2 id="google-search-intent-title">${config.title}</h2>
          <span>${config.lead}</span>
        </div>
        <div class="google-search-intent__facts" role="list">${facts}</div>
        <div class="google-search-intent__actions">
          <a class="is-primary" href="#dang-ky" data-contact="application" data-context="google-search-intent">${config.primary}</a>
          <a href="tel:+84963048585" data-contact="phone" data-context="google-search-intent">Gọi 096 304 8585</a>
          <a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer" data-contact="messenger" data-context="google-search-intent">Messenger</a>
          <a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="google-search-intent">Zalo</a>
        </div>
        <div class="google-search-intent__proof">${proof}</div>
      </div>`;

    hero.insertAdjacentElement("afterend", section);
    track("google_paid_search_fast_answer_view", { action: "view" });

    section.addEventListener("click", (event) => {
      const link = event.target.closest?.("a");
      if (!link) return;
      track("google_paid_search_fast_answer_click", {
        action: "click",
        destination: String(link.getAttribute("href") || "").slice(0, 120),
        contact_preference: String(link.dataset.contact || "information").slice(0, 40),
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
