(() => {
  "use strict";

  const home = document.querySelector(".home-funnel");
  if (!home) return;

  const STATE_KEY = "thaylinh_home_condition_state";
  const DRAFT_KEY = "thaylinh_application_draft_v1";
  const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
  const ZALO_URL = "https://zalo.me/0963048585";
  const FALLBACK_APPLICATION_URL = "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?utm_source=website&utm_medium=internal&utm_campaign=home_mobile_journey_2026&utm_content=condition_pass#dang-ky";
  const PROVINCE_REELS = [
    {
      province: "GIA LAI · XÃ IA RDEH",
      title: "Từ Ia RDeh đến vùng mỏ Quảng Ninh – mở lối việc làm cho lao động Gia Lai",
      description: "Một chuyến công tác tại địa phương, từ tư vấn và kết nối các đơn vị đến câu chuyện gia đình người lao động đã chọn vùng mỏ để lập nghiệp.",
      contentUrl: "https://www.facebook.com/reel/988978737487363",
      embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F988978737487363%2F&show_text=false&width=500",
      schemaId: "gia-lai-ia-rdeh",
    },
    {
      province: "QUẢNG NGÃI",
      title: "Hành trình từ Quảng Ngãi đến vùng Than",
      description: "Theo chân quá trình đồng hành cùng người lao động từ quê nhà đến Quảng Ninh, để thấy rõ con đường học nghề và nhận việc diễn ra như thế nào.",
      contentUrl: "https://www.facebook.com/reel/1015675787556708",
      embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1015675787556708%2F&show_text=false&width=500",
      schemaId: "quang-ngai-vung-than",
    },
  ];

  const track = (event, payload = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...payload });
  };

  function installProvinceReelStyles() {
    if (document.querySelector("style[data-home-province-reels-style]")) return;
    const style = document.createElement("style");
    style.dataset.homeProvinceReelsStyle = "";
    style.textContent = `
.home-province-reels{padding:clamp(54px,7vw,88px) 0;background:#f3f7f6;border-top:1px solid #d9e6e3;border-bottom:1px solid #d9e6e3;scroll-margin-top:78px}
.home-province-reels__head{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:36px;align-items:end;margin-bottom:30px}
.home-province-reels__head h2{max-width:760px;margin:0;color:#123c44;font-size:clamp(30px,4vw,50px);line-height:1.08;letter-spacing:-.035em}
.home-province-reels__head>p{margin:0;color:#536d72;font-size:16px;line-height:1.7}
.home-province-reels__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
.home-province-reel{min-width:0;display:grid;grid-template-columns:minmax(220px,.78fr) minmax(0,1fr);overflow:hidden;border:1px solid #d6e3e0;border-radius:24px;background:#fff;box-shadow:0 16px 40px rgba(18,60,68,.08)}
.home-province-reel__media{position:relative;min-height:100%;aspect-ratio:9/16;background:#092f36}
.home-province-reel__media iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.home-province-reel__copy{min-width:0;display:flex;flex-direction:column;padding:24px 22px 22px}
.home-province-reel__copy small{display:block;margin-bottom:10px;color:#c75d0b;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
.home-province-reel__copy h3{margin:0;color:#123c44;font-size:clamp(20px,2vw,27px);line-height:1.2;letter-spacing:-.025em}
.home-province-reel__copy p{margin:14px 0 18px;color:#586f74;font-size:14px;line-height:1.65}
.home-province-reel__copy a{margin-top:auto;color:#075b66;font-size:13px;font-weight:900;text-decoration:none}
.home-province-reel__copy a:hover,.home-province-reel__copy a:focus-visible{color:#b94f09;text-decoration:underline;text-underline-offset:4px}
.home-province-reels__cta{display:flex;align-items:center;justify-content:space-between;gap:22px;margin-top:24px;padding:18px 20px;border:1px solid #cddedb;border-radius:18px;background:#fff}
.home-province-reels__cta p{margin:0;color:#2f555c;font-size:15px;line-height:1.55}
.home-province-reels__actions{display:flex;flex:0 0 auto;gap:10px}
.home-province-reels__actions a{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:11px 16px;border-radius:12px;background:#075b66;color:#fff;font-size:13px;font-weight:900;text-decoration:none}
.home-province-reels__actions a:last-child{background:#d86f0c}
.home-province-reels__actions a:hover,.home-province-reels__actions a:focus-visible{filter:brightness(.94);transform:translateY(-1px)}
@media(max-width:1099px){
  .home-province-reels__grid{grid-template-columns:1fr}
  .home-province-reel{grid-template-columns:minmax(250px,.65fr) minmax(0,1fr)}
}
@media(max-width:767px){
  .home-province-reels{padding:48px 0}
  .home-province-reels__head{grid-template-columns:1fr;gap:14px;margin-bottom:22px}
  .home-province-reels__head h2{font-size:32px}
  .home-province-reels__head>p{font-size:14px;line-height:1.6}
  .home-province-reels__grid{gap:18px}
  .home-province-reel{grid-template-columns:1fr;border-radius:20px}
  .home-province-reel__media{width:min(100%,340px);min-height:0;margin:auto}
  .home-province-reel__copy{padding:20px}
  .home-province-reel__copy h3{font-size:23px}
  .home-province-reels__cta{align-items:stretch;flex-direction:column;padding:18px}
  .home-province-reels__actions{display:grid;grid-template-columns:1fr 1fr;width:100%}
}
@media(max-width:390px){
  .home-province-reels__actions{grid-template-columns:1fr}
}
`;
    document.head.append(style);
  }

  function installProvinceReelSchema() {
    if (document.querySelector("script[data-home-province-reels-schema]")) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.homeProvinceReelsSchema = "";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": PROVINCE_REELS.map((reel) => ({
        "@type": "VideoObject",
        "@id": `https://thaylinhtuyenthomo.vn/#${reel.schemaId}`,
        name: reel.title,
        description: reel.description,
        contentUrl: reel.contentUrl,
        embedUrl: reel.embedUrl,
        thumbnailUrl: "https://thaylinhtuyenthomo.vn/assets/og-cover-luong-25-trieu-v4.jpg",
        inLanguage: "vi-VN",
        author: { "@id": "https://thaylinhtuyenthomo.vn/tac-gia/nguyen-tu-linh/#person" },
      })),
    });
    document.head.append(script);
  }

  function installProvinceReels() {
    if (document.querySelector("[data-home-province-reels]")) return;
    const proof = document.querySelector(".home-proof.home-proof--early");
    if (!proof) return;

    installProvinceReelStyles();
    installProvinceReelSchema();

    const section = document.createElement("section");
    section.className = "home-province-reels";
    section.id = "hanh-trinh-dia-phuong";
    section.dataset.homeProvinceReels = "";
    section.dataset.journeySection = "province_reels";
    section.setAttribute("aria-labelledby", "home-province-reels-title");
    section.innerHTML = `
      <div class="container">
        <div class="home-province-reels__head">
          <div><p class="home-step">Hành trình tuyển sinh thực tế</p><h2 id="home-province-reels-title">Từ quê nhà đến vùng mỏ Quảng Ninh</h2></div>
          <p>Những thước phim tại Gia Lai và Quảng Ngãi cho thấy nhà trường trực tiếp đến địa phương, tư vấn rõ lộ trình học nghề và đồng hành để người lao động hiểu công việc trước khi quyết định.</p>
        </div>
        <div class="home-province-reels__grid">
          ${PROVINCE_REELS.map((reel, index) => `
            <article class="home-province-reel">
              <div class="home-province-reel__media">
                <iframe title="${reel.title}" src="${reel.embedUrl.replace(/&/g, "&amp;")}" width="500" height="889" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
              </div>
              <div class="home-province-reel__copy">
                <small>${reel.province}</small>
                <h3>${reel.title}</h3>
                <p>${reel.description}</p>
                <a href="${reel.contentUrl}" target="_blank" rel="noopener noreferrer" data-province-reel-link="${index + 1}" data-context="home-province-reels">Nếu video chưa phát, mở trên Facebook →</a>
              </div>
            </article>
          `).join("")}
        </div>
        <div class="home-province-reels__cta">
          <p><strong>Bạn đang ở tỉnh xa?</strong> Gửi tỉnh đang sống, năm sinh, chiều cao/cân nặng và sức khỏe để được kiểm tra trước khi lên đường.</p>
          <div class="home-province-reels__actions">
            <a href="#tu-kiem-tra" data-province-reel-action="condition">Kiểm tra điều kiện</a>
            <a href="${ZALO_URL}" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="home-province-reels" data-province-reel-action="zalo">Nhắn Thầy Linh</a>
          </div>
        </div>
      </div>`;

    proof.insertAdjacentElement("afterend", section);
  }

  installProvinceReels();

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

    const provinceReelLink = event.target.closest?.("[data-province-reel-link]");
    if (provinceReelLink) {
      track("home_province_reel_click", {
        reel_position: provinceReelLink.dataset.provinceReelLink || "unknown",
        destination: "facebook",
      });
    }

    const provinceReelAction = event.target.closest?.("[data-province-reel-action]");
    if (provinceReelAction) {
      track("home_province_reel_action", {
        action: provinceReelAction.dataset.provinceReelAction || "unknown",
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