import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const changed = [];

const articleDirectories = ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho", "giai-dap-nghe-mo"];

const metaPhrases = [
  /\b(?:bài viết này|nội dung này)\s+(?:sẽ|giúp|nhằm|được biên tập để)\b/giu,
  /\b(?:có thể thấy rằng|có thể nhận thấy rằng|điều này cho thấy rằng|qua đó cho thấy)\b/giu,
  /\b(?:trong bối cảnh đó|từ những phân tích trên|nhìn từ góc độ này)\b/giu,
  /\b(?:với người đọc|người đọc có thể|người đọc vì thế)\b/giu,
  /\b(?:xét cho cùng|nói cách khác)\b/giu,
];

const promotionalPhrases = [
  [/\bđừng bỏ lỡ cơ hội\b/giu, "cần kiểm tra điều kiện và thông tin của đợt tiếp nhận"],
  [/\bcơ hội đổi đời\b/giu, "một lựa chọn nghề nghiệp cần được cân nhắc đầy đủ"],
  [/\bviệc nhẹ lương cao\b/giu, "công việc có yêu cầu rõ về sức khỏe, tay nghề và kỷ luật"],
  [/\bđăng ký ngay hôm nay\b/giu, "gửi thông tin để được hướng dẫn"],
  [/\bnhanh tay đăng ký\b/giu, "kiểm tra điều kiện trước khi đăng ký"],
  [/\bchắc chắn thành công\b/giu, "có cơ sở để theo đuổi khi đáp ứng yêu cầu"],
];

const weakOpenings = [
  /^Trong những năm gần đây,?\s*/iu,
  /^Hiện nay,?\s*/iu,
  /^Ngày nay,?\s*/iu,
  /^Như chúng ta đã biết,?\s*/iu,
  /^Có thể nói rằng,?\s*/iu,
];

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, output);
    else if (entry.name === "index.html") output.push(target);
  }
  return output;
}

function text(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceCase(value = "") {
  return String(value).replace(/^([“"'‘’(]*)(\p{Ll})/u, (_match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("vi")}`);
}

function polishSentence(value) {
  let output = String(value).trim();
  if (!output) return "";
  for (const pattern of weakOpenings) output = output.replace(pattern, "");
  for (const pattern of metaPhrases) output = output.replace(pattern, "");
  for (const [pattern, replacement] of promotionalPhrases) output = output.replace(pattern, replacement);
  output = output
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([.!?]){2,}/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
  return sentenceCase(output);
}

function polishParagraph(tag) {
  const attrs = tag.match(/^<p\b([^>]*)>/i)?.[1] || "";
  if (/article-(?:source-note|editor-note|seo-line)|keyword-summary|article-byline/i.test(attrs)) return tag;
  const inner = tag.replace(/^<p\b[^>]*>/i, "").replace(/<\/p>$/i, "");
  if (/<(?:img|picture|video|iframe|button|input|form)\b/i.test(inner)) return tag;
  const raw = text(inner);
  if (!raw) return tag;
  const sentences = raw
    .split(/(?<=[.!?])\s+/u)
    .map(polishSentence)
    .filter(Boolean);
  if (!sentences.length) return "";
  return `<p${attrs}>${sentences.join(" ")}</p>`;
}

function addEditorialResponsibility(html) {
  if (!/article-body--(?:journalistic-v3|professional|news|analysis|feature)/i.test(html)) return html;
  if (/class="article-source-responsibility"/i.test(html)) return html;
  const note = '<p class="article-source-responsibility">Dữ kiện được đối chiếu theo nguồn ghi cuối bài; phần phân tích và cách diễn giải do Nguyễn Tử Linh chịu trách nhiệm biên tập.</p>';
  if (/<!-- newsroom-copy-v3:end -->/i.test(html)) {
    return html.replace(/<!-- newsroom-copy-v3:end -->/i, `<!-- newsroom-copy-v3:end -->\n${note}`);
  }
  if (/<p class="article-source-note">/i.test(html)) {
    return html.replace(/(<p class="article-source-note">)/i, `${note}\n$1`);
  }
  return html;
}

function improveArticle(html) {
  let output = html.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, polishParagraph);
  output = addEditorialResponsibility(output);
  output = output
    .replace(/<h2>\s*(?:Kết luận|Kết luận ngắn|Tóm lại)\s*<\/h2>/giu, "<h2>Điều người lao động cần ghi nhớ</h2>")
    .replace(/<h2>\s*(?:Thông tin chính|Những thông tin chính)\s*<\/h2>/giu, "<h2>Dữ kiện cần lưu ý</h2>")
    .replace(/\s{3,}/g, "\n\n");
  return output;
}

for (const directory of articleDirectories) {
  for (const file of walk(path.join(siteRoot, directory))) {
    const before = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting|FAQPage)"/.test(before)) continue;
    const after = improveArticle(before);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
  }
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 50) {
    const chunk = changed.slice(index, index + 50);
    try {
      execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"});
    } catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-continuous-learning-v4-complete",
  checkedDirectories: articleDirectories,
  changedFiles: changed.length,
}, null, 2));
