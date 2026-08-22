import {dailyCommunityArticles} from "./daily-community-articles-all.mjs";

const issues = [];
const stats = {
  checked: 0,
  directLead: 0,
  contextReady: 0,
  sourceReady: 0,
  formulaic: 0,
  longParagraphs: 0,
};

const formulaicPatterns = [
  [/\bBài\s+(?:nguồn|báo|viết)\s+(?:cho\s+biết|nêu|ghi\s+nhận|đăng|đăng\s+tải)\b/iu, "kể quá trình lấy nguồn"],
  [/\bNguồn\s+cho\s+biết\b|\bTheo\s+nguồn\b/iu, "nhãn nguồn chung chung"],
  [/\bCó\s+thể\s+thấy\s+rằng\b|\bĐiều\s+này\s+cho\s+thấy\b/iu, "nhận định mơ hồ"],
  [/\bĐáng\s+chú\s+ý(?:\s+là)?\b/iu, "câu chuyển ý khuôn"],
  [/\bkhông\s+chỉ\b[^.!?]{0,100}\bmà\s+còn\b/iu, "cấu trúc không chỉ/mà còn"],
  [/\bĐây\s+không\s+chỉ\s+là\b|\bTrọng\s+tâm\s+không\s+chỉ\s+là\b/iu, "mở ý bằng phủ định khuôn"],
  [/\bTrong\s+bối\s+cảnh\s+(?:đó|hiện\s+nay)\b/iu, "mở ý bằng câu khuôn"],
  [/\bnhằm\s+góp\s+phần\b|\bđẩy\s+mạnh\s+công\s+tác\b|\btriển\s+khai\s+thực\s+hiện\b/iu, "văn phong hành chính"],
  [/\bđừng\s+bỏ\s+lỡ\b|\bnhanh\s+tay\b|\bcơ\s+hội\s+đổi\s+đời\b/iu, "ngôn ngữ quảng cáo gây áp lực"],
];

function text(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value = "") {
  return text(value).split(/\s+/u).filter(Boolean).length;
}

function normalize(value = "") {
  return text(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordCoverage(keyword, value) {
  const stop = new Set(["cong", "ty", "tkv", "nam", "nghe", "mo", "than", "nguoi", "lao", "dong", "viet", "quang", "ninh"]);
  const wanted = [...new Set(normalize(keyword).split(" ").filter((token) => token.length > 1 && !stop.has(token)))];
  if (!wanted.length) return 1;
  const found = new Set(normalize(value).split(" "));
  return wanted.filter((token) => found.has(token)).length / wanted.length;
}

function addIssue(article, level, reason, detail = "") {
  issues.push({
    priority: level,
    slug: article.slug || article.urlPath || "unknown",
    published: String(article.published || "").slice(0, 10),
    title: article.title || "",
    reason,
    detail,
  });
}

for (const article of dailyCommunityArticles) {
  stats.checked += 1;
  const lead = text(article.lead || article.intro?.[0] || "");
  const intro = (article.intro || []).map(text).filter(Boolean);
  const opening = `${lead} ${intro.slice(0, 2).join(" ")}`.trim();
  const leadWords = words(lead);

  if (leadWords >= 18 && leadWords <= 72) stats.directLead += 1;
  else addIssue(article, "P1", "lede chưa đạt độ dài báo chí", `${leadWords} từ`);

  const timeSignal = /\b(?:ngày|tháng|quý|năm|giai\s+đoạn)\s+(?:\d|[IVX]+)/iu.test(opening)
    || /\b\d{1,2}\/\d{1,2}\/\d{4}\b/u.test(opening)
    || /\b20\d{2}\b/u.test(opening);
  const consequenceSignal = /\b(?:giúp|để|vì vậy|do đó|quyết định|ảnh hưởng|cần|theo dõi|đối chiếu|phụ thuộc|giá trị|ý nghĩa|rủi ro|kết quả|cho thấy|phản ánh)\b/iu.test(opening);
  if (timeSignal && consequenceSignal) stats.contextReady += 1;
  else addIssue(article, "P2", "phần mở thiếu why-now/so-what");

  const primary = article.keyword || article.keywords?.[0] || article.title || "";
  const coverage = keywordCoverage(primary, opening);
  if (coverage < 0.4) addIssue(article, "P2", "phần mở chưa làm rõ chủ đề chính", `coverage=${coverage.toFixed(2)}`);

  let hasFormulaic = false;
  const copy = [
    lead,
    ...intro,
    ...(article.sections || []).flatMap((section) => [section.title, ...(section.paragraphs || [])]),
    article.conclusionTitle,
    article.conclusion,
  ].filter(Boolean).join(" ");
  for (const [pattern, reason] of formulaicPatterns) {
    if (!pattern.test(copy)) continue;
    hasFormulaic = true;
    addIssue(article, "P1", reason);
  }
  if (hasFormulaic) stats.formulaic += 1;

  const paragraphs = [
    ...intro,
    ...(article.sections || []).flatMap((section) => section.paragraphs || []),
  ];
  for (const paragraph of paragraphs) {
    const count = words(paragraph);
    if (count <= 125) continue;
    stats.longParagraphs += 1;
    addIssue(article, "P3", "đoạn quá dài cho màn hình điện thoại", `${count} từ`);
  }

  if (Array.isArray(article.sources) && article.sources.length && article.sources.every((source) => source.publisher && source.title && source.date)) {
    stats.sourceReady += 1;
  } else {
    addIssue(article, "P0", "thiếu metadata nguồn đầy đủ");
  }
}

const priorityOrder = {P0: 0, P1: 1, P2: 2, P3: 3};
issues.sort((a, b) => (priorityOrder[a.priority] - priorityOrder[b.priority])
  || String(b.published).localeCompare(String(a.published))
  || a.slug.localeCompare(b.slug));

const perArticle = new Map();
for (const issue of issues) {
  const current = perArticle.get(issue.slug) || {priority: issue.priority, slug: issue.slug, title: issue.title, published: issue.published, issues: []};
  if (priorityOrder[issue.priority] < priorityOrder[current.priority]) current.priority = issue.priority;
  current.issues.push(issue.reason + (issue.detail ? ` (${issue.detail})` : ""));
  perArticle.set(issue.slug, current);
}
const queue = [...perArticle.values()].sort((a, b) => (priorityOrder[a.priority] - priorityOrder[b.priority])
  || String(b.published).localeCompare(String(a.published)));

console.log(JSON.stringify({
  status: "audit-complete",
  ...stats,
  articlesWithIssues: queue.length,
  totalIssues: issues.length,
  queue: queue.slice(0, 100),
}, null, 2));
