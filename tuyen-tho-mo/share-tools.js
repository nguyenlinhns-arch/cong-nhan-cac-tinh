(() => {
  "use strict";

  const ROOT = "https://thaylinhtuyenthomo.vn";
  const CAMPAIGN = "lan_toa_nghe_mo_2026";
  const DEFAULT_SOURCE = "cong_tac_vien";
  const DEFAULT_MEDIUM = "social";

  function track(method, context, content, province = "") {
    const payload = {
      method,
      context,
      page_path: location.pathname,
      campaign: CAMPAIGN,
      content,
      ...(province ? { province } : {}),
    };
    if (typeof window.tlTrack === "function") window.tlTrack("share", payload);
    else {
      window.tlTrackingQueue = window.tlTrackingQueue || [];
      window.tlTrackingQueue.push(["share", payload]);
    }
  }

  function trackedUrl(rawUrl, content, province = "") {
    const url = new URL(rawUrl, ROOT);
    url.searchParams.set("utm_source", DEFAULT_SOURCE);
    url.searchParams.set("utm_medium", DEFAULT_MEDIUM);
    url.searchParams.set("utm_campaign", CAMPAIGN);
    url.searchParams.set("utm_content", content);
    if (province) url.searchParams.set("province", province);
    return url.href;
  }

  async function copy(value) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_) {
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      const copied = document.execCommand("copy");
      area.remove();
      return copied;
    }
  }

  function setupArticleSharing() {
    document.querySelectorAll("[data-article-share]").forEach(panel => {
      const title = panel.dataset.shareTitle || document.title;
      const rawUrl = panel.dataset.shareUrl || document.querySelector('link[rel="canonical"]')?.href || location.href;
      const content = panel.dataset.shareContent || "article";
      const url = trackedUrl(rawUrl, content);
      const status = panel.querySelector("[data-share-status]");
      panel.querySelectorAll("[data-share-link]").forEach(link => { link.href = url; });

      panel.querySelector("[data-share-copy]")?.addEventListener("click", async () => {
        const ok = await copy(`${title}\n${url}`);
        if (status) status.textContent = ok ? "Đã sao chép liên kết có mã đo nguồn." : "Chưa thể sao chép; hãy chọn liên kết và sao chép thủ công.";
        track("copy", "article", content);
      });

      panel.querySelector("[data-share-native]")?.addEventListener("click", async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title, text: title, url });
            if (status) status.textContent = "Đã mở bảng chia sẻ của thiết bị.";
            track("native", "article", content);
            return;
          } catch (error) {
            if (error?.name === "AbortError") return;
          }
        }
        const ok = await copy(`${title}\n${url}`);
        if (status) status.textContent = ok ? "Thiết bị không hỗ trợ bảng chia sẻ; liên kết đã được sao chép." : "Thiết bị chưa cho phép sao chép.";
        track("copy_fallback", "article", content);
      });
    });
  }

  function packageText(name, slug) {
    const isGeneral = slug === "toan-quoc";
    const pageUrl = trackedUrl(isGeneral ? "/trung-tam-nghe-mo/" : `/viec-lam-nganh-than/${slug}/`, isGeneral ? "toan_quoc" : `tinh_${slug}`, isGeneral ? "" : name);
    const applyUrl = trackedUrl("/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/", isGeneral ? "ung_tuyen_toan_quoc" : `ung_tuyen_${slug}`, isGeneral ? "" : name);
    const audience = isGeneral ? "người lao động trên toàn quốc" : `người lao động tại ${name}`;
    return {
      text: [
        "CƠ HỘI HỌC NGHỀ MỎ – LÀM VIỆC TẠI QUẢNG NINH",
        "",
        `Thông tin dành cho ${audience}:`,
        "• Nam 18–40 tuổi; cao từ 1m53; nặng từ 47kg; sức khỏe tốt.",
        "• Không yêu cầu kinh nghiệm làm mỏ sẵn có; được đào tạo từ đầu trước khi nhận việc.",
        "• Ba nghề đang tiếp nhận: khai thác và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng.",
        "• Miễn kinh phí đào tạo theo chỉ tiêu; bố trí 3 bữa/ngày, ký túc xá và hỗ trợ 7,5 triệu đồng/tháng trong thời gian học.",
        "• Sau tốt nghiệp đạt yêu cầu được doanh nghiệp tiếp nhận làm việc.",
        "• Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.",
        "",
        `Xem thông tin đầy đủ${isGeneral ? "" : ` cho ${name}`}: ${pageUrl}`,
        `Ứng tuyển trực tiếp, chưa cần hồ sơ: ${applyUrl}`,
        "",
        "Đầu mối tư vấn: Nguyễn Tử Linh – Trưởng phòng Tuyển sinh Miền Trung · 096 304 8585.",
      ].join("\n"),
      url: pageUrl,
      content: isGeneral ? "toan_quoc" : `tinh_${slug}`,
      province: isGeneral ? "" : name,
    };
  }

  function setupPackageBuilder() {
    const builder = document.querySelector("[data-share-builder]");
    if (!builder) return;
    const select = builder.querySelector("[data-share-province]");
    const output = builder.querySelector("[data-share-output]");
    const preview = builder.querySelector("[data-share-preview]");
    const status = builder.querySelector("[data-share-status]");
    let current = packageText("Toàn quốc", "toan-quoc");

    const render = () => {
      const option = select.options[select.selectedIndex];
      current = packageText(option.dataset.name || option.textContent.trim(), option.value);
      output.value = current.text;
      preview.href = current.url;
      preview.textContent = current.province ? `Mở trang ${current.province}` : "Mở Trung tâm nghề mỏ";
      if (status) status.textContent = "Nội dung đã sẵn sàng để sao chép hoặc chia sẻ.";
    };

    select.addEventListener("change", render);
    builder.querySelector("[data-package-copy]")?.addEventListener("click", async () => {
      const ok = await copy(current.text);
      if (status) status.textContent = ok ? "Đã sao chép trọn gói nội dung và liên kết đo nguồn." : "Chưa thể sao chép tự động.";
      track("copy_package", "distribution_builder", current.content, current.province);
    });
    builder.querySelector("[data-package-share]")?.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: "Cơ hội học nghề mỏ – việc làm tại Quảng Ninh", text: current.text });
          if (status) status.textContent = "Đã mở bảng chia sẻ của thiết bị.";
          track("native_package", "distribution_builder", current.content, current.province);
          return;
        } catch (error) {
          if (error?.name === "AbortError") return;
        }
      }
      const ok = await copy(current.text);
      if (status) status.textContent = ok ? "Thiết bị không hỗ trợ bảng chia sẻ; nội dung đã được sao chép." : "Thiết bị chưa cho phép sao chép.";
      track("copy_package_fallback", "distribution_builder", current.content, current.province);
    });
    render();
  }

  setupArticleSharing();
  setupPackageBuilder();
})();
