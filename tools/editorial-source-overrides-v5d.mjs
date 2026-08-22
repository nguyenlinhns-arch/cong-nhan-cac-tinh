const overrides = {
  "kho-van-cam-pha-ho-tro-cuu-thanh-nien-xung-phong-2026": {
    lead: "Kho vận và Cảng Cẩm Phả đang xây dựng phương án hỗ trợ cựu thanh niên xung phong tại phường Cửa Ông sau đợt khảo sát ngày 13/08/2026. Các nội dung dự kiến gồm hỗ trợ hằng tháng, sửa mái chống dột, gia cố khu sinh hoạt và bổ sung vật dụng thiết yếu.",
    intro0: "Ngày 13/08/2026, đoàn Công ty Kho vận và Cảng Cẩm Phả – Vinacomin phối hợp với Ban chỉ huy quân sự phường Cửa Ông đến khảo sát trực tiếp gia đình bà Mai Thị Chút. Hoạt động Kho vận Cẩm Phả hỗ trợ cựu thanh niên xung phong bắt đầu từ việc xác định tình trạng nhà ở và nhu cầu sinh hoạt thực tế trước khi triển khai từng hạng mục.",
  },
};

export function applyEditorialSourceOverridesV5d(article = {}) {
  const override = overrides[article.slug];
  if (!override) return article;
  const intro = [...(article.intro || [])];
  if (override.intro0) intro[0] = override.intro0;
  return {
    ...article,
    lead: override.lead || article.lead,
    intro,
    editorialV5: true,
    editorialV5Revision: "v5d",
  };
}
