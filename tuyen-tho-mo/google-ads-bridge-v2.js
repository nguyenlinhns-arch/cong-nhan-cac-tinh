(() => {
  "use strict";
  const TARGET_PATH = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/";
  const PASS_KEYS = ["gclid","gbraid","wbraid","utm_source","utm_medium","utm_campaign","utm_content","utm_term","campaignid","adgroupid","creative","keyword","matchtype","device","network"];
  const params = new URLSearchParams(location.search);
  const normalize = (value) => String(value || "").toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ").trim();
  const signal = normalize([params.get("utm_term"), params.get("utm_content"), params.get("utm_campaign"), params.get("keyword")].filter(Boolean).join(" "));
  const intent = /(hoc nghe|mien phi|hoc phi|an o|ky tuc|dao tao|hoc tho lo)/.test(signal) ? "training" : /(luong|thu nhap|20 25|25 trieu|bang luong|luong cao)/.test(signal) ? "income" : "job";
  const destination = new URL(TARGET_PATH, location.origin);
  for (const key of PASS_KEYS) { const value = params.get(key); if (value) destination.searchParams.set(key, value.slice(0, 300)); }
  if (!destination.searchParams.has("utm_source")) destination.searchParams.set("utm_source", "google");
  if (!destination.searchParams.has("utm_medium")) destination.searchParams.set("utm_medium", "cpc");
  if (!destination.searchParams.has("utm_content")) destination.searchParams.set("utm_content", `paid_bridge_${intent}`);
  destination.hash = "dang-ky";
  const copy = {
    job:["TUYỂN THỢ MỎ QUẢNG NINH · KIỂM TRA ĐIỀU KIỆN TRƯỚC","Tuyển thợ mỏ Quảng Ninh: học nghề từ đầu, bố trí việc làm","Dành cho lao động nam đang tìm việc mỏ, thợ lò tại Quảng Ninh. Xem nhanh điều kiện, quyền lợi rồi chuyển sang biểu mẫu chính thức để đăng ký."],
    training:["HỌC NGHỀ MỎ QUẢNG NINH · NGƯỜI CHƯA CÓ NGHỀ","Học nghề mỏ tại Quảng Ninh: miễn học phí theo chỉ tiêu, có ăn ở","Người chưa có kinh nghiệm được đào tạo từ đầu. Khai thác và xây dựng mỏ học khoảng 2–3 tháng; cơ điện mỏ học 10 tháng."],
    income:["VIỆC LÀM THỢ LÒ · THU NHẬP VÀ BẰNG CHỨNG","Việc làm thợ lò Quảng Ninh: thu nhập 20–25 triệu khi hoàn thành định mức","Xem điều kiện, quyền lợi và dữ liệu bảng lương trước khi chuyển sang biểu mẫu chính thức để kiểm tra khả năng đăng ký."]
  }[intent];
  document.documentElement.dataset.googleAdsBridgeIntent = intent;
  [["[data-ads-intent-kicker]",copy[0]],["[data-ads-intent-title]",copy[1]],["[data-ads-intent-lead]",copy[2]]].forEach(([selector,text])=>{const el=document.querySelector(selector);if(el)el.textContent=text;});
  document.querySelectorAll("[data-ads-continue]").forEach((link)=>{link.href=destination.toString();link.addEventListener("click",()=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:"google_ads_bridge_click",paid_search_intent:intent,page_path:location.pathname,destination_path:TARGET_PATH});});});
  window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:"google_ads_bridge_view",paid_search_intent:intent,page_path:location.pathname,has_google_click_id:Boolean(params.get("gclid")||params.get("gbraid")||params.get("wbraid"))});
})();
