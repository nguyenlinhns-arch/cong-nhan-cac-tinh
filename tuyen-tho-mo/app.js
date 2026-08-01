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

})();
