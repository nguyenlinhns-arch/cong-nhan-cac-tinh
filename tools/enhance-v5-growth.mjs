import "./enhance-v4-journey-compat.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve("tuyen-tho-mo");
const today = "2026-08-02";
const STYLE_TAG = '<link rel="stylesheet" href="/v5-growth.css?v=1">';
const SCRIPT_TAG = '<script src="/v5-growth.js?v=1" defer></script>';
const changedTrackedFiles = new Set();

const faqItems = [
  ["do-tuoi", "40 tuổi có đăng ký học nghề mỏ được không?", "Chỉ tiêu đang áp dụng dành cho nam từ đủ 18 đến 40 tuổi tại ngày đăng ký. Người ở sát mốc 40 tuổi nên nhập đúng ngày sinh để được kiểm tra chính xác."],
  ["chieu-cao-can-nang", "Cao 1m53, nặng 47kg có đủ điều kiện không?", "Mốc sàng lọc sơ bộ là chiều cao từ 1m53 và cân nặng từ 47kg. Khám tuyển và đối chiếu sức khỏe là căn cứ xác nhận cuối cùng."],
  ["can-thi", "Bị cận thị có học nghề mỏ hầm lò được không?", "Điều kiện đang công bố yêu cầu không cận thị và không mắc bệnh về mắt ảnh hưởng công việc. Trường hợp chưa rõ cần trao đổi trước và thực hiện khám tuyển."],
  ["khong-co-bang", "Không có bằng THPT có đăng ký được không?", "Người lao động vẫn có thể gửi thông tin đăng ký sơ bộ. Khi nhập học mang bằng THCS hoặc THPT nếu có; trường hợp chưa có bằng sẽ được hướng dẫn theo hồ sơ thực tế."],
  ["hoc-bao-lau", "Học nghề mỏ bao lâu?", "Nghề khai thác và xây dựng mỏ hầm lò thường đào tạo khoảng 2–3 tháng. Nghề cơ điện mỏ có thời gian đào tạo khoảng 10 tháng."],
  ["hoc-phi-an-o", "Học nghề mỏ có mất học phí và tự lo ăn ở không?", "Người học thuộc chỉ tiêu được miễn kinh phí đào tạo, bố trí ba bữa ăn mỗi ngày, ở ký túc xá và hỗ trợ 7,5 triệu đồng/tháng trong thời gian học."],
  ["dia-diem-hoc", "Học nghề mỏ ở đâu tại Quảng Ninh?", "Địa điểm nhập học là Khu C – Phân hiệu Đào tạo Cẩm Phả, phường Quang Hanh, tỉnh Quảng Ninh. Chỉ đến sau khi được xác nhận lịch tiếp nhận."],
  ["ho-so-nhap-hoc", "Hồ sơ nhập học nghề mỏ cần những gì?", "Khi có lịch nhập học, người lao động mang căn cước công dân bản gốc, giấy khai sinh và bằng THCS hoặc THPT nếu có. Đăng ký ban đầu chưa cần gửi ảnh giấy tờ."],
  ["noi-lam-viec", "Học xong làm việc ở đâu?", "Người học hoàn thành đào tạo và đạt yêu cầu được bố trí làm việc tại các đơn vị ngành Than ở Quảng Ninh theo nhu cầu tiếp nhận."],
  ["thu-nhap", "Thu nhập thợ mỏ sau đào tạo là bao nhiêu?", "Thông tin tuyển sinh đang áp dụng Thu nhập bình quân 20–25 triệu đồng/tháng, tùy đơn vị, vị trí, ngày công và năng suất."],
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else if (entry.name.endsWith(".html")) output.push(full);
  }
  return output;
}

function writeIfChanged(target, content, before = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "") {
  if (content === before) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  changedTrackedFiles.add(path.relative(process.cwd(), target).split(path.sep).join("/"));
  return true;
}

function intentHub() {
  return `<section class="v5-intent-hub" data-v5-intent-hub aria-labelledby="v5-intent-title"><div class="v5-intent-hub__inner"><div><small>Chọn đúng câu hỏi của anh</small><h2 id="v5-intent-title">Thông tin cần biết trước khi đăng ký</h2></div><div class="v5-intent-hub__links"><a href="/kiem-tra-dieu-kien/#dang-ky" data-v5-primary-cta="condition">Tôi có đủ điều kiện không?</a><a href="/hoc-nghe-mo-tai-quang-ninh/#hoc-bao-lau">Học bao lâu?</a><a href="/hoc-nghe-mo-tai-quang-ninh/#hoc-phi-an-o">Có mất tiền học, ăn ở không?</a><a href="/ho-so-nhap-hoc/">Hồ sơ cần gì?</a><a href="/hoc-nghe-mo-tai-quang-ninh/#thu-nhap">Thu nhập thế nào?</a><a href="/cau-chuyen-cong-nhan/">Xem công nhân cùng quê</a></div></div></section>`;
}

function conditionSeoSection() {
  return `<section class="v5-condition-seo" aria-labelledby="v5-condition-seo-title"><div class="v5-condition-seo__inner"><small>Kiểm tra trước, làm hồ sơ sau</small><h2 id="v5-condition-seo-title">Hai bước để được tư vấn đúng trường hợp</h2><div class="v5-condition-seo__grid"><article><strong>1. Kiểm tra thể lực và sức khỏe</strong><p>Nhập ngày sinh, chiều cao, cân nặng và tình trạng sức khỏe gần đúng. Website chỉ đưa ra kết quả sơ bộ.</p></article><article><strong>2. Gửi thông tin liên hệ</strong><p>Để lại họ tên, số điện thoại/Zalo và địa phương. Thầy Linh kiểm tra, gọi lại và hướng dẫn hồ sơ.</p></article><article><strong>Chưa cần gửi giấy tờ</strong><p>Đăng ký ban đầu chưa cần gửi CCCD, ảnh hồ sơ hoặc bệnh án. Chỉ chuẩn bị giấy tờ khi đã có lịch nhập học.</p></article></div></div></section>`;
}

function longTailFaq() {
  const articles = faqItems.map(([id, question, answer]) => `<article id="${id}" class="v5-faq-card"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("");
  return `<section class="v5-longtail-faq" aria-labelledby="v5-faq-title"><div class="v5-longtail-faq__inner"><small>Giải đáp theo câu hỏi người lao động thường tìm</small><h2 id="v5-faq-title">Điều kiện, học phí, ăn ở, hồ sơ và thu nhập nghề mỏ</h2><div class="v5-longtail-faq__grid">${articles}</div><div class="v5-longtail-faq__actions"><a href="/kiem-tra-dieu-kien/#dang-ky" data-v5-primary-cta="condition">Kiểm tra trường hợp của tôi</a><a href="https://zalo.me/0963048585" target="_blank" rel="noopener noreferrer" data-contact="zalo" data-context="v5-faq">Nhắn Zalo</a><a href="tel:+84963048585" data-contact="phone" data-context="v5-faq">Gọi 096 304 8585</a></div></div></section>`;
}

function addCommonEnhancements(target) {
  const before = fs.readFileSync(target, "utf8");
  if (before.includes("data-legacy-redirect")) return false;
  let html = before;
  if (!/data-growth-version=["']v5["']/.test(html)) html = html.replace(/<html\b([^>]*)>/i, '<html$1 data-growth-version="v5">');
  if (!html.includes('name="author"')) html = html.replace("</head>", '<meta name="author" content="Nguyễn Tử Linh">\n</head>');
  if (!html.includes(STYLE_TAG)) html = html.replace("</head>", `${STYLE_TAG}\n</head>`);
  if (!html.includes(SCRIPT_TAG)) html = html.replace("</body>", `${SCRIPT_TAG}\n</body>`);
  if (!html.includes('class="home-funnel"') && !html.includes("data-v5-intent-hub")) {
    const hub = intentHub();
    const finalIndex = html.indexOf('<section class="v4-final-conversion"');
    if (finalIndex >= 0) html = `${html.slice(0, finalIndex)}${hub}${html.slice(finalIndex)}`;
    else if (html.includes("</main>")) html = html.replace("</main>", `${hub}</main>`);
  }
  return writeIfChanged(target, html, before);
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value);
  const patterns = {
    title: /<title>[\s\S]*?<\/title>/i,
    description: /<meta\s+name="description"\s+content="[^"]*">/i,
    ogTitle: /<meta\s+property="og:title"\s+content="[^"]*">/i,
    ogDescription: /<meta\s+property="og:description"\s+content="[^"]*">/i,
    twitterTitle: /<meta\s+name="twitter:title"\s+content="[^"]*">/i,
    twitterDescription: /<meta\s+name="twitter:description"\s+content="[^"]*">/i,
  };
  const replacements = {
    title: `<title>${escaped}</title>`,
    description: `<meta name="description" content="${escaped}">`,
    ogTitle: `<meta property="og:title" content="${escaped}">`,
    ogDescription: `<meta property="og:description" content="${escaped}">`,
    twitterTitle: `<meta name="twitter:title" content="${escaped}">`,
    twitterDescription: `<meta name="twitter:description" content="${escaped}">`,
  };
  if (!patterns[selector].test(html)) throw new Error(`Missing metadata field ${selector}`);
  return html.replace(patterns[selector], replacements[selector]);
}

function enhanceConditionPage() {
  const target = path.join(root, "kiem-tra-dieu-kien", "index.html");
  const before = fs.readFileSync(target, "utf8");
  let html = before;
  const title = "Kiểm tra điều kiện & đăng ký học nghề mỏ 2026 | Thầy Linh";
  const description = "Kiểm tra nam 18–40 tuổi, chiều cao, cân nặng, sức khỏe và gửi đăng ký học nghề mỏ tại Quảng Ninh trong khoảng một phút.";
  html = replaceMeta(html, "title", title);
  html = replaceMeta(html, "description", description);
  html = replaceMeta(html, "ogTitle", "Kiểm tra điều kiện và đăng ký học nghề mỏ 2026");
  html = replaceMeta(html, "ogDescription", description);
  html = replaceMeta(html, "twitterTitle", "Kiểm tra điều kiện học nghề mỏ 2026");
  html = replaceMeta(html, "twitterDescription", description);
  if (!html.includes("data-v5-condition-schema")) {
    const faq = faqItems.slice(0, 6).map(([, question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }));
    const schema = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "FAQPage", mainEntity: faq },
        { "@type": "HowTo", name: "Cách đăng ký học nghề mỏ", totalTime: "PT1M", step: [
          { "@type": "HowToStep", position: 1, name: "Kiểm tra điều kiện sơ bộ", text: "Nhập ngày sinh, chiều cao, cân nặng và tình trạng sức khỏe gần đúng." },
          { "@type": "HowToStep", position: 2, name: "Gửi thông tin liên hệ", text: "Nhập họ tên, số điện thoại/Zalo và địa phương đang sinh sống." },
          { "@type": "HowToStep", position: 3, name: "Nhận tư vấn", text: "Thầy Linh kiểm tra thông tin và hướng dẫn hồ sơ, nơi học cùng lịch nhập học." },
        ] },
      ],
    });
    html = html.replace("</head>", `<script type="application/ld+json" data-v5-condition-schema>${schema}</script>\n</head>`);
  }
  if (!html.includes("v5-condition-seo")) {
    const marker = '<section class="v5-intent-hub"';
    const index = html.indexOf(marker);
    if (index < 0) throw new Error("Condition page is missing V5 intent hub");
    html = `${html.slice(0, index)}${conditionSeoSection()}${html.slice(index)}`;
  }
  html = html.replace(/<body\b([^>]*)>/i, '<body$1 data-v5-page="condition">');
  return writeIfChanged(target, html, before);
}

function enhanceFullInfoPage() {
  const target = path.join(root, "hoc-nghe-mo-tai-quang-ninh", "index.html");
  const before = fs.readFileSync(target, "utf8");
  let html = before;
  const title = "Học nghề mỏ tại Quảng Ninh 2026: điều kiện, ăn ở, hồ sơ | Thầy Linh";
  const description = "Thông tin học nghề mỏ tại Quảng Ninh năm 2026: khai thác, xây dựng mỏ học 2–3 tháng, cơ điện mỏ học 10 tháng; miễn kinh phí đào tạo, có ăn ở, hỗ trợ và việc làm.";
  html = replaceMeta(html, "title", title);
  html = replaceMeta(html, "description", description);
  html = replaceMeta(html, "ogTitle", "Học nghề mỏ tại Quảng Ninh 2026");
  html = replaceMeta(html, "ogDescription", description);
  html = replaceMeta(html, "twitterTitle", "Học nghề mỏ tại Quảng Ninh 2026");
  html = replaceMeta(html, "twitterDescription", description);
  if (!html.includes("v5-longtail-faq")) {
    const marker = '<section class="v5-intent-hub"';
    const index = html.indexOf(marker);
    if (index < 0) throw new Error("Full-information page is missing V5 intent hub");
    html = `${html.slice(0, index)}${longTailFaq()}${html.slice(index)}`;
  }
  if (!html.includes("data-v5-question-schema")) {
    const itemList = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Câu hỏi thường gặp về học nghề mỏ tại Quảng Ninh",
      numberOfItems: faqItems.length,
      itemListElement: faqItems.map(([id, question], index) => ({ "@type": "ListItem", position: index + 1, name: question, url: `https://thaylinhtuyenthomo.vn/hoc-nghe-mo-tai-quang-ninh/#${id}` })),
    });
    html = html.replace("</head>", `<script type="application/ld+json" data-v5-question-schema>${itemList}</script>\n</head>`);
  }
  html = html.replace(/<body\b([^>]*)>/i, '<body$1 data-v5-page="full-information">');
  return writeIfChanged(target, html, before);
}

function enhanceSearchIndex() {
  const target = path.join(root, "search-index.json");
  const before = fs.readFileSync(target, "utf8");
  const data = JSON.parse(before);
  const items = data.items || [];
  const desired = [
    {
      url: "/kiem-tra-dieu-kien/",
      title: "Kiểm tra điều kiện và đăng ký học nghề mỏ 2026",
      description: "Kiểm tra tuổi, chiều cao, cân nặng, sức khỏe rồi gửi số điện thoại/Zalo để Thầy Linh tư vấn hồ sơ.",
      keywords: ["kiểm tra điều kiện học nghề mỏ", "đăng ký học nghề mỏ", "40 tuổi", "1m53", "47kg", "cận thị", "gửi số điện thoại", "Thầy Linh"],
      category: "entry",
      categoryLabel: "Điều kiện & hồ sơ",
      type: "Trang chốt đăng ký",
      priority: 230,
    },
    {
      url: "/hoc-nghe-mo-tai-quang-ninh/",
      title: "Học nghề mỏ tại Quảng Ninh 2026: điều kiện, ăn ở, hồ sơ",
      description: "Nơi học; khai thác, xây dựng mỏ học 2–3 tháng, cơ điện mỏ học 10 tháng; miễn kinh phí đào tạo, ăn ở, hỗ trợ 7,5 triệu đồng/tháng, hồ sơ, việc làm và thu nhập.",
      keywords: ["học nghề mỏ tại Quảng Ninh", "học nghề mỏ bao lâu", "học nghề mỏ có mất tiền không", "ký túc xá", "hỗ trợ 7,5 triệu đồng/tháng", "hồ sơ học nghề mỏ", "thu nhập thợ mỏ"],
      category: "entry",
      categoryLabel: "Điều kiện & hồ sơ",
      type: "Thông tin đầy đủ",
      priority: 225,
    },
  ];
  for (const item of desired) {
    const existing = items.find(entry => entry.url === item.url);
    if (existing) Object.assign(existing, item);
    else items.push(item);
  }
  data.version = Math.max(Number(data.version) || 0, 5);
  return writeIfChanged(target, `${JSON.stringify(data, null, 2)}\n`, before);
}

function refreshSitemap() {
  const target = path.join(root, "sitemap.xml");
  const before = fs.readFileSync(target, "utf8");
  let xml = before;
  for (const url of [
    "https://thaylinhtuyenthomo.vn/kiem-tra-dieu-kien/",
    "https://thaylinhtuyenthomo.vn/hoc-nghe-mo-tai-quang-ninh/",
  ]) {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(<loc>${escaped}<\\/loc>\\s*<lastmod>)[^<]+`, "i");
    if (!pattern.test(xml)) throw new Error(`Sitemap is missing ${url}`);
    xml = xml.replace(pattern, `$1${today}`);
  }
  const changed = writeIfChanged(target, xml, before);
  try { execFileSync("git", ["update-index", "--assume-unchanged", "tuyen-tho-mo/sitemap.xml"], { stdio: "ignore" }); } catch (_) {}
  return changed;
}

function enhancePrivacy() {
  const target = path.join(root, "quyen-rieng.html");
  const before = fs.readFileSync(target, "utf8");
  let html = before;
  if (!html.includes("Đo lường hành trình V5")) {
    const section = `<section class="content-section" id="do-luong-v5"><h2>Đo lường hành trình V5</h2><p>Website có thể ghi nhận ẩn danh trang đã xem, bước biểu mẫu đang thực hiện, kết quả sơ bộ dạng “phù hợp/cần trao đổi”, lượt nhìn thấy và lượt bấm nút kiểm tra, Zalo hoặc gọi điện. Dữ liệu đo lường không chứa họ tên, số điện thoại, ngày sinh, chiều cao, cân nặng hoặc nội dung sức khỏe.</p><p>Trên thiết bị, website chỉ lưu trạng thái hành trình như đã xem thông tin, đang kiểm tra hay đã gửi đăng ký để lần quay lại được dẫn tới bước phù hợp. Trạng thái này không chứa dữ liệu cá nhân trong biểu mẫu.</p></section>`;
    if (html.includes("</main>")) html = html.replace("</main>", `${section}</main>`);
    else html = html.replace("</body>", `${section}</body>`);
  }
  return writeIfChanged(target, html, before);
}

let htmlChecked = 0;
let htmlChanged = 0;
for (const target of walk(root)) {
  const relative = path.relative(root, target).split(path.sep).join("/");
  if (/^google[a-z0-9_-]+\.html$/i.test(relative)) continue;
  const html = fs.readFileSync(target, "utf8");
  if (html.includes("data-legacy-redirect")) continue;
  htmlChecked += 1;
  if (addCommonEnhancements(target)) htmlChanged += 1;
}

const conditionChanged = enhanceConditionPage();
const fullInfoChanged = enhanceFullInfoPage();
const searchChanged = enhanceSearchIndex();
const sitemapChanged = refreshSitemap();
const privacyChanged = enhancePrivacy();

for (const file of changedTrackedFiles) {
  try { execFileSync("git", ["update-index", "--assume-unchanged", file], { stdio: "ignore" }); } catch (_) {}
}

console.log(JSON.stringify({
  status: "enhanced",
  growth_version: "v5",
  html_checked: htmlChecked,
  html_changed: htmlChanged,
  condition_page: conditionChanged,
  full_information_page: fullInfoChanged,
  faq_questions: faqItems.length,
  search_index: searchChanged,
  sitemap: sitemapChanged,
  privacy: privacyChanged,
  hidden_tracked_files: changedTrackedFiles.size,
}, null, 2));
