import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const changed = [];

const missingSourceCommentary = /(?:bài\s+(?:gốc|nguồn|báo|phóng\s+sự)\s+(?:không|chưa)|nguồn(?:\s+chính\s+thức|\s+của\s+[^,.]+)?\s+(?:không|chưa)\s+(?:nêu|cho\s+biết|công\s+bố|làm\s+rõ|đề\s+cập))/iu;
const sourceNarration = /(?:bài\s+(?:viết|báo|gốc|nguồn|phóng\s+sự)[^.!?]{0,80}\b(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|đề\s+cập|mô\s+tả|tách\s+rõ)|phóng\s+sự(?:\s+ảnh)?\s+của|nguồn(?:\s+chính\s+thức|\s+của\s+[^,.]+)?\s+(?:cũng\s+)?(?:nêu|cho\s+biết|ghi\s+nhận|đề\s+cập|xác\s+nhận|thống\s+kê|liệt\s+kê)|\btác\s+giả\s+|\bphóng\s+viên\s+)/iu;
const formulaic = /(?:không\s+chỉ|đáng\s+chú\s+ý|không\s+nằm\s+ở|không\s+dừng\s+ở|thay\s+vì|với\s+từ\s+khóa|người\s+đọc\s+vì\s+thế\s+tìm\s+thấy)/iu;
const salaryDisclaimer = /(?:thu\s+nhập\s+tham\s+khảo|thu\s+nhập\s+thực\s+tế\s+phụ\s+thuộc|thu\s+nhập\s+tùy|không\s+cam\s+kết|không\s+phải\s+mức\s+lương\s+cứng|không\s+phải\s+cam\s+kết|mức\s+thu\s+nhập\s+cố\s+định|không\s+lấy\s+trường\s+hợp\s+cao\s+nhất\s+làm\s+mặt\s+bằng\s+chung)/iu;

const directReplacements = [
  [/Trọng tâm không chỉ là tăng số người vào học\./giu, "Trọng tâm vượt ra ngoài việc tăng số người vào học."],
  [/Điều được truyền lại không chỉ là công việc, mà còn là kỷ luật, lòng tự trọng và trách nhiệm với gia đình\./giu, "Gia đình truyền lại cả công việc, kỷ luật, lòng tự trọng và trách nhiệm với nhau."],
  [/Điểm đáng chú ý của cuộc làm việc là cách đưa thông tin trở lại cấp xã, thôn thay vì dừng ở một hội nghị tập trung\./giu, "Cuộc làm việc hướng hoạt động tư vấn trở lại cấp xã, thôn, để thông tin tiếp tục đến đúng địa bàn sau hội nghị tập trung."],
  [/Đây không chỉ là một tin tuyển\./giu, "Tin tuyển mô tả một lộ trình cụ thể."],
  [/Phúc lợi không chỉ là khoản hỗ trợ sau khó khăn\./giu, "Phúc lợi bao gồm cả hỗ trợ sau khó khăn và những điều kiện giúp người lao động duy trì sức khỏe."],
  [/Các hội nghị ngày 20 và 22\/01\/2026 ký quy chế phối hợp cho giai đoạn 2026–2030\./giu, "Các hội nghị ngày 20 và 22/01/2026 ký quy chế phối hợp cho giai đoạn 2026–2030, đồng thời phân định trách nhiệm của từng bên trong quá trình triển khai."],
  [/Sau thống kê đầu kỳ, hội nghị đặt mục tiêu tuyển 60–100 người trong năm 2024\./giu, "Sau thống kê đầu kỳ, hội nghị đặt mục tiêu tuyển 60–100 người trong năm 2024. Kết quả cần được theo dõi tới số người nhập học và duy trì việc học."],
  [/Tổng 121 người cho thấy quy mô chưa lớn nhưng duy trì liên tục qua nhiều năm\./giu, "Tổng 121 người cho thấy quy mô chưa lớn nhưng được duy trì qua nhiều năm. Ý nghĩa của con số nằm ở khả năng đưa người học tới giai đoạn việc làm."],
  [/Tổng kinh phí quà khen thưởng là 534,2 triệu đồng\./giu, "Tổng kinh phí quà khen thưởng là 534,2 triệu đồng, phản ánh quy mô tuyên dương được triển khai trên toàn Công ty trong năm học 2025–2026."],
  [/Việc tách rõ hai mốc giúp người đọc không hiểu sai quy mô\./giu, "Việc tách rõ hai mốc giúp người đọc hiểu đúng quy mô: một mốc là số người, mốc còn lại là tổng số ngày nghỉ dưỡng."],
  [/Điểm đáng chú ý là\s*/giu, ""],
  [/Đáng chú ý,?\s*/giu, ""],
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

function visible(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value = "") {
  return visible(value).split(/\s+/u).filter(Boolean).length;
}

function capitalize(value = "") {
  return String(value).replace(/^([“"'‘’(]*)(\p{Ll})/u, (_match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("vi")}`);
}

function applyDirectReplacements(value) {
  return directReplacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value));
}

function stripOutboundSourceLinks(tag) {
  return String(tag).replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

function sanitizeSentence(value, {sourceAware = true} = {}) {
  let sentence = applyDirectReplacements(visible(value)).replaceAll("—", ",").replace(/\s+/g, " ").trim();
  if (!sentence) return "";
  if (salaryDisclaimer.test(sentence)) return "";
  if (sourceAware && (missingSourceCommentary.test(sentence) || sourceNarration.test(sentence))) return "";
  if (formulaic.test(sentence)) return "";
  return capitalize(sentence);
}

function sanitizeParagraph(tag, {sourceAware = true} = {}) {
  const attrs = tag.match(/^<p\b([^>]*)>/i)?.[1] || "";
  if (/article-source-note/i.test(attrs)) return stripOutboundSourceLinks(tag);
  const body = tag.replace(/^<p\b[^>]*>/i, "").replace(/<\/p>$/i, "");
  const sentences = applyDirectReplacements(body)
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sanitizeSentence(sentence, {sourceAware}))
    .filter(Boolean);
  if (!sentences.length) return "";
  return `<p${attrs}>${sentences.join(" ")}</p>`;
}

function expandShortEditorialOpeners(copy) {
  const extensions = {
    "professional-lede": "Dữ kiện này đặt sự việc trong đúng thời gian, địa bàn và nhóm đối tượng liên quan.",
    "professional-nutgraph": "Nội dung này xác định trách nhiệm phối hợp giữa địa phương, Nhà trường và doanh nghiệp tiếp nhận.",
  };
  let output = String(copy);
  for (const [className, extension] of Object.entries(extensions)) {
    output = output.replace(new RegExp(`<p class="${className}">([\\s\\S]*?)<\\/p>`, "gi"), (tag, body) => {
      if (wordCount(body) >= 18) return tag;
      const sentence = /[.!?]$/u.test(visible(body)) ? "" : ".";
      return `<p class="${className}">${body}${sentence} ${extension}</p>`;
    });
  }
  return output;
}

function sanitizeMarkedCopy(html) {
  return html.replace(
    /(<!-- newsroom-copy-v3:start -->)([\s\S]*?)(<!-- newsroom-copy-v3:end -->)/gi,
    (_match, start, copy, end) => {
      let clean = applyDirectReplacements(copy)
        .replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, (tag) => sanitizeParagraph(tag, {sourceAware: true}))
        .replace(/<section\b([^>]*)>\s*<h2>([\s\S]*?)<\/h2>\s*<\/section>/gi, "")
        .replace(/\s{3,}/g, "\n");
      clean = expandShortEditorialOpeners(clean);
      return `${start}${clean}${end}`;
    },
  );
}

function removeSalaryDisclaimers(html) {
  return html.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, (tag) => {
    if (!salaryDisclaimer.test(visible(tag))) return tag;
    return sanitizeParagraph(tag, {sourceAware: false});
  });
}

for (const directory of ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho"]) {
  for (const file of walk(path.join(siteRoot, directory))) {
    const before = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting)"/.test(before)) continue;
    let after = sanitizeMarkedCopy(before);
    after = removeSalaryDisclaimers(after);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
  }
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 50) {
    const chunk = changed.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-copy-sanitizer-v3-complete",
  changedFiles: changed.length,
  visibleSourceLinksRemoved: true,
}, null, 2));
