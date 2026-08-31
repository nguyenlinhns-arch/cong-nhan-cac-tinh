import {dailyCommunitySourceImages20260829 as images} from "./daily-community-source-images-20260829.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const reintegrationTrainingArticle20260829 = withImage("phoi-hop-dao-tao-nghe-ho-tro-tai-hoa-nhap-cong-dong-2026", {
  updated: "2026-08-29T08:15:00+07:00",
  published: "2026-08-29T08:15:00+07:00",
  urlPath: "tin-nganh-than/2026/08/29/phoi-hop-dao-tao-nghe-ho-tro-tai-hoa-nhap-cong-dong-2026",
  related: ["truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026", "tuyen-sinh-nghe-mo-dong-ngu-2026", "khau-vai-phoi-hop-dao-tao-nghe-viec-lam-2026", "dao-tao-an-toan-truoc-khi-vao-lo"],
  section: "Kết nối địa phương",
  title: "TKV phối hợp đào tạo nghề, hỗ trợ tái hòa nhập cộng đồng",
  description: "TKV, Trường Cao đẳng TKV và Công an Quảng Ninh phối hợp phương án đào tạo nghề, thực tập và kết nối việc làm cho người sau cai nghiện đủ điều kiện.",
  lead: "Một lộ trình tái hòa nhập chỉ bền vững khi đào tạo nghề đi cùng sàng lọc phù hợp, quản lý học tập, thực hành an toàn và cơ hội việc làm được xác định rõ trách nhiệm giữa các bên.",
  keyword: "TKV đào tạo nghề hỗ trợ tái hòa nhập cộng đồng 2026",
  keywords: ["TKV đào tạo nghề hỗ trợ tái hòa nhập cộng đồng 2026", "Trường Cao đẳng TKV", "đào tạo nghề mỏ", "việc làm ngành Than", "Công an Quảng Ninh", "học nghề mỏ Quảng Ninh"],
  facts: [["05/03/2026", "Ngày bài nguồn được TKV phát hành; kết quả này mới được công cụ tìm kiếm lập chỉ mục."], ["30–40 học viên", "Quy mô lớp thí điểm được nêu trong phương án, không phải số người đã trúng tuyển."], ["30%", "Mục tiêu năm 2026 về đào tạo và cấp chứng chỉ cho học viên đủ điều kiện theo đề án của tỉnh."], ["Hai doanh nghiệp", "Than Hạ Long và Than Núi Béo được nêu là nơi dự kiến bố trí thực tập sau giai đoạn học tại trường."]],
  intro: [
    "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam ngày 05/03/2026 công bố hội nghị về <strong>TKV đào tạo nghề hỗ trợ tái hòa nhập cộng đồng 2026</strong>. Bài nguồn mới được công cụ tìm kiếm lập chỉ mục, chưa có trong sổ URL của website nên được xử lý ở lượt quét mở rộng này.",
    "Phương án đặt trọng tâm vào phối hợp giữa TKV, Trường Cao đẳng TKV, Công an tỉnh Quảng Ninh, cơ sở cai nghiện và các doanh nghiệp sản xuất hầm lò, xây lắp mỏ. Người tham gia phải đáp ứng điều kiện sức khỏe, ý thức và các yêu cầu tuyển sinh, đào tạo, làm việc của ngành Than.",
    "Nguồn nêu quy mô dự kiến 30–40 học viên cho lớp thí điểm, sau thời gian học và thực hành tại trường sẽ bố trí thực tập tại Than Hạ Long và Than Núi Béo. Đây là phương án tuyển chọn và tổ chức đào tạo, không phải cam kết mọi người đăng ký đều được tiếp nhận hoặc có việc làm.",
  ],
  sections: [
    {title: "Phối hợp nhiều bên để lộ trình không đứt đoạn", paragraphs: [
      "Cơ quan công an và cơ sở cai nghiện có vai trò rà soát, quản lý, hỗ trợ người đủ điều kiện tiếp cận chương trình. Nhà trường chịu trách nhiệm tư vấn, tuyển chọn, đào tạo; doanh nghiệp tham gia thực tập, đánh giá khả năng đáp ứng công việc và bố trí lao động theo nhu cầu thực tế.",
      "Cách phân định này giúp hạn chế tình trạng học nghề xong nhưng thiếu đầu mối tiếp nhận, đồng thời bảo đảm những yêu cầu đặc thù của nghề mỏ được giải thích từ đầu. Việc theo dõi sau đào tạo cũng cần được duy trì để hỗ trợ người học thích nghi với kỷ luật lao động.",
    ]},
    {title: "Điều kiện an toàn và sự sẵn sàng phải được đánh giá thực chất", paragraphs: [
      "Công việc mỏ hầm lò đòi hỏi sức khỏe, ý thức tuân thủ quy trình và khả năng làm việc tập thể. Vì vậy, mục tiêu nhân văn của chương trình không làm giảm yêu cầu khám sức khỏe, kiểm tra hồ sơ, rèn luyện kỹ năng hoặc đánh giá trong quá trình thực tập.",
      "Người quan tâm nên được tư vấn rõ về thời gian học, môi trường thực hành, chế độ tại đúng khóa và tiêu chí tiếp nhận của doanh nghiệp. Các thông tin về thu nhập hoặc việc làm chỉ có giá trị khi được đơn vị có thẩm quyền xác nhận cho từng giai đoạn.",
    ]},
    {title: "Thí điểm cần được tổng kết trước khi mở rộng", paragraphs: [
      "Nguồn chính thức cho biết các bên sẽ tổng kết, đánh giá lớp đầu tiên rồi mới triển khai trong những giai đoạn tiếp theo. Những chỉ số cần theo dõi gồm tỷ lệ hoàn thành khóa học, kết quả thực tập, mức độ tuân thủ an toàn và khả năng duy trì việc làm.",
      "Nếu được vận hành chặt chẽ, mô hình vừa mở thêm con đường nghề nghiệp cho người quyết tâm làm lại cuộc đời, vừa bổ sung nguồn lao động đã qua đào tạo cho doanh nghiệp. Tuy nhiên, hiệu quả phải được chứng minh bằng kết quả thực tế và không thể suy rộng từ mục tiêu ban đầu.",
    ]},
  ],
  factsTitle: "Phạm vi phương án đã được công bố",
  actionTitle: "Người quan tâm cần kiểm tra trước khi đăng ký",
  conclusionTitle: "Cơ hội chỉ bền vững khi đi cùng trách nhiệm và kỷ luật",
  checklist: [["Xác minh điều kiện", "Đối chiếu sức khỏe, hồ sơ và tiêu chí tuyển chọn với đầu mối chính thức."], ["Hiểu đúng lộ trình", "Phân biệt giai đoạn học tại trường, thực tập và xem xét tiếp nhận việc làm."], ["Hỏi rõ chế độ", "Chỉ sử dụng thông tin học phí, hỗ trợ và quyền lợi được xác nhận cho đúng khóa."], ["Tuân thủ an toàn", "Xem việc chấp hành quy trình và kỷ luật tập thể là điều kiện xuyên suốt."]],
  takeaway: "TKV, Trường Cao đẳng TKV và Công an Quảng Ninh xây dựng phương án đào tạo nghề gắn với thực tập và kết nối việc làm cho người sau cai nghiện đủ điều kiện. Quy mô thí điểm 30–40 người là mục tiêu tuyển chọn, chưa phải kết quả đầu ra hoặc cam kết việc làm đại trà.",
  faq: [["Ai có thể tham gia chương trình?", "Người sau cai nghiện được cơ quan liên quan rà soát và đáp ứng điều kiện sức khỏe, ý thức, tuyển sinh, đào tạo của chương trình."], ["Quy mô lớp thí điểm là bao nhiêu?", "Phương án nêu mục tiêu tuyển chọn 30–40 học viên đủ điều kiện."], ["Học viên sẽ thực tập ở đâu?", "Nguồn nêu dự kiến thực tập tại Công ty Than Hạ Long và Công ty Cổ phần Than Núi Béo."], ["Đăng ký có chắc chắn được nhận việc không?", "Không. Việc học, thực tập và tiếp nhận còn phụ thuộc điều kiện, kết quả rèn luyện, nhu cầu cùng đánh giá của đơn vị."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Phối hợp đào tạo nghề, hỗ trợ tái hòa nhập cộng đồng cho người sau cai nghiện trở về địa phương", date: "05/03/2026", url: images["phoi-hop-dao-tao-nghe-ho-tro-tai-hoa-nhap-cong-dong-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ phương án TKV đào tạo nghề hỗ trợ tái hòa nhập cộng đồng 2026 và các điều kiện để học nghề mỏ, thực tập, kết nối việc làm.",
});

export const nuiBeoStudentSupportArticle20260829 = withImage("than-nui-beo-ho-tro-hoc-sinh-nghe-mo-quoc-khanh-2026", {
  updated: "2026-08-29T08:18:00+07:00",
  published: "2026-08-29T08:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/29/than-nui-beo-ho-tro-hoc-sinh-nghe-mo-quoc-khanh-2026",
  related: ["than-nui-beo-thanh-nien-ca-thanh-tim-hieu-nghe-mo-2026", "than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026", "truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026", "dao-tao-an-toan-truoc-khi-vao-lo"],
  section: "Kết nối địa phương",
  title: "Than Núi Béo hỗ trợ 148 học sinh đang học nghề mỏ hầm lò",
  description: "Than Núi Béo hỗ trợ 500.000 đồng cho mỗi học sinh thuộc chỉ tiêu Công ty đang học nghề cơ điện mỏ và khai thác mỏ hầm lò tại ba phân hiệu.",
  lead: "Khoản hỗ trợ dịp Quốc khánh đi cùng hoạt động gặp mặt, giải đáp nguyện vọng, qua đó giúp doanh nghiệp giữ kết nối với học sinh từ khi còn học nghề đến trước giai đoạn thực tập và làm việc.",
  keyword: "Than Núi Béo hỗ trợ học sinh nghề mỏ 2026",
  keywords: ["Than Núi Béo hỗ trợ học sinh nghề mỏ 2026", "148 học sinh nghề mỏ", "tuyển sinh nghề mỏ", "học nghề mỏ hầm lò", "Trường Cao đẳng TKV", "việc làm ngành Than"],
  facts: [["148 học sinh", "Số người thuộc chỉ tiêu của Công ty được hỗ trợ."], ["500.000 đồng/người", "Mức hỗ trợ được công bố cho dịp Quốc khánh 2/9."], ["Ba phân hiệu", "Hữu Nghị, Hoành Bồ và Cẩm Phả."], ["Hai nghề", "Kỹ thuật cơ điện mỏ hầm lò và Kỹ thuật khai thác mỏ hầm lò."]],
  intro: [
    "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam ngày 28/08/2026 thông tin về chương trình <strong>Than Núi Béo hỗ trợ học sinh nghề mỏ 2026</strong>. Toàn bộ 148 học sinh thuộc chỉ tiêu Công ty đang học tại ba phân hiệu của Trường Cao đẳng Than – Khoáng sản Việt Nam được hỗ trợ dịp Quốc khánh 2/9.",
    "Mỗi học sinh được hỗ trợ 500.000 đồng bằng tiền mặt hoặc chuyển khoản. Khoản động viên này giúp người học giảm bớt một phần chi phí sinh hoạt trong dịp lễ; nhóm thụ hưởng đang học hai nghề Kỹ thuật cơ điện mỏ hầm lò và Kỹ thuật khai thác mỏ hầm lò tại các phân hiệu Hữu Nghị, Hoành Bồ và Cẩm Phả.",
    "Tại Hoành Bồ và Cẩm Phả, cán bộ tuyển sinh, đào tạo của Công ty còn tổ chức gặp mặt, trao đổi, giải đáp ý kiến của học sinh. Khoản hỗ trợ mang tính động viên trong quá trình học, không thay thế các chế độ chính thức hoặc tạo ra cam kết tự động về việc làm, thu nhập.",
  ],
  sections: [
    {title: "Kết nối doanh nghiệp từ giai đoạn đào tạo", paragraphs: [
      "Khi doanh nghiệp chủ động gặp học sinh, những câu hỏi về chương trình học, thực tập, yêu cầu tay nghề và môi trường sản xuất có thể được giải đáp sớm. Điều này giúp người học nhìn thấy mối liên hệ giữa nội dung đang rèn luyện với công việc dự kiến sau đào tạo.",
      "Việc nắm tâm tư cũng giúp phát hiện khó khăn về học tập, sinh hoạt hoặc định hướng nghề nghiệp trước khi người học bỏ dở. Tuy nhiên, các vấn đề cá nhân vẫn cần được xử lý qua đúng đầu mối của nhà trường và doanh nghiệp.",
    ]},
    {title: "Khoản hỗ trợ cần được hiểu đúng phạm vi", paragraphs: [
      "Mức 500.000 đồng áp dụng cho 148 học sinh thuộc chỉ tiêu Than Núi Béo trong chương trình cụ thể này. Không nên suy rộng thành chính sách chung cho mọi học sinh nghề mỏ hoặc mặc định lặp lại ở các thời điểm khác.",
      "Người đang tìm hiểu tuyển sinh nghề mỏ cần kiểm tra riêng học phí, ăn ở, hỗ trợ sinh hoạt, thời gian học và tiêu chí tiếp nhận. Mỗi khoản phải gắn với văn bản hoặc thông báo đang có hiệu lực của đúng đơn vị, đúng khóa.",
    ]},
    {title: "Từ học nghề đến làm chủ công nghệ cần quá trình rèn luyện", paragraphs: [
      "Nguồn chính thức nhấn mạnh mục tiêu động viên học sinh yên tâm học tập, rèn luyện tay nghề và sẵn sàng làm chủ công nghệ sản xuất. Để đạt được điều đó, người học phải hoàn thành chương trình, tuân thủ an toàn và tích lũy kỹ năng thực hành một cách liên tục.",
      "Sự đồng hành của doanh nghiệp tạo thêm điểm tựa, nhưng kết quả vẫn phụ thuộc nỗ lực của người học cùng đánh giá thực tế trong giai đoạn thực tập. Đây là cách hiểu thận trọng và hữu ích hơn so với xem hỗ trợ tài chính là sự bảo đảm cho đầu ra.",
    ]},
  ],
  factsTitle: "Những con số của chương trình hỗ trợ",
  actionTitle: "Học sinh nghề mỏ nên chủ động những việc gì",
  conclusionTitle: "Giữ kết nối để người học đi trọn lộ trình",
  checklist: [["Xác nhận danh sách", "Kiểm tra mình có thuộc chỉ tiêu và hình thức nhận hỗ trợ của Công ty hay không."], ["Nêu khó khăn sớm", "Trao đổi với cán bộ quản lý khi gặp vướng mắc về học tập, sức khỏe hoặc sinh hoạt."], ["Rèn tay nghề", "Bám chương trình thực hành và quy trình an toàn của từng nghề."], ["Theo dõi đầu ra", "Tìm hiểu lịch thực tập, tiêu chí đánh giá và nhu cầu tuyển dụng tại thời điểm hoàn thành khóa."]],
  takeaway: "Than Núi Béo hỗ trợ 148 học sinh nghề mỏ thuộc chỉ tiêu Công ty, mỗi người 500.000 đồng, đồng thời gặp mặt và giải đáp nguyện vọng tại hai phân hiệu. Giá trị dài hạn nằm ở việc duy trì kết nối giữa người học, nhà trường và doanh nghiệp trong suốt lộ trình đào tạo.",
  faq: [["Có bao nhiêu học sinh được hỗ trợ?", "Nguồn chính thức nêu 148 học sinh thuộc chỉ tiêu của Than Núi Béo."], ["Mức hỗ trợ là bao nhiêu?", "500.000 đồng cho mỗi học sinh trong chương trình dịp Quốc khánh 2/9/2026."], ["Học sinh đang học tại những phân hiệu nào?", "Hữu Nghị, Hoành Bồ và Cẩm Phả của Trường Cao đẳng Than – Khoáng sản Việt Nam."], ["Khoản hỗ trợ có đồng nghĩa chắc chắn được nhận việc không?", "Không. Người học vẫn phải hoàn thành đào tạo, đáp ứng điều kiện và qua đánh giá theo nhu cầu thực tế của doanh nghiệp."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Than Núi Béo hỗ trợ học sinh nghề mỏ hầm lò nhân dịp Quốc khánh 2/9", date: "28/08/2026", url: images["than-nui-beo-ho-tro-hoc-sinh-nghe-mo-quoc-khanh-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật chương trình Than Núi Béo hỗ trợ học sinh nghề mỏ 2026 và lưu ý về lộ trình học nghề, thực tập, việc làm ngành Than.",
});

export const daBacStemArticle20260829 = withImage("kho-van-da-bac-tang-phong-hoc-stem-ba-che-2026", {
  updated: "2026-08-29T08:21:00+07:00",
  published: "2026-08-29T08:21:00+07:00",
  urlPath: "tin-nganh-than/2026/08/29/kho-van-da-bac-tang-phong-hoc-stem-ba-che-2026",
  related: ["kho-van-da-bac-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026", "than-ha-long-ho-tro-xay-sua-nha-gia-dinh-chinh-sach-2026", "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Kho vận Đá Bạc trao phòng học STEM 50 triệu đồng tại Ba Chẽ",
  description: "Kho vận Đá Bạc trao công trình Phòng học STEM cho em trị giá 50 triệu đồng cho Trường THCS Ba Chẽ và hỗ trợ học sinh khó khăn.",
  lead: "Phòng học STEM là khoản đầu tư cho hoạt động trải nghiệm; hiệu quả lâu dài phụ thuộc cách nhà trường bảo quản công cụ và đưa các bài học khoa học vào chương trình thường xuyên.",
  keyword: "Kho vận Đá Bạc tặng phòng học STEM Ba Chẽ 2026",
  keywords: ["Kho vận Đá Bạc tặng phòng học STEM Ba Chẽ 2026", "Phòng học STEM cho em", "an sinh xã hội TKV", "hỗ trợ học sinh Ba Chẽ", "cộng đồng vùng dân tộc thiểu số", "TKV Quảng Ninh"],
  facts: [["50 triệu đồng", "Giá trị công trình Phòng học STEM cho em."], ["Trường THCS Ba Chẽ", "Đơn vị tiếp nhận công trình."], ["26/08/2026", "Ngày hoạt động được tổ chức tại xã Ba Chẽ."], ["Học sinh khó khăn", "Nhóm được trao thêm các phần quà an sinh trong chương trình."]],
  intro: [
    "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam ngày 28/08/2026 công bố hoạt động <strong>Kho vận Đá Bạc tặng phòng học STEM Ba Chẽ 2026</strong>. Công trình trị giá 50 triệu đồng được trao cho Trường THCS Ba Chẽ trong ngày hội dành cho thanh niên dân tộc thiểu số tại địa phương.",
    "Phòng học được kỳ vọng giúp học sinh tiếp cận khoa học, công nghệ, thực hành và phát triển tư duy sáng tạo. Chương trình đồng thời trao quà an sinh cho học sinh có hoàn cảnh khó khăn, nhưng nguồn không công bố số lượng hoặc tổng giá trị nhóm quà này.",
    "Hoạt động diễn ra ngày 26/08, trong khuôn khổ ra quân hưởng ứng ngày cao điểm tình nguyện chung tay xây dựng nông thôn mới. Bài viết chỉ sử dụng những con số đã được cơ quan phát hành xác nhận, không suy đoán thêm về danh mục thiết bị hay số học sinh thụ hưởng.",
  ],
  sections: [
    {title: "Công trình giáo dục tạo giá trị theo thời gian", paragraphs: [
      "So với hỗ trợ sử dụng một lần, phòng học có thể phục vụ nhiều khóa học sinh nếu được vận hành đúng mục đích. Không gian STEM tạo điều kiện để các em thử nghiệm, quan sát, giải quyết vấn đề và bổ sung cho phần kiến thức lý thuyết.",
      "Giá trị 50 triệu đồng cho biết quy mô khoản trao tặng, nhưng chưa mô tả đầy đủ chất lượng sử dụng. Hiệu quả cần được nhìn qua tần suất tổ chức hoạt động, khả năng bảo quản thiết bị và mức độ giáo viên đưa công cụ vào bài học.",
    ]},
    {title: "Hỗ trợ học sinh khó khăn bổ sung cho đầu tư cơ sở vật chất", paragraphs: [
      "Việc trao quà giúp một số học sinh giảm bớt khó khăn trước mắt, trong khi công trình STEM hướng tới điều kiện học tập lâu dài. Hai lớp hỗ trợ kết hợp cho thấy an sinh giáo dục cần quan tâm đồng thời đến người học và môi trường học.",
      "Do nguồn không nêu số suất quà hoặc giá trị cụ thể, thông tin không được quy đổi hay ước tính. Cách ghi nhận minh bạch giúp người đọc phân biệt rõ phần đã xác nhận với ý nghĩa xã hội được phân tích từ sự kiện.",
    ]},
    {title: "Đồng hành địa phương cần gắn với nhu cầu thực tế", paragraphs: [
      "Ba Chẽ có nhiều học sinh vùng đồng bào dân tộc thiểu số, vì vậy cơ hội tiếp cận hoạt động khoa học thực hành có ý nghĩa trong việc mở rộng trải nghiệm nghề nghiệp. Tuy nhiên, nội dung triển khai nên dựa trên năng lực giáo viên và nhu cầu của nhà trường.",
      "Với doanh nghiệp ngành Than, hỗ trợ giáo dục là một phần trách nhiệm cộng đồng chứ không phải hoạt động tuyển dụng. Việc tôn trọng mục tiêu giáo dục của công trình giúp chương trình tạo thiện cảm bền vững và tránh gắn kỳ vọng nghề nghiệp không phù hợp cho học sinh.",
    ]},
  ],
  factsTitle: "Thông tin đã được xác nhận về công trình",
  actionTitle: "Những yếu tố giúp phòng học phát huy hiệu quả",
  conclusionTitle: "Đầu tư cho trải nghiệm học tập là hỗ trợ dài hạn",
  checklist: [["Xây lịch sử dụng", "Bố trí hoạt động STEM định kỳ phù hợp chương trình của từng khối lớp."], ["Phân công quản lý", "Có đầu mối theo dõi thiết bị, vật tư và an toàn khi thực hành."], ["Đánh giá kết quả", "Ghi nhận số buổi học, số học sinh tham gia và sản phẩm học tập."], ["Công khai phạm vi", "Phân biệt giá trị công trình với các phần quà chưa được nguồn công bố chi tiết."]],
  takeaway: "Kho vận Đá Bạc trao công trình Phòng học STEM cho em trị giá 50 triệu đồng cho Trường THCS Ba Chẽ, đồng thời hỗ trợ học sinh khó khăn. Tác động lâu dài sẽ phụ thuộc việc nhà trường đưa không gian này vào hoạt động học tập thường xuyên.",
  faq: [["Công trình được trao cho đơn vị nào?", "Trường THCS Ba Chẽ, tỉnh Quảng Ninh."], ["Giá trị công trình là bao nhiêu?", "Nguồn chính thức công bố trị giá 50 triệu đồng."], ["Chương trình còn hoạt động hỗ trợ nào khác?", "Có trao quà an sinh cho học sinh khó khăn, nhưng nguồn không nêu số lượng và tổng giá trị."], ["Đây có phải chương trình tuyển sinh nghề mỏ không?", "Không. Đây là hoạt động an sinh giáo dục và đồng hành cộng đồng tại Ba Chẽ."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Công ty Kho vận Đá Bạc - Vinacomin trao tặng công trình “Phòng học STEM cho em” tại Ba Chẽ", date: "28/08/2026", url: images["kho-van-da-bac-tang-phong-hoc-stem-ba-che-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật việc Kho vận Đá Bạc tặng phòng học STEM Ba Chẽ 2026 và ý nghĩa của công trình an sinh giáo dục đối với học sinh địa phương.",
});

export const taPhoiCommunitySupportArticle20260829 = withImage("dong-ta-phoi-ho-tro-108-ho-kho-khan-hop-thanh-2026", {
  updated: "2026-08-29T08:24:00+07:00",
  published: "2026-08-29T08:24:00+07:00",
  urlPath: "tin-nganh-than/2026/08/29/dong-ta-phoi-ho-tro-108-ho-kho-khan-hop-thanh-2026",
  related: ["than-ha-long-ho-tro-xay-sua-nha-gia-dinh-chinh-sach-2026", "cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026", "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Đồng Tả Phời hỗ trợ 108 hộ khó khăn tại xã Hợp Thành",
  description: "Đồng Tả Phời phối hợp xã Hợp Thành hỗ trợ 108 hộ nghèo, cận nghèo và hộ khó khăn; mỗi hộ nhận 10 kg gạo Séng Cù cùng 500.000 đồng.",
  lead: "Chương trình xác định rõ số hộ, mức tiền và lượng gạo cho từng gia đình, qua đó giúp khoản hỗ trợ đến đúng nhóm khó khăn và có thể được đối chiếu minh bạch tại địa phương.",
  keyword: "Đồng Tả Phời hỗ trợ hộ khó khăn Hợp Thành 2026",
  keywords: ["Đồng Tả Phời hỗ trợ hộ khó khăn Hợp Thành 2026", "108 hộ khó khăn Lào Cai", "an sinh xã hội TKV", "xã Hợp Thành Lào Cai", "hỗ trợ cộng đồng vùng mỏ", "Quốc khánh 2/9"],
  facts: [["108 hộ", "Số hộ nghèo, cận nghèo và hoàn cảnh khó khăn được hỗ trợ."], ["500.000 đồng/hộ", "Mức hỗ trợ tiền mặt cho từng gia đình."], ["10 kg gạo/hộ", "Lượng gạo Séng Cù được trao cùng tiền hỗ trợ."], ["26/08/2026", "Ngày chương trình diễn ra tại thôn Xéo Tả, xã Hợp Thành."]],
  intro: [
    "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam ngày 28/08/2026 thông tin chương trình <strong>Đồng Tả Phời hỗ trợ hộ khó khăn Hợp Thành 2026</strong>. Công ty phối hợp Ủy ban MTTQ Việt Nam xã Hợp Thành trao hỗ trợ cho 108 hộ dân trước dịp Quốc khánh 2/9.",
    "Mỗi hộ nhận 10 kg gạo Séng Cù và 500.000 đồng tiền mặt. Phần quà giúp các gia đình đáp ứng một số nhu cầu trước mắt; đối tượng gồm hộ nghèo, hộ cận nghèo và gia đình có hoàn cảnh khó khăn trên địa bàn xã Hợp Thành, tỉnh Lào Cai.",
    "Chương trình được tổ chức chiều 26/08 tại Nhà văn hóa thôn Xéo Tả với sự tham gia của chính quyền, MTTQ, đại diện các thôn và doanh nghiệp. Nguồn không công bố tổng kinh phí quy đổi, vì vậy bài viết giữ nguyên cơ cấu hỗ trợ theo từng hộ và không tự tính một con số tổng hợp.",
  ],
  sections: [
    {title: "Phối hợp địa phương giúp xác định đúng người thụ hưởng", paragraphs: [
      "Danh sách hộ nghèo, cận nghèo và hoàn cảnh khó khăn cần dựa trên thông tin của cơ sở. Sự tham gia của MTTQ, bí thư chi bộ và trưởng thôn giúp doanh nghiệp tiếp cận đúng gia đình, đồng thời tạo điều kiện kiểm tra công khai việc trao nhận.",
      "Cách tổ chức này đặc biệt quan trọng khi chương trình có nhiều hộ ở các khu dân cư khác nhau. Doanh nghiệp đóng góp nguồn lực, còn địa phương hỗ trợ rà soát, kết nối và theo dõi tình hình sau trao tặng.",
    ]},
    {title: "Tiền mặt và lương thực đáp ứng hai nhu cầu trước mắt", paragraphs: [
      "Gạo góp phần bảo đảm nhu cầu sinh hoạt thiết yếu, trong khi tiền mặt cho phép mỗi gia đình chủ động chi cho thuốc men, học tập hoặc những khoản cấp thiết khác. Việc công bố mức cụ thể theo hộ giúp người đọc hiểu đúng quy mô hỗ trợ.",
      "Đây là hỗ trợ dịp lễ, không phải khoản trợ cấp thường xuyên hoặc nguồn thu nhập ổn định. Các hộ có nhu cầu dài hạn vẫn cần tiếp cận chính sách giảm nghèo, sinh kế, y tế và an sinh của địa phương theo đúng điều kiện.",
    ]},
    {title: "Trách nhiệm cộng đồng gắn với địa bàn doanh nghiệp hoạt động", paragraphs: [
      "Đồng Tả Phời hoạt động tại Lào Cai, nên việc đồng hành với xã Hợp Thành góp phần củng cố quan hệ giữa doanh nghiệp, chính quyền và người dân trong khu vực. Mối quan hệ này cần được duy trì bằng trao đổi thường xuyên, minh bạch và tôn trọng nhu cầu cộng đồng.",
      "Một chương trình không thể giải quyết toàn bộ khó khăn của 108 hộ, nhưng có thể tạo hỗ trợ kịp thời và giúp cơ quan địa phương nhận diện những trường hợp cần theo dõi thêm. Ý nghĩa bền vững nằm ở khả năng kết nối nguồn lực cho các nhu cầu tiếp theo.",
    ]},
  ],
  factsTitle: "Cơ cấu hỗ trợ cho 108 hộ dân",
  actionTitle: "Những nguyên tắc giúp chương trình minh bạch",
  conclusionTitle: "Đồng hành địa phương từ những hỗ trợ xác định rõ",
  checklist: [["Rà soát danh sách", "Đối chiếu nhóm hộ thụ hưởng theo xác nhận của địa phương."], ["Công khai mức trao", "Ghi rõ 10 kg gạo và 500.000 đồng cho từng hộ."], ["Lưu xác nhận", "Có biên bản hoặc danh sách bàn giao giữa doanh nghiệp, địa phương và người nhận."], ["Kết nối dài hạn", "Giới thiệu hộ còn khó khăn tới các chương trình sinh kế, y tế hoặc chính sách phù hợp."]],
  takeaway: "Đồng Tả Phời phối hợp xã Hợp Thành hỗ trợ 108 hộ khó khăn, mỗi hộ 10 kg gạo Séng Cù và 500.000 đồng. Việc công bố rõ đối tượng, mức trao và đầu mối phối hợp giúp chương trình an sinh có thể được đối chiếu minh bạch.",
  faq: [["Có bao nhiêu hộ được hỗ trợ?", "108 hộ nghèo, hộ cận nghèo và hộ có hoàn cảnh khó khăn tại xã Hợp Thành."], ["Mỗi hộ nhận những gì?", "10 kg gạo Séng Cù và 500.000 đồng tiền mặt."], ["Chương trình diễn ra khi nào?", "Chiều 26/08/2026 tại Nhà văn hóa thôn Xéo Tả."], ["Đây có phải khoản hỗ trợ hằng tháng không?", "Không. Nguồn mô tả đây là chương trình an sinh dịp Quốc khánh 2/9."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Công ty Cổ phần đồng Tả Phời - Vinacomin trao hỗ trợ an sinh xã hội tại xã Hợp Thành nhân dịp Quốc khánh 2/9", date: "28/08/2026", url: images["dong-ta-phoi-ho-tro-108-ho-kho-khan-hop-thanh-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật chương trình Đồng Tả Phời hỗ trợ hộ khó khăn Hợp Thành 2026 và cơ cấu hỗ trợ cụ thể cho 108 gia đình.",
});

export const cuaOngVeteranSupportArticle20260829 = withImage("tuyen-than-cua-ong-ho-tro-cuu-nu-thanh-nien-xung-phong-2026", {
  updated: "2026-08-29T08:27:00+07:00",
  published: "2026-08-29T08:27:00+07:00",
  urlPath: "tin-nganh-than/2026/08/29/tuyen-than-cua-ong-ho-tro-cuu-nu-thanh-nien-xung-phong-2026",
  related: ["cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026", "than-nui-beo-ho-tro-cuu-thanh-nien-xung-phong-2026", "kho-van-cam-pha-ho-tro-cuu-thanh-nien-xung-phong-2026", "than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026"],
  section: "An sinh xã hội",
  title: "Tuyển than Cửa Ông hỗ trợ cựu nữ thanh niên xung phong khó khăn",
  description: "Tuyển than Cửa Ông trao 6 triệu đồng và thực hiện đỡ đầu cựu nữ thanh niên xung phong Nguyễn Thị Vân với mức hỗ trợ 1 triệu đồng mỗi tháng.",
  lead: "Khoản hỗ trợ dịp Quốc khánh được đặt trong chương trình đỡ đầu hằng tháng, chuyển một lần thăm hỏi thành sự đồng hành có lịch và mức hỗ trợ cụ thể đối với người có hoàn cảnh khó khăn.",
  keyword: "Tuyển than Cửa Ông hỗ trợ cựu nữ thanh niên xung phong 2026",
  keywords: ["Tuyển than Cửa Ông hỗ trợ cựu nữ thanh niên xung phong 2026", "đỡ đầu cựu thanh niên xung phong", "an sinh xã hội TKV", "phường Cửa Ông Quảng Ninh", "Đền ơn đáp nghĩa", "hỗ trợ cộng đồng ngành Than"],
  facts: [["6 triệu đồng", "Khoản hỗ trợ được trao trong chuyến thăm ngày 28/08/2026."], ["1 triệu đồng/tháng", "Mức đỡ đầu thường xuyên được công bố."], ["Từ tháng 7/2026", "Thời điểm chương trình đỡ đầu bắt đầu."], ["Một trường hợp", "Bà Nguyễn Thị Vân, cựu nữ thanh niên xung phong có hoàn cảnh khó khăn tại phường Cửa Ông."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 28/08/2026 công bố chương trình <strong>Tuyển than Cửa Ông hỗ trợ cựu nữ thanh niên xung phong 2026</strong>. Đại diện Công ty đến thăm bà Nguyễn Thị Vân và trao 6 triệu đồng nhân dịp Quốc khánh 2/9.",
    "Theo phân công của Đảng ủy Than Quảng Ninh, Công ty nhận đỡ đầu bà Vân với mức 1 triệu đồng mỗi tháng, bắt đầu từ tháng 7/2026. Cơ chế này giúp gia đình có khoản bổ sung theo lịch; trước đó, doanh nghiệp và Ban Chỉ huy quân sự phường Cửa Ông đã khảo sát hoàn cảnh.",
    "Bà Vân từng phục vụ chiến đấu bảo vệ biên giới tại khu vực Pò Hèn giai đoạn 1978–1981; hiện sức khỏe yếu và gia đình gặp nhiều khó khăn. Bài viết tôn trọng quyền riêng tư, chỉ sử dụng những thông tin hoàn cảnh đã được cơ quan phát hành công bố để làm rõ nhu cầu hỗ trợ.",
  ],
  sections: [
    {title: "Đỡ đầu thường xuyên tạo điểm tựa ổn định hơn", paragraphs: [
      "Khoản 6 triệu đồng có ý nghĩa hỗ trợ trước mắt, còn mức 1 triệu đồng mỗi tháng giúp gia đình có nguồn bổ sung theo lịch. Chương trình vì thế kết hợp chuyến thăm dịp lễ với cơ chế đồng hành đã xác định.",
      "Hỗ trợ thường xuyên vẫn cần được theo dõi và bàn giao rõ ràng để đúng người, đúng kỳ. Khi sức khỏe hoặc hoàn cảnh thay đổi, doanh nghiệp cùng địa phương có thể rà soát nhu cầu thiết thực rồi điều chỉnh hình thức phù hợp.",
    ]},
    {title: "Khảo sát trước khi hỗ trợ giúp lựa chọn đúng hoàn cảnh", paragraphs: [
      "Ban Chỉ huy quân sự phường nắm thông tin về quá trình tham gia thanh niên xung phong và điều kiện hiện tại của người được đỡ đầu. Doanh nghiệp có nguồn lực và các tổ chức đoàn thể để triển khai thăm hỏi, trao hỗ trợ, duy trì liên hệ.",
      "Sự phối hợp giúp giảm nguy cơ trùng lặp hoặc bỏ sót thông tin quan trọng. Đồng thời, người được hỗ trợ có đầu mối tại địa phương để phản ánh nhu cầu y tế, thủ tục chính sách hoặc những khó khăn vượt ngoài phạm vi của doanh nghiệp.",
    ]},
    {title: "Tri ân cần đi cùng cách truyền thông có chừng mực", paragraphs: [
      "Công bố chương trình giúp lan tỏa tinh thần Đền ơn đáp nghĩa, nhưng thông tin sức khỏe và đời sống cá nhân cần được sử dụng vừa đủ. Trọng tâm nên đặt vào trách nhiệm phối hợp và cơ chế hỗ trợ, không khai thác hoàn cảnh để tạo cảm xúc quá mức.",
      "Với cộng đồng vùng mỏ, những chương trình đỡ đầu thể hiện mối gắn bó giữa doanh nghiệp và địa phương. Tính bền vững sẽ được đánh giá qua việc duy trì đúng cam kết, thăm hỏi phù hợp và phối hợp xử lý nhu cầu phát sinh.",
    ]},
  ],
  factsTitle: "Hai lớp hỗ trợ đã được công bố",
  actionTitle: "Các bên cần duy trì chương trình như thế nào",
  conclusionTitle: "Từ thăm hỏi dịp lễ đến đồng hành thường xuyên",
  checklist: [["Duy trì đúng kỳ", "Thực hiện khoản đỡ đầu 1 triệu đồng mỗi tháng theo kế hoạch đã công bố."], ["Theo dõi nhu cầu", "Phối hợp địa phương cập nhật tình trạng sức khỏe và khó khăn thiết yếu."], ["Ghi nhận minh bạch", "Lưu xác nhận trao nhận nhưng hạn chế công khai thông tin riêng tư không cần thiết."], ["Kết nối chính sách", "Hỗ trợ gia đình tiếp cận chế độ người có công, y tế và an sinh khi đủ điều kiện."]],
  takeaway: "Tuyển than Cửa Ông trao 6 triệu đồng cho cựu nữ thanh niên xung phong Nguyễn Thị Vân và thực hiện đỡ đầu 1 triệu đồng mỗi tháng từ tháng 7/2026. Chương trình chuyển tiếp rõ ràng từ hỗ trợ dịp lễ sang cơ chế đồng hành thường xuyên.",
  faq: [["Ai là người được Công ty hỗ trợ?", "Bà Nguyễn Thị Vân, cựu nữ thanh niên xung phong tại phường Cửa Ông có hoàn cảnh khó khăn."], ["Khoản hỗ trợ ngày 28/08 là bao nhiêu?", "Công ty trao 6 triệu đồng trong chuyến thăm dịp Quốc khánh 2/9."], ["Mức đỡ đầu hằng tháng là bao nhiêu?", "1 triệu đồng mỗi tháng, bắt đầu từ tháng 7/2026 theo nguồn chính thức."], ["Đơn vị nào phối hợp xác minh hoàn cảnh?", "Công ty phối hợp Ban Chỉ huy quân sự phường Cửa Ông khảo sát và nắm thông tin gia đình."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Công ty Tuyển than Cửa Ông tặng quà hỗ trợ cựu nữ TNXP phường Cửa Ông có hoàn cảnh khó khăn", date: "28/08/2026", url: images["tuyen-than-cua-ong-ho-tro-cuu-nu-thanh-nien-xung-phong-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật chương trình Tuyển than Cửa Ông hỗ trợ cựu nữ thanh niên xung phong 2026 và cơ chế đỡ đầu thường xuyên tại địa phương.",
});

export const dailyCommunityArticles20260829 = [
  reintegrationTrainingArticle20260829,
  nuiBeoStudentSupportArticle20260829,
  daBacStemArticle20260829,
  taPhoiCommunitySupportArticle20260829,
  cuaOngVeteranSupportArticle20260829,
];
