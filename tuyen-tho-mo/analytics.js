(() => {
  "use strict";

  const GA4_ID = "G-PZRRY10JNN";
  const META_PIXEL_ID = "1382247304000287";
  const CONSENT_KEY = "thaylinh_measurement_consent_v1";
  const ATTRIBUTION_KEY = "thaylinh_attribution";
  const MEASUREMENT_ID_KEY = "thaylinh_measurement_id_v1";
  const dataLayer = window.dataLayer = window.dataLayer || [];
  let consentState = readConsent();
  let vendorPromise = null;
  let consentUiPromise = null;
  let formOpened = false;

  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function readConsent() {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === "granted" || value === "denied" ? value : "pending";
    } catch (_) { return "pending"; }
  }

  function updateGoogleConsent(value, initial = false) {
    const granted = value === "granted";
    window.gtag("consent", initial ? "default" : "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
      ...(initial ? { wait_for_update: 500 } : {}),
    });
  }

  function currentAttribution() {
    const params = new URLSearchParams(location.search);
    let referrerHost = "";
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ""; } catch (_) {}
    return Object.fromEntries(Object.entries({
      utm_source: params.get("utm_source"), utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"), utm_content: params.get("utm_content"),
      province: params.get("province") || document.documentElement.dataset.province,
      landing_path: location.pathname, referrer_host: referrerHost, first_seen_at: new Date().toISOString(),
    }).filter(([, value]) => value));
  }

  function captureFirstAttribution() {
    try {
      const stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}");
      if (!stored.first_seen_at) localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(currentAttribution()));
    } catch (_) {}
  }

  function measurementId() {
    if (consentState !== "granted") return "";
    try {
      let value = localStorage.getItem(MEASUREMENT_ID_KEY) || "";
      if (!/^[a-z0-9-]{16,64}$/i.test(value)) {
        value = window.crypto?.randomUUID?.() || `tl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
        localStorage.setItem(MEASUREMENT_ID_KEY, value);
      }
      return value;
    } catch (_) { return ""; }
  }

  function loadAsset(tag, attribute, value, marker) {
    if (document.querySelector(`${tag}[data-tl-asset="${marker}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const node = document.createElement(tag);
      node[attribute] = value;
      node.dataset.tlAsset = marker;
      if (tag === "link") node.rel = "stylesheet";
      else node.async = true;
      node.onload = resolve;
      node.onerror = reject;
      document.head.append(node);
    });
  }

  function loadVendors() {
    if (consentState !== "granted") return Promise.resolve(null);
    if (!vendorPromise) vendorPromise = loadAsset("script", "src", "/analytics-vendors.js?v=1", "analytics-vendors").catch(() => null);
    return vendorPromise;
  }

  function scheduleVendors() {
    if (consentState !== "granted") return;
    const start = () => void loadVendors();
    if (typeof requestIdleCallback === "function") requestIdleCallback(start, { timeout: 2200 });
    else setTimeout(start, 1400);
  }

  function openConsent() {
    if (!consentUiPromise) consentUiPromise = Promise.all([
      loadAsset("link", "href", "/consent-analytics.css?v=1", "consent-style"),
      loadAsset("script", "src", "/consent-analytics.js?v=1", "consent-script"),
    ]).then(() => window.ThayLinhConsent?.open?.()).catch(() => null);
    else consentUiPromise.then(() => window.ThayLinhConsent?.open?.());
    return consentUiPromise;
  }

  function clearMeasurementStorage() {
    try { localStorage.removeItem(ATTRIBUTION_KEY); localStorage.removeItem(MEASUREMENT_ID_KEY); } catch (_) {}
    const names = String(document.cookie || "").split(";").map((item) => item.split("=")[0].trim()).filter(Boolean);
    for (const name of names.filter((item) => /^_ga|^_fbp$|^_fbc$/i.test(item))) {
      for (const domain of ["", ";domain=.thaylinhtuyenthomo.vn"]) document.cookie = `${name}=;Max-Age=0;path=/${domain};SameSite=Lax`;
    }
  }

  function setConsent(value) {
    if (!["granted", "denied"].includes(value)) return;
    consentState = value;
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
    updateGoogleConsent(value);
    if (value === "granted") {
      captureFirstAttribution(); measurementId(); void loadVendors();
      window.fbq?.("consent", "grant");
    } else {
      for (let index = dataLayer.length - 1; index >= 0; index -= 1) if (dataLayer[index]?.event) dataLayer.splice(index, 1);
      window.fbq?.("consent", "revoke"); clearMeasurementStorage();
    }
    window.ThayLinhConsent?.close?.();
  }

  function readAttribution() {
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}"); } catch (_) {}
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(Object.entries({
      utm_source: params.get("utm_source") || stored.utm_source,
      utm_medium: params.get("utm_medium") || stored.utm_medium,
      utm_campaign: params.get("utm_campaign") || stored.utm_campaign,
      utm_content: params.get("utm_content") || stored.utm_content,
      province: params.get("province") || document.documentElement.dataset.province || stored.province,
    }).filter(([, value]) => typeof value === "string" && value.trim()));
  }

  function contactChannel(link) {
    const declared = String(link?.dataset?.contact || "").trim();
    if (declared) return declared;
    return String(link?.getAttribute?.("href") || "").includes("#dang-ky") ? "application" : "";
  }

  document.addEventListener("click", (event) => {
    const consent = event.target.closest?.("[data-open-consent]");
    if (consent) { event.preventDefault(); void openConsent(); return; }
    const link = event.target.closest?.("a");
    const channel = contactChannel(link);
    if (!link || !channel) return;
    dataLayer.push({ event: "contact_click", channel, context: link.dataset.context || "site_link", page_path: location.pathname, ...readAttribution() });
    if (channel === "application" && !formOpened) {
      formOpened = true;
      dataLayer.push({ event: "application_form_open", context: "application_link", page_path: location.pathname });
    }
  }, { capture: true });

  document.addEventListener("focusin", (event) => {
    if (!formOpened && event.target.closest?.("[data-application-form]")) {
      formOpened = true;
      dataLayer.push({ event: "application_form_open", context: "application_form", page_path: location.pathname });
    }
  });

  updateGoogleConsent(consentState, true);
  window.tlTrack = (name, payload = {}) => dataLayer.push({ event: name, ...payload });
  const queued = Array.isArray(window.tlTrackingQueue) ? window.tlTrackingQueue.splice(0) : [];
  queued.forEach(([name, payload]) => window.tlTrack(name, payload));
  window.thayLinhAnalytics = Object.freeze({
    ga4Id: GA4_ID, metaPixelId: META_PIXEL_ID, track: (event) => dataLayer.push(event),
    load: loadVendors, consent: setConsent, consentState: () => consentState,
    openConsent, measurementId,
  });

  if (consentState === "granted") { captureFirstAttribution(); measurementId(); scheduleVendors(); }
  else if (consentState === "pending") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void openConsent(), { once: true });
    else void openConsent();
  }
  for (const name of ["pointerdown", "touchstart", "keydown"]) window.addEventListener(name, () => { if (consentState === "granted") void loadVendors(); }, { once: true, passive: true });

  if (document.body?.classList.contains("verification-page")) {
    loadAsset("link", "href", "/verification-portal.css?v=1", "verification-style");
    loadAsset("script", "src", "/verification-portal.js?v=1", "verification-script");
  }
})();
