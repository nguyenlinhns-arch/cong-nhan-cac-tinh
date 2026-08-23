import fs from "node:fs";
import path from "node:path";

const ROOT = process.env.WORKER_QUESTION_ROOT
  ? path.resolve(process.env.WORKER_QUESTION_ROOT)
  : path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const BASE = "https://thaylinhtuyenthomo.vn";
const SOURCE_ROOT = path.resolve(import.meta.dirname, "..");
const content = JSON.parse(fs.readFileSync(path.join(SOURCE_ROOT, "content", "worker-questions.json"), "utf8"));
const facts = JSON.parse(fs.readFileSync(path.join(SITE, "data", "recruitment-facts-2026.json"), "utf8"));
const errors = [];

function load(relativePath) {
  const file = path.join(SITE, relativePath);
  if (!fs.existsSync(file)) {
    errors.push(relativePath + ": thiếu tệp");
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function requireText(source, text, label) {
  if (!source.includes(text)) errors.push(label + ": thiếu " + text);
}

function graph(source, label) {
  const blocks = [...source.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!blocks.length) {
    errors.push(label + ": thiếu JSON-LD");
    return [];
  }
  try {
    return blocks.flatMap(function (block) {
      const value = JSON.parse(block[1]);
      return value["@graph"] || [value];
    });
  } catch (error) {
    errors.push(label + ": JSON-LD không hợp lệ: " + error.message);
    return [];
  }
}

const canonicalAnswers = new Map([
  ["Học nghề mỏ mất bao lâu?", `Khai thác mỏ hầm lò và xây dựng mỏ hầm lò học ${facts.training.khai_thac_mo}; kỹ thuật cơ điện mỏ hầm lò học ${facts.training.co_dien_mo}. Lịch cụ thể được xác nhận theo từng đợt.`],
  ["Công việc thợ mỏ hầm lò là làm gì?", "Ba nghề đang tiếp nhận là kỹ thuật khai thác mỏ hầm lò, kỹ thuật xây dựng mỏ hầm lò và kỹ thuật cơ điện mỏ hầm lò. Người học được đào tạo thao tác, thiết bị, an toàn và phối hợp tổ đội trước khi nhận việc."],
  ["Lương thợ lò được tính thế nào?", `Thu nhập đang áp dụng là ${facts.after_training.income_commitment}.`],
  ["Trong thời gian học có được ăn ở và hỗ trợ không?", `Người học thuộc chỉ tiêu được bố trí 3 bữa/ngày, ký túc xá khép kín và hỗ trợ ${facts.study_benefits.living_support} theo chính sách đợt tuyển.`],
]);
const expectedQuestions = content.questions.map((item) => ({
  ...item,
  answer: canonicalAnswers.get(item.question) || item.answer,
}));

if (content.questions.length !== 20) errors.push("Nguồn nội dung phải có đúng 20 câu hỏi");
if (content.pages.length !== 5) errors.push("Nguồn nội dung phải có đúng 5 trang chuyên sâu");

const hubRelative = content.hub.path.replace(/^\/|\/$/g, "") + "/index.html";
const hub = load(hubRelative);
requireText(hub, "<h1>" + content.hub.title + "</h1>", "trang trung tâm");
requireText(hub, "href='/lien-he-di-lam-mo-than-quang-ninh/'", "trang trung tâm");
requireText(hub, "/worker-questions.css?v=1", "trang trung tâm");
for (const question of expectedQuestions) {
  requireText(hub, question.question, "trang trung tâm");
  requireText(hub, question.answer, "trang trung tâm");
}
if (hub.includes("Hai hướng đang tuyển là khai thác mỏ hầm lò và xây dựng mỏ hầm lò")) errors.push("trang trung tâm: còn mô hình hai nghề");
const hubGraph = graph(hub, "trang trung tâm");
for (const type of ["CollectionPage", "FAQPage", "ItemList", "BreadcrumbList", "Person", "Organization"]) {
  const found = hubGraph.some(function (node) {
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    return types.includes(type);
  });
  if (!found) errors.push("Trang trung tâm thiếu schema " + type);
}

for (const page of content.pages) {
  const relative = page.slug + "/index.html";
  const source = load(relative);
  const url = BASE + "/" + page.slug + "/";
  for (const marker of [
    "<title>" + page.title + " | Thầy Linh</title>",
    "<h1>" + page.title + "</h1>",
    page.answer,
    "href='" + url + "'",
    "index,follow,max-image-preview:large",
    "/worker-questions.css?v=1",
    "/mobile-core.css?v=1",
    "/analytics.js?v=6",
    "/mobile-core.js?v=1",
    "Nguyễn Tử Linh (Thầy Linh)",
    "data-contact='zalo'",
  ]) requireText(source, marker, relative);
  if ((source.match(/<h1[\s>]/g) || []).length !== 1) errors.push(relative + ": phải có đúng một H1");
  const visibleWords = source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
  if (visibleWords < 450) errors.push(relative + ": nội dung quá mỏng (" + visibleWords + " từ)");
  const nodes = graph(source, relative);
  for (const type of ["WebPage", "FAQPage", "BreadcrumbList", "Person", "Organization"]) {
    const found = nodes.some(function (node) {
      const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
      return types.includes(type);
    });
    if (!found) errors.push(relative + ": thiếu schema " + type);
  }
}

const feed = JSON.parse(load("worker-questions.json") || "{}");
if ((feed.questions || []).length !== 20) errors.push("worker-questions.json phải có 20 câu hỏi");
if (feed.canonical_hub !== BASE + content.hub.path) errors.push("worker-questions.json sai URL trung tâm");
if (feed.canonical_facts_version !== facts.version) errors.push(`worker-questions.json chưa gắn facts v${facts.version}`);
for (const question of expectedQuestions) {
  const item = (feed.questions || []).find((entry) => entry.question === question.question);
  if (!item || item.direct_answer !== question.answer) errors.push(`worker-questions.json lệch câu: ${question.question}`);
}
const feedText = JSON.stringify(feed).toLocaleLowerCase("vi");
for (const legacy of ["hai hướng đang tuyển là khai thác mỏ hầm lò và xây dựng mỏ hầm lò", "bình quân 20–25 triệu", "tùy đơn vị, vị trí, ngày công và năng suất"]) {
  if (feedText.includes(legacy)) errors.push(`worker-questions.json còn legacy: ${legacy}`);
}

const home = load("index.html");
requireText(home, "data-worker-question-hub", "trang chủ");
requireText(home, "Xem đủ 20 câu hỏi", "trang chủ");
requireText(home, "/home-content.css?v=3", "trang chủ");

const contact = load("lien-he-di-lam-mo-than-quang-ninh/index.html");
requireText(contact, "20 câu hỏi cần biết trước khi đi làm mỏ", "trang liên hệ");
requireText(contact, "href=\"" + content.hub.path + "\"", "trang liên hệ");

const llms = load("llms.txt");
requireText(llms, "## Bộ câu hỏi người lao động thường tìm", "llms.txt");
requireText(llms, BASE + "/worker-questions.json", "llms.txt");

const sitemap = load("sitemap.xml");
const routes = [content.hub.path].concat(content.pages.map(function (page) { return "/" + page.slug + "/"; }));
for (const route of routes) {
  const url = BASE + route;
  const count = sitemap.split(url).length - 1;
  if (count !== 1) errors.push("Sitemap phải chứa đúng một lần " + url + ", hiện có " + count);
}

const search = ["search-index.json", "search-core.json", "search-content.json"]
  .filter(function (file) { return fs.existsSync(path.join(SITE, file)); })
  .map(load)
  .join("\n");
for (const route of routes) requireText(search, route, "chỉ mục tìm kiếm nội bộ");

console.log(JSON.stringify({
  questions: content.questions.length,
  deep_pages: content.pages.length,
  hub_pages: 1,
  canonicalFactsVersion: facts.version,
  canonicalOverrides: canonicalAnswers.size,
  errors: errors.length,
}, null, 2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
