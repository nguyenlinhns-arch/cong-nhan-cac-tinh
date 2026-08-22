import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const articleRoots = ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho", "giai-dap-nghe-mo"];
const errors = [];
const stats = {
  checked: 0,
  authorityPages: 0,
  bylines: 0,
  genreLabels: 0,
  responsibilityNotes: 0,
  sourcedArticles: 0,
};

const forbidden = [
  [/\bBài\s+nguồn\s+ngày\s+\d{1,2}\/\d{1,2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)\b/iu, "còn câu kể nguồn máy móc"],
  [/\bNguồn\s+cho\s+biết(?:\s+rằng)?\b/iu, "còn câu 'Nguồn cho biết'"],
  [/\bTheo\s+nguồn,?\b/iu, "còn câu 'Theo nguồn'"],
  [/\bNhư\s+chúng\s+ta\s+đã\s+biết\b/iu, "còn mở bài sáo mòn"],
  [/\bCó\s+thể\s+(?:thấy|nhận\s+thấy)\s+rằng\b/iu, "còn nhận định mơ hồ"],
  [/\bĐừng\s+bỏ\s+lỡ\s+cơ\s+hội\b/iu, "còn lời thúc giục quảng cáo"],
  [/\bCơ\s+hội\s+đổi\s+đời\b/iu, "còn lời hứa cường điệu"],
  [/\bViệc\s+nhẹ\s+lương\s+cao\b/iu, "còn thông điệp gây hiểu sai"],
  [/\bNhanh\s+tay\s+đăng\s+ký\b/iu, "còn CTA gây áp lực"],
  [/\bChắc\s+chắn\s+thành\s+công\b/iu, "còn cam kết tuyệt đối"],
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

function wordCount(value = "") {
  return visible(value).split(/\s+/u).filter(Boolean).length;
}

function isArticle(html) {
  return /"@type":"(?:NewsArticle|Article|BlogPosting|FAQPage)"/.test(html)
    && /<article\b[^>]*class=(['"])[^'"]*\barticle-body\b/i.test(html);
}

for (const root of articleRoots) {
  for (const file of walk(path.join(siteRoot, root))) {
    const html = fs.readFileSync(file, "utf8");
    if (!isArticle(html)) continue;
    stats.checked += 1;
    const relative = path.relative(siteRoot, file).split(path.sep).join("/");
    const body = html.match(/<article\b[^>]*class=(['"])[^'"]*\barticle-body\b[^>]*>([\s\S]*?)<\/article>/i)?.[2] || "";
    const bodyText = visible(body);

    if (/\beditorial-authority-page\b/.test(html)) stats.authorityPages += 1;
    else errors.push(`${relative}: thiếu lớp trình bày editorial-authority-page`);

    if (/class=(['"])[^'"]*\barticle-byline\b/i.test(html)) stats.bylines += 1;
    else errors.push(`${relative}: thiếu tên người chịu trách nhiệm biên tập`);

    if (/class=(['"])[^'"]*\barticle-genre-label\b/i.test(body)) stats.genreLabels += 1;
    else errors.push(`${relative}: thiếu nhãn thể loại bài viết`);

    if (/class=(['"])[^'"]*\barticle-source-responsibility\b/i.test(body)) stats.responsibilityNotes += 1;
    else errors.push(`${relative}: thiếu phân định nguồn và trách nhiệm diễn giải`);

    const sourceNote = body.match(/<p\b[^>]*class=(['"])[^'"]*\barticle-source-note\b[^>]*>([\s\S]*?)<\/p>/i)?.[2] || "";
    if (sourceNote) {
      stats.sourcedArticles += 1;
      if (/<a\b/i.test(sourceNote)) errors.push(`${relative}: dòng nguồn hiển thị còn liên kết ra ngoài`);
      if (!/^\s*(?:<strong>)?Nguồn:/iu.test(sourceNote)) errors.push(`${relative}: dòng nguồn chưa bắt đầu bằng nhãn 'Nguồn:'`);
    }

    for (const [pattern, message] of forbidden) {
      if (pattern.test(bodyText)) errors.push(`${relative}: ${message}`);
    }

    const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => visible(match[1]))
      .filter((paragraph) => paragraph && !/^(?:Nguồn:|Dữ kiện được đối chiếu|Nguyễn Tử Linh)/u.test(paragraph));
    const fragment = paragraphs.find((paragraph) => wordCount(paragraph) < 8);
    if (fragment) errors.push(`${relative}: còn đoạn quá cụt (${wordCount(fragment)} từ): ${fragment.slice(0, 100)}`);

    const duplicate = new Set();
    for (const paragraph of paragraphs) {
      const normalized = paragraph.toLocaleLowerCase("vi").replace(/\s+/g, " ").trim();
      if (wordCount(paragraph) >= 24 && duplicate.has(normalized)) {
        errors.push(`${relative}: lặp nguyên một đoạn văn trong cùng bài`);
        break;
      }
      duplicate.add(normalized);
    }
  }
}

if (stats.checked < 80) errors.push(`Số bài được kiểm tra thấp bất thường: ${stats.checked}`);
if (stats.authorityPages !== stats.checked) errors.push(`Chỉ ${stats.authorityPages}/${stats.checked} bài có lớp trình bày chuyên môn`);
if (stats.bylines !== stats.checked) errors.push(`Chỉ ${stats.bylines}/${stats.checked} bài có người chịu trách nhiệm`);
if (stats.genreLabels !== stats.checked) errors.push(`Chỉ ${stats.genreLabels}/${stats.checked} bài có nhãn thể loại`);
if (stats.responsibilityNotes !== stats.checked) errors.push(`Chỉ ${stats.responsibilityNotes}/${stats.checked} bài phân định nguồn và diễn giải`);

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  ...stats,
  errors: errors.length,
  sampleErrors: errors.slice(0, 80),
}, null, 2));

if (errors.length) process.exitCode = 1;
