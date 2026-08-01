# Đầu nhận hồ sơ tuyển dụng

Mục tiêu: nhận đăng ký từ `thaylinhtuyenthomo.vn`, chống trùng theo mã và ghi vào Google Sheets để chăm sóc theo trạng thái.

## Kích hoạt một lần

1. Tạo Google Sheet quản lý ứng viên, sao chép ID trong URL.
2. Mở `script.google.com`, tạo dự án độc lập và dán toàn bộ `Code.gs`.
3. Trong **Project Settings → Script properties**, thêm `SPREADSHEET_ID` với giá trị ở bước 1.
4. Chạy `setupRecruitmentCRM()` một lần và cấp quyền.
5. Chọn **Deploy → New deployment → Web app**; Execute as: tài khoản chủ sở hữu; Who has access: Anyone.
6. Sao chép URL `/exec`, dán vào trường `endpoint` trong `tuyen-tho-mo/recruitment-config.js`.
7. Kiểm thử một hồ sơ; xác nhận sheet có dòng mới rồi mới xuất bản.

Không đặt ID Sheet, email hoặc khóa bí mật trong mã website. Sheet phải giới hạn quyền xem cho người làm tuyển sinh được phân công.
