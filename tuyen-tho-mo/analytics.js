(() => {
  "use strict";

  const GA4_ID = "G-PZRRY10JNN";
  const META_PIXEL_ID = "1382247304000287";
  const CONSENT_KEY = "thaylinh_measurement_consent_v1";
  const WEB_VITALS_VERSION = "6.0.1";
  const WEB_VITALS_URL = `/assets/vendor/web-vitals-${WEB_VITALS_VERSION}.iife.js`;
  const MEASUREMENT_VERSION = "2026-08-02-rum-v1";
  const dataLayer = window.dataLayer = window.dataLayer || [];
  const nativePush = dataLayer.push.bind(dataLayer);
  const pendingMeasurements = [];
  let vendorsLoaded = false;
  let vendorTimer = 0;
  let webVitalsRegistered = false;
  let consentState = readConsent();

  function gtag() {
    nativePush(arguments);
  }

  window.gtag = window.gtag || gtag;

  function readConsent() {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === "granted" || value === "denied" ? value : "pending";
    } catch (_) {
      return "pending";
    }
  }

  function updateGoogleConsent(value, isDefault = false) {
    const granted = value === "granted";
    window.gtag("consent", isDefault ? "default" : "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
      ...(isDefault ? { wait_for_update: 500 } : {}),
    });
  }

  updateGoogleConsent(consentState, true);

  function installMetaQueue() {
    if (window.fbq) return;
    const fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
  }

  function loadGoogleAnalytics() {
    if (document.querySelector(`script[data-ga4-id="${GA4_ID}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    script.dataset.ga4Id = GA4_ID;
    document.head.append(script);

    window.gtag("js", new Date());
    window.gtag("config", GA4_ID, {
      send_page_view: true,
      transport_type: "beacon",
    });
  }

  function loadMetaPixel() {
    if (document.querySelector(`script[data-meta-pixel-id="${META_PIXEL_ID}"]`)) return;
    installMetaQueue();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.metaPixelId = META_PIXEL_ID;
    document.head.append(script);

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function pageGroup(pathname = location.pathname) {
    const path = String(pathname || "/");
    if (/^\/viec-lam\//.test(path)) return "job";
    if (/^\/viec-lam-nganh-than\//.test(path)) return "province";
    if (/^\/tin-nganh-than\//.test(path)) return "news";
    if (/^\/bai-viet\//.test(path)) return "guide";
    if (/^\/video-tkv\//.test(path)) return "video";
    if (/^\/thong-tin-tuyen-tho-mo\//.test(path)) return "recruitment_facts";
    return path === "/" ? "home" : "utility";
  }

  function reportWebVital(metric) {
    if (!metric || !["CLS", "INP", "LCP"].includes(metric.name)) return;
    const pageLocation = metric.navigationURL || location.href;
    let pagePath = location.pathname;
    try { pagePath = new URL(pageLocation, location.href).pathname; } catch (_) {}
    const lastEntry = Array.isArray(metric.entries) ? metric.entries.at(-1) : null;
    dataLayer.push({
      event: "WebVital",
      metric_name: metric.name,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      metric_start_time: Number(lastEntry?.startTime) || 0,
      navigation_type: metric.navigationType,
      page_location: pageLocation,
      page_path: pagePath,
      page_group: pageGroup(pagePath),
      measurement_version: MEASUREMENT_VERSION,
    });
  }

  function registerWebVitals() {
    if (webVitalsRegistered) return;
    const api = window.webVitals;
    if (!api || ![api.onCLS, api.onINP, api.onLCP].every(item => typeof item === "function")) return;
    webVitalsRegistered = true;
    api.onCLS(reportWebVital);
    api.onINP(reportWebVital);
    api.onLCP(reportWebVital);
  }

  function loadWebVitals() {
    if (window.webVitals) {
      registerWebVitals();
      return;
    }
    if (document.querySelector(`script[data-web-vitals-version="${WEB_VITALS_VERSION}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = WEB_VITALS_URL;
    script.dataset.webVitalsVersion = WEB_VITALS_VERSION;
    script.onload = registerWebVitals;
    document.head.append(script);
  }

  function ensureVendors() {
    if (vendorsLoaded || consentState !== "granted") return;
    vendorsLoaded = true;
    if (vendorTimer) window.clearTimeout(vendorTimer);
    loadWebVitals();
    loadGoogleAnalytics();
    loadMetaPixel();
  }

  function scheduleVendors() {
    if (consentState !== "granted") return;
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(ensureVendors, { timeout: 2500 });
      return;
    }
    vendorTimer = window.setTimeout(ensureVendors, 1800);
  }

  function eventParameters(item) {
    const stringAllowed = [
      "channel",
      "context",
      "page_path",
      "page_location",
      "page_group",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "province",
      "trade",
      "source",
      "medium",
      "campaign",
      "content",
      "action",
      "eligibility",
      "job_id",
      "step",
      "field_group",
      "metric_name",
      "metric_id",
      "metric_rating",
      "navigation_type",
      "measurement_version",
    ];
    const numericAllowed = ["value", "metric_value", "metric_delta", "metric_start_time"];
    const params = Object.fromEntries(stringAllowed
      .filter(key => typeof item[key] === "string" && item[key].trim())
      .map(key => [key, item[key].trim().slice(0, key === "page_location" ? 500 : 160)]));
    for (const key of numericAllowed) {
      if (typeof item[key] === "number" && Number.isFinite(item[key])) params[key] = item[key];
    }
    params.page_group ||= pageGroup(item.page_path || location.pathname);
    params.measurement_version ||= MEASUREMENT_VERSION;
    return params;
  }

  function readAttribution() {
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem("thaylinh_attribution") || "{}"); } catch (_) {}
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(Object.entries({
      utm_source: params.get("utm_source") || stored.utm_source,
      utm_medium: params.get("utm_medium") || stored.utm_medium,
      utm_campaign: params.get("utm_campaign") || stored.utm_campaign,
      utm_content: params.get("utm_content") || stored.utm_content,
      province: params.get("province") || document.documentElement.dataset.province || stored.province,
    }).filter(([, value]) => typeof value === "string" && value.trim()));
  }

  function detectAiSource() {
    const params = new URLSearchParams(location.search);
    const campaignSource = String(params.get("utm_source") || "").toLowerCase();
    let referrerHost = "";
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ""; } catch (_) {}
    const signal = `${campaignSource} ${referrerHost}`;
    if (/chatgpt|openai/.test(signal)) return "chatgpt";
    if (/copilot|microsoftcopilot/.test(signal)) return "copilot";
    if (/perplexity/.test(signal)) return "perplexity";
    if (/gemini/.test(signal)) return "gemini";
    if (/claude/.test(signal)) return "claude";
    return "";
  }

  function trackAiReferral() {
    const source = detectAiSource();
    if (!source) return;
    dataLayer.push({
      event: "ai_referral_visit",
      source,
      page_path: location.pathname,
      ...readAttribution(),
    });
  }

  function captureFirstAttribution() {
    try {
      const stored = JSON.parse(localStorage.getItem("thaylinh_attribution") || "{}");
      if (stored.first_seen_at) return;
      const params = new URLSearchParams(location.search);
      const firstTouch = Object.fromEntries(Object.entries({
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_content: params.get("utm_content"),
        province: params.get("province") || document.documentElement.dataset.province,
        landing_path: location.pathname,
        referrer_host: document.referrer ? new URL(document.referrer).hostname : "",
        first_seen_at: new Date().toISOString(),
      }).filter(([, value]) => value));
      localStorage.setItem("thaylinh_attribution", JSON.stringify(firstTouch));
    } catch (_) {}
  }

  function contactChannel(link) {
    const declared = String(link?.dataset?.contact || "").trim();
    if (declared) return declared;
    const href = String(link?.getAttribute?.("href") || "");
    return href.includes("#dang-ky") ? "application" : "";
  }

  function sendMeasurement(item) {
    if (!item || Object.prototype.toString.call(item) !== "[object Object]" || !item.event) return;
    if (consentState !== "granted") {
      if (consentState === "pending" && pendingMeasurements.length < 50) pendingMeasurements.push(item);
      return;
    }
    installMetaQueue();
    const params = eventParameters(item);

    if (item.event === "WebVital") {
      const name = params.metric_name;
      if (!["CLS", "INP", "LCP"].includes(name)) return;
      const payload = { ...params, value: params.metric_delta };
      delete payload.metric_name;
      window.gtag("event", name, payload);
      return;
    }

    if (item.event === "contact_click") {
      const channel = params.channel || "unknown";
      window.gtag("event", "contact_click", params);
      window.fbq("track", "Contact", {
        content_name: channel,
        page_path: params.page_path || location.pathname,
      });
      const metaEvent = {
        application: "ApplicationClick",
        zalo: "ZaloClick",
        messenger: "MessengerClick",
        phone: "PhoneClick",
        sms: "SmsClick",
      }[channel];
      if (metaEvent) window.fbq("trackCustom", metaEvent, params);
      return;
    }

    if (item.event === "application_form_open") {
      window.gtag("event", "application_form_open", params);
      window.fbq("trackCustom", "ApplicationFormOpen", params);
      return;
    }

    if (item.event === "application_message_created") {
      window.gtag("event", "generate_lead", {
        ...params,
        method: "application_message",
      });
      window.fbq("track", "Lead", {
        content_name: "application_message",
        province: params.province,
        trade: params.trade,
      });
      return;
    }

    if (item.event === "ApplicationStart") {
      window.gtag("event", "application_start", params);
      window.fbq("trackCustom", "ApplicationStart", params);
      return;
    }

    if (item.event === "ApplicationSubmit") {
      window.gtag("event", "application_submit", params);
      window.fbq("trackCustom", "ApplicationSubmit", params);
      return;
    }

    if (item.event === "Lead") {
      window.gtag("event", "generate_lead", params);
      window.fbq("track", "Lead", {
        content_name: params.job_id || "recruitment_application",
        content_category: params.eligibility || "unknown",
      });
      return;
    }

    if (item.event === "ApplicationDeliveryFailure") {
      window.gtag("event", "application_delivery_failed", params);
      window.fbq("trackCustom", "ApplicationDeliveryFailure", params);
      return;
    }

    if (item.event === "ApplicationProgress") {
      window.gtag("event", "application_progress", params);
      return;
    }

    if (item.event === "ApplicationValidationError") {
      window.gtag("event", "application_validation_error", params);
      return;
    }

    window.gtag("event", item.event, params);
  }

  const queuedEvents = dataLayer.slice();
  dataLayer.push = function (...items) {
    const result = nativePush(...items);
    items.forEach(sendMeasurement);
    return result;
  };

  queuedEvents.forEach(sendMeasurement);
  const queuedTracking = Array.isArray(window.tlTrackingQueue) ? window.tlTrackingQueue.splice(0) : [];
  window.tlTrack = (name, payload = {}) => dataLayer.push({ event: name, ...payload });
  queuedTracking.forEach(([name, payload]) => window.tlTrack(name, payload));
  if (consentState === "granted") {
    captureFirstAttribution();
    trackAiReferral();
    scheduleVendors();
  }
  for (const eventName of ["pointerdown", "touchstart", "keydown"]) {
    window.addEventListener(eventName, ensureVendors, { once: true, passive: true });
  }

  let applicationFormOpened = false;
  function trackApplicationFormOpen(context) {
    if (applicationFormOpened) return;
    applicationFormOpened = true;
    dataLayer.push({
      event: "application_form_open",
      context,
      page_path: location.pathname,
    });
  }

  document.addEventListener("click", event => {
    const link = event.target.closest?.("a");
    const channel = contactChannel(link);
    if (!link || !channel) return;
    dataLayer.push({
      event: "contact_click",
      channel,
      context: link.dataset.context || "site_link",
      page_path: location.pathname,
      ...readAttribution(),
    });
  }, { capture: true });

  document.addEventListener("click", event => {
    if (event.target.closest?.('a[href*="#dang-ky"]')) {
      trackApplicationFormOpen("application_link");
    }
  }, { capture: true });

  document.addEventListener("focusin", event => {
    if (event.target.closest?.("[data-application-form]")) {
      trackApplicationFormOpen("application_form");
    }
  });

  function clearMeasurementStorage() {
    try { localStorage.removeItem("thaylinh_attribution"); } catch (_) {}
    const names = String(document.cookie || "").split(";").map(item => item.split("=")[0].trim()).filter(Boolean);
    for (const name of names.filter(item => /^_ga|^_fbp$|^_fbc$/i.test(item))) {
      for (const domain of ["", ";domain=.thaylinhtuyenthomo.vn"]) {
        document.cookie = `${name}=;Max-Age=0;path=/${domain};SameSite=Lax`;
      }
    }
  }

  function setConsent(value) {
    if (!['granted', 'denied'].includes(value)) return;
    consentState = value;
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
    updateGoogleConsent(value);
    if (value === "granted") {
      if (window.fbq) window.fbq("consent", "grant");
      captureFirstAttribution();
      trackAiReferral();
      ensureVendors();
      pendingMeasurements.splice(0).forEach(sendMeasurement);
    } else {
      pendingMeasurements.length = 0;
      if (window.fbq) window.fbq("consent", "revoke");
      clearMeasurementStorage();
    }
    document.querySelector("[data-consent-banner]")?.setAttribute("hidden", "");
  }

  function createConsentBanner() {
    const existing = document.querySelector("[data-consent-banner]");
    if (existing) {
      existing.removeAttribute("hidden");
      return existing;
    }
    const banner = document.createElement("section");
    banner.className = "tl-consent-banner";
    banner.dataset.consentBanner = "";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-labelledby", "tl-consent-title");
    banner.innerHTML = `<div class="tl-consent-banner__copy"><strong id="tl-consent-title">Lựa chọn đo lường</strong><span>Cho phép ghi nhận hiệu năng, nguồn truy cập và thao tác ẩn danh để cải thiện website. Không gửi tên, số điện thoại hay thông tin sức khỏe cho hệ thống đo lường. <a href="/quyen-rieng.html">Xem quyền riêng tư</a>.</span></div><div class="tl-consent-banner__actions"><button type="button" data-consent-choice="denied">Chỉ cần thiết</button><button type="button" data-consent-choice="granted">Đồng ý đo lường</button></div>`;
    banner.querySelectorAll("[data-consent-choice]").forEach(button => {
      button.addEventListener("click", () => setConsent(button.dataset.consentChoice));
    });
    document.body.append(banner);
    return banner;
  }

  document.querySelectorAll("[data-open-consent]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      createConsentBanner();
    });
  });
  if (consentState === "pending") createConsentBanner();

  window.thayLinhAnalytics = Object.freeze({
    ga4Id: GA4_ID,
    metaPixelId: META_PIXEL_ID,
    track: event => dataLayer.push(event),
    load: ensureVendors,
    consent: setConsent,
    consentState: () => consentState,
    openConsent: createConsentBanner,
  });
})();
