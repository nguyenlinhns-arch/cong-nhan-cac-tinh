# Google Ads & AI Search intent routing

Cập nhật: 09/08/2026.

Google Ads dùng một landing page tuyển dụng chuẩn:

- `/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/`

Khối trả lời nhanh cho paid search tự điều chỉnh theo `utm_term`, `utm_content` và `utm_campaign`:

- `job`: tuyển thợ mỏ/thợ lò/việc làm mỏ Quảng Ninh.
- `training`: học nghề mỏ, miễn học phí, ăn ở, hỗ trợ học nghề.
- `income`: lương thợ lò 20–25 triệu, thu nhập và bảng lương.

Các nhóm vẫn dùng cùng biểu mẫu CRM và cùng canonical URL, tránh tạo nội dung gần trùng lặp. Các trang chuyên sâu hiện có được dùng làm bằng chứng/hỗ trợ theo intent: học nghề, hồ sơ, thu nhập, bảng lương và thông tin tuyển đang áp dụng.

`ad-landing-pages.json` cung cấp bản đồ intent máy đọc được. `analytics.js` tiếp tục giữ Google Ads/Search/AI attribution và `google-search-intent.js` ghi thêm `ad_intent` vào sự kiện paid-search.
