(() => {
  "use strict";

  const proof = document.querySelector(".home-proof.home-proof--early, .home-proof");
  if (!proof || document.querySelector("[data-home-province-reels]")) return;

  if (!document.querySelector("link[data-home-province-reels-css]")) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/home-province-reels.css?v=20260823-1";
    css.dataset.homeProvinceReelsCss = "";
    document.head.append(css);
  }

  const reels = [
    {
      province: "Gia Lai · xã Ia RDeh",
      title: "Từ Ia RDeh đến vùng mỏ Quảng Ninh",
      description: "Nhà trường trực tiếp về địa phương tư vấn, kết nối chính quyền và doanh nghiệp để người lao động hiểu rõ nơi học, nghề học và cơ hội nhận việc sau đào tạo.",
      url: "https://www.facebook.com/reel/988978737487363",
      embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F988978737487363%2F&show_text=false&width=500",
      page: "/viec-lam-nganh-than/gia-lai/",
      pageLabel: "Cơ hội tại Gia Lai",
    },
    {
      province: "Quảng Ngãi · hành trình nhập học",
      title: "Hành trình từ Quảng Ngãi đến vùng Than",
      description: "Theo chân người lao động từ quê nhà đến Quảng Ninh để thấy rõ quá trình lên đường, nhập học, học nghề và bắt đầu một hướng đi việc làm mới.",
      url: "https://www.facebook.com/reel/1015675787556708",
      embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1015675787556708%2F&show_text=false&width=500",
      page: "/viec-lam-nganh-than/quang-ngai/",
      pageLabel: "Cơ hội tại Quảng Ngãi",
    },
  ];

  const section = document.createElement("section");
  section.className = "home-province-reels";
  section.id = "hanh-trinh-dia-phuong";
  section.dataset.homeProvinceReels = "";
  section.dataset.journeySection = "province_reels";
  section.setAttribute("aria-labelledby", "home-province-reels-title");
  section.innerHTML = `
    <div class="container">
      <div class="home-province-reels__head">
        <div><p class="home-step">Hành trình tuyển sinh thực tế</p><h2 id="home-province-reels-title">Từ quê nhà đến vùng mỏ Quảng Ninh</h2></div>
        <p class="home-province-reels__intro">Hai câu chuyện tại Gia Lai và Quảng Ngãi giúp người lao động nhìn thấy một lộ trình có thật: được tư vấn tại quê nhà, đến nơi học nghề và tiến tới nhận việc tại vùng Than.</p>
      </div>
      <div class="home-province-reels__grid" aria-label="Video hành trình từ địa phương đến vùng mỏ">
        ${reels.map((reel, index) => `
          <article class="home-province-reel">
            <div class="home-province-reel__media" data-province-reel-host>
              <button class="home-province-reel__facade" type="button" data-province-reel-play="${index}" aria-label="Phát video ${reel.title}">
                <span class="home-province-reel__play" aria-hidden="true">▶</span>
                <span class="home-province-reel__watch">Bấm để xem video · ${reel.province}</span>
              </button>
            </div>
            <div class="home-province-reel__copy">
              <small>${reel.province}</small>
              <h3>${reel.title}</h3>
              <p>${reel.description}</p>
              <div class="home-province-reel__links">
                <a href="${reel.url}" target="_blank" rel="noopener noreferrer" data-province-reel-link="facebook_${index + 1}">Mở trên Facebook →</a>
                <a href="${reel.page}" data-province-reel-link="province_${index + 1}">${reel.pageLabel}</a>
              </div>
            </div>
          </article>`).join("")}
      </div>
      <div class="home-province-reels__cta">
        <p><strong>Ở tỉnh xa vẫn có thể đăng ký từ quê nhà.</strong>Gửi năm sinh, chiều cao, cân nặng, sức khỏe và tỉnh đang sống để được kiểm tra trước khi lên đường.</p>
        <div class="home-province-reels__actions">
          <a href="#tu-kiem-tra" data-province-reel-action="condition">Kiểm tra điều kiện</a>
          <a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="home-province-reels" data-province-reel-action="zalo">Nhắn Thầy Linh</a>
        </div>
      </div>
    </div>`;

  proof.insertAdjacentElement("afterend", section);

  if (!document.querySelector("script[data-home-province-reels-schema]")) {
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.homeProvinceReelsSchema = "";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": reels.map((reel, index) => ({
        "@type": "VideoObject",
        "@id": `https://thaylinhtuyenthomo.vn/#hanh-trinh-dia-phuong-video-${index + 1}`,
        name: reel.title,
        description: reel.description,
        contentUrl: reel.url,
        embedUrl: reel.embedUrl,
        inLanguage: "vi-VN",
        author: { "@id": "https://thaylinhtuyenthomo.vn/tac-gia/nguyen-tu-linh/#person" },
      })),
    });
    document.head.append(schema);
  }

  if (location.hash === "#hanh-trinh-dia-phuong") {
    requestAnimationFrame(() => section.scrollIntoView({ block: "start" }));
  }

  const track = (event, payload = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page_path: location.pathname, ...payload });
  };

  section.addEventListener("click", (event) => {
    const play = event.target.closest?.("[data-province-reel-play]");
    if (play) {
      const index = Number(play.dataset.provinceReelPlay);
      const reel = reels[index];
      const host = play.closest("[data-province-reel-host]");
      if (reel && host) {
        const frame = document.createElement("iframe");
        frame.title = reel.title;
        frame.src = reel.embedUrl;
        frame.width = "500";
        frame.height = "889";
        frame.scrolling = "no";
        frame.frameBorder = "0";
        frame.loading = "eager";
        frame.allowFullscreen = true;
        frame.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        host.replaceChildren(frame);
        track("home_province_reel_play", { video: index + 1, province: reel.province });
      }
      return;
    }

    const link = event.target.closest?.("[data-province-reel-link]");
    if (link) track("home_province_reel_click", { destination: link.dataset.provinceReelLink || "unknown" });
    const action = event.target.closest?.("[data-province-reel-action]");
    if (action) track("home_province_reel_action", { action: action.dataset.provinceReelAction || "unknown" });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      track("home_province_reels_view");
      observer.disconnect();
    }, { rootMargin: "-10% 0px -35%", threshold: 0.15 });
    observer.observe(section);
  }
})();
