import {dailyCommunitySourceImages20260822 as images} from "./daily-community-source-images-20260822.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const xayLapMoSupportArticle20260822 = withImage("xay-lap-mo-ho-tro-gia-dinh-cong-nhan-kho-khan-2026", {
  updated: "2026-08-22T08:18:00+07:00",
  published: "2026-08-22T08:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/22/xay-lap-mo-ho-tro-gia-dinh-cong-nhan-kho-khan-2026",
  related: ["viec-lam-cong-ty-xay-lap-mo-2026", "phuc-loi-tho-mo-tkv-2026", "nha-o-tho-mo-quang-ninh-2026"],
  section: "An sinh xã hội",
  title: "Xây lắp mỏ hỗ trợ gia đình công nhân có hoàn cảnh khó khăn",
  description: "Công ty Xây lắp mỏ thăm hỏi gia đình công nhân khó khăn; tập thể Phân xưởng Đào lò 15 quyên góp 31,5 triệu đồng để cùng chia sẻ.",
  lead: "Chuyến thăm tại Hải Phòng kết nối sự hỗ trợ của doanh nghiệp, Công đoàn và đồng nghiệp với một gia đình công nhân đang chịu nhiều áp lực.",
  keyword: "Xây lắp mỏ hỗ trợ gia đình công nhân khó khăn",
  keywords: ["Xây lắp mỏ hỗ trợ gia đình công nhân khó khăn", "Công đoàn TKV hỗ trợ người lao động", "31,5 triệu đồng hỗ trợ công nhân", "an sinh xã hội ngành Than", "nghĩa tình thợ mỏ", "Phân xưởng Đào lò 15"],
  facts: [["Ngày 16/08/2026", "Thời điểm đoàn công tác tới thăm gia đình người lao động."], ["31,5 triệu đồng", "Khoản tập thể Phân xưởng Đào lò 15 quyên góp hỗ trợ gia đình."], ["Ba lực lượng", "Doanh nghiệp, Công đoàn và đồng nghiệp cùng tham gia chăm lo."], ["Hải Phòng", "Địa phương đoàn công tác tới thăm gia đình công nhân."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 21/08/2026 đăng thông tin về hoạt động <strong>Xây lắp mỏ hỗ trợ gia đình công nhân khó khăn</strong>. Sáng 16/08, đoàn Công ty Xây lắp mỏ – TKV tới thăm gia đình một công nhân Phân xưởng Đào lò 15 tại Hải Phòng.",
    "Gia đình người lao động đang chịu nhiều áp lực sau khi vợ qua đời vì bệnh nặng, con còn nhỏ và bố mẹ cũng có vấn đề sức khỏe. Đoàn công tác trao quà của Công ty và Công đoàn; tập thể Phân xưởng Đào lò 15 đã quyên góp 31,5 triệu đồng để hỗ trợ đồng nghiệp.",
    "Khoản 31,5 triệu đồng là kết quả vận động trong một trường hợp cụ thể, không phải chế độ chung hoặc mức hỗ trợ mặc định dành cho mọi người lao động ngành Than.",
  ],
  sections: [
    {title: "Xây lắp mỏ hỗ trợ gia đình công nhân bằng nhiều lớp sẻ chia", paragraphs: [
      "Chuyến thăm có đại diện Công đoàn Công ty, Phòng Tổ chức nhân sự và đơn vị trực tiếp quản lý người lao động. Sự có mặt của nhiều đầu mối giúp hoàn cảnh được nắm từ cả góc độ công việc, đời sống và nhu cầu trước mắt của gia đình.",
      "Phần quà của doanh nghiệp và Công đoàn tạo hỗ trợ ban đầu, trong khi khoản quyên góp từ đồng nghiệp thể hiện sự gắn kết ở cấp phân xưởng. Việc công khai đúng số tiền vận động giúp tập thể biết nguồn lực đã được chuyển đến gia đình cần hỗ trợ.",
    ]},
    {title: "Công đoàn cơ sở là đầu mối để người lao động báo khó khăn sớm", paragraphs: [
      "Khi gia đình gặp biến cố về sức khỏe, tang sự hoặc người phụ thuộc, người lao động nên thông tin sớm với Công đoàn bộ phận, quản đốc hoặc Phòng Tổ chức nhân sự. Việc xác minh qua đầu mối chính thức giúp đơn vị lựa chọn hình thức hỗ trợ phù hợp và tránh vận động thiếu minh bạch.",
      "Người lao động cần giữ giấy tờ liên quan trong phạm vi cần thiết, đồng thời hỏi rõ khoản nào là chế độ theo quy định và khoản nào là hỗ trợ tự nguyện. Hai nguồn này có mục đích khác nhau và không nên thay thế cho quyền lợi bảo hiểm hoặc chính sách lao động đang áp dụng.",
    ]},
    {title: "Hỗ trợ cộng đồng có ý nghĩa khi tiếp tục theo dõi sau chuyến thăm", paragraphs: [
      "Một lần trao quà có thể giảm áp lực cấp thời, còn gia đình có con nhỏ và người thân đau ốm thường cần kế hoạch dài hơn. Đơn vị trực tiếp nên giữ liên hệ để cập nhật nhu cầu, kết nối chế độ hợp lệ và hỗ trợ công việc khi người lao động trở lại ca sản xuất.",
      "Sự đồng hành đúng mức cũng cần tôn trọng đời tư. Thông tin công khai nên tập trung vào hoạt động hỗ trợ, tránh khai thác chi tiết nhạy cảm vượt quá điều cần thiết để xác nhận hoàn cảnh và trách nhiệm của tổ chức.",
    ]},
  ],
  factsTitle: "Những thông tin đã được Công đoàn TKV công bố",
  actionTitle: "Người lao động nên làm gì khi gia đình gặp biến cố",
  conclusionTitle: "Nghĩa tình thợ mỏ bắt đầu từ việc không để đồng nghiệp đơn độc",
  checklist: [["Báo đúng đầu mối", "Liên hệ Công đoàn bộ phận, quản đốc hoặc Phòng Tổ chức nhân sự."], ["Tách rõ quyền lợi", "Phân biệt chế độ theo quy định với khoản hỗ trợ tự nguyện."], ["Giữ chứng từ cần thiết", "Cung cấp giấy tờ trong phạm vi phục vụ xác minh và giải quyết chế độ."], ["Theo dõi sau hỗ trợ", "Duy trì liên hệ khi hoàn cảnh, sức khỏe hoặc việc chăm sóc con nhỏ thay đổi."]],
  takeaway: "Công ty Xây lắp mỏ, Công đoàn và tập thể Phân xưởng Đào lò 15 đã cùng hỗ trợ một gia đình công nhân khó khăn; riêng khoản đồng nghiệp quyên góp là 31,5 triệu đồng. Giá trị lâu dài nằm ở việc tiếp tục theo dõi và kết nối đúng quyền lợi cho người lao động.",
  faq: [["Hoạt động thăm hỏi diễn ra khi nào?", "Đoàn công tác tới thăm gia đình người lao động sáng 16/08/2026."], ["Tập thể Phân xưởng Đào lò 15 đã quyên góp bao nhiêu?", "Bài nguồn công bố số tiền 31,5 triệu đồng."], ["Đây có phải mức hỗ trợ chung của ngành Than không?", "Không. Đây là khoản vận động cho một trường hợp có hoàn cảnh đặc biệt khó khăn."], ["Người lao động nên liên hệ ai khi gia đình gặp biến cố?", "Có thể báo Công đoàn bộ phận, quản đốc hoặc Phòng Tổ chức nhân sự để được hướng dẫn theo tình huống thực tế."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Công ty Xây lắp mỏ thăm hỏi, động viên gia đình công nhân có hoàn cảnh đặc biệt khó khăn", date: "21/08/2026", url: images["xay-lap-mo-ho-tro-gia-dinh-cong-nhan-kho-khan-2026"].sourceUrl}],
  seoLine: "Bài viết ghi nhận cách Xây lắp mỏ hỗ trợ gia đình công nhân khó khăn và vai trò của Công đoàn, đơn vị sản xuất trong chăm lo người lao động.",
});

export const collegeRecruitmentArticle20260822 = withImage("truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026", {
  updated: "2026-08-22T08:19:00+07:00",
  published: "2026-08-22T08:19:00+07:00",
  urlPath: "tin-nganh-than/2026/08/22/truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026",
  related: ["tuyen-sinh-nghe-mo-dong-ngu-2026", "than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026", "tuyen-sinh-nghe-mo-thai-nguyen-2026", "viec-lam-nganh-than-thang-8-2026"],
  section: "Kết nối địa phương",
  title: "Trường Cao đẳng TKV tháo gỡ điểm nghẽn tuyển sinh nghề mỏ",
  description: "Đảng ủy Than Quảng Ninh và Trường Cao đẳng TKV tập trung tháo gỡ khó khăn tuyển sinh nghề mỏ, quản lý học sinh và nâng chất lượng đào tạo.",
  lead: "Buổi làm việc đặt trọng tâm vào phối hợp Nhà trường – doanh nghiệp – địa phương, duy trì người học qua đào tạo, thực tập và nâng chất lượng nguồn nhân lực ngành Than.",
  keyword: "Trường Cao đẳng TKV tuyển sinh nghề mỏ 2026",
  keywords: ["Trường Cao đẳng TKV tuyển sinh nghề mỏ 2026", "tháo gỡ điểm nghẽn tuyển sinh", "đào tạo thợ lò Quảng Ninh", "việc làm ngành Than", "phối hợp Nhà trường doanh nghiệp địa phương", "quản lý học sinh thực tập"],
  facts: [["Ngày 19/08/2026", "Thời điểm buổi làm việc diễn ra tại Văn phòng Nhà trường."], ["Ba bên phối hợp", "Nhà trường, doanh nghiệp và địa phương được xác định là chuỗi liên kết cần tăng cường."], ["Hai chặng cần giữ người học", "Quá trình đào tạo và thực tập sản xuất đều được đưa ra trao đổi."], ["Chuyển đổi số", "Một trong các nhiệm vụ phục vụ quản lý và nâng hiệu quả hoạt động."]],
  intro: [
    "Trường Cao đẳng Than – Khoáng sản Việt Nam ngày 21/08/2026 công bố kết quả buổi làm việc giữa Thường trực Đảng ủy Than Quảng Ninh và Đảng ủy Nhà trường. Nội dung trọng tâm là tháo gỡ khó khăn trong <strong>Trường Cao đẳng TKV tuyển sinh nghề mỏ 2026</strong>, nâng chất lượng đào tạo và quản lý học sinh.",
    "Buổi làm việc diễn ra chiều 19/08 tại Văn phòng Nhà trường. Báo cáo tám tháng đầu năm cho biết Nhà trường đã đổi mới công tác tuyển sinh, tăng phối hợp với cấp ủy, chính quyền địa phương và doanh nghiệp, đồng thời duy trì chất lượng đào tạo, an ninh, an toàn và chuyển đổi số.",
    "Các đại biểu xác định tuyển sinh nghề mỏ và duy trì học sinh trong quá trình đào tạo, thực tập sản xuất vẫn là điểm cần tập trung. Kết luận đề nghị tăng phối hợp ba bên, quản lý người học sát hơn và nâng chất lượng đào tạo; nội dung này chưa phải thông báo trúng tuyển hoặc cam kết việc làm cho từng ứng viên.",
  ],
  sections: [
    {title: "Trường Cao đẳng TKV tuyển sinh nghề mỏ theo chuỗi ba bên", paragraphs: [
      "Địa phương có lợi thế trong việc rà soát người quan tâm và giúp gia đình tiếp cận thông tin ban đầu. Nhà trường phụ trách tư vấn, đào tạo và quản lý người học; doanh nghiệp cung cấp nhu cầu nhân lực, địa điểm thực tập và yêu cầu của vị trí sản xuất.",
      "Khi ba đầu mối dùng thông tin nhất quán, người lao động sẽ dễ đối chiếu điều kiện sức khỏe, thời gian học, nơi thực tập và tiêu chuẩn tiếp nhận. Đây là nền tảng để hạn chế quyết định theo tin truyền miệng hoặc qua môi giới không rõ thẩm quyền.",
    ]},
    {title: "Duy trì người học là một điểm nghẽn của tuyển sinh nghề mỏ", paragraphs: [
      "Buổi làm việc đề cập cả việc duy trì học sinh trong thời gian đào tạo và thực tập sản xuất. Điều đó cho thấy tuyển sinh chỉ là bước đầu; sự phù hợp với nghề, kỷ luật học tập, điều kiện sinh hoạt và hỗ trợ khi xa nhà đều ảnh hưởng khả năng hoàn thành khóa học.",
      "Tư vấn trước nhập học cần giúp ứng viên hiểu môi trường mỏ, lịch học, thực hành và yêu cầu an toàn. Trong quá trình học, phản hồi sớm về sức khỏe, tâm lý hoặc khó khăn sinh hoạt giúp Nhà trường và doanh nghiệp có cơ sở hỗ trợ đúng vấn đề.",
    ]},
    {title: "Quản lý thực tập cần nối liền đào tạo với sản xuất", paragraphs: [
      "Thực tập là giai đoạn người học chuyển kiến thức thành thao tác nghề và tác phong công nghiệp. Nhà trường, đơn vị tiếp nhận và cán bộ hướng dẫn cần thống nhất nhiệm vụ, nội quy, phạm vi công việc và cách đánh giá để học sinh biết rõ mình phải đạt gì.",
      "Kết quả thực tập giúp doanh nghiệp nhận diện mức độ phù hợp, đồng thời cung cấp phản hồi để Nhà trường điều chỉnh nội dung đào tạo. Người học vẫn phải hoàn thành chương trình và đáp ứng tiêu chuẩn của đợt tuyển; thực tập không tự động đồng nghĩa với hợp đồng lao động.",
    ]},
    {title: "Chuyển đổi số cần giúp người học nhận thông tin dễ hơn", paragraphs: [
      "Ứng dụng dữ liệu có thể hỗ trợ theo dõi hồ sơ, tiến độ học, thực tập và các đầu mối phụ trách. Giá trị thực tế nằm ở việc người học biết mình đang ở bước nào, thiếu giấy tờ gì và cần liên hệ ai khi phát sinh vấn đề.",
      "Thông tin số vẫn phải rõ nguồn và được cập nhật theo từng đợt. Người lao động nên đối chiếu thông báo hiện hành của Nhà trường hoặc doanh nghiệp trước khi nộp hồ sơ, khám tuyển hay tính toán kế hoạch thu nhập sau đào tạo.",
    ]},
  ],
  factsTitle: "Những trọng tâm được nêu tại buổi làm việc",
  actionTitle: "Người quan tâm học nghề mỏ nên kiểm tra gì",
  conclusionTitle: "Tuyển đúng và đồng hành đủ mới tạo nguồn nhân lực bền vững",
  checklist: [["Đối chiếu điều kiện", "Kiểm tra tuổi, sức khỏe, học vấn và yêu cầu của nghề định đăng ký."], ["Hỏi toàn bộ lộ trình", "Nắm nơi học, thời gian, thực tập, khám tuyển và tiêu chuẩn tiếp nhận."], ["Giữ đúng đầu mối", "Làm việc qua địa phương, Nhà trường hoặc doanh nghiệp được xác nhận."], ["Báo khó khăn sớm", "Trao đổi với cán bộ quản lý khi gặp vấn đề sức khỏe, học tập hoặc sinh hoạt."]],
  takeaway: "Đảng ủy Than Quảng Ninh và Trường Cao đẳng TKV thống nhất tập trung tháo gỡ khó khăn tuyển sinh nghề mỏ, quản lý người học qua đào tạo và thực tập, đồng thời tăng phối hợp với doanh nghiệp, địa phương. Với người lao động, điều quan trọng là nhận đủ thông tin và hiểu đây là lộ trình có điều kiện, không phải lời hứa nhận việc ngay.",
  faq: [["Buổi làm việc diễn ra khi nào?", "Buổi làm việc diễn ra chiều 19/08/2026 tại Văn phòng Trường Cao đẳng Than – Khoáng sản Việt Nam."], ["Những điểm nghẽn nào được đưa ra trao đổi?", "Các đại biểu tập trung vào tuyển sinh nghề mỏ, duy trì học sinh trong đào tạo, quản lý thực tập và chất lượng đào tạo."], ["Ba bên nào cần tăng cường phối hợp?", "Nhà trường, doanh nghiệp ngành Than và chính quyền địa phương."], ["Buổi làm việc có phải thông báo bảo đảm việc làm không?", "Không. Người học vẫn phải hoàn thành đào tạo, đáp ứng sức khỏe, tay nghề và tiêu chuẩn của đợt tiếp nhận."]],
  sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Thường trực Đảng ủy Than Quảng Ninh làm việc với Đảng ủy Trường Cao đẳng Than – Khoáng sản Việt Nam: Tập trung tháo gỡ điểm nghẽn tuyển sinh, nâng cao chất lượng đào tạo và đẩy mạnh chuyển đổi số", date: "21/08/2026", url: images["truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ hướng Trường Cao đẳng TKV tuyển sinh nghề mỏ 2026, phối hợp ba bên và các bước người lao động cần kiểm tra trước khi đăng ký.",
});

export const dailyCommunityArticles20260822 = [
  xayLapMoSupportArticle20260822,
  collegeRecruitmentArticle20260822,
];
