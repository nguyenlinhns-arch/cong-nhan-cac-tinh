const sourceNarration = /(?:bài\s+(?:viết|nguồn|báo|gốc)|nguồn(?:\s+chính\s+thức)?|website|fanpage)[^.!?]{0,100}\b(?:cho biết|cho thấy|nêu|ghi nhận|đề cập|mô tả|công bố|đăng tải)\b/iu;
const institutionalPosting = /^[^.!?]{2,120}\b(?:ngày\s+\d{1,2}\/\d{1,2}\/\d{4}\s+)?(?:đăng|đăng tải|công bố|đăng thông tin|thông tin về)\b/iu;

function visible(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function capitalize(value = "") {
  const text = String(value).trim();
  if (!text) return text;
  return `${text[0].toLocaleUpperCase("vi")}${text.slice(1)}`;
}

function cleanCopy(value = "") {
  return String(value)
    .replace(/Bài nguồn ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho biết|thông tin rằng)\s*/gi, "")
    .replace(/\bNguồn cho biết(?: rằng)?\s+/gi, "")
    .replace(/\bTheo nguồn,?\s+/gi, "")
    .replace(/\bĐáng chú ý(?: là)?[,;:]?\s*/gi, "")
    .replace(/\bCó thể thấy rằng\b/gi, "Dữ liệu cho thấy")
    .replace(/\bĐiều này cho thấy\b/gi, "Dữ liệu cho thấy")
    .replace(/\bĐiều đó cho thấy\b/gi, "Điều đó phản ánh")
    .replace(/\bTrong bối cảnh đó\b/gi, "Từ thực tế này")
    .replace(/\bĐối với người lao động\b/gi, "Với người lao động")
    .replace(/\bĐiều quan trọng là\b/gi, "Điểm cần lưu ý là")
    .replace(/\bđược tổ chức vào\b/gi, "diễn ra vào")
    .replace(/\bđược tổ chức tại\b/gi, "diễn ra tại")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function removeSourceNarration(value = "") {
  const text = cleanCopy(value);
  const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean);
  if (sentences.length > 1 && (sourceNarration.test(visible(sentences[0])) || institutionalPosting.test(visible(sentences[0])))) {
    const remaining = sentences.slice(1).join(" ").trim();
    if (visible(remaining).split(/\s+/u).length >= 16) return capitalize(remaining);
  }
  return text.replace(/^([^.!?]{2,150})\b(?:cho biết rằng|cho biết|nêu rằng|nêu|ghi nhận rằng|ghi nhận)\s+(.+)$/iu,
    (_match, _source, fact) => capitalize(fact));
}

function specificity(value = "") {
  const text = visible(value);
  let score = 0;
  if (/\b\d{1,2}\/\d{1,2}(?:\/\d{4})?\b/u.test(text)) score += 5;
  if (/\b\d+(?:[.,]\d+)?\b/u.test(text)) score += 2;
  if (/\b(?:TKV|Công ty|Trường|Công đoàn|Đảng ủy|UBND|Phân xưởng|Quảng Ninh|Hải Phòng|Gia Lai|Đắk Lắk)\b/u.test(text)) score += 2;
  if (/\b(?:diễn ra|tổ chức|trao|hỗ trợ|tiếp nhận|đào tạo|ký|thăm|phối hợp|khởi công|hoàn thành)\b/iu.test(text)) score += 2;
  if (/^(?:Dữ liệu cho thấy|Từ thực tế này|Điểm cần lưu ý)/iu.test(text)) score -= 2;
  if (sourceNarration.test(text) || institutionalPosting.test(text)) score -= 4;
  return score;
}

function firstSentences(value = "", limit = 235) {
  const text = visible(value);
  if (text.length <= limit) return text;
  const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean);
  let result = "";
  for (const sentence of sentences) {
    const next = result ? `${result} ${sentence}` : sentence;
    if (next.length > limit) break;
    result = next;
    if (result.length >= 110) break;
  }
  if (result) return result;
  return `${text.slice(0, limit).replace(/\s+\S*$/u, "").replace(/[,:;\s]+$/u, "")}…`;
}

function dedupe(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    const normalized = visible(item).toLocaleLowerCase("vi").normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
      .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function editSection(section = {}) {
  return {
    ...section,
    title: section.title ? cleanCopy(section.title) : section.title,
    heading: section.heading ? cleanCopy(section.heading) : section.heading,
    paragraphs: dedupe((section.paragraphs || []).map(removeSourceNarration).filter(Boolean)),
    bullets: (section.bullets || []).map(cleanCopy).filter(Boolean),
    items: (section.items || []).map(cleanCopy).filter(Boolean),
  };
}

export function applyJournalisticSourceEditing(article = {}) {
  const originalIntro = (article.intro || []).map(removeSourceNarration).filter(Boolean);
  const intro = dedupe(originalIntro);
  if (intro.length > 1 && specificity(intro[1]) > specificity(intro[0]) + 3) {
    [intro[0], intro[1]] = [intro[1], intro[0]];
  }

  let lead = cleanCopy(article.lead || "");
  if (!lead || sourceNarration.test(visible(lead)) || institutionalPosting.test(visible(lead)) || lead.length > 265) {
    lead = firstSentences(intro[0] || article.description || article.takeaway || lead);
  }

  return {
    ...article,
    title: cleanCopy(article.title),
    description: cleanCopy(article.description),
    lead,
    intro,
    sections: (article.sections || []).map(editSection),
    factsTitle: article.factsTitle ? cleanCopy(article.factsTitle) : article.factsTitle,
    actionTitle: article.actionTitle ? cleanCopy(article.actionTitle) : article.actionTitle,
    conclusionTitle: article.conclusionTitle ? cleanCopy(article.conclusionTitle) : article.conclusionTitle,
    takeaway: article.takeaway ? cleanCopy(article.takeaway) : article.takeaway,
    faq: (article.faq || []).map(([question, answer]) => [cleanCopy(question), cleanCopy(answer)]),
    checklist: (article.checklist || []).map(([title, text]) => [cleanCopy(title), cleanCopy(text)]),
    editorialStandard: "journalism-expertise-communications-2026",
    editorialResponsibility: "Nguyễn Tử Linh",
  };
}
