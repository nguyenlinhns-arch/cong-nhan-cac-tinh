(() => {
  "use strict";

  const GA4_ID = "G-PZRRY10JNN";
  const META_PIXEL_ID = "1382247304000287";
  const dataLayer = window.dataLayer = window.dataLayer || [];
  const nativePush = dataLayer.push.bind(dataLayer);

  function gtag() {
    nativePush(arguments);
  }

  window.gtag = window.gtag || gtag;

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

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.metaPixelId = META_PIXEL_ID;
    document.head.append(script);

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function eventParameters(item) {
    const allowed = [
      "channel",
      "context",
      "page_path",
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
    ];
    return Object.fromEntries(
      allowed
        .filter(key => typeof item[key] === "string" && item[key].trim())
        .map(key => [key, item[key].trim().slice(0, 160)])
    );
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
    const params = eventParameters(item);

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

    window.gtag("event", item.event, params);
  }

  const queuedEvents = dataLayer.slice();
  dataLayer.push = function (...items) {
    const result = nativePush(...items);
    items.forEach(sendMeasurement);
    return result;
  };

  loadGoogleAnalytics();
  loadMetaPixel();
  captureFirstAttribution();
  trackAiReferral();
  queuedEvents.forEach(sendMeasurement);
  const queuedTracking = Array.isArray(window.tlTrackingQueue) ? window.tlTrackingQueue.splice(0) : [];
  window.tlTrack = (name, payload = {}) => dataLayer.push({ event: name, ...payload });
  queuedTracking.forEach(([name, payload]) => window.tlTrack(name, payload));

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

  window.thayLinhAnalytics = Object.freeze({
    ga4Id: GA4_ID,
    metaPixelId: META_PIXEL_ID,
    track: event => dataLayer.push(event),
  });
})();
