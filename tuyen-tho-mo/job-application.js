(() => {
  "use strict";
  const form = document.querySelector("[data-application-form]");
  if (!form) return;

  const result = document.querySelector("[data-application-result]");
  const output = document.querySelector("[data-application-message]");
  const error = document.querySelector("[data-form-error]");
  const birthDate = document.querySelector("[data-birth-date]");
  const copyButton = document.querySelector("[data-copy-application]");

  const isoDate = date => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const today = new Date();
  const latestBirth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const earliestBirth = new Date(today.getFullYear() - 36, today.getMonth(), today.getDate() + 1);
  birthDate.min = isoDate(earliestBirth);
  birthDate.max = isoDate(latestBirth);

  function calculateAge(value) {
    const born = new Date(`${value}T00:00:00`);
    let age = today.getFullYear() - born.getFullYear();
    const month = today.getMonth() - born.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < born.getDate())) age -= 1;
    return age;
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      output.hidden = false;
      output.focus();
      output.select();
      document.execCommand("copy");
    }
  }

  function attribution() {
    const params = new URLSearchParams(location.search);
    return params.get("utm_source") || params.get("source") || document.referrer || "website";
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    error.hidden = true;
    if (!form.reportValidity()) return;

    const values = Object.fromEntries(new FormData(form).entries());
    const age = calculateAge(values.birth_date);
    if (age < 18 || age > 35) {
      error.textContent = "Độ tuổi hiện tại cần từ đủ 18 đến 35 tuổi.";
      error.hidden = false;
      birthDate.focus();
      return;
    }

    const message = [
      "ĐĂNG KÝ TUYỂN LAO ĐỘNG HỌC NGHỀ MỎ 2026",
      `- Họ và tên: ${values.full_name}`,
      `- Số điện thoại: ${values.phone}`,
      `- Ngày sinh / tuổi: ${values.birth_date} / ${age}`,
      `- Tỉnh, thành: ${values.province}`,
      `- Chiều cao / cân nặng: ${values.height} cm / ${values.weight} kg`,
      `- Trình độ: ${values.education}`,
      `- Nghề quan tâm: ${values.trade}`,
      `- Sức khỏe hiện tại: ${values.health}`,
      "- Thời gian học đã tìm hiểu: 2–3 tháng",
      `- Nguồn: ${attribution()}`,
      "Nhờ anh Nguyễn Tử Linh kiểm tra điều kiện và hướng dẫn bước tiếp theo."
    ].join("\n");

    output.value = message;
    await copyText(message);
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "center" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "application_message_created", province: values.province, trade: values.trade, source: attribution() });
  });

  copyButton?.addEventListener("click", async () => {
    await copyText(output.value);
    copyButton.textContent = "Đã sao chép tin nhắn";
    window.setTimeout(() => { copyButton.textContent = "Sao chép lại tin nhắn"; }, 2500);
  });
})();
