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
          "Tỷ lệ tốt nghiệp và được bố trí việc làm cao cho thấy việc phối hợp tại cơ sở có tác dụng rõ rệt. Người lao động được tư vấn trước về nghề, Nhà trường nắm ng