(() => {
  const nativeFetch = window.fetch.bind(window);
  const activeUrl = () => `./active-aug.json?v=${Date.now()}`;
  const metaUrl = () => `./data.json?v=${Date.now()}`;
  const dropoutUrl = () => `./dropout-aug.json?v=${Date.now()}`;
  const dnCodes = new Set(['TSDN1','TSDN2','TSDN3']);

  async function loadJson(url) {
    const response = await nativeFetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    return response.json();
  }

  const generatedDate = meta => {
    const match = String(meta?.generated_at || '').match(/(\d{2}\/\d{2}\/\d{4})/);
    return match ? match[1] : '';
  };
  const pct = (actual, plan) => plan > 0 ? Math.round((actual / plan * 100) * 10) / 10 : 0;

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

  function mergeCurrentFromMeta(details, meta) {
    if (!details?.dv || !meta?.reports?.dv || generatedDate(meta) !== String(details.snapshot_date || '')) return details;
    const metaRows = (meta.reports.dv || []).filter(row => !row.total_row);
    const metaByCode = Object.fromEntries(metaRows.map(row => [row.code, row]));
    const metaTotal = (meta.reports.dv || []).find(row => row.total_row) || {};

    for (const row of details.dv.rows || []) {
      const source = metaByCode[row.code];
      if (!source) continue;
      row.current_a_total = Number(source.total || 0);
      row.current_a_inactive = Number(source.inactive || 0);
      row.current_a_active = Number(source.active || 0);
    }
    if (details.dv.total) {
      details.dv.total.current_a_total = Number(metaTotal.total ?? meta.summary?.total_records ?? 0);
      details.dv.total.current_a_inactive = Number(metaTotal.inactive ?? meta.summary?.inactive_records ?? 0);
      details.dv.total.current_a_active = Number(metaTotal.active ?? meta.summary?.active_records ?? 0);
    }

    const dnActive = metaRows.filter(row => dnCodes.has(row.code)).reduce((sum, row) => sum + Number(row.active || 0), 0);
    const totalActive = Number(metaTotal.active ?? meta.summary?.active_records ?? 0);
    const schoolActive = Math.max(0, totalActive - dnActive);
    details.dv.progress = [
      { label:'Kế hoạch năm 2026', plan:4250, actual:totalActive, pct:pct(totalActive, 4250) },
      { label:'Trường 80%', plan:3400, actual:schoolActive, pct:pct(schoolActive, 3400) },
      { label:'Doanh nghiệp 20%', plan:850, actual:dnActive, pct:pct(dnActive, 850) }
    ];
    const unclassified = Number(meta.summary?.unclassified_class_records ?? 0);
    details.dv.progress_note = `Tổng Hệ A/xóa tên/còn học lấy trực tiếp từ DSHS Tổng. ${unclassified} hồ sơ chưa phân loại nghề vẫn được tính trong tổng Hệ A nhưng không ép vào một cột nghề.`;
    details.dv.current_source = 'DATA_JSON_WEB_THEO_DV';
    if (details.audit) {
      details.audit.a_total = Number(metaTotal.total ?? meta.summary?.total_records ?? 0);
      details.audit.a_inactive = Number(metaTotal.inactive ?? meta.summary?.inactive_records ?? 0);
      details.audit.a_active = Number(metaTotal.active ?? meta.summary?.active_records ?? 0);
    }
    return details;
  }

  function mergeDropoutAudit(details, dropout) {
    if (!details?.dv || !dropout || String(dropout.snapshot_date || '') !== String(details.snapshot_date || '')) return details;
    details.dv.dropout_month_total = Number(dropout.aug_dropout_total || 0);
    details.dv.dropout_month_from_july = Number(dropout.from_july_admissions || 0);
    details.dv.dropout_month_from_august = Number(dropout.from_august_admissions || 0);
    details.dv.july_active_at_31_07 = Number(dropout.july_active_at_31_07 || 0);
    details.dv.july_enter_aug_dropout_total = Number(dropout.from_july_admissions || 0);
    details.dv.july_enter_aug_dropout_by_unit = dropout.by_unit || [];
    details.dv.q3_reconciliation = dropout.reconciliation || '';
    details.dv.dropout_month_definition = dropout.definition || '';
    details.dv.dropout_month_breakdown_text = `${Number(dropout.from_july_admissions || 0)} HS nhập tháng 7 + ${Number(dropout.from_august_admissions || 0)} HS nhập tháng 8`;
    if (details.audit) {
      details.audit.aug_dropout_events = Number(dropout.aug_dropout_total || 0);
      details.audit.july_enter_aug_dropout = Number(dropout.from_july_admissions || 0);
      details.audit.aug_enter_aug_dropout = Number(dropout.from_august_admissions || 0);
      details.audit.july_active_at_31_07 = Number(dropout.july_active_at_31_07 || 0);
      details.audit.q3_active_reconciled = Number(dropout.q3_active_reconciled || 0);
    }
    return details;
  }

  window.fetch = async function(input, init) {
    const response = await nativeFetch(input, init);
    const url = typeof input === 'string' ? input : String(input?.url || '');
    if (!/report-details\.json(?:\?|$)/.test(url) || !response.ok) return response;
    try {
      const [details, active, meta, dropout] = await Promise.all([
        response.clone().json(),
        loadJson(activeUrl()),
        loadJson(metaUrl()),
        loadJson(dropoutUrl())
      ]);
      mergeActive(details, active);
      mergeCurrentFromMeta(details, meta);
      mergeDropoutAudit(details, dropout);
      const headers = new Headers(response.headers);
      headers.set('content-type', 'application/json; charset=utf-8');
      headers.set('cache-control', 'no-store');
      return new Response(JSON.stringify(details), { status: response.status, statusText: response.statusText, headers });
    } catch (error) {
      console.error('Không áp dụng được DSHS overlay', error);
      return response;
    }
  };

  function loadLocationOverlay() {
    if (document.querySelector('script[data-location-overlay="1"]')) return;
    const script = document.createElement('script');
    script.src = `./location-overlay.js?v=${Date.now()}`;
    script.dataset.locationOverlay = '1';
    document.head.appendChild(script);
  }
  loadLocationOverlay();
})();
