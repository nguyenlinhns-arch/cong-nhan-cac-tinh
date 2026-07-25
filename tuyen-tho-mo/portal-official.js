(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const BASE = new URL('.', document.currentScript?.src || new URL('portal-official.js', location.href).href);
  const COVER = ['assets/gallery-longwall-machine.webp.b64'];
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

  function loadExtraAsset(kind, path, marker) {
    if (document.querySelector(`[${marker}]`)) return;
    const url = new URL(path, BASE).href;
    if (kind === 'style') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute(marker, 'true');
      document.head.append(link);
    } else {
      const script = document.createElement('script');
      script.src = url;
      script.defer = true;
      script.setAttribute(marker, 'true');
      document.head.append(script);
    }
  }

  function formatVisiblePhone() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentElement?.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
        return /0963\s*048\s*585|0963048585/.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = node.nodeValue
        .replace(/0963\s*048\s*585/g, '096 304 8585')
        .replace(/0963048585/g, '096 304 8585');
    });
  }

  function removeNegativeCopy() {
    $('.safe-note')?.remove();

    const sourceProof = $('.source-proof');
    if (sourceProof) {
      sourceProof.innerHTML = `
        <div class="wrap source-proof__grid">
          <div><p class="badge badge--dark">Thông tin rõ ràng</p><h2 id="source-proof-title">Người lao động có thể tìm hiểu nhanh, hiểu đúng và liên hệ dễ dàng.</h2></div>
          <div class="source-proof__cards">
            <article><b>Nguồn chính thống</b><p>Tin tuyển sinh và ngành Than được tóm tắt, biên tập và dẫn link gốc để đối chiếu.</p></article>
            <article><b>Quy trình tư vấn nhanh</b><p>Gửi ba thông tin ban đầu để được kiểm tra điều kiện trước khi chuẩn bị hồ sơ.</p></article>
            <article><b>Học và làm việc tại Quảng Ninh</b><p>Người lao động được tư vấn rõ nơi học, thời gian đào tạo, chế độ và lộ trình tiếp nhận từng đợt.</p></article>
          </div>
        </div>`;
    }

    const salaryCard = $('.salary-card');
    if (salaryCard) {
      salaryCard.innerHTML = `
        <p class="badge">Thu nhập & đời sống</p>
        <h3>Tìm hiểu thu nhập và đời sống thợ lò.</h3>
        <p>Thu nhập thực tế phụ thuộc vị trí, ngày công, năng suất và từng đơn vị. Thầy Linh tư vấn để người lao động hiểu rõ trước khi đăng ký.</p>
        <a href="bai-viet/luong-va-doi-song-tho-lo/">Đọc bài về lương và đời sống →</a>`;
    }

    const disclaimer = $('.disclaimer');
    if (disclaimer) {
      disclaimer.textContent = 'Thầy Linh trực tiếp tư vấn điều kiện, hướng dẫn hồ sơ và đồng hành cùng người lao động trong quá trình tìm hiểu nghề mỏ.';
    }

    const leadTitle = $('#lead-card-title');
    if (leadTitle) leadTitle.textContent = 'Bạn muốn kiểm tra điều kiện học nghề mỏ?';

    const leadCopyButton = $('[data-copy-template]');
    if (leadCopyButton) {
      const leadLink = document.createElement('a');
      leadLink.className = leadCopyButton.className;
      leadLink.href = 'https://zalo.me/0963048585';
      leadLink.target = '_blank';
      leadLink.rel = 'noopener';
      leadLink.dataset.contact = 'zalo';
      leadLink.textContent = 'Gửi thông tin để được tư vấn';
      leadLink.style.display = 'flex';
      leadLink.style.alignItems = 'center';
      leadLink.style.justifyContent = 'center';
      leadLink.style.width = '100%';
      leadCopyButton.replaceWith(leadLink);
    }

    const salaryAnswerTitle = [...document.querySelectorAll('.answer-grid h3')].find(el => /Lương thợ lò/.test(el.textContent || ''));
    if (salaryAnswerTitle) {
      salaryAnswerTitle.textContent = 'Thu nhập thợ lò được tính như thế nào?';
      const p = salaryAnswerTitle.nextElementSibling;
      if (p) p.textContent = 'Thu nhập phụ thuộc vị trí, ngày công, năng suất và từng đơn vị. Người lao động được tư vấn kỹ trước khi đăng ký.';
    }

    formatVisiblePhone();
  }

  function injectQuickContact() {
    if (document.querySelector('.quick-contact')) return;
    const nav = document.createElement('nav');
    nav.className = 'quick-contact';
    nav.setAttribute('aria-label', 'Liên hệ nhanh với Thầy Linh');
    nav.innerHTML = `
      <a class="quick-contact__zalo" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo"><b>Zalo</b><span>096 304 8585</span></a>
      <a class="quick-contact__messenger" href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener" data-contact="messenger"><b>Messenger</b><span>Nhắn tin ngay</span></a>
      <a class="quick-contact__call" href="tel:+84963048585" data-contact="phone"><b>Gọi</b><span>096 304 8585</span></a>`;
    document.body.append(nav);
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

  removeNegativeCopy();
  injectQuickContact();

  $$('[data-contact]').forEach(link => link.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'contact_click',
      channel: link.dataset.contact,
      page_path: location.pathname
    });
  }));

  loadBrandImages();
  loadExtraAsset('style', 'media-rich.css', 'data-rich-media-style');
  loadExtraAsset('script', 'media-rich.js', 'data-rich-media-script');
})();