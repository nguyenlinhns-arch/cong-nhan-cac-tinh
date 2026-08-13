import {dailyCommunitySourceImages20260813 as images} from "./daily-community-source-images-20260813.mjs";

const publisher = "Công đoàn Than – Khoáng sản Việt Nam";
const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const thanNuiBeoNghiDuongArticle20260813 = withImage("than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026", {
  updated: "2026-08-13T08:56:00+07:00", published: "2026-08-13T08:56:00+07:00",
  urlPath: "tin-nganh-than/2026/08/13/than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026",
  related: ["than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026", "phuc-loi-tho-mo-mo-viet-bac-2026", "phuc-loi-tho-mo-tkv-2026", "than-nui-beo-cao-bang-phoi-hop-tuyen-sinh-2026"],
  section: "An sinh xã hội",
  title: "Than Núi Béo tổ chức nghỉ dưỡng cho 60 gia đình thợ lò",
  description: "Than Núi Béo tổ chức nghỉ dưỡng cho 60 gia đình thợ lò tiêu biểu trong tháng 7–8/2026, chia sáu đoàn tới Sa Pa, Ninh Bình và Hạ Long.",
  lead: "Chương trình lựa chọn công khai từ các tổ sản xuất và mở rộng suất nghỉ dưỡng tới vợ, con của thợ lò, đưa phúc lợi từ cá nhân tới cả gia đình.",
  keyword: "Than Núi Béo nghỉ dưỡng gia đình thợ lò 2026",
  keywords: ["Than Núi Béo nghỉ dưỡng gia đình thợ lò 2026", "phúc lợi thợ mỏ", "gia đình thợ lò", "đời sống công nhân Than Núi Béo", "nghỉ dưỡng công nhân TKV", "việc làm ngành Than Quảng Ninh"],
  facts: [["60 gia đình", "Số gia đình thợ lò tiêu biểu tham gia chương trình."], ["6 đoàn", "Các gia đình được chia thành sáu đoàn để tổ chức hành trình."], ["3 điểm đến", "Sa Pa, Ninh Bình hoặc Hạ Long là những lựa chọn được công bố."], ["Tháng 7–8/2026", "Thời gian Than Núi Béo triển khai chương trình nghỉ dưỡng."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 10/08/2026 đăng thông tin về chương trình <strong>Than Núi Béo nghỉ dưỡng gia đình thợ lò 2026</strong>. Trong tháng 7 và tháng 8, Công ty Cổ phần Than Núi Béo tổ chức tham quan, nghỉ dưỡng cho 60 gia đình thợ lò tiêu biểu.",
    "Danh sách được bình xét từ các tổ sản xuất tại công trường, phân xưởng. Mỗi suất bao gồm thợ lò cùng vợ, con; 60 gia đình chia thành sáu đoàn, lựa chọn một trong ba điểm đến Sa Pa, Ninh Bình hoặc Hạ Long.",
    "Cách tổ chức này mở rộng đối tượng thụ hưởng từ người lao động sang gia đình. Với công việc hầm lò có cường độ cao và thời gian theo ca, sự đồng hành của người thân là một phần quan trọng giúp công nhân giữ nhịp sống ổn định.",
  ],
  sections: [
    {title: "Than Núi Béo nghỉ dưỡng gia đình thợ lò theo tiêu chí công khai", paragraphs: [
      "Bài nguồn nêu việc bình xét, lựa chọn được thực hiện từ các tổ sản xuất. Quy trình ở cấp tổ giúp thành tích ngày công, kỷ luật, an toàn và đóng góp thực tế của thợ lò được nhìn nhận gần với nơi làm việc.",
      "Tính công khai cần thể hiện ở tiêu chí, danh sách, thời gian và quyền lợi đi kèm. Người lao động nên được biết rõ căn cứ lựa chọn; đơn vị cũng cần có kênh giải đáp khi công nhân muốn kiểm tra thông tin hoặc phản ánh trường hợp bị bỏ sót.",
    ]},
    {title: "Một suất phúc lợi dành cho cả người thân", paragraphs: [
      "Việc mời vợ và con cùng tham gia làm cho kỳ nghỉ khác với một đợt tham quan cá nhân. Gia đình có thêm thời gian bên nhau, hiểu hơn về môi trường tập thể của người lao động và cùng chia sẻ niềm vui từ thành tích làm việc.",
      "Phúc lợi gia đình không thay thế tiền lương, bảo hiểm hoặc điều kiện an toàn. Đây là lớp hỗ trợ tinh thần bổ sung, ghi nhận vai trò hậu phương và tạo động lực để người thợ yên tâm gắn bó lâu dài.",
    ]},
    {title: "Sáu đoàn giúp tổ chức phù hợp nhịp sản xuất", paragraphs: [
      "Chia 60 gia đình thành sáu đoàn giúp Công ty bố trí lịch phù hợp kế hoạch ca kíp, đồng thời giảm áp lực tổ chức tại một thời điểm. Ba điểm đến tạo lựa chọn đa dạng về quãng đường và trải nghiệm.",
      "Chương trình chỉ đạt mục tiêu khi lịch nghỉ không làm người lao động phải đánh đổi quyền lợi khác. Các nội dung về phương tiện, lưu trú, số người đi cùng và xử lý tình huống sức khỏe cần được thông báo rõ trước chuyến đi.",
    ]},
    {title: "Phúc lợi thợ mỏ cần được nhìn trong tổng thể việc làm", paragraphs: [
      "Người đang tìm hiểu việc làm ngành Than Quảng Ninh nên đánh giá cả lương, an toàn, ăn ở, chăm sóc sức khỏe và phúc lợi gia đình. Một chuyến nghỉ dưỡng là tín hiệu tích cực nhưng không đại diện cho toàn bộ chế độ hoặc áp dụng mặc định với mọi lao động.",
      "Mỗi đơn vị có tiêu chí và nguồn kinh phí riêng. Người lao động cần đọc thông báo chính thức của doanh nghiệp, hỏi Công đoàn tại nơi làm việc và tránh suy rộng quyền lợi của Than Núi Béo sang công ty khác.",
    ]},
  ],
  factsTitle: "Quy mô chương trình đã được công bố", actionTitle: "Gia đình tham gia cần xác nhận gì", conclusionTitle: "Chăm lo gia đình giúp phúc lợi gần người lao động hơn",
  checklist: [["Xem tiêu chí", "Đối chiếu điều kiện bình xét của tổ sản xuất và đơn vị."], ["Xác nhận người đi", "Kiểm tra phạm vi vợ, con cùng giấy tờ cần chuẩn bị."], ["Nắm lịch đoàn", "Biết rõ thời gian, điểm đến, phương tiện và đầu mối phụ trách."], ["Hỏi quyền lợi", "Phân biệt khoản Công ty chi trả với chi phí cá nhân tự nguyện."]],
  takeaway: "Than Núi Béo tổ chức nghỉ dưỡng cho 60 gia đình thợ lò, chia sáu đoàn tới ba điểm đến. Giá trị nổi bật của chương trình là ghi nhận người lao động và đưa người thân vào phạm vi chăm lo.",
  faq: [["Có bao nhiêu gia đình thợ lò được tham gia?", "Bài nguồn công bố 60 gia đình thợ lò tiêu biểu."], ["Chương trình tổ chức ở đâu?", "Các đoàn lựa chọn Sa Pa, Ninh Bình hoặc Hạ Long."], ["Người thân nào được tham gia cùng thợ lò?", "Mỗi suất bao gồm vợ và con của thợ lò theo thông tin công bố."], ["Quyền lợi này có áp dụng cho mọi công nhân TKV không?", "Không. Đây là chương trình của Than Núi Béo, thực hiện theo bình xét và kế hoạch riêng."]],
  sources: [{publisher, title: "60 gia đình thợ lò Than Núi Béo được đi tham quan, nghỉ dưỡng", date: "10/08/2026", url: images["than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ chương trình Than Núi Béo nghỉ dưỡng gia đình thợ lò 2026 và ý nghĩa phúc lợi dành cho người thân công nhân.",
});

export const thanMaoKheNghiDuongArticle20260813 = withImage("than-mao-khe-nghi-duong-nguoi-lao-dong-2026", {
  updated: "2026-08-13T08:57:00+07:00", published: "2026-08-13T08:57:00+07:00",
  urlPath: "tin-nganh-than/2026/08/13/than-mao-khe-nghi-duong-nguoi-lao-dong-2026",
  related: ["than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026", "than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026", "phuc-loi-tho-mo-mo-viet-bac-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Mạo Khê tri ân 83 lao động xuất sắc tại Hạ Long",
  description: "Than Mạo Khê tổ chức kỳ nghỉ Hạ Long cho 83 lao động xuất sắc trong nhóm 252 thợ mỏ tiêu biểu, ghi nhận thành tích sản xuất và an toàn năm 2026.",
  lead: "Hành trình hai ngày một đêm ngày 08–09/08 là một phần chương trình tri ân người lao động tiêu biểu thuộc Tháng Công nhân năm 2026.",
  keyword: "Than Mạo Khê nghỉ dưỡng người lao động 2026",
  keywords: ["Than Mạo Khê nghỉ dưỡng người lao động 2026", "83 công nhân Than Mạo Khê", "252 thợ mỏ tiêu biểu", "phúc lợi thợ mỏ", "an toàn lao động mỏ", "đời sống công nhân TKV"],
  facts: [["83 người", "Số lao động tham gia kỳ nghỉ ngày 08–09/08."], ["252 thợ mỏ", "Quy mô nhóm lao động tiêu biểu được Công ty tổ chức tri ân trong đợt."], ["2 ngày 1 đêm", "Thời lượng hành trình tại Vịnh Hạ Long."], ["Hai tiêu chí", "Thành tích lao động sản xuất và bảo đảm an toàn được nêu trong bài nguồn."]],
  intro: [
    "Ngày 10/08/2026, Công đoàn Than – Khoáng sản Việt Nam đăng bài về chương trình <strong>Than Mạo Khê nghỉ dưỡng người lao động 2026</strong>. Trong hai ngày 08 và 09/08, Công ty tổ chức kỳ nghỉ tại Vịnh Hạ Long cho 83 người có thành tích xuất sắc trong lao động sản xuất và bảo đảm an toàn.",
    "Nhóm 83 người nằm trong diện 252 thợ mỏ tiêu biểu được Công ty tri ân trong đợt thuộc Tháng Công nhân năm 2026. Hành trình kéo dài hai ngày một đêm, gồm tham quan và hoạt động tập thể trên Vịnh Hạ Long.",
    "Các con số cần được hiểu đúng: 83 là số người tham gia chuyến đi được bài nguồn phản ánh, còn 252 là tổng nhóm thợ mỏ tiêu biểu trong đợt tri ân. Không nên coi toàn bộ 252 người cùng tham gia một hành trình.",
  ],
  sections: [
    {title: "Than Mạo Khê nghỉ dưỡng người lao động gắn với an toàn", paragraphs: [
      "Bài nguồn đặt thành tích sản xuất và bảo đảm an toàn cạnh nhau khi mô tả đối tượng được lựa chọn. Cách ghi nhận này cho thấy kết quả công việc cần đi cùng kỷ luật và trách nhiệm phòng ngừa rủi ro.",
      "Để việc bình xét tạo động lực đúng hướng, tiêu chí an toàn phải được lượng hóa bằng hành vi tuân thủ, chất lượng công việc và đóng góp cho tổ đội. Năng suất không thể là lý do bỏ qua quy trình hoặc chấp nhận nguy cơ.",
    ]},
    {title: "Kỳ nghỉ hai ngày một đêm hỗ trợ tái tạo sức lao động", paragraphs: [
      "Lịch trình tại Hạ Long tạo khoảng nghỉ ngoài môi trường sản xuất, giúp người lao động giao lưu giữa các đơn vị và phục hồi tinh thần. Hoạt động tập thể còn tăng sự kết nối giữa những cá nhân cùng được biểu dương.",
      "Nghỉ dưỡng là phúc lợi ngắn hạn, không phải biện pháp phục hồi sức khỏe nghề nghiệp thay cho khám định kỳ hoặc bố trí công việc phù hợp. Doanh nghiệp vẫn cần duy trì điều kiện lao động, thời gian nghỉ ca và theo dõi sức khỏe lâu dài.",
    ]},
    {title: "Phân biệt 83 người tham gia và 252 thợ mỏ tiêu biểu", paragraphs: [
      "Việc tách rõ hai mốc giúp người đọc không hiểu sai quy mô. Bài nguồn xác nhận 83 người tham gia chuyến đi ngày 08–09/08; những người này thuộc diện 252 thợ mỏ tiêu biểu được tri ân trong đợt.",
      "Nếu chương trình được tổ chức theo nhiều nhóm hoặc nhiều thời điểm, Công ty nên tiếp tục công bố lịch và hình thức dành cho các nhóm còn lại. Thông tin minh bạch giúp người lao động biết đúng quyền lợi và hạn chế so sánh thiếu căn cứ.",
    ]},
    {title: "Ghi nhận đúng cách góp phần giữ người lao động", paragraphs: [
      "Phần thưởng tinh thần có tác dụng khi người được chọn cảm thấy nỗ lực của mình được nhìn nhận công bằng. Đồng nghiệp cũng cần thấy tiêu chí có thể đạt bằng ngày công, tay nghề, kỷ luật và đóng góp thực tế, không phụ thuộc đánh giá cảm tính.",
      "Với người tìm hiểu nghề mỏ, phúc lợi nên được xem cùng thu nhập, an toàn, nhà ở và cơ hội nâng nghề. Chuyến đi của Than Mạo Khê là thông tin tại một đơn vị, không phải cam kết chung cho mọi vị trí trong toàn TKV.",
    ]},
  ],
  factsTitle: "Các mốc cần phân biệt trong chương trình", actionTitle: "Người lao động nên đối chiếu gì", conclusionTitle: "Tri ân có ý nghĩa khi thành tích và an toàn cùng được ghi nhận",
  checklist: [["Kiểm tra tiêu chí", "Xem rõ yêu cầu về sản xuất, ngày công, kỷ luật và an toàn."], ["Phân biệt quy mô", "Không đồng nhất 83 người đi đợt này với toàn bộ 252 người tiêu biểu."], ["Nắm quyền lợi", "Xác nhận lịch trình, chi phí được hỗ trợ và phần tự chi trả nếu có."], ["Phản hồi sau chuyến", "Góp ý về tổ chức và nhu cầu phục hồi sức khỏe thực tế."]],
  takeaway: "Than Mạo Khê tổ chức kỳ nghỉ Hạ Long cho 83 lao động trong nhóm 252 thợ mỏ tiêu biểu. Việc gắn biểu dương sản xuất với thành tích an toàn giúp phúc lợi hướng đúng hành vi nghề nghiệp bền vững.",
  faq: [["Có bao nhiêu người tham gia chuyến nghỉ dưỡng?", "Có 83 người lao động tham gia hành trình ngày 08–09/08/2026."], ["Con số 252 có ý nghĩa gì?", "Đây là số thợ mỏ tiêu biểu được Công ty tổ chức tri ân trong đợt; 83 người là nhóm tham gia chuyến đi được phản ánh."], ["Chương trình kéo dài bao lâu?", "Hành trình tại Vịnh Hạ Long kéo dài hai ngày một đêm."], ["Đối tượng được lựa chọn theo tiêu chí nào?", "Bài nguồn nêu thành tích xuất sắc trong lao động sản xuất và bảo đảm an toàn."]],
  sources: [{publisher, title: "Chuyến đi gắn kết yêu thương của những thợ mỏ Than Mạo Khê xuất sắc", date: "10/08/2026", url: images["than-mao-khe-nghi-duong-nguoi-lao-dong-2026"].sourceUrl}],
  seoLine: "Bài viết phân tích chương trình Than Mạo Khê nghỉ dưỡng người lao động 2026, quy mô 83 người và tiêu chí sản xuất an toàn.",
});

export const xayLapMoViecLamArticle20260813 = withImage("viec-lam-cong-ty-xay-lap-mo-2026", {
  updated: "2026-08-13T08:58:00+07:00", published: "2026-08-13T08:58:00+07:00",
  urlPath: "tin-nganh-than/2026/08/13/viec-lam-cong-ty-xay-lap-mo-2026",
  related: ["viec-lam-nganh-than-thang-8-2026", "than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026", "co-dien-uong-bi-on-dinh-viec-lam-nguoi-lao-dong-2026", "nha-o-tho-mo-quang-ninh-2026"],
  section: "An sinh xã hội",
  title: "Xây lắp mỏ duy trì việc làm cho hơn 2.000 lao động",
  description: "Công ty Xây lắp mỏ có 2.038 lao động cuối tháng 6/2026; lương bình quân 20,683 triệu đồng/tháng, riêng thợ lò đạt 23,3 triệu đồng.",
  lead: "Trong điều kiện địa bàn thi công rộng và thường xuyên điều động lao động, Công ty tập trung giữ việc làm, tuyển dụng, tái tuyển và cải thiện nơi ở cho công nhân xa nhà.",
  keyword: "việc làm Công ty Xây lắp mỏ 2026",
  keywords: ["việc làm Công ty Xây lắp mỏ 2026", "tuyển thợ lò", "lương thợ lò Xây lắp mỏ", "tuyển dụng ngành Than", "nhà ở công nhân mỏ", "việc làm ngành Than Quảng Ninh"],
  facts: [["2.038 lao động", "Quy mô lao động của Công ty đến cuối tháng 6/2026."], ["20,683 triệu đồng", "Tiền lương bình quân mỗi người mỗi tháng trong sáu tháng đầu năm."], ["23,3 triệu đồng", "Tiền lương bình quân của riêng thợ lò mỗi người mỗi tháng."], ["Tăng 2,5%", "Mức tăng lương bình quân so với cùng kỳ năm 2025."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 12/08/2026 đăng kết quả làm việc về <strong>việc làm Công ty Xây lắp mỏ 2026</strong>. Đến cuối tháng 6, Công ty có 2.038 lao động và duy trì việc làm trong điều kiện thi công đào lò tại nhiều đơn vị, địa bàn rộng, thường xuyên chuyển diện sản xuất.",
    "Tiền lương bình quân sáu tháng đầu năm đạt 20,683 triệu đồng/người/tháng, tăng 2,5% so với cùng kỳ năm 2025; riêng thợ lò đạt 23,3 triệu đồng/người/tháng. Đây là số bình quân đã công bố, không phải mức cố định cho từng cá nhân hoặc tháng làm việc.",
    "Buổi làm việc diễn ra ngày 10/08 và đề cập đồng thời tuyển sinh, tuyển dụng, tái tuyển, giữ chân lao động, ngày công, nâng trình độ và điều kiện ăn ở. Điều đó cho thấy ổn định nhân lực cần nhiều giải pháp liên kết, không thể chỉ dựa vào một mức lương quảng bá.",
  ],
  sections: [
    {title: "Việc làm Công ty Xây lắp mỏ 2026 chịu tác động của địa bàn thi công", paragraphs: [
      "Đặc thù đào lò tại nhiều đơn vị khiến công nhân có thể phải chuyển diện sản xuất hoặc điều động giữa các điểm làm việc. Việc tổ chức nhân lực vì vậy cần gắn với kế hoạch công trình, phương tiện đưa đón, chỗ ở và thông tin sớm cho người lao động.",
      "Thị trường lao động cạnh tranh, trong khi nghề hầm lò có yêu cầu thể lực, sức khỏe và kỷ luật cao. Công ty phải vừa tuyển người mới, vận động người đã nghỉ quay lại, vừa tạo điều kiện để lực lượng hiện có duy trì ngày công và nâng tay nghề.",
    ]},
    {title: "Lương thợ lò 23,3 triệu đồng là số bình quân", paragraphs: [
      "Mức 23,3 triệu đồng/người/tháng của thợ lò cao hơn bình quân chung 20,683 triệu đồng, phản ánh tính chất công việc trực tiếp dưới hầm. Thu nhập thực tế của từng người còn phụ thuộc vị trí, ngày công, định mức, năng suất, phụ cấp và kết quả sản xuất.",
      "Người tìm việc cần hỏi rõ cách tính lương, kỳ trả, khoản khấu trừ, điều kiện hưởng phụ cấp và thu nhập trong giai đoạn học việc. Không nên xem con số bình quân là lời hứa chắc chắn cho tháng đầu hoặc mọi vị trí.",
    ]},
    {title: "Tuyển dụng và tái tuyển phải đi cùng giữ chân lao động", paragraphs: [
      "Công đoàn TKV đề nghị tập trung tuyển sinh, tuyển dụng, tái tuyển và giữ chân lao động. Bốn hướng này nối tiếp nhau: tạo nguồn học nghề, tiếp nhận lao động, mở đường quay lại cho người phù hợp và giải quyết nguyên nhân khiến công nhân muốn nghỉ.",
      "Đối thoại, gặp gỡ gia đình công nhân và nắm bắt trường hợp nghỉ, bỏ việc giúp đơn vị nhận diện vấn đề về công việc, thu nhập hoặc đời sống. Phản hồi chỉ có giá trị khi được chuyển thành đầu việc, thời hạn và người chịu trách nhiệm xử lý.",
    ]},
    {title: "Nhà ở công nhân xa gia đình là một phần của bài toán nhân lực", paragraphs: [
      "Buổi làm việc đặt yêu cầu xây, sửa nhà ở và khu tập thể cho lao động xa gia đình. Với người thường xuyên làm việc tại địa bàn thi công khác nhau, nơi ở an toàn, sạch và thuận tiện đi lại tác động trực tiếp tới khả năng phục hồi sau ca.",
      "Người cân nhắc việc làm ngành Than Quảng Ninh nên đối chiếu chỗ ở, chi phí, nhà ăn, phương tiện đến nơi làm việc và cách bố trí khi chuyển diện. Những thông tin này giúp đánh giá tổng thu nhập và mức độ phù hợp thực tế, bên cạnh con số tiền lương.",
    ]},
  ],
  factsTitle: "Số liệu việc làm và tiền lương sáu tháng đầu năm", actionTitle: "Người tìm việc nên hỏi rõ trước khi đăng ký", conclusionTitle: "Ổn định lao động cần cả việc làm, thu nhập và nơi ở",
  checklist: [["Hỏi vị trí", "Xác định công việc, địa bàn thi công và khả năng điều động."], ["Đọc cách tính lương", "Phân biệt lương bình quân với thu nhập cá nhân theo ngày công, định mức."], ["Kiểm tra nơi ở", "Hỏi chỗ ở, chi phí, nhà ăn và phương tiện tới nơi làm việc."], ["Xác minh tuyển dụng", "Chỉ làm hồ sơ theo thông báo và đầu mối chính thức, không tin lời hứa chắc thu nhập."]],
  takeaway: "Công ty Xây lắp mỏ duy trì quy mô 2.038 lao động với lương bình quân 20,683 triệu đồng, riêng thợ lò 23,3 triệu đồng. Giữ lực lượng lâu dài đòi hỏi tuyển đúng, trả lương rõ, đối thoại thực chất và cải thiện nhà ở công nhân.",
  faq: [["Công ty Xây lắp mỏ có bao nhiêu lao động?", "Đến cuối tháng 6/2026, Công ty có 2.038 lao động theo báo cáo được công bố."], ["Lương bình quân của thợ lò là bao nhiêu?", "Bài nguồn nêu 23,3 triệu đồng/người/tháng trong sáu tháng đầu năm 2026."], ["Mức 23,3 triệu đồng có cố định cho mọi người không?", "Không. Đây là số bình quân; thu nhập cá nhân phụ thuộc công việc, ngày công, định mức, phụ cấp và kết quả sản xuất."], ["Công ty đang tập trung giải pháp nhân lực nào?", "Nội dung làm việc nêu tuyển sinh, tuyển dụng, tái tuyển, giữ chân lao động, nâng trình độ và cải thiện ăn ở."]],
  sources: [{publisher, title: "Chủ tịch Công đoàn TKV Lê Thanh Xuân làm việc tại Công ty Xây lắp mỏ", date: "12/08/2026", url: images["viec-lam-cong-ty-xay-lap-mo-2026"].sourceUrl}],
  seoLine: "Bài viết phân tích việc làm Công ty Xây lắp mỏ 2026, lương thợ lò, tuyển dụng, tái tuyển và nhà ở cho công nhân xa gia đình.",
});

export const dailyCommunityArticles20260813 = [thanNuiBeoNghiDuongArticle20260813, thanMaoKheNghiDuongArticle20260813, xayLapMoViecLamArticle20260813];
