(() => {
  'use strict';

  const PAGE_URL = 'https://www.facebook.com/thaylinhtuyenthomo/';
  const MSG_URL = 'https://m.me/thaylinhtuyenthomo';
  const COVER_PARTS = [
    'assets/fb-cover.webp.b64.00',
    'assets/fb-cover.webp.b64.01',
    'assets/fb-cover.webp.b64.02'
  ];
  const AVATAR_PARTS = ['assets/fb-avatar.webp.b64'];

  const currentScript = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : new URL('facebook-brand.js', location.href).href;
  const assetBase = new URL('.', currentScript);

  function track(action) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'facebook_brand_action',
      action,
      page_path: location.pathname
    });
  }

  async function loadBase64(parts) {
    const texts = await Promise.all(parts.map(async (part) => {
      const response = await fetch(new URL(part, assetBase), { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Cannot load ${part}`);
      return (await response.text()).trim();
    }));
    return texts.join('');
  }

  async function hydrateBrandImages() {
    try {
      const [cover, avatar] = await Promise.all([
        loadBase64(COVER_PARTS),
        loadBase64(AVATAR_PARTS)
      ]);
      document.documentElement.style.setProperty('--fb-cover-photo', `url("data:image/webp;base64,${cover}")`);
      document.documentElement.style.setProperty('--fb-avatar-photo', `url("data:image/webp;base64,${avatar}")`);
      document.documentElement.classList.add('fb-brand-ready');
    } catch (error) {
      console.warn('[ThayLinh] Không tải được ảnh nhận diện Facebook', error);
    }
  }

  function section() {
    return `
      <section class="fb-brand-sync" id="dong-bo-fanpage" aria-labelledby="fb-brand-title" data-facebook-brand-section>
        <div class="fb-brand-sync__grid">
          <figure class="fb-brand-cover" role="img" aria-label="Ảnh bìa Fanpage Thầy Linh – Tuyển Thợ Mỏ tại hoạt động gặp mặt công nhân ngành Than">
            <figcaption class="fb-brand-cover__label">
              <small>ẢNH BÌA FANPAGE</small>
              <strong>Người thật, hoạt động thật, không khí ngành Than thật</strong>
            </figcaption>
          </figure>
          <div class="fb-brand-panel">
            <div class="fb-brand-avatar" role="img" aria-label="Ảnh đại diện Thầy Linh trên Fanpage"></div>
            <p class="eyebrow">ĐỒNG BỘ WEBSITE VỚI FACEBOOK</p>
            <h2 id="fb-brand-title">Nhìn website là nhận ra Fanpage Thầy Linh</h2>
            <p>Ảnh đại diện và ảnh bìa Facebook được đưa vào website ở vị trí vừa đủ: tạo nhận diện, tăng độ tin cậy, nhưng không làm rối nội dung chính là kiểm tra điều kiện và tư vấn tuyển sinh.</p>
            <div class="fb-brand-points">
              <span><b>1</b> Ảnh đại diện dùng cho nhận diện cá nhân “Thầy Linh”.</span>
              <span><b>2</b> Ảnh bìa dùng làm bằng chứng hoạt động thực tế ngành Than.</span>
              <span><b>3</b> CTA vẫn tập trung vào Zalo và Messenger để tư vấn nhanh.</span>
            </div>
            <div class="fb-brand-actions">
              <a class="fb-brand-link fb-brand-link--primary" href="${MSG_URL}" target="_blank" rel="noopener noreferrer" data-facebook-brand-action="message">Nhắn Messenger</a>
              <a class="fb-brand-link" href="${PAGE_URL}" target="_blank" rel="noopener noreferrer" data-facebook-brand-action="open_fanpage">Mở Fanpage</a>
            </div>
          </div>
        </div>
      </section>`;
  }

  function inject() {
    if (document.querySelector('[data-facebook-brand-section]')) return;
    const trust = document.querySelector('.trust-strip');
    const hero = document.querySelector('.hero');
    const target = trust || hero;
    if (!target) return;
    target.insertAdjacentHTML('afterend', section());

    const nav = document.querySelector('[data-menu]');
    if (nav && !nav.querySelector('a[href$="#dong-bo-fanpage"]')) {
      const link = document.createElement('a');
      link.href = 'index.html#dong-bo-fanpage';
      link.textContent = 'Ảnh FB';
      const about = [...nav.querySelectorAll('a')].find(item => item.getAttribute('href')?.includes('#toi-la-ai'));
      nav.insertBefore(link, about || null);
      link.addEventListener('click', () => {
        nav.dataset.open = 'false';
        const toggle = document.querySelector('[data-menu-toggle]');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }

    document.querySelectorAll('[data-facebook-brand-action]').forEach(link => {
      link.addEventListener('click', () => track(link.dataset.facebookBrandAction || 'unknown'));
    });
  }

  inject();
  hydrateBrandImages();
})();
