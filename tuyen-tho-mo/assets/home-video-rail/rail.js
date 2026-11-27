(() => {
  'use strict';
  const root = document.querySelector('[data-tkv-video]');
  if (!root) return;
  const stage = root.querySelector('[data-tkv-stage]');
  const rail = root.querySelector('[data-tkv-rail]');
  const status = root.querySelector('[data-tkv-status]');
  const source = root.querySelector('[data-tkv-source]');
  const actions = root.querySelector('[data-tkv-actions]');
  const notice = root.querySelector('[data-tkv-notice]');
  const retry = root.querySelector('[data-tkv-retry]');
  const liveNotice = root.querySelector('[data-tkv-live-notice]');
  const live = root.querySelector('[data-tkv-live]');
  const cards = Array.from(rail.querySelectorAll('[data-tkv-pick]'));

  let current, generation = 0, timeout, player, apiPromise;
  function youtubeAPI() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      const script = document.createElement('script');
      let deadline, settled = false;
      function cleanup() {
        window.clearTimeout(deadline);
        if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = previous;
      }
      function fail() {
        if (settled) return;
        settled = true;
        cleanup();
        script.remove();
        reject(new Error('YouTube player API unavailable'));
      }
      function ready() {
        if (settled) return;
        if (!window.YT?.Player) return fail();
        settled = true;
        cleanup();
        resolve(window.YT);
        if (typeof previous === 'function') previous();
      }
      window.onYouTubeIframeAPIReady = ready;
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.addEventListener('error', fail, {once: true});
      deadline = window.setTimeout(fail, 8000);
      document.head.appendChild(script);
    }).catch(error => {
      apiPromise = undefined;
      throw error;
    });
    return apiPromise;
  }
  function feedback(text, canRetry) {
    notice.textContent = text;
    notice.hidden = !text;
    retry.hidden = !canRetry;
    actions.hidden = !canRetry;
  }
  function load(link, keyboard, autoplay = true) {
    const id = link.dataset.tkvPick;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    const title = link.dataset.tkvTitle || link.querySelector('span').textContent.trim();
    const movedFocus = stage.contains(document.activeElement);
    const url = new URL('https://www.youtube.com/embed/' + id);
    url.searchParams.set('autoplay', autoplay ? '1' : '0');
    url.searchParams.set('enablejsapi', '1');
    url.searchParams.set('origin', window.location.origin);
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('rel', '0');
    url.searchParams.set('cc_load_policy', '0');
    const frame = document.createElement('iframe');
    frame.src = url.href;
    frame.title = title;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    const run = ++generation;
    if (timeout) window.clearTimeout(timeout);
    timeout = undefined;
    if (player) { player.destroy(); player = null; }
    current = link;
    stage.replaceChildren(frame);
    feedback(autoplay ? '' : 'Bấm nút Play ở giữa video để phát.', !autoplay);
    function clearWatch() {
      if (timeout !== undefined) window.clearTimeout(timeout);
      timeout = undefined;
    }
    function slow() {
      if (run !== generation) return;
      clearWatch();
      feedback('Video chưa phát. Bấm Play trong khung, thử lại hoặc mở trên YouTube.', true);
    }
    if (autoplay) timeout = window.setTimeout(slow, 8000);
    youtubeAPI().then(YT => {
      if (run !== generation || !YT?.Player) return;
      // Reset the initial track only. Never undo CC changes made after playback starts.
      let starting = true, resetCaptions = false;
      function initialCaptionsOff(event) {
        if (!starting || resetCaptions || run !== generation) return;
        const instance = event.target;
        try {
          if (!instance?.getOptions?.().includes('captions') ||
              typeof instance.setOption !== 'function') return;
          resetCaptions = true;
          instance.setOption('captions', 'track', {});
        } catch { /* Keep native playback and the viewer's CC button available. */ }
      }
      player = new YT.Player(frame, {events: {
        onReady: initialCaptionsOff,
        onApiChange: initialCaptionsOff,
        onStateChange(event) {
          if (run !== generation) return;
          if (event.data === YT.PlayerState.BUFFERING && timeout === undefined) {
            timeout = window.setTimeout(slow, 8000);
          }
          if (event.data === YT.PlayerState.PLAYING) {
            initialCaptionsOff(event);
            starting = false;
            clearWatch();
            feedback('', false);
          }
        },
        onAutoplayBlocked: slow,
        onError() {
          if (run !== generation) return;
          clearWatch();
          feedback('Không phát được trong khung. Anh chị có thể thử lại hoặc mở trên YouTube.', true);
        }
      }});
    }).catch(slow);
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
  if (live) {
    const panelClass = 'is-sharing';
    let overlay = false;
    let busy = false;
    const suspended = [];
    live.hidden = false;
    function syncShare() {
      const active = overlay || document.fullscreenElement === root;
      live.textContent = active ? 'Thoát khung chia sẻ' : 'Khung chia sẻ màn hình';
      liveNotice.textContent = overlay ? 'Khung chia sẻ đang mở trong cửa sổ trình duyệt.' : '';
      liveNotice.hidden = !overlay;
    }
    function setOverlay(on) {
      overlay = on;
      root.classList.toggle(panelClass, on);
      document.documentElement.classList.toggle('tkv-share-active', on);
      if (on) {
        for (let branch = root; branch && branch !== document.body; branch = branch.parentElement) {
          for (const sibling of branch.parentElement?.children || []) {
            if (sibling === branch || sibling.inert) continue;
            sibling.inert = true;
            suspended.push(sibling);
          }
        }
      } else {
        for (const sibling of suspended.splice(0)) sibling.inert = false;
      }
      syncShare();
      live.focus({preventScroll: true});
    }
    document.addEventListener('fullscreenchange', syncShare);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && overlay) {
        event.preventDefault();
        setOverlay(false);
      }
    });
    live.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      try {
        if (overlay) {
          setOverlay(false);
        } else if (document.fullscreenElement === root) {
          await document.exitFullscreen();
        } else if (!document.fullscreenEnabled || typeof root.requestFullscreen !== 'function') {
          setOverlay(true);
        } else {
          try {
            await root.requestFullscreen();
          } catch {
            setOverlay(true);
          }
        }
      } finally {
        busy = false;
      }
    });
  }
  retry.addEventListener('click', () => {
    if (!current) return;
    load(current, true, false);
    stage.focus({preventScroll: true});
  });
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
