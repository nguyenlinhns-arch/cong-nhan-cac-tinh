const contextBySlug = {
  "bua-com-cong-doan-than-cao-son-2026": "Trong đợt Bữa cơm Công đoàn tháng 8/2026, khai trường rộng và công việc theo ca khiến chất lượng suất ăn, khả năng hồi phục thể lực và việc giao đúng vị trí cần được theo dõi như một phần trực tiếp của điều kiện làm việc.",
  "hoc-sinh-thuc-tap-than-khe-cham-2026": "Trong đợt thực tập tháng 8/2026, giai đoạn chuyển từ lớp học sang sản xuất quyết định khả năng hình thành kỹ năng, tác phong và sự thích nghi; theo dõi sát giúp người học và doanh nghiệp phát hiện sớm những điểm chưa phù hợp trước khi kết thúc chương trình.",
  "than-mao-khe-do-dau-cuu-thanh-nien-xung-phong-2026": "Giá trị của chương trình nằm ở tính đều đặn: khoản hỗ trợ chỉ có ý nghĩa lâu dài khi được chuyển đúng kỳ, đúng người và có đầu mối theo dõi khi hoàn cảnh của người được đỡ đầu thay đổi.",
  "than-nui-beo-nghi-duong-gia-dinh-tho-lo-2026": "Với công việc hầm lò theo ca, việc đưa vợ và con vào chương trình giúp phúc lợi tác động tới cả nhịp sống gia đình, nơi sự đồng hành của người thân có vai trò lớn đối với khả năng gắn bó lâu dài của người thợ.",
  "than-duong-huy-ho-tro-con-cong-nhan-2026": "Việc hỗ trợ trải theo nhiều bậc học giúp chính sách theo sát hành trình học tập của con người lao động, từ tuổi mầm non tới học nghề, cao đẳng và đại học, thay cho một đợt động viên đơn lẻ.",
  "than-mong-duong-phoi-hop-tuyen-sinh-dao-tao-2026": "Theo dõi tới giai đoạn thực tập giúp nhà trường và doanh nghiệp phát hiện sớm khó khăn về sức khỏe, kỹ năng hoặc khả năng thích nghi; đây là chặng quyết định tuyển sinh có chuyển thành nguồn nhân lực bền vững hay không.",
  "than-nui-hong-bao-dam-viec-lam-thu-nhap-2026": "Khi dự án chưa thể triển khai đúng kế hoạch, phương án bố trí lao động quyết định trực tiếp tới ngày công và sự ổn định đời sống; vì vậy thông tin cần được theo dõi cùng tiến độ cấp phép và cách doanh nghiệp sắp xếp từng nhóm công việc.",
  "than-nam-mau-tuyen-duong-con-cong-nhan-2026": "Với gia đình công nhân làm việc theo ca, khuyến học giúp doanh nghiệp mở rộng chăm lo từ nơi sản xuất tới đời sống gia đình; ý nghĩa của chương trình nằm ở việc ghi nhận cả thành tích học tập và nỗ lực vượt khó của con người lao động.",
};

export function applyEditorialSourceOverridesV5e(article = {}) {
  const context = contextBySlug[article.slug];
  if (!context) return article;
  const intro = [...(article.intro || [])];
  const normalizedContext = context.toLocaleLowerCase("vi").replace(/\s+/g, " ").trim();
  const alreadyPresent = intro.some((paragraph) => String(paragraph).toLocaleLowerCase("vi").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() === normalizedContext);
  if (!alreadyPresent) intro.splice(Math.min(1, intro.length), 0, context);
  return {
    ...article,
    intro,
    editorialV5: true,
    editorialV5Revision: "v5e",
  };
}

export const editorialSourceContextsV5e = contextBySlug;
