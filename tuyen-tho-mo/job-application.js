(() => {
  "use strict";

  const form = document.querySelector("[data-application-form]");
  if (!form) return;

  const result = document.querySelector("[data-application-result]");
  const output = document.querySelector("[data-application-message]");
  const error = document.querySelector("[data-form-error]");
  const birthDate = document.querySelector("[data-birth-date]");
  const copyButton = document.querySelector("[data-copy-application]");
  const statusOutput = document.querySelector("[data-application-status]");
  const codeOutput = document.querySelector("[data-application-code]");
  const smsLink = document.querySelector("[data-sms-application]");
  const submitButton = document.querySelector("[data-application-submit]");
  const deliveryOutput = document.querySelector("[data-application-delivery]");
  const params = new URLSearchParams(location.search);
  const recruitment = window.THAY_LINH_RECRUITMENT || {};
  const criteria = recruitment.criteria || {};
  const formContext = form.dataset.formContext || "central_application";
  const today = new Date();
  let started = false;
  let submitted = false;

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
      source: params.get("utm_source") || stored.utm_source || params.get("source") || inferredSource,
      medium: params.get("utm_medium") || stored.utm_medium || (inferredSource === "website" ? "owned" : "referral"),
      campaign: params.get("utm_campaign") || stored.utm_campaign || "tuyen_tho_mo_2026",
      content: params.get("utm_content") || stored.utm_content || "application_form",
    };
  }

  function track(name, payload) {
    if (typeof window.tlTrack === "function") window.tlTrack(name, payload);
    else {
      window.tlTrackingQueue = window.tlTrackingQueue || [];
      window.tlTrackingQueue.push([name, payload]);
    }
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

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      output.hidden = false;
      output.focus();
      output.select();
      document.execCommand("copy");
    }
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

  prefillSelect("province", params.get("province"));
  prefillSelect("trade", params.get("trade") || form.dataset.defaultTrade);

  form.addEventListener("input", () => {
    if (started) return;
    started = true;
    track("ApplicationStart", { action: "form_started", context: formContext });
  }, { once: true });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitted) return;
    error.hidden = true;
    if (!form.reportValidity()) return;

    const values = Object.fromEntries(new FormData(form).entries());
    const phone = normalizePhone(values.phone);
    if (!phone) {
      error.textContent = "Vui lòng nhập đúng số điện thoại di động Việt Nam gồm 10 chữ số.";
      error.hidden = false;
      form.elements.namedItem("phone")?.focus();
      return;
    }

    const age = calculateAge(values.birth_date);
    const assessment = assess(values, age);
    const applicationCode = createApplicationCode();
    const source = readAttribution();
    const message = [
      "ĐĂNG KÝ TUYỂN LAO ĐỘNG HỌC NGHỀ MỎ 2026",
      `- Mã đăng ký: ${applicationCode}`,
      `- Họ và tên: ${String(values.full_name).trim()}`,
      `- Số điện thoại: ${phone}`,
      `- Ngày sinh / tuổi: ${values.birth_date} / ${age ?? "chưa xác định"}`,
      `- Tỉnh, thành: ${values.province}`,
      `- Chiều cao / cân nặng: ${values.height} cm / ${values.weight} kg`,
      `- Trình độ: ${values.education}`,
      `- Nghề quan tâm: ${values.trade}`,
      `- Sức khỏe sơ bộ: ${values.health}`,
      `- Kết quả tự kiểm tra: ${assessment.label}`,
      `- Nguồn: ${source.source} / ${source.content}`,
      "- Thời gian học đã tìm hiểu: 2–3 tháng; hỗ trợ trong thời gian học: 7,5 triệu đồng",
      "Nhờ anh Nguyễn Tử Linh kiểm tra điều kiện và hướng dẫn bước tiếp theo.",
    ].join("\n");

    const application = {
      schema_version: Number(recruitment.schemaVersion) || 2,
      code: applicationCode,
      created_at: new Date().toISOString(),
      full_name: String(values.full_name).trim(),
      phone,
      birth_date: values.birth_date,
      age,
      province: values.province,
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
      page_url: location.href,
      form_context: formContext,
      website: String(values.website || ""),
      consent: values.consent === "on",
    };

    output.value = message;
    statusOutput.dataset.status = assessment.key;
    statusOutput.textContent = assessment.label;
    statusOutput.title = assessment.guidance;
    codeOutput.textContent = applicationCode;
    result.dataset.eligibility = assessment.key;
    result.hidden = false;
    if (smsLink) smsLink.href = `sms:+84963048585?body=${encodeURIComponent(message)}`;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Đang gửi đăng ký…";
    }
    track("ApplicationSubmit", {
      action: "application_submitted",
      context: formContext,
      eligibility: assessment.key,
      source: source.source,
      medium: source.medium,
      campaign: source.campaign,
      content: source.content,
    });
    const delivery = await deliverApplication(application);
    if (deliveryOutput) {
      deliveryOutput.dataset.state = delivery.saved ? "saved" : "fallback";
      deliveryOutput.textContent = delivery.saved
        ? "Đăng ký đã được tiếp nhận. Bộ phận tư vấn sẽ liên hệ theo số điện thoại bạn cung cấp."
        : "Tin đăng ký đã được tạo và sao chép. Hãy mở Zalo, Messenger hoặc SMS bên dưới để gửi ngay cho Thầy Linh.";
    }
    if (submitButton) {
      submitted = delivery.saved;
      submitButton.disabled = delivery.saved;
      submitButton.textContent = delivery.saved ? "Đăng ký đã được tiếp nhận" : "Gửi lại đăng ký";
    }

    try {
      localStorage.setItem("thaylinh_last_application", JSON.stringify({
        code: applicationCode,
        created_at: new Date().toISOString(),
        eligibility: assessment.key,
        source: source.source,
      }));
    } catch (_) {}

    await copyText(message);
    track("Lead", {
      action: delivery.saved ? "application_saved" : "application_message_created",
      context: formContext,
      eligibility: assessment.key,
      job_id: values.trade === "Kỹ thuật khai thác mỏ hầm lò" ? "khai_thac" : values.trade === "Kỹ thuật xây dựng mỏ hầm lò" ? "xay_dung" : "can_tu_van",
      source: source.source,
      medium: source.medium,
      campaign: source.campaign,
      content: source.content,
    });
    if (!delivery.saved) track("ApplicationDeliveryFailure", { action: "crm_delivery_failed", context: formContext });
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  copyButton?.addEventListener("click", async () => {
    await copyText(output.value);
    copyButton.textContent = "Đã sao chép tin nhắn";
    track("ApplicationCopy", { action: "message_copied", context: "application_result" });
    window.setTimeout(() => { copyButton.textContent = "Sao chép lại tin nhắn"; }, 2500);
  });
})();
