# CRM tuyển dụng và hiệu quả nguồn v3

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
- Tạo trang `Chi phí quảng cáo` để nhập chi phí theo nguồn và chiến dịch.
- Tạo trang `Hiệu quả nguồn` với số hồ sơ, hồ sơ đủ điều kiện, học sinh nhập học, chi phí trên một hồ sơ đủ điều kiện và chi phí trên một học sinh nhập học.
- Giữ nguyên các cột và dữ liệu cũ; cột đo lường/chiến dịch nội bộ chỉ được nối thêm ở cuối.

Hệ thống không tự nhắn hàng loạt cho ứng viên. Tin nhắn gợi ý cần được người phụ trách duyệt và gửi qua kênh phù hợp.

## Nâng cấp CRM đang chạy

1. Mở đúng dự án Apps Script đang phục vụ URL `/exec` trong `tuyen-tho-mo/recruitment-config.js`.
2. Thay nội dung `Code.gs` bằng phiên bản trong thư mục này.
3. Trong **Project Settings → Script properties**, giữ `SPREADSHEET_ID` hiện có và có thể thêm:
   - `ALERT_EMAILS`: một hoặc nhiều email nhận cảnh báo, phân tách bằng dấu phẩy. Nếu bỏ trống, hệ thống dùng email tài khoản chạy script.
   - `DEFAULT_OWNER`: tên người mặc định phụ trách hồ sơ mới. Nếu bỏ trống, dùng `Nguyễn Tử Linh`.
4. Chạy `upgradeRecruitmentCRMV3()` một lần và cấp quyền cho Sheets, trigger và gửi email.
5. Chọn **Deploy → Manage deployments → Edit**, tạo phiên bản mới nhưng giữ nguyên deployment/web app URL.
6. Gửi một hồ sơ kiểm thử; xác nhận:
   - dòng mới có `Hạn phản hồi`;
   - trang `Tổng quan` đã xuất hiện;
   - email báo hồ sơ mới đến đúng người;
   - cột `Phiên bản dữ liệu` có giá trị `2` để vẫn tương thích với đầu nhận cũ;
   - các cột khóa đo lường và chiến dịch nội bộ có dữ liệu sau khi dùng bản CRM v3;
   - hai trang `Chi phí quảng cáo` và `Hiệu quả nguồn` đã xuất hiện.

## Cách tính hai KPI chính

Nhập chi phí từng ngày vào trang `Chi phí quảng cáo`; tên `Nguồn` và `Chiến dịch` phải khớp UTM đã dùng. Trang `Hiệu quả nguồn` tự tính:

- **Chi phí / hồ sơ đủ điều kiện** = tổng chi phí nguồn, chiến dịch / số hồ sơ có trạng thái `Đủ điều kiện`, `Nộp hồ sơ` hoặc `Nhập học`.
- **Chi phí / học sinh nhập học** = tổng chi phí nguồn, chiến dịch / số hồ sơ có trạng thái `Nhập học`.

Kết quả chỉ chính xác khi người phụ trách cập nhật trạng thái CRM và nhập đủ chi phí quảng cáo. Hồ sơ gửi biểu mẫu được nối chính xác bằng `Mã đăng ký`; người chỉ nhắn Zalo, Messenger hoặc gọi điện cần được nhân viên tạo hồ sơ CRM và ghi đúng nguồn/chiến dịch, nếu không hệ thống chỉ biết lượt bấm chứ không thể khẳng định người đó đã nhập học.

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
