import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve("tuyen-tho-mo");
const roots = ["tin-nganh-than", "bai-viet", "chuyen-nguoi-tho", "giai-dap-nghe-mo"];
const changed = [];
const stats = {checked: 0, fragmentsMerged: 0, sourceNotesNormalized: 0, phrasesRepaired: 0};

const forbiddenClasses = /article-(?:genre-label|byline|source-note|source-responsibility|editor-note|seo-line|conclusion)|keyword-summary/i;

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

function repairPhrases(html) {
  const replacements = [
    [/\bBài\s+nguồn\s+ngày\s+\d{1,2}\/\d{1,2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)\s*/giu, ""],
    [/\bNguồn\s+cho\s+biết(?:\s+rằng)?\s*/giu, ""],
    [/(^|[.!?]\s+)Theo\s+nguồn,?\s*/giu, "$1"],
    [/\bNhư\s+chúng\s+ta\s+đã\s+biết,?\s*/giu, ""],
    [/\bCó\s+thể\s+(?:thấy|nhận\s+thấy)\s+rằng\s*/giu, ""],
    [/\bĐừng\s+bỏ\s+lỡ\s+cơ\s+hội\b/giu, "Cần kiểm tra kỹ điều kiện và thời điểm tiếp nhận"],
    [/\bCơ\s+hội\s+đổi\s+đời\b/giu, "Một lựa chọn nghề nghiệp cần được cân nhắc đầy đủ"],
    [/\bViệc\s+nhẹ\s+lương\s+cao\b/giu, "Công việc có yêu cầu rõ về sức khỏe, tay nghề và kỷ luật"],
    [/\bNhanh\s+tay\s+đăng\s+ký\b/giu, "Kiểm tra điều kiện trước khi đăng ký"],
    [/\bChắc\s+chắn\s+thành\s+công\b/giu, "Có cơ sở để theo đuổi khi đáp ứng yêu cầu"],
  ];
  let output = html;
  for (const [pattern, replacement] of replacements) {
    const matches = output.match(pattern);
    if (matches?.length) stats.phrasesRepaired += matches.length;
    output = output.replace(pattern, replacement);
  }
  return output;
}

function normalizeSourceNotes(html) {
  return html.replace(/<p\b([^>]*)class=(['"])([^'"]*\barticle-source-note\b[^'"]*)\2([^>]*)>([\s\S]*?)<\/p>/gi, (_tag, before, quote, classes, after, inner) => {
    let body = inner.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1").trim();
    body = body
      .replace(/^\s*<strong>\s*Nguồn(?:\s+tư\s+liệu)?\s*:\s*<\/strong>\s*/iu, "")
      .replace(/^\s*Nguồn(?:\s+tư\s+liệu)?\s*:\s*/iu, "")
      .trim();
    stats.sourceNotesNormalized += 1;
    return `<p${before}class=${quote}${classes}${quote}${after}><strong>Nguồn:</strong> ${body}</p>`;
  });
}

function mergeShortParagraphs(body) {
  let output = body;
  let changedInPass = true;
  let guard = 0;

  while (changedInPass && guard < 20) {
    changedInPass = false;
    guard += 1;

    output = output.replace(
      /<p\b([^>]*)>([\s\S]*?)<\/p>(\s*)<p\b([^>]*)>([\s\S]*?)<\/p>/gi,
      (match, attrsA, innerA, spacing, attrsB, innerB) => {
        if (forbiddenClasses.test(attrsA) || forbiddenClasses.test(attrsB)) return match;
        const countA = wordCount(innerA);
        const countB = wordCount(innerB);
        if (countA > 0 && countA < 8 && countB >= 8) {
          stats.fragmentsMerged += 1;
          changedInPass = true;
          return `<p${attrsB}>${innerA.trim()} ${innerB.trim()}</p>`;
        }
        if (countB > 0 && countB < 8 && countA >= 8) {
          stats.fragmentsMerged += 1;
          changedInPass = true;
          return `<p${attrsA}>${innerA.trim()} ${innerB.trim()}</p>`;
        }
        return match;
      },
    );
  }
  return output;
}

function repairArticle(html) {
  let output = repairPhrases(html);
  output = normalizeSourceNotes(output);
  output = output.replace(
    /(<article\b[^>]*class=(['"])[^'"]*\barticle-body\b[^>]*>)([\s\S]*?)(<\/article>)/i,
    (_match, open, _quote, body, close) => `${open}${mergeShortParagraphs(body)}${close}`,
  );
  return output
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\n{4,}/g, "\n\n\n");
}

for (const root of roots) {
  for (const file of walk(path.join(siteRoot, root))) {
    const before = fs.readFileSync(file, "utf8");
    if (!/"@type":"(?:NewsArticle|Article|BlogPosting|FAQPage)"/.test(before)) continue;
    stats.checked += 1;
    const after = repairArticle(before);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed.push(path.relative(siteRoot, file).split(path.sep).join("/"));
  }
}

console.log(JSON.stringify({
  status: "editorial-auto-repair-v4-complete",
  ...stats,
  changed: changed.length,
  sample: changed.slice(0, 20),
}, null, 2));
