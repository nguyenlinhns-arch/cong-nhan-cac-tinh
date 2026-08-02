import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const target = path.resolve("tuyen-tho-mo", "mobile-ux.js");
let source = fs.readFileSync(target, "utf8");
const beforeBytes = Buffer.byteLength(source);
const beforeSha256 = crypto.createHash("sha256").update(source).digest("hex");
const markers = ["const SEARCH_STOP_WORDS = new Set([", "function normalizeSearchQuery(value)", "function rankSearchItems(value, source, category = \"all\")", "window.thayLinhSearchTest"];
if (markers.every((marker) => source.includes(marker))) {
  console.log(JSON.stringify({target: "tuyen-tho-mo/mobile-ux.js", status: "already-enhanced", beforeBytes, beforeSha256}, null, 2));
  process.exit(0);
}
if (markers.some((marker) => source.includes(marker))) throw new Error("Natural-language search is only partially present");

const helperBlock = String.raw`
  const SEARCH_STOP_WORDS = new Set([
    "toi", "em", "minh", "anh", "chi", "ban", "co", "duoc", "di", "khong", "ko", "k",
    "nao", "la", "phai", "can", "muon", "hoi", "a", "thi", "the", "sao", "tu", "o",
    "bao", "nhieu", "may", "nhu", "vay", "cho", "voi", "cua", "roi", "nhe", "nhi",
    "hay", "se", "dang", "da", "gi", "que",
  ]);

  const SEARCH_INTENTS = [
    { key: "dossier", preferredUrl: "/#ho-so", category: "entry", canonical: "ho so", patterns: [/\bho so\b/, /\bgiay to\b/, /\bcccd\b/, /\bcan cuoc\b/, /\b(?:khong|ko|chua) co bang\b/, /\bbang cap\b/, /\bcan mang gi\b/, /\bhs\b/, /\bhso\b/, /\bgiayto\b/] },
    { key: "address", preferredUrl: "/#dia-diem", category: "entry", canonical: "dia chi nhap hoc", patterns: [/\bdia chi\b/, /\bhoc o dau\b/, /\bnhap hoc o dau\b/, /\btruong o dau\b/, /\bquang hanh\b/, /\bkhu c\b/, /\bphan hieu\b/] },
    { key: "benefits", preferredUrl: "/#ho-tro-hoc-nghe", category: "welfare", canonical: "ho tro hoc phi", patterns: [/\bhoc phi\b/, /\bdong tien hoc\b/, /\bmien phi\b/, /\ban o\b/, /\bky tuc\b/, /\bktx\b/, /\bho tro\b/, /\b7\s*5 trieu\b/] },
    { key: "income", preferredUrl: "/#quyen-loi", category: "work", canonical: "thu nhap luong", patterns: [/\bluong\b/, /\bthu nhap\b/, /\b20\s*25 trieu\b/, /\bbao nhieu tien\b/] },
    { key: "training", preferredUrl: "/#thoi-gian-hoc", category: "training", canonical: "thoi gian hoc", patterns: [/\bhoc bao lau\b/, /\bhoc bao nhieu\b/, /\bhoc may\b/, /\bmay thang\b/, /\bthoi gian hoc\b/, /\b2\s*3 thang\b/] },
    { key: "process", preferredUrl: "/#quy-trinh", category: "entry", canonical: "quy trinh dang ky", patterns: [/\bquy trinh\b/, /\bcac buoc\b/, /\bdang ky (?:nhu|the) nao\b/, /\blam sao dang ky\b/, /\bkhi nao nhap hoc\b/] },
    { key: "application", preferredUrl: "/#dang-ky", category: "recruitment", canonical: "dang ky lien he", patterns: [/\bsdt\b/, /\bso dien thoai\b/, /\bdien thoai\b/, /\bhotline\b/, /\bzalo\b/, /\blien he\b/, /\bthay linh\b/, /\bung tuyen\b/, /\bdang ky\b/] },
    { key: "conditions", preferredUrl: "/#dieu-kien", category: "entry", canonical: "dieu kien", patterns: [/\b\d{2}\s*tuoi\b/, /\b1m\d{1,2}\b/, /\b15\d\s*cm\b/, /\b\d{2,3}\s*(?:kg|can)\b/, /\bdieu kien\b/, /\bdk\b/, /\bsuc khoe\b/, /\bcan thi\b/, /\bbi can\b/, /\btim mach\b/, /\bhuyet ap\b/, /\bchieu cao\b/, /\bcan nang\b/, /\bdi duoc\b/, /\bdu dieu kien\b/] },
  ];

  function normalizeSearchQuery(value) {
    let query = normalize(value);
    const compact = query.replace(/\s+/g, "");
    const additions = [];
    if (/\b\d{2}\s*tuoi\b/.test(query)) additions.push("tuoi dieu kien");
    if (/1m\d{1,2}|15\dcm|1\d{2}cm/.test(compact) || /\b1\s+\d{2}m?\b/.test(query)) additions.push("chieu cao dieu kien");
    if (/\b\d{2,3}\s*(?:kg|can)\b/.test(query)) additions.push("can nang dieu kien");
    const replacements = [
      [/\b(?:khong|ko|chua) co bang\b/g, "ho so bang cap"], [/\bgiay to\b/g, "ho so"],
      [/\b(?:sdt|so dien thoai|dien thoai|hotline)\b/g, "lien he zalo thay linh"],
      [/\b(?:hoc phi|dong tien hoc)\b/g, "mien hoc phi ho tro"], [/\b(?:an o|ky tuc xa|ky tuc|ktx)\b/g, "ho tro an o ky tuc xa"],
      [/\bhoc (?:bao lau|bao nhieu thang|may thang|may thag)\b/g, "thoi gian hoc"],
      [/\b(?:hoc o dau|nhap hoc o dau|dia chi truong|truong o dau)\b/g, "dia chi nhap hoc quang hanh"],
      [/\b(?:luong bao nhieu|luong bn|thu nhap bao nhieu)\b/g, "luong thu nhap"],
      [/\b(?:dang ky nhu nao|dang ky the nao|lam sao dang ky)\b/g, "quy trinh dang ky"],
      [/\b(?:bi can|can thi|mat can)\b/g, "suc khoe can thi dieu kien"], [/\b(?:du dieu kien|di duoc|co nhan khong)\b/g, "dieu kien"],
    ];
    for (const [pattern, replacement] of replacements) query = query.replace(pattern, " " + replacement + " ");
    query = (query + " " + additions.join(" "))
      .replace(/\b\d{2}\s*tuoi\b/g, " ").replace(/\b1m\d{1,2}\b/g, " ").replace(/\b1\s+\d{2}m?\b/g, " ")
      .replace(/\b15\d\s*cm\b/g, " ").replace(/\b\d{2,3}\s*(?:kg|can)\b/g, " ");
    const tokens = query.split(/\s+/).filter(Boolean).filter((token) => !SEARCH_STOP_WORDS.has(token));
    return [...new Set(tokens)].join(" ");
  }

  function provinceAliases(item) {
    if (item?.category !== "province") return [];
    const aliases = [];
    const titleMatch = String(item.title || "").match(/tại\s+(.+?)(?:\s*\||$)/i);
    if (titleMatch?.[1]) aliases.push(normalize(titleMatch[1]));
    for (const keyword of Array.isArray(item.keywords) ? item.keywords : []) {
      const match = String(keyword).match(/(?:tuyển thợ mỏ|tuyển dụng ngành than|học nghề mỏ|việc làm thợ lò|việc làm ngành than)\s+(.+)$/i);
      if (match?.[1]) aliases.push(normalize(match[1]));
    }
    return [...new Set(aliases.filter((alias) => alias.length >= 3))];
  }

  function resolveSearchIntent(value, source = []) {
    const raw = normalize(value);
    const province = source.flatMap((item) => provinceAliases(item).map((alias) => ({ item, alias })))
      .filter(({ alias }) => (" " + raw + " ").includes(" " + alias + " "))
      .sort((left, right) => right.alias.length - left.alias.length)[0];
    if (province) return { key: "province", preferredUrl: province.item.url, category: "province", canonical: province.alias };
    const intent = SEARCH_INTENTS.find((candidate) => candidate.patterns.some((pattern) => pattern.test(raw)));
    return intent ? { key: intent.key, preferredUrl: intent.preferredUrl, category: intent.category, canonical: intent.canonical } : null;
  }

  function oneEditApart(left, right) {
    if (left === right) return true;
    if (Math.min(left.length, right.length) < 4 || Math.abs(left.length - right.length) > 1) return false;
    let first = 0, second = 0, edits = 0;
    while (first < left.length && second < right.length) {
      if (left[first] === right[second]) { first += 1; second += 1; continue; }
      edits += 1;
      if (edits > 1) return false;
      if (left.length > right.length) first += 1;
      else if (right.length > left.length) second += 1;
      else { first += 1; second += 1; }
    }
    return edits + Number(first < left.length || second < right.length) <= 1;
  }
`;
const pageGroupIndex = source.indexOf("  function pageGroup()");
if (pageGroupIndex < 0 || !source.includes("  const normalizePhrase =")) throw new Error("Could not locate natural-language insertion point");
source = source.slice(0, pageGroupIndex) + helperBlock + "\n" + source.slice(pageGroupIndex);

const rankingStart = source.indexOf("  function scoreItem(");
const gridStart = source.indexOf("    grid.replaceChildren();", rankingStart);
if (rankingStart < 0 || gridStart < 0) throw new Error("Could not locate search ranking block");
const rankingBlock = String.raw`  function scoreItem(item, query, intent = null) {
    const priority = Number(item.priority || 0);
    if (intent?.preferredUrl === item.url) return 1000 + priority;
    if (!query) return priority;
    const title = normalize(item.title);
    const keywords = normalize((item.keywords || []).join(" "));
    const description = normalize(item.description);
    const words = query.split(" ").filter(Boolean);
    const indexedWords = itemSearchText(item).split(" ");
    const matchedWords = words.filter((word) => indexedWords.some((candidate) =>
      candidate === word || (word.length >= 3 && candidate.startsWith(word)) || oneEditApart(candidate, word)));
    const required = words.length <= 2 ? words.length : Math.ceil(words.length * 0.67);
    if (matchedWords.length < Math.max(1, required)) return -1;
    let score = priority + (matchedWords.length * 8) - ((words.length - matchedWords.length) * 5);
    if (title === query) score += 80;
    if (title.startsWith(query)) score += 40;
    if (title.includes(query)) score += 24;
    if (keywords.includes(query)) score += 14;
    if (description.includes(query)) score += 6;
    if (intent?.category === item.category) score += 45;
    score += matchedWords.filter((word) => title.includes(word)).length * 7;
    return score;
  }

  function rankSearchItems(value, source, category = "all") {
    const intent = resolveSearchIntent(value, source);
    const query = intent?.canonical || normalizeSearchQuery(value);
    const phraseQuery = normalizePhrase(value);
    let candidates = source.filter((item) => category === "all" || item.category === category);
    if (!intent && phraseQuery.includes(" ")) {
      const phraseMatches = candidates.filter((item) => itemPhraseText(item).includes(phraseQuery));
      if (phraseMatches.length) candidates = phraseMatches;
    }
    const matches = candidates.map((item) => ({ item, score: scoreItem(item, query, intent) }))
      .filter(({ score }) => score >= 0)
      .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title, "vi"))
      .slice(0, 12).map(({ item }) => item);
    return { matches, query, intent };
  }

  function renderResults(dialog) {
    const input = dialog.querySelector("input[type='search']");
    const status = dialog.querySelector(".tl-search-status");
    const grid = dialog.querySelector(".tl-search-results__grid");
    const source = searchIndex || popular;
    const { matches, query, intent } = rankSearchItems(input.value, source, activeCategory);

`;
source = source.slice(0, rankingStart) + rankingBlock + source.slice(gridStart);

const oldStatus = '    status.textContent = query || activeCategory !== "all"\n      ? `${matches.length} nội dung phù hợp`\n      : "Các nội dung được xem nhiều";';
const newStatus = '    status.textContent = intent && matches[0]?.url === intent.preferredUrl\n      ? "Câu trả lời phù hợp nhất được đưa lên đầu"\n      : query || activeCategory !== "all"\n        ? `${matches.length} nội dung phù hợp`\n        : "Các nội dung được xem nhiều";';
if (!source.includes(oldStatus)) throw new Error("Could not locate search status block");
source = source.replace(oldStatus, newStatus);

const oldPlaceholder = 'placeholder="Ví dụ: điều kiện, hồ sơ, lương, Nghệ An…"';
if (!source.includes(oldPlaceholder)) throw new Error("Could not locate search placeholder");
source = source.replace(oldPlaceholder, 'placeholder="Ví dụ: Tôi 39 tuổi có đăng ký được không?"');

const endMarker = "  createWorkerCompass();\n  createContactButtons();";
const hook = '  if (String(location.search || "").includes("search-test=1")) {\n    window.thayLinhSearchTest = Object.freeze({ normalizeSearchQuery, resolveSearchIntent, rankSearchItems });\n  }\n\n  createWorkerCompass();\n  createContactButtons();';
if (!source.includes(endMarker)) throw new Error("Could not locate search test hook point");
source = source.replace(endMarker, hook);
for (const marker of markers) if (!source.includes(marker)) throw new Error(`Enhanced search is missing ${marker}`);
const afterBytes = Buffer.byteLength(source);
if (afterBytes > 42_000) throw new Error(`Enhanced mobile-ux.js exceeds 42 KB: ${afterBytes}`);
const afterSha256 = crypto.createHash("sha256").update(source).digest("hex");
fs.writeFileSync(target, source);
console.log(JSON.stringify({target: "tuyen-tho-mo/mobile-ux.js", status: "enhanced", beforeBytes, afterBytes, beforeSha256, afterSha256}, null, 2));
