(() => {
  "use strict";

  const ENDPOINT = "https://script.google.com/macros/s/AKfycbzDWAttjmaWu9K4XRkzmouKpQARs1BvrLOQkPMpCyouyH91CMFiOB75RV0fyaCLhJPI/exec";
  const ATTRIBUTION_KEY = "thaylinh_attribution";
  const CONSENT_KEY = "thaylinh_measurement_consent_v1";

  window.THAY_LINH_RECRUITMENT = Object.freeze({
    // Giữ phiên bản truyền tải tương thích với web app CRM đang chạy.
    // Các trường Google Ads được nối thêm nhưng không thay đổi schema bắt buộc hiện có.
    schemaVersion: 2,
    endpoint: ENDPOINT,
    timeoutMs: 12000,
    contact: Object.freeze({
      phone: "0963048585",
      phoneE164: "+84963048585",
      phoneUrl: "tel:+84963048585",
      zalo: "https://zalo.me/0963048585",
      messenger: "https://m.me/thaylinhtuyenthomo",
    }),
    criteria: Object.freeze({
      ageMin: 18,
      ageMax: 40,
      heightMinCm: 153,
      weightMinKg: 47,
    }),
  });

  if (!window.__TL_PROGRESSIVE_APPLICATION_LOADER__ && /^\/viec-lam\//.test(location.pathname)) {
    window.__TL_PROGRESSIVE_APPLICATION_LOADER__ = true;
    const script = document.createElement("script");
    script.src = "/application-progressive.js?v=1";
    script.async = true;
    script.dataset.tlApplicationProgressive = "true";
    document.head.append(script);
  }

  if (window.__TL_CRM_ATTRIBUTION_ENRICHER__) return;
  window.__TL_CRM_ATTRIBUTION_ENRICHER__ = true;

  function readStoredAttribution() {
    if (localStorage.getItem(CONSENT_KEY) !== "granted") return {};
    try {
      const value = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (_) {
      return {};
    }
  }

  function normalizePhoneE164(value) {
    let digits = String(value || "").replace(/\D/g, "");
    if (digits.startsWith("84")) digits = digits.slice(2);
    if (digits.startsWith("0")) digits = digits.slice(1);
    return /^[35789]\d{8}$/.test(digits) ? `+84${digits}` : "";
  }

  function normalizeIntent(value) {
    const signal = String(value || "")
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (/(hoc nghe|mien phi|hoc phi|an o|ky tuc|7 5|dao tao|hoc tho lo)/.test(signal)) return "training";
    if (/(luong|thu nhap|20 25|25 trieu|bang luong|luong cao)/.test(signal)) return "income";
    return "job";
  }

  function enrichApplication(payload) {
    if (!payload || typeof payload !== "object") return payload;
    const stored = readStoredAttribution();
    const params = new URLSearchParams(location.search);
    const term = params.get("utm_term") || stored.utm_term || stored.first_utm_term || "";
    const campaign = params.get("utm_campaign") || stored.utm_campaign || "";
    const content = params.get("utm_content") || stored.utm_content || "";
    const pageIntent = document.documentElement.dataset.googlePaidIntent || normalizeIntent(`${term} ${campaign} ${content}`);
    const phoneE164 = normalizePhoneE164(payload.phone);

    return {
      ...payload,
      phone_e164: phoneE164,
      utm_term: term,
      gclid: params.get("gclid") || stored.gclid || "",
      gbraid: params.get("gbraid") || stored.gbraid || "",
      wbraid: params.get("wbraid") || stored.wbraid || "",
      first_source: stored.first_utm_source || "",
      first_medium: stored.first_utm_medium || "",
      first_campaign: stored.first_utm_campaign || "",
      first_content: stored.first_utm_content || "",
      first_term: stored.first_utm_term || "",
      first_landing_path: stored.first_landing_path || "",
      paid_search_intent: pageIntent,
      google_ads_import_ready: Boolean(phoneE164 || stored.gclid || stored.gbraid || stored.wbraid || params.get("gclid") || params.get("gbraid") || params.get("wbraid")),
    };
  }

  const nativeFetch = window.fetch.bind(window);
  window.fetch = function(input, init) {
    try {
      const target = typeof input === "string" ? input : String(input?.url || "");
      if (target === ENDPOINT && init && String(init.method || "GET").toUpperCase() === "POST" && typeof init.body === "string") {
        const payload = JSON.parse(init.body);
        return nativeFetch(input, { ...init, body: JSON.stringify(enrichApplication(payload)) });
      }
    } catch (_) {}
    return nativeFetch(input, init);
  };
})();
