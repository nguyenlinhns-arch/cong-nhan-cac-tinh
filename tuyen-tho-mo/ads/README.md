# Search Ads readiness – Tuyển thợ mỏ

## Landing page chính

`https://thaylinhtuyenthomo.vn/tuyen-tho-mo-quang-ninh/`

Landing page dành cho lưu lượng Search có ý định cao. Trang không khai `JobPosting` vì đây là trang tổng hợp; ba trang nghề riêng tiếp tục giữ structured data tuyển dụng.

## Cấu trúc chiến dịch đề xuất

Bắt đầu bằng các nhóm ý định trong `search-campaign-map.json`: Tuyển thợ mỏ, Tuyển thợ lò, Việc làm ngành Than, Học nghề mỏ và Không cần kinh nghiệm. Mỗi nhóm quảng cáo nên dùng headline/description bám sát đúng cụm ý định, nhưng cùng dẫn về landing page chính khi thông tin và CTA tương đồng.

Ưu tiên nhắm theo truy vấn và địa lý chiến dịch. Không đưa điều kiện cá nhân nhạy cảm vào URL hoặc tham số tracking.

## Attribution đã chuẩn bị

`/ads-attribution.js` giữ các tham số không phải PII: `gclid`, `gbraid`, `wbraid`, `gad_source`, `gad_campaignid` và UTM. Chúng được lưu tối đa 90 ngày và chuyển tiếp qua các liên kết nội bộ có `data-preserve-attribution`.

Các event dataLayer sẵn sàng cho GTM/Google tag:

- `ads_landing_view`
- `eligibility_click`
- `messenger_click`
- `phone_click`
- `payroll_proof_click`
- `job_detail_click`
- `proof_media_click`
- `locality_click`

Không gửi họ tên, số điện thoại, năm sinh hoặc hồ sơ vào dataLayer.

## Conversion hierarchy khi mở quảng cáo

**Primary:** lead đủ điều kiện / liên hệ thành công / nhập học, khi CRM hoặc Data Manager đã kết nối và có thể gửi conversion chất lượng trở lại Google Ads.

**Secondary:** click kiểm tra điều kiện, Messenger, gọi điện. Các sự kiện này dùng để chẩn đoán funnel; không nên tối ưu ngân sách dài hạn chỉ dựa trên click CTA nếu chưa biết lead có đạt điều kiện hay không.

## Việc cần nhập từ tài khoản Google Ads khi triển khai

Không hard-code ID chưa xác minh trong repository. Khi tài khoản quảng cáo sẵn sàng, cấu hình qua Google tag/GTM hoặc hệ thống tag hiện có:

1. Google Ads account/tag ID (`AW-...`).
2. Conversion action ID/label cho các conversion chính.
3. Consent settings phù hợp với cấu hình website.
4. Auto-tagging để nhận `gclid` và các click identifiers tương ứng.
5. Nếu dùng enhanced conversions for leads, kết nối nguồn first-party/CRM qua phương thức Google hỗ trợ tại thời điểm triển khai.

## URL tracking

Giữ auto-tagging của Google Ads. Nếu cần UTM cho hệ thống báo cáo nội bộ, dùng campaign/ad group/keyword identifiers; không thêm họ tên, số điện thoại hoặc thông tin hồ sơ vào Final URL suffix.

## Quality gate

Chạy:

`node tuyen-tho-mo/scripts/audit-ads-readiness.mjs`

CI `.github/workflows/ads-readiness.yml` sẽ chặn thay đổi làm mất canonical, cụm nội dung theo search intent, attribution, CTA đo lường, privacy link hoặc vô tình đưa PII vào GET URL.
