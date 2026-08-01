import {pressStoryInlineMedia} from "./press-story-inline-media.mjs";

const image = (src, alt, caption = alt) => Object.freeze({src, alt, caption});

const baseArticleInlineImages = Object.freeze({
  "dao-tao-an-toan-truoc-khi-vao-lo": Object.freeze([
    image(
      "https://cdn.nhandan.vn/images/8d4dd6dbc1e2d72e66f1426728ddf64a9c543cfa89aa05eddc9bd24a3c117488549f3160fee712492c82da51b8dc701bebc551424f1bb2281b5b25c9aa5adfc4/cn-than-ha-long-5014.jpg.avif",
      "Công nhân ngành Than làm việc với trang bị bảo hộ và quy trình an toàn",
      "An toàn lao động được thực hiện từ trang bị, kiểm tra đến thao tác trong ca sản xuất.",
    ),
  ]),
  "tuyen-quang-phoi-hop-tuyen-sinh-nghe-mo-2025-2030": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/11/DSC07883-1920x1080.jpg", "Đại biểu tham dự chương trình phối hợp tuyển sinh, đào tạo nghề với các địa phương", "Một hoạt động trong chuỗi ký kết phối hợp tuyển sinh, đào tạo nghề giai đoạn 2025–2030."),
  ]),
  "hai-lang-phoi-hop-dao-tao-viec-lam-nganh-than": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2026/01/DSC02606-1920x1080.jpg", "Đại biểu tại hội nghị phối hợp giữa Nhà trường, xã Hải Lạng và Công ty Than Dương Huy", "Hội nghị kết nối Nhà trường, địa phương và doanh nghiệp trong đào tạo nghề, giải quyết việc làm."),
  ]),
  "bang-thanh-phuc-loc-hoc-nghe-tho-lo-tkv": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2026/02/DSC03632-1920x1080.jpg", "Hoạt động tư vấn tuyển sinh nghề mỏ tại địa phương", "Thông tin học nghề và việc làm được trao đổi trực tiếp với cán bộ cơ sở và người lao động."),
  ]),
  "nam-tuan-cao-bang-dao-tao-nghe-mo-viec-lam": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2026/05/007-1068x601.jpg", "Đại biểu tại chương trình hợp tác ba bên về đào tạo nghề và việc làm", "Chương trình hợp tác ba bên gắn trách nhiệm của địa phương, Nhà trường và doanh nghiệp."),
  ]),
  "luong-minh-hieu-qua-tuyen-sinh-dao-tao-viec-lam": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2026/05/DSC00849-1920-1068x601.jpg", "Hội nghị sơ kết công tác tuyển sinh, đào tạo và giải quyết việc làm tại xã Lương Minh", "Các kết quả tuyển sinh, nhập học và việc làm được rà soát tại hội nghị sơ kết ở xã Lương Minh."),
  ]),
  "binh-lieu-hop-tac-hoc-nghe-mo-viec-lam-tkv": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/11/DSC05788-1920x1080.jpg", "Đại biểu dự lễ ký quy chế phối hợp với xã Bình Liêu", "Quy chế phối hợp tạo đầu mối rõ ràng từ tư vấn tại địa phương đến đào tạo và việc làm."),
  ]),
  "luc-hon-than-ha-long-dao-tao-nghe-giai-quyet-viec-lam": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/07/DSC09650-1920x1080.jpg", "Đại biểu xã Lục Hồn, Nhà trường và doanh nghiệp trao đổi về đào tạo nghề", "Chương trình phối hợp mở rộng cơ hội học nghề và việc làm cho lao động vùng cao xã Lục Hồn."),
  ]),
  "vi-xuyen-ha-giang-hoc-nghe-mo-viec-lam-tkv": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/01/DSC09292-1920x1080.jpg", "Đại biểu tại chương trình phối hợp đào tạo nghề cho lao động huyện Vị Xuyên", "Hợp tác giai đoạn 2025–2030 đưa thông tin đào tạo nghề và việc làm đến lao động huyện Vị Xuyên."),
  ]),
  "hoanh-mo-xay-lap-mo-dao-tao-nghe-viec-lam": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/12/DSC00095-1920x1080.jpg", "Đại biểu tại hội nghị phối hợp đào tạo nghề và việc làm ở xã Hoành Mô", "Hội nghị thống nhất cơ chế phối hợp đào tạo nghề và giải quyết việc làm cho người lao động xã Hoành Mô."),
  ]),
  "si-lo-lau-khun-ha-lai-chau-hoc-nghe-mo": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/09/DSC01947-1920x1080.jpg", "Người lao động vùng cao Tây Bắc tại chương trình kết nối đào tạo nghề", "Đào tạo nghề được giới thiệu như một con đường nâng chất lượng nguồn nhân lực vùng cao Tây Bắc."),
  ]),
  "tinh-doan-lai-chau-ket-noi-viec-lam-tkv": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/05/DSC02835-1920x1080.jpg", "Đại biểu trao đổi về cơ hội việc làm cho thanh niên Lai Châu", "Nhà trường và Tỉnh đoàn Lai Châu tăng cường kết nối thông tin học nghề, việc làm cho thanh niên."),
  ]),
  "bao-lac-cao-bang-tu-van-hoc-nghe-mo": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2025/04/2f8fb7e72572962ccf634-530x396.jpg", "Đoàn công tác Bảo Lạc tìm hiểu chương trình đào tạo tại Nhà trường", "Chuyến làm việc giúp địa phương trực tiếp tìm hiểu điều kiện học tập và định hướng việc làm sau đào tạo."),
  ]),
  "luong-minh-quang-tan-ky-ket-dao-tao-viec-lam": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2026/01/DSC02213-1920x1080.jpg", "Đại biểu tại lễ ký kết phối hợp ba bên về đào tạo nghề và việc làm", "Lễ ký kết xác lập trách nhiệm phối hợp giữa địa phương, Nhà trường và doanh nghiệp tiếp nhận."),
  ]),
  "tua-chua-dien-bien-phoi-hop-hoc-nghe-mo-2024": Object.freeze([
    image("https://caodangtkv.edu.vn/wp-content/uploads/2024/09/DSC01203.jpg", "Đoàn công tác huyện Tủa Chùa làm việc với Trường Cao đẳng TKV", "Hai bên trao đổi về đào tạo nghề và hướng giải quyết việc làm cho lao động huyện Tủa Chùa."),
  ]),
  "muong-khuong-bat-xat-tuyen-lao-dong-tkv-2024": Object.freeze([
    image("https://cdn.baolaocai.vn/images/143503276ab88d52cd8f7a57440e05496709cb11e46b71a5f9b5e29dc1dff961ba1f7b37d761ea9603d4fd4dedac4065/dsc09212-5430-6521.jpg", "Đoàn công tác trao đổi tại chương trình tuyển lao động ở Lào Cai", "Chương trình tại Mường Khương và Bát Xát đưa thông tin học nghề, việc làm đến gần người lao động địa phương."),
  ]),
  "dam-ha-than-thong-nhat-dao-tao-viec-lam-2026": Object.freeze([
    image("https://www.thanthongnhat.vn/uploads/news/2026_05/z2.jpg", "Đại biểu tại chương trình phát triển nguồn nhân lực ở xã Đầm Hà", "Công ty Than Thống Nhất và các đơn vị phối hợp trao đổi về đào tạo nghề, việc làm tại xã Đầm Hà."),
  ]),
  "tho-mo-vao-ca-duong-huy": Object.freeze([
    image("https://cdn.nhandan.vn/images/78d92bfef5333421c1cfa9f19aa2572af2f6454a381555b801846adcfda20221c0380c4f89faea6bfd2de53d745b8a814b4f4a63df89933108d907b681da3310968cb0b24b44d6d536da6e56fd69c966/969ffaf801f42e9073aaeb29efd53377.jpg.avif", "Thợ mỏ Công ty Than Dương Huy – TKV chuẩn bị vào hầm lò làm việc", "Người thợ chuẩn bị trang phục, đèn lò và phương tiện bảo hộ trước khi vào ca."),
  ]),
  "gia-dinh-ba-the-he-tho-mo-thong-nhat": Object.freeze([
    image("https://media.vov.vn/sites/default/files/styles/large_watermark/public/2023-06/giadinh3thehethomo_6.jpg", "Thợ lò Nguyễn Hồng Cẩm và con trai cùng làm việc tại Than Thống Nhất", "Hai thế hệ trong gia đình cùng làm việc tại Than Thống Nhất, tiếp nối truyền thống nghề mỏ ở Cẩm Phả."),
  ]),
  "ma-khac-huynh-nguoi-mo-duong-trong-long-dat": Object.freeze([
    image("https://static-images.vnncdn.net/files/publish/2023/9/25/w-z4695688607368-21d14741fe7010ea3317d5373188de49-1-1541.jpg?width=0&s=p30L9VF1cO4VQVb3e7EGvQ", "Anh Tuyên trước khi xuống lò than làm việc", "Trước giờ vào ca, người thợ kiểm tra trang bị và chuẩn bị cho hành trình xuống lò."),
  ]),
  "mot-ngay-trong-lo-than-duong-huy": Object.freeze([
    image("https://cdnphoto.dantri.com.vn/hpmdXq_PXOP5YWqPVsLdlHnXbIk=/2020/10/25/ham-lo-duong-huy-1-1603637012701.jpg", "Những người thợ lò Than Dương Huy di chuyển vào lòng đất", "Cánh cửa hầm lò mở ra hành trình vào ca của những người khai thác than dưới lòng đất."),
  ]),
  "nhung-nguoi-tho-lo-gieo-no-luc": Object.freeze([
    image("https://cdn.tienphong.vn/images/814b5533c866dc3540018a126103e9357e3a0ce2a45f49b482d0b2e04a4e42e844aa16d58847f629a5abc9b4da82612c9d8361ef35adc56a5d389dcd91d52acf/image003_JYNE.jpg.avif", "Công nhân Hán Cao Phi, Tổ trưởng Tổ Cơ điện Công ty Than Nam Mẫu", "Công nhân Hán Cao Phi được vinh danh trong phong trào sản xuất giỏi của TKV."),
  ]),
  "khoanh-khac-tho-mo-vang-danh": Object.freeze([
    image("https://cdn-images.vtv.vn/thumb_w/1200/2017/3-kiem-tra-cong-tac-lay-than-pha-hoa-lo-cho-1512105262988.jpg", "Thợ mỏ kiểm tra công tác lấy than phá hỏa lò chợ", "Kiểm tra hiện trường là một phần của quy trình giữ an toàn và nhịp sản xuất trong lò chợ."),
  ]),
  "ly-van-di-nguoi-cha-tho-lo": Object.freeze([
    image("https://cdn-i2.congthuong.vn/resize/th/upload/2026/03/06/z75912126116939d735adb1ecb321f9977f6a01b62bc4f-00000728.jpg", "Căn nhà sàn của gia đình anh Lý Văn Dỉ tại Cao Bằng", "Ngôi nhà ở quê là nơi các con anh Dỉ sinh sống trong những năm người cha làm thợ lò xa nhà."),
  ]),
  "ky-luat-dong-tam-tho-mo-ha-lam": Object.freeze([
    image("https://media.baoquangninh.com.vn/dataimages/202008/original/images1413239_IMG_9213.jpg", "Anh Phạm Văn An cùng lãnh đạo và thợ mỏ Hà Lầm trò chuyện", "Câu chuyện nghề được trao truyền trong những cuộc trò chuyện giữa người thợ và đồng đội tại Than Hà Lầm."),
  ]),
  "anh-tho-mo-khe-cham-qua-ong-kinh-ttxvn": Object.freeze([
    image("https://media.vietnamplus.vn/images/bc12065fef1dc485941a5ad9a9fec4718281d1c7559056f129a489bd3565934174f2832fb20b6096416fa9847cf2cc32/mo18.jpg.avif", "Xuất khẩu than tại cảng nổi Hòn Nét, Quảng Ninh", "Từ khai trường, than tiếp tục hành trình qua cảng nổi Hòn Nét trước khi đến nơi sử dụng."),
    image("https://media.vietnamplus.vn/images/bc12065fef1dc485941a5ad9a9fec4718281d1c7559056f129a489bd3565934199839e4730a2e51b83388ad1362d0055/mo19.jpg.avif", "Nghiên cứu an toàn và công nghệ mỏ tại Viện Khoa học Công nghệ Mỏ", "Nghiên cứu về an toàn, thông gió và cơ lý đá tạo nền kỹ thuật cho khai thác than lộ thiên, hầm lò."),
  ]),
});

export const articleInlineImages = Object.freeze({
  ...baseArticleInlineImages,
  ...pressStoryInlineMedia,
});
