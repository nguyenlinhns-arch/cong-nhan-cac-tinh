(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuToggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const toast = $('[data-toast]');
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

  let attribution = {};
  try {
    const params = new URLSearchParams(location.search);
    const current = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      province: document.documentElement.dataset.province || null,
      landing_path: location.pathname,
      first_seen_at: new Date().toISOString()
    };
    attribution = JSON.parse(localStorage.getItem('thaylinh_attribution') || '{}');
    if (!attribution.first_seen_at) {
      attribution = Object.fromEntries(Object.entries(current).filter(([, value]) => value));
      localStorage.setItem('thaylinh_attribution', JSON.stringify(attribution));
    }
  } catch (_) {}

  $$('[data-contact]').forEach(link => {
    link.addEventListener('click', () => {
      const event = {
        event: 'contact_click',
        channel: link.dataset.contact,
        context: link.dataset.context || 'unknown',
        page_path: location.pathname,
        ...attribution
      };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(event);
    });
  });

  // Tải mô-đun bổ sung theo đường dẫn của chính app.js,
  // để hoạt động đúng cả ở trang chủ và các trang con theo tỉnh.
  try {
    const scriptUrl = document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : new URL('app.js', location.href).href;
    const assetBase = new URL('.', scriptUrl);

    const loadStyle = (href, marker) => {
      if (document.querySelector(`link[${marker}]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL(href, assetBase).href;
      link.setAttribute(marker, 'true');
      document.head.append(link);
    };

    const loadScript = (src, marker) => {
      if (document.querySelector(`script[${marker}]`)) return;
      const script = document.createElement('script');
      script.src = new URL(src, assetBase).href;
      script.defer = true;
      script.setAttribute(marker, 'true');
      document.head.append(script);
    };

    loadStyle('facebook-brand.css?v=2', 'data-facebook-brand-style');
    loadScript('facebook-brand.js?v=2', 'data-facebook-brand-script');
    loadStyle('fanpage-media.css', 'data-fanpage-media-style');
    loadScript('fanpage-media.js', 'data-fanpage-media-script');
  } catch (_) {}
})();
