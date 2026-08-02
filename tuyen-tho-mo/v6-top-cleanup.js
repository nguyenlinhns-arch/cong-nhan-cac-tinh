(() => {
  "use strict";

  function compactHero() {
    const hero = document.querySelector("main > section:first-of-type, .verification-page__hero, .job-hero, .local-hero, .hero");
    if (!hero) return null;
    hero.classList.add("v6-hero-compact");
    hero.querySelectorAll(".verification-page__actions,.contact-pair,.button-row,.hero-actions,.worker-hero__actions").forEach(node => {
      if (!node.classList.contains("v4-hero-actions")) node.classList.add("v6-hidden-top-extra");
    });
    return hero;
  }

  function simplifyHeader() {
    document.querySelectorAll(".main-nav,.v4-primary-nav").forEach(nav => {
      nav.setAttribute("hidden", "");
      nav.setAttribute("aria-hidden", "true");
    });
    const cta = document.querySelector(".site-header .header-cta");
    if (cta) {
      cta.textContent = "Kiểm tra";
      cta.setAttribute("aria-label", "Kiểm tra điều kiện học nghề mỏ");
    }
  }

  function moveReturnPrompt(hero) {
    const prompt = document.querySelector(".v5-return-prompt");
    if (!prompt || !hero) return false;
    hero.insertAdjacentElement("afterend", prompt);
    prompt.classList.add("v6-top-resume");
    return true;
  }

  function init() {
    document.documentElement.dataset.topVersion = "v6";
    document.body.classList.add("v6-top-clean");
    simplifyHeader();
    const hero = compactHero();
    if (moveReturnPrompt(hero)) return;
    if (typeof MutationObserver !== "function") return;
    const observer = new MutationObserver(() => {
      if (moveReturnPrompt(hero)) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 4000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
