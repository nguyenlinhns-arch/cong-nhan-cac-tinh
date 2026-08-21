import {dailyCommunitySourceImages20260821 as images} from "./daily-community-source-images-20260821.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const haTuArticle20260821 = withImage("than-ha-tu-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026", {
  updated: "2026-08-21T08:21:00+07:00", published: "2026-08-21T08:21:00+07:00",
  urlPath: "tin-nganh-than/2026/08/21/than-ha-tu-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026",
  related: ["kho-van-da-bac-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026", "phuc-loi-tho-mo-tkv-2026", "nha-o-tho-mo-quang-ninh-2026"],
  section: "An sinh xã hội",
  title: "Than Hà Tu hỗ trợ 12 nữ công nhân phát triển kinh tế gia đình",
  description: "Than Hà Tu nghiệm thu mô hình chăn nuôi của 12 nữ công nhân khó khăn, tạo sinh kế phù hợp để tăng nguồn thu và ổn định đời sống gia đình.",
  lead: "Nguồn hỗ trợ được chuyển thành đàn vật nuôi và chuồng trại theo điều kiện từng hộ, kèm theo quá trình kiểm tra để bảo đảm đúng mục đích.",
  keyword: "Than Hà Tu hỗ trợ nữ công nhân 2026",
  keywords: ["Than Hà Tu hỗ trợ nữ công nhân 2026", "nữ công nhân khó khăn", "TKV an sinh xã hội", "mô hình chăn nuôi công nhân", "đời sống người lao động ngành Than", "việc làm ngành Than Quảng Ninh"],
  facts: [["12 nữ công nhân", "Số trường hợp được lựa chọn tham gia giai đoạn 4 tại Than Hà Tu."], ["Mô hình chăn nuôi", "Hướng sinh kế được các gia đình lựa chọn theo đất đai, chuồng trại và khả năng chăm sóc."], ["Nghiệm thu tại hộ", "Đoàn công tác kiểm tra vật nuôi, chuồng trại và quá trình thực hiện."], ["Tiếp tục đồng hành", "Công đoàn duy trì theo dõi, hướng dẫn và động viên các gia đình."]],
  intro: [
    "Ngày 13/08/2026, Công đoàn Than – Khoáng sản Việt Nam công bố kết quả chương trình <strong>Than Hà Tu hỗ trợ nữ công nhân 2026</strong>. Công đoàn Công ty Cổ phần Than Hà Tu đã nghiệm thu thực tế các mô hình sinh kế của 12 nữ công nhân có hoàn cảnh khó khăn trong giai đoạn 4 của đề án phát triển kinh tế gia đình.",
    "Các trường hợp tham gia được rà soát theo hoàn cảnh, nhu cầu và khả năng tổ chức chăn nuôi. Từ nguồn hỗ trợ ban đầu, từng gia đình chủ động chọn quy mô đàn vật nuôi, đầu tư hoặc cải tạo chuồng trại để phù hợp điều kiện sẵn có.",
    "Chương trình lựa chọn 12 trường hợp theo hoàn cảnh và điều kiện thực hiện tại Than Hà Tu, không tạo một chế độ trợ cấp chung áp dụng cho toàn ngành.",
  ],
  sections: [
    {title: "Than Hà Tu hỗ trợ nữ công nhân bằng mô hình sinh kế tại hộ", paragraphs: [
      "Đoàn nghiệm thu đến từng gia đình để xem số lượng và tình trạng vật nuôi, điều kiện chuồng trại cùng cách chăm sóc. Cách kiểm tra trực tiếp giúp nhận diện sớm khó khăn về dịch bệnh, thức ăn hoặc quy mô chưa phù hợp.",
      "Mỗi hộ có điều kiện đất đai và nhân lực khác nhau nên không áp một công thức chung. Mục tiêu thiết thực là biến nguồn hỗ trợ thành hoạt động có thể duy trì, tạo thêm nguồn thu mà không ảnh hưởng ca làm chính của người lao động.",
    ]},
    {title: "Nghiệm thu giúp nguồn lực đến đúng mục đích", paragraphs: [
      "Công đoàn đánh giá việc sử dụng con giống, chuồng trại và khả năng tái đàn. Những mô hình duy trì ổn định cho thấy người nhận đã chủ động chăm sóc; những trường hợp gặp trở ngại cần được hướng dẫn thêm trước khi mở rộng.",
      "Việc ghi nhận kết quả bằng danh sách, hình ảnh và phản hồi của từng hộ cũng tạo căn cứ cho các giai đoạn sau. Minh bạch trong lựa chọn và nghiệm thu giúp tập thể người lao động hiểu rõ cách nguồn lực an sinh được sử dụng.",
    ]},
    {title: "Sinh kế bền vững cần kỹ thuật và kế hoạch chi phí", paragraphs: [
      "Con giống chỉ là điểm khởi đầu. Gia đình cần tính thức ăn, phòng bệnh, đầu ra và thời gian chăm sóc; thiếu một khâu có thể khiến đàn vật nuôi trở thành gánh nặng mới, không còn là nguồn thu bổ sung.",
      "Công đoàn có thể kết nối hướng dẫn kỹ thuật và theo dõi định kỳ. Người tham gia nên ghi chép chi phí, tỷ lệ hao hụt và doanh thu để biết mô hình có thật sự hiệu quả trước khi quyết định tái đàn.",
    ]},
  ],
  factsTitle: "Cách Than Hà Tu triển khai giai đoạn 4", actionTitle: "Bốn việc giúp mô hình sinh kế duy trì ổn định", conclusionTitle: "Hỗ trợ đúng điều kiện giúp gia đình chủ động hơn",
  checklist: [["Ghi chép chi phí", "Theo dõi con giống, thức ăn, thuốc phòng bệnh và khoản bán ra."], ["Bám lịch phòng bệnh", "Thực hiện vệ sinh chuồng trại và tiêm phòng theo hướng dẫn kỹ thuật."], ["Chọn quy mô vừa sức", "Tái đàn theo đất đai, thời gian và khả năng chăm sóc thực tế."], ["Báo khó khăn sớm", "Trao đổi với Công đoàn khi phát sinh dịch bệnh hoặc đầu ra không ổn định."]],
  takeaway: "Than Hà Tu đã nghiệm thu mô hình sinh kế của 12 nữ công nhân khó khăn. Giá trị của chương trình nằm ở việc lựa chọn đúng hộ, kiểm tra tận nơi và giúp người nhận duy trì nguồn thu phù hợp với điều kiện gia đình.",
  faq: [["Có bao nhiêu nữ công nhân Than Hà Tu được hỗ trợ?", "Giai đoạn 4 có 12 nữ công nhân được lựa chọn tham gia."], ["Các gia đình triển khai mô hình gì?", "Các gia đình nuôi gà và phát triển đàn vật nuôi theo điều kiện riêng của từng hộ."], ["Công đoàn nghiệm thu những nội dung nào?", "Đoàn kiểm tra vật nuôi, chuồng trại, cách chăm sóc và khả năng duy trì mô hình."], ["Đây có phải chế độ chung cho mọi công nhân không?", "Không. Chương trình lựa chọn trường hợp theo hoàn cảnh, nhu cầu và điều kiện thực hiện."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Nghiệm thu giai đoạn 4 Đề án “Hỗ trợ nữ CNLĐ khó khăn phát triển kinh tế gia đình” tại Công ty CP Than Hà Tu", date: "13/08/2026", url: images["than-ha-tu-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ cách Than Hà Tu hỗ trợ nữ công nhân 2026 bằng mô hình sinh kế, quy trình nghiệm thu và điều kiện để duy trì hiệu quả.",
});

export const camPhaArticle20260821 = withImage("kho-van-cam-pha-ho-tro-cuu-thanh-nien-xung-phong-2026", {
  updated: "2026-08-21T08:22:00+07:00", published: "2026-08-21T08:22:00+07:00",
  urlPath: "tin-nganh-than/2026/08/21/kho-van-cam-pha-ho-tro-cuu-thanh-nien-xung-phong-2026",
  related: ["than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026", "cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026", "than-nui-beo-ho-tro-cuu-thanh-nien-xung-phong-2026"],
  section: "An sinh xã hội",
  title: "Kho vận Cẩm Phả hỗ trợ cựu nữ thanh niên xung phong",
  description: "Kho vận và Cảng Cẩm Phả khảo sát nhà ở, nhu cầu sinh hoạt để hỗ trợ dài hạn cựu nữ thanh niên xung phong có hoàn cảnh khó khăn tại Cửa Ông.",
  lead: "Phương án dự kiến gồm hỗ trợ hằng tháng, sửa mái chống dột, gia cố khu sinh hoạt và bổ sung vật dụng thiết yếu.",
  keyword: "Kho vận Cẩm Phả hỗ trợ cựu thanh niên xung phong",
  keywords: ["Kho vận Cẩm Phả hỗ trợ cựu thanh niên xung phong", "TKV hỗ trợ cộng đồng", "an sinh xã hội ngành Than", "sửa nhà cựu thanh niên xung phong", "Cửa Ông Quảng Ninh"],
  facts: [["Khu Cửa Ông 7", "Nơi gia đình cựu nữ thanh niên xung phong đang sinh sống."], ["Hỗ trợ hằng tháng", "Một phần của phương án dài hạn được đoàn công tác nêu."], ["Sửa mái và gia cố", "Nhóm việc dự kiến cải thiện điều kiện ở và sinh hoạt."], ["Khảo sát tại nhà", "Bước xác định nhu cầu thực tế trước khi triển khai hỗ trợ."]],
  intro: [
    "Hoạt động <strong>Kho vận Cẩm Phả hỗ trợ cựu thanh niên xung phong</strong> tại phường Cửa Ông, Quảng Ninh được Công đoàn Than – Khoáng sản Việt Nam thông tin ngày 13/08/2026. Đoàn Công ty Kho vận và Cảng Cẩm Phả – Vinacomin phối hợp với Ban chỉ huy quân sự phường đến khảo sát trực tiếp gia đình bà Mai Thị Chút.",
    "Căn nhà cấp 4 đã xuống cấp và gia đình cần hỗ trợ về nơi ở, sinh hoạt. Đoàn công tác thảo luận phương án gồm khoản hỗ trợ hằng tháng, sửa mái chống dột, vệ sinh, gia cố bếp và bổ sung thiết bị thiết yếu.",
    "Các nội dung đang ở bước khảo sát và dự kiến triển khai, vì vậy chưa thể coi toàn bộ hạng mục đã hoàn thành tại thời điểm công bố ngày 13/08/2026.",
  ],
  sections: [
    {title: "Khảo sát tại nhà giúp xác định đúng nhu cầu cần ưu tiên", paragraphs: [
      "Đoàn công tác quan sát trực tiếp mái nhà, khu sinh hoạt và bếp để biết hạng mục nào ảnh hưởng nhiều nhất tới an toàn hằng ngày. Sửa chống dột và gia cố không gian ở cần được xếp trước các phần trang trí hoặc vật dụng ít cấp thiết hơn.",
      "Sự tham gia của đại diện địa phương giúp đối chiếu hoàn cảnh, phối hợp thi công và theo dõi sau hỗ trợ. Cách làm này giảm nguy cơ hỗ trợ trùng lặp hoặc bỏ sót nhu cầu quan trọng của người được nhận.",
    ]},
    {title: "Phương án dài hạn cần mốc thời gian và đầu mối rõ", paragraphs: [
      "Khoản hỗ trợ thường xuyên và việc sửa nhà là hai dòng công việc khác nhau. Công ty cần xác định người phụ trách, lịch chuyển hỗ trợ, phạm vi sửa chữa và cách nghiệm thu để cam kết có thể kiểm chứng.",
      "Gia đình cũng nên được thông báo trước về thời gian khảo sát kỹ thuật, thi công và bàn giao. Với người cao tuổi, việc sắp xếp chỗ ở tạm cùng an toàn trong quá trình sửa chữa cần được tính ngay từ đầu.",
    ]},
    {title: "Trách nhiệm cộng đồng được đo bằng kết quả sau khảo sát", paragraphs: [
      "Chuyến thăm tạo điểm khởi đầu, còn giá trị bền vững xuất hiện khi mái nhà hết dột, khu sinh hoạt an toàn và khoản hỗ trợ đến đều. Công khai tiến độ trong nội bộ giúp chương trình giữ được sự tin cậy.",
      "Sau khi hoàn thành, đơn vị nên đánh giá lại điều kiện sử dụng và nhu cầu phát sinh. Những bài học từ một trường hợp cụ thể có thể giúp các chương trình an sinh sau lựa chọn hạng mục sát thực tế hơn.",
    ]},
  ],
  factsTitle: "Những nội dung phương án đã nêu", actionTitle: "Cách theo dõi một chương trình hỗ trợ dài hạn", conclusionTitle: "Khảo sát kỹ là nền tảng để hỗ trợ đúng việc",
  checklist: [["Chốt hạng mục", "Xác định phần mái, bếp và khu sinh hoạt cần xử lý trước."], ["Lập lịch thực hiện", "Ghi rõ thời gian hỗ trợ thường xuyên, sửa chữa và bàn giao."], ["Giữ đầu mối", "Phân công người liên hệ giữa Công ty, địa phương và gia đình."], ["Kiểm tra sau bàn giao", "Đánh giá độ an toàn và khả năng sử dụng của các hạng mục đã làm."]],
  takeaway: "Kho vận và Cảng Cẩm Phả đã khảo sát hoàn cảnh cựu nữ thanh niên xung phong tại Cửa Ông và nêu phương án hỗ trợ dài hạn. Kết quả cần được theo dõi qua tiến độ sửa nhà, hỗ trợ thường xuyên và điều kiện sinh hoạt sau bàn giao.",
  faq: [["Đơn vị nào thực hiện khảo sát hỗ trợ?", "Công ty Kho vận và Cảng Cẩm Phả – Vinacomin phối hợp với Ban chỉ huy quân sự phường Cửa Ông."], ["Phương án dự kiến gồm những gì?", "Phương án gồm hỗ trợ hằng tháng, sửa mái, vệ sinh, gia cố khu sinh hoạt và bổ sung thiết bị thiết yếu."], ["Các hạng mục đã hoàn thành chưa?", "Tại thời điểm 13/08/2026, đoàn đang khảo sát và thảo luận phương án cụ thể."], ["Vì sao cần nghiệm thu sau sửa chữa?", "Nghiệm thu giúp xác nhận hạng mục an toàn, dùng được và đúng với nhu cầu đã khảo sát."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Đoàn công tác Công ty khảo sát, hỗ trợ gia đình nữ thanh niên xung phong đơn thân", date: "13/08/2026", url: images["kho-van-cam-pha-ho-tro-cuu-thanh-nien-xung-phong-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật Kho vận Cẩm Phả hỗ trợ cựu thanh niên xung phong bằng khảo sát nhà ở và phương án chăm lo dài hạn tại Cửa Ông.",
});

export const nuiBeoTnxpArticle20260821 = withImage("than-nui-beo-ho-tro-cuu-thanh-nien-xung-phong-2026", {
  updated: "2026-08-21T08:23:00+07:00", published: "2026-08-21T08:23:00+07:00",
  urlPath: "tin-nganh-than/2026/08/21/than-nui-beo-ho-tro-cuu-thanh-nien-xung-phong-2026",
  related: ["kho-van-cam-pha-ho-tro-cuu-thanh-nien-xung-phong-2026", "cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026", "than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026"],
  section: "An sinh xã hội",
  title: "Than Núi Béo hỗ trợ thường xuyên cựu nữ thanh niên xung phong",
  description: "Than Núi Béo khảo sát hoàn cảnh và thống nhất hỗ trợ thường xuyên cựu nữ thanh niên xung phong sống đơn thân tại Việt Hưng, Quảng Ninh.",
  lead: "Việc đến tận nơi giúp doanh nghiệp nắm tình trạng nhà ở, sức khỏe và nhu cầu trước khi duy trì hỗ trợ lâu dài.",
  keyword: "Than Núi Béo hỗ trợ cựu thanh niên xung phong",
  keywords: ["Than Núi Béo hỗ trợ cựu thanh niên xung phong", "TKV an sinh xã hội", "hỗ trợ người có công Quảng Ninh", "cộng đồng thợ mỏ", "phường Việt Hưng"],
  facts: [["Ngày 13/08/2026", "Thời điểm đoàn Than Núi Béo tới khảo sát trực tiếp."], ["Phường Việt Hưng", "Địa bàn người được hỗ trợ đang sinh sống."], ["Hỗ trợ thường xuyên", "Hình thức đã được Công ty thống nhất sau khảo sát."], ["Nhà ở xuống cấp", "Một trong các khó khăn được đoàn công tác ghi nhận."]],
  intro: [
    "Chương trình <strong>Than Núi Béo hỗ trợ cựu thanh niên xung phong</strong> Nguyễn Thị Nhin tại phường Việt Hưng, Quảng Ninh được công bố ngày 13/08/2026. Đoàn doanh nghiệp đến thăm, khảo sát nơi ở và trao quà động viên.",
    "Bà Nhin từng tham gia lực lượng thanh niên xung phong phục vụ bảo vệ biên giới phía Bắc giai đoạn 1978–1982. Bà sống đơn thân, sức khỏe suy giảm và căn nhà cấp 4 ngày càng xuống cấp.",
    "Sau khảo sát, Than Núi Béo thống nhất hỗ trợ thường xuyên nhưng chưa công bố con số cụ thể, vì vậy không có căn cứ suy đoán giá trị hoặc thời hạn hỗ trợ.",
  ],
  sections: [
    {title: "Than Núi Béo khảo sát hoàn cảnh trước khi hỗ trợ định kỳ", paragraphs: [
      "Thông tin tại nơi ở giúp doanh nghiệp nhìn đầy đủ hơn nhu cầu sức khỏe, đi lại và điều kiện sinh hoạt. Với người sống một mình, đầu mối liên hệ khi cần hỗ trợ khẩn cấp cũng quan trọng như khoản tiền định kỳ.",
      "Khảo sát là bước kiểm chứng đối tượng và hoàn cảnh. Kết luận hỗ trợ cần được ghi nhận bằng kế hoạch nội bộ để việc chuyển giao không phụ thuộc vào một chuyến thăm hoặc một cá nhân phụ trách.",
    ]},
    {title: "Không công bố mức tiền thì không nên tự suy rộng", paragraphs: [
      "Doanh nghiệp thống nhất hỗ trợ thường xuyên nhưng không nêu số tiền. Người đọc chỉ nên ghi nhận tính định kỳ của chương trình, chưa có căn cứ so sánh với các đơn vị TKV khác.",
      "Khi mức hỗ trợ được xác định, gia đình và đơn vị phụ trách cần thống nhất hình thức nhận, lịch chuyển và cách xử lý nếu thông tin tài khoản thay đổi. Những chi tiết nhỏ này quyết định tính liên tục của chương trình.",
    ]},
    {title: "Chăm lo người có công cần gắn với điều kiện sống thực tế", paragraphs: [
      "Hỗ trợ tài chính góp phần giảm áp lực sinh hoạt, còn nhà ở xuống cấp và sức khỏe hạn chế có thể cần thêm kết nối với địa phương, y tế hoặc chương trình sửa chữa phù hợp.",
      "Doanh nghiệp nên thăm lại theo chu kỳ để biết khoản hỗ trợ có đến đúng người và hoàn cảnh có thay đổi hay không. Theo dõi sau hỗ trợ giúp hoạt động tri ân duy trì ý nghĩa lâu dài.",
    ]},
  ],
  factsTitle: "Thông tin đã được Than Núi Béo xác nhận", actionTitle: "Ba lớp theo dõi để hỗ trợ không bị gián đoạn", conclusionTitle: "Cam kết định kỳ cần đi cùng đầu mối theo dõi",
  checklist: [["Xác nhận người phụ trách", "Giữ đầu mối giữa doanh nghiệp, địa phương và người được nhận."], ["Thống nhất cách nhận", "Chọn hình thức chuyển phù hợp và có thể đối chiếu."], ["Theo dõi sức khỏe", "Cập nhật nhu cầu đi lại, khám chữa bệnh và sinh hoạt."], ["Đánh giá nơi ở", "Kết nối chương trình phù hợp nếu nhà xuống cấp ảnh hưởng an toàn."]],
  takeaway: "Than Núi Béo đã khảo sát và thống nhất hỗ trợ thường xuyên một cựu nữ thanh niên xung phong tại Việt Hưng. Mức tiền chưa được công bố, nên trọng tâm kiểm chứng là tính liên tục và hiệu quả thực tế của việc chăm lo.",
  faq: [["Than Núi Béo hỗ trợ ai?", "Một cựu nữ thanh niên xung phong đang sống đơn thân tại phường Việt Hưng, Quảng Ninh."], ["Mức hỗ trợ đã được công bố chưa?", "Chưa. Công ty mới xác nhận hình thức hỗ trợ thường xuyên."], ["Đoàn công tác đã làm gì?", "Đoàn đến thăm, khảo sát hoàn cảnh, trao quà và đánh giá nhu cầu thực tế."], ["Thông tin này có phải chế độ chung không?", "Không. Đây là chương trình hỗ trợ một trường hợp cụ thể theo khảo sát của doanh nghiệp."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Núi Béo thăm, khảo sát gia cảnh khó khăn cựu nữ thanh niên xung phong", date: "13/08/2026", url: images["than-nui-beo-ho-tro-cuu-thanh-nien-xung-phong-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ việc Than Núi Béo hỗ trợ cựu thanh niên xung phong tại Việt Hưng và những thông tin nguồn chưa công bố.",
});

export const vatTuArticle20260821 = withImage("cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026", {
  updated: "2026-08-21T08:24:00+07:00", published: "2026-08-21T08:24:00+07:00",
  urlPath: "tin-nganh-than/2026/08/21/cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026",
  related: ["than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026", "than-nui-beo-ho-tro-cuu-thanh-nien-xung-phong-2026", "kho-van-cam-pha-ho-tro-cuu-thanh-nien-xung-phong-2026"],
  section: "An sinh xã hội",
  title: "Công ty Vật tư đỡ đầu cựu thanh niên xung phong từ quý III/2026",
  description: "Công ty Cổ phần Vật tư nhận hỗ trợ thường xuyên cựu thanh niên xung phong tại Hải Ninh với mức 1.000.000 đồng hằng tháng từ quý III/2026.",
  lead: "Khoản hỗ trợ định kỳ được công bố cùng cam kết đồng hành khi gia đình phát sinh khó khăn lớn trong cuộc sống.",
  keyword: "Công ty Vật tư đỡ đầu cựu thanh niên xung phong 2026",
  keywords: ["Công ty Vật tư đỡ đầu cựu thanh niên xung phong 2026", "TKV hỗ trợ cộng đồng", "an sinh xã hội ngành Than", "hỗ trợ cựu thanh niên xung phong", "xã Hải Ninh Quảng Ninh"],
  facts: [["1.000.000 đồng hằng tháng", "Mức hỗ trợ thường xuyên được doanh nghiệp công bố."], ["Từ quý III/2026", "Thời điểm chương trình bắt đầu theo thông tin ngày 15/08/2026."], ["Xã Hải Ninh", "Nơi cựu thanh niên xung phong được hỗ trợ đang cư trú."], ["Hỗ trợ phát sinh", "Doanh nghiệp cam kết đồng hành khi gia đình gặp khó khăn lớn."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 15/08/2026 đăng bài về chương trình <strong>Công ty Vật tư đỡ đầu cựu thanh niên xung phong 2026</strong>. Đoàn Công ty Cổ phần Vật tư đã tới thăm bà Đặng Thị Bình, cựu thanh niên xung phong hiện sống tại xã Hải Ninh, Quảng Ninh.",
    "Doanh nghiệp công bố hỗ trợ thường xuyên 1.000.000 đồng mỗi tháng từ quý III/2026. Đại diện Công ty cũng nêu cam kết chủ động phối hợp khi gia đình gặp khó khăn lớn phát sinh trong cuộc sống.",
    "Khoản tiền là mức dành cho trường hợp cụ thể đã được khảo sát, không phải chính sách chung của TKV. Người đọc cần phân biệt hoạt động trách nhiệm xã hội của doanh nghiệp với các chế độ người có công do cơ quan nhà nước thực hiện.",
  ],
  sections: [
    {title: "Công ty Vật tư đỡ đầu bằng khoản hỗ trợ có thời điểm rõ", paragraphs: [
      "Mốc bắt đầu từ quý III và mức 1.000.000 đồng hằng tháng giúp chương trình có căn cứ để theo dõi. Gia đình biết thời gian dự kiến nhận, còn doanh nghiệp dễ đối chiếu việc thực hiện theo từng kỳ.",
      "Cam kết hỗ trợ khi có khó khăn lớn mở thêm một kênh đồng hành ngoài khoản định kỳ. Để vận hành rõ ràng, hai bên cần thống nhất đầu mối tiếp nhận thông tin và cách xác minh nhu cầu phát sinh.",
    ]},
    {title: "Hỗ trợ tài chính cần bảo đảm đến đúng người", paragraphs: [
      "Hình thức chi trả nên thuận tiện với sức khỏe của người được nhận và có dấu vết đối chiếu. Nếu chuyển qua người thân, hồ sơ cần ghi rõ người đại diện cùng phạm vi sử dụng để tránh nhầm lẫn.",
      "Doanh nghiệp có thể kiểm tra định kỳ bằng trao đổi với gia đình và chính quyền địa phương. Mục tiêu là duy trì hỗ trợ ổn định, tôn trọng đời tư và hạn chế thủ tục gây khó cho người cao tuổi.",
    ]},
    {title: "Hoạt động tri ân bổ sung cho mạng lưới an sinh địa phương", paragraphs: [
      "Sự tham gia của doanh nghiệp tạo thêm nguồn lực chăm lo người có công và đối tượng yếu thế. Nguồn lực này phát huy hiệu quả khi phối hợp với thông tin của địa phương, tránh trùng với chương trình đã có.",
      "Công bố đúng mức, đúng thời điểm và đúng phạm vi giúp người lao động hiểu trách nhiệm xã hội của đơn vị. Đây cũng là cách văn hóa ngành Than được thể hiện qua hành động có thể theo dõi.",
    ]},
  ],
  factsTitle: "Cam kết hỗ trợ đã được công bố", actionTitle: "Các điểm cần ghi nhận trong quá trình đỡ đầu", conclusionTitle: "Một khoản đều đặn tạo điểm tựa có thể dự tính",
  checklist: [["Giữ lịch chi trả", "Theo dõi khoản hỗ trợ từ quý III theo từng tháng."], ["Xác định đầu mối", "Thống nhất người liên hệ khi sức khỏe hoặc hoàn cảnh thay đổi."], ["Bảo vệ riêng tư", "Chỉ chia sẻ thông tin cần thiết cho việc chăm lo."], ["Phối hợp địa phương", "Đối chiếu các chương trình đang có để sử dụng nguồn lực hiệu quả."]],
  takeaway: "Công ty Cổ phần Vật tư công bố hỗ trợ cựu thanh niên xung phong tại Hải Ninh 1.000.000 đồng hằng tháng từ quý III/2026. Mốc thời gian và mức tiền rõ giúp chương trình có thể được theo dõi minh bạch.",
  faq: [["Mức hỗ trợ hằng tháng là bao nhiêu?", "Công ty công bố mức 1.000.000 đồng mỗi tháng."], ["Chương trình bắt đầu khi nào?", "Bài nguồn nêu thời điểm bắt đầu từ quý III năm 2026."], ["Người được hỗ trợ sống ở đâu?", "Bà Đặng Thị Bình đang cư trú tại xã Hải Ninh, tỉnh Quảng Ninh."], ["Khoản này có thay thế chế độ nhà nước không?", "Không. Đây là hỗ trợ trách nhiệm xã hội của doanh nghiệp cho một trường hợp cụ thể."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Công ty Cổ phần Vật tư đồng hành chăm lo đời sống cựu thanh niên xung phong", date: "15/08/2026", url: images["cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật Công ty Vật tư đỡ đầu cựu thanh niên xung phong 2026 với mức hỗ trợ và thời điểm được công bố rõ ràng.",
});

export const haLongHouseArticle20260821 = withImage("than-ha-long-ho-tro-xay-sua-nha-gia-dinh-chinh-sach-2026", {
  updated: "2026-08-21T08:25:00+07:00", published: "2026-08-21T08:25:00+07:00",
  urlPath: "tin-nganh-than/2026/08/21/than-ha-long-ho-tro-xay-sua-nha-gia-dinh-chinh-sach-2026",
  related: ["nha-o-tho-mo-quang-ninh-2026", "than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Hạ Long hỗ trợ 183 triệu đồng sửa nhà chính sách",
  description: "TKV và Than Hạ Long hỗ trợ tổng giá trị 183 triệu đồng để gia đình một nguyên thợ lò tại Hải Phòng xây, sửa nhà và ổn định cuộc sống.",
  lead: "Nguồn lực gồm 150 triệu đồng từ Quỹ Phúc lợi TKV, 30 triệu đồng từ quỹ người lao động và quà hiện vật trị giá 3 triệu đồng.",
  keyword: "Than Hạ Long hỗ trợ xây sửa nhà 2026",
  keywords: ["Than Hạ Long hỗ trợ xây sửa nhà 2026", "TKV hỗ trợ gia đình chính sách", "nhà ở gia đình thợ lò", "Quỹ Phúc lợi TKV", "an sinh xã hội ngành Than", "Kinh Môn Hải Phòng"],
  facts: [["150 triệu đồng", "Khoản từ Quỹ Phúc lợi TKV dành cho xây, sửa nhà."], ["30 triệu đồng", "Khoản Than Hạ Long hỗ trợ từ Quỹ Người lao động đóng góp."], ["3 triệu đồng", "Giá trị phần quà hiện vật được trao cùng đợt."], ["183 triệu đồng", "Tổng giá trị tiền và hiện vật được công bố."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 15/08/2026 đăng thông tin <strong>Than Hạ Long hỗ trợ xây sửa nhà 2026</strong> cho gia đình chị Đào Thị Hương tại phường Kinh Môn, Hải Phòng. Chị là vợ ông Nguyễn Văn Giáp, nguyên thợ lò bậc 5/5 của Công ty Than Hạ Long.",
    "Gói hỗ trợ gồm 150 triệu đồng từ Quỹ Phúc lợi TKV, 30 triệu đồng từ Quỹ “Người lao động đóng góp” của Công ty và phần quà hiện vật trị giá 3 triệu đồng. Tổng giá trị được công bố là 183 triệu đồng.",
    "Đây là hỗ trợ đợt 1 dành cho một gia đình chính sách đã được xét duyệt. Con số không đại diện cho mức cố định của mọi chương trình nhà ở hoặc mọi người lao động trong Tập đoàn.",
  ],
  sections: [
    {title: "Than Hạ Long hỗ trợ xây sửa nhà từ ba nguồn lực", paragraphs: [
      "Việc tách rõ 150 triệu đồng, 30 triệu đồng và quà hiện vật giúp người đọc hiểu cơ cấu hỗ trợ. Quỹ Tập đoàn đảm nhận phần chính, còn doanh nghiệp và tập thể người lao động bổ sung nguồn lực tại đơn vị.",
      "Gia đình cần có dự toán xây, sửa và hồ sơ nghiệm thu phù hợp với quy định của từng quỹ. Cách quản lý này giúp khoản hỗ trợ đi đúng hạng mục và hạn chế phát sinh ngoài khả năng chi trả.",
    ]},
    {title: "Nơi ở ổn định là một phần của chăm lo hậu phương thợ mỏ", paragraphs: [
      "Gia đình nguyên thợ lò được cải thiện nhà ở sau những năm người lao động gắn bó với sản xuất hầm lò. Sự hỗ trợ ghi nhận đóng góp nghề nghiệp và giảm áp lực về điều kiện sinh hoạt hiện tại.",
      "Chương trình nhà ở có tác động lâu dài hơn một lần thăm hỏi nếu công trình bảo đảm an toàn, phù hợp số người sử dụng và có kế hoạch bảo trì. Khảo sát kỹ thuật trước khi làm là bước cần thiết.",
    ]},
    {title: "Minh bạch kinh phí giúp chương trình an sinh có sức thuyết phục", paragraphs: [
      "Công bố nguồn quỹ và giá trị từng phần cho phép tập thể theo dõi trách nhiệm của mỗi bên. Sau bàn giao, chứng từ, hình ảnh và kết quả sử dụng nên được lưu trong hồ sơ chương trình.",
      "Các đợt tiếp theo cần giữ cùng nguyên tắc lựa chọn đúng đối tượng, xác định nhu cầu nhà ở và công khai phạm vi hỗ trợ. Người lao động muốn tìm hiểu quyền lợi nên hỏi đầu mối Công đoàn tại đơn vị, không suy ra từ một trường hợp riêng.",
    ]},
  ],
  factsTitle: "Cơ cấu gói hỗ trợ 183 triệu đồng", actionTitle: "Những bước cần có từ trao kinh phí đến bàn giao", conclusionTitle: "Nguồn lực phối hợp giúp gia đình cải thiện nơi ở",
  checklist: [["Khảo sát công trình", "Xác định hạng mục xây mới hoặc sửa chữa cần ưu tiên."], ["Lập dự toán", "Đối chiếu chi phí với phạm vi của từng nguồn quỹ."], ["Theo dõi tiến độ", "Ghi nhận mốc thi công, thanh toán và phát sinh."], ["Nghiệm thu bàn giao", "Kiểm tra an toàn, chất lượng và hồ sơ sử dụng kinh phí."]],
  takeaway: "TKV và Than Hạ Long công bố gói hỗ trợ tổng giá trị 183 triệu đồng cho gia đình một nguyên thợ lò tại Hải Phòng. Cơ cấu kinh phí rõ ràng tạo nền tảng để việc xây, sửa nhà được theo dõi minh bạch.",
  faq: [["Tổng giá trị hỗ trợ là bao nhiêu?", "Tổng tiền và hiện vật được công bố là 183 triệu đồng."], ["Quỹ Phúc lợi TKV hỗ trợ bao nhiêu?", "Quỹ Phúc lợi TKV hỗ trợ 150 triệu đồng để xây, sửa nhà."], ["Than Hạ Long đóng góp phần nào?", "Công ty hỗ trợ 30 triệu đồng từ Quỹ Người lao động đóng góp và quà hiện vật trị giá 3 triệu đồng."], ["Đây có phải mức chung cho mọi gia đình không?", "Không. Đây là trường hợp thuộc đợt 1 và được xét theo hoàn cảnh cụ thể."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Hạ Long trao kinh phí hỗ trợ xây, sửa nhà cho gia đình chính sách", date: "15/08/2026", url: images["than-ha-long-ho-tro-xay-sua-nha-gia-dinh-chinh-sach-2026"].sourceUrl}],
  seoLine: "Bài viết làm rõ gói Than Hạ Long hỗ trợ xây sửa nhà 2026, cơ cấu 183 triệu đồng và phạm vi áp dụng của chương trình.",
});

export const caThanhArticle20260821 = withImage("than-nui-beo-thanh-nien-ca-thanh-tim-hieu-nghe-mo-2026", {
  updated: "2026-08-21T08:26:00+07:00", published: "2026-08-21T08:26:00+07:00",
  urlPath: "tin-nganh-than/2026/08/21/than-nui-beo-thanh-nien-ca-thanh-tim-hieu-nghe-mo-2026",
  related: ["tuyen-sinh-nghe-mo-dong-ngu-2026", "tuyen-sinh-nghe-mo-thai-nguyen-2026", "hoc-sinh-thuc-tap-than-khe-cham-2026", "viec-lam-nganh-than-thang-8-2026"],
  section: "Kết nối địa phương",
  title: "22 thanh niên Ca Thành tìm hiểu nghề mỏ tại Than Núi Béo",
  description: "22 thanh niên xã Ca Thành, Cao Bằng tham quan Than Núi Béo, tìm hiểu nghề thợ lò, điều kiện làm việc và lộ trình học nghề mỏ năm 2026.",
  lead: "Chuyến đi đưa người lao động đến khai trường, lò chợ cơ giới hóa và khu sinh hoạt để đối chiếu thông tin tuyển sinh với môi trường thực tế.",
  keyword: "thanh niên Ca Thành học nghề mỏ 2026",
  keywords: ["thanh niên Ca Thành học nghề mỏ 2026", "tuyển sinh nghề mỏ Cao Bằng", "Than Núi Béo tuyển thợ lò", "việc làm ngành Than", "Trường Cao đẳng TKV", "học nghề mỏ Quảng Ninh"],
  facts: [["22 thanh niên", "Số người trong độ tuổi lao động tham gia đoàn Ca Thành."], ["Ngày 14/08/2026", "Thời điểm chương trình gặp mặt và tham quan diễn ra."], ["Lò chợ cơ giới hóa", "Một trong các vị trí sản xuất đoàn được tìm hiểu."], ["Ba đầu mối", "Địa phương, Nhà trường và doanh nghiệp được đề nghị tiếp tục phối hợp."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 17/08/2026 đăng bài về 22 <strong>thanh niên Ca Thành học nghề mỏ 2026</strong> qua chuyến tìm hiểu tại Công ty Cổ phần Than Núi Béo. Đoàn xã Ca Thành, tỉnh Cao Bằng tham quan khai trường, cơ sở vật chất và điều kiện sinh hoạt của người lao động.",
    "Các thanh niên được nghe doanh nghiệp giới thiệu sản xuất, nhu cầu tuyển dụng và đào tạo thợ lò. Công nhân quê Ca Thành đang làm việc tại Công ty chia sẻ trực tiếp về điều kiện làm việc, chế độ và quá trình thích nghi với môi trường hầm lò.",
    "Chuyến tham quan giúp người lao động có thêm căn cứ trước khi đăng ký, nhưng chưa phải thông báo trúng tuyển hoặc cam kết nhận việc. Ứng viên vẫn cần đối chiếu tiêu chuẩn sức khỏe, hồ sơ, chương trình học và nhu cầu tuyển ở từng đợt.",
  ],
  sections: [
    {title: "Thanh niên Ca Thành học nghề mỏ từ trải nghiệm khai trường", paragraphs: [
      "Việc nhìn trực tiếp lò chợ cơ giới hóa, hệ thống vận tải và nơi sinh hoạt giúp ứng viên hình dung công việc rõ hơn hình ảnh quảng bá. Người tham gia có thể hỏi về ca kíp, bảo hộ, bữa ăn, chỗ ở và quy trình xuống lò.",
      "Trải nghiệm thực tế cũng giúp người chưa phù hợp cân nhắc sớm, giảm quyết định theo phong trào. Tuyển đúng người ngay từ đầu có lợi cho người học, gia đình, Nhà trường và doanh nghiệp tiếp nhận.",
    ]},
    {title: "Chia sẻ của công nhân cùng quê tạo thông tin gần với người nghe", paragraphs: [
      "Người đã rời Ca Thành tới Quảng Ninh có thể kể cụ thể cách chuẩn bị hồ sơ, di chuyển, học nghề và ổn định sinh hoạt. Kinh nghiệm này giúp thanh niên nhận diện những thay đổi phải đối mặt khi xa nhà.",
      "Dù vậy, thu nhập và chế độ của mỗi cá nhân phụ thuộc vị trí, ngày công, định mức và thời điểm. Ứng viên nên dùng câu chuyện để hiểu quy trình, còn con số quyền lợi phải kiểm tra tại thông báo tuyển dụng hiện hành.",
    ]},
    {title: "Phối hợp ba bên cần nối tiếp sau chuyến tham quan", paragraphs: [
      "Xã Ca Thành có thể rà soát người quan tâm và hỗ trợ thông tin ban đầu. Trường Cao đẳng TKV phụ trách tư vấn chương trình đào tạo; Than Núi Béo cung cấp nhu cầu nhân lực và tiêu chuẩn tiếp nhận.",
      "Mỗi ứng viên cần biết rõ đầu mối cho từng bước để tránh nộp giấy tờ hoặc chi phí qua môi giới không được xác nhận. Lịch khám tuyển, nhập học và thực tập phải được thông báo bằng kênh chính thức.",
    ]},
  ],
  factsTitle: "Nội dung đoàn Ca Thành đã tìm hiểu", actionTitle: "Người quan tâm nghề mỏ nên làm gì sau chuyến đi", conclusionTitle: "Trải nghiệm thật giúp quyết định nghề nghiệp có căn cứ",
  checklist: [["Tự kiểm tra điều kiện", "Đối chiếu tuổi, sức khỏe, học vấn và khả năng làm việc theo ca."], ["Hỏi chương trình học", "Xác nhận nghề, thời gian, nơi học, thực tập và các khoản hỗ trợ."], ["Kiểm tra đợt tuyển", "Chỉ dùng tiêu chuẩn và quyền lợi được doanh nghiệp công bố tại thời điểm đăng ký."], ["Giữ đúng đầu mối", "Làm việc qua địa phương, Nhà trường hoặc doanh nghiệp; tránh môi giới không rõ thẩm quyền."]],
  takeaway: "22 thanh niên Ca Thành đã tham quan Than Núi Béo để hiểu nghề thợ lò và môi trường sống tại Quảng Ninh. Chuyến đi tạo thông tin thực tế, còn lộ trình học và việc làm vẫn phụ thuộc điều kiện từng ứng viên và đợt tuyển cụ thể.",
  faq: [["Có bao nhiêu thanh niên Ca Thành tham gia?", "Đoàn có 22 thanh niên trong độ tuổi lao động."], ["Đoàn được tìm hiểu những gì?", "Đoàn tham quan khai trường, lò chợ cơ giới hóa, cơ sở vật chất và điều kiện sinh hoạt của người lao động."], ["Tham quan có đồng nghĩa được nhận việc không?", "Không. Ứng viên còn phải đáp ứng tiêu chuẩn, hoàn thành đào tạo và theo nhu cầu tuyển của doanh nghiệp."], ["Ba bên nào được đề nghị tiếp tục phối hợp?", "Xã Ca Thành, Trường Cao đẳng Than – Khoáng sản Việt Nam và Công ty Cổ phần Than Núi Béo."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Núi Béo gặp mặt đoàn cán bộ và thanh niên xã Ca Thành, tỉnh Cao Bằng", date: "17/08/2026", url: images["than-nui-beo-thanh-nien-ca-thanh-tim-hieu-nghe-mo-2026"].sourceUrl}],
  seoLine: "Bài viết giải thích lộ trình thanh niên Ca Thành học nghề mỏ 2026 sau chuyến tham quan Than Núi Béo và các bước cần xác minh trước khi đăng ký.",
});

export const daBacArticle20260821 = withImage("kho-van-da-bac-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026", {
  updated: "2026-08-21T08:27:00+07:00", published: "2026-08-21T08:27:00+07:00",
  urlPath: "tin-nganh-than/2026/08/21/kho-van-da-bac-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026",
  related: ["than-ha-tu-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026", "phuc-loi-tho-mo-tkv-2026", "nha-o-tho-mo-quang-ninh-2026"],
  section: "An sinh xã hội",
  title: "Kho vận Đá Bạc hỗ trợ 3 nữ công nhân phát triển mô hình nuôi gà",
  description: "Ba nữ công nhân Kho vận Đá Bạc được hỗ trợ mô hình 300 con gà; sau gần một năm, tổng lợi nhuận được công bố đạt 56,45 triệu đồng.",
  lead: "Con giống, thức ăn, thuốc phòng bệnh và hướng dẫn kỹ thuật tạo nền tảng để ba gia đình chủ động tái đàn sau giai đoạn hỗ trợ.",
  keyword: "Kho vận Đá Bạc hỗ trợ nữ công nhân 2026",
  keywords: ["Kho vận Đá Bạc hỗ trợ nữ công nhân 2026", "mô hình nuôi gà công nhân", "nữ công nhân khó khăn TKV", "an sinh xã hội ngành Than", "phát triển kinh tế gia đình", "công nhân Uông Bí Mạo Khê"],
  facts: [["3 nữ công nhân", "Số hộ tham gia mô hình tại hai phân xưởng Mạo Khê và Uông Bí."], ["300 con gà", "Tổng số con giống bản địa được bàn giao."], ["102,5 triệu đồng", "Tổng doanh thu của ba mô hình theo kết quả công bố."], ["56,45 triệu đồng", "Tổng lợi nhuận được ghi nhận sau gần một năm."]],
  intro: [
    "Công đoàn Than – Khoáng sản Việt Nam ngày 19/08/2026 đăng kết quả chương trình <strong>Kho vận Đá Bạc hỗ trợ nữ công nhân 2026</strong>. Ba nữ công nhân có hoàn cảnh khó khăn được hỗ trợ phát triển mô hình nuôi gà tại gia đình trong giai đoạn 4 của đề án.",
    "Chương trình bàn giao tổng cộng 300 con gà bản địa, kết hợp hỗ trợ thức ăn, thuốc phòng bệnh và chuyển giao kỹ thuật. Các hộ mở sổ theo dõi chăn nuôi, chủ động tận dụng nguồn thức ăn sẵn có để kiểm soát chi phí.",
    "Sau gần một năm, tổng doanh thu được công bố là 102,5 triệu đồng và tổng lợi nhuận đạt 56,45 triệu đồng của ba hộ. Đây là kết quả gộp của mô hình cụ thể, không phải mức thu nhập cố định hoặc cam kết cho người tham gia khác.",
  ],
  sections: [
    {title: "Kho vận Đá Bạc hỗ trợ nữ công nhân theo chuỗi đầu vào", paragraphs: [
      "Ba hộ nhận con giống đã được lựa chọn và tiêm phòng, cùng thức ăn, thuốc phòng bệnh và hướng dẫn kỹ thuật. Hỗ trợ đồng bộ giúp giảm rủi ro ở giai đoạn đầu, khi người nuôi chưa có nhiều kinh nghiệm.",
      "Thời điểm bàn giao và chất lượng con giống ảnh hưởng trực tiếp tỷ lệ sống. Việc ghi sổ lịch vắc-xin, lượng thức ăn và diễn biến đàn gà giúp gia đình điều chỉnh sớm trước khi thiệt hại lan rộng.",
    ]},
    {title: "Kết quả tài chính cần đọc theo quy mô ba hộ", paragraphs: [
      "Các số liệu 102,5 triệu đồng doanh thu và 56,45 triệu đồng lợi nhuận là tổng của ba gia đình sau gần một năm. Bình quân mỗi hộ có phần lãi gần 19 triệu đồng trong cả chu kỳ được phản ánh.",
      "Kết quả thực tế từng hộ có thể khác nhau do tỷ lệ hao hụt, chi phí thức ăn và thời điểm bán. Khi đánh giá mô hình, cần xem cả thời gian lao động của gia đình và khả năng duy trì đàn sau khi nguồn hỗ trợ kết thúc.",
    ]},
    {title: "Khả năng tự tái đàn quyết định tính bền vững", paragraphs: [
      "Ba hộ đã tích lũy kinh nghiệm và dành một phần nguồn thu để tiếp tục gây giống, tái đàn. Đây là dấu hiệu cho thấy nguồn hỗ trợ ban đầu đang chuyển dần thành năng lực tự chủ.",
      "Mở rộng đàn cần thận trọng với dịch bệnh và đầu ra. Công đoàn có thể tiếp tục kết nối kỹ thuật, còn gia đình nên tính điểm hòa vốn và giữ quỹ dự phòng trước khi tăng quy mô.",
    ]},
  ],
  factsTitle: "Kết quả mô hình nuôi gà của ba hộ", actionTitle: "Những dữ liệu cần theo dõi ở lần tái đàn", conclusionTitle: "Từ hỗ trợ ban đầu tới khả năng tự duy trì",
  checklist: [["Tách chi phí từng lứa", "Ghi riêng con giống, thức ăn, thuốc và tỷ lệ hao hụt."], ["Theo dõi đầu ra", "Lưu giá bán, thời điểm bán và lượng tồn để tính hiệu quả thật."], ["Giữ quỹ phòng bệnh", "Dành nguồn lực cho tiêm phòng, vệ sinh và xử lý rủi ro."], ["Tăng đàn có kiểm soát", "Chỉ mở rộng khi chuồng trại, thời gian và thị trường phù hợp."]],
  takeaway: "Ba nữ công nhân Kho vận Đá Bạc được hỗ trợ mô hình 300 con gà và đạt tổng lợi nhuận 56,45 triệu đồng sau gần một năm. Khả năng ghi chép, phòng bệnh và tự tái đàn là thước đo quan trọng cho hiệu quả dài hạn.",
  faq: [["Có bao nhiêu nữ công nhân tham gia mô hình?", "Có ba nữ công nhân tại các phân xưởng vận hành thiết bị Mạo Khê và Uông Bí."], ["Mô hình được hỗ trợ bao nhiêu con giống?", "Tổng cộng 300 con gà bản địa được bàn giao cho ba hộ."], ["Kết quả lợi nhuận được công bố là bao nhiêu?", "Tổng lợi nhuận của ba hộ sau gần một năm là 56,45 triệu đồng."], ["Con số này có phải thu nhập cố định không?", "Không. Đây là kết quả gộp của một mô hình cụ thể và phụ thuộc chi phí, hao hụt cùng giá bán."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Hiệu quả thiết thực từ mô hình hỗ trợ nữ CNLĐ khó khăn phát triển kinh tế gia đình", date: "19/08/2026", url: images["kho-van-da-bac-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026"].sourceUrl}],
  seoLine: "Bài viết phân tích cách Kho vận Đá Bạc hỗ trợ nữ công nhân 2026, kết quả mô hình nuôi gà và điều kiện để tiếp tục tái đàn.",
});

export const dailyCommunityArticles20260821 = [
  haTuArticle20260821,
  camPhaArticle20260821,
  nuiBeoTnxpArticle20260821,
  vatTuArticle20260821,
  haLongHouseArticle20260821,
  caThanhArticle20260821,
  daBacArticle20260821,
];
