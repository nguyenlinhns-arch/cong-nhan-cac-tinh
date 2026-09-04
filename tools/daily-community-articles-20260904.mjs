import {dailyCommunitySourceImages20260904 as images} from "./daily-community-source-images-20260904.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, sourceImageChecksum: image.verifiedSha256, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const maoKheNationalDayCareArticle20260904 = withImage("than-mao-khe-cham-lo-nguoi-lao-dong-quoc-khanh-2026", {
  updated: "2026-09-04T08:35:00+07:00",
  published: "2026-09-04T08:35:00+07:00",
  urlPath: "tin-nganh-than/2026/09/04/than-mao-khe-cham-lo-nguoi-lao-dong-quoc-khanh-2026",
  related: ["than-mao-khe-nghi-duong-nguoi-lao-dong-2026", "than-mao-khe-ho-tro-cuu-thanh-nien-xung-phong-2026", "than-thong-nhat-trao-qua-quoc-khanh-nguoi-lao-dong-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Mạo Khê chăm lo gần 4.000 lao động dịp Quốc khánh",
  description: "Than Mạo Khê bổ sung 1 triệu đồng mỗi người cho gần 4.000 lao động, đồng thời tổ chức nghỉ mát cho 90 gia đình và 165 công nhân tiêu biểu.",
  lead: "Chuỗi hoạt động kết hợp hỗ trợ diện rộng với chương trình ghi nhận theo thành tích; từng nhóm đối tượng và mức hỗ trợ được làm rõ để người lao động không hiểu sai thành chế độ thường xuyên.",
  keyword: "Than Mạo Khê chăm lo người lao động Quốc khánh 2026",
  keywords: ["Than Mạo Khê chăm lo người lao động Quốc khánh 2026", "phúc lợi thợ mỏ Than Mạo Khê", "hỗ trợ công nhân ngành Than", "gia đình thợ lò", "việc làm ngành Than Quảng Ninh", "người lao động Than Mạo Khê"],
  facts: [["1 triệu đồng/người", "Mức bổ sung tiền lương tháng 8/2026 cho người đang làm việc tại Công ty."], ["Dự kiến 3,9 tỷ đồng", "Nguồn kinh phí của đợt bổ sung được trích từ quỹ lương."], ["90 gia đình", "Hơn 360 thành viên thuộc gia đình thợ lò, thợ cơ điện lò tiêu biểu tham gia nghỉ mát."], ["165 công nhân", "Nhóm đạt tiêu chí thi đua, ngày công và thu nhập được tổ chức tham quan riêng."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 03/09/2026 công bố chuỗi hoạt động <strong>Than Mạo Khê chăm lo người lao động Quốc khánh 2026</strong>. Điểm cần quan tâm là khoản bổ sung tiền lương tháng 8 dành cho lực lượng đang làm việc, trong khi hai chương trình tham quan có tiêu chí lựa chọn riêng.",
    "Theo nghị quyết liên tịch giữa Giám đốc và Công đoàn Công ty, mỗi cán bộ, công nhân viên, thợ lò, công nhân thử việc và học sinh thực tập đang làm việc tại đơn vị được bổ sung 1 triệu đồng. Tổng kinh phí từ quỹ lương dự kiến là 3,9 tỷ đồng, dành cho gần 4.000 lao động.",
    "Song song với hỗ trợ diện rộng, hơn 360 thành viên của 90 gia đình thợ lò, thợ cơ điện lò tiêu biểu và 165 công nhân đáp ứng tiêu chí riêng được tham gia các hành trình nghỉ ngơi. Việc tách rõ từng nhóm giúp người đọc hiểu đúng quyền lợi, không cộng gộp hay suy rộng chính sách.",
  ],
  sections: [
    {title: "Hỗ trợ diện rộng được công bố theo đầu người", paragraphs: [
      "Khoản 1 triệu đồng/người là phần bổ sung tiền lương tháng 8/2026 cho các nhóm đang làm việc tại Công ty được bài nguồn liệt kê. Phạm vi này bao gồm cả công nhân thử việc và học sinh thực tập, nhưng không có căn cứ để áp dụng cho người đã nghỉ việc hoặc lao động của đơn vị khác trong TKV.",
      "Con số 3,9 tỷ đồng mới là tổng kinh phí dự kiến. Vì vậy, không nên dùng số liệu này để khẳng định quyết toán cuối cùng hoặc tự suy ra một số lượng lao động chính xác hơn cụm gần 4.000 người mà nguồn đã công bố.",
    ]},
    {title: "Chương trình gia đình và tham quan có tiêu chí riêng", paragraphs: [
      "Từ ngày 30/08 đến 02/09, hơn 360 thành viên của 90 gia đình thợ lò, thợ cơ điện lò tiêu biểu tham gia hành trình 4 ngày 3 đêm theo hai tuyến tại Quảng Ninh. Việc mời người thân đồng hành tạo thêm khoảng thời gian nghỉ ngơi và chia sẻ sau những ca làm việc đặc thù dưới mỏ.",
      "Từ ngày 31/08 đến 02/09, Công ty còn tổ chức tham quan cho 165 công nhân đạt danh hiệu thi đua năm 2025, đồng thời có ngày công và thu nhập cao trong sáu tháng đầu năm 2026. Đây là nhóm được lựa chọn theo thành tích, không phải chương trình mặc định cho toàn bộ lao động.",
    ]},
    {title: "Phúc lợi là một phần của bức tranh việc làm ngành Than", paragraphs: [
      "Người đang tìm hiểu nghề mỏ có thể nhìn chuỗi hoạt động như một dữ kiện về cách doanh nghiệp kết hợp hỗ trợ theo dịp với ghi nhận lao động trực tiếp. Quyết định học nghề hoặc nhận việc vẫn cần dựa trên sức khỏe, vị trí, ca kíp, yêu cầu an toàn và chế độ được xác nhận tại thời điểm tuyển dụng.",
      "Thông tin phúc lợi chỉ hữu ích khi đi cùng đối tượng, điều kiện và thời gian cụ thể. Cách đọc này vừa ghi nhận đúng nỗ lực chăm lo của Than Mạo Khê, vừa tránh biến một chương trình theo dịp thành lời hứa về thu nhập hay quyền lợi lâu dài.",
    ]},
  ],
  factsTitle: "Ba nhóm quyền lợi được công bố",
  actionTitle: "Người lao động nên kiểm tra điều gì",
  conclusionTitle: "Chăm lo đúng đối tượng tạo thêm sự gắn kết",
  checklist: [["Xác nhận khoản bổ sung", "Đối chiếu mức 1 triệu đồng/người với bảng lương hoặc thông báo tháng 8/2026."], ["Phân biệt các nhóm", "Khoản bổ sung áp dụng diện rộng; hai chương trình tham quan có tiêu chí lựa chọn riêng."], ["Không coi kinh phí dự kiến là quyết toán", "Nguồn chỉ công bố mức dự kiến 3,9 tỷ đồng."], ["Kiểm tra thông báo nội bộ", "Trao đổi với đơn vị, nhân sự hoặc Công đoàn nếu thông tin nhận được chưa thống nhất."]],
  takeaway: "Than Mạo Khê công bố bổ sung 1 triệu đồng mỗi người cho gần 4.000 lao động, với kinh phí dự kiến 3,9 tỷ đồng, cùng các chuyến đi cho 90 gia đình và 165 công nhân tiêu biểu. Ba nhóm có phạm vi khác nhau và không nên được hiểu là một chế độ chung áp dụng lâu dài.",
  faq: [["Ai được bổ sung 1 triệu đồng dịp Quốc khánh?", "Nguồn nêu cán bộ, công nhân viên, thợ lò, công nhân thử việc và học sinh thực tập đang làm việc tại Công ty Than Mạo Khê."], ["3,9 tỷ đồng đã là số quyết toán cuối cùng chưa?", "Chưa. Bài nguồn ghi đây là tổng kinh phí dự kiến trích từ quỹ lương."], ["Có bao nhiêu gia đình tham gia nghỉ mát?", "Có 90 gia đình thợ lò, thợ cơ điện lò tiêu biểu, với hơn 360 thành viên."], ["165 công nhân được lựa chọn theo tiêu chí nào?", "Nguồn nêu họ đạt danh hiệu thi đua năm 2025 và có ngày công, thu nhập cao trong sáu tháng đầu năm 2026."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Công ty Than Mạo Khê: nhiều hoạt động thiết thực dịp Quốc khánh 2/9", date: "03/09/2026", url: images["than-mao-khe-cham-lo-nguoi-lao-dong-quoc-khanh-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật chuỗi hoạt động Than Mạo Khê chăm lo người lao động dịp Quốc khánh 2026 và làm rõ từng nhóm thụ hưởng.",
});

export const thongNhatFamilyHolidayArticle20260904 = withImage("than-thong-nhat-nghi-mat-90-gia-dinh-nguoi-lao-dong-2026", {
  updated: "2026-09-04T08:35:00+07:00",
  published: "2026-09-04T08:35:00+07:00",
  urlPath: "tin-nganh-than/2026/09/04/than-thong-nhat-nghi-mat-90-gia-dinh-nguoi-lao-dong-2026",
  related: ["than-thong-nhat-trao-qua-quoc-khanh-nguoi-lao-dong-2026", "than-thong-nhat-kham-suc-khoe-lao-dong-nang-nhoc-2026", "than-khe-cham-nghi-mat-90-gia-dinh-tho-lo-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Thống Nhất tổ chức nghỉ mát cho 90 gia đình lao động tiêu biểu",
  description: "Than Thống Nhất tổ chức chương trình nghỉ mát năm 2026 tại Hạ Long và Sa Pa cho 90 gia đình công nhân hầm lò, cơ điện lò tiêu biểu.",
  lead: "Chương trình đưa gia đình vào hoạt động biểu dương công nhân hầm lò, cơ điện lò; bài viết làm rõ đây là nhóm tiêu biểu được lựa chọn, không phải quyền lợi mặc định cho mọi lao động.",
  keyword: "Than Thống Nhất nghỉ mát 90 gia đình người lao động 2026",
  keywords: ["Than Thống Nhất nghỉ mát 90 gia đình người lao động 2026", "gia đình thợ lò", "phúc lợi thợ mỏ Than Thống Nhất", "công nhân cơ điện lò", "người lao động ngành Than", "việc làm ngành Than Quảng Ninh"],
  facts: [["90 gia đình", "Nhóm gia đình người lao động tiêu biểu được lựa chọn tham gia chương trình."], ["Hạ Long và Sa Pa", "Hai điểm đến được bài nguồn công bố."], ["10/07/2026", "Ngày ban hành Công văn số 4871/TKV-TCNS làm căn cứ triển khai."], ["Công nhân hầm lò, cơ điện lò", "Hai nhóm lao động trực tiếp được chương trình biểu dương, tôn vinh."]],
  intro: [
    "Công ty Than Thống Nhất – TKV tổ chức chương trình tham quan, nghỉ mát năm 2026 cho 90 gia đình người lao động tiêu biểu tại Hạ Long và Sa Pa. Thông tin công bố ngày 29/08 được cập nhật ngày 03/09, làm rõ thêm ý nghĩa đồng hành của gia đình với công nhân làm việc trực tiếp dưới mỏ.",
    "Điểm cần lưu ý của <strong>Than Thống Nhất nghỉ mát 90 gia đình người lao động 2026</strong> là phạm vi dành cho nhóm tiêu biểu được lựa chọn. Chương trình dựa trên Công văn số 4871/TKV-TCNS ngày 10/07/2026 của TKV và hướng tới kỷ niệm 90 năm truyền thống ngành Than.",
    "Nguồn nhấn mạnh việc biểu dương công nhân khai thác hầm lò và công nhân cơ điện lò tiêu biểu, gương mẫu. Bài nguồn không công bố lịch đi cụ thể, tổng kinh phí hay mức chi theo gia đình, nên các thông tin đó không được tự bổ sung.",
  ],
  sections: [
    {title: "Gia đình cùng chia sẻ sự ghi nhận nghề mỏ", paragraphs: [
      "Công việc hầm lò gắn với yêu cầu cao về sức khỏe, kỷ luật an toàn và nhịp làm việc theo ca. Khi người thân được mời tham gia chương trình, sự ghi nhận không dừng ở cá nhân mà mở rộng tới gia đình đã đồng hành với người lao động trong đời sống hằng ngày.",
      "Hai điểm đến Hạ Long và Sa Pa tạo không gian nghỉ ngơi, trải nghiệm và tăng kết nối giữa các gia đình. Dù vậy, nguồn chỉ xác nhận chương trình cho 90 gia đình tiêu biểu; không có căn cứ suy rộng thành chế độ nghỉ mát chung của toàn bộ lao động Than Thống Nhất.",
    ]},
    {title: "Tiêu chí tiêu biểu làm rõ bản chất chương trình", paragraphs: [
      "Bài nguồn xác định đối tượng được biểu dương là công nhân khai thác hầm lò và công nhân cơ điện lò tiêu biểu, gương mẫu trong lao động sản xuất. Đây là hoạt động ghi nhận theo lựa chọn, khác với quyền lợi bắt buộc được quy định trong hợp đồng hoặc chính sách áp dụng đồng loạt.",
      "Việc công bố căn cứ triển khai giúp người lao động có thêm thông tin để đối chiếu. Tuy nhiên, do nguồn không nêu chi tiết cách chấm chọn, danh sách hay mức chi, các câu hỏi cá nhân cần được xác nhận qua đơn vị, bộ phận nhân sự hoặc Công đoàn Công ty.",
    ]},
    {title: "Thông tin phúc lợi cần được đặt đúng trong lựa chọn nghề nghiệp", paragraphs: [
      "Đối với người cân nhắc học nghề mỏ hoặc việc làm ngành Than, chương trình phản ánh một lát cắt về văn hóa chăm lo tại doanh nghiệp. Nó không thay thế các thông tin quan trọng hơn như tiêu chuẩn sức khỏe, nội dung đào tạo, vị trí làm việc, ca kíp, an toàn và thu nhập theo kết quả lao động.",
      "Hiểu đúng phạm vi giúp người đọc có thiện cảm dựa trên dữ kiện thật, thay vì kỳ vọng một quyền lợi chưa được cam kết. Đây cũng là cách ghi nhận giá trị nhân văn của chương trình mà không cường điệu thành bảo đảm việc làm hoặc thu nhập.",
    ]},
  ],
  factsTitle: "90 gia đình trong chương trình Than Thống Nhất",
  actionTitle: "Người lao động nên đối chiếu ra sao",
  conclusionTitle: "Sự đồng hành của gia đình tiếp thêm gắn bó",
  checklist: [["Xác nhận đúng nhóm", "Chương trình dành cho 90 gia đình người lao động tiêu biểu được lựa chọn."], ["Không tự suy đoán chi phí", "Nguồn không công bố tổng kinh phí hoặc mức chi theo gia đình."], ["Kiểm tra tiêu chí nội bộ", "Trao đổi với Công đoàn hoặc đơn vị nếu cần biết điều kiện lựa chọn cụ thể."], ["Đánh giá nghề nghiệp toàn diện", "Bên cạnh phúc lợi, cần kiểm tra sức khỏe, đào tạo, ca kíp, an toàn và chế độ tại thời điểm tuyển dụng."]],
  takeaway: "Giá trị của chương trình nằm ở việc người thân cùng chia sẻ sự ghi nhận dành cho công nhân hầm lò, cơ điện lò gương mẫu. Phạm vi lựa chọn cụ thể cũng nhắc người đọc không suy rộng hoạt động này thành quyền lợi chung cho toàn đơn vị.",
  faq: [["Chương trình có bao nhiêu gia đình tham gia?", "Nguồn chính thức công bố 90 gia đình người lao động tiêu biểu."], ["Các gia đình đi nghỉ mát ở đâu?", "Hai điểm đến được công bố là Hạ Long và Sa Pa."], ["Nhóm lao động nào được chương trình biểu dương?", "Công nhân khai thác hầm lò và công nhân cơ điện lò tiêu biểu, gương mẫu trong lao động sản xuất."], ["Nguồn có công bố tổng kinh phí không?", "Không. Bài nguồn không nêu tổng kinh phí hoặc mức chi cho từng gia đình."]],
  sources: [{publisher: "Công ty Than Thống Nhất – TKV", title: "Lan tỏa yêu thương từ hành trình nghỉ mát của 90 gia đình người lao động tiêu biểu Công ty Than Thống Nhất - TKV", date: "29/08/2026", url: images["than-thong-nhat-nghi-mat-90-gia-dinh-nguoi-lao-dong-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật chương trình Than Thống Nhất nghỉ mát cho 90 gia đình người lao động tiêu biểu tại Hạ Long và Sa Pa.",
});

export const dailyCommunityArticles20260904 = [
  maoKheNationalDayCareArticle20260904,
  thongNhatFamilyHolidayArticle20260904,
];
