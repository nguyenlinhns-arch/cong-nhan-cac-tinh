(() => {
  "use strict";

  function firstHero() {
    return document.querySelector("main > section:first-of-type,.article-hero,.verification-page__hero,.job-hero,.local-hero,.hero");
  }

  function moveReturnPrompt() {
    const prompt = document.querySelector(".v5-return-prompt");
    const hero = firstHero();
    if (!prompt || !hero || prompt.classList.contains("site-clean-return")) return false;
    hero.insertAdjacentElement("afterend", prompt);
    prompt.classList.add("site-clean-return");
    return true;
  }

  function simplifyHeader() {
    document.querySelectorAll(".main-nav,.v4-primary-nav").forEach(nav => {
      nav.setAttribute("aria-hidden", "true");
    });
    const cta = document.querySelector(".site-header .header-cta");
    if (cta && /kiểm tra điều kiện/iu.test(cta.textContent || "")) cta.textContent = "Kiểm tra";
  }

  function init() {
    simplifyHeader();
    if (moveReturnPrompt() || typeof MutationObserver !== "function") return;
    const observer = new MutationObserver(() => {
      if (moveReturnPrompt()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 5000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
