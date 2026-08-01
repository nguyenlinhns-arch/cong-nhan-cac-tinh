# Tự động báo Google về tin tuyển dụng

Website có hai trang việc làm đơn lẻ chứa `JobPosting` và biểu mẫu ứng tuyển trực tiếp. Sau mỗi lần GitHub Pages triển khai thành công, workflow phân phối URL sẽ:

1. Gửi các URL tuyển dụng qua IndexNow.
2. Nếu có bí mật xác thực Google, gửi hai URL `JobPosting` đang mở qua Google Indexing API.
3. Gửi lại `sitemap.xml` vào Google Search Console.

## Cấu hình Google một lần

1. Tạo service account trong Google Cloud.
2. Bật **Web Search Indexing API** và **Search Console API**.
3. Trong Search Console, mở property tiền tố URL `https://thaylinhtuyenthomo.vn/` và cấp quyền Owner hoặc Full user cho email của service account.
4. Tạo khóa JSON cho service account.
5. Trong GitHub repository → **Settings → Secrets and variables → Actions**, tạo secret:
   - Tên: `GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON`
   - Giá trị: toàn bộ nội dung khóa JSON (hoặc chuỗi JSON đã mã hóa base64).
6. Chạy thủ công workflow **Distribute recruitment URLs** một lần và kiểm tra cả ba bước thành công.

Không commit khóa JSON vào repository. Indexing API chỉ được dùng cho các URL có dữ liệu `JobPosting`; bài viết và trang tỉnh tiếp tục được Google khám phá qua sitemap và liên kết nội bộ.
