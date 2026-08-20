(() => {
  const SPREADSHEET_ID = '1eaWBK0Ty_jK7RmLjLqQBLalZ6wG5zUpPpjyCflPoQ-c';
  const reports = {
    dv: { gid: '774833471', title: 'Theo đơn vị tuyển sinh' },
    ph: { gid: '145193203', title: 'Theo phân hiệu / trung tâm' },
    dn: { gid: '103775085', title: 'Theo doanh nghiệp' },
    tinh: { gid: '1794777757', title: 'Học sinh trong tỉnh' },
    qc: { gid: '195061767', title: 'Đơn vị ký quy chế' }
  };
  const root = document.getElementById('reportContent');

  function render(key) {
    const report = reports[key] || reports.dv;
    const src = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/htmlembed?gid=${report.gid}&single=true&widget=false&headers=false&chrome=false`;
    root.innerHTML = `
      <div class="sheet-toolbar">
        <strong>${report.title}</strong>
        <span>Dữ liệu trực tiếp · Kéo ngang để xem đủ các cột</span>
      </div>
      <iframe class="sheet-frame" title="${report.title}" src="${src}" loading="eager"></iframe>`;
  }

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((item) => item.classList.toggle('active', item === btn));
      render(btn.dataset.report);
    });
  });

  render('dv');
})();
