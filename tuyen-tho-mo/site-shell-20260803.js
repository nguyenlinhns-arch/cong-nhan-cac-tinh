(() => {
  "use strict";

  const CONSENT_KEY = "thaylinh_measurement_consent_v1";
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
    removeKnownBlocks();
    removeRowsBetweenHeaderAndMain();
    simplifyHeader();
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

  const observer = new MutationObserver(scheduleClean);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => {
    cleanPageShell();
    observer.disconnect();
  }, 10000);
})();
