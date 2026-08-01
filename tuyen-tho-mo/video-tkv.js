(() => {
  const frame = document.querySelector("[data-featured-frame]");
  const heading = document.querySelector("[data-featured-title]");
  const buttons = [...document.querySelectorAll("[data-tkv-video-id]")];
  const cards = [...document.querySelectorAll("[data-video-card]")];
  const playAll = document.querySelector("[data-play-all]");
  if (!frame || !heading) return;

  const track = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...details });
  };

  const selectVideo = (button) => {
    const { tkvVideoId: id, tkvVideoTitle: title } = button.dataset;
    if (!id) return;
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
    frame.title = title;
    heading.textContent = title;
    buttons.forEach((item) => item.setAttribute("aria-current", String(item === button)));
    cards.forEach((card) => card.classList.toggle("is-current", card.contains(button)));
    document.querySelector(".tkv-featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    track("tkv_video_select", { video_id: id, video_title: title });
  };

  buttons.forEach((button) => button.addEventListener("click", () => selectVideo(button)));
  playAll?.addEventListener("click", () => {
    frame.src = "https://www.youtube-nocookie.com/embed/videoseries?list=UUPDeXtX7koJW_DJ0Lp_iRyg&rel=0&autoplay=1";
    frame.title = "Toàn bộ video công khai của kênh YouTube TKV";
    heading.textContent = "Toàn bộ video công khai của kênh YouTube TKV";
    buttons.forEach((item) => item.setAttribute("aria-current", "false"));
    cards.forEach((card) => card.classList.remove("is-current"));
    track("tkv_video_playlist_open");
  });
  document.querySelectorAll("[data-tkv-source-link]").forEach((link) => link.addEventListener("click", () => track("tkv_video_source_open", { url: link.href })));
})();
