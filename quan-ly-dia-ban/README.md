# Dashboard địa bàn

Giao diện tổng hợp hồ sơ công nhân, hồ sơ nhập học và các sự kiện học tập theo tỉnh, xã/phường. Mô-đun độc lập; không sửa website tuyển sinh hiện tại.

**Mã nguồn trong thư mục này không chứa dữ liệu thật.** Khi chưa mở tệp, màn hình ghi rõ chưa có dữ liệu, không hiện số 0 gây hiểu nhầm.

## Chạy

Không cần thư viện JavaScript bên ngoài. Cần Node.js để kiểm thử và Python 3 để đóng gói.

```sh
npm test
npm run build
```

Mở `dist/dia-ban.html` bằng trình duyệt, rồi chọn tệp JSON tổng hợp đã kiểm tra. Tệp được đọc bằng File API ngay trên thiết bị, không gửi tới máy chủ. Bản HTML một tệp hoạt động offline.

Có thể chạy giao diện phát triển bằng `npm run serve` tại `http://127.0.0.1:4189/`. Đây là địa chỉ máy chạy lệnh, không phải website đã xuất bản.

## Chức năng

- Lọc tỉnh, xã/phường, nhóm có công nhân/nhập học/xóa tên, hoặc nhóm chưa xác minh.
- Tìm địa bàn không phân biệt dấu, sắp xếp số đếm, phân trang, cửa sổ chi tiết có liên kết hàng tổng hợp nguồn.
- Lối vào nhanh cho các tỉnh được đánh dấu ưu tiên trong bản dữ liệu.
- Tổng hồ sơ công nhân, nhập học, ghi nhận xóa tên, thiếu trạng thái theo đúng bộ lọc hiện hành.
- Tổng hợp theo năm ở cấp tỉnh; ẩn biểu đồ khi bộ lọc xã/nhóm không có bảng theo năm tương ứng.
- Xuất CSV của bộ lọc, có BOM UTF-8 và trung hòa công thức.
- Kiểm tổng từng xã + nhóm chưa ghép = tổng tỉnh, kiểm tổng năm = tổng tỉnh trước khi chấp nhận tệp.

## Giới hạn quan trọng

Đếm **dòng hồ sơ**, không suy thành số người duy nhất. Các trường xóa tên, bảo lưu, tốt nghiệp độc lập, có thể trùng; không suy xóa tên thành bỏ học hoặc tình trạng hiện tại. Hồ sơ chưa xác định xã nằm trong nhóm riêng. Số 0 chỉ nói về phạm vi nguồn.

Ứng dụng không có đăng nhập, API, đồng bộ Google Sheets, quản lý quyền, danh sách cá nhân hoặc ghi ngược nguồn. Không nhập dữ liệu cá nhân vào JSON. Không dùng URL bí mật, JavaScript password hoặc GitHub private repo để giả làm phân quyền website.

## Đóng gói dữ liệu riêng

```sh
python3 build.py --data /duong-dan-noi-bo/tong-hop.json --out /duong-dan-noi-bo/bao-cao.html
```

Lệnh này nhúng toàn bộ số liệu vào HTML. **Không commit/upload HTML này, tệp JSON hoặc CSV lên repo public.** Chỉ gửi cho người được cấp quyền bằng kênh riêng. Bản code public không tự tải dữ liệu.

Mốc số liệu đến từ tệp nhập, không tự đổi ngày. Thay tệp khi có bản đối soát mới.

## Kiểm thử và nghiệm thu

15 kiểm thử mô hình đạt và JavaScript qua kiểm cú pháp. Đối soát dữ liệu thực tế được chạy riêng ngoài source control. Kiểm hình ảnh/trình duyệt chưa hoàn tất do môi trường không khởi chạy Chromium; không coi kết quả unit tests là nghiệm thu giao diện.

Mã ở nhánh làm việc; chưa merge, chưa triển khai. Xem `docs/data-contract.md` trước khi chuẩn bị dữ liệu và `docs/release-checklist.md` trước khi phát hành.
