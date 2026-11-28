(() => {
  "use strict";
  const root = document.querySelector("[data-single-landing]");
  if (!root) return;
  const dialog = document.querySelector(".home-pin-dialog");
  if (dialog?.showModal) {
    const stage = dialog.querySelector(".home-pin-dialog__stage");
    const title = dialog.querySelector("h2");
    const fallback = dialog.querySelector(".home-pin-dialog__link");
    let opener;
    root.querySelectorAll("a[data-home-pin]").forEach(link => link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
      const id = link.dataset.homePin;
      if (!/^\d{10,20}$/.test(id)) return;
      const reel = "https://www.facebook.com/reel/" + id + "/";
      const url = new URL("https://www.facebook.com/plugins/video.php");
      url.search = new URLSearchParams({href:reel, show_text:"false", width:"500"});
      const frame = document.createElement("iframe");
      frame.src = url.href;
      frame.title = link.dataset.pinTitle;
      frame.allow = "encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      event.preventDefault();
      opener = link;
      title.textContent = frame.title;
      fallback.href = reel;
      stage.replaceChildren(frame);
      dialog.showModal();
    }));
    dialog.addEventListener("close", () => { stage.replaceChildren(); opener?.focus({preventScroll:true}); });
  }

  const embeddedForm = document.getElementById("landing-apply-frame");
  if (embeddedForm) {
    let resize = null;
    embeddedForm.addEventListener("load", () => {
      resize?.disconnect();
      try {
        const doc = embeddedForm.contentDocument;
        const form = doc?.documentElement.hasAttribute("data-embedded-apply") && doc.getElementById("dang-ky");
        if (!form) return;
        const fit = () => {
          const next = Math.max(400, Math.ceil(form.getBoundingClientRect().height) + 12);
          if (parseFloat(embeddedForm.style.height) !== next) embeddedForm.style.height = next + "px";
        };
        fit();
        if (typeof ResizeObserver === "function") {
          resize = new ResizeObserver(fit);
          resize.observe(form);
        }
      } catch (_) { /* The original full-page form link remains available. */ }
    });
  }
})();
