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

  const featuredVideo = document.querySelector("[data-featured-video]");
  const videoLabel = document.querySelector("[data-video-label]");
  const videoHeading = document.querySelector("[data-video-heading]");
  const videoButtons = document.querySelectorAll("[data-video-id]");
  if (featuredVideo && videoLabel && videoHeading) {
    videoButtons.forEach(videoButton => {
      videoButton.addEventListener("click", () => {
        featuredVideo.src = `https://www.youtube-nocookie.com/embed/${videoButton.dataset.videoId}?rel=0&autoplay=1`;
        featuredVideo.title = videoButton.dataset.videoTitle;
        videoLabel.textContent = videoButton.dataset.videoLabel;
        videoHeading.textContent = videoButton.dataset.videoTitle;
        videoButtons.forEach(item => item.setAttribute("aria-current", String(item === videoButton)));
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "video_select",
          video_id: videoButton.dataset.videoId,
          page_path: location.pathname
        });
      });
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
