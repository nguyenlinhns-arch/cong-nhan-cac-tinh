(() => {
  "use strict";

  const api = window.thayLinhAnalytics;
  if (!api || api.consentState() !== "granted" || window.__TL_ANALYTICS_VENDORS__) return;
  window.__TL_ANALYTICS_VENDORS__ = true;
  const GA4_ID = api.ga4Id;
  const GOOGLE_ADS_ID = api.googleAdsId || "AW-16660675113";
  const GOOGLE_ADS_ZALO_SEND_TO = `${GOOGLE_ADS_ID}/6at3CNe_teAcEKn0tog-`;
  const META_PIXEL_ID = api.metaPixelId;
  const WEB_VITALS_VERSION = "6.0.1";
  const MEASUREMENT_VERSION = "2026-08-09-google-search-ai-v2";
  const dataLayer = window.dataLayer = window.dataLayer || [];
  const nativePush = dataLayer.push.bind(dataLayer);
  let lastConditionComplete = { key: "", at: 0 };

  function installMetaQueue() {
    if (window.fbq) return;
    const fbq = function () { if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); else fbq.queue.push(arguments); };
    window.fbq = fbq;
    window._fbq ||= fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
  }

  function appendScript(src, marker, onload) {
    if (marker === "ga4" && document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) { onload?.(); return; }
    if (document.querySelector(`script[data-tl-vendor="${marker}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.dataset.tlVendor = marker;
    if (onload) script.onload = onload;
    document.head.append(script);
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

  function parameters(item) {
    const strings = [
      "channel", "context", "page_path", "page_location", "page_group", "utm_source", "utm_medium",
      "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid",
      "first_source", "first_medium", "first_campaign", "first_content", "first_term", "first_landing_path",
      "province", "trade", "source", "medium", "campaign", "content",
      "action", "eligibility", "job_id", "step", "field_group", "metric_name", "metric_id", "metric_rating",
      "navigation_type", "measurement_version", "entry_intent", "entry_page", "journey_stage", "journey_score_bucket",
      "last_action", "page_sequence", "cta_variant", "time_bucket", "content_type", "conversion_version", "lead_stage",
      "landing_type", "contact_preference", "three_info_status", "result", "destination", "lead_key",
    ];
    const numbers = ["value", "metric_value", "metric_delta", "metric_start_time", "journey_score", "page_count", "seconds_to_action", "scroll_depth"];
    const output = Object.fromEntries(strings.filter((key) => typeof item[key] === "string" && item[key].trim())
      .map((key) => [key, item[key].trim().slice(0, key === "page_location" ? 500 : 160)]));
    for (const key of numbers) if (typeof item[key] === "number" && Number.isFinite(item[key])) output[key] = item[key];
    output.page_group ||= pageGroup(item.page_path || location.pathname);
    output.measurement_version ||= MEASUREMENT_VERSION;
    return output;
  }

  function gtagEvent(name, params) {
    window.gtag("event", name, params);
  }

  function sendMeasurement(item) {
    if (!item || Object.prototype.toString.call(item) !== "[object Object]" || !item.event) return;
    const params = parameters(item);
    if (item.event === "WebVital") {
      if (!["CLS", "INP", "LCP"].includes(params.metric_name)) return;
      const name = params.metric_name;
      delete params.metric_name;
      gtagEvent(name, { ...params, value: params.metric_delta });
      return;
    }
    if (item.event === "contact_click") {
      const channel = params.channel || "unknown";
      gtagEvent("contact_click", params);
      if (["zalo", "messenger", "phone", "application"].includes(channel)) gtagEvent(`click_${channel}`, params);
      if (channel === "zalo") gtagEvent("conversion", { send_to: GOOGLE_ADS_ZALO_SEND_TO, value: 1, currency: "VND" });
      window.fbq("track", "Contact", { content_name: channel, page_path: params.page_path || location.pathname });
      const metaName = { application: "ApplicationClick", zalo: "ZaloClick", messenger: "MessengerClick", phone: "PhoneClick" }[channel];
      if (metaName) window.fbq("trackCustom", metaName, params);
      return;
    }
    if (item.event === "application_form_open") {
      gtagEvent("application_form_open", params);
      window.fbq("trackCustom", "ApplicationFormOpen", params);
      return;
    }
    if (["condition_check_start", "condition_check_complete", "worker_self_check_complete"].includes(item.event)) {
      const eventName = item.event === "worker_self_check_complete" ? "condition_check_complete" : item.event;
      if (eventName === "condition_check_complete") {
        const key = params.result || "unknown";
        const now = Date.now();
        if (lastConditionComplete.key === key && now - lastConditionComplete.at < 1000) return;
        lastConditionComplete = { key, at: now };
      }
      gtagEvent(eventName, params);
      window.fbq("trackCustom", item.event === "condition_check_start" ? "ConditionCheckStart" : "ConditionCheckComplete", params);
      return;
    }
    if (["qualified_lead", "condition_pass"].includes(item.event)) {
      gtagEvent(item.event, params);
      window.fbq("trackCustom", item.event === "qualified_lead" ? "QualifiedLead" : "ConditionPass", params);
      return;
    }
    if (["form_start", "ApplicationStart"].includes(item.event)) {
      gtagEvent("form_start", params);
      window.fbq("trackCustom", "FormStart", params);
      return;
    }
    if (["form_submit", "ApplicationSubmit"].includes(item.event)) {
      gtagEvent("form_submit", params);
      window.fbq("trackCustom", "FormSubmit", params);
      return;
    }
    if (item.event === "Lead") {
      if (params.action === "application_saved") {
        gtagEvent("generate_lead", params);
        window.fbq("track", "Lead", { content_name: params.job_id || "recruitment_application", content_category: params.eligibility || "unknown" });
      } else {
        gtagEvent("lead_fallback_created", params);
        window.fbq("trackCustom", "LeadFallbackCreated", params);
      }
      return;
    }
    if (item.event === "application_message_created") {
      gtagEvent("lead_fallback_created", params);
      window.fbq("trackCustom", "LeadFallbackCreated", params);
      return;
    }
    if (item.event === "ApplicationProgress") { gtagEvent("application_progress", params); return; }
    if (item.event === "ApplicationValidationError") { gtagEvent("application_validation_error", params); return; }
    if (item.event === "ApplicationDeliveryFailure") { gtagEvent("application_delivery_failed", params); return; }
    gtagEvent(item.event, params);
  }

  const queued = dataLayer.slice();
  dataLayer.push = function (...items) {
    const result = nativePush(...items);
    items.forEach(sendMeasurement);
    return result;
  };

  installMetaQueue();
  appendScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`, "ga4");
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, { send_page_view: true, transport_type: "beacon", client_id: api.measurementId() || undefined });
  window.gtag("config", GOOGLE_ADS_ID, { send_page_view: false });
  appendScript("https://connect.facebook.net/en_US/fbevents.js", "meta");
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
  window.fbq("track", "ViewContent", { content_name: pageGroup(), content_type: "website" });

  function reportWebVital(metric) {
    if (!metric || !["CLS", "INP", "LCP"].includes(metric.name)) return;
    const pageLocation = metric.navigationURL || location.href;
    let pagePath = location.pathname;
    try { pagePath = new URL(pageLocation, location.href).pathname; } catch (_) {}
    const entry = Array.isArray(metric.entries) ? metric.entries.at(-1) : null;
    dataLayer.push({
      event: "WebVital", metric_name: metric.name, metric_id: metric.id, metric_value: metric.value,
      metric_delta: metric.delta, metric_rating: metric.rating, metric_start_time: Number(entry?.startTime) || 0,
      navigation_type: metric.navigationType, page_location: pageLocation, page_path: pagePath,
      page_group: pageGroup(pagePath), measurement_version: MEASUREMENT_VERSION,
    });
  }

  function registerVitals() {
    const vitals = window.webVitals;
    if (!vitals) return;
    vitals.onCLS?.(reportWebVital);
    vitals.onINP?.(reportWebVital);
    vitals.onLCP?.(reportWebVital);
  }
  appendScript(`/assets/vendor/web-vitals-${WEB_VITALS_VERSION}.iife.js`, "web-vitals", registerVitals);

  let referrerHost = "";
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ""; } catch (_) {}
  const sourceSignal = `${new URLSearchParams(location.search).get("utm_source") || ""} ${referrerHost}`.toLowerCase();
  const aiSource = [[/chatgpt|openai/, "chatgpt"], [/copilot/, "copilot"], [/perplexity/, "perplexity"], [/gemini/, "gemini"], [/claude/, "claude"]].find(([pattern]) => pattern.test(sourceSignal))?.[1];
  if (aiSource) dataLayer.push({ event: "ai_referral_visit", source: aiSource, page_path: location.pathname });
  queued.forEach(sendMeasurement);
})();
