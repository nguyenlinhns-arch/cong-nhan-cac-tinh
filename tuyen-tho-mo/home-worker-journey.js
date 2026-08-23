(() => {
  "use strict";

  const home = document.querySelector(".home-funnel");
  if (!home) return;

  const STATE_KEY = "thaylinh_home_condition_state";
  const DRAFT_KEY = "thaylinh_application_draft_v1";
  const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
  const ZALO_URL = "https://zalo.me/0963048585";
  const FALLBACK_APPLICATION_URL = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&utm_medium=internal&utm_campaign=home_mobile_journey_2026&utm_content=condition_pass#dang-ky";

  if (!document.querySelector("script[data-home-province-reels-loader]")) {
    const provinceReels = document.createElement("script");
    provinceReels.src = "/home-province-reels.js?v=20260823-1";
    provinceReels.defer = true;
    provinceReels.dataset.homeProvinceReelsLoader = "";
    document.head.append(provinceReels);
  }

  function useRealVideoThumbnails() {
    const featuredFacade = document.querySelector("[data-featured-video-facade]");
    const featuredImage = featuredFacade?.querySelector("img");
    const featuredId = featuredFacade?.dataset.videoId;
    if (featuredImage && featuredId) {
      featuredImage.src = `https://i.ytimg.com/vi/${featuredId}/hqdefault.jpg`;
      featuredImage.alt = "Ảnh đại diện video Hành trình lập nghiệp cùng nghề mỏ";
      featuredImage.width = 480;
      featuredImage.height = 360;
      featuredImage.removeAttribute("referrerpolicy");
    }

    const story = document.querySelector(".home-proof__story");
    if (!story || story.dataset.videoThumbnail === "youtube-dien-bien") return;
    const videoId = "xW92UBKmWok";
    const videoTitle = "Mùa A Vàng – Điện Biên, hành trình đổi đời tại vùng mỏ Quảng Ninh";
    const article = document.createElement("article");
    article.className = story.className;
    article.dataset.videoThumbnail = "youtube-dien-bien";
    article.innerHTML = `
      <div class="home-proof__story-frame">
        <button class="home-video-facade" type="button" data-home-story-video aria-label="Phát video ${videoTitle}">
          <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="Ảnh đại diện video Mùa A Vàng từ Điện Biên đến vùng mỏ Quảng Ninh" loading="lazy" decoding="async" width="480" height="360">
          <span class="home-video-facade__play" aria-hidden="true">▶</span>
          <span class="home-video-facade__label">Bấm để xem video</span>
        </button>
      </div>
      <span><small>CÂU CHUYỆN NGƯỜI THỢ</small><strong>Từ Điện Biên đến vùng mỏ Quảng Ninh</strong><a href="/viec-lam-nganh-than/dien-bien/"><b>Xem câu chuyện Mùa A Vàng →</b></a></span>`;
    story.replaceWith(article);

    article.querySelector("[data-home-story-video]")?.addEventListener("click", (event) => {
      const host = event.currentTarget.parentElement;
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`;
      frame.title = videoTitle;
      frame.loading = "eager";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.setAttribute("allowfullscreen", "");
      host.replaceChildren(frame);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "video_play", video_id: videoId, context: "home_worker_story", page_path: location.pathname });
    });
  }

  useRealVideoThumbnails();

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

  function rememberedState() {
    try {
      const value = sessionStorage.getItem(STATE_KEY) || "";
      return value === "pass" || value === "review" ? value : "start";
    } catch (_) {
      return "start";
    }
  }

  function rememberState(value) {
    if (value !== "pass" && value !== "review") return;
    try { sessionStorage.setItem(STATE_KEY, value); } catch (_) {}
  }

  function applicationUrl(content) {
    return window.ThayLinhMobile?.trackedApplicationUrl?.("home_mobile_journey_2026", content)
      || FALLBACK_APPLICATION_URL.replace("condition_pass", content);
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

  function applyJourneyState(state = rememberedState()) {
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
        href: applicationUrl("condition_pass"),
        label: "Đăng ký",
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
        action: "condition_review",
        contact: "zalo",
        external: true,
      });
      return true;
    }

    configureButton(button, {
      href: "#tu-kiem-tra",
      label: "Kiểm tra",
      icon: "✓",
      action: "condition_check",
    });
    return true;
  }

  if (!applyJourneyState()) requestAnimationFrame(() => applyJourneyState());

  const result = document.querySelector("[data-worker-check-result]");
  if (result) {
    const syncResult = () => {
      const state = result.dataset.state || "";
      if (state !== "pass" && state !== "review") return;
      rememberState(state);
      applyJourneyState(state);
      track("worker_journey_stage", { stage: state === "pass" ? "condition_pass" : "condition_review" });
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
        action: mobileAction.dataset.workerJourneyAction || "unknown",
        condition_state: rememberedState(),
      });
    }
  });

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
