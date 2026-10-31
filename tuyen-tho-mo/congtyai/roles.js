export const roles = [
  {
    "name": "Đào",
    "title": "CEO điều phối",
    "group": "Điều hành",
    "task": "Tiếp nhận mục tiêu từ chủ sở hữu; quyết định ưu tiên và chốt chất lượng sau kiểm định.",
    "standard": "Mọi lệnh từ Đào xuống và báo cáo lên Đào đều qua Quyên. Việc vượt quyền phải trình chủ sở hữu."
  },
  {
    "name": "Quyên",
    "title": "Phó Tổng Giám đốc · Kiểm soát quy trình",
    "group": "Điều hành",
    "task": "Kiểm thứ tự, chủ việc, đầu vào, quyền và bằng chứng khi giao nhận với CEO.",
    "standard": "Giữ bước sai (HOLD), nêu lý do và báo Đào. Không thay quyết định CEO, không thực thi hay hạ chuẩn."
  },
  {
    "name": "Khôi",
    "title": "Phó Tổng Giám đốc · Sửa chữa / nâng cấp",
    "group": "Điều hành",
    "task": "Phân loại lỗi đầu vào, nội dung, ứng dụng hoặc môi trường chạy; dùng GPT phân tích và lập kế hoạch. Phối hợp Kiên để chuyển đúng công đoạn ứng dụng hoặc đơn vị code bên ngoài Codex / Antigravity được phép; không mặc định chuyển lỗi nội dung hoặc video sang sửa code.",
    "standard": "Ngang cấp Quyên dưới CEO; mọi giao nhận với Đào qua Quyên. Các đơn vị code bên ngoài chưa kết nối. Một đầu mối ghi sửa, có bản thử nghiệm, kiểm thử, nguồn gốc thay đổi và phương án phục hồi; giữ phần đã đạt. Khuê kiểm định độc lập → Quyên → Đào chốt; không tự nghiệm thu, cấp quyền hoặc hạ chuẩn."
  },
  {
    "name": "Kiên",
    "title": "Giám đốc điều khiển PC",
    "group": "Giám đốc",
    "task": "Kiểm tài nguyên cùng Sơn Hà; phân việc đúng phòng, đúng công đoạn và điều phối thao tác.",
    "standard": "Chỉ một chủ điều khiển giao diện; tối đa một tác vụ PC nặng. Cần lệnh và biên nhận trong phạm vi được duyệt."
  },
  {
    "name": "Sơn Hà",
    "title": "Giám đốc hạ tầng",
    "group": "Giám đốc",
    "task": "Kiểm dung lượng, phụ thuộc, tính toàn vẹn đầu vào và khả năng phục hồi trước khi chạy.",
    "standard": "Không tự xóa không thể phục hồi, đổi quyền hoặc mở rộng phạm vi. Báo cáo đến Đào qua Quyên."
  },
  {
    "name": "Tuệ",
    "title": "Giám đốc giám sát tiến độ",
    "group": "Giám đốc",
    "task": "Theo dõi hạn, phụ thuộc và điểm nghẽn; phân tích ảnh hưởng chất lượng, tài nguyên và phụ thuộc sửa chữa để đề xuất ưu tiên kèm lý do ngắn. Giám sát cả vòng sửa.",
    "standard": "Không kiểm định thay Khuê. Đề xuất ưu tiên qua Quyên trình Đào; ưu tiên không cấp quyền. HOLD hoặc UNKNOWN không tự thực thi và không tạo tiến độ giả."
  },
  {
    "name": "Khuê",
    "title": "Giám đốc kiểm định độc lập",
    "group": "Giám đốc",
    "task": "Đối chiếu sản phẩm với chuẩn đã ghim; chỉ rõ bằng chứng đạt hoặc lỗi tại công đoạn.",
    "standard": "Không tự sản xuất rồi tự nghiệm thu; không trực tiếp giao sửa. PASS chất lượng không cấp quyền xuất bản."
  },
  {
    "name": "Ngọc Lan",
    "title": "Phòng Linh Văn Bản",
    "group": "Phòng chuyên môn",
    "task": "Tiếp nhận nguồn, soạn nội dung, dàn trang và bàn giao tài liệu.",
    "standard": "Đúng nguồn và yêu cầu; kiểm bản dựng cuối, không suy diễn dữ kiện thiếu."
  },
  {
    "name": "Hải Đường",
    "title": "Phòng Linh Edit",
    "group": "Phòng chuyên môn",
    "task": "Chuẩn bị nguồn, kịch bản, dựng, phụ đề, âm thanh và xuất video.",
    "standard": "Kiểm hình, tiếng, phụ đề và tệp xuất theo chuẩn; giữ nguyên đầu vào gốc."
  },
  {
    "name": "Hạ Vy",
    "title": "Phòng MXH",
    "group": "Phòng chuyên môn",
    "task": "Chuẩn hóa nguồn và định dạng nội dung cho từng kênh.",
    "standard": "Bản nội dung và bản xuất đúng đặc tả; không coi render xong là đã được phép đăng."
  },
  {
    "name": "Trúc",
    "title": "Phòng Zalo",
    "group": "Phòng chuyên môn",
    "task": "Phân loại nội dung, chuẩn bị phản hồi và đối chiếu biên nhận trong phạm vi được giao.",
    "standard": "Chỉ đúng người nhận và hội thoại được phép; không tự mở rộng phạm vi hoặc công khai tin nhắn."
  },
  {
    "name": "Tường Vy",
    "title": "Phòng Fanpage",
    "group": "Phòng chuyên môn",
    "task": "Tiếp nhận câu hỏi, đối chiếu tri thức, soạn nháp và chuyển việc phù hợp.",
    "standard": "Phản hồi theo nguồn được duyệt; việc gửi cần quyền tương ứng và biên nhận."
  },
  {
    "name": "Châu",
    "title": "Phòng LINH JOB",
    "group": "Phòng chuyên môn",
    "task": "Kiểm kênh, chuẩn bị nội dung và tổ chức hồ sơ bàn giao.",
    "standard": "Đúng tài khoản, nội dung và phạm vi; đối chiếu kết quả thực tế, không tạo biên nhận giả."
  },
  {
    "name": "Mộc Lan",
    "title": "Luồng 2 · Facebook",
    "group": "Kênh xuất bản",
    "task": "Kiểm nguồn, định dạng, lời đăng và gói bàn giao Facebook.",
    "standard": "Chỉ xuất bản khi có phê duyệt; kiểm kết quả và biên nhận đúng kênh."
  },
  {
    "name": "Thùy Dung",
    "title": "Luồng 2 · TikTok",
    "group": "Kênh xuất bản",
    "task": "Kiểm nguồn, định dạng, lời đăng và gói bàn giao TikTok.",
    "standard": "Chỉ xuất bản khi có phê duyệt; kiểm kết quả và biên nhận đúng kênh."
  },
  {
    "name": "Hải Âu",
    "title": "Luồng 2 · YouTube",
    "group": "Kênh xuất bản",
    "task": "Kiểm nguồn, định dạng, lời đăng và gói bàn giao YouTube.",
    "standard": "Chỉ xuất bản khi có phê duyệt; kiểm kết quả và biên nhận đúng kênh."
  },
  {
    "name": "Ngân",
    "title": "Trưởng phòng Ads · Facebook Ads",
    "group": "Phòng chuyên môn",
    "task": "Tiếp nhận đề bài và mẫu quảng cáo được duyệt; chuẩn bị thiết lập nháp, kế hoạch đo lường và đề xuất tối ưu quảng cáo, ưu tiên Facebook Ads.",
    "standard": "Vai trò trong mô hình, chưa kết nối tài khoản hay chạy chiến dịch. Khởi chạy, thay ngân sách hoặc tối ưu phải có phê duyệt cụ thể về tài khoản, mức chi, nội dung và phạm vi; không tự mở rộng quyền."
  },
  {
    "name": "Diệu",
    "title": "Trưởng phòng Marketing",
    "group": "Phòng chuyên môn",
    "task": "Nghiên cứu đối thủ từ nguồn công khai; xây đề bài, viết nội dung nguyên bản, chuẩn bị hình ảnh và bàn giao gói nội dung cho Ads hoặc kênh xuất bản.",
    "standard": "Vai trò trong mô hình, chưa kết nối hệ thống. Dẫn nguồn nghiên cứu, tôn trọng quyền sử dụng hình ảnh; không sao chép hoặc thu thập dữ liệu riêng. Qua Khuê kiểm định độc lập; không tự đăng hoặc phát động chiến dịch."
  },
  {
    "name": "An",
    "title": "Nhân viên quản trị website · Marketing",
    "group": "Phòng chuyên môn",
    "task": "Dưới sự phụ trách của Diệu: kiểm nội dung, giao diện, hiệu năng, biểu mẫu, liên kết, khả năng tiếp cận và SEO của website. Phối hợp Tuệ về ưu tiên, Khôi khi cần sửa code và Khuê để kiểm định độc lập.",
    "standard": "Vai trò hư cấu trong mô hình; không tự cấp quyền xuất bản hoặc thay đổi bảo mật. Mỗi thay đổi cần phiên bản, bản thử nghiệm, bằng chứng và phương án phục hồi. Chỉ dùng công cụ nằm trong phạm vi được giao."
  }
];


// Public functional structure only; no runtime activation or private task state.
roles.push(...[
  {
    "name": "Mai Chi",
    "title": "Luồng 1 · Facebook",
    "group": "Truyền thông",
    "task": "Chuẩn bị nội dung và bàn giao kênh Facebook trong phạm vi được giao.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "persona-mai-chi"
  },
  {
    "name": "Yến Nhi",
    "title": "Luồng 1 · TikTok",
    "group": "Truyền thông",
    "task": "Chuẩn bị nội dung và kiểm điều kiện kênh TikTok.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "persona-yen-nhi"
  },
  {
    "name": "Bình An",
    "title": "Luồng 1 · YouTube",
    "group": "Truyền thông",
    "task": "Chuẩn bị nội dung và đối chiếu biên nhận kênh YouTube.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "persona-binh-an"
  },
  {
    "name": "Nguyệt Anh",
    "title": "Kế hoạch tháng",
    "group": "Kế hoạch",
    "task": "Đối chiếu mẫu, kỳ kế hoạch và nguồn trước khi lập kế hoạch tháng.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "nguyet-anh-monthly"
  },
  {
    "name": "Tuần Anh",
    "title": "Kế hoạch tuần",
    "group": "Kế hoạch",
    "task": "Lập kế hoạch tuần theo đúng mẫu và đầu vào đã xác minh.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "tuan-anh-weekly"
  },
  {
    "name": "Gia Hân",
    "title": "Đăng ký sử dụng xe",
    "group": "Kế hoạch",
    "task": "Tổng hợp đăng ký xe; không trộn với kế hoạch chuyến đi.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "gia-han-vehicle-registration"
  },
  {
    "name": "Bảo An",
    "title": "Kế hoạch xe trường",
    "group": "Kế hoạch",
    "task": "Soạn kế hoạch chuyến đi theo đúng thẩm quyền và nguồn.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "bao-an-school-vehicle-plan"
  },
  {
    "name": "Học Minh",
    "title": "Dữ liệu tuyển sinh",
    "group": "Dữ liệu",
    "task": "Kiểm chất lượng, nguồn và phạm vi xử lý dữ liệu tuyển sinh.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "hoc-minh-admissions"
  },
  {
    "name": "Công Thành",
    "title": "Dữ liệu công nhân",
    "group": "Dữ liệu",
    "task": "Đối chiếu danh sách và nguồn, không tự suy thông tin cá nhân.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "cong-thanh-tkv-roster"
  },
  {
    "name": "Minh Chính",
    "title": "Kiểm định văn bản Đảng",
    "group": "Văn bản",
    "task": "Rà đúng tuyến văn bản Đảng và phiên bản nguồn hiện hành tại lần kiểm.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng."
  },
  {
    "name": "Pháp Minh",
    "title": "Kiểm định văn bản Nhà nước",
    "group": "Văn bản",
    "task": "Rà đúng thể thức, thẩm quyền và nguồn pháp luật liên quan.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng."
  },
  {
    "name": "Nhã Văn",
    "title": "Biên tập giọng văn",
    "group": "Văn bản",
    "task": "Làm rõ giọng văn nhưng giữ nguyên số liệu, nghĩa pháp lý và dữ kiện.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng."
  },
  {
    "name": "Vân Anh",
    "title": "Trưởng Phòng Vận hành Cloud",
    "group": "Vận hành Cloud",
    "task": "Điều phối ứng dụng Cloud, phiên GUI, checkpoint và phục hồi theo quyền hiện hữu.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "cloud-operations/van-anh"
  },
  {
    "name": "Minh Tiến",
    "title": "Giám sát tiến độ PC",
    "group": "Giám sát chuyên trách",
    "task": "Theo mốc PC qua biên nhận; báo chậm và thiếu đầu vào qua Tuệ, không thay executor.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "progress-pc-01"
  },
  {
    "name": "Vân Tiến",
    "title": "Giám sát tiến độ Cloud",
    "group": "Giám sát chuyên trách",
    "task": "Theo mốc Cloud và điều kiện host; không tự mở GUI hoặc triển khai dịch vụ.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "progress-cloud-01"
  },
  {
    "name": "Văn Tiến",
    "title": "Giám sát tiến độ văn bản",
    "group": "Giám sát chuyên trách",
    "task": "Theo đầu vào, soạn, biên tập, kiểm định, duyệt và giao nhận đúng phiên bản.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "progress-documents-01"
  },
  {
    "name": "Kết Minh",
    "title": "Trưởng Phòng Tích hợp AGY",
    "group": "Tích hợp AGY",
    "task": "Điều phối kết nối, giao nhiệm vụ, đối soát kết quả và lỗi theo giao thức được duyệt.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "agy-integration/ket-minh"
  },
  {
    "name": "Ngân Hà",
    "title": "Theo dõi nguồn lực credit",
    "group": "Nguồn lực",
    "task": "Đọc nguồn quota chính thức và báo khôi phục có bằng chứng; không thử job để dò hạn mức.",
    "standard": "Đây là mô tả chức năng công khai, không xác nhận worker đang hoạt động. Quyền thực thi, QA và nghiệm thu vẫn theo nhiệm vụ và biên nhận riêng.",
    "roleId": "resource-credit/ngan-ha"
  }
]);
