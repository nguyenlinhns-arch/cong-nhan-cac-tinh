(() => {
  "use strict";

  const ZALO_URL = "https://zalo.me/0963048585";
  const PHONE_URL = "tel:+84963048585";
  const CONDITION_URL = "/kiem-tra-dieu-kien/";
  const requiredConditionFields = ["age_range", "height_range", "weight_range", "health_screen"];
  const metaQueue = [];
  const trackedForms = new WeakSet();
  let viewContentQueued = false;
  let formSubmitTracked = false;
  let flushTimer = 0;

  function pageGroup(pathname = location.pathname) {
    const path = String(pathname || "/");
    if (path === "/") return "home";
    if (path.startsWith("/viec-lam-nganh-than/")) return "province";
    if (path.startsWith("/viec-lam/")) return "job";
    if (path.startsWith("/tin-nganh-than/") || path.startsWith("/bai-viet/")) return "article";
    if (path.startsWith("/kiem-tra-dieu-kien/")) return "condition_check";
    if (path.startsWith("/chon-kcn-hay-lam-mo/")) return "career_comparison";
    if (path.startsWith("/cau-chuyen-cong-nhan/")) return "worker_stories";
    return "verification";
  }

  function pagePayload(extra = {}) {
    return {
      page_path: location.pathname,
      page_group: pageGroup(),
      content_name: document.title.slice(0, 140),
      ...extra,
    };
  }

  function queueGa4(name, payload = {}) {
    if (typeof window.tlTrack === "function") {
      window.tlTrack(name, payload);
      return;
    }
    window.tlTrackingQueue = window.tlTrackingQueue || [];
    window.tlTrackingQueue.push([name, payload]);
  }

  function consentState() {
    try {
      return window.thayLinhAnalytics?.consentState?.() || "pending";
    } catch (_) {
      return "pending";
    }
  }

  function safeMetaPayload(payload = {}) {
    const allowed = ["page_path", "page_group", "content_name", "channel", "context", "form_name", "result", "province", "trade"];
    return Object.fromEntries(allowed
      .filter(key => typeof payload[key] === "string" && payload[key].trim())
      .map(key => [key, payload[key].trim().slice(0, key === "content_name" ? 140 : 100)]));
  }

  function sendMeta(kind, name, payload) {
    const state = consentState();
    if (state === "denied") return true;
    if (state !== "granted" || typeof window.fbq !== "function") return false;
    window.fbq(kind, name, safeMetaPayload(payload));
    return true;
  }

  function flushMetaQueue() {
    if (consentState() === "denied") {
      metaQueue.length = 0;
      if (flushTimer) window.clearInterval(flushTimer);
      flushTimer = 0;
      return;
    }
    if (consentState() !== "granted" || typeof window.fbq !== "function") return;
    while (metaQueue.length) {
      const item = metaQueue.shift();
      sendMeta(item.kind, item.name, item.payload);
    }
    if (flushTimer) window.clearInterval(flushTimer);
    flushTimer = 0;
  }

  function queueMeta(kind, name, payload) {
    if (sendMeta(kind, name, payload)) return;
    if (consentState() === "pending" && metaQueue.length < 40) metaQueue.push({ kind, name, payload });
    if (!flushTimer && metaQueue.length) {
      let attempts = 0;
      flushTimer = window.setInterval(() => {
        attempts += 1;
        flushMetaQueue();
        if (attempts >= 60 && flushTimer) {
          window.clearInterval(flushTimer);
          flushTimer = 0;
          metaQueue.length = 0;
        }
      }, 1000);
    }
  }

  function trackExact(name, payload = {}, meta = null) {
    const normalized = pagePayload(payload);
    queueGa4(name, normalized);
    if (meta) queueMeta(meta.kind, meta.name, normalized);
  }

  function trackViewContent() {
    if (viewContentQueued) return;
    viewContentQueued = true;
    const payload = pagePayload({ content_type: pageGroup() });
    queueGa4("ViewContent", payload);
    queueMeta("track", "ViewContent", payload);
  }

  function contactChannel(link) {
    const declared = String(link?.dataset?.contact || "").toLowerCase();
    if (["zalo", "phone", "messenger"].includes(declared)) return declared;
    const href = String(link?.getAttribute?.("href") || "").toLowerCase();
    if (href.includes("zalo.me")) return "zalo";
    if (href.startsWith("tel:")) return "phone";
    if (href.includes("m.me/") || href.includes("messenger.com")) return "messenger";
    return "";
  }

  function eventNameForChannel(channel) {
    return { zalo: "click_zalo", phone: "click_call", messenger: "click_messenger" }[channel] || "";
  }

  function conditionHref() {
    if (location.pathname === "/") return "/#tu-kiem-tra";
    if (location.pathname.startsWith(CONDITION_URL)) return "#kiem-tra";
    return CONDITION_URL;
  }

  function contactMarkup() {
    return `
      <a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="mobile-fixed-verification" aria-label="Nhắn Zalo cho Thầy Linh"><strong>Zalo</strong><span>Nhắn tư vấn</span></a>
      <a href="${PHONE_URL}" data-contact="phone" data-context="mobile-fixed-verification" aria-label="Gọi Thầy Linh theo số 096 304 8585"><strong>Gọi điện</strong><span>096 304 8585</span></a>
      <a href="${conditionHref()}" data-verification-action="condition" data-context="mobile-fixed-verification" aria-label="Kiểm tra điều kiện học nghề mỏ"><strong>Kiểm tra</strong><span>Điều kiện</span></a>`;
  }

  function normalizeMobileContact() {
    const bars = [...document.querySelectorAll("nav.mobile-contact, .tl-mobile-contact, [data-verification-mobile-contact]")];
    let primary = bars.find(item => item.dataset.verificationMobileContact !== undefined) || bars[0];
    if (!primary) {
      primary = document.createElement("nav");
      primary.dataset.verificationMobileContact = "";
      document.body.append(primary);
    }
    primary.classList.add("verification-mobile-contact");
    primary.dataset.verificationMobileContact = "";
    primary.setAttribute("aria-label", "Liên hệ và kiểm tra điều kiện");
    if (primary.dataset.verificationMarkup !== conditionHref()) {
      primary.innerHTML = contactMarkup();
      primary.dataset.verificationMarkup = conditionHref();
    }
    bars.forEach(item => {
      if (item !== primary) item.remove();
    });
  }

  function selectedConditionValues(form) {
    return Object.fromEntries(requiredConditionFields.map(name => [name, form.querySelector(`input[name="${name}"]:checked`)?.value || ""]));
  }

  function isConditionPass(values) {
    return requiredConditionFields.every(name => values[name] === "yes");
  }

  function trackConditionPass(form, context) {
    if (form.dataset.conditionPassTracked === "true") return;
    form.dataset.conditionPassTracked = "true";
    trackExact("condition_pass", { context, result: "pass" }, { kind: "trackCustom", name: "condition_pass" });
  }

  function renderConditionResult(form) {
    const result = form.querySelector("[data-verification-condition-result]");
    if (!result) return;
    const values = selectedConditionValues(form);
    const missing = requiredConditionFields.some(name => !values[name]);
    result.hidden = false;
    if (missing) {
      result.dataset.result = "review";
      result.innerHTML = "<h3>Hãy trả lời đủ 4 câu hỏi</h3><p>Mỗi câu chỉ dùng để định hướng sơ bộ và không được lưu lại.</p>";
      result.focus({ preventScroll: true });
      return;
    }
    if (isConditionPass(values)) {
      result.dataset.result = "pass";
      result.innerHTML = `<h3>Bạn phù hợp với điều kiện sơ bộ</h3><p>Đây chưa phải kết luận khám tuyển. Bước tiếp theo là gửi thông tin cơ bản để Thầy Linh đối chiếu và hướng dẫn lịch tiếp nhận.</p><div class="verification-page__actions"><a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="condition-result">Gửi thông tin qua Zalo</a><a href="${PHONE_URL}" data-contact="phone" data-context="condition-result">Gọi 096 304 8585</a></div>`;
      trackConditionPass(form, "standalone_condition_check");
    } else {
      result.dataset.result = "review";
      result.innerHTML = `<h3>Cần trao đổi thêm trước khi chuẩn bị hồ sơ</h3><p>Chưa nên tự kết luận là không đủ điều kiện. Hãy gọi hoặc nhắn Zalo để được kiểm tra đúng trường hợp; không gửi bệnh án hay giấy tờ sức khỏe qua biểu mẫu website.</p><div class="verification-page__actions"><a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="condition-review">Hỏi qua Zalo</a><a href="${PHONE_URL}" data-contact="phone" data-context="condition-review">Gọi tư vấn</a></div>`;
    }
    result.focus({ preventScroll: true });
  }

  function handleExistingDataLayerItem(item) {
    if (!item || Object.prototype.toString.call(item) !== "[object Object]") return;
    if (item.event === "ApplicationSubmit" && !formSubmitTracked) {
      formSubmitTracked = true;
      trackExact("form_submit", {
        context: item.context || "application_form",
        form_name: item.form_name || "recruitment_application",
        province: item.province,
        trade: item.trade,
      }, { kind: "trackCustom", name: "form_submit" });
    }
  }

  function observeDataLayer() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.slice().forEach(handleExistingDataLayerItem);
    const previousPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function (...items) {
      const result = previousPush(...items);
      items.forEach(item => {
        if (item?.event !== "form_submit") handleExistingDataLayerItem(item);
      });
      return result;
    };
  }

  document.addEventListener("click", event => {
    const link = event.target.closest?.("a");
    if (link) {
      const channel = contactChannel(link);
      const eventName = eventNameForChannel(channel);
      if (eventName) {
        trackExact(eventName, {
          channel,
          context: link.dataset.context || "site_link",
        }, { kind: "trackCustom", name: eventName });
      }
    }
    if (event.target.closest?.("[data-consent-choice]")) window.setTimeout(flushMetaQueue, 50);
  }, { capture: true });

  document.addEventListener("submit", event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.matches("[data-verification-condition-form]")) {
      event.preventDefault();
      renderConditionResult(form);
      return;
    }
    if (form.matches("[data-worker-check-form]")) {
      const values = selectedConditionValues(form);
      if (isConditionPass(values)) trackConditionPass(form, "home_condition_check");
      return;
    }
    if ((form.matches("[data-application-form]") || form.closest("[data-application-form]")) && form.checkValidity() && !trackedForms.has(form) && !formSubmitTracked) {
      trackedForms.add(form);
      formSubmitTracked = true;
      trackExact("form_submit", {
        context: form.dataset.context || "application_form",
        form_name: form.getAttribute("name") || form.id || "recruitment_application",
      }, { kind: "trackCustom", name: "form_submit" });
    }
  }, { capture: true });

  function init() {
    observeDataLayer();
    normalizeMobileContact();
    trackViewContent();
    document.querySelectorAll("[data-verification-condition-form]").forEach(form => {
      form.querySelector("[data-verification-condition-result]")?.setAttribute("tabindex", "-1");
    });
    const observer = new MutationObserver(() => normalizeMobileContact());
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 12000);
    ["pointerdown", "keydown", "touchstart", "visibilitychange"].forEach(name => {
      window.addEventListener(name, flushMetaQueue, { passive: true });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
