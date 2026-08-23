const FB_INBOX_SHEET = 'FACEBOOK_INBOX';
const MASTER_SHEET = 'Ứng viên';
const FB_BRIDGE_VERSION = 1;
const FB_INBOX_HEADERS = [
  'Thời gian đầu', 'Cập nhật cuối', 'Facebook PSID', 'Họ tên Facebook', 'SĐT', 'Năm sinh',
  'Tỉnh/thành', 'Chiều cao (cm)', 'Cân nặng (kg)', 'Sức khỏe sơ bộ', 'Nghề quan tâm',
  'Nguồn tương tác', 'Facebook Campaign', 'Facebook Ad Set', 'Facebook Ad', 'Campaign ID',
  'Ad Set ID', 'Ad ID', 'Referral', 'Placement', 'Tín hiệu/tin nhắn gần nhất', 'Mức hoàn thiện',
  'Trạng thái đồng bộ', 'Mã CRM', 'Đối chiếu SĐT', 'Phụ trách', 'Ghi chú'
];
const MASTER_FB_HEADERS = [
  'Năm sinh khai báo', 'Facebook PSID', 'Facebook Lead ID', 'Facebook Ad ID', 'Facebook Ad Set ID',
  'Facebook Campaign ID', 'Facebook Ad', 'Facebook Ad Set', 'Facebook Campaign', 'Facebook Referral',
  'Facebook Intake', 'FBCLID', 'Meta Placement'
];

function setupFacebookCRMBridge() {
  const spreadsheet = getFacebookSpreadsheet_();
  ensureFacebookInbox_(spreadsheet);
  ensureMasterFacebookHeaders_(spreadsheet);
  installFacebookBridgeTriggers_();
  return {
    ok: true,
    version: FB_BRIDGE_VERSION,
    spreadsheet: spreadsheet.getUrl(),
    stagingSheet: FB_INBOX_SHEET,
    masterSheet: MASTER_SHEET,
    webhook: ScriptApp.getService().getUrl() || '',
    metaVerifyTokenConfigured: Boolean(fbProperty_('META_VERIFY_TOKEN')),
    metaPageTokenConfigured: Boolean(fbProperty_('META_PAGE_ACCESS_TOKEN')),
    metaAdsTokenConfigured: Boolean(fbProperty_('META_ADS_ACCESS_TOKEN'))
  };
}

function doGet(e) {
  const parameter = e && e.parameter || {};
  const mode = parameter['hub.mode'] || '';
  const token = parameter['hub.verify_token'] || '';
  const challenge = parameter['hub.challenge'] || '';
  if (mode === 'subscribe') {
    const expected = fbProperty_('META_VERIFY_TOKEN');
    if (expected && token === expected) return ContentService.createTextOutput(String(challenge));
    return ContentService.createTextOutput('Forbidden');
  }
  return fbJson_({ ok: true, service: 'Thầy Linh Facebook CRM bridge', version: FB_BRIDGE_VERSION });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e && e.postData && e.postData.contents || '{}');
    if (String(payload.object || '') !== 'page') return fbJson_({ ok: true, ignored: true });
    const configuredPageId = fbProperty_('META_PAGE_ID');
    let accepted = 0;
    (payload.entry || []).forEach(function(entry) {
      if (configuredPageId && String(entry.id || '') !== configuredPageId) return;
      (entry.messaging || []).forEach(function(event) {
        if (processMessengerEvent_(entry, event)) accepted += 1;
      });
      (entry.changes || []).forEach(function(change) {
        if (String(change.field || '') === 'leadgen' && processLeadgenChange_(entry, change.value || {})) accepted += 1;
      });
    });
    return ContentService.createTextOutput('EVENT_RECEIVED');
  } catch (error) {
    console.error('Facebook webhook error: ' + error);
    return ContentService.createTextOutput('EVENT_RECEIVED');
  }
}

function processMessengerEvent_(entry, event) {
  if (!event || event.message && event.message.is_echo) return false;
  const psid = fbClean_(event.sender && event.sender.id, 80);
  if (!psid) return false;
  const referral = event.referral || event.postback && event.postback.referral || {};
  const messageText = fbClean_(
    event.message && event.message.text || event.postback && event.postback.payload || attachmentSignal_(event.message),
    320
  );
  const parsed = parseRecruitmentSignal_(messageText);
  const timestamp = event.timestamp ? new Date(Number(event.timestamp)) : new Date();
  upsertFacebookInbox_({
    first_at: timestamp,
    updated_at: timestamp,
    psid: psid,
    full_name: '',
    phone: parsed.phone,
    birth_year: parsed.birth_year,
    province: parsed.province,
    height_cm: parsed.height_cm,
    weight_kg: parsed.weight_kg,
    health_screen: parsed.health_screen,
    trade: parsed.trade,
    interaction_source: 'Messenger',
    campaign_name: '', adset_name: '', ad_name: '', campaign_id: '', adset_id: '',
    ad_id: fbClean_(referral.ad_id || '', 80),
    referral: fbClean_([referral.source, referral.type, referral.ref].filter(Boolean).join(' | '), 200),
    placement: '',
    last_signal: messageText,
    intake_mode: 'webhook_messenger'
  });
  return true;
}

function processLeadgenChange_(entry, value) {
  const leadId = fbClean_(value.leadgen_id || '', 100);
  if (!leadId) return false;
  const token = fbProperty_('META_PAGE_ACCESS_TOKEN');
  let fields = {};
  let adId = fbClean_(value.ad_id || '', 80);
  if (token) {
    try {
      const lead = graphGet_(leadId, 'id,created_time,ad_id,form_id,field_data', token);
      adId = fbClean_(lead.ad_id || adId, 80);
      fields = leadFieldMap_(lead.field_data || []);
    } catch (error) {
      console.error('Cannot load Lead Ads record ' + leadId + ': ' + error);
    }
  }
  const normalized = normalizeLeadFields_(fields);
  upsertFacebookInbox_({
    first_at: value.created_time ? new Date(Number(value.created_time) * 1000) : new Date(),
    updated_at: new Date(),
    psid: '',
    lead_id: leadId,
    full_name: normalized.full_name,
    phone: normalized.phone,
    birth_year: normalized.birth_year,
    province: normalized.province,
    height_cm: normalized.height_cm,
    weight_kg: normalized.weight_kg,
    health_screen: normalized.health_screen,
    trade: normalized.trade,
    interaction_source: 'Lead Ads',
    campaign_name: '', adset_name: '', ad_name: '', campaign_id: '', adset_id: '', ad_id: adId,
    referral: fbClean_('leadgen:' + leadId, 200), placement: '', last_signal: 'Lead Ads form',
    intake_mode: 'webhook_lead_ads'
  });
  return true;
}

function upsertFacebookInbox_(data) {
  const spreadsheet = getFacebookSpreadsheet_();
  const sheet = ensureFacebookInbox_(spreadsheet);
  const headers = fbHeaderMap_(sheet);
  const lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    let row = findInboxIdentityRow_(sheet, headers, data.psid, data.lead_id, data.phone);
    if (!row) {
      row = sheet.getLastRow() + 1;
      sheet.getRange(row, 1, 1, sheet.getLastColumn()).setValues([new Array(sheet.getLastColumn()).fill('')]);
      fbSet_(sheet, row, headers, 'Thời gian đầu', data.first_at || new Date());
    }
    const current = fbRowObject_(sheet, row, headers);
    const fillIfBlank = function(header, value) {
      if (value !== '' && value !== null && value !== undefined && !current[header]) fbSet_(sheet, row, headers, header, value);
    };
    fbSet_(sheet, row, headers, 'Cập nhật cuối', data.updated_at || new Date());
    fillIfBlank('Facebook PSID', data.psid);
    fillIfBlank('Họ tên Facebook', data.full_name);
    fillIfBlank('SĐT', normalizePhone_(data.phone));
    fillIfBlank('Năm sinh', data.birth_year);
    fillIfBlank('Tỉnh/thành', data.province);
    fillIfBlank('Chiều cao (cm)', data.height_cm);
    fillIfBlank('Cân nặng (kg)', data.weight_kg);
    if (data.health_screen && data.health_screen !== 'Chưa cung cấp') fillIfBlank('Sức khỏe sơ bộ', data.health_screen);
    fillIfBlank('Nghề quan tâm', data.trade);
    fillIfBlank('Nguồn tương tác', data.interaction_source || 'Messenger');
    fillIfBlank('Facebook Campaign', data.campaign_name);
    fillIfBlank('Facebook Ad Set', data.adset_name);
    fillIfBlank('Facebook Ad', data.ad_name);
    fillIfBlank('Campaign ID', data.campaign_id);
    fillIfBlank('Ad Set ID', data.adset_id);
    fillIfBlank('Ad ID', data.ad_id);
    fillIfBlank('Referral', data.referral);
    fillIfBlank('Placement', data.placement);
    if (data.last_signal) fbSet_(sheet, row, headers, 'Tín hiệu/tin nhắn gần nhất', fbClean_(data.last_signal, 320));
    fillIfBlank('Phụ trách', fbProperty_('DEFAULT_OWNER') || 'Nguyễn Tử Linh');
    if (data.lead_id) appendInboxNote_(sheet, row, headers, 'Facebook Lead ID=' + data.lead_id);
    if (data.intake_mode) appendInboxNote_(sheet, row, headers, 'intake=' + data.intake_mode);
    updateInboxCompletion_(sheet, row, headers);
    return row;
  } finally {
    lock.releaseLock();
  }
}

function syncFacebookInbox() {
  const spreadsheet = getFacebookSpreadsheet_();
  const inbox = ensureFacebookInbox_(spreadsheet);
  const master = spreadsheet.getSheetByName(MASTER_SHEET);
  if (!master) throw new Error('Không tìm thấy sheet Ứng viên');
  ensureMasterFacebookHeaders_(spreadsheet);
  if (inbox.getLastRow() < 2) return { ok: true, created: 0, merged: 0, waiting: 0 };
  const ih = fbHeaderMap_(inbox);
  const mh = fbHeaderMap_(master);
  let created = 0, merged = 0, waiting = 0;
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    for (let row = 2; row <= inbox.getLastRow(); row += 1) {
      const record = fbRowObject_(inbox, row, ih);
      const syncStatus = String(record['Trạng thái đồng bộ'] || '');
      if (syncStatus === 'Đã đồng bộ' || syncStatus.indexOf('Trùng SĐT') === 0) continue;
      const completeness = facebookCompleteness_(record);
      fbSet_(inbox, row, ih, 'Mức hoàn thiện', completeness.label);
      if (!completeness.ready) {
        fbSet_(inbox, row, ih, 'Trạng thái đồng bộ', 'Chờ đủ thông tin');
        waiting += 1;
        continue;
      }
      const phone = normalizePhone_(record['SĐT']);
      const existingRow = findMasterPhoneRow_(master, mh, phone);
      if (existingRow) {
        mergeFacebookAttribution_(master, existingRow, mh, record, 'facebook_inbox_merge');
        const code = master.getRange(existingRow, mh['Mã đăng ký']).getDisplayValue();
        fbSet_(inbox, row, ih, 'Trạng thái đồng bộ', 'Trùng SĐT - đã gộp');
        fbSet_(inbox, row, ih, 'Mã CRM', code);
        fbSet_(inbox, row, ih, 'Đối chiếu SĐT', 'Đã có ở dòng ' + existingRow);
        merged += 1;
        continue;
      }
      const code = createFacebookApplicationCode_();
      const masterRow = master.getLastRow() + 1;
      const assessment = assessFacebookRecord_(record);
      const rowValues = new Array(master.getLastColumn()).fill('');
      const put = function(header, value) { if (mh[header]) rowValues[mh[header] - 1] = value; };
      const firstAt = asFacebookDate_(record['Thời gian đầu']) || new Date();
      put('Mã đăng ký', code);
      put('Thời gian đăng ký', firstAt);
      put('Họ và tên', fbClean_(record['Họ tên Facebook'], 80));
      put('Số điện thoại', phone);
      put('Tuổi', '');
      put('Tỉnh/thành', fbClean_(record['Tỉnh/thành'], 80));
      put('Chiều cao (cm)', Number(record['Chiều cao (cm)']) || '');
      put('Cân nặng (kg)', Number(record['Cân nặng (kg)']) || '');
      put('Trình độ', '');
      put('Nghề quan tâm', fbClean_(record['Nghề quan tâm'], 100));
      put('Sức khỏe sơ bộ', fbClean_(record['Sức khỏe sơ bộ'], 100));
      put('Kết quả sơ bộ', assessment.key);
      put('Nguồn', 'Facebook');
      put('Hình thức', fbClean_(record['Nguồn tương tác'] || 'Messenger', 40));
      put('Chiến dịch', fbClean_(record['Facebook Campaign'] || record['Campaign ID'] || 'facebook_unattributed', 120));
      put('Nội dung', fbClean_(record['Facebook Ad'] || record['Ad ID'] || 'messenger', 120));
      put('Trang đăng ký', 'https://m.me/thaylinhtuyenthomo');
      put('Trạng thái', assessment.key === 'not_eligible' ? 'Không phù hợp' : 'Mới');
      put('Phụ trách', fbClean_(record['Phụ trách'] || fbProperty_('DEFAULT_OWNER') || 'Nguyễn Tử Linh', 80));
      if (assessment.key !== 'not_eligible') {
        put('Hạn phản hồi', new Date(firstAt.getTime() + 2 * 60 * 60 * 1000));
        put('Cảnh báo chăm sóc', 'Cần liên hệ trong 2 giờ');
      }
      put('Tin nhắn gợi ý', 'Ứng viên Facebook đã gửi năm sinh – chiều cao/cân nặng – sức khỏe. Kiểm tra lại điều kiện và hướng dẫn hồ sơ tiếp theo.');
      put('Ngữ cảnh biểu mẫu', 'facebook_bridge_v1');
      put('Phiên bản dữ liệu', 4);
      put('Trạng thái xử lý', 'Chưa xử lý');
      put('Nhóm nguồn', 'facebook');
      put('SĐT E.164', phoneE164_(phone));
      put('Sẵn sàng dữ liệu Ads', phone ? 'Có SĐT E.164' : 'Chưa đủ');
      put('Chiến dịch nội bộ', fbClean_(record['Campaign ID'], 100));
      put('Nội dung nội bộ', fbClean_(record['Ad ID'], 100));
      put('Phân loại chuẩn', assessment.key === 'not_eligible' ? 'Loại' : 'Quan Tâm');
      put('Giai đoạn phễu', 'Đã gửi thông tin');
      put('Năm sinh khai báo', Number(record['Năm sinh']) || '');
      put('Facebook PSID', fbClean_(record['Facebook PSID'], 100));
      put('Facebook Lead ID', facebookLeadIdFromRecord_(record));
      put('Facebook Ad ID', fbClean_(record['Ad ID'], 100));
      put('Facebook Ad Set ID', fbClean_(record['Ad Set ID'], 100));
      put('Facebook Campaign ID', fbClean_(record['Campaign ID'], 100));
      put('Facebook Ad', fbClean_(record['Facebook Ad'], 120));
      put('Facebook Ad Set', fbClean_(record['Facebook Ad Set'], 120));
      put('Facebook Campaign', fbClean_(record['Facebook Campaign'], 120));
      put('Facebook Referral', fbClean_(record['Referral'], 200));
      put('Facebook Intake', facebookIntakeFromRecord_(record));
      put('Meta Placement', fbClean_(record['Placement'], 80));
      master.getRange(masterRow, 1, 1, master.getLastColumn()).setValues([rowValues]);
      fbSet_(inbox, row, ih, 'Trạng thái đồng bộ', 'Đã đồng bộ');
      fbSet_(inbox, row, ih, 'Mã CRM', code);
      fbSet_(inbox, row, ih, 'Đối chiếu SĐT', 'Tạo mới dòng ' + masterRow);
      created += 1;
    }
  } finally {
    lock.releaseLock();
  }
  return { ok: true, created: created, merged: merged, waiting: waiting };
}

function enrichFacebookMetadata() {
  const spreadsheet = getFacebookSpreadsheet_();
  const sheet = ensureFacebookInbox_(spreadsheet);
  if (sheet.getLastRow() < 2) return { ok: true, updated: 0 };
  const headers = fbHeaderMap_(sheet);
  const pageToken = fbProperty_('META_PAGE_ACCESS_TOKEN');
  const adsToken = fbProperty_('META_ADS_ACCESS_TOKEN');
  let updated = 0;
  for (let row = 2; row <= sheet.getLastRow() && updated < 30; row += 1) {
    const record = fbRowObject_(sheet, row, headers);
    const psid = String(record['Facebook PSID'] || '');
    if (pageToken && psid && !record['Họ tên Facebook']) {
      try {
        const profile = graphGet_(psid, 'name,first_name,last_name', pageToken);
        if (profile.name) { fbSet_(sheet, row, headers, 'Họ tên Facebook', fbClean_(profile.name, 80)); updated += 1; }
      } catch (error) { console.error('Profile enrichment failed: ' + error); }
    }
    const adId = String(record['Ad ID'] || '');
    if (adsToken && adId && (!record['Facebook Campaign'] || !record['Facebook Ad'])) {
      try {
        const ad = graphGet_(adId, 'id,name,adset{id,name},campaign{id,name}', adsToken);
        if (ad.name) fbSet_(sheet, row, headers, 'Facebook Ad', fbClean_(ad.name, 120));
        if (ad.adset) {
          fbSet_(sheet, row, headers, 'Ad Set ID', fbClean_(ad.adset.id, 100));
          fbSet_(sheet, row, headers, 'Facebook Ad Set', fbClean_(ad.adset.name, 120));
        }
        if (ad.campaign) {
          fbSet_(sheet, row, headers, 'Campaign ID', fbClean_(ad.campaign.id, 100));
          fbSet_(sheet, row, headers, 'Facebook Campaign', fbClean_(ad.campaign.name, 120));
        }
        updated += 1;
      } catch (error) { console.error('Ad enrichment failed: ' + error); }
    }
    updateInboxCompletion_(sheet, row, headers);
  }
  if (updated) syncFacebookInbox();
  return { ok: true, updated: updated };
}

function ensureFacebookInbox_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(FB_INBOX_SHEET) || spreadsheet.insertSheet(FB_INBOX_SHEET);
  ensureHeaders_(sheet, FB_INBOX_HEADERS);
  sheet.setFrozenRows(1);
  return sheet;
}

function ensureMasterFacebookHeaders_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(MASTER_SHEET);
  if (!sheet) throw new Error('Không tìm thấy sheet Ứng viên');
  ensureHeaders_(sheet, MASTER_FB_HEADERS);
  return sheet;
}

function ensureHeaders_(sheet, required) {
  const width = Math.max(sheet.getLastColumn(), 1);
  const current = sheet.getRange(1, 1, 1, width).getDisplayValues()[0];
  const missing = required.filter(function(header) { return current.indexOf(header) === -1; });
  if (missing.length) sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
}

function installFacebookBridgeTriggers_() {
  ['syncFacebookInbox', 'enrichFacebookMetadata'].forEach(function(handler) {
    ScriptApp.getProjectTriggers().forEach(function(trigger) {
      if (trigger.getHandlerFunction() === handler) ScriptApp.deleteTrigger(trigger);
    });
  });
  ScriptApp.newTrigger('syncFacebookInbox').timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger('enrichFacebookMetadata').timeBased().everyMinutes(15).create();
}

function updateInboxCompletion_(sheet, row, headers) {
  const record = fbRowObject_(sheet, row, headers);
  const completeness = facebookCompleteness_(record);
  fbSet_(sheet, row, headers, 'Mức hoàn thiện', completeness.label);
  const status = String(record['Trạng thái đồng bộ'] || '');
  if (!status || status === 'Chờ đủ thông tin' || status === 'Sẵn sàng đồng bộ') {
    fbSet_(sheet, row, headers, 'Trạng thái đồng bộ', completeness.ready ? 'Sẵn sàng đồng bộ' : 'Chờ đủ thông tin');
  }
}

function facebookCompleteness_(record) {
  const checks = [
    Boolean(String(record['Họ tên Facebook'] || '').trim()),
    Boolean(normalizePhone_(record['SĐT'])),
    isBirthYear_(record['Năm sinh']),
    Number(record['Chiều cao (cm)']) >= 130,
    Number(record['Cân nặng (kg)']) >= 30,
    Boolean(record['Sức khỏe sơ bộ']) && String(record['Sức khỏe sơ bộ']) !== 'Chưa cung cấp'
  ];
  const count = checks.filter(Boolean).length;
  return { ready: count === checks.length, label: count + '/6' };
}

function assessFacebookRecord_(record) {
  const year = Number(record['Năm sinh']);
  const currentYear = Number(Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'yyyy'));
  const minYear = currentYear - 40;
  const maxYear = currentYear - 18;
  if (!year || year < minYear || year > maxYear || Number(record['Chiều cao (cm)']) < 153 || Number(record['Cân nặng (kg)']) < 47) return { key: 'not_eligible' };
  if (year === minYear || year === maxYear || String(record['Sức khỏe sơ bộ']) !== 'Sức khỏe tốt, sẵn sàng khám tuyển') return { key: 'needs_review' };
  return { key: 'eligible' };
}

function findInboxIdentityRow_(sheet, headers, psid, leadId, phone) {
  if (sheet.getLastRow() < 2) return 0;
  const pairs = [
    ['Facebook PSID', psid],
    ['SĐT', normalizePhone_(phone)]
  ];
  for (const pair of pairs) {
    const col = headers[pair[0]];
    const value = String(pair[1] || '').trim();
    if (!col || !value) continue;
    const found = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).createTextFinder(value).matchEntireCell(true).findNext();
    if (found) return found.getRow();
  }
  if (leadId) {
    const notesCol = headers['Ghi chú'];
    const found = sheet.getRange(2, notesCol, sheet.getLastRow() - 1, 1).createTextFinder('Facebook Lead ID=' + leadId).matchCase(false).findNext();
    if (found) return found.getRow();
  }
  return 0;
}

function findMasterPhoneRow_(sheet, headers, phone) {
  if (!phone || sheet.getLastRow() < 2) return 0;
  for (const header of ['Số điện thoại', 'SĐT E.164']) {
    const col = headers[header];
    if (!col) continue;
    const search = header === 'SĐT E.164' ? phoneE164_(phone) : phone;
    const found = sheet.getRange(2, col, sheet.getLastRow() - 1, 1).createTextFinder(search).matchEntireCell(true).findNext();
    if (found) return found.getRow();
  }
  return 0;
}

function mergeFacebookAttribution_(sheet, row, headers, record, intakeMode) {
  const values = {
    'Facebook PSID': record['Facebook PSID'],
    'Facebook Lead ID': facebookLeadIdFromRecord_(record),
    'Facebook Ad ID': record['Ad ID'],
    'Facebook Ad Set ID': record['Ad Set ID'],
    'Facebook Campaign ID': record['Campaign ID'],
    'Facebook Ad': record['Facebook Ad'],
    'Facebook Ad Set': record['Facebook Ad Set'],
    'Facebook Campaign': record['Facebook Campaign'],
    'Facebook Referral': record['Referral'],
    'Facebook Intake': intakeMode,
    'Meta Placement': record['Placement'],
    'Năm sinh khai báo': record['Năm sinh']
  };
  Object.keys(values).forEach(function(header) {
    if (!headers[header] || !values[header]) return;
    const cell = sheet.getRange(row, headers[header]);
    if (!cell.getValue()) cell.setValue(values[header]);
  });
  if (headers['Ghi chú']) {
    const cell = sheet.getRange(row, headers['Ghi chú']);
    const existing = String(cell.getValue() || '');
    const note = 'Facebook bổ sung ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm');
    if (existing.indexOf(note) === -1) cell.setValue([existing, note].filter(Boolean).join(' | ').slice(0, 500));
  }
}

function parseRecruitmentSignal_(text) {
  const raw = String(text || '');
  const ascii = normalizeVietnamese_(raw);
  const phone = normalizePhone_(raw);
  let birthYear = '';
  const labeledYear = ascii.match(/(?:nam sinh|sinh nam|sinh|ns|sn)\D{0,12}((?:19|20)\d{2})/i);
  if (labeledYear) birthYear = labeledYear[1];
  if (!birthYear) {
    const years = ascii.match(/\b(?:19|20)\d{2}\b/g) || [];
    birthYear = years.find(function(value) { const y = Number(value); return y >= 1980 && y <= 2010; }) || '';
  }
  let height = '';
  let match = ascii.match(/\b1\s*m\s*(\d{2})\b/i);
  if (match) height = Number('1' + match[1]);
  if (!height) {
    match = ascii.match(/(?:cao|chieu cao)\D{0,12}(1[3-9]\d|2[0-2]\d)\s*(?:cm)?/i) || ascii.match(/\b(1[3-9]\d|2[0-2]\d)\s*cm\b/i);
    if (match) height = Number(match[1]);
  }
  let weight = '';
  match = ascii.match(/(?:nang|can nang)\D{0,12}(\d{2,3})\s*(?:kg)?/i) || ascii.match(/\b(\d{2,3})\s*kg\b/i);
  if (match) weight = Number(match[1]);
  let health = 'Chưa cung cấp';
  if (/(suc khoe tot|sk tot|khoe tot|binh thuong|khong benh|suc khoe binh thuong)/i.test(ascii)) health = 'Sức khỏe tốt, sẵn sàng khám tuyển';
  else if (/(can|mat|huyet ap|tim|hen|ho hap|dong kinh|benh|dang dieu tri|suc khoe)/i.test(ascii)) health = 'Cần trao đổi thêm trước khi khám';
  let trade = '';
  if (/(co dien|dien mo)/i.test(ascii)) trade = 'Kỹ thuật cơ điện mỏ hầm lò';
  else if (/(xay dung mo|dao chong lo|xay dung)/i.test(ascii)) trade = 'Kỹ thuật xây dựng mỏ hầm lò';
  else if (/(khai thac|tho lo|tho mo)/i.test(ascii)) trade = 'Kỹ thuật khai thác mỏ hầm lò';
  return { phone: phone, birth_year: birthYear, height_cm: height, weight_kg: weight, health_screen: health, province: '', trade: trade };
}

function normalizeLeadFields_(fieldMap) {
  const read = function(patterns) {
    for (const key of Object.keys(fieldMap)) {
      const normalized = normalizeVietnamese_(key).replace(/[^a-z0-9]+/g, '_');
      if (patterns.some(function(pattern) { return normalized.indexOf(pattern) !== -1; })) return String(fieldMap[key] || '');
    }
    return '';
  };
  const fullName = read(['full_name', 'ho_ten', 'name']);
  const phone = normalizePhone_(read(['phone_number', 'phone', 'so_dien_thoai', 'sdt']));
  const yearText = read(['birth_year', 'nam_sinh', 'year_of_birth', 'birth']);
  const yearMatch = String(yearText).match(/(?:19|20)\d{2}/);
  const height = Number((read(['height', 'chieu_cao']).match(/\d{3}/) || [])[0]) || '';
  const weight = Number((read(['weight', 'can_nang']).match(/\d{2,3}/) || [])[0]) || '';
  const healthRaw = read(['health', 'suc_khoe']);
  const health = healthRaw ? parseRecruitmentSignal_(healthRaw).health_screen : 'Chưa cung cấp';
  const province = read(['province', 'tinh_thanh', 'tinh', 'location']);
  const tradeRaw = read(['trade', 'nghe', 'job']);
  const trade = tradeRaw ? parseRecruitmentSignal_(tradeRaw).trade : '';
  return { full_name: fullName, phone: phone, birth_year: yearMatch ? yearMatch[0] : '', height_cm: height, weight_kg: weight, health_screen: health, province: province, trade: trade };
}

function leadFieldMap_(fieldData) {
  const out = {};
  (fieldData || []).forEach(function(field) { out[String(field.name || '')] = Array.isArray(field.values) ? field.values.join(' ') : String(field.values || ''); });
  return out;
}

function graphGet_(id, fields, token) {
  const version = fbProperty_('META_GRAPH_VERSION') || 'v26.0';
  const url = 'https://graph.facebook.com/' + version + '/' + encodeURIComponent(id) + '?fields=' + encodeURIComponent(fields) + '&access_token=' + encodeURIComponent(token);
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) throw new Error('Graph HTTP ' + response.getResponseCode());
  return JSON.parse(response.getContentText() || '{}');
}

function getFacebookSpreadsheet_() {
  const id = fbProperty_('SPREADSHEET_ID');
  if (!id) throw new Error('Thiếu Script Property SPREADSHEET_ID');
  return SpreadsheetApp.openById(id);
}

function fbProperty_(name) { return String(PropertiesService.getScriptProperties().getProperty(name) || '').trim(); }
function fbHeaderMap_(sheet) { const out = {}; sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].forEach(function(value, index) { if (value) out[value] = index + 1; }); return out; }
function fbRowObject_(sheet, row, headers) { const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0]; const out = {}; Object.keys(headers).forEach(function(header) { out[header] = values[headers[header] - 1]; }); return out; }
function fbSet_(sheet, row, headers, header, value) { if (headers[header]) sheet.getRange(row, headers[header]).setValue(value); }
function fbClean_(value, max) { const text = String(value === undefined || value === null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max || 200); return /^[=+\-@]/.test(text) ? "'" + text : text; }
function normalizePhone_(value) { let digits = String(value || '').replace(/\D/g, ''); if (digits.indexOf('84') === 0) digits = '0' + digits.slice(2); return /^0[35789]\d{8}$/.test(digits) ? digits : ''; }
function phoneE164_(value) { const phone = normalizePhone_(value); return phone ? '+84' + phone.slice(1) : ''; }
function isBirthYear_(value) { const year = Number(value); return Number.isInteger(year) && year >= 1960 && year <= new Date().getFullYear() - 15; }
function normalizeVietnamese_(value) { return String(value || '').toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'); }
function asFacebookDate_(value) { const date = value instanceof Date ? value : new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
function createFacebookApplicationCode_() { const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'yyMMdd'); const suffix = Utilities.getUuid().replace(/[^A-Za-z0-9]/g, '').slice(0, 5).toUpperCase(); return 'TL-' + date + '-' + suffix; }
function attachmentSignal_(message) { const attachments = message && message.attachments || []; return attachments.length ? '[Đính kèm ' + attachments.map(function(item) { return item.type || 'file'; }).join(', ') + ']' : ''; }
function appendInboxNote_(sheet, row, headers, note) { if (!headers['Ghi chú'] || !note) return; const cell = sheet.getRange(row, headers['Ghi chú']); const existing = String(cell.getValue() || ''); if (existing.indexOf(note) === -1) cell.setValue([existing, note].filter(Boolean).join(' | ').slice(0, 500)); }
function facebookLeadIdFromRecord_(record) { const note = String(record['Ghi chú'] || ''); const match = note.match(/Facebook Lead ID=([^|\s]+)/); return match ? match[1] : ''; }
function facebookIntakeFromRecord_(record) { const note = String(record['Ghi chú'] || ''); const match = note.match(/intake=([^|\s]+)/); return match ? match[1] : 'staff_sheet'; }
function fbJson_(payload) { return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON); }
