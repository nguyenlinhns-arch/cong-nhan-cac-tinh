import {dailyCommunitySourceImages20260809 as images} from "./daily-community-source-images-20260809.mjs";

const publisher = "Công đoàn Than – Khoáng sản Việt Nam";

const makeSource = (slug, title, date) => {
  const image = images[slug];
  if (!image) throw new Error(`Thiếu ảnh nguồn cho bài ${slug}`);
  return {publisher, title, date, url: image.sourceUrl};
};

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) {
    throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  }
  return {
    ...article,
    slug,
    image: image.image,
    imageAlt: image.alt,
    imageSource: image.credit,
    schemaType: "NewsArticle",
    hideSourceUrlsInSchema: true,
    suppressImageLabel: true,
  };
};

export const thanMongDuongArticle20260809 = withImage(
  "than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026",
  {
    updated: "2026-08-09T08:06:00+07:00",
    published: "2026-08-09T08:06:00+07:00",
    urlPath: "tin-nganh-than/2026/08/09/than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026",
    related: ["dam-ha-than-thong-nhat-dao-tao-viec-lam-2026", "duong-hoa-than-duong-huy-tuyen-sinh-nghe-mo", "quang-la-quang-ninh-tuyen-sinh-nghe-mo-2025"],
    section: "Kết nối địa phương",
    title: "Than Mông Dương phối hợp tuyển sinh, đào tạo thợ mỏ",
    description: "Than Mông Dương và Trường Cao đẳng TKV mở rộng tuyển sinh nghề mỏ, theo dõi thực tập và đào tạo nhân lực gắn nhu cầu sản xuất.",
    lead: "Thỏa thuận giữa doanh nghiệp và nhà trường chuyển trọng tâm từ tuyên truyền sang theo dõi toàn bộ hành trình: tư vấn, học nghề, thực tập và bố trí nguồn nhân lực.",
    keyword: "Than Mông Dương tuyển sinh nghề mỏ 2026",
    keywords: ["Than Mông Dương tuyển sinh nghề mỏ 2026", "học nghề mỏ", "tuyển sinh nghề mỏ", "việc làm ngành Than", "Trường Cao đẳng TKV", "tuyển thợ lò Quảng Ninh"],
    facts: [
      ["04/08/2026", "Than Mông Dương và Trường Cao đẳng TKV tổ chức hội nghị đánh giá phối hợp tuyển sinh, đào tạo và thực tập."],
      ["Xã Ba Chẽ", "Hai bên thống nhất duy trì mô hình phối hợp và khảo sát thêm địa bàn có nguồn lao động phù hợp."],
      ["3 khâu", "Cùng theo dõi tuyển sinh, quá trình thực tập và các chế độ đối với người học."],
      ["Mở rộng đào tạo", "Phối hợp đào tạo liên thông, bồi dưỡng nghề và cấp chứng chỉ cho người lao động."],
    ],
    intro: [
      "Ngày 06/08/2026, Công đoàn Than – Khoáng sản Việt Nam đăng thông tin về hội nghị giữa Công ty Cổ phần Than Mông Dương - Vinacomin và Trường Cao đẳng Than - Khoáng sản Việt Nam. Hội nghị tập trung nâng chất lượng <strong>Than Mông Dương tuyển sinh nghề mỏ 2026</strong>, quản lý học sinh thực tập và chuẩn bị nguồn lao động kỹ thuật.",
      "Cuộc làm việc diễn ra ngày 04/08, sau giai đoạn hai bên cùng các địa phương tư vấn nghề mỏ, giới thiệu điều kiện học, công việc, thu nhập và phúc lợi. Hội nghị cũng nhìn thẳng vào hai nút thắt: cạnh tranh lao động ngày càng lớn và một bộ phận học sinh chưa thích nghi khi bước vào thực tập.",
      "Cách tiếp cận mới có ý nghĩa với người lao động: thông tin phải đủ rõ ngay từ đầu, có đầu mối theo dõi trong thời gian học và thực tập, đồng thời gắn đào tạo với vị trí doanh nghiệp thực sự cần. Đó là nền tảng để giảm bỏ học và tăng khả năng gắn bó sau tốt nghiệp.",
    ],
    sections: [
      {
        title: "Than Mông Dương tuyển sinh nghề mỏ theo nhu cầu thực",
        paragraphs: [
          "Thời gian qua, doanh nghiệp và nhà trường đã phối hợp các địa phương tổ chức tư vấn trực tiếp. Nội dung bao quát tính chất công việc, điều kiện sinh hoạt, thu nhập, phúc lợi và lộ trình phát triển nghề nghiệp. Người học có thêm cơ sở để quyết định.",
          "Công đoàn Công ty tham gia truyền thông bằng hình ảnh người thật, việc thật. Đây là cách khắc phục khoảng cách giữa lời giới thiệu và thực tế sản xuất. Khi ứng viên hiểu rõ ca kíp, yêu cầu sức khỏe, kỷ luật và cách tính thu nhập, quyết định học nghề sẽ thực chất hơn.",
          "Mô hình tại xã Ba Chẽ được xác định tiếp tục duy trì. Hai bên cũng sẽ khảo sát thêm những địa phương có nguồn lao động phù hợp. Việc mở rộng phải đi cùng khả năng tư vấn, tiếp nhận và theo dõi, tránh chỉ chạy theo số lượng đăng ký ban đầu.",
        ],
      },
      {
        title: "Thực tập sản xuất là khâu quyết định",
        paragraphs: [
          "Hội nghị thừa nhận một bộ phận học sinh chưa thích nghi và bỏ thực tập sản xuất. Đây là giai đoạn chuyển từ môi trường học tập sang nền nếp doanh nghiệp, nơi người học phải thích nghi với thời gian làm việc, quy trình an toàn, tác phong công nghiệp và yêu cầu thể lực.",
          "Hai bên giao đơn vị chuyên môn làm đầu mối, cập nhật tiến độ tuyển sinh và theo dõi quá trình thực tập của từng học sinh. Cơ chế này giúp phát hiện sớm vướng mắc về sức khỏe, tâm lý, kỹ năng hoặc sinh hoạt trước khi học sinh tự ý bỏ dở.",
          "Công đoàn tiếp tục theo dõi việc thực hiện chế độ và nắm tâm tư người học. Vai trò này quan trọng bởi người mới cần một kênh phản ánh rõ ràng khi chưa quen môi trường. Sự hỗ trợ kịp thời có thể giúp học sinh vượt qua giai đoạn dễ dao động nhất.",
        ],
      },
      {
        title: "Từ học nghề mỏ đến nâng chuẩn tay nghề",
        paragraphs: [
          "Chương trình phối hợp còn phục vụ người đang làm việc. Than Mông Dương và Trường Cao đẳng TKV thống nhất tổ chức đào tạo liên thông, bồi dưỡng nghề và cấp chứng chỉ cho người lao động. Mục tiêu là cập nhật kiến thức, chuẩn hóa trình độ và nâng kỹ năng vận hành thiết bị.",
          "Với doanh nghiệp mỏ, nhu cầu nhân lực thay đổi theo công nghệ và tổ chức sản xuất. Một người lao động có nền tảng nghề tốt nhưng không được cập nhật vẫn có thể gặp khó khi thiết bị và quy trình thay đổi. Đào tạo liên tục vì thế là một phần của ổn định việc làm.",
          "Người đang cân nhắc việc làm ngành Than nên nhìn lộ trình theo hai chặng: đủ điều kiện để học và vào nghề; sau đó tiếp tục bồi dưỡng để thích ứng công nghệ, nâng bậc và mở rộng cơ hội nghề nghiệp. Học xong không phải điểm kết thúc của quá trình đào tạo.",
        ],
      },
      {
        title: "Ba bên cùng chịu trách nhiệm về chất lượng nguồn nhân lực",
        paragraphs: [
          "Mô hình hiệu quả cần ba chủ thể. Địa phương giúp tiếp cận đúng người có nhu cầu; nhà trường bảo đảm nền tảng kiến thức, kỹ năng và nền nếp; doanh nghiệp làm rõ nhu cầu sử dụng, tổ chức thực tập và phản hồi chất lượng. Thiếu một mắt xích, quá trình dễ bị đứt quãng.",
          "Đối với người lao động, hai bên đã nêu thẳng cả cơ hội lẫn khó khăn. Thông tin trung thực giúp ứng viên tự sàng lọc khả năng thích nghi, chuẩn bị sức khỏe và trao đổi với gia đình trước khi đăng ký.",
          "Kết quả cuối cùng cần đo bằng tỷ lệ học sinh hoàn thành khóa học, thích nghi trong thực tập và gắn bó sau khi được bố trí công việc. Nếu các đầu mối cùng theo dõi những chỉ số này, phối hợp tuyển sinh sẽ chuyển từ phong trào sang một quy trình nhân lực bền vững.",
        ],
      },
    ],
    factsTitle: "Những nội dung chính hai bên thống nhất",
    actionTitle: "Người muốn học nghề mỏ nên chuẩn bị gì",
    conclusionTitle: "Tuyển sinh hiệu quả phải gắn với khả năng thích nghi",
    checklist: [
      ["Kiểm tra sức khỏe", "Đối chiếu điều kiện sơ bộ trước khi di chuyển và nộp hồ sơ."],
      ["Hỏi rõ lộ trình", "Nắm thời gian học, nơi ở, thực tập và đơn vị dự kiến tiếp nhận."],
      ["Hiểu tính chất việc", "Tìm hiểu ca kíp, kỷ luật an toàn và yêu cầu thể lực của nghề."],
      ["Giữ liên lạc", "Báo sớm khó khăn cho nhà trường hoặc đầu mối doanh nghiệp trong thời gian thực tập."],
    ],
    takeaway: "Than Mông Dương và Trường Cao đẳng TKV đang gắn tuyển sinh với quản lý thực tập và nhu cầu lao động thực tế. Hướng đi này hữu ích nếu người học được cung cấp đủ thông tin, có đầu mối hỗ trợ và được theo dõi đến khi thích nghi với công việc.",
    faq: [
      ["Than Mông Dương phối hợp tuyển sinh với đơn vị nào?", "Bài công bố ngày 06/08/2026 nêu Công ty phối hợp với Trường Cao đẳng Than - Khoáng sản Việt Nam và các địa phương."],
      ["Xã Ba Chẽ có tiếp tục được triển khai tuyển sinh không?", "Hai bên thống nhất duy trì mô hình phối hợp tại xã Ba Chẽ và khảo sát thêm địa bàn có nguồn lao động phù hợp."],
      ["Học sinh thực tập được theo dõi như thế nào?", "Các đơn vị chuyên môn được giao làm đầu mối theo dõi từng học sinh; Công đoàn phối hợp nắm chế độ và tâm tư người học."],
      ["Hội nghị có phải thông báo tuyển dụng trực tiếp không?", "Không. Đây là hội nghị đánh giá và thống nhất giải pháp phối hợp. Người lao động cần kiểm tra thông báo tuyển sinh, điều kiện sức khỏe và lịch tiếp nhận hiện hành."],
    ],
    sources: [makeSource("than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026", "Than Mông Dương tăng cường phối hợp tuyển sinh, đào tạo và ổn định nguồn nhân lực", "06/08/2026")],
    seoLine: "Nội dung làm rõ Than Mông Dương tuyển sinh nghề mỏ 2026, quản lý thực tập và đào tạo nguồn nhân lực ngành Than tại Quảng Ninh.",
  },
);

export const coDienUongBiArticle20260809 = withImage(
  "co-dien-uong-bi-on-dinh-viec-lam-nguoi-lao-dong-2026",
  {
    updated: "2026-08-09T08:05:00+07:00",
    published: "2026-08-09T08:05:00+07:00",
    urlPath: "tin-nganh-than/2026/08/09/co-dien-uong-bi-on-dinh-viec-lam-nguoi-lao-dong-2026",
    related: ["phuc-loi-tho-mo-mo-viet-bac-2026", "than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026", "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026"],
    section: "An sinh xã hội",
    title: "Cơ điện Uông Bí ổn định việc làm cho người lao động",
    description: "Cơ điện Uông Bí khôi phục việc làm cho 100% lao động, bổ sung khối lượng 12,6 tỷ đồng và được Công đoàn TKV hỗ trợ 150 triệu đồng.",
    lead: "Sau giai đoạn 135 lao động bị ảnh hưởng việc làm và thu nhập, doanh nghiệp đã bổ sung đơn hàng, tổ chức lại sản xuất và đưa toàn bộ lao động trở lại làm việc.",
    keyword: "việc làm Cơ điện Uông Bí 2026",
    keywords: ["việc làm Cơ điện Uông Bí 2026", "việc làm ngành Than", "tuyển lao động kỹ thuật", "thợ cơ khí lành nghề", "Công đoàn TKV", "thu nhập người lao động Uông Bí"],
    facts: [
      ["135 người", "Từng bị ảnh hưởng việc làm và thu nhập trong giai đoạn khó khăn."],
      ["Hơn 12,6 tỷ đồng", "Giá trị khối lượng công việc được bổ sung sau khi TKV làm việc với Công ty."],
      ["100% lao động", "Đã có việc làm trở lại tại thời điểm bài gốc công bố."],
      ["150 triệu đồng", "Công đoàn TKV thống nhất hỗ trợ Công đoàn Công ty để chăm lo người lao động."],
    ],
    intro: [
      "Công đoàn Than – Khoáng sản Việt Nam ngày 06/08/2026 công bố kết quả làm việc tại Công ty Cổ phần Cơ điện Uông Bí. Kết quả trực tiếp với người lao động là <strong>việc làm Cơ điện Uông Bí 2026</strong> đã được khôi phục cho toàn bộ lao động sau giai đoạn đơn hàng suy giảm.",
      "Sáu tháng đầu năm, sản phẩm cơ khí truyền thống cạnh tranh mạnh, giá vật tư tăng, trong khi khách hàng cắt giảm nhu cầu mua sắm và sửa chữa lớn. Tác động đến lao động diễn ra rõ: 135 người có thời điểm bị ảnh hưởng việc làm, thu nhập và 15 người chấm dứt hợp đồng.",
      "Diễn biến sau đó cho thấy việc bảo đảm việc làm không thể chỉ trông vào hỗ trợ ngắn hạn. Nền tảng vẫn là có thêm khối lượng sản xuất, duy trì khách hàng, bố trí lao động hợp lý và giữ được thợ kỹ thuật. Nguồn hỗ trợ của Công đoàn giúp người khó khăn có thêm điểm tựa trong quá trình phục hồi.",
    ],
    sections: [
      {
        title: "Việc làm Cơ điện Uông Bí phục hồi nhờ khối lượng mới",
        paragraphs: [
          "Sau buổi làm việc với TKV ngày 18/06/2026, Công ty được bổ sung khối lượng công việc trị giá hơn 12,6 tỷ đồng. Nguồn việc mới giúp các dây chuyền hoạt động trở lại và giảm tình trạng lao động phải chờ việc. Đây là yếu tố trực tiếp nhất để khôi phục thu nhập.",
          "Tại thời điểm đánh giá, 100% người lao động đã có việc làm; các tổ gò, hàn phải làm thêm giờ để đáp ứng tiến độ. Bài gốc cho biết tiền lương bình quân tháng 7 đã cải thiện so với sáu tháng đầu năm và tiến gần kế hoạch năm.",
          "Kết quả tháng 7 phản ánh giai đoạn phục hồi của một doanh nghiệp cơ khí, không phải mức lương chung của mọi vị trí trong TKV. Thu nhập thực tế còn phụ thuộc nghề, bậc thợ, thời gian làm việc, năng suất và kế hoạch đơn hàng từng giai đoạn.",
        ],
      },
      {
        title: "Thiếu thợ cơ khí lành nghề trong khi đơn hàng trở lại",
        paragraphs: [
          "Công ty đồng thời thiếu lao động lành nghề tại các bộ phận gò, hàn kết cấu, đúc và rèn dập. Khi khối lượng sản xuất tăng trở lại, khoảng trống tay nghề dễ chuyển thành áp lực tiến độ và làm thêm giờ.",
          "Công đoàn TKV đề nghị doanh nghiệp đẩy mạnh tuyển dụng và giữ chân lao động kỹ thuật. Để giữ người có tay nghề, tiền lương cần đi cùng sự ổn định đơn hàng, điều kiện làm việc, cơ hội nâng bậc và cơ chế đối thoại khi có biến động.",
          "Với người tìm việc kỹ thuật, thông tin này cho thấy doanh nghiệp có nhu cầu ở một số nhóm nghề. Tuy nhiên, bài công bố không phải thông báo tuyển dụng, không nêu chỉ tiêu, tiêu chuẩn hồ sơ hoặc thời hạn. Ứng viên cần đối chiếu kênh tuyển dụng chính thức trước khi nộp hồ sơ.",
        ],
      },
      {
        title: "150 triệu đồng bổ sung nguồn lực chăm lo người lao động",
        paragraphs: [
          "Công đoàn TKV thống nhất hỗ trợ Công đoàn Cơ điện Uông Bí 150 triệu đồng để bổ sung nguồn chăm lo đoàn viên, người lao động. Một số công nhân có hoàn cảnh khó khăn, gắn bó lâu dài với doanh nghiệp được hỗ trợ 1 triệu đồng/người.",
          "Khoản hỗ trợ không thay thế tiền lương hay giải pháp sản xuất, nhưng có tác dụng giảm bớt khó khăn với những người chịu ảnh hưởng nặng hơn trong giai đoạn thiếu việc. Để bảo đảm công bằng, đơn vị cần xác định rõ tiêu chí, danh sách và cách sử dụng nguồn kinh phí.",
          "Trước đó, Công đoàn Công ty đã phối hợp tổ chức Bữa cơm Công đoàn, phong trào an toàn và khen thưởng. Nguồn lực tài chính hạn chế khiến một số hoạt động phúc lợi như tham quan, nghỉ dưỡng chưa thể triển khai. Điều này phản ánh khá rõ tác động của sản xuất kinh doanh đến phúc lợi.",
        ],
      },
      {
        title: "Ổn định đơn hàng là cách giữ việc làm bền vững",
        paragraphs: [
          "Tín hiệu phục hồi tháng 7 tạo thêm niềm tin, nhưng doanh nghiệp vẫn cần giải quyết bài toán dài hạn: mở rộng thị trường, duy trì khối lượng, kiểm soát giá vật tư và tăng sức cạnh tranh của sản phẩm cơ khí. Nếu đơn hàng lại giảm, nguy cơ thiếu việc có thể quay trở lại.",
          "Cùng với thị trường, doanh nghiệp cần theo dõi khối lượng làm thêm ở các tổ đang thiếu người. Kế hoạch sản xuất phải đồng thời bảo đảm tiến độ, sức khỏe, an toàn và nhịp nghỉ của thợ. Tuyển thêm lao động cần gắn với đào tạo và kèm cặp tại chỗ.",
          "Với người lao động hiện hữu, cơ chế đối thoại cần duy trì ngay cả khi sản xuất ổn định. Thông tin sớm về đơn hàng, kế hoạch việc làm, thu nhập và bố trí ca giúp người lao động chủ động cuộc sống, đồng thời giảm tâm lý bất an khi thị trường biến động.",
        ],
      },
    ],
    factsTitle: "Diễn biến việc làm và hỗ trợ tại Cơ điện Uông Bí",
    actionTitle: "Người lao động nên theo dõi những thông tin nào",
    conclusionTitle: "Việc làm ổn định cần đơn hàng và nguồn thợ bền vững",
    checklist: [
      ["Kế hoạch việc làm", "Theo dõi thông báo của đơn vị về khối lượng, ca làm và tiến độ sản xuất."],
      ["Thu nhập thực tế", "Đối chiếu bảng lương, ngày công, làm thêm và các khoản khấu trừ."],
      ["Quyền lợi hỗ trợ", "Hỏi Công đoàn về tiêu chí của từng chương trình, không suy ra mức hưởng chung."],
      ["An toàn khi tăng ca", "Tuân thủ thời gian nghỉ, bảo hộ và báo sớm khi sức khỏe không bảo đảm."],
    ],
    takeaway: "Cơ điện Uông Bí đã đưa 100% lao động trở lại làm việc sau khi được bổ sung khối lượng hơn 12,6 tỷ đồng. Nguồn hỗ trợ 150 triệu đồng của Công đoàn TKV bổ sung cho chính sách chăm lo; sự ổn định dài hạn vẫn phụ thuộc thị trường, đơn hàng và khả năng giữ thợ kỹ thuật.",
    faq: [
      ["Bao nhiêu lao động Cơ điện Uông Bí từng bị ảnh hưởng việc làm?", "Bài gốc nêu có thời điểm 135 người bị ảnh hưởng việc làm và thu nhập; 15 lao động chấm dứt hợp đồng."],
      ["Hiện người lao động đã có việc làm chưa?", "Tại thời điểm Công đoàn TKV công bố bài ngày 06/08/2026, 100% người lao động đã có việc làm."],
      ["Tiền lương tháng 7 thay đổi ra sao?", "Bài gốc cho biết mức bình quân đã cải thiện so với sáu tháng đầu năm và tiến gần kế hoạch năm của đơn vị."],
      ["Công ty có đang tuyển thợ cơ khí không?", "Bài viết phản ánh tình trạng thiếu thợ cơ khí lành nghề, nhưng không phải thông báo tuyển dụng. Ứng viên cần kiểm tra thông tin chính thức của đơn vị."],
    ],
    sources: [makeSource("co-dien-uong-bi-on-dinh-viec-lam-nguoi-lao-dong-2026", "Công đoàn TKV nắm bắt tình hình sản xuất, đời sống người lao động tại Công ty CP Cơ điện Uông Bí", "06/08/2026")],
    seoLine: "Nội dung phân tích việc làm Cơ điện Uông Bí 2026, nhu cầu thợ cơ khí lành nghề và chính sách chăm lo người lao động TKV.",
  },
);

export const tuyenThanCuaOngArticle20260809 = withImage(
  "tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026",
  {
    updated: "2026-08-09T08:04:00+07:00",
    published: "2026-08-09T08:04:00+07:00",
    urlPath: "tin-nganh-than/2026/08/09/tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026",
    related: ["than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026", "phuc-loi-tho-mo-mo-viet-bac-2026", "than-nam-mau-tuyen-duong-con-cong-nhan-2026"],
    section: "An sinh xã hội",
    title: "Tuyển than Cửa Ông mở rộng phúc lợi người lao động",
    description: "Tuyển than Cửa Ông triển khai phúc lợi người lao động 2026 với chăm sóc sức khỏe, nghỉ dưỡng, quà tặng và đào tạo chuyển nghề.",
    lead: "Bức tranh phúc lợi bảy tháng đầu năm gắn thu nhập với sức khỏe, bữa ăn, nghỉ dưỡng, hỗ trợ gia đình và cơ hội nâng kỹ năng.",
    keyword: "phúc lợi Tuyển than Cửa Ông 2026",
    keywords: ["phúc lợi Tuyển than Cửa Ông 2026", "phúc lợi thợ mỏ", "thu nhập người lao động TKV", "chăm sóc sức khỏe công nhân", "đời sống thợ mỏ Quảng Ninh", "đào tạo chuyển nghề"],
    facts: [
      ["39 người", "Được giải quyết chế độ hoặc bố trí công việc phù hợp với tình trạng sức khỏe."],
      ["477 lượt", "Người lao động được khám, điều trị; 13 trường hợp chuyển tuyến."],
      ["71 người", "Tham gia điều dưỡng, phục hồi sức khỏe trong chương trình Phúc lợi thợ mỏ."],
      ["Gần 1,6 tỷ đồng", "Kinh phí Công ty hỗ trợ nghỉ cuối tuần cho hơn 1.000 cán bộ, công nhân viên."],
    ],
    intro: [
      "Bảy tháng đầu năm 2026, Công đoàn Công ty Tuyển than Cửa Ông triển khai một chuỗi hoạt động từ bảo đảm chế độ, chăm sóc sức khỏe đến nghỉ dưỡng và đào tạo. Thông tin do Công đoàn TKV đăng ngày 06/08 cho thấy <strong>phúc lợi Tuyển than Cửa Ông 2026</strong> được gắn với nhiều khía cạnh của đời sống người lao động.",
      "Bài gốc cho biết tiền lương bình quân vượt kế hoạch điều chỉnh. Song song với thu nhập, doanh nghiệp và Công đoàn giải quyết chế độ cho 39 người, bố trí công việc phù hợp với lao động sức khỏe loại IV, V hoặc mắc bệnh mạn tính.",
      "Các con số không nên được hiểu là mức hưởng chung cho mọi lao động hoặc mọi đơn vị. Mỗi chương trình có nhóm đối tượng, thời điểm và nguồn kinh phí riêng. Bức tranh công bố cho thấy phúc lợi được tổ chức theo nhiều lớp, từ sức khỏe đến nghỉ dưỡng và đào tạo.",
    ],
    sections: [
      {
        title: "Phúc lợi Tuyển than Cửa Ông bắt đầu từ sức khỏe",
        paragraphs: [
          "Trong kỳ, 477 lượt người lao động được khám, điều trị; 13 trường hợp được chuyển tuyến và một công nhân điều trị bệnh nghề nghiệp tại Bệnh viện Than - Khoáng sản Việt Nam. Các chế độ ốm đau, bảo hiểm được giải quyết theo quy định.",
          "Công đoàn còn phối hợp kiểm tra nguồn gốc thực phẩm, giám sát bữa ăn ca, chế độ bồi dưỡng hiện vật và các biện pháp chống nóng. Đây là phần phúc lợi hiện diện trong từng ngày làm việc, tác động trực tiếp tới thể trạng và khả năng duy trì năng suất.",
          "Việc bố trí lại công việc cho lao động sức khỏe loại IV, V hoặc bệnh mạn tính có ý nghĩa vượt ra ngoài hỗ trợ y tế. Giải pháp này giúp người lao động tiếp tục có việc làm phù hợp hơn với thể trạng, đồng thời tận dụng kinh nghiệm tích lũy trong doanh nghiệp.",
        ],
      },
      {
        title: "Nghỉ dưỡng và phục hồi được chia theo nhiều chương trình",
        paragraphs: [
          "Chương trình Phúc lợi thợ mỏ có 71 người tham gia điều dưỡng, phục hồi sức khỏe tại Quang Hanh và Móng Cái, kết hợp hoạt động về nguồn tại Pò Hèn, với tổng kinh phí gần 184 triệu đồng. Đây là nhóm có mục tiêu phục hồi sức khỏe rõ ràng.",
          "Ngoài ra, 73 người đi nghỉ mát tại Sa Pa, 143 người tại Phú Quốc. Công đoàn hỗ trợ 277 người tham gia với tổng kinh phí 277 triệu đồng, trong đó phần Công đoàn Công ty là 138,5 triệu đồng. Các nhóm số liệu cần được đọc theo từng chương trình, không cộng cơ học để suy ra số người duy nhất.",
          "Công ty chi gần 1,6 tỷ đồng hỗ trợ nghỉ cuối tuần cho hơn 1.000 cán bộ, công nhân viên. Quy mô này cho thấy nghỉ ngơi được đặt trong kế hoạch tái tạo sức lao động. Hiệu quả thực tế cần được theo dõi qua sức khỏe, sự hài lòng và khả năng trở lại công việc ổn định.",
        ],
      },
      {
        title: "Quà tặng và hỗ trợ được phân theo từng nhóm",
        paragraphs: [
          "Công đoàn phối hợp chi quà sinh nhật 500.000 đồng/người cho cán bộ, công nhân viên; riêng tháng 7 đã chi 45,8 triệu đồng cho 229 đoàn viên. Mức quà và số người được công bố giúp người lao động có cơ sở để đối chiếu quyền lợi trong kỳ.",
          "Nhân 30 năm thành lập Công đoàn TKV, đơn vị trao 2.822 suất quà trị giá 846,6 triệu đồng. Mười một lao động mắc bệnh hiểm nghèo, bệnh nghề nghiệp nhận quà của Tổng Liên đoàn Lao động Việt Nam với tổng số tiền 19 triệu đồng.",
          "Hoạt động tri ân cũng hướng đến 20 gia đình chính sách, gia đình nạn nhân chất độc da cam và cựu thanh niên xung phong. Sự phân nhóm này phản ánh nhiều mục tiêu: ghi nhận đoàn viên, hỗ trợ người có vấn đề sức khỏe và duy trì trách nhiệm xã hội của doanh nghiệp mỏ.",
        ],
      },
      {
        title: "Phúc lợi bền vững phải gắn với kỹ năng và an toàn",
        paragraphs: [
          "Bên cạnh chăm lo vật chất, hơn 250 cán bộ, công nhân viên tham gia bồi dưỡng kiến thức chuyển đổi số. Công ty cũng đào tạo chuyển nghề cho công nhân kỹ thuật và cử cán bộ tham gia các lớp nghiệp vụ. Đào tạo giúp người lao động có thêm khả năng thích nghi khi công nghệ hoặc vị trí việc làm thay đổi.",
          "Công tác an toàn, vệ sinh lao động được triển khai qua kiểm tra hiện trường, mạng lưới an toàn vệ sinh viên, cải thiện điều kiện làm việc và cấp phương tiện bảo vệ cá nhân. Các biện pháp giảm bụi, tiếng ồn, nhiệt độ có tác động trực tiếp hơn đến sức khỏe dài hạn so với một hoạt động nghỉ ngơi đơn lẻ.",
          "Một hệ thống phúc lợi tốt cần có cả phần nhìn thấy ngay và phần tích lũy lâu dài: quà tặng, nghỉ dưỡng, bữa ăn, bảo hiểm, bố trí việc làm, môi trường an toàn và cơ hội học tập. Người lao động nên đề nghị đơn vị công khai tiêu chí và lịch triển khai để dễ tiếp cận.",
        ],
      },
    ],
    factsTitle: "Các nhóm phúc lợi trong bảy tháng đầu năm",
    actionTitle: "Người lao động nên đối chiếu quyền lợi ra sao",
    conclusionTitle: "Phúc lợi có giá trị khi đi cùng việc làm và an toàn",
    checklist: [
      ["Xác định chương trình", "Mỗi đợt nghỉ dưỡng, quà tặng hoặc hỗ trợ có đối tượng và nguồn kinh phí riêng."],
      ["Kiểm tra danh sách", "Liên hệ Công đoàn bộ phận khi có thắc mắc về tiêu chí hoặc thời gian."],
      ["Theo dõi sức khỏe", "Tham gia khám định kỳ và báo sớm dấu hiệu cần khám chuyên khoa."],
      ["Chủ động học nghề", "Tìm hiểu lớp bồi dưỡng, chuyển nghề hoặc nâng bậc phù hợp với vị trí."],
    ],
    takeaway: "Phúc lợi tại Tuyển than Cửa Ông trong bảy tháng đầu năm 2026 bao gồm thu nhập, khám chữa bệnh, nghỉ dưỡng, hỗ trợ khó khăn, an toàn và đào tạo. Người lao động cần đối chiếu từng chương trình, bởi các số liệu không tạo thành một mức hưởng chung cho mọi người.",
    faq: [
      ["Thu nhập tại Tuyển than Cửa Ông thay đổi ra sao?", "Bài công bố ngày 06/08/2026 cho biết tiền lương bình quân bảy tháng đầu năm vượt kế hoạch điều chỉnh của đơn vị."],
      ["Bao nhiêu người tham gia Phúc lợi thợ mỏ?", "Có 71 người tham gia điều dưỡng, phục hồi sức khỏe tại Quang Hanh và Móng Cái, kết hợp hoạt động về nguồn."],
      ["Người sức khỏe loại IV, V có được hỗ trợ việc làm không?", "Bài gốc cho biết doanh nghiệp rà soát và bố trí công việc phù hợp cho người sức khỏe loại IV, V và người mắc bệnh mạn tính."],
      ["Công ty có đào tạo chuyển nghề không?", "Có. Thông tin công bố nêu hoạt động đào tạo chuyển nghề cho công nhân kỹ thuật và các lớp bồi dưỡng, tập huấn."],
    ],
    sources: [makeSource("tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026", "Công đoàn Tuyển than Cửa Ông: Chăm lo, đồng hành cùng người lao động bằng những việc làm thiết thực", "06/08/2026")],
    seoLine: "Nội dung tổng hợp phúc lợi Tuyển than Cửa Ông 2026, thu nhập, chăm sóc sức khỏe và đào tạo người lao động ngành Than.",
  },
);

export const thanNuiHongArticle20260809 = withImage(
  "than-nui-hong-bao-dam-viec-lam-thu-nhap-2026",
  {
    updated: "2026-08-09T08:07:00+07:00",
    published: "2026-08-09T08:07:00+07:00",
    urlPath: "tin-nganh-than/2026/08/09/than-nui-hong-bao-dam-viec-lam-thu-nhap-2026",
    related: ["phuc-loi-tho-mo-mo-viet-bac-2026", "than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026", "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026"],
    section: "An sinh xã hội",
    title: "Than Núi Hồng bố trí việc làm khi dự án chậm cấp phép",
    description: "Than Núi Hồng linh hoạt bố trí lao động khi dự án mở rộng chưa được cấp phép; Công đoàn TKV tặng 20 suất quà trị giá 20 triệu đồng.",
    lead: "Khi dự án mở rộng mỏ chưa thể triển khai, doanh nghiệp phải điều động lao động, sắp xếp việc linh hoạt và bảo đảm chế độ cho người tạm ngừng việc.",
    keyword: "việc làm Than Núi Hồng 2026",
    keywords: ["việc làm Than Núi Hồng 2026", "việc làm ngành Than", "thu nhập người lao động mỏ", "Công đoàn TKV hỗ trợ người lao động", "Mỏ Núi Hồng VVMI", "an sinh người lao động TKV"],
    facts: [
      ["Dự án chưa có phép", "Dự án mở rộng, nâng công suất Mỏ Núi Hồng chưa được cấp giấy phép khai thác."],
      ["3 phương án", "Điều động sang đơn vị khác, sắp xếp việc linh hoạt và thực hiện chế độ ngừng việc tạm thời."],
      ["10 công nhân", "Trực tiếp trao đổi tâm tư, nguyện vọng từ các phân xưởng bị ảnh hưởng nhiều."],
      ["20 triệu đồng", "Giá trị 20 suất quà dành cho lao động có ngày công và thu nhập thấp."],
    ],
    intro: [
      "Ngày 07/08/2026, Công đoàn Than – Khoáng sản Việt Nam công bố thông tin về buổi làm việc tại Công ty Than Núi Hồng - VVMI. Vấn đề trung tâm là <strong>việc làm Than Núi Hồng 2026</strong> bị ảnh hưởng khi dự án mở rộng, nâng công suất mỏ chưa được cấp giấy phép khai thác.",
      "Sản xuất giảm làm thay đổi kế hoạch của doanh nghiệp, đồng thời tác động trực tiếp tới ngày công, thu nhập và tâm lý của người lao động. Công ty và Tổng công ty Công nghiệp mỏ Việt Bắc đã xây dựng nhiều phương án: điều động sang đơn vị khác, bố trí việc linh hoạt và thực hiện chế độ cho người ngừng việc tạm thời.",
      "Buổi đối thoại có 10 công nhân trực tiếp từ các phân xưởng Khai thác, Cơ điện - Đường sắt, những nơi chịu ảnh hưởng rõ nhất. Cách tổ chức này bổ sung dữ liệu thực tế của công nhân trực tiếp cho quá trình chọn phương án.",
    ],
    sections: [
      {
        title: "Việc làm Than Núi Hồng bị tác động từ thủ tục dự án",
        paragraphs: [
          "Dự án mở rộng, nâng công suất Mỏ Núi Hồng chưa được cấp giấy phép khai thác, khiến kế hoạch sản xuất kinh doanh năm 2026 gặp khó. Với doanh nghiệp khai thác, giấy phép quyết định phạm vi và sản lượng được triển khai, vì vậy sự chậm trễ nhanh chóng chuyển thành thiếu khối lượng cho lao động.",
          "Tác động không phân bố đều giữa các phân xưởng. Nhóm Khai thác và Cơ điện - Đường sắt được xác định chịu ảnh hưởng nhiều nhất. Việc mời công nhân trực tiếp tham gia giúp làm rõ hơn số ngày công, thu nhập, điều kiện đi lại và khả năng chấp nhận phương án điều động.",
          "Bài công bố không nêu mức thu nhập bình quân hay số lao động bị ảnh hưởng toàn Công ty. Vì vậy không nên suy diễn quy mô từ 10 người tham gia đối thoại. Đây là nhóm đại diện cho các nơi khó khăn, không phải toàn bộ lao động của đơn vị.",
        ],
      },
      {
        title: "Điều động và bố trí linh hoạt giúp duy trì thu nhập",
        paragraphs: [
          "Tổng công ty và Than Núi Hồng đã chủ động xây dựng phương án điều động, bố trí lao động sang các đơn vị khác trong Tổng công ty. Giải pháp này tận dụng nhu cầu nhân lực nội bộ, giảm nguy cơ người lao động phải chờ việc kéo dài.",
          "Việc điều động cần được thực hiện trên cơ sở tay nghề, sức khỏe, địa điểm làm việc và hoàn cảnh gia đình. Nếu khoảng cách di chuyển, chi phí sinh hoạt hoặc vị trí mới không phù hợp, phương án có thể bảo đảm ngày công nhưng lại tạo thêm áp lực cho người lao động.",
          "Đối với trường hợp chưa thể bố trí việc ngay, doanh nghiệp thực hiện chế độ đối với người ngừng việc tạm thời. Người lao động cần được thông báo rõ thời gian, mức hưởng, quyền lợi bảo hiểm và thời điểm đánh giá lại phương án.",
        ],
      },
      {
        title: "Công đoàn TKV đề nghị bảo đảm đủ chế độ, an sinh",
        paragraphs: [
          "Công đoàn TKV ghi nhận nỗ lực duy trì việc làm, đời sống và ổn định tư tưởng của người lao động. Đồng thời, đoàn công tác đề nghị Công ty tiếp tục linh hoạt bố trí việc làm và bảo đảm đầy đủ chính sách đối với người lao động.",
          "Các kiến nghị của Công ty sẽ được tổng hợp, báo cáo lãnh đạo Tập đoàn và phối hợp ban chuyên môn nghiên cứu giải pháp. Trọng tâm được nêu là việc làm, thu nhập và chính sách an sinh trong thời gian dự án chưa đi vào hoạt động.",
          "Hai mươi suất quà tổng trị giá 20 triệu đồng được trao cho người có ngày công thấp trong bảy tháng đầu năm. Khoản quà có ý nghĩa động viên, nhưng giải pháp cốt lõi vẫn là bố trí được việc làm và bảo đảm đời sống ổn định.",
        ],
      },
      {
        title: "Người lao động cần được tham gia khi phương án thay đổi",
        paragraphs: [
          "Việc mời công nhân trực tiếp đối thoại là bước quan trọng. Người lao động nắm rõ nhất tác động của thiếu việc lên thu nhập, sinh hoạt gia đình và tâm lý. Phản hồi của họ giúp doanh nghiệp điều chỉnh phương án theo từng nhóm hoàn cảnh.",
          "Cơ chế đối thoại nên tiếp tục sau buổi làm việc, với mốc thời gian và đầu mối rõ ràng. Những vấn đề cần cập nhật gồm tiến độ giấy phép, số người được bố trí việc, mức thu nhập, các trường hợp ngừng việc và kết quả giải quyết kiến nghị.",
          "Trong thời gian chờ dự án, doanh nghiệp cũng có thể xem xét bồi dưỡng tay nghề, đào tạo chuyển đổi vị trí và chuẩn hóa kỹ năng an toàn. Thời gian thiếu khối lượng sản xuất nếu được sử dụng hợp lý có thể trở thành giai đoạn chuẩn bị nhân lực cho khi dự án được thông qua.",
        ],
      },
    ],
    factsTitle: "Các phương án ổn định việc làm tại Than Núi Hồng",
    actionTitle: "Người lao động nên hỏi rõ những nội dung nào",
    conclusionTitle: "Bảo đảm việc làm là giải pháp an sinh căn bản",
    checklist: [
      ["Vị trí được bố trí", "Hỏi rõ đơn vị, công việc, ca làm và thời gian dự kiến khi điều động."],
      ["Thu nhập và chi phí", "Đối chiếu tiền lương, phụ cấp, đi lại và sinh hoạt tại địa điểm mới."],
      ["Chế độ ngừng việc", "Yêu cầu thông tin bằng văn bản về thời gian, mức hưởng và quyền lợi bảo hiểm."],
      ["Kênh đối thoại", "Phản ánh sớm khó khăn với công đoàn và bộ phận lao động để được xem xét."],
    ],
    takeaway: "Than Núi Hồng đang xử lý tác động việc làm từ dự án chưa được cấp phép bằng điều động nội bộ, bố trí linh hoạt và thực hiện chế độ ngừng việc. Hai mươi suất quà là hỗ trợ trước mắt; sự ổn định dài hạn phụ thuộc tiến độ dự án và khả năng duy trì khối lượng cho người lao động.",
    faq: [
      ["Vì sao việc làm tại Than Núi Hồng bị ảnh hưởng?", "Dự án mở rộng, nâng công suất Mỏ Núi Hồng chưa được cấp giấy phép khai thác, làm hoạt động sản xuất kinh doanh gặp khó trong năm 2026."],
      ["Công ty đang bố trí lao động như thế nào?", "Các phương án gồm điều động sang đơn vị khác trong Tổng công ty, sắp xếp việc linh hoạt và thực hiện chế độ với người ngừng việc tạm thời."],
      ["Công đoàn TKV hỗ trợ bao nhiêu suất quà?", "Có 20 suất quà tổng trị giá 20 triệu đồng dành cho lao động có ngày công thấp trong bảy tháng đầu năm."],
      ["Bài viết có nêu khi nào dự án được cấp phép không?", "Không. Thông tin công bố ngày 07/08/2026 chỉ nêu dự án chưa được cấp phép và các phương án ổn định người lao động trong thời gian chờ."],
    ],
    sources: [makeSource("than-nui-hong-bao-dam-viec-lam-thu-nhap-2026", "Công đoàn TKV nắm bắt tình hình sản xuất, đời sống, việc làm của người lao động tại Công ty than Núi Hồng", "07/08/2026")],
    seoLine: "Nội dung làm rõ việc làm Than Núi Hồng 2026, phương án điều động lao động và chính sách an sinh trong khi dự án mở rộng chờ cấp phép.",
  },
);

export const dailyCommunityArticles20260809 = [
  thanNuiHongArticle20260809,
  thanMongDuongArticle20260809,
  coDienUongBiArticle20260809,
  tuyenThanCuaOngArticle20260809,
];
