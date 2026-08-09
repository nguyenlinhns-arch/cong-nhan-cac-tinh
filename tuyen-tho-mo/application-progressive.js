(() => {
  "use strict";

  function init() {
    const form = document.querySelector("[data-application-form]");
    if (!form || form.dataset.progressiveReady === "true") return;
    const grid = form.querySelector(".form-grid");
    const submit = form.querySelector("[data-application-submit]");
    const consent = form.querySelector(".consent");
    const draft = form.querySelector("[data-application-draft-status]");
    if (!grid || !submit || !consent) return;

    form.dataset.progressiveReady = "true";
    const stepOneNames = new Set(["full_name", "phone", "birth_date", "province"]);
    const labels = [...grid.querySelectorAll(":scope > label")];
    const stepOneLabels = [];
    const stepTwoLabels = [];

    labels.forEach((label) => {
      const field = label.querySelector("input[name],select[name],textarea[name]");
      if (!field) return;
      const step = stepOneNames.has(field.name) ? "1" : "2";
      label.dataset.formStep = step;
      (step === "1" ? stepOneLabels : stepTwoLabels).push(label);
    });

    const style = document.createElement("style");
    style.dataset.progressiveFormStyle = "";
    style.textContent = `
      [data-application-form][data-progressive-ready="true"] [data-form-step="2"]{display:none}
      [data-application-form][data-progressive-ready="true"][data-progressive-step="2"] [data-form-step="1"]{display:none}
      [data-application-form][data-progressive-ready="true"][data-progressive-step="2"] [data-form-step="2"]{display:block}
      [data-progressive-step-two-hidden="true"]{display:none!important}
      .tl-form-progress{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 16px}
      .tl-form-progress span{padding:9px 10px;border:1px solid #d7e4e1;border-radius:10px;background:#f7faf9;color:#6a7d81;font-size:12px;font-weight:800;text-align:center}
      .tl-form-progress span.is-active{border-color:#0a6874;background:#eef8f7;color:#075b66}
      .tl-form-next{width:100%;min-height:50px;margin-top:12px;border:0;border-radius:12px;background:#d86f0c;color:#fff;font:inherit;font-weight:900;cursor:pointer}
      .tl-form-back{width:100%;min-height:42px;margin:8px 0 4px;border:1px solid #cadbd7;border-radius:10px;background:#fff;color:#075b66;font:inherit;font-weight:800;cursor:pointer}
      .tl-form-step-note{margin:0 0 14px;color:#5e7378;font-size:13px;line-height:1.5}
      @media(max-width:640px){.tl-form-progress{position:sticky;top:62px;z-index:3;padding:6px 0;background:#fff}.tl-form-next{min-height:52px}}
    `;
    document.head.append(style);

    const progress = document.createElement("div");
    progress.className = "tl-form-progress";
    progress.setAttribute("aria-label", "Tiến trình đăng ký");
    progress.innerHTML = '<span data-progress-step="1" class="is-active">1 · Thông tin liên hệ</span><span data-progress-step="2">2 · Kiểm tra điều kiện</span>';
    grid.before(progress);

    const note = document.createElement("p");
    note.className = "tl-form-step-note";
    note.textContent = "Bước 1 chỉ cần thông tin liên hệ cơ bản. Chưa cần chuẩn bị hoặc gửi ảnh giấy tờ.";
    progress.after(note);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "tl-form-next";
    next.textContent = "Tiếp tục kiểm tra điều kiện";
    grid.after(next);

    const back = document.createElement("button");
    back.type = "button";
    back.className = "tl-form-back";
    back.textContent = "← Sửa thông tin liên hệ";
    consent.before(back);

    for (const element of [consent, submit, draft, back]) if (element) element.dataset.progressiveStepTwoHidden = "true";
    form.dataset.progressiveStep = "1";

    function track(action) {
      try {
        window.tlTrack?.("application_progressive_step", {
          action,
          context: form.dataset.formContext || "application",
          step: form.dataset.progressiveStep || "1",
          page_path: location.pathname,
        });
      } catch (_) {}
    }

    function validateStepOne() {
      for (const label of stepOneLabels) {
        const field = label.querySelector("input[name],select[name],textarea[name]");
        if (field && !field.checkValidity()) {
          field.reportValidity();
          field.focus({ preventScroll: true });
          field.scrollIntoView({ behavior: "smooth", block: "center" });
          return false;
        }
      }
      return true;
    }

    function showStep(step) {
      const isSecond = step === 2;
      form.dataset.progressiveStep = isSecond ? "2" : "1";
      progress.querySelector('[data-progress-step="1"]')?.classList.toggle("is-active", !isSecond);
      progress.querySelector('[data-progress-step="2"]')?.classList.toggle("is-active", isSecond);
      note.textContent = isSecond
        ? "Bước 2 đối chiếu chiều cao, cân nặng, trình độ, nghề quan tâm và sức khỏe sơ bộ. Kết quả cuối cùng vẫn căn cứ khám tuyển."
        : "Bước 1 chỉ cần thông tin liên hệ cơ bản. Chưa cần chuẩn bị hoặc gửi ảnh giấy tờ.";
      next.hidden = isSecond;
      for (const element of [consent, submit, draft, back]) {
        if (!element) continue;
        if (isSecond) delete element.dataset.progressiveStepTwoHidden;
        else element.dataset.progressiveStepTwoHidden = "true";
      }
      const target = (isSecond ? stepTwoLabels : stepOneLabels)[0]?.querySelector("input,select,textarea");
      target?.focus({ preventScroll: true });
      progress.scrollIntoView({ behavior: "smooth", block: "start" });
      track(isSecond ? "step_2_view" : "step_1_return");
    }

    next.addEventListener("click", () => {
      if (!validateStepOne()) {
        track("step_1_validation_error");
        return;
      }
      showStep(2);
    });
    back.addEventListener("click", () => showStep(1));
    form.addEventListener("submit", () => track("final_submit_attempt"), { capture: true });
    track("step_1_view");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
