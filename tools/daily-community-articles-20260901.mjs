import {dailyCommunitySourceImages20260901 as images} from "./daily-community-source-images-20260901.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, sourceImageChecksum: image.verifiedSha256, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const namTuanClassOpeningArticle20260901 = withImage("nam-tuan-khai-giang-lop-nghe-mo-30-hoc-vien-2026", {
  updated: "2026-09-01T08:45:00+07:00",
  published: "2026-09-01T08:45:00+07:00",
  urlPath: "tin-nganh-than/2026/09/01/nam-tuan-khai-giang-lop-nghe-mo-30-hoc-vien-2026",
  related: ["nam-tuan-cao-bang-dao-tao-nghe-mo-viec-lam", "hoc-sinh-thuc-tap-than-khe-cham-2026", "dien-xa-than-khe-cham-hop-tac-dao-tao-viec-lam", "khau-vai-phoi-hop-dao-tao-nghe-viec-lam-2026"],
  section: "Kết nối địa phương",
  title: "Nam Tuấn khai giảng lớp nghề mỏ cho 30 học viên",
  description: "Xã Nam Tuấn, Trường Cao đẳng TKV và Than Khe Chàm khai giảng lớp nghề mỏ 30 học viên, sau 68 cuộc tư vấn trực tiếp tại 39 xóm.",
  lead: "Từ biên bản hợp tác ba bên đến một lớp học cụ thể, Nam Tuấn cho thấy tuyển sinh nghề mỏ hiệu quả cần thông tin đến tận hộ dân và một lộ trình học – thực tập – việc làm rõ ràng.",
  keyword: "Nam Tuấn khai giảng lớp nghề mỏ 2026",
  keywords: ["Nam Tuấn khai giảng lớp nghề mỏ 2026", "tuyển sinh nghề mỏ Cao Bằng", "30 học viên nghề mỏ", "Than Khe Chàm tuyển dụng", "Trường Cao đẳng TKV", "việc làm ngành Than"],
  facts: [["30 học viên", "Quy mô lớp HSC7HB-K14 được khai giảng theo kế hoạch."], ["13 đoàn công tác", "Các nhóm của xã trực tiếp tuyên truyền, tư vấn tới người dân."], ["39/39 xóm", "Phạm vi địa bàn được triển khai sau khi ký hợp tác ba bên."], ["68 cuộc tư vấn", "Hoạt động trực tiếp tiếp cận 189 lượt người trước ngày khai giảng."]],
  intro: [
    "Ngày 06/06/2026, UBND xã Nam Tuấn, tỉnh Cao Bằng, Trường Cao đẳng Than – Khoáng sản Việt Nam và Công ty Than Khe Chàm – TKV tổ chức khai giảng lớp HSC7HB-K14 cho lao động địa phương. Lớp <strong>Nam Tuấn khai giảng lớp nghề mỏ 2026</strong> có 30 học viên, là kết quả triển khai tiếp theo của biên bản hợp tác đào tạo nghề gắn với giải quyết việc làm giai đoạn 2026–2030; người học vẫn cần hoàn thành từng yêu cầu của khóa đào tạo và thực tập.",
    "Sau hơn một tháng phối hợp, xã thành lập 13 đoàn công tác xuống đủ 39 xóm. Tổng cộng 68 cuộc tuyên truyền trực tiếp tiếp cận 189 lượt người; đến ngày 04/06 có 32 lao động đăng ký và lớp được mở với 30 học viên theo kế hoạch.",
    "Các con số phản ánh kết quả tuyển sinh của riêng đợt này. Chúng không có nghĩa mọi lao động được tư vấn đều phù hợp với nghề, cũng không thay thế điều kiện sức khỏe, kết quả học tập và tiêu chuẩn tiếp nhận tại doanh nghiệp.",
  ],
  sections: [
    {title: "Tuyển sinh đi từ từng xóm đến lớp học thực tế", paragraphs: [
      "Mô hình tại Nam Tuấn đưa thông tin tuyển sinh đến từng khu dân cư, vượt khỏi cách chỉ chuyển tiếp thông báo. Nhà trường và Than Khe Chàm cùng địa phương giải đáp về nghề học, điều kiện đào tạo, môi trường làm việc và chính sách liên quan.",
      "Cách làm này cho phép người lao động và gia đình hỏi trực tiếp trước khi quyết định đi học xa. Với nghề mỏ hầm lò, những nội dung cần trao đổi thẳng gồm yêu cầu sức khỏe, kỷ luật an toàn, thời gian học, nơi ở, thực tập sản xuất và điều kiện được doanh nghiệp tiếp nhận.",
    ]},
    {title: "Lộ trình học, thực tập và việc làm được nối thành chuỗi", paragraphs: [
      "Theo kế hoạch công bố, học viên bắt đầu bằng phần định hướng nghề nghiệp tại địa phương, sau đó học tập trung tại Trường Cao đẳng TKV và thực tập sản xuất ở Than Khe Chàm. Ba khâu do ba đầu mối phối hợp giúp người học hiểu ai chịu trách nhiệm ở từng giai đoạn.",
      "Thực tập sản xuất là bước chuyển cần thiết từ môi trường học tập sang kỷ luật và yêu cầu của dây chuyền sản xuất. Người học cần theo dõi kết quả rèn luyện, yêu cầu an toàn và tiêu chuẩn vị trí việc làm; việc khai giảng chưa bảo đảm chắc chắn có hợp đồng sau khóa học.",
    ]},
    {title: "Ý nghĩa nằm ở khả năng theo dõi tới cuối khóa", paragraphs: [
      "Một lớp học mở được là kết quả ban đầu; hiệu quả dài hơn cần được đo bằng số học viên duy trì học tập, hoàn thành thực tập và đáp ứng yêu cầu tuyển dụng. Địa phương cũng cần tiếp tục là cầu nối khi học viên gặp khó khăn về thích nghi, đi lại hoặc thông tin với gia đình.",
      "Đối với lao động Cao Bằng đang cân nhắc nghề mỏ, sự kiện Nam Tuấn tạo thêm một kênh chính thức để kiểm tra thông tin. Quyết định phù hợp vẫn phải dựa trên sức khỏe cá nhân, hoàn cảnh gia đình và hồ sơ của đúng khóa tuyển sinh.",
    ]},
  ],
  factsTitle: "Kết quả tuyển sinh trước ngày khai giảng",
  actionTitle: "Người học và gia đình nên xác minh",
  conclusionTitle: "Khai giảng là điểm bắt đầu, không phải điểm kết thúc",
  checklist: [["Kiểm tra đúng lớp", "Xác nhận mã lớp, nghề học, địa điểm và thời gian đào tạo."], ["Hoàn tất đánh giá sức khỏe", "Đối chiếu tiêu chuẩn của nghề dự kiến theo học trước khi cam kết."], ["Nắm rõ giai đoạn thực tập", "Hỏi thời điểm, đơn vị, tiêu chí đánh giá và chế độ trong thời gian thực tập."], ["Xác nhận điều kiện tiếp nhận", "Không hiểu việc tham gia lớp học là cam kết việc làm vô điều kiện."]],
  takeaway: "Lớp HSC7HB-K14 biến thỏa thuận ba bên ở Nam Tuấn thành hoạt động đào tạo cụ thể cho 30 học viên. Giá trị của mô hình sẽ rõ hơn khi các bên tiếp tục theo sát quá trình học, thực tập và khả năng đáp ứng tiêu chuẩn việc làm.",
  faq: [["Lớp nghề tại Nam Tuấn có bao nhiêu học viên?", "Lớp HSC7HB-K14 được khai giảng với 30 học viên theo kế hoạch."], ["Trước khai giảng, người dân được tư vấn thế nào?", "Xã thành lập 13 đoàn xuống 39/39 xóm; 68 cuộc trực tiếp tiếp cận 189 lượt người."], ["Học viên sẽ học và thực tập ở đâu?", "Kế hoạch gồm định hướng tại địa phương, học tập trung ở Trường Cao đẳng TKV và thực tập tại Than Khe Chàm."], ["Tham gia lớp có chắc chắn được nhận việc không?", "Không thể suy ra như vậy. Học viên vẫn phải hoàn thành đào tạo, thực tập và đáp ứng tiêu chuẩn tiếp nhận của doanh nghiệp."]],
  sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Khai giảng lớp đào tạo nghề cho lao động xã Nam Tuấn: Dấu ấn phối hợp hiệu quả giữa Nhà trường – Doanh nghiệp – Địa phương", date: "10/06/2026", url: images["nam-tuan-khai-giang-lop-nghe-mo-30-hoc-vien-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật lớp nghề mỏ 30 học viên tại Nam Tuấn và làm rõ lộ trình từ tư vấn, đào tạo đến thực tập ở Than Khe Chàm.",
});

export const duongHuyRecruitmentPlanArticle20260901 = withImage("than-duong-huy-tuyen-sinh-nghe-mo-5-thang-cuoi-2026", {
  updated: "2026-09-01T08:45:00+07:00",
  published: "2026-09-01T08:45:00+07:00",
  urlPath: "tin-nganh-than/2026/09/01/than-duong-huy-tuyen-sinh-nghe-mo-5-thang-cuoi-2026",
  related: ["than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026", "truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026", "than-duong-huy-khu-tap-the-cong-nhan-2026", "than-duong-huy-giam-sat-che-do-nguoi-lao-dong-2026"],
  section: "Kết nối địa phương",
  title: "Than Dương Huy đẩy mạnh tuyển sinh nghề mỏ cuối năm 2026",
  description: "Than Dương Huy triển khai đồng bộ công tác tuyển sinh nghề mỏ trong 5 tháng cuối năm 2026 nhằm chủ động nguồn lao động trực tiếp cho sản xuất.",
  lead: "Trong 5 tháng cuối năm 2026, Than Dương Huy tập trung tuyển sinh nghề mỏ để chủ động lao động trực tiếp; ứng viên cần đối chiếu ngành học, tiêu chuẩn sức khỏe và điều kiện tiếp nhận của đúng đợt.",
  keyword: "Than Dương Huy tuyển sinh nghề mỏ cuối năm 2026",
  keywords: ["Than Dương Huy tuyển sinh nghề mỏ cuối năm 2026", "tuyển sinh nghề mỏ Quảng Ninh", "học nghề thợ lò", "nguồn nhân lực ngành Than", "việc làm Than Dương Huy", "Trường Cao đẳng TKV"],
  facts: [["5 tháng cuối năm", "Khoảng thời gian trọng tâm được Than Dương Huy xác định cho kế hoạch tuyển sinh."], ["Lao động trực tiếp", "Nhóm nhân lực sản xuất được bài công bố nhấn mạnh."], ["Nhiều giải pháp", "Công ty kết hợp nhiều giải pháp trong cùng kế hoạch tuyển sinh."], ["07/08/2026", "Ngày TKV đăng thông tin chính thức về kế hoạch."]],
  intro: [
    "Công ty Than Dương Huy – TKV đang tập trung nhiều giải pháp cho công tác tuyển sinh nghề mỏ trong 5 tháng cuối năm. Kế hoạch <strong>Than Dương Huy tuyển sinh nghề mỏ cuối năm 2026</strong> được đặt trong nhu cầu chủ động lực lượng lao động trực tiếp phục vụ sản xuất.",
    "Thông tin chính thức nhấn mạnh cách triển khai đồng bộ và quyết liệt, nhưng phần đã xác minh chưa nêu một mức tiền cụ thể hoặc điều kiện tiếp nhận vô điều kiện. Vì vậy người quan tâm cần căn cứ hồ sơ tuyển sinh, ngành học và thông báo tuyển dụng của đúng đợt.",
    "Tuyển đủ người là một phần của bài toán nhân lực. Khả năng giúp người học hiểu đúng nghề, hoàn thành đào tạo và gắn bó sau khi vào làm mới quyết định tính bền vững của nguồn thợ lò.",
  ],
  sections: [
    {title: "Kế hoạch cuối năm cần nối tuyển sinh với nhu cầu sản xuất", paragraphs: [
      "Doanh nghiệp mỏ cần xác định rõ số lượng và vị trí còn thiếu để nhà trường, địa phương tư vấn đúng đối tượng. Khi nhu cầu được chuyển thành tiêu chí sức khỏe, ngành học và thời điểm tiếp nhận cụ thể, người lao động có cơ sở tự đánh giá trước khi nộp hồ sơ.",
      "Với lao động trực tiếp, mong muốn có việc mới là điều kiện ban đầu. Ứng viên còn phải cân nhắc khả năng làm việc theo ca, tuân thủ quy trình an toàn và thích nghi với môi trường sản xuất ngay từ khâu hướng nghiệp.",
    ]},
    {title: "Thông tin phúc lợi cần đi cùng điều kiện áp dụng", paragraphs: [
      "Khu nhà ở và sân thể thao xuất hiện trong ảnh đại diện của bài chính thức cho thấy hạ tầng sinh hoạt là một phần doanh nghiệp dùng để giới thiệu môi trường làm việc. Người đăng ký nên hỏi rõ đối tượng được bố trí chỗ ở, chi phí, nội quy và thời gian được sử dụng.",
      "Tương tự, mọi thông tin về hỗ trợ học nghề, sinh hoạt hoặc thu nhập cần gắn với văn bản của khóa tuyển. Không nên lấy chính sách của một đợt, một nghề hay một nhóm lao động để mặc định áp dụng cho tất cả ứng viên.",
    ]},
    {title: "Giữ nguồn thợ lò bắt đầu từ quyết định có đủ thông tin", paragraphs: [
      "Người lao động có cơ hội gắn bó lâu hơn khi đã chuẩn bị về sức khỏe, gia đình, nơi ở và nhịp làm việc trước ngày nhập học. Địa phương, nhà trường và doanh nghiệp vì thế cần duy trì đầu mối hỗ trợ xuyên suốt, kể cả sau khi hoàn thành chỉ tiêu tuyển sinh.",
      "Đối với Than Dương Huy, kế hoạch 5 tháng cuối năm tạo một mốc điều phối nguồn nhân lực. Kết quả cần được nhìn qua số người thực học, hoàn thành đào tạo và đáp ứng công việc, đồng thời đối chiếu với số hồ sơ ban đầu.",
    ]},
  ],
  factsTitle: "Phạm vi kế hoạch tuyển sinh cuối năm",
  actionTitle: "Ứng viên cần làm rõ trước khi đăng ký",
  conclusionTitle: "Chủ động nguồn nhân lực phải đi cùng khả năng giữ người",
  checklist: [["Xác minh ngành nghề", "Hỏi đúng tên nghề, thời gian học và vị trí việc làm dự kiến."], ["Kiểm tra tiêu chuẩn sức khỏe", "Thực hiện khám theo yêu cầu của nghề, không dựa riêng vào sức khỏe tự đánh giá."], ["Làm rõ hỗ trợ", "Đối chiếu học phí, sinh hoạt, chỗ ở và điều kiện áp dụng bằng thông tin chính thức."], ["Đọc kỹ khâu tiếp nhận", "Xác nhận tiêu chuẩn sau đào tạo và không coi tuyển sinh là lời hứa việc làm tuyệt đối."]],
  takeaway: "Hiệu quả của kế hoạch sẽ được nhìn qua số người học đúng nghề, hoàn thành đào tạo và đáp ứng vị trí sản xuất. Người quan tâm nên kiểm tra đầy đủ điều kiện, không coi thông tin tuyển sinh là cam kết sẵn về việc làm hay thu nhập.",
  faq: [["Than Dương Huy tập trung tuyển sinh trong thời gian nào?", "Bài chính thức xác định trọng tâm là 5 tháng cuối năm 2026."], ["Kế hoạch hướng tới nhóm nhân lực nào?", "Thông tin nhấn mạnh nhu cầu chủ động lực lượng lao động trực tiếp cho sản xuất."], ["Ảnh đại diện thể hiện nội dung gì?", "Ảnh chính thức là khu nhà ở cùng sân thể thao của Than Dương Huy, một phần hạ tầng phục vụ người lao động."], ["Đăng ký học nghề có chắc chắn được tuyển vào Công ty không?", "Không có căn cứ khẳng định như vậy; ứng viên phải đáp ứng điều kiện của khóa học và đợt tiếp nhận thực tế."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Than Dương Huy đẩy mạnh công tác tuyển sinh nghề mỏ 5 tháng cuối năm 2026", date: "07/08/2026", url: images["than-duong-huy-tuyen-sinh-nghe-mo-5-thang-cuoi-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ kế hoạch tuyển sinh nghề mỏ cuối năm của Than Dương Huy và những điều ứng viên cần xác minh trước khi học nghề.",
});

export const returningMinersArticle20260901 = withImage("lao-dong-tai-tuyen-tro-lai-nghe-mo-tkv-2026", {
  updated: "2026-09-01T08:45:00+07:00",
  published: "2026-09-01T08:45:00+07:00",
  urlPath: "tin-nganh-than/2026/09/01/lao-dong-tai-tuyen-tro-lai-nghe-mo-tkv-2026",
  related: ["than-nui-beo-ho-tro-hoc-sinh-nghe-mo-quoc-khanh-2026", "viec-lam-nganh-than-thang-8-2026", "giu-nguon-tho-lo-tkv-tu-dia-ban-quang-ninh-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "Kết nối địa phương",
  title: "Lao động tái tuyển trở lại nghề mỏ tại TKV",
  description: "Câu chuyện lao động trở lại TKV sau thời gian làm ngành khác cho thấy thu nhập, sự ổn định và điều kiện gắn bó cần được đánh giá theo từng người, từng đơn vị.",
  lead: "Quay lại nghề mỏ là một quyết định nghề nghiệp lần hai: người lao động đã có trải nghiệm so sánh, nhưng vẫn cần kiểm tra lại sức khỏe, vị trí việc làm và chính sách tái tuyển.",
  keyword: "lao động tái tuyển trở lại nghề mỏ TKV 2026",
  keywords: ["lao động tái tuyển trở lại nghề mỏ TKV 2026", "việc làm thợ lò", "tái tuyển công nhân mỏ", "Than Núi Béo", "nguồn nhân lực ngành Than", "học nghề mỏ Quảng Ninh"],
  facts: [["04/08/2026", "Ngày TKV đăng câu chuyện về người lao động trở lại nghề mỏ."], ["Than Núi Béo", "Đơn vị có trường hợp công nhân tái tuyển được bài giới thiệu."], ["Sùng A Nhè", "Người lao động được nêu như một trường hợp cụ thể."], ["Trên 30 triệu đồng/tháng", "Mức bình quân của trường hợp trong bài, không phải mức cam kết chung."]],
  intro: [
    "TKV ghi nhận xu hướng một số lao động sau thời gian thử sức ở ngành nghề khác đã lựa chọn quay trở lại các công ty than. Bài <strong>lao động tái tuyển trở lại nghề mỏ TKV 2026</strong> nêu trường hợp anh Sùng A Nhè trở lại Công ty CP Than Núi Béo và có mức thu nhập bình quân trên 30 triệu đồng mỗi tháng.",
    "Đây là dữ liệu của một trường hợp được nguồn giới thiệu, không phải mức lương mặc định cho mọi lao động tái tuyển. Người lao động cần đối chiếu vị trí, ngày công, năng suất, điều kiện sản xuất và quy chế của từng đơn vị để hiểu con số của mình.",
    "Việc quay lại phản ánh cách người lao động đánh giá lại lựa chọn nghề nghiệp sau trải nghiệm ở ngành khác. Sự ổn định có ý nghĩa khi đi cùng khả năng đáp ứng công việc, an toàn, đời sống và kế hoạch lâu dài của gia đình.",
  ],
  sections: [
    {title: "Tái tuyển là quyết định cần đánh giá lại từ đầu", paragraphs: [
      "Kinh nghiệm làm mỏ trước đây giúp người lao động hiểu phần nào về ca kíp và kỷ luật sản xuất, nhưng thời gian rời nghề có thể làm thay đổi sức khỏe, tay nghề và điều kiện gia đình. Hồ sơ tái tuyển vì vậy vẫn cần tuân theo đánh giá của đơn vị ở thời điểm quay lại.",
      "Người có ý định trở lại nên hỏi rõ vị trí, công trường, thời gian thử việc hoặc đào tạo bổ sung, cách tính lương và yêu cầu sức khỏe. Không nên chỉ dựa vào kinh nghiệm của một đồng nghiệp hay mức thu nhập được nêu trong câu chuyện truyền thông.",
    ]},
    {title: "Thu nhập chỉ có ý nghĩa khi đọc cùng điều kiện làm việc", paragraphs: [
      "Mức trên 30 triệu đồng mỗi tháng của anh Sùng A Nhè cho thấy một trường hợp tái tuyển đạt kết quả tích cực tại Than Núi Béo. Con số này cần được hiểu trong bối cảnh cá nhân cụ thể và không tạo thành lời hứa cho ứng viên khác.",
      "Khi so sánh với công việc ở khu công nghiệp hoặc tại quê nhà, người lao động nên tính cả thời gian đi lại, ca làm, nơi ở, bảo hiểm, phúc lợi, mức độ ổn định và yêu cầu nghề. Tổng thu nhập cao hơn chưa tự động đồng nghĩa lựa chọn phù hợp hơn với mọi gia đình.",
    ]},
    {title: "Nguồn nhân lực bền vững cần cả tuyển mới và đón người trở lại", paragraphs: [
      "Tái tuyển giúp doanh nghiệp tiếp cận người đã có trải nghiệm nghề, trong khi người lao động có cơ hội sử dụng lại kỹ năng từng được đào tạo. Tuy nhiên, hiệu quả chỉ bền khi lý do từng rời việc được nhìn nhận và các điều kiện quay lại được trao đổi minh bạch.",
      "Đối với người đang học nghề mỏ, câu chuyện này cho thấy nghề nghiệp có thể được đánh giá lại qua trải nghiệm thực tế. Nhưng quyết định vào nghề lần đầu vẫn cần chuẩn bị nghiêm túc, không nên coi khả năng tái tuyển sau này là phương án thay thế cho việc tìm hiểu kỹ từ đầu.",
    ]},
  ],
  factsTitle: "Thông tin cần đọc đúng từ câu chuyện tái tuyển",
  actionTitle: "Người muốn quay lại nghề mỏ nên kiểm tra",
  conclusionTitle: "Trở lại bền vững khi kỳ vọng khớp với thực tế",
  checklist: [["Cập nhật sức khỏe", "Khám và đánh giá theo tiêu chuẩn hiện hành của vị trí dự kiến."], ["Xác nhận tay nghề", "Hỏi về đào tạo bổ sung, sát hạch hoặc thời gian làm quen trở lại."], ["So sánh toàn bộ điều kiện", "Tính cả ca kíp, nơi ở, phúc lợi và chi phí xa gia đình."], ["Không lấy mức cá nhân làm chuẩn", "Yêu cầu bảng thông tin tuyển dụng và cách tính thu nhập của đúng đơn vị."]],
  takeaway: "Trường hợp lao động trở lại Than Núi Béo cho thấy tái tuyển có thể mở lại con đường nghề nghiệp. Mức thu nhập trong bài chỉ phản ánh một cá nhân; người khác cần đánh giá hồ sơ, sức khỏe và điều kiện làm việc của chính mình.",
  faq: [["Bài TKV nêu trường hợp tái tuyển ở đơn vị nào?", "Nguồn giới thiệu anh Sùng A Nhè trở lại làm việc tại Công ty CP Than Núi Béo."], ["Mức trên 30 triệu đồng có áp dụng cho mọi người tái tuyển không?", "Không. Đây chỉ là mức bình quân của trường hợp được nêu; ứng viên khác phải đối chiếu vị trí và quy chế của đơn vị."], ["Người từng làm mỏ có phải khám lại khi tái tuyển không?", "Tiêu chuẩn cụ thể do đơn vị tuyển dụng xác định; người lao động nên chuẩn bị đánh giá sức khỏe theo yêu cầu hiện hành."], ["Tái tuyển có cần đào tạo lại không?", "Điều này phụ thuộc thời gian rời nghề, vị trí và quy định của đơn vị; ứng viên cần hỏi rõ về đào tạo bổ sung hoặc sát hạch."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Trở lại nghề mỏ - Lựa chọn từ sự ổn định và niềm tin", date: "04/08/2026", url: images["lao-dong-tai-tuyen-tro-lai-nghe-mo-tkv-2026"].sourceUrl}],
  seoLine: "Bài viết phân tích câu chuyện lao động tái tuyển trở lại nghề mỏ TKV và cách đọc đúng thông tin thu nhập, điều kiện làm việc.",
});

export const dailyCommunityArticles20260901 = [
  namTuanClassOpeningArticle20260901,
  duongHuyRecruitmentPlanArticle20260901,
  returningMinersArticle20260901,
];
