import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const changed = [];

const rewrites = {
  "tin-nganh-than/2026/08/01/viec-lam-nganh-than-thang-8-2026/index.html": {
    lede: "Đợt tuyển sinh nghề mỏ tháng 8/2026 tiếp nhận nam từ 18 đến 40 tuổi đáp ứng yêu cầu sức khỏe. Người chưa có tay nghề được học trước khi thực tập và làm việc tại các đơn vị ngành Than ở Quảng Ninh.",
    nutgraph: "Điểm cần quan tâm không nằm ở một lời mời tuyển dụng riêng lẻ, mà ở toàn bộ lộ trình từ kiểm tra điều kiện, nhập học, rèn nghề, thực tập đến tiếp nhận việc làm. Mỗi quyền lợi phải được đối chiếu theo thông tin đang áp dụng tại thời điểm đăng ký.",
    conclusion: "Người lao động nên bắt đầu bằng việc kiểm tra tuổi, chiều cao, cân nặng, thị lực và tiền sử sức khỏe; sau đó mới xác nhận nghề học, lịch nhập học và đơn vị dự kiến tiếp nhận. Một quyết định rõ ràng luôn cần đủ cả điều kiện đầu vào, thời gian đào tạo và đầu ra việc làm.",
  },
  "tin-nganh-than/2026/07/30/phuc-loi-tho-mo-tkv-2026/index.html": {
    lede: "Trong sáu tháng đầu năm 2026, hoạt động chăm lo người lao động ngành Than được triển khai từ nhà ở, khám sức khỏe, bữa ăn đến đối thoại tại nơi làm việc. Hai con số nổi bật là 108 mái ấm và hơn 71.000 lượt khám sức khỏe.",
    nutgraph: "Phúc lợi trong sản xuất theo ca không phải phần việc đứng ngoài dây chuyền. Nhà ở, dinh dưỡng, phục hồi sức khỏe và khả năng phản ánh kiến nghị tác động trực tiếp đến ngày công, an toàn và khả năng gắn bó của người lao động.",
    conclusion: "Khi tìm hiểu một đơn vị, người lao động nên hỏi cụ thể về chỗ ở, ăn ca, khám sức khỏe, bảo hiểm, nghỉ phục hồi và đầu mối Công đoàn. Giá trị của phúc lợi được thể hiện ở khả năng tiếp cận thực tế, không chỉ ở tên gọi của chương trình.",
  },
  "tin-nganh-than/2026/07/31/tai-co-cau-tkv-2026-viec-lam-tho-mo/index.html": {
    lede: "Trong định hướng giai đoạn 2026-2030, tuyển dụng, đào tạo, giữ chân thợ lò và cơ giới hóa được đặt trong cùng một bài toán nhân lực. Người trẻ có thêm cơ hội tiếp cận nghề, đồng thời phải đáp ứng yêu cầu cao hơn về kỹ năng và kỷ luật.",
    nutgraph: "Tái cơ cấu không đồng nghĩa mọi vị trí đều giữ nguyên. Công nghệ mới làm thay đổi cách tổ chức ca sản xuất, cơ cấu nghề và năng lực cần có; vì vậy khả năng học tiếp trong quá trình làm việc trở thành một phần của sự ổn định nghề nghiệp.",
    conclusion: "Người chuẩn bị vào nghề nên nhìn xa hơn thời điểm tuyển dụng đầu tiên. Sức khỏe, tay nghề nền tảng, khả năng làm việc theo quy trình và thái độ học công nghệ mới là bốn yếu tố quyết định khả năng theo nghề lâu dài.",
  },
  "tin-nganh-than/2026/08/22/truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026/index.html": {
    lede: "Chiều 19/08/2026, Thường trực Đảng ủy Than Quảng Ninh làm việc với Đảng ủy Trường Cao đẳng Than - Khoáng sản Việt Nam về tuyển sinh nghề mỏ, quản lý học sinh và chất lượng đào tạo.",
    nutgraph: "Số người nhập học mới chỉ phản ánh điểm đầu của quá trình. Hiệu quả cần được theo dõi tiếp qua thời gian đào tạo, thực tập sản xuất, khả năng thích nghi và tỷ lệ người học đi đến giai đoạn nhận việc.",
    conclusion: "Muốn tháo gỡ điểm nghẽn tuyển sinh, ba đầu mối địa phương, Nhà trường và doanh nghiệp phải dùng chung một lộ trình theo dõi. Người học cần được tư vấn đúng từ đầu, quản lý sát trong thời gian học và hỗ trợ kịp thời khi chuyển sang thực tập.",
  },
  "bai-viet/nghe-tho-lo-co-on-dinh-khong/index.html": {
    lede: "Nghề thợ lò có thể tạo việc làm dài hạn cho người đáp ứng sức khỏe, kỷ luật và tay nghề, nhưng không nên được mô tả bằng một lời khẳng định đơn giản rằng cứ vào nghề là ổn định.",
    nutgraph: "Sự ổn định cần được nhìn trên bốn phương diện: có việc làm đều, thu nhập gắn với định mức, chế độ lao động rõ ràng và khả năng duy trì sức khỏe qua nhiều năm. Thiếu một trong bốn yếu tố, đánh giá về nghề sẽ không đầy đủ.",
    conclusion: "Người cân nhắc nghề thợ lò nên tự đánh giá sức khỏe, khả năng làm việc theo ca, mức độ tuân thủ quy trình và kế hoạch gắn bó tại Quảng Ninh. Ổn định là kết quả của cả môi trường doanh nghiệp và năng lực duy trì công việc của mỗi người.",
  },
  "bai-viet/hoc-nghe-khai-thac-mo-2-3-thang/index.html": {
    lede: "Chương trình khai thác mỏ hầm lò kéo dài khoảng 2-3 tháng, tập trung vào kiến thức an toàn, kỹ năng nghề cơ bản và tác phong trước khi người học bước sang giai đoạn thực tập sản xuất.",
    nutgraph: "Thời gian đào tạo ngắn không có nghĩa yêu cầu thấp. Mỗi nội dung phải giúp người học nhận biết nguy cơ, sử dụng trang bị, phối hợp trong tổ đội và thực hiện đúng quy trình tại vị trí được phân công.",
    conclusion: "Trước khi nhập học, người lao động cần xác nhận đúng tên nghề, thời gian khóa học, chế độ ăn ở, khoản hỗ trợ và kế hoạch thực tập. Trong quá trình học, an toàn và kỷ luật phải được đặt cao hơn tâm lý muốn hoàn thành thật nhanh.",
  },
  "bai-viet/ho-so-hoc-nghe-mo-can-gi/index.html": {
    lede: "Hồ sơ ban đầu để đăng ký học nghề mỏ cần được chuẩn bị theo hướng đủ thông tin xác minh nhân thân, trình độ và điều kiện tiếp nhận; người lao động không nên gửi giấy tờ cá nhân qua một đầu mối chưa được xác nhận.",
    nutgraph: "CCCD là giấy tờ quan trọng ở bước đầu. Các giấy tờ còn thiếu như bản sao giấy khai sinh hoặc bằng học vấn có thể được hướng dẫn bổ sung theo từng trường hợp, nhưng thông tin kê khai phải thống nhất và trung thực.",
    conclusion: "Trước khi gửi hồ sơ, hãy kiểm tra họ tên, ngày sinh, số CCCD, số điện thoại và địa chỉ liên hệ. Chỉ chuyển ảnh giấy tờ cho cán bộ hoặc kênh tiếp nhận đã được xác nhận, đồng thời giữ lại bản gốc để đối chiếu khi nhập học.",
  },
  "bai-viet/dieu-kien-tuyen-tho-lo-2026/index.html": {
    lede: "Điều kiện tuyển thợ lò năm 2026 tập trung vào độ tuổi, thể lực, thị lực và khả năng làm việc trong môi trường hầm lò. Đây là bước sàng lọc an toàn trước khi xét đến hồ sơ học nghề.",
    nutgraph: "Mốc tuổi, chiều cao và cân nặng giúp người đăng ký tự kiểm tra ban đầu, nhưng không thay thế kết luận khám sức khỏe. Tiền sử tim mạch, huyết áp, thị lực và các bệnh ảnh hưởng đến lao động nặng cần được khai báo đầy đủ.",
    conclusion: "Không nên cố che giấu tình trạng sức khỏe để vượt qua bước đăng ký. Việc đánh giá đúng ngay từ đầu giúp người lao động tránh mất thời gian, đồng thời bảo vệ an toàn cho bản thân và tổ đội khi bước vào môi trường sản xuất.",
  },
  "chuyen-nguoi-tho/gia-dinh-ba-the-he-tho-mo-thong-nhat/index.html": {
    lede: "Chiếc bánh mì người cha mang về sau ca ba từng là món quà tuổi thơ của Nguyễn Duy Khánh. Nhiều năm sau, ký ức ấy theo anh xuống hầm lò, nối tiếp con đường mà ông nội và cha đã đi trước.",
    nutgraph: "Ba thế hệ cùng làm nghề mỏ không tạo nên một câu chuyện chỉ có màu sắc truyền thống. Mỗi người bước vào nghề trong điều kiện khác nhau và phải tự chứng minh lựa chọn của mình bằng tay nghề, kỷ luật và trách nhiệm với gia đình.",
    conclusion: "Điều còn lại sau câu chuyện ba thế hệ không phải lời kêu gọi ai cũng nên theo nghề. Đó là cách một gia đình truyền cho nhau sự tôn trọng lao động, còn quyết định bước xuống hầm lò vẫn thuộc về từng người sau khi hiểu đầy đủ điều kiện của nghề.",
  },
  "chuyen-nguoi-tho/tho-mo-vao-ca-duong-huy/index.html": {
    lede: "Từ 5 giờ 30 phút, khai trường Than Dương Huy đã bước vào nhịp chuẩn bị cho ca đầu ngày. Gần 400 công nhân ăn sáng, nhận thiết bị, nghe giao việc rồi lần lượt đi xuống những đường lò sâu.",
    nutgraph: "Một ca sản xuất dưới lòng đất bắt đầu từ mặt đất, với bữa ăn, nhà đèn, bộ bảo hộ, giao việc và kiểm tra thiết bị. Những bước tưởng như quen thuộc tạo nên lớp phòng ngừa đầu tiên trước khi tổ đội tiếp cận vị trí sản xuất.",
    conclusion: "Nhịp vào ca cho thấy nghề mỏ được vận hành bằng sự phối hợp của nhiều người và nhiều bước kiểm soát. Sức mạnh của tổ đội không đến từ việc bỏ qua quy trình để làm nhanh hơn, mà từ khả năng giữ đúng kỷ luật trong mọi ca làm việc.",
  },
  "giai-dap-nghe-mo/lo-trinh-di-lam-mo-than-quang-ninh-tu-dang-ky-den-nhan-viec/index.html": {
    lede: "Lộ trình đi làm mỏ tại Quảng Ninh gồm năm chặng: kiểm tra điều kiện, xác nhận hồ sơ, nhập học, thực tập và hoàn thiện thủ tục nhận việc. Người đăng ký cần biết rõ đầu mối phụ trách ở từng chặng.",
    nutgraph: "Sai sót thường xảy ra khi người lao động chỉ quan tâm ngày đi mà bỏ qua điều kiện sức khỏe, nghề học hoặc lịch bổ sung giấy tờ. Một lộ trình minh bạch phải cho phép người học biết mình đang ở bước nào và cần hoàn thành việc gì tiếp theo.",
    conclusion: "Hãy lưu lại số điện thoại cán bộ hướng dẫn, lịch nhập học, địa chỉ ký túc xá và danh sách giấy tờ còn thiếu. Khi có thay đổi về sức khỏe, thời gian di chuyển hoặc kế hoạch gia đình, cần báo sớm để được điều chỉnh thay vì tự ý bỏ dở.",
  },
};

function replaceClassParagraph(html, className, value) {
  const escaped = value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const pattern = new RegExp(`<p\\b([^>]*)class=(['"])([^'"]*\\b${className}\\b[^'"]*)\\2([^>]*)>[\\s\\S]*?<\\/p>`, "i");
  if (pattern.test(html)) {
    return html.replace(pattern, (_tag, before, quote, classes, after) => `<p${before}class=${quote}${classes}${quote}${after}>${escaped}</p>`);
  }
  return html;
}

function upsertConclusion(html, value) {
  const escaped = value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const block = `<p class="article-conclusion">${escaped}</p>`;
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
  status: "editorial-priority-rewrites-v4-complete",
  planned: Object.keys(rewrites).length,
  changed: changed.length,
  files: changed,
}, null, 2));
