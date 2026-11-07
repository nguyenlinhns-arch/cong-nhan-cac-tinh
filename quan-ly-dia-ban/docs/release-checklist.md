# Trước khi phát hành

- [x] Mã nguồn tách khỏi dữ liệu, không dùng thư viện/font/script bên thứ ba.
- [x] CSP chặn mọi kết nối dữ liệu; không localStorage, analytics hoặc service worker.
- [x] Kiểm tổng và dữ liệu đầu vào; không tự suy trạng thái hiện tại.
- [x] 15 kiểm thử mô hình và kiểm cú pháp JavaScript.
- [ ] Trình duyệt thật: desktop/mobile, bộ lọc, CSV, nhập lỗi, đóng/mở dữ liệu, điều hướng bàn phím và modal Escape.
- [ ] Kiểm hình ảnh tại 320/390/768/1024/1500 px; kiểm tràn ngang và in.
- [ ] Xác minh phạm vi phát hành, người truy cập và cách phân quyền phía máy chủ nếu cần dữ liệu online.
- [ ] Không đưa dữ liệu thật vào repo public, artifact CI hoặc bộ tệp website công khai.
- [ ] Chạy CI của đúng commit, kiểm website thật trước khi thông báo đã triển khai.

Mã trên nhánh/draft PR không đồng nghĩa đã merge hoặc phát hành. Không thay đổi audience của repo/site để hoàn thành triển khai.
