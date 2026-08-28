import {dailyCommunitySourceImages20260827 as images} from "./daily-community-source-images-20260827.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const laiChauTrainingArticle20260827 = withImage("nam-hang-hong-thu-hop-tac-dao-tao-nghe-viec-lam-2026", {
  updated: "2026-08-28T08:15:00+07:00",
  published: "2026-08-28T08:15:00+07:00",
  urlPath: "tin-nganh-than/2026/08/28/nam-hang-hong-thu-hop-tac-dao-tao-nghe-viec-lam-2026",
  related: ["lai-chau-phoi-hop-dao-tao-nghe-tho-lo-2025-2030", "tuyen-sinh-nghe-mo-thai-nguyen-2026", "khau-vai-phoi-hop-dao-tao-nghe-viec-lam-2026", "dam-ha-than-thong-nhat-dao-tao-viec-lam-2026"],
  section: "Kết nối địa phương",
  title: "Nậm Hàng, Hồng Thu hợp tác đào tạo nghề và việc làm ngành Than",
  description: "Hai xã Nậm Hàng, Hồng Thu ở Lai Châu ký hợp tác với Trường Cao đẳng TKV và Than Thống Nhất về đào tạo nghề, tuyển dụng, việc làm giai đoạn 2026–2030.",
  lead: "Cơ chế phối hợp ba bên giúp đưa thông tin học nghề và việc làm ngành Than về tận xã, đồng thời xác định rõ trách nhiệm hỗ trợ người học từ lúc tư vấn đến sau đào tạo.",
  keyword: "Nậm Hàng Hồng Thu hợp tác đào tạo nghề 2026",
  keywords: ["Nậm Hàng Hồng Thu hợp tác đào tạo nghề 2026", "tuyển sinh nghề mỏ Lai Châu", "học nghề mỏ", "việc làm ngành Than", "Than Thống Nhất", "Trường Cao đẳng TKV"],
  facts: [["24–25/08/2026", "Hai hội nghị được tổ chức tại tỉnh Lai Châu."], ["2026–2030", "Giai đoạn hợp tác giữa địa phương, Nhà trường và doanh nghiệp."], ["23 lao động", "Số người ở Hồng Thu tham gia học nghề trong giai đoạn 2023–2025."], ["10 hội nghị", "Hoạt động tư vấn cho 97 lượt lao động Hồng Thu trong bảy tháng đầu năm 2026."]],
  intro: [
    "Trường Cao đẳng Than – Khoáng sản Việt Nam ngày 26/08/2026 công bố kết quả hai hội nghị về <strong>Nậm Hàng, Hồng Thu hợp tác đào tạo nghề 2026</strong>. Trong ngày 24 và 25/08, Nhà trường cùng Công ty Than Thống Nhất – TKV ký biên bản với UBND hai xã của tỉnh Lai Châu về đào tạo nghề, tuyển dụng và giải quyết việc làm giai đoạn 2026–2030, giảm rủi ro người dân tiếp nhận thông tin thiếu đầu mối.",
    "Hợp tác được xây dựng trên kết quả đã có nhưng cũng nhìn thẳng vào hạn chế. Nậm Hàng hiện có 6 học viên nhập học trong giai đoạn 2021–2025. Hồng Thu có 23 lao động học nghề từ 2023 đến 2025; riêng bảy tháng đầu năm 2026 đã tổ chức 10 hội nghị, tư vấn cho 97 lượt người lao động.",
    "Những con số trên phản ánh mức độ tiếp cận, không phải cam kết rằng mọi người tham dự tư vấn đều sẽ nhập học hoặc được nhận việc. Mỗi ứng viên vẫn cần đáp ứng điều kiện sức khỏe, hoàn thành chương trình và tiêu chuẩn tiếp nhận của doanh nghiệp.",
  ],
  sections: [
    {title: "Ba bên phân công trách nhiệm từ tuyển sinh đến việc làm", paragraphs: [
      "Địa phương có vai trò rà soát nhu cầu đến từng thôn, bản và đưa thông tin chính thức tới người dân. Nhà trường tư vấn nghề, tổ chức đào tạo, quản lý học viên; Than Thống Nhất cung cấp nhu cầu nhân lực, môi trường thực tập và điều kiện tiếp nhận sau đào tạo.",
      "Sự phân công này giúp người lao động biết rõ phải hỏi ai ở từng chặng của hành trình học nghề và tìm việc. Giá trị của biên bản không chỉ nằm ở lễ ký, mà ở việc ba đầu mối trao đổi thường xuyên, xử lý sớm khó khăn về hồ sơ, học tập, sinh hoạt và thực tập.",
    ]},
    {title: "Thông tin cần đi sâu hơn tới thanh niên vùng cao", paragraphs: [
      "Các bên thừa nhận hoạt động tư vấn ở một số thôn, bản chưa thường xuyên; thông tin về học nghề, việc làm và chế độ chưa đến đầy đủ với thanh niên. Khoảng cách địa lý và tâm lý ngại đi xa cũng khiến một buổi giới thiệu chung khó chuyển thành quyết định bền vững.",
      "Giải pháp được thống nhất là tư vấn trực tiếp, rà soát nhu cầu cụ thể và tạo điều kiện cho thanh niên tham quan nơi học, nơi ở, môi trường sản xuất. Khi gia đình cùng hiểu lộ trình, người đăng ký có cơ sở chuẩn bị thực tế hơn cho thời gian học và làm việc tại Quảng Ninh.",
    ]},
    {title: "Cơ hội việc làm phải đi cùng điều kiện và lựa chọn phù hợp", paragraphs: [
      "Đào tạo gắn với doanh nghiệp giúp đầu ra rõ hơn, nhưng không thay thế các bước kiểm tra đầu vào và đánh giá sau khóa học. Người lao động nên hỏi đúng nghề được tiếp nhận, thời gian đào tạo, lịch khám, điều kiện thực tập và vị trí dự kiến sau tốt nghiệp.",
      "Với người chưa từng làm mỏ, điều quan trọng là hiểu đủ môi trường ca kíp, kỷ luật an toàn và yêu cầu thể lực. Quyết định dựa trên thông tin thật sẽ tốt hơn một lựa chọn chỉ nhìn vào thu nhập hoặc lời giới thiệu ngắn hạn.",
    ]},
  ],
  factsTitle: "Kết quả và phạm vi hợp tác đã công bố",
  actionTitle: "Người lao động Lai Châu nên chuẩn bị trước khi đăng ký",
  conclusionTitle: "Phối hợp bền vững cần theo người học đến cuối lộ trình",
  checklist: [["Xác minh đúng đầu mối", "Liên hệ UBND xã, Trường Cao đẳng TKV hoặc doanh nghiệp trong chương trình."], ["Khám và khai báo sức khỏe", "Cung cấp trung thực tình trạng mắt, tim mạch, huyết áp và bệnh đang điều trị."], ["Hỏi rõ lộ trình", "Đối chiếu nơi học, thời gian đào tạo, thực tập và tiêu chuẩn tiếp nhận."], ["Chuẩn bị cho việc đi xa", "Trao đổi với gia đình về di chuyển, sinh hoạt và thời gian thích nghi tại Quảng Ninh."]],
  takeaway: "Nậm Hàng, Hồng Thu, Trường Cao đẳng TKV và Than Thống Nhất đã thiết lập cơ chế phối hợp giai đoạn 2026–2030. Cơ chế này mở rộng kênh học nghề và việc làm, còn kết quả của từng người vẫn phụ thuộc điều kiện, quá trình đào tạo và kế hoạch tiếp nhận.",
  faq: [["Những đơn vị nào ký hợp tác?", "UBND xã Nậm Hàng, UBND xã Hồng Thu, Trường Cao đẳng Than – Khoáng sản Việt Nam và Công ty Than Thống Nhất – TKV tham gia hai biên bản tại từng xã."], ["Hợp tác kéo dài đến khi nào?", "Giai đoạn được công bố là từ năm 2026 đến năm 2030."], ["Tham gia tư vấn có đồng nghĩa chắc chắn được nhận việc không?", "Không. Ứng viên vẫn phải đạt điều kiện, hoàn thành đào tạo và đáp ứng tiêu chuẩn của doanh nghiệp."], ["Người dân được hỗ trợ ở những chặng nào?", "Các bên phối hợp tư vấn, tuyển sinh, quản lý học viên, thực tập, xử lý khó khăn và bố trí việc làm phù hợp sau đào tạo."]],
  sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Trường Cao đẳng Than – Khoáng sản Việt Nam ký kết hợp tác đào tạo nghề, giải quyết việc làm với xã Nậm Hàng và xã Hồng Thu tỉnh Lai Châu", date: "26/08/2026", url: images["nam-hang-hong-thu-hop-tac-dao-tao-nghe-viec-lam-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ cách Nậm Hàng, Hồng Thu hợp tác đào tạo nghề 2026 với Trường Cao đẳng TKV và Than Thống Nhất.",
});

export const duongHuyWorkerRightsArticle20260827 = withImage("than-duong-huy-giam-sat-che-do-nguoi-lao-dong-2026", {
  updated: "2026-08-27T08:22:00+07:00",
  published: "2026-08-27T08:22:00+07:00",
  urlPath: "tin-nganh-than/2026/08/27/than-duong-huy-giam-sat-che-do-nguoi-lao-dong-2026",
  related: ["than-duong-huy-phuc-loi-gia-dinh-tho-lo-2026", "than-duong-huy-khu-tap-the-cong-nhan-2026", "than-duong-huy-ho-tro-con-cong-nhan-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Dương Huy giám sát chế độ và điều kiện làm việc",
  description: "Ban Thanh tra nhân dân TKV kiểm tra chế độ người lao động, bếp ăn, nhà tắm và việc bố trí công việc theo sức khỏe tại Than Dương Huy ngày 25/8/2026.",
  lead: "Một chính sách chỉ thực sự có giá trị khi được kiểm tra tại nơi người lao động ăn, nghỉ và làm việc; đợt giám sát giúp làm rõ phần thực thi ấy tại Than Dương Huy.",
  keyword: "Than Dương Huy giám sát chế độ người lao động 2026",
  keywords: ["Than Dương Huy giám sát chế độ người lao động 2026", "điều kiện làm việc thợ mỏ", "bếp ăn công nhân", "phúc lợi thợ mỏ", "Công đoàn TKV", "việc làm ngành Than"],
  facts: [["25/08/2026", "Ngày Ban Thanh tra nhân dân TKV làm việc tại Công ty."], ["6 tháng đầu năm", "Khoảng thời gian báo cáo về chế độ, việc làm và đời sống người lao động."], ["Ba điểm kiểm tra", "Hồ sơ thực phẩm, nhà ăn tại khai trường và nhà tắm công nhân."], ["Sau khám định kỳ", "Đoàn đề nghị bố trí công việc phù hợp với tình trạng sức khỏe."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 26/08/2026 thông tin về chương trình <strong>Than Dương Huy giám sát chế độ người lao động 2026</strong>. Ban Thanh tra nhân dân TKV đã làm việc tại Công ty ngày 25/08, kiểm tra việc thực hiện chính sách, điều kiện sinh hoạt và các nội dung chăm lo trong sáu tháng đầu năm để giảm rủi ro quyền lợi chỉ dừng ở hồ sơ.",
    "Đoàn kiểm tra báo cáo, hồ sơ và sổ sách, sau đó trực tiếp khảo sát bếp ăn tập thể ở khai trường, quy trình nhập, xuất, bảo quản, sử dụng thực phẩm, chế độ bồi dưỡng và nhà tắm công nhân.",
    "Nguồn chính thức đánh giá nhiều nội dung được tổ chức bài bản, đồng thời yêu cầu tiếp tục kiểm soát chất lượng chương trình nghỉ dưỡng và bố trí công việc phù hợp với sức khỏe sau khám định kỳ. Kết quả cho thấy đoàn đã đối chiếu chính sách với cách thực hiện trong đời sống hằng ngày.",
  ],
  sections: [
    {title: "Kiểm tra tại hiện trường làm rõ chất lượng phúc lợi", paragraphs: [
      "Với công nhân làm việc theo ca, chất lượng bữa ăn, an toàn thực phẩm và điều kiện vệ sinh sau ca ảnh hưởng trực tiếp đến khả năng phục hồi. Vì vậy, kiểm tra nhà ăn và nhà tắm là phần thiết thực của giám sát quyền lợi, không phải nội dung phụ bên cạnh hồ sơ.",
      "Quy trình thực phẩm cần được theo dõi từ khâu nhập đến bảo quản và sử dụng. Những dấu vết vận hành này giúp đối chiếu giữa tiêu chuẩn đã ban hành với suất ăn người lao động thực tế nhận được tại khai trường.",
    ]},
    {title: "Sức khỏe phải được dùng để điều chỉnh công việc", paragraphs: [
      "Đoàn đề nghị Công ty quan tâm bố trí công việc phù hợp với tình trạng sức khỏe sau khám định kỳ. Kết quả khám phát huy ý nghĩa khi được chuyển thành tư vấn, theo dõi và sắp xếp lao động hợp lý.",
      "Người lao động nên đọc kết luận khám, hỏi bộ phận y tế hoặc quản lý khi chưa hiểu, đồng thời báo sớm dấu hiệu bất thường. Việc che giấu tình trạng sức khỏe có thể làm tăng rủi ro cho chính người lao động và tổ sản xuất.",
    ]},
    {title: "Giám sát thường xuyên củng cố quan hệ lao động", paragraphs: [
      "Hoạt động kiểm tra tạo một kênh phản hồi giữa người lao động, doanh nghiệp và tổ chức Công đoàn. Kết quả tốt cần được duy trì, còn kiến nghị phải có đầu mối theo dõi để tránh dừng ở biên bản.",
      "Với người đang tìm hiểu việc làm ngành Than, điều kiện ăn ở và chăm sóc sức khỏe nên được xem cùng yêu cầu nghề, ca kíp, an toàn và thu nhập theo kết quả lao động. Một đợt giám sát cụ thể không đồng nghĩa mọi đơn vị đều có chế độ hoàn toàn giống nhau.",
    ]},
  ],
  factsTitle: "Các nội dung được kiểm tra tại Than Dương Huy",
  actionTitle: "Người lao động nên làm gì để bảo vệ quyền lợi",
  conclusionTitle: "Chăm lo có chiều sâu bắt đầu từ thực thi và phản hồi",
  checklist: [["Giữ thông tin rõ ràng", "Đọc thông báo về chế độ, đối tượng và thời gian áp dụng tại đơn vị."], ["Phản ánh đúng kênh", "Trao đổi với quản lý, Công đoàn hoặc bộ phận phụ trách khi điều kiện thực tế chưa phù hợp."], ["Theo dõi sức khỏe", "Lưu kết quả khám và thực hiện khuyến nghị chuyên môn."], ["Không suy rộng", "Đối chiếu quyền lợi tại đúng công ty, chương trình và thời điểm của mình."]],
  takeaway: "Ban Thanh tra nhân dân TKV đã kiểm tra hồ sơ và điều kiện thực tế tại Than Dương Huy, đồng thời đề nghị gắn kết quả khám sức khỏe với bố trí việc làm. Đợt giám sát cho thấy phúc lợi cần được đo bằng chất lượng thực thi tại nơi làm việc.",
  faq: [["Đợt giám sát diễn ra khi nào?", "Ngày 25/08/2026 tại Công ty Than Dương Huy – TKV."], ["Đoàn đã kiểm tra những gì?", "Hồ sơ, sổ sách, quy trình thực phẩm, bếp ăn tại khai trường, nhà tắm và một số chế độ chăm lo người lao động."], ["Kiến nghị nào liên quan trực tiếp đến sức khỏe?", "Đoàn đề nghị quan tâm bố trí công việc phù hợp với tình trạng sức khỏe sau khám định kỳ."], ["Kết quả này có phải chế độ chung cho mọi đơn vị TKV không?", "Không. Bài nguồn phản ánh đợt giám sát cụ thể tại Than Dương Huy."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Ban Thanh tra nhân dân TKV giám sát việc thực hiện chế độ người lao động tại Than Dương Huy", date: "26/08/2026", url: images["than-duong-huy-giam-sat-che-do-nguoi-lao-dong-2026"].sourceUrl}],
  seoLine: "Bài viết phân tích đợt Than Dương Huy giám sát chế độ người lao động 2026 và ý nghĩa của kiểm tra điều kiện làm việc thực tế.",
});

export const thongNhatOccupationalHealthArticle20260827 = withImage("than-thong-nhat-kham-suc-khoe-lao-dong-nang-nhoc-2026", {
  updated: "2026-08-27T08:24:00+07:00",
  published: "2026-08-27T08:24:00+07:00",
  urlPath: "tin-nganh-than/2026/08/27/than-thong-nhat-kham-suc-khoe-lao-dong-nang-nhoc-2026",
  related: ["than-thong-nhat-nghi-duong-cuoi-tuan-nguoi-lao-dong-2026", "than-thong-nhat-cap-ao-bao-ho-mua-dong-2026", "than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026", "dao-tao-an-toan-truoc-khi-vao-lo"],
  section: "An sinh xã hội",
  title: "Than Thống Nhất khám sức khỏe cho lao động nặng nhọc, độc hại",
  description: "Than Thống Nhất tổ chức khám định kỳ, khám bệnh nghề nghiệp và tư vấn sức khỏe tâm lý cho các nhóm lao động có điều kiện công việc đặc thù năm 2026.",
  lead: "Đợt khám kết hợp kiểm tra thể chất, bệnh nghề nghiệp và sức khỏe tâm lý, tạo dữ liệu để phát hiện sớm nguy cơ và xây dựng kế hoạch bảo vệ người lao động.",
  keyword: "Than Thống Nhất khám sức khỏe người lao động 2026",
  keywords: ["Than Thống Nhất khám sức khỏe người lao động 2026", "khám bệnh nghề nghiệp thợ mỏ", "lao động nặng nhọc độc hại", "sức khỏe tâm lý công nhân", "phúc lợi thợ mỏ", "an toàn lao động mỏ"],
  facts: [["Lần I năm 2026", "Đợt khám sức khỏe định kỳ được nguồn chính thức công bố."], ["Nhiều nhóm lao động", "Công nhân làm việc nặng nhọc, độc hại, lái xe và chế biến thực phẩm."], ["Hô hấp nghề nghiệp", "Có chụp X-quang tim phổi và đo chức năng hô hấp cho nhóm phù hợp."], ["Tư vấn tâm lý", "Nội dung được bổ sung trong đợt khám năm nay."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 26/08/2026 đăng thông tin về chương trình <strong>Than Thống Nhất khám sức khỏe người lao động 2026</strong>. Đợt khám định kỳ lần I dành cho công nhân, cán bộ làm việc trong điều kiện nặng nhọc, độc hại; lái xe ô tô và người trực tiếp tham gia chế biến thực phẩm.",
    "Công ty đồng thời tổ chức khám phát hiện bệnh nghề nghiệp và khám định kỳ bệnh nghề nghiệp tại cơ sở lao động. Nội dung được điều chỉnh theo từng nhóm công việc, từ xét nghiệm cơ bản, siêu âm đến kiểm tra chuyên khoa hô hấp, X-quang tim phổi và đo chức năng hô hấp.",
    "Năm nay, đợt khám bổ sung nội dung tư vấn, chăm sóc sức khỏe tâm lý dành cho người lao động. Cách tiếp cận này mở rộng phạm vi bảo vệ từ phát hiện tổn thương thể chất sang nhận diện trạng thái tinh thần ảnh hưởng đến khả năng làm việc an toàn và gắn bó lâu dài.",
  ],
  sections: [
    {title: "Khám theo nguy cơ của từng vị trí công việc", paragraphs: [
      "Khám sức khỏe nghề nghiệp cần bắt đầu từ yếu tố tiếp xúc của công việc. Người làm trong môi trường độc hại được kiểm tra hô hấp sâu hơn; nhóm chế biến thực phẩm có xét nghiệm chuyên môn theo yêu cầu; lao động nữ trong môi trường nặng nhọc, độc hại được tư vấn sản phụ khoa và sức khỏe sinh sản.",
      "Sự phân nhóm giúp đợt khám đi xa hơn một bộ chỉ số chung. Tuy nhiên, kết quả sàng lọc không tự thay thế chẩn đoán hoặc điều trị. Người có chỉ số bất thường cần thực hiện hướng dẫn tiếp theo của cơ sở y tế.",
    ]},
    {title: "Kết quả khám cần trở thành kế hoạch chăm sóc", paragraphs: [
      "Sau đợt khám, Trạm y tế Công ty sẽ rà soát, phân loại sức khỏe và thông tin những vấn đề người lao động cần lưu ý. Đây là bước nối quan trọng giữa kiểm tra định kỳ với phòng ngừa bệnh và hạn chế biến chứng.",
      "Dữ liệu tổng hợp cũng là cơ sở để doanh nghiệp xây dựng kế hoạch chăm sóc và bảo vệ sức khỏe. Giá trị của hoạt động sẽ rõ hơn nếu khuyến nghị được theo dõi, người lao động được bố trí phù hợp và nguy cơ tại nơi làm việc tiếp tục được kiểm soát.",
    ]},
    {title: "Sức khỏe tâm lý gắn với an toàn và khả năng bám nghề", paragraphs: [
      "Công việc theo ca và môi trường sản xuất đặc thù có thể tạo áp lực về giấc ngủ, tâm lý và quan hệ gia đình. Tư vấn tâm lý giúp người lao động nhận biết sớm khó khăn, tìm đầu mối hỗ trợ phù hợp và hạn chế căng thẳng kéo dài.",
      "Người đang cân nhắc nghề mỏ cần hiểu chăm sóc sức khỏe là quá trình liên tục, gồm khám tuyển đầu vào, tuân thủ bảo hộ, khám định kỳ và báo cáo trung thực triệu chứng. Một chương trình khám không loại bỏ mọi nguy cơ, nhưng giúp nhận diện và quản lý nguy cơ có hệ thống hơn.",
    ]},
  ],
  factsTitle: "Các nhóm khám và nội dung nổi bật",
  actionTitle: "Người lao động nên làm gì sau đợt khám",
  conclusionTitle: "Phát hiện sớm chỉ có ý nghĩa khi được theo dõi đến cùng",
  checklist: [["Nhận kết quả", "Kiểm tra phân loại sức khỏe và các chỉ số cần lưu ý."], ["Hỏi khi chưa rõ", "Trao đổi với bộ phận y tế về khuyến nghị, lịch tái khám hoặc xét nghiệm tiếp theo."], ["Báo triệu chứng sớm", "Không chờ đến kỳ khám sau nếu có dấu hiệu bất thường."], ["Giữ thói quen bảo vệ sức khỏe", "Tuân thủ bảo hộ, nghỉ ngơi và hướng dẫn chuyên môn phù hợp với công việc."]],
  takeaway: "Than Thống Nhất tổ chức khám định kỳ và bệnh nghề nghiệp theo nhóm nguy cơ, đồng thời bổ sung tư vấn tâm lý. Kết quả được dùng để phân loại, thông tin cho người lao động và xây dựng kế hoạch chăm sóc trong thời gian tới.",
  faq: [["Những ai thuộc đợt khám được công bố?", "Các nhóm gồm lao động nặng nhọc, độc hại; lái xe ô tô; người trực tiếp chế biến thực phẩm và các đối tượng theo kế hoạch của Công ty."], ["Nhóm làm việc trong môi trường độc hại được kiểm tra gì?", "Nguồn nêu khám hô hấp nghề nghiệp, chụp X-quang tim phổi kỹ thuật số và đo chức năng hô hấp."], ["Đợt khám có nội dung sức khỏe tâm lý không?", "Có. Tư vấn và chăm sóc sức khỏe tâm lý là nội dung được bổ sung trong năm nay."], ["Kết quả khám được xử lý thế nào?", "Trạm y tế Công ty rà soát, phân loại và thông tin để người lao động chủ động phòng ngừa, theo dõi."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Thống Nhất chăm lo sức khỏe người lao động làm việc trong điều kiện nặng nhọc, độc hại", date: "26/08/2026", url: images["than-thong-nhat-kham-suc-khoe-lao-dong-nang-nhoc-2026"].sourceUrl}],
  seoLine: "Bài viết giải thích chương trình Than Thống Nhất khám sức khỏe người lao động 2026 và ý nghĩa của khám bệnh nghề nghiệp theo nhóm nguy cơ.",
});

export const dailyCommunityArticles20260827 = [
  laiChauTrainingArticle20260827,
  duongHuyWorkerRightsArticle20260827,
  thongNhatOccupationalHealthArticle20260827,
];
