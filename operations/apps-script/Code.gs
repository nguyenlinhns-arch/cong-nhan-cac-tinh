const SHEET_NAME = 'Ứng viên';
const HEADERS = [
  'Mã đăng ký', 'Thời gian đăng ký', 'Họ và tên', 'Số điện thoại', 'Ngày sinh', 'Tuổi',
  'Tỉnh/thành', 'Chiều cao (cm)', 'Cân nặng (kg)', 'Trình độ', 'Nghề quan tâm',
  'Sức khỏe sơ bộ', 'Kết quả sơ bộ', 'Nguồn', 'Hình thức', 'Chiến dịch', 'Nội dung',
  'Trang đăng ký', 'Trạng thái', 'Phụ trách', 'Lần liên hệ gần nhất', 'Lịch hẹn tiếp theo', 'Ghi chú'
];

function setupRecruitmentCRM() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Thiếu Script Property SPREADSHEET_ID');
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#0b4f46').setFontColor('#ffffff');
  sheet.getRange('B:B').setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange('E:E').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('U:V').setNumberFormat('dd/mm/yyyy hh:mm');
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Mới', 'Đã gọi', 'Quan tâm', 'Hẹn khám', 'Đủ điều kiện', 'Nộp hồ sơ', 'Nhập học', 'Không phù hợp', 'Không liên lạc được'], true)
    .setAllowInvalid(false).build();
  sheet.getRange(2, 19, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(statusRule);
  return { ok: true, spreadsheet: spreadsheet.getUrl(), sheet: SHEET_NAME };
}

function doGet() {
  return json_({ ok: true, service: 'Thầy Linh recruitment intake', version: 1 });
}

function doPost(event) {
  try {
    const data = JSON.parse(event?.postData?.contents || '{}');
    validate_(data);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      const existing = findCode_(sheet, data.code);
      if (existing) return json_({ ok: true, code: data.code, duplicate: true });
      sheet.appendRow(toRow_(data));
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true, code: data.code, duplicate: false });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error.message || error).slice(0, 160) });
  }
}

function getSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('CRM chưa được cấu hình');
  const sheet = SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Chưa chạy setupRecruitmentCRM');
  return sheet;
}

function validate_(data) {
  if (Number(data.schema_version) !== 1) throw new Error('Phiên bản dữ liệu không hợp lệ');
  if (!/^TL-\d{6}-[A-Z0-9]{5}$/.test(String(data.code || ''))) throw new Error('Mã đăng ký không hợp lệ');
  if (!/^0[35789]\d{8}$/.test(String(data.phone || ''))) throw new Error('Số điện thoại không hợp lệ');
  if (!data.consent) throw new Error('Chưa có sự đồng ý');
  if (String(data.full_name || '').trim().length < 2) throw new Error('Họ tên không hợp lệ');
  if (Number(data.height_cm) < 130 || Number(data.height_cm) > 220) throw new Error('Chiều cao không hợp lệ');
  if (Number(data.weight_kg) < 30 || Number(data.weight_kg) > 200) throw new Error('Cân nặng không hợp lệ');
  if (!['eligible', 'needs_review', 'not_eligible'].includes(data.eligibility)) throw new Error('Kết quả không hợp lệ');
}

function clean_(value, maxLength) {
  const text = String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function findCode_(sheet, code) {
  if (sheet.getLastRow() < 2) return null;
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(code).matchEntireCell(true).findNext();
}

function toRow_(data) {
  const status = data.eligibility === 'not_eligible' ? 'Không phù hợp' : 'Mới';
  return [
    clean_(data.code, 24), new Date(data.created_at), clean_(data.full_name, 80), clean_(data.phone, 12),
    clean_(data.birth_date, 10), Number(data.age) || '', clean_(data.province, 40), Number(data.height_cm),
    Number(data.weight_kg), clean_(data.education, 60), clean_(data.trade, 80), clean_(data.health_screen, 80),
    clean_(data.eligibility, 24), clean_(data.source, 80), clean_(data.medium, 80), clean_(data.campaign, 100),
    clean_(data.content, 100), clean_(data.page_url, 500), status, '', '', '', ''
  ];
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
