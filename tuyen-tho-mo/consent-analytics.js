(() => {
  "use strict";
  let banner = null;

  function close() {
    banner?.setAttribute("hidden", "");
  }

  function create() {
    if (banner?.isConnected) return banner;
    banner = document.querySelector("[data-consent-banner]") || document.createElement("section");
    banner.className = "tl-consent-banner";
    banner.dataset.consentBanner = "";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-labelledby", "tl-consent-title");
    banner.innerHTML = `<div class="tl-consent-banner__copy"><strong id="tl-consent-title">Đo lường ẩn danh</strong><span>Cho phép ghi nhận nguồn truy cập, thao tác và tốc độ thực tế để cải thiện website. Không gửi tên, số điện thoại hoặc thông tin sức khỏe. <a href="/quyen-rieng.html">Chi tiết</a>.</span></div><div class="tl-consent-banner__actions"><button type="button" data-consent-choice="denied">Chỉ cần thiết</button><button type="button" data-consent-choice="granted">Đồng ý đo lường</button></div>`;
    banner.querySelectorAll("[data-consent-choice]").forEach((button) => button.addEventListener("click", () => window.thayLinhAnalytics?.consent?.(button.dataset.consentChoice)));
    if (!banner.isConnected) document.body.append(banner);
    return banner;
  }

  function open() {
    const element = create();
    element.removeAttribute("hidden");
    return element;
  }

  window.ThayLinhConsent = Object.freeze({ open, close });
  if (window.thayLinhAnalytics?.consentState?.() === "pending") open();
})();
