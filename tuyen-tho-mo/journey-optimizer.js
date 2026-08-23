(() => {
  "use strict";

  const STORAGE_KEY = "thaylinh_worker_journey_v3";
  const STORAGE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
  const ZALO_URL = "https://zalo.me/0963048585";
  const PHONE_URL = "tel:+84963048585";
  const APPLICATION_URL = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky";
  const CONDITION_URL = "/kiem-tra-dieu-kien/";
  const pageStartedAt = Date.now();
  const emitted = new Set();

  const compactIntent = Object.freeze({
    comparison: "cmp", condition: "cond", province: "prov", benefits: "ben",
    dossier: "doc", safety: "safe", application: "app", story: "story",
    article: "art", home: "home", other: "other",
  });
  const compactAction = Object.freeze({
    click_zalo: "zalo", click_call: "call", click_messenger: "msg",
    open_condition: "cond", open_application: "app", form_start: "form",
    three_info_complete: "info3", condition_pass: "pass", form_submit: "submit",
  });

  function normalize(value = "") {
    return String(value)
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9/_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function safePath(pathname = location.pathname) {
    const path = String(pathname || "/").split("?")[0].split("#")[0];
    return path.startsWith("/") ? path.slice(0, 180) : "/";
  }

  function pageGroup(pathname = location.pathname) {
    const path = safePath(pathname);
    if (path === "/") return "home";
    if (path.startsWith("/viec-lam-nganh-than/")) return "province";
    if (path.startsWith("/viec-lam/")) return "application";
    if (path.startsWith("/tin-nganh-than/") || path.startsWith("/bai-viet/")) return "article";
    if (path.startsWith("/kiem-tra-dieu-kien/")) return "condition";
    if (path.startsWith("/chon-kcn-hay-lam-mo/")) return "comparison";
    if (path.startsWith("/cau-chuyen-cong-nhan/")) return "story";
    if (path.startsWith("/ho-so-nhap-hoc/")) return "dossier";
    if (path.startsWith("/thu-nhap-an-o-ho-tro/")) return "benefits";
    if (path.startsWith("/an-toan-ky-luat-moi-truong/")) return "safety";
    return "other";
  }

  function entryIntent() {
    const params = new URLSearchParams(location.search);
    const campaign = normalize(params.get("utm_campaign"));
    const content = normalize(params.get("utm_content"));
    if (/camp1|kcn|so-sanh/.test(`${campaign}-${content}`)) return "comparison";
    if (/camp2|phong-su|cong-nhan|nghe-an|ha-tinh|quang-tri|quang-ngai|gia-lai|dak-lak/.test(`${campaign}-${content}`)) return "province";
    return pageGroup();
  }

  function readState() {
    try {
      const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const lastSeen = Date.parse(state?.last_seen_at || "");
      if (!state || state.version !== 3 || !Number.isFinite(lastSeen) || Date.now() - lastSeen > STORAGE_TTL_MS || lastSeen > Date.now() + 60_000) return null;
      return state;
    } catch (_) {
      return null;
    }
  }

  function writeState() {
    state.last_seen_at = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    document.documentElement.dataset.journeyStage = state.stage || "view";
  }

  function uniquePush(list, value, limit = 12) {
    if (!value || list.includes(value)) return false;
    list.push(value);
    if (list.length > limit) list.splice(0, list.length - limit);
    return true;
  }

  const attribution = (() => {
    const params = new URLSearchParams(location.search);
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem("thaylinh_attribution") || "{}"); } catch (_) {}
    return {
      source: params.get("utm_source") || stored.utm_source || "",
      medium: params.get("utm_medium") || stored.utm_medium || "",
      campaign: params.get("utm_campaign") || stored.utm_campaign || "",
      content: params.get("utm_content") || stored.utm_content || "",
    };
  })();

  const currentPath = safePath();
  const currentGroup = pageGroup();
  const state = readState() || {
    version: 3,
    started_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    entry_path: currentPath,
    entry_intent: entryIntent(),
    source: attribution.source,
    medium: attribution.medium,
    campaign: attribution.campaign,
    content: attribution.content,
    paths: [],
    groups: [],
    page_count: 0,
    score: 0,
    stage: "view",
    last_action: "view",
    first_action_at: "",
    condition_pass: false,
    form_started: false,
    three_info_complete: false,
  };

  if (uniquePush(state.paths, currentPath)) {
    state.page_count = Number(state.page_count || 0) + 1;
    state.score = Number(state.score || 0) + 2;
  }
  if (uniquePush(state.groups, currentGroup)) {
    if (["comparison", "province", "condition", "benefits", "dossier", "safety", "application"].includes(currentGroup)) state.score += 2;
  }
  writeState();

  function scoreBucket(score = state.score) {
    if (score >= 18) return "priority";
    if (score >= 9) return "hot";
    if (score >= 4) return "researching";
    return "new";
  }

  function secondsSinceStart() {
    const started = Date.parse(state.started_at || "");
    return Number.isFinite(started) ? Math.max(0, Math.round((Date.now() - started) / 1000)) : 0;
  }

  function track(name, payload = {}) {
    const event = {
      page_path: currentPath,
      page_group: currentGroup,
      entry_intent: state.entry_intent,
      journey_stage: state.stage,
      journey_score_bucket: scoreBucket(),
      page_count: Number(state.page_count || 0),
      journey_score: Number(state.score || 0),
      seconds_to_action: secondsSinceStart(),
      ...payload,
    };
    if (typeof window.tlTrack === "function") window.tlTrack(name, event);
    else {
      window.tlTrackingQueue = window.tlTrackingQueue || [];
      window.tlTrackingQueue.push([name, event]);
    }
  }

  function mark(action, points = 0, stage = "") {
    const key = `${action}:${currentPath}`;
    if (points && !emitted.has(key)) {
      emitted.add(key);
      state.score += points;
    }
    state.last_action = action;
    if (!state.first_action_at && action !== "view") state.first_action_at = new Date().toISOString();
    if (stage) state.stage = stage;
    writeState();
  }

  function entrySlug() {
    const segments = safePath(state.entry_path).split("/").filter(Boolean);
    return normalize(segments.at(-1) || "home").slice(0, 20);
  }

  function crmContext() {
    const groups = state.groups.map(group => compactIntent[group] || group.slice(0, 4)).join(",").slice(0, 24);
    const value = [
      "v3",
      `i=${compactIntent[state.entry_intent] || "other"}`,
      `e=${entrySlug()}`,
      `p=${groups}`,
      `a=${compactAction[state.last_action] || normalize(state.last_action).slice(0, 8)}`,
      `n=${Number(state.page_count || 0)}`,
      `s=${Number(state.score || 0)}`,
      `t=${secondsSinceStart()}`,
    ].join(";");
    return value.slice(0, 76);
  }

  function context() {
    return Object.freeze({
      schema_version: 3,
      entry_page: safePath(state.entry_path),
      entry_intent: state.entry_intent,
      journey_pages: state.groups.join(",").slice(0, 120),
      journey_page_count: Number(state.page_count || 0),
      last_web_action: state.last_action,
      seconds_to_action: secondsSinceStart(),
      journey_score: Number(state.score || 0),
      journey_score_bucket: scoreBucket(),
      three_info_complete: Boolean(state.three_info_complete),
      crm_context: crmContext(),
    });
  }

  window.ThayLinhJourney = Object.freeze({ context, mark: (action, points, stage) => mark(action, points, stage) });

  const intentConfig = Object.freeze({
    comparison: {
      facts: ["Nam 18–40 tuổi, sức khỏe phù hợp nghề hầm lò", "Học nghề theo chỉ tiêu, có ăn ở và hỗ trợ", "Sau đào tạo làm việc tại các đơn vị ngành Than ở Quảng Ninh"],
      message: "So sánh xong, hãy kiểm tra điều kiện trước khi quyết định đi xa học nghề.",
    },
    condition: {
      facts: ["Nam từ 18 đến 40 tuổi", "Cao từ 1m53, nặng từ 47kg", "Khám tuyển là căn cứ xác nhận cuối cùng"],
      message: "Công cụ chỉ sàng lọc sơ bộ và không lưu câu trả lời sức khỏe.",
    },
    province: {
      facts: ["Học tại Quang Hanh, Quảng Ninh", "Được bố trí ăn ở và hỗ trợ trong thời gian học", "Sau đào tạo làm việc tại doanh nghiệp ngành Than ở Quảng Ninh"],
      message: "Thầy Linh trực tiếp kiểm tra điều kiện và hướng dẫn hồ sơ cho lao động theo tỉnh.",
    },
    benefits: {
      facts: ["20–25 triệu/tháng khi hoàn thành định mức lao động", "Ăn 3 bữa/ngày và ở ký túc xá khi học", "Hỗ trợ 7,5 triệu đồng/tháng trong thời gian học"],
      message: "Hỏi trực tiếp để xác nhận nghề, lịch học và đợt tiếp nhận phù hợp.",
    },
    dossier: {
      facts: ["CCCD bản gốc", "Giấy khai sinh", "Bằng THCS hoặc THPT nếu có; chưa có vẫn đăng ký trước"],
      message: "Đăng ký ban đầu chưa cần gửi ảnh giấy tờ hay đi lại.",
    },
    safety: {
      facts: ["Được học an toàn trước khi vào sản xuất", "Bảo hộ và quy trình là bắt buộc", "Làm việc theo ca và phối hợp tổ đội"],
      message: "Nghề mỏ cần thể lực, kỷ luật và tinh thần làm việc cùng tổ đội.",
    },
    application: {
      facts: ["Điền trong khoảng 1 phút", "Đăng ký ban đầu chưa cần nộp hồ sơ", "Nhận kết quả sơ bộ và mã đăng ký ngay"],
      message: "Thầy Linh trực tiếp kiểm tra điều kiện và hướng dẫn bước tiếp theo.",
    },
    article: {
      facts: ["Đọc nguồn và dữ kiện chính", "Xem điều kiện đang tuyển", "Gửi năm sinh – cao/nặng – sức khỏe để được kiểm tra"],
      message: "Tin ngành giúp kiểm chứng; bước tiếp theo vẫn là kiểm tra điều kiện cá nhân.",
    },
    home: {
      facts: ["Nam 18–40 tuổi", "Học nghề 2–3 tháng với nghề chính", "20–25 triệu/tháng khi hoàn thành định mức lao động"],
      message: "Thầy Linh trực tiếp kiểm tra điều kiện và hướng dẫn hồ sơ.",
    },
  });

  function visibleHero() {
    return document.querySelector(".verification-page__hero .container, .job-hero__copy, .local-hero__copy, .hero-copy, .article-hero .hero-inner, .article-header, main > header");
  }

  function ensureFastFacts() {
    // The homepage and article templates already present their verified facts.
    // Repeating them in the hero adds height without helping the next decision.
    if (["home", "article"].includes(currentGroup)) return;
    const host = visibleHero();
    const config = intentConfig[currentGroup] || intentConfig[state.entry_intent] || intentConfig.article;
    if (!host || !config) return;
    const existingFacts = host.querySelector(".journey-fast-facts, .job-hero__facts, .location-clarity");
    if (!existingFacts) {
      const facts = document.createElement("div");
      facts.className = "journey-fast-facts";
      facts.setAttribute("aria-label", "Ba thông tin nhanh");
      facts.innerHTML = config.facts.map(item => `<span>${item}</span>`).join("");
      const actions = host.querySelector(".verification-page__actions, .button-row, .contact-pair");
      if (actions) actions.before(facts);
      else host.append(facts);
    }
    if (!host.querySelector(".journey-assurance")) {
      const assurance = document.createElement("p");
      assurance.className = "journey-assurance";
      assurance.textContent = config.message;
      host.append(assurance);
    }
  }

  function conditionHref() {
    if (currentPath === "/") return "/#tu-kiem-tra";
    if (currentGroup === "condition") return "#kiem-tra";
    return CONDITION_URL;
  }

  function applicationHref() {
    const url = new URL(APPLICATION_URL, location.origin);
    const province = document.documentElement.dataset.province || new URLSearchParams(location.search).get("province");
    if (province) url.searchParams.set("province", province);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  function normalizeHeroActions() {
    const host = visibleHero();
    if (!host) return;
    const actions = host.querySelector(".verification-page__actions, .contact-pair, .button-row");
    if (!actions) return;

    const messenger = actions.querySelector('a[data-contact="messenger"]');
    if (messenger) {
      messenger.href = ZALO_URL;
      messenger.dataset.contact = "zalo";
      messenger.dataset.context = `${messenger.dataset.context || "hero"}-zalo`;
      messenger.querySelector("small")?.replaceChildren("Nhắn trực tiếp");
      messenger.querySelector("strong")?.replaceChildren("Zalo Thầy Linh");
      if (!messenger.querySelector("strong")) messenger.textContent = "Nhắn Zalo";
    }

    if (currentGroup === "home" && !actions.querySelector('a[href*="kiem-tra"],a[href*="tu-kiem-tra"]')) {
      const check = document.createElement("a");
      check.className = "button";
      check.href = conditionHref();
      check.dataset.journeyAction = "condition";
      check.textContent = "Kiểm tra điều kiện";
      actions.prepend(check);
    }

    // The homepage keeps two deliberate first-screen decisions. Calling stays
    // available in the fixed contact bar and the final consultation section.
    if (currentGroup !== "home" && !actions.querySelector('a[href^="tel:"]')) {
      const call = document.createElement("a");
      call.className = "journey-third-action";
      call.href = PHONE_URL;
      call.dataset.contact = "phone";
      call.dataset.context = `${currentGroup}-hero`;
      call.innerHTML = actions.classList.contains("contact-pair")
        ? "<span><small>Cần trao đổi ngay</small><strong>Gọi Thầy Linh</strong></span>"
        : "Gọi Thầy Linh";
      actions.append(call);
    }

    const links = [...actions.querySelectorAll("a")];
    if (links.length > 3) {
      links.filter(link => link.dataset.contact === "messenger").forEach(link => link.remove());
    }
  }

  function createShortNav() {
    if (document.querySelector(".journey-short-nav")) return;
    const header = document.querySelector("header.site-header, .site-header");
    if (!header) return;
    const nav = document.createElement("nav");
    nav.className = "journey-short-nav";
    nav.setAttribute("aria-label", "Thông tin nhanh");
    nav.innerHTML = `<div class="journey-short-nav__inner"><a href="${conditionHref()}">Điều kiện</a><a href="/ho-so-nhap-hoc/">Hồ sơ</a><a href="/thu-nhap-an-o-ho-tro/">Thu nhập</a><a href="/cau-chuyen-cong-nhan/">Câu chuyện theo tỉnh</a><a href="${applicationHref()}">Đăng ký</a></div>`;
    header.insertAdjacentElement("afterend", nav);
  }

  function createInlineCta() {
    if (!["article", "story", "safety", "benefits", "dossier", "comparison"].includes(currentGroup)) return;
    const article = document.querySelector("article, .article-body, .content-body, main");
    if (!article || article.querySelector(".journey-inline-cta")) return;
    const paragraphs = [...article.querySelectorAll("p")].filter(p => p.textContent.trim().length > 70);
    const anchor = paragraphs[2] || paragraphs.at(-1);
    if (!anchor) return;
    const box = document.createElement("aside");
    box.className = "journey-inline-cta";
    box.innerHTML = `<small>Bước tiếp theo</small><strong>Biết mình có phù hợp trước khi chuẩn bị hồ sơ</strong><p>Gửi năm sinh, chiều cao/cân nặng và tình trạng sức khỏe để Thầy Linh kiểm tra điều kiện trước.</p><div class="journey-send-three"><b>3 thông tin cần gửi</b>Năm sinh · Chiều cao/cân nặng · Sức khỏe mắt, huyết áp, tim mạch.</div><div class="journey-inline-cta__actions"><a href="${conditionHref()}" data-journey-action="condition">Kiểm tra điều kiện</a><a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="article-inline">Nhắn Zalo</a><a href="${PHONE_URL}" data-contact="phone" data-context="article-inline">Gọi điện</a></div>`;
    anchor.insertAdjacentElement("afterend", box);
  }

  function createFormProgress() {
    const form = document.querySelector("[data-application-form]");
    if (!form || form.querySelector(".journey-form-progress")) return;
    const progress = document.createElement("div");
    progress.className = "journey-form-progress";
    progress.innerHTML = '<b data-journey-form-label>Bắt đầu · 0%</b><small>Chưa cần ảnh hồ sơ</small><div class="journey-form-progress__bar"><span data-journey-form-bar></span></div>';
    form.prepend(progress);
    const requiredNames = ["full_name", "phone", "birth_date", "province", "height", "weight", "education", "trade", "health", "consent"];
    const importantNames = ["birth_date", "height", "weight", "health"];
    let formStartSent = Boolean(state.form_started);
    let infoSent = Boolean(state.three_info_complete);

    const update = event => {
      const completed = requiredNames.filter(name => {
        const field = form.elements.namedItem(name);
        if (!field) return false;
        if (typeof RadioNodeList !== "undefined" && field instanceof RadioNodeList) return Boolean(field.value);
        if (field.type === "checkbox") return field.checked;
        return Boolean(String(field.value || "").trim());
      }).length;
      const percent = Math.min(100, Math.round(completed / requiredNames.length * 100));
      progress.querySelector("[data-journey-form-bar]").style.width = `${percent}%`;
      progress.querySelector("[data-journey-form-label]").textContent = percent >= 100 ? "Sẵn sàng gửi · 100%" : `Đã điền ${completed}/${requiredNames.length} mục · ${percent}%`;

      if (!formStartSent && event?.type) {
        formStartSent = true;
        state.form_started = true;
        mark("form_start", 5, "form_start");
        track("form_start", { action: "form_started", context: form.dataset.formContext || "central_application" });
      }
      const importantComplete = importantNames.every(name => Boolean(String(form.elements.namedItem(name)?.value || "").trim()));
      if (importantComplete && !infoSent) {
        infoSent = true;
        state.three_info_complete = true;
        mark("three_info_complete", 5, "info_complete");
        track("three_info_complete", { action: "three_required_information_groups_complete" });
      }
      writeState();
    };
    form.addEventListener("input", update, { passive: true });
    form.addEventListener("change", update, { passive: true });
    form.addEventListener("submit", () => {
      mark("form_submit", 10, "form_submit");
      writeState();
    }, { capture: true });
    update();
  }

  function detectChannel(link) {
    const declared = String(link?.dataset?.contact || "").toLowerCase();
    if (["zalo", "phone", "messenger", "application"].includes(declared)) return declared;
    const href = String(link?.getAttribute?.("href") || "").toLowerCase();
    if (href.includes("zalo.me")) return "zalo";
    if (href.startsWith("tel:")) return "phone";
    if (href.includes("m.me/")) return "messenger";
    if (href.includes("#dang-ky") || href.includes("/viec-lam/")) return "application";
    return "";
  }

  document.addEventListener("click", event => {
    const link = event.target.closest?.("a");
    if (!link) return;
    const channel = detectChannel(link);
    let action = "";
    let points = 0;
    let stage = "";
    if (channel === "zalo") { action = "click_zalo"; points = 3; stage = "contact"; }
    else if (channel === "phone") { action = "click_call"; points = 4; stage = "contact"; }
    else if (channel === "messenger") { action = "click_messenger"; points = 3; stage = "contact"; }
    else if (channel === "application") { action = "open_application"; points = 4; stage = "application"; }
    else if (link.dataset.journeyAction === "condition" || /kiem-tra-dieu-kien|tu-kiem-tra/.test(link.href)) { action = "open_condition"; points = 2; stage = "condition"; }
    if (!action) return;
    mark(action, points, stage);
    track("journey_action", {
      action,
      channel: channel || "condition",
      context: link.dataset.context || link.dataset.journeyAction || "site_link",
      time_bucket: secondsSinceStart() <= 30 ? "0_30s" : secondsSinceStart() <= 90 ? "31_90s" : "over_90s",
    });
  }, { capture: true });

  function observeDataLayer() {
    window.dataLayer = window.dataLayer || [];
    const inspect = item => {
      if (!item || Object.prototype.toString.call(item) !== "[object Object]") return;
      if (item.event === "condition_pass" && !state.condition_pass) {
        state.condition_pass = true;
        mark("condition_pass", 10, "condition_pass");
        track("journey_stage", { action: "condition_pass", eligibility: "eligible" });
      }
      if ((item.event === "ApplicationSubmit" || item.event === "form_submit") && state.stage !== "form_submit") {
        mark("form_submit", 10, "form_submit");
      }
    };
    window.dataLayer.slice().forEach(inspect);
    const previousPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function (...items) {
      const result = previousPush(...items);
      items.forEach(inspect);
      return result;
    };
  }

  function engagementSignals() {
    window.setTimeout(() => {
      if (!emitted.has("engaged_30s")) {
        emitted.add("engaged_30s");
        track("engaged_30s", { action: "engaged_30_seconds" });
      }
    }, 30_000);
    let maximumDepth = 0;
    const updateDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = Math.min(100, Math.round(window.scrollY / scrollable * 100));
      maximumDepth = Math.max(maximumDepth, depth);
      for (const threshold of [50, 75]) {
        const key = `scroll_${threshold}`;
        if (maximumDepth >= threshold && !emitted.has(key)) {
          emitted.add(key);
          track("content_depth", { action: key, scroll_depth: threshold });
        }
      }
    };
    window.addEventListener("scroll", updateDepth, { passive: true });
  }

  function init() {
    ensureFastFacts();
    normalizeHeroActions();
    createShortNav();
    createInlineCta();
    createFormProgress();
    observeDataLayer();
    engagementSignals();
    track("journey_view", {
      action: "page_view",
      entry_page: safePath(state.entry_path),
      page_sequence: state.groups.join(",").slice(0, 120),
      source: state.source,
      medium: state.medium,
      campaign: state.campaign,
      content: state.content,
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
