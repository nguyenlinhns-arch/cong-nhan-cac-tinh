(() => {
  "use strict";

  const ZALO_URL = "https://zalo.me/0963048585";
  const PHONE_URL = "tel:+84963048585";
  const CONDITION_PATH = "/kiem-tra-dieu-kien/";
  const APPLICATION_PATH = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky";
  const CORE_PATHS = ["/kiem-tra-dieu-kien/", "/chon-kcn-hay-lam-mo/", "/hoc-nghe-mo-tai-quang-ninh/", "/cau-chuyen-cong-nhan/", "/viec-lam/"];
  const emitted = new Set();

  function track(name, payload = {}) {
    const safe = {
      conversion_version: "v4",
      page_path: location.pathname,
      lead_stage: "website",
      ...payload,
    };
    if (typeof window.tlTrack === "function") window.tlTrack(name, safe);
    else {
      window.tlTrackingQueue = window.tlTrackingQueue || [];
      window.tlTrackingQueue.push([name, safe]);
    }
  }

  function readAttribution() {
    const params = new URLSearchParams(location.search);
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem("thaylinh_attribution") || "{}"); } catch (_) {}
    return {
      utm_source: params.get("utm_source") || stored.utm_source || "",
      utm_medium: params.get("utm_medium") || stored.utm_medium || "",
      utm_campaign: params.get("utm_campaign") || stored.utm_campaign || "",
      utm_content: params.get("utm_content") || stored.utm_content || "",
    };
  }

  function withAttribution(href) {
    try {
      const url = new URL(href, location.origin);
      if (url.origin !== location.origin || url.protocol !== location.protocol) return href;
      const attribution = readAttribution();
      for (const [key, value] of Object.entries(attribution)) if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
      if (!url.searchParams.has("from_path")) url.searchParams.set("from_path", location.pathname.slice(0, 120));
      return `${url.pathname}${url.search}${url.hash}`;
    } catch (_) {
      return href;
    }
  }

  function conditionHref() {
    if (location.pathname === CONDITION_PATH) return "#dang-ky";
    if (location.pathname.startsWith("/viec-lam/")) return "#dang-ky";
    return withAttribution(CONDITION_PATH);
  }

  function updateInternalLinks() {
    document.querySelectorAll("a[href]").forEach(link => {
      const raw = link.getAttribute("href") || "";
      if (!raw.startsWith("/") || raw.startsWith("//")) return;
      if (!CORE_PATHS.some(path => raw.startsWith(path)) && !raw.includes("#dang-ky")) return;
      link.setAttribute("href", withAttribution(raw));
    });
  }

  function heroHost() {
    return document.querySelector(".verification-page__hero .container, .job-hero__copy, .local-hero__copy, .hero-copy, .article-hero, .article-header");
  }

  function ensureHeroConversion() {
    const host = heroHost();
    if (!host || host.querySelector(".v4-hero-actions")) return;
    const oldActions = host.querySelector(".verification-page__actions, .contact-pair, .button-row");
    if (oldActions) oldActions.hidden = true;

    if (!host.querySelector(".v4-fast-answer")) {
      const facts = document.createElement("div");
      facts.className = "v4-fast-answer";
      facts.innerHTML = [
        "Nam 18–40 tuổi, cao từ 1m53, nặng từ 47kg",
        "Học nghề theo chỉ tiêu, có ăn ở và hỗ trợ trong thời gian học",
        "Sau đào tạo làm việc tại các đơn vị ngành Than ở Quảng Ninh",
      ].map(item => `<span>${item}</span>`).join("");
      const lead = host.querySelector("p:last-of-type");
      if (lead) lead.insertAdjacentElement("afterend", facts);
      else host.append(facts);
    }

    const actions = document.createElement("div");
    actions.className = "v4-hero-actions";
    actions.innerHTML = `<a href="${conditionHref()}" data-v4-action="condition">Kiểm tra điều kiện</a><a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="v4-hero">Nhắn Zalo</a><a href="${PHONE_URL}" data-contact="phone" data-context="v4-hero">Gọi Thầy Linh</a>`;
    host.append(actions);

    if (!host.querySelector(".v4-direct-note")) {
      const note = document.createElement("p");
      note.className = "v4-direct-note";
      note.textContent = "Thầy Linh trực tiếp kiểm tra điều kiện và hướng dẫn hồ sơ.";
      host.append(note);
    }
  }

  function findLabel(field) {
    return field?.closest?.("label") || null;
  }

  function simplifyApplicationForm() {
    const form = document.querySelector("[data-application-form]");
    if (!form) return;
    form.dataset.v4Form = "true";

    const education = form.elements.namedItem("education");
    if (education) {
      education.value = [...education.options || []].some(option => option.value === "Trình độ khác") ? "Trình độ khác" : education.value;
      const label = findLabel(education);
      if (label) label.classList.add("v4-hidden-field");
    }
    const trade = form.elements.namedItem("trade");
    if (trade) {
      trade.value = [...trade.options || []].some(option => option.value === "Cần được tư vấn chọn nghề") ? "Cần được tư vấn chọn nghề" : trade.value;
      const label = findLabel(trade);
      if (label) label.classList.add("v4-hidden-field");
    }

    const health = form.elements.namedItem("health");
    const healthLabel = findLabel(health);
    if (healthLabel) {
      const firstText = [...healthLabel.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (firstText) firstText.textContent = "Sức khỏe hiện tại: mắt, huyết áp, tim mạch, bệnh khác ";
    }

    const draft = form.querySelector("[data-application-draft-status]");
    if (draft) draft.textContent = "Website chỉ lưu tạm trên thiết bị tỉnh/huyện, chiều cao và cân nặng; không lưu họ tên, số điện thoại, ngày sinh hoặc lựa chọn sức khỏe khi chưa gửi.";
    form.querySelector(".journey-form-progress")?.classList.add("v4-legacy-progress");

    if (!form.querySelector(".v4-form-promise")) {
      const promise = document.createElement("p");
      promise.className = "v4-form-promise";
      promise.textContent = "Chỉ cần thông tin để kiểm tra sơ bộ. Đăng ký ban đầu chưa cần gửi CCCD, ảnh hồ sơ hoặc thông tin bệnh chi tiết.";
      const grid = form.querySelector(".form-grid");
      if (grid) grid.before(promise);
      else form.prepend(promise);
    }

    const submit = form.querySelector("[data-application-submit]");
    if (submit) submit.textContent = "Gửi 3 thông tin để Thầy Linh kiểm tra";

    let started = false;
    let complete = false;
    const importantNames = ["birth_date", "height", "weight", "health"];
    const check = event => {
      if (!started && event?.type) {
        started = true;
        track("v4_form_start", { lead_stage: "form_started", landing_type: location.pathname === CONDITION_PATH ? "condition" : "job" });
      }
      const ready = importantNames.every(name => Boolean(String(form.elements.namedItem(name)?.value || "").trim()));
      if (ready && !complete) {
        complete = true;
        track("lead_3_info", { lead_stage: "three_info_complete", three_info_status: "complete" });
      }
    };
    form.addEventListener("input", check, { passive: true });
    form.addEventListener("change", check, { passive: true });
    check();

    const delivery = document.querySelector("[data-application-delivery]");
    const result = document.querySelector("[data-application-result]");
    if (delivery && result && typeof MutationObserver === "function") {
      const observer = new MutationObserver(() => {
        if (delivery.dataset.state !== "saved" || emitted.has("saved_application")) return;
        emitted.add("saved_application");
        const eligibility = result.dataset.eligibility || "unknown";
        track("form_submit", { lead_stage: "submitted", eligibility });
        if (eligibility === "eligible") track("qualified_lead", { lead_stage: "prequalified", eligibility: "eligible" });
        delivery.textContent = "Thầy Linh đã nhận thông tin. Anh giữ điện thoại/Zalo; bộ phận tư vấn sẽ kiểm tra điều kiện và hướng dẫn hồ sơ, nơi học, thời gian nhập học.";
      });
      observer.observe(delivery, { attributes: true, attributeFilter: ["data-state"], childList: true, subtree: true });
    }
  }

  function createMobileBar() {
    document.querySelectorAll(".verification-mobile-contact,.tl-mobile-contact,.mobile-contact,.v4-mobile-bar").forEach(node => node.remove());
    const bar = document.createElement("nav");
    bar.className = "v4-mobile-bar";
    bar.setAttribute("aria-label", "Hành động chính");
    bar.innerHTML = `<a href="${conditionHref()}" data-v4-action="condition">Kiểm tra</a><a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="v4-mobile">Zalo</a><a href="${PHONE_URL}" data-contact="phone" data-context="v4-mobile">Gọi</a>`;
    document.body.append(bar);
  }

  function markActiveNav() {
    document.querySelectorAll(".v4-primary-nav a").forEach(link => {
      try {
        if (new URL(link.href, location.origin).pathname === location.pathname) link.setAttribute("aria-current", "page");
      } catch (_) {}
    });
  }

  function observePrimaryActions() {
    document.addEventListener("click", event => {
      const link = event.target.closest?.("a");
      if (!link) return;
      const href = String(link.getAttribute("href") || "");
      let action = "";
      let preference = "";
      if (link.dataset.v4Action === "condition" || href.includes("kiem-tra-dieu-kien") || href === "#dang-ky") {
        action = "check_condition";
        preference = "form";
      } else if (href.includes("zalo.me") || link.dataset.contact === "zalo") {
        action = "send_message";
        preference = "zalo";
      } else if (href.startsWith("tel:") || link.dataset.contact === "phone") {
        action = "call";
        preference = "phone";
      }
      if (!action) return;
      track("v4_primary_action", { action, contact_preference: preference, lead_stage: "contact_intent" });
    }, { capture: true });
  }

  function init() {
    document.documentElement.dataset.conversionVersion = "v4";
    updateInternalLinks();
    ensureHeroConversion();
    simplifyApplicationForm();
    createMobileBar();
    markActiveNav();
    observePrimaryActions();
    track("v4_view", {
      landing_type: location.pathname === "/" ? "home" : location.pathname.startsWith("/viec-lam-nganh-than/") ? "province" : location.pathname.startsWith("/tin-nganh-than/") || location.pathname.startsWith("/bai-viet/") ? "content" : "core",
      lead_stage: "information_found",
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();