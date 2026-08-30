import {dailyCommunitySourceImages20260830 as images} from "./daily-community-source-images-20260830.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, sourceImageChecksum: image.verifiedSha256, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const thongNhatNationalDayGiftArticle20260830 = withImage("than-thong-nhat-trao-qua-quoc-khanh-nguoi-lao-dong-2026", {
  updated: "2026-08-30T08:58:00+07:00",
  published: "2026-08-30T08:58:00+07:00",
  urlPath: "tin-nganh-than/2026/08/30/than-thong-nhat-trao-qua-quoc-khanh-nguoi-lao-dong-2026",
  related: ["than-thong-nhat-kham-suc-khoe-lao-dong-nang-nhoc-2026", "than-thong-nhat-cap-ao-bao-ho-mua-dong-2026", "tuyen-than-cua-ong-phuc-loi-nguoi-lao-dong-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Thống Nhất trao quà Quốc khánh cho người lao động",
  description: "Than Thống Nhất trao quà Quốc khánh cho toàn thể CBCNV; mỗi người nhận 2 triệu đồng, một chai mắm sá sùng Vân Đồn và 5 kg gạo ST25.",
  lead: "Phần quà kết hợp tiền mặt và nhu yếu phẩm được công bố theo mức cụ thể cho từng người, giúp người lao động hiểu đúng phạm vi chăm lo mà không suy diễn thành chế độ thường xuyên.",
  keyword: "Than Thống Nhất trao quà Quốc khánh 2026",
  keywords: ["Than Thống Nhất trao quà Quốc khánh 2026", "quà Quốc khánh người lao động", "phúc lợi thợ mỏ", "chăm lo công nhân ngành Than", "việc làm ngành Than Quảng Ninh", "Công ty Than Thống Nhất TKV"],
  facts: [["2 triệu đồng/người", "Khoản tiền mặt trong phần quà được nguồn chính thức công bố."], ["5 kg gạo ST25", "Lượng gạo trao cho mỗi cán bộ, công nhân viên."], ["Một chai mắm", "Mắm sá sùng Vân Đồn được trao cùng tiền và gạo."], ["27/08/2026", "Ngày Công ty Than Thống Nhất – TKV phát hành bài nguồn."]],
  intro: [
    "Công ty Than Thống Nhất – TKV ngày 27/08/2026 công bố hoạt động <strong>Than Thống Nhất trao quà Quốc khánh 2026</strong> cho toàn thể cán bộ, công nhân viên. Mỗi người nhận 2 triệu đồng tiền mặt, một chai mắm sá sùng Vân Đồn và 5 kg gạo ST25.",
    "Thông tin được công bố trước dịp Quốc khánh 2/9, hướng tới hỗ trợ đời sống vật chất và tạo thêm sự động viên tinh thần cho người lao động. Nguồn không nêu tổng số người nhận hoặc tổng kinh phí, vì vậy bài viết giữ nguyên mức quà theo từng người và không tự suy tính quy mô toàn chương trình.",
    "Đây là phần quà theo sự kiện do Công ty tổ chức, không phải khoản thu nhập cố định hoặc chính sách chung của mọi đơn vị TKV. Người lao động cần đối chiếu thông báo tại đúng doanh nghiệp, thời điểm và đối tượng áp dụng khi kiểm tra quyền lợi của mình.",
  ],
  sections: [
    {title: "Mức quà cụ thể giúp người lao động dễ đối chiếu", paragraphs: [
      "Nguồn chính thức nêu rõ ba thành phần của phần quà cho mỗi cán bộ, công nhân viên. Cách công bố theo đầu người hạn chế nhầm lẫn giữa khoản tiền mặt với giá trị của hiện vật, đồng thời giúp người nhận kiểm tra đủ nội dung khi bàn giao.",
      "Tiền mặt tạo sự chủ động cho chi tiêu gia đình, còn gạo và sản phẩm địa phương bổ sung nhu yếu phẩm trong dịp nghỉ lễ. Ý nghĩa của chương trình nằm ở sự chăm lo đúng thời điểm; không nên dùng một đợt quà để suy rộng thành mức phúc lợi cố định trong tương lai.",
    ]},
    {title: "Phúc lợi dịp lễ bổ sung cho hệ thống chăm sóc người lao động", paragraphs: [
      "Tại doanh nghiệp mỏ, những hoạt động động viên theo dịp có thể góp phần củng cố sự gắn kết, nhất là với lực lượng làm việc theo ca và thường xuyên chịu áp lực sản xuất. Tuy vậy, quà tặng không thay thế tiền lương, chế độ bảo hiểm, thời gian nghỉ hoặc điều kiện an toàn lao động.",
      "Người đang tìm hiểu việc làm ngành Than nên xem đây là một thông tin về văn hóa chăm lo tại Than Thống Nhất, đồng thời tiếp tục kiểm tra yêu cầu nghề, ca kíp, sức khỏe, thu nhập theo kết quả lao động và quyền lợi được xác nhận trong hồ sơ tuyển dụng.",
    ]},
    {title: "Minh bạch bàn giao giúp chương trình giữ đúng ý nghĩa", paragraphs: [
      "Khi phần quà áp dụng cho toàn thể cán bộ, công nhân viên, danh sách và xác nhận trao nhận cần được quản lý rõ ràng để hạn chế bỏ sót. Người lao động chưa nhận đủ thành phần nên phản ánh qua đơn vị, bộ phận nhân sự hoặc tổ chức Công đoàn theo quy trình nội bộ.",
      "Do nguồn không công bố số lượng lao động và tổng kinh phí, việc tự nhân mức quà với một con số nhân sự từ thời điểm khác có thể tạo kết quả sai. Truyền thông chừng mực giúp chương trình được ghi nhận đúng bản chất và bảo vệ độ tin cậy của thông tin phúc lợi.",
    ]},
  ],
  factsTitle: "Phần quà dành cho mỗi người lao động",
  actionTitle: "Người lao động nên đối chiếu như thế nào",
  conclusionTitle: "Chăm lo thiết thực cần đi cùng thông tin rõ ràng",
  checklist: [["Kiểm tra đủ phần quà", "Đối chiếu 2 triệu đồng, một chai mắm sá sùng và 5 kg gạo ST25."], ["Xác nhận đúng đối tượng", "Sử dụng danh sách và thông báo của Công ty tại thời điểm triển khai."], ["Phản ánh đúng đầu mối", "Liên hệ đơn vị, bộ phận nhân sự hoặc Công đoàn nếu có thiếu sót."], ["Không coi là thu nhập cố định", "Phân biệt quà dịp Quốc khánh với tiền lương và chế độ thường xuyên."]],
  takeaway: "Than Thống Nhất công bố phần quà Quốc khánh cho toàn thể cán bộ, công nhân viên, gồm 2 triệu đồng, một chai mắm sá sùng Vân Đồn và 5 kg gạo ST25 mỗi người. Mức quà đã được xác định rõ, còn tổng số người và tổng kinh phí không được nguồn công bố.",
  faq: [["Mỗi người lao động nhận phần quà gồm những gì?", "2 triệu đồng tiền mặt, một chai mắm sá sùng Vân Đồn và 5 kg gạo ST25 theo bài nguồn."], ["Chương trình áp dụng cho ai?", "Nguồn chính thức nêu toàn thể cán bộ, công nhân viên Công ty Than Thống Nhất – TKV."], ["Nguồn có công bố tổng kinh phí không?", "Không. Bài nguồn không nêu tổng số người nhận hoặc tổng kinh phí của chương trình."], ["Đây có phải khoản thu nhập cố định hằng tháng không?", "Không. Đây là phần quà động viên nhân dịp Quốc khánh 2/9 năm 2026."]],
  sources: [{publisher: "Công ty Than Thống Nhất – TKV", title: "Ấm áp tình người Thợ mỏ Than Thống Nhất", date: "27/08/2026", url: images["than-thong-nhat-trao-qua-quoc-khanh-nguoi-lao-dong-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật việc Than Thống Nhất trao quà Quốc khánh 2026 và mức hỗ trợ cụ thể dành cho mỗi cán bộ, công nhân viên.",
});

export const dailyCommunityArticles20260830 = [
  thongNhatNationalDayGiftArticle20260830,
];
