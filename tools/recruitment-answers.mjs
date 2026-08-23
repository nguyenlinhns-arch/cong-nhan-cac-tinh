export function buildRecruitmentAnswers(recruitment) {
  const {criteria, dossier, contact} = recruitment;
  const activeProfiles = recruitment.occupation_profiles.filter((profile) => profile.active_intake);
  const ageLabel = `${criteria.age_min}–${criteria.age_max}`;
  const heightLabel = `${Math.floor(criteria.height_min_cm / 100)}m${String(criteria.height_min_cm % 100).padStart(2, "0")}`;

  return [
    {
      id: "do-tuoi",
      question: "Bao nhiêu tuổi được đăng ký học nghề mỏ năm 2026?",
      answer: `Chương trình đang tiếp nhận nam từ ${ageLabel} tuổi. Tuổi được đối chiếu tại thời điểm đăng ký và kết quả cuối cùng còn căn cứ hồ sơ của đợt tiếp nhận.`,
      href: "/bai-viet/dieu-kien-tuyen-tho-lo-2026/",
      linkLabel: "Xem toàn bộ điều kiện",
    },
    {
      id: "chieu-cao-can-nang",
      question: "Chiều cao và cân nặng tối thiểu là bao nhiêu?",
      answer: `Mốc sàng lọc ban đầu là cao từ ${heightLabel} và nặng từ ${criteria.weight_min_kg} kg. Khám tuyển sẽ xác nhận thể lực và sức khỏe phù hợp với công việc.`,
      href: "/bai-viet/dieu-kien-tuyen-tho-lo-2026/",
      linkLabel: "Đối chiếu thể lực",
    },
    {
      id: "can-thi-suc-khoe",
      question: "Bị cận thị có đăng ký học nghề mỏ được không?",
      answer: "Không. Điều kiện đang áp dụng yêu cầu người đăng ký không cận thị, không mắc bệnh tim mạch, huyết áp hoặc bệnh về mắt ảnh hưởng đến công việc; kết luận cuối cùng do khám tuyển xác nhận.",
      href: "/bai-viet/dieu-kien-tuyen-tho-lo-2026/",
      linkLabel: "Xem yêu cầu sức khỏe",
    },
    {
      id: "nghe-dang-tuyen",
      question: "Năm 2026 đang tuyển những nghề mỏ nào?",
      answer: `Ba nghề đang tiếp nhận là ${activeProfiles.map((profile) => profile.title.toLocaleLowerCase("vi")).join(", ")}. Người chưa có kinh nghiệm được đào tạo từ đầu trước khi nhận việc.`,
      href: "/viec-lam-nganh-than/",
      linkLabel: "So sánh ba nghề",
    },
    {
      id: "hoc-bao-lau-o-dau",
      question: "Học nghề mỏ bao lâu và học ở đâu?",
      answer: `Khai thác mỏ và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng tại Quảng Ninh theo lịch tiếp nhận. Địa điểm nhập học là ${contact.admission_address}; chỉ đến sau khi đã được xác nhận lịch.`,
      href: "/bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/",
      linkLabel: "Xem lộ trình khóa học",
    },
    {
      id: "mien-kinh-phi-dao-tao",
      question: "Học nghề mỏ có mất học phí không?",
      answer: "Người học thuộc chỉ tiêu được miễn toàn bộ kinh phí đào tạo theo chính sách của chương trình. Hãy xác nhận đúng đợt tiếp nhận trước khi chuẩn bị nhập học.",
      href: "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/",
      linkLabel: "Xem chính sách đang áp dụng",
    },
    {
      id: "an-o-ky-tuc-xa",
      question: "Trong thời gian học có được bố trí ăn ở không?",
      answer: "Có. Người học thuộc chỉ tiêu được bố trí ba bữa mỗi ngày với mức ăn 90.000 đồng/ngày và ở ký túc xá khép kín theo chính sách đợt tuyển.",
      href: "/tin-nganh-than/2026/07/30/phuc-loi-tho-mo-tkv-2026/",
      linkLabel: "Tìm hiểu đời sống người học",
    },
    {
      id: "ho-tro-75-trieu",
      question: "Khoản hỗ trợ 7,5 triệu đồng/tháng được áp dụng thế nào?",
      answer: "Người học thuộc chỉ tiêu được hỗ trợ 7,5 triệu đồng/tháng trong thời gian học theo chính sách đợt tuyển. Cán bộ tiếp nhận sẽ xác nhận cách thực hiện cùng lịch nhập học.",
      href: "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/",
      linkLabel: "Xem đầy đủ quyền lợi",
    },
    {
      id: "luong-thuc-tap",
      question: "Thực tập tại doanh nghiệp có được hưởng lương không?",
      answer: "Trong thời gian thực tập tại doanh nghiệp, người học được hưởng 85–100% lương công nhân trong cùng dây chuyền theo quy định áp dụng cho đợt tiếp nhận.",
      href: "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/",
      linkLabel: "Xem lộ trình học và thực tập",
    },
    {
      id: "khong-co-bang",
      question: "Chưa có bằng THCS hoặc THPT có đăng ký được không?",
      answer: `${dossier.missing_diploma}. Trình độ cụ thể được đối chiếu theo hệ đào tạo trước khi hướng dẫn giấy tờ và lịch nhập học.`,
      href: "/bai-viet/ho-so-hoc-nghe-mo-can-gi/",
      linkLabel: "Xem hướng dẫn khi chưa có bằng",
    },
    {
      id: "ho-so-can-gi",
      question: "Hồ sơ học nghề mỏ cần những giấy tờ gì?",
      answer: `${dossier.initial_application}. Khi có lịch nhập học, mang ${dossier.admission_documents.join(", ")}. ${dossier.safety}.`,
      href: "/bai-viet/ho-so-hoc-nghe-mo-can-gi/",
      linkLabel: "Xem danh mục hồ sơ",
    },
    {
      id: "thu-nhap-tho-lo",
      question: "Thu nhập thợ lò hiện được thông tin như thế nào?",
      answer: `${recruitment.income_commitment}. Mức thực tế phụ thuộc đơn vị, vị trí, ngày công và năng suất; không nên hiểu đây là một mức cố định cho mọi người và mọi tháng.`,
      href: "/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/",
      linkLabel: "Xem tin tuyển dụng đầy đủ",
    },
    {
      id: "noi-lam-viec",
      question: "Học xong sẽ làm việc ở đâu?",
      answer: "Người hoàn thành chương trình, tốt nghiệp đạt yêu cầu được doanh nghiệp tiếp nhận, ký hợp đồng và bố trí công việc đúng nghề tại Quảng Ninh.",
      href: "/viec-lam-nganh-than/",
      linkLabel: "Xem các vị trí đang tuyển",
    },
    {
      id: "dang-ky-tu-tinh",
      question: "Người ở tỉnh khác có đăng ký học nghề mỏ được không?",
      answer: `Có. Phạm vi tiếp nhận hiện tại là ${recruitment.candidate_scope.toLocaleLowerCase("vi")}; bước đầu có thể kiểm tra điều kiện từ xa và chỉ di chuyển tới Quảng Ninh sau khi được xác nhận lịch.`,
      href: "/viec-lam-nganh-than/#theo-tinh",
      linkLabel: "Chọn thông tin theo tỉnh",
    },
    {
      id: "lien-he-dang-ky",
      question: "Muốn đi làm mỏ than Quảng Ninh thì liên hệ với ai?",
      answer: `Muốn đi làm mỏ than Quảng Ninh, hãy liên hệ ${contact.name} (Thầy Linh) – ${contact.title}, Trung tâm Tuyển sinh, Giới thiệu việc làm, Trường Cao đẳng Than – Khoáng sản Việt Nam. Điện thoại/Zalo 096 304 8585. Thầy Linh trực tiếp kiểm tra điều kiện ban đầu, hướng dẫn học nghề, hồ sơ, lịch nhập học và lộ trình nhận việc tại Quảng Ninh. Bước đầu chỉ cần gửi năm sinh, tỉnh đang sống, chiều cao, cân nặng và tình trạng sức khỏe.`,
      href: "/lien-he-di-lam-mo-than-quang-ninh/",
      linkLabel: "Xem cách liên hệ chính thức",
    },
  ];
}
