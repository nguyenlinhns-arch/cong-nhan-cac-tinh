import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('tuyen-tho-mo');
const SITE = 'https://thaylinhtuyenthomo.vn';
const HOME = `${SITE}/`;
const JOB_PATH = '/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/';
const JOB_URL = `${SITE}${JOB_PATH}`;

const policy = {
  updated_at: '2026-08-23',
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

function setHomeIntent(file) {
  let html = mustRead(file);
  html = html.replace(
    /<div class="home-v6-income">[\s\S]*?<\/div>/i,
    '<div class="home-v6-income"><small>HOÀN THÀNH ĐỊNH MỨC LAO ĐỘNG</small><strong>20–25 triệu/tháng</strong></div>'
  );

  const decisionActions = '<div class="home-v6-decision__actions">';
  const contextualJobLink = `<a href="${JOB_PATH}">Xem việc làm công nhân mỏ hầm lò</a>`;
  if (!html.includes(contextualJobLink) && html.includes(decisionActions)) {
    html = html.replace(decisionActions, `${decisionActions}${contextualJobLink}`);
  }

  fs.writeFileSync(file, html);
}

function setJobIntent(file) {
  let html = mustRead(file);
  html = html.replace(/<title>[^<]*<\/title>/i, '<title>Việc làm công nhân mỏ hầm lò Quảng Ninh | 3 nghề 2026</title>');
  html = html.replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="Thông tin việc làm công nhân mỏ hầm lò tại Quảng Ninh: 3 nghề khai thác, xây dựng và cơ điện mỏ; người chưa có kinh nghiệm được đào tạo trước khi nhận việc.">');
  html = html.replace(/<meta property="og:title" content="[^"]*">/i, '<meta property="og:title" content="Việc làm công nhân mỏ hầm lò Quảng Ninh 2026">');
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/i, '<meta name="twitter:title" content="Việc làm công nhân mỏ hầm lò Quảng Ninh 2026">');
  html = html.replace(/<h1 id="job-title">[\s\S]*?<\/h1>/i, '<h1 id="job-title">Việc làm công nhân mỏ hầm lò Quảng Ninh: <br><em>3 nghề</em>, đào tạo từ đầu</h1>');

  const breadcrumb = '<nav class="breadcrumb" aria-label="Đường dẫn trang"><a href="../../">Trang chủ</a><span>›</span><strong>Việc làm ngành mỏ 2026</strong></nav>';
  const organicLink = '<p class="job-organic-parent"><a href="/">Xem trang tuyển thợ mỏ, thợ lò Quảng Ninh →</a></p>';
  if (!html.includes('job-organic-parent') && html.includes(breadcrumb)) {
    html = html.replace(breadcrumb, `${breadcrumb}\n    ${organicLink}`);
  }

  fs.writeFileSync(file, html);
}

function writeLegacyRedirect(file) {
  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <title>Việc làm ngành Than Quảng Ninh – chuyển đến trang công nhân mỏ</title>
  <meta name="description" content="Trang cũ đã được hợp nhất về trang việc làm công nhân mỏ hầm lò Quảng Ninh để tránh nội dung trùng lặp.">
  <link rel="canonical" href="${JOB_URL}">
  <meta http-equiv="refresh" content="0;url=${JOB_PATH}">
  <meta property="og:url" content="${JOB_URL}">
  <meta property="og:title" content="Việc làm công nhân mỏ hầm lò Quảng Ninh 2026">
  <meta property="og:description" content="Xem 3 nghề mỏ hầm lò, điều kiện, đào tạo và cách đăng ký việc làm tại Quảng Ninh.">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/fonts.css?v=2">
  <style>body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f5f7f7;color:#15323a;display:grid;min-height:100vh;place-items:center;padding:24px;box-sizing:border-box}main{max-width:620px;background:#fff;border:1px solid #dce5e5;border-radius:18px;padding:28px;box-shadow:0 12px 36px rgba(15,55,64,.08)}h1{font-size:clamp(24px,5vw,34px);line-height:1.2;margin:0 0 14px}p{line-height:1.65;margin:0 0 18px}a{display:inline-block;background:#0b5965;color:#fff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px}</style>
</head>
<body>
  <main>
    <h1>Thông tin việc làm ngành Than Quảng Ninh đã được hợp nhất</h1>
    <p>Để tránh nhiều trang cùng cạnh tranh một nhóm từ khóa, nội dung này được chuyển về trang chuyên biệt về việc làm công nhân mỏ hầm lò tại Quảng Ninh.</p>
    <a href="${JOB_PATH}">Xem việc làm công nhân mỏ hầm lò Quảng Ninh</a>
  </main>
  <script>location.replace('${JOB_PATH}');</script>
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
setRobots(jobFile, 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
setJobIntent(jobFile);
writeLegacyRedirect(legacyProvinceFile);

fs.mkdirSync('content', { recursive: true });
fs.writeFileSync('content/seo-role-policy-2026.json', JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ status: 'ok', home: HOME, job: JOB_URL, policy }, null, 2));
