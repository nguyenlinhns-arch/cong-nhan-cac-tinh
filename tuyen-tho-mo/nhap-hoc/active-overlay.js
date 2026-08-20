(() => {
  const nativeFetch = window.fetch.bind(window);
  const activeUrl = () => `./active-aug.json?v=${Date.now()}`;

  async function loadActive() {
    const response = await nativeFetch(activeUrl(), { cache: 'no-store' });
    if (!response.ok) throw new Error(`active-aug.json: ${response.status}`);
    return response.json();
  }

  function mergeActive(details, active) {
    if (!details?.dv || !active || String(active.snapshot_date || '') !== String(details.snapshot_date || '')) return details;
    const byCode = Object.fromEntries((active.rows || []).map(row => [row.code, row]));
    for (const row of details.dv.rows || []) {
      const source = byCode[row.code];
      if (!source) continue;
      row.aug = [source.hsc, source.lt, source.xsc, source.vhtbd, source.electric, 0, 0, source.total];
      row.quarter_a_total = source.q3_active_total;
    }
    if (details.dv.total && active.total) {
      const source = active.total;
      details.dv.total.aug = [source.hsc, source.lt, source.xsc, source.vhtbd, source.electric, 0, 0, source.total];
      details.dv.total.quarter_a_total = source.q3_active_total;
    }
    details.dv.active_aug_applied = true;
    details.dv.active_aug_snapshot = active.snapshot_date;
    return details;
  }

  window.fetch = async function(input, init) {
    const response = await nativeFetch(input, init);
    const url = typeof input === 'string' ? input : String(input?.url || '');
    if (!/report-details\.json(?:\?|$)/.test(url) || !response.ok) return response;
    try {
      const [details, active] = await Promise.all([response.clone().json(), loadActive()]);
      const merged = mergeActive(details, active);
      const headers = new Headers(response.headers);
      headers.set('content-type', 'application/json; charset=utf-8');
      headers.set('cache-control', 'no-store');
      return new Response(JSON.stringify(merged), { status: response.status, statusText: response.statusText, headers });
    } catch (error) {
      console.error('Không áp dụng được active-aug overlay', error);
      return response;
    }
  };
})();
