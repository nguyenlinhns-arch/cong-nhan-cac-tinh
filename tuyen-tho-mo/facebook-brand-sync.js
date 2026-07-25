(() => {
  'use strict';

  const PAGE_URL = 'https://www.facebook.com/thaylinhtuyenthomo/';
  const PLUGIN_BASE = 'https://www.facebook.com/plugins/page.php';

  const pluginUrl = ({ tabs = '', width = 500, height = 360, smallHeader = false, hideCover = false }) => {
    const params = new URLSearchParams({
      href: PAGE_URL,
      tabs,
      width: String(width),
      height: String(height),
      small_header: String(smallHeader),
      adapt_container_width: 'true',
      hide_cover: String(hideCover),
      show_facepile: 'false'
    });
    return `${PLUGIN_BASE}?${params.toString()}`;
  };

  const createIframe = ({ src, title, className, width, height }) => {
    const iframe = document.createElement('iframe');
    iframe.className = className;
    iframe.src = src;
    iframe.title = title;
    iframe.width = String(width);
    iframe.height = String(height);
    iframe.loading = 'lazy';
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    return iframe;
  };

  const pushEvent = (action, context) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'facebook_brand_action',
      action,
      context,
      page_path: location.pathname
    });
  };

  const isHomepage = Boolean(document.querySelector('.hero') && document.querySelector('#toi-la-ai'));
  if (!isHomepage || document.documentElement.dataset.facebookBrandSync === 'true') return;

  document.documentElement.dataset.facebookBrandSync = 'true';
  document.documentElement.classList.add('facebook-brand-synced');

  const theme = document.querySelector('meta[name="theme-color"]');
  if (theme) theme.setAttribute('content', '#0754aa');

  const brandMark = document.querySelector('.brand-mark');
  if (brandMark) {
    brandMark.classList.add('brand-mark--facebook');
    brandMark.setAttribute('aria-label', 'Thầy Linh – Tuyển Thợ Mỏ');
  }

  const heroVisual = document.querySelector('.hero__visual');
  if (heroVisual) {
    heroVisual.replaceChildren();
    heroVisual.classList.add('hero__visual--facebook');
    heroVisual.dataset.facebookBrandHero = 'true';

    const shell = document.createElement('div');
    shell.className = 'facebook-cover-card';

    const fallback = document.createElement('div');
    fallback.className = 'facebook-cover-fallback';
    fallback.innerHTML = `
      <span class="facebook-cover-rings" aria-hidden="true"></span>
      <span class="facebook-cover-miner" aria-hidden="true"></span>
      <div class="facebook-cover-fallback__copy">
        <small>THẦY LINH</small>
        <strong>TUYỂN THỢ MỎ</strong>
        <span>Nghề thợ mỏ · Vinh quang · Trách nhiệm</span>
      </div>`;

    const viewport = document.createElement('div');
    viewport.className = 'facebook-cover-viewport';
    viewport.append(createIframe({
      src: pluginUrl({ tabs: '', width: 500, height: 360, smallHeader: false, hideCover: false }),
      title: 'Ảnh đại diện và ảnh bìa chính thức của Fanpage Thầy Linh – Tuyển Thợ Mỏ',
      className: 'facebook-cover-frame',
      width: 500,
      height: 360
    }));

    const identity = document.createElement('div');
    identity.className = 'facebook-cover-identity';
    identity.innerHTML = `
      <div>
        <small>NHẬN DIỆN CHÍNH THỨC</small>
        <strong>Đồng bộ trực tiếp với Fanpage</strong>
        <span>Ảnh đại diện và ảnh bìa sẽ tự cập nhật khi Fanpage thay đổi.</span>
      </div>
      <a href="${PAGE_URL}" target="_blank" rel="noopener noreferrer" data-facebook-brand-link="hero">Mở Fanpage <span aria-hidden="true">↗</span></a>`;

    const context = document.createElement('p');
    context.className = 'facebook-cover-context';
    context.innerHTML = '<strong>Lưu ý về thu nhập:</strong> các con số trên hình ảnh truyền thông là mức tham khảo; thực tế phụ thuộc vị trí, ngày công, năng suất và đơn vị.';

    shell.append(fallback, viewport, identity, context);
    heroVisual.append(shell);
  }

  const aboutPortrait = document.querySelector('.about-portrait');
  if (aboutPortrait) {
    aboutPortrait.replaceChildren();
    aboutPortrait.classList.add('about-portrait--facebook');
    aboutPortrait.dataset.facebookBrandProfile = 'true';

    const fallback = document.createElement('div');
    fallback.className = 'facebook-profile-fallback';
    fallback.innerHTML = '<span>TL</span><small>THẦY LINH</small><strong>TUYỂN THỢ MỎ</strong>';

    const frame = createIframe({
      src: pluginUrl({ tabs: '', width: 500, height: 190, smallHeader: true, hideCover: true }),
      title: 'Ảnh đại diện chính thức của Fanpage Thầy Linh – Tuyển Thợ Mỏ',
      className: 'facebook-profile-frame',
      width: 500,
      height: 190
    });

    const caption = document.createElement('div');
    caption.className = 'facebook-profile-caption';
    caption.innerHTML = `
      <small>ẢNH ĐẠI DIỆN FANPAGE</small>
      <strong>Nguyễn Tử Linh</strong>
      <span>Thầy Linh – Tuyển Thợ Mỏ</span>
      <a href="${PAGE_URL}" target="_blank" rel="noopener noreferrer" data-facebook-brand-link="about">Xem trang chính thức →</a>`;

    aboutPortrait.append(fallback, frame, caption);
  }

  document.querySelectorAll('[data-facebook-brand-link]').forEach(link => {
    link.addEventListener('click', () => pushEvent('open_fanpage', link.dataset.facebookBrandLink || 'unknown'));
  });
})();
