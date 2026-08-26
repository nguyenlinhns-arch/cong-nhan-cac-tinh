(() => {
  const nativeFetch = window.fetch.bind(window);
  const CACHE_KEY = 'nhap-hoc:last-valid-live-report:v1';
  const PRIMARY_TOKEN = 'live-report.json';
  const RAW_FALLBACK = 'https://raw.githubusercontent.com/nguyenlinhns-arch/cong-nhan-cac-tinh/main/tuyen-tho-mo/nhap-hoc/live-report.json';

  const isReportRequest = input => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    return url.includes(PRIMARY_TOKEN) && !url.includes('raw.githubusercontent.com');
  };

  const valid = data => !!data?.summary &&
    Array.isArray(data.dv) && data.dv.length === 18 &&
    Array.isArray(data.dv_extra) && data.dv_extra.length === 18 &&
    Array.isArray(data.ph) && data.ph.length === 6 &&
    Array.isArray(data.dn) && data.dn.length === 21 &&
    Array.isArray(data.tinh) && Array.isArray(data.qc);

  const responseFromText = (text, source) => new Response(text, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Admissions-Data-Source': source
    }
  });

  async function tryUrl(url, init, source) {
    const sep = url.includes('?') ? '&' : '?';
    const res = await nativeFetch(`${url}${sep}_=${Date.now()}`, { ...(init || {}), cache: 'no-store' });
    if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
    const text = await res.text();
    const data = JSON.parse(text);
    if (!valid(data)) throw new Error(`${source}: invalid admissions payload`);
    try { localStorage.setItem(CACHE_KEY, text); } catch (_) {}
    return responseFromText(text, source);
  }

  window.fetch = async function(input, init) {
    if (!isReportRequest(input)) return nativeFetch(input, init);
    const requested = typeof input === 'string' ? input : input.url;
    try {
      return await tryUrl(requested, init, 'pages');
    } catch (primaryError) {
      console.warn('Admissions primary data failed; using fallback.', primaryError);
      try {
        return await tryUrl(RAW_FALLBACK, init, 'github-raw');
      } catch (fallbackError) {
        console.warn('Admissions GitHub fallback failed; using browser cache.', fallbackError);
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const data = JSON.parse(cached);
            if (valid(data)) return responseFromText(cached, 'browser-cache');
          }
        } catch (_) {}
        throw primaryError;
      }
    }
  };
})();
