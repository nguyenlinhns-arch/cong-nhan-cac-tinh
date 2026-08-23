(() => {
  "use strict";

  const mobile = window.ThayLinhMobile;
  if (!mobile) return;
  const facts = [
    ["conditions", "Điều kiện", "Nam 18–40 tuổi", "Cao từ 1m53, nặng từ 47kg; sức khỏe tốt, không cận thị, bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng công việc.", "/#dieu-kien"],
    ["training", "Thời gian học", "Nghề chính học 2–3 tháng", "Khai thác mỏ và xây dựng mỏ học khoảng 2–3 tháng; cơ điện mỏ học 10 tháng.", "/#thoi-gian-hoc"],
    ["support", "Hỗ trợ khi học", "Miễn kinh phí đào tạo, có ăn ở", "Ăn 3 bữa/ngày, ở ký túc xá và được hỗ trợ 7,5 triệu đồng/tháng trong thời gian học.", "/#ho-tro-hoc-nghe"],
    ["work", "Việc làm và thu nhập", "Làm việc tại Quảng Ninh", "Được bố trí việc làm sau đào tạo; Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất.", "/#noi-lam-viec"],
    ["dossier", "Hồ sơ", "Chuẩn bị 3 nhóm giấy tờ", "Căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có; chưa có bằng vẫn đăng ký được.", "/#ho-so"],
    ["address", "Nơi nhập học", "Khu C – Quang Hanh, Quảng Ninh", "Phân hiệu Đào tạo Cẩm Phả; chỉ đến sau khi được xác nhận lịch tiếp nhận.", "/#dia-diem"],
  ];
  let dialog = null;
  let lastFocus = null;

  function createDialog() {
    const element = document.createElement("dialog");
    element.className = "tl-search-dialog tl-worker-brief-dialog";
    element.dataset.workerBrief = "30-second-summary";
    element.setAttribute("aria-labelledby", "tl-worker-brief-title");
    const cards = facts.map(([key, type, title, description, href]) => `<a class="tl-search-result" href="${href}" data-worker-brief-action="${key}"><small>${type}</small><strong>${title}</strong><span>${description}</span></a>`).join("");
    element.innerHTML = `<div class="tl-search-dialog__header"><div><span class="tl-search-dialog__eyebrow">Thông tin đang áp dụng</span><h2 id="tl-worker-brief-title">Tuyển thợ mỏ trong 30 giây</h2></div><button class="tl-search-dialog__close" type="button" aria-label="Đóng tóm tắt">×</button></div><p class="tl-search-status">6 thông tin quan trọng — không cần đọc hết bài hiện tại.</p><div class="tl-voice-entry"><button type="button" data-load-voice="brief">🔊 Nghe tóm tắt</button><span>Chỉ tải chức năng giọng nói khi bạn bấm.</span></div><div class="tl-search-results" tabindex="-1"><div class="tl-search-results__grid">${cards}</div><div class="tl-search-empty"><strong>Bước tiếp theo</strong><span>Kiểm tra trước, đăng ký khi phù hợp hoặc hỏi trực tiếp trường hợp của bạn.</span><div class="tl-search-empty__actions"><a href="/#tu-kiem-tra" data-worker-brief-action="self_check">Kiểm tra điều kiện</a><a href="${mobile.trackedApplicationUrl("brief_to_application_2026", `brief_${mobile.pageGroup()}`)}" data-contact="application" data-context="worker-brief" data-worker-brief-action="application">Đăng ký tư vấn</a><a href="${mobile.ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="worker-brief" data-worker-brief-action="zalo">Hỏi qua Zalo</a><a href="${mobile.PHONE_URL}" data-contact="phone" data-context="worker-brief" data-worker-brief-action="phone">Gọi tư vấn</a></div></div></div>`;
    document.body.append(element);
    element.querySelector(".tl-search-dialog__close").addEventListener("click", close);
    element.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
    element.addEventListener("click", (event) => {
      const voice = event.target.closest?.('[data-load-voice="brief"]');
      if (voice) void mobile.activateVoice(element, "brief");
      const action = event.target.closest?.("[data-worker-brief-action]");
      if (action) mobile.trackUi("worker_brief_click", { destination: action.dataset.workerBriefAction || "unknown", page_group: mobile.pageGroup() });
      const rect = element.getBoundingClientRect();
      if (event.target === element && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
    });
    return element;
  }

  function close() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    document.documentElement.classList.remove("tl-search-open");
    if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true });
  }

  function open(trigger) {
    dialog ||= createDialog();
    lastFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    document.querySelectorAll("dialog.tl-search-dialog[open]").forEach((other) => {
      if (other !== dialog && typeof other.close === "function") other.close();
    });
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.documentElement.classList.add("tl-search-open");
    mobile.trackUi("worker_brief_open", { page_group: mobile.pageGroup() });
    requestAnimationFrame(() => dialog.querySelector(".tl-search-dialog__close")?.focus({ preventScroll: true }));
  }

  window.ThayLinhWorkerBrief = Object.freeze({ open, facts });
})();
