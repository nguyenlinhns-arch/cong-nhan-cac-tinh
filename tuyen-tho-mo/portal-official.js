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

  function injectProvinceVideoShowcase() {
    const mediaSection = $('#anh-video');
    const showcase = $('.media-showcase', mediaSection || document);
    if (!mediaSection || !showcase || showcase.dataset.provinceVideos === 'true') return;

    const title = $('.media-copy h2', mediaSection);
    if (title) title.textContent = 'Xem video câu chuyện công nhân theo tỉnh.';
    const copy = $('.media-copy p:not(.badge)', mediaSection);
    if (copy) copy.textContent = 'Các video được chọn từ kênh YouTube để người lao động xem hình ảnh thật, câu chuyện thật và đời sống vùng mỏ trước khi nhắn tư vấn.';
    const ghost = $('.media-actions .btn--ghost', mediaSection);
    if (ghost) {
      ghost.href = 'https://www.youtube.com/channel/UCjQmG8ShxuD_qf_o6YGWz8w';
      ghost.textContent = 'Mở kênh YouTube';
    }

    const videos = [
      { id: 'ts41cqu7r9c', province: 'Thanh Hóa', title: 'Chàng trai Mường Lát lập nghiệp từ nghề mỏ', large: true },
      { id: 'TIDiY-Nuo_4', province: 'Thanh Hóa · Quảng Ninh', title: 'Hành trình an cư, lập nghiệp tại vùng đất Mỏ' },
      { id: 'ZynHtWJvyUs', province: 'Câu chuyện công nhân', title: 'Gắn bó với ngành Than là một quyết định đúng đắn' },
      { id: 't7ekLxtWRLE', province: 'Đời sống thợ mỏ', title: 'An cư, lập nghiệp cùng ngành Than' }
    ];

    showcase.dataset.provinceVideos = 'true';
    showcase.className = 'media-showcase province-video-showcase';
    showcase.innerHTML = videos.map(video => `
      <article class="province-video-card${video.large ? ' province-video-card--large' : ''}">
        <div class="province-video-frame">
          <iframe loading="lazy" title="${video.title}" src="https://www.youtube-nocookie.com/embed/${video.id}?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div class="province-video-caption"><small>${video.province}</small><strong>${video.title}</strong></div>
      </article>`).join('');
  }

  function injectContactPanel() {
    if (document.querySelector('.contact-panel')) return;
    const hero = $('.hero');
    if (!hero) return;
    const section = document.createElement('section');
    section.className = 'contact-panel';
    section.id = 'lien-he-nhanh';
    section.innerHTML = `
      <div class="wrap contact-panel__inner">
        <div class="contact-panel__copy">
          <p class="badge badge--dark">Liên hệ nhanh</p>
          <h2>Gửi 3 thông tin để được tư vấn ngay.</h2>
          <p>Chỉ cần năm sinh, chiều cao/cân nặng và tình trạng sức khỏe. Thầy Linh sẽ kiểm tra sơ bộ và hướng dẫn bước tiếp theo.</p>
        </div>
        <div class="contact-panel__actions" aria-label="Chọn kênh liên hệ">
          <a class="contact-panel__zalo" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo"><b>Zalo</b><span>096 304 8585</span></a>
          <a class="contact-panel__messenger" href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener" data-contact="messenger"><b>Messenger</b><span>Nhắn tin ngay</span></a>
          <a class="contact-panel__call" href="tel:+84963048585" data-contact="phone"><b>Gọi trực tiếp</b><span>096 304 8585</span></a>
        </div>
        <ol class="contact-panel__steps" aria-label="Ba thông tin cần gửi">
          <li><span>1</span>Năm sinh</li>
          <li><span>2</span>Chiều cao / cân nặng</li>
          <li><span>3</span>Sức khỏe hiện tại</li>
        </ol>
      </div>`;
    hero.insertAdjacentElement('afterend', section);
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
  injectProvinceVideoShowcase();
  injectContactPanel();
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