import {dailyCommunitySourceImages20260814 as images} from "./daily-community-source-images-20260814.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const dongNguArticle20260814 = withImage("tuyen-sinh-nghe-mo-dong-ngu-2026", {
  updated: "2026-08-14T08:03:00+07:00", published: "2026-08-14T08:03:00+07:00",
  urlPath: "tin-nganh-than/2026/08/14/tuyen-sinh-nghe-mo-dong-ngu-2026",
  related: ["than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026", "tuyen-sinh-nghe-mo-thai-nguyen-2026", "than-khe-cham-nam-tuan-dao-tao-nghe-2026", "viec-lam-nganh-than-thang-8-2026"],
  section: "Kết nối địa phương",
  title: "Tuyển sinh nghề mỏ Đông Ngũ 2026: hợp tác với Than Mông Dương",
  description: "Xã Đông Ngũ, Trường Cao đẳng TKV và Than Mông Dương ký hợp tác tuyển sinh nghề mỏ, đào tạo và giải quyết việc làm giai đoạn 2026–2030.",
  lead: "Ba bên thống nhất phối hợp từ tư vấn, tuyển chọn, đào tạo tới thực tập và tiếp nhận người học đáp ứng tiêu chuẩn của doanh nghiệp.",
  keyword: "tuyển sinh nghề mỏ Đông Ngũ 2026",
  keywords: ["tuyển sinh nghề mỏ Đông Ngũ 2026", "học nghề mỏ Quảng Ninh", "việc làm Than Mông Dương", "Trường Cao đẳng TKV", "tuyển thợ lò Quảng Ninh", "đào tạo nghề cho lao động Đông Ngũ"],
  facts: [["33 hội nghị", "Số hội nghị tư vấn được Nhà trường và địa phương phối hợp tổ chức giai đoạn 2020–2025."], ["401 lao động", "Số người lao động xã Đông Ngũ đã nhập học trong giai đoạn được báo cáo."], ["377 người", "Số học viên đã tốt nghiệp theo báo cáo tại hội nghị."], ["Tối thiểu 40 người/năm", "Mục tiêu tuyển chọn, đào tạo hằng năm trong giai đoạn hợp tác mới."]],
  intro: [
    "Trường Cao đẳng Than – Khoáng sản Việt Nam ngày 12/08/2026 công bố kết quả ký kết hợp tác giữa Nhà trường, UBND xã Đông Ngũ và Công ty Cổ phần Than Mông Dương – Vinacomin. Biên bản xác lập cơ chế <strong>tuyển sinh nghề mỏ Đông Ngũ 2026</strong> và phối hợp đào tạo, giải quyết việc làm giai đoạn 2026–2030.",
    "Báo cáo tại hội nghị cho biết giai đoạn 2020–2025, Nhà trường và địa phương đã tổ chức 33 hội nghị tư vấn; 401 lao động Đông Ngũ nhập học, 377 người tốt nghiệp. Hiện có 149 lao động của xã làm việc tại Than Mông Dương.",
    "Các con số phản ánh kết quả của giai đoạn trước, còn mục tiêu mới là tuyển chọn và đào tạo tối thiểu 40 lao động mỗi năm. Khả năng tiếp nhận vẫn gắn với việc người học tốt nghiệp và đáp ứng yêu cầu về tay nghề, sức khỏe, kỷ luật lao động.",
  ],
  sections: [
    {title: "Tuyển sinh nghề mỏ Đông Ngũ 2026 có đầu mối ba bên", paragraphs: [
      "UBND xã đảm nhận tuyên truyền, rà soát và giới thiệu nguồn lao động. Trường Cao đẳng TKV phụ trách đào tạo, quản lý người học, hỗ trợ trong quá trình học và phối hợp bố trí thực tập. Than Mông Dương cung cấp thông tin tuyển dụng, tiền lương, phúc lợi và nhu cầu nhân lực.",
      "Phân công theo từng chặng giúp người lao động biết cần hỏi ai khi chuẩn bị hồ sơ, học tập hoặc thực tập. Ba đơn vị còn thống nhất trao đổi định kỳ để xử lý khó khăn phát sinh, hạn chế tình trạng người học tự xoay xở khi thông tin giữa địa phương, trường và doanh nghiệp chưa khớp.",
    ]},
    {title: "Kết quả 2020–2025 tạo căn cứ cho giai đoạn mới", paragraphs: [
      "Tỷ lệ 377 người tốt nghiệp trên 401 người nhập học cho thấy phần lớn người tham gia đã hoàn thành chương trình. Tuy nhiên, dữ liệu công bố chưa tách theo từng nghề, từng năm hoặc nguyên nhân của các trường hợp chưa tốt nghiệp; các chi tiết đó cần được hỏi trực tiếp khi tư vấn.",
      "Con số 149 lao động đang làm việc tại Than Mông Dương chứng minh một phần dòng kết nối từ địa phương tới doanh nghiệp. Số còn lại có thể làm tại đơn vị khác, chưa nhận việc hoặc thay đổi lựa chọn; bài nguồn không cung cấp đủ dữ liệu để kết luận cho từng trường hợp.",
    ]},
    {title: "Mục tiêu 40 lao động mỗi năm cần đi cùng chất lượng tư vấn", paragraphs: [
      "Mục tiêu tối thiểu 40 người mỗi năm tạo thước đo cụ thể, nhưng số lượng chỉ bền vững khi người đăng ký hiểu môi trường hầm lò, thời gian đào tạo, yêu cầu sức khỏe và cách tính thu nhập. Tư vấn cần giúp ứng viên tự đánh giá mức độ phù hợp trước khi quyết định.",
      "Gia đình cũng nên được cung cấp thông tin về nơi học, nơi thực tập, chỗ ở và đầu mối hỗ trợ. Sự chuẩn bị chung giúp người học duy trì khóa học tốt hơn, nhất là trong giai đoạn chuyển từ sinh hoạt tại địa phương sang kỷ luật học tập và làm việc theo ca ở Quảng Ninh.",
    ]},
    {title: "Tiếp nhận sau tốt nghiệp vẫn có điều kiện rõ ràng", paragraphs: [
      "Biên bản nêu Than Mông Dương tiếp nhận học viên tốt nghiệp đáp ứng tiêu chuẩn về tay nghề, sức khỏe và kỷ luật lao động. Cách diễn đạt này cần được hiểu là lộ trình có điều kiện, không phải lời hứa nhận việc cho mọi người ngay từ thời điểm đăng ký.",
      "Người lao động Đông Ngũ nên kiểm tra tiêu chuẩn ở đợt tuyển cụ thể, tham gia khám tuyển và hoàn thành chương trình nghề. Khi nhận thông tin qua mạng xã hội, cần đối chiếu với đầu mối chính thức của địa phương, Nhà trường hoặc doanh nghiệp trước khi nộp giấy tờ hay chi phí.",
    ]},
  ],
  factsTitle: "Kết quả phối hợp và mục tiêu giai đoạn mới", actionTitle: "Người lao động Đông Ngũ nên chuẩn bị gì", conclusionTitle: "Hợp tác ba bên tạo lộ trình rõ hơn từ địa phương tới việc làm",
  checklist: [["Kiểm tra điều kiện", "Đối chiếu độ tuổi, sức khỏe, học vấn và yêu cầu của nghề định đăng ký."], ["Hỏi đúng đầu mối", "Xác nhận thông tin qua xã Đông Ngũ, Trường Cao đẳng TKV hoặc Than Mông Dương."], ["Hiểu lộ trình", "Nắm nơi học, thời gian học, thực tập, khám tuyển và điều kiện tiếp nhận."], ["Giữ hồ sơ", "Lưu giấy tờ, thông báo và các khoản hỗ trợ được xác nhận bằng văn bản."]],
  takeaway: "Hợp tác Đông Ngũ – Trường Cao đẳng TKV – Than Mông Dương nối các khâu tuyển chọn, đào tạo, thực tập và tiếp nhận. Người lao động có lộ trình rõ hơn nhưng vẫn phải hoàn thành chương trình và đáp ứng tiêu chuẩn nghề nghiệp.",
  faq: [["Ba đơn vị nào ký hợp tác tuyển sinh nghề mỏ tại Đông Ngũ?", "UBND xã Đông Ngũ, Trường Cao đẳng Than – Khoáng sản Việt Nam và Công ty Cổ phần Than Mông Dương – Vinacomin."], ["Giai đoạn 2020–2025 có bao nhiêu lao động Đông Ngũ nhập học?", "Báo cáo tại hội nghị nêu 401 lao động nhập học và 377 người đã tốt nghiệp."], ["Mục tiêu tuyển chọn hằng năm là bao nhiêu?", "Ba bên phấn đấu tuyển chọn, đào tạo tối thiểu 40 lao động Đông Ngũ mỗi năm."], ["Tốt nghiệp có được tiếp nhận ngay không?", "Doanh nghiệp tiếp nhận người tốt nghiệp đáp ứng tiêu chuẩn về tay nghề, sức khỏe và kỷ luật lao động."]],
  sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Ký kết hợp tác 3 bên, mở rộng cơ hội học nghề và việc làm cho lao động xã Đông Ngũ, tỉnh Quảng Ninh", date: "12/08/2026", url: images["tuyen-sinh-nghe-mo-dong-ngu-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ tuyển sinh nghề mỏ Đông Ngũ 2026, kết quả đào tạo giai đoạn trước và điều kiện kết nối việc làm tại Than Mông Dương.",
});

export const kheChamArticle20260814 = withImage("hoc-sinh-thuc-tap-than-khe-cham-2026", {
  updated: "2026-08-14T08:04:00+07:00", published: "2026-08-14T08:04:00+07:00",
  urlPath: "tin-nganh-than/2026/08/14/hoc-sinh-thuc-tap-than-khe-cham-2026",
  related: ["than-khe-cham-nam-tuan-dao-tao-nghe-2026", "tuyen-sinh-nghe-mo-dong-ngu-2026", "tuyen-sinh-nghe-mo-thai-nguyen-2026", "dao-tao-an-toan-truoc-khi-vao-lo"],
  section: "Kết nối địa phương",
  title: "Than Khe Chàm tiếp nhận học sinh Nam Tuấn thực tập sản xuất",
  description: "Than Khe Chàm tiếp nhận học sinh xã Nam Tuấn, Cao Bằng vào giai đoạn thực tập sản xuất và hỗ trợ 1,78 triệu đồng mỗi học sinh.",
  lead: "Sau giai đoạn lý thuyết, người học được bố trí về các đơn vị sản xuất để rèn kỹ năng, tác phong công nghiệp và làm quen môi trường làm việc thực tế.",
  keyword: "học sinh thực tập Than Khe Chàm 2026",
  keywords: ["học sinh thực tập Than Khe Chàm 2026", "học nghề mỏ Nam Tuấn", "tuyển sinh nghề mỏ Cao Bằng", "thực tập sản xuất mỏ", "việc làm ngành Than", "Trường Cao đẳng TKV"],
  facts: [["12/08/2026", "Ngày Than Khe Chàm tổ chức bàn giao, tiếp nhận học sinh tại khai trường."], ["Xã Nam Tuấn", "Địa phương tại Cao Bằng của nhóm học sinh được bài nguồn phản ánh."], ["1,78 triệu đồng/người", "Khoản hỗ trợ chi phí sinh hoạt được trao cho từng học sinh."], ["Giai đoạn thực hành", "Người học đã hoàn thành phần lý thuyết trước khi về đơn vị sản xuất."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 13/08/2026 đăng thông tin về chương trình tiếp nhận <strong>học sinh thực tập Than Khe Chàm 2026</strong>. Nhóm người học đến từ xã Nam Tuấn, tỉnh Cao Bằng đã hoàn thành giai đoạn lý thuyết và bắt đầu thực tập sản xuất tại các đơn vị của Công ty.",
    "Chương trình được tổ chức sáng 12/08 tại khai trường. Đại diện Trường Cao đẳng Than – Khoáng sản Việt Nam và Than Khe Chàm động viên học sinh vận dụng kiến thức, rèn kỹ năng, tác phong công nghiệp và ý thức kỷ luật trong môi trường sản xuất thực tế.",
    "Công ty trao khoản hỗ trợ sinh hoạt 1.780.000 đồng cho mỗi học sinh. Bài nguồn mô tả khoản này gồm tiền ăn bữa ở nhà và sinh hoạt phí; đây là hỗ trợ trong đợt thực tập được công bố, không nên tự suy rộng thành mức chung của mọi doanh nghiệp hoặc khóa học.",
  ],
  sections: [
    {title: "Học sinh thực tập Than Khe Chàm 2026 chuyển từ lý thuyết sang thực hành", paragraphs: [
      "Giai đoạn thực tập giúp người học kiểm chứng kiến thức bằng công việc cụ thể. Kỹ năng nghề, cách nhận lệnh, phối hợp tổ đội, sử dụng thiết bị và báo cáo tình huống đều cần được hướng dẫn từng bước tại đơn vị tiếp nhận.",
      "Mỗi học sinh phải biết rõ người hướng dẫn, vị trí thực tập, nội quy và phạm vi công việc được phép thực hiện. Hoạt động tại khai trường cần tuân thủ quy trình an toàn; người học không tự làm nhiệm vụ vượt quá hướng dẫn hoặc chưa được xác nhận đủ điều kiện.",
    ]},
    {title: "Khoản hỗ trợ 1,78 triệu đồng giúp ổn định sinh hoạt", paragraphs: [
      "Hỗ trợ được quản đốc đơn vị tiếp nhận trao tới từng học sinh. Với người từ Cao Bằng tới Quảng Ninh, khoản tiền góp phần trang trải sinh hoạt ban đầu trong lúc làm quen lịch học, ca kíp và môi trường mới.",
      "Người học nên giữ thông báo, xác nhận khoản được nhận và hỏi rõ phạm vi chi trả. Nếu có thay đổi về lịch thực tập, chỗ ở hoặc bữa ăn, cần trao đổi với cán bộ quản lý học sinh và đơn vị tiếp nhận để tránh tự xử lý theo thông tin truyền miệng.",
    ]},
    {title: "Thực tập là cầu nối giữa đào tạo và nhu cầu nhân lực", paragraphs: [
      "Than Khe Chàm có cơ hội theo dõi khả năng vận dụng kiến thức, thái độ và mức độ thích nghi của người học. Nhà trường cũng nhận phản hồi từ sản xuất để điều chỉnh nội dung hướng dẫn, nhất là các kỹ năng cần thiết trước khi người học làm việc độc lập.",
      "Kết quả thực tập giúp cả người học và doanh nghiệp đánh giá mức độ phù hợp. Việc hoàn thành khóa học, khám tuyển và đáp ứng tiêu chuẩn tiếp nhận vẫn là các bước riêng; thực tập không đồng nghĩa đã có hợp đồng lao động chính thức.",
    ]},
    {title: "Người học từ Nam Tuấn cần giữ liên hệ ba đầu mối", paragraphs: [
      "Địa phương hỗ trợ tạo nguồn và thông tin ban đầu; Nhà trường quản lý chương trình đào tạo; doanh nghiệp tổ chức thực tập tại sản xuất. Khi có vấn đề về hồ sơ, học tập hoặc điều kiện thực tế, học sinh nên liên hệ đúng đơn vị phụ trách để được xử lý nhanh.",
      "Gia đình cần biết lịch thực tập, địa chỉ ở, số điện thoại cán bộ phụ trách và phương án di chuyển. Sự phối hợp này giúp người học ổn định tâm lý, duy trì kỷ luật và hoàn thành giai đoạn quan trọng trước khi xem xét cơ hội việc làm ngành Than.",
    ]},
  ],
  factsTitle: "Thông tin đã công bố về đợt thực tập", actionTitle: "Học sinh cần làm gì khi về đơn vị sản xuất", conclusionTitle: "Thực tập giúp người học hiểu nghề trước khi nhận việc",
  checklist: [["Nhận đầu mối", "Lưu tên, số điện thoại cán bộ Nhà trường và đơn vị trực tiếp hướng dẫn."], ["Học an toàn", "Nắm nội quy, lối thoát, phương tiện bảo vệ và cách báo cáo nguy cơ."], ["Ghi chép công việc", "Theo dõi nhiệm vụ, kỹ năng đã thực hành và nhận xét của người hướng dẫn."], ["Xác nhận hỗ trợ", "Kiểm tra khoản 1,78 triệu đồng cùng các chế độ ăn, ở áp dụng trong đợt."]],
  takeaway: "Học sinh xã Nam Tuấn đã bước vào thực tập tại Than Khe Chàm sau phần lý thuyết và nhận hỗ trợ 1,78 triệu đồng mỗi người. Giai đoạn này giúp rèn nghề, kỷ luật và đánh giá sự phù hợp trước các bước tiếp nhận lao động.",
  faq: [["Nhóm học sinh thực tập Than Khe Chàm đến từ đâu?", "Bài nguồn cho biết các học sinh đến từ xã Nam Tuấn, tỉnh Cao Bằng."], ["Học sinh được hỗ trợ bao nhiêu trong đợt thực tập?", "Than Khe Chàm trao 1.780.000 đồng cho mỗi học sinh để hỗ trợ chi phí sinh hoạt theo nội dung công bố."], ["Thực tập có nghĩa là đã được nhận việc chính thức không?", "Không. Người học còn phải hoàn thành chương trình và đáp ứng các điều kiện tiếp nhận của doanh nghiệp."], ["Mục tiêu chính của giai đoạn thực tập là gì?", "Người học vận dụng kiến thức, rèn kỹ năng nghề, tác phong công nghiệp và làm quen môi trường sản xuất."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Khe Chàm: Bàn giao, tiếp nhận và bố trí học sinh thực tập sản xuất tại các đơn vị trong Công ty", date: "13/08/2026", url: images["hoc-sinh-thuc-tap-than-khe-cham-2026"].sourceUrl}],
  seoLine: "Bài viết giải thích lộ trình học sinh thực tập Than Khe Chàm 2026, khoản hỗ trợ sinh hoạt và vai trò kết nối đào tạo với việc làm ngành Than.",
});

export const caoSonArticle20260814 = withImage("bua-com-cong-doan-than-cao-son-2026", {
  updated: "2026-08-14T08:05:00+07:00", published: "2026-08-14T08:05:00+07:00",
  urlPath: "tin-nganh-than/2026/08/14/bua-com-cong-doan-than-cao-son-2026",
  related: ["phuc-loi-tho-mo-tkv-2026", "than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026", "than-mao-khe-nghi-duong-nguoi-lao-dong-2026", "nha-o-tho-mo-quang-ninh-2026"],
  section: "An sinh xã hội",
  title: "Than Cao Sơn phục vụ 1.720 suất Bữa cơm Công đoàn",
  description: "Bữa cơm Công đoàn Than Cao Sơn phục vụ 1.720 suất cho người lao động ca 1, ca 2 tại khai trường và tổ chức mâm cơm chung ở văn phòng.",
  lead: "Suất ăn được chuyển tới nhiều vị trí trên khai trường rộng, trong khi khu văn phòng tổ chức bữa cơm quây quần để tăng kết nối giữa cán bộ và người lao động.",
  keyword: "Bữa cơm Công đoàn Than Cao Sơn 2026",
  keywords: ["Bữa cơm Công đoàn Than Cao Sơn 2026", "1.720 suất ăn thợ mỏ", "phúc lợi người lao động Than Cao Sơn", "bữa ăn ca ngành Than", "đời sống thợ mỏ", "TKV Quảng Ninh"],
  facts: [["1.720 suất", "Số suất ăn được bài nguồn ghi nhận trong chương trình."], ["Ca 1 và ca 2", "Hai ca làm việc có người lao động thụ hưởng."], ["Khai trường rộng", "Suất ăn được đưa tới các vị trí từ tầng cao tới khu vực lòng moong."], ["Mâm cơm chung", "Hình thức tổ chức tại nhà ăn văn phòng để cán bộ, người lao động cùng dùng bữa."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 13/08/2026 đăng bài về <strong>Bữa cơm Công đoàn Than Cao Sơn 2026</strong>. Chương trình phục vụ 1.720 suất ăn cho người lao động ca 1 và ca 2 tại Công ty Cổ phần Than Cao Sơn.",
    "Do địa bàn khai trường rộng, các suất ăn được chuẩn bị và chuyển tới người lao động ở nhiều vị trí sản xuất. Tại nhà ăn văn phòng, bữa ăn khay thường ngày được tổ chức thành mâm cơm để cán bộ, người lao động cùng ngồi lại và trao đổi.",
    "Chương trình là hoạt động chăm lo trong một thời điểm cụ thể. Con số 1.720 phản ánh lượt suất ăn được công bố, không phải số lao động duy nhất hay mức ăn ca cố định áp dụng cho mọi ngày làm việc.",
  ],
  sections: [
    {title: "Bữa cơm Công đoàn Than Cao Sơn 2026 đến nhiều vị trí sản xuất", paragraphs: [
      "Vận chuyển suất ăn trong khai trường lộ thiên đòi hỏi phối hợp về thời gian, phương tiện và điểm giao nhận. Thức ăn cần tới đúng ca, bảo đảm vệ sinh, nhiệt độ phù hợp và không làm gián đoạn thời gian nghỉ của người lao động.",
      "Đơn vị tổ chức nên rà soát số người thực tế theo từng điểm, kể cả nhóm làm việc xa nhà ăn. Danh sách và tuyến giao nhận rõ ràng giúp hạn chế thiếu suất, giao muộn hoặc để người lao động phải di chuyển xa trong thời gian nghỉ giữa ca.",
    ]},
    {title: "Bữa ăn ca gắn trực tiếp với sức khỏe người thợ", paragraphs: [
      "Người làm việc với máy móc, ngoài trời và theo ca cần bữa ăn đủ năng lượng, dễ sử dụng và phù hợp điều kiện sức khỏe. Chất lượng không nên đánh giá qua hình thức một ngày mà cần theo dõi khẩu phần, an toàn thực phẩm và phản hồi thường xuyên.",
      "Người lao động có thể góp ý về món ăn, giờ phục vụ, nhiệt độ và điểm nhận. Những phản hồi cụ thể giúp nhà ăn điều chỉnh tốt hơn; trường hợp có dấu hiệu mất an toàn thực phẩm cần báo ngay cho quản lý và bộ phận y tế.",
    ]},
    {title: "Mâm cơm chung tạo khoảng trao đổi ngoài công việc", paragraphs: [
      "Tại văn phòng, việc cùng dùng mâm cơm tạo không gian gần gũi hơn giữa cán bộ và người lao động. Những câu chuyện về ca làm, gia đình và sinh hoạt có thể giúp tổ chức Công đoàn nhận ra nhu cầu chưa được phản ánh qua báo cáo chính thức.",
      "Sự kết nối có giá trị khi ý kiến được ghi nhận và có phản hồi. Sau chương trình, đơn vị có thể tổng hợp góp ý về bữa ăn, điều kiện nghỉ ca và các vấn đề đời sống để chuyển thành nội dung đối thoại hoặc kế hoạch chăm lo tiếp theo.",
    ]},
    {title: "Phúc lợi cần được đánh giá bằng việc chăm lo hằng ngày", paragraphs: [
      "Bữa cơm tập thể tạo dấu ấn tinh thần, còn chất lượng phúc lợi dài hạn phụ thuộc bữa ăn ca thường xuyên, nước uống, chỗ nghỉ, bảo hộ và điều kiện vệ sinh tại nơi làm việc. Các yếu tố này cần được duy trì nhất quán giữa nhiều ca và vị trí.",
      "Người tìm hiểu việc làm tại TKV Quảng Ninh nên hỏi doanh nghiệp về cách tổ chức bữa ăn, địa điểm phục vụ và quyền lợi theo vị trí. Thông tin của Than Cao Sơn là trường hợp tại một đơn vị, không đại diện mặc định cho toàn bộ doanh nghiệp ngành Than.",
    ]},
  ],
  factsTitle: "Quy mô Bữa cơm Công đoàn đã được công bố", actionTitle: "Người lao động có thể phản hồi những gì", conclusionTitle: "Bữa ăn tốt cần đi cùng chăm lo ổn định qua từng ca",
  checklist: [["Kiểm tra suất ăn", "Phản hồi sớm khi thiếu suất, giao muộn hoặc món ăn không bảo đảm."], ["Góp ý cụ thể", "Nêu rõ ca, điểm nhận, khẩu phần và vấn đề cần điều chỉnh."], ["Theo dõi sức khỏe", "Báo bộ phận y tế nếu có dấu hiệu bất thường liên quan thực phẩm."], ["Đối chiếu quyền lợi", "Hỏi rõ chế độ ăn ca thường xuyên áp dụng cho vị trí công việc của mình."]],
  takeaway: "Than Cao Sơn phục vụ 1.720 suất Bữa cơm Công đoàn cho ca 1 và ca 2. Hoạt động có ý nghĩa gắn kết, đồng thời cho thấy bữa ăn, giao nhận và phản hồi của người lao động là phần thiết thực của điều kiện làm việc.",
  faq: [["Bữa cơm Công đoàn Than Cao Sơn có bao nhiêu suất?", "Bài nguồn ghi nhận 1.720 suất ăn được phục vụ."], ["Những ca nào được thụ hưởng?", "Chương trình phục vụ người lao động trong ca 1 và ca 2."], ["Bữa ăn được tổ chức ở đâu?", "Suất ăn được chuyển tới các vị trí trên khai trường; nhà ăn văn phòng tổ chức mâm cơm chung."], ["Đây có phải mức ăn ca cố định hằng ngày không?", "Không. Bài nguồn phản ánh chương trình Bữa cơm Công đoàn trong một đợt cụ thể."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Ấm áp Bữa cơm công đoàn Than Cao Sơn", date: "13/08/2026", url: images["bua-com-cong-doan-than-cao-son-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ quy mô Bữa cơm Công đoàn Than Cao Sơn 2026 và ý nghĩa của bữa ăn ca đối với sức khỏe, đời sống thợ mỏ.",
});

export const maoKheArticle20260814 = withImage("than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026", {
  updated: "2026-08-14T08:06:00+07:00", published: "2026-08-14T08:06:00+07:00",
  urlPath: "tin-nganh-than/2026/08/14/than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026",
  related: ["than-thong-nhat-tri-an-gia-dinh-tho-mo-hy-sinh", "than-mao-khe-nghi-duong-nguoi-lao-dong-2026", "phuc-loi-tho-mo-tkv-2026", "tkv-ho-tro-cong-dong-2026"],
  section: "An sinh xã hội",
  title: "Than Mạo Khê đỡ đầu cựu thanh niên xung phong khó khăn",
  description: "Than Mạo Khê trao hỗ trợ ban đầu 3 triệu đồng và nhận đỡ đầu nữ cựu thanh niên xung phong tại Đông Triều với mức 1.000.000 đồng hằng tháng.",
  lead: "Chương trình duy trì hỗ trợ thường xuyên qua tài khoản ngân hàng, gắn trách nhiệm xã hội của doanh nghiệp ngành Than với công tác đền ơn đáp nghĩa.",
  keyword: "Than Mạo Khê đỡ đầu cựu thanh niên xung phong 2026",
  keywords: ["Than Mạo Khê đỡ đầu cựu thanh niên xung phong 2026", "TKV hỗ trợ cộng đồng", "an sinh xã hội ngành Than", "đền ơn đáp nghĩa Đông Triều", "văn hóa thợ mỏ", "hỗ trợ thường xuyên cựu thanh niên xung phong"],
  facts: [["3 triệu đồng", "Khoản hỗ trợ ban đầu được Công ty trao cùng phần quà."], ["1.000.000 đồng hằng tháng", "Mức hỗ trợ thường xuyên Than Mạo Khê dự kiến duy trì."], ["Sinh năm 1941", "Năm sinh của nữ cựu thanh niên xung phong được nhận đỡ đầu."], ["1967–1970", "Giai đoạn bà tham gia lực lượng thanh niên xung phong theo bài nguồn."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 13/08/2026 công bố việc <strong>Than Mạo Khê đỡ đầu cựu thanh niên xung phong 2026</strong>. Đoàn công tác của Công ty đã tới thăm bà Đỗ Thị Hoàn tại phường Đông Triều, Quảng Ninh và trao hỗ trợ ban đầu 3 triệu đồng cùng phần quà.",
    "Bà Hoàn sinh năm 1941, từng tham gia đơn vị thanh niên xung phong C782-N78, P32 Quảng Ninh từ tháng 9/1967 đến tháng 12/1970. Bài nguồn cho biết bà sống đơn thân, tuổi cao, sức khỏe yếu và hiện ở cùng người thân.",
    "Than Mạo Khê dự kiến duy trì hỗ trợ 1.000.000 đồng hằng tháng, chuyển trực tiếp vào tài khoản ngân hàng của người được đỡ đầu. Cách tổ chức này tạo dòng hỗ trợ đều đặn, khác với một lần thăm hỏi riêng lẻ.",
  ],
  sections: [
    {title: "Than Mạo Khê đỡ đầu cựu thanh niên xung phong theo kế hoạch dài hạn", paragraphs: [
      "Hoạt động được triển khai theo chủ trương hỗ trợ lâu dài nữ cựu thanh niên xung phong có hoàn cảnh đặc biệt khó khăn. Việc phân công một đơn vị nhận trách nhiệm đỡ đầu tạo đầu mối theo dõi, thăm hỏi và hỗ trợ rõ ràng hơn.",
      "Khoản hỗ trợ ban đầu giải quyết nhu cầu trước mắt, còn mức 1.000.000 đồng hằng tháng tạo tính liên tục. Đơn vị cần duy trì lịch chuyển, đối chiếu việc nhận và cập nhật khi hoàn cảnh, tài khoản hoặc nhu cầu chăm sóc của người thụ hưởng thay đổi.",
    ]},
    {title: "Chuyển trực tiếp giúp khoản hỗ trợ dễ kiểm chứng", paragraphs: [
      "Hình thức chuyển qua tài khoản ngân hàng giúp lưu dấu thời gian và số tiền. Với người cao tuổi, Công ty và gia đình nên thống nhất cách kiểm tra tài khoản, hỗ trợ rút hoặc sử dụng tiền an toàn mà vẫn tôn trọng quyền quyết định của người được nhận.",
      "Thông tin cá nhân và chứng từ cần được quản lý phù hợp, tránh công khai rộng hơn mức cần thiết. Khi truyền thông về chương trình, trọng tâm nên là sự tri ân và trách nhiệm cộng đồng, không khai thác hoàn cảnh riêng tư để tạo cảm xúc quá mức.",
    ]},
    {title: "Đền ơn đáp nghĩa gắn với văn hóa Kỷ luật và Đồng tâm", paragraphs: [
      "Hoạt động tại Đông Triều nối truyền thống của thợ mỏ với sự ghi nhận người từng cống hiến trong lực lượng thanh niên xung phong. Sự tham gia của Đảng ủy, Công đoàn và chuyên môn cho thấy trách nhiệm được chia sẻ trong toàn đơn vị.",
      "Văn hóa doanh nghiệp được thể hiện rõ nhất qua cam kết có thời hạn và kết quả có thể theo dõi. Việc thăm hỏi định kỳ, nắm sức khỏe và phối hợp với địa phương sẽ giúp khoản hỗ trợ tài chính đi cùng sự quan tâm thiết thực.",
    ]},
    {title: "Trách nhiệm xã hội cần minh bạch và đúng đối tượng", paragraphs: [
      "Mỗi chương trình đỡ đầu nên xác định người thụ hưởng, mức hỗ trợ, nguồn kinh phí, thời gian và đơn vị phụ trách. Các yếu tố này giúp tập thể người lao động hiểu cách đóng góp được sử dụng và tạo niềm tin vào hoạt động an sinh.",
      "Thông tin của Than Mạo Khê phản ánh một trường hợp cụ thể tại Đông Triều. Đây không phải chế độ chung dành cho mọi cá nhân, cũng không thay thế các chính sách người có công hoặc trợ giúp xã hội do cơ quan nhà nước thực hiện.",
    ]},
  ],
  factsTitle: "Mức hỗ trợ và hoàn cảnh đã được công bố", actionTitle: "Chương trình đỡ đầu cần được duy trì thế nào", conclusionTitle: "Hỗ trợ đều đặn giúp nghĩa tình thợ mỏ đi vào đời sống",
  checklist: [["Giữ đúng lịch", "Duy trì chuyển khoản hằng tháng và xác nhận người thụ hưởng đã nhận."], ["Theo dõi nhu cầu", "Phối hợp gia đình, địa phương để cập nhật sức khỏe và hoàn cảnh thực tế."], ["Bảo vệ thông tin", "Chỉ sử dụng dữ liệu cá nhân trong phạm vi cần thiết cho chương trình."], ["Công khai trách nhiệm", "Xác định rõ đầu mối, thời gian và nguồn hỗ trợ để có thể kiểm chứng."]],
  takeaway: "Than Mạo Khê trao 3 triệu đồng ban đầu và nhận hỗ trợ một nữ cựu thanh niên xung phong 1.000.000 đồng hằng tháng. Giá trị của chương trình nằm ở cam kết đều đặn, đúng đối tượng và có đầu mối theo dõi lâu dài.",
  faq: [["Than Mạo Khê hỗ trợ ban đầu bao nhiêu?", "Công ty trao phần quà cùng khoản hỗ trợ ban đầu 3 triệu đồng."], ["Mức đỡ đầu hằng tháng là bao nhiêu?", "Bài nguồn nêu mức hỗ trợ thường xuyên 1.000.000 đồng hằng tháng."], ["Người được đỡ đầu từng tham gia thanh niên xung phong khi nào?", "Bà tham gia từ tháng 9/1967 đến tháng 12/1970 theo thông tin công bố."], ["Khoản hỗ trợ được chuyển bằng cách nào?", "Than Mạo Khê dự kiến chuyển trực tiếp vào tài khoản ngân hàng của người được hỗ trợ."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Mạo Khê nhận đỡ đầu nữ cựu Thanh niên xung phong có hoàn cảnh khó khăn", date: "13/08/2026", url: images["than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026"].sourceUrl}],
  seoLine: "Bài viết ghi nhận Than Mạo Khê đỡ đầu cựu thanh niên xung phong 2026 và cách duy trì hỗ trợ cộng đồng minh bạch, đúng đối tượng.",
});

export const dailyCommunityArticles20260814 = [dongNguArticle20260814, kheChamArticle20260814, caoSonArticle20260814, maoKheArticle20260814];
