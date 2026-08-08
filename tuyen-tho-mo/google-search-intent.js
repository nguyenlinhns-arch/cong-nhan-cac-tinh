(() => {
  "use strict";

  const JOB_PATH = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/";
  const params = new URLSearchParams(location.search);
  const hasGoogleClickId = Boolean(params.get("gclid") || params.get("gbraid") || params.get("wbraid"));
  const source = String(params.get("utm_source") || "").toLowerCase();
  const medium = String(params.get("utm_medium") || "").toLowerCase();
  const isPaidGoogle = hasGoogleClickId || (source === "google" && /^(cpc|paid|paid_search|search)$/i.test(medium));

  if (location.pathname !== JOB_PATH || !isPaidGoogle) return;

  function track(name, payload = {}) {
    try { window.tlTrack?.(name, { page_path: location.pathname, landing_type: "google_paid_search", ...payload }); } catch (_) {}
  }

  function init() {
    if (document.querySelector("[data-google-search-intent]")) return;
    document.documentElement.dataset.googlePaidSearch = "true";

    const hero = document.querySelector(".job-hero");
    if (!hero) return;

    const section = document.createElement("section");
    section.className = "google-search-intent";
    section.dataset.googleSearchIntent = "";
    section.setAttribute("aria-labelledby", "google-search-intent-title");
    section.innerHTML = `
      <div class="google-search-intent__inner">
        <div class="google-search-intent__head">
          <p>THÔNG TIN TUYỂN ĐANG ÁP DỤNG</p>
          <h2 id="google-search-intent-title">Anh đang tìm việc mỏ tại Quảng Ninh? Xem 5 thông tin này trước</h2>
          <span>Thầy Linh trực tiếp kiểm tra điều kiện và hướng dẫn hồ sơ.</span>
        </div>
        <div class="google-search-intent__facts" role="list">
          <article role="listitem"><b>01</b><strong>Điều kiện cơ bản</strong><span>Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg; sức khỏe phù hợp công việc hầm lò.</span></article>
          <article role="listitem"><b>02</b><strong>Thời gian học</strong><span>Khai thác và xây dựng mỏ: 2–3 tháng. Cơ điện mỏ: 10 tháng.</span></article>
          <article role="listitem"><b>03</b><strong>Trong thời gian học</strong><span>Miễn học phí theo chỉ tiêu, bố trí 3 bữa/ngày, ký túc xá và hỗ trợ 7,5 triệu đồng.</span></article>
          <article role="listitem"><b>04</b><strong>Sau đào tạo</strong><span>Làm việc tại các đơn vị ngành Than thuộc TKV ở Quảng Ninh.</span></article>
          <article role="listitem"><b>05</b><strong>Thu nhập</strong><span>Cam kết 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</span></article>
        </div>
        <div class="google-search-intent__actions">
          <a class="is-primary" href="#dang-ky" data-contact="application" data-context="google-search-intent">Kiểm tra điều kiện</a>
          <a href="tel:+84963048585" data-contact="phone" data-context="google-search-intent">Gọi 096 304 8585</a>
          <a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener noreferrer" data-contact="messenger" data-context="google-search-intent">Messenger</a>
          <a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="google-search-intent">Zalo</a>
        </div>
        <div class="google-search-intent__proof">
          <a href="/cau-chuyen-cong-nhan/">Xem công nhân thật theo tỉnh</a>
          <a href="/thu-nhap-an-o-ho-tro/">Xem thu nhập và quyền lợi</a>
          <a href="/thong-tin-tuyen-tho-mo/">Đối chiếu thông tin tuyển hiện hành</a>
        </div>
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
