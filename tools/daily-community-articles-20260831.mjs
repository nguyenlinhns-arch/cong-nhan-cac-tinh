import {dailyCommunitySourceImages20260831 as images} from "./daily-community-source-images-20260831.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, sourceImageChecksum: image.verifiedSha256, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const kheChamHolidayBusesArticle20260831 = withImage("than-khe-cham-22-chuyen-xe-dua-nguoi-lao-dong-ve-que-2026", {
  updated: "2026-08-31T09:18:00+07:00",
  published: "2026-08-31T09:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/31/than-khe-cham-22-chuyen-xe-dua-nguoi-lao-dong-ve-que-2026",
  related: ["hoc-sinh-thuc-tap-than-khe-cham-2026", "dien-xa-than-khe-cham-hop-tac-dao-tao-viec-lam", "than-thong-nhat-trao-qua-quoc-khanh-nguoi-lao-dong-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Khe Chàm tổ chức 22 chuyến xe đưa người lao động về quê",
  description: "Than Khe Chàm bố trí 22 chuyến xe đưa gần 1.000 người lao động, người thân và học sinh thực tập về quê nghỉ Quốc khánh; xe đón trở lại dự kiến ngày 2/9.",
  lead: "Những chuyến xe miễn bớt áp lực đi lại dịp cao điểm, đồng thời cho thấy chăm lo đời sống và ổn định nhân lực có thể được giải quyết trong cùng một kế hoạch cụ thể.",
  keyword: "Than Khe Chàm đưa người lao động về quê Quốc khánh 2026",
  keywords: ["Than Khe Chàm đưa người lao động về quê Quốc khánh 2026", "xe đưa đón công nhân mỏ", "phúc lợi người lao động ngành Than", "học sinh thực tập nghề mỏ", "việc làm ngành Than Quảng Ninh", "Than Khe Chàm TKV"],
  facts: [["22 chuyến xe", "Số xe xuất phát từ Văn phòng Công ty sáng 30/08/2026."], ["Gần 1.000 người", "Tổng nhóm hành khách gồm CBCNV, người thân và học sinh thực tập."], ["11 tỉnh, thành", "Các điểm đến được nguồn chính thức liệt kê."], ["02/09/2026", "Ngày Công ty dự kiến tổ chức xe đón trở lại làm việc và thực tập."]],
  intro: [
    "Sáng 30/08/2026, Công ty Than Khe Chàm tổ chức 22 chuyến xe đưa gần 1.000 cán bộ, công nhân viên, người thân và học sinh đang thực tập về quê nghỉ Quốc khánh. Chương trình <strong>Than Khe Chàm đưa người lao động về quê Quốc khánh 2026</strong> trải rộng trên nhiều tuyến đường dài từ Quảng Ninh tới miền núi phía Bắc và các tỉnh Bắc Trung Bộ.",
    "Nguồn chính thức nêu rõ con số gần 1.000 là tổng của ba nhóm hành khách: người lao động, người thân và học sinh thực tập. Trên xe có nước uống, hoa quả và bánh kẹo; lãnh đạo Công ty cùng các đơn vị gặp mặt, động viên trước giờ khởi hành.",
    "Công ty dự kiến tiếp tục bố trí xe đón người lao động, người thân và học sinh thực tập trở lại ngày 02/09/2026. Đây là kế hoạch được công bố, vì vậy chưa nên diễn đạt thành chuyến đón đã hoàn tất.",
  ],
  sections: [
    {title: "Tổ chức tuyến xe theo nơi cư trú thực tế", paragraphs: [
      "Các xe hướng tới Hưng Yên, Hải Phòng, Ninh Bình, Phú Thọ, Lai Châu, Tuyên Quang, Cao Bằng, Điện Biên, Thanh Hóa, Nghệ An và Hà Tĩnh. Việc gom tuyến theo địa bàn giúp người lao động giảm số lần trung chuyển trong một kỳ nghỉ có nhu cầu đi lại cao.",
      "Với học sinh đang thực tập sản xuất, chuyến xe còn tạo điều kiện về thăm gia đình trước khi quay lại doanh nghiệp. Sự hiện diện của nhóm này cho thấy chính sách đồng hành đã được áp dụng ngay từ giai đoạn người học tiếp cận môi trường sản xuất.",
    ]},
    {title: "Phúc lợi đi lại gắn với kế hoạch nhân lực sau kỳ nghỉ", paragraphs: [
      "Kế hoạch xe chiều về và chiều đón trở lại giúp cả người lao động lẫn đơn vị chủ động thời gian. Đối với doanh nghiệp khai thác theo ca, khả năng tập hợp nhân lực đúng lịch sau nghỉ lễ có ý nghĩa trực tiếp với an toàn tổ chức sản xuất.",
      "Người đang tìm hiểu việc làm ngành Than có thể xem hoạt động này như một ví dụ về phúc lợi hỗ trợ đi lại tại Than Khe Chàm. Tuy nhiên, phạm vi tuyến, đối tượng và thời điểm phụ thuộc thông báo từng đợt, không phải quyền lợi mặc định tại mọi đơn vị TKV.",
    ]},
    {title: "Thông tin rõ giúp người tham gia chuẩn bị đúng", paragraphs: [
      "Người có tên trong danh sách xe đón trở lại cần theo dõi giờ, điểm hẹn và yêu cầu hành lý từ đầu mối của Công ty. Học sinh thực tập cũng nên xác nhận lịch tập trung với nhà trường và đơn vị tiếp nhận để tránh nhầm giữa lịch nghỉ với lịch thực tập.",
      "Một chương trình thiết thực cần vận hành an toàn, đúng tuyến và đúng giờ bên cạnh việc bảo đảm đủ số chuyến. Kế hoạch hai chiều tạo cơ sở để người tham gia chủ động và để doanh nghiệp kiểm soát nhịp trở lại sản xuất.",
    ]},
  ],
  factsTitle: "Quy mô chương trình xe đưa đón dịp Quốc khánh",
  actionTitle: "Người lao động và học sinh thực tập cần lưu ý",
  conclusionTitle: "Chăm lo đi lại là một phần của giữ chân nhân lực",
  checklist: [["Kiểm tra đúng tuyến", "Đối chiếu tỉnh, điểm trả và số xe theo thông báo của Công ty."], ["Xác nhận lịch đón lại", "Theo dõi kế hoạch ngày 02/09/2026 và giờ tập trung cụ thể."], ["Giữ liên lạc đầu mối", "Báo sớm khi thay đổi hành trình hoặc không sử dụng chuyến về."], ["Phân biệt phạm vi chương trình", "Không suy rộng đợt xe này thành chính sách chung của mọi đơn vị TKV."]],
  takeaway: "Than Khe Chàm đã tổ chức 22 chuyến xe đưa gần 1.000 CBCNV, người thân và học sinh thực tập về quê; kế hoạch xe đón trở lại được dự kiến ngày 02/09/2026. Chương trình hỗ trợ đi lại đồng thời giúp đơn vị chủ động nhân lực sau kỳ nghỉ.",
  faq: [["22 chuyến xe phục vụ riêng người lao động hay gồm cả người thân?", "Nguồn nêu gần 1.000 hành khách gồm CBCNV, người thân và học sinh đang thực tập tại Công ty."], ["Các xe đi tới những địa phương nào?", "Nguồn liệt kê 11 tỉnh, thành từ Hải Phòng, Hưng Yên đến Lai Châu, Điện Biên và các tỉnh Bắc Trung Bộ."], ["Than Khe Chàm đã đón người lao động trở lại chưa?", "Chưa thể kết luận như vậy. Thông tin công bố ngày 30/08 xác định Công ty dự kiến tổ chức xe đón trở lại ngày 02/09/2026."], ["Đây có phải phúc lợi cố định hằng năm không?", "Nguồn chỉ xác nhận chương trình dịp Quốc khánh 2026; các đợt sau cần căn cứ thông báo chính thức mới."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Khe Chàm: Tổ chức xe đưa, đón người lao động về quê dịp nghỉ lễ Quốc khánh 2/9", date: "30/08/2026", url: images["than-khe-cham-22-chuyen-xe-dua-nguoi-lao-dong-ve-que-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật chương trình 22 chuyến xe của Than Khe Chàm và những lưu ý về lịch đón người lao động trở lại sau kỳ nghỉ Quốc khánh.",
});

export const haLongTienYenTrainingArticle20260831 = withImage("than-ha-long-hop-tac-dao-tao-nghe-tien-yen-2026", {
  updated: "2026-08-31T09:18:00+07:00",
  published: "2026-08-31T09:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/31/than-ha-long-hop-tac-dao-tao-nghe-tien-yen-2026",
  related: ["luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam", "tuyen-sinh-nghe-mo-dong-ngu-2026", "truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026", "nam-hang-hong-thu-hop-tac-dao-tao-nghe-viec-lam-2026"],
  section: "Kết nối địa phương",
  title: "Than Hạ Long hợp tác đào tạo nghề, việc làm tại Tiên Yên",
  description: "Than Hạ Long, Trường Cao đẳng TKV và xã Tiên Yên ký hợp tác đào tạo nghề gắn việc làm giai đoạn 2026–2030, đặt mục tiêu tối thiểu 40 lao động địa phương mỗi năm.",
  lead: "Thỏa thuận giai đoạn 2026–2030 nối khâu tư vấn tại địa phương với đào tạo nghề và nhu cầu nhân lực của doanh nghiệp; vì vậy người học cần đánh giá đầy đủ điều kiện nghề mỏ trước khi quyết định.",
  keyword: "Than Hạ Long tuyển sinh nghề mỏ Tiên Yên 2026",
  keywords: ["Than Hạ Long tuyển sinh nghề mỏ Tiên Yên 2026", "học nghề mỏ Quảng Ninh", "đào tạo nghề gắn việc làm", "tuyển thợ lò Than Hạ Long", "Trường Cao đẳng TKV", "việc làm ngành Than Tiên Yên"],
  facts: [["2026–2030", "Giai đoạn hợp tác giữa doanh nghiệp, nhà trường và xã Tiên Yên."], ["Tối thiểu 40 người/năm", "Mục tiêu tuyển chọn, đào tạo lao động địa phương cho Than Hạ Long."], ["162 lao động", "Số người địa phương tham gia học nghề giai đoạn 2020–2025."], ["149 học viên", "Số người tốt nghiệp và được bố trí việc làm tại các đơn vị TKV theo nguồn."]],
  intro: [
    "Công ty Than Hạ Long – TKV, Trường Cao đẳng Than – Khoáng sản Việt Nam và UBND xã Tiên Yên, tỉnh Quảng Ninh đã ký biên bản hợp tác đào tạo nghề gắn với giải quyết việc làm giai đoạn 2026–2030. Chương trình <strong>Than Hạ Long tuyển sinh nghề mỏ Tiên Yên 2026</strong> đặt mục tiêu hằng năm tuyển chọn, đào tạo tối thiểu 40 lao động địa phương để học nghề và làm việc tại Công ty.",
    "Kết quả được nguồn TKV công bố cho giai đoạn 2020–2025 cho thấy các bên tổ chức 30 hội nghị tư vấn với gần 1.000 lượt người tham dự; 162 lao động địa phương học nghề, 149 người tốt nghiệp được bố trí việc làm tại các đơn vị TKV.",
    "Nguồn cũng nêu một số lao động sau đào tạo có thu nhập 25–35 triệu đồng mỗi tháng cùng các hỗ trợ tại doanh nghiệp. Đây là kết quả của nhóm đang làm việc, không phải cam kết mức thu nhập cho mọi học viên mới; thu nhập thực tế còn phụ thuộc nghề, năng suất, ngày công và đơn vị tiếp nhận.",
  ],
  sections: [
    {title: "Ba bên cùng chịu trách nhiệm trên một lộ trình", paragraphs: [
      "Chính quyền xã giúp đưa thông tin tới người dân và sàng lọc nhu cầu; nhà trường phụ trách đào tạo; doanh nghiệp xác định vị trí cần nhân lực và tiếp nhận người đủ điều kiện. Khi các đầu mối cùng có mặt, người lao động dễ kiểm tra hơn so với chỉ tiếp cận một lời mời tuyển sinh đơn lẻ.",
      "Mục tiêu tối thiểu 40 người mỗi năm cho biết quy mô định hướng, nhưng không đồng nghĩa mọi người đăng ký đều được tuyển. Người học vẫn phải đáp ứng tiêu chuẩn đầu vào, sức khỏe, kỷ luật học tập và yêu cầu nghề tại thời điểm tiếp nhận.",
    ]},
    {title: "Dữ liệu giai đoạn trước là căn cứ tham khảo, không phải lời hứa", paragraphs: [
      "Tỷ lệ 149 người tốt nghiệp và được bố trí việc làm trên 162 người tham gia học nghề cho thấy sự liên thông đã tạo kết quả cụ thể. Tuy nhiên, số liệu này thuộc giai đoạn 2020–2025 và không tự động dự báo kết quả của từng khóa trong giai đoạn mới.",
      "Thông tin về thu nhập 25–35 triệu đồng mỗi tháng cần đọc kèm bối cảnh người đã làm việc tại Than Hạ Long và các đơn vị ngành Than. Ứng viên nên yêu cầu làm rõ cách tính lương, phụ cấp, ngày công, ca kíp, nhà ở, xe đưa đón và bữa ăn trước khi ký hồ sơ.",
    ]},
    {title: "Học nghề mỏ cần quyết định trên thông tin đầy đủ", paragraphs: [
      "Nghề mỏ hầm lò có yêu cầu sức khỏe và kỷ luật an toàn cao. Người lao động tại Tiên Yên nên tham dự tư vấn chính thức, khám sức khỏe theo quy định và trao đổi với gia đình về thời gian học, thực tập, nơi làm việc cũng như khả năng thích nghi với môi trường ca kíp.",
      "Giá trị lớn nhất của hợp tác địa phương là rút ngắn khoảng cách thông tin và tạo đầu mối chịu trách nhiệm. Một quyết định bền vững vẫn phải dựa trên hồ sơ tuyển sinh, chương trình đào tạo và điều kiện tuyển dụng được xác nhận cho đúng khóa học.",
    ]},
  ],
  factsTitle: "Những con số của hợp tác đào tạo tại Tiên Yên",
  actionTitle: "Người quan tâm học nghề mỏ nên kiểm tra",
  conclusionTitle: "Kết nối địa phương chỉ bền khi thông tin minh bạch",
  checklist: [["Xác nhận ngành học", "Kiểm tra tên nghề, thời gian học, thực tập và chuẩn đầu ra."], ["Đánh giá sức khỏe", "Thực hiện khám theo tiêu chuẩn của nghề dự kiến theo học."], ["Làm rõ việc làm sau học", "Hỏi về điều kiện tiếp nhận, đơn vị làm việc và quy trình ký hợp đồng."], ["Đọc đúng thông tin thu nhập", "Không coi mức của lao động giai đoạn trước là cam kết cho cá nhân mới."]],
  takeaway: "Than Hạ Long, Trường Cao đẳng TKV và xã Tiên Yên thống nhất hợp tác giai đoạn 2026–2030, hướng tới tối thiểu 40 lao động địa phương học nghề và làm việc mỗi năm. Kết quả giai đoạn trước tạo căn cứ tham khảo, còn mỗi ứng viên vẫn cần xác minh điều kiện cụ thể.",
  faq: [["Mục tiêu tuyển sinh tại Tiên Yên là bao nhiêu người?", "Các bên thống nhất mục tiêu hằng năm tuyển chọn và đào tạo tối thiểu 40 lao động địa phương để học nghề và làm việc tại Than Hạ Long."], ["Có phải đăng ký là chắc chắn được nhận việc không?", "Không. Mục tiêu hợp tác không thay thế các điều kiện tuyển sinh, sức khỏe, kết quả học tập và yêu cầu tiếp nhận của doanh nghiệp."], ["Mức 25–35 triệu đồng có áp dụng cho mọi học viên mới không?", "Không có căn cứ để khẳng định như vậy. Nguồn nêu đây là mức của nhiều lao động đã làm việc sau đào tạo trong giai đoạn trước."], ["Ai tham gia thỏa thuận?", "Công ty Than Hạ Long – TKV, Trường Cao đẳng TKV và UBND xã Tiên Yên, tỉnh Quảng Ninh."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Than Hạ Long liên kết đào tạo nghề, mở hướng việc làm bền vững cho lao động địa phương", date: "21/05/2026", url: images["than-ha-long-hop-tac-dao-tao-nghe-tien-yen-2026"].sourceUrl}],
  seoLine: "Bài viết phân tích hợp tác tuyển sinh nghề mỏ tại Tiên Yên và cách người lao động đọc đúng mục tiêu đào tạo, việc làm, thu nhập.",
});

export const lamDongBloodDonationArticle20260831 = withImage("tkv-hien-mau-lam-dong-180-don-vi-2026", {
  updated: "2026-08-31T09:18:00+07:00",
  published: "2026-08-31T09:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/31/tkv-hien-mau-lam-dong-180-don-vi-2026",
  related: ["dong-ta-phoi-ho-tro-108-ho-kho-khan-hop-thanh-2026", "kho-van-da-bac-tang-phong-hoc-stem-ba-che-2026", "tuyen-than-cua-ong-ho-tro-cuu-nu-thanh-nien-xung-phong-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Chương trình hiến máu TKV tại Lâm Đồng tiếp nhận 180 đơn vị máu",
  description: "Các đơn vị TKV tại Lâm Đồng phối hợp Bệnh viện II Lâm Đồng tổ chức hiến máu tình nguyện, tiếp nhận 180 đơn vị máu đạt chuẩn phục vụ cấp cứu và điều trị.",
  lead: "Hoạt động cộng đồng được tổ chức cùng cơ sở y tế, có quy trình sàng lọc và bàn giao rõ ràng, giúp sự đóng góp của người lao động đi vào đúng hệ thống chuyên môn.",
  keyword: "TKV hiến máu tình nguyện Lâm Đồng 2026",
  keywords: ["TKV hiến máu tình nguyện Lâm Đồng 2026", "180 đơn vị máu", "Nhôm Lâm Đồng TKV", "Ban QLDA bauxit nhôm Lâm Đồng", "hỗ trợ cộng đồng TKV", "Bệnh viện II Lâm Đồng"],
  facts: [["180 đơn vị máu", "Tổng lượng máu đạt chuẩn được chương trình tiếp nhận."], ["8 đơn vị máu", "Phần đóng góp của cán bộ, đoàn viên Ban QLDA theo nguồn."], ["26/08/2026", "Ngày chương trình được tổ chức."], ["Bệnh viện II Lâm Đồng", "Nơi tiếp nhận lượng máu để phục vụ cấp cứu, điều trị."]],
  intro: [
    "Chi đoàn Thanh niên và Công đoàn Ban QLDA Tổ hợp bauxit – nhôm Lâm Đồng phối hợp với tổ chức Đoàn, Công đoàn Công ty Nhôm Lâm Đồng – TKV và Bệnh viện II Lâm Đồng tổ chức chương trình hiến máu ngày 26/08/2026. Hoạt động <strong>TKV hiến máu tình nguyện Lâm Đồng 2026</strong> tiếp nhận 180 đơn vị máu đạt chuẩn.",
    "Trong tổng số đó, cán bộ và đoàn viên của Ban QLDA đóng góp 8 đơn vị máu. Cách tách hai con số giúp tránh hiểu nhầm rằng riêng Ban QLDA đã đóng góp toàn bộ lượng máu của chương trình phối hợp.",
    "Người tham gia được hướng dẫn đăng ký, khám sàng lọc, đo huyết áp và xét nghiệm trước khi tiếp nhận máu. Toàn bộ lượng máu thu được được bàn giao cho Ngân hàng máu Bệnh viện II Lâm Đồng để phục vụ cấp cứu và điều trị tại địa phương.",
  ],
  sections: [
    {title: "Phối hợp y tế giúp hoạt động thiện nguyện đi đúng quy trình", paragraphs: [
      "Hiến máu chỉ an toàn khi người tham gia được đánh giá sức khỏe và việc tiếp nhận do nhân viên chuyên môn thực hiện. Sự tham gia của Bệnh viện II Lâm Đồng nối hoạt động vận động tình nguyện trực tiếp với ngân hàng máu của địa phương.",
      "Con số 180 đơn vị máu là lượng đạt chuẩn sau quy trình tiếp nhận, không phải số người đăng ký. Việc công bố đúng đơn vị đo và tách phần đóng góp của từng nhóm giúp thông tin minh bạch hơn.",
    ]},
    {title: "Trách nhiệm cộng đồng được tạo nên từ sự tự nguyện", paragraphs: [
      "Các đơn vị ngành Than – Khoáng sản tại Lâm Đồng tập hợp người lao động và đoàn viên cho một nhu cầu ngoài sản xuất nhưng gần với đời sống địa phương. Khi nguồn máu được bàn giao cho bệnh viện, giá trị hỗ trợ có địa chỉ tiếp nhận và mục đích sử dụng cụ thể.",
      "Hoạt động này không liên quan trực tiếp đến quyền lợi tuyển dụng hoặc thu nhập của người lao động. Ý nghĩa phù hợp hơn nằm ở văn hóa sẻ chia và khả năng phối hợp giữa doanh nghiệp với thiết chế y tế nơi đơn vị hoạt động.",
    ]},
    {title: "Người lao động cần đặt sức khỏe lên trước phong trào", paragraphs: [
      "Việc hiến máu phải dựa trên tự nguyện và kết luận đủ điều kiện của cơ sở y tế. Người có bệnh nền, đang dùng thuốc hoặc vừa trải qua giai đoạn làm việc nặng cần khai báo trung thực, không cố tham gia chỉ để hoàn thành chỉ tiêu tập thể.",
      "Sau hiến máu, người tham gia nên tuân thủ hướng dẫn nghỉ ngơi, dinh dưỡng và theo dõi phản ứng của cơ thể. Một chương trình cộng đồng có ý nghĩa khi cả người cho lẫn người nhận đều được bảo vệ bằng quy trình chuyên môn.",
    ]},
  ],
  factsTitle: "Kết quả chương trình Giọt hồng yêu thương",
  actionTitle: "Người tham gia hiến máu cần ghi nhớ",
  conclusionTitle: "Sự sẻ chia cần đi cùng an toàn y tế",
  checklist: [["Đăng ký tự nguyện", "Chỉ tham gia khi hiểu rõ quy trình và không chịu áp lực chỉ tiêu."], ["Khai báo trung thực", "Thông tin đầy đủ về sức khỏe, thuốc đang dùng và lịch làm việc nặng."], ["Tuân thủ sàng lọc", "Chấp nhận kết luận của nhân viên y tế về điều kiện hiến máu."], ["Chăm sóc sau hiến", "Nghỉ ngơi và làm theo hướng dẫn của cơ sở tiếp nhận."]],
  takeaway: "Chương trình phối hợp của các đơn vị TKV và Bệnh viện II Lâm Đồng tiếp nhận 180 đơn vị máu đạt chuẩn, trong đó lực lượng Ban QLDA đóng góp 8 đơn vị. Lượng máu được bàn giao cho ngân hàng máu địa phương phục vụ cấp cứu, điều trị.",
  faq: [["180 đơn vị máu có phải đều do Ban QLDA đóng góp không?", "Không. Đây là tổng của toàn chương trình phối hợp; cán bộ và đoàn viên Ban QLDA đóng góp 8 đơn vị máu."], ["Lượng máu được chuyển đi đâu?", "Nguồn cho biết toàn bộ được bàn giao cho Ngân hàng máu Bệnh viện II Lâm Đồng."], ["Người tham gia có được sàng lọc không?", "Có. Quy trình gồm đăng ký, khám sàng lọc, đo huyết áp và xét nghiệm máu trước khi tiếp nhận."], ["Hiến máu có bắt buộc với người lao động không?", "Không. Hiến máu phải dựa trên sự tự nguyện và điều kiện sức khỏe do cơ sở y tế đánh giá."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Ban QLDA Tổ hợp bauxit - nhôm Lâm Đồng: Lan tỏa ‘Giọt hồng yêu thương’ năm 2026", date: "28/08/2026", url: images["tkv-hien-mau-lam-dong-180-don-vi-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật kết quả 180 đơn vị máu của chương trình hiến máu TKV tại Lâm Đồng và lưu ý an toàn cho người tham gia.",
});

export const localRecruitmentNetworkArticle20260831 = withImage("giu-nguon-tho-lo-tkv-tu-dia-ban-quang-ninh-2026", {
  updated: "2026-08-31T09:18:00+07:00",
  published: "2026-08-31T09:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/31/giu-nguon-tho-lo-tkv-tu-dia-ban-quang-ninh-2026",
  related: ["truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026", "tuyen-sinh-nghe-mo-dong-ngu-2026", "luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam", "dien-xa-than-khe-cham-hop-tac-dao-tao-viec-lam"],
  section: "Kết nối địa phương",
  title: "Bám địa bàn tuyển sinh, giữ nguồn thợ lò cho TKV",
  description: "Mạng lưới tuyển sinh của Trường Cao đẳng TKV phối hợp địa phương và 14 doanh nghiệp hầm lò, hỗ trợ người học từ tư vấn, hồ sơ đến thực tập sản xuất.",
  lead: "Câu chuyện của một cán bộ đào tạo cho thấy tuyển sinh nghề mỏ hiệu quả phải theo người học qua hồ sơ, đào tạo và giai đoạn thực tập, chứ chưa thể kết thúc khi đã vận động đủ người nhập học.",
  keyword: "tuyển sinh thợ lò TKV tại Quảng Ninh 2026",
  keywords: ["tuyển sinh thợ lò TKV tại Quảng Ninh 2026", "Trường Cao đẳng TKV tuyển sinh nghề mỏ", "nguồn nhân lực ngành Than", "học nghề mỏ hầm lò", "việc làm ngành Than Quảng Ninh", "Phân hiệu Đào tạo Cẩm Phả"],
  facts: [["16 xã, phường", "Số địa phương đã ký quy chế phối hợp với Nhà trường trong nửa đầu 2026."], ["19 xã, phường", "Số địa phương ký biên bản ghi nhớ theo bài nguồn."], ["14/14 doanh nghiệp", "Các công ty khai thác hầm lò tham gia tuyển sinh, chăm sóc người học."], ["99,4%", "Tỷ lệ học sinh đạt đánh giá kỹ năng nghề lần đầu theo nguồn."]],
  intro: [
    "Bài viết của Báo Quảng Ninh ngày 20/07/2026 ghi lại cách ông Vũ Hồng Thái, Bí thư Chi bộ, Trưởng Phân hiệu Đào tạo Cẩm Phả cùng đội ngũ nhà trường bám địa bàn để thực hiện nhiệm vụ <strong>tuyển sinh thợ lò TKV tại Quảng Ninh 2026</strong>. Công việc gồm tìm người nhập học và giữ liên hệ với gia đình, địa phương, doanh nghiệp trong suốt hành trình đào tạo.",
    "Trong sáu tháng đầu năm 2026, Trường Cao đẳng TKV ký quy chế phối hợp với 16 xã, phường và biên bản ghi nhớ với 19 xã, phường; 14/14 doanh nghiệp khai thác hầm lò cùng tham gia tuyển sinh, chăm sóc người học và hỗ trợ trong giai đoạn thực tập sản xuất.",
    "Nguồn cũng cho biết công tác tuyển sinh toàn Trường mới đạt 45,88% kế hoạch trong nửa đầu năm. Con số này giúp đặt các kết quả chất lượng đào tạo vào đúng bối cảnh cạnh tranh lao động đang diễn ra.",
  ],
  sections: [
    {title: "Tuyển sinh nghề mỏ bắt đầu từ niềm tin tại địa bàn", paragraphs: [
      "Cách làm được mô tả bằng việc bám người, bám hộ gia đình và bám địa bàn. Tư vấn viên phải nói rõ nghề học, môi trường làm việc, quyền lợi và yêu cầu, đồng thời hỗ trợ hồ sơ để người lao động không bỏ cuộc vì thủ tục hoặc thông tin thiếu nhất quán.",
      "Vai trò của chính quyền cơ sở là xác nhận đầu mối và giúp thông tin tới đúng người có nhu cầu. Doanh nghiệp hầm lò tham gia từ sớm giúp người học hiểu nơi thực tập, vị trí công việc và chuẩn kỷ luật mà mình phải đáp ứng.",
    ]},
    {title: "Chất lượng đào tạo được đo bằng nhiều mốc", paragraphs: [
      "Theo nguồn, 100% học sinh vượt qua kiểm tra kết thúc môn học lần đầu; 99,4% đạt đánh giá kỹ năng nghề lần đầu, trong đó 31,1% xếp loại khá, giỏi. Đây là số liệu toàn bộ phạm vi được bài nguồn nêu, không nên tự suy thành bảo đảm cho từng cá nhân.",
      "Riêng Phân hiệu Đào tạo Cẩm Phả năm 2025 tuyển 469 người so với kế hoạch 426; hệ vừa học nghề vừa học văn hóa đạt 224 trên kế hoạch 200. Tỷ lệ bỏ học 4,5% và bỏ trong thực tập sản xuất 12% cho thấy khâu tuyển đầu vào lẫn khả năng thích nghi của người học đều cần được theo dõi.",
    ]},
    {title: "Người lao động cần tự kiểm tra mức độ phù hợp", paragraphs: [
      "Nghề mỏ hầm lò đòi hỏi sức khỏe, tính kỷ luật và khả năng làm việc theo ca. Một buổi tư vấn tốt phải giúp ứng viên hiểu cả cơ hội lẫn yêu cầu này, từ đó tránh quyết định chỉ dựa trên thu nhập được nghe kể hoặc mong muốn có việc nhanh.",
      "Người quan tâm nên dùng mạng lưới địa phương để xác minh thông tin, nhưng hồ sơ chính thức của Nhà trường và doanh nghiệp mới là căn cứ cuối cùng. Sự đồng hành có giá trị nhất khi giúp người học đi hết lộ trình, không phải chỉ hoàn thành chỉ tiêu nhập học.",
    ]},
  ],
  factsTitle: "Những chỉ dấu của mạng lưới tuyển sinh nghề mỏ",
  actionTitle: "Ứng viên nên xác minh trước khi nhập học",
  conclusionTitle: "Giữ nguồn thợ lò là giữ người học đến cùng",
  checklist: [["Nghe tư vấn đủ hai chiều", "Tìm hiểu cả quyền lợi, yêu cầu sức khỏe, ca kíp và kỷ luật nghề."], ["Dùng đúng đầu mối", "Đối chiếu thông tin từ địa phương, Nhà trường và doanh nghiệp tiếp nhận."], ["Chuẩn bị giai đoạn thực tập", "Hỏi rõ nơi ở, lịch sản xuất, hướng dẫn an toàn và tiêu chí đánh giá."], ["Không xem tỷ lệ chung là bảo đảm", "Kết quả của tập thể không thay thế nỗ lực và điều kiện của từng người."]],
  takeaway: "Mạng lưới tuyển sinh của Trường Cao đẳng TKV đang gắn địa phương với 14 doanh nghiệp hầm lò, đồng hành từ tư vấn đến thực tập. Các tỷ lệ đào tạo tích cực đi cùng một thực tế: giữ người học trong giai đoạn sản xuất vẫn là khâu cần đặc biệt chú ý.",
  faq: [["Nhà trường đã phối hợp với bao nhiêu địa phương?", "Trong nửa đầu năm 2026, nguồn nêu 16 xã, phường ký quy chế phối hợp và 19 xã, phường ký biên bản ghi nhớ."], ["Doanh nghiệp hầm lò có tham gia tuyển sinh không?", "Có. Bài nguồn cho biết 14/14 doanh nghiệp khai thác hầm lò cùng tham gia tuyển sinh và chăm sóc người học."], ["Tỷ lệ 99,4% có nghĩa mọi học viên đều chắc chắn tốt nghiệp không?", "Không. Đây là tỷ lệ đạt đánh giá kỹ năng nghề lần đầu trong phạm vi nguồn công bố, không phải bảo đảm cho từng học viên."], ["Vì sao giai đoạn thực tập cần được chú ý?", "Nguồn nêu tỷ lệ bỏ trong thực tập sản xuất tại Phân hiệu Cẩm Phả năm 2025 là 12%, cao hơn tỷ lệ bỏ học 4,5%." ]],
  sources: [{publisher: "Báo Quảng Ninh", title: "Người bí thư chi bộ bám địa bàn, giữ nguồn thợ lò cho TKV", date: "20/07/2026", url: images["giu-nguon-tho-lo-tkv-tu-dia-ban-quang-ninh-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ cách Trường Cao đẳng TKV kết nối địa phương, doanh nghiệp để tuyển sinh và giữ nguồn thợ lò tại Quảng Ninh.",
});

export const youthSocialSupportArticle20260831 = withImage("tuoi-tre-tkv-an-sinh-hung-yen-thang-thanh-nien-2026", {
  updated: "2026-08-31T09:18:00+07:00",
  published: "2026-08-31T09:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/31/tuoi-tre-tkv-an-sinh-hung-yen-thang-thanh-nien-2026",
  related: ["doan-thanh-nien-tkv-25-hoc-bong-thap-sang-uoc-mo", "kho-van-da-bac-tang-phong-hoc-stem-ba-che-2026", "dong-ta-phoi-ho-tro-108-ho-kho-khan-hop-thanh-2026", "tuyen-than-cua-ong-ho-tro-cuu-nu-thanh-nien-xung-phong-2026"],
  section: "An sinh xã hội",
  title: "Tuổi trẻ TKV dành 100 triệu đồng hỗ trợ cộng đồng tại Hưng Yên",
  description: "Đoàn Thanh niên TKV trao gói an sinh 100 triệu đồng cho Tỉnh đoàn Hưng Yên, gồm 50 học bổng và một công trình Thắp sáng đường quê.",
  lead: "Gói hỗ trợ kết hợp học bổng với hạ tầng cộng đồng, tạo tác động ở cả từng học sinh khó khăn và không gian sinh hoạt chung tại địa phương.",
  keyword: "Đoàn Thanh niên TKV hỗ trợ Hưng Yên 2026",
  keywords: ["Đoàn Thanh niên TKV hỗ trợ Hưng Yên 2026", "50 suất học bổng học sinh khó khăn", "công trình Thắp sáng đường quê", "TKV an sinh xã hội", "hỗ trợ cộng đồng Hưng Yên", "Tháng Thanh niên 2026"],
  facts: [["100 triệu đồng", "Tổng giá trị các biển hỗ trợ an sinh được trao cho Tỉnh đoàn Hưng Yên."], ["50 suất học bổng", "Phần hỗ trợ dành cho học sinh có hoàn cảnh khó khăn."], ["Một công trình", "Công trình thanh niên Thắp sáng đường quê thuộc gói hỗ trợ."], ["28/02/2026", "Ngày hoạt động diễn ra theo mô tả của nguồn."]],
  intro: [
    "Tại lễ ra quân Tháng Thanh niên 2026 của Tỉnh đoàn Hưng Yên sáng 28/02, Đoàn Thanh niên TKV trao các biển hỗ trợ an sinh xã hội tổng trị giá 100 triệu đồng. Chương trình <strong>Đoàn Thanh niên TKV hỗ trợ Hưng Yên 2026</strong> gồm 50 suất học bổng cho học sinh khó khăn và một công trình thanh niên “Thắp sáng đường quê”.",
    "Kinh phí cho công trình do Đoàn Thanh niên Công ty CP Kinh doanh than Miền Bắc – Vinacomin hỗ trợ. Nguồn không tách giá trị từng suất học bổng hoặc phần kinh phí của công trình, vì vậy không nên tự chia tổng số tiền để suy ra mức hỗ trợ riêng.",
    "Bài nguồn được TKV đăng ngày 02/03/2026 nhưng mới xuất hiện trong kết quả lập chỉ mục của đợt quét này. Việc đối chiếu toàn bộ sổ URL cho thấy sự kiện chưa được xử lý trên website.",
  ],
  sections: [
    {title: "Một gói hỗ trợ, hai lớp nhu cầu cộng đồng", paragraphs: [
      "Học bổng hướng trực tiếp tới học sinh có hoàn cảnh khó khăn, giúp chia sẻ một phần chi phí học tập. Công trình chiếu sáng lại phục vụ không gian chung, có thể hỗ trợ việc đi lại và sinh hoạt tại khu dân cư nơi triển khai.",
      "Cách kết hợp này mở rộng hoạt động an sinh từ hỗ trợ từng trường hợp sang hạ tầng dùng chung. Trách nhiệm của đơn vị tài trợ vì thế bao gồm xác định địa điểm, chất lượng thi công và cơ chế bàn giao, vận hành.",
    ]},
    {title: "Phối hợp địa phương giúp hỗ trợ tới đúng đối tượng", paragraphs: [
      "Tỉnh đoàn Hưng Yên là đầu mối tiếp nhận, có vai trò phối hợp lựa chọn học sinh và địa bàn công trình. Sự tham gia của tổ chức địa phương giúp gói hỗ trợ gắn với nhu cầu thực tế hơn, đồng thời tạo cơ sở theo dõi sau trao tặng.",
      "Đối với TKV, hoạt động mở rộng mối liên hệ với cộng đồng ngoài vùng sản xuất trực tiếp. Tuy nhiên, ý nghĩa nên được nhìn ở giá trị hỗ trợ đã công bố, không cần cường điệu thành tác động dài hạn khi nguồn chưa có dữ liệu đánh giá sau chương trình.",
    ]},
    {title: "Minh bạch phân bổ giữ trọn ý nghĩa chương trình", paragraphs: [
      "Tổng giá trị 100 triệu đồng bao gồm cả học bổng và công trình. Khi truyền thông, cần tránh diễn đạt khiến người đọc hiểu toàn bộ số tiền dành riêng cho 50 học sinh hoặc tự quy đổi thành mức học bổng mỗi em.",
      "Các thông tin tiếp theo như danh sách người nhận, địa điểm công trình và thời điểm hoàn thành nên được xác nhận từ đơn vị tổ chức. Minh bạch ở từng khâu giúp cộng đồng hiểu đúng đóng góp và tạo niềm tin cho những chương trình kế tiếp.",
    ]},
  ],
  factsTitle: "Cơ cấu gói an sinh tại Hưng Yên",
  actionTitle: "Cách theo dõi chương trình đúng thông tin",
  conclusionTitle: "Hỗ trợ bền hơn khi có đầu mối địa phương",
  checklist: [["Không tự chia tổng kinh phí", "Nguồn không công bố giá trị từng học bổng hoặc riêng công trình."], ["Theo dõi đầu mối tiếp nhận", "Tỉnh đoàn Hưng Yên phối hợp triển khai tại địa phương."], ["Xác minh công trình", "Chờ thông tin chính thức về địa điểm, bàn giao và vận hành."], ["Phân biệt với đợt khác", "Không gộp sự kiện này với các chương trình học bổng TKV ở thời điểm, địa bàn khác."]],
  takeaway: "Gói an sinh có hai cấu phần: hỗ trợ học tập cho 50 em có hoàn cảnh khó khăn và hạ tầng chiếu sáng nông thôn. TKV chỉ công bố mức chung 100 triệu đồng, chưa có căn cứ xác định giá trị riêng của từng cấu phần.",
  faq: [["Gói hỗ trợ 100 triệu đồng gồm những gì?", "Gồm 50 suất học bổng cho học sinh có hoàn cảnh khó khăn và một công trình thanh niên Thắp sáng đường quê."], ["Mỗi suất học bổng trị giá bao nhiêu?", "Nguồn không công bố mức riêng từng suất, nên không thể lấy tổng kinh phí chia cho 50 học sinh."], ["Đơn vị nào hỗ trợ công trình chiếu sáng?", "Nguồn nêu Đoàn Thanh niên Công ty CP Kinh doanh than Miền Bắc – Vinacomin hỗ trợ kinh phí."], ["Sự kiện diễn ra khi nào?", "Hoạt động diễn ra sáng 28/02/2026 và bài nguồn được TKV đăng ngày 02/03/2026."]],
  sources: [{publisher: "Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam", title: "Đoàn Thanh niên TKV - Triển khai các hoạt động an sinh xã hội Hưởng ứng Tháng Thanh niên năm 2026", date: "02/03/2026", url: images["tuoi-tre-tkv-an-sinh-hung-yen-thang-thanh-nien-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật gói an sinh 100 triệu đồng của tuổi trẻ TKV tại Hưng Yên và làm rõ cơ cấu hỗ trợ được nguồn công bố.",
});

export const dailyCommunityArticles20260831 = [
  kheChamHolidayBusesArticle20260831,
  haLongTienYenTrainingArticle20260831,
  lamDongBloodDonationArticle20260831,
  localRecruitmentNetworkArticle20260831,
  youthSocialSupportArticle20260831,
];
