import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://nguyenlinhns-arch.github.io/cong-nhan-cac-tinh/tuyen-tho-mo";
const published = "2026-07-30T10:30:00+07:00";
const dateLabel = "30/07/2026";
const imageSources = JSON.parse(
  fs.readFileSync(path.join(root, "assets", "articles", "sources.json"), "utf8"),
);

const clusterInfo = {
  entry: {
    label: "Điều kiện và hồ sơ",
    intro: "Đăng ký học nghề mỏ nên bắt đầu bằng việc kiểm tra điều kiện thật, thay vì chuẩn bị nhiều giấy tờ rồi mới biết mình có phù hợp hay không. Việc sàng lọc ban đầu giúp người lao động tiết kiệm thời gian, chủ động kế hoạch đi lại và nhận hướng dẫn đúng theo từng đợt tuyển.",
    practice: "Thông tin tư vấn ban đầu không thay thế kết luận khám sức khỏe. Người đăng ký cần khai đúng tuổi, thể lực và tình trạng sức khỏe; khi nhập học hoặc tiếp nhận vẫn thực hiện các bước kiểm tra theo yêu cầu của đơn vị.",
    steps: ["Gửi năm sinh và nơi đang sinh sống", "Gửi chiều cao, cân nặng thực tế", "Nêu rõ tình trạng sức khỏe, mắt và bệnh đang điều trị", "Nhận xác nhận điều kiện, lịch và hồ sơ của đúng đợt"],
    warnings: ["Không che giấu bệnh hoặc dùng số đo ước lượng", "Không chuyển tiền cho tài khoản không được xác minh", "Không tự mua vé trước khi có lịch tiếp nhận rõ ràng"],
    related: ["lo-trinh-hoc-nghe-khai-thac-mo", "ho-so-hoc-nghe-mo-can-gi"],
  },
  training: {
    label: "Học nghề mỏ",
    intro: "Đào tạo nghề mỏ tập trung vào kiến thức nghề, thực hành và kỷ luật an toàn trước khi người học làm việc tại doanh nghiệp. Thời gian học khác nhau theo nghề: khai thác mỏ và xây dựng mỏ khoảng 2–3 tháng; cơ điện mỏ khoảng 10 tháng.",
    practice: "Lịch học, địa điểm, chế độ ăn ở và mức hỗ trợ cần được xác nhận theo thông báo của từng đợt. Người học nên quan tâm cả nội dung thực hành, ý thức kỷ luật và khả năng thích nghi với môi trường công nghiệp, không chỉ nhìn vào thời gian khóa học.",
    steps: ["Kiểm tra điều kiện sức khỏe ban đầu", "Chọn nghề phù hợp với thể lực và định hướng", "Hoàn thiện hồ sơ theo hướng dẫn", "Học lý thuyết, thực hành và an toàn trước khi tiếp nhận"],
    warnings: ["Không hiểu 2–3 tháng là bỏ qua thực hành", "Không đánh đồng thời gian học của nghề khai thác với cơ điện", "Không tự ý bỏ lịch học, lịch kiểm tra hoặc nội quy ký túc xá"],
    related: ["hoc-nghe-khai-thac-mo-2-3-thang", "hoc-co-dien-mo-10-thang"],
  },
  work: {
    label: "Công việc và thu nhập",
    intro: "Thu nhập ngành Than hình thành từ vị trí việc làm, ngày công, năng suất, mức độ hoàn thành nhiệm vụ và chế độ của từng doanh nghiệp. Mức 20–25 triệu đồng/tháng thường được dùng để tham khảo cho thợ lò, nhưng không phải con số cố định cho mọi người và mọi tháng.",
    practice: "Người lao động nên hỏi rõ cách tính lương, ca làm, định mức, phụ cấp, ăn ca, xe đưa đón, chỗ ở và bảo hiểm. Khi đối chiếu bảng lương thực tế cần xem cả số ngày công và vị trí, tránh chỉ nhìn tổng tiền cuối tháng.",
    steps: ["Xác định đúng vị trí dự kiến làm việc", "Hỏi cách tính lương và điều kiện hưởng phụ cấp", "Đối chiếu ngày công, năng suất và khoản khấu trừ", "Lập kế hoạch chi tiêu cho 3 tháng đầu đi làm"],
    warnings: ["Không coi mức thu nhập cao nhất là mức khởi điểm", "Không bỏ qua tính chất nặng nhọc và yêu cầu kỷ luật", "Không so sánh hai bảng lương khi khác ngày công hoặc vị trí"],
    related: ["luong-tho-lo-20-25-trieu-moi-thang", "cach-tinh-luong-tho-lo-theo-ngay-cong-nang-suat"],
  },
  welfare: {
    label: "Đời sống và phúc lợi",
    intro: "Một công việc ổn định không chỉ được đánh giá bằng tiền lương. Với lao động ở xa đến Quảng Ninh, chỗ ở, bữa ăn, xe đưa đón, khám sức khỏe, bảo hiểm và khả năng giữ liên lạc với gia đình ảnh hưởng trực tiếp đến việc gắn bó lâu dài.",
    practice: "Chế độ cụ thể có thể khác theo doanh nghiệp và thời điểm. Người đăng ký nên hỏi đúng đơn vị dự kiến tiếp nhận, đọc thông báo hiện hành và giữ lại thông tin tư vấn để đối chiếu khi làm thủ tục.",
    steps: ["Hỏi chỗ ở trong thời gian học và sau khi nhận việc", "Xác nhận bữa ăn, xe đưa đón và lịch ca", "Tìm hiểu khám sức khỏe và bảo hiểm", "Tính chi phí cá nhân còn phải tự chi trả"],
    warnings: ["Không mặc định mọi đơn vị có chế độ giống nhau", "Không bỏ qua khoảng cách từ nơi ở đến nơi làm việc", "Không dựa vào thông tin cũ để coi là cam kết hiện hành"],
    related: ["nha-o-ky-tuc-xa-cong-nhan-mo", "bua-an-ca-va-dinh-duong-tho-mo"],
  },
  technology: {
    label: "An toàn và công nghệ",
    intro: "Khai thác hầm lò hiện đại dựa vào phối hợp giữa con người, quy trình an toàn và thiết bị. Cơ giới hóa, tự động hóa, thông gió, vận tải và giám sát số giúp giảm lao động thủ công ở nhiều khâu, nhưng không làm mất đi yêu cầu tuân thủ kỷ luật của từng người.",
    practice: "Người mới vào nghề cần học cách nhận biết nguy cơ, dùng bảo hộ, nghe lệnh sản xuất và báo cáo bất thường. Công nghệ chỉ phát huy tác dụng khi thiết bị được vận hành đúng quy trình và dữ liệu được kiểm tra liên tục.",
    steps: ["Học nội quy và nhận diện nguy cơ", "Kiểm tra bảo hộ trước ca", "Tuân thủ tín hiệu, tuyến đi lại và phân công", "Báo ngay hiện tượng bất thường cho người phụ trách"],
    warnings: ["Không tự ý vận hành thiết bị khi chưa được giao", "Không bỏ qua bước kiểm tra trước ca", "Không coi máy móc là sự thay thế cho kỷ luật an toàn"],
    related: ["co-gioi-hoa-khai-thac-ham-lo", "an-toan-lao-dong-trong-ham-lo"],
  },
  province: {
    label: "Việc làm theo địa phương",
    intro: "Lao động từ các tỉnh miền Trung, Tây Nguyên và miền núi phía Bắc có thể tìm hiểu học nghề mỏ để làm việc tại Quảng Ninh nếu đáp ứng điều kiện. Điều cần chuẩn bị kỹ nhất là thông tin sức khỏe, kế hoạch di chuyển và trao đổi với gia đình về thời gian học, nơi ở và công việc sau đào tạo.",
    practice: "Khoảng cách địa lý khiến việc xác nhận lịch càng quan trọng. Người đăng ký nên chỉ khởi hành khi đã được kiểm tra điều kiện ban đầu, nhận địa điểm và người liên hệ rõ ràng; đồng thời chuẩn bị giấy tờ gốc theo hướng dẫn.",
    steps: ["Gửi thông tin kiểm tra điều kiện từ xa", "Nhận lịch, địa điểm và số liên hệ xác minh", "Chuẩn bị giấy tờ cùng đồ dùng cá nhân", "Chủ động phương án di chuyển và liên lạc gia đình"],
    warnings: ["Không đi khi chưa có lịch và địa chỉ rõ ràng", "Không giao giấy tờ gốc cho người không có trách nhiệm", "Không tin lời hứa thu nhập cố định không kèm điều kiện"],
    related: ["viec-lam-tho-mo-thanh-hoa", "viec-lam-tho-mo-gia-lai"],
  },
};

const topics = [
  ["dieu-kien-tuyen-tho-lo-2026","Điều kiện tuyển thợ lò 2026: kiểm tra trước khi đăng ký","điều kiện tuyển thợ lò 2026","Điều kiện cơ bản gồm độ tuổi, thể lực và sức khỏe; kết quả cuối cùng căn cứ kiểm tra của đơn vị tiếp nhận.","entry",["Nam 18–40 tuổi là nhóm đang được sàng lọc","Chiều cao tham khảo từ 1m53","Cân nặng tham khảo từ 47kg","Sức khỏe phải phù hợp nghề nặng nhọc","Nên gửi đủ ba thông tin trước khi chuẩn bị hồ sơ"]],
  ["ba-thong-tin-dang-ky-hoc-nghe-mo","Ba thông tin cần gửi khi đăng ký học nghề mỏ","đăng ký học nghề mỏ","Năm sinh, chiều cao/cân nặng và tình trạng sức khỏe giúp kiểm tra nhanh khả năng phù hợp.","entry",["Năm sinh giúp xác định nhóm tuổi tuyển","Chiều cao và cân nặng phải là số đo thực tế","Cần nói rõ bệnh đang điều trị","Tình trạng mắt cần khai trung thực","Địa phương đang ở giúp hướng dẫn lịch di chuyển"]],
  ["ho-so-hoc-nghe-mo-can-gi","Hồ sơ học nghề mỏ cần gì? Danh sách ngắn dễ nhớ","hồ sơ học nghề mỏ cần gì","Hồ sơ hiện hướng dẫn gồm căn cước công dân, giấy khai sinh và bằng cấp 2 hoặc cấp 3 nếu có.","entry",["Căn cước công dân là giấy tờ nhận diện chính","Giấy khai sinh dùng để đối chiếu thông tin","Bằng cấp 2 hoặc cấp 3 mang theo nếu có","Không có bằng thì cần báo trước để được hướng dẫn","Nên giữ bản chụp giấy tờ trên điện thoại"]],
  ["tuoi-hoc-nghe-mo-va-lam-tho-lo","Bao nhiêu tuổi có thể học nghề mỏ và làm thợ lò?","tuổi học nghề mỏ","Người từ 18 đến 40 tuổi có thể gửi thông tin kiểm tra ban đầu, sau đó tiếp tục xét sức khỏe và tiêu chí của đợt tuyển.","entry",["Đủ 18 tuổi mới thuộc nhóm lao động trưởng thành","Mốc 40 tuổi là tiêu chí sàng lọc hiện hành","Tuổi phù hợp chưa đồng nghĩa chắc chắn trúng tuyển","Sức khỏe và thể lực vẫn là điều kiện quan trọng","Nên kiểm tra trước khi đi xa"]],
  ["chieu-cao-can-nang-tuyen-tho-lo","Chiều cao, cân nặng tuyển thợ lò: cách tự kiểm tra","chiều cao cân nặng tuyển thợ lò","Mốc tham khảo hiện hành là từ 1m53 và 47kg; nên đo đúng thay vì ước lượng.","entry",["Đo chiều cao không mang giày","Cân vào thời điểm cơ thể ổn định","Không làm tròn số quá nhiều","Thể lực thực tế còn được đánh giá khi khám","Kết hợp ngủ đủ và ăn uống bình thường trước kiểm tra"]],
  ["suc-khoe-hoc-nghe-mo","Sức khỏe học nghề mỏ: những điều phải khai trung thực","sức khỏe học nghề mỏ","Nghề mỏ có yêu cầu sức khỏe riêng; việc khai đúng giúp bảo vệ chính người lao động và đồng đội.","entry",["Cần nói rõ bệnh tim mạch hoặc huyết áp","Khai bệnh hô hấp đang điều trị","Thông báo tiền sử chấn thương ảnh hưởng vận động","Không giấu việc đang dùng thuốc dài ngày","Kết luận chính thức thuộc cơ sở khám và đơn vị tuyển"]],
  ["can-thi-co-hoc-nghe-mo-duoc-khong","Cận thị có học nghề mỏ được không? Cách kiểm tra đúng","cận thị có học nghề mỏ được không","Tình trạng thị lực cần được khai trước và đánh giá theo tiêu chuẩn sức khỏe của vị trí dự kiến.","entry",["Không tự kết luận chỉ dựa trên số độ kính","Mang theo thông tin khám mắt gần nhất nếu có","Nêu rõ bệnh mắt khác ngoài cận thị","Thị lực ảnh hưởng khả năng quan sát và an toàn","Chờ kết luận của bước khám chuyên môn"]],
  ["quy-trinh-dang-ky-tuyen-tho-mo","Quy trình đăng ký tuyển thợ mỏ từ xa đến nhập học","quy trình đăng ký tuyển thợ mỏ","Quy trình rõ ràng giúp người ở xa giảm đi lại và tránh chuẩn bị sai giấy tờ.","entry",["Bước đầu gửi ba thông tin sàng lọc","Nhận tư vấn nghề và lịch dự kiến","Chuẩn bị giấy tờ theo đúng hướng dẫn","Đến địa điểm tiếp nhận đúng giờ","Hoàn thành kiểm tra trước khi xếp lớp"]],
  ["chuan-bi-truoc-ngay-nhap-hoc-nghe-mo","Chuẩn bị gì trước ngày nhập học nghề mỏ?","chuẩn bị nhập học nghề mỏ","Ngoài giấy tờ, người học cần chuẩn bị đồ dùng cá nhân, lịch trình và tâm lý tuân thủ nội quy.","entry",["Đối chiếu lại địa điểm và giờ tập trung","Mang giấy tờ gốc theo danh sách","Chuẩn bị đồ dùng cá nhân gọn nhẹ","Lưu số người phụ trách và số gia đình","Không mang vật dụng bị cấm vào ký túc xá"]],
  ["sai-lam-khi-dang-ky-hoc-nghe-mo","7 sai lầm thường gặp khi đăng ký học nghề mỏ","sai lầm khi đăng ký học nghề mỏ","Các lỗi phổ biến thường đến từ thông tin thiếu, tin lời môi giới không rõ danh tính hoặc đi trước khi có lịch.","entry",["Khai sai tuổi hoặc số đo cơ thể","Giấu tình trạng sức khỏe","Chuẩn bị hồ sơ theo thông báo đã cũ","Chuyển tiền mà không xác minh người nhận","Tự đi khi chưa có lịch tiếp nhận"]],

  ["hoc-nghe-khai-thac-mo-2-3-thang","Học nghề khai thác mỏ 2–3 tháng gồm những gì?","học nghề khai thác mỏ 2–3 tháng","Khóa học tập trung vào kỹ năng khai thác, an toàn, thực hành và kỷ luật lao động trước khi làm việc.","training",["Nhận biết môi trường khai thác hầm lò","Học quy trình làm việc theo tổ đội","Thực hành dụng cụ và thao tác nghề","Rèn kỹ năng nhận diện nguy cơ","Kiểm tra trước khi doanh nghiệp tiếp nhận"]],
  ["hoc-nghe-xay-dung-mo-2-3-thang","Học nghề xây dựng mỏ 2–3 tháng: công việc và kỹ năng","học nghề xây dựng mỏ","Người học được làm quen với công việc đào, chống giữ và duy trì đường lò theo thiết kế, quy trình an toàn.","training",["Đọc hướng dẫn và nhận lệnh sản xuất","Làm quen công tác đào và chống giữ","Hiểu vai trò của đường lò trong sản xuất","Thực hành phối hợp trong tổ đội","Luôn đặt an toàn trước tốc độ"]],
  ["hoc-co-dien-mo-10-thang","Học cơ điện mỏ 10 tháng: lộ trình cho người mới","học cơ điện mỏ 10 tháng","Cơ điện mỏ cần thời gian dài hơn để học kiến thức điện, cơ khí, thiết bị và quy trình an toàn.","training",["Kiến thức nền về điện và cơ khí","Nhận biết thiết bị dùng trong mỏ","Thực hành bảo dưỡng theo phân công","Học quy trình cô lập nguồn năng lượng","Rèn tác phong ghi chép và bàn giao"]],
  ["mien-hoc-phi-hoc-nghe-mo","Học nghề mỏ có mất học phí không?","học nghề mỏ miễn học phí","Người học theo chỉ tiêu được miễn kinh phí đào tạo; chế độ cụ thể cần xác nhận theo đợt tiếp nhận.","training",["Miễn học phí áp dụng theo chỉ tiêu","Không đồng nghĩa mọi chi phí cá nhân đều được miễn","Cần hỏi rõ khoản ăn ở và hỗ trợ","Không nộp tiền cho người không được xác minh","Giữ lại thông báo hoặc nội dung tư vấn"]],
  ["ky-tuc-xa-va-an-o-khi-hoc-nghe-mo","Ký túc xá và ăn ở khi học nghề mỏ tại Quảng Ninh","ký túc xá học nghề mỏ","Người học được bố trí ăn và ở theo kế hoạch của khóa; cần tuân thủ nội quy sinh hoạt tập thể.","training",["Xác nhận khu ký túc xá trước ngày đi","Hỏi rõ vật dụng được phép mang","Giữ vệ sinh và giờ giấc chung","Bảo quản giấy tờ, tài sản cá nhân","Chủ động báo quản lý khi có vấn đề sức khỏe"]],
  ["hoc-thuc-hanh-nghe-mo-ham-lo","Học thực hành nghề mỏ hầm lò có gì khác lý thuyết?","học thực hành nghề mỏ hầm lò","Thực hành giúp người học chuyển kiến thức thành thao tác, phối hợp tổ đội và phản xạ an toàn.","training",["Thao tác phải đúng thứ tự","Mỗi bài thực hành có người hướng dẫn","Không tự ý đổi dụng cụ hoặc vị trí","Phải hiểu tín hiệu và cách liên lạc","Sai sót cần báo ngay để được sửa"]],
  ["dao-tao-an-toan-truoc-khi-vao-lo","Đào tạo an toàn trước khi vào hầm lò","đào tạo an toàn hầm lò","An toàn là nội dung bắt buộc trước khi người học tiếp cận môi trường sản xuất thực tế.","training",["Nhận diện nguy cơ tại nơi làm việc","Cách sử dụng trang bị bảo vệ cá nhân","Tuyến đi lại và tín hiệu trong mỏ","Xử lý khi phát hiện điều kiện bất thường","Kỷ luật báo cáo và chấp hành lệnh"]],
  ["lo-trinh-hoc-nghe-mo-den-nhan-viec","Lộ trình học nghề mỏ đến khi được nhận việc","lộ trình học nghề mỏ","Từ kiểm tra điều kiện đến học, đánh giá và doanh nghiệp tiếp nhận là một chuỗi bước cần hoàn thành đầy đủ.","training",["Sàng lọc thông tin ban đầu","Kiểm tra và hoàn thiện thủ tục","Học nghề theo chương trình","Đánh giá kiến thức, kỹ năng và kỷ luật","Tiếp nhận theo yêu cầu của doanh nghiệp"]],
  ["hoc-xong-nghe-mo-lam-viec-o-dau","Học xong nghề mỏ làm việc ở đâu tại Quảng Ninh?","học nghề mỏ làm việc ở đâu","Người đạt yêu cầu được bố trí về doanh nghiệp ngành Than theo chỉ tiêu, nhu cầu và kết quả đào tạo.","training",["Địa điểm làm việc không nên tự suy đoán","Phân công phụ thuộc nghề được đào tạo","Doanh nghiệp tiếp nhận có nội quy riêng","Cần nghe hướng dẫn về nơi ở và đi lại","Đọc kỹ hợp đồng trước khi ký"]],
  ["chon-nghe-khai-thac-xay-dung-hay-co-dien-mo","Nên chọn khai thác mỏ, xây dựng mỏ hay cơ điện mỏ?","nên chọn nghề mỏ nào","Lựa chọn nên dựa vào sức khỏe, sở thích kỹ thuật, thời gian học và công việc mong muốn.","training",["Khai thác phù hợp người muốn vào nghề nhanh","Xây dựng mỏ cần sức bền và phối hợp tốt","Cơ điện hợp người thích thiết bị kỹ thuật","Thời gian học cơ điện dài hơn","Nên nghe tư vấn sau khi kiểm tra điều kiện"]],

  ["tho-khai-thac-mo-lam-cong-viec-gi","Thợ khai thác mỏ làm công việc gì trong hầm lò?","thợ khai thác mỏ làm gì","Công việc gắn với khai thác than, vận hành theo quy trình và phối hợp chặt chẽ trong tổ sản xuất.","work",["Nhận lệnh và kiểm tra vị trí trước ca","Thực hiện công đoạn được phân công","Phối hợp với đồng đội và thiết bị","Giữ thông tin liên lạc trong ca","Bàn giao rõ tình trạng cuối ca"]],
  ["tho-xay-dung-mo-lam-gi","Thợ xây dựng mỏ làm gì? Vai trò của đường lò","thợ xây dựng mỏ làm gì","Thợ xây dựng mỏ tham gia tạo lập, chống giữ và duy trì hệ thống đường lò phục vụ khai thác an toàn.","work",["Thi công theo hộ chiếu và hướng dẫn kỹ thuật","Kiểm tra vật liệu, dụng cụ trước làm việc","Phối hợp đào và chống giữ","Duy trì lối đi, không gian sản xuất","Báo ngay dấu hiệu địa chất bất thường"]],
  ["cong-viec-co-dien-mo","Công việc cơ điện mỏ: thiết bị, bảo dưỡng và an toàn","công việc cơ điện mỏ","Người làm cơ điện góp phần duy trì thiết bị, nguồn điện và hệ thống phục vụ sản xuất hoạt động ổn định.","work",["Kiểm tra thiết bị theo lịch","Thực hiện bảo dưỡng đúng phân công","Ghi nhận thông số và tình trạng","Cô lập nguồn trước khi can thiệp","Bàn giao rõ lỗi và biện pháp xử lý"]],
  ["ca-lam-viec-cua-tho-lo","Ca làm việc của thợ lò được tổ chức như thế nào?","ca làm việc của thợ lò","Mỗi ca gồm chuẩn bị, di chuyển, nhận vị trí, sản xuất và bàn giao; thời gian cụ thể theo đơn vị.","work",["Có mặt đúng giờ để nhận lệnh","Kiểm tra sức khỏe và bảo hộ cá nhân","Di chuyển theo tuyến quy định","Giữ nhịp làm việc của tổ đội","Bàn giao thông tin trước khi kết thúc"]],
  ["luong-tho-lo-20-25-trieu-moi-thang","Lương thợ lò 20–25 triệu/tháng được hiểu thế nào?","lương thợ lò 20–25 triệu","Đây là mức tham khảo phổ biến; thực nhận thay đổi theo doanh nghiệp, vị trí, ngày công và năng suất.","work",["Không phải mức cố định cho mọi tháng","Người mới có thể cần thời gian làm quen","Ngày công ảnh hưởng trực tiếp thu nhập","Năng suất và chất lượng công việc được tính","Phụ cấp và khấu trừ cần xem riêng"]],
  ["cach-tinh-luong-tho-lo-theo-ngay-cong-nang-suat","Cách tính lương thợ lò theo ngày công và năng suất","cách tính lương thợ lò","Muốn đọc đúng bảng lương cần đối chiếu đơn giá, ngày công, sản lượng, phụ cấp và các khoản khấu trừ.","work",["Kiểm tra số ngày công thực tế","Đối chiếu vị trí và đơn giá công việc","Xem mức hoàn thành năng suất","Tách phụ cấp khỏi tiền lương chính","Đọc rõ bảo hiểm và khoản khấu trừ"]],
  ["phu-cap-va-che-do-tho-lo","Phụ cấp và chế độ thợ lò cần hỏi những gì?","phụ cấp thợ lò","Ngoài lương, người lao động nên hỏi rõ ăn ca, bảo hộ, đi lại, chỗ ở và các khoản theo điều kiện làm việc.","work",["Tên và điều kiện hưởng từng phụ cấp","Thời điểm chi trả","Chế độ ăn ca tại đúng đơn vị","Cấp phát và thay thế bảo hộ","Hỗ trợ chỗ ở hoặc xe đưa đón nếu có"]],
  ["bao-hiem-cho-cong-nhan-nganh-than","Bảo hiểm cho công nhân ngành Than: điều cần biết","bảo hiểm công nhân ngành Than","Khi ký hợp đồng, người lao động cần đọc nội dung về bảo hiểm, quyền lợi và trách nhiệm của hai bên.","work",["Kiểm tra loại hợp đồng lao động","Đối chiếu mức đóng trên bảng lương","Giữ mã số và thông tin bảo hiểm","Biết nơi hỏi khi dữ liệu chưa khớp","Không ký khi chưa hiểu điều khoản chính"]],
  ["lam-sao-tang-thu-nhap-tho-lo","Làm sao để tăng thu nhập thợ lò bền vững?","tăng thu nhập thợ lò","Thu nhập bền vững đến từ ngày công ổn định, tay nghề, năng suất và kỷ luật an toàn, không phải làm nhanh bằng mọi giá.","work",["Giữ sức khỏe và đi làm đều","Nâng kỹ năng đúng vị trí","Học cách phối hợp tổ đội","Giảm lỗi phải làm lại","Tuyệt đối không đánh đổi an toàn lấy sản lượng"]],
  ["nghe-tho-lo-co-on-dinh-khong","Nghề thợ lò có ổn định không? Cách tự đánh giá","nghề thợ lò có ổn định không","Sự ổn định phụ thuộc nhu cầu sản xuất, hợp đồng, sức khỏe, kỷ luật và khả năng gắn bó của mỗi người.","work",["Ngành Than có nhu cầu lao động kỹ thuật","Công việc đòi hỏi sức khỏe lâu dài","Kỷ luật ảnh hưởng cơ hội làm việc","Thu nhập biến động theo ngày công và năng suất","Gia đình cần hiểu đặc thù đi làm xa"]],

  ["nha-o-ky-tuc-xa-cong-nhan-mo","Nhà ở, ký túc xá cho công nhân mỏ tại Quảng Ninh","nhà ở công nhân mỏ Quảng Ninh","Chỗ ở ổn định giúp lao động xa quê giảm áp lực chi phí và duy trì sức khỏe khi làm việc theo ca.","welfare",["Hỏi rõ loại hình nhà ở được bố trí","Tìm hiểu chi phí điện nước và dịch vụ","Kiểm tra khoảng cách đến điểm đón xe","Tuân thủ nội quy khu ở tập thể","Giữ liên lạc và kế hoạch về thăm gia đình"]],
  ["bua-an-ca-va-dinh-duong-tho-mo","Bữa ăn ca và dinh dưỡng cho thợ mỏ","bữa ăn ca thợ mỏ","Công việc nặng nhọc cần bữa ăn đủ năng lượng, nước uống và thói quen phục hồi sau ca.","welfare",["Ăn đủ trước ca nhưng tránh quá no","Bổ sung nước theo hướng dẫn","Không bỏ bữa sau ca","Theo dõi dấu hiệu mệt bất thường","Hỏi chế độ ăn ca tại đơn vị tiếp nhận"]],
  ["kham-suc-khoe-dinh-ky-tho-mo","Khám sức khỏe định kỳ cho thợ mỏ có ý nghĩa gì?","khám sức khỏe định kỳ thợ mỏ","Khám định kỳ giúp theo dõi ảnh hưởng nghề nghiệp, phát hiện sớm vấn đề và điều chỉnh công việc khi cần.","welfare",["Tham gia đúng lịch khám","Khai thật triệu chứng đang gặp","Giữ kết quả để theo dõi qua các năm","Tuân thủ hướng dẫn điều trị","Báo quản lý nếu sức khỏe ảnh hưởng an toàn"]],
  ["xe-dua-don-cong-nhan-mo","Xe đưa đón công nhân mỏ: điều cần xác nhận","xe đưa đón công nhân mỏ","Xe đưa đón giúp kết nối khu ở với nơi làm việc; giờ và tuyến phụ thuộc từng doanh nghiệp.","welfare",["Biết đúng điểm đón gần nơi ở","Có mặt sớm hơn giờ quy định","Không tự đổi tuyến khi chưa báo","Giữ an toàn khi lên xuống xe","Chuẩn bị phương án khi lỡ chuyến"]],
  ["bao-ho-lao-dong-tho-lo","Bảo hộ lao động thợ lò gồm gì và dùng ra sao?","bảo hộ lao động thợ lò","Trang bị chỉ bảo vệ tốt khi đúng loại, vừa kích cỡ, được kiểm tra và sử dụng trong suốt thời gian yêu cầu.","technology",["Kiểm tra mũ, đèn và trang bị trước ca","Mặc đúng quần áo bảo hộ","Không dùng đồ hư hỏng","Báo để thay thế khi thiết bị có lỗi","Không tự tháo bỏ vì nóng hoặc vướng"]],
  ["thong-gio-ham-lo-va-an-toan","Thông gió hầm lò và vai trò đối với an toàn thợ mỏ","thông gió hầm lò","Thông gió giúp kiểm soát không khí, nhiệt và khí mỏ; người lao động phải tuân thủ tuyến và cảnh báo kỹ thuật.","technology",["Không che chắn hoặc thay đổi luồng gió","Chú ý biển báo và thiết bị đo","Báo khi có mùi hoặc cảm giác bất thường","Không vào khu vực bị hạn chế","Tuân thủ hướng dẫn khi hệ thống thay đổi"]],
  ["co-gioi-hoa-khai-thac-ham-lo","Cơ giới hóa khai thác hầm lò thay đổi công việc ra sao?","cơ giới hóa khai thác hầm lò","Thiết bị giúp giảm sức lao động ở nhiều công đoạn, nâng năng suất và yêu cầu người thợ hiểu quy trình vận hành.","technology",["Máy móc thay đổi cách tổ chức tổ đội","Người thợ cần kỹ năng thiết bị cao hơn","Bảo dưỡng ảnh hưởng độ ổn định sản xuất","Vùng nguy hiểm phải được nhận diện rõ","Dữ liệu vận hành hỗ trợ quyết định"]],
  ["tu-dong-hoa-trong-nganh-than","Tự động hóa trong ngành Than và kỹ năng người lao động","tự động hóa ngành Than","Tự động hóa hỗ trợ giám sát và điều khiển, đồng thời làm tăng nhu cầu về kỹ năng kỹ thuật và xử lý thông tin.","technology",["Hiểu tín hiệu và giao diện điều khiển","Không bỏ qua cảnh báo tự động","Ghi nhận bất thường để bảo trì","Phân quyền vận hành phải rõ ràng","Con người vẫn chịu trách nhiệm kiểm tra"]],
  ["chuyen-doi-so-trong-mo-ham-lo","Chuyển đổi số trong mỏ hầm lò: người thợ được lợi gì?","chuyển đổi số mỏ hầm lò","Dữ liệu sản xuất, thiết bị và an toàn được kết nối tốt hơn giúp doanh nghiệp phản ứng nhanh và tổ chức công việc chính xác.","technology",["Số hóa lệnh và nhật ký công việc","Theo dõi thiết bị theo thời gian","Cảnh báo hỗ trợ phòng ngừa rủi ro","Dữ liệu giúp phân tích năng suất","Người dùng phải nhập thông tin chính xác"]],
  ["van-tai-ham-lo-hien-dai","Vận tải hầm lò hiện đại giúp giảm sức lao động thế nào?","vận tải hầm lò hiện đại","Hệ thống vận tải người, vật tư và than là mắt xích quan trọng để giảm thời gian di chuyển và công việc thủ công.","technology",["Mỗi tuyến có mục đích và quy tắc riêng","Không đứng trong vùng chuyển động thiết bị","Tuân thủ tín hiệu vận tải","Giữ lối đi và điểm dừng thông thoáng","Báo ngay tiếng động hoặc rung bất thường"]],

  ["viec-lam-tho-mo-thanh-hoa","Việc làm thợ mỏ cho lao động Thanh Hóa tại Quảng Ninh","việc làm thợ mỏ Thanh Hóa","Lao động Thanh Hóa có thể kiểm tra điều kiện từ xa, chuẩn bị hồ sơ và kế hoạch di chuyển trước khi nhập học.","province",["Gửi thông tin trước để tránh đi lại nhiều lần","Trao đổi với gia đình về thời gian học","Chọn tuyến di chuyển phù hợp đến Quảng Ninh","Mang giấy tờ gốc theo hướng dẫn","Giữ số liên hệ phụ trách trong suốt hành trình"]],
  ["viec-lam-tho-mo-nghe-an","Việc làm thợ mỏ cho lao động Nghệ An: lộ trình đăng ký","việc làm thợ mỏ Nghệ An","Người lao động Nghệ An nên hoàn thành sàng lọc sức khỏe và xác nhận lịch trước khi ra Quảng Ninh.","province",["Kiểm tra tuổi, thể lực và sức khỏe","Hỏi rõ nghề cùng thời gian học","Chuẩn bị phương án xe đường dài","Chụp lưu giấy tờ trên điện thoại","Chỉ đi khi có địa điểm tiếp nhận rõ"]],
  ["viec-lam-tho-mo-ha-tinh","Việc làm thợ mỏ cho lao động Hà Tĩnh cần chuẩn bị gì?","việc làm thợ mỏ Hà Tĩnh","Kế hoạch tốt giúp người Hà Tĩnh chủ động chi phí đi lại, hồ sơ và thời gian xa gia đình.","province",["Gửi ba thông tin sàng lọc","Xác minh lịch và người phụ trách","Chuẩn bị đồ dùng vừa đủ","Trao đổi với gia đình về nơi ở","Dự trù chi phí cá nhân ban đầu"]],
  ["viec-lam-tho-mo-quang-tri","Việc làm thợ mỏ cho lao động Quảng Trị tại Quảng Ninh","việc làm thợ mỏ Quảng Trị","Từ Quảng Trị ra Quảng Ninh là hành trình dài, vì vậy mọi thông tin tuyển sinh cần được xác nhận trước.","province",["Không mua vé trước khi chốt lịch","Kiểm tra giấy tờ gốc","Chủ động theo dõi thời tiết hành trình","Lưu địa chỉ trên bản đồ","Báo gia đình khi đến từng chặng"]],
  ["viec-lam-tho-mo-quang-ngai","Việc làm thợ mỏ cho lao động Quảng Ngãi: điều kiện và hồ sơ","việc làm thợ mỏ Quảng Ngãi","Người lao động Quảng Ngãi có thể đăng ký từ xa nếu cung cấp đủ thông tin và đáp ứng tiêu chí sức khỏe.","province",["Ưu tiên sàng lọc trước qua điện thoại","Hỏi rõ ngày nhập học","Tính thời gian di chuyển dài","Giữ giấy tờ trong hành lý xách tay","Không nghe môi giới không xác minh"]],
  ["viec-lam-tho-mo-gia-lai","Việc làm thợ mỏ cho lao động Gia Lai: câu chuyện đi xa lập nghiệp","việc làm thợ mỏ Gia Lai","Nhiều lao động Tây Nguyên quan tâm nghề mỏ vì thu nhập và lộ trình đào tạo rõ; quyết định cần đi cùng chuẩn bị sức khỏe.","province",["Đánh giá khả năng thích nghi khí hậu","Trao đổi kỹ về công việc hầm lò","Chuẩn bị hành trình hơn một nghìn kilômét","Lập kế hoạch tài chính giai đoạn đầu","Giữ mục tiêu học nghề và kỷ luật"]],
  ["viec-lam-tho-mo-dak-lak","Việc làm thợ mỏ cho lao động Đắk Lắk tại Quảng Ninh","việc làm thợ mỏ Đắk Lắk","Lao động Đắk Lắk nên tìm hiểu kỹ môi trường làm việc, thời gian học và phương án đi xa trước khi đăng ký.","province",["Kiểm tra sức khỏe trước hành trình","Chọn nghề phù hợp thể lực","Xác nhận chế độ ăn ở","Chuẩn bị quần áo phù hợp miền Bắc","Duy trì liên lạc với gia đình"]],
  ["viec-lam-tho-mo-son-la","Việc làm thợ mỏ cho lao động Sơn La: đăng ký từ xa","việc làm thợ mỏ Sơn La","Người Sơn La có thể gửi thông tin sàng lọc trước, sau đó nhận hướng dẫn hồ sơ và lịch cụ thể.","province",["Đo đúng chiều cao cân nặng","Nêu rõ bệnh đang điều trị","Xác nhận tuyến di chuyển","Mang giấy tờ gốc an toàn","Không giao hồ sơ cho người lạ"]],
  ["viec-lam-tho-mo-dien-bien","Việc làm thợ mỏ cho lao động Điện Biên: chuẩn bị hành trình","việc làm thợ mỏ Điện Biên","Khoảng cách xa đòi hỏi người Điện Biên phải kiểm tra điều kiện và lập kế hoạch di chuyển kỹ hơn.","province",["Không đi nếu chưa qua sàng lọc","Tính thời gian nối chuyến","Chuẩn bị thuốc cá nhân có hướng dẫn","Lưu thông tin nơi tiếp nhận","Chủ động báo nếu hành trình thay đổi"]],
  ["viec-lam-tho-mo-lao-cai","Việc làm thợ mỏ cho lao động Lào Cai tại Quảng Ninh","việc làm thợ mỏ Lào Cai","Người lao động Lào Cai nên đối chiếu điều kiện sức khỏe, chọn nghề và xác nhận lịch trước khi khởi hành.","province",["Tìm hiểu khai thác, xây dựng và cơ điện mỏ","Gửi thông tin sàng lọc trung thực","Chốt điểm đón và nơi ở","Chuẩn bị hồ sơ gọn, đúng yêu cầu","Giữ số tư vấn để xử lý tình huống"]],
].map(([slug,title,keyword,lead,cluster,points], index) => ({
  slug,title,keyword,lead,cluster,points,position:index,
  image: imageSources[slug]?.source_url,
}));

if (topics.length !== 50) throw new Error(`Expected 50 topics, got ${topics.length}`);
if (topics.some(topic => !topic.image?.startsWith("https://vinacomin.vn/Share/Media/"))) {
  throw new Error("Every article must use a unique image from the Vinacomin image library");
}
if (new Set(topics.map(topic => topic.image)).size !== topics.length) {
  throw new Error("Vinacomin article images must not be reused between articles");
}

const latestNews = {
  title: "Tái cơ cấu TKV 2026: việc làm thợ mỏ thay đổi thế nào?",
  lead: "Định hướng mới đặt an toàn, đời sống, tuyển dụng–đào tạo thợ lò và cơ giới hóa vào cùng một bài toán.",
  href: "2026/07/31/tai-co-cau-tkv-2026-viec-lam-tho-mo/",
  image: imageSources["tai-co-cau-tkv-2026-viec-lam-tho-mo"]?.source_url,
};
if (!latestNews.image?.startsWith("https://vinacomin.vn/Share/Media/") || topics.some(topic => topic.image === latestNews.image)) {
  throw new Error("The latest news image must be a unique Vinacomin image library asset");
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function description(topic) {
  const cleanTitle = topic.title.replace(/[?.!]+$/,"");
  const text = `${cleanTitle}. ${topic.lead} Hướng dẫn rõ điều kiện, quy trình và lưu ý thực tế từ Thầy Linh.`;
  return text.length > 158 ? `${text.slice(0,155).replace(/\s+\S*$/,"")}…` : text;
}

function secondaryKeywords(topic) {
  const label = clusterInfo[topic.cluster].label.toLowerCase();
  return [...new Set([topic.keyword, "tuyển thợ mỏ Quảng Ninh", "học nghề mỏ", label, "Thầy Linh tuyển thợ mỏ"])];
}

function pointExpansion(point, index, topic) {
  const endings = [
    `Đây là bước nền tảng khi tìm hiểu ${topic.keyword}; thông tin càng rõ thì tư vấn càng sát hoàn cảnh thực tế.`,
    "Người đăng ký nên hỏi lại ngay nếu cách áp dụng chưa rõ, thay vì tự suy đoán từ trường hợp của người khác.",
    "Khi có thay đổi về sức khỏe, lịch hoặc giấy tờ, cần báo sớm để được điều chỉnh hướng dẫn.",
    "Nên lưu nội dung xác nhận quan trọng trên điện thoại để đối chiếu trong ngày di chuyển và làm thủ tục.",
    "Mỗi doanh nghiệp hoặc đợt tiếp nhận có thể có chi tiết khác nhau; thông báo hiện hành luôn là căn cứ trực tiếp.",
  ];
  const deepenings = [
    `Khi tự đánh giá chủ đề “${topic.keyword}”, nên ghi riêng nội dung này vào danh sách cần xác nhận và chỉ đánh dấu hoàn thành khi đã có câu trả lời rõ.`,
    `Điểm này liên quan trực tiếp đến quyết định về ${topic.keyword}; một thông tin chưa chắc chắn có thể làm thay đổi lịch đi, giấy tờ hoặc lựa chọn nghề.`,
    `Gia đình cũng nên biết nội dung “${point.toLowerCase()}” để cùng tính thời gian, chi phí và khả năng thích nghi trong giai đoạn đầu.`,
    `Nếu thông tin thực tế khác với dự kiến, hãy dừng lại để cập nhật kế hoạch về ${topic.keyword}, tránh xử lý vội trong ngày nhập học hoặc nhận việc.`,
    `Có thể dùng chính nội dung “${point.toLowerCase()}” làm câu hỏi khi trao đổi; câu trả lời nên nêu rõ người phụ trách, thời điểm và cách áp dụng.`,
    `Với người đi xa, ${point.toLowerCase()} cần được xác nhận trước khi mua vé; việc này giảm nguy cơ phải quay về vì thiếu điều kiện hoặc sai lịch.`,
    `Nội dung này nên được đối chiếu cùng sức khỏe, hoàn cảnh gia đình và mục tiêu thu nhập, vì ${topic.keyword} không thể tách khỏi ba yếu tố đó.`,
    `Hãy phân biệt thông tin tham khảo với yêu cầu bắt buộc: “${point}” chỉ có giá trị thực tế khi được đặt trong đúng nghề và đúng đợt tuyển.`,
    `Một cách kiểm tra tốt là nhắc lại “${point.toLowerCase()}” bằng lời của mình rồi đề nghị người tư vấn xác nhận; cách này hạn chế hiểu sai.`,
    `Sau khi làm rõ điểm này, người đăng ký nên lưu câu trả lời cạnh hồ sơ về ${topic.keyword} để có thể đối chiếu khi chuyển sang bước tiếp theo.`,
  ];
  return `${point}. ${deepenings[(topic.position + index) % deepenings.length]} ${endings[index % endings.length]}`;
}

function uniqueApplication(topic) {
  const [a,b,c,d,e] = topic.points;
  const variants = [
    [`Từ nội dung “${a.toLowerCase()}”, hãy bắt đầu bằng một lần tự kiểm tra trung thực. Sau đó đối chiếu “${b.toLowerCase()}” với hướng dẫn đang áp dụng, không lấy trải nghiệm cũ của người khác làm tiêu chuẩn cho mình.`, `Hai điểm tiếp theo là “${c.toLowerCase()}” và “${d.toLowerCase()}”. Đây thường là nơi phát sinh hiểu nhầm nếu chỉ nghe tóm tắt. Hãy hỏi rõ bằng tin nhắn để có nội dung đối chiếu.`, `Cuối cùng, “${e.toLowerCase()}” là bước nối thông tin với hành động. Chỉ khi bước này đã rõ, kế hoạch về ${topic.keyword} mới đủ cơ sở để triển khai.`],
    [`Người đang quan tâm ${topic.keyword} có thể chia việc chuẩn bị thành ba nhóm. Nhóm cá nhân gồm “${a.toLowerCase()}” và “${b.toLowerCase()}”; nhóm thủ tục tập trung vào “${c.toLowerCase()}”.`, `Nhóm thực tế cần xem “${d.toLowerCase()}” có phù hợp lịch sinh hoạt, sức khỏe và trách nhiệm gia đình hay không. Đây là phần nên trao đổi trước với người thân.`, `“${e}” là điểm kiểm tra cuối. Nếu chưa chắc chắn, hãy tạm dừng khâu mua vé hoặc sắp xếp công việc cũ để nhận xác nhận mới.`],
    [`Một kế hoạch tốt cho ${topic.keyword} nên có mốc thời gian. Ngày đầu kiểm tra “${a.toLowerCase()}”; ngày tiếp theo hoàn thiện “${b.toLowerCase()}” và ghi câu hỏi về “${c.toLowerCase()}”.`, `Trước khi chốt lịch, cần làm rõ “${d.toLowerCase()}”. Nếu câu trả lời còn chung chung, hãy hỏi áp dụng ở đơn vị nào và vào thời điểm nào.`, `Khi “${e.toLowerCase()}” đã được xác nhận, người đăng ký mới chuyển sang chuẩn bị hành lý, giấy tờ và phương án liên lạc với gia đình.`],
    [`Đừng xem ${topic.keyword} là một quyết định chỉ dựa trên thu nhập. “${a}” cho biết điều kiện bắt đầu; “${b}” phản ánh khả năng đáp ứng thực tế.`, `“${c}” và “${d.toLowerCase()}” giúp kiểm tra mức độ phù hợp lâu dài. Nếu hai điểm này chưa ổn, nên xử lý trước thay vì hy vọng sẽ tự thích nghi sau.`, `Bước “${e.toLowerCase()}” giúp khóa lại kế hoạch. Một quyết định chậm hơn nhưng đủ dữ kiện thường an toàn và bền vững hơn.`],
    [`Hãy tạo một ghi chú mang tên “${topic.keyword}” trên điện thoại. Dòng đầu ghi “${a}”, dòng thứ hai ghi “${b}” và gắn kèm câu trả lời đã nhận.`, `Tiếp tục với “${c.toLowerCase()}” và “${d.toLowerCase()}”. Những nội dung có ngày giờ, địa điểm hoặc điều kiện nên được ghi nguyên văn để tránh nhớ nhầm.`, `Dòng cuối là “${e}”. Khi năm dòng đều có thông tin, người lao động và gia đình sẽ dễ đánh giá phương án hơn.`],
    [`Với ${topic.keyword}, nên phân biệt “có thể” và “đủ điều kiện”. “${a}” có thể là tín hiệu ban đầu, nhưng “${b.toLowerCase()}” mới giúp làm rõ khả năng áp dụng.`, `Tương tự, “${c.toLowerCase()}” cần được đặt cạnh “${d.toLowerCase()}”. Hai nội dung này bổ sung cho nhau và không nên tách rời khi hỏi tư vấn.`, `“${e}” là căn cứ để chuyển từ tìm hiểu sang hành động. Trước mốc này, mọi kế hoạch di chuyển chỉ nên ở trạng thái dự kiến.`],
    [`Bài toán ${topic.keyword} sẽ dễ xử lý hơn nếu trả lời lần lượt năm câu hỏi: “${a.toLowerCase()}” đã rõ chưa; “${b.toLowerCase()}” có bằng chứng nào; “${c.toLowerCase()}” áp dụng cho ai?`, `Hai câu hỏi còn lại là “${d.toLowerCase()}” thay đổi kế hoạch thế nào và “${e.toLowerCase()}” cần hoàn thành trước ngày nào. Không câu hỏi nào nên được bỏ qua.`, `Cách đặt câu hỏi theo thứ tự giúp buổi tư vấn ngắn hơn, đồng thời tránh việc phải bổ sung thông tin nhiều lần.`],
    [`Khi so sánh các lựa chọn liên quan đến ${topic.keyword}, hãy dùng cùng một bộ tiêu chí. Lựa chọn nào làm rõ “${a.toLowerCase()}” và “${b.toLowerCase()}” tốt hơn sẽ đáng tin cậy hơn.`, `Sau đó so sánh “${c.toLowerCase()}” và “${d.toLowerCase()}”, nhất là các điểm ảnh hưởng chi phí, sức khỏe hoặc lịch gia đình.`, `Chỉ chốt phương án khi “${e.toLowerCase()}” có câu trả lời cụ thể. Không nên chọn theo lời giới thiệu hấp dẫn nhưng thiếu chi tiết.`],
    [`${topic.keyword} cần được nhìn theo cả ngắn hạn và dài hạn. Ngắn hạn là “${a.toLowerCase()}” cùng “${b.toLowerCase()}”; dài hạn là khả năng duy trì “${c.toLowerCase()}”.`, `“${d}” cho thấy những gì phải theo dõi khi kế hoạch bắt đầu vận hành. Nếu có khó khăn, người lao động cần biết kênh báo sớm.`, `“${e}” là điểm nối giữa hai giai đoạn. Chuẩn bị kỹ tại đây giúp giảm thay đổi đột ngột sau khi đã đi xa.`],
    [`Trước khi quyết định về ${topic.keyword}, hãy thử giải thích kế hoạch cho một người thân bằng năm ý trong bài. Nếu chưa thể nói rõ “${a.toLowerCase()}” hoặc “${b.toLowerCase()}”, nghĩa là dữ liệu còn thiếu.`, `Tiếp tục kiểm tra “${c.toLowerCase()}” và “${d.toLowerCase()}”. Người thân thường phát hiện thêm vấn đề về chi phí, sức khỏe và trách nhiệm gia đình.`, `Khi cả hai bên đều hiểu “${e.toLowerCase()}”, quyết định sẽ có sự đồng thuận và người đi học, đi làm cũng yên tâm hơn.`],
  ];
  const chosen = variants[topic.position % variants.length];
  return `<h2>Áp dụng vào trường hợp của bạn</h2>${chosen.map(p=>`<p>${esc(p)}</p>`).join("")}`;
}

function faq(topic) {
  const info = clusterInfo[topic.cluster];
  return [
    [`${topic.title.replace(/[?:].*$/,"")} có áp dụng giống nhau cho mọi đợt không?`, `Không nên mặc định giống nhau. Tiêu chí và lịch cụ thể cần được xác nhận theo đợt tuyển, nghề và doanh nghiệp dự kiến tiếp nhận.`],
    [`Cần làm gì trước tiên khi tìm hiểu ${topic.keyword}?`, `Hãy gửi năm sinh, chiều cao/cân nặng và tình trạng sức khỏe hiện tại để được kiểm tra điều kiện ban đầu trước khi chuẩn bị đi xa.`],
    ["Có nên chỉ dựa vào thông tin trên mạng để quyết định không?", `Không. Bài viết giúp hiểu vấn đề, nhưng người đăng ký vẫn cần xác nhận lịch, hồ sơ và điều kiện trực tiếp. ${info.steps[0]}.`],
  ];
}

function articleHtml(topic, index) {
  const info = clusterInfo[topic.cluster];
  const url = `${base}/bai-viet/${topic.slug}/`;
  const imageUrl = topic.image;
  const keywords = secondaryKeywords(topic);
  const faqs = faq(topic);
  const related = info.related.filter(slug => slug !== topic.slug).slice(0,2);
  const imageSource = imageSources[topic.slug];
  const sourceName = imageSource
    ? `${imageSource.provider} · ${imageSource.album_title}`
    : "Thư viện ảnh Vinacomin";
  const paragraphs = topic.points.map((p,i) => `<li><strong>${esc(p)}</strong><span>${esc(pointExpansion(p,i,topic))}</span></li>`).join("");
  const steps = info.steps.map((s,i) => `<li><time>${String(i+1).padStart(2,"0")}</time><div><strong>${esc(s)}</strong><span>${esc(topic.points[i] || topic.points[0])}.</span></div></li>`).join("");
  const warning = info.warnings.map(x => `<li>${esc(x)}</li>`).join("");
  const faqHtml = faqs.map(([q,a]) => `<section class="faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></section>`).join("");
  const faqJson = faqs.map(([q,a]) => ({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}));
  const relatedLinks = related.map((slug,i) => {
    const target = topics.find(t => t.slug === slug);
    return target ? `<a href="../${target.slug}/"><small>${i ? "Đọc tiếp" : "Bài liên quan"}</small>${esc(target.title)} →</a>` : "";
  }).join("");
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#063c46">
  <title>${esc(topic.title)} | Thầy Linh</title>
  <meta name="description" content="${esc(description(topic))}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="author" content="Nguyễn Tử Linh">
  <meta name="keywords" content="${esc(keywords.join(", "))}">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="../../assets/favicon.svg?v=2" type="image/svg+xml">
  <link rel="manifest" href="../../manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Bài viết Thầy Linh – Tuyển Thợ Mỏ" href="${base}/feed.xml">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ">
  <meta property="og:title" content="${esc(topic.title)}">
  <meta property="og:description" content="${esc(topic.lead)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:alt" content="${esc(topic.keyword)}">
  <meta property="article:published_time" content="${published}">
  <meta property="article:modified_time" content="${published}">
  <meta property="article:author" content="Nguyễn Tử Linh">
  <meta property="article:section" content="${esc(info.label)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../article-insights.css?v=6">
  <script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org",
    "@graph":[
      {"@type":"Article","@id":`${url}#article`,"headline":topic.title,"description":description(topic),"datePublished":published,"dateModified":published,"inLanguage":"vi-VN","mainEntityOfPage":{"@id":`${url}#webpage`},"image":[imageUrl],"author":{"@type":"Person","name":"Nguyễn Tử Linh","alternateName":"Thầy Linh – Tuyển Thợ Mỏ","url":`${base}/#gioi-thieu`},"publisher":{"@type":"Organization","name":"Thầy Linh – Tuyển Thợ Mỏ","url":`${base}/`},"articleSection":info.label,"keywords":keywords},
      {"@type":"WebPage","@id":`${url}#webpage`,"url":url,"name":topic.title,"breadcrumb":{"@id":`${url}#breadcrumb`}},
      {"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,"itemListElement":[{"@type":"ListItem","position":1,"name":"Trang chủ","item":`${base}/`},{"@type":"ListItem","position":2,"name":"Cẩm nang nghề mỏ","item":`${base}/tin-nganh-than/`},{"@type":"ListItem","position":3,"name":topic.title,"item":url}]},
      {"@type":"FAQPage","mainEntity":faqJson}
    ]
  })}</script>
</head>
<body>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="../../"><span class="brand-mark">TL</span><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="../../tin-nganh-than/">← Cẩm nang nghề mỏ</a></div></header>
  <main>
    <section class="article-hero">
      <img src="${topic.image}" alt="${esc(topic.keyword)}" fetchpriority="high">
      <div class="container hero-inner">
        <nav class="breadcrumbs" aria-label="Đường dẫn"><a href="../../">Trang chủ</a><span>/</span><a href="../../tin-nganh-than/">Cẩm nang nghề mỏ</a><span>/</span><span>${esc(info.label)}</span></nav>
        <p class="eyebrow">${esc(info.label)} · Bài ${String(index+1).padStart(2,"0")}/50</p>
        <h1>${esc(topic.title)}</h1>
        <p class="lead">${esc(topic.lead)}</p>
      </div>
    </section>
    <div class="container article-layout">
      <article class="article-body">
        <p class="article-meta"><time datetime="${published}">Cập nhật ${dateLabel}</time> · Biên soạn: <a rel="author" href="../../#gioi-thieu">Nguyễn Tử Linh</a> · Ảnh: ${sourceName}</p>
        <p><strong>${esc(topic.keyword)}</strong> là nội dung được nhiều người lao động và gia đình tìm hiểu trước khi quyết định học nghề, đi làm xa hoặc lựa chọn một hướng nghề nghiệp mới. Bài viết này tập trung vào thông tin có thể dùng ngay: điều cần kiểm tra, cách chuẩn bị và những điểm không nên hiểu máy móc.</p>
        <h2>${esc(topic.keyword)}: hiểu đúng trước khi quyết định</h2>
        <p>${esc(info.intro)}</p>
        <p>${esc(info.practice)}</p>
        <h2>Năm điểm thực tế cần kiểm tra</h2>
        <ol class="insight-list">${paragraphs}</ol>
        <p>Khi năm điểm trên đã rõ, người lao động có thể so sánh công việc với sức khỏe, hoàn cảnh gia đình và kế hoạch thu nhập của mình. Quyết định vào nghề nên dựa trên thông tin đầy đủ, không chỉ dựa vào một video, một bảng lương hoặc trải nghiệm của một cá nhân.</p>
        ${uniqueApplication(topic)}
        <h2>Quy trình chuẩn bị theo từng bước</h2>
        <ol class="timeline">${steps}</ol>
        <p>Quy trình này giúp giảm rủi ro đi sai lịch, thiếu giấy tờ hoặc hiểu nhầm chế độ. Với người ở xa Quảng Ninh, việc xác nhận trước càng quan trọng vì chi phí và thời gian di chuyển lớn.</p>
        <h2>Những điều không nên làm</h2>
        <ul class="warning-list">${warning}</ul>
        <p>Nếu có điểm nào chưa rõ, nên hỏi lại bằng câu cụ thể: áp dụng cho nghề nào, tại đơn vị nào, trong đợt nào và cần giấy tờ gì để xác nhận. Câu hỏi càng cụ thể thì câu trả lời càng có giá trị thực tế.</p>
        <h2>Câu hỏi thường gặp</h2>
        <div class="faq-list">${faqHtml}</div>
        <h2>Kết luận</h2>
        <p>${esc(topic.title)} không nên được hiểu như một lời hứa chung cho tất cả mọi người. Cách an toàn nhất là kiểm tra điều kiện cá nhân, đối chiếu thông báo hiện hành và chuẩn bị đúng lộ trình. Thầy Linh có thể hỗ trợ sàng lọc ban đầu dựa trên năm sinh, chiều cao/cân nặng và tình trạng sức khỏe.</p>
        <nav class="article-nav" aria-label="Bài viết liên quan">${relatedLinks}</nav>
      </article>
      <aside class="article-aside">
        <div class="aside-card accent"><h2>Kiểm tra điều kiện</h2><p>Gửi năm sinh, chiều cao/cân nặng và sức khỏe hiện tại để được tư vấn bước đầu.</p><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Nộp hồ sơ qua Zalo</a></div>
        <div class="aside-card"><h2>Từ khóa bài viết</h2><ul>${keywords.slice(0,4).map(k=>`<li>${esc(k)}</li>`).join("")}</ul></div>
        <div class="aside-card"><h2>Nguồn hình ảnh</h2><p>${sourceName}. Ảnh được lưu tối ưu trên website để tải nhanh và có chú thích rõ.</p></div>
      </aside>
    </div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Tư vấn học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div><a href="../../tin-nganh-than/">Xem đủ 50 bài cẩm nang →</a></div></footer>
  <nav class="article-contact" aria-label="Liên hệ nhanh"><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Zalo · 096 304 8585</a><a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener">Messenger</a></nav>
</body>
</html>`;
}

function hubHtml() {
  const groups = Object.entries(clusterInfo).map(([key,info]) => {
    const cards = topics.filter(t => t.cluster === key).map(t => `<a class="news-card" href="../bai-viet/${t.slug}/" data-cluster="${key}"><img src="${t.image}" alt="${esc(t.keyword)}" loading="lazy" decoding="async"><div class="news-card__body"><small>${esc(info.label)}</small><h2>${esc(t.title)}</h2><p>${esc(t.lead)}</p><span>Đọc bài →</span></div></a>`).join("");
    return `<section class="library-section" id="${key}"><div class="library-heading"><p class="eyebrow">${esc(info.label)}</p><h2>${topics.filter(t=>t.cluster===key).length} bài nên đọc</h2></div><div class="news-grid">${cards}</div></section>`;
  }).join("");
  const itemList = topics.map((t,i) => ({"@type":"ListItem","position":i+1,"url":`${base}/bai-viet/${t.slug}/`,"name":t.title}));
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#063c46">
  <title>Tin ngành Than mới và 50 bài cẩm nang thợ mỏ</title>
  <meta name="description" content="Tin ngành Than mới cùng 50 bài về tuyển thợ lò, học nghề mỏ, thu nhập, an toàn, công nghệ và việc làm tại Quảng Ninh.">
  <meta name="robots" content="index,follow,max-image-preview:large"><meta name="author" content="Nguyễn Tử Linh">
  <link rel="canonical" href="${base}/tin-nganh-than/"><link rel="icon" href="../assets/favicon.svg?v=2" type="image/svg+xml"><link rel="manifest" href="../manifest.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Bài viết – Thầy Linh Tuyển Thợ Mỏ" href="${base}/feed.xml"><link rel="alternate" type="application/feed+json" title="Bài viết – Thầy Linh Tuyển Thợ Mỏ" href="${base}/feed.json">
  <meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="Tin ngành Than mới và 50 bài cẩm nang thợ mỏ"><meta property="og:description" content="Tin mới, điều kiện, học nghề, lương, phúc lợi, an toàn và công nghệ mỏ."><meta property="og:image" content="${latestNews.image}">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../article-insights.css?v=6">
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":"50 bài cẩm nang thợ mỏ và việc làm ngành Than","description":"Thư viện nội dung về tuyển thợ lò, học nghề mỏ, thu nhập, an toàn, công nghệ và việc làm theo tỉnh.","url":`${base}/tin-nganh-than/`,"inLanguage":"vi-VN","dateModified":published,"publisher":{"@type":"Organization","name":"Thầy Linh – Tuyển Thợ Mỏ","url":`${base}/`},"mainEntity":{"@type":"ItemList","numberOfItems":50,"itemListElement":itemList}})}</script>
</head>
<body>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="../"><span class="brand-mark">TL</span><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="back-link" href="../">← Trang chủ</a></div></header>
  <main>
    <section class="news-hero"><div class="container"><p class="eyebrow">Thư viện nội dung · 50 bài chuyên sâu</p><h1>Cẩm nang thợ mỏ và việc làm ngành Than</h1><p class="lead">Nội dung được chia theo nhu cầu tìm kiếm: điều kiện, hồ sơ, học nghề, công việc, thu nhập, phúc lợi, an toàn, công nghệ và hướng dẫn cho lao động từng tỉnh.</p><nav class="cluster-nav" aria-label="Nhóm bài viết">${Object.entries(clusterInfo).map(([k,v])=>`<a href="#${k}">${esc(v.label)}</a>`).join("")}</nav></div></section>
    <div class="container news-main">
      <article class="news-feature"><img src="${latestNews.image}" alt="Tái cơ cấu TKV 2026 và việc làm thợ mỏ"><div class="news-feature__body"><p class="news-kicker">Bài mới · 31/07/2026</p><h2>${latestNews.title}</h2><p>${latestNews.lead}</p><a class="news-link" href="${latestNews.href}">Đọc bài mới →</a></div></article>
      ${groups}
    </div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Cẩm nang học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div><a href="../#dang-ky">Kiểm tra điều kiện →</a></div></footer>
  <nav class="article-contact" aria-label="Liên hệ nhanh"><a href="https://zalo.me/0963048585" target="_blank" rel="noopener">Zalo · 096 304 8585</a><a href="https://m.me/thaylinhtuyenthomo" target="_blank" rel="noopener">Messenger</a></nav>
</body></html>`;
}

for (const [index, topic] of topics.entries()) {
  const dir = path.join(root, "bai-viet", topic.slug);
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir, "index.html"), articleHtml(topic,index));
}
fs.writeFileSync(path.join(root, "tin-nganh-than", "index.html"), hubHtml());

function collectHtml(dir, out=[]) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (entry.name.startsWith(".") || entry.name === "tools") continue;
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) collectHtml(full,out);
    else if (entry.name === "index.html") out.push(full);
  }
  return out;
}

const urls = collectHtml(root).map(file => {
  const rel = path.relative(root,file).replace(/index\.html$/,"").replaceAll(path.sep,"/");
  return `${base}/${rel}`;
}).sort((a,b) => a === `${base}/` ? -1 : b === `${base}/` ? 1 : a.localeCompare(b));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => {
  const priority = url === `${base}/` ? "1.0" : url.endsWith("/tin-nganh-than/") ? "0.9" : url.includes("/bai-viet/") ? "0.8" : "0.7";
  return `  <url><loc>${url}</loc><lastmod>2026-07-30</lastmod><changefreq>${url.includes("/bai-viet/") ? "monthly" : "weekly"}</changefreq><priority>${priority}</priority></url>`;
}).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root,"sitemap.xml"),sitemap);

const feedItems = topics.map(t => `  <item><title>${esc(t.title)}</title><link>${base}/bai-viet/${t.slug}/</link><guid>${base}/bai-viet/${t.slug}/</guid><pubDate>Thu, 30 Jul 2026 03:30:00 GMT</pubDate><description>${esc(t.lead)}</description></item>`).join("\n");
fs.writeFileSync(path.join(root,"feed.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Thầy Linh – Cẩm nang nghề mỏ</title><link>${base}/tin-nganh-than/</link><description>Điều kiện, học nghề, việc làm, thu nhập và đời sống thợ mỏ.</description><language>vi</language><lastBuildDate>Thu, 30 Jul 2026 03:30:00 GMT</lastBuildDate>\n${feedItems}\n</channel></rss>\n`);
fs.writeFileSync(path.join(root,"feed.json"),JSON.stringify({
  version:"https://jsonfeed.org/version/1.1",title:"Thầy Linh – Cẩm nang nghề mỏ",home_page_url:`${base}/`,feed_url:`${base}/feed.json`,language:"vi-VN",
  items:topics.map(t=>({id:`${base}/bai-viet/${t.slug}/`,url:`${base}/bai-viet/${t.slug}/`,title:t.title,summary:t.lead,image:t.image,date_published:published,tags:secondaryKeywords(t)}))
},null,2)+"\n");

const llms = `# Thầy Linh – Tuyển Thợ Mỏ\n\n> Website tư vấn học nghề mỏ và việc làm ngành Than tại Quảng Ninh do Nguyễn Tử Linh biên soạn.\n\n## Nội dung chính\n\n- Điều kiện tham khảo: Nam 18–40 tuổi, chiều cao từ 1m53, cân nặng từ 47kg và sức khỏe phù hợp.\n- Nghề khai thác mỏ và xây dựng mỏ: 2–3 tháng. Cơ điện mỏ: 10 tháng.\n- Hồ sơ hướng dẫn: căn cước công dân, giấy khai sinh, bằng cấp 2 hoặc cấp 3 nếu có.\n- Thu nhập thợ lò tham khảo: 20–25 triệu đồng/tháng, phụ thuộc vị trí, ngày công, năng suất và đơn vị.\n- Liên hệ tư vấn: Zalo 096 304 8585.\n\n## Thư viện 50 bài SEO\n\n${topics.map(t=>`- [${t.title}](${base}/bai-viet/${t.slug}/): ${t.lead}`).join("\n")}\n`;
fs.writeFileSync(path.join(root,"llms.txt"),llms);

console.log(`Generated ${topics.length} articles, ${urls.length} sitemap URLs and both feeds.`);
