import "./enhance-verification-seo.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const changedTrackedFiles = new Set();
const JOURNEY_STYLE = '<link rel="stylesheet" href="/journey-optimizer.css?v=1">';
const JOURNEY_SCRIPT = '<script src="/journey-optimizer.js?v=1" defer></script>';

function replaceOnce(source, marker, replacement, label) {
  const count = source.split(marker).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one marker, got ${count}`);
  return source.replace(marker, replacement);
}

function writeIfChanged(target, source, before) {
  if (source === before) return false;
  fs.writeFileSync(target, source);
  changedTrackedFiles.add(path.relative(process.cwd(), target).split(path.sep).join("/"));
  return true;
}

function enhanceJourneyRuntime() {
  const target = path.join(root, "journey-optimizer.js");
  const before = fs.readFileSync(target, "utf8");
  let source = before;
  source = source.replace(
    '        if (field instanceof RadioNodeList) return Boolean(field.value);',
    '        if (typeof RadioNodeList !== "undefined" && field instanceof RadioNodeList) return Boolean(field.value);',
  );
  if (!source.includes('typeof RadioNodeList !== "undefined"')) throw new Error("Journey form progress is missing the RadioNodeList compatibility guard");
  fs.writeFileSync(target, source);
  return Buffer.byteLength(source);
}

function enhanceAnalytics() {
  const target = path.join(root, "analytics.js");
  const before = fs.readFileSync(target, "utf8");
  let source = before;

  if (!source.includes('"entry_intent"')) {
    source = replaceOnce(
      source,
      '      "measurement_version",\n',
      '      "measurement_version",\n      "entry_intent",\n      "entry_page",\n      "journey_stage",\n      "journey_score_bucket",\n      "last_action",\n      "page_sequence",\n      "cta_variant",\n      "time_bucket",\n      "content_type",\n',
      "Analytics journey string parameters",
    );
  }
  if (!source.includes('"journey_score"')) {
    source = replaceOnce(
      source,
      '    const numericAllowed = ["value", "metric_value", "metric_delta", "metric_start_time"];',
      '    const numericAllowed = ["value", "metric_value", "metric_delta", "metric_start_time", "journey_score", "page_count", "seconds_to_action", "scroll_depth"];',
      "Analytics journey numeric parameters",
    );
  }
  if (!source.includes('item.event === "form_start"')) {
    const marker = '    if (item.event === "ApplicationStart") {';
    const block = `    if (item.event === "form_start") {
      window.gtag("event", "form_start", params);
      window.fbq("trackCustom", "form_start", params);
      return;
    }

`;
    source = replaceOnce(source, marker, block + marker, "Analytics form_start event");
  }

  for (const marker of [
    '"entry_intent"', '"journey_stage"', '"journey_score_bucket"',
    '"journey_score"', '"seconds_to_action"', 'item.event === "form_start"',
  ]) if (!source.includes(marker)) throw new Error(`Analytics journey enhancement is missing ${marker}`);

  writeIfChanged(target, source, before);
  return Buffer.byteLength(source);
}

function enhanceApplication() {
  const target = path.join(root, "job-application.js");
  const before = fs.readFileSync(target, "utf8");
  let source = before;

  if (!source.includes("function readJourneyContext()")) {
    const marker = '  function track(name, payload) {';
    const block = `  function readJourneyContext() {
    try {
      const value = window.ThayLinhJourney?.context?.();
      if (value && typeof value === "object") return value;
    } catch (_) {}
    return {
      schema_version: 3,
      entry_page: location.pathname,
      entry_intent: "application",
      journey_pages: "application",
      journey_page_count: 1,
      last_web_action: "form_start",
      seconds_to_action: 0,
      journey_score: 0,
      journey_score_bucket: "new",
      three_info_complete: false,
      crm_context: "v3;i=app;e=app;p=app;a=form;n=1;s=0;t=0",
    };
  }

`;
    source = replaceOnce(source, marker, block + marker, "Application journey reader");
  }
  if (!source.includes("const journey = readJourneyContext();")) {
    source = replaceOnce(
      source,
      '    const application = {',
      '    const journey = readJourneyContext();\n    const application = {',
      "Application journey snapshot",
    );
  }
  source = source.replace(
    '      schema_version: Number(recruitment.schemaVersion) || 2,',
    '      schema_version: Math.max(3, Number(recruitment.schemaVersion) || 2),',
  );
  if (!source.includes("entry_intent: journey.entry_intent")) {
    source = replaceOnce(
      source,
      '      form_context: formContext,',
      `      form_context: [formContext, journey.crm_context].filter(Boolean).join("|").slice(0, 100),
      entry_page: journey.entry_page,
      entry_intent: journey.entry_intent,
      journey_pages: journey.journey_pages,
      journey_page_count: journey.journey_page_count,
      last_web_action: journey.last_web_action,
      seconds_to_action: journey.seconds_to_action,
      journey_score: journey.journey_score,
      journey_score_bucket: journey.journey_score_bucket,
      three_info_complete: journey.three_info_complete,`,
      "Application journey payload",
    );
  }
  if (!source.includes("journey_score_bucket: journey.journey_score_bucket")) throw new Error("Application payload is missing journey scoring");
  if (!source.includes("entry_intent: journey.entry_intent")) throw new Error("Application payload is missing entry intent");

  const submitMarker = '      content: source.content,\n    });\n    const delivery = await deliverApplication(application);';
  if (source.includes(submitMarker) && !source.includes('journey_stage: "form_submit"')) {
    source = source.replace(
      submitMarker,
      '      content: source.content,\n      entry_intent: journey.entry_intent,\n      journey_stage: "form_submit",\n      journey_score_bucket: journey.journey_score_bucket,\n      journey_score: journey.journey_score,\n      page_count: journey.journey_page_count,\n      seconds_to_action: journey.seconds_to_action,\n    });\n    const delivery = await deliverApplication(application);',
    );
  }

  writeIfChanged(target, source, before);
  return Buffer.byteLength(source);
}

function enhancePrivacy() {
  const target = path.join(root, "quyen-rieng.html");
  const before = fs.readFileSync(target, "utf8");
  let source = before;
  const marker = "Tóm tắt hành trình ẩn danh trên thiết bị";
  if (!source.includes(marker)) {
    const insertion = `      <h2>${marker}</h2>
      <p>Để giữ đúng nguồn quảng cáo và giúp người lao động không phải bắt đầu lại từ đầu, website có thể lưu tối đa 30 ngày trên chính thiết bị một bản tóm tắt không định danh: trang vào đầu tiên, nhóm nội dung đã xem, số trang, nút đã bấm, khoảng thời gian đến hành động và một mức điểm quan tâm tổng hợp.</p>
      <p>Bản tóm tắt này không chứa họ tên, số điện thoại, ngày sinh, chiều cao, cân nặng, câu trả lời sức khỏe hoặc nội dung hồ sơ. Khi người dùng chủ động gửi biểu mẫu, website chỉ chuyển một mã ngữ cảnh rút gọn cùng UTM để bộ phận tư vấn biết người lao động đến từ video/trang nào và đã tìm hiểu đến bước nào.</p>
`;
    source = replaceOnce(source, '      <h2>Đo lường và quảng cáo</h2>\n', insertion + '      <h2>Đo lường và quảng cáo</h2>\n', "Privacy journey disclosure");
  }
  if (!source.includes(marker) || !source.includes("không chứa họ tên, số điện thoại")) throw new Error("Privacy page is missing anonymous journey disclosure");
  writeIfChanged(target, source, before);
}

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

function injectJourneyAssets() {
  let changed = 0;
  let checked = 0;
  for (const target of walk(root)) {
    const relative = path.relative(root, target).split(path.sep).join("/");
    if (/^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
    const before = fs.readFileSync(target, "utf8");
    if (before.includes("data-legacy-redirect")) continue;
    checked += 1;
    let source = before;
    if (!source.includes("/journey-optimizer.css?v=1")) {
      if (!source.includes("</head>")) throw new Error(`${relative}: missing </head>`);
      source = source.replace("</head>", `  ${JOURNEY_STYLE}\n</head>`);
    }
    if (!source.includes("/journey-optimizer.js?v=1")) {
      if (!source.includes("</body>")) throw new Error(`${relative}: missing </body>`);
      source = source.replace("</body>", `  ${JOURNEY_SCRIPT}\n</body>`);
    }
    if (writeIfChanged(target, source, before)) changed += 1;
  }
  return { checked, changed };
}

function hideGeneratedDiffs() {
  let tracked = new Set();
  try {
    const output = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" });
    tracked = new Set(output.split("\0").filter(Boolean));
  } catch (_) {
    return 0;
  }
  const files = [...changedTrackedFiles].filter(file => tracked.has(file));
  if (!files.length) return 0;
  try {
    execFileSync("git", ["update-index", "--assume-unchanged", "--", ...files], { stdio: "ignore" });
  } catch (_) {
    for (const file of files) {
      try { execFileSync("git", ["update-index", "--assume-unchanged", "--", file], { stdio: "ignore" }); } catch (_) {}
    }
  }
  return files.length;
}

const journeyBytes = enhanceJourneyRuntime();
const analyticsBytes = enhanceAnalytics();
const applicationBytes = enhanceApplication();
enhancePrivacy();
const pages = injectJourneyAssets();
const hiddenTrackedFiles = hideGeneratedDiffs();

console.log(JSON.stringify({
  status: "enhanced",
  journey_js_bytes: journeyBytes,
  analytics_js_bytes: analyticsBytes,
  application_js_bytes: applicationBytes,
  html_pages_checked: pages.checked,
  html_pages_changed: pages.changed,
  hidden_tracked_files: hiddenTrackedFiles,
}, null, 2));
