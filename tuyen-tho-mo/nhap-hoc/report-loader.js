(() => {
  const nativeFetch = window.fetch.bind(window);
  const CACHE_KEY = 'nhap-hoc:last-valid-live-report:v2';
  const PRIMARY_TOKEN = 'live-report.json';
  const RAW_FALLBACK = 'https://raw.githubusercontent.com/nguyenlinhns-arch/cong-nhan-cac-tinh/main/tuyen-tho-mo/nhap-hoc/live-report.json';

  const isReportRequest = input => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    return url.includes(PRIMARY_TOKEN) && !url.includes('raw.githubusercontent.com');
  };

  const validRows = (rows, expected) => Array.isArray(rows) && rows.length === expected && rows.every(r =>
    typeof r?.code === 'string' && typeof r?.name === 'string' &&
    Number.isFinite(Number(r?.base)) && Number.isFinite(Number(r?.delta)) && Number.isFinite(Number(r?.current))
  );

  const valid = data => data?.schema_version === 2 && !!data?.summary &&
    Number.isFinite(Number(data.summary.base_3107)) &&
    Number.isFinite(Number(data.summary.dshs_unique_base)) &&
    Number.isFinite(Number(data.summary.dshs_unique_current)) &&
    Number.isFinite(Number(data.summary.net_unique)) &&
    Number.isFinite(Number(data.summary.current_total)) &&
    validRows(data.dv, 18) && validRows(data.ph, 6) && validRows(data.dn, 15);

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
    if (!valid(data)) throw new Error(`${source}: invalid admissions snapshot payload`);
    const normalized = JSON.stringify(data);
    try { localStorage.setItem(CACHE_KEY, normalized); } catch (_) {}
    return responseFromText(normalized, source);
  }

  window.fetch = async function(input, init) {
    if (!isReportRequest(input)) return nativeFetch(input, init);
    const requested = typeof input === 'string' ? input : input.url;
    try {
      return await tryUrl(requested, init, 'pages');
    } catch (primaryError) {
      console.warn('Admissions primary data failed; using GitHub fallback.', primaryError);
      try {
        return await tryUrl(RAW_FALLBACK, init, 'github-raw');
      } catch (fallbackError) {
        console.warn('Admissions GitHub fallback failed; using browser cache.', fallbackError);
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const data = JSON.parse(cached);
            if (valid(data)) return responseFromText(JSON.stringify(data), 'browser-cache');
          }
        } catch (_) {}
        throw primaryError;
      }
    }
  };
})();