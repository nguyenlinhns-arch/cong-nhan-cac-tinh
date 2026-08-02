# Báo cáo hành trình lao động V3

Ngày áp dụng: 02/08/2026

## Mục tiêu

Không đánh giá website hoặc quảng cáo bằng lượt xem và giá inbox riêng lẻ. Mỗi ngày phải nhìn theo chuỗi:

`Video/trang vào → nội dung đã xem → kiểm tra điều kiện → Zalo/gọi/form → đủ 3 thông tin → đủ điều kiện sơ bộ → hồ sơ → nhập học`.

## Năm dòng báo cáo hằng ngày

1. Hôm nay có bao nhiêu lượt `click_zalo`, `click_call` và `form_submit`?
2. Bao nhiêu người đã gửi đủ năm sinh, chiều cao/cân nặng và tình trạng sức khỏe?
3. Bao nhiêu người đạt `condition_pass` hoặc được xác nhận đủ điều kiện sơ bộ trong CRM?
4. `utm_campaign`, `utm_content` và trang vào nào sinh nhiều ứng viên đủ điều kiện nhất?
5. Trang, video hoặc tin nhắn nào cần sửa ngay vì có lượt xem nhưng ít hành động chất lượng?

## Chỉ số dùng để quyết định

| Chỉ số | Công thức |
|---|---|
| Tỷ lệ hành động nóng | `(click_zalo + click_call + form_submit) / ViewContent` |
| Tỷ lệ đủ 3 thông tin | `three_info_complete / số lead` |
| Tỷ lệ đủ điều kiện | `condition_pass / số lead` |
| Tỷ lệ hồ sơ | `Nộp hồ sơ / condition_pass` |
| Tỷ lệ nhập học | `Nhập học / Nộp hồ sơ` |

## Chấm điểm hành trình ẩn danh trên website

- Vào một trang: +2.
- Xem thêm một nhóm nội dung quan trọng: +2.
- Bấm Zalo: +3.
- Bấm gọi: +4.
- Mở biểu mẫu: +4.
- Bắt đầu điền form: +5.
- Điền đủ nhóm năm sinh – cao/nặng – sức khỏe: +5.
- Đủ điều kiện sơ bộ: +10.
- Gửi biểu mẫu: +10.

Phân loại:

- 0–3: mới quan tâm.
- 4–8: đang tìm hiểu.
- 9–17: ứng viên nóng.
- 18 trở lên: ưu tiên chăm sóc.

Điểm này chỉ dùng để sắp xếp hành trình và đánh giá nguồn. Không dùng để tự động loại ứng viên và không thay thế kiểm tra điều kiện thực tế.

## Quy tắc tối ưu sau 48–72 giờ

- Giữ video/trang tạo ra người gửi đủ 3 thông tin và đủ điều kiện.
- Không giữ một nội dung chỉ vì giá click hoặc inbox thấp.
- Trang có nhiều `ViewContent` nhưng ít Zalo/gọi/form phải sửa màn hình đầu, CTA hoặc nội dung trả lời đúng ý định.
- Trang có nhiều `form_start` nhưng ít `form_submit` phải kiểm tra độ dài form, lỗi trường nhập và thông báo sau gửi.
- Không gộp tất cả quảng cáo về trang chủ; dùng đúng trang đích trong `operations/utm-campaign-map-2026.json`.
