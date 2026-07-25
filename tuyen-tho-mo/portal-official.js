(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const BASE = new URL('.', document.currentScript?.src || new URL('portal-official.js', location.href).href);
  const COVER = ['assets/fb-cover.webp.b64.00','assets/fb-cover.webp.b64.01','assets/fb-cover.webp.b64.02'];
  const AVATAR = ['assets/fb-avatar.webp.b64'];
  const toast = $('[data-toast]');
  let toastTimer;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.hidden = true, 3200);
  }

  async function readB64(parts) {
    const chunks = await Promise.all(parts.map(async part => {
      const res = await fetch(new URL(part, BASE), { cache: 'force-cache' });
      if (!res.ok) throw new Error(part);
      return (await res.text()).trim();
    }));
    return chunks.join('');
  }

  async function loadBrandImages() {
    try {
      const [cover, avatar] = await Promise.all([readB64(COVER), readB64(AVATAR)]);
      document.documentElement.style.setProperty('--fb-cover-photo', `url("data:image/webp;base64,${cover}")`);
      document.documentElement.style.setProperty('--fb-avatar-photo', `url("data:image/webp;base64,${avatar}")`);
      document.documentElement.classList.add('brand-photos-ready');
    } catch (err) {
      console.warn('[ThayLinh] brand photos fallback', err);
    }
  }

  const button = $('[data-menu-button]');
  const nav = $('[data-nav]');
  if (button && nav) {
    button.addEventListener('click', () => {
      const open = nav.dataset.open === 'true';
      nav.dataset.open = String(!open);
      button.setAttribute('aria-expanded', String(!open));
    });
    $$('a', nav).forEach(link => link.addEventListener('click', () => {
      nav.dataset.open = 'false';
      button.setAttribute('aria-expanded', 'false');
    }));
  }

  const template = 'Em muốn kiểm tra điều kiện học nghề mỏ.\n- Năm sinh: ...\n- Chiều cao/cân nặng: ...\n- Sức khỏe hiện tại (mắt, huyết áp, tim mạch): ...';
  $$('[data-copy-template]').forEach(btn => btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(template);
      showToast('Đã sao chép mẫu tin nhắn. Hãy dán vào Zalo hoặc Messenger.');
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = template;
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
      showToast('Đã sao chép mẫu tin nhắn.');
    }
  }));

  $$('[data-contact]').forEach(link => link.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'contact_click', channel: link.dataset.contact, page_path: location.pathname });
  }));

  loadBrandImages();
})();
