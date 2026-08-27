const sourceNarration = /(?:bài\s+(?:viết|nguồn|báo|gốc)|nguồn(?:\s+chính\s+thức)?|website|fanpage)[^.!?]{0,100}\b(?:cho biết|cho thấy|nêu|ghi nhận|đề cập|mô tả|công bố|đăng tải)\b/iu;
const institutionalPosting = /^[^.!?]{2,120}\b(?:ngày\s+\d{1,2}\/\d{1,2}\/\d{4}\s+)?(?:đăng|đăng tải|công bố|đăng thông tin|thông tin về)\b/iu;
const formulaicLead = /^(?:có thể thấy|dữ liệu cho thấy|từ thực tế này|điểm cần lưu ý|trong bối cảnh|đáng chú ý|đây không chỉ là|trọng tâm không chỉ là|đối với người lao động)\b/iu;
const administrativeCopy = /\b(?:nhằm góp phần|qua đó góp phần|đẩy mạnh công tác|triển khai thực hiện)\b/iu;
const consequenceSignal = /\b(?:giúp|để|vì vậy|do đó|quyết định|ảnh hưởng|cần|theo dõi|đối chiếu|phụ thuộc|giá trị|ý nghĩa|rủi ro|kết quả|cho thấy|phản ánh|tạo ra|mở ra|làm rõ)\b/iu;

function visible(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value = "") {
  return visible(value).split(/\s+/u).filter(Boolean).length;
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
    .replace(/\btriển khai thực hiện\b/gi, "triển khai")
    .replace(/\bđẩy mạnh công tác\b/gi, "tăng cường")
    .replace(/\bnhằm góp phần\b/gi, "để")
    .replace(/\bqua đó góp phần\b/gi, "qua đó")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function removeSourceNarration(value = "") {
  const text = cleanCopy(value);
  const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean);
  if (sentences.length > 1 && (sourceNarration.test(visible(sentences[0])) || institutionalPosting.test(visible(sentences[0])))) {
    const remaining = sentences.slice(1).join(" ").trim();
    if (wordCount(remaining) >= 16) return capitalize(remaining);
  }
  return text.replace(/^([^.!?]{2,150})\b(?:cho biết rằng|cho biết|nêu rằng|nêu|ghi nhận rằng|ghi nhận)\s+(.+)$/iu,
    (_match, _source, fact) => capitalize(fact));
}

function specificity(value = "") {
  const text = visible(value);
  let score = 0;
  if (/\b\d{1,2}\/\d{1,2}(?:\/\d{4})?\b/u.test(text)) score += 5;
  if (/\b20\d{2}\b/u.test(text)) score += 3;
  if (/\b\d+(?:[.,]\d+)?\b/u.test(text)) score += 2;
  if (/\b(?:TKV|Công ty|Trường|Công đoàn|Đảng ủy|UBND|Phân xưởng|Quảng Ninh|Hải Phòng|Gia Lai|Đắk Lắk|Cao Bằng|Tuyên Quang|Lai Châu)\b/u.test(text)) score += 2;
  if (/\b(?:diễn ra|tổ chức|trao|hỗ trợ|tiếp nhận|đào tạo|ký|thăm|phối hợp|khởi công|hoàn thành|sản xuất|tuyển sinh|thực tập)\b/iu.test(text)) score += 2;
  if (consequenceSignal.test(text)) score += 1;
  if (formulaicLead.test(text)) score -= 3;
  if (administrativeCopy.test(text)) score -= 2;
  if (sourceNarration.test(text) || institutionalPosting.test(text)) score -= 5;
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

function dedupeAdjacentSentences(value = "") {
  const sentences = cleanCopy(value).split(/(?<=[.!?])\s+/u).filter(Boolean);
  return sentences.filter((sentence, index) => !index || visible(sentence) !== visible(sentences[index - 1])).join(" ");
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

function overlap(left = "", right = "") {
  const a = new Set(visible(left).toLocaleLowerCase("vi").split(/\s+/u).filter((token) => token.length > 3));
  const b = new Set(visible(right).toLocaleLowerCase("vi").split(/\s+/u).filter((token) => token.length > 3));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) if (b.has(token)) common += 1;
  return common / Math.max(a.size, b.size);
}

function bestCandidate(items = []) {
  return [...items]
    .map((item, index) => ({item, index, score: specificity(item)}))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.item || "";
}

function strengthenLead(currentLead, candidates = []) {
  let lead = cleanCopy(currentLead || "");
  const candidate = bestCandidate(candidates.filter(Boolean));
  const invalidLead = !lead
    || sourceNarration.test(visible(lead))
    || institutionalPosting.test(visible(lead))
    || formulaicLead.test(visible(lead))
    || lead.length > 265
    || wordCount(lead) < 14;

  if (invalidLead || (candidate && specificity(candidate) > specificity(lead) + 4)) {
    lead = firstSentences(candidate || lead);
  }

  if (lead && !consequenceSignal.test(visible(lead))) {
    const context = candidates.find((item) => item && consequenceSignal.test(visible(item)) && overlap(lead, item) < 0.72);
    if (context) {
      const contextSentence = firstSentences(context, 170).split(/(?<=[.!?])\s+/u)[0];
      if (contextSentence && overlap(lead, contextSentence) < 0.72) {
        const combined = `${lead.replace(/\s+$/u, "")} ${contextSentence}`.trim();
        if (wordCount(combined) <= 72 && combined.length <= 360) lead = combined;
      }
    }
  }

  return dedupeAdjacentSentences(lead);
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

  const sectionCandidates = (article.sections || [])
    .flatMap((section) => section.paragraphs || [])
    .map(removeSourceNarration)
    .filter(Boolean)
    .slice(0, 6);
  const candidates = [
    ...intro.slice(0, 3),
    cleanCopy(article.description || ""),
    ...sectionCandidates,
  ].filter(Boolean);
  const lead = strengthenLead(article.lead || "", candidates);

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
    conclusion: article.conclusion ? cleanCopy(article.conclusion) : article.conclusion,
    takeaway: article.takeaway ? cleanCopy(article.takeaway) : article.takeaway,
    faq: (article.faq || []).map(([question, answer]) => [cleanCopy(question), cleanCopy(answer)]),
    checklist: (article.checklist || []).map(([title, text]) => [cleanCopy(title), cleanCopy(text)]),
    editorialStandard: "journalism-expertise-communications-v5-2026",
    editorialResponsibility: "Nguyễn Tử Linh",
  };
}
