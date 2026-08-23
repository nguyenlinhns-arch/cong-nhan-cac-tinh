const FB_ADS_SHEET = 'FACEBOOK_ADS';
const FB_ADS_HEADERS = [
  'Ngày', 'Facebook Campaign', 'Facebook Ad Set', 'Facebook Ad', 'Campaign ID', 'Ad Set ID', 'Ad ID',
  'Chi tiêu (đ)', 'Impressions', 'Reach', 'Clicks', 'Messaging conversations', 'Lead Ads',
  'Ứng viên CRM', 'Đủ điều kiện', 'Nhập học', 'CP/Đủ điều kiện', 'CP/Nhập học', 'Cập nhật'
];

function setupFacebookAdsInsights() {
  const spreadsheet = getFacebookSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(FB_ADS_SHEET) || spreadsheet.insertSheet(FB_ADS_SHEET);
  ensureHeaders_(sheet, FB_ADS_HEADERS);
  sheet.setFrozenRows(1);
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'syncFacebookAdsInsights') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('syncFacebookAdsInsights').timeBased().atHour(6).everyDays(1).create();
  return { ok: true, sheet: FB_ADS_SHEET, tokenConfigured: Boolean(fbProperty_('META_ADS_ACCESS_TOKEN')), adAccountConfigured: Boolean(fbProperty_('META_AD_ACCOUNT_ID')) };
}

function syncFacebookAdsInsights() {
  const token = fbProperty_('META_ADS_ACCESS_TOKEN');
  let account = fbProperty_('META_AD_ACCOUNT_ID').replace(/^act_/, '');
  if (!token || !account) return { ok: false, reason: 'missing_meta_ads_credentials' };
  const days = Math.max(7, Math.min(180, Number(fbProperty_('META_INSIGHTS_DAYS')) || 60));
  const until = new Date();
  const since = new Date(until.getTime() - (days - 1) * 86400000);
  const date = function(value) { return Utilities.formatDate(value, Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'); };
  const fields = ['date_start','campaign_id','campaign_name','adset_id','adset_name','ad_id','ad_name','spend','impressions','reach','clicks','actions'].join(',');
  const timeRange = JSON.stringify({ since: date(since), until: date(until) });
  let url = metaGraphBase_() + '/act_' + encodeURIComponent(account) + '/insights?level=ad&time_increment=1&limit=500&fields=' + encodeURIComponent(fields) + '&time_range=' + encodeURIComponent(timeRange) + '&access_token=' + encodeURIComponent(token);
  const insights = [];
  while (url) {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) throw new Error('Meta insights HTTP ' + response.getResponseCode());
    const body = JSON.parse(response.getContentText() || '{}');
    (body.data || []).forEach(function(item) { insights.push(item); });
    url = body.paging && body.paging.next || '';
  }

  const spreadsheet = getFacebookSpreadsheet_();
  const master = spreadsheet.getSheetByName(MASTER_SHEET);
  const masterHeaders = fbHeaderMap_(master);
  const outcomes = buildFacebookOutcomeIndex_(master, masterHeaders);
  const rows = insights.map(function(item) {
    const key = [item.date_start || '', item.ad_id || ''].join('|');
    const outcome = outcomes[key] || { leads: 0, qualified: 0, enrolled: 0 };
    const spend = Number(item.spend) || 0;
    return [
      item.date_start || '', item.campaign_name || '', item.adset_name || '', item.ad_name || '',
      item.campaign_id || '', item.adset_id || '', item.ad_id || '', spend,
      Number(item.impressions) || 0, Number(item.reach) || 0, Number(item.clicks) || 0,
      metaActionValue_(item.actions, 'messaging_conversation_started'), metaLeadValue_(item.actions),
      outcome.leads, outcome.qualified, outcome.enrolled,
      outcome.qualified ? spend / outcome.qualified : '', outcome.enrolled ? spend / outcome.enrolled : '', new Date()
    ];
  });
  rows.sort(function(a, b) { return String(b[0]).localeCompare(String(a[0])) || Number(b[7]) - Number(a[7]); });

  const sheet = spreadsheet.getSheetByName(FB_ADS_SHEET) || spreadsheet.insertSheet(FB_ADS_SHEET);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, FB_ADS_HEADERS.length).setValues([FB_ADS_HEADERS]);
  if (rows.length) sheet.getRange(2, 1, rows.length, FB_ADS_HEADERS.length).setValues(rows);
  sheet.setFrozenRows(1);
  if (rows.length) {
    sheet.getRange(2, 8, rows.length, 1).setNumberFormat('#,##0 [$₫-vi-VN]');
    sheet.getRange(2, 17, rows.length, 2).setNumberFormat('#,##0 [$₫-vi-VN]');
    sheet.getRange(2, 19, rows.length, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  }
  return { ok: true, days: days, rows: rows.length, masterOutcomes: Object.keys(outcomes).length };
}

function buildFacebookOutcomeIndex_(sheet, headers) {
  const out = {};
  if (!sheet || sheet.getLastRow() < 2) return out;
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  values.forEach(function(row) {
    const get = function(header) { return headers[header] ? row[headers[header] - 1] : ''; };
    const source = String(get('Nguồn') || '').toLocaleLowerCase('vi');
    const adId = String(get('Facebook Ad ID') || get('Nội dung nội bộ') || '').trim();
    const created = get('Thời gian đăng ký');
    if (source.indexOf('facebook') === -1 || !adId || !(created instanceof Date) || Number.isNaN(created.getTime())) return;
    const day = Utilities.formatDate(created, Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    const key = day + '|' + adId;
    const item = out[key] || (out[key] = { leads: 0, qualified: 0, enrolled: 0 });
    item.leads += 1;
    const status = String(get('Trạng thái') || '');
    if (['Đủ điều kiện', 'Nộp hồ sơ', 'Nhập học'].indexOf(status) !== -1) item.qualified += 1;
    if (status === 'Nhập học' || String(get('Kết quả cuối') || '') === 'Đã nhập học') item.enrolled += 1;
  });
  return out;
}

function metaActionValue_(actions, needle) {
  return (actions || []).reduce(function(sum, item) {
    const type = String(item.action_type || '');
    return type.indexOf(needle) !== -1 ? sum + (Number(item.value) || 0) : sum;
  }, 0);
}

function metaLeadValue_(actions) {
  return (actions || []).reduce(function(sum, item) {
    const type = String(item.action_type || '');
    return /(^lead$|lead_grouped|onsite_conversion\.lead)/.test(type) ? sum + (Number(item.value) || 0) : sum;
  }, 0);
}

function metaGraphBase_() {
  return 'https://graph.facebook.com/' + (fbProperty_('META_GRAPH_VERSION') || 'v26.0');
}
