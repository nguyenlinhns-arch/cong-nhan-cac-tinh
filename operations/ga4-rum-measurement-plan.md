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
| `condition_check_start` | Bắt đầu kiểm tra điều kiện | `context`, `page_group` |
| `condition_check_complete` | Hoàn thành kiểm tra | `result`, `context`, `page_group` |
| `condition_pass` | Đạt điều kiện sơ bộ trên website | `lead_key` khi có, `context`, `page_group` |
| `click_zalo` | Bấm Zalo | `context`, `page_group`, UTM |
| `click_messenger` | Bấm Messenger | `context`, `page_group`, UTM |
| `click_phone` | Bấm gọi điện | `context`, `page_group`, UTM |
| `click_application` | Bấm mở biểu mẫu | `context`, `page_group`, UTM |
| `application_validation_error` | Chặng khiến lần gửi chưa hợp lệ | `step`, `field_group`, `action`, `context` |
| `application_submit` | Một lần bấm gửi hợp lệ | `action`, `eligibility`, `context`, `lead_key` |
| `generate_lead` | Đăng ký đã được tạo | `action`, `eligibility`, `job_id`, `context`, `lead_key` |

## Custom definitions nên đăng ký trong GA4

Event-scoped dimensions:

- `page_group`
- `metric_rating`
- `navigation_type`
- `measurement_version`
- `step`
- `field_group`
- `context`
- `lead_key`
- `channel`
- `source`
- `campaign`

Custom metrics, kiểu Standard:

- `metric_value`
- `metric_delta`

`LCP` và `INP` dùng mili giây; `CLS` không có đơn vị. Khi phân tích phải lọc theo tên event. `metric_id` dùng để lấy lần ghi cuối của mỗi chỉ số trên một lượt trang.

## Quy tắc đọc dữ liệu

- Đánh giá Web Vitals theo p75, tách mobile và desktop.
- So sánh theo `page_group`: `home`, `job`, `province`, `news`, `guide`, `video`, `recruitment_facts`, `utility`.
- Với biểu mẫu, so số người đạt từng `step` theo thứ tự `01_identity` đến `09_consent`; không kết luận từ các mẫu quá nhỏ.
- Chỉ đánh dấu `generate_lead` là key event chính; `application_submit` dùng để chẩn đoán, tránh đếm kép chuyển đổi.

## Phễu đánh giá hiệu quả tuyển sinh

1. Người vào trang: GA4 `session_start`/`page_view`.
2. Bắt đầu và hoàn thành kiểm tra: `condition_check_start` → `condition_check_complete`.
3. Liên hệ hoặc gửi biểu mẫu: `click_zalo`, `click_messenger`, `click_phone`, `click_application`, `generate_lead`.
4. Đủ điều kiện và nhập học: trạng thái CRM `Đủ điều kiện`/`Nộp hồ sơ`/`Nhập học`.
5. Hiệu quả nguồn: trang `Hiệu quả nguồn` trong CRM ghép UTM của hồ sơ với chi phí đã nhập.

Hai KPI điều hành chính:

- `Chi phí / hồ sơ đủ điều kiện = Chi phí quảng cáo / Hồ sơ đủ điều kiện lũy kế`.
- `Chi phí / học sinh nhập học = Chi phí quảng cáo / Học sinh có trạng thái Nhập học`.

Không dùng lượt truy cập hoặc lượt bấm liên hệ để thay thế hai KPI này. Zalo, Messenger và cuộc gọi chỉ được quy tới kết quả nhập học khi nhân viên tạo hồ sơ CRM tương ứng và ghi đúng nguồn/chiến dịch.
