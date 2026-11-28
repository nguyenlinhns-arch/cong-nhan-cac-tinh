(() => {
  "use strict";
  const root = document.querySelector("[data-single-landing]");
  if (!root) return;
  const dialog = document.querySelector(".home-pin-dialog");
  if (dialog?.showModal) {
    const stage = dialog.querySelector(".home-pin-dialog__stage");
    const title = dialog.querySelector("h2");
    title.tabIndex = -1;
    const fallback = dialog.querySelector(".home-pin-dialog__link");
    const next = dialog.querySelector("[data-pin-next]");
    const apply = dialog.querySelector("[data-pin-apply]");
    const cards = [...root.querySelectorAll("a[data-home-pin]")].filter(link => /^\d{10,20}$/.test(link.dataset.homePin));
    let opener;
    let active = -1;
    let leaving = false;
    const ordinaryClick = event => !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button);
    const show = index => {
      const card = cards[index];
      if (!card) return;
      active = index;
      const reel = "https://www.facebook.com/reel/" + card.dataset.homePin + "/";
      const url = new URL("https://www.facebook.com/plugins/video.php");
      url.search = new URLSearchParams({href:reel, show_text:"false", width:"500"});
      const frame = document.createElement("iframe");
      frame.src = url.href;
      frame.title = card.dataset.pinTitle;
      frame.allow = "encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      title.textContent = frame.title;
      fallback.href = reel;
      stage.replaceChildren(frame);
      if (next) next.textContent = (index + 1 < cards.length) ? "Xem video tiếp" : "Xem thêm video";
    };
    cards.forEach((card, index) => card.addEventListener("click", event => {
      if (!ordinaryClick(event)) return;
      event.preventDefault();
      opener = card;
      leaving = false;
      show(index);
      dialog.showModal();
    }));
    function leave(event, hash, heading) {
      if (!ordinaryClick(event)) return;
      event.preventDefault();
      leaving = true;
      dialog.close();
      if (location.hash !== hash) history.pushState(null, "", hash);
      document.getElementById(heading)?.focus({preventScroll:true});
      document.getElementById(hash.slice(1))?.scrollIntoView({block:"start"});
    }
    next?.addEventListener("click", event => {
      if (!ordinaryClick(event)) return;
      if (active + 1 < cards.length) {
        event.preventDefault();
        show(active + 1);
        title.focus({preventScroll:true});
      } else leave(event, "#thuc-te", "tkv-video-title");
    });
    apply?.addEventListener("click", event => leave(event, "#dang-ky", "consult-title"));
    dialog.addEventListener("close", () => {
      stage.replaceChildren();
      if (!leaving) opener?.focus({preventScroll:true});
    });
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
