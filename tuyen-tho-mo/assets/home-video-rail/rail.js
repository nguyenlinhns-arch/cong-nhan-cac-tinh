(() => {
  'use strict';
  const root = document.querySelector('[data-tkv-video]');
  if (!root) return;
  const stage = root.querySelector('[data-tkv-stage]');
  const rail = root.querySelector('[data-tkv-rail]');
  const status = root.querySelector('[data-tkv-status]');
  const source = root.querySelector('[data-tkv-source]');
  const cards = Array.from(rail.querySelectorAll('[data-tkv-pick]'));

  function load(link, keyboard) {
    const id = link.dataset.tkvPick;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    const title = link.dataset.tkvTitle || link.querySelector('span').textContent.trim();
    const movedFocus = stage.contains(document.activeElement);
    const url = new URL('https://www.youtube.com/embed/' + id);
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('rel', '0');
    const frame = document.createElement('iframe');
    frame.src = url.href;
    frame.title = title;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    stage.replaceChildren(frame);
    cards.forEach(card => card === link ? card.setAttribute('aria-current', 'true') : card.removeAttribute('aria-current'));
    status.textContent = title + ' · YouTube TKV';
    source.href = link.href;
    if (movedFocus) stage.focus({preventScroll: true});
    if (!keyboard && window.matchMedia('(max-width: 640px)').matches) {
      stage.scrollIntoView({block: 'start', behavior: 'instant'});
    }
  }

  function move(dir) {
    if (cards.length < 2) return;
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    if (step <= 0) return;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    if (max === 0) return;
    const next = dir > 0 ? (rail.scrollLeft >= max - 2 ? 0 : Math.min(max, rail.scrollLeft + step))
      : (rail.scrollLeft < 2 ? max : Math.max(0, rail.scrollLeft - step));
    rail.scrollTo({left: next, behavior: 'instant'});
  }
  root.querySelector('[data-tkv-controls]').hidden = false;
  root.querySelector('[data-tkv-prev]').addEventListener('click', () => move(-1));
  root.querySelector('[data-tkv-next]').addEventListener('click', () => move(1));
  root.addEventListener('click', event => {
    const link = event.target.closest('[data-tkv-pick]');
    if (!link || !root.contains(link) || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    load(link, event.detail === 0);
  });
})();
