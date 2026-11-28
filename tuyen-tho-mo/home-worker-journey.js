(() => {
  "use strict";

  const home = document.querySelector(".home-funnel");
  if (!home) return;

  const STATE_KEY = "thaylinh_home_condition_state";
  const DRAFT_KEY = "thaylinh_application_draft_v1";
  const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
  const ZALO_URL = "https://zalo.me/0963048585";
  const FALLBACK_APPLICATION_URL = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&utm_medium=internal&utm_campaign=home_mobile_journey_2026&utm_content=checker_next#dang-ky";

  const track = (event, payload = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...payload });
  };

  function hasActiveDraft() {
    try {
      const stored = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      const savedAt = Date.parse(stored?.saved_at || "");
      return Boolean(stored?.values && typeof stored.values === "object")
        && Number.isFinite(savedAt)
        && savedAt <= Date.now() + 60_000
        && Date.now() - savedAt <= DRAFT_TTL_MS;
    } catch (_) {
      return false;
    }
  }

  // Keep screening outcomes only for this page; remove the legacy saved value.
  let currentConditionState = "start";
  try { sessionStorage.removeItem(STATE_KEY); } catch (_) {}

  function applicationUrl(content) {
    if (document.querySelector("#landing-apply-frame")) return "#dang-ky";
    return window.ThayLinhMobile?.trackedApplicationUrl?.("home_mobile_journey_2026", content)
      || FALLBACK_APPLICATION_URL.replace("checker_next", content);
  }

  function journeyButton() {
    return document.querySelector(".tl-mobile-contact__journey, .tl-mobile-contact__messenger");
  }

  function configureButton(button, { href, label, icon, action, contact = "", external = false }) {
    button.className = "tl-mobile-contact__journey";
    button.href = href;
    button.dataset.workerJourneyAction = action;
    button.dataset.context = "home-mobile-journey";
    button.setAttribute("aria-label", label);
    button.innerHTML = `<b aria-hidden="true">${icon}</b><span>${label}</span>`;
    if (contact) button.dataset.contact = contact;
    else delete button.dataset.contact;
    if (external) {
      button.target = "_blank";
      button.rel = "noopener noreferrer";
    } else {
      button.removeAttribute("target");
      button.removeAttribute("rel");
    }
  }

  function applyJourneyState(state = currentConditionState) {
    const button = journeyButton();
    if (!button) return false;

    if (hasActiveDraft()) {
      configureButton(button, {
        href: applicationUrl("resume_draft"),
        label: "Tiếp tục hồ sơ",
        icon: "↗",
        action: "resume_application",
        contact: "application",
      });
      return true;
    }

    if (state === "pass") {
      configureButton(button, {
        href: applicationUrl("checker_next"),
        label: "Đăng ký ngay",
        icon: "✓",
        action: "application",
        contact: "application",
      });
      return true;
    }

    if (state === "review") {
      configureButton(button, {
        href: ZALO_URL,
        label: "Hỏi điều kiện",
        icon: "?",
        action: "ask_conditions",
        contact: "zalo",
        external: true,
      });
      return true;
    }

    configureButton(button, {
      href: applicationUrl("mobile_ready"),
      label: "Đăng ký ngay",
      icon: "↗",
      action: "application",
      contact: "application",
    });
    return true;
  }

  if (!applyJourneyState()) requestAnimationFrame(() => applyJourneyState());

  const result = document.querySelector("[data-worker-check-result]");
  if (result) {
    const syncResult = () => {
      const state = result.dataset.state || "";
      if (!["pass", "review", "incomplete"].includes(state)) return;
      currentConditionState = state === "incomplete" ? "start" : state;
      applyJourneyState(currentConditionState);
    };
    new MutationObserver(syncResult).observe(result, { attributes: true, attributeFilter: ["data-state"] });
  }

  document.addEventListener("click", (event) => {
    const shortcut = event.target.closest?.("[data-journey-shortcut]");
    if (shortcut) {
      track("worker_journey_shortcut_click", {
        destination: shortcut.dataset.journeyShortcut || "unknown",
        context: "home_shortcuts",
      });
    }

    const mobileAction = event.target.closest?.(".tl-mobile-contact__journey");
    if (mobileAction) {
      track("worker_journey_bar_click", {
        action: "contact_or_check",
      });
    }
  });

  document.querySelectorAll("[data-home-reel]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.homeReel;
      const host = button.closest("[data-home-reel-host]");
      if (!host || !/^\d{10,20}$/.test(id)) return;
      const url = new URL("https://www.facebook.com/plugins/video.php");
      url.search = new URLSearchParams({
        href: "https://www.facebook.com/reel/" + id,
        show_text: "false",
        width: "500",
      });
      const frame = document.createElement("iframe");
      frame.src = url.href;
      frame.title = button.getAttribute("aria-label").replace(/^Phát /, "");
      frame.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      host.replaceChildren(frame);
      frame.focus({preventScroll:true});
      track("home_province_reel_play", {video_id: id});
    });
  });

  // The check is local-only, even if the eligibility script fails to load.
  const checkTrigger = document.querySelector("[data-worker-check-trigger]");
  checkTrigger?.addEventListener("click", () => {
    checkTrigger.form?.dispatchEvent(new Event("submit", {bubbles:true, cancelable:true}));
  });

  function openLinkedVideo() {
    if (location.hash === "#home-kcn-video") {
      const section = document.getElementById("home-kcn-video");
      const details = section?.closest("details");
      if (details) {
        details.open = true;
        requestAnimationFrame(() => section.scrollIntoView({ block: "start" }));
      }
    }
  }
  openLinkedVideo();
  window.addEventListener("hashchange", openLinkedVideo);

  if ("IntersectionObserver" in window) {
    const viewed = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const stage = entry.target.dataset.journeySection || entry.target.id;
        if (!stage || viewed.has(stage)) continue;
        viewed.add(stage);
        track("worker_journey_step_view", { stage });
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "-15% 0px -45%", threshold: 0.15 });
    document.querySelectorAll("[data-journey-section]").forEach((section) => observer.observe(section));
  }
})();

