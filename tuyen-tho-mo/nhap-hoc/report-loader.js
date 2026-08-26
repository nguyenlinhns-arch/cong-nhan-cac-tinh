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

  const patchNamed = (rows, name, patch) => {
    if (!Array.isArray(rows)) return;
    const row = rows.find(r => String(r?.name || '').trim() === name);
    if (row) Object.assign(row, patch);
  };

  // Đối soát ngày 26/08/2026 theo biểu TH chuẩn. 20 HS TSĐB đã có trong
  // biểu tổng hợp nhưng chưa có dòng chi tiết tương ứng trong DSHS Master,
  // vì vậy giữ riêng detail_gap thay vì gán giả vào một DN/phân hiệu.
  const applyThCorrections = data => {
    if (!data || data.snapshot_date !== '26/08/2026') return data;

    Object.assign(data.summary, {
      aug_net: 125,
      system_total: 2251,
      deleted: 304,
      remaining: 1947,
      retakes: 77,
      including_retakes: 2328,
      b_total: 3,
      overall_total: 2254,
      overall_remaining: 1950,
      overall_including_retakes: 2331,
      in_province_aug: 16,
      in_province_total: 948,
      qc_aug: 9,
      qc_total: 466,
      detail_gap: 20,
      detail_gap_aug: 20,
      detail_gap_hsc: 20
    });

    patchNamed(data.dv, 'Phòng TSDN1', {
      hsc_aug: 22, lt_aug: 1, xsc_aug: 0, vht_aug: 0, electric_aug: 5,
      school_aug: 0, company_aug: 28, aug_total: 28, current_total: 573,
      deleted: 51, remaining: 522, plan: 855, pct: 61.1,
      retakes: 5, including_retakes: 578
    });
    patchNamed(data.dv, 'Phòng Chiến Lược', {
      hsc_aug: 5, lt_aug: 2, xsc_aug: 0, vht_aug: 0, electric_aug: 2,
      school_aug: 9, company_aug: 0, aug_total: 9, current_total: 153,
      deleted: 24, remaining: 129, plan: 410, pct: 31.5,
      retakes: 8, including_retakes: 161
    });
    patchNamed(data.dv, 'Phòng TSĐB', {
      hsc_aug: 22, lt_aug: 0, xsc_aug: 0, vht_aug: 0, electric_aug: 4,
      school_aug: 26, company_aug: 0, aug_total: 26, current_total: 82,
      deleted: 1, remaining: 81, pct: null, retakes: 3, including_retakes: 85
    });
    patchNamed(data.dv, 'Phòng TSTB1', {
      hsc_aug: 4, lt_aug: 0, xsc_aug: 0, vht_aug: 0, electric_aug: 0,
      school_aug: 4, company_aug: 0, aug_total: 4, current_total: 49,
      deleted: 7, remaining: 42, plan: 390, pct: 10.8,
      retakes: 0, including_retakes: 49
    });
    patchNamed(data.dv, 'TS PH Hữu Nghị', {
      current_total: 183, deleted: 22, remaining: 161, plan: 400,
      pct: 40.3, retakes: 34, including_retakes: 217
    });

    patchNamed(data.dv_extra, 'Phòng TSDN1', {
      current_school: 1, current_company: 572, prior_tkv: 427,
      prior_total: 427, yoy_pct: 134.2
    });
    patchNamed(data.dv_extra, 'Phòng Chiến Lược', {
      current_school: 153, current_company: 0, prior_tkv: 167,
      prior_total: 167, yoy_pct: 91.6
    });
    patchNamed(data.dv_extra, 'Phòng TSĐB', {
      current_school: 82, current_company: 0
    });
    patchNamed(data.dv_extra, 'Phòng TSTB1', {
      current_school: 49, current_company: 0, prior_tkv: 208,
      prior_total: 208, yoy_pct: 23.6
    });

    patchNamed(data.ph, 'Phân hiệu Hoành Bồ', {
      month8: [0,14,0,0,0,-2,0,0,0,12,0,0],
      current: [0,365,17,0,0,55,0,0,0,438,0,0,438]
    });
    patchNamed(data.ph, 'Phân hiệu Hữu Nghị', {
      month8: [0,28,0,0,0,5,0,0,0,33,0,0],
      current: [0,416,0,0,0,128,0,0,0,544,0,0,544]
    });

    patchNamed(data.dn, 'Mạo Khê', {
      month8: [0,-1,-1,6,2,8,0,0,0],
      current: [12,20,32,42,30,72,0,0,0],
      aug_total: 7, current_total: 104
    });
    patchNamed(data.dn, 'Nam Mẫu', {
      month8: [1,0,1,-2,1,-1,0,0,0],
      current: [23,5,28,86,11,97,0,0,0],
      aug_total: 0, current_total: 125
    });
    patchNamed(data.dn, 'Hòn Gai', {
      month8: [1,0,1,9,0,9,0,0,0],
      current: [15,23,38,157,24,181,0,0,0],
      aug_total: 10, current_total: 219
    });
    patchNamed(data.dn, 'Vàng Danh', {
      month8: [3,-1,2,3,0,3,0,0,0],
      current: [35,18,53,115,6,121,0,0,0],
      aug_total: 5, current_total: 174
    });

    patchNamed(data.tinh, 'Thống Nhất', {
      months: [2,1,4,5,1,0,4,-1,0,0,0,0], total: 16
    });
    patchNamed(data.tinh, 'Mạo Khê', {
      months: [7,17,7,5,3,4,4,2,0,0,0,0], total: 49
    });

    return data;
  };

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
    const rawText = await res.text();
    const rawData = JSON.parse(rawText);
    if (!valid(rawData)) throw new Error(`${source}: invalid admissions payload`);
    const data = applyThCorrections(rawData);
    const text = JSON.stringify(data);
    try { localStorage.setItem(CACHE_KEY, text); } catch (_) {}
    return responseFromText(text, `${source}+th-26-08`);
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
            if (valid(data)) return responseFromText(JSON.stringify(applyThCorrections(data)), 'browser-cache+th-26-08');
          }
        } catch (_) {}
        throw primaryError;
      }
    }
  };
})();