(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuToggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const toast = $('[data-toast]');
  const PREFILL_KEY = 'thaylinh_application_province_prefill_v1';
  const CENTRAL_APPLICATION_PATH = '/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/';
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menu.dataset.open === 'true';
      menu.dataset.open = String(!isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Mở menu' : 'Đóng menu');
    });
    $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
      menu.dataset.open = 'false';
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Keep internal application links crawl-clean. Province context is carried for one
  // navigation in sessionStorage, then exposed only long enough for job-application.js
  // to prefill the select field. This avoids publishing crawlable ?province= variants.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-prefill-province]');
    if (!link) return;
    const province = String(link.dataset.prefillProvince || '').trim();
    if (!province) return;
    try { sessionStorage.setItem(PREFILL_KEY, province); } catch (_) {}
  });

  if (location.pathname === CENTRAL_APPLICATION_PATH && !new URLSearchParams(location.search).has('province')) {
    let storedProvince = '';
    try {
      storedProvince = String(sessionStorage.getItem(PREFILL_KEY) || '').trim();
      if (storedProvince) sessionStorage.removeItem(PREFILL_KEY);
    } catch (_) {}
    if (storedProvince) {
      const url = new URL(location.href);
      url.searchParams.set('province', storedProvince);
      history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
      setTimeout(() => {
        const clean = new URL(location.href);
        clean.searchParams.delete('province');
        history.replaceState(history.state, '', `${clean.pathname}${clean.search}${clean.hash}`);
      }, 0);
    }
  }

  const template = 'Em muốn kiểm tra điều kiện học nghề mỏ.\n- Năm sinh: ...\n- Chiều cao/cân nặng: ...\n- Sức khỏe hiện tại (mắt, huyết áp, tim mạch): ...';
  $$('[data-copy-template]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(template);
        showToast('Đã sao chép mẫu. Hãy dán vào Zalo hoặc Messenger.');
      } catch (_) {
        const area = document.createElement('textarea');
        area.value = template;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.append(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        showToast('Đã sao chép mẫu tin nhắn.');
      }
    });
  });

})();
