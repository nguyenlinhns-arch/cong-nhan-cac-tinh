(() => {
  'use strict';
  const root = document.querySelector('[data-tkv-video]');
  if (!root) return;
  const stage = root.querySelector('[data-tkv-stage]');
  const rail = root.querySelector('[data-tkv-rail]');
  const status = root.querySelector('[data-tkv-status]');
  const source = root.querySelector('[data-tkv-source]');
  const cards = Array.from(rail.querySelectorAll('[data-tkv-pick]'));
  const video = '6MJLc5mBhsA';
  const bounds = new Map([['all', [0, 0]], ['80', [80, 420]], ['450', [450, 630]], ['630', [630, 1070]], ['1130', [1130, 0]]]);
  let cursor = 0;
  function load(key) {
    const index = cards.findIndex(card => card.dataset.tkvPick === key);
    const time = bounds.get(key);
    if (index < 0 || !time) return;
    const [start, end] = time;
    const url = new URL('https://www.youtube.com/embed/' + video);
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('rel', '0');
    if (start) url.searchParams.set('start', String(start));
    if (end) url.searchParams.set('end', String(end));
    const title = cards[index].querySelector('span').textContent;
    const frame = document.createElement('iframe');
    frame.src = url.href;
    frame.title = title;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    stage.replaceChildren(frame);
    cards.forEach((card, i) => i === index ? card.setAttribute('aria-current', 'true') : card.removeAttribute('aria-current'));
    status.textContent = 'Đang chọn: ' + title + ' · Phỏng vấn TKV năm 2024';
    source.href = cards[index].href;
    cursor = index;
    if (window.matchMedia('(max-width: 640px)').matches) stage.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  function move(dir) {
    cursor = (cursor + dir + cards.length) % cards.length;
    rail.scrollLeft = cursor === 0 ? 0 : cards[cursor].offsetLeft;
  }
  root.querySelector('[data-tkv-controls]').hidden = false;
  root.querySelector('[data-tkv-prev]').addEventListener('click', () => move(-1));
  root.querySelector('[data-tkv-next]').addEventListener('click', () => move(1));
  root.addEventListener('click', event => {
    const link = event.target.closest('[data-tkv-pick]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    load(link.dataset.tkvPick);
  });
})();
