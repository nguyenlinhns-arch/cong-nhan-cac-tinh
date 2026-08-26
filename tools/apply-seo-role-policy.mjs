import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('tuyen-tho-mo');
const SITE = 'https://thaylinhtuyenthomo.vn';
const HOME = `${SITE}/`;
const JOB_PATH = '/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/';
const JOB_URL = `${SITE}${JOB_PATH}`;
const INCOME = '20–25 triệu đồng/tháng';
const INCOME_SHORT = '20–25 triệu/tháng';
const INCOME_CONDITION = 'khi hoàn thành định mức lao động';
const INCOME_SHORT_COMMITMENT = `${INCOME_SHORT} ${INCOME_CONDITION}`;
const review = JSON.parse(fs.readFileSync(path.resolve('content/recruitment-review-v10.json'), 'utf8'));
const REVIEW_DATE = review.reviewed_at;
const MODIFIED_DATE = review.verification_content_modified || REVIEW_DATE;
if (!/^\d{4}-\d{2}-\d{2}$/.test(REVIEW_DATE || '')) throw new Error('SEO role policy: reviewed_at is invalid');
if (!/^\d{4}-\d{2}-\d{2}$/.test(MODIFIED_DATE || '')) throw new Error('SEO role policy: verification_content_modified is invalid');

const policy = {
  updated_at: REVIEW_DATE,
  strategy: 'one primary organic recruitment page + one distinct job-intent page + one noindex paid landing',
  pages: {
    '/': {
      role: 'organic-core',
      index: true,
      primary_intent: 'tuyển thợ mỏ, thợ lò Quảng Ninh'
    },
    '/tuyen-tho-mo-quang-ninh/': {
      role: 'paid-landing',
      index: false,
      primary_intent: 'Google Ads conversion landing'
    },
    [JOB_PATH]: {
      role: 'organic-job-intent',
      index: true,
      primary_intent: 'việc làm công nhân mỏ hầm lò Quảng Ninh'
    },
    '/viec-lam-nganh-than/quang-ninh/': {
      role: 'legacy-redirect',
      index: false,
      canonical: JOB_PATH,
      redirect_to: JOB_PATH
    }
  }
};

function mustRead(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing page: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function setRobots(file, value) {
  let html = mustRead(file);
  const pattern = /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?\s*>/i;
  const tag = `<meta name="robots" content="${value}">`;
  html = pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
  fs.writeFileSync(file, html);
}

function normalizeIncome(html) {
  return html
    .replace(/Thu nhập\s+bình quân\s+20[–-]25 triệu đồng\/tháng(?:,?\s*tùy đơn vị, vị trí, ngày công và năng suất)?\.?/giu, `Thu nhập ${INCOME} ${INCOME_CONDITION}.`)
    .replace(/Bình quân\s+20[–-]25 triệu đồng\/tháng/giu, `${INCOME} ${INCOME_CONDITION}`)
    .replace(/Thu nhập\s+20[–-]25 triệu đồng\/tháng,?\s*tùy đơn vị, vị trí, ngày công và năng suất\.?/giu, `Thu nhập ${INCOME} ${INCOME_CONDITION}.`)
    .replace(/20[–-]25 triệu đồng\/tháng,?\s*tùy đơn vị, vị trí, ngày công và năng suất/giu, `${INCOME} ${INCOME_CONDITION}`)
    .replace(/Cam kết thu nhập\s+20[–-]25 triệu đồng\/tháng cho người lao động đáp ứng điều kiện\.?/giu, `Thu nhập ${INCOME} ${INCOME_CONDITION}.`);
}

function setHomeIntent(file) {
  let html = normalizeIncome(mustRead(file));
  html = html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (full, open, body, close) => {
    try {
      const data = JSON.parse(body);
      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      const webpage = nodes.find((node) => node?.['@id'] === `${HOME}#webpage`);
      if (webpage && !String(webpage.abstract || '').includes(INCOME_CONDITION)) {
        webpage.abstract = `${String(webpage.abstract || '').trim()} Thu nhập ${INCOME} ${INCOME_CONDITION}.`.trim();
      }
      return `${open}${JSON.stringify(data)}${close}`;
    } catch {
      return full;
    }
  });
  html = html.replace(
    /<div class="home-v6-income">[\s\S]*?<\/div>/i,
    `<div class="home-v6-income"><small>HOÀN THÀNH ĐỊNH MỨC LAO ĐỘNG</small><strong>${INCOME_SHORT_COMMITMENT}</strong></div>`
  );

  const decisionActions = '<div class="home-v6-decision__actions">';
  const contextualJobLink = `<a href="${JOB_PATH}">Xem việc làm công nhân mỏ hầm lò</a>`;
  if (!html.includes(contextualJobLink) && html.includes(decisionActions)) {
    html = html.replace(decisionActions, `${decisionActions}${contextualJobLink}`);
  }

  fs.writeFileSync(file, html);
}

function setPaidIntent(file) {
  let html = normalizeIncome(mustRead(file));
  html = html.replace(
    /<span><strong>20[–-]25 triệu\/tháng(?: khi hoàn thành định mức lao động)?<\/strong>[^<]*<\/span>/i,
    `<span><strong>${INCOME_SHORT_COMMITMENT}</strong></span>`
  );
  fs.writeFileSync(file, html);
}

function setJobIntent(file) {
  let html = normalizeIncome(mustRead(file));
  html = html.replace(/<title>[^<]*<\/title>/i, '<title>Việc làm công nhân mỏ hầm lò Quảng Ninh | 3 nghề 2026</title>');
  html = html.replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="Thông tin việc làm công nhân mỏ hầm lò tại Quảng Ninh: 3 nghề khai thác, xây dựng và cơ điện mỏ; người chưa có kinh nghiệm được đào tạo trước khi nhận việc.">');
  html = html.replace(/<meta property="og:title" content="[^"]*">/i, '<meta property="og:title" content="Việc làm công nhân mỏ hầm lò Quảng Ninh 2026">');
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/i, '<meta name="twitter:title" content="Việc làm công nhân mỏ hầm lò Quảng Ninh 2026">');
  html = html.replace(/<h1 id="job-title">[\s\S]*?<\/h1>/i, '<h1 id="job-title">Việc làm công nhân mỏ hầm lò Quảng Ninh: <br><em>3 nghề</em>, đào tạo từ đầu</h1>');
  html = html.replace(/"name":"Tuyển công nhân mỏ, thợ lò tại Quảng Ninh năm 2026"/i, '"name":"Việc làm công nhân mỏ hầm lò Quảng Ninh năm 2026"');
  html = html.replace(/"dateModified":"[^"]*"/i, `"dateModified":"${MODIFIED_DATE}"`);
  html = html.replace(/"lastReviewed":"[^"]*"/i, `"lastReviewed":"${REVIEW_DATE}"`);
  html = html.replace(
    /(<span class="income-qualified"><b[^>]*>)[\s\S]*?(<\/b><\/span>)/i,
    `$1${INCOME_SHORT_COMMITMENT}$2`
  );
  html = html.replace(
    /<div><dt>Thu nhập sau đào tạo<\/dt><dd>[\s\S]*?<\/dd><\/div>/i,
    `<div><dt>Thu nhập sau đào tạo</dt><dd>${INCOME_SHORT_COMMITMENT}</dd></div>`
  );
  html = html.replace(
    /(<strong class="qualified-income"[^>]*>)[\s\S]*?(<\/strong>)/i,
    `$1${INCOME_SHORT_COMMITMENT}$2`
  );
  html = html.replace(
    /("name":"Thu nhập sau đào tạo là bao nhiêu\?","acceptedAnswer":\{"@type":"Answer","text":")[^"]*("\}\})/i,
    `$1Thu nhập ${INCOME} ${INCOME_CONDITION}.$2`
  );

  const breadcrumb = '<nav class="breadcrumb" aria-label="Đường dẫn trang"><a href="../../">Trang chủ</a><span>›</span><strong>Việc làm ngành mỏ 2026</strong></nav>';
  const organicLink = '<p class="job-organic-parent"><a href="/">Xem trang tuyển thợ mỏ, thợ lò Quảng Ninh →</a></p>';
  if (!html.includes('job-organic-parent') && html.includes(breadcrumb)) {
    html = html.replace(breadcrumb, `${breadcrumb}\n    ${organicLink}`);
  }

  fs.writeFileSync(file, html);
}

function writeLegacyRedirect(file) {
  const html = `<!doctype html>
<html lang="vi" data-legacy-redirect>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#0b222b">
  <meta name="robots" content="noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <title>Việc làm ngành Than Quảng Ninh – chuyển đến trang công nhân mỏ</title>
  <meta name="description" content="Trang cũ đã được hợp nhất về trang việc làm công nhân mỏ hầm lò Quảng Ninh để tránh nội dung trùng lặp.">
  <link rel="canonical" href="${JOB_URL}">
  <link rel="author" href="/tac-gia/nguyen-tu-linh/">
  <meta http-equiv="refresh" content="0;url=${JOB_PATH}">
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="stylesheet" href="/mobile-core.css?v=1">
  <link rel="stylesheet" href="/fonts.css?v=2">
  <style>body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f5f7f7;color:#15323a;display:grid;min-height:100vh;place-items:center;padding:24px;box-sizing:border-box}main{max-width:620px;background:#fff;border:1px solid #dce5e5;border-radius:18px;padding:28px;box-shadow:0 12px 36px rgba(15,55,64,.08)}h1{font-size:clamp(24px,5vw,34px);line-height:1.2;margin:0 0 14px}p{line-height:1.65;margin:0 0 18px}a{display:inline-block;background:#0b5965;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px}</style>
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${JOB_URL}#webpage`,
    url: JOB_URL,
    name: 'Việc làm ngành Than Quảng Ninh – chuyển đến trang công nhân mỏ',
    dateModified: MODIFIED_DATE,
    lastReviewed: REVIEW_DATE,
    reviewedBy: {'@id': `${SITE}/tac-gia/nguyen-tu-linh/#person`},
    author: {'@id': `${SITE}/tac-gia/nguyen-tu-linh/#person`},
    publisher: {'@id': `${SITE}/#organization`},
    publishingPrinciples: `${SITE}/nguyen-tac-bien-tap/`,
    isPartOf: {'@id': `${SITE}/#website`},
  })}</script>
</head>
<body><a class="skip-link" href="#noi-dung">Bỏ qua điều hướng</a><header class="site-header"><div class="site-header__inner"><a class="brand" href="/"><img class="brand-mark" src="/assets/thay-linh-avatar.webp?v=3" alt="" width="45" height="45"><span><strong>Thầy Linh</strong><small>Tuyển Thợ Mỏ</small></span></a><a class="header-cta" href="/kiem-tra-dieu-kien/">Kiểm tra điều kiện</a></div></header>
  <main id="noi-dung">
    <h1>Thông tin việc làm ngành Than Quảng Ninh đã được hợp nhất</h1>
    <p>Để tránh nhiều trang cùng cạnh tranh một nhóm từ khóa, nội dung này được chuyển về trang chuyên biệt về việc làm công nhân mỏ hầm lò tại Quảng Ninh.</p>
    <a href="${JOB_PATH}">Xem việc làm công nhân mỏ hầm lò Quảng Ninh</a>
    <p>Khai thác và xây dựng mỏ học 2–3 tháng; kỹ thuật cơ điện mỏ hầm lò học 10 tháng. <a href="/thong-tin-tuyen-tho-mo/">Đối chiếu thông tin tuyển đang áp dụng</a>.</p>
    <p><a href="/viec-lam-nganh-than/quang-ninh/xa-phuong/">Xem danh mục tuyển thợ mỏ theo xã, phường Quảng Ninh</a>.</p>
  </main>
  <script>location.replace('${JOB_PATH}' + location.search + location.hash);</script>
  <script src="/mobile-core.js?v=1" defer></script>
  <script src="/analytics.js?v=6" defer></script>
</body>
</html>
`;
  fs.writeFileSync(file, html);
}

const homeFile = path.join(root, 'index.html');
const paidFile = path.join(root, 'tuyen-tho-mo-quang-ninh', 'index.html');
const jobFile = path.join(root, 'viec-lam', 'cong-nhan-mo-ham-lo-quang-ninh', 'index.html');
const legacyProvinceFile = path.join(root, 'viec-lam-nganh-than', 'quang-ninh', 'index.html');

setRobots(homeFile, 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
setHomeIntent(homeFile);
setRobots(paidFile, 'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
setPaidIntent(paidFile);
setRobots(jobFile, 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
setJobIntent(jobFile);
writeLegacyRedirect(legacyProvinceFile);

fs.mkdirSync('content', { recursive: true });
fs.writeFileSync('content/seo-role-policy-2026.json', JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ status: 'ok', home: HOME, job: JOB_URL, reviewDate: REVIEW_DATE, modifiedDate: MODIFIED_DATE, policy }, null, 2));
