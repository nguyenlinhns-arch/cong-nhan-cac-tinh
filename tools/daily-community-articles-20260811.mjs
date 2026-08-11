import {dailyCommunitySourceImages20260811 as images} from "./daily-community-source-images-20260811.mjs";

const publisher = "Công đoàn Than – Khoáng sản Việt Nam";
const makeSource = (slug, title) => ({publisher, title, date: "10/08/2026", url: images[slug].sourceUrl});
const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const thanQuangHanhChongNongArticle20260811 = withImage("than-quang-hanh-chong-nong-cho-tho-mo-2026", {
  updated: "2026-08-11T08:11:00+07:00", published: "2026-08-11T08:11:00+07:00",
  urlPath: "tin-nganh-than/2026/08/11/than-quang-hanh-chong-nong-cho-tho-mo-2026",
  related: ["than-ha-lam-phuc-hoi-suc-khoe-tho-lo-2026", "tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026", "phuc-loi-tho-mo-mo-viet-bac-2026", "an-toan-lao-dong-mo-ham-lo-2026"],
  section: "An sinh xã hội",
  title: "Than Quang Hanh tăng chống nóng, bảo vệ sức khỏe thợ mỏ",
  description: "Than Quang Hanh cấp bình giữ nhiệt, đá lạnh sạch và C sủi cho người lao động; phân tích ý nghĩa chống nóng và an toàn trong từng ca sản xuất.",
  lead: "Chương trình được duy trì trong mùa nóng từ tháng 6 đến tháng 9, hướng tới cả thợ mỏ hầm lò và lao động làm việc tại mặt bằng.",
  keyword: "Than Quang Hanh chống nóng cho thợ mỏ 2026",
  keywords: ["Than Quang Hanh chống nóng cho thợ mỏ 2026", "phúc lợi thợ mỏ", "sức khỏe người lao động ngành Than", "an toàn lao động mỏ", "bình giữ nhiệt cho công nhân", "việc làm ngành Than Quảng Ninh"],
  facts: [["Tháng 6–9", "Thời gian chương trình chống nóng được duy trì trong mùa hè."], ["3 vật dụng", "Bình giữ nhiệt, đá lạnh sạch và C sủi được cấp tới người lao động."], ["Hai nhóm", "Thợ mỏ làm việc dưới hầm lò và lao động tại các vị trí mặt bằng cùng được quan tâm."], ["Theo từng ca", "Việc cấp phát được tăng cường trong tháng 8 khi thời tiết oi nóng, chuyển mùa phức tạp."]],
  intro: [
    "Ngày 10/08/2026, Công đoàn Than – Khoáng sản Việt Nam đăng thông tin về chương trình <strong>Than Quang Hanh chống nóng cho thợ mỏ 2026</strong>. Công ty duy trì cấp bình giữ nhiệt, đá lạnh sạch và C sủi tới người lao động trong giai đoạn nắng nóng từ tháng 6 đến tháng 9.",
    "Hoạt động hướng tới cả thợ mỏ trực tiếp làm việc dưới hầm lò và lực lượng tại mặt bằng. Trong tháng 8, thời tiết oi nóng xen kẽ chuyển mùa khiến yêu cầu chuẩn bị nước uống và theo dõi thể lực trong từng ca cần được thực hiện sát hơn.",
    "Đây là lớp phúc lợi gần với công việc hằng ngày, nhưng không thay thế các biện pháp kỹ thuật, thông gió, thời gian nghỉ, khám sức khỏe và quy trình an toàn. Người lao động cần hiểu đúng để sử dụng hỗ trợ hiệu quả và báo sớm khi có dấu hiệu bất thường.",
  ],
  sections: [
    {title: "Than Quang Hanh chống nóng cho thợ mỏ ngay trong ca", paragraphs: [
      "Bình giữ nhiệt giúp công nhân chủ động mang nước tới vị trí làm việc và duy trì nhiệt độ phù hợp lâu hơn. Đá lạnh sạch và C sủi được cấp kèm nhằm hỗ trợ nhu cầu giải nhiệt trong điều kiện lao động nặng, nơi việc tiếp cận nước uống không thuận tiện như ở môi trường thông thường.",
      "Cách tổ chức theo từng ca quan trọng hơn việc cấp phát một lần. Nhu cầu nước phụ thuộc vị trí, nhiệt độ, cường độ lao động và thời gian làm việc; vì vậy cán bộ quản lý cần kiểm tra điểm cấp nước, số lượng vật dụng và phản hồi thực tế của từng phân xưởng.",
    ]},
    {title: "Phúc lợi thợ mỏ cần gắn với kiểm soát nguy cơ nhiệt", paragraphs: [
      "Nước uống và vật dụng chống nóng chỉ là một phần của hệ thống bảo vệ sức khỏe. Doanh nghiệp vẫn phải duy trì thông gió, kiểm soát nhiệt độ, bảo hộ, thời gian nghỉ và giám sát sức khỏe. Khi môi trường thay đổi, tổ sản xuất cần chủ động điều chỉnh nhịp làm việc, không để người lao động tự chịu đựng.",
      "Bài nguồn nhấn mạnh việc tuân thủ an toàn, vệ sinh lao động và tinh thần tương trợ. Đồng đội cần chú ý những biểu hiện như mệt bất thường, chóng mặt, đau đầu hoặc giảm tập trung; người có triệu chứng phải báo quản lý, y tế và dừng công việc theo hướng dẫn, không cố hoàn thành ca bằng mọi giá.",
    ]},
    {title: "Người lao động nên sử dụng hỗ trợ như thế nào", paragraphs: [
      "Bình cá nhân cần được vệ sinh thường xuyên, nước uống phải lấy từ nguồn được bố trí và vật dụng cấp phát cần dùng đúng hướng dẫn. C sủi hoặc sản phẩm bổ sung không phải thuốc phòng say nóng, cũng không thay thế bữa ăn, nghỉ ngơi hay đánh giá y tế khi sức khỏe có vấn đề.",
      "Người lao động có bệnh nền, đang dùng thuốc hoặc được bác sĩ giới hạn chế độ ăn uống nên trao đổi với bộ phận y tế trước khi dùng sản phẩm bổ sung. Việc khai báo trung thực giúp đơn vị bố trí công việc và biện pháp theo dõi phù hợp hơn.",
    ]},
    {title: "Chăm lo sức khỏe góp phần giữ nhịp sản xuất an toàn", paragraphs: [
      "Một chương trình thiết thực tạo cảm giác được quan tâm, nhưng giá trị dài hạn phải được đo bằng khả năng tiếp cận của mọi ca, phản hồi của công nhân và việc giảm tình trạng mệt do nhiệt. Số lượng cấp phát cần đi kèm kiểm tra chất lượng và bổ sung kịp thời.",
      "Với người đang tìm hiểu việc làm ngành Than, phúc lợi bao gồm nhiều yếu tố ngoài khoản tiền cuối tháng. Điều kiện ăn ở, chăm sóc sức khỏe, bảo hộ và cách đơn vị ứng phó thời tiết đều là những câu hỏi nên đặt ra trước khi lựa chọn công việc.",
    ]},
  ],
  factsTitle: "Nội dung chống nóng đang triển khai tại Than Quang Hanh", actionTitle: "Thợ mỏ cần làm gì trong ca nóng", conclusionTitle: "Hỗ trợ nhỏ phải nằm trong hệ thống an toàn lớn",
  checklist: [["Mang đủ nước", "Nhận bình, bổ sung nước đúng điểm cấp và không chờ khát mới uống."], ["Theo dõi thể lực", "Báo ngay khi chóng mặt, đau đầu, buồn nôn hoặc giảm tập trung."], ["Dùng đúng hướng dẫn", "Không xem sản phẩm bổ sung là thuốc hoặc biện pháp thay thế nghỉ ngơi."], ["Giữ bình sạch", "Vệ sinh bình cá nhân và không dùng chung để hạn chế nguy cơ mất vệ sinh."]],
  takeaway: "Than Quang Hanh đang đưa vật dụng chống nóng tới từng ca làm việc. Hiệu quả bền vững phụ thuộc việc cấp đủ, dùng đúng và kết hợp với thông gió, thời gian nghỉ, y tế cùng kỷ luật an toàn.",
  faq: [["Than Quang Hanh cấp những gì cho người lao động?", "Bài nguồn nêu bình giữ nhiệt, đá lạnh sạch và C sủi."], ["Chương trình triển khai trong thời gian nào?", "Hoạt động chống nóng được duy trì từ tháng 6 đến tháng 9 và tăng cường trong tháng 8."], ["Uống C sủi có thay thế biện pháp chống nóng khác không?", "Không. Sản phẩm bổ sung không thay thế nước, nghỉ ngơi, thông gió, bảo hộ hoặc đánh giá y tế."], ["Ai được hưởng chương trình?", "Thông tin công bố nhắc cả thợ mỏ hầm lò và lao động làm việc tại các vị trí mặt bằng."]],
  sources: [makeSource("than-quang-hanh-chong-nong-cho-tho-mo-2026", "Công ty Than Quang Hanh cấp phát đá lạnh, C sủi và bình giữ nhiệt cho người lao động")],
  seoLine: "Bài viết làm rõ Than Quang Hanh chống nóng cho thợ mỏ 2026, phúc lợi sức khỏe và yêu cầu an toàn trong ca làm việc.",
});

export const cheTaoMayKhenThuongArticle20260811 = withImage("che-tao-may-khen-thuong-con-nguoi-lao-dong-2026", {
  updated: "2026-08-11T08:12:00+07:00", published: "2026-08-11T08:12:00+07:00",
  urlPath: "tin-nganh-than/2026/08/11/che-tao-may-khen-thuong-con-nguoi-lao-dong-2026",
  related: ["than-nam-mau-tuyen-duong-con-cong-nhan-2026", "than-duong-huy-ho-tro-con-cong-nhan-2026", "tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026", "tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026"],
  section: "An sinh xã hội",
  title: "Chế tạo máy TKV khen thưởng 229 con người lao động",
  description: "Công ty Cổ phần Chế tạo máy khen thưởng 229 con người lao động, trong đó 7 em đạt giải cấp tỉnh, với tổng tiền gần 140 triệu đồng.",
  lead: "Chương trình ghi nhận thành tích học tập năm 2025–2026 và dành sự quan tâm tới những học sinh vượt khó trong gia đình công nhân.",
  keyword: "Chế tạo máy TKV khen thưởng con người lao động 2026",
  keywords: ["Chế tạo máy TKV khen thưởng con người lao động 2026", "phúc lợi gia đình công nhân", "con công nhân TKV học giỏi", "an sinh xã hội ngành Than", "đời sống người lao động Cẩm Phả"],
  facts: [["229 em", "Số con cán bộ, công nhân, người lao động được khen thưởng."], ["7 em", "Số học sinh đạt giải tại các kỳ thi học sinh giỏi cấp tỉnh."], ["Gần 140 triệu đồng", "Tổng tiền thưởng được công bố cho năm học 2025–2026."], ["07/08/2026", "Ngày Công ty tổ chức hội nghị gặp mặt, tuyên dương."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 10/08/2026 đăng bài về chương trình <strong>Chế tạo máy TKV khen thưởng con người lao động 2026</strong>. Hội nghị được Công ty Cổ phần Chế tạo máy tổ chức ngày 07/08 để ghi nhận thành tích học tập và rèn luyện của con cán bộ, công nhân, người lao động.",
    "Theo báo cáo tại hội nghị, 229 em được khen thưởng; 7 em đạt giải tại các kỳ thi học sinh giỏi cấp tỉnh. Tổng kinh phí thưởng gần 140 triệu đồng. Chương trình cũng nhắc tới những học sinh có hoàn cảnh gia đình khó khăn nhưng vẫn nỗ lực học tập.",
    "Sự ghi nhận dành cho thành tích của trẻ đồng thời tạo thêm động lực tinh thần cho cha mẹ. Hoạt động này thể hiện doanh nghiệp quan tâm tới gia đình người lao động và góp phần củng cố sự gắn bó với nơi làm việc.",
  ],
  sections: [
    {title: "Chế tạo máy TKV khen thưởng con người lao động theo kết quả rõ ràng", paragraphs: [
      "Số liệu 229 em cho thấy chương trình có phạm vi rộng, trong khi nhóm 7 học sinh đạt giải cấp tỉnh đại diện cho thành tích nổi bật. Việc công bố tiêu chí và kết quả giúp hoạt động tuyên dương có căn cứ, tránh biến thành phần thưởng hình thức.",
      "Nguồn tin cũng nêu một số trường hợp vượt khó, như gia đình mất cha do tai nạn lao động, mẹ đơn thân hoặc ốm đau dài ngày. Khi đánh giá thành tích trong bối cảnh cụ thể, phần thưởng mang thêm ý nghĩa động viên và chia sẻ với gia đình công nhân.",
    ]},
    {title: "Gần 140 triệu đồng là khoản động viên, không phải chế độ chung", paragraphs: [
      "Tổng tiền thưởng phản ánh quy mô chương trình tại Công ty Cổ phần Chế tạo máy trong năm học 2025–2026. Đây không phải mức hưởng cố định áp dụng cho mọi con công nhân TKV; từng đơn vị có quy chế, nguồn kinh phí và nhóm đối tượng riêng.",
      "Người lao động cần theo dõi thông báo của Công đoàn và doanh nghiệp về hồ sơ, thời hạn, tiêu chí học lực hoặc giải thưởng. Chuẩn bị giấy xác nhận đúng yêu cầu và nộp đúng kỳ giúp quyền lợi của gia đình không bị bỏ sót.",
    ]},
    {title: "Phúc lợi gia đình góp phần giữ người lao động", paragraphs: [
      "Đối với công nhân làm việc theo ca, việc học của con là mối quan tâm kéo dài nhiều năm. Khi doanh nghiệp cùng chia sẻ, người lao động cảm nhận rõ hơn sự gắn kết giữa công việc và đời sống gia đình. Đây là yếu tố mềm nhưng có ảnh hưởng tới tâm lý ổn định và quyết định gắn bó.",
      "Phần thưởng không thay thế chính sách tiền lương, an toàn hay bảo hiểm. Giá trị của nó nằm ở việc bổ sung một lớp phúc lợi tinh thần, kết nối doanh nghiệp với gia đình và lan tỏa tinh thần hiếu học trong cộng đồng công nhân.",
    ]},
    {title: "Cách làm minh bạch giúp chương trình có tác động lâu dài", paragraphs: [
      "Để duy trì niềm tin, đơn vị cần thông báo tiêu chí sớm, xác minh hồ sơ thống nhất và công khai kết quả phù hợp. Với trường hợp đặc biệt khó khăn, quỹ phúc lợi hoặc chương trình học bổng có thể tiếp tục đồng hành sau buổi tuyên dương.",
      "Người lao động có thể chủ động lưu giấy khen, kết quả học tập và hỏi đầu mối Công đoàn vào cuối năm học. Việc cập nhật đúng thông tin gia đình giúp doanh nghiệp nhận diện kịp thời những trường hợp cần hỗ trợ sâu hơn.",
    ]},
  ],
  factsTitle: "Kết quả tuyên dương năm học 2025–2026", actionTitle: "Gia đình công nhân nên chuẩn bị gì", conclusionTitle: "Chăm lo cho con cũng là chăm lo cho người lao động",
  checklist: [["Theo dõi thông báo", "Nắm thời hạn và tiêu chí khen thưởng của đơn vị."], ["Lưu hồ sơ", "Giữ giấy khen, xác nhận giải và kết quả học tập theo yêu cầu."], ["Khai hoàn cảnh", "Thông báo trung thực trường hợp đặc biệt để được xem xét đúng chính sách."], ["Hỏi đúng đầu mối", "Liên hệ Công đoàn hoặc bộ phận phụ trách, không suy ra mức hưởng từ đơn vị khác."]],
  takeaway: "Công ty Cổ phần Chế tạo máy đã khen thưởng 229 con người lao động với tổng kinh phí gần 140 triệu đồng. Chương trình tạo động lực học tập và bổ sung một lớp phúc lợi hướng tới gia đình công nhân.",
  faq: [["Có bao nhiêu em được khen thưởng?", "Bài nguồn công bố 229 em trong năm học 2025–2026."], ["Bao nhiêu học sinh đạt giải cấp tỉnh?", "Có 7 em đạt giải tại các kỳ thi học sinh giỏi cấp tỉnh."], ["Tổng tiền thưởng là bao nhiêu?", "Công ty công bố tổng số tiền gần 140 triệu đồng."], ["Mức thưởng có áp dụng chung toàn TKV không?", "Không. Đây là chương trình của Công ty Cổ phần Chế tạo máy; từng đơn vị có quy chế riêng."]],
  sources: [makeSource("che-tao-may-khen-thuong-con-nguoi-lao-dong-2026", "Công ty Cổ phần Chế tạo máy: Tuyên dương con CB, CN, NLĐ đạt thành tích cao năm học 2025 - 2026")],
  seoLine: "Bài viết phân tích Chế tạo máy TKV khen thưởng con người lao động 2026 và ý nghĩa phúc lợi gia đình công nhân.",
});

export const thanDuongHuyHoTroConArticle20260811 = withImage("than-duong-huy-ho-tro-con-cong-nhan-2026", {
  updated: "2026-08-11T08:13:00+07:00", published: "2026-08-11T08:13:00+07:00",
  urlPath: "tin-nganh-than/2026/08/11/than-duong-huy-ho-tro-con-cong-nhan-2026",
  related: ["che-tao-may-khen-thuong-con-nguoi-lao-dong-2026", "than-nam-mau-tuyen-duong-con-cong-nhan-2026", "than-duong-huy-khu-tap-the-cong-nhan-2026", "tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026"],
  section: "An sinh xã hội",
  title: "Than Dương Huy mở rộng hỗ trợ học tập cho con công nhân",
  description: "Than Dương Huy thưởng 1.125 học sinh, hỗ trợ trẻ mầm non và duy trì học bổng 1–3 triệu đồng cho con người lao động theo từng bậc học.",
  lead: "Chính sách trải từ trẻ 3 tháng tuổi đến người học đại học, cao đẳng và nghề, tạo một hệ hỗ trợ dài hạn cho gia đình công nhân.",
  keyword: "Than Dương Huy hỗ trợ con công nhân 2026",
  keywords: ["Than Dương Huy hỗ trợ con công nhân 2026", "học bổng con thợ mỏ", "phúc lợi gia đình công nhân", "con công nhân TKV", "hỗ trợ trẻ mầm non", "an sinh xã hội ngành Than"],
  facts: [["1.125 em", "Số học sinh, sinh viên được biểu dương, trao thưởng năm 2026."], ["Gần 800 triệu đồng", "Kinh phí tuyên dương thành tích học tập, rèn luyện."], ["Trên 300 triệu đồng", "Khoản hỗ trợ trẻ mầm non trong sáu tháng đầu năm 2026."], ["1–3 triệu đồng", "Mức học bổng hằng năm tùy bậc trung cấp/nghề, cao đẳng hoặc đại học."]],
  intro: [
    "Ngày 10/08/2026, Công đoàn Than – Khoáng sản Việt Nam công bố hệ chính sách <strong>Than Dương Huy hỗ trợ con công nhân 2026</strong>. Nội dung bao gồm khen thưởng học tập, hỗ trợ trẻ mầm non, học bổng cho người học đại học, cao đẳng, trung cấp và dạy nghề.",
    "Trong năm 2026, Công ty biểu dương 1.125 học sinh, sinh viên với tổng kinh phí gần 800 triệu đồng. Sáu tháng đầu năm, khoản hỗ trợ trẻ mầm non trên 300 triệu đồng. Học bổng hằng năm được công bố theo bậc học và có cơ chế tăng cho trường hợp đặc biệt.",
    "Chính sách bao phủ nhiều độ tuổi. Từ giai đoạn gửi trẻ đến khi học nghề hoặc đại học, gia đình công nhân có các lớp hỗ trợ khác nhau. Tuy nhiên, từng khoản có điều kiện riêng và không nên cộng gộp thành mức hưởng mặc định cho mọi gia đình.",
  ],
  sections: [
    {title: "Than Dương Huy hỗ trợ con công nhân theo nhiều giai đoạn", paragraphs: [
      "Trẻ từ 3 tháng đến 6 tuổi thuộc nhóm được hỗ trợ một phần chi phí đến trường, thực hiện hai lần mỗi năm. Chính sách này hướng trực tiếp tới người lao động trẻ đang phải cân đối ca làm, chi phí gửi trẻ và thời gian chăm sóc gia đình.",
      "Khi con bước sang các bậc học cao hơn, chương trình chuyển sang khen thưởng thành tích và học bổng. Cách phân tầng giúp nguồn lực đáp ứng nhiều nhu cầu trong suốt năm học.",
    ]},
    {title: "Mức học bổng 1–3 triệu đồng được phân theo bậc học", paragraphs: [
      "Bài nguồn nêu mức 3 triệu đồng cho người học đại học, 2 triệu đồng cho cao đẳng và 1 triệu đồng cho trung cấp hoặc dạy nghề. Chính sách được triển khai vào cuối năm học, hỗ trợ tối đa tới 25 tuổi.",
      "Trường hợp có hoàn cảnh đặc biệt được áp dụng hệ số 1,5 lần. Chương trình xét cả bậc học và mức độ khó khăn. Người lao động cần cung cấp hồ sơ đúng tiêu chí để đơn vị xét duyệt công bằng.",
    ]},
    {title: "Phúc lợi giáo dục góp phần giảm áp lực cho thợ mỏ", paragraphs: [
      "Chi phí nuôi dạy con là khoản dài hạn, trong khi công nhân sản xuất phải duy trì nhịp ca kíp và thu nhập phụ thuộc ngày công, năng suất. Hỗ trợ học tập không giải quyết toàn bộ chi phí, nhưng giảm một phần gánh nặng và tạo cảm giác doanh nghiệp đồng hành với gia đình.",
      "Nguồn tin còn nêu các khoản chăm lo dịp Quốc tế Thiếu nhi, Trung thu và ngày khai trường. Mỗi đợt có nguồn và phạm vi riêng; người đọc không nên hiểu số tiền tổng của một chương trình là khoản chi trực tiếp cho từng cá nhân.",
    ]},
    {title: "Người lao động cần đối chiếu điều kiện từng chính sách", paragraphs: [
      "Độ tuổi, bậc học, tình trạng đang theo học và hoàn cảnh gia đình có thể ảnh hưởng quyền lợi. Cha mẹ nên cập nhật thông tin con, lưu giấy xác nhận sinh viên hoặc học sinh và theo dõi lịch thông báo của Công ty, Công đoàn.",
      "Chính sách có ý nghĩa giữ chân lao động khi được thực hiện ổn định, minh bạch và đúng hạn. Phản hồi của gia đình giúp doanh nghiệp điều chỉnh mức hỗ trợ theo biến động chi phí thực tế.",
    ]},
  ],
  factsTitle: "Các lớp hỗ trợ con người lao động", actionTitle: "Gia đình cần đối chiếu trước khi làm hồ sơ", conclusionTitle: "Phúc lợi dài hạn đi cùng hành trình học tập",
  checklist: [["Xác định bậc học", "Đối chiếu đúng nhóm mầm non, nghề, trung cấp, cao đẳng hoặc đại học."], ["Kiểm tra độ tuổi", "Chính sách học bổng được công bố hỗ trợ tối đa đến 25 tuổi."], ["Chuẩn bị xác nhận", "Lưu giấy tờ đang theo học và hồ sơ hoàn cảnh nếu thuộc nhóm đặc biệt."], ["Theo dõi từng kỳ", "Mỗi khoản có lịch và tiêu chí riêng, không tự suy ra mức được nhận."]],
  takeaway: "Than Dương Huy xây dựng phúc lợi giáo dục từ tuổi mầm non đến bậc đại học và học nghề. Hệ hỗ trợ này giúp gia đình công nhân giảm một phần áp lực và tạo thêm động lực gắn bó lâu dài.",
  faq: [["Than Dương Huy khen thưởng bao nhiêu học sinh, sinh viên?", "Bài nguồn nêu 1.125 em trong năm 2026, với kinh phí gần 800 triệu đồng."], ["Trẻ mầm non được hỗ trợ ở độ tuổi nào?", "Chính sách áp dụng với con người lao động từ 3 tháng đến 6 tuổi và thực hiện hai lần mỗi năm."], ["Mức học bổng theo bậc học là bao nhiêu?", "Đại học 3 triệu đồng, cao đẳng 2 triệu đồng, trung cấp hoặc dạy nghề 1 triệu đồng mỗi người theo thông tin công bố."], ["Trường hợp đặc biệt có mức hỗ trợ khác không?", "Bài nguồn nêu trường hợp đặc biệt được áp dụng hệ số 1,5 lần nếu đáp ứng tiêu chí xét duyệt."]],
  sources: [makeSource("than-duong-huy-ho-tro-con-cong-nhan-2026", "Than Dương Huy: Chăm lo thiết thực cho con của CBCNV")],
  seoLine: "Bài viết làm rõ Than Dương Huy hỗ trợ con công nhân 2026, học bổng và phúc lợi giáo dục cho gia đình thợ mỏ.",
});

export const thanDuongHuyKhuTapTheArticle20260811 = withImage("than-duong-huy-khu-tap-the-cong-nhan-2026", {
  updated: "2026-08-11T08:14:00+07:00", published: "2026-08-11T08:14:00+07:00",
  urlPath: "tin-nganh-than/2026/08/11/than-duong-huy-khu-tap-the-cong-nhan-2026",
  related: ["than-duong-huy-ho-tro-con-cong-nhan-2026", "tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026", "phuc-loi-tho-mo-mo-viet-bac-2026", "nha-o-tho-mo-quang-ninh-2026"],
  section: "An sinh xã hội",
  title: "Than Dương Huy cải thiện khu tập thể cho 142 công nhân",
  description: "Than Dương Huy ghi nhận 19 ý kiến của 142 công nhân về phòng ở, nhà ăn, thiết chế văn hóa và nâng cấp khu tập thể an toàn, văn minh.",
  lead: "Tọa đàm ngày 09/08 đưa nhu cầu của người đang ở khu tập thể vào kế hoạch cải thiện cơ sở vật chất và nếp sống sau ca sản xuất.",
  keyword: "khu tập thể công nhân Than Dương Huy 2026",
  keywords: ["khu tập thể công nhân Than Dương Huy 2026", "nhà ở thợ mỏ Quảng Ninh", "đời sống công nhân mỏ", "phúc lợi thợ mỏ", "nhà ăn công nhân", "an sinh xã hội TKV"],
  facts: [["142 người", "Số cán bộ, công nhân viên đang sinh sống tại khu tập thể được đại diện tại tọa đàm."], ["19 ý kiến", "Các kiến nghị trực tiếp về điều kiện sinh hoạt và quản trị."], ["09/08/2026", "Ngày Công ty tổ chức tọa đàm về khu tập thể, chung cư."], ["4 nhóm nhu cầu", "Trang thiết bị, nhà ăn, văn hóa - thể thao và sửa chữa phòng ở."]],
  intro: [
    "Tọa đàm về <strong>khu tập thể công nhân Than Dương Huy 2026</strong> được tổ chức ngày 09/08, với mục tiêu xây dựng môi trường sinh hoạt sạch, an toàn và văn minh hơn cho người lao động. Công đoàn TKV đăng thông tin ngày 10/08/2026.",
    "Tại chương trình, 19 ý kiến đại diện cho 142 cán bộ, công nhân viên đang sinh sống trong khu tập thể tập trung vào trang thiết bị, nhà ăn tập trung, thiết chế văn hóa - thể thao, sửa chữa và nâng cấp phòng ở.",
    "Nhà ở tập thể là nơi công nhân phục hồi sau ca, đặc biệt với lao động xa quê. Chất lượng phòng ở, vệ sinh, an ninh và không gian sinh hoạt liên quan trực tiếp tới sức khỏe, tâm lý và khả năng duy trì việc làm.",
  ],
  sections: [
    {title: "Khu tập thể công nhân Than Dương Huy được nhìn từ người đang ở", paragraphs: [
      "Việc lấy ý kiến trực tiếp giúp doanh nghiệp nhận diện những bất tiện mà báo cáo kỹ thuật có thể bỏ sót. Người ở hằng ngày biết rõ thiết bị nào thiếu, phòng nào cần sửa, khung giờ nhà ăn chưa phù hợp và khu vực nào cần bổ sung chiếu sáng hoặc vệ sinh.",
      "Con số 19 ý kiến không đồng nghĩa mọi kiến nghị đều được giải quyết ngay. Giá trị của tọa đàm nằm ở việc ghi nhận, phân loại, giao đầu mối và phản hồi tiến độ. Nếu thiếu bước theo dõi sau cuộc họp, niềm tin của người lao động khó được duy trì.",
    ]},
    {title: "Phòng ở và nhà ăn tác động trực tiếp tới sức khỏe thợ mỏ", paragraphs: [
      "Sau ca lao động nặng, công nhân cần không gian nghỉ đủ yên tĩnh, thông thoáng, an toàn và có nước sinh hoạt ổn định. Hỏng hóc nhỏ kéo dài có thể làm giảm chất lượng giấc ngủ, ảnh hưởng thể lực trong ca tiếp theo.",
      "Đề xuất nhà ăn tập trung cần được xem cùng chất lượng bữa ăn, vệ sinh, thời gian phục vụ và khả năng đáp ứng các ca. Cơ sở vật chất chỉ phát huy hiệu quả khi quy trình vận hành phù hợp nhịp làm việc thực tế của người lao động.",
    ]},
    {title: "Thiết chế văn hóa tạo đời sống đầy đủ sau ca", paragraphs: [
      "Không gian thể thao và sinh hoạt chung tạo cơ hội vận động, giao lưu và giảm cảm giác xa nhà. Với công nhân trẻ hoặc người mới từ địa phương khác đến Quảng Ninh, môi trường tập thể tích cực có thể hỗ trợ quá trình thích nghi.",
      "Cùng với đầu tư, Công ty nhấn mạnh tự quản, giữ vệ sinh, phòng ngừa tệ nạn và xây dựng nếp sống văn minh. Trách nhiệm cần chia đều: doanh nghiệp bảo đảm điều kiện cơ bản và sửa chữa; người ở tuân thủ nội quy, giữ tài sản chung và phản ánh đúng kênh.",
    ]},
    {title: "Kế hoạch cải thiện cần có thứ tự ưu tiên và thời hạn", paragraphs: [
      "Những hạng mục liên quan an toàn, điện nước, vệ sinh và phòng ở nên được xử lý trước; thiết bị tiện ích và không gian chung có thể chia giai đoạn theo nguồn lực. Danh mục công việc, người phụ trách và mốc phản hồi cần được thông tin cho cư dân.",
      "Với người đang cân nhắc học nghề mỏ và việc làm ngành Than, nhà ở là nội dung nên hỏi rõ. Không nên chỉ nhìn ảnh giới thiệu; hãy đối chiếu loại phòng, chi phí, khoảng cách nơi làm việc, nội quy, nhà ăn và đầu mối hỗ trợ khi phát sinh vấn đề.",
    ]},
  ],
  factsTitle: "Những nhu cầu được nêu tại tọa đàm", actionTitle: "Người ở khu tập thể nên theo dõi gì", conclusionTitle: "Nơi ở tốt là một phần của việc làm bền vững",
  checklist: [["Ưu tiên an toàn", "Báo ngay sự cố điện, nước, phòng cháy hoặc hư hỏng có nguy cơ."], ["Theo dõi tiến độ", "Lưu nội dung kiến nghị và đầu mối phản hồi sau tọa đàm."], ["Giữ nếp sống chung", "Tuân thủ vệ sinh, an ninh và quy định sử dụng tài sản tập thể."], ["Hỏi trước khi nhận việc", "Đối chiếu loại phòng, chi phí, nhà ăn và khoảng cách đi làm."]],
  takeaway: "Than Dương Huy đã đưa 19 ý kiến của 142 người đang ở khu tập thể vào đối thoại trực tiếp. Cải thiện có giá trị khi các kiến nghị được ưu tiên đúng, có thời hạn và gắn trách nhiệm doanh nghiệp với ý thức tự quản của cư dân.",
  faq: [["Có bao nhiêu người đang ở khu tập thể được đại diện tại tọa đàm?", "Bài nguồn nêu 142 cán bộ, công nhân viên."], ["Người lao động nêu bao nhiêu ý kiến?", "Có 19 ý kiến được ghi nhận tại tọa đàm."], ["Các kiến nghị tập trung vào nội dung gì?", "Trang thiết bị sinh hoạt, nhà ăn tập trung, văn hóa - thể thao, sửa chữa và nâng cấp phòng ở."], ["Tọa đàm có đồng nghĩa mọi hạng mục đã được thi công không?", "Không. Chương trình ghi nhận, trao đổi và định hướng xử lý; tiến độ thực tế cần tiếp tục được công bố và theo dõi."]],
  sources: [makeSource("than-duong-huy-khu-tap-the-cong-nhan-2026", "Than Dương Huy: Quyết tâm xây dựng khu tập thể công nhân sạch đẹp, văn minh")],
  seoLine: "Bài viết phân tích khu tập thể công nhân Than Dương Huy 2026, nhà ở thợ mỏ và các kiến nghị cải thiện đời sống.",
});

export const dailyCommunityArticles20260811 = [thanQuangHanhChongNongArticle20260811, cheTaoMayKhenThuongArticle20260811, thanDuongHuyHoTroConArticle20260811, thanDuongHuyKhuTapTheArticle20260811];
