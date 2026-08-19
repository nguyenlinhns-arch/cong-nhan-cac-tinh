# Dashboard TTSX

Dashboard quản lý Thực tập Sản xuất TKV, đọc dữ liệu trực tiếp từ Google Sheets `BC TTSX` qua tab kỹ thuật `_WEB_DATA`.

## Chức năng
- KPI tổng quan: Tổng HS TTSX, đang thực tập, bỏ TTSX, tỷ lệ bỏ, đã tốt nghiệp.
- Bộ lọc: doanh nghiệp, tỉnh, đơn vị tuyển, phân hiệu, tình trạng, công trường và tìm kiếm học sinh.
- Theo dõi từng ngày: số HS có điểm, Ô, N, KLD, chưa nhập và tỷ lệ cập nhật.
- Phân tích theo doanh nghiệp/tỉnh và cảnh báo công trường có từ 3 HS bỏ trở lên.
- Danh sách học sinh có phân trang, xem 42 ngày theo dõi và xuất CSV.
- Responsive cho máy tính, tablet, điện thoại.

## Bảo vệ thông tin
Trang không đưa SĐT, ngày sinh, thôn/xã hoặc ghi chú cá nhân vào feed web. Có `noindex` và `robots.txt` để hạn chế lập chỉ mục công khai.
