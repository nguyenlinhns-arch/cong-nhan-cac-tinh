import fs from "node:fs";
import path from "node:path";

const ROOT = process.env.WORKER_QUESTION_ROOT
  ? path.resolve(process.env.WORKER_QUESTION_ROOT)
  : path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "tuyen-tho-mo");
const BASE = "https://thaylinhtuyenthomo.vn";
const PHONE = "096 304 8585";
const PHONE_E164 = "+84963048585";
const AUTHOR_ID = BASE + "/tac-gia/nguyen-tu-linh/#person";
const ORG_ID = BASE + "/#organization";
const WEBSITE_ID = BASE + "/#website";
const SOURCE_ROOT = path.resolve(import.meta.dirname, "..");
const content = JSON.parse(fs.readFileSync(path.join(SOURCE_ROOT, "content", "worker-questions.json"), "utf8"));
const HUB_PATH = content.hub.path;

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function write(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
}

write(
  "tuyen-tho-mo/worker-questions.css",
  fs.readFileSync(path.join(SOURCE_ROOT, "tuyen-tho-mo", "worker-questions.css"), "utf8"),
);

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error("Không tìm thấy mốc để cập nhật " + label);
  return source.replace(search, replacement);
}

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function personNode() {
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: "Nguyễn Tử Linh",
    alternateName: ["Thầy Linh", "Thầy Linh – Tuyển Thợ Mỏ"],
    url: BASE + "/tac-gia/nguyen-tu-linh/",
    image: BASE + "/assets/thay-linh-avatar.webp",
    telephone: PHONE_E164,
    jobTitle: "Trưởng phòng Tuyển sinh Miền Trung",
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: "Trường Cao đẳng Than - Khoáng sản Việt Nam",
    },
  };
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Thầy Linh – Tuyển Thợ Mỏ",
    url: BASE + "/",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_E164,
      contactType: "Tư vấn tuyển sinh nghề mỏ",
      areaServed: "VN",
      availableLanguage: "vi",
    },
  };
}

function faqEntities(entries) {
  return entries.map(function (entry) {
    const question = Array.isArray(entry) ? entry[0] : entry.question;
    const answer = Array.isArray(entry) ? entry[1] : entry.answer;
    return {
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    };
  });
}

function header() {
  return "<header class='network-header'><div class='network-wrap network-header__inner'><a class='network-brand' href='/' aria-label='Trang chủ Thầy Linh'><img src='/assets/thay-linh-avatar.webp?v=3' alt='' width='44' height='44'><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><nav class='network-nav' aria-label='Thông tin nghề mỏ'><a href='" + HUB_PATH + "'>20 câu hỏi</a><a href='/thong-tin-tuyen-tho-mo/'>Thông tin chuẩn</a><a href='/viec-lam-nganh-than/'>Theo tỉnh</a><a href='/cam-nang-nghe-mo/'>Cẩm nang</a></nav><a class='network-apply' href='/kiem-tra-dieu-kien/' data-contact='condition' data-context='worker-question-header'>Kiểm tra điều kiện</a></div></header>";
}

function footer() {
  return "<footer class='network-footer'><div class='network-wrap network-footer__inner'><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Thông tin học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div><div><a href='" + HUB_PATH + "'>20 câu hỏi trước khi đi mỏ</a><a href='/hoc-nghe-mo-tai-quang-ninh/'>Học nghề mỏ</a><a href='/ho-so-nhap-hoc/'>Hồ sơ nhập học</a></div><div><a href='/tac-gia/nguyen-tu-linh/'>Người phụ trách</a><a href='https://zalo.me/0963048585' target='_blank' rel='noopener' data-contact='zalo' data-context='worker-question-footer'>Zalo " + PHONE + "</a><a href='tel:" + PHONE_E164 + "' data-contact='phone' data-context='worker-question-footer'>Gọi " + PHONE + "</a></div></div></footer>";
}

function pageHead(title, description, url, graph) {
  return "<head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1,viewport-fit=cover'><meta name='theme-color' content='#063c46'><title>" + html(title) + " | Thầy Linh</title><meta name='description' content='" + html(description) + "'><meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'><meta name='author' content='Nguyễn Tử Linh'><link rel='author' href='/tac-gia/nguyen-tu-linh/'><link rel='canonical' href='" + url + "'><link rel='icon' href='/favicon.ico'><link rel='icon' href='/favicon-48x48.png' type='image/png' sizes='48x48'><link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180'><link rel='manifest' href='/manifest.webmanifest'><link rel='alternate' type='application/rss+xml' title='Bài mới – Thầy Linh Tuyển Thợ Mỏ' href='/feed.xml'><link rel='alternate' type='application/feed+json' title='Bài mới – Thầy Linh Tuyển Thợ Mỏ' href='/feed.json'><meta property='og:type' content='website'><meta property='og:locale' content='vi_VN'><meta property='og:site_name' content='Thầy Linh – Tuyển Thợ Mỏ'><meta property='og:title' content='" + html(title) + "'><meta property='og:description' content='" + html(description) + "'><meta property='og:url' content='" + url + "'><meta property='og:image' content='" + BASE + "/assets/og-cover-luong-25-trieu-v4.jpg'><meta property='og:image:width' content='1200'><meta property='og:image:height' content='630'><meta property='og:image:alt' content='Thầy Linh – Tuyển thợ mỏ tại Quảng Ninh'><meta name='twitter:card' content='summary_large_image'><meta name='twitter:title' content='" + html(title) + "'><meta name='twitter:description' content='" + html(description) + "'><meta name='twitter:image' content='" + BASE + "/assets/og-cover-luong-25-trieu-v4.jpg'><link rel='stylesheet' href='/fonts.css?v=2'><link rel='stylesheet' href='/content-network.css?v=1'><link rel='stylesheet' href='/worker-questions.css?v=1'><link rel='stylesheet' href='/mobile-core.css?v=1'><link rel='stylesheet' href='/site-shell-20260803.css?v=3'><script type='application/ld+json'>" + JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) + "</script></head>";
}

function renderSection(section, index) {
  const paragraphs = (section.paragraphs || []).map(function (paragraph) {
    return "<article class='wq-panel'><p>" + html(paragraph) + "</p></article>";
  }).join("");
  const items = (section.items || []).map(function (item) {
    return "<li>" + html(item) + "</li>";
  }).join("");
  const body = paragraphs
    ? "<div class='wq-two'>" + paragraphs + "</div>"
    : "<div class='wq-panel'><ol>" + items + "</ol></div>";
  return "<section" + (section.id ? " id='" + section.id + "'" : "") + " class='wq-section" + (index % 2 ? " wq-section--soft" : "") + "'><div class='network-wrap'><div class='wq-section__heading'><p class='network-eyebrow'>HIỂU RÕ TRƯỚC KHI CHỌN</p><h2>" + html(section.heading) + "</h2></div>" + body + "</div></section>";
}

function deepGraph(page, url) {
  return [
    {
      "@type": "WebPage",
      "@id": url + "#webpage",
      url: url,
      name: page.title,
      description: page.meta,
      inLanguage: "vi-VN",
      datePublished: content.updated_at,
      dateModified: content.updated_at,
      mainEntity: { "@id": url + "#faq" },
      isPartOf: { "@id": WEBSITE_ID },
      author: { "@id": AUTHOR_ID },
      publisher: { "@id": ORG_ID },
      breadcrumb: { "@id": url + "#breadcrumb" },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["#tra-loi-ngan", ".wq-summary"] },
      about: page.title,
    },
    {
      "@type": "FAQPage",
      "@id": url + "#faq",
      mainEntity: faqEntities(page.faqs),
    },
    {
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: BASE + "/" },
        { "@type": "ListItem", position: 2, name: "Hỏi đáp đi làm mỏ", item: BASE + HUB_PATH },
        { "@type": "ListItem", position: 3, name: page.short_title, item: url },
      ],
    },
    personNode(),
    organizationNode(),
  ];
}

function deepPage(page) {
  const route = "/" + page.slug + "/";
  const url = BASE + route;
  const facts = page.facts.map(function (fact, index) {
    return "<article class='wq-card'><b>" + String(index + 1).padStart(2, "0") + "</b><h3>" + html(fact[0]) + "</h3><p>" + html(fact[1]) + "</p></article>";
  }).join("");
  const sections = page.sections.map(renderSection).join("");
  const faqs = page.faqs.map(function (entry) {
    return "<details><summary>" + html(entry[0]) + "</summary><p>" + html(entry[1]) + "</p></details>";
  }).join("");
  const related = page.related.map(function (entry) {
    return "<a href='" + entry[0] + "'>" + html(entry[1]) + " →</a>";
  }).join("");
  return "<!doctype html><html lang='vi'>" + pageHead(page.title, page.meta, url, deepGraph(page, url)) + "<body class='worker-question-page'><a class='network-skip' href='#noi-dung'>Đến nội dung chính</a>" + header() + "<main id='noi-dung'><section class='wq-hero'><div class='network-wrap wq-hero__grid'><div><p class='network-eyebrow'>" + html(page.eyebrow) + "</p><h1>" + html(page.title) + "</h1><p class='wq-hero__lead' id='tra-loi-ngan'>" + html(page.answer) + "</p><div class='wq-actions'><a class='wq-button wq-button--hot' href='https://zalo.me/0963048585' target='_blank' rel='noopener' data-contact='zalo' data-context='worker-question-hero'>Hỏi Thầy Linh qua Zalo</a><a class='wq-button' href='" + HUB_PATH + "'>Xem đủ 20 câu hỏi</a></div></div><aside class='wq-answer'><small>ĐIỀU CẦN NHỚ</small><strong>" + html(page.short_title) + "</strong><p>" + html(page.note) + "</p></aside></div></section><section class='wq-section'><div class='network-wrap'><div class='wq-section__heading'><p class='network-eyebrow'>TRẢ LỜI THEO TỪNG Ý</p><h2>Những điểm người lao động cần nắm</h2></div><p class='wq-summary'>" + html(page.answer) + "</p><div class='wq-card-grid'>" + facts + "</div></div></section>" + sections + "<section class='wq-section'><div class='network-wrap'><div class='wq-section__heading'><p class='network-eyebrow'>NGUỒN VÀ NGƯỜI CHỊU TRÁCH NHIỆM</p><h2>Thông tin được đối chiếu như thế nào?</h2></div><p class='wq-source'><strong>Nguồn đối chiếu.</strong> " + html(page.source) + "</p><div class='wq-author'><img src='/assets/thay-linh-avatar.webp?v=3' alt='Nguyễn Tử Linh – Thầy Linh' width='80' height='80' loading='lazy'><div><strong>Nguyễn Tử Linh (Thầy Linh)</strong><p>Trưởng phòng Tuyển sinh Miền Trung · trực tiếp kiểm tra điều kiện, hướng dẫn hồ sơ và lịch nhập học nghề mỏ.</p><a href='/tac-gia/nguyen-tu-linh/'>Xem hồ sơ người phụ trách →</a></div></div></div></section><section class='wq-section wq-section--soft'><div class='network-wrap wq-faq'><p class='network-eyebrow'>CÂU HỎI LIÊN QUAN</p><h2>Người lao động cũng thường hỏi</h2>" + faqs + "</div></section><section class='wq-section'><div class='network-wrap'><p class='network-eyebrow'>ĐỌC TIẾP</p><h2>Ba nội dung nên xem cùng</h2><div class='wq-related'>" + related + "</div></div></section><section class='wq-final'><div class='network-wrap'><div><h2>Kiểm tra điều kiện trước khi chuẩn bị hồ sơ</h2><p>Chưa cần lên Quảng Ninh. Gửi năm sinh, nơi ở, chiều cao, cân nặng và sức khỏe để được kiểm tra trước.</p></div><div class='wq-actions'><a class='wq-button wq-button--hot' href='https://zalo.me/0963048585' target='_blank' rel='noopener' data-contact='zalo' data-context='worker-question-final'>Nhắn Zalo</a><a class='wq-button' href='/kiem-tra-dieu-kien/'>Kiểm tra điều kiện</a></div></div></section></main>" + footer() + "<script src='/analytics.js?v=6' defer></script><script src='/mobile-core.js?v=1' defer></script><script src='/site-shell-20260803.js?v=3' defer></script></body></html>\n";
}

function hubPage() {
  const url = BASE + HUB_PATH;
  const groups = [...new Set(content.questions.map(function (question) { return question.group; }))];
  const groupsHtml = groups.map(function (group) {
    const cards = content.questions.filter(function (question) {
      return question.group === group;
    }).map(function (question) {
      return "<article><h3>" + html(question.question) + "</h3><p>" + html(question.answer) + "</p><a href='" + question.path + "'>Xem câu trả lời đầy đủ →</a></article>";
    }).join("");
    return "<section class='wq-group'><h2>" + html(group) + "</h2><div class='wq-list'>" + cards + "</div></section>";
  }).join("");
  const graph = [
    {
      "@type": ["WebPage", "CollectionPage"],
      "@id": url + "#webpage",
      url: url,
      name: content.hub.title,
      description: content.hub.meta,
      inLanguage: "vi-VN",
      datePublished: content.updated_at,
      dateModified: content.updated_at,
      mainEntity: { "@id": url + "#faq" },
      isPartOf: { "@id": WEBSITE_ID },
      author: { "@id": AUTHOR_ID },
      publisher: { "@id": ORG_ID },
      breadcrumb: { "@id": url + "#breadcrumb" },
      speakable: { "@type": "SpeakableSpecification", cssSelector: [".wq-hero__lead", ".wq-list article"] },
    },
    { "@type": "FAQPage", "@id": url + "#faq", mainEntity: faqEntities(content.questions) },
    {
      "@type": "ItemList",
      "@id": url + "#questions",
      numberOfItems: content.questions.length,
      itemListElement: content.questions.map(function (question, index) {
        return { "@type": "ListItem", position: index + 1, name: question.question, url: BASE + question.path };
      }),
    },
    {
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: BASE + "/" },
        { "@type": "ListItem", position: 2, name: "20 câu hỏi trước khi đi làm mỏ", item: url },
      ],
    },
    personNode(),
    organizationNode(),
  ];
  return "<!doctype html><html lang='vi'>" + pageHead("20 câu hỏi trước khi đi làm mỏ Quảng Ninh", content.hub.meta, url, graph) + "<body class='worker-question-page'><a class='network-skip' href='#noi-dung'>Đến nội dung chính</a>" + header() + "<main id='noi-dung'><section class='wq-hero wq-hub-hero'><div class='network-wrap wq-hero__grid'><div><p class='network-eyebrow'>HỎI GÌ TRƯỚC KHI ĐI LÀM MỎ?</p><h1>" + html(content.hub.title) + "</h1><p class='wq-hero__lead'>Mỗi câu trả lời đi thẳng vào điều người lao động cần biết và dẫn tới một trang chuẩn. Google, Bing và các hệ thống AI có thể tìm đúng nội dung thay vì ghép thông tin từ nhiều trang rời rạc.</p></div><aside class='wq-answer'><small>BẮT ĐẦU NHANH</small><strong>Liên hệ Thầy Linh · " + PHONE + "</strong><p>Kiểm tra điều kiện từ xa trước. Chưa cần gửi hồ sơ, chuyển tiền hoặc lên Quảng Ninh.</p><div class='wq-actions'><a class='wq-button wq-button--hot' href='https://zalo.me/0963048585' target='_blank' rel='noopener' data-contact='zalo' data-context='worker-question-hub-hero'>Nhắn Zalo</a></div></aside></div></section><section class='wq-section wq-section--soft'><div class='network-wrap wq-hub-groups'>" + groupsHtml + "</div></section><section class='wq-section'><div class='network-wrap'><div class='wq-section__heading'><p class='network-eyebrow'>ĐẦU MỐI CHỊU TRÁCH NHIỆM</p><h2>Thông tin có người thật để đối chiếu</h2></div><div class='wq-author'><img src='/assets/thay-linh-avatar.webp?v=3' alt='Nguyễn Tử Linh – Thầy Linh' width='80' height='80'><div><strong>Nguyễn Tử Linh (Thầy Linh)</strong><p>Trưởng phòng Tuyển sinh Miền Trung, Trung tâm Tuyển sinh, Giới thiệu việc làm, Trường Cao đẳng Than – Khoáng sản Việt Nam.</p><a href='/lien-he-di-lam-mo-than-quang-ninh/'>Xem cách liên hệ chính thức →</a></div></div></div></section></main>" + footer() + "<script src='/analytics.js?v=6' defer></script><script src='/mobile-core.js?v=1' defer></script><script src='/site-shell-20260803.js?v=3' defer></script></body></html>\n";
}

write("tuyen-tho-mo" + HUB_PATH + "index.html", hubPage());
for (const page of content.pages) write("tuyen-tho-mo/" + page.slug + "/index.html", deepPage(page));

const machineFeed = {
  version: content.version,
  updated_at: content.updated_at,
  publisher: {
    name: "Thầy Linh – Tuyển Thợ Mỏ",
    responsible_person: "Nguyễn Tử Linh",
    role: "Trưởng phòng Tuyển sinh Miền Trung",
    phone: PHONE_E164,
    url: BASE + "/tac-gia/nguyen-tu-linh/",
  },
  canonical_hub: BASE + HUB_PATH,
  questions: content.questions.map(function (question) {
    return {
      question: question.question,
      direct_answer: question.answer,
      category: question.group,
      canonical_url: BASE + question.path,
    };
  }),
};
write("tuyen-tho-mo/worker-questions.json", JSON.stringify(machineFeed, null, 2) + "\n");

let home = read("tuyen-tho-mo/index.html");
// worker-questions.css đã nằm trong home-content.css để không chặn lần vẽ đầu tiên.
home = home.replace(/\n\s*<section\b[^>]*data-worker-question-hub[^>]*>[\s\S]*?<\/section>\s*/g, "\n");
const homeBlock = "\n    <section class=\"home-worker-questions\" aria-labelledby=\"home-worker-questions-title\" data-worker-question-hub><div class=\"container\"><div class=\"home-worker-questions__head\"><div><p class=\"home-step\">Người lao động thường hỏi</p><h2 id=\"home-worker-questions-title\">Tìm đúng câu trả lời trước khi quyết định đi làm mỏ</h2></div><a href=\"" + HUB_PATH + "\">Xem đủ 20 câu hỏi →</a></div><div class=\"home-worker-questions__grid\"><a href=\"/lien-he-di-lam-mo-than-quang-ninh/\">Muốn đi làm mỏ than Quảng Ninh thì liên hệ với ai?</a><a href=\"/nguoi-tinh-xa-dang-ky-di-lam-mo-the-nao/\">Người ở tỉnh xa đăng ký thế nào?</a><a href=\"/di-lam-mo-than-can-chuan-bi-bao-nhieu-tien/\">Cần chuẩn bị bao nhiêu tiền?</a><a href=\"/hoc-xong-nghe-mo-lam-o-cong-ty-nao/#cong-viec\">Công việc thợ mỏ hầm lò là làm gì?</a><a href=\"/tho-mo-lam-may-tieng-mot-ngay/\">Thợ mỏ làm mấy tiếng một ngày?</a><a href=\"/lam-mo-than-co-duoc-dong-bao-hiem-khong/\">Làm mỏ than có được đóng bảo hiểm không?</a></div></div></section>\n";
home = replaceRequired(home, "\n    <nav class=\"home-content-shortcuts", homeBlock + "\n    <nav class=\"home-content-shortcuts", "cụm hỏi đáp trên trang chủ");
if (!home.includes("\"name\":\"20 câu hỏi trước khi đi làm mỏ\"")) {
  home = home.replace(
    "\"hasPart\":[",
    "\"hasPart\":[{\"@type\":\"CollectionPage\",\"name\":\"20 câu hỏi trước khi đi làm mỏ\",\"url\":\"" + BASE + HUB_PATH + "\"},",
  );
}
write("tuyen-tho-mo/index.html", home);

let contact = read("tuyen-tho-mo/lien-he-di-lam-mo-than-quang-ninh/index.html");
if (!contact.includes("/worker-questions.css?v=1")) {
  contact = contact.replace(
    "<link rel=\"stylesheet\" href=\"/contact-authority.css?v=1\">",
    "<link rel=\"stylesheet\" href=\"/contact-authority.css?v=1\">\n  <link rel=\"stylesheet\" href=\"/worker-questions.css?v=1\">",
  );
}
contact = contact.replace(/\n    <section class="contact-authority__section contact-authority__more-questions"[\s\S]*?<\/section>\n(?=\n    <section class="contact-authority__final")/, "");
const contactBlock = "\n    <section class=\"contact-authority__section contact-authority__more-questions\"><div class=\"network-wrap\"><p class=\"network-eyebrow\">CÒN BĂN KHOĂN?</p><h2>20 câu hỏi cần biết trước khi đi làm mỏ</h2><div class=\"wq-related\"><a href=\"" + HUB_PATH + "\">Xem điều kiện, học phí, hồ sơ, ca làm, bảo hiểm và nơi làm việc →</a><a href=\"/nguoi-tinh-xa-dang-ky-di-lam-mo-the-nao/\">Người tỉnh xa đăng ký thế nào? →</a><a href=\"/hoc-xong-nghe-mo-lam-o-cong-ty-nao/#cong-viec\">Công việc thợ mỏ hầm lò là gì? →</a></div></div></section>\n";
contact = replaceRequired(contact, "\n    <section class=\"contact-authority__final\">", contactBlock + "\n    <section class=\"contact-authority__final\">", "liên kết hỏi đáp từ trang liên hệ");
write("tuyen-tho-mo/lien-he-di-lam-mo-than-quang-ninh/index.html", contact);

let llms = read("tuyen-tho-mo/llms.txt");
llms = llms.replace(/\n## Bộ câu hỏi người lao động thường tìm[\s\S]*?(?=\n## )/, "");
const llmsLines = [
  "",
  "## Bộ câu hỏi người lao động thường tìm",
  "",
  "- Trang trung tâm: [20 câu hỏi trước khi đi làm mỏ Quảng Ninh](" + BASE + HUB_PATH + ").",
  "- Dữ liệu hỏi đáp JSON: [worker-questions.json](" + BASE + "/worker-questions.json).",
].concat(content.pages.map(function (page) {
  return "- [" + page.title + "](" + BASE + "/" + page.slug + "/): " + page.answer;
})).concat([
  "- Các câu đã có trang chuẩn về điều kiện, hồ sơ, học phí, thu nhập, an toàn và so sánh nghề được định tuyến từ trang trung tâm; không tạo trang lặp nội dung.",
  "",
]);
const llmsAnchor = llms.includes("\n## Trang trả lời theo nhu cầu tìm kiếm")
  ? "\n## Trang trả lời theo nhu cầu tìm kiếm"
  : "\n## Trang thông tin hiện hành";
llms = replaceRequired(llms, llmsAnchor, llmsLines.join("\n") + llmsAnchor, "bộ hỏi đáp trong llms.txt");
write("tuyen-tho-mo/llms.txt", llms);

let sitemap = read("tuyen-tho-mo/sitemap.xml");
const routes = [HUB_PATH].concat(content.pages.map(function (page) { return "/" + page.slug + "/"; }));
for (const route of routes) {
  const target = BASE + route;
  sitemap = sitemap.replace(new RegExp("\\s*<url><loc>" + target.replace(/[.*+?^()|[\]\\$]/g, "\\$&") + "<\\/loc>[\\s\\S]*?<\\/url>"), "");
}
const entries = routes.map(function (route) {
  const priority = route === HUB_PATH ? "0.9" : "0.8";
  return "  <url><loc>" + BASE + route + "</loc><lastmod>" + content.updated_at + "</lastmod><changefreq>weekly</changefreq><priority>" + priority + "</priority></url>";
}).join("\n") + "\n";
sitemap = replaceRequired(sitemap, "</urlset>", entries + "</urlset>", "URL hỏi đáp trong sitemap");
write("tuyen-tho-mo/sitemap.xml", sitemap);

console.log(JSON.stringify({
  hub_pages: 1,
  deep_pages: content.pages.length,
  questions: content.questions.length,
  machine_feed: "worker-questions.json",
}, null, 2));
