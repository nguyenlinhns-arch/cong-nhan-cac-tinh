import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const roots = ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho", "giai-dap-nghe-mo"];
const errors = [];
const stats = {checked: 0, authority: 0, bylines: 0, genres: 0, responsibility: 0, sourceNotes: 0};

const forbidden = [
  [/\bBài\s+nguồn\s+ngày\s+\d{1,2}\/\d{1,2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)\b/iu, "còn câu kể nguồn máy móc"],
  [/\bNguồn\s+cho\s+biết(?:\s+rằng)?\b/iu, "còn câu 'Nguồn cho biết'"],
  [/(?:^|[.!?]\s+)Theo\s+nguồn,?/iu, "còn câu mở đầu 'Theo nguồn'"],
  [/\bNhư\s+chúng\s+ta\s+đã\s+biết\b/iu, "còn mở bài sáo mòn"],
  [/\bCó\s+thể\s+(?:thấy|nhận\s+thấy)\s+rằng\b/iu, "còn nhận định mơ hồ"],
  [/\bĐây\s+không\s+chỉ\s+là\b/iu, "còn khuôn câu 'đây không chỉ là'"],
  [/\bTrọng\s+tâm\s+không\s+chỉ\s+là\b/iu, "còn khuôn câu 'trọng tâm không chỉ là'"],
  [/\bĐiều\s+(?:được\s+)?[^.!?]{0,60}\bkhông\s+chỉ\s+là\b/iu, "còn khuôn câu 'không chỉ là ... mà còn'"],
  [/\bĐáng\s+chú\s+ý(?:\s+là)?\b/iu, "còn cụm chuyển ý 'đáng chú ý'"],
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

function stripInterface(body) {
  return String(body)
    .replace(/<(?:p|div)\b[^>]*class=(['"])[^'"]*\barticle-(?:genre-label|byline|source-note|source-responsibility|editor-note|seo-line)\b[^>]*>[\s\S]*?<\/(?:p|div)>/gi, " ")
    .replace(/<section\b[^>]*class=(['"])[^'"]*\b(?:article-apply|article-share-panel|professional-news-faq)\b[^>]*>[\s\S]*?<\/section>/gi, " ")
    .replace(/<nav\b[^>]*class=(['"])[^'"]*\barticle-nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ");
}

for (const root of roots) {
  for (const file of walk(path.join(siteRoot, root))) {
    const html = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting|FAQPage)"/.test(html)) continue;
    const articleMatch = html.match(/<article\b[^>]*class=(['"])[^'"]*\barticle-body\b[^>]*>([\s\S]*?)<\/article>/i);
    if (!articleMatch) continue;

    stats.checked += 1;
    const relative = path.relative(siteRoot, file).split(path.sep).join("/");
    const body = articleMatch[2];
    const editorialBody = stripInterface(body);
    const editorialText = visible(editorialBody);

    if (/\beditorial-authority-page\b/.test(html)) stats.authority += 1;
    else errors.push(`${relative}: thiếu lớp trình bày editorial-authority-page`);

    if (/class=(['"])[^'"]*\barticle-byline\b/i.test(html)) stats.bylines += 1;
    else errors.push(`${relative}: thiếu tên người chịu trách nhiệm biên tập`);

    if (/class=(['"])[^'"]*\barticle-genre-label\b/i.test(body)) stats.genres += 1;
    else errors.push(`${relative}: thiếu nhãn thể loại bài viết`);

    if (/class=(['"])[^'"]*\barticle-source-responsibility\b/i.test(body)) stats.responsibility += 1;
    else errors.push(`${relative}: thiếu phân định nguồn và trách nhiệm diễn giải`);

    const sourceMatch = body.match(/<p\b[^>]*class=(['"])[^'"]*\barticle-source-note\b[^>]*>([\s\S]*?)<\/p>/i);
    if (sourceMatch) {
      stats.sourceNotes += 1;
      const sourceNote = sourceMatch[2];
      if (/<a\b/i.test(sourceNote)) errors.push(`${relative}: dòng nguồn hiển thị còn liên kết ra ngoài`);
      if (!/^\s*(?:<strong>)?Nguồn:/iu.test(sourceNote)) errors.push(`${relative}: dòng nguồn chưa bắt đầu bằng nhãn 'Nguồn:'`);
    }

    for (const [pattern, message] of forbidden) {
      if (pattern.test(editorialText)) errors.push(`${relative}: ${message}`);
    }

    const paragraphTags = [...editorialBody.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)];
    const paragraphs = paragraphTags
      .filter((match) => !/article-(?:genre-label|byline|source-note|source-responsibility|editor-note|seo-line)|keyword-summary/i.test(match[1]))
      .map((match) => visible(match[2]))
      .filter(Boolean);

    const fragment = paragraphs.find((paragraph) => wordCount(paragraph) < 8);
    if (fragment) errors.push(`${relative}: còn đoạn quá cụt (${wordCount(fragment)} từ): ${fragment.slice(0, 100)}`);

    const seen = new Set();
    for (const paragraph of paragraphs) {
      const normalized = paragraph.toLocaleLowerCase("vi").replace(/\s+/g, " ").trim();
      if (wordCount(paragraph) >= 24 && seen.has(normalized)) {
        errors.push(`${relative}: lặp nguyên một đoạn văn trong cùng bài`);
        break;
      }
      seen.add(normalized);
    }
  }
}

if (stats.checked < 80) errors.push(`Số bài được kiểm tra thấp bất thường: ${stats.checked}`);
if (stats.authority !== stats.checked) errors.push(`Chỉ ${stats.authority}/${stats.checked} bài có lớp trình bày chuyên môn`);
if (stats.bylines !== stats.checked) errors.push(`Chỉ ${stats.bylines}/${stats.checked} bài có người chịu trách nhiệm`);
if (stats.genres !== stats.checked) errors.push(`Chỉ ${stats.genres}/${stats.checked} bài có nhãn thể loại`);
if (stats.responsibility !== stats.checked) errors.push(`Chỉ ${stats.responsibility}/${stats.checked} bài phân định nguồn và diễn giải`);

console.log(JSON.stringify({
  status: errors.length ? "failed" : "passed",
  ...stats,
  errors: errors.length,
  sampleErrors: errors.slice(0, 80),
}, null, 2));

if (errors.length) process.exitCode = 1;