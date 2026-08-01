# CRM tuyển dụng tự động v2

Đầu nhận này ghi hồ sơ từ `thaylinhtuyenthomo.vn` vào Google Sheets, chống trùng theo mã đăng ký và tự tạo nhịp chăm sóc đến khi nhập học.

## Tự động hóa đã có

- Tạo hạn phản hồi trong 2 giờ cho hồ sơ mới.
- Gửi email báo ngay khi có đăng ký hợp lệ.
- Kiểm tra mỗi 15 phút, cảnh báo hồ sơ chưa được xử lý sau 2 giờ và 24 giờ.
- Gửi bản tổng hợp CRM hằng ngày lúc 7 giờ.
- Đóng dấu ngày khi hồ sơ chuyển sang `Đủ điều kiện`, `Nộp hồ sơ` hoặc `Nhập học`.
- Dừng cảnh báo khi hồ sơ đã `Nhập học` hoặc `Không phù hợp`.
- Tạo trang `Tổng quan` với số hồ sơ mới, quá hạn và tỷ lệ tiến triển theo nguồn/trạng thái.
- Tạo sẵn tin nhắn gợi ý theo trạng thái để người phụ trách kiểm tra trước khi gửi.
- Giữ nguyên 23 cột và dữ liệu của CRM v1; các cột v2 chỉ được nối thêm ở cuối.

Hệ thống không tự nhắn hàng loạt cho ứng viên. Tin nhắn gợi ý cần được người phụ trách duyệt và gửi qua kênh phù hợp.

## Nâng cấp CRM đang chạy

1. Mở đúng dự án Apps Script đang phục vụ URL `/exec` trong `tuyen-tho-mo/recruitment-config.js`.
2. Thay nội dung `Code.gs` bằng phiên bản trong thư mục này.
3. Trong **Project Settings → Script properties**, giữ `SPREADSHEET_ID` hiện có và có thể thêm:
   - `ALERT_EMAILS`: một hoặc nhiều email nhận cảnh báo, phân tách bằng dấu phẩy. Nếu bỏ trống, hệ thống dùng email tài khoản chạy script.
   - `DEFAULT_OWNER`: tên người mặc định phụ trách hồ sơ mới. Nếu bỏ trống, dùng `Nguyễn Tử Linh`.
4. Chạy `upgradeRecruitmentCRMV2()` một lần và cấp quyền cho Sheets, trigger và gửi email.
5. Chọn **Deploy → Manage deployments → Edit**, tạo phiên bản mới nhưng giữ nguyên deployment/web app URL.
6. Gửi một hồ sơ kiểm thử; xác nhận:
   - dòng mới có `Hạn phản hồi`;
   - trang `Tổng quan` đã xuất hiện;
   - email báo hồ sơ mới đến đúng người;
   - cột `Phiên bản dữ liệu` có giá trị `2`.

## Cài mới

1. Tạo Google Sheet quản lý ứng viên và sao chép ID trong URL.
2. Tạo dự án tại `script.google.com`, dán toàn bộ `Code.gs`.
3. Thêm Script Property `SPREADSHEET_ID`.
4. Chạy `setupRecruitmentCRM()` một lần và cấp quyền.
5. Chọn **Deploy → New deployment → Web app**:
   - Execute as: tài khoản chủ sở hữu.
   - Who has access: Anyone.
6. Sao chép URL `/exec` vào `endpoint` trong `tuyen-tho-mo/recruitment-config.js`.
7. Kiểm thử trước khi xuất bản.

Không đưa ID Sheet, email riêng hoặc khóa bí mật vào mã website. Sheet chỉ nên chia sẻ cho người trực tiếp làm tuyển sinh.
