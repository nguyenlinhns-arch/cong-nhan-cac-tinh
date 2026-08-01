# GA4: đo hiệu năng thật và phễu ứng tuyển

## Phạm vi

- Property: `G-PZRRY10JNN`.
- Chỉ gửi dữ liệu sau khi người dùng chọn **Đồng ý đo lường**.
- Không gửi họ tên, số điện thoại, ngày sinh, chiều cao, cân nặng, trình độ hoặc lựa chọn sức khỏe đã nhập.
- Meta Pixel không nhận các event Web Vitals hoặc tiến độ từng trường.

## Event

| Event | Mục đích | Tham số chính |
| --- | --- | --- |
| `LCP` | Tốc độ hiển thị nội dung lớn nhất | `metric_id`, `metric_value`, `metric_delta`, `metric_rating`, `page_group` |
| `INP` | Độ trễ tương tác | `metric_id`, `metric_value`, `metric_delta`, `metric_rating`, `page_group` |
| `CLS` | Mức xê dịch bố cục | `metric_id`, `metric_value`, `metric_delta`, `metric_rating`, `page_group` |
| `application_progress` | Chặng biểu mẫu đã được mở | `step`, `field_group`, `context`, `page_group` |
| `application_validation_error` | Chặng khiến lần gửi chưa hợp lệ | `step`, `field_group`, `action`, `context` |
| `application_submit` | Một lần bấm gửi hợp lệ | `action`, `eligibility`, `context` |
| `generate_lead` | Đăng ký đã được tạo | `action`, `eligibility`, `job_id`, `context` |

## Custom definitions nên đăng ký trong GA4

Event-scoped dimensions:

- `page_group`
- `metric_rating`
- `navigation_type`
- `measurement_version`
- `step`
- `field_group`
- `context`

Custom metrics, kiểu Standard:

- `metric_value`
- `metric_delta`

`LCP` và `INP` dùng mili giây; `CLS` không có đơn vị. Khi phân tích phải lọc theo tên event. `metric_id` dùng để lấy lần ghi cuối của mỗi chỉ số trên một lượt trang.

## Quy tắc đọc dữ liệu

- Đánh giá Web Vitals theo p75, tách mobile và desktop.
- So sánh theo `page_group`: `home`, `job`, `province`, `news`, `guide`, `video`, `recruitment_facts`, `utility`.
- Với biểu mẫu, so số người đạt từng `step` theo thứ tự `01_identity` đến `09_consent`; không kết luận từ các mẫu quá nhỏ.
- Chỉ đánh dấu `generate_lead` là key event chính; `application_submit` dùng để chẩn đoán, tránh đếm kép chuyển đổi.
