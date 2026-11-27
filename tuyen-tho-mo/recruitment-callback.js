(() => {
  "use strict";
  const form = document.querySelector("[data-callback-form]");
  if (!form) return;
  const status = document.querySelector("[data-receipt]");
  const button = form.querySelector('button[type="submit"]');
  const endpoint = window.THAY_LINH_RECRUITMENT?.endpoint;
  let busy = false, accepted = false, attempt = null;
  function message(value) { status.textContent = value; }
  function normalizePhone(value) {
    const clean = String(value).trim().replace(/[\s.()-]/g, "").replace(/^(?:\+84|84)/, "0");
    return /^0[35789]\d{8}$/.test(clean) ? clean : "";
  }
  function newCode() {
    const d = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const part = Array.from(crypto.getRandomValues(new Uint8Array(5)), b => (b % 36).toString(36)).join("").toUpperCase();
    return `TL-${d}-${part}`;
  }
  async function request(init = {}) {
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 12000);
    try {
      const response = await fetch(endpoint, { ...init, signal: abort.signal });
      if (!response.ok) throw Error("network");
      return response.json();
    } finally { clearTimeout(timeout); }
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (button.disabled || busy || accepted || !form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const phone = normalizePhone(data.phone);
    if (!phone) {
      message("Anh kiểm tra lại số di động, hoặc chọn Nhắn Zalo hay Gọi điện.");
      form.elements.namedItem("phone")?.focus();
      return;
    }
    const contact = {full_name: data.full_name.trim(), phone, province: data.province.trim(), trade: data.trade};
    if (contact.full_name.length < 2 || contact.province.length < 2 || data.consent !== "on") {
      message("Anh điền đủ họ tên, tỉnh/thành và đánh dấu đồng ý trước khi gửi."); return;
    }
    const fingerprint = JSON.stringify(contact);
    if (attempt?.fingerprint !== fingerprint) attempt = {fingerprint, code: newCode()};
    const code = attempt.code;
    busy = true; button.disabled = true; form.setAttribute("aria-busy","true");
    message("Đang chuyển yêu cầu gọi lại…");
    try {
      const reply = await request({method:"POST", headers:{"Content-Type":"text/plain;charset=UTF-8"},
        body:JSON.stringify({ ...contact, code, schema_version:5, request_kind:"callback", consent:true, source:"website", medium:"internal" })});
      if (reply?.ok !== true || reply.code !== code || reply.receipt_type !== "callback") throw Error("unconfirmed");
      accepted = true; form.reset();
      message(`Hệ thống đã nhận yêu cầu gọi lại. Mã: ${code}.`);
    } catch (_) {
      message(`Chưa xác nhận đã nhận. Mã: ${code}. Anh có thể thử lại hoặc nhắn Zalo, gọi điện bên dưới.`);
    } finally { busy = false; button.disabled = accepted; form.removeAttribute("aria-busy"); }
  });
  if (endpoint) request({cache:"no-store"}).then(reply => {
    if (reply?.ok === true && reply.callback_schema === 5) button.disabled = false;
    else message("Hệ thống gọi lại chưa sẵn sàng. Anh nhắn Zalo hoặc gọi điện bên dưới.");
  }).catch(() => message("Hệ thống gọi lại chưa sẵn sàng. Anh nhắn Zalo hoặc gọi điện bên dưới."));
  else message("Hệ thống gọi lại chưa sẵn sàng. Anh nhắn Zalo hoặc gọi điện bên dưới.");
})();
