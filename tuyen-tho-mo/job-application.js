(() => {
  "use strict";

  const form = document.querySelector("[data-application-form]");
  if (!form) return;

  const result = document.querySelector("[data-application-result]");
  const output = document.querySelector("[data-application-message]");
  const error = document.querySelector("[data-form-error]");
  const birthDate = document.querySelector("[data-birth-date]");
  const phoneInput = form.elements.namedItem("phone");
  const statusOutput = document.querySelector("[data-application-status]");
  const codeOutput = document.querySelector("[data-application-code]");
  const smsLink = document.querySelector("[data-sms-application]");
  const submitButton = document.querySelector("[data-application-submit]");
  const deliveryOutput = document.querySelector("[data-application-delivery]");
  const draftStatus = document.querySelector("[data-application-draft-status]");
  const params = new URLSearchParams(location.search);
  const recruitment = window.THAY_LINH_RECRUITMENT || {};
  const criteria = recruitment.criteria || {};
  const formContext = form.dataset.formContext || "central_application";
  const today = new Date();
  let started = false;
  let submitted = false;
  let deliveryInFlight = false;
  let conditionPassTracked = false;
  let retryState = null;
  const DRAFT_KEY = "thaylinh_application_draft_v1";
  const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
  const DRAFT_FIELDS = ["province", "district", "height", "weight", "education", "trade"];
  // V4 visible draft core: const DRAFT_FIELDS = ["province", "district", "height", "weight"]
  const progressSeen = new Set();
  const progressSteps = Object.freeze({
    full_name: "01_identity",
    phone: "02_contact",
    birth_date: "03_age",
    province: "04_location",
    height: "05_physical",
    weight: "05_physical",
    education: "06_education",
    trade: "07_trade",
    health: "08_health",
    consent: "09_consent",
  });

  function isoDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  birthDate.min = "1950-01-01";
  birthDate.max = isoDate(today);

  function calculateAge(value) {
    const born = new Date(`${value}T00:00:00`);
    if (Number.isNaN(born.getTime())) return null;
    let age = today.getFullYear() - born.getFullYear();
    const month = today.getMonth() - born.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < born.getDate())) age -= 1;
    return age;
  }

  function normalizePhone(value) {
    let digits = String(value || "").replace(/\D/g, "");
    if (digits.startsWith("84")) digits = `0${digits.slice(2)}`;
    return /^0[35789]\d{8}$/.test(digits) ? digits : "";
  }

  function createApplicationCode() {
    const date = isoDate(today).slice(2).replace(/-/g, "");
    const bytes = new Uint8Array(4);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
    else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
    const suffix = [...bytes]
      .map(value => value.toString(36).toUpperCase().padStart(2, "0"))
      .join("")
      .slice(0, 5);
    return `TL-${date}-${suffix}`;
  }

  function readAttribution() {
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem("thaylinh_attribution") || "{}"); } catch (_) {}
    let referrer = "";
    try { referrer = document.referrer ? new URL(document.referrer).hostname : ""; } catch (_) {}
    const inferredSource = /(^|\.)(?:chatgpt\.com|openai\.com)$/i.test(referrer)
      ? "chatgpt"
      : /(^|\.)(?:copilot\.microsoft\.com|microsoftcopilot\.com)$/i.test(referrer)
        ? "copilot"
        : /(^|\.)perplexity\.ai$/i.test(referrer)
          ? "perplexity"
          : /(^|\.)gemini\.google\.com$/i.test(referrer)
            ? "gemini"
            : /(^|\.)claude\.ai$/i.test(referrer)
              ? "claude"
              : /(^|\.)google\./i.test(referrer)
                ? "google"
                : /(^|\.)facebook\.com$|(^|\.)fb\.com$/i.test(referrer)
                  ? "facebook"
                  : /(^|\.)tiktok\.com$/i.test(referrer)
                    ? "tiktok"
                    : "website";
    return {
      source: stored.utm_source || params.get("utm_source") || params.get("source") || inferredSource,
      medium: stored.utm_medium || params.get("utm_medium") || (inferredSource === "website" ? "owned" : "referral"),
      campaign: stored.utm_campaign || params.get("utm_campaign") || "tuyen_tho_mo_2026",
      content: stored.utm_content || params.get("utm_content") || "application_form",
      internal_campaign: params.get("tl_internal_campaign") || (params.get("utm_source") === "website" ? params.get("utm_campaign") : "") || "",
      internal_content: params.get("tl_internal_content") || (params.get("utm_source") === "website" ? params.get("utm_content") : "") || "",
    };
  }

  function readJourneyContext() {
    try {
      const value = window.ThayLinhJourney?.context?.();
      if (value && typeof value === "object") return value;
    } catch (_) {}
    return {
      schema_version: 3,
      entry_page: location.pathname,
      entry_intent: "application",
      journey_pages: "application",
      journey_page_count: 1,
      last_web_action: "form_start",
      seconds_to_action: 0,
      journey_score: 0,
      journey_score_bucket: "new",
      three_info_complete: false,
      crm_context: "v3;i=app;e=app;p=app;a=form;n=1;s=0;t=0",
    };
  }

  function track(name, payload) {
    if (typeof window.tlTrack === "function") window.tlTrack(name, payload);
    else {
      window.tlTrackingQueue = window.tlTrackingQueue || [];
      window.tlTrackingQueue.push([name, payload]);
    }
  }

  function fieldGroup(field) {
    return progressSteps[String(field?.name || "")] || "required_field";
  }

  function trackProgress(field) {
    const step = fieldGroup(field);
    if (step === "required_field" || progressSeen.has(step)) return;
    progressSeen.add(step);
    track("ApplicationProgress", {
      action: "step_reached",
      context: formContext,
      step,
      field_group: step.replace(/^\d+_/, ""),
    });
  }

  function prefillSelect(name, value) {
    if (!value) return;
    const select = form.elements.namedItem(name);
    if (!select) return;
    const normalize = input => input
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/^thanh pho\s+/, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const expected = normalize(value);
    const option = [...select.options].find(item => normalize(item.value) === expected);
    if (option) select.value = option.value;
  }

  function assess(values, age) {
    const ageMin = Number(criteria.ageMin) || 18;
    const ageMax = Number(criteria.ageMax) || 40;
    const heightMinCm = Number(criteria.heightMinCm) || 153;
    const weightMinKg = Number(criteria.weightMinKg) || 47;
    if (age === null || age < ageMin || age > ageMax || Number(values.height) < heightMinCm || Number(values.weight) < weightMinKg) {
      return {
        key: "not_eligible",
        label: "Chưa phù hợp điều kiện sơ bộ",
        guidance: "Anh chưa phù hợp ít nhất một mốc tuổi hoặc thể hình của đợt tuyển hiện tại. Vẫn có thể gửi tin nhắn để được kiểm tra lại.",
      };
    }
    if (values.health !== "Sức khỏe tốt, sẵn sàng khám tuyển") {
      return {
        key: "needs_review",
        label: "Cần trao đổi thêm trước khi khám tuyển",
        guidance: "Thầy Linh sẽ trao đổi riêng và hướng dẫn bước đánh giá sức khỏe phù hợp. Không gửi thông tin bệnh chi tiết qua website.",
      };
    }
    return {
      key: "eligible",
      label: "Đủ điều kiện sơ bộ",
      guidance: "Kết quả này chưa thay thế khám tuyển. Hãy gửi mã đăng ký và nội dung bên dưới để được xác nhận lịch tiếp theo.",
    };
  }

  async function deliverApplication(payload) {
    const endpoint = String(recruitment.endpoint || "").trim();
    if (!endpoint) return { saved: false, reason: "not_configured" };
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timer = controller ? window.setTimeout(() => controller.abort(), Number(recruitment.timeoutMs) || 12000) : null;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
        redirect: "follow",
        signal: controller?.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const reply = await response.json();
      if (!reply?.ok || reply.code !== payload.code) throw new Error("Invalid response");
      return { saved: true };
    } catch (_) {
      return { saved: false, reason: "delivery_failed" };
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  function submissionFingerprint(values, phone) {
    return JSON.stringify({
      full_name: String(values.full_name).trim(),
      phone,
      birth_date: values.birth_date,
      province: [values.province, values.district].filter(Boolean).join(" - "),
      district: String(values.district || "").trim(),
      height: String(values.height),
      weight: String(values.weight),
      education: values.education,
      trade: values.trade,
      health: values.health,
      consent: values.consent === "on",
    });
  }

  function revealResult() {
    const firstReveal = result.hidden;
    result.hidden = false;
    if (!firstReveal) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    result.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    result.focus({ preventScroll: true });
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
  }

  function saveDraft() {
    const values = {};
    for (const name of DRAFT_FIELDS) {
      const field = form.elements.namedItem(name);
      if (field?.value) values[name] = String(field.value);
    }
    try {
      if (!Object.keys(values).length) clearDraft();
      else localStorage.setItem(DRAFT_KEY, JSON.stringify({ saved_at: new Date().toISOString(), values }));
    } catch (_) {}
  }

  function restoreDraft() {
    try {
      const stored = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      const savedAt = Date.parse(stored?.saved_at || "");
      if (!stored?.values || !Number.isFinite(savedAt) || Date.now() - savedAt > DRAFT_TTL_MS || savedAt > Date.now() + 60_000) {
        clearDraft();
        return 0;
      }
      let restored = 0;
      for (const name of DRAFT_FIELDS) {
        const field = form.elements.namedItem(name);
        const value = String(stored.values[name] || "");
        if (!field || field.value || !value) continue;
        if (field.options && ![...field.options].some(option => option.value === value)) continue;
        field.value = value;
        restored += 1;
      }
      return restored;
    } catch (_) {
      clearDraft();
      return 0;
    }
  }

  const restoredDraftFields = restoreDraft();
  prefillSelect("province", params.get("province"));
  prefillSelect("trade", params.get("trade") || form.dataset.defaultTrade);
  if (restoredDraftFields && draftStatus) {
    draftStatus.dataset.restored = "true";
    draftStatus.textContent = `Đã khôi phục ${restoredDraftFields} mục không nhạy cảm từ lần điền gần nhất. Bản nháp tự hết hạn sau 24 giờ.`;
    track("ApplicationDraftRestore", { action: "draft_restored", context: formContext, fields: restoredDraftFields });
  }

  const prefilledContext = [];
  for (const [name, label] of [["province", "tỉnh/thành"], ["trade", "nghề"]]) {
    const requested = params.get(name);
    const field = form.elements.namedItem(name);
    if (requested && field?.value) prefilledContext.push(`${label} ${field.value}`);
  }
  if (prefilledContext.length && draftStatus) {
    draftStatus.dataset.contextPrefilled = "true";
    draftStatus.textContent = `Đã chọn sẵn ${prefilledContext.join(" và ")} từ trang bạn vừa xem. Bạn có thể đổi nếu cần. ${draftStatus.textContent}`;
    track("ApplicationContextPrefill", { action: "context_prefilled", context: formContext, fields: prefilledContext.length });
  }

  form.addEventListener("input", event => {
    if (!started) {
      started = true;
      track("ApplicationStart", { action: "form_started", context: formContext });
    }
    trackProgress(event?.target);
    if (event?.target?.name === "phone") {
      phoneInput?.removeAttribute("aria-invalid");
      error.hidden = true;
    }
    if (retryState && !deliveryInFlight) {
      retryState = null;
      result.hidden = true;
      if (submitButton) submitButton.textContent = "Gửi đăng ký và kiểm tra điều kiện";
    }
  });

  form.addEventListener("change", event => {
    if (DRAFT_FIELDS.includes(event?.target?.name)) saveDraft();
  });

  form.addEventListener("focusin", event => trackProgress(event?.target));

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitted || deliveryInFlight) return;
    error.hidden = true;
    phoneInput?.removeAttribute("aria-invalid");
    if (!form.reportValidity()) {
      const invalidField = form.querySelector?.(":invalid");
      const step = fieldGroup(invalidField);
      track("ApplicationValidationError", {
        action: "native_validation",
        context: formContext,
        step,
        field_group: step.replace(/^\d+_/, ""),
      });
      return;
    }

    const values = Object.fromEntries(new FormData(form).entries());
    const phone = normalizePhone(values.phone);
    if (!phone) {
      error.textContent = "Vui lòng nhập đúng số điện thoại di động Việt Nam gồm 10 chữ số.";
      error.hidden = false;
      phoneInput?.setAttribute("aria-invalid", "true");
      phoneInput?.focus();
      track("ApplicationValidationError", {
        action: "invalid_phone",
        context: formContext,
        step: "02_contact",
        field_group: "contact",
      });
      return;
    }

    const age = calculateAge(values.birth_date);
    const assessment = assess(values, age);
    const fingerprint = submissionFingerprint(values, phone);
    const previousAttempt = retryState?.fingerprint === fingerprint ? retryState : null;
    const applicationCode = previousAttempt?.application.code || createApplicationCode();
    const source = readAttribution();
    if (assessment.key === "eligible" && !conditionPassTracked) {
      conditionPassTracked = true;
      const passJourney = readJourneyContext();
      track("condition_pass", {
        action: "application_condition_pass",
        context: formContext,
        eligibility: "eligible",
        entry_intent: passJourney.entry_intent,
        journey_stage: "condition_pass",
        journey_score_bucket: passJourney.journey_score_bucket,
        journey_score: passJourney.journey_score,
        page_count: passJourney.journey_page_count,
        seconds_to_action: passJourney.seconds_to_action,
        lead_key: applicationCode,
      });
    }
    const message = [
      "ĐĂNG KÝ TUYỂN LAO ĐỘNG HỌC NGHỀ MỎ 2026",
      `- Mã đăng ký: ${applicationCode}`,
      `- Họ và tên: ${String(values.full_name).trim()}`,
      `- Số điện thoại: ${phone}`,
      `- Ngày sinh / tuổi: ${values.birth_date} / ${age ?? "chưa xác định"}`,
      `- Tỉnh/huyện: ${[values.province, values.district].filter(Boolean).join(" - ")}`,
      `- Chiều cao / cân nặng: ${values.height} cm / ${values.weight} kg`,
      `- Trình độ: ${values.education}`,
      `- Nghề quan tâm: ${values.trade}`,
      `- Sức khỏe sơ bộ: ${values.health}`,
      `- Kết quả tự kiểm tra: ${assessment.label}`,
      `- Nguồn: ${source.source} / ${source.content}`,
      "- Thời gian học đã tìm hiểu: 2–3 tháng; hỗ trợ trong thời gian học: 7,5 triệu đồng",
      "Nhờ anh Nguyễn Tử Linh kiểm tra điều kiện và hướng dẫn bước tiếp theo.",
    ].join("\n");

    const journey = readJourneyContext();
    const application = {
      schema_version: Number(recruitment.schemaVersion) || 2,
      code: applicationCode,
      created_at: previousAttempt?.application.created_at || new Date().toISOString(),
      full_name: String(values.full_name).trim(),
      phone,
      birth_date: values.birth_date,
      age,
      province: [values.province, values.district].filter(Boolean).join(" - "),
      district: String(values.district || "").trim(),
      height_cm: Number(values.height),
      weight_kg: Number(values.weight),
      education: values.education,
      trade: values.trade,
      health_screen: values.health,
      eligibility: assessment.key,
      source: source.source,
      medium: source.medium,
      campaign: source.campaign,
      content: source.content,
      internal_campaign: source.internal_campaign,
      internal_content: source.internal_content,
      measurement_client_id: window.thayLinhAnalytics?.measurementId?.() || "",
      page_url: location.href,
      form_context: [formContext, journey.crm_context].filter(Boolean).join("|").slice(0, 100),
      entry_page: journey.entry_page,
      entry_intent: journey.entry_intent,
      journey_pages: journey.journey_pages,
      journey_page_count: journey.journey_page_count,
      last_web_action: journey.last_web_action,
      seconds_to_action: journey.seconds_to_action,
      journey_score: journey.journey_score,
      journey_score_bucket: journey.journey_score_bucket,
      three_info_complete: journey.three_info_complete,
      website: String(values.website || ""),
      consent: values.consent === "on",
    };
    const attempt = {
      fingerprint,
      application,
      message,
      leadTracked: previousAttempt?.leadTracked || false,
    };
    retryState = attempt;
    saveDraft();

    output.value = message;
    statusOutput.dataset.status = assessment.key;
    statusOutput.textContent = assessment.label;
    statusOutput.title = assessment.guidance;
    codeOutput.textContent = applicationCode;
    result.dataset.eligibility = assessment.key;
    if (smsLink) smsLink.href = `sms:+84963048585?body=${encodeURIComponent(message)}`;
    if (deliveryOutput) {
      deliveryOutput.dataset.state = "pending";
      deliveryOutput.textContent = previousAttempt
        ? "Đang thử chuyển lại mã đăng ký này đến bộ phận tư vấn…"
        : "Đã tạo mã đăng ký. Đang chuyển thông tin đến bộ phận tư vấn…";
    }
    deliveryInFlight = true;
    form.setAttribute("aria-busy", "true");
    result.setAttribute("aria-busy", "true");
    revealResult();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = previousAttempt ? "Đang thử gửi lại…" : "Đang gửi đăng ký…";
    }
    track("ApplicationSubmit", {
      action: previousAttempt ? "application_retry" : "application_submitted",
      context: formContext,
      eligibility: assessment.key,
      source: source.source,
      medium: source.medium,
      campaign: source.campaign,
      content: source.content,
      entry_intent: journey.entry_intent,
      journey_stage: "form_submit",
      journey_score_bucket: journey.journey_score_bucket,
      journey_score: journey.journey_score,
      page_count: journey.journey_page_count,
      seconds_to_action: journey.seconds_to_action,
      lead_key: applicationCode,
    });
    const delivery = await deliverApplication(application);
    deliveryInFlight = false;
    form.removeAttribute("aria-busy");
    result.removeAttribute("aria-busy");
    if (deliveryOutput) {
      deliveryOutput.dataset.state = delivery.saved ? "saved" : "fallback";
      deliveryOutput.textContent = delivery.saved
        ? "Thầy Linh đã nhận thông tin. Anh giữ điện thoại/Zalo; bộ phận tư vấn sẽ kiểm tra điều kiện và hướng dẫn hồ sơ, nơi học, thời gian nhập học."
        : "Chưa chuyển tự động được. Mã đăng ký được giữ nguyên; hãy thử gửi lại hoặc mở Zalo, Messenger, SMS bên dưới.";
    }
    if (submitButton) {
      submitted = delivery.saved;
      submitButton.disabled = delivery.saved;
      submitButton.textContent = delivery.saved ? "Đăng ký đã được tiếp nhận" : "Thử gửi lại cùng mã";
    }

    try {
      localStorage.setItem("thaylinh_last_application", JSON.stringify({
        code: applicationCode,
        created_at: application.created_at,
        eligibility: assessment.key,
        source: source.source,
      }));
    } catch (_) {}

    if (!attempt.leadTracked) {
      track("Lead", {
        action: delivery.saved ? "application_saved" : "application_message_created",
        context: formContext,
        eligibility: assessment.key,
        job_id: values.trade === "Kỹ thuật khai thác mỏ hầm lò" ? "khai_thac" : values.trade === "Kỹ thuật xây dựng mỏ hầm lò" ? "xay_dung" : "can_tu_van",
        source: source.source,
        medium: source.medium,
        campaign: source.campaign,
        content: source.content,
        lead_key: applicationCode,
      });
      attempt.leadTracked = true;
    }
    if (!delivery.saved) track("ApplicationDeliveryFailure", { action: "crm_delivery_failed", context: formContext });
    if (delivery.saved) {
      clearDraft();
      retryState = null;
    }
  });

})();
