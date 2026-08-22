import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const articleRoots = ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho", "giai-dap-nghe-mo"];
const changed = [];
const report = {
  checked: 0,
  changed: 0,
  mechanicalAttributionRemoved: 0,
  promotionalClaimsSoftened: 0,
  genreLabelsAdded: 0,
  bylinesAdded: 0,
  responsibilityNotesAdded: 0,
  sourceLinksConvertedToText: 0,
};

const replacements = [
  [/\bBài\s+nguồn\s+ngày\s+\d{1,2}\/\d{1,2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)\s*/giu, "", "mechanicalAttributionRemoved"],
  [/\bNguồn\s+cho\s+biết(?:\s+rằng)?\s*/giu, "", "mechanicalAttributionRemoved"],
  [/\bTheo\s+nguồn,?\s*/giu, "", "mechanicalAttributionRemoved"],
  [/\bBài\s+(?:viết|báo|phóng\s+sự)\s+(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|mô\s+tả)\s*/giu, "", "mechanicalAttributionRemoved"],
  [/\bCó\s+thể\s+(?:thấy|nhận\s+thấy)\s+rằng\s*/giu, "", "mechanicalAttributionRemoved"],
  [/\bĐiều\s+này\s+cho\s+thấy\s+rằng\s*/giu, "Dữ kiện này cho thấy ", "mechanicalAttributionRemoved"],
  [/\bQua\s+đó\s+cho\s+thấy\s*/giu, "Kết quả phản ánh ", "mechanicalAttributionRemoved"],
  [/\bNhư\s+chúng\s+ta\s+đã\s+biết,?\s*/giu, "", "mechanicalAttributionRemoved"],
  [/\bĐừng\s+bỏ\s+lỡ\s+cơ\s+hội\b/giu, "Cần kiểm tra kỹ điều kiện và thời điểm tiếp nhận", "promotionalClaimsSoftened"],
  [/\bCơ\s+hội\s+đổi\s+đời\b/giu, "Một lựa chọn nghề nghiệp cần được cân nhắc đầy đủ", "promotionalClaimsSoftened"],
  [/\bViệc\s+nhẹ\s+lương\s+cao\b/giu, "Công việc có yêu cầu rõ về sức khỏe, tay nghề và kỷ luật", "promotionalClaimsSoftened"],
  [/\bNhanh\s+tay\s+đăng\s+ký\b/giu, "Kiểm tra điều kiện trước khi đăng ký", "promotionalClaimsSoftened"],
  [/\bĐăng\s+ký\s+ngay\s+hôm\s+nay\b/giu, "Gửi thông tin để được hướng dẫn", "promotionalClaimsSoftened"],
  [/\bChắc\s+chắn\s+thành\s+công\b/giu, "Có cơ sở để theo đuổi khi đáp ứng yêu cầu", "promotionalClaimsSoftened"],
];

const headingReplacements = [
  [/^Kết\s+luận(?:\s+ngắn)?$/iu, "Điều người lao động cần ghi nhớ"],
  [/^Tóm\s+lại$/iu, "Điều cần lưu ý sau cùng"],
  [/^(?:Thông\s+tin|Những\s+thông\s+tin)\s+chính$/iu, "Dữ kiện cần lưu ý"],
  [/^Giải\s+thích\s+rõ\s+từng\s+ý$/iu, "Những điểm cần hiểu đúng"],
  [/^Cách\s+đọc\s+đúng$/iu, "Phạm vi áp dụng của thông tin"],
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

function cleanSpacing(value) {
  return String(value)
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([.!?]){2,}/g, "$1")
    .replace(/\s{2,}/g, " ");
}

function capitalizeVisibleStart(value) {
  return String(value).replace(/^(\s*(?:<[^>]+>\s*)*)(\p{Ll})/u, (_match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("vi")}`);
}

function polishTextPreservingMarkup(value) {
  let output = String(value);
  for (const [pattern, replacement, counter] of replacements) {
    const matches = output.match(pattern);
    if (matches?.length) report[counter] += matches.length;
    output = output.replace(pattern, replacement);
  }
  return capitalizeVisibleStart(cleanSpacing(output));
}

function polishParagraph(tag) {
  const attrs = tag.match(/^<p\b([^>]*)>/i)?.[1] || "";
  if (/article-(?:source-note|editor-note|seo-line|byline|source-responsibility)|keyword-summary/i.test(attrs)) return tag;
  const inner = tag.replace(/^<p\b[^>]*>/i, "").replace(/<\/p>$/i, "");
  if (/<(?:img|picture|video|iframe|button|input|form)\b/i.test(inner)) return tag;
  const polished = polishTextPreservingMarkup(inner).trim();
  if (!visible(polished)) return "";
  return `<p${attrs}>${polished}</p>`;
}

function polishHeadings(html) {
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (tag, attrs, inner) => {
    const title = visible(inner);
    for (const [pattern, replacement] of headingReplacements) {
      if (pattern.test(title)) return `<h2${attrs}>${replacement}</h2>`;
    }
    return tag;
  });
}

function makeSourceNotesPlainText(html) {
  return html.replace(/<p\b([^>]*)class=(['"])([^'"]*\barticle-source-note\b[^'"]*)\2([^>]*)>([\s\S]*?)<\/p>/gi, (tag, before, quote, classes, after, inner) => {
    if (!/<a\b/i.test(inner)) return tag;
    report.sourceLinksConvertedToText += (inner.match(/<a\b/gi) || []).length;
    const plain = inner.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1");
    return `<p${before}class=${quote}${classes}${quote}${after}>${plain}</p>`;
  });
}

function genreFor(relative) {
  if (relative.startsWith("giai-dap-nghe-mo/")) return "Giải đáp chuyên môn";
  if (relative.startsWith("chuyen-nguoi-tho/")) return "Phóng sự - nhân vật";
  if (relative.startsWith("bai-viet/")) return "Phân tích - hướng dẫn";
  return "Tin tức chuyên ngành";
}

function addAuthorityLayer(html, relative) {
  if (!/"@type":"(?:NewsArticle|Article|BlogPosting|FAQPage)"/.test(html)) return html;
  let output = html;
  const genre = genreFor(relative);

  if (!/class=(['"])[^'"]*\barticle-genre-label\b/i.test(output)) {
    const label = `<p class="article-genre-label">${genre}</p>`;
    if (/<article\b[^>]*class=(['"])[^'"]*\barticle-body\b/i.test(output)) {
      output = output.replace(/(<article\b[^>]*class=(['"])[^'"]*\barticle-body\b[^>]*>)/i, `$1\n${label}`);
      report.genreLabelsAdded += 1;
    }
  }

  if (!/class=(['"])[^'"]*\barticle-byline\b/i.test(output)) {
    const byline = '<p class="article-byline"><a href="/lien-he/">Nguyễn Tử Linh</a><span>Biên tập, kiểm chứng nguồn và chịu trách nhiệm nội dung</span></p>';
    const heroPattern = /(<section\b[^>]*class=(['"])[^'"]*\barticle-hero\b[^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>)/i;
    if (heroPattern.test(output)) {
      output = output.replace(heroPattern, `$1\n${byline}`);
      report.bylinesAdded += 1;
    }
  }

  if (!/class=(['"])[^'"]*\barticle-source-responsibility\b/i.test(output)) {
    const note = '<p class="article-source-responsibility">Dữ kiện được đối chiếu theo nguồn ghi cuối bài; phần phân tích và cách diễn giải do Nguyễn Tử Linh chịu trách nhiệm biên tập.</p>';
    if (/<!-- newsroom-copy-v3:end -->/i.test(output)) {
      output = output.replace(/<!-- newsroom-copy-v3:end -->/i, `<!-- newsroom-copy-v3:end -->\n${note}`);
      report.responsibilityNotesAdded += 1;
    } else if (/<p\b[^>]*class=(['"])[^'"]*\barticle-source-note\b/i.test(output)) {
      output = output.replace(/(<p\b[^>]*class=(['"])[^'"]*\barticle-source-note\b)/i, `${note}\n$1`);
      report.responsibilityNotesAdded += 1;
    }
  }

  return output.replace(/<body\b([^>]*)class=(['"])([^'"]*)\2/i, (tag, before, quote, classes) => {
    if (/\beditorial-authority-page\b/.test(classes)) return tag;
    return `<body${before}class=${quote}${`${classes} editorial-authority-page`.trim()}${quote}`;
  });
}

function processHtml(html, relative) {
  let output = html.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, polishParagraph);
  output = polishHeadings(output);
  output = makeSourceNotesPlainText(output);
  output = addAuthorityLayer(output, relative);
  return output.replace(/\n{4,}/g, "\n\n\n");
}

for (const root of articleRoots) {
  for (const file of walk(path.join(siteRoot, root))) {
    report.checked += 1;
    const relative = path.relative(siteRoot, file).split(path.sep).join("/");
    const before = fs.readFileSync(file, "utf8");
    const after = processHtml(before, relative);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed.push(relative);
  }
}

report.changed = changed.length;
console.log(JSON.stringify({
  status: "editorial-continuous-learning-v4b-complete",
  ...report,
  sample: changed.slice(0, 20),
}, null, 2));
