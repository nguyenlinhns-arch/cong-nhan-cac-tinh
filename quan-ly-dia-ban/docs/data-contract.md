# Hợp đồng dữ liệu tổng hợp v1

Tệp JSON có `schemaVersion: 1` và `countUnit: "source-records"`.

- `label`, `dataAsOf`, `workerAsOf`: nhãn và mốc nguồn, không phải ngày sinh bản dựng.
- `provinces`: danh sách tỉnh với `id`, `name`, `priority`, `sourceUrl` (tùy chọn). Liên kết chỉ chấp nhận Google Sheets HTTPS đúng host.
- `rows`: mỗi xã/phường một dòng, có `id`, `provinceId`, `name`, `unmapped` và `sourceRow` tùy chọn. Mỗi tỉnh có đúng một dòng `unmapped: true`, kể cả số đếm bằng 0.
- Cả tỉnh và từng dòng có sáu số nguyên không âm: `workers`, `students`, `removed`, `leave`, `graduated`, `missingStatus`. Không đổi null/ô trống thành 0.
- `yearly`: từng tỉnh/năm có `provinceId`, `year` và năm chỉ số học sinh bên trên. Không chứa công nhân vì khác mốc dữ liệu.
- `unassignedProvinceWorkers`: số hồ sơ công nhân chưa xác định tỉnh, nằm ngoài tổng các tỉnh.

Ứng dụng bắt buộc tổng từng chỉ số của các dòng (bao gồm nhóm chưa ghép) khớp tỉnh và tổng các năm khớp các chỉ số học sinh của tỉnh. Chặn trùng ID, trùng tỉnh/năm, sự kiện vượt số hồ sơ và URL nguồn sai.

Chỉ các trường trong danh sách cho phép được giữ lại trong bộ nhớ ứng dụng. Tuy vậy không nên tạo tệp có trường cá nhân rồi dựa vào giao diện để giấu; nội dung tệp gốc vẫn có thể đọc được.

Không chứa họ tên, ngày sinh, số điện thoại, giấy tờ, địa chỉ chi tiết, tài khoản, khóa dịch vụ, dòng hồ sơ cá nhân. Các ô đếm nhỏ cũng chỉ dùng nội bộ; cần xét nguy cơ suy ngược và quyền chia sẻ trước khi công khai một bản tổng hợp.
