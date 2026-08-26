import fs from "node:fs";
import path from "node:path";

const root = path.resolve("tuyen-tho-mo");
const base = "https://thaylinhtuyenthomo.vn";
const pageUrl = `${base}/nghe-mo-ham-lo/`;
const master = JSON.parse(fs.readFileSync(path.resolve("operations/job-posting-master-2026.json"), "utf8"));
const source = master.source_documents.find((item) => item.id === "554-HD-CDTKV");
const profiles = master.occupation_profiles;

if (!source) throw new Error("Thiếu nguồn Hướng dẫn 554 trong dữ liệu tuyển sinh chuẩn");
if (!Array.isArray(profiles) || profiles.length !== 3) throw new Error("Nguồn dữ liệu nghề phải có đủ ba nghề mỏ hầm lò");

const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const profilePath = (profile) => profile.active_intake
  ? `/viec-lam/${profile.slug}/`
  : "/lien-he-di-lam-mo-than-quang-ninh/";

const profileCards = profiles.map((profile, profileIndex) => {
  const status = profile.active_intake ? "ĐANG TIẾP NHẬN" : "TƯ VẤN THEO CHỈ TIÊU TỪNG ĐỢT";
  const tasks = profile.responsibilities.map((item, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${esc(item)}</span></li>`).join("");
  const equipment = profile.equipment.map((item) => `<li>${esc(item)}</li>`).join("");
  const action = profile.active_intake ? "Xem tin tuyển dụng" : "Hỏi chỉ tiêu nghề";
  return `<article class="wq-panel occupation-profile" id="${esc(profile.slug)}">
    <p class="network-eyebrow">NGHỀ ${String(profileIndex + 1).padStart(2, "0")} · ${status}</p>
    <h2>${esc(profile.title)}</h2>
    <p class="wq-summary">${esc(profile.summary)}</p>
    <div class="wq-two">
      <div><h3>Công việc chủ yếu</h3><ol class="occupation-task-list">${tasks}</ol></div>
      <div><h3>Thiết bị, dụng cụ thường dùng</h3><ul>${equipment}</ul><h3>Bối cảnh làm việc</h3><p>${esc(profile.work_context)}</p></div>
    </div>
    <div class="wq-actions"><span class="wq-button">Thời gian học: ${esc(profile.training_duration_current)}</span><a class="wq-button wq-button--hot" href="${profilePath(profile)}">${action}</a></div>
  </article>`;
}).join("");

const faq = [
  ["Nghề mỏ hầm lò gồm những nghề gì?", "Ba nhóm nghề chính trong nguồn Hướng dẫn 554 là kỹ thuật khai thác mỏ hầm lò, kỹ thuật xây dựng mỏ hầm lò và kỹ thuật cơ điện mỏ hầm lò."],
  ["Khai thác mỏ và xây dựng mỏ khác nhau thế nào?", "Khai thác mỏ tập trung vào các công đoạn khai thác, thu hồi và vận chuyển than tại khu vực sản xuất. Xây dựng mỏ tập trung đào, chống giữ, gia cố và duy trì đường lò phục vụ sản xuất."],
  ["Kỹ thuật cơ điện mỏ hầm lò làm gì?", "Người học nghề cơ điện thực hiện lắp đặt, vận hành, bảo dưỡng và sửa chữa hệ thống cơ khí, điện, vận tải, chiếu sáng, thông tin liên lạc và thiết bị cơ giới phục vụ mỏ."],
  ["Mức lương sau khi học nghề mỏ là bao nhiêu?", master.income_commitment + "."],
];

const structured = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Nghề mỏ hầm lò gồm những nghề gì? Mô tả công việc",
      description: "Mô tả công việc của nghề khai thác, xây dựng và cơ điện mỏ hầm lò; Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.",
      inLanguage: "vi-VN",
      dateModified: master.effective_from,
      isPartOf: { "@id": `${base}/#website` },
      author: { "@id": `${base}/tac-gia/nguyen-tu-linh/#person` },
      publisher: { "@id": `${base}/#organization` },
      mainEntity: { "@id": `${pageUrl}#occupations` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    },
    {
      "@type": "ItemList",
      "@id": `${pageUrl}#occupations`,
      numberOfItems: profiles.length,
      itemListElement: profiles.map((profile, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Occupation",
          "@id": `${pageUrl}#${profile.slug}`,
          name: profile.title,
          description: profile.summary,
          responsibilities: profile.responsibilities.join("; "),
          skills: "Kiến thức nghề, phối hợp tổ đội, sử dụng thiết bị đúng quy trình và tuân thủ an toàn",
          occupationLocation: { "@type": "Country", name: "Việt Nam" },
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Nghề mỏ hầm lò", item: pageUrl },
      ],
    },
  ],
};

const page = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#063f48">
<title>Nghề mỏ hầm lò gồm những nghề gì? Mô tả công việc</title>
<meta name="description" content="Mô tả công việc của nghề khai thác, xây dựng và cơ điện mỏ hầm lò; Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="author" content="Nguyễn Tử Linh"><link rel="author" href="/tac-gia/nguyen-tu-linh/"><link rel="canonical" href="${pageUrl}">
<link rel="icon" href="/favicon.ico"><link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"><link rel="manifest" href="/manifest.webmanifest">
<meta property="og:type" content="website"><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Thầy Linh – Tuyển Thợ Mỏ"><meta property="og:title" content="Ba nghề mỏ hầm lò: công việc cụ thể"><meta property="og:description" content="Mô tả ba nghề mỏ hầm lò; Thu nhập 20–25 triệu đồng/tháng khi hoàn thành định mức lao động."><meta property="og:url" content="${pageUrl}"><meta property="og:image" content="${base}/assets/og-cover-luong-25-trieu-v4.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Ba nghề mỏ hầm lò: công việc cụ thể"><meta name="twitter:description" content="Mô tả công việc nghề khai thác, xây dựng và cơ điện mỏ hầm lò."><meta name="twitter:image" content="${base}/assets/og-cover-luong-25-trieu-v4.jpg">
<link rel="stylesheet" href="/content-network.css?v=2"><link rel="stylesheet" href="/worker-questions.css?v=2"><link rel="stylesheet" href="/mobile-core.css?v=1"><link rel="stylesheet" href="/fonts.css?v=2"><link rel="stylesheet" href="/mobile-polish-20260803.css?v=3"><link rel="stylesheet" href="/site-shell-20260803.css?v=3">
<script type="application/ld+json">${JSON.stringify(structured)}</script></head>
<body class="worker-question-page occupation-text-only"><a class="network-skip" href="#noi-dung">Đến nội dung chính</a><header class="network-header"><div class="network-wrap network-header__inner"><a class="network-brand" href="/" aria-label="Trang chủ Thầy Linh"><img src="/assets/thay-linh-avatar.webp?v=3" alt="" width="44" height="44"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><nav class="network-nav" aria-label="Thông tin nghề mỏ"><a href="/hoi-dap-di-lam-mo-than-quang-ninh/">20 câu hỏi</a><a href="/thong-tin-tuyen-tho-mo/">Thông tin chuẩn</a><a href="/viec-lam-nganh-than/">Theo tỉnh</a><a href="/cam-nang-nghe-mo/">Cẩm nang</a></nav><a class="network-apply" href="/kiem-tra-dieu-kien/" data-contact="condition" data-context="occupation-header">Kiểm tra điều kiện</a></div></header>
<main id="noi-dung"><section class="wq-hero"><div class="network-wrap wq-hero__grid"><div><p class="network-eyebrow">MÔ TẢ NGHỀ ĐÃ ĐỐI CHIẾU</p><h1>Nghề mỏ hầm lò gồm những nghề gì?</h1><p class="wq-hero__lead">Ba nhóm nghề đang tiếp nhận gồm <strong>kỹ thuật khai thác mỏ hầm lò</strong>, <strong>kỹ thuật xây dựng mỏ hầm lò</strong> và <strong>kỹ thuật cơ điện mỏ hầm lò</strong>. Mỗi nghề đảm nhận một mắt xích khác nhau trong dây chuyền sản xuất, nhưng đều cần được đào tạo bài bản, phối hợp tổ đội và tuân thủ quy trình.</p><div class="wq-actions"><a class="wq-button wq-button--hot" href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a><a class="wq-button" href="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/">Xem tin tuyển dụng</a></div></div><aside class="wq-answer"><small>THU NHẬP HIỆN HÀNH</small><strong>20–25 triệu đồng/tháng khi hoàn thành định mức lao động</strong><p>Khai thác mỏ và xây dựng mỏ học 2–3 tháng; cơ điện mỏ học 10 tháng.</p></aside></div></section>
<section class="wq-section"><div class="network-wrap"><div class="wq-section__heading"><p class="network-eyebrow">CHỌN NGHỀ THEO CÔNG VIỆC THỰC TẾ</p><h2>Đối chiếu từng nghề trước khi đăng ký</h2></div>${profileCards}</div></section>
<section class="wq-section wq-section--soft"><div class="network-wrap"><div class="wq-section__heading"><p class="network-eyebrow">NGUỒN DỮ LIỆU CHUẨN</p><h2>Mô tả nghề được lấy từ đâu?</h2></div><div class="wq-panel"><p><strong>${esc(source.title)}</strong>, số ${esc(source.number)}, ngày 22/02/2022 do ${esc(source.issuer)} ban hành được dùng để chuẩn hóa tên nghề, mục tiêu nghề, công việc, thiết bị và bối cảnh làm việc.</p><p>Điều kiện tuyển sinh, thời gian học, chế độ và mức lương trên website được cập nhật theo thông tin đang áp dụng năm 2026. Mức lương thống nhất là <strong>20–25 triệu đồng/tháng khi hoàn thành định mức lao động</strong>.</p></div></div></section>
<section class="wq-section"><div class="network-wrap wq-faq"><p class="network-eyebrow">CÂU HỎI THƯỜNG GẶP</p><h2>Hiểu rõ nghề trước khi lựa chọn</h2>${faq.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}</div></section>
<section class="wq-final"><div class="network-wrap"><div><h2>Chưa biết nghề nào phù hợp?</h2><p>Gửi năm sinh, chiều cao, cân nặng, sức khỏe và nghề đang quan tâm để Thầy Linh kiểm tra điều kiện ban đầu.</p></div><div class="wq-actions"><a class="wq-button wq-button--hot" href="https://zalo.me/0963048585" target="_blank" rel="noopener" data-contact="zalo" data-context="occupation-final">Nhắn Zalo</a><a class="wq-button" href="tel:+84963048585" data-contact="phone" data-context="occupation-final">Gọi 096 304 8585</a></div></div></section></main>
<footer class="network-footer"><div class="network-wrap network-footer__inner"><div><strong>Thầy Linh – Tuyển Thợ Mỏ</strong><p>Tư vấn học nghề mỏ và việc làm ngành Than tại Quảng Ninh.</p></div><div><a href="/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/">Tin tuyển dụng</a><a href="/hoc-nghe-mo-tai-quang-ninh/">Học nghề mỏ</a><a href="/ho-so-nhap-hoc/">Hồ sơ nhập học</a></div><div><a href="/tac-gia/nguyen-tu-linh/">Người phụ trách</a><a href="/nguyen-tac-bien-tap/">Nguyên tắc biên tập</a></div></div></footer><script src="/analytics.js?v=6" defer></script><script src="/mobile-core.js?v=1" defer></script><script src="/site-shell-20260803.js?v=3" defer></script></body></html>`;

const publicProfiles = {
  version: 1,
  updated_at: master.updated_at,
  canonical_page: pageUrl,
  source: {
    id: source.id,
    number: source.number,
    title: source.title,
    issuer: source.issuer,
    issued_date: source.issued_date,
    usage_scope: source.usage_scope,
  },
  current_income: master.income_commitment,
  profiles,
};

const pageDirectory = path.join(root, "nghe-mo-ham-lo");
fs.mkdirSync(pageDirectory, { recursive: true });
fs.writeFileSync(path.join(pageDirectory, "index.html"), page);
fs.writeFileSync(path.join(root, "occupations.json"), `${JSON.stringify(publicProfiles, null, 2)}\n`);
console.log(JSON.stringify({ page: "/nghe-mo-ham-lo/", profiles: profiles.length, data: "/occupations.json" }));
