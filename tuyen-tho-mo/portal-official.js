(() => {
  "use strict";
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");

  function closeMenu() {
    if (!button || !nav) return;
    nav.dataset.open = "false";
    button.setAttribute("aria-expanded", "false");
  }

  if (button && nav) {
    button.addEventListener("click", () => {
      const next = nav.dataset.open !== "true";
      nav.dataset.open = String(next);
      button.setAttribute("aria-expanded", String(next));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll("[data-contact]").forEach(link => {
    link.addEventListener("click", () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "contact_click",
        channel: link.dataset.contact,
        page_path: location.pathname
      });
    });
  });

  const featuredVideo = document.querySelector("[data-featured-video]");
  const videoLabel = document.querySelector("[data-video-label]");
  const videoHeading = document.querySelector("[data-video-heading]");
  const videoButtons = document.querySelectorAll("[data-video-id]");
  if (featuredVideo && videoLabel && videoHeading) {
    videoButtons.forEach(videoButton => {
      videoButton.addEventListener("click", () => {
        featuredVideo.src = `https://www.youtube-nocookie.com/embed/${videoButton.dataset.videoId}?rel=0&autoplay=1`;
        featuredVideo.title = videoButton.dataset.videoTitle;
        videoLabel.textContent = videoButton.dataset.videoLabel;
        videoHeading.textContent = videoButton.dataset.videoTitle;
        videoButtons.forEach(item => item.setAttribute("aria-current", String(item === videoButton)));
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "video_select",
          video_id: videoButton.dataset.videoId,
          page_path: location.pathname
        });
      });
    });
  }

  const provinceData = {
    "thanh-hoa": {
      name: "Thanh Hóa", videoId: "ts41cqu7r9c",
      title: "Công nhân Hà Văn Phú – Mường Lát, thu nhập trên 300 triệu đồng/năm",
      salaryCount: 21,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczM-prI57BJCqkhQ3dNofLU1jx8x2u-yeyAGlvcUaDdn2-VJ4c5h3f6m_MdnDwcxMcPK8eTTa-GG2sxPa2mQcmdyvHLBKJqyeXfSyViKGhgxZsgeYOE",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/thanh-hoa/"
    },
    "nghe-an": {
      name: "Nghệ An", videoId: "uPLUcoFN1cU",
      title: "Nguyễn Văn Thái – Anh Sơn, thu nhập bình quân 28 triệu đồng/tháng",
      salaryCount: 18,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczM63HYWZ7YcOorBXOZxZmXbOHHlzNJMilbrV9e5Q8cAg1F68aaHTdS0mhH2vrcTQgyl03FjeEGPtFuJOZIWBVrbIpoupXIDAVjaPG5GH7mEPXs6FOg",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/nghe-an/"
    },
    "ha-tinh": {
      name: "Hà Tĩnh", videoId: "n3Y3snnBJGk",
      title: "Nguyễn Trịnh Anh – Hà Tĩnh, lương bình quân 28 triệu đồng/tháng",
      salaryCount: 6,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczMJ0rQGzDj5TkRQuAGUSnltAZNZtDmfYlvahVMwYkmBFcN53Y1r09Gp9AZCd-TbqQgC03MK7kbaS8YhcYAuKNPvSExHIe-DQkIG68zKrqgEMrmnP1Q",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/ha-tinh/"
    },
    "quang-tri": {
      name: "Quảng Trị", videoId: "cpeiTxtJKu4",
      title: "Hồ Văn Cương – Hướng Hóa, thu nhập bình quân 25–30 triệu đồng/tháng",
      salaryCount: 16,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczM8dPrLPhGdcX7XcklL2sukdGvluDLShhHtRPULB0IeUvuvB57uXK32blcwtumNNn7hyQWiUCkfa59NdM9GQQubjUQIObzlYDdOSx-XRRBFv2VuQiM",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/quang-tri/"
    },
    "quang-ngai": {
      name: "Quảng Ngãi", videoId: "0kWCKhpw5B8",
      title: "Đinh Văn Ne – Quảng Ngãi, lương 23–25 triệu đồng/tháng",
      salaryCount: 21,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczM3TnwENaP4JLhQU9V_39Nx2D12Vb-sGGOmJ4dk0bw0KBnbRc5cbj8VnFrskGpL7o6aIFjRC7WjJXSYyf6UBJrWCbNLdc6uFh4xpHz_bCkSJbfMvKU",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/quang-ngai/"
    },
    "gia-lai": {
      name: "Gia Lai", videoId: "ASk-68jvGJM",
      title: "Chàng trai Gia Lai đạt thu nhập 30 triệu đồng/tháng tại Than Quang Hanh",
      salaryCount: 0, salaryImage: "", album: "",
      page: "viec-lam-nganh-than/gia-lai/"
    },
    "dak-lak": {
      name: "Đắk Lắk", videoId: "WkSt6eOvlkA",
      title: "Video tổng quan: chuyện những người thợ lò thu nhập cao của ngành Than",
      salaryCount: 0, salaryImage: "", album: "",
      page: "viec-lam-nganh-than/dak-lak/", fallback: true
    },
    "son-la": {
      name: "Sơn La", videoId: "h4zuijHumME",
      title: "Lầu A Súa – Sơn La, thu nhập 28 triệu đồng/tháng tại Than Hạ Long",
      salaryCount: 17,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczM9u0Y0woSlJK7KaZ37LQlKKZwNqQ130WBLW2gZ9grMsqgbUdx5cppfPjXaQrIJLp49MnJ3SQABlE8vlEkM9mPE13F4weDOx_PPAY4gjJOy_rvYkA0",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/son-la/"
    },
    "dien-bien": {
      name: "Điện Biên", videoId: "xW92UBKmWok",
      title: "Mùa A Vàng – Điện Biên, hành trình đổi đời tại vùng mỏ Quảng Ninh",
      salaryCount: 10,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczM37_ykNtbl5rCpMs7hGEYq0PwkKV6CWFWR2_a5pt3IYrGMAvnYQ3WU3pH_E-Vp6LcYGCWz8QpHYi9wevxBsLvpoOe72odH3NYIn9a-pkUW4R-NtJQ",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/dien-bien/"
    },
    "lao-cai": {
      name: "Lào Cai", videoId: "DafkstceRgk",
      title: "Vàng A Chinh – Lào Cai, lương bình quân 20–22 triệu đồng/tháng",
      salaryCount: 19,
      salaryImage: "https://lh3.googleusercontent.com/pw/AP1GczMYGl4Ib1loWt5hloK0NwEAoVF_nCOqOeZlekQa2Q0Wf8VD2o1FXBw-i74t05wh4arAKNa-rM-ybY3X_Hx-OiiksGw7VBaExnBpahMLk1BfD_zs2HM",
      album: "anh-video-thuc-te/",
      page: "viec-lam-nganh-than/lao-cai/"
    }
  };

  const provinceButtons = document.querySelectorAll("[data-province-key]");
  const provinceVideo = document.querySelector("[data-province-video]");
  const provinceName = document.querySelector("[data-province-name]");
  const provinceTitle = document.querySelector("[data-province-title]");
  const provinceCount = document.querySelector("[data-province-count]");
  const provinceSalary = document.querySelector("[data-province-salary]");
  const provinceSalaryView = document.querySelector("[data-province-salary-view], [data-province-album]");
  const provinceAlbumButton = document.querySelector("[data-province-album-button]");
  const provincePage = document.querySelector("[data-province-page]");
  const provinceMissing = document.querySelector("[data-province-missing]");
  const provinceStatus = document.querySelector("[data-province-status]");

  function selectProvince(key) {
    const province = provinceData[key];
    if (!province || !provinceVideo) return;
    provinceButtons.forEach(item => item.setAttribute("aria-selected", String(item.dataset.provinceKey === key)));
    provinceVideo.src = `https://www.youtube-nocookie.com/embed/${province.videoId}?rel=0`;
    provinceVideo.title = `${province.title} – video công nhân ${province.name}`;
    provinceName.textContent = province.name;
    provinceTitle.textContent = province.title;
    provincePage.href = province.page;
    provincePage.textContent = `Xem tư vấn ${province.name}`;

    const hasSalary = Boolean(province.salaryImage && province.album);
    provinceCount.textContent = hasSalary ? `${province.salaryCount} ảnh lương` : "Đang cập nhật ảnh";
    provinceSalaryView.hidden = !hasSalary;
    provinceMissing.hidden = hasSalary;
    provinceAlbumButton.hidden = !hasSalary;
    if (hasSalary) {
      provinceSalary.src = `${province.salaryImage}=w1000-no`;
      provinceSalary.alt = `Bảng lương công nhân ${province.name}`;
      provinceAlbumButton.href = province.album;
    }
    provinceStatus.textContent = province.fallback
      ? "Playlist 90 video chưa có video gắn nhãn Đắk Lắk; đang hiển thị video tổng quan ngành Than để tránh gắn nhầm người của tỉnh khác."
      : hasSalary
        ? `Video và ảnh lương được đối chiếu theo đúng tỉnh ${province.name}.`
        : `Playlist đã có video công nhân ${province.name}; album ảnh lương riêng chưa được chia sẻ công khai.`;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "province_select", province: key, page_path: location.pathname });
  }

  provinceButtons.forEach(provinceButton => {
    provinceButton.addEventListener("click", () => selectProvince(provinceButton.dataset.provinceKey));
  });

  const readingProgress = document.querySelector("[data-reading-progress]");
  if (readingProgress) {
    let progressFrame = 0;
    const updateReadingProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      readingProgress.style.transform = `scaleX(${progress})`;
      progressFrame = 0;
    };
    const requestProgressUpdate = () => {
      if (!progressFrame) progressFrame = window.requestAnimationFrame(updateReadingProgress);
    };
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate, { passive: true });
    updateReadingProgress();
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
