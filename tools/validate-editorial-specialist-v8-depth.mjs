import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const policy = JSON.parse(fs.readFileSync(path.resolve("content", "editorial-specialist-v8-policy.json"), "utf8"));
const errors = [];
const stats = {checked: 0, explainers: 0, analyses: 0, decisionReady: 0, evidenceReady: 0, limitsReady: 0};

function visible(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

for (const [slug, rule] of Object.entries(policy)) {
  stats.checked += 1;
  const file = path.join(siteRoot, "bai-viet", slug, "index.html");
  if (!fs.existsSync(file)) { errors.push(`${slug}: thiếu HTML`); continue; }
  const html = fs.readFileSync(file, "utf8");
  const article = html.match(/<article\b[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>[\s\S]*?<\/article>/i)?.[0] || "";
  const copy = article.match(/<!-- specialist-v7:start -->([\s\S]*?)<!-- specialist-v7:end -->/i)?.[1] || "";
  const text = visible(copy);
  const lead = visible(html.match(/<p\b[^>]*class="[^"]*\blead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  const opening = visible(copy.match(/<p\b[^>]*class="[^"]*\bspecialist-v7__opening\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  const ending = visible(copy.match(/<p\b[^>]*class="[^"]*\bspecialist-v7__ending\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");

  for (const fact of rule.mustContain || []) {
    if (!`${lead} ${text}`.includes(fact)) errors.push(`${slug}: thiếu dữ kiện chủ chốt “${fact}”`);
  }

  if (rule.genre === "explainer") {
    stats.explainers += 1;
    const decisionText = `${opening} ${ending}`.toLocaleLowerCase("vi");
    if (!(rule.decisionSignals || []).some((signal) => decisionText.includes(signal.toLocaleLowerCase("vi")))) {
      errors.push(`${slug}: bài giải thích chưa dẫn người đọc tới hành động/quyết định cụ thể`);
    } else stats.decisionReady += 1;
    if (!/[?]|nên|cần|phải|trước khi|khi nào|được phép|quyết định/iu.test(`${lead} ${opening} ${ending}`)) {
      errors.push(`${slug}: bài giải thích chưa trả lời đủ nhu cầu ra quyết định`);
    }
  } else if (rule.genre === "analysis") {
    stats.analyses += 1;
    const numericSignals = `${lead} ${text}`.match(/\b\d+(?:[.,]\d+)?(?:%|\s*(?:triệu|tỷ|tấn|m³|m|lò chợ|người))?/gu) || [];
    if (numericSignals.length < 3) errors.push(`${slug}: bài phân tích cần ít nhất 3 tín hiệu dữ liệu định lượng`);
    else stats.evidenceReady += 1;
    const lower = `${opening} ${text} ${ending}`.toLocaleLowerCase("vi");
    if (!(rule.limitSignals || []).some((signal) => lower.includes(signal.toLocaleLowerCase("vi")))) {
      errors.push(`${slug}: bài phân tích thiếu điều kiện/giới hạn của kết luận`);
    } else stats.limitsReady += 1;
    if (!/người lao động|người mới|ứng viên|nghề|việc làm|tay nghề|an toàn/iu.test(ending)) {
      errors.push(`${slug}: kết bài phân tích chưa chuyển dữ liệu thành hệ quả đối với người đọc`);
    }
  } else {
    errors.push(`${slug}: genre không hợp lệ ${rule.genre}`);
  }

  if (!article.includes('<strong>Nguồn:</strong>')) errors.push(`${slug}: thiếu nguồn cuối bài`);
}

if (stats.checked !== 10 || stats.explainers !== 5 || stats.analyses !== 5) {
  errors.push(`Phân loại v8 phải là 10 bài = 5 explainer + 5 analysis; hiện ${stats.checked}/${stats.explainers}/${stats.analyses}`);
}

console.log(JSON.stringify({...stats, errors: errors.length, sampleErrors: errors.slice(0, 50)}, null, 2));
if (errors.length) process.exitCode = 1;
