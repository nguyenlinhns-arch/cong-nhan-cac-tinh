export function applyEditorialSourceOverridesV5f(article = {}) {
  if (article.slug !== "cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026") return article;

  const sections = [...(article.sections || [])];
  if (sections.length) {
    sections[0] = {
      ...sections[0],
      title: "Khoản hỗ trợ định kỳ cần cơ chế theo dõi rõ",
      paragraphs: [
        "Với một chương trình kéo dài nhiều tháng, tính liên tục phụ thuộc lịch chuyển tiền, cách xác nhận đã nhận và đầu mối xử lý khi tài khoản, sức khỏe hoặc nơi cư trú thay đổi. Đây là phần quyết định cam kết hỗ trợ có được duy trì đều đặn trong thực tế hay không.",
        "Những khó khăn phát sinh ngoài khoản định kỳ cần được xác minh theo hoàn cảnh cụ thể và phối hợp với địa phương. Cách làm này giúp nguồn lực đi đúng nhu cầu, hạn chế chồng chéo với các chương trình an sinh đã có và giữ rõ trách nhiệm của từng bên.",
      ],
    };
  }

  return {
    ...article,
    lead: "Từ quý III/2026, Công ty Cổ phần Vật tư bắt đầu đỡ đầu bà Đặng Thị Bình, cựu thanh niên xung phong tại xã Hải Ninh, với mức hỗ trợ 1.000.000 đồng mỗi tháng.",
    intro: [
      "Ngày 15/08/2026, đại diện Công ty Cổ phần Vật tư đến thăm bà Đặng Thị Bình tại xã Hải Ninh, Quảng Ninh và công bố chương trình đỡ đầu thường xuyên. Hoạt động được thực hiện như một phần trách nhiệm xã hội của doanh nghiệp đối với cựu thanh niên xung phong có hoàn cảnh cần hỗ trợ.",
      "Khoản hỗ trợ có thời điểm bắt đầu và mức chi trả rõ, tạo căn cứ để gia đình và doanh nghiệp cùng đối chiếu việc thực hiện theo từng tháng. Ngoài phần định kỳ, Công ty xác định sẽ phối hợp khi hoàn cảnh của bà Bình phát sinh nhu cầu lớn cần xem xét thêm.",
      "Đây là chương trình dành cho một trường hợp đã được khảo sát, không phải chính sách chung của TKV. Hoạt động của doanh nghiệp cũng cần được phân biệt với các chế độ người có công do cơ quan nhà nước thực hiện.",
    ],
    sections,
    takeaway: "Giá trị của chương trình sẽ được đo bằng tính đều đặn trong thực hiện, sự phối hợp khi hoàn cảnh thay đổi và khả năng bảo vệ đời tư của người được hỗ trợ.",
    editorialV5: true,
    editorialV5Revision: "v5f",
  };
}
