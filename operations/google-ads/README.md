# Google Ads launch pack – thaylinhtuyenthomo.vn

Bộ này là cấu hình vận hành chuẩn để triển khai Search Ads khi tài khoản Google Ads được kết nối.

## Cấu trúc mở chiến dịch

- `S01_ViecLam_ThoMo`: 50% ngân sách thử nghiệm.
- `S02_HocNghe_MienPhi`: 30% ngân sách thử nghiệm.
- `S03_ThuNhap_ThoLo`: 20% ngân sách thử nghiệm.
- Khởi đầu Exact + Phrase; chưa mở Broad hàng loạt.
- Location option: Presence, tập trung tỉnh nguồn tuyển sinh.

## Landing chuẩn

`https://thaylinhtuyenthomo.vn/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/`

Website tự đổi fast-answer theo intent từ `utm_term`, `utm_content`, `utm_campaign` và giữ click attribution phục vụ CRM.

## SEO ↔ Paid Search

`tuyen-tho-mo/search-intent-strategy.json` là bản đồ canonical giữa truy vấn, trang SEO và paid-search intent. Quy tắc là:

- truy vấn có ý định hành động cao như “học thợ lò liên hệ ai”, “học nghề mỏ miễn phí”, “học thợ lò ở đâu”, “lương thợ lò bao nhiêu” được thử bằng Exact/Phrase;
- truy vấn giải thích như “thợ mỏ là nghề gì”, “thợ lò có nguy hiểm không”, “làm mấy tiếng” được SEO phục vụ trước;
- không mua traffic thông tin chỉ để tăng lượt truy cập; chỉ mở khi CRM chứng minh có qualified lead;
- bài SEO là lớp giải thích/bằng chứng, còn landing tuyển dụng canonical là trang chuyển đổi chính.

Chi tiết tại `informational-query-policy.md`.

## Final URL Suffix

```text
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}_{creative}&utm_term={keyword}&campaignid={campaignid}&adgroupid={adgroupid}&creative={creative}&matchtype={matchtype}&device={device}&network={network}
```

Không thêm `?` ở đầu Final URL Suffix. Google Ads tự nối tham số vào Final URL.

## Conversion hierarchy

1. Secondary: click phone/Zalo/Messenger, mở form, bắt đầu form, hoàn tất kiểm tra điều kiện.
2. Primary ban đầu: hồ sơ đã được CRM xác nhận lưu thành công.
3. Primary khi đủ volume: Qualified lead.
4. Mục tiêu giá trị cao nhất: Enrollment / nhập học.

Không dùng click Zalo hoặc form start làm mục tiêu Smart Bidding chính.

## RSA

`rsa-assets.csv` đã giữ headline ≤30 ký tự và description ≤90 ký tự theo giới hạn RSA hiện hành. Mục tiêu là 8–15 headline và tối đa 4 description, tránh pin mặc định để Google có đủ tổ hợp thử nghiệm.

## Asset

`assets.json` chứa 6 sitelink và callout. Dùng sitelink tới kiểm tra điều kiện, học nghề, quyền lợi, bảng lương, hồ sơ và thông tin tuyển hiện hành để tăng độ liên quan mà không tạo landing trùng lặp.

## Negative keywords

`negative-keywords.txt` là seed ban đầu. Negative keywords phải tiếp tục được bổ sung từ Search Terms thực tế vì negative matching không tự bao phủ mọi biến thể cùng nghĩa.

Không dùng negative broad cho toàn bộ các câu hỏi “nguy hiểm / nghề gì / bảo hiểm / ca làm”. Đây là nội dung hợp lệ của nghề mỏ; nếu cần loại chi phí thì loại bằng Exact/Phrase tại campaign sau khi có dữ liệu Search Terms.

## Vận hành 14 ngày đầu

- Xem Search Terms hằng ngày, thêm negative khi query sai nhu cầu.
- Không đánh giá chiến dịch chỉ bằng CTR hoặc CPC.
- KPI quyết định: chi phí / hồ sơ đủ điều kiện; khi đủ dữ liệu chuyển sang chi phí / người nhập học.
- Không thay đổi ngân sách/bidding quá nhiều cùng lúc trong giai đoạn học.
- Khi Exact/Phrase đã có tín hiệu Qualified lead ổn định, mới thử Broad trên nhóm từ khóa thắng và so sánh theo CPQL/Enrollment.
- Mọi keyword mới phải được gắn vào một cluster trong `search-intent-strategy.json` để tránh hai campaign cùng tranh một ý định.

## CRM Google Sheet

File `CRM Tuyển dụng tự động - Thầy Linh` đã có các tab:

- `Google Ads - Campaign`
- `Google Ads - Keywords`
- `Google Ads - RSA`
- `Google Ads - Negative`

Và sheet `Ứng viên` đã có các trường GCLID/GBRAID/WBRAID, keyword, campaign/ad group/creative, match type, device, network, SĐT E.164 và các mốc lead chất lượng.
