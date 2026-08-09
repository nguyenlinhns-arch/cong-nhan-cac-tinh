(() => {
  "use strict";

  const TARGET_PATH = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/";
  const PASS_KEYS = [
    "gclid", "gbraid", "wbraid",
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "campaignid", "adgroupid", "creative", "keyword", "matchtype", "device", "network"
  ];
  const params = new URLSearchParams(location.search);

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function detectIntent() {
    const signal = normalize([
      params.get("utm_term"),
      params.get("utm_content"),
      params.get("utm_campaign"),
      params.get("keyword")
    ].filter(Boolean).join(" "));
    if (/(hoc nghe|mien phi|hoc phi|an o|ky tuc|dao tao|hoc tho lo)/.test(signal)) return "training";
    if (/(luong|thu nhap|20 25|25 trieu|bang luong|luong cao)/.test(signal)) return "income";
    return "job";
  }

  function targetUrl() {
    const out = new URL(TARGET_PATH, location.origin);
    for (const key of PASS_KEYS) {
      const value = params.get(key);
      if (value) out.searchParams.set(key, value.slice(0, 300));
    }
    if (!out.searchParams.has("utm_source")) out.searchParams.set("utm_source", "google");
    if (!out.searchParams.has("utm_medium")) out.searchParams.set("utm_medium", "cpc");
    out.searchParams.set("utm_content", out.searchParams.get("utm_content") || `paid_bridge_${detectIntent()}`);
    out.hash = "dang-ky";
    return out.toString();
  }

  const intent = detectIntent();
  const copy = {
    job: {
      kicker: "TUYỂN THỢ MỎ QUẢNG NINH · KIỂM TRA ĐIỀU KIỆN TRƯỚC",
      title: "Tuyển thợ mỏ Quảng Ninh: học nghề từ đầu, bố trí việc làm",
      lead: "Dành cho lao động nam đang tìm việc mỏ, thợ lò tại Quảng Ninh. Xem nhanh điều kiện, quyền lợi rồi chuyển sang biểu mẫu chính thức để đăng ký."
    },
    training: {
      kicker: "HỌC NGHỀ MỎ QUẢNG NINH · NGƯỜI CHƯA CÓ NGHỀ",
      title: "Học nghề mỏ tại Quảng Ninh: miễn học phí theo chỉ tiêu, có ăn ở",
      lead: "Người chưa có kinh nghiệm được đào tạo từ đầu. Khai thác và xây dựng mỏ học khoảng 2–3 tháng; cơ điện mỏ học 10 tháng."
    },
    income: {
      kicker: "VIỆC LÀM THỢ LÒ · THU NHẬP VÀ BẰNG CHỨNG",
      title: "Việc làm thợ lò Quảng Ninh: thu nhập 20–25 triệu khi hoàn thành định mức",
      lead: "Xem điều kiện, quyền lợi và dữ liệu bảng lương trước khi chuyển sang biểu mẫu chính thức để kiểm tra khả năng đăng ký."
    }
  }[intent];

  document.documentElement.dataset.googleAdsBridgeIntent = intent;
  const kicker = document.querySelector("[data-ads-intent-kicker]");
  const title = document.querySelector("[data-ads-intent-title]");
  const lead = document.querySelector("[data-ads-intent-lead]");
  if (kicker) kicker.textContent = copy.kicker;
  if (title) title.textContent = copy.title;
  if (lead) lead.textContent = copy.lead;

  const destination = targetUrl();
  document.querySelectorAll("[data-ads-continue]").forEach((link) => {
    link.href = destination;
    link.addEventListener("click", () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "google_ads_bridge_click",
        paid_search_intent: intent,
        page_path: location.pathname,
        destination_path: TARGET_PATH
      });
    });
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "google_ads_bridge_view",
    paid_search_intent: intent,
    page_path: location.pathname,
    has_google_click_id: Boolean(params.get("gclid") || params.get("gbraid") || params.get("wbraid"))
  });
})();
