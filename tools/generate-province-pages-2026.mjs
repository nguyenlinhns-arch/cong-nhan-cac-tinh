import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const outputRoot = path.join(root, "viec-lam-nganh-than");
const base = "https://thaylinhtuyenthomo.vn";
const personId = `${base}/tac-gia/nguyen-tu-linh/#person`;
const organizationId = `${base}/#organization`;
const websiteId = `${base}/#website`;
const editorialPolicyUrl = `${base}/nguyen-tac-bien-tap/`;
const recruitment = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const criteria = recruitment.criteria;
const heightLabel = `${Math.floor(criteria.height_min_cm / 100)}m${String(criteria.height_min_cm % 100).padStart(2, "0")}`;

export const provinces = [
  { slug: "lam-dong", name: "Lâm Đồng", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Đắk Nông", "Bình Thuận"], reportage: { title: "Năm tỷ đồng từ TKV và câu chuyện những mái nhà an toàn", summary: "Hoạt động xóa nhà tạm tại Lâm Đồng cho thấy mối liên hệ của ngành Than với đời sống tại quê hương người lao động.", link: "../../tin-nganh-than/2026/08/01/tkv-ho-tro-5-ty-xoa-nha-tam-lam-dong/" } },
  { slug: "khanh-hoa", name: "Khánh Hòa", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Ninh Thuận"], reportage: { title: "Khánh Hòa trong gói hỗ trợ 12 tỷ đồng sau mưa lũ", summary: "Một lát cắt về tinh thần sẻ chia của TKV với bốn tỉnh miền Trung – Tây Nguyên sau thiên tai.", link: "../../tin-nganh-than/2026/08/01/tkv-ho-tro-12-ty-tay-nguyen-khac-phuc-mua-lu/" } },
  { slug: "dak-lak", name: "Đắk Lắk", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Phú Yên"], reportage: { title: "Đắk Lắk nhận thêm nguồn lực phục hồi sau mưa lũ", summary: "Từ khoản hỗ trợ 3 tỷ đồng, nhìn rộng hơn về trách nhiệm cộng đồng của một tập đoàn có người lao động đến từ nhiều tỉnh.", link: "../../tin-nganh-than/2026/08/01/tkv-ho-tro-12-ty-tay-nguyen-khac-phuc-mua-lu/" } },
  { slug: "gia-lai", name: "Gia Lai", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Bình Định"], story: "Từ K’bang ra Quảng Ninh, anh Đặng Văn Hưng đã trở thành thợ lò giỏi với thu nhập hơn 30 triệu đồng/tháng.", storyLink: "../../bai-viet/13500-tho-lo-thu-nhap-tren-300-trieu-2025/", reportage: { title: "Gia Lai trong vòng tay sẻ chia của người thợ mỏ", summary: "Bên cạnh câu chuyện lập nghiệp của anh Hưng là dấu ấn TKV hỗ trợ địa phương khắc phục hậu quả mưa lũ.", link: "../../tin-nganh-than/2026/08/01/tkv-ho-tro-12-ty-tay-nguyen-khac-phuc-mua-lu/" } },
  { slug: "quang-ngai", name: "Quảng Ngãi", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Kon Tum"], story: "Anh Đinh Văn Ne, người Quảng Ngãi, chia sẻ mức lương thực tế khoảng 23–25 triệu đồng/tháng trong nghề mỏ.", storyLink: "../../#theo-tinh" },
  { slug: "da-nang", name: "Đà Nẵng", region: "Tây Nguyên & Nam Trung Bộ", aliases: ["Quảng Nam"] },
  { slug: "hue", name: "Huế", region: "Bắc Trung Bộ", aliases: [] },
  { slug: "quang-tri", name: "Quảng Trị", region: "Bắc Trung Bộ", aliases: ["Quảng Bình"], story: "Anh Hồ Văn Cương, quê Hướng Hóa, chia sẻ mức thu nhập bình quân khoảng 25–30 triệu đồng/tháng.", storyLink: "../../#theo-tinh" },
  { slug: "ha-tinh", name: "Hà Tĩnh", region: "Bắc Trung Bộ", aliases: [], story: "Câu chuyện của anh Nguyễn Trịnh Anh cho thấy một người con Hà Tĩnh có thể tạo dựng mức lương bình quân khoảng 28 triệu đồng/tháng tại vùng mỏ.", storyLink: "../../#theo-tinh" },
  { slug: "nghe-an", name: "Nghệ An", region: "Bắc Trung Bộ", aliases: [], story: "Anh Nguyễn Văn Thái, quê Anh Sơn, đang có mức thu nhập bình quân khoảng 28 triệu đồng/tháng trong ngành Than.", storyLink: "../../#theo-tinh" },
  { slug: "thanh-hoa", name: "Thanh Hóa", region: "Bắc Trung Bộ", aliases: [], story: "Anh Hà Văn Phú, quê Mường Lát, là một trong những công nhân đạt thu nhập trên 300 triệu đồng/năm.", storyLink: "../../#theo-tinh", reportage: { title: "Mường Lát, Lang Chánh: từ vài hồ sơ đến một tuyến học nghề rõ ràng", summary: "Số người nhập học tăng qua từng năm cho thấy khi thông tin đến đúng bản làng, nghề mỏ có thể trở thành lựa chọn lập nghiệp nghiêm túc của thanh niên miền núi.", link: "../../tin-nganh-than/2026/08/01/muong-lat-lang-chanh-hop-tac-viec-lam-tkv-2020/" } },
  { slug: "ninh-binh", name: "Ninh Bình", region: "Đồng bằng & Đông Bắc", aliases: ["Nam Định", "Hà Nam"] },
  { slug: "hung-yen", name: "Hưng Yên", region: "Đồng bằng & Đông Bắc", aliases: ["Thái Bình"] },
  { slug: "hai-phong", name: "Hải Phòng", region: "Đồng bằng & Đông Bắc", aliases: ["Hải Dương"] },
  { slug: "bac-ninh", name: "Bắc Ninh", region: "Đồng bằng & Đông Bắc", aliases: ["Bắc Giang"] },
  { slug: "ha-noi", name: "Hà Nội", region: "Đồng bằng & Đông Bắc", aliases: [] },
  { slug: "quang-ninh", name: "Quảng Ninh", region: "Đồng bằng & Đông Bắc", aliases: [], reportage: { title: "Bình Liêu: gần 90% người được tuyển đã đi hết khóa học", summary: "Dữ liệu 321 người được tuyển, 289 người tốt nghiệp cho thấy một tuyến học nghề – việc làm đã thành hình ngay trong tỉnh.", link: "../../tin-nganh-than/2026/08/01/binh-lieu-hop-tac-hoc-nghe-mo-viec-lam-tkv/" } },
  { slug: "phu-tho", name: "Phú Thọ", region: "Trung du & miền núi phía Bắc", aliases: ["Vĩnh Phúc", "Hòa Bình"] },
  { slug: "thai-nguyen", name: "Thái Nguyên", region: "Trung du & miền núi phía Bắc", aliases: ["Bắc Kạn"], reportage: { title: "Bằng Thành, Phúc Lộc đặt mục tiêu đưa thanh niên vào nghề mỏ", summary: "Kế hoạch tối thiểu 40 lao động mỗi xã mỗi năm biến tuyên truyền nghề nghiệp thành mục tiêu có thể theo dõi.", link: "../../tin-nganh-than/2026/08/01/bang-thanh-phuc-loc-hoc-nghe-tho-lo-tkv/" } },
  { slug: "tuyen-quang", name: "Tuyên Quang", region: "Trung du & miền núi phía Bắc", aliases: ["Hà Giang"], reportage: { title: "Bốn xã cùng mở đường học nghề mỏ giai đoạn 2025–2030", summary: "Nhà trường, doanh nghiệp và địa phương nối tư vấn tại thôn bản với đào tạo, tiếp nhận việc làm tại TKV.", link: "../../tin-nganh-than/2026/08/01/tuyen-quang-phoi-hop-tuyen-sinh-nghe-mo-2025-2030/" } },
  { slug: "lao-cai", name: "Lào Cai", region: "Trung du & miền núi phía Bắc", aliases: ["Yên Bái"], story: "Anh Vàng A Chinh, người Lào Cai, chia sẻ mức lương bình quân khoảng 20–22 triệu đồng/tháng trong nghề mỏ.", storyLink: "../../#theo-tinh", reportage: { title: "Bát Xát đưa cán bộ 10 xã tới tận nơi học và làm việc", summary: "Chuyến khảo sát từ năm 2017 cho thấy niềm tin vào nghề được xây bằng việc nhìn tận mắt khu học, nơi ở và doanh nghiệp tiếp nhận.", link: "../../tin-nganh-than/2026/08/01/bat-xat-lao-cai-hop-tac-dao-tao-nghe-mo-2017/" } },
  { slug: "cao-bang", name: "Cao Bằng", region: "Trung du & miền núi phía Bắc", aliases: [], reportage: { title: "Bảo Lạc đưa tư vấn nghề mỏ về tới xã, thôn", summary: "Từ 144 lượt tư vấn, câu chuyện đặt ra một thước đo thiết thực: có bao nhiêu người đi hết hành trình tới lớp học và việc làm.", link: "../../tin-nganh-than/2026/08/01/bao-lac-cao-bang-tu-van-hoc-nghe-mo/" } },
  { slug: "lang-son", name: "Lạng Sơn", region: "Trung du & miền núi phía Bắc", aliases: [] },
  { slug: "son-la", name: "Sơn La", region: "Trung du & miền núi phía Bắc", aliases: [], story: "Anh Lầu A Súa, người Sơn La, chia sẻ mức thu nhập khoảng 28 triệu đồng/tháng tại Than Hạ Long.", storyLink: "../../#theo-tinh", reportage: { title: "Sông Mã: chuyến đi mở đường từ bảy xã tới vùng mỏ", summary: "Cán bộ địa phương đã đến tận cơ sở đào tạo, khu sinh hoạt và doanh nghiệp để câu chuyện học nghề được kể lại bằng những điều mắt thấy, tai nghe.", link: "../../tin-nganh-than/2026/08/01/song-ma-son-la-hop-tac-tuyen-sinh-nghe-mo-2016/" } },
  { slug: "dien-bien", name: "Điện Biên", region: "Trung du & miền núi phía Bắc", aliases: [], story: "Hành trình của anh Mùa A Vàng cho thấy người lao động Điện Biên có thể học nghề, trưởng thành và tạo dựng cuộc sống mới tại vùng mỏ.", storyLink: "../../#theo-tinh", reportage: { title: "Tủa Chùa nối thanh niên vùng cao với lớp học nghề mỏ", summary: "Từ phối hợp ở cơ sở đến đón người học, câu chuyện cho thấy một quyết định đi xa sẽ vững vàng hơn khi có lộ trình và người đồng hành rõ ràng.", link: "../../tin-nganh-than/2026/08/01/tua-chua-dien-bien-phoi-hop-hoc-nghe-mo-2024/" } },
  { slug: "lai-chau", name: "Lai Châu", region: "Trung du & miền núi phía Bắc", aliases: [], story: "Anh Mùa A Sình, người Lai Châu, có thu nhập bình quân 25–27 triệu đồng/tháng; tháng cao điểm từng đạt khoảng 40 triệu đồng.", storyLink: "../../bai-viet/13500-tho-lo-thu-nhap-tren-300-trieu-2025/", reportage: { title: "Gần 1.500 thanh niên Lai Châu đã tốt nghiệp và làm việc tại TKV", summary: "Một cộng đồng người đi trước đang trở thành điểm tựa để lớp thanh niên mới hiểu nghề, học nghề và vững tin hơn khi đi xa.", link: "../../tin-nganh-than/2026/08/01/tinh-doan-lai-chau-ket-noi-viec-lam-tkv/" } },
];

const provinceEditorialAngles = {
  "lam-dong": "Quãng đường từ Lâm Đồng tới Quảng Ninh khá dài, nên bước sàng lọc cần hoàn tất ngay tại quê nhà. Người lao động chỉ lên đường sau khi đã biết rõ nghề học, lịch tiếp nhận, nơi ở và đầu mối đón.",
  "khanh-hoa": "Người ở Khánh Hòa có thể đối chiếu tuổi, thể lực và sức khỏe từ xa trước khi chuẩn bị giấy tờ. Cách làm này giúp gia đình cân nhắc đầy đủ thời gian học và cuộc sống tại Quảng Ninh.",
  "dak-lak": "Với người lao động Đắk Lắk, quyết định đi xa cần bắt đầu bằng thông tin chắc chắn. Nghề đào tạo, chính sách trong khóa học và đơn vị dự kiến tiếp nhận phải được xác nhận trước ngày di chuyển.",
  "gia-lai": "Từ Gia Lai tới vùng mỏ là hành trình đã có người đi trước và tạo dựng được vị trí bằng tay nghề. Người mới nên bắt đầu bằng một lần tự đánh giá trung thực về sức khỏe, kỷ luật và khả năng sống xa nhà.",
  "quang-ngai": "Câu chuyện của lao động Quảng Ngãi đang làm trong ngành Than cho thấy cơ hội có thể kiểm chứng bằng người thật. Bước đầu vẫn là đối chiếu điều kiện và hiểu rõ công việc trước khi chọn nghề.",
  "da-nang": "Người ở Đà Nẵng và khu vực Quảng Nam trước sắp xếp hành chính có thể hoàn tất bước kiểm tra ban đầu từ xa. Chuyến đi ra Quảng Ninh chỉ nên bắt đầu khi lịch học và địa chỉ tiếp nhận đã rõ.",
  "hue": "Từ Huế, người tìm việc có thể chủ động hỏi nghề, thời gian học và điều kiện sinh hoạt trước khi quyết định. Một kế hoạch rõ ràng giúp cả người lao động lẫn gia đình chuẩn bị tốt cho quãng thời gian xa nhà.",
  "quang-tri": "Quảng Trị đã có những người lao động tạo dựng thu nhập tốt tại vùng mỏ. Kinh nghiệm của người đi trước là nguồn tham khảo hữu ích, còn mỗi hồ sơ mới vẫn phải được đối chiếu riêng về sức khỏe và nghề phù hợp.",
  "ha-tinh": "Người Hà Tĩnh có thể tìm hiểu nghề qua những trường hợp đã làm việc thực tế tại Quảng Ninh. Quyết định đăng ký cần dựa trên điều kiện sức khỏe, nội dung đào tạo và khả năng gắn bó với công việc theo ca.",
  "nghe-an": "Từ Nghệ An, bước đầu là xác định mình có phù hợp trước khi chuẩn bị hồ sơ. Khi kết quả sàng lọc rõ, người lao động nhận hướng dẫn cụ thể về nghề và lịch nhập học.",
  "thanh-hoa": "Thanh Hóa đã có cả câu chuyện người thợ thành công và những địa bàn phối hợp tuyển sinh nhiều năm. Dữ kiện ấy giúp người mới kiểm chứng cơ hội, đồng thời hiểu rằng tay nghề và kỷ luật mới quyết định chặng đường lâu dài.",
  "ninh-binh": "Người ở Ninh Bình, Nam Định và Hà Nam trước sắp xếp hành chính có thể kiểm tra điều kiện ngay tại quê nhà. Mọi thông tin về lịch học, nơi ở và doanh nghiệp tiếp nhận cần được chốt trước ngày lên đường.",
  "hung-yen": "Từ Hưng Yên và khu vực Thái Bình trước sắp xếp, người lao động có lợi thế di chuyển thuận tiện hơn nhiều địa bàn xa. Dù vậy, lựa chọn nghề vẫn cần dựa trên sức khỏe, kỷ luật và sự hiểu biết đầy đủ về ca làm.",
  "hai-phong": "Người ở Hải Phòng và khu vực Hải Dương trước sắp xếp có thể tìm hiểu trực tiếp hơn về môi trường công nghiệp Quảng Ninh. Bước tư vấn ban đầu giúp xác định đúng nghề và tránh chuẩn bị giấy tờ khi chưa đủ điều kiện.",
  "bac-ninh": "Từ Bắc Ninh và khu vực Bắc Giang trước sắp xếp, người lao động có thể trao đổi, sàng lọc và nhận lịch trước khi di chuyển. Một quyết định có dữ kiện luôn vững hơn lời rủ đi làm theo nhóm.",
  "ha-noi": "Người lao động tại Hà Nội có thể hoàn tất bước kiểm tra điều kiện từ xa và chủ động khảo sát thông tin trước ngày nhập học. Điều cần làm rõ là nghề được đào tạo, đơn vị bố trí và yêu cầu thực tế của công việc.",
  "quang-ninh": "Lao động Quảng Ninh có lợi thế ở gần cơ sở đào tạo và doanh nghiệp, thuận tiện gặp người đang làm nghề để tìm hiểu. Khoảng cách gần không làm giảm yêu cầu về sức khỏe, học tập và kỷ luật an toàn.",
  "phu-tho": "Người ở Phú Thọ cùng các khu vực Vĩnh Phúc, Hòa Bình trước sắp xếp có thể sàng lọc ban đầu ngay tại địa bàn. Gia đình nên cùng nghe tư vấn để hiểu nơi học, nhịp sinh hoạt và kế hoạch làm việc tại Quảng Ninh.",
  "thai-nguyen": "Thái Nguyên đã có những xã ký mục tiêu đào tạo, giải quyết việc làm cụ thể với Nhà trường và doanh nghiệp. Người đăng ký cần đi qua đúng đầu mối, đồng thời tự đối chiếu sức khỏe trước khi làm hồ sơ.",
  "tuyen-quang": "Nhiều địa bàn Tuyên Quang đã đưa tư vấn nghề xuống xã, thôn và gắn với doanh nghiệp tiếp nhận. Người lao động nhờ đó có thêm nơi kiểm chứng thông tin trước khi quyết định học và làm việc xa nhà.",
  "lao-cai": "Lào Cai có nhiều dấu mốc hợp tác tuyển sinh và một cộng đồng lao động đang làm việc trong ngành Than. Những trường hợp đi trước giúp người mới hình dung rõ hơn về lớp học, tổ đội và giai đoạn thích nghi.",
  "cao-bang": "Tại Cao Bằng, tư vấn nghề mỏ đã được đưa về nhiều xã, huyện qua các chương trình phối hợp. Giá trị của mạng lưới này nằm ở khả năng trả lời cụ thể từng hồ sơ và theo người học tới ngày nhận việc.",
  "lang-son": "Người lao động Lạng Sơn có thể bắt đầu bằng việc gửi đúng thông tin thể lực và sức khỏe. Sau bước sàng lọc, lịch học, địa điểm nhập học và nơi làm việc được chốt trước khi gia đình sắp xếp hành trình.",
  "son-la": "Sơn La đã có lực lượng lao động làm việc trong ngành Than và những chuyến khảo sát từ địa phương tới Quảng Ninh. Người mới vì vậy có thể tìm người đồng hương để kiểm chứng đời sống học tập và công việc thực tế.",
  "dien-bien": "Từ Điện Biên tới Quảng Ninh là một chặng đường dài, nhưng tuyến học nghề đã có người đi trước. Chuẩn bị tốt sức khỏe, thông tin và sự đồng thuận của gia đình giúp người học đứng vững hơn trong những tháng đầu.",
  "lai-chau": "Gần 1.500 thanh niên Lai Châu đã tốt nghiệp và làm việc tại các đơn vị TKV theo nguồn được rà soát. Cộng đồng ấy là điểm tựa thực tế để người mới hỏi nghề, hiểu ca làm và chuẩn bị cho cuộc sống xa nhà.",
};

function provincePage(province) {
  const { slug, name, region, aliases, story, storyLink, reportage } = province;
  const canonical = `https://thaylinhtuyenthomo.vn/viec-lam-nganh-than/${slug}/`;
  const applicationUrl = `../../viec-lam/cong-nhan-mo-ham-lo-quang-ninh/?province=${encodeURIComponent(name)}&amp;utm_source=website&amp;utm_medium=organic&amp;utm_campaign=tuyen_tho_mo_2026&amp;utm_content=province_${slug}#dang-ky`;
  const aliasNames = aliases.join(", ");
  const aliasPhrase = aliases.length
    ? `, bao gồm khu vực ${aliasNames} trước sắp xếp đơn vị hành chính năm 2025`
    : "";
  const localContext = provinceEditorialAngles[slug]
    || `Từ ${name}, người lao động có thể kiểm tra điều kiện từ xa, học nghề trong 2–3 tháng và chuẩn bị cho công việc tại Quảng Ninh theo một lộ trình rõ ràng.`;
  const hasLocalEvidence = Boolean(story || reportage);
  const description = `Tuyển thợ mỏ tại ${name}${aliasPhrase}: học nghề 2–3 tháng, hỗ trợ ăn ở, cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động tại Quảng Ninh.`;
  const localStories = [
    story ? {
      title: story,
      summary: "Trường hợp thực tế cho thấy tay nghề, ngày công và sự bền bỉ có thể giúp người lao động tạo dựng vị trí vững vàng tại Quảng Ninh.",
      link: storyLink,
      action: "Xem câu chuyện người thật →",
    } : null,
    reportage ? {
      ...reportage,
      action: "Đọc bài báo từ địa phương →",
    } : null,
  ].filter(Boolean);
  const storySection = localStories.length
    ? `<section class="section local-overview" aria-labelledby="local-story-title">
      <div class="section-heading"><div><p class="eyebrow">DẤU ẤN ${name.toLocaleUpperCase("vi")} TRONG NGÀNH THAN</p><h2 id="local-story-title">${localStories.length > 1 ? "Những câu chuyện giúp người lao động nhìn nghề rõ hơn" : "Một câu chuyện đã có dữ kiện và người đi trước"}</h2></div><p>Những con người, kết quả hợp tác và hoạt động cộng đồng có thể kiểm chứng tại địa phương giúp người lao động hiểu nghề qua các dữ kiện thực tế.</p></div>
      <div class="local-story-list">${localStories.map((item) => `<div class="story-link"><div><strong>${item.title}</strong><p>${item.summary}</p></div><a class="button button--outline-dark" href="${item.link}">${item.action}</a></div>`).join("")}</div>
    </section>`
    : "";
  const keywords = [
    `tuyển thợ mỏ ${name}`,
    `tuyển dụng ngành than ${name}`,
    `học nghề mỏ ${name}`,
    `việc làm thợ lò ${name}`,
    ...aliases.flatMap((alias) => [`tuyển thợ mỏ ${alias}`, `việc làm ngành than ${alias}`]),
  ].join(", ");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `Tuyển thợ mỏ tại ${name} – học nghề 2–3 tháng`,
        description,
        inLanguage: "vi-VN",
        dateModified: "2026-08-01",
        isPartOf: { "@id": websiteId },
        author: { "@id": personId },
        publisher: { "@id": organizationId },
        publishingPrinciples: editorialPolicyUrl,
        about: { "@id": `${base}/thong-tin-tuyen-tho-mo/#webpage` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://thaylinhtuyenthomo.vn/" },
          { "@type": "ListItem", position: 2, name: "Tuyển thợ mỏ theo tỉnh", item: "https://thaylinhtuyenthomo.vn/#theo-tinh" },
          { "@type": "ListItem", position: 3, name, item: canonical },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Người ở ${name} có thể đăng ký học nghề mỏ không?`,
            acceptedAnswer: { "@type": "Answer", text: `Lao động nam tại ${name} có thể gửi năm sinh, chiều cao, cân nặng và sức khỏe để được kiểm tra điều kiện ban đầu. Nơi học và làm việc là Quảng Ninh.` },
          },
          {
            "@type": "Question",
            name: "Thời gian học nghề mỏ bao lâu?",
            acceptedAnswer: { "@type": "Answer", text: "Nghề khai thác mỏ và xây dựng mỏ có thời gian học 2–3 tháng theo kế hoạch từng đợt." },
          },
        ],
      },
    ],
  };

  return `<!doctype html>
<html lang="vi" data-province="${slug}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#0b222b">
  <title>Tuyển thợ mỏ tại ${name} | Học nghề 2–3 tháng – Thầy Linh</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="${hasLocalEvidence ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,follow"}">
  <meta name="author" content="Nguyễn Tử Linh">
  <link rel="author" href="/tac-gia/nguyen-tu-linh/">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Bài mới – Thầy Linh Tuyển Thợ Mỏ" href="/feed.xml">
  <link rel="alternate" type="application/feed+json" title="Bài mới – Thầy Linh Tuyển Thợ Mỏ" href="/feed.json">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">
  <meta property="og:title" content="Tuyển thợ mỏ tại ${name} – học nghề 2–3 tháng">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tuyển thợ mỏ tại ${name} – học nghề 2–3 tháng">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://thaylinhtuyenthomo.vn/assets/og-cover-v2.webp">
  <link rel="stylesheet" href="../../styles.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <link rel="stylesheet" href="/mobile-ux.css?v=4">
</head>
<body>
  <a class="skip-link" href="#noi-dung">Bỏ qua menu</a>
  <div class="notice-bar"><span>✓</span> Học nghề 2–3 tháng · Hỗ trợ ăn ở · Cơ hội làm việc lâu dài tại Quảng Ninh</div>
  <header class="site-header" data-header>
    <a class="brand" href="../../" aria-label="Trang chủ Thầy Linh Tuyển Thợ Mỏ"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span class="brand-copy"><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" data-menu-toggle><span></span><span></span><span></span></button>
    <nav class="main-nav" aria-label="Điều hướng chính" data-menu><a href="../../#dieu-kien">Điều kiện</a><a href="../../#che-do-ho-so">Chế độ & hồ sơ</a><a href="../../#theo-tinh">Theo tỉnh</a><a href="../../tin-nganh-than/">Cẩm nang</a></nav>
    <a class="header-cta" href="${applicationUrl}" data-contact="application" data-context="province-${slug}">Kiểm tra điều kiện</a>
  </header>

  <main id="noi-dung">
    <nav class="breadcrumb" aria-label="Đường dẫn trang"><a href="../../">Trang chủ</a><span>›</span><a href="../../#theo-tinh">Tuyển thợ mỏ theo tỉnh</a><span>›</span><strong>${name}</strong></nav>
    <section class="local-hero" aria-labelledby="local-title">
      <div class="local-hero__copy">
        <p class="eyebrow">TUYỂN THỢ MỎ TẠI ${name.toLocaleUpperCase("vi")}</p>
        <h1 id="local-title">Học nghề mỏ 2–3 tháng, <br><em>làm việc tại Quảng Ninh</em></h1>
        <p class="local-hero__lead">Người phù hợp được đào tạo nghề, hỗ trợ ăn ở trong khóa học và được cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p>
        <div class="location-clarity"><div><small>NƠI TUYỂN NGUỒN</small><strong>${name}</strong></div><span>→</span><div><small>NƠI HỌC & LÀM VIỆC</small><strong>Quảng Ninh</strong></div></div>
        <div class="contact-pair">
          <a class="contact-button contact-button--zalo" href="${applicationUrl}" data-contact="application" data-context="province-${slug}"><span class="contact-icon contact-icon--text">✓</span><span><small>Biểu mẫu một phút</small><strong>Kiểm tra điều kiện</strong></span></a>
          <a class="contact-button contact-button--messenger" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="province-${slug}"><span class="contact-icon contact-icon--text">Z</span><span><small>Kênh dự phòng</small><strong>Zalo 096 304 8585</strong></span></a>
        </div>
      </div>
      <aside class="local-check"><p class="eyebrow">BẮT ĐẦU TỪ HÔM NAY</p><h2>Gửi 3 thông tin</h2><ol><li><b>1</b><span>Năm sinh</span></li><li><b>2</b><span>Chiều cao – cân nặng</span></li><li><b>3</b><span>Tình trạng sức khỏe</span></li></ol><a class="button button--outline-dark copy-button--full" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="province-${slug}-check">Nộp hồ sơ qua Zalo</a><p>Thầy Linh kiểm tra điều kiện trước, sau đó mới hướng dẫn hồ sơ và lịch tiếp nhận phù hợp.</p></aside>
    </section>

    <section class="trust-strip trust-strip--local" aria-label="Thông tin chính"><span>✓ Nam ${criteria.age_min}–${criteria.age_max} tuổi</span><span>✓ Cao từ ${heightLabel}</span><span>✓ Nặng từ ${criteria.weight_min_kg}kg</span><span>✓ Sức khỏe tốt</span></section>

    <section class="section local-overview" aria-labelledby="overview-title">
      <div class="section-heading"><div><p class="eyebrow">CƠ HỘI CHO LAO ĐỘNG ${name.toLocaleUpperCase("vi")}</p><h2 id="overview-title">Từ kiểm tra điều kiện đến ngày nhận việc</h2></div><p>${localContext}</p></div>
      <div class="overview-grid">
        <article><span>01</span><h3>Mở cửa cho người chưa có nghề</h3><p>Nam ${criteria.age_min}–${criteria.age_max} tuổi, cao từ ${heightLabel}, nặng từ ${criteria.weight_min_kg}kg và có sức khỏe tốt có thể đăng ký kiểm tra ban đầu.</p></article>
        <article><span>02</span><h3>Yên tâm học nghề</h3><p>Miễn kinh phí đào tạo, bố trí ba bữa ăn mỗi ngày, ký túc xá và hỗ trợ 7,5 triệu đồng theo chính sách đợt tuyển.</p></article>
        <article><span>03</span><h3>Rèn tay nghề trong 2–3 tháng</h3><p>Học kiến thức, an toàn và kỹ năng thực hành của nghề khai thác mỏ hoặc xây dựng mỏ hầm lò.</p></article>
        <article><span>04</span><h3>Bắt đầu công việc đúng nghề</h3><p>Người tốt nghiệp đạt yêu cầu được doanh nghiệp tiếp nhận, bố trí công việc theo nghề đào tạo tại Quảng Ninh.</p></article>
      </div>
    </section>

${storySection}

    <section class="section section--dark local-benefits" aria-labelledby="benefits-title">
      <div class="section-heading section-heading--light"><div><p class="eyebrow eyebrow--light">TỪ QUÊ NHÀ ĐẾN VÙNG MỎ</p><h2 id="benefits-title">Chưa cần đi xa để kiểm tra cơ hội</h2></div><p>Trao đổi từ xa giúp người lao động biết mình có phù hợp, cần chuẩn bị gì và chỉ lên đường khi đã có lịch tiếp nhận rõ ràng.</p></div>
      <div class="benefit-grid benefit-grid--four"><article><small>01</small><strong>Trao đổi đúng hoàn cảnh</strong><p>Nói rõ mong muốn, sức khỏe và khả năng sắp xếp để theo nghề.</p></article><article><small>02</small><strong>Nắm chắc lịch trình</strong><p>Biết giấy tờ, thời gian và nơi tiếp nhận trước khi lên đường.</p></article><article><small>03</small><strong>Yên tâm trong khóa học</strong><p>Có ăn ở, ký túc xá và chính sách hỗ trợ để tập trung rèn nghề.</p></article><article class="benefit-grid__accent"><small>04</small><strong>Cam kết thu nhập</strong><p>20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p></article></div>
    </section>

    <section class="section local-overview" aria-labelledby="read-more-title">
      <div class="section-heading"><div><p class="eyebrow">HIỂU NGHỀ ĐỂ VỮNG TIN</p><h2 id="read-more-title">Năm câu hỏi cần trả lời trước khi đăng ký</h2></div><p>Mỗi trang đi thẳng vào một vấn đề thiết thực để người lao động và gia đình có đủ thông tin trước khi quyết định.</p></div>
      <div class="overview-grid"><article><h3>15 câu hỏi tuyển thợ mỏ</h3><p>Thông tin đang áp dụng về điều kiện, học nghề, hồ sơ, nơi làm việc và thu nhập.</p><a href="../../thong-tin-tuyen-tho-mo/">Xem thông tin tháng 8/2026 →</a></article><article><h3>Điều kiện tuyển thợ lò</h3><p>Tuổi, chiều cao, cân nặng và yêu cầu sức khỏe.</p><a href="../../bai-viet/dieu-kien-tuyen-tho-lo-2026/">Đọc điều kiện →</a></article><article><h3>Hồ sơ dự tuyển</h3><p>CCCD gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có; chỉ chuẩn bị sau khi được hướng dẫn.</p><a href="../../bai-viet/ho-so-hoc-nghe-mo-can-gi/">Xem hồ sơ →</a></article><article><h3>Khóa học 2–3 tháng</h3><p>Nội dung học nghề khai thác mỏ trước khi nhận việc.</p><a href="../../bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/">Xem khóa học →</a></article><article><h3>Tin tuyển dụng 2026</h3><p>Xem đầy đủ quyền lợi, thu nhập và tạo tin nhắn đăng ký.</p><a href="../../viec-lam/cong-nhan-mo-ham-lo-quang-ninh/">Ứng tuyển ngay →</a></article></div>
    </section>

    <section class="section section--faq local-faq" aria-labelledby="faq-title">
      <div class="faq-intro"><p class="eyebrow">HỎI ĐÁP TẠI ${name.toLocaleUpperCase("vi")}</p><h2 id="faq-title">Trước khi chuẩn bị đi học</h2><p>Câu trả lời dùng để sàng lọc ban đầu; lịch và chính sách cụ thể được xác nhận theo từng đợt.</p></div>
      <div class="faq-list"><details open><summary>Người ở ${name} có đăng ký được không?</summary><p>Có thể gửi thông tin để kiểm tra điều kiện. Nơi tuyển nguồn là ${name}; nơi học và làm việc thực tế là Quảng Ninh.</p></details><details><summary>Có cần đến Quảng Ninh để hỏi trước không?</summary><p>Không. Bước đầu có thể trao đổi qua Zalo hoặc Messenger; chỉ di chuyển sau khi có lịch và hướng dẫn rõ ràng.</p></details><details><summary>Thời gian học bao lâu?</summary><p>Nghề khai thác mỏ và xây dựng mỏ học 2–3 tháng. Lịch cụ thể phụ thuộc từng đợt tiếp nhận.</p></details><details><summary>Cần chuẩn bị hồ sơ ngay không?</summary><p>Chưa cần. Hãy gửi năm sinh, chiều cao/cân nặng và sức khỏe trước; hồ sơ được hướng dẫn sau khi phù hợp điều kiện.</p></details></div>
    </section>
  </main>

  <section class="final-cta" aria-labelledby="final-title"><div><p class="eyebrow eyebrow--light">TƯ VẤN TUYỂN THỢ MỎ TẠI ${name.toLocaleUpperCase("vi")}</p><h2 id="final-title">Gửi 3 thông tin để kiểm tra điều kiện</h2><p>Năm sinh · Chiều cao/cân nặng · Tình trạng sức khỏe hiện tại.</p></div><div class="contact-pair"><a class="contact-button contact-button--zalo" href="${applicationUrl}" data-contact="application"><span class="contact-icon contact-icon--text">✓</span><span><small>Biểu mẫu một phút</small><strong>Ứng tuyển nhanh</strong></span></a><a class="contact-button contact-button--messenger" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo"><span class="contact-icon contact-icon--text">Z</span><span><small>Kênh dự phòng</small><strong>Zalo 096 304 8585</strong></span></a></div></section>
  <footer class="site-footer"><div class="footer-brand"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Tư vấn học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div></div><div class="footer-links"><a href="../../#theo-tinh">Tất cả tỉnh, thành</a><a href="../../thong-tin-tuyen-tho-mo/">15 câu hỏi tuyển thợ mỏ</a><a href="../../#dieu-kien">Điều kiện tuyển</a><a href="../../tin-nganh-than/">Cẩm nang nghề mỏ</a><a href="../../nguyen-tac-bien-tap/">Nguyên tắc biên tập</a><a href="../../quyen-rieng.html">Quyền riêng tư</a></div><p class="footer-note">Điều kiện cập nhật tháng 8/2026. Cam kết thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.</p></footer>
  <div class="mobile-contact" aria-label="Liên hệ nhanh"><a class="mobile-contact__zalo" href="${applicationUrl}" data-contact="application"><b>✓</b><span>Ứng tuyển</span></a><a class="mobile-contact__messenger" href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo"><b>Z</b><span>Nhắn Zalo</span></a></div>
  <div class="toast" role="status" aria-live="polite" data-toast hidden></div>
  <script src="../../app.js?v=4" defer></script>
  <script src="/analytics.js?v=5" defer></script>
  <script src="/mobile-ux.js?v=3" defer></script>
</body>
</html>
`;
}

for (const province of provinces) {
  const dir = path.join(outputRoot, province.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), provincePage(province));
}

const data = {
  updated_at: "2026-08-01",
  source_scope: "26 tỉnh, thành từ Lâm Đồng trở ra phía Bắc theo phạm vi tuyển sinh ưu tiên của website",
  provinces: provinces.map(({story, storyLink, ...province}) => province),
};
fs.writeFileSync(path.join(root, "data", "provinces-2026.json"), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Generated ${provinces.length} province pages from Lâm Đồng northward.`);
