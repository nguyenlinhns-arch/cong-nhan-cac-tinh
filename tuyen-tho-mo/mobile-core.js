(() => {
  "use strict";

  const ROOT = "https://thaylinhtuyenthomo.vn";
  const APPLICATION_URL = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky";
  const ZALO_URL = "https://zalo.me/0963048585";
  const MESSENGER_URL = "https://m.me/thaylinhtuyenthomo";
  const PHONE_URL = "tel:+84963048585";
  const DRAFT_KEY = "thaylinh_application_draft_v1";
  const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
  const SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
  const WORKER_SHORTCUTS = [
    { key: "conditions", label: "Điều kiện", question: "Tôi có đủ điều kiện?", href: "/#dieu-kien" },
    { key: "benefits", label: "Quyền lợi", question: "Được hỗ trợ những gì?", href: "/#quyen-loi" },
    { key: "dossier", label: "Hồ sơ", question: "Hồ sơ gồm giấy tờ gì?", href: "/#ho-so" },
    { key: "address", label: "Nơi học", question: "Học và nhập học ở đâu?", href: "/#dia-diem" },
    { key: "province", label: "Theo tỉnh", question: "Xem thông tin tỉnh tôi", href: "/viec-lam-nganh-than/" },
  ];
  const ATTRIBUTION_KEYS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "gclid", "gbraid", "wbraid", "gad_source", "gad_campaignid",
    "tl_campaign", "tl_adgroup", "tl_creative", "tl_matchtype", "tl_device", "tl_network", "tl_intent",
  ];
  const featurePromises = new Map();

  function pageGroup() {
    const segment = location.pathname.split("/").filter(Boolean)[0] || "home";
    if (["bai-viet", "tin-nganh-than"].includes(segment)) return "article";
    if (segment === "viec-lam-nganh-than") return "province";
    if (segment === "viec-lam") return "job";
    return segment.replace(/[^a-z0-9-]/gi, "").slice(0, 32) || "other";
  }

  function trackUi(event, payload = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...payload });
  }

  function storedAttribution() {
    try { return JSON.parse(localStorage.getItem("thaylinh_attribution") || "{}"); } catch (_) { return {}; }
  }

  function readAttribution() {
    const stored = storedAttribution();
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(ATTRIBUTION_KEYS
      .map((key) => [key, params.get(key) || stored[key]])
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => [key, value.trim().slice(0, 500)]));
  }

  function applicationContext() {
    const values = {};
    const read = (href) => {
      try {
        const url = new URL(href, location.href);
        for (const key of ["province", "trade"]) values[key] ||= url.searchParams.get(key)?.slice(0, 80);
      } catch (_) {}
    };
    read(location.href);
    const path = new URL(APPLICATION_URL, ROOT).pathname;
    document.querySelectorAll?.(`a[href*="${path}"]`)?.forEach((link) => read(link.href));
    return values;
  }

  function trackedApplicationUrl(campaign, content) {
    const url = new URL(APPLICATION_URL, ROOT);
    for (const [key, value] of Object.entries(applicationContext())) if (value) url.searchParams.set(key, value);
    const attribution = readAttribution();
    const externalFirstTouch = attribution.utm_source && attribution.utm_source !== "website";
    if (externalFirstTouch) {
      for (const [key, value] of Object.entries(attribution)) url.searchParams.set(key, value);
      url.searchParams.set("tl_internal_campaign", campaign);
      url.searchParams.set("tl_internal_content", content);
    } else {
      url.searchParams.set("utm_source", "website");
      url.searchParams.set("utm_medium", "internal");
      url.searchParams.set("utm_campaign", campaign);
      url.searchParams.set("utm_content", content);
    }
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function preserveFirstTouchOnApplicationLinks() {
    const attribution = readAttribution();
    if (!attribution.utm_source || attribution.utm_source === "website") return;
    document.querySelectorAll('a[data-contact="application"],a[href*="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/"]').forEach((link) => {
      try {
        const url = new URL(link.href, location.href);
        if (url.origin !== ROOT) return;
        const internalCampaign = url.searchParams.get("utm_campaign") || link.dataset.context || "site_link";
        const internalContent = url.searchParams.get("utm_content") || link.dataset.context || "site_link";
        for (const [key, value] of Object.entries(attribution)) url.searchParams.set(key, value);
        url.searchParams.set("tl_internal_campaign", internalCampaign.slice(0, 100));
        url.searchParams.set("tl_internal_content", internalContent.slice(0, 100));
        link.href = `${url.pathname}${url.search}${url.hash}`;
      } catch (_) {}
    });
  }

  function safeUrl(value) {
    try {
      const url = new URL(value, ROOT);
      return url.origin === ROOT ? `${url.pathname}${url.search}${url.hash}` : "/tin-nganh-than/";
    } catch (_) {
      return "/tin-nganh-than/";
    }
  }

  function loadStyle(href, feature) {
    if (document.querySelector(`link[data-tl-feature-style="${feature}"]`)) return Promise.resolve();
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.tlFeatureStyle = feature;
      link.onload = link.onerror = () => resolve();
      document.head.append(link);
    });
  }

  function loadScript(src, feature) {
    if (document.querySelector(`script[data-tl-feature-script="${feature}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.tlFeatureScript = feature;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  function loadFeature(name) {
    if (featurePromises.has(name)) return featurePromises.get(name);
    const specs = {
      search: ["/search-dialog.css?v=1", "/site-search.js?v=1"],
      brief: ["/search-dialog.css?v=1", "/worker-brief.js?v=1"],
      voice: ["/voice-dialog.css?v=1", "/voice-assist.js?v=3"],
    };
    const [style, script] = specs[name] || [];
    if (!style || !script) return Promise.reject(new Error("Unknown feature"));
    const promise = Promise.all([loadStyle(style, name === "brief" ? "search" : name), loadScript(script, name)])
      .catch(() => null);
    featurePromises.set(name, promise);
    return promise;
  }

  async function activateVoice(dialog, mode) {
    await loadFeature("voice");
    window.ThayLinhVoiceAssist?.activate?.(dialog, mode);
  }

  function createWorkerCompass() {
    const pathname = location.pathname.replace(/\/index\.html$/i, "/");
    if (pathname === "/" || document.querySelector(".tl-worker-compass")) return;
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    if (!main) return;
    const group = pageGroup();
    const nav = document.createElement("nav");
    nav.className = "tl-worker-compass";
    nav.setAttribute("aria-label", "Tìm nhanh thông tin tuyển thợ mỏ");
    nav.innerHTML = `<div class="tl-worker-compass__inner"><strong>Cần xem:</strong><div><button type="button" data-open-worker-brief data-worker-shortcut="brief" aria-haspopup="dialog">Xem nhanh 30 giây</button>${WORKER_SHORTCUTS.map(({ key, label, href }) => `<a href="${href}" data-worker-shortcut="${key}">${label}</a>`).join("")}<button type="button" data-open-site-search data-worker-shortcut="search" aria-haspopup="dialog">${SEARCH_ICON}<span>Tìm kiếm</span></button><a class="tl-worker-compass__apply" href="${trackedApplicationUrl("worker_compass_2026", `compass_${group}`)}" data-contact="application" data-context="worker-compass" data-worker-shortcut="application">Kiểm tra</a></div></div>`;
    nav.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-worker-shortcut]");
      if (target) trackUi("worker_compass_click", { destination: target.dataset.workerShortcut || "unknown", page_group: group });
    });
    if (header?.insertAdjacentElement) header.insertAdjacentElement("afterend", nav);
    else main.parentNode?.insertBefore(nav, main);
  }

  function insertSearchButton() {
    const header = document.querySelector(".site-header .header-inner") || document.querySelector(".site-header");
    if (!header || header.querySelector(".tl-site-search-button, [data-open-site-search]")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tl-site-search-button";
    button.dataset.openSiteSearch = "";
    button.setAttribute("aria-label", "Tìm nội dung ngành mỏ");
    button.setAttribute("aria-haspopup", "dialog");
    button.innerHTML = `${SEARCH_ICON}<span class="tl-visually-hidden">Tìm nội dung ngành mỏ</span>`;
    const anchor = header.querySelector("[data-menu-button], .menu-toggle, .back-link, .header-cta");
    header.insertBefore(button, anchor || null);
  }

  function hasActiveApplicationDraft() {
    try {
      const stored = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      const savedAt = Date.parse(stored?.saved_at || "");
      const active = Boolean(stored?.values && typeof stored.values === "object")
        && Number.isFinite(savedAt) && Date.now() - savedAt <= DRAFT_TTL_MS && savedAt <= Date.now() + 60_000;
      if (!active) localStorage.removeItem(DRAFT_KEY);
      return active;
    } catch (_) {
      try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
      return false;
    }
  }

  function updateApplicationResumeLabels() {
    if (!hasActiveApplicationDraft()) return;
    document.querySelectorAll("[data-application-resume-label]").forEach((label) => {
      label.textContent = "Tiếp tục hồ sơ";
      if (label.matches("a,button")) label.setAttribute("aria-label", "Tiếp tục hồ sơ ứng tuyển đã lưu");
    });
  }

  function createContactButtons() {
    if (document.querySelector(".tl-mobile-contact")) return;
    const nav = document.createElement("nav");
    nav.className = "tl-mobile-contact";
    nav.setAttribute("aria-label", "Liên hệ nhanh qua Zalo, Messenger hoặc điện thoại");
    nav.innerHTML = `<a class="tl-mobile-contact__zalo" href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho Thầy Linh" data-contact="zalo" data-context="mobile-floating"><b aria-hidden="true">Z</b><span>Zalo</span></a><a class="tl-mobile-contact__messenger" href="${MESSENGER_URL}" target="_blank" rel="noopener noreferrer" aria-label="Nhắn Messenger cho Thầy Linh" data-contact="messenger" data-context="mobile-floating"><b aria-hidden="true">M</b><span>Mess</span></a><a class="tl-mobile-contact__call" href="${PHONE_URL}" aria-label="Gọi Thầy Linh theo số 096 304 8585" data-contact="phone" data-context="mobile-floating"><b aria-hidden="true">☎</b><span>Gọi</span></a>`;
    document.body.append(nav);
  }

  async function openFeature(name, trigger) {
    await loadFeature(name);
    const api = name === "search" ? window.ThayLinhSiteSearch : window.ThayLinhWorkerBrief;
    api?.open?.(trigger);
  }

  document.addEventListener("click", (event) => {
    const search = event.target.closest?.("[data-open-site-search]");
    const brief = event.target.closest?.("[data-open-worker-brief]");
    if (!search && !brief) return;
    event.preventDefault();
    void openFeature(search ? "search" : "brief", search || brief);
  });

  window.ThayLinhMobile = Object.freeze({
    ROOT, APPLICATION_URL, ZALO_URL, MESSENGER_URL, PHONE_URL, SEARCH_ICON, WORKER_SHORTCUTS,
    pageGroup, trackUi, applicationContext, trackedApplicationUrl, safeUrl, loadFeature, activateVoice,
  });

  createWorkerCompass();
  insertSearchButton();
  createContactButtons();
  updateApplicationResumeLabels();
  preserveFirstTouchOnApplicationLinks();
  document.documentElement.classList.add("tl-mobile-ux-ready");
})();
