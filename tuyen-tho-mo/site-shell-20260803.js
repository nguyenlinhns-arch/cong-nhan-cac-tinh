(() => {
  "use strict";

  const CONSENT_KEY = "thaylinh_measurement_consent_v1";
  const MOBILE_POLISH_STYLE = "/mobile-polish-20260803.css?v=1";
  const SEARCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
  const removableSelectors = [
    ".tl-consent-banner",
    "[data-consent-banner]",
    ".analytics-consent",
    ".analytics-consent-banner",
    ".consent-banner",
    ".cookie-banner",
    ".cookie-consent",
    "[data-analytics-consent]",
    "[data-cookie-consent]",
    "[data-measurement-consent]",
    ".v4-primary-nav",
    ".tl-worker-compass",
    ".journey-short-nav",
    ".journey-quick-nav",
    ".journey-nav",
    ".journey-route",
    ".worker-shortcuts",
    ".page-shortcuts",
    ".verification-shortcuts",
    ".article-tabs",
    ".article-quick-nav",
    ".content-tabs",
    ".section-nav",
    ".sticky-subnav",
    ".verification-page__nav",
    ".verification-page__tabs",
    ".verification-page__switcher",
    ".job-page__tabs",
    ".local-page__tabs",
    "[data-worker-compass]",
    "[data-journey-nav]",
    "[data-page-shortcuts]",
  ];

  let consentLocked = false;
  let cleanScheduled = false;

  function ensureMobilePolishStyle() {
    if (document.querySelector(`link[href^="${MOBILE_POLISH_STYLE.split("?")[0]}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MOBILE_POLISH_STYLE;
    link.dataset.mobilePolish = "20260803";
    document.head.append(link);
  }

  function removeKnownBlocks() {
    document.querySelectorAll(removableSelectors.join(",")).forEach(node => node.remove());
  }

  function removeRowsBetweenHeaderAndMain() {
    const header = document.querySelector("body > header.site-header, body > header[data-header]");
    const main = document.querySelector("body > main");
    if (!header || !main) return;

    let node = header.nextElementSibling;
    while (node && node !== main) {
      const next = node.nextElementSibling;
      const isNavigationRow = node.matches("nav, [role='navigation'], .v4-primary-nav, .tl-worker-compass, .journey-short-nav")
        || node.querySelector?.(":scope > nav, :scope > [role='navigation']");
      if (isNavigationRow) node.remove();
      node = next;
    }
  }

  function simplifyHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    header.querySelectorAll(".main-nav, .v4-primary-nav, [data-nav], .menu-toggle, [data-menu-button], [data-menu-toggle]").forEach(node => node.remove());

    const searchButtons = [...header.querySelectorAll(".worker-header-search, .tl-site-search-button, [data-open-site-search]")];
    searchButtons.slice(1).forEach(node => node.remove());
  }

  function insertNetworkSearchButton() {
    const header = document.querySelector(".network-header__inner");
    if (!header || header.querySelector(".tl-site-search-button, [data-open-site-search]")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tl-site-search-button";
    button.dataset.openSiteSearch = "";
    button.setAttribute("aria-label", "Tìm thông tin tuyển thợ mỏ");
    button.setAttribute("aria-haspopup", "dialog");
    button.innerHTML = `${SEARCH_ICON}<span class="tl-visually-hidden">Tìm thông tin tuyển thợ mỏ</span>`;
    const apply = header.querySelector(".network-apply");
    header.insertBefore(button, apply || null);
  }

  function polishVerificationHeader() {
    const page = document.body?.classList.contains("verification-page");
    if (!page) return;
    const small = document.querySelector(".site-header .brand small");
    if (small && small.textContent !== "Tuyển Thợ Mỏ") small.textContent = "Tuyển Thợ Mỏ";
    const cta = document.querySelector(".site-header .header-cta");
    if (cta && matchMedia("(max-width: 767px)").matches) {
      cta.textContent = "Kiểm tra";
      cta.setAttribute("aria-label", "Kiểm tra điều kiện học nghề mỏ");
    }
  }

  function setPrimaryMobileAction(anchor, {href, label, context}) {
    if (!anchor) return;
    anchor.className = "tl-mobile-contact__primary";
    anchor.href = href;
    anchor.removeAttribute("target");
    anchor.removeAttribute("rel");
    anchor.dataset.contact = "application";
    anchor.dataset.context = context;
    anchor.setAttribute("aria-label", label);
    anchor.innerHTML = `<b aria-hidden="true">✓</b><span>${label}</span>`;
  }

  function polishMobileContact() {
    const nav = document.querySelector(".tl-mobile-contact");
    if (!nav || nav.children.length < 3) return;
    const middle = nav.children[1];

    if (document.body?.classList.contains("verification-page")) {
      setPrimaryMobileAction(middle, {
        href: "/kiem-tra-dieu-kien/#dang-ky",
        label: "Kiểm tra",
        context: "verification-mobile-primary",
      });
      nav.setAttribute("aria-label", "Zalo, kiểm tra điều kiện hoặc gọi điện");
      return;
    }

    const networkApply = document.querySelector(".network-header .network-apply");
    if (networkApply) {
      setPrimaryMobileAction(middle, {
        href: networkApply.getAttribute("href") || "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/#dang-ky",
        label: "Đăng ký",
        context: "network-mobile-primary",
      });
      nav.setAttribute("aria-label", "Zalo, đăng ký tư vấn hoặc gọi điện");
      return;
    }

    const applicationForm = document.querySelector("[data-application-form]");
    const applicationLink = document.querySelector(
      'a[data-contact="application"], a[href*="/kiem-tra-dieu-kien/"], a[href*="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/"]',
    );
    if (!applicationForm && !applicationLink) return;

    const directApplication = Boolean(applicationForm);
    setPrimaryMobileAction(middle, {
      href: directApplication
        ? "#dang-ky"
        : applicationLink?.getAttribute("href") || "/kiem-tra-dieu-kien/",
      label: directApplication ? "Đăng ký" : "Kiểm tra",
      context: directApplication ? "job-mobile-primary" : "content-mobile-primary",
    });
    nav.setAttribute(
      "aria-label",
      directApplication
        ? "Zalo, đăng ký ứng tuyển hoặc gọi điện"
        : "Zalo, kiểm tra điều kiện hoặc gọi điện",
    );
  }

  function cleanArticleHero() {
    const hero = document.querySelector(".article-hero");
    if (!hero) return;
    hero.querySelectorAll(":scope > .journey-fast-facts, :scope > .journey-assurance, :scope > .v4-fast-answer, :scope > .v4-hero-actions, :scope > .v4-direct-note").forEach(node => node.remove());
  }

  function disableConsentPrompt() {
    if (consentLocked) return;
    consentLocked = true;
    try { localStorage.setItem(CONSENT_KEY, "denied"); } catch (_) {}
    try { window.thayLinhAnalytics?.consent?.("denied"); } catch (_) {}
    document.querySelectorAll("[data-consent-banner], .tl-consent-banner").forEach(node => node.remove());
  }

  function cleanPageShell() {
    cleanScheduled = false;
    ensureMobilePolishStyle();
    removeKnownBlocks();
    removeRowsBetweenHeaderAndMain();
    simplifyHeader();
    insertNetworkSearchButton();
    polishVerificationHeader();
    polishMobileContact();
    cleanArticleHero();
    disableConsentPrompt();
    document.documentElement.dataset.siteShell = "20260803-v3";
  }

  function scheduleClean() {
    if (cleanScheduled) return;
    cleanScheduled = true;
    requestAnimationFrame(cleanPageShell);
  }

  cleanPageShell();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanPageShell, { once: true });
  }
  window.addEventListener("resize", scheduleClean, { passive: true });

  const observer = new MutationObserver(scheduleClean);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => {
    cleanPageShell();
    observer.disconnect();
  }, 10000);
})();
