(() => {
  "use strict";

  const proof = document.querySelector(".home-proof.home-proof--early, .home-proof");
  if (!proof || document.querySelector("[data-home-province-reels]")) return;

  if (!document.querySelector("link[data-home-province-reels-css]")) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/home-province-reels.css?v=20260822-2";
    css.dataset.homeProvinceReelsCss = "";
    document.head.append(css);
  }

  const reels = [
    {
      province: "Gia Lai · xã Ia RDeh",
      title: "Từ Ia RDeh đến vùng mỏ Quảng Ninh",
      description: "Nhà trường trực tiếp về địa phương tư vấn, kết nối chính quyền và doanh nghiệp để người lao động hiểu rõ nơi học, nghề học và cơ hội nhận việc sau đào tạo.",
      url: "https://www.facebook.com/reel/988978737487363",
      page: "/viec-lam-nganh-than/gia-lai/",
      pageLabel: "Cơ hội tại Gia Lai",
      poster: "/assets/vinacomin-hoc-vien-quang-hanh-ao-xanh-doi-mu.webp",
      alt: "Học viên nghề mỏ tại Quang Hanh trong hành trình từ địa phương đến vùng mỏ",
    },
    {
      province: "Quảng Ngãi · hành trình nhập học",
      title: "Hành trình từ Quảng Ngãi đến vùng Than",
      description: "Theo chân người lao động từ quê nhà đến Quảng Ninh để thấy rõ quá trình lên đường, nhập học, học nghề và bắt đầu một hướng đi việc làm mới.",
      url: "https://www.facebook.com/reel/1015675787556708",
      page: "/viec-lam-nganh-than/quang-ngai/",
      pageLabel: "Cơ hội tại Quảng Ngãi",
      poster: "/assets/vinacomin-tho-lo-than-thong-nhat-ngoai-khai-truong.webp",
      alt: "Công nhân ngành Than mặc bảo hộ xanh tại khai trường Quảng Ninh",
    },
  ];

  const section = document.createElement("section");
  section.className = "home-province-reels";
  section.id = "hanh-trinh-dia-phuong";
  section.dataset.homeProvinceReels = "";
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
              <button class="home-province-reel__facade" type="button" data-province-reel-play data-reel-url="${reel.url}" data-reel-position="${index + 1}" aria-label="Phát video: ${reel.title}">
                <img src="${reel.poster}" alt="${reel.alt}" loading="lazy" decoding="async">
                <span class="home-province-reel__play" aria-hidden="true">▶</span>
                <span class="home-province-reel__watch">Bấm để xem video thực tế</span>
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
      const host = play.closest("[data-province-reel-host]");
      const iframe = document.createElement("iframe");
      const reelUrl = `${play.dataset.reelUrl}/`;
      iframe.title = play.getAttribute("aria-label")?.replace("Phát video: ", "") || "Video hành trình đến vùng mỏ";
      iframe.src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reelUrl)}&show_text=false&width=500`;
      iframe.width = "500";
      iframe.height = "889";
      iframe.allowFullscreen = true;
      iframe.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      host.replaceChildren(iframe);
      track("home_province_reel_play", { reel_position: play.dataset.reelPosition || "unknown" });
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