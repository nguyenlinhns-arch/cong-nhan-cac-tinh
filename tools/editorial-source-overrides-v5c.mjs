const overrides = {
  "cong-ty-vat-tu-do-dau-cuu-thanh-nien-xung-phong-2026": {
    intro: [
      "Chương trình Công ty Vật tư đỡ đầu cựu thanh niên xung phong năm 2026 công bố mức hỗ trợ 1 triệu đồng mỗi tháng từ quý III cho một trường hợp tại xã Hải Ninh, Quảng Ninh. Mức tiền và thời điểm bắt đầu rõ ràng giúp việc thực hiện có thể được theo dõi theo từng kỳ.",
      "Đây là hoạt động trách nhiệm xã hội dành cho một trường hợp cụ thể, không thay thế chế độ người có công và không phải quyền lợi chung của lao động TKV. Điều cần theo dõi tiếp là tính liên tục của chi trả, đầu mối liên hệ và cách cập nhật khi hoàn cảnh thay đổi."
    ]
  },
  "than-ha-long-ho-tro-xay-sua-nha-gia-dinh-chinh-sach-2026": {
    intro: [
      "Chương trình Than Hạ Long hỗ trợ xây sửa nhà năm 2026 có tổng giá trị 183 triệu đồng cho một gia đình nguyên thợ lò tại Hải Phòng. Trong đó, 150 triệu đồng đến từ Quỹ Phúc lợi TKV, 30 triệu đồng từ Quỹ Người lao động đóng góp và 3 triệu đồng là quà hiện vật.",
      "Cơ cấu ba nguồn giúp phân biệt rõ trách nhiệm của Tập đoàn, doanh nghiệp và tập thể người lao động. Con số 183 triệu đồng áp dụng cho trường hợp được xét trong đợt này; kết quả cuối cùng cần được nhìn qua tiến độ thi công, nghiệm thu và điều kiện sử dụng sau bàn giao."
    ]
  },
  "than-nui-beo-ho-tro-cuu-thanh-nien-xung-phong-2026": {
    intro: [
      "Chương trình Than Núi Béo hỗ trợ cựu thanh niên xung phong tại phường Việt Hưng xác nhận hình thức hỗ trợ thường xuyên sau cuộc khảo sát ngày 13/08/2026, nhưng chưa công bố mức tiền hoặc thời hạn. Vì vậy, thông tin hiện có chỉ cho phép xác nhận tính định kỳ của chương trình.",
      "Không có căn cứ dùng trường hợp này để suy ra một mức hỗ trợ chung hoặc so sánh quyền lợi giữa các đơn vị. Bước cần theo dõi tiếp là đầu mối phụ trách, cách nhận ổn định và khả năng kết nối thêm hỗ trợ về sức khỏe, nhà ở nếu hoàn cảnh thay đổi."
    ]
  }
};

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function applyEditorialSourceOverridesV5c(article = {}) {
  const override = overrides[article.slug];
  if (!override) return article;
  return {
    ...article,
    ...override,
    intro: (override.intro || article.intro || []).map(clean).filter(Boolean),
    editorialStandard: "journalism-expertise-communications-v5c",
    editorialV5: true,
  };
}

export const editorialSourceOverridesV5c = overrides;
