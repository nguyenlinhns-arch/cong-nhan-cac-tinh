(() => {
  "use strict";
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");

  function closeMenu() {
    if (!button || !nav) return;
    nav.dataset.open = "false";
    button.setAttribute("aria-expanded", "false");
  }

  if (button && nav) {
    button.addEventListener("click", () => {
      const next = nav.dataset.open !== "true";
      nav.dataset.open = String(next);
      button.setAttribute("aria-expanded", String(next));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll("[data-contact]").forEach(link => {
    link.addEventListener("click", () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "contact_click",
        channel: link.dataset.contact,
        page_path: location.pathname
      });
    });
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
