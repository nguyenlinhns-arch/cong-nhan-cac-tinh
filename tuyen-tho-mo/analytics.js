(() => {
  "use strict";

  const GA4_ID = "G-PZRRY10JNN";
  const GOOGLE_ADS_ID = "AW-16660675113";
  const META_PIXEL_ID = "1382247304000287";
  const CONSENT_KEY = "thaylinh_measurement_consent_v1";
  const ATTRIBUTION_KEY = "thaylinh_attribution";
  const MEASUREMENT_ID_KEY = "thaylinh_measurement_id_v1";
  const JOB_PATH = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/";
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

  function referrerSource(host) {
    const value = String(host || "").toLowerCase();
    if (!value) return { source: "", medium: "" };
    if (/(^|\.)google\./i.test(value)) return { source: "google", medium: "organic" };
    if (/(^|\.)(?:chatgpt\.com|openai\.com)$/i.test(value)) return { source: "chatgpt", medium: "ai_referral" };
    if (/(^|\.)(?:copilot\.microsoft\.com|microsoftcopilot\.com)$/i.test(value)) return { source: "copilot", medium: "ai_referral" };
    if (/(^|\.)perplexity\.ai$/i.test(value)) return { source: "perplexity", medium: "ai_referral" };
    if (/(^|\.)gemini\.google\.com$/i.test(value)) return { source: "gemini", medium: "ai_referral" };
    if (/(^|\.)claude\.ai$/i.test(value)) return { source: "claude", medium: "ai_referral" };
    if (/(^|\.)(?:facebook\.com|fb\.com)$/i.test(value)) return { source: "facebook", medium: "referral" };
    if (/(^|\.)tiktok\.com$/i.test(value)) return { source: "tiktok", medium: "referral" };
    return { source: value, medium: "referral" };
  }

  function currentAttribution() {
    const params = new URLSearchParams(location.search);
    let referrerHost = "";
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ""; } catch (_) {}
    const clickId = params.get("gclid") || params.get("gbraid") || params.get("wbraid") || "";
    const inferred = clickId ? { source: "google", medium: "cpc" } : referrerSource(referrerHost);
    return Object.fromEntries(Object.entries({
      utm_source: params.get("utm_source") || inferred.source,
      utm_medium: params.get("utm_medium") || inferred.medium,
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
      gclid: params.get("gclid"),
      gbraid: params.get("gbraid"),
      wbraid: params.get("wbraid"),
      province: params.get("province") || document.documentElement.dataset.province,
      landing_path: location.pathname,
      referrer_host: referrerHost,
      captured_at: new Date().toISOString(),
    }).filter(([, value]) => typeof value === "string" && value.trim()));
  }

  function captureAttribution() {
    try {
      const stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}");
      const current = currentAttribution();
      const params = new URLSearchParams(location.search);
      const hasExplicitCampaign = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"]
        .some((key) => Boolean(params.get(key)));
      const hasExternalReferrer = Boolean(current.referrer_host) && !/(^|\.)thaylinhtuyenthomo\.vn$/i.test(current.referrer_host);
      const next = { ...stored };

      if (!stored.first_seen_at) {
        next.first_seen_at = current.captured_at || new Date().toISOString();
        next.first_utm_source = current.utm_source || "direct";
        next.first_utm_medium = current.utm_medium || "none";
        next.first_utm_campaign = current.utm_campaign || "";
        next.first_utm_content = current.utm_content || "";
        next.first_utm_term = current.utm_term || "";
        next.first_landing_path = current.landing_path || location.pathname;
        next.first_referrer_host = current.referrer_host || "";
      }

      if (hasExplicitCampaign || hasExternalReferrer || !stored.utm_source) {
        for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "province", "landing_path", "referrer_host"]) {
          if (current[key]) next[key] = current[key];
        }
        next.last_seen_at = current.captured_at || new Date().toISOString();
      }
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
    } catch (_) {}
  }

  function captureFirstAttribution() {
    captureAttribution();
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

  function loadGoogleTagBase() {
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_ID)}`;
      script.dataset.tlAsset = "google-tag";
      document.head.append(script);
    }
    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ADS_ID, { send_page_view: false });
  }

  function hasPaidGoogleSignal() {
    const params = new URLSearchParams(location.search);
    const hasClickId = Boolean(params.get("gclid") || params.get("gbraid") || params.get("wbraid"));
    const source = String(params.get("utm_source") || "").toLowerCase();
    const medium = String(params.get("utm_medium") || "").toLowerCase();
    return hasClickId || (source === "google" && /^(cpc|paid|paid_search|search)$/i.test(medium));
  }

  function isPaidGoogleLanding() {
    return location.pathname === JOB_PATH && hasPaidGoogleSignal();
  }

  function loadPaidSearchLanding() {
    if (!isPaidGoogleLanding()) return;
    void loadAsset("link", "href", "/google-search-intent.css?v=1", "google-search-intent-style");
    void loadAsset("script", "src", "/google-search-intent.js?v=1", "google-search-intent-script");
  }

  function propagateAttributionToInternalLinks() {
    if (consentState !== "granted") return;
    const attribution = readAttribution();
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"];
    if (!keys.some((key) => attribution[key])) return;
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = String(link.getAttribute("href") || "").trim();
      if (!raw || raw.startsWith("#") || /^(?:mailto:|tel:|sms:|javascript:)/i.test(raw) || link.dataset.noAttribution === "true") return;
      try {
        const url = new URL(raw, location.href);
        if (url.origin !== location.origin) return;
        for (const key of keys) if (attribution[key] && !url.searchParams.has(key)) url.searchParams.set(key, attribution[key]);
        link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
      } catch (_) {}
    });
  }

  function loadVendors() {
    if (consentState !== "granted") return Promise.resolve(null);
    if (!vendorPromise) vendorPromise = loadAsset("script", "src", "/analytics-vendors.js?v=1", "analytics-vendors").catch(() => null);
    return vendorPromise;
  }

  function scheduleTask(start, priority = false) {
    if (typeof requestIdleCallback === "function") requestIdleCallback(start, { timeout: priority ? 700 : 2200 });
    else setTimeout(start, priority ? 200 : 1400);
  }

  function scheduleGoogleTagBase() {
    scheduleTask(loadGoogleTagBase, consentState === "granted" || hasPaidGoogleSignal());
  }

  function scheduleVendors() {
    if (consentState === "granted") scheduleTask(() => void loadVendors(), true);
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
      captureFirstAttribution();
      measurementId();
      propagateAttributionToInternalLinks();
      loadGoogleTagBase();
      void loadVendors();
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
    const clickId = params.get("gclid") || params.get("gbraid") || params.get("wbraid") || "";
    return Object.fromEntries(Object.entries({
      utm_source: params.get("utm_source") || (clickId ? "google" : "") || stored.utm_source,
      utm_medium: params.get("utm_medium") || (clickId ? "cpc" : "") || stored.utm_medium,
      utm_campaign: params.get("utm_campaign") || stored.utm_campaign,
      utm_content: params.get("utm_content") || stored.utm_content,
      utm_term: params.get("utm_term") || stored.utm_term,
      gclid: params.get("gclid") || stored.gclid,
      gbraid: params.get("gbraid") || stored.gbraid,
      wbraid: params.get("wbraid") || stored.wbraid,
      province: params.get("province") || document.documentElement.dataset.province || stored.province,
      first_source: stored.first_utm_source,
      first_medium: stored.first_utm_medium,
      first_campaign: stored.first_utm_campaign,
      first_content: stored.first_utm_content,
      first_term: stored.first_utm_term,
      first_landing_path: stored.first_landing_path,
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
    if (channel === "zalo" && consentState === "granted") window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/6at3CNe_teAcEKn0tog-`, value: 1, currency: "VND" });
    if (channel === "application" && !formOpened) {
      formOpened = true;
      dataLayer.push({ event: "application_form_open", context: "application_link", page_path: location.pathname, ...readAttribution() });
    }
  }, { capture: true });

  document.addEventListener("focusin", (event) => {
    if (!formOpened && event.target.closest?.("[data-application-form]")) {
      formOpened = true;
      dataLayer.push({ event: "application_form_open", context: "application_form", page_path: location.pathname, ...readAttribution() });
    }
  });

  updateGoogleConsent(consentState, true);
  scheduleGoogleTagBase();
  loadPaidSearchLanding();
  window.tlTrack = (name, payload = {}) => dataLayer.push({ event: name, ...readAttribution(), ...payload });
  const queued = Array.isArray(window.tlTrackingQueue) ? window.tlTrackingQueue.splice(0) : [];
  queued.forEach(([name, payload]) => window.tlTrack(name, payload));
  window.thayLinhAnalytics = Object.freeze({
    ga4Id: GA4_ID, googleAdsId: GOOGLE_ADS_ID, metaPixelId: META_PIXEL_ID, track: (event) => dataLayer.push(event),
    load: loadVendors, consent: setConsent, consentState: () => consentState,
    openConsent, measurementId, attribution: readAttribution,
  });

  if (consentState === "granted") {
    captureFirstAttribution();
    measurementId();
    propagateAttributionToInternalLinks();
    scheduleVendors();
  } else if (consentState === "pending") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void openConsent(), { once: true });
    else void openConsent();
  }
  for (const name of ["pointerdown", "touchstart", "keydown"]) window.addEventListener(name, () => { if (consentState === "granted") void loadVendors(); }, { once: true, passive: true });

  if (document.body?.classList.contains("verification-page")) {
    loadAsset("link", "href", "/verification-portal.css?v=1", "verification-style");
    loadAsset("script", "src", "/verification-portal.js?v=1", "verification-script");
  }
})();
