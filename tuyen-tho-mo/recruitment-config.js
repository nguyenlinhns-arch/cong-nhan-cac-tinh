(() => {
  "use strict";

  const ENDPOINT = "https://script.google.com/macros/s/AKfycbzDWAttjmaWu9K4XRkzmouKpQARs1BvrLOQkPMpCyouyH91CMFiOB75RV0fyaCLhJPI/exec";
  const ATTRIBUTION_KEY = "thaylinh_attribution";
  const ADS_ATTRIBUTION_KEY = "thaylinh_ads_attribution_v1";
  const CONSENT_KEY = "thaylinh_measurement_consent_v1";

  window.THAY_LINH_RECRUITMENT = Object.freeze({
    // Giữ phiên bản truyền tải tương thích với web app CRM đang chạy.
    // Thuộc tính quảng cáo được nối thêm nhưng không thay đổi schema bắt buộc hiện có.
    schemaVersion: 2,
    updatedAt: "2026-08-23T11:35:00+07:00",
    canonicalFactsPath: "/data/recruitment-facts-2026.json",
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
      const legacy = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}");
      const paid = JSON.parse(localStorage.getItem(ADS_ATTRIBUTION_KEY) || "{}");
      return {
        ...(legacy && typeof legacy === "object" ? legacy : {}),
        ...(paid && typeof paid === "object" ? paid : {}),
      };
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

  function pick(params, stored, ...keys) {
    for (const key of keys) {
      const value = params.get(key) || stored[key];
      if (typeof value === "string" && value.trim()) return value.trim().slice(0, 500);
    }
    return "";
  }

  function enrichApplication(payload) {
    if (!payload || typeof payload !== "object") return payload;
    const stored = readStoredAttribution();
    const params = new URLSearchParams(location.search);
    const term = pick(params, stored, "utm_term") || stored.first_utm_term || "";
    const campaign = pick(params, stored, "utm_campaign");
    const content = pick(params, stored, "utm_content");
    const pageIntent = document.documentElement.dataset.googlePaidIntent || normalizeIntent(`${term} ${campaign} ${content}`);
    const phoneE164 = normalizePhoneE164(payload.phone);

    const fbclid = pick(params, stored, "fbclid");
    const metaCampaignId = pick(params, stored, "fb_campaign_id", "meta_campaign_id", "campaign_id");
    const metaAdsetId = pick(params, stored, "fb_adset_id", "meta_adset_id", "adset_id");
    const metaAdId = pick(params, stored, "fb_ad_id", "meta_ad_id", "ad_id");
    const metaPlacement = pick(params, stored, "fb_placement", "meta_placement", "placement");
    const metaCampaignName = pick(params, stored, "fb_campaign", "meta_campaign", "campaign_name");
    const metaAdsetName = pick(params, stored, "fb_adset", "meta_adset", "adset_name");
    const metaAdName = pick(params, stored, "fb_ad", "meta_ad", "ad_name");
    const metaSiteSource = pick(params, stored, "site_source_name", "fb_source");
    const inferredFacebook = /^(facebook|fb|instagram|ig)$/i.test(String(payload.source || params.get("utm_source") || metaSiteSource || ""));

    return {
      ...payload,
      phone_e164: phoneE164,
      utm_term: term,
      gclid: pick(params, stored, "gclid"),
      gbraid: pick(params, stored, "gbraid"),
      wbraid: pick(params, stored, "wbraid"),
      fbclid,
      meta_campaign_id: metaCampaignId,
      meta_adset_id: metaAdsetId,
      meta_ad_id: metaAdId,
      meta_placement: metaPlacement,
      meta_campaign_name: metaCampaignName,
      meta_adset_name: metaAdsetName,
      meta_ad_name: metaAdName,
      meta_site_source: metaSiteSource,
      first_source: stored.first_utm_source || "",
      first_medium: stored.first_utm_medium || "",
      first_campaign: stored.first_utm_campaign || "",
      first_content: stored.first_utm_content || "",
      first_term: stored.first_utm_term || "",
      first_landing_path: stored.first_landing_path || "",
      paid_search_intent: pageIntent,
      google_ads_import_ready: Boolean(phoneE164 || stored.gclid || stored.gbraid || stored.wbraid || params.get("gclid") || params.get("gbraid") || params.get("wbraid")),
      facebook_ads_import_ready: Boolean(inferredFacebook && (phoneE164 || fbclid || metaAdId || metaCampaignId)),
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
