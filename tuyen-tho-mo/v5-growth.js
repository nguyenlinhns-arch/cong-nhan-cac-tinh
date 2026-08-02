(() => {
  "use strict";

  const STORAGE_KEY = "thaylinh_v5_journey";
  const SESSION_KEY = "thaylinh_v5_session";
  const DISMISS_KEY = "thaylinh_v5_prompt_dismissed";
  const CONDITION_PATH = "/kiem-tra-dieu-kien/";
  const ZALO_URL = "https://zalo.me/0963048585";
  const PHONE_URL = "tel:+84963048585";
  const seenImpressions = new Set();
  const emitted = new Set();

  function track(name, payload = {}) {
    const safe = {
      conversion_version: "v5",
      page_path: location.pathname,
      page_group: document.body?.dataset?.v5Page || document.documentElement.dataset.v5Page || "website",
      ...payload,
    };
    if (typeof window.tlTrack === "function") window.tlTrack(name, safe);
    else {
      window.tlTrackingQueue = window.tlTrackingQueue || [];
      window.tlTrackingQueue.push([name, safe]);
    }
  }

  function safeParse(value, fallback = {}) {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function readJourney() {
    try { return safeParse(localStorage.getItem(STORAGE_KEY) || "{}", {}); }
    catch (_) { return {}; }
  }

  function writeJourney(patch = {}) {
    const current = readJourney();
    const allowed = {
      stage: patch.stage || current.stage || "viewed",
      last_path: String(patch.last_path || current.last_path || location.pathname).slice(0, 160),
      last_action: String(patch.last_action || current.last_action || "view").slice(0, 80),
      eligibility: ["eligible", "review", "unknown"].includes(patch.eligibility) ? patch.eligibility : current.eligibility || "unknown",
      submitted: typeof patch.submitted === "boolean" ? patch.submitted : Boolean(current.submitted),
      first_seen_at: current.first_seen_at || new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      return_count: Number.isFinite(Number(patch.return_count)) ? Math.max(1, Number(patch.return_count)) : Math.max(1, Number(current.return_count) || 1),
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(allowed)); } catch (_) {}
    return allowed;
  }

  function pageType() {
    if (location.pathname === CONDITION_PATH) return "condition";
    if (location.pathname === "/hoc-nghe-mo-tai-quang-ninh/") return "full_information";
    if (location.pathname.startsWith("/viec-lam-nganh-than/")) return "province";
    if (location.pathname.startsWith("/tin-nganh-than/") || location.pathname.startsWith("/bai-viet/")) return "content";
    if (location.pathname === "/") return "home";
    return "core";
  }

  function markSession() {
    let isNewSession = true;
    try {
      isNewSession = sessionStorage.getItem(SESSION_KEY) !== "active";
      sessionStorage.setItem(SESSION_KEY, "active");
    } catch (_) {}
    const current = readJourney();
    const returnCount = Math.max(1, Number(current.return_count) || 1) + (isNewSession && current.first_seen_at ? 1 : 0);
    const updated = writeJourney({ last_path: location.pathname, last_action: "view", return_count: returnCount });
    if (isNewSession && updated.return_count > 1) track("v5_return_visit", { action: "return", step: updated.stage, eligibility: updated.eligibility });
    return updated;
  }

  function channelForLink(link) {
    const href = String(link?.getAttribute?.("href") || "");
    if (link?.dataset?.v5PrimaryCta === "condition" || href.includes("/kiem-tra-dieu-kien") || href === "#dang-ky") return "condition";
    if (link?.dataset?.contact === "zalo" || href.includes("zalo.me")) return "zalo";
    if (link?.dataset?.contact === "messenger" || href.includes("m.me")) return "messenger";
    if (link?.dataset?.contact === "phone" || href.startsWith("tel:")) return "phone";
    return "";
  }

  function contextForLink(link) {
    return String(link?.dataset?.context || link?.closest?.("section,header,footer,nav")?.className || "site").slice(0, 100);
  }

  function markPrimaryLinks() {
    document.querySelectorAll("a[href]").forEach(link => {
      const channel = channelForLink(link);
      if (!channel) return;
      link.dataset.v5PrimaryCta ||= channel;
      link.dataset.v5CtaContext ||= contextForLink(link);
    });
  }

  function observeCtaImpressions() {
    const links = [...document.querySelectorAll("a[data-v5-primary-cta]")];
    if (!links.length || typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
        const link = entry.target;
        const channel = link.dataset.v5PrimaryCta || "unknown";
        const context = link.dataset.v5CtaContext || "site";
        const key = `${channel}:${context}`;
        if (seenImpressions.has(key)) {
          observer.unobserve(link);
          continue;
        }
        seenImpressions.add(key);
        track("cta_impression", { channel, context, action: "view" });
        observer.unobserve(link);
      }
    }, { threshold: [0.5] });
    links.forEach(link => observer.observe(link));
  }

  function observeCtaClicks() {
    document.addEventListener("click", event => {
      const link = event.target.closest?.("a[data-v5-primary-cta]");
      if (!link) return;
      const channel = link.dataset.v5PrimaryCta || "unknown";
      const context = link.dataset.v5CtaContext || "site";
      writeJourney({ last_action: channel, last_path: location.pathname, stage: channel === "condition" ? "condition_intent" : "contact_intent" });
      track("v5_cta_click", { channel, context, action: channel });
    }, { capture: true });
  }

  function exactAge(dateValue) {
    const birth = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const beforeBirthday = today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
    if (beforeBirthday) age -= 1;
    return age;
  }

  function fieldLabel(form, name) {
    const field = form.elements.namedItem(name);
    return field?.closest?.("label") || null;
  }

  function validateFields(fields) {
    for (const field of fields) {
      if (!field || field.disabled) continue;
      if (!field.checkValidity()) {
        field.reportValidity?.();
        field.focus?.({ preventScroll: false });
        return false;
      }
    }
    return true;
  }

  function calculateEligibility(form) {
    const age = exactAge(String(form.elements.namedItem("birth_date")?.value || ""));
    const height = Number(form.elements.namedItem("height")?.value || 0);
    const weight = Number(form.elements.namedItem("weight")?.value || 0);
    const health = String(form.elements.namedItem("health")?.value || "");
    const eligible = age !== null && age >= 18 && age <= 40 && height >= 153 && weight >= 47 && /^Sức khỏe tốt/iu.test(health);
    return eligible ? "eligible" : "review";
  }

  function setWizardStep(form, step, statusBox) {
    form.dataset.v5Step = step;
    form.querySelectorAll("[data-v5-step-indicator]").forEach(node => {
      const active = node.dataset.v5StepIndicator === step;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-current", active ? "step" : "false");
    });
    const next = form.querySelector("[data-v5-next]");
    const back = form.querySelector("[data-v5-back]");
    const submit = form.querySelector("[data-application-submit]");
    if (next) next.hidden = step !== "condition";
    if (back) back.hidden = step !== "contact";
    if (submit) submit.hidden = step !== "contact";
    if (statusBox) statusBox.hidden = step !== "contact" || !statusBox.textContent.trim();
    if (step === "contact") form.querySelector('[name="full_name"]')?.focus?.({ preventScroll: true });
  }

  function setupProgressiveForm() {
    const form = document.querySelector("[data-v4-quick-form], [data-application-form][data-form-context=\"condition_v4\"]");
    if (!form || form.dataset.v5Wizard === "true") return;
    form.dataset.v5Wizard = "true";
    form.dataset.v5Step = "condition";

    const conditionNames = ["birth_date", "height", "weight", "health"];
    const contactNames = ["full_name", "phone", "province", "district"];
    const conditionFields = conditionNames.map(name => form.elements.namedItem(name)).filter(Boolean);
    const contactFields = contactNames.map(name => form.elements.namedItem(name)).filter(Boolean);
    if (conditionFields.length !== conditionNames.length || contactFields.length !== contactNames.length) return;

    conditionNames.forEach(name => fieldLabel(form, name)?.classList.add("v5-condition-field"));
    contactNames.forEach(name => fieldLabel(form, name)?.classList.add("v5-contact-field"));
    form.querySelector(".consent")?.classList.add("v5-contact-field");

    const progress = document.createElement("div");
    progress.className = "v5-wizard-progress";
    progress.setAttribute("aria-label", "Tiến trình đăng ký");
    progress.innerHTML = `<span data-v5-step-indicator="condition" class="is-active" aria-current="step"><b>1</b> Điều kiện</span><i aria-hidden="true"></i><span data-v5-step-indicator="contact" aria-current="false"><b>2</b> Liên hệ</span>`;
    const promise = form.querySelector(".v4-form-promise, .application-draft-note");
    if (promise) promise.before(progress);
    else form.prepend(progress);

    const status = document.createElement("p");
    status.className = "v5-eligibility-preview";
    status.dataset.v5EligibilityPreview = "";
    status.hidden = true;

    const controls = document.createElement("div");
    controls.className = "v5-wizard-controls";
    controls.innerHTML = `<button type="button" class="v5-next" data-v5-next>Kiểm tra sơ bộ và tiếp tục</button><button type="button" class="v5-back" data-v5-back hidden>Quay lại điều kiện</button>`;
    const submit = form.querySelector("[data-application-submit]");
    if (!submit) return;
    submit.before(status, controls);
    controls.append(submit);
    submit.hidden = true;

    let started = false;
    let submitted = false;
    const markStart = () => {
      if (started) return;
      started = true;
      writeJourney({ stage: "condition_started", last_action: "form_start" });
      track("v5_step_view", { step: "condition", action: "start" });
    };
    conditionFields.forEach(field => {
      field.addEventListener("focus", markStart, { once: true });
      field.addEventListener("input", markStart, { passive: true });
    });

    controls.querySelector("[data-v5-next]")?.addEventListener("click", () => {
      markStart();
      if (!validateFields(conditionFields)) {
        track("v5_step_error", { step: "condition", field_group: "eligibility", action: "validation" });
        return;
      }
      const eligibility = calculateEligibility(form);
      status.dataset.state = eligibility;
      status.textContent = eligibility === "eligible"
        ? "Các mốc sơ bộ đã phù hợp. Gửi thông tin liên hệ để Thầy Linh kiểm tra và hướng dẫn hồ sơ."
        : "Có nội dung cần trao đổi thêm. Anh vẫn gửi liên hệ để Thầy Linh kiểm tra trường hợp cụ thể trước khi làm hồ sơ.";
      status.hidden = false;
      writeJourney({ stage: "contact", last_action: "condition_complete", eligibility });
      track("eligibility_preview", { step: "condition", eligibility, action: "complete" });
      track("v5_step_complete", { step: "condition", eligibility, action: "continue" });
      setWizardStep(form, "contact", status);
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    controls.querySelector("[data-v5-back]")?.addEventListener("click", () => {
      writeJourney({ stage: "condition_started", last_action: "back_to_condition" });
      track("v5_step_view", { step: "condition", action: "back" });
      setWizardStep(form, "condition", status);
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    contactFields.forEach(field => field.addEventListener("focus", () => {
      if (emitted.has("contact_step_view")) return;
      emitted.add("contact_step_view");
      track("v5_step_view", { step: "contact", action: "view" });
    }, { once: true }));

    form.addEventListener("submit", () => {
      submitted = true;
      const eligibility = status.dataset.state || "unknown";
      writeJourney({ stage: "submit_attempt", last_action: "submit", eligibility });
      track("v5_submit_attempt", { step: "contact", eligibility, action: "submit" });
    }, { capture: true });

    const delivery = document.querySelector("[data-application-delivery]");
    if (delivery && typeof MutationObserver === "function") {
      const observer = new MutationObserver(() => {
        if (delivery.dataset.state !== "saved" || emitted.has("v5_saved")) return;
        emitted.add("v5_saved");
        submitted = true;
        const eligibility = status.dataset.state || document.querySelector("[data-application-result]")?.dataset?.eligibility || "unknown";
        writeJourney({ stage: "submitted", last_action: "saved", eligibility, submitted: true });
        track("v5_funnel_complete", { step: "submitted", eligibility, action: "saved" });
      });
      observer.observe(delivery, { attributes: true, attributeFilter: ["data-state"], childList: true, subtree: true });
    }

    window.addEventListener("pagehide", () => {
      if (!started || submitted || emitted.has("v5_abandon")) return;
      emitted.add("v5_abandon");
      const step = form.dataset.v5Step || "condition";
      track("v5_form_abandon", { step, action: "pagehide" });
    });

    setWizardStep(form, "condition", status);
  }

  function showReturnPrompt(journey) {
    if (!journey || journey.return_count < 2) return;
    try { if (sessionStorage.getItem(DISMISS_KEY) === "yes") return; } catch (_) {}
    if (document.querySelector("[data-v5-return-prompt]")) return;
    const submitted = Boolean(journey.submitted);
    const prompt = document.createElement("section");
    prompt.className = "v5-return-prompt";
    prompt.dataset.v5ReturnPrompt = "";
    prompt.setAttribute("role", "region");
    prompt.setAttribute("aria-label", "Tiếp tục hành trình đăng ký");
    prompt.innerHTML = submitted
      ? `<div><strong>Thông tin đã được gửi</strong><span>Nhắn Zalo hoặc gọi để xác nhận tư vấn và chuẩn bị hồ sơ.</span></div><div><a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="v5-return">Nhắn Zalo</a><a href="${PHONE_URL}" data-contact="phone" data-context="v5-return">Gọi ngay</a><button type="button" aria-label="Đóng">×</button></div>`
      : `<div><strong>Tiếp tục từ bước anh đang xem</strong><span>Kiểm tra điều kiện trước; đăng ký ban đầu chưa cần gửi giấy tờ.</span></div><div><a href="${CONDITION_PATH}#dang-ky" data-v5-primary-cta="condition" data-context="v5-return">Tiếp tục kiểm tra</a><a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="v5-return">Hỏi Zalo</a><button type="button" aria-label="Đóng">×</button></div>`;
    prompt.querySelector("button")?.addEventListener("click", () => {
      prompt.remove();
      try { sessionStorage.setItem(DISMISS_KEY, "yes"); } catch (_) {}
    });
    const header = document.querySelector("header");
    if (header) header.insertAdjacentElement("afterend", prompt);
    else document.body.prepend(prompt);
    track("v5_return_prompt", { action: submitted ? "submitted" : "continue", step: journey.stage || "viewed", eligibility: journey.eligibility || "unknown" });
  }

  function trackEngagement() {
    window.setTimeout(() => {
      if (document.visibilityState === "visible") track("v5_engaged", { action: "30_seconds", step: "time" });
    }, 30000);
    const reached = new Set();
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const depth = Math.round((scrollY / max) * 100);
      for (const milestone of [50, 90]) {
        if (depth < milestone || reached.has(milestone)) continue;
        reached.add(milestone);
        track("v5_content_depth", { action: "scroll", step: String(milestone) });
      }
      if (reached.size === 2) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function labelMobileBar() {
    const bar = document.querySelector(".v4-mobile-bar");
    if (!bar) return;
    const links = [...bar.querySelectorAll("a")];
    for (const link of links) {
      const channel = channelForLink(link);
      if (channel === "condition") link.textContent = "Kiểm tra";
      if (channel === "zalo") link.textContent = "Nhắn Zalo";
      if (channel === "phone") link.textContent = "Gọi ngay";
    }
  }

  function init() {
    document.documentElement.dataset.growthVersion = "v5";
    document.documentElement.dataset.v5Page = pageType();
    const journey = markSession();
    markPrimaryLinks();
    observeCtaImpressions();
    observeCtaClicks();
    setupProgressiveForm();
    labelMobileBar();
    showReturnPrompt(journey);
    trackEngagement();
    track("v5_view", { action: "view", step: journey.stage || "viewed", eligibility: journey.eligibility || "unknown" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
