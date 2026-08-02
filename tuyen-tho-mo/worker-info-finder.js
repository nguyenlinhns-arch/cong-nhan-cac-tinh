(() => {
  "use strict";

  const track = (event, payload = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...payload });
  };

  document.querySelectorAll("[data-worker-search]").forEach((button) => {
    button.addEventListener("click", () => track("worker_search_open", { context: button.dataset.context || "home" }));
  });

  const provinceSelect = document.querySelector("[data-worker-province-select]");
  const provinceGo = document.querySelector("[data-worker-province-go]");
  const provinceBase = "/viec-lam-nganh-than/";

  function updateProvinceLink() {
    if (!provinceSelect || !provinceGo) return;
    const option = provinceSelect.selectedOptions[0];
    const slug = option?.dataset.provinceSlug || "";
    const name = option?.dataset.provinceName || option?.textContent?.trim() || "";
    if (!slug) {
      provinceGo.href = provinceBase;
      provinceGo.textContent = "Xem danh sách tỉnh";
      return;
    }
    const target = new URL(`${provinceBase}${slug}/`, location.origin);
    target.searchParams.set("utm_source", "website");
    target.searchParams.set("utm_medium", "internal");
    target.searchParams.set("utm_campaign", "worker_find_2026");
    target.searchParams.set("utm_content", `province_${slug}`);
    provinceGo.href = `${target.pathname}${target.search}`;
    provinceGo.textContent = `Xem ${name}`;
    track("worker_province_select", { province: slug });
  }

  provinceSelect?.addEventListener("change", updateProvinceLink);
  provinceGo?.addEventListener("click", () => {
    const slug = provinceSelect?.selectedOptions[0]?.dataset.provinceSlug || "all";
    track("worker_province_open", { province: slug });
  });
  updateProvinceLink();

  const checkForm = document.querySelector("[data-worker-check-form]");
  const checkResult = document.querySelector("[data-worker-check-result]");
  const checkNames = ["age_range", "height_range", "weight_range", "health_screen"];

  function resultLink(status) {
    if (status === "pass") {
      return "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&utm_medium=internal&utm_campaign=worker_self_check_2026&utm_content=pass#dang-ky";
    }
    return "https://zalo.me/0963048585";
  }

  checkForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkResult) return;
    const values = checkNames.map((name) => checkForm.querySelector(`input[name="${name}"]:checked`)?.value || "");
    const missingIndex = values.findIndex((value) => !value);

    checkResult.hidden = false;
    if (missingIndex >= 0) {
      checkResult.dataset.state = "incomplete";
      checkResult.innerHTML = "<strong>Bạn chưa chọn đủ 4 mục.</strong><span>Chọn một câu trả lời cho từng điều kiện rồi kiểm tra lại.</span>";
      checkForm.querySelector(`input[name="${checkNames[missingIndex]}"]`)?.focus();
      track("worker_self_check_incomplete", { missing: checkNames[missingIndex] });
      return;
    }

    const pass = values.every((value) => value === "yes");
    const status = pass ? "pass" : "review";
    checkResult.dataset.state = status;
    checkResult.innerHTML = pass
      ? `<strong>Bạn phù hợp sơ bộ với điều kiện đang tuyển.</strong><span>Tiếp tục đăng ký để được xác nhận thông tin và hướng dẫn lịch khám tuyển. Kết luận cuối cùng căn cứ kết quả khám tuyển.</span><a href="${resultLink(status)}" data-contact="application" data-context="worker-self-check">Tiếp tục đăng ký</a>`
      : `<strong>Có ít nhất một điều kiện bạn chưa đạt hoặc chưa chắc chắn.</strong><span>Đây chưa phải kết luận cuối cùng. Hãy trao đổi trực tiếp để được kiểm tra đúng trường hợp trước khi chuẩn bị hồ sơ.</span><a href="${resultLink(status)}" target="_blank" rel="noopener" data-contact="zalo" data-context="worker-self-check">Nhắn Zalo để hỏi</a>`;
    checkResult.focus({ preventScroll: true });
    checkResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
    track("worker_self_check_complete", { result: status });
  });
})();
