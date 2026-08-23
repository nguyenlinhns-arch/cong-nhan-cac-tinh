import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('tuyen-tho-mo');
const policy = {
  updated_at: '2026-08-23',
  core_intent: 'tuyển thợ mỏ Quảng Ninh',
  pages: {
    '/': { role: 'organic-core', index: true },
    '/tuyen-tho-mo-quang-ninh/': { role: 'paid-landing', index: false },
    '/viec-lam/cong-nhan-mo-ham-lo-quang-ninh/': { role: 'job-hub', index: true },
    '/viec-lam-nganh-than/quang-ninh/': { role: 'province-hub', index: true }
  }
};

function setRobots(file, value) {
  if (!fs.existsSync(file)) throw new Error(`Missing page: ${file}`);
  let html = fs.readFileSync(file, 'utf8');
  const pattern = /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?\s*>/i;
  const tag = `<meta name="robots" content="${value}">`;
  html = pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}</head>`);
  fs.writeFileSync(file, html);
}

setRobots(path.join(root, 'index.html'), 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
setRobots(path.join(root, 'tuyen-tho-mo-quang-ninh', 'index.html'), 'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
setRobots(path.join(root, 'viec-lam', 'cong-nhan-mo-ham-lo-quang-ninh', 'index.html'), 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
setRobots(path.join(root, 'viec-lam-nganh-than', 'quang-ninh', 'index.html'), 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');

fs.mkdirSync('content', { recursive: true });
fs.writeFileSync('content/seo-role-policy-2026.json', JSON.stringify(policy, null, 2) + '\n');
console.log(JSON.stringify({ status: 'ok', policy }, null, 2));
