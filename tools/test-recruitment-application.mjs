import fs from "node:fs";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const source = fs.readFileSync("tuyen-tho-mo/job-application.js", "utf8");

async function runCase({ height, weight = 47, birthDate = "2000-01-01", health, expected, utmSource = "test_qa", referrer = "", expectedSource = utmSource || "website", deliverySequence = ["saved"], draftSeed = null, blankSafeFields = false }) {
  const listeners = {};
  const tracked = [];
  const delivered = [];
  const stored = new Map();
  if (draftSeed) stored.set("thaylinh_application_draft_v1", JSON.stringify({ saved_at: new Date().toISOString(), values: draftSeed }));
  const values = {
    full_name: "Nguyễn Văn Kiểm Thử",
    phone: "+84 963 048 585",
    birth_date: birthDate,
    province: "",
    height: blankSafeFields ? "" : String(height),
    weight: blankSafeFields ? "" : String(weight),
    education: blankSafeFields ? "" : "Tốt nghiệp THPT",
    trade: "",
    health,
    website: "",
    consent: "on",
  };

  const makeElement = extra => ({
    hidden: true,
    dataset: {},
    attributes: {},
    textContent: "",
    value: "",
    href: "",
    title: "",
    addEventListener(type, handler) { this.listeners ||= {}; this.listeners[type] = handler; },
    focus() { this.focusCount = (this.focusCount || 0) + 1; },
    select() {},
    scrollIntoView() { this.scrollCount = (this.scrollCount || 0) + 1; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    removeAttribute(name) { delete this.attributes[name]; },
    getAttribute(name) { return this.attributes[name] ?? null; },
    ...extra,
  });
  const fields = Object.fromEntries(Object.keys(values).map(name => [name, makeElement({ name, value: values[name] })]));
  fields.province.options = [{ value: "" }, { value: "Hồ Chí Minh" }, { value: "An Giang" }];
  fields.trade.options = [{ value: "" }, { value: "Kỹ thuật khai thác mỏ hầm lò" }, { value: "Kỹ thuật xây dựng mỏ hầm lò" }];

  const form = makeElement({
    elements: { namedItem: name => fields[name] },
    reportValidity: () => true,
    addEventListener(type, handler) { listeners[type] = handler; },
  });
  const result = makeElement();
  const output = makeElement();
  const error = makeElement();
  const status = makeElement();
  const code = makeElement();
  const sms = makeElement();
  const submit = makeElement();
  const delivery = makeElement();
  const draftStatus = makeElement();
  const selectors = new Map([
    ["[data-application-form]", form],
    ["[data-application-result]", result],
    ["[data-application-message]", output],
    ["[data-form-error]", error],
    ["[data-birth-date]", fields.birth_date],
    ["[data-application-status]", status],
    ["[data-application-code]", code],
    ["[data-sms-application]", sms],
    ["[data-application-submit]", submit],
    ["[data-application-delivery]", delivery],
    ["[data-application-draft-status]", draftStatus],
  ]);

  const context = {
    console,
    URL,
    URLSearchParams,
    Uint8Array,
    encodeURIComponent,
    location: {
      href: `https://thaylinhtuyenthomo.vn/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/${utmSource ? `?utm_source=${encodeURIComponent(utmSource)}` : ""}`,
      search: `?province=Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh&trade=K%E1%BB%B9%20thu%E1%BA%ADt%20khai%20th%C3%A1c%20m%E1%BB%8F%20h%E1%BA%A7m%20l%C3%B2${utmSource ? `&utm_source=${encodeURIComponent(utmSource)}` : ""}&utm_medium=owned&utm_campaign=tuyen_tho_mo_2026&utm_content=unit`,
    },
    document: {
      referrer,
      querySelector: selector => selectors.get(selector) || null,
      execCommand: () => true,
    },
    navigator: {},
    localStorage: {
      getItem: key => stored.get(key) || null,
      setItem: (key, value) => stored.set(key, value),
      removeItem: key => stored.delete(key),
    },
    FormData: class FormData {
      entries() {
        return Object.entries(fields).map(([name, field]) => [name, field.value])[Symbol.iterator]();
      }
    },
    setTimeout,
    clearTimeout,
    AbortController,
    fetch: async (_url, options) => {
      const payload = JSON.parse(options.body);
      const outcome = deliverySequence[Math.min(delivered.length, deliverySequence.length - 1)];
      delivered.push(payload);
      if (outcome === "failed") throw new Error("Simulated delivery failure");
      return { ok: true, json: async () => ({ ok: true, code: payload.code }) };
    },
  };
  context.window = {
    crypto: webcrypto,
    matchMedia: () => ({ matches: false }),
    tlTrack: (name, payload) => tracked.push([name, payload]),
    setTimeout,
    clearTimeout,
    thayLinhAnalytics: { measurementId: () => "tl-test-measurement-12345" },
    THAY_LINH_RECRUITMENT: {
      schemaVersion: 2,
      endpoint: "https://example.test/exec",
      timeoutMs: 12000,
      criteria: { ageMin: 18, ageMax: 40, heightMinCm: 153, weightMinKg: 47 },
    },
  };

  vm.runInNewContext(source, context, { filename: "job-application.js" });
  if (fields.province.value !== "Hồ Chí Minh") throw new Error(`Province prefill failed: ${fields.province.value}`);
  if (fields.trade.value !== "Kỹ thuật khai thác mỏ hầm lò") throw new Error(`Trade prefill failed: ${fields.trade.value}`);
  if (draftSeed) {
    if (fields.height.value !== String(draftSeed.height) || fields.weight.value !== String(draftSeed.weight) || fields.education.value !== draftSeed.education) throw new Error("Safe draft fields were not restored");
    if (draftStatus.dataset.restored !== "true") throw new Error("Draft restoration was not disclosed to the applicant");
    if (!tracked.some(([name]) => name === "ApplicationDraftRestore")) throw new Error("Draft restoration was not measured");
  }

  await listeners.input({ target: fields.full_name });
  await listeners.submit({ preventDefault() {} });

  const firstCode = code.textContent;
  if (deliverySequence[0] === "failed") {
    if (delivery.dataset.state !== "fallback") throw new Error(`Expected fallback delivery, got ${delivery.dataset.state}`);
    if (submit.disabled || submit.textContent !== "Thử gửi lại cùng mã") throw new Error("Failed delivery did not offer a stable-code retry");
    const safeDraft = stored.get("thaylinh_application_draft_v1") || "";
    for (const pii of ["Nguyễn Văn Kiểm Thử", "0963048585", birthDate, health, "consent"]) {
      if (safeDraft.includes(pii)) throw new Error(`Draft contains excluded personal data: ${pii}`);
    }
    await listeners.submit({ preventDefault() {} });
    if (code.textContent !== firstCode) throw new Error("Retry generated a different application code");
    if (delivered.length !== 2 || delivered[0].code !== delivered[1].code) throw new Error("Retry payload was not idempotent");
  }

  if (result.hidden) throw new Error("Result was not shown");
  if (result.dataset.eligibility !== expected) throw new Error(`Expected ${expected}, got ${result.dataset.eligibility}`);
  if (!/^TL-\d{6}-[A-Z0-9]{5}$/.test(code.textContent)) throw new Error(`Invalid application code: ${code.textContent}`);
  for (const expectedText of [
    "Số điện thoại: 0963048585",
    `Nguồn: ${expectedSource} / unit`,
    "2–3 tháng",
    "7,5 triệu đồng",
  ]) if (!output.value.includes(expectedText)) throw new Error(`Message missing: ${expectedText}`);
  if (!sms.href.startsWith("sms:+84963048585?body=")) throw new Error(`Invalid SMS link: ${sms.href}`);
  if (delivered.length !== deliverySequence.length || delivered[0].phone !== "0963048585") throw new Error("Application was not delivered as expected");
  if (delivered[0].schema_version !== 2) throw new Error(`Unexpected schema version: ${delivered[0].schema_version}`);
  if (delivered[0].measurement_client_id !== "tl-test-measurement-12345") throw new Error("Anonymous measurement key was not delivered");
  if (!String(delivered[0].form_context || "").startsWith("central_application|v3;")) throw new Error(`Unexpected form context: ${delivered[0].form_context}`);
  if (delivered[0].entry_intent !== "application" || delivered[0].journey_page_count !== 1) throw new Error("Journey context was not delivered");
  if (delivered[0].website !== "") throw new Error("Honeypot value must remain empty");
  if (delivery.dataset.state !== "saved") throw new Error(`Unexpected delivery state: ${delivery.dataset.state}`);
  if (!submit.disabled || submit.textContent !== "Đăng ký đã được tiếp nhận") throw new Error("Successful form was not locked after delivery");
  if (form.getAttribute("aria-busy") !== null || result.getAttribute("aria-busy") !== null) throw new Error("Busy state remained after delivery");
  if (result.focusCount !== 1 || result.scrollCount !== 1) throw new Error("Result was not revealed and focused exactly once");

  for (const event of ["ApplicationStart", "ApplicationProgress", "ApplicationSubmit", "Lead"]) {
    if (!tracked.some(([name]) => name === event)) throw new Error(`Missing analytics event: ${event}`);
  }
  const progress = tracked.find(([name]) => name === "ApplicationProgress")?.[1];
  if (progress?.step !== "01_identity" || progress?.field_group !== "identity") throw new Error("Anonymous application progress was not measured correctly");
  for (const eventName of ["ApplicationSubmit", "Lead"]) {
    const eventPayload = tracked.find(([name]) => name === eventName)?.[1];
    if (eventPayload?.lead_key !== code.textContent) throw new Error(`${eventName} is missing the anonymous lead key`);
  }
  if (deliverySequence[0] !== "failed" && tracked.some(([name]) => name === "ApplicationDeliveryFailure")) throw new Error("Failure event fired for a successful delivery");

  if (deliverySequence[0] === "failed") {
    if (tracked.filter(([name]) => name === "Lead").length !== 1) throw new Error("Retry counted the same lead more than once");
    if (tracked.filter(([name]) => name === "ApplicationSubmit").length !== 2) throw new Error("Retry attempt was not measured");
    if (tracked.filter(([name]) => name === "ApplicationDeliveryFailure").length !== 1) throw new Error("Failed first attempt was not measured once");
  }

  const trackingJson = JSON.stringify(tracked);
  for (const pii of ["Nguyễn Văn Kiểm Thử", "0963048585", birthDate, "Hồ Chí Minh", String(height), String(weight)]) {
    if (trackingJson.includes(pii)) throw new Error(`Tracking contains personal data: ${pii}`);
  }
  const storedApplication = stored.get("thaylinh_last_application") || "";
  for (const pii of ["Nguyễn Văn Kiểm Thử", "0963048585", "2000-01-01", "Hồ Chí Minh"]) {
    if (storedApplication.includes(pii)) throw new Error(`Local metadata contains personal data: ${pii}`);
  }
  if (stored.has("thaylinh_application_draft_v1")) throw new Error("Successful delivery did not clear the local draft");

  return { expected, code: code.textContent, delivery: delivery.dataset.state, events: tracked.map(([name]) => name) };
}

const results = [];
if (/navigator\.clipboard|data-copy-application|ApplicationCopy/.test(source)) throw new Error("Application flow must not copy to the clipboard");
results.push(await runCase({ height: 153, weight: 47, health: "Sức khỏe tốt, sẵn sàng khám tuyển", expected: "eligible" }));
results.push(await runCase({ height: 165, weight: 58, health: "Cần trao đổi thêm trước khi khám", expected: "needs_review" }));
results.push(await runCase({ height: 152, weight: 47, health: "Sức khỏe tốt, sẵn sàng khám tuyển", expected: "not_eligible" }));
results.push(await runCase({ height: 165, weight: 58, birthDate: "1980-01-01", health: "Sức khỏe tốt, sẵn sàng khám tuyển", expected: "not_eligible" }));
results.push(await runCase({ height: 165, weight: 58, health: "Sức khỏe tốt, sẵn sàng khám tuyển", expected: "eligible", utmSource: "", referrer: "https://chatgpt.com/", expectedSource: "chatgpt" }));
results.push(await runCase({ height: 165, weight: 58, health: "Sức khỏe tốt, sẵn sàng khám tuyển", expected: "eligible", deliverySequence: ["failed", "saved"] }));
results.push(await runCase({
  height: 165,
  weight: 58,
  health: "Sức khỏe tốt, sẵn sàng khám tuyển",
  expected: "eligible",
  blankSafeFields: true,
  draftSeed: { province: "An Giang", height: "165", weight: "58", education: "Tốt nghiệp THPT", trade: "Kỹ thuật xây dựng mỏ hầm lò" },
}));
console.log(JSON.stringify({ cases: results.length, results, errors: 0 }, null, 2));
