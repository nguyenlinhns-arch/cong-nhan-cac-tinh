(() => {
  'use strict';

  const MODULE_BASE = new URL('.', document.currentScript?.src || new URL('media-rich.js', location.href).href);
  const videos = [
    { id: 'ts41cqu7r9c', tag: 'Câu chuyện công nhân', title: 'Chàng trai Mường Lát có thu nhập trên 300 triệu đồng/năm', desc: 'Video phỏng vấn công nhân quê Thanh Hóa đang làm việc trong ngành Than.' },
    { id: 'TIDiY-Nuo_4', tag: 'An cư lập nghiệp', title: 'Hành trình an cư, lập nghiệp tại vùng đất Mỏ', desc: 'Góc nhìn thực tế về cuộc sống sau khi gắn bó với nghề mỏ.' },
    { id: 'ZynHtWJvyUs', tag: 'Người thật việc thật', title: 'Gắn bó với ngành Than là một quyết định đúng đắn', desc: 'Chia sẻ của người lao động về công việc, thu nhập và cuộc sống.' },
    { id: 'zViKdr-D1aw', tag: 'Thu nhập tham khảo', title: 'Những người thợ lò có thu nhập 300 triệu đồng/năm', desc: 'Câu chuyện tiêu biểu để người lao động tham khảo trước khi đăng ký.' },
    { id: 't7ekLxtWRLE', tag: 'Đời sống thợ mỏ', title: 'An cư, lập nghiệp cùng ngành Than', desc: 'Câu chuyện về hành trình xây dựng cuộc sống tại vùng mỏ Quảng Ninh.' }
  ];

  const photos = [
    { type: 'Ảnh ngành mỏ', title: 'Khai thác than hầm lò', localB64: 'assets/gallery-longwall-machine.webp.b64', large: true },
    { type: 'Video thumbnail', title: 'Công nhân ngành Than trong câu chuyện thật', img: 'https://i.ytimg.com/vi/TIDiY-Nuo_4/maxresdefault.jpg' },
    { type: 'Video thumbnail', title: 'Người lao động lập nghiệp tại Quảng Ninh', img: 'https://i.ytimg.com/vi/ZynHtWJvyUs/maxresdefault.jpg' },
    { type: 'Fanpage', title: 'Ảnh bìa và hoạt động tuyển sinh', fb: true },
    { type: 'Video thumbnail', title: 'Câu chuyện thợ lò Thanh Hóa', img: 'https://i.ytimg.com/vi/zViKdr-D1aw/maxresdefault.jpg' }
  ];

  function track(action, label) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'rich_media_action', action, label, page_path: location.pathname });
  }

  function photoMarkup(photo) {
    if (photo.fb) return '<span class="photo-card__bg" aria-hidden="true"></span>';
    const src = photo.localB64 ? '' : photo.img;
    const attr = photo.localB64 ? `data-local-b64="${photo.localB64}"` : '';
    return `<img src="${src}" ${attr} alt="${photo.title}" loading="lazy">`;
  }

  async function hydrateLocalImages(section) {
    const images = [...section.querySelectorAll('img[data-local-b64]')];
    await Promise.all(images.map(async img => {
      try {
        const url = new URL(img.dataset.localB64, MODULE_BASE);
        const response = await fetch(url, { cache: 'force-cache' });
        if (!response.ok) throw new Error(img.dataset.localB64);
        const b64 = (await response.text()).trim();
        img.src = `data:image/webp;base64,${b64}`;
      } catch (error) {
        img.removeAttribute('data-local-b64');
        img.src = 'https://i.ytimg.com/vi/ts41cqu7r9c/maxresdefault.jpg';
      }
    }));
  }

  function createSection() {
    const section = document.createElement('section');
    section.className = 'section rich-media';
    section.id = 'video-thuc-te';
    section.innerHTML = `
      <div class="wrap">
        <div class="rich-media__head">
          <div>
            <p class="badge">Video & hình ảnh thực tế</p>
            <h2>Xem nghề mỏ bằng hình ảnh và video trước khi quyết định.</h2>
          </div>
          <p class="section-lead">Thư viện có video phỏng vấn công nhân, ảnh hầm lò và hình ảnh ngành mỏ để website sinh động hơn. Người lao động có thể xem trước công việc, môi trường học nghề và đời sống vùng mỏ.</p>
        </div>
        <div class="rich-tabs" role="tablist" aria-label="Chọn video">
          ${videos.map((video, index) => `<button type="button" role="tab" aria-selected="${index === 0}" data-video-index="${index}">${index + 1}. ${video.tag}</button>`).join('')}
        </div>
        <div class="video-wall">
          <article class="featured-video">
            <div class="featured-video__frame"><iframe data-video-frame loading="lazy" title="${videos[0].title}" src="https://www.youtube-nocookie.com/embed/${videos[0].id}?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
            <div class="featured-video__caption"><small data-video-tag>${videos[0].tag}</small><h3 data-video-title>${videos[0].title}</h3><p data-video-desc>${videos[0].desc}</p></div>
          </article>
          <div class="video-list">
            ${videos.map((video, index) => `
              <button class="video-item" type="button" data-video-index="${index}" aria-current="${index === 0}">
                <img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}" loading="lazy">
                <span><small>${video.tag}</small><strong>${video.title}</strong></span>
              </button>`).join('')}
          </div>
        </div>
        <div class="photo-gallery">
          <div class="photo-gallery__head"><h3>Hình ảnh ngành mỏ</h3><p>Ảnh hầm lò, công nhân, đào tạo và đời sống làm website có cảm giác thật hơn. Các ảnh được tối ưu nhẹ để tải nhanh trên điện thoại.</p></div>
          <div class="photo-mosaic">
            ${photos.map(photo => `
              <figure class="photo-card ${photo.large ? 'photo-card--large' : ''}">
                ${photoMarkup(photo)}
                <figcaption><small>${photo.type}</small><strong>${photo.title}</strong></figcaption>
              </figure>`).join('')}
          </div>
          <p class="media-disclaimer">Các video/câu chuyện giúp người lao động tham khảo thực tế nghề mỏ; thông tin về thu nhập, điều kiện tiếp nhận và đơn vị bố trí được tư vấn theo từng đợt.</p>
          <div class="rich-media__cta">
            <a href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo">Nhắn Zalo kiểm tra điều kiện</a>
            <a href="https://www.facebook.com/thaylinhtuyenthomo/videos/" target="_blank" rel="noopener">Xem thêm video trên Fanpage</a>
          </div>
        </div>
      </div>`;
    return section;
  }

  function bindVideo(section) {
    const frame = section.querySelector('[data-video-frame]');
    const tag = section.querySelector('[data-video-tag]');
    const title = section.querySelector('[data-video-title]');
    const desc = section.querySelector('[data-video-desc]');
    const tabs = [...section.querySelectorAll('.rich-tabs [data-video-index]')];
    const items = [...section.querySelectorAll('.video-item')];

    function select(index) {
      const video = videos[index];
      if (!video) return;
      frame.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
      frame.title = video.title;
      tag.textContent = video.tag;
      title.textContent = video.title;
      desc.textContent = video.desc;
      tabs.forEach(btn => btn.setAttribute('aria-selected', String(Number(btn.dataset.videoIndex) === index)));
      items.forEach(btn => btn.setAttribute('aria-current', String(Number(btn.dataset.videoIndex) === index)));
      track('select_video', video.title);
    }

    [...tabs, ...items].forEach(button => button.addEventListener('click', () => select(Number(button.dataset.videoIndex))));
  }

  function inject() {
    if (document.querySelector('.rich-media')) return;
    const articles = document.querySelector('#bai-viet');
    const media = document.querySelector('#anh-video');
    const target = articles || media;
    if (!target) return;
    const section = createSection();
    target.insertAdjacentElement('beforebegin', section);
    bindVideo(section);
    hydrateLocalImages(section);
  }

  inject();
})();
