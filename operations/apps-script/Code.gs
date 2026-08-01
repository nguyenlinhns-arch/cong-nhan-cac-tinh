const SHEET_NAME = 'Ứng viên';
const DASHBOARD_SHEET_NAME = 'Tổng quan';
const BASE_HEADERS = [
  'Mã đăng ký', 'Thời gian đăng ký', 'Họ và tên', 'Số điện thoại', 'Ngày sinh', 'Tuổi',
  'Tỉnh/thành', 'Chiều cao (cm)', 'Cân nặng (kg)', 'Trình độ', 'Nghề quan tâm',
  'Sức khỏe sơ bộ', 'Kết quả sơ bộ', 'Nguồn', 'Hình thức', 'Chiến dịch', 'Nội dung',
  'Trang đăng ký', 'Trạng thái', 'Phụ trách', 'Lần liên hệ gần nhất', 'Lịch hẹn tiếp theo', 'Ghi chú'
];
const AUTOMATION_HEADERS = [
  'Hạn phản hồi', 'Cảnh báo chăm sóc', 'Nhắc 2 giờ đã gửi', 'Nhắc 24 giờ đã gửi',
  'Ngày đủ điều kiện', 'Ngày nộp hồ sơ', 'Ngày nhập học', 'Lý do không phù hợp',
  'Tin nhắn gợi ý', 'Ngữ cảnh biểu mẫu', 'Phiên bản dữ liệu'
];
const HEADERS = BASE_HEADERS.concat(AUTOMATION_HEADERS);
const STATUS_VALUES = ['Mới', 'Đã gọi', 'Quan tâm', 'Hẹn khám', 'Đủ điều kiện', 'Nộp hồ sơ', 'Nhập học', 'Không phù hợp', 'Không liên lạc được'];
const CLOSED_STATUSES = ['Nhập học', 'Không phù hợp'];

function setupRecruitmentCRM() {
  const spreadsheet = getSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  ensureHeaders_(sheet);
  formatCandidateSheet_(sheet);
  setupDashboard_(spreadsheet, sheet);
  installAutomationTriggers_(spreadsheet.getId());
  return {
    ok: true,
    version: 2,
    spreadsheet: spreadsheet.getUrl(),
    sheet: SHEET_NAME,
    dashboard: DASHBOARD_SHEET_NAME,
    headers: HEADERS.length
  };
}

function upgradeRecruitmentCRMV2() {
  return setupRecruitmentCRM();
}

function doGet() {
  return json_({ ok: true, service: 'Thầy Linh recruitment intake', version: 2 });
}

function doPost(event) {
  try {
    const data = JSON.parse(event && event.postData && event.postData.contents || '{}');
    validate_(data);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let duplicate = false;
    let rowNumber = 0;
    try {
      const sheet = getCandidateSheet_();
      ensureHeaders_(sheet);
      const existing = findCode_(sheet, data.code);
      if (existing) {
        duplicate = true;
        rowNumber = existing.getRow();
      } else {
        const headers = headerMap_(sheet);
        rowNumber = sheet.getLastRow() + 1;
        sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).setValues([toRow_(data, headers)]);
      }
    } finally {
      lock.releaseLock();
    }
    if (!duplicate) sendNewLeadAlert_(data, rowNumber);
    return json_({ ok: true, code: data.code, duplicate: duplicate });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error.message || error).slice(0, 160) });
  }
}

function handleCandidateEdit(event) {
  if (!event || !event.range || event.range.getSheet().getName() !== SHEET_NAME || event.range.getRow() < 2) return;
  const sheet = event.range.getSheet();
  const headers = headerMap_(sheet);
  const statusColumn = headers['Trạng thái'];
  const lastContactColumn = headers['Lần liên hệ gần nhất'];
  if (![statusColumn, lastContactColumn, headers['Lịch hẹn tiếp theo']].includes(event.range.getColumn())) return;

  const row = event.range.getRow();
  const now = new Date();
  const status = String(sheet.getRange(row, statusColumn).getValue() || 'Mới');
  if (event.range.getColumn() === statusColumn && status !== 'Mới' && !sheet.getRange(row, lastContactColumn).getValue()) {
    sheet.getRange(row, lastContactColumn).setValue(now);
  }
  if (status === 'Đủ điều kiện') stampIfEmpty_(sheet, row, headers['Ngày đủ điều kiện'], now);
  if (status === 'Nộp hồ sơ') stampIfEmpty_(sheet, row, headers['Ngày nộp hồ sơ'], now);
  if (status === 'Nhập học') stampIfEmpty_(sheet, row, headers['Ngày nhập học'], now);

  if (CLOSED_STATUSES.includes(status)) {
    sheet.getRange(row, headers['Hạn phản hồi']).clearContent();
    sheet.getRange(row, headers['Cảnh báo chăm sóc']).clearContent();
  } else {
    sheet.getRange(row, headers['Hạn phản hồi']).setValue(new Date(now.getTime() + 24 * 60 * 60 * 1000));
    sheet.getRange(row, headers['Cảnh báo chăm sóc']).setValue('Đang trong hạn');
  }
  const values = rowObject_(sheet, row, headers);
  sheet.getRange(row, headers['Tin nhắn gợi ý']).setValue(suggestedMessage_(status, values));
}

function checkFollowUpReminders() {
  const sheet = getCandidateSheet_();
  if (sheet.getLastRow() < 2) return { ok: true, alerts: 0 };
  const headers = headerMap_(sheet);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const now = new Date();
  const alerts = [];

  values.forEach(function(rowValues, index) {
    const row = index + 2;
    const record = objectFromValues_(rowValues, headers);
    const status = String(record['Trạng thái'] || 'Mới');
    if (CLOSED_STATUSES.includes(status)) return;
    const createdAt = asDate_(record['Thời gian đăng ký']);
    const deadline = asDate_(record['Hạn phản hồi']);
    if (!createdAt) return;

    const elapsedHours = (now.getTime() - createdAt.getTime()) / 3600000;
    const isOverdue = deadline && deadline.getTime() < now.getTime();
    sheet.getRange(row, headers['Cảnh báo chăm sóc']).setValue(isOverdue ? 'QUÁ HẠN – cần liên hệ' : 'Đang trong hạn');

    if (elapsedHours >= 2 && !record['Nhắc 2 giờ đã gửi'] && status === 'Mới') {
      sheet.getRange(row, headers['Nhắc 2 giờ đã gửi']).setValue(now);
      alerts.push(alertRecord_(record, 'Quá 2 giờ chưa cập nhật'));
    }
    if (elapsedHours >= 24 && !record['Nhắc 24 giờ đã gửi']) {
      sheet.getRange(row, headers['Nhắc 24 giờ đã gửi']).setValue(now);
      alerts.push(alertRecord_(record, 'Quá 24 giờ chưa hoàn tất chăm sóc'));
    }
  });

  if (alerts.length) sendReminderAlert_(alerts);
  return { ok: true, alerts: alerts.length };
}

function sendDailyRecruitmentDigest() {
  const sheet = getCandidateSheet_();
  const recipients = alertRecipients_();
  if (!recipients || sheet.getLastRow() < 2) return { ok: true, sent: false };
  const headers = headerMap_(sheet);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const counts = {};
  let overdue = 0;
  values.forEach(function(rowValues) {
    const record = objectFromValues_(rowValues, headers);
    const status = String(record['Trạng thái'] || 'Mới');
    counts[status] = (counts[status] || 0) + 1;
    if (String(record['Cảnh báo chăm sóc'] || '').indexOf('QUÁ HẠN') === 0) overdue += 1;
  });
  const dashboardUrl = getSpreadsheet_().getUrl() + '#gid=' + sheet.getSheetId();
  const lines = STATUS_VALUES.map(function(status) { return '<li>' + html_(status) + ': <strong>' + (counts[status] || 0) + '</strong></li>'; }).join('');
  MailApp.sendEmail({
    to: recipients,
    subject: '[Tuyển Thợ Mỏ] Tổng hợp CRM ngày ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy'),
    htmlBody: '<p>Hồ sơ quá hạn chăm sóc: <strong>' + overdue + '</strong></p><ul>' + lines + '</ul><p><a href="' + dashboardUrl + '">Mở CRM tuyển dụng</a></p>',
    name: 'Thầy Linh – Tuyển Thợ Mỏ'
  });
  return { ok: true, sent: true, overdue: overdue };
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Thiếu Script Property SPREADSHEET_ID');
  return SpreadsheetApp.openById(id);
}

function getCandidateSheet_() {
  const sheet = getSpreadsheet_().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Chưa chạy setupRecruitmentCRM');
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  const currentWidth = Math.max(sheet.getLastColumn(), 1);
  const current = sheet.getRange(1, 1, 1, currentWidth).getDisplayValues()[0];
  const missing = HEADERS.filter(function(header) { return current.indexOf(header) === -1; });
  if (missing.length) sheet.getRange(1, current.length + 1, 1, missing.length).setValues([missing]);
}

function formatCandidateSheet_(sheet) {
  const headers = headerMap_(sheet);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold').setBackground('#0b4f46').setFontColor('#ffffff').setWrap(true);
  const dataRows = Math.max(sheet.getMaxRows() - 1, 1);
  ['Thời gian đăng ký', 'Lần liên hệ gần nhất', 'Lịch hẹn tiếp theo', 'Hạn phản hồi', 'Nhắc 2 giờ đã gửi', 'Nhắc 24 giờ đã gửi', 'Ngày đủ điều kiện', 'Ngày nộp hồ sơ', 'Ngày nhập học'].forEach(function(header) {
    sheet.getRange(2, headers[header], dataRows, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  });
  sheet.getRange(2, headers['Ngày sinh'], dataRows, 1).setNumberFormat('dd/mm/yyyy');
  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS_VALUES, true).setAllowInvalid(false).build();
  sheet.getRange(2, headers['Trạng thái'], dataRows, 1).setDataValidation(statusRule);
  if (!sheet.getConditionalFormatRules().length) {
    const statusRange = sheet.getRange(2, headers['Trạng thái'], dataRows, 1);
    const warningRange = sheet.getRange(2, headers['Cảnh báo chăm sóc'], dataRows, 1);
    sheet.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Mới').setBackground('#fff2cc').setRanges([statusRange]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Nhập học').setBackground('#d9ead3').setRanges([statusRange]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextContains('QUÁ HẠN').setBackground('#f4cccc').setFontColor('#990000').setRanges([warningRange]).build()
    ]);
  }
  sheet.autoResizeColumns(1, Math.min(sheet.getLastColumn(), 20));
}

function setupDashboard_(spreadsheet, candidateSheet) {
  const dashboard = spreadsheet.getSheetByName(DASHBOARD_SHEET_NAME) || spreadsheet.insertSheet(DASHBOARD_SHEET_NAME);
  dashboard.clear();
  const headers = headerMap_(candidateSheet);
  const statusCol = columnLetter_(headers['Trạng thái']);
  const deadlineCol = columnLetter_(headers['Hạn phản hồi']);
  const sourceCol = columnLetter_(headers['Nguồn']);
  dashboard.getRange('A1:F1').merge().setValue('BẢNG ĐIỀU HÀNH TUYỂN DỤNG').setFontSize(16).setFontWeight('bold').setBackground('#0b4f46').setFontColor('#ffffff').setHorizontalAlignment('center');
  dashboard.getRange('A3:A7').setValues([['Hồ sơ mới'], ['Quá hạn chăm sóc'], ['Đủ điều kiện'], ['Đã nộp hồ sơ'], ['Đã nhập học']]).setFontWeight('bold');
  dashboard.getRange('B3').setFormula("=COUNTIF('" + SHEET_NAME + "'!" + statusCol + "2:" + statusCol + ",\"Mới\")");
  dashboard.getRange('B4').setFormula("=COUNTIFS('" + SHEET_NAME + "'!" + deadlineCol + "2:" + deadlineCol + ",\"<\"&NOW(),'" + SHEET_NAME + "'!" + deadlineCol + "2:" + deadlineCol + ",\"<>\",'" + SHEET_NAME + "'!" + statusCol + "2:" + statusCol + ",\"<>Nhập học\",'" + SHEET_NAME + "'!" + statusCol + "2:" + statusCol + ",\"<>Không phù hợp\")");
  dashboard.getRange('B5').setFormula("=COUNTIF('" + SHEET_NAME + "'!" + statusCol + "2:" + statusCol + ",\"Đủ điều kiện\")");
  dashboard.getRange('B6').setFormula("=COUNTIF('" + SHEET_NAME + "'!" + statusCol + "2:" + statusCol + ",\"Nộp hồ sơ\")");
  dashboard.getRange('B7').setFormula("=COUNTIF('" + SHEET_NAME + "'!" + statusCol + "2:" + statusCol + ",\"Nhập học\")");
  dashboard.getRange('D3').setValue('Kết quả theo nguồn và trạng thái').setFontWeight('bold');
  dashboard.getRange('D4').setFormula("=QUERY({'" + SHEET_NAME + "'!" + sourceCol + "2:" + sourceCol + ",'" + SHEET_NAME + "'!" + statusCol + "2:" + statusCol + "},\"select Col1,count(Col1) where Col1 is not null group by Col1 pivot Col2 label Col1 'Nguồn'\",0)");
  dashboard.getRange('A9').setValue('Cập nhật tự động khi trạng thái hồ sơ thay đổi. Chỉ số chính cần theo dõi: hồ sơ mới → đủ điều kiện → nộp hồ sơ → nhập học.').setWrap(true);
  dashboard.setFrozenRows(1);
  dashboard.setColumnWidths(1, 6, 150);
}

function installAutomationTriggers_(spreadsheetId) {
  const handlers = ['handleCandidateEdit', 'checkFollowUpReminders', 'sendDailyRecruitmentDigest'];
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (handlers.indexOf(trigger.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('handleCandidateEdit').forSpreadsheet(spreadsheetId).onEdit().create();
  ScriptApp.newTrigger('checkFollowUpReminders').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('sendDailyRecruitmentDigest').timeBased().atHour(7).everyDays(1).create();
}

function validate_(data) {
  if (![1, 2].includes(Number(data.schema_version))) throw new Error('Phiên bản dữ liệu không hợp lệ');
  if (String(data.website || '').trim()) throw new Error('Yêu cầu không hợp lệ');
  if (!/^TL-\d{6}-[A-Z0-9]{5}$/.test(String(data.code || ''))) throw new Error('Mã đăng ký không hợp lệ');
  if (!/^0[35789]\d{8}$/.test(String(data.phone || ''))) throw new Error('Số điện thoại không hợp lệ');
  if (!data.consent) throw new Error('Chưa có sự đồng ý');
  if (String(data.full_name || '').trim().length < 2) throw new Error('Họ tên không hợp lệ');
  if (Number(data.height_cm) < 130 || Number(data.height_cm) > 220) throw new Error('Chiều cao không hợp lệ');
  if (Number(data.weight_kg) < 30 || Number(data.weight_kg) > 200) throw new Error('Cân nặng không hợp lệ');
  if (['eligible', 'needs_review', 'not_eligible'].indexOf(data.eligibility) === -1) throw new Error('Kết quả không hợp lệ');
}

function toRow_(data, headers) {
  const status = data.eligibility === 'not_eligible' ? 'Không phù hợp' : 'Mới';
  const createdAt = asDate_(data.created_at) || new Date();
  const record = {
    'Mã đăng ký': clean_(data.code, 24),
    'Thời gian đăng ký': createdAt,
    'Họ và tên': clean_(data.full_name, 80),
    'Số điện thoại': clean_(data.phone, 12),
    'Ngày sinh': clean_(data.birth_date, 10),
    'Tuổi': Number(data.age) || '',
    'Tỉnh/thành': clean_(data.province, 40),
    'Chiều cao (cm)': Number(data.height_cm),
    'Cân nặng (kg)': Number(data.weight_kg),
    'Trình độ': clean_(data.education, 60),
    'Nghề quan tâm': clean_(data.trade, 80),
    'Sức khỏe sơ bộ': clean_(data.health_screen, 80),
    'Kết quả sơ bộ': clean_(data.eligibility, 24),
    'Nguồn': clean_(data.source, 80),
    'Hình thức': clean_(data.medium, 80),
    'Chiến dịch': clean_(data.campaign, 100),
    'Nội dung': clean_(data.content, 100),
    'Trang đăng ký': clean_(data.page_url, 500),
    'Trạng thái': status,
    'Phụ trách': clean_(PropertiesService.getScriptProperties().getProperty('DEFAULT_OWNER') || 'Nguyễn Tử Linh', 80),
    'Hạn phản hồi': status === 'Mới' ? new Date(createdAt.getTime() + 2 * 60 * 60 * 1000) : '',
    'Cảnh báo chăm sóc': status === 'Mới' ? 'Cần liên hệ trong 2 giờ' : '',
    'Lý do không phù hợp': status === 'Không phù hợp' ? 'Không đạt ít nhất một mốc tuổi hoặc thể lực ở bước sàng lọc sơ bộ' : '',
    'Tin nhắn gợi ý': suggestedMessage_(status, { 'Họ và tên': data.full_name, 'Mã đăng ký': data.code }),
    'Ngữ cảnh biểu mẫu': clean_(data.form_context, 100),
    'Phiên bản dữ liệu': Number(data.schema_version)
  };
  return Object.keys(headers).sort(function(a, b) { return headers[a] - headers[b]; }).map(function(header) { return record[header] === undefined ? '' : record[header]; });
}

function sendNewLeadAlert_(data, rowNumber) {
  const recipients = alertRecipients_();
  if (!recipients || MailApp.getRemainingDailyQuota() < 1) return;
  const spreadsheet = getSpreadsheet_();
  MailApp.sendEmail({
    to: recipients,
    subject: '[Hồ sơ mới] ' + clean_(data.full_name, 80) + ' – ' + clean_(data.province, 40),
    htmlBody: '<p>Có hồ sơ mới cần phản hồi trong 2 giờ.</p><ul>' +
      '<li>Mã: <strong>' + html_(data.code) + '</strong></li>' +
      '<li>Ứng viên: ' + html_(data.full_name) + '</li>' +
      '<li>Điện thoại: <strong>' + html_(data.phone) + '</strong></li>' +
      '<li>Tỉnh/thành: ' + html_(data.province) + '</li>' +
      '<li>Kết quả sơ bộ: ' + html_(data.eligibility) + '</li>' +
      '<li>Nguồn: ' + html_(data.source) + ' / ' + html_(data.content) + '</li></ul>' +
      '<p><a href="' + spreadsheet.getUrl() + '#gid=' + getCandidateSheet_().getSheetId() + '&range=A' + rowNumber + '">Mở hồ sơ trong CRM</a></p>',
    name: 'Thầy Linh – Tuyển Thợ Mỏ'
  });
}

function sendReminderAlert_(alerts) {
  const recipients = alertRecipients_();
  if (!recipients || MailApp.getRemainingDailyQuota() < 1) return;
  const rows = alerts.map(function(item) {
    return '<tr><td>' + html_(item.code) + '</td><td>' + html_(item.name) + '</td><td>' + html_(item.phone) + '</td><td>' + html_(item.status) + '</td><td>' + html_(item.reason) + '</td></tr>';
  }).join('');
  MailApp.sendEmail({
    to: recipients,
    subject: '[Cần chăm sóc] ' + alerts.length + ' hồ sơ tuyển thợ mỏ',
    htmlBody: '<p>Các hồ sơ sau cần được cập nhật:</p><table border="1" cellpadding="6" cellspacing="0"><tr><th>Mã</th><th>Ứng viên</th><th>Điện thoại</th><th>Trạng thái</th><th>Lý do</th></tr>' + rows + '</table><p><a href="' + getSpreadsheet_().getUrl() + '">Mở CRM tuyển dụng</a></p>',
    name: 'Thầy Linh – Tuyển Thợ Mỏ'
  });
}

function suggestedMessage_(status, record) {
  const name = clean_(record['Họ và tên'] || '', 80);
  const code = clean_(record['Mã đăng ký'] || '', 24);
  const greeting = name ? 'Chào ' + name + ', ' : 'Chào anh, ';
  if (status === 'Không phù hợp') return greeting + 'Thầy đã nhận đăng ký ' + code + '. Một mốc sơ bộ hiện chưa phù hợp; Thầy sẽ kiểm tra lại và tư vấn hướng khác nếu có.';
  if (status === 'Đủ điều kiện') return greeting + 'hồ sơ ' + code + ' đã đủ điều kiện sơ bộ. Thầy sẽ gửi danh sách giấy tờ và lịch khám/nhập học phù hợp.';
  if (status === 'Nộp hồ sơ') return greeting + 'Thầy đã ghi nhận hồ sơ ' + code + '. Anh vui lòng giữ điện thoại để nhận xác nhận lịch tiếp theo.';
  if (status === 'Nhập học') return greeting + 'Thầy xác nhận anh đã nhập học. Hệ thống sẽ dừng các nội dung tuyển sinh không còn phù hợp.';
  return greeting + 'Thầy đã nhận đăng ký ' + code + '. Anh vui lòng xác nhận lại năm sinh, chiều cao/cân nặng và thời điểm có thể đi học để Thầy hướng dẫn bước tiếp theo.';
}

function alertRecipients_() {
  const properties = PropertiesService.getScriptProperties();
  const configured = String(properties.getProperty('ALERT_EMAILS') || '').split(',').map(function(value) { return value.trim(); }).filter(Boolean);
  if (configured.length) return configured.join(',');
  return String(Session.getEffectiveUser().getEmail() || '').trim();
}

function headerMap_(sheet) {
  const values = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const map = {};
  values.forEach(function(header, index) { if (header) map[header] = index + 1; });
  return map;
}

function findCode_(sheet, code) {
  if (sheet.getLastRow() < 2) return null;
  const column = headerMap_(sheet)['Mã đăng ký'];
  return sheet.getRange(2, column, sheet.getLastRow() - 1, 1).createTextFinder(code).matchEntireCell(true).findNext();
}

function rowObject_(sheet, row, headers) {
  return objectFromValues_(sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0], headers);
}

function objectFromValues_(values, headers) {
  const result = {};
  Object.keys(headers).forEach(function(header) { result[header] = values[headers[header] - 1]; });
  return result;
}

function alertRecord_(record, reason) {
  return { code: record['Mã đăng ký'], name: record['Họ và tên'], phone: record['Số điện thoại'], status: record['Trạng thái'], reason: reason };
}

function stampIfEmpty_(sheet, row, column, value) {
  if (column && !sheet.getRange(row, column).getValue()) sheet.getRange(row, column).setValue(value);
}

function asDate_(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function columnLetter_(column) {
  let output = '';
  while (column > 0) {
    const modulo = (column - 1) % 26;
    output = String.fromCharCode(65 + modulo) + output;
    column = Math.floor((column - modulo) / 26);
  }
  return output;
}

function clean_(value, maxLength) {
  const text = String(value === undefined || value === null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function html_(value) {
  return String(value === undefined || value === null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
