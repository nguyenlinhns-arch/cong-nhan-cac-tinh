# Facebook → MASTER CRM bridge

Mục tiêu: đưa dữ liệu ứng viên từ Messenger và Meta Lead Ads vào `CRM Tuyển dụng tự động - Thầy Linh`, giữ campaign/ad attribution và chống tạo trùng theo số điện thoại.

## Luồng dữ liệu

`Facebook Messenger / Lead Ads → Webhook Apps Script → FACEBOOK_INBOX → kiểm tra đủ 6 trường → chống trùng SĐT → Ứng viên (MASTER CRM)`

Sáu trường cần đủ trước khi tự tạo hồ sơ MASTER:

1. Họ tên Facebook.
2. Số điện thoại.
3. Năm sinh.
4. Chiều cao.
5. Cân nặng.
6. Sức khỏe sơ bộ.

Nếu thiếu, dữ liệu chỉ nằm ở `FACEBOOK_INBOX`; hệ thống không tự kết luận đủ điều kiện và không tạo hồ sơ MASTER. Nếu số điện thoại đã tồn tại, thông tin Facebook được gộp vào hồ sơ cũ thay vì tạo người mới.

## Sheet đã chuẩn bị

- `FACEBOOK_INBOX`: staging riêng cho Messenger/Lead Ads.
- `Ứng viên`: đã có thêm các cột Facebook: năm sinh khai báo, PSID, Lead ID, Ad ID, Ad Set ID, Campaign ID, tên Ad/Ad Set/Campaign, referral, intake mode, FBCLID và placement.

## Kích hoạt Apps Script một lần

Tạo một Apps Script riêng cho bridge Facebook (không thay deployment đang nhận form Website), dán `Code.gs` trong thư mục này và cấu hình Script Properties:

- `SPREADSHEET_ID`: ID MASTER CRM.
- `META_VERIFY_TOKEN`: chuỗi tự đặt để Meta xác minh webhook.
- `META_PAGE_ID`: Page ID của `Thầy Linh – Tuyển Thợ Mỏ`.
- `META_PAGE_ACCESS_TOKEN`: token Page; dùng để đọc tên người nhắn và lấy Lead Ads nếu Page/app có quyền tương ứng.
- `META_ADS_ACCESS_TOKEN`: tùy chọn; token có `ads_read` để đổi Ad ID thành Campaign/Ad Set/Ad.
- `META_GRAPH_VERSION`: tùy chọn; mặc định trong code là `v26.0`, thay khi Meta nâng phiên bản.
- `DEFAULT_OWNER`: tùy chọn; mặc định `Nguyễn Tử Linh`.

Sau đó:

1. Chạy `setupFacebookCRMBridge()` và cấp quyền.
2. Deploy → New deployment → Web app; Execute as chủ sở hữu; URL phải nhận được POST từ Meta.
3. Trong Meta App → Webhooks/Page, dùng URL Web App làm Callback URL và dùng đúng `META_VERIFY_TOKEN`.
4. Subscribe tối thiểu các sự kiện Messenger cần thiết; với Lead Ads cần quyền và subscription `leadgen` phù hợp.
5. Gửi một tin nhắn thử theo CTA: `2000 - cao 1m65 - 60kg - sức khỏe tốt - 0963...`.
6. Xác nhận dòng xuất hiện ở `FACEBOOK_INBOX`. Khi đủ 6/6, trigger 5 phút sẽ tạo/gộp hồ sơ vào `Ứng viên`.

## Chế độ chưa có Meta token

`FACEBOOK_INBOX` vẫn dùng được như bảng nhập nhanh nội bộ. Nhân viên điền các trường ứng viên đã chủ động cung cấp qua Messenger. Sau khi bridge Apps Script được cài, `syncFacebookInbox()` tự gộp sang MASTER CRM mỗi 5 phút. Không cần tạo lại dữ liệu khi sau này bật webhook.

## Quy tắc an toàn dữ liệu

- Không tự nhắn hàng loạt cho ứng viên.
- Không đưa token Meta, ID Sheet hoặc bí mật vào JavaScript công khai của website.
- Không tạo hồ sơ MASTER chỉ vì một lượt click/tin nhắn; chỉ chuyển khi có đủ thông tin sàng lọc quy định.
- Không dùng PSID thay số điện thoại để xác định trùng ứng viên.
- Không tự đánh dấu `Đủ điều kiện` từ năm sinh đơn lẻ; các năm ở ranh giới tuổi và trường hợp sức khỏe cần trao đổi được gắn `needs_review`.
- Chỉ lưu thông tin sức khỏe ở mức sàng lọc cần thiết; kết luận chính thức vẫn theo khám sức khỏe.

## Đo lường

Khi Campaign/Ad ID có dữ liệu, MASTER CRM giữ chúng đến kết quả cuối. KPI cần đọc theo `Facebook Campaign / Facebook Ad`:

`Tin nhắn → đủ 6 trường → hồ sơ MASTER → đủ điều kiện → hoàn thiện hồ sơ → nhập học`.

Không lấy giá tin nhắn làm KPI cuối; KPI cuối là chi phí/ứng viên đủ điều kiện và chi phí/người nhập học.
