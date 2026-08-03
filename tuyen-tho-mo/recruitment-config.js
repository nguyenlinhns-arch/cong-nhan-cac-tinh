window.THAY_LINH_RECRUITMENT = Object.freeze({
  // Giữ phiên bản truyền tải tương thích với web app CRM đang chạy.
  // Các trường đo lường v3 vẫn được gửi thêm và sẽ được CRM mới lưu khi nâng cấp.
  schemaVersion: 2,
  endpoint: "https://script.google.com/macros/s/AKfycbzDWAttjmaWu9K4XRkzmouKpQARs1BvrLOQkPMpCyouyH91CMFiOB75RV0fyaCLhJPI/exec",
  timeoutMs: 12000,
  criteria: Object.freeze({
    ageMin: 18,
    ageMax: 40,
    heightMinCm: 153,
    weightMinKg: 47,
  }),
});
