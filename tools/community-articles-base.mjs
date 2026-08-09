import { communitySourceImages } from "./community-source-images.mjs";
import { historicalLocalityStories } from "./historical-locality-articles.mjs";

const publishedDay = "2026-08-01";

const baseStoryEditorialLabels = {
  "tuyen-quang-phoi-hop-tuyen-sinh-nghe-mo-2025-2030": {
    factsTitle: "Bốn xã, hơn 130 hội nghị và 636 lao động",
    actionTitle: "Từ buổi tư vấn ở thôn tới lịch nhập học",
    conclusionTitle: "Mô hình ba bên phải theo người học tới việc làm",
  },
  "hai-lang-phoi-hop-dao-tao-viec-lam-nganh-than": {
    factsTitle: "272 người vào học, 259 người được bố trí việc làm",
    actionTitle: "Kiểm chứng chương trình bằng người đi trước",
    conclusionTitle: "Năm năm kết quả tạo nền cho giai đoạn 2026–2030",
  },
  "bang-thanh-phuc-loc-hoc-nghe-tho-lo-tkv": {
    factsTitle: "Hai xã, 74 thôn và mục tiêu 40 người mỗi xã",
    actionTitle: "Gia đình cần biết gì trước ngày đăng ký?",
    conclusionTitle: "Chỉ tiêu phải đi cùng chất lượng người học",
  },
  "nam-tuan-cao-bang-dao-tao-nghe-mo-viec-lam": {
    factsTitle: "Ba bên cùng ký cam kết cho giai đoạn 2026–2030",
    actionTitle: "Từ tư vấn tại xã đến hồ sơ đủ điều kiện",
    conclusionTitle: "Đào tạo theo địa chỉ phải đi tới đúng việc làm",
  },
  "luong-minh-hieu-qua-tuyen-sinh-dao-tao-viec-lam": {
    factsTitle: "31 hội nghị, 96 hồ sơ, 37 người nhập học",
    actionTitle: "Dùng dữ liệu để sửa đúng điểm nghẽn",
    conclusionTitle: "Hiệu quả nằm ở người hoàn thành và có việc",
  },
  "dien-xa-than-khe-cham-hop-tac-dao-tao-viec-lam": {
    factsTitle: "Ngày 21/5: ba chủ thể, một kế hoạch 2026–2030",
    actionTitle: "Hỏi doanh nghiệp về nghề và vị trí trước khi đăng ký",
    conclusionTitle: "Ba bên cùng chịu trách nhiệm tới ngày tiếp nhận",
  },
  "duong-hoa-than-duong-huy-tuyen-sinh-nghe-mo": {
    factsTitle: "Hai thôn, hai đơn vị và một buổi tư vấn tại cơ sở",
    actionTitle: "Người dân cần hỏi gì ngay tại thôn?",
    conclusionTitle: "Thông tin gần dân phải dẫn tới quyết định đúng nghề",
  },
  "dong-van-ha-giang-cong-trinh-phuc-loi-tuyen-sinh-nghe-mo": {
    factsTitle: "Công trình phúc lợi và cơ hội nghề cùng được bàn tại Đồng Văn",
    actionTitle: "Phân biệt nguồn an sinh với quy trình tuyển sinh",
    conclusionTitle: "Hạ tầng và việc làm cùng tạo nền cho sinh kế",
  },
  "tho-mo-tkv-xoa-nha-tam-tay-nguyen": {
    factsTitle: "123 tỷ đồng trong tổng 1.550 tỷ đồng an sinh xã hội",
    actionTitle: "Đọc đúng quy mô chương trình và địa bàn thụ hưởng",
    conclusionTitle: "Mái nhà an toàn là điểm bắt đầu của sinh kế ổn định",
  },
  "tkv-ho-tro-70-ty-khac-phuc-bao-yagi": {
    factsTitle: "70 tỷ đồng được chia thành ba lớp hỗ trợ",
    actionTitle: "Theo nguồn lực từ cam kết tới địa bàn",
    conclusionTitle: "Phục hồi được đo ở cộng đồng và người lao động",
  },
  "tkv-gieng-khoan-nuoc-sach-truong-hoc-lai-chau": {
    factsTitle: "Một giếng khoan phục vụ ba cấp học ở Sơn Bình",
    actionTitle: "Theo công trình từ bàn giao đến vận hành",
    conclusionTitle: "Nước sạch giữ nhịp học tập mỗi ngày",
  },
  "tkv-ho-tro-12-ty-tay-nguyen-khac-phuc-mua-lu": {
    factsTitle: "Lâm Đồng 5 tỷ, Đắk Lắk 3 tỷ, hai tỉnh mỗi nơi 2 tỷ",
    actionTitle: "Công khai phân bổ và nhu cầu ưu tiên",
    conclusionTitle: "Nguồn lực đến đúng nơi giúp phục hồi nhanh hơn",
  },
};

const makeArticle = (article, index) => {
  const sourceImage = communitySourceImages[article.slug];
  const primarySourceUrl = article.sources?.[0]?.url;

  if (!sourceImage) {
    throw new Error(`Bài ${article.slug} chưa có ảnh gốc từ bài nguồn.`);
  }

  if (primarySourceUrl !== sourceImage.sourceUrl) {
    throw new Error(`Ảnh và nguồn chính của bài ${article.slug} không khớp nhau.`);
  }

  return {
    updated: `${publishedDay}T${String(8 + Math.floor(index / 4)).padStart(2, "0")}:${String((index % 4) * 15).padStart(2, "0")}:00+07:00`,
    published: `${publishedDay}T${String(8 + Math.floor(index / 4)).padStart(2, "0")}:${String((index % 4) * 15).padStart(2, "0")}:00+07:00`,
    urlPath: `tin-nganh-than/2026/08/01/${article.slug}`,
    related: article.related || ["dieu-kien-tuyen-tho-lo-2026", "hoc-nghe-khai-thac-mo-2-3-thang"],
    ...article,
    ...(baseStoryEditorialLabels[article.slug] || {}),
    image: sourceImage.image,
    imageAlt: sourceImage.alt,
    imageSource: sourceImage.credit,
    imageCaption: sourceImage.caption,
    imageOriginal: sourceImage.originalImage,
    imageLocalFile: sourceImage.localFile,
    imageReferrerPolicy: sourceImage.referrerPolicy,
  };
};

const stories = [
  {
    slug: "tuyen-quang-phoi-hop-tuyen-sinh-nghe-mo-2025-2030",
    section: "Kết nối địa phương",
    title: "Bốn xã Tuyên Quang mở đường học nghề mỏ, việc làm TKV",
    seoTitle: "Tuyển sinh nghề mỏ Tuyên Quang giai đoạn 2025–2030",
    description: "Bốn xã Ngọc Long, Đường Thượng, Thàng Tín, Trung Thịnh phối hợp Trường Cao đẳng TKV và doanh nghiệp tuyển sinh nghề mỏ giai đoạn 2025–2030.",
    lead: "Một chuỗi hợp tác đưa thông tin học nghề, điều kiện sinh hoạt và nơi làm việc đến tận thôn bản, giúp thanh niên Tuyên Quang nhìn rõ con đường vào ngành Than.",
    keyword: "tuyển sinh nghề mỏ Tuyên Quang",
    keywords: ["tuyển sinh nghề mỏ Tuyên Quang", "việc làm TKV Tuyên Quang", "học nghề thợ lò", "Trường Cao đẳng TKV"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_6198.jpg",
    imageAlt: "Hội nghị của TKV trong thư viện ảnh Vinacomin",
    imageSource: "Thư viện ảnh Vinacomin · TKV triển khai nhiệm vụ sản xuất",
    facts: [
      ["4 xã", "Ngọc Long, Đường Thượng, Thàng Tín và Trung Thịnh cùng tham gia chuỗi ký kết."],
      ["636 lao động", "Kết quả tuyển được nêu trong báo cáo phối hợp trước thời điểm ký quy chế mới."],
      ["Hơn 130", "Số hội nghị tuyên truyền, tư vấn tuyển sinh đã được tổ chức tại địa bàn."],
      ["2025–2030", "Giai đoạn hợp tác mới giữa Nhà trường, doanh nghiệp và địa phương."],
    ],
    intro: [
      "<strong>Tuyển sinh nghề mỏ Tuyên Quang</strong> được tổ chức theo một quy trình có Nhà trường, doanh nghiệp và chính quyền địa phương cùng tham gia. Trong các ngày 24–27/11/2025, Trường Cao đẳng Than – Khoáng sản Việt Nam phối hợp Công ty Than Hòn Gai – TKV, Công ty Xây lắp mỏ – TKV và bốn xã Ngọc Long, Đường Thượng, Thàng Tín, Trung Thịnh tổ chức chuỗi hội nghị ký quy chế phối hợp.",
      "Thông tin được đưa tới cấp thôn và trường học, với sự tham gia của cán bộ cơ sở cùng những công nhân người địa phương đang làm tại doanh nghiệp TKV. Với thanh niên vùng cao, câu chuyện từ người đã đi học và đang làm việc tại doanh nghiệp thường dễ kiểm chứng hơn một lời quảng cáo chung chung trên mạng.",
    ],
    sections: [
      {
        title: "Mô hình ba bên giải quyết điều gì?",
        paragraphs: [
          "Địa phương có lợi thế hiểu từng hộ gia đình, hoàn cảnh và nhu cầu việc làm. Nhà trường chịu trách nhiệm tư vấn đúng nghề, tổ chức đào tạo và rèn tác phong. Doanh nghiệp nói rõ nhu cầu sử dụng lao động, vị trí dự kiến, môi trường làm việc và quá trình tiếp nhận sau tốt nghiệp. Khi ba bên chia sẻ trách nhiệm, người học giảm nguy cơ nhận thông tin lệch hoặc phải tự tìm đường đến Quảng Ninh.",
          "Quy chế còn đề cập ký túc xá, hỗ trợ tiền ăn trong thời gian học, chế độ thực tập và việc làm sau tốt nghiệp. Đây là các nội dung có giá trị với lao động ở xa, nhưng người đăng ký vẫn phải xác nhận chính sách đang áp dụng cho đúng đợt.",
        ],
        bullets: [
          "Tư vấn được tổ chức gần nơi người lao động sinh sống.",
          "Gia đình có thể hỏi trực tiếp đại diện địa phương, Nhà trường và doanh nghiệp.",
          "Quá trình từ tuyển chọn, đào tạo đến bố trí việc làm có đầu mối phối hợp.",
          "Người học vẫn phải đáp ứng tiêu chuẩn sức khỏe, kỷ luật và kết quả đào tạo.",
        ],
      },
      {
        title: "Vì sao lao động Tuyên Quang phù hợp với cơ hội này?",
        paragraphs: [
          "Nhiều xã miền núi có lực lượng thanh niên cần việc làm ổn định nhưng ít cơ hội học nghề gắn với doanh nghiệp lớn ngay tại địa phương. Hợp tác với TKV tạo thêm một lựa chọn: đi học nghề có địa chỉ, rèn kỹ năng công nghiệp rồi làm việc tại các đơn vị ngành Than ở Quảng Ninh.",
          "Nghề mỏ phù hợp với người có sức khỏe, khả năng làm theo ca, tinh thần kỷ luật và sự đồng thuận của gia đình khi phải đi xa. Chương trình cần trình bày đầy đủ cả cơ hội lẫn yêu cầu để mỗi người tự đánh giá trước khi quyết định.",
        ],
      },
      {
        title: "Kết quả cũ cần được theo dõi tiếp ra sao?",
        paragraphs: [
          "Con số 636 lao động trong báo cáo phối hợp cho thấy chương trình đã hình thành một tuyến tuyển sinh có quy mô. Để đánh giá đầy đủ hơn, dữ liệu cần được tách theo số người nhập học, hoàn thành khóa, nhận việc và còn gắn bó sau năm đầu.",
          "Cách theo dõi nhiều chặng giúp địa phương nhận ra khâu nào đang vận hành tốt và khâu nào cần hỗ trợ thêm. Trách nhiệm của chương trình bao gồm số hồ sơ, sức khỏe, kết quả học tập và khả năng hòa nhập của từng người sau khi tới Quảng Ninh.",
        ],
      },
      {
        title: "Người muốn đăng ký nên đi theo đường chính thức",
        paragraphs: [
          "Thanh niên tại bốn xã có thể bắt đầu bằng việc kiểm tra năm sinh, chiều cao, cân nặng, thị lực và tình trạng sức khỏe. Sau bước sàng lọc, cần nhận lịch, địa điểm, danh mục hồ sơ và người phụ trách cụ thể rồi mới sắp xếp di chuyển hoặc bàn giao công việc hiện tại.",
          "Gia đình nên cùng tham gia buổi tư vấn để hiểu thời gian học, nơi ở, việc thực tập và đơn vị có thể tiếp nhận. Quyết định đi học bền vững hơn khi người lao động biết rõ mình sẽ học gì, phải tuân thủ điều gì và cách liên hệ khi phát sinh khó khăn.",
        ],
      },
    ],
    checklist: [
      ["Kiểm tra điều kiện", "Gửi năm sinh, thể lực, thị lực và sức khỏe để sàng lọc ban đầu."],
      ["Hỏi đúng đợt", "Xác nhận lịch học, chính sách hỗ trợ và doanh nghiệp dự kiến tiếp nhận."],
      ["Chuẩn bị gia đình", "Trao đổi rõ việc học và làm xa nhà tại Quảng Ninh."],
      ["Giữ đầu mối", "Lưu liên hệ của cán bộ tuyển sinh và đại diện địa phương phụ trách."],
    ],
    takeaway: "Sức thuyết phục của mô hình Tuyên Quang đến từ chuỗi trách nhiệm có địa chỉ. Người lao động được tiếp cận thông tin gần nhà, còn Nhà trường và doanh nghiệp có cơ hội theo sát từ lúc tư vấn đến khi vào nghề.",
    faq: [
      ["Người ngoài bốn xã có đăng ký học nghề mỏ được không?", "Có thể liên hệ để kiểm tra theo địa bàn phụ trách và chỉ tiêu từng đợt; quy chế trong bài tập trung vào bốn xã nêu trên."],
      ["Đi học có chắc chắn được bố trí việc làm không?", "Nguồn công bố nêu định hướng bố trí việc làm sau tốt nghiệp, nhưng mỗi người vẫn phải đủ sức khỏe, hoàn thành chương trình và đáp ứng yêu cầu tiếp nhận."],
      ["Gia đình có thể kiểm chứng chương trình bằng cách nào?", "Có thể hỏi cán bộ địa phương, Nhà trường, doanh nghiệp và những lao động cùng quê đã học hoặc đang làm việc trong ngành Than."],
    ],
    sources: [
      {publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Ký kết quy chế phối hợp tuyển sinh – đào tạo nghề với các địa phương giai đoạn 2025–2030", date: "29/11/2025", url: "https://caodangtkv.edu.vn/truong-cao-dang-than-khoang-san-viet-nam-ky-ket-quy-che-phoi-hop-tuyen-sinh-dao-tao-nghe-voi-cac-dia-phuong-giai-doan-2025-2030/"},
    ],
  },
  {
    slug: "hai-lang-phoi-hop-dao-tao-viec-lam-nganh-than",
    section: "Kết nối địa phương",
    title: "Hải Lạng kết nối học nghề mỏ với việc làm tại Than Dương Huy",
    description: "Xã Hải Lạng, Trường Cao đẳng TKV và Công ty Than Dương Huy ký quy chế phối hợp đào tạo nghề, giải quyết việc làm giai đoạn 2026–2030.",
    lead: "Từ 272 học sinh đã được tuyển trong 5 năm, Hải Lạng bước vào giai đoạn hợp tác mới với mục tiêu đưa thêm lao động địa phương học nghề và làm việc trong ngành Than.",
    keyword: "học nghề mỏ Hải Lạng",
    keywords: ["học nghề mỏ Hải Lạng", "việc làm Than Dương Huy", "tuyển thợ mỏ Quảng Ninh", "Trường Cao đẳng TKV"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_2366.jpg",
    imageAlt: "Hoạt động ký kết đào tạo công nhân khai thác than của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Ký kết dự án đào tạo công nhân khai thác than",
    facts: [
      ["30 hội nghị", "Số buổi tư vấn trực tiếp được tổ chức trong giai đoạn 2020–2025."],
      ["985 lượt", "Người dân đã tham dự các hoạt động tư vấn tại thôn bản."],
      ["272 học sinh", "Số người được tuyển học nghề mỏ trong giai đoạn được báo cáo."],
      ["Trên 50/năm", "Mục tiêu tuyển chọn lao động địa phương trong giai đoạn hợp tác mới."],
    ],
    intro: [
      "Chiều 27/01/2026, tại Nhà văn hóa thôn Thống Nhất, xã Hải Lạng, Trường Cao đẳng Than – Khoáng sản Việt Nam, chính quyền xã và Công ty Than Dương Huy – TKV ký quy chế phối hợp đào tạo nghề, giải quyết việc làm giai đoạn 2026–2030. Hoạt động tiếp nối một chương trình đã có kết quả thực tế trong năm năm trước đó.",
      "Theo báo cáo tại hội nghị, giai đoạn 2020–2025 đã có 272 học sinh được tuyển học nghề mỏ; 259 người tốt nghiệp và được bố trí việc làm. Những dữ kiện này làm cho chủ đề <strong>học nghề mỏ Hải Lạng</strong> trở nên dễ kiểm chứng hơn: người quan tâm có thể hỏi ngay những lao động đang làm tại Than Dương Huy và các doanh nghiệp TKV.",
    ],
    sections: [
      {
        title: "Kết quả 5 năm nói lên điều gì?",
        paragraphs: [
          "Tỷ lệ tốt nghiệp và được bố trí việc làm cao cho thấy việc phối hợp tại cơ sở có tác dụng rõ rệt. Người lao động được tư vấn trước về nghề, Nhà trường nắm nguồn tuyển, còn doanh nghiệp tham gia từ sớm để giải thích công việc và chế độ. Khi thông tin đi qua nhiều lớp kiểm chứng, quyết định vào nghề có cơ sở hơn.",
          "Kết quả của giai đoạn trước cho thấy chương trình có đường đi rõ. Mỗi hồ sơ trong giai đoạn mới vẫn phải đáp ứng tiêu chuẩn sức khỏe, chỉ tiêu đào tạo, kết quả học tập và yêu cầu tiếp nhận của doanh nghiệp.",
        ],
        bullets: [
          "Tư vấn gắn với thôn, đoàn thể và người lao động đi trước.",
          "Nhà trường chịu trách nhiệm đào tạo và theo dõi người học.",
          "Than Dương Huy tham gia giải thích nhu cầu và môi trường làm việc.",
          "Địa phương hỗ trợ xác minh, vận động và kết nối gia đình.",
        ],
      },
      {
        title: "Mục tiêu trên 50 lao động mỗi năm cần triển khai ra sao?",
        paragraphs: [
          "Mục tiêu chỉ có ý nghĩa khi đi cùng chất lượng nguồn tuyển. Tư vấn cần tập trung vào người thực sự đủ điều kiện, có mong muốn làm việc lâu dài và hiểu đặc thù nghề. Nếu chỉ chạy theo số hồ sơ, tỷ lệ bỏ học hoặc bỏ việc có thể tăng và làm mất niềm tin của cộng đồng.",
          "Quy chế mới nhấn mạnh chăm lo đời sống vật chất, tinh thần và bảo đảm chế độ cho người lao động. Quyết định gắn bó dựa vào cả thu nhập, nơi ở, bữa ăn, xe đưa đón, sức khỏe và cách doanh nghiệp hỗ trợ người mới.",
        ],
      },
      {
        title: "Lợi thế của người học ngay tại Quảng Ninh",
        paragraphs: [
          "So với lao động từ tỉnh xa, người Hải Lạng có lợi thế về khoảng cách và khả năng nhận hỗ trợ từ gia đình. Việc tìm hiểu doanh nghiệp, cơ sở đào tạo hoặc gặp người đang làm trong ngành cũng thuận tiện hơn. Lợi thế này giúp giảm một phần áp lực thích nghi trong giai đoạn đầu.",
          "Nhưng ở gần không làm nghề trở nên nhẹ hơn. Người học vẫn phải rèn sức khỏe, đi học đủ, tuân thủ nội quy và sẵn sàng làm việc theo ca. Sự chuẩn bị nghiêm túc từ đầu là cách tốt nhất để biến lợi thế địa lý thành khả năng theo nghề lâu dài.",
        ],
      },
      {
        title: "Cách kiểm tra thông tin tuyển sinh tại Hải Lạng",
        paragraphs: [
          "Người lao động nên đối chiếu thông tin từ ba đầu mối: cán bộ xã hoặc thôn phụ trách, Trường Cao đẳng TKV và đơn vị doanh nghiệp tham gia. Một đợt tiếp nhận rõ ràng phải có ngày, địa điểm, hồ sơ, tiêu chuẩn sức khỏe và người chịu trách nhiệm hướng dẫn.",
          "Không giao giấy tờ gốc hoặc chuyển tiền cho tài khoản cá nhân tự xưng môi giới. Nếu chính sách hỗ trợ thay đổi, cần yêu cầu xác nhận theo văn bản hoặc thông tin chính thức của đợt đang tuyển, không dựa hoàn toàn vào chế độ của người đã học nhiều năm trước.",
        ],
      },
    ],
    checklist: [
      ["Hỏi tại địa phương", "Xác định cán bộ thôn hoặc xã đang phụ trách chương trình."],
      ["Đo lại thể lực", "Kiểm tra chiều cao, cân nặng, thị lực và sức khỏe hiện tại."],
      ["Gặp người đi trước", "Tìm hiểu ca làm, sinh hoạt và thu nhập bằng trường hợp thực tế."],
      ["Nhận lịch rõ", "Chỉ chuẩn bị hồ sơ, di chuyển khi đã có đầu mối và thời gian cụ thể."],
    ],
    takeaway: "Hải Lạng có một nền tảng hiếm có: số người đã học và đang làm đủ lớn để cộng đồng tự kiểm chứng. Điều cần giữ trong giai đoạn mới là tuyển đúng người, nói đúng nghề và theo sát người học đến khi ổn định việc làm.",
    faq: [
      ["Mục tiêu trên 50 người/năm có phải chỉ tiêu bắt buộc với từng thôn?", "Nguồn công bố nêu mục tiêu chung cho địa phương; cách phân bổ và lịch tuyển cần theo kế hoạch triển khai thực tế."],
      ["Học xong có chỉ làm tại Than Dương Huy không?", "Than Dương Huy là doanh nghiệp tham gia ký kết; đơn vị tiếp nhận cụ thể phải được xác nhận theo chỉ tiêu và kết quả từng đợt."],
      ["Người từng làm mỏ có thể đăng ký lại không?", "Có thể đề nghị kiểm tra diện tái tuyển, nhưng vẫn phải đối chiếu hồ sơ, sức khỏe và nhu cầu của đơn vị."],
    ],
    sources: [
      {publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Hội nghị ký Quy chế phối hợp giữa Nhà trường, xã Hải Lạng và Công ty Than Dương Huy – TKV", date: "28/01/2026", url: "https://caodangtkv.edu.vn/hoi-nghi-ky-quy-che-phoi-hop-giua-truong-cao-dang-than-khoang-san-viet-nam-xa-hai-lang-va-cong-ty-than-duong-huy-tkv/"},
    ],
  },
  {
    slug: "bang-thanh-phuc-loc-hoc-nghe-tho-lo-tkv",
    section: "Kết nối địa phương",
    title: "Bằng Thành, Phúc Lộc kết nối thanh niên với nghề thợ lò TKV",
    description: "Hai xã Bằng Thành và Phúc Lộc phối hợp Trường Cao đẳng TKV, Than Hòn Gai đào tạo nghề và giải quyết việc làm cho lao động địa phương.",
    lead: "Mục tiêu tối thiểu 40 lao động mỗi xã mỗi năm cho thấy hợp tác đã đi từ tuyên truyền chung sang kế hoạch có trách nhiệm và đầu mối thực hiện.",
    keyword: "học nghề thợ lò Thái Nguyên",
    keywords: ["học nghề thợ lò Thái Nguyên", "tuyển thợ mỏ Bằng Thành", "việc làm TKV Phúc Lộc", "Than Hòn Gai tuyển dụng"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_4274.jpg",
    imageAlt: "Công nhân ngành Than trong hoạt động của Công đoàn TKV",
    imageSource: "Thư viện ảnh Vinacomin · Thăm và tặng quà công nhân Than Dương Huy",
    facts: [
      ["2 xã", "Bằng Thành và Phúc Lộc thuộc tỉnh Thái Nguyên tham gia ký quy chế."],
      ["40 người/xã", "Mục tiêu tối thiểu hằng năm được nêu trong nội dung phối hợp."],
      ["74 thôn", "Tổng số thôn của hai xã có đại diện tham dự hội nghị."],
      ["2026–2030", "Khoảng thời gian triển khai hợp tác đào tạo và việc làm."],
    ],
    intro: [
      "Trong hai ngày 11–12/02/2026, Trường Cao đẳng Than – Khoáng sản Việt Nam và Công ty Than Hòn Gai – TKV ký quy chế phối hợp với xã Bằng Thành, xã Phúc Lộc về đào tạo nghề và giải quyết việc làm. Hoạt động diễn ra ngay trước Tết nhưng đặt ra nhiệm vụ dài hạn đến năm 2030, với mục tiêu tối thiểu 40 lao động mỗi xã tham gia học nghề và làm việc ổn định hằng năm.",
      "Đối với người đang tìm <strong>học nghề thợ lò Thái Nguyên</strong>, giá trị lớn nhất của thỏa thuận là có đủ ba chủ thể cùng xuất hiện: địa phương xác định nguồn lao động, Nhà trường tổ chức đào tạo, Than Hòn Gai tham gia với vai trò đơn vị sử dụng lao động. Người học nhờ đó có thể hỏi rõ từng chặng từ tuyển chọn đến tiếp nhận việc làm.",
    ],
    sections: [
      {
        title: "Từ chỉ tiêu tuyển sinh đến trách nhiệm với người học",
        paragraphs: [
          "Một con số tuyển sinh chỉ phản ánh đầu vào. Hiệu quả thực sự phải được đo bằng số người học đủ, thực tập an toàn, tốt nghiệp và có việc làm ổn định. Vì vậy, nội dung phối hợp xuyên suốt từ tuyên truyền, tuyển chọn, đào tạo đến tiếp nhận là điểm cần được theo dõi trong cả giai đoạn.",
          "Nhà trường phải nói rõ chương trình và kỷ luật học tập; doanh nghiệp cần minh bạch công việc, ca sản xuất, thu nhập và phúc lợi; địa phương hỗ trợ kết nối với gia đình. Nếu một mắt xích bị bỏ trống, người học dễ hụt hẫng khi chuyển từ tư vấn tại quê đến môi trường công nghiệp ở Quảng Ninh.",
        ],
        bullets: [
          "Tiếp cận trực tiếp hộ gia đình có thanh niên trong độ tuổi lao động.",
          "Tổ chức tư vấn trực tiếp ở cấp xã, thôn và duy trì kênh thông tin trực tuyến.",
          "Đào tạo gắn với thực hành và yêu cầu thực tế của doanh nghiệp.",
          "Theo dõi người học trong cả giai đoạn thực tập và bố trí việc làm.",
        ],
      },
      {
        title: "Vì sao Than Hòn Gai tham gia từ khâu tuyển sinh?",
        paragraphs: [
          "Doanh nghiệp trực tiếp sử dụng lao động hiểu rõ vị trí nào thiếu người, kỹ năng nào cần rèn và nguyên nhân nào khiến người mới khó gắn bó. Tham gia sớm giúp thông tin tư vấn sát công việc hơn, đồng thời tạo điều kiện để chương trình đào tạo điều chỉnh theo thiết bị và tổ chức sản xuất thực tế.",
          "Với người đăng ký, điều này không có nghĩa được tuyển thẳng vào doanh nghiệp. Họ vẫn phải qua sàng lọc sức khỏe, hoàn thành học tập và đạt yêu cầu tiếp nhận. Nhưng việc biết trước đơn vị tham gia giúp người lao động đặt câu hỏi cụ thể về nơi ở, tuyến xe, thực tập, phân công nghề và cơ chế tính lương.",
        ],
      },
      {
        title: "Gia đình là một phần của quyết định vào nghề",
        paragraphs: [
          "Phần lớn thanh niên từ Bằng Thành, Phúc Lộc sẽ phải sống xa nhà trong thời gian học và làm việc. Nếu gia đình chỉ biết đến mức thu nhập mà chưa hiểu môi trường làm theo ca, nguy cơ người học bỏ giữa chừng sẽ cao. Các buổi tư vấn tại thôn cần dành thời gian giải thích cả khó khăn ban đầu.",
          "Một quyết định tốt nên trả lời được: người học ở đâu, chi phí nào được hỗ trợ, khi nào bắt đầu thực tập, công việc sau tốt nghiệp là gì và liên hệ ai khi có vấn đề. Khi gia đình nắm đủ thông tin, sự động viên sẽ thực tế hơn và người lao động bớt áp lực tâm lý.",
        ],
      },
      {
        title: "Cơ hội thoát việc làm bấp bênh",
        paragraphs: [
          "Đối với lao động trẻ chưa có nghề, công việc thời vụ thường dễ vào nhưng khó tạo lộ trình tăng tay nghề và thu nhập. Học nghề mỏ mở ra một hướng khác: được đào tạo trước khi vào sản xuất, có môi trường công nghiệp và cơ hội tích lũy kỹ năng theo thời gian.",
          "Người lao động cần đáp ứng tiêu chuẩn sức khỏe, tuân thủ kỷ luật và hoàn thành định mức lao động. Chính sách đang áp dụng cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức.",
        ],
      },
    ],
    checklist: [
      ["Dự tư vấn cùng gia đình", "Nghe đủ nội dung về học tập, sinh hoạt, thực tập và việc làm."],
      ["Kiểm tra sức khỏe", "Không che giấu cận thị, bệnh tim mạch, huyết áp hoặc bệnh đang điều trị."],
      ["Hỏi đơn vị tiếp nhận", "Xác nhận vai trò của Than Hòn Gai trong đúng đợt đăng ký."],
      ["Lập kế hoạch đi xa", "Chuẩn bị giấy tờ, đồ dùng và phương án liên lạc trong thời gian học."],
    ],
    takeaway: "Hợp tác tại Bằng Thành và Phúc Lộc đặt chỉ tiêu cụ thể cho từng xã. Chất lượng vẫn cần đi trước số lượng: chọn đúng người, tư vấn đầy đủ và hỗ trợ đến khi người học ổn định mới tạo được nguồn lao động lâu dài.",
    faq: [
      ["Mỗi xã chắc chắn tuyển đủ 40 người mỗi năm không?", "Đây là mục tiêu phấn đấu trong quy chế; kết quả còn phụ thuộc nguồn đủ điều kiện và kế hoạch tiếp nhận từng năm."],
      ["Người chưa có tay nghề có đăng ký được không?", "Chương trình hướng tới đào tạo nghề trước khi làm việc, nhưng người đăng ký phải đạt điều kiện tuyển sinh và sức khỏe."],
      ["Có cần đi Quảng Ninh ngay sau buổi tư vấn không?", "Không. Chỉ di chuyển sau khi được xác nhận lịch, hồ sơ, địa điểm và người phụ trách cụ thể."],
    ],
    sources: [
      {publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Quyết tâm cao độ đẩy mạnh tuyển sinh, đào tạo thợ lò trong những ngày cận Tết", date: "13/02/2026", url: "https://caodangtkv.edu.vn/quyet-tam-cao-do-day-manh-tuyen-sinh-dao-tao-tho-lo-trong-nhung-ngay-can-tet/"},
    ],
  },
  {
    slug: "nam-tuan-cao-bang-dao-tao-nghe-mo-viec-lam",
    section: "Kết nối địa phương",
    title: "Nam Tuấn liên kết ba bên đào tạo nghề mỏ, bố trí việc làm",
    description: "Xã Nam Tuấn, Trường Cao đẳng TKV và Than Khe Chàm thiết lập hợp tác 2026–2030, gắn tuyển sinh nghề mỏ với nhu cầu sử dụng lao động.",
    lead: "Thanh niên Nam Tuấn có thêm một tuyến đi rõ ràng từ tư vấn tại địa phương, học nghề tại Trường Cao đẳng TKV đến cơ hội làm việc ở Than Khe Chàm.",
    keyword: "học nghề mỏ Nam Tuấn Cao Bằng",
    keywords: ["học nghề mỏ Nam Tuấn Cao Bằng", "việc làm Than Khe Chàm", "tuyển thợ mỏ Cao Bằng", "đào tạo nghề TKV"],
    image: "https://vinacomin.vn/Share/Media/2018/07/DSC_0618.jpg",
    imageAlt: "Đại diện địa phương làm việc với TKV trong thư viện ảnh Vinacomin",
    imageSource: "Thư viện ảnh Vinacomin · Đại diện địa phương làm việc với TKV",
    facts: [
      ["3 bên", "Xã Nam Tuấn, Trường Cao đẳng TKV và Công ty Than Khe Chàm cùng ký hợp tác."],
      ["01/05/2026", "Ngày diễn ra hội nghị ký biên bản tại xã Nam Tuấn."],
      ["2026–2030", "Giai đoạn phối hợp đào tạo nghề và giải quyết việc làm."],
      ["Theo địa chỉ", "Đào tạo được định hướng gắn với nhu cầu sử dụng thực tế của doanh nghiệp."],
    ],
    intro: [
      "Ngày 01/5/2026, xã Nam Tuấn, tỉnh Cao Bằng, Trường Cao đẳng Than – Khoáng sản Việt Nam và Công ty Than Khe Chàm – TKV ký biên bản hợp tác đào tạo nghề, giải quyết việc làm cho lao động địa phương giai đoạn 2026–2030. Mô hình đặt doanh nghiệp sử dụng lao động cạnh cơ sở đào tạo và chính quyền nơi tạo nguồn.",
      "Với người tìm hiểu <strong>học nghề mỏ Nam Tuấn Cao Bằng</strong>, điều này giúp con đường nghề nghiệp cụ thể hơn: được tư vấn tại quê, học nghề theo yêu cầu sản xuất, thực tập và hướng tới vị trí việc làm sau tốt nghiệp. Tuy nhiên, biên bản hợp tác là khung phối hợp; mỗi cá nhân vẫn phải đạt tiêu chuẩn của đợt tiếp nhận.",
    ],
    sections: [
      {
        title: "Đào tạo theo địa chỉ khác gì tuyển sinh thông thường?",
        paragraphs: [
          "Đào tạo theo địa chỉ bắt đầu từ nhu cầu nhân lực của doanh nghiệp. Nhà trường biết nhóm nghề, năng lực và tác phong cần hình thành; doanh nghiệp có thể tham gia định hướng thực hành, tiếp nhận thực tập và đánh giá đầu ra. Cách làm này thu hẹp khoảng cách giữa bài học và công việc.",
          "Người học cũng nhìn thấy mục tiêu nghề nghiệp rõ hơn, còn tiêu chuẩn đầu vào và kết quả đào tạo vẫn được giữ nguyên. Sức khỏe phù hợp, kỷ luật tốt và việc hoàn thành chương trình là ba điều kiện để con đường tới doanh nghiệp diễn ra thuận lợi.",
        ],
        bullets: [
          "Địa phương rà soát và giới thiệu đúng nhóm lao động có nhu cầu.",
          "Nhà trường đào tạo kiến thức, kỹ năng và kỷ luật an toàn.",
          "Than Khe Chàm phản hồi yêu cầu thực tế của vị trí sản xuất.",
          "Ba bên cùng theo dõi đời sống và khả năng gắn bó của người học.",
        ],
      },
      {
        title: "Chuyến tham quan trước đó tạo niềm tin thế nào?",
        paragraphs: [
          "Trước hội nghị ký kết, đoàn công tác xã Nam Tuấn đã khảo sát Công ty Than Khe Chàm và cơ sở đào tạo của Nhà trường. Việc tận mắt xem nơi học, điều kiện sinh hoạt và môi trường sản xuất có giá trị hơn nhiều tài liệu quảng bá, bởi đại diện địa phương có thể trả lời người dân bằng trải nghiệm thực tế.",
          "Mô hình này nên tiếp tục với phụ huynh và người đăng ký tiềm năng khi điều kiện cho phép. Sự minh bạch về công việc giúp người lao động hiểu rõ chương trình học nghề, định mức lao động và cam kết thu nhập trước khi đăng ký.",
        ],
      },
      {
        title: "Than Khe Chàm cần người lao động như thế nào?",
        paragraphs: [
          "Doanh nghiệp hầm lò cần sức khỏe, khả năng phối hợp tổ đội và thái độ tôn trọng quy trình. Máy móc ngày càng hiện đại làm tăng yêu cầu học kỹ thuật, chứ không xóa nhu cầu về người thợ có trách nhiệm. Người mới phải sẵn sàng tiếp nhận hướng dẫn và báo cáo khi phát hiện bất thường.",
          "Thanh niên chưa có nghề không nên tự thực hiện thao tác chuyên môn khi chưa được đào tạo và hướng dẫn. Việc cần chuẩn bị là thể lực, giấy tờ, thói quen đúng giờ và tâm thế học nghiêm túc. Kỹ năng nghề phải được rèn trong chương trình và dưới sự hướng dẫn có trách nhiệm.",
        ],
      },
      {
        title: "Lợi ích với địa phương nhìn từ người có nghề",
        paragraphs: [
          "Khi lao động có nghề và việc làm ổn định, thu nhập gửi về gia đình có thể hỗ trợ chi tiêu, học hành và cải thiện nhà ở. Quan trọng hơn, người trở về địa phương trong các kỳ nghỉ mang theo tác phong công nghiệp và thông tin thực tế, trở thành cầu nối cho những thanh niên khóa sau.",
          "Địa phương vẫn cần theo dõi rủi ro bỏ học, nợ vay hoặc khó thích nghi. Sau lễ ký cần có danh sách đầu mối, cơ chế phản hồi và hỗ trợ sớm khi người học gặp vấn đề về sức khỏe, tâm lý hoặc sinh hoạt.",
        ],
      },
    ],
    checklist: [
      ["Tìm đầu mối xã", "Hỏi lịch tư vấn, danh sách hồ sơ và người phụ trách chương trình."],
      ["Hiểu nơi làm việc", "Tìm hiểu Than Khe Chàm, công việc theo ca và yêu cầu an toàn."],
      ["Kiểm tra cá nhân", "Đối chiếu sức khỏe, thể lực và khả năng sống xa nhà."],
      ["Theo đúng quy trình", "Không tự đi hoặc nộp tiền khi chưa có xác nhận của đầu mối chính thức."],
    ],
    takeaway: "Nam Tuấn đang xây một chuỗi đào tạo có nơi đến cụ thể. Giá trị lâu dài sẽ phụ thuộc vào cách ba bên tuyển đúng người, duy trì liên lạc và giải quyết khó khăn trong những tháng đầu – giai đoạn quyết định người học có thể gắn bó với nghề hay không.",
    faq: [
      ["Ký hợp tác có nghĩa mọi thanh niên Nam Tuấn đều đủ điều kiện?", "Không. Người đăng ký phải qua sàng lọc, khám sức khỏe và đáp ứng yêu cầu của chương trình."],
      ["Sau tốt nghiệp có chắc làm tại Than Khe Chàm?", "Nguồn công bố nêu doanh nghiệp tham gia tiếp nhận, bố trí việc làm; kết quả cá nhân phụ thuộc chỉ tiêu, nghề học và đánh giá đầu ra."],
      ["Người ở xã khác của Cao Bằng có thể đăng ký không?", "Có thể liên hệ bộ phận tuyển sinh phụ trách Cao Bằng để kiểm tra kế hoạch theo địa bàn và đợt tuyển."],
    ],
    sources: [
      {publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Hội nghị triển khai ký biên bản hợp tác 3 bên về đào tạo nghề và giải quyết việc làm giai đoạn 2026–2030", date: "04/05/2026", url: "https://caodangtkv.edu.vn/hoi-nghi-trien-khai-ky-bien-ban-hop-tac-3-ben-tao-dot-pha-trong-dao-tao-nghe-va-giai-quyet-viec-lam-cho-lao-dong-dia-phuong-giai-doan-2026-2030/"},
    ],
  },
  {
    slug: "luong-minh-hieu-qua-tuyen-sinh-dao-tao-viec-lam",
    section: "Kết nối địa phương",
    title: "Lương Minh: từ 31 hội nghị tư vấn đến 37 học sinh nhập học",
    description: "Kết quả phối hợp tại xã Lương Minh cho thấy cách tuyển sinh nghề mỏ đi vào thực chất khi địa phương và Trường Cao đẳng TKV cùng theo sát người học.",
    lead: "Lương Minh công khai số người dự tư vấn, số hồ sơ phát ra và số học sinh thực sự nhập học — những dữ liệu giúp đánh giá đầy đủ hiệu quả tuyển sinh.",
    keyword: "tuyển sinh nghề mỏ Lương Minh",
    keywords: ["tuyển sinh nghề mỏ Lương Minh", "học nghề thợ lò Quảng Ninh", "Phân hiệu Hoành Bồ", "việc làm ngành Than"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5958.jpg",
    imageAlt: "Hội nghị điều hành của TKV trong thư viện ảnh Vinacomin",
    imageSource: "Thư viện ảnh Vinacomin · Hội nghị giao ban TKV vùng Quảng Ninh",
    facts: [
      ["31 hội nghị", "Số buổi tư vấn được Phân hiệu Hoành Bồ phối hợp tổ chức trong quý I/2026."],
      ["211 lượt", "Số người tham dự các hoạt động tư vấn tại địa phương."],
      ["96 hồ sơ", "Số bộ hồ sơ đã được phát cho người quan tâm."],
      ["37 nhập học", "Số học sinh thực tế nhập học được công bố tại hội nghị sơ kết."],
    ],
    intro: [
      "Ngày 13/5/2026, Trường Cao đẳng Than – Khoáng sản Việt Nam và xã Lương Minh tổ chức hội nghị sơ kết công tác tuyển sinh, đào tạo, giải quyết việc làm. Báo cáo quý I đưa ra chuỗi số liệu khá đầy đủ: 31 hội nghị tư vấn, 211 lượt người tham dự, 96 hồ sơ được phát và 37 học sinh nhập học.",
      "Với công tác <strong>tuyển sinh nghề mỏ Lương Minh</strong>, cách báo cáo theo từng bước cho thấy một điều quan trọng: đông người nghe chưa đồng nghĩa với nhiều người phù hợp. Hiệu quả phải được nhìn ở khả năng chuyển từ quan tâm sang hồ sơ hợp lệ, nhập học, hoàn thành đào tạo và cuối cùng là việc làm ổn định.",
    ],
    sections: [
      {
        title: "Vì sao tỷ lệ chuyển đổi cần được nhìn thẳng?",
        paragraphs: [
          "Từ 211 lượt dự tư vấn đến 37 người nhập học là quá trình sàng lọc tự nhiên. Có người không đạt sức khỏe, có người thay đổi kế hoạch, cũng có trường hợp gia đình chưa đồng thuận hoặc chưa sẵn sàng đi học. Công khai từng bước giúp đơn vị tuyển sinh nhận ra điểm nghẽn và điều chỉnh nội dung tư vấn.",
          "Mục tiêu là giúp người phù hợp đưa ra quyết định có hiểu biết. Một buổi tư vấn tốt cần nói rõ công việc, thời gian học, nơi ở, yêu cầu kỷ luật, thu nhập theo ngày công và những khó khăn khi mới xa nhà. Thông tin càng thật, tỷ lệ bỏ học sau nhập học càng có cơ hội giảm.",
        ],
        bullets: [
          "Đếm riêng người tham dự, hồ sơ phát và người nhập học.",
          "Ghi nguyên nhân không tiếp tục ở từng bước để cải thiện tư vấn.",
          "Ưu tiên người đủ sức khỏe, hiểu nghề và có quyết tâm theo học.",
          "Theo dõi tiếp kết quả học, thực tập và bố trí việc làm."],
      },
      {
        title: "Lợi thế của Phân hiệu Hoành Bồ",
        paragraphs: [
          "Cơ sở đào tạo gần địa bàn giúp người dân dễ tham quan, xác minh điều kiện học tập và trao đổi trực tiếp với cán bộ phụ trách. Khoảng cách ngắn hơn cũng thuận lợi cho gia đình theo dõi người học trong giai đoạn đầu, khi tâm lý và nếp sinh hoạt đang thay đổi.",
          "Tuy nhiên, thuận tiện địa lý không thay thế chất lượng đào tạo. Người học vẫn cần rèn kỹ năng thực hành, an toàn và tác phong công nghiệp. Mối liên hệ với doanh nghiệp phải được duy trì để chương trình sát công nghệ, vị trí và quy trình sản xuất mà học sinh sẽ gặp sau tốt nghiệp.",
        ],
      },
      {
        title: "Từ nhập học đến việc làm còn một chặng quan trọng",
        paragraphs: [
          "Con số 37 học sinh nhập học là kết quả tích cực nhưng chưa phải điểm kết thúc. Nhà trường và địa phương cần theo sát chuyên cần, sức khỏe, khó khăn sinh hoạt và tâm lý muốn bỏ học. Can thiệp sớm thường hiệu quả hơn khi người học đã nghỉ nhiều ngày hoặc tự rời cơ sở.",
          "Người lao động cũng cần chủ động: hỏi ngay khi chưa hiểu, báo vấn đề sức khỏe, giữ liên hệ với gia đình và đầu mối tuyển sinh. Học nghề mỏ là bước chuyển vào môi trường kỷ luật; khả năng hoàn thành chương trình chính là bằng chứng đầu tiên về mức độ sẵn sàng đi làm.",
        ],
      },
    ],
    checklist: [
      ["Dự tư vấn đầy đủ", "Nghe cả quyền lợi, yêu cầu sức khỏe và kỷ luật học tập."],
      ["Chỉ nhận hồ sơ đúng đợt", "Xác nhận thời gian, cơ sở học và người hướng dẫn."],
      ["Chuẩn bị tâm lý", "Thống nhất với gia đình về mục tiêu theo học đến cùng."],
      ["Báo sớm khó khăn", "Liên hệ giáo viên hoặc cán bộ tuyển sinh khi có nguy cơ bỏ học."],
    ],
    takeaway: "Lương Minh cung cấp một ví dụ tốt về quản trị tuyển sinh bằng dữ liệu. Thước đo quan trọng nhất là số người phù hợp hoàn thành đào tạo và ổn định việc làm sau đó.",
    faq: [
      ["37 học sinh nhập học có phải đều đã đi làm?", "Không. Đây là kết quả nhập học tại thời điểm sơ kết; cần tiếp tục theo dõi tốt nghiệp, thực tập và bố trí việc làm."],
      ["Người chưa dự 31 hội nghị có đăng ký được không?", "Có thể liên hệ đầu mối phụ trách để kiểm tra đợt tiếp nhận hiện hành, miễn đáp ứng điều kiện và hoàn thiện quy trình."],
      ["Vì sao phát 96 hồ sơ nhưng chỉ 37 người nhập học?", "Nguồn công bố không quy kết một nguyên nhân duy nhất; chênh lệch có thể đến từ điều kiện, quyết định cá nhân, gia đình và thời điểm tiếp nhận."],
    ],
    sources: [
      {publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Hội nghị sơ kết công tác tuyển sinh, đào tạo và giải quyết việc làm tại xã Lương Minh", date: "13/05/2026", url: "https://caodangtkv.edu.vn/hoi-nghi-so-ket-cong-tac-tuyen-sinh-dao-tao-va-giai-quyet-viec-lam-tai-xa-luong-minh/"},
      {publisher: "TKV", title: "Hội nghị sơ kết công tác tuyển sinh, đào tạo và giải quyết việc làm tại xã Lương Minh", date: "20/05/2026", url: "https://vinacomin.vn/news/slug/hoi-nghi-so-ket-cong-tac-tuyen-sinh-dao-tao-va-giai-quyet-viec-lam-tai-xa-luong-minh"},
    ],
  },
  {
    slug: "dien-xa-than-khe-cham-hop-tac-dao-tao-viec-lam",
    section: "Kết nối địa phương",
    title: "Điền Xá hợp tác với Than Khe Chàm đào tạo nghề, tạo việc làm",
    description: "Xã Điền Xá, Trường Cao đẳng TKV và Than Khe Chàm ký hợp tác đào tạo nghề, giải quyết việc làm cho lao động địa phương giai đoạn 2026–2030.",
    lead: "Sự tham gia trực tiếp của doanh nghiệp giúp người dân Điền Xá hiểu rõ hơn nơi làm việc, yêu cầu tay nghề và lộ trình sau đào tạo.",
    keyword: "việc làm ngành Than Điền Xá",
    keywords: ["việc làm ngành Than Điền Xá", "Than Khe Chàm tuyển dụng", "học nghề mỏ Quảng Ninh", "tuyển thợ lò 2026"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5917.jpg",
    imageAlt: "Đại biểu tham dự hội nghị TKV trong thư viện ảnh Vinacomin",
    imageSource: "Thư viện ảnh Vinacomin · Hội nghị của Tập đoàn Công nghiệp Than – Khoáng sản Việt Nam",
    facts: [
      ["21/05/2026", "Ngày ba bên tổ chức hội nghị tại trụ sở UBND xã Điền Xá."],
      ["3 chủ thể", "Chính quyền xã, Trường Cao đẳng TKV và Than Khe Chàm cùng tham gia."],
      ["2026–2030", "Giai đoạn hợp tác đào tạo nghề và giải quyết việc làm."],
      ["Gắn nhu cầu", "Đào tạo hướng tới yêu cầu sử dụng lao động thực tế của doanh nghiệp."],
    ],
    intro: [
      "Ngày 21/5/2026, tại UBND xã Điền Xá, Công ty Than Khe Chàm – TKV phối hợp Trường Cao đẳng Than – Khoáng sản Việt Nam và địa phương ký biên bản hợp tác đào tạo nghề, giải quyết việc làm giai đoạn 2026–2030. Thỏa thuận hướng tới tạo nguồn nhân lực cho doanh nghiệp đồng thời mở thêm lựa chọn nghề nghiệp cho người dân.",
      "Điểm đáng quan tâm với người tìm <strong>việc làm ngành Than Điền Xá</strong> là doanh nghiệp xuất hiện ngay trong quá trình tư vấn. Người lao động có thể hỏi cụ thể về môi trường sản xuất, nhóm nghề, thực tập và cách bố trí việc làm.",
    ],
    sections: [
      {
        title: "Liên kết gần địa bàn tạo thuận lợi gì?",
        paragraphs: [
          "Người Điền Xá ở trong tỉnh Quảng Ninh nên quãng đường tới cơ sở đào tạo và doanh nghiệp ngắn hơn nhiều nguồn tuyển ngoài tỉnh. Gia đình dễ tham quan, kiểm tra thông tin và hỗ trợ người học khi mới làm quen kỷ luật. Doanh nghiệp cũng thuận lợi tổ chức tư vấn, trải nghiệm và theo dõi người học.",
          "Lợi thế khoảng cách chỉ phát huy khi thông tin được cung cấp đầy đủ. Các bên cần công khai đầu mối, lịch tiếp nhận, tiêu chuẩn sức khỏe và chính sách từng đợt. Ở gần mỏ thuận tiện cho việc tìm hiểu; điều kiện vào học và đi làm vẫn được xét theo tiêu chuẩn chung.",
        ],
        bullets: [
          "Dễ tổ chức tư vấn trực tiếp cho người lao động và gia đình.",
          "Thuận lợi tham quan cơ sở học, nơi ở và môi trường doanh nghiệp.",
          "Giảm chi phí di chuyển trong quá trình làm thủ tục.",
          "Tăng khả năng địa phương hỗ trợ khi người học gặp khó khăn."],
      },
      {
        title: "Đào tạo phải đi cùng giữ chân lao động",
        paragraphs: [
          "Tuyển được người học mới chỉ giải quyết một phần nhu cầu. Doanh nghiệp cần tạo điều kiện để người mới hiểu việc, được kèm cặp và thấy lộ trình phát triển. Nhà trường cần phản hồi những khó khăn khi thực tập để điều chỉnh phương pháp, còn địa phương có thể cùng gia đình động viên trong thời gian đầu.",
          "Người học cũng phải nhìn nghề một cách dài hạn. Thu nhập ban đầu có thể chưa phản ánh mức của công nhân nhiều kinh nghiệm. Tay nghề, ngày công, khả năng làm việc an toàn và sự ổn định qua các ca sản xuất mới là nền tảng để thu nhập cải thiện.",
        ],
      },
      {
        title: "Cách đánh giá một cơ hội việc làm ngành Than",
        paragraphs: [
          "Đừng chỉ hỏi lương bao nhiêu. Hãy hỏi vị trí cụ thể, thời gian học, nơi thực tập, loại hợp đồng, cách tính lương, các khoản bảo hiểm, chỗ ở và tuyến xe. Câu trả lời càng rõ, người lao động càng dễ so sánh với hoàn cảnh của mình.",
          "Thông báo thật phải có đơn vị chịu trách nhiệm và quy trình kiểm tra sức khỏe. Không chuyển phí giữ chỗ cho cá nhân lạ, không giao căn cước gốc và không tự đến mỏ khi chưa có lịch. Hợp tác ba bên là cơ sở để người dân tìm đúng đầu mối và tránh môi giới không minh bạch.",
        ],
      },
    ],
    checklist: [
      ["Xác định nghề", "Hỏi rõ khai thác, xây dựng mỏ hay vị trí kỹ thuật khác."],
      ["Đối chiếu chế độ", "Kiểm tra hỗ trợ học, thực tập và điều kiện sau tốt nghiệp."],
      ["Đánh giá sức khỏe", "Khai trung thực thị lực, bệnh nền và khả năng làm theo ca."],
      ["Giữ giấy tờ", "Chỉ nộp bản theo yêu cầu tại đúng đầu mối tiếp nhận."],
    ],
    takeaway: "Điền Xá có lợi thế lớn về khoảng cách và sự tham gia trực tiếp của Than Khe Chàm. Chương trình sẽ thuyết phục nhất khi người dân được nhìn thấy nơi học, hiểu rõ nơi làm và biết ai chịu trách nhiệm ở từng chặng.",
    faq: [
      ["Hợp tác này có tuyển ngay trong năm 2026 không?", "Hợp tác được triển khai từ năm 2026; lịch và chỉ tiêu cụ thể phải theo thông báo của từng đợt."],
      ["Người Điền Xá có được ưu tiên vào Than Khe Chàm không?", "Địa phương là nguồn phối hợp, nhưng mỗi người vẫn phải đạt điều kiện đào tạo và yêu cầu tiếp nhận của doanh nghiệp."],
      ["Có thể đến trực tiếp Công ty xin việc không?", "Nên liên hệ đầu mối tuyển sinh để được hướng dẫn đúng quy trình học nghề, khám sức khỏe và tiếp nhận."],
    ],
    sources: [
      {publisher: "TKV", title: "Than Khe Chàm: Tăng cường phối hợp tuyển sinh, đào tạo nghề mỏ hầm lò", date: "28/05/2026", url: "https://vinacomin.vn/news/slug/than-khe-cham-tang-cuong-phoi-hop-tuyen-sinh-dao-tao-nghe-mo-ham-lo"},
      {publisher: "Công đoàn TKV", title: "Than Khe Chàm ký kết hợp tác đào tạo nghề và giải quyết việc làm tại xã Điền Xá giai đoạn 2026–2030", date: "27/05/2026", url: "https://congdoantkv.vn/tin-tuc/chi-tiet/45633/Than-Khe-Cham-Ky-ket-hop-tac-%C4%91ao-tao-nghe-va-giai-quyet-viec-lam-tai-xa-%C4%90ien-Xa-giai-%C4%91oan-2026---2030"},
    ],
  },
  {
    slug: "duong-hoa-than-duong-huy-tuyen-sinh-nghe-mo",
    section: "Kết nối địa phương",
    title: "Than Dương Huy đưa tư vấn nghề mỏ tới hai thôn xã Đường Hoa",
    description: "Than Dương Huy và Trường Cao đẳng TKV tư vấn tuyển sinh nghề mỏ hầm lò tại thôn Quảng Long 7, Quảng Long 8, xã Đường Hoa.",
    lead: "Buổi tư vấn ngay tại thôn giúp thanh niên và gia đình hỏi trực tiếp về điều kiện học, công việc hầm lò, thu nhập và cơ hội tại doanh nghiệp.",
    keyword: "tuyển sinh nghề mỏ Đường Hoa",
    keywords: ["tuyển sinh nghề mỏ Đường Hoa", "Than Dương Huy tuyển thợ mỏ", "việc làm Quảng Long", "học nghề mỏ hầm lò"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_1821.jpg",
    imageAlt: "Hoạt động của TKV với đông đảo đại biểu tham dự",
    imageSource: "Thư viện ảnh Vinacomin · Hoạt động thi đua của TKV",
    facts: [
      ["20/06/2026", "Ngày chương trình tư vấn, hướng nghiệp được tổ chức tại xã Đường Hoa."],
      ["2 thôn", "Quảng Long 7 và Quảng Long 8 là địa bàn tư vấn trực tiếp."],
      ["2 đơn vị", "Than Dương Huy phối hợp Trường Cao đẳng Than – Khoáng sản Việt Nam."],
      ["Tại cơ sở", "Thông tin được đưa về thôn để người dân hỏi ngay tại địa bàn."],
    ],
    intro: [
      "Ngày 20/6/2026, Công ty Than Dương Huy – TKV và Trường Cao đẳng Than – Khoáng sản Việt Nam tổ chức tư vấn, hướng nghiệp, tuyển sinh nghề mỏ hầm lò tại thôn Quảng Long 7 và Quảng Long 8, xã Đường Hoa, Quảng Ninh. Đây là hình thức tiếp cận gần người dân, tạo điều kiện để gia đình cùng nghe và đặt câu hỏi.",
      "Với <strong>tuyển sinh nghề mỏ Đường Hoa</strong>, sự có mặt của doanh nghiệp giúp người quan tâm tìm hiểu cùng lúc chương trình học, đơn vị sử dụng lao động, công việc theo ca, môi trường hầm lò và điều kiện gắn bó sau tốt nghiệp.",
    ],
    sections: [
      {
        title: "Tư vấn tại thôn giúp lọc thông tin sai",
        paragraphs: [
          "Trên mạng xã hội, thông tin tuyển thợ mỏ thường bị rút gọn còn mức lương hoặc vài quyền lợi nổi bật. Buổi gặp trực tiếp cho phép đại diện Nhà trường và doanh nghiệp giải thích những phần dễ bị bỏ qua: tiêu chuẩn sức khỏe, học tập, kỷ luật, an toàn, cách tính thu nhập và quy trình tiếp nhận.",
          "Gia đình cũng có thể hỏi về thời gian làm việc, nơi ở, phương tiện đi lại và liên hệ khi người lao động gặp khó khăn. Sự hiểu biết của người thân giúp hạn chế tình trạng người học nhập học theo cảm hứng rồi bỏ cuộc khi gặp những yêu cầu đầu tiên của môi trường công nghiệp.",
        ],
        bullets: [
          "Nghe thông tin từ chính đơn vị đào tạo và doanh nghiệp.",
          "Đối chiếu ngay những lời quảng cáo đã xem trên mạng.",
          "Hỏi người lao động địa phương đang làm tại mỏ nếu có.",
          "Lưu tên và số liên hệ của đầu mối phụ trách đợt tuyển."],
      },
      {
        title: "Địa bàn gần mỏ vẫn cần hướng nghiệp nghiêm túc",
        paragraphs: [
          "Sống tại Quảng Ninh giúp người lao động quen hơn với hình ảnh ngành Than, nhưng không đồng nghĩa đã hiểu công việc cụ thể. Khai thác, xây dựng mỏ và cơ điện có nhiệm vụ khác nhau; mỗi vị trí có yêu cầu học tập và sức khỏe riêng. Tư vấn cần giúp người đăng ký chọn đúng hướng.",
          "Khoảng cách gần có thể giảm chi phí đi lại và giúp gia đình hỗ trợ tốt hơn. Đây là lợi thế rõ rệt so với nguồn lao động ở xa. Người học nên tận dụng bằng cách tham quan cơ sở, gặp người đi trước và chuẩn bị sức khỏe trước ngày nhập học.",
        ],
      },
      {
        title: "Cách biến một buổi tư vấn thành quyết định nghề nghiệp",
        paragraphs: [
          "Sau chương trình, người quan tâm nên ghi lại ba nhóm thông tin: mình có đủ điều kiện ban đầu hay không; đợt học bắt đầu khi nào và cần hồ sơ gì; sau đào tạo có những đơn vị, vị trí nào dự kiến tiếp nhận. Nếu còn câu chưa rõ, cần hỏi lại trước khi ký hoặc nộp giấy tờ.",
          "Quyết định vào nghề cần xuất phát từ sự phù hợp của chính mỗi người. Nghề mỏ đòi hỏi cam kết về sức khỏe, kỷ luật và khả năng làm theo ca; người hiểu rõ lựa chọn của mình thường học nghiêm túc và bền nghề hơn.",
        ],
      },
    ],
    checklist: [
      ["Ghi đủ điều kiện", "Đối chiếu tuổi, thể lực, thị lực và bệnh đang điều trị."],
      ["Hỏi công việc thật", "Yêu cầu mô tả vị trí, ca làm và môi trường sản xuất."],
      ["Xác nhận hỗ trợ", "Kiểm tra chính sách học tập và sinh hoạt của đúng đợt."],
      ["Bàn với gia đình", "Thống nhất kế hoạch học và làm việc trước khi nộp hồ sơ."],
    ],
    takeaway: "Chương trình tại Đường Hoa đưa thông tin thực tế về nghề đến ngay cộng đồng. Một buổi tư vấn tốt giúp người chưa phù hợp nhận ra sớm, đồng thời giúp người đủ điều kiện chuẩn bị nghiêm túc hơn.",
    faq: [
      ["Không dự buổi tại Quảng Long 7, 8 có đăng ký được không?", "Có thể liên hệ đầu mối tuyển sinh để kiểm tra đợt hiện hành và được sàng lọc điều kiện."],
      ["Tham gia tư vấn có mất phí không?", "Nguồn công bố mô tả hoạt động tư vấn, hướng nghiệp; mọi khoản thu nếu có phải được xác minh bằng quy định chính thức, không chuyển cho môi giới cá nhân."],
      ["Có phải học xong đều vào Than Dương Huy?", "Than Dương Huy tham gia tư vấn; đơn vị tiếp nhận cuối cùng phụ thuộc chỉ tiêu, nghề học và kết quả của từng người."],
    ],
    sources: [
      {publisher: "TKV", title: "Than Dương Huy đẩy mạnh phối hợp tuyển sinh nghề mỏ hầm lò", date: "24/06/2026", url: "https://vinacomin.vn/news/slug/than-duong-huy-day-manh-phoi-hop-tuyen-sinh-nghe-mo-ham-lo"},
      {publisher: "Công ty Than Dương Huy – TKV", title: "Đẩy mạnh phối hợp tuyển sinh thợ mỏ", date: "21/06/2026", url: "https://thanduonghuy.com.vn/ls/tin-khac-c27"},
    ],
  },
  {
    slug: "dong-van-ha-giang-cong-trinh-phuc-loi-tuyen-sinh-nghe-mo",
    section: "Kết nối địa phương",
    title: "TKV đồng hành Đồng Văn: công trình phúc lợi gắn với nghề mỏ",
    description: "TKV làm việc với Đồng Văn, Hà Giang về tiến độ công trình phúc lợi và phối hợp tuyển sinh nghề mỏ, mở cơ hội việc làm cho thanh niên địa phương.",
    lead: "Hỗ trợ trường học, đường giao thông và kết nối học nghề được đặt trong cùng một chương trình phát triển bền vững cho huyện vùng cao Đồng Văn.",
    keyword: "tuyển sinh nghề mỏ Đồng Văn Hà Giang",
    keywords: ["tuyển sinh nghề mỏ Đồng Văn Hà Giang", "TKV hỗ trợ Hà Giang", "việc làm thợ mỏ Hà Giang", "công trình phúc lợi Đồng Văn"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5803.jpg",
    imageAlt: "Hội nghị TKV về ứng dụng công nghệ và quản lý sản xuất",
    imageSource: "Thư viện ảnh Vinacomin · Hội nghị ứng dụng tự động hóa trong sản xuất",
    facts: [
      ["06/06/2025", "Ngày TKV làm việc với huyện Đồng Văn về phúc lợi và tuyển sinh nghề mỏ."],
      ["Hai hướng", "Công trình hạ tầng và cơ hội nghề nghiệp được triển khai song song."],
      ["Trường học", "Một trong các nhóm công trình phúc lợi được địa phương báo cáo tiến độ."],
      ["Đường giao thông", "Hạ tầng thiết yếu được nhắc trong nội dung TKV hỗ trợ địa bàn."],
    ],
    intro: [
      "Ngày 06/6/2025, TKV làm việc với huyện Đồng Văn, Hà Giang về tiến độ các công trình phúc lợi do Tập đoàn hỗ trợ và công tác tuyển sinh nghề mỏ. Hạ tầng trường học, giao thông được đặt cạnh đào tạo nghề, kết hợp hỗ trợ trước mắt với năng lực tự tạo thu nhập của người dân.",
      "Đối với <strong>tuyển sinh nghề mỏ Đồng Văn Hà Giang</strong>, thông điệp chính là thanh niên vùng cao có thể tiếp cận một lộ trình học nghề và việc làm ổn định tại Quảng Ninh. Nhưng để chương trình bền vững, thông tin phải đến đúng thôn bản, được giải thích bằng ngôn ngữ dễ hiểu và có sự đồng thuận của gia đình.",
    ],
    sections: [
      {
        title: "Vì sao an sinh và việc làm nên đi cùng nhau?",
        paragraphs: [
          "Công trình trường học, đường giao thông cải thiện điều kiện sống và khả năng tiếp cận dịch vụ. Đào tạo nghề giải quyết một tầng khác: giúp người trong độ tuổi lao động có kỹ năng và cơ hội tạo thu nhập. Khi hai hướng được triển khai đồng thời, tác động có thể kéo dài hơn một khoản hỗ trợ đơn lẻ.",
          "TKV cũng có nhu cầu nguồn nhân lực cho sản xuất hầm lò. Mối quan hệ chỉ bền khi lợi ích hai phía cân bằng: doanh nghiệp có người được đào tạo, địa phương có thêm việc làm, còn người lao động nhận thông tin trung thực, được chăm lo trong thời gian học và có cơ hội phát triển nghề nghiệp.",
        ],
        bullets: [
          "Hạ tầng giúp cộng đồng tiếp cận giáo dục và giao thông tốt hơn.",
          "Học nghề giúp lao động trẻ xây dựng khả năng tự tạo thu nhập.",
          "Người đã làm việc trở thành nguồn thông tin thực tế cho địa phương.",
          "Chính quyền có vai trò bảo đảm chương trình đến đúng đối tượng."],
      },
      {
        title: "Thách thức riêng của nguồn lao động Đồng Văn",
        paragraphs: [
          "Khoảng cách xa Quảng Ninh, khác biệt sinh hoạt và tâm lý rời gia đình là những rào cản thực tế. Tư vấn không thể chỉ nói về lương; cần hướng dẫn hành trình, nơi ở, liên lạc, hỗ trợ ban đầu và cách xử lý khi người học nhớ nhà hoặc chưa quen môi trường.",
          "Địa phương nên phát huy người đã học và đang làm tại TKV làm nhân chứng nghề nghiệp. Họ có thể kể cụ thể về ngày công, công việc, khó khăn, kỷ luật và thu nhập. Một câu chuyện có cả mặt thuận lợi lẫn thử thách đáng tin hơn lời vận động chỉ nhấn vào kết quả tốt.",
        ],
      },
      {
        title: "Người vùng cao cần được bảo vệ khỏi tuyển dụng mập mờ",
        paragraphs: [
          "Khoảng cách thông tin có thể khiến người lao động dễ tin môi giới. Mọi đợt tuyển cần công khai cơ sở đào tạo, doanh nghiệp phối hợp, địa điểm tiếp nhận và các khoản hỗ trợ. Giấy tờ tùy thân phải được giữ an toàn; không chuyển tiền chỉ vì lời hứa giữ chỗ.",
          "Gia đình nên biết số điện thoại của cán bộ phụ trách và địa chỉ nơi người học đến. Trước khi di chuyển, cần xác nhận lại ngày giờ, phương tiện, hành lý, hồ sơ và người đón. Những bước đơn giản này giúp cơ hội nghề nghiệp thực sự trở thành con đường an toàn.",
        ],
      },
    ],
    checklist: [
      ["Tư vấn tại địa phương", "Ưu tiên chương trình có đại diện chính quyền và Nhà trường."],
      ["Chuẩn bị hành trình", "Ghi rõ nơi đến, người đón, phương tiện và liên lạc dự phòng."],
      ["Hiểu quyền lợi", "Phân biệt hỗ trợ trong thời gian học với thu nhập khi đi làm."],
      ["Giữ kết nối", "Gia đình và cán bộ địa phương theo dõi người học trong giai đoạn đầu."],
    ],
    takeaway: "Cách TKV làm việc với Đồng Văn kết hợp xây công trình cho cộng đồng và mở lối nghề nghiệp cho thanh niên. Phần tuyển sinh cần được triển khai minh bạch, gần dân và theo sát người học trên quãng đường từ Hà Giang đến Quảng Ninh.",
    faq: [
      ["TKV có xây công trình phúc lợi nào tại Đồng Văn?", "Nguồn công bố đề cập các nhóm công trình như trường học, đường giao thông; danh mục và tiến độ cụ thể cần theo hồ sơ của địa phương."],
      ["Thanh niên Đồng Văn có được hỗ trợ đi học nghề mỏ không?", "Chương trình có nội dung phối hợp tuyển sinh; chính sách cụ thể phải xác nhận theo đợt và đối tượng."],
      ["Đi xa như vậy có được bố trí nơi ở không?", "Người đăng ký cần hỏi rõ ký túc xá, ăn ở và hành trình trước khi đi; không tự suy đoán từ bài viết."],
    ],
    sources: [
      {publisher: "TKV", title: "TKV làm việc với huyện Đồng Văn, Hà Giang về công trình phúc lợi và tuyển sinh nghề mỏ", date: "06/06/2025", url: "https://vinacomin.vn/news/slug/tkv-lam-viec-voi-huyen-dong-van-ha-giang-ve-cong-trinh-phuc-loi-va-tuyen-sinh-nghe-mo"},
    ],
  },
  {
    slug: "tho-mo-tkv-xoa-nha-tam-tay-nguyen",
    section: "An sinh xã hội",
    title: "Thợ mỏ TKV chung tay xóa nhà tạm cho đồng bào Tây Nguyên",
    description: "TKV đồng hành chương trình xóa nhà tạm, nhà dột nát tại Tây Nguyên, tiếp nối nguồn lực an sinh dành cho nhà ở, y tế, giáo dục và cộng đồng.",
    lead: "Một mái nhà an toàn giải quyết chỗ ở trước mắt và tạo nền tảng để gia đình ổn định sinh kế, trẻ em yên tâm học tập, địa phương giảm nghèo lâu dài.",
    keyword: "TKV xóa nhà tạm Tây Nguyên",
    keywords: ["TKV xóa nhà tạm Tây Nguyên", "thợ mỏ ủng hộ đồng bào", "an sinh xã hội TKV", "hỗ trợ nhà ở vùng khó khăn"],
    image: "https://vinacomin.vn/Share/Media/2018/07/QN2.jpg",
    imageAlt: "Hoạt động truyền thông của TKV trong thư viện ảnh Vinacomin",
    imageSource: "Thư viện ảnh Vinacomin · Gặp mặt cơ quan báo chí ngành Than",
    related: ["nghe-tho-lo-co-on-dinh-khong", "san-xuat-sach-hon-nganh-than"],
    facts: [
      ["31/07/2025", "Ngày TKV công bố hoạt động đồng hành chương trình tại Tây Nguyên."],
      ["3 địa phương", "Gia Lai, Lâm Đồng và Quảng Ngãi tham gia hội nghị tổng kết chương trình."],
      ["123 tỷ đồng", "Nguồn lực TKV đã dành cho xóa nhà tạm, nhà dột nát trong giai đoạn được báo cáo."],
      ["1.550 tỷ đồng", "Tổng chi an sinh xã hội của TKV và đơn vị thành viên giai đoạn 2020–2025."],
    ],
    intro: [
      "Ngày 31/7/2025, TKV đưa tin về việc thợ mỏ đồng hành Chương trình xóa nhà tạm, nhà dột nát tại các tỉnh Tây Nguyên. Hội nghị tổng kết do Bộ Công an phối hợp các địa phương tổ chức tại Gia Lai, với sự tham gia của Gia Lai, Lâm Đồng và Quảng Ngãi. Hoạt động nằm trong chuỗi trách nhiệm xã hội rộng hơn của Tập đoàn.",
      "Theo số liệu TKV công bố, giai đoạn 2020–2025, Tập đoàn và các đơn vị thành viên đã chi khoảng 1.550 tỷ đồng cho an sinh xã hội; trong đó 123 tỷ đồng dành cho xóa nhà tạm, nhà dột nát. Con số về <strong>TKV xóa nhà tạm Tây Nguyên</strong> phản ánh tổng quy mô của một nỗ lực kéo dài nhiều năm và nhiều địa bàn.",
    ],
    sections: [
      {
        title: "Vì sao hỗ trợ nhà ở tạo tác động lâu dài?",
        paragraphs: [
          "Nhà ở xuống cấp khiến gia đình nghèo dễ tổn thương trước mưa bão, bệnh tật và biến động thu nhập. Một căn nhà an toàn giúp giảm chi phí sửa chữa lặp lại, bảo vệ tài sản và tạo điều kiện để người lớn tập trung làm việc, trẻ em duy trì việc học. Hiệu quả vì thế vượt xa giá trị vật liệu xây dựng.",
          "Ở các địa bàn Tây Nguyên, khoảng cách xa và điều kiện thời tiết làm chi phí xây dựng tăng. Chương trình cần sự phối hợp của chính quyền, cơ quan triển khai và cộng đồng để lựa chọn đúng hộ, kiểm soát chất lượng, hoàn tất pháp lý đất đai và bảo đảm công trình được sử dụng bền vững.",
        ],
        bullets: [
          "Ưu tiên hộ có hoàn cảnh đặc biệt khó khăn và nhà ở không an toàn.",
          "Công khai tiêu chí, danh sách và tiến độ thực hiện tại địa phương.",
          "Kết hợp hỗ trợ nhà ở với sinh kế, giáo dục và y tế khi có điều kiện.",
          "Theo dõi chất lượng công trình sau bàn giao, nhất là trước mùa mưa."],
      },
      {
        title: "Tinh thần thợ mỏ được thể hiện ngoài khai trường",
        paragraphs: [
          "Truyền thống “Kỷ luật và Đồng tâm” thường được nhắc trong sản xuất, nhưng giá trị của nó còn thể hiện ở cách người lao động chia sẻ với cộng đồng. Nguồn an sinh được hình thành từ trách nhiệm của Tập đoàn và sự đóng góp, hưởng ứng của các đơn vị, tổ chức đoàn thể, công nhân lao động.",
          "Đây cũng là một mặt quan trọng của ngành Than mà người tìm việc nên biết. Doanh nghiệp tạo việc làm trực tiếp và gắn hoạt động sản xuất với địa phương, đặc biệt tại những nơi có dự án, đơn vị thành viên hoặc nguồn lao động cho TKV.",
        ],
      },
      {
        title: "Cần minh bạch để lòng tốt đến đúng nơi",
        paragraphs: [
          "Các con số an sinh lớn chỉ có ý nghĩa khi được phân bổ đúng đối tượng, sử dụng đúng mục đích và có kết quả kiểm chứng. Bài báo ghi nhận chủ trương và quy mô chung; danh sách hộ, mức hỗ trợ, thiết kế công trình thuộc trách nhiệm công khai của đơn vị triển khai và địa phương.",
          "Chương trình chính thức không thu phí qua cá nhân tự nhận có thể xin suất hỗ trợ. Việc xóa nhà tạm đi qua quy trình rà soát của địa phương; người dân có thể xác minh với chính quyền cơ sở, Ủy ban MTTQ hoặc cơ quan được giao thực hiện.",
        ],
      },
    ],
    checklist: [
      ["Xác minh chương trình", "Hỏi chính quyền hoặc Ủy ban MTTQ về tiêu chí và kế hoạch."],
      ["Không nộp phí", "Tránh người môi giới hứa đưa vào danh sách đổi lấy tiền."],
      ["Theo dõi công khai", "Đối chiếu danh sách, tiến độ và chất lượng công trình tại địa phương."],
      ["Gắn với sinh kế", "Chủ động kế hoạch việc làm, học nghề và thu nhập sau khi ổn định nhà ở."],
    ],
    takeaway: "Xóa nhà tạm là an sinh có tính nền móng: giúp một gia đình đứng vững trước rủi ro và có điều kiện nghĩ đến tương lai. Giá trị của đóng góp TKV sẽ lớn nhất khi được thực hiện minh bạch, đúng người và nối tiếp bằng cơ hội học nghề, việc làm.",
    faq: [
      ["123 tỷ đồng có phải đều dành cho ba tỉnh trong hội nghị?", "Không. Đây là số TKV công bố cho hoạt động xóa nhà tạm, nhà dột nát trong cả giai đoạn báo cáo, không phải toàn bộ kinh phí của riêng một sự kiện."],
      ["Người dân có thể đăng ký trực tiếp với TKV không?", "Việc rà soát đối tượng thường thực hiện qua chính quyền và cơ quan được giao tại địa phương; cần theo thông báo chính thức."],
      ["Hoạt động này liên quan gì đến tuyển sinh nghề mỏ?", "An sinh và việc làm đều là các hướng TKV phối hợp với địa phương; mỗi chương trình có tiêu chí riêng và không tự động chuyển đổi quyền lợi."],
    ],
    sources: [
      {publisher: "TKV", title: "Thợ mỏ TKV ủng hộ Chương trình xoá nhà tạm, nhà dột nát tại các tỉnh Tây Nguyên", date: "31/07/2025", url: "https://vinacomin.vn/news/slug/tho-mo-tkv-ung-ho-chuong-trinh-xoa-nha-tam-nha-dot-nat-tai-cac-tinh-tay-nguyen"},
    ],
  },
  {
    slug: "tkv-ho-tro-70-ty-khac-phuc-bao-yagi",
    section: "An sinh xã hội",
    title: "TKV hỗ trợ 70 tỷ đồng khắc phục hậu quả bão Yagi",
    description: "Gói hỗ trợ 70 tỷ đồng của TKV sau bão số 3 năm 2024 được phân bổ cho đồng bào, các địa phương chịu thiệt hại và người lao động ngành Than.",
    lead: "Nguồn lực được chia thành nhiều lớp: hỗ trợ qua Trung ương MTTQ, hỗ trợ trực tiếp các tỉnh thành và chăm lo người lao động TKV bị thiệt hại.",
    keyword: "TKV hỗ trợ bão Yagi 70 tỷ đồng",
    keywords: ["TKV hỗ trợ bão Yagi 70 tỷ đồng", "thợ mỏ ủng hộ đồng bào bão lũ", "TKV an sinh xã hội", "khắc phục bão số 3"],
    image: "https://vinacomin.vn/Share/Media/2018/05/39A6766.jpg",
    imageAlt: "Đại biểu ngành Than tại hoạt động tuyên dương của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Tuyên dương điển hình tiên tiến ngành Than",
    related: ["an-toan-mua-mua-bao-2026", "nghe-tho-lo-co-on-dinh-khong"],
    facts: [
      ["70 tỷ đồng", "Tổng gói hỗ trợ khắc phục hậu quả bão số 3 năm 2024."],
      ["10 tỷ đồng", "Ủng hộ đồng bào bão lụt thông qua Quỹ do Trung ương MTTQ phát động."],
      ["40 tỷ đồng", "Hỗ trợ trực tiếp 8 tỉnh, thành theo hai mức 7 tỷ và 3 tỷ đồng."],
      ["20 tỷ đồng", "Hỗ trợ người lao động các đơn vị TKV bị thiệt hại do bão lũ."],
    ],
    intro: [
      "Sau bão số 3 Yagi tháng 9/2024, TKV triển khai gói hỗ trợ tổng cộng 70 tỷ đồng cho đồng bào, các địa phương và người lao động trong Tập đoàn. Đây là một trong những chương trình cứu trợ có quy mô lớn của ngành Than trong bối cảnh Quảng Ninh và nhiều tỉnh phía Bắc chịu thiệt hại nặng.",
      "Cấu trúc của gói <strong>TKV hỗ trợ bão Yagi 70 tỷ đồng</strong> cho thấy nguồn lực không dồn vào một nơi. Tập đoàn dành 10 tỷ đồng qua Quỹ do Trung ương MTTQ phát động, 40 tỷ đồng cho tám địa phương và 20 tỷ đồng từ Quỹ Phúc lợi Công ty mẹ để hỗ trợ người lao động các đơn vị thành viên.",
    ],
    sections: [
      {
        title: "70 tỷ đồng được phân bổ cụ thể thế nào?",
        paragraphs: [
          "Quảng Ninh, Lào Cai, Cao Bằng và Bắc Kạn mỗi tỉnh được hỗ trợ 7 tỷ đồng, tổng cộng 28 tỷ. Hà Nội, Lạng Sơn, Thái Nguyên và Thái Bình mỗi địa phương nhận 3 tỷ đồng, tổng 12 tỷ. Cộng với 10 tỷ đồng qua Trung ương MTTQ và 20 tỷ hỗ trợ người lao động TKV, tổng gói đạt 70 tỷ đồng.",
          "Cách chia này phản ánh hai trách nhiệm song song: hướng ra cộng đồng và chăm lo chính lực lượng sản xuất bị ảnh hưởng. Nhiều gia đình công nhân ở Quảng Ninh vừa chịu thiệt hại nhà cửa, vừa tham gia khôi phục sản xuất để bảo đảm chuỗi cung ứng than cho nền kinh tế.",
        ],
        bullets: [
          "Bốn tỉnh thiệt hại nặng nhận mức 7 tỷ đồng mỗi địa phương.",
          "Bốn tỉnh, thành khác nhận mức 3 tỷ đồng mỗi địa phương.",
          "Nguồn Trung ương MTTQ mở rộng hỗ trợ tới đồng bào vùng bão lũ.",
          "Quỹ Phúc lợi TKV tập trung vào công nhân và gia đình bị thiệt hại."],
      },
      {
        title: "Khôi phục đời sống phải đi cùng khôi phục sản xuất",
        paragraphs: [
          "Với ngành Than, bão gây thiệt hại cả nhà ở, cây xanh, đường vận tải, điện, thông tin và hạ tầng mỏ. Hỗ trợ người lao động giúp họ sớm ổn định gia đình; khắc phục tại đơn vị giúp công việc trở lại an toàn. Hai phần không thể tách rời nếu muốn phục hồi bền vững.",
          "Việc đưa sản xuất trở lại phải tuân thủ kiểm tra kỹ thuật, thoát nước, điện và tuyến giao thông. Tinh thần khẩn trương không đồng nghĩa bỏ qua an toàn. Đây là bài học quan trọng cho người làm nghề mỏ: sau thiên tai, chỉ quay lại vị trí khi có đánh giá và lệnh cho phép.",
        ],
      },
      {
        title: "Một gói hỗ trợ lớn cần được đọc bằng dữ liệu",
        paragraphs: [
          "Con số 70 tỷ đồng dễ gây ấn tượng, nhưng giá trị thông tin nằm ở bảng phân bổ và đối tượng. Khi viết lại sự kiện, chúng tôi giữ riêng các khoản để người đọc không hiểu nhầm toàn bộ tiền được trao cho một tỉnh hoặc một nhóm công nhân.",
          "Việc sử dụng cuối cùng thuộc trách nhiệm của quỹ, địa phương và đơn vị tiếp nhận. Công chúng có quyền theo dõi kết quả, còn người dân cần tìm đúng cơ quan để hỏi tiêu chí. Không có cơ sở cho lời mời đóng phí để được nhận hỗ trợ.",
        ],
      },
    ],
    checklist: [
      ["Đọc đúng phân bổ", "Phân biệt hỗ trợ cộng đồng, địa phương và người lao động TKV."],
      ["Xác minh đối tượng", "Hỏi Ủy ban MTTQ hoặc đơn vị công tác về tiêu chí hỗ trợ."],
      ["Không tin môi giới", "Từ chối cá nhân hứa xin suất cứu trợ để thu tiền."],
      ["Tuân thủ an toàn", "Chỉ trở lại khu vực sản xuất sau kiểm tra và thông báo chính thức."],
    ],
    takeaway: "Gói 70 tỷ đồng cho thấy sức mạnh của một hệ thống có thể vừa hỗ trợ xã hội, vừa chăm lo người lao động của mình. Minh bạch từng khoản là cách tốt nhất để giá trị tương thân tương ái được hiểu đúng và lan tỏa bền vững.",
    faq: [
      ["Quảng Ninh nhận bao nhiêu trong gói 70 tỷ đồng?", "Theo nguồn công bố, Quảng Ninh thuộc nhóm bốn tỉnh nhận 7 tỷ đồng; người lao động TKV còn thuộc nhóm hỗ trợ riêng 20 tỷ đồng theo mức thiệt hại."],
      ["20 tỷ đồng có chia đều cho mọi công nhân TKV không?", "Không có thông tin chia đều. Khoản này hướng tới người lao động các đơn vị bị thiệt hại và được thực hiện theo rà soát."],
      ["Gói này có còn nhận đăng ký mới không?", "Đây là chương trình khắc phục bão năm 2024. Người dân cần theo thông báo của địa phương đối với các chính sách hiện hành."],
    ],
    sources: [
      {publisher: "TKV", title: "TKV triển khai gói hỗ trợ 70 tỷ đồng khắc phục hậu quả bão số 3", date: "16/09/2024", url: "https://vinacomin.vn/news/slug/tkv-trien-khai-goi-ho-tro-70-ty-dong-khac-phuc-hau-qua-bao-so-3"},
      {publisher: "Tạp chí Công Thương", title: "TKV triển khai gói hỗ trợ 70 tỷ đồng khắc phục hậu quả bão số 3", date: "14/09/2024", url: "https://tapchicongthuong.vn/tkv-trien-khai-goi-ho-tro-70-ty-dong-khac-phuc-hau-qua-bao-so-3-126647.htm"},
    ],
  },
  {
    slug: "tkv-gieng-khoan-nuoc-sach-truong-hoc-lai-chau",
    section: "An sinh xã hội",
    title: "Tuổi trẻ TKV xây giếng nước sạch cho liên trường ở Lai Châu",
    description: "Đoàn Thanh niên TKV hỗ trợ công trình giếng khoan cấp nước sinh hoạt cho liên trường Mầm non, Tiểu học và THCS Sơn Bình, Tam Đường, Lai Châu.",
    lead: "Một công trình quy mô không lớn nhưng chạm đúng nhu cầu thiết yếu: nước sạch cho học sinh, giáo viên và hoạt động hằng ngày của ba cấp học vùng cao.",
    keyword: "TKV hỗ trợ nước sạch trường học Lai Châu",
    keywords: ["TKV hỗ trợ nước sạch trường học Lai Châu", "giếng khoan Sơn Bình Tam Đường", "Đoàn Thanh niên TKV an sinh", "hỗ trợ học sinh vùng cao"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_8648.jpg",
    imageAlt: "Công nhân trẻ TKV trong thư viện ảnh Vinacomin",
    imageSource: "Thư viện ảnh Vinacomin · Công nhân trẻ ngành Than",
    related: ["san-xuat-sach-hon-nganh-than", "hoc-thuc-hanh-nghe-mo-ham-lo"],
    facts: [
      ["1 công trình", "Giếng khoan cấp nước sinh hoạt được hỗ trợ xây dựng tại trường học."],
      ["3 cấp học", "Mầm non, Tiểu học và Trung học cơ sở cùng sử dụng tại liên trường Sơn Bình."],
      ["Tam Đường", "Huyện thuộc tỉnh Lai Châu, nơi công trình được triển khai."],
      ["06/09/2024", "Ngày TKV công bố hoạt động hỗ trợ trên trang thông tin Tập đoàn."],
    ],
    intro: [
      "Đoàn Thanh niên TKV hỗ trợ xây dựng công trình giếng khoan cấp nước sinh hoạt cho Liên trường Mầm non, Tiểu học và Trung học cơ sở Sơn Bình, huyện Tam Đường, tỉnh Lai Châu. Hoạt động được TKV công bố ngày 06/9/2024, hướng tới giải quyết nhu cầu nước phục vụ học sinh và giáo viên vùng cao.",
      "So với những chương trình hàng chục tỷ đồng, công trình <strong>TKV hỗ trợ nước sạch trường học Lai Châu</strong> có quy mô hẹp hơn nhưng tác động trực tiếp đến từng ngày học. Nước sạch liên quan bữa ăn, vệ sinh, sức khỏe và khả năng duy trì hoạt động của nhà trường, đặc biệt trong mùa khô.",
    ],
    sections: [
      {
        title: "Vì sao một giếng khoan có ý nghĩa với ba cấp học?",
        paragraphs: [
          "Liên trường tập trung học sinh nhiều lứa tuổi nên nhu cầu nước diễn ra liên tục: chế biến thức ăn, rửa tay, vệ sinh lớp học và sinh hoạt của giáo viên. Nguồn không ổn định có thể làm tăng nguy cơ bệnh đường ruột, gián đoạn bán trú và tạo thêm việc cho nhà trường, phụ huynh.",
          "Giếng khoan chỉ phát huy nếu chất lượng nước được kiểm tra, hệ thống bơm và bể chứa được bảo dưỡng, khu vực khai thác được bảo vệ. Bàn giao công trình vì thế cần đi cùng hướng dẫn vận hành, trách nhiệm quản lý và kế hoạch sửa chữa khi thiết bị hỏng.",
        ],
        bullets: [
          "Kiểm nghiệm chất lượng nước trước khi đưa vào sử dụng sinh hoạt.",
          "Có bể chứa, đường ống và thiết bị bơm phù hợp nhu cầu liên trường.",
          "Phân công người theo dõi vận hành và tiêu thụ điện.",
          "Bảo vệ khu vực giếng, tránh nguồn gây ô nhiễm xâm nhập."],
      },
      {
        title: "Thanh niên ngành Than đóng góp bằng năng lực tổ chức",
        paragraphs: [
          "Hoạt động tình nguyện hiệu quả gồm cả khảo sát nhu cầu, huy động nguồn lực, kết nối kỹ thuật và phối hợp địa phương giám sát tiến độ. Cách làm dựa trên một công trình cụ thể giúp đoàn viên thấy rõ kết quả đóng góp.",
          "Đây cũng là môi trường rèn trách nhiệm cho người trẻ TKV. Kỷ luật trong sản xuất được chuyển thành kỷ luật dự án cộng đồng: đúng tiến độ, an toàn thi công, rõ đầu mối và bàn giao đầy đủ. Giá trị nghề nghiệp nhờ đó lan ra ngoài phạm vi doanh nghiệp.",
        ],
      },
      {
        title: "Công trình nhỏ cần được duy trì lâu dài",
        paragraphs: [
          "Nhiều dự án nước sạch mất hiệu quả sau vài năm vì thiếu bảo dưỡng hoặc không có kinh phí thay thiết bị. Địa phương và nhà trường cần đưa vận hành vào kế hoạch thường xuyên, ghi lại lưu lượng, chất lượng nước và tình trạng máy bơm để xử lý sớm.",
          "Cộng đồng có thể tham gia bảo vệ, phản ánh rò rỉ và sử dụng tiết kiệm. Khi một công trình được giữ tốt, khoản hỗ trợ ban đầu tiếp tục tạo lợi ích qua nhiều khóa học sinh — thước đo thiết thực nhất của an sinh bền vững.",
        ],
      },
    ],
    checklist: [
      ["Kiểm tra chất lượng", "Thực hiện xét nghiệm nước và công khai kết quả theo quy định."],
      ["Bàn giao vận hành", "Ghi rõ người quản lý, quy trình bơm và bảo dưỡng."],
      ["Dự phòng sửa chữa", "Có kế hoạch kinh phí cho điện, vật tư và thay máy bơm."],
      ["Theo dõi tác động", "Đánh giá khả năng đáp ứng nhu cầu của cả ba cấp học."],
    ],
    takeaway: "An sinh có giá trị nhất khi giải quyết một nhu cầu cụ thể và được duy trì sau ngày bàn giao. Với giếng nước tại Sơn Bình, kết quả được nhìn thấy trong từng ngày học sinh có nước sạch để học tập và sinh hoạt.",
    faq: [
      ["Công trình phục vụ trường nào?", "Nguồn công bố nêu Liên trường Mầm non, Tiểu học và THCS Sơn Bình, huyện Tam Đường, tỉnh Lai Châu."],
      ["TKV có công bố số tiền xây giếng không?", "Thông tin nguồn được rà soát cho bài này không nêu con số đủ rõ để trích dẫn, nên bài không suy đoán kinh phí."],
      ["Nước giếng có thể dùng uống trực tiếp không?", "Việc sử dụng phải căn cứ kết quả kiểm nghiệm và hệ thống xử lý; nước giếng khoan chỉ dùng uống trực tiếp khi đạt tiêu chuẩn phù hợp."],
    ],
    sources: [
      {publisher: "TKV", title: "Đoàn Thanh niên TKV hỗ trợ xây dựng công trình giếng khoan cấp nước sinh hoạt cho trường học", date: "06/09/2024", url: "https://vinacomin.vn/news/slug/doan-thanh-nien-tkv-ho-tro-xay-dung-cong-trinh-gieng-khoan-cap-nuoc-sinh-hoat-cho-truong-hoc"},
    ],
  },
  {
    slug: "tkv-ho-tro-12-ty-tay-nguyen-khac-phuc-mua-lu",
    section: "An sinh xã hội",
    title: "TKV hỗ trợ 12 tỷ đồng giúp bốn tỉnh khắc phục mưa lũ",
    description: "TKV phân bổ 12 tỷ đồng hỗ trợ Lâm Đồng, Đắk Lắk, Khánh Hòa và Gia Lai khắc phục hậu quả mưa lũ cuối năm 2025, ổn định đời sống.",
    lead: "Nguồn hỗ trợ được phân theo mức độ và nhu cầu địa phương, ưu tiên người dân thiệt hại nặng sớm ổn định chỗ ở, sinh hoạt và phục hồi sản xuất.",
    keyword: "TKV hỗ trợ Tây Nguyên 12 tỷ đồng",
    keywords: ["TKV hỗ trợ Tây Nguyên 12 tỷ đồng", "ủng hộ đồng bào mưa lũ 2025", "TKV hỗ trợ Lâm Đồng", "TKV hỗ trợ Đắk Lắk Gia Lai Khánh Hòa"],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_8663.jpg",
    imageAlt: "Tuổi trẻ ngành Than tại hoạt động của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Tuổi trẻ ngành Than",
    related: ["an-toan-mua-mua-bao-2026", "san-xuat-sach-hon-nganh-than"],
    facts: [
      ["12 tỷ đồng", "Tổng nguồn hỗ trợ bốn địa phương khắc phục hậu quả mưa lũ cuối năm 2025."],
      ["5 tỷ đồng", "Mức hỗ trợ dành cho tỉnh Lâm Đồng."],
      ["3 tỷ đồng", "Mức hỗ trợ dành cho tỉnh Đắk Lắk."],
      ["2 + 2 tỷ", "Khánh Hòa và Gia Lai mỗi tỉnh nhận 2 tỷ đồng."],
    ],
    intro: [
      "Trước thiệt hại do mưa lũ cuối năm 2025, TKV quyết định hỗ trợ tổng cộng 12 tỷ đồng cho bốn địa phương: Lâm Đồng 5 tỷ đồng, Đắk Lắk 3 tỷ đồng, Khánh Hòa và Gia Lai mỗi tỉnh 2 tỷ đồng. Nguồn lực hướng tới giúp người dân sớm ổn định cuộc sống và phục hồi sản xuất.",
      "Bài viết về <strong>TKV hỗ trợ Tây Nguyên 12 tỷ đồng</strong> tách rõ từng khoản vì đây là chi tiết người đọc cần để hiểu quy mô. Cách phân bổ khác nhau giữa các tỉnh phản ánh tình hình thiệt hại và đề xuất của từng địa phương.",
    ],
    sections: [
      {
        title: "Bảng phân bổ nói lên ưu tiên cứu trợ",
        paragraphs: [
          "Lâm Đồng nhận mức cao nhất 5 tỷ đồng; Đắk Lắk nhận 3 tỷ; Khánh Hòa và Gia Lai mỗi tỉnh 2 tỷ. Tại các buổi tiếp nhận, đại diện Ủy ban MTTQ địa phương cho biết nguồn lực sẽ ưu tiên hộ chịu thiệt hại nặng, giúp người dân khắc phục khó khăn sau thiên tai.",
          "Khoản hỗ trợ có thể góp vào sửa nhà, khôi phục sinh hoạt, hỗ trợ nhu yếu phẩm hoặc sản xuất theo phương án của địa phương. Bài nguồn chưa công bố bảng chi đến từng hộ; mức của mỗi gia đình sẽ phụ thuộc kết quả rà soát và phương án phân bổ.",
        ],
        bullets: [
          "Lâm Đồng: 5 tỷ đồng.",
          "Đắk Lắk: 3 tỷ đồng.",
          "Khánh Hòa: 2 tỷ đồng.",
          "Gia Lai: 2 tỷ đồng."],
      },
      {
        title: "Hỗ trợ kịp thời quan trọng ở thời điểm nào?",
        paragraphs: [
          "Ngay sau mưa lũ, người dân cần chỗ ở tạm, nước sạch, lương thực và khôi phục giao thông. Sau giai đoạn khẩn cấp là nhu cầu sửa nhà, tái sản xuất, xử lý môi trường và phòng dịch. Nguồn tài chính đến sớm giúp địa phương chủ động hơn trong cả hai giai đoạn.",
          "Với gia đình mất sinh kế, hỗ trợ một lần chỉ là bước đầu. Các chương trình đào tạo nghề, kết nối việc làm và tín dụng phù hợp có thể giúp phục hồi bền vững hơn. Đây là lý do trách nhiệm xã hội của doanh nghiệp nên được liên kết với chiến lược phát triển địa phương dài hạn.",
        ],
      },
      {
        title: "Người dân cần tìm thông tin hỗ trợ ở đâu?",
        paragraphs: [
          "Ủy ban MTTQ và chính quyền cơ sở là đầu mối phù hợp để hỏi tiêu chí, danh sách và lịch phân bổ. TKV là đơn vị trao nguồn lực nhưng không có nghĩa người dân gửi hồ sơ trực tiếp cho bất kỳ cá nhân nào tự nhận đại diện Tập đoàn.",
          "Sau thiên tai thường xuất hiện thông tin giả và lời kêu gọi chuyển tiền thiếu xác minh. Người dân nên kiểm tra tài khoản, văn bản, cơ quan phát động và không cung cấp căn cước, mã ngân hàng cho người lạ. Sự cẩn trọng bảo vệ cả người cần trợ giúp và uy tín của chương trình.",
        ],
      },
    ],
    checklist: [
      ["Liên hệ cơ sở", "Hỏi Ủy ban MTTQ, xã hoặc phường về rà soát thiệt hại."],
      ["Ghi nhận đầy đủ", "Lưu hình ảnh, biên bản và giấy tờ chứng minh mức độ ảnh hưởng."],
      ["Cảnh giác giả mạo", "Không nộp phí hoặc cung cấp mã xác thực ngân hàng để nhận cứu trợ."],
      ["Lập kế hoạch phục hồi", "Ưu tiên nhà ở, nước sạch, sinh kế và việc học của trẻ em."],
    ],
    takeaway: "Điểm đáng ghi nhận của gói 12 tỷ đồng là phân bổ rõ ràng theo từng tỉnh và hướng tới hỗ trợ kịp thời. Giá trị cuối cùng cần được đo bằng khả năng người dân ổn định chỗ ở, trở lại sản xuất và giảm tổn thương trước mùa mưa lũ tiếp theo.",
    faq: [
      ["Gia Lai nhận bao nhiêu từ gói hỗ trợ?", "Theo nguồn công bố, Gia Lai nhận 2 tỷ đồng; Khánh Hòa cũng nhận 2 tỷ đồng."],
      ["Lâm Đồng vì sao nhận 5 tỷ đồng?", "Nguồn nêu mức phân bổ nhưng không công bố đầy đủ công thức tính; có thể hiểu đây là quyết định dựa trên thiệt hại và nhu cầu được báo cáo."],
      ["Mỗi hộ dân sẽ nhận bao nhiêu?", "Không thể lấy tổng tiền chia đều. Mức và hình thức hỗ trợ thuộc phương án rà soát, phân bổ của địa phương."],
    ],
    sources: [
      {publisher: "TKV", title: "TKV hỗ trợ 12 tỷ đồng giúp các tỉnh Tây Nguyên khắc phục hậu quả mưa lũ", date: "24/11/2025", url: "https://vinacomin.vn/news/slug/tkv-ho-tro-12-ty-dong-giup-cac-tinh-tay-nguyen-khac-phuc-hau-qua-mua-lu"},
      {publisher: "Tạp chí Công Thương", title: "TKV hỗ trợ 12 tỷ đồng giúp các tỉnh Tây Nguyên khắc phục hậu quả mưa lũ", date: "25/11/2025", url: "https://tapchicongthuong.vn/tkv-ho-tro-12-ty-dong-giup-cac-tinh-tay-nguyen-khac-phuc-hau-qua-mua-lu-328123.htm"},
    ],
  },
];

const storyFrame = (slug, count) => [...slug].reduce((total, character) => total + character.codePointAt(0), 0) % count;
const lowerInitial = (text) => text.charAt(0).toLocaleLowerCase("vi") + text.slice(1);

const localStoryFrames = [
  (item, source) => ({
    intro: [
      `${item.eventSummary} Với thanh niên ${item.locality}, sự kiện ấy mở ra một lối đi cụ thể hơn lời mời tuyển dụng thông thường: biết nơi học, doanh nghiệp đồng hành và đầu mối có thể hỏi ngay tại quê nhà.`,
      `Theo thông tin ${source.publisher} công bố, ${lowerInitial(item.resultSummary)} ${item.evidence} Những con số đã có người thật, việc thật phía sau giúp câu chuyện <strong>${item.keyword}</strong> trở nên gần gũi với cả người lao động lẫn gia đình.`,
    ],
    sections: [
      {title: "Một con đường đã có người đi trước", paragraphs: [`${item.opportunity} Người mới vì thế dễ tìm hiểu từ chính đồng hương: học những gì, những tháng đầu thích nghi ra sao và điều gì giúp họ đứng vững trong tổ đội.`, `Sự phối hợp của ${item.partners} nối bốn chặng vốn thường rời nhau: tư vấn, tuyển chọn, đào tạo và tiếp nhận. Khi từng chặng có người phụ trách, quyết định rời quê đến Quảng Ninh bớt mơ hồ và có thêm điểm tựa.`], bullets: item.bullets},
      {title: "Học để làm được việc trong tổ đội", paragraphs: [`Với người trẻ ${item.locality}, nghề mỏ mở ra cơ hội việc làm có tay nghề và cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động. Lớp học là nơi người mới làm quen thiết bị, quy trình an toàn, tác phong ca kíp và cách phối hợp với đồng đội trước khi bước vào môi trường sản xuất.`, `Tại ${item.locality}, người đăng ký nên hỏi rõ nghề đang mở, đơn vị dự kiến bố trí, yêu cầu định mức lao động và lịch tiếp nhận. Nội dung này được tư vấn rõ trước khi nhập học.`]},
      {title: "Gia đình cùng nhìn về một hướng", paragraphs: [`Trước khi làm hồ sơ, gia đình tại ${item.locality} nên cùng người lao động đo lại thể lực, kiểm tra thị lực, sức khỏe và trao đổi thẳng về việc học, ở ký túc xá rồi làm việc xa nhà. Sự đồng thuận ấy thường là nguồn động viên quan trọng trong giai đoạn đầu.`, `${item.caution} Thông tin này cần được hỏi lại ở buổi tư vấn hiện hành, cùng với thời gian học, chế độ sinh hoạt và lịch tiếp nhận. Chuẩn bị kỹ không làm cơ hội kém hấp dẫn; trái lại, nó giúp người chọn nghề bước đi vững vàng hơn.`]},
      {title: "Mục tiêu mới phải đi tới tận nơi làm việc", paragraphs: [`${item.target} Kết quả cần theo dõi là số người hoàn thành khóa học, nhận việc và trưởng thành thành công nhân có tay nghề.`, `Sự liên lạc của địa phương, quá trình theo sát của Nhà trường và hỗ trợ hòa nhập từ ${item.enterprise} sẽ giúp mô hình tại ${item.locality} tạo nguồn việc làm ổn định cho nhiều gia đình.`]},
    ],
    takeaway: `Khoảng cách từ ${item.locality} đến Quảng Ninh vẫn dài, nhưng các bước chuẩn bị đã rõ hơn nhờ người đi trước, cơ sở đào tạo và doanh nghiệp đồng hành. Sức khỏe, kỷ luật và quyết tâm học nghề sẽ quyết định chặng đường của mỗi người.`,
  }),
  (item, source) => ({
    intro: [
      `${item.evidence} Dữ kiện này giúp câu chuyện <strong>${item.keyword}</strong> được nhìn qua số người nhập học và có việc, thay cho việc chỉ đếm người dự một buổi tư vấn.`,
      `${item.eventSummary} ${source.publisher} cho biết: ${lowerInitial(item.resultSummary)} Với nhiều gia đình ${item.locality}, đây là bằng chứng gần gũi về một hướng lập nghiệp bằng nghề mỏ.`,
    ],
    sections: [
      {title: "Từ hội trường tới công trường", paragraphs: [`${item.partners} cùng tham gia để biến thông tin thành một quy trình có đầu cuối. Địa phương tìm đúng người có nhu cầu; Nhà trường chuẩn bị nghề và tác phong; ${item.enterprise} cho người học thấy nơi kỹ năng ấy sẽ được sử dụng.`, `${item.opportunity} Những câu chuyện của người đã vào nghề giúp ứng viên hình dung rõ hơn nhịp ca, khu ở, sinh hoạt tập thể và cảm giác nhận tháng lương đầu tiên bằng chính tay nghề của mình.`], bullets: item.bullets},
      {title: "Tay nghề mở rộng cơ hội nghề nghiệp", paragraphs: [`Người thợ mới từ ${item.locality} không đứng yên ở ngày đầu vào mỏ. Từ thao tác cơ bản, họ học cách đọc tín hiệu, vận hành thiết bị, giữ an toàn cho đồng đội và nâng năng suất của cả tổ. Tay nghề càng chắc, cơ hội đảm nhận công việc quan trọng và cải thiện thu nhập càng rõ.`, `Vì vậy, các mức thu nhập xuất hiện trong hội nghị nên được hiểu như kết quả của quá trình rèn nghề. Người ở ${item.locality} cần hỏi mức của vị trí dự tuyển, chế độ ca kíp và các khoản phúc lợi để xây một kế hoạch thực tế cho năm đầu.`]},
      {title: "Ba câu hỏi trước ngày nộp hồ sơ", paragraphs: [`Ứng viên ${item.locality} cần biết mình có đạt điều kiện sức khỏe hay không, khóa nào đang tiếp nhận và doanh nghiệp nào dự kiến bố trí sau đào tạo. Ba câu trả lời ấy quan trọng hơn mọi lời giới thiệu chung trên mạng.`, `${item.caution} Khi cùng dự buổi tư vấn, gia đình còn có thể hỏi về ký túc xá, bữa ăn, thời gian thực tập và cách liên hệ nếu người học gặp khó khăn trong những tuần đầu.`]},
      {title: "Kết quả được tính bằng người bám nghề", paragraphs: [`${item.target} Chương trình hoàn thành trọn vẹn khi người học đi hết khóa, vào đúng vị trí và duy trì công việc.`, `Theo dõi người mới sau nhận việc là phần việc âm thầm nhưng quan trọng. Chính những công nhân trưởng thành từ chương trình hôm nay sẽ trở về kể câu chuyện đáng tin nhất cho lớp thanh niên ${item.locality} ngày mai.`]},
    ],
    takeaway: `Lợi thế của ${item.locality} là mối nối trực tiếp giữa địa phương, cơ sở đào tạo và doanh nghiệp. Với người trẻ đủ sức khỏe, vài tháng học nghề có thể trở thành nền tảng cho nhiều năm làm việc có kỷ luật và tay nghề.`,
  }),
  (item, source) => ({
    intro: [
      `Nhiều người ở ${item.locality} chưa từng nhìn thấy một mỏ than, nhưng đã có thể gặp công nhân đồng hương từng học nghề và đang làm việc tại Quảng Ninh. ${item.resultSummary}`,
      `${item.eventSummary} Trong công bố của ${source.publisher}, ${lowerInitial(item.evidence)} Dữ kiện ấy đặt <strong>${item.keyword}</strong> vào một bức tranh lớn hơn: đưa thanh niên từ nơi ít việc làm ổn định tới một ngành công nghiệp cần sức khỏe, tay nghề và tính kỷ luật.`,
    ],
    sections: [
      {title: "Con đường từ bản làng tới lớp học nghề", paragraphs: [`${item.opportunity} Khi người đi trước kể bằng trải nghiệm của chính mình, gia đình dễ hình dung hơn chuyện di chuyển, học tập và sinh hoạt xa nhà.`, `${item.partners} tạo thành ba điểm tựa cho hành trình ấy. Người lao động biết hỏi ai ở quê, học ở đâu và doanh nghiệp nào đang cần nghề mình được đào tạo.`], bullets: item.bullets},
      {title: "Tay nghề là vốn liếng mang theo lâu dài", paragraphs: [`Với người trẻ ${item.locality}, một khóa học nghề mỏ dạy thao tác kỹ thuật và rèn thói quen kiểm tra thiết bị, nghe lệnh sản xuất, nhận diện nguy cơ, phối hợp trong tổ. Đó là những năng lực làm nên giá trị của một công nhân công nghiệp.`, `Thu nhập tốt là điều nhiều người quan tâm, nhưng sự tự tin khi làm được việc mới là nền tảng để giữ thu nhập. Tại ${item.locality}, ứng viên nên tìm hiểu vị trí cụ thể ở ${item.enterprise} và con đường nâng bậc sau khi vào làm.`]},
      {title: "Chuẩn bị cho những tháng đầu xa nhà", paragraphs: [`Với người rời ${item.locality}, sức khỏe, giờ giấc và khả năng sống tập thể là ba thử thách dễ thấy nhất. Tập vận động, điều chỉnh sinh hoạt và chuẩn bị tâm lý trước ngày nhập học sẽ giúp quá trình thích nghi nhẹ nhàng hơn.`, `${item.caution} Cùng với đó, gia đình cần ghi rõ lịch, địa điểm, chế độ hỗ trợ và người phụ trách để mỗi quyết định đều dựa trên thông tin của đợt đang tuyển.`]},
      {title: "Khi mục tiêu tuyển người trở thành mục tiêu giữ người", paragraphs: [`${item.target} Con số ấy sẽ có ý nghĩa nhất khi đi cùng tỷ lệ tốt nghiệp và số công nhân còn gắn bó sau năm đầu.`, `Điều đó đòi hỏi địa phương, Nhà trường và ${item.enterprise} cùng nói đúng về nghề, chọn đúng người và hỗ trợ người mới khi bắt đầu cuộc sống tại Quảng Ninh.`]},
    ],
    takeaway: `Nghề mỏ đòi hỏi sức khỏe, kỷ luật và thời gian rèn tay nghề. Sự kết nối tại ${item.locality} giúp người trẻ nhìn rõ ba chặng chính: học nghề, làm việc trong tổ đội và trưởng thành bằng năng lực.`,
  }),
  (item, source) => ({
    intro: [
      `${item.eventSummary} Bản ký kết xác định ${item.partners} cùng chịu trách nhiệm cho các bước từ tuyển sinh tới việc làm.`,
      `${source.publisher} ghi nhận: ${item.resultSummary} ${item.evidence} Đây là dữ kiện trọng tâm khi nhìn lại <strong>${item.keyword}</strong>: chương trình đã có người học, người làm và kết quả có thể kiểm chứng.`,
    ],
    sections: [
      {title: "Ba mắt xích cùng chịu trách nhiệm", paragraphs: [`Ở ${item.locality}, chính quyền và đoàn thể có thể tìm tới từng thôn, từng gia đình; Nhà trường đánh giá đầu vào và tổ chức đào tạo; ${item.enterprise} đưa nhu cầu nhân lực và thực tế sản xuất vào cuộc tư vấn.`, `Cách làm này đặc biệt quan trọng với lao động ${item.locality} ở xa Quảng Ninh. Những đầu mối công khai cho phép họ kiểm tra nghề học, nơi đào tạo và địa chỉ việc làm theo từng bước.`], bullets: item.bullets},
      {title: "Một công việc có kỷ luật và có đường tiến", paragraphs: [`${item.opportunity} Sau khi vào nghề, người lao động tiếp tục học qua từng ca: từ tuân thủ quy trình tới xử lý thiết bị và phối hợp an toàn với đồng đội.`, `Thu nhập phản ánh vị trí, ngày công, năng suất và trình độ làm việc. Ứng viên ${item.locality} cần nhìn đồng thời vào lộ trình nâng tay nghề và những phúc lợi của ${item.enterprise}.`]},
      {title: "Quyết định nghề nghiệp cần một buổi nói chuyện thật", paragraphs: [`Trước ngày đăng ký từ ${item.locality}, gia đình nên ngồi lại với người lao động để bàn rõ chuyện sức khỏe, học xa nhà, giờ ca và mục tiêu làm việc ít nhất trong vài năm. Khi lý do vào nghề đủ vững, người học thường chủ động hơn trong cả lớp học lẫn nơi sản xuất.`, `${item.caution} Đây là nội dung cần xác nhận trực tiếp, cùng danh mục hồ sơ và thời điểm khám sức khỏe, để không lấy chính sách của đợt cũ áp vào hồ sơ mới.`]},
      {title: "Kết quả nằm ở những người bám nghề", paragraphs: [`${item.target} Thành quả có sức thuyết phục nhất là những người hoàn thành đào tạo, được nhận vào tổ đội và tạo nguồn thu nhập ổn định cho gia đình.`, `Khi những trường hợp ấy trở thành người tư vấn cho thế hệ sau, chương trình tại ${item.locality} sẽ hình thành một vòng tròn tích cực: người đi trước mở đường, người đi sau có thêm niềm tin.`]},
    ],
    takeaway: `Bản ký kết chỉ là điểm xuất phát. Giá trị thật nằm ở từng thanh niên ${item.locality} có nghề trong tay, làm việc an toàn và tự xây được tương lai từ sức lao động của mình.`,
  }),
  (item, source) => ({
    intro: [
      `${item.resultSummary} Đằng sau dữ kiện ấy là những chuyến đi từ ${item.locality} tới Quảng Ninh, những ngày đầu trong lớp thực hành và những người đã đứng vững trong tổ sản xuất.`,
      `${item.eventSummary} Theo ${source.publisher}, ${lowerInitial(item.evidence)} Sự tiếp nối này khiến <strong>${item.keyword}</strong> mang dáng dấp của một tuyến phát triển nhân lực lâu dài hơn là một đợt tuyển người ngắn hạn.`,
    ],
    sections: [
      {title: "Từ một lựa chọn cá nhân tới cơ hội của địa phương", paragraphs: [`${item.opportunity} Mỗi người thành công giúp cải thiện đời sống gia đình, đồng thời đem về một câu chuyện nghề nghiệp cụ thể cho cộng đồng.`, `${item.partners} đang tạo điều kiện để câu chuyện đó lặp lại với quy trình rõ hơn: tìm người phù hợp, chuẩn bị nghề, đưa tới doanh nghiệp và hỗ trợ giai đoạn đầu.`], bullets: item.bullets},
      {title: "Vì sao nghề mỏ đáng để người trẻ tìm hiểu?", paragraphs: [`Với thanh niên ${item.locality}, đây là nghề đòi hỏi thể lực và kỷ luật, nhưng cũng trả công cho kỹ năng, sự bền bỉ và khả năng làm việc nhóm. Trong một tổ đội, mỗi thao tác đúng góp phần bảo vệ đồng đội và giữ nhịp sản xuất của cả dây chuyền.`, `Tại ${item.locality}, người quan tâm có thể hỏi ${item.enterprise} về vị trí dự kiến, ca làm, phúc lợi và lộ trình nâng bậc. Hiểu rõ công việc là nền tảng để mỗi người chọn nghề bằng sự chủ động.`]},
      {title: "Bước khởi đầu diễn ra ngay tại quê nhà", paragraphs: [`Tại ${item.locality}, việc đầu tiên là kiểm tra độ tuổi, chiều cao, cân nặng, thị lực và sức khỏe. Tiếp theo là nhận lịch tuyển, chuẩn bị đúng hồ sơ và trao đổi với gia đình về thời gian học cũng như cuộc sống xa nhà.`, `${item.caution} Thông tin được đối chiếu tại buổi tư vấn sẽ giúp người lao động chủ động kế hoạch di chuyển và tài chính.`]},
      {title: "Một giai đoạn mới với thước đo rõ ràng", paragraphs: [`${item.target} Thước đo quan trọng hơn vẫn là tỷ lệ người học xong, nhận việc và tiến bộ sau từng quý làm việc.`, `Việc ${item.locality} kết nối người đi trước với người mới, cùng sự theo sát của Nhà trường và ${item.enterprise}, sẽ chuyển mục tiêu tuyển sinh thành kết quả lâu dài cho doanh nghiệp và địa phương.`]},
    ],
    takeaway: `Người trẻ ${item.locality} nên gặp người đã đi trước, xem kết quả đã có và tự đánh giá mức độ sẵn sàng về sức khỏe, học nghề, kỷ luật trước khi bước vào ngành Than.`,
  }),
];

const localSectionHeadings = {
  "binh-lieu-hop-tac-hoc-nghe-mo-viec-lam-tkv": [
    "Từ 321 người đi học đến một cộng đồng nghề ở Bình Liêu",
    "Một nghề lớn lên cùng tay nghề và ngày công",
    "Xa nhà nhưng không đơn độc trong những tháng đầu",
    "Mục tiêu 60–70 người phải đi cùng chất lượng việc làm",
  ],
  "luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam": [
    "Lục Hồn đã biến lựa chọn cá nhân thành hướng đi của cả xã",
    "Điều gì giữ người trẻ ở lại với nghề?",
    "Một cuộc trao đổi thẳng trước ngày rời quê",
    "Giai đoạn mới được đo bằng người làm việc bền vững",
  ],
  "vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv": [
    "Từ Vị Xuyên đến những tổ đội ở Hà Lầm, Núi Béo",
    "Nghề mỏ trả công cho năng lực được rèn mỗi ngày",
    "Ba việc gia đình nên cùng chuẩn bị",
    "Mục tiêu 60–80 người và bài toán bám nghề",
  ],
  "hoanh-mo-xay-lap-mo-dao-tao-nghe-viec-lam": [
    "Ba bên cùng giữ một lời hứa về việc làm",
    "Xây lắp mỏ mở thêm một lối nghề kỹ thuật",
    "Chọn đúng nghề trước khi chuẩn bị hồ sơ",
    "Từ 152 người có việc đến mục tiêu mới",
  ],
  "si-lo-lau-khun-ha-lai-chau-hoc-nghe-mo": [
    "Từ bản làng Lai Châu đến lớp học nghề",
    "Tay nghề là hành trang vượt qua khoảng cách",
    "Những tháng đầu xa nhà cần chuẩn bị điều gì?",
    "Giữ người sau tuyển sinh mới là thành công",
  ],
  "tinh-doan-lai-chau-ket-noi-viec-lam-tkv": [
    "Ba tổ chức cùng mở rộng cánh cửa cho thanh niên",
    "Từ người học nghề đến công nhân có đường tiến",
    "Buổi tư vấn cần trả lời điều gì cho gia đình?",
    "300–400 cơ hội chỉ có ý nghĩa khi người trẻ trưởng thành",
  ],
  "bao-lac-cao-bang-tu-van-hoc-nghe-mo": [
    "Bảo Lạc đi tìm người học nghề từ từng xã, từng thôn",
    "Tổ đội là nơi người mới học cách đứng vững",
    "Gia đình là điểm tựa của hành trình xuống mỏ",
    "Mục tiêu trên 60 người cần được theo đến ngày nhận việc",
  ],
  "luong-minh-quang-tan-ky-ket-dao-tao-viec-lam": [
    "Hai xã cùng nối một đường từ hộ gia đình tới doanh nghiệp",
    "Nghề mỏ hấp dẫn khi người trẻ nhìn thấy đường phát triển",
    "Ba thông tin phải rõ trước ngày nộp hồ sơ",
    "Thước đo sau ký kết là những công nhân bám nghề",
  ],
  "duong-thuong-tuyen-quang-than-quang-hanh-tuyen-nghe-mo": [
    "Hai ngày đi qua 20 thôn để nói rõ ba nghề",
    "Khai thác, đào lò, cơ điện: ba lối vào ngành Than",
    "Chuẩn bị cho ca làm đầu tiên ngay từ quê nhà",
    "Tuyển đúng người để doanh nghiệp giữ được người",
  ],
  "than-thong-nhat-tuyen-sinh-nghe-mo-lai-chau-2026": [
    "Một tuần ở Lai Châu thay cho một lời mời trên mạng",
    "Người trẻ cần nhìn thấy nghề trước khi chọn nghề",
    "Bước đầu tiên là một cuộc tư vấn tại địa bàn",
    "Từ nguồn tuyển mới đến lực lượng thợ có tay nghề",
  ],
};

const localFrameIndexes = {
  "binh-lieu-hop-tac-hoc-nghe-mo-viec-lam-tkv": 0,
  "luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam": 1,
  "vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv": 2,
  "hoanh-mo-xay-lap-mo-dao-tao-nghe-viec-lam": 3,
  "si-lo-lau-khun-ha-lai-chau-hoc-nghe-mo": 4,
  "tinh-doan-lai-chau-ket-noi-viec-lam-tkv": 0,
  "bao-lac-cao-bang-tu-van-hoc-nghe-mo": 1,
  "luong-minh-quang-tan-ky-ket-dao-tao-viec-lam": 2,
  "duong-thuong-tuyen-quang-than-quang-hanh-tuyen-nghe-mo": 3,
  "than-thong-nhat-tuyen-sinh-nghe-mo-lai-chau-2026": 4,
};

const localChecklistFrames = [
  (item) => [
    ["Tự đo lại thể lực", `Người ở ${item.locality} ghi chính xác năm sinh, chiều cao, cân nặng và tình trạng sức khỏe hiện tại.`],
    ["Gặp đúng người phụ trách", `Hỏi địa phương hoặc ${item.enterprise} về lịch tư vấn và đợt đang tiếp nhận.`],
    ["Nhìn rõ vị trí sẽ học", "Đối chiếu nghề đào tạo, nơi thực hành, đơn vị dự kiến bố trí và cách tính thu nhập."],
    ["Bàn kỹ với gia đình", "Thống nhất thời gian học xa nhà, sinh hoạt tập thể và mục tiêu gắn bó sau tốt nghiệp."],
  ],
  (item) => [
    ["Bắt đầu bằng dữ liệu thật", `Gửi thông tin thể lực của người đăng ký từ ${item.locality}, không ước lượng theo trí nhớ.`],
    ["Hỏi thẳng doanh nghiệp", `Làm rõ với ${item.enterprise} về nghề, ca làm, phúc lợi và nơi tiếp nhận sau đào tạo.`],
    ["Nghe người đi trước", "Tìm một công nhân đồng hương để hiểu nhịp học, đời sống tập thể và những tháng đầu vào nghề."],
    ["Lập kế hoạch một năm", "Chuẩn bị cho khóa học, giai đoạn thực tập và thời gian làm quen công việc chính thức."],
  ],
  (item) => [
    ["Kiểm tra từ quê nhà", `Người lao động ${item.locality} đối chiếu sức khỏe trước khi chốt ngày di chuyển.`],
    ["Ghi đủ bốn mốc", "Lưu ngày tập trung, nơi học, thời gian thực tập và đơn vị dự kiến nhận việc."],
    ["Chọn nghề bằng hiểu biết", `Hỏi ${item.enterprise} công việc hằng ngày cần thao tác, thiết bị và kỷ luật gì.`],
    ["Giữ một đầu mối liên hệ", "Gia đình và người học cùng lưu người phụ trách để được hỗ trợ trong giai đoạn đầu."],
  ],
  (item) => [
    ["Soi điều kiện ban đầu", `Đối chiếu tuổi, thể lực, thị lực và sức khỏe trước buổi tư vấn tại ${item.locality}.`],
    ["Đọc đúng chính sách", "Hỏi chính sách của đợt hiện hành, không dùng lại lịch hoặc chế độ của một đợt cũ."],
    ["Hình dung ca làm", `Trao đổi với ${item.enterprise} về vị trí, tổ đội, thời giờ và lộ trình nâng tay nghề.`],
    ["Chuẩn bị tâm thế đường dài", "Xác định học để làm được việc và cho bản thân đủ thời gian thích nghi với môi trường mới."],
  ],
  (item) => [
    ["Tìm câu trả lời tại địa bàn", `Dự buổi tư vấn ở ${item.locality} để hỏi đúng nghề đang mở và lịch đang áp dụng.`],
    ["Mang theo thông tin sức khỏe", "Nêu trung thực thể lực, thị lực, bệnh đang điều trị và khả năng làm việc theo ca."],
    ["Kiểm chứng bằng người thật", `Hỏi công nhân từng làm tại ${item.enterprise} về công việc, thu nhập và đời sống.`],
    ["Chốt kế hoạch cùng gia đình", "Chỉ lên đường khi nơi học, người đón, chế độ sinh hoạt và bước tiếp theo đều đã rõ."],
  ],
];

const localFaqFrames = [
  (item) => [
    [`${item.locality} đã có người học và làm trong ngành Than chưa?`, `${item.resultSummary} Đây là nhóm người đi trước để ứng viên và gia đình tìm hiểu thêm bằng trải nghiệm thực tế.`],
    ["Người chưa có nghề có thể bắt đầu không?", "Có thể. Chương trình đào tạo giúp người mới hình thành kỹ năng, tác phong và kiến thức an toàn trước khi bước vào sản xuất."],
    ["Thu nhập tăng theo yếu tố nào?", "Vị trí, ngày công, năng suất, kỹ năng và thâm niên cùng quyết định thu nhập; tay nghề vững là nền tảng quan trọng nhất."],
  ],
  (item) => [
    [`Buổi tư vấn tại ${item.locality} nên hỏi điều gì trước tiên?`, `Hãy hỏi đúng nghề đang mở, ${item.enterprise} có phải đơn vị dự kiến tiếp nhận hay không, lịch học và cách tính thu nhập của vị trí.`],
    ["Gia đình có nên cùng tham dự không?", "Nên. Gia đình sẽ hiểu rõ nơi học, sinh hoạt, việc xa nhà và có thể trở thành điểm tựa cho người học trong giai đoạn đầu."],
    ["Sau khóa học, người lao động được đánh giá thế nào?", "Người học cần hoàn thành chương trình, đạt sức khỏe và đáp ứng yêu cầu tiếp nhận của công việc được đào tạo."],
  ],
  (item) => [
    [`Mô hình phối hợp tại ${item.locality} được tổ chức như thế nào?`, `${item.partners} cùng nối các bước tư vấn, tuyển chọn, đào tạo và bố trí việc làm thành một quy trình có đầu mối.`],
    ["Nếu chưa chắc sức khỏe, nên làm gì?", "Nên gửi đúng chiều cao, cân nặng, thị lực và tình trạng bệnh để được hướng dẫn sàng lọc trước khi di chuyển."],
    ["Chế độ của bài viết có áp dụng cho mọi khóa không?", "Mỗi đợt có thể khác về lịch, nghề và đơn vị đồng hành; thông tin cụ thể sẽ được đối chiếu ở thời điểm đăng ký."],
  ],
  (item) => [
    [`Làm sao nhận biết chương trình tại ${item.locality} có lộ trình rõ?`, `Thông tin cần nêu được người phụ trách, nơi học, nghề đào tạo, ${item.enterprise} và các bước từ khám sức khỏe đến tiếp nhận.`],
    ["Có cần nộp tiền cho người giữ chỗ không?", "Không nên chuyển tiền chỉ dựa trên lời hứa. Hồ sơ và các khoản liên quan cần đi qua đầu mối được công khai."],
    ["Ký kết phối hợp có đồng nghĩa mọi hồ sơ đều được nhận?", "Không. Mỗi người vẫn phải đáp ứng điều kiện đầu vào, hoàn thành đào tạo và đạt yêu cầu của vị trí."],
  ],
  (item) => [
    [`Bằng chứng gần gũi nhất với người ${item.locality} là gì?`, `${item.evidence} Người đã đi trước có thể kể rõ hơn về học tập, tổ đội, thu nhập và những tháng đầu thích nghi.`],
    ["Người mới nên chuẩn bị gì trước khóa học?", "Sức khỏe, giấy tờ, nếp sinh hoạt đúng giờ và sự đồng thuận của gia đình là bốn nền tảng quan trọng."],
    ["Bước đầu tiên để tìm hiểu là gì?", `Gửi thông tin cá nhân và thể lực, sau đó hỏi lịch tư vấn đang mở tại ${item.locality} hoặc đầu mối của ${item.enterprise}.`],
  ],
];

const localEditorialLabels = {
  "binh-lieu-hop-tac-hoc-nghe-mo-viec-lam-tkv": {
    facts: "321 người được tuyển, 289 người hoàn thành khóa học",
    action: "Trước khi đăng ký, người Bình Liêu cần hỏi rõ điều gì?",
    conclusion: "Bình Liêu đã hình thành một cộng đồng nghề",
  },
  "luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam": {
    facts: "Từ 321 người đến ba thôn vượt chỉ tiêu",
    action: "Ba câu hỏi trước ngày rời Lục Hồn",
    conclusion: "Giữ người gắn bó với nghề mới là kết quả cuối cùng",
  },
  "vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv": {
    facts: "211 lao động Vị Xuyên trong bức tranh 2.046 người Hà Giang",
    action: "Chuẩn bị cho năm đầu học và làm việc xa nhà",
    conclusion: "Đồng hương đi trước tạo điểm tựa cho người mới",
  },
  "hoanh-mo-xay-lap-mo-dao-tao-nghe-viec-lam": {
    facts: "33 hội nghị, 165 người học và 152 người có việc",
    action: "Chọn đúng nghề, đúng đơn vị trước khi lên đường",
    conclusion: "Hoành Mô cần theo người học tới ngày bám nghề",
  },
  "si-lo-lau-khun-ha-lai-chau-hoc-nghe-mo": {
    facts: "Hai xã vùng cao trong kế hoạch đào tạo 2025–2030",
    action: "Từ bản làng đến lớp học: bốn điều phải rõ",
    conclusion: "Một lộ trình rõ ràng rút ngắn khoảng cách địa lý",
  },
  "tinh-doan-lai-chau-ket-noi-viec-lam-tkv": {
    facts: "Gần 1.500 thanh niên Lai Châu đã tốt nghiệp và vào TKV",
    action: "Từ buổi tư vấn đến một hồ sơ phù hợp",
    conclusion: "Người đi trước là tiếng nói thuyết phục nhất",
  },
  "bao-lac-cao-bang-tu-van-hoc-nghe-mo": {
    facts: "144 lượt tư vấn, 40 hồ sơ và 22 người nhập học",
    action: "Đưa tư vấn nghề tới từng xã, từng thôn Bảo Lạc",
    conclusion: "Hiệu quả được đo bằng người hoàn thành khóa và có việc",
  },
  "luong-minh-quang-tan-ky-ket-dao-tao-viec-lam": {
    facts: "Hàng trăm lao động đã đi học và có việc làm",
    action: "Ba thông tin cần chốt trước khi làm hồ sơ",
    conclusion: "Hai xã, hai doanh nghiệp và một quy trình có đầu mối",
  },
  "duong-thuong-tuyen-quang-than-quang-hanh-tuyen-nghe-mo": {
    facts: "Hai ngày, 20 thôn và ba nhóm nghề",
    action: "Chọn đúng nghề ngay từ buổi tư vấn",
    conclusion: "Đường Thượng cần chuyển thông tin thành hồ sơ phù hợp",
  },
  "than-thong-nhat-tuyen-sinh-nghe-mo-lai-chau-2026": {
    facts: "Bảy ngày làm việc trực tiếp tại Lai Châu",
    action: "Hỏi thẳng nghề học, nơi ở và đơn vị tiếp nhận",
    conclusion: "Một tuần tư vấn phải tạo ra quyết định có hiểu biết",
  },
};

const makeLocalCooperationStory = (item) => {
  const source = item.sources[0];
  const frameIndex = localFrameIndexes[item.slug] ?? storyFrame(item.slug, localStoryFrames.length);
  const narrative = localStoryFrames[frameIndex](item, source);
  const headings = localSectionHeadings[item.slug] || [];
  const labels = localEditorialLabels[item.slug] || {
    facts: `Dữ kiện chính từ chương trình tại ${item.locality}`,
    action: `Thông tin cần chốt trước ngày rời ${item.locality}`,
    conclusion: `Một lộ trình nghề có đầu mối từ ${item.locality}`,
  };
  const framedSections = narrative.sections.map((section, index) => ({
    ...section,
    title: headings[index] || section.title,
  }));
  return {
    slug: item.slug,
    section: "Kết nối địa phương",
    title: item.title,
    seoTitle: item.seoTitle,
    description: item.description,
    lead: item.lead,
    keyword: item.keyword,
    keywords: [item.keyword, `học nghề mỏ ${item.locality}`, `việc làm TKV ${item.locality}`, "Trường Cao đẳng TKV"],
    image: item.image,
    imageAlt: item.imageAlt,
    imageSource: item.imageSource,
    facts: item.facts,
    intro: narrative.intro,
    sections: item.focus
      ? [framedSections[0], {title: item.focusTitle, paragraphs: item.focus}, ...framedSections.slice(1)]
      : framedSections,
    factsTitle: labels.facts,
    actionTitle: labels.action,
    conclusionTitle: labels.conclusion,
    checklist: localChecklistFrames[frameIndex](item),
    takeaway: narrative.takeaway,
    faq: localFaqFrames[frameIndex](item),
    sources: item.sources,
  };
};

const supportProgram = (item) => item.programLabel || item.keyword;
const supportBeneficiary = (item) => item.beneficiaryLabel || item.beneficiaryKeyword;

const supportStoryFrames = [
  (item, source) => ({
    intro: [`${item.eventSummary} Theo ${source.publisher}, chương trình hướng nguồn lực tới ${supportBeneficiary(item)} qua đầu mối được công bố.`, `${item.context} Hoạt động này ghi thêm một lát cắt về ngành Than: phía sau những ca sản xuất là cộng đồng thợ mỏ cùng chia sẻ trách nhiệm với nơi doanh nghiệp hoạt động và quê hương của người lao động.`],
    sections: [
      {title: "Sau con số là những nhu cầu rất cụ thể", paragraphs: [`${item.allocation} Mỗi khoản tiền chỉ có ý nghĩa khi được đặt đúng địa bàn, đúng thời điểm và đúng nhu cầu cấp thiết.`, `${item.delivery} Cách chuyển qua cơ quan tiếp nhận giúp địa phương rà soát từng trường hợp, đồng thời tạo một đầu mối để cộng đồng theo dõi tiến độ.`], bullets: item.bullets},
      {title: "Văn hóa người thợ hiện diện trong cộng đồng", paragraphs: [`${item.impact} Tinh thần “Kỷ luật và Đồng tâm” được thể hiện trong sản xuất và qua cách tập thể người lao động góp sức khi cộng đồng gặp khó.`, `Những chương trình dành cho ${supportBeneficiary(item)} giúp người đọc hiểu ngành Than qua cả công việc, đồng đội và trách nhiệm xã hội.`]},
      {title: "Từ buổi trao đến thay đổi trong đời sống", paragraphs: [`${item.measurement} Kết quả cuối cần được nhìn ở mái nhà đã an toàn hơn, lớp học đủ điều kiện hơn hoặc gia đình có thể sớm trở lại nhịp sống thường ngày.`, `Công bố tiến độ và kết quả của ${supportProgram(item)} biến con số tại lễ phát động thành bằng chứng về thay đổi trong đời sống.`]},
      {title: "Tiếp cận chương trình qua đầu mối chính thức", paragraphs: [`${item.safety} ${supportBeneficiary(item)} cần làm theo hướng dẫn của địa phương hoặc tổ chức tiếp nhận; không có chuyện nộp phí cho cá nhân để được đưa vào danh sách.`, `Thông tin rõ ràng vừa bảo vệ người dân trước giả mạo, vừa giữ trọn ý nghĩa của sự đóng góp từ doanh nghiệp và người thợ.`]},
    ],
  }),
  (item, source) => ({
    intro: [`${item.context} ${item.eventSummary}`, `Trong thông tin về <strong>${supportProgram(item)}</strong>, ${source.publisher} công bố rõ quy mô và đối tượng. Chương trình cho thấy doanh nghiệp ngành Than đang nối trách nhiệm sản xuất với trách nhiệm đối với cộng đồng.`],
    sections: [
      {title: "Nguồn lực được đặt vào đâu?", paragraphs: [`${item.allocation} Bảng phân bổ hoặc phạm vi tiếp nhận giúp người đọc hiểu đúng chương trình, không cộng dồn với các hoạt động khác và không chia bình quân một cách máy móc.`, `${item.delivery} Đằng sau mỗi khoản hỗ trợ là việc khảo sát, lập danh sách và chọn nhu cầu ưu tiên—những phần việc quyết định nguồn lực có đến đúng nơi hay không.`], bullets: item.bullets},
      {title: "Một ngành công nghiệp gắn với nhiều quê hương", paragraphs: [`TKV có công nhân đến từ nhiều tỉnh, thành; vì thế hoạt động dành cho ${supportBeneficiary(item)} cũng là cách doanh nghiệp gìn giữ mối liên hệ với quê hương của người lao động.`, `${item.impact} Khi sự hỗ trợ chạm tới nhà ở, trường học, sinh kế hoặc sự tri ân, hình ảnh người thợ mỏ hiện lên qua cả lao động sản xuất và tinh thần tương trợ.`]},
      {title: "Hiệu quả phải hiện ra sau lễ phát động", paragraphs: [`${item.measurement} Số tiền cho biết quy mô cam kết, còn chất lượng triển khai mới cho biết người dân đã nhận được thay đổi gì.`, `Theo dõi công trình, tiến độ và phản hồi của người thụ hưởng trong ${supportProgram(item)} là cách để chương trình tạo thêm niềm tin cho những lần đồng hành tiếp theo.`]},
      {title: "Giữ sự tử tế khỏi những lời mời giả mạo", paragraphs: [`${item.safety} Người dân chỉ nên cung cấp hồ sơ theo yêu cầu của chính quyền hoặc tổ chức được giao nhiệm vụ.`, `Với ${supportBeneficiary(item)}, một nguyên tắc đơn giản có thể tránh nhiều rủi ro: chương trình chính thức không yêu cầu gửi mã ngân hàng, mã xác thực hay nộp một khoản phí để nhận quyền lợi.`]},
    ],
  }),
  (item, source) => ({
    intro: [`${item.eventSummary} Theo ${source.publisher}, <strong>${supportProgram(item)}</strong> hướng tới ${supportBeneficiary(item)}.`, `${item.context} Trong những thời điểm như vậy, nguồn lực đến sớm giúp gia đình giữ chỗ ở, việc học hoặc nhịp sinh kế—những điều nhỏ hơn con số trên văn bản nhưng có ý nghĩa trực tiếp trong đời sống.`],
    sections: [
      {title: "Cam kết được đo bằng cách phân bổ", paragraphs: [`${item.allocation} Phạm vi này là căn cứ để hiểu đúng quy mô; tổng nguồn lực không đồng nghĩa mỗi người hay mỗi địa phương nhận phần bằng nhau.`, `${item.delivery} Khi địa phương chịu trách nhiệm rà soát, khoản hỗ trợ có cơ hội bám sát hoàn cảnh hơn và tránh bỏ sót nhóm khó tiếp cận thông tin.`], bullets: item.bullets},
      {title: "Người thợ mỏ góp sức ngoài giờ sản xuất", paragraphs: [`${item.impact} Đóng góp ấy làm rõ một nét văn hóa của ngành Than: đồng đội trong mỏ và đồng bào ngoài cộng đồng đều được nhìn bằng tinh thần sẻ chia.`, `Với người đang tìm hiểu nghề mỏ, hoạt động dành cho ${supportBeneficiary(item)} cho thấy một giá trị không thể hiện hết trong bảng lương—cảm giác thuộc về một tập thể có truyền thống, kỷ luật và trách nhiệm.`]},
      {title: "Kết quả sau ngày trao hỗ trợ", paragraphs: [`${item.measurement} Một mái nhà bàn giao đúng tiến độ, một học sinh tiếp tục đến lớp hay một gia đình khôi phục sinh kế là những kết quả cụ thể nhất.`, `Cập nhật công khai kết quả của ${supportProgram(item)} giúp cộng đồng theo dõi nguồn lực từ doanh nghiệp đến đời sống, đồng thời làm cho hoạt động an sinh lần sau chính xác hơn.`]},
      {title: "Thông tin đúng là lớp bảo vệ đầu tiên", paragraphs: [`${item.safety} ${supportBeneficiary(item)} cần hỏi đúng cơ quan được nêu trong chương trình và giữ lại giấy tờ theo hướng dẫn.`, `Sự thận trọng này không làm giảm ý nghĩa của chương trình; nó bảo đảm lòng tốt không bị lợi dụng và nguồn hỗ trợ đến được đúng người.`]},
    ],
  }),
];

const supportSectionHeadings = {
  "tkv-ho-tro-5-ty-xoa-nha-tam-lam-dong": [
    "Năm tỷ đồng được kỳ vọng hóa thành những mái nhà an toàn",
    "Tinh thần người thợ đi xa hơn vùng mỏ",
    "Một căn nhà mới có thể thay đổi đời sống ra sao?",
    "Đúng hộ, đúng nhu cầu, đúng tiến độ",
  ],
  "tkv-ung-ho-10-ty-khac-phuc-bao-bualoi": [
    "Sau bão, tốc độ của nguồn hỗ trợ có ý nghĩa quyết định",
    "Mười tỷ đồng và tinh thần sẻ chia của người thợ",
    "Kết quả phải hiện ra ở mái nhà và sinh kế",
    "Một đầu mối rõ để lòng tốt đến đúng nơi",
  ],
  "tkv-ho-tro-10-ty-mien-nui-phia-bac-mua-lu": [
    "Bảng phân bổ 3–3–2–2 kể câu chuyện ưu tiên",
    "Từ mỗi ca than đến sự sẻ chia với miền núi phía Bắc",
    "Điều cần thấy sau ngày trao hỗ trợ",
    "Minh bạch làm cho sự hỗ trợ bền lòng tin",
  ],
  "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026": [
    "Hai mươi tỷ đồng cho một chương trình tri ân toàn quốc",
    "Truyền thống biết ơn trong văn hóa ngành Than",
    "Sự chăm lo được duy trì sau dịp 27/7",
    "Đúng người, đúng nhu cầu mới là thước đo",
  ],
  "doan-thanh-nien-tkv-25-hoc-bong-thap-sang-uoc-mo": [
    "Hai triệu đồng có thể giữ nhịp đến trường cho một em nhỏ",
    "Tuổi trẻ TKV trao đi niềm tin vào nỗ lực học tập",
    "Sau suất học bổng là một hành trình cần được tiếp sức",
    "Minh bạch và đồng hành để ước mơ đi xa",
  ],
};

const supportFrameIndexes = {
  "tkv-ho-tro-5-ty-xoa-nha-tam-lam-dong": 0,
  "tkv-ung-ho-10-ty-khac-phuc-bao-bualoi": 1,
  "tkv-ho-tro-10-ty-mien-nui-phia-bac-mua-lu": 2,
  "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026": 0,
  "doan-thanh-nien-tkv-25-hoc-bong-thap-sang-uoc-mo": 1,
};

const supportEditorialLabels = {
  "tkv-ho-tro-5-ty-xoa-nha-tam-lam-dong": {
    facts: "5 tỷ đồng hướng tới những mái nhà an toàn",
    action: "Từ danh sách hộ đến chất lượng bàn giao",
    conclusion: "Một mái nhà bền là kết quả thuyết phục nhất",
  },
  "tkv-ung-ho-10-ty-khac-phuc-bao-bualoi": {
    facts: "10 tỷ đồng được trao qua đầu mối MTTQ Việt Nam",
    action: "Nguồn hỗ trợ cần đến sớm, đúng nơi",
    conclusion: "Khôi phục chỗ ở và sinh kế sau bão",
  },
  "tkv-ho-tro-10-ty-mien-nui-phia-bac-mua-lu": {
    facts: "Cao Bằng, Thái Nguyên nhận 3 tỷ; Lạng Sơn, Lào Cai nhận 2 tỷ",
    action: "Bảng phân bổ cần đi cùng tiến độ thực hiện",
    conclusion: "Sự hỗ trợ được đo bằng khả năng phục hồi",
  },
  "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026": {
    facts: "20 tỷ đồng cho chương trình tri ân toàn quốc",
    action: "Chăm lo đúng người, đúng nhu cầu",
    conclusion: "Tri ân cần được duy trì sau ngày 27/7",
  },
  "doan-thanh-nien-tkv-25-hoc-bong-thap-sang-uoc-mo": {
    facts: "25 suất học bổng, tổng trị giá 50 triệu đồng",
    action: "Giữ nhịp học tập sau ngày trao",
    conclusion: "Một suất học bổng mở thêm cơ hội đến trường",
  },
};

const supportActionCards = {
  "tkv-ho-tro-5-ty-xoa-nha-tam-lam-dong": [
    ["Một mái nhà an toàn", "Nguồn lực chỉ thật sự có giá trị khi giúp gia đình chống chọi tốt hơn với nắng mưa."],
    ["Đúng hộ cần hỗ trợ", "Địa phương rà soát công khai để ưu tiên gia đình có hoàn cảnh và nhu cầu cấp thiết."],
    ["Chất lượng sau bàn giao", "Công trình cần được nhìn bằng độ bền, khả năng sử dụng và sự ổn định của người ở."],
    ["Tình đồng bào", "Sự chung tay của TKV nối văn hóa người thợ với những gia đình còn khó khăn tại Lâm Đồng."],
  ],
  "tkv-ung-ho-10-ty-khac-phuc-bao-bualoi": [
    ["Đến sớm sau thiên tai", "Nguồn hỗ trợ kịp thời giúp địa phương giải quyết chỗ ở, nhu yếu phẩm và hạ tầng thiết yếu."],
    ["Đi qua đầu mối rõ", "Ủy ban Trung ương MTTQ Việt Nam tiếp nhận và điều phối tới những nơi thiệt hại nặng."],
    ["Phục hồi sinh kế", "Sau cứu trợ khẩn cấp là hành trình giúp gia đình sửa nhà và trở lại lao động sản xuất."],
    ["Đồng tâm trong gian khó", "Tập thể người thợ góp thêm sức mạnh để cộng đồng đứng dậy sau bão."],
  ],
  "tkv-ho-tro-10-ty-mien-nui-phia-bac-mua-lu": [
    ["Phân bổ có địa chỉ", "Cao Bằng, Thái Nguyên, Lạng Sơn và Lào Cai đều có mức hỗ trợ được công bố rõ."],
    ["Ưu tiên theo thiệt hại", "Nguồn lực khác nhau phản ánh nhu cầu và mức độ ảnh hưởng tại từng địa phương."],
    ["Theo đến kết quả", "Nhà ở, trường học, giao thông và sinh kế được phục hồi mới là thước đo cuối cùng."],
    ["Gắn vùng mỏ với quê hương", "Nhiều công nhân TKV đến từ miền núi phía Bắc; sự sẻ chia vì thế cũng là tình cảm với nơi họ sinh ra."],
  ],
  "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026": [
    ["Tri ân bằng hành động", "Cam kết 20 tỷ đồng đưa lòng biết ơn vào một chương trình có quy mô toàn quốc."],
    ["Chăm lo đúng nhu cầu", "Mỗi gia đình chính sách có hoàn cảnh khác nhau và cần hình thức hỗ trợ phù hợp."],
    ["Chăm lo trong cả năm", "Sự quan tâm bền vững được tạo nên bằng việc theo dõi và đồng hành thường xuyên."],
    ["Giữ gìn truyền thống", "Văn hóa ngành Than được bồi đắp từ kỷ luật lao động và đạo lý nhớ nguồn."],
  ],
  "doan-thanh-nien-tkv-25-hoc-bong-thap-sang-uoc-mo": [
    ["Giữ nhịp đến trường", "Một khoản hỗ trợ đúng lúc có thể giải quyết sách vở, đồng phục và chi phí đi lại."],
    ["Ghi nhận nỗ lực", "Học bổng nói với các em rằng sự cố gắng trong hoàn cảnh khó khăn luôn được nhìn thấy."],
    ["Tiếp sức dài hơn", "Kết nối nhà trường, gia đình và tổ chức Đoàn giúp sự đồng hành tiếp tục sau lễ trao."],
    ["Lan tỏa ước mơ", "Tuổi trẻ TKV mang tinh thần người thợ đến gần hơn với thế hệ học sinh hôm nay."],
  ],
};

const makeCommunitySupportStory = (item) => {
  const source = item.sources[0];
  const frameIndex = supportFrameIndexes[item.slug] ?? storyFrame(item.slug, supportStoryFrames.length);
  const narrative = supportStoryFrames[frameIndex](item, source);
  const headings = supportSectionHeadings[item.slug] || [];
  const labels = supportEditorialLabels[item.slug] || {
    facts: `Quy mô và phạm vi của ${supportProgram(item)}`,
    action: "Đầu mối, đối tượng và tiến độ cần được công khai",
    conclusion: `Thay đổi trong đời sống ${supportBeneficiary(item)} là thước đo cuối cùng`,
  };
  return {
    slug: item.slug,
    section: "An sinh xã hội",
    title: item.title,
    description: item.description,
    lead: item.lead,
    keyword: supportProgram(item),
    keywords: [supportProgram(item), item.keyword, "TKV an sinh xã hội", "TKV hỗ trợ cộng đồng", item.beneficiaryKeyword],
    image: item.image,
    imageAlt: item.imageAlt,
    imageSource: item.imageSource,
    facts: item.facts,
    related: item.related || ["san-xuat-sach-hon-nganh-than", "an-toan-mua-mua-bao-2026"],
    intro: item.intro || narrative.intro,
    sections: item.sections || narrative.sections.map((section, index) => ({...section, title: headings[index] || section.title})),
    factsTitle: item.factsTitle || labels.facts,
    actionTitle: item.actionTitle || labels.action,
    conclusionTitle: item.conclusionTitle || labels.conclusion,
    checklist: item.checklist || supportActionCards[item.slug] || [
      ["Đúng địa bàn", "Nguồn lực được xác định theo phạm vi và nhu cầu đã công bố."],
      ["Đúng đối tượng", `Chương trình hướng tới ${supportBeneficiary(item)} qua đầu mối chính thức.`],
      ["Đúng thời điểm", "Sự hỗ trợ đến sớm giúp cộng đồng rút ngắn thời gian phục hồi."],
      ["Đến cùng kết quả", "Giá trị được nhìn bằng thay đổi thực tế trong đời sống người thụ hưởng."],
    ],
    takeaway: item.takeaway,
    faq: item.faq || [
      ["Khoản hỗ trợ có được chia đều cho từng người không?", `Không. Thông tin về ${supportProgram(item)} nêu quy mô và đối tượng chung; mức đến từng trường hợp phụ thuộc phương án rà soát, phân bổ.`],
      ["Người dân liên hệ ở đâu để hỏi chương trình?", `${supportBeneficiary(item)} cần làm theo hướng dẫn của địa phương hoặc tổ chức được giao tiếp nhận, không gửi giấy tờ cho tài khoản mạng xã hội chưa xác minh.`],
      ["Thước đo quan trọng nhất của chương trình là gì?", `Ngoài số tiền cam kết, cần nhìn tiến độ triển khai và mức độ khó khăn thực tế đã được giải quyết cho ${supportBeneficiary(item)}.`],
    ],
    sources: item.sources,
    ...(item.published ? {published: item.published} : {}),
    ...(item.updated ? {updated: item.updated} : {}),
    ...(item.urlPath ? {urlPath: item.urlPath} : {}),
    ...(item.schemaType ? {schemaType: item.schemaType} : {}),
    ...(item.hideSourceUrlsInSchema ? {hideSourceUrlsInSchema: true} : {}),
    ...(item.suppressImageLabel ? {suppressImageLabel: true} : {}),
    ...(item.seoLine ? {seoLine: item.seoLine} : {}),
  };
};

const expandedStories = [
  makeLocalCooperationStory({
    slug: "binh-lieu-hop-tac-hoc-nghe-mo-viec-lam-tkv",
    title: "Bình Liêu đặt mục tiêu 60–70 lao động học nghề mỏ mỗi năm",
    description: "Bình Liêu, Trường Cao đẳng TKV và Than Khe Chàm phối hợp đào tạo nghề, giải quyết việc làm giai đoạn 2025–2030, mục tiêu 60–70 người/năm.",
    lead: "Từ 321 lao động được tuyển trong 5 năm, Bình Liêu bước vào giai đoạn hợp tác mới với mục tiêu đo được và doanh nghiệp tiếp nhận cụ thể.",
    keyword: "học nghề mỏ Bình Liêu",
    locality: "Bình Liêu",
    enterprise: "Công ty Than Khe Chàm – TKV",
    partners: "xã Bình Liêu, Trường Cao đẳng TKV và Công ty Than Khe Chàm – TKV",
    eventSummary: "Ngày 06/11/2025, ba bên ký quy chế phối hợp cho giai đoạn 2025–2030.",
    resultSummary: "Giai đoạn 2020–2025 có 321 người được tuyển, 289 người tốt nghiệp và nguồn công bố cho biết 100% số tốt nghiệp có việc làm ổn định.",
    evidence: "Nguồn của Nhà trường cho biết toàn xã có gần 300 lao động đang làm việc trong TKV và thu nhập bình quân của nhóm được báo cáo là 300–350 triệu đồng/năm.",
    opportunity: "Khoảng cách trong cùng tỉnh Quảng Ninh và cộng đồng người đi trước tạo điều kiện để thanh niên Bình Liêu kiểm chứng công việc thực tế.",
    caution: "Đề xuất về xe đưa đón, phúc lợi và chăm lo lao động xa nhà tại hội nghị là nội dung cần được xác nhận theo chính sách đang áp dụng.",
    target: "Giai đoạn mới đặt mục tiêu mỗi năm tuyển 60–70 lao động Bình Liêu học nghề và làm việc tại các đơn vị TKV.",
    focusTitle: "Gần 90% số người được tuyển đã đi hết khóa",
    focus: [
      "Trong 321 người được tuyển giai đoạn 2020–2025, có 289 người tốt nghiệp—tỷ lệ xấp xỉ 90%. Nguồn công bố cho biết toàn bộ số tốt nghiệp đã có việc làm ổn định; đây là dữ kiện mạnh hơn nhiều so với việc chỉ nêu số hồ sơ ban đầu.",
      "Bình Liêu còn có gần 300 lao động đang làm tại TKV. Một cộng đồng đủ lớn như vậy giúp người mới dễ tìm người để hỏi về doanh nghiệp, nhịp ca, khu ở và cách vượt qua thời gian đầu khi chưa quen môi trường công nghiệp.",
    ],
    facts: [["321 người", "Được tuyển học nghề trong giai đoạn 2020–2025."], ["289 người", "Đã tốt nghiệp theo báo cáo tại hội nghị."], ["60–70/năm", "Mục tiêu tuyển trong giai đoạn 2025–2030."], ["300–350 triệu", "Thu nhập bình quân năm của nhóm lao động được báo cáo."]],
    bullets: ["Tư vấn tiếp tục đưa tới thôn bản.", "Than Khe Chàm tham gia từ khâu phối hợp đến tiếp nhận.", "Người học được yêu cầu đáp ứng sức khỏe và chương trình đào tạo.", "Phúc lợi phải được xác nhận theo từng đợt."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_2360.jpg",
    imageAlt: "Hoạt động đào tạo và hợp tác của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Đào tạo công nhân khai thác than",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Trường Cao đẳng TKV và xã Bình Liêu ký quy chế phối hợp giai đoạn 2025–2030", date: "07/11/2025", url: "https://caodangtkv.edu.vn/truong-cao-dang-than-khoang-san-viet-nam-va-xa-binh-lieu-ky-quy-che-phoi-hop-giai-doan-2025-2030/"}],
  }),
  makeLocalCooperationStory({
    slug: "luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam",
    title: "Lục Hồn nối đào tạo nghề với việc làm tại Than Hạ Long",
    description: "Xã Lục Hồn, Trường Cao đẳng TKV và Than Hạ Long ký phối hợp đào tạo nghề, giải quyết việc làm giai đoạn 2025–2030, mục tiêu 60–70 người/năm.",
    lead: "Hơn một phần ba nguồn lao động của huyện Bình Liêu trong giai đoạn trước đến từ Lục Hồn, tạo nền tảng đáng tin cho kế hoạch mới.",
    keyword: "học nghề mỏ Lục Hồn",
    locality: "Lục Hồn",
    enterprise: "Công ty Than Hạ Long – TKV",
    partners: "xã Lục Hồn, Trường Cao đẳng TKV và Công ty Than Hạ Long – TKV",
    eventSummary: "Hội nghị ngày 30/07/2025 ký quy chế và kế hoạch liên tịch cho giai đoạn 2025–2030.",
    resultSummary: "Giai đoạn 2020–2025, 321 lao động Lục Hồn được tuyển chọn, đào tạo và bố trí làm việc trong ngành Than.",
    evidence: "Một số thôn như Phiêng Sáp, Ngàn Vàng Trên và Bản Pạt được nêu là các địa bàn vượt chỉ tiêu, cho thấy kết quả đã hiện diện ngay ở cấp thôn.",
    opportunity: "Người lao động Lục Hồn có thể hỏi trực tiếp những công nhân địa phương đang làm tại Than Hạ Long về ca làm, sinh hoạt và khả năng gắn bó.",
    caution: "Kết quả 321 người phản ánh cả quá trình nhiều năm; chỉ tiêu của từng thôn trong giai đoạn mới cần theo kế hoạch đang áp dụng.",
    target: "Kế hoạch mới phấn đấu mỗi năm giới thiệu 60–70 người Lục Hồn đi học và làm việc tại TKV.",
    focusTitle: "Ba thôn vượt chỉ tiêu và sức lan tỏa từ người đi trước",
    focus: [
      "Phiêng Sáp, Ngàn Vàng Trên và Bản Pạt được nêu tên trong báo cáo vì kết quả vượt chỉ tiêu. Khi thành quả hiện ra tới từng thôn, câu chuyện học nghề không còn xa lạ: người trẻ có thể gặp ngay người hàng xóm đã đi trước để hỏi điều kiện sống và làm việc.",
      "321 lao động Lục Hồn chiếm hơn một phần ba nguồn lao động được báo cáo của huyện Bình Liêu. Quy mô ấy cho thấy tuyển sinh hiệu quả thường lan theo mạng lưới tin cậy trong cộng đồng, từ một công nhân làm tốt tới anh em, bạn bè và lớp thanh niên kế tiếp.",
    ],
    facts: [["321 lao động", "Được đào tạo và bố trí việc làm giai đoạn 2020–2025."], ["Hơn 1/3", "Tỷ trọng trong nguồn lao động toàn huyện Bình Liêu được báo cáo."], ["2025–2030", "Giai đoạn thực hiện quy chế mới."], ["60–70/năm", "Mục tiêu giới thiệu lao động mỗi năm."]],
    bullets: ["Kết quả được ghi nhận tới cấp thôn.", "Người lao động đi trước tham gia chia sẻ thực tế.", "Ba bên ký cả quy chế và kế hoạch liên tịch.", "Hiệu quả cần đo tới bước nhận việc."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_2365.jpg",
    imageAlt: "Đại biểu TKV tại hoạt động ký kết đào tạo nghề",
    imageSource: "Thư viện ảnh Vinacomin · Hợp tác đào tạo công nhân",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Tăng cường phối hợp, mở rộng cơ hội việc làm cho lao động vùng cao tại xã Lục Hồn", date: "31/07/2025", url: "https://caodangtkv.edu.vn/tang-cuong-phoi-hop-mo-rong-co-hoi-viec-lam-cho-lao-dong-vung-cao-truong-cao-dang-than-khoang-san-viet-nam-ky-ket-quy-che-phoi-hop-voi-xa-luc-hon-va-cong-ty-than-ha-long-tkv/"}],
  }),
  makeLocalCooperationStory({
    slug: "vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv",
    title: "Vị Xuyên mở rộng tuyến học nghề mỏ, việc làm TKV 2025–2030",
    description: "Huyện Vị Xuyên và Trường Cao đẳng TKV ký phối hợp đào tạo nghề, giải quyết việc làm giai đoạn 2025–2030, mục tiêu 60–80 lao động mỗi năm.",
    lead: "Dữ liệu 211 lao động Vị Xuyên trong 5 năm giúp gia đình nhìn thấy một tuyến học nghề, nhận việc đã có người đi trước kiểm chứng.",
    keyword: "học nghề mỏ Vị Xuyên",
    locality: "Vị Xuyên, Hà Giang",
    enterprise: "các doanh nghiệp mỏ hầm lò thuộc TKV",
    partners: "Huyện ủy Vị Xuyên, Trường Cao đẳng TKV và các doanh nghiệp thuộc TKV",
    eventSummary: "Hai bên ký quy chế ngày 18/01/2025, xác lập giai đoạn hợp tác 2025–2030.",
    resultSummary: "Từ năm 2020 đến hết 2024, huyện Vị Xuyên có 211 lao động thuộc nhóm đã tốt nghiệp, đang học hoặc đang làm việc theo thống kê của Nhà trường.",
    evidence: "Nguồn công bố đồng thời nêu 2.046 lao động trên phạm vi tỉnh Hà Giang và mức thu nhập 250 đến trên 300 triệu đồng/năm ở các trường hợp được báo cáo.",
    opportunity: "Các gương công nhân Vị Xuyên tại Than Hà Lầm và Than Núi Béo là điểm tựa kiểm chứng về con đường từ học nghề tới tổ đội sản xuất.",
    caution: "Số liệu 2.046 thuộc phạm vi toàn tỉnh Hà Giang, còn Vị Xuyên là 211; hai con số cần được trình bày theo đúng địa bàn.",
    target: "Quy chế đặt mục tiêu mỗi năm tuyển 60–80 lao động Vị Xuyên đi học nghề và làm việc tại TKV.",
    focusTitle: "211 người của Vị Xuyên trong bức tranh 2.046 lao động Hà Giang",
    focus: [
      "Báo cáo tách rõ hai phạm vi: 211 lao động thuộc Vị Xuyên và 2.046 người trên toàn tỉnh Hà Giang. Đọc đúng hai lớp số liệu giúp gia đình thấy quy mô của phong trào nhưng vẫn biết kết quả cụ thể tại chính địa phương mình.",
      "Những công nhân Vị Xuyên đang làm tại Than Hà Lầm, Than Núi Béo là cầu nối đáng giá. Họ có thể kể chi tiết hơn bất kỳ tờ quảng cáo nào về công việc trong tổ đội, khoản thu nhập theo ngày công và sự thay đổi của bản thân sau vài năm giữ nghề.",
    ],
    facts: [["211 lao động", "Quy mô Vị Xuyên được báo cáo giai đoạn 2020–2024."], ["2.046 người", "Số liệu trên phạm vi tỉnh Hà Giang trong cùng báo cáo."], ["60–80/năm", "Mục tiêu tuyển của huyện trong giai đoạn mới."], ["2025–2030", "Thời hạn quy chế phối hợp."]],
    bullets: ["Số liệu được tách theo huyện và toàn tỉnh.", "Công nhân điển hình được nêu làm trường hợp kiểm chứng.", "Đào tạo gắn với doanh nghiệp TKV.", "Thu nhập được đối chiếu theo vị trí và kết quả lao động."],
    image: "https://thaylinhtuyenthomo.vn/assets/vinacomin-hoc-vien-quang-hanh-ao-xanh-doi-mu.webp",
    imageAlt: "Nhóm học viên nghề mỏ mặc bảo hộ xanh, đội mũ tại khu thực hành Than Quang Hanh",
    imageSource: "Ảnh bài Than Quang Hanh và Trường Cao đẳng TKV gắn đào tạo với sản xuất thực tế · Vinacomin",
    imageOriginal: "https://vinacomin.vn/userfiles/thumbnail/57BB424168D1C221B317CB93B441C55399D6311407D0261B3F299228DEB3B247.jpg",
    imageLocalFile: "../vinacomin-hoc-vien-quang-hanh-ao-xanh-doi-mu.webp",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Ký kết phối hợp đào tạo nghề và giải quyết việc làm cho lao động huyện Vị Xuyên giai đoạn 2025–2030", date: "20/01/2025", url: "https://caodangtkv.edu.vn/dang-uy-truong-cao-dang-than-khoang-san-viet-nam-ky-ket-quy-che-phoi-hop-ve-dao-tao-nghe-va-giai-quyet-viec-lam-cho-lao-dong-huyen-vi-xuyen-ha-giang-giai-doan-2025-2030/"}],
  }),
  makeLocalCooperationStory({
    slug: "hoanh-mo-xay-lap-mo-dao-tao-nghe-viec-lam",
    title: "Hoành Mô đặt mục tiêu trên 40 lao động học nghề mỏ mỗi năm",
    description: "Xã Hoành Mô, Trường Cao đẳng TKV và Công ty Xây lắp mỏ ký phối hợp đào tạo nghề, giải quyết việc làm 2026–2030, mục tiêu từ 40 người/năm.",
    lead: "Từ 33 hội nghị và 152 người tốt nghiệp có việc làm, Hoành Mô chuyển sang giai đoạn phối hợp mới với mục tiêu tuyển rõ ràng.",
    keyword: "học nghề mỏ Hoành Mô",
    locality: "Hoành Mô",
    enterprise: "Công ty Xây lắp mỏ – TKV",
    partners: "xã Hoành Mô, Trường Cao đẳng TKV và Công ty Xây lắp mỏ – TKV",
    eventSummary: "Ngày 24/12/2025, ba bên ký quy chế về đào tạo nghề gắn với giải quyết việc làm giai đoạn 2026–2030.",
    resultSummary: "Trong 2020–2025, địa phương tổ chức 33 hội nghị cho gần 1.000 lượt lao động; 165 người đi học và 152 người tốt nghiệp, được bố trí việc làm.",
    evidence: "Chuỗi số liệu từ người được tư vấn đến người tốt nghiệp cho phép nhìn thấy đầy đủ độ chuyển đổi của chương trình Hoành Mô.",
    opportunity: "Sự tham gia của Công ty Xây lắp mỏ mở thêm góc nhìn về nghề xây dựng mỏ bên cạnh khai thác hầm lò truyền thống.",
    caution: "Người đăng ký Hoành Mô cần hỏi rõ nghề nào đang mở và đơn vị nào tiếp nhận, vì học nghề mỏ không đồng nghĩa mọi người làm cùng một công việc.",
    target: "Giai đoạn 2026–2030 phấn đấu tuyển từ 40 lao động Hoành Mô trở lên mỗi năm.",
    focusTitle: "152 người đã đi từ buổi tư vấn tới việc làm",
    focus: [
      "Hoành Mô có một chuỗi số liệu khá đầy đủ: 33 hội nghị thu hút gần 1.000 lượt người, 165 người vào học và 152 người tốt nghiệp, được bố trí việc làm. Khoảng cách từ người nhập học tới người hoàn thành khóa vì thế có thể nhìn thấy rõ.",
      "Sự tham gia của Công ty Xây lắp mỏ còn mở ra cách hiểu rộng hơn về ngành. Bên cạnh khai thác than, doanh nghiệp cần những người làm công việc đào, xây dựng và chuẩn bị hạ tầng mỏ—mỗi vị trí có yêu cầu kỹ thuật và lộ trình tay nghề riêng.",
    ],
    facts: [["33 hội nghị", "Được tổ chức trong giai đoạn 2020–2025."], ["165 người", "Đã tham gia học nghề tại Nhà trường."], ["152 người", "Tốt nghiệp và được bố trí việc làm."], ["Từ 40/năm", "Mục tiêu của giai đoạn mới."]],
    bullets: ["Đo được cả tư vấn, nhập học và tốt nghiệp.", "Doanh nghiệp xây lắp mỏ tham gia ký ba bên.", "Mục tiêu mới bắt đầu từ năm 2026.", "Người học cần xác nhận đúng nghề và vị trí."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_4084.jpg",
    imageAlt: "Công nhân ngành Than trong hoạt động của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Chăm lo công nhân ngành Than",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Hội nghị ký Quy chế phối hợp đào tạo nghề và giải quyết việc làm cho người lao động xã Hoành Mô", date: "25/12/2025", url: "https://caodangtkv.edu.vn/hoi-nghi-ky-quy-che-phoi-hop-dao-tao-nghe-va-giai-quyet-viec-lam-cho-nguoi-lao-dong-xa-hoanh-mo-giai-doan-2026-2030/"}],
  }),
  makeLocalCooperationStory({
    slug: "si-lo-lau-khun-ha-lai-chau-hoc-nghe-mo",
    title: "Sì Lở Lầu, Khun Há kết nối thanh niên vùng cao với nghề mỏ",
    description: "Hai xã Sì Lở Lầu, Khun Há tại Lai Châu phối hợp Trường Cao đẳng TKV và Than Thống Nhất tuyển sinh, đào tạo nghề, giải quyết việc làm.",
    lead: "Kết quả vượt chỉ tiêu tại Phong Thổ và Tam Đường tạo nền tảng cho hai xã vùng cao tiếp tục đưa thanh niên học nghề, làm việc tại TKV.",
    keyword: "học nghề mỏ Lai Châu",
    locality: "Sì Lở Lầu và Khun Há, Lai Châu",
    enterprise: "Công ty Than Thống Nhất – TKV",
    partners: "hai xã Sì Lở Lầu, Khun Há, Trường Cao đẳng TKV và Công ty Than Thống Nhất – TKV",
    eventSummary: "Trong hai ngày 25–26/09/2025, các bên ký quy chế tuyển sinh, đào tạo nghề và giải quyết việc làm.",
    resultSummary: "Giai đoạn 2021–2025, Phong Thổ tuyển 297 lao động, đạt 123% chỉ tiêu; Tam Đường có 168 học sinh nhập học, đạt 112% chỉ tiêu.",
    evidence: "Riêng Sì Lở Lầu được báo cáo có 165 học viên theo học, còn Khun Há nhận bằng khen và phần thưởng 25 triệu đồng vì kết quả phối hợp.",
    opportunity: "Thanh niên dân tộc thiểu số được tiếp cận thông tin ngay tại xã và có thể nghe kinh nghiệm từ người địa phương đã đi học, đi làm.",
    caution: "Chính sách đang áp dụng miễn phí ba bữa/ngày với mức ăn 90.000 đồng/ngày và cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.",
    target: "Quy chế mới hướng tới duy trì nguồn học nghề và việc làm ổn định, nhưng bài nguồn không nêu một chỉ tiêu năm chung cho cả hai xã.",
    focusTitle: "165 học viên từ một xã vùng cao",
    focus: [
      "Riêng Sì Lở Lầu được báo cáo có 165 học viên theo học; ở quy mô huyện, Phong Thổ đạt 297 lao động, tương đương 123% chỉ tiêu. Những con số ấy cho thấy khoảng cách địa lý không ngăn được một cộng đồng hình thành quanh con đường học nghề mỏ.",
      "Khun Há được ghi nhận bằng khen cùng phần thưởng 25 triệu đồng vì kết quả phối hợp. Sự ghi nhận dành cho địa phương nhấn mạnh một thực tế: để người trẻ vùng cao đi học và bám nghề, cần cả cán bộ cơ sở, gia đình và người lao động đi trước cùng tham gia.",
    ],
    facts: [["297 lao động", "Kết quả tuyển tại Phong Thổ giai đoạn 2021–2025."], ["123%", "Tỷ lệ hoàn thành chỉ tiêu của Phong Thổ."], ["168 học sinh", "Số nhập học được báo cáo tại Tam Đường."], ["165 học viên", "Quy mô riêng của xã Sì Lở Lầu."]],
    bullets: ["Hai xã ký quy chế cùng doanh nghiệp sử dụng lao động.", "Kết quả được đối chiếu theo huyện và theo xã.", "Có người lao động điển hình chia sẻ.", "Chính sách cần xác nhận lại theo thời điểm đăng ký."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5727.jpg",
    imageAlt: "Hoạt động sản xuất và đào tạo tại TKV",
    imageSource: "Thư viện ảnh Vinacomin · Ứng dụng công nghệ trong sản xuất",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Nâng tầm chất lượng nguồn nhân lực, thắp sáng tương lai lao động vùng cao Tây Bắc", date: "27/09/2025", url: "https://caodangtkv.edu.vn/nang-tam-chat-luong-nguon-nhan-luc-thap-sang-tuong-lai-lao-dong-vung-cao-tay-bac/"}],
  }),
  makeLocalCooperationStory({
    slug: "tinh-doan-lai-chau-ket-noi-viec-lam-tkv",
    title: "Tỉnh Đoàn Lai Châu kết nối 300–400 thanh niên với nghề mỏ",
    description: "Tỉnh Đoàn Lai Châu, Đoàn Thanh niên TKV và Trường Cao đẳng TKV thống nhất tăng phối hợp tuyển chọn, đào tạo nghề, tạo việc làm cho thanh niên.",
    lead: "Gần 1.500 thanh niên Lai Châu đã tốt nghiệp và làm việc tại TKV từ năm 2015, tạo dữ liệu nền cho kế hoạch ưu tiên nguồn tuyển mới.",
    keyword: "việc làm TKV cho thanh niên Lai Châu",
    locality: "tỉnh Lai Châu",
    enterprise: "các doanh nghiệp thuộc TKV",
    partners: "Tỉnh Đoàn Lai Châu, Đoàn Thanh niên TKV và Trường Cao đẳng TKV",
    eventSummary: "Buổi làm việc ngày 24/05/2025 thống nhất hướng tới văn bản hợp tác ba bên về đào tạo nghề và việc làm.",
    resultSummary: "Từ năm 2015 đến thời điểm bài đăng, gần 1.500 thanh niên Lai Châu đã tốt nghiệp đào tạo nghề và vào làm việc tại các đơn vị TKV.",
    evidence: "Kế hoạch năm 2025 của Nhà trường dành ưu tiên tuyển 300–400 thanh niên Lai Châu trong tổng quy mô đào tạo nghề được giao.",
    opportunity: "Mạng lưới Đoàn có khả năng đưa thông tin tới thanh niên chưa có việc làm ở vùng sâu, đồng thời hỗ trợ theo dõi quá trình chuẩn bị đi học xa.",
    caution: "Con số 300–400 thuộc kế hoạch năm 2025; chỉ tiêu của các năm sau cần theo thông báo mới nhất.",
    target: "Ba bên thống nhất tăng tuyên truyền, bảo đảm chất lượng đào tạo, đời sống học viên và môi trường việc làm an toàn.",
    focusTitle: "Gần 1.500 thanh niên Lai Châu đã tạo nên một cộng đồng nghề",
    focus: [
      "Thống kê từ năm 2015 đến thời điểm công bố ghi nhận gần 1.500 thanh niên Lai Châu đã tốt nghiệp và làm việc tại TKV. Đây không còn là vài trường hợp riêng lẻ, mà là một cộng đồng đủ lớn để người sau kiểm chứng nghề bằng trải nghiệm của người trước.",
      "Mục tiêu ưu tiên 300–400 người thuộc kế hoạch năm 2025 cho thấy nhu cầu từng được đặt ở quy mô đáng kể. Vai trò của Tỉnh Đoàn kéo dài từ truyền thông tại vùng sâu đến đồng hành trong giai đoạn chuẩn bị hồ sơ và nhập học.",
    ],
    facts: [["Gần 1.500", "Thanh niên Lai Châu đã tốt nghiệp và làm việc tại TKV từ 2015."], ["300–400", "Nguồn tuyển được ưu tiên trong kế hoạch năm 2025."], ["3 bên", "Tỉnh Đoàn, Đoàn TKV và Nhà trường cùng phối hợp."], ["Từ 2015", "Mốc thống kê kết quả được bài nguồn sử dụng."]],
    bullets: ["Hệ thống Đoàn tham gia vận động thanh niên.", "Nhà trường phụ trách đào tạo và đời sống học viên.", "Doanh nghiệp chịu trách nhiệm về môi trường làm việc.", "Chỉ tiêu cũ không thay thế thông báo tuyển mới."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5755.jpg",
    imageAlt: "Thanh niên và người lao động trong hoạt động TKV",
    imageSource: "Thư viện ảnh Vinacomin · Công nghệ và nguồn nhân lực TKV",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Thắt chặt phối hợp – Mở rộng cơ hội việc làm cho thanh niên Lai Châu", date: "25/05/2025", url: "https://caodangtkv.edu.vn/that-chat-phoi-hop-mo-rong-co-hoi-viec-lam-cho-thanh-nien-lai-chau/"}],
  }),
  makeLocalCooperationStory({
    slug: "bao-lac-cao-bang-tu-van-hoc-nghe-mo",
    title: "Bảo Lạc đưa tư vấn học nghề mỏ đến từng xã, từng thôn",
    seoTitle: "Học nghề mỏ Bảo Lạc: tư vấn tại xã, thôn",
    description: "Huyện Bảo Lạc phối hợp Trường Cao đẳng TKV tư vấn học nghề, giải quyết việc làm; kế hoạch 2025 đặt mục tiêu trên 60 học sinh toàn huyện.",
    lead: "Từ 144 lượt tư vấn trong quý I/2025, Bảo Lạc xác định cách làm sát cơ sở: trở lại xã, thôn khi người lao động cần được hướng dẫn.",
    keyword: "học nghề mỏ Bảo Lạc",
    locality: "Bảo Lạc, Cao Bằng",
    enterprise: "các doanh nghiệp thuộc TKV",
    partners: "UBND xã Hưng Đạo, cơ quan huyện Bảo Lạc và Trường Cao đẳng TKV",
    eventSummary: "Ngày 19/04/2025, đoàn xã Hưng Đạo làm việc tại Phân hiệu Hoành Bồ để đánh giá quý I và thống nhất nhiệm vụ còn lại của năm.",
    resultSummary: "Ba tháng đầu năm có 144 lượt người được tư vấn, 9 bộ hồ sơ được phát cho người đăng ký trực tiếp và 4 người đang học tại Nhà trường.",
    evidence: "Việc công bố đồng thời số người tư vấn, số hồ sơ và số người đang học giúp nhìn rõ khoảng cách giữa quan tâm ban đầu và quyết định nhập học.",
    opportunity: "Đưa cán bộ tuyển sinh trở lại xã, thôn theo yêu cầu là cách phù hợp với địa bàn miền núi, nơi chi phí di chuyển và khoảng cách thông tin còn lớn.",
    caution: "Chỉ tiêu tối thiểu 3 người mỗi xã hoặc thị trấn là mục tiêu vận động của năm 2025; từng hồ sơ vẫn được đánh giá theo điều kiện tuyển sinh.",
    target: "Kế hoạch năm 2025 phấn đấu toàn huyện Bảo Lạc có trên 60 học sinh đi học và làm việc tại TKV.",
    focusTitle: "Khoảng cách từ 144 lượt tư vấn tới 4 người đang học",
    focus: [
      "Quý I/2025 có 144 lượt người được tư vấn, 9 bộ hồ sơ được phát và 4 người đang học. Chuỗi số liệu nhỏ nhưng trung thực này cho thấy mỗi bước chuyển đổi đều cần thời gian: quan tâm chưa đồng nghĩa sẵn sàng rời quê đi học.",
      "Với Bảo Lạc, giải pháp được nhấn mạnh là đưa cán bộ trở lại xã, thôn khi người dân cần hỏi thêm. Một cuộc trò chuyện tại cơ sở giúp tháo gỡ những băn khoăn về sức khỏe, chi phí đi lại, nơi ở và việc làm sau khóa học.",
    ],
    facts: [["144 lượt", "Được tư vấn trong quý I/2025."], ["9 hồ sơ", "Được phát cho lao động đăng ký trực tiếp."], ["4 người", "Đang học tại Nhà trường ở thời điểm báo cáo."], ["Trên 60", "Mục tiêu học sinh toàn huyện trong năm 2025."]],
    bullets: ["Theo dõi chuyển đổi từ tư vấn đến nhập học.", "Cán bộ có thể trở lại thôn khi có yêu cầu.", "Mỗi xã được khuyến khích giới thiệu nguồn phù hợp.", "Chỉ tiêu năm 2025 không thay thế kế hoạch hiện hành."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5759.jpg",
    imageAlt: "Cán bộ kỹ thuật trong hoạt động của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Sản xuất và quản lý TKV",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Đoàn công tác UBND xã Hưng Đạo, huyện Bảo Lạc đến thăm và làm việc với Nhà trường", date: "21/04/2025", url: "https://caodangtkv.edu.vn/doan-cong-tac-ubnd-xa-hung-dao-huyen-bao-lac-tinh-cao-bang-den-tham-va-lam-viec-voi-truong-cao-dang-than-khoang-san-viet-nam/"}],
  }),
  makeLocalCooperationStory({
    slug: "luong-minh-quang-tan-ky-ket-dao-tao-viec-lam",
    title: "Lương Minh, Quảng Tân ký phối hợp ba bên về nghề mỏ",
    description: "Lương Minh, Quảng Tân cùng Trường Cao đẳng TKV, Than Hòn Gai và Than Quang Hanh ký phối hợp đào tạo nghề, giải quyết việc làm 2026–2030.",
    lead: "Hai địa phương cùng doanh nghiệp ngành Than tạo một chuỗi từ tuyên truyền tại hộ gia đình đến thực hành, tiếp nhận việc làm sau đào tạo.",
    keyword: "đào tạo nghề mỏ Lương Minh Quảng Tân",
    locality: "Lương Minh và Quảng Tân",
    enterprise: "Than Hòn Gai – TKV và Than Quang Hanh – TKV",
    partners: "hai xã Lương Minh, Quảng Tân, Trường Cao đẳng TKV, Than Hòn Gai và Than Quang Hanh",
    eventSummary: "Các hội nghị ngày 20 và 22/01/2026 ký quy chế phối hợp cho giai đoạn 2026–2030.",
    resultSummary: "Nguồn cho biết mỗi địa phương từng tổ chức trên 30 hội nghị cho gần 1.000 lượt lao động và đã có hàng trăm người đi học, có việc làm.",
    evidence: "Bài nguồn còn nêu các công trình hỗ trợ địa phương như trung tâm học tập cộng đồng và trung tâm văn hóa thể thao, cho thấy quan hệ hợp tác đã mở rộng sang lĩnh vực cộng đồng.",
    opportunity: "Hai doanh nghiệp tham gia giúp người lao động có thêm thông tin về thực hành, vị trí dự kiến và môi trường sản xuất khác nhau.",
    caution: "Các cụm 'gần 1.000' và 'hàng trăm' là cách báo cáo theo từng địa phương nhưng chưa có bảng chi tiết; bài viết không tự suy diễn con số chính xác.",
    target: "Giai đoạn 2026–2030 đặt trọng tâm đưa thông tin tới từng hộ, rèn tác phong công nghiệp và bố trí việc làm sau đào tạo.",
    focusTitle: "Hợp tác đi xa hơn một đợt tuyển người",
    focus: [
      "Các công trình như trung tâm học tập cộng đồng và trung tâm văn hóa thể thao được nhắc cùng hoạt động tuyển sinh. Chi tiết ấy cho thấy quan hệ giữa ngành Than với Lương Minh, Quảng Tân được xây bằng cả cơ hội việc làm và những giá trị cộng đồng.",
      "Than Hòn Gai và Than Quang Hanh cùng tham gia giúp người lao động tiếp cận hai môi trường doanh nghiệp ngay từ khâu tư vấn. Việc so sánh nghề thực hành, nơi dự kiến bố trí và chế độ của từng đơn vị sẽ giúp lựa chọn phù hợp hơn.",
    ],
    facts: [["2 xã", "Lương Minh và Quảng Tân cùng ký trong tháng 01/2026."], ["Trên 30", "Số hội nghị từng tổ chức tại mỗi địa phương."], ["Gần 1.000 lượt", "Quy mô người được tư vấn tại mỗi nơi theo nguồn."], ["2026–2030", "Giai đoạn phối hợp mới."]],
    bullets: ["Nhà trường là trung tâm đào tạo.", "Địa phương vận động tới hộ gia đình.", "Doanh nghiệp tham gia thực hành và tiếp nhận.", "Số liệu khái quát không bị làm tròn thành con số giả."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5769.jpg",
    imageAlt: "Hoạt động phối hợp và quản lý sản xuất của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Tự động hóa trong TKV",
    sources: [{publisher: "Trường Cao đẳng Than – Khoáng sản Việt Nam", title: "Ký kết Quy chế phối hợp ba bên: Gắn đào tạo nghề với giải quyết việc làm bền vững", date: "23/01/2026", url: "https://caodangtkv.edu.vn/ky-ket-quy-che-phoi-hop-ba-ben-gan-dao-tao-nghe-voi-giai-quyet-viec-lam-ben-vung-cho-lao-dong-dia-phuong/"}],
  }),
  makeLocalCooperationStory({
    slug: "duong-thuong-tuyen-quang-than-quang-hanh-tuyen-nghe-mo",
    title: "Than Quang Hanh tư vấn nghề mỏ tại 20 thôn xã Đường Thượng",
    description: "Than Quang Hanh và Trường Cao đẳng TKV đưa tư vấn nghề khai thác, đào lò, cơ điện hầm lò đến 20 thôn xã Đường Thượng, Tuyên Quang.",
    lead: "Đi từng thôn giúp người lao động Đường Thượng hỏi trực tiếp về nghề học, nơi làm việc, chế độ và yêu cầu trước khi quyết định đi xa.",
    keyword: "tuyển sinh nghề mỏ Đường Thượng",
    locality: "Đường Thượng, Tuyên Quang",
    enterprise: "Công ty Than Quang Hanh – TKV",
    partners: "xã Đường Thượng, Trường Cao đẳng TKV và Công ty Than Quang Hanh – TKV",
    eventSummary: "Trong hai ngày 07–08/08/2025, đoàn công tác triển khai chương trình tại 20 thôn của xã.",
    resultSummary: "Chương trình giới thiệu ba nhóm nghề khai thác hầm lò, đào lò và cơ điện hầm lò, đồng thời trao đổi trực tiếp với lãnh đạo thôn và người dân.",
    evidence: "Nguồn liệt kê cả các thôn tiếp tục được tư vấn, cho thấy hoạt động được tổ chức thành một hành trình đi sâu tới cơ sở.",
    opportunity: "Người lao động Đường Thượng có thể so sánh ba nhóm nghề để chọn hướng phù hợp hơn với sức khỏe, khả năng học kỹ thuật và nhu cầu doanh nghiệp.",
    caution: "Khoảng thu nhập 20–30 triệu đồng/tháng trong nguồn thay đổi theo vị trí; mức của người mới cần đối chiếu đúng nghề và đợt tuyển.",
    target: "Mục tiêu của chuỗi tư vấn là mở rộng tiếp cận việc làm bền vững và giúp thanh niên xác định nghề nghiệp trước khi đăng ký.",
    focusTitle: "Ba nhóm nghề để người trẻ lựa chọn",
    focus: [
      "Đợt tư vấn giới thiệu khai thác hầm lò, đào lò và cơ điện hầm lò. Ba nhóm nghề cho người lao động một điểm xuất phát rõ: người có sức bền, người thích công việc tạo đường lò và người có thiên hướng máy móc có thể đặt những câu hỏi khác nhau.",
      "Việc đi qua 20 thôn trong hai ngày đưa cuộc tư vấn đến gần từng gia đình. Ở đó, câu chuyện nghề có thể bắt đầu bằng những điều rất cụ thể—một ca kéo dài ra sao, công việc dùng thiết bị gì và người mới được kèm cặp thế nào.",
    ],
    facts: [["20 thôn", "Phạm vi chương trình tư vấn tại xã Đường Thượng."], ["2 ngày", "Thời gian đoàn triển khai đợt làm việc."], ["3 nhóm nghề", "Khai thác, đào lò và cơ điện hầm lò."], ["20–30 triệu", "Khoảng thu nhập theo vị trí được bài nguồn nêu."]],
    bullets: ["Tư vấn tới tận thôn bản.", "Giới thiệu cụ thể ba nhóm nghề.", "Doanh nghiệp nói rõ điều kiện làm việc và phúc lợi.", "Thu nhập phải đọc cùng vị trí và ngày công."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5778.jpg",
    imageAlt: "Công nhân và cán bộ TKV tại cơ sở sản xuất",
    imageSource: "Thư viện ảnh Vinacomin · Quản lý sản xuất TKV",
    sources: [{publisher: "TKV", title: "Công ty Than Quang Hanh – TKV phối hợp tuyển sinh nghề mỏ hầm lò tại xã Đường Thượng", date: "11/08/2025", url: "https://vinacomin.vn/news/slug/cong-ty-than-quang-hanh-tkv-phoi-hop-tuyen-sinh-nghe-mo-ham-lo-tai-xa-duong-thuong-tinh-tuyen-quang"}, {publisher: "Công đoàn TKV", title: "Công ty Than Quang Hanh phối hợp tư vấn tuyển sinh nghề mỏ hầm lò tại xã Đường Thượng", date: "10/08/2025", url: "https://congdoantkv.vn/tin-tuc/chi-tiet/44142/Cong-ty-than-Quang-Hanh-Phoi-hop-tu-van-tuyen-sinh-nghe-mo-ham-lo-tai-xa-%C4%90uong-Thuong-tinh-Tuyen-Quang"}],
  }),
  makeLocalCooperationStory({
    slug: "than-thong-nhat-tuyen-sinh-nghe-mo-lai-chau-2026",
    title: "Than Thống Nhất mở đợt tư vấn nghề mỏ tại Lai Châu năm 2026",
    description: "Than Thống Nhất phối hợp Trường Cao đẳng TKV tư vấn tuyển sinh, đào tạo nghề mỏ tại Lai Châu từ ngày 22–28/02/2026, kết nối việc làm.",
    lead: "Một tuần làm việc tại địa bàn giúp doanh nghiệp và Nhà trường tiếp cận trực tiếp nguồn lao động, đồng thời giải đáp các câu hỏi trước khi đăng ký.",
    keyword: "tuyển sinh nghề mỏ Lai Châu 2026",
    locality: "Lai Châu",
    enterprise: "Công ty Than Thống Nhất – TKV",
    partners: "các địa phương Lai Châu, Trường Cao đẳng TKV và Công ty Than Thống Nhất – TKV",
    eventSummary: "Đoàn công tác triển khai từ ngày 22 đến 28/02/2026 theo thông tin công bố của TKV.",
    resultSummary: "Đợt làm việc tiếp nối các chương trình tuyển sinh của Than Thống Nhất tại Lai Châu và tập trung vào tư vấn nghề, đào tạo, cơ hội việc làm.",
    evidence: "Việc dành trọn một tuần cho địa bàn cho phép đoàn gặp nhiều nhóm lao động và xử lý câu hỏi cụ thể hơn so với hình thức chỉ phát thông báo trực tuyến.",
    opportunity: "Lai Châu đã có cộng đồng lao động làm việc trong TKV, vì vậy người đăng ký có thể tìm hiểu thêm từ trường hợp thực tế trước khi chọn nghề.",
    caution: "Bài nguồn không cung cấp đầy đủ chỉ tiêu và kết quả từng điểm tư vấn; bài viết chỉ sử dụng dữ kiện đã xác minh, không tự bổ sung số hồ sơ.",
    target: "Đợt tư vấn hướng tới bổ sung nguồn nhân lực nghề mỏ cho Than Thống Nhất và mở thêm cơ hội việc làm cho lao động địa phương.",
    focusTitle: "Vì sao một tuần làm việc tại địa bàn có ý nghĩa?",
    focus: [
      "Từ ngày 22 đến 28/02/2026, đoàn công tác dành trọn một tuần tại Lai Châu. Khoảng thời gian ấy cho phép doanh nghiệp và Nhà trường tiếp cận nhiều nhóm lao động, nghe câu hỏi trực tiếp và giải thích kỹ hơn so với một thông báo phát trên mạng.",
      "Nguồn công bố chưa nêu chỉ tiêu hay số hồ sơ tại từng điểm, vì vậy giá trị rõ nhất của đợt làm việc nằm ở chất lượng tiếp xúc. Người đăng ký có cơ hội hỏi về nghề, đào tạo và nơi làm việc trước khi quyết định chuẩn bị hồ sơ.",
    ],
    facts: [["7 ngày", "Thời gian triển khai từ 22 đến 28/02/2026."], ["3 bên", "Địa phương, Nhà trường và doanh nghiệp cùng tham gia."], ["Năm 2026", "Đợt tư vấn mới nhất được rà soát."], ["Lai Châu", "Địa bàn trọng tâm của chương trình."]],
    bullets: ["Doanh nghiệp trực tiếp tham gia tư vấn.", "Thông tin học nghề gắn với vị trí việc làm.", "Người dân có thời gian hỏi và đối chiếu.", "Không suy diễn chỉ tiêu khi nguồn chưa công bố."],
    image: "https://vinacomin.vn/Share/Media/2018/07/IMG_5786.jpg",
    imageAlt: "Người lao động TKV trong môi trường sản xuất",
    imageSource: "Thư viện ảnh Vinacomin · Sản xuất và tự động hóa",
    sources: [{publisher: "TKV", title: "Than Thống Nhất phối hợp tư vấn tuyển sinh đào tạo nghề mỏ tại tỉnh Lai Châu", date: "04/03/2026", url: "https://vinacomin.vn/news/slug/than-thong-nhat-phoi-hop-tu-van-tuyen-sinh-dao-tao-nghe-mo-tai-tinh-lai-chau"}],
  }),
  makeCommunitySupportStory({
    slug: "tkv-ho-tro-5-ty-xoa-nha-tam-lam-dong",
    title: "TKV hỗ trợ 5 tỷ đồng xóa nhà tạm, nhà dột nát tại Lâm Đồng",
    description: "TKV hỗ trợ 5 tỷ đồng cho chương trình xóa nhà tạm, nhà dột nát tại Lâm Đồng, góp phần giúp hộ khó khăn ổn định chỗ ở và cuộc sống.",
    lead: "Nguồn lực được trao qua chương trình cấp tỉnh, hướng tới biến hỗ trợ một lần thành mái nhà an toàn và nền tảng ổn định cho gia đình khó khăn.",
    keyword: "TKV hỗ trợ xóa nhà tạm Lâm Đồng",
    beneficiaryKeyword: "hộ khó khăn về nhà ở tại Lâm Đồng",
    programLabel: "gói hỗ trợ 5 tỷ đồng xóa nhà tạm tại Lâm Đồng",
    beneficiaryLabel: "các hộ khó khăn về nhà ở tại Lâm Đồng",
    eventSummary: "Ngày 25/08/2024, tại chương trình phát động của tỉnh Lâm Đồng, TKV công bố mức hỗ trợ 5 tỷ đồng.",
    context: "Nhà ở xuống cấp làm tăng rủi ro trong mùa mưa và kéo theo khó khăn về sức khỏe, học tập, sinh kế của cả gia đình.",
    allocation: "Nguồn chính thức nêu khoản 5 tỷ đồng dành cho chương trình xóa nhà tạm, nhà dột nát của tỉnh Lâm Đồng.",
    delivery: "Kinh phí được đưa vào chương trình của địa phương để rà soát hộ, lựa chọn phương án và tổ chức thực hiện theo thẩm quyền.",
    impact: "Một căn nhà hoàn thành đúng tiêu chuẩn giúp gia đình giảm rủi ro thời tiết, bảo vệ tài sản và có thêm điều kiện tập trung cho lao động, học tập.",
    safety: "Người dân Lâm Đồng cần theo dõi danh sách, tiêu chí và tiến độ qua chính quyền cơ sở hoặc Ủy ban MTTQ.",
    measurement: "Hiệu quả nên được đo bằng số nhà hoàn thành, chất lượng bàn giao, thời gian sử dụng và khả năng đối ứng của hộ được hỗ trợ.",
    takeaway: "Khoản 5 tỷ đồng có ý nghĩa khi được chuyển thành những mái nhà đạt chất lượng và đến đúng hộ. Sự an toàn và ổn định sau bàn giao là thước đo lâu dài của chương trình.",
    facts: [["5 tỷ đồng", "Mức TKV hỗ trợ chương trình tại Lâm Đồng."], ["25/08/2024", "Ngày diễn ra chương trình cấp tỉnh."], ["1 địa phương", "Nguồn lực được xác định riêng cho Lâm Đồng."], ["Nhà ở", "Nhu cầu an sinh trọng tâm."]],
    bullets: ["Hỗ trợ qua chương trình cấp tỉnh.", "Đối tượng cần được địa phương rà soát.", "Không tự chia tổng tiền thành mức cho mỗi hộ.", "Chất lượng nhà là tiêu chí kết quả quan trọng."],
    image: "https://vinacomin.vn/Share/Media/2018/05/39A6632.jpg",
    imageAlt: "Người lao động TKV tại hoạt động tuyên dương",
    imageSource: "Thư viện ảnh Vinacomin · Điển hình tiên tiến TKV",
    sources: [{publisher: "TKV", title: "TKV ủng hộ Chương trình Xoá nhà tạm, nhà dột nát tại tỉnh Lâm Đồng", date: "26/08/2024", url: "https://vinacomin.vn/news/slug/tkv-ung-ho-chuong-trinh-xoa-nha-tam-nha-dot-nat-tai-tinh-lam-dong"}],
  }),
  makeCommunitySupportStory({
    slug: "tkv-ung-ho-10-ty-khac-phuc-bao-bualoi",
    title: "TKV ủng hộ 10 tỷ đồng khắc phục hậu quả bão Bualoi",
    description: "TKV trao 10 tỷ đồng qua Ủy ban Trung ương MTTQ Việt Nam để hỗ trợ các địa phương bị ảnh hưởng nặng bởi bão số 10 Bualoi năm 2025.",
    lead: "Khoản hỗ trợ tập trung qua đầu mối quốc gia để kịp thời chuyển tới các địa phương bị thiệt hại nặng, giúp người dân sớm ổn định đời sống.",
    keyword: "TKV ủng hộ bão Bualoi 10 tỷ đồng",
    beneficiaryKeyword: "đồng bào bị ảnh hưởng bởi bão Bualoi",
    programLabel: "gói cứu trợ 10 tỷ đồng sau bão Bualoi",
    beneficiaryLabel: "đồng bào tại vùng bị ảnh hưởng bởi bão Bualoi",
    eventSummary: "Sáng 06/10/2025, TKV trao 10 tỷ đồng tại trụ sở Ủy ban Trung ương MTTQ Việt Nam.",
    context: "Bão số 10 gây thiệt hại tại nhiều địa phương, đặt ra nhu cầu khẩn cấp về chỗ ở, nhu yếu phẩm, hạ tầng và khôi phục sinh kế.",
    allocation: "Khoản 10 tỷ đồng là một gói hỗ trợ tập trung; bài nguồn không chia sẵn thành mức cho từng tỉnh hoặc từng hộ.",
    delivery: "Ủy ban Trung ương MTTQ Việt Nam là đầu mối tiếp nhận và chuyển nguồn lực tới các địa phương bị ảnh hưởng nặng.",
    impact: "Hỗ trợ đến sớm có thể giúp địa phương xử lý nhu cầu khẩn cấp, sau đó chuyển sang sửa nhà, trường học, giao thông và phục hồi sản xuất.",
    safety: "Người dân không làm thủ tục qua cá nhân tự nhận đại diện TKV; danh sách và hình thức hỗ trợ do cơ quan có thẩm quyền triển khai.",
    measurement: "Cần theo dõi thời gian phân bổ, địa bàn nhận, mục đích chi và khả năng khôi phục nhu cầu thiết yếu sau bão.",
    takeaway: "Gói 10 tỷ đồng phát huy giá trị khi được phân bổ nhanh, đúng nơi thiệt hại nặng và gắn với nhu cầu phục hồi cụ thể. Cơ chế qua MTTQ tạo đầu mối rõ cho quá trình đó.",
    facts: [["10 tỷ đồng", "Tổng mức TKV trao hỗ trợ."], ["06/10/2025", "Ngày tổ chức trao tại Trung ương MTTQ."], ["Bão số 10", "Thiên tai còn được gọi là bão Bualoi."], ["1 đầu mối", "Ủy ban Trung ương MTTQ Việt Nam tiếp nhận."]],
    bullets: ["Gói hỗ trợ không chia đều theo đầu người.", "MTTQ là đầu mối tiếp nhận.", "Ưu tiên địa phương thiệt hại nặng.", "Người dân cảnh giác giả mạo cứu trợ."],
    image: "https://vinacomin.vn/Share/Media/2018/05/39A6633.jpg",
    imageAlt: "Tập thể người lao động TKV trong chương trình tuyên dương",
    imageSource: "Thư viện ảnh Vinacomin · Người lao động TKV",
    sources: [{publisher: "TKV", title: "TKV ủng hộ 10 tỷ đồng khắc phục hậu quả bão số 10 (bão Bualoi)", date: "06/10/2025", url: "https://vinacomin.vn/news/slug/tkv-ung-ho-10-ty-dong-khac-phuc-hau-qua-bao-so-10-bao-bualoi"}],
  }),
  makeCommunitySupportStory({
    slug: "tkv-ho-tro-10-ty-mien-nui-phia-bac-mua-lu",
    title: "TKV hỗ trợ 10 tỷ đồng cho bốn tỉnh miền núi phía Bắc",
    description: "TKV hỗ trợ Cao Bằng, Thái Nguyên mỗi tỉnh 3 tỷ đồng; Lạng Sơn, Lào Cai mỗi tỉnh 2 tỷ đồng để khắc phục hậu quả thiên tai năm 2025.",
    lead: "Bảng phân bổ theo từng tỉnh giúp người đọc nhìn rõ quy mô hỗ trợ và tránh nhầm gói 10 tỷ đồng này với các chương trình cứu trợ khác của TKV.",
    keyword: "TKV hỗ trợ miền núi phía Bắc 10 tỷ đồng",
    beneficiaryKeyword: "người dân Cao Bằng, Thái Nguyên, Lạng Sơn và Lào Cai bị thiên tai",
    programLabel: "gói hỗ trợ bốn tỉnh miền núi phía Bắc",
    beneficiaryLabel: "người dân bốn tỉnh bị thiệt hại do mưa lũ",
    eventSummary: "Ngày 10/10/2025, lãnh đạo TKV trực tiếp trao tổng cộng 10 tỷ đồng tại bốn tỉnh miền núi phía Bắc.",
    context: "Mưa lũ gây thiệt hại về nhà ở, hạ tầng và sản xuất, trong khi nhiều khu vực miền núi gặp thêm khó khăn về giao thông và tiếp cận cứu trợ.",
    allocation: "Cao Bằng và Thái Nguyên mỗi tỉnh nhận 3 tỷ đồng; Lạng Sơn và Lào Cai mỗi tỉnh nhận 2 tỷ đồng, cộng đúng 10 tỷ đồng.",
    delivery: "Lãnh đạo Tập đoàn đến các địa phương trao nguồn lực, còn việc xác định hộ và nhu cầu cụ thể thuộc phương án của cơ quan tiếp nhận tại tỉnh.",
    impact: "Phân bổ theo mức độ giúp địa phương có thêm nguồn sửa chữa nhu cầu thiết yếu và hỗ trợ người dân sớm phục hồi sản xuất sau mưa lũ.",
    safety: "Người dân bốn tỉnh nên theo dõi thông báo của Ủy ban MTTQ và chính quyền cơ sở, đồng thời bỏ qua các đường dẫn nhận tiền không rõ nguồn gửi qua mạng xã hội.",
    measurement: "Có thể đánh giá gói hỗ trợ qua tiến độ đến từng tỉnh, nhóm nhu cầu được ưu tiên và kết quả khôi phục nhà ở, sinh kế, hạ tầng.",
    takeaway: "Điểm mạnh của gói 10 tỷ đồng là bảng phân bổ rõ cho bốn tỉnh. Thước đo cuối cùng vẫn là nguồn lực được chuyển đúng nhu cầu và giúp người dân phục hồi thực chất.",
    facts: [["10 tỷ đồng", "Tổng nguồn hỗ trợ bốn tỉnh."], ["3 + 3 tỷ", "Cao Bằng và Thái Nguyên mỗi tỉnh 3 tỷ."], ["2 + 2 tỷ", "Lạng Sơn và Lào Cai mỗi tỉnh 2 tỷ."], ["4 tỉnh", "Phạm vi của chương trình."]],
    bullets: ["Công khai mức của từng tỉnh.", "Không chia bình quân tới từng hộ.", "Địa phương tổ chức rà soát nhu cầu.", "Thông tin có nguồn TKV và Báo Chính phủ."],
    image: "https://vinacomin.vn/Share/Media/2018/05/39A6637.jpg",
    imageAlt: "Người lao động TKV tại sự kiện tập đoàn",
    imageSource: "Thư viện ảnh Vinacomin · Tuyên dương người lao động",
    sources: [{publisher: "TKV", title: "TKV ủng hộ 10 tỷ đồng hỗ trợ các tỉnh miền núi phía Bắc khắc phục hậu quả thiên tai", date: "10/10/2025", url: "https://vinacomin.vn/news/slug/tkv-ung-ho-10-ty-dong-ho-tro-cac-tinh-mien-nui-phia-bac-khac-phuc-hau-qua-thien-tai"}, {publisher: "Báo Chính phủ", title: "TKV ủng hộ 10 tỷ đồng hỗ trợ các tỉnh miền núi phía Bắc khắc phục hậu quả sau mưa lũ", date: "10/10/2025", url: "https://baochinhphu.vn/tkv-ung-ho-10-ty-dong-ho-tro-cac-tinh-mien-nui-phia-bac-khac-phuc-hau-qua-sau-mua-lu-102251010153406903.htm"}],
  }),
  makeCommunitySupportStory({
    slug: "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026",
    title: "TKV dành 20 tỷ đồng chăm lo người có công năm 2026",
    description: "TKV ủng hộ 20 tỷ đồng cho chương trình chăm lo người có công với cách mạng trên toàn quốc năm 2026, nhân dịp kỷ niệm Ngày 27/7.",
    lead: "Chương trình tri ân quy mô toàn quốc đưa trách nhiệm xã hội của doanh nghiệp tới nhóm người có công và gia đình chính sách.",
    keyword: "TKV ủng hộ người có công 20 tỷ đồng",
    beneficiaryKeyword: "người có công với cách mạng và gia đình chính sách",
    programLabel: "chương trình chăm lo người có công năm 2026",
    beneficiaryLabel: "người có công và gia đình chính sách",
    eventSummary: "Ngày 23/07/2026, TKV công bố khoản 20 tỷ đồng tham gia chương trình chăm lo trên phạm vi toàn quốc.",
    context: "Hoạt động diễn ra trong dịp kỷ niệm Ngày Thương binh – Liệt sĩ 27/7, khi nhiều địa phương tổ chức thăm hỏi và rà soát nhu cầu của gia đình chính sách.",
    allocation: "Nguồn được rà soát nêu tổng mức 20 tỷ đồng cho chương trình toàn quốc; không công bố trong bài một bảng chia cố định cho từng tỉnh.",
    delivery: "Việc triển khai cần đi qua hệ thống cơ quan, tổ chức được giao để xác định đúng người có công và hình thức chăm lo phù hợp.",
    impact: "Ngoài ý nghĩa vật chất, chương trình tri ân góp phần nhắc lại trách nhiệm chăm lo thường xuyên, không giới hạn trong một ngày kỷ niệm.",
    safety: "Gia đình chính sách cần làm việc với cơ quan lao động, người có công hoặc chính quyền cơ sở, không cung cấp hồ sơ cho tài khoản không rõ danh tính.",
    measurement: "Hiệu quả nên được công bố bằng số địa phương, số trường hợp được hỗ trợ, loại nhu cầu được giải quyết và tiến độ hoàn thành.",
    takeaway: "Khoản 20 tỷ đồng thể hiện quy mô cam kết của TKV với công tác tri ân. Giá trị sâu hơn nằm ở việc xác định đúng người, hỗ trợ đúng nhu cầu và duy trì sự chăm lo có hệ thống.",
    facts: [["20 tỷ đồng", "Tổng mức TKV tham gia chương trình."], ["Toàn quốc", "Phạm vi chăm lo được công bố."], ["23/07/2026", "Ngày TKV đăng thông tin."], ["27/7", "Dịp tri ân người có công."]],
    bullets: ["Phạm vi toàn quốc.", "Đối tượng là người có công và gia đình chính sách.", "Không tự suy ra mức của từng người.", "Cần triển khai qua cơ quan có thẩm quyền."],
    image: "https://vinacomin.vn/Share/Media/2018/05/39A6641.jpg",
    imageAlt: "Đại biểu và người lao động tại chương trình TKV",
    imageSource: "Thư viện ảnh Vinacomin · Tuyên dương điển hình tiên tiến",
    sources: [{publisher: "TKV", title: "TKV ủng hộ 20 tỷ đồng chung tay chăm lo người có công với cách mạng toàn quốc năm 2026", date: "23/07/2026", url: "https://vinacomin.vn/news/slug/tkv-ung-ho-20-ty-dong-chung-tay-cham-lo-nguoi-co-cong-voi-cach-mang-toan-quoc-nam-2026"}],
  }),
  makeCommunitySupportStory({
    slug: "doan-thanh-nien-tkv-25-hoc-bong-thap-sang-uoc-mo",
    title: "Tuổi trẻ TKV trao 25 học bổng “Thắp sáng ước mơ”",
    description: "Đoàn Thanh niên TKV trao 25 suất học bổng tổng trị giá 50 triệu đồng cho học sinh hoàn cảnh khó khăn, tiếp sức các em trong năm học 2025–2026.",
    lead: "Mỗi suất học bổng vừa hỗ trợ chi phí học tập, vừa ghi nhận nỗ lực của học sinh khó khăn và tạo động lực tiếp tục đến trường.",
    keyword: "Đoàn Thanh niên TKV trao 25 học bổng",
    beneficiaryKeyword: "học sinh có hoàn cảnh khó khăn",
    programLabel: "chương trình học bổng “Thắp sáng ước mơ”",
    beneficiaryLabel: "học sinh có hoàn cảnh khó khăn",
    eventSummary: "Chương trình “Thắp sáng ước mơ” trao 25 suất với tổng kinh phí 50 triệu đồng cho các em đã nỗ lực trong học tập.",
    context: "Với gia đình khó khăn, chi phí sách vở, đồng phục, đi lại và sinh hoạt có thể ảnh hưởng trực tiếp tới khả năng duy trì việc học.",
    allocation: "Tổng kinh phí 50 triệu đồng cho 25 suất tương đương 2 triệu đồng mỗi suất nếu phân bổ bằng nhau, nhưng bài viết chỉ dùng phép tính này để đọc quy mô, không thay thế thông báo trao thực tế.",
    delivery: "Đoàn Thanh niên TKV phối hợp với tổ chức Đoàn tại địa phương để lựa chọn, tổ chức trao và động viên học sinh.",
    impact: "Học bổng có thể giải quyết một phần chi phí đầu năm học và quan trọng hơn là gửi tới học sinh tín hiệu rằng nỗ lực của các em được cộng đồng ghi nhận.",
    safety: "Phụ huynh nên theo dõi thông tin từ nhà trường và tổ chức Đoàn; chương trình học bổng chính thống không yêu cầu cung cấp mã ngân hàng hoặc đóng phí xét duyệt.",
    measurement: "Ngoài số suất, nên theo dõi học sinh tiếp tục đến trường, kết quả học tập và khả năng kết nối thêm hỗ trợ phù hợp trong năm học.",
    takeaway: "Hai triệu đồng đặt đúng thời điểm có thể giúp một học sinh giải quyết thiếu hụt trước mắt, giữ nhịp học tập và cảm nhận rõ sự đồng hành của cộng đồng.",
    facts: [["25 suất", "Số học bổng được trao."], ["50 triệu đồng", "Tổng kinh phí của chương trình."], ["2 triệu/suất", "Mức bình quân theo phép chia tổng nguồn lực."], ["2025–2026", "Năm học của nhóm học sinh được hỗ trợ."]],
    bullets: ["Hướng tới học sinh hoàn cảnh khó khăn.", "Gắn hỗ trợ với nỗ lực học tập.", "Phối hợp cùng tổ chức Đoàn địa phương.", "Không thu phí xét học bổng."],
    image: "https://vinacomin.vn/Share/Media/2018/05/39A6690.jpg",
    imageAlt: "Hoạt động tuyên dương và trao thưởng của TKV",
    imageSource: "Thư viện ảnh Vinacomin · Tuyên dương điển hình",
    sources: [{publisher: "TKV", title: "Đoàn Thanh niên TKV triển khai các hoạt động ‘Thắp sáng ước mơ’ cho thiếu niên nhi đồng", date: "28/07/2026", url: "https://vinacomin.vn/news/slug/doan-thanh-nien-tkv-trien-khai-cac-hoat-dong-thap-sang-uoc-mo-cho-thieu-nien-nhi-dong"}],
  }),
  makeCommunitySupportStory({
    slug: "than-thong-nhat-do-dau-cuu-thanh-nien-xung-phong",
    title: "Than Thống Nhất đỡ đầu cựu thanh niên xung phong tại Cẩm Phả",
    description: "Than Thống Nhất – TKV nhận đỡ đầu bà Nguyễn Thị Lan, cựu thanh niên xung phong khó khăn tại Cẩm Phả, với hỗ trợ quý III/2026 và quà trị giá 4 triệu đồng.",
    lead: "Một trường hợp được nhận đỡ đầu cụ thể cho thấy hoạt động an sinh của doanh nghiệp ngành Than có thể đi từ chủ trương tri ân tới sự chăm lo thường xuyên, có địa chỉ và có đầu mối phối hợp.",
    keyword: "hỗ trợ cựu thanh niên xung phong Cẩm Phả 2026",
    beneficiaryKeyword: "cựu thanh niên xung phong có hoàn cảnh khó khăn tại Cẩm Phả",
    programLabel: "Than Thống Nhất đỡ đầu cựu thanh niên xung phong",
    beneficiaryLabel: "bà Nguyễn Thị Lan tại phường Cẩm Phả",
    eventSummary: "Ngày 26/07/2026, Đảng ủy Công ty Than Thống Nhất – TKV tiếp nhận trách nhiệm đỡ đầu bà Nguyễn Thị Lan tại chương trình do Bộ Chỉ huy Quân sự tỉnh Quảng Ninh phối hợp tổ chức.",
    context: "Hoạt động được triển khai theo Công văn số 646-CV/ĐU ngày 24/07/2026 của Đảng ủy Than Quảng Ninh về việc nhận đỡ đầu cựu thanh niên xung phong có hoàn cảnh khó khăn.",
    allocation: "Công ty trao khoản hỗ trợ thường xuyên của quý III/2026 và một túi quà, tổng trị giá 4 triệu đồng; bài gốc không tách riêng giá trị của từng phần.",
    delivery: "Trách nhiệm đỡ đầu được bàn giao tại Bộ Chỉ huy Quân sự tỉnh Quảng Ninh, với sự phối hợp giữa hệ thống chính trị ngành Than và cơ quan quân sự địa phương.",
    impact: "Việc xác định một người thụ hưởng và một đơn vị nhận trách nhiệm tạo cơ sở để sự chăm lo tiếp tục sau lần thăm hỏi đầu tiên.",
    safety: "Đây là trường hợp được cơ quan có thẩm quyền rà soát và bàn giao, không phải thông báo tiếp nhận hồ sơ công khai hoặc lời mời đăng ký nhận hỗ trợ trên mạng.",
    measurement: "Hiệu quả của hoạt động nên được nhìn qua sự duy trì trách nhiệm đỡ đầu, nhu cầu thiết thực được giải quyết và sự phối hợp lâu dài với địa phương.",
    published: "2026-08-02T09:20:00+07:00",
    updated: "2026-08-02T09:20:00+07:00",
    urlPath: "tin-nganh-than/2026/08/02/than-thong-nhat-do-dau-cuu-thanh-nien-xung-phong",
    schemaType: "NewsArticle",
    hideSourceUrlsInSchema: true,
    suppressImageLabel: true,
    related: ["san-xuat-sach-hon-nganh-than", "an-toan-mua-mua-bao-2026", "nghe-tho-lo-co-on-dinh-khong"],
    factsTitle: "Bốn dữ kiện chính của hoạt động đỡ đầu",
    actionTitle: "Trách nhiệm được xác định bằng những việc cụ thể",
    conclusionTitle: "Đỡ đầu có ý nghĩa khi sự đồng hành được duy trì",
    seoLine: "Bài viết giúp người đọc hiểu hoạt động an sinh xã hội của TKV tại Cẩm Phả và cách doanh nghiệp vùng mỏ thực hiện trách nhiệm cộng đồng.",
    checklist: [
      ["Đúng người thụ hưởng", "Bà Nguyễn Thị Lan là trường hợp đã được cơ quan có thẩm quyền rà soát và bàn giao."],
      ["Rõ đơn vị đồng hành", "Công ty Than Thống Nhất – TKV tiếp nhận trách nhiệm đỡ đầu."],
      ["Không suy diễn mức hỗ trợ", "Bốn triệu đồng là tổng giá trị hỗ trợ quý III/2026 và một túi quà; nguồn không công bố mức theo tháng."],
      ["Theo dõi sự đồng hành", "Giá trị lâu dài nằm ở việc duy trì liên hệ và hỗ trợ sát nhu cầu thực tế."],
    ],
    takeaway: "Khoản 4 triệu đồng được trao trong quý III/2026 giải quyết một phần nhu cầu trước mắt. Trách nhiệm đỡ đầu được giao rõ cho doanh nghiệp mở ra khả năng đồng hành lâu dài với một cựu thanh niên xung phong có hoàn cảnh khó khăn tại Cẩm Phả.",
    facts: [["1 trường hợp", "Bà Nguyễn Thị Lan được Công ty Than Thống Nhất – TKV nhận đỡ đầu."], ["4 triệu đồng", "Tổng giá trị hỗ trợ quý III/2026 và một túi quà."], ["1976–1979", "Thời gian bà Lan tham gia lực lượng thanh niên xung phong."], ["26/07/2026", "Ngày tổ chức tiếp nhận trách nhiệm đỡ đầu tại Quảng Ninh."]],
    bullets: ["Một người thụ hưởng được xác định rõ.", "Một doanh nghiệp chịu trách nhiệm đỡ đầu.", "Có sự phối hợp với cơ quan quân sự địa phương.", "Nguồn công bố không nêu mức hỗ trợ hằng tháng."],
    image: "https://www.thanthongnhat.vn/uploads/news/2026_07/1785233493309_8368402457751477522_8368402457751477522_8eaf52b2957a4ca191b34eeec66355f2.jpg",
    imageAlt: "Than Thống Nhất đỡ đầu cựu thanh niên xung phong Nguyễn Thị Lan tại Cẩm Phả",
    imageSource: "Công ty Than Thống Nhất – TKV",
    intro: [
      "Ngày 26/07/2026, tại Bộ Chỉ huy Quân sự tỉnh Quảng Ninh, Đảng ủy Công ty Than Thống Nhất – TKV đã tiếp nhận trách nhiệm đỡ đầu bà Nguyễn Thị Lan, một cựu thanh niên xung phong có hoàn cảnh khó khăn đang sống tại phường Cẩm Phả. Hoạt động được Công ty công bố ngày 28/07/2026 và là một phần trong chương trình phối hợp chăm lo người có công trên địa bàn.",
      "Việc Than Thống Nhất đỡ đầu cựu thanh niên xung phong mang ý nghĩa lớn hơn một phần quà tri ân. Một cá nhân được xác định rõ, một đơn vị nhận trách nhiệm rõ và một đầu mối địa phương cùng phối hợp là ba yếu tố giúp sự hỗ trợ có khả năng đi tiếp sau buổi bàn giao. Với người lao động ngành Than, câu chuyện cũng cho thấy tinh thần “Kỷ luật và Đồng tâm” được nối từ nơi sản xuất ra cộng đồng vùng mỏ.",
    ],
    sections: [
      {
        title: "Than Thống Nhất đỡ đầu cựu thanh niên xung phong theo địa chỉ cụ thể",
        paragraphs: [
          "Theo thông tin do Công ty Than Thống Nhất – TKV công bố, hoạt động được triển khai theo Công văn số 646-CV/ĐU ngày 24/07/2026 của Đảng ủy Than Quảng Ninh. Đảng ủy Tập đoàn, Đảng ủy Than Quảng Ninh và Bộ Chỉ huy Quân sự tỉnh Quảng Ninh cùng phối hợp để giao doanh nghiệp nhận đỡ đầu trường hợp đã được rà soát.",
          "Người được hỗ trợ là bà Nguyễn Thị Lan, sinh năm 1959, cư trú tại tổ 1, khu Dốc Thông, phường Cẩm Phả, tỉnh Quảng Ninh. Bà tham gia lực lượng thanh niên xung phong từ tháng 4/1976 đến năm 1979, thuộc C11, F719. Bài gốc cho biết bà không có lương hưu hoặc khoản lương thường xuyên, sức khỏe yếu và đời sống còn nhiều khó khăn.",
          "Những thông tin cụ thể này rất quan trọng. Chúng cho phép người đọc hiểu đây là một trường hợp đỡ đầu đã được xác minh, không phải một cuộc vận động chung chung và cũng không phải thông báo mở đơn đăng ký hỗ trợ. Cách làm có địa chỉ giúp trách nhiệm của đơn vị đồng hành trở nên rõ ràng hơn trong quá trình thực hiện.",
        ],
      },
      {
        title: "Bốn triệu đồng gồm hỗ trợ quý III/2026 và một phần quà",
        paragraphs: [
          "Tại buổi tiếp nhận, Công ty Than Thống Nhất – TKV trao khoản hỗ trợ thường xuyên của quý III/2026 cùng một túi quà, tổng trị giá 4 triệu đồng. Nguồn công bố không nêu phần tiền được chia cụ thể như thế nào giữa hỗ trợ định kỳ và quà tặng, vì vậy không thể suy ra mức hỗ trợ theo tháng hoặc coi toàn bộ số tiền là một khoản trợ cấp cố định.",
          "Đọc đúng cấu trúc của khoản 4 triệu đồng giúp tránh hai cách hiểu sai thường gặp: phóng đại một phần quà thành chính sách đại trà, hoặc xem giá trị vật chất là toàn bộ ý nghĩa của việc đỡ đầu. Trong trường hợp bà Lan, doanh nghiệp đã nhận trách nhiệm đồng hành với một người có hoàn cảnh cụ thể, còn khoản trao trong quý III là dấu mốc đầu tiên được công bố.",
          "Với người cao tuổi, sức khỏe yếu và không có nguồn lương ổn định, một khoản hỗ trợ đúng thời điểm có thể góp phần giải quyết chi phí sinh hoạt trước mắt. Tuy nhiên, nhu cầu thực tế có thể thay đổi theo sức khỏe và đời sống; vì vậy, đầu mối phối hợp tại địa phương vẫn giữ vai trò quan trọng trong việc nhận biết điều cần ưu tiên ở từng thời điểm.",
        ],
      },
      {
        title: "Giá trị của sự chăm lo thường xuyên với người có công",
        paragraphs: [
          "Một chương trình tri ân có chiều sâu cần phân biệt rõ giữa thăm hỏi theo dịp và đỡ đầu lâu dài. Thăm hỏi tạo sự động viên trong một thời điểm, còn đỡ đầu đặt ra yêu cầu duy trì liên hệ, theo dõi hoàn cảnh và phối hợp khi người được hỗ trợ phát sinh nhu cầu thiết thực. Việc giao trách nhiệm cho một doanh nghiệp cụ thể tạo nền tảng để quá trình ấy không bị đứt đoạn.",
          "Bà Lan đã có những năm tuổi trẻ phục vụ trong lực lượng thanh niên xung phong. Khi sức khỏe suy giảm và không có lương hưu, sự quan tâm của cộng đồng mang cả ý nghĩa vật chất lẫn tinh thần. Người được đỡ đầu biết có một tập thể đang nhớ đến đóng góp của mình; doanh nghiệp cũng có cơ hội biến truyền thống tri ân thành những hành động đo được bằng sự hiện diện và tính đều đặn.",
          "Hiệu quả sau buổi bàn giao cần được nhìn cả ở số tiền đã trao và quá trình đồng hành. Những dấu hiệu quan trọng là trách nhiệm đỡ đầu có được duy trì, việc thăm hỏi có sát hoàn cảnh và những nhu cầu cần thiết có được chuyển tới đúng đầu mối xử lý hay không. Đây cũng là cách để hoạt động an sinh xã hội TKV tạo niềm tin bền vững trong cộng đồng.",
        ],
      },
      {
        title: "Từ truyền thống tri ân đến trách nhiệm của doanh nghiệp vùng mỏ",
        paragraphs: [
          "Cẩm Phả là địa bàn gắn chặt với lịch sử phát triển của ngành Than. Doanh nghiệp mỏ hoạt động tại đây vừa tạo việc làm, tổ chức sản xuất, vừa là một phần của đời sống xã hội địa phương. Khi Công ty Than Thống Nhất tham gia đỡ đầu người có công, mối quan hệ ấy được thể hiện bằng một trách nhiệm gần gũi với khu dân cư nơi doanh nghiệp đứng chân.",
          "Đối với người đang tìm hiểu việc làm ngành Than, một sự kiện an sinh không phải là cam kết về tuyển dụng, lương hoặc phúc lợi cá nhân. Dù vậy, nó cung cấp thêm một góc nhìn về văn hóa tổ chức: tập thể người thợ và doanh nghiệp quan tâm tới truyền thống, đồng đội và cộng đồng xung quanh. Đó là phần giá trị cần được nhìn cùng với điều kiện nghề, kỷ luật an toàn và yêu cầu tay nghề khi cân nhắc gắn bó lâu dài.",
          "Trường hợp bà Nguyễn Thị Lan cũng nhắc người đọc thận trọng với các lời mời nhận hỗ trợ trên mạng. Bài nguồn chỉ nói về một trường hợp đã được cơ quan có thẩm quyền rà soát và bàn giao; không công bố đường dây tiếp nhận hồ sơ rộng rãi, không yêu cầu người dân nộp phí và không đưa ra quyền lợi cho người đăng ký. Mọi thông tin liên quan cần được xác minh qua chính quyền hoặc tổ chức được giao nhiệm vụ.",
        ],
      },
    ],
    faq: [
      ["Ai được Than Thống Nhất – TKV nhận đỡ đầu?", "Đó là bà Nguyễn Thị Lan, sinh năm 1959, cựu thanh niên xung phong giai đoạn 1976–1979, hiện sống tại phường Cẩm Phả và có hoàn cảnh khó khăn."],
      ["Khoản 4 triệu đồng gồm những gì?", "Theo bài gốc, tổng giá trị gồm hỗ trợ thường xuyên của quý III/2026 và một túi quà. Nguồn không tách riêng giá trị từng phần và không nêu mức hỗ trợ hằng tháng."],
      ["Người dân có thể đăng ký chương trình đỡ đầu này không?", "Không có thông tin về một đợt nhận hồ sơ công khai. Đây là trường hợp đã được cơ quan có thẩm quyền rà soát, phối hợp và bàn giao cho doanh nghiệp nhận đỡ đầu."],
      ["Hoạt động này có phải thông báo tuyển dụng ngành Than không?", "Không. Đây là hoạt động tri ân và an sinh xã hội. Người tìm việc cần xem thông báo tuyển sinh nghề mỏ hoặc tuyển dụng đang áp dụng tại các kênh riêng."],
    ],
    sources: [{publisher: "Công ty Than Thống Nhất – TKV", title: "Tiếp nhận đỡ đầu cựu thanh niên xung phong có hoàn cảnh khó khăn", date: "28/07/2026", url: "https://www.thanthongnhat.vn/dang-doan-the/tiep-nhan-do-dau-cuu-thanh-nien-xung-phong-co-hoan-canh-kho-khan-15693.html"}],
  }),
];

const dailyArticleSlugs = new Set(["than-thong-nhat-do-dau-cuu-thanh-nien-xung-phong"]);
const stableStories = [...stories, ...expandedStories, ...historicalLocalityStories]
  .filter((article) => !dailyArticleSlugs.has(article.slug));
const dailyStories = expandedStories.filter((article) => dailyArticleSlugs.has(article.slug));

export const communityArticles = [...stableStories, ...dailyStories].map(makeArticle);
