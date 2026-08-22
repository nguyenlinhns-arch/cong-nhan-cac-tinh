import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const reportFile = path.join(projectRoot, "content", "editorial-v4-validation.json");
const jsonOutput = path.join(projectRoot, "content", "editorial-v4-learning-queue.json");
const markdownOutput = path.join(projectRoot, "content", "editorial-v4-learning-queue.md");

if (!fs.existsSync(reportFile)) {
  throw new Error("Chưa có content/editorial-v4-validation.json để lập hàng đợi biên tập");
}

const report = JSON.parse(fs.readFileSync(reportFile, "utf8"));
const warnings = Array.isArray(report.sampleWarnings) ? report.sampleWarnings : [];
const errors = Array.isArray(report.sampleErrors) ? report.sampleErrors : [];

const priorityRoutes = [
  [/viec-lam-nganh-than-thang-8-2026/iu, 40, "Bài tuyển sinh trọng điểm"],
  [/phuc-loi-tho-mo-tkv-2026/iu, 35, "Bài trụ cột về phúc lợi"],
  [/tai-co-cau-tkv-2026-viec-lam-tho-mo/iu, 35, "Bài trụ cột về xu hướng ngành"],
  [/dieu-kien-tuyen-tho-lo-2026/iu, 35, "Bài quyết định điều kiện đầu vào"],
  [/ho-so-hoc-nghe-mo-can-gi/iu, 35, "Bài quyết định hành trình đăng ký"],
  [/nghe-tho-lo-co-on-dinh-khong/iu, 30, "Bài phân tích có ảnh hưởng quyết định nghề"],
  [/lo-trinh-di-lam-mo-than/iu, 30, "Bài giải đáp hành trình chuyển đổi"],
  [/chuyen-nguoi-tho/iu, 20, "Nội dung nhân vật cần biên tập thủ công"],
  [/giai-dap-nghe-mo/iu, 15, "Nội dung trả lời trực tiếp người lao động"],
];

const issueRules = [
  [/kể nguồn|Nguồn cho biết|Theo nguồn/iu, 50, "Quy nguồn máy móc", "Viết lại câu theo cấu trúc chủ thể + hành động + thời gian; giữ tên nguồn ở cuối câu hoặc cuối bài."],
  [/quảng cáo|cường điệu|gây áp lực|cam kết tuyệt đối|gây hiểu sai/iu, 50, "Truyền thông quá mức", "Thay lời thúc giục bằng điều kiện, phạm vi và bước kiểm tra cụ thể."],
  [/lặp nguyên|lặp đoạn/iu, 35, "Đoạn lặp", "Giữ đoạn chứa dữ kiện mạnh hơn; viết lại đoạn còn lại theo một chức năng khác."],
  [/đoạn ngắn|đoạn quá cụt/iu, 20, "Đoạn thiếu ý", "Gộp với đoạn liền kề hoặc bổ sung chủ thể, hành động và ý nghĩa của dữ kiện."],
  [/thiếu tên người chịu trách nhiệm/iu, 45, "Thiếu byline", "Bổ sung tên Nguyễn Tử Linh và vai trò biên tập, kiểm chứng nguồn."],
  [/thiếu nhãn thể loại/iu, 25, "Thiếu thể loại", "Phân loại thành tin tức, phân tích, giải đáp hoặc phóng sự – nhân vật."],
  [/thiếu phân định nguồn/iu, 40, "Thiếu phân định trách nhiệm", "Tách nguồn tư liệu khỏi phần phân tích và người chịu trách nhiệm nội dung."],
  [/dòng nguồn/iu, 35, "Dòng nguồn chưa chuẩn", "Chuẩn hóa thành nhãn Nguồn:, tên cơ quan, tên bài hoặc văn bản và thời gian."],
];

function parseMessage(message, level) {
  const raw = String(message || "").trim();
  if (!raw) return null;
  const match = raw.match(/^([^:]+(?:\/[^:]+)*):\s*(.+)$/u);
  const articlePath = match?.[1]?.trim() || "không-xác-định";
  const detail = match?.[2]?.trim() || raw;

  let score = level === "error" ? 100 : 10;
  const reasons = [];
  let issue = level === "error" ? "Lỗi chặn xuất bản" : "Cảnh báo biên tập";
  let action = "Đọc lại toàn bài, xác định chức năng của đoạn và sửa theo cẩm nang biên tập v4.";

  for (const [pattern, points, label, recommendedAction] of issueRules) {
    if (!pattern.test(detail)) continue;
    score += points;
    issue = label;
    action = recommendedAction;
    reasons.push(label);
    break;
  }

  for (const [pattern, points, reason] of priorityRoutes) {
    if (!pattern.test(articlePath)) continue;
    score += points;
    reasons.push(reason);
  }

  return {
    path: articlePath,
    level,
    score,
    issue,
    detail,
    recommendedAction: action,
    priorityReasons: reasons,
  };
}

const rawItems = [
  ...errors.map((message) => parseMessage(message, "error")),
  ...warnings.map((message) => parseMessage(message, "warning")),
].filter(Boolean);

const grouped = new Map();
for (const item of rawItems) {
  const current = grouped.get(item.path) || {
    path: item.path,
    level: "warning",
    score: 0,
    issues: [],
    recommendedActions: [],
    priorityReasons: [],
  };
  if (item.level === "error") current.level = "error";
  current.score = Math.max(current.score, item.score);
  current.issues.push({type: item.issue, detail: item.detail});
  if (!current.recommendedActions.includes(item.recommendedAction)) current.recommendedActions.push(item.recommendedAction);
  for (const reason of item.priorityReasons) if (!current.priorityReasons.includes(reason)) current.priorityReasons.push(reason);
  grouped.set(item.path, current);
}

const queue = [...grouped.values()]
  .map((item) => ({
    ...item,
    priority: item.score >= 120 ? "P0" : item.score >= 80 ? "P1" : item.score >= 45 ? "P2" : "P3",
  }))
  .sort((left, right) => right.score - left.score || left.path.localeCompare(right.path, "vi"));

const output = {
  version: 4,
  validationStatus: report.status || "unknown",
  checkedArticles: Number(report.checked || 0),
  blockingErrors: Number(report.errors || 0),
  warnings: Number(report.warnings || 0),
  queuedArticles: queue.length,
  queue,
};

fs.mkdirSync(path.dirname(jsonOutput), {recursive: true});
fs.writeFileSync(jsonOutput, `${JSON.stringify(output, null, 2)}\n`);

const lines = [
  "# Hàng đợi học tập biên tập v4",
  "",
  `- Trạng thái kiểm định: **${output.validationStatus}**`,
  `- Số bài đã kiểm tra: **${output.checkedArticles}**`,
  `- Lỗi chặn xuất bản: **${output.blockingErrors}**`,
  `- Cảnh báo: **${output.warnings}**`,
  `- Số bài cần xem lại: **${output.queuedArticles}**`,
  "",
  "## Thứ tự xử lý",
  "",
];

if (!queue.length) {
  lines.push("Không còn bài nào trong hàng đợi cảnh báo. Tiếp tục kiểm tra mẫu ngẫu nhiên và cập nhật cẩm nang khi xuất hiện dạng lỗi mới.");
} else {
  for (const [index, item] of queue.entries()) {
    lines.push(`### ${index + 1}. ${item.priority} – ${item.path}`);
    lines.push("");
    lines.push(`- Điểm ưu tiên: ${item.score}`);
    lines.push(`- Mức: ${item.level}`);
    if (item.priorityReasons.length) lines.push(`- Lý do ưu tiên: ${item.priorityReasons.join("; ")}`);
    lines.push("- Vấn đề:");
    for (const issue of item.issues) lines.push(`  - ${issue.type}: ${issue.detail}`);
    lines.push("- Hướng sửa:");
    for (const action of item.recommendedActions) lines.push(`  - ${action}`);
    lines.push("");
  }
}

fs.writeFileSync(markdownOutput, `${lines.join("\n")}\n`);

console.log(JSON.stringify({
  status: "editorial-learning-queue-v4-ready",
  queuedArticles: queue.length,
  p0: queue.filter((item) => item.priority === "P0").length,
  p1: queue.filter((item) => item.priority === "P1").length,
  p2: queue.filter((item) => item.priority === "P2").length,
  p3: queue.filter((item) => item.priority === "P3").length,
}, null, 2));
