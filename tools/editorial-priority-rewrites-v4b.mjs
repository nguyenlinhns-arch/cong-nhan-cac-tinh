import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const changed = [];

const rewrites = {
  "tin-nganh-than/2026/08/01/bao-lac-cao-bang-tu-van-hoc-nghe-mo/index.html": {
    lede: "Ngày 19/04/2025, đoàn công tác xã Hưng Đạo, huyện Bảo Lạc làm việc với Phân hiệu Hoành Bồ về kết quả tư vấn nghề mỏ trong quý I và kế hoạch triển khai những tháng tiếp theo.",
    nutgraph: "Giá trị của cuộc làm việc nằm ở khả năng đưa thông tin trở lại xã, thôn và theo dõi từng người từ lúc được tư vấn đến khi hoàn thiện hồ sơ, nhập học. Số buổi tuyên truyền chỉ là dữ liệu đầu vào, chưa phải kết quả cuối cùng.",
    conclusion: "Để hoạt động tư vấn có hiệu quả, địa phương và Nhà trường cần duy trì danh sách người quan tâm, xác nhận điều kiện sức khỏe, giải đáp với gia đình và theo dõi tới ngày nhập học. Người lao động cũng cần được biết rõ nơi học, thời gian học và đầu ra việc làm trước khi quyết định.",
  },
  "tin-nganh-than/2026/08/01/dam-ha-than-thong-nhat-dao-tao-viec-lam-2026/index.html": {
    lede: "Ngày 22/05/2026, UBND xã Đầm Hà, Công ty Than Thống Nhất và Trường Cao đẳng Than - Khoáng sản Việt Nam ký thỏa thuận phối hợp đào tạo nghề, giải quyết việc làm giai đoạn 2026-2030.",
    nutgraph: "Thỏa thuận tạo một tuyến trách nhiệm từ tư vấn tại địa phương, đào tạo tại Nhà trường đến tiếp nhận tại doanh nghiệp. Người đăng ký cần nhìn thấy đầy đủ tuyến này thay vì chỉ nghe một thông điệp chung về cơ hội việc làm.",
    conclusion: "Hiệu quả của mô hình ba bên phải được đo bằng số người đủ điều kiện, nhập học, hoàn thành đào tạo và được tiếp nhận. Với từng ứng viên, bước đầu tiên vẫn là đối chiếu sức khỏe, nghề học và lịch tiếp nhận đang áp dụng.",
  },
  "tin-nganh-than/2026/08/01/si-lo-lau-khun-ha-lai-chau-hoc-nghe-mo/index.html": {
    lede: "Hoạt động tư vấn tại Sì Lở Lầu và Khun Há mở thêm kênh tiếp cận học nghề mỏ cho lao động ở địa bàn miền núi Lai Châu, nơi khoảng cách đi lại và thông tin thường là hai trở ngại lớn trước ngày nhập học.",
    nutgraph: "Một buổi tư vấn chỉ có ý nghĩa khi người lao động và gia đình nhận được thông tin có thể kiểm tra: điều kiện sức khỏe, nơi học, thời gian đào tạo, chế độ trong thời gian học và đơn vị dự kiến tiếp nhận sau đào tạo.",
    conclusion: "Địa phương cần giữ vai trò xác nhận và hỗ trợ liên hệ sau hội nghị; Nhà trường cần cung cấp lịch trình rõ ràng; người đăng ký cần chủ động báo những vướng mắc về giấy tờ, sức khỏe và phương tiện di chuyển trước ngày đi.",
  },
  "tin-nganh-than/2026/08/01/tuyen-quang-phoi-hop-tuyen-sinh-nghe-mo-2025-2030/index.html": {
    lede: "Chương trình phối hợp tuyển sinh nghề mỏ tại Tuyên Quang giai đoạn 2025-2030 đặt địa phương, cơ sở đào tạo và doanh nghiệp trong cùng một quy trình tư vấn, đào tạo và giải quyết việc làm.",
    nutgraph: "Cam kết phối hợp chỉ tạo ra giá trị khi trách nhiệm của từng bên được cụ thể hóa. Địa phương tiếp cận đúng người, Nhà trường bảo đảm đào tạo và quản lý học sinh, doanh nghiệp cung cấp nhu cầu tuyển dụng và điều kiện tiếp nhận.",
    conclusion: "Người lao động nên yêu cầu một lộ trình có thể kiểm chứng thay vì chỉ dựa vào lời giới thiệu: cán bộ phụ trách, địa chỉ nhập học, nghề học, thời gian đào tạo và bước chuyển sang doanh nghiệp sau khi hoàn thành chương trình.",
  },
  "tin-nganh-than/2026/08/13/tuyen-sinh-nghe-mo-dong-ngu-2026/index.html": {
    lede: "Hoạt động tư vấn nghề mỏ tại Đông Ngũ đưa thông tin tuyển sinh đến gần người lao động và gia đình, đồng thời tạo đầu mối để địa phương theo dõi hồ sơ sau buổi gặp trực tiếp.",
    nutgraph: "Tư vấn hiệu quả không được đo bằng số người ngồi nghe. Kết quả cần được theo dõi qua số trường hợp đủ điều kiện, số hồ sơ hoàn thiện, số người nhập học và khả năng duy trì việc học đến giai đoạn thực tập.",
    conclusion: "Sau buổi tư vấn, mỗi người quan tâm cần có một đầu mối liên hệ, danh sách giấy tờ cần chuẩn bị và thời gian dự kiến cho bước tiếp theo. Gia đình nên được giải đáp cùng người lao động để tránh quyết định vội hoặc bỏ dở giữa chừng.",
  },
  "tin-nganh-than/2026/08/13/hoc-sinh-thuc-tap-than-khe-cham-2026/index.html": {
    lede: "Giai đoạn thực tập tại Than Khe Chàm đưa học sinh từ môi trường đào tạo sang nhịp sản xuất thực tế, nơi kiến thức an toàn, tác phong và khả năng phối hợp trong tổ đội được kiểm tra đồng thời.",
    nutgraph: "Thực tập không phải khoảng chờ trước khi nhận việc. Đây là chặng chuyển tiếp có ảnh hưởng lớn đến khả năng thích nghi, vì người học phải làm quen với ca kíp, quy trình, thiết bị và trách nhiệm tại vị trí được phân công.",
    conclusion: "Nhà trường và doanh nghiệp cần theo dõi sát sức khỏe, kỷ luật và tiến bộ nghề của từng học sinh. Người thực tập nên báo sớm khó khăn thay vì tự bỏ ca hoặc rời chương trình, bởi hỗ trợ đúng thời điểm có thể quyết định khả năng tiếp tục theo nghề.",
  },
  "tin-nganh-than/2026/08/13/bua-com-cong-doan-than-cao-son-2026/index.html": {
    lede: "Bữa cơm Công đoàn tại Than Cao Sơn tập trung vào một nhu cầu rất cụ thể của lao động theo ca: bữa ăn phải đủ dinh dưỡng, đúng thời gian và phù hợp với cường độ công việc.",
    nutgraph: "Giá trị của chương trình không chỉ nằm ở một bữa ăn được tổ chức trong ngày phát động. Điều cần theo dõi là chất lượng suất ăn thường xuyên, quy trình kiểm soát an toàn thực phẩm và khả năng tiếp nhận phản hồi của người lao động.",
    conclusion: "Bữa ăn ca là một phần của điều kiện lao động. Doanh nghiệp và Công đoàn cần duy trì kiểm tra định lượng, chất lượng và vệ sinh; người lao động cần phản ánh qua đúng đầu mối khi suất ăn không đáp ứng yêu cầu sức khỏe hoặc ca sản xuất.",
  },
  "tin-nganh-than/2026/08/14/than-ha-tu-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026/index.html": {
    lede: "Chương trình hỗ trợ nữ công nhân tại Than Hà Tu hướng nguồn lực đến những gia đình cần thêm điều kiện phát triển kinh tế, qua đó giảm bớt áp lực đời sống bên ngoài ca sản xuất.",
    nutgraph: "Một khoản hỗ trợ chỉ phát huy hiệu quả khi phù hợp với hoàn cảnh, có mục tiêu sử dụng rõ và được theo dõi sau giải ngân. Đây là hoạt động dành cho trường hợp cụ thể, không phải chế độ mặc định áp dụng cho mọi lao động nữ.",
    conclusion: "Khi truyền thông về chương trình, cần tập trung vào cách tổ chức hỗ trợ và kết quả sử dụng nguồn lực, đồng thời bảo vệ đời tư của người nhận. Công đoàn cơ sở nên tiếp tục đồng hành để khoản hỗ trợ tạo ra thay đổi bền vững thay vì chỉ giải quyết nhu cầu trước mắt.",
  },
  "tin-nganh-than/2026/08/21/kho-van-da-bac-ho-tro-nu-cong-nhan-phat-trien-kinh-te-2026/index.html": {
    lede: "Kho vận Đá Bạc triển khai hỗ trợ nữ công nhân phát triển kinh tế gia đình, kết hợp nguồn lực của tổ chức Công đoàn với nhu cầu thực tế của người lao động.",
    nutgraph: "Thông tin về một trường hợp được hỗ trợ cần được đặt đúng phạm vi. Khoản tiền, hình thức hỗ trợ và kết quả là dữ kiện của chương trình cụ thể, không đại diện cho một mức quyền lợi chung tại mọi đơn vị.",
    conclusion: "Hiệu quả cần được đánh giá sau một khoảng thời gian đủ dài: nguồn lực có được dùng đúng mục tiêu, thu nhập gia đình có cải thiện và người lao động có giảm bớt áp lực hay không. Việc theo dõi này quan trọng hơn hình ảnh trao hỗ trợ trong ngày đầu.",
  },
  "tin-nganh-than/2026/08/22/xay-lap-mo-ho-tro-gia-dinh-cong-nhan-kho-khan-2026/index.html": {
    lede: "Sáng 16/08/2026, đại diện Công ty Xây lắp mỏ - TKV, Công đoàn và Phân xưởng Đào lò 15 đến thăm một gia đình công nhân tại Hải Phòng; riêng đồng nghiệp trong phân xưởng quyên góp 31,5 triệu đồng để cùng chia sẻ khó khăn.",
    nutgraph: "Khoản 31,5 triệu đồng là hỗ trợ tự nguyện cho một trường hợp cụ thể, không phải chế độ áp dụng chung. Hoạt động cho thấy mạng lưới chăm lo có thể bắt đầu từ đơn vị sản xuất, nơi đồng nghiệp nắm rõ hoàn cảnh và nhu cầu trước mắt.",
    conclusion: "Một chuyến thăm có thể giảm áp lực cấp thời, còn gia đình có con nhỏ và người thân đau ốm thường cần sự theo dõi dài hơn. Đơn vị trực tiếp nên tiếp tục kết nối chế độ hợp lệ, hỗ trợ công việc và tôn trọng đời tư của gia đình.",
  },
  "bai-viet/an-toan-mua-mua-bao-2026/index.html": {
    lede: "Mùa mưa bão làm tăng nguy cơ ngập nước, sạt lở, mất điện, gián đoạn giao thông và thay đổi điều kiện làm việc tại khu vực khai trường, bãi thải và đường vận chuyển.",
    nutgraph: "An toàn trong giai đoạn này phụ thuộc vào chuẩn bị trước khi thời tiết xấu xảy ra: cập nhật dự báo, kiểm tra thoát nước, thiết bị điện, phương án sơ tán và trách nhiệm chỉ huy tại từng vị trí.",
    conclusion: "Người lao động không tự ý đi qua khu vực đã cảnh báo, không xử lý sự cố ngoài phạm vi được giao và phải báo ngay dấu hiệu bất thường. Doanh nghiệp cần cập nhật phương án theo diễn biến thực tế, không dùng một kế hoạch cố định cho mọi trận mưa.",
  },
  "bai-viet/san-xuat-sach-hon-nganh-than/index.html": {
    lede: "Sản xuất sạch hơn trong ngành Than tập trung vào giảm bụi, nước thải, tổn thất tài nguyên và năng lượng tiêu hao trong từng công đoạn khai thác, vận chuyển và sàng tuyển.",
    nutgraph: "Khái niệm này không dừng ở việc trồng cây hoặc làm sạch khu vực sản xuất. Hiệu quả phải được đo bằng công nghệ, quy trình vận hành, dữ liệu môi trường và khả năng ngăn ô nhiễm ngay từ nguồn phát sinh.",
    conclusion: "Người lao động góp phần bằng việc vận hành đúng thiết bị, phân loại chất thải, báo rò rỉ và tuân thủ quy trình môi trường. Doanh nghiệp phải cung cấp thiết bị, đo lường và công khai trách nhiệm; không thể chuyển toàn bộ nghĩa vụ sang ý thức cá nhân.",
  },
  "bai-viet/hoc-thuc-hanh-nghe-mo-ham-lo/index.html": {
    lede: "Thực hành nghề mỏ hầm lò giúp người học chuyển kiến thức an toàn và thao tác cơ bản thành phản xạ có kiểm soát trước khi tiếp cận môi trường sản xuất thực tế.",
    nutgraph: "Một buổi thực hành đạt yêu cầu phải có mục tiêu, người hướng dẫn, thiết bị phù hợp và tiêu chí đánh giá. Làm được thao tác một lần chưa đồng nghĩa đã đủ khả năng làm việc độc lập trong điều kiện thay đổi.",
    conclusion: "Người học cần hỏi lại khi chưa hiểu, thực hiện đúng thứ tự và dừng thao tác khi điều kiện không an toàn. Chất lượng thực hành được thể hiện ở khả năng nhận biết rủi ro và phối hợp với tổ đội, không chỉ ở tốc độ hoàn thành bài tập.",
  },
  "bai-viet/dao-tao-an-toan-truoc-khi-vao-lo/index.html": {
    lede: "Đào tạo an toàn trước khi vào lò là bước bắt buộc để người lao động hiểu nguy cơ, tín hiệu cảnh báo, phương án thoát nạn và giới hạn công việc của vị trí được giao.",
    nutgraph: "Nội dung an toàn chỉ có giá trị khi người học có thể áp dụng trong tình huống thực tế. Việc ký xác nhận hoàn thành khóa học không thay thế kiểm tra kiến thức, thực hành và hướng dẫn tại nơi làm việc.",
    conclusion: "Người lao động không nên giấu phần chưa hiểu vì sợ chậm tiến độ. Trước ca đầu tiên, cần biết rõ đường đi, đầu mối chỉ huy, thiết bị tự cứu và cách liên lạc khi có sự cố; mọi thay đổi vị trí đều cần được hướng dẫn lại.",
  },
  "bai-viet/co-gioi-hoa-khai-thac-ham-lo/index.html": {
    lede: "Cơ giới hóa khai thác hầm lò chuyển một phần công việc nặng nhọc sang thiết bị, đồng thời làm tăng yêu cầu về vận hành, bảo dưỡng, giám sát và phối hợp kỹ thuật.",
    nutgraph: "Máy móc không tự động loại bỏ rủi ro. Công nghệ mới tạo ra nhóm nguy cơ khác liên quan đến năng lượng, không gian làm việc, tín hiệu điều khiển và sự phụ thuộc giữa nhiều khâu trong dây chuyền.",
    conclusion: "Người lao động cần học liên tục để theo kịp thiết bị và quy trình. Doanh nghiệp phải gắn đầu tư công nghệ với đào tạo, bảo trì và đánh giá rủi ro; nếu chỉ mua máy mà thiếu năng lực vận hành, hiệu quả và an toàn đều bị ảnh hưởng.",
  },
  "bai-viet/13500-tho-lo-thu-nhap-tren-300-trieu-2025/index.html": {
    lede: "Số liệu năm 2025 ghi nhận khoảng 13.500 thợ lò có tổng thu nhập trên 300 triệu đồng trong năm, một chỉ dấu đáng chú ý về khả năng tạo thu nhập của nhóm lao động trực tiếp dưới hầm lò.",
    nutgraph: "Con số trên là mức thu nhập theo năm của nhóm người đạt ngưỡng được thống kê, không phải mức lương cứng áp dụng đồng đều. Khi so sánh, cần xét ngày công, vị trí, định mức, sản lượng và phạm vi doanh nghiệp trong dữ liệu gốc.",
    conclusion: "Người tìm hiểu nghề nên dùng số liệu này như một dữ kiện tham khảo về mặt bằng của nhóm lao động đạt kết quả cao, đồng thời đối chiếu cam kết tuyển sinh hiện hành, cách tính thu nhập và yêu cầu công việc tại đơn vị dự kiến tiếp nhận.",
  },
};

function escapeText(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replaceClassParagraph(html, className, value) {
  const pattern = new RegExp(`<p\\b([^>]*)class=(['"])([^'"]*\\b${className}\\b[^'"]*)\\2([^>]*)>[\\s\\S]*?<\\/p>`, "i");
  if (!pattern.test(html)) return html;
  return html.replace(pattern, (_tag, before, quote, classes, after) => `<p${before}class=${quote}${classes}${quote}${after}>${escapeText(value)}</p>`);
}

function upsertConclusion(html, value) {
  const block = `<p class="article-conclusion">${escapeText(value)}</p>`;
  if (/<p\b[^>]*class=(['"])[^'"]*\barticle-conclusion\b/i.test(html)) {
    return html.replace(/<p\b([^>]*)class=(['"])([^'"]*\barticle-conclusion\b[^'"]*)\2([^>]*)>[\s\S]*?<\/p>/i, block);
  }
  if (/<!-- newsroom-copy-v3:end -->/i.test(html)) return html.replace(/<!-- newsroom-copy-v3:end -->/i, `${block}\n<!-- newsroom-copy-v3:end -->`);
  if (/<p\b[^>]*class=(['"])[^'"]*\barticle-source-responsibility\b/i.test(html)) {
    return html.replace(/(<p\b[^>]*class=(['"])[^'"]*\barticle-source-responsibility\b)/i, `${block}\n$1`);
  }
  if (/<section\b[^>]*class=(['"])[^'"]*\barticle-apply\b/i.test(html)) {
    return html.replace(/(<section\b[^>]*class=(['"])[^'"]*\barticle-apply\b)/i, `${block}\n$1`);
  }
  return html.replace(/<\/article>/i, `${block}\n</article>`);
}

for (const [relative, rewrite] of Object.entries(rewrites)) {
  const file = path.join(siteRoot, relative);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  let after = replaceClassParagraph(before, "professional-lede", rewrite.lede);
  after = replaceClassParagraph(after, "professional-nutgraph", rewrite.nutgraph);
  after = upsertConclusion(after, rewrite.conclusion);
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(relative);
}

console.log(JSON.stringify({
  status: "editorial-priority-rewrites-v4b-complete",
  planned: Object.keys(rewrites).length,
  changed: changed.length,
  files: changed,
}, null, 2));
