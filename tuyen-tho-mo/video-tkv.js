(() => {
  const frameHost = document.querySelector(".tkv-featured__frame");
  const facade = document.querySelector("[data-featured-facade]");
  const heading = document.querySelector("[data-featured-title]");
  const buttons = [...document.querySelectorAll("[data-tkv-video-id]")];
  const cards = [...document.querySelectorAll("[data-video-card]")];
  const playAll = document.querySelector("[data-play-all]");
  if (!frameHost || !heading) return;

  const track = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...details });
  };

  const mountPlayer = ({ src, title }) => {
    const frame = document.createElement("iframe");
    frame.src = src;
    frame.title = title;
    frame.loading = "eager";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.setAttribute("allowfullscreen", "");
    frameHost.replaceChildren(frame);
    heading.textContent = title;
  };

  facade?.addEventListener("click", () => {
    const id = facade.dataset.featuredVideoId;
    const title = facade.dataset.featuredVideoTitle || "Video từ kênh YouTube TKV";
    if (!id) return;
    mountPlayer({ src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`, title });
    track("tkv_video_play", { video_id: id, video_title: title, context: "featured_facade" });
  });

  const selectVideo = (button) => {
    const { tkvVideoId: id, tkvVideoTitle: title } = button.dataset;
    if (!id) return;
    mountPlayer({ src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`, title });
    buttons.forEach((item) => item.setAttribute("aria-current", String(item === button)));
    cards.forEach((card) => card.classList.toggle("is-current", card.contains(button)));
    document.querySelector(".tkv-featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    track("tkv_video_select", { video_id: id, video_title: title });
  };

  buttons.forEach((button) => button.addEventListener("click", () => selectVideo(button)));
  playAll?.addEventListener("click", () => {
    mountPlayer({
      src: "https://www.youtube-nocookie.com/embed/videoseries?list=UUPDeXtX7koJW_DJ0Lp_iRyg&rel=0&autoplay=1",
      title: "Toàn bộ video công khai của kênh YouTube TKV",
    });
    buttons.forEach((item) => item.setAttribute("aria-current", "false"));
    cards.forEach((card) => card.classList.remove("is-current"));
    track("tkv_video_playlist_open");
  });
  document.querySelectorAll("[data-tkv-source-link]").forEach((link) => link.addEventListener("click", () => track("tkv_video_source_open", { url: link.href })));
})();
