(() => {
  'use strict';

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

  function removeLegacyExplainers() {
    document.querySelectorAll('[data-facebook-brand-section], #dong-bo-fanpage').forEach(section => section.remove());
    document.querySelectorAll('a[href*="#dong-bo-fanpage"]').forEach(link => link.remove());
  }

  removeLegacyExplainers();
  hydrateBrandImages();
})();
