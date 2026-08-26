import {dailyCommunitySourceImages20260826 as images} from "./daily-community-source-images-20260826.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const khauVaiTrainingArticle20260826 = withImage("khau-vai-phoi-hop-dao-tao-nghe-viec-lam-2026", {
  updated: "2026-08-26T08:23:00+07:00",
  published: "2026-08-26T08:23:00+07:00",
  urlPath: "tin-nganh-than/2026/08/26/khau-vai-phoi-hop-dao-tao-nghe-viec-lam-2026",
  related: ["tuyen-sinh-nghe-mo-thai-nguyen-2026", "tuyen-sinh-nghe-mo-dong-ngu-2026", "than-khe-cham-tiep-nhan-hoc-sinh-thuc-tap-2026", "viec-lam-nganh-than-thang-8-2026"],
  section: "Kết nối địa phương",
  title: "Khâu Vai phối hợp đào tạo nghề mỏ, kết nối việc làm ngành Than",
  description: "Xã Khâu Vai, Trường Cao đẳng TKV và Than Khe Chàm đánh giá phối hợp tuyển sinh, đào tạo nghề mỏ và kết nối việc làm giai đoạn 2026–2030.",
  lead: "Liên kết địa phương – Nhà trường – doanh nghiệp đưa người lao động Khâu Vai đến gần thông tin thật về học nghề mỏ, thực tập và việc làm tại TKV.",
  keyword: "Khâu Vai phối hợp đào tạo nghề mỏ 2026",
  keywords: ["Khâu Vai phối hợp đào tạo nghề mỏ 2026", "tuyển sinh nghề mỏ Tuyên Quang", "Than Khe Chàm tuyển dụng lao động", "Trường Cao đẳng TKV", "việc làm ngành Than", "học nghề mỏ Quảng Ninh"],
  facts: [["Ngày 21/08/2026", "Thời điểm hội nghị diễn ra tại Phân hiệu Đào tạo Cẩm Phả."], ["Giai đoạn 2026–2030", "Thời hạn của biên bản hợp tác ba bên được đưa ra đánh giá."], ["Ba đầu mối", "Xã Khâu Vai, Trường Cao đẳng TKV và Công ty Than Khe Chàm cùng phối hợp."], ["Hai nơi tham quan", "Đoàn tìm hiểu môi trường sản xuất và điều kiện học tập, sinh hoạt."]],
  intro: [
    "Trường Cao đẳng Than – Khoáng sản Việt Nam ngày 22/08/2026 thông tin về hội nghị đánh giá mô hình <strong>Khâu Vai phối hợp đào tạo nghề mỏ 2026</strong>. Chương trình kết nối chính quyền xã Khâu Vai, tỉnh Tuyên Quang với Nhà trường và Công ty Than Khe Chàm – TKV.",
    "Đoàn địa phương được tìm hiểu môi trường sản xuất, nhu cầu tuyển dụng, chế độ và cơ hội nghề nghiệp tại doanh nghiệp; đồng thời tham quan ký túc xá, giảng đường và xưởng thực hành của Phân hiệu Đào tạo Cẩm Phả. Việc xem trực tiếp giúp thông tin tư vấn bớt trừu tượng đối với người lao động và gia đình ở xa.",
    "Nguồn chính thức cho biết số người nhập học thực tế còn hạn chế do địa bàn vùng cao, giao thông khó khăn và tâm lý ngại đi xa. Hội nghị vì vậy tập trung vào cách tư vấn sát cơ sở và hỗ trợ người học trong suốt quá trình học, thực tập, thay vì chỉ dừng ở việc giới thiệu đầu vào.",
  ],
  sections: [
    {title: "Khâu Vai phối hợp đào tạo nghề mỏ theo chuỗi ba bên", paragraphs: [
      "Chính quyền địa phương có điều kiện rà soát nhu cầu và giúp người dân tiếp cận đầu mối đáng tin cậy. Nhà trường phụ trách tư vấn, đào tạo, chỗ học và sinh hoạt; doanh nghiệp cung cấp nhu cầu nhân lực, môi trường thực tập cùng tiêu chuẩn công việc.",
      "Ba bên thống nhất tiếp tục tư vấn trực tiếp tại cơ sở, cung cấp rõ thông tin ngành nghề, chế độ học tập, tuyển dụng và việc làm. Mô hình này hữu ích nhất khi người quan tâm được nghe cùng một nội dung từ các đầu mối có trách nhiệm, không phải qua môi giới hoặc lời truyền miệng.",
    ]},
    {title: "Tham quan thực tế giúp người lao động hiểu đúng nghề mỏ", paragraphs: [
      "Một quyết định học nghề mỏ liên quan đến việc xa nhà, điều kiện sức khỏe, kỷ luật học tập và môi trường sản xuất đặc thù. Tham quan khai trường, khu học tập và ký túc xá giúp ứng viên hình dung cụ thể hơn trước khi chuẩn bị hồ sơ.",
      "Người lao động nên hỏi rõ nơi học, thời gian đào tạo, yêu cầu khám sức khỏe, giai đoạn thực tập và tiêu chuẩn tiếp nhận của doanh nghiệp. Cơ hội việc làm được mở ra qua đào tạo, nhưng không đồng nghĩa mọi người đăng ký đều tự động được nhận việc.",
    ]},
    {title: "Giữ người học quan trọng không kém tuyển sinh", paragraphs: [
      "Báo cáo tại hội nghị nêu việc Nhà trường phối hợp quản lý, hỗ trợ học viên trong học tập, thực tập và bố trí việc làm sau đào tạo. Đây là phần quyết định để người học vùng cao vượt qua khó khăn ban đầu khi thay đổi môi trường sống.",
      "Khi gặp vấn đề về sức khỏe, học tập hoặc sinh hoạt, học viên nên báo sớm cho cán bộ quản lý. Gia đình và đầu mối địa phương cũng cần giữ liên hệ để việc hỗ trợ có thông tin đầy đủ, tránh để khó khăn nhỏ kéo dài thành quyết định bỏ học.",
    ]},
  ],
  factsTitle: "Những nội dung ba bên đã công bố",
  actionTitle: "Người lao động Khâu Vai nên kiểm tra gì trước khi đăng ký",
  conclusionTitle: "Kết nối bền vững bắt đầu từ thông tin rõ và đồng hành đủ",
  checklist: [["Xác minh đầu mối", "Làm việc qua xã Khâu Vai, Trường Cao đẳng TKV hoặc doanh nghiệp được giới thiệu chính thức."], ["Kiểm tra sức khỏe", "Hỏi rõ tiêu chuẩn của nghề mỏ định đăng ký và lịch khám tuyển."], ["Nắm toàn bộ lộ trình", "Đối chiếu nơi học, thời gian đào tạo, thực tập và tiêu chuẩn tiếp nhận."], ["Tính kế hoạch xa nhà", "Trao đổi với gia đình về đi lại, sinh hoạt và thời gian thích nghi tại Quảng Ninh."]],
  takeaway: "Xã Khâu Vai, Trường Cao đẳng TKV và Than Khe Chàm đang phối hợp theo giai đoạn 2026–2030 để tư vấn, đào tạo nghề và kết nối việc làm. Người lao động có thêm kênh tìm hiểu chính thức, nhưng vẫn cần đáp ứng sức khỏe, hoàn thành đào tạo và tiêu chuẩn của đợt tiếp nhận.",
  faq: [["Hội nghị phối hợp diễn ra khi nào?", "Hội nghị diễn ra ngày 21/08/2026 tại Phân hiệu Đào tạo Cẩm Phả."], ["Ba đơn vị nào tham gia?", "Xã Khâu Vai, Trường Cao đẳng Than – Khoáng sản Việt Nam và Công ty Than Khe Chàm – TKV."], ["Người lao động được tìm hiểu những gì?", "Đoàn tham quan môi trường sản xuất, khu học tập, ký túc xá và nghe thông tin về đào tạo, tuyển dụng, việc làm."], ["Phối hợp này có bảo đảm mọi người đăng ký đều có việc không?", "Không. Ứng viên vẫn phải đáp ứng điều kiện, hoàn thành đào tạo và tiêu chuẩn tiếp nhận của doanh nghiệp."]],
  sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Tăng cường phối hợp đào tạo nghề, giải quyết việc làm cho lao động xã Khâu Vai, tỉnh Tuyên Quang", date: "22/08/2026", url: images["khau-vai-phoi-hop-dao-tao-nghe-viec-lam-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ cách Khâu Vai phối hợp đào tạo nghề mỏ 2026, kết nối với Trường Cao đẳng TKV và việc làm tại Than Khe Chàm.",
});

export const duongHuyFamilyWelfareArticle20260826 = withImage("than-duong-huy-phuc-loi-gia-dinh-tho-lo-2026", {
  updated: "2026-08-26T08:24:00+07:00",
  published: "2026-08-26T08:24:00+07:00",
  urlPath: "tin-nganh-than/2026/08/26/than-duong-huy-phuc-loi-gia-dinh-tho-lo-2026",
  related: ["than-duong-huy-khu-tap-the-cong-nhan-2026", "than-duong-huy-ho-tro-con-cong-nhan-2026", "than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Dương Huy tổ chức nghỉ dưỡng cho 90 gia đình thợ lò",
  description: "Than Dương Huy tổ chức chương trình phúc lợi cho 90 gia đình thợ lò, cơ điện lò đi nghỉ dưỡng 4 ngày 3 đêm tại Sa Pa hoặc Hạ Long.",
  lead: "Năm 2026, chương trình Than Dương Huy nghỉ dưỡng gia đình thợ lò có ý nghĩa vì đưa phúc lợi từ cá nhân người lao động tới cả gia đình, điểm tựa phía sau những ca làm việc trong hầm lò.",
  keyword: "Than Dương Huy nghỉ dưỡng gia đình thợ lò 2026",
  keywords: ["Than Dương Huy nghỉ dưỡng gia đình thợ lò 2026", "phúc lợi thợ mỏ", "90 gia đình Than Dương Huy", "đời sống công nhân ngành Than", "thợ lò Quảng Ninh", "việc làm ngành Than"],
  facts: [["90 gia đình", "Quy mô gia đình thợ lò, cơ điện lò được công bố trong chương trình."], ["Trên 360 người", "Tổng số người dự kiến thụ hưởng."], ["4 ngày 3 đêm", "Thời lượng nghỉ dưỡng tại Sa Pa hoặc Hạ Long."], ["13/08–22/09/2026", "Khoảng thời gian chương trình được triển khai."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 25/08/2026 công bố chương trình <strong>Than Dương Huy nghỉ dưỡng gia đình thợ lò 2026</strong>. Chương trình giúp 90 gia đình với trên 360 người có hành trình 4 ngày 3 đêm tại Sa Pa hoặc Hạ Long.",
    "Than Dương Huy nghỉ dưỡng gia đình thợ lò 2026 hướng tới người lao động trực tiếp thuộc nhóm thợ lò, thợ cơ điện lò cùng người thân. Nguồn chính thức nêu 70 gia đình lựa chọn Sa Pa, 20 gia đình lựa chọn Hạ Long; kinh phí được đài thọ 100%, mức chi gần 20 triệu đồng mỗi gia đình từ nguồn của Tập đoàn và Công ty.",
    "Đây là chế độ theo kế hoạch và tiêu chí của chương trình cụ thể, không phải mức phúc lợi mặc định cho mọi công nhân TKV. Người lao động cần đối chiếu thông báo tại đơn vị mình thay vì suy rộng từ con số của Than Dương Huy.",
  ],
  sections: [
    {title: "Phúc lợi Than Dương Huy mở rộng tới gia đình thợ lò", paragraphs: [
      "Đặc thù làm việc theo ca và trong môi trường hầm lò khiến thời gian nghỉ ngơi cùng gia đình có giá trị rõ rệt. Việc cho phép người thân cùng tham gia biến chuyến nghỉ dưỡng thành một khoảng phục hồi chung, đồng thời ghi nhận vai trò của gia đình trong quá trình người lao động bám nghề.",
      "Chương trình được triển khai từ ngày 13/08 đến hết 22/09/2026. Cách chia địa điểm và thời gian giúp các đoàn được tổ chức theo kế hoạch, nhưng người được thụ hưởng vẫn cần tuân theo danh sách bình xét và hướng dẫn riêng của đơn vị.",
    ]},
    {title: "Các con số phúc lợi cần được hiểu đúng phạm vi", paragraphs: [
      "Mức gần 20 triệu đồng được nguồn chính thức mô tả là chi phí cho một gia đình trong chương trình 4 ngày 3 đêm, không phải khoản tiền mặt trao trực tiếp. Số 90 gia đình cũng thuộc đợt này, tách biệt với 70 gia đình đã tham gia chương trình Hạ Long 3 ngày 2 đêm trước đó.",
      "Tách rõ từng nhóm giúp người lao động không cộng gộp sai quy mô hoặc hiểu nhầm quyền lợi. Khi có thông báo, nên hỏi Công đoàn bộ phận về đối tượng, tiêu chí lựa chọn, người thân được đăng ký và chi phí nào nằm trong chương trình.",
    ]},
    {title: "Chăm lo sức khỏe góp phần giữ nguồn nhân lực ngành Than", paragraphs: [
      "Nghỉ dưỡng không thay thế khám sức khỏe định kỳ, điều trị bệnh nghề nghiệp hoặc cải thiện điều kiện lao động. Giá trị của chương trình nằm ở việc bổ sung một khoảng nghỉ và sự gắn kết vào hệ thống chăm lo rộng hơn.",
      "Với người đang cân nhắc nghề mỏ, phúc lợi là một dữ kiện cần tham khảo cùng yêu cầu sức khỏe, thời gian học nghề, kỷ luật an toàn và thu nhập theo kết quả lao động. Một chương trình cụ thể không phải lời hứa chắc chắn về toàn bộ quyền lợi sau tuyển dụng.",
    ]},
  ],
  factsTitle: "Quy mô chương trình được công bố",
  actionTitle: "Người lao động nên đối chiếu gì khi nhận thông báo phúc lợi",
  conclusionTitle: "Chăm lo gia đình giúp người thợ có thêm điểm tựa để gắn bó",
  checklist: [["Kiểm tra danh sách", "Xác nhận mình thuộc đợt và tiêu chí bình xét nào."], ["Hỏi rõ người đi cùng", "Đối chiếu số người thân được đăng ký và giấy tờ cần chuẩn bị."], ["Tách chi phí với tiền mặt", "Hiểu đúng mức chi là kinh phí tổ chức chương trình, không mặc định là khoản nhận trực tiếp."], ["Kết hợp chăm sóc sức khỏe", "Không bỏ qua lịch khám, điều trị hoặc tư vấn y tế cần thiết."]],
  takeaway: "Than Dương Huy tổ chức nghỉ dưỡng 4 ngày 3 đêm cho 90 gia đình thợ lò, cơ điện lò với trên 360 người, thực hiện từ 13/08 đến 22/09/2026. Đây là chương trình theo đối tượng và kế hoạch riêng, không phải quyền lợi mặc định cho mọi lao động TKV.",
  faq: [["Có bao nhiêu gia đình tham gia chương trình?", "Nguồn chính thức công bố 90 gia đình với trên 360 người."], ["Các gia đình nghỉ dưỡng ở đâu?", "Có 70 gia đình chọn Sa Pa và 20 gia đình chọn Hạ Long."], ["Gần 20 triệu đồng có phải tiền mặt trao cho mỗi gia đình không?", "Không. Nguồn mô tả đây là mức chi cho chương trình nghỉ dưỡng của một gia đình."], ["Chương trình có áp dụng cho mọi công nhân TKV không?", "Không. Đây là chương trình riêng của Than Dương Huy dành cho nhóm được lựa chọn theo kế hoạch."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Dương Huy: Quan tâm, chăm lo người lao động bằng những việc làm thiết thực", date: "25/08/2026", url: images["than-duong-huy-phuc-loi-gia-dinh-tho-lo-2026"].sourceUrl}],
  seoLine: "Bài viết giải thích chương trình Than Dương Huy nghỉ dưỡng gia đình thợ lò 2026 và cách hiểu đúng phạm vi phúc lợi công nhân ngành Than.",
});

export const thongNhatWeekendWelfareArticle20260826 = withImage("than-thong-nhat-nghi-duong-cuoi-tuan-nguoi-lao-dong-2026", {
  updated: "2026-08-26T08:25:00+07:00",
  published: "2026-08-26T08:25:00+07:00",
  urlPath: "tin-nganh-than/2026/08/26/than-thong-nhat-nghi-duong-cuoi-tuan-nguoi-lao-dong-2026",
  related: ["than-thong-nhat-cap-ao-bao-ho-mua-dong-2026", "than-thong-nhat-tri-an-gia-dinh-tho-mo-hy-sinh", "phuc-loi-tho-mo-tkv-2026", "than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026"],
  section: "An sinh xã hội",
  title: "Than Thống Nhất tổ chức nghỉ dưỡng cuối tuần cho người lao động",
  description: "Than Thống Nhất phối hợp Công đoàn tổ chức chương trình Phúc lợi Thợ mỏ 2 ngày 1 đêm tại Bãi Cháy và Yoko Onsen Quang Hanh.",
  lead: "Năm 2026, chương trình Than Thống Nhất nghỉ dưỡng cuối tuần kết hợp nghỉ ngơi, tắm khoáng và hoạt động tập thể, giúp người lao động tái tạo sức khỏe sau ca sản xuất.",
  keyword: "Than Thống Nhất nghỉ dưỡng cuối tuần 2026",
  keywords: ["Than Thống Nhất nghỉ dưỡng cuối tuần 2026", "Phúc lợi Thợ mỏ", "Yoko Onsen Quang Hanh", "chăm sóc sức khỏe thợ mỏ", "đời sống người lao động ngành Than", "việc làm ngành Than Quảng Ninh"],
  facts: [["2 ngày 1 đêm", "Thời lượng chương trình nghỉ dưỡng cuối tuần."], ["Hai điểm đến", "Bãi Cháy và Yoko Onsen Quang Hanh tại Quảng Ninh."], ["Doanh nghiệp và Công đoàn", "Hai đầu mối phối hợp tổ chức chương trình."], ["Ngày 18/08/2026", "Ngày bài nguồn chính thức được đăng."]],
  intro: [
    "Công ty Than Thống Nhất – TKV ngày 18/08/2026 đăng thông tin về chương trình <strong>Than Thống Nhất nghỉ dưỡng cuối tuần 2026</strong>. Doanh nghiệp phối hợp với Công đoàn Công ty tổ chức hành trình 2 ngày 1 đêm tại Bãi Cháy và khu tắm khoáng Yoko Onsen Quang Hanh, Quảng Ninh.",
    "Than Thống Nhất nghỉ dưỡng cuối tuần 2026 cho người lao động thời gian nghỉ ngơi, tham gia hoạt động tập thể và trải nghiệm tắm khoáng nóng. Bài nguồn nhấn mạnh mục tiêu tái tạo sức lao động, tăng gắn kết đồng nghiệp và ghi nhận đóng góp của người lao động sau những ca sản xuất.",
    "Nguồn không công bố số người tham gia, tổng kinh phí hoặc tiêu chí lựa chọn. Vì vậy không nên suy đoán quy mô và cũng không coi đây là quyền lợi tự động áp dụng cho mọi lao động của Công ty hoặc toàn TKV.",
  ],
  sections: [
    {title: "Nghỉ dưỡng cuối tuần bổ sung khoảng phục hồi sau ca", paragraphs: [
      "Lịch làm việc ngành Than đòi hỏi người lao động duy trì thể lực, giấc ngủ và khả năng tập trung. Một chương trình ngắn ngày tạo khoảng tách khỏi nhịp ca kíp, để người tham gia nghỉ ngơi và trở lại công việc với trạng thái tốt hơn.",
      "Hoạt động tại Bãi Cháy và Yoko Onsen được tổ chức cùng các nội dung gắn kết tập thể. Yếu tố đồng nghiệp có ý nghĩa vì sự phối hợp, tin cậy và kỷ luật giữa các vị trí là phần quan trọng của môi trường sản xuất an toàn.",
    ]},
    {title: "Phúc lợi cần đi cùng chăm sóc sức khỏe nghề nghiệp", paragraphs: [
      "Nghỉ dưỡng và tắm khoáng mang tính hỗ trợ thư giãn, không thay thế khám sức khỏe, chẩn đoán hoặc điều trị. Người lao động có triệu chứng kéo dài sau ca vẫn cần báo bộ phận y tế, Công đoàn hoặc quản lý trực tiếp để được hướng dẫn phù hợp.",
      "Doanh nghiệp có thể đánh giá giá trị chương trình qua phản hồi của người tham gia, tình trạng sức khỏe và khả năng sắp xếp thời gian nghỉ hợp lý. Cách theo dõi này giúp phúc lợi gắn với nhu cầu thật thay vì chỉ dừng ở một chuyến đi.",
    ]},
    {title: "Người quan tâm việc làm ngành Than nên nhìn phúc lợi trong tổng thể", paragraphs: [
      "Một chương trình chăm lo cho thấy văn hóa đồng hành với người lao động tại đơn vị, nhưng không thay thế các điều kiện cốt lõi khi lựa chọn nghề: sức khỏe, đào tạo, an toàn, định mức và cơ chế tiền lương.",
      "Ứng viên nên hỏi quyền lợi đang áp dụng trong đúng đợt tuyển và tại đúng doanh nghiệp. Thông tin của Than Thống Nhất không nên được dùng để hứa chắc chế độ tương tự ở đơn vị khác hoặc cho mọi người lao động mới.",
    ]},
  ],
  factsTitle: "Những dữ kiện nguồn chính thức đã xác nhận",
  actionTitle: "Người lao động nên làm gì để phục hồi sức khỏe đúng cách",
  conclusionTitle: "Một khoảng nghỉ có giá trị khi nối với chăm sóc dài hạn",
  checklist: [["Giữ nhịp nghỉ sau ca", "Ưu tiên giấc ngủ, dinh dưỡng và thời gian hồi phục phù hợp."], ["Báo triệu chứng kéo dài", "Liên hệ bộ phận y tế hoặc quản lý khi đau mỏi, mất ngủ hay mệt bất thường."], ["Không thay khám bằng nghỉ dưỡng", "Tiếp tục lịch khám định kỳ và điều trị theo hướng dẫn chuyên môn."], ["Đối chiếu đúng đơn vị", "Hỏi Công đoàn hoặc phòng chức năng về tiêu chí, lịch và quyền lợi thực tế."]],
  takeaway: "Than Thống Nhất phối hợp Công đoàn Công ty tổ chức chương trình Phúc lợi Thợ mỏ 2 ngày 1 đêm tại Bãi Cháy và Yoko Onsen Quang Hanh. Nguồn không công bố quy mô hay kinh phí, nên bài viết chỉ ghi nhận những dữ kiện đã xác minh.",
  faq: [["Chương trình kéo dài bao lâu?", "Chương trình được tổ chức trong 2 ngày 1 đêm."], ["Người lao động đi những đâu?", "Hành trình có Bãi Cháy và khu tắm khoáng Yoko Onsen Quang Hanh tại Quảng Ninh."], ["Nguồn có công bố số người tham gia không?", "Không. Bài nguồn không nêu số lượng người tham gia hoặc tổng kinh phí."], ["Tắm khoáng có thay thế khám sức khỏe không?", "Không. Đây là hoạt động nghỉ dưỡng; khám, chẩn đoán và điều trị vẫn cần thực hiện theo hướng dẫn y tế."]],
  sources: [{publisher: "Công ty Than Thống Nhất – TKV", title: "Công ty Than Thống Nhất – TKV chăm lo sức khỏe người lao động qua chương trình ‘Phúc lợi Thợ Mỏ – Nghỉ dưỡng cuối tuần’", date: "18/08/2026", url: images["than-thong-nhat-nghi-duong-cuoi-tuan-nguoi-lao-dong-2026"].sourceUrl}],
  seoLine: "Bài viết ghi nhận chương trình Than Thống Nhất nghỉ dưỡng cuối tuần 2026 và cách hiểu đúng vai trò của phúc lợi trong chăm sóc sức khỏe thợ mỏ.",
});

export const dailyCommunityArticles20260826 = [
  khauVaiTrainingArticle20260826,
  duongHuyFamilyWelfareArticle20260826,
  thongNhatWeekendWelfareArticle20260826,
];
