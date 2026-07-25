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

  const copyButton = document.querySelector("[data-copy-message]");
  const copyStatus = document.querySelector(".copy-status");
  if (copyButton && copyStatus) {
    copyButton.addEventListener("click", async () => {
      const template = "Em muốn kiểm tra điều kiện học nghề mỏ. Năm sinh: ...; Chiều cao/cân nặng: ...; Sức khỏe hiện tại: ...";
      try {
        await navigator.clipboard.writeText(template);
        copyStatus.textContent = "Đã sao chép — mở Zalo và dán tin nhắn.";
        copyButton.textContent = "Đã sao chép mẫu";
      } catch {
        copyStatus.textContent = "Hãy nhắn: năm sinh, chiều cao/cân nặng và sức khỏe hiện tại.";
      }
    });
  }

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
