(() => {
  'use strict';

  const PAGE_URL = 'https://www.facebook.com/thaylinhtuyenthomo/';
  const PHOTO_URL = 'https://www.facebook.com/thaylinhtuyenthomo/photos/';
  const VIDEO_URL = 'https://www.facebook.com/thaylinhtuyenthomo/videos/';
  const REELS_URL = 'https://www.facebook.com/thaylinhtuyenthomo/reels/';
  const EMBED_URL = 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fthaylinhtuyenthomo%2F&tabs=timeline&width=500&height=720&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false';

  function pushEvent(action, context = 'fanpage-media') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'fanpage_media_action',
      action,
      context,
      page_path: location.pathname
    });
  }

  function card(icon, eyebrow, title, description, href, action) {
    return `
      <a class="fanpage-media-card" href="${href}" target="_blank" rel="noopener noreferrer"
         data-fanpage-action="${action}" aria-label="${title} trên Facebook">
        <span class="fanpage-media-card__visual fanpage-media-card__visual--${icon}" aria-hidden="true">
          <span></span><i></i><b></b>
        </span>
        <span class="fanpage-media-card__body">
          <small>${eyebrow}</small>
          <strong>${title}</strong>
          <span>${description}</span>
          <em>Mở trên Facebook →</em>
        </span>
      </a>`;
  }

  function sectionMarkup() {
    return `
      <section class="section section--fanpage" id="anh-video" aria-labelledby="fanpage-media-title" data-fanpage-section>
        <div class="section-heading section-heading--fanpage">
          <div>
            <p class="eyebrow">NỘI DUNG THẬT TỪ FANPAGE</p>
            <h2 id="fanpage-media-title">Ảnh & video hoạt động thực tế</h2>
          </div>
          <p>Hình ảnh công tác, video tư vấn, câu chuyện công nhân và các nội dung mới được dẫn trực tiếp từ fanpage <strong>Thầy Linh – Tuyển Thợ Mỏ</strong>.</p>
        </div>

        <div class="fanpage-media-layout">
          <div class="fanpage-media-left">
            <div class="fanpage-media-grid">
              ${card('photo', 'HÌNH ẢNH', 'Album hoạt động', 'Hội nghị, tư vấn địa phương, học viên và môi trường thực tế.', PHOTO_URL, 'open_photos')}
              ${card('video', 'VIDEO DÀI', 'Video tư vấn', 'Giải đáp điều kiện, chế độ, hồ sơ và câu chuyện người lao động.', VIDEO_URL, 'open_videos')}
              ${card('reel', 'VIDEO NGẮN', 'Reels mới nhất', 'Nội dung ngắn, dễ xem trên điện thoại và được cập nhật từ fanpage.', REELS_URL, 'open_reels')}
            </div>

            <div class="fanpage-media-trust">
              <span><b>01</b> Nội dung công khai từ đúng fanpage</span>
              <span><b>02</b> Không tải lại hoặc chỉnh sửa sai ngữ cảnh</span>
              <span><b>03</b> Có đường dẫn về bài gốc để đối chiếu</span>
            </div>

            <div class="fanpage-media-actions">
              <a class="fanpage-media-button fanpage-media-button--primary" href="${PAGE_URL}" target="_blank" rel="noopener noreferrer" data-fanpage-action="open_page">Theo dõi Fanpage</a>
              <a class="fanpage-media-button" href="anh-video-thuc-te/" data-fanpage-action="open_media_page">Xem trang ảnh & video</a>
            </div>
          </div>

          <div class="fanpage-embed-shell" data-facebook-shell>
            <div class="fanpage-embed-placeholder">
              <span class="fanpage-facebook-mark" aria-hidden="true">f</span>
              <small>THẦY LINH – TUYỂN THỢ MỎ</small>
              <h3>Xem dòng thời gian ngay trên website</h3>
              <p>Để giữ website tải nhanh và hạn chế kết nối bên thứ ba không cần thiết, nội dung Facebook chỉ được tải sau khi bạn bấm nút.</p>
              <button type="button" class="fanpage-media-button fanpage-media-button--facebook" data-facebook-load>Hiển thị ảnh & video từ Facebook</button>
              <a href="${PAGE_URL}" target="_blank" rel="noopener noreferrer" class="fanpage-embed-fallback" data-fanpage-action="fallback_page">Hoặc mở trực tiếp Fanpage →</a>
            </div>
          </div>
        </div>
      </section>`;
  }

  function injectHomeSection() {
    const about = document.querySelector('#toi-la-ai');
    if (!about || document.querySelector('[data-fanpage-section]')) return;
    about.insertAdjacentHTML('afterend', sectionMarkup());

    const nav = document.querySelector('[data-menu]');
    if (nav && !nav.querySelector('a[href$="#anh-video"]')) {
      const link = document.createElement('a');
      link.href = 'index.html#anh-video';
      link.textContent = 'Ảnh & video';
      const provinceLink = [...nav.querySelectorAll('a')].find(item => item.getAttribute('href')?.includes('#theo-tinh'));
      nav.insertBefore(link, provinceLink || null);
      link.addEventListener('click', () => {
        nav.dataset.open = 'false';
        const toggle = document.querySelector('[data-menu-toggle]');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function loadFacebook(shell, button) {
    if (!shell || shell.dataset.loaded === 'true') return;
    shell.dataset.loaded = 'true';
    button.disabled = true;
    button.textContent = 'Đang tải nội dung Facebook…';

    const iframe = document.createElement('iframe');
    iframe.className = 'fanpage-embed-frame';
    iframe.title = 'Dòng thời gian công khai của fanpage Thầy Linh – Tuyển Thợ Mỏ';
    iframe.src = EMBED_URL;
    iframe.width = '500';
    iframe.height = '720';
    iframe.loading = 'lazy';
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';

    const loading = document.createElement('div');
    loading.className = 'fanpage-embed-loading';
    loading.innerHTML = '<span></span><p>Đang kết nối tới nội dung công khai trên Facebook…</p>';

    shell.replaceChildren(loading);
    shell.append(iframe);

    iframe.addEventListener('load', () => {
      loading.remove();
      pushEvent('embed_loaded');
    }, { once: true });

    setTimeout(() => {
      if (loading.isConnected) {
        loading.innerHTML = `<p>Facebook có thể bị chặn bởi cài đặt trình duyệt. <a href="${PAGE_URL}" target="_blank" rel="noopener noreferrer">Mở Fanpage trực tiếp →</a></p>`;
      }
    }, 8000);

    pushEvent('load_embed');
  }

  function bind() {
    document.querySelectorAll('[data-facebook-load]').forEach(button => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => loadFacebook(button.closest('[data-facebook-shell]'), button));
    });

    document.querySelectorAll('[data-fanpage-action]').forEach(link => {
      if (link.dataset.trackingBound === 'true') return;
      link.dataset.trackingBound = 'true';
      link.addEventListener('click', () => pushEvent(link.dataset.fanpageAction || 'unknown'));
    });
  }

  injectHomeSection();
  bind();
})();