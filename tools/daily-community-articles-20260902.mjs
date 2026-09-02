import {dailyCommunitySourceImages20260902 as images} from "./daily-community-source-images-20260902.mjs";

const withImage = (slug, article) => {
  const image = images[slug];
  if (!image || article.sources?.[0]?.url !== image.sourceUrl) throw new Error(`Ảnh bài ${slug} không khớp URL nguồn.`);
  return {...article, slug, image: image.image, imageAlt: image.alt, imageSource: image.credit, sourceImageChecksum: image.verifiedSha256, schemaType: "NewsArticle", hideSourceUrlsInSchema: true, suppressImageLabel: true};
};

export const kheChamFamilyHolidayArticle20260902 = withImage("than-khe-cham-nghi-mat-90-gia-dinh-tho-lo-2026", {
  updated: "2026-09-02T08:43:00+07:00",
  published: "2026-09-02T08:43:00+07:00",
  urlPath: "tin-nganh-than/2026/09/02/than-khe-cham-nghi-mat-90-gia-dinh-tho-lo-2026",
  related: ["than-khe-cham-22-chuyen-xe-dua-nguoi-lao-dong-ve-que-2026", "than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026", "than-duong-huy-phuc-loi-gia-dinh-tho-lo-2026", "phuc-loi-tho-mo-tkv-2026"],
  section: "An sinh xã hội",
  title: "Than Khe Chàm tổ chức nghỉ mát cho 90 gia đình thợ lò",
  description: "Than Khe Chàm tổ chức chuyến nghỉ mát 4 ngày 3 đêm cho 90 gia đình thợ lò, cơ điện lò tiêu biểu tại Hải Phòng và Quảng Ninh.",
  lead: "Chương trình đưa gia đình vào hoạt động phúc lợi, ghi nhận nỗ lực của nhóm thợ lò, cơ điện lò tiêu biểu và giúp người thân hiểu thêm về sự gắn bó với nghề mỏ.",
  keyword: "Than Khe Chàm nghỉ mát 90 gia đình thợ lò 2026",
  keywords: ["Than Khe Chàm nghỉ mát 90 gia đình thợ lò 2026", "phúc lợi thợ mỏ", "gia đình thợ lò", "cơ điện lò Than Khe Chàm", "người lao động ngành Than", "việc làm ngành Than Quảng Ninh"],
  facts: [["90 gia đình", "Nhóm thợ lò, cơ điện lò gương mẫu, xuất sắc, tiêu biểu được Công ty lựa chọn."], ["4 ngày 3 đêm", "Thời lượng chuyến tham quan, nghỉ mát được nguồn chính thức công bố."], ["Hải Phòng và Quảng Ninh", "Hai địa bàn có các điểm du lịch trong hành trình."], ["100% kinh phí", "Nguồn nêu kinh phí do TKV và Công ty đài thọ cho nhóm tham gia."]],
  intro: [
    "Trong tháng 8/2026, Công ty Than Khe Chàm tổ chức chuyến tham quan, nghỉ mát 4 ngày 3 đêm tại Hải Phòng và Quảng Ninh cho 90 gia đình thợ lò, cơ điện lò gương mẫu, xuất sắc, tiêu biểu. Chương trình <strong>Than Khe Chàm nghỉ mát 90 gia đình thợ lò 2026</strong> được Công đoàn Than – Khoáng sản Việt Nam công bố ngày 01/09; cách nêu rõ đối tượng giúp người đọc hiểu đúng phạm vi phúc lợi.",
    "Nguồn chính thức cho biết toàn bộ kinh phí của nhóm tham gia được đài thọ từ TKV và Công ty. Đây là chương trình dành cho các gia đình được lựa chọn theo thành tích lao động, không phải chế độ nghỉ mát mặc định áp dụng cho mọi người lao động trong TKV.",
    "Việc mời cả gia đình tham gia mở rộng ý nghĩa của phúc lợi ra ngoài thời gian nghỉ ngơi cá nhân. Người thân có dịp chia sẻ niềm vui và hiểu hơn về sự ghi nhận dành cho những người làm việc trực tiếp dưới mỏ.",
  ],
  sections: [
    {title: "Phúc lợi gắn với sự ghi nhận lao động trực tiếp", paragraphs: [
      "Đối tượng của chương trình là thợ lò và cơ điện lò có kết quả nổi bật trong lao động sản xuất. Việc nêu rõ tiêu chí giúp người đọc phân biệt một hoạt động khen thưởng, động viên theo kế hoạch với quyền lợi thường xuyên của toàn bộ cán bộ, công nhân viên.",
      "Hành trình 4 ngày 3 đêm tạo khoảng nghỉ đủ dài để các gia đình có thời gian bên nhau sau những ca làm việc đặc thù. Tuy nhiên, bài nguồn không công bố mức chi cho từng gia đình hoặc tổng kinh phí, nên không thể tự quy đổi thành một khoản tiền hay thu nhập cá nhân.",
    ]},
    {title: "Gia đình là một phần của khả năng gắn bó với nghề mỏ", paragraphs: [
      "Công việc hầm lò đòi hỏi sức khỏe, kỷ luật an toàn và khả năng thích nghi với ca kíp. Khi người thân cùng tham gia chương trình chăm lo, gia đình cũng nhận được sự ghi nhận vì đã chia sẻ lịch sinh hoạt và áp lực nghề nghiệp với người lao động.",
      "Đối với người đang cân nhắc học nghề mỏ hoặc việc làm ngành Than, hoạt động này cho thấy một lát cắt về văn hóa chăm lo tại Than Khe Chàm. Quyết định nghề nghiệp vẫn cần dựa trên yêu cầu sức khỏe, vị trí làm việc, chế độ của đúng đơn vị và thông tin tuyển dụng tại thời điểm đăng ký.",
    ]},
    {title: "Đọc đúng phạm vi để hiểu đúng chính sách", paragraphs: [
      "Cụm từ đài thọ 100% trong bài nguồn được hiểu là chi phí của chuyến đi dành cho 90 gia đình thuộc chương trình. Không có căn cứ để suy rộng thành chính sách nghỉ mát miễn phí cho mọi lao động hoặc cam kết sẽ lặp lại với cùng quy mô trong các năm tiếp theo.",
      "Thông tin phúc lợi có giá trị nhất khi đi kèm đối tượng, thời gian và nguồn chi rõ ràng. Cách công bố này giúp người lao động đối chiếu quyền lợi thực tế, đồng thời ghi nhận đúng nỗ lực của TKV và Than Khe Chàm mà không cường điệu chương trình.",
    ]},
  ],
  factsTitle: "Phạm vi chương trình nghỉ mát",
  actionTitle: "Người lao động nên đối chiếu thông tin nào",
  conclusionTitle: "Chăm lo gia đình góp phần nuôi dưỡng sự gắn bó",
  checklist: [["Xác nhận đúng đối tượng", "Chương trình dành cho 90 gia đình thợ lò, cơ điện lò tiêu biểu được lựa chọn."], ["Hiểu đúng mức hỗ trợ", "100% kinh phí là phạm vi chuyến đi; nguồn không công bố số tiền theo gia đình."], ["Không suy rộng chính sách", "Không coi đây là quyền lợi mặc định của mọi lao động TKV."], ["Kiểm tra thông báo nội bộ", "Khi tham gia chương trình tương tự, đối chiếu lịch trình, danh sách và đầu mối của đúng đơn vị."]],
  takeaway: "Than Khe Chàm tổ chức chuyến nghỉ mát 4 ngày 3 đêm cho 90 gia đình thợ lò, cơ điện lò tiêu biểu, với kinh phí do TKV và Công ty đài thọ. Chương trình ghi nhận một nhóm cụ thể và không phải chế độ mặc định cho mọi người lao động.",
  faq: [["Có bao nhiêu gia đình tham gia chương trình?", "Nguồn chính thức công bố 90 gia đình thợ lò, cơ điện lò gương mẫu, xuất sắc, tiêu biểu."], ["Chuyến nghỉ mát kéo dài bao lâu và đi đâu?", "Chương trình kéo dài 4 ngày 3 đêm tại các điểm du lịch ở Hải Phòng và Quảng Ninh."], ["Ai chi trả kinh phí chuyến đi?", "Nguồn nêu kinh phí của nhóm tham gia được đài thọ 100% từ TKV và Công ty Than Khe Chàm."], ["Mọi lao động TKV đều được áp dụng chương trình này phải không?", "Không. Đây là chương trình riêng dành cho 90 gia đình được lựa chọn tại Than Khe Chàm."]],
  sources: [{publisher: "Công đoàn Than – Khoáng sản Việt Nam", title: "Than Khe Chàm: Tổ chức cho 90 gia đình thợ lò, cơ điện lò xuất sắc, tiêu biểu đi tham quan, nghỉ mát năm 2026", date: "01/09/2026", url: images["than-khe-cham-nghi-mat-90-gia-dinh-tho-lo-2026"].sourceUrl}],
  seoLine: "Bài viết cập nhật chương trình Than Khe Chàm nghỉ mát cho 90 gia đình thợ lò, cơ điện lò và làm rõ phạm vi hỗ trợ được công bố.",
});

export const dailyCommunityArticles20260902 = [
  kheChamFamilyHolidayArticle20260902,
];
