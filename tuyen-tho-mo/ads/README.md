# Search Ads readiness – Tuyển thợ mỏ

## Landing page chính

`https://thaylinhtuyenthomo.vn/tuyen-tho-mo-quang-ninh/`

Landing page dành cho lưu lượng Search có ý định cao. Trang không khai `JobPosting` vì đây là trang tổng hợp; ba trang nghề riêng tiếp tục giữ structured data tuyển dụng.

## Cấu trúc chiến dịch

Dùng các nhóm ý định trong `search-campaign-map.json`: Tuyển thợ mỏ, Tuyển thợ lò, Việc làm ngành Than, Học nghề mỏ và Không cần kinh nghiệm. Headline/description của từng ad group phải bám sát chính cụm ý định và phần nội dung tương ứng trên landing page.

Ưu tiên nhắm theo truy vấn và địa lý chiến dịch. Không đưa điều kiện cá nhân nhạy cảm vào URL hoặc tham số tracking.

## Message match theo ad group

Mỗi ad group đặt custom parameter Google Ads `_intent` theo `search-campaign-map.json`:

- Tuyển thợ mỏ → `tho_mo`
- Tuyển thợ lò → `tho_lo`
- Việc làm ngành Than → `nganh_than`
- Học nghề mỏ → `hoc_nghe`
- Không cần kinh nghiệm → `khong_kinh_nghiem`

Final URL suffix chuyển giá trị này thành `tl_intent={_intent}`. `/ads-attribution.js` chỉ chấp nhận 5 giá trị đã whitelist và đổi **hero title/kicker/lead** cho đúng ý định của ad group. Nội dung cốt lõi, canonical, structured data và URL SEO vẫn giữ nguyên; không tạo thêm hàng loạt landing page gần giống nhau.

Cách này giúp chuỗi **keyword → ad copy → landing hero** khớp hơn mà không nhân bản nội dung/URL.

## Auto-tagging + ValueTrack

Bật Google Ads auto-tagging. `gclid`, `gbraid`, `wbraid` là các định danh click cần được giữ xuyên funnel để đo lường chính xác. Nếu cần báo cáo nội bộ, `search-campaign-map.json` đã có Final URL suffix mẫu dùng các ValueTrack field không phải PII như campaign ID, ad group ID, creative, keyword, match type, device và network.

Không tắt auto-tagging để thay bằng UTM thủ công. UTM chỉ là lớp bổ sung cho báo cáo nội bộ.

## Attribution và consent

`/ads-attribution.js` giữ các tham số không phải PII trong URL khi người dùng đi từ landing sang các bước nội bộ.

Quy tắc:

- Trước khi người dùng đồng ý đo lường: click identifiers chỉ được giữ trong URL/bộ nhớ của trang để chuyển tiếp funnel, **không ghi vào localStorage**.
- Sau khi measurement consent ở trạng thái `granted`: attribution mới được lưu cục bộ tối đa 90 ngày.
- Không lưu họ tên, số điện thoại, năm sinh, CCCD hoặc thông tin sức khỏe vào attribution storage hay dataLayer.

Các event dataLayer sẵn sàng để bind với Google tag/GTM:

- `ads_landing_view`
- `eligibility_click`
- `messenger_click`
- `phone_click`
- `payroll_proof_click`
- `job_detail_click`
- `proof_media_click`
- `locality_click`

Mỗi event trên landing có thêm `landing_intent` để đối chiếu hiệu quả của 5 nhóm search intent mà không cần đưa PII vào analytics.

## Conversion hierarchy

**Conversion chính khi đã nối CRM/Data Manager:** `qualified_lead`, `enrolled_student`, `started_employment`.

**Conversion phụ/chẩn đoán funnel:** click kiểm tra điều kiện, Messenger, gọi điện và click xem tin nghề. Không tối ưu ngân sách dài hạn chỉ dựa trên page view hoặc click bằng chứng nếu chưa biết lead có đạt điều kiện hay không.

## Enhanced conversions for leads / Data Manager

Từ năm 2026, chuẩn bị theo hướng Google Ads Data Manager cho dữ liệu lead chất lượng/offline. File `offline-conversion-schema.json` mô tả data contract; file này **không chứa dữ liệu ứng viên thật**.

Khi kết nối CRM thực tế, luồng nên là:

1. Website tạo lead và giữ `lead_key` ổn định.
2. CRM xác nhận các mốc thật: lead đủ điều kiện → nhập học → đi làm.
3. Lớp export kiểm tra consent/legal basis, chuẩn hóa dữ liệu first-party và hash theo yêu cầu của Google khi áp dụng.
4. Data Manager gửi conversion chất lượng về Google Ads để Smart Bidding học theo lead thật, không học theo click CTA.

Không commit phone/email/hash/GCLID của ứng viên hoặc file upload conversion vào repository công khai.

## Việc cần nhập từ tài khoản Google Ads khi triển khai

Không hard-code ID chưa xác minh trong repository. Khi tài khoản quảng cáo sẵn sàng, cấu hình qua Google tag/GTM hoặc hệ thống tag hiện có:

1. Google Ads account/tag ID (`AW-...`).
2. Conversion action ID/label cho các conversion chính.
3. Consent settings phù hợp với cấu hình website.
4. Auto-tagging.
5. Custom parameter `_intent` cho từng ad group.
6. Kết nối Google Ads Data Manager/CRM cho conversion chất lượng.

## Quality gate

Chạy:

`node tuyen-tho-mo/scripts/audit-ads-readiness.mjs`

CI `.github/workflows/ads-readiness.yml` chặn thay đổi làm mất canonical, search-intent content, attribution, CTA đo lường, privacy link, consent-safe persistence, message match hoặc vô tình đưa PII vào GET URL.
