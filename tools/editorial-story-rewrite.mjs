import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {existingNews} from "./curated-articles.mjs";
import {communityArticles} from "./community-articles.mjs";
import {pressStoryArticles} from "./press-story-articles.mjs";

const projectRoot = process.cwd();
const siteRoot = path.resolve(projectRoot, "tuyen-tho-mo");
const changed = [];
const articleBodyPattern = /<article\b[^>]*class=["'][^"']*\barticle-body\b[^"']*["'][^>]*>[\s\S]*?<\/article>/i;
const copyStart = "<!-- newsroom-copy-v3:start -->";
const copyEnd = "<!-- newsroom-copy-v3:end -->";

const editorialOverrides = {
  "xay-lap-mo-ho-tro-gia-dinh-cong-nhan-kho-khan-2026": {
    lede: "Sáng 16/08/2026, đại diện Công ty Xây lắp mỏ - TKV, Công đoàn và Phân xưởng Đào lò 15 đến thăm một gia đình công nhân tại Hải Phòng. Riêng đồng nghiệp trong phân xưởng đã quyên góp 31,5 triệu đồng để cùng chia sẻ khó khăn.",
    nutgraph: "Hoạt động cho thấy việc chăm lo người lao động được triển khai từ doanh nghiệp tới đơn vị sản xuất. Khoản 31,5 triệu đồng là hỗ trợ tự nguyện cho một trường hợp cụ thể, không phải chế độ áp dụng chung trong toàn ngành.",
    heading1: "Nhiều đầu mối cùng hỗ trợ một gia đình công nhân",
    heading2: "Giá trị của sự đồng hành nằm ở chặng sau chuyến thăm",
  },
  "truong-cao-dang-tkv-thao-go-diem-nghen-tuyen-sinh-nghe-mo-2026": {
    lede: "Chiều 19/08/2026, Thường trực Đảng ủy Than Quảng Ninh làm việc với Đảng ủy Trường Cao đẳng Than - Khoáng sản Việt Nam về tuyển sinh nghề mỏ, quản lý học sinh và chất lượng đào tạo.",
    nutgraph: "Cuộc làm việc đặt tuyển sinh trong toàn bộ lộ trình từ tiếp cận người học tới đào tạo và thực tập. Việc giữ người học và phân định trách nhiệm giữa Nhà trường, doanh nghiệp, địa phương trở thành tiêu chí quan trọng bên cạnh số lượng tuyển mới.",
    heading1: "Tuyển được người mới chỉ là điểm bắt đầu",
    heading2: "Chất lượng đào tạo phải được đo tới giai đoạn thực tập",
  },
  "tho-mo-vao-ca-duong-huy": {
    lede: "Từ 5 giờ 30 phút, khai trường Than Dương Huy đã bước vào nhịp chuẩn bị cho ca đầu ngày. Gần 400 công nhân ăn sáng, nhận thiết bị, nghe giao việc rồi lần lượt đi xuống những đường lò sâu.",
    nutgraph: "Một ca sản xuất dưới lòng đất không bắt đầu ở gương than. Nó bắt đầu từ bữa ăn, nhà đèn, bộ bảo hộ và hàng loạt bước kiểm soát giúp mỗi người biết rõ mình sẽ làm gì và phải ứng phó ra sao khi điều kiện thay đổi.",
    heading1: "Ca làm được chuẩn bị từ trên mặt đất",
    heading2: "Kỷ luật giữ nhịp cho cả tổ đội dưới lò",
  },
  "gia-dinh-ba-the-he-tho-mo-thong-nhat": {
    lede: "Chiếc bánh mì bố mang về sau ca ba từng là món quà tuổi thơ của Nguyễn Duy Khánh. Nhiều năm sau, ký ức ấy theo anh xuống hầm lò, nối tiếp con đường mà ông nội và cha đã đi trước.",
    nutgraph: "Ba thế hệ trong một gia đình ở Cẩm Phả cùng làm nghề mỏ, nhưng mỗi thế hệ bước vào nghề trong một điều kiện khác nhau. Gia đình truyền lại cả kinh nghiệm nghề nghiệp, kỷ luật, lòng tự trọng và trách nhiệm với nhau.",
    heading1: "Từ người ông rời quê đến nếp nhà vùng mỏ",
    heading2: "Nghề được nối tiếp bằng lựa chọn của thế hệ sau",
  },
  "bao-lac-cao-bang-tu-van-hoc-nghe-mo": {
    lede: "Ngày 19/04/2025, đoàn công tác xã Hưng Đạo, huyện Bảo Lạc đến Phân hiệu Hoành Bồ làm việc với Trường Cao đẳng Than - Khoáng sản Việt Nam về kết quả tư vấn nghề mỏ trong quý I và kế hoạch chín tháng còn lại.",
    nutgraph: "Cuộc làm việc hướng hoạt động tư vấn trở lại cấp xã, thôn để thông tin tiếp tục đến đúng địa bàn sau hội nghị tập trung. Hiệu quả cuối cùng cần được đo bằng số người hoàn thiện hồ sơ, nhập học và tiếp tục theo nghề.",
    heading1: "Tư vấn chỉ hiệu quả khi trở lại đúng địa bàn",
    heading2: "Kết quả phải được theo dõi tới ngày nhập học",
  },
  "dam-ha-than-thong-nhat-dao-tao-viec-lam-2026": {
    lede: "Ngày 22/05/2026, UBND xã Đầm Hà, Công ty Than Thống Nhất và Trường Cao đẳng TKV ký thỏa thuận phối hợp đào tạo nghề, giải quyết việc làm giai đoạn 2026-2030.",
    nutgraph: "Thỏa thuận tạo một tuyến trách nhiệm từ tư vấn tại địa phương, đào tạo tại Nhà trường đến tiếp nhận tại doanh nghiệp. Với người lao động, giá trị của mô hình nằm ở việc biết rõ đầu mối, nơi học, nghề học và đơn vị dự kiến bố trí công việc.",
    heading1: "Ba bên cùng chịu trách nhiệm cho một lộ trình",
    heading2: "Người lao động cần nhìn rõ toàn bộ chặng đường",
  },
  "viec-lam-nganh-than-thang-8-2026": {
    lede: "Trong đợt tuyển sinh tháng 8/2026, nam 18-40 tuổi đủ điều kiện sức khỏe có thể đăng ký học nghề mỏ tại Quảng Ninh. Hai nghề khai thác và xây dựng mỏ học 2-3 tháng; nghề cơ điện mỏ học 10 tháng.",
    nutgraph: "Thông tin tuyển sinh mô tả một lộ trình cụ thể: kiểm tra điều kiện, nhận lịch, học nghề, thực tập và được doanh nghiệp tiếp nhận khi hoàn thành chương trình; quyền lợi và đầu mối được xác nhận theo từng đợt.",
    heading1: "Từ đăng ký đến lớp học phải có lịch trình rõ ràng",
    heading2: "Việc làm sau đào tạo gắn với kết quả học tập",
  },
  "phuc-loi-tho-mo-tkv-2026": {
    lede: "Trong 6 tháng đầu năm 2026, các chương trình chăm lo người lao động của Công đoàn TKV trải từ nhà ở, khám sức khỏe, bữa ăn đến đối thoại tại nơi làm việc. 108 mái ấm và hơn 71.000 lượt khám sức khỏe là hai dữ kiện nổi bật.",
    nutgraph: "Phúc lợi bao gồm hỗ trợ sau khó khăn và những điều kiện giúp người lao động duy trì sức khỏe, ngày công và khả năng gắn bó. Với ngành sản xuất theo ca, nhà ở, dinh dưỡng, chăm sóc sức khỏe và khả năng phản hồi kiến nghị đều tác động trực tiếp tới đời sống người thợ.",
    heading1: "Chăm lo đời sống bắt đầu từ những nhu cầu thiết yếu",
    heading2: "Đối thoại giúp phúc lợi đi tới đúng vấn đề",
  },
  "tai-co-cau-tkv-2026-viec-lam-tho-mo": {
    lede: "Trong định hướng giai đoạn 2026-2030, TKV đặt tuyển dụng, đào tạo, giữ chân thợ lò và cơ giới hóa trong cùng một chiến lược phát triển. Người lao động trẻ vì thế đứng trước cả cơ hội việc làm lẫn yêu cầu kỹ năng mới.",
    nutgraph: "Tái cơ cấu không tự động tạo ra một vị trí ổn định cho mọi người. Cơ hội cụ thể phụ thuộc kế hoạch của từng đơn vị, còn khả năng theo nghề phụ thuộc sức khỏe, kỷ luật, tay nghề và mức độ thích nghi với thiết bị hiện đại.",
    heading1: "Cơ giới hóa làm thay đổi cơ cấu kỹ năng",
    heading2: "Người trẻ cần chuẩn bị cho một nghề học liên tục",
  },
};

const forbiddenOverridePatterns = [
  [/\bĐáng\s+chú\s+ý(?:\s+là)?\b/iu, "Đáng chú ý"],
  [/\bĐây\s+không\s+chỉ\s+là\b/iu, "Đây không chỉ là"],
  [/\bTrọng\s+tâm\s+không\s+chỉ\s+là\b/iu, "Trọng tâm không chỉ là"],
  [/\bkhông\s+chỉ\b[^.!?]{0,120}\bmà\s+còn\b/iu, "không chỉ… mà còn"],
];
for (const [slug, override] of Object.entries(editorialOverrides)) {
  const text = Object.values(override).join(" ");
  for (const [pattern, label] of forbiddenOverridePatterns) {
    if (pattern.test(text)) throw new Error(`${slug}: source override còn khuôn câu “${label}”`);
  }
}

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function stripTags(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;|&#38;|&#038;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value = "") {
  return stripTags(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value = "") {
  return stripTags(value).split(/\s+/u).filter(Boolean).length;
}

function capitalize(value = "") {
  return String(value).replace(/^([“"'‘’(]*)(\p{Ll})/u, (_match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("vi")}`);
}

function lowerFirst(value = "") {
  return String(value).replace(/^([“"'‘’(]*)(\p{Lu})/u, (_match, prefix, letter) => `${prefix}${letter.toLocaleLowerCase("vi")}`);
}

function cleanSentence(value = "") {
  let text = stripTags(value).replaceAll("—", ",");
  if (!text) return "";
  if (/^(?:bài|nguồn)\s+(?:gốc|báo|viết)?\s*(?:không|chưa)\b/iu.test(text)) return "";
  text = text
    .replace(/^Bài\s+nguồn\s+ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)\s*/iu, "")
    .replace(/^Nguồn\s+cho\s+biết(?:\s+rằng)?\s*/iu, "")
    .replace(/^Theo\s+nguồn,?\s*/iu, "")
    .replace(/^Bài\s+phóng\s+sự(?:\s+ảnh)?\s+của\s+[^,.]+?\s+(?:mở\s+ra\s+bằng|đưa\s+người\s+đọc|khắc\s+họa|ghi\s+lại)\s*/iu, "")
    .replace(/^Phóng\s+sự(?:\s+ảnh)?\s+của\s+[^,.]+?\s+(?:đưa\s+người\s+đọc|khắc\s+họa|ghi\s+lại)\s*/iu, "")
    .replace(/^Bài\s+(?:viết|báo)\s+của\s+[^,.]+?\s+(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|mô\s+tả|kể)\s*/iu, "")
    .replace(/^Bài\s+(?:viết|báo|nguồn|gốc)\s+(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|mô\s+tả|đề\s+cập)\s*/iu, "")
    .replace(/^Tư\s+liệu\s+(?:cho\s+thấy|ghi\s+nhận|mô\s+tả)\s*/iu, "")
    .replace(/^Tác\s+giả\s+đi\s+bộ\s+từ\s+cửa\s+lò\s+để\s+cảm\s+nhận\s+rõ\s*/iu, "Từ cửa lò, hành trình đi bộ cho thấy ")
    .replace(/^Trong\s+lò,\s*phóng\s+viên\s+gặp\s*/iu, "Trong lò có ")
    .replace(/\bphóng\s+viên\s+gặp\s*/giu, "")
    .replace(/\bnguồn\s+(?:cho\s+biết|cho\s+thấy|nêu|ghi\s+nhận|mô\s+tả|đề\s+cập)\s*/giu, "")
    .replace(/\bđối\s+chiếu\s+sơ\s+bộ\b/giu, "kiểm tra ban đầu")
    .replace(/\bphù\s+hợp\s+sơ\s+bộ\b/giu, "phù hợp ở bước kiểm tra ban đầu")
    .replace(/\bkhông\s+nên\s+tự\s+suy\s+ra\b/giu, "chỉ xác nhận khi có thông báo chính thức")
    .replace(/\bĐiều\s+quan\s+trọng\s+là\b/gu, "Điểm cần lưu ý là")
    .replace(/\bCó\s+thể\s+thấy\s+rằng\b/gu, "Có thể thấy")
    .replace(/\bTrong\s+bối\s+cảnh\s+đó\b/gu, "Từ bối cảnh này")
    .replace(/\bKết\s+luận\s+ngắn\b/giu, "Điều người lao động cần ghi nhớ")
    .replace(/\s+/g, " ")
    .trim();
  return capitalize(text);
}

function cleanParagraph(value = "") {
  return stripTags(value)
    .split(/(?<=[.!?])\s+/u)
    .map(cleanSentence)
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function limitParagraph(value, maxWords) {
  const text = cleanParagraph(value);
  if (wordCount(text) <= maxWords) return text;
  const sentences = text.split(/(?<=[.!?])\s+/u).filter(Boolean);
  const selected = [];
  for (const sentence of sentences) {
    if (selected.length && wordCount([...selected, sentence].join(" ")) > maxWords) break;
    selected.push(sentence);
  }
  if (selected.length && wordCount(selected.join(" ")) <= maxWords) return selected.join(" ");
  const words = text.split(/\s+/u).slice(0, maxWords);
  return `${words.join(" ").replace(/[,:;\s]+$/u, "")}.`;
}

function similarity(left, right) {
  const a = new Set(normalize(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalize(right).split(" ").filter((token) => token.length > 2));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const token of a) if (b.has(token)) common += 1;
  return common / Math.max(a.size, b.size);
}

function dedupe(paragraphs) {
  const output = [];
  for (const paragraph of paragraphs.map(cleanParagraph).filter(Boolean)) {
    if (wordCount(paragraph) < 8) continue;
    const duplicate = output.some((previous) => normalize(previous) === normalize(paragraph)
      || (wordCount(previous) > 25 && wordCount(paragraph) > 25 && similarity(previous, paragraph) >= 0.88));
    if (!duplicate) output.push(paragraph);
  }
  return output;
}

function mergeFragments(paragraphs) {
  const output = [];
  for (const paragraph of paragraphs) {
    if (wordCount(paragraph) < 18 && output.length) output[output.length - 1] = `${output[output.length - 1]} ${paragraph}`.replace(/\s+/g, " ");
    else output.push(paragraph);
  }
  if (output.length > 1 && wordCount(output.at(-1)) < 18) output[output.length - 2] = `${output[output.length - 2]} ${output.pop()}`.replace(/\s+/g, " ");
  return output;
}

function sourceUrl(source = {}) {
  return String(source.url || "").trim();
}

function sourceNote(article) {
  const entries = (article.sources || []).map((source) => {
    const label = [source.publisher, source.title ? `“${stripTags(source.title)}”` : "", source.date || ""].filter(Boolean).join(", ");
    const url = sourceUrl(source);
    return url && !article.hideSourceUrlsInSchema
      ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer external">${escapeHtml(label)}</a>`
      : escapeHtml(label);
  }).filter(Boolean);
  const sourceText = entries.length ? entries.join("; ") : "Thông tin tuyển sinh và tư liệu đã công bố của đơn vị liên quan";
  return `<p class="article-source-note"><strong>Nguồn:</strong> ${sourceText}. Bài do Nguyễn Tử Linh biên tập, kiểm tra dữ kiện và chịu trách nhiệm nội dung.</p>`;
}

function extract(html, pattern) {
  return html.match(pattern)?.[0] || "";
}

function removeFragments(value, fragments) {
  return fragments.reduce((result, fragment) => fragment ? result.replace(fragment, "") : result, value);
}

function cleanHeading(value = "") {
  return cleanParagraph(value)
    .replace(/[.?!:;]+$/u, "")
    .replace(/^Những\s+thông\s+tin\s+(?:đã\s+)?(?:được\s+)?[^,]+?\s+công\s+bố$/iu, "Dữ kiện chính của sự việc")
    .replace(/^Người\s+lao\s+động\s+nên\s+làm\s+gì/iu, "Điều người lao động cần biết")
    .replace(/^Kết\s+luận\s+ngắn$/iu, "Điều người lao động cần ghi nhớ")
    .trim();
}

function existingParagraphs(existingBody, fragments) {
  let core = removeFragments(existingBody, fragments);
  core = core
    .replace(/<div\b[^>]*class=["'][^"']*\barticle-source-footer\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<p\b[^>]*class=["'][^"']*(?:article-source-note|article-seo-line|article-editor-note|article-current-facts)[^"']*["'][^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, "");
  return dedupe([...core.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((match) => match[1]));
}

function factParagraphs(article) {
  const facts = (article.facts || []).map(([value, label]) => {
    const cleanValue = cleanParagraph(value).replace(/[.?!]+$/u, "");
    const cleanLabel = cleanParagraph(label).replace(/[.?!]+$/u, "");
    if (!cleanValue || !cleanLabel) return "";
    return `${cleanValue} gắn với ${lowerFirst(cleanLabel)}.`;
  }).filter(Boolean);
  const output = [];
  for (let index = 0; index < facts.length; index += 2) output.push(facts.slice(index, index + 2).join(" "));
  return output;
}

function actionParagraphs(article) {
  const actions = (article.checklist || []).map(([title, text]) => {
    const cleanTitle = cleanHeading(title);
    const cleanText = cleanParagraph(text).replace(/[.?!]+$/u, "");
    if (!cleanTitle || !cleanText) return "";
    return `${cleanTitle} được thực hiện bằng cách ${lowerFirst(cleanText)}.`;
  }).filter(Boolean);
  const output = [];
  for (let index = 0; index < actions.length; index += 2) output.push(actions.slice(index, index + 2).join(" "));
  return output;
}

function supportParagraphs(article, existingBody, fragments) {
  const faqAnswers = (article.faq || []).map((entry) => cleanParagraph(entry?.[1] || "")).filter(Boolean);
  return dedupe([
    ...existingParagraphs(existingBody, fragments),
    ...factParagraphs(article),
    ...actionParagraphs(article),
    ...faqAnswers,
    article.description,
    article.lead,
    article.takeaway,
  ]);
}

function ensureMinimum(value, fallback, minWords, maxWords) {
  let text = cleanParagraph(value);
  if (wordCount(text) < minWords) {
    const addition = cleanParagraph(fallback);
    if (addition && similarity(text, addition) < 0.75) text = `${text} ${addition}`.trim();
  }
  return limitParagraph(text, maxWords);
}

function buildStory(article, existingBody, fragments) {
  const intro = dedupe(article.intro || []);
  const sections = (article.sections || []).map((section) => ({
    title: cleanHeading(section.title || section.heading || ""),
    paragraphs: dedupe(section.paragraphs || []),
  })).filter((section) => section.paragraphs.length);
  const override = editorialOverrides[article.slug] || {};
  const lede = ensureMinimum(override.lede || intro[0] || article.lead || article.description, article.description || article.lead, 18, 70);
  const nutgraph = ensureMinimum(override.nutgraph || intro[1] || article.description || article.lead, article.lead || article.description, 18, 86);
  const ending = limitParagraph(article.takeaway || article.conclusion || article.lead || article.description, 75);
  const primary = dedupe([
    ...intro.slice(2),
    ...sections.flatMap((section) => section.paragraphs),
  ]).filter((paragraph) => similarity(paragraph, lede) < 0.82 && similarity(paragraph, nutgraph) < 0.82);
  const fallbacks = supportParagraphs(article, existingBody, fragments)
    .filter((paragraph) => similarity(paragraph, lede) < 0.82 && similarity(paragraph, nutgraph) < 0.82);
  const narrative = mergeFragments(dedupe(primary));
  for (const paragraph of fallbacks) {
    if (narrative.some((item) => similarity(item, paragraph) >= 0.86)) continue;
    if (narrative.length >= 4 && wordCount([lede, nutgraph, ...narrative, ending].join(" ")) >= 330) break;
    narrative.push(paragraph);
  }
  while (narrative.length < 4) {
    const seed = narrative.at(-1) || ending || article.description || article.lead;
    const extra = cleanParagraph(seed);
    if (!extra || narrative.some((item) => normalize(item) === normalize(extra))) break;
    narrative.push(extra);
  }
  const midpoint = Math.max(1, Math.ceil(narrative.length / 2));
  const first = narrative.slice(0, midpoint);
  const second = narrative.slice(midpoint);
  return {
    lede,
    nutgraph,
    first,
    second,
    heading1: cleanHeading(override.heading1 || sections[0]?.title || article.factsTitle || "Diễn biến và dữ kiện chính"),
    heading2: cleanHeading(override.heading2 || sections.at(-1)?.title || article.conclusionTitle || "Ý nghĩa đối với người lao động"),
    ending,
  };
}

function renderParagraphs(paragraphs) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n");
}

function renderBody(article, existingBody) {
  const cover = extract(existingBody, /<figure\b[^>]*class=["'][^"']*\barticle-cover\b[^"']*["'][^>]*>[\s\S]*?<\/figure>/i);
  const apply = extract(existingBody, /<section\b[^>]*class=["'][^"']*\barticle-apply\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
  const share = extract(existingBody, /<section\b[^>]*class=["'][^"']*\barticle-share-panel\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
  const nav = extract(existingBody, /<nav\b[^>]*class=["'][^"']*\barticle-nav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i);
  const galleries = [...existingBody.matchAll(/<div\b[^>]*class=["'][^"']*\barticle-inline-gallery\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi)].map((match) => match[0]);
  const fragments = [cover, apply, share, nav, ...galleries];
  const story = buildStory(article, existingBody, fragments);
  const first = story.first.length ? story.first : [cleanParagraph(article.description || article.lead || "")].filter(Boolean);
  const second = story.second.length ? story.second : [];
  const copy = [
    copyStart,
    `<div class="professional-news-copy newsroom-copy-v3">`,
    `<p class="professional-lede">${escapeHtml(story.lede)}</p>`,
    `<p class="professional-nutgraph">${escapeHtml(story.nutgraph)}</p>`,
    `<section class="editorial-section professional-news-section"><h2>${escapeHtml(story.heading1)}</h2>${renderParagraphs(first)}</section>`,
    galleries[0] || "",
    second.length ? `<section class="editorial-section professional-news-section"><h2>${escapeHtml(story.heading2)}</h2>${renderParagraphs(second)}</section>` : "",
    galleries.slice(1).join("\n"),
    story.ending ? `<p class="professional-ending">${escapeHtml(story.ending)}</p>` : "",
    sourceNote(article),
    `</div>`,
    copyEnd,
  ].filter(Boolean).join("\n");
  const extras = [nav, apply, share].filter(Boolean).join("\n");
  return `<article class="article-body article-body--source article-body--professional article-body--journalistic-v2 article-body--journalistic-v3 article-body--newsroom">\n${cover ? `${cover}\n` : ""}${copy}\n${extras}\n</article>`;
}

function polishHero(html, article) {
  const lead = cleanParagraph(article.lead || "");
  return lead ? html.replace(/<p class="lead">[\s\S]*?<\/p>/i, `<p class="lead">${escapeHtml(lead)}</p>`) : html;
}

function addStylesheet(html) {
  if (html.includes('/editorial-newsroom.css?v=1')) return html;
  return html.replace(/<\/head>/i, '  <link rel="stylesheet" href="/editorial-newsroom.css?v=1">\n</head>');
}

function addPageClass(html) {
  if (/<body\b[^>]*class=["'][^"']*\beditorial-newsroom-page\b/i.test(html)) return html;
  if (/<body\b[^>]*class=["']/i.test(html)) {
    return html.replace(/<body\b([^>]*class=["'])([^"']*)(["'][^>]*)>/i, (_match, before, classes, after) => `<body${before}${classes} editorial-newsroom-page${after}>`);
  }
  return html.replace(/<body([^>]*)>/i, '<body class="editorial-newsroom-page"$1>');
}

const registry = new Map();
for (const article of [...existingNews, ...communityArticles, ...pressStoryArticles]) {
  if (!article?.urlPath || !article?.slug || !Array.isArray(article.sources) || !article.sources.length) continue;
  registry.set(article.urlPath, article);
}

for (const article of registry.values()) {
  const file = path.join(siteRoot, article.urlPath, "index.html");
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const existingBody = before.match(articleBodyPattern)?.[0] || "";
  if (!existingBody) continue;
  let after = before.replace(articleBodyPattern, renderBody(article, existingBody));
  after = polishHero(after, article);
  after = addStylesheet(addPageClass(after));
  after = after
    .replace(/LAN TỎA THÔNG TIN ĐÚNG NGUỒN/gi, "CHIA SẺ BÀI VIẾT")
    .replace(/Tìm hiểu thêm về[^<]*trên Thầy Linh[^<]*\.?/gi, "")
    .replace(/Bài\s+nguồn\s+ngày\s+\d{2}\/\d{2}\/\d{4}\s+(?:nêu|cho\s+biết|thông\s+tin\s+rằng)\s*/gi, "")
    .replace(/Nguồn\s+cho\s+biết(?:\s+rằng)?\s*/gi, "")
    .replace(/Kết\s+luận\s+ngắn/gi, "Điều người lao động cần ghi nhớ");
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed.push(path.relative(projectRoot, file).split(path.sep).join("/"));
}

if (process.env.GITHUB_ACTIONS === "true" && changed.length) {
  for (let index = 0; index < changed.length; index += 50) {
    const chunk = changed.slice(index, index + 50);
    try { execFileSync("git", ["update-index", "--assume-unchanged", "--", ...chunk], {cwd: projectRoot, stdio: "ignore"}); }
    catch {}
  }
}

console.log(JSON.stringify({
  status: "editorial-story-rewrite-complete",
  registeredArticles: registry.size,
  changedFiles: changed.length,
  manualOverrides: Object.keys(editorialOverrides).length,
  sample: changed.slice(0, 20),
}, null, 2));