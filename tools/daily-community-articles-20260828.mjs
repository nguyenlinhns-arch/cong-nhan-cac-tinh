import {dailyCommunitySourceImages20260828 as images} from "./daily-community-source-images-20260828.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const duongHuyStormSupportArticle20260828 = withImage("than-duong-huy-ung-pho-bao-narra-cham-lo-nguoi-lao-dong-2026", {
  updated: "2026-08-28T08:18:00+07:00",
  published: "2026-08-28T08:18:00+07:00",
  urlPath: "tin-nganh-than/2026/08/28/than-duong-huy-ung-pho-bao-narra-cham-lo-nguoi-lao-dong-2026",
  related: ["than-duong-huy-giam-sat-che-do-nguoi-lao-dong-2026", "than-duong-huy-khu-tap-the-cong-nhan-2026", "than-duong-huy-phuc-loi-gia-dinh-tho-lo-2026", "dao-tao-an-toan-truoc-khi-vao-lo"],
  section: "An sinh xã hội",
  title: "Than Dương Huy ứng phó bão NARRA, chăm lo người lao động",
  description: "Than Dương Huy tổ chức ứng trực, bơm thoát nước, kiểm soát nguy cơ và thăm hỏi lực lượng khắc phục ảnh hưởng của bão NARRA trong tháng 8/2026.",
  lead: "Ứng phó thời tiết cực đoan tại mỏ không dừng ở bảo vệ thiết bị; phương án chỉ trọn vẹn khi an toàn của người lao động và lực lượng trực tiếp khắc phục hậu quả được đặt ở vị trí trung tâm.",
  keyword: "Than Dương Huy ứng phó bão NARRA 2026",
  keywords: ["Than Dương Huy ứng phó bão NARRA 2026", "an toàn thợ mỏ mùa mưa bão", "Công đoàn Than Dương Huy", "hỗ trợ người lao động", "an toàn lao động mỏ", "việc làm ngành Than Quảng Ninh"],
  facts: [["Từ 24/08/2026", "Thời điểm Công ty kích hoạt phương án ứng phó bão số 4 – NARRA."], ["24 giờ", "Thời gian lực lượng Phòng Điều khiển sản xuất duy trì ứng trực."], ["Nhiều vị trí trọng yếu", "Các điểm được phân công lực lượng kiểm soát nguy cơ mất an toàn."], ["27/08/2026", "Ngày Công đoàn Công ty thăm hỏi, động viên và tặng quà lực lượng ứng cứu."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 27/08/2026 thông tin về chương trình <strong>Than Dương Huy ứng phó bão NARRA 2026</strong>; vì vậy, người lao động cần chú ý cách mỏ tổ chức bảo vệ con người khi thời tiết cực đoan. Trước diễn biến phức tạp của bão số 4 từ ngày 24/08, Công ty đã kích hoạt phương án bảo vệ người lao động, công trình và hệ thống sản xuất của mỏ để giảm nguy cơ mất an toàn khi mưa lớn kéo dài.",
    "Lực lượng chuyên môn được phân công ứng trực tại các vị trí trọng yếu, thực hiện bơm thoát nước, duy trì lưới điện, kiểm soát khu vực có nguy cơ mất an toàn và bảo vệ tài sản, thiết bị. Nguồn chính thức cho biết các khu vực chịu ảnh hưởng cơ bản đã được kiểm soát và hoạt động khắc phục tiếp tục được triển khai.",
    "Ngày 27/08, Công đoàn Công ty đến thăm hỏi, động viên và tặng quà các đơn vị, cán bộ công nhân viên đang túc trực, ứng cứu. Bài nguồn không công bố tổng số người hoặc giá trị quà, vì vậy nội dung chỉ ghi nhận đúng phạm vi hỗ trợ đã được xác nhận.",
  ],
  sections: [
    {title: "An toàn con người là điểm xuất phát của phương án ứng phó", paragraphs: [
      "Mưa lớn có thể gây ngập, gián đoạn điện, ảnh hưởng đường vận chuyển và làm tăng nguy cơ tại những khu vực sản xuất đặc thù. Việc bố trí người trực tại các điểm trọng yếu giúp phát hiện sớm diễn biến bất thường và xử lý trước khi rủi ro lan rộng.",
      "Duy trì bơm thoát nước và lưới điện không chỉ phục vụ sản xuất. Đây còn là điều kiện để hệ thống thông tin, chiếu sáng, vận chuyển và các thiết bị an toàn tiếp tục hoạt động trong thời điểm thời tiết xấu.",
    ]},
    {title: "Lực lượng trực bão cần được bảo đảm điều kiện làm việc", paragraphs: [
      "Người tham gia ứng trực phải làm việc trong hoàn cảnh áp lực cao, có thể kéo dài ngoài ca thông thường. Thăm hỏi và động viên kịp thời giúp đơn vị nắm tình trạng sức khỏe, nhu cầu nghỉ ngơi và những khó khăn phát sinh của lực lượng tại hiện trường.",
      "Sự hỗ trợ chỉ phát huy đầy đủ khi đi cùng phân ca hợp lý, trang bị bảo hộ, thông tin liên lạc và quyền dừng công việc khi điều kiện không an toàn. Người lao động cần báo ngay dấu hiệu sạt trượt, ngập nước, mất điện hoặc kiệt sức qua đúng đầu mối chỉ huy.",
    ]},
    {title: "Khôi phục sản xuất cần tránh tâm lý nóng vội sau bão", paragraphs: [
      "Khi ảnh hưởng ban đầu đã được kiểm soát, việc đưa sản xuất trở lại vẫn cần dựa trên kiểm tra kỹ thuật và xác nhận an toàn ở từng khu vực. Tiến độ không nên được đánh đổi bằng việc bỏ qua bước đánh giá lại đường vận chuyển, thiết bị điện hoặc khả năng thoát nước.",
      "Với người đang tìm hiểu việc làm ngành Than, đợt ứng phó này cho thấy công việc mỏ đòi hỏi kỷ luật tập thể và khả năng xử lý tình huống, bên cạnh tay nghề chuyên môn. Một sự kiện cụ thể không đại diện cho mọi điều kiện ở các đơn vị khác, nhưng giúp người lao động hiểu rõ hơn vai trò của quy trình an toàn.",
    ]},
  ],
  factsTitle: "Những nội dung ứng phó đã được công bố",
  actionTitle: "Người lao động cần lưu ý khi làm việc trong mưa bão",
  conclusionTitle: "Ổn định sản xuất phải bắt đầu từ điều kiện an toàn",
  checklist: [["Theo dõi chỉ đạo", "Nắm lịch trực, khu vực hạn chế và đầu mối điều hành tại đơn vị."], ["Kiểm tra trang bị", "Bảo đảm đèn, phương tiện liên lạc và bảo hộ phù hợp trước khi vào vị trí."], ["Báo nguy cơ ngay", "Không tự xử lý một mình khi xuất hiện ngập nước, sự cố điện hoặc sạt trượt."], ["Theo dõi sức khỏe", "Chủ động báo khi mệt mỏi, thiếu ngủ hoặc không đủ điều kiện tiếp tục ứng trực."]],
  takeaway: "Than Dương Huy đã tổ chức ứng trực, kiểm soát các vị trí trọng yếu và từng bước khắc phục ảnh hưởng của bão NARRA. Công đoàn Công ty đồng thời thăm hỏi lực lượng trực tiếp ứng cứu, cho thấy chăm lo người lao động là một phần của năng lực ứng phó an toàn.",
  faq: [["Than Dương Huy kích hoạt phương án ứng phó từ khi nào?", "Nguồn chính thức nêu từ ngày 24/08/2026, khi bão số 4 – NARRA diễn biến phức tạp."], ["Các nhiệm vụ chính tại hiện trường là gì?", "Bơm thoát nước, duy trì lưới điện, kiểm soát khu vực có nguy cơ mất an toàn và bảo vệ tài sản, thiết bị."], ["Công đoàn hỗ trợ người lao động ra sao?", "Ngày 27/08, đoàn Công đoàn Công ty thăm hỏi, động viên và tặng quà các đơn vị, người lao động tham gia ứng trực, ứng cứu."], ["Bài nguồn có công bố tổng giá trị hỗ trợ không?", "Không. Nguồn không nêu số người nhận hoặc tổng giá trị quà tặng."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Chuyên môn và Công đoàn Than Dương Huy đồng hành vượt qua bão NARRA", date: "27/08/2026", url: images["than-duong-huy-ung-pho-bao-narra-cham-lo-nguoi-lao-dong-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ cách Than Dương Huy ứng phó bão NARRA 2026 và những yêu cầu an toàn, hỗ trợ người lao động tại mỏ.",
});

export const honGaiWorkerHolidayArticle20260828 = withImage("tuyen-than-hon-gai-nghi-mat-nguoi-lao-dong-thang-8-2026", {
  updated: "2026-08-28T08:21:00+07:00",
  published: "2026-08-28T08:21:00+07:00",
  urlPath: "tin-nganh-than/2026/08/28/tuyen-than-hon-gai-nghi-mat-nguoi-lao-dong-thang-8-2026",
  related: ["tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026", "than-mao-khe-nghi-duong-nguoi-lao-dong-2026", "than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Tuyển than Hòn Gai tổ chức nghỉ mát cho hơn 100 người lao động",
  description: "Tuyển than Hòn Gai tổ chức ba đoàn nghỉ mát cho hơn 100 cán bộ, công nhân viên trong tháng 8/2026 và dự kiến tiếp tục ba đoàn vào tháng 9.",
  lead: "Ba đoàn nghỉ mát trong tháng 8 tạo khoảng nghỉ phục hồi và giao lưu cho hơn 100 người lao động; kế hoạch tháng 9 cho thấy chương trình phúc lợi được triển khai theo nhiều đợt thay vì một hoạt động đơn lẻ.",
  keyword: "Tuyển than Hòn Gai nghỉ mát người lao động 2026",
  keywords: ["Tuyển than Hòn Gai nghỉ mát người lao động 2026", "phúc lợi thợ mỏ", "nghỉ dưỡng công nhân ngành Than", "chăm lo người lao động TKV", "tái tạo sức lao động", "việc làm ngành Than Quảng Ninh"],
  facts: [["Hơn 100 người", "Quy mô cán bộ, công nhân viên tham gia các đoàn trong tháng 8."], ["Ba đoàn", "Số đoàn được tổ chức từ ngày 10 đến 26/08/2026."], ["Hai hành trình chính", "Huế – Đà Nẵng và Quy Nhơn – Tuy Hòa."], ["Ba đoàn dự kiến", "Kế hoạch tiếp tục trong tháng 9 tại Nha Trang – Đà Lạt và Phú Quốc."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 27/08/2026 công bố chương trình <strong>Tuyển than Hòn Gai nghỉ mát người lao động 2026</strong>. Trong tháng 8, Công ty tổ chức ba đoàn tham quan, nghỉ mát tại miền Trung cho hơn 100 cán bộ, công nhân viên và người lao động.",
    "Các đoàn diễn ra từ ngày 10 đến 26/08, gồm hai đoàn theo hành trình Huế – Đà Nẵng và một đoàn Quy Nhơn – Tuy Hòa. Chương trình được thực hiện theo nghị quyết liên tịch giữa Giám đốc và Ban Chấp hành Công đoàn Công ty về phúc lợi nghỉ mát năm 2026.",
    "Nguồn cũng nêu kế hoạch tháng 9 gồm ba đoàn khác, trong đó một đoàn Nha Trang – Đà Lạt và hai đoàn Phú Quốc. Đây mới là kế hoạch dự kiến cho tháng 9, chưa phải kết quả đã hoàn thành hoặc quyền lợi được xác nhận cho từng người lao động.",
  ],
  sections: [
    {title: "Phúc lợi được tổ chức theo nhiều đợt để mở rộng cơ hội tham gia", paragraphs: [
      "Chia thành nhiều đoàn giúp doanh nghiệp bố trí nhân lực tham gia mà vẫn duy trì hoạt động sản xuất. Cách tổ chức này đặc biệt cần thiết ở đơn vị làm việc theo ca, nơi không thể cùng lúc rút một số lượng lớn lao động khỏi dây chuyền.",
      "Hơn 100 người trong tháng 8 là quy mô đã được nguồn xác nhận, nhưng bài viết không suy rộng thành toàn bộ lực lượng lao động của Công ty. Việc lựa chọn đối tượng, kinh phí và tiêu chuẩn của từng đợt cần được đối chiếu theo thông báo nội bộ.",
    ]},
    {title: "Nghỉ ngơi và gắn kết bổ trợ cho khả năng phục hồi", paragraphs: [
      "Những hành trình có không gian văn hóa, lịch sử và hoạt động tập thể tạo điều kiện để người lao động tạm rời nhịp công việc thường ngày. Giá trị của chuyến đi nằm ở khoảng nghỉ, giao lưu giữa các đơn vị và sự ghi nhận đóng góp trong quá trình làm việc.",
      "Tuy vậy, nghỉ mát không thay thế khám sức khỏe, điều dưỡng theo chỉ định, thời gian nghỉ giữa ca hoặc cải thiện điều kiện lao động. Các lớp phúc lợi cần bổ trợ cho nhau để chăm sóc cả thể chất, tinh thần và đời sống gia đình của người lao động.",
    ]},
    {title: "Kế hoạch tháng 9 cần được hiểu đúng là bước tiếp theo", paragraphs: [
      "Ba đoàn Nha Trang – Đà Lạt và Phú Quốc mới được công bố ở dạng kế hoạch. Người lao động thuộc đối tượng quan tâm nên theo dõi lịch, danh sách và hướng dẫn chính thức của Công ty, thay vì xem thông tin dự kiến như quyền lợi đã xác nhận cho từng cá nhân.",
      "Với người tìm hiểu việc làm ngành Than, chương trình cho thấy doanh nghiệp có hoạt động chăm lo đời sống tinh thần. Tuy nhiên, quyết định vào nghề vẫn cần dựa trên tổng thể công việc, điều kiện ca kíp, an toàn, chế độ tại đúng đơn vị và khả năng đáp ứng yêu cầu nghề nghiệp.",
    ]},
  ],
  factsTitle: "Quy mô chương trình nghỉ mát tháng 8",
  actionTitle: "Người lao động cần kiểm tra gì trước khi tham gia",
  conclusionTitle: "Phúc lợi bền vững cần phù hợp nhịp sản xuất và nhu cầu thực tế",
  checklist: [["Xem đúng thông báo", "Kiểm tra đối tượng, thời gian và hành trình tại đơn vị của mình."], ["Bàn giao công việc", "Hoàn tất phân ca và đầu mối thay thế trước thời gian nghỉ."], ["Chuẩn bị sức khỏe", "Thông báo tình trạng cần hỗ trợ và mang thuốc theo hướng dẫn cá nhân."], ["Phân biệt kế hoạch", "Chỉ coi lịch tháng 9 là xác nhận khi Công ty ban hành thông tin cụ thể."]],
  takeaway: "Tuyển than Hòn Gai đã tổ chức ba đoàn nghỉ mát cho hơn 100 người lao động trong tháng 8/2026 và công bố kế hoạch tiếp tục vào tháng 9. Việc triển khai theo nhiều đợt giúp phúc lợi gắn với khả năng bố trí sản xuất và mở rộng cơ hội tham gia.",
  faq: [["Chương trình tháng 8 có bao nhiêu người tham gia?", "Nguồn chính thức nêu hơn 100 cán bộ, công nhân viên và người lao động."], ["Ba đoàn được tổ chức trong khoảng thời gian nào?", "Từ ngày 10 đến ngày 26/08/2026."], ["Các hành trình tháng 8 gồm những đâu?", "Hai đoàn Huế – Đà Nẵng và một đoàn Quy Nhơn – Tuy Hòa."], ["Ba đoàn tháng 9 đã hoàn thành chưa?", "Chưa. Nguồn mới công bố kế hoạch một đoàn Nha Trang – Đà Lạt và hai đoàn Phú Quốc."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Công ty Tuyển than Hòn Gai tổ chức chương trình phúc lợi nghỉ mát tháng 8 cho CBCNV, người lao động", date: "27/08/2026", url: images["tuyen-than-hon-gai-nghi-mat-nguoi-lao-dong-thang-8-2026"].sourceUrl}],
  seoLine: "Bài viết phân tích chương trình Tuyển than Hòn Gai nghỉ mát người lao động 2026 và phạm vi phúc lợi đã được xác nhận.",
});

export const dailyCommunityArticles20260828 = [
  duongHuyStormSupportArticle20260828,
  honGaiWorkerHolidayArticle20260828,
];
