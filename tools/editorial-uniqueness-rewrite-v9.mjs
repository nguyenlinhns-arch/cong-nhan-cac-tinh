import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const replacements = {
  "tin-nganh-than/2026/08/01/tkv-ung-ho-20-ty-cham-lo-nguoi-co-cong-2026/index.html": [
    ["Hoạt động này ghi thêm một lát cắt về ngành Than: phía sau những ca sản xuất là cộng đồng thợ mỏ cùng chia sẻ trách nhiệm với nơi doanh nghiệp hoạt động và quê hương của người lao động.", "Khoản kinh phí dành cho người có công đặt câu chuyện an sinh của ngành Than trong một mạch khác: sự tri ân được chuyển thành hỗ trợ cụ thể cho những gia đình gắn với lịch sử đất nước."],
    ["Kết quả cuối cần được nhìn ở mái nhà đã an toàn hơn, lớp học đủ điều kiện hơn hoặc gia đình có thể sớm trở lại nhịp sống thường ngày.", "Hiệu quả của chương trình chỉ có thể đánh giá khi khoản hỗ trợ được chuyển đúng đối tượng và tạo ra thay đổi thực tế trong đời sống của từng gia đình."],
    ["Cách chuyển qua cơ quan tiếp nhận giúp địa phương rà soát từng trường hợp, đồng thời tạo một đầu mối để cộng đồng theo dõi tiến độ.", "Việc chuyển nguồn lực qua cơ quan có trách nhiệm giúp khâu xác nhận đối tượng, phân bổ và theo dõi kết quả có đầu mối rõ ràng."],
    ["Tinh thần “Kỷ luật và Đồng tâm” được thể hiện trong sản xuất và qua cách tập thể người lao động góp sức khi cộng đồng gặp khó.", "Trong trường hợp này, tinh thần cộng đồng của thợ mỏ được thể hiện bằng việc dành nguồn lực cho một nhóm thụ hưởng ngoài phạm vi sản xuất."],
    ["Thông tin rõ ràng vừa bảo vệ người dân trước giả mạo, vừa giữ trọn ý nghĩa của sự đóng góp từ doanh nghiệp và người thợ.", "Công khai đơn vị tiếp nhận, đối tượng và mục đích sử dụng là điều cần thiết để khoản đóng góp giữ đúng ý nghĩa tri ân."],
  ],
  "tin-nganh-than/2026/08/01/luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam/index.html": [
    ["Những câu chuyện của người đã vào nghề giúp ứng viên hình dung rõ hơn nhịp ca, khu ở, sinh hoạt tập thể và cảm giác nhận tháng lương đầu tiên bằng chính tay nghề của mình.", "Với người Lục Hồn đang cân nhắc đi xa, kinh nghiệm của người đã học và làm ở vùng mỏ có giá trị ở những chi tiết rất đời thường: giờ giấc, chỗ ở, cách thích nghi với ca kíp và quãng thời gian đầu xa nhà."],
    ["Khi cùng dự buổi tư vấn, gia đình còn có thể hỏi về ký túc xá, bữa ăn, thời gian thực tập và cách liên hệ nếu người học gặp khó khăn trong những tuần đầu.", "Gia đình nên dùng buổi tư vấn để hỏi thẳng những điều ảnh hưởng trực tiếp đến quyết định đi học: ở đâu, ăn thế nào, thực tập ra sao và liên hệ ai khi cần hỗ trợ."],
    ["Từ thao tác cơ bản, họ học cách đọc tín hiệu, vận hành thiết bị, giữ an toàn cho đồng đội và nâng năng suất của cả tổ.", "Tay nghề chỉ hình thành dần khi người học chuyển từ bài thực hành sang công việc có quy trình, thiết bị và yêu cầu phối hợp trong tổ đội."],
    ["Với người trẻ đủ sức khỏe, vài tháng học nghề có thể trở thành nền tảng cho nhiều năm làm việc có kỷ luật và tay nghề.", "Điều cần cân nhắc không phải chỉ là khóa học ngắn hay dài, mà là khả năng theo kỷ luật nghề và duy trì công việc sau khi được đào tạo."],
    ["Gia đình sẽ hiểu rõ nơi học, sinh hoạt, việc xa nhà và có thể trở thành điểm tựa cho người học trong giai đoạn đầu.", "Khi nắm rõ nơi học, điều kiện sinh hoạt và thời gian xa nhà, gia đình có thể chuẩn bị tâm lý và hỗ trợ người học thực tế hơn."],
  ],
  "tin-nganh-than/2026/08/01/tinh-doan-lai-chau-ket-noi-viec-lam-tkv/index.html": [
    ["Lớp học là nơi người mới làm quen thiết bị, quy trình an toàn, tác phong ca kíp và cách phối hợp với đồng đội trước khi bước vào môi trường sản xuất.", "Với lao động từ Lai Châu, giai đoạn đào tạo còn là thời gian chuyển từ nếp sinh hoạt ở quê sang tác phong công nghiệp: học quy trình, làm quen thiết bị và thực hành phối hợp an toàn."],
    ["Người mới vì thế dễ tìm hiểu từ chính đồng hương: học những gì, những tháng đầu thích nghi ra sao và điều gì giúp họ đứng vững trong tổ đội.", "Mạng lưới đồng hương đang học hoặc làm việc ở vùng mỏ có thể giúp người mới hỏi được những điều rất cụ thể mà một tờ thông báo khó mô tả hết."],
    ["Thông tin này cần được hỏi lại ở buổi tư vấn hiện hành, cùng với thời gian học, chế độ sinh hoạt và lịch tiếp nhận.", "Trước khi đăng ký, người lao động cần đối chiếu lại lịch tiếp nhận, thời gian học và chế độ sinh hoạt của đúng đợt đang mở."],
  ],
  "tin-nganh-than/2026/08/01/hoanh-mo-xay-lap-mo-dao-tao-nghe-viec-lam/index.html": [
    ["Đây là nội dung cần xác nhận trực tiếp, cùng danh mục hồ sơ và thời điểm khám sức khỏe, để không lấy chính sách của đợt cũ áp vào hồ sơ mới.", "Các điều kiện về hồ sơ và khám sức khỏe phải được kiểm tra theo đợt tiếp nhận hiện tại; thông tin từng được áp dụng trong một chương trình cũ không nên mặc định dùng cho hồ sơ mới."],
    ["Sau khi vào nghề, người lao động tiếp tục học qua từng ca: từ tuân thủ quy trình tới xử lý thiết bị và phối hợp an toàn với đồng đội.", "Khi đã vào tổ đội, việc học nghề tiếp tục diễn ra trong từng ca thông qua thao tác thiết bị, kỷ luật an toàn và cách phối hợp với người cùng làm."],
    ["Thành quả có sức thuyết phục nhất là những người hoàn thành đào tạo, được nhận vào tổ đội và tạo nguồn thu nhập ổn định cho gia đình.", "Thước đo của chương trình không dừng ở số người dự tuyển, mà ở số người hoàn thành đào tạo, thích nghi với công việc và duy trì được việc làm."],
  ],
  "tin-nganh-than/2026/08/01/vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv/index.html": [
    ["Cùng với đó, gia đình cần ghi rõ lịch, địa điểm, chế độ hỗ trợ và người phụ trách để mỗi quyết định đều dựa trên thông tin của đợt đang tuyển.", "Gia đình ở Vị Xuyên nên ghi lại từng mốc của đợt tuyển — thời gian, nơi tiếp nhận, chế độ trong lúc học và đầu mối liên hệ — để tránh phụ thuộc vào thông tin truyền miệng."],
    ["Khi người đi trước kể bằng trải nghiệm của chính mình, gia đình dễ hình dung hơn chuyện di chuyển, học tập và sinh hoạt xa nhà.", "Một người đã từng rời Vị Xuyên đi học nghề có thể giúp gia đình hình dung hành trình thực tế tốt hơn một phần giới thiệu chung."],
    ["Mỗi đợt có thể khác về lịch, nghề và đơn vị đồng hành; thông tin cụ thể sẽ được đối chiếu ở thời điểm đăng ký.", "Tên nghề, lịch học và đơn vị phối hợp có thể thay đổi theo từng đợt, vì vậy các chi tiết này phải được xác nhận tại thời điểm đăng ký."],
  ],
  "tin-nganh-than/2026/08/01/than-nui-beo-cao-bang-phoi-hop-tuyen-sinh-2026/index.html": [
    ["Nhiều người cần thời gian làm quen kỷ luật, sinh hoạt tập thể và nhịp học thực hành; chuẩn bị trước giúp giai đoạn này nhẹ hơn.", "Khoảng thời gian đầu ở Quảng Ninh thường là lúc người học phải đồng thời thích nghi với lịch học, nội trú và kỷ luật tập thể; chuẩn bị tâm lý trước giúp giảm nguy cơ bỏ dở."],
    ["Các chương trình trong tư liệu gắn đào tạo với doanh nghiệp, nhưng người học vẫn phải hoàn thành khóa và đạt yêu cầu tiếp nhận.", "Sự tham gia của doanh nghiệp tạo đầu ra rõ hơn, nhưng không thay thế yêu cầu người học phải hoàn thành đào tạo và đáp ứng điều kiện tiếp nhận."],
  ],
  "tin-nganh-than/2026/08/01/muong-khuong-bat-xat-tuyen-lao-dong-tkv-2024/index.html": [
    ["Bởi nó ghi lại cách địa phương, Nhà trường và doanh nghiệp cùng làm rõ nơi học, nơi ở và cơ hội việc làm cho người lao động.", "Giá trị của mô hình ở Mường Khương, Bát Xát nằm ở việc nhiều đầu mối cùng xuất hiện trong một quy trình: địa phương tạo nguồn, cơ sở đào tạo chuẩn bị tay nghề và doanh nghiệp xác định nhu cầu nhân lực."],
  ],
  "tin-nganh-than/2026/08/01/nguyen-binh-cao-bang-hieu-qua-viec-lam-tkv-2022/index.html": [
    ["Người đi trước có thể kể về lớp học, tổ đội, ca làm và giai đoạn thích nghi mà thông báo tuyển sinh không thể hiện hết.", "Kinh nghiệm của lao động Nguyễn Bình đã đi học và làm việc giúp người cùng địa phương hiểu rõ hơn quãng chuyển tiếp từ quê nhà tới lớp học, tổ đội và nhịp ca ở vùng mỏ."],
  ],
  "tin-nganh-than/2026/08/01/than-thong-nhat-tuyen-sinh-nghe-mo-lai-chau-2026/index.html": [
    ["Tiếp theo là nhận lịch tuyển, chuẩn bị đúng hồ sơ và trao đổi với gia đình về thời gian học cũng như cuộc sống xa nhà.", "Sau bước kiểm tra điều kiện, người lao động Lai Châu cần bám đúng lịch tiếp nhận và chuẩn bị hồ sơ theo hướng dẫn thay vì tự di chuyển khi chưa có xác nhận."],
  ],
  "tin-nganh-than/2026/08/01/tkv-ung-ho-10-ty-khac-phuc-bao-bualoi/index.html": [
    ["Khi sự hỗ trợ chạm tới nhà ở, trường học, sinh kế hoặc sự tri ân, hình ảnh người thợ mỏ hiện lên qua cả lao động sản xuất và tinh thần tương trợ.", "Sau thiên tai, ý nghĩa của nguồn hỗ trợ nằm ở khả năng giúp địa phương khôi phục những phần thiết yếu của đời sống, từ nhà ở tới điều kiện sinh hoạt."],
    ["Đằng sau mỗi khoản hỗ trợ là việc khảo sát, lập danh sách và chọn nhu cầu ưu tiên,những phần việc quyết định nguồn lực có đến đúng nơi hay không.", "Khâu xác định đúng nơi thiệt hại và nhu cầu cấp thiết quyết định trực tiếp việc nguồn lực phát huy hiệu quả sau bão."],
  ],
  "tin-nganh-than/2026/08/01/quang-la-quang-ninh-tuyen-sinh-nghe-mo-2025/index.html": [
    ["Cần xác nhận lịch tuyển, nghề đào tạo, chính sách hỗ trợ, cơ sở học và doanh nghiệp dự kiến tiếp nhận theo đúng đợt hiện hành.", "Người quan tâm từ Quảng La cần hỏi đúng những nội dung của đợt hiện hành: nghề nào đang nhận, ngày nào tiếp nhận, học tại đâu và đơn vị nào phối hợp."],
  ],
};

let changedFiles = 0;
let replacementsApplied = 0;
const details = [];
for (const [relative, pairs] of Object.entries(replacements)) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  let after = before;
  let applied = 0;
  for (const [from, to] of pairs) {
    if (!after.includes(from)) continue;
    after = after.replaceAll(from, to);
    applied += 1;
  }
  if (after !== before) {
    fs.writeFileSync(file, after);
    changedFiles += 1;
    replacementsApplied += applied;
    details.push({file: relative, applied});
  }
}

console.log(JSON.stringify({
  status: "editorial-uniqueness-rewrite-v9-ready",
  targetFiles: Object.keys(replacements).length,
  changedFiles,
  replacementsApplied,
  details,
}, null, 2));
